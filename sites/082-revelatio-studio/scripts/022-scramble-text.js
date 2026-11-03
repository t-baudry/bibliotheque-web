gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

const SCRAMBLE_CHARS = '^$%#@!&*?+=';

const scrambleStyle = document.createElement('style');
scrambleStyle.textContent = `
  .word {
    display: inline-block;
    white-space: nowrap;
  }
  .char {
    display: inline-block;
  }
  [data-scramble="load-in"] {
    opacity: 0;
    transform: translateY(0.75em);
  }
`;
document.head.appendChild(scrambleStyle);

function randomScramble(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }
  return result;
}

function scrambleWords(words, options) {
  const { duration, stagger, speed, baseDelay = 0, onComplete } = options;
  const originals = words.map((w) => w.textContent);

  words.forEach((w, i) => {
    w.textContent = randomScramble(originals[i].length);
  });

  let pending = words.length;
  words.forEach((word, i) => {
    gsap.to(word, {
      duration,
      delay: baseDelay + i * stagger,
      scrambleText: {
        text: originals[i],
        chars: SCRAMBLE_CHARS,
        speed,
      },
      onComplete: () => {
        pending -= 1;
        if (pending === 0 && onComplete) onComplete();
      },
    });
  });
}

function initScrambleOnLoad() {
  const targets = document.querySelectorAll('[data-scramble="load"]');

  targets.forEach((target) => {
    const split = new SplitText(target, {
      type: 'words, chars',
      wordsClass: 'word',
      charsClass: 'char',
    });

    scrambleWords(split.words, {
      duration: 1.2,
      stagger: 0.01,
      speed: 0.85,
      baseDelay: 0.2,
      onComplete: () => split.revert(),
    });
  });
}

function initScrambleOnLoadIn() {
  const targets = document.querySelectorAll('[data-scramble="load-in"]');

  targets.forEach((target, targetIndex) => {
    if (target.dataset.scrambleLoadInDone === '1') return;
    target.dataset.scrambleLoadInDone = '1';

    const baseDelay = 0.2 + targetIndex * 0.18;

    gsap.fromTo(target, {
      autoAlpha: 0,
      y: '0.75em',
    }, {
      autoAlpha: 1,
      y: '0em',
      duration: 0.9,
      delay: baseDelay,
      ease: 'power3.out',
      overwrite: true,
    });

  });
}

function initScrambleOnLoadHome() {
  const targets = document.querySelectorAll('[data-scramble="load-home"]');

  targets.forEach((target) => {
    if (target.dataset.scrambleHomeDone === '1') return;
    target.dataset.scrambleHomeDone = '1';

    const split = new SplitText(target, {
      type: 'words, chars',
      wordsClass: 'word',
      charsClass: 'char',
    });

    scrambleWords(split.words, {
      duration: 1.2,
      stagger: 0.01,
      speed: 0.85,
      baseDelay: 0.05,
      onComplete: () => split.revert(),
    });
  });
}

window.revelatioScrambleLoadHome = initScrambleOnLoadHome;
window.addEventListener('revelatio:preloader-done', () => {
  initScrambleOnLoadHome();
});

function initScrambleOnScroll() {
  const targets = document.querySelectorAll('[data-scramble="scroll"]');

  targets.forEach((target) => {
    const split = new SplitText(target, {
      type: 'words, chars',
      wordsClass: 'word',
      charsClass: 'char',
    });

    const originals = split.words.map((w) => w.textContent);

    ScrollTrigger.create({
      trigger: target,
      start: 'top bottom',
      once: true,
      onEnter: () => {
        split.words.forEach((w, i) => {
          w.textContent = randomScramble(originals[i].length);
        });

        let pending = split.words.length;
        split.words.forEach((word, i) => {
          gsap.to(word, {
            duration: 1.4,
            delay: i * 0.015,
            scrambleText: {
              text: originals[i],
              chars: SCRAMBLE_CHARS,
              speed: 0.95,
            },
            onComplete: () => {
              pending -= 1;
              if (pending === 0) split.revert();
            },
          });
        });
      },
    });
  });
}

function initScrambleOnHover() {
  const targets = document.querySelectorAll('[data-scramble-hover="link"]');

  targets.forEach((target) => {
    const textEl = target.querySelector('[data-scramble-hover="target"]');
    if (!textEl) return;

    const split = new SplitText(textEl, {
      type: 'chars',
      charsClass: 'char',
    });

    target.addEventListener('mouseenter', () => {
      gsap.to(target, {
        scale: 0.985,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
      gsap.to(split.chars, {
        keyframes: [
          { opacity: 0, duration: 0.06, ease: 'none' },
          { opacity: 1, duration: 0.04, ease: 'none' },
          { opacity: 0, duration: 0.05, ease: 'none' },
          { opacity: 1, duration: 0.08, ease: 'none' },
        ],
        stagger: { each: 0.03, from: 'random' },
        overwrite: true,
      });
    });

    target.addEventListener('mouseleave', () => {
      gsap.to(target, {
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
      gsap.to(split.chars, {
        keyframes: [
          { opacity: 0, duration: 0.06, ease: 'none' },
          { opacity: 1, duration: 0.04, ease: 'none' },
          { opacity: 0, duration: 0.05, ease: 'none' },
          { opacity: 1, duration: 0.08, ease: 'none' },
        ],
        stagger: { each: 0.03, from: 'random' },
        overwrite: true,
      });
    });
  });
}

function initScaleHover() {
  const targets = document.querySelectorAll('.navbar-actions-locale');

  targets.forEach((target) => {
    if (target.dataset.scaleHoverBound === '1') return;
    target.dataset.scaleHoverBound = '1';

    target.addEventListener('mouseenter', () => {
      gsap.to(target, {
        scale: 0.985,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
    });

    target.addEventListener('mouseleave', () => {
      gsap.to(target, {
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrambleOnLoad();
  initScrambleOnLoadIn();
  initScrambleOnScroll();
  initScrambleOnHover();
  initScaleHover();
});
