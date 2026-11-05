/* cft-head-init.js — head-bootstrap + audit-bootstrap + loading.js */
(() => {
  function detectAuditBrowser() {
    try {
      if (navigator.webdriver) return true;
      const ua = navigator.userAgent || "";
      if (
        /Lighthouse|Chrome-Lighthouse|PageSpeed|HeadlessChrome|GTmetrix|PTST|Pingdom|Speed\s?Insights|WebPageTest/i.test(
          ua,
        )
      ) {
        return true;
      }
      const brands = navigator.userAgentData?.brands;
      if (Array.isArray(brands)) {
        for (const b of brands) {
          if (/HeadlessChrome|Lighthouse/i.test(b.brand || "")) return true;
        }
      }
    } catch (_) {}
    return false;
  }
  if (window.__cftIsAuditBrowser == null) {
    window.__cftIsAuditBrowser = detectAuditBrowser();
  }
  window.__cftDetectAuditBrowser = detectAuditBrowser;
  window.__isPerfAudit = detectAuditBrowser;
  window.__cftShouldBypassVisibilityGate = function shouldBypassVisibilityGate() {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath) return true;
    return detectAuditBrowser();
  };
  if (window.__cftIsAuditBrowser) {
    document.documentElement.classList.remove(
      "pre-split-hide",
      "loading",
      "cft-loader-pending",
    );
    document.getElementById("cft-loading-overlay")?.remove();
  }
})();

