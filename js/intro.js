/* =========================================================
   첫 화면 인트로
   검은 화면 → 작품 조각들이 앞쪽(관람객 쪽)에서 날아와 가운데로 모이며 OTHER SPACE 글자를 만듦
   → 글자가 그라데이션으로 서서히 사라짐 → 가운데에 '입장하기' 버튼 하나 → 누르면 홈 화면
   - 이 탭에서 처음 HOME 으로 들어올 때 한 번만 보여요. 푸터의 '인트로 다시 보기'로 다시 볼 수 있어요.
   - 조각 이미지는 작품 이미지(지금은 임시 생성 이미지)를 잘라 쓴 것이에요.
   ========================================================= */
window.OS_INTRO = (function () {
  var KEY = 'os-intro-seen', el = null, timers = [];
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* 조각으로 쓸 작품 (전시·오픈 갤러리 작품 섞어서) */

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* 줄마다 작품 한 점을 글자 상자 크기에 맞춰 그려 두기.
     조각들이 제자리에 모이면 글자 안에 작품 이미지가 이어져 보여요. */
  var SRC = ['x09', 'w09', 'x10', 'x17'];
  function textures(t, done) {
    var picks = SRC.slice().sort(function () { return Math.random() - 0.5; }).slice(0, t.lines)
      .map(function (id) { var w = OS.Q.work(id); return w ? OS.Q.imageOf(w) : null; }).filter(Boolean), out = [], left = picks.length;
    if (!left) return done([]);
    picks.forEach(function (spec, i) {
      var W = t.w, H = t.lh, url = typeof spec === 'string' ? spec : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(OS_ART(spec, 400, 500));
      var img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = function () { try { var c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d'), iw = img.naturalWidth || 400, ih = img.naturalHeight || 500, k = Math.max(W / iw, H / ih);
          x.fillStyle = '#2a2826'; x.fillRect(0, 0, W, H); if ('filter' in x) x.filter = 'brightness(1.9) contrast(1.15)';
          x.drawImage(img, (W - iw * k) / 2, (H - ih * k) / 2, iw * k, ih * k); out[i] = c.toDataURL('image/jpeg', 0.85); } catch (e) { out[i] = url; } fin(); };
      img.onerror = fin; img.src = url;
      function fin() { if (--left === 0) done(out); }
    });
  }

  /* 글자 모양을 격자로 읽어 조각이 놓일 자리 계산 */
  function targets() {
    var W = innerWidth, H = innerHeight, lines = ['OTHER', 'SPACE'];
    var cell = W < 500 ? 8 : W < 1100 ? 12 : 15, boxW = Math.min(W * 0.84, 1400);
    var c = document.createElement('canvas'), x = c.getContext('2d'), font = function (s) { return '900 ' + s + 'px "Arial Black","Helvetica Neue",Arial,sans-serif'; };
    var size = 200; x.font = font(size); var tw = Math.max.apply(null, lines.map(function (l) { return x.measureText(l).width; }));
    size = Math.floor(size * boxW / tw); size = Math.min(size, H * 0.34);
    var lh = size * 1.02, cw = Math.ceil(boxW), ch = Math.ceil(lh * lines.length);
    c.width = cw; c.height = ch; x.font = font(size); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    lines.forEach(function (l, i) { x.fillText(l, cw / 2, lh * (i + 0.5)); });
    var data = x.getImageData(0, 0, cw, ch).data, pts = [];
    for (var gy = cell / 2; gy < ch; gy += cell) for (var gx = cell / 2; gx < cw; gx += cell) {
      if (data[((gy | 0) * cw + (gx | 0)) * 4 + 3] > 120) pts.push({ x: gx - cw / 2, y: gy - ch / 2, line: Math.min(lines.length - 1, gy / lh | 0), lx: gx, ly: gy % lh }); }
    return { pts: pts, cell: cell, w: cw, lh: Math.ceil(lh), lines: lines.length };
  }

  function build(t, tex) {
    var cell = t.cell, stage = el.querySelector('.intro-stage'), html = '', n = t.pts.length;
    t.pts.forEach(function (p, i) {
      var r = Math.random(), shape = r < 0.14 ? 'c' : r < 0.22 ? 'p' : '', s = cell - 1;
      var tx = tex[p.line] || tex[0], img = tx ? 'background-image:url(' + tx + ');background-size:' + t.w + 'px ' + t.lh + 'px;background-position:' + (-(p.lx - s / 2)).toFixed(1) + 'px ' + (-(p.ly - s / 2)).toFixed(1) + 'px;' : 'background:#8a8a84;';
      /* 시작: 화면 앞쪽(z 큼) 사방에 흩어진 상태 */
      var a = rnd(0, Math.PI * 2), d = rnd(0.35, 1.1) * Math.max(innerWidth, innerHeight);
      var from = 'translate3d(' + (p.x + Math.cos(a) * d | 0) + 'px,' + (p.y + Math.sin(a) * d | 0) + 'px,' + (rnd(250, 820) | 0) + 'px) rotateX(' + (rnd(-80, 80) | 0) + 'deg) rotateY(' + (rnd(-80, 80) | 0) + 'deg) rotate(' + (rnd(-180, 180) | 0) + 'deg)';
      var to = 'translate3d(' + (p.x - s / 2 + rnd(-0.6, 0.6)).toFixed(1) + 'px,' + (p.y - s / 2 + rnd(-0.6, 0.6)).toFixed(1) + 'px,0)';
      var dur = rnd(1.6, 2.6).toFixed(2), del = (rnd(0, 0.9) + (Math.abs(p.x) / innerWidth) * 0.5).toFixed(2);
      html += '<i class="' + shape + '" style="width:' + s + 'px;height:' + s + 'px;' + img + 'transform:' + (reduce ? to : from) + ';--to:' + to + ';transition-duration:' + dur + 's,.5s;transition-delay:' + del + 's,' + del + 's"></i>';
    });
    stage.innerHTML = html;
    return n;
  }

  function play() {
    if (el) return;
    timers.forEach(clearTimeout); timers = [];
    el = document.createElement('div'); el.className = 'intro'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'OTHER SPACE 입장');
    el.innerHTML = '<div class="intro-stage" aria-hidden="true"></div><span class="sr">OTHER SPACE</span><button class="intro-enter" type="button" hidden>입장하기</button>';
    document.body.appendChild(el); document.documentElement.classList.add('intro-on');
    var stage = el.querySelector('.intro-stage'), btn = el.querySelector('.intro-enter');
    btn.addEventListener('click', enter);
    var t = targets();
    textures(t, function (tex) {
      if (!el) return;
      build(t, tex);
      if (reduce) { stage.classList.add('in'); later(fadeWord, 1400); return; }
      requestAnimationFrame(function () { requestAnimationFrame(function () { stage.classList.add('in'); }); });
      later(fadeWord, 5000);
    });
    function fadeWord() { stage.classList.add('fade'); later(showBtn, reduce ? 700 : 2000); }
    function showBtn() { stage.innerHTML = ''; btn.hidden = false; requestAnimationFrame(function () { btn.classList.add('on'); }); }
  }

  function enter() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    if (!el) return; var x = el; el = null; timers.forEach(clearTimeout);
    x.classList.add('out'); document.documentElement.classList.remove('intro-on');
    setTimeout(function () { x.remove(); var m = document.getElementById('main'); if (m) m.focus({ preventScroll: true }); }, reduce ? 50 : 1100);
  }

  function seen() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  /* 처음 HOME 으로 들어올 때만 */
  var h = (location.hash || '').replace(/^#\/?/, '');
  if (!seen() && !h) play();

  return { play: play };
})();
