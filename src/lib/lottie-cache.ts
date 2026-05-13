type LottieData = Record<string, unknown>;

const lottieDataCache = new Map<string, LottieData>();
const lottieRequestCache = new Map<string, Promise<LottieData>>();
const MAX_LOTTIE_CACHE_ENTRIES = 20;

function validateLottieUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function touchCachedLottieData(url: string) {
  const cached = lottieDataCache.get(url);
  if (cached !== undefined) {
    lottieDataCache.delete(url);
    lottieDataCache.set(url, cached);
  }
  return cached;
}

function setCachedLottieData(url: string, data: LottieData) {
  if (!lottieDataCache.has(url) && lottieDataCache.size >= MAX_LOTTIE_CACHE_ENTRIES) {
    const firstKey = lottieDataCache.keys().next().value;
    if (firstKey !== undefined) {
      lottieDataCache.delete(firstKey);
    }
  }
  lottieDataCache.set(url, data);
}

export function getCachedLottieData(url: string) {
  return touchCachedLottieData(url);
}

export function loadLottieData(url: string): Promise<LottieData> {
  if (!validateLottieUrl(url)) {
    return Promise.reject(new Error(`Invalid lottie url: ${url}`));
  }

  const cachedData = touchCachedLottieData(url);
  if (cachedData !== undefined) {
    return Promise.resolve(cachedData);
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
      return res.json() as Promise<LottieData>;
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
