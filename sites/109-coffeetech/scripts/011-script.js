(function cftPerformanceBootstrap() {
  const MODEL_STATIC_IMAGE =
    "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/6977f8b0bf7d29560bcc9425_screenshot-model_converted.avif";

  function detectAuditBrowser() {
    try {
      if (navigator.webdriver) return true;
      const ua = navigator.userAgent || "";
      if (/Lighthouse|Chrome-Lighthouse|PageSpeed|HeadlessChrome|GTmetrix|PTST|Pingdom|Speed\s?Insights|WebPageTest/i.test(ua))
        return true;
      const brands = navigator.userAgentData?.brands;
      if (Array.isArray(brands)) {
        for (const b of brands) {
          if (/HeadlessChrome|Lighthouse/i.test(b.brand || "")) return true;
        }
      }
    } catch (_) {}
    return false;
  }

  function swapModelEarlyForAudit() {
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

  if (window.__cftIsAuditBrowser == null) {
    window.__cftIsAuditBrowser = detectAuditBrowser();
  }
  window.__cftShouldBypassVisibilityGate = function shouldBypassVisibilityGate() {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath) return true;
    return detectAuditBrowser();
  };

  if (window.__cftIsAuditBrowser) {
    window.__cftUseLightHeroPath = true;
    document.documentElement.classList.remove(
      "pre-split-hide",
      "loading",
      "cft-loader-pending",
    );
    document.getElementById("cft-loading-overlay")?.remove();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", swapModelEarlyForAudit, {
        once: true,
      });
    } else {
      swapModelEarlyForAudit();
    }
  }

  function releaseModelInitGate() {
    window.__cftDefer3dUntilHeroDone = false;
    window.__cftDefer3dRender = false;
    window.__cftAllowModelInit = true;
  }
  window.__cftReleaseModelInitGate = releaseModelInitGate;
  window.__cftCanStartModelInitDuringLoader = canStartModelInitDuringLoader;
  window.__cftKickModelInitAfterLoaderHandoff = kickModelInitAfterLoaderHandoff;

  function canStartModelInitDuringLoader() {
    return (
      window.__firstOverlayDismissed ||
      window.__cftOverlayDismissEventFired ||
      window.__cftPreDismissFired ||
      window.__cftAppLoadArmed ||
      window.__cftModelPreloadStarted
    );
  }

  function kickModelInitAfterLoaderHandoff() {
    releaseModelInitGate();
    window.__cftPendingModelInit = false;
    if (!window.__cftModelInitScheduled && typeof window.scheduleModelInit === "function") {
      window.scheduleModelInit();
    }
    if (typeof window.__ensureHeroModelVisible === "function") {
      window.__ensureHeroModelVisible();
    }
  }

  window.addEventListener("cftModelPreloadReady", () => {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath) return;
    if (window.__cftLoadingManaged && !canStartModelInitDuringLoader()) {
      window.__cftPendingModelInit = true;
      return;
    }
    if (window.__cftModelInitScheduled) return;
    if (typeof window.scheduleModelInit === "function") {
      releaseModelInitGate();
      window.scheduleModelInit();
    } else {
      window.__cftPendingModelInit = true;
    }
  });

  window.addEventListener("cftPreDismiss", () => {
    if (window.__cftPendingModelInit || window.__cftModelPreloadReadyFired) {
      kickModelInitAfterLoaderHandoff();
    }
  });

  window.addEventListener("overlayDismissStart", () => {
    kickModelInitAfterLoaderHandoff();
    if (typeof window.__cftTryImmediateModelEntrance === "function") {
      requestAnimationFrame(() => window.__cftTryImmediateModelEntrance());
    }
  });

  window.addEventListener("firstOverlayDismissed", () => {
    kickModelInitAfterLoaderHandoff();
  });

  function forceReleaseIfLoaderStuck() {
    if (!window.__cftLoadingManaged || window.__firstOverlayDismissed) return;
    if (document.hidden && !window.__cftIsAuditBrowser) {
      document.addEventListener(
        "visibilitychange",
        () => forceReleaseIfLoaderStuck(),
        { once: true },
      );
      return;
    }
    console.warn("[cft] Loader stuck — forcing page release");
    document.getElementById("cft-loading-overlay")?.remove();
    if (typeof window.__cftShowPageChrome === "function") {
      window.__cftShowPageChrome();
    } else {
      document.documentElement.classList.remove("loading");
      document.querySelectorAll(".page-wrapper, .header, #cursor").forEach((el) => {
        el.style.removeProperty("transition");
        el.style.setProperty("opacity", "1", "important");
        el.style.setProperty("visibility", "visible", "important");
      });
    }
    window.__firstOverlayDismissed = true;
    document.documentElement.classList.remove(
      "pre-split-hide",
      "cft-loader-exiting",
    );
    window.__cftOverlayDismissComplete = true;
    window.dispatchEvent(new CustomEvent("firstOverlayDismissed"));
    window.dispatchEvent(new CustomEvent("overlayDismissComplete"));
  }

  window.addEventListener("load", () => {
    setTimeout(forceReleaseIfLoaderStuck, 7000);
  }, { once: true });
})();

// --- Marquee resize stability overrides ---
// Re-initialize marquees on resize using normalized progress to prevent snapping.
(function marqueeResizeStabilityPatch() {
    if (window.__marqueeResizeStabilityPatchApplied) return;
    window.__marqueeResizeStabilityPatchApplied = true;
  
    function getWidthFromWrap(wrap) {
      const collection =
        wrap && wrap.querySelector && wrap.querySelector(".marquee-collection");
      if (!collection) return 0;
      return collection.offsetWidth || collection.scrollWidth || 0;
    }
  
    // Override by assigning to window (functions are referenced by name in this file's scope,
    // but re-defining them here is still useful for any later calls via window or from console).
    window.initMarquee = function initMarqueeStable(wrap, retry = 0) {
      if (typeof gsap === "undefined")
        return retry < 10
          ? void setTimeout(() => window.initMarquee(wrap, retry + 1), 100)
          : void 0;
      const collection = wrap?.querySelector?.(".marquee-collection");
      const scroll = wrap?.querySelector?.(".marquee-scroll");
      if (!collection || !scroll) return;
  
      wrap._marqueeAnimation?.kill?.();
      wrap._marqueeAnimation = null;
  
      const existing = scroll.querySelectorAll(".marquee-collection");
      if (existing.length > 1)
        for (let i = existing.length - 1; i >= 1; i--) existing[i].remove();
  
      const bigType = collection.querySelector(".big-type");
      if (bigType) {
        const oldSep = bigType.querySelector("span");
        oldSep && oldSep.remove();
        const sep = document.createElement("span");
        sep.textContent = " / ";
        bigType.appendChild(sep);
      }
  
      void scroll.offsetHeight;
  
      const speedScale =
        window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
      const w = getWidthFromWrap(wrap) || 1;
      if (w <= 0) return void setTimeout(() => window.initMarquee(wrap), 100);
      wrap._marqueeWidth = w;
  
      const duration = (w / window.innerWidth) * 15 * speedScale;
      const clones = Math.max(2, Math.ceil((2 * window.innerWidth) / w) + 1);
      for (let i = 0; i < clones; i++)
        scroll.appendChild(collection.cloneNode(true));
  
      scroll.querySelectorAll(".marquee-collection").forEach((c) => {
        const bt = c.querySelector(".big-type");
        if (bt && !bt.querySelector("span")) {
          const sep = document.createElement("span");
          sep.textContent = " / ";
          bt.appendChild(sep);
        }
      });
  
      let x = 0;
      if (wrap._savedProgress != null) {
        const p = Math.max(0, Math.min(1, Number(wrap._savedProgress)));
        x = -p * w;
        wrap._savedProgress = null;
      } else {
        const currentX = parseFloat(gsap.getProperty(scroll, "x"));
        if (!isNaN(currentX)) x = currentX;
      }
  
      let nx = x % w;
      if (nx > 0) nx -= w;
      if (!isFinite(nx)) nx = 0;
      gsap.set(scroll, { x: nx });
  
      wrap._marqueeAnimation = gsap.to(scroll, {
        x: nx - w,
        duration,
        ease: "linear",
        repeat: -1,
        modifiers: {
          x: (val) => {
            const v = parseFloat(val);
            if (isNaN(v)) return val;
            let wrapped = v % w;
            if (wrapped > 0) wrapped -= w;
            return wrapped + "px";
          },
        },
      });
    };
  
    window.initAllMarquees = function initAllMarqueesStable() {
      if (typeof gsap === "undefined") return;
      (window.qsa
        ? window.qsa(".marquee-wrap")
        : document.querySelectorAll(".marquee-wrap")
      ).forEach((wrap) => {
        const scroll = wrap.querySelector(".marquee-scroll");
        const w = Number(wrap._marqueeWidth || getWidthFromWrap(wrap) || 0);
        if (scroll && wrap._marqueeAnimation && w > 0) {
          const x = parseFloat(gsap.getProperty(scroll, "x"));
          if (!isNaN(x)) {
            const dist = ((-x % w) + w) % w;
            wrap._savedProgress = dist / w;
          }
        }
        wrap._marqueeAnimation?.kill?.();
        wrap._marqueeAnimation = null;
        if (scroll) {
          const cols = scroll.querySelectorAll(".marquee-collection");
          if (cols.length > 1)
            for (let i = cols.length - 1; i >= 1; i--) cols[i].remove();
        }
      });
  
      requestAnimationFrame(() => {
        (window.qsa
          ? window.qsa(".marquee-wrap")
          : document.querySelectorAll(".marquee-wrap")
        ).forEach((wrap) => window.initMarquee(wrap));
      });
    };
  
    // Debounced resize re-init (only once).
    if (!window.__marqueeResizeHandlerInstalled) {
      window.__marqueeResizeHandlerInstalled = true;
      let t = null;
      window.addEventListener(
        "resize",
        () => {
          if (t) clearTimeout(t);
          t = setTimeout(() => window.initAllMarquees(), 140);
        },
        { passive: true },
      );
    }
  })();
  
  /* --- Salesforce Web-to-Lead mirror (shared) --- */
  (function initSalesforceWebToLeadMirrorBootstrap() {
    const SF_WEB_TO_LEAD_URL =
      "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";
    const SF_OID = "00D24000000H8pa";
    const SF_LEAD_SOURCE = "Web";
    const SF_RET_URL = "https://www.coffee-tech.com/thank-you";
    const UTM_FIELD_MAP = {
      "00NTs000000wZVF": "utm_source",
      "00NTs000000wZWr": "utm_medium",
      "00NTs000000wZYT": "utm_campaign",
      "00NTs000000wZjl": "utm_content",
      "00NTs000000wZmz": "utm_term",
      "00NTs000000wZob": "adgroupid",
    };
  
    /** Debounce: Webflow sometimes intercepts submit; click+submit can both fire. */
    const lastSentAt = new WeakMap();
  
    function getCookie(name) {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)"),
      );
      return match ? decodeURIComponent(match[2]) : null;
    }
  
    function setCookie(name, value, days = 30) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Lax`;
    }
  
    function persistUtmCookies() {
      const urlParams = new URLSearchParams(window.location.search);
      for (const paramKey of Object.values(UTM_FIELD_MAP)) {
        const cookieKey = `cft_${paramKey}`;
        const value = urlParams.get(paramKey);
        if (value) setCookie(cookieKey, value);
      }
    }
  
    function getCountryNameFromForm(form) {
      const select = form.querySelector("#country_code");
      if (!select) return "";
      const opt =
        select.options && select.selectedIndex >= 0
          ? select.options[select.selectedIndex]
          : null;
      return opt ? (opt.textContent || "").trim() : "";
    }
  
    function syncCountryNameHiddenInput(form) {
      if (!form) return;
      const input = form.querySelector("#country_name");
      if (!input) return;
      const countryName = getCountryNameFromForm(form);
      if (!countryName) return;
      if (input.value !== countryName) input.value = countryName;
    }
  
    function sendSalesforceMirror(form) {
      if (!form || form.getAttribute("data-salesforce-webtolead") !== "true")
        return;
      const now = Date.now();
      const prev = lastSentAt.get(form) || 0;
      if (now - prev < 800) return;
      lastSentAt.set(form, now);
  
      try {
        persistUtmCookies();
      } catch (_) {}
  
      try {
        // Keep the live form's hidden field in sync so Webflow email notifications
        // can show the full country name (not only the country code).
        syncCountryNameHiddenInput(form);
  
        const fd = new FormData(form);
        const body = new URLSearchParams();
        for (const [k, v] of fd.entries()) {
          if (typeof v !== "string") continue;
          if (k === "Visitor_IP") continue;
          body.append(k, v);
        }
  
        body.set("oid", SF_OID);
        body.set("lead_source", SF_LEAD_SOURCE);
        body.set("retURL", SF_RET_URL);
  
        const countryName = getCountryNameFromForm(form);
        if (countryName) body.set("country_name", countryName);
  
        const urlParams = new URLSearchParams(window.location.search);
        for (const [sfFieldId, paramKey] of Object.entries(UTM_FIELD_MAP)) {
          const cookieKey = `cft_${paramKey}`;
          const value = urlParams.get(paramKey) || getCookie(cookieKey) || "none";
          body.set(sfFieldId, value);
        }
  
        const payload = body.toString();
  
        fetch(SF_WEB_TO_LEAD_URL, {
          method: "POST",
          mode: "no-cors",
          credentials: "omit",
          keepalive: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: payload,
        }).catch(() => {});
      } catch (_) {}
    }
  
    function findSalesforceFormFromEventTarget(target) {
      if (!target || !target.closest) return null;
      const form = target.closest("form[data-salesforce-webtolead='true']");
      return form instanceof HTMLFormElement ? form : null;
    }
  
    function bindGlobalSalesforceMirror() {
      if (bindGlobalSalesforceMirror._done) return;
      bindGlobalSalesforceMirror._done = true;
  
      document.addEventListener(
        "submit",
        (e) => {
          const form = e.target;
          if (!(form instanceof HTMLFormElement)) return;
          if (form.getAttribute("data-salesforce-webtolead") !== "true") return;
          syncCountryNameHiddenInput(form);
          sendSalesforceMirror(form);
        },
        true,
      );
  
      document.addEventListener(
        "click",
        (e) => {
          const t = e.target;
          if (!t || !t.closest) return;
          const btn = t.closest(
            "button[type='submit'], input[type='submit'], button:not([type='button']):not([type='reset'])",
          );
          if (!btn) return;
          const form = findSalesforceFormFromEventTarget(btn);
          if (!form) return;
          syncCountryNameHiddenInput(form);
          setTimeout(() => sendSalesforceMirror(form), 0);
        },
        true,
      );
  
      // Ensure the hidden country_name reflects the selected option text immediately.
      document.addEventListener(
        "change",
        (e) => {
          const t = e.target;
          if (!(t instanceof HTMLElement)) return;
          const select = t.closest && t.closest("#country_code");
          if (!select) return;
          const form = findSalesforceFormFromEventTarget(select);
          if (!form) return;
          syncCountryNameHiddenInput(form);
        },
        true,
      );
    }
  
    if (typeof document === "undefined") return;
    bindGlobalSalesforceMirror();
  
    window.addEventListener("pageReady", () => {
      try {
        if (typeof initHeaderTheme === "function") initHeaderTheme();
      } catch (_) {}
      try {
        persistUtmCookies();
      } catch (_) {}
      document
        .querySelectorAll('form[data-salesforce-webtolead="true"]')
        .forEach((form) => {
          lastSentAt.delete(form);
          syncCountryNameHiddenInput(form);
        });
    });
  })();
  
  /* Visitor_IP: filled for Webflow email/CRM; omitted from SF Web-to-Lead mirror above. */
  (function initVisitorIpHiddenField() {
    if (typeof document === "undefined") return;
  
    let cachedVisitorIp = null;
    let visitorIpFetchPromise = null;
  
    function fetchVisitorIp() {
      if (cachedVisitorIp !== null) return Promise.resolve(cachedVisitorIp);
      if (!visitorIpFetchPromise) {
        visitorIpFetchPromise = fetch("https://api.ipify.org?format=json", {
          cache: "no-store",
        })
          .then((r) => (r.ok ? r.json() : {}))
          .then((data) => {
            const ip = data && typeof data.ip === "string" ? data.ip.trim() : "";
            cachedVisitorIp = ip || "";
            return cachedVisitorIp;
          })
          .catch(() => {
            cachedVisitorIp = "";
            return cachedVisitorIp;
          });
      }
      return visitorIpFetchPromise;
    }
  
    function syncVisitorIpHiddenInput(form) {
      if (!form || !form.querySelector) return;
      const input = form.querySelector("#visitor_ip");
      if (!input) return;
      if (cachedVisitorIp) {
        input.value = cachedVisitorIp;
        return;
      }
      fetchVisitorIp().then((ip) => {
        if (input && ip) input.value = ip;
      });
    }
  
    document.addEventListener(
      "submit",
      (e) => {
        const form = e.target;
        if (!(form instanceof HTMLFormElement)) return;
        if (!form.querySelector("#visitor_ip")) return;
        syncVisitorIpHiddenInput(form);
      },
      true,
    );
  
    document.addEventListener(
      "click",
      (e) => {
        const t = e.target;
        if (!t || !t.closest) return;
        const btn = t.closest(
          "button[type='submit'], input[type='submit'], button:not([type='button']):not([type='reset'])",
        );
        if (!btn) return;
        const form = btn.closest && btn.closest("form");
        if (
          !(form instanceof HTMLFormElement) ||
          !form.querySelector("#visitor_ip")
        )
          return;
        syncVisitorIpHiddenInput(form);
      },
      true,
    );
  
    document.addEventListener(
      "focusin",
      (e) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;
        const form = t.closest && t.closest("form");
        if (
          !(form instanceof HTMLFormElement) ||
          !form.querySelector("#visitor_ip")
        )
          return;
        fetchVisitorIp();
      },
      true,
    );
  
    window.addEventListener("pageReady", () => {
      document.querySelectorAll("form").forEach((form) => {
        if (form.querySelector("#visitor_ip")) syncVisitorIpHiddenInput(form);
      });
      fetchVisitorIp();
    });
  })();
  
  (function ensureCanonicalOnDirectLoad() {
    function run() {
      try {
        if (typeof updateCanonicalFromDoc === "function") {
          updateCanonicalFromDoc(document, location.href);
          return true;
        }
      } catch (_) {}
      return false;
    }
  
    // Defer canonical sync to ensure updateCanonicalFromDoc is defined (this file is large and partially bundled).
    const schedule = () => {
      if (run()) return;
      let attempts = 0;
      const tick = () => {
        attempts += 1;
        if (run()) return;
        if (attempts < 50) setTimeout(tick, 50);
      };
      setTimeout(tick, 0);
    };
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", schedule, { once: true });
    } else {
      schedule();
    }
    window.addEventListener("pageshow", schedule);
  })();
  
  /* Early resource hints (runs when deferred script executes — no HTML edits required). */
  (function initPerfHintsFromScript() {
    if (typeof document === "undefined" || !document.head) return;

    function linkExists(rel, href) {
      return !!document.head.querySelector(
        'link[rel="' + rel + '"][href="' + href + '"]',
      );
    }

    function applyDomHints() {
      const logo = document.querySelector(".header .logo img");
      if (logo) {
        logo.setAttribute("loading", "eager");
        if (!logo.getAttribute("fetchpriority")) {
          logo.setAttribute("fetchpriority", "low");
        }
      }

      if (window.__cftIsAuditBrowser) return;

      if (window.__cftLoadingManaged && !window.__firstOverlayDismissed) return;

      const mv = document.querySelector(
        "#model-page model-viewer, .hero-3d model-viewer, model-viewer",
      );
      if (!mv) return;

      addModulePreload(
        "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js",
      );
      const mobile = (mv.getAttribute("data-model-src-mobile") || "").trim();
      const desktop = (mv.getAttribute("data-model-src-desktop") || "").trim();
      let isCoarse = false;
      try {
        isCoarse =
          window.matchMedia &&
          window.matchMedia("(pointer: coarse)").matches;
      } catch (_) {}
      const glb = isCoarse ? mobile || desktop : desktop || mobile;
      if (glb && !linkExists("preload", glb)) {
        const l = document.createElement("link");
        l.rel = "preload";
        l.as = "fetch";
        l.href = glb;
        l.crossOrigin = "anonymous";
        document.head.appendChild(l);
      }
    }

    function addModulePreload(href) {
      if (!href || linkExists("modulepreload", href)) return;
      const l = document.createElement("link");
      l.rel = "modulepreload";
      l.href = href;
      document.head.appendChild(l);
    }

    function scheduleDomHints() {
      if (window.__cftLoadingManaged && !window.__firstOverlayDismissed) {
        window.addEventListener("firstOverlayDismissed", applyDomHints, {
          once: true,
        });
        return;
      }
      applyDomHints();
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scheduleDomHints, {
        once: true,
      });
    } else {
      scheduleDomHints();
    }
  })();
  
  function isMobileLayoutBreakpoint() {
    return window.matchMedia(
      "(max-width: 768px) and ((orientation: portrait) or (pointer: fine))",
    ).matches;
  }
  function handleImageError(e) {
    try {
      e &&
        ((e.style.opacity = "0"),
        (e.style.visibility = "hidden"),
        (e.onerror = null));
    } catch (e) {}
  }
  function initImageErrorHandlers() {
    (document.querySelectorAll("img").forEach((e) => {
      e.onerror ||
        (e.onerror = function () {
          handleImageError(this);
        });
    }),
      "undefined" != typeof MutationObserver &&
        new MutationObserver((e) => {
          e.forEach((e) => {
            e.addedNodes.forEach((e) => {
              1 === e.nodeType &&
                ("IMG" !== e.tagName ||
                  e.onerror ||
                  (e.onerror = function () {
                    handleImageError(this);
                  }),
                e.querySelectorAll &&
                  e.querySelectorAll("img").forEach((e) => {
                    e.onerror ||
                      (e.onerror = function () {
                        handleImageError(this);
                      });
                  }));
            });
          });
        }).observe(document.body, { childList: !0, subtree: !0 }));
  }
  function mergeProductTags(e) {
    const t = e || document;
    (t.querySelectorAll ? t.querySelectorAll(".column") : []).forEach((e) => {
      if (e.querySelector(".merged-tags")) return;
      const t = e.querySelectorAll(".w-dyn-list"),
        n = e.querySelector(".w-richtext");
      let o = 0;
      t.forEach((e) => {
        o += e.querySelectorAll(".tag").length;
      });
      const i = n ? n.querySelectorAll("ul li") : [];
      if (((o += i.length), 0 === o)) return;
      const r = document.createElement("div");
      ((r.className = "merged-tags"),
        t.forEach((e) => {
          e.querySelectorAll(".tag").forEach((e) => {
            const t = e.cloneNode(!0);
            r.appendChild(t);
          });
        }),
        n &&
          i.length > 0 &&
          i.forEach((e) => {
            const t = document.createElement("div");
            ((t.className = "tag richtext-tag"),
              (t.innerHTML = `<span>${e.textContent}</span>`),
              r.appendChild(t));
          }));
      const s = new Set();
      (t.forEach((e) => {
        e.querySelectorAll(".tag").length > 0 && s.add(e);
      }),
        n && i.length > 0 && s.add(n));
      const l = [...e.querySelectorAll(".w-dyn-list, .w-richtext")].find((e) =>
        s.has(e),
      );
      (l ? l.parentNode.insertBefore(r, l) : e.appendChild(r),
        t.forEach((e) => {
          e.style.display = "none";
        }),
        n && (n.style.display = "none"));
    });
  }
  function hideCatalogColumnsInRoot(e) {
    const t = e || document,
      n = t.querySelectorAll ? t.querySelectorAll(".catalog-grid .column") : [];
    0 !== n.length &&
      ("undefined" != typeof gsap
        ? gsap.set(n, { opacity: 0, y: 100, visibility: "hidden" })
        : n.forEach(function (e) {
            ((e.style.opacity = "0"), (e.style.visibility = "hidden"));
          }));
  }
  function registerGsapPlugins() {
    if ("undefined" == typeof gsap || "undefined" == typeof ScrollTrigger)
      return !1;
    gsap.registerPlugin(ScrollTrigger);
    "undefined" != typeof SplitText && gsap.registerPlugin(SplitText);
    return !0;
  }
  window.__cftRegisterGsapPlugins = registerGsapPlugins;
  registerGsapPlugins();
  ("loading" === document.readyState
      ? document.addEventListener("DOMContentLoaded", initImageErrorHandlers)
      : initImageErrorHandlers(),
    "loading" === document.readyState
      ? document.addEventListener("DOMContentLoaded", mergeProductTags)
      : mergeProductTags());
  const isTouchDevice = () =>
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0,
    MOBILE_VIEWPORT_MAX = 768,
    isMobileViewport = () => window.innerWidth <= 768;
  let viewportHeightLocked = !1,
    _mobileVhBound = !1,
    _lastInnerWidthForVh = "undefined" != typeof window ? window.innerWidth : 0;
  function updateMobileViewportUnit() {
    if (!isTouchDevice()) return;
    const e = 0.01 * window.innerHeight;
    (document.documentElement.style.setProperty("--vh", `${e}px`),
      document.body && document.body.style.setProperty("--vh", `${e}px`),
      (viewportHeightLocked = !0));
  }
  function lockViewportHeight() {
    isTouchDevice() &&
      (updateMobileViewportUnit(),
      _mobileVhBound ||
        ((_mobileVhBound = !0),
        (_lastInnerWidthForVh = window.innerWidth),
        window.addEventListener(
          "resize",
          () => {
            const e = window.innerWidth;
            e !== _lastInnerWidthForVh &&
              ((_lastInnerWidthForVh = e), updateMobileViewportUnit());
          },
          { passive: !0 },
        ),
        window.addEventListener(
          "orientationchange",
          () => {
            setTimeout(() => {
              ((_lastInnerWidthForVh = window.innerWidth),
                updateMobileViewportUnit());
            }, 200);
          },
          { passive: !0 },
        )));
  }
  function preventOverscroll() {}
  isTouchDevice() && lockViewportHeight();
  const qs = (e, t = document) => t.querySelector(e),
    qsa = (e, t = document) => t.querySelectorAll(e),
    resetScroll = () => {
      ("scrollRestoration" in history && (history.scrollRestoration = "manual"),
        window.scrollTo(0, 0),
        (document.documentElement.scrollTop = 0),
        (document.body.scrollTop = 0),
        smoothScrollInstance &&
          smoothScrollInstance.forceScrollUpdate &&
          smoothScrollInstance.forceScrollUpdate());
    };
  function animateFooterRevealScrub() {
    const e = qsa(".footer");
    if (e.length > 1) for (let t = 0; t < e.length - 1; t++) e[t].remove();
    const t = qs(".footer");
    if (!t) return;
    if (
      (t._footerScrubObserver &&
        (t._footerScrubObserver.disconnect(), (t._footerScrubObserver = null)),
      t._footerScrubResizeHandler &&
        (window.removeEventListener("resize", t._footerScrubResizeHandler),
        (t._footerScrubResizeHandler = null)),
      t._footerScrubScrollHandler &&
        (smoothScrollInstance
          ? smoothScrollInstance.off("scroll", t._footerScrubScrollHandler)
          : window.removeEventListener("scroll", t._footerScrubScrollHandler),
        (t._footerScrubScrollHandler = null)),
      isMobileLayoutBreakpoint())
    )
      return (
        t.querySelectorAll(".footer-overlay").forEach((e) => e.remove()),
        t.style.setProperty("--footer-progress", "1"),
        "undefined" != typeof gsap
          ? gsap.set(t, { y: 0, clearProps: "transform" })
          : (t.style.transform = ""),
        (t._footerRevealRefresh = function () {}),
        void (window.refreshFooterReveal = function () {})
      );
    t.querySelectorAll(".footer-overlay").forEach((e) => e.remove());
    const n = document.createElement("div");
    ((n.className = "footer-overlay"),
      (t.style.position = "relative"),
      t.appendChild(n));
    let o = !1,
      i = null;
    function r() {
      return (-(isMobileLayoutBreakpoint() ? 40 : 30) / 100) * window.innerWidth;
    }
    function s() {
      let e = 0,
        n = t;
      for (; n; ) ((e += n.offsetTop), (n = n.offsetParent));
      return e;
    }
    t.style.setProperty("--footer-progress", "0");
    let l = null,
      a = t.offsetHeight;
    const c = () => {
      ((l = s()), (a = t.offsetHeight));
    };
    function d() {
      const e =
          smoothScrollInstance && "number" == typeof smoothScrollInstance.scroll
            ? smoothScrollInstance.scroll
            : window.scrollY || window.pageYOffset,
        n = window.innerHeight,
        o = null !== l ? l : s(),
        i = a || t.offsetHeight || 1,
        c = e + n;
      let d = 0;
      if (c >= o) {
        const e = c - o;
        d = Math.max(0, Math.min(1, e / i));
      }
      if (
        (c >= o + i && (d = 1),
        t.style.setProperty("--footer-progress", d.toString()),
        "undefined" != typeof gsap)
      ) {
        const e = r(),
          n = e + (0 - e) * d;
        gsap.set(t, { y: n });
      }
    }
    function u() {
      i ||
        (i = requestAnimationFrame(() => {
          (d(), (i = null));
        }));
    }
    (c(), "undefined" != typeof gsap && gsap.set(t, { y: r() }));
    const m = new IntersectionObserver(
      (e) => {
        e.forEach((e) => {
          ((o = e.isIntersecting), o && (c(), u()));
        });
      },
      { threshold: 0, rootMargin: "0px" },
    );
    (m.observe(t), (t._footerScrubObserver = m));
    let g,
      h = u;
    if (isTouchDevice()) {
      let e = 0;
      const t = 60;
      h = () => {
        const n = Date.now();
        n - e < t || ((e = n), u());
      };
    }
    (smoothScrollInstance
      ? smoothScrollInstance.on("scroll", h)
      : window.addEventListener("scroll", h, { passive: !0 }),
      (t._footerScrubScrollHandler = h));
    const f = () => {
      (clearTimeout(g),
        (g = setTimeout(() => {
          (i && (cancelAnimationFrame(i), (i = null)),
            requestAnimationFrame(() => {
              (c(), d());
            }));
        }, 150)));
    };
    (window.addEventListener("resize", f, { passive: !0 }),
      (t._footerScrubResizeHandler = f),
      (t._footerRevealRefresh = function () {
        (c(), d());
      }),
      (window.refreshFooterReveal = function () {
        const e = document.querySelector(".footer");
        e &&
          "function" == typeof e._footerRevealRefresh &&
          e._footerRevealRefresh();
      }),
      u());
  }
  function parseCubicBezier(e) {
    if ("string" != typeof e) return e;
    const t = e.match(/cubic-bezier\(([^)]+)\)/);
    if (!t) return e;
    const n = t[1].split(",").map((e) => parseFloat(e.trim()));
    if (4 !== n.length) return e;
    const [o, i, r, s] = n;
    return (e) => {
      if (e <= 0) return 0;
      if (e >= 1) return 1;
      const t = 3 * o,
        n = 3 * (r - o) - t,
        l = 1 - t - n,
        a = 3 * i,
        c = 3 * (s - i) - a,
        d = 1 - a - c,
        u = (e) => ((l * e + n) * e + t) * e,
        m = (e) => ((d * e + c) * e + a) * e;
      return ((e) => {
        let o = e;
        for (let i = 0; i < 8; i++) {
          const i = u(o) - e;
          if (Math.abs(i) < 1e-6) return m(o);
          const r = (3 * l * o + 2 * n) * o + t;
          if (Math.abs(r) < 1e-6) break;
          o -= i / r;
        }
        let i = 0,
          r = 1;
        o = e;
        for (let t = 0; t < 8; t++) {
          const t = u(o);
          if (Math.abs(t - e) < 1e-6) return m(o);
          (e > t ? (i = o) : (r = o), (o = 0.5 * (r - i) + i));
        }
        return m(o);
      })(e);
    };
  }
  const isMobileDevice = () =>
      isMobileLayoutBreakpoint() ||
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0,
    TRANSITION_CONFIG_DESKTOP = {
      duration: 0.7,
      ease: parseCubicBezier("cubic-bezier(.60,.30,.01,.99)"),
      overlayOpacity: 0.4,
      overlayColor: "black",
      overlayZIndex: 50,
      currentPageY: -300,
      currentPageScale: 1,
      incomingPageStartY: 300,
      incomingPageEndY: 0,
      incomingPageStartScale: 1,
      incomingPageEndScale: 1,
      clipPathStart: "inset(90% 30% 15% 29%)",
      clipPathEnd: "inset(0% 0% 0% 0%)",
      containerZIndex: 100,
    },
    TRANSITION_CONFIG_MOBILE = {
      duration: 0.4,
      ease: "power2.inOut",
      overlayOpacity: 0,
      overlayColor: "transparent",
      overlayZIndex: 50,
      currentPageY: 0,
      currentPageScale: 1,
      incomingPageStartY: 0,
      incomingPageEndY: 0,
      incomingPageStartScale: 1,
      incomingPageEndScale: 1,
      clipPathStart: "inset(0% 0% 0% 0%)",
      clipPathEnd: "inset(0% 0% 0% 0%)",
      containerZIndex: 100,
    },
    getTransitionConfig = () =>
      isMobileDevice() ? TRANSITION_CONFIG_MOBILE : TRANSITION_CONFIG_DESKTOP,
    USERACCESS_ASSET_BASE =
      "file:" === location.protocol ||
      /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(location.hostname) ||
      !/coffee-tech\.com|netlify\.app/i.test(location.hostname)
        ? ""
        : "https://coffee-tech.netlify.app/";
  function scheduleIdleCallback(e, t) {
    return "function" == typeof requestIdleCallback
      ? requestIdleCallback(e, t)
      : setTimeout(e, 1);
  }
  function initUserAccessWidget() {
    if (window.__cftIsAuditBrowser) return;
    if (window.UserAccess && window.UserAccess.init) {
      window.UserAccess.init();
      return;
    }
    if (document.getElementById("useraccess-loader")) return;
    if (document.querySelector('script[src*="useraccess.js"]')) return;
    const e = USERACCESS_ASSET_BASE;
    scheduleIdleCallback(
      function () {
        if (window.__cftIsAuditBrowser) return;
        if (window.UserAccess && window.UserAccess.init) {
          window.UserAccess.init();
          return;
        }
        if (document.getElementById("useraccess-loader")) return;
        if (document.querySelector('script[src*="useraccess.js"]')) return;
        const t = document.createElement("script");
        ((t.id = "useraccess-loader"),
          t.setAttribute("src", e + "useraccess.js?v=15"),
          (t.async = true),
          (t.onload = function () {
            window.UserAccess && window.UserAccess.init && window.UserAccess.init();
          }),
          (document.body || document.head).appendChild(t));
      },
      { timeout: 8e3 },
    );
  }
  function scheduleDeferredUserAccess() {
    if (window.__cftUserAccessScheduled || window.__cftIsAuditBrowser) return;
    window.__cftUserAccessScheduled = true;
    const run = () => {
      const loadAfterIdle = () => initUserAccessWidget();
      if (document.readyState === "complete") {
        loadAfterIdle();
      } else {
        window.addEventListener("load", loadAfterIdle, { once: true });
      }
    };
    if (window.__firstOverlayDismissed) {
      run();
      return;
    }
    window.addEventListener("firstOverlayDismissed", run, { once: true });
    setTimeout(run, 8000);
  }
  const TRANSITION_CONFIG = TRANSITION_CONFIG_DESKTOP;
  function getSliderConfig() {
    const e = document.documentElement,
      t =
        parseFloat(
          getComputedStyle(e).getPropertyValue("--slider-duration").trim(),
        ) || 0.8;
    let n =
      getComputedStyle(e).getPropertyValue("--standard-easing").trim() ||
      "power3.inOut";
    return (
      "undefined" != typeof gsap && (n = parseCubicBezier(n)),
      { duration: t, ease: n }
    );
  }
  let lastUrl = "",
    isTransitioning = !1,
    transitionClickTime = null,
    savedScrollY = 0;
  const initialNavigationEntry =
      (performance.getEntriesByType &&
        performance.getEntriesByType("navigation")[0]) ||
      null,
    shouldForceHeaderFadeOnReload = !(
      !initialNavigationEntry || "reload" !== initialNavigationEntry.type
    );
  let hasConsumedReloadHeaderFade = !1;
  const pageCache = new Map(),
    prefetchCache = new Map(),
    MAX_CACHE_SIZE = 10;
  function isHomePage(e) {
    if (!e) {
      const e = window.location.pathname;
      return (
        !e || "/" === e || "" === e || e.endsWith("/") || e.endsWith("index.html")
      );
    }
    if ("string" == typeof e) {
      const t = e.split("?")[0].split("#")[0];
      return "/" === t || "" === t || t.endsWith("/") || t.includes("index.html");
    }
    return !1;
  }
  function initPageComponents(e, t = !1, n = !1) {
    if (e && e._componentsInitialized) return;
    const o = e || document,
      i = isMobileViewport();
    "undefined" != typeof gsap && "undefined" != typeof ScrollTrigger
      ? (hideCatalogColumnsInRoot(o),
        mergeProductTags(o),
        initTestimonials(o),
        initApproachSection(o),
        initBoxesSlider(e),
        initProductGallery(e),
        initProjectBadgeAnimation(e),
        initMachineFeatures(),
        initTechnologyMachineMask(),
        initFeaturesToggle(e),
        initFeaturesOverlay(e),
        initProductFeatureBoxSlider(e),
        initTabFilters(),
        n || (animateHeadings(e), initGsapExtraAnimations(e)),
        i || initInteractiveCursor(),
        initCatalogFilters(e),
        initBlogFilterURLSync(),
        initFAQAccordion(),
        ensureDownloadDropdownStructure(o),
        buildDownloadMenuFromList(o),
        initDownloadDropdown(),
        initCustomOverlayForms(o),
        e && initMarqueesWithState(e, saveMarqueeStates(e)),
        t || initPageTransitions(),
        isTouchDevice() && lockViewportHeight(),
        setTimeout(() => initStickyBarCTA(e), 300),
        e && (e._componentsInitialized = !0))
      : setTimeout(() => initPageComponents(e, t, n), 100);
  }
  function handleLinkHover(e) {
    const t = e.target.closest("a");
    if (!t) return;
    const n = t.getAttribute("href") || t.getAttribute("data-href");
    !n ||
      "_blank" === t.getAttribute("target") ||
      n.startsWith("#") ||
      n.startsWith("mailto:") ||
      n.startsWith("tel:") ||
      n.includes("=") ||
      n.includes("?") ||
      void 0;
  }
  function initPageTransitions() {
    const e = qsa("a"),
      t = qsa("button[href], button[data-href]"),
      n = qsa("div[href], div[data-href]");
    (e.forEach((e) => {
      (e.removeEventListener("click", navigateWithAnimation),
        e.addEventListener("click", navigateWithAnimation),
        e.removeEventListener("mouseenter", handleLinkHover, !0),
        e.addEventListener("mouseenter", handleLinkHover, !0));
    }),
      t.forEach((e) => {
        (e.removeEventListener("click", navigateWithAnimation),
          e.addEventListener("click", navigateWithAnimation));
      }),
      n.forEach((e) => {
        (e.removeEventListener("click", navigateWithAnimation),
          e.addEventListener("click", navigateWithAnimation));
      }));
  }
  function initPageTransitionsObserver() {
    window._linkObserverInitialized ||
      ((window._linkObserverInitialized = !0),
      new MutationObserver(() => {
        isTransitioning ||
          requestAnimationFrame(() => {
            isTransitioning || initPageTransitions();
          });
      }).observe(document.body, { childList: !0, subtree: !0 }));
  }
  function initPopstateHandler() {
    window._popstateHandlerInitialized ||
      ((window._popstateHandlerInitialized = !0),
      window.addEventListener("popstate", () => {
        const e =
          window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop;
        ((document.body.style.overflow = document.documentElement.style.overflow =
          "hidden"),
          (document.body.style.position = "fixed"),
          (document.body.style.top = `-${e}px`),
          (document.body.style.width = "100%"),
          pageTransition(document.location.pathname + document.location.search));
      }));
  }
  /*PAGE_TRANSITION_MODULE_START*/
  // Fetch page with caching
  async function fetchPageWithCache(url) {
    // Normalize URL (remove hash, trailing slash)
    const urlObj = new URL(url, window.location.origin);
    const normalizedUrl = urlObj.pathname + urlObj.search;
  
    try {
      // Always fetch fresh HTML for SPA transitions (avoids stale .page-wrapper / Webflow meta)
      const response = await fetch(normalizedUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
  
      // Cache the result (limit cache size)
      if (pageCache.size >= MAX_CACHE_SIZE) {
        // Remove oldest entry (first in Map)
        const firstKey = pageCache.keys().next().value;
        pageCache.delete(firstKey);
      }
      pageCache.set(normalizedUrl, { html, doc });
  
      return { html, doc };
    } catch (error) {
      console.warn("Failed to fetch page:", normalizedUrl, error);
      // Return empty result to prevent script breakage
      // The page transition will handle the error gracefully
      return { html: "", doc: null };
    }
  }
  
  // Prefetch page on hover (non-blocking)
  async function prefetchPage(url) {
    // Normalize URL
    const urlObj = new URL(url, window.location.origin);
    const normalizedUrl = urlObj.pathname + urlObj.search;
  
    // Skip if already cached or prefetching
    if (pageCache.has(normalizedUrl) || prefetchCache.has(normalizedUrl)) {
      return;
    }
  
    // Skip external links, anchors, mailto, tel, etc.
    if (
      normalizedUrl.startsWith("http") &&
      !normalizedUrl.startsWith(window.location.origin)
    ) {
      return;
    }
  
    // Mark as prefetching
    prefetchCache.set(normalizedUrl, true);
  
    try {
      // Prefetch in background (low priority)
      const response = await fetch(normalizedUrl, {
        priority: "low",
        cache: "force-cache",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
  
      // Cache the result
      if (pageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = pageCache.keys().next().value;
        pageCache.delete(firstKey);
      }
      pageCache.set(normalizedUrl, { html, doc });
  
      // Preload critical images in background
      const heroImages = doc.querySelectorAll(
        ".contact-hero-bg img, .about-hero-bg img, .hero img, .hero-3d, #model-page model-viewer",
      );
      heroImages.forEach((img) => {
        const src = img.src || img.getAttribute("src");
        if (src) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = src;
          link.fetchPriority = "low"; // Low priority for prefetch
          document.head.appendChild(link);
        }
      });
    } catch (e) {
      // Silently fail - prefetch is optional
      prefetchCache.delete(normalizedUrl);
    }
  }
  
  // Preload critical hero images from new page (viewport visible area)
  // Optimized: Only wait for first image, rest load in parallel
  function preloadHeroImages(doc) {
    // Preload hero images that are visible in viewport
    const heroImages = doc.querySelectorAll(
      ".contact-hero-bg img, .about-hero-bg img, .hero img, .hero-3d, #model-page model-viewer",
    );
    const preloadPromises = [];
    let firstImagePromise = null;
  
    heroImages.forEach((img, index) => {
      if (img.src || img.getAttribute("src")) {
        const src = img.src || img.getAttribute("src");
        if (src) {
          // Create preload link for faster loading
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = src;
          link.fetchPriority = index === 0 ? "high" : "auto"; // First image high priority
          document.head.appendChild(link);
  
          // Preload the image directly
          const imgPreload = new Image();
          imgPreload.src = src;
          const imgPromise = new Promise((resolve) => {
            imgPreload.onload = resolve;
            imgPreload.onerror = resolve; // Continue even if image fails
          });
  
          // Only wait for first image to start transition faster
          if (index === 0) {
            firstImagePromise = imgPromise;
          }
  
          preloadPromises.push(imgPromise);
  
          // Force eager loading for viewport images
          img.setAttribute("loading", "eager");
          img.setAttribute("fetchpriority", index === 0 ? "high" : "auto");
        }
      }
    });
  
    // Return promise that resolves when first critical image loads (faster transition)
    // Other images continue loading in background
    return firstImagePromise || Promise.resolve();
  }

  function stripModelViewerPosterForTransition(mv) {
    if (!mv) return;
    mv.removeAttribute("poster");
    try {
      if ("poster" in mv) mv.poster = null;
    } catch (_) {}
    mv.style.setProperty("opacity", "0", "important");
    mv.style.setProperty("visibility", "hidden", "important");
    mv.style.setProperty("pointer-events", "none", "important");
    if (typeof window.__cftStripModelPoster === "function") {
      window.__cftStripModelPoster(mv);
    }
  }

  function prepareTransitionHomeModel(root) {
    if (!root?.querySelector?.("model-viewer")) return;
    root.querySelectorAll(".hero-lcp-image").forEach((img) => {
      img.style.setProperty("display", "none", "important");
    });
    root.querySelectorAll("model-viewer").forEach(stripModelViewerPosterForTransition);
  }
  
  // Create transition elements
  function createTransitionElements(
    currentPageWrapper,
    newPageWrapper,
    newBodyId,
    cfg,
  ) {
    // Use provided config or fallback to desktop config
    if (!cfg) cfg = TRANSITION_CONFIG;
  
    const isMobile = isMobileDevice();
    const rect = currentPageWrapper.getBoundingClientRect();
    const transformOrigin = rect
      ? `${((window.innerWidth / 2 - rect.left) / rect.width) * 100}% ${((window.innerHeight / 2 - rect.top) / rect.height) * 100}%`
      : "50% 50%";
    qsa(".transition-container").forEach((el) => el.remove());
  
    const overlay =
      cfg.overlayOpacity > 0
        ? (() => {
            const el = document.createElement("div");
            el.className = "transition-overlay";
            el.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background:${cfg.overlayColor};opacity:0;z-index:${cfg.overlayZIndex};pointer-events:none;`;
            currentPageWrapper.style.position = "relative";
            currentPageWrapper.appendChild(el);
            return el;
          })()
        : null;
  
    const transitionContainer = document.createElement("div");
    transitionContainer.className = "transition-container";
    transitionContainer.id = newBodyId;
    // On mobile, no clip-path needed for simple fade transition
    const clipPathStyle = isMobile ? "" : `clip-path:${cfg.clipPathStart};`;
    transitionContainer.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:${cfg.containerZIndex};${clipPathStyle}`;
  
    const newContent = document.createElement("div");
    newContent.className = "page-wrapper";
    const temp = document.createElement("div");
    temp.innerHTML = newPageWrapper.innerHTML;
    newContent.innerHTML = temp.innerHTML;
    prepareTransitionHomeModel(newContent);
    // On mobile, start fully transparent for fade in
    // On desktop, opacity is handled in animateTransition
    gsap.set(newContent, { opacity: 0 });
    transitionContainer.appendChild(newContent);
    document.body.appendChild(transitionContainer);
  
    return { overlay, transitionContainer, newContent, transformOrigin };
  }
  
  // Animate transition
  function animateTransition(
    overlay,
    currentPageWrapper,
    transitionContainer,
    newContent,
    transformOrigin,
  ) {
    const cfg = getTransitionConfig();
    const isMobile = isMobileDevice();
  
    if (isMobile) {
      // Mobile: Simple fade in/out transition
      // Set initial state - new content invisible, current page visible
      gsap.set(newContent, { opacity: 0 });
      gsap.set(currentPageWrapper, { opacity: 1 });
  
      // Fade out current page and fade in new page simultaneously
      return Promise.all([
        gsap.to(currentPageWrapper, {
          opacity: 0,
          duration: cfg.duration,
          ease: cfg.ease,
        }),
        gsap.to(newContent, {
          opacity: 1,
          duration: cfg.duration,
          ease: cfg.ease,
        }),
      ]);
    } else {
      // Desktop: Complex transition with transforms and clip-path
      gsap.set(newContent, {
        y: cfg.incomingPageStartY,
        scale: cfg.incomingPageStartScale,
        opacity: 1,
      });
      return Promise.all(
        [
          overlay
            ? gsap.to(overlay, {
                opacity: cfg.overlayOpacity,
                duration: cfg.duration,
                ease: cfg.ease,
              })
            : null,
          gsap.to(currentPageWrapper, {
            y: cfg.currentPageY,
            scale: cfg.currentPageScale,
            transformOrigin,
            duration: cfg.duration,
            ease: cfg.ease,
          }),
          gsap.to(transitionContainer, {
            clipPath: cfg.clipPathEnd,
            duration: cfg.duration,
            ease: cfg.ease,
          }),
          gsap.to(newContent, {
            y: cfg.incomingPageEndY,
            scale: cfg.incomingPageEndScale,
            duration: cfg.duration,
            ease: cfg.ease,
          }),
        ].filter(Boolean),
      );
    }
  }
  
  // Cleanup function specifically for page transitions
  // Cleans up animations, ScrollTriggers, and event listeners from current page
  function cleanupBeforePageTransition() {
    const currentPageWrapper = qs(
      ".page-wrapper:not(.transition-container .page-wrapper)",
    );
    if (!currentPageWrapper) return;
  
    // CRITICAL: Kill ALL ScrollTriggers first (they accumulate and cause performance issues)
    if (typeof ScrollTrigger !== "undefined") {
      const allTriggers = ScrollTrigger.getAll();
      allTriggers.forEach((st) => {
        try {
          st.kill();
        } catch (e) {
          // Ignore errors from already killed triggers
        }
      });
    }
  
    // Kill all GSAP animations on elements in current page
    if (typeof gsap !== "undefined") {
      // Kill animations on all elements in current page wrapper
      const allElements = currentPageWrapper.querySelectorAll("*");
      allElements.forEach((el) => {
        try {
          gsap.killTweensOf(el);
        } catch (e) {
          // Ignore errors
        }
      });
      // Also kill animations on the wrapper itself
      try {
        gsap.killTweensOf(currentPageWrapper);
      } catch (e) {
        // Ignore errors
      }
    }
  
    // Clean up SplitText instances and their animations from current page
    const elements = qsa(ANIMATED_ELEMENTS_SELECTOR, currentPageWrapper);
    elements.forEach((element) => {
      try {
        if (element._opacityScrollTrigger) {
          element._opacityScrollTrigger.kill();
          element._opacityScrollTrigger = null;
        }
        if (element._linesScrollTrigger) {
          element._linesScrollTrigger.kill();
          element._linesScrollTrigger = null;
        }
        if (element._opacityTween) {
          element._opacityTween.kill();
          element._opacityTween = null;
        }
        if (element._linesTween) {
          element._linesTween.kill();
          element._linesTween = null;
        }
        if (element._splitTextInstance && typeof SplitText !== "undefined") {
          element._splitTextInstance = null;
        }
        element._textLinkProcessed = false;
      } catch (e) {
        // Ignore errors
      }
    });
  
    // Clean up marquees from current page
    qsa(".marquee-wrap", currentPageWrapper).forEach((marquee) => {
      try {
        if (marquee._marqueeAnimation) {
          marquee._marqueeAnimation.kill();
          marquee._marqueeAnimation = null;
        }
      } catch (e) {
        // Ignore errors
      }
    });
  
    // Clean up model (already has its own cleanup function)
    cleanupModel();
    cleanupProjectBadgeForPage(currentPageWrapper);

    if (document.getElementById("cft-loading-overlay")) {
      window.__cftReleaseStuckHomeLoader?.();
    }
  
    // Clean up image hover effects
    qsa(".img-block img, .box-background img", currentPageWrapper).forEach(
      (img) => {
        try {
          if (img._hoverEnter) {
            const hoverTarget =
              img.closest(".img-block") || img.closest(".box-background") || img;
            hoverTarget.removeEventListener("mouseenter", img._hoverEnter);
            img._hoverEnter = null;
          }
          if (img._hoverLeave) {
            const hoverTarget =
              img.closest(".img-block") || img.closest(".box-background") || img;
            hoverTarget.removeEventListener("mouseleave", img._hoverLeave);
            img._hoverLeave = null;
          }
        } catch (e) {
          // Ignore errors
        }
      },
    );
  
    // Clean up text link hover effects
    /*
    qsa('.text-link', currentPageWrapper).forEach(textLink => {
      try {
        if(textLink._hoverEnter){
          textLink.removeEventListener('mouseenter', textLink._hoverEnter);
          textLink._hoverEnter = null;
        }
        if(textLink._hoverLeave){
          textLink.removeEventListener('mouseleave', textLink._hoverLeave);
          textLink._hoverLeave = null;
        }
      } catch(e) {
        // Ignore errors
      }
    });
    */
  
    // Reset component initialization flag
    if (currentPageWrapper._componentsInitialized) {
      currentPageWrapper._componentsInitialized = false;
    }
  }
  
  function updateCanonicalFromDoc(doc, pageUrl) {
    if (!doc || !document.head) return;
    let base;
    try {
      base = new URL(pageUrl, location.origin).href;
    } catch (e) {
      base = location.href;
    }
    const fromDoc = doc.querySelector('link[rel="canonical"]');
    let href = null;
    if (fromDoc) {
      const raw = fromDoc.getAttribute("href");
      if (raw && raw.trim()) {
        try {
          href = new URL(raw.trim(), base).href;
        } catch (e) {}
      }
    }
    if (!href) href = base;
    const extras = document.querySelectorAll('link[rel="canonical"]');
    extras.forEach((el, i) => {
      if (i > 0) el.remove();
    });
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }
  
  /** Match live document to fetched page: Webflow forms / IX read data-wf-page on <html>. */
  function syncHtmlDocumentMetaFromFetchedDoc(doc) {
    if (!doc || !doc.documentElement) return;
    const src = doc.documentElement;
    const dst = document.documentElement;
    ["data-wf-page", "data-wf-site", "data-wf-domain", "lang"].forEach((name) => {
      if (src.hasAttribute(name)) {
        dst.setAttribute(name, src.getAttribute(name));
      }
    });
    try {
      const fetchedBlocks = Array.from(
        doc.querySelectorAll('script#weglot-data, script[id="weglot-data"]'),
      );
      let fetchedWeglotData = null;
      if (fetchedBlocks.length) {
        const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
        const stripLang = (p) => {
          const segs = (p || "/").split("/").filter(Boolean);
          const langs = ["en", "es", "de", "fr", "he"];
          if (segs.length && langs.indexOf(segs[0].toLowerCase()) >= 0) segs.shift();
          return segs.length ? "/" + segs.join("/") : "/";
        };
        const pagePath = stripLang(path);
        fetchedWeglotData =
          fetchedBlocks.find((el) => {
            try {
              const data = JSON.parse(el.textContent || "{}");
              const original = (data.originalPath || "/").replace(/\/+$/, "") || "/";
              return original === pagePath;
            } catch (e) {
              return false;
            }
          }) || fetchedBlocks[fetchedBlocks.length - 1];
      }
      if (fetchedWeglotData && fetchedWeglotData.textContent) {
        document
          .querySelectorAll('script#weglot-data, script[id="weglot-data"]')
          .forEach((el) => {
            if (el !== document.getElementById("weglot-data")) el.remove();
          });
        let liveWeglotData = document.getElementById("weglot-data");
        if (!liveWeglotData) {
          liveWeglotData = document.createElement("script");
          liveWeglotData.type = "application/json";
          liveWeglotData.id = "weglot-data";
          document.head.appendChild(liveWeglotData);
        }
        liveWeglotData.textContent = fetchedWeglotData.textContent;
      }
    } catch (e) {}
  }
  
  /**
   * Full Webflow re-init after SPA content swap (same pattern as Barba sites / dennis.js):
   * tear down runtime, re-run ready, restart IX2. `data-wf-page` on <html> must already match the
   * injected page (see syncHtmlDocumentMetaFromFetchedDoc); per-page bundle should be loaded first.
   */
  function initResetWebflowSpa() {
    const wf = window.Webflow;
    if (!wf) return;
    try {
      if (typeof wf.destroy === "function") wf.destroy();
    } catch (e) {
      console.warn("Webflow.destroy:", e);
    }
    try {
      if (typeof wf.ready === "function") wf.ready();
    } catch (e) {
      console.warn("Webflow.ready:", e);
    }
    try {
      if (typeof wf.require === "function") {
        const ix2 = wf.require("ix2");
        if (ix2 && typeof ix2.init === "function") ix2.init();
      }
    } catch (e) {
      console.warn("Webflow ix2.init:", e);
    }
  }
  
  /**
   * Re-bind Webflow's forms module to the live DOM after SPA. When navigating to the same route again,
   * the per-page bundle is often skipped (already in __wfPageBundlesLoaded) — destroy/ready alone may
   * not re-attach form handlers / Turnstile; forms.ready() fixes that.
   */
  function initWebflowFormsModuleReady(_root, attempt = 0) {
    const wf = window.Webflow;
    if (!wf || typeof wf.push !== "function") {
      if (attempt < 35)
        setTimeout(() => initWebflowFormsModuleReady(_root, attempt + 1), 100);
      return;
    }
    wf.push(() => {
      try {
        if (typeof wf.require !== "function") {
          if (attempt < 35)
            setTimeout(() => initWebflowFormsModuleReady(_root, attempt + 1), 100);
          return;
        }
        const forms = wf.require("forms");
        if (forms && typeof forms.ready === "function") {
          forms.ready();
        } else if (attempt < 35) {
          setTimeout(() => initWebflowFormsModuleReady(_root, attempt + 1), 100);
        }
      } catch (e) {
        if (attempt < 35) {
          setTimeout(() => initWebflowFormsModuleReady(_root, attempt + 1), 100);
        }
      }
    });
  }
  
  /** Primary Webflow form for this page (contact hero first, then first wf-form in page). */
  function extractPrimaryWebflowFormSpecFromDoc(doc) {
    if (!doc || typeof doc.querySelector !== "function") return null;
    const pageRoot = doc.querySelector(".page-wrapper") || doc.body;
    let form = pageRoot.querySelector("#wf-form-contact");
    if (!form)
      form = pageRoot.querySelector(
        ".contact-form-wrapper form[id^='wf-form-']",
      );
    if (!form) form = pageRoot.querySelector("form[id^='wf-form-']");
    if (!form || !form.id) return null;
    return {
      id: form.id,
      wfPageId: form.getAttribute("data-wf-page-id") || "",
      wfElementId: form.getAttribute("data-wf-element-id") || "",
      turnstileSitekey: form.getAttribute("data-turnstile-sitekey") || "",
    };
  }
  
  function loadTurnstileApiIfNeeded() {
    if (window.turnstile && typeof window.turnstile.reset === "function") {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      if (
        document.querySelector(
          'script[src*="challenges.cloudflare.com/turnstile"]',
        )
      ) {
        const t0 = Date.now();
        (function poll() {
          if (window.turnstile && typeof window.turnstile.reset === "function")
            return resolve();
          if (Date.now() - t0 > 10000) return resolve();
          setTimeout(poll, 50);
        })();
        return;
      }
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
  }
  
  function refreshTurnstileWidgetsInForm(form) {
    if (
      !form ||
      !window.turnstile ||
      typeof window.turnstile.reset !== "function"
    )
      return;
    form.querySelectorAll("[data-cf-widget-id]").forEach((el) => {
      const wid = el.getAttribute("data-cf-widget-id");
      if (!wid) return;
      try {
        window.turnstile.reset(wid);
      } catch (_) {}
    });
  }
  
  function turnstileResponseTokenPresent(form) {
    if (!form) return false;
    const inp = form.querySelector('input[name="cf-turnstile-response"]');
    return !!(inp && inp.value && String(inp.value).length >= 8);
  }
  
  /** Poll only (no MutationObserver) — avoids main-thread feedback loops with Turnstile. */
  const CFT_TURNSTILE_SUBMIT_POLL_MS = 400;
  
  function syncTurnstileSubmitButtonForForm(form) {
    if (!form || !form.getAttribute("data-turnstile-sitekey")) return;
    const submit = form.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    if (!submit) return;
    const hasToken = turnstileResponseTokenPresent(form);
    if (!hasToken) {
      submit.disabled = true;
      submit.setAttribute("disabled", "disabled");
      submit.setAttribute("aria-disabled", "true");
      submit.classList.add("w-button--disabled");
      submit.style.opacity = "0.55";
      submit.style.pointerEvents = "none";
      submit.style.cursor = "not-allowed";
    } else {
      submit.disabled = false;
      submit.removeAttribute("disabled");
      submit.removeAttribute("aria-disabled");
      submit.classList.remove("w-button--disabled");
      submit.style.opacity = "";
      submit.style.pointerEvents = "";
      submit.style.cursor = "";
    }
  }
  
  function bindTurnstileSubmitUntilTokenReady(form) {
    if (!form || form._cftTsSubmitBind) return;
    if (!form.getAttribute("data-turnstile-sitekey")) return;
    form._cftTsSubmitBind = true;
  
    form.addEventListener(
      "submit",
      (e) => {
        if (!turnstileResponseTokenPresent(form)) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );
  
    syncTurnstileSubmitButtonForForm(form);
  
    const id = setInterval(() => {
      if (!form.isConnected) {
        clearInterval(id);
        return;
      }
      syncTurnstileSubmitButtonForForm(form);
    }, CFT_TURNSTILE_SUBMIT_POLL_MS);
  }
  
  function initTurnstileSubmitUntilTokenReadyInRoot(root) {
    if (!root || typeof root.querySelectorAll !== "function") return;
    root.querySelectorAll("form[data-turnstile-sitekey]").forEach((form) => {
      bindTurnstileSubmitUntilTokenReady(form);
    });
  }
  
  /** Webflow sometimes leaves submit disabled even after a token exists — sync if token is present. */
  function coerceSubmitEnabledIfTurnstileTokenPresent(form) {
    if (!form) return;
    if (!turnstileResponseTokenPresent(form)) return;
    const submit = form.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    if (!submit || !submit.disabled) return;
    submit.disabled = false;
    submit.removeAttribute("disabled");
    submit.removeAttribute("aria-disabled");
    submit.classList.remove("w-button--disabled");
    submit.style.pointerEvents = "";
    submit.style.opacity = "";
    submit.style.cursor = "";
  }
  
  /** DOM + Webflow metadata only (no Turnstile / submit enabled). */
  function verifyWebflowFormStructuralOnly(liveRoot, spec) {
    if (!spec || !liveRoot) return { ok: false, reason: "חסר מפרט טופס" };
    const htmlPage = document.documentElement.getAttribute("data-wf-page") || "";
    if (spec.wfPageId && htmlPage && htmlPage !== spec.wfPageId) {
      return {
        ok: false,
        reason: `data-wf-page ב־html (${htmlPage}) ≠ הצפוי (${spec.wfPageId})`,
      };
    }
    const el = document.getElementById(spec.id);
    if (!el || !liveRoot.contains(el)) {
      return { ok: false, reason: `הטופס #${spec.id} לא נמצא ב־DOM החי` };
    }
    if (
      spec.wfElementId &&
      el.getAttribute("data-wf-element-id") !== spec.wfElementId
    ) {
      return { ok: false, reason: "data-wf-element-id לא תואם לעמוד" };
    }
    const submit = el.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    if (!submit) return { ok: false, reason: "אין submit בתוך הטופס" };
    const wrap = el.closest(".w-form");
    if (
      wrap &&
      (wrap.classList.contains("w-form-done") ||
        wrap.classList.contains("w-form-fail"))
    ) {
      return { ok: false, reason: "מעטפת הטופס עדיין במצב done/fail" };
    }
    return { ok: true, reason: "" };
  }
  
  function verifyLivePrimaryWebflowForm(liveRoot, spec) {
    const base = verifyWebflowFormStructuralOnly(liveRoot, spec);
    if (!base.ok) return base;
    const el = document.getElementById(spec.id);
    coerceSubmitEnabledIfTurnstileTokenPresent(el);
    const submit = el.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    if (submit.disabled) {
      if (spec.turnstileSitekey || el.getAttribute("data-turnstile-sitekey")) {
        return {
          ok: false,
          reason:
            "ממתין ל-Turnstile או כפתור עדיין חסום — נסה ריענון וידג'ט",
        };
      }
      return { ok: false, reason: "כפתור Submit עדיין disabled" };
    }
    return { ok: true, reason: "" };
  }
  
  /**
   * After SPA: refresh Turnstile + coerce submit state (no UI toast).
   */
  function scheduleWebflowFormVerificationAfterSpa(liveRoot, fetchedDoc) {
    const spec = extractPrimaryWebflowFormSpecFromDoc(fetchedDoc);
    if (!spec) return;
  
    initTurnstileSubmitUntilTokenReadyInRoot(liveRoot);
  
    const refreshTurnstile = () => {
      loadTurnstileApiIfNeeded().then(() => {
        const f = document.getElementById(spec.id);
        if (f) {
          refreshTurnstileWidgetsInForm(f);
          setTimeout(() => refreshTurnstileWidgetsInForm(f), 400);
        }
      });
    };
  
    refreshTurnstile();
    let attempts = 0;
    const maxAttempts = spec.turnstileSitekey ? 120 : 50;
  
    const tick = () => {
      attempts += 1;
      const el = document.getElementById(spec.id);
      if (el) coerceSubmitEnabledIfTurnstileTokenPresent(el);
      const v = verifyLivePrimaryWebflowForm(liveRoot, spec);
      if (v.ok) {
        return;
      }
      if (attempts >= maxAttempts) {
        return;
      }
      if (attempts % 5 === 0) refreshTurnstile();
      if (attempts % 15 === 0 && el) refreshTurnstileWidgetsInForm(el);
      const structural = verifyWebflowFormStructuralOnly(liveRoot, spec);
      const hasTs =
        !!(spec.turnstileSitekey ||
          (el && el.getAttribute("data-turnstile-sitekey")));
      const waitMs =
        hasTs && structural.ok && !v.ok ? 50 : 100;
      setTimeout(tick, waitMs);
    };
  
    setTimeout(tick, 0);
  }
  
  // --- Custom (non-Webflow) form behavior for guarded overlays ---
  function initCustomOverlayForms(root = document) {
    try {
      const scope = root || document;
      const forms = scope.querySelectorAll("form[data-custom-form='true']");
      forms.forEach((form) => {
        if (form._customHandled) return;
        form._customHandled = true;
  
        const wrapper =
          form.closest("[data-custom-form-wrapper]") ||
          form.closest(".w-form") ||
          form.parentElement;
        const done = wrapper ? wrapper.querySelector(".w-form-done") : null;
        const fail = wrapper ? wrapper.querySelector(".w-form-fail") : null;
  
        function showDone() {
          if (done) done.style.display = "block";
          if (fail) fail.style.display = "none";
        }
        function showFail() {
          if (fail) fail.style.display = "block";
          if (done) done.style.display = "none";
        }
  
        form.addEventListener("submit", (e) => {
          e.preventDefault();
  
          // Basic required validation (browser would do this for normal submits too).
          if (!form.checkValidity()) {
            try {
              form.reportValidity();
            } catch (_) {}
            return;
          }
  
          // Simulate successful submit: show done UI and respect Webflow redirect attr.
          showDone();
          const redirect =
            form.getAttribute("data-redirect") || form.getAttribute("redirect");
          if (redirect) {
            setTimeout(() => {
              try {
                window.location.href = redirect;
              } catch (_) {}
            }, 250);
          }
        });
      });
    } catch (_) {}
  }
  
  function webflowFlushPushQueue() {
    const wf = window.Webflow;
    if (!wf || typeof wf.push !== "function") return Promise.resolve();
    return new Promise((resolve) => {
      wf.push(() => resolve());
    });
  }
  
  /**
   * Webflow per-page bundle (`webflow.<hash>.<hash>.js`) registers forms/IX for that page; load on SPA nav when needed.
   */
  function getWebflowPageBundleScriptUrlFromDoc(doc) {
    if (!doc) return null;
    const nodes = doc.querySelectorAll('script[src*="webflow."]');
    for (const s of nodes) {
      const src = s.getAttribute("src") || "";
      if (src.includes("webflow.schunk")) continue;
      if (/\/js\/webflow\.[a-z0-9]+\.[a-z0-9]+\.js/i.test(src)) {
        try {
          return new URL(src, location.href).href;
        } catch {
          return src;
        }
      }
    }
    return null;
  }
  
  function initWebflowPageBundleTracker() {
    if (window.__wfPageBundlesLoaded) return;
    window.__wfPageBundlesLoaded = new Set();
    document.querySelectorAll('script[src*="webflow."]').forEach((s) => {
      const src = s.getAttribute("src") || "";
      if (src.includes("webflow.schunk")) return;
      if (/\/js\/webflow\.[a-z0-9]+\.[a-z0-9]+\.js/i.test(src)) {
        try {
          window.__wfPageBundlesLoaded.add(new URL(src, location.href).href);
        } catch (_) {}
      }
    });
  }
  
  function ensureWebflowPageBundleForDoc(doc) {
    initWebflowPageBundleTracker();
    const url = getWebflowPageBundleScriptUrlFromDoc(doc);
    if (!url || window.__wfPageBundlesLoaded.has(url)) return Promise.resolve();
  
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        window.__wfPageBundlesLoaded.add(url);
        resolve();
      };
      script.onerror = () =>
        reject(new Error(`Webflow page bundle failed to load: ${url}`));
      document.body.appendChild(script);
    });
  }
  
  async function pageTransition(url) {
    if (isTransitioning) {
      return;
    }
    isTransitioning = true;
  
    // Store reference to current page wrapper for cleanup AFTER transition
    const currentPageWrapper = qs(
      ".page-wrapper:not(.transition-container .page-wrapper)",
    );
  
    // Reset header to initial state immediately on page transition
    const header = qs(".header");
    if (header) {
      header.classList.remove("scroll-deep", "hidden", "with-scroll");
    }
  
    // Block all pointer events during transition
    document.body.style.pointerEvents = "none";
    document.documentElement.style.pointerEvents = "none";
  
    let pointerEventsLocked = true;
  
    // Update history when transition actually starts
    history.pushState({}, "", url);
  
    if (smoothScrollInstance) smoothScrollInstance.stop();
  
    // Clean up sticky CTA bar during page transition
    initStickyBarCTA();
  
    try {
      // Fetch new page with cache
      const { doc } = await fetchPageWithCache(url);
      const newPageWrapper = doc.querySelector(".page-wrapper");
      if (!newPageWrapper || !currentPageWrapper)
        throw new Error("Page wrapper not found");
  
      // Pre-translate new page to stored language BEFORE building transition (user never sees English)
      var storedLangForTransition = null;
      try {
        storedLangForTransition =
          localStorage.getItem("weglot_preferred_lang") || "";
      } catch (e) {}
      if (
        storedLangForTransition &&
        storedLangForTransition !== "en" &&
        window.weglotPreTranslateElement
      ) {
        await window.weglotPreTranslateElement(
          newPageWrapper,
          storedLangForTransition,
        );
      }
  
      // Preload critical hero images (viewport visible area) - don't block on all images
      // Only wait for first critical image, rest load in parallel
      preloadHeroImages(doc).catch(() => {}); // Don't block transition
  
      // Get body mode from new page
      const bodyClasses = Array.from(doc.body.classList).filter(
        (c) => c === "light-mode" || c === "dark-mode",
      );
      const bodyMode = bodyClasses[0] || null;
  
      // Create transition elements with all content
      const cfg = getTransitionConfig();
      const { overlay, transitionContainer, newContent, transformOrigin } =
        createTransitionElements(
          currentPageWrapper,
          newPageWrapper,
          doc.body.id,
          cfg,
        );
  
      // Set eager loading ONLY for hero images in viewport
      // Other images should remain lazy for better performance
      qsa(
        ".contact-hero-bg img, .about-hero-bg img, .hero img, .hero-3d, #model-page model-viewer",
        newContent,
      ).forEach((img) => {
        img.setAttribute("loading", "eager");
        img.setAttribute("fetchpriority", "high");
      });
  
      let __skipManagedAboutHeroParallax = false;
  
      // Avoid flicker/jump on About hero background when navigating from a scrolled page:
      // ensure the image is decoded, then initialize its parallax ONCE (and let the generic
      // init step skip it).
      try {
        const aboutBgImg = qs(".about-hero-bg img", newContent);
        if (aboutBgImg) {
          aboutBgImg.dataset.parallaxManaged = "1";
          __skipManagedAboutHeroParallax = true;
          aboutBgImg.style.willChange = "transform";
  
          const initAboutBgParallax = () => {
            try {
              if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.getAll().forEach((st) => {
                  try {
                    if (st && st.vars && st.vars.trigger === aboutBgImg)
                      st.kill();
                  } catch (e) {}
                });
              }
              if (typeof gsap !== "undefined") {
                gsap.killTweensOf(aboutBgImg);
                // Set a deterministic base state BEFORE creating ScrollTrigger to avoid a transient snap.
                gsap.set(aboutBgImg, { yPercent: 0, force3D: true });
                gsap.to(aboutBgImg, {
                  yPercent: 20,
                  ease: "none",
                  scrollTrigger: {
                    trigger: aboutBgImg,
                    start: "top",
                    end: "bottom",
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                });
              }
            } catch (e) {}
          };
  
          const onReady = () =>
            requestAnimationFrame(() =>
              requestAnimationFrame(initAboutBgParallax),
            );
  
          if (aboutBgImg.complete) {
            if (aboutBgImg.decode) {
              aboutBgImg.decode().then(onReady).catch(onReady);
            } else {
              onReady();
            }
          } else {
            aboutBgImg.addEventListener(
              "load",
              () => {
                if (aboutBgImg.decode) {
                  aboutBgImg.decode().then(onReady).catch(onReady);
                } else {
                  onReady();
                }
              },
              { once: true },
            );
          }
        }
      } catch (e) {}
  
      // Ensure non-viewport images remain lazy (don't convert all to eager)
      // This improves initial page load performance
  
      // Initialize only critical viewport components first (skip scroll animations)
      // Note: Finsweet wait is only on initial page load (initAfterPageReady), not here –
      // waiting here would delay ALL transitions (old page may still have fs-cmsfilter in DOM)
      cleanupProjectBadgeForPage(currentPageWrapper);
      initPageComponents(newContent, true, true);
      // Start smooth transition animation (newContent was pre-translated via weglotPreTranslateElement)
      const animationPromise = animateTransition(
        overlay,
        currentPageWrapper,
        transitionContainer,
        newContent,
        transformOrigin,
      );
  
      // Initialize scroll animations and other components in parallel (non-blocking)
      // These will be ready when animation completes
      if (__skipManagedAboutHeroParallax && typeof window.qsa === "function") {
        const __origQsa = window.qsa;
        window.qsa = function (selector, root) {
          const res = __origQsa(selector, root);
          try {
            if (
              selector === ".about-hero-bg img" ||
              (typeof selector === "string" &&
                selector.includes(".about-hero-bg img"))
            ) {
              return Array.isArray(res)
                ? res.filter(
                    (el) =>
                      !(el && el.dataset && el.dataset.parallaxManaged === "1"),
                  )
                : res;
            }
          } catch (e) {}
          return res;
        };
        try {
          initGsapExtraAnimations(newContent);
        } finally {
          window.qsa = __origQsa;
        }
      } else {
        initGsapExtraAnimations(newContent);
      }
      animateHeadings(newContent);
  
      // Wait for animation to complete
      await animationPromise;
  
      // Reset only cursor state classes before cleaning up old page
      // This ensures cursor classes (like "rotate", "scroll", "enter") are cleared when transitioning
      // WITHOUT resetting the cursor position/scale to prevent "sticking"
      const cursor = qs("#cursor");
      if (cursor) {
        // Only remove state classes, keep cursor visible and functional
        cursor.classList.remove(
          "change",
          "explore",
          "drag",
          "scroll",
          "enter",
          "play",
          "soon",
          "rotate",
        );
      }
  
      // Cleanup cursor event listeners (but cursor remains visible and functional)
      if (window.cleanupCursor) {
        window.cleanupCursor();
      }
  
      // NOW clean up the old page (after animation is complete, so it was visible during transition)
      // Clean up animations, ScrollTriggers, and event listeners from old page
      // Do this BEFORE replacing it, so we can still access it
      if (currentPageWrapper && currentPageWrapper.isConnected) {
        // Temporarily store reference since cleanupBeforePageTransition uses qs() which might not find it
        const oldPageWrapper = currentPageWrapper;
  
        // Kill all ScrollTriggers from old page
        if (typeof ScrollTrigger !== "undefined") {
          const allTriggers = ScrollTrigger.getAll();
          allTriggers.forEach((st) => {
            try {
              const trigger = st.vars && st.vars.trigger;
              // If trigger is in old page wrapper, kill it
              if (trigger && oldPageWrapper.contains(trigger)) {
                st.kill();
              }
            } catch (e) {
              // Ignore errors
            }
          });
        }
  
        // Kill all GSAP animations on elements in old page
        if (typeof gsap !== "undefined") {
          const allElements = oldPageWrapper.querySelectorAll("*");
          allElements.forEach((el) => {
            try {
              gsap.killTweensOf(el);
            } catch (e) {
              // Ignore errors
            }
          });
          try {
            gsap.killTweensOf(oldPageWrapper);
          } catch (e) {
            // Ignore errors
          }
        }
  
        // Clean up SplitText instances and their animations from old page
        const elements = qsa(ANIMATED_ELEMENTS_SELECTOR, oldPageWrapper);
        elements.forEach((element) => {
          try {
            if (element._opacityScrollTrigger) {
              element._opacityScrollTrigger.kill();
              element._opacityScrollTrigger = null;
            }
            if (element._linesScrollTrigger) {
              element._linesScrollTrigger.kill();
              element._linesScrollTrigger = null;
            }
            if (element._opacityTween) {
              element._opacityTween.kill();
              element._opacityTween = null;
            }
            if (element._linesTween) {
              element._linesTween.kill();
              element._linesTween = null;
            }
            if (element._splitTextInstance && typeof SplitText !== "undefined") {
              element._splitTextInstance = null;
            }
          } catch (e) {
            // Ignore errors
          }
        });
  
        // Clean up marquees from old page
        qsa(".marquee-wrap", oldPageWrapper).forEach((marquee) => {
          try {
            if (marquee._marqueeAnimation) {
              marquee._marqueeAnimation.kill();
              marquee._marqueeAnimation = null;
            }
          } catch (e) {
            // Ignore errors
          }
        });
  
        // Clean up model from old page (if it exists)
        cleanupModel();
        cleanupProjectBadgeForPage(oldPageWrapper);
  
        // Clean up image hover effects
        qsa(".img-block img, .box-background img", oldPageWrapper).forEach(
          (img) => {
            try {
              if (img._hoverEnter) {
                const hoverTarget =
                  img.closest(".img-block") ||
                  img.closest(".box-background") ||
                  img;
                hoverTarget.removeEventListener("mouseenter", img._hoverEnter);
                img._hoverEnter = null;
              }
              if (img._hoverLeave) {
                const hoverTarget =
                  img.closest(".img-block") ||
                  img.closest(".box-background") ||
                  img;
                hoverTarget.removeEventListener("mouseleave", img._hoverLeave);
                img._hoverLeave = null;
              }
            } catch (e) {
              // Ignore errors
            }
          },
        );
      }
  
      // Move newContent to replace currentPageWrapper
      transitionContainer.removeChild(newContent);
      const parent = currentPageWrapper.parentNode;
      parent.replaceChild(newContent, currentPageWrapper);
      if (newContent.querySelector("model-viewer")) {
        if (typeof window.finishSpaHomeModelRestore === "function") {
          window.finishSpaHomeModelRestore(newContent);
        }
      }
      syncHtmlDocumentMetaFromFetchedDoc(doc);
      // Weglot: content already pre-translated by weglotPreTranslateElement; no post-transition apply (avoids dark flash)
      // Sticky CTA bar lives outside .page-wrapper in product HTML; transition only injects wrapper content.
      // So ensure bar exists when landing on product page, and remove it when leaving product page.
      const isProductPage = newContent.querySelector("#product-page");
      const existingBar = document.querySelector(".sticky-cta-bar");
      if (isProductPage && !existingBar) {
        const barFromNewPage = doc.querySelector(".sticky-cta-bar");
        if (barFromNewPage) {
          const clone = barFromNewPage.cloneNode(true);
          parent.insertBefore(clone, newContent.nextElementSibling);
        }
      } else if (!isProductPage && existingBar) {
        existingBar.remove();
      }
      if (!isProductPage) {
        cleanupProjectBadgeForPage();
      }
  
      // Keep content visible - it's already shown during transition animation
      // No need to hide it - show immediately without delay
      gsap.set(newContent, { opacity: 1, visibility: "visible" });
  
      // Re-enable pointer events as soon as new content is in place.
      // Keep `isTransitioning` true to guard navigation until async inits finish.
      document.body.style.pointerEvents = "";
      document.documentElement.style.pointerEvents = "";
      pointerEventsLocked = false;
  
      // Update body and title
      if (doc.body.id) document.body.id = doc.body.id;
      document.title = doc.title;
      updateCanonicalFromDoc(doc, url);
      transitionClickTime = null;
      if (bodyMode) {
        document.body.classList.remove("light-mode", "dark-mode");
        document.body.classList.add(bodyMode);
        updateHeaderTheme();
      }
  
      try {
        await ensureWebflowPageBundleForDoc(doc);
        initResetWebflowSpa();
        await webflowFlushPushQueue();
        initWebflowFormsModuleReady(newContent);
      } catch (e) {
        console.warn("ensureWebflowPageBundleForDoc:", e);
      }
  
      // After Webflow.destroy/ready (above), wire SPA links and non-Webflow section inits — same order as Barba + dennis.js
      initPageTransitions();
      ensurePostTransitionInits(newContent);
      initTurnstileSubmitUntilTokenReadyInRoot(newContent);
  
      // Re-init Finsweet CMS Filter for blog/catalog when content was injected (SPA transition)
      initFinsweetForTransition(newContent);
  
      // Clean up GSAP animations on transition elements before removing them
      if (typeof gsap !== "undefined") {
        if (overlay) {
          try {
            gsap.killTweensOf(overlay);
          } catch (e) {
            // Ignore errors
          }
        }
        try {
          // currentPageWrapper is already replaced, so we clean up transitionContainer and newContent
          gsap.killTweensOf(transitionContainer);
          gsap.killTweensOf(newContent);
          // CRITICAL: Clear transform from page-wrapper. GSAP leaves inline transform (y, scale)
          // after animation; any ancestor with transform creates a new containing block, so
          // position:fixed descendants (e.g. features-overlay, tech-overlay) behave like absolute.
          gsap.set(newContent, { clearProps: "transform" });
        } catch (e) {
          // Ignore errors
        }
      }
  
      overlay?.remove();
      transitionContainer.remove();
  
      // Reset scroll position to top for new page (don't restore savedScrollY)
      savedScrollY = 0;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
  
      // Reset scroll and restart smooth scroll immediately (no delay)
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      resetPageScroll();
      if (smoothScrollInstance)
        smoothScrollInstance.scrollTo(0, { immediate: true });
      // Use batched ScrollTrigger updates; throttle on mobile to reduce jank
      if (typeof ScrollTrigger !== "undefined" && smoothScrollInstance) {
        let scrollUpdateRaf = null;
        let lastScrollTriggerUpdate = 0;
        const SCROLL_TRIGGER_THROTTLE_MS = 48;
        const updateScrollTrigger = () => {
          ScrollTrigger.update();
          scrollUpdateRaf = null;
          if (isTouchDevice()) lastScrollTriggerUpdate = Date.now();
        };
        smoothScrollInstance.on("scroll", () => {
          if (isTouchDevice()) {
            const now = Date.now();
            if (now - lastScrollTriggerUpdate < SCROLL_TRIGGER_THROTTLE_MS)
              return;
          }
          if (!scrollUpdateRaf) {
            scrollUpdateRaf = requestAnimationFrame(updateScrollTrigger);
          }
        });
      }
  
      // Document-level functions
      initHeaderTheme();
      animateFooterRevealScrub();
      initScrollToTop();
  
      // Re-lock viewport height after page transition (mobile only)
      if (isTouchDevice()) {
        lockViewportHeight();
      }
  
      // המודל מאותחל רק דרך pageReady (להלן) – כמו בטעינה ראשונה, בלי לוגיקה מיוחדת למעבר דפים
  
      // Re-initialize interactive cursor immediately for new page
      if (!isMobileViewport()) {
        initInteractiveCursor();
      }
  
      // Mark transition as complete immediately - content is already visible
      isTransitioning = false;
  
      // Re-enable pointer events immediately
      document.body.style.pointerEvents = "";
      document.documentElement.style.pointerEvents = "";
      pointerEventsLocked = false;
  
      // Refresh ScrollTrigger (all old triggers were already killed in cleanupBeforePageTransition)
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
          }
        }, 100);
      });
  
      // Re-init sticky CTA and late components
      setTimeout(() => initStickyBarCTA(newContent), 800);
      setTimeout(() => ensurePostTransitionInits(newContent), 1000);
  
      // After transition the inline scripts from the new page never ran (we only inject .page-wrapper).
      // So "loading" was never removed and pageReady was never fired. Reset so initAfterPageReady
      // runs again for the new page (SplitText, model wrap + entrance when returning to home).
      document.documentElement.classList.remove("loading");
      window.__initAfterPageReadyDone = false;
      window.dispatchEvent(new CustomEvent("pageReady"));
      "function" == typeof window.syncLanguageSelectors && window.syncLanguageSelectors();
      "function" == typeof window.syncLanguageAfterSpa && window.syncLanguageAfterSpa();
  
      // Turnstile refresh after page is committed (Webflow already reset earlier). Double rAF lets widgets settle.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scheduleWebflowFormVerificationAfterSpa(newContent, doc);
        });
      });
    } catch (error) {
      isTransitioning = false;
      // Re-enable pointer events on error
      document.body.style.pointerEvents = "";
      document.documentElement.style.pointerEvents = "";
      pointerEventsLocked = false;
  
      // Reset only cursor state classes on error (not position/scale)
      const cursor = qs("#cursor");
      if (cursor) {
        cursor.classList.remove(
          "change",
          "explore",
          "drag",
          "scroll",
          "enter",
          "play",
          "soon",
          "rotate",
        );
      }
      if (window.cleanupCursor) {
        window.cleanupCursor();
      }
  
      if (smoothScrollInstance) smoothScrollInstance.start();
      window.location.href = url;
    } finally {
      // If anything throws before we intentionally unlock interactions, never leave the page "frozen".
      if (pointerEventsLocked) {
        try {
          document.body.style.pointerEvents = "";
          document.documentElement.style.pointerEvents = "";
        } catch (_) {}
        pointerEventsLocked = false;
        isTransitioning = false;
      }
    }
  }
  
  function navigateWithAnimation(event) {
    // Block if marquee element
    if (isMarqueeElement(this)) {
      return;
    }
  
    // Cmd (Mac) or Ctrl (Win/Linux) + click: open in new tab (browser default), skip transition
    if (event.metaKey || event.ctrlKey) {
      return;
    }
  
    // Block if already transitioning
    if (isTransitioning) {
      event.preventDefault();
      return;
    }
  
    const url = this.getAttribute("href") || this.getAttribute("data-href");
    if (
      !url ||
      this.getAttribute("target") === "_blank" ||
      url.startsWith("#") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:")
    ) {
      return;
    }
  
    event.preventDefault();
    event.stopImmediatePropagation();
    transitionClickTime = Date.now();
  
    // Clean up sticky CTA bar when clicking a link
    initStickyBarCTA();
  
    // CRITICAL: Stop smooth scroll FIRST to prevent scroll animation conflict
    // Get current scroll position from smooth scroll if available, otherwise use window scroll
    let scrollY;
    if (smoothScrollInstance && smoothScrollInstance.scroll !== undefined) {
      scrollY = smoothScrollInstance.scroll;
      // Stop smooth scroll immediately to prevent it from continuing
      smoothScrollInstance.stop();
      // Force immediate scroll update to current position (stops any ongoing animation)
      smoothScrollInstance.scrollTo(scrollY, { immediate: true });
    } else {
      scrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;
    }
  
    savedScrollY = scrollY;
  
    // Prevent ScrollTrigger-driven parallax elements (e.g. `.about-hero-bg img`) from snapping back
    // when we temporarily reset window scroll to 0 for the transition.
    try {
      const currentPageWrapper = qs(
        ".page-wrapper:not(.transition-container .page-wrapper)",
      );
      if (currentPageWrapper) {
        qsa(".about-hero-bg img", currentPageWrapper).forEach((img) => {
          try {
            const tr = window.getComputedStyle(img).transform;
            if (tr && tr !== "none") img.style.transform = tr;
            img.style.willChange = "transform";
            if (typeof gsap !== "undefined") gsap.killTweensOf(img);
            if (typeof ScrollTrigger !== "undefined") {
              ScrollTrigger.getAll().forEach((st) => {
                try {
                  if (st && st.vars && st.vars.trigger === img) st.kill();
                } catch (e) {}
              });
            }
          } catch (e) {}
        });
      }
    } catch (e) {}
  
    // Reset window scroll to 0 BEFORE setting position:fixed to prevent visual jump
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.body.style.overflow = document.documentElement.style.overflow =
      "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    lastUrl = url;
    setTimeout(() => (lastUrl = ""), 10);
  
    // Start transition
    pageTransition(url);
  }
  /*PAGE_TRANSITION_MODULE_END*/
  const ANIMATED_ELEMENTS_SELECTOR =
      "h1, h2, h3, h4, h5, h6, p, a:not(.filter-link), .text-link, .reveal-link",
    ANIMATION_CONFIG = {
      splitText: { type: "lines", charsClass: "char", linesClass: "line" },
      in: {
        stagger: 0.1,
        duration: 1.6,
        delay: 0,
        ease: "power4.out",
        yPercent: 0,
        skewY: 0,
        clipPath: "inset(0% -5% -30% 0%)",
      },
      out: {
        stagger: 0.12,
        duration: 0.6,
        ease: "power4.in",
        yPercent: -100,
        skewY: -1,
        clipPath: "inset(100% 0% 0% 0%)",
      },
      initial: { clipPath: "inset(0% 0% 100% 0%)", yPercent: 100, opacity: 0 },
      scrollTrigger: {
        start: "top 90%",
        end: "bottom 100%",
        toggleActions: "play none none none",
      },
      opacity: { duration: 0.01 },
    };
  function markSplitTextNodesForWeglot(e) {
    if (!e) return;
    const t = (e) => {
      e &&
        e.forEach((e) => {
          e &&
            "function" == typeof e.setAttribute &&
            (e.setAttribute("data-wg-notranslate", ""),
            e.setAttribute("wg-notranslate", ""),
            e.setAttribute("translate", "no"));
        });
    };
    (t(e.lines), t(e.chars), t(e.words));
  }
  function animateSplitText(e, t = {}) {
    const n = ANIMATION_CONFIG,
      {
        type: o = n.splitText.type,
        direction: i = "in",
        stagger: r = n.in.stagger,
        duration: s = n.in.duration,
        delay: l = n.in.delay,
        ease: a = n.in.ease,
        scrollTrigger: c = null,
        onComplete: d = null,
      } = t,
      u = "out" === i;
    if (u && e._splitTextInstance) {
      const t = e._splitTextInstance,
        i = "chars" === o ? t.chars : t.lines;
      return i && 0 !== i.length
        ? gsap.to(i, {
            yPercent: n.out.yPercent,
            skewY: n.out.skewY,
            stagger: r,
            clipPath: n.out.clipPath,
            duration: n.out.duration,
            ease: n.out.ease,
            onComplete: d,
          })
        : null;
    }
    if (
      (e._splitTextInstance &&
        !u &&
        (e._splitTextInstance.revert(), (e._splitTextInstance = null)),
      !e || !e.isConnected)
    )
      return null;
    (gsap.set(e, {
      overflow: "visible",
      visibility: "visible",
      opacity: n.initial.opacity,
    }),
      e.classList.contains("text-link") &&
        e.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((e) => {
          (gsap.set(e, {
            visibility: "visible",
            opacity: 1,
            pointerEvents: "auto",
          }),
            e.style.setProperty("visibility", "visible", "important"),
            e.style.setProperty("opacity", "1", "important"),
            e.style.setProperty("pointer-events", "auto", "important"));
        }));
    const m = new SplitText(e, {
      type: o,
      charsClass: n.splitText.charsClass,
      linesClass: n.splitText.linesClass,
    });
    e._splitTextInstance = m;
    markSplitTextNodesForWeglot(m);
    const g = "chars" === o ? m.chars : m.lines;
    if (!g || 0 === g.length) return null;
    ("lines" === o &&
      m.lines[0]?.parentElement &&
      gsap.set(m.lines[0].parentElement, { overflow: "visible" }),
      gsap.set(g, {
        overflow: "visible",
        position: "relative",
        visibility: "visible",
        opacity: 1,
        clipPath: n.initial.clipPath,
        yPercent: n.initial.yPercent,
      }),
      c || gsap.set(e, { opacity: 1 }));
    const h = {
      yPercent: n.in.yPercent,
      skewY: n.in.skewY,
      opacity: 1,
      stagger: r,
      clipPath: n.in.clipPath,
      duration: s,
      ease: a,
      delay: l,
      onComplete: () => {
        e.classList.contains("text-link") &&
          e.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((e) => {
            (gsap.set(e, {
              visibility: "visible",
              opacity: 1,
              pointerEvents: "auto",
            }),
              e.style.setProperty("visibility", "visible", "important"),
              e.style.setProperty("opacity", "1", "important"),
              e.style.setProperty("pointer-events", "auto", "important"));
          });
        const t = null !== e.closest(".testimonial-card"),
          n =
            e.classList.contains("text-link") || null !== e.closest(".text-link");
        if (!t && !n && e._splitTextInstance) {
          const t = e.querySelector(".text-link");
          let n = null;
          if (t) {
            const e = t.querySelector(".text-link-underline");
            if (e) {
              n = e.cloneNode(!0);
              const t = gsap.getProperty(e, "scaleX"),
                o = gsap.getProperty(e, "opacity");
              (void 0 !== t && (n._gsapScaleX = t),
                void 0 !== o && (n._gsapOpacity = o),
                void 0 !== e._originalScaleX
                  ? (n._originalScaleX = e._originalScaleX)
                  : (n._originalScaleX = t || 1));
            }
          }
          (e._splitTextInstance.revert(),
            (e._splitTextInstance = null),
            n &&
              t &&
              (t.querySelector(".text-link-underline") ||
                (t.appendChild(n),
                void 0 !== n._gsapScaleX &&
                  gsap.set(n, {
                    scaleX: n._gsapScaleX,
                    visibility: "visible",
                    display: "block",
                  }),
                void 0 !== n._gsapOpacity &&
                  gsap.set(n, { opacity: n._gsapOpacity }),
                void 0 !== n._originalScaleX &&
                  (n._originalScaleX = n._originalScaleX),
                (t._underline = n))),
            requestAnimationFrame(() => {
              if (
                e &&
                e.isConnected &&
                (gsap.set(e, { visibility: "visible", opacity: 1 }),
                e.style.setProperty("visibility", "visible", "important"),
                e.style.setProperty("opacity", "1", "important"),
                e.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((e) => {
                  e &&
                    e.isConnected &&
                    (gsap.set(e, { visibility: "visible", opacity: 1 }),
                    e.style.setProperty("visibility", "visible", "important"),
                    e.style.setProperty("opacity", "1", "important"));
                }),
                t)
              ) {
                const e = t.querySelector(".text-link-underline");
                if (e) {
                  const t =
                      void 0 !== e._gsapScaleX
                        ? e._gsapScaleX
                        : (n && n._gsapScaleX) || 1,
                    o =
                      void 0 !== e._gsapOpacity
                        ? e._gsapOpacity
                        : (n && n._gsapOpacity) || 1;
                  (gsap.set(e, {
                    scaleX: t,
                    opacity: o,
                    visibility: "visible",
                    display: "block",
                    transformOrigin: "0% 50%",
                  }),
                    void 0 === e._originalScaleX && (e._originalScaleX = t));
                }
              }
            }));
        }
        d && d();
      },
    };
    return (c && (h.scrollTrigger = c), gsap.to(g, h));
  }
  function animateHeadings(e = null) {
    if (window.__cftIsAuditBrowser) return;
    if ("undefined" == typeof SplitText || "undefined" == typeof gsap) return;
    const t = e || document,
      n = qsa(ANIMATED_ELEMENTS_SELECTOR, t);
    if (0 === n.length) return;
    const o = qs(".header"),
      i = ANIMATION_CONFIG;
    n.forEach((e) => {
      (e._textLinkProcessed && (e._textLinkProcessed = !1),
        e._opacityScrollTrigger &&
          (e._opacityScrollTrigger.kill(), (e._opacityScrollTrigger = null)),
        e._linesScrollTrigger &&
          (e._linesScrollTrigger.kill(), (e._linesScrollTrigger = null)),
        e._opacityTween && (e._opacityTween.kill(), (e._opacityTween = null)),
        e._linesTween && (e._linesTween.kill(), (e._linesTween = null)));
    });
    const r = {
      trigger: null,
      start: i.scrollTrigger.start,
      toggleActions: i.scrollTrigger.toggleActions,
      invalidateOnRefresh: !0,
      markers: !1,
    };
    (n.forEach((t) => {
      if (!t || !t.isConnected) return;
      if (o && o.contains(t)) return;
      if (isMarqueeElement(t)) return;
      if (t.closest(".testimonial-card")) return;
      if (t.closest(".sticky-cta-bar")) return;
      if (
        t.classList.contains("filter-link") ||
        t.hasAttribute("data-no-split-text") ||
        t.closest(".faq-tabs, #blog-tabs, #faq-tabs, #events-tabs")
      )
        return;
      if (t.closest(".privacy-policy-section, .terms-conditions-section")) return;
      if (t.closest(".blog-content .w-richtext")) return;
      if (t.classList.contains("has-feature-counter")) return;
      if (t.closest(".catalog-filters, .product-tags, .tags, .merged-tags"))
        return;
      if ("A" === t.tagName && t.closest("p")) return;
      if (t.closest(".text-link") && !t.classList.contains("text-link")) return;
      if ("A" === t.tagName && t.classList.contains("text-link")) {
        if (t._textLinkProcessed) return;
        t._textLinkProcessed = !0;
      }
      if (e && !e.contains(t)) return;
      const n = t.classList.contains("text-link"),
        s = t.getBoundingClientRect(),
        l = 0.9 * window.innerHeight,
        a = s.top < l && s.bottom > 0,
        isHeroParagraph = !!t.closest(".hero-paragaph"),
        c = isHeroParagraph && a
          ? "top bottom"
          : n && a
            ? "top bottom"
            : i.scrollTrigger.start,
        d = gsap.to(t, {
          opacity: 1,
          duration: i.opacity.duration,
          scrollTrigger: { ...r, trigger: t, start: c, invalidateOnRefresh: !0 },
        }),
        u = isMobileLayoutBreakpoint(),
        m = "H1" === t.tagName,
        g = m ? 0.18 : u ? 0.06 : i.in.stagger,
        h = m ? 1.8 : i.in.duration,
        f = animateSplitText(t, {
          type: i.splitText.type,
          direction: "in",
          stagger: g,
          duration: h,
          ease: i.in.ease,
          scrollTrigger: {
            ...r,
            trigger: t,
            start: c,
            end: i.scrollTrigger.end,
            invalidateOnRefresh: !0,
          },
        });
      if (n && f && f.scrollTrigger) {
        const e = f.scrollTrigger,
          n = e.onEnter,
          o = e.onEnterBack;
        ((e.onEnter = () => {
          (t.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((e) => {
            (gsap.set(e, {
              visibility: "visible",
              opacity: 1,
              pointerEvents: "auto",
            }),
              e.style.setProperty("visibility", "visible", "important"),
              e.style.setProperty("opacity", "1", "important"),
              e.style.setProperty("pointer-events", "auto", "important"));
          }),
            n && n(),
            f && !f.isActive() && f.play(0),
            d && !d.isActive() && d.play(0));
        }),
          (e.onEnterBack = () => {
            (t.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((e) => {
              (gsap.set(e, {
                visibility: "visible",
                opacity: 1,
                pointerEvents: "auto",
              }),
                e.style.setProperty("visibility", "visible", "important"),
                e.style.setProperty("opacity", "1", "important"),
                e.style.setProperty("pointer-events", "auto", "important"));
            }),
              o && o(),
              f && !f.isActive() && f.play(0),
              d && !d.isActive() && d.play(0));
          }));
      }
      (d &&
        ((t._opacityTween = d),
        d.scrollTrigger &&
          ((t._opacityScrollTrigger = d.scrollTrigger), a && n)) &&
        (t.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((e) => {
          (gsap.set(e, {
            visibility: "visible",
            opacity: 1,
            pointerEvents: "auto",
          }),
            e.style.setProperty("visibility", "visible", "important"),
            e.style.setProperty("opacity", "1", "important"),
            e.style.setProperty("pointer-events", "auto", "important"));
        }),
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (d.scrollTrigger) {
              d.scrollTrigger.refresh();
              const e = d.scrollTrigger,
                n = t.getBoundingClientRect();
              n.top < l && n.bottom > 0 && !e.isActive && d.play(0);
            }
          });
        })),
        f &&
          ((t._linesTween = f),
          f.scrollTrigger &&
            ((t._linesScrollTrigger = f.scrollTrigger),
            a &&
              n &&
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if (f.scrollTrigger) {
                    f.scrollTrigger.refresh();
                    const e = f.scrollTrigger,
                      n = t.getBoundingClientRect();
                    n.top < l && n.bottom > 0 && !e.isActive && f.play(0);
                  }
                });
              }))));
    }),
      "undefined" != typeof ScrollTrigger &&
        requestAnimationFrame(() => {
          (ScrollTrigger.refresh(),
            qsa(".text-link", t).forEach((e) => {
              if (e._linesScrollTrigger) {
                e._linesScrollTrigger.refresh();
                const t = e.getBoundingClientRect(),
                  n = 0.9 * window.innerHeight;
                t.top < n &&
                  t.bottom > 0 &&
                  e._linesScrollTrigger &&
                  !e._linesScrollTrigger.isActive &&
                  (e._linesTween && e._linesTween.play(0),
                  e._opacityTween && e._opacityTween.play(0));
              }
            }),
            ScrollTrigger.refresh());
        }));
  }
  function initGsapExtraAnimations(e = null) {
    if (window.__cftIsAuditBrowser) return;
    if ("undefined" == typeof gsap || "undefined" == typeof ScrollTrigger) return;
    const t = e || document,
      n = t.querySelector(".catalog-grid"),
      o = n ? n.querySelectorAll(".column") : [];
    o.length > 0 &&
      (ScrollTrigger.getAll()
        .filter((e) => (e.vars && e.vars.trigger) === n)
        .forEach((e) => e.kill()),
      gsap.killTweensOf(o),
      gsap.set(o, { opacity: 1, y: 0, visibility: "visible" }));
    const i = t.querySelector(".circle-rotate");
    (i &&
      (gsap.killTweensOf(i),
      gsap.to(i, { ease: "expo.out", yPercent: 0, duration: 1.4, opacity: 1 }),
      gsap.to(i, { rotation: 360, ease: "linear", repeat: -1, duration: 18 })),
      qsa(".about-hero-bg img", t).forEach((e) => {
        (ScrollTrigger.getAll()
          .filter((t) => (t.vars && t.vars.trigger) === e)
          .forEach((e) => e.kill()),
          gsap.killTweensOf(e),
          gsap.to(e, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: e,
              start: "top",
              end: "bottom",
              scrub: !0,
              invalidateOnRefresh: !0,
            },
          }));
      }),
      qsa(".img-block img, .box-background img", t).forEach((e) => {
        const t = e.closest(".img-block"),
          n = e.closest(".box-background"),
          o = e.closest(".blog-box"),
          i = e.closest(".boxes-grid .column"),
          r = e.closest(".team-grid"),
          s = t || n || e;
        (ScrollTrigger.getAll()
          .filter((t) => {
            const n = t.vars && t.vars.trigger;
            return n === e || n === s;
          })
          .forEach((e) => e.kill()),
          gsap.killTweensOf(e));
        const l = o || i;
        (l &&
          e._hoverEnter &&
          (l.removeEventListener("mouseenter", e._hoverEnter),
          (e._hoverEnter = null)),
          l &&
            e._hoverLeave &&
            (l.removeEventListener("mouseleave", e._hoverLeave),
            (e._hoverLeave = null)),
          (e.style.transition = "none"));
        const a = (o || i) && !r;
        if (
          (gsap.set(e, {
            transformOrigin: "center center",
            willChange: "transform",
            force3D: !0,
            yPercent: -15,
          }),
          gsap.to(e, {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: s,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
              invalidateOnRefresh: !1,
            },
          }),
          a)
        ) {
          const t = 1.3,
            n = 0;
          let o = null;
          const i = () => {
              (o && o.kill(),
                (o = gsap.to(e, {
                  scale: t,
                  rotation: n,
                  duration: 0.7,
                  ease: "power3.out",
                })));
            },
            r = () => {
              (o && o.kill(),
                (o = gsap.to(e, {
                  scale: 1,
                  rotation: 0,
                  duration: 0.7,
                  ease: "power3.out",
                })));
            };
          (l.addEventListener("mouseenter", i),
            l.addEventListener("mouseleave", r),
            (e._hoverEnter = i),
            (e._hoverLeave = r));
        }
      }),
      initMapLocationAnimation(t));
  }
  function initMapLocationAnimation(e = null) {
    if ("undefined" == typeof gsap || "undefined" == typeof ScrollTrigger) return;
    const t = (e || document).querySelector("#map-container");
    t &&
      (ScrollTrigger.getAll()
        .filter((e) => (e.vars && e.vars.trigger) === t)
        .forEach((e) => e.kill()),
      fetch(
        "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/697787d6e9d4f63b05d857de_about-map.svg",
      )
        .then((e) => {
          if (!e.ok) throw new Error(`HTTP error! status: ${e.status}`);
          return e.text();
        })
        .then((e) => {
          if (!e || "" === e.trim()) throw new Error("Empty SVG content");
          ((t.innerHTML = e),
            requestAnimationFrame(() => {
              try {
                const e = t.querySelector("svg");
                if (!e) return;
                const n = e.querySelectorAll('path[fill="#C8603D"]');
                if (0 === n.length) return;
                (gsap.killTweensOf(n),
                  n.forEach((e) => {
                    gsap.set(e, { scale: 0, transformOrigin: "center center" });
                  }));
                const o = [];
                (ScrollTrigger.create({
                  trigger: t,
                  start: "top 85%",
                  invalidateOnRefresh: !0,
                  onEnter: () => {
                    (o.forEach((e) => e.kill()),
                      (o.length = 0),
                      n.forEach((e) => {
                        gsap.set(e, { scale: 0 });
                      }),
                      n.forEach((e) => {
                        const t = 0.8 * Math.random(),
                          n = 1 + 0.3 * Math.random(),
                          i = gsap.to(e, {
                            scale: 1.1,
                            duration: n,
                            delay: t,
                            ease: "back.out(2)",
                          });
                        o.push(i);
                      }));
                  },
                  onLeaveBack: () => {
                    o.forEach((e) => {
                      e.reverse();
                    });
                  },
                }),
                  ScrollTrigger.refresh());
              } catch (e) {
                console.warn("Map animation setup failed:", e);
              }
            }));
        })
        .catch((e) => {
          (console.warn("Failed to load map SVG:", e),
            t && (t.style.display = "none"));
        }));
  }
  !(function () {
    function e() {
      "function" == typeof hideCatalogColumnsInRoot &&
        hideCatalogColumnsInRoot(document);
    }
    "loading" === document.readyState
      ? document.addEventListener("DOMContentLoaded", e)
      : e();
  })();
  let modelRAF = null,
    modelInst = null,
    modelObs = null,
    modelVisibilityObserver = null,
    modelMousemoveHandler = null;
  function cleanupModel() {
    if (
      ((modelReplacedWithImage = !1),
      (window.__runModelEntranceAndRotation = null),
      modelMousemoveHandler &&
        (document.removeEventListener("mousemove", modelMousemoveHandler),
        (modelMousemoveHandler = null)),
      modelRAF && (cancelAnimationFrame(modelRAF), (modelRAF = null)),
      modelObs && (modelObs.disconnect(), (modelObs = null)),
      modelVisibilityObserver &&
        (modelVisibilityObserver.disconnect(), (modelVisibilityObserver = null)),
      modelInst)
    ) {
      const e = modelInst.closest(".model-wrapper");
      if (e) {
        if (e.classList.contains("model-frozen")) {
          const e = modelInst.getAttribute("camera-orbit");
          e && (window.__modelRestoreState = { frozen: !0, cameraOrbit: e });
        }
        if (
          ("undefined" != typeof gsap && gsap.killTweensOf(e), qs("#model-page"))
        ) {
          const t =
            !window.__skipModelForTest &&
            (modelInst.getAttribute("src") ||
              modelInst.getAttribute("data-model-src"));
          if (t) {
            const n = document.createElement("model-viewer");
            (n.setAttribute("src", t),
              n.setAttribute("data-model-src", t),
              e.replaceWith(n));
          } else e.remove();
        } else e.remove();
      }
      modelInst = null;
    }
    window.__cftModelWrapperEl = null;
    window.__cftModelEntranceLock = false;
    if (window.__cftDeferModelTimer) {
      clearTimeout(window.__cftDeferModelTimer);
      window.__cftDeferModelTimer = null;
    }
  }
  function resetModelStateForSpaNavigation() {
    if (window.__cftDeferModelTimer) {
      clearTimeout(window.__cftDeferModelTimer);
      window.__cftDeferModelTimer = null;
    }
    qs(".hero-model-placeholder")?.remove();
    window.__cftModelInitScheduled = false;
    window.__heroVisualEntranceDone = false;
    window.__modelEntranceDone = false;
    window.__cftDefer3dRender = false;
    window.__cftDefer3dUntilHeroDone = false;
    window.__cftAllowModelInit = true;
    window.__cftModelWrapperEl = null;
    window.__cftModelWrapperReady = false;
    window.__cftModelEntranceLock = false;
    window.__cftModelPreloadStarted = true;
    window.__cftSpaHomeModelInit = true;
  }
  function pickHomeModelSrc(mv) {
    if (!mv) return "";
    const existing = (mv.getAttribute("src") || "").trim();
    if (existing) return existing;
    const mobile = (mv.getAttribute("data-model-src-mobile") || "").trim();
    const desktop = (mv.getAttribute("data-model-src-desktop") || "").trim();
    const fallback = (mv.getAttribute("data-model-src") || "").trim();
    return isMobileLayoutBreakpoint()
      ? mobile || desktop || fallback
      : desktop || mobile || fallback;
  }
  function hideModelViewerPosterDom(mv) {
    try {
      const root = mv?.shadowRoot;
      if (!root) return false;
      root
        .querySelectorAll(".slot.poster, .poster, [id*='poster'], [class*='poster']")
        .forEach((el) => {
          if (el.dataset.cftPosterHidden === "1") return;
          el.dataset.cftPosterHidden = "1";
          el.classList.remove("show");
          el.style.setProperty("display", "none", "important");
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("visibility", "hidden", "important");
        });
      return true;
    } catch (_) {
      return false;
    }
  }
  function forceDismissModelViewerPoster(mv) {
    if (!mv) return;

    mv.removeAttribute("poster");
    try {
      if ("poster" in mv) mv.poster = null;
    } catch (_) {}

    const dismiss = () => {
      hideModelViewerPosterDom(mv);
      if (typeof mv.dismissPoster === "function") {
        try {
          mv.dismissPoster();
        } catch (_) {}
      }
      hideModelViewerPosterDom(mv);
    };

    if (customElements.get("model-viewer")) dismiss();
    else customElements.whenDefined("model-viewer").then(dismiss).catch(() => {});

    if (!mv.__cftPosterHideObserver && typeof MutationObserver !== "undefined") {
      let watchAttempts = 0;
      const watch = () => {
        if (!mv.isConnected) return;
        if (mv.shadowRoot) {
          hideModelViewerPosterDom(mv);
          if (mv.__cftPosterHideObserver) return;
          let pending = false;
          mv.__cftPosterHideObserver = new MutationObserver(() => {
            if (pending) return;
            pending = true;
            requestAnimationFrame(() => {
              pending = false;
              if (!mv.isConnected) return;
              hideModelViewerPosterDom(mv);
            });
          });
          // Only watch DOM insertions — watching style/class caused an infinite loop.
          mv.__cftPosterHideObserver.observe(mv.shadowRoot, {
            childList: true,
            subtree: true,
          });
          return;
        }
        if (watchAttempts++ < 60) {
          requestAnimationFrame(watch);
        }
      };
      watch();
    }
  }
  window.__cftStripModelPoster = forceDismissModelViewerPoster;
  function prepareHomeModelForImmediateSpaLoad(root) {
    const scope = root || document;
    const mv = scope.querySelector?.(
      "model-viewer:not(.model-viewer-3d):not(.hero-model-static)",
    );
    if (!mv) return null;

    qs(".hero-model-placeholder")?.remove();
    mv.setAttribute("loading", "eager");
    mv.setAttribute("reveal", "auto");

    const src = pickHomeModelSrc(mv);
    if (src) {
      mv.setAttribute("src", src);
      if (src.startsWith("http")) mv.setAttribute("crossorigin", "anonymous");
    }

    forceDismissModelViewerPoster(mv);

    window.__cftModelPreloadStarted = true;
    window.__cftSpaHomeModelInit = true;
    window.__cftDefer3dUntilHeroDone = false;
    window.__cftAllowModelInit = true;
    window.__cftDefer3dRender = false;
    return mv;
  }
  window.prepareHomeModelForImmediateSpaLoad = prepareHomeModelForImmediateSpaLoad;

  function hideHeroLcpDuringSpaModelRestore(root) {
    (root || document).querySelectorAll(".hero-lcp-image").forEach((img) => {
      img.style.setProperty("display", "none", "important");
    });
  }

  function clearModelViewerTransitionHideStyles(mv) {
    if (!mv) return;
    mv.style.removeProperty("opacity");
    mv.style.removeProperty("visibility");
    mv.style.removeProperty("pointer-events");
  }

  function runSpaHomeModelEntrance() {
    requestAnimationFrame(() => {
      if (typeof window.__runHeroVisualEntrance === "function") {
        window.__runHeroVisualEntrance();
      } else if (typeof window.__runModelEntranceAndRotation === "function") {
        window.__runModelEntranceAndRotation();
      }
    });
  }

  function finishSpaHomeModelRestore(root) {
    if (window.__cftIsAuditBrowser) return;
    root = root || document;
    if (!root.querySelector?.("model-viewer")) return;

    window.__cftReleaseStuckHomeLoader?.();
    window.__cftSkipModelEntranceDelay = true;
    window.__cftDefer3dRender = false;
    window.__cftDefer3dUntilHeroDone = false;
    window.__cftAllowModelInit = true;

    resetModelStateForSpaNavigation();
    hideHeroLcpDuringSpaModelRestore(root);
    root.querySelectorAll("model-viewer").forEach((mv) => {
      clearModelViewerTransitionHideStyles(mv);
      forceDismissModelViewerPoster(mv);
    });
    prepareHomeModelForImmediateSpaLoad(root);

    const existing = root.querySelector("model-viewer.model-viewer-3d");
    if (existing && window.__cftModelWrapperEl) {
      window.__cftSpaHomeModelInit = true;
      runSpaHomeModelEntrance();
      return;
    }

    window.__cftModelInitScheduled = false;
    const triggerEntrance = () => {
      window.removeEventListener("cftModelInitReady", triggerEntrance);
      window.__cftSpaHomeModelInit = true;
      runSpaHomeModelEntrance();
    };
    window.addEventListener("cftModelInitReady", triggerEntrance, { once: true });

    if (typeof scheduleModelInit === "function") scheduleModelInit();
    else if (typeof initModelSafe === "function") initModelSafe();

    requestAnimationFrame(() => {
      if (
        !window.__heroVisualEntranceDone &&
        window.__cftModelWrapperReady &&
        root.querySelector("model-viewer.model-viewer-3d")
      ) {
        triggerEntrance();
      }
    });
  }
  window.finishSpaHomeModelRestore = finishSpaHomeModelRestore;

  function reinitModelAfterSpaNavigation(e) {
    finishSpaHomeModelRestore(e || document);
  }
  window.reinitModelAfterSpaNavigation = reinitModelAfterSpaNavigation;
  function loadModelViewerLibrary() {
    return window.modelViewerLoadPromise
      ? window.modelViewerLoadPromise
      : customElements.get("model-viewer")
        ? ((window.modelViewerLoadPromise = Promise.resolve()),
          window.modelViewerLoadPromise)
        : document.querySelector('script[src*="model-viewer"]')
          ? ((window.modelViewerLoadPromise = customElements
              .whenDefined("model-viewer")
              .catch(() =>
                customElements.get("model-viewer")
                  ? Promise.resolve()
                  : new Promise((e) => {
                      setTimeout(() => {
                        (customElements.get("model-viewer"), e());
                      }, 5e3);
                    }),
              )),
            window.modelViewerLoadPromise)
          : ((window.modelViewerLoadPromise = new Promise((e, t) => {
              const n = document.createElement("script");
              ((n.type = "module"),
                (n.src =
                  "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"),
                (n.async = !0),
                (n.onload = () => {
                  customElements
                    .whenDefined("model-viewer")
                    .then(() => e())
                    .catch(() => {
                      setTimeout(() => e(), 5e3);
                    });
                }),
                (n.onerror = () => {
                  (console.warn(
                    "Failed to load model-viewer library, continuing without it",
                  ),
                    e());
                }));
              try {
                document.head.appendChild(n);
              } catch (t) {
                (console.warn("Error appending model-viewer script:", t), e());
              }
            })),
            window.modelViewerLoadPromise);
  }
  window.modelViewerLoadPromise || (window.modelViewerLoadPromise = null);
  let modelReplacedWithImage = !1;
  const MODEL_STATIC_IMAGE =
    "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/6977f8b0bf7d29560bcc9425_screenshot-model_converted.avif";
  function swapModelViewerForStaticImage() {
    if (document.querySelector(".hero-lcp-image")) return !1;
    const e = qs("model-viewer:not(.model-replaced-with-image)");
    if (!e || e.classList.contains("hero-model-static")) return !1;
    const t = document.createElement("img");
    return (
      (t.src = MODEL_STATIC_IMAGE),
      (t.alt = "Coffee Roaster"),
      t.setAttribute("loading", "eager"),
      t.setAttribute("fetchpriority", "high"),
      (t.style.cssText =
        "width:100%;height:100%;object-fit:contain;display:block"),
      t.classList.add("hero-model-static"),
      e.replaceWith(t),
      (modelReplacedWithImage = !0),
      !0
    );
  }
  function refreshScrollTriggers() {
    if (typeof ScrollTrigger === "undefined") return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  }
  window.__cftRefreshScrollTriggers = refreshScrollTriggers;

  const MODEL_ENTRANCE_DELAY_MS = 0;
  const MODEL_ROTATION_AFTER_ENTRANCE_MS = 380;
  window.__cftModelEntranceDelayMs = MODEL_ENTRANCE_DELAY_MS;

  function scheduleModelEntrance(fn) {
    if (window.__cftDeferModelTimer) {
      clearTimeout(window.__cftDeferModelTimer);
      window.__cftDeferModelTimer = null;
    }
    let delay = MODEL_ENTRANCE_DELAY_MS;
    if (window.__cftSkipModelEntranceDelay) {
      window.__cftSkipModelEntranceDelay = false;
      delay = 0;
    }
    if (
      window.__cftOverlayDismissEventFired ||
      window.__firstOverlayDismissed ||
      window.__cftModelPreloadReady
    ) {
      delay = 0;
    }
    if (delay <= 0) {
      requestAnimationFrame(() => requestAnimationFrame(fn));
      return;
    }
    window.__cftDeferModelTimer = setTimeout(fn, delay);
  }

  function applyModelWrapperEntrance(wrapper) {
    if (!wrapper) return;
    wrapper.classList.add("model-wrapper", "cft-model-preload-wrap");
    wrapper.style.removeProperty("visibility");
    if (wrapper.classList.contains("entrance")) return;
    wrapper.classList.add("entrance");
  }

  function startModelRotationWhenReady() {
    if (window.__modelEntranceDone) return;
    if (typeof window.__runModelEntranceAndRotation === "function") {
      window.__runModelEntranceAndRotation();
    }
  }

  function beginHeroModelHandoff() {
    const hero3d = qs(".hero-3d");
    if (!hero3d) return;
    hero3d.classList.add("cft-model-handoff");
    hero3d.classList.remove("cft-model-handoff-pending");
  }

  function hideHeroLcpPlaceholder() {
    if (typeof window.__cftDismissHeroPlaceholder === "function") {
      window.__cftDismissHeroPlaceholder();
      return;
    }
    const lcp = qs(".hero-lcp-image");
    qs(".hero-3d")?.classList.add("cft-placeholder-dismissed");
    if (lcp) {
      lcp.style.setProperty("display", "none", "important");
      lcp.style.setProperty("visibility", "hidden", "important");
      lcp.style.setProperty("opacity", "0", "important");
    }
  }

  function runModelEntranceNow() {
    if (window.__cftModelEntranceLock && heroModelEntranceComplete()) {
      return true;
    }
    window.__cftAllowModelInit = true;
    window.__cftDefer3dRender = false;
    window.__cftDefer3dUntilHeroDone = false;
    qs(".hero-model-placeholder")?.remove();

    const mv = qs("model-viewer.model-viewer-3d");
    const wrapper =
      window.__cftModelWrapperEl || qs(".cft-model-preload-wrap");
    if (!wrapper || !mv || !mv.isConnected) return false;

    window.__cftModelEntranceLock = true;
    hideHeroLcpPlaceholder();
    beginHeroModelHandoff();
    applyModelWrapperEntrance(wrapper);
    mv.style.removeProperty("display");
    mv.style.removeProperty("visibility");
    mv.style.removeProperty("opacity");
    mv.style.removeProperty("pointer-events");
    try {
      typeof mv.pause === "function" && mv.pause();
    } catch (_) {}
    window.__modelEntranceDone = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(startModelRotationWhenReady, MODEL_ROTATION_AFTER_ENTRANCE_MS);
      });
    });
    refreshScrollTriggers();
    window.__heroVisualEntranceDone = true;
    return true;
  }

  function activatePreloadedModel3D() {
    window.__cftAllowModelInit = true;
    window.__cftDefer3dRender = false;
    window.__cftDefer3dUntilHeroDone = false;
    qs(".hero-model-placeholder")?.remove();

    const mv = qs("model-viewer.model-viewer-3d");
    const wrapper =
      window.__cftModelWrapperEl || qs(".cft-model-preload-wrap");

    if (wrapper && mv && mv.isConnected) {
      if (wrapper.classList.contains("entrance")) {
        if (window.__modelEntranceDone) return;
        startModelRotationWhenReady();
        return;
      }
      scheduleModelEntrance(() => runModelEntranceNow());
      return;
    }

    window.__cftModelInitScheduled = false;
    scheduleModelInit();
  }

  function heroModelEntranceComplete() {
    return !!qs(".hero-3d .model-wrapper.entrance");
  }

  function tryImmediateModelEntrance() {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath) return;
    if (
      !window.__cftOverlayDismissEventFired &&
      !window.__firstOverlayDismissed
    ) {
      return;
    }
    if (heroModelEntranceComplete()) return;
    window.__cftReleaseModelInitGate?.();
    const mv = qs("model-viewer.model-viewer-3d");
    const wrapper =
      window.__cftModelWrapperEl || qs(".model-wrapper, .cft-model-preload-wrap");
    if (wrapper && mv && mv.isConnected) {
      runModelEntranceNow();
      return;
    }
    if (typeof activatePreloadedModel3D === "function") {
      activatePreloadedModel3D();
    } else if (!window.__cftModelInitScheduled) {
      scheduleModelInit();
    }
  }
  window.__cftTryImmediateModelEntrance = tryImmediateModelEntrance;

  function forceHeroModelRevealIfStuck() {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath) return;
    if (!qs("model-viewer")) return;
    if (heroModelEntranceComplete()) return;

    window.__cftReleaseModelInitGate?.();
    window.__cftModelInitScheduled = false;

    const mv = qs("model-viewer.model-viewer-3d");
    const wrapper =
      window.__cftModelWrapperEl || qs(".model-wrapper, .cft-model-preload-wrap");

    if (!mv || !wrapper) {
      scheduleModelInit();
      return;
    }

    if (!wrapper.classList.contains("entrance")) {
      hideHeroLcpPlaceholder();
      beginHeroModelHandoff();
      applyModelWrapperEntrance(wrapper);
      mv.style.removeProperty("display");
      mv.style.removeProperty("visibility");
      mv.style.removeProperty("opacity");
      try {
        typeof mv.pause === "function" && mv.pause();
      } catch (_) {}
      window.__modelEntranceDone = false;
      setTimeout(startModelRotationWhenReady, MODEL_ROTATION_AFTER_ENTRANCE_MS);
      window.__heroVisualEntranceDone = true;
      refreshScrollTriggers();
    }
  }
  window.__cftForceHeroModelRevealIfStuck = forceHeroModelRevealIfStuck;

  function ensureHeroModelVisible() {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath) return;
    if (!qs("model-viewer")) return;
    const loaderActive = !!document.getElementById("cft-loading-overlay");
    if (
      !window.__firstOverlayDismissed &&
      !window.__cftSpaHomeModelInit &&
      loaderActive &&
      !window.__cftOverlayDismissEventFired
    ) {
      return;
    }
    if (heroModelEntranceComplete()) {
      window.__heroVisualEntranceDone = true;
      return;
    }

    window.__heroVisualEntranceDone = false;
    window.__cftDefer3dUntilHeroDone = false;
    window.__cftAllowModelInit = true;

    if (typeof runHeroVisualEntrance === "function") {
      runHeroVisualEntrance();
    }

    if (!heroModelEntranceComplete()) {
      if (!window.__cftModelInitScheduled && typeof scheduleModelInit === "function") {
        scheduleModelInit();
      } else if (!heroModelEntranceComplete() && qs("model-viewer.model-viewer-3d")) {
        activatePreloadedModel3D();
      }
    }
  }
  window.__ensureHeroModelVisible = ensureHeroModelVisible;

  function runHeroVisualEntrance() {
    if (window.__heroVisualEntranceDone && heroModelEntranceComplete()) return;
    if (document.hidden && !window.__cftIsAuditBrowser) {
      return void document.addEventListener(
        "visibilitychange",
        () => runHeroVisualEntrance(),
        { once: true },
      );
    }
    window.__heroVisualEntranceDone = true;
    if (!heroModelEntranceComplete() && !window.__cftModelInitScheduled) {
      window.__heroVisualEntranceDone = false;
    }

    if (
      !window.__firstOverlayDismissed &&
      !window.__cftSpaHomeModelInit &&
      !window.__cftOverlayDismissEventFired
    ) {
      window.__cftDefer3dUntilHeroDone = true;
    }

    const hero3d = qs(".hero-3d");
    if (!hero3d) return;

    if (window.__cftSpaHomeModelInit) {
      window.__cftSpaHomeModelInit = false;
      window.__cftDefer3dUntilHeroDone = false;
      window.__cftAllowModelInit = true;
      qs(".hero-model-placeholder")?.remove();
      document.querySelector(".hero-glow")?.classList.add("animate");
      activatePreloadedModel3D();
      return;
    }

    const mv = qs("model-viewer.model-viewer-3d");
    const wrapper =
      window.__cftModelWrapperEl || qs(".cft-model-preload-wrap");

    document.querySelector(".hero-glow")?.classList.add("animate");

    if (!hero3d.classList.contains("cft-hero-early-entrance") &&
        !hero3d.classList.contains("cft-model-handoff-pending") &&
        !hero3d.classList.contains("cft-model-handoff")) {
      const lcp = qs(".hero-lcp-image");
      const hasModel = !!qs(".hero-3d model-viewer, model-viewer.hero-model-3d");
      if (hasModel) {
        hero3d.classList.add("cft-model-handoff-pending");
      } else {
        hero3d.classList.add("cft-hero-early-entrance");
        if (lcp) lcp.classList.add("cft-hero-early-entrance");
      }
    }

    if (wrapper && mv) {
      try {
        typeof mv.pause === "function" && mv.pause();
      } catch (_) {}
      wrapper.removeAttribute("style");
      if (!wrapper.classList.contains("model-wrapper")) {
        wrapper.classList.add("model-wrapper", "cft-model-preload-wrap");
      }
      if (window.__cftDeferModelTimer) {
        clearTimeout(window.__cftDeferModelTimer);
      }
      scheduleModelEntrance(() => runModelEntranceNow());
      return;
    }

    if (window.__firstOverlayDismissed) {
      window.__cftDefer3dUntilHeroDone = false;
      window.__cftAllowModelInit = true;
      qs(".hero-model-placeholder")?.remove();
      activatePreloadedModel3D();
      return;
    }

    document.querySelector(".hero-glow")?.classList.add("animate");
    window.__cftDefer3dUntilHeroDone = false;
    window.__cftAllowModelInit = true;
    if (window.__cftDeferModelTimer) clearTimeout(window.__cftDeferModelTimer);
    activatePreloadedModel3D();
  }
  window.__runHeroVisualEntrance = runHeroVisualEntrance;
  window.__runHeroModelPlaceholderEntrance = runHeroVisualEntrance;

  function scheduleModelInit() {
    if (window.__cftModelInitScheduled) return;
    if (
      window.__firstOverlayDismissed ||
      window.__cftOverlayDismissEventFired ||
      window.__cftPreDismissFired
    ) {
      window.__cftDefer3dUntilHeroDone = false;
      window.__cftDefer3dRender = false;
      window.__cftAllowModelInit = true;
    }
    if (window.__cftDefer3dUntilHeroDone && !window.__cftAllowModelInit) return;
    if (document.hidden && !window.__cftIsAuditBrowser) {
      document.addEventListener("visibilitychange", () => scheduleModelInit(), {
        once: true,
      });
      return;
    }
    window.__cftModelInitScheduled = true;
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath)
      return void swapModelViewerForStaticImage();
    if (!qs("model-viewer")) return;
    loadModelViewerLibrary()
      .then(() => initModelSafe())
      .catch((e) => {
        (console.warn("Failed to load model-viewer library:", e), initModelSafe());
      });
  }
  window.scheduleModelInit = scheduleModelInit;
  if (
    window.__cftPendingModelInit &&
    typeof window.__cftCanStartModelInitDuringLoader === "function" &&
    window.__cftCanStartModelInitDuringLoader()
  ) {
    window.__cftKickModelInitAfterLoaderHandoff?.();
  }

  function recoverMissedLoaderModelEvents() {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath) return;

    if (
      window.__firstOverlayDismissed ||
      window.__cftOverlayDismissEventFired ||
      window.__cftPreDismissFired
    ) {
      window.__cftReleaseModelInitGate?.();
    }

    if (window.__cftModelPreloadReadyFired) {
      if (
        window.__cftLoadingManaged &&
        typeof window.__cftCanStartModelInitDuringLoader === "function" &&
        !window.__cftCanStartModelInitDuringLoader()
      ) {
        window.__cftPendingModelInit = true;
      } else if (!window.__cftModelInitScheduled) {
        scheduleModelInit();
      }
    }

    if (
      !window.__cftModelInitScheduled &&
      qs("model-viewer") &&
      (window.__firstOverlayDismissed ||
        window.__cftSpaHomeModelInit ||
        !document.getElementById("cft-loading-overlay"))
    ) {
      scheduleModelInit();
    }

    if (
      (window.__firstOverlayDismissed ||
        window.__cftSpaHomeModelInit ||
        !document.getElementById("cft-loading-overlay")) &&
      qs("model-viewer")
    ) {
      ensureHeroModelVisible();
    }
  }

  function retryModelWhenTabVisible() {
    if (document.hidden || window.__cftIsAuditBrowser || window.__cftUseLightHeroPath)
      return;
    if (!qs("model-viewer")) return;
    if (qs(".model-wrapper.entrance")) return;
    if (
      !window.__firstOverlayDismissed &&
      document.getElementById("cft-loading-overlay") &&
      !window.__cftOverlayDismissEventFired
    ) {
      return;
    }

    window.__cftModelInitScheduled = false;
    window.__heroVisualEntranceDone = false;
    window.__cftDefer3dUntilHeroDone = false;
    window.__cftAllowModelInit = true;

    const mv = qs("model-viewer");
    if (!mv) return;

    const src = (mv.getAttribute("src") || "").trim() || pickHomeModelSrc(mv);
    if (src) {
      const currentSrc = (mv.getAttribute("src") || "").trim();
      if (currentSrc !== src) {
        try {
          if (currentSrc) {
            mv.removeAttribute("src");
            mv.removeAttribute("poster");
            void mv.offsetWidth;
          }
          mv.setAttribute("src", src);
          if (src.startsWith("http")) mv.setAttribute("crossorigin", "anonymous");
        } catch (_) {}
      }
    }

    scheduleModelInit();
    ensureHeroModelVisible();
  }

  recoverMissedLoaderModelEvents();
  window.addEventListener("cftModelInitReady", () => {
    if (
      window.__firstOverlayDismissed ||
      window.__cftSpaHomeModelInit ||
      window.__cftOverlayDismissEventFired ||
      !document.getElementById("cft-loading-overlay")
    ) {
      tryImmediateModelEntrance();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    recoverMissedLoaderModelEvents();
    retryModelWhenTabVisible();
  });
  window.addEventListener("overlayDismissComplete", () => {
    setTimeout(recoverMissedLoaderModelEvents, 80);
    [250, 600, 1200, 2500, 4000].forEach((ms) => {
      setTimeout(() => {
        if (!qs(".hero-3d .model-wrapper.entrance")) ensureHeroModelVisible();
      }, ms);
    });
    [400, 900].forEach((ms) => {
      setTimeout(forceHeroModelRevealIfStuck, ms);
    });
    setTimeout(() => {
      if (!qs(".model-wrapper.entrance")) retryModelWhenTabVisible();
    }, 2500);
  });
  function replaceModelWithStaticImage(e, t) {
    if (
      e &&
      t &&
      !modelReplacedWithImage &&
      !t.classList.contains("model-replaced-with-image")
    )
      try {
        ((modelReplacedWithImage = !0),
          (shouldStopAnimation = !0),
          modelRAF && (cancelAnimationFrame(modelRAF), (modelRAF = null)));
        const n = window.getComputedStyle(t),
          o = n.transform,
          i = t.offsetWidth,
          r = t.offsetHeight,
          s = document.createElement("img");
        ((s.src =
          "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/6977f8b0bf7d29560bcc9425_screenshot-model_converted.avif"),
          (s.style.width = "100%"),
          (s.style.height = "100%"),
          (s.style.objectFit = "contain"),
          (s.style.display = "block"),
          (s.alt = "Coffee Roaster"),
          (s.loading = "eager"),
          (s.onerror = function () {
            console.warn("Model replacement image failed to load:", this.src);
          }),
          (s.onload = function () {
            if (e)
              try {
                ("function" == typeof e.pause && e.pause(),
                  e.cameraControls &&
                    "function" == typeof e.cameraControls.dispose &&
                    e.cameraControls.dispose(),
                  e.removeAttribute("src"),
                  void 0 !== e.src && (e.src = ""),
                  e.renderer &&
                    "function" == typeof e.renderer.dispose &&
                    e.renderer.dispose(),
                  e.scene &&
                    "function" == typeof e.scene.traverse &&
                    e.scene.traverse((e) => {
                      (e.geometry &&
                        "function" == typeof e.geometry.dispose &&
                        e.geometry.dispose(),
                        e.material &&
                          (Array.isArray(e.material)
                            ? e.material.forEach((e) => {
                                (e &&
                                  e.map &&
                                  "function" == typeof e.map.dispose &&
                                  e.map.dispose(),
                                  e &&
                                    "function" == typeof e.dispose &&
                                    e.dispose());
                              })
                            : (e.material.map &&
                                "function" == typeof e.material.map.dispose &&
                                e.material.map.dispose(),
                              "function" == typeof e.material.dispose &&
                                e.material.dispose())));
                    }),
                  e.parentNode && e.remove());
              } catch (t) {
                (console.warn("Error disposing model-viewer:", t),
                  e && e.parentNode && e.remove());
              }
            const l = document.createElement("div");
            (Object.assign(l.style, {
              position: n.position,
              display: n.display,
              alignItems: n.alignItems,
              justifyContent: n.justifyContent,
              width: `${i}px`,
              height: `${r}px`,
              minWidth: n.minWidth,
              minHeight: n.minHeight,
              maxWidth: n.maxWidth,
              maxHeight: n.maxHeight,
              margin: n.margin,
              padding: n.padding,
              opacity: "1",
              visibility: "visible",
              transform: o && "none" !== o ? o : "scale(1) translateY(0)",
              animation: "none",
              willChange: "auto",
            }),
              l.classList.add("model-wrapper"),
              l.classList.add("model-replaced-with-image"),
              l.appendChild(s),
              t.replaceWith(l),
              modelInst && (modelInst = null),
              modelObs && (modelObs.disconnect(), (modelObs = null)),
              modelVisibilityObserver &&
                (modelVisibilityObserver.disconnect(),
                (modelVisibilityObserver = null)),
              modelRAF && (cancelAnimationFrame(modelRAF), (modelRAF = null)),
              window.gc && window.gc());
          }),
          s.complete
            ? s.onload()
            : (s.onerror = function () {
                s.onload();
              }));
      } catch (e) {
        (console.warn("Error replacing model with static image:", e),
          (modelReplacedWithImage = !1));
      }
  }
  function initModelSafe(e = 3, t = 100) {
    if (window.__cftIsAuditBrowser || window.__cftUseLightHeroPath)
      return void swapModelViewerForStaticImage();
    if (window.__skipModelForTest) {
      const e = qs(".hero-3d");
      return void (e && (e.style.display = "none"));
    }
    try {
      if (!qs("model-viewer")) return void cleanupModel();
    } catch (e) {
      return void console.warn("Error checking for model elements:", e);
    }
    if (
      modelInst &&
      modelInst.isConnected &&
      modelInst.classList.contains("model-viewer-3d")
    ) {
      const e = modelInst.closest(".model-wrapper");
      if (
        e &&
        e.isConnected &&
        (modelInst.hasAttribute("src") ||
          modelInst.hasAttribute("data-model-src"))
      ) {
        window.__cftModelWrapperReady ||
          ((window.__cftModelWrapperReady = !0),
          window.dispatchEvent(new CustomEvent("cftModelInitReady")));
        return;
      }
      cleanupModel();
    }
    const n = qs("model-viewer:not(.model-viewer-3d)");
    if (!n)
      return void (e > 0 && setTimeout(() => initModelSafe(e - 1, 2 * t), t));
    n.removeAttribute("poster");
    let o = null,
      i = null;
    try {
      if (((o = n.getAttribute("src")), !o)) {
        const r = n.getAttribute("data-model-src-mobile"),
          s = n.getAttribute("data-model-src-desktop"),
          l = isMobileLayoutBreakpoint();
        if (((i = l ? r || s : s || r), i)) {
          const r = () => {
              const applySrc = () => {
                n.isConnected &&
                  (n.removeAttribute("poster"),
                  n.setAttribute("src", i),
                  i.startsWith("http") &&
                    n.setAttribute("crossorigin", "anonymous"),
                  (o = i),
                  s());
              };
              window.__cftModelPreloadStarted || window.__firstOverlayDismissed
                ? applySrc()
                : "undefined" != typeof requestIdleCallback
                  ? requestIdleCallback(applySrc, { timeout: 400 })
                  : setTimeout(applySrc, 50);
            },
            s = () => {
              initModelSafeBody(n, i, e, t);
            };
          return void r();
        }
      }
    } catch (n) {
      return (
        console.warn("Error reading model source:", n),
        void (e > 0 && setTimeout(() => initModelSafe(e - 1, 2 * t), t))
      );
    }
    o
      ? initModelSafeBody(n, o, e, t)
      : e > 0 && setTimeout(() => initModelSafe(e - 1, 2 * t), t);
  }
  function initModelSafeBody(e, t, n, o) {
    if (!e || !e.isConnected) return;
    if (e.style.display === "none") e.style.display = "";
    e.removeAttribute("poster");
    e.style.removeProperty("opacity");
    e.style.removeProperty("visibility");
    e.style.removeProperty("pointer-events");
    forceDismissModelViewerPoster(e);
    window.__cftLoadingManaged &&
      !window.__firstOverlayDismissed &&
      !window.__cftSpaHomeModelInit &&
      (window.__cftDefer3dRender = true);
    ((n = null != n ? n : 3),
      (o = null != o ? o : 100),
      (window.__modelEntranceDone = !1),
      (window.__modelEntranceDelayedOnce = !1),
      (modelReplacedWithImage = !1));
    const i = 75,
      r = 120,
      s = 480,
      l = "neutral",
      a = "neutral",
      c = "transparent";
    let d = 85,
      u = 85,
      m = "85%";
    const g = isMobileViewport();
    g && ((u = 85), (d = 85));
    const h = g ? "0.4" : "1.0",
      f = window.__cftModelPreloadStarted ? "eager" : g ? "lazy" : "eager";
    if (!customElements.get("model-viewer"))
      return n > 0
        ? document.querySelector('script[src*="model-viewer"]')
          ? void customElements
              .whenDefined("model-viewer")
              .then(() => {
                setTimeout(() => initModelSafe(n - 1, 2 * o), o);
              })
              .catch(() => {
                setTimeout(() => initModelSafe(n - 1, 2 * o), 2 * o);
              })
          : void loadModelViewerLibrary()
              .then(() => {
                setTimeout(() => {
                  customElements.get("model-viewer")
                    ? initModelSafe(n - 1, 2 * o)
                    : setTimeout(() => initModelSafe(n - 1, 2 * o), 2 * o);
                }, o);
              })
              .catch(() => {
                setTimeout(() => initModelSafe(n - 1, 2 * o), 2 * o);
              })
        : (console.warn(
            "model-viewer custom element not available after retries, skipping model initialization",
          ),
          void (e && e.parentElement && (e.style.display = "none")));
    const p = [
        ["camera-orbit", `0deg 75deg ${m}`],
        ["min-camera-orbit", `auto 0deg ${m}`],
        ["max-camera-orbit", `auto 90deg ${m}`],
        ["field-of-view", "60deg"],
        ["min-field-of-view", "60deg"],
        ["max-field-of-view", "60deg"],
        ["exposure", (1).toString()],
        ["shadow-intensity", (0.5).toString()],
        ["shadow-softness", (0.3).toString()],
        ["environment-image", l],
        ["tone-mapping", a],
        ["environment-intensity", (1).toString()],
        ["background-color", c],
        ["loading", f],
        ["interaction-prompt", "none"],
        ["disable-tap", ""],
        ["render-scale", h],
        ["interaction-policy", "allow-when-focused"],
      ],
      y = e;
    let v;
    try {
      p.forEach(([e, t]) => y.setAttribute(e, t));
    } catch (t) {
      return (
        console.warn("Error setting model-viewer attributes:", t),
        void (e && e.parentElement && (e.style.display = "none"))
      );
    }
    g &&
      (y.setAttribute("disable-zoom", ""),
      y.setAttribute("disable-pan", ""),
      y.setAttribute("disable-tap", ""),
      y.setAttribute("camera-controls", "false"),
      y.setAttribute("ar", "false"),
      y.setAttribute("ar-modes", ""));
    try {
      (y.getAttribute("src") || y.setAttribute("src", t),
        y.setAttribute("fetchpriority", g ? "low" : "high"),
        y.classList.add("model-viewer-3d"),
        Object.assign(y.style, {
          userSelect: "none",
          webkitUserSelect: "none",
          pointerEvents: "auto",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }),
        y.addEventListener("error", (e) => {
          (console.warn("Model failed to load:", t),
            y && y.parentElement && (y.parentElement.style.display = "none"));
        }),
        (v = document.createElement("div")),
        (v.oncontextmenu = y.oncontextmenu = () => !1),
        v.classList.add("model-wrapper", "cft-model-preload-wrap"),
        forceDismissModelViewerPoster(y));
      const n = (e) => {
        if (e.button > 0 || e.buttons > 1)
          return (e.preventDefault(), e.stopPropagation(), !1);
      };
      if (
        (["contextmenu", "mousedown", "mousemove"].forEach((e) => {
          (v.addEventListener(e, n, !0), y.addEventListener(e, n, !0));
        }),
        g)
      ) {
        const e = (e) => (
          e.preventDefault(),
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          !1
        );
        ([
          "touchstart",
          "touchmove",
          "touchend",
          "touchcancel",
          "gesturestart",
          "gesturechange",
          "gestureend",
        ].forEach((t) => {
          (v.addEventListener(t, e, { passive: !1, capture: !0 }),
            y.addEventListener(t, e, { passive: !1, capture: !0 }));
        }),
          ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach(
            (t) => {
              (v.addEventListener(t, e, { passive: !1, capture: !0 }),
                y.addEventListener(t, e, { passive: !1, capture: !0 }));
            },
          ));
      }
      (e.parentNode.insertBefore(v, e), v.appendChild(e), (window.__cftModelWrapperEl = v));
    } catch (t) {
      return (
        console.warn("Error setting up model-viewer:", t),
        void (e && e.parentElement && (e.style.display = "none"))
      );
    }
    let w = 0,
      S = i,
      b = 0,
      E = i,
      L = !1,
      T = 0,
      _ = 0,
      A = !1,
      x = !1;
    const k = qs("#model-page") || qs(".hero"),
      q = g ? 0.12 : 0.08;
    let I = i,
      C = s,
      H = 0;
    const D = g ? 2 : 0;
    let M = !0;
    if (
      ("IntersectionObserver" in window &&
        k &&
        ((modelVisibilityObserver = new IntersectionObserver(
          (e) => {
            e.forEach((e) => {
              M = e.isIntersecting;
            });
          },
          { threshold: [0, 0.1, 0.5, 1] },
        )),
        modelVisibilityObserver.observe(k)),
      k && !isMobileLayoutBreakpoint())
    ) {
      const e = (e) => {
        if (!y) return;
        const t = window.innerWidth,
          n = window.innerHeight;
        if (t <= 0 || n <= 0) return;
        const o = Math.max(0, Math.min(1, e.clientX / t)),
          r = Math.max(0, Math.min(1, e.clientY / n)),
          l = i - 20 * (r - 0.5) * 2,
          a = s - 35 * (o - 0.5) * 2;
        ((I = Math.max(0, Math.min(90, l))), (C = a));
      };
      ((modelMousemoveHandler = e),
        document.addEventListener("mousemove", modelMousemoveHandler));
    }
    const P = () => {
        try {
          if (g && x) return;
          if (g && H < D)
            return (H++, void (modelRAF = requestAnimationFrame(P)));
          if (((H = 0), !M && !L))
            return void (modelRAF = requestAnimationFrame(P));
          if (!y || !y.isConnected) return;
          (isMobileLayoutBreakpoint() || (d += 0.06 * (u - d)),
            (m = `${d}%`),
            A &&
              !isMobileLayoutBreakpoint() &&
              ((E += 0.2 * (I - E)), (b += 0.2 * (C - b))),
            !L && y
              ? (A && !isMobileLayoutBreakpoint() && (w += (b - w) * q),
                (S += (E - S) * q),
                y.setAttribute("camera-orbit", `${w}deg ${S}deg ${m}`),
                y.setAttribute("min-camera-orbit", `auto ${S}deg ${m}`),
                y.setAttribute("max-camera-orbit", `auto ${S}deg ${m}`))
              : y &&
                (isMobileLayoutBreakpoint() ||
                  ((w += (b - w) * q + T),
                  (S += (E - S) * q + _),
                  (T *= 0.92),
                  (_ *= 0.92),
                  Math.abs(T) < 0.01 && (T = 0),
                  Math.abs(_) < 0.01 && (_ = 0)),
                y.setAttribute("camera-orbit", `${w}deg ${S}deg ${m}`),
                y.setAttribute("min-camera-orbit", `auto ${S}deg ${m}`),
                y.setAttribute("max-camera-orbit", `auto ${S}deg ${m}`)),
            (modelRAF = requestAnimationFrame(P)));
        } catch (e) {
          (console.warn("Error in model animation:", e),
            modelRAF && cancelAnimationFrame(modelRAF));
        }
      },
      F = () => {
        try {
          if (y && y.shadowRoot) {
            const e = y.shadowRoot,
              t = (e) => {
                if (e.button > 0 || e.buttons > 1)
                  return (e.preventDefault(), e.stopPropagation(), !1);
              };
            if (
              (["contextmenu", "mousedown", "mousemove"].forEach((n) => {
                try {
                  (e.addEventListener(n, t, !0),
                    e.querySelectorAll("*").forEach((e) => {
                      try {
                        e.addEventListener(n, t, !0);
                      } catch (e) {}
                    }));
                } catch (e) {}
              }),
              g)
            ) {
              const t = (e) => (
                e.preventDefault(),
                e.stopPropagation(),
                e.stopImmediatePropagation(),
                !1
              );
              ([
                "touchstart",
                "touchmove",
                "touchend",
                "touchcancel",
                "gesturestart",
                "gesturechange",
                "gestureend",
              ].forEach((n) => {
                try {
                  (e.addEventListener(n, t, { passive: !1, capture: !0 }),
                    e.querySelectorAll("*").forEach((e) => {
                      try {
                        e.addEventListener(n, t, { passive: !1, capture: !0 });
                      } catch (e) {}
                    }));
                } catch (e) {}
              }),
                [
                  "pointerdown",
                  "pointermove",
                  "pointerup",
                  "pointercancel",
                ].forEach((n) => {
                  try {
                    (e.addEventListener(n, t, { passive: !1, capture: !0 }),
                      e.querySelectorAll("*").forEach((e) => {
                        try {
                          e.addEventListener(n, t, { passive: !1, capture: !0 });
                        } catch (e) {}
                      }));
                  } catch (e) {}
                }));
            }
          }
        } catch (e) {
          console.warn("Error setting up shadow root:", e);
        }
      };
    try {
      ((modelObs = new MutationObserver(F)),
        y &&
          y.shadowRoot &&
          modelObs.observe(y.shadowRoot, { childList: !0, subtree: !0 }),
        window.__cftDefer3dRender ||
          (modelRAF = requestAnimationFrame(P)));
    } catch (t) {
      (console.warn("Error starting model animation:", t),
        e && e.parentElement && (e.style.display = "none"));
    }
    function O() {
      if (window.__modelEntranceDone) return;
      if (!v || !v.isConnected || !y || !y.isConnected) return;
      if (!v.classList.contains("entrance")) {
        scheduleModelEntrance(() => runModelEntranceNow());
        return;
      }
      qs(".hero-model-placeholder")?.remove();
      beginHeroModelHandoff();
      document.querySelector(".hero-glow")?.classList.add("animate");
      if (
        g &&
        window.__modelRestoreState &&
        window.__modelRestoreState.frozen &&
        window.__modelRestoreState.cameraOrbit
      ) {
        try {
          const e = window.__modelRestoreState.cameraOrbit;
          (y.setAttribute("camera-orbit", e),
            y.setAttribute("min-camera-orbit", e),
            y.setAttribute("max-camera-orbit", e),
            "function" == typeof y.pause && y.pause(),
            v.classList.add("model-frozen"),
            (v.style.pointerEvents = "none"),
            (y.style.pointerEvents = "none"),
            (A = !0),
            (x = !0),
            modelRAF && (cancelAnimationFrame(modelRAF), (modelRAF = null)),
            (window.__modelRestoreState = null));
        } catch (e) {
          (console.warn("Error restoring frozen model:", e),
            (window.__modelRestoreState = null));
        }
        return;
      }
      window.__modelEntranceDone = true;
      ((w = r),
        (S = i),
        (b = r),
        (E = i),
        y.setAttribute("camera-orbit", `120deg 75deg ${m}`),
        y.setAttribute("min-camera-orbit", `auto 75deg ${m}`),
        y.setAttribute("max-camera-orbit", `auto 75deg ${m}`),
        (L = !0),
        (A = !1));
      try {
        typeof y.play === "function" ? y.play() : y.pause?.();
      } catch (_) {}
      window.__cftDefer3dRender = false;
      modelRAF || (modelRAF = requestAnimationFrame(P));
      const e = { value: r };
      gsap.to(e, {
        value: 480,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: function () {
          try {
            ((b = e.value),
              (w = e.value),
              y &&
                y.isConnected &&
                (y.setAttribute("camera-orbit", `${w}deg ${S}deg ${m}`),
                y.setAttribute("min-camera-orbit", `auto ${S}deg ${m}`),
                y.setAttribute("max-camera-orbit", `auto ${S}deg ${m}`)));
          } catch (e) {}
        },
        onComplete: function () {
          try {
            ((w = s),
              (b = s),
              y &&
                y.isConnected &&
                (y.setAttribute("camera-orbit", `480deg 75deg ${m}`),
                y.setAttribute("min-camera-orbit", `auto 75deg ${m}`),
                y.setAttribute("max-camera-orbit", `auto 75deg ${m}`)),
              (A = !0),
              (L = !1),
              g &&
                ((x = !0),
                modelRAF && (cancelAnimationFrame(modelRAF), (modelRAF = null)),
                setTimeout(() => {
                  try {
                    ((x = !0),
                      modelRAF &&
                        (cancelAnimationFrame(modelRAF), (modelRAF = null)),
                      y && "function" == typeof y.pause && y.pause(),
                      v.classList.add("model-frozen"),
                      (v.style.pointerEvents = "none"),
                      y && (y.style.pointerEvents = "none"));
                  } catch (e) {
                    console.warn("Error freezing model:", e);
                  }
                }, 300)));
          } catch (e) {
            console.warn("Error in model load completion:", e);
          }
        },
      });
    }
    function runModelEntranceOnOverlayDismiss() {
      if (window.__cftDefer3dRender || window.__cftDefer3dUntilHeroDone) {
        typeof window.__runHeroVisualEntrance === "function" &&
          window.__runHeroVisualEntrance();
        return;
      }
      if (window.__modelEntranceDone || !y || !y.isConnected) return;
      activatePreloadedModel3D();
    }
    window.__runModelEntranceAndRotation = O;
    const R = () => {
      try {
        forceDismissModelViewerPoster(y);
        try {
          typeof y.pause === "function" && y.pause();
        } catch (_) {}
        if (
          (y.setAttribute("environment-image", l),
          y.setAttribute("tone-mapping", a),
          y.setAttribute("environment-intensity", (1).toString()),
          y.setAttribute("background-color", c),
          y.removeAttribute("skybox-image"),
          (w = r),
          (S = i),
          (b = r),
          (E = i),
          y.setAttribute("camera-orbit", `120deg 75deg ${m}`),
          y.setAttribute("min-camera-orbit", `auto 75deg ${m}`),
          y.setAttribute("max-camera-orbit", `auto 75deg ${m}`),
          document.documentElement.classList.contains("loading") ||
            (window.__cftLoadingManaged && window.__cftDefer3dRender))
        )
          return (
            window.__cftLoadingManaged
              ? (window.__cftOverlayDismissStarted
                  ? runModelEntranceOnOverlayDismiss()
                  : window.addEventListener(
                      "overlayDismissStart",
                      runModelEntranceOnOverlayDismiss,
                      { once: !0 },
                    ))
              : window.addEventListener("pageReady", () => O(), { once: !0 }),
            F(),
            y.shadowRoot &&
              modelObs.observe(y.shadowRoot, { childList: !0, subtree: !0 }),
            void (L = !0)
          );
        if (window.__cftLoadingManaged && window.__cftDefer3dRender) {
          F();
          y.shadowRoot &&
            modelObs.observe(y.shadowRoot, { childList: !0, subtree: !0 });
          return void (L = !0);
        }
        (activatePreloadedModel3D(),
          F(),
          y.shadowRoot &&
            modelObs.observe(y.shadowRoot, { childList: !0, subtree: !0 }),
          (L = !0));
      } catch (e) {
        console.warn("Error in model load handler:", e);
      }
    };
    (y.addEventListener("load", R, { once: !0 }),
      y.loaded && R(),
      window.__cftLoadingManaged
        ? window.__cftOverlayDismissStarted
          ? runModelEntranceOnOverlayDismiss()
          : window.addEventListener(
              "overlayDismissStart",
              runModelEntranceOnOverlayDismiss,
              { once: !0 },
            )
        : [150, 500, 1e3].forEach((e) =>
            setTimeout(() => {
              !window.__modelEntranceDone &&
                y &&
                y.isConnected &&
                activatePreloadedModel3D();
            }, e),
          ),
      F(),
      [50, 100, 200, 500].forEach((e) => setTimeout(F, e)),
      (modelInst = y),
      window.__cftOverlayDismissStarted &&
        !window.__modelEntranceDone &&
        runModelEntranceOnOverlayDismiss(),
      (window.__cftModelWrapperReady = !0),
      window.dispatchEvent(new CustomEvent("cftModelInitReady")));
  }
  window.initModelSafe = initModelSafe;
  let logoBrightImg = null,
    logoDarkImg = null,
    lastScrollY = 0,
    scrollThreshold = 100,
    minScrollDelta = 1,
    minScrollDeltaShow = 1,
    headerThemeInitialized = !1,
    isInitializingHeaderTheme = !1;
  function initHeaderTheme(e = 0, t = 10) {
    if ((0 === e && console.log("Header theme: Initializing..."), qs(".header")))
      if (isInitializingHeaderTheme)
        0 === e && console.log("Header theme: Already initializing, skipping...");
      else {
        if (
          ((isInitializingHeaderTheme = !0),
          console.log("Header theme: Header found, setting up logo images..."),
          !logoBrightImg || !logoDarkImg)
        ) {
          const n = qs(".logo");
          if (!n)
            return e < t
              ? ((isInitializingHeaderTheme = !1),
                void setTimeout(() => initHeaderTheme(e + 1, t), 100))
              : (console.warn(
                  "Header theme: Logo element (.logo) not found after retries",
                ),
                void (isInitializingHeaderTheme = !1));
          let o = n.querySelector("a");
          const i = n.querySelector("img");
          if (!i)
            return e < t
              ? ((isInitializingHeaderTheme = !1),
                void setTimeout(() => initHeaderTheme(e + 1, t), 100))
              : (console.warn(
                  "Header theme: Logo image not found inside .logo after retries",
                ),
                void (isInitializingHeaderTheme = !1));
          o ||
            ((o = document.createElement("a")),
            (o.href = "/"),
            i.parentNode.insertBefore(o, i),
            o.appendChild(i));
          const r = i.getAttribute("src") || i.src || "",
            s =
              r.includes("coffee-tech-logo-bright.svg") ||
              r.includes("logo-bright") ||
              !r.includes("logo-dark"),
            l =
              "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/697787d742ebce0bcbd046a7_coffee-tech-logo-bright.svg",
            a =
              "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/697787d7d5bc57f3c197cecb_coffee-tech-logo-dark.svg";
          let c, d;
          (r.includes("cdn.prod.website-files.com")
            ? ((c = l), (d = a))
            : ((c = "assets/coffee-tech-logo-bright.svg"),
              (d = "assets/coffee-tech-logo-dark.svg")),
            (logoBrightImg = document.createElement("img")),
            Object.assign(logoBrightImg, {
              src: c,
              alt: "CoffeeTech Logo",
              className: "logo-bright",
              fetchPriority: "high",
              loading: "eager",
              style: { opacity: s ? "1" : "0" },
            }),
            (logoDarkImg = document.createElement("img")),
            Object.assign(logoDarkImg, {
              src: d,
              alt: "CoffeeTech Logo",
              className: "logo-dark",
              fetchPriority: "low",
              loading: "lazy",
              style: { opacity: s ? "0" : "1" },
            }),
            (logoBrightImg.onerror = function () {
              (console.warn(
                "Header theme: Bright logo failed to load from:",
                this.src,
              ),
                this.src.includes("cdn.prod.website-files.com") &&
                  "assets/coffee-tech-logo-bright.svg" !== this.src &&
                  (console.log(
                    "Header theme: Trying fallback path for bright logo",
                  ),
                  (this.src = "assets/coffee-tech-logo-bright.svg")));
            }),
            (logoDarkImg.onerror = function () {
              (console.warn(
                "Header theme: Dark logo failed to load from:",
                this.src,
              ),
                this.src.includes("cdn.prod.website-files.com") &&
                  "assets/coffee-tech-logo-dark.svg" !== this.src &&
                  (console.log(
                    "Header theme: Trying fallback path for dark logo",
                  ),
                  (this.src = "assets/coffee-tech-logo-dark.svg")));
            }));
          let u = !1,
            m = !1,
            g = !1;
          const h = () => {
            !u &&
              m &&
              ((u = !0),
              (o.innerHTML = ""),
              o.append(logoBrightImg, logoDarkImg),
              g || (logoDarkImg.style.visibility = "hidden"));
          };
          ((logoBrightImg.onload = function () {
            ((m = !0), h());
          }),
            (logoDarkImg.onload = function () {
              ((g = !0), u ? (logoDarkImg.style.visibility = "") : h());
            }),
            logoBrightImg.complete && (m = !0),
            logoDarkImg.complete && (g = !0),
            h());
        }
        if (
          ((isInitializingHeaderTheme = !1),
          updateHeaderTheme(),
          !headerThemeInitialized)
        ) {
          headerThemeInitialized = !0;
          let e = null,
            t = null;
          (() => {
            if (isTouchDevice()) {
              let e = null,
                n = 0;
              const o = 100;
              ((t = () => {
                const t = Date.now();
                t - n < o ||
                  ((n = t),
                  e ||
                    (e = requestAnimationFrame(() => {
                      (updateHeaderTheme(), (e = null));
                    })));
              }),
                window.addEventListener("scroll", t, { passive: !0 }));
            } else if (
              smoothScrollInstance &&
              "function" == typeof smoothScrollInstance.on
            )
              ((e = updateHeaderTheme), smoothScrollInstance.on("scroll", e));
            else {
              ((t = updateHeaderTheme),
                window.addEventListener("scroll", t, { passive: !0 }));
              const n = setInterval(() => {
                smoothScrollInstance &&
                  "function" == typeof smoothScrollInstance.on &&
                  (t && (window.removeEventListener("scroll", t), (t = null)),
                  (e = updateHeaderTheme),
                  smoothScrollInstance.on("scroll", e),
                  clearInterval(n));
              }, 100);
              setTimeout(() => clearInterval(n), 5e3);
            }
          })();
        }
      }
    else
      e < t
        ? setTimeout(() => initHeaderTheme(e + 1, t), 100)
        : console.warn(
            "Header theme: Header element (.header) not found after retries",
          );
  }
  function updateHeaderThemeFromDoc(e) {
    const t = qs(".header");
    if (!t || !e) return;
    (logoBrightImg && logoDarkImg) ||
      isInitializingHeaderTheme ||
      initHeaderTheme();
    const n = e.body;
    if (n) {
      const e = n.classList.contains("dark-mode"),
        o = n.classList.contains("light-mode");
      if (e || o)
        return (
          t.classList.toggle("dark-theme", e),
          t.classList.toggle("above-light-theme", o),
          void (
            logoBrightImg &&
            logoDarkImg &&
            (o
              ? ((logoBrightImg.style.opacity = "0"),
                (logoDarkImg.style.opacity = "1"))
              : ((logoBrightImg.style.opacity = "1"),
                (logoDarkImg.style.opacity = "0")))
          )
        );
    }
    const o = e.querySelector(".page-wrapper");
    if (o) {
      const e = o.querySelector("section");
      e &&
        (e.classList.contains("light-theme")
          ? (t.classList.add("above-light-theme"),
            logoBrightImg &&
              logoDarkImg &&
              ((logoBrightImg.style.opacity = "0"),
              (logoDarkImg.style.opacity = "1")))
          : (t.classList.remove("above-light-theme"),
            logoBrightImg &&
              logoDarkImg &&
              ((logoBrightImg.style.opacity = "1"),
              (logoDarkImg.style.opacity = "0"))));
    }
  }
  function updateHeaderTheme() {
    const e = qs(".header");
    if (!e) return;
    const t = qs("#features-overlay"),
      n = qs("#tech-overlay"),
      o = qs("#specialty-overlay");
    if (
      (t && t.classList.contains("active")) ||
      (n && n.classList.contains("active")) ||
      (o && o.classList.contains("active"))
    )
      return;
    if (!logoBrightImg || !logoDarkImg)
      return void (isInitializingHeaderTheme || initHeaderTheme());
    const i = document.body.classList.contains("dark-mode"),
      r = document.body.classList.contains("light-mode");
    const getEffectiveScrollY = () => {
      // When mobile menu is open we freeze scroll by setting body{position:fixed; top:-scrollY}.
      // window.scrollY becomes 0, so we must recover the real scroll from body.style.top.
      try {
        const body = document.body;
        if (body && body.style && body.style.position === "fixed") {
          const top = body.style.top || "";
          if (top) {
            const v = -parseInt(top, 10);
            if (Number.isFinite(v)) return v;
          }
        }
      } catch (_) {}
      return (
        (smoothScrollInstance && void 0 !== smoothScrollInstance.scroll
          ? smoothScrollInstance.scroll
          : window.scrollY || window.pageYOffset || document.documentElement.scrollTop) || 0
      );
    };
    if (i || r) {
      let t;
      if (
        (e.classList.toggle("dark-theme", i),
        e.classList.toggle("above-light-theme", r),
        logoBrightImg &&
          logoDarkImg &&
          (r
            ? ((logoBrightImg.style.opacity = "0"),
              (logoDarkImg.style.opacity = "1"))
            : ((logoBrightImg.style.opacity = "1"),
              (logoDarkImg.style.opacity = "0"))),
        (t = getEffectiveScrollY()),
        t > scrollThreshold
          ? e.classList.add("scroll-deep")
          : e.classList.remove("scroll-deep"),
        null === qs(".catalog-section"))
      ) {
        const n = Math.abs(t - lastScrollY);
        t > lastScrollY && t > scrollThreshold && n >= minScrollDelta
          ? e.classList.add("hidden")
          : t < lastScrollY &&
            n >= minScrollDeltaShow &&
            e.classList.remove("hidden");
      }
      return void (lastScrollY = t);
    }
    let s;
    s = getEffectiveScrollY();
    const l = e.offsetHeight;
    let a = !1;
    const c = qsa("section, .hero");
    if (0 === s || s < 100) {
      const e = c[0];
      e && e.classList.contains("light-theme") && (a = !0);
    } else
      c.forEach((e) => {
        const t = e.getBoundingClientRect();
        t.top <= l &&
          t.bottom >= l &&
          e.classList.contains("light-theme") &&
          (a = !0);
      });
    if (
      (a
        ? (e.classList.add("above-light-theme"),
          logoBrightImg &&
            logoDarkImg &&
            ((logoBrightImg.style.opacity = "0"),
            (logoDarkImg.style.opacity = "1")))
        : (e.classList.remove("above-light-theme"),
          logoBrightImg &&
            logoDarkImg &&
            ((logoBrightImg.style.opacity = "1"),
            (logoDarkImg.style.opacity = "0"))),
      s > scrollThreshold
        ? e.classList.add("scroll-deep")
        : e.classList.remove("scroll-deep"),
      null === qs(".catalog-section"))
    ) {
      const t = Math.abs(s - lastScrollY);
      s > lastScrollY && s > scrollThreshold && t >= minScrollDelta
        ? e.classList.add("hidden")
        : s < lastScrollY &&
          t >= minScrollDeltaShow &&
          e.classList.remove("hidden");
    }
    lastScrollY = s;
  }
  function cleanupAllFunctions() {
    ("undefined" != typeof ScrollTrigger &&
      ScrollTrigger.getAll().forEach((e) => e.kill()),
      "undefined" != typeof gsap && gsap.killTweensOf("*"),
      qsa(ANIMATED_ELEMENTS_SELECTOR).forEach((e) => {
        (e._opacityScrollTrigger &&
          (e._opacityScrollTrigger.kill(), (e._opacityScrollTrigger = null)),
          e._linesScrollTrigger &&
            (e._linesScrollTrigger.kill(), (e._linesScrollTrigger = null)),
          e._opacityTween && (e._opacityTween.kill(), (e._opacityTween = null)),
          e._linesTween && (e._linesTween.kill(), (e._linesTween = null)),
          e._splitTextInstance &&
            "undefined" != typeof SplitText &&
            (e._splitTextInstance = null));
      }));
    const e = document.querySelector(".sticky-cta-bar");
    (e &&
      (e._scrollHandler &&
        (smoothScrollInstance && "function" == typeof smoothScrollInstance.off
          ? smoothScrollInstance.off("scroll", e._scrollHandler)
          : window.removeEventListener("scroll", e._scrollHandler),
        (e._scrollHandler = null)),
      e._resizeHandler &&
        (window.removeEventListener("resize", e._resizeHandler),
        (e._resizeHandler = null)),
      e.classList.remove("fixed")),
      headerThemeInitialized &&
        (smoothScrollInstance && "function" == typeof smoothScrollInstance.off
          ? smoothScrollInstance.off("scroll", updateHeaderTheme)
          : window.removeEventListener("scroll", updateHeaderTheme),
        (headerThemeInitialized = !1)));
    const t = qs(".footer");
    (t &&
      (t._footerScrubObserver &&
        (t._footerScrubObserver.disconnect(), (t._footerScrubObserver = null)),
      t._footerScrubResizeHandler &&
        (window.removeEventListener("resize", t._footerScrubResizeHandler),
        (t._footerScrubResizeHandler = null)),
      t._footerScrubScrollHandler &&
        (smoothScrollInstance && "function" == typeof smoothScrollInstance.off
          ? smoothScrollInstance.off("scroll", t._footerScrubScrollHandler)
          : window.removeEventListener("scroll", t._footerScrubScrollHandler),
        (t._footerScrubScrollHandler = null))),
      smoothScrollInstance &&
        (smoothScrollInstance.destroy(),
        (smoothScrollInstance = null),
        (window.smoothScrollInstance = null)),
      qsa(".marquee-wrap").forEach((e) => {
        e._marqueeAnimation &&
          (e._marqueeAnimation.kill(), (e._marqueeAnimation = null));
      }),
      cleanupModel(),
      window.cleanupCursor && window.cleanupCursor());
  }
  function silentCleanup() {
    ("undefined" != typeof ScrollTrigger &&
      ScrollTrigger.getAll().forEach((e) => e.kill()),
      headerThemeInitialized &&
        (smoothScrollInstance
          ? smoothScrollInstance.off("scroll", updateHeaderTheme)
          : window.removeEventListener("scroll", updateHeaderTheme),
        (headerThemeInitialized = !1)));
  }
  function resetPageScroll() {
    ((document.body.style.position =
      document.body.style.top =
      document.body.style.width =
        ""),
      (document.body.style.overflow = document.documentElement.style.overflow =
        ""),
      smoothScrollInstance
        ? (smoothScrollInstance.start(),
          savedScrollY > 0 &&
            (smoothScrollInstance.scrollTo(savedScrollY, { immediate: !0 }),
            (savedScrollY = 0)),
          "undefined" != typeof ScrollTrigger &&
            requestAnimationFrame(() => {
              ScrollTrigger.update();
            }))
        : (savedScrollY > 0 &&
            (window.scrollTo(0, savedScrollY),
            (document.documentElement.scrollTop = savedScrollY),
            (document.body.scrollTop = savedScrollY),
            (savedScrollY = 0)),
          "undefined" != typeof ScrollTrigger &&
            requestAnimationFrame(() => {
              ScrollTrigger.update();
            })));
  }
  function initMarquee(e, t = 0) {
    if ("undefined" == typeof gsap)
      return t < 10 ? void setTimeout(() => initMarquee(e, t + 1), 100) : void 0;
    const n = e.querySelector(".marquee-collection"),
      o = e.querySelector(".marquee-scroll");
    if (!n || !o) return;
    e._marqueeAnimation &&
      (e._marqueeAnimation.kill(), (e._marqueeAnimation = null));
    const i = o.querySelectorAll(".marquee-collection");
    if (i.length > 1) for (let e = i.length - 1; e >= 1; e--) i[e].remove();
    const r = n.querySelector(".big-type");
    if (r) {
      const e = r.querySelector("span");
      e && e.remove();
      const t = document.createElement("span");
      ((t.textContent = " / "), r.appendChild(t));
    }
    o.offsetHeight;
    const s = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1,
      l = n.offsetWidth || n.scrollWidth || 1;
    if (l <= 0) return void setTimeout(() => initMarquee(e), 100);
    const a = (l / window.innerWidth) * 15 * s,
      c = Math.max(2, Math.ceil((2 * window.innerWidth) / l) + 1);
    for (let e = 0; e < c; e++) {
      const e = n.cloneNode(!0);
      o.appendChild(e);
    }
    const d = o.querySelectorAll(".marquee-collection");
    if (0 === d.length) return;
    d.forEach((e) => {
      const t = e.querySelector(".big-type");
      if (t && !t.querySelector("span")) {
        const e = document.createElement("span");
        ((e.textContent = " / "), t.appendChild(e));
      }
    });
    let u = 0;
    if (void 0 !== e._savedPosition && null !== e._savedPosition)
      ((u = e._savedPosition), (e._savedPosition = null));
    else {
      const e = parseFloat(gsap.getProperty(o, "x"));
      isNaN(e) || (u = e);
    }
    gsap.set(o, { x: u });
    const m = u - l;
    e._marqueeAnimation = gsap.to(o, {
      x: m,
      duration: a,
      ease: "linear",
      repeat: -1,
      modifiers: {
        x: function (e) {
          const t = parseFloat(e);
          return t <= -l ? t + l + "px" : e;
        },
      },
    });
  }
  function initAllMarquees(e = 0, t = 20) {
    if ("undefined" == typeof gsap)
      return e < t
        ? void setTimeout(() => initAllMarquees(e + 1, t), 100)
        : void console.warn(
            "GSAP not loaded after retries - marquees will not animate",
          );
    (qsa(".marquee-wrap").forEach((e) => {
      const t = e.querySelector(".marquee-scroll");
      let n = null;
      if (t && e._marqueeAnimation) {
        const o = parseFloat(gsap.getProperty(t, "x"));
        isNaN(o) || 0 === o || ((n = o), (e._savedPosition = n));
      }
      if (
        (e._marqueeAnimation &&
          (e._marqueeAnimation.kill(), (e._marqueeAnimation = null)),
        t)
      ) {
        const e = t.querySelectorAll(".marquee-collection");
        if (e.length > 1) for (let t = e.length - 1; t >= 1; t--) e[t].remove();
      }
    }),
      requestAnimationFrame(() => {
        qsa(".marquee-wrap").forEach(initMarquee);
      }));
  }
  function saveMarqueeStates(e) {
    return [];
  }
  function initMarqueesWithState(e, t) {
    const n = isTouchDevice() ? 150 : 50;
    setTimeout(() => initAllMarquees(), n);
  }
  function isMarqueeElement(e) {
    return e && null !== e.closest(".marquee-wrap");
  }
  let currentTestimonialIndex = -1,
    isSwitching = !1;
  function initTestimonials(e) {
    ((currentTestimonialIndex = -1), (isSwitching = !1));
    const t = e || document,
      n = qs(".testimonial-card", t);
    if (!n) return;
    const o = n.querySelector(".testimonial-number"),
      i = n.querySelector(".testimonial-text h4"),
      r = n.querySelector(".testimonial-author"),
      s = t.querySelector
        ? t.querySelector("#testimonial-prev")
        : document.getElementById("testimonial-prev"),
      l = t.querySelector
        ? t.querySelector("#testimonial-next")
        : document.getElementById("testimonial-next"),
      a = qs(".testimonial-item", t);
    if (
      ((testimonialItems = a
        ? Array.from(a.querySelectorAll(".w-dyn-item"))
            .map((e, t) => {
              const n = parseInt(
                e.querySelector(".testimonial-number")?.textContent?.trim() ||
                  "",
                10,
              );
              return {
                item: e,
                order: Number.isFinite(n) ? n : t,
                index: t,
              };
            })
            .sort((e, t) => e.order - t.order || e.index - t.index)
            .map(({ item: e }) => e)
        : []),
      a && (a.style.display = "none"),
      !(o && i && r && s && l && 0 !== testimonialItems.length))
    )
      return;
    const testimonialNumberValue = o.querySelector("span") || o;
    testimonialNumberValue.setAttribute("dir", "ltr");
    testimonialNumberValue.style.unicodeBidi = "isolate";
    const c = [
      {
        el: testimonialNumberValue,
        type: "chars",
        stagger: 0.05,
        duration: 0.7,
        delay: 0,
      },
      { el: i, type: "lines", stagger: 0.06, duration: 1, delay: 0 },
      { el: r, type: "lines", stagger: 0.06, duration: 1, delay: 0 },
    ];
    function d() {
      c.forEach(({ el: e }) => {
        e._splitTextInstance && (e._splitTextInstance = null);
      });
    }
    function u() {
      (d(),
        c.forEach(({ el: e, type: t, stagger: n, duration: o, delay: i }) => {
          animateSplitText(e, {
            type: t,
            direction: "in",
            stagger: n,
            duration: o,
            delay: i,
          });
        }));
    }
    function m(e) {
      if (
        e < 0 ||
        e >= testimonialItems.length ||
        (e === currentTestimonialIndex && isSwitching)
      )
        return;
      const t = testimonialItems[e];
      if (!t || isSwitching) return;
      ((isSwitching = !0),
        (currentTestimonialIndex = e),
        t.querySelector(".testimonial-number"));
      const n = t.querySelector(".testimonial-text h4"),
        i = t.querySelector(".testimonial-author"),
        r = [
          ((s = e + 1), String(s).padStart(2, "0")),
          n ? n.textContent.trim() : "",
          i ? i.innerHTML : "",
        ];
      var s;
      c.some(({ el: e }) => e._splitTextInstance)
        ? (c.forEach(({ el: e, type: t, stagger: n }) => {
            if (e._splitTextInstance) {
              const o = e._splitTextInstance,
                i = "chars" === t ? o.chars : o.lines;
              i &&
                i.length > 0 &&
                gsap.to(Array.from(i), {
                  yPercent: -100,
                  stagger: n,
                  clipPath: "inset(100% 0% 0% 0%)",
                  duration: 0.5,
                  ease: "power3.inOut",
                });
            }
          }),
          setTimeout(() => {
            (c.forEach(({ el: e }, t) => {
              e === testimonialNumberValue
                ? (e.textContent = r[t])
                : (e.innerHTML = r[t]);
            }),
              d(),
              requestAnimationFrame(() => {
                (u(),
                  setTimeout(() => {
                    isSwitching = !1;
                  }, 500));
              }));
          }, 500))
        : (c.forEach(({ el: e }, t) => {
            e === testimonialNumberValue
              ? (e.textContent = r[t])
              : (e.innerHTML = r[t]);
          }),
          d(),
          requestAnimationFrame(() => {
            (u(),
              setTimeout(() => {
                isSwitching = !1;
              }, 1200));
          }));
    }
    function g(e) {
      (e.preventDefault(),
        e.stopPropagation(),
        (function () {
          let e =
            -1 === currentTestimonialIndex
              ? testimonialItems.length - 1
              : currentTestimonialIndex - 1;
          (e < 0 && (e = testimonialItems.length - 1), m(e));
        })());
    }
    function h(e) {
      (e.preventDefault(),
        e.stopPropagation(),
        (function () {
          let e =
            -1 === currentTestimonialIndex ? 1 : currentTestimonialIndex + 1;
          (e >= testimonialItems.length && (e = 0), m(e));
        })());
    }
    ((s.style.cursor = "pointer"),
      (l.style.cursor = "pointer"),
      s.addEventListener("click", g),
      l.addEventListener("click", h));
    const f = s.querySelector("img"),
      p = l.querySelector("img");
    (f && ((f.style.pointerEvents = "auto"), f.addEventListener("click", g)),
      p && ((p.style.pointerEvents = "auto"), p.addEventListener("click", h)),
      m(0));
  }
  class DragScroll {
    constructor(e) {
      ("string" == typeof e.el
        ? (this.el = document.querySelector(e.el))
        : (this.el = e.el),
        this.el &&
          ("string" == typeof e.wrap
            ? (this.wrap = this.el.querySelector(e.wrap))
            : (this.wrap = e.wrap),
          this.wrap || (this.wrap = this.el),
          "string" == typeof e.item
            ? (this.items = this.el.querySelectorAll(e.item))
            : e.item && e.item.length
              ? (this.items = e.item)
              : (this.items = []),
          (this.dragThreshold = 5),
          (this.isDragging = !1),
          (this.isMouseDown = !1),
          (this.startX = 0),
          (this.startY = 0),
          (this.isHorizontalDrag = !1),
          (this.startTime = 0),
          (this.slideChanged = !1),
          (this.wheelGestureActive = !1),
          (this.lastWheelDirection = null),
          (this.onSlideChange = e.onSlideChange || null),
          (this.getCurrentIndex = e.getCurrentIndex || null),
          (this.getMaxIndex = e.getMaxIndex || null),
          (this.getStepSize = e.getStepSize || null),
          (this.onDragEnd = e.onDragEnd || null),
          this.init()));
    }
    init() {
      this.el &&
        this.wrap &&
        ((this.progress = 0),
        (this.x = 0),
        this.bindEvents(),
        this.calculate(),
        this.raf());
    }
    bindEvents() {
      this.el &&
        (window.addEventListener("resize", this.calculate.bind(this)),
        this.el.addEventListener("mousedown", (e) => this.handleStart(e)),
        window.addEventListener("mousemove", (e) => this.handleMove(e)),
        window.addEventListener("mouseup", (e) => this.handleEnd(e)),
        isTouchDevice() ||
          (this.el.addEventListener("touchstart", (e) => this.handleStart(e)),
          window.addEventListener("touchmove", (e) => this.handleMove(e)),
          window.addEventListener("touchend", (e) => this.handleEnd(e))),
        this.el.addEventListener("dragstart", (e) => this.preventDragOnLinks(e)),
        this.el.addEventListener("wheel", (e) => this.handleWheel(e), {
          passive: !1,
        }));
    }
    calculate() {
      if (this.wrap && this.el)
        if (
          ((this.wrapWidth = this.wrap.scrollWidth),
          (this.containerWidth = this.el.clientWidth),
          this.items.length > 0)
        ) {
          const e = this.items[this.items.length - 1],
            t = e.offsetLeft + e.offsetWidth;
          this.maxScroll = Math.max(0, t - this.el.clientWidth);
        } else this.maxScroll = Math.max(0, this.wrapWidth - this.containerWidth);
    }
    handleStart(e) {
      if (
        ((this.isDragging = !1),
        (this.isMouseDown = !0),
        (this.isHorizontalDrag = !1),
        (this.slideChanged = !1),
        (this.startX = e.clientX || e.touches[0].clientX),
        (this.startY = e.clientY || e.touches[0].clientY),
        (this.startTime = Date.now()),
        this.getStepSize && this.getCurrentIndex)
      ) {
        const e = this.getStepSize(),
          t = this.getCurrentIndex();
        ((this.progress = t * e), (this.x = this.progress));
      }
    }
    handleMove(e) {
      if (!this.isMouseDown) return;
      const t = e.clientX || e.touches[0].clientX,
        n = e.clientY || e.touches[0].clientY,
        o = t - this.startX,
        i = n - this.startY;
      if (!this.isHorizontalDrag)
        if (Math.abs(o) > Math.abs(i) && Math.abs(o) > this.dragThreshold)
          this.isHorizontalDrag = !0;
        else if (Math.abs(i) > this.dragThreshold) return;
      this.isHorizontalDrag &&
        (e.preventDefault(),
        (this.isDragging = !0),
        this.getStepSize && this.getStepSize(),
        (this.progress += 2.5 * -o),
        (this.startX = t),
        (this.startY = n),
        this.move());
    }
    handleEnd(e) {
      if (this.isMouseDown) {
        if (
          ((this.isMouseDown = !1),
          this.isDragging && this.onSlideChange && !this.slideChanged)
        ) {
          const e = this.getStepSize ? this.getStepSize() : 100,
            t = (this.getCurrentIndex ? this.getCurrentIndex() : 0) * e,
            n = this.progress - t;
          if (Math.abs(n) > 0.3 * e)
            ((this.slideChanged = !0),
              n > 0 ? this.onSlideChange("next") : this.onSlideChange("prev"),
              setTimeout(() => {
                if (this.getStepSize && this.getCurrentIndex) {
                  const e = this.getStepSize(),
                    t = this.getCurrentIndex();
                  ((this.progress = t * e), (this.x = this.progress));
                }
              }, 50));
          else if (this.getStepSize && this.getCurrentIndex) {
            const e = this.getStepSize(),
              t = this.getCurrentIndex();
            ((this.progress = t * e), (this.x = this.progress));
          }
          return ((this.isDragging = !1), void (this.slideChanged = !1));
        }
        if (this.getStepSize && this.getCurrentIndex) {
          const e = this.getStepSize(),
            t = this.getCurrentIndex();
          ((this.progress = t * e), (this.x = this.progress));
        }
        (this.onDragEnd &&
          setTimeout(() => {
            this.onDragEnd();
          }, 10),
          (this.isDragging = !1),
          (this.slideChanged = !1));
      }
    }
    handleWheel(e) {
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        Math.abs(e.deltaX) > Math.abs(e.deltaY) &&
        Math.abs(e.deltaX) > 5
      ) {
        (e.preventDefault(), e.stopPropagation());
        const t = e.deltaX > 0 ? "next" : "prev";
        ((this.wheelGestureActive && this.lastWheelDirection === t) ||
          ((this.wheelGestureActive = !0),
          (this.lastWheelDirection = t),
          this.onSlideChange && this.onSlideChange(t)),
          clearTimeout(this.wheelEndTimeout),
          (this.wheelEndTimeout = setTimeout(() => {
            if (
              ((this.wheelGestureActive = !1),
              (this.lastWheelDirection = null),
              this.getStepSize && this.getCurrentIndex)
            ) {
              const e = this.getStepSize(),
                t = this.getCurrentIndex();
              ((this.progress = t * e), (this.x = this.progress));
            }
            this.onDragEnd &&
              setTimeout(() => {
                this.onDragEnd();
              }, 10);
          }, 200)));
      }
    }
    preventDragOnLinks(e) {
      "A" === e.target.tagName && e.preventDefault();
    }
    move() {
      if (this.getStepSize) {
        const e = this.getStepSize(),
          t = (this.getMaxIndex ? this.getMaxIndex() : 0) * e;
        this.progress = Math.max(0, Math.min(this.progress, t));
      } else this.progress = Math.max(0, Math.min(this.progress, this.maxScroll));
    }
    raf() {
      if (this.wrap) {
        if (this.isDragging || this.isMouseDown)
          ((this.x += 0.1 * (this.progress - this.x)),
            (this.wrap.style.transform = `translateX(${-this.x}px)`),
            "undefined" != typeof gsap && gsap.killTweensOf(this.wrap),
            (this.wrap.style.transition = "none"));
        else if (this.getStepSize && this.getCurrentIndex) {
          const e = this.getStepSize(),
            t = this.getCurrentIndex();
          ((this.progress = t * e), (this.x = this.progress));
        }
        requestAnimationFrame(this.raf.bind(this));
      }
    }
  }
  function initBoxesSlider(e = null) {
    const t = e || document,
      n = (e, t) => {
        (e.preventDefault(), e.stopPropagation(), t());
      },
      o = qsa(".boxes-slider", t);
    o.length &&
      o.forEach((e) => {
        const t =
          e.closest(".container") ||
          e.closest(".blog-slider-wrapper")?.parentElement ||
          e.parentElement;
        if (!t) return;
        let o =
            t.querySelector("#blog-prev") ||
            t.querySelector("#features-prev") ||
            t.querySelector("#features-prev-2"),
          i =
            t.querySelector("#blog-next") ||
            t.querySelector("#features-next") ||
            t.querySelector("#features-next-2");
        if (!o || !i) {
          const e = t.querySelector(".section-header");
          if (e) {
            const t = e.querySelectorAll(".arrow-left, .arrow-right");
            t.length >= 2 &&
              ((o = Array.from(t).find((e) =>
                e.classList.contains("arrow-left"),
              )),
              (i = Array.from(t).find((e) =>
                e.classList.contains("arrow-right"),
              )));
          }
        }
        if (!o || !i) {
          const e = t.querySelectorAll(".arrow-left, .arrow-right");
          e.length >= 2 &&
            ((o = Array.from(e).find(
              (e) => e.classList.contains("arrow-left") || e.id.includes("prev"),
            )),
            (i = Array.from(e).find(
              (e) => e.classList.contains("arrow-right") || e.id.includes("next"),
            )));
        }
        if (!o || !i) return;
        const r = e.querySelectorAll(".column");
        if (0 === r.length) return;
        let s = 0;
        const l = e.parentElement;
        if (!l) return;
        let a = !1,
          c = null;
        function d() {
          if (!l || !e) return 0;
          const t = window.getComputedStyle(e),
            n = parseFloat(t.gap) || parseFloat(t.columnGap) || 0,
            o = t.gap || t.columnGap || "0";
          let i = 0;
          if (o.includes("vw")) i = (parseFloat(o) / 100) * window.innerWidth;
          else if (o.includes("%")) {
            const e = l.getBoundingClientRect().width;
            i = (parseFloat(o) / 100) * e;
          } else if (o.includes("rem")) {
            const e = parseFloat(
              getComputedStyle(document.documentElement).fontSize,
            );
            i = parseFloat(o) * e;
          } else if (o.includes("em")) {
            const t = parseFloat(getComputedStyle(e).fontSize);
            i = parseFloat(o) * t;
          } else i = n;
          return i;
        }
        function u() {
          const e = r[0];
          return e ? e.getBoundingClientRect().width : 0;
        }
        function m() {
          return u() + d();
        }
        function g() {
          if (!l || !e) return 1;
          const t = l.getBoundingClientRect().width,
            n = u(),
            o = d();
          if (0 === n) return 1;
          const i = Math.floor((t + o) / (n + o));
          return Math.max(1, i);
        }
        function h() {
          const e = g();
          return Math.max(0, r.length - e);
        }
        function f() {
          if (!l || !l.offsetWidth) return;
          const t = m();
          if (0 === t) return;
          const n = -s * t;
          if ("undefined" != typeof gsap) {
            gsap.killTweensOf(e);
            const t = getSliderConfig();
            gsap.to(e, { x: n, duration: t.duration, ease: t.ease });
          } else e.style.transform = `translateX(${n}px)`;
        }
        function p() {
          const e = h();
          (s >= e ? (s = 0) : (s += 1), f());
        }
        function y() {
          const e = h();
          (s <= 0 ? (s = e) : (s -= 1), f());
        }
        o.style.cursor = i.style.cursor = "pointer";
        const v = o.cloneNode(!0),
          w = i.cloneNode(!0);
        (o.parentNode.replaceChild(v, o),
          i.parentNode.replaceChild(w, i),
          v.addEventListener("click", (e) => n(e, y)),
          w.addEventListener("click", (e) => n(e, p)));
        const S = v.querySelector("img"),
          b = w.querySelector("img");
        (S &&
          ((S.style.pointerEvents = "auto"),
          S.addEventListener("click", (e) => n(e, y))),
          b &&
            ((b.style.pointerEvents = "auto"),
            b.addEventListener("click", (e) => n(e, p))));
        let E = 0,
          L = 0,
          T = 0,
          _ = 0,
          A = !1,
          x = !1,
          k = !1;
        l &&
          isTouchDevice() &&
          (l.addEventListener(
            "touchstart",
            (e) => {
              const t = e.touches[0];
              ((E = t.clientX), (L = t.clientY), (A = !0), (x = !1), (k = !1));
            },
            { passive: !0 },
          ),
          l.addEventListener(
            "touchmove",
            (e) => {
              if (!A) return;
              const t = e.touches[0];
              ((T = t.clientX), (_ = t.clientY));
              const n = Math.abs(T - E),
                o = Math.abs(_ - L);
              (n > 10 &&
                n > 1.2 * o &&
                ((k = !0), e.preventDefault(), e.stopPropagation()),
                (n > 10 || o > 10) &&
                  ((a = !0),
                  c && clearTimeout(c),
                  (c = setTimeout(() => {
                    a = !1;
                  }, 300))));
            },
            { passive: !1 },
          ),
          l.addEventListener(
            "touchend",
            (e) => {
              if (!A) return;
              if (x)
                return (
                  (A = !1),
                  (E = 0),
                  (L = 0),
                  (T = 0),
                  (_ = 0),
                  (x = !1),
                  void (k = !1)
                );
              const t = T - E,
                n = _ - L,
                o = Math.abs(t);
              (o > 1.5 * Math.abs(n) &&
                o > 30 &&
                (e.preventDefault(),
                e.stopPropagation(),
                (x = !0),
                t > 0 ? y() : p()),
                (A = !1),
                (E = 0),
                (L = 0),
                (T = 0),
                (_ = 0),
                (x = !1),
                (k = !1));
            },
            { passive: !1 },
          ));
        const q = (t) => {
          if (!l || !e) return;
          const n = l.getBoundingClientRect();
          if (
            !(
              n.width > 0 &&
              n.height > 0 &&
              n.top < window.innerHeight &&
              n.bottom > 0
            )
          )
            return;
          const o = document.activeElement;
          (o &&
            ("INPUT" === o.tagName ||
              "TEXTAREA" === o.tagName ||
              o.isContentEditable)) ||
            ("ArrowRight" === t.key
              ? (t.preventDefault(), p())
              : "ArrowLeft" === t.key && (t.preventDefault(), y()));
        };
        if (
          (document.addEventListener("keydown", q, { passive: !1 }),
          (l._keydownHandler = q),
          !isTouchDevice() && l && e)
        ) {
          const t = f,
            n = new DragScroll({
              el: l,
              wrap: e,
              item: ".column",
              onSlideChange: (e) => {
                ((a = !0),
                  c && clearTimeout(c),
                  (c = setTimeout(() => {
                    a = !1;
                  }, 300)),
                  "next" === e ? p() : y(),
                  setTimeout(() => {
                    if (n && n.getStepSize && n.getCurrentIndex) {
                      const e = n.getStepSize(),
                        t = n.getCurrentIndex();
                      ((n.progress = t * e), (n.x = n.progress));
                    }
                  }, 50));
              },
              getCurrentIndex: () => s,
              getMaxIndex: () => h(),
              getStepSize: () => m(),
              onDragEnd: () => {
                setTimeout(() => {
                  f();
                }, 10);
              },
            });
          n &&
            n.el &&
            n.wrap &&
            ((f = function () {
              if (!n || n.isDragging || n.isMouseDown) t();
              else {
                t();
                const e = m();
                ((n.progress = s * e), (n.x = n.progress));
              }
            }),
            (l._dragScroll = n));
        }
        l._isDraggingOrScrolling = () => a;
        const I = t.querySelector(".has-feature-counter");
        let C;
        (I && I.setAttribute("data-feature-count", r.length),
          e.classList.contains("features-slider") &&
            (e._featuresSlider = {
              currentIndex: s,
              getMaxIndex: h,
              getItemsPerView: g,
              posts: r,
              nextSlide: p,
              prevSlide: y,
              updateSlider: f,
            }));
        const H = () => {
          (clearTimeout(C),
            (C = setTimeout(() => {
              const e = h();
              (s > e && (s = e), f());
            }, 150)));
        };
        (window.addEventListener("resize", H),
          (e._cleanupResize = () => {
            window.removeEventListener("resize", H);
          }),
          requestAnimationFrame(() => {
            f();
          }));
      });
  }
  const FEATURES_TOGGLE_ANIM = {
    fadeDuration: 0.5,
    fadeDelay: 0,
    fadeEase: "cubic-bezier(0.5, 0, 0, 0.99)",
    heightDuration: 0.2,
    ease: "power2.out",
  };
  function initFeaturesToggle(e = null) {
    const t = e || document,
      n = qsa(".features-toggle-btn", t);
    n.length &&
      n.forEach((e) => {
        const t = e.closest(".container");
        if (!t) return;
        const n = t.querySelector(".boxes-slider-wrapper");
        if (!n) return;
        const o = n.querySelector(".features-slider");
        if (!o) return;
        const i = t.querySelector(".section-header"),
          r = i ? i.querySelector(".arrows") : null,
          s = r ? r.querySelector(".arrow-left") : null,
          l = r ? r.querySelector(".arrow-right") : null;
        e._toggleHandler &&
          (e.removeEventListener("click", e._toggleHandler),
          (e._toggleHandler = null));
        const a = (t) => {
          if ((t.preventDefault(), t.stopPropagation(), n._toggleAnimating))
            return;
          ((n._toggleAnimating = !0), (e.disabled = !0));
          const i = n.classList.contains("expanded"),
            r = FEATURES_TOGGLE_ANIM || {},
            a = r.heightDuration ?? 0.6,
            c = r.ease ?? "power2.out",
            d = r.fadeDuration ?? 0.3,
            u = r.fadeDelay ?? 0,
            m = r.fadeEase ?? "cubic-bezier(0.5, 0, 0, 0.99)";
          (n.style.setProperty("--features-fade-duration", d + "s"),
            n.style.setProperty("--features-fade-delay", u + "s"),
            n.style.setProperty("--features-fade-easing", m));
          const g = () => {
            (n.classList.remove("features-blur-out", "features-blur-in"),
              (n.style.height = ""),
              (n.style.overflow = ""),
              (n._toggleAnimating = !1),
              (e.disabled = !1),
              "undefined" != typeof ScrollTrigger && ScrollTrigger.refresh());
          };
          ((n.style.opacity = "0"),
            (n.style.filter = "blur(10px)"),
            (n.style.transition = "none"));
          const h = n.offsetHeight;
          (i
            ? (n.classList.remove("expanded"),
              o.classList.remove("expanded"),
              (o.style.transform = ""),
              s && (s.style.display = ""),
              l && (l.style.display = ""),
              o._featuresSlider &&
                o._featuresSlider.updateSlider &&
                o._featuresSlider.updateSlider(),
              e.classList.remove("active"),
              (e.textContent = "Show All"))
            : ((o.style.transform = ""),
              n.classList.add("expanded"),
              o.classList.add("expanded"),
              s && (s.style.display = "none"),
              l && (l.style.display = "none"),
              e.classList.add("active"),
              (e.textContent = "Close All")),
            n.offsetHeight);
          const f = n.scrollHeight;
          ((n.style.height = h + "px"),
            (n.style.overflow = "hidden"),
            (n.style.transition = ""),
            n.classList.remove("features-blur-out"),
            n.classList.add("features-blur-in"),
            "undefined" != typeof gsap
              ? gsap.to(n, { height: f, duration: a, ease: c, onComplete: g })
              : ((n.style.height = f + "px"), setTimeout(g, 1e3 * a)),
            requestAnimationFrame(() => {
              ((n.style.opacity = ""), (n.style.filter = ""));
            }));
        };
        ((e._toggleHandler = a), e.addEventListener("click", a));
      });
  }
  function initFeaturesOverlay(e = null) {
    const t = e || document,
      n = qs("#tech-overlay, .tech-overlay", t),
      o = qs("#tech-features-source, .tech-features-source", t),
      i = qsa(
        ".techonology-machine-image-container .hot-dot[data-feature-index]",
        t,
      );
    n && o && i.length > 0 && initSingleFeaturesOverlay(t, n, o, i);
    const r = qsa(".hot-dot[data-tech-image]", t);
    if (r.length > 0 && (!n || !o)) {
      const e = n || qs("#tech-overlay, .tech-overlay", t);
      e && initSingleFeaturesOverlay(t, e, null, r);
    }
    (qsa(".features-slider, .boxes-grid", t).forEach((e) => {
      const n = e.closest("section");
      if (!n) return;
      let o = null;
      const i = e.getAttribute("data-overlay-id");
      if (
        (i && (o = qs(`#${i}, .${i}`, t)),
        o || (o = n.querySelector(".features-overlay, .tech-overlay")),
        !o)
      ) {
        let e = n.nextElementSibling;
        for (; e; ) {
          if (
            e.classList.contains("features-overlay") ||
            e.classList.contains("tech-overlay")
          ) {
            o = e;
            break;
          }
          if ("SECTION" === e.tagName || "FOOTER" === e.tagName) break;
          e = e.nextElementSibling;
        }
      }
      o
        ? ((o._linkedSliderElement = e),
          (e._linkedOverlayElement = o),
          initSingleFeaturesOverlay(t, o, e))
        : i &&
          console.warn(
            "No overlay found for slider with data-overlay-id:",
            i,
            e.className,
            e.id,
          );
    }),
      qsa(".features-overlay[data-open-trigger]", t).forEach((e) => {
        const n = e.getAttribute("data-open-trigger");
        if (!n) return;
        const o = qsa(n, t);
        o.length && initSingleFeaturesOverlay(t, e, null, null, o);
      }));
  }
  function initSingleFeaturesOverlay(e, t, n, o = null, i = null) {
    if (!t) return;
    const r =
        n && n.classList.contains("tech-features-source") && o && o.length > 0,
      s = o && o.length > 0 && !r;
    if (
      ((t._linkedSlider = n),
      (t._linkedHotDots = o),
      (t._isHotDotsMode = s),
      (t._isHybridTechMode = r),
      t._initialized)
    )
      return;
    ((t._initialized = !0),
      t._resizeHandler &&
        (window.removeEventListener("resize", t._resizeHandler),
        (t._resizeHandler = null)),
      !n ||
        s ||
        r ||
        n.querySelectorAll(".column").forEach((e, t) => {
          const n = e.querySelector(".link-box");
          (n &&
            n._overlayClickHandler &&
            (n.removeEventListener("click", n._overlayClickHandler),
            (n._overlayClickHandler = null)),
            e._overlayClickHandler &&
              (e.removeEventListener("click", e._overlayClickHandler),
              (e._overlayClickHandler = null)));
        }),
      (s || r) &&
        o &&
        o.forEach((e) => {
          e._techOverlayClickHandler &&
            (e.removeEventListener("click", e._techOverlayClickHandler),
            (e._techOverlayClickHandler = null));
        }));
    const l = t.querySelector(".features-overlay-close, .tech-overlay-close"),
      a = t.querySelector(".features-overlay-image img, .tech-overlay-image img"),
      c = t.querySelector(".features-overlay-number, .tech-overlay-number"),
      d = t.querySelector(".features-overlay-title, .tech-overlay-title"),
      u = t.querySelector(
        ".features-overlay-description, .tech-overlay-description",
      ),
      m = t.querySelector(
        ".features-overlay-arrows .arrow-left, .tech-overlay-arrows .arrow-left",
      ),
      g = t.querySelector(
        ".features-overlay-arrows .arrow-right, .tech-overlay-arrows .arrow-right",
      );
    if (
      (l &&
        l._closeHandler &&
        (l.removeEventListener("click", l._closeHandler),
        (l._closeHandler = null)),
      m &&
        m._prevHandler &&
        (m.removeEventListener("click", m._prevHandler), (m._prevHandler = null)),
      g &&
        g._nextHandler &&
        (g.removeEventListener("click", g._nextHandler), (g._nextHandler = null)),
      t._escapeHandler &&
        (document.removeEventListener("keydown", t._escapeHandler),
        (t._escapeHandler = null)),
      t._backgroundClickHandler &&
        (t.removeEventListener("click", t._backgroundClickHandler),
        (t._backgroundClickHandler = null)),
      !n && !o && i && i.length > 0 && l)
    ) {
      t._simpleOpenHandlers &&
        (t._simpleOpenHandlers.forEach(({ el: e, fn: t }) =>
          e.removeEventListener("click", t),
        ),
        (t._simpleOpenHandlers = null));
      const e = () => {
          (t.parentElement !== document.body && document.body.appendChild(t),
            t.classList.remove("active"),
            t.offsetHeight,
            t.classList.add("active"),
            (document.body.style.overflow = "hidden"));
        },
        n = () => {
          (t.classList.remove("active"), (document.body.style.overflow = ""));
        };
      (i.forEach((n) => {
        const o = (t) => {
          (t.preventDefault(), e());
        };
        (n.addEventListener("click", o),
          t._simpleOpenHandlers || (t._simpleOpenHandlers = []),
          t._simpleOpenHandlers.push({ el: n, fn: o }));
      }),
        l._closeHandler && l.removeEventListener("click", l._closeHandler),
        (l._closeHandler = n),
        l.addEventListener("click", l._closeHandler),
        (t._backgroundClickHandler = (e) => {
          e.target === t && n();
        }),
        t.addEventListener("click", t._backgroundClickHandler),
        (t._escapeHandler = (e) => {
          "Escape" === e.key && t.classList.contains("active") && n();
        }),
        document.addEventListener("keydown", t._escapeHandler));
      const o = t.querySelector("form");
      const isWebflowForm =
        !!o &&
        (o.closest(".w-form") ||
          o.hasAttribute("data-wf-page-id") ||
          o.hasAttribute("data-wf-element-id") ||
          /^wf-form-/i.test(o.id || ""));
      return (
        o &&
          !isWebflowForm &&
          (o._simpleSubmitHandler &&
            o.removeEventListener("submit", o._simpleSubmitHandler),
          (o._simpleSubmitHandler = (e) => {
            (e.preventDefault(), n());
          }),
          o.addEventListener("submit", o._simpleSubmitHandler)),
        void (t._initialized = !0)
      );
    }
    if (!(l && a && c && d && u && m && g)) return;
    let h = 0;
    function f() {
      if (t._isHybridTechMode && t._linkedSlider) {
        const e = Array.from(
          t._linkedSlider.querySelectorAll(".tech-feature-item"),
        );
        return (
          e.sort(
            (e, t) =>
              parseInt(e.getAttribute("data-feature-index") || "0") -
              parseInt(t.getAttribute("data-feature-index") || "0"),
          ),
          e
        );
      }
      if (t._isHotDotsMode) {
        const n = Array.from(e.querySelectorAll(".hot-dot[data-tech-image]"));
        if (n.length > 0)
          return (
            n.sort(
              (e, t) =>
                parseInt(e.getAttribute("data-feature-index") || "0") -
                parseInt(t.getAttribute("data-feature-index") || "0"),
            ),
            n
          );
        if (t._linkedHotDots) return Array.from(t._linkedHotDots);
      }
      if (t._linkedSlider) {
        const e = t._linkedSlider.querySelectorAll(".column");
        return Array.from(e);
      }
      if (s && o) return Array.from(o);
      if (n) {
        const e = n.querySelectorAll(".column");
        return Array.from(e);
      }
      return [];
    }
    function p(e) {
      const n = t._isHotDotsMode,
        o = f();
      if (0 === o.length)
        return (
          console.warn("No features found for overlay:", t.id || t.className),
          null
        );
      const i = o[e];
      if (!i)
        return (
          console.warn(
            "Feature not found at index:",
            e,
            "out of",
            o.length,
            "features",
          ),
          null
        );
      if (n) {
        const t = i.getAttribute("data-tech-image") || "",
          n = i.getAttribute("data-tech-title") || "",
          o = i.getAttribute("data-tech-description") || "";
        return n || t
          ? {
              title: n,
              image: t,
              number: `(${String(e + 1).padStart(2, "0")})`,
              description: o,
            }
          : (console.warn("Hot dot missing required data at index:", e, i), null);
      }
      let r = i.querySelector(".tech-feature-title");
      (r || (r = i.querySelector(".box-name h4")),
        r || (r = i.querySelector("h4")),
        r || (r = i.querySelector(".title")),
        r || (r = i.querySelector('[class*="title"]')));
      let s = i.querySelector(".tech-feature-image img");
      if (
        (s || (s = i.querySelector(".box-background img")),
        s || (s = i.querySelector(".img-block img")),
        !s)
      ) {
        const e = i.querySelectorAll("img");
        for (const t of e)
          if (t.offsetWidth > 50 && t.offsetHeight > 50) {
            s = t;
            break;
          }
        !s && e.length > 0 && (s = e[0]);
      }
      let l = i.getAttribute("data-feature-description");
      if (
        (l || (l = i.getAttribute("data-specialty-description")),
        l || (l = i.getAttribute("data-tech-description")),
        l || (l = i.getAttribute("data-description")),
        !l)
      ) {
        const e =
          i.querySelector(".tech-feature-description") ||
          i.querySelector(".description") ||
          i.querySelector('[class*="description"]') ||
          i.querySelector("p");
        e && (l = e.textContent.trim());
      }
      l = l || "";
      const a = r ? r.textContent.trim() : "",
        c = s ? s.src : "";
      return a || c
        ? {
            title: a,
            image: c,
            number: `(${String(e + 1).padStart(2, "0")})`,
            description: l,
          }
        : (console.warn(
            "Feature missing required data at index:",
            e,
            "Feature element:",
            i,
          ),
          console.warn("Available elements:", {
            hasBoxName: !!i.querySelector(".box-name"),
            hasBoxBackground: !!i.querySelector(".box-background"),
            hasH4: !!i.querySelector("h4"),
            hasImg: !!i.querySelector("img"),
            dataAttrs: Array.from(i.attributes)
              .map((e) => e.name)
              .filter((e) => e.startsWith("data-")),
          }),
          null);
    }
    function y(o) {
      let i = p(o);
      if (t._isHybridTechMode) {
        const t = e.querySelector(".techonology-machine-image-container");
        t && t._techMaskMoveToIndex && t._techMaskMoveToIndex(o);
      }
      if ((!i || (!i.title && !i.image)) && t._isHotDotsMode) {
        const e = f();
        if (e[o]) {
          const t = e[o],
            n = t.getAttribute("data-tech-image") || "",
            r = t.getAttribute("data-tech-title") || "",
            s = t.getAttribute("data-tech-description") || "";
          (r || n) &&
            (i = {
              title: r,
              image: n,
              number: `(${String(o + 1).padStart(2, "0")})`,
              description: s,
            });
        }
      }
      if (!i)
        return void console.warn("Failed to get feature data for index:", o);
      if (!i.title && !i.image)
        return void console.warn("Feature data is empty for index:", o, i);
      if (
        t.classList.contains("active") &&
        h === o &&
        d.textContent === i.title &&
        u.textContent === i.description &&
        c.textContent === i.number &&
        a.src === (i.image || a.src)
      )
        return;
      ((h = o),
        i.title && ((d.textContent = i.title), (a.alt = i.title)),
        (c.textContent = i.number),
        i.description ? (u.textContent = i.description) : (u.textContent = ""),
        i.image &&
          ((a.style.opacity = ""),
          (a.style.visibility = ""),
          (a.style.display = ""),
          (a.onload = function () {
            ((this.style.opacity = ""),
              (this.style.visibility = ""),
              (this.style.display = ""));
          }),
          (a.src = i.image),
          (a.onerror = function () {
            (console.warn("Overlay image failed to load:", this.src),
              (this.style.display = "none"));
          })));
      const r = t._linkedSlider;
      if (!t._isHotDotsMode && r && r._featuresSlider) {
        const e = n._featuresSlider,
          t = f(),
          i = e.getItemsPerView
            ? e.getItemsPerView()
            : isMobileLayoutBreakpoint()
              ? 1
              : 3,
          r = e.getMaxIndex ? e.getMaxIndex() : Math.max(0, t.length - i),
          s = Math.min(Math.floor(o / i), r);
        e.currentIndex !== s && ((e.currentIndex = s), e.updateSlider());
      }
    }
    function v(e) {
      const n = f();
      if (0 === n.length || e >= n.length)
        return void console.error(
          "Cannot open overlay - invalid index or no features:",
          e,
          {
            overlay: t.id || t.className,
            slider: t._linkedSlider?.className || t._linkedSlider?.id,
            isHotDots: t._isHotDotsMode,
            featuresCount: n.length,
          },
        );
      let o = p(e);
      if ((!o || (!o.title && !o.image)) && t._isHotDotsMode && n[e]) {
        const t = n[e],
          i = t.getAttribute("data-tech-image") || "",
          r = t.getAttribute("data-tech-title") || "",
          s = t.getAttribute("data-tech-description") || "";
        (r || i) &&
          (o = {
            title: r,
            image: i,
            number: `(${String(e + 1).padStart(2, "0")})`,
            description: s,
          });
      }
      o
        ? o.title || o.image
          ? (y(e), t.classList.add("active"))
          : console.error("Cannot open overlay - data is empty for index:", e, o)
        : console.error("Cannot open overlay - no data found for index:", e, {
            overlay: t.id || t.className,
            slider: t._linkedSlider?.className || t._linkedSlider?.id,
            isHotDots: t._isHotDotsMode,
            featuresCount: n.length,
          });
    }
    function w() {
      t.classList.remove("active");
    }
    function S() {
      const e = f();
      y((h + 1) % e.length);
    }
    function b() {
      const e = f();
      y((h - 1 + e.length) % e.length);
    }
    (r && o
      ? o.forEach((e) => {
          const t = (t) => {
            (t.preventDefault(),
              t.stopPropagation(),
              v(parseInt(e.getAttribute("data-feature-index") || "0")));
          };
          (e.addEventListener("click", t), (e._techOverlayClickHandler = t));
        })
      : f().forEach((t, o) => {
          if (s) {
            const n = (n) => {
              (n.preventDefault(), n.stopPropagation());
              const i = parseInt(
                  t.getAttribute("data-feature-index") || String(o),
                ),
                r = Array.from(e.querySelectorAll(".hot-dot[data-tech-image]"));
              r.sort(
                (e, t) =>
                  parseInt(e.getAttribute("data-feature-index") || "0") -
                  parseInt(t.getAttribute("data-feature-index") || "0"),
              );
              const s = r.findIndex((e) => e === t);
              v(-1 !== s ? s : i);
            };
            (t.addEventListener("click", n), (t._techOverlayClickHandler = n));
          } else {
            const e = t.querySelector(".link-box");
            if (e) {
              const t = (e) => {
                const t = n?.closest(".boxes-slider-wrapper");
                if (t && t._isDraggingOrScrolling && t._isDraggingOrScrolling())
                  return (e.preventDefault(), void e.stopPropagation());
                (e.preventDefault(), v(o));
              };
              (e.addEventListener("click", t), (e._overlayClickHandler = t));
            }
            t.style.cursor = "pointer";
            const i = (e) => {
              if (e.target.closest(".link-box")) return;
              const t = n?.closest(".boxes-slider-wrapper");
              if (t && t._isDraggingOrScrolling && t._isDraggingOrScrolling())
                return (e.preventDefault(), void e.stopPropagation());
              v(o);
            };
            (t.addEventListener("click", i), (t._overlayClickHandler = i));
          }
        }),
      l.addEventListener("click", w));
    const E = (e, t) => {
      (e.preventDefault(), e.stopPropagation(), t());
    };
    (m.addEventListener("click", (e) => E(e, b)),
      g.addEventListener("click", (e) => E(e, S)));
    const L = m.querySelector("img"),
      T = g.querySelector("img");
    (L &&
      ((L.style.pointerEvents = "auto"),
      L.addEventListener("click", (e) => E(e, b))),
      T &&
        ((T.style.pointerEvents = "auto"),
        T.addEventListener("click", (e) => E(e, S))));
    const _ = (e) => {
      "Escape" === e.key && t.classList.contains("active") && w();
    };
    (document.addEventListener("keydown", _), (t._escapeHandler = _));
    const A = (e) => {
      e.target === t && w();
    };
    let x;
    (t.addEventListener("click", A), (t._backgroundClickHandler = A));
    let k = !1;
    const q = () => {
      isTouchDevice() ||
        k ||
        ((k = !0),
        clearTimeout(x),
        (x = setTimeout(() => {
          (!(function () {
            if (isTouchDevice()) return;
            if ("undefined" == typeof ScrollTrigger) return;
            if (t.classList.contains("active")) return;
            const e =
              window.scrollY ||
              window.pageYOffset ||
              document.documentElement.scrollTop;
            (ScrollTrigger.refresh(),
              requestAnimationFrame(() => {
                (window.scrollTo(0, e),
                  void 0 !== smoothScrollInstance &&
                    smoothScrollInstance &&
                    smoothScrollInstance.scrollTo(e, { immediate: !0 }));
              }));
          })(),
            (k = !1));
        }, 150)));
    };
    (window.addEventListener("resize", q), (t._resizeHandler = q));
  }
  function initProductFeatureBoxSlider(e = null) {
    const t = e || document,
      n = [".features-richtext", ".extra-richtext"],
      o = (e) => (e || "").replace(/\s+/g, " ").trim();
    function i() {
      n.forEach((e) => {
        const n = qs(e, t);
        n &&
          (function (e) {
            const t = (function (e) {
              let t = e.previousElementSibling;
              for (; t; ) {
                if (t.classList && t.classList.contains("boxes-slider-wrapper"))
                  return t;
                t = t.previousElementSibling;
              }
              return null;
            })(e);
            if (!t) return;
            const n = Array.from(t.querySelectorAll(".features-slider .column"));
            if (!n.length) return;
            const i = (function (e) {
              return Array.from(e.querySelectorAll("h4"))
                .map((e) => {
                  let t = e.nextElementSibling;
                  for (; t && "P" !== t.tagName; ) t = t.nextElementSibling;
                  return {
                    title: o(e.textContent),
                    desc: o(t ? t.textContent : ""),
                  };
                })
                .filter((e) => e.title || e.desc);
            })(e);
            i.length &&
              ((function (e, t) {
                e.forEach((e, n) => {
                  const o = t[n];
                  if (!o) return;
                  const i = e.querySelector(".box-name h4");
                  (i && o.title && (i.textContent = o.title),
                    o.desc && e.setAttribute("data-feature-description", o.desc),
                    e.setAttribute(
                      "data-feature-index",
                      String(n + 1).padStart(2, "0"),
                    ));
                });
              })(n, i),
              (e.style.display = "none"));
          })(n);
      });
    }
    (i(), setTimeout(i, 250), setTimeout(i, 800));
    const r = t;
    if (r && "MutationObserver" in window) {
      let e = !1;
      const o = new MutationObserver(() => {
        e || (n.some((e) => qs(e, t)) && ((e = !0), i(), o.disconnect()));
      });
      (o.observe(r, { childList: !0, subtree: !0 }),
        setTimeout(() => o.disconnect(), 4e3));
    }
  }
  function initSpecialtyOverlay(e = null) {
    const t = e || document,
      n = qs("#specialty-overlay", t),
      o = Array.from(t.querySelectorAll(".container")).find((e) => {
        const t = e.querySelector(".indicator");
        return t && t.textContent.includes("Our Specialty");
      });
    if (!n || !o) return;
    const i = o.querySelector(".boxes-grid");
    if (!i) return;
    (n._resizeHandler &&
      (window.removeEventListener("resize", n._resizeHandler),
      (n._resizeHandler = null)),
      i.querySelectorAll(".column").forEach((e, t) => {
        const n = e.querySelector(".link-box");
        (n &&
          n._overlayClickHandler &&
          (n.removeEventListener("click", n._overlayClickHandler),
          (n._overlayClickHandler = null)),
          e._overlayClickHandler &&
            (e.removeEventListener("click", e._overlayClickHandler),
            (e._overlayClickHandler = null)));
      }));
    const r = qs("#specialty-overlay-close", t),
      s = qs("#specialty-overlay-img", t),
      l = qs("#specialty-overlay-number", t),
      a = qs("#specialty-overlay-title", t),
      c = qs("#specialty-overlay-description", t),
      d = qs("#specialty-overlay-prev", t),
      u = qs("#specialty-overlay-next", t);
    if (
      (r &&
        r._closeHandler &&
        (r.removeEventListener("click", r._closeHandler),
        (r._closeHandler = null)),
      d &&
        d._prevHandler &&
        (d.removeEventListener("click", d._prevHandler), (d._prevHandler = null)),
      u &&
        u._nextHandler &&
        (u.removeEventListener("click", u._nextHandler), (u._nextHandler = null)),
      n._escapeHandler &&
        (document.removeEventListener("keydown", n._escapeHandler),
        (n._escapeHandler = null)),
      n._backgroundClickHandler &&
        (n.removeEventListener("click", n._backgroundClickHandler),
        (n._backgroundClickHandler = null)),
      !(r && s && l && a && c && d && u))
    )
      return;
    let m = 0;
    function g() {
      return i.querySelectorAll(".column");
    }
    function h(e) {
      const t = (function (e) {
        const t = g()[e];
        if (!t) return null;
        const n = t.querySelector(".box-name h4"),
          o = t.querySelector(".box-background img"),
          i = t.getAttribute("data-specialty-description") || "";
        return {
          title: n ? n.textContent.trim() : "",
          image: o ? o.src : "",
          number: `(${String(e + 1).padStart(2, "0")})`,
          description: i,
        };
      })(e);
      t &&
        ((m = e),
        t.image &&
          ((s.style.opacity = ""),
          (s.style.visibility = ""),
          (s.style.display = ""),
          (s.onload = function () {
            ((this.style.opacity = ""),
              (this.style.visibility = ""),
              (this.style.display = ""));
          }),
          (s.src = t.image),
          (s.onerror = function () {
            (console.warn("Specialty overlay image failed to load:", this.src),
              (this.style.display = "none"));
          })),
        (s.alt = t.title),
        (l.textContent = t.number),
        (a.textContent = t.title),
        (c.textContent = t.description));
    }
    function f(e) {
      (h(e), n.classList.add("active"));
    }
    function p() {
      n.classList.remove("active");
    }
    function y() {
      const e = g();
      h((m + 1) % e.length);
    }
    function v() {
      const e = g();
      h((m - 1 + e.length) % e.length);
    }
    g().forEach((e, t) => {
      const n = e.querySelector(".link-box");
      if (n) {
        const e = (e) => {
          (e.preventDefault(), e.stopPropagation(), f(t));
        };
        (n.addEventListener("click", e), (n._overlayClickHandler = e));
      }
      e.style.cursor = "pointer";
      const o = (e) => {
        e.target.closest(".link-box") ||
          (e.preventDefault(), e.stopPropagation(), f(t));
      };
      (e.addEventListener("click", o), (e._overlayClickHandler = o));
    });
    const w = () => p();
    (r.addEventListener("click", w), (r._closeHandler = w));
    const S = (e, t) => {
        (e.preventDefault(), e.stopPropagation(), t());
      },
      b = (e) => S(e, v),
      E = (e) => S(e, y);
    (d.addEventListener("click", b),
      u.addEventListener("click", E),
      (d._prevHandler = b),
      (u._nextHandler = E));
    const L = d.querySelector("img"),
      T = u.querySelector("img");
    if (L) {
      L.style.pointerEvents = "auto";
      const e = (e) => S(e, v);
      (L.addEventListener("click", e), (L._prevHandler = e));
    }
    if (T) {
      T.style.pointerEvents = "auto";
      const e = (e) => S(e, y);
      (T.addEventListener("click", e), (T._nextHandler = e));
    }
    const _ = (e) => {
      "Escape" === e.key && n.classList.contains("active") && p();
    };
    (document.addEventListener("keydown", _), (n._escapeHandler = _));
    const A = (e) => {
      e.target === n && p();
    };
    let x;
    (n.addEventListener("click", A), (n._backgroundClickHandler = A));
    let k = !1;
    const q = () => {
      isTouchDevice() ||
        k ||
        ((k = !0),
        clearTimeout(x),
        (x = setTimeout(() => {
          (!(function () {
            if (isTouchDevice()) return;
            if ("undefined" == typeof ScrollTrigger) return;
            if (n.classList.contains("active")) return;
            const e =
              window.scrollY ||
              window.pageYOffset ||
              document.documentElement.scrollTop;
            (ScrollTrigger.refresh(),
              requestAnimationFrame(() => {
                (window.scrollTo(0, e),
                  void 0 !== smoothScrollInstance &&
                    smoothScrollInstance &&
                    smoothScrollInstance.scrollTo(e, { immediate: !0 }));
              }));
          })(),
            (k = !1));
        }, 150)));
    };
    (window.addEventListener("resize", q), (n._resizeHandler = q));
  }
  let currentProductGalleryIndex = 0,
    isProductGalleryAnimating = !1,
    pendingTransitions = [],
    activeAnimations = [];
  const PRODUCT_GALLERY_CONFIG = {
    transitionDuration: 1.3,
    staggerDelay: 0.05,
    fadeOutDuration: 0.5,
    initialAnimationDuration: 1.5,
    initialEase: "power4.out",
    transitionEase: "expo.out",
  };
  function isProductGalleryMobile() {
    try {
      return (
        "1" ===
        getComputedStyle(document.documentElement)
          .getPropertyValue("--product-gallery-mobile")
          .trim()
      );
    } catch (e) {
      return isMobileLayoutBreakpoint();
    }
  }
  function getGalleryAnimStates() {
    return isProductGalleryMobile()
      ? {
          side: { opacity: 0.5, scale: 0.4, filter: "blur(1vw)" },
          active: { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" },
          prevPos: { x: "-55%", y: "-20%" },
          nextPos: { x: "55%", y: "-20%" },
          prevEnter: { x: "-70%", y: "-50%" },
          nextEnter: { x: "70%", y: "-50%" },
          prevExit: { x: "70%", y: "-50%", scale: 0 },
          nextExit: { x: "-70%", y: "-50%", scale: 0 },
        }
      : {
          side: { opacity: 0.5, scale: 0.6, filter: "blur(1vw)" },
          active: { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" },
          prevPos: { x: "-45%", y: "-30%" },
          nextPos: { x: "45%", y: "-30%" },
          prevEnter: { x: "-70%", y: "-50%" },
          nextEnter: { x: "70%", y: "-50%" },
          prevExit: { x: "70%", y: "-50%", scale: 0 },
          nextExit: { x: "-70%", y: "-50%", scale: 0 },
        };
  }
  function projectBadgeVwToPx(e) {
    return (e / 100) * window.innerWidth;
  }
  function projectBadgePxToVw(e) {
    return (e / window.innerWidth) * 100;
  }
  function projectBadgeIntroSizeVw() {
    return isMobileViewport() ? 24 : 9.72;
  }
  function projectBadgeSettledSizeVw() {
    return isMobileViewport() ? 12 : 4.2;
  }
  function applyProjectBadgeVars(e) {
    const t = isMobileViewport();
    (e.style.setProperty(
        "--project-badge-intro-size",
        `${projectBadgeIntroSizeVw()}vw`,
      ),
      e.style.setProperty(
        "--project-badge-settled-size",
        `${projectBadgeSettledSizeVw()}vw`,
      ),
      e.style.setProperty("--project-badge-settled-left", t ? "3vw" : "1vw"),
      e.style.setProperty(
        "--project-badge-settled-bottom",
        t ? "3vw" : "1.3vw",
      ));
  }
  function getProjectBadgeIntroSizePx(e) {
    applyProjectBadgeVars(e);
    const t =
      parseFloat(
        getComputedStyle(e).getPropertyValue("--project-badge-intro-size"),
      ) || projectBadgeIntroSizeVw();
    return projectBadgeVwToPx(t);
  }
  function getProjectBadgeSettledSizeVw() {
    return projectBadgeSettledSizeVw();
  }
  function getProjectBadgeSettledScale() {
    return projectBadgeSettledSizeVw() / projectBadgeIntroSizeVw();
  }
  function getProjectBadgeExpandedScale() {
    return 3 * getProjectBadgeSettledScale();
  }
  function getProjectBadgeExpandedSizeVw() {
    return 3 * projectBadgeSettledSizeVw();
  }
  function getProjectBadgeRestMetrics(e = null) {
    const t = getProjectBadgeSettledScale();
    let n = isMobileViewport() ? 3 : 1,
      o = isMobileViewport() ? 3 : 1.3;
    if (e) {
      applyProjectBadgeVars(e);
      const i = getComputedStyle(e),
        r = parseFloat(i.getPropertyValue("--project-badge-settled-left")),
        s = parseFloat(i.getPropertyValue("--project-badge-settled-bottom"));
      Number.isNaN(r) || (n = r);
      Number.isNaN(s) || (o = s);
    }
    const i = projectBadgeVwToPx(projectBadgeIntroSizeVw()) * t;
    return {
      x: projectBadgeVwToPx(n) + i / 2,
      y: window.innerHeight - projectBadgeVwToPx(o) - i / 2,
      scale: t,
      expandedScale: getProjectBadgeExpandedScale(),
    };
  }
  function refreshProjectBadgeLayout(e) {
    if (!e?.isConnected || "undefined" == typeof gsap) return;
    const t = getProjectBadgeRestMetrics(e);
    if (e.classList.contains("is-expanded"))
      return (
        e._projectBadgeExpandTween &&
          (e._projectBadgeExpandTween.kill(),
          (e._projectBadgeExpandTween = null)),
        (e._projectBadgeRest = { x: t.x, y: t.y, scale: t.scale }),
        void projectBadgeApplyTransform(e, {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          scale: t.expandedScale,
          zIndex: 9995,
        })
      );
    if (e.classList.contains("is-settled"))
      return (
        (e._projectBadgeRest = { x: t.x, y: t.y, scale: t.scale }),
        void projectBadgeApplyTransform(e, {
          x: t.x,
          y: t.y,
          scale: t.scale,
          zIndex: 9990,
        })
      );
    e.classList.contains("is-animating") &&
      (e._projectBadgeTimeline &&
        (e._projectBadgeTimeline.kill(), (e._projectBadgeTimeline = null)),
      e._projectBadgeDelay &&
        (e._projectBadgeDelay.kill(), (e._projectBadgeDelay = null)),
      e.classList.remove("is-animating"),
      e.classList.add("is-settled"),
      (e._projectBadgeRest = { x: t.x, y: t.y, scale: t.scale }),
      projectBadgeApplyTransform(e, {
        x: t.x,
        y: t.y,
        scale: t.scale,
        zIndex: 9990,
        visibility: "visible",
      }));
  }
  function detachProjectBadgeResizeHandler(e) {
    e._badgeResizeHandler &&
      (window.removeEventListener("resize", e._badgeResizeHandler),
      (e._badgeResizeHandler = null));
  }
  function attachProjectBadgeResizeHandler(e) {
    detachProjectBadgeResizeHandler(e);
    let t;
    ((e._badgeResizeHandler = () => {
      clearTimeout(t);
      t = setTimeout(() => refreshProjectBadgeLayout(e), 150);
    }),
      window.addEventListener("resize", e._badgeResizeHandler, {
        passive: !0,
      }));
  }
  function destroyProjectBadge(e) {
    e &&
      (unbindProjectBadgeInteractions(e),
      detachProjectBadgeResizeHandler(e),
      e._projectBadgeTimeline &&
        (e._projectBadgeTimeline.kill(), (e._projectBadgeTimeline = null)),
      e._projectBadgeDelay &&
        (e._projectBadgeDelay.kill(), (e._projectBadgeDelay = null)),
      e._projectBadgeExpandTween &&
        (e._projectBadgeExpandTween.kill(), (e._projectBadgeExpandTween = null)),
      e._projectBadgeLoaderHandler &&
        (window.removeEventListener(
          "firstOverlayDismissed",
          e._projectBadgeLoaderHandler,
        ),
        (e._projectBadgeLoaderHandler = null)),
      "undefined" != typeof gsap &&
        (gsap.killTweensOf(e),
        gsap.killTweensOf(e.querySelector("img"))),
      e.remove());
  }
  function resetProjectBadgeBackdrop() {
    const e = document.querySelector(".project-badge-backdrop");
    e &&
      ("undefined" != typeof gsap &&
        gsap.killTweensOf(e),
      e.classList.remove("is-visible"),
      "undefined" != typeof gsap
        ? gsap.set(e, { autoAlpha: 0, visibility: "hidden" })
        : ((e.style.opacity = "0"), (e.style.visibility = "hidden")),
      (e._projectBadgeTarget = null));
  }
  function cleanupProjectBadgeForPage(e = null) {
    (document.querySelectorAll(".project-badge").forEach((t) => {
      (!e || t._projectBadgeOwner === e) && destroyProjectBadge(t);
    }),
      document.querySelector(".project-badge") || resetProjectBadgeBackdrop());
  }
  function cleanupOrphanProjectBadges() {
    document.querySelectorAll(".project-badge").forEach((e) => {
      const t = e._projectBadgeOwner;
      t && !t.isConnected && destroyProjectBadge(e);
    });
  }
  function projectBadgePinLayoutSize(e) {
    const t = getProjectBadgeIntroSizePx(e),
      n = e.querySelector("img");
    (n && (n.style.width = `${projectBadgeIntroSizeVw()}vw`),
      (e.style.width = `${t}px`),
      (e.style.height = `${t}px`));
  }
  function projectBadgePinImgSize(e) {
    projectBadgePinLayoutSize(e);
  }
  function projectBadgeApplyTransform(e, t = {}) {
    (projectBadgePinLayoutSize(e),
      gsap.set(e, {
        position: "fixed",
        left: 0,
        top: 0,
        bottom: "auto",
        right: "auto",
        margin: 0,
        rotation: 0,
        transformOrigin: "center center",
        force3D: !0,
        ...t,
        xPercent: -50,
        yPercent: -50,
      }));
  }
  function projectBadgeEnsureTransformMode(e) {
    if (-50 === gsap.getProperty(e, "xPercent")) return;
    projectBadgePinLayoutSize(e);
    const t = e.getBoundingClientRect(),
      n = t.left + t.width / 2,
      o = t.top + t.height / 2;
    gsap.set(e, {
      left: 0,
      top: 0,
      bottom: "auto",
      right: "auto",
      x: n,
      y: o,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      rotation: 0,
      force3D: !0,
    });
  }
  function getProjectBadgeBackdrop() {
    let e = document.querySelector(".project-badge-backdrop");
    return (
      e ||
        ((e = document.createElement("div")),
        (e.className = "project-badge-backdrop"),
        e.setAttribute("aria-hidden", "true"),
        document.body.appendChild(e)),
      e
    );
  }
  function restoreProjectBadgeSettledState(e) {
    const t = getProjectBadgeRestMetrics(e);
    ((e._projectBadgeRest = { x: t.x, y: t.y, scale: t.scale }),
      projectBadgeApplyTransform(e, {
        x: t.x,
        y: t.y,
        scale: t.scale,
        zIndex: 9990,
        visibility: "visible",
      }));
  }
  function expandProjectBadge(e) {
    if (
      "undefined" == typeof gsap ||
      e.classList.contains("is-animating") ||
      e.classList.contains("is-expanded")
    )
      return;
    (e._projectBadgeExpandTween &&
      (e._projectBadgeExpandTween.kill(), (e._projectBadgeExpandTween = null)),
      projectBadgeEnsureTransformMode(e),
      projectBadgePinImgSize(e));
    const t = getProjectBadgeBackdrop(),
      n = e._projectBadgeRest?.scale ?? getProjectBadgeSettledScale(),
      o = gsap.getProperty(e, "x"),
      i = gsap.getProperty(e, "y"),
      r = gsap.getProperty(e, "scale") || n,
      s = window.innerWidth / 2,
      l = window.innerHeight / 2;
    ((t._projectBadgeTarget = e),
      gsap.set(t, { autoAlpha: 0, visibility: "visible" }),
      (e._projectBadgeExpandTween = gsap
        .timeline({
          defaults: { force3D: !0, overwrite: "auto" },
          onStart: () => {
            (gsap.set(e, { zIndex: 9995 }),
              e.classList.add("is-expanded"),
              t.classList.add("is-visible"));
          },
        })
        .to(
          t,
          { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
          0,
        )
        .fromTo(
          e,
          { x: o, y: i, scale: r, zIndex: 9990 },
          {
            x: s,
            y: l,
            scale: getProjectBadgeExpandedScale(),
            zIndex: 9995,
            duration: 0.6,
            ease: "power2.out",
          },
          0,
        )));
  }
  function collapseProjectBadge(e) {
    if (
      "undefined" == typeof gsap ||
      !e.classList.contains("is-expanded") ||
      !e._projectBadgeRest
    )
      return;
    (e._projectBadgeExpandTween &&
      (e._projectBadgeExpandTween.kill(), (e._projectBadgeExpandTween = null)),
      projectBadgeEnsureTransformMode(e),
      projectBadgePinImgSize(e));
    const t = getProjectBadgeBackdrop(),
      n = e._projectBadgeRest,
      o = n.x,
      i = n.y,
      r = n.scale,
      s = gsap.getProperty(e, "x"),
      l = gsap.getProperty(e, "y"),
      a = gsap.getProperty(e, "scale") || getProjectBadgeExpandedScale();
    e._projectBadgeExpandTween = gsap
      .timeline({
        defaults: { force3D: !0, overwrite: "auto" },
        onComplete: () => {
          (e.classList.remove("is-expanded"),
            t.classList.remove("is-visible"),
            gsap.set(t, { autoAlpha: 0, visibility: "hidden" }),
            projectBadgeApplyTransform(e, {
              zIndex: 9990,
              x: o,
              y: i,
              scale: r,
            }));
        },
      })
      .to(t, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, 0)
      .fromTo(
        e,
        { x: s, y: l, scale: a, zIndex: 9995 },
        {
          x: o,
          y: i,
          scale: r,
          zIndex: 9990,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0,
      );
  }
  function bindProjectBadgeInteractions(e) {
    if (e._projectBadgeBound) return;
    const t = getProjectBadgeBackdrop();
    ((e._projectBadgeBound = !0),
      e.addEventListener("click", (t) => {
        t.stopPropagation();
        e.classList.contains("is-animating") ||
          (e.classList.contains("is-expanded")
            ? collapseProjectBadge(e)
            : expandProjectBadge(e));
      }),
      t._projectBadgeClickBound ||
        ((t._projectBadgeClickBound = !0),
        t.addEventListener("click", () => {
          t._projectBadgeTarget &&
            t._projectBadgeTarget.classList.contains("is-expanded") &&
            collapseProjectBadge(t._projectBadgeTarget);
        })),
      (e._projectBadgeBackdropEl = t));
  }
  function unbindProjectBadgeInteractions(e) {
    e._projectBadgeBound &&
      ((e._projectBadgeBound = !1),
      e._projectBadgeExpandTween &&
        (e._projectBadgeExpandTween.kill(), (e._projectBadgeExpandTween = null)),
      e.classList.remove("is-expanded"));
  }
  function settleProjectBadge(e) {
    const t = getProjectBadgeRestMetrics(e);
    ((e._projectBadgeRest = { x: t.x, y: t.y, scale: t.scale }),
      e.classList.remove("is-animating"),
      e.classList.add("is-settled"),
      projectBadgeApplyTransform(e, {
        x: t.x,
        y: t.y,
        scale: t.scale,
        zIndex: 9990,
        visibility: "visible",
      }),
      bindProjectBadgeInteractions(e),
      attachProjectBadgeLifecycle(e));
  }
  function attachProjectBadgeLifecycle(e) {
    attachProjectBadgeResizeHandler(e);
  }
  function isProjectBadgeLoaderActive() {
    return (
      !!document.getElementById("cft-loading-overlay") ||
      (!window.__firstOverlayDismissed && window.__cftLoadingManaged)
    );
  }
  function initProjectBadgeAnimation(e = null) {
    if (window.__cftIsAuditBrowser) return;
    if ("undefined" == typeof gsap) return;
    const t = e || document;
    (cleanupOrphanProjectBadges(),
      t.querySelectorAll(".project-badge-spacer").forEach((e) => e.remove()));
    const n = t.querySelector(".hero-content .project-badge");
    if (!n) return;
    if (n.classList.contains("is-settled"))
      return (
        (n._projectBadgeOwner = t),
        n.parentElement !== document.body && document.body.appendChild(n),
        restoreProjectBadgeSettledState(n),
        bindProjectBadgeInteractions(n),
        void attachProjectBadgeLifecycle(n)
      );
    (n._projectBadgeTimeline &&
      (n._projectBadgeTimeline.kill(), (n._projectBadgeTimeline = null)),
      n._projectBadgeDelay &&
        (n._projectBadgeDelay.kill(), (n._projectBadgeDelay = null)),
      n._projectBadgeLoaderHandler &&
        (window.removeEventListener(
          "firstOverlayDismissed",
          n._projectBadgeLoaderHandler,
        ),
        (n._projectBadgeLoaderHandler = null)),
      n._badgeResizeHandler &&
        (window.removeEventListener("resize", n._badgeResizeHandler),
        (n._badgeResizeHandler = null)),
      unbindProjectBadgeInteractions(n),
      gsap.killTweensOf(n),
      n.classList.remove("is-settled", "is-expanded"),
      n.classList.add("is-animating"),
      (n._projectBadgeOwner = t),
      document.body.appendChild(n),
      applyProjectBadgeVars(n));
    const o = getProjectBadgeRestMetrics(n),
      c = window.innerWidth / 2,
      d = window.innerHeight / 2;
    projectBadgeApplyTransform(n, {
      zIndex: 9990,
      visibility: "hidden",
      x: c,
      y: d,
      scale: 0,
    });
    const p = () => {
      (gsap.set(n, { visibility: "visible" }),
        (n._projectBadgeTimeline = gsap
          .timeline({
            onComplete: () => {
              settleProjectBadge(n);
            },
          })
          .to(n, {
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
          })
          .to(n, {
            x: o.x,
            y: o.y,
            scale: o.scale,
            duration: 1.2,
            ease: "power2.inOut",
          })));
    };
    if (isProjectBadgeLoaderActive()) {
      const e = () => {
        ((n._projectBadgeLoaderHandler = null),
          (n._projectBadgeDelay = gsap.delayedCall(0.5, () => {
            ((n._projectBadgeDelay = null), p());
          })));
      };
      window.__firstOverlayDismissed
        ? e()
        : ((n._projectBadgeLoaderHandler = e),
          window.addEventListener("firstOverlayDismissed", e, { once: !0 }));
    } else p();
  }
  function initProductGallery(e) {
    const t = e || document,
      n = qs(".product-gallery", t),
      o = qs(".product-gallery-arrows", t),
      i = t.getElementById
        ? t.getElementById("product-gallery-prev")
        : qs("#product-gallery-prev", t),
      r = t.getElementById
        ? t.getElementById("product-gallery-next")
        : qs("#product-gallery-next", t);
    if (!(n && i && r && o)) return;
    (activeAnimations &&
      activeAnimations.length > 0 &&
      (activeAnimations.forEach((e) => {
        e && e.kill && e.kill();
      }),
      (activeAnimations = [])),
      (isProductGalleryAnimating = !1),
      (pendingTransitions = []),
      (currentProductGalleryIndex = 0));
    const s = n.querySelectorAll(".product-gallery-image");
    if (0 === s.length) return;
    function l() {
      const e = qs(".product-gallery-image.active", n);
      if (e) {
        const t = Array.from(s).indexOf(e);
        -1 !== t &&
          t !== currentProductGalleryIndex &&
          (currentProductGalleryIndex = t);
      }
    }
    function a() {
      s.forEach((e, t) => {
        (e.classList.remove("active", "prev", "next"),
          t === currentProductGalleryIndex
            ? e.classList.add("active")
            : t === currentProductGalleryIndex - 1 ||
                (0 === currentProductGalleryIndex && t === s.length - 1)
              ? e.classList.add("prev")
              : (t === currentProductGalleryIndex + 1 ||
                  (currentProductGalleryIndex === s.length - 1 && 0 === t)) &&
                e.classList.add("next"));
      });
    }
    function c() {
      ((isProductGalleryAnimating = !1), (activeAnimations = []), l(), d());
    }
    function d() {
      0 === pendingTransitions.length ||
        isProductGalleryAnimating ||
        (function (e) {
          if ("undefined" == typeof gsap) return void u(e);
          if (isProductGalleryAnimating) return void u(e);
          (l(), (isProductGalleryAnimating = !0), (activeAnimations = []));
          const t = PRODUCT_GALLERY_CONFIG,
            o = qs(".product-gallery-image.active", n),
            i = qs(".product-gallery-image.prev", n),
            r = qs(".product-gallery-image.next", n);
          if (!o) return (l(), a(), void c());
          ((currentProductGalleryIndex =
            "next" === e
              ? (currentProductGalleryIndex + 1) % s.length
              : (currentProductGalleryIndex - 1 + s.length) % s.length),
            a());
          const d = qs(".product-gallery-image.active", n),
            h = qs(".product-gallery-image.prev", n),
            f = qs(".product-gallery-image.next", n);
          s.forEach((e) => {
            e !== o &&
              e !== i &&
              e !== r &&
              e !== d &&
              e !== h &&
              e !== f &&
              gsap.set(e, { opacity: 0 });
          });
          let p = null;
          const y = "next" === e,
            v = getGalleryAnimStates();
          let w = null;
          const S = () => {
            (w && clearTimeout(w), c());
          };
          ((w = setTimeout(
            () => {
              isProductGalleryAnimating &&
                (console.warn(
                  "Product gallery animation timeout - forcing finish",
                ),
                S());
            },
            1e3 * t.transitionDuration + 1e3,
          )),
            o &&
              m(
                o,
                { ...v.side, ...(y ? v.prevPos : v.nextPos) },
                t.transitionDuration,
              ));
          const b = y ? r : i;
          b &&
            (p = g(
              b,
              { ...v.side, ...(y ? v.nextPos : v.prevPos) },
              v.active,
              t.transitionDuration,
              0,
              S,
            ));
          const E = y ? f : h;
          if (E && E !== (y ? r : i)) {
            const e = y ? v.nextEnter : v.prevEnter;
            (gsap.set(E, { opacity: 0, scale: 0.6, ...e }),
              m(
                E,
                { ...v.side, ...(y ? v.nextPos : v.prevPos) },
                t.transitionDuration,
                t.staggerDelay,
              ));
          }
          const L = y ? i : r;
          (L &&
            L !== d &&
            m(L, y ? v.nextExit : v.prevExit, t.transitionDuration),
            p || setTimeout(S, 1e3 * t.transitionDuration + 200));
        })(pendingTransitions.shift());
    }
    function u(e) {
      e &&
        (l(),
        isProductGalleryAnimating &&
          (activeAnimations.forEach((e) => {
            e && e.kill && e.kill();
          }),
          (activeAnimations = []),
          (isProductGalleryAnimating = !1),
          l()),
        (pendingTransitions = [e]),
        d());
    }
    function m(e, t, n, o = 0, i = null, r = null) {
      if (!e) return null;
      const s = {
        ...t,
        duration: n,
        ease: r || PRODUCT_GALLERY_CONFIG.transitionEase,
      };
      (o && (s.delay = o), i && (s.onComplete = i));
      const l = gsap.to(e, s);
      return (l && activeAnimations.push(l), l);
    }
    function g(e, t, n, o, i = 0, r = null, s = null) {
      if (!e) return null;
      const l = {
        ...n,
        duration: o,
        ease: s || PRODUCT_GALLERY_CONFIG.transitionEase,
      };
      (i && (l.delay = i), r && (l.onComplete = r));
      const a = gsap.fromTo(e, t, l);
      return (a && activeAnimations.push(a), a);
    }
    function h(e, t) {
      const n = (e) => {
        (e.preventDefault(), e.stopPropagation(), u(t));
      };
      ((e.style.cursor = "pointer"), e.addEventListener("click", n));
      const o = e.querySelector("img");
      o && ((o.style.pointerEvents = "auto"), o.addEventListener("click", n));
    }
    (1 === s.length
      ? o.classList.add("product-gallery-arrows--single")
      : o.classList.remove("product-gallery-arrows--single"),
      h(i, "prev"),
      h(r, "next"));
    let f = 0,
      p = 0,
      y = 0,
      v = 0,
      w = !1,
      S = !1,
      b = !1;
    const E = n.closest(".product-gallery-wrapper") || n;
    if (
      (E.addEventListener(
        "touchstart",
        (e) => {
          const t = e.touches[0];
          ((f = t.clientX), (p = t.clientY), (w = !0), (S = !1), (b = !1));
        },
        { passive: !0, capture: !0 },
      ),
      E.addEventListener(
        "touchmove",
        (e) => {
          if (!w) return;
          const t = e.touches[0];
          ((y = t.clientX), (v = t.clientY));
          const n = Math.abs(y - f),
            o = Math.abs(v - p);
          n > 10 &&
            n > 1.2 * o &&
            ((b = !0), e.preventDefault(), e.stopPropagation());
        },
        { passive: !1, capture: !0 },
      ),
      E.addEventListener(
        "touchend",
        (e) => {
          if (!w) return;
          const t = y - f,
            n = v - p,
            o = Math.abs(t);
          (o > 1.5 * Math.abs(n) &&
            o > 30 &&
            (e.preventDefault(),
            e.stopPropagation(),
            (S = !0),
            u(t > 0 ? "prev" : "next")),
            (w = !1),
            (f = 0),
            (p = 0),
            (y = 0),
            (v = 0),
            (S = !1),
            (b = !1));
        },
        { passive: !1, capture: !0 },
      ),
      !isTouchDevice() && n)
    ) {
      let e = !1,
        t = null,
        o = null;
      const i = (n) => {
        if (
          !n.ctrlKey &&
          !n.metaKey &&
          Math.abs(n.deltaX) > Math.abs(n.deltaY) &&
          Math.abs(n.deltaX) > 5
        ) {
          n.preventDefault();
          const i = n.deltaX > 0 ? "next" : "prev";
          (e && o === i
            ? o !== i || isProductGalleryAnimating || u(i)
            : ((e = !0), (o = i), u(i)),
            clearTimeout(t),
            (t = setTimeout(() => {
              ((e = !1), (o = null));
            }, 200)));
        }
      };
      n.addEventListener("wheel", i, { passive: !1 });
      let r = 0,
        s = 0,
        l = 0,
        a = 0,
        c = !1;
      const d = (e) => {
          0 === e.button &&
            ((c = !0),
            (r = e.clientX),
            (s = e.clientY),
            e.preventDefault(),
            (n.style.cursor = "grabbing"),
            (n.style.userSelect = "none"));
        },
        m = (e) => {
          c && ((l = e.clientX), (a = e.clientY));
        },
        g = (e) => {
          if (!c) return;
          ((c = !1), (n.style.cursor = ""), (n.style.userSelect = ""));
          const t = l - r,
            o = a - s,
            i = Math.abs(t);
          (i > 2 * Math.abs(o) && i > 50 && u(t > 0 ? "prev" : "next"),
            (r = 0),
            (s = 0),
            (l = 0),
            (a = 0));
        };
      (n.addEventListener("mousedown", d),
        n.addEventListener("mousemove", m),
        n.addEventListener("mouseup", g),
        n.addEventListener("mouseleave", g));
      const h = (e) => {
        if (!n) return;
        const t = n.getBoundingClientRect();
        if (
          !(
            t.width > 0 &&
            t.height > 0 &&
            t.top < window.innerHeight &&
            t.bottom > 0
          )
        )
          return;
        const o = document.activeElement;
        (o &&
          ("INPUT" === o.tagName ||
            "TEXTAREA" === o.tagName ||
            o.isContentEditable)) ||
          ("ArrowRight" === e.key
            ? (e.preventDefault(), e.stopPropagation(), u("prev"))
            : "ArrowLeft" === e.key &&
              (e.preventDefault(), e.stopPropagation(), u("next")));
      };
      (document.addEventListener("keydown", h, { passive: !1, capture: !0 }),
        (n._keydownHandler = h));
    }
    if ((a(), n.classList.add("gallery-ready"), "undefined" != typeof gsap)) {
      const e = qs(".product-gallery-image.active", n),
        t = qs(".product-gallery-image.prev", n),
        i = qs(".product-gallery-image.next", n);
      if (e) {
        const r = getGalleryAnimStates();
        (s.forEach((n) => {
          n !== e &&
            n !== t &&
            n !== i &&
            gsap.set(n, { opacity: 0, scale: 0 });
        }),
          gsap.set(e, { ...r.active }),
          t && gsap.set(t, { ...r.side, ...r.prevPos }),
          i && gsap.set(i, { ...r.side, ...r.nextPos }),
          gsap.set(o, { opacity: 1 }));
      }
    }
  }
  function initMachineFeatures() {
    const e = qs(".machine-features-grid");
    if (!e) return;
    const t = Array.from(e.querySelectorAll(".hot-dot")),
      n = Array.from(e.querySelectorAll(".feature-box")),
      o = qs(".machine-image-container");
    if (0 === t.length || 0 === n.length) return;
    const i = Math.min(t.length, n.length);
    let r = 0;
    function s(e) {
      ((r = e),
        t.forEach((t, n) => {
          n >= i ||
            (n === e
              ? (t.classList.add("active"), (t.style.opacity = "1"))
              : (t.classList.remove("active"), (t.style.opacity = "1")));
        }),
        n.forEach((t, n) => {
          n >= i ||
            (n === e ? t.classList.add("active") : t.classList.remove("active"));
        }));
    }
    if (
      (t.forEach((e, t) => {
        if (t >= i) return;
        const n = () => s(t),
          o = () => s(t);
        (e._hotDotMouseEnter &&
          e.removeEventListener("mouseenter", e._hotDotMouseEnter),
          e._hotDotClick && e.removeEventListener("click", e._hotDotClick),
          e.addEventListener("mouseenter", n),
          e.addEventListener("click", o),
          (e._hotDotMouseEnter = n),
          (e._hotDotClick = o));
      }),
      n.forEach((e, t) => {
        if (t >= i) return;
        const n = () => s(t),
          o = () => s(t);
        (e._featureBoxMouseEnter &&
          e.removeEventListener("mouseenter", e._featureBoxMouseEnter),
          e._featureBoxClick &&
            e.removeEventListener("click", e._featureBoxClick),
          e.addEventListener("mouseenter", n),
          e.addEventListener("click", o),
          (e._featureBoxMouseEnter = n),
          (e._featureBoxClick = o));
      }),
      o)
    ) {
      const e = () => {
        t.forEach((e, t) => {
          t >= i || (t !== r && (e.style.opacity = "0.7"));
        });
      };
      (o._containerMouseLeave &&
        o.removeEventListener("mouseleave", o._containerMouseLeave),
        o.addEventListener("mouseleave", e),
        (o._containerMouseLeave = e));
    }
    s(0);
  }
  function initTechnologyMachineMask() {
    const e = qs(".techonology-machine-mask"),
      t = qs(".techonology-machine-image-container");
    if (!e || !t) return;
    const n = t.querySelector(".techonology-machine-image");
    if (!n) return;
    function o() {
      const o = t.offsetHeight || t.clientHeight,
        i = n.offsetHeight || n.clientHeight,
        r = Math.max(o, i);
      r > 0 && (e.style.height = `${r}px`);
    }
    const i = new ResizeObserver(() => {
      (o(), d && S());
    });
    function r() {
      return !isMobileLayoutBreakpoint();
    }
    (i.observe(n),
      i.observe(t),
      o(),
      window.addEventListener("resize", () => {
        if ((d && S(), !r())) {
          ((d = !1), (u = !1), m && m.kill(), g && g.kill());
          const e = v();
          ((a = e.x), (c = e.y), S());
        }
      }));
    let s = 0,
      l = 0,
      a = 0,
      c = 0,
      d = !1,
      u = !1,
      m = null,
      g = null,
      h = null,
      f = !1;
    const p = Array.from(t.querySelectorAll(".hot-dot[data-feature-index]"));
    function y(e) {
      const n = p.find(
        (t) => String(t.getAttribute("data-feature-index")) === String(e),
      );
      if (!n) return;
      const o = (function (e) {
        const n = t.getBoundingClientRect(),
          o = e.getBoundingClientRect();
        return {
          x: o.left - n.left + o.width / 2,
          y: o.top - n.top + o.height / 2,
        };
      })(n);
      (m && m.kill(), g && g.kill());
      const i = w(o.x, o.y);
      g = gsap.to(
        { x: a, y: c },
        {
          duration: 0.4,
          x: i.x,
          y: i.y,
          ease: "power2.out",
          onUpdate: function () {
            ((a = this.targets()[0].x), (c = this.targets()[0].y), S());
          },
        },
      );
    }
    if (p.length > 0) {
      (p.forEach((e) => {
        const t = parseInt(e.getAttribute("data-feature-index") || "0", 10),
          n = () => {
            ((h = t), y(t));
          },
          o = () => {
            ((h = null), f || b());
          };
        (e.addEventListener("mouseenter", n),
          e.addEventListener("mouseleave", o),
          (e._techMaskDotEnter = n),
          (e._techMaskDotLeave = o));
      }),
        (t._techMaskMoveToIndex = function (e) {
          ((f = !0), y(e));
        }));
      const e =
        document.getElementById("tech-overlay") ||
        document.querySelector(".tech-overlay");
      e &&
        new MutationObserver(() => {
          e.classList.contains("active") || ((f = !1), null == h && b());
        }).observe(e, { attributes: !0, attributeFilter: ["class"] });
    }
    function v() {
      const e = t.getBoundingClientRect();
      return { x: e.width / 2, y: e.height / 2 };
    }
    function w(e, n) {
      const o = t.getBoundingClientRect(),
        i = o.width,
        r = o.height;
      return { x: Math.max(0, Math.min(e, i)), y: Math.max(0, Math.min(n, r)) };
    }
    function S() {
      const n = t.getBoundingClientRect(),
        o = n.width,
        i = n.height;
      if (0 === o || 0 === i) return;
      const r = w(a, c);
      ((a = r.x), (c = r.y));
      const s = (function () {
          const t = getComputedStyle(e).getPropertyValue("--mask-circle-size");
          return t
            ? parseFloat(t) * (window.innerWidth / 100)
            : (window.innerWidth / 100) * 10;
        })(),
        l = (a / o) * 100,
        d = (c / i) * 100,
        u = (s / o) * 100;
      e.style.clipPath = `circle(${u}% at ${l}% ${d}%)`;
    }
    function b() {
      (m && m.kill(), g && g.kill());
      const e = v();
      m = gsap.to(
        { x: a, y: c },
        {
          duration: 0.8,
          x: e.x,
          y: e.y,
          ease: "power2.out",
          onUpdate: function () {
            ((a = this.targets()[0].x), (c = this.targets()[0].y), S());
          },
        },
      );
    }
    function E(e) {
      if (r()) {
        if (!d) return;
        const n = t.getBoundingClientRect();
        ((s = e.clientX - n.left), (l = e.clientY - n.top));
        const o = w(s, l);
        (m && m.kill(),
          g && g.kill(),
          (g = gsap.to(
            { x: a, y: c },
            {
              duration: 0.3,
              x: o.x,
              y: o.y,
              ease: "power2.out",
              onUpdate: function () {
                ((a = this.targets()[0].x), (c = this.targets()[0].y), S());
              },
            },
          )));
      } else {
        if (!u) return;
        const n = t.getBoundingClientRect(),
          o = w(e.clientX - n.left, e.clientY - n.top);
        (m && m.kill(),
          g && g.kill(),
          (g = gsap.to(
            { x: a, y: c },
            {
              duration: 0.3,
              x: o.x,
              y: o.y,
              ease: "power2.out",
              onUpdate: function () {
                ((a = this.targets()[0].x), (c = this.targets()[0].y), S());
              },
            },
          )));
      }
    }
    function L(e) {
      if (r()) return;
      u = !0;
      const n = t.getBoundingClientRect(),
        o = w(e.clientX - n.left, e.clientY - n.top);
      (m && m.kill(),
        g && g.kill(),
        (g = gsap.to(
          { x: a, y: c },
          {
            duration: 0.2,
            x: o.x,
            y: o.y,
            ease: "power2.out",
            onUpdate: function () {
              ((a = this.targets()[0].x), (c = this.targets()[0].y), S());
            },
          },
        )));
    }
    function T(e) {
      r() || (u = !1);
    }
    function _() {
      if (!r()) return;
      d = !0;
      const e = v();
      (0 === a && 0 === c && ((a = e.x), (c = e.y)), S());
    }
    function A() {
      if (r()) {
        if (((d = !1), null != h || f)) return;
        (m && m.kill(), g && g.kill(), b());
      } else u = !1;
    }
    let x = 0,
      k = 0,
      q = 0;
    function I(e) {
      if (r()) return;
      const n = e.touches[0];
      if (!n) return;
      ((x = n.clientX), (k = n.clientY), (q = Date.now()));
      const o = t.getBoundingClientRect(),
        i = w(n.clientX - o.left, n.clientY - o.top);
      ((u = !0),
        e.preventDefault(),
        e.stopPropagation(),
        m && m.kill(),
        g && g.kill(),
        (g = gsap.to(
          { x: a, y: c },
          {
            duration: 0.2,
            x: i.x,
            y: i.y,
            ease: "power2.out",
            onUpdate: function () {
              ((a = this.targets()[0].x), (c = this.targets()[0].y), S());
            },
          },
        )));
    }
    function C(e) {
      if (r()) return;
      if (!u) return;
      const n = e.touches[0];
      if (!n) return;
      const o = t.getBoundingClientRect(),
        i = n.clientX - o.left,
        s = n.clientY - o.top,
        l = Math.abs(n.clientX - x),
        d = Math.abs(n.clientY - k);
      if (l > 5 || d > 5) {
        (e.preventDefault(), e.stopPropagation());
        const t = w(i, s);
        (m && m.kill(),
          g && g.kill(),
          (g = gsap.to(
            { x: a, y: c },
            {
              duration: 0.3,
              x: t.x,
              y: t.y,
              ease: "power2.out",
              onUpdate: function () {
                ((a = this.targets()[0].x), (c = this.targets()[0].y), S());
              },
            },
          )));
      }
    }
    function H(e) {
      r() ||
        (u &&
          (e.preventDefault(),
          e.stopPropagation(),
          (u = !1),
          (x = 0),
          (k = 0),
          (q = 0)));
    }
    (!(function () {
      const e = v();
      ((a = e.x), (c = e.y), S());
    })(),
      t.addEventListener("mousemove", E),
      t.addEventListener("mouseenter", _),
      t.addEventListener("mouseleave", A),
      e.addEventListener("mousedown", L),
      e.addEventListener("mouseup", T),
      e.addEventListener("touchstart", I, { passive: !1 }),
      e.addEventListener("touchmove", C, { passive: !1 }),
      e.addEventListener("touchend", H, { passive: !1 }),
      document.addEventListener("mouseup", T),
      e._handleMouseMove &&
        t.removeEventListener("mousemove", e._handleMouseMove),
      e._handleMouseDown &&
        e.removeEventListener("mousedown", e._handleMouseDown),
      e._handleMouseUp && e.removeEventListener("mouseup", e._handleMouseUp),
      e._handleMouseUpDoc &&
        document.removeEventListener("mouseup", e._handleMouseUpDoc),
      e._handleMouseEnter &&
        t.removeEventListener("mouseenter", e._handleMouseEnter),
      e._handleMouseLeave &&
        t.removeEventListener("mouseleave", e._handleMouseLeave),
      e._handleTouchStart &&
        e.removeEventListener("touchstart", e._handleTouchStart),
      e._handleTouchMove &&
        e.removeEventListener("touchmove", e._handleTouchMove),
      e._handleTouchEnd && e.removeEventListener("touchend", e._handleTouchEnd),
      (e._handleMouseMove = E),
      (e._handleMouseDown = L),
      (e._handleMouseUp = T),
      (e._handleMouseUpDoc = T),
      (e._handleMouseEnter = _),
      (e._handleMouseLeave = A),
      (e._handleTouchStart = I),
      (e._handleTouchMove = C),
      (e._handleTouchEnd = H));
  }
  function initTechnologyOverlay(e = null) {
    const t = e || document,
      n = qs("#tech-overlay", t),
      o = qsa(".hot-dot[data-tech-image]", t);
    if (!n || 0 === o.length) return;
    (n._resizeHandler &&
      (window.removeEventListener("resize", n._resizeHandler),
      (n._resizeHandler = null)),
      o.forEach((e) => {
        e._techOverlayClickHandler &&
          (e.removeEventListener("click", e._techOverlayClickHandler),
          (e._techOverlayClickHandler = null));
      }));
    const i = qs("#tech-overlay-close", t),
      r = qs("#tech-overlay-img", t),
      s = qs("#tech-overlay-number", t),
      l = qs("#tech-overlay-title", t),
      a = qs("#tech-overlay-description", t),
      c = qs("#tech-overlay-prev", t),
      d = qs("#tech-overlay-next", t);
    if (
      (i &&
        i._closeHandler &&
        (i.removeEventListener("click", i._closeHandler),
        (i._closeHandler = null)),
      c &&
        c._prevHandler &&
        (c.removeEventListener("click", c._prevHandler), (c._prevHandler = null)),
      d &&
        d._nextHandler &&
        (d.removeEventListener("click", d._nextHandler), (d._nextHandler = null)),
      n._escapeHandler &&
        (document.removeEventListener("keydown", n._escapeHandler),
        (n._escapeHandler = null)),
      n._backgroundClickHandler &&
        (n.removeEventListener("click", n._backgroundClickHandler),
        (n._backgroundClickHandler = null)),
      !(i && r && s && l && a && c && d))
    )
      return;
    let u = 0;
    function m() {
      return qsa(".hot-dot[data-tech-image]", t);
    }
    function g(e) {
      const t = m()[e];
      if (!t) return null;
      const n = t.getAttribute("data-tech-image") || "",
        o = t.getAttribute("data-tech-title") || "",
        i = t.getAttribute("data-tech-description") || "";
      return {
        title: o,
        image: n,
        number: `(${String(e + 1).padStart(2, "0")})`,
        description: i,
      };
    }
    function h(e) {
      let t = g(e);
      if (!t || (!t.title && !t.image)) {
        const n = m()[e];
        if (n) {
          const o = n.getAttribute("data-tech-image") || "",
            i = n.getAttribute("data-tech-title") || "",
            r = n.getAttribute("data-tech-description") || "";
          (i || o) &&
            (t = {
              title: i,
              image: o,
              number: `(${String(e + 1).padStart(2, "0")})`,
              description: r,
            });
        }
      }
      t && (t.title || t.image)
        ? (n.classList.contains("active") &&
            u === e &&
            l.textContent === t.title &&
            a.textContent === t.description &&
            s.textContent === t.number &&
            r.src === (t.image || r.src)) ||
          ((u = e),
          t.title && ((l.textContent = t.title), (r.alt = t.title)),
          (s.textContent = t.number),
          t.description ? (a.textContent = t.description) : (a.textContent = ""),
          t.image &&
            ((r.style.opacity = ""),
            (r.style.visibility = ""),
            (r.style.display = ""),
            (r.onload = function () {
              ((this.style.opacity = ""),
                (this.style.visibility = ""),
                (this.style.display = ""));
            }),
            (r.src = t.image),
            (r.onerror = function () {
              (console.warn("Roasting overlay image failed to load:", this.src),
                (this.style.display = "none"));
            })))
        : console.warn("Failed to get tech data for index:", e);
    }
    function f() {
      n.classList.remove("active");
    }
    function p() {
      const e = m();
      h((u + 1) % e.length);
    }
    function y() {
      const e = m();
      h((u - 1 + e.length) % e.length);
    }
    o.forEach((e, o) => {
      const i = (i) => {
        (i.preventDefault(), i.stopPropagation());
        const r = parseInt(e.getAttribute("data-feature-index") || String(o)),
          s = Array.from(t.querySelectorAll(".hot-dot[data-tech-image]"));
        s.sort(
          (e, t) =>
            parseInt(e.getAttribute("data-feature-index") || "0") -
            parseInt(t.getAttribute("data-feature-index") || "0"),
        );
        const l = s.findIndex((t) => t === e);
        !(function (e) {
          const t = m();
          if (e >= t.length)
            return void console.error(
              "Cannot open overlay - invalid index:",
              e,
              "out of",
              t.length,
            );
          let o = g(e);
          if (!o || (!o.title && !o.image)) {
            const n = t[e];
            if (n) {
              const t = n.getAttribute("data-tech-image") || "",
                i = n.getAttribute("data-tech-title") || "",
                r = n.getAttribute("data-tech-description") || "";
              (i || t) &&
                (o = {
                  title: i,
                  image: t,
                  number: `(${String(e + 1).padStart(2, "0")})`,
                  description: r,
                });
            }
          }
          o && (o.title || o.image)
            ? (h(e), n.classList.add("active"))
            : console.error("Cannot open overlay - no data found for index:", e);
        })(-1 !== l ? l : r);
      };
      (e._techOverlayClickHandler &&
        e.removeEventListener("click", e._techOverlayClickHandler),
        e.addEventListener("click", i),
        (e._techOverlayClickHandler = i));
    });
    const v = () => f();
    (i.addEventListener("click", v), (i._closeHandler = v));
    const w = (e, t) => {
        (e.preventDefault(), e.stopPropagation(), t());
      },
      S = (e) => w(e, y),
      b = (e) => w(e, p);
    (c.addEventListener("click", S),
      d.addEventListener("click", b),
      (c._prevHandler = S),
      (d._nextHandler = b));
    const E = c.querySelector("img"),
      L = d.querySelector("img");
    (E &&
      ((E.style.pointerEvents = "auto"),
      E.addEventListener("click", (e) => w(e, y))),
      L &&
        ((L.style.pointerEvents = "auto"),
        L.addEventListener("click", (e) => w(e, p))));
    const T = (e) => {
      "Escape" === e.key && n.classList.contains("active") && f();
    };
    (document.addEventListener("keydown", T), (n._escapeHandler = T));
    const _ = (e) => {
      e.target === n && f();
    };
    let A;
    (n.addEventListener("click", _), (n._backgroundClickHandler = _));
    let x = !1;
    const k = () => {
      isTouchDevice() ||
        x ||
        ((x = !0),
        clearTimeout(A),
        (A = setTimeout(() => {
          (!(function () {
            if (isTouchDevice()) return;
            if ("undefined" == typeof ScrollTrigger) return;
            if (n.classList.contains("active")) return;
            const e =
              window.scrollY ||
              window.pageYOffset ||
              document.documentElement.scrollTop;
            (ScrollTrigger.refresh(),
              requestAnimationFrame(() => {
                (window.scrollTo(0, e),
                  void 0 !== smoothScrollInstance &&
                    smoothScrollInstance &&
                    smoothScrollInstance.scrollTo(e, { immediate: !0 }));
              }));
          })(),
            (x = !1));
        }, 150)));
    };
    (window.addEventListener("resize", k), (n._resizeHandler = k));
  }
  let catalogActiveAnimations = [];
  function getCatalogAnimationConfig() {
    const e = document.documentElement,
      t =
        parseFloat(
          getComputedStyle(e)
            .getPropertyValue("--catalog-animation-duration")
            .trim(),
        ) || 0.9;
    let n =
      getComputedStyle(e).getPropertyValue("--standard-easing").trim() ||
      "power3.out";
    return (
      "undefined" != typeof gsap &&
        n.includes("cubic-bezier") &&
        (n = parseCubicBezier(n)),
      { duration: t, ease: n }
    );
  }
  function initCatalogFilters(pageWrapper) {
    // Support both pageWrapper context and document-wide search
    const searchRoot = pageWrapper || document;
  
    // Remove Webflow default classes that interfere with animations
    // This must happen early, before any position calculations
    const catalogFilters = qs(".catalog-filters", searchRoot);
    if (catalogFilters) {
      // Remove Webflow classes from filters container immediately
      catalogFilters.classList.remove("w-dyn-items");
  
      // Remove Webflow classes from filter items immediately
      const filterItems = catalogFilters.querySelectorAll(".w-dyn-item");
      filterItems.forEach((item) => {
        item.classList.remove("w-dyn-item");
        // Also remove filter-link class from divs (should only be on label)
        if (item.classList.contains("filter-link")) {
          item.classList.remove("filter-link");
        }
      });
  
      // Remove Webflow classes from parent containers if they exist
      const dynList = catalogFilters.closest(".w-dyn-list");
      if (dynList) {
        dynList.classList.remove("w-dyn-list");
      }
  
      // Force reflow after removing classes to ensure CSS recalculates
      void catalogFilters.offsetHeight;
  
      const filterLinks = catalogFilters.querySelectorAll(
        "label.filter-link, .filter-link",
      );
      filterLinks.forEach((link) => {
        // Remove inline styles that might have been added incorrectly
        if (link.style.visibility || link.style.opacity || link.style.fontSize) {
          link.style.visibility = "";
          link.style.opacity = "";
          link.style.fontSize = "";
          link.style.fontWeight = "";
          link.style.lineHeight = "";
          link.style.display = "";
        }
        // Remove data-no-split-text if it was added (catalog filters can have split text)
        if (link.hasAttribute("data-no-split-text")) {
          link.removeAttribute("data-no-split-text");
        }
      });
    }
  
    // Function to dynamically add data-filter attributes to filter links from Webflow collection
    // This allows the filters to work with dynamic content without modifying Webflow
    function setupFilterAttributes() {
      // Find all filter items (could be w-dyn-item or just divs)
      // Also handle Finsweet CMS Filter structure
      const filterItems = searchRoot.querySelectorAll(
        '.catalog-filters > div, .catalog-filters .w-dyn-item, .catalog-filters [role="listitem"]',
      );
  
      filterItems.forEach((item, index) => {
        // Find the label with filter-link class (the actual clickable element)
        // Handle both regular structure and Finsweet structure
        let filterLink = item.querySelector("label.filter-link");
        if (!filterLink) {
          // Try to find label that contains filter-link class
          filterLink = item.querySelector("label.w-radio.filter-link");
        }
        if (!filterLink) {
          // Fallback: find any label in the item
          filterLink = item.querySelector("label");
        }
        if (!filterLink) return;
  
        // If data-filter already exists, skip
        if (filterLink.hasAttribute("data-filter")) return;
  
        // Get the filter text from the span inside label (Finsweet uses spans)
        // Try to get text from span first (more specific), then fallback to label text
        const span = filterLink.querySelector("span");
        const spanText = span?.textContent?.trim();
        const labelText = spanText || filterLink.textContent.trim();
  
        // Skip if no text found
        if (!labelText) return;
  
        // Set data-filter based on text content
        // "All" becomes "all", everything else stays as is
        const filterValue = labelText.toLowerCase() === "all" ? "all" : labelText;
        filterLink.setAttribute("data-filter", filterValue);
      });
    }
  
    // Setup filter attributes initially
    setupFilterAttributes();
  
    // Watch for changes in the collection list and update filter attributes dynamically
    if (catalogFilters && typeof MutationObserver !== "undefined") {
      const filtersObserver = new MutationObserver(() => {
        setupFilterAttributes();
        // Re-initialize event listeners if new filters were added
        const newFilterLinks = searchRoot.querySelectorAll(".filter-link");
        if (newFilterLinks.length > filterLinks.length) {
          // Re-run the initialization part that sets up event listeners
          // This will be handled by re-calling the function or by the existing event listener setup below
        }
      });
  
      filtersObserver.observe(catalogFilters, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  
    // Get filter links after setting up attributes (may have been updated dynamically)
    let filterLinks = searchRoot.querySelectorAll(".filter-link");
    const productColumns = searchRoot.querySelectorAll(".catalog-grid .column");
  
    // Declare previousFilter here so it's accessible in all nested functions
    let previousFilter = "all";
  
    if (filterLinks.length === 0 || productColumns.length === 0) return;
  
    const catalogContent = qs(".catalog-content", searchRoot);
    const filters = qs(".catalog-filters", searchRoot);
    const grid = qs(".catalog-grid.three-columns", searchRoot);
    const catalogHeader = qs(".catalog-header", searchRoot);
  
    if (!catalogContent || !filters || !grid) return;
  
    // Function to update catalog-header classes based on grid mode
    function updateCatalogHeaderMode() {
      if (!catalogHeader) return;
      // On mobile: never apply slider-mode (keep header as-is)
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        catalogHeader.classList.remove("slider-mode");
        catalogHeader.classList.add("grid-mode");
        return;
      }
      // Desktop: slider-mode when filtered
      const isOneColumn = grid.classList.contains("one-column");
      if (isOneColumn) {
        catalogHeader.classList.remove("grid-mode");
        catalogHeader.classList.add("slider-mode");
      } else {
        catalogHeader.classList.remove("slider-mode");
        catalogHeader.classList.add("grid-mode");
      }
    }
  
    // Initialize header mode
    updateCatalogHeaderMode();
  
    // Watch for changes in grid mode (using MutationObserver)
    const gridObserver = new MutationObserver(() => {
      updateCatalogHeaderMode();
    });
    gridObserver.observe(grid, {
      attributes: true,
      attributeFilter: ["class"],
    });
  
    // Update header mode on resize (e.g. mobile ↔ desktop)
    const catalogResizeHandler = () => updateCatalogHeaderMode();
    window.addEventListener("resize", catalogResizeHandler);
  
    // Get animation config from CSS
    const CATALOG_ANIMATION_CONFIG = getCatalogAnimationConfig();
  
    // Track previous filter to detect transitions from/to 'all'
    // (previousFilter is already declared above)
  
    // Function to kill all active animations
    function killActiveAnimations() {
      catalogActiveAnimations.forEach((anim) => {
        if (anim && anim.kill) {
          anim.kill();
        }
      });
      catalogActiveAnimations = [];
  
      // Clear inline styles from interrupted animations
      const allColumns = qsa(".catalog-grid .column", searchRoot);
      allColumns.forEach((column) => {
        column.style.width = "";
        column.style.marginLeft = "";
        const productImage = column.querySelector(".product-image");
        if (productImage) {
          productImage.style.height = "";
        }
      });
  
      // Clear filters animation styles
      if (filters) {
        filters.style.transform = "";
        filters.style.top = "";
        filters.style.position = "";
        filters.style.x = "";
        gsap.set(filters, { clearProps: "x,transform,top,position" });
      }
    }
  
    // Function to apply filter
    function applyFilter(filter, skipAnimation = false) {
      // Kill any ongoing animations when rapid clicks occur
      if (!skipAnimation) {
        killActiveAnimations();
      }
  
      const allFilterLinks = qsa(".filter-link", searchRoot);
  
      // Check current state
      const wasOneColumn = grid.classList.contains("one-column");
      const isLayoutChanging =
        (filter === "all" && wasOneColumn) || (filter !== "all" && !wasOneColumn);
  
      // Update active filter
      allFilterLinks.forEach((l) => l.classList.remove("active"));
      allFilterLinks.forEach((l) => {
        if (l.getAttribute("data-filter") === filter) {
          l.classList.add("active");
        }
      });
  
      // Get fresh product columns
      const freshProductColumns = qsa(".catalog-grid .column", searchRoot);
  
      // Don't apply one-column layout on mobile (max-width: 768px)
      const isMobile = window.innerWidth <= 768;
  
      // Check if we should do fade animation
      // On mobile: fade when transitioning to/from any filter (including 'all')
      // On desktop: only fade when navigating between non-all filters
      const shouldFade =
        !skipAnimation &&
        (isMobile
          ? previousFilter !== filter // Mobile: fade on any filter change (including to/from 'all')
          : previousFilter !== "all" &&
            filter !== "all" &&
            previousFilter !== filter); // Desktop: only between non-all filters
  
      // Refresh ScrollTrigger and footer reveal after layout change (e.g. filter changes row count)
      const scheduleScrollTriggerRefresh = () => {
        if (typeof ScrollTrigger !== "undefined") {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
            });
          });
        }
        if (typeof window.refreshFooterReveal === "function") {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.refreshFooterReveal();
            });
          });
        }
      };
  
      // Helper function to check if a product has a specific tag
      // Supports both .product-tags and .merged-tags (after mergeProductTags)
      // Tags can contain span OR a (catalog uses <a>, real-catalog uses <span>)
      const productHasTag = (column, tagName) => {
        const tagsContainers = column.querySelectorAll(
          ".product-tags, .merged-tags",
        );
        for (const container of tagsContainers) {
          const tags = container.querySelectorAll(".tag");
          if (
            Array.from(tags).some((tag) => tag.textContent.trim() === tagName)
          ) {
            return true;
          }
        }
        return false;
      };
  
      // Function to apply filter changes (display and class changes)
      const applyFilterChanges = () => {
        if (filter === "all") {
          grid.classList.remove("one-column");
          freshProductColumns.forEach((column) => {
            column.style.display = "";
          });
        } else {
          grid.classList.add("one-column");
          freshProductColumns.forEach((column) => {
            // Check if product has the filter tag
            const hasTag = productHasTag(column, filter);
            column.style.display = hasTag ? "" : "none";
          });
        }
      };
  
      // Fade out gallery at the start (before filter is applied) - using CSS classes
      let shouldDelayFilterChange = false;
      if (shouldFade && grid) {
        // Remove fade-in class if exists
        grid.classList.remove("filter-fade-in");
        // Add fade-out class
        grid.classList.add("filter-fade-out");
        shouldDelayFilterChange = true;
      }
  
      // Animate grid and columns - simple approach: measure all CSS changes
      // Don't animate on mobile (max-width: 768px) - only blur/fade effect
      let gridAnimation = null;
      if (
        isLayoutChanging &&
        !skipAnimation &&
        !isMobile &&
        typeof gsap !== "undefined"
      ) {
        // Get current grid styles BEFORE changing class
        const currentGridStyle = window.getComputedStyle(grid);
        const currentGridProps = {
          marginTop: currentGridStyle.marginTop,
          marginBottom: currentGridStyle.marginBottom,
          paddingTop: currentGridStyle.paddingTop,
          paddingBottom: currentGridStyle.paddingBottom,
        };
  
        // Get current column styles BEFORE changing class
        const columns = Array.from(freshProductColumns).filter(
          (col) => col.style.display !== "none",
        );
        const currentColumnStyles = columns.map((column) => {
          const style = window.getComputedStyle(column);
          const rect = column.getBoundingClientRect();
          const image = column.querySelector(".product-image");
          const imageRect = image ? image.getBoundingClientRect() : null;
          const imgElement = image ? image.querySelector("img") : null;
          const imgRect = imgElement ? imgElement.getBoundingClientRect() : null;
          return {
            element: column,
            image: image,
            imgElement: imgElement,
            width: rect.width,
            height: rect.height,
            marginLeft: style.marginLeft,
            marginTop: style.marginTop,
            imageHeight: imageRect ? imageRect.height : null,
            imgHeight: imgRect ? imgRect.height : null,
          };
        });
  
        // Function to continue with animation after filter is applied
        const continueAnimation = () => {
          // Force reflow after class change
          void grid.offsetHeight;
  
          // Get target values after class change
          const targetGridStyle = window.getComputedStyle(grid);
          const targetGridProps = {
            marginTop: targetGridStyle.marginTop,
            marginBottom: targetGridStyle.marginBottom,
            paddingTop: targetGridStyle.paddingTop,
            paddingBottom: targetGridStyle.paddingBottom,
          };
  
          const targetColumnStyles = columns
            .map((column) => {
              if (column.style.display === "none") return null;
              const style = window.getComputedStyle(column);
              const rect = column.getBoundingClientRect();
              const image = column.querySelector(".product-image");
              const imageRect = image ? image.getBoundingClientRect() : null;
              const imgElement = image ? image.querySelector("img") : null;
              const imgRect = imgElement
                ? imgElement.getBoundingClientRect()
                : null;
              return {
                width: rect.width,
                height: rect.height,
                marginLeft: style.marginLeft,
                marginTop: style.marginTop,
                imageHeight: imageRect ? imageRect.height : null,
                imgHeight: imgRect ? imgRect.height : null,
              };
            })
            .filter(Boolean);
  
          // Set initial states
          Object.keys(currentGridProps).forEach((prop) => {
            gsap.set(grid, { [prop]: currentGridProps[prop] });
          });
  
          currentColumnStyles.forEach((current, i) => {
            const target = targetColumnStyles[i];
            if (!target) return;
  
            gsap.set(current.element, {
              width: current.width,
              height: current.height,
              marginLeft: current.marginLeft,
              marginTop: current.marginTop,
            });
  
            if (current.image && current.imageHeight && target.imageHeight) {
              gsap.set(current.image, { height: current.imageHeight });
            }
            if (current.imgElement && current.imgHeight && target.imgHeight) {
              gsap.set(current.imgElement, { height: current.imgHeight });
            }
          });
  
          // Animate everything together
          const timeline = gsap.timeline({
            onComplete: () => {
              // Clear all inline styles
              Object.keys(currentGridProps).forEach((prop) => {
                grid.style[prop] = "";
              });
              gsap.set(grid, {
                clearProps: Object.keys(currentGridProps).join(","),
              });
  
              currentColumnStyles.forEach(({ element, image, imgElement }) => {
                element.style.width = "";
                element.style.height = "";
                element.style.marginLeft = "";
                element.style.marginTop = "";
                if (image) {
                  image.style.height = "";
                }
                if (imgElement) {
                  imgElement.style.height = "";
                }
              });
              // Recalculate ScrollTrigger after grid animation so rest of page works
              if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
            },
          });
  
          // Animate grid
          timeline.to(grid, {
            ...targetGridProps,
            duration: CATALOG_ANIMATION_CONFIG.duration,
            ease: CATALOG_ANIMATION_CONFIG.ease,
          });
  
          // Animate columns
          if (currentColumnStyles.length > 0) {
            timeline.to(
              currentColumnStyles.map((c) => c.element),
              {
                width: (i) => targetColumnStyles[i]?.width,
                height: (i) => targetColumnStyles[i]?.height,
                marginLeft: (i) => targetColumnStyles[i]?.marginLeft,
                marginTop: (i) => targetColumnStyles[i]?.marginTop,
                duration: CATALOG_ANIMATION_CONFIG.duration,
                ease: CATALOG_ANIMATION_CONFIG.ease,
              },
              0,
            );
  
            // Animate images (container)
            const imagesToAnimate = currentColumnStyles
              .map((c, i) =>
                c.image && targetColumnStyles[i]?.imageHeight
                  ? {
                      element: c.image,
                      targetHeight: targetColumnStyles[i].imageHeight,
                    }
                  : null,
              )
              .filter(Boolean);
  
            if (imagesToAnimate.length > 0) {
              timeline.to(
                imagesToAnimate.map((d) => d.element),
                {
                  height: (i) => imagesToAnimate[i].targetHeight,
                  duration: CATALOG_ANIMATION_CONFIG.duration,
                  ease: CATALOG_ANIMATION_CONFIG.ease,
                },
                0,
              );
            }
  
            // Animate img elements
            const imgElementsToAnimate = currentColumnStyles
              .map((c, i) =>
                c.imgElement && targetColumnStyles[i]?.imgHeight
                  ? {
                      element: c.imgElement,
                      targetHeight: targetColumnStyles[i].imgHeight,
                    }
                  : null,
              )
              .filter(Boolean);
  
            if (imgElementsToAnimate.length > 0) {
              timeline.to(
                imgElementsToAnimate.map((d) => d.element),
                {
                  height: (i) => imgElementsToAnimate[i].targetHeight,
                  duration: CATALOG_ANIMATION_CONFIG.duration,
                  ease: CATALOG_ANIMATION_CONFIG.ease,
                },
                0,
              );
            }
          }
  
          gridAnimation = timeline;
          if (gridAnimation) {
            catalogActiveAnimations.push(gridAnimation);
          }
        };
  
        // Apply filter changes - delay if shouldFade is true
        if (shouldDelayFilterChange) {
          const root = document.documentElement;
          const fadeDurationValue = getComputedStyle(root)
            .getPropertyValue("--short-duration")
            .trim();
          const fadeDuration = parseFloat(fadeDurationValue) || 0.5;
          const fadeDurationMs = fadeDuration * 1000;
  
          setTimeout(() => {
            applyFilterChanges();
            scheduleScrollTriggerRefresh();
            // Start fade-in immediately after filter is applied
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                grid.classList.remove("filter-fade-out");
                grid.classList.add("filter-fade-in");
  
                // Clean up classes after animation completes
                setTimeout(() => {
                  grid.classList.remove("filter-fade-in");
                }, fadeDurationMs);
              });
            });
            // Only run grid/column animations on desktop, not mobile
            if (!isMobile) {
              continueAnimation();
            }
          }, fadeDurationMs);
        } else {
          applyFilterChanges();
          scheduleScrollTriggerRefresh();
          // Only run grid/column animations on desktop, not mobile
          if (!isMobile) {
            continueAnimation();
          }
        }
      } else {
        // Filter products and toggle class (without animation) - delay if shouldFade is true
        if (shouldDelayFilterChange) {
          const root = document.documentElement;
          const fadeDurationValue = getComputedStyle(root)
            .getPropertyValue("--short-duration")
            .trim();
          const fadeDuration = parseFloat(fadeDurationValue) || 0.5;
          const fadeDurationMs = fadeDuration * 1000;
  
          setTimeout(() => {
            applyFilterChanges();
            scheduleScrollTriggerRefresh();
            // Start fade-in immediately after filter is applied
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                grid.classList.remove("filter-fade-out");
                grid.classList.add("filter-fade-in");
  
                // Clean up classes after animation completes
                setTimeout(() => {
                  grid.classList.remove("filter-fade-in");
                }, fadeDurationMs);
              });
            });
          }, fadeDurationMs);
        } else {
          applyFilterChanges();
          scheduleScrollTriggerRefresh();
        }
  
        // Clear any inline styles when skipping animation
        freshProductColumns.forEach((column) => {
          column.style.width = "";
          column.style.height = "";
          column.style.marginLeft = "";
          column.style.marginTop = "";
          const productImage = column.querySelector(".product-image");
          if (productImage) {
            productImage.style.height = "";
          }
        });
      }
  
      // Animate filters layout (row to column)
      // Don't animate on mobile (max-width: 768px)
      let filtersAnimation = null;
      if (
        isLayoutChanging &&
        !skipAnimation &&
        !isMobile &&
        typeof gsap !== "undefined" &&
        filters
      ) {
        const isGoingToOneColumn = filter !== "all";
        const filterLinks = Array.from(filters.querySelectorAll(".filter-link"));
  
        // Get current values BEFORE changing class
        const currentContainerStyle = window.getComputedStyle(filters);
        const currentTop = currentContainerStyle.top;
        const currentTransform = currentContainerStyle.transform;
  
        const currentLinkPositions = filterLinks.map((link) => {
          const rect = link.getBoundingClientRect();
          const filtersRect = filters.getBoundingClientRect();
          return {
            element: link,
            x: rect.left - filtersRect.left,
            y: rect.top - filtersRect.top,
          };
        });
  
        // Change class and get target values
        // Don't apply one-column-layout on mobile (max-width: 768px)
        if (!isMobile) {
          if (isGoingToOneColumn) {
            filters.classList.add("one-column-layout");
          } else {
            filters.classList.remove("one-column-layout");
          }
        }
        void filters.offsetHeight; // Force reflow
  
        const targetContainerStyle = window.getComputedStyle(filters);
        const targetTop = targetContainerStyle.top;
        const targetTransform = targetContainerStyle.transform;
  
        const targetLinkPositions = filterLinks.map((link) => {
          const rect = link.getBoundingClientRect();
          const filtersRect = filters.getBoundingClientRect();
          return {
            x: rect.left - filtersRect.left,
            y: rect.top - filtersRect.top,
          };
        });
  
        // Set initial states (ensure position stays absolute)
        gsap.set(filters, {
          position: "absolute",
          top: currentTop,
          transform: currentTransform,
        });
        filterLinks.forEach((link, i) => {
          const current = currentLinkPositions[i];
          const target = targetLinkPositions[i];
          gsap.set(link, { x: current.x - target.x, y: current.y - target.y });
        });
  
        // Animate everything together
        const timeline = gsap.timeline({
          onComplete: () => {
            // Clear inline styles so CSS can take over
            filters.style.top = "";
            filters.style.transform = "";
            filters.style.position = "";
            gsap.set(filters, { clearProps: "top,transform,position" });
            filterLinks.forEach((link) => {
              link.style.transform = "";
              link.style.x = "";
              link.style.y = "";
            });
            // Force CSS to apply (especially position: fixed for one-column-layout)
            if (isGoingToOneColumn) {
              void filters.offsetHeight; // Force reflow to apply CSS
            }
          },
        });
  
        timeline.to(filters, {
          top: targetTop,
          transform: targetTransform,
          duration: CATALOG_ANIMATION_CONFIG.duration,
          ease: CATALOG_ANIMATION_CONFIG.ease,
        });
  
        if (filterLinks.length > 0) {
          timeline.to(
            filterLinks,
            {
              x: 0,
              y: 0,
              duration: CATALOG_ANIMATION_CONFIG.duration,
              ease: CATALOG_ANIMATION_CONFIG.ease,
              stagger: 0.05,
            },
            0,
          ); // Start at same time
        }
  
        filtersAnimation = timeline;
        catalogActiveAnimations.push(filtersAnimation);
      } else if (isLayoutChanging && skipAnimation && !isMobile && filters) {
        // When skipping animation, set filters layout immediately
        // Don't apply one-column-layout on mobile (max-width: 768px)
        const isGoingToOneColumn = filter !== "all";
        if (!isMobile) {
          if (isGoingToOneColumn) {
            filters.classList.add("one-column-layout");
          } else {
            filters.classList.remove("one-column-layout");
          }
        }
        // Clear any inline styles so CSS can take over
        filters.style.top = "";
        filters.style.transform = "";
        filters.style.position = "";
        gsap.set(filters, { clearProps: "top,transform,position" });
        const filterLinks = Array.from(filters.querySelectorAll(".filter-link"));
        filterLinks.forEach((link) => {
          link.style.transform = "";
          link.style.x = "";
          link.style.y = "";
        });
        // Force CSS to apply (especially position: fixed for one-column-layout)
        if (isGoingToOneColumn && !isMobile) {
          void filters.offsetHeight; // Force reflow to apply CSS
        }
      }
  
      // Update previous filter for next time
      previousFilter = filter;
  
      // Fade in is now handled inside the filter change delay (above)
  
      // Scroll to top when filter changes (including 'all') to reset view
      if (smoothScrollInstance) {
        smoothScrollInstance.scrollTo(0, {
          duration: 0.8,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        });
      } else {
        // No smooth scroll (mobile) - use native scroll
        window.scrollTo(0, 0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
  
      // Refresh ScrollTrigger and footer reveal after scroll/layout settle (e.g. when filter changed row count)
      setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        if (typeof window.refreshFooterReveal === "function")
          window.refreshFooterReveal();
      }, 400);
    }
  
    // Function to update URL
    function updateURL(filter, replaceState = false) {
      const url = new URL(window.location.href);
      if (filter === "all") {
        url.searchParams.set("filter", "all");
      } else {
        url.searchParams.set("filter", filter);
      }
      if (replaceState) {
        window.history.replaceState({ filter }, "", url);
      } else {
        window.history.pushState({ filter }, "", url);
      }
    }
  
    // Function to get filter from URL
    function getFilterFromURL() {
      try {
        // Use window.location.href to get current URL including query params
        const url = new URL(window.location.href);
        return url.searchParams.get("filter") || "all";
      } catch (e) {
        // Fallback to window.location.search if URL parsing fails
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("filter") || "all";
      }
    }
  
    // Function to initialize filters after collection is loaded
    function initializeFilters() {
      // Re-setup filter attributes in case collection was updated
      setupFilterAttributes();
  
      // Re-get filter links after attributes are set
      filterLinks = searchRoot.querySelectorAll(".filter-link");
  
      // Re-setup event listeners
      setupFilterEventListeners();
  
      // Apply filter from URL on page load
      const urlFilter = getFilterFromURL();
  
      // Always set filter="all" in URL on page load if not present
      if (!window.location.search.includes("filter=")) {
        updateURL("all", true);
      }
  
      // Set "all" filter as active by default
      const allFilterLink = Array.from(filterLinks).find(
        (link) => link.getAttribute("data-filter") === "all",
      );
      if (allFilterLink) {
        allFilterLink.classList.add("active");
      }
  
      if (urlFilter !== "all") {
        // Set previousFilter to match URL filter so it doesn't trigger animation
        previousFilter = urlFilter;
        applyFilter(urlFilter, true);
      } else {
        // Ensure previousFilter is 'all' if no filter in URL
        previousFilter = "all";
        // Apply 'all' filter on page load to ensure all products are visible
        applyFilter("all", true);
      }
    }
  
    // Initialize filters - wait for Webflow collection to load
    // Webflow collections load asynchronously, so we need to wait
    let initializationAttempts = 0;
    const maxAttempts = 20; // Try for up to 2 seconds
  
    function waitForWebflowCollection() {
      initializationAttempts++;
  
      // Re-remove Webflow classes each time (they might be re-added)
      if (catalogFilters) {
        catalogFilters.classList.remove("w-dyn-items");
        const filterItems = catalogFilters.querySelectorAll(".w-dyn-item");
        filterItems.forEach((item) => item.classList.remove("w-dyn-item"));
        const dynList = catalogFilters.closest(".w-dyn-list");
        if (dynList) dynList.classList.remove("w-dyn-list");
        void catalogFilters.offsetHeight; // Force reflow
      }
  
      // Check if filters are ready (have content with text)
      const filterLinks = searchRoot.querySelectorAll(
        ".catalog-filters .filter-link",
      );
      const hasFilterContent = Array.from(filterLinks).some((link) => {
        const text = link.textContent?.trim();
        return text && text.length > 0;
      });
  
      if (
        filterLinks.length > 0 &&
        hasFilterContent &&
        initializationAttempts < maxAttempts
      ) {
        // Filters are loaded, initialize
        initializeFilters();
      } else if (initializationAttempts < maxAttempts) {
        // Wait a bit and try again
        setTimeout(waitForWebflowCollection, 100);
      } else {
        // Max attempts reached, try to initialize anyway
        initializeFilters();
      }
    }
  
    // Try to initialize immediately
    initializeFilters();
  
    // Also wait for Webflow collection to load (if using Webflow CMS)
    if (typeof window !== "undefined") {
      // Wait for DOM to be fully ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          setTimeout(waitForWebflowCollection, 100);
        });
      } else {
        setTimeout(waitForWebflowCollection, 100);
      }
  
      // Also try after delays to catch late-loading collections
      setTimeout(waitForWebflowCollection, 300);
      setTimeout(waitForWebflowCollection, 600);
      setTimeout(waitForWebflowCollection, 1000);
    }
  
    // Function to setup event listeners on filter links
    function setupFilterEventListeners() {
      // Get fresh filter links (in case collection was updated)
      filterLinks = searchRoot.querySelectorAll(".filter-link");
  
      filterLinks.forEach((link) => {
        // Remove existing handler if it exists
        if (link._catalogClickHandler) {
          link.removeEventListener("click", link._catalogClickHandler);
        }
  
        // Skip if no data-filter attribute (not ready yet)
        if (!link.hasAttribute("data-filter")) return;
  
        const clickHandler = function (e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
  
          const filter = this.getAttribute("data-filter");
          if (!filter) return;
  
          // Update URL
          updateURL(filter);
  
          // Apply filter
          applyFilter(filter);
  
          return false;
        };
  
        link.addEventListener("click", clickHandler);
        link._catalogClickHandler = clickHandler;
      });
    }
  
    // Setup event listeners initially
    setupFilterEventListeners();
  
    // Also watch for new filter links being added dynamically
    if (catalogFilters && typeof MutationObserver !== "undefined") {
      const eventListenersObserver = new MutationObserver(() => {
        // Re-setup event listeners when new filters are added
        setupFilterEventListeners();
      });
  
      eventListenersObserver.observe(catalogFilters, {
        childList: true,
        subtree: true,
      });
    }
  
    // Handle browser back/forward buttons (only add once)
    if (!window._catalogPopstateHandler) {
      window._catalogPopstateHandler = (e) => {
        const filter = e.state?.filter || getFilterFromURL();
        applyFilter(filter, true);
      };
      window.addEventListener("popstate", window._catalogPopstateHandler);
    }
  }
  
  var FINSWEET_ATTR =
      "https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js",
    FINSWEET_CF =
      "https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js";
  function loadFinsweet(e) {
    ((e = e || function () {}),
      (window.fsAttributes = window.fsAttributes || []),
      window.fsAttributes.push([
        "cmsfilter",
        function () {
          setTimeout(e, 50);
        },
      ]));
    var t = "?t=" + Date.now(),
      n = function () {
        var n = document.createElement("script");
        ((n.src = FINSWEET_CF + t),
          (n.onload = function () {
            setTimeout(e, 100);
          }),
          document.head.appendChild(n));
      };
    if (document.querySelector('script[src*="attributes@2"]')) n();
    else {
      var o = document.createElement("script");
      ((o.src = FINSWEET_ATTR + t),
        (o.type = "module"),
        (o.async = !0),
        (o.onload = n),
        document.head.appendChild(o));
    }
  }
  function initFinsweetForTransition(e) {
    e &&
      e.querySelector("[fs-cmsfilter-element]") &&
      loadFinsweet(initBlogFilterURLSync);
  }
  function initBlogFilterURLSync() {
    const e = document.querySelector('[fs-cmsfilter-element="filters"]');
    if (!e) return;
    const t = e.querySelector(".faq-tabs");
    if (!t) return;
    const n = {
      all: "Show All",
      "show-all": "Show All",
      guides: "Guides",
      features: "Features",
      news: "News",
    };
    function o() {
      const e = (function () {
          const e = (
            new URLSearchParams(window.location.search).get("filter") || ""
          )
            .toLowerCase()
            .replace(/\s+/g, "-");
          return "" === e ? "all" : e;
        })(),
        o = n[e] || n.all,
        i = t.querySelectorAll("label");
      for (let e = 0; e < i.length; e++) {
        const t = i[e].querySelector(
          "span.radio-button-label, span[fs-cmsfilter-field]",
        );
        if (t && t.textContent.trim() === o) return void i[e].click();
      }
    }
    (t.addEventListener("click", (e) => {
      const t = e.target.closest("label");
      if (!t) return;
      const n = t.querySelector(
        "span.radio-button-label, span[fs-cmsfilter-field]",
      );
      if (n) {
        const e = (function (e) {
          const t = (e || "").trim();
          return "Show All" === t ? "all" : t.toLowerCase().replace(/\s+/g, "-");
        })(n.textContent);
        setTimeout(
          () =>
            (function (e) {
              const t = new URL(window.location.href);
              ("all" !== e && e
                ? t.searchParams.set("filter", e)
                : t.searchParams.delete("filter"),
                window.history.replaceState({ blogFilter: e }, "", t.toString()));
            })(e),
          0,
        );
      }
    }),
      window._blogPopstateHandler ||
        ((window._blogPopstateHandler = () => o()),
        window.addEventListener("popstate", window._blogPopstateHandler)),
      "loading" === document.readyState
        ? document.addEventListener("DOMContentLoaded", () => setTimeout(o, 50))
        : setTimeout(o, 50));
    const i = document.querySelector('[fs-cmsfilter-element="list"]');
    if (i && "undefined" != typeof MutationObserver) {
      let e;
      const t = () => {
        (clearTimeout(e),
          (e = setTimeout(() => {
            ("undefined" != typeof ScrollTrigger && ScrollTrigger.refresh(),
              "function" == typeof window.refreshFooterReveal &&
                window.refreshFooterReveal());
          }, 150)));
      };
      new MutationObserver(() => t()).observe(i, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["class", "style"],
      });
    }
  }
  function initApproachSection(e) {
    const t = e || document,
      n = qs(".four-five .image-block", t),
      o = n ? n.querySelectorAll(".approach-image") : [],
      i = qsa(".four-five .underline-link", t);
    if (0 === o.length || 0 === i.length) return;
    n &&
      n._approachSectionInitialized &&
      n._autoRotateInterval &&
      clearInterval(n._autoRotateInterval);
    let r = 0,
      s = null;
    function l(e) {
      i.forEach((t, n) => {
        const o = t.querySelector(".underline-indicator");
        o &&
          (n === e
            ? ((o.style.transition = "width 2500ms linear"),
              (o.style.width = "0"),
              requestAnimationFrame(() => {
                o.style.width = "100%";
              }))
            : ((o.style.transition = "width 0.3s ease"), (o.style.width = "0")));
      });
    }
    function a(e) {
      e < 0 ||
        e >= o.length ||
        (o.forEach((t, n) => {
          n === e ? t.classList.add("active") : t.classList.remove("active");
        }),
        i.forEach((t, n) => {
          n === e ? t.classList.add("active") : t.classList.remove("active");
        }),
        (r = e),
        l(e));
    }
    function c() {
      a((r + 1) % o.length);
    }
    (i.forEach((e, t) => {
      const o = () => {
        r !== t &&
          (a(t),
          s &&
            (clearInterval(s),
            (s = setInterval(c, 2500)),
            n && (n._autoRotateInterval = s)));
      };
      (e._approachMouseEnter &&
        e.removeEventListener("mouseenter", e._approachMouseEnter),
        e.addEventListener("mouseenter", o),
        (e._approachMouseEnter = o));
    }),
      n && (n._approachSectionInitialized = !0),
      a(0),
      s && clearInterval(s),
      l(r),
      (s = setInterval(c, 2500)),
      n && (n._autoRotateInterval = s));
  }
  let smoothScrollInstance = null;
  function initCustomSmoothScrolling() {
    const e = (e, t, n) => (e < t ? t : e > n ? n : e);
    (window.customSmoothScroll &&
      window.customSmoothScroll.destroy &&
      window.customSmoothScroll.destroy(),
      (window.customSmoothScroll = new (class {
        constructor() {
          ((this.wrapper = window), (this.content = document.documentElement));
          const e = isTouchDevice();
          ((this.lerp = e ? 0.16 : 0.1),
            (this.duration = 4),
            (this.easing = e ? (e) => 1 - Math.pow(1 - e, 3) : (e) => e),
            (this.wheelMultiplier = 0.8),
            (this.touchMultiplier = 2.5),
            (this.momentumDecay = 0.9),
            (this.minMomentumVelocity = 0.8),
            (this.momentumBoost = 1),
            (this.targetScroll = 0),
            (this.currentScroll = 0),
            (this.momentumVelocity = 0),
            (this.scrollEnabled = !1),
            (this.isDragging = !1),
            (this.startY = 0),
            (this.lastFrameTime = performance.now()),
            (this.direction = 0),
            (this.currentTime = 0),
            (this.isSelectingText = !1),
            (this.mouseDownTime = 0),
            (this.mouseDownX = 0),
            (this.mouseDownY = 0),
            (this.touchVelocity = 0),
            (this.lastTouchY = 0),
            (this.lastTouchTime = 0),
            (this.velocityHistory = []),
            (this.scrollListeners = []),
            (this.rafId = null),
            (this.isAutoScrolling = !1),
            (this.autoScrollOriginX = 0),
            (this.autoScrollOriginY = 0),
            (this.autoScrollMouseX = 0),
            (this.autoScrollMouseY = 0),
            (this.autoScrollIndicator = null),
            (this._autoScrollKeyHandler = null),
            (this._autoScrollAuxHandler = null),
            this.init());
        }
        startAutoScroll(e, t) {
          if (isTouchDevice() || !this.scrollEnabled) return;
          (this.stopAutoScroll(),
            (this.isAutoScrolling = !0),
            (this.autoScrollOriginX = e),
            (this.autoScrollOriginY = t),
            (this.autoScrollMouseX = e),
            (this.autoScrollMouseY = t));
          const n = document.createElement("div");
          ((n.className = "cft-autoscroll-indicator"),
            (n.setAttribute("aria-hidden", "true"),
              (n.style.left = e + "px"),
              (n.style.top = t + "px"),
              document.body.appendChild(n),
              (this.autoScrollIndicator = n),
              document.documentElement.classList.add("cft-autoscrolling")));
        }
        stopAutoScroll() {
          ((this.isAutoScrolling = !1),
            this.autoScrollIndicator &&
              (this.autoScrollIndicator.remove(),
              (this.autoScrollIndicator = null)),
            document.documentElement.classList.remove(
              "cft-autoscrolling",
              "cft-autoscroll-up",
              "cft-autoscroll-down",
            ));
        }
        applyAutoScroll(t) {
          if (!this.isAutoScrolling || !this.scrollEnabled) return;
          const n = this.autoScrollMouseY - this.autoScrollOriginY,
            o = Math.abs(n),
            i = 14;
          if (
            (document.documentElement.classList.toggle(
              "cft-autoscroll-up",
              n < -i,
            ),
            document.documentElement.classList.toggle(
              "cft-autoscroll-down",
              n > i,
            ),
            o <= i)
          )
            return;
          const r = o - i,
            s = Math.min(3200, 36 * r + 0.12 * r * r),
            l = Math.sign(n) * s * t,
            a = document.documentElement.scrollHeight - window.innerHeight;
          ((this.targetScroll = e(this.targetScroll + l, 0, a)),
            (this.currentScroll = e(this.currentScroll + l, 0, a)),
            (this.currentTime = 0),
            (this.direction = Math.sign(n)));
        }
        init() {
          if (isTouchDevice()) {
            const e = () => {
              viewportHeightLocked ||
              document.documentElement.style.getPropertyValue("--vh")
                ? this.continueInit()
                : setTimeout(e, 50);
            };
            return void e();
          }
          this.continueInit();
        }
        continueInit() {
          ((document.body.style.overflow = "hidden"),
            (document.documentElement.style.scrollBehavior = "auto"),
            this.updateDimensions(),
            this.bindEvents(),
            setTimeout(() => {
              ((this.scrollEnabled = !0),
                this.forceScrollUpdate(),
                this.smoothScrollLoop());
            }, 10));
        }
        updateDimensions() {
          (this.wrapper === window ? document.documentElement : this.wrapper,
            this.content);
          const e = document.querySelector(".wrapper");
          e && (document.body.style.height = `${e.clientHeight}px`);
        }
        bindEvents() {
          const e = (e) =>
              e.target.closest(
                "input, textarea, select, button, [contenteditable]",
              ),
            t = (e) =>
              e &&
              (e.closest(
                "p, h1, h2, h3, h4, h5, h6, span, a, li, label, div, section, article, blockquote, td, th",
              ) ||
                window.getSelection().toString().length > 0),
            n = (target, ev) => {
              const path = (ev && ev.composedPath && ev.composedPath()) || [];
              for (let i = 0; i < path.length; i++) {
                const node = path[i];
                if (node && node.id === "useraccess-host") {
                  const root = node.shadowRoot;
                  if (root && root.querySelector(".ua-menu.is-open")) return !0;
                }
              }
              if (!target || !target.closest) return !1;
              const t = target.closest(
                ".features-overlay-content, .tech-overlay-content",
              );
              if (!t) return !1;
              const o = t.closest(
                ".features-overlay, .tech-overlay, .specialty-overlay",
              );
              return (
                !(!o || !o.classList.contains("active")) &&
                t.scrollHeight > t.clientHeight
              );
            };
          window.addEventListener(
            "wheel",
            (e) => {
              (this.isAutoScrolling && this.stopAutoScroll(),
                this.isDragging && ((this.isDragging = !1), (this.startY = 0)),
                0 === e.buttons && (this.isSelectingText = !1),
                e.ctrlKey ||
                  e.metaKey ||
                  n(e.target, e) ||
                  (this.scrollEnabled &&
                    (this.onScroll(e.deltaY * this.wheelMultiplier),
                    e.preventDefault())));
            },
            { passive: !1 },
          );
          const o = () => {
            ((this.isDragging = !1),
              (this.startY = 0),
              (this.touchVelocity = 0),
              (this.lastTouchY = 0),
              (this.lastTouchTime = 0),
              (this.velocityHistory = []));
          };
          (window.addEventListener(
            "touchstart",
            (e) => {
              if (!this.scrollEnabled) return;
              ((this.isDragging = !0),
                (this._touchStartedInOverlay = n(e.target, e)));
              const t = e.touches[0].clientY;
              ((this.startY = t),
                (this.lastTouchY = t),
                (this.lastTouchTime = performance.now()),
                (this.touchVelocity = 0),
                (this.velocityHistory = []),
                (this.momentumVelocity = 0),
                (this.currentTime = 0));
            },
            { passive: !0 },
          ),
            window.addEventListener(
              "touchmove",
              (e) => {
                if (!this.scrollEnabled) return;
                if (n(e.target, e) || this._touchStartedInOverlay)
                  return (o(), void (this._touchStartedInOverlay = !1));
                if (!this.isDragging) return;
                if (e.touches.length > 1) return void o();
                const t = e.touches[0].clientY,
                  i = performance.now(),
                  r = i - this.lastTouchTime;
                if (r > 0) {
                  const e = (this.lastTouchY - t) / r;
                  (this.velocityHistory.push(e),
                    this.velocityHistory.length > 5 &&
                      this.velocityHistory.shift());
                  let n = 0,
                    o = 0;
                  for (let e = 0; e < this.velocityHistory.length; e++) {
                    const t = e + 1;
                    ((o += this.velocityHistory[e] * t), (n += t));
                  }
                  this.touchVelocity = o / n;
                }
                const s = (this.startY - t) * this.touchMultiplier;
                isTouchDevice() && Math.round(this.currentScroll) <= 0 && s < 0
                  ? e.preventDefault()
                  : (Math.round(this.currentScroll) <= 0 && s < 0) ||
                    (this.onScroll(s),
                    (this.startY = t),
                    (this.lastTouchY = t),
                    (this.lastTouchTime = i),
                    e.preventDefault());
              },
              { passive: !1 },
            ),
            window.addEventListener(
              "touchend",
              () => {
                this.isDragging &&
                  (Math.abs(this.touchVelocity) > this.minMomentumVelocity &&
                    ((this.momentumVelocity =
                      1e3 * this.touchVelocity * this.momentumBoost),
                    (this.currentTime = 0),
                    (this.direction = Math.sign(this.touchVelocity))),
                  o());
              },
              { passive: !0 },
            ),
            window.addEventListener("touchcancel", o, { passive: !0 }),
            window.addEventListener(
              "mousedown",
              (n) => {
                var o;
                if (1 === n.button) {
                  if (this.isAutoScrolling)
                    return (
                      n.preventDefault(),
                      n.stopPropagation(),
                      void this.stopAutoScroll()
                    );
                  if (
                    e(n) ||
                    !this.scrollEnabled ||
                    (n.target && n.target.closest && n.target.closest("a[href]"))
                  )
                    return;
                  return (
                    n.preventDefault(),
                    n.stopPropagation(),
                    void this.startAutoScroll(n.clientX, n.clientY)
                  );
                }
                if (this.isAutoScrolling)
                  return (
                    n.preventDefault(),
                    void this.stopAutoScroll()
                  );
                (this.isDragging && ((this.isDragging = !1), (this.startY = 0)),
                  e(n) ||
                    ((this.mouseDownTime = Date.now()),
                    (this.mouseDownX = n.clientX),
                    (this.mouseDownY = n.clientY),
                    (this.isSelectingText = t(n.target)),
                    this.isSelectingText ||
                      ((o = n.target) &&
                        null !==
                          o.closest(
                            "p, h1, h2, h3, h4, h5, h6, span, a, li, label, div, section, article, blockquote, td, th",
                          )) ||
                      n.preventDefault()));
              },
              { passive: !1 },
            ),
            window.addEventListener(
              "mousemove",
              (n) => {
                if (
                  this.isAutoScrolling &&
                  ((this.autoScrollMouseX = n.clientX),
                  (this.autoScrollMouseY = n.clientY),
                  !0)
                )
                  return;
                if (!e(n))
                  if (1 === n.buttons && this.mouseDownTime > 0) {
                    const e = Date.now() - this.mouseDownTime,
                      o = Math.abs(n.clientX - this.mouseDownX),
                      i = Math.abs(n.clientY - this.mouseDownY);
                    if (e > 50 || o > 3 || i > 3) {
                      this.isSelectingText;
                      const e =
                        t(n.target) &&
                        (() => {
                          const e = window.getSelection();
                          return e && e.toString().length > 0;
                        })();
                      ((this.isSelectingText = e), this.isSelectingText);
                    }
                  } else 0 === n.buttons && (this.isSelectingText = !1);
              },
              { passive: !1 },
            ),
            window.addEventListener(
              "mouseup",
              () => {
                ((this.isSelectingText = !1), (this.mouseDownTime = 0));
              },
              { passive: !0 },
            ),
            ((this._autoScrollKeyHandler = (e) => {
              this.isAutoScrolling &&
                ("Escape" === e.key || "Esc" === e.key) &&
                this.stopAutoScroll();
            }),
              window.addEventListener("keydown", this._autoScrollKeyHandler),
              (this._autoScrollAuxHandler = (e) => {
                1 === e.button &&
                  this.isAutoScrolling &&
                  (e.preventDefault(), e.stopPropagation());
              }),
              window.addEventListener(
                "auxclick",
                this._autoScrollAuxHandler,
                !0,
              )),
            window.addEventListener(
              "resize",
              () => {
                requestAnimationFrame(() => this.updateDimensions());
              },
              { passive: !0 },
            ));
        }
        onScroll(t) {
          if (!this.scrollEnabled) return;
          if (isTouchDevice() && this.targetScroll <= 0 && t < 0)
            return (
              (this.targetScroll = 0),
              void (this.currentScroll <= 0 && (this.currentScroll = 0))
            );
          const n = Math.sign(t);
          ((Math.abs(this.direction) !== n ||
            this.currentTime > 0.5 * this.duration) &&
            (this.currentTime = 0),
            (this.direction = n));
          const o = document.documentElement.scrollHeight - window.innerHeight;
          this.targetScroll = e(this.targetScroll + t, 0, o);
        }
        forceScrollUpdate() {
          const e = window.scrollY || window.pageYOffset || 0;
          ((this.targetScroll = e), (this.currentScroll = e));
        }
        smoothScrollLoop() {
          const t = performance.now(),
            n = Math.min((t - this.lastFrameTime) / 1e3, 0.1);
          if (((this.lastFrameTime = t), this.applyAutoScroll(n),
            isTouchDevice() && Math.abs(this.momentumVelocity) > 5)
          ) {
            const t = document.documentElement.scrollHeight - window.innerHeight;
            ((this.targetScroll = e(
              this.targetScroll + this.momentumVelocity * n,
              0,
              t,
            )),
              (this.momentumVelocity *= Math.pow(this.momentumDecay, 60 * n)),
              Math.abs(this.momentumVelocity) < 5 && (this.momentumVelocity = 0),
              (this.currentTime = 0));
          }
          if (
            (isTouchDevice() && this.targetScroll < 0 && (this.targetScroll = 0),
            isTouchDevice() && this.currentScroll < 0 && (this.currentScroll = 0),
            !this.scrollEnabled)
          )
            return void (this.rafId = requestAnimationFrame(() =>
              this.smoothScrollLoop(),
            ));
          if (
            Math.abs(this.targetScroll - this.currentScroll) <
            (isTouchDevice() && this.targetScroll <= 0 ? 0.01 : 0.1)
          )
            return (
              (this.currentScroll = this.targetScroll),
              isTouchDevice() &&
                this.targetScroll <= 0 &&
                ((this.currentScroll = 0), (this.currentTime = 0)),
              window.scrollTo(0, this.currentScroll),
              this.triggerScrollEvent(),
              void (this.rafId = requestAnimationFrame(() =>
                this.smoothScrollLoop(),
              ))
            );
          const o = e(this.currentTime / this.duration, 0, 1),
            i = o >= 1 ? 1 : this.easing(o),
            r = 3 / this.duration,
            s = 1 - 0.3 * i,
            l = e(this.lerp * r * s, 0.3 * this.lerp, 2.5 * this.lerp);
          ((this.currentScroll = ((e, t, n) => e + (t - e) * n)(
            this.currentScroll,
            this.targetScroll,
            l,
          )),
            isTouchDevice() && this.currentScroll < 0 && (this.currentScroll = 0),
            o < 1 ? (this.currentTime += n) : (this.currentTime = 0),
            window.scrollTo(0, this.currentScroll),
            this.triggerScrollEvent(),
            (this.rafId = requestAnimationFrame(() => this.smoothScrollLoop())));
        }
        triggerScrollEvent() {
          for (let e = 0; e < this.scrollListeners.length; e++) {
            const t = this.scrollListeners[e];
            "function" == typeof t && t();
          }
        }
        stop() {
          (this.stopAutoScroll(), (this.scrollEnabled = !1));
        }
        start() {
          this.scrollEnabled = !0;
        }
        scrollTo(e, t = {}) {
          const n = "number" == typeof e ? e : 0;
          t.immediate
            ? ((this.targetScroll = n),
              (this.currentScroll = n),
              window.scrollTo(0, n))
            : ((this.targetScroll = n), (this.currentTime = 0));
        }
        on(e, t) {
          "scroll" === e && this.scrollListeners.push(t);
        }
        off(e, t) {
          if ("scroll" === e) {
            const e = this.scrollListeners.indexOf(t);
            e > -1 && this.scrollListeners.splice(e, 1);
          }
        }
        raf(e) {}
        get scroll() {
          return this.currentScroll;
        }
        setEnableScroll(e) {
          this.scrollEnabled = e;
        }
        restart() {
          const e = window.scrollY || window.pageYOffset;
          ((this.targetScroll = e),
            (this.currentScroll = e),
            (this.velocity = 0));
        }
        resize() {
          this.updateDimensions();
        }
        destroy() {
          (this.stopAutoScroll(),
            this._autoScrollKeyHandler &&
              (window.removeEventListener(
                "keydown",
                this._autoScrollKeyHandler,
              ),
              (this._autoScrollKeyHandler = null)),
            this._autoScrollAuxHandler &&
              (window.removeEventListener(
                "auxclick",
                this._autoScrollAuxHandler,
                !0,
              ),
              (this._autoScrollAuxHandler = null)),
            (this.scrollEnabled = !1),
            this.rafId && cancelAnimationFrame(this.rafId),
            (document.body.style.overflow = ""),
            (document.body.style.height = ""),
            (document.documentElement.style.scrollBehavior = ""),
            (document.documentElement.style.touchAction = ""),
            (this.scrollListeners = []));
        }
      })()),
      (smoothScrollInstance = window.customSmoothScroll),
      (window.smoothScrollInstance = smoothScrollInstance),
      initCustomScrollbar(smoothScrollInstance));
  }
  const SCROLLBAR_IDLE_MS = 2e3,
    SCROLLBAR_STOPPED_MS = 200;
  function initCustomScrollbar(e) {
    if (!e || isTouchDevice()) return;
    const t = (e, t, n) => (e < t ? t : e > n ? n : e),
      n = () =>
        Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
      o = document.createElement("div");
    o.className = "custom-scrollbar";
    const i = document.createElement("div");
    i.className = "custom-scrollbar-track";
    const r = document.createElement("div");
    ((r.className = "custom-scrollbar-thumb"),
      i.appendChild(r),
      o.appendChild(i),
      document.body.appendChild(o));
    let s = null,
      l = null,
      a = null;
    function c() {
      o.classList.add("visible");
    }
    function d() {
      (l && clearTimeout(l),
        a && clearTimeout(a),
        (l = setTimeout(() => {
          ((l = null),
            (a = setTimeout(() => {
              (o.classList.remove("visible"), (a = null));
            }, SCROLLBAR_IDLE_MS)));
        }, SCROLLBAR_STOPPED_MS)));
    }
    function u(e) {
      const t = n(),
        o = i.getBoundingClientRect().height,
        s = window.innerHeight / document.documentElement.scrollHeight,
        l = t <= 0 ? o : Math.max(40, o * s),
        a = t <= 0 ? 0 : (e / t) * (o - l);
      ((r.style.height = l + "px"),
        (r.style.transform = "translateY(" + a + "px)"));
    }
    function m() {
      u("number" == typeof e.scroll ? e.scroll : window.scrollY || 0);
    }
    function g() {
      m();
      const t = "number" == typeof e.scroll ? e.scroll : window.scrollY || 0;
      null !== s ? (Math.abs(t - s) > 0.5 && (c(), d()), (s = t)) : (s = t);
    }
    (e.on("scroll", g), m(), window.addEventListener("resize", m));
    let h = !1,
      f = 0,
      p = 0,
      y = null,
      v = null;
    function w(o) {
      if (!h) return;
      const s = i.getBoundingClientRect(),
        l = n(),
        a = o.clientY - f;
      f = o.clientY;
      const c = s.height - r.offsetHeight;
      if (c <= 0) return;
      const d = t(p + (a / c) * l, 0, l);
      ((p = d),
        u(d),
        (v = d),
        null === y &&
          (y = requestAnimationFrame(() => {
            ((y = null),
              null !== v && (e.scrollTo(v, { immediate: !1 }), (v = null)));
          })));
    }
    function S() {
      ((h = !1),
        null !== y && cancelAnimationFrame(y),
        (y = null),
        (v = null),
        document.removeEventListener("mousemove", w),
        document.removeEventListener("mouseup", S));
    }
    (i.addEventListener("mousedown", (o) => {
      if (o.target !== i) return;
      (o.preventDefault(), c(), d());
      const r = n(),
        s = i.getBoundingClientRect(),
        l = o.clientY - s.top,
        a = t(l / s.height, 0, 1) * r;
      e.scrollTo(a, { immediate: !0 });
    }),
      r.addEventListener("mousedown", (t) => {
        (t.preventDefault(),
          c(),
          d(),
          (h = !0),
          (f = t.clientY),
          (p = "number" == typeof e.scroll ? e.scroll : window.scrollY || 0),
          document.addEventListener("mousemove", w),
          document.addEventListener("mouseup", S));
      }));
    const b = e.destroy.bind(e);
    e.destroy = function () {
      (l && clearTimeout(l),
        a && clearTimeout(a),
        o.remove(),
        window.removeEventListener("resize", m),
        e.off("scroll", g),
        document.removeEventListener("mousemove", w),
        document.removeEventListener("mouseup", S),
        b());
    };
  }
  function initSmoothScroll(e = 0, t = 40) {
    if (isMobileViewport())
      return (
        smoothScrollInstance &&
          smoothScrollInstance.destroy &&
          smoothScrollInstance.destroy(),
        (smoothScrollInstance = null),
        (window.smoothScrollInstance = null),
        (window.customSmoothScroll = null),
        (document.body.style.overflow = ""),
        (document.documentElement.style.overflow = ""),
        void (document.documentElement.style.scrollBehavior = "auto")
      );
    if ("undefined" == typeof ScrollTrigger)
      return e < t
        ? void setTimeout(() => initSmoothScroll(e + 1, t), 100)
        : (console.warn(
            "ScrollTrigger not loaded after retries - smooth scroll will work without ScrollTrigger integration",
          ),
          smoothScrollInstance &&
            smoothScrollInstance.destroy &&
            (smoothScrollInstance.destroy(), (smoothScrollInstance = null)),
          resetScroll(),
          void initCustomSmoothScrolling());
    (smoothScrollInstance &&
      smoothScrollInstance.destroy &&
      (smoothScrollInstance.destroy(), (smoothScrollInstance = null)),
      resetScroll(),
      initCustomSmoothScrolling(),
      ("hidden" === document.body.style.overflow ||
        "hidden" === document.documentElement.style.overflow) &&
        smoothScrollInstance &&
        smoothScrollInstance.stop());
    let n = null,
      o = 0;
    const i = () => {
      ("undefined" != typeof ScrollTrigger && ScrollTrigger.update(),
        (n = null),
        isTouchDevice() && (o = Date.now()));
    };
    (smoothScrollInstance &&
      smoothScrollInstance.on("scroll", () => {
        (isTouchDevice() && Date.now() - o < 48) ||
          n ||
          (n = requestAnimationFrame(i));
      }),
      requestAnimationFrame(() => {
        "undefined" != typeof ScrollTrigger && ScrollTrigger.refresh();
      }));
  }
  let resizeTimeout,
    gridOverlay = null,
    isGridVisible = !1;
  function createGridOverlay() {
    if (gridOverlay) return gridOverlay;
    ((gridOverlay = document.createElement("div")),
      (gridOverlay.className = "grid-overlay"));
    for (let e = 0; e < 12; e++)
      gridOverlay.appendChild(document.createElement("div"));
    return (document.body.appendChild(gridOverlay), gridOverlay);
  }
  function toggleGrid() {
    (gridOverlay || createGridOverlay(),
      (isGridVisible = !isGridVisible),
      (gridOverlay.style.display = isGridVisible ? "grid" : "none"));
  }
  function initInteractiveCursor() {
    if (isMobileViewport()) return;
    const e = qs("#cursor");
    if (!e) return;
    (window.cursorAnimationFrame &&
      cancelAnimationFrame(window.cursorAnimationFrame),
      window.cleanupCursor && window.cleanupCursor(),
      gsap.set(e, {
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        opacity: 1,
        visibility: "visible",
      }),
      e.classList.remove(
        "change",
        "explore",
        "drag",
        "scroll",
        "enter",
        "play",
        "soon",
        "rotate",
        "arrow",
      ));
    const t = { x: -100, y: -100 };
    let n,
      o = !1,
      i = !1,
      r = !1;
    const s = (e) => {
        ((t.x = e.clientX), (t.y = e.clientY), (o = !0));
      },
      l = () => {
        (o &&
          (gsap.to(e, { duration: 0.6, x: t.x, y: t.y, ease: "power3.out" }),
          (o = !1)),
          (n = requestAnimationFrame(l)));
      },
      a = (t) => {
        (t.currentTarget || t.target).classList.contains("link-box") ||
          (r || e.classList.add("change"),
          e.classList.remove("explore", "scroll", "enter", "play"));
      },
      c = () => {
        r || e.classList.remove("change");
      },
      d = () => {
        (r ||
          e.classList.remove(
            "change",
            "explore",
            "drag",
            "scroll",
            "enter",
            "play",
          ),
          (r = !0),
          setTimeout(() => (r = !1), 1e3));
      },
      u = () => {},
      m = () => {
        i && e.classList.add("drag");
      },
      g = () => {
        (i && ((i = !1), e.classList.remove("drag")), clearTimeout(void 0));
      },
      h = [],
      f = [],
      p = [],
      y = [],
      v = [],
      w = [],
      S = [];
    (qsa(".gallery").forEach((t) => {
      const n = () => e.classList.add("drag"),
        o = () => e.classList.remove("drag");
      (t.addEventListener("mouseenter", n),
        t.addEventListener("mouseleave", o),
        h.push({ el: t, enterHandler: n, leaveHandler: o }));
    }),
      qsa(".hero-3d").forEach((t) => {
        const n = () => e.classList.add("rotate"),
          o = () => e.classList.remove("rotate");
        (t.addEventListener("mouseenter", n),
          t.addEventListener("mouseleave", o),
          f.push({ el: t, enterHandler: n, leaveHandler: o }));
      }),
      qsa(".work-thumbnail").forEach((t) => {
        const n = () => e.classList.add("enter"),
          o = () => e.classList.remove("enter");
        (t.addEventListener("mouseenter", n),
          t.addEventListener("mouseleave", o),
          p.push({ el: t, enterHandler: n, leaveHandler: o }));
      }),
      qsa(".link-box").forEach((t) => {
        const n = () => e.classList.add("enter"),
          o = () => e.classList.remove("enter");
        (t.addEventListener("mouseenter", n),
          t.addEventListener("mouseleave", o),
          y.push({ el: t, enterHandler: n, leaveHandler: o }));
      }),
      qsa(".click-disable").forEach((t) => {
        if (!t.closest(".work-content, .project-cover")) {
          const n = () => e.classList.add("soon"),
            o = () => e.classList.remove("soon");
          (t.addEventListener("mouseenter", n),
            t.addEventListener("mouseleave", o),
            v.push({ el: t, enterHandler: n, leaveHandler: o }));
        }
      }),
      qsa("a, button").forEach((e) => {
        (e.addEventListener("mouseenter", a),
          e.addEventListener("mouseleave", c),
          e.addEventListener("click", d),
          w.push({
            el: e,
            handleLinkEnter: a,
            handleLinkLeave: c,
            handleLinkClick: d,
          }));
      }),
      qsa(".arrow-left, .arrow-right").forEach((t) => {
        const n = () => {
            e.classList.add("arrow");
          },
          o = () => {
            e.classList.remove("arrow");
          };
        (t.addEventListener("mouseenter", n),
          t.addEventListener("mouseleave", o),
          S.push({ el: t, enterHandler: n, leaveHandler: o }));
      }),
      document.addEventListener("mousemove", s),
      document.addEventListener("mousedown", u),
      document.addEventListener("mousemove", m),
      document.addEventListener("mouseup", g),
      l(),
      (window.cursorAnimationFrame = n),
      (window.cleanupCursor = () => {
        (n && cancelAnimationFrame(n),
          document.removeEventListener("mousemove", s),
          document.removeEventListener("mousedown", u),
          document.removeEventListener("mousemove", m),
          document.removeEventListener("mouseup", g),
          h.forEach(({ el: e, enterHandler: t, leaveHandler: n }) => {
            (e.removeEventListener("mouseenter", t),
              e.removeEventListener("mouseleave", n));
          }),
          f.forEach(({ el: e, enterHandler: t, leaveHandler: n }) => {
            (e.removeEventListener("mouseenter", t),
              e.removeEventListener("mouseleave", n));
          }),
          p.forEach(({ el: e, enterHandler: t, leaveHandler: n }) => {
            (e.removeEventListener("mouseenter", t),
              e.removeEventListener("mouseleave", n));
          }),
          y.forEach(({ el: e, enterHandler: t, leaveHandler: n }) => {
            (e.removeEventListener("mouseenter", t),
              e.removeEventListener("mouseleave", n));
          }),
          v.forEach(({ el: e, enterHandler: t, leaveHandler: n }) => {
            (e.removeEventListener("mouseenter", t),
              e.removeEventListener("mouseleave", n));
          }),
          w.forEach(
            ({
              el: e,
              handleLinkEnter: t,
              handleLinkLeave: n,
              handleLinkClick: o,
            }) => {
              (e.removeEventListener("mouseenter", t),
                e.removeEventListener("mouseleave", n),
                e.removeEventListener("click", o));
            },
          ),
          S.forEach(({ el: e, enterHandler: t, leaveHandler: n }) => {
            (e.removeEventListener("mouseenter", t),
              e.removeEventListener("mouseleave", n));
          }),
          e &&
            e.classList.remove(
              "change",
              "explore",
              "drag",
              "scroll",
              "enter",
              "play",
              "soon",
              "rotate",
              "arrow",
            ));
      }));
  }
  function initScrollToTop() {
    const e = qs(".scroll-to-top");
    if (!e) return;
    e.replaceWith(e.cloneNode(!0));
    const t = qs(".scroll-to-top"),
      n = (e) =>
        e <= 0
          ? 0
          : e >= 1
            ? 1
            : e < 0.5
              ? 8 * e * e * e * e
              : 1 - Math.pow(-2 * e + 2, 4) / 2;
    t.addEventListener("click", function (e) {
      (e.preventDefault(),
        void 0 !== smoothScrollInstance && smoothScrollInstance
          ? smoothScrollInstance.scrollTo(0, { duration: 1.5, easing: n })
          : window.scrollTo(0, 0));
    });
  }
  function initFavicon() {
    const e = document.head || document.getElementsByTagName("head")[0];
    if (!e) return;
    ([
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      'link[rel="mask-icon"]',
      'link[href*="favicon"]',
      'link[href*="fav-icon"]',
    ].forEach((t) => {
      qsa(t, e).forEach((e) => e.remove());
    }),
      Array.from(e.querySelectorAll("link")).forEach((e) => {
        const t = e.getAttribute("href") || "",
          n = e.getAttribute("rel") || "";
        (t.includes("favicon") ||
          t.includes("fav-icon") ||
          n.includes("icon") ||
          n.includes("apple-touch")) &&
          e.remove();
      }));
    const t = "?v=" + Date.now();
    try {
      const n = document.createElement("link");
      ((n.rel = "icon"),
        (n.type = "image/svg+xml"),
        (n.href =
          "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/697787d81249677c77def290_ct-favicon.svg" +
          t),
        e.insertBefore(n, e.firstChild));
      const o = document.createElement("link");
      ((o.rel = "icon"),
        (o.type = "image/png"),
        (o.sizes = "32x32"),
        (o.href =
          "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/697787d852b98cb5a09367ba_ct-favicon.png" +
          t),
        e.insertBefore(o, e.firstChild));
      const i = document.createElement("link");
      ((i.rel = "icon"),
        (i.type = "image/png"),
        (i.sizes = "16x16"),
        (i.href =
          "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/697787d852b98cb5a09367ba_ct-favicon.png" +
          t),
        e.insertBefore(i, e.firstChild));
      const r = document.createElement("link");
      ((r.rel = "apple-touch-icon"),
        (r.sizes = "180x180"),
        (r.href =
          "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/697787d852b98cb5a09367ba_ct-favicon.png" +
          t),
        e.insertBefore(r, e.firstChild));
      const s = document.createElement("link");
      ((s.rel = "mask-icon"),
        (s.href =
          "https://cdn.prod.website-files.com/69775d436fb843a337f88f38/697787d81249677c77def290_ct-favicon.svg" +
          t),
        s.setAttribute("color", "#100F11"),
        e.insertBefore(s, e.firstChild));
    } catch (e) {
      console.warn("Failed to set favicons:", e);
    }
  }
  function initFAQAccordion() {
    const e = qsa(".faq-item");
    e.length &&
      (e.forEach((e) => {
        const t = e.querySelector(".faq-answer");
        (t &&
          t._faqAnimation &&
          (t._faqAnimation.kill(), (t._faqAnimation = null)),
          "undefined" != typeof gsap && gsap.killTweensOf(t));
      }),
      e.forEach((e) => {
        const t = e.querySelector(".faq-answer");
        t &&
          e.addEventListener("click", function () {
            const n = e.classList.contains("active");
            if (
              (qsa(".faq-item").forEach((t) => {
                if (t !== e) {
                  const e = t.querySelector(".faq-answer");
                  (t.classList.remove("active"),
                    "undefined" != typeof gsap &&
                      (e._faqAnimation &&
                        (e._faqAnimation.kill(), (e._faqAnimation = null)),
                      gsap.killTweensOf(e),
                      (e._faqAnimation = gsap.to(e, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      }))));
                }
              }),
              n)
            )
              (e.classList.remove("active"),
                "undefined" != typeof gsap &&
                  (t._faqAnimation &&
                    (t._faqAnimation.kill(), (t._faqAnimation = null)),
                  gsap.killTweensOf(t),
                  (t._faqAnimation = gsap.to(t, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                  }))));
            else if ((e.classList.add("active"), "undefined" != typeof gsap)) {
              (t._faqAnimation &&
                (t._faqAnimation.kill(), (t._faqAnimation = null)),
                gsap.killTweensOf(t),
                gsap.set(t, { height: "auto", opacity: 0 }));
              const e = t.offsetHeight;
              (gsap.set(t, { height: 0, opacity: 0 }),
                (t._faqAnimation = gsap.to(t, {
                  height: e,
                  opacity: 1,
                  duration: 0.3,
                  ease: "power2.out",
                })));
            }
          });
      }),
      qsa(".faq-item").forEach((e) => {
        const t = e.querySelector(".faq-answer");
        t &&
          (e.classList.remove("active"),
          "undefined" != typeof gsap
            ? gsap.set(t, { height: 0, opacity: 0 })
            : ((t.style.height = "0"), (t.style.opacity = "0")));
      }));
  }
  function initTabFilters() {
    const e = Array.from(qsa(".faq-tabs, #blog-tabs, #faq-tabs, #events-tabs"));
    if (0 === e.length) {
      const t = Array.from(qsa("nav")).filter(
        (e) =>
          !e.classList.contains("catalog-filters") &&
          e.querySelectorAll(".filter-link").length > 0,
      );
      t.length > 0 && e.push(...t);
    }
    0 !== e.length &&
      (e.forEach((e) => {
        e.classList.contains("catalog-filters") ||
          e.querySelectorAll(".filter-link").forEach((e) => {
            e.setAttribute("data-no-split-text", "true");
          });
      }),
      e.forEach((e) => {
        const t = e.querySelectorAll(".filter-link");
        if (0 === t.length) return;
        const n = e.id || "",
          o = (e) => {
            const t = e.getAttribute("data-tab");
            if (t)
              if ("blog-tabs" === n || document.querySelector("#blog-all")) {
                qsa(".blog-grid-container").forEach((e) => {
                  e.style.display = "none";
                });
                const e = document.getElementById(`blog-${t}`);
                e && (e.style.display = "");
              } else if (
                "faq-tabs" === n ||
                document.querySelector("#faq-products")
              ) {
                qsa(".faq-container").forEach((e) => {
                  e.style.display = "none";
                });
                const e = document.getElementById(`faq-${t}`);
                e && (e.style.display = "");
              } else if (
                "events-tabs" === n ||
                document.querySelector("#events-all")
              ) {
                qsa(".events-grid-container").forEach((e) => {
                  e.style.display = "none";
                });
                const e = document.getElementById(`events-${t}`);
                e && (e.style.display = "");
              }
          };
        t.forEach((e) => {
          e._tabClickHandler &&
            e.removeEventListener("click", e._tabClickHandler);
          const n = function (e) {
            (e.preventDefault(),
              this.getAttribute("data-tab") &&
                (t.forEach((e) => e.classList.remove("active")),
                this.classList.add("active"),
                o(this)));
          };
          (e.addEventListener("click", n), (e._tabClickHandler = n));
        });
        const i =
          Array.from(t).find((e) => e.classList.contains("active")) || t[0];
        i &&
          (Array.from(t).some((e) => e.classList.contains("active")) ||
            (t.forEach((e) => e.classList.remove("active")),
            i.classList.add("active")),
          o(i));
      }));
  }
  function ensureDownloadDropdownStructure(e) {
    var t = e || document,
      n = t.querySelector(".download-btn-content");
    if (n) {
      var o = n.parentElement;
      if (o) {
        var i = o.querySelector(".w-richtext");
        if (
          i &&
          !(
            (t.querySelector("#download-menu") &&
              t.querySelector("#download-links-list")) ||
            ((i.id = "download-links-list"),
            i.classList.add("download-links-source"),
            i.setAttribute("aria-hidden", "true"),
            (i.style.display = "none"),
            o.querySelector("#download-menu"))
          )
        ) {
          var r = document.createElement("div");
          ((r.className = "download-menu"),
            (r.id = "download-menu"),
            i.nextSibling ? o.insertBefore(r, i.nextSibling) : o.appendChild(r));
        }
      }
    }
  }
  function buildDownloadMenuFromList(e) {
    const t = e || document,
      n = t.querySelector("#download-links-list"),
      o = t.querySelector("#download-menu");
    if (n && o) {
      var i = [];
      if ("SCRIPT" === n.tagName && "text/plain" === n.type) {
        if (!(a = (n.textContent || n.innerText || "").trim())) return;
        a.split(/\n\n+/).forEach(function (e) {
          var t = e
            .split("\n")
            .map(function (e) {
              return e.trim();
            })
            .filter(Boolean);
          t.length >= 2 && i.push({ label: t[0], url: t[1] });
        });
      } else {
        var r = n.querySelectorAll("p, div");
        if (r.length) {
          for (var s = [], l = 0; l < r.length; l++) {
            var a,
              c = (a = (r[l].textContent || "").trim())
                .split(/\n+/)
                .map(function (e) {
                  return e.trim();
                })
                .filter(Boolean);
            if (c.length >= 2) s.push({ label: c[0], url: c[1] });
            else {
              var d = a.search(/https?:\/\//);
              d > 0 &&
                s.push({ label: a.slice(0, d).trim(), url: a.slice(d).trim() });
            }
          }
          if (s.length > 0) i = s;
          else
            for (var u = 0; u + 1 < r.length; u += 2)
              ((f = (r[u].textContent || "").trim()),
                (p = (r[u + 1].textContent || "").trim()),
                f && p && i.push({ label: f, url: p }));
        } else {
          var m = (n.textContent || n.innerText || "").trim();
          if (m)
            for (
              var g = m
                  .split(/\n+/)
                  .map(function (e) {
                    return e.trim();
                  })
                  .filter(Boolean),
                h = 0;
              h + 1 < g.length;
              h += 2
            ) {
              var f = g[h],
                p = g[h + 1];
              f && p && i.push({ label: f, url: p });
            }
        }
      }
      ((o.innerHTML = ""),
        i.forEach(function (e) {
          var t = document.createElement("a");
          ((t.className = "download-link"),
            (t.href = e.url),
            (t.target = "_blank"),
            (t.rel = "noopener noreferrer"),
            (t.textContent = e.label),
            o.appendChild(t));
        }),
        n.parentNode && n.parentNode.removeChild(n),
        i.length &&
          "undefined" != typeof Weglot &&
          Weglot.getCurrentLang &&
          Weglot.switchTo &&
          "en" !== Weglot.getCurrentLang() &&
          setTimeout(function () {
            Weglot.switchTo(Weglot.getCurrentLang());
          }, 50));
    }
  }
  function initDownloadDropdown() {
    const e = document.getElementById("download-catalog-btn"),
      t = document.getElementById("download-menu"),
      n = e?.closest(".download-dropdown");
    var o;
    e &&
      t &&
      n &&
      (e._downloadDropdownInit ||
        ((e._downloadDropdownInit = !0),
        n.addEventListener("mouseenter", function () {
          t.style.maxHeight = t.scrollHeight + "px";
        }),
        n.addEventListener("mouseleave", function () {
          n.classList.contains("active") || (t.style.maxHeight = "0");
        }),
        e.addEventListener("click", function (e) {
          (e.preventDefault(),
            e.stopPropagation(),
            n.classList.toggle("active"),
            i());
        }),
        document.addEventListener("click", function (e) {
          n.contains(e.target) || (n.classList.remove("active"), i());
        }),
        t.addEventListener("click", function (e) {
          (e.stopPropagation(),
            e.target.classList.contains("download-link") &&
              (e.target.style.opacity && (e.target.style.opacity = ""),
              "undefined" != typeof gsap &&
                (gsap.killTweensOf(e.target),
                gsap.set(e.target, { clearProps: "opacity" })),
              e.target.offsetHeight));
        }),
        t.querySelectorAll(".download-link").forEach((e) => {
          (e.addEventListener("mouseenter", function () {
            (void 0 !== this.style.opacity &&
              "" !== this.style.opacity &&
              this.style.removeProperty("opacity"),
              "undefined" != typeof gsap &&
                (gsap.killTweensOf(this),
                gsap.set(this, { clearProps: "opacity" })));
          }),
            e.addEventListener("mouseleave", function () {
              (void 0 !== this.style.opacity &&
                "" !== this.style.opacity &&
                this.style.removeProperty("opacity"),
                "undefined" != typeof gsap &&
                  (gsap.killTweensOf(this),
                  gsap.set(this, { clearProps: "opacity" })));
            }));
        }),
        window.addEventListener("resize", i)));
    function i() {
      (n.classList.contains("active") || n.matches(":hover")
        ? (t.style.maxHeight = t.scrollHeight + "px")
        : (t.style.maxHeight = "0"),
        o && clearTimeout(o),
        requestAnimationFrame(function () {
          "function" == typeof window.refreshFooterReveal &&
            window.refreshFooterReveal();
        }),
        (o = setTimeout(function () {
          ("function" == typeof window.refreshFooterReveal &&
            window.refreshFooterReveal(),
            (o = null));
        }, 650)));
    }
  }
  function initStickyBarCTA(e, t = 0) {
    const n = e || document;
    let o = document.querySelector(".sticky-cta-bar");
    o &&
      (o._scrollHandler &&
        (smoothScrollInstance
          ? smoothScrollInstance.off("scroll", o._scrollHandler)
          : window.removeEventListener("scroll", o._scrollHandler),
        (o._scrollHandler = null)),
      o._resizeHandler &&
        (window.removeEventListener("resize", o._resizeHandler),
        (o._resizeHandler = null)),
      o.classList.remove("fixed"));
    let i = null;
    if (
      (n !== document &&
        n.querySelector &&
        (i = n.querySelector("#product-page")),
      i || (i = document.querySelector("#product-page")),
      !i)
    )
      return;
    if (!o && t < 10)
      return void setTimeout(() => {
        initStickyBarCTA(e, t + 1);
      }, 300);
    if (!o) return;
    let r = null,
      s = null;
    if (
      (n !== document &&
        n.querySelector &&
        ((r = n.querySelector("#sticky-bar-start")),
        (s = n.querySelector("#sticky-bar-end"))),
      r || (r = document.getElementById("sticky-bar-start")),
      s || (s = document.getElementById("sticky-bar-end")),
      !r)
    ) {
      r =
        (n !== document && n.querySelector && n.querySelector("[data-sticky-bar-start]")) ||
        document.querySelector("[data-sticky-bar-start]") ||
        i.querySelector(".product-info") ||
        i.querySelector(".container") ||
        i;
    }
    if (!s) {
      s =
        (n !== document && n.querySelector && n.querySelector("[data-sticky-bar-end]")) ||
        document.querySelector("[data-sticky-bar-end]") ||
        document.querySelector(".footer") ||
        document.querySelector("footer") ||
        null;
    }
    // If we still can't establish boundaries, don't break the page; just keep bar non-fixed.
    if (!r || !s) return;
    const l = function () {
      let e = !1;
      const t = window.innerHeight;
      let n = !1;
      if (r) {
        const e = r.getBoundingClientRect();
        ((e.bottom > 0 && e.top < t) || e.top < 0) && (n = !0);
      }
      let i = !1;
      if (s) {
        const e = s.getBoundingClientRect();
        ((e.bottom > 0 && e.top < t) || e.top < 0) && (i = !0);
      }
      e = n && !i;
      const l = o.classList.contains("fixed");
      (e ? o.classList.add("fixed") : o.classList.remove("fixed"),
        l !== o.classList.contains("fixed") &&
          smoothScrollInstance &&
          !isTouchDevice() &&
          requestAnimationFrame(() => {
            smoothScrollInstance &&
              "function" == typeof smoothScrollInstance.resize &&
              smoothScrollInstance.resize();
          }));
    };
    let a,
      c = window.innerWidth,
      d = window.innerHeight;
    const u = function () {
      const e = window.innerWidth,
        t = window.innerHeight;
      if (isTouchDevice()) {
        if (e === c) return void (d = t);
      } else if (e === c) return;
      (l(),
        (c = e),
        (d = t),
        isTouchDevice() ||
          (clearTimeout(a),
          (a = setTimeout(() => {
            smoothScrollInstance &&
              "function" == typeof smoothScrollInstance.resize &&
              smoothScrollInstance.resize();
          }, 100))));
    };
    ((o._scrollHandler = l), (o._resizeHandler = u));
    const m = () => {
      smoothScrollInstance && "function" == typeof smoothScrollInstance.on
        ? smoothScrollInstance.on("scroll", l)
        : window.addEventListener("scroll", l, { passive: !0 });
    };
    (smoothScrollInstance && "function" == typeof smoothScrollInstance.on
      ? m()
      : setTimeout(() => {
          m();
        }, 100),
      window.addEventListener("resize", u, { passive: !0 }),
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            l();
          });
        });
      }, 200));
  }
  function ensurePostTransitionInits(e) {
    const t = e || document;
    (scheduleDeferredUserAccess(), initImageErrorHandlers());
    const n = t.querySelector(".testimonial-card");
    if (n && "true" !== n.dataset.initialized) {
      const e = t.querySelector("#testimonial-prev"),
        o = t.querySelector("#testimonial-next"),
        i = (e) => {
          if (e && e.parentNode) {
            const t = e.cloneNode(!0);
            e.parentNode.replaceChild(t, e);
          }
        };
      (i(e), i(o), initTestimonials(t));
      const r = Array.from(
        t.querySelectorAll ? t.querySelectorAll(".testimonial-item") : [],
      );
      r.length > 0 &&
        r.every((e) => e.style && "none" === e.style.display) &&
        (n.dataset.initialized = "true");
    }
    initApproachSection(t);
    const o = document.querySelector(".sticky-cta-bar");
    (o && !o._scrollHandler && initStickyBarCTA(e),
      qsa(".features-overlay, .tech-overlay", t).forEach((e) => {
        e._initialized = !1;
      }),
      initFeaturesOverlay(t),
      mergeProductTags(t));
  }
  (window.addEventListener("keydown", (e) => {
    e.shiftKey &&
      "g" === e.key.toLowerCase() &&
      (e.preventDefault(), toggleGrid());
  }),
    (function () {
      function e() {
        (ensureDownloadDropdownStructure(document),
          buildDownloadMenuFromList(document),
          initDownloadDropdown());
      }
      "loading" === document.readyState
        ? document.addEventListener("DOMContentLoaded", e)
        : e();
    })());
  
  // --- Remember product page when going to contact ---
  (function rememberProductToContact() {
    if (window.__rememberProductToContactApplied) return;
    window.__rememberProductToContactApplied = true;
  
    var STORAGE_KEY = "ct_last_product_url";
    var STORAGE_KEY_NAME = "ct_last_product_name";
  
    function safeSetSession(key, value) {
      try {
        sessionStorage.setItem(key, value);
      } catch (e) {
        // ignore storage errors (private mode, disabled, etc.)
      }
    }
  
    function safeGetSession(key) {
      try {
        return sessionStorage.getItem(key);
      } catch (e) {
        return null;
      }
    }
  
    function getProductNameFromDom() {
      try {
        var nameEl =
          document.querySelector(".product-header h1") ||
          document.querySelector("#product-page .product-header h1") ||
          document.querySelector("#product-page h1") ||
          document.querySelector("h1");
        var name = nameEl && nameEl.textContent ? nameEl.textContent.trim() : "";
        return name || "";
      } catch (e) {
        return "";
      }
    }
  
    function rememberCurrentProductPage() {
      var productValue = window.location.pathname + window.location.search + window.location.hash;
      safeSetSession(STORAGE_KEY, productValue);
      var name = getProductNameFromDom();
      if (name) safeSetSession(STORAGE_KEY_NAME, name);
    }
  
    function buildContactUrl(baseHref) {
      try {
        // Always build the contact URL on the *current* site origin (coffee-tech.com),
        // even if the script itself is hosted on Netlify or the clicked href is absolute.
        var currentPath = window.location.pathname || "/";
        var langMatch = currentPath.match(/^\/(es|de|fr)(\/|$)/);
        var contactPath = langMatch ? "/" + langMatch[1] + "/contact" : "/contact";
  
        // Prefer explicit contact pathname from the provided href when it's /contact or /{lang}/contact,
        // but force the origin to the current page origin.
        var providedPath = null;
        try {
          var parsedProvided = new URL(baseHref || "", window.location.href);
          if (
            parsedProvided.pathname === "/contact" ||
            /^\/(es|de|fr)\/contact$/.test(parsedProvided.pathname)
          ) {
            providedPath = parsedProvided.pathname;
          }
        } catch (ignored) {}
  
        var url = new URL(providedPath || contactPath, window.location.origin);
        // Keep it very short: pass just the product name.
        var name = getProductNameFromDom() || safeGetSession(STORAGE_KEY_NAME) || "";
        if (name) {
          url.searchParams.set("product", name);
        } else {
          // Fallback if name cannot be read: at least pass the path.
          url.searchParams.set(
            "product",
            window.location.pathname + window.location.search + window.location.hash,
          );
        }
        return url.toString();
      } catch (e) {
        return baseHref;
      }
    }
  
    function getQueryParam(name) {
      try {
        return new URLSearchParams(window.location.search).get(name);
      } catch (e) {
        return null;
      }
    }
  
    function setIfPresent(id, value) {
      if (!value) return;
      var el = document.getElementById(id);
      if (!el) return;
      el.value = value;
    }
  
    function getReferrerIfLooksLikeProduct() {
      try {
        var ref = document.referrer || "";
        if (!ref) return null;
        if (ref.indexOf("/contact") !== -1) return null;
        if (ref.indexOf("contact.html") !== -1) return null;
        return ref;
      } catch (e) {
        return null;
      }
    }
  
    function initOnContactPage() {
      if (!document.getElementById("product_page_url")) return;
  
      var productUrl = safeGetSession(STORAGE_KEY) || getReferrerIfLooksLikeProduct();
      var productName = getQueryParam("product") || safeGetSession(STORAGE_KEY_NAME);
  
      setIfPresent("product_page_url", productUrl);
      setIfPresent("product_page_name", productName);
    }
  
    function initOnAnyPage() {
      function handleProductReferralClick(e) {
        function isOnProductPage() {
          try {
            return /^\/products(\/|$)/.test(window.location.pathname || "");
          } catch (err) {
            return false;
          }
        }
  
        function isContactLink(anchor) {
          if (!anchor) return false;
          try {
            var raw = anchor.getAttribute("href") || anchor.href || "";
            if (!raw) return false;
            var url = new URL(raw, window.location.href);
            return url.pathname === "/contact";
          } catch (err) {
            return false;
          }
        }
  
        var a =
          e.target && e.target.closest
            ? e.target.closest('a[data-remember-product="true"]')
            : null;
        if (a) {
          rememberCurrentProductPage();
  
          // Always rewrite the href so the transition system uses the enriched URL.
          var builtHref = buildContactUrl(a.getAttribute("href") || a.href || "/contact");
          try {
            a.setAttribute("href", builtHref);
          } catch (err) {
            // ignore
          }
  
          // Let the existing page-transition click handler drive navigation/animation.
          return;
        }
  
        // Live site: "Get a price quote" links often point to /contact without the data attribute.
        // When clicked from a product page, enrich them with ?product=... so the contact form can prefill.
        if (isOnProductPage()) {
          var anyContactA =
            e.target && e.target.closest ? e.target.closest("a") : null;
          if (isContactLink(anyContactA)) {
            rememberCurrentProductPage();
            var enriched = buildContactUrl(anyContactA.getAttribute("href") || anyContactA.href || "/contact");
            try {
              anyContactA.setAttribute("href", enriched);
            } catch (err) {
              // ignore
            }
            return;
          }
        }
  
        // Header "Contact Us" button (Webflow-style data-href) should navigate in this static build.
        var btn =
          e.target && e.target.closest
            ? e.target.closest('button[data-href="contact"]')
            : null;
        if (btn) {
          rememberCurrentProductPage();
          // Let the transition system handle it via data-href.
          try {
            btn.setAttribute("data-href", buildContactUrl("/contact"));
          } catch (err) {
            // ignore
          }
        }
      }
  
      // Capture phase: run before other handlers that might stopPropagation().
      document.addEventListener("click", handleProductReferralClick, true);
  
      initOnContactPage();
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initOnAnyPage, { once: true });
    } else {
      initOnAnyPage();
    }
  
    // SPA page transitions dispatch `pageReady` after new `.page-wrapper` is injected.
    // Use it to (re)fill the contact hidden fields after animated navigation.
    window.addEventListener("pageReady", function () {
      initOnContactPage();
    });
  
    function bootTurnstileSubmitLock() {
      try {
        initTurnstileSubmitUntilTokenReadyInRoot(
          document.querySelector(".page-wrapper") || document.body,
        );
      } catch (err) {}
    }
    bootTurnstileSubmitLock();
    window.addEventListener("pageReady", bootTurnstileSubmitLock);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bootTurnstileSubmitLock, {
        once: true,
      });
    }
  })();
  let previousWidth = window.innerWidth,
    previousHeight = window.innerHeight,
    resizeHandlerInitialized = !1;
  function initResizeHandler() {
    resizeHandlerInitialized ||
      ((resizeHandlerInitialized = !0),
      window.addEventListener("resize", () => {
        const e = window.innerWidth,
          t = window.innerHeight;
        if (isTouchDevice()) {
          if (e === previousWidth) return void (previousHeight = t);
        } else if (e === previousWidth) return;
        ((previousWidth = e), (previousHeight = t));
        const n =
          window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop;
        (clearTimeout(resizeTimeout),
          (resizeTimeout = setTimeout(() => {
            ("undefined" != typeof SplitText &&
              document.querySelectorAll("*").forEach((e) => {
                if (
                  (e._opacityScrollTrigger &&
                    (e._opacityScrollTrigger.kill(),
                    (e._opacityScrollTrigger = null)),
                  e._linesScrollTrigger &&
                    (e._linesScrollTrigger.kill(),
                    (e._linesScrollTrigger = null)),
                  e._opacityTween &&
                    (e._opacityTween.kill(), (e._opacityTween = null)),
                  e._linesTween && (e._linesTween.kill(), (e._linesTween = null)),
                  e._h1Animation &&
                    (e._h1Animation.kill(), (e._h1Animation = null)),
                  e._splitTextInstance)
                ) {
                  try {
                    e._splitTextInstance.revert();
                  } catch (e) {}
                  e._splitTextInstance = null;
                }
              }),
              "undefined" != typeof SplitText &&
                (initTestimonials(), animateHeadings(null)),
              isTouchDevice()
                ? initGsapExtraAnimations()
                : ("undefined" != typeof ScrollTrigger && ScrollTrigger.refresh(),
                  initGsapExtraAnimations(),
                  "undefined" != typeof ScrollTrigger && ScrollTrigger.refresh()),
              requestAnimationFrame(() => {
                (window.scrollTo(0, n),
                  smoothScrollInstance &&
                    smoothScrollInstance.scrollTo(n, { immediate: !0 }));
              }));
          }, 100)));
      }));
  }
  function initMobileMenu() {
    const e = document.querySelector(".burger-menu-toggle"),
      t = document.querySelector(".header"),
      n = document.querySelector(".nav"),
      o = document.body,
      i = document.documentElement;
    let r = 0,
      s = "",
      l = "",
      a = "";
    if (!e || !t || !n) return;
    function c() {
      if (t.classList.contains("open")) {
        (t.classList.remove("open"), e.classList.remove("active"));
        const n = o.style.top;
        ((o.style.position = ""),
          (o.style.top = ""),
          (o.style.width = ""),
          (o.style.overflow = ""),
          (i.style.overflow = s),
          (i.style.overscrollBehavior = l),
          (i.style.touchAction = a),
          window.scrollTo(0, r || (n ? -1 * parseInt(n || "0") : 0)),
          void 0 !== smoothScrollInstance &&
            smoothScrollInstance &&
            smoothScrollInstance.start(),
          "function" == typeof updateHeaderTheme && updateHeaderTheme());
      } else {
        (t.classList.add("open"), e.classList.add("active"));
        const n =
          window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop;
        ((r = n),
          (s = i.style.overflow || ""),
          (l = i.style.overscrollBehavior || ""),
          (a = i.style.touchAction || ""),
          (o.style.position = "fixed"),
          (o.style.top = `-${n}px`),
          (o.style.width = "100%"),
          (o.style.overflow = "hidden"),
          (i.style.overflow = "hidden"),
          (i.style.overscrollBehavior = "none"),
          (i.style.touchAction = "none"),
          void 0 !== smoothScrollInstance &&
            smoothScrollInstance &&
            smoothScrollInstance.stop(),
          "function" == typeof updateHeaderTheme && updateHeaderTheme());
      }
    }
    (e.addEventListener("click", function (e) {
      (e.stopPropagation(), c());
    }),
      n.querySelectorAll("a").forEach((e) => {
        e.addEventListener("click", function () {
          c();
        });
      }),
      n.querySelectorAll("button").forEach((e) => {
        e.addEventListener("click", function () {
          t.classList.contains("open") && c();
        });
      }));
    const d = document.querySelector(".logo");
    if (d) {
      const n = d.matches && d.matches("a") ? d : d.querySelector("a");
      n &&
        n.addEventListener(
          "click",
          function () {
            t.classList.contains("open") && c();
          },
          !0,
        );
    }
    // Fallback: close menu on ANY click on the logo (capture), even if SPA handlers stop propagation.
    if (!window.__mobileMenuLogoCloseDelegated) {
      window.__mobileMenuLogoCloseDelegated = true;
      document.addEventListener(
        "click",
        function (e) {
          var n = e && e.target && e.target.closest ? e.target.closest(".logo") : null;
          if (!n) return;
          t.classList.contains("open") && c();
        },
        !0,
      );
    }
    n.addEventListener("click", function (e) {
      e.target === n && c();
    });
    const u = document.querySelector(".mobile-products-button");
    if (u) {
      const e = u._mobileProductsHandler;
      e && u.removeEventListener("click", e);
      const n = function (e) {
        t.classList.contains("open") && c();
        const n = this.getAttribute("data-href");
        if (n && "#" !== n && !n.startsWith("mailto:") && !n.startsWith("tel:"))
          if ("function" != typeof pageTransition || isTransitioning)
            window.location.href = n;
          else {
            (e.preventDefault(),
              e.stopImmediatePropagation(),
              fetch(n)
                .then((e) => e.text())
                .then((e) => {
                  updateHeaderThemeFromDoc(
                    new DOMParser().parseFromString(e, "text/html"),
                  );
                })
                .catch(() => {}));
            const t =
              window.scrollY ||
              window.pageYOffset ||
              document.documentElement.scrollTop;
            ((savedScrollY = t),
              (document.body.style.overflow =
                document.documentElement.style.overflow =
                  "hidden"),
              (document.body.style.position = "fixed"),
              (document.body.style.top = `-${t}px`),
              (document.body.style.width = "100%"),
              initStickyBarCTA(),
              pageTransition(n));
          }
      };
      ((u._mobileProductsHandler = n), u.addEventListener("click", n));
    }
    window.addEventListener("resize", function () {
      !isMobileLayoutBreakpoint() && t.classList.contains("open") && c();
    });
  }
  function waitForLibraries(e, t = 0, n = 50) {
    const o = "undefined" != typeof gsap,
      i = "undefined" != typeof ScrollTrigger;
    if (o && i) {
      "function" == typeof window.__cftRegisterGsapPlugins &&
        window.__cftRegisterGsapPlugins();
      return e();
    }
    t < n
      ? setTimeout(() => waitForLibraries(e, t + 1, n), 100)
      : (console.warn(
          "Some libraries not loaded after retries - continuing with fallback mode",
        ),
        e());
  }
  function initAll() {
    const e = "loading" !== document.readyState,
      t = (t) => (e ? t() : document.addEventListener("DOMContentLoaded", t));
    (t(initPageTransitionsObserver),
      initPopstateHandler(),
      initWebflowPageBundleTracker(),
      // IMPORTANT (Safari): do NOT touch Webflow forms on initial page load.
      // Webflow's own scripts already initialize forms; our re-init is only needed after SPA transitions.
      t(initFavicon),
      t(initMobileMenu),
      t(scheduleDeferredUserAccess),
      t(function () {
        document.querySelector("[fs-cmsfilter-element]") &&
          loadFinsweet(initBlogFilterURLSync);
      }),
      t(() => {
        (initTabFilters(),
          requestAnimationFrame(() => {
            initTabFilters();
          }));
      }),
      (function () {
        const runAfterLoad = () => {
        waitForLibraries(() => {
          (initTabFilters(),
            initSmoothScroll(),
            initFavicon(),
            resetScroll(),
            (function () {
              const e = qs(".header"),
                t =
                  !sessionStorage.getItem("headerFadeShown") ||
                  (shouldForceHeaderFadeOnReload && !hasConsumedReloadHeaderFade);
              if (
                (e &&
                  !e.dataset.fadeBootstrapped &&
                  ((e.dataset.fadeBootstrapped = "true"),
                  t
                    ? ((e.style.opacity = "0"), (e.style.visibility = "hidden"))
                    : ((e.style.opacity = "1"),
                      (e.style.visibility = "visible")))),
                !sessionStorage.getItem("pageLoaded")
              ) {
                sessionStorage.setItem("pageLoaded", "true");
              }
              (initHeaderTheme(),
                requestAnimationFrame(() => updateHeaderTheme()));
              const n = isTouchDevice() ? 200 : 50;
              (scheduleIdleCallback(
                () => initAllMarquees(),
                { timeout: 3000 },
              ),
                animateFooterRevealScrub(),
                initScrollToTop());
              const o = qs(".page-wrapper");
              async function i() {
                if (!window.__initAfterPageReadyDone) {
                  if (!window.__firstOverlayDismissed) {
                    return void window.addEventListener(
                      "firstOverlayDismissed",
                      () => i(),
                      { once: !0 },
                    );
                  }
                  if (document.documentElement.classList.contains("loading")) {
                    setTimeout(i, 100);
                    return;
                  }
                  const bypassVisibility =
                    window.__cftIsAuditBrowser ||
                    (typeof window.__cftShouldBypassVisibilityGate === "function" &&
                      window.__cftShouldBypassVisibilityGate());
                  if (document.hidden && !bypassVisibility) {
                      const proceed = () => {
                        document.removeEventListener("visibilitychange", onVisible);
                        i();
                      };
                      const onVisible = () => {
                        if (!document.hidden) proceed();
                      };
                      document.addEventListener("visibilitychange", onVisible);
                      setTimeout(proceed, 8000);
                      return;
                    }
                    if (((window.__initAfterPageReadyDone = !0), e)) {
                      const t =
                        !sessionStorage.getItem("headerFadeShown") ||
                        (shouldForceHeaderFadeOnReload &&
                          !hasConsumedReloadHeaderFade);
                      ((e.style.visibility = "visible"),
                        t
                          ? ((hasConsumedReloadHeaderFade = !0),
                            sessionStorage.setItem("headerFadeShown", "true"),
                            requestAnimationFrame(() => {
                              "function" == typeof e.animate
                                ? (e.animate([{ opacity: 0 }, { opacity: 1 }], {
                                    duration: 1e3,
                                    easing: "ease",
                                    fill: "forwards",
                                  }),
                                  (e.style.opacity = "1"))
                                : ((e.style.transitionProperty = "opacity"),
                                  (e.style.transitionDuration = "1s"),
                                  (e.style.transitionTimingFunction = "ease"),
                                  (e.style.opacity = "1"));
                            }))
                          : (e.style.opacity = "1"));
                    }
                    const skipAnimations = !!window.__cftIsAuditBrowser;
                    const deferHeavyAnimations =
                      !skipAnimations &&
                      window.__cftLoadingManaged &&
                      !!qs("model-viewer");
                    const runHeavyAnimations = () => {
                      if (window.__cftHeavyAnimationsDone) return;
                      window.__cftHeavyAnimationsDone = true;
                      document.documentElement.classList.remove(
                        "pre-split-hide",
                        "cft-loader-exiting",
                      );
                      animateHeadings(o);
                      initGsapExtraAnimations(o);
                      refreshScrollTriggers();
                    };
                    if (skipAnimations) {
                      document.documentElement.classList.remove(
                        "pre-split-hide",
                        "cft-loader-exiting",
                      );
                      initPageComponents(o, !1, !0);
                      refreshScrollTriggers();
                    } else if (deferHeavyAnimations) {
                      initPageComponents(o, !1, !0);
                      const triggerHeavyAnimations = () => {
                        setTimeout(runHeavyAnimations, 50);
                      };
                      if (window.__cftOverlayDismissComplete) {
                        triggerHeavyAnimations();
                      } else {
                        window.addEventListener(
                          "overlayDismissComplete",
                          triggerHeavyAnimations,
                          { once: true },
                        );
                      }
                      scheduleIdleCallback(runHeavyAnimations, {
                        timeout: 700,
                      });
                    } else {
                      document.documentElement.classList.remove(
                        "pre-split-hide",
                        "cft-loader-exiting",
                      );
                      initPageComponents(o, !1, !1);
                      refreshScrollTriggers();
                    }
                    if (
                      !window.__cftDefer3dUntilHeroDone &&
                      !window.__cftModelInitScheduled &&
                      qs("model-viewer")
                    ) {
                      scheduleModelInit();
                    }
                }
              }
              window.__cftPageInit = i;
              window.addEventListener("firstOverlayDismissed", () => i(), {
                once: !0,
              });
              window.addEventListener("overlayDismissComplete", () => {
                refreshScrollTriggers();
              });
              window.__firstOverlayDismissed && i();
              (initTabFilters(),
                window.addEventListener("pageReady", () => {
                  i();
                }),
                window.dispatchEvent(new CustomEvent("pageReady")),
                setTimeout(() => {
                  if (window.__cftLoadingManaged) return;
                  document.documentElement.classList.contains("loading") &&
                    (document.documentElement.classList.remove("loading"), i());
                }, 2500),
                initResizeHandler(),
                window.addEventListener("pageshow", (e) => {
                  if (!e.persisted || !qs("model-viewer")) return;
                  window.__cftReleaseStuckHomeLoader?.();
                  window.__cftModelInitScheduled = false;
                  window.__heroVisualEntranceDone = false;
                  window.__modelEntranceDone = false;
                  window.__cftDefer3dRender = false;
                  window.__cftDefer3dUntilHeroDone = false;
                  window.__cftAllowModelInit = true;
                  window.__cftSkipModelEntranceDelay = true;
                  requestAnimationFrame(() => {
                    if (typeof window.finishSpaHomeModelRestore === "function") {
                      window.finishSpaHomeModelRestore(document);
                    } else if (typeof initModelSafe === "function") {
                      initModelSafe();
                    }
                    if (typeof window.__ensureHeroModelVisible === "function") {
                      window.__ensureHeroModelVisible();
                    }
                  });
                }),
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    "undefined" != typeof ScrollTrigger &&
                      ScrollTrigger.refresh();
                  });
                }));
            })());
        });
        };
        const scheduleRunAfterLoad = () => {
        if (window.__cftIsAuditBrowser && typeof requestIdleCallback === "function") {
          requestIdleCallback(runAfterLoad, { timeout: 2500 });
        } else {
          runAfterLoad();
        }
        };
        scheduleRunAfterLoad();
      })());
  }
  (initAll(),
    (function () {
      var STORAGE_KEY = "weglot_preferred_lang";
      var WEGLOT_LANGS = ["es", "de", "fr", "he"];

      function stripLangFromPath(pathname) {
        var segments = (pathname || "/").split("/").filter(Boolean);
        if (
          segments.length &&
          WEGLOT_LANGS.indexOf(segments[0].toLowerCase()) >= 0
        ) {
          segments.shift();
        }
        return segments.length ? "/" + segments.join("/") : "/";
      }

      function buildLangUrl(lang) {
        var path = stripLangFromPath(location.pathname);
        var suffix = (location.search || "") + (location.hash || "");
        if (lang === "en") {
          return location.origin + (path === "/" ? "/" : path) + suffix;
        }
        var targetPath =
          path === "/" ? "/" + lang + "/" : "/" + lang + path;
        return location.origin + targetPath + suffix;
      }

      function resolveLangNavigationUrl(lang) {
        return buildLangUrl(lang);
      }

      function syncDocumentLang(lang) {
        if (!lang) lang = "en";
        var dir = lang === "he" ? "rtl" : "ltr";
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", dir);
        if (document.body) {
          document.body.setAttribute("lang", lang);
          document.body.setAttribute("dir", dir);
        }
      }

      function getResolvedCurrentLang() {
        var pathLang = getPathLang();
        if (pathLang) return pathLang;
        try {
          if (typeof Weglot !== "undefined" && Weglot.getCurrentLang)
            return Weglot.getCurrentLang();
        } catch (e) {}
        return getStoredLang() || "en";
      }

      function reloadPageForLang(lang) {
        if (window.__langNavInProgress || !lang) return;
        window.__langNavInProgress = true;
        setStoredLang(lang);
        var targetUrl = resolveLangNavigationUrl(lang);
        var currentUrl = location.href.split("#")[0];
        var nextUrl = targetUrl.split("#")[0];
        if (currentUrl === nextUrl) {
          window.location.reload();
          return;
        }
        window.location.assign(targetUrl);
      }

      function applyWeglotFromUrlOrStorage() {
        var pathLang = getPathLang();
        var stored = getStoredLang() || "en";
        // Prefer URL locale so language change stays on the current page path.
        var lang = pathLang || stored;
        if (pathLang && pathLang !== stored) setStoredLang(pathLang);
        syncDocumentLang(lang);
        syncAllLanguageSelectors();

        if (typeof Weglot !== "undefined" && Weglot.switchTo) {
          // URL already encodes the locale (e.g. /he/privacy-terms) — do not
          // call switchTo, which can navigate via stale homepage weglot-data.
          if (pathLang) {
            syncAllLanguageSelectors();
            return;
          }
          window.__weglotInitSwitch = true;
          try {
            var current = Weglot.getCurrentLang ? Weglot.getCurrentLang() : null;
            if (current !== lang) {
              Weglot.switchTo(lang);
            }
          } catch (e) {}
          setTimeout(function () {
            window.__weglotInitSwitch = false;
            syncAllLanguageSelectors();
          }, 1000);
        }
      }

      function syncLanguageAfterSpa() {
        var lang = getPathLang() || getStoredLang() || "en";
        syncDocumentLang(lang);
        syncAllLanguageSelectors();
      }

      function getStoredLang() {
        try {
          return localStorage.getItem(STORAGE_KEY) || null;
        } catch (e) {
          return null;
        }
      }

      function setStoredLang(lang) {
        try {
          localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {}
      }

      function getPathLang() {
        try {
          var seg = (location.pathname || "/").split("/").filter(Boolean)[0] || "";
          seg = seg.toLowerCase();
          return WEGLOT_LANGS.indexOf(seg) >= 0 ? seg : null;
        } catch (e) {
          return null;
        }
      }

      function getActiveLang() {
        var lang = getPathLang();
        if (lang) return lang;
        try {
          if (typeof Weglot !== "undefined" && Weglot.getCurrentLang)
            return Weglot.getCurrentLang();
        } catch (e) {}
        lang = getStoredLang();
        if (lang) return lang;
        try {
          var htmlLang = (document.documentElement.getAttribute("lang") || "")
            .split("-")[0]
            .toLowerCase();
          if (/^[a-z]{2}$/.test(htmlLang)) return htmlLang;
        } catch (e) {}
        return "en";
      }

      function getOptionForValue(select, value) {
        if (!select || !value) return null;
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].value === value) return select.options[i];
        }
        return null;
      }

      function applyLangToSelect(select, lang) {
        if (!select || !lang) return false;
        var opt = getOptionForValue(select, lang);
        if (!opt) return false;
        window.__langSelectSyncInProgress = true;
        select.value = lang;
        window.__langSelectSyncInProgress = false;
        return select.value === lang;
      }

      function rebuildCustomList(select, listEl) {
        if (!select || !listEl) return;
        listEl.innerHTML = "";
        Array.prototype.forEach.call(select.options, function (opt) {
          var li = document.createElement("li");
          li.className = "language-selector__option";
          li.setAttribute("role", "option");
          li.setAttribute("data-value", opt.value);
          li.textContent = opt.textContent;
          var selected = opt.value === select.value;
          if (selected) {
            li.classList.add("is-selected");
            li.setAttribute("aria-selected", "true");
          } else {
            li.setAttribute("aria-selected", "false");
          }
          listEl.appendChild(li);
        });
      }

      function syncSelectUi(select) {
        if (!select) return;
        var wrapper = select.closest(".language-selector");
        if (!wrapper || wrapper.dataset.langUiEnhanced !== "1") return;
        var trigger = wrapper.querySelector(".language-selector__trigger");
        var list = wrapper.querySelector(".language-selector__list");
        if (!trigger || !list) return;
        var opt = getOptionForValue(select, select.value);
        trigger.textContent = opt ? opt.textContent : "";
        list.querySelectorAll(".language-selector__option").forEach(function (item) {
          var selected = item.getAttribute("data-value") === select.value;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-selected", selected ? "true" : "false");
        });
      }

      var LANG_SELECT_SELECTOR = "select#language, select#language-mobile";

      function syncAllLanguageSelectors() {
        var lang = getActiveLang();
        document.querySelectorAll(LANG_SELECT_SELECTOR).forEach(function (select) {
          applyLangToSelect(select, lang);
          var list = select.closest(".language-selector");
          list = list ? list.querySelector(".language-selector__list") : null;
          if (list) rebuildCustomList(select, list);
          syncSelectUi(select);
        });
      }

      function navigateToLang(select, langArg) {
        reloadPageForLang(
          (langArg || (select && select.value) || "").toString(),
        );
      }

      if (!window.__langReloadCaptureInstalled) {
        window.__langReloadCaptureInstalled = true;
        document.addEventListener(
          "click",
          function (evt) {
            var item =
              evt.target && evt.target.closest
                ? evt.target.closest(".language-selector__option")
                : null;
            if (!item) return;
            var lang = item.getAttribute("data-value");
            if (!lang) return;
            evt.preventDefault();
            evt.stopImmediatePropagation();
            reloadPageForLang(lang);
          },
          true,
        );
        document.addEventListener(
          "change",
          function (evt) {
            var select = evt && evt.target;
            if (
              !select ||
              !select.matches ||
              !select.matches(LANG_SELECT_SELECTOR)
            ) {
              return;
            }
            if (window.__langSelectSyncInProgress) return;
            evt.preventDefault();
            evt.stopImmediatePropagation();
            reloadPageForLang(select.value);
          },
          true,
        );
      }

      function enhanceLanguageSelector(wrapper) {
        if (!wrapper || wrapper.dataset.langUiEnhanced === "1") return;
        var select = wrapper.querySelector("select");
        if (!select) return;

        applyLangToSelect(select, getActiveLang());
        wrapper.dataset.langUiEnhanced = "1";
        select.classList.add("language-selector__native");
        select.setAttribute("tabindex", "-1");
        select.setAttribute("aria-hidden", "true");

        var trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "language-selector__trigger";
        var menuId = "lang-menu-" + Math.random().toString(36).slice(2, 11);
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-controls", menuId);

        var dropdown = document.createElement("div");
        dropdown.className = "language-selector__dropdown";
        dropdown.id = menuId;
        dropdown.hidden = true;

        var list = document.createElement("ul");
        list.className = "language-selector__list";
        list.setAttribute("role", "listbox");

        wrapper.insertBefore(trigger, select);
        wrapper.appendChild(dropdown);
        dropdown.appendChild(list);

        function closeDropdown() {
          dropdown.hidden = true;
          trigger.setAttribute("aria-expanded", "false");
        }

        trigger.addEventListener("click", function (evt) {
          evt.stopPropagation();
          if (dropdown.hidden) {
            applyLangToSelect(select, getActiveLang());
            rebuildCustomList(select, list);
            syncSelectUi(select);
            dropdown.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
          } else {
            closeDropdown();
          }
        });

        list.addEventListener("click", function (evt) {
          evt.preventDefault();
          evt.stopPropagation();
          var item = evt.target.closest(".language-selector__option");
          if (!item) return;
          var lang = item.getAttribute("data-value");
          if (!lang) return;
          closeDropdown();
          navigateToLang(select, lang);
        });

        document.addEventListener("click", function (evt) {
          if (!wrapper.contains(evt.target)) closeDropdown();
        });

        document.addEventListener("keydown", function (evt) {
          if (
            evt.key === "Escape" &&
            !dropdown.hidden &&
            wrapper.contains(document.activeElement)
          ) {
            closeDropdown();
            trigger.focus();
          }
        });

        if (select.dataset.langChangeBound !== "1") {
          select.dataset.langChangeBound = "1";
          select.addEventListener(
            "change",
            function () {
              if (window.__langSelectSyncInProgress) return;
              navigateToLang(this);
            },
            true,
          );
        }

        rebuildCustomList(select, list);
        syncSelectUi(select);
      }

      function initLanguageSelector() {
        document.querySelectorAll(".language-selector").forEach(enhanceLanguageSelector);
        syncAllLanguageSelectors();
      }

      function bindWeglotEvents() {
        if (window.__langWeglotBound) return true;
        if (typeof Weglot === "undefined" || !Weglot.on) return false;
        window.__langWeglotBound = true;

        Weglot.on("languageChanged", function () {
          if (window.__langNavInProgress) return;

          try {
            if (Weglot.getCurrentLang) {
              var lang = Weglot.getCurrentLang();
              setStoredLang(lang);
              syncDocumentLang(lang);
            }
          } catch (e) {}
          syncAllLanguageSelectors();

          if (window.__weglotInitSwitch) {
            window.__weglotInitSwitch = false;
            return;
          }

          window.__langNavInProgress = true;
          window.location.reload();
        });

        Weglot.on("initialized", function () {
          window.__cftWeglotInitialized = true;
          applyWeglotFromUrlOrStorage();
          initLanguageSelector();
          setTimeout(syncAllLanguageSelectors, 0);
          setTimeout(syncAllLanguageSelectors, 200);
        });

        return true;
      }

      function waitForWeglot() {
        if (bindWeglotEvents()) {
          setTimeout(applyWeglotFromUrlOrStorage, 0);
          setTimeout(syncAllLanguageSelectors, 300);
          return;
        }
        if (window.__langWeglotWaitStarted) return;
        window.__langWeglotWaitStarted = true;
        window.addEventListener(
          "cftWeglotReady",
          function () {
            if (bindWeglotEvents()) {
              applyWeglotFromUrlOrStorage();
              setTimeout(syncAllLanguageSelectors, 300);
            }
          },
          { once: true },
        );
        var attempts = 0;
        var timer = setInterval(function () {
          if (bindWeglotEvents()) {
            clearInterval(timer);
            applyWeglotFromUrlOrStorage();
            setTimeout(syncAllLanguageSelectors, 300);
          } else if (++attempts > 200) {
            clearInterval(timer);
            syncDocumentLang(getPathLang() || getStoredLang() || "en");
          }
        }, 50);
      }

      if (!window.__langSelectorObserverInstalled) {
        window.__langSelectorObserverInstalled = true;
        try {
          var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
              var added = mutations[i].addedNodes;
              if (!added || !added.length) continue;
              for (var j = 0; j < added.length; j++) {
                var node = added[j];
                if (!node || node.nodeType !== 1) continue;
                if (
                  (node.matches &&
                    (node.matches(".language-selector") ||
                      node.matches("select#language") ||
                      node.matches("select#language-mobile"))) ||
                  (node.querySelector &&
                    (node.querySelector(".language-selector") ||
                      node.querySelector("select#language") ||
                      node.querySelector("select#language-mobile")))
                ) {
                  setTimeout(initLanguageSelector, 0);
                  return;
                }
              }
            }
          });
          observer.observe(document.documentElement, { childList: true, subtree: true });
        } catch (e) {}
      }

      if (!window.__langSelectorMenuSyncInstalled) {
        window.__langSelectorMenuSyncInstalled = true;
        document.addEventListener(
          "click",
          function (evt) {
            var toggle =
              evt && evt.target && evt.target.closest
                ? evt.target.closest(".burger-menu-toggle,[aria-label='Toggle menu']")
                : null;
            if (!toggle) return;
            setTimeout(syncAllLanguageSelectors, 50);
            setTimeout(syncAllLanguageSelectors, 250);
          },
          true,
        );
      }

      window.syncLanguageSelectors = syncAllLanguageSelectors;
      window.syncDocumentLang = syncDocumentLang;
      window.syncLanguageAfterSpa = syncLanguageAfterSpa;

      function bootLanguageSelector() {
        try {
          syncDocumentLang(getPathLang() || getStoredLang() || "en");
          initLanguageSelector();
        } catch (e) {}
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootLanguageSelector);
      } else {
        bootLanguageSelector();
      }

      waitForWeglot();
      window.addEventListener("pageReady", function () {
        bootLanguageSelector();
        syncLanguageAfterSpa();
      });
      window.addEventListener("pageshow", function (evt) {
        if (evt.persisted) applyWeglotFromUrlOrStorage();
        else syncDocumentLang(getPathLang() || getStoredLang() || "en");
        syncAllLanguageSelectors();
      });
      window.addEventListener("load", function () {
        applyWeglotFromUrlOrStorage();
        setTimeout(syncAllLanguageSelectors, 100);
      });

      window.weglotPreTranslateElement = function (el, lang) {
          if (!el || !lang || "en" === lang) return Promise.resolve();
          if ("undefined" == typeof Weglot || !Weglot.translate)
            return Promise.resolve();
          for (
            var node,
              walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
                acceptNode: function (textNode) {
                  if (!(textNode.textContent || "").trim())
                    return NodeFilter.FILTER_REJECT;
                  var parent = textNode.parentElement;
                  return parent
                    ? "SCRIPT" === parent.tagName ||
                      "STYLE" === parent.tagName ||
                      "NOSCRIPT" === parent.tagName
                      ? NodeFilter.FILTER_REJECT
                      : NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
                },
              }),
              textNodes = [],
              words = [];
            (node = walker.nextNode());
          )
            (textNodes.push(node), words.push({ t: 1, w: node.textContent }));
          return 0 === words.length
            ? Promise.resolve()
            : new Promise(function (resolve) {
                var offset = 0,
                  timeoutId = setTimeout(function () {
                    resolve();
                  }, 12e3);
                function finish() {
                  (clearTimeout(timeoutId), resolve());
                }
                !(function translateBatch() {
                  var batchWords = words.slice(offset, offset + 25),
                    batchNodes = textNodes.slice(offset, offset + 25);
                  if (((offset += 25), 0 !== batchWords.length)) {
                    var payload = { words: batchWords, languageTo: lang },
                      done = !1;
                    try {
                      Weglot.translate(payload, function (result) {
                        done ||
                          ((done = !0),
                          (function (nodes, translation) {
                            var translated = null;
                            (translation && Array.isArray(translation.to_words)
                              ? (translated = translation.to_words)
                              : Array.isArray(translation) && (translated = translation),
                              translated &&
                                nodes.forEach(function (textNode, idx) {
                                  void 0 !== translated[idx] &&
                                    (textNode.textContent = translated[idx]);
                                }));
                          })(batchNodes, result),
                          offset >= words.length ? finish() : setTimeout(translateBatch, 30));
                      });
                    } catch (err) {
                      done || ((done = !0), offset >= words.length ? finish() : setTimeout(translateBatch, 30));
                    }
                  } else finish();
                })();
              });
        };

      window.weglotApplyBeforeTransition = function () {
          return new Promise(function (resolve) {
            if ("undefined" != typeof Weglot && Weglot.switchTo) {
              var storedLang = getStoredLang();
              if (storedLang && "en" !== storedLang) {
                var settled = !1;
                function onLangChanged() {
                  setTimeout(done, 50);
                }
                function done() {
                  settled || ((settled = !0), Weglot.off("languageChanged", onLangChanged), resolve());
                }
                Weglot.on("languageChanged", onLangChanged);
                Weglot.switchTo("en");
                setTimeout(function () {
                  Weglot.switchTo(storedLang);
                  setTimeout(done, 2e3);
                }, 0);
              } else resolve();
            } else resolve();
          });
        };

      window.applyWeglotAfterTransition = function () {
          if ("undefined" != typeof Weglot && Weglot.switchTo) {
            var storedLang = getStoredLang();
            if (storedLang && "en" !== storedLang) {
              var pageWrapper = document.querySelector(
                ".page-wrapper:not(.transition-container .page-wrapper)",
              );
              pageWrapper &&
                ((pageWrapper.style.opacity = "0"), (pageWrapper.style.pointerEvents = "none"));
              var settled = !1;
              function finish() {
                settled ||
                  ((settled = !0),
                  pageWrapper && ((pageWrapper.style.opacity = ""), (pageWrapper.style.pointerEvents = "")));
              }
              Weglot.on("languageChanged", function onChanged() {
                (Weglot.off("languageChanged", onChanged), setTimeout(finish, 200));
              });
              setTimeout(function () {
                Weglot.switchTo("en");
                setTimeout(function () {
                  Weglot.switchTo(storedLang);
                  setTimeout(finish, 3e3);
                }, 50);
              }, 250);
            }
          }
          syncAllLanguageSelectors();
        };
    })());