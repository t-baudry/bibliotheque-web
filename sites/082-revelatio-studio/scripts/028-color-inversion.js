(() => {
  const css = `
    html {
      transition: background-color .35s ease, color .35s ease;
    }
    body, body * {
      transition:
        background-color .35s ease,
        color .35s ease,
        border-color .35s ease,
        fill .35s ease,
        stroke .35s ease;
    }

    html {
      --tbg: #fff;
      --tfg: #000;
      --tt: hsla(0, 0%, 0%, .08);
      --tline: hsla(0, 0%, 0%, .85);
      --tfg-60: rgba(0, 0, 0, .6);
      --tfg-40: rgba(0, 0, 0, .4);
    }
    html.dt {
      --tbg: #000;
      --tfg: #fff;
      --tt: hsla(0, 0%, 100%, .16);
      --tline: hsla(0, 0%, 100%, .85);
      --tfg-60: rgba(255, 255, 255, .6);
      --tfg-40: rgba(255, 255, 255, .4);
    }

    body,
    .section,
    .Footer {
      background-color: var(--tbg) !important;
      color: var(--tfg);
    }

    .background-color-neutral-dark,
    .background-color-neutral-light {
      background-color: var(--tbg) !important;
    }

    .text-color-neutral-light,
    .text-color-neutral-dark,
    .footer_link {
      color: var(--tfg) !important;
    }

    /* op-* usa alpha na cor (não opacity no elemento) → inversão instantânea no mobile */
    .op-60,
    .op-60 :where(h1, h2, h3, h4, h5, h6, p, a, li, span, label, blockquote, strong, em, small, div) {
      opacity: 1 !important;
      color: var(--tfg-60) !important;
      transition: color .35s ease, background-color .35s ease, border-color .35s ease, fill .35s ease, stroke .35s ease !important;
    }

    .op-40,
    .op-40 :where(h1, h2, h3, h4, h5, h6, p, a, li, span, label, blockquote, strong, em, small, div) {
      opacity: 1 !important;
      color: var(--tfg-40) !important;
      transition: color .35s ease, background-color .35s ease, border-color .35s ease, fill .35s ease, stroke .35s ease !important;
    }

    .navbar-actions,
    .is-nav {
      background-color: var(--tt) !important;
    }

    .navbar-link,
    .navbar-menu,
    .locales_link,
    .locales_link *,
    .text-dash {
      color: var(--tfg) !important;
    }

    .nav-icon-embed,
    .button-icon,
    .accordion-css__item-icon,
    .icon-cta {
      color: var(--tfg) !important;
    }

    .nav-icon-embed svg,
    .nav-icon-embed svg *,
    .button-icon svg,
    .button-icon svg * {
      fill: currentColor !important;
      stroke: currentColor !important;
    }

    .button:not(.is-white):not(.is-submit) {
      background-color: var(--tt) !important;
      color: var(--tfg) !important;
    }
    .button-news,
    .text-button-large,
    .testimonial-lines__button,
    .your-time-zone,
    .our-time-zone {
      color: var(--tfg) !important;
    }

    .your-time-zone.is-menu,
    .our-time-zone.is-menu {
      color: inherit !important;
    }

    body :where(h1, h2, h3, h4, h5, h6, p, a, li, span, label,
                blockquote, strong, em, small) {
      color: var(--tfg);
    }

    .preview-item__heading,
    .text-color-alternate,
    .is-white:not(.button) {
      color: var(--tfg) !important;
    }

    .testimonial-lines__h,
    .testimonial-lines__h * {
      color: var(--tfg) !important;
    }

    .is-light,
    .is-white:not(.button),
    .header-line,
    .approach_item,
    .contact_cta,
    .form_input,
    .footer_component,
    .projects_filter-item {
      border-color: var(--tt) !important;
    }

    .FAQ.Item.Wrapper,
    [class~="FAQ"][class~="Item"][class~="Wrapper"] {
      background-color: var(--tt) !important;
    }

    html .client-item {
      background-color: hsla(0, 0%, 0%, .04) !important;
    }
    html.dt .client-item {
      background-color: hsla(0, 0%, 100%, .04) !important;
    }

    .projects_filter-item,
    .projects_filter-item *,
    .cta-icon,
    .cta-icon *,
    .is-active {
      color: var(--tfg) !important;
    }

    .cta-icon,
    .cta-icon *,
    .icon-cta,
    .icon-cta * {
      transition: color .35s ease, fill .35s ease, stroke .35s ease !important;
    }

    .cta-icon svg,
    .cta-icon svg *,
    .icon-cta svg,
    .icon-cta svg * {
      fill: currentColor !important;
      stroke: currentColor !important;
    }

    .line-cta {
      background-color: var(--tfg) !important;
      transition: background-color .35s ease !important;
    }

    .accordion-css__item-h3 {
      color: var(--tfg) !important;
    }

    .accordion-css__item-icon,
    .accordion-css__item-icon * {
      color: var(--tfg) !important;
      transition: color .35s ease, fill .35s ease, stroke .35s ease !important;
    }

    .accordion-css__item-icon svg,
    .accordion-css__item-icon svg * {
      fill: currentColor !important;
      stroke: currentColor !important;
    }

    .metrics_line.is-item-faq {
      background-color: var(--tline) !important;
      transition: background-color .35s ease !important;
    }

    .results_card {
      background-color: var(--tt) !important;
    }

    .results_card,
    .results_card *,
    .results_card .text-color-neutral-500,
    .results_card .text-size-small,
    .results_card .results_card-header,
    .results_card .max-width-18em {
      color: var(--tfg) !important;
    }

    ::selection {
      background-color: var(--tfg);
      color: var(--tbg);
    }

    html.is-menu-open .navbar-actions,
    html.is-menu-open .is-nav {
      background-color: hsla(0, 0%, 100%, .16) !important;
    }

    html.is-menu-open .navbar-link,
    html.is-menu-open .navbar-menu,
    html.is-menu-open .locales_link,
    html.is-menu-open .locales_link *,
    html.is-menu-open .text-dash,
    html.is-menu-open .your-time-zone.is-menu,
    html.is-menu-open .our-time-zone.is-menu,
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

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  let rafId = 0;

  const update = () => {
    rafId = 0;
    const sections = document.querySelectorAll('.section');
    const center = window.innerHeight * 0.5;
    let isDark = null;

    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.height < 10) continue;
      if (rect.top <= center && rect.bottom >= center) {
        isDark = sec.classList.contains('background-color-neutral-dark');
        break;
      }
    }

    if (isDark === null) return;
    document.documentElement.classList.toggle('dt', isDark);
  };

  const onScroll = () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  };

  const ready = () => {
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
