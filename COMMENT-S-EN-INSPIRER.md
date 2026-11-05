# Comment s'inspirer de cette bibliothèque

Cette base regroupe les sites primés « Site of the Day » par Awwwards, capturés et décortiqués : à quoi ils ressemblent, comment ils bougent et avec quoi ils sont construits. Elle sert à **trouver des idées de blocs et d'effets qui sortent du lot**, pour un site vitrine, une landing de conversion ou un e-commerce, et à **comprendre comment les produire**.

Ce n'est pas une banque de pièces à copier-coller. On y prend des idées et des techniques, pas des contenus.

---

## 1. Les règles (à lire avant tout)

1. **On s'inspire, on ne copie pas.** Pas de textes, d'images, de logos, de vidéos, d'illustrations ni d'identité visuelle repris d'un site. Tout cela appartient à leurs auteurs.
2. **Le code des sites n'est pas libre.** Les fichiers `scripts/` et `styles.css` servent à *comprendre* une technique (quelle librairie, quel principe, quels réglages). On réécrit ensuite son propre code, adapté au projet. On ne colle jamais un bundle tel quel.
3. **Une landing de conversion n'est pas une vitrine Awwwards.** Beaucoup de ces sites sacrifient la vitesse, le SEO et la clarté à l'effet visuel. On garde l'idée, on la rend légère, accessible et lisible sur mobile.
4. **Les sites restent la propriété de leurs auteurs.** Cette base est une archive d'étude, sans usage commercial des contenus. Un auteur qui souhaite le retrait de son site peut ouvrir une issue sur le dépôt : il sera retiré.

---

## 2. Ce qu'il y a dans chaque dossier de site

`sites/NNN-nom-du-site/` (NNN = rang dans la liste Awwwards) :

| Fichier | À quoi ça sert |
|---|---|
| `fiche.md` | **Point d'entrée.** Lien vers le vrai site, captures, couleurs, polices, structure des sections, stack technique, SEO, performances. Lisible directement sur GitHub. |
| `captures/` | Captures d'écran desktop (au fil du scroll), page entière et mobile. `video.txt` = lien vers la vidéo de scroll (animations visibles). |
| `apercu.html` | Le site figé tel qu'il s'affichait (sans JavaScript ni animations), avec ses vraies polices et images chargées depuis le site d'origine. À ouvrir après avoir cloné le dépôt. |
| `data.json` | Toutes les mesures brutes : design tokens, typo, sections (titres, hauteur, position), librairies détectées, réseau, SEO, perf. Idéal pour une IA ou un script. |
| `styles.css` | Les feuilles de style chargées par le site. Utile pour retrouver un easing, une grille, un `clamp()` de typo, un effet de survol. |
| `scripts/` | Le JavaScript chargé par le site (minifié). `_index.json` liste chaque fichier et son URL d'origine. |
| `shaders.glsl` | Les shaders WebGL quand le site en utilise (effets 3D, distorsions, dégradés animés). |
| `page.html` | Le DOM rendu complet (structure HTML réelle après chargement). |

Pour vérifier un rendu en vrai, **le lien du site d'origine est en haut de chaque fiche** et dans le tableau du `README.md`.

À la racine :
- `README.md` : tous les sites en vignettes, avec le lien vers la fiche et vers le site.
- `index.html` : catalogue filtrable (recherche, stack, fond clair ou sombre…). À ouvrir après avoir cloné.
- `bibliotheque.json` : toutes les fiches agrégées dans un seul fichier.

---

## 3. Récupérer la base

```bash
git clone https://github.com/t-baudry/bibliotheque-web.git
```

Le dépôt pèse environ 1 Go une fois complet, surtout à cause des captures. Pour ne prendre que le texte et les données, sans les images :

```bash
git clone --filter=blob:limit=200k https://github.com/t-baudry/bibliotheque-web.git
```

Les vidéos de scroll ne sont pas dans le dépôt. Elles sont dans la release **videos** du dépôt GitHub, et chaque `captures/video.txt` donne le lien direct.

---

## 4. La méthode, en 4 étapes

