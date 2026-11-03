// Publie sur GitHub (t-baudry/bibliotheque-web, privé) les sites capturés :
// vidéo de scroll -> asset de la release « videos » puis suppression locale ; le reste -> commit + push.
// Usage : node publier.mjs [slug,…|all]   (appelé aussi par capture.mjs après chaque site)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SITES = path.join(ROOT, 'sites');
export const REPO = 't-baudry/bibliotheque-web';
const env = { ...process.env, GH_TOKEN: process.env.GH_TOKEN || execFileSync('gh', ['auth', 'token', '-u', 't-baudry'], { encoding: 'utf8' }).trim() };
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: ROOT, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000, ...opts });

export function publier(slugs) {
  for (const d of slugs) {
    const v = path.join(SITES, d, 'captures', 'desktop-scroll.webm');
    if (!fs.existsSync(v)) continue;
    const named = path.join(SITES, d, 'captures', `${d}.webm`);
    fs.renameSync(v, named);
    try { run('gh', ['release', 'upload', 'videos', named, '--clobber', '-R', REPO]); fs.unlinkSync(named); fs.writeFileSync(path.join(SITES, d, 'captures', 'video.txt'), `https://github.com/${REPO}/releases/download/videos/${d}.webm\n`); }
    catch (e) { fs.renameSync(named, v); console.error(d, 'vidéo non envoyée :', (e.stderr || e.message).slice(0, 200)); }
  }
  run('git', ['add', '-A']);
  try { run('git', ['commit', '-q', '-m', `Sites : ${slugs.length > 3 ? slugs.length + ' sites' : slugs.join(', ')}`]); } catch (e) { return; }
  for (let i = 0; i < 3; i++) { try { run('git', ['push', '-q', 'origin', 'main']); return; } catch (e) { if (i === 2) console.error('push échoué :', (e.stderr || e.message).slice(0, 300)); } }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sel = process.argv[2] || 'all';
  const slugs = fs.readdirSync(SITES).filter(d => sel === 'all' || sel.split(',').includes(d)).sort();
  publier(slugs); console.log('Publié :', slugs.length, 'dossiers');
}
