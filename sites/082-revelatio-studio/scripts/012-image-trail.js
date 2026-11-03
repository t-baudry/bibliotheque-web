(() => {
  function initRotatingImageTrail() {
    const area = document.querySelector('[data-trail-area]');
    if (!area) return;

    const collection = area.querySelector('[data-trail-collection]');
    if (!collection) return;

    const items = collection.querySelectorAll('[data-trail-item]');
    if (!items.length) return;

    let index = 0;
    let lastCloneX = null;
    let lastCloneY = null;

    const cardWidth = items[0].getBoundingClientRect().width;
    const stepDistance = cardWidth * 0.5;

    function spawnTrailItem(x, y) {
      const original = items[index];
      const clone = original.cloneNode(true);

      clone.style.left = x + 'px';
      clone.style.top = y + 'px';

      clone.setAttribute('data-trail-item', 'hidden');
      area.appendChild(clone);

      void clone.getBoundingClientRect();

      clone.setAttribute('data-trail-item', 'visible');

      setTimeout(() => {
        clone.setAttribute('data-trail-item', 'transition-out');
      }, 400);

      setTimeout(() => {
        clone.remove();
      }, 1200);

      index = (index + 1) % items.length;
      lastCloneX = x;
      lastCloneY = y;
    }

    area.addEventListener('mousemove', (event) => {
      const rect = area.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lastCloneX = null;
        lastCloneY = null;
        return;
      }

      if (lastCloneX === null || lastCloneY === null) {
        spawnTrailItem(x, y);
        return;
      }

      const dx = x - lastCloneX;
      const dy = y - lastCloneY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= stepDistance) {
        spawnTrailItem(x, y);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRotatingImageTrail);
  } else {
    initRotatingImageTrail();
  }
})();
