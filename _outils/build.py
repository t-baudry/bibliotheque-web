# Génère fiche.md + fiche.html par site, bibliotheque.json et index.html (catalogue filtrable).
# Usage : py -I build.py
import json, os, html, re, pathlib, datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITES = ROOT / 'sites'
E = html.escape

def load(p):
    try: return json.loads(p.read_text(encoding='utf8'))
    except Exception: return None

def lum(hexc):
    try:
        r, g, b = (int(hexc[i:i+2], 16) / 255 for i in (1, 3, 5))
        f = lambda c: c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
        return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)
    except Exception: return .5

TECH_LABELS = {'gsap': 'GSAP', 'scrollTrigger': 'ScrollTrigger', 'splitText': 'SplitText/SplitType', 'lenis': 'Lenis', 'locomotive': 'Locomotive Scroll', 'three': 'Three.js', 'ogl': 'OGL', 'pixi': 'PixiJS', 'babylon': 'Babylon.js', 'spline': 'Spline', 'rive': 'Rive', 'lottie': 'Lottie', 'unicornStudio': 'Unicorn Studio', 'barba': 'Barba.js', 'swup': 'Swup', 'highway': 'Highway', 'taxi': 'Taxi.js', 'swiper': 'Swiper', 'webflow': 'Webflow', 'framer': 'Framer', 'wordpress': 'WordPress', 'shopify': 'Shopify', 'squarespace': 'Squarespace', 'wix': 'Wix', 'next': 'Next.js', 'nuxt': 'Nuxt', 'astro': 'Astro', 'sveltekit': 'Svelte', 'gatsby': 'Gatsby', 'remix': 'Remix', 'react': 'React', 'vue': 'Vue'}
PLATFORMS = {'Webflow', 'Framer', 'WordPress', 'Shopify', 'Squarespace', 'Wix', 'Next.js', 'Nuxt', 'Astro', 'Svelte', 'Gatsby', 'Remix', 'React', 'Vue'}

def stack(d):
    s = set()
    for k, v in (d.get('tech') or {}).items():
        if v is True and k in TECH_LABELS: s.add(TECH_LABELS[k])
    for k in (d.get('libs') or {}).get('detected', []):
        k = k.replace(' (runtime)', '').replace('Webflow', 'Webflow')
        if k in ('Sanity', 'Prismic', 'Contentful', 'Storyblok'): s.add('CMS ' + k); continue
        s.add(k)
    for c in (d.get('tech') or {}).get('cms', []): s.add('CMS ' + c.capitalize())
    if (d.get('tech') or {}).get('webglCanvas') or (d.get('libs') or {}).get('shaders'): s.add('WebGL')
    if 'Nuxt' in s: s.add('Vue')
    if 'Next.js' in s: s.add('React')
    return sorted(s)

def collect():
    out = []
    for dir_ in sorted(p for p in SITES.iterdir() if p.is_dir()):
        d = load(dir_ / 'data.json')
        if not d: continue
        a = load(dir_ / 'analyse.json') or {}
        cap = dir_ / 'captures'
        shots = sorted(f.name for f in cap.glob('*.jpg')) if cap.exists() else []
        thumb = next((f for f in ['desktop-01.jpg', 'desktop-00-arrivee.jpg'] if f in shots), shots[0] if shots else None)
        des = d.get('design') or {}
        palette = []
        for c in [x['v'] for x in des.get('bg', [])[:5]] + [x['v'] for x in des.get('text', [])[:4]]:
            if c and c not in palette: palette.append(c)
        fonts = [f['v'] for f in des.get('fonts', [])[:4] if f['v']]
        bgs = des.get('bg', [])
        theme = None
        if bgs:
            theme = 'sombre' if lum(bgs[0]['v']) < .2 else ('clair' if lum(bgs[0]['v']) > .6 else 'moyen')
        if (d.get('steps') or {}).get('fullPage') and isinstance(d['steps']['fullPage'], str) and theme is None: theme = None
        out.append(dict(dir=dir_.name, d=d, a=a, shots=shots, thumb=thumb, palette=palette[:8], fonts=fonts, theme=theme, stack=stack(d)))
    return out

def li(xs): return '\n'.join(f'- {x}' for x in xs) if xs else '- (rien relevé)'

