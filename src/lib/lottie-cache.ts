const lottieDataCache = new Map<string, unknown>();
const lottieRequestCache = new Map<string, Promise<unknown>>();

export function getCachedLottieData(url: string) {
  return lottieDataCache.get(url);
}

export function loadLottieData(url: string): Promise<unknown> {
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
        throw new Error('Failed to fetch lottie data');
      }
      return res.json();
    })
    .then((data) => {
      lottieDataCache.set(url, data);
      return data;
    })
    .finally(() => {
      lottieRequestCache.delete(url);
    });

  lottieRequestCache.set(url, request);
  return request;
}
