const AUDIO_EXTENSIONS = /\.(mp3|ogg|wav|aac|m4a|webm)$/i;

const AUDIO_DOMAINS = ["mp3quran.net", "quranicaudio.com"];
export const shouldBypassServiceWorkerFetch = (request: Request) => {
  const url = new URL(request.url);
  const isAudioApi = url.pathname.includes("/api/v4/chapter_recitations/");

  // 1. Only care about GET requests
  if (request.method !== "GET") return true;

  // 2. Range requests (streaming)
  if (request.headers.has("range")) return true;

  // 3. File extension check
  if (AUDIO_EXTENSIONS.test(url.pathname)) return true;

  // 4. Known audio CDNs
  if (AUDIO_DOMAINS.some((domain) => url.hostname.includes(domain))) {
    return true;
  }

  // 5. Query-based detection (fallback)
  if (url.searchParams.has("audio")) return true;
  if (isAudioApi) return true;

  return false;
};

if (typeof self !== "undefined") {
  self.addEventListener(
    "fetch",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      if (shouldBypassServiceWorkerFetch(event.request)) {
        // By returning early and not calling respondWith(), the browser handles streaming natively.
        return;
      }
    },
    { capture: true },
  );
}
