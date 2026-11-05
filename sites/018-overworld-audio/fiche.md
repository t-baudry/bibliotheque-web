# Overworld Audio

- Site : [https://overworldaudio.com/](https://overworldaudio.com/) — [aperçu statique local](apercu.html)
- Capturé le : 2026-11-02 — statut : ok
- Vidéo de scroll : [▶ ouvrir](https://github.com/t-baudry/bibliotheque-web/releases/download/videos/018-overworld-audio.webm)

<a href="captures/desktop-00-arrivee.jpg"><img src="captures/desktop-00-arrivee.jpg" width="100%" alt="desktop-00-arrivee.jpg"></a> 

<details><summary>Toutes les captures</summary>

<a href="captures/desktop-01.jpg"><img src="captures/desktop-01.jpg" width="32%" alt="desktop-01.jpg"></a> <a href="captures/desktop-02.jpg"><img src="captures/desktop-02.jpg" width="32%" alt="desktop-02.jpg"></a> <a href="captures/desktop-03.jpg"><img src="captures/desktop-03.jpg" width="32%" alt="desktop-03.jpg"></a> <a href="captures/desktop-04.jpg"><img src="captures/desktop-04.jpg" width="32%" alt="desktop-04.jpg"></a> <a href="captures/desktop-05.jpg"><img src="captures/desktop-05.jpg" width="32%" alt="desktop-05.jpg"></a> <a href="captures/desktop-06.jpg"><img src="captures/desktop-06.jpg" width="32%" alt="desktop-06.jpg"></a> <a href="captures/desktop-07.jpg"><img src="captures/desktop-07.jpg" width="32%" alt="desktop-07.jpg"></a> 

<a href="captures/page1-01.jpg"><img src="captures/page1-01.jpg" width="32%" alt="page1-01.jpg"></a> <a href="captures/page1-02.jpg"><img src="captures/page1-02.jpg" width="32%" alt="page1-02.jpg"></a> <a href="captures/page1-03.jpg"><img src="captures/page1-03.jpg" width="32%" alt="page1-03.jpg"></a> <a href="captures/page1-04.jpg"><img src="captures/page1-04.jpg" width="32%" alt="page1-04.jpg"></a> <a href="captures/page2-01.jpg"><img src="captures/page2-01.jpg" width="32%" alt="page2-01.jpg"></a> <a href="captures/page2-02.jpg"><img src="captures/page2-02.jpg" width="32%" alt="page2-02.jpg"></a> <a href="captures/page2-03.jpg"><img src="captures/page2-03.jpg" width="32%" alt="page2-03.jpg"></a> <a href="captures/page2-04.jpg"><img src="captures/page2-04.jpg" width="32%" alt="page2-04.jpg"></a> <a href="captures/page3-01.jpg"><img src="captures/page3-01.jpg" width="32%" alt="page3-01.jpg"></a> <a href="captures/page3-02.jpg"><img src="captures/page3-02.jpg" width="32%" alt="page3-02.jpg"></a> <a href="captures/page3-03.jpg"><img src="captures/page3-03.jpg" width="32%" alt="page3-03.jpg"></a> 

<a href="captures/mobile-01.jpg"><img src="captures/mobile-01.jpg" width="15%" alt="mobile-01.jpg"></a> <a href="captures/mobile-02.jpg"><img src="captures/mobile-02.jpg" width="15%" alt="mobile-02.jpg"></a> <a href="captures/mobile-03.jpg"><img src="captures/mobile-03.jpg" width="15%" alt="mobile-03.jpg"></a> <a href="captures/mobile-04.jpg"><img src="captures/mobile-04.jpg" width="15%" alt="mobile-04.jpg"></a> <a href="captures/mobile-05.jpg"><img src="captures/mobile-05.jpg" width="15%" alt="mobile-05.jpg"></a> <a href="captures/mobile-06.jpg"><img src="captures/mobile-06.jpg" width="15%" alt="mobile-06.jpg"></a> 

</details>

## Stack détectée
CMS Sanity, GSAP, Howler (audio), Lenis, Lil-GUI/Tweakpane (debug), Nuxt, ScrollTrigger, SplitText/SplitType, Theatre.js, Three.js, Virtual scroll, Vue, WebGL

Shaders GLSL personnalisés extraits : 40 (voir `shaders.glsl`)

## Design tokens
### Couleurs (fonds, pondérées par surface)

### Couleurs de texte
`#e9ecee` · `#4c5e6b` · `#6e8799`
### Polices utilisées (par volume de texte)
PPFrama
### Fichiers de police chargés
- PPFrama-Regular.woff2
- IvarHeadline-Regular.woff2
### Typographie
| Élément | Police | Taille | Graisse | Interligne | Interlettrage | Casse |
|---|---|---|---|---|---|---|
| h1 | IvarHeadline, -apple-system, system-ui, BlinkMacSy | 38px | 500 | 34.2px | normal | none |
| p | PPFrama, -apple-system, system-ui, BlinkMacSystemF | 9px | 400 | 13.5px | 0.36px | none |
| a | PPFrama, -apple-system, system-ui, BlinkMacSystemF | 8px | 400 | 8px | 3.2px | uppercase |
| button | PPFrama, -apple-system, system-ui, BlinkMacSystemF | 8px | 400 | 8px | 3.2px | uppercase |
| body | PPFrama, -apple-system, system-ui, BlinkMacSystemF | 16px | 400 | 16px | normal | none |

### Échelle des tailles de texte
8px (17) · 9px (4) · 16px (3) · 12px (1) · 38px (1)
### Arrondis
3.5px
### Transitions CSS fréquentes
- linear 0.8s ×2
- ease 0.3s ×2
- ease 0.4s ×1
### Points de rupture (media queries)
768px · 1000px · 1250px · 769px · 600px · 1530px · 1620px · 1710px · 1800px · 400px
### Animations CSS (@keyframes)
block-video-spin-2651e29b, reel-modal-in-b1439b63
### Variables CSS (:root)
```css
--font-serif: "IvarHeadline",-apple-system,system-ui,BlinkMacSystemFont,"Helvetica","Arial",sans-serif;
--font-sans: "PPFrama",-apple-system,system-ui,BlinkMacSystemFont,"Helvetica","Arial",sans-serif;
--off-white: #e9ecee;
--off-black: #13151f;
--color-secondary: #aab9c7;
--gray: #6e8799;
--dark-gray: #4c5e6b;
--expo-out: cubic-bezier(.14,1,.34,1);
--quint-out: cubic-bezier(.23,1,.32,1);
--z-sound-toggle: 100;
--chrome-bottom: 2.6rem;
--gl-bleed: 120px;
--border: hsla(0,0%,91%,.1);
--surface: #1a1a1a;
--grid-cols: 12;
--grid-gutter: 1rem;
--grid-max-width: calc(100% - 3rem);
--grid-width: calc(100vw - 3rem);
--grid-margin: calc((100vw - var(--grid-width))/2);
--grid-track: calc((var(--grid-width) - (var(--grid-cols) - 1)*var(--grid-gutter))/var(--grid-cols));
--panel-col-start: 1;
--panel-col-end: 13;
--panel-content-left: calc(var(--grid-margin) + (var(--panel-col-start) - 1)*(var(--grid-track) + var(--grid-gutter)));
--panel-content-width: calc((var(--panel-col-end) - var(--panel-col-start))*var(--grid-track) + (var(--panel-col-end) - var(--panel-col-start) - 1)*var(--grid-gutt;
--panel-cut: -2rem;
```

## Structure de la home
Hauteur : 900 px — 210 nœuds DOM — canvas 1, vidéos 0, images 0

| # | Bloc | Hauteur | Titre | Médias |
|---|---|---|---|---|

**Navigation :** ProjectsProjects · StudioStudio · ContactContact

**Boutons / CTA :** 

## SEO
- Title : Overworld Audio
- Description : Audio co-development for games and interactive experiences, from prototype to final mix.
- Langue : en — canonical : https://overworldaudio.com/
- Open Graph : oui — JSON-LD : Organization, WebSite
- H1 : 1 — images sans alt : 0/0

### Plan des titres
- H1 Building unforgettable sonic experiences

## Performance (mesure locale, Chrome headless, connexion non bridée)
- TTFB 321 ms · LCP 6352 ms (image) · CLS 0 · load 1669 ms
- 67 requêtes · 3363 Ko transférés
- Par type : Document 1 req / 10 Ko, Stylesheet 11 req / 18 Ko, Other 2 req / 3 Ko, Script 14 req / 464 Ko, Image 27 req / 2273 Ko, Font 2 req / 79 Ko, Fetch 9 req / 248 Ko, XHR 1 req / 268 Ko
- Plus gros fichiers :
- 426 Ko — Script — https://overworldaudio.com/_nuxt/B5B1E9Dr.js
- 361 Ko — Image — https://overworldaudio.com/textures/grain-bg.webp
- 300 Ko — Image — https://overworldaudio.com/textures/terrain-diffuse.webp
- 268 Ko — XHR — https://overworldaudio.com/sound/opus/sfx_web_oa_enterwithsound_click.opus
- 193 Ko — Image — https://overworldaudio.com/textures/bg.webp
- 178 Ko — Image — https://overworldaudio.com/textures/displacement/logo.jpg
- 137 Ko — Image — https://overworldaudio.com/textures/simplex-noise.webp
- 129 Ko — Fetch — https://overworldaudio.com/textures/color-correction.bin
- Services tiers : 

## Mobile
- H1 : {'size': '38px', 'lineHeight': '34.2px'} · corps : 16px · débordement horizontal : False · menu burger : True

## Fichiers
- `captures/` : arrivée, scroll desktop (1440×900), pleine page, pages internes, mobile (390×844 @2x) ; vidéo de scroll dans la release GitHub « videos » (lien en haut de fiche)
- `page.html` : DOM rendu · `styles.css` : CSS chargé · `scripts/` : JS chargé (index dans `_index.json`) · `shaders.glsl` : shaders extraits · `rea-bundle.json` : analyse REA du bundle (chunks, routes, endpoints)

## Pages internes capturées
- https://overworldaudio.com/studio
- https://overworldaudio.com/contact
- https://overworldaudio.com/work
