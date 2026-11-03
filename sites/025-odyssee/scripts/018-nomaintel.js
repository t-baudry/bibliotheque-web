/*! Noma Intel Tag v1.43.0 */
(function (window, document) {
  'use strict';

  function safeDecode(s) {
    if (s == null) return s;
    try { return decodeURIComponent(s); } catch (e) { return s; }
  }

  var cfg = window.NomaintelConfig || window.NomaIntelConfig || window.MeerkatConfig || {};
  var ENDPOINT = cfg.endpoint || 'https://noma-intel-tag.nomaintel-data.com/collect';
  var CLIENT_ID = cfg.clientId || '';
  var CONSENT_REQUIRED = cfg.consentRequired !== false;
  var AI_CONSENT_EXEMPT = cfg.aiConsentExempt !== false;
  var DURABLE_ID = cfg.durableId !== false;

  var TAG_VERSION = '1.43.0';

  var INTERNAL_COOKIE = '_mnint';
  (function staffDeviceSwitch() {
    try {
      var m = String(location.search || '').match(/[?&]noma_internal=([01])(?:&|$)/);
      if (!m) return;
      if (m[1] === '1') setCookie(INTERNAL_COOKIE, '1', 365);
      else deleteCookie(INTERNAL_COOKIE);
    } catch (e) {   }
  })();
  function isInternalDevice() {
    try { return getCookie(INTERNAL_COOKIE) === '1' || !!staffMarkedVia; } catch (e) { return false; }
  }

  var STAFF_TOOLBAR_CONTROLS = '#wp-admin-bar-new-content, #wp-admin-bar-edit, #wp-admin-bar-customize, #wp-admin-bar-site-editor';
  var staffMarkedVia = '';
  var staffViaReported = false;
  function siteHostKey(host) {
    return String(host || '').toLowerCase().replace(/:[0-9]+$/, '').replace(/^www[.]/, '');
  }
  function wpAdminArrival() {
    var m = String(document.referrer || '').match(/^https?:[/][/]([^/?#]+)([^?#]*)/i);
    if (!m) return false;
    if (siteHostKey(m[1]) !== siteHostKey(location.hostname)) return false;
    return /(^|[/])wp-admin([/]|$)/.test(m[2]);
  }
  function wpStaffToolbar() {
    return !!(document.querySelector('#wpadminbar') && document.querySelector(STAFF_TOOLBAR_CONTROLS));
  }
  function markSiteStaff() {
    try {
      if (cfg.markSiteStaff === false || isInternalDevice()) return;
      if (!hasAnalyticsConsent()) return;
      var via = wpAdminArrival() ? 'wp_admin_referrer' : (wpStaffToolbar() ? 'wp_toolbar' : '');
      if (!via) return;
      setCookie(INTERNAL_COOKIE, '1', 365);
      staffMarkedVia = via;
    } catch (e) {   }
  }
  function staffViaExtras(extras) {
    if (!staffMarkedVia || staffViaReported) return extras;
    staffViaReported = true;
    var out = {};
    if (extras) { for (var k in extras) { if (Object.prototype.hasOwnProperty.call(extras, k)) out[k] = extras[k]; } }
    out.staff_via = staffMarkedVia;
    return out;
  }

  var SUBMIT_MARKER_KEY = '_mnsub';
  var SUBMIT_MARKER_MAX_MS = 30 * 60 * 1000;
  function markSubmitAttempt(label, kind) {
    try {
      if (!window.sessionStorage) return;
      sessionStorage.setItem(SUBMIT_MARKER_KEY, JSON.stringify({
        t: Date.now(), l: String(label || '').slice(0, 120), k: String(kind || '').slice(0, 20)
      }));
    } catch (e) {   }
  }
  function takeSubmitMarker() {
    try {
      if (!window.sessionStorage) return null;
      var raw = sessionStorage.getItem(SUBMIT_MARKER_KEY);
      if (!raw) return null;
      sessionStorage.removeItem(SUBMIT_MARKER_KEY);
      var mk = JSON.parse(raw);
      var age = Date.now() - Number(mk && mk.t);
      if (!(age >= 0 && age <= SUBMIT_MARKER_MAX_MS)) return null;
      return { ms: age, label: String(mk.l || ''), kind: String(mk.k || '') };
    } catch (e) { return null; }
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? safeDecode(match[1]) : null;
  }

  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + days * 864e5);
      expires = '; expires=' + d.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
  }
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
  }

  var MAX_LINKED_DOMAINS = 20;
  var LINKED_DOMAINS = [];

  function normaliseLinkedDomain(v) {
    var d = String(v || '').toLowerCase().replace('https://', '').replace('http://', '');
    d = d.split('/')[0].split('?')[0].split('#')[0].split(':')[0];
    while (d.charAt(d.length - 1) === '.') d = d.slice(0, -1);
    return d.indexOf('.') > -1 ? d : '';
  }

  function addLinkedDomains(list) {
    if (!list || typeof list.length !== 'number') return;
    for (var i = 0; i < list.length && LINKED_DOMAINS.length < MAX_LINKED_DOMAINS; i++) {
      var d = normaliseLinkedDomain(list[i]);
      if (d && LINKED_DOMAINS.indexOf(d) === -1) LINKED_DOMAINS.push(d);
    }
  }
  addLinkedDomains(cfg.linkedDomains);
  var LINK_PARAM = '_nl';
  var LINK_MAX_AGE_MS = 120000;

  function linkFingerprint() {
    var s = window.screen || {};
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { tz = ''; }
    var raw = (navigator.userAgent || '') + '|' + (s.width || 0) + 'x' + (s.height || 0) +
              '|' + (navigator.language || '') + '|' + tz;
    var h = 5381;
    for (var i = 0; i < raw.length; i++) h = ((h * 33) ^ raw.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  function isLinkedDomain(host) {
    if (!host || !LINKED_DOMAINS.length) return false;
    host = String(host).toLowerCase();
    for (var i = 0; i < LINKED_DOMAINS.length; i++) {
      var d = LINKED_DOMAINS[i];
      if (host === d || host.slice(-(d.length + 1)) === '.' + d) return true;
    }
    return false;
  }

  var adoptedLink = null;
  (function adoptLinkedIdentity() {
    var raw = getQueryParam(LINK_PARAM);
    if (!raw) return;
    var p = null;
    try { p = JSON.parse(raw); } catch (e) { return; }
    if (!p || !p.u || !p.t) return;
    var age = Date.now() - Number(p.t);
    if (age >= LINK_MAX_AGE_MS || age < -30000) return;
    if (p.f && p.f !== linkFingerprint()) return;
    adoptedLink = p;
    try {
      if (window.history && history.replaceState) {
        var enc = encodeURIComponent(raw);
        var clean = location.href
          .replace('&' + LINK_PARAM + '=' + enc, '')
          .replace('?' + LINK_PARAM + '=' + enc + '&', '?')
          .replace('?' + LINK_PARAM + '=' + enc, '');
        if (clean !== location.href) history.replaceState(null, '', clean);
      }
    } catch (e) {   }
  }());

  function genUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  var uid = getCookie('_muid');
  if (adoptedLink && adoptedLink.u && adoptedLink.u !== uid) {
    uid = adoptedLink.u; setCookie('_muid', uid, 365);
  } else if (!uid) { uid = genUUID(); setCookie('_muid', uid, 365); }

  var SESSION_TIMEOUT = 30 * 60 * 1000;
  var now = Date.now();
  var SESSION_SOURCE_COOKIES = ['_mutms','_mutmm','_mutmc','_mutmx','_mutmt','_mgclk','_mfbclk','_mmsclk','_mttclk','_mtwclk','_mlifat','_mrefst','_mrefh'];
  var sessionStart = parseInt(getCookie('_mss') || '0', 10);
  var sessionNumber = parseInt(getCookie('_msn') || '0', 10);
  var hitNumber = parseInt(getCookie('_mhn') || '0', 10);
  var lastHit = parseInt(getCookie('_mlh') || '0', 10);
  var isNewSession = !sessionStart || (now - lastHit) > SESSION_TIMEOUT;
  if (isNewSession) {
    for (var sc = 0; sc < SESSION_SOURCE_COOKIES.length; sc++) { deleteCookie(SESSION_SOURCE_COOKIES[sc]); }
    sessionStart = now; sessionNumber += 1; hitNumber = 0;
    setCookie('_mss', sessionStart, 0); setCookie('_msn', sessionNumber, 365);
  }
  hitNumber += 1; setCookie('_mhn', hitNumber, 0); setCookie('_mlh', now, 0);
  function touchSession() {
    var t = Date.now();
    var last = parseInt(getCookie('_mlh') || '0', 10);
    if (last && (t - last) > SESSION_TIMEOUT) return;
    setCookie('_mlh', t, 0);
  }

  function getQueryParam(key) {
    var match = location.search.match(new RegExp('[?&]' + key + '=([^&]*)'));
    return match ? safeDecode(match[1]) : null;
  }
  var utmSource = getQueryParam('utm_source'), utmMedium = getQueryParam('utm_medium'),
      utmCampaign = getQueryParam('utm_campaign'), utmContent = getQueryParam('utm_content'),
      utmTerm = getQueryParam('utm_term'), gclid = getQueryParam('gclid'),
      fbclid = getQueryParam('fbclid'), msclkid = getQueryParam('msclkid'),
      ttclid = getQueryParam('ttclid'), twclid = getQueryParam('twclid'),
      li_fat_id = getQueryParam('li_fat_id');
  function firstTouch(cookieName, urlValue) {
    var stored = getCookie(cookieName);
    if (stored) return stored;
    if (urlValue) { setCookie(cookieName, urlValue, 0); return urlValue; }
    return '';
  }
  if (!getCookie('_mutms') && utmSource) {
    setCookie('_mutms', utmSource, 0); setCookie('_mutmm', utmMedium || '', 0);
    setCookie('_mutmc', utmCampaign || '', 0); setCookie('_mutmx', utmContent || '', 0);
    setCookie('_mutmt', utmTerm || '', 0);
  } else if (getCookie('_mutms')) {
    utmSource = getCookie('_mutms'); utmMedium = getCookie('_mutmm');
    utmCampaign = getCookie('_mutmc'); utmContent = getCookie('_mutmx');
    utmTerm = getCookie('_mutmt');
  }
  gclid     = firstTouch('_mgclk',  gclid);
  fbclid    = firstTouch('_mfbclk', fbclid);
  msclkid   = firstTouch('_mmsclk', msclkid);
  ttclid    = firstTouch('_mttclk', ttclid);
  twclid    = firstTouch('_mtwclk', twclid);
  li_fat_id = firstTouch('_mlifat', li_fat_id);

  var SEARCH_ENGINES = [
    { name: 'google',     pattern: /google\./i,       kw: 'q'    },
    { name: 'bing',       pattern: /bing\.com/i,      kw: 'q'    },
    { name: 'yahoo',      pattern: /yahoo\.com/i,     kw: 'p'    },
    { name: 'duckduckgo', pattern: /duckduckgo\.com/i,kw: 'q'    },
    { name: 'baidu',      pattern: /baidu\.com/i,     kw: 'wd'   },
    { name: 'yandex',     pattern: /yandex\./i,       kw: 'text' }
  ];
  function parseReferrer(ref) {
    if (!ref) return { search_engine: '', organic_keyword: '' };
    var schemeEnd = ref.indexOf('://');
    if (schemeEnd > -1) {
      var refScheme = ref.slice(0, schemeEnd).toLowerCase();
      if (refScheme !== 'http' && refScheme !== 'https') return { search_engine: '', organic_keyword: '' };
    }
    for (var i = 0; i < SEARCH_ENGINES.length; i++) {
      var se = SEARCH_ENGINES[i];
      if (se.pattern.test(ref)) {
        var kwMatch = ref.match(new RegExp('[?&]' + se.kw + '=([^&]*)'));
        return { search_engine: se.name, organic_keyword: kwMatch ? safeDecode(kwMatch[1].replace(/\+/g,' ')) : '(not provided)' };
      }
    }
    return { search_engine: '', organic_keyword: '' };
  }
  var referrerInfo = parseReferrer(document.referrer);

  var navType = '';
  try {
    var navEntries = (window.performance && performance.getEntriesByType)
      ? performance.getEntriesByType('navigation') : null;
    if (navEntries && navEntries.length) navType = navEntries[0].type || '';
    else if (window.performance && performance.navigation) {
      var t = performance.navigation.type;
      navType = (t === 1) ? 'reload' : (t === 2) ? 'back_forward' : 'navigate';
    }
  } catch (e) { navType = ''; }
  function deriveReferrerStatus() {
    if (document.referrer) return 'present';
    if (navType === 'reload' || navType === 'back_forward') return 'direct_genuine';
    var urlHasSource = !!(getQueryParam('gclid') || getQueryParam('fbclid') ||
      getQueryParam('msclkid') || getQueryParam('ttclid') || getQueryParam('twclid') ||
      getQueryParam('li_fat_id') || getQueryParam('utm_source'));
    if (urlHasSource) return 'stripped_suspected';
    return 'direct_genuine';
  }
  var referrerStatus = firstTouch('_mrefst', deriveReferrerStatus());

  function refHostname(ref) {
    if (!ref) return '';
    var idx = ref.indexOf('://');
    var scheme = idx === -1 ? '' : ref.slice(0, idx).toLowerCase();
    var rest = idx === -1 ? ref : ref.slice(idx + 3);
    var end = rest.length;
    for (var h = 0; h < rest.length; h++) {
      var ch = rest.charAt(h);
      if (ch === '/' || ch === '?' || ch === '#') { end = h; break; }
    }
    var host = rest.slice(0, end).toLowerCase();
    if (scheme && scheme !== 'http' && scheme !== 'https') return scheme + '://' + host;
    return host;
  }
  var landingRefHost = refHostname(document.referrer || '');
  if (landingRefHost === String(location.hostname || '').toLowerCase()) landingRefHost = '';
  var sessionRefHost = firstTouch('_mrefh', landingRefHost);
  var firstTouchData = null;
  try { firstTouchData = JSON.parse(getCookie('_mft') || 'null'); } catch (e) { firstTouchData = null; }
  if ((!firstTouchData || typeof firstTouchData !== 'object') &&
      adoptedLink && adoptedLink.m && typeof adoptedLink.m === 'object') {
    firstTouchData = adoptedLink.m;
    setCookie('_mft', JSON.stringify(firstTouchData), 365);
  }
  if (!firstTouchData || typeof firstTouchData !== 'object') {
    var ftClickId = gclid ? 'gclid' : fbclid ? 'fbclid' : msclkid ? 'msclkid' :
      ttclid ? 'ttclid' : twclid ? 'twclid' : li_fat_id ? 'li_fat_id' : '';
    if (utmSource || ftClickId || sessionRefHost) {
      firstTouchData = { s: utmSource || '', m: utmMedium || '', c: utmCampaign || '',
        k: ftClickId, r: sessionRefHost || '', rs: referrerStatus || '', t: now };
      setCookie('_mft', JSON.stringify(firstTouchData), 365);
    } else { firstTouchData = null; }
  }

  var AI_CRAWLER_PATTERNS = [
    /GPTBot/i,/ChatGPT-User/i,/OAI-SearchBot/i,/ClaudeBot/i,/Claude-Web/i,/Claude-User/i,/anthropic-ai/i,
    /Google-Extended/i,/Google-NotebookLM/i,/Gemini-Deep-Research/i,
    /PerplexityBot/i,/Perplexity-User/i,/xAI-Bot/i,/DeepseekBot/i,
    /DuckAssistBot/i,/MistralAI-User/i,/Bytespider/i,/TikTokSpider/i,
    /meta-externalagent/i,/meta-externalfetcher/i,/meta-externalads/i,/CCBot/i,/Applebot-Extended/i,
    /Amazonbot/i,/cohere-ai/i,/Diffbot/i,/PhindBot/i,/AndiBot/i,/PromptingBot/i,/YouBot/i
  ];
  var GENERIC_BOT_PATTERNS = [
    /Googlebot/i,/GoogleOther/i,/Google-InspectionTool/i,/Storebot-Google/i,
    /BingBot/i,/YandexBot/i,/YandexAdditional/i,/DuckDuckBot/i,/PetalBot/i,/Kangaroo Bot/i,
    /Baiduspider/i,/BingPreview/i,/YandexRenderResourcesBot/i,
    /facebookexternalhit/i,/meta-webindexer/i,/Applebot/i,/LinkedInBot/i,/Twitterbot/i,
    /SemrushBot/i,/AhrefsBot/i,/AhrefsSiteAudit/i,/Sogou web spider/i,/HubSpot Crawler/i,/ia_archiver/i,
    /WP-Rocket-SaaS/i,/wp-rocket\.me\/bot/i,
    /UptimeRobot/i,/Pingdom/i,/Better Uptime/i,/StatusCake/i,/Site24x7/i,
    /Screaming Frog SEO Spider/i,/Sitebulb/i,/GTmetrix/i,/Chrome-Lighthouse/i,/PTST/i
  ];
  var AI_REFERRAL_DOMAINS = [
    'chat.openai.com','chatgpt.com','gemini.google.com','bard.google.com','claude.ai',
    'perplexity.ai','copilot.microsoft.com','bing.com/chat','grok.com','grok.x.ai',
    'chat.deepseek.com','deepseek.com','you.com','phind.com','poe.com','getliner.com'
  ];

  function scoreAutomation() {
    var score = 0, signals = [];
    if (navigator.webdriver === true) { score += 100; signals.push('webdriver'); }
    try {
      var docKeys = Object.keys(document);
      for (var k = 0; k < docKeys.length; k++) {
        if (/\$cdc_|chrome_asyncScriptInfo/.test(docKeys[k])) { score += 100; signals.push('chromedriver_artifact'); break; }
      }
    } catch(e) {}
    if (window.__playwright || window.__pwInitScripts || window.__playwright__binding__) { score += 100; signals.push('playwright'); }
    if (window.__puppeteer_evaluation_script__) { score += 100; signals.push('puppeteer'); }
    if (window.callPhantom || window._phantom) { score += 100; signals.push('phantomjs'); }
    if (document.getElementById('claude-agent-stop-container') || document.getElementById('claude-agent-animation-styles')) { score += 100; signals.push('claude_computer_use'); }
    try {
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) { var dbg = gl.getExtension('WEBGL_debug_renderer_info'); if (dbg) { var renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || ''; if (/SwiftShader|llvmpipe|Software Rasterizer|ANGLE \(None/i.test(renderer)) { score += 50; signals.push('software_renderer'); } } }
    } catch(e) {}
    var ua = UA_AT_LOAD;
    if (/Chrome/i.test(ua) && !(/Firefox|Safari/i.test(ua))) {
      var dm = navigator.deviceMemory;
      if (dm === undefined) { score += 50; signals.push('missing_device_memory'); }
      else if ([0.25,0.5,1,2,4,8].indexOf(dm) === -1) { score += 50; signals.push('invalid_device_memory'); }
    }
    try { var permStr = Function.prototype.toString.call(navigator.permissions.query); if (permStr.indexOf('[native code]') === -1) { score += 50; signals.push('patched_native_fn'); } } catch(e) {}
    var tier3 = 0;
    if (/Chrome/i.test(ua) && !(/Firefox/i.test(ua)) && navigator.plugins && navigator.plugins.length === 0) { tier3 += 25; signals.push('no_plugins'); }
    if (!navigator.languages || navigator.languages.length === 0) { tier3 += 25; signals.push('no_languages'); }
    if (/Chrome/i.test(ua) && !(/Firefox|Edge/i.test(ua)) && !window.chrome) { tier3 += 25; signals.push('no_chrome_object'); }
    if (window.screen && window.screen.availHeight === window.screen.height && window.screen.availWidth === window.screen.width) { tier3 += 25; signals.push('no_taskbar_gap'); }
    if (score > 0) score += tier3;
    return { score: score, signals: signals };
  }

  function detectVisitorType() {
    var ua = UA_AT_LOAD;
    for (var i = 0; i < AI_CRAWLER_PATTERNS.length; i++) {
      if (AI_CRAWLER_PATTERNS[i].test(ua)) return { type: 'ai_crawler', source: AI_CRAWLER_PATTERNS[i].toString().replace(/\//g,'').replace(/i$/,''), agent_score: 0, agent_signals: [] };
    }
    for (var b = 0; b < GENERIC_BOT_PATTERNS.length; b++) {
      if (GENERIC_BOT_PATTERNS[b].test(ua)) return { type: 'bot', source: GENERIC_BOT_PATTERNS[b].toString().replace(/\//g,'').replace(/i$/,''), agent_score: 0, agent_signals: ['named_crawler'] };
    }
    var referrer = document.referrer || '';
    for (var j = 0; j < AI_REFERRAL_DOMAINS.length; j++) {
      if (referrer.indexOf(AI_REFERRAL_DOMAINS[j]) !== -1) {
        var headlessUa = /HeadlessChrome/i.test(ua) || /Electron/i.test(ua);
        var fpAi = scoreAutomation();
        var aiSignals = fpAi.signals.slice();
        if (headlessUa) aiSignals.push('headless_ua');
        return { type: 'ai_referral', source: AI_REFERRAL_DOMAINS[j], agent_score: headlessUa && fpAi.score < 100 ? 100 : fpAi.score, agent_signals: aiSignals };
      }
    }
    if (/HeadlessChrome/i.test(ua) || /Electron/i.test(ua)) return { type: 'bot', source: 'headless_ua', agent_score: 100, agent_signals: ['headless_ua'] };
    var fp = scoreAutomation();
    if (fp.score >= 50) return { type: 'bot', source: fp.score >= 100 ? 'definitive_automation' : 'likely_automation', agent_score: fp.score, agent_signals: fp.signals };
    return { type: 'human', source: null, agent_score: 0, agent_signals: [] };
  }
  var UA_AT_LOAD = navigator.userAgent || '';
  var visitorInfo = detectVisitorType();

  function hasAnalyticsConsent() {
    if (!CONSENT_REQUIRED) return true;
    if (AI_CONSENT_EXEMPT &&
        (visitorInfo.type === 'ai_crawler' || visitorInfo.type === 'ai_agent' || visitorInfo.type === 'bot')) {
      return true;
    }
    var dataLayer = window.dataLayer || [];
    for (var i = dataLayer.length - 1; i >= 0; i--) {
      var entry = dataLayer[i];
      if (entry && entry[0] === 'consent' && entry[1] === 'update') return entry[2] && entry[2]['analytics_storage'] === 'granted';
    }
    return true;
  }

  function durableIdRefresh() {
    try {
      if (!window.fetch) return;
      var base = location.origin + '/wp-json/noma/v1/id?cb=';
      var getTried = false;
      function bust() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      }
      function viaGet() {
        if (getTried) return;
        getTried = true;
        try {
          fetch(base + bust(), {
            method: 'GET', credentials: 'same-origin', cache: 'no-store', keepalive: true
          })['catch'](function () {});
        } catch (e) {}
      }
      fetch(base + bust(), {
        method: 'POST', credentials: 'same-origin', cache: 'no-store', keepalive: true
      }).then(function (res) { if (!res || !res.ok) viaGet(); })['catch'](viaGet);
    } catch (e) {}
  }
  if (DURABLE_ID && isNewSession && hasAnalyticsConsent()) { durableIdRefresh(); }

  function loadTagConfig() {
    if (!CLIENT_ID) return;
    var key = '_ntcfg_' + CLIENT_ID;
    try {
      var cached = window.sessionStorage && sessionStorage.getItem(key);
      if (cached) { addLinkedDomains(JSON.parse(cached)); return; }
    } catch (e) {   }
    try {
      var configUrl = ENDPOINT.replace('/collect', '/tag-config') +
                      '?clid=' + encodeURIComponent(CLIENT_ID);
      fetch(configUrl, { method: 'GET', credentials: 'omit', mode: 'cors' })
        .then(function (res) { return res && res.ok ? res.json() : null; })
        .then(function (cfgRes) {
          if (!cfgRes || !cfgRes.linkedDomains) return;
          addLinkedDomains(cfgRes.linkedDomains);
          try { sessionStorage.setItem(key, JSON.stringify(cfgRes.linkedDomains)); } catch (e) {}
        })['catch'](function () {});
    } catch (e) {}
  }
  if (hasAnalyticsConsent()) { loadTagConfig(); }

  var engagedMs = 0, engagedSince = document.visibilityState !== 'hidden' ? Date.now() : null;
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { if (engagedSince !== null) { engagedMs += Date.now() - engagedSince; engagedSince = null; } }
    else { engagedSince = Date.now(); }
  });
  function getEngagedSeconds() { var total = engagedMs; if (engagedSince !== null) total += Date.now() - engagedSince; return Math.round(total / 1000); }

  var maxScrollDepth = 0, pageLoadTime = Date.now();
  function updateScrollDepth() {
    var scrolled = window.scrollY || window.pageYOffset || 0;
    var docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight) - window.innerHeight;
    var depth = docHeight > 0 ? Math.round((scrolled / docHeight) * 100) : 0;
    if (depth > maxScrollDepth) maxScrollDepth = depth;
  }
  window.addEventListener('scroll', updateScrollDepth, { passive: true });

  var webVitals = {}, vitalsFired = false;
  function observeVital(type, cb) {
    try { if (!window.PerformanceObserver) return; var po = new PerformanceObserver(function(list) { var entries = list.getEntries(); cb(entries[entries.length - 1]); }); po.observe({ type: type, buffered: true }); } catch(e) {}
  }
  observeVital('largest-contentful-paint', function(e) { webVitals.lcp = Math.round(e.startTime); });
  var clsValue = 0;
  try { if (window.PerformanceObserver) { var clsObs = new PerformanceObserver(function(list) { list.getEntries().forEach(function(e) { if (!e.hadRecentInput) clsValue += e.value; }); webVitals.cls = Math.round(clsValue * 1000) / 1000; }); clsObs.observe({ type: 'layout-shift', buffered: true }); } } catch(e) {}
  observeVital('event', function(e) { if (e.duration > (webVitals.inp || 0)) webVitals.inp = Math.round(e.duration); });
  observeVital('paint', function(e) { if (e.name === 'first-contentful-paint') webVitals.fcp = Math.round(e.startTime); });
  try { var navEntries = performance && performance.getEntriesByType && performance.getEntriesByType('navigation'); if (navEntries && navEntries.length > 0) webVitals.ttfb = Math.round(navEntries[0].responseStart); } catch(e) {}
  function fireWebVitals() { if (vitalsFired || !Object.keys(webVitals).length) return; vitalsFired = true; send('web_vitals', webVitals); }

  var formsSeen = {};

  function getFormId(form) {
    return form.id || form.name || form.action || 'form_' + Array.prototype.indexOf.call(document.forms, form);
  }

  document.addEventListener('focusin', function (e) {
    var form = e.target && e.target.form;
    if (!form) return;
    var fid = getFormId(form);
    if (formsSeen[fid]) return;
    formsSeen[fid] = true;
    send('form_start', {
      form_id:   form.id   || '',
      form_name: form.name || '',
      form_action: form.action || ''
    });
  }, true);

  var formSubmitSeen = {};
  var FORM_DEDUPE_MS = 10000;

  var stackSubmitSeen = {};
  var STACK_DEDUPE_MS = 3000;

  var ENQUIRY_STACKS = ['cognito', 'wpcf7', 'fluentform', 'elementor', 'gform', 'wpforms',
                        'ninja', 'formidable', 'hubspot'];

  var ENQUIRY_STACK_SIGS = ['gform_', 'wpcf7', 'fluentform', 'elementor-form',
                            'wpforms-form', 'nf-form', 'frm_form_', 'hs-form'];

  var SUBSCRIBE_WORDS = ['subscribe', 'subscription', 'newsletter', 'mailing list',
                         'email list', 'mailchimp', 'mc4wp', 'klaviyo',
                         'opt-in', 'optin'];
  var SUBSCRIBE_PATHS = ['newsletter', 'subscribe', 'email-opt-in', 'mailing-list'];

  function containsAny(hay, needles) {
    for (var i = 0; i < needles.length; i++) {
      if (hay.indexOf(needles[i]) > -1) return true;
    }
    return false;
  }

  function formQuery(form, selector) {
    try { return !!(form && form.querySelector && form.querySelector(selector)); }
    catch (e) { return false; }
  }

  function normalisedPath() {
    var p = (location.pathname || '').toLowerCase();
    if (p.charAt(0) !== '/') p = '/' + p;
    if (p.charAt(p.length - 1) !== '/') p = p + '/';
    return p;
  }

  function classifyFormKind(fid, fname, faction, via, form, label) {
    try {
      var cls = (form && typeof form.className === 'string') ? form.className : '';
      var sig = (String(fid || '') + ' ' + String(fname || '') + ' ' + cls + ' ' +
                 String(faction || '')).toLowerCase();
      var lbl = String(label || '').toLowerCase();
      var path = normalisedPath();

      if (formQuery(form, 'input[type="search"]')) return 'search';
      if (form && form.getAttribute && form.getAttribute('role') === 'search') return 'search';
      if (sig.indexOf('search') > -1) return 'search';

      if (formQuery(form, 'input[autocomplete="cc-number"]')) return 'payment';
      if (containsAny(sig, ['eway_credit_card_form', 'order_review', '/checkout/order-pay/'])) return 'payment';
      if (path.indexOf('/checkout/order-pay/') > -1) return 'payment';

      if (containsAny(sig, SUBSCRIBE_WORDS)) return 'subscribe';
      if (lbl && containsAny(lbl, SUBSCRIBE_WORDS)) return 'subscribe';
      if (containsAny(path, SUBSCRIBE_PATHS)) return 'subscribe';

      if (sig.indexOf('pwgc-redeem-form') > -1) return 'checkout';
      if (String(fname || '').toLowerCase() === 'checkout') return 'checkout';
      if (containsAny(sig + ' ' + path, ['/checkout/', '/cart/', '/product/'])) return 'checkout';

      if (via && ENQUIRY_STACKS.indexOf(via) > -1) return 'enquiry';
      if (containsAny(sig, ENQUIRY_STACK_SIGS)) return 'enquiry';
      if (containsAny(sig, ['contact form', 'contact-form',
                            'request a quote', 'request-a-quote'])) return 'enquiry';
      if (containsAny(path, ['/contact/', '/contacts/', '/get-a-quote/', '/booking/'])) return 'enquiry';

      return 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }

  var LABEL_MAX = 80;

  function collapseWhitespace(s) {
    var out = '', prevWasSpace = false;
    for (var i = 0; i < s.length; i++) {
      var code = s.charCodeAt(i);
      var isWs = (code === 32 || (code >= 9 && code <= 13));
      if (isWs) { if (!prevWasSpace && out) out += ' '; prevWasSpace = true; }
      else { out += s.charAt(i); prevWasSpace = false; }
    }
    return out.trim();
  }

  function labelTextOf(el) {
    if (!el) return '';
    return collapseWhitespace(String(el.innerText || el.textContent || '')).slice(0, LABEL_MAX);
  }

  function isInformativeLabel(v) {
    var s = collapseWhitespace(String(v || ''));
    if (s.length < 2) return false;
    return !/^[0-9]+$/.test(s);
  }

  function headingAboveForm(form) {
    var node = form, hops = 0;
    while (node && node.nodeType === 1 && hops < 6) {
      var prev = node.previousElementSibling, guard = 0;
      while (prev && guard < 10) {
        if (/^H[1-4]$/.test(prev.tagName || '')) {
          var direct = labelTextOf(prev);
          if (direct) return direct;
        }
        if (prev.querySelector) {
          var nested = prev.querySelector('h1, h2, h3, h4');
          if (nested) {
            var t = labelTextOf(nested);
            if (t) return t;
          }
        }
        prev = prev.previousElementSibling;
        guard++;
      }
      node = node.parentElement;
      hops++;
    }
    return '';
  }

  function formLabel(form, explicit) {
    try {
      if (isInformativeLabel(explicit)) return collapseWhitespace(explicit).slice(0, LABEL_MAX);
      if (!form) return '';
      if (form.querySelector) {
        var legend = form.querySelector('legend');
        if (legend) {
          var lt = labelTextOf(legend);
          if (isInformativeLabel(lt)) return lt;
        }
      }
      var attr = form.getAttribute ? function (n) { return form.getAttribute(n); } : function () { return null; };
      if (isInformativeLabel(attr('aria-label'))) return collapseWhitespace(attr('aria-label')).slice(0, LABEL_MAX);
      if (isInformativeLabel(form.name)) return collapseWhitespace(form.name).slice(0, LABEL_MAX);
      var lb = attr('aria-labelledby');
      if (lb && document.getElementById) {
        var t2 = labelTextOf(document.getElementById(lb));
        if (isInformativeLabel(t2)) return t2;
      }
      var h = headingAboveForm(form);
      if (isInformativeLabel(h)) return h;
      if (form.querySelector) {
        var btn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (btn) {
          var bt = labelTextOf(btn) ||
                   collapseWhitespace(String((btn.getAttribute && btn.getAttribute('aria-label')) || btn.value || ''));
          if (isInformativeLabel(bt)) return bt.slice(0, LABEL_MAX);
        }
      }
      return '';
    } catch (e) {
      return '';
    }
  }

  var SEARCH_TERMS_MAX_CHARS = 100;
  var SEARCH_TERMS_MAX_WORDS = 12;
  var SEARCH_INPUT_NAMES = ['s', 'q', 'query', 'search', 'search_query', 'searchterm',
                            'search_term', 'keyword', 'keywords', 'term'];
  var SEARCH_DROP_CODES = [34, 60, 62, 92, 96, 123, 125, 91, 93, 124, 94];
  var SEARCH_NUMBER_PUNCT_CODES = [43, 45, 46, 40, 41, 47];

  function searchDigitCount(w) {
    var n = 0;
    for (var i = 0; i < w.length; i++) {
      var c = w.charCodeAt(i);
      if (c >= 48 && c <= 57) n++;
    }
    return n;
  }

  function searchNumberLike(w) {
    if (!searchDigitCount(w)) return false;
    for (var i = 0; i < w.length; i++) {
      var c = w.charCodeAt(i);
      if (!(c >= 48 && c <= 57) && SEARCH_NUMBER_PUNCT_CODES.indexOf(c) < 0) return false;
    }
    return true;
  }

  function cleanSearchTerms(raw) {
    try {
      if (typeof raw !== 'string' && typeof raw !== 'number') return '';
      var text = String(raw).slice(0, 500);
      var words = [], cur = '';
      for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c === 32 || (c >= 9 && c <= 13) || c === 160 || c === 12288) {
          if (cur) words.push(cur);
          cur = '';
          continue;
        }
        if (c < 32 || c === 127 || SEARCH_DROP_CODES.indexOf(c) > -1) continue;
        cur += text.charAt(i);
      }
      if (cur) words.push(cur);
      var keep = [];
      for (var k = 0; k < words.length; k++) {
        keep.push(words[k].indexOf('@') < 0 && searchDigitCount(words[k]) < 6);
      }
      var a = 0;
      while (a < words.length) {
        if (!searchNumberLike(words[a])) { a++; continue; }
        var b = a, digits = 0;
        while (b < words.length && searchNumberLike(words[b])) { digits += searchDigitCount(words[b]); b++; }
        if (digits >= 6) { for (var d = a; d < b; d++) keep[d] = false; }
        a = b;
      }
      var kept = [];
      for (var m = 0; m < words.length && kept.length < SEARCH_TERMS_MAX_WORDS; m++) {
        if (keep[m]) kept.push(words[m]);
      }
      var out = kept.join(' ');
      if (out.length > SEARCH_TERMS_MAX_CHARS) {
        var cut = out.slice(0, SEARCH_TERMS_MAX_CHARS + 1);
        var sp = cut.lastIndexOf(' ');
        out = sp > 0 ? cut.slice(0, sp) : out.slice(0, SEARCH_TERMS_MAX_CHARS);
      }
      return out;
    } catch (e) {
      return '';
    }
  }

  function usableSearchInput(el) {
    if (!el) return false;
    var t = String((el.getAttribute && el.getAttribute('type')) || el.type || 'text').toLowerCase();
    return t === 'search' || t === 'text';
  }

  function searchInputOf(form) {
    try {
      if (!form || !form.querySelector) return null;
      var el = form.querySelector('input[type="search"]');
      if (usableSearchInput(el)) return el;
      for (var i = 0; i < SEARCH_INPUT_NAMES.length; i++) {
        el = form.querySelector('input[name="' + SEARCH_INPUT_NAMES[i] + '"]');
        if (usableSearchInput(el)) return el;
      }
      el = form.querySelector('input[type="text"], input:not([type])');
      return usableSearchInput(el) ? el : null;
    } catch (e) {
      return null;
    }
  }

  function searchTermsOf(form) {
    var el = searchInputOf(form);
    return el ? cleanSearchTerms(el.value) : '';
  }

  function emitFormSubmit(fid, fname, faction, fmethod, via, form) {
    var key = fid || fname || faction || 'form';
    var t = Date.now();
    if (formSubmitSeen[key] && (t - formSubmitSeen[key]) < FORM_DEDUPE_MS) return;
    if (via && stackSubmitSeen[via] && (t - stackSubmitSeen[via]) < STACK_DEDUPE_MS) return;
    formSubmitSeen[key] = t;
    if (via) stackSubmitSeen[via] = t;
    var cleanName = isInformativeLabel(fname) ? String(fname) : '';
    var label = formLabel(form, fname);
    var kind = classifyFormKind(fid, fname, faction, via, form, label);
    markSubmitAttempt(label, kind);
    var submitData = {
      form_id:     fid || '',
      form_name:   cleanName,
      form_label:  label,
      form_action: faction || '',
      form_method: (fmethod || 'POST').toUpperCase(),
      capture_via: via,
      form_kind:   kind
    };
    if (kind === 'search') {
      var terms = searchTermsOf(form);
      if (terms) submitData.search_terms = terms;
    }
    send('form_submit', submitData);
  }

  function formHasClass(el, cls) {
    return !!(el && typeof el.className === 'string' &&
      (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1);
  }

  function ajaxStackOwner(form) {
    if (formHasClass(form, 'wpcf7-form')) return 'wpcf7';
    if (formHasClass(form, 'elementor-form')) return 'elementor';
    if (formHasClass(form, 'frm-fluent-form')) return 'fluentform';
    if (formHasClass(form, 'wpforms-form') &&
        formHasClass(form, 'wpforms-ajax-form')) return 'wpforms';
    if (form.id && form.id.indexOf('gform_') === 0 &&
        typeof form.target === 'string' &&
        form.target.indexOf('gform_ajax_frame') === 0) return 'gform';
    return '';
  }

  document.addEventListener('submit', function (e) {
    var form = e.target || e.srcElement;
    if (!form || !form.tagName || form.tagName !== 'FORM') return;
    try {
      var attemptLabel = formLabel(form, form.name);
      markSubmitAttempt(attemptLabel, classifyFormKind(form.id, form.name, form.action, 'native', form, attemptLabel));
    } catch (err) {   }
    if (ajaxStackOwner(form)) return;
    emitFormSubmit(form.id, form.name, form.action, form.method || 'get', 'native', form);
  }, true);

  document.addEventListener('wpcf7mailsent', function (e) {
    var d = e.detail || {};
    var t = e.target;
    var form = t && t.tagName === 'FORM' ? t : (t && t.querySelector ? t.querySelector('form') : null);
    emitFormSubmit(
      (form && form.id) || 'wpcf7-' + (d.contactFormId || ''),
      (form && form.name) || '',
      (form && form.action) || '',
      'POST', 'wpcf7', form);
  }, false);

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && d.type === 'hsFormCallback' && d.eventName === 'onFormSubmitted') {
      emitFormSubmit('hsform-' + (d.id || ''), '', '', 'POST', 'hubspot');
    }
  }, false);
  window.addEventListener('hs-form-event:on-submission:success', function (e) {
    var d = (e && e.detail) || {};
    emitFormSubmit('hsform-' + (d.formId || ''), '', '', 'POST', 'hubspot');
  }, false);

  var cognitoTries = 0;
  function bindCognitoForms() {
    var C = window.Cognito;
    if (!C || typeof C.on !== 'function') {
      if (++cognitoTries < 40) setTimeout(bindCognitoForms, 250);
      return;
    }
    try {
      C.on('afterSubmit', function (e) {
        var entry = (e && e.data && e.data.entry) || {};
        var form = entry.Form || {};
        emitFormSubmit('cognito-' + (form.Id || form.InternalName || ''),
          form.Name || '', '', 'POST', 'cognito', null);
      });
    } catch (err) {   }
  }
  bindCognitoForms();

  var CALENDLY_EVENTS = {
    'calendly.event_scheduled':        'booking_complete',
    'calendly.date_and_time_selected': 'booking_step',
    'calendly.event_type_viewed':      'booking_step'
  };
  var calendlyBooked = false;
  function isCalendlyOrigin(origin) {
    if (!origin) return false;
    var h = String(origin).replace('https://', '').replace('http://', '');
    h = h.split('/')[0].split(':')[0].toLowerCase();
    return h === 'calendly.com' || h.slice(-13) === '.calendly.com';
  }
  window.addEventListener('message', function (e) {
    if (!isCalendlyOrigin(e.origin)) return;
    var d = e.data;
    if (!d || typeof d.event !== 'string') return;
    var name = CALENDLY_EVENTS[d.event];
    if (!name) return;
    if (name === 'booking_complete') { if (calendlyBooked) return; calendlyBooked = true; }
    var payload = d.payload || {};
    send(name, {
      provider: 'calendly',
      step: d.event.replace('calendly.', ''),
      booking_uri: (payload.event && payload.event.uri) || '',
      invitee_uri: (payload.invitee && payload.invitee.uri) || ''
    });
  }, false);

  var jqFormHooksBound = false;
  function bindJQueryFormHooks() {
    if (jqFormHooksBound) return;
    var $ = window.jQuery;
    if (!$ || !$.fn || !$.fn.on) return;
    jqFormHooksBound = true;
    var $doc = $(document);

    $doc.on('submit', function (event) {
      var form = event.target;
      if (!form || form.tagName !== 'FORM') return;
      if (ajaxStackOwner(form)) return;
      emitFormSubmit(form.id, form.name, form.action, form.method || 'get', 'jquery', form);
    });

    $doc.on('gform_confirmation_loaded', function (event, formId) {
      emitFormSubmit('gform_' + formId, '', '', 'POST', 'gform');
    });

    $doc.on('wpformsAjaxSubmitSuccess', function (event) {
      var form = event && event.target;
      emitFormSubmit(
        (form && form.id) || 'wpforms',
        (form && form.name) || '', (form && form.action) || '', 'POST', 'wpforms', form);
    });

    $doc.on('nfFormSubmitResponse', function (event, data) {
      var fid = data && data.id;
      var errors = data && data.response && data.response.errors;
      if (errors && (errors.length ||
          (errors.fields && Object.keys(errors.fields).length) ||
          (errors.form && Object.keys(errors.form).length))) return;
      emitFormSubmit('nf-form-' + (fid || ''), '', '', 'POST', 'ninja');
    });

    $doc.on('fluentform_submission_success', function (event, data) {
      var form = data && data.form && data.form[0] ? data.form[0] : null;
      emitFormSubmit(
        (form && form.id) || 'fluentform',
        (form && form.getAttribute && form.getAttribute('data-form_id')) || '',
        (form && form.action) || '', 'POST', 'fluentform', form);
    });

    $doc.on('frmFormComplete', function (event, form) {
      var el = form && form[0] ? form[0] : form;
      emitFormSubmit(
        (el && el.id) || 'frm-form', (el && el.name) || '',
        (el && el.action) || '', 'POST', 'formidable', el);
    });

    $doc.on('submit_success', function (event) {
      var form = event && event.target;
      if (!form || !formHasClass(form, 'elementor-form')) return;
      emitFormSubmit(
        form.id || 'elementor-form',
        form.getAttribute('name') || '', form.action || '', 'POST', 'elementor', form);
    });
  }
  bindJQueryFormHooks();
  if (!jqFormHooksBound) {
    document.addEventListener('DOMContentLoaded', bindJQueryFormHooks);
    window.addEventListener('load', bindJQueryFormHooks);
    setTimeout(bindJQueryFormHooks, 2000);
    setTimeout(bindJQueryFormHooks, 6000);
  }

  var DOWNLOAD_EXTENSIONS = /\.(pdf|xlsx?|docx?|pptx?|csv|txt|rtf|zip|gz|rar|7z|exe|dmg|pkg|mp4|mov|avi|mp3|wav|wmv)(\?|$)/i;
  document.addEventListener('click', function(e) {
    var el = e.target; while (el && el.tagName !== 'A') el = el.parentElement;
    if (!el || !el.href || !DOWNLOAD_EXTENSIONS.test(el.href)) return;
    var parts = el.href.split('/'), filename = parts[parts.length - 1].split('?')[0], extMatch = filename.match(/\.([^.]+)$/);
    send('file_download', { url: el.href, filename: filename, extension: extMatch ? extMatch[1].toLowerCase() : '', link_text: (el.innerText || el.textContent || '').slice(0, 100).trim() });
  }, true);

  document.addEventListener('click', function(e) {
    var el = e.target; while (el && el.tagName !== 'A') el = el.parentElement;
    if (!el || !el.href) return;
    if (el.href.indexOf('tel:') === 0) {
      send('phone_call_click', { phone_number: el.href.replace('tel:', '').trim(), link_text: (el.innerText || el.textContent || '').slice(0, 100).trim() });
    }
  }, true);

  function nearestAnchor(el) {
    var node = el, hops = 0;
    while (node && node.nodeType === 1 && hops < 25) {
      if (node.tagName === 'A') return node;
      node = node.parentElement; hops++;
    }
    return null;
  }
  function hrefHost(href) {
    if (!href || href.indexOf('http') !== 0) return '';
    return String(href).replace('https://', '').replace('http://', '')
      .split('/')[0].split('?')[0].split(':')[0].toLowerCase();
  }
  function isOutboundHref(href) {
    var h = hrefHost(href);
    return !!h && h !== String(location.hostname || '').toLowerCase();
  }
  var bookingIntentEvent = null;

  var ROLE_TAGS = { NAV: 'nav', HEADER: 'header', FOOTER: 'footer',
                    MAIN: 'main', ASIDE: 'aside', DIALOG: 'dialog' };
  var ARIA_ROLES = { navigation: 'nav', banner: 'header', contentinfo: 'footer',
                     main: 'main', complementary: 'aside',
                     dialog: 'dialog', alertdialog: 'dialog' };
  var BUTTON_TOKENS = ['btn', 'button', 'cta', 'elementor-button',
                       'wp-block-button', 'wp-element-button'];
  var PROSE_PARENTS = { P: 1, LI: 1, SPAN: 1, TD: 1, BLOCKQUOTE: 1, EM: 1, STRONG: 1 };

  function hasToken(hay, tokens) {
    for (var i = 0; i < tokens.length; i++) {
      if (hay.indexOf(tokens[i]) > -1) return true;
    }
    return false;
  }

  function ancestorRole(el) {
    var node = el, hops = 0;
    while (node && node.nodeType === 1 && hops < 25) {
      if (ROLE_TAGS[node.tagName]) return ROLE_TAGS[node.tagName];
      var r = ((node.getAttribute && node.getAttribute('role')) || '').toLowerCase();
      if (ARIA_ROLES[r]) return ARIA_ROLES[r];
      node = node.parentElement;
      hops++;
    }
    return 'unknown';
  }

  function inProse(el) {
    if (!el || el.tagName !== 'A') return false;
    var cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
    if (hasToken(cls, BUTTON_TOKENS)) return false;
    if (el.getAttribute && el.getAttribute('role') === 'button') return false;
    var p = el.parentElement;
    if (!p || !PROSE_PARENTS[p.tagName]) return false;
    var linkText = String(el.innerText || el.textContent || '').trim();
    var parentText = String(p.innerText || p.textContent || '').trim();
    return parentText.length > linkText.length + 20;
  }

  function aboveFold(el) {
    if (!el || !el.getBoundingClientRect) return null;
    var vh = window.innerHeight || 0;
    if (!vh) return null;
    var top = el.getBoundingClientRect().top + (window.pageYOffset || 0);
    return top < vh;
  }

  function subtypeEvidence(el) {
    try {
      return { ancestor_role: ancestorRole(el), in_prose: inProse(el), above_fold: aboveFold(el) };
    } catch (e) {
      return { ancestor_role: 'unknown', in_prose: false, above_fold: null };
    }
  }

  var BOOKING_PATTERN = /\b(book|booking|schedule|appointment|reserve|reservation|enquire|enquiry|get.?started|contact.?us)\b/i;
  var NAV_CONTEXT_PATTERN = /(^|[^a-z0-9])(nav|menu|menubar|accordion|faq|tab|tabs|dropdown|breadcrumb)([^a-z0-9]|$)/i;
  function bookingHaystack(el) {
    return [el.id||'', (typeof el.className === 'string' ? el.className : ''), (el.getAttribute && el.getAttribute('data-action'))||'', (el.getAttribute && el.getAttribute('data-event'))||'', (el.getAttribute && el.getAttribute('aria-label'))||'', (el.innerText||el.textContent||'').slice(0,80)].join(' ');
  }
  function isInteractiveEl(el) {
    var tag = el.tagName;
    if (tag === 'A' || tag === 'BUTTON') return true;
    if (el.getAttribute && el.getAttribute('role') === 'button') return true;
    if (tag === 'INPUT') { var t = (el.type||'').toLowerCase(); return t === 'submit' || t === 'button' || t === 'image'; }
    return false;
  }
  function isFormControl(el) {
    var tag = el.tagName;
    if (tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'OPTION' || tag === 'LABEL') return true;
    if (tag === 'INPUT') { var t = (el.type||'').toLowerCase(); return t !== 'submit' && t !== 'button' && t !== 'image'; }
    return false;
  }
  function inNavContext(el) {
    var node = el, hops = 0;
    while (node && node.nodeType === 1 && hops < 25) {
      if (node.tagName === 'NAV') return true;
      var role = (node.getAttribute && node.getAttribute('role')) || '';
      if (/^(navigation|menu|menubar|menuitem|tab|tablist)$/i.test(role)) return true;
      var idcls = (node.id||'') + ' ' + (typeof node.className === 'string' ? node.className : '');
      if (NAV_CONTEXT_PATTERN.test(idcls)) return true;
      node = node.parentElement; hops++;
    }
    return false;
  }
  document.addEventListener('click', function(e) {
    var el = e.target || e.srcElement;
    if (!el || el.nodeType !== 1) return;
    var node = el, interactive = null, hops = 0;
    while (node && node.nodeType === 1 && hops < 25) {
      if (isInteractiveEl(node)) { interactive = node; break; }
      node = node.parentElement; hops++;
    }
    var subject = interactive || el;
    if (!BOOKING_PATTERN.test(bookingHaystack(subject)) && !(subject !== el && BOOKING_PATTERN.test(bookingHaystack(el)))) return;
    var excluded = '';
    if (!interactive) { excluded = (isFormControl(el) || el.form) ? 'form_control' : 'not_interactive'; }
    else if (interactive.getAttribute && interactive.getAttribute('aria-expanded') !== null) { excluded = 'disclosure_toggle'; }
    else if (inNavContext(interactive)) { excluded = 'nav_context'; }
    var data = { element_id: subject.id||'', element_tag: (subject.tagName||'').toLowerCase(), element_text: (subject.innerText||subject.textContent||'').slice(0,100).trim(), element_class: (typeof subject.className === 'string' ? subject.className : '').slice(0,100) };
    if (excluded) data.excluded_by = excluded;
    var ev = subtypeEvidence(subject);
    data.ancestor_role = ev.ancestor_role;
    data.in_prose      = ev.in_prose;
    if (ev.above_fold !== null) data.above_fold = ev.above_fold;
    if (!excluded) {
      var anchor = nearestAnchor(el);
      if (anchor && isOutboundHref(anchor.href)) { bookingIntentEvent = e; return; }
    }
    send(excluded ? 'ui_click' : 'schedule', data);
  }, true);

  var ECOM_EVENTS = { view_item: 1, add_to_cart: 1, begin_checkout: 1, add_payment_info: 1, purchase: 1 };
  (function() {
    function fwdEcom(msg) {
      if (!msg || typeof msg !== 'object' || !ECOM_EVENTS[msg.event]) return;
      var ec = msg.ecommerce || {}, items = ec.items || [];
      send(msg.event, {
        value:          ec.value          != null ? ec.value          : (msg.value != null ? msg.value : ''),
        currency:       ec.currency       || msg.currency       || '',
        transaction_id: ec.transaction_id || msg.transaction_id || '',
        items: items.map(function(it) { return { item_id: it.item_id||it.id||'', item_name: it.item_name||it.name||'', price: it.price != null ? it.price : '', quantity: it.quantity != null ? it.quantity : 1 }; })
      });
    }
    var dl = window.dataLayer = window.dataLayer || [];
    for (var i = 0; i < dl.length; i++) fwdEcom(dl[i]);
    var origPush = dl.push.bind(dl);
    dl.push = function() { var r = origPush.apply(this, arguments); for (var j = 0; j < arguments.length; j++) fwdEcom(arguments[j]); return r; };
  }());

  var recentClicks = [];
  document.addEventListener('click', function(e) {
    var t = Date.now(); recentClicks.push({ x: e.clientX, y: e.clientY, t: t });
    recentClicks = recentClicks.filter(function(c) { return t - c.t <= 1000; });
    if (recentClicks.length >= 3) {
      var first = recentClicks[0];
      var allClose = recentClicks.every(function(c) { var dx = c.x - first.x, dy = c.y - first.y; return Math.sqrt(dx*dx + dy*dy) <= 30; });
      if (allClose) { var el = e.target || e.srcElement; send('rage_click', { x: e.clientX, y: e.clientY, tag: el ? el.tagName : '', text: el ? (el.innerText || el.textContent || '').slice(0,100).trim() : '', click_count: recentClicks.length }); recentClicks = []; }
    }
  }, true);

  var errorsSeen = {}, errorCount = 0;
  window.addEventListener('error', function(e) {
    if (errorCount >= 5) return; var key = (e.message||'') + ':' + (e.filename||'') + ':' + (e.lineno||0);
    if (errorsSeen[key]) return; errorsSeen[key] = true; errorCount++;
    send('js_error', { message: String(e.message||'').slice(0,300), filename: String(e.filename||'').slice(0,300), lineno: e.lineno||0, colno: e.colno||0, stack: e.error && e.error.stack ? String(e.error.stack).slice(0,1000) : '' });
  });
  window.addEventListener('unhandledrejection', function(e) {
    if (errorCount >= 5) return; var msg = e.reason ? String(e.reason.message||e.reason).slice(0,300) : 'unhandled_rejection';
    var key = 'rejection:' + msg; if (errorsSeen[key]) return; errorsSeen[key] = true; errorCount++;
    send('js_error', { message: msg, filename: '', lineno: 0, colno: 0, stack: e.reason && e.reason.stack ? String(e.reason.stack).slice(0,1000) : '' });
  });

  var clicks = [];


  document.addEventListener('click', function(e) {
    var target = e.target || e.srcElement;
    var el = nearestAnchor(target);
    var href = (el && el.href) ? el.href : (target.href || null);
    var isOutbound = isOutboundHref(href);
    clicks.push({ x: e.clientX, y: e.clientY, tag: target.tagName, href: href, t: Date.now() - pageLoadTime });

    if (isOutbound && el && LINKED_DOMAINS.length && isLinkedDomain(hrefHost(href)) &&
        hasAnalyticsConsent()) {
      try {
        if (el.href.indexOf(LINK_PARAM + '=') === -1) {
          var linkPayload = encodeURIComponent(JSON.stringify({
            u: uid, t: Date.now(), f: linkFingerprint(), m: firstTouchData || null
          }));
          el.href = el.href + (el.href.indexOf('?') > -1 ? '&' : '?') + LINK_PARAM + '=' + linkPayload;
          href = el.href;
        }
      } catch (err) {   }
    }

    if (isOutbound) {
      var outData = { url: href, text: el ? (el.innerText || el.textContent || '').slice(0,100).trim() : '' };
      if (bookingIntentEvent === e) { outData.booking_intent = true; bookingIntentEvent = null; }
      send('outbound_click', outData);
    }
  });

  function buildPayload(eventName, extras) {
    var screen = window.screen || {};
    return {
      uid: uid, clid: CLIENT_ID,
      session_start: sessionStart, session_number: sessionNumber, session_hit: hitNumber,
      session_duration: Math.round((Date.now() - sessionStart) / 1000), last_hit: lastHit,
      url: location.href, hostname: location.hostname, path: location.pathname,
      title: document.title, referrer: pageChangeReferrer || document.referrer || '',
      utm_source: utmSource||'', utm_medium: utmMedium||'', utm_campaign: utmCampaign||'',
      utm_content: utmContent||'', utm_term: utmTerm||'',
      gclid: gclid||'', fbclid: fbclid||'', msclkid: msclkid||'',
      ttclid: ttclid||'', twclid: twclid||'', li_fat_id: li_fat_id||'',
      search_engine: referrerInfo.search_engine, organic_keyword: referrerInfo.organic_keyword,
      referrer_status: referrerStatus,
      referrer_hostname: sessionRefHost || '',
      first_utm_source: firstTouchData ? firstTouchData.s || '' : '',
      first_utm_medium: firstTouchData ? firstTouchData.m || '' : '',
      first_utm_campaign: firstTouchData ? firstTouchData.c || '' : '',
      first_click_id_type: firstTouchData ? firstTouchData.k || '' : '',
      first_referrer_hostname: firstTouchData ? firstTouchData.r || '' : '',
      first_referrer_status: firstTouchData ? firstTouchData.rs || '' : '',
      first_touch_at: firstTouchData ? Number(firstTouchData.t) || 0 : 0,
      user_agent: UA_AT_LOAD, language: navigator.language||'',
      screen_w: screen.availWidth||screen.width||0, screen_h: screen.availHeight||screen.height||0,
      viewport_w: window.innerWidth||0, viewport_h: window.innerHeight||0,
      timezone: Intl && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : '',
      scroll_depth: maxScrollDepth, time_on_page: Math.round((Date.now() - pageLoadTime) / 1000),
      engaged_time: getEngagedSeconds(), clicks: clicks.slice(-10),
      visitor_type: visitorInfo.type, ai_source: visitorInfo.source||'',
      agent_score: visitorInfo.agent_score||0, agent_signals: visitorInfo.agent_signals||[],
      event: eventName||'pageview', timestamp: Date.now(), data: extras||{}
    };
  }

  function send(eventName, extras) {
    if (document.prerendering) return;
    if (!hasAnalyticsConsent()) return;
    if (!CLIENT_ID) { console.warn('[Nomaintel] clientId not set — tag will not fire'); return; }
    if (eventName === 'purchase') ecomPurchaseSent = true;
    touchSession();
    var payload = buildPayload(eventName, extras);
    if (getCookie('_mdrl') === '1' && payload.data && typeof payload.data === 'object') { payload.data.di = 1; }
    if (payload.data && typeof payload.data === 'object' && (navigator.userAgent || '') !== UA_AT_LOAD) { payload.data.uam = 1; }
    payload.tag_version = TAG_VERSION;
    if (isInternalDevice()) payload.internal = 1;
    if (eventName === 'pageview' && payload.data && typeof payload.data === 'object') {
      var priorSubmit = takeSubmitMarker();
      if (priorSubmit) {
        payload.data.prior_submit_ms = priorSubmit.ms;
        payload.data.prior_submit_label = priorSubmit.label;
        payload.data.prior_submit_kind = priorSubmit.kind;
      }
    }
    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) { navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' })); }
    else { var xhr = new XMLHttpRequest(); xhr.open('POST', ENDPOINT, true); xhr.setRequestHeader('Content-Type', 'application/json'); xhr.send(body); }
  }

  window.meerkat = { track: function(n, d) { send(n, d||{}); }, pageview: function() { send('pageview'); } };


  var ecomPurchaseSent = false;

  function wooOrderId() {
    var p = String(location.pathname || '');
    var mark = '/order-received/';
    var i = p.indexOf(mark);
    if (i === -1) return '';
    var id = p.slice(i + mark.length).split('/')[0].split('?')[0];
    if (!id) return '';
    for (var k = 0; k < id.length; k++) {
      var c = id.charAt(k);
      if (c < '0' || c > '9') return '';
    }
    return id;
  }

  function parseAmount(s) {
    var out = '', seenDot = false;
    s = String(s || '');
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c >= '0' && c <= '9') out += c;
      else if (c === '.' && !seenDot) { out += c; seenDot = true; }
    }
    if (!out) return null;
    var n = parseFloat(out);
    return isFinite(n) ? n : null;
  }

  function wooText(selector) {
    try {
      var n = document.querySelector(selector);
      return n ? String(n.innerText || n.textContent || '').trim() : '';
    } catch (e) { return ''; }
  }

  function emitWooPurchase() {
    try {
      if (ecomPurchaseSent) return;
      var orderId = wooOrderId();
      if (!orderId) return;
      var overview = document.querySelector('.woocommerce-order-overview, .woocommerce-thankyou-order-details, .order_details');
      if (!overview) return;

      var key = '_nwoo_' + orderId;
      try {
        if (window.sessionStorage && sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
      } catch (e) {   }

      var totalText = wooText('.woocommerce-order-overview__total .woocommerce-Price-amount') ||
                      wooText('.woocommerce-order-overview__total strong') ||
                      wooText('.order_details .total .amount') ||
                      wooText('.order_details .total');
      var value = parseAmount(totalText);
      var currency = wooText('.woocommerce-order-overview__total .woocommerce-Price-currencySymbol');

      send('purchase', {
        value:          value === null ? '' : value,
        currency:       currency || '',
        transaction_id: orderId,
        items:          [],
        source:         'woocommerce_order_received'
      });
    } catch (e) {   }
  }

  whenActivated(function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', emitWooPurchase);
    } else {
      emitWooPurchase();
    }
  });

  var startSeenAt = {};
  var dappleOpenedAt = {};
  var dappleStarted = {};
  var lastGestureAt = 0;
  var wooAtcAt = {};
  var WOO_STANDDOWN_MS = 10000;
  var CHECKOUT_REPEAT_MS = 30 * 60 * 1000;

  function noteGesture(e) {
    if (e && e.isTrusted === false) return;
    lastGestureAt = Date.now();
  }
  document.addEventListener('pointerdown', noteGesture, true);
  document.addEventListener('keydown', noteGesture, true);

  function safeId(v) {
    var s = String(v == null ? '' : v), out = '';
    for (var i = 0; i < s.length && out.length < 64; i++) {
      var c = s.charAt(i);
      if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') ||
          c === '-' || c === '_' || c === '.') out += c;
    }
    return out;
  }

  function onDappleStep(msg) {
    if (msg.flowId == null || msg.stepId === undefined) return;
    var flowId = safeId(msg.flowId);
    if (!flowId) return;
    if (msg.event === 'flow_start') {
      dappleOpenedAt[flowId] = Date.now();
      dappleStarted[flowId] = false;
      return;
    }
    if (dappleStarted[flowId]) return;
    if (!lastGestureAt || lastGestureAt < (dappleOpenedAt[flowId] || 0)) return;
    dappleStarted[flowId] = true;
    send('form_start', {
      form_id:     'dapple-' + flowId,
      form_name:   '',
      form_action: '',
      capture_via: 'dapple'
    });
  }

  function noteDataLayer(msg) {
    try {
      if (!msg || typeof msg !== 'object' || typeof msg.event !== 'string') return;
      startSeenAt[msg.event] = Date.now();
      if (msg.event === 'flow_start' || msg.event === 'flow_next') onDappleStep(msg);
    } catch (e) {   }
  }

  (function () {
    try {
      var dl = window.dataLayer = window.dataLayer || [];
      for (var i = 0; i < dl.length; i++) {
        var m = dl[i];
        if (m && typeof m === 'object' && typeof m.event === 'string') startSeenAt[m.event] = Date.now();
      }
      var prevPush = dl.push;
      dl.push = function () {
        var r = prevPush.apply(this, arguments);
        for (var j = 0; j < arguments.length; j++) noteDataLayer(arguments[j]);
        return r;
      };
    } catch (e) {   }
  }());

  function siteSentRecently(name) {
    return !!startSeenAt[name] && Date.now() - startSeenAt[name] < WOO_STANDDOWN_MS;
  }

  function wooProductName() {
    var t = wooText('.product_title') || wooText('h1.entry-title');
    if (t) return t.slice(0, 200);
    t = String(document.title || '');
    var cut = Math.max(t.lastIndexOf(' - '), t.lastIndexOf(' | '), t.lastIndexOf(' ' + String.fromCharCode(0x2013) + ' '));
    return (cut > 0 ? t.slice(0, cut) : t).trim().slice(0, 200);
  }

  function digitsOnly(v) {
    var s = String(v == null ? '' : v);
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c < '0' || c > '9') return '';
    }
    return s.slice(0, 20);
  }

  function emitWooAddToCart(productId, name, qty, source) {
    try {
      if (siteSentRecently('add_to_cart')) return;
      var key = productId || '?';
      var now = Date.now();
      if (wooAtcAt[key] && now - wooAtcAt[key] < WOO_STANDDOWN_MS) return;
      wooAtcAt[key] = now;
      var q = parseInt(qty, 10);
      if (!(q > 0)) q = 1;
      send('add_to_cart', {
        value:          '',
        currency:       '',
        transaction_id: '',
        items:          [{ item_id: productId || '', item_name: name || '', price: '', quantity: q }],
        source:         source
      });
    } catch (e) {   }
  }

  document.addEventListener('submit', function (e) {
    try {
      var form = e.target;
      if (!form || form.tagName !== 'FORM' || !formHasClass(form, 'cart')) return;
      var ctl = form.querySelector('[name="add-to-cart"]');
      if (!ctl) return;
      var id = digitsOnly(ctl.value);
      var qtyField = form.querySelector('[name="quantity"]');
      emitWooAddToCart(id, wooProductName(), qtyField ? qtyField.value : 1, 'woocommerce_form');
    } catch (err) {   }
  }, true);

  var wooJqBound = false;
  function bindWooCartHook() {
    if (wooJqBound) return;
    var $ = window.jQuery;
    if (!$ || !$.fn || !$.fn.on) return;
    wooJqBound = true;
    $(document).on('added_to_cart', function (event, fragments, hash, $button) {
      try {
        var btn = $button && $button[0];
        var id = btn ? digitsOnly(btn.getAttribute('data-product_id')) : '';
        var label = btn ? String(btn.getAttribute('aria-label') || '') : '';
        var a = label.indexOf(String.fromCharCode(0x201C)), b = label.lastIndexOf(String.fromCharCode(0x201D));
        var name = (a > -1 && b > a) ? label.slice(a + 1, b) : '';
        emitWooAddToCart(id, name.slice(0, 200), btn ? btn.getAttribute('data-quantity') : 1, 'woocommerce_ajax');
      } catch (err) {   }
    });
  }
  bindWooCartHook();
  if (!wooJqBound) {
    document.addEventListener('DOMContentLoaded', bindWooCartHook);
    window.addEventListener('load', bindWooCartHook);
    setTimeout(bindWooCartHook, 2000);
    setTimeout(bindWooCartHook, 6000);
  }

  function emitWooBeginCheckout() {
    try {
      if (startSeenAt.begin_checkout) return;
      if (!formHasClass(document.body, 'woocommerce-checkout')) return;
      var p = String(location.pathname || '');
      if (p.indexOf('/order-received/') > -1 || p.indexOf('/order-pay/') > -1) return;
      if (!document.querySelector('form.checkout, form.woocommerce-checkout, .wc-block-checkout')) return;
      var hash = String(getCookie('woocommerce_cart_hash') || '').slice(0, 64);
      var now = Date.now();
      try {
        var prev = window.sessionStorage ? sessionStorage.getItem('_nbc') : null;
        if (prev) {
          var bar = prev.indexOf('|');
          var prevHash = prev.slice(0, bar), prevAt = parseInt(prev.slice(bar + 1), 10) || 0;
          if (hash ? prevHash === hash : now - prevAt < CHECKOUT_REPEAT_MS) return;
        }
        if (window.sessionStorage) sessionStorage.setItem('_nbc', hash + '|' + now);
      } catch (e) {   }
      var value = parseAmount(wooText('.order-total .woocommerce-Price-amount') || wooText('.order-total .amount'));
      send('begin_checkout', {
        value:          value === null ? '' : value,
        currency:       wooText('.order-total .woocommerce-Price-currencySymbol'),
        transaction_id: '',
        items:          [],
        source:         'woocommerce_checkout_page'
      });
    } catch (e) {   }
  }

  whenActivated(function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', emitWooBeginCheckout);
    } else {
      emitWooBeginCheckout();
    }
  });

  var exitFired = false;
  var pageviewFired = false;
  function fireExitEvent() {
    if (exitFired) return;
    if (!pageviewFired) return;
    exitFired = true; updateScrollDepth();
    if (engagedSince !== null) { engagedMs += Date.now() - engagedSince; engagedSince = null; }
    fireWebVitals(); send('page_exit');
  }
  document.addEventListener('visibilitychange', function() { if (document.visibilityState === 'hidden') { touchSession(); fireExitEvent(); } });
  window.addEventListener('pagehide', function() { touchSession(); fireExitEvent(); });

  var HISTORY_PAGEVIEWS = cfg.historyPageviews !== false;
  var PAGE_CHANGE_DELAY_MS = 300;
  var lastPagePath = '';
  var lastPageUrl = '';
  var pageChangeReferrer = '';
  var pageChangeTimer = null;
  function rememberPagePath() {
    lastPagePath = String(location.pathname || '');
    lastPageUrl = String(location.href || '');
  }
  function sendPageChange() {
    pageChangeTimer = null;
    try {
      if (!pageviewFired) return;
      var path = String(location.pathname || '');
      if (path === lastPagePath) { lastPageUrl = String(location.href || ''); return; }
      pageChangeReferrer = lastPageUrl;
      rememberPagePath();
      hitNumber += 1;
      setCookie('_mhn', hitNumber, 0);
      send('pageview', staffViaExtras({ page_change: 'history' }));
    } catch (e) {   }
  }
  function onHistoryChange(kind) {
    if (kind === 'replace' && !pageChangeTimer) {
      if (pageviewFired) rememberPagePath();
      return;
    }
    if (pageChangeTimer) clearTimeout(pageChangeTimer);
    pageChangeTimer = setTimeout(sendPageChange, PAGE_CHANGE_DELAY_MS);
  }
  function wrapHistory(name, kind) {
    try {
      var h = window.history;
      var original = h && h[name];
      if (typeof original !== 'function') return;
      h[name] = function () {
        var result = original.apply(h, arguments);
        try { onHistoryChange(kind); } catch (e) {   }
        return result;
      };
    } catch (e) {   }
  }
  if (HISTORY_PAGEVIEWS) {
    wrapHistory('pushState', 'push');
    wrapHistory('replaceState', 'replace');
    window.addEventListener('popstate', function () { onHistoryChange('pop'); });
  }

  function firePageview() { pageviewFired = true; markSiteStaff(); rememberPagePath(); send('pageview', staffViaExtras(undefined)); }
  function whenActivated(fn) {
    if (document.prerendering) { document.addEventListener('prerenderingchange', function() { fn(); }, { once: true }); }
    else { fn(); }
  }
  whenActivated(function() {
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', firePageview); }
    else { firePageview(); }
  });

}(window, document));