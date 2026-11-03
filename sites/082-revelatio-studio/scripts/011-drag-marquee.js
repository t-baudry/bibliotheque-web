/* ============================================================
   Revelatio - Drag Marquee (loop manual em requestAnimationFrame)

   Mesma ideia de antes: marquee infinito que anda sozinho e que
   voce pode ARRASTAR para acelerar / inverter a direcao.

   Diferenca: NAO depende de GSAP / ScrollTrigger / Observer.
   Tudo e vanilla JS + rAF, entao nao existe corrida de
   carregamento de libs nem estado que "trava". Funciona sempre.
   ============================================================ */
(function () {
  const SELECTOR = '[data-draggable-marquee-init]';

  const getNum = (el, name, fallback) => {
    const v = parseFloat(el.getAttribute(name));
    return Number.isFinite(v) ? v : fallback;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Espera fontes + imagens para medir a largura correta (sem "encolher").
  function whenContentMeasurable(wrapper) {
    const tasks = [];
    if (document.fonts && document.fonts.ready) {
      tasks.push(document.fonts.ready.catch(() => {}));
    }
    Array.from(wrapper.querySelectorAll('img'))
      .filter((img) => !img.complete)
      .forEach((img) => {
        tasks.push(
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
        );
      });
    return Promise.all(tasks);
  }

  function setupMarquee(wrapper) {
    if (wrapper.__marqueeBound) return;
    const collection = wrapper.querySelector('[data-draggable-marquee-collection]');
    const list = wrapper.querySelector('[data-draggable-marquee-list]');
    if (!collection || !list) return;
    wrapper.__marqueeBound = true;

    const duration = Math.max(1, getNum(wrapper, 'data-duration', 20)); // seg p/ uma lista
    const multiplier = getNum(wrapper, 'data-multiplier', 40);          // pico do arrasto
    const sensitivity = getNum(wrapper, 'data-sensitivity', 0.01);
    // timeScale base: +1 = anda para a esquerda, -1 = para a direita.
    const baseTS =
      (wrapper.getAttribute('data-direction') || 'left').toLowerCase() === 'right' ? -1 : 1;
    const RECOVER = 0.9; // segundos para voltar ao ritmo base apos um arrasto

    // Garante uma unica linha (defensivo; o CSS ja costuma fazer isso).
    collection.style.flexWrap = 'nowrap';
    collection.style.willChange = 'transform';

    let listWidth = 0;
    let offset = 0;
    let timeScale = baseTS;
    let restingTS = baseTS;
    let visible = true;
    let built = false;

    let dragging = false;
    let lastX = 0;
    let lastMoveT = 0;
    let lastFrame = 0;

    function measureAndBuild() {
      const w = list.getBoundingClientRect().width;
      const wrapperWidth = wrapper.getBoundingClientRect().width;
      if (w <= 0 || wrapperWidth <= 0) return false;
      listWidth = w;

      // Clones suficientes para cobrir wrapper + uma lista (loop sem buraco).
      const needed = wrapperWidth + listWidth + 2;
      let guard = 0;
      while (collection.scrollWidth < needed && guard < 60) {
        const clone = list.cloneNode(true);
        clone.setAttribute('data-draggable-marquee-clone', '');
        clone.setAttribute('aria-hidden', 'true');
        collection.appendChild(clone);
        guard += 1;
      }
      built = true;
      return true;
    }

    // Tenta medir agora; observa para remontar quando a largura mudar/aparecer.
    measureAndBuild();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        const prev = listWidth;
        const ok = measureAndBuild();
        if (ok && prev && listWidth && Math.abs(prev - listWidth) > 0.5) {
          offset %= listWidth; // mantem posicao coerente em mudancas responsivas
        }
      });
      ro.observe(wrapper);
      ro.observe(list);
    }

    // Pausa quando fora da viewport (IntersectionObserver reporta o estado na hora).
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) visible = e.isIntersecting;
        },
        { threshold: 0 }
      );
      io.observe(wrapper);
    }

    // ---- Arrasto: muda velocidade/direcao; depois volta ao ritmo base. ----
    // touch-action pan-y mantem o scroll vertical da pagina funcionando.
    wrapper.style.touchAction = 'pan-y';

    wrapper.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      lastMoveT = performance.now();
    });

    wrapper.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastMoveT);
      const vx = ((e.clientX - lastX) / dt) * 1000; // px/s
      let ts = clamp(vx * -sensitivity, -multiplier, multiplier);
      timeScale = ts;
      if (ts < -0.001) restingTS = -1;
      else if (ts > 0.001) restingTS = 1;
      lastX = e.clientX;
      lastMoveT = now;
    });

    const endDrag = () => {
      dragging = false;
    };
    wrapper.addEventListener('pointerup', endDrag);
    wrapper.addEventListener('pointercancel', endDrag);
    wrapper.addEventListener('pointerleave', endDrag);
    window.addEventListener('blur', endDrag);

    function frame(now) {
      if (!lastFrame) lastFrame = now;
      let dt = (now - lastFrame) / 1000;
      lastFrame = now;
      if (dt > 0.05) dt = 0.05; // evita salto apos aba inativa

      if (!dragging) {
        timeScale += (restingTS - timeScale) * Math.min(1, dt / RECOVER);
      }

      if (built && listWidth > 0 && visible) {
        const speedPx = listWidth / duration;
        offset -= speedPx * timeScale * dt;
        offset %= listWidth;
        if (offset > 0) offset -= listWidth;
        collection.style.transform = 'translate3d(' + offset + 'px,0,0)';
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    wrapper.setAttribute('data-draggable-marquee-init', 'initialized');
  }

  function boot() {
    document.querySelectorAll(SELECTOR).forEach((wrapper) => {
      whenContentMeasurable(wrapper).then(() => setupMarquee(wrapper));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('load', boot);
  window.addEventListener('revelatio:preloader-done', boot);
})();
