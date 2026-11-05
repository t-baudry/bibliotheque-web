# Lidar Drone Scanning

- Site : [https://drone.riotters.com/](https://drone.riotters.com/) — [aperçu statique local](apercu.html)
- Capturé le : 2026-11-02 — statut : ok
- Vidéo de scroll : [▶ ouvrir](https://github.com/t-baudry/bibliotheque-web/releases/download/videos/027-lidar-drone-scanning.webm)

<a href="captures/desktop-00-arrivee.jpg"><img src="captures/desktop-00-arrivee.jpg" width="100%" alt="desktop-00-arrivee.jpg"></a> 

<details><summary>Toutes les captures</summary>

<a href="captures/desktop-01.jpg"><img src="captures/desktop-01.jpg" width="32%" alt="desktop-01.jpg"></a> <a href="captures/desktop-02.jpg"><img src="captures/desktop-02.jpg" width="32%" alt="desktop-02.jpg"></a> <a href="captures/desktop-03.jpg"><img src="captures/desktop-03.jpg" width="32%" alt="desktop-03.jpg"></a> <a href="captures/desktop-04.jpg"><img src="captures/desktop-04.jpg" width="32%" alt="desktop-04.jpg"></a> <a href="captures/desktop-05.jpg"><img src="captures/desktop-05.jpg" width="32%" alt="desktop-05.jpg"></a> <a href="captures/desktop-06.jpg"><img src="captures/desktop-06.jpg" width="32%" alt="desktop-06.jpg"></a> <a href="captures/desktop-07.jpg"><img src="captures/desktop-07.jpg" width="32%" alt="desktop-07.jpg"></a> <a href="captures/desktop-08.jpg"><img src="captures/desktop-08.jpg" width="32%" alt="desktop-08.jpg"></a> <a href="captures/desktop-09.jpg"><img src="captures/desktop-09.jpg" width="32%" alt="desktop-09.jpg"></a> <a href="captures/desktop-10.jpg"><img src="captures/desktop-10.jpg" width="32%" alt="desktop-10.jpg"></a> <a href="captures/desktop-11.jpg"><img src="captures/desktop-11.jpg" width="32%" alt="desktop-11.jpg"></a> <a href="captures/desktop-12.jpg"><img src="captures/desktop-12.jpg" width="32%" alt="desktop-12.jpg"></a> <a href="captures/desktop-13.jpg"><img src="captures/desktop-13.jpg" width="32%" alt="desktop-13.jpg"></a> <a href="captures/desktop-14.jpg"><img src="captures/desktop-14.jpg" width="32%" alt="desktop-14.jpg"></a> <a href="captures/desktop-pleine-page.jpg"><img src="captures/desktop-pleine-page.jpg" width="32%" alt="desktop-pleine-page.jpg"></a> 



<a href="captures/mobile-01.jpg"><img src="captures/mobile-01.jpg" width="15%" alt="mobile-01.jpg"></a> <a href="captures/mobile-02.jpg"><img src="captures/mobile-02.jpg" width="15%" alt="mobile-02.jpg"></a> <a href="captures/mobile-03.jpg"><img src="captures/mobile-03.jpg" width="15%" alt="mobile-03.jpg"></a> <a href="captures/mobile-04.jpg"><img src="captures/mobile-04.jpg" width="15%" alt="mobile-04.jpg"></a> <a href="captures/mobile-05.jpg"><img src="captures/mobile-05.jpg" width="15%" alt="mobile-05.jpg"></a> <a href="captures/mobile-06.jpg"><img src="captures/mobile-06.jpg" width="15%" alt="mobile-06.jpg"></a> 

</details>

## Stack détectée
Lenis, Next.js, Postprocessing, React, React Three Fiber, Rive, Three.js, Virtual scroll, WebGL

Shaders GLSL personnalisés extraits : 37 (voir `shaders.glsl`)

## Design tokens
### Couleurs (fonds, pondérées par surface)
`#ffffff` · `#fdfdfd` · `#dde5e9` · `#24363f`
### Couleurs de texte
`#24363f` · `#c7cccb` · `#ffffff` · `#171717`
### Polices utilisées (par volume de texte)
switzer · protoMono
### Fichiers de police chargés
- proto_mono_light-s.p.ae56eb32.woff2
- Switzer_Variable-s.p.bd58316e.woff2
### Typographie
| Élément | Police | Taille | Graisse | Interligne | Interlettrage | Casse |
|---|---|---|---|---|---|---|
| h2 | switzer, "switzer Fallback", sans-serif | 240px | 300 | 360px | -13px | none |
| p | switzer, "switzer Fallback", sans-serif | 14px | 400 | 24px | normal | none |
| a | switzer, "switzer Fallback", sans-serif | 16px | 400 | 24px | normal | none |
| button | switzer, "switzer Fallback", sans-serif | 14px | 500 | 24px | normal | lowercase |
| body | switzer, "switzer Fallback", sans-serif | 16px | 400 | 24px | normal | none |

### Échelle des tailles de texte
31.968px (321) · 28px (191) · 20px (170) · 14px (138) · 24px (114) · 64px (109) · 12px (44) · 240px (37) · 15px (27) · 16px (17) · 56px (8) · 47.952px (6) · 32px (6) · 51.84px (6) · 48px (5)
### Arrondis
24px · 3.35544e+07px
### Transitions CSS fréquentes
- cubic-bezier(0.4 0.5s ×6
- cubic-bezier(0.22 0.5s ×6
- cubic-bezier(0.4 0.15s ×5
- cubic-bezier(0.4 0.3s ×4
- cubic-bezier(0.22 0.7s ×1
### Points de rupture (media queries)
48rem · 64rem · 75rem · 40rem · 80rem · 96rem · 74.9375rem
### Animations CSS (@keyframes)
colon-blink, ping
### Variables CSS (:root)
```css
--color-white: #fff;
--spacing: .25rem;
--text-xs: .75rem;
--text-xs--line-height: calc(1/.75);
--text-sm: .875rem;
--text-sm--line-height: calc(1.25/.875);
--text-base: 1rem;
--text-base--line-height: calc(1.5/1);
--text-xl: 1.25rem;
--text-xl--line-height: calc(1.75/1.25);
--text-2xl: 1.5rem;
--text-2xl--line-height: calc(2/1.5);
--text-5xl: 3rem;
--text-5xl--line-height: 1;
--font-weight-light: 300;
--font-weight-medium: 500;
--tracking-wide: .025em;
--radius-sm: .25rem;
--radius-3xl: 1.5rem;
--ease-out: cubic-bezier(0,0,.2,1);
--ease-in-out: cubic-bezier(.4,0,.2,1);
--animate-ping: ping 1s cubic-bezier(0,0,.2,1)infinite;
--aspect-video: 16/9;
--default-transition-duration: .15s;
--default-transition-timing-function: cubic-bezier(.4,0,.2,1);
--default-font-family: var(--font-switzer),sans-serif;
--default-mono-font-family: var(--font-proto-mono);
--breakpoint-dsk: 75rem;
--color-ink: #24363f;
--background: #0a0a0a;
--foreground: #ededed;
```

## Structure de la home
Hauteur : 16891 px — 2097 nœuds DOM — canvas 5, vidéos 3, images 11

| # | Bloc | Hauteur | Titre | Médias |
|---|---|---|---|---|
| 1 | div .fixed inset-0 z-120 flex | 900 |  | 0 |
| 2 | section#hero .relative flex h-svh flex-col overflow-hi | 900 |  | 1 |
| 3 | section#intro-section .bg-canvas px-4 dsk:px-6 | 1090 |  | 3 |
| 4 | section#gear .bg-canvas px-6 flex flex-col items-cente | 864 | GearGear | 0 |
| 5 | section#drone-lock .relative bg-canvas max-lg:px-2 max-lg:pt | 3510 |  | 3 |
| 6 | section#solutions .relative flex flex-col items-center bg-w | 1582 | SolutionsSolutions | 0 |
| 7 | section#capabilities .relative border-ink/24 border-t bg-white | 6121 | CapabilitiesCapabilities | 0 |
| 8 | section#software .relative flex flex-col items-center bg-w | 1565 | SoftwareSoftware | 8 |
| 9 | section#landing-section .relative flex h-100 w-full flex-col item | 700 |  | 0 |

**Navigation :** 

**Boutons / CTA :** Contact UsContact Us

## SEO
- Title : Aevion — autonomous LiDAR inspection drone
- Description : Interactive 3D demo of Aevion: full-hemisphere LiDAR capture at 240,000 points per second, folding to 42 cm. A technology demo by Riotters.
- Langue : en — canonical : https://drone.riotters.com/
- Open Graph : oui — JSON-LD : aucun
- H1 : 0 — images sans alt : 7/11

### Plan des titres
- H2 GearGear
- H2 SolutionsSolutions
- H2 CapabilitiesCapabilities
- H2 SoftwareSoftware

## Performance (mesure locale, Chrome headless, connexion non bridée)
- TTFB 176 ms · LCP 936 ms (SPAN.inline-block) · CLS 0 · load 2247 ms
- 44 requêtes · 15221 Ko transférés
- Par type : Document 1 req / 19 Ko, Stylesheet 1 req / 9 Ko, Script 12 req / 749 Ko, Media 10 req / 11936 Ko, Font 2 req / 58 Ko, Image 6 req / 95 Ko, Other 1 req / 1 Ko, Fetch 11 req / 2354 Ko
- Plus gros fichiers :
- 3202 Ko — Media — https://drone.riotters.com/intro/video3.mp4
- 2663 Ko — Media — https://drone.riotters.com/solutions/energy.mp4
- 1840 Ko — Media — https://drone.riotters.com/solutions/infrastructure.mp4
- 1557 Ko — Fetch — https://drone.riotters.com/software/NewTerreain_006.glb
- 1264 Ko — Media — https://drone.riotters.com/solutions/geospatial.mp4
- 1259 Ko — Media — https://drone.riotters.com/solutions/industry.mp4
- 854 Ko — Media — https://drone.riotters.com/intro/video2.mp4
- 854 Ko — Media — https://drone.riotters.com/intro/video2.mp4
- Services tiers : 

## Mobile
- H1 : None · corps : 16px · débordement horizontal : False · menu burger : False

## Fichiers
- `captures/` : arrivée, scroll desktop (1440×900), pleine page, pages internes, mobile (390×844 @2x) ; vidéo de scroll dans la release GitHub « videos » (lien en haut de fiche)
- `page.html` : DOM rendu · `styles.css` : CSS chargé · `scripts/` : JS chargé (index dans `_index.json`) · `shaders.glsl` : shaders extraits · `rea-bundle.json` : analyse REA du bundle (chunks, routes, endpoints)
