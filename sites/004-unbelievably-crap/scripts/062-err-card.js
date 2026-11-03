/* ==========================================================================
   err-card.js — the 404's ticket, drawn once into a texture.

   THE WHOLE PAGE IS ONE WEBGL LAYER, and this file is the part of it that is
   still a drawing rather than a shader. It paints the Figma component
   (14781:11717) into a 2D canvas at 462x1050 times a scale, and js/err.js
   uploads that canvas as a texture and tiles it across the screen.

   WHY NOT DOM. The field is infinite and the codepen effect the brief asks for
   is a POST effect — it reads the finished picture as a texture and warps it.
   Over DOM that means rasterising the document every frame with a capture
   library, which is the expensive way to do it and the reason VFX-JS pages
   stutter. A card that never changes only has to be drawn ONCE; after that the
   whole field, the mirroring, the camera and the CRT are four lines of shader
   over one texture. Nothing is re-rasterised while the pointer moves.

   EVERY NUMBER BELOW IS THE FIGMA NUMBER, card-relative. The component sits at
   x=729 y=20 in its own frame, so each coordinate here is that node's x minus
   729 and its y minus 20 — which is also, checked against the assembled page
   (14781:15649), that node's position inside a card whose top-left is the
   card's own origin. The two frames agree on every landmark I sampled.
   ========================================================================== */
