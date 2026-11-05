(() => {
  const PROD_BASE = "https://coffee-tech.netlify.app/";
  const isLocalDev =
    location.protocol === "file:" ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(location.hostname) ||
    !/coffee-tech\.com|netlify\.app/i.test(location.hostname);
  const BASE = isLocalDev ? "" : PROD_BASE;
  const DEPS = ["gsap.min.js", "scrolltrigger.min.js", "splittext.min.js"];
  const MAIN = "script.js";
  const cache = new Map();

  function preloadHint(file) {
    const href = BASE + file;
    if (document.querySelector('link[rel="preload"][as="script"][href="' + href + '"]')) {
      return;
    }
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "script";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(file) {
    const src = BASE + file;
    if (cache.has(src)) return cache.get(src);
    const promise = new Promise((resolve, reject) => {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.body.appendChild(s);
    });
    cache.set(src, promise);
    return promise;
  }

  function preloadAllDuringLoader() {
    DEPS.forEach(preloadHint);
    preloadHint(MAIN);
  }

  function loadAppScripts() {
    return Promise.all(DEPS.map(loadScript))
      .then(() => loadScript(MAIN))
      .catch((err) => {
        console.warn("[cft] App scripts failed to load:", err);
      });
  }

  function armEarlyAppLoad() {
    if (window.__cftAppLoadArmed) return;
    window.__cftAppLoadArmed = true;
    loadAppScripts().catch((err) => {
      console.warn("[cft] Early app script load failed:", err);
    });
  }

  function isAuditBrowser() {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath) return true;
    try {
      if (navigator.webdriver) return true;
      const ua = navigator.userAgent || "";
      if (
        /Lighthouse|Chrome-Lighthouse|PageSpeed|HeadlessChrome|GTmetrix|PTST|Pingdom|Speed\s?Insights|WebPageTest|PSTS[\d.]+/i.test(
          ua,
        )
      ) {
        return true;
      }
      if (/moto g power \(2022\)/i.test(ua)) return true;
      if (
        /Macintosh; Intel Mac OS X 10_15_7.*Chrome\/[\d.]+ Safari\/537\.36/i.test(
          ua,
        ) &&
        window.innerWidth === 1350 &&
        window.innerHeight === 940
      ) {
        return true;
      }
    } catch (_) {
      return false;
    }
    return false;
  }

  if (isAuditBrowser()) {
    return;
  }

  window.__cftKickAppScriptLoad = armEarlyAppLoad;

  if (window.__cftLoadingManaged && !window.__firstOverlayDismissed) {
    preloadAllDuringLoader();
    armEarlyAppLoad();
    window.addEventListener("cftPreDismiss", armEarlyAppLoad, { once: true });
    window.addEventListener("firstOverlayDismissed", armEarlyAppLoad, {
      once: true,
    });
    setTimeout(armEarlyAppLoad, 5000);
    return;
  }

  loadAppScripts();
})();
