/* =========================================================
   라우터 · 이벤트
   해시 주소(#/gallery?field=photo)로 페이지를 나눠요. 서버 설정 없이 GitHub Pages에서 동작해요.
   ========================================================= */
var cur = { path: null, seg: [], q: {} }, authBack = '#/', pending = null, galleryEntered = false;

function parseHash() {
  var h = location.hash.replace(/^#/, '') || '/', anchor = '';
  var ai = h.indexOf('#'); if (ai > -1) { anchor = h.slice(ai + 1); h = h.slice(0, ai); }
  var qi = h.indexOf('?'), path = qi > -1 ? h.slice(0, qi) : h, qs = qi > -1 ? h.slice(qi + 1) : '', q = {};
  qs.split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' ')); });
  return { path: path, seg: path.split('/').filter(Boolean), q: q, anchor: anchor };
}
function go(path, q) { var s = Object.keys(q || {}).filter(function (k) { return q[k]; }).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]); }).join('&'); location.hash = '#' + path + (s ? '?' + s : ''); }

function render(seg, q) {
  var a = seg[0] || '';
  switch (a) {
    case '': return P.home();
    case 'exhibitions': return !seg[1] ? P.exhibitions(seg, q) : !seg[2] ? P.exhibition(seg[1]) : seg[2] === 'works' && seg[3] && !seg[4] ? P.exWork(seg[1], seg[3]) : P.notfound();
    case 'soon': return seg[1] ? P.notfound() : P.soon();
    case 'gallery': return seg[1] ? P.notfound() : P.gallery(seg, q);
    case 'works': return !seg[1] ? P.notfound() : seg[2] === 'edit' ? P.workForm(seg[1]) : seg[2] ? P.notfound() : P.work(seg[1]);
    case 'upload': return P.workForm();
    case 'artists': return seg[1] ? P.artist(seg[1]) : P.artists(seg, q);
    case 'archive': return seg[1] ? P.notfound() : P.archive(seg, q);
    case 'about': return P.about();
    case 'login': return OS.me() ? P.mypage(['mypage'], {}) : P.login();
    case 'signup': return P.signup(seg);
    case 'reset': return P.reset();
    case 'mypage': return P.mypage(seg, q);
    case 'admin': return P.admin(seg, q);
    case 'search': return P.search(seg, q);
    default: return P.notfound();
  }
}
var TITLES = { exhibitions: 'Exhibitions', soon: 'Soon', gallery: 'Open Gallery', works: 'Artwork', upload: 'Upload', artists: 'Artists', archive: 'Archive', about: 'About', login: 'Log in', signup: 'Sign up', reset: 'Reset Password', mypage: 'My Page', admin: 'Admin', search: 'Search' };
var NAVMAP = { '': '#/', exhibitions: '#/exhibitions', soon: '#/soon', gallery: '#/gallery', works: '#/gallery', upload: '#/gallery', archive: '#/archive' };
/* 전시 상세는 전시 상태에 따라 EXHIBITIONS · SOON · ARCHIVE 중 하나를 표시 */
function navKey(seg) { if (seg[0] === 'exhibitions' && seg[1]) { var e = Q.exhibition(seg[1]); if (e) return { current: '#/exhibitions', upcoming: '#/soon', past: '#/archive' }[e.status]; }
  if (seg[0] === 'works' && seg[1]) { var w = Q.work(seg[1]); if (w && w.space === 'exhibition') return navKey(['exhibitions', w.exhibitionId]); }
  return NAVMAP[seg[0] || '']; }