def fiche_md(s):
    d, a = s['d'], s['a']; des = d.get('design') or {}; st = d.get('structure') or {}; seo = d.get('seo') or {}; perf = d.get('perf') or {}; net = d.get('network') or {}
    typo = des.get('typo') or {}
    L = [f"# {d['name']}", '', f"- URL : {d.get('sourceUrl')}", f"- Capturé le : {d.get('capturedAt', '')[:10]} — statut : {d.get('status')}"]
    if a:
        L += [f"- Type : {a.get('type', '')} — secteur : {a.get('secteur', '')}", f"- Style : {', '.join(a.get('style', []))}", f"- Note d'inspiration : {a.get('note_inspiration', '')}/5", '',
              '## En bref', a.get('resume', ''), '', f"**Ambiance :** {a.get('ambiance', '')}", '', f"**Hero :** {a.get('hero', '')}", '',
              '## Ce qui vaut la peine d\'être repris', li(a.get('points_forts', [])), '', '## Comment c\'est fait', li(a.get('techniques', [])), '',
              '## À réutiliser pour', li(a.get('a_reprendre_pour', [])), '', '## Limites', li(a.get('limites', [])), '']
    L += ['## Stack détectée', ', '.join(s['stack']) or '(rien de détecté : JS bundlé ou statique)', '']
    lb = d.get('libs') or {}
    if lb.get('gsapVersion') or lb.get('threeRevision'): L += [f"Versions : GSAP {lb.get('gsapVersion') or '?'} · Three.js r{lb.get('threeRevision') or '?'}", '']
    if lb.get('shaders'): L += [f"Shaders GLSL personnalisés extraits : {lb['shaders']} (voir `shaders.glsl`)", '']
    L += ['## Design tokens', '### Couleurs (fonds, pondérées par surface)', ' · '.join(f"`{c['v']}`" for c in des.get('bg', [])[:8]),
          '### Couleurs de texte', ' · '.join(f"`{c['v']}`" for c in des.get('text', [])[:8]), '### Polices utilisées (par volume de texte)', ' · '.join(f"{c['v']}" for c in des.get('fonts', [])),
          '### Fichiers de police chargés', li([u.split('/')[-1].split('?')[0] for u in net.get('fontFiles', [])][:15]), '### Typographie', '| Élément | Police | Taille | Graisse | Interligne | Interlettrage | Casse |', '|---|---|---|---|---|---|---|']
    for k, v in typo.items(): L.append(f"| {k} | {v['family'][:50]} | {v['size']} | {v['weight']} | {v['lineHeight']} | {v['letterSpacing']} | {v['transform']} |")
    L += ['', '### Échelle des tailles de texte', ' · '.join(f"{c['v']} ({c['w']})" for c in des.get('fontSizes', [])), '### Arrondis', ' · '.join(f"{c['v']}" for c in des.get('radius', [])) or 'aucun (angles droits)',
          '### Transitions CSS fréquentes', li([f"{c['v']} ×{c['w']}" for c in des.get('transitions', [])]), '### Points de rupture (media queries)', ' · '.join(c['v'] for c in des.get('breakpoints', [])),
          '### Animations CSS (@keyframes)', ', '.join(des.get('keyframes', [])) or '(aucune)', '### Variables CSS (:root)', '```css', *[f"{k}: {v};" for k, v in list((des.get('cssVars') or {}).items())[:80]], '```', '']
    L += ['## Structure de la home', f"Hauteur : {st.get('pageHeight')} px — {(st.get('counts') or {}).get('domNodes')} nœuds DOM — canvas {(st.get('counts') or {}).get('canvas')}, vidéos {(st.get('counts') or {}).get('videos')}, images {(st.get('counts') or {}).get('imgs')}", '',
          '| # | Bloc | Hauteur | Titre | Médias |', '|---|---|---|---|---|']
    for i, b in enumerate(st.get('sections', []), 1): L.append(f"| {i} | {b['tag']}{('#' + b['id']) if b['id'] else ''} .{(b['cls'] or '')[:40]} | {b['h']} | {b['title']} | {b['media']} |")
    L += ['', '**Navigation :** ' + ' · '.join(x['t'] for x in st.get('navLinks', []) if x['t']), '', '**Boutons / CTA :** ' + ' · '.join(dict.fromkeys(st.get('ctas', []))), '',
          '## SEO', f"- Title : {d.get('title')}", f"- Description : {seo.get('description')}", f"- Langue : {d.get('lang')} — canonical : {seo.get('canonical')}", f"- Open Graph : {'oui' if seo.get('ogImage') else 'non'} — JSON-LD : {', '.join(map(str, seo.get('jsonLd', []))) or 'aucun'}",
          f"- H1 : {seo.get('h1Count')} — images sans alt : {seo.get('imgNoAlt')}/{seo.get('imgs')}", '', '### Plan des titres', li(seo.get('headings', [])[:30]), '',
          '## Performance (mesure locale, Chrome headless, connexion non bridée)', f"- TTFB {perf.get('ttfb')} ms · LCP {perf.get('lcp')} ms ({perf.get('lcpEl')}) · CLS {perf.get('cls')} · load {perf.get('load')} ms",
          f"- {net.get('requests')} requêtes · {net.get('totalKb')} Ko transférés", '- Par type : ' + ', '.join(f"{k} {v['n']} req / {v['kb']} Ko" for k, v in (net.get('byType') or {}).items()),
          '- Plus gros fichiers :', li([f"{b['kb']} Ko — {b['type']} — {b['url']}" for b in net.get('biggest', [])]), '- Services tiers : ' + ', '.join(net.get('thirdPartyHosts', [])), '']
    m = d.get('mobile') or {}
    L += ['## Mobile', f"- H1 : {m.get('h1')} · corps : {m.get('body')} · débordement horizontal : {m.get('overflowX')} · menu burger : {m.get('burger')}", '',
          '## Fichiers', '- `captures/` : arrivée, scroll desktop (1440×900), pleine page, pages internes, mobile (390×844 @2x), vidéo `desktop-scroll.webm`',
          '- `page.html` : DOM rendu · `styles.css` : CSS chargé · `scripts/` : JS chargé (index dans `_index.json`) · `shaders.glsl` : shaders extraits · `rea-bundle.json` : analyse REA du bundle (chunks, routes, endpoints)', '']
    if d.get('errors'): L += ['## Incidents de capture', li(d['errors']), '']
    sp = (d.get('steps') or {}).get('subpages') or []
    if sp: L += ['## Pages internes capturées', li([x['url'] for x in sp]), '']
    return '\n'.join(L)

