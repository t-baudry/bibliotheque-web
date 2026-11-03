(() => {
  const style = document.createElement('style');
  style.textContent = `
    .transition-cover {
      background: #000 !important;
      position: fixed;
      inset: 0;
      z-index: 99999;
    }
  `;
  document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', function () {

  const links = document.querySelectorAll('a:not([target="_blank"])');
  const transitionCover = document.querySelector('.transition-cover');
  const pageWrapper = document.querySelector('.page-wrapper');

  if (!transitionCover || !pageWrapper) return;

  const startTransitionAnimation = (targetURL) => {
    gsap.set(transitionCover, {
      display: 'flex',
      autoAlpha: 0
    });

    gsap.to(transitionCover, {
      duration: 0.6,
      autoAlpha: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        window.location.href = targetURL;
      }
    });
  };

  const endTransitionAnimation = () => {
    gsap.set(pageWrapper, { opacity: 0 });
    gsap.set(transitionCover, {
      display: 'flex',
      autoAlpha: 1
    });

    gsap.to(transitionCover, {
      duration: 0.8,
      autoAlpha: 0,
      ease: 'power2.inOut',
      onStart: () => {
        gsap.to(pageWrapper, {
          opacity: 1,
          duration: 0.4,
          ease: 'power1.out'
        });
      },
      onComplete: () => {
        gsap.set(transitionCover, {
          display: 'none',
          autoAlpha: 0
        });
      }
    });
  };

  const hasTransition = sessionStorage.getItem('nextPageTransition');

  if (hasTransition) {
    endTransitionAnimation();
    sessionStorage.removeItem('nextPageTransition');
  } else {
    gsap.set(pageWrapper, { opacity: 1 });
    gsap.set(transitionCover, {
      display: 'none',
      autoAlpha: 0
    });
  }

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');

      if (!href || href.startsWith('#')) return;

      if (link.href === window.location.href) return;

      e.preventDefault();
      sessionStorage.setItem('nextPageTransition', 'true');
      startTransitionAnimation(link.href);
    });
  });

});


window.addEventListener('pageshow', function (event) {
  const transitionCover = document.querySelector('.transition-cover');
  const pageWrapper = document.querySelector('.page-wrapper');

  if (!transitionCover || !pageWrapper) return;

  if (event.persisted) {
    gsap.killTweensOf('*');

    gsap.set(pageWrapper, { opacity: 1 });
    gsap.set(transitionCover, {
      display: 'none',
      autoAlpha: 0
    });

    sessionStorage.removeItem('nextPageTransition');
  }
});
