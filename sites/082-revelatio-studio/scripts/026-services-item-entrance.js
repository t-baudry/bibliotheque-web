(() => {
  if (window.__revelatioServicesItemEntranceInit) return;
  window.__revelatioServicesItemEntranceInit = true;

  const ITEM_SELECTOR = '.services_item';
  const ITEM_BOUND_ATTR = 'data-services-entrance-bound';
  const PREPARED_ATTR = 'data-services-entrance-prepared';
  const LINE_CLASS = 'services-entrance-line';

  function injectStyles() {
    if (document.getElementById('services-item-entrance-styles')) return;
    const style = document.createElement('style');
    style.id = 'services-item-entrance-styles';
    style.textContent = `
      .${LINE_CLASS} {
        display: block;
      }
      [${PREPARED_ATTR}="1"] .${LINE_CLASS} {
        opacity: 0;
        transform: translateY(var(--services-entrance-y, 0.75rem));
        will-change: opacity, transform;
      }
    `;
    document.head.appendChild(style);
  }

  // Quebra o innerHTML de um elemento em "linhas" (por <br> ou \n).
  // Retorna os spans criados, ou null se nao houver mais de uma linha.
  function splitElementIntoLines(el) {
    const html = el.innerHTML;
    if (!html) return null;

    const parts = html
      .replace(/\r\n/g, '\n')
      .split(/<br\s*\/?>/i)
      .flatMap((chunk) => chunk.split('\n'))
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0);

    if (parts.length < 2) return null;

    el.innerHTML = '';
    return parts.map((part) => {
      const line = document.createElement('span');
      line.className = LINE_CLASS;
      line.innerHTML = part;
      el.appendChild(line);
      return line;
    });
  }

  function getRichTextRoot(item) {
    if (item.matches('.w-richtext')) return item;
    return item.querySelector('.w-richtext') || item;
  }

  // Monta a lista de alvos (uma "linha" por alvo) e ja deixa tudo escondido.
  function prepareTargets(item) {
    const root = getRichTextRoot(item);
    const blocks = Array.from(
      root.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote')
    ).filter((el) => el.children.length === 0 || !el.querySelector('p, li, h1, h2, h3, h4, h5, h6, blockquote'));

    let targets = [];

    if (blocks.length) {
      blocks.forEach((block) => {
        const lines = splitElementIntoLines(block);
        if (lines && lines.length) {
          targets.push(...lines);
        } else if (block.textContent.trim().length) {
          block.classList.add(LINE_CLASS);
          targets.push(block);
        }
      });
    } else {
      const lines = splitElementIntoLines(root);
      if (lines && lines.length) {
        targets = lines;
      }
    }

    if (!targets.length) {
      // fallback: anima o item inteiro
      item.classList.add(LINE_CLASS);
      targets = [item];
    }

    item.setAttribute(PREPARED_ATTR, '1');
    return targets;
  }

  function animateTargets(item, targets) {
    const duration = parseFloat(item.getAttribute('data-services-entrance-duration')) || 0.6;
    const stagger = parseFloat(item.getAttribute('data-services-entrance-stagger')) || 0.09;

    if (window.gsap) {
      window.gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: 'power2.out',
        clearProps: 'will-change',
        overwrite: true,
      });
      return;
    }

    targets.forEach((el, idx) => {
      el.style.transition = `opacity ${duration}s ease, transform ${duration}s ease`;
      el.style.transitionDelay = `${idx * stagger}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  function bindItem(item) {
    if (item.getAttribute(ITEM_BOUND_ATTR) === '1') return;
    item.setAttribute(ITEM_BOUND_ATTR, '1');

    const yStart = item.getAttribute('data-services-entrance-y');
    if (yStart) item.style.setProperty('--services-entrance-y', yStart);

    // Prepara (quebra em linhas + esconde) imediatamente, evitando flash.
    const targets = prepareTargets(item);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      animateTargets(item, targets);
      return;
    }

    const threshold = parseFloat(item.getAttribute('data-services-entrance-threshold'));
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          animateTargets(item, targets);
        });
      },
      {
        threshold: Number.isFinite(threshold) ? threshold : 0.2,
        rootMargin: item.getAttribute('data-services-entrance-root-margin') || '0px 0px -8% 0px',
      }
    );

    observer.observe(item);
  }

  function boot() {
    injectStyles();
    document.querySelectorAll(ITEM_SELECTOR).forEach(bindItem);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('load', boot);
  window.addEventListener('revelatio:preloader-done', boot);
})();
