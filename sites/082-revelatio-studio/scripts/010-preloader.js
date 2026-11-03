(() => {
  if (window.__revelatioPreloaderInit) return;
  window.__revelatioPreloaderInit = true;

  const html = document.documentElement;

  function forceTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  forceTop();
  window.addEventListener('pageshow', forceTop);
  window.addEventListener('load', forceTop);

  const css = document.createElement('style');
  css.textContent = `
    html.is-preloading,
    html.is-preloading body {
      overflow: hidden !important;
      height: 100%;
      overscroll-behavior: none;
    }
    html.is-preloading body {
      position: fixed;
      inset: 0;
      width: 100%;
    }
    html.is-preloading .preloader {
      display: flex !important;
      opacity: 1;
      visibility: visible;
    }
    .preloader {
      transition: opacity 0.7s cubic-bezier(0.65, 0, 0.35, 1),
                  visibility 0.7s cubic-bezier(0.65, 0, 0.35, 1);
    }
    .preloader_progress-line {
      width: 100%;
      height: 100%;
      transform: scaleY(0);
      transform-origin: bottom center;
      will-change: transform;
      transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .prealoder_logo-wrap,
    .preloader_logo-wrap {
      transition: opacity 0.5s ease-out;
    }
    html.is-preloading .preloader_text-inner {
      opacity: 0;
    }
    .revelatio-tv {
      filter: brightness(1) blur(0);
      opacity: 1;
      transition:
        filter 0.7s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.5s ease-out;
    }
    html.is-preloading .revelatio-tv {
      filter: brightness(0.14) blur(1.4px);
      opacity: 0.62;
    }
    html.is-preloader-leaving .revelatio-tv {
      filter: brightness(1) blur(0);
      opacity: 1;
    }
  `;
  document.head.appendChild(css);

  html.classList.add('is-preloading');

  const blockedKeys = new Set([' ', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'Home', 'End']);
  const preventScroll = (e) => {
    if (!html.classList.contains('is-preloading')) return;
    e.preventDefault();
  };
  const preventKeys = (e) => {
    if (!html.classList.contains('is-preloading')) return;
    if (blockedKeys.has(e.key)) e.preventDefault();
  };
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', preventKeys, { passive: false });

  const MIN_DURATION_MS = 2000;
  const EXIT_CONTENT_MS = 950;
  const PRELOADER_FADE_MS = 700;
  const SCRAMBLE_CHARS = '^$%#@!&*?+=';
  const start = performance.now();

  function randomScramble(length) {
    let result = '';
    for (let i = 0; i < length; i += 1) {
      result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    return result;
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(() => {
    const preloader = document.querySelector('.preloader');
    const progressLine = document.querySelector('.preloader_progress-line');
    const progressNumber = document.querySelector('.prealoder_number, .preloader_number');
    const preloaderLogoWrap = document.querySelector('.prealoder_logo-wrap, .preloader_logo-wrap');
    const textInners = Array.from(document.querySelectorAll('.preloader_text-inner'));

    if (!preloader) {
      document.documentElement.classList.remove('is-preloading');
      return;
    }

    if (window.gsap && window.ScrambleTextPlugin) {
      window.gsap.registerPlugin(window.ScrambleTextPlugin);
    }

    const hasScramble = !!(window.gsap && window.ScrambleTextPlugin);

    let displayedProgress = 0;
    let stageIndex = 0;
    let nextStageAt = performance.now();
    const stageValues = [0, 25, 50, 75, 100];

    if (preloaderLogoWrap) {
      preloaderLogoWrap.style.removeProperty('width');
      preloaderLogoWrap.style.removeProperty('max-width');
      preloaderLogoWrap.style.removeProperty('transform');
      preloaderLogoWrap.style.removeProperty('opacity');
    }

    textInners.forEach((el) => {
      el.dataset.preloaderText = el.textContent.trim();
    });

    function scrambleInText() {
      textInners.forEach((el, i) => {
        const original = el.dataset.preloaderText || el.textContent.trim();
        if (!hasScramble) {
          el.style.opacity = '1';
          el.textContent = original;
          return;
        }
        const delay = i * 0.12;
        window.gsap.killTweensOf(el);
        el.textContent = randomScramble(original.length);
        window.gsap.to(el, { opacity: 1, duration: 0.35, delay, ease: 'power1.out' });
        window.gsap.to(el, {
          duration: 0.95,
          delay,
          scrambleText: {
            text: original,
            chars: SCRAMBLE_CHARS,
            speed: 0.9,
            tweenLength: false,
          },
        });
      });
    }

    function scrambleOutText() {
      textInners.forEach((el, i) => {
        const original = el.dataset.preloaderText || el.textContent.trim();
        if (!hasScramble) {
          el.style.opacity = '0';
          return;
        }
        const delay = i * 0.08;
        window.gsap.killTweensOf(el);

        const source = original || el.textContent;
        const frag = document.createDocumentFragment();
        const chars = [];
        const isRightBlock = !!el.closest('.preloader_text-right');

        for (const ch of source) {
          const span = document.createElement('span');
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          span.style.display = 'inline-block';
          span.style.opacity = '1';
          frag.appendChild(span);
          chars.push(span);
        }

        el.textContent = '';
        el.appendChild(frag);

        chars.forEach((charEl, idx) => {
          const orderIndex = isRightBlock ? idx : (chars.length - 1 - idx);
          const charDelay = delay + orderIndex * 0.018;
          window.gsap.delayedCall(charDelay, () => {
            charEl.textContent = randomScramble(1);
          });
          window.gsap.to(charEl, {
            opacity: 0,
            duration: 0.06,
            delay: charDelay + 0.01,
            ease: 'none',
          });
        });
      });
    }

    function setProgressNumber(value, forcePlain = false) {
      if (!progressNumber) return;
      const target = Math.max(0, Math.min(100, Math.round(value)));
      const text = `${target}%`;
      if (forcePlain || !hasScramble) {
        progressNumber.textContent = text;
        return;
      }
      window.gsap.killTweensOf(progressNumber);
      window.gsap.to(progressNumber, {
        duration: 0.42,
        scrambleText: {
          text,
          chars: SCRAMBLE_CHARS,
          speed: 0.9,
        },
      });
    }

    function applyStage(index, forcePlain = false) {
      const safeIndex = Math.max(0, Math.min(stageValues.length - 1, index));
      const value = stageValues[safeIndex];
      stageIndex = safeIndex;
      if (progressLine) {
        progressLine.style.transform = `scaleY(${value / 100})`;
      }
      setProgressNumber(value, forcePlain);
    }

    function tick() {
      const elapsed = performance.now() - start;
      const complete = document.readyState === 'complete';

      const target = complete
        ? Math.min(1, elapsed / MIN_DURATION_MS)
        : 0.9 * (1 - Math.exp(-elapsed / 1400));

      displayedProgress += (target - displayedProgress) * 0.09;
      const now = performance.now();
      const desiredStage = Math.min(3, Math.floor(Math.min(0.999, displayedProgress) * 4));
      if (desiredStage > stageIndex && now >= nextStageAt) {
        applyStage(stageIndex + 1, false);
        nextStageAt = now + 420;
      }

      const done =
        displayedProgress >= 0.997 &&
        complete &&
        elapsed >= MIN_DURATION_MS;

      if (done) {
        applyStage(4, true);
        setTimeout(exit, 120);
        return;
      }

      requestAnimationFrame(tick);
    }

    function exit() {
      html.classList.add('is-preloader-leaving');
      preloader.style.display = 'flex';
      preloader.style.opacity = '1';
      preloader.style.visibility = 'visible';
      void preloader.offsetHeight;

      scrambleOutText();

      if (preloaderLogoWrap) {
        preloaderLogoWrap.style.transform = 'none';
        preloaderLogoWrap.style.opacity = '0';
      }

      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';

        triggerLoadHomeScramble();

        if (window.revelatioAscii && typeof window.revelatioAscii.setOptions === 'function') {
          window.revelatioAscii.setOptions({ powerState: 0 });
        }
        if (window.revelatioAscii && typeof window.revelatioAscii.powerOn === 'function') {
          window.revelatioAscii.powerOn(980);
        }
      }, EXIT_CONTENT_MS);

      setTimeout(() => {
        html.classList.remove('is-preloading');
        html.classList.remove('is-preloader-leaving');
        preloader.style.display = 'none';
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventKeys);
        window.dispatchEvent(new CustomEvent('revelatio:preloader-done'));
      }, EXIT_CONTENT_MS + PRELOADER_FADE_MS);
    }

    function triggerLoadHomeScramble() {
      if (window.__revelatioHomeScrambleTriggered) return;
      let attempts = 0;
      const maxAttempts = 40;
      const tryRun = () => {
        if (typeof window.revelatioScrambleLoadHome === 'function') {
          window.__revelatioHomeScrambleTriggered = true;
          window.revelatioScrambleLoadHome();
          return;
        }
        attempts += 1;
        if (attempts < maxAttempts) {
          setTimeout(tryRun, 100);
        }
      };
      tryRun();
    }

    applyStage(0, true);
    scrambleInText();
    tick();
  });
})();
