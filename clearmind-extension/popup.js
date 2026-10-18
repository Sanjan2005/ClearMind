function prettyDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
async function render() {
  const state = await chrome.runtime.sendMessage({ type: 'CLEARMIND_GET_STATE' });
  if (!state || state.ok === false) return;
  document.getElementById('score').textContent = state.score;
  document.getElementById('streak').textContent = state.currentStreak;
  document.getElementById('best').textContent = state.bestStreak;
  document.getElementById('blocked').textContent = state.totalBlocked;
  document.getElementById('progress').style.width = `${Math.min(100, (state.score / 30) * 100)}%`;
  const events = document.getElementById('events');
  if (!state.recentEvents.length) {
    events.textContent = 'No blocked attempts recorded yet. Keep going!';
    return;
  }
  events.replaceChildren();
  state.recentEvents.slice(0, 5).forEach(event => {
    const row = document.createElement('div');
    row.className = 'event';
    const label = document.createElement('span');
    label.textContent = event.source === 'search' ? 'Explicit search blocked' : 'Adult domain blocked';
    const date = document.createElement('span');
    date.textContent = prettyDate(event.date);
    row.append(label, date);
    events.append(row);
  });
}
render().catch(() => {});
