function injectNewsSwiperStyles() {
  if (document.getElementById('news-swiper-styles')) return;
  const style = document.createElement('style');
  style.id = 'news-swiper-styles';
  style.textContent = [
    '.swiper-prev, .swiper-next {',
    '  opacity: 1;',
    '  transition: opacity 0.3s ease;',
    '  cursor: pointer;',
    '}',
    '.swiper-prev.swiper-button-disabled, .swiper-next.swiper-button-disabled {',
    '  opacity: 0.4;',
    '  pointer-events: none;',
    '}'
  ].join('\n');
  document.head.appendChild(style);
}

function initNewsSwiper() {
  const elements = document.querySelectorAll('.swiper.is-news, .is-news.swiper');
  if (!elements.length) return;

  if (!window.Swiper) {
    return;
  }

  injectNewsSwiperStyles();

  elements.forEach((el) => {
    if (el.dataset.swiperBound === '1') return;

    // spaceBetween = 2em (relativo ao font-size do próprio swiper).
    const fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
    const spaceBetween = fontSize * 2;

    // Botões de navegação dentro de .group-button-news.
    const scope = el.closest('section, .w-layout-blockcontainer, [data-news-section]') || document;
    const buttonGroup =
      scope.querySelector('.group-button-news') ||
      document.querySelector('.group-button-news');

    const nextEl = buttonGroup ? buttonGroup.querySelector('.swiper-next') : null;
    const prevEl = buttonGroup ? buttonGroup.querySelector('.swiper-prev') : null;

    new Swiper(el, {
      slidesPerView: 3,
      spaceBetween: spaceBetween,
      speed: 700,
      cssMode: false,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
      },
      navigation: {
        nextEl: nextEl,
        prevEl: prevEl,
        disabledClass: 'swiper-button-disabled',
      },
    });

    el.dataset.swiperBound = '1';
  });
}

function whenSwiperReady(callback) {
  if (window.Swiper) {
    callback();
    return;
  }
  let tries = 0;
  const maxTries = 200; // ~20s
  const timer = setInterval(() => {
    tries += 1;
    if (window.Swiper) {
      clearInterval(timer);
      callback();
    } else if (tries >= maxTries) {
      clearInterval(timer);
      console.warn('[news-swiper] Swiper não carregou a tempo');
    }
  }, 100);
}

function bootNewsSwiper() {
  whenSwiperReady(initNewsSwiper);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootNewsSwiper);
} else {
  bootNewsSwiper();
}

window.addEventListener('load', bootNewsSwiper);
window.addEventListener('revelatio:preloader-done', bootNewsSwiper);
