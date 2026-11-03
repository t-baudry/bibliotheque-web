/* ==========================================================================
   data.js — the project list behind the work field.

   One entry per photograph. The field repeats these across its cells, so two
   cards showing the same picture resolve to the same project — the number and
   the year follow the picture, not the cell — which keeps the grid's size free
   to tune without inventing data.

   THE PICTURES ARE WEBP, and that is a measured choice rather than a fashion.
   Against JPEG at a matched quality setting on this exact set: 32% smaller AND
   marginally better, and it carries the four shots that have real transparency,
   which JPEG cannot represent at all. They are 1400px on the long edge, which
   is roughly a retina card at this page's zoom — see
   tools/optimise-images.command for the pipeline.

   PLATFORM, YEAR AND AWARDS ARE PLACEHOLDERS. The year is the one that shows,
   in each card's microtype; the rest is carried for the older pages. Correct
   them when the real details are to hand — they are yours to state and not
   mine to guess.
   ========================================================================== */
window.PROJECTS = [
  { n:'001', img:'assets/work/bitnest.webp',            platform:'BEHANCE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'002', img:'assets/work/bitnest-grid.webp',       platform:'DRIBBBLE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'003', img:'assets/work/gallery-forest.webp',     platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'004', img:'assets/work/mystique.webp',           platform:'BEHANCE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'005', img:'assets/work/wilde.webp',              platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'006', img:'assets/work/tp7.webp',                platform:'DRIBBBLE', year:'2024',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'007', img:'assets/work/argos.webp',              platform:'BEHANCE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'008', img:'assets/work/lumon-industries.webp',   platform:'DRIBBBLE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'009', img:'assets/work/lumon-punch.webp',        platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'010', img:'assets/work/masters-art.webp',        platform:'BEHANCE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'011', img:'assets/work/maestro-classic.webp',    platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'012', img:'assets/work/maestro-tray.webp',       platform:'DRIBBBLE', year:'2024',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'013', img:'assets/work/the-market.webp',         platform:'BEHANCE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'014', img:'assets/work/tp7-system.webp',         platform:'DRIBBBLE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'015', img:'assets/work/ghirardelli.webp',        platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'016', img:'assets/work/chosen-by.webp',          platform:'BEHANCE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'017', img:'assets/work/full-service.webp',       platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'018', img:'assets/work/ninety-two.webp',         platform:'DRIBBBLE', year:'2024',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'019', img:'assets/work/bieber-tour.webp',        platform:'BEHANCE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'020', img:'assets/work/our-teammates.webp',      platform:'DRIBBBLE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'021', img:'assets/work/marcel-breuer.webp',      platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'022', img:'assets/work/phone-ui.webp',           platform:'BEHANCE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'023', img:'assets/work/instax-evo.webp',         platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'024', img:'assets/work/our-locations.webp',      platform:'DRIBBBLE', year:'2024',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'025', img:'assets/work/jamie-cunningham.webp',   platform:'BEHANCE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'026', img:'assets/work/snacks-coffee.webp',      platform:'DRIBBBLE', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'027', img:'assets/work/emerging-systems.webp',   platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'028', img:'assets/work/daoism-systems.webp',     platform:'BEHANCE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'029', img:'assets/work/daoism-services.webp',    platform:'DRIBBBLE', year:'2025',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },
  { n:'030', img:'assets/work/the-gallery.webp',        platform:'DRIBBBLE', year:'2024',
    awards:{ awwwwards:'N/A', fwa:'N/A', css:'N/A', orpetron:'N/A' } },

  /* ---- THE TWO AWARDED SITES ---------------------------------------------
     These eleven are not placeholders. Unbelievably Crap and Nocturnal Dream
     are both live and both carry real counts, so their `awards` are the real
     figures rather than N/A: the four slots this panel has are totals per
     body, which is why CSSDA reads X4 and X5 — four and five separate awards,
     not four and five sites.

     ONE PROJECT IS SEVERAL PICTURES ON PURPOSE. The field repeats entries
     across its cells and reads the project back off the IMAGE, so six frames
     of one site are six cards that all resolve to the same numbers. That is
     the existing behaviour, used here deliberately rather than worked around:
     a site with six good screens earns six cells.
     ------------------------------------------------------------------------ */
  { n:'031', img:'assets/work/crap-home.webp',        platform:'AWWWARDS', year:'2026',
    awards:{ awwwwards:'X1', fwa:'X1', css:'X4', orpetron:'X2' } },
  { n:'032', img:'assets/work/crap-head.webp',        platform:'AWWWARDS', year:'2026',
    awards:{ awwwwards:'X1', fwa:'X1', css:'X4', orpetron:'X2' } },
  { n:'033', img:'assets/work/crap-work.webp',        platform:'AWWWARDS', year:'2026',
    awards:{ awwwwards:'X1', fwa:'X1', css:'X4', orpetron:'X2' } },
  { n:'034', img:'assets/work/crap-gallery.webp',     platform:'AWWWARDS', year:'2026',
    awards:{ awwwwards:'X1', fwa:'X1', css:'X4', orpetron:'X2' } },
  { n:'035', img:'assets/work/crap-exit.webp',        platform:'AWWWARDS', year:'2026',
    awards:{ awwwwards:'X1', fwa:'X1', css:'X4', orpetron:'X2' } },
  { n:'036', img:'assets/work/crap-error.webp',       platform:'AWWWARDS', year:'2026',
    awards:{ awwwwards:'X1', fwa:'X1', css:'X4', orpetron:'X2' } },
  { n:'037', img:'assets/work/nocturnal-desert.webp', platform:'THE FWA', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'X1', css:'X5', orpetron:'X2' } },
  { n:'038', img:'assets/work/nocturnal-church.webp', platform:'THE FWA', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'X1', css:'X5', orpetron:'X2' } },
  { n:'039', img:'assets/work/nocturnal-street.webp', platform:'THE FWA', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'X1', css:'X5', orpetron:'X2' } },
  { n:'040', img:'assets/work/nocturnal-disc.webp',   platform:'THE FWA', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'X1', css:'X5', orpetron:'X2' } },
  { n:'041', img:'assets/work/nocturnal-storage.webp', platform:'THE FWA', year:'2026',
    awards:{ awwwwards:'N/A', fwa:'X1', css:'X5', orpetron:'X2' } },
];