### Étape 1 : partir du besoin, pas du site
Avant d'ouvrir la base, écrire en une phrase ce que le bloc doit faire, par exemple : « un hero qui montre le produit en mouvement et pousse vers la démo », « une preuve sociale qui ne ressemble pas à une rangée de logos grisés », « une section tarifs lisible en 5 secondes ».

### Étape 2 : chercher des candidats
- Parcourir les vignettes du `README.md` ou filtrer dans `index.html` (par stack, ambiance, fond).
- Ou chercher dans les données : `bibliotheque.json`, ou un `grep` sur les `fiche.md` (ex. `grep -ril "three.js" sites/*/fiche.md`).
- Retenir **3 à 5 sites** qui traitent le même bloc différemment.

### Étape 3 : décortiquer le bloc
Pour chaque candidat :
1. Regarder la vidéo de scroll pour comprendre le mouvement (déclencheur, durée, easing, ce qui reste fixe).
2. Ouvrir la capture de la section et noter la composition : grille, hiérarchie typo, place du CTA, densité.
3. Dans la fiche, relever les polices, couleurs et librairies (GSAP, Lenis, Three.js…).
4. Si besoin, chercher dans `styles.css` ou `scripts/` le réglage précis (une durée, un `cubic-bezier`, un seuil de déclenchement).

### Étape 4 : recomposer
Combiner les meilleures idées de plusieurs sites, puis les adapter à la marque et à l'objectif. Pour une landing de conversion : CTA visible sans scroller, message en premier, animation au service du message, page rapide sur mobile.

**Bon réflexe :** noter dans le projet client d'où vient chaque idée (« hero inspiré de 042, transition de 117 »). C'est utile pour la revue en équipe et pour revenir à la source.

---

## 5. Travailler avec Claude (ou une autre IA)

La base est faite pour être lue par une IA : les fiches et le `data.json` sont structurés. Ouvrir Claude Code dans le dossier cloné, puis par exemple :

**Trouver des idées pour un bloc**
> Lis `bibliotheque.json` et les `fiche.md`. Trouve-moi 5 sites dont la section preuve sociale (logos, avis, chiffres) sort de l'ordinaire. Pour chacun : le lien du site, la capture correspondante, ce qui le rend différent, et comment l'adapter à une landing B2B.

**Comprendre une technique**
> Dans `sites/108-hiroto-sato/`, explique-moi comment est fait l'effet de transition entre les sections : librairie utilisée, principe, réglages (durées, easing). Appuie-toi sur `data.json`, `styles.css` et `scripts/`. Puis réécris un équivalent minimal et propre en HTML/CSS/JS vanilla (ou GSAP), sans reprendre leur code.

**Construire une landing**
> Je fais une landing pour [client, offre, cible]. Propose une structure de 7 blocs. Pour chaque bloc, cite 2 sites de la bibliothèque comme référence visuelle (dossier + capture), explique ce qu'on en garde et ce qu'on change pour la conversion.

**Dénicher une direction artistique**
> Liste les sites à fond sombre avec une typo serif en titre et une palette de 3 couleurs maximum. Donne leurs polices, leurs couleurs et le lien de la fiche.

Garder les règles de la section 1 dans la demande : « inspire-toi, ne copie ni le texte ni le code ».

---

## 6. Limites à connaître

- **Les captures montrent l'état à une date donnée.** Le site en ligne a pu changer depuis (date de capture dans chaque fiche).
- **`apercu.html` est statique** : pas d'animations, et certains sites rendus en WebGL apparaissent vides. Dans ce cas, la référence est la vidéo et les captures.
- **Le JavaScript est minifié.** On y retrouve les librairies et les réglages, pas un code lisible prêt à l'emploi.
- **Quelques sites ont échoué** (protégés, en panne, ou trop lourds) : leur statut est indiqué dans la fiche et dans le README.
- **Biais Awwwards** : beaucoup de portfolios, d'agences et de sites événementiels. Pour une PME ou un e-commerce, on vise l'idée du bloc, pas le site entier.

---

## 7. Mise à jour

La base est produite par les scripts de `_outils/` (capture avec Chrome sans interface, puis génération des fiches). Pour ajouter des sites : ajouter une ligne `rang|nom|url` dans `_outils/sites.txt`, puis lancer `node _outils/capture.mjs <rang> --conc 1` et `py _outils/build.py`.
