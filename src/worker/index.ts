export const shouldBypassServiceWorkerFetch = (request: Request) => {
  const url = new URL(request.url);
  const isAudioFile = url.pathname.match(/\.(mp3|ogg|wav|aac|m4a|webm)$/i);
  const isRangeRequest = request.headers.has("range");

  return Boolean(isAudioFile || isRangeRequest);
};

if (typeof self !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  self.addEventListener("fetch", (event: any) => {
    if (shouldBypassServiceWorkerFetch(event.request)) {
      // By returning early and not calling respondWith(), the browser handles streaming natively.
      return;
    }
  }, { capture: true });
}