(function () {
  'use strict';

  /* THE CARD'S OWN SIZE, and the grid's. 462 + 10 = 472 across, 1050 + 10 =
     1060 down: the "10px spacing on both sides" in the brief is a GUTTER, and
     the card is the full 462x1050 with no padding of its own. */
  const W = 462, H = 1050;

  /* Type. Every text node in the component reports a 5px box and the rows step
     by 11, which is a 7px face on an 11px line — PP Supply Mono, the site's
     own, uppercase. The advance works out at 0.6em, i.e. 4.2px per character,
     against a measured 4.23 on the longest string in the design (57 characters
     in 241px). That is the check that settles the size: a face one step bigger
     or smaller misses that by more than a character across the line. */
  const FONT = 'PP Supply Mono';
  /* 7.5, AND THE HALF IS NOT A ROUNDING. PP Supply Mono advances 4/7 of its
     size per character, so at 7px a line measures 4.0px per glyph. Figma's two
     LONG strings — the 57-character header and the 36-character strip — come
     out at 4.228 and 4.306 per character, and long strings are the ones to
     trust: a short label sits in a box with slack, and its reported width is
     the box, not the ink. 4.28 per character is a 7.5px face, and it also puts
     the cap height at 5.25 against the 5 every text node reports.

     It matters most where text is RIGHT-ALIGNED — "unititled>user", "active",
     the six DONEs. At 7px those ended up starting 12px right of where the
     design puts them, which is a third of a word. */
  const SIZE = 7.5;
  const LEAD = 11;      // the row step in the login/rollback block

  /* Left, right-aligned, and the three colours. The card is red with black ink
     and one black bar with red type in it — the only inversion on the page. */
  const RED = '#e8271c', INK = '#000000';

  const L = (x, y, s) => ({ a: 'l', x, y, s });
  const R = (x, y, s) => ({ a: 'r', x, y, s });

  /* ---- the ticket, top to bottom ---------------------------------------- */
  const TEXT = [
    L(0,     0,   '//'),
    L(110,   0,   'you are lost. here’s your ticket back home, my wayward son'),
    R(462,   0,   '//'),

    L(0,     37,  'project 0309'),
    L(88,    37,  'access rejected'),
    R(462,   37,  'unititled>user'),
    L(0,     48,  'terminal'),
    L(88,    48,  '0'),
    L(141,   48,  '666'),

    L(0,     120.2, 'warning'),
    L(328,   120.2, 'protocol 0309'),
    L(401,   120.2, 'access denied'),
    R(462,   151.2, '11.09.2026'),

    L(0,     188.2, '//'),

    L(0,     319, 'status'),
    R(462,   319, 'active'),
    R(462,   388, '12:20'),
  ];

  /* The run of six. Three columns that all step together, so they are a loop
     rather than eighteen lines that can drift apart when one is edited. */
  const RUN = ['login', 'rollback', 'push', 'new git', 'pr request', 'submit'];
  const VAL = ['12:40', 'done', 'done', 'done', 'done', 'done'];
  for (let i = 0; i < 6; i++){
    const y = 188.2 + LEAD * i;
    TEXT.push(L(201, y, '00' + i), L(328, y, RUN[i]), R(462, y, VAL[i]));
  }

  /* The logo block: 462x462, sitting on the card's bottom edge (588 + 462 =
     1050). Its type is positioned inside it, so these are written as the
     block's own coordinates plus its origin — the way the component nests
     them, so moving the block moves its labels with it. */
  const LOGO_Y = 588;
  TEXT.push(
    L(0,   LOGO_Y + 0,   '666'),
    L(26,  LOGO_Y + 0,   '//'),
    L(321, LOGO_Y + 0,   '000'),
    L(321, LOGO_Y + 37,  'through all possible traces'),
    L(321, LOGO_Y + 48,  'you stumbled upon a certain one'),
    L(321, LOGO_Y + 59,  'that noone escapes from'),
    L(321, LOGO_Y + 183, 'right?'),
    L(0,   LOGO_Y + 267, 'you must be so damn lost..'),
    L(0,   LOGO_Y + 457, '000'),
    L(332, LOGO_Y + 457, 'see ya around')
  );

  /* The three dotted rules. 35 stars at a 13.4918 pitch is not a round number
     and it is not meant to be: it is 462 divided into 34 gaps, i.e. a rule
     that spans the card exactly whatever the star's own size is. */
  const RULES = [85, 280.2, 424];
  const STAR_N = 35, STAR_PITCH = 13.4917602539062;

  /* ---- drawing ----------------------------------------------------------- */

  function paths(ctx, art, x, y, w, h){
    const sx = w / art.w, sy = h / art.h;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, sy);
    for (const d of art.d) ctx.fill(new Path2D(d));
    ctx.restore();
  }

  /* THE ONE DRAW. Called once at mount and again only on a scale change, which
     is a resize — never per frame, and that is the whole performance argument
     for this page. */
  function drawCard(ctx, S, C){
    const A = window.ERR_ART;
    ctx.save();
    ctx.scale(S, S);

    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = C.ink;
    ctx.font = SIZE + 'px "' + FONT + '", ui-monospace, monospace';
    ctx.textBaseline = 'top';

    for (const t of TEXT){
      const s = t.s.toUpperCase();
      ctx.textAlign = t.a === 'r' ? 'right' : 'left';
      /* THE HALF-PIXEL. Figma reports a text node's box, not its baseline, and
         the box is the line — so the glyphs sit a touch below its top. Measured
         against the render rather than assumed. */
      ctx.fillText(s, t.x, t.y - 1);
    }
    ctx.textAlign = 'left';

    for (const y of RULES)
      for (let i = 0; i < STAR_N; i++)
        paths(ctx, A.STAR, i * STAR_PITCH, y, 3.28, 3.2);

    /* Three hearts, at the component's own 13.886 pitch — which is the glyph's
       11.109 plus a 2.777 gap, not the star rule's spacing. */
    for (let i = 0; i < 3; i++)
      paths(ctx, A.HEART, 328 + i * 13.8859, 35, 11.1088, 9);

    /* (0, 131.2), AND I GOT THIS WRONG TWICE BEFORE LOOKING AT IT.

       The barcode's node reports x=148 y=25 — which are its own WIDTH and
       HEIGHT, not a position, and read as coordinates they put it in the
       middle of the card on top of the row numbers. The other reading, off the
       assembled page, gave y=168 and was no better.

       So I rendered the block that contains it (Figma 14781:17708, the 462x152
       strip that holds the barcode, the date, the six rows and the rule under
       them) and looked: the barcode sits hard against that strip's TOP LEFT
       corner. The strip begins at 131.2 from the card's top, so the barcode is
       at (0, 131.2) and nowhere else. The component's own render agrees to the
       pixel — it always did.

       The lesson is cheap and worth writing down: a metadata dump that mixes
       absolute and relative coordinates will happily hand you a plausible
       wrong number twice in a row, and one picture of the node settles it. */
    paths(ctx, A.BARCODE, 0, 131.2, 148, 25);

    paths(ctx, A.LOGO, 0, LOGO_Y, 462, 462);

    /* THE GO HOME BAR IS NOT DRAWN HERE, and that is the one deliberate hole
       in this texture. It has to be clickable and it has to carry the site's
       scramble hover, and neither is possible inside a picture — so js/err.js
       puts a real <a> over every place a bar lands and moves them with the
       camera. Its geometry lives here so both halves agree on it. */

    ctx.restore();
  }

  window.ERR_CARD = { W, H, PITCH_X: 472, PITCH_Y: 1060,
                      BAR: { x: 0, y: 438, w: 462, h: 16, tx: 10, ty: 5.5 },
                      draw: drawCard };
})();