(() => {
  function prefersReducedMotion() {
    try {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (_) {
      return false;
    }
  }

  const isAudit = window.__cftIsAuditBrowser;

  const WEBFLOW_SCRIPT_PRELOADS = [
    "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6978cf5d8e122e23793db0cd",
    "https://cdn.prod.website-files.com/6978cf5d8e122e23793db0cd/js/webflow.schunk.7321a5097fb66f41.js",
    "https://cdn.prod.website-files.com/6978cf5d8e122e23793db0cd/js/webflow.751e0867.148dc658e77a3916.js",
  ];

  function preloadScript(href) {
    if (!href || !document.head) return;
    if (
      document.head.querySelector(
        'link[rel="preload"][as="script"][href="' + href + '"]',
      )
    ) {
      return;
    }
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "script";
    link.href = href;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }

  function initWebflowScriptPreloads() {
    WEBFLOW_SCRIPT_PRELOADS.forEach(preloadScript);
  }

  function injectStyle(id, css) {
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function shouldUseLoaderShell() {
    if (isAudit || prefersReducedMotion()) return false;
    // Orange opening loader on every full page load / refresh (all pages).
    return true;
  }

  function mountOrangeShell() {
    if (document.getElementById("cft-loading-overlay")) return;
    const shell = document.createElement("div");
    shell.id = "cft-loading-overlay";
    shell.setAttribute("aria-hidden", "true");
    shell.style.cssText =
      "position:fixed;inset:0;background:#C8603D;z-index:2147483647;pointer-events:auto";
    (document.body || document.documentElement).appendChild(shell);
  }

  function initLoaderFirstPaint() {
    if (!shouldUseLoaderShell()) return;
    document.documentElement.classList.add("loading");
    injectStyle("cft-loader-first-paint", "html,body{background:#C8603D!important}");
    mountOrangeShell();
  }

  const MODEL_VIEWER_CDN =
    "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";

  function pickHomeModelSrc(mv) {
    const mobile = (mv.getAttribute("data-model-src-mobile") || "").trim();
    const desktop = (mv.getAttribute("data-model-src-desktop") || "").trim();
    const fallback = (mv.getAttribute("data-model-src") || "").trim();
    const coarse =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    return coarse ? mobile || desktop || fallback : desktop || mobile || fallback;
  }

  function stripModelViewerAssets() {
    document
      .querySelectorAll('script[src*="model-viewer"]')
      .forEach((node) => node.remove());
    document
      .querySelectorAll('link[rel="modulepreload"][href*="model-viewer"]')
      .forEach((node) => node.remove());
    document
      .querySelectorAll('link[rel="preload"][as="fetch"][href*=".glb"]')
      .forEach((node) => node.remove());
    document.querySelector("model-viewer")?.remove();
  }

  function kickEarlyModelPreload() {
    if (!shouldUseLoaderShell()) return;
    const mv = document.querySelector("model-viewer");
    if (!mv) return;

    if (
      !document.head.querySelector(
        'link[rel="modulepreload"][href*="model-viewer"]',
      )
    ) {
      const moduleLink = document.createElement("link");
      moduleLink.rel = "modulepreload";
      moduleLink.href = MODEL_VIEWER_CDN;
      moduleLink.crossOrigin = "anonymous";
      document.head.appendChild(moduleLink);
    }

    if (!document.querySelector('script[src*="model-viewer"]')) {
      const s = document.createElement("script");
      s.type = "module";
      s.async = true;
      s.src = MODEL_VIEWER_CDN;
      document.head.appendChild(s);
    }

    const src = pickHomeModelSrc(mv);
    if (!src) return;

    if (
      !document.head.querySelector(
        'link[rel="preload"][as="fetch"][href="' + src + '"]',
      )
    ) {
      const glbLink = document.createElement("link");
      glbLink.rel = "preload";
      glbLink.as = "fetch";
      glbLink.href = src;
      glbLink.crossOrigin = "anonymous";
      document.head.appendChild(glbLink);
    }

    if (!mv.getAttribute("src")) {
      mv.setAttribute("src", src);
      if (src.startsWith("http")) mv.setAttribute("crossorigin", "anonymous");
    }
    mv.setAttribute("loading", "eager");
    mv.setAttribute("reveal", "auto");
    window.__cftModelPreloadStarted = true;
  }

  // Prevent legacy Webflow CSS (`.loading { display: none }`) from hiding `<html class="loading">`.
  injectStyle(
    "cft-loading-visibility-override",
    "html.loading{display:block!important;visibility:visible!important}",
  );

  injectStyle(
    "cft-critical-css",
    [
      ".hero-3d model-viewer,.hero-3d .hero-model-static,.hero-3d .hero-lcp-image{width:100%;height:100%;display:block}",
      ".hero-3d:not(:has(.model-wrapper.entrance)) model-viewer{opacity:0!important;visibility:hidden!important;pointer-events:none!important}",
      ".hero-3d.cft-model-handoff-pending .hero-lcp-image{animation:none!important;transform:none!important;opacity:1!important;visibility:visible!important}",
      ".hero-3d.cft-placeholder-dismissed .hero-lcp-image,.hero-3d.cft-model-handoff .hero-lcp-image,.hero-3d:has(.model-wrapper.entrance) .hero-lcp-image{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;width:0!important;height:0!important;max-height:0!important;overflow:hidden!important;animation:none!important}",
      "@keyframes cftModelScaleIn{from{transform:scale(0) translateY(30%);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}",
      ".model-wrapper{transform:scale(0) translateY(80%) translateZ(0);visibility:hidden!important;backface-visibility:hidden;-webkit-backface-visibility:hidden}",
      ".model-wrapper.entrance{animation:cftModelScaleIn 1.2s cubic-bezier(.36,.18,0,.99) forwards;opacity:1!important;visibility:visible!important;will-change:transform,opacity}",
      "html.pre-split-hide .hero-content>h1{opacity:1!important;visibility:visible!important}",
      "html.pre-split-hide .hero-paragaph,html.cft-loader-exiting .hero-paragaph{opacity:0!important;visibility:hidden!important}",
      "#cft-loading-overlay{z-index:2147483647!important}",
      "body:has(#cft-loading-overlay) #cursor{display:none!important;visibility:hidden!important;opacity:0!important}",
      "#weglot-progress-bar,#wg-progress-bar,.weglot-progress-bar,.wg-progress-bar,.wg-progress,.wg-progress__bar,.wg-progress__wrapper,.wg-loading-bar,.weglot-loading-bar{display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;pointer-events:none!important}",
    ].join(""),
  );

  function scheduleEarlyModelPreload() {
    const run = () => kickEarlyModelPreload();
    if (!document.hidden) {
      run();
      return;
    }
    document.addEventListener("visibilitychange", function onVisible() {
      if (!document.hidden) {
        document.removeEventListener("visibilitychange", onVisible);
        run();
      }
    });
  }

  initWebflowScriptPreloads();
  initLoaderFirstPaint();
  if (!isAudit) scheduleEarlyModelPreload();
  if (!isAudit) deferWeglot();

  if (isAudit) {
    stripModelViewerAssets();
    document.documentElement.classList.remove("pre-split-hide", "loading");
    document.getElementById("cft-loading-overlay")?.remove();
  }

  function deferWeglot() {
    const WEGLOT_SRC = "https://cdn.weglot.com/weglot.min.js";
    const config = window.__cftWeglotConfig;
    if (!config || window.__cftWeglotScheduled || window.__cftIsAuditBrowser)
      return;
    window.__cftWeglotScheduled = true;

    function loadWeglot() {
      if (window.__cftWeglotLoading || typeof Weglot !== "undefined") return;
      window.__cftWeglotLoading = true;

      const existing = document.querySelector(
        'script[src*="cdn.weglot.com/weglot"]',
      );
      if (existing) return;

      const script = document.createElement("script");
      script.src = WEGLOT_SRC;
      script.async = true;
      script.onload = () => {
        try {
          if (typeof Weglot !== "undefined" && Weglot.initialize) {
            Weglot.initialize(config);
          }
        } catch (_) {}
        window.dispatchEvent(new CustomEvent("cftWeglotReady"));
      };
      document.head.appendChild(script);
    }

    function scheduleAfterLoadIdle() {
      const idleLoad = () => {
        if ("requestIdleCallback" in window) {
          requestIdleCallback(loadWeglot, { timeout: 5000 });
        } else {
          setTimeout(loadWeglot, 2500);
        }
      };
      if (document.readyState === "complete") {
        idleLoad();
      } else {
        window.addEventListener("load", idleLoad, { once: true });
      }
    }

    const hasHomeLoader = !!document.querySelector("model-viewer");
    if (hasHomeLoader) {
      const run = () => scheduleAfterLoadIdle();
      if (window.__firstOverlayDismissed) {
        run();
      } else {
        window.addEventListener("firstOverlayDismissed", run, { once: true });
      }
      setTimeout(loadWeglot, 8000);
      return;
    }

    scheduleAfterLoadIdle();
  }

})();

(() => {
  const MODEL_POSTER =
    "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/6977f8b0bf7d29560bcc9425_screenshot-model_converted.avif";

  const isAudit = window.__cftIsAuditBrowser;

  const useLightHeroPath = isAudit;
  window.__cftUseLightHeroPath = useLightHeroPath;

  function stripModelViewerAssets() {
    document
      .querySelectorAll('script[src*="model-viewer"]')
      .forEach((node) => node.remove());
    document
      .querySelectorAll('link[rel="modulepreload"][href*="model-viewer"]')
      .forEach((node) => node.remove());
    document
      .querySelectorAll('link[rel="preload"][as="fetch"][href*=".glb"]')
      .forEach((node) => node.remove());
    document.querySelector("model-viewer")?.remove();
  }

  if (isAudit) {
    stripModelViewerAssets();
    document.documentElement.classList.remove("pre-split-hide", "loading");
    document.getElementById("cft-loading-overlay")?.remove();
  }

  if (!useLightHeroPath) return;

  function swapModelViewerEarly() {
    stripModelViewerAssets();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", swapModelViewerEarly, {
      once: true,
    });
  } else {
    swapModelViewerEarly();
  }
})();

