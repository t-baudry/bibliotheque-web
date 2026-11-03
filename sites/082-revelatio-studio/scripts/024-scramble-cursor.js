function initScrambleTextCursor() {
  const cursor = document.querySelector('[data-cursor]');
  const cursorTextTarget = document.querySelector('[data-cursor-text-target]');

  if (!cursor || !cursorTextTarget || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let hasMouseMoved = false;
  let activeHoverItem = null;

  const scrambleCharacters = 'XYZxy#&@0$\u20ac\u00a3';
  const confidentialText = 'confidential';
  const confidentialColor = '#ffd166';
  const defaultTextColor = '';
  const activeScale = 1;
  const inactiveScale = 0.02;
  let scrambleActive = false;
  const scaleState = { value: inactiveScale };
  let scaleTween = null;
  let started = false;

  function applyCursorTextColor(text) {
    const normalized = (text || '').trim().toLowerCase();
    cursorTextTarget.style.color = normalized === confidentialText ? confidentialColor : defaultTextColor;
  }

  // Mesma ancora do circle-cursor: centro exato no ponteiro.
  cursor.style.position = 'fixed';
  cursor.style.top = '0';
  cursor.style.left = '0';
  cursor.style.pointerEvents = 'none';
  cursor.style.willChange = 'transform';
  cursor.style.opacity = '0';

  function applyCursorPose() {
    const scale = scaleState.value;
    cursor.style.transform =
      'translate3d(' + mouseX + 'px,' + mouseY + 'px,0) translate(-50%,-50%) scale(' + scale + ')';
  }

  function animateScrambleState(active) {
    if (scaleTween) scaleTween.kill();
    scaleTween = gsap.to(scaleState, {
      value: active ? activeScale : inactiveScale,
      duration: active ? 0.32 : 0.2,
      ease: active ? 'power3.out' : 'power2.out',
      onUpdate: applyCursorPose,
    });
  }

  function updateCursor() {
    const hoverItem = document.elementFromPoint(mouseX, mouseY)?.closest('[data-cursor-hover]');
    const rect = cursor.getBoundingClientRect();

    const isHovering = !!hoverItem;
    const isEdge = rect.right >= window.innerWidth;
    const text = hoverItem?.getAttribute('data-cursor-text') || '';

    cursor.setAttribute('data-cursor', isHovering ? (isEdge ? 'active-edge' : 'active') : '');
    if (isHovering !== scrambleActive) {
      scrambleActive = isHovering;
      animateScrambleState(scrambleActive);
      window.dispatchEvent(
        new CustomEvent('revelatio:scramble-cursor-active', {
          detail: { active: scrambleActive, x: mouseX, y: mouseY },
        })
      );
    }

    if (hoverItem !== activeHoverItem) {
      applyCursorTextColor(text);
      gsap.to(cursorTextTarget, {
        duration: 0.6,
        overwrite: 'auto',
        scrambleText: {
          text: text,
          chars: scrambleCharacters,
          speed: 1.2
        }
      });

      activeHoverItem = hoverItem;
    }
  }

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    hasMouseMoved = true;
    if (!started) {
      started = true;
      cursor.style.opacity = '1';
    }

    // Sem smooth: segue o mouse 1:1, igual ao circle-cursor.
    applyCursorPose();

    requestAnimationFrame(updateCursor);
  });

  window.addEventListener('scroll', () => {
    if (!hasMouseMoved) return;
    requestAnimationFrame(updateCursor);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrambleTextCursor();
});
