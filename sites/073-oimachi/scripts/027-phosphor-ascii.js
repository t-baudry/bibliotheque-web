/*
 * PHOSPHOR — animated ASCII (combined light/dark build).
 *
 * One script serves both themes. Give the canvas the class "phosphor-ascii":
 *
 *   <canvas class="phosphor-ascii"></canvas>
 *
 * Theme selection follows the site's existing convention: if the canvas is
 * inside an element with the class "theme-dark", the dark settings + dark
 * source image are used; otherwise the light ones. The script watches for
 * class changes anywhere in the document, so toggling "theme-dark" at
 * runtime switches the animation live — no reload needed.
 */
(function () {
"use strict";

/* Settings shared by both themes. */
var CONFIG_BASE = {
  "cell": 14,
  "colorMode": "mono",
  "duoBright": "#000000",
  "duoDark": "#e8ecef",
  "glyphMode": "chars",
  "height": 1080,
  "iconRotationMapped": false,
  "iconTransform": null,
  "includeBackground": true,
  "invert": false,
  "loopSeconds": 3,
  "motionMode": "jitter",
  "ramp": "OIMACHI0",
  "reveal": 0,
  "scanlines": false,
  "sourceTransform": null,
  "width": 1920
};

/* Settings that differ per theme (each tuned against its own source image). */
var THEMES = {
  dark: {
    "background": "#0F0F0F",
    "brightness": 0.1,
    "contrast": 1.15,
    "cycles": 3,
    "intensity": 0.77,
    "mono": "#383838"
  },
  light: {
    "background": "#D4D4D4",
    "brightness": -0.32,
    "contrast": 2.25,
    "cycles": 4,
    "intensity": 0.75,
    "mono": "#F5F5F5"
  }
};

/*
 * Both source images are baked in. They are never drawn visibly (reveal is 0)
 * but they drive the effect: each cell's ASCII glyph is picked from the
 * image's luminance at that spot. The dark and light builds were generated
 * from differently-toned images, so both are kept for identical output.
 */
var SOURCE_URLS = {
  dark: "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAeCgAwAEAAAAAQAAAQ4AAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAQ4B4AMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMFAwMDBQYFBQUFBggGBgYGBggKCAgICAgICgoKCgoKCgoMDAwMDAwODg4ODg8PDw8PDw8PDw//2wBDAQICAgQEBAcEBAcQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/3QAEAB7/2gAMAwEAAhEDEQA/APwEuLie6nkurqRpppmLu7kszMxyWYnkknkk1FRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFS29xPaTx3VrI0M0LB0dCVZWU5DKRyCDyCKiooA//0P5/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9H+f+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK+1f2Zv2CP2gf2nng1XwzpQ0Lwo7YfXNUDQ2rKD832dcGS4bqP3alARhnWgD4qr3H4S/s0/Hn46TrH8KfBGpa/AW2G6jh8qyRs4w93MUgU+xcGv6W/2fv+CWP7NHwYjttV8WWB+I3iOLDNdaxGps0cf88rAFogPTzTKwPRhX6SWlnaafaxWNhAltbQKEjiiUIiIowFVVwAAOgFAH82Xwy/4IrfGbXkiu/ip4y0rwlC+Cbeyjk1S6Ud1bmCEH3WRx356V9zeCf+CNX7L/h9I5fF2q6/4puBjest1HaW5+iW8ayD8ZTX630UAfFHh/8A4J0/sWeGkVbD4W6fcFe97NdXpJ9/tM0g/pXpdp+yB+ylZIEh+D3hFgP+emiWUp/OSJjX0ZRQB853f7IH7KV6pSb4PeEVB/556JZRH844lNeaeIP+CdP7FniVGS/+Fun25bvZTXVkQfUfZpo/8K+16KAPyR8bf8Eav2X/ABAjy+EdV1/wtcHOxYrqO7tx9UuI2kP4Sivhn4m/8EVvjNoKS3nws8Z6V4shTJW3vY5NLumHZV5nhJ92kQd+Olf0qUUAfw8fFr9mn48/Audo/it4I1LQIFbYLuSLzbJ26YS7hLwMfZXJrw6v78Lu0tNQtZbG/gS5tp1KSRSqHR1YYKsrZBBHUGvzb/aB/wCCWP7NHxnS51XwpYH4c+I5cst1o6KLN3PTzbEkRFc8nyjEx7saAP5M6K+1v2mf2CP2gf2YZJ9V8TaUNe8KI2E1zSw01qqk8faFwJLdug/eKEJ4V2r4poAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//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",
  light: "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAeCgAwAEAAAAAQAAAQ4AAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAQ4B4AMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMFAwMDBQYFBQUFBggGBgYGBggKCAgICAgICgoKCgoKCgoMDAwMDAwODg4ODg8PDw8PDw8PDw//2wBDAQICAgQEBAcEBAcQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/3QAEAB7/2gAMAwEAAhEDEQA/AP2868miiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKOnIoooA//Q/byiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0f28ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiivPvF/xM8L+Dw0N5P9pvQOLaHDOP949FH159AaLgeg1zmueLvDXhtSda1GG2YDOwtukI9kXLH8q+RvFHxn8Xa+XgsZf7JtG6JAT5hH+1Jw3/AHztHtXkzyPK7SSsXdjkknJJPcms3PsVyn1prH7QWgWxZNFsJ75h/FIRCh9x95vzArznUfj54xuiVsYbWyXsQhkb82OP/Ha8OoqeZjsehXXxW+IN2SZNZlTP/PNUj/8AQFFZD+O/Gshy2vXw+lxIv8mrlKKVxnVp478axnK69fH63EjfzY1r2vxW+INoQYtZlbH/AD0VJP8A0NTXntFFwPcdO+PnjG1IW+htb1e5KGNvzU4/8dr0bR/2gtAuSqa1p81ix/ijImQe5+635A18kUU1Jisforofi7w14jUHRdRhuWIzsDYkA90bDD8q6OvzKR3idZI2KOpyCDggjuDXrPhf4z+LvD5SC9l/tW0Xqk5PmAf7MnLf99bh7VSn3Fyn25RXnvhD4meGPGIWCzm+zXpHNtNhXP8Auno34c+oFehVpckKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0v28ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKqX19Z6ZaS3+oTLb28I3O7nCqPrVPXdd0zw5pk2r6vMIbeEcnqWJ6Ko7k9hXxD4++ImreOL0iQm306Jsw24PA/2n/vN+g6DvmZSsNI77x78br7VDJpfhEtZ2nKtc9JpB/s/3B/499OleAMzOxdyWZjkk8kk9zTaKybuWFFFFIAooooAKKKKACiiigAooooAKKKKAHKzIwdCVZTkEcEEdxXv/gL43X+mNHpfi4teWnCrc9Zox/tf3x/499elfP1F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+Z4PUjuyD8x3yOa+vaKTVxpn5j0V9jePPgtpfiAyan4dK6fqDZZkxiCU+4H3CfUceo718pa54f1nw3emw1q1e1mHTcPlYDurDhh7g1i42KTMaiiikMKKKKACiiigAooooAKKKKACiiigAorZ0Pw/rPiS9Fhotq91Meu0fKoPdmPCj3JFfVvgP4L6Z4faPU/ERTUNQXDKmMwRH2B++R6kY9B3pqNxNnmnw0+D9zrjRa54njaDTuGjgPyvP6E91T9T245r64hhhtoUt7dFiijUKqqMKqjgAAdAKlorZKxLYUUUUxBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/1f28ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACs3VdH0vXLRrDV7WO7gb+GRc4PqD1B9xzWlRQB81+J/wBn+3lL3PhO88knn7PcZZfosg5H4g/WvBde8EeKvDTN/bGnSwxr/wAtQN8X/fa5X8zmv0OoIBGDyDUOCHzH5j0V+ger/DrwTrhZ7/SIfMbq8QMLk+pMZUn8a851D9n3wvOS2nX11aE9m2yqPwwp/WpcGVzHyFRX0fdfs7agpP2LWopB/wBNIWT+TNWS/wCz34uB/d39iw93lH/tM0uVhc8Gor3lP2e/FxP7y/sVHs8p/wDaYrWtf2dtQYj7brUUY/6Zws/82WjlYXPnCivr3T/2ffC8BDajfXN2R2XbEp+oAY/rXo2kfDrwToZVrDSIfMXo8oMzg+oMm4j8KfIw5j4m0HwR4q8Ssv8AY+nSzRt/y1I2Rf8AfbYX8jmve/DH7P8AbxFLnxZeecRz9nt8hfo0h5P4AfWvpIAAYHAFLVKCJ5jN0rR9L0O0Wx0i1jtIF/hjXGT6nuT7nmtKiirEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//9b9vKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//X/byilIwSD2pKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopQMkAd6AP/Z"
};

var ICON_URL = null;

var GLYPH_LEVELS = 32;
var CHAR_CELL_ASPECT = 0.6;

/* Active config; swapped per instance/theme before engine calls. */
var CONFIG = mergeConfig("dark");

function mergeConfig(theme) {
  var out = {};
  var key;
  for (key in CONFIG_BASE) out[key] = CONFIG_BASE[key];
  var overrides = THEMES[theme] || THEMES.light;
  for (key in overrides) out[key] = overrides[key];
  return out;
}

/* ---- pure math (mirrors the PHOSPHOR engine; covered by parity tests) ---- */

function phosphorTone(value, contrast, brightness, invert) {
  var tone = (value - 0.5) * contrast + 0.5 + brightness;
  if (invert) tone = 1 - tone;
  return Math.min(1, Math.max(0, tone));
}

function phosphorLevel(tone, levels) {
  if (tone <= 0.001) return 0;
  return Math.min(levels - 1, Math.floor(tone * levels));
}

function phosphorMotionOffset(mode, x, y, progress, cycles, intensity, rows) {
  if (mode === "off" || intensity <= 0) return 0;
  var loopProgress = progress - Math.floor(progress);
  var tau = Math.PI * 2;
  var wholeCycles = Math.max(1, Math.round(cycles));
  if (mode === "wave") {
    var secondary = Math.max(1, Math.round(wholeCycles * 0.7));
    return (
      Math.sin(x * 0.28 + tau * wholeCycles * loopProgress) *
      Math.sin(y * 0.19 - tau * secondary * loopProgress) *
      0.5 * intensity
    );
  }
  if (mode === "scan") {
    var sweep = (loopProgress * wholeCycles) % 1;
    var position = sweep * (rows * 1.3) - rows * 0.15;
    var distance = (y - position) / Math.max(1, rows * 0.06);
    return Math.exp(-distance * distance) * intensity * 0.9 - intensity * 0.12;
  }
  if (mode === "jitter") {
    var steps = wholeCycles * 8;
    var step = Math.floor(loopProgress * steps) % steps;
    var noise = Math.sin(x * 127.1 + y * 311.7 + step * 74.7) * 43758.5453;
    return (noise - Math.floor(noise) - 0.5) * intensity;
  }
  return 0;
}

function phosphorDriftShift(progress, cycles, rows) {
  var loopProgress = progress - Math.floor(progress);
  var wholeCycles = Math.max(1, Math.round(cycles));
  return Math.floor(loopProgress * rows * wholeCycles) % Math.max(1, rows);
}

function phosphorMotionStateKey(mode, progress, cycles, intensity, rows) {
  if (mode === "drift") {
    return "drift:" + phosphorDriftShift(progress, cycles, rows);
  }
  if (mode === "off" || intensity <= 0) {
    return "static";
  }
  if (mode === "jitter") {
    var loopProgress = progress - Math.floor(progress);
    var steps = Math.max(1, Math.round(cycles)) * 8;
    return "jitter:" + (Math.floor(loopProgress * steps) % steps);
  }
  return "flow:" + progress.toFixed(4);
}

function phosphorHex(hex) {
  var ok = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#e8ecef";
  return [
    parseInt(ok.slice(1, 3), 16),
    parseInt(ok.slice(3, 5), 16),
    parseInt(ok.slice(5, 7), 16),
  ];
}

function phosphorDuoColor(darkHex, brightHex, mix) {
  var dark = phosphorHex(darkHex);
  var bright = phosphorHex(brightHex);
  var m = Math.min(1, Math.max(0, mix));
  var r = Math.round(dark[0] + (bright[0] - dark[0]) * m);
  var g = Math.round(dark[1] + (bright[1] - dark[1]) * m);
  var b = Math.round(dark[2] + (bright[2] - dark[2]) * m);
  return "rgb(" + r + "," + g + "," + b + ")";
}

/* ---------------------------- canvas pipeline ---------------------------- */

function transformImage(image, transform) {
  var rotation = transform ? transform.rotationDeg : 0;
  var rotated = rotation === 90 || rotation === 270;
  var w = Math.max(1, Math.round(rotated ? image.height : image.width));
  var h = Math.max(1, Math.round(rotated ? image.width : image.height));
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  var context = canvas.getContext("2d");
  context.translate(w / 2, h / 2);
  context.rotate((rotation * Math.PI) / 180);
  context.scale(
    transform && transform.flipH ? -1 : 1,
    transform && transform.flipV ? -1 : 1
  );
  context.drawImage(image, -image.width / 2, -image.height / 2);
  return canvas;
}

function coverCrop(source, width, height) {
  var aspect = width / Math.max(1, height);
  var cropW = source.width;
  var cropH = source.width / aspect;
  if (cropH > source.height) {
    cropH = source.height;
    cropW = source.height * aspect;
  }
  var canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  var context = canvas.getContext("2d");
  context.drawImage(
    source,
    (source.width - cropW) / 2,
    (source.height - cropH) / 2,
    cropW,
    cropH,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return canvas;
}

function sampleField(image, cols, rows, outputAspect, transform) {
  var transformed = transformImage(image, transform);
  var cropW = transformed.width;
  var cropH = transformed.width / outputAspect;
  if (cropH > transformed.height) {
    cropH = transformed.height;
    cropW = transformed.height * outputAspect;
  }
  var sample = document.createElement("canvas");
  sample.width = cols;
  sample.height = rows;
  var context = sample.getContext("2d", { willReadFrequently: true });
  context.fillStyle = "#000";
  context.fillRect(0, 0, cols, rows);
  context.drawImage(
    transformed,
    (transformed.width - cropW) / 2,
    (transformed.height - cropH) / 2,
    cropW,
    cropH,
    0,
    0,
    cols,
    rows
  );
  var data = context.getImageData(0, 0, cols, rows).data;
  var count = cols * rows;
  var lum = new Float32Array(count);
  var rgb = new Uint8ClampedArray(count * 3);
  for (var i = 0; i < count; i++) {
    var r = data[i * 4];
    var g = data[i * 4 + 1];
    var b = data[i * 4 + 2];
    lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    rgb[i * 3] = r;
    rgb[i * 3 + 1] = g;
    rgb[i * 3 + 2] = b;
  }
  return { cols: cols, rows: rows, lum: lum, rgb: rgb };
}

function tintSprite(mask, color) {
  var sprite = document.createElement("canvas");
  sprite.width = mask.width;
  sprite.height = mask.height;
  var context = sprite.getContext("2d");
  context.drawImage(mask, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.fillStyle = color;
  context.fillRect(0, 0, sprite.width, sprite.height);
  return sprite;
}

function buildAtlas(cellWidth, cellHeight, icon) {
  var width = Math.max(2, Math.round(cellWidth));
  var height = Math.max(2, Math.round(cellHeight));
  var rampLength = CONFIG.ramp.length;
  var masks = [];
  var sprites = [];
  for (var level = 0; level < GLYPH_LEVELS; level++) {
    var mask = document.createElement("canvas");
    mask.width = width;
    mask.height = height;
    var context = mask.getContext("2d");
    var drew = false;
    if (CONFIG.glyphMode === "icon" && icon) {
      var size = height * (level / (GLYPH_LEVELS - 1));
      if (size >= 0.6) {
        var t = CONFIG.iconTransform;
        var assetRotation = t ? t.rotationDeg : 0;
        var fitBase = CONFIG.iconRotationMapped
          ? Math.hypot(icon.width, icon.height)
          : Math.max(icon.width, icon.height);
        var fit = size / Math.max(1, fitBase);
        var mappedAngle = CONFIG.iconRotationMapped
          ? (level / GLYPH_LEVELS) * Math.PI * 2
          : 0;
        context.save();
        context.translate(width / 2, height / 2);
        context.rotate(mappedAngle + (assetRotation * Math.PI) / 180);
        context.scale(
          (t && t.flipH ? -1 : 1) * fit,
          (t && t.flipV ? -1 : 1) * fit
        );
        context.drawImage(icon, -icon.width / 2, -icon.height / 2);
        context.restore();
        drew = true;
      }
    } else if (CONFIG.glyphMode === "chars") {
      var glyph =
        CONFIG.ramp[
          Math.min(rampLength - 1, Math.floor((level / GLYPH_LEVELS) * rampLength))
        ] || " ";
      if (glyph !== " ") {
        context.font = height + "px ui-monospace, Menlo, Consolas, monospace";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillStyle = "#fff";
        context.fillText(glyph, width / 2, height / 2 + height * 0.02);
        drew = true;
      }
    }
    if (!drew) {
      masks.push(null);
      sprites.push(null);
      continue;
    }
    context.globalCompositeOperation = "source-in";
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    masks.push(mask);
    if (CONFIG.colorMode === "duo") {
      sprites.push(
        tintSprite(mask, phosphorDuoColor(CONFIG.duoDark, CONFIG.duoBright, level / (GLYPH_LEVELS - 1)))
      );
    } else {
      sprites.push(tintSprite(mask, CONFIG.mono));
    }
  }
  return { cellWidth: width, cellHeight: height, masks: masks, sprites: sprites };
}

var sourceScratch = null;

function drawFrame(context, atlas, field, revealLayer, width, height, progress) {
  var cols = field.cols;
  var rows = field.rows;
  var sourceColor = CONFIG.colorMode === "source";
  context.clearRect(0, 0, width, height);
  if (CONFIG.includeBackground) {
    context.fillStyle = CONFIG.background;
    context.fillRect(0, 0, width, height);
  }
  if (revealLayer && CONFIG.reveal > 0) {
    context.globalAlpha = Math.min(1, Math.max(0, CONFIG.reveal));
    context.drawImage(revealLayer, 0, 0, width, height);
    context.globalAlpha = 1;
  }
  var gridWidth = cols * atlas.cellWidth;
  var gridHeight = rows * atlas.cellHeight;
  var originX = Math.floor((width - gridWidth) / 2);
  var originY = Math.floor((height - gridHeight) / 2);
  var driftShift =
    CONFIG.motionMode === "drift" ? phosphorDriftShift(progress, CONFIG.cycles, rows) : 0;
  var maskCanvas = null;
  var maskContext = null;
  var tintCanvas = null;
  var tintContext = null;
  if (sourceColor) {
    // Reuse two shared scratch surfaces: allocating full-resolution canvases
    // inside every frame churns GC without changing a single output pixel.
    if (!sourceScratch) {
      sourceScratch = {
        mask: document.createElement("canvas"),
        tint: document.createElement("canvas"),
      };
    }
    maskCanvas = sourceScratch.mask;
    tintCanvas = sourceScratch.tint;
    if (maskCanvas.width !== width || maskCanvas.height !== height) {
      maskCanvas.width = width;
      maskCanvas.height = height;
      tintCanvas.width = width;
      tintCanvas.height = height;
    }
    maskContext = maskCanvas.getContext("2d");
    tintContext = tintCanvas.getContext("2d");
    maskContext.globalCompositeOperation = "source-over";
    tintContext.globalCompositeOperation = "source-over";
    maskContext.clearRect(0, 0, width, height);
    tintContext.clearRect(0, 0, width, height);
  }
  for (var y = 0; y < rows; y++) {
    var drawY = originY + y * atlas.cellHeight;
    var sampleRow = driftShift > 0 ? (y + driftShift) % rows : y;
    for (var x = 0; x < cols; x++) {
      var index = sampleRow * cols + x;
      var offset = phosphorMotionOffset(
        CONFIG.motionMode, x, y, progress, CONFIG.cycles, CONFIG.intensity, rows
      );
      var tone = phosphorTone(
        field.lum[index] + offset, CONFIG.contrast, CONFIG.brightness, CONFIG.invert
      );
      var level = phosphorLevel(tone, GLYPH_LEVELS);
      if (level === 0) continue;
      var drawX = originX + x * atlas.cellWidth;
      if (sourceColor && maskContext && tintContext) {
        var m = atlas.masks[level];
        if (m) {
          maskContext.drawImage(m, drawX, drawY);
          tintContext.fillStyle =
            "rgb(" + field.rgb[index * 3] + "," + field.rgb[index * 3 + 1] + "," + field.rgb[index * 3 + 2] + ")";
          tintContext.fillRect(drawX, drawY, atlas.cellWidth, atlas.cellHeight);
        }
        continue;
      }
      var sprite = atlas.sprites[level];
      if (sprite) context.drawImage(sprite, drawX, drawY);
    }
  }
  if (sourceColor && maskCanvas && tintCanvas && tintContext) {
    tintContext.globalCompositeOperation = "destination-in";
    tintContext.drawImage(maskCanvas, 0, 0);
    tintContext.globalCompositeOperation = "source-over";
    context.drawImage(tintCanvas, 0, 0);
  }
  if (CONFIG.scanlines) {
    var lineSpacing = Math.max(3, Math.round(atlas.cellHeight / 4));
    context.fillStyle = "rgba(0,0,0,0.28)";
    for (var lineY = 0; lineY < height; lineY += lineSpacing) {
      context.fillRect(0, lineY, width, 1);
    }
  }
}

function loadImage(url) {
  return new Promise(function (resolve, reject) {
    if (!url) {
      resolve(null);
      return;
    }
    var image = new Image();
    image.onload = function () { resolve(image); };
    image.onerror = function () { reject(new Error("PHOSPHOR: image failed to load.")); };
    image.src = url;
  });
}

/* --------------------------------- boot ---------------------------------- */

function themeFor(element) {
  return element.closest && element.closest(".theme-dark") ? "dark" : "light";
}

/*
 * Live instances. A canvas that gets removed from the DOM (e.g. when a modal
 * empties its content) is pruned, which disconnects its observers and stops
 * its animation frames — otherwise every modal open would leak a running loop.
 */
var INSTANCES = [];
var PAGE_VISIBLE = !document.hidden;

function pruneInstances() {
  var alive = [];
  for (var i = 0; i < INSTANCES.length; i++) {
    if (INSTANCES[i].canvas.isConnected) alive.push(INSTANCES[i]);
    else INSTANCES[i].destroy();
  }
  INSTANCES = alive;
}

document.addEventListener("visibilitychange", function () {
  PAGE_VISIBLE = !document.hidden;
  pruneInstances();
  for (var i = 0; i < INSTANCES.length; i++) INSTANCES[i].syncRunning();
});

function initCanvas(canvas, sources, icon) {
  var scale = Math.min(2, window.devicePixelRatio || 1);
  var backingWidth = Math.round(CONFIG_BASE.width * scale);
  var backingHeight = Math.round(CONFIG_BASE.height * scale);
  canvas.width = backingWidth;
  canvas.height = backingHeight;
  canvas.style.aspectRatio = CONFIG_BASE.width + " / " + CONFIG_BASE.height;
  var context = canvas.getContext("2d");

  var cellHeight = Math.max(2, CONFIG_BASE.cell);
  var cellWidth =
    CONFIG_BASE.glyphMode === "icon"
      ? cellHeight
      : Math.max(1, Math.round(cellHeight * CHAR_CELL_ASPECT));
  var cols = Math.max(4, Math.floor(CONFIG_BASE.width / cellWidth));
  var rows = Math.max(4, Math.floor(CONFIG_BASE.height / cellHeight));

  /* Per-theme caches so switching back and forth is instant. */
  var fields = {};
  var atlases = {};
  var revealLayers = {};

  var cfg = null;
  var theme = null;
  var field = null;
  var atlas = null;
  var revealLayer = null;

  var startedAt = performance.now();
  var lastStateKey = null;
  var running = false;
  var onScreen = true;
  var observer = null;

  function applyTheme(next) {
    if (next === theme) return;
    theme = next;
    cfg = mergeConfig(next);
    CONFIG = cfg;
    if (!fields[next]) {
      fields[next] = sampleField(
        sources[next], cols, rows, cfg.width / cfg.height, cfg.sourceTransform
      );
    }
    field = fields[next];
    if (!atlases[next]) {
      atlases[next] = buildAtlas(cellWidth * scale, cellHeight * scale, icon);
    }
    atlas = atlases[next];
    if (cfg.reveal > 0) {
      if (!revealLayers[next]) {
        revealLayers[next] = coverCrop(
          transformImage(sources[next], cfg.sourceTransform), backingWidth, backingHeight
        );
      }
      revealLayer = revealLayers[next];
    } else {
      revealLayer = null;
    }
    /* Redraw right away so a theme switch never shows a stale frame. */
    var progress = ((performance.now() - startedAt) / 1000 / cfg.loopSeconds) % 1;
    drawFrame(context, atlas, field, revealLayer, backingWidth, backingHeight, progress);
    lastStateKey = phosphorMotionStateKey(
      cfg.motionMode, progress, cfg.cycles, cfg.intensity, rows
    );
  }

  // Auto-plays immediately and loops forever: progress wraps every
  // loopSeconds, and every motion phase advances an integer number of
  // cycles per loop, so the wrap frame equals frame zero — a seamless loop.
  //
  // Efficiency (none of it changes a single output pixel):
  // - identical frames are skipped: jitter/drift/off quantize motion into
  //   discrete states, so the composite only runs when the state key changes
  //   (wave/scan advance continuously and keep drawing every frame);
  // - rendering pauses while the canvas is off-screen or the tab is hidden,
  //   and stops for good once the canvas leaves the DOM.
  // Progress derives from the wall clock, so skipping or pausing never
  // desyncs the loop — it resumes exactly where it would have been.
  function tick(now) {
    if (!running) return;
    if (!canvas.isConnected) {
      running = false;
      return;
    }
    CONFIG = cfg;
    var progress = ((now - startedAt) / 1000 / cfg.loopSeconds) % 1;
    var stateKey = phosphorMotionStateKey(
      cfg.motionMode, progress, cfg.cycles, cfg.intensity, rows
    );
    if (stateKey !== lastStateKey) {
      lastStateKey = stateKey;
      drawFrame(context, atlas, field, revealLayer, backingWidth, backingHeight, progress);
    }
    requestAnimationFrame(tick);
  }

  function syncRunning() {
    var shouldRun = onScreen && PAGE_VISIBLE && canvas.isConnected;
    if (shouldRun && !running) {
      running = true;
      requestAnimationFrame(tick);
    } else if (!shouldRun) {
      running = false;
    }
  }

  /* First frame right away so the canvas is never blank, even off-screen. */
  applyTheme(themeFor(canvas));

  if (typeof IntersectionObserver === "function") {
    observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        onScreen = entries[i].isIntersecting;
      }
      syncRunning();
    });
    observer.observe(canvas);
  }
  syncRunning();

  return {
    canvas: canvas,
    syncRunning: syncRunning,
    refreshTheme: function () { applyTheme(themeFor(canvas)); },
    destroy: function () {
      running = false;
      if (observer) observer.disconnect();
      canvas.__phosphorInit = false;
    }
  };
}

/* Images are decoded once; every later init reuses the same decoded bitmaps. */
var assetsPromise = null;

function loadAssets() {
  if (!assetsPromise) {
    assetsPromise = Promise.all([
      loadImage(SOURCE_URLS.dark),
      loadImage(SOURCE_URLS.light),
      loadImage(ICON_URL)
    ]);
  }
  return assetsPromise;
}

/* Re-check the theme whenever any class changes in the document, so a
   runtime "theme-dark" toggle switches the animation live. Started once. */
var themeObserverStarted = false;

function startThemeObserver() {
  if (themeObserverStarted || typeof MutationObserver !== "function") return;
  themeObserverStarted = true;
  new MutationObserver(function () {
    pruneInstances();
    for (var i = 0; i < INSTANCES.length; i++) INSTANCES[i].refreshTheme();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
    subtree: true
  });
}

/*
 * Initialise every not-yet-running canvas.phosphor-ascii inside `root`
 * (the whole document if omitted). Safe to call as often as you like —
 * canvases that are already running are skipped, so calling it after
 * injecting markup only picks up the new ones.
 */
function initPhosphorAscii(root) {
  var scope = root || document;
  var found = [];

  if (scope.nodeType === 1 && scope.matches && scope.matches("canvas.phosphor-ascii")) {
    found.push(scope);
  }
  if (scope.querySelectorAll) {
    var matches = scope.querySelectorAll("canvas.phosphor-ascii");
    for (var i = 0; i < matches.length; i++) found.push(matches[i]);
  }

  pruneInstances();

  var pending = [];
  for (var j = 0; j < found.length; j++) {
    if (!found[j].__phosphorInit) {
      found[j].__phosphorInit = true;
      pending.push(found[j]);
    }
  }
  if (!pending.length) return Promise.resolve([]);

  return loadAssets().then(function (loaded) {
    var sources = { dark: loaded[0], light: loaded[1] };
    var icon = loaded[2];
    var made = [];
    for (var k = 0; k < pending.length; k++) {
      /* Content may have been swapped out again while images resolved. */
      if (!pending[k].isConnected) {
        pending[k].__phosphorInit = false;
        continue;
      }
      var instance = initCanvas(pending[k], sources, icon);
      INSTANCES.push(instance);
      made.push(instance);
    }
    startThemeObserver();
    return made;
  });
}

/* Public hook — call this after injecting markup that contains a canvas. */
window.initPhosphorAscii = initPhosphorAscii;

function boot() {
  initPhosphorAscii(document);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

})();