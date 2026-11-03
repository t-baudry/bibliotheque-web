(() => {
  if (window.__revelatioMobileMenuInit) return;
  window.__revelatioMobileMenuInit = true;

  const SCRAMBLE_CHARS = '^$%#@!&*?+=';
  const MENU_SELECTOR = '.menu';
  const TOGGLE_SELECTOR = '.nav_hamburger';
  const TOGGLE_TEXT_SELECTOR = '.navbar-menu';
  const OVERLAY_SELECTOR = '.menu-overlay';
  const CONTENT_SELECTOR = '.menu-content';
  const ROW_SELECTOR = '.menu_row';
  const LINK_SELECTOR = '.menu-link';
  const LOCALES_SELECTOR = '.locales_wrap';
  const MENU_NAV_COLOR = '#fff';
  const MENU_NAV_BG = 'hsla(0, 0%, 100%, .16)';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function injectStyles() {
    if (document.getElementById('revelatio-mobile-menu-styles')) return;

    const style = document.createElement('style');
    style.id = 'revelatio-mobile-menu-styles';
    style.textContent = `
      ${MENU_SELECTOR} {
        display: none;
        opacity: 0;
      }

      ${MENU_SELECTOR}.is-open {
        display: flex;
      }

      ${OVERLAY_SELECTOR} {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      ${CONTENT_SELECTOR} {
        position: relative;
        z-index: 1;
      }

      ${ROW_SELECTOR},
      ${LINK_SELECTOR} {
        position: relative;
        z-index: 2;
      }

      ${OVERLAY_SELECTOR},
      ${CONTENT_SELECTOR},
      ${ROW_SELECTOR},
      ${LINK_SELECTOR},
      ${MENU_SELECTOR} ${LOCALES_SELECTOR},
      ${TOGGLE_TEXT_SELECTOR} {
        will-change: opacity, transform;
      }

      html.is-menu-open,
      body.is-menu-open {
        overflow: hidden;
      }

      html.is-menu-open .navbar-actions,
      html.is-menu-open .is-nav {
        background-color: hsla(0, 0%, 100%, .16) !important;
      }

      html.is-menu-open .navbar-link,
      html.is-menu-open ${TOGGLE_TEXT_SELECTOR},
      html.is-menu-open .nav-icon-embed,
      html.is-menu-open .button-icon {
        color: #fff !important;
      }

      html.is-menu-open .nav-icon-embed svg,
      html.is-menu-open .nav-icon-embed svg *,
      html.is-menu-open .button-icon svg,
      html.is-menu-open .button-icon svg * {
        fill: currentColor !important;
        stroke: currentColor !important;
      }
    `;
    document.head.appendChild(style);
  }

  function randomScramble(length) {
    let result = '';
    for (let i = 0; i < length; i += 1) {
      result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    return result;
  }

  function scrambleTo(element, text, options = {}) {
    const duration = options.duration ?? 0.55;
    const delay = options.delay ?? 0;

    if (!element) return;

    if (!window.gsap || !window.ScrambleTextPlugin) {
      element.textContent = text;
      return;
    }

    window.gsap.killTweensOf(element);
    window.gsap.to(element, {
      duration,
      delay,
      scrambleText: {
        text,
        chars: SCRAMBLE_CHARS,
        speed: options.speed ?? 0.75,
      },
      overwrite: true,
    });
  }

  function prepareLink(link) {
    if (link.dataset.originalText) return;
    link.dataset.originalText = link.textContent.trim();
  }

  function scrambleLinkIn(link, delay) {
    prepareLink(link);
    link.textContent = randomScramble(link.dataset.originalText.length);

    if (!window.gsap || !window.ScrambleTextPlugin) {
      link.textContent = link.dataset.originalText;
      return;
    }

    window.gsap.to(link, {
      duration: 0.8,
      delay,
      scrambleText: {
        text: link.dataset.originalText,
        chars: SCRAMBLE_CHARS,
        speed: 0.82,
      },
      overwrite: false,
    });
  }

  function forceOriginalNavColors() {
    document.querySelectorAll('.navbar-actions, .is-nav').forEach((element) => {
      element.style.setProperty('background-color', MENU_NAV_BG, 'important');
    });

    document.querySelectorAll([
      '.navbar-link',
      TOGGLE_TEXT_SELECTOR,
      '.nav-icon-embed',
      '.button-icon',
      '.your-time-zone.is-menu',
      '.our-time-zone.is-menu',
    ].join(', ')).forEach((element) => {
      element.style.setProperty('color', MENU_NAV_COLOR, 'important');
    });
  }

  function clearOriginalNavColors() {
    document.querySelectorAll('.navbar-actions, .is-nav').forEach((element) => {
      element.style.removeProperty('background-color');
    });

    document.querySelectorAll([
      '.navbar-link',
      TOGGLE_TEXT_SELECTOR,
      '.nav-icon-embed',
      '.button-icon',
      '.your-time-zone.is-menu',
      '.our-time-zone.is-menu',
    ].join(', ')).forEach((element) => {
      element.style.removeProperty('color');
    });
  }

  function init() {
    injectStyles();

    const menu = document.querySelector(MENU_SELECTOR);
    const toggle = document.querySelector(TOGGLE_SELECTOR);
    if (!menu || !toggle) return;

    const toggleText = toggle.querySelector(TOGGLE_TEXT_SELECTOR) || document.querySelector(TOGGLE_TEXT_SELECTOR);
    const overlay = menu.querySelector(OVERLAY_SELECTOR);
    const content = menu.querySelector(CONTENT_SELECTOR);
    const rows = Array.from(menu.querySelectorAll(ROW_SELECTOR));
    const links = Array.from(menu.querySelectorAll(LINK_SELECTOR));
    const locales = menu.querySelector(LOCALES_SELECTOR);
    let isOpen = false;
    let isAnimating = false;

    links.forEach(prepareLink);

    if (window.gsap) {
      window.gsap.set(menu, { autoAlpha: 0 });
      window.gsap.set(overlay, { autoAlpha: 0 });
      window.gsap.set(content, { autoAlpha: 0 });
      window.gsap.set(rows, { autoAlpha: 0, y: '0.75rem' });
      window.gsap.set(links, { autoAlpha: 0, y: '0.35rem' });
      if (locales) window.gsap.set(locales, { autoAlpha: 0, y: '0.35rem' });
    }

    function openMenu() {
      if (isAnimating || isOpen) return;
      isAnimating = true;
      isOpen = true;

      menu.classList.add('is-open');
      toggle.classList.add('is-open');
      document.documentElement.classList.add('is-menu-open');
      document.body.classList.add('is-menu-open');
      forceOriginalNavColors();
      toggle.setAttribute('aria-expanded', 'true');
      scrambleTo(toggleText, 'Close', { duration: 0.55 });

      if (!window.gsap) {
        menu.style.display = 'flex';
        menu.style.opacity = '1';
        isAnimating = false;
        return;
      }

      window.gsap.killTweensOf([menu, overlay, content, rows, links, locales].filter(Boolean));
      window.gsap.set(menu, { display: 'flex', autoAlpha: 1 });
      window.gsap.set(overlay, { autoAlpha: 0 });
      window.gsap.set(content, { autoAlpha: 0 });
      window.gsap.set(rows, { autoAlpha: 0, y: '0.75rem' });
      window.gsap.set(links, { autoAlpha: 0, y: '0.35rem' });
      if (locales) window.gsap.set(locales, { autoAlpha: 0, y: '0.35rem' });

      const tl = window.gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          isAnimating = false;
        },
      });

      tl.to(overlay, { autoAlpha: 1, duration: 0.45 }, 0);
      tl.to(content, { autoAlpha: 1, duration: 0.35 }, 0.08);
      tl.to(rows, { autoAlpha: 1, y: '0rem', duration: 0.55, stagger: 0.06 }, 0.12);
      tl.to(links, {
        autoAlpha: 1,
        y: '0rem',
        duration: 0.35,
        stagger: 0.055,
        onStart: () => {
          links.forEach((link, index) => scrambleLinkIn(link, index * 0.055));
        },
      }, 0.18);

      if (locales) {
        const localesStart = 0.18 + Math.max(links.length - 1, 0) * 0.055 + 0.05;
        tl.to(locales, { autoAlpha: 1, y: '0rem', duration: 0.4 }, localesStart);
      }
    }

    function closeMenu() {
      if (isAnimating || !isOpen) return;
      isAnimating = true;
      isOpen = false;

      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      scrambleTo(toggleText, 'Menu', { duration: 0.5 });

      if (!window.gsap) {
        menu.classList.remove('is-open');
        menu.style.display = 'none';
        menu.style.opacity = '';
        clearOriginalNavColors();
        document.documentElement.classList.remove('is-menu-open');
        document.body.classList.remove('is-menu-open');
        isAnimating = false;
        return;
      }

      window.gsap.killTweensOf([menu, overlay, content, rows, links, locales].filter(Boolean));

      const tl = window.gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          menu.classList.remove('is-open');
          window.gsap.set(menu, { display: 'none', autoAlpha: 0 });
          clearOriginalNavColors();
          document.documentElement.classList.remove('is-menu-open');
          document.body.classList.remove('is-menu-open');
          isAnimating = false;
        },
      });

      if (locales) {
        tl.to(locales, { autoAlpha: 0, y: '-0.25rem', duration: 0.25 }, 0);
      }
      tl.to(links, { autoAlpha: 0, y: '-0.25rem', duration: 0.25, stagger: { each: 0.025, from: 'end' } }, 0);
      tl.to(rows, { autoAlpha: 0, y: '-0.5rem', duration: 0.35, stagger: { each: 0.035, from: 'end' } }, 0.05);
      tl.to(content, { autoAlpha: 0, duration: 0.25 }, 0.1);
      tl.to(overlay, { autoAlpha: 0, duration: 0.35 }, 0.12);
      tl.to(menu, { autoAlpha: 0, duration: 0.35 }, 0.12);
    }

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      if (isOpen) closeMenu();
      else openMenu();
    });

    links.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && isOpen) closeMenu();
    });
  }

  ready(init);
})();