function route(opt) {
  opt = opt || {};
  var r = parseHash(), samePath = r.path === cur.path, y = scrollY;
  stopHero(); closeMenu(); closeSearch(); closeModal(); closeViewer(); if (!samePath) OS_SOUND.stop();
  if (r.seg[0] === 'login' && r.q.next) authBack = '#' + r.q.next;
  $('#main').innerHTML = render(r.seg, r.q);
  var enteringGallery = r.seg[0] === 'gallery' && !samePath;
  cur = r;
  $$('.nav a').forEach(function (a) { a.dataset.nav === navKey(r.seg) ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
  document.title = (TITLES[r.seg[0]] ? TITLES[r.seg[0]] + ' — ' : '') + 'OTHER SPACE' + (r.seg[0] ? '' : ' — Beyond the Ordinary.');
  if (r.anchor) { var t = document.getElementById(r.anchor); if (t) setTimeout(function () { t.scrollIntoView(); }, 0); }
  else if (opt.keep || samePath) window.scrollTo(0, y); else window.scrollTo(0, 0);
  if (!opt.keep && !samePath) { var m = $('#main'); m.focus({ preventScroll: true }); }
  headerState(); histTrack();
  if (!r.seg.length) startHero();
  if (enteringGallery && !reduce) { var g = $('#gallery'); if (g && $('.masonry', g)) { var real = g.innerHTML; g.innerHTML = Skeleton(8); setTimeout(function () { if ($('#gallery') === g) { g.innerHTML = real; reveal(); } }, 420); } }
  if ($('[data-form="artwork"]')) updatePreview();
  reveal();
}
function rerender() { route({ keep: true }); }
function chrome() { $('#hdr').innerHTML = Header(); histButtons(); $('#menu').innerHTML = Menu(); $('#ftr').innerHTML = Footer(); }
function headerState() { $('#hdr').classList.toggle('solid', !!cur.seg.length || scrollY > 40); }

/* ── 뒤로 가기 · 앞으로 가기 ──
   방문한 주소를 직접 기억해서 상단 버튼으로 오가요. 브라우저의 뒤로/앞으로 버튼을 써도 같은 목록을 따라가요. */
var hist = { list: [], i: -1, jump: false };
function histTrack() { var h = location.hash || '#/';
  if (hist.jump) hist.jump = false;
  else if (hist.list[hist.i] === h) {}
  else if (hist.list[hist.i - 1] === h) hist.i--;
  else if (hist.list[hist.i + 1] === h) hist.i++;
  else { hist.list = hist.list.slice(0, hist.i + 1); hist.list.push(h); hist.i = hist.list.length - 1; }
  histButtons(); }
function histButtons() { var b = $('[data-act="hist-back"]'), f = $('[data-act="hist-fwd"]'); if (b) b.disabled = hist.i <= 0; if (f) f.disabled = hist.i >= hist.list.length - 1; }
function histGo(d) { var n = hist.i + d; if (n < 0 || n >= hist.list.length) return; hist.i = n; hist.jump = true; location.hash = hist.list[n]; }

/* ── 히어로 ── */
var hi = 0, htimer = null, reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
function heroGo(n) { var sl = $$('.slide'), cp = $$('.hcopy'); if (!sl.length) return; hi = (n + sl.length) % sl.length;
  sl.forEach(function (s, i) { s.classList.toggle('on', i === hi); s.setAttribute('aria-hidden', i === hi ? 'false' : 'true'); });
  cp.forEach(function (c, i) { c.classList.toggle('on', i === hi); var l = $('a', c); if (l) l.tabIndex = i === hi ? 0 : -1; });
  $('#hc').textContent = ('0' + (hi + 1)).slice(-2);
  var p = $('#hp'); p.classList.remove('run'); void p.offsetWidth; if (!reduce && htimer) p.classList.add('run'); }
function startHero() { stopHero(); hi = 0; if (!reduce) htimer = setInterval(function () { heroGo(hi + 1); }, 7000); heroGo(0); }
function stopHero() { clearInterval(htimer); htimer = null; }

/* ── 메뉴 · 검색 ── */
function lock(on) { document.body.style.overflow = on ? 'hidden' : ''; }
function openMenu() { var m = $('#menu'); m.classList.add('on'); m.setAttribute('aria-hidden', 'false'); var b = $('[data-act="menu"]'); if (b) b.setAttribute('aria-expanded', 'true'); lock(true); var c = $('[data-act="menu-close"]'); if (c) c.focus(); }
function closeMenu() { var m = $('#menu'); if (!m.classList.contains('on')) return; m.classList.remove('on'); m.setAttribute('aria-hidden', 'true'); var b = $('[data-act="menu"]'); if (b) b.setAttribute('aria-expanded', 'false'); lock(false); }
function SearchOverlay() { return '<div class="wrap"><div class="search-top"><span class="label muted">Search · 작품, 작가, 전시</span><button class="tool" data-act="search-close" aria-label="검색 닫기">' + IC.close + '</button></div>' +
  '<form data-form="overlay-search" role="search"><label><span class="sr">검색어</span><input id="q" name="q" type="search" placeholder="무엇을 찾고 있나요?" autocomplete="off"></label></form><div class="sres" id="sres"></div></div>'; }
function openSearch() { closeMenu(); var s = $('#search'); s.classList.add('on'); s.setAttribute('aria-hidden', 'false'); lock(true); var i = $('#q'); i.value = ''; doSearch(''); setTimeout(function () { i.focus(); }, 30); }
function closeSearch() { var s = $('#search'); if (!s.classList.contains('on')) return; s.classList.remove('on'); s.setAttribute('aria-hidden', 'true'); lock(false); }
function doSearch(q) { var r = searchAll(q);
  function col(t, list, fn) { return '<div><h3 class="label muted">' + t + '</h3>' + (list.length ? list.slice(0, 5).map(fn).join('') : '<p class="none">결과가 없어요</p>') + '</div>'; }
  $('#sres').innerHTML = (q ? '' : '<p class="label muted" style="grid-column:1/-1">이렇게 찾아보세요 · 사진 · MEMORY · 한서진</p>') +
    col('Exhibitions', r.ex, function (e) { return '<a href="#/exhibitions/' + e.id + '"><span class="th">' + Img(e.coverImage, { w: 88, h: 88 }) + '</span><span><span class="t">' + esc(e.title) + '</span><br><span class="m">' + esc(e.subtitle) + '</span></span></a>'; }) +
    col('Works', r.works, function (w) { return '<a href="' + Q.workHref(w) + '"><span class="th">' + Img(Q.imageOf(w), { w: 88, h: 88 }) + '</span><span><span class="t">' + esc(w.title) + '</span><br><span class="m">' + esc(Q.user(w.artistId).nickname) + '</span></span></a>'; }) +
    col('Artists', r.artists, function (u) { return '<a href="#/artists/' + u.id + '"><span class="th">' + Img(u.profileImage, { w: 88, h: 88 }) + '</span><span><span class="t">' + esc(u.nickname) + '</span><br><span class="m">' + (Q.field(u.field) || {}).label + '</span></span></a>'; }) +
    (q ? '<p style="grid-column:1/-1"><a class="link" href="#/search?q=' + encodeURIComponent(q) + '">“' + esc(q) + '” 검색 결과 전체 보기 <span class="ar">→</span></a></p>' : ''); }

/* ── 확인 창 ── */
var lastFocus = null;
function openModal(o) { lastFocus = document.activeElement; $('#modal').innerHTML = Modal(o); $('#modal').hidden = false; lock(true); var b = $('#modal .mbtns .btn'); if (b) b.focus(); }
function closeModal() { var m = $('#modal'); if (!m || m.hidden) return; m.hidden = true; m.innerHTML = ''; lock(false); if (lastFocus) lastFocus.focus(); }

/* ── 몰입형 뷰어 ── */
var vw = { list: [], i: 0 };
function openViewer(list, i) { lastFocus = document.activeElement; vw = { list: list, i: i }; $('#viewer').hidden = false; lock(true); drawViewer(); $('#viewer [data-act="v-close"]').focus(); }
function closeViewer() { var v = $('#viewer'); if (!v || v.hidden) return; OS_SOUND.stop(); v.hidden = true; v.innerHTML = ''; lock(false); if (lastFocus) lastFocus.focus(); }
function drawViewer() { OS_SOUND.stop(); var w = vw.list[vw.i], u = Q.user(w.artistId), wh = ratioWH(w.ratio);
  $('#viewer').innerHTML = '<div class="vtop"><span class="label">' + ('0' + (vw.i + 1)).slice(-2) + ' / ' + ('0' + vw.list.length).slice(-2) + '</span><button class="tool" data-act="v-close" aria-label="닫기">' + IC.close + '</button></div>' +
    '<div class="vstage">' + Img(Q.imageOf(w), { w: wh.w * 3, h: wh.h * 3, ratio: w.ratio, alt: w.title, cls: 'vimg' }) + '</div>' +
    '<div class="vcap"><div><h2>' + esc(w.title) + '</h2><span class="muted">' + esc(u.nickname) + ' · ' + lbl('field', w.field) + ' · ' + lbl('medium', w.medium) + '</span></div><p>' + esc(w.description) + '</p>' + SoundButton('w:' + w.id, w.sound) + '<a class="link" href="' + Q.workHref(w) + '">' + (w.space === 'exhibition' ? '작품 이야기' : '작품 상세') + ' <span class="ar">→</span></a></div>' +
    (vw.list.length > 1 ? '<button class="vnav prev" data-act="v-prev" aria-label="이전 작품">' + IC.prev + '</button><button class="vnav next" data-act="v-next" aria-label="다음 작품">' + IC.next + '</button>' : ''); }

/* ── 스크롤 등장 ── */
var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -6% 0px' }) : null;
function reveal() { $$('.rv:not(.in)').forEach(function (el) { io && !reduce ? io.observe(el) : el.classList.add('in'); }); }

/* ── 로그인이 필요한 동작 ── */
function needLogin(act, id) { pending = { act: act, id: id }; toast('로그인하면 바로 ' + (act === 'save' ? '저장' : '팔로우') + '할게요.'); go('/login', { next: cur.path + (Object.keys(cur.q).length ? '?' + Object.keys(cur.q).map(function (k) { return k + '=' + cur.q[k]; }).join('&') : '') }); }
function runPending() { if (!pending) return; var p = pending; pending = null;
  if (p.act === 'save' && OS.can('save') && !OS.A.isSaved(p.id)) { OS.A.toggleSave(p.id); toast('로그인했어요. 작품을 저장했어요.'); }
  if (p.act === 'follow' && OS.can('follow') && !OS.A.isFollowing(p.id) && OS.me().id !== p.id) { OS.A.toggleFollow(p.id); toast('로그인했어요. 창작자를 팔로우했어요.'); } }

/* ── 클릭 ── */
document.addEventListener('click', function (e) {
  var pop = $('#acctPop'); if (pop && !pop.hidden && !e.target.closest('.acct')) { pop.hidden = true; var tb = $('[data-act="acct"]'); if (tb) tb.setAttribute('aria-expanded', 'false'); }
  if (e.target.id === 'modal') return closeModal();
  var b = e.target.closest('[data-act]'); if (!b || b.tagName === 'SELECT') return; var a = b.dataset.act, id = b.dataset.id;
  switch (a) {
    case 'hist-back': histGo(-1); break; case 'hist-fwd': histGo(1); break;
    case 'menu': openMenu(); break; case 'menu-close': closeMenu(); break;
    case 'search': openSearch(); break; case 'search-close': closeSearch(); break;
    case 'acct': var p = $('#acctPop'), o = p.hidden; p.hidden = !o; b.setAttribute('aria-expanded', o); break;
    case 'logout': OS.Auth.signOut().then(function () { chrome(); toast('로그아웃했어요.'); if (/^(mypage|admin|upload)$/.test(cur.seg[0]) || cur.seg[2] === 'edit') location.hash = '#/'; else rerender(); }); break;
    case 'demo': var next = b.dataset.next ? '#' + b.dataset.next : authBack;
      OS.Auth.demoSignIn(b.dataset.type).then(function (u) { chrome(); runPending(); if (!pending) toast(OS.ROLE_LABEL[u.role] + ' 데모 계정으로 둘러보는 중이에요. 실제 인증이 아니에요.');
        if (!next || /^#\/(login|signup|reset)/.test(next)) next = '#/'; if (location.hash === next) rerender(); else location.hash = next; authBack = '#/'; }); break;
    case 'eye': var inp = $('#' + b.dataset.for), show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; b.textContent = show ? '숨기기' : '보기'; b.setAttribute('aria-label', show ? '비밀번호 숨기기' : '비밀번호 보기'); break;
    case 'pick-type': signupRole = b.dataset.type; rerender(); var c = $('.type[data-type="' + signupRole + '"]'); if (c) c.focus(); break;
    case 'type-next': if (signupRole) location.hash = '#/signup/' + signupRole; break;
    case 'hprev': case 'hnext': var run = !!htimer; stopHero(); if (run && !reduce) htimer = setInterval(function () { heroGo(hi + 1); }, 7000); heroGo(hi + (a === 'hnext' ? 1 : -1)); break;
    case 'sprev': case 'snext': var s = $('#strip'), cd = $('.acard', s); s.scrollBy({ left: (a === 'snext' ? 1 : -1) * (cd ? cd.offsetWidth + 24 : 300), behavior: reduce ? 'auto' : 'smooth' }); break;
    case 'filter': var q = Object.assign({}, cur.q); q[b.dataset.k] = b.dataset.v; delete q.state; go(cur.path, q); break;
    case 'filter-reset': go(cur.path, {}); break;
    case 'fp-toggle': var fp = b.closest('.fpanel'), op = fp.classList.toggle('open'); b.setAttribute('aria-expanded', op); break;
    case 'save': if (!OS.me()) return needLogin('save', id); if (!OS.can('save')) return toast('이 계정 유형은 저장 기능을 쓰지 않아요.');
      var on = OS.A.toggleSave(id); $$('[data-act="save"][data-id="' + id + '"]').forEach(function (x) { x.outerHTML = SaveButton(Q.work(id), x.classList.contains('full') ? 'full' : ''); }); toast(on ? '저장했어요. 마이페이지에서 볼 수 있어요.' : '저장을 취소했어요.'); break;
    case 'follow': if (!OS.me()) return needLogin('follow', id); var fo = OS.A.toggleFollow(id); rerender(); toast(fo ? Q.user(id).nickname + '님을 팔로우했어요.' : '팔로우를 취소했어요.'); break;
    case 'del-comment': OS.A.deleteComment(id); rerender(); toast('감상을 삭제했어요.'); break;
    case 'viewer': var list, i = +(b.dataset.i || 0);
      if (b.dataset.ex) { var ex = Q.exhibition(b.dataset.ex); list = Q.exWorks(ex.id); if (ex.status === 'upcoming') list = []; } else list = [Q.work(b.dataset.work)];
      if (list.length) openViewer(list, i); break;
    case 'sound': var sk = b.dataset.key, was = OS_SOUND.playing(sk);
      if (was) OS_SOUND.stop(); else if (!OS_SOUND.play(sk, soundOf(sk))) toast('이 브라우저에서는 소리를 재생할 수 없어요.');
      $$('[data-act="sound"]').forEach(function (x) { var c = x.className.replace(/\b(sndbtn|on)\b/g, '').trim(); x.outerHTML = SoundButton(x.dataset.key, soundOf(x.dataset.key), c); }); break;
    case 'v-close': closeViewer(); break; case 'v-prev': vw.i = (vw.i - 1 + vw.list.length) % vw.list.length; drawViewer(); break; case 'v-next': vw.i = (vw.i + 1) % vw.list.length; drawViewer(); break;
    case 'archive': if (OS.A.setStatus(id, 'archived')) { toast('보관했어요. 공개 목록에서 숨겨지고, 마이페이지 “보관됨”에서 다시 볼 수 있어요.'); if (cur.seg[2] === 'edit') location.hash = '#/mypage/works?status=archived'; else rerender(); } break;
    case 'restore': if (OS.A.setStatus(id, 'published')) { toast('다시 공개했어요.'); rerender(); } break;
    case 'delete': var w = Q.work(id); openModal({ title: '작품을 삭제할까요?', danger: true, ok: { act: 'delete-do', id: id, label: '삭제하기', disabled: true },
      body: '<p><b>' + esc(w.title) + '</b>을(를) 삭제하면 오픈 갤러리와 프로필에서 모두 사라져요. 숨기기만 하려면 삭제 대신 <b>보관 처리</b>를 써주세요.</p>' + DemoNote('프로토타입에서는 이 브라우저 탭의 목록에서만 사라지고, 실제 영구 삭제는 이루어지지 않아요.') +
        '<label class="chk"><input type="checkbox" data-act="del-check"> 보관이 아닌 삭제라는 것을 이해했어요</label>' }); break;
    case 'del-check': $('#modal [data-act="delete-do"]').disabled = !b.checked; return;
    case 'delete-do': if (OS.A.deleteWork(id)) { closeModal(); toast('삭제했어요 (데모).'); location.hash = '#/mypage/works'; } break;
    case 'switch-ask': openModal({ title: '창작자 회원으로 전환할까요?', ok: { act: 'switch-do', label: '전환하기' }, body: '<p>지금 계정 그대로 창작자 기능이 켜져요.</p><ul class="keep"><li>이메일, 닉네임 유지</li><li>저장한 작품, 팔로우 목록, 댓글 활동 유지</li><li>작품 업로드·수정·삭제·보관 기능 활성화</li></ul><p class="muted small">창작자 회원에서 다시 감상 회원으로 돌아가는 기능은 이번 기획에 포함되지 않아요.</p>' }); break;
    case 'switch-do': if (OS.A.switchToCreator()) { closeModal(); chrome(); location.hash = '#/mypage/settings?switched=1'; } break;
    case 'modal-close': closeModal(); break;
    case 'set-featured': var u = Q.user(id); if (OS.A.adminSetFeatured(id, !u.isFeaturedArtist)) { rerender(); toast(u.nickname + (u.isFeaturedArtist ? '님을 전시 작가로 지정했어요.' : '님의 전시 작가 배지를 해제했어요.')); } break;
    case 'report': var rp = Q.db().reports.filter(function (x) { return x.id === id; })[0], how = b.dataset.do;
      if (how === 'hidden') { if (rp.target === 'comment') OS.A.deleteComment(rp.targetId); else OS.A.adminSetWorkStatus(rp.targetId, 'archived'); }
      OS.A.adminReport(id, how); rerender(); toast(how === 'hidden' ? '조치했어요 (데모).' : '문제 없음으로 처리했어요.'); break;
    case 'reset-demo': OS.reset(); chrome(); location.hash = '#/'; rerender(); toast('데모 상태를 처음으로 되돌렸어요.'); break;
    case 'soon': toast(b.dataset.msg || '준비 중인 기능이에요.'); break;
  }
});
document.addEventListener('change', function (e) { var t = e.target, a = t.dataset.act;
  if (a === 'sort') { var q = Object.assign({}, cur.q); q.sort = t.value === 'new' ? '' : t.value; go(cur.path, q); }
  if (a === 'set-role') { var u = Q.user(t.dataset.id); if (OS.A.adminSetRole(u.id, t.value)) { rerender(); toast(u.nickname + '님의 회원 유형을 ' + OS.ROLE_LABEL[t.value] + '으로 바꿨어요 (데모).'); } }
  if (a === 'set-wstatus') { var w = Q.work(t.dataset.id); if (OS.A.adminSetWorkStatus(w.id, t.value)) toast('“' + w.title + '” 공개 상태를 바꿨어요 (데모).'); }
  if (t.id === 'tAll') $$('.tReq').forEach(function (c) { c.checked = t.checked; });
  if (t.classList.contains('tReq')) $('#tAll').checked = $$('.tReq').every(function (c) { return c.checked; });
  if (t.id === 'password2' || (t.id === 'password' && $('#password2'))) { var p1 = $('#password'), p2 = $('#password2'); if (p2.value) mark('password2', p1.value === p2.value ? '비밀번호가 일치해요.' : '비밀번호가 서로 달라요.', p1.value === p2.value); }
  if (t.id === 'image' && t.files && t.files[0]) { var f = t.files[0]; if (!/^image\//.test(f.type)) { mark('image', '이미지 파일만 올릴 수 있어요.'); t.value = ''; return; } if (f.size > 20 * 1024 * 1024) { mark('image', '20MB 이하의 이미지만 올릴 수 있어요.'); t.value = ''; return; }
    var rd = new FileReader(); rd.onload = function () { pendingImage = rd.result; mark('image', f.name + ' · 미리보기에 반영했어요.', true); $('#dropIn').innerHTML = '<div class="fig drop-thumb" style="aspect-ratio:1/1"><img src="' + pendingImage + '" alt=""></div><span><b>' + esc(f.name) + '</b><br><span class="muted">다른 이미지를 고르려면 다시 누르세요</span></span>'; updatePreview(); }; rd.readAsDataURL(f); }
});
document.addEventListener('input', function (e) { var t = e.target;
  if (t.id === 'q' && t.closest('#search')) doSearch(t.value);
  if (t.closest('[data-form="artwork"]')) updatePreview();
  if (t.name === 'content') { var c = $('[data-count]', t.form); if (c) c.textContent = t.value.length; }
});
document.addEventListener('keydown', function (e) {
  if (!$('#viewer').hidden) { if (e.key === 'ArrowRight') { vw.i = (vw.i + 1) % vw.list.length; drawViewer(); } if (e.key === 'ArrowLeft') { vw.i = (vw.i - 1 + vw.list.length) % vw.list.length; drawViewer(); } }
  if (e.key === 'Escape') { closeViewer(); closeModal(); closeMenu(); closeSearch(); var p = $('#acctPop'); if (p) p.hidden = true; }
  if (e.key === 'Tab') { var box = !$('#viewer').hidden ? $('#viewer') : !$('#modal').hidden ? $('#modal') : $('#menu').classList.contains('on') ? $('#menu') : $('#search').classList.contains('on') ? $('#search') : null;
    if (box) { var f = $$('a[href],button:not([disabled]),input,select,textarea', box).filter(function (x) { return x.offsetParent !== null; }); if (f.length) { var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } } }
  if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
});

/* ── 폼 ── */
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, pendingImage = null;
function mark(id, msg, ok) { var f = $('#f-' + id); if (!f) return; f.classList.toggle('bad', !!msg && !ok); f.classList.toggle('ok', !!ok); var sm = $('small', f); if (sm) sm.textContent = msg || sm.dataset.hint || ''; }
function note(msg, bad) { var n = $('#formMsg'); if (!n) return; n.innerHTML = msg; n.classList.toggle('on', !!msg); n.classList.toggle('bad', !!bad); }
function updatePreview() { var f = $('[data-form="artwork"]'), pv = $('#preview'); if (!f || !pv) return; var me = OS.me(), id = f.id && f.id.value, w = id ? Q.work(id) : null;
  var img = pendingImage || (w ? Q.imageOf(w) : null), title = f.title.value.trim() || '작품 제목';
  pv.innerHTML = '<article class="acard"><div class="aimg">' + (img ? Img(img, { w: 400, h: 500, ratio: '4/5', alt: '' }) : '<div class="fig ph" style="aspect-ratio:4/5"><span>이미지를 선택하면<br>여기에 보여요</span></div>') + '</div><div class="ainfo"><span class="at">' + esc(title) + '</span><div class="ab">' + esc(me ? me.nickname : '') + ' ' + FeaturedArtistBadge(me, true) + '</div>' +
    '<div class="am label muted">' + [f.field.value && lbl('field', f.field.value), f.theme.value && Q.theme(f.theme.value).en, f.medium.value && lbl('medium', f.medium.value)].filter(Boolean).join(' · ') + '</div><div class="label muted" style="margin-top:6px">' + ({ published: '공개', draft: '초안 · 나만 보기', archived: '보관됨' }[(f.querySelector('[name=status]:checked') || {}).value] || '') + '</div></div></article>'; }

document.addEventListener('submit', function (e) { var f = e.target, kind = f.dataset.form; if (!kind) return; e.preventDefault();
  var v = function (n) { var i = f.querySelector('[name="' + n + '"]'); return i ? i.value.trim() : ''; }, ok = true, first = null;
  function bad(id, m) { mark(id, m); ok = false; first = first || id; }
  function fail() { var el = $('#' + first) || $('#f-' + first + ' input'); if (el) el.focus(); }
  switch (kind) {
    case 'overlay-search': closeSearch(); go('/search', { q: v('q') }); break;
    case 'filter-search': var q = Object.assign({}, cur.q); q.q = v('q'); go(cur.path, q); break;
    case 'login': mark('email'); mark('password'); note('');
      if (!EMAIL.test(v('email'))) bad('email', '이메일 형식을 확인해 주세요.'); if (!f.password.value) bad('password', '비밀번호를 입력해 주세요.'); if (!ok) return fail();
      OS.Auth.signIn(v('email'), f.password.value).catch(function () { note('<b>프로토타입에서는 실제 로그인이 연결되어 있지 않아요.</b><br>아래 데모 계정으로 회원 화면을 둘러볼 수 있어요.'); }); break;
    case 'signup': ['email', 'password', 'password2', 'nickname', 'terms'].forEach(function (i) { mark(i); }); note('');
      var pw = f.password.value, nk = v('nickname');
      if (!EMAIL.test(v('email'))) bad('email', '이메일 형식을 확인해 주세요.');
      if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) bad('password', '8자 이상, 영문과 숫자를 함께 써주세요.');
      if (!f.password2.value || f.password2.value !== pw) bad('password2', '비밀번호가 서로 달라요.');
      if (nk.length < 2 || nk.length > 20) bad('nickname', '닉네임은 2~20자로 정해주세요.');
      if ($$('.tReq', f).some(function (c) { return !c.checked; })) bad('terms', '필수 약관에 모두 동의해 주세요.');
      if (!ok) { if (first === 'terms') $('#tAll').focus(); else fail(); return; }
      var role = v('role');
      OS.Auth.signUp({ email: v('email'), password: pw, nickname: nk, role: role }).catch(function () { $('#main').innerHTML = P.signupDone(role, nk); window.scrollTo(0, 0); }); break;
    case 'reset': mark('email'); if (!EMAIL.test(v('email'))) { bad('email', '이메일 형식을 확인해 주세요.'); return fail(); }
      OS.Auth.resetPassword(v('email')).catch(function () { note('<b>데모 화면이라 실제 메일은 발송되지 않아요.</b><br>실제 서비스에서는 ' + esc(v('email')) + '로 재설정 링크가 발송돼요.'); }); break;
    case 'comment': var txt = v('content'); if (!txt) { toast('감상을 입력해 주세요.'); return; } if (OS.A.addComment(f.dataset.id, txt)) { rerender(); toast('감상을 남겼어요 (데모).'); } break;
    case 'profile': mark('nickname'); var n2 = v('nickname'); if (n2.length < 2 || n2.length > 20) { bad('nickname', '닉네임은 2~20자로 정해주세요.'); return fail(); }
      OS.A.updateProfile({ nickname: n2, bio: v('bio'), field: f.field ? v('field') || OS.me().field : undefined }); chrome(); rerender(); toast('프로필을 저장했어요 (데모).'); break;
    case 'artwork': ['image', 'title', 'field', 'medium'].forEach(function (i) { mark(i); });
      var editId = v('id'); if (!editId && !pendingImage) bad('image', '작품 이미지를 선택해 주세요.');
      if (!v('title')) bad('title', '작품 제목을 입력해 주세요.'); if (!v('field')) bad('field', '분야를 선택해 주세요.'); if (!v('medium')) bad('medium', '매체를 선택해 주세요.');
      if (!ok) { var el = first === 'image' ? $('.drop') : $('#' + first); if (el) el.focus ? el.focus() : 0; if (first === 'image') $('#f-image').scrollIntoView({ block: 'center' }); return; }
      var data = { title: v('title'), description: v('description'), intent: v('intent'), field: v('field'), theme: v('theme') || null, medium: v('medium'), status: (f.querySelector('[name=status]:checked') || {}).value || 'published' };
      if (editId) data.id = editId;
      var w = OS.A.saveWork(data, pendingImage); pendingImage = null;
      if (w) { toast((editId ? '수정했어요' : '작품을 등록했어요') + '. 데모라 이 브라우저 탭에서만 보여요.'); location.hash = '#/works/' + w.id; } break;
    case 'exhibition': ['title', 'startDate', 'endDate', 'status'].forEach(function (i) { mark(i); });
      if (!v('title')) bad('title', '전시 제목을 입력해 주세요.'); if (!v('startDate')) bad('startDate', '시작일을 정해주세요.'); if (!v('endDate')) bad('endDate', '종료일을 정해주세요.');
      if (v('startDate') && v('endDate') && v('endDate') < v('startDate')) bad('endDate', '종료일이 시작일보다 빨라요.'); if (!ok) return fail();
      var ex = OS.A.adminSaveExhibition({ id: v('id') || undefined, title: v('title'), subtitle: v('subtitle'), description: v('description'), curatorStatement: v('curatorStatement'), theme: v('theme') || null, startDate: v('startDate'), endDate: v('endDate'), status: v('status'), mood: v('mood'), type: v('type') });
      if (ex && ex.error === 'max_current') { bad('status', '진행 중 전시는 동시에 최대 ' + OS.MAX_CURRENT + '개까지 열 수 있어요. 다른 전시를 종료한 뒤 바꿔주세요.'); return fail(); }
      if (ex) { toast('전시를 저장했어요 (데모).'); location.hash = '#/admin/exhibitions'; } break;
  }
});

/* ── 시작 ── */
addEventListener('hashchange', function (e) { var o = (e.oldURL || '').split('#')[1]; if (o && !/^\/(login|signup|reset)/.test(o)) authBack = '#' + o; route(); });
addEventListener('scroll', headerState, { passive: true });
document.addEventListener('visibilitychange', function () { if (!$('#hero')) return; if (document.hidden) stopHero(); else startHero(); });
chrome(); $('#search').innerHTML = SearchOverlay();
route();
