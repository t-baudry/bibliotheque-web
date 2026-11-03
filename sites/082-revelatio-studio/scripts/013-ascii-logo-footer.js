/**
 * Revelatio — ASCII logo footer effect
 *
 * Webflow integration:
 * 1. Set `.footer_logo` to width 100%, height 10em, position relative.
 * 2. Keep or remove the static logo inside — the script hides it automatically.
 * 3. Add before </body>:
 *    <script src="https://revelatio.vercel.app/scripts/ascii-logo-footer.js" defer></script>
 *
 * Optional: use `[data-ascii-logo]` on any container instead of `.footer_logo`.
 * Optional: `data-ascii-align="left"` or `"center"` (default: left desktop, center mobile).
 */

const LOGO_SVG = `<svg width="1766" height="204" viewBox="0 0 1766 204" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.9606 89.0666C26.5105 80.4877 30.0604 73.9341 33.6103 69.474C37.1601 64.9911 42.1892 61.6233 48.7428 59.3932C55.2737 57.1632 64.4215 56.0254 76.1861 56.0254V78.9859C73.9561 78.8038 70.8613 78.7128 66.9473 78.7128C50.3357 78.7128 38.753 82.5813 32.2222 90.341C25.6913 98.0779 22.4145 110.821 22.4145 128.57V201.662H0.00012207V58.2554H22.4145V69.4512C22.4145 75.0491 21.4815 80.647 19.6155 86.2449C19.0466 87.7468 18.7736 88.9073 18.7736 89.7493C18.7736 90.5913 19.2287 91.0919 20.1844 91.2967H20.4575C21.3905 91.2967 22.2324 90.5458 22.9834 89.0666H22.9606Z" fill="white"/>
<path d="M103.567 135.554C103.931 144.133 106.047 152.12 109.87 159.493C113.693 166.866 119.063 172.759 125.981 177.128C132.899 181.52 140.909 183.705 150.056 183.705C167.783 183.705 179.639 173.988 185.624 154.578H209.153C207.287 162.974 203.828 170.916 198.799 178.38C193.747 185.844 187.034 191.965 178.638 196.721C170.241 201.477 160.433 203.866 149.237 203.866C135.242 203.866 123.136 200.499 112.965 193.786C102.793 187.073 95.0332 178.107 89.7311 166.911C84.4063 155.715 81.7439 143.382 81.7439 129.933C81.7439 115.37 84.5428 102.49 90.1407 91.2941C95.7386 80.0983 103.635 71.4056 113.807 65.2388C123.978 59.072 135.607 56 148.668 56C159.5 56 169.717 58.4804 179.343 63.4184C188.969 68.3563 196.751 76.0705 202.736 86.5154C208.721 96.9602 211.702 110.045 211.702 125.723C211.702 128.909 211.519 132.163 211.133 135.531H103.589L103.567 135.554ZM104.682 117.622H189.264C188.331 104.356 184.417 93.9565 177.5 86.4016C170.582 78.8467 161.525 75.0693 150.33 75.0693C135.948 75.0693 125.162 78.9377 117.994 86.6974C110.803 94.4343 106.366 104.765 104.682 117.645V117.622Z" fill="white"/>
<path d="M278.462 181.91C279.031 183.685 279.304 185.415 279.304 187.099C279.304 189.329 280.055 190.466 281.534 190.466C283.014 190.466 283.765 189.351 283.765 187.099C283.765 185.415 284.038 183.685 284.607 181.91C285.175 180.135 285.54 178.975 285.722 178.406L326.34 58.2559H350.985L299.466 201.639H263.626L212.107 58.2559H236.751L277.37 178.406C277.552 178.975 277.939 180.135 278.485 181.91H278.462Z" fill="white"/>
<path d="M372.489 135.554C372.854 144.133 374.97 152.12 378.793 159.493C382.616 166.866 387.986 172.759 394.904 177.128C401.822 181.52 409.831 183.705 418.979 183.705C436.706 183.705 448.562 173.988 454.546 154.578H478.076C476.21 162.974 472.751 170.916 467.722 178.38C462.67 185.844 455.957 191.965 447.56 196.721C439.164 201.477 429.356 203.866 418.16 203.866C404.165 203.866 392.059 200.499 381.888 193.786C371.716 187.073 363.956 178.107 358.654 166.911C353.329 155.715 350.667 143.382 350.667 129.933C350.667 115.37 353.466 102.49 359.064 91.2941C364.661 80.0983 372.558 71.4056 382.729 65.2388C392.901 59.072 404.529 56 417.591 56C428.423 56 438.64 58.4804 448.266 63.4184C457.892 68.3563 465.674 76.0705 471.659 86.5154C477.643 96.9602 480.624 110.045 480.624 125.723C480.624 128.909 480.442 132.163 480.055 135.531H372.512L372.489 135.554ZM373.604 117.622H458.187C457.254 104.356 453.34 93.9565 446.423 86.4016C439.505 78.8467 430.448 75.0693 419.252 75.0693C404.871 75.0693 394.085 78.9377 386.917 86.6974C379.726 94.4343 375.288 104.765 373.604 117.645V117.622Z" fill="white"/>
<path d="M524.961 201.638H502.547V0H524.961V201.638Z" fill="white"/>
<path d="M611.107 117.053C624.374 116.303 634.068 115.051 640.235 113.276C646.401 111.501 649.382 107.724 649.2 101.944C649.018 94.6619 646.174 88.3586 640.667 83.0337C635.16 77.7089 625.125 75.0465 610.561 75.0465C598.797 75.0465 589.785 77.5269 583.527 82.4649C577.27 87.4028 573.583 93.5241 572.468 100.806H550.623C553.058 85.6734 559.907 74.4321 571.217 67.0593C582.504 59.6864 596.384 56 612.814 56C631.292 56 645.719 60.5739 656.073 69.7217C666.426 78.8695 671.615 95.5721 671.615 119.852V201.636H649.2V185.685C649.2 180.838 650.133 175.604 651.999 170.006C652.568 168.891 652.841 167.776 652.841 166.638C652.841 165.5 652.386 164.863 651.43 164.681H650.862C649.747 164.681 648.996 165.523 648.631 167.207C644.9 178.608 638.027 187.551 628.038 194.081C618.048 200.612 606.42 203.889 593.176 203.889C584.779 203.889 576.974 202.069 569.783 198.428C562.592 194.787 556.858 189.735 552.557 183.295C548.256 176.855 546.117 169.619 546.117 161.586C546.117 135.44 562.911 120.876 596.521 117.895L611.085 117.053H611.107ZM609.696 134.143L597.09 136.1C587.76 137.602 580.66 140.196 575.813 143.951C570.966 147.683 568.531 153.098 568.531 160.198C568.531 167.298 571.012 172.987 575.95 177.834C580.888 182.681 588.033 185.116 597.363 185.116C612.678 185.116 625.079 179.654 634.614 168.732C644.126 157.809 648.996 142.085 649.178 121.536C646.197 125.086 641.668 127.658 635.592 129.228C629.517 130.821 620.892 132.459 609.696 134.12V134.143Z" fill="white"/>
<path d="M732.58 161.311C732.58 169.526 733.832 175.124 736.358 178.105C738.884 181.086 743.958 182.588 751.627 182.588H772.904V201.634H751.627C741.364 201.634 733.286 200.428 727.392 197.993C721.521 195.559 717.175 191.326 714.376 185.25C711.577 179.174 710.166 170.641 710.166 159.627V77.2973H683.292V58.2508H710.166V17.9277H732.58V58.2508H772.904V77.2973H732.58V161.311Z" fill="white"/>
<path d="M815.722 0V29.1273H791.078V0H815.722ZM814.607 58.2545V201.638H792.193V58.2545H814.607Z" fill="white"/>
<path d="M961.788 92.571C967.204 103.858 969.912 116.328 969.912 129.959C969.912 143.589 967.204 156.059 961.788 167.346C956.372 178.633 948.59 187.553 938.395 194.084C928.224 200.615 916.322 203.892 902.692 203.892C889.061 203.892 877.16 200.615 866.988 194.084C856.816 187.553 849.011 178.633 843.595 167.346C838.179 156.059 835.471 143.589 835.471 129.959C835.471 116.328 838.179 103.858 843.595 92.571C849.011 81.2842 856.794 72.364 866.988 65.8331C877.16 59.3022 889.061 56.0254 902.692 56.0254C916.322 56.0254 928.224 59.3022 938.395 65.8331C948.567 72.364 956.372 81.2842 961.788 92.571ZM947.498 129.959C947.498 114.644 943.493 101.855 935.46 91.5925C927.427 81.3297 916.504 76.1869 902.692 76.1869C888.879 76.1869 877.956 81.3297 869.924 91.5925C861.891 101.855 857.886 114.644 857.886 129.959C857.886 145.273 861.891 158.062 869.924 168.325C877.956 178.587 888.879 183.73 902.692 183.73C916.504 183.73 927.427 178.587 935.46 168.325C943.493 158.062 947.498 145.273 947.498 129.959Z" fill="white"/>
<path d="M1103.92 184.843C1112.7 184.843 1119.87 183.591 1125.49 181.065C1131.09 178.539 1135.12 175.513 1137.53 171.963C1139.96 168.413 1141.17 164.863 1141.17 161.313C1141.17 156.466 1139.83 152.621 1137.12 149.822C1134.41 147.023 1129.7 144.679 1122.97 142.813C1116.25 140.947 1106.44 139.263 1093.57 137.761C1078.64 136.077 1067.1 131.822 1058.98 125.018C1050.85 118.214 1046.8 109.931 1046.8 100.237C1046.8 92.7732 1049.03 85.6734 1053.52 78.9605C1058 72.2476 1064.53 66.7407 1073.11 62.4399C1081.69 58.139 1091.88 56 1103.62 56C1120.62 56 1133.91 60.3463 1143.54 69.0162C1153.16 77.7089 1158.42 89.0412 1159.35 103.036H1137.23C1136.66 95.0032 1133.77 88.3358 1128.54 83.011C1123.31 77.6862 1114.73 75.0237 1102.78 75.0237C1090.83 75.0237 1082.94 77.3221 1077.43 81.8732C1071.92 86.4471 1069.17 91.6354 1069.17 97.4153C1069.17 100.783 1070.01 103.764 1071.7 106.381C1073.38 108.998 1077.07 111.478 1082.76 113.799C1088.45 116.143 1097 117.964 1108.38 119.261C1126.31 121.491 1139.99 125.61 1149.41 131.594C1158.83 137.579 1163.54 146.067 1163.54 157.081C1163.54 171.644 1158.08 183.068 1147.15 191.396C1136.23 199.725 1121.44 203.866 1102.76 203.866C1084.08 203.866 1070.04 199.247 1059.5 190.008C1048.96 180.769 1043.3 168.208 1042.55 152.348H1064.39C1064.57 161.313 1067.85 168.959 1074.2 175.308C1080.55 181.657 1090.45 184.82 1103.9 184.82L1103.92 184.843Z" fill="white"/>
<path d="M1218.69 161.311C1218.69 169.526 1219.94 175.124 1222.46 178.105C1224.99 181.086 1230.06 182.588 1237.73 182.588H1259.01V201.634H1237.73C1227.47 201.634 1219.39 200.428 1213.5 197.993C1207.63 195.559 1203.28 191.326 1200.48 185.25C1197.68 179.174 1196.27 170.641 1196.27 159.627V77.2973H1169.38V58.2508H1196.27V17.9277H1218.69V58.2508H1259.01V77.2973H1218.69V161.311Z" fill="white"/>
<path d="M1276.27 143.389V58.2598H1298.69V142.274C1298.69 157.952 1301.76 168.966 1307.93 175.315C1314.09 181.664 1322.67 184.827 1333.69 184.827C1341.15 184.827 1348.39 182.529 1355.39 177.977C1362.4 173.403 1368.14 166.918 1372.62 158.521C1377.1 150.124 1379.33 140.499 1379.33 129.667V58.2598H1401.75V201.643H1379.33V189.606C1379.33 184.19 1380.27 179.047 1382.13 174.2C1382.31 173.836 1382.61 173.176 1382.97 172.243C1383.34 171.31 1383.5 170.514 1383.38 169.854C1383.29 169.194 1382.86 168.784 1382.13 168.602H1381.56C1380.27 168.602 1379.42 169.262 1379.04 170.559C1377.35 175.611 1374.19 180.685 1369.53 185.828C1364.86 190.971 1359.04 195.249 1352.03 198.708C1345.02 202.167 1337.51 203.896 1329.48 203.896C1312.48 203.896 1299.37 198.958 1290.13 189.059C1280.89 179.161 1276.27 163.937 1276.27 143.412V143.389Z" fill="white"/>
<path d="M1535.4 201.638V189.304C1535.4 184.458 1536.33 179.497 1538.2 174.468C1538.77 172.966 1539.08 171.805 1539.18 170.963C1539.27 170.121 1538.95 169.507 1538.2 169.143L1537.36 168.87C1536.24 168.87 1535.4 169.712 1534.83 171.396C1531.46 181.477 1525.45 189.418 1516.76 195.198C1508.07 200.978 1498.03 203.891 1486.66 203.891C1474.53 203.891 1463.65 200.705 1454.02 194.379C1444.4 188.03 1436.89 179.201 1431.47 167.914C1426.06 156.627 1423.35 143.975 1423.35 129.958C1423.35 115.94 1426.06 103.311 1431.47 92.0012C1436.89 80.7144 1444.4 71.8852 1454.02 65.5364C1463.65 59.1875 1474.5 56.0245 1486.66 56.0245C1498.03 56.0245 1508.14 58.9145 1516.9 64.7171C1525.68 70.4971 1531.64 78.2568 1534.83 87.9507C1535.58 90.1808 1536.6 91.1365 1537.9 90.7496C1538.83 90.5676 1539.31 89.9987 1539.31 89.0657C1539.31 88.4968 1538.86 87.1087 1537.9 84.8559C1536.22 80.009 1535.38 74.8662 1535.38 69.4503V0H1557.79V201.638H1535.38H1535.4ZM1529.5 156.832C1533.42 148.617 1535.38 139.652 1535.38 129.958C1535.38 120.264 1533.42 111.298 1529.5 103.083C1525.59 94.8684 1520.17 88.3375 1513.26 83.4906C1506.34 78.6436 1498.6 76.2088 1490.02 76.2088C1476.03 76.2088 1465.15 81.3515 1457.39 91.6144C1449.63 101.877 1445.76 114.666 1445.76 129.98C1445.76 145.295 1449.63 158.084 1457.39 168.347C1465.13 178.609 1476.01 183.752 1490.02 183.752C1498.6 183.752 1506.36 181.317 1513.26 176.47C1520.15 171.623 1525.59 165.092 1529.5 156.878V156.832Z" fill="white"/>
<path d="M1610.96 0V29.1273H1586.32V0H1610.96ZM1609.85 58.2545V201.638H1587.43V58.2545H1609.85Z" fill="white"/>
<path d="M1757.03 92.571C1762.45 103.858 1765.15 116.328 1765.15 129.959C1765.15 143.589 1762.45 156.059 1757.03 167.346C1751.61 178.633 1743.83 187.553 1733.64 194.084C1723.47 200.615 1711.56 203.892 1697.93 203.892C1684.3 203.892 1672.4 200.615 1662.23 194.084C1652.06 187.553 1644.25 178.633 1638.84 167.346C1633.42 156.059 1630.71 143.589 1630.71 129.959C1630.71 116.328 1633.42 103.858 1638.84 92.571C1644.25 81.2842 1652.04 72.364 1662.23 65.8331C1672.4 59.3022 1684.3 56.0254 1697.93 56.0254C1711.56 56.0254 1723.47 59.3022 1733.64 65.8331C1743.81 72.364 1751.61 81.2842 1757.03 92.571ZM1742.76 129.959C1742.76 114.644 1738.76 101.855 1730.72 91.5925C1722.69 81.3297 1711.77 76.1869 1697.96 76.1869C1684.14 76.1869 1673.22 81.3297 1665.19 91.5925C1657.16 101.855 1653.15 114.644 1653.15 129.959C1653.15 145.273 1657.16 158.062 1665.19 168.325C1673.22 178.587 1684.14 183.73 1697.96 183.73C1711.77 183.73 1722.69 178.587 1730.72 168.325C1738.76 158.062 1742.76 145.273 1742.76 129.959Z" fill="white"/>
</svg>`;

