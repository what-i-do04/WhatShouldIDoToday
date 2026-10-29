/* =========================================================
   임시 이미지 생성기
   실제 작품 이미지가 들어오기 전까지 분위기를 맞추기 위한 데모용 그림이에요.
   OS_ART(spec, w, h) → SVG 문자열.  spec = { gen: '스타일', seed: 숫자 }
   ========================================================= */
window.OS_ART = (function () {
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var uid = 0;
  function f(n) { return n.toFixed(1); }
  function person(x, y, hgt, c) {
    var hw = hgt * .13;
    return '<g fill="' + c + '"><circle cx="' + f(x) + '" cy="' + f(y - hgt * .9) + '" r="' + f(hgt * .07) + '"/><path d="M' + f(x - hw) + ' ' + f(y - hgt * .8) + ' L' + f(x + hw) + ' ' + f(y - hgt * .8) + ' L' + f(x + hw * 1.15) + ' ' + f(y - hgt * .3) + ' L' + f(x + hw * .55) + ' ' + f(y) + ' L' + f(x - hw * .55) + ' ' + f(y) + ' L' + f(x - hw * 1.15) + ' ' + f(y - hgt * .3) + ' Z"/></g>';
  }
  function grain(id, op) {
    return '<filter id="' + id + 'g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ' + op + ' 0"/></filter>';
  }

  function art(o, w, h) {
    o = o || { gen: 'lines', seed: 1 }; w = w || 400; h = h || 500;
    var r = rng(o.seed || 1), s = '', id = 'a' + (uid++), i, x, y, defs = grain(id, .09), d, a;
    switch (o.gen) {
      case 'lines':
        defs += '<radialGradient id="' + id + '" cx="50%" cy="80%" r="70%"><stop offset="0" stop-color="#2c2c2b"/><stop offset="1" stop-color="#050505"/></radialGradient>';
        s += '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + ')"/>';
        var n = Math.round(w / 3.2), base = h * .84, ph = r() * 6, f1 = 1.5 + r() * 2, f2 = 4 + r() * 3, amp = h * (.32 + r() * .14);
        s += '<ellipse cx="' + f(w * .55) + '" cy="' + f(base) + '" rx="' + f(w * .36) + '" ry="' + f(h * .025) + '" fill="#1d1d1d" stroke="#3a3a3a"/>';
        for (i = 0; i < n; i++) {
          x = w * .24 + i * (w * .62 / n); var t = i / n, hh = amp * (.55 + .3 * Math.sin(t * Math.PI * f1 + ph) + .15 * Math.sin(t * Math.PI * f2 * 2)) * (.85 + r() * .3) * Math.sin(Math.PI * Math.min(1, t * 1.05));
          s += '<line x1="' + f(x) + '" y1="' + f(base) + '" x2="' + f(x) + '" y2="' + f(base - hh - h * .08) + '" stroke="#e8e6df" stroke-opacity="' + (.35 + r() * .6).toFixed(2) + '" stroke-width="' + (.6 + r() * .9).toFixed(2) + '"/>';
        }
        s += '<rect x="' + f(w * .86) + '" y="' + f(h * .46) + '" width="' + f(w * .09) + '" height="' + f(h * .4) + '" fill="#bdbdb6" opacity=".55"/>' + person(w * .905, h * .86, h * .12, '#060606');
        break;
      case 'figure':
        defs += '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f3ec"/><stop offset="1" stop-color="#a8a69f"/></linearGradient><radialGradient id="' + id + 'f" cx="50%" cy="0%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>';
        s += '<rect width="' + w + '" height="' + h + '" fill="#0b0b0b"/>';
        var dw = Math.min(w, h) * (.2 + r() * .1), dh = h * .5, dx = w * (.25 + r() * .45) - dw / 2, dy = h * .86 - dh;
        s += '<rect x="0" y="' + f(h * .86) + '" width="' + w + '" height="' + f(h * .14) + '" fill="#151515"/>';
        s += '<ellipse cx="' + f(dx + dw / 2) + '" cy="' + f(h * .86) + '" rx="' + f(dw * 1.8) + '" ry="' + f(h * .09) + '" fill="url(#' + id + 'f)"/>';
        s += '<rect x="' + f(dx) + '" y="' + f(dy) + '" width="' + f(dw) + '" height="' + f(dh) + '" fill="url(#' + id + ')"/>';
        s += person(dx + dw * (.35 + r() * .3), h * .86, dh * .42, '#0a0a0a');
        break;
      case 'particles':
        s += '<rect width="' + w + '" height="' + h + '" fill="#050505"/>';
        var cx = w * (.35 + r() * .3), cy = h * (.35 + r() * .3), R = Math.max(w, h);
        for (i = 0; i < 520; i++) {
          a = r() * Math.PI * 2; d = Math.pow(r(), .6) * R * .7; var rr = r() * r() * 3.4 + .3;
          x = cx + Math.cos(a) * d * (1 + .3 * Math.sin(a * 3)); y = cy + Math.sin(a) * d * .8;
          s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + rr.toFixed(2) + '" fill="#f2f0ea" opacity="' + (Math.max(.08, 1 - d / (R * .7)) * (.4 + r() * .6)).toFixed(2) + '"/>';
        }
        break;
      case 'rings':
        var bg = r() < .5 ? '#e9e6de' : '#111', fg = bg == '#111' ? '#e9e6de' : '#111';
        s += '<rect width="' + w + '" height="' + h + '" fill="' + bg + '"/>';
        var ox = w * (.3 + r() * .4), oy = h * (.3 + r() * .4), k = Math.max(w, h) / 500;
        for (i = 1; i < 32; i++) s += '<circle cx="' + f(ox + i * (r() - .5) * 3) + '" cy="' + f(oy + i * 1.8 * k) + '" r="' + f((i * i * .42 + i * 4) * k) + '" fill="none" stroke="' + fg + '" stroke-width="' + (i % 5 == 0 ? 1.6 : .7) + '" opacity=".8"/>';
        break;
      case 'halftone':
        var bgc = ['#111', '#e9e6de', '#1b2633'][Math.floor(r() * 3)], dot = bgc == '#e9e6de' ? '#111' : '#e9e6de', st = Math.max(w, h) / 30, fx = r() * 4 + 2, fy = r() * 4 + 2;
        s += '<rect width="' + w + '" height="' + h + '" fill="' + bgc + '"/>';
        for (y = st / 2; y < h; y += st) for (x = st / 2; x < w; x += st) { var v = (Math.sin(x / w * fx + y / h * 2) + Math.cos(y / h * fy - x / w)) * .25 + .5; s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + (v * st * .48).toFixed(2) + '" fill="' + dot + '"/>'; }
        break;
      case 'blocks':
        var pal = [['#e9e6de', '#111', '#b5432f'], ['#111', '#e9e6de', '#cdbb93'], ['#d8d4c8', '#1d1d1d', '#2f4f8a']][Math.floor(r() * 3)];
        s += '<rect width="' + w + '" height="' + h + '" fill="' + pal[0] + '"/>';
        for (i = 0; i < 5; i++) s += '<rect x="' + f(r() * w * .7) + '" y="' + f(r() * h * .8) + '" width="' + f(w * (.1 + r() * .5)) + '" height="' + f(h * (.02 + r() * .25)) + '" fill="' + (i == 2 ? pal[2] : pal[1]) + '"/>';
        s += '<text x="' + f(w * .06) + '" y="' + f(h * .94) + '" font-family="Cormorant Garamond,Georgia,serif" font-size="' + f(Math.min(w, h) * .6) + '" font-weight="300" fill="' + pal[1] + '">' + ['ㅎ', 'O', 'S', 'ㅇ', 'A'][Math.floor(r() * 5)] + '</text>';
        s += '<line x1="' + f(w * .06) + '" y1="' + f(h * .08) + '" x2="' + f(w * .94) + '" y2="' + f(h * .08) + '" stroke="' + pal[1] + '"/>';
        break;
      case 'fabric':
        var fp = [['#1a1a1a', '#e9e6de'], ['#e9e6de', '#1a1a1a'], ['#3b2b26', '#e7d9c4']][Math.floor(r() * 3)], p1 = r() * 6, p2 = r() * 6;
        s += '<rect width="' + w + '" height="' + h + '" fill="' + fp[0] + '"/>';
        for (i = 0; i < 46; i++) {
          var y0 = h * .05 + i * (h * .9 / 46); d = 'M0 ' + f(y0);
          for (x = 0; x <= w; x += w / 10) { y = y0 + Math.sin(x / w * 3 + p1 + i * .12) * h * .08 + Math.sin(x / w * 7 + p2 - i * .05) * h * .025; d += ' L' + f(x) + ' ' + f(y); }
          s += '<path d="' + d + '" fill="none" stroke="' + fp[1] + '" stroke-width="' + (.5 + Math.abs(Math.sin(i * .3)) * 1.6).toFixed(2) + '" opacity="' + (.25 + Math.abs(Math.sin(i * .21 + p1)) * .7).toFixed(2) + '"/>';
        }
        break;
      case 'portrait': // 패션 화보 느낌: 배경지 + 조명 + 실루엣
        var pp = [['#d9d4c9', '#16120f', '#8c7e6c'], ['#2a2724', '#0b0a09', '#6e655a'], ['#b9b2a6', '#1a1d22', '#53606e']][Math.floor(r() * 3)];
        defs += '<radialGradient id="' + id + '" cx="' + (35 + r() * 30) + '%" cy="35%" r="75%"><stop offset="0" stop-color="' + pp[0] + '"/><stop offset="1" stop-color="' + pp[2] + '"/></radialGradient>';
        s += '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + ')"/>';
        var px = w * (.4 + r() * .2), py = h * 1.02, ph2 = h * .86, sw = Math.min(w, h * .8) * (.34 + r() * .1);
        s += '<ellipse cx="' + f(px + sw * .4) + '" cy="' + f(h * .97) + '" rx="' + f(sw * 1.1) + '" ry="' + f(h * .04) + '" fill="#000" opacity=".25"/>';
        s += '<path d="M' + f(px - sw * .18) + ' ' + f(py - ph2 * .78) + ' C' + f(px - sw * .7) + ' ' + f(py - ph2 * .6) + ' ' + f(px - sw * .9) + ' ' + f(py - ph2 * .1) + ' ' + f(px - sw * .75) + ' ' + f(py) + ' L' + f(px + sw * .75) + ' ' + f(py) + ' C' + f(px + sw * .95) + ' ' + f(py - ph2 * .2) + ' ' + f(px + sw * .6) + ' ' + f(py - ph2 * .62) + ' ' + f(px + sw * .18) + ' ' + f(py - ph2 * .78) + ' Z" fill="' + pp[1] + '"/>';
        s += '<ellipse cx="' + f(px) + '" cy="' + f(py - ph2 * .86) + '" rx="' + f(sw * .13) + '" ry="' + f(sw * .17) + '" fill="' + pp[1] + '"/>';
        s += '<rect x="' + f(px - sw * .05) + '" y="' + f(py - ph2 * .8) + '" width="' + f(sw * .1) + '" height="' + f(ph2 * .06) + '" fill="' + pp[1] + '"/>';
        for (i = 0; i < 8; i++) { var lx = px - sw * .6 + i * sw * .17; s += '<path d="M' + f(lx) + ' ' + f(py - ph2 * .55) + ' Q' + f(lx + sw * .05) + ' ' + f(py - ph2 * .25) + ' ' + f(lx - sw * .02) + ' ' + f(py) + '" stroke="#fff" stroke-opacity=".06" fill="none"/>'; }
        break;
      case 'horizon': // 안개 낀 해안선
        var hz = h * (.45 + r() * .2), tone = r() < .5;
        defs += '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (tone ? '#cfccc4' : '#2b2c2c') + '"/><stop offset="' + (hz / h).toFixed(2) + '" stop-color="' + (tone ? '#eceae4' : '#5a5b58') + '"/><stop offset="1" stop-color="' + (tone ? '#8f8d86' : '#141414') + '"/></linearGradient><filter id="' + id + 'b"><feGaussianBlur stdDeviation="' + f(h * .015) + '"/></filter>';
        s += '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + ')"/>';
        s += '<rect x="0" y="' + f(hz) + '" width="' + w + '" height="' + f(h * .006) + '" fill="' + (tone ? '#b8b5ad' : '#7a7b77') + '" filter="url(#' + id + 'b)"/>';
        for (i = 0; i < 18; i++) { y = hz + h * .03 + Math.pow(i / 18, 1.6) * (h - hz); s += '<rect x="0" y="' + f(y) + '" width="' + w + '" height="' + f(1 + i * .25) + '" fill="' + (tone ? '#fff' : '#9a9a96') + '" opacity="' + (.05 + r() * .12).toFixed(2) + '"/>'; }
        if (r() < .6) s += person(w * (.2 + r() * .6), hz + h * .2, h * .08, tone ? '#3a3936' : '#0c0c0c');
        break;
      case 'garden': // 일러스트: 잎과 꽃
        var gp = [['#1f2a24', '#5f8a6b', '#d9b26f', '#c46a4e'], ['#efe9dc', '#2f4f3a', '#d0573b', '#6b8fb5'], ['#211c26', '#7c6aa8', '#e8c37a', '#5f8a6b']][Math.floor(r() * 3)];
        s += '<rect width="' + w + '" height="' + h + '" fill="' + gp[0] + '"/>';
        for (i = 0; i < 26; i++) {
          x = r() * w; y = h * .3 + r() * h * .75; var L = Math.min(w, h) * (.08 + r() * .16), an = -90 + (r() - .5) * 70;
          s += '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(an) + ')"><path d="M0 0 Q' + f(L * .5) + ' ' + f(-L * .3) + ' ' + f(L) + ' 0 Q' + f(L * .5) + ' ' + f(L * .3) + ' 0 0Z" fill="' + gp[1] + '" opacity="' + (.55 + r() * .4).toFixed(2) + '"/><line x1="0" y1="0" x2="' + f(L) + '" y2="0" stroke="' + gp[0] + '" stroke-opacity=".5"/></g>';
        }
        for (i = 0; i < 7; i++) { x = w * (.1 + r() * .8); y = h * (.15 + r() * .6); var fr = Math.min(w, h) * (.03 + r() * .04), fc = i % 2 ? gp[2] : gp[3];
          for (var p = 0; p < 6; p++) s += '<ellipse cx="' + f(x + Math.cos(p * 1.047) * fr) + '" cy="' + f(y + Math.sin(p * 1.047) * fr) + '" rx="' + f(fr * .8) + '" ry="' + f(fr * .5) + '" transform="rotate(' + p * 60 + ' ' + f(x + Math.cos(p * 1.047) * fr) + ' ' + f(y + Math.sin(p * 1.047) * fr) + ')" fill="' + fc + '"/>';
          s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(fr * .45) + '" fill="' + gp[0] + '"/>'; }
        break;
      case 'bloom':
      default:
        var bp = [['#1d2b2a', '#d97b4f', '#e8c37a', '#6f9c8f'], ['#20182b', '#c45d7a', '#f0b67f', '#5d6fa8'], ['#efe9dc', '#2f4f8a', '#d0573b', '#89a77a']][Math.floor(r() * 3)];
        defs += '<filter id="' + id + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="' + f(Math.min(w, h) * .07) + '"/></filter>';
        s += '<rect width="' + w + '" height="' + h + '" fill="' + bp[0] + '"/><g filter="url(#' + id + ')">';
        for (i = 0; i < 6; i++) s += '<circle cx="' + f(r() * w) + '" cy="' + f(r() * h) + '" r="' + f(Math.min(w, h) * (.14 + r() * .22)) + '" fill="' + bp[1 + i % 3] + '" opacity=".9"/>';
        s += '</g><circle cx="' + f(w * (.3 + r() * .4)) + '" cy="' + f(h * (.25 + r() * .2)) + '" r="' + f(Math.min(w, h) * .08) + '" fill="none" stroke="' + (bp[0] == '#efe9dc' ? '#1d1d1d' : '#efe9dc') + '" stroke-width="1.2"/>';
    }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>' + defs + '</defs>' + s +
      '<rect width="' + w + '" height="' + h + '" filter="url(#' + id + 'g)"/></svg>';
  }
  return art;
})();