CSS = """
:root{--bg:#f6f5f2;--fg:#151515;--mut:#6b6b6b;--card:#fff;--line:#e4e2dc;--acc:#2a5bd7}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0f0f10;--fg:#ececec;--mut:#9a9a9a;--card:#18181a;--line:#2a2a2d;--acc:#7aa2ff}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 Inter,system-ui,sans-serif}
a{color:var(--acc)}header{padding:28px 24px 8px;max-width:1500px;margin:auto}h1{font-size:28px;margin:0 0 4px;letter-spacing:-.02em}
.mut{color:var(--mut)}.bar{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding:12px 24px}
.bar .in{max-width:1500px;margin:auto;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
input[type=search]{flex:1 1 260px;padding:9px 12px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--fg);font:inherit}
select{padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--fg);font:inherit;max-width:200px}
.grid{max-width:1500px;margin:20px auto;padding:0 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;color:inherit}
.card:hover{border-color:var(--acc)}.card img{width:100%;aspect-ratio:16/10;object-fit:cover;background:#222;display:block}
.card .b{padding:12px 14px;display:flex;flex-direction:column;gap:6px}.card h3{margin:0;font-size:16px}
.sw{display:flex;gap:3px}.sw i{width:18px;height:18px;border-radius:4px;border:1px solid var(--line)}
.tags{display:flex;flex-wrap:wrap;gap:4px}.tags span{font-size:11.5px;padding:2px 7px;border-radius:20px;background:var(--bg);border:1px solid var(--line);color:var(--mut)}
.tags span.s{color:var(--fg)}.stars{color:#d9a400;font-size:13px}.count{margin-left:auto}
@media (max-width:600px){header,.bar,.grid{padding-left:16px;padding-right:16px}}
"""

