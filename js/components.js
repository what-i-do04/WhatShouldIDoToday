/* =========================================================
   공통 컴포넌트
   - 모든 페이지가 같은 함수로 같은 UI를 그려요. 여기만 바꾸면 전체에 반영돼요.
   - 각 함수는 HTML 문자열을 돌려주고, 클릭 같은 동작은 main.js 에서
     data-act 속성으로 한 번에 처리해요.
   ========================================================= */
var Q = OS.Q;
function $(q, el) { return (el || document).querySelector(q); }
function $$(q, el) { return [].slice.call((el || document).querySelectorAll(q)); }
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function dot(d) { return String(d || '').slice(0, 10).replace(/-/g, '.'); }
function period(e) { return dot(e.startDate) + ' — ' + dot(e.endDate); }
var _tt; function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(_tt); _tt = setTimeout(function () { t.classList.remove('on'); }, 2800); }
function lbl(list, id) { var x = Q[list](id); return x ? x.label : ''; }

var IC = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 8h18M3 16h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>',
  prev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>',
  next: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M6 3.5h12v17l-6-4.5-6 4.5z"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"/></svg>'
};

/* ── 이미지: 생성 이미지 / 실제 이미지 주소 모두 처리, 실패 시 대체 상태 ── */
function Img(src, o) {
  o = o || {}; var w = o.w || 400, h = o.h || 500, alt = o.alt || '', ratio = o.ratio ? 'aspect-ratio:' + o.ratio + ';' : '';
  var inner = typeof src === 'string'
    ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async" onerror="this.parentNode.classList.add(\'img-fail\');this.remove()">'
    : OS_ART(src, w, h) + (alt ? '<span class="sr">' + esc(alt) + '</span>' : '');
  return '<div class="fig ' + (o.cls || '') + '" style="' + ratio + '"' + (alt && typeof src !== 'string' ? ' role="img" aria-label="' + esc(alt) + '"' : '') + '>' + inner + '</div>';
}
function ratioWH(r) { var p = String(r || '4/5').split('/'); return { w: 400, h: Math.round(400 * (+p[1] / +p[0])) }; }

/* ── 로고: 나중에 로고 이미지로 바꿀 때 이 함수만 교체 ── */
function Logo(o) { o = o || {};
  return '<a class="logo' + (o.lg ? ' lg' : '') + '" href="#/" aria-label="OTHER SPACE 홈"><span class="mark">OTHER SPACE</span>' + (o.slogan === false ? '' : '<span class="slogan">Beyond the Ordinary.</span>') + '</a>'; }

/* ── 배지 · 이름 ── */
function FeaturedArtistBadge(u, small) { return u && u.isFeaturedArtist ? '<span class="fbadge' + (small ? ' sm' : '') + '" title="운영자가 지정한 전시 작가">Featured Artist</span>' : ''; }
function UserLink(u, o) { o = o || {}; if (!u) return '<span class="muted">알 수 없는 사용자</span>';
  var name = esc(u.nickname) + ' ' + FeaturedArtistBadge(u, true);
  return u.role === 'creator' ? '<a class="ulink" href="#/artists/' + u.id + '">' + name + '</a>' : '<span class="ulink">' + name + '</span>'; }

/* ── 헤더 · 메뉴 · 푸터 ── */
var NAV = [{ to: '#/', t: 'HOME', ko: '홈' }, { to: '#/exhibitions', t: 'EXHIBITIONS', ko: '진행 중인 전시' }, { to: '#/soon', t: 'SOON', ko: '공개 예정 전시' }, { to: '#/archive', t: 'ARCHIVE', ko: '지난 전시' }, { to: '#/gallery', t: 'OPEN GALLERY', ko: '오픈 갤러리' }];
var NAV_MORE = [{ to: '#/artists', t: 'ARTISTS', ko: '창작자' }, { to: '#/about', t: 'ABOUT', ko: '소개' }];
function AccountMenuItems() { var u = OS.me();
  return '<a href="#/mypage">마이페이지</a>' + (OS.can('upload') ? '<a href="#/upload">작품 올리기</a><a href="#/mypage/works">내 작품 관리</a>' : '') +
    (u.role === 'creator' ? '<a href="#/artists/' + u.id + '">내 창작자 프로필</a>' : '') + (OS.can('admin') ? '<a href="#/admin">운영자 대시보드</a>' : '') + '<button data-act="logout">로그아웃</button>'; }
function Account() { var u = OS.me();
  if (!u) return '<a class="tool pill" href="#/login">로그인</a>';
  return '<div class="acct"><button class="tool pill" data-act="acct" aria-haspopup="true" aria-expanded="false">' + esc(u.nickname) + (OS.Auth.isDemo() ? ' <span class="demo-tag">DEMO</span>' : '') + '</button>' +
    '<div class="acct-pop" id="acctPop" hidden><div class="who"><b>' + esc(u.nickname) + ' ' + FeaturedArtistBadge(u, true) + '</b><span>' + esc(u.email) + '</span><span class="role">' + OS.ROLE_LABEL[u.role] + ' · ' + OS.ROLE_EN[u.role] + '</span>' + (OS.Auth.isDemo() ? '<span class="demo-warn">데모 계정 · 실제 인증 아님</span>' : '') + '</div>' + AccountMenuItems() + '</div></div>'; }
function Header() {
  return '<div class="wrap"><div class="hstart">' + Logo({ slogan: false }) +
    '<div class="histnav" role="group" aria-label="페이지 이동"><button class="tool" data-act="hist-back" aria-label="뒤로 가기" title="뒤로 가기" disabled>' + IC.prev + '</button><button class="tool" data-act="hist-fwd" aria-label="앞으로 가기" title="앞으로 가기" disabled>' + IC.next + '</button></div></div>' +
    '<nav class="nav" aria-label="주요 메뉴">' + NAV.map(function (n) { return '<a href="' + n.to + '" data-nav="' + n.to + '">' + n.t + '</a>'; }).join('') + '</nav>' +
    '<div class="tools"><button class="tool" data-act="search" aria-label="검색 열기">' + IC.search + '</button>' + Account() +
    '<button class="tool burger" data-act="menu" aria-label="메뉴 열기" aria-expanded="false">' + IC.menu + '</button></div></div>'; }
function Menu() { var u = OS.me();
  return '<div class="menu-top">' + Logo({ slogan: false }) + '<button class="tool" data-act="menu-close" aria-label="메뉴 닫기">' + IC.close + '</button></div>' +
    '<nav aria-label="전체 메뉴">' + NAV.concat(NAV_MORE).map(function (n) { return '<a href="' + n.to + '">' + n.t.toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + '<small>' + n.ko + '</small></a>'; }).join('') + '</nav>' +
    (u ? '<div class="menu-acct"><div class="label muted">' + OS.ROLE_LABEL[u.role] + (OS.Auth.isDemo() ? ' · DEMO' : '') + '</div><b>' + esc(u.nickname) + '</b><div class="menu-links">' + AccountMenuItems() + '</div></div>'
       : '<div class="menu-foot"><a class="tool pill" href="#/login">로그인</a><a class="tool pill" href="#/signup">회원가입</a></div>') +
    '<div class="menu-foot"><button class="tool pill" data-act="search">' + IC.search + ' 검색</button></div>'; }
function Footer() {
  return '<div class="wrap"><div class="fgrid"><div>' + Logo({ lg: true }) + '<p class="about">패션, 그래픽 디자인, 사진, 일러스트레이션, 디지털 아트를 온라인 전시로 경험하는 디지털 미술관.</p></div>' +
    '<div><h2 class="label muted">Visit</h2><ul><li><a href="#/exhibitions">진행 중인 전시</a></li><li><a href="#/soon">공개 예정 전시</a></li><li><a href="#/archive">아카이브</a></li><li><a href="#/gallery">오픈 갤러리</a></li><li><a href="#/artists">창작자</a></li></ul></div>' +
    '<div><h2 class="label muted">Participate</h2><ul><li><a href="#/upload">작품 올리기</a></li><li><a href="#/signup">회원가입</a></li><li><a href="#/login">로그인</a></li><li><a href="#/mypage">마이페이지</a></li></ul></div>' +
    '<div><h2 class="label muted">Info</h2><ul><li><a href="#/about">OTHER SPACE 소개</a></li><li><a href="#/about#contact">문의</a></li><li><a href="#/admin">운영자</a></li></ul></div></div>' +
    '<div class="fbot"><span>© 2026 OTHER SPACE</span><span class="demo-note">프로토타입 v0.3.0 · 전시, 작가, 작품은 모두 가상 데이터이고 이미지는 임시 생성 이미지예요 · <button data-act="intro">인트로 다시 보기</button> · <button data-act="reset-demo">데모 상태 초기화</button></span></div></div>'; }

/* ── 섹션 제목 ── */
function SecHead(no, en, ko, sub, link) {
  return '<div class="shead rv"><span class="label muted no">' + no + '</span><div class="r"><div><h2 class="h2">' + en + '</h2>' + (ko ? '<p class="sub"><b>' + ko + '</b>' + (sub ? ' — ' + sub : '') + '</p>' : '') + '</div>' + (link || '') + '</div></div>'; }
function PageHead(label, title, sub, extra) {
  return '<header class="phead"><div class="wrap"><span class="label muted">' + label + '</span><h1 class="display">' + title + '</h1>' + (sub ? '<p class="psub">' + sub + '</p>' : '') + (extra || '') + '</div></header>'; }

/* ── 전시 카드 ── */
function ExhibitionCard(e, variant, ratio) {
  var th = e.theme ? Q.theme(e.theme) : null, artists = Q.exArtists(e.id).map(function (u) { return esc(u.nickname); }).join(', ');
  var st = { current: '진행 중', upcoming: '공개 예정', past: '종료' }[e.status];
  if (variant === 'row') return '<a class="exrow rv" href="#/exhibitions/' + e.id + '">' + Img(e.coverImage, { w: 480, h: 360, ratio: '4/3', alt: e.title + ' 대표 이미지' }) +
    '<span class="y">' + e.startDate.slice(0, 4) + '</span><span class="t"><b>' + esc(e.title) + '</b><span>' + esc(e.subtitle) + '</span></span><span class="m">' + period(e) + '<br>' + (artists || '—') + '</span><span class="k label muted">' + (th ? th.en : e.kind) + '</span></a>';
  if (variant === 'feature') return '<a class="exfeat rv mood-' + e.mood + '" href="#/exhibitions/' + e.id + '">' + Img(e.coverImage, { w: 900, h: 640, ratio: ratio || '7/5', alt: e.title + ' 대표 이미지' }) +
    '<div class="txt"><div class="meta label"><span>' + st + '</span>' + (th ? '<span>' + th.en + '</span>' : '') + '<span>' + e.kind + '</span></div><h3 class="ttl t-' + e.type + '">' + esc(e.title) + '</h3><div class="ko">' + esc(e.subtitle) + (artists ? ' · ' + artists : '') + '</div><p>' + esc(e.description) + '</p><div class="per">' + period(e) + '</div><span class="link">전시 입장하기 <span class="ar">→</span></span></div></a>';
  ratio = ratio || '4/5'; var wh = ratioWH(ratio);
  return '<a class="excard rv ' + (variant || '') + '" href="#/exhibitions/' + e.id + '">' + Img(e.coverImage, { w: wh.w, h: wh.h, ratio: ratio, alt: e.title + ' 대표 이미지' }) +
    '<div class="meta label muted"><span>' + st + '</span>' + (th ? '<span>' + th.en + '</span>' : '') + '</div><h3>' + esc(e.title) + '</h3><div class="ko">' + esc(e.subtitle) + (artists ? ' · ' + artists : '') + '</div><div class="per muted">' + period(e) + '</div></a>'; }

/* ── 소리 재생 버튼: key 는 'w:작품id' 또는 'e:전시id' ── */
var EQ = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>';
function SoundButton(key, spec, cls) { if (!spec) return ''; var on = OS_SOUND.playing(key);
  return '<button class="sndbtn' + (on ? ' on' : '') + (cls ? ' ' + cls : '') + '" data-act="sound" data-key="' + key + '" aria-pressed="' + on + '">' + EQ + '<span><b>' + (on ? '소리 끄기' : '소리 듣기') + '</b><small>' + esc(spec.label || 'Sound') + '</small></span></button>'; }
function soundOf(key) { var k = key.split(':'), x = k[0] === 'w' ? Q.work(k[1]) : Q.exhibition(k[1]); return x && x.sound; }

/* ── 작품 카드 ── */
function SaveButton(w, variant) { var on = OS.A.isSaved(w.id);
  return '<button class="savebtn ' + (variant || '') + (on ? ' on' : '') + '" data-act="save" data-id="' + w.id + '" aria-pressed="' + on + '" aria-label="' + esc(w.title) + (on ? ' 저장 취소' : ' 저장') + '">' + IC.save + (variant === 'full' ? '<span>' + (on ? '저장됨' : '저장') + '</span>' : '') + '</button>'; }
function ArtworkCard(w, o) { o = o || {}; var u = Q.user(w.artistId), ratio = o.ratio || w.ratio, wh = ratioWH(ratio);
  return '<article class="acard' + (o.cls ? ' ' + o.cls : '') + '"><a class="aimg" href="' + Q.workHref(w) + '" tabindex="-1" aria-hidden="true">' + Img(Q.imageOf(w), { w: wh.w, h: wh.h, ratio: ratio, alt: '' }) + '</a>' +
    (o.save === false ? '' : SaveButton(w)) + (o.status && w.status !== 'published' ? '<span class="stbadge">' + { draft: '초안', archived: '보관됨' }[w.status] + '</span>' : '') +
    '<div class="ainfo"><a class="at" href="' + Q.workHref(w) + '">' + esc(w.title) + '</a><div class="ab">' + UserLink(u) + '</div>' + (o.meta ? '<div class="am label muted">' + lbl('field', w.field) + ' · ' + (w.theme ? Q.theme(w.theme).en : '') + '</div>' : '') + '</div></article>'; }

/* ── 창작자 카드 ── */
function artistWorks(u) { return u.isFeaturedArtist ? Q.exWorksBy(u.id) : Q.worksBy(u.id); }
function ArtistCard(u) { var all = artistWorks(u), ws = all.slice(0, 3), f = Q.field(u.field);
  return '<article class="arcard rv"><a class="avlink" href="#/artists/' + u.id + '" tabindex="-1" aria-hidden="true">' + Img(u.profileImage, { w: 300, h: 300, ratio: '1/1', cls: 'av' }) + '</a>' +
    '<div class="arinfo"><div class="label muted">' + (f ? f.label : '') + ' · ' + (u.isFeaturedArtist ? '전시 작품 ' : '작품 ') + all.length + '점</div><h3><a href="#/artists/' + u.id + '">' + esc(u.nickname) + '</a> ' + FeaturedArtistBadge(u) + '</h3><p>' + esc(u.bio) + '</p>' +
    '<div class="reps" aria-label="대표 작품">' + ws.map(function (w) { return '<a href="' + Q.workHref(w) + '" title="' + esc(w.title) + '">' + Img(Q.imageOf(w), { w: 160, h: 160, ratio: '1/1', alt: w.title }) + '</a>'; }).join('') + '</div>' +
    '<a class="link" href="#/artists/' + u.id + '">프로필 방문 <span class="ar">→</span></a></div></article>'; }

/* ── 작품 정보 ── */
function ArtworkMetadata(w) { var th = w.theme ? Q.theme(w.theme) : null;
  if (w.space === 'exhibition') return '<dl class="amd"><div><dt>분야</dt><dd>' + lbl('field', w.field) + '</dd></div><div><dt>주제</dt><dd>' + (th ? th.label + ' · ' + th.en : '—') + '</dd></div><div><dt>매체</dt><dd>' + lbl('medium', w.medium) + '</dd></div><div><dt>제작</dt><dd>' + w.createdAt.slice(0, 4) + '</dd></div></dl>';
  return '<dl class="amd"><div><dt>분야</dt><dd><a href="#/gallery?field=' + w.field + '">' + lbl('field', w.field) + '</a></dd></div><div><dt>주제</dt><dd>' + (th ? '<a href="#/gallery?theme=' + th.id + '">' + th.label + ' · ' + th.en + '</a>' : '—') + '</dd></div>' +
    '<div><dt>매체</dt><dd><a href="#/gallery?medium=' + w.medium + '">' + lbl('medium', w.medium) + '</a></dd></div><div><dt>등록일</dt><dd>' + dot(w.createdAt) + '</dd></div></dl>'; }
function FollowButton(u, cls) { var me = OS.me(); if (me && me.id === u.id) return ''; var on = OS.A.isFollowing(u.id);
  return '<button class="btn ' + (on ? 'ghost' : 'pri') + ' follow ' + (cls || '') + '" data-act="follow" data-id="' + u.id + '" aria-pressed="' + on + '">' + (on ? '팔로잉' : '팔로우') + '</button>'; }

/* ── 댓글 ── */
function CommentList(wid) { var cs = Q.comments(wid), me = OS.me();
  if (!cs.length) return '<div class="clist">' + EmptyState('아직 감상이 없어요', '첫 번째 감상을 남겨보세요.', null, true) + '</div>';
  return '<ol class="clist">' + cs.map(function (c) { var u = Q.user(c.authorId);
    return '<li class="cmt"><div class="ch">' + UserLink(u) + (u && u.role !== 'viewer' ? '<span class="label muted">' + OS.ROLE_EN[u.role] + '</span>' : '') + '<time class="muted">' + dot(c.createdAt) + '</time></div><p>' + esc(c.content) + '</p>' +
      (me && (me.id === c.authorId || OS.can('admin')) ? '<button class="txtbtn" data-act="del-comment" data-id="' + c.id + '">삭제</button>' : '') + '</li>'; }).join('') + '</ol>'; }
function CommentForm(wid) { var me = OS.me();
  if (!me) return '<div class="cform locked"><p>감상을 남기려면 로그인이 필요해요.</p><div class="row2"><a class="btn pri" href="#/login?next=' + encodeURIComponent(Q.workHref(Q.work(wid)).slice(1)) + '">로그인</a><a class="btn ghost" href="#/signup">회원가입</a></div></div>';
  return '<form class="cform" data-form="comment" data-id="' + wid + '"><label for="cmt-' + wid + '" class="cform-l">' + esc(me.nickname) + ' ' + FeaturedArtistBadge(me, true) + '<span class="muted">으로 감상 남기기</span></label>' +
    '<textarea id="cmt-' + wid + '" name="content" rows="3" maxlength="500" placeholder="작품을 보고 느낀 점을 남겨주세요" required></textarea><div class="cform-b"><small class="muted"><span data-count>0</span>/500</small><button class="btn pri sm" type="submit">등록</button></div></form>'; }

/* ── 검색 · 필터 ── */
function SearchBar(value, ph, name) {
  return '<form class="sbar" data-form="filter-search" role="search"><label class="sr" for="sb-' + name + '">' + ph + '</label>' + IC.search +
    '<input id="sb-' + name + '" name="q" type="search" value="' + esc(value || '') + '" placeholder="' + ph + '" autocomplete="off">' + (value ? '<button type="button" class="txtbtn" data-act="filter" data-k="q" data-v="">지우기</button>' : '') + '</form>'; }
function FilterGroup(title, key, list, cur, all) {
  return '<div class="fgrp" role="group" aria-label="' + title + '"><span class="fg-t label muted">' + title + '</span><div class="chips">' +
    '<button class="chip' + (!cur ? ' on' : '') + '" data-act="filter" data-k="' + key + '" data-v="" aria-pressed="' + !cur + '">' + (all || '전체') + '</button>' +
    list.map(function (x) { var on = cur === x.id; return '<button class="chip' + (on ? ' on' : '') + '" data-act="filter" data-k="' + key + '" data-v="' + x.id + '" aria-pressed="' + on + '">' + (x.chip || x.label) + '</button>'; }).join('') + '</div></div>'; }
function FilterPanel(groups, activeCount) {
  return '<div class="fpanel"><button class="fp-toggle" data-act="fp-toggle" aria-expanded="false">' + IC.filter + ' 필터' + (activeCount ? ' <b>' + activeCount + '</b>' : '') + '</button><div class="fp-body">' + groups.join('') + '</div></div>'; }

/* ── 상태 화면 ── */
function EmptyState(title, text, action, inline) {
  return '<div class="state empty' + (inline ? ' inline' : '') + '"><span class="state-mark" aria-hidden="true">○</span><h3>' + title + '</h3><p>' + (text || '') + '</p>' + (action || '') + '</div>'; }
function ErrorState(title, text, action) {
  return '<div class="state error" role="alert"><span class="state-mark" aria-hidden="true">!</span><h3>' + title + '</h3><p>' + (text || '') + '</p>' + (action || '') + '</div>'; }
function Skeleton(n) { var s = ''; for (var i = 0; i < n; i++) s += '<div class="sk" style="aspect-ratio:' + ['4/5', '3/4', '1/1', '3/2'][i % 4] + '"></div>'; return '<div class="skgrid" aria-busy="true" aria-label="불러오는 중">' + s + '</div>'; }
function DemoNote(text) { return '<div class="demonote"><span class="tag">DEMO</span> ' + text + '</div>'; }

/* ── 폼 ── */
function Field(id, label, type, ph, hint, auto, extra, value) {
  return '<label class="fld" id="f-' + id + '"><span>' + label + '</span><span class="box"><input id="' + id + '" name="' + id + '" type="' + type + '" placeholder="' + ph + '" autocomplete="' + (auto || 'off') + '" ' + (extra || '') + (value != null ? ' value="' + esc(value) + '"' : '') + '>' +
    (type === 'password' ? '<button type="button" class="eye" data-act="eye" data-for="' + id + '" aria-label="비밀번호 보기">보기</button>' : '') + '</span><small' + (hint ? ' data-hint="' + esc(hint) + '"' : '') + '>' + (hint || '') + '</small></label>'; }
function Select(id, label, list, cur, req) {
  return '<label class="fld" id="f-' + id + '"><span>' + label + (req ? '' : ' <em class="muted">(선택)</em>') + '</span><span class="box sel"><select id="' + id + '" name="' + id + '">' + '<option value="">' + (req ? '선택해 주세요' : '없음') + '</option>' +
    list.map(function (x) { return '<option value="' + x.id + '"' + (cur === x.id ? ' selected' : '') + '>' + x.label + (x.en && x.en !== x.label ? ' · ' + x.en : '') + '</option>'; }).join('') + '</select></span><small></small></label>'; }
function TextArea(id, label, ph, value, rows, hint) {
  return '<label class="fld" id="f-' + id + '"><span>' + label + '</span><span class="box"><textarea id="' + id + '" name="' + id + '" rows="' + (rows || 4) + '" placeholder="' + ph + '">' + esc(value || '') + '</textarea></span><small' + (hint ? ' data-hint="' + esc(hint) + '"' : '') + '>' + (hint || '') + '</small></label>'; }
var ROLE_INFO = {
  viewer: { lead: '전시와 작품을 감상하고 마음에 드는 것을 모아요.', items: ['공개 전시 및 작품 감상', '댓글', '팔로우', '저장', '프로필 관리'], no: '작품 업로드·수정·삭제·보관은 할 수 없어요.' },
  creator: { lead: '감상은 물론, 내 작품을 오픈 갤러리에 공개해요.', items: ['감상 회원의 모든 기능', '작품 업로드', '본인 작품 수정 및 삭제', '본인 작품 보관 처리', '창작자 프로필 관리'] }
};
function RoleSelector(sel) {
  return '<div class="types" role="radiogroup" aria-label="회원 유형">' + ['viewer', 'creator'].map(function (k, i) { var I = ROLE_INFO[k];
    return '<button type="button" class="type" role="radio" aria-checked="' + (sel === k) + '" data-act="pick-type" data-type="' + k + '"><span class="hd"><span><span class="k">' + 'AB'[i] + '. ' + OS.ROLE_LABEL[k] + '</span> <span class="e">' + OS.ROLE_EN[k] + '</span></span><span class="radio"></span></span><p class="ld">' + I.lead + '</p><ul>' +
      I.items.map(function (x, j) { return '<li class="' + (k === 'creator' && j > 0 ? 'plus' : '') + '">' + x + '</li>'; }).join('') + '</ul>' + (I.no ? '<p class="no">' + I.no + '</p>' : '') + '</button>'; }).join('') +
    '</div><p class="types-note">전시 작가(Featured Artist) 배지는 가입할 때 고르는 유형이 아니에요. 운영자가 창작자 회원 중에서 지정해요.</p>'; }
function ArtworkForm(w) { var edit = !!w; w = w || { status: 'published' };
  return '<form class="awform" data-form="artwork" novalidate>' + (edit ? '<input type="hidden" name="id" value="' + w.id + '">' : '') +
    '<div class="awgrid"><div class="awmain">' +
    '<div class="fld" id="f-image"><span>이미지 파일</span><label class="drop" for="image"><input type="file" id="image" name="image" accept="image/*" class="sr"><span class="drop-in" id="dropIn">' +
    (edit ? Img(Q.imageOf(w), { w: 200, h: 200, ratio: '1/1', cls: 'drop-thumb' }) + '<span><b>이미지 바꾸기</b><br><span class="muted">새 이미지를 고르면 미리보기에 반영돼요</span></span>' : '<span class="drop-plus" aria-hidden="true">+</span><span><b>이미지 선택</b><br><span class="muted">JPG, PNG, WEBP · 최대 20MB</span></span>') +
    '</span></label><small data-hint="이미지는 이 브라우저에서 미리보기로만 쓰이고 서버로 올라가지 않아요 (프로토타입).">이미지는 이 브라우저에서 미리보기로만 쓰이고 서버로 올라가지 않아요 (프로토타입).</small></div>' +
    Field('title', '작품 제목', 'text', '작품 제목', '', 'off', 'maxlength="60"', w.title) +
    TextArea('description', '작품 설명', '어떤 작품인지 소개해 주세요', w.description, 4) +
    TextArea('intent', '제작 의도 (선택)', '왜, 어떤 생각으로 만들었는지 들려주세요', w.intent, 3) +
    '<div class="row3">' + Select('field', '분야', Q.db().fields, w.field, true) + Select('theme', '주제', Q.db().themes.map(function (t) { return { id: t.id, label: t.label, en: t.en }; }), w.theme, false) + Select('medium', '매체', Q.db().media, w.medium, true) + '</div>' +
    '<fieldset class="fld vis"><legend>공개 상태</legend><label class="rad"><input type="radio" name="status" value="published"' + (w.status === 'published' ? ' checked' : '') + '> <b>공개</b> <span class="muted">오픈 갤러리와 내 프로필에 보여요</span></label>' +
    '<label class="rad"><input type="radio" name="status" value="draft"' + (w.status === 'draft' ? ' checked' : '') + '> <b>초안</b> <span class="muted">나만 볼 수 있어요</span></label>' +
    (w.status === 'archived' ? '<label class="rad"><input type="radio" name="status" value="archived" checked> <b>보관됨</b> <span class="muted">공개 목록에서 숨겨진 상태</span></label>' : '') + '</fieldset>' +
    '</div><aside class="awside"><div class="label muted">미리보기</div><div class="preview" id="preview"></div><div class="notice on" style="margin-top:16px"><b>프로토타입 안내</b><br>등록한 작품은 이 브라우저 탭에서만 보이고, 실제로 저장되지 않아요.</div>' +
    '<button class="btn pri" type="submit">' + (edit ? '수정 내용 저장' : '작품 등록') + '</button>' +
    (edit ? '<div class="danger"><div class="label muted">작품 관리</div>' +
      (w.status === 'archived' ? '<button type="button" class="btn ghost" data-act="restore" data-id="' + w.id + '">보관 해제 (다시 공개)</button>' : '<button type="button" class="btn ghost" data-act="archive" data-id="' + w.id + '">보관 처리</button>') +
      '<p class="muted">보관하면 공개 목록에서 숨겨지지만 작품은 그대로 남고, 마이페이지에서 다시 볼 수 있어요.</p>' +
      '<button type="button" class="btn del" data-act="delete" data-id="' + w.id + '">작품 삭제</button><p class="muted">삭제는 보관과 달리 작품을 지우는 동작이에요. 한 번 더 확인해요.</p></div>' : '') +
    '</aside></div></form>'; }

/* ── 프로필 머리 ── */
function ProfileHeader(u, own) { var f = Q.field(u.field);
  return '<header class="prof"><div class="wrap profin">' + Img(u.profileImage, { w: 400, h: 400, ratio: '1/1', cls: 'pav', alt: u.nickname + ' 프로필 이미지' }) +
    '<div class="pinfo"><div class="label muted">' + (f ? f.label + ' · ' + f.en : '') + (u.role === 'creator' ? (u.isFeaturedArtist ? ' · Exhibition Artist' : ' · Open Gallery Creator') : '') + '</div><h1 class="pname">' + esc(u.nickname) + '</h1>' + (u.isFeaturedArtist ? '<div>' + FeaturedArtistBadge(u) + '</div>' : '') +
    '<p class="pbio">' + esc(u.bio || '아직 소개가 없어요.') + '</p><div class="pstats"><span><b>' + artistWorks(u).length + '</b> ' + (u.isFeaturedArtist ? '전시 작품' : '공개 작품') + '</span><span><b>' + Q.followers(u.id) + '</b> 팔로워</span><span><b>' + Q.following(u.id).length + '</b> 팔로우</span></div>' +
    '<div class="pacts">' + (own ? '<a class="btn ghost" href="#/mypage/profile">프로필 수정</a><a class="btn pri" href="#/mypage/works">작품 관리</a>' : FollowButton(u)) + '</div></div></div></header>'; }

/* ── 운영자 사이드바 ── */
var ADMIN_NAV = [['', '개요'], ['exhibitions', '전시 관리'], ['members', '회원 관리'], ['works', '작품 관리'], ['reports', '신고 관리']];
function AdminSidebar(active) {
  return '<aside class="aside" aria-label="운영자 메뉴"><div class="label muted">Admin</div><nav>' + ADMIN_NAV.map(function (n) {
    return '<a href="#/admin' + (n[0] ? '/' + n[0] : '') + '"' + (active === n[0] ? ' aria-current="page"' : '') + '>' + n[1] + (n[0] === 'reports' ? ' <b class="cnt">' + Q.db().reports.filter(function (r) { return r.status === 'open'; }).length + '</b>' : '') + '</a>'; }).join('') + '</nav>' +
    '<div class="aside-note">' + DemoNote('변경 사항은 이 브라우저 탭에서만 유지돼요.') + '</div></aside>'; }

/* ── 확인 창 ── */
function Modal(o) {
  return '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mdT"><div class="mbox"><h2 id="mdT">' + o.title + '</h2><div class="mbody">' + o.body + '</div><div class="mbtns"><button class="btn ghost" data-act="modal-close">' + (o.cancel || '취소') + '</button>' +
    (o.ok ? '<button class="btn ' + (o.danger ? 'del' : 'pri') + '" data-act="' + o.ok.act + '" data-id="' + (o.ok.id || '') + '"' + (o.ok.disabled ? ' disabled' : '') + '>' + o.ok.label + '</button>' : '') + '</div></div></div>'; }