const LOGO_SVG_MOBILE = `<svg width="273" height="269" viewBox="0 0 273 269" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M208.116 145.061L200.719 140.721C198.396 139.345 197.969 136.166 199.894 134.241L207.872 126.263C242.196 91.9391 242.44 36.4639 208.636 1.83389C207.474 0.641862 205.885 0 204.234 0H4.12626C1.83389 0 0 1.83389 0 4.12625V75.4341C0 77.7264 1.83389 79.5603 4.12626 79.5603H127.303L2.90366 203.929C1.28372 205.549 1.28372 208.147 2.90366 209.767L60.7018 267.565C62.3217 269.185 64.9197 269.185 66.5397 267.565L183.878 150.226C186.476 147.628 190.908 149.462 190.908 153.13V264.264C190.908 266.556 192.742 268.39 195.034 268.39H268.145C270.438 268.39 272.272 266.556 272.272 264.264V257.02C272.272 210.928 247.85 168.321 208.116 145V145.061Z" fill="white"/>
</svg>`;

function initAsciiLogoFooter() {
  if (window.__revelatioAsciiLogoInit) return;
  window.__revelatioAsciiLogoInit = true;

  const CHARS = '01#@&ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const DEFAULT_PARAMS = {
    idleMode: 'near',
    jitterPx: 140,
    sampleStep: 14,
    fallDurationMs: 1200,
    formDurationMs: 1100,
    gravity: 0.70,
    magneticStrength: 28,
    magneticRadius: 120,
    magneticReturn: 0.08,
  };

  function parseAttrInt(el, name, fallback) {
    const v = parseInt(el.getAttribute(name), 10);
    return Number.isFinite(v) ? v : fallback;
  }

  function parseAttrFloat(el, name, fallback) {
    const v = parseFloat(el.getAttribute(name));
    return Number.isFinite(v) ? v : fallback;
  }

  function applyDataAttrs(root) {
    const params = { ...DEFAULT_PARAMS };
    params.jitterPx = parseAttrInt(root, 'data-ascii-jitter', params.jitterPx);
    params.sampleStep = parseAttrInt(root, 'data-ascii-step', params.sampleStep);
    params.fallDurationMs = parseAttrInt(root, 'data-ascii-fall', params.fallDurationMs);
    params.formDurationMs = parseAttrInt(root, 'data-ascii-form', params.formDurationMs);
    params.gravity = parseAttrFloat(root, 'data-ascii-gravity', params.gravity);
    params.magneticStrength = parseAttrInt(root, 'data-ascii-magnetic', params.magneticStrength);
    params.magneticRadius = parseAttrInt(root, 'data-ascii-mradius', params.magneticRadius);
    params.magneticReturn = parseAttrFloat(root, 'data-ascii-mreturn', params.magneticReturn);
    const mode = root.getAttribute('data-ascii-idle');
    if (mode === 'scattered' || mode === 'near' || mode === 'formed') {
      params.idleMode = mode;
    }
    return params;
  }

  function createLogoSvgElement(svgMarkup) {
    const wrap = document.createElement('div');
    wrap.innerHTML = svgMarkup.trim();
    return wrap.firstElementChild;
  }

  function svgToImage(svgEl) {
    const xml = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  function setupFooterLogo(root) {
    if (root.dataset.asciiLogoReady === 'true') return;
    root.dataset.asciiLogoReady = 'true';

    const params = applyDataAttrs(root);

    root.style.position ||= 'relative';
    root.style.overflow = 'hidden';
    root.style.cursor = 'pointer';

    root.querySelectorAll('img, svg, .w-embed').forEach((el) => {
      el.style.visibility = 'hidden';
      el.setAttribute('aria-hidden', 'true');
    });

    const canvas = document.createElement('canvas');
    canvas.setAttribute('data-ascii-logo-canvas', '');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    root.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const mouse = { x: 0, y: 0, active: false };

    let particles = [];
    let dpr = 1;
    let fontSize = 10;
    let phase = 'idle';
    let fallStart = 0;
    let formStart = 0;
    let spreadStart = 0;
    let floorY = 0;
    let rafId = 0;
    let visible = true;
    let resizeTimer = 0;
    let logoImage = null;
    let logoMode = null;
    let bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    let logoBounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    let dispScale = 1;
    let scrollRevealDone = false;
    const mobileMq = window.matchMedia('(max-width: 767px)');

    function currentLogoMode() {
      return mobileMq.matches ? 'mobile' : 'desktop';
    }

    async function ensureLogoImage() {
      const mode = currentLogoMode();
      if (logoImage && logoMode === mode) return logoImage;

      logoMode = mode;
      const markup = mode === 'mobile' ? LOGO_SVG_MOBILE : LOGO_SVG;
      logoImage = await svgToImage(createLogoSvgElement(markup));
      return logoImage;
    }

    function randChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function snapToGrid(v) {
      const unit = Math.max(1, fontSize);
      return Math.round(v / unit) * unit;
    }

    function updateBounds() {
      const edge = Math.ceil(fontSize * 0.5);
      bounds.minX = edge;
      bounds.minY = edge;
      bounds.maxX = canvas.width - edge - fontSize * 0.5;
      bounds.maxY = canvas.height - edge - fontSize;
      floorY = bounds.maxY;

      logoBounds.minX = edge;
      logoBounds.minY = Math.ceil(fontSize * 0.75);
      logoBounds.maxX = canvas.width - edge - fontSize * 0.5;
      logoBounds.maxY = canvas.height - Math.ceil(fontSize * 0.75) - fontSize;
    }

    function clampParticle(p) {
      p.x = Math.max(bounds.minX, Math.min(bounds.maxX, p.x));
      p.y = Math.max(bounds.minY, Math.min(bounds.maxY, p.y));
    }

    function resizeCanvas() {
      const rect = root.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      fontSize = Math.max(5, Math.round(canvas.height / 14));
      updateBounds();
    }

    async function sampleTargets() {
      const img = await ensureLogoImage();

      const step = params.sampleStep;

      // Amostragem em resolução de referência fixa (native do SVG),
      // para a grade de caracteres ser idêntica em qualquer tela.
      const off = document.createElement('canvas');
      off.width = img.width;
      off.height = img.height;
      const octx = off.getContext('2d');
      octx.drawImage(img, 0, 0, img.width, img.height);
      const data = octx.getImageData(0, 0, img.width, img.height).data;

      // Retângulo de exibição: escala a logo para caber em logoBounds
      // preservando proporção. Só muda o tamanho, não a densidade.
      const fitW = logoBounds.maxX - logoBounds.minX;
      const fitH = logoBounds.maxY - logoBounds.minY;
      dispScale = Math.min(fitW / img.width, fitH / img.height);
      const dispW = img.width * dispScale;
      const dispH = img.height * dispScale;
      const align = root.getAttribute('data-ascii-align')
        || (logoMode === 'mobile' ? 'center' : 'left');
      const ox = align === 'left'
        ? logoBounds.minX
        : logoBounds.minX + (fitW - dispW) / 2;
      const oy = logoBounds.minY + (fitH - dispH) / 2;

      // fontSize = passo da grade na tela (1 char por célula).
      fontSize = Math.max(4, Math.round(step * dispScale));
      updateBounds();

      const pts = [];
      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
          if (data[(y * img.width + x) * 4 + 3] > 50) {
            pts.push({
              tx: snapToGrid(ox + x * dispScale),
              ty: snapToGrid(oy + y * dispScale),
            });
          }
        }
      }
      return pts;
    }

    function computeNearPosition(t) {
      const jitter = params.jitterPx * dispScale;
      const angle = Math.random() * Math.PI * 2;
      const maxDist = Math.min(
        jitter,
        t.tx - bounds.minX,
        bounds.maxX - t.tx,
        t.ty - bounds.minY,
        bounds.maxY - t.ty
      );
      const dist = Math.random() * Math.max(0, maxDist);
      return {
        x: t.tx + Math.cos(angle) * dist,
        y: t.ty + Math.sin(angle) * dist,
      };
    }

    function spawnParticles(targets) {
      return targets.map((t, i) => {
        let x;
        let y;
        let vx;
        let vy;

        if (params.idleMode === 'scattered') {
          x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
          y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
          vx = (Math.random() - 0.5) * 0.4 * dpr;
          vy = (Math.random() - 0.5) * 0.4 * dpr;
        } else if (params.idleMode === 'near') {
          const pos = computeNearPosition(t);
          x = pos.x;
          y = pos.y;
          vx = (Math.random() - 0.5) * 0.3 * dpr;
          vy = (Math.random() - 0.5) * 0.3 * dpr;
        } else {
          x = t.tx;
          y = t.ty;
          vx = 0;
          vy = 0;
        }

        return {
          char: randChar(),
          x,
          y,
          vx,
          vy,
          hx: params.idleMode === 'formed' ? t.tx : x,
          hy: params.idleMode === 'formed' ? t.ty : y,
          tx: t.tx,
          ty: t.ty,
          delay: (i % 20) / 20,
          done: false,
        };
      });
    }

    function maybeScramble(p, rate = 0.015) {
      if (Math.random() < rate) p.char = randChar();
    }

    function updateIdle(p, t) {
      if (params.idleMode !== 'formed') {
        const drift = params.idleMode === 'near' ? 0.03 : 0.05;
        p.x += p.vx + Math.sin(t * 0.001 + p.y) * drift * dpr;
        p.y += p.vy + Math.cos(t * 0.001 + p.x) * drift * dpr;
      }
      clampParticle(p);
      maybeScramble(p);
    }

    function applyMagnetic(p) {
      if (params.magneticStrength <= 0) return;

      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const radius = params.magneticRadius * dpr;

        if (dist < radius) {
          const t = 1 - dist / radius;
          const force = t * t * params.magneticStrength;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
          if (t > 0.65 && Math.random() < 0.06) p.char = randChar();
        }
      }

      p.x += (p.hx - p.x) * params.magneticReturn;
      p.y += (p.hy - p.y) * params.magneticReturn;
      clampParticle(p);
    }

    function updateFall(p) {
      p.vy += params.gravity * dpr;
      p.x += p.vx;
      p.y += p.vy;
      if (p.y >= floorY) {
        p.y = floorY;
        p.vy *= -0.25;
        p.vx *= 0.8;
      }
      clampParticle(p);
    }

    function startSpread(now) {
      phase = 'spread';
      spreadStart = now;
      particles.forEach((p) => {
        p.fx = p.x;
        p.fy = p.y;
        const pos = computeNearPosition(p);
        p.sx = pos.x;
        p.sy = pos.y;
        p.vx = (Math.random() - 0.5) * 0.3 * dpr;
        p.vy = (Math.random() - 0.5) * 0.3 * dpr;
        p.hx = p.sx;
        p.hy = p.sy;
        p.done = false;
      });
    }

    function updateSpread(p, now) {
      const delay = p.delay * params.formDurationMs * 0.5;
      const t = Math.max(0, Math.min(1, (now - spreadStart - delay) / params.formDurationMs));
      const ease = 1 - Math.pow(1 - t, 3);
      p.x = p.fx + (p.sx - p.fx) * ease;
      p.y = p.fy + (p.sy - p.fy) * ease;
      clampParticle(p);
      if (t >= 1) p.done = true;
      maybeScramble(p, 0.012);
    }

    function startForm(now) {
      phase = 'form';
      formStart = now;
      particles.forEach((p) => {
        p.fx = p.x;
        p.fy = p.y;
        p.done = false;
      });
    }

    function updateForm(p, now) {
      const delay = p.delay * params.formDurationMs * 0.5;
      const t = Math.max(0, Math.min(1, (now - formStart - delay) / params.formDurationMs));
      const ease = 1 - Math.pow(1 - t, 3);
      p.x = p.fx + (p.tx - p.fx) * ease;
      p.y = p.fy + (p.ty - p.fy) * ease;
      if (t >= 0.98) {
        p.x = snapToGrid(p.tx);
        p.y = snapToGrid(p.ty);
      }
      clampParticle(p);
      if (t >= 1) p.done = true;
      maybeScramble(p, 0.012);
    }

    function draw(now) {
      rafId = 0;
      if (!visible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = `${fontSize}px Menlo, Monaco, "Courier New", monospace`;
      ctx.textBaseline = 'top';

      particles.forEach((p) => {
        if (phase === 'idle') {
          updateIdle(p, now);
          applyMagnetic(p);
        } else if (phase === 'fall') updateFall(p);
        else if (phase === 'form') updateForm(p, now);
        else if (phase === 'spread') updateSpread(p, now);
        else if (phase === 'done') {
          applyMagnetic(p);
          maybeScramble(p);
        }
        ctx.fillText(p.char, p.x, p.y);
      });

      if (phase === 'form' && particles.every((p) => p.done)) {
        phase = 'done';
        particles.forEach((p) => {
          p.x = snapToGrid(p.tx);
          p.y = snapToGrid(p.ty);
          p.hx = p.tx;
          p.hy = p.ty;
        });
      }

      if (phase === 'spread' && particles.every((p) => p.done)) {
        phase = 'idle';
      }

      if (phase === 'fall' && now - fallStart >= params.fallDurationMs) {
        startForm(now);
      }

      rafId = requestAnimationFrame(draw);
    }

    function ensureLoop() {
      if (!rafId && visible) {
        rafId = requestAnimationFrame(draw);
      }
    }

    function stopLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function triggerFall() {
      if (phase !== 'idle') return false;
      phase = 'fall';
      fallStart = performance.now();
      particles.forEach((p) => {
        p.vy += (Math.random() * 2 + 0.5) * dpr;
        p.vx += (Math.random() - 0.5) * 5 * dpr;
      });
      ensureLoop();
      return true;
    }

    function onClick() {
      if (phase !== 'idle' && phase !== 'done') return;
      if (phase === 'done') {
        startSpread(performance.now());
        ensureLoop();
        return;
      }
      triggerFall();
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
      mouse.active = true;
    }

    function onMouseLeave() {
      mouse.active = false;
    }

    async function resetParticles() {
      const prevMode = logoMode;
      resizeCanvas();
      const targets = await sampleTargets();
      particles = spawnParticles(targets);
      phase = 'idle';
      if (logoMode !== prevMode) scrollRevealDone = false;
      ensureLoop();
    }

    function scheduleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resetParticles();
      }, 100);
    }

    root.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(scheduleResize);
      ro.observe(root);
    } else {
      window.addEventListener('resize', scheduleResize);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting;
        if (visible) {
          ensureLoop();
          if (!scrollRevealDone && phase === 'idle' && entry.intersectionRatio >= 0.8) {
            scrollRevealDone = true;
            triggerFall();
          }
        } else {
          stopLoop();
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 0.8] });
    io.observe(root);

    const onMobileChange = () => {
      scheduleResize();
    };
    if (typeof mobileMq.addEventListener === 'function') {
      mobileMq.addEventListener('change', onMobileChange);
    } else if (typeof mobileMq.addListener === 'function') {
      mobileMq.addListener(onMobileChange);
    }

    resetParticles();
  }

  document.querySelectorAll('.footer_logo, [data-ascii-logo]').forEach(setupFooterLogo);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAsciiLogoFooter);
} else {
  initAsciiLogoFooter();
}
