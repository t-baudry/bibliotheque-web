// Passe REA hors ligne : rea analyze-javascript-application sur le dossier scripts/ de chaque site,
// puis résumé compact (rea-resume.json). Le graphe complet (souvent > 100 Mo) n'est pas conservé.
// Usage : node rea-pass.mjs [ids|all] [--force]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITES = path.resolve(HERE, '..', 'sites');
const REA = path.join(HERE, 'node_modules', 'rea-agents', 'scripts', 'rea.mjs');
const args = process.argv.slice(2);
const sel = args.find(a => !a.startsWith('--')) || 'all';
const force = args.includes('--force');
const dirs = fs.readdirSync(SITES).filter(d => sel === 'all' || sel.split(',').map(Number).includes(Number(d.slice(0, 3)))).sort();

function run(scripts, out) {
  return new Promise(res => {
    const fd = fs.openSync(out, 'w');
    const p = spawn(process.execPath, [REA, 'analyze-javascript-application', scripts, '--artifact-format', 'directory', '--format', 'json'], { stdio: ['ignore', fd, 'ignore'] });
    const t = setTimeout(() => p.kill(), 600000);
    p.on('close', code => { clearTimeout(t); fs.closeSync(fd); res(code); });
  });
}

for (const d of dirs) {
  const scripts = path.join(SITES, d, 'scripts'); const outF = path.join(SITES, d, 'rea-resume.json');
  if (!fs.existsSync(scripts) || fs.readdirSync(scripts).filter(f => f.endsWith('.js')).length === 0) { console.log(d, 'pas de JS'); continue; }
  if (!force && fs.existsSync(outF)) { console.log(d, 'déjà fait'); continue; }
  const tmp = path.join(os.tmpdir(), `rea-${d}.json`); const t0 = Date.now();
  const code = await run(scripts, tmp);
  let resume = { outil: 'rea analyze-javascript-application (rea-agents 6.7.0)', code, durationS: Math.round((Date.now() - t0) / 1000) };
  try {
    let raw = JSON.parse(fs.readFileSync(tmp, 'utf8')); if (raw.error) { resume.rea_erreur = raw.code + ' : ' + raw.message; raw = raw.details?.partial_observation || {}; } const n = raw.normalized_result || {};
    const sg = n.semantic_graph || {}; const nodes = sg.nodes || [];
    const kinds = {}; for (const x of nodes) kinds[x.kind] = (kinds[x.kind] || 0) + 1;
    const pick = k => nodes.filter(x => x.kind === k).slice(0, 40).map(x => ({ label: (x.label || '').slice(0, 160), file: x.identity?.module_path, line: x.identity?.source_range?.start?.line, props: JSON.stringify(x.properties || {}).slice(0, 300) }));
    const fnByFile = {}; for (const x of nodes) if (x.kind === 'function') { const f = x.identity?.module_path; fnByFile[f] = (fnByFile[f] || 0) + 1; }
    const namedFns = nodes.filter(x => x.kind === 'function' && x.label && x.label.length > 3 && !/^anonymous/.test(x.label)).map(x => x.label);
    resume = { ...resume, statistiques: n.statistics, types_de_noeuds: kinds, fonctions_par_fichier: fnByFile,
      fonctions_nommees: [...new Set(namedFns)].slice(0, 300), modules: pick('module'), requetes: pick('request'), reponses: pick('response'), timers: pick('timer'), taches: pick('task'), frontieres: pick('boundary'), promesses: pick('promise'),
      empreintes_fonctions: (sg.fingerprints || []).length, inconnues: (sg.unknowns || []).length, limites: (n.limitations || raw.limitations || []).slice(0, 6) };
  } catch (e) { resume.erreur = 'sortie illisible : ' + e.message; }
  fs.writeFileSync(outF, JSON.stringify(resume, null, 1));
  try { fs.unlinkSync(tmp); } catch (e) {}
  console.log(d, resume.erreur ? 'erreur' : 'ok', resume.durationS + 's');
}
console.log('Terminé.');