(() => {
  window.__cftLoadingManaged = true;

  // Hard refresh should behave like a first visit (session flags skip loader/header fade).
  try {
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    if (nav?.type === "reload") {
      sessionStorage.removeItem("pageLoaded");
      sessionStorage.removeItem("headerFadeShown");
    }
  } catch (_) {}

  const OVERLAY_ID = "cft-loading-overlay";
  const OVERLAY_Z_INDEX = 2147483647;
  const LOGO_SRC =
    "https://cdn.prod.website-files.com/6978cf5d8e122e23793db0cd/69df4bcd0d8e6d7140c5166e_LOGO-SVG.svg";
  const LOGO_FILL_ID = "cft-loading-logo-fill";
  const LOGO_SPIN_ID = "cft-loading-logo-spin";
  const LOGO_WRAP_ID = "cft-loading-logo-wrap";
  const LOGO_FILL_SHAPE_ID = "cft-loading-logo-fill-shape";

  const prefersReducedMotion = (() => {
    try {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (_) {
      return false;
    }
  })();

  const isMobile = (() => {
    try {
      return (
        window.matchMedia &&
        window.matchMedia("(pointer: coarse)").matches
      );
    } catch (_) {
      return false;
    }
  })();

  const MODEL_LOAD_TIMEOUT_MS = isMobile ? 5000 : 8000;
  const CDN_LOAD_TIMEOUT_MS = 5000;
  // Minimal gate — branding flash only; model/scripts never block content reveal.
  const LOADER_MIN_MS = isMobile ? 550 : 650;
  const LOADER_MAX_MS = isMobile ? 1200 : 1400;
  const LOADER_SAFETY_MS = LOADER_MIN_MS + MODEL_LOAD_TIMEOUT_MS + 2500;

  const isAuditBrowser = window.__cftIsAuditBrowser;

  const useLightHeroPath = isAuditBrowser || prefersReducedMotion;
  window.__cftUseLightHeroPath = useLightHeroPath;

  const LOADER_EASE = "cubic-bezier(.5,.1,0,.99)";
  const SPIN_DURATION_MS = prefersReducedMotion ? 0 : isMobile ? 1200 : 1500;
  const FILL_TRANSITION_MS = prefersReducedMotion ? 0 : isMobile ? 180 : 240;
  // Exit wipe (clip-path up + translateY) — identical on mobile and desktop.
  const EXIT_TRANSITION_MS = prefersReducedMotion ? 0 : 650;
  const EXIT_EASE = "cubic-bezier(.60,.30,.01,.99)";
  const OVERLAY_EXIT_MS = EXIT_TRANSITION_MS + 60;
  // Reveal hero under the overlay as soon as exit starts (avoids post-loader jump).
  const REVEAL_LEAD_MS = prefersReducedMotion
    ? 0
    : isMobile
      ? OVERLAY_EXIT_MS + 80
      : OVERLAY_EXIT_MS + 40;

  let released = false;
  let exitStarted = false;
  let logoSpinStarted = false;
  let loaderMotionStartedAt = 0;
  let currentProgress = 0;
  let modelLoadPromise = null;

  function showPageChrome() {
    document.documentElement.classList.remove("loading");
    document.documentElement.classList.remove("cft-loader-pending");
    document
      .querySelectorAll(".page-wrapper, .header, #cursor")
      .forEach((el) => {
        el.style.removeProperty("transition");
        el.style.removeProperty("opacity");
        el.style.removeProperty("visibility");
      });
  }
  window.__cftShowPageChrome = showPageChrome;

  function releasePage() {
    if (released) return;
    released = true;
    showPageChrome();
    window.__firstOverlayDismissed = true;
    window.dispatchEvent(new CustomEvent("firstOverlayDismissed"));
    if (!useLightHeroPath && document.querySelector("model-viewer")) {
      startHeroModelPreload();
    }
  }

  function releaseStuckHomeLoader() {
    document.getElementById(OVERLAY_ID)?.remove();
    document.documentElement.classList.remove(
      "loading",
      "cft-loader-pending",
      "cft-loader-exiting",
    );
    showPageChrome();
    if (window.__cftDeferModelTimer) {
      clearTimeout(window.__cftDeferModelTimer);
      window.__cftDeferModelTimer = null;
    }
    if (!window.__firstOverlayDismissed) {
      if (!released) released = true;
      window.__firstOverlayDismissed = true;
      window.dispatchEvent(new CustomEvent("firstOverlayDismissed"));
    }
  }
  window.__cftReleaseStuckHomeLoader = releaseStuckHomeLoader;

  function waitForDomReady() {
    if (document.readyState !== "loading") return Promise.resolve();
    return new Promise((resolve) =>
      document.addEventListener("DOMContentLoaded", resolve, { once: true }),
    );
  }

  function setProgress(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    currentProgress = Math.max(currentProgress, clamped);
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.style.setProperty("--cft-progress", `${currentProgress}%`);
      overlay.style.setProperty("--cft-clip-top", `${100 - currentProgress}%`);
    }
    const fill = document.getElementById(LOGO_FILL_ID);
    if (fill) fill.style.opacity = currentProgress > 0 ? "1" : "0";
  }

  function startLogoSpinAnimation() {
    if (logoSpinStarted || SPIN_DURATION_MS === 0) return;
    logoSpinStarted = true;

    const spin = document.getElementById(LOGO_SPIN_ID);
    const shape = document.getElementById(LOGO_FILL_SHAPE_ID);
    const targets = [spin, shape].filter(Boolean);
    if (!targets.length) return;

    targets.forEach((el) => {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = `cftLogoSpin ${SPIN_DURATION_MS}ms ${LOADER_EASE} 1 forwards`;
    });
  }

  function beginLoaderMotion() {
    if (loaderMotionStartedAt) return;
    loaderMotionStartedAt = performance.now();
    startLogoSpinAnimation();
    setProgress(Math.max(currentProgress, 8));
  }

  function scheduleLoaderMotion() {
    if (prefersReducedMotion) return;
    if (!document.hidden) {
      beginLoaderMotion();
      return;
    }
    document.addEventListener(
      "visibilitychange",
      function onVisible() {
        if (!document.hidden) {
          document.removeEventListener("visibilitychange", onVisible);
          beginLoaderMotion();
        }
      },
      { once: true },
    );
  }

  function loadModelViewerCdnIfNeeded() {
    if (customElements.get("model-viewer")) return Promise.resolve(true);

    const existing = document.querySelector(
      'script[src*="ajax.googleapis.com/ajax/libs/model-viewer/"]',
    );
    if (!existing) {
      const s = document.createElement("script");
      s.type = "module";
      s.async = true;
      s.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";
      document.head.appendChild(s);
    }

    return Promise.race([
      customElements
        .whenDefined("model-viewer")
        .then(() => true)
        .catch(() => false),
      new Promise((resolve) => setTimeout(() => resolve(false), CDN_LOAD_TIMEOUT_MS)),
    ]);
  }

  function pickModelSrc(mv) {
    const mobile = (mv.getAttribute("data-model-src-mobile") || "").trim();
    const desktop = (mv.getAttribute("data-model-src-desktop") || "").trim();
    const fallback = (mv.getAttribute("data-model-src") || "").trim();
    return isMobile
      ? mobile || desktop || fallback
      : desktop || mobile || fallback;
  }

  function ensureModelStartsLoading() {
    const mv = document.querySelector("model-viewer");
    if (!mv) return { mv: null, started: false };

    const src = pickModelSrc(mv);
    const currentSrc = (mv.getAttribute("src") || "").trim();
    if (src) {
      if (currentSrc !== src) {
        if (currentSrc) {
          mv.removeAttribute("src");
          void mv.offsetWidth;
        }
        mv.setAttribute("src", src);
        if (src.startsWith("http")) mv.setAttribute("crossorigin", "anonymous");
      }
    }
    mv.setAttribute("loading", "eager");
    mv.setAttribute("reveal", "auto");
    window.__cftModelPreloadStarted = true;
    return { mv, started: !!src };
  }

  function resetStaleModelPreload() {
    const mv = document.querySelector("model-viewer");
    if (!mv) return;
    const hasSrc = !!(mv.getAttribute("src") || "").trim();
    if (!hasSrc) {
      try {
        mv.removeAttribute("poster");
      } catch (_) {}
    }
    if (!window.__cftModelPreloadReadyFired) {
      window.__cftModelFullyPreloaded = false;
      window.__cftModelPreloadReady = false;
      modelLoadPromise = null;
    }
  }

  function waitForModelLoad(mv, timeoutMs) {
    if (!mv) return Promise.resolve(false);
    return new Promise((resolve) => {
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        mv.removeEventListener("load", onLoad);
        mv.removeEventListener("error", onErr);
        resolve(ok);
      };
      const onLoad = () => finish(true);
      const onErr = () => finish(false);
      mv.addEventListener("load", onLoad, { once: true });
      mv.addEventListener("error", onErr, { once: true });
      try {
        if (mv.loaded === true) return finish(true);
      } catch (_) {}
      setTimeout(() => finish(false), timeoutMs);
    });
  }

  function waitMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function shouldBypassVisibilityGate() {
    if (typeof window.__cftShouldBypassVisibilityGate === "function") {
      return window.__cftShouldBypassVisibilityGate();
    }
    return !!window.__cftIsAuditBrowser || !!window.__cftUseLightHeroPath;
  }

  function waitUntilVisible(maxMs = 45000) {
    if (!document.hidden || shouldBypassVisibilityGate()) return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        document.removeEventListener("visibilitychange", onVisible);
        clearTimeout(timer);
        resolve();
      };
      function onVisible() {
        if (!document.hidden) finish();
      }
      document.addEventListener("visibilitychange", onVisible);
      const timer = setTimeout(finish, maxMs);
    });
  }

  function runWhenVisible(fn, maxMs = 45000) {
    if (!document.hidden || shouldBypassVisibilityGate()) {
      fn();
      return;
    }
    let ran = false;
    const run = () => {
      if (ran) return;
      ran = true;
      document.removeEventListener("visibilitychange", onVisible);
      clearTimeout(timer);
      fn();
    };
    function onVisible() {
      if (!document.hidden) run();
    }
    document.addEventListener("visibilitychange", onVisible);
    const timer = setTimeout(run, maxMs);
  }

  function waitForLcpImage() {
    return new Promise((resolve) => {
      const img = document.querySelector(".hero-lcp-image");
      if (!img) return resolve(false);
      if (img.complete && img.naturalWidth > 0) return resolve(true);

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        img.removeEventListener("load", finish);
        img.removeEventListener("error", finish);
        resolve(img.naturalWidth > 0);
      };

      img.addEventListener("load", finish, { once: true });
      img.addEventListener("error", finish, { once: true });
      setTimeout(finish, LOADER_MAX_MS);
    });
  }

  function isModelGlbReady() {
    if (window.__cftModelFullyPreloaded) return true;
    const mv = document.querySelector("model-viewer");
    if (!mv) return false;
    try {
      return mv.loaded === true;
    } catch (_) {
      return false;
    }
  }

  function isModelInitReady() {
    if (window.__cftModelWrapperReady) return true;
    const mv = document.querySelector("model-viewer.model-viewer-3d");
    const wrapper = document.querySelector(".model-wrapper, .cft-model-preload-wrap");
    return !!(mv && wrapper && mv.isConnected && wrapper.contains(mv));
  }

  function isModelHandoffReady() {
    return isModelGlbReady() && isModelInitReady();
  }

  async function waitForModelHandoffReady(gateStart) {
    // Non-home pages: no model to wait for — release after LOADER_MIN_MS branding.
    if (!document.querySelector("model-viewer")) {
      return false;
    }

    const hardCap = gateStart + MODEL_LOAD_TIMEOUT_MS + 2000;

    try {
      await modelLoadPromise;
    } catch (_) {}

    while (performance.now() < hardCap) {
      window.__cftKickModelInitAfterLoaderHandoff?.();
      if (isModelHandoffReady()) {
        window.__cftModelReadyForHandoff = true;
        return true;
      }
      await waitMs(80);
    }

    window.__cftModelReadyForHandoff = isModelGlbReady();
    return window.__cftModelReadyForHandoff;
  }

  function ensureModelPipelineStarted() {
    if (modelLoadPromise) return modelLoadPromise;

    const hasModelViewer = !!document.querySelector("model-viewer");
    if (!hasModelViewer) {
      modelLoadPromise = Promise.resolve(false);
      return modelLoadPromise;
    }

    modelLoadPromise = (async () => {
      setProgress(18);
      const cdnOk = await loadModelViewerCdnIfNeeded();
      setProgress(cdnOk ? 52 : 40);

      const { mv, started } = ensureModelStartsLoading();
      window.__cftModelPreloadReadyFired = true;
      window.dispatchEvent(
        new CustomEvent("cftModelPreloadReady", {
          detail: { ok: started && cdnOk },
        }),
      );

      let modelOk = false;
      if (started && mv) {
        setProgress(68);
        modelOk = await waitForModelLoad(mv, MODEL_LOAD_TIMEOUT_MS);
        window.__cftModelPreloadReady = modelOk;
        window.__cftModelFullyPreloaded = modelOk;
      }

      setProgress(modelOk ? 96 : 85);
      return started && cdnOk && modelOk;
    })();

    return modelLoadPromise;
  }

  async function waitForSplitTextReady(maxMs = 1500) {
    if (window.__cftUseLightHeroPath || window.__cftIsAuditBrowser) return true;

    window.__cftKickAppScriptLoad?.();

    const start = performance.now();
    while (performance.now() - start < maxMs) {
      const libsReady =
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined" &&
        typeof SplitText !== "undefined";
      const appReady =
        typeof window.__cftRegisterGsapPlugins === "function" &&
        typeof window.__cftPageInit === "function";
      if (libsReady && appReady) {
        window.__cftRegisterGsapPlugins?.();
        return true;
      }
      await waitMs(50);
    }
    return false;
  }

  async function waitForLoaderGate() {
    const gateStart = performance.now();
    const modelPipe = startHeroModelPreload();

    const preDismissLeadMs = Math.max(0, LOADER_MIN_MS - 420);
    setTimeout(() => {
      window.__cftPreDismissFired = true;
      window.dispatchEvent(new CustomEvent("cftPreDismiss"));
    }, preDismissLeadMs);

    const progressTimer = setInterval(() => {
      const elapsed = performance.now() - gateStart;
      let pct = Math.min(70, (elapsed / LOADER_MIN_MS) * 70);
      if (isModelGlbReady()) pct = Math.max(pct, 82);
      if (isModelInitReady()) pct = Math.max(pct, 94);
      if (isModelHandoffReady()) pct = 98;
      setProgress(pct);
    }, 50);

    await Promise.all([waitMs(LOADER_MIN_MS), waitForModelHandoffReady(gateStart)]);

    try {
      await modelPipe;
    } catch (_) {}

    await waitForSplitTextReady(1500);

    clearInterval(progressTimer);
    setProgress(100);
  }

  function startHeroModelPreload() {
    return ensureModelPipelineStarted();
  }

  function createOverlay() {
    const existing = document.getElementById(OVERLAY_ID);
    if (existing?.dataset?.cftEnhanced === "1") return;

    if (!prefersReducedMotion && !document.getElementById("cft-loading-keyframes")) {
      const style = document.createElement("style");
      style.id = "cft-loading-keyframes";
      style.textContent = `
@keyframes cftLogoSpin {
  0% { transform: rotate(0deg) translateZ(0); }
  100% { transform: rotate(360deg) translateZ(0); }
}
`;
      document.head.appendChild(style);
    }

    const overlay = existing || document.createElement("div");
    if (!existing) {
      overlay.id = OVERLAY_ID;
      (document.body || document.documentElement).appendChild(overlay);
    }
    overlay.dataset.cftEnhanced = "1";
    overlay.setAttribute("aria-hidden", "true");
    overlay.replaceChildren();
    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "background:#C8603D",
      `z-index:${OVERLAY_Z_INDEX}`,
      "pointer-events:auto",
      "opacity:1",
      "transform:translateY(0)",
      "will-change:transform,opacity,clip-path",
      "clip-path:inset(0% 0% 0% 0%)",
      "-webkit-clip-path:inset(0% 0% 0% 0%)",
      prefersReducedMotion
        ? ""
        : `transition:transform ${EXIT_TRANSITION_MS}ms ${EXIT_EASE}, opacity ${EXIT_TRANSITION_MS}ms ${EXIT_EASE}, clip-path ${EXIT_TRANSITION_MS}ms ${EXIT_EASE}, -webkit-clip-path ${EXIT_TRANSITION_MS}ms ${EXIT_EASE}`,
    ]
      .filter(Boolean)
      .join(";");
    overlay.style.setProperty("--cft-progress", "0%");
    overlay.style.setProperty("--cft-clip-top", "100%");

    const center = document.createElement("div");
    center.style.cssText =
      "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;";

    const logoWrap = document.createElement("div");
    logoWrap.id = LOGO_WRAP_ID;
    logoWrap.style.cssText = [
      "position:relative",
      `width:${isMobile ? "18vw" : "8.308vw"}`,
      "aspect-ratio:1/1",
      "display:block",
      "filter:drop-shadow(0 10px 28px rgba(0,0,0,.18))",
    ].join(";");

    const logoSpinWrap = document.createElement("div");
    logoSpinWrap.id = LOGO_SPIN_ID;
    logoSpinWrap.style.cssText = [
      "position:absolute",
      "inset:0",
      "transform-origin:50% 50%",
      "will-change:transform",
      "transform:rotate(0deg) translateZ(0)",
    ].join(";");

    const logoBase = document.createElement("img");
    logoBase.alt = "";
    logoBase.decoding = "async";
    logoBase.loading = "eager";
    logoBase.src = LOGO_SRC;
    logoBase.style.cssText = [
      "position:absolute",
      "inset:0",
      "width:100%",
      "height:100%",
      "object-fit:contain",
      "opacity:0.38",
      "transform:translateZ(0)",
    ].join(";");

    const logoFillClip = document.createElement("div");
    logoFillClip.id = LOGO_FILL_ID;
    logoFillClip.style.cssText = [
      "position:absolute",
      "inset:0",
      "opacity:0",
      "clip-path:inset(var(--cft-clip-top) 0 0 0)",
      "will-change:clip-path,opacity",
      prefersReducedMotion
        ? ""
        : `transition:clip-path ${FILL_TRANSITION_MS}ms ${LOADER_EASE}, opacity 180ms ${LOADER_EASE}`,
    ]
      .filter(Boolean)
      .join(";");

    const logoFillShape = document.createElement("div");
    logoFillShape.id = LOGO_FILL_SHAPE_ID;
    logoFillShape.style.cssText = [
      "position:absolute",
      "inset:0",
      "background:rgba(0,0,0,1)",
      "transform-origin:50% 50%",
      "will-change:transform",
      `-webkit-mask-image:url(${LOGO_SRC})`,
      "-webkit-mask-repeat:no-repeat",
      "-webkit-mask-position:center",
      "-webkit-mask-size:contain",
      `mask-image:url(${LOGO_SRC})`,
      "mask-repeat:no-repeat",
      "mask-position:center",
      "mask-size:contain",
      "transform:rotate(0deg) translateZ(0)",
    ].join(";");
    logoFillClip.appendChild(logoFillShape);

    logoSpinWrap.appendChild(logoBase);
    logoWrap.appendChild(logoSpinWrap);
    logoWrap.appendChild(logoFillClip);
    center.appendChild(logoWrap);
    overlay.appendChild(center);

    scheduleLoaderMotion();
  }

  function dismissHeroPlaceholder() {
    const hero3d = document.querySelector(".hero-3d");
    if (hero3d) hero3d.classList.add("cft-placeholder-dismissed");
    const lcp = document.querySelector(".hero-lcp-image");
    if (lcp) {
      lcp.style.setProperty("display", "none", "important");
      lcp.style.setProperty("visibility", "hidden", "important");
      lcp.style.setProperty("opacity", "0", "important");
    }
  }
  window.__cftDismissHeroPlaceholder = dismissHeroPlaceholder;

  function prepHeroRevealEarly() {
    if (window.__cftHeroRevealPrepped) return;
    window.__cftHeroRevealPrepped = true;

    document.documentElement.classList.add("cft-loader-exiting");
    /* Keep pre-split-hide until GSAP runs — avoids hero-paragaph flash. */

    const glow = document.querySelector(".hero-glow");
    if (glow) glow.classList.add("animate");

    const hero3d = document.querySelector(".hero-3d");
    const lcp = document.querySelector(".hero-lcp-image");
    const hasModel = !!document.querySelector(
      ".hero-3d model-viewer, model-viewer.hero-model-3d",
    );

    if (hero3d) {
      if (hasModel) {
        hero3d.classList.add("cft-model-handoff-pending");
      } else {
        hero3d.classList.add("cft-hero-early-entrance");
      }
    }
    if (lcp && !hasModel) lcp.classList.add("cft-hero-early-entrance");

    if (!window.__cftOverlayDismissEventFired) {
      window.__cftOverlayDismissEventFired = true;
      window.dispatchEvent(new CustomEvent("overlayDismissStart"));
    }
  }

  function hideOverlay() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      revealPageAfterOverlay();
      return;
    }

    if (prefersReducedMotion || EXIT_TRANSITION_MS === 0) {
      prepHeroRevealEarly();
      revealPageAfterOverlay();
      removeOverlayImmediately(overlay);
      return;
    }

    prepHeroRevealEarly();
    const exitClip = "inset(0% 0% 100% 0%)";
    const runExitAnimation = () => {
      overlay.style.clipPath = exitClip;
      overlay.style.webkitClipPath = exitClip;
      overlay.style.transform = "translateY(-6px)";
      overlay.style.opacity = "0.98";
    };
    // Double rAF so mobile Safari applies the transition from the painted start state.
    requestAnimationFrame(() => {
      requestAnimationFrame(runExitAnimation);
    });

    const revealAt = Math.max(0, OVERLAY_EXIT_MS - REVEAL_LEAD_MS);
    setTimeout(revealPageAfterOverlay, revealAt);
    setTimeout(() => {
      removeOverlayImmediately(overlay);
    }, OVERLAY_EXIT_MS);
  }

  function removeOverlayImmediately(overlay) {
    overlay.remove();
    /* Keep cft-loader-exiting until GSAP removes it with pre-split-hide. */
    window.__cftOverlayDismissComplete = true;
    window.dispatchEvent(new CustomEvent("overlayDismissComplete"));
  }

  function heroModelEntranceDone() {
    return !!document.querySelector(".hero-3d .model-wrapper.entrance");
  }

  function invokeHeroEntranceWithRetry(attempt) {
    attempt = attempt || 0;
    if (heroModelEntranceDone()) return;
    if (window.__cftDeferModelTimer || window.__cftModelEntranceLock) return;
    if (typeof window.__cftTryImmediateModelEntrance === "function") {
      window.__cftTryImmediateModelEntrance();
      if (!heroModelEntranceDone() && attempt < 12) {
        setTimeout(() => invokeHeroEntranceWithRetry(attempt + 1), 80);
      }
      return;
    }
    if (typeof window.__ensureHeroModelVisible === "function") {
      window.__ensureHeroModelVisible();
      if (!heroModelEntranceDone() && attempt < 12) {
        setTimeout(() => invokeHeroEntranceWithRetry(attempt + 1), 80);
      }
      return;
    }
    if (attempt < 12) {
      setTimeout(() => invokeHeroEntranceWithRetry(attempt + 1), 80);
    }
  }

  function revealPageAfterOverlay() {
    releasePage();
    if (window.__cftOverlayDismissStarted) return;
    window.__cftOverlayDismissStarted = true;
    if (!window.__cftOverlayDismissEventFired) {
      window.__cftOverlayDismissEventFired = true;
      window.dispatchEvent(new CustomEvent("overlayDismissStart"));
    }
    requestAnimationFrame(() => invokeHeroEntranceWithRetry(0));
  }

  function beginExitSequence() {
    if (exitStarted) return;
    runWhenVisible(() => {
      if (exitStarted) return;
      exitStarted = true;
      setProgress(100);
      hideOverlay();
    });
  }

  async function boot() {
    try {
      await waitForDomReady();

      if (useLightHeroPath) {
        document.getElementById(OVERLAY_ID)?.remove();
        releasePage();
        return;
      }

      // Loader runs only when the user actually views the tab (not in background).
      await waitUntilVisible();

      document.documentElement.classList.add("loading");
      createOverlay();
      // Home: preload 3D model under the overlay. Other pages: branding only.
      startHeroModelPreload();
      await waitForLoaderGate();
      beginExitSequence();
    } catch (err) {
      console.warn("Loader boot failed, releasing page:", err);
      runWhenVisible(() => {
        beginExitSequence();
        releasePage();
      });
    }
  }

  try {
    boot();
  } catch (err) {
    console.warn("Loader failed to start, releasing page:", err);
    runWhenVisible(() => releasePage());
  }

  // Safety: never leave the page stuck behind the loader.
  runWhenVisible(() => {
    setTimeout(() => {
      if (!released) {
        console.warn("Loader safety timeout — releasing page");
        beginExitSequence();
        releasePage();
      }
    }, LOADER_SAFETY_MS);
  });
})();
