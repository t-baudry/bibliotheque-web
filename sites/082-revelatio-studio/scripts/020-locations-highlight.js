(() => {
  const MIN_OPACITY = 0.08;
  const MAX_OPACITY = 1;

  const init = () => {
    const wrapper = document.querySelector('.locations_component-view');
    const sticky = document.querySelector('.locations_component-sticky');
    const text = document.querySelector('.locations_text');

    if (!wrapper || !sticky || !text) return;

    const raw = text.textContent.trim();
    const cities = raw.split(',').map((c) => c.trim()).filter(Boolean);

    if (cities.length === 0) return;

    text.innerHTML = cities
      .map((city, i) => {
        const comma = i < cities.length - 1 ? ',' : '';
        return (
          `<span class="loc-word" data-i="${i}" ` +
          `style="opacity:${MIN_OPACITY};` +
          `transition:opacity .12s linear;` +
          `display:inline-block">${city}${comma}</span>`
        );
      })
      .join(' ');

    const spans = text.querySelectorAll('.loc-word');

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const rect = wrapper.getBoundingClientRect();
      const stickyH = sticky.offsetHeight;
      const total = wrapper.offsetHeight - stickyH;

      if (total <= 0) return;

      const extra = total / Math.max(1, cities.length - 1);
      const scrolled = Math.max(0, Math.min(total + extra, -rect.top));
      const progress = scrolled / total;

      const focused = progress * (cities.length - 1);

      spans.forEach((span, i) => {
        const distance = Math.abs(i - focused);
        const fade = Math.max(0, 1 - distance);
        const opacity = MIN_OPACITY + fade * (MAX_OPACITY - MIN_OPACITY);
        span.style.opacity = opacity.toFixed(3);
      });
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
