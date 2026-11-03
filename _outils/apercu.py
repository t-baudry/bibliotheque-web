# Crée sites/*/apercu.html : le DOM rendu (page.html) avec <base href> vers le vrai site,
# pour que CSS, polices et images se chargent depuis le site d'origine. Scripts retirés
# (trackers, réhydratation qui casserait la page). Usage : py -I apercu.py
import json, re, pathlib
SITES = pathlib.Path(__file__).resolve().parent.parent / 'sites'
n = 0
for d in sorted(SITES.iterdir()):
    p, j = d / 'page.html', d / 'data.json'
    if not p.exists() or not j.exists(): continue
    url = json.loads(j.read_text(encoding='utf8')).get('finalUrl') or json.loads(j.read_text(encoding='utf8')).get('sourceUrl')
    h = p.read_text(encoding='utf8', errors='replace')
    h = re.sub(r'<script\b[^>]*>.*?</script>', '', h, flags=re.S | re.I)
    h = re.sub(r'<base\b[^>]*>', '', h, flags=re.I)
    banner = ('<div style="position:fixed;z-index:2147483647;bottom:8px;left:8px;font:12px system-ui;background:#000;color:#fff;padding:4px 8px;border-radius:4px;opacity:.75">'
              'Aperçu statique (sans JS ni animations) — référence visuelle : captures/ et vidéo</div>')
    h = re.sub(r'<head([^>]*)>', lambda m: f'<head{m.group(1)}><meta charset="utf-8"><base href="{url}">', h, count=1, flags=re.I)
    h = re.sub(r'</body>', banner + '</body>', h, count=1, flags=re.I)
    (d / 'apercu.html').write_text(h, encoding='utf8'); n += 1
print(n, 'aperçus créés')
