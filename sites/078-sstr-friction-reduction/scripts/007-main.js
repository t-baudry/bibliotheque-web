(function () {
  "use strict";
  // Reveal-init запускаем СРАЗУ при загрузке main.js, не дожидаясь async-импорта
  // Lenis (~200-500ms) из CDN. GSAP + SplitText уже загружены инлайн в head,
  // ждать нечего. Раньше reveal init был внутри `await Lenis` цепочки → блик
  // «текст → плашка → reveal» из-за задержки. Теперь reveal стартует
  // параллельно с импортом Lenis, layout-flash сильно меньше.
  function bootReveal() {
    if (typeof window.gsap === "undefined" || typeof window.SplitText === "undefined") return;
    if (typeof window.ScrollTrigger === "undefined") return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.registerPlugin(window.SplitText);
    initHighlightMarkerTextRevealEarly();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(bootReveal);
      } else {
        bootReveal();
      }
    });
  } else if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(bootReveal);
  } else {
    bootReveal();
  }
  function initHighlightMarkerTextRevealEarly() {
    document.querySelectorAll("h1.heading_h1, .inner-hero_heading-container p").forEach((el) => {
      if (el.hasAttribute("data-anim")) return;
      if (el.hasAttribute("data-highlight-marker-reveal")) return;
      el.setAttribute("data-highlight-marker-reveal", "");
    });
    const defaults = {
      direction: "up",
      theme: "brand",
      scrollStart: "top 90%",
      staggerStart: "start",
      stagger: 100,
      barDuration: 0.78,
      barEase: "power3.inOut",
    };
    const colorMap = {
      brand:
        getComputedStyle(document.body).getPropertyValue("--mapped-surface-action").trim() ||
        "#fe5b2a",
      white: "#FFFFFF",
    };
    const directionMap = {
      right: { prop: "scaleX", origin: "right center" },
      left: { prop: "scaleX", origin: "left center" },
      up: { prop: "scaleY", origin: "center top" },
      down: { prop: "scaleY", origin: "center bottom" },
    };
    function resolveColor(value) {
      if (colorMap[value]) return colorMap[value];
      if (value.startsWith("--")) {
        return getComputedStyle(document.body).getPropertyValue(value).trim() || value;
      }
      return value;
    }
    function createBar(color, origin) {
      const bar = document.createElement("div");
      bar.className = "highlight-marker-bar";
      bar.style.backgroundColor = color;
      bar.style.transformOrigin = origin;
      return bar;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document.querySelectorAll("[data-highlight-marker-reveal]").forEach((el) => {
        window.gsap.set(el, { autoAlpha: 1 });
      });
      return;
    }
    const elements = document.querySelectorAll("[data-highlight-marker-reveal]");
    if (!elements.length) return;
    setTimeout(() => {
      document.querySelectorAll("h1.heading_h1, .inner-hero_heading-container p").forEach((h) => {
        if (getComputedStyle(h).visibility === "hidden") h.style.visibility = "visible";
      });
    }, 4e3);
    elements.forEach((el) => {
      if (el.__highlightMarkerReveal) return;
      // Если CSS fallback-анимация уже показала элемент (slow 4G, JS опоздал
      // на > 2c) — не запускаем reveal: текст уже виден, бары поверх дадут
      // некрасивый flash.
      if (getComputedStyle(el).visibility === "visible") return;
      el.__highlightMarkerReveal = {};
      const direction = el.getAttribute("data-marker-direction") || defaults.direction;
      const theme = el.getAttribute("data-marker-theme") || defaults.theme;
      const scrollStart = el.getAttribute("data-marker-scroll-start") || defaults.scrollStart;
      const staggerStart = el.getAttribute("data-marker-stagger-start") || defaults.staggerStart;
      const staggerOffset =
        (parseFloat(el.getAttribute("data-marker-stagger")) || defaults.stagger) / 1000;
      const color = resolveColor(theme);
      const dirConfig = directionMap[direction] || directionMap.right;
      const split = new window.SplitText(el, {
        type: "lines",
        linesClass: "highlight-marker-line",
      });
      const lines = split.lines;
      const tl = window.gsap.timeline({ paused: true });
      lines.forEach((line, i) => {
        window.gsap.set(line, { position: "relative", overflow: "hidden" });
        const bar = createBar(color, dirConfig.origin);
        line.appendChild(bar);
        const staggerIndex = staggerStart === "end" ? lines.length - 1 - i : i;
        tl.to(
          bar,
          {
            [dirConfig.prop]: 0,
            duration: defaults.barDuration,
            ease: defaults.barEase,
          },
          staggerIndex * staggerOffset
        );
      });
      window.gsap.set(el, { autoAlpha: 1 });
      const st = window.ScrollTrigger.create({
        trigger: el,
        start: scrollStart,
        once: true,
        onEnter: () => tl.play(),
      });
      el.__highlightMarkerReveal.split = split;
      el.__highlightMarkerReveal.timeline = tl;
      el.__highlightMarkerReveal.scrollTrigger = st;
    });
  }
  (async () => {
    // Lenis self-hosted ESM (RU infra) — import с локального /vendor/. Lenis CSS
    // подключен через <link> в Base.astro (head), не нужно injectить тут.
    const Lenis = (await import("/vendor/lenis.min.js")).default;
    const has = {
      gsap: typeof window.gsap !== "undefined",
      ScrollTrigger: typeof window.ScrollTrigger !== "undefined",
      CustomEase: typeof window.CustomEase !== "undefined",
      Webflow: typeof window.Webflow !== "undefined",
    };
    const CARD_EASE = has.CustomEase ? "cctpOut" : "power3.out";
    function initLenis() {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      window.__lenis = lenis;
      if (has.gsap && has.ScrollTrigger) {
        // Мобильные браузеры схлопывают/разворачивают адресную строку ПРИ СКРОЛЛЕ
        // → resize → встроенный авто-refresh ScrollTrigger ПОСРЕДИ скролла →
        // вертикальное «дёргание» при ПЕРВОМ входе в pinned/lock-секцию (второй
        // раз бар уже схлопнут — не дёргает). Канонический фикс GSAP.
        ScrollTrigger.config({ ignoreMobileResize: true });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1e3));
        gsap.ticker.lagSmoothing(0);
        installScrollTriggerRefreshGuards(lenis);
      } else {
        let raf = function (time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
      return lenis;
    }
    function installScrollTriggerRefreshGuards(lenis) {
      // ScrollTrigger считает start/end один раз при init по текущей
      // document.height. Lazy images меняют height post-init → positions
      // становятся stale → анимации не срабатывают на первой загрузке.
      // Источник паттерна: smile_gallery scroll-trigger-fixes, FIX 1.
      //
      // КРИТИЧЕСКИ: refresh() запускаем ТОЛЬКО когда юзер НЕ скроллит.
      // Иначе во время активного scroll refresh прерывает Lenis-tween,
      // пересчёт start/end сбивает позицию → видимое «дёргание».
      // Pending-флаг копит запросы пока scroll активен, flush при idle.
      let isScrolling = false;
      let scrollIdleTimer;
      let pendingRefresh = false;
      let refreshDebounce;
      lenis.on("scroll", () => {
        isScrolling = true;
        clearTimeout(scrollIdleTimer);
        scrollIdleTimer = setTimeout(() => {
          isScrolling = false;
          if (pendingRefresh) doRefresh();
        }, 300);
      });
      function doRefresh() {
        pendingRefresh = false;
        if (lenis && typeof lenis.resize === "function") lenis.resize();
        ScrollTrigger.refresh();
      }
      function scheduleRefresh() {
        clearTimeout(refreshDebounce);
        refreshDebounce = setTimeout(() => {
          if (isScrolling) {
            pendingRefresh = true;
          } else {
            doRefresh();
          }
        }, 200);
      }
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        if (img.complete && img.naturalHeight > 0) return;
        img.addEventListener("load", scheduleRefresh, { once: true });
        img.addEventListener("error", scheduleRefresh, { once: true });
      });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleRefresh);
      }
      window.addEventListener("load", scheduleRefresh, { once: true });
    }
    function initPageAnimations() {
      // Прелоадер — первым, ДО gsap-guard (его внутренний skip снимает оверлей
      // даже без gsap, иначе главная осталась бы навсегда перекрыта).
      initPreloader();
      if (!has.gsap) {
        return;
      }
      initButtonHover();
      initScrollCardShapes();
      initGlobalParallax();
      initHeroScrollDarken();
      initScrollTextFill();
      initScroller();
      // mapbox-gl.{js,css} ленятся через loadMapboxIfNeeded — подгружаются
      // только когда .section_globe приближается к viewport (rootMargin 100vh).
      // На страницах без глобуса (privacy, contacts, products listing итд) —
      // экономия ~1.6 MB JS.
      loadMapboxIfNeeded();
      loadWebglIfNeeded();
      initFooterParallax();
      initGlobeScrollRefresh();
      initCaseCardHover();
      initClickToZoomBasic();
      initForms();
      initNavContactScroll();
      initMobileMenu();
      initSectionReveal();
      initFeatureListReveal();
      initImageSlider();
      initNumberOdometer();
      // initHighlightMarkerTextReveal вызывается на раннем этапе (bootReveal
      //  выше IIFE), не дожидаясь async-импорта Lenis. Здесь не дублируем.
    }
    function initSectionReveal() {
      // Scroll-reveal для секций через IntersectionObserver + CSS-класс
      // is-revealed. Элементы появляются по opacity (без сдвига) с stagger
      // в READING ORDER: сортировка по rect.top (rows) → rect.left (cols
      // в строке). Триггер позже (rootMargin -25%), чтобы юзер успевал
      // поймать анимацию глазом.
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = [];
      document.querySelectorAll("section").forEach((section) => {
        if (section.__sectionRevealInit) return;
        section.__sectionRevealInit = true;
        // Targets: heading-блок + потенциальные колонки/строки внутри.
        // Покрывает SectionHeading, InnerHero, content-grid (любой Grid).
        // feature-list обрабатывается ОТДЕЛЬНО (initFeatureListReveal) — по
        // входу САМОГО списка в вьюпорт, а не секции: в высоких секциях
        // (ProductCard, TaskList) список лежит глубоко, и section-триггер
        // раскрывал бы его за экраном → анимация не видна.
        const candidates = section.querySelectorAll(
          [".heading_container", ".inner-hero_heading-container", ".content-grid > *"].join(", ")
        );
        if (!candidates.length) return;
        // Сортировка в reading order (rows top→bottom, cols left→right
        // внутри строки). Threshold 5px чтобы элементы в одной строке
        // не подменяли друг друга на разные rows.
        const sorted = Array.from(candidates).sort((a, b) => {
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          const dy = ra.top - rb.top;
          if (Math.abs(dy) > 5) return dy;
          return ra.left - rb.left;
        });
        const stagger = sorted.length > 6 ? 0.05 : 0.08;
        // Стандартный stagger — никакого base-delay logic тут. Bump для Barba
        // arrival делается отдельно в bumpSectionRevealDelayForBarba() ПОСЛЕ
        // initSectionReveal завершится (см. resetPageAfterTransition).
        sorted.forEach((el, i) => {
          el.classList.add("section-reveal");
          el.style.transitionDelay = i * stagger + "s";
        });
        targets.push({ section, items: sorted });
      });
      if (!targets.length) return;
      const reveal = (entryTarget) => {
        const found = targets.find((t) => t.section === entryTarget);
        if (!found) return;
        // Double rAF — браузер успевает paint .section-reveal initial state
        // (opacity:0) ДО того как добавляем .is-revealed (opacity:1). Без
        // этого — обе class в одном tick → no transition → delay игнорируется.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            found.items.forEach((el) => el.classList.add("is-revealed"));
          });
        });
      };
      if (reduceMotion) {
        targets.forEach(({ section }) => reveal(section));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            reveal(entry.target);
          });
        },
        { rootMargin: "0px 0px -25% 0px" }
      );
      targets.forEach(({ section }) => {
        const rect = section.getBoundingClientRect();
        // Immediate reveal для секций уже в/выше viewport на момент init.
        if (rect.bottom < window.innerHeight * 0.75) {
          reveal(section);
        } else {
          io.observe(section);
        }
      });
    }
    function initFeatureListReveal() {
      // Каждый <ul.feature-list> раскрывается ПО ВХОДУ САМОГО СПИСКА в вьюпорт
      // (свой IntersectionObserver), а не по входу секции — иначе в высоких
      // секциях (ProductCard 3300px, TaskList) список лежит глубоко и
      // section-триггер раскрывал бы его за экраном (анимация не видна).
      // Тот же CSS (.section-reveal/.is-revealed) + stagger что в секциях.
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelectorAll(".feature-list").forEach((list) => {
        if (list.__featureListRevealInit) return;
        list.__featureListRevealInit = true;
        const items = Array.from(list.querySelectorAll(".feature-list_item"));
        if (!items.length) return;
        const stagger = items.length > 6 ? 0.05 : 0.08;
        items.forEach((el, i) => {
          el.classList.add("section-reveal");
          el.style.transitionDelay = i * stagger + "s";
        });
        const reveal = () => {
          // Double rAF — браузер успевает paint opacity:0 ДО is-revealed,
          // иначе обе class в одном tick → no transition (как в initSectionReveal).
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              items.forEach((el) => el.classList.add("is-revealed"));
            });
          });
        };
        if (reduceMotion) {
          reveal();
          return;
        }
        const rect = list.getBoundingClientRect();
        if (rect.bottom < window.innerHeight * 0.75) {
          reveal();
        } else {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                io.unobserve(entry.target);
                reveal();
              });
            },
            { rootMargin: "0px 0px -25% 0px" }
          );
          io.observe(list);
        }
      });
    }
    function initImageSlider() {
      // Osmo Parallax Image Gallery — упрощённая версия: navigation ТОЛЬКО
      // по клику на thumbs. Wheel/touch/pointer drag убраны (юзер просит
      // не перехватывать скролл страницы внутри slider). Observer plugin
      // отсюда удалён — не нужен.
      if (!has.gsap) return;
      if (typeof window.CustomEase !== "undefined" && !CustomEase.get("productSliderWipe")) {
        CustomEase.create("productSliderWipe", "0.6, 0.08, 0.02, 0.99");
      }
      document.querySelectorAll('[data-slideshow="wrap"]').forEach((wrap) => {
        if (wrap.__imageSliderInit) return;
        wrap.__imageSliderInit = true;
        const ui = {
          el: wrap,
          slides: Array.from(wrap.querySelectorAll('[data-slideshow="slide"]')),
          inner: Array.from(wrap.querySelectorAll('[data-slideshow="parallax"]')),
          thumbs: Array.from(wrap.querySelectorAll('[data-slideshow="thumb"]')),
        };
        let current = 0;
        let animating = false;
        const animationDuration = 0.9;
        ui.slides.forEach((s, i) => s.setAttribute("data-index", i));
        ui.thumbs.forEach((t, i) => t.setAttribute("data-index", i));
        function navigate(direction, targetIndex) {
          if (animating) return;
          animating = true;
          const previous = current;
          current = targetIndex;
          const currentSlide = ui.slides[previous];
          const currentInner = ui.inner[previous];
          const upcomingSlide = ui.slides[current];
          const upcomingInner = ui.inner[current];
          gsap
            .timeline({
              defaults: { duration: animationDuration, ease: "productSliderWipe" },
              onStart: () => {
                upcomingSlide.classList.add("is--current");
                ui.thumbs[previous].classList.remove("is--current");
                ui.thumbs[current].classList.add("is--current");
              },
              onComplete: () => {
                currentSlide.classList.remove("is--current");
                animating = false;
              },
            })
            .to(currentSlide, { xPercent: -direction * 100 }, 0)
            .to(currentInner, { xPercent: direction * 50 }, 0)
            .fromTo(upcomingSlide, { xPercent: direction * 100 }, { xPercent: 0 }, 0)
            .fromTo(upcomingInner, { xPercent: -direction * 50 }, { xPercent: 0 }, 0);
        }
        function onClick(e) {
          const targetIndex = parseInt(e.currentTarget.getAttribute("data-index"), 10);
          if (targetIndex === current || animating) return;
          const direction = targetIndex > current ? 1 : -1;
          navigate(direction, targetIndex);
        }
        ui.thumbs.forEach((thumb) => thumb.addEventListener("click", onClick));
      });
    }
    // Number Odometer — rolling-digit reveal на scroll. Логика/изинги/тайминги
    // из сниппета БЕЗ изменений. Адаптации под проект: (1) инициализация из
    // initPageAnimations (cold + Barba re-init) вместо своего DOMContentLoaded —
    // init-флаг группы делает повторные вызовы безопасными; (2) resize-листенер
    // в одноразовом guard, чтобы не копился на каждый Barba-переход.
    function initNumberOdometer() {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const initFlag = "data-odometer-initialized";
      const activeTweens = new WeakMap();

      // Configuration
      const defaults = {
        duration: 1,
        ease: "power3.out",
        elementStagger: 0.1,
        digitStagger: 0.04,
        revealDuration: 0.5,
        revealEase: "power2.out",
        triggerStart: "top 80%",
        staggerOrder: "left",
        digitCycles: 2,
      };

      // Scroll-triggered groups
      document.querySelectorAll("[data-odometer-group]").forEach((group) => {
        if (group.hasAttribute(initFlag)) return;
        group.setAttribute(initFlag, "");

        const elements = Array.from(group.querySelectorAll("[data-odometer-element]"));
        if (!elements.length || prefersReducedMotion) return;

        const staggerOrder =
          group.getAttribute("data-odometer-stagger-order") || defaults.staggerOrder;
        const triggerStart =
          group.getAttribute("data-odometer-trigger-start") || defaults.triggerStart;
        const elementStagger =
          parseFloat(group.getAttribute("data-odometer-stagger")) || defaults.elementStagger;

        const elementData = elements.map((el) => {
          const originalText = el.textContent.trim();
          const hasExplicitStart = el.hasAttribute("data-odometer-start");
          const startValue = parseFloat(el.getAttribute("data-odometer-start")) || 0;
          const duration =
            parseFloat(el.getAttribute("data-odometer-duration")) || defaults.duration;
          const step = getLineHeightRatio(el);

          let segments = parseSegments(originalText);
          segments = mapStartDigits(segments, startValue);
          segments = markHiddenSegments(segments, startValue);

          const grow = shouldGrow(el, hasExplicitStart, startValue, segments);
          const { rollers, revealEls } = buildRollerDOM(el, segments, step, grow);

          const fontSize = parseFloat(getComputedStyle(el).fontSize);
          const revealData = revealEls.map((revealEl) => {
            const widthEm = revealEl.offsetWidth / fontSize;
            gsap.set(revealEl, { width: 0, overflow: "hidden" });
            return { el: revealEl, widthEm };
          });

          return { el, rollers, duration, step, revealData, originalText };
        });

        const ordered = applyStaggerOrder(elementData, staggerOrder);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: triggerStart,
            once: true,
          },
          onComplete() {
            elementData.forEach(({ el, originalText, step }) => {
              cleanupElement(el, originalText);
            });
          },
        });

        ordered.forEach((data, orderIdx) => {
          const { rollers, duration, step, revealData } = data;
          const offset = orderIdx * elementStagger;

          revealData.forEach(({ el, widthEm }) => {
            tl.to(
              el,
              {
                width: widthEm + "em",
                opacity: 1,
                duration: defaults.revealDuration,
                ease: defaults.revealEase,
              },
              offset
            );
          });

          rollers.forEach(({ roller, targetPos }, digitIdx) => {
            const reversedIdx = rollers.length - 1 - digitIdx;
            tl.to(
              roller,
              {
                y: -targetPos * step + "em",
                duration,
                ease: defaults.ease,
                force3D: true,
              },
              offset + reversedIdx * defaults.digitStagger
            );
          });
        });
      });

      // Programmatic update (optional add-on)
      const update = function updateOdometer(el, newText, options = {}) {
        const currentText = el.textContent.trim();
        if (currentText === newText) return;

        const duration = options.duration || defaults.duration;
        const ease = options.ease || defaults.ease;
        const step = getLineHeightRatio(el);

        // Kill any running animation and clear its inline style locks
        const existing = activeTweens.get(el);
        if (existing) {
          existing.kill();
          gsap.set(el, { clearProps: "width,overflow" });
        }

        // Measure current width before rebuilding (in em for responsive scaling)
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        const oldWidthEm = el.getBoundingClientRect().width / fontSize;

        // Parse current text as start, new text as end
        const startSegments = parseSegments(currentText);
        const startDigitsStr = startSegments
          .filter((s) => s.type === "digit")
          .map((s) => s.char)
          .join("");
        const startValue = parseInt(startDigitsStr, 10) || 0;

        let segments = parseSegments(newText);
        segments = mapStartDigits(segments, startValue);
        segments = markHiddenSegments(segments, startValue);
        const { rollers, revealEls } = buildRollerDOM(el, segments, step, true);

        // Measure new natural width (in em)
        const newWidthEm = el.getBoundingClientRect().width / fontSize;
        const widthChanged = Math.abs(oldWidthEm - newWidthEm) > 0.01;

        // Lock to old width for smooth transition
        if (widthChanged) {
          gsap.set(el, { width: oldWidthEm + "em", overflow: "hidden" });
        }

        const tl = gsap.timeline({
          onComplete() {
            cleanupElement(el, newText);
            activeTweens.delete(el);
          },
        });
        activeTweens.set(el, tl);

        // Animate element width
        if (widthChanged) {
          tl.to(
            el,
            {
              width: newWidthEm + "em",
              duration: defaults.revealDuration,
              ease: defaults.revealEase,
            },
            0
          );
        }

        // Fade in hidden statics
        revealEls.forEach((revealEl) => {
          if (revealEl.getAttribute("data-odometer-part") === "static") {
            tl.to(revealEl, { opacity: 1, duration: 0.2 }, 0);
          }
        });

        // Roll digits
        rollers.forEach(({ roller, targetPos }, digitIdx) => {
          const reversedIdx = rollers.length - 1 - digitIdx;
          tl.to(
            roller,
            {
              y: -targetPos * step + "em",
              duration,
              ease,
              force3D: true,
            },
            reversedIdx * defaults.digitStagger
          );
        });
      };

      // Helpers
      function getLineHeightRatio(el) {
        const cs = getComputedStyle(el);
        const lh = cs.lineHeight;
        if (lh === "normal") return 1.2;
        return parseFloat(lh) / parseFloat(cs.fontSize);
      }

      function parseSegments(text) {
        return [...text].map((char) => ({
          type: /\d/.test(char) ? "digit" : "static",
          char,
        }));
      }

      function mapStartDigits(segments, startValue) {
        const digitSlots = segments.filter((s) => s.type === "digit");
        const padded = String(Math.floor(Math.abs(startValue)))
          .padStart(digitSlots.length, "0")
          .slice(-digitSlots.length);
        let di = 0;
        return segments.map((s) =>
          s.type === "digit" ? { ...s, startDigit: parseInt(padded[di++], 10) } : s
        );
      }

      function markHiddenSegments(segments, startValue) {
        const totalDigits = segments.filter((s) => s.type === "digit").length;
        const absStart = Math.floor(Math.abs(startValue));
        const startDigitCount = absStart === 0 ? 1 : String(absStart).length;
        const leadingZeros = Math.max(0, totalDigits - startDigitCount);
        if (leadingZeros === 0) return segments;
        let digitsSeen = 0;
        let firstDigitSeen = false;
        let prevDigitHidden = false;
        return segments.map((seg) => {
          if (seg.type === "digit") {
            firstDigitSeen = true;
            const hidden = digitsSeen < leadingZeros;
            prevDigitHidden = hidden;
            digitsSeen++;
            return { ...seg, hidden };
          }
          const hidden = firstDigitSeen && prevDigitHidden;
          return { ...seg, hidden };
        });
      }

      function shouldGrow(el, hasExplicitStart, startValue, segments) {
        if (el.hasAttribute("data-odometer-grow")) {
          return el.getAttribute("data-odometer-grow") !== "false";
        }
        if (!hasExplicitStart) return false;
        const absStart = Math.floor(Math.abs(startValue));
        const startDigitCount = absStart === 0 ? 1 : String(absStart).length;
        const endDigitCount = segments.filter((s) => s.type === "digit").length;
        return startDigitCount < endDigitCount;
      }

      function buildRollerDOM(el, segments, step, grow) {
        el.innerHTML = "";
        el.style.height = "";
        const rollers = [];
        const revealEls = [];
        const totalCells = 10 * defaults.digitCycles;
        segments.forEach((seg) => {
          if (seg.type === "static") {
            const span = document.createElement("span");
            span.setAttribute("data-odometer-part", "static");
            span.style.height = step + "em";
            span.style.lineHeight = step;
            span.textContent = seg.char;
            el.appendChild(span);
            if (grow && seg.hidden) {
              gsap.set(span, { opacity: 0 });
              revealEls.push(span);
            }
            return;
          }
          const mask = document.createElement("span");
          mask.setAttribute("data-odometer-part", "mask");
          mask.style.height = step + "em";
          mask.style.lineHeight = step;
          const roller = document.createElement("span");
          roller.setAttribute("data-odometer-part", "roller");
          roller.style.lineHeight = step;

          const digits = [];
          for (let d = 0; d < totalCells; d++) {
            digits.push(d % 10);
          }
          roller.textContent = digits.join("\n");
          mask.appendChild(roller);
          el.appendChild(mask);
          const startDigit = seg.startDigit || 0;
          const isReveal = grow && seg.hidden;
          gsap.set(roller, { y: isReveal ? step + "em" : -startDigit * step + "em" });
          const endDigit = parseInt(seg.char, 10);
          const targetPos = endDigit > startDigit ? endDigit : 10 + endDigit;
          rollers.push({ roller, targetPos });
          if (isReveal) revealEls.push(mask);
        });
        return { rollers, revealEls };
      }

      function cleanupElement(el, originalText) {
        el.style.overflow = "";
        el.style.height = "";

        // Remove rollers, set final digit, clear inline bloat (but preserve width)
        const digits = [...originalText].filter((c) => /\d/.test(c));
        let di = 0;

        el.querySelectorAll('[data-odometer-part="mask"]').forEach((mask) => {
          const roller = mask.querySelector('[data-odometer-part="roller"]');
          if (roller) roller.remove();
          mask.textContent = digits[di++] || "";
          mask.style.opacity = "";
          mask.style.overflow = "";
        });

        el.querySelectorAll('[data-odometer-part="static"]').forEach((stat) => {
          stat.style.opacity = "";
        });
      }

      function recalcOnResize() {
        document.querySelectorAll("[data-odometer-element]").forEach((el) => {
          // Force-complete any running programmatic animation
          const running = activeTweens.get(el);
          if (running) {
            running.progress(1);
            activeTweens.delete(el);
          }

          const hasRollers = el.querySelector('[data-odometer-part="roller"]');

          if (hasRollers) {
            // Pre-triggered: recalculate step-based inline styles
            const step = getLineHeightRatio(el);
            el.querySelectorAll('[data-odometer-part="mask"]').forEach((mask) => {
              mask.style.height = step + "em";
              mask.style.lineHeight = step;
            });
            el.querySelectorAll('[data-odometer-part="roller"]').forEach((roller) => {
              roller.style.lineHeight = step;
            });
            el.querySelectorAll('[data-odometer-part="static"]').forEach((stat) => {
              stat.style.lineHeight = step;
            });
          }
          // Completed elements: width is em-based, scales automatically, don't touch
        });
        ScrollTrigger.refresh();
      }

      // resize-листенер навешиваем ОДИН раз (initNumberOdometer зовётся повторно
      // на Barba re-init — иначе листенеры копятся). recalcOnResize работает по
      // живому DOM, поэтому замыкание первого вызова корректно.
      if (!window.__cctpOdometerResizeBound) {
        window.__cctpOdometerResizeBound = true;
        let resizeTimer;
        let lastWidth = window.innerWidth;
        window.addEventListener("resize", () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            recalcOnResize();
          }, 250);
        });
      }

      function applyStaggerOrder(items, order) {
        const arr = [...items];
        if (order === "right") return arr.reverse();
        if (order === "random") return shuffleArray(arr);
        return arr;
      }

      function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      return update;
    }
    function initHighlightMarkerTextReveal() {
      if (!has.gsap || !has.ScrollTrigger || typeof window.SplitText === "undefined") return;
      // Auto-attach: все главные заголовки секций + лид-абзац в InnerHero
      //  получают reveal-эффект. Исключаем те, у которых уже есть свой
      // scroll-эффект (data-anim).
      document.querySelectorAll("h1.heading_h1, .inner-hero_heading-container p").forEach((el) => {
        if (el.hasAttribute("data-anim")) return;
        if (el.hasAttribute("data-highlight-marker-reveal")) return;
        el.setAttribute("data-highlight-marker-reveal", "");
      });
      const defaults = {
        direction: "left",
        theme: "brand",
        scrollStart: "top 90%",
        staggerStart: "start",
        stagger: 100,
        barDuration: 0.78,
        barEase: "power3.inOut",
      };
      const colorMap = {
        brand:
          getComputedStyle(document.body).getPropertyValue("--mapped-surface-action").trim() ||
          "#fe5b2a",
        white: "#FFFFFF",
      };
      const directionMap = {
        right: { prop: "scaleX", origin: "right center" },
        left: { prop: "scaleX", origin: "left center" },
        up: { prop: "scaleY", origin: "center top" },
        down: { prop: "scaleY", origin: "center bottom" },
      };
      function resolveColor(value) {
        if (colorMap[value]) return colorMap[value];
        if (value.startsWith("--")) {
          return getComputedStyle(document.body).getPropertyValue(value).trim() || value;
        }
        return value;
      }
      function createBar(color, origin) {
        const bar = document.createElement("div");
        bar.className = "highlight-marker-bar";
        bar.style.backgroundColor = color;
        bar.style.transformOrigin = origin;
        return bar;
      }
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        document.querySelectorAll("[data-highlight-marker-reveal]").forEach((el) => {
          gsap.set(el, { autoAlpha: 1 });
        });
        return;
      }
      const elements = document.querySelectorAll("[data-highlight-marker-reveal]");
      if (!elements.length) return;
      // Fallback: если по любой причине (CDN down, SplitText сломан, error)
      // reveal не сработал — через 4s принудительно показать всё, что осталось
      // скрытым. Без этого юзер увидит пустой layout.
      setTimeout(() => {
        document.querySelectorAll("h1.heading_h1, .inner-hero_heading-container p").forEach((h) => {
          if (getComputedStyle(h).visibility === "hidden") {
            h.style.visibility = "visible";
          }
        });
      }, 4e3);
      elements.forEach((el) => {
        if (el.__highlightMarkerReveal) return;
        el.__highlightMarkerReveal = {};
        const direction = el.getAttribute("data-marker-direction") || defaults.direction;
        const theme = el.getAttribute("data-marker-theme") || defaults.theme;
        const scrollStart = el.getAttribute("data-marker-scroll-start") || defaults.scrollStart;
        const staggerStart = el.getAttribute("data-marker-stagger-start") || defaults.staggerStart;
        const staggerOffset =
          (parseFloat(el.getAttribute("data-marker-stagger")) || defaults.stagger) / 1000;
        const color = resolveColor(theme);
        const dirConfig = directionMap[direction] || directionMap.right;
        // autoSplit: false — после document.fonts.ready шрифт зафиксирован,
        // re-split на resize не нужен (заголовки secционные, всегда влезают).
        // Это убирает дубль reveal-анимации.
        const split = new SplitText(el, {
          type: "lines",
          linesClass: "highlight-marker-line",
        });
        const lines = split.lines;
        const tl = gsap.timeline({ paused: true });
        lines.forEach((line, i) => {
          gsap.set(line, { position: "relative", overflow: "hidden" });
          const bar = createBar(color, dirConfig.origin);
          line.appendChild(bar);
          const staggerIndex = staggerStart === "end" ? lines.length - 1 - i : i;
          tl.to(
            bar,
            {
              [dirConfig.prop]: 0,
              duration: defaults.barDuration,
              ease: defaults.barEase,
            },
            staggerIndex * staggerOffset
          );
        });
        gsap.set(el, { autoAlpha: 1 });
        const st = ScrollTrigger.create({
          trigger: el,
          start: scrollStart,
          once: true,
          onEnter: () => tl.play(),
        });
        el.__highlightMarkerReveal.split = split;
        el.__highlightMarkerReveal.timeline = tl;
        el.__highlightMarkerReveal.scrollTrigger = st;
      });
    }
    function initMobileMenu() {
      // Мобильное меню (≤479px): тоггл МЕНЮ/X + панель, выезжающая сверху,
      // + scrim затемнения. nav persistent (вне Barba-контейнера) — init ОДИН
      // раз через idempotent guard; listeners переживают Barba navigation.
      if (typeof document === "undefined") return;
      if (window.__cctpMobileMenuInit) return;
      var nav = document.querySelector(".nav");
      var toggle = document.querySelector("[data-menu-toggle]");
      var panel = document.querySelector("[data-menu-panel]");
      var scrim = document.querySelector("[data-menu-scrim]");
      if (!nav || !toggle || !panel) return;
      window.__cctpMobileMenuInit = true;

      var items = panel.querySelectorAll(".nav_menu-item");
      var open = false;
      function setInitial() {
        if (!window.gsap) return;
        window.gsap.set(panel, { yPercent: -100, visibility: "hidden" });
        // Пункты стартуют скрытыми — fade-in по очереди при открытии (openMenu).
        if (items.length) window.gsap.set(items, { opacity: 0 });
        if (scrim) window.gsap.set(scrim, { autoAlpha: 0 });
      }
      function openMenu() {
        if (open) return;
        open = true;
        // Тема панели = тема навбара (адаптивно): light → светлое меню,
        // hero/dark → тёмное. data-theme-section переключает mapped-токены.
        var navTheme = nav.getAttribute("data-theme-nav");
        if (navTheme === "light") panel.removeAttribute("data-theme-section");
        else panel.setAttribute("data-theme-section", "dark");
        nav.setAttribute("data-menu-open", "");
        toggle.setAttribute("aria-expanded", "true");
        panel.setAttribute("aria-hidden", "false");
        if (window.__lenis && typeof window.__lenis.stop === "function") window.__lenis.stop();
        if (window.gsap) {
          window.gsap.set(panel, { visibility: "visible" });
          window.gsap.to(panel, { yPercent: 0, duration: 0.5, ease: "cctpOut", overwrite: true });
          // Пункты появляются по очереди сверху вниз — тот же принцип/тайминг,
          // что section-reveal при скролле (opacity 0→1, 0.5s, ease-out cubic,
          // stagger 0.08). GSAP, не CSS-класс — избегаем transition-delay race
          // (lesson #19). delay 0.1 — стартуют как панель уже поехала.
          if (items.length)
            window.gsap.to(items, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.08,
              delay: 0.1,
              overwrite: true,
            });
          if (scrim) window.gsap.to(scrim, { autoAlpha: 1, duration: 0.3, overwrite: true });
        }
      }
      function closeMenu() {
        if (!open) return;
        open = false;
        nav.removeAttribute("data-menu-open");
        toggle.setAttribute("aria-expanded", "false");
        panel.setAttribute("aria-hidden", "true");
        if (window.__lenis && typeof window.__lenis.start === "function") window.__lenis.start();
        if (window.gsap) {
          window.gsap.to(panel, {
            yPercent: -100,
            duration: 0.4,
            ease: "cctpOut",
            overwrite: true,
            onComplete: function () {
              window.gsap.set(panel, { visibility: "hidden" });
              if (items.length) window.gsap.set(items, { opacity: 0 });
            },
          });
          if (scrim) window.gsap.to(scrim, { autoAlpha: 0, duration: 0.3, overwrite: true });
        } else {
          panel.style.visibility = "hidden";
        }
      }
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        open ? closeMenu() : openMenu();
      });
      if (scrim) scrim.addEventListener("click", closeMenu);
      panel.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          closeMenu();
        });
      });
      setInitial();
      // Активный пункт на cold load (на Barba — applyShellStateFrom).
      syncActiveNavLinks();
    }
    function initNavContactScroll() {
      // Кнопка «связаться» в nav: плавный скролл к .section_cta через GSAP
      // ScrollToPlugin с ease "power3.inOut". Lenis останавливаем на время
      // анимации — иначе на about pin-секции (Scroller, Globe) «отщипывают»
      // Lenis-tween и он замирает у Proof.
      //
      // Двойная защита от промахов на pin-страницах:
      //  1) refresh + RAF перед расчётом target — даём layout стабилизироваться
      //     после пересчёта pin-spacing'а.
      //  2) onComplete correction pass — если из-за изменения layout во время
      //     анимации финальная позиция не совпала с target, дотягиваем за 0.4s.
      const links = document.querySelectorAll(".nav_contact");
      if (!links.length) return;
      const startScroll = () => {
        const cta = document.querySelector(".section_cta");
        if (!cta) return;
        const targetY = cta.getBoundingClientRect().top + window.scrollY;
        const lenis = window.__lenis;
        const hasScrollTo = typeof gsap !== "undefined" && gsap.plugins && gsap.plugins.scrollTo;
        if (!hasScrollTo) {
          window.scrollTo({ top: targetY, behavior: "smooth" });
          return;
        }
        if (lenis) lenis.stop();
        gsap.to(window, {
          duration: 1.5,
          ease: "power3.inOut",
          scrollTo: { y: targetY, autoKill: false },
          onComplete: () => {
            // Correction pass: если финальная позиция «съехала» из-за
            // pin-spacing, докручиваем без задержки.
            const ctaNow = document.querySelector(".section_cta");
            if (!ctaNow) {
              if (lenis) lenis.start();
              return;
            }
            const finalY = ctaNow.getBoundingClientRect().top + window.scrollY;
            const diff = Math.abs(window.scrollY - finalY);
            if (diff > 10) {
              gsap.to(window, {
                duration: 0.4,
                ease: "power2.out",
                scrollTo: { y: finalY, autoKill: false },
                onComplete: () => {
                  if (lenis) lenis.start();
                },
              });
            } else if (lenis) {
              lenis.start();
            }
          },
        });
      };
      links.forEach((link) => {
        if (link.dataset.ctaScrollWired) return;
        link.dataset.ctaScrollWired = "1";
        // capture:true + stopImmediatePropagation: гарантируем что наш handler
        // выполнится РАНЬШЕ Barba document-level delegation и Base.astro
        // EN-intercept. Без этого Barba перехватывает клик первым и делает
        // переход на /contacts/ (правильный fallback на странице без CTA,
        // но на страницах с CTA нам нужен smooth-scroll).
        link.addEventListener("click", (e) => {
          if (!document.querySelector(".section_cta")) return;
          e.preventDefault();
          e.stopImmediatePropagation();
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          requestAnimationFrame(startScroll);
        }, true);
      });
    }
    function initForms() {
      // Backend-сабмит всех форм сайта через Payload endpoint /api/contact
      // (Resend → info@sstr.tech). Никакого mailto — user заполняет форму
      // прямо в браузере и получает success/error feedback на месте.
      //
      // Source-tagging: form.dataset.formSource определяет subject в письме
      // (cta / contacts / footer-subscribe).
      //
      // Button.astro рендерит <a href="#"> — клик не триггерит form submit
      // нативно. Перехватываем click на a.button[href="#"] внутри формы.
      const ENDPOINT = '/api/contact';
      const forms = document.querySelectorAll(
        '.cta-form, .contacts_form, #wf-form-Email-subscribe-form'
      );
      forms.forEach((form) => {
        if (form.dataset.cctpFormWired) return;
        form.dataset.cctpFormWired = '1';
        form.querySelectorAll('a.button[href="#"]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof form.requestSubmit === 'function') {
              form.requestSubmit();
            } else {
              form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          });
        });
        // Согласие на обработку ПДн (152-ФЗ): отдельный непроставленный
        // чекбокс name="consent". Пока не отмечен — кнопка отправки
        // визуально неактивна; submit дополнительно гейтится в обработчике.
        const consentBox = form.querySelector('input[name="consent"][type="checkbox"]');
        if (consentBox) {
          const consentBtns = form.querySelectorAll('a.button, button[type="submit"], input[type="submit"]');
          const syncConsentState = () => {
            const ok = consentBox.checked;
            consentBtns.forEach((b) => {
              b.style.pointerEvents = ok ? '' : 'none';
              b.style.opacity = ok ? '' : '0.4';
              b.setAttribute('aria-disabled', ok ? 'false' : 'true');
            });
          };
          consentBox.addEventListener('change', syncConsentState);
          syncConsentState();
        }
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          // Гейт согласия: без отметки не отправляем (программный dispatchEvent
          // обходит native required — поэтому проверяем явно).
          if (consentBox && !consentBox.checked) {
            if (typeof consentBox.reportValidity === 'function') consentBox.reportValidity();
            return;
          }
          // Source tag для backend (cta / contacts / footer-subscribe).
          const source =
            form.dataset.formSource ||
            (form.id === 'wf-form-Email-subscribe-form'
              ? 'footer-subscribe'
              : form.classList.contains('contacts_form')
                ? 'contacts'
                : 'cta');
          // Honeypot — скрытое поле name="website". Если бот заполнил —
          // backend тихо игнорирует.
          const honeypot = form.querySelector('input[name="website"]');
          const fields = {};
          form.querySelectorAll('input, textarea').forEach((field) => {
            if (field.type === 'submit' || field.type === 'hidden') return;
            if (field.type === 'checkbox') return; // consent фиксируется отдельной строкой ниже
            if (field.name === 'website') return; // skip honeypot from payload
            const label = field.placeholder || field.name || 'Поле';
            const value = (field.value || '').trim();
            if (value) fields[label] = value;
          });
          // Фиксация факта согласия в заявке — подтверждение для оператора (ч. 1 ст. 9 152-ФЗ).
          if (consentBox && consentBox.checked) {
            fields['Согласие на обработку ПДн'] = 'да (чекбокс на сайте)';
          }
          const successEl = form.parentElement && form.parentElement.querySelector('.form-success');
          const errorEl = form.parentElement && form.parentElement.querySelector('.form-error');
          // Сразу скрываем error если был.
          if (errorEl) errorEl.style.display = 'none';
          // Visual feedback на submit-кнопках во время запроса.
          const submitBtns = form.querySelectorAll('a.button, button[type="submit"], input[type="submit"]');
          submitBtns.forEach((b) => { b.style.pointerEvents = 'none'; b.style.opacity = '0.6'; });
          try {
            const res = await fetch(ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                source,
                fields,
                website: honeypot ? honeypot.value : '',
              }),
            });
            if (!res.ok) throw new Error('http ' + res.status);
            const data = await res.json().catch(() => ({ ok: false }));
            if (!data.ok) throw new Error('not ok');
            // Success: скрываем форму, показываем success-блок.
            form.style.display = 'none';
            if (successEl) successEl.style.display = 'block';
          } catch (err) {
            if (errorEl) errorEl.style.display = 'block';
            submitBtns.forEach((b) => { b.style.pointerEvents = ''; b.style.opacity = ''; });
          }
        });
      });
    }
    function initClickToZoomBasic() {
      if (!has.gsap) return;
      const CONFIG = {
        openDuration: 0.55,
        closeDuration: 0.45,
        openEase: "power3.out",
        closeEase: "power2.inOut",
        closeOnScroll: true,
        closeOnEscape: true,
        closeOnClick: true,
      };
      const lightbox = document.querySelector("[data-click-zoom-lightbox]");
      if (!lightbox) return;
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-hidden", "true");
      const backdropColor = window.getComputedStyle(lightbox).backgroundColor;
      const transparent = "rgba(0, 0, 0, 0)";
      let cloneEl = null;
      let isOpen = false;
      let isAnimating = false;
      let openScrollY = 0;
      let openSourceRectDoc = null;
      function computeFlip(src, dst) {
        return {
          scaleX: src.width / dst.width,
          scaleY: src.height / dst.height,
          tx: src.left + src.width / 2 - (dst.left + dst.width / 2),
          ty: src.top + src.height / 2 - (dst.top + dst.height / 2),
        };
      }
      function openZoom(img) {
        if (isOpen || isAnimating) return;
        if (!img.complete || !img.naturalWidth) return;
        isAnimating = true;
        openScrollY = window.scrollY;
        const srcRect = img.getBoundingClientRect();
        openSourceRectDoc = {
          top: srcRect.top + window.scrollY,
          left: srcRect.left,
          width: srcRect.width,
          height: srcRect.height,
        };
        cloneEl = img.cloneNode(false);
        cloneEl.loading = "eager";
        cloneEl.removeAttribute("data-click-zoom");
        const srcComputed = window.getComputedStyle(img);
        gsap.set(lightbox, { display: "flex", backgroundColor: transparent });
        const lightboxStyle = window.getComputedStyle(lightbox);
        const padX = parseFloat(lightboxStyle.paddingLeft) + parseFloat(lightboxStyle.paddingRight);
        const padY = parseFloat(lightboxStyle.paddingTop) + parseFloat(lightboxStyle.paddingBottom);
        const aspect = srcRect.width / srcRect.height;
        const maxW = lightbox.clientWidth - padX;
        const maxH = lightbox.clientHeight - padY;
        let w = maxW;
        let h = w / aspect;
        if (h > maxH) {
          h = maxH;
          w = h * aspect;
        }
        gsap.set(cloneEl, {
          width: w,
          height: h,
          display: "block",
          objectFit: srcComputed.objectFit,
          objectPosition: srcComputed.objectPosition,
        });
        while (lightbox.firstChild) lightbox.removeChild(lightbox.firstChild);
        lightbox.appendChild(cloneEl);
        const dstRect = cloneEl.getBoundingClientRect();
        const flip = computeFlip(srcRect, dstRect);
        lightbox.setAttribute("aria-hidden", "false");
        document.documentElement.style.cursor = "zoom-out";
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
            isOpen = true;
            attachCloseListeners();
          },
        });
        tl.to(lightbox, { backgroundColor: backdropColor, duration: 0.3, ease: "none" }, 0);
        tl.fromTo(
          cloneEl,
          { x: flip.tx, y: flip.ty, scaleX: flip.scaleX, scaleY: flip.scaleY },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: CONFIG.openDuration,
            ease: CONFIG.openEase,
          },
          0
        );
      }
      function closeZoom() {
        if (!isOpen || isAnimating) return;
        isAnimating = true;
        detachCloseListeners();
        document.documentElement.style.cursor = "";
        const dstRect = cloneEl.getBoundingClientRect();
        const startX = Number(gsap.getProperty(cloneEl, "x")) || 0;
        const startY = Number(gsap.getProperty(cloneEl, "y")) || 0;
        const startScaleX = Number(gsap.getProperty(cloneEl, "scaleX")) || 1;
        const startScaleY = Number(gsap.getProperty(cloneEl, "scaleY")) || 1;
        function currentSrcRect() {
          return {
            top: openSourceRectDoc.top - window.scrollY,
            left: openSourceRectDoc.left,
            width: openSourceRectDoc.width,
            height: openSourceRectDoc.height,
          };
        }
        let lastFlip = computeFlip(currentSrcRect(), dstRect);
        const cleanup = () => {
          gsap.set(lightbox, { display: "none", clearProps: "backgroundColor" });
          if (cloneEl && cloneEl.parentNode) cloneEl.parentNode.removeChild(cloneEl);
          cloneEl = null;
          lightbox.setAttribute("aria-hidden", "true");
          openSourceRectDoc = null;
          isOpen = false;
          isAnimating = false;
        };
        const state = { t: 0 };
        gsap.to(state, {
          t: 1,
          duration: CONFIG.closeDuration,
          ease: CONFIG.closeEase,
          onUpdate: () => {
            lastFlip = computeFlip(currentSrcRect(), dstRect);
            const t = state.t;
            gsap.set(cloneEl, {
              x: startX + (lastFlip.tx - startX) * t,
              y: startY + (lastFlip.ty - startY) * t,
              scaleX: startScaleX + (lastFlip.scaleX - startScaleX) * t,
              scaleY: startScaleY + (lastFlip.scaleY - startScaleY) * t,
            });
          },
          onComplete: cleanup,
        });
        gsap.to(lightbox, {
          backgroundColor: transparent,
          duration: 0.3,
          ease: "power2.in",
          delay: CONFIG.closeDuration * 0.4,
        });
      }
      function onDocumentClick(e) {
        const article = e.target.closest("[data-click-zoom-article]");
        if (article) {
          const img2 = e.target.closest("img");
          if (img2 && article.contains(img2)) {
            e.preventDefault();
            openZoom(img2);
            return;
          }
        }
        const trigger = e.target.closest("[data-click-zoom]");
        if (!trigger) return;
        const img = trigger.tagName === "IMG" ? trigger : trigger.querySelector("img");
        if (!img) return;
        e.preventDefault();
        openZoom(img);
      }
      function onOverlayClick() {
        if (CONFIG.closeOnClick) closeZoom();
      }
      function onKeyDown(e) {
        if (CONFIG.closeOnEscape && e.key === "Escape") closeZoom();
      }
      function onScrollClose() {
        if (!CONFIG.closeOnScroll) return;
        if (Math.abs(window.scrollY - openScrollY) < 2) return;
        closeZoom();
      }
      function attachCloseListeners() {
        lightbox.addEventListener("click", onOverlayClick);
        document.addEventListener("keydown", onKeyDown);
        window.addEventListener("scroll", onScrollClose, { passive: true });
      }
      function detachCloseListeners() {
        lightbox.removeEventListener("click", onOverlayClick);
        document.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("scroll", onScrollClose);
      }
      document.addEventListener("click", onDocumentClick);
    }
    function initCaseCardHover() {
      // Idempotent per-card (см. card.dataset.clickWired ниже) — без global
      // guard. После Barba swap новые cards тоже должны получить hover/click.
      const cards = document.querySelectorAll(".case-card_item");
      if (!cards.length) return;
      function loadSplitText() {
        if (window.SplitText) return Promise.resolve(window.SplitText);
        return new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js";
          s.onload = () => resolve(window.SplitText);
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const allImgs = document.querySelectorAll(".case-card_img img");
      allImgs.forEach((img) => {
        img.loading = "eager";
        img.decoding = "sync";
      });
      const imgPromises = Array.from(allImgs).map((img) => {
        if (img.complete && img.naturalHeight > 0) return Promise.resolve();
        return new Promise((r) => {
          img.addEventListener("load", r, { once: true });
          img.addEventListener("error", r, { once: true });
        });
      });
      document.querySelectorAll(".case-card_description .text_size-small").forEach((el) => {
        if (el.tagName !== "P") return;
        const div = document.createElement("div");
        for (const a of el.attributes) div.setAttribute(a.name, a.value);
        div.innerHTML = el.innerHTML;
        el.replaceWith(div);
      });
      Promise.all([loadSplitText(), ...imgPromises])
        .then(([SplitText]) => {
          if (SplitText) gsap.registerPlugin(SplitText);
          cards.forEach((card) => {
            // Per-card idempotency — после Barba swap старые cards (если бы они
            // были) не перезаписывались, новые — get full init.
            if (card.dataset.hoverInit === "1") return;
            card.dataset.hoverInit = "1";
            if (!card.dataset.clickWired) {
              card.dataset.clickWired = "1";
              card.addEventListener("click", (e) => {
                if (e.target.closest("a, button")) return;
                const targetLink = card.querySelector(".case-card_link[href]");
                if (targetLink) targetLink.click();
              });
            }
            // Mobile: hover-reveal не работает на touch. Карточка показывается
            // как простой flow column со всеми элементами видимыми сразу
            // (layout в animation.css @media 479). Skip GSAP/SplitText setup —
            // без inline-трансформов CSS управляет чисто. Click уже навешан.
            if (window.matchMedia("(max-width: 479px)").matches) return;
            const img = card.querySelector(".case-card_img img");
            const text = card.querySelector(".case-card_description .text_size-small");
            const date = card.querySelector(".case-card_date .text-block");
            let split = null;
            if (text && SplitText) {
              split = new SplitText(text, {
                type: "lines",
                mask: "lines",
                linesClass: "split-line",
              });
            }
            if (img) gsap.set(img, { yPercent: -100, autoAlpha: 1 });
            if (date) gsap.set(date, { yPercent: 100, autoAlpha: 1 });
            if (text) gsap.set(text, { autoAlpha: 1 });
            if (split && split.lines.length) {
              gsap.set(split.lines, { yPercent: -100 });
            }
            const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
            if (img) tl.to(img, { yPercent: 0, duration: 0.7 }, 0);
            if (split && split.lines.length) {
              tl.to(split.lines, { yPercent: 0, duration: 0.6, stagger: 0.06 }, 0.05);
            }
            if (date) tl.to(date, { yPercent: 0, duration: 0.6 }, 0.1);
            card.addEventListener("mouseenter", () => tl.play());
            card.addEventListener("mouseleave", () => tl.reverse());
          });
        })
        .catch((err) => {
          console.warn("[CCTP] case-card init failed:", err);
        });
    }
    function initFooterParallax() {
      document.querySelectorAll("[data-footer-parallax]").forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "clamp(top bottom)",
            end: "clamp(top top)",
            scrub: true,
          },
        });
        const inner = el.querySelector("[data-footer-parallax-inner]");
        const dark = el.querySelector("[data-footer-parallax-dark]");
        if (inner) tl.from(inner, { yPercent: -50, ease: "linear" });
        if (dark) tl.from(dark, { opacity: 0.5, ease: "linear" }, "<");
      });
    }
    function initGlobeScrollRefresh() {
      // Принудительный ScrollTrigger.refresh() когда низ экрана достигает низа
      // секции Globe (страницы / и /about). Зачем: refresh-guard выше намеренно
      // ОТКЛАДЫВАЕТ refresh пока идёт скролл (анти-jank). При непрерывном скролле
      // до низа простой не наступает → footer-reveal и прочие triggers ниже
      // считаются по устаревшим (init-time) позициям → футер не «онмаскивается».
      // Callback ScrollTrigger фирится ВО ВРЕМЯ скролла → обходит этот defer и
      // пересчитывает позиции прямо перед тем как footer войдёт во вьюпорт.
      // Globe ещё заполняет экран в этот момент → видимого jank от refresh нет.
      if (!has.ScrollTrigger) return;
      var globe = document.querySelector(".section_globe");
      if (!globe || globe.dataset.refreshAnchorInit === "1") return;
      globe.dataset.refreshAnchorInit = "1";
      ScrollTrigger.create({
        trigger: globe,
        start: "bottom bottom",
        once: true,
        onEnter: function () {
          ScrollTrigger.refresh();
        },
      });
    }
    function initPreloader() {
      // Загрузочный экран — ТОЛЬКО на главной. 2×2 grid (orange | pattern /
      // card-left | card-right). Анимация sequence:
      //   1) bottom-left illu играет shape-вращение forward
      //   2) bottom-right illu играет shape-service stack forward
      //   3) пауза ~1s
      //   4) bottom-left reverse → начальное состояние
      //   5) bottom-right reverse → начальное
      //   6) одновременно с (1-5) pattern fill заполняется по LOAD_POINTS до 100%
      //   7) pattern push orange влево (cell width 50%→0%)
      //   8) bottom cards (text+illu) slide DOWN + opacity fade с stagger
      //   9) pattern block slide DOWN
      //   10) % меняется на "ГОТОВО"
      //   11) весь preloader yPercent -100 (подъём шторки) → reveal hero
      if (typeof document === "undefined") return;
      if (window.__cctpPreloaderInit) return;
      var pre = document.querySelector("[data-preloader]");
      if (!pre) return; // не главная
      window.__cctpPreloaderInit = true;

      // ╔═══ НАСТРОЙКИ прелоадера — тайминги (сек) + изинги. Правь здесь. ═══╗
      var CFG = {
        // ⚠️ true: прелоадер на КАЖДУЮ перезагрузку (подбор таймингов).
        //    Вернуть false → показывать один раз за сессию.
        DEV_ALWAYS_SHOW: false,

        FILL_DUR: 4.5, // ФЕЙКОВАЯ загрузка крестиков 0→100 (кривая LOAD_POINTS)

        // ── Bottom-cards illustration sequence (фаза 1-5) ──
        // Параметры зеркалят hover-анимацию шейпов на главной (HOVER_DURATION=0.3 + stagger).
        ILLU_DUR: 0.5, // длительность одной иллюстрационной анимации (forward или reverse)
        ILLU_GAP: 0.5, // задержка между L и R стартом (user wants ~0.5s)
        ILLU_HOLD: 0.1, // короткая пауза в конечном состоянии перед reverse

        // ── Reveal-фаза (после FILL=100%) ──
        SQUEEZE_DUR: 1.4, // pattern наезжает на orange
        SQUEEZE_EASE: "cctpOut",
        CARD_DOWN_DUR: 0.5, // bottom card-content слайд вниз + fade
        CARD_DOWN_Y: "80%",
        CARD_DOWN_STAGGER: 0.1, // L heading → L illu → R heading → R illu
        CARD_DOWN_EASE: "cctpOut",
        PATTERN_DOWN_DUR: 0.9, // pattern block → вниз
        PATTERN_DOWN_Y: "100%",
        PATTERN_DOWN_EASE: "cctpOut",

        RISE_DUR: 1.4, // подъём всего preloader вверх
        RISE_EASE: "cctpOut",

        DARKEN_FROM: 0.9,
        DARKEN_TO: 0.2,
        DARKEN_DUR: 2.2,
        DARKEN_EASE: "cctpOut",
        SCALE_FROM: 1.4,
        SCALE_DUR: 2.2,
        SCALE_EASE: "cctpOut",

        // ⭐ *_LEAD теперь = ЗАДЕРЖКА от старта подъёма шторки (riseStart label).
        //    0 = одновременно с подъёмом; RISE_DUR (1.4) = когда подъём закончился.
        //    Меньше → раньше начнётся reveal. Больше → позже.
        //    Можно отрицательное чтобы играть ДО старта подъёма.
        HERO_LEAD: 0.4, // headings плашками — на 0.4s после старта подъёма
        BTN_DUR: 0.8,
        BTN_EASE: "cctpOut",
        BTN_LEAD: 0.7, // hero-кнопка fade-up — чуть позже headings

        NAV_DUR: 3,
        NAV_EASE: "cctpOut",
        NAV_STAGGER: 0.08,
        NAV_LEAD: 0.9, // nav items — почти в конце подъёма

        // ⭐ READY_LABEL — текст вместо 100% на конце fill. Locale-aware (см. ниже)
        READY_LABEL_RU: "ГОТОВО",
        READY_LABEL_EN: "READY",
      };
      // ╚═══════════════════════════════════════════════════════════════════╝

      var gsap = window.gsap;
      // Locale: читаем атрибут на preloader (выставлен Astro). Fallback на html lang.
      var preloaderLocale =
        pre.getAttribute("data-preloader-locale") ||
        document.documentElement.lang ||
        "ru";
      // Pick READY_LABEL по локали
      CFG.READY_LABEL = preloaderLocale === "en" ? CFG.READY_LABEL_EN : CFG.READY_LABEL_RU;

      var orangeEl = pre.querySelector("[data-preloader-orange]");
      var patternEl = pre.querySelector("[data-preloader-pattern]");
      var overlayEl = pre.querySelector("[data-preloader-overlay]");
      var cardLeftEl = pre.querySelector('[data-preloader-card="left"]');
      var cardRightEl = pre.querySelector('[data-preloader-card="right"]');
      var illuLeftEl = pre.querySelector('[data-preloader-illu="left"]');
      var illuRightEl = pre.querySelector('[data-preloader-illu="right"]');
      var percentEl = pre.querySelector("[data-preloader-percent]");
      var overlayPercentEl = pre.querySelector("[data-preloader-overlay-percent]");
      var dotsEl = pre.querySelector("[data-preloader-dots]");
      var dotsCardLeft = pre.querySelector('[data-preloader-card-dots="left"]');
      var dotsCardRight = pre.querySelector('[data-preloader-card-dots="right"]');
      var progressEl = pre.querySelector(".preloader__progress");
      var nav = document.querySelector(".nav");
      var navItems = nav
        ? nav.querySelectorAll(".nav_logo-container, .nav_item, .nav_contact, .nav_menu-toggle")
        : [];
      var heroSection = document.querySelector(".section_hero");
      var heroVideo = heroSection && heroSection.querySelector("video");
      var darkEl = heroSection && heroSection.querySelector(".darken"); // scrim для «проявления из темноты»
      var heroBtn =
        heroSection &&
        heroSection.querySelector(
          ".hero_heading_container .button-wrap, .hero_heading_container a"
        );
      // cctpOut может быть не зарегистрирован без CustomEase → fallback.
      function ez(e) {
        return e === "cctpOut" && !has.CustomEase ? "power3.out" : e;
      }

      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var SHOWN_KEY = "cctpPreloaderShown";
      var shownAlready = false;
      try {
        shownAlready = sessionStorage.getItem(SHOWN_KEY) === "1";
      } catch (e) {}

      function removePre() {
        if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
      }
      function unlockScroll() {
        if (window.__lenis && typeof window.__lenis.start === "function") window.__lenis.start();
      }
      function showAllInstant() {
        if (!gsap) return;
        if (navItems.length) gsap.set(navItems, { clearProps: "opacity,visibility,transform" });
        if (heroBtn) gsap.set(heroBtn, { clearProps: "opacity,visibility,transform" });
      }

      // Skip: reduced-motion / уже показан (если не DEV_ALWAYS_SHOW) / нет gsap
      if (reduced || (!CFG.DEV_ALWAYS_SHOW && shownAlready) || !gsap) {
        removePre();
        showAllInstant();
        return;
      }
      if (!CFG.DEV_ALWAYS_SHOW) {
        try {
          sessionStorage.setItem(SHOWN_KEY, "1");
        } catch (e) {}
      }

      // Лочим скролл. Заголовок+описание hero готовим к reveal ПЛАШКАМИ (как на
      // всём сайте) — setupHeadingsRevealDeferred ставит бары поверх текста
      // (paused), играем в фазе 5. Кнопку и nav прячем (fade / stagger).
      if (window.__lenis && typeof window.__lenis.stop === "function") window.__lenis.stop();
      if (heroSection) setupHeadingsRevealDeferred(heroSection);
      if (navItems.length) gsap.set(navItems, { autoAlpha: 0 });
      if (heroBtn) gsap.set(heroBtn, { autoAlpha: 0 });

      // Точки: // ИДЁТ ЗАГРУЗКА → . .. ... (per-dot stagger interval)
      var dotN = 0;
      var dotsTimer = setInterval(function () {
        dotN = (dotN + 1) % 4;
        var s = new Array(dotN + 1).join(".");
        if (dotsEl) dotsEl.textContent = s;
        if (dotsCardLeft) dotsCardLeft.textContent = s;
        if (dotsCardRight) dotsCardRight.textContent = s;
      }, 350);

      function applyFill(v) {
        var clamped = Math.max(0, Math.min(100, v));
        if (percentEl) percentEl.textContent = Math.round(clamped) + "%";
        if (patternEl) patternEl.style.setProperty("--preloader-load", (clamped / 100).toFixed(4));
      }

      // ── Bottom illustrations: forward → pause → reverse, loop пока fill идёт ──
      // Зеркалим как иллюстрации выглядят в АКТИВНОМ ("scroll-revealed") виде +
      // ходим HOVER-анимацию туда-обратно. Не изобретаем велосипед — берём те
      // же значения что в initScrollCardShapes (rest state) и hoverTl (drift).
      //
      //   shape rest:  is-1 (1,0), is-2 (11/12, 25), is-3 (10/12, 45),
      //                is-4 (11/12, -25), is-5 (10/12, -45)
      //   shape hover: is-2 x:25*0.7=17.5, is-3 x:31.5, is-4 -17.5, is-5 -31.5
      //                (с stagger 0/0/0.1/0.1)
      //   svc rest:    is-1 (60,0), is-2 (40,5), is-3 (20,10), is-4 (0,15), rotation 45
      //   svc hover:   pull toward is-1 rest by 0.3 (stagger 0/0/0.1/0.15)
      function buildIlluController(card) {
        if (!card) return null;
        var DRIFT_RATIO = 0.7;
        var SERVICE_PULL = 0.3;
        var IS1_REST = { x: 60, y: 0 };
        // shape: REST (как scroll раскрыл) и HOVER (delta drift)
        var shape = [
          { sel: ".shape.is-1", rest: { scale: 1, x: 0 }, hover: { scale: 1, x: 0 }, at: 0 },
          {
            sel: ".shape.is-2",
            rest: { scale: 11 / 12, x: 25 },
            hover: { scale: 11 / 12, x: 25 * DRIFT_RATIO },
            at: 0,
          },
          {
            sel: ".shape.is-4",
            rest: { scale: 11 / 12, x: -25 },
            hover: { scale: 11 / 12, x: -25 * DRIFT_RATIO },
            at: 0,
          },
          {
            sel: ".shape.is-3",
            rest: { scale: 10 / 12, x: 45 },
            hover: { scale: 10 / 12, x: 45 * DRIFT_RATIO },
            at: 0.1,
          },
          {
            sel: ".shape.is-5",
            rest: { scale: 10 / 12, x: -45 },
            hover: { scale: 10 / 12, x: -45 * DRIFT_RATIO },
            at: 0.1,
          },
        ];
        // shape-service: REST (scroll raised, rotation 45) и HOVER (pulled toward is-1)
        var svcRest = [
          { sel: ".shape-service.is-1", rest: { x: 60, y: 0, rotation: 45 }, at: 0, pull: false },
          { sel: ".shape-service.is-2", rest: { x: 40, y: 5, rotation: 45 }, at: 0, pull: true },
          { sel: ".shape-service.is-3", rest: { x: 20, y: 10, rotation: 45 }, at: 0.1, pull: true },
          { sel: ".shape-service.is-4", rest: { x: 0, y: 15, rotation: 45 }, at: 0.15, pull: true },
        ];
        var svc = svcRest.map(function (s) {
          var hov = s.pull
            ? {
                x: s.rest.x + (IS1_REST.x - s.rest.x) * SERVICE_PULL,
                y: s.rest.y + (IS1_REST.y - s.rest.y) * SERVICE_PULL,
                rotation: 45,
              }
            : s.rest;
          return { sel: s.sel, at: s.at, rest: s.rest, hover: hov };
        });
        var all = shape
          .concat(svc)
          .map(function (s) {
            var el = card.querySelector(s.sel);
            return el ? { el: el, at: s.at, rest: s.rest, hover: s.hover } : null;
          })
          .filter(Boolean);
        if (!all.length) return null;
        // initial: REST state (как scroll-revealed) — иллюстрация уже раскрыта
        all.forEach(function (a) {
          gsap.set(a.el, a.rest);
        });
        var HOVER_DUR = 0.3; // same as main.js hoverTl
        return {
          forward: function () {
            all.forEach(function (a) {
              gsap.to(
                a.el,
                Object.assign({}, a.hover, {
                  duration: HOVER_DUR,
                  ease: CARD_EASE,
                  delay: a.at,
                  overwrite: true,
                })
              );
            });
          },
          reverse: function () {
            all.forEach(function (a) {
              gsap.to(
                a.el,
                Object.assign({}, a.rest, {
                  duration: HOVER_DUR,
                  ease: CARD_EASE,
                  delay: a.at,
                  overwrite: true,
                })
              );
            });
          },
        };
      }
      var illuTlLeft = buildIlluController(illuLeftEl);
      var illuTlRight = buildIlluController(illuRightEl);

      // Sequence loop: L forward → R forward → pause → L reverse → R reverse → repeat
      // Чистые setTimeout — GSAP outer timeline с callback-only entries капризно
      // плэйнет пустые tween'ы и не fire'ит коллбэки. setTimeout простой и работает.
      var illuStopped = false;
      var illuTimers = [];
      function runIlluCycle() {
        if (illuStopped) return;
        var s = 1000; // ms multiplier
        // t=0: L forward
        if (illuTlLeft) illuTlLeft.forward();
        // t=ILLU_GAP: R forward
        illuTimers.push(
          setTimeout(function () {
            if (illuStopped) return;
            if (illuTlRight) illuTlRight.forward();
          }, CFG.ILLU_GAP * s)
        );
        // t=ILLU_GAP + ILLU_DUR + ILLU_HOLD: L reverse
        var revLeftAt = (CFG.ILLU_GAP + CFG.ILLU_DUR + CFG.ILLU_HOLD) * s;
        illuTimers.push(
          setTimeout(function () {
            if (illuStopped) return;
            if (illuTlLeft) illuTlLeft.reverse();
          }, revLeftAt)
        );
        // +ILLU_GAP: R reverse
        illuTimers.push(
          setTimeout(
            function () {
              if (illuStopped) return;
              if (illuTlRight) illuTlRight.reverse();
            },
            revLeftAt + CFG.ILLU_GAP * s
          )
        );
        // total cycle then loop
        var totalAt = revLeftAt + CFG.ILLU_GAP * s + CFG.ILLU_DUR * s + 200;
        illuTimers.push(setTimeout(runIlluCycle, totalAt));
      }
      function stopIllu() {
        illuStopped = true;
        illuTimers.forEach(clearTimeout);
        illuTimers.length = 0;
      }
      runIlluCycle();

      // ── ФЕЙКОВАЯ загрузка с КАСТОМНОЙ кривой (портирована из Tekom-прелоадера,
      // «хорошо работает» по словам user): быстрый старт → ПЛАТО ~50% (приторма-
      // живание) → резкое ускорение через ~70% → плавный выход к 100. НЕ привязано
      // к байтам (реальный прогресс на fast/local выглядел рвано). Видео стартует
      // на подъёме, контент догружается по ходу. Кривая = LOAD_POINTS [время 0..1,
      // прогресс 0..1] (CSS linear()-спека) — правь точки чтобы двигать плато/ускор. ──
      var LOAD_POINTS = [
        [0.0, 0],
        [0.02, 0.0014],
        [0.04, 0.0062],
        [0.06, 0.0163],
        [0.08, 0.0346],
        [0.1, 0.068],
        [0.12, 0.1295],
        [0.14, 0.2151],
        [0.16, 0.2831],
        [0.18, 0.33],
        [0.2, 0.3641],
        [0.22, 0.3903],
        [0.24, 0.4111],
        [0.26, 0.428],
        [0.28, 0.442],
        [0.3, 0.4536],
        [0.32, 0.4632],
        [0.34, 0.4714],
        [0.36, 0.4781],
        [0.38, 0.4838],
        [0.4, 0.4884],
        [0.42, 0.4921],
        [0.44, 0.4951],
        [0.46, 0.4973],
        [0.48, 0.499],
        [0.5, 0.5],
        [0.52, 0.5004],
        [0.54, 0.5022],
        [0.56, 0.5056],
        [0.58, 0.5114],
        [0.6, 0.5202],
        [0.62, 0.5335],
        [0.64, 0.5541],
        [0.66, 0.5891],
        [0.68, 0.6634],
        [0.7, 0.79],
        [0.72, 0.8568],
        [0.74, 0.8948],
        [0.76, 0.9206],
        [0.78, 0.9395],
        [0.8, 0.9539],
        [0.82, 0.9652],
        [0.84, 0.9741],
        [0.86, 0.9812],
        [0.88, 0.9868],
        [0.9, 0.9912],
        [0.92, 0.9945],
        [0.94, 0.997],
        [0.96, 0.9986],
        [0.98, 0.9996],
        [1.0, 1],
      ];
      function fakeLoadEase(t) {
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        for (var i = 0; i < LOAD_POINTS.length - 1; i++) {
          var p0 = LOAD_POINTS[i],
            p1 = LOAD_POINTS[i + 1];
          if (t >= p0[0] && t <= p1[0]) {
            var k = (t - p0[0]) / (p1[0] - p0[0]);
            return p0[1] + k * (p1[1] - p0[1]);
          }
        }
        return 1;
      }
      var fillState = { v: 0 };
      var revealStarted = false;
      applyFill(0);
      gsap.to(fillState, {
        v: 100,
        duration: CFG.FILL_DUR,
        ease: fakeLoadEase, // кастомная кривая (LOAD_POINTS), не CFG.FILL_EASE
        onUpdate: function () {
          applyFill(fillState.v);
        },
        onComplete: function () {
          startReveal();
        },
      });

      // ── Reveal-сиквенс ──
      function startReveal() {
        if (revealStarted) return;
        revealStarted = true;
        stopIllu(); // остановить illu cycle + clear timers
        clearInterval(dotsTimer);
        gsap.killTweensOf(fillState);
        applyFill(100);
        // % → "ГОТОВО"
        if (percentEl) percentEl.textContent = CFG.READY_LABEL;
        var tl = gsap.timeline({
          onComplete: function () {
            removePre();
            unlockScroll();
          },
        });
        // ── фаза 1: OVERLAY-подход (не трогаем grid cells вообще) ──
        // Берём overlay element (расположен отдельно от grid). Стартовый bbox =
        // точно как у pattern cell (top-right). Анимируем overlay → full viewport.
        // Grid cells остаются на местах, overlay их физически перекрывает (z=5).
        var parentRect = pre.getBoundingClientRect();
        if (overlayEl && patternEl) {
          var patternRect = patternEl.getBoundingClientRect();
          // Старт overlay: точно поверх pattern cell
          gsap.set(overlayEl, {
            display: "flex",
            top: patternRect.top - parentRect.top + "px",
            left: patternRect.left - parentRect.left + "px",
            width: patternRect.width + "px",
            height: patternRect.height + "px",
          });
          // Заполняем overlay % сразу "ГОТОВО" чтобы при скольжении уже было видно
          if (overlayPercentEl) overlayPercentEl.textContent = CFG.READY_LABEL;
          // Скрываем оригинальный pattern (overlay уже сверху него) — нет
          // визуального дубликата при squeeze
          gsap.set(patternEl, { autoAlpha: 0 });

          // Этап 1a: overlay растёт ВЛЕВО — closes width gap from right side
          tl.to(
            overlayEl,
            {
              left: "0px",
              width: parentRect.width + "px",
              duration: CFG.SQUEEZE_DUR,
              ease: ez(CFG.SQUEEZE_EASE),
            },
            ">"
          );
          // Этап 1b: параллельно — внутренние элементы bottom cards slide DOWN+fade
          // с stagger 0.1s. Порядок: L head → L illu → R head → R illu.
          var slideTargets = [
            cardLeftEl && cardLeftEl.querySelector(".card_head"),
            cardLeftEl && cardLeftEl.querySelector(".card_illustration-wrap"),
            cardRightEl && cardRightEl.querySelector(".card_head"),
            cardRightEl && cardRightEl.querySelector(".card_illustration-wrap"),
          ].filter(Boolean);
          if (slideTargets.length) {
            tl.to(
              slideTargets,
              {
                y: CFG.CARD_DOWN_Y,
                autoAlpha: 0,
                duration: CFG.CARD_DOWN_DUR,
                stagger: CFG.CARD_DOWN_STAGGER,
                ease: ez(CFG.CARD_DOWN_EASE),
              },
              "<+0.1"
            );
          }
          // Этап 1c: overlay растёт ВНИЗ — height 50%→100vh (закрывает bottom cells)
          tl.to(
            overlayEl,
            {
              top: "0px",
              height: parentRect.height + "px",
              duration: CFG.PATTERN_DOWN_DUR,
              ease: ez(CFG.PATTERN_DOWN_EASE),
            },
            ">-0.1"
          );
          // Этап 1d: пауза 0.4s — показать "ГОТОВО" центрированным на full viewport
          tl.to({}, { duration: 0.4 });
        }
        // ── фаза 2: видео стартует + ВЕСЬ preloader (включая overlay) yPercent -100 ──
        // ЛЕЙБЛ "riseStart" = момент когда шторка начала уезжать вверх.
        // HERO_LEAD / BTN_LEAD / NAV_LEAD теперь = ЗАДЕРЖКА от riseStart (а не
        // backwards-offset от конца длиннющего параллельного DARKEN_DUR).
        // Меньше LEAD → раньше; больше → позже. Можно даже отрицательное
        // (форс играть ДО старта подъёма).
        tl.add(function () {
          if (heroVideo && heroVideo.play) {
            try {
              heroVideo.play();
            } catch (e) {}
          }
        });
        tl.addLabel("riseStart");
        tl.to(
          pre,
          { yPercent: -100, duration: CFG.RISE_DUR, ease: ez(CFG.RISE_EASE) },
          "riseStart"
        );
        // hero proявляется из темноты + видео scale 1.4→1.0 (параллельно подъёму)
        if (darkEl) {
          tl.fromTo(
            darkEl,
            { backgroundColor: "rgba(0,0,0," + CFG.DARKEN_FROM + ")" },
            {
              backgroundColor: "rgba(0,0,0," + CFG.DARKEN_TO + ")",
              duration: CFG.DARKEN_DUR,
              ease: ez(CFG.DARKEN_EASE),
            },
            "riseStart"
          );
        }
        if (heroVideo) {
          tl.fromTo(
            heroVideo,
            { scale: CFG.SCALE_FROM },
            { scale: 1, duration: CFG.SCALE_DUR, ease: ez(CFG.SCALE_EASE) },
            "riseStart"
          );
        }
        // фаза 5 — заголовок+описание hero плашками. HERO_LEAD = задержка после
        // riseStart (0 = одновременно со стартом подъёма; 1.4 = когда подъём
        // закончился; 0.5 = посередине).
        tl.add(function () {
          if (heroSection) playHeadingsRevealIn(heroSection);
        }, "riseStart+=" + CFG.HERO_LEAD);
        // фаза 5b — hero-кнопка fade-up. BTN_LEAD = задержка после riseStart.
        tl.add(function () {
          if (heroBtn) {
            gsap.fromTo(
              heroBtn,
              { autoAlpha: 0, y: "0.6em" },
              { autoAlpha: 1, y: 0, duration: CFG.BTN_DUR, ease: ez(CFG.BTN_EASE) }
            );
          }
        }, "riseStart+=" + CFG.BTN_LEAD);
        // фаза 6 — nav. NAV_LEAD = задержка после riseStart.
        tl.add(function () {
          if (navItems.length) {
            gsap.to(navItems, {
              autoAlpha: 1,
              duration: CFG.NAV_DUR,
              stagger: CFG.NAV_STAGGER,
              ease: ez(CFG.NAV_EASE),
            });
          }
        }, "riseStart+=" + CFG.NAV_LEAD);
      }

      // Failsafe: если fill-твин/reveal не завершились (ошибка) — жёстко
      // показываем страницу. Норма: fill onComplete → startReveal.
      setTimeout(
        function () {
          showAllInstant();
          if (heroSection) playHeadingsRevealIn(heroSection);
          removePre();
          unlockScroll();
        },
        (CFG.FILL_DUR + CFG.SQUEEZE_DUR + CFG.RISE_DUR + 4) * 1000
      );
    }
    function initButtonHover() {
      if (!has.gsap) return;
      document.querySelectorAll(".button-wrap").forEach((btn) => {
        const arrow = btn.querySelector(".icon-arrow:not(.is-absolute)");
        const arrowNew = btn.querySelector(".icon-arrow.is-absolute");
        const text = btn.querySelector(".button-text:not(.is-absolute)");
        const textNew = btn.querySelector(".button-text.is-absolute");
        const hoverTl = gsap.timeline({ paused: true });
        if (arrow && arrowNew) {
          hoverTl.to([arrow, arrowNew], { x: "100%", duration: 0.4, ease: CARD_EASE }, 0);
        }
        if (text && textNew) {
          hoverTl.to([text, textNew], { y: "-100%", duration: 0.4, ease: CARD_EASE }, 0);
        }
        btn.addEventListener("mouseenter", () => hoverTl.play());
        btn.addEventListener("mouseleave", () => hoverTl.reverse());
      });
    }
    function initHoverTextMirror() {
      document.querySelectorAll(".nav_item, .nav_contact").forEach((el) => {
        if (el.hasAttribute("data-text")) return;
        const inner = el.querySelector(".nav_item-text");
        const text = (inner ? inner.textContent : el.textContent).trim();
        if (text) el.setAttribute("data-text", text);
      });
    }
    function initFooterLinkHover() {
      document.querySelectorAll(".footer-link").forEach((link) => {
        if (link.querySelector(".footer-link_dup")) return;
        const text = link.querySelector(".text_size-small");
        if (!text) return;
        const dup = text.cloneNode(true);
        dup.classList.add("footer-link_dup");
        dup.setAttribute("aria-hidden", "true");
        link.appendChild(dup);
      });
    }
    function initNavThemeScroll() {
      // ⭐ Idempotent: на каждом Barba-переходе функция вызывается заново
      // (nav persistent вне контейнера). Без cleanup старые scroll/resize
      // listeners КОПЯТСЯ — каждый держит detached sections предыдущей
      // страницы и persistent nav → утечка + потенциальный race за data-theme-
      // nav при смене страниц (особенно на главную). Снимаем прошлые listeners.
      if (window.__cctpNavThemeCleanup) {
        window.__cctpNavThemeCleanup();
        window.__cctpNavThemeCleanup = null;
      }
      const navBar = document.querySelector("[data-nav-bar-height]");
      const offset = navBar ? navBar.offsetHeight : 0;
      // ⭐ Фильтруем position:fixed — фикс-оверлеи (например #cap-stage WebGL-
      // сцены, top 83px) ВСЕГДА пересекают линию навбара → тема застревала на
      // dark для всего, что в DOM ниже оверлея (Products и дальше). Тему навбара
      // определяют только секции в потоке документа.
      const sections = Array.from(document.querySelectorAll("[data-theme-section]"))
        .filter((el) => getComputedStyle(el).position !== "fixed");
      const navTargets = document.querySelectorAll("[data-theme-nav]");
      function syncNavHeightVar() {
        const h = navBar ? navBar.offsetHeight : 0;
        document.documentElement.style.setProperty("--cctp-nav-height", h + "px");
      }
      syncNavHeightVar();
      if (!sections.length || !navTargets.length) return;
      function setTheme(theme) {
        if (!theme) return;
        navTargets.forEach((el) => {
          if (el.getAttribute("data-theme-nav") !== theme) {
            el.setAttribute("data-theme-nav", theme);
          }
        });
      }
      function update() {
        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom >= offset) {
            setTheme(sec.getAttribute("data-theme-section"));
            return;
          }
        }
        // ⭐ Fallback: ни одна секция не пересекает линию навбара (sub-pixel
        // граница / padding-top страницы / момент до settling scroll после
        // Barba). Берём ПЕРВУЮ видимую секцию (rect.top < viewport.bottom),
        // т.е. ту что наверху — иначе тема «застревает» на чужой (баг при
        // переходе с главной: оставалась hero/dark и не менялась).
        const vh = window.innerHeight;
        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          if (rect.bottom > offset && rect.top < vh) {
            setTheme(sec.getAttribute("data-theme-section"));
            return;
          }
        }
      }
      let ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
      update();
      // ⭐ Повторные update после settling: scroll сбрасывается lenis'ом
      // асинхронно после Barba arrival; первый update мог прочитать СТАРУЮ
      // позицию (под навбаром чужая секция → неправильная тема). Re-check.
      requestAnimationFrame(update);
      setTimeout(update, 200);
      setTimeout(update, 500);
      document.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      window.addEventListener("resize", syncNavHeightVar, { passive: true });
      // Сохраняем cleanup для следующего вызова (idempotency).
      window.__cctpNavThemeCleanup = function () {
        document.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        window.removeEventListener("resize", syncNavHeightVar);
      };
    }
    function initHeroScrollDarken() {
      if (!has.ScrollTrigger) return;
      document.querySelectorAll(".section_hero").forEach((section) => {
        const overlay = section.querySelector(".hero_scroll-darken");
        if (!overlay) return;
        gsap.fromTo(
          overlay,
          { opacity: 0 },
          {
            opacity: 0.95,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom 20%",
              // animation completes when bottom of hero reaches 20% from top of viewport ≈ 80% scrolled
              scrub: true,
            },
          }
        );
      });
    }
    function initScrollTextFill() {
      if (!has.ScrollTrigger) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      document.querySelectorAll('[data-anim="text-fill"]').forEach((el) => {
        const text = el.textContent.trim();
        if (!text) return;
        el.textContent = "";
        const words = text.split(/\s+/).map((word, i) => {
          if (i > 0) el.appendChild(document.createTextNode(" "));
          const span = document.createElement("span");
          span.className = "text-fill-word";
          span.textContent = word;
          el.appendChild(span);
          return span;
        });
        gsap.fromTo(
          words,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            duration: 1,
            stagger: 0.4,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      });
    }
    function initScroller() {
      if (!has.ScrollTrigger) return;
      const SHOWN = "inset(0% 0% 0% 0%)";
      const HIDDEN = "inset(100% 0% 0% 0%)";
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // ≤479px: пинённый скруб не нужен — показываем статичный .scroller_mobile
      // (CSS прячет .scroller_slides). Скруб скипаем как при reduced-motion.
      const isMobile = window.matchMedia("(max-width: 479px)").matches;
      document.querySelectorAll("[data-scroller]").forEach((root) => {
        const media = root.querySelectorAll("[data-scroller-media]");
        const track = root.querySelector("[data-scroller-track]");
        const outer = root.parentElement;
        const n = media.length;
        if (n < 2 || !track || !outer) return;
        media.forEach((m, i) => gsap.set(m, { clipPath: i === 0 ? SHOWN : HIDDEN, zIndex: i }));
        gsap.set(track, { yPercent: 0 });
        if (reduced || isMobile) {
          outer.style.height = "auto";
          return;
        }
        const navHeight = () => {
          var _a;
          return ((_a = document.querySelector(".nav")) == null ? void 0 : _a.offsetHeight) || 0;
        };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: outer,
            start: () => "top top+=" + navHeight(),
            end: "bottom bottom",
            scrub: true,
          },
        });
        for (let i = 1; i < n; i++) {
          tl.to(media[i], { clipPath: SHOWN, ease: "none", duration: 1 }, i - 1);
          tl.to(track, { yPercent: (-100 / n) * i, ease: "none", duration: 1 }, i - 1);
        }
      });
    }
    function initGlobalParallax() {
      if (!has.gsap || !has.ScrollTrigger) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          isMobile: "(max-width:479px)",
          isMobileLandscape: "(max-width:767px)",
          isTablet: "(max-width:991px)",
          isDesktop: "(min-width:992px)",
        },
        (context) => {
          const { isMobile, isMobileLandscape, isTablet } = context.conditions;
          const ctx = gsap.context(() => {
            document.querySelectorAll('[data-parallax="trigger"]').forEach((trigger) => {
              const disable = trigger.getAttribute("data-parallax-disable");
              if (
                (disable === "mobile" && isMobile) ||
                (disable === "mobileLandscape" && isMobileLandscape) ||
                (disable === "tablet" && isTablet)
              )
                return;
              const target = trigger.querySelector('[data-parallax="target"]') || trigger;
              const direction = trigger.getAttribute("data-parallax-direction") || "vertical";
              const prop = direction === "horizontal" ? "xPercent" : "yPercent";
              const scrubAttr = trigger.getAttribute("data-parallax-scrub");
              const scrub = scrubAttr ? parseFloat(scrubAttr) : true;
              const startAttr = trigger.getAttribute("data-parallax-start");
              const startVal = startAttr !== null ? parseFloat(startAttr) : 20;
              const endAttr = trigger.getAttribute("data-parallax-end");
              const endVal = endAttr !== null ? parseFloat(endAttr) : -20;
              const scrollStart = `clamp(${trigger.getAttribute("data-parallax-scroll-start") || "top bottom"})`;
              const scrollEnd = `clamp(${trigger.getAttribute("data-parallax-scroll-end") || "bottom top"})`;
              gsap.fromTo(
                target,
                { [prop]: startVal },
                {
                  [prop]: endVal,
                  ease: "none",
                  scrollTrigger: { trigger, start: scrollStart, end: scrollEnd, scrub },
                }
              );
            });
          });
          return () => ctx.revert();
        }
      );
    }
    function initScrollCardShapes() {
      if (!has.ScrollTrigger) return;
      const shapes = [
        { sel: ".shape.is-1", scale: 1, x: 0, position: 0 },
        { sel: ".shape.is-2", scale: 11 / 12, x: 25, position: 0.02 },
        { sel: ".shape.is-3", scale: 10 / 12, x: 45, position: 0.04 },
        { sel: ".shape.is-4", scale: 11 / 12, x: -25, position: 0.02 },
        { sel: ".shape.is-5", scale: 10 / 12, x: -45, position: 0.04 },
      ];
      const engShapes = [
        { sel: ".shape-engineering.is-1", rotation: 45 },
        { sel: ".shape-engineering.is-2", rotation: -45 },
        { sel: ".shape-engineering.is-3", rotation: 0 },
        { sel: ".shape-engineering.is-4", rotation: 90 },
      ];
      const vaultShapes = [
        { sel: ".shape-vault.is-1", rotation: 0 },
        { sel: ".shape-vault.is-2", rotation: 45 },
        { sel: ".shape-vault.is-3", rotation: 90 },
        { sel: ".shape-vault.is-4", rotation: -135 },
      ];
      // Stack: 3 копии разного размера, диагональный offset. Координаты scale+x+y
      // выведены из композита user'а (см. reference-fanout-icon-animation).
      const stackShapes = [
        { sel: ".shape-stack.is-1", scale: 1.0,  x:  21.5, y:  9   },
        { sel: ".shape-stack.is-2", scale: 0.79, x:  -9.5, y: 21   },
        { sel: ".shape-stack.is-3", scale: 0.64, x: -35.5, y: 30.5 },
      ];
      // Bloom: 4 концентрические копии. Стартуют at scale 0.6 (medium), стагером
      // расходятся к крайним размерам — is-1/is-2 shrink, is-3/is-4 grow.
      const bloomShapes = [
        { sel: ".shape-bloom.is-1", scale: 0.25 },
        { sel: ".shape-bloom.is-2", scale: 0.47 },
        { sel: ".shape-bloom.is-3", scale: 0.69 },
        { sel: ".shape-bloom.is-4", scale: 1.0  },
      ];
      const BLOOM_START_SCALE = 0.6;
      const BLOOM_HOVER_SHRINK = 0.92;
      // Trace: 2 копии shield (solid is-1 = факт + dashed is-2 = прогноз). Step-forward
      // reveal — стартуют overlap'ом в центре, dashed едет влево первой, solid вправо
      // со стагером 0.15s. Координаты из композита user'а.
      const traceShapes = [
        { sel: ".shape-trace.is-1", x:   7, delay: 0.15 }, // solid = факт
        { sel: ".shape-trace.is-2", x: -31, delay: 0    }, // dashed = прогноз, первая
      ];
      const serviceShapes = [
        { sel: ".shape-service.is-1", x: 60, y: 0 },
        { sel: ".shape-service.is-2", x: 40, y: 5 },
        { sel: ".shape-service.is-3", x: 20, y: 10 },
        { sel: ".shape-service.is-4", x: 0, y: 15 },
      ];
      document.querySelectorAll(".card_wrap").forEach((card) => {
        const tl = gsap.timeline({ paused: true });
        shapes.forEach(({ sel, scale, x, position }) => {
          const el = card.querySelector(sel);
          if (!el) return;
          tl.fromTo(
            el,
            { scale: 0.8, x: 0 },
            { scale, x, duration: 0.6, ease: CARD_EASE },
            position
          );
        });
        engShapes.forEach(({ sel, rotation }) => {
          const el = card.querySelector(sel);
          if (!el) return;
          tl.fromTo(
            el,
            { scale: 0.8, rotation: 0 },
            { scale: 1, rotation, duration: 0.6, ease: CARD_EASE },
            0.2
          );
        });
        vaultShapes.forEach(({ sel, rotation }) => {
          const el = card.querySelector(sel);
          if (!el) return;
          tl.fromTo(
            el,
            { scale: 0.8, rotation: 0 },
            { scale: 1, rotation, duration: 0.6, ease: CARD_EASE },
            0.2
          );
        });
        stackShapes.forEach(({ sel, scale, x, y }) => {
          const el = card.querySelector(sel);
          if (!el) return;
          tl.fromTo(
            el,
            { scale: 0.8, x: 0, y: 0 },
            { scale, x, y, duration: 0.8, ease: CARD_EASE },
            0.4
          );
        });
        bloomShapes.forEach(({ sel, scale }, i) => {
          const el = card.querySelector(sel);
          if (!el) return;
          tl.fromTo(
            el,
            { scale: BLOOM_START_SCALE },
            { scale, duration: 0.6, ease: CARD_EASE },
            0.2 + i * 0.05
          );
        });
        traceShapes.forEach(({ sel, x, delay }) => {
          const el = card.querySelector(sel);
          if (!el) return;
          tl.fromTo(
            el,
            { scale: 0.8, x: 0 },
            { scale: 1, x, duration: 0.6, ease: CARD_EASE },
            0.2 + delay
          );
        });
        serviceShapes.forEach(({ sel, x, y }) => {
          const el = card.querySelector(sel);
          if (!el) return;
          tl.fromTo(
            el,
            { x: 0, y: 0, rotation: 0 },
            { x, y, rotation: 45, duration: 0.8, ease: CARD_EASE },
            0.4
          );
        });
        ScrollTrigger.create({
          trigger: card,
          start: "center bottom",
          end: "bottom top",
          animation: tl,
          // enter → play forward; leave → play reverse (smooth retreat, no snap).
          // `play`/`reverse` continue from current time so rapid scroll just flips
          // direction instead of jumping to an endpoint.
          toggleActions: "play reverse play reverse",
        });
        const HOVER_DURATION = 0.3;
        const hoverTl = gsap.timeline({ paused: true });
        const DRIFT_RATIO = 0.7;
        const sh2 = card.querySelector(".shape.is-2");
        const sh3 = card.querySelector(".shape.is-3");
        const sh4 = card.querySelector(".shape.is-4");
        const sh5 = card.querySelector(".shape.is-5");
        if (sh2)
          hoverTl.to(sh2, { x: 25 * DRIFT_RATIO, duration: HOVER_DURATION, ease: CARD_EASE }, 0);
        if (sh4)
          hoverTl.to(sh4, { x: -25 * DRIFT_RATIO, duration: HOVER_DURATION, ease: CARD_EASE }, 0);
        if (sh3)
          hoverTl.to(sh3, { x: 45 * DRIFT_RATIO, duration: HOVER_DURATION, ease: CARD_EASE }, 0.1);
        if (sh5)
          hoverTl.to(sh5, { x: -45 * DRIFT_RATIO, duration: HOVER_DURATION, ease: CARD_EASE }, 0.1);
        const eng1 = card.querySelector(".shape-engineering.is-1");
        const eng2 = card.querySelector(".shape-engineering.is-2");
        if (eng1) hoverTl.to(eng1, { scale: 0.8, duration: HOVER_DURATION, ease: CARD_EASE }, 0);
        if (eng2) hoverTl.to(eng2, { scale: 0.9, duration: HOVER_DURATION, ease: CARD_EASE }, 0.05);
        vaultShapes.forEach(({ sel, rotation }, i) => {
          const el = card.querySelector(sel);
          if (!el) return;
          hoverTl.to(
            el,
            { rotation: rotation + 15, duration: HOVER_DURATION, ease: CARD_EASE },
            i * 0.05
          );
        });
        const SERVICE_PULL = 0.3;
        const is1Rest = { x: 60, y: 0 };
        const svcStagger = [
          { sel: ".shape-service.is-2", rest: { x: 40, y: 5 }, at: 0 },
          { sel: ".shape-service.is-3", rest: { x: 20, y: 10 }, at: 0.1 },
          { sel: ".shape-service.is-4", rest: { x: 0, y: 15 }, at: 0.15 },
        ];
        svcStagger.forEach(({ sel, rest, at }) => {
          const el = card.querySelector(sel);
          if (!el) return;
          hoverTl.to(
            el,
            {
              x: rest.x + (is1Rest.x - rest.x) * SERVICE_PULL,
              y: rest.y + (is1Rest.y - rest.y) * SERVICE_PULL,
              duration: HOVER_DURATION,
              ease: CARD_EASE,
            },
            at
          );
        });
        // Stack hover: is-2 и is-3 подтягиваются к is-1 (anchor) на SERVICE_PULL,
        // стагер 0/0.1s. Принцип = service hover, но для 3 копий.
        const stackAnchor = stackShapes[0];
        [stackShapes[1], stackShapes[2]].forEach((s, i) => {
          const el = card.querySelector(s.sel);
          if (!el) return;
          hoverTl.to(
            el,
            {
              x: s.x + (stackAnchor.x - s.x) * SERVICE_PULL,
              y: s.y + (stackAnchor.y - s.y) * SERVICE_PULL,
              duration: HOVER_DURATION,
              ease: CARD_EASE,
            },
            i * 0.1
          );
        });
        // Bloom hover: каждая копия scale × 0.92 (лёгкое сужение ~8%),
        // стагер 0/0.05/0.10/0.15s по индексу.
        bloomShapes.forEach(({ sel, scale }, i) => {
          const el = card.querySelector(sel);
          if (!el) return;
          hoverTl.to(
            el,
            { scale: scale * BLOOM_HOVER_SHRINK, duration: HOVER_DURATION, ease: CARD_EASE },
            i * 0.05
          );
        });
        // Trace hover: pull-together — dashed (is-2) едет вправо, solid (is-1) влево,
        // оба сближаются к середине между ними на SERVICE_PULL=0.3, стагер 0/0.1s.
        const traceSolid = traceShapes[0];   // is-1
        const traceDashed = traceShapes[1];  // is-2
        const traceDashedEl = card.querySelector(traceDashed.sel);
        const traceSolidEl = card.querySelector(traceSolid.sel);
        if (traceDashedEl) {
          hoverTl.to(
            traceDashedEl,
            {
              x: traceDashed.x + (traceSolid.x - traceDashed.x) * SERVICE_PULL,
              duration: HOVER_DURATION,
              ease: CARD_EASE,
            },
            0
          );
        }
        if (traceSolidEl) {
          hoverTl.to(
            traceSolidEl,
            {
              x: traceSolid.x + (traceDashed.x - traceSolid.x) * SERVICE_PULL,
              duration: HOVER_DURATION,
              ease: CARD_EASE,
            },
            0.1
          );
        }
        card.addEventListener("mouseenter", () => {
          if (tl.isActive() || tl.progress() < 1) return;
          hoverTl.play();
        });
        card.addEventListener("mouseleave", () => {
          if (hoverTl.progress() > 0) hoverTl.reverse();
        });
      });
    }
    function loadWebglIfNeeded() {
      // Lazy-load the WebGL drill-string scene bundle (~630 KB + GLB 1.6 MB +
      // matcaps) only when its section nears the viewport — mirrors
      // loadMapboxIfNeeded. Disposed on Barba leave (beforeLeave) → re-injected
      // on home re-entry. На главной секция глубоко внизу → IO не фирится пока
      // активен прелоадер (нет конфликта с залоченным скроллом).
      const section = document.querySelector(".section_webgl");
      if (!section) return;
      // (Ранний скраб-пин для тача УДАЛЁН 07-14: мобилка перешла на step-режим
      //  как на десктопе — без пина и спейсера вовсе. Нет пина → нет поздней
      //  вставки геометрии → нечему дёргать при холодном подъезде. Пин остаётся
      //  только в scrub-fallback для конфигов со stepMode=false.)
      if (window.__sstr) return;            // уже живёт
      if (window.__cctpWebglLoading) return;
      const inject = () => {
        if (window.__cctpWebglLoading || window.__sstr) return;
        window.__cctpWebglLoading = true;
        const old = document.getElementById("sstr-scene-script");
        if (old) old.remove();
        const script = document.createElement("script");
        script.id = "sstr-scene-script";
        script.src = "/webgl/sstr-scene.js?v=20260714n";
        script.onload = () => {
          if (window.__sstr && window.__sstr.ready) wireWebglScrollDriver();
          else window.addEventListener("sstr:ready", wireWebglScrollDriver, { once: true });
        };
        script.onerror = () => {
          console.warn("[CCTP] sstr-scene.js failed to load");
          window.__cctpWebglLoading = false;
        };
        document.body.appendChild(script);
      };
      if (!("IntersectionObserver" in window)) {
        inject();
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              io.disconnect();
              inject();
              break;
            }
          }
        },
        { rootMargin: "100% 0px" }   // ⚠️ IO не принимает vh — % от viewport
      );
      io.observe(section);
      // Perf: прелоад в idle после полной загрузки страницы — на медленной сети
      // юзер иначе мог доскроллить до секции раньше готовности сцены. Сцена
      // сама останавливает rAF вне вьюпорта (renderPaused), так что ранний
      // inject не жжёт GPU. inject идемпотентен (__cctpWebglLoading guard).
      const idlePreload = () => {
        const schedule = window.requestIdleCallback
          ? (fn) => window.requestIdleCallback(fn, { timeout: 6000 })
          : (fn) => setTimeout(fn, 3500);
        schedule(() => { io.disconnect(); inject(); });
      };
      if (document.readyState === "complete") idlePreload();
      else window.addEventListener("load", idlePreload, { once: true });
    }
    // ── WebGL scroll: helpers на уровне модуля ─────────────────────────────
    // (вынесены из wireWebglScrollDriver, т.к. pin-геометрия для тача создаётся
    //  РАНЬШЕ загрузки сцены — см. ensureWebglScrubST)
    // Тач-детекция: `(hover:hover) and (pointer:fine)` ЛОЖНО=true на многих
    // Android/встроенных браузерах → комбинируем признаки (07-14).
    function isTouchLikeDevice() {
      const hasTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0) || !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      const smallScreen = !!(window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
      return hasTouch || smallScreen;
    }
    const depthEl = () => document.getElementById("depth-ui");
    const skipEl = () => document.getElementById("skip-cta");
    const backEl = () => document.getElementById("back-cta");
    // Snap тач-скраба к СТОПАМ сцены (те же точки, что step-режим на десктопе:
    // scrubState.stops → progressAtKf). ЯВНЫЙ механизм на ScrollTrigger
    // "scrollEnd" + lenis.scrollTo — встроенный snap ScrollTrigger'а ненадёжен
    // в связке с Lenis (не файрится). Палец отпущен → инерция докатилась →
    // scrollEnd → мягкая доводка к ближайшему стопу. Само-завершается: доводка
    // кончается НА стопе → повторный scrollEnd попадает в guard |Δ|<6px.
    function webglTouchSnapOnScrollEnd() {
      const st = window.__cctpWebglST, s = window.__sstr;
      if (!st || !st.isActive || !s || window.__cctpWebglMode === "step") return;
      if (!s.scrubState || !Array.isArray(s.scrubState.stops) || !s.scrubState.stops.length || typeof s.progressAtKf !== "function") return;
      const span = st.end - st.start;
      if (!(span > 0)) return;
      const p = (window.scrollY - st.start) / span;
      let best = null, bd = Infinity;
      for (const k of s.scrubState.stops) {
        const sp = s.progressAtKf(k);
        const d = Math.abs(sp - p);
        if (d < bd) { bd = d; best = sp; }
      }
      if (best == null) return;
      const targetY = Math.round(st.start + best * span);
      if (Math.abs(window.scrollY - targetY) < 6) return;   // уже на стопе
      if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
        window.__lenis.scrollTo(targetY, { duration: 0.55, easing: (t) => 1 - Math.pow(1 - t, 3) });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
    // Pinned scrub-ST. Для ТАЧА создаётся на INIT (до загрузки сцены): pin-спейсер
    // в лейауте с первой отрисовки → нет вставки спейсера + ScrollTrigger.refresh()
    // посреди подъезда юзера к секции. Именно поздний refresh давал «резкий рывок
    // на ~70% видимости» — см. предупреждение в installScrollTriggerRefreshGuards
    // («refresh во время скролла = видимое дёргание»). Идемпотентна.
    // Тач: end 700% (больше хода на 15 точек — флик не пролетает всю сцену) +
    // snap к стопам (мобильный аналог step-режима: инерция едет, потом мягкая
    // доводка к ближайшему стопу). Desktop-fallback: прежние 400% без снапа.
    function ensureWebglScrubST() {
      if (window.__cctpWebglST) return window.__cctpWebglST;
      if (!(window.gsap && window.ScrollTrigger)) return null;
      if (!document.querySelector(".section_webgl")) return null;
      const prev = window.ScrollTrigger.getById && window.ScrollTrigger.getById("cctp-webgl-scrub");
      if (prev) { window.__cctpWebglST = prev; return prev; }   // Barba re-enter: жив со старого визита
      const touch = isTouchLikeDevice();
      window.__cctpWebglSTEarly = !window.__sstr;   // создан ДО сцены → refresh при wire не нужен
      const st = window.ScrollTrigger.create({
        id: "cctp-webgl-scrub",
        trigger: ".section_webgl",
        start: "top top",
        end: touch ? "+=700%" : "+=400%",
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => { if (window.__sstr) window.__sstr.scrubState.progress = self.progress; },
        onToggle: (self) => animateWebglOverlays(self.isActive),
      });
      window.__cctpWebglST = st;
      if (touch && !window.__cctpWebglSnapBound) {
        window.__cctpWebglSnapBound = true;
        window.ScrollTrigger.addEventListener("scrollEnd", webglTouchSnapOnScrollEnd);
        window.__cctpWebglSnapNow = webglTouchSnapOnScrollEnd;   // ручной вызов для отладки
      }
      return st;
    }
    function animateWebglOverlays(entering) {
      // Фикс-оверлеи (position:fixed, инжектятся сценой в <body>) живут только
      // пока pin-секция активна. Подписи + scroll-hint гейтит САМА сцена через
      // setOverlaysActive. Шкала глубины + кнопки — GSAP здесь. До загрузки
      // сцены элементов нет — все обращения null-guarded.
      const g = window.gsap;
        // Awwwards-плашка (.awwwards-ribbon, fixed right/center) пересекается
        // со шкалой глубины #depth-ui (fixed right, 172px) на невысоких
        // вьюпортах. Гейтим её тем же переключателем, что и остальные
        // оверлеи сцены: CSS-правило body[data-webgl-scene] .awwwards-ribbon.
        if (entering) document.body.setAttribute("data-webgl-scene", "");
        else document.body.removeAttribute("data-webgl-scene");
        if (window.__sstr && window.__sstr.setOverlaysActive) window.__sstr.setOverlaysActive(entering);
        const depth = depthEl();
        const skip = skipEl();
        const back = backEl();
        if (!g) {
          [depth, skip, back].forEach((el) => { if (el) el.style.visibility = entering ? "" : "hidden"; });
          return;
        }
        if (depth) {
          const sqs = depth.querySelectorAll(".depth-sq");
          const arrow = depth.querySelector(".depth-arrow");
          g.killTweensOf(sqs);
          if (arrow) g.killTweensOf(arrow);
          if (entering) {
            depth.style.visibility = "";
            g.fromTo(sqs, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", stagger: { grid: [12, 4], axis: "y", from: "start", amount: 0.5 } });
            if (arrow) g.fromTo(arrow, { autoAlpha: 0, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" });
          } else {
            g.to(sqs, { opacity: 0, scale: 0.3, duration: 0.3, ease: "power2.in", stagger: { grid: [12, 4], axis: "y", from: "end", amount: 0.5 } });
            if (arrow) g.to(arrow, { autoAlpha: 0, x: 8, duration: 0.35, ease: "power2.in" });
            g.delayedCall(0.85, () => { const d = depthEl(); if (d) d.style.visibility = "hidden"; });
          }
        }
        if (skip) {
          g.killTweensOf(skip);
          if (entering) {
            skip.style.visibility = "";
            g.fromTo(skip, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
          } else {
            g.to(skip, { autoAlpha: 0, y: 12, duration: 0.4, ease: "power2.in", onComplete: () => { const s = skipEl(); if (s) s.style.visibility = "hidden"; } });
          }
        }
        if (back) {
          g.killTweensOf(back);
          if (entering) {
            back.style.visibility = "";
            g.fromTo(back, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
          } else {
            g.to(back, { autoAlpha: 0, y: 12, duration: 0.4, ease: "power2.in", onComplete: () => { const b = backEl(); if (b) b.style.visibility = "hidden"; } });
          }
        }
    }
    function wireWebglScrollDriver() {
      // Драйвер: pinned-секция + ScrollTrigger scrub → scrubState.progress (0→1),
      // синхронно с Lenis (один rAF уже настроен в initLenis через gsap.ticker).
      const sstr = window.__sstr;
      if (!sstr) return;
      window.__cctpWebglLoading = false;
      if (!(window.gsap && window.ScrollTrigger)) return;
      // ⚠️ НЕ трогаем scrubState.inertia/ease/dwellFrac — они приходят из
      // scene-config (inertia 0.02 / sine.inOut / dwell 0). Глайд (низкая
      // инерция) и есть плавность сцены.
      // Оффсет под навбар делает САМА сцена (scene-config view.navInset=83 →
      // applyViewInset сдвигает canvas + #cap-stage, рендер в usableH).
      //
      // ДВА драйвера (решение с клиентом, cctp-webgl step-mode):
      //  · STEP-MODE (desktop, мышь/тачпад): «1 жест = полёт к следующему стопу»,
      //    ввод заблокирован в полёте. Секция НЕ пинится ScrollTrigger'ом —
      //    вместо этого СКРОЛЛ-ЛОК: при входе секции lenis.stop() (страница
      //    стоит), wheel-жесты ест сцена (её родная жест-детекция + stepTo);
      //    на краю (последний/первый стоп) жест наружу → unlock, Lenis едет
      //    дальше. Re-lock при возврате секции (onEnter/onEnterBack) с грейсом.
      //  · SCRUB (fallback: touch-девайсы или stepMode=false в конфиге):
      //    прежний pinned ScrollTrigger scrub → scrubState.progress.
      // Мобильный навбар НИЖЕ десктопного (реально 67px против navInset 83 из
      // конфига) → канвас/подписи смещались на 16px, сверху оставалась полоса
      // («белое пятно/паддинг в районе навигации», клиент 07-14). Меряем РЕАЛЬНУЮ
      // высоту фиксированного .nav и синкаем сцену (viewState + applyViewInset
      // экспортированы).
      try {
        const navEl = document.querySelector(".nav");
        const navH = navEl ? Math.round(navEl.getBoundingClientRect().height) : 0;
        if (navH > 0 && sstr.viewState && Math.abs((sstr.viewState.navInset || 0) - navH) > 1) {
          sstr.viewState.navInset = navH;
          if (typeof sstr.applyViewInset === "function") sstr.applyViewInset();
        }
      } catch (e) {}
      // Step-логика ЕДИНА для десктопа и тача (клиент 07-14: «логика абсолютно
      // такая же, как на десктопе должна быть»): один жест = полёт ровно к
      // СЛЕДУЮЩЕЙ точке, сила жеста не важна, в полёте ввод глотается — после
      // каждой точки нужен НОВЫЙ жест. Отличается только источник жеста:
      // wheel (десктоп) / свайп touchstart→touchend (тач, байндинг ниже).
      const useStep = !!(sstr.scrubState && sstr.scrubState.stepMode);
      const touchInput = isTouchLikeDevice();
      window.__cctpWebglMode = useStep ? "step" : "scrub";
      if (touchInput) {
        // OrbitControls (даже disabled) в КОНСТРУКТОРЕ ставит canvas
        // touchAction='none' → канвас-на-весь-экран глотал тач-пан («скролл не
        // работает ни вверх ни вниз»). ВНЕ лока скролл должен проходить сквозь
        // канвас → pan-y; lock()/unlock() ниже переключают none/pan-y.
        const cv = document.getElementById("sstr-canvas");
        if (cv) cv.style.touchAction = "pan-y";
      }
      if (useStep) {
        let locked = false;
        let unlockGraceUntil = 0;
        const lockY = () => {
          const sec = document.querySelector(".section_webgl");
          if (!sec) return null;
          return Math.round(sec.getBoundingClientRect().top + window.scrollY);
        };
        let lockedAtY = 0;
        // Яркий inOut: резвый разгон, плавное торможение (фидбек: sine слишком
        // «линейный»). Общий для доводок лока и авто-прокруток.
        const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const lock = (fromBack) => {
          if (locked || performance.now() < unlockGraceUntil || !window.__sstr) return;
          locked = true;
          window.__cctpWebglLocked = true;
          // Тач: в локе глушим нативный скролл ДЕТЕРМИНИРОВАННО — touch-action:none
          // на канвасе (весь экран). Свайпы при этом ПРИХОДЯТ touch-событиями
          // (жест-детекция ниже) — браузер просто не скроллит страницу.
          // (lenis.stop() нативный тач-скролл НЕ останавливает — smoothWheel-only.)
          { const cvL = document.getElementById("sstr-canvas"); if (cvL) cvL.style.touchAction = "none"; }
          const y = lockY();
          lockedAtY = y != null ? y : window.scrollY;
          const lenis = window.__lenis;
          // «Стоп на первом тексте»: хвост инерции жеста, которым доскроллили до
          // секции, сцена считала бы жестом → камера сразу улетала к FRS. Карантин
          // 800мс (родной механизм settle сцены) глотает хвост: юзер читает первую
          // подпись, к FRS ведёт только СЛЕДУЮЩИЙ осознанный жест. Симметрично и
          // для обратного входа (не шагает назад от хвоста).
          if (window.__sstr.cancelStep) try { window.__sstr.cancelStep(800); } catch (e) {}
          const dur = fromBack ? 0.9 : 0.5;
          if (lenis) {
            // Мягкая доводка вместо мгновенного снапа. lock:true глушит ввод на
            // время доводки; stop — по завершении. Failsafe: если onComplete не
            // сработал — принудительный stop.
            if (y != null) {
              lenis.scrollTo(y, { duration: dur, lock: true, force: true, easing: easeInOutCubic, onComplete: () => { if (locked) lenis.stop(); } });
              setTimeout(() => { if (locked && !lenis.isStopped) { lenis.scrollTo(y, { immediate: true, force: true }); lenis.stop(); } }, dur * 1000 + 250);
            } else {
              lenis.stop();
            }
          } else if (y != null) {
            window.scrollTo(0, y);
          }
          animateWebglOverlays(true);
        };
        const unlock = () => {
          if (!locked) return;
          locked = false;
          window.__cctpWebglLocked = false;
          { const cvU = document.getElementById("sstr-canvas"); if (cvU) cvU.style.touchAction = "pan-y"; }   // скролл снова сквозь канвас
          unlockGraceUntil = performance.now() + 900;
          animateWebglOverlays(false);
          if (window.__lenis) window.__lenis.start();
        };
        window.__cctpWebglUnlock = unlock;   // Barba beforeLeave: принудительный разлок
        const st = window.ScrollTrigger.create({
          trigger: ".section_webgl",
          start: "top top",
          end: "bottom top",
          onEnter: () => lock(false),      // вход сверху (скролл вниз): доводка 0.5с
          onEnterBack: () => lock(true),   // возврат снизу (скролл вверх): доводка 0.9с
        });
        window.__cctpWebglST = st;
        // Выход из лока: жест «наружу» на краю флоу. Сцена в полёте сама глотает
        // wheel (stepAnim), на краю её stepTo — no-op; мы ловим этот же жест и
        // отпускаем страницу. Порог |deltaY|>8 отсекает дрожь тачпада.
        if (!window.__cctpWebglEdgeBound) {
          window.__cctpWebglEdgeBound = true;
          window.addEventListener("wheel", (e) => {
            if (!window.__cctpWebglLocked) return;
            const s = window.__sstr;
            if (!s || s.stepAnim) return;                     // в полёте — не выходим
            const p = s.scrubState.progress;
            if (e.deltaY > 8 && p >= 0.999) unlock();
            else if (e.deltaY < -8 && p <= 0.001) unlock();
          }, { passive: true, capture: true });
          // Подстраховка: скролл МИМО wheel (скроллбар-drag, PgDn, якорные
          // переходы) Lenis.stop() не держит. Утащили страницу от точки лока
          // — разлочиваем, чтобы юзер не застрял с зависшей сценой.
          window.addEventListener("scroll", () => {
            if (!window.__cctpWebglLocked) return;
            // Во время мягкой доводки (Lenis ещё едет к точке лока) проверка
            // не активна — иначе начальный перелёт инерции дал бы ложный unlock.
            if (window.__lenis && !window.__lenis.isStopped) return;
            if (Math.abs(window.scrollY - lockedAtY) > 150) unlock();
          }, { passive: true });
          // Авто-выход после ФИНАЛЬНОГО полёта: камера ушла вниз (долото за
          // кадром) — «пустой» жест не нужен: короткая пауза, разлок и плавная
          // прокрутка, чтобы следующая секция сама вошла в кадр.
          window.addEventListener("sstr:step-arrived", (ev) => {
            if (!window.__cctpWebglLocked) return;
            const p = ev && ev.detail ? ev.detail.to : null;
            if (p == null || p < 0.999) return;
            setTimeout(() => {
              if (!window.__cctpWebglLocked) return;
              const fromY = lockedAtY;
              unlock();
              if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
                // Яркий inOut (фидбек: sine читался как линейный): резвый
                // разгон, плавный прилёт.
                window.__lenis.scrollTo(fromY + window.innerHeight, {
                  duration: 1.9,
                  easing: easeInOutCubic,
                });
              }
            }, 400);
          });
          // Кнопка «В начало» (левый нижний угол, зеркало «Пропустить»): из
          // любого места сцены — разлок и плавный скролл к началу сайта, без
          // обратной прокрутки всех стопов.
          document.addEventListener("click", (e) => {
            const btn = e.target && e.target.closest && e.target.closest("#back-cta .button");
            if (!btn) return;
            e.preventDefault();
            if (window.__cctpWebglLocked) unlock();
            if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
              window.__lenis.scrollTo(0, { duration: 2.2, easing: easeInOutCubic });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }, true);
        }
        // ТАЧ-ЖЕСТЫ (мобильный степ — зеркало wheel-жестов): свайп = РОВНО один
        // шаг к следующей точке, сила свайпа не важна; во время полёта (stepAnim)
        // жест глотается → принудительный стоп на каждой точке, к следующей —
        // только НОВЫЙ свайп (клиент 07-14). На краях свайп «наружу» разлочивает.
        // touch-action:none на локе гарантирует, что браузер сам не скроллит, но
        // touch-события приходят — жест-детекция работает.
        if (touchInput && !window.__cctpWebglTouchBound) {
          window.__cctpWebglTouchBound = true;
          let tY = null, tDy = 0;
          window.addEventListener("touchstart", (e) => {
            if (!window.__cctpWebglLocked || !e.touches.length) { tY = null; return; }
            tY = e.touches[0].clientY; tDy = 0;
          }, { passive: true });
          window.addEventListener("touchmove", (e) => {
            if (!window.__cctpWebglLocked || tY == null || !e.touches.length) return;
            tDy = tY - e.touches[0].clientY;           // >0 = свайп вверх = вперёд
            if (e.cancelable) e.preventDefault();       // подстраховка вне канваса (навбар)
          }, { passive: false });
          window.addEventListener("touchend", () => {
            if (!window.__cctpWebglLocked || tY == null) return;
            const dy = tDy; tY = null; tDy = 0;
            if (Math.abs(dy) < 24) return;              // тап/дрожь — не жест
            const s = window.__sstr;
            if (!s || s.stepAnim) return;               // в полёте — глотаем
            const dir = dy > 0 ? 1 : -1;
            const p = s.scrubState.progress;
            if (dir > 0 && p >= 0.999) { unlock(); return; }   // наружу вниз
            if (dir < 0 && p <= 0.001) { unlock(); return; }   // наружу вверх
            try { s.stepTo(dir); } catch (e2) {}
          }, { passive: true });
        }
        // Начальное состояние оверлеев.
        if (window.__sstr && window.__sstr.setOverlaysActive) window.__sstr.setOverlaysActive(false);
        [depthEl(), skipEl(), backEl()].forEach((el) => { if (el) el.style.visibility = "hidden"; });
        // «Пропустить» в step-режиме: родной skipToEnd сцены (твин progress —
        // рассинхрона нет, скролл всё равно залочен). Ничего не перехватываем.
      } else {
        // ST обычно УЖЕ создан на init (ensureWebglScrubST в loadWebglIfNeeded,
        // тач-путь) — геометрия стабильна с первой отрисовки. Здесь только
        // fallback-создание (desktop c stepMode=false) + начальное состояние.
        const st = ensureWebglScrubST();
        if (!st) return;
        if (st.isActive) {
          animateWebglOverlays(true);
        } else {
          if (window.__sstr && window.__sstr.setOverlaysActive) window.__sstr.setOverlaysActive(false);
          [depthEl(), skipEl()].forEach((el) => { if (el) el.style.visibility = "hidden"; });
        }
        // «Пропустить» в scrub-режиме → скролл к концу секции (НЕ твинить progress).
        if (!window.__cctpWebglSkipBound) {
          window.__cctpWebglSkipBound = true;
          document.addEventListener("click", (e) => {
            if (window.__cctpWebglMode !== "scrub") return;
            const btn = e.target && e.target.closest && e.target.closest("#skip-cta .button");
            if (!btn) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            const end = window.__cctpWebglST ? window.__cctpWebglST.end : null;
            if (end == null) return;
            if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
              window.__lenis.scrollTo(end, { duration: 1.2 });
            } else if (window.gsap && typeof window.ScrollToPlugin !== "undefined") {
              window.gsap.to(window, { scrollTo: end, duration: 1.2, ease: "power2.inOut" });
            }
          }, true);
        }
      }
      // refresh НУЖЕН только когда wire реально менял лейаут: scrub-fallback
      // создаёт пин+спейсер прямо сейчас. Step-режим лейаут НЕ меняет (пина
      // нет) — refresh пропускаем: он посреди холодного подъезда юзера = то
      // самое «дёргание» (см. installScrollTriggerRefreshGuards).
      if (window.ScrollTrigger && !useStep && !window.__cctpWebglSTEarly) window.ScrollTrigger.refresh();
    }
    function loadMapboxIfNeeded() {
      // Lazy-load mapbox-gl.{js,css}: вытаскиваем только если на странице есть
      // .section_globe + она в 100vh ниже viewport (preload before user reaches it).
      // На странице без глобуса — экономим ~1.6 MB JS + 40 KB CSS.
      const wrapper = document.querySelector(".section_globe");
      if (!wrapper) return;
      // Уже загружен (Barba return / повторный визит) — сразу init.
      if (typeof window.mapboxgl !== "undefined") {
        initInteractiveGlobeMapbox();
        return;
      }
      if (window.__cctpMapboxLoading) return;
      const inject = () => {
        if (window.__cctpMapboxLoading) return;
        window.__cctpMapboxLoading = true;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/vendor/mapbox-gl.css";
        document.head.appendChild(link);
        const script = document.createElement("script");
        script.src = "/vendor/mapbox-gl.js";
        script.async = false;
        script.onload = () => initInteractiveGlobeMapbox();
        script.onerror = () => {
          console.warn("[CCTP] mapbox-gl.js failed to load");
          window.__cctpMapboxLoading = false;
        };
        document.head.appendChild(script);
      };
      if (!("IntersectionObserver" in window)) {
        inject();
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              io.disconnect();
              inject();
              break;
            }
          }
        },
        // rootMargin: "100% 0px" → 100% от высоты root (viewport) сверху и снизу.
        // ⚠️ IntersectionObserver НЕ принимает vh единицы — только px и %.
        // 100% эквивалент "100vh" для root viewport.
        { rootMargin: "100% 0px" }
      );
      io.observe(wrapper);
    }
    function initInteractiveGlobeMapbox() {
      const cfg = {
        mapboxToken:
          "pk.eyJ1IjoicHJpem1hLXN0dWRpbyIsImEiOiJjbW9jZHIxeTkwMDYyMnBxMTZ1ZjU5aTg4In0.7YD2fvHNRPrZurqdP6PHSQ",
        mapStyle: "mapbox://styles/mapbox/dark-v11",
        // swap for custom Mapbox Studio style later
        center: [0, 20],
        zoom: 3,
        projection: "globe",
        autoRotate: true,
        secondsPerRevolution: 120,
        maxSpinZoom: 5,
        slowSpinZoom: 3,
        flyToDuration: 2e3,
        flyToZoom: 5,
        globeOffsetX: -0.2,
        globeOffsetY: 0.25,
        // Background around the globe (fog/space). null = keep Mapbox style default.
        // Set to any CSS color string to flood-fill the void behind the sphere.
        // starIntensity: 0 = flat (no star field), 0..1 for stars.
        spaceColor: "#18191B",
        // matches CCTP alias/color-brand-grey/800
        starIntensity: 0,
        mobile: {
          zoom: 2,
          flyToZoom: 2.5,
          globeOffsetX: 0,
          globeOffsetY: 0.5,
        },
      };
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isSmall = () => window.matchMedia("(max-width: 991px)").matches;
      const val = (key) =>
        isSmall() && cfg.mobile && cfg.mobile[key] !== void 0 ? cfg.mobile[key] : cfg[key];
      const wrapper = document.querySelector("[data-globe-init]");
      if (!wrapper || wrapper.dataset.globeInit === "initialized") return;
      if (typeof mapboxgl === "undefined") {
        console.warn(
          "[CCTP] mapboxgl not found — globe init skipped. Check CDN script in Site Head."
        );
        return;
      }
      mapboxgl.accessToken = cfg.mapboxToken;
      const mapEl = wrapper.querySelector("[data-globe-map]");
      if (!mapEl) return;
      mapEl.id = "globe-map";
      const markers = readMarkers(wrapper);
      const firstMarker = markers.length ? markers[0] : null;
      const map = new mapboxgl.Map({
        container: mapEl.id,
        style: cfg.mapStyle,
        center: firstMarker ? [firstMarker.lng, firstMarker.lat] : cfg.center,
        zoom: firstMarker ? val("flyToZoom") : val("zoom"),
        projection: cfg.projection,
        attributionControl: false,
        cooperativeGestures: true,
      });
      window.__globeMap = map;
      window.__cctpMap = map; // alias для barba beforeLeave cleanup
      const sectionEl = document.querySelector(".globe-container");
      if (sectionEl && "IntersectionObserver" in window) {
        let mapPaused = false;
        const _origRender = map._render.bind(map);
        map._render = function (...args) {
          if (mapPaused) return;
          return _origRender(...args);
        };
        new IntersectionObserver(
          ([entry]) => {
            mapPaused = !entry.isIntersecting;
            if (entry.isIntersecting) {
              sectionEl.style.visibility = "";
              map.resize();
              map.triggerRepaint();
            } else {
              sectionEl.style.visibility = "hidden";
            }
          },
          { rootMargin: "200px" }
        ).observe(sectionEl);
      }
      map.addControl(new mapboxgl.AttributionControl({ compact: true }));
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-left");
      const getPadding = (extraRight) => {
        const w = mapEl.offsetWidth;
        const h = mapEl.offsetHeight;
        const ox = val("globeOffsetX");
        const oy = val("globeOffsetY");
        return {
          top: Math.max(0, oy * h),
          bottom: Math.max(0, -oy * h),
          left: Math.max(0, ox * w),
          right: Math.max(0, -ox * w) + (extraRight || 0),
        };
      };
      map.on("load", () => {
        const layers = map.getStyle().layers || [];
        layers.forEach((layer) => {
          if (layer.type === "symbol") {
            map.setLayoutProperty(layer.id, "visibility", "none");
          }
        });
        {
          map.setFog({
            color: cfg.spaceColor,
            // low atmosphere (horizon glow) — match bg to hide
            "high-color": cfg.spaceColor,
            // upper atmosphere (sky halo) — match bg to hide
            "space-color": cfg.spaceColor,
            // deep space — the void behind the globe
            "horizon-blend": 0,
            // 0 = sharp edge (no soft transition)
            "star-intensity": 0,
            // no star field
          });
        }
        const infoEl = wrapper.querySelector("[data-globe-info]");
        const infoW = !isSmall() && infoEl && infoEl.offsetWidth > 0 ? infoEl.offsetWidth + 24 : 0;
        map.setPadding(getPadding(infoW));
        const pins = addPins(map, markers, wrapper);
        initSlider(wrapper, markers, map, pins);
        if (!reducedMotion) initSpin(map);
        initPanel(wrapper, map, getPadding);
        initResize(map, wrapper, getPadding);
        wrapper.dataset.globeInit = "initialized";
      });
      function readMarkers(wrapper2) {
        const list = wrapper2.querySelector("[data-globe-list]");
        const items = Array.from(wrapper2.querySelectorAll("[data-globe-item]"));
        if (list && items.length && cfg.markers && cfg.markers.length) {
          const tpl = items[0];
          items.forEach((el) => el.remove());
          return cfg.markers.map((m, i) => {
            const clone = tpl.cloneNode(true);
            clone.setAttribute("data-globe-id", m.id || "loc-" + i);
            clone.setAttribute("data-globe-lat", m.lat);
            clone.setAttribute("data-globe-lng", m.lng);
            const img = clone.querySelector("[data-globe-item-image]");
            const city = clone.querySelector("[data-globe-item-city]");
            const name = clone.querySelector("[data-globe-item-name]");
            const link = clone.querySelector("[data-globe-item-link]");
            if (img) img.src = m.image || "";
            if (city) city.textContent = m.city || "";
            if (name) name.textContent = m.name || "";
            if (link) link.href = m.link || "#";
            list.appendChild(clone);
            return {
              id: m.id || "loc-" + i,
              lat: m.lat,
              lng: m.lng,
              name: m.name || "",
              city: m.city || "",
              image: m.image || "",
              link: m.link || "",
              element: clone,
            };
          });
        }
        if (items.length) {
          return items.map((el, i) => ({
            id: el.getAttribute("data-globe-id") || "loc-" + i,
            lat: parseFloat(el.getAttribute("data-globe-lat")) || 0,
            lng: parseFloat(el.getAttribute("data-globe-lng")) || 0,
            name: txt(el, "[data-globe-item-name]") || "Location " + (i + 1),
            city: txt(el, "[data-globe-item-city]") || "",
            image: attr(el, "[data-globe-item-image]", "src") || "",
            link: attr(el, "[data-globe-item-link]", "href") || "",
            element: el,
          }));
        }
        return [];
      }
      function addPins(map2, markers2, wrapper2) {
        const tpl = wrapper2.querySelector("[data-globe-marker-template]");
        return markers2.map((data) => {
          let el;
          if (tpl) {
            el = tpl.cloneNode(true);
            el.removeAttribute("data-globe-marker-template");
          } else {
            el = document.createElement("div");
            el.className = "globe-marker";
            el.innerHTML =
              '<svg class="globe-marker__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
          }
          el.setAttribute("data-globe-marker", data.id);
          const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat([data.lng, data.lat])
            .addTo(map2);
          return { marker, element: el, data };
        });
      }
      function setActive(pins, idx) {
        pins.forEach((p, i) => {
          const v = i === idx ? "true" : "false";
          p.element.setAttribute("data-active", v);
          if (p.data.element) p.data.element.setAttribute("data-active", v);
        });
      }
      function initSlider(wrapper2, markers2, map2, pins) {
        const list = wrapper2.querySelector("[data-globe-list]");
        const prevBtn = wrapper2.querySelector("[data-globe-prev]");
        const nextBtn = wrapper2.querySelector("[data-globe-next]");
        const counter = wrapper2.querySelector("[data-globe-counter]");
        if (!list || !markers2.length) return;
        let cur = 0;
        let flying = false;
        const total = markers2.length;
        const count = () => {
          if (counter) counter.textContent = cur + 1 + " / " + total;
        };
        const flyTo = (i) => {
          map2.flyTo({
            center: [markers2[i].lng, markers2[i].lat],
            zoom: val("flyToZoom"),
            duration: cfg.flyToDuration,
            essential: true,
          });
        };
        const go = (i) => {
          i = ((i % total) + total) % total;
          if (i === cur && markers2[i].element.getAttribute("data-active") === "true") return;
          cur = i;
          flying = true;
          const item = markers2[i].element;
          if (list && item) {
            list.scrollTo({
              top: item.offsetTop,
              left: item.offsetLeft,
              behavior: "smooth",
            });
          }
          setActive(pins, i);
          count();
          flyTo(i);
          setTimeout(() => {
            flying = false;
          }, cfg.flyToDuration + 200);
        };
        if (prevBtn) prevBtn.addEventListener("click", () => go(cur - 1));
        if (nextBtn) nextBtn.addEventListener("click", () => go(cur + 1));
        const observer = new IntersectionObserver(
          (entries) => {
            if (flying) return;
            entries.forEach((entry) => {
              if (!entry.isIntersecting || entry.intersectionRatio <= 0.5) return;
              const idx = markers2.findIndex((m) => m.element === entry.target);
              if (idx !== -1 && idx !== cur) {
                cur = idx;
                setActive(pins, idx);
                count();
                flyTo(idx);
              }
            });
          },
          { root: list, threshold: 0.5 }
        );
        markers2.forEach((m) => {
          if (m.element) observer.observe(m.element);
        });
        markers2.forEach((m, i) => {
          if (m.element) {
            m.element.addEventListener("click", (e) => {
              if (e.target.closest("[data-globe-item-link]")) return;
              go(i);
            });
          }
        });
        pins.forEach((p, i) => {
          p.element.addEventListener("click", () => go(i));
        });
        list.setAttribute("tabindex", "0");
        list.addEventListener("keydown", (e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            go(cur + 1);
          }
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            go(cur - 1);
          }
        });
        setActive(pins, 0);
        count();
      }
      function initSpin(map2) {
        let interacting = false;
        const spin = () => {
          const z = map2.getZoom();
          if (interacting || z >= cfg.maxSpinZoom) return;
          let speed = 360 / cfg.secondsPerRevolution;
          if (z > cfg.slowSpinZoom)
            speed *= (cfg.maxSpinZoom - z) / (cfg.maxSpinZoom - cfg.slowSpinZoom);
          const c = map2.getCenter();
          c.lng -= speed;
          map2.easeTo({ center: c, duration: 1e3, easing: (n) => n });
        };
        map2.on("mousedown", () => {
          interacting = true;
        });
        map2.on("touchstart", () => {
          interacting = true;
        });
        ["mouseup", "dragend", "pitchend", "rotateend", "touchend"].forEach((e) =>
          map2.on(e, () => {
            interacting = false;
            spin();
          })
        );
        map2.on("moveend", spin);
        spin();
      }
      function initPanel(wrapper2, map2, getPadding2) {
        const info = wrapper2.querySelector("[data-globe-info]");
        const close = wrapper2.querySelector("[data-globe-close]");
        const open = wrapper2.querySelector("[data-globe-reopen]");
        if (!info) return;
        const sync = () => {
          const collapsed = wrapper2.getAttribute("data-collapsed") === "true";
          const w = !isSmall() && !collapsed ? info.offsetWidth + 24 : 0;
          map2.setPadding(getPadding2(w));
          if (collapsed) {
            map2.flyTo({
              center: cfg.center,
              zoom: val("zoom"),
              duration: cfg.flyToDuration,
              essential: true,
            });
          }
        };
        new MutationObserver(sync).observe(wrapper2, {
          attributes: true,
          attributeFilter: ["data-collapsed"],
        });
        if (close)
          close.addEventListener("click", () => wrapper2.setAttribute("data-collapsed", "true"));
        if (open)
          open.addEventListener("click", () => wrapper2.setAttribute("data-collapsed", "false"));
      }
      function initResize(map2, wrapper2, getPadding2) {
        const mql = window.matchMedia("(max-width: 991px)");
        const infoEl = wrapper2.querySelector("[data-globe-info]");
        const apply = () => {
          map2.resize();
          const collapsed = wrapper2.getAttribute("data-collapsed") === "true";
          const w = !mql.matches && infoEl && !collapsed ? infoEl.offsetWidth + 24 : 0;
          map2.setPadding(getPadding2(w));
        };
        mql.addEventListener("change", apply);
        let t;
        window.addEventListener(
          "resize",
          () => {
            clearTimeout(t);
            t = setTimeout(apply, 200);
          },
          { passive: true }
        );
      }
      function txt(parent, sel) {
        const el = parent.querySelector(sel);
        return el ? el.textContent.trim() : "";
      }
      function attr(parent, sel, key) {
        const el = parent.querySelector(sel);
        return el ? el.getAttribute(key) : "";
      }
    }
    function boot() {
      if (has.gsap && has.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
      if (has.gsap && typeof window.ScrollToPlugin !== "undefined") {
        gsap.registerPlugin(ScrollToPlugin);
      }
      if (has.gsap && typeof window.SplitText !== "undefined") {
        gsap.registerPlugin(SplitText);
      }
      if (has.gsap && has.CustomEase) {
        gsap.registerPlugin(CustomEase);
        CustomEase.create("cctpOut", "0.625, 0.05, 0, 1");
      }
      initLenis();
      initNavThemeScroll();
      initHoverTextMirror();
      initFooterLinkHover();
      initPageAnimations();
      initLazyCharts();
      initBarba(); // ← последним: все нужные функции зарегистрированы
    }

    // ============================================================
    // Barba.js page transitions (OSMO page-name wipe)
    // ============================================================
    function initBarba() {
      if (typeof window === "undefined") return;
      if (window.__cctpBarbaInit) return;
      if (!window.barba || !window.gsap) return;
      window.__cctpBarbaInit = true;

      // Layer 1 — manual scroll restoration (иначе browser восстанавливает
      // scrollY на pushState и конкурирует с лоикой).
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Глобальные hooks — ScrollTrigger cleanup + transition flag + click lock.
      // ⭐ Strict guard: skip cold load (no event = no user click).
      window.barba.hooks.beforeLeave(function (data) {
        if (!data || !data.event) return;
        window.__cctpBarbaInTransition = true;
        document.body.setAttribute("data-barba-running", "true");
        // Safety net (C2): принудительно снимаем pointer-events lock через 5с
        // даже если transition crashes и afterEnter не сработает. Иначе
        // pointer-events:none застряло бы навсегда → user не может ничего кликать.
        clearTimeout(window.__cctpBarbaRunningFailsafe);
        window.__cctpBarbaRunningFailsafe = setTimeout(function () {
          document.body.removeAttribute("data-barba-running");
          window.__cctpBarbaInTransition = false;
          console.warn("[CCTP barba] failsafe: data-barba-running force-removed after 5s");
        }, 5000);
        if (window.ScrollTrigger) {
          window.ScrollTrigger.getAll().forEach(function (st) {
            st.kill();
          });
        }
        // Mapbox: освобождаем WebGL контекст при уходе со страницы /
        if (window.__cctpMap && typeof window.__cctpMap.remove === "function") {
          try {
            window.__cctpMap.remove();
          } catch (e) {}
          window.__cctpMap = null;
        }
        // WebGL drill-string: освобождаем GL-контекст + снимаем инжектнутые
        // оверлеи (#depth-ui/#skip-cta/#scroll-hint в <body>). Pin-ScrollTrigger
        // уже убит общим getAll().kill() выше. Флаги сбрасываем → на возврате
        // home loadWebglIfNeeded переинжектит свежую сцену.
        // Step-lock: если уходим со страницы с залоченным скроллом — разлочить,
        // иначе Lenis останется stopped и вся навигация замрёт.
        if (window.__cctpWebglUnlock) {
          try { window.__cctpWebglUnlock(); } catch (e) {}
          window.__cctpWebglUnlock = null;
        }
        if (window.__sstr && typeof window.__sstr.disposeScene === "function") {
          try {
            window.__sstr.disposeScene();
          } catch (e) {}
        }
        window.__cctpWebglLoading = false;
        window.__cctpWebglST = null;
        window.__cctpWebglLocked = false;
      });

      // ⭐ Sync mode beforeEnter (fires BEFORE leave+enter parallel pair):
      //  1) Sync head <link>/<style> — Astro dev mode инжектит per-route CSS
      //     chunks, Barba не обновляет head по умолчанию.
      //  2) position fixed на next.container — overlap старого container.
      //  3) Theme/active-nav swap под маской — blink-free.
      //  4) Pre-hide заголовков + setup highlight-marker reveal (paused).
      //  5) Set label text — next.container уже available в sync mode.
      window.barba.hooks.beforeEnter(function (data) {
        // ⭐ MULTIPLE strict guards — skip ALL cold load edge cases.
        if (!data) return;
        if (!data.event) return; // cold load = no user event
        if (!data.trigger) return; // no clicked link
        if (!data.current || !data.current.container) return; // no current = cold
        var nextContainer = data && data.next && data.next.container;
        if (!nextContainer) return;
        // 1) Sync CSS из fetched <head>
        syncHeadStyles(data.next.html);
        // 2) Position next fixed at top so it overlays old during transition
        window.gsap.set(nextContainer, {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          autoAlpha: 0,
        });
        // 3) Pre-hide headings + setup highlight-marker bars (mix viewport-based).
        try {
          nextContainer
            .querySelectorAll("h1.heading_h1, .inner-hero_heading-container p")
            .forEach(function (el) {
              if (el.hasAttribute("data-anim")) return;
              window.gsap.set(el, { autoAlpha: 0 });
            });
          setupHeadingsRevealDeferred(nextContainer);
        } catch (e) {
          console.warn("[CCTP barba] headings setup failed", e);
        }
        // 3c) Pre-hide above-fold section-reveal cards. Target = cell.children
        // (НЕ сами cells). Объяснение:
        //   .content-grid имеет own dark bg (--mapped-border-default = grey-200
        //   light / grey-700 dark) для отрисовки 1px grid lines через gap:1px
        //   hack (styles.css:417-444). Cells (.grid-col) перекрывают светлым
        //   --mapped-surface-default. Если делать opacity:0 на cell — cell
        //   полностью прозрачна, просвечивает grid dark bg → большая тёмная
        //   плашка вместо ожидаемого page color. Поэтому скрываем INNER content
        //   (card_wrap), cells остаются visible с их светлым bg + grid lines.
        //
        // Heading containers пропущены — highlight-marker bars handle их reveal.
        try {
          var prehideVh = window.innerHeight;
          var prehideCount = 0;
          nextContainer.querySelectorAll("section").forEach(function (sec) {
            var rect = sec.getBoundingClientRect();
            if (rect.top >= prehideVh) return; // below-fold — IO handles
            sec
              .querySelectorAll(".content-grid > *, .feature-list > .feature-list_item")
              .forEach(function (cell) {
                var inner = Array.from(cell.children);
                if (!inner.length) return;
                window.gsap.set(inner, { opacity: 0 });
                cell.dataset.cctpBarbaPrehidden = "1";
                prehideCount++;
              });
          });
          console.log(
            "[CCTP " + performance.now().toFixed(0) + "ms] beforeEnter pre-hide:",
            prehideCount + " above-fold cards (inner content) hidden"
          );
        } catch (e) {
          console.warn("[CCTP barba] section pre-hide failed", e);
        }
        // 3b) Pre-set parallax initial state — без этого initGlobalParallax в
        // resetPage делает fromTo с {yPercent:startVal} → instant jump от 0
        // к startVal видимый юзеру (jerk видео на home re-entry). Под маской
        // ставим начальный transform сразу — initGlobalParallax потом увидит
        // element уже в startVal, никакого jerk.
        try {
          nextContainer.querySelectorAll('[data-parallax="trigger"]').forEach(function (trigger) {
            var target = trigger.querySelector('[data-parallax="target"]') || trigger;
            var direction = trigger.getAttribute("data-parallax-direction") || "vertical";
            var prop = direction === "horizontal" ? "xPercent" : "yPercent";
            var startAttr = trigger.getAttribute("data-parallax-start");
            var startVal = startAttr !== null ? parseFloat(startAttr) : 20;
            window.gsap.set(target, { [prop]: startVal });
          });
        } catch (e) {}
        // 4) Set transition label text (next available in sync mode)
        var labelEl = document.querySelector("[data-transition-label-text]");
        if (labelEl) {
          var labelStr =
            nextContainer.getAttribute("data-page-label") ||
            nextContainer.getAttribute("data-barba-namespace") ||
            "";
          labelEl.textContent = labelStr;
          labelEl.style.visibility = "visible";
          labelEl.style.opacity = "1";
        }
        // 5) Shell state (theme nav) — applyShellStateFrom вызывается из
        //    leave timeline в момент когда панель at yPercent:-100 (covered).
        //    Не делаем здесь, чтобы цвет nav не моргал ДО подъёма шторки.
      });

      window.barba.hooks.afterEnter(function () {
        window.__cctpBarbaInTransition = false;
        document.body.removeAttribute("data-barba-running");
        clearTimeout(window.__cctpBarbaRunningFailsafe);
      });

      // Safety net: catch-all `after` hook — двойная защита если afterEnter не
      // фирится (transition error / timeout). Всё равно снимет lock.
      window.barba.hooks.after(function () {
        window.__cctpBarbaInTransition = false;
        document.body.removeAttribute("data-barba-running");
        clearTimeout(window.__cctpBarbaRunningFailsafe);
      });

      window.barba.init({
        debug: false,
        timeout: 7000,
        prevent: function (data) {
          if (!data || !data.el) return true;
          var el = data.el;
          var href = data.href || (el.getAttribute && el.getAttribute("href")) || "";
          if (!href) return true;
          if (href.indexOf("mailto:") === 0) return true;
          if (href.indexOf("tel:") === 0) return true;
          if (href.indexOf("#") === 0) return true;
          if (el.getAttribute && el.getAttribute("target") === "_blank") return true;
          return false;
        },
        transitions: [
          {
            name: "page-name-wipe",
            // ⭐ sync:true — leave + enter в параллель, next.container available
            // в leave (Barba pre-fetches). OSMO snippet тоже sync:true. Old +
            // new containers оба в DOM до конца — managed via position:fixed
            // на new container (set в beforeEnter, clear в resetPage).
            sync: true,
            // ⭐ once handler — Barba ожидает определённый transition на cold
            // load. Без него глобальные beforeEnter могут фириться неправильно.
            async once() {
              return Promise.resolve();
            },
            // Safety net (C4): try/catch wrap + fallback на native nav. Если
            // GSAP timeline throws / Lenis upset / SplitText fails — не оставляем
            // user'а с frozen UI, а делаем full page reload.
            async leave(data) {
              try {
                return runPageLeaveAnimation(data.current.container, data.next.container);
              } catch (e) {
                console.error("[CCTP barba] leave crashed → native nav", e);
                window.location.href = data.next.url.href;
                return new Promise(function () {}); // hold barba while native nav happens
              }
            },
            async enter(data) {
              try {
                return runPageEnterAnimation(data.next.container);
              } catch (e) {
                console.error("[CCTP barba] enter crashed → native nav", e);
                window.location.href = data.next.url.href;
                return new Promise(function () {});
              }
            },
          },
        ],
      });
    }

    // Парсит fetched HTML next page и копирует новые <link rel="stylesheet">
    // и <style> теги в текущий <head>, которых там ещё нет. Решает Astro
    // dev mode проблему: per-route scoped CSS chunks не загружаются при Barba
    // swap (head persistent). Сравнение by-href для <link>, by-content для <style>.
    function syncHeadStyles(htmlString) {
      if (!htmlString) return;
      try {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlString, "text/html");
        var nextHead = doc.head;
        if (!nextHead) return;
        // 1) <link rel="stylesheet" href="...">
        var currentLinks = new Set();
        document.head.querySelectorAll("link[rel='stylesheet'][href]").forEach(function (l) {
          currentLinks.add(l.getAttribute("href"));
        });
        nextHead.querySelectorAll("link[rel='stylesheet'][href]").forEach(function (link) {
          var href = link.getAttribute("href");
          if (currentLinks.has(href)) return;
          var newLink = document.createElement("link");
          newLink.rel = "stylesheet";
          newLink.href = href;
          document.head.appendChild(newLink);
        });
        // 2) <style> inline
        var currentStyleContents = new Set();
        document.head.querySelectorAll("style").forEach(function (s) {
          currentStyleContents.add(s.textContent);
        });
        nextHead.querySelectorAll("style").forEach(function (s) {
          if (currentStyleContents.has(s.textContent)) return;
          var newStyle = document.createElement("style");
          Array.from(s.attributes).forEach(function (a) {
            newStyle.setAttribute(a.name, a.value);
          });
          newStyle.textContent = s.textContent;
          document.head.appendChild(newStyle);
        });
      } catch (e) {
        console.warn("[CCTP barba] head sync failed", e);
      }
    }

    // Setup highlight-marker reveal для Barba — SplitText + bars + timeline.
    // Mix mode по viewport position:
    //  - Above the fold (in viewport) → paused timeline, manual play в pageReady
    //    (bars готовы под маской, играют scaleX 1→0 после reveal шторки).
    //  - Below the fold → стандартный ScrollTrigger с once:true onEnter
    //    (играет когда user скроллит до элемента).
    function setupHeadingsRevealDeferred(container) {
      if (!container) return;
      if (typeof window.gsap === "undefined" || typeof window.SplitText === "undefined") return;
      var color =
        getComputedStyle(document.body).getPropertyValue("--mapped-surface-action").trim() ||
        "#fe5b2a";
      var viewportH = window.innerHeight;
      container
        .querySelectorAll(
          "h1.heading_h1, .inner-hero_heading-container p, .hero_heading_container h1, .hero_heading_container p"
        )
        .forEach(function (el) {
          if (el.hasAttribute("data-anim")) return;
          if (el.__highlightMarkerReveal) return;
          el.setAttribute("data-highlight-marker-reveal", "");
          el.__highlightMarkerReveal = {};
          var split = new window.SplitText(el, {
            type: "lines",
            linesClass: "highlight-marker-line",
          });
          var tl = window.gsap.timeline({ paused: true });
          split.lines.forEach(function (line, i) {
            window.gsap.set(line, { position: "relative", overflow: "hidden" });
            var bar = document.createElement("div");
            bar.className = "highlight-marker-bar";
            bar.style.backgroundColor = color;
            // Top-down reveal: bar collapses сверху вниз (scaleY 1→0 от top center).
            // Раньше было scaleX 1→0 от left center (left-to-right reveal).
            bar.style.transformOrigin = "top center";
            line.appendChild(bar);
            tl.to(bar, { scaleY: 0, duration: 0.78, ease: "power3.inOut" }, i * 0.1);
          });
          window.gsap.set(el, { autoAlpha: 1 });
          el.__highlightMarkerReveal.split = split;
          el.__highlightMarkerReveal.timeline = tl;
          // Решение: above-fold → manual play (deferToManual flag), below-fold
          // → ScrollTrigger onEnter. Используем bounding rect ОТНОСИТЕЛЬНО
          // current container's render position (даже если container fixed top:0).
          var rect = el.getBoundingClientRect();
          var aboveFold = rect.top < viewportH;
          if (aboveFold) {
            el.__highlightMarkerReveal.deferToManual = true;
          } else if (window.ScrollTrigger) {
            var st = window.ScrollTrigger.create({
              trigger: el,
              start: "top 90%",
              once: true,
              onEnter: function () {
                tl.play();
              },
            });
            el.__highlightMarkerReveal.scrollTrigger = st;
          }
        });
    }

    // Reveal above-fold cards в НОВОМ container после Barba arrival с заданной
    // задержкой. GSAP bypass — обходит CSS transition race + targeting cell
    // children (не самих cells) чтобы grid-line bg hack не "просвечивал":
    //
    // (1) CSS spec quirk: во время transition-delay phase computed.opacity равно
    //     start value (1, default). initSectionReveal через double rAF (~32ms)
    //     добавляет .is-revealed → opacity:1. Меняет target транзишна с 0 на 1
    //     ВО ВРЕМЯ delay (3s). Spec: если new target (1) равен current animated
    //     value (1, в delay phase) → transition cancels.
    // (2) .content-grid имеет own dark bg (--mapped-border-default = grey-200/700)
    //     для отрисовки 1px grid lines через gap:1px hack (styles.css:417-444).
    //     opacity:0 на cells = просвечивает grid dark bg = большая тёмная плашка.
    //
    // Fix: для above-fold cells убираем .section-reveal/.is-revealed классы,
    // чистим inline transition-delay (отключает CSS mechanism), затем target =
    // cell.children (НЕ сами cells) — gsap.set opacity:0 + gsap.to opacity:1 с
    // delay. Cells остаются visible с их светлым bg, скрыт только inner content.
    //
    // Below-fold секции не задеваем — IntersectionObserver reveal работает.
    // Above-fold = section.top < viewport.bottom (any part visible at scroll=0).
    function bumpSectionRevealDelayForBarba(container, extraSeconds) {
      if (!container || !extraSeconds || !window.gsap) return;
      var vh = window.innerHeight;
      container.querySelectorAll("section").forEach(function (sec) {
        var rect = sec.getBoundingClientRect();
        var isAbove = rect.top < vh;
        // Same selector as beforeEnter pre-hide — skip heading containers
        // (highlight-marker bars handle их reveal, не должны быть скрыты).
        var cells = sec.querySelectorAll(".content-grid > *, .feature-list > .feature-list_item");
        if (!isAbove || !cells.length) return;
        var stagger = cells.length > 6 ? 0.05 : 0.08;
        console.log(
          "[CCTP " + performance.now().toFixed(0) + "ms] bumpSection:",
          sec.className.slice(0, 30),
          "—",
          cells.length,
          "cells, base delay:",
          extraSeconds + "s"
        );
        cells.forEach(function (cell, idx) {
          cell.classList.remove("section-reveal");
          cell.classList.remove("is-revealed");
          cell.style.transitionDelay = "";
          var inner = Array.from(cell.children);
          if (!inner.length) return;
          window.gsap.set(inner, { opacity: 0 });
          window.gsap.to(inner, {
            opacity: 1,
            duration: 0.5,
            delay: extraSeconds + idx * stagger,
            ease: "power3.out",
            onComplete: function () {
              window.gsap.set(inner, { clearProps: "opacity" });
              delete cell.dataset.cctpBarbaPrehidden;
              if (idx === 0) {
                console.log(
                  "[CCTP " + performance.now().toFixed(0) + "ms] reveal done (first cell):",
                  sec.className.slice(0, 30)
                );
              }
            },
          });
        });
      });
    }

    // Запускает все PAUSED timelines с deferToManual flag (above-fold). Тех
    // что с ScrollTrigger — они play'ятся сами при скролле.
    function playHeadingsRevealIn(container) {
      if (!container) return;
      container.querySelectorAll("[data-highlight-marker-reveal]").forEach(function (el) {
        var rev = el.__highlightMarkerReveal;
        if (rev && rev.deferToManual && rev.timeline && rev.timeline.paused()) {
          rev.timeline.play();
        }
      });
    }

    function runPageLeaveAnimation(current, next) {
      // Safety net (C1): prefers-reduced-motion → instant swap, no animation.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (next) applyShellStateFrom(next);
        return Promise.resolve();
      }
      var transitionWrap = document.querySelector("[data-transition-wrap]");
      var transitionPanel =
        transitionWrap && transitionWrap.querySelector("[data-transition-panel]");
      var transitionLabel =
        transitionWrap && transitionWrap.querySelector("[data-transition-label]");
      // Note: label-text уже set в beforeEnter — здесь не дублируем.

      // sync:true → Barba auto-removes old container после enter resolve.
      // Не делаем manual removeChild и не сбрасываем scroll в leave onComplete.
      var tl = gsap.timeline();

      if (transitionPanel) tl.set(transitionPanel, { autoAlpha: 1, yPercent: 0 }, 0);

      var EASE = "cctpOut";
      if (transitionPanel) {
        tl.fromTo(
          transitionPanel,
          { yPercent: 0 },
          { yPercent: -100, duration: 0.8, ease: EASE },
          0
        );
      }
      if (transitionLabel) {
        tl.fromTo(transitionLabel, { autoAlpha: 0 }, { autoAlpha: 1 }, "<+=0.2");
      }
      if (current) {
        tl.fromTo(current, { y: "0vh" }, { y: "-15vh", duration: 0.8, ease: EASE }, 0);
      }

      // ⭐ Theme nav + active-nav swap В МОМЕНТ когда панель at yPercent:-100
      // (полностью покрывает viewport). Поставили tl.call на t=0.8s (= конец
      // подъёма панели). Раньше делалось в beforeEnter — было видно blink
      // перед подъёмом шторки.
      tl.call(
        function () {
          if (next) applyShellStateFrom(next);
        },
        null,
        0.8
      );

      return tl;
    }

    function runPageEnterAnimation(next) {
      // Safety net (C1): prefers-reduced-motion → instant swap, no animation.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (next)
          gsap.set(next, { autoAlpha: 1, clearProps: "position,top,left,right,y,transform" });
        resetPageAfterTransition(next);
        return Promise.resolve();
      }
      var transitionWrap = document.querySelector("[data-transition-wrap]");
      var transitionPanel =
        transitionWrap && transitionWrap.querySelector("[data-transition-panel]");
      var transitionLabel =
        transitionWrap && transitionWrap.querySelector("[data-transition-label]");

      var tl = gsap.timeline();

      // Read pause for label — даём пользователю прочитать название.
      // Эволюция: OSMO 1.25 → 0.6 (резко) → 1.0 (норм) → 1.3 (+0.3s по запросу).
      tl.add("startEnter", 1.3);

      tl.call(
        function () {
          console.log(
            "[CCTP " + performance.now().toFixed(0) + "ms] enter: startEnter (next visible)"
          );
        },
        null,
        "startEnter"
      );
      if (next) tl.set(next, { autoAlpha: 1 }, "startEnter");

      var EASE = "cctpOut";
      if (transitionPanel) {
        tl.fromTo(
          transitionPanel,
          { yPercent: -100 },
          { yPercent: -200, duration: 1, ease: EASE, overwrite: "auto", immediateRender: false },
          "startEnter"
        );
        tl.set(transitionPanel, { autoAlpha: 0, yPercent: 0 }, ">");
      }
      if (transitionLabel) {
        tl.fromTo(
          transitionLabel,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.4, overwrite: "auto", immediateRender: false },
          "startEnter+=0.1"
        );
      }
      if (next) {
        tl.from(next, { y: "15vh", duration: 1, ease: EASE }, "startEnter");
      }

      // ⭐ TWEAK: момент когда играют плашки на заголовках. Время в секундах
      // ОТНОСИТЕЛЬНО startEnter (= когда шторка начинает подниматься).
      // Возможные значения:
      //   0     = плашки стартуют ровно в момент когда шторка начинает уезжать
      //   0.3   = чуть позже (шторка уже на ~1/3 поднялась)
      //   0.5   = на середине подъёма шторки
      //   1.0   = когда шторка полностью ушла = тот же момент что pageReady
      //  -0.2   = чуть раньше (риск увидеть bars сквозь край панели)
      // Подбирай ощущением. Файл: site/public/js/main.js
      var HEADINGS_REVEAL_OFFSET = 0.3;
      tl.call(
        function () {
          try {
            playHeadingsRevealIn(next);
          } catch (e) {}
        },
        null,
        "startEnter+=" + HEADINGS_REVEAL_OFFSET
      );

      tl.add("pageReady");
      tl.call(
        function () {
          resetPageAfterTransition(next);
        },
        null,
        "pageReady"
      );

      return new Promise(function (resolve) {
        tl.call(resolve, null, "pageReady");
      });
    }

    // Применяет shell-state по новому контейнеру: data-theme-nav на nav
    // (по namespace) + .is-active на текущей nav-ссылке (по pathname).
    // Footer hide управляется CSS-селектором .page[data-no-footer="true"] —
    // никакого body-attr swap'а не нужно, intrinsic к контейнеру.
    // Вызывается в beforeEnter — ДО Phase 2, чтобы blink не было виден.
    function applyShellStateFrom(container) {
      if (!container) return;
      var ns = container.getAttribute && container.getAttribute("data-barba-namespace");
      var theme = ns === "home" ? "hero" : ns === "contacts" ? "dark" : "light";
      var nav = document.querySelector("[data-theme-nav]");
      if (nav) nav.setAttribute("data-theme-nav", theme);
      syncActiveNavLinks();
    }
    // Active nav-ссылка по pathname — и desktop (.nav_item), и мобильное меню
    // (.nav_menu-item). Вызывается на Barba (applyShellStateFrom) и cold load
    // (initMobileMenu) → активный пункт подсвечен и некликабелен на всех
    // переходах. Trailing-slash normalize: pathname и href с / на конце.
    function syncActiveNavLinks() {
      var path = window.location.pathname;
      document.querySelectorAll(".nav_item, .nav_menu-item").forEach(function (a) {
        var href = a.getAttribute("href") || "";
        a.classList.toggle("is-active", href === path);
      });
    }

    function resetPageAfterTransition(container) {
      // ⭐ Manual remove OLD .page container — в sync:true Barba auto-removes
      // его ТОЛЬКО после Promise resolve, который произойдёт ПОСЛЕ этой функции.
      // Без manual remove: новый container в normal flow стоит ПОСЛЕ старого
      // (оба siblings в div-block-2) → его секции смещены вниз ПОД viewport →
      // `rect.top < innerHeight` returns false для всех → baseDelay не
      // применяется → следующая секция видна сразу без задержки.
      document.querySelectorAll('[data-barba="container"]').forEach(function (c) {
        if (c !== container && c.parentNode) c.parentNode.removeChild(c);
      });

      window.scrollTo(0, 0);
      // Чистим всё что мы установили — position:fixed (sync mode overlap)
      // + y/autoAlpha/transform от leave/enter анимаций.
      if (container)
        gsap.set(container, {
          clearProps: "position,top,left,right,y,autoAlpha,transform",
        });
      if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
        window.__lenis.scrollTo(0, { immediate: true, force: true });
      }

      // Note: theme switch + active nav уже отработали в beforeEnter под маской.

      // Re-init container-bound функции (большинство — querySelectorAll по
      // document, спокойно подхватят новые элементы).
      try {
        initPageAnimations();
      } catch (e) {
        console.warn("[CCTP barba] initPageAnimations failed", e);
      }

      // ⭐ TWEAK: задержка появления блоков ПОСЛЕ heading reveal (Barba only).
      // Применяется ВРУЧНУЮ после initSectionReveal — bump'аем inline
      // transition-delay у `.section-reveal` элементов в above-fold секциях
      // НОВОГО container. Below-fold секции не задеваем (скролл нормальный).
      // Файл: site/public/js/main.js (поиск BARBA_SECTION_REVEAL_DELAY).
      var BARBA_SECTION_REVEAL_DELAY = 0.1;
      bumpSectionRevealDelayForBarba(container, BARBA_SECTION_REVEAL_DELAY);
      try {
        initLazyCharts();
      } catch (e) {
        console.warn("[CCTP barba] initLazyCharts failed", e);
      }
      try {
        initFooterLinkHover();
      } catch (e) {}

      // Re-init nav theme scroll — старые scroll-listeners остались, но
      // sections collection stale. Новый init создаст fresh observers
      // на новые секции (старые мгновенно фейлят cheking detached nodes).
      try {
        initNavThemeScroll();
      } catch (e) {}

      // Play highlight-marker bars прямо после reveal (bars готовы в beforeEnter)
      try {
        playHeadingsRevealIn(container);
      } catch (e) {}

      // Safety net (C3): через 3с force-reveal любых заголовков что застряли
      // в autoAlpha:0 (если SplitText не загрузился / setup не успел).
      setTimeout(function () {
        if (!container) return;
        container
          .querySelectorAll("h1.heading_h1, .inner-hero_heading-container p")
          .forEach(function (el) {
            if (
              getComputedStyle(el).visibility === "hidden" ||
              parseFloat(getComputedStyle(el).opacity) < 0.1
            ) {
              if (window.gsap) window.gsap.set(el, { autoAlpha: 1 });
              else {
                el.style.visibility = "visible";
                el.style.opacity = "1";
              }
              console.warn("[CCTP barba] reveal failsafe: force-shown stuck heading");
            }
          });
      }, 3000);

      // Lenis + ScrollTrigger settle (3-layer scroll handling, compendium §6).
      if (window.__lenis) {
        if (typeof window.__lenis.scrollTo === "function") {
          window.__lenis.scrollTo(0, { immediate: true, force: true });
        }
        if (typeof window.__lenis.start === "function") window.__lenis.start();
        if (typeof window.__lenis.resize === "function") window.__lenis.resize();
      }
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === "function") {
        window.ScrollTrigger.refresh();
        setTimeout(function () {
          window.ScrollTrigger.refresh();
        }, 100);
        setTimeout(function () {
          window.ScrollTrigger.refresh();
        }, 600);
        setTimeout(function () {
          window.ScrollTrigger.refresh();
        }, 1500);
      }
      window.dispatchEvent(new Event("resize"));
    }
    function initLazyCharts() {
      const targets = document.querySelectorAll("[data-chart]");
      if (!targets.length) return;
      if (!("IntersectionObserver" in window)) {
        targets.forEach(loadAndMount);
        return;
      }
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            loadAndMount(entry.target);
          });
        },
        { rootMargin: "300px" }
      );
      targets.forEach((el) => io.observe(el));
      function loadAndMount(el) {
        const name = el.getAttribute("data-chart");
        const loaders = {
          "torque-depth": () => Promise.resolve().then(() => torqueDepth),
          "friction-depth": () => Promise.resolve().then(() => frictionDepth),
          // Data-driven chart: config JSON embedded in the element (DataChart.astro).
          "generic": () => Promise.resolve().then(() => genericChart),
        };
        const loader = loaders[name];
        if (!loader) {
          console.warn("[CCTP chart] unknown chart name:", name);
          return;
        }
        loader()
          .then((m) => m.mount(el))
          .catch((err) => console.error("[CCTP chart] failed to load", name, err));
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  })();
  const APEX_CDN_URL = "https://cdn.jsdelivr.net/npm/apexcharts@3.50.0/dist/apexcharts.min.js";
  const COLOR_FRS = "#fe5b2a";
  const COLOR_NO_FRS = "#ffffff";
  const COLOR_GRID = "#2f3032";
  const COLOR_CROSSHAIR = "#747576";
  const DEPTH_LABELS = [
    "0",
    "5",
    "10",
    "12",
    "14",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
  ];
  const indexToDepth = (i) => DEPTH_LABELS[i] ?? "";
  function ensureApexCharts() {
    if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
    if (window.ApexCharts) return Promise.resolve(window.ApexCharts);
    if (window.__cctpApexLoading) return window.__cctpApexLoading;
    window.__cctpApexLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = APEX_CDN_URL;
      s.async = true;
      s.onload = () => {
        if (window.ApexCharts) resolve(window.ApexCharts);
        else reject(new Error("ApexCharts loaded but global not exposed"));
      };
      s.onerror = () => reject(new Error("Failed to load ApexCharts from " + APEX_CDN_URL));
      document.head.appendChild(s);
    });
    return window.__cctpApexLoading;
  }
  function buildLayout(container, config) {
    container.classList.add("chart-host");
    container.innerHTML = `
    <header class="chart-host__header">
      <span class="chart-host__marker" aria-hidden="true"></span>
      <h3 class="chart-host__title">${config.title}</h3>
    </header>
    <div class="chart-host__canvas"></div>
    <div class="chart-host__legend" aria-label="Легенда">
      <div class="chart-host__legend-item">
        <span class="chart-host__legend-marker chart-host__legend-marker--frs" aria-hidden="true"></span>
        <span class="chart-host__legend-label">${config.legendFrs}</span>
      </div>
      <div class="chart-host__legend-item">
        <span class="chart-host__legend-marker chart-host__legend-marker--no-frs" aria-hidden="true"></span>
        <span class="chart-host__legend-label">${config.legendNoFrs}</span>
      </div>
    </div>
  `;
    return container.querySelector(".chart-host__canvas");
  }
  const annotationLabelStyle = {
    background: "transparent",
    color: "#888",
    fontSize: "0.7em",
    fontFamily: "Inter, sans-serif",
  };
  function buildOptions(config) {
    const tooltipUnit = config.tooltipUnit ?? "кН·м²";
    return {
      chart: {
        type: "scatter",
        height: "100%",
        width: "100%",
        background: "transparent",
        foreColor: "#999",
        fontFamily: "inherit",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true, easing: "easeOutCubic", speed: 600 },
        parentHeightOffset: 0,
      },
      // Series order: WHITE first (dense, integer X) for proximity hover coverage.
      series: [
        { name: config.legendNoFrs, data: config.noFrsData },
        { name: config.legendFrs, data: config.withFrsData },
      ],
      colors: [COLOR_NO_FRS, COLOR_FRS],
      markers: {
        size: 3,
        shape: "square",
        strokeWidth: 0,
        hover: { sizeOffset: 1 },
      },
      xaxis: {
        type: "numeric",
        min: 0,
        max: 29,
        tickAmount: 29,
        title: {
          text: config.xAxisTitle,
          offsetY: -18,
          // higher than -12 to clear bottom edge clipping on chart #2
          style: { color: "#999", fontSize: "0.8em", fontWeight: 400 },
        },
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          show: true,
          stroke: { color: COLOR_CROSSHAIR, width: 1, dashArray: 2.26 },
        },
        tooltip: { enabled: false },
      },
      yaxis: {
        reversed: true,
        min: 0,
        max: 3600,
        tickAmount: 4,
        title: {
          text: config.yAxisTitle,
          offsetX: -4,
          style: { color: "#999", fontSize: "0.8em", fontWeight: 400 },
        },
        labels: {
          style: { colors: "#888", fontSize: "0.7em" },
          formatter: (v) => Number(v).toFixed(0),
          offsetX: -4,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      grid: {
        borderColor: "transparent",
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: false } },
        padding: { top: 10, right: 20, bottom: 50, left: 10 },
      },
      annotations: {
        position: "back",
        yaxis: [
          { y: 900, borderColor: COLOR_GRID, borderWidth: 1, strokeDashArray: 2.26 },
          { y: 1800, borderColor: COLOR_GRID, borderWidth: 1, strokeDashArray: 2.26 },
          { y: 2700, borderColor: COLOR_GRID, borderWidth: 1, strokeDashArray: 2.26 },
          { y: 3600, borderColor: COLOR_GRID, borderWidth: 1, strokeDashArray: 2.26 },
        ],
        xaxis: [
          {
            x: 0,
            borderColor: "transparent",
            label: {
              text: "0",
              position: "bottom",
              offsetY: 14,
              borderWidth: 0,
              orientation: "horizontal",
              style: annotationLabelStyle,
            },
          },
          {
            x: 2,
            borderColor: COLOR_GRID,
            borderWidth: 1,
            strokeDashArray: 2.26,
            label: {
              text: "10",
              position: "bottom",
              offsetY: 14,
              borderWidth: 0,
              orientation: "horizontal",
              style: annotationLabelStyle,
            },
          },
          {
            x: 9,
            borderColor: COLOR_GRID,
            borderWidth: 1,
            strokeDashArray: 2.26,
            label: {
              text: "20",
              position: "bottom",
              offsetY: 14,
              borderWidth: 0,
              orientation: "horizontal",
              style: annotationLabelStyle,
            },
          },
          {
            x: 19,
            borderColor: COLOR_GRID,
            borderWidth: 1,
            strokeDashArray: 2.26,
            label: {
              text: "30",
              position: "bottom",
              offsetY: 14,
              borderWidth: 0,
              orientation: "horizontal",
              style: annotationLabelStyle,
            },
          },
          {
            x: 29,
            borderColor: COLOR_GRID,
            borderWidth: 1,
            strokeDashArray: 2.26,
            label: {
              text: "40",
              position: "bottom",
              offsetY: 14,
              borderWidth: 0,
              orientation: "horizontal",
              style: annotationLabelStyle,
            },
          },
        ],
      },
      legend: { show: false },
      tooltip: {
        enabled: true,
        shared: false,
        intersect: false,
        followCursor: true,
        custom: ({ seriesIndex, dataPointIndex, w }) => {
          const seriesName = w.globals.seriesNames[seriesIndex];
          const point = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          const leftAxisValue = point[1].toFixed(0);
          const bottomAxisValue = indexToDepth(Math.round(point[0]));
          const cls = seriesIndex === 1 ? "frs" : "no-frs";
          return `
          <div class="cctp-chart-tooltip">
            <div class="cctp-chart-tooltip__depth">Глубина: ${leftAxisValue} м</div>
            <div class="cctp-chart-tooltip__row cctp-chart-tooltip__row--${cls}">
              ${seriesName}: ${bottomAxisValue} ${tooltipUnit}
            </div>
          </div>
        `;
        },
      },
      // Mobile: smaller dot markers (3 → 2) so they don't visually merge on iPhone.
      responsive: [
        {
          breakpoint: 479,
          options: { markers: { size: 2 } },
        },
      ],
    };
  }
  function computeCanvasHeight(container) {
    const cs = getComputedStyle(container);
    const hostHeight = container.clientHeight;
    const padTop = parseFloat(cs.paddingTop) || 0;
    const padBottom = parseFloat(cs.paddingBottom) || 0;
    const header = container.querySelector(".chart-host__header");
    const legend = container.querySelector(".chart-host__legend");
    let headerH = 0,
      legendH = 0;
    if (header) {
      const hcs = getComputedStyle(header);
      headerH =
        header.getBoundingClientRect().height +
        (parseFloat(hcs.marginTop) || 0) +
        (parseFloat(hcs.marginBottom) || 0);
    }
    if (legend) {
      const lcs = getComputedStyle(legend);
      legendH =
        legend.getBoundingClientRect().height +
        (parseFloat(lcs.marginTop) || 0) +
        (parseFloat(lcs.marginBottom) || 0);
    }
    return Math.max(80, hostHeight - padTop - padBottom - headerH - legendH);
  }
  async function mountChart(container, config) {
    if (!container || container.__cctpChartMounted) return null;
    const ApexCharts = await ensureApexCharts();
    const canvas = buildLayout(container, config);
    await new Promise((r) => requestAnimationFrame(r));
    const opts = buildOptions(config);
    const initialHeight = computeCanvasHeight(container);
    opts.chart.height = initialHeight;
    const chart = new ApexCharts(canvas, opts);
    chart.render();
    container.__cctpChartMounted = true;
    container.__cctpChart = chart;
    if (typeof ResizeObserver !== "undefined") {
      let raf,
        lastH = initialHeight;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const h = computeCanvasHeight(container);
          if (h > 0 && Math.abs(h - lastH) > 2) {
            lastH = h;
            chart.updateOptions({ chart: { height: h } }, false, false, false);
          }
        });
      });
      ro.observe(container);
    }
    return chart;
  }
  const noFrsData$1 = [
    [0, 35],
    [1, 235],
    [2, 485],
    [3, 635],
    [4, 835],
    [5, 1085],
    [6, 1235],
    [7, 1385],
    [8, 1535],
    [9, 1685],
    [10, 1835],
    [11, 1985],
    [12, 2135],
    [13, 2285],
    [14, 2435],
    [15, 2585],
    [16, 2735],
    [17, 2885],
    [18, 3035],
    [19, 3185],
    [20, 3335],
    [21, 3435],
    [22, 3485],
    [23, 3535],
    [24, 3555],
    [25, 3565],
    [26, 3570],
    [27, 3573],
    [28, 3575],
    [29, 3577],
  ];
  const withFrsData$1 = [
    [7, 1607],
    [7.49, 1768],
    [8.16, 1917],
    [8.84, 2066],
    [9.39, 2289],
    [9.64, 2511],
    [10.19, 2661],
    [10.68, 2846],
    [11.36, 2957],
    [12.22, 3143],
    [12.96, 3254],
    [13.88, 3403],
    [14.25, 3577],
  ];
  function mount$1(container) {
    const isEn = document.documentElement.lang === "en";
    return mountChart(container, {
      title: isEn ? "Bit torque" : "Крутящий момент над забоем",
      legendFrs: isEn ? "With FRS" : "Момент с FRS",
      legendNoFrs: isEn ? "Without FRS" : "Момент без FRS",
      xAxisTitle: isEn ? "Torque, kN·m²" : "Момент, кН*м²",
      yAxisTitle: isEn ? "Depth, m" : "Глубина, м",
      tooltipUnit: isEn ? "kN·m²" : "кН·м²",
      noFrsData: noFrsData$1,
      withFrsData: withFrsData$1,
    });
  }
  const torqueDepth = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
      {
        __proto__: null,
        mount: mount$1,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  const noFrsData = [
    [0, 35],
    [1, 235],
    [2, 485],
    [3, 635],
    [4, 835],
    [5, 1085],
    [6, 1235],
    [7, 1385],
    [8, 1535],
    [9, 1685],
    [10, 1835],
    [11, 1985],
    [12, 2135],
    [13, 2285],
    [14, 2435],
    [15, 2585],
    [16, 2735],
    [17, 2885],
    [18, 3035],
    [19, 3185],
    [20, 3335],
    [21, 3435],
    [22, 3485],
    [23, 3535],
    [24, 3555],
    [25, 3565],
    [26, 3570],
    [27, 3573],
    [28, 3575],
    [29, 3577],
  ];
  const withFrsData = [
    [8.41, 1681],
    [9.21, 2251],
    [9.27, 1854],
    [9.45, 2028],
    [9.64, 2511],
    [9.82, 2177],
    [9.88, 2362],
    [10.19, 2660],
    [10.68, 2846],
    [11.36, 2957],
    [12.22, 3143],
    [12.96, 3254],
    [13.88, 3403],
    [14.25, 3577],
  ];
  function mount(container) {
    const isEn = document.documentElement.lang === "en";
    return mountChart(container, {
      title: isEn
        ? "Axial friction reduction<br>in the installation zone"
        : "Снижение осевого трения<br>в зоне установки",
      legendFrs: isEn ? "With FRS" : "Вес с FRS",
      legendNoFrs: isEn ? "Without FRS" : "Вес без FRS",
      xAxisTitle: isEn ? "Hook load, t" : "Вес, т",
      yAxisTitle: isEn ? "Depth, m" : "Глубина, м",
      tooltipUnit: isEn ? "t" : "т",
      noFrsData,
      withFrsData,
    });
  }
  const frictionDepth = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
      {
        __proto__: null,
        mount,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  // ══════════════════════════════════════════════════════════════════════
  // Generic data-driven chart (data-chart="generic"). Same brand look as
  // torque-depth / friction-depth, but axes/ticks are computed from data.
  // Config comes from the CMS, embedded by DataChart.astro as a JSON
  // <script type="application/json"> INSIDE the host element.
  // Source of truth: code/src/charts/generic.js.
  // ══════════════════════════════════════════════════════════════════════
  const GENERIC_SERIES_COLORS = {
    orange: { marker: "#fe5b2a", swatch: "#fe5b2a", text: "#fe5b2a" },
    white: { marker: "#ffffff", swatch: "#2f3032", text: "#ffffff" },
    grey: { marker: "#747576", swatch: "#747576", text: "#a8a9aa" },
  };
  const escGeneric = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  // Nice axis scale (1/2/5 × 10^k steps)
  function genericNiceNum(range, round) {
    const exp = Math.floor(Math.log10(range));
    const f = range / 10 ** exp;
    let nf;
    if (round) nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    else nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return nf * 10 ** exp;
  }
  function genericNiceScale(dataMin, dataMax, maxTicks) {
    let min = dataMin;
    let max = dataMax;
    if (!isFinite(min) || !isFinite(max)) { min = 0; max = 1; }
    // Anchor at zero when data starts near it — surface for depth, origin for loads.
    if (min > 0 && min <= 0.4 * max) min = 0;
    if (min === max) { min -= 1; max += 1; }
    const step = genericNiceNum(genericNiceNum(max - min, false) / (maxTicks - 1), true);
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    return {
      min: lo,
      max: hi,
      ticks: Math.round((hi - lo) / step),
      decimals: Math.max(0, -Math.floor(Math.log10(step))),
    };
  }
  const genericFormatter = (scale) => (v) => Number(v).toFixed(scale.decimals);
  function buildGenericLayout(container, config) {
    container.classList.add("chart-host");
    const legendItems = config.series
      .map((s) => {
        const c = GENERIC_SERIES_COLORS[s.color] ?? GENERIC_SERIES_COLORS.orange;
        return `
      <div class="chart-host__legend-item">
        <span class="chart-host__legend-marker" style="background:${c.swatch}" aria-hidden="true"></span>
        <span class="chart-host__legend-label">${escGeneric(s.name)}</span>
      </div>`;
      })
      .join("");
    container.innerHTML = `
    <header class="chart-host__header">
      <span class="chart-host__marker" aria-hidden="true"></span>
      <h3 class="chart-host__title">${escGeneric(config.title)}</h3>
    </header>
    <div class="chart-host__canvas"></div>
    <div class="chart-host__legend" aria-label="Legend">${legendItems}</div>
  `;
    return container.querySelector(".chart-host__canvas");
  }
  function buildGenericOptions(config) {
    const series = config.series;
    const xs = series.flatMap((s) => s.data.map((p) => p[0]));
    const ys = series.flatMap((s) => s.data.map((p) => p[1]));
    const xScale = genericNiceScale(Math.min(...xs), Math.max(...xs), 5);
    const yScale = genericNiceScale(Math.min(...ys), Math.max(...ys), 5);
    const fmtX = genericFormatter(xScale);
    const fmtY = genericFormatter(yScale);
    const isLine = config.mode === "line";
    const yLabel = config.yLabel || String(config.yTitle ?? "").split(",")[0].trim();
    const xUnit = config.xUnit ?? "";
    const yUnit = config.yUnit ?? "";
    return {
      chart: {
        type: isLine ? "line" : "scatter",
        height: "100%",
        width: "100%",
        background: "transparent",
        foreColor: "#999",
        fontFamily: "inherit",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true, easing: "easeOutCubic", speed: 600 },
        parentHeightOffset: 0,
      },
      series: series.map((s) => ({ name: s.name, data: s.data })),
      colors: series.map((s) => (GENERIC_SERIES_COLORS[s.color] ?? GENERIC_SERIES_COLORS.orange).marker),
      stroke: isLine ? { width: 2, curve: "straight" } : { width: 0 },
      markers: {
        size: isLine ? 0 : 3,
        shape: "square",
        strokeWidth: 0,
        hover: { sizeOffset: isLine ? 4 : 1 },
      },
      xaxis: {
        type: "numeric",
        min: xScale.min,
        max: xScale.max,
        tickAmount: xScale.ticks,
        title: {
          text: config.xTitle,
          offsetY: 16, // clear the native tick labels row (center label sits right above)
          style: { color: "#999", fontSize: "0.8em", fontWeight: 400 },
        },
        labels: {
          show: true,
          style: { colors: "#888", fontSize: "0.7em" },
          formatter: fmtX,
          offsetY: 2,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          show: true,
          stroke: { color: COLOR_CROSSHAIR, width: 1, dashArray: 2.26 },
        },
        tooltip: { enabled: false },
      },
      yaxis: {
        reversed: Boolean(config.yReversed),
        min: yScale.min,
        max: yScale.max,
        tickAmount: yScale.ticks,
        title: {
          text: config.yTitle,
          offsetX: -4,
          style: { color: "#999", fontSize: "0.8em", fontWeight: 400 },
        },
        labels: {
          style: { colors: "#888", fontSize: "0.7em" },
          formatter: fmtY,
          offsetX: -4,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      grid: {
        borderColor: COLOR_GRID,
        strokeDashArray: 2.26,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
        padding: { top: 10, right: 20, bottom: 18, left: 10 },
      },
      legend: { show: false },
      // Mobile: smaller dot markers (3 → 2) so they don't visually merge on iPhone.
      responsive: [{ breakpoint: 479, options: { markers: { size: isLine ? 0 : 2 } } }],
      tooltip: {
        enabled: true,
        shared: false,
        intersect: false,
        followCursor: true,
        custom: ({ seriesIndex, dataPointIndex, w }) => {
          const point = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          if (!point) return "";
          const s = series[seriesIndex] ?? series[0];
          const c = GENERIC_SERIES_COLORS[s.color] ?? GENERIC_SERIES_COLORS.orange;
          return `
          <div class="cctp-chart-tooltip">
            <div class="cctp-chart-tooltip__depth">${escGeneric(yLabel)}: ${fmtY(point[1])} ${escGeneric(yUnit)}</div>
            <div class="cctp-chart-tooltip__row" style="color:${c.text}">
              <span class="cctp-chart-tooltip__swatch" style="background:${c.swatch}" aria-hidden="true"></span>
              ${escGeneric(s.name)}: ${fmtX(point[0])} ${escGeneric(xUnit)}
            </div>
          </div>
        `;
        },
      },
    };
  }
  function readGenericConfig(container) {
    const holder = container.querySelector('script[type="application/json"]');
    if (!holder) return null;
    try {
      const config = JSON.parse(holder.textContent);
      if (!config || !Array.isArray(config.series)) return null;
      config.series = config.series.filter((s) => s && Array.isArray(s.data) && s.data.length > 0);
      return config.series.length ? config : null;
    } catch (err) {
      console.error("[CCTP chart] generic: invalid JSON config", err);
      return null;
    }
  }
  async function mountGeneric(container) {
    if (!container || container.__cctpChartMounted) return null;
    const config = readGenericConfig(container);
    if (!config) {
      console.warn("[CCTP chart] generic: no usable config, skipping", container);
      return null;
    }
    const ApexCharts = await ensureApexCharts();
    const canvas = buildGenericLayout(container, config);
    await new Promise((r) => requestAnimationFrame(r));
    const opts = buildGenericOptions(config);
    const initialHeight = computeCanvasHeight(container);
    opts.chart.height = initialHeight;
    const chart = new ApexCharts(canvas, opts);
    chart.render();
    container.__cctpChartMounted = true;
    container.__cctpChart = chart;
    if (typeof ResizeObserver !== "undefined") {
      let raf,
        lastH = initialHeight;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const h = computeCanvasHeight(container);
          if (h > 0 && Math.abs(h - lastH) > 2) {
            lastH = h;
            chart.updateOptions({ chart: { height: h } }, false, false, false);
          }
        });
      });
      ro.observe(container);
    }
    return chart;
  }
  const genericChart = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
      {
        __proto__: null,
        mount: mountGeneric,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
})();
