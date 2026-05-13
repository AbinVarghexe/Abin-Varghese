const lottieDataCache = new Map<string, unknown>();
const lottieRequestCache = new Map<string, Promise<unknown>>();
const MAX_LOTTIE_CACHE_ENTRIES = 20;

function validateLottieUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function setCachedLottieData(url: string, data: unknown) {
  if (!lottieDataCache.has(url) && lottieDataCache.size >= MAX_LOTTIE_CACHE_ENTRIES) {
    const firstKey = lottieDataCache.keys().next().value;
    if (firstKey) {
      lottieDataCache.delete(firstKey);
    }
  }
  lottieDataCache.set(url, data);
}

export function getCachedLottieData(url: string) {
  return lottieDataCache.get(url);
}

export function loadLottieData(url: string): Promise<unknown> {
  if (!validateLottieUrl(url)) {
    return Promise.reject(new Error(`Invalid lottie url: ${url}`));
  }

  if (lottieDataCache.has(url)) {
    return Promise.resolve(lottieDataCache.get(url));
  }

  const cachedRequest = lottieRequestCache.get(url);
  if (cachedRequest) {
    return cachedRequest;
  }

  const request = fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch lottie data from ${url}: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      setCachedLottieData(url, data);
      return data;
    })
    .finally(() => {
      lottieRequestCache.delete(url);
    });

  lottieRequestCache.set(url, request);
  return request;
}
