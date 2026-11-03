/* ==========================================================================
   clock.js — the time where Liubomyr is, in the bar.

   IT IS HIS CLOCK, NOT THE VISITOR'S, and that is the entire point of putting
   one in a portfolio: it says where the person is, not where you are. So the
   time is formatted in a NAMED ZONE rather than read off the local machine —
   `Intl.DateTimeFormat` with `timeZone: 'Europe/Kyiv'` gives Lviv's wall clock
   from Tokyo and from Berlin alike, and it handles the summer-time change
   without a table, which is the part that would otherwise rot every March and
   October.

   THE ICON. Sun before noon, moon after — which is what was asked for, and it
   is AM/PM rather than daylight: at 3am the sun is showing. That reads oddly to
   me and it is a real choice rather than an oversight, so `mode` carries the
   other reading too — `daynight` swaps at dawn and dusk instead, on hours you
   can move. Both are one dial apart.

   ONE TIMER, ALIGNED TO THE DIGIT THAT IS CHANGING. With seconds shown it
   sleeps to the next second boundary; with them off, to the next minute — which
   is fifty-nine wakes a minute saved and, more usefully, a clock that changes
   ON the turn rather than up to a second after it.
   ========================================================================== */
window.PAGE.register('clock', function (scope) {
  'use strict';

  const host = scope.querySelector('[data-clock]');
  if (!host) return;

  const CONFIG = {
    enabled: true,
    /* An IANA zone, not an offset: an offset is wrong for half the year and
       nothing in the code would say so. */
    zone: 'Europe/Kyiv',
    /* THE LABEL IS COMPUTED, NOT TYPED. "GMT+3" is only true for half the
       year — Kyiv is +2 from late October to late March — and a hard-coded
       string would be quietly wrong all winter with nothing in the code to say
       so. `auto` asks the zone what its offset is right now, which also means
       changing the zone changes the label without a second edit. */
    label: 'auto',      // auto · or any literal string, e.g. 'LVIV'
    seconds: true,      // HH:MM:SS, as the design draws it
    hour12: false,      // the site's type is 24-hour everywhere else
    mode: 'ampm',       // ampm · daynight
    dayFrom: 7,         // in DAYNIGHT only: the hour the sun comes up
    dayTo: 19,          // ...and the hour it goes down
  };

  const timeEl = host.querySelector('[data-clock-time]');
  const zoneEl = host.querySelector('[data-clock-zone]');
  let timer = 0, alive = true, lastNight = null;

  /* The formatter is built once per settings change, not per tick: constructing
     an Intl.DateTimeFormat is the expensive part of this whole module and the
     answer it gives does not change between seconds. */
  let fmt = null, hourFmt = null;
  function build(){
    const opts = { timeZone: CONFIG.zone, hour: '2-digit', minute: '2-digit',
                   hour12: !!CONFIG.hour12 };
    if (CONFIG.seconds) opts.second = '2-digit';
    try {
      fmt = new Intl.DateTimeFormat('en-GB', opts);
      hourFmt = new Intl.DateTimeFormat('en-GB',
        { timeZone: CONFIG.zone, hour: '2-digit', hour12: false });
    } catch (e){
      /* AN UNKNOWN ZONE THROWS, and a bar with no clock in it is a better
         outcome than a bar with a wrong one. */
      console.warn('[clock] unknown time zone:', CONFIG.zone);
      fmt = hourFmt = null;
    }
    if (zoneEl) zoneEl.textContent = label();
  }

  /* THE OFFSET, ASKED OF THE ZONE. `timeZoneName: 'shortOffset'` returns
     "GMT+3" directly and follows the summer-time change on its own; where a
     browser is too old for it the difference between the zone's own wall clock
     and UTC gives the same answer, which is worth the six lines because the
     alternative is a label that goes wrong every spring. */
  function label(){
    if (CONFIG.label !== 'auto') return String(CONFIG.label);
    try {
      const parts = new Intl.DateTimeFormat('en-GB',
        { timeZone: CONFIG.zone, timeZoneName: 'shortOffset' }).formatToParts(new Date());
      const nm = parts.find(p => p.type === 'timeZoneName');
      if (nm && /GMT/.test(nm.value)) return nm.value === 'GMT' ? 'GMT+0' : nm.value;
    } catch (e){ /* fall through */ }
    try {
      const d = new Date();
      const there = new Date(d.toLocaleString('en-US', { timeZone: CONFIG.zone }));
      const utc = new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }));
      const h = Math.round((there - utc) / 3600000);
      return 'GMT' + (h < 0 ? '\u2212' : '+') + Math.abs(h);
    } catch (e){ return 'GMT'; }
  }

  function tick(){
    if (!alive || !fmt) return;
    const now = new Date();
    if (timeEl) timeEl.textContent = fmt.format(now);

    /* The offset is re-read rather than written once: it changes twice a year,
       and a page left open across the spring change would otherwise sit there
       claiming GMT+2 until it was reloaded. */
    if (zoneEl){
      const L = label();
      if (L !== zoneEl.textContent) zoneEl.textContent = L;
    }

    /* WHICH ICON. The hour is read back through the same zone rather than from
       the local Date, or the sun would follow the visitor home. */
    const h = parseInt(hourFmt.format(now), 10);
    const night = CONFIG.mode === 'daynight'
      ? !(h >= CONFIG.dayFrom && h < CONFIG.dayTo)
      : h >= 12;
    /* ONE CLASS ON THE PARENT, and the stylesheet decides which icon shows.

       IT USED TO SET `el.hidden` ON EACH ICON, which silently does nothing:
       `hidden` is a property of HTMLElement and these are SVGElements, so the
       assignment created a plain JavaScript expando and never reached the
       content attribute. Reading `el.hidden` back gave the value that had been
       written — so the state looked correct from script — while CSS, which only
       ever sees attributes, matched nothing. The sun never hid and the moon,
       hidden by the attribute the parser gave it, never appeared.

       A class on the parent has no such split: there is one state, it lives in
       one place, and both icons are chosen from it. */
    if (night !== lastNight){
      lastNight = night;
      host.classList.toggle('is-night', night);
    }

    clearTimeout(timer);
    if (!CONFIG.enabled) return;
    /* SLEEP UNTIL THE DIGIT ACTUALLY CHANGES. The small margin is so a timer
       that fires a hair early does not read the old second and then have to
       wait a whole one to correct itself. */
    const ms = CONFIG.seconds
      ? 1000 - now.getMilliseconds()
      : (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    timer = setTimeout(tick, Math.max(60, ms) + 30);
  }

  build();
  tick();

  window.CLOCK = {
    config: CONFIG,
    apply(){ build(); lastNight = null; tick(); },
    readout(){
      return { clock: CONFIG.enabled
        ? `${timeEl ? timeEl.textContent : '--'} ${zoneEl ? zoneEl.textContent : ''} · ${lastNight ? 'moon' : 'sun'}`
        : 'off' };
    },
    rows(){
      const C = CONFIG, self = this;
      return [
        { label: 'clk.enabled', options: ['on', 'off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; self.apply(); },
          hint: 'the clock in the bar' },
        { label: 'clk.zone', options: ['Europe/Kyiv', 'Europe/Warsaw', 'Europe/Berlin',
                                       'Europe/London', 'America/New_York', 'UTC'],
          get: () => C.zone, set: v => { C.zone = v; self.apply(); },
          hint: 'an IANA zone, not an offset · it gives YOUR wall clock to a visitor anywhere, and it handles the summer-time change on its own instead of going an hour wrong every March' },
        { label: 'clk.label', options: ['auto', 'LVIV', 'UKRAINE', 'LVIV, UA'],
          get: () => C.label, set: v => { C.label = v; self.apply(); },
          hint: 'auto asks the zone for its offset and writes GMT+3 \u00b7 it follows the summer-time change on its own, which a typed string cannot: Kyiv is +2 from late October to late March and a hard-coded +3 would be wrong all winter' },
        { label: 'clk.seconds', options: ['off', 'on'],
          get: () => (C.seconds ? 'on' : 'off'),
          set: v => { C.seconds = v === 'on'; self.apply(); },
          hint: 'HH:MM, or HH:MM:SS · with seconds off the timer sleeps until the minute actually turns rather than waking sixty times to change nothing' },
        { label: 'clk.hour12', options: ['off', 'on'],
          get: () => (C.hour12 ? 'on' : 'off'),
          set: v => { C.hour12 = v === 'on'; self.apply(); },
          hint: '24-hour, or 12 with am/pm · the rest of this site’s numbers are 24' },
        { label: 'clk.mode', options: ['ampm', 'daynight'],
          get: () => C.mode, set: v => { C.mode = v; self.apply(); },
          hint: 'ampm: the sun until noon and the moon after, which is what was asked for · daynight: the sun between the two hours below, so it is not shining at three in the morning' },
        { label: 'clk.dayFrom', min: 0, max: 12, step: 1,
          get: () => C.dayFrom, set: v => { C.dayFrom = v; self.apply(); },
          hint: 'DAYNIGHT only · the hour the sun comes up' },
        { label: 'clk.dayTo', min: 12, max: 24, step: 1,
          get: () => C.dayTo, set: v => { C.dayTo = v; self.apply(); },
          hint: '…and the hour it goes down' },
      ];
    },
  };

  return function destroy(){
    alive = false;
    clearTimeout(timer);
    if (window.CLOCK && window.CLOCK.config === CONFIG) delete window.CLOCK;
  };
});
