/* ============================================================
  Revelatio - Circle Cursor
  Faz a div .circle-cursor seguir o mouse 1:1 (sem smooth).
  Vanilla JS, sem dependencias. So ativa em dispositivos com
  mouse (pointer fino); no touch fica escondido.
  ============================================================ */
(function () {
  function init() {
    const cursor = document.querySelector('.circle-cursor');
    if (!cursor) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) {
      cursor.style.display = 'none';
      return;
    }

    // Posicionamento confiavel (independente do CSS do Webflow).
    cursor.style.position = 'fixed';
    cursor.style.top = '0';
    cursor.style.left = '0';
    cursor.style.pointerEvents = 'none';
    cursor.style.willChange = 'transform';
    cursor.style.mixBlendMode = 'difference';
    cursor.style.backgroundColor = '#fff';
    cursor.style.opacity = '0';
    cursor.style.transition = 'opacity .18s ease, transform .22s cubic-bezier(.22,1,.36,1)';

    let started = false;
    let scrambleActive = false;
    let lastX = window.innerWidth * 0.5;
    let lastY = window.innerHeight * 0.5;

    function isLinkLikeTarget(el) {
      if (!el) return false;
      return !!el.closest('a, button, [role="button"], [data-cursor-link]');
    }

    function applyCirclePose(clientX, clientY) {
      const pointed = document.elementFromPoint(clientX, clientY);
      const hoverScale = !scrambleActive && isLinkLikeTarget(pointed) ? 1.5 : 1;
      const morphScale = scrambleActive ? 0.02 : 1;
      const scale = hoverScale * morphScale;
      cursor.style.transform =
        'translate3d(' + clientX + 'px,' + clientY + 'px,0) translate(-50%,-50%) scale(' + scale + ')';
      if (started) cursor.style.opacity = '1';
    }

    window.addEventListener(
      'mousemove',
      (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        applyCirclePose(lastX, lastY);
        if (!started) {
          started = true;
          cursor.style.opacity = '1';
        }
      },
      { passive: true }
    );

    // Quando o scramble estiver ativo, o circle some para evitar dois cursores juntos.
    window.addEventListener('revelatio:scramble-cursor-active', (event) => {
      scrambleActive = !!event.detail?.active;
      if (typeof event.detail?.x === 'number') lastX = event.detail.x;
      if (typeof event.detail?.y === 'number') lastY = event.detail.y;
      applyCirclePose(lastX, lastY);
    });

    // Some quando o mouse sai da janela e reaparece quando volta.
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (started) cursor.style.opacity = '1';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
