/* ==========================================================================
   tuner.js — reusable live tuning panel

   Shared by the sphere page and the wheel page so the panel only exists
   once. A page supplies a schema and an apply callback:

     Tuner.create({
       title:    'WHEEL TUNER',
       storeKey: 'shots2026.wheel',
       config:   WHEEL.config,          // the live object to mutate
       groups:   [ { name, open, rows:[ ... ] } ],
       apply:    (row, value) => { ... },
       readout:  () => ({ fps: '', ... }),
     });

   Row shapes:
     { key, min, max, step }              numeric slider + input
     { key, options:[...] }               select
     { key, colour:true }                 native colour picker
     { key, bool:true }                   checkbox
     { label, get, set, ...ditto }        anything not living in config
   Optional per-row: hint (help line under the row).

   ACTIVATION — automatic on localhost / file://, or anywhere with ?tune in
   the URL. Builds nothing otherwise, so it's inert in production.
   ` toggles the panel. Values persist to localStorage.
   ========================================================================== */
(() => {
  'use strict';

  /* ==== SHIP_LOCKED ======================================================
     THE SITE IS SUBMITTED. This is the one switch that closes every developer
     surface on it — the tuning panel, the FPS meter and the ?off= isolator all
     carry this same constant under this same name, so `grep -rn SHIP_LOCKED js/`
     finds all three and flipping them to false brings everything back exactly
     as it was. Nothing is deleted.

     It has to be a constant and not a URL flag, because a URL flag is what
     these already had: ?tune, ?fps and ?off are guessable, they are in the
     source anybody can read, and on a page being judged that is a panel one
     query string away from a stranger. */
  const SHIP_LOCKED = true;

  const params = new URLSearchParams(location.search);
  const isLocal = location.protocol === 'file:' ||
                  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  /* LOCALHOST NO LONGER OPENS IT EITHER, and that is deliberate rather than an
     oversight: a switch you have to remember to flip before deploying is a
     switch that ships open. Turn SHIP_LOCKED off to work on the site. */
  const ENABLED = !SHIP_LOCKED && (params.has('tune') || isLocal);

  const CSS = `
  .tn-root{position:fixed;top:0;right:0;height:100vh;width:326px;z-index:9999;
    font:11px/1.45 ui-monospace,'SF Mono',Menlo,Consolas,monospace;color:#c9d2dc;
    background:#0d1117f2;backdrop-filter:blur(8px);border-left:1px solid #232b36;
    display:flex;flex-direction:column;mix-blend-mode:normal;isolation:isolate;}
  .tn-root *{box-sizing:border-box;}
  .tn-root.is-hidden{display:none;}
  .tn-head{display:flex;align-items:center;padding:9px 11px;border-bottom:1px solid #232b36;}
  .tn-head b{font-weight:600;letter-spacing:.04em;color:#e6edf3;}
  .tn-head .tn-dim{color:#6b7684;margin-left:auto;font-size:10px;}
  .tn-body{overflow-y:auto;flex:1 1 auto;padding-bottom:6px;}
  .tn-body::-webkit-scrollbar{width:9px;}
  .tn-body::-webkit-scrollbar-thumb{background:#2a3441;border-radius:9px;}
  .tn-grp>summary{cursor:pointer;list-style:none;padding:7px 11px;color:#7fb3ff;
    background:#141b24;border-top:1px solid #1e2630;user-select:none;}
  .tn-grp>summary::-webkit-details-marker{display:none;}
  .tn-grp>summary:before{content:'+ ';color:#4d5b6b;}
  .tn-grp[open]>summary:before{content:'– ';}
  .tn-row{display:grid;grid-template-columns:116px 1fr 58px;gap:7px;align-items:center;padding:4px 11px;}
  .tn-row label{color:#9aa7b5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .tn-row.is-changed label{color:#ffd479;}
  .tn-btn.tn-undo{background:#ffd479;color:#111;border-color:#ffd479;}
  /* A copy-editing row: full width rather than label-beside-control, because
     a block of text cannot be judged for length through a one-line input —
     which is the whole reason the row exists. */
  .tn-row--wide{display:block;}
  .tn-row--wide label{display:block;margin-bottom:6px;}
  .tn-row--wide textarea{width:100%;box-sizing:border-box;resize:vertical;
    font:inherit;line-height:1.45;color:#dbe4ee;background:rgba(0,0,0,.35);
    border:1px solid rgba(255,255,255,.16);border-radius:4px;padding:8px;}
  .tn-row--wide textarea:focus{outline:none;border-color:rgba(255,255,255,.42);}
  .tn-row input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:14px;background:transparent;cursor:pointer;}
  .tn-row input[type=range]::-webkit-slider-runnable-track{height:3px;background:#2a3441;border-radius:3px;}
  .tn-row input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:11px;height:11px;
    margin-top:-4px;border-radius:2px;background:#7fb3ff;border:none;}
  .tn-row input[type=number],.tn-row select{width:100%;background:#161d26;color:#e6edf3;
    border:1px solid #2a3441;border-radius:3px;padding:2px 4px;font:inherit;}
  .tn-row select{grid-column:2 / span 2;}
  .tn-row input[type=number]{text-align:right;-moz-appearance:textfield;}
  .tn-row input[type=number]::-webkit-outer-spin-button,
  .tn-row input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
  .tn-row input[type=color]{grid-column:2;width:100%;height:22px;padding:0;
    background:#161d26;border:1px solid rgba(255,255,255,.14);border-radius:3px;cursor:pointer;}
  .tn-row input[type=color]::-webkit-color-swatch-wrapper{padding:2px;}
  .tn-row input[type=color]::-webkit-color-swatch{border:0;border-radius:2px;}
  .tn-row input[type=checkbox]{grid-column:2;justify-self:start;width:15px;height:15px;accent-color:#1f6feb;cursor:pointer;}
  .tn-hint{grid-column:1/-1;color:#5b6673;font-size:10px;padding:0 11px 3px;}
  .tn-foot{border-top:1px solid #232b36;padding:9px 11px;display:flex;gap:7px;background:#0d1117;}
  .tn-btn{flex:1;padding:7px 8px;border-radius:4px;border:1px solid #2a3441;
    background:#1b2430;color:#e6edf3;font:inherit;cursor:pointer;}
  .tn-btn:hover{background:#243040;}
  .tn-btn.tn-primary{background:#1f6feb;border-color:#1f6feb;color:#fff;font-weight:600;}
  .tn-read{padding:6px 11px;color:#5b6673;font-size:10px;border-top:1px solid #1e2630;
    display:grid;grid-template-columns:1fr 1fr;gap:2px 8px;}
  .tn-read span b{color:#8b97a5;font-weight:400;}
  .tn-toast{position:fixed;bottom:14px;right:340px;background:#1f6feb;color:#fff;padding:7px 12px;
    border-radius:4px;z-index:10000;font:11px ui-monospace,monospace;opacity:0;transition:opacity .18s;pointer-events:none;}
  .tn-toast.is-on{opacity:1;}
  .tn-modal{position:fixed;inset:0;background:#000000cc;z-index:10001;display:flex;
    align-items:center;justify-content:center;padding:40px;}
  .tn-modal textarea{width:min(680px,100%);height:min(60vh,460px);background:#0d1117;color:#e6edf3;
    border:1px solid #2a3441;border-radius:6px;padding:12px;font:11px/1.5 ui-monospace,monospace;resize:none;}
  `;

  let cssInjected = false;
  function injectCss(){
    if (cssInjected) return;
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    cssInjected = true;
  }

  function create(opts){
    if (!ENABLED) return null;
    injectCss();

    /* The panel lives on <body>, OUTSIDE the Barba container, so a page swap
       does not take it with it. During a transition the incoming page mounts
       while the outgoing one is still on screen, which would briefly stack two
       panels on top of each other; clearing any existing one first keeps it to
       the page you are actually looking at. */
    document.querySelectorAll('.tn-root,.tn-toast,.tn-modal')
            .forEach(el => el.remove());

    const C = opts.config;
    const GROUPS = opts.groups;
    const STORE = opts.storeKey;
    const DEFAULTS = JSON.parse(JSON.stringify(C));

    const nameOf = r => r.label || r.key;
    const readRow = r => r.get ? r.get() : C[r.key];
    const writeRow = (r, v) => {
      if (r.set) r.set(v); else C[r.key] = v;
      opts.apply?.(r, v);
    };

    const root = document.createElement('div');
    root.className = 'tn-root';
    root.innerHTML =
      `<div class="tn-head"><b>${opts.title || 'TUNER'}</b><span class="tn-dim">\` or esc</span></div>
       <div class="tn-body"></div><div class="tn-read"></div>
       <div class="tn-foot">
         <button class="tn-btn" data-act="reset">Reset</button>
         ${opts.extraButton ? `<button class="tn-btn" data-act="extra">${opts.extraButton}</button>` : ''}
         <button class="tn-btn tn-primary" data-act="copy">Copy settings</button>
       </div>`;
    document.body.appendChild(root);

    const body = root.querySelector('.tn-body');
    const readEl = root.querySelector('.tn-read');

    /* snapshot non-config rows before building — mark() reads it */
    const baseline = {};
    GROUPS.forEach(g => g.rows.forEach(r => { if (!r.key) baseline[nameOf(r)] = readRow(r); }));

    function mark(row, r){
      const base = r.key ? DEFAULTS[r.key] : baseline[nameOf(r)];
      const now = readRow(r);
      const changed = base !== undefined &&
        (typeof now === 'number' ? Math.abs(now - base) > 1e-9 : String(now) !== String(base));
      row.classList.toggle('is-changed', !!changed);
    }

    function syncRow(r){
      const row = body.querySelector(`.tn-row[data-name="${window.CSS.escape(nameOf(r))}"]`);
      if (!row) return;
      const v = readRow(r);
      const cb = row.querySelector('input[type=checkbox]');
      const sel = row.querySelector('select');
      if (cb) cb.checked = !!v;
      else if (sel) sel.value = v;
      else row.querySelectorAll('input').forEach(i => i.value = v);
      mark(row, r);
    }

    GROUPS.forEach(g => {
      const det = document.createElement('details');
      det.className = 'tn-grp';
      if (g.open) det.open = true;
      det.innerHTML = `<summary>${g.name}</summary>`;

      g.rows.forEach(r => {
        const name = nameOf(r);
        const row = document.createElement('div');
        row.className = 'tn-row';
        row.dataset.name = name;
        const val = readRow(r);

        if (r.textarea){
          /* A multi-line row. It spans the panel rather than sitting beside a
             label, because the thing being edited is a block of copy and a
             one-line input would make judging its length impossible — which is
             the entire reason the row exists.

             Applied on a debounce rather than per keystroke: every change
             rebuilds the column and remeasures, and doing that on each letter
             of a paste of forty lines is a lot of layout for nothing. */
          row.classList.add('tn-row--wide');
          row.innerHTML = `<label title="${name}">${name}</label>
            <textarea rows="${r.rows || 10}" spellcheck="false"></textarea>`;
          const ta = row.querySelector('textarea');
          ta.value = val == null ? '' : String(val);
          let debounce;
          ta.addEventListener('input', e => {
            clearTimeout(debounce);
            const v = e.target.value;
            debounce = setTimeout(() => { writeRow(r, v); mark(row, r); persist(); }, 250);
          });
        } else if (r.bool){
          row.innerHTML = `<label title="${name}">${name}</label><input type="checkbox"${val?' checked':''}>`;
          row.querySelector('input').addEventListener('change', e => {
            writeRow(r, e.target.checked); mark(row, r); persist();
          });
        } else if (r.colour){
          /* A REAL PICKER, not a list of swatches. `options` covers the case
             where a handful of chosen values is the point — the blend modes,
             the ramp ends — but a container colour is not a menu, it is the
             whole spectrum, and offering five of them is offering none.

             The native input carries its own eyedropper and hex field on every
             platform this site is looked at on, which is more than a hand-built
             wheel would, and it costs one line. */
          row.innerHTML = `<label title="${name}">${name}</label>
            <input type="color" value="${val}">`;
          row.querySelector('input').addEventListener('input', e => {
            writeRow(r, e.target.value); mark(row, r); persist();
          });
        } else if (r.options){
          row.innerHTML = `<label title="${name}">${name}</label>
            <select>${r.options.map(o=>`<option value="${o}"${o===val?' selected':''}>${o}</option>`).join('')}</select>`;
          row.querySelector('select').addEventListener('change', e => {
            writeRow(r, e.target.value); mark(row, r); persist();
          });
        } else {
          row.innerHTML = `<label title="${name}">${name}</label>
            <input type="range" min="${r.min}" max="${r.max}" step="${r.step}" value="${val}">
            <input type="number" min="${r.min}" max="${r.max}" step="${r.step}" value="${val}">`;
          const [rng, num] = row.querySelectorAll('input');
          const push = v => {
            v = Math.min(r.max, Math.max(r.min, Number(v)));
            rng.value = v; num.value = v;
            writeRow(r, v); mark(row, r); persist();
          };
          rng.addEventListener('input', e => push(e.target.value));
          num.addEventListener('change', e => push(e.target.value));
        }

        det.appendChild(row);
        if (r.hint){
          const h = document.createElement('div');
          h.className = 'tn-hint'; h.textContent = r.hint;
          det.appendChild(h);
        }
        mark(row, r);
      });
      body.appendChild(det);
    });

    /* ---- live readout ---- */
    let frames = 0, fps = 0, last = performance.now();
    let readRaf = 0, alive = true;
    (function tick(){
      if (!alive) return;
      frames++;
      const now = performance.now();
      if (now - last >= 500){ fps = Math.round(frames*1000/(now-last)); frames = 0; last = now; }
      const extra = opts.readout ? opts.readout() : {};
      readEl.innerHTML = [`<span><b>fps</b> ${fps}</span>`]
        .concat(Object.entries(extra).map(([k,v]) => `<span><b>${k}</b> ${v}</span>`))
        .join('');
      readRaf = requestAnimationFrame(tick);
    })();

    /* ---- collect / persist ---- */
    function collect(){
      const out = { config:{}, css:{} };
      GROUPS.forEach(g => g.rows.forEach(r => {
        const v = readRow(r);
        if (r.key) out.config[r.key] = v; else out.css[nameOf(r)] = v;
      }));
      return out;
    }
    /* What this build ships, read off the rows themselves before anything is
       restored — so it covers CSS-backed and closure-backed rows too, not just
       the ones with a `key` into the config object. */
    const SHIPPED = {};
    GROUPS.forEach(g => g.rows.forEach(r => { SHIPPED[nameOf(r)] = readRow(r); }));

    /* Persist ONLY what the user actually moved.

       persist() used to snapshot every row on any change, so one nudge of one
       slider froze the whole panel into localStorage — and from then on the
       shipped defaults were dead. Changing a default in the source did nothing
       for anyone who had ever opened the panel: the stale value restored over
       it silently, on every load, forever. That is how a line gap the code set
       to 12 kept rendering at nearly 30, with both the code and the page
       telling the truth about different numbers.

       Storing only deviations means an untouched row always follows the
       current build, and the stored object stays a short list of deliberate
       choices instead of a full mirror of the panel. */
    function deviations(){
      const all = collect();
      const out = { config: {}, css: {} };
      GROUPS.forEach(g => g.rows.forEach(r => {
        /* TRANSIENT rows are buttons wearing a slider's clothes — scrub,
           preview. Their getter returns a sentinel rather than a setting, so
           persisting one and replaying it on load fires the ACTION: a stored
           scrub of 0 hid the dissolve on every mount. They are settings-shaped
           and are not settings, so nothing stores or restores them. */
        if (r.transient) return;
        const bucket = r.key ? 'config' : 'css';
        const key = r.key ? r.key : nameOf(r);
        const v = r.key ? all.config?.[key] : all.css?.[key];
        if (v === undefined) return;
        const ship = SHIPPED[nameOf(r)];
        const same = (typeof v === 'number' && typeof ship === 'number')
          ? Math.abs(v - ship) < 1e-9
          : String(v) === String(ship);
        if (!same) out[bucket][key] = v;
      }));
      return out;
    }

    /* Bump when the meaning of a stored value changes, or when shipped
       defaults move enough that stale state would be wrong rather than just
       old. A payload without a matching stamp is discarded once. */
    /* 3, because mask.html's two blocks swapped meaning: what used to be the
       page's main figure is now the second block and vice versa. A stored
       deviation is a label and a number, and the labels survived the swap —
       so a browser that had tuned the old page would have applied the head's
       framing to the full body and called it restored. Bumping the stamp
       throws those away rather than silently mis-applying them. */
    const STORE_V = 3;

    /* Everything the panel can write, plus the raw stored payload, so an undo
       puts back the SAVED state as well as the live one. */
    let undoStash = null;
    function snapshot(){
      const rows = {};
      GROUPS.forEach(g => g.rows.forEach(r => {
        if (r.transient) return;
        rows[nameOf(r)] = readRow(r);
      }));
      let stored = null;
      try { stored = localStorage.getItem(STORE); } catch(e){}
      return { rows, stored };
    }
    function applySnapshot(snap){
      GROUPS.forEach(g => g.rows.forEach(r => {
        if (r.transient) return;
        const v = snap.rows[nameOf(r)];
        if (v === undefined) return;
        writeRow(r, v);
        syncRow(r);
      }));
      try {
        if (snap.stored == null) localStorage.removeItem(STORE);
        else localStorage.setItem(STORE, snap.stored);
      } catch(e){}
      opts.restored?.();
    }
    function setUndoable(on){
      const btn = root.querySelector('.tn-btn[data-act="reset"], .tn-btn[data-act="undo"]');
      if (!btn) return;
      btn.dataset.act = on ? 'undo' : 'reset';
      btn.textContent = on ? 'Undo reset' : 'Reset';
      btn.classList.toggle('tn-undo', !!on);
    }

    function persist(){
      // an edit after a reset means the reset has been accepted
      if (undoStash){ undoStash = null; setUndoable(false); }
      try { localStorage.setItem(STORE, JSON.stringify({ v: STORE_V, ...deviations() })); }
      catch(e){}
    }

    (function restore(){
      let saved;
      try { saved = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch(e){}
      if (!saved) return;

      /* A payload from before the deviations change is a snapshot of EVERY
         row, so a value in it may be something the user chose or may be
         whatever the default happened to be that day — and there is no way to
         tell which. Applying it means stale defaults quietly override the
         build forever; keeping it means guessing. Drop it once, say so, and
         let the shipped defaults through. Everything saved from here on is
         deviations only, which is unambiguous, so this happens exactly once. */
      if (saved.v !== STORE_V){
        try { localStorage.removeItem(STORE); } catch(e){}
        console.warn(`[tuner] cleared saved "${STORE}" state from an older ` +
          `build: it stored every row, so a stale default could not be told ` +
          `apart from a deliberate change. Using this build's defaults.`);
        return;
      }
      GROUPS.forEach(g => g.rows.forEach(r => {
        if (r.transient) return;
        const v = r.key ? saved.config?.[r.key] : saved.css?.[nameOf(r)];
        if (v === undefined) return;

        /* A stored number outside the row's own slider range is not a setting,
           it is corruption — nothing in the UI could have produced it. Restore
           it and the page comes up broken with no way to tell why, which is
           exactly what happened when a unit-mismatched row wrote 6 into a
           0..1 control and the About copy vanished six screens down the page.
           Drop it and fall back to the shipped default. */
        if (typeof v === 'number' && typeof r.min === 'number' &&
            (v < r.min - 1e-9 || v > r.max + 1e-9)){
          console.warn(`[tuner] ignoring stored "${nameOf(r)}" = ${v}: outside ` +
                       `its range ${r.min}..${r.max}. Using the default.`);
          return;
        }

        if (r.set) r.set(v); else C[r.key] = v;

        /* Write it, read it straight back, and complain if they disagree.

           A row whose getter and setter use different units silently corrupts
           itself a little more on every save: the value is written, read back
           wrong, stored wrong, and applied wrong next load. One row here read
           "6svh" as 6 and wrote it back as 600svh, which moved the About copy
           six screens down the page and made it look simply absent — through
           several rounds of looking in the wrong place. A round trip check is
           two lines and turns that into a console warning. */
        const back = readRow(r);
        const drift = (typeof v === 'number' && typeof back === 'number')
          ? Math.abs(back - v) > Math.max(1e-6, Math.abs(v) * 0.02)
          : String(back) !== String(v);
        if (drift){
          console.warn(`[tuner] "${nameOf(r)}" does not round-trip: stored ` +
            `${JSON.stringify(v)}, reads back ${JSON.stringify(back)}. Its get ` +
            `and set are probably in different units.`);
        }
        syncRow(r);
      }));
      opts.restored?.();
    })();

    /* ---- buttons ---- */
    const toast = document.createElement('div');
    toast.className = 'tn-toast';
    document.body.appendChild(toast);
    let toastT;
    const say = m => {
      toast.textContent = m; toast.classList.add('is-on');
      clearTimeout(toastT); toastT = setTimeout(()=>toast.classList.remove('is-on'), 1600);
    };

    function fallbackCopy(text){
      const m = document.createElement('div');
      m.className = 'tn-modal';
      m.innerHTML = `<textarea spellcheck="false"></textarea>`;
      const ta = m.querySelector('textarea');
      ta.value = text;
      m.addEventListener('click', e => { if (e.target === m) m.remove(); });
      document.body.appendChild(m);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); say('Copied — click outside to close'); }
      catch(e){ say('Select all + copy, then click outside'); }
    }

    root.querySelector('.tn-foot').addEventListener('click', e => {
      const act = e.target.dataset.act;
      if (!act) return;
      if (act === 'copy'){
        const payload = JSON.stringify(collect(), null, 2);
        if (navigator.clipboard?.writeText){
          navigator.clipboard.writeText(payload).then(()=>say('Settings copied')).catch(()=>fallbackCopy(payload));
        } else fallbackCopy(payload);
      }
      if (act === 'reset'){
        /* UNDOABLE. Reset used to delete the stored values outright and there
           was nothing to go back to — the only safety net was remembering to
           press Copy settings first, which is exactly the kind of discipline
           a destructive button should not require.

           The whole panel is snapshotted first, including the raw localStorage
           payload, and the button becomes Undo. Any edit afterwards clears the
           stash and the button goes back to Reset, so it never means two
           things at once. */
        undoStash = snapshot();
        try { localStorage.removeItem(STORE); } catch(err){}
        Object.assign(C, JSON.parse(JSON.stringify(DEFAULTS)));
        GROUPS.forEach(g => g.rows.forEach(r => {
          if (r.transient) return;
          if (!r.key) r.set(baseline[nameOf(r)]);
          syncRow(r);
        }));
        opts.reset?.();
        setUndoable(true);
        say('Reset — press Undo to put it back');
      }
      if (act === 'undo'){
        if (!undoStash){ say('Nothing to undo'); return; }
        applySnapshot(undoStash);
        undoStash = null;
        setUndoable(false);
        say('Reset undone');
      }
      if (act === 'extra') opts.onExtra?.(say);
    });

    /* ---- show / hide ----------------------------------------------------
       OFF by default. The panel is built (so it is instant when summoned, and
       so its stored values are applied on load) but starts hidden, and ` is
       the only way in. There is deliberately no floating "tuner" button any
       more: a permanent affordance in the corner contradicts the panel being
       off, and it was the one piece of the dev UI that showed up in
       screenshots of the actual design. */
    root.classList.add('is-hidden');
    const setHidden = h => { root.classList.toggle('is-hidden', h); };
    /* e.code is the PHYSICAL key, e.key is what the active layout produces.
       Checking only e.key meant the toggle silently did nothing on any
       non-Latin layout (Ukrainian, Cyrillic, etc.) — that key emits a
       different character there. e.code works regardless of layout;
       Escape is kept as a second way out. */
    const onKey = e => {
      const isToggle = e.code === 'Backquote' || e.key === '`' || e.key === '~' ||
                       e.code === 'IntlBackslash';
      if (isToggle || e.key === 'Escape'){
        e.preventDefault();
        setHidden(e.key === 'Escape' ? true : !root.classList.contains('is-hidden'));
      }
    };
    window.addEventListener('keydown', onKey);

    return {
      say, collect,
      syncAll: () => GROUPS.forEach(g => g.rows.forEach(syncRow)),
      /* Called by the page lifecycle when this page is torn down. */
      destroy(){
        alive = false;
        cancelAnimationFrame(readRaf);
        clearTimeout(toastT);
        window.removeEventListener('keydown', onKey);
        root.remove(); toast.remove();
        document.querySelectorAll('.tn-modal').forEach(el => el.remove());
      },
    };
  }

  window.Tuner = { create, enabled: ENABLED };
})();
