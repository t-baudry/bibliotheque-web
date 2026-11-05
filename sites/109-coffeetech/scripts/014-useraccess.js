(function (global) {
  "use strict";

  var STORAGE_KEY = "useraccess_settings_v5";
  var PAGE_STYLE_ID = "useraccess-page-overrides";
  var FX_LAYER_ID = "useraccess-fx-layer";
  var READING_RAIL_ID = "useraccess-reading-rail";
  var HOST_ID = "useraccess-host";
  var Z_HOST = 9998;
  var Z_BACKDROP = 9997;
  var SCOPE = "body :where(:not(#" + HOST_ID + "))";
  var SUPPORTED_LANGS = ["en", "es", "de", "fr", "he"];
  var DESC_CLASS = "useraccess-desc-label";
  var CONTRAST_MODES = 4;
  var LAUNCHER_ICON_SRC = "https://cdn.prod.website-files.com/6978cf5d8e122e23793db0cd/6a6f7634bac578cb75650275_accessibility-icon.svg";

  function getLauncherIconUrl() {
    return LAUNCHER_ICON_SRC;
  }

  var UI_CSS =
    ":host{display:block;all:initial;direction:ltr;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif}" +
    ".ua-shell{position:relative;pointer-events:auto;--ua-trigger-size:2.4vw;--ua-trigger-border:max(2px,0.12vw)}" +
    ".ua-launcher{width:var(--ua-trigger-size);height:var(--ua-trigger-size);box-sizing:border-box;border:var(--ua-trigger-border) solid #fff;border-radius:50%;cursor:pointer;padding:0;background:#000;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.28);display:block;line-height:0;transition:transform .15s,box-shadow .15s}" +
    ".ua-launcher:hover{transform:scale(1.04);box-shadow:0 6px 22px rgba(0,0,0,.34)}" +
    ".ua-launcher:focus-visible{outline:3px solid #ffc107;outline-offset:3px}" +
    ".ua-launcher__img{display:block;width:100%;height:100%;object-fit:cover;border-radius:50%}" +
    ".ua-menu{position:absolute;bottom:calc(var(--ua-trigger-size) + 0.6vw);right:0;left:auto;width:380px;max-width:calc(100vw - 20px);max-height:min(82vh,680px);background:#efefef;border-radius:14px;box-shadow:0 14px 52px rgba(0,0,0,.2);display:none;flex-direction:column;overflow:hidden;border:1px solid #ddd;animation:uaIn .18s ease;unicode-bidi:isolate}" +
    "@keyframes uaIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}" +
    ".ua-menu.is-open{display:flex}" +
    ".ua-menu__head{display:flex;align-items:center;padding:12px 14px;background:#fff;border-bottom:1px solid #e5e5e5;gap:8px}" +
    ".ua-menu__close{width:34px;height:34px;border:none;border-radius:50%;background:#f2f2f2;color:#333;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;flex-shrink:0}" +
    ".ua-menu__close svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2}" +
    ".ua-menu__title{flex:1;margin:0;font-size:16px;font-weight:700;color:#111;text-align:center}" +
    ".ua-menu__spacer{width:34px;flex-shrink:0}" +
    ".ua-menu__body{overflow-y:auto;padding:12px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}" +
    ".ua-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    ".ua-tile{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:6px;min-height:96px;padding:14px 8px 10px;border:2px solid transparent;border-radius:10px;background:#fff;color:#111;cursor:pointer;text-align:center;font:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06)}" +
    ".ua-tile:hover{border-color:#c5d9ff}" +
    ".ua-tile.is-active{border-color:#0048ff;background:#f3f7ff}" +
    ".ua-tile__icon{width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:#111;flex-shrink:0}" +
    ".ua-tile__icon svg{width:28px;height:28px;fill:currentColor;stroke:none;display:block}" +
    ".ua-tile__label{font-size:12.5px;font-weight:600;line-height:1.25;color:#222;display:block;padding:0 2px}" +
    ".ua-tile__badge{font-size:10px;font-weight:700;color:#0048ff;display:none;line-height:1.2}" +
    ".ua-tile.is-active .ua-tile__badge{display:block}" +
    ".ua-menu__foot{padding:10px 12px 14px;background:#efefef;border-top:1px solid #e0e0e0}" +
    ".ua-reset{width:100%;min-height:48px;border:none;border-radius:10px;background:#111;color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 16px}" +
    ".ua-reset svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;flex-shrink:0}" +
    ".ua-brand{margin-top:8px;text-align:center;font-size:10px;color:#888;font-weight:600}" +
    ".ua-menu[dir=rtl] .ua-menu__head{flex-direction:row-reverse}" +
    ".ua-menu[dir=rtl] .ua-reset{flex-direction:row-reverse}" +
    "@media(max-width:650px){.ua-shell{--ua-trigger-size:9.3vw}.ua-menu{width:min(380px,calc(100vw - 16px))}.ua-tile{min-height:88px}}";

  function stringsPack() {
    return {
      en: {
        widgetLabel: "Open accessibility menu",
        menuTitle: "Accessibility Menu",
        close: "Close menu",
        reset: "Reset all accessibility settings",
        brand: "UserAccess",
        highlightLinks: "Highlight Links",
        contrast: "+ Contrast",
        letterSpacing: "Text Spacing",
        largeText: "Large Text",
        hideImages: "Hide Images",
        stopAnimations: "Stop Animations",
        cursor: "Cursor",
        dyslexia: "Dyslexia Support",
        lineHeight: "Line Height",
        descriptions: "Descriptions",
        saturation: "Saturation",
        textAlign: "Text Align",
        highlightHeadings: "Highlight Titles",
        readingGuide: "Reading Guide",
        invert: "Invert Colors",
        keyboardFocus: "Keyboard Focus",
        underlineLinks: "Underline Links",
        muteMedia: "Mute Sounds",
        level: "Level",
        contrastDark: "Dark",
        contrastLight: "Light",
        contrastHigh: "High",
        alignCenter: "Center",
        alignLeft: "Default",
      },
      es: {
        widgetLabel: "Abrir menú de accesibilidad",
        menuTitle: "Menú de accesibilidad",
        close: "Cerrar",
        reset: "Restablecer toda la accesibilidad",
        brand: "UserAccess",
        highlightLinks: "Resaltar enlaces",
        contrast: "+ Contraste",
        letterSpacing: "Espaciado",
        largeText: "Texto grande",
        hideImages: "Ocultar imágenes",
        stopAnimations: "Detener animaciones",
        cursor: "Cursor",
        dyslexia: "Apoyo dislexia",
        lineHeight: "Altura de línea",
        descriptions: "Descripciones",
        saturation: "Saturación",
        textAlign: "Alinear texto",
        highlightHeadings: "Resaltar títulos",
        readingGuide: "Guía de lectura",
        invert: "Invertir colores",
        keyboardFocus: "Foco teclado",
        underlineLinks: "Subrayar enlaces",
        muteMedia: "Silenciar sonidos",
        level: "Nivel",
        contrastDark: "Oscuro",
        contrastLight: "Claro",
        contrastHigh: "Alto",
        alignCenter: "Centro",
        alignLeft: "Normal",
      },
      de: {
        widgetLabel: "Barrierefreiheitsmenü öffnen",
        menuTitle: "Barrierefreiheitsmenü",
        close: "Schließen",
        reset: "Alle Barrierefreiheitseinstellungen zurücksetzen",
        brand: "UserAccess",
        highlightLinks: "Links hervorheben",
        contrast: "+ Kontrast",
        letterSpacing: "Textabstand",
        largeText: "Großer Text",
        hideImages: "Bilder ausblenden",
        stopAnimations: "Animationen stoppen",
        cursor: "Cursor",
        dyslexia: "Legasthenie",
        lineHeight: "Zeilenhöhe",
        descriptions: "Beschreibungen",
        saturation: "Sättigung",
        textAlign: "Textausrichtung",
        highlightHeadings: "Überschriften",
        readingGuide: "Lesehilfe",
        invert: "Farben invertieren",
        keyboardFocus: "Tastaturfokus",
        underlineLinks: "Links unterstreichen",
        muteMedia: "Ton stumm",
        level: "Stufe",
        contrastDark: "Dunkel",
        contrastLight: "Hell",
        contrastHigh: "Hoch",
        alignCenter: "Mitte",
        alignLeft: "Standard",
      },
      fr: {
        widgetLabel: "Ouvrir le menu d'accessibilité",
        menuTitle: "Menu d'accessibilité",
        close: "Fermer",
        reset: "Réinitialiser tous les réglages d'accessibilité",
        brand: "UserAccess",
        highlightLinks: "Surligner les liens",
        contrast: "+ Contraste",
        letterSpacing: "Espacement",
        largeText: "Grand texte",
        hideImages: "Masquer les images",
        stopAnimations: "Arrêter les animations",
        cursor: "Curseur",
        dyslexia: "Aide dyslexie",
        lineHeight: "Interligne",
        descriptions: "Descriptions",
        saturation: "Saturation",
        textAlign: "Alignement",
        highlightHeadings: "Surligner titres",
        readingGuide: "Guide de lecture",
        invert: "Inverser couleurs",
        keyboardFocus: "Focus clavier",
        underlineLinks: "Souligner liens",
        muteMedia: "Couper le son",
        level: "Niveau",
        contrastDark: "Sombre",
        contrastLight: "Clair",
        contrastHigh: "Élevé",
        alignCenter: "Centré",
        alignLeft: "Défaut",
      },
      he: {
        widgetLabel: "פתיחת תפריט נגישות",
        menuTitle: "תפריט נגישות",
        close: "סגור",
        reset: "איפוס את כל הגדרות הנגישות",
        brand: "UserAccess",
        highlightLinks: "הדגשת קישורים",
        contrast: "+ ניגודיות",
        letterSpacing: "ריווח טקסט",
        largeText: "טקסט גדול",
        hideImages: "הסתרת תמונות",
        stopAnimations: "ביטול הנפשות",
        cursor: "סמן",
        dyslexia: "תמיכה בדיסלקציה",
        lineHeight: "גובה שורה",
        descriptions: "תיאורים",
        saturation: "רוויה",
        textAlign: "יישור טקסט",
        highlightHeadings: "הדגשת כותרות",
        readingGuide: "סרגל קריאה",
        invert: "היפוך צבעים",
        keyboardFocus: "ניווט מקלדת",
        underlineLinks: "קו תחתון לקישורים",
        muteMedia: "השתקת צלילים",
        level: "רמה",
        contrastDark: "כהה",
        contrastLight: "בהיר",
        contrastHigh: "גבוה",
        alignCenter: "מרכז",
        alignLeft: "רגיל",
      },
    };
  }

  var STRINGS = stringsPack();

  var TILES = [
    { action: "highlightLinks", label: "highlightLinks", icon: "link" },
    { action: "contrastMode", label: "contrast", icon: "contrast", cycle: CONTRAST_MODES },
    { action: "letterSpacing", label: "letterSpacing", icon: "space" },
    { action: "textLevel", label: "largeText", icon: "text", cycle: 4 },
    { action: "hideImages", label: "hideImages", icon: "image" },
    { action: "stopAnimations", label: "stopAnimations", icon: "pause" },
    { action: "bigCursor", label: "cursor", icon: "cursor" },
    { action: "readableFont", label: "dyslexia", icon: "dyslexia" },
    { action: "lineHeight", label: "lineHeight", icon: "lineHeight" },
    { action: "descriptions", label: "descriptions", icon: "descriptions" },
    { action: "grayscale", label: "saturation", icon: "saturation" },
    { action: "textAlignMode", label: "textAlign", icon: "align", cycle: 2 },
    { action: "highlightHeadings", label: "highlightHeadings", icon: "headings" },
    { action: "readingGuide", label: "readingGuide", icon: "guide" },
    { action: "invert", label: "invert", icon: "invert" },
    { action: "keyboardFocus", label: "keyboardFocus", icon: "keyboard" },
    { action: "underlineLinks", label: "underlineLinks", icon: "underline" },
    { action: "muteMedia", label: "muteMedia", icon: "mute" },
  ];

  var ICONS = {
    link: '<svg viewBox="0 0 24 24"><path d="M9.2 12.9 7.4 14.7a3.5 3.5 0 1 0 5 5l2.5-2.5a3.5 3.5 0 0 0-1-1.7l-1.3 1.3a1.5 1.5 0 1 1-2.1-2.1l1.8-1.8a3.5 3.5 0 0 0-2.2-.9zm5.6-1.8 1.8-1.8a3.5 3.5 0 1 0-5-5L9.1 6.8a3.5 3.5 0 0 0 1 1.7l1.3-1.3a1.5 1.5 0 1 1 2.1 2.1l-1.8 1.8a3.5 3.5 0 0 0 2.2.9z"/></svg>',
    contrast: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2v16a8 8 0 0 1 0-16z"/></svg>',
    space: '<svg viewBox="0 0 24 24"><path d="M3 8h4v8H3V8zm14 0h4v8h-4V8zM9 11h6v2H9v-2z"/></svg>',
    text: '<svg viewBox="0 0 24 24"><path d="M6 4h12v2.5H13V20h-2V6.5H6V4z"/><path d="M16 8h5v2h-2v10h-2V10h-1V8z"/></svg>',
    image: '<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4V5zm2 2v10h12V7H6zm2 2 2 2 3-3 3 4H8l-2-3z"/><path d="M17 8.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M8 6h3v12H8V6zm5 0h3v12h-3V6z"/><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 0 16V4z" opacity=".25"/></svg>',
    cursor: '<svg viewBox="0 0 24 24"><path d="M5 3l7 14 2-5 5-2L5 3z"/></svg>',
    dyslexia: '<svg viewBox="0 0 24 24"><path d="M7 4 3 20h2.2l.9-3.6h5.8l.9 3.6H15L11 4H7zm1.3 11.5L10 8l1.7 7.5H8.3zM17 8h2v8h2v2h-6V8z"/></svg>',
    lineHeight: '<svg viewBox="0 0 24 24"><path d="M4 7h16v2H4V7zm0 5h12v2H4v-2zm0 5h16v2H4v-2z"/><path d="M20 11v2M18 12h4"/></svg>',
    descriptions: '<svg viewBox="0 0 24 24"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-4 3V6a2 2 0 0 1 2-2zm2 4h10v2H7V8zm0 4h7v2H7v-2z"/></svg>',
    saturation: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c0-5.52-4.48-10-10-10 5.52 0 10-4.48 10-10z"/></svg>',
    align: '<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm2 5h12v2H6v-2zm-2 5h16v2H4v-2z"/></svg>',
    headings: '<svg viewBox="0 0 24 24"><path d="M5 4v3h5v13h3V7h5V4H5zm12 0h2v16h-2V4z"/></svg>',
    guide: '<svg viewBox="0 0 24 24"><path d="M3 10h18v4H3v-4z"/><path d="M4 8h16v2H4V8zm0 6h16v2H4v-2z" opacity=".5"/></svg>',
    invert: '<svg viewBox="0 0 24 24"><path d="M12 2v20a10 10 0 0 0 0-20z"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm2 2v2h2V8H6zm3 0v2h2V8H9zm3 0v2h2V8h-2zm3 0v2h2V8h-2zM6 11v2h2v-2H6zm3 0v2h2v-2H9zm6 0v2h2v-2h-2zM6 14h12v2H6v-2z"/></svg>',
    underline: '<svg viewBox="0 0 24 24"><path d="M7 4v6a5 5 0 0 0 10 0V4h2v6a7 7 0 0 1-14 0V4h2zm-2 14h16v2H5v-2z"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06a4.5 4.5 0 0 0 2.5-4.03z"/></svg>',
  };

  var RESET_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 7l5 5V8a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>';

  var DEFAULT_STATE = {
    textLevel: 0,
    contrastMode: 0,
    textAlignMode: 0,
    highlightLinks: false,
    highlightHeadings: false,
    letterSpacing: false,
    hideImages: false,
    stopAnimations: false,
    bigCursor: false,
    readableFont: false,
    lineHeight: false,
    descriptions: false,
    grayscale: false,
    invert: false,
    readingGuide: false,
    keyboardFocus: false,
    underlineLinks: false,
    muteMedia: false,
  };

  var hostEl = null;
  var shadowRoot = null;
  var ui = {};
  var state = copyState(DEFAULT_STATE);
  var lang = "en";
  var initialized = false;
  var readingMoveHandler = null;

  function copyState(src) {
    return Object.assign({}, DEFAULT_STATE, src || {});
  }

  function t(key) {
    var pack = STRINGS[lang] || STRINGS.en;
    return pack[key] || STRINGS.en[key] || key;
  }

  function detectLang() {
    try {
      if (global.Weglot && global.Weglot.getCurrentLang) {
        var w = global.Weglot.getCurrentLang();
        if (SUPPORTED_LANGS.indexOf(w) >= 0) return w;
      }
    } catch (e) {}
    var docLang = (document.documentElement.lang || "").split("-")[0].toLowerCase();
    if (SUPPORTED_LANGS.indexOf(docLang) >= 0) return docLang;
    var m = location.pathname.match(/^\/(es|de|fr|he)(\/|$)/i);
    if (m) return m[1].toLowerCase();
    try {
      var stored = localStorage.getItem("weglot_preferred_lang");
      if (stored && SUPPORTED_LANGS.indexOf(stored) >= 0) return stored;
    } catch (e2) {}
    return "en";
  }

  function hasActiveSettings(s) {
    s = s || state;
    return Object.keys(DEFAULT_STATE).some(function (key) {
      var v = s[key];
      if (typeof v === "number") return v > 0;
      return !!v;
    });
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state = copyState(JSON.parse(raw));
    } catch (e) {}
  }

  function saveState() {
    if (!hasActiveSettings()) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e2) {}
  }

  function buildPageCSS(s) {
    var lines = [];
    var zoom = [1, 1.12, 1.24, 1.38][s.textLevel] || 1;
    if (s.textLevel > 0) lines.push("html { zoom: " + zoom + " !important; }");
    if (s.highlightLinks) {
      lines.push(
        SCOPE +
          " a { outline: 2px solid #ffb300 !important; outline-offset: 2px !important; background: rgba(255,179,0,0.15) !important; }",
      );
    }
    if (s.highlightHeadings) {
      lines.push(
        SCOPE +
          " :is(h1,h2,h3,h4,h5,h6) { outline: 2px solid #0ea5e9 !important; outline-offset: 3px !important; }",
      );
    }
    if (s.underlineLinks) lines.push(SCOPE + " a { text-decoration: underline !important; text-underline-offset: 3px !important; }");
    if (s.letterSpacing) lines.push(SCOPE + " { letter-spacing: 0.08em !important; }");
    if (s.readableFont) {
      lines.push(
        SCOPE +
          " { font-family: Arial, Helvetica, sans-serif !important; word-spacing: 0.14em !important; letter-spacing: 0.04em !important; }",
      );
    }
    if (s.lineHeight) lines.push(SCOPE + " { line-height: 1.85 !important; }");
    if (s.contrastMode === 1) {
      lines.push("html, body { background:#000 !important; color:#fff !important; }");
      lines.push(SCOPE + " { background-color:#000 !important; color:#fff !important; border-color:#fff !important; }");
      lines.push(SCOPE + " a { color:#7dd3fc !important; }");
    }
    if (s.contrastMode === 2) {
      lines.push("html, body { background:#fff !important; color:#000 !important; }");
      lines.push(SCOPE + " { background-color:#fff !important; color:#000 !important; }");
    }
    if (s.contrastMode === 3) {
      lines.push("html, body { background:#000 !important; color:#ff0 !important; }");
      lines.push(SCOPE + " { background-color:#000 !important; color:#ff0 !important; border-color:#ff0 !important; }");
      lines.push(SCOPE + " a { color:#fff200 !important; text-decoration:underline !important; }");
    }
    if (s.hideImages) lines.push(SCOPE + " :is(img,picture,video) { visibility:hidden !important; }");
    if (s.stopAnimations) {
      lines.push(
        "*,*::before,*::after { animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important; scroll-behavior:auto !important; }",
      );
    }
    if (s.bigCursor) {
      lines.push(
        "html, html * { cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath fill='%23000' stroke='%23fff' d='M4 4l24 14-8 2-4 10z'/%3E%3C/svg%3E\") 2 2, auto !important; }",
      );
      lines.push("#" + HOST_ID + ", #" + HOST_ID + " * { cursor:pointer !important; }");
    }
    if (s.textAlignMode === 1) lines.push(SCOPE + " { text-align:center !important; }");
    if (s.keyboardFocus) {
      lines.push(SCOPE + " :focus-visible { outline: 3px solid #ff0 !important; outline-offset: 3px !important; }");
    }
    if (s.descriptions) lines.push(SCOPE + " img[alt]:not([alt='']) { outline:2px dashed #666 !important; }");
    return lines.join("\n");
  }

  function syncFxLayer(s) {
    var layer = document.getElementById(FX_LAYER_ID);
    if (!s.grayscale && !s.invert) {
      if (layer) layer.remove();
      return;
    }
    if (!layer) {
      layer = document.createElement("div");
      layer.id = FX_LAYER_ID;
      layer.setAttribute("aria-hidden", "true");
      layer.style.cssText = "position:fixed;inset:0;z-index:2147483645;pointer-events:none;";
      document.body.appendChild(layer);
    }
    var filters = [];
    if (s.grayscale) filters.push("grayscale(100%)");
    if (s.invert) filters.push("invert(100%) hue-rotate(180deg)");
    layer.style.backdropFilter = filters.join(" ");
    layer.style.webkitBackdropFilter = filters.join(" ");
  }

  function syncReadingGuide(s) {
    var rail = document.getElementById(READING_RAIL_ID);
    if (!s.readingGuide) {
      if (readingMoveHandler) {
        document.removeEventListener("mousemove", readingMoveHandler);
        readingMoveHandler = null;
      }
      if (rail) rail.remove();
      return;
    }
    if (!rail) {
      rail = document.createElement("div");
      rail.id = READING_RAIL_ID;
      rail.setAttribute("aria-hidden", "true");
      rail.style.cssText =
        "position:fixed;left:0;right:0;height:44px;z-index:2147483644;pointer-events:none;background:rgba(255,235,59,0.28);border-top:2px solid #ffc107;border-bottom:2px solid #ffc107;";
      document.body.appendChild(rail);
    }
    if (!readingMoveHandler) {
      readingMoveHandler = function (ev) {
        rail.style.top = ev.clientY - 22 + "px";
      };
      document.addEventListener("mousemove", readingMoveHandler, { passive: true });
    }
  }

  function syncMuteMedia() {
    document.querySelectorAll("video, audio").forEach(function (el) {
      if (hostEl && hostEl.contains(el)) return;
      if (state.muteMedia) {
        el.muted = true;
        el.setAttribute("data-ua-muted", "1");
      } else if (el.getAttribute("data-ua-muted") === "1") {
        el.muted = false;
        el.removeAttribute("data-ua-muted");
      }
    });
  }

  function clearDescriptionLabels() {
    document.querySelectorAll("." + DESC_CLASS).forEach(function (el) {
      el.remove();
    });
  }

  function syncDescriptionLabels() {
    clearDescriptionLabels();
    if (!state.descriptions) return;
    document.querySelectorAll("body img[alt]").forEach(function (img) {
      if (hostEl && hostEl.contains(img)) return;
      var alt = (img.getAttribute("alt") || "").trim();
      if (!alt) return;
      var label = document.createElement("div");
      label.className = DESC_CLASS + " weglot-ignore wg-notranslate";
      label.setAttribute("data-wg-notranslate", "");
      label.textContent = alt;
      label.style.cssText =
        "display:block;font:600 12px/1.35 Arial,sans-serif;color:#111;background:#fff8e1;border:1px solid #ffc107;padding:6px 10px;margin:6px 0;border-radius:4px;";
      if (img.parentNode) img.parentNode.insertBefore(label, img.nextSibling);
    });
  }

  function clearAllPageEffects() {
    var el = document.getElementById(PAGE_STYLE_ID);
    if (el) el.remove();
    syncFxLayer({ grayscale: false, invert: false });
    syncReadingGuide({ readingGuide: false });
    clearDescriptionLabels();
    syncMuteMedia();
  }

  function applyPageEffects() {
    if (!hasActiveSettings()) {
      clearAllPageEffects();
      saveState();
      return;
    }
    var styleEl = document.getElementById(PAGE_STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = PAGE_STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = buildPageCSS(state);
    syncFxLayer(state);
    syncReadingGuide(state);
    syncDescriptionLabels();
    syncMuteMedia();
    saveState();
  }

  function tileIsActive(action) {
    if (action === "textLevel") return state.textLevel > 0;
    if (action === "contrastMode") return state.contrastMode > 0;
    if (action === "textAlignMode") return state.textAlignMode > 0;
    return !!state[action];
  }

  function tileBadge(action) {
    if (action === "textLevel" && state.textLevel > 0) return t("level") + " " + state.textLevel;
    if (action === "contrastMode" && state.contrastMode === 1) return t("contrastDark");
    if (action === "contrastMode" && state.contrastMode === 2) return t("contrastLight");
    if (action === "contrastMode" && state.contrastMode === 3) return t("contrastHigh");
    if (action === "textAlignMode" && state.textAlignMode === 1) return t("alignCenter");
    if (action === "textAlignMode" && state.textAlignMode === 0) return "";
    return "";
  }

  function onTileClick(action, cycleMax) {
    if (cycleMax) {
      if (action === "contrastMode") state.contrastMode = (state.contrastMode + 1) % CONTRAST_MODES;
      else if (action === "textLevel") state.textLevel = (state.textLevel + 1) % 4;
      else if (action === "textAlignMode") state.textAlignMode = (state.textAlignMode + 1) % 2;
    } else state[action] = !state[action];
    applyPageEffects();
    refreshUI();
  }

  function resetAll() {
    state = copyState(DEFAULT_STATE);
    clearAllPageEffects();
    ["useraccess_settings_v1", "useraccess_settings_v2", "useraccess_settings_v3", "useraccess_settings_v4"].forEach(
      function (k) {
        try {
          localStorage.removeItem(k);
        } catch (e) {}
      },
    );
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e2) {}
    refreshUI();
  }

  function setMenuOpen(open) {
    if (!ui.menu || !ui.launcher) return;
    ui.menu.classList.toggle("is-open", open);
    ui.launcher.setAttribute("aria-expanded", open ? "true" : "false");
    ui.menu.setAttribute("aria-hidden", open ? "false" : "true");
    var backdrop = document.getElementById("useraccess-backdrop");
    if (open) {
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "useraccess-backdrop";
        backdrop.setAttribute("aria-hidden", "true");
        backdrop.style.cssText =
          "position:fixed;inset:0;z-index:" + Z_BACKDROP + ";background:rgba(13,14,19,.42);pointer-events:auto;";
        backdrop.addEventListener("click", function () {
          setMenuOpen(false);
        });
        document.body.appendChild(backdrop);
      }
      if (hostEl) hostEl.style.pointerEvents = "auto";
    } else {
      if (backdrop) backdrop.remove();
      if (hostEl) hostEl.style.pointerEvents = "none";
    }
  }

  function buildUI() {
    if (hostEl) return hostEl;

    hostEl = document.createElement("div");
    hostEl.id = HOST_ID;
    hostEl.className = "weglot-ignore wg-notranslate";
    hostEl.setAttribute("data-wg-notranslate", "");
    hostEl.style.cssText =
      "position:fixed!important;bottom:1.3vw!important;right:1vw!important;z-index:" + Z_HOST + "!important;pointer-events:none!important;";

    shadowRoot = hostEl.attachShadow({ mode: "open" });

    var tilesHtml = TILES.map(function (tile) {
      return (
        '<button type="button" class="ua-tile" data-action="' +
        tile.action +
        '" data-cycle="' +
        (tile.cycle || 0) +
        '"><span class="ua-tile__icon">' +
        (ICONS[tile.icon] || "") +
        '</span><span class="ua-tile__label" data-label="' +
        tile.label +
        '"></span><span class="ua-tile__badge" data-badge="' +
        tile.action +
        '"></span></button>'
      );
    }).join("");

    shadowRoot.innerHTML =
      "<style>" +
      UI_CSS +
      "</style>" +
      '<div class="ua-shell">' +
      '<button type="button" class="ua-launcher" aria-expanded="false" aria-haspopup="dialog">' +
      '<img class="ua-launcher__img" alt="" draggable="false" />' +
      "</button>" +
      '<div class="ua-menu" role="dialog" aria-modal="true" aria-hidden="true">' +
      '<header class="ua-menu__head">' +
      '<button type="button" class="ua-menu__close" aria-label=""><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<h2 class="ua-menu__title"></h2>' +
      '<div class="ua-menu__spacer"></div>' +
      "</header>" +
      '<div class="ua-menu__body"><div class="ua-grid">' +
      tilesHtml +
      "</div></div>" +
      '<footer class="ua-menu__foot">' +
      '<button type="button" class="ua-reset"><span class="ua-reset__text"></span>' +
      RESET_ICON +
      "</button>" +
      '<div class="ua-brand"></div>' +
      "</footer></div></div>";

    document.body.appendChild(hostEl);

    ui.shell = shadowRoot.querySelector(".ua-shell");
    ui.launcher = shadowRoot.querySelector(".ua-launcher");
    var launcherImg = shadowRoot.querySelector(".ua-launcher__img");
    if (launcherImg) launcherImg.src = getLauncherIconUrl();
    ui.menu = shadowRoot.querySelector(".ua-menu");
    ui.title = shadowRoot.querySelector(".ua-menu__title");
    ui.reset = shadowRoot.querySelector(".ua-reset");
    ui.resetText = shadowRoot.querySelector(".ua-reset__text");
    ui.brand = shadowRoot.querySelector(".ua-brand");
    ui.close = shadowRoot.querySelector(".ua-menu__close");

    ui.launcher.addEventListener("click", function (ev) {
      ev.stopPropagation();
      setMenuOpen(!ui.menu.classList.contains("is-open"));
    });
    ui.close.addEventListener("click", function () {
      setMenuOpen(false);
    });
    ui.reset.addEventListener("click", resetAll);

    shadowRoot.querySelectorAll(".ua-tile").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var cycle = parseInt(btn.getAttribute("data-cycle"), 10) || 0;
        onTileClick(btn.getAttribute("data-action"), cycle);
      });
    });

    document.addEventListener("click", function (ev) {
      if (!ui.menu.classList.contains("is-open")) return;
      var path = ev.composedPath ? ev.composedPath() : [];
      if (path.indexOf(hostEl) >= 0) return;
      setMenuOpen(false);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") setMenuOpen(false);
    });

    hostEl.addEventListener(
      "wheel",
      function (ev) {
        if (!ui.menu || !ui.menu.classList.contains("is-open")) return;
        var path = ev.composedPath ? ev.composedPath() : [];
        if (path.indexOf(ui.menu) < 0) return;
        var body = shadowRoot.querySelector(".ua-menu__body");
        if (!body) return;
        ev.preventDefault();
        ev.stopPropagation();
        var max = body.scrollHeight - body.clientHeight;
        if (max <= 0) return;
        var next = body.scrollTop + ev.deltaY;
        if (next < 0) next = 0;
        else if (next > max) next = max;
        body.scrollTop = next;
      },
      { capture: true, passive: false },
    );

    return hostEl;
  }

  function refreshUI() {
    if (!shadowRoot) return;
    lang = detectLang();
    ui.shell.setAttribute("dir", "ltr");
    ui.shell.setAttribute("lang", lang);
    ui.menu.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
    ui.menu.setAttribute("lang", lang);

    ui.title.textContent = t("menuTitle");
    ui.resetText.textContent = t("reset");
    ui.brand.textContent = t("brand");
    ui.launcher.setAttribute("aria-label", t("widgetLabel"));
    ui.close.setAttribute("aria-label", t("close"));

    shadowRoot.querySelectorAll("[data-label]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-label"));
    });

    shadowRoot.querySelectorAll(".ua-tile").forEach(function (btn) {
      var action = btn.getAttribute("data-action");
      btn.classList.toggle("is-active", tileIsActive(action));
      var badge = btn.querySelector("[data-badge]");
      if (badge) {
        var text = tileBadge(action);
        badge.textContent = text;
        badge.style.display = text ? "block" : "none";
      }
    });
  }

  function bindLangObservers() {
    if (global.__userAccessLangBound) return;
    global.__userAccessLangBound = true;
    try {
      if (global.Weglot && global.Weglot.on) {
        global.Weglot.on("languageChanged", refreshUI);
        global.Weglot.on("initialized", refreshUI);
      }
    } catch (e) {}
    new MutationObserver(refreshUI).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang", "dir"],
    });
    global.addEventListener("storage", function (ev) {
      if (ev.key === "weglot_preferred_lang") refreshUI();
    });
  }

  function syncHostPosition() {
    if (!hostEl) return;
    if (global.matchMedia && global.matchMedia("(max-width: 650px)").matches) {
      hostEl.style.bottom = "3vw";
      hostEl.style.right = "3vw";
    } else {
      hostEl.style.bottom = "1.3vw";
      hostEl.style.right = "1vw";
    }
  }

  function init() {
    if (global.__cftIsAuditBrowser) return;
    if (initialized) return;
    initialized = true;
    loadState();
    buildUI();
    syncHostPosition();
    global.addEventListener("resize", syncHostPosition, { passive: true });
    refreshUI();
    bindLangObservers();
    if (hasActiveSettings()) applyPageEffects();
    else clearAllPageEffects();
    global.__userAccessInitialized = true;
  }

  function destroy() {
    resetAll();
    if (hostEl && hostEl.parentNode) hostEl.parentNode.removeChild(hostEl);
    hostEl = null;
    shadowRoot = null;
    ui = {};
    initialized = false;
    global.__userAccessInitialized = false;
  }

  global.UserAccess = { init: init, destroy: destroy, reset: resetAll, refreshLanguage: refreshUI };
  global.__userAccessInitialized = false;
})(typeof window !== "undefined" ? window : globalThis);
