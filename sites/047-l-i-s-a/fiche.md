# L.I.S.A.

- Site : [https://lisa.locomotive.ca/en](https://lisa.locomotive.ca/en) — [aperçu statique local](apercu.html)
- Capturé le : 2026-11-02 — statut : ok
- Vidéo de scroll : [▶ ouvrir](https://github.com/t-baudry/bibliotheque-web/releases/download/videos/047-l-i-s-a.webm)

<a href="captures/desktop-00-arrivee.jpg"><img src="captures/desktop-00-arrivee.jpg" width="100%" alt="desktop-00-arrivee.jpg"></a> 

<details><summary>Toutes les captures</summary>

<a href="captures/desktop-01.jpg"><img src="captures/desktop-01.jpg" width="32%" alt="desktop-01.jpg"></a> <a href="captures/desktop-02.jpg"><img src="captures/desktop-02.jpg" width="32%" alt="desktop-02.jpg"></a> <a href="captures/desktop-03.jpg"><img src="captures/desktop-03.jpg" width="32%" alt="desktop-03.jpg"></a> <a href="captures/desktop-04.jpg"><img src="captures/desktop-04.jpg" width="32%" alt="desktop-04.jpg"></a> <a href="captures/desktop-05.jpg"><img src="captures/desktop-05.jpg" width="32%" alt="desktop-05.jpg"></a> <a href="captures/desktop-06.jpg"><img src="captures/desktop-06.jpg" width="32%" alt="desktop-06.jpg"></a> <a href="captures/desktop-07.jpg"><img src="captures/desktop-07.jpg" width="32%" alt="desktop-07.jpg"></a> 

<a href="captures/page1-01.jpg"><img src="captures/page1-01.jpg" width="32%" alt="page1-01.jpg"></a> <a href="captures/page1-02.jpg"><img src="captures/page1-02.jpg" width="32%" alt="page1-02.jpg"></a> <a href="captures/page1-03.jpg"><img src="captures/page1-03.jpg" width="32%" alt="page1-03.jpg"></a> <a href="captures/page1-04.jpg"><img src="captures/page1-04.jpg" width="32%" alt="page1-04.jpg"></a> <a href="captures/page2-01.jpg"><img src="captures/page2-01.jpg" width="32%" alt="page2-01.jpg"></a> <a href="captures/page2-02.jpg"><img src="captures/page2-02.jpg" width="32%" alt="page2-02.jpg"></a> <a href="captures/page2-03.jpg"><img src="captures/page2-03.jpg" width="32%" alt="page2-03.jpg"></a> <a href="captures/page2-04.jpg"><img src="captures/page2-04.jpg" width="32%" alt="page2-04.jpg"></a> 

<a href="captures/mobile-01.jpg"><img src="captures/mobile-01.jpg" width="15%" alt="mobile-01.jpg"></a> <a href="captures/mobile-02.jpg"><img src="captures/mobile-02.jpg" width="15%" alt="mobile-02.jpg"></a> <a href="captures/mobile-03.jpg"><img src="captures/mobile-03.jpg" width="15%" alt="mobile-03.jpg"></a> <a href="captures/mobile-04.jpg"><img src="captures/mobile-04.jpg" width="15%" alt="mobile-04.jpg"></a> <a href="captures/mobile-05.jpg"><img src="captures/mobile-05.jpg" width="15%" alt="mobile-05.jpg"></a> <a href="captures/mobile-06.jpg"><img src="captures/mobile-06.jpg" width="15%" alt="mobile-06.jpg"></a> 

</details>

## Stack détectée
Barba.js, GSAP, Lenis, Lil-GUI/Tweakpane (debug), Locomotive Scroll, ScrollTrigger, SplitText/SplitType, Swiper, Three.js, Virtual scroll, Vue, WebGL

Versions : GSAP 3.14.2 · Three.js r?

Shaders GLSL personnalisés extraits : 20 (voir `shaders.glsl`)

## Design tokens
### Couleurs (fonds, pondérées par surface)
`#000000` · `#ffffff`
### Couleurs de texte
`#000000` · `#ffffff`
### Polices utilisées (par volume de texte)
HelveticaNowDisplay · LocomotiveNew
### Fichiers de police chargés
- PPLocomotiveNew-Light.woff2
- HelveticaNowDisplay-Regular.woff2
### Typographie
| Élément | Police | Taille | Graisse | Interligne | Interlettrage | Casse |
|---|---|---|---|---|---|---|
| h2 | LocomotiveNew, -apple-system, BlinkMacSystemFont,  | 28px | 400 | 32.2px | normal | none |
| p | HelveticaNowDisplay, -apple-system, BlinkMacSystem | 14.4px | 400 | 21.6px | normal | none |
| a | HelveticaNowDisplay, -apple-system, BlinkMacSystem | 26px | 400 | 31.2px | normal | none |
| button | HelveticaNowDisplay, -apple-system, BlinkMacSystem | 12px | 400 | normal | normal | none |
| body | HelveticaNowDisplay, -apple-system, BlinkMacSystem | 15px | 400 | 19.5px | normal | none |

### Échelle des tailles de texte
26px (129) · 15px (6) · 12px (6) · 70px (5) · 115.2px (2) · 14.4px (2) · 13.12px (2) · 28px (1) · 12.8px (1)
### Arrondis
999px · 40px · 50%
### Transitions CSS fréquentes
- cubic-bezier(0.215 0.3s ×7
- ease 0.25s ×3
- cubic-bezier(0.215 0.2s ×1
### Points de rupture (media queries)
1024px · 699px · 1025px · 700px · 480px · 1199px · 1599px · 1600px · 640px · 1200px · 1999px · 2000px
### Animations CSS (@keyframes)
preloaderAppear, swiper-preloader-spin, spin, shake, fall, featuredProjectsAllFlash, lisaDisclaimerFlash, lisaDisclaimerProcedure, lisaLoader, lisaCursor
### Variables CSS (:root)
```css
--color: var(--menu-color);
--color-bg: transparent;
--font-size: 21px;
--spacing-micro-mobile: 8;
--spacing-micro: 14;
--spacing-tiny-mobile: 20;
--spacing-tiny: 20;
--spacing-small-mobile: 30;
--spacing-small: 30;
--spacing-medium-mobile: 40;
--spacing-medium: 40;
--spacing-large-mobile: 52;
--spacing-large: 80;
--spacing-big-mobile: 80;
--spacing-big: 150;
--spacing-huge-mobile: 100;
--spacing-huge: 200;
--spacing-enormous-mobile: 140;
--spacing-enormous: 250;
--border: solid var(--border-size);
--grid-columns: 4;
--grid-gutter: calc(20px/2);
--grid-margin: 1.3333333333rem;
--header-height: 4rem;
--head-padding-vh: 0.25;
--about-head-content-offset-vh: 0.20;
--menu-color: #FFFFFF;
--menu-color-bg: #312DFB;
--font-size-medium: 18px;
--font-size-huge: 40px;
--font-size-h1: 2.4rem;
--font-size-h2: 1.7333333333rem;
--font-size-h3: 1.4666666667rem;
--font-size-h4: 1.3333333333rem;
--font-size-h5: 1.2rem;
--font-size-h6: 1.0666666667rem;
--border-size: 1px;
--swiper-theme-color: #007aff;
--swiper-navigation-size: 44px;
--cc-font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
--cc-modal-border-radius: .5rem;
--cc-btn-border-radius: .4rem;
--cc-modal-transition-duration: .25s;
--cc-link-color: var(--cc-btn-primary-bg);
--cc-modal-margin: 1rem;
--cc-z-index: 2147483647;
--cc-bg: #fff;
--cc-primary-color: #FFFFFF;
--cc-secondary-color: #5e6266;
--cc-btn-primary-bg: #30363c;
--cc-btn-primary-color: #fff;
--cc-btn-primary-border-color: var(--cc-btn-primary-bg);
--cc-btn-primary-hover-bg: #000;
--cc-btn-primary-hover-color: #fff;
--cc-btn-primary-hover-border-color: var(--cc-btn-primary-hover-bg);
--cc-btn-secondary-bg: #eaeff2;
--cc-btn-secondary-color: var(--cc-primary-color);
--cc-btn-secondary-border-color: var(--cc-btn-secondary-bg);
--cc-btn-secondary-hover-bg: #d4dae0;
--cc-btn-secondary-hover-color: #000;
--cc-btn-secondary-hover-border-color: #d4dae0;
--cc-separator-border-color: #f0f4f7;
--cc-toggle-on-bg: var(--cc-btn-primary-bg);
--cc-toggle-off-bg: #667481;
--cc-toggle-on-knob-bg: #fff;
--cc-toggle-off-knob-bg: var(--cc-toggle-on-knob-bg);
--cc-toggle-readonly-bg: #d5dee2;
--cc-toggle-readonly-knob-bg: #fff;
--cc-toggle-readonly-knob-icon-color: var(--cc-toggle-readonly-bg);
--cc-section-category-border: var(--cc-cookie-category-block-bg);
--cc-cookie-category-block-bg: #f0f4f7;
--cc-cookie-category-block-border: #f0f4f7;
--cc-cookie-category-block-hover-bg: #e9eff4;
--cc-cookie-category-block-hover-border: #e9eff4;
--cc-cookie-category-expanded-block-bg: transparent;
--cc-cookie-category-expanded-block-hover-bg: #dee4e9;
--cc-overlay-bg: rgba(0,0,0,.65);
--cc-footer-bg: var(--cc-btn-secondary-bg);
--cc-footer-color: var(--cc-secondary-color);
--cc-footer-border-color: #e4eaed;
```

## Structure de la home
Hauteur : 900 px — 281 nœuds DOM — canvas 1, vidéos 0, images 0

| # | Bloc | Hauteur | Titre | Médias |
|---|---|---|---|---|
| 1 | div .c-lisa | 900 |  | 0 |
| 2 | div .c-lisa_visualizer | 900 |  | 1 |

**Navigation :** Locomotive® · Work · Agency · Careers · Store · Let's talk · Work · Agency · Careers · Let's talk · Store · Français

**Boutons / CTA :** Accept All

## SEO
- Title : Locomotive
- Description : We are Locomotive®. An independent agency with a deep skill set, big ideas, lots of heart and a global reputation.
- Langue : en — canonical : None
- Open Graph : oui — JSON-LD : aucun
- H1 : 0 — images sans alt : 0/0

### Plan des titres
- H2 We use cookies!

## Performance (mesure locale, Chrome headless, connexion non bridée)
- TTFB 996 ms · LCP 5792 ms (P.cm__desc) · CLS 0.044 · load 2738 ms
- 98 requêtes · 52927 Ko transférés
- Par type : Document 1 req / 34 Ko, Script 5 req / 1066 Ko, Stylesheet 1 req / 31 Ko, Media 3 req / 4933 Ko, Font 2 req / 108 Ko, XHR 65 req / 43418 Ko, Fetch 18 req / 3331 Ko, Other 3 req / 7 Ko
- Plus gros fichiers :
- 3837 Ko — Media — https://lisa.locomotive.ca/assets/lisa/fx/ambient.mp3
- 2827 Ko — Fetch — https://lisa.locomotive.ca/assets/lisa/sixty/lisa.glb
- 1763 Ko — XHR — https://chunk-oci-us-ashburn-1-vop1.edgemv.mux.com/v1/chunk/OZJFmBaK01C9WlplGpNRDhz95Ei3emL00Rw3rYRaqq6BofDMA02HCCLsZsgluUWmt7M02L4HOdYQcUdYMHKj1JcNDVf00NLE53fz
- 1406 Ko — XHR — https://chunk-oci-us-ashburn-1-vop1.edgemv.mux.com/v1/chunk/TgbPOXB602300Ifugsoz00aF3lx8ntPTqfKbGXJM1KD53Urka9fapIQLADu4nNLO4pHkpS1YvDk6YkQNjbTVRPMIqJmFFvEbKLm/
- 1368 Ko — XHR — https://chunk-oci-us-ashburn-1-vop1.edgemv.mux.com/v1/chunk/JPhQKFhnMxNVV7xIFnGA8vl9RUWMg0219EJe9eNHaSzXp02o5LkMDs02cD3YN4dnUOMFpYR857veb6ZCJw1W01uCyAtKhG1LVNBH
- 1360 Ko — XHR — https://chunk-oci-us-ashburn-1-vop1.edgemv.mux.com/v1/chunk/JPhQKFhnMxNVV7xIFnGA8vl9RUWMg0219EJe9eNHaSzXp02o5LkMDs02cD3YN4dnUOMFpYR857veb6ZCJw1W01uCyAtKhG1LVNBH
- 1273 Ko — XHR — https://chunk-oci-us-ashburn-1-vop1.edgemv.mux.com/v1/chunk/JPhQKFhnMxNVV7xIFnGA8vl9RUWMg0219EJe9eNHaSzXp02o5LkMDs02cD3YN4dnUOMFpYR857veb6ZCJw1W01uCyAtKhG1LVNBH
- 1252 Ko — XHR — https://chunk-oci-us-ashburn-1-vop1.edgemv.mux.com/v1/chunk/TgbPOXB602300Ifugsoz00aF3lx8ntPTqfKbGXJM1KD53Urka9fapIQLADu4nNLO4pHkpS1YvDk6YkQNjbTVRPMIqJmFFvEbKLm/
- Services tiers : www.google.com, www.gstatic.com, stream.mux.com, manifest-oci-us-ashburn-1-vop1.edgemv.mux.com, chunk-oci-us-ashburn-1-vop1.edgemv.mux.com

## Mobile
- H1 : None · corps : 15px · débordement horizontal : False · menu burger : True

## Fichiers
- `captures/` : arrivée, scroll desktop (1440×900), pleine page, pages internes, mobile (390×844 @2x) ; vidéo de scroll dans la release GitHub « videos » (lien en haut de fiche)
- `page.html` : DOM rendu · `styles.css` : CSS chargé · `scripts/` : JS chargé (index dans `_index.json`) · `shaders.glsl` : shaders extraits · `rea-bundle.json` : analyse REA du bundle (chunks, routes, endpoints)

## Pages internes capturées
- https://lisa.locomotive.ca/en/work
- https://lisa.locomotive.ca/fr