def card(s):
    d, a = s['d'], s['a']
    tags = [f'<span class="s">{E(t)}</span>' for t in a.get('style', [])[:4]] + [f'<span>{E(t)}</span>' for t in s['stack'][:6]]
    hay = ' '.join([d['name'], d.get('sourceUrl', ''), a.get('type', ''), a.get('secteur', ''), ' '.join(a.get('style', [])), ' '.join(s['stack']), ' '.join(s['fonts']), a.get('resume', ''), ' '.join(a.get('points_forts', [])), s['theme'] or '']).lower()
    img = f'<img loading="lazy" src="sites/{s["dir"]}/captures/{s["thumb"]}" alt="">' if s['thumb'] else '<img alt="">'
    stars = '★' * int(a.get('note_inspiration', 0) or 0)
    return (f'<a class="card" href="sites/{s["dir"]}/fiche.html" data-h="{E(hay)}" data-type="{E(a.get("type", ""))}" data-style="{E("|".join(a.get("style", [])))}" data-stack="{E("|".join(s["stack"]))}" data-theme="{E(s["theme"] or "")}" data-note="{a.get("note_inspiration", 0) or 0}" data-status="{E(d.get("status", ""))}">'
            f'{img}<div class="b"><h3>{E(d["name"])} <span class="stars">{stars}</span></h3><div class="mut" style="font-size:13px">{E(a.get("type", ""))}{" · " + E(a.get("secteur", "")) if a.get("secteur") else ""}</div>'
            f'<div class="sw">{"".join(f"<i style=background:{c}></i>" for c in s["palette"])}</div><div class="mut" style="font-size:12.5px">{E(" / ".join(s["fonts"][:3]))}</div><div class="tags">{"".join(tags)}</div></div></a>')

def opts(vals): return ''.join(f'<option>{E(v)}</option>' for v in sorted(vals))

def index_html(all_):
    types = {s['a'].get('type') for s in all_ if s['a'].get('type')}
    styles = {t for s in all_ for t in s['a'].get('style', [])}
    stacks = {t for s in all_ for t in s['stack']}
    js = """
const q=document.getElementById('q'),f={type:document.getElementById('ft'),style:document.getElementById('fs'),stack:document.getElementById('fk'),theme:document.getElementById('fh'),note:document.getElementById('fn')};
const cards=[...document.querySelectorAll('.card')];function run(){const t=q.value.toLowerCase().trim();let n=0;
for(const c of cards){let ok=!t||t.split(/\\s+/).every(w=>c.dataset.h.includes(w));
if(ok&&f.type.value)ok=c.dataset.type===f.type.value;if(ok&&f.style.value)ok=c.dataset.style.split('|').includes(f.style.value);
if(ok&&f.stack.value)ok=c.dataset.stack.split('|').includes(f.stack.value);if(ok&&f.theme.value)ok=c.dataset.theme===f.theme.value;
if(ok&&f.note.value)ok=Number(c.dataset.note)>=Number(f.note.value);c.style.display=ok?'':'none';if(ok)n++}document.getElementById('n').textContent=n+' sites'}
q.oninput=run;Object.values(f).forEach(s=>s.onchange=run);try{const v=localStorage.getItem('bq');if(v){q.value=v}}catch(e){}q.addEventListener('input',()=>{try{localStorage.setItem('bq',q.value)}catch(e){}});run();
"""
    return f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bibliothèque web</title><style>{CSS}</style></head><body>
