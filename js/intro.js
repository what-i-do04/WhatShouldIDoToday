/* =========================================================
   첫 화면 인트로
   검은 화면 → 작품 조각들이 앞쪽(관람객 쪽)에서 날아와 가운데로 모이며 OTHER SPACE 글자를 만듦
   → 다 모이면 흰 글씨로 바뀌고(뒤에 흰 후광) → 그라데이션으로 서서히 사라짐 → 가운데에 '입장하기' 버튼 하나 → 누르면 홈 화면
   - 이 탭에서 처음 HOME 으로 들어올 때 한 번만 보여요. 푸터의 '인트로 다시 보기'로 다시 볼 수 있어요.
   - 글자를 이루는 네모 칸마다 서로 다른 작품 사진이 들어가요 (images/intro/).
   ========================================================= */
window.OS_INTRO = (function () {
  var KEY = 'os-intro-seen', el = null, timers = [];
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* 조각에 들어갈 사진: images/intro/ 의 사진들이 칸마다 섞여 들어가요. 사진을 바꾸거나 더하려면 이 폴더와 목록만 고치면 돼요. */
  var PHOTOS = window.OS_INTRO_IMAGES || ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'].map(function (n) { return 'images/intro/' + n + '.jpg'; });
  function preload(done) { var left = PHOTOS.length, ok = [];
    PHOTOS.forEach(function (u) { var im = new Image(); im.onload = function () { ok.push(u); fin(); }; im.onerror = fin; im.src = u; });
    function fin() { if (--left === 0) done(ok); } }

  /* 글자 모양을 격자로 읽어 조각이 놓일 자리 계산. 글자는 세로로 STRETCH 배 늘려 그려요. */
  var STRETCH = 1.4;
  function targets() {
    var W = innerWidth, H = innerHeight, text = 'OTHER SPACE';
    var cell = W < 500 ? 6 : W < 1100 ? 10 : 12, boxW = Math.min(W * (W < 700 ? 0.9 : 0.86), 1500);
    var c = document.createElement('canvas'), x = c.getContext('2d'), font = function (s) { return '900 ' + s + 'px "Arial Black","Helvetica Neue",Arial,sans-serif'; };
    var size = 200; x.font = font(size); var tw = x.measureText(text).width;
    size = Math.floor(size * boxW / tw); size = Math.min(size, H * 0.2);
    var cw = Math.ceil(boxW), ch = Math.ceil(size * 1.02 * STRETCH);
    c.width = cw; c.height = ch; x.setTransform(1, 0, 0, STRETCH, 0, 0); x.font = font(size); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(text, cw / 2, ch / STRETCH / 2);
    var data = x.getImageData(0, 0, cw, ch).data, pts = [];
    for (var gy = cell / 2; gy < ch; gy += cell) for (var gx = cell / 2; gx < cw; gx += cell) {
      if (data[((gy | 0) * cw + (gx | 0)) * 4 + 3] > 120) pts.push({ x: gx - cw / 2, y: gy - ch / 2 }); }
    return { pts: pts, cell: cell, canvas: c };
  }

  /* 시간표 (ms). 조각이 천천히 모이는 게 잘 보이도록 길게 잡았어요. */
  var T = { fly: [3.2, 4.8], spread: 1.8, white: 7600, fade: 9600, btn: 11400 };

  function build(t, tex) {
    var cell = t.cell, stage = el.querySelector('.intro-stage'), html = '', s = cell - 1;
    t.pts.forEach(function (p) {
      var ph = tex.length ? tex[Math.random() * tex.length | 0] : null,
        img = ph ? 'background-image:url(' + ph + ');background-size:' + (rnd(100, 260) | 0) + '% auto;background-position:' + (rnd(0, 100) | 0) + '% ' + (rnd(0, 100) | 0) + '%;' : 'background:#8a8a84;';
      /* 시작: 화면 앞쪽(z 큼) 사방에 흩어진 상태 */
      var a = rnd(0, Math.PI * 2), d = rnd(0.35, 1.1) * Math.max(innerWidth, innerHeight);
      var from = 'translate3d(' + (p.x + Math.cos(a) * d | 0) + 'px,' + (p.y + Math.sin(a) * d | 0) + 'px,' + (rnd(250, 820) | 0) + 'px) rotateX(' + (rnd(-80, 80) | 0) + 'deg) rotateY(' + (rnd(-80, 80) | 0) + 'deg) rotate(' + (rnd(-180, 180) | 0) + 'deg)';
      var to = 'translate3d(' + (p.x - s / 2).toFixed(1) + 'px,' + (p.y - s / 2).toFixed(1) + 'px,0)';
      var dur = rnd(T.fly[0], T.fly[1]).toFixed(2), del = rnd(0, T.spread).toFixed(2),
        wd = (((p.x + innerWidth / 2) / innerWidth) * 0.9 + rnd(0, 0.25)).toFixed(2); /* 흰색으로 바뀌는 순서: 왼쪽 → 오른쪽 */
      html += '<i style="width:' + s + 'px;height:' + s + 'px;' + img + 'transform:' + (reduce ? to : from) + ';--to:' + to + ';--wd:' + wd + 's;transition-duration:' + dur + 's,.8s;transition-delay:' + del + 's,' + del + 's"></i>';
    });
    /* 후광: 글자 모양을 흐리게 번진 흰 빛으로 뒤에 깔아요 */
    var g = t.canvas; g.className = 'intro-glow';
    stage.innerHTML = html; stage.insertBefore(g, stage.firstChild);
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
    preload(function (tex) {
      if (!el) return;
      build(t, tex);
      if (reduce) { stage.classList.add('in', 'glow', 'white'); later(fadeWord, 1600); return; }
      requestAnimationFrame(function () { requestAnimationFrame(function () { stage.classList.add('in'); }); });
      later(function () { stage.classList.add('glow'); }, 2600);   /* 조각이 거의 모일 즈음 후광이 서서히 */
      later(function () { stage.classList.add('white'); }, T.white); /* 다 모이면 흰 글씨로 */
      later(fadeWord, T.fade);
    });
    function fadeWord() { stage.classList.add('fade'); later(showBtn, reduce ? 700 : T.btn - T.fade); }
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
