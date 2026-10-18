// ClearMind local tracker. Stores dates and counts only; never stores search text.
const DEFAULT_STATE = {
  initialized: false,
  lastProcessedDate: null,
  score: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalBlocked: 0,
  dailyAttempts: {},
  dailyBlocked: {},
  recentEvents: []
};

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dateFromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function addDays(key, amount) {
  const date = dateFromKey(key);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
}

async function getState() {
  const stored = await chrome.storage.local.get('clearmindState');
  const state = { ...DEFAULT_STATE, ...(stored.clearmindState || {}) };
  const today = localDateKey();
  if (!state.initialized) {
    state.initialized = true;
    state.lastProcessedDate = today;
    await saveState(state);
  } else {
    await rollForward(state, today);
  }
  return state;
}

async function saveState(state) {
  await chrome.storage.local.set({ clearmindState: state });
}

async function rollForward(state, today) {
  if (!state.lastProcessedDate) {
    state.lastProcessedDate = today;
    await saveState(state);
    return;
  }
  let cursor = state.lastProcessedDate;
  // Process each completed calendar day, including days when the browser was closed.
  while (cursor < today) {
    if ((state.dailyAttempts[cursor] || 0) === 0) {
      state.score += 1;
      state.currentStreak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
    } else {
      state.currentStreak = 0;
    }
    cursor = addDays(cursor, 1);
  }
  state.lastProcessedDate = today;
  await saveState(state);
}

async function recordAttempt(source = 'search') {
  const state = await getState();
  const today = localDateKey();
  const count = state.dailyAttempts[today] || 0;
  state.dailyAttempts[today] = count + 1;
  state.dailyBlocked[today] = (state.dailyBlocked[today] || 0) + 1;
  state.totalBlocked += 1;
  // Apply only one -5 penalty per calendar day; never allow a negative score.
  if (count === 0) state.score = Math.max(0, state.score - 5);
  state.currentStreak = 0;
  state.recentEvents.unshift({ date: today, type: 'blocked', source });
  state.recentEvents = state.recentEvents.slice(0, 12);
  await saveState(state);
  return state;
}

async function getDashboardState() {
  const state = await getState();
  return {
    score: state.score,
    currentStreak: state.currentStreak,
    bestStreak: state.bestStreak,
    totalBlocked: state.totalBlocked,
    todayBlocked: state.dailyBlocked[localDateKey()] || 0,
    recentEvents: state.recentEvents
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'CLEARMIND_BLOCKED') {
    recordAttempt(message.source).then(state => sendResponse({ ok: true, score: state.score })).catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (message?.type === 'CLEARMIND_GET_STATE') {
    getDashboardState().then(sendResponse).catch(() => sendResponse({ ok: false }));
    return true;
  }
});