<header><h1>Bibliothèque web</h1><div class="mut">{len(all_)} sites Awwwards « Site of the Day » rétro-analysés le {datetime.date.today():%d/%m/%Y} · <a href="SYNTHESE.md">synthèse transversale</a> · chaque fiche existe en .md (pour Claude) et en .html</div></header>
<div class="bar"><div class="in"><input id="q" type="search" placeholder="Chercher : hero sombre, Lenis, serif, portfolio, luxe…">
<select id="ft"><option value="">Tous types</option>{opts(types)}</select><select id="fs"><option value="">Tous styles</option>{opts(styles)}</select>
<select id="fk"><option value="">Toute stack</option>{opts(stacks)}</select><select id="fh"><option value="">Fond</option><option>sombre</option><option>clair</option><option>moyen</option></select>
<select id="fn"><option value="">Note</option><option value="3">3★ et +</option><option value="4">4★ et +</option><option value="5">5★</option></select><span id="n" class="mut count"></span></div></div>
<div class="grid">{''.join(card(s) for s in sorted(all_, key=lambda s: (-(s['a'].get('note_inspiration') or 0), s['dir'])))}</div><script>{js}</script></body></html>"""

def md_to_html(md, s):
    # rendu Markdown minimal pour la fiche
    out, in_code, in_table = [], False, False
    for line in md.split('\n'):
        if line.startswith('```'):
            out.append('</pre>' if in_code else '<pre>'); in_code = not in_code; continue
        if in_code: out.append(E(line)); continue
        if line.startswith('|'):
            if re.match(r'^\|[-| ]+\|$', line): continue
            cells = [c.strip() for c in line.strip('|').split('|')]
            if not in_table: out.append('<table>'); in_table = True; tag = 'th'
            else: tag = 'td'
            out.append('<tr>' + ''.join(f'<{tag}>{inline(c)}</{tag}>' for c in cells) + '</tr>'); continue
        if in_table: out.append('</table>'); in_table = False
        if line.startswith('### '): out.append(f'<h3>{inline(line[4:])}</h3>')
        elif line.startswith('## '): out.append(f'<h2>{inline(line[3:])}</h2>')
        elif line.startswith('# '): out.append(f'<h1>{inline(line[2:])}</h1>')
        elif line.startswith('- '): out.append(f'<li>{inline(line[2:])}</li>')
        elif line.strip(): out.append(f'<p>{inline(line)}</p>')
    if in_table: out.append('</table>')
    return '\n'.join(out)

def inline(t):
    t = E(t)
    t = re.sub(r'`([^`]+)`', lambda m: (f'<code><i class="dot" style="background:{m.group(1)}"></i>{m.group(1)}</code>' if re.fullmatch(r'#[0-9a-f]{6}', m.group(1)) else f'<code>{m.group(1)}</code>'), t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(https?://[^\s<)]+)', r'<a href="\1" target="_blank" rel="noopener">\1</a>', t)
    return t

FCSS = CSS + """
main{max-width:1100px;margin:auto;padding:24px}h2{margin-top:32px;border-top:1px solid var(--line);padding-top:18px;font-size:20px}h3{font-size:15px;margin:18px 0 6px}
table{border-collapse:collapse;width:100%;font-size:13px;display:block;overflow-x:auto}td,th{border:1px solid var(--line);padding:5px 8px;text-align:left;vertical-align:top}
pre{background:var(--card);border:1px solid var(--line);padding:12px;border-radius:8px;overflow:auto;font-size:12px;max-height:420px}code{font-size:12.5px;background:var(--card);padding:1px 5px;border-radius:4px;border:1px solid var(--line)}
.dot{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px;border:1px solid var(--line)}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin:14px 0}.gal a img{width:100%;border-radius:6px;border:1px solid var(--line);display:block}
.gal.m{grid-template-columns:repeat(auto-fill,minmax(130px,1fr))}video{width:100%;border-radius:8px;border:1px solid var(--line)}li{margin:3px 0}
"""

def fiche_html(s, md):
    sh = s['shots']
    desk = [f for f in sh if f.startswith('desktop')]; mob = [f for f in sh if f.startswith('mobile')]; pages = [f for f in sh if f.startswith('page')]
    g = lambda fs, cls='': f'<div class="gal {cls}">' + ''.join(f'<a href="captures/{f}" target="_blank"><img loading="lazy" src="captures/{f}" alt="{f}"></a>' for f in fs) + '</div>'
    vid = '<video controls muted preload="none" src="captures/desktop-scroll.webm"></video>' if (SITES / s['dir'] / 'captures' / 'desktop-scroll.webm').exists() else ''
    body = md_to_html(md, s)
    gal = f'<h2>Captures desktop</h2>{vid}{g(desk)}' + (f'<h2>Pages internes</h2>{g(pages)}' if pages else '') + (f'<h2>Mobile</h2>{g(mob, "m")}' if mob else '')
    body = body.replace('<h2>Stack détectée</h2>', gal + '<h2>Stack détectée</h2>', 1)
    return f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(s["d"]["name"])}</title><style>{FCSS}</style></head><body><main><p><a href="../../index.html">← Bibliothèque</a></p>{body}</main></body></html>'

def main():
    all_ = collect()
    for s in all_:
        md = fiche_md(s)
        (SITES / s['dir'] / 'fiche.md').write_text(md, encoding='utf8')
        (SITES / s['dir'] / 'fiche.html').write_text(fiche_html(s, md), encoding='utf8')
    (ROOT / 'index.html').write_text(index_html(all_), encoding='utf8')
    agg = [dict(dossier=s['dir'], nom=s['d']['name'], url=s['d'].get('sourceUrl'), statut=s['d'].get('status'), stack=s['stack'], polices=s['fonts'], palette=s['palette'], fond=s['theme'], **{k: s['a'].get(k) for k in ('type', 'secteur', 'style', 'note_inspiration', 'resume', 'points_forts', 'a_reprendre_pour')}) for s in all_]
    (ROOT / 'bibliotheque.json').write_text(json.dumps(agg, ensure_ascii=False, indent=1), encoding='utf8')
    print(len(all_), 'sites générés')

if __name__ == '__main__': main()
