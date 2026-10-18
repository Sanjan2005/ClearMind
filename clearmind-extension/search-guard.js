(async () => {
  try {
    const url = new URL(window.location.href);
    const host = url.hostname.toLowerCase();
    let query = '';
    if (host.includes('google.')) query = url.searchParams.get('q') || '';
    else if (host.includes('bing.com')) query = url.searchParams.get('q') || '';
    else if (host.includes('duckduckgo.com')) query = url.searchParams.get('q') || '';
    else if (host.includes('search.yahoo.com')) query = url.searchParams.get('p') || '';
    else if (host.includes('search.brave.com')) query = url.searchParams.get('q') || '';

    if (!query.trim()) return;
    const normalized = query.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

    // Educational/medical context is an explicit exception unless the query also contains a strong explicit-content signal.
    const educational = /\b(sex education|sexual health|reproductive health|anatomy|medical|clinical|textbook|biology|pregnancy|contraception|std testing|sti testing|consent education|breast cancer|prostate cancer|medical illustration)\b/i.test(normalized);
    const explicit = /\b(porn|pornography|xxx|hentai|adult videos?|sex videos?|nude (pics|pictures|photos)|naked (pics|pictures|photos)|explicit (videos?|images?)|erotic videos?|live cam girls?|free porn|uncensored porn|onlyfans leaks?)\b/i.test(normalized);
    if (!explicit || (educational && !/\b(porn|pornography|xxx|hentai|sex videos?|nude pics|explicit videos?)\b/i.test(normalized))) return;

    // Do not persist the query itself. The block page records only the event category.
    await chrome.runtime.sendMessage({ type: 'CLEARMIND_BLOCKED', source: 'search' }).catch(() => null);
    window.location.replace(chrome.runtime.getURL('blocked.html?source=search'));
  } catch (_) {
    // Fail open if URL parsing or classification fails; avoid breaking ordinary browsing.
  }
})();
