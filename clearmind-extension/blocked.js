(async () => {
  const source = new URLSearchParams(location.search).get('source') || 'domain';
  if (source === 'domain') {
    await chrome.runtime.sendMessage({ type: 'CLEARMIND_BLOCKED', source: 'domain' }).catch(() => null);
  }
  const state = await chrome.runtime.sendMessage({ type: 'CLEARMIND_GET_STATE' }).catch(() => null);
  if (state) {
    document.getElementById('score').textContent = state.score ?? 0;
    document.getElementById('streak').textContent = state.currentStreak ?? 0;
  }
  document.getElementById('backButton').addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.href = 'https://www.google.com/';
  });
})();
