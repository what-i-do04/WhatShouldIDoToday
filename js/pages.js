/* =========================================================
   페이지
   각 함수는 (경로 조각, 쿼리) 를 받아 HTML 문자열을 돌려줘요.
   ========================================================= */
var P = {};

/* ───────────────── HOME ───────────────── */
P.home = function () {
  var db = Q.db(), feat = db.exhibitions.filter(function (e) { return e.featured && e.status === 'current'; }),
    cur = db.exhibitions.filter(function (e) { return e.status === 'current'; }).slice(0, 4),
    pub = Q.publicWorks().slice().sort(Q.byNew),
    picks = pub.slice().sort(function (a, b) { return Q.saveCount(b.id) - Q.saveCount(a.id) || (a.createdAt < b.createdAt ? 1 : -1); }).slice(0, 8),
    past = db.exhibitions.filter(function (e) { return e.status === 'past'; }).sort(function (a, b) { return a.startDate < b.startDate ? 1 : -1; }).slice(0, 5),
    up = db.exhibitions.filter(function (e) { return e.status === 'upcoming'; }).sort(function (a, b) { return a.startDate < b.startDate ? -1 : 1; }).slice(0, 3);
  var h = '<section class="hero" id="hero" aria-roledescription="carousel" aria-label="대표 기획 전시">' +
    feat.map(function (e, i) { return '<div class="slide' + (i ? '' : ' on') + '" aria-hidden="' + (i ? 'true' : 'false') + '"><div class="bg">' + Img(e.coverImage, { w: 1600, h: 1000 }) + '</div></div>'; }).join('') +
    '<div class="hero-txt"><div class="wrap">' + feat.map(function (e, i) { var th = e.theme ? Q.theme(e.theme) : null;
      return '<div class="hcopy' + (i ? '' : ' on') + '"><div class="label"><span>대표 기획 전시</span>' + (th ? '<span class="muted">' + th.en + '</span>' : '') + '<span class="muted">' + period(e) + '</span></div>' +
        '<h1 class="display t-' + e.type + '">' + esc(e.title).replace(' ', '<br>') + '</h1><div class="ko">' + esc(e.subtitle) + ' · ' + Q.exArtists(e.id).map(function (u) { return esc(u.nickname); }).join(', ') + '</div><p>' + esc(e.description) + '</p>' +
        '<a class="link" href="#/exhibitions/' + e.id + '"' + (i ? ' tabindex="-1"' : '') + '>전시 입장하기 <span class="ar">→</span></a></div>'; }).join('') + '</div></div>' +
    '<div class="hero-bar"><div class="wrap"><span class="count"><b id="hc">01</b> <i>/ ' + ('0' + feat.length).slice(-2) + '</i></span><span class="prog"><i id="hp"></i></span>' +
    '<span class="hctl"><button data-act="hprev" aria-label="이전 전시">' + IC.prev + '</button><button data-act="hnext" aria-label="다음 전시">' + IC.next + '</button></span><span class="hero-side label muted">Beyond the Ordinary.</span></div></div></section>';
  h += '<section class="sec"><div class="wrap">' + SecHead('01', 'Now on View', '현재 진행 중인 전시', '전시 작가의 작품을 지금 감상할 수 있는 전시', '<a class="link rv" href="#/exhibitions">전체 전시 보기 <span class="ar">→</span></a>') +
    '<div class="cur">' + cur.map(function (e, i) { return ExhibitionCard(e, 'abcd'[i], ['4/5', '3/4', '1/1', '3/4'][i]); }).join('') + '</div></div></section>';
  h += '<section class="sec paper"><div class="wrap">' + SecHead('02', 'By Theme', '주제별 전시 탐색', '전시는 하나의 주제를 중심으로 기획돼요') + '<div class="themes">' +
    db.themes.map(function (t, i) { var exs = db.exhibitions.filter(function (e) { return e.theme === t.id; }).sort(function (a, b) { return ['current', 'upcoming', 'past'].indexOf(a.status) - ['current', 'upcoming', 'past'].indexOf(b.status); }),
        nw = db.works.filter(function (w) { return w.space === 'exhibition' && w.theme === t.id && Q.exVisible(w); }).length,
        to = exs[0] && exs[0].status !== 'past' ? '#/exhibitions/' + exs[0].id : '#/archive?theme=' + t.id;
      return '<a class="theme rv" href="' + to + '"><span class="n">0' + (i + 1) + '</span><span class="nm"><span class="en">' + t.en + '</span><span class="ko">' + t.label + '</span></span><span class="c">전시 ' + exs.length + ' · 작품 ' + nw + '</span>' + (exs[0] ? '<span class="peek" aria-hidden="true">' + Img(exs[0].coverImage, { w: 300, h: 400 }) + '</span>' : '') + '</a>'; }).join('') + '</div></div></section>';
  h += '<section class="sec"><div class="wrap">' + SecHead('03', 'Open Gallery', '오픈 갤러리 추천 작품', '신진·아마추어 창작자가 직접 공개한 작품 중 많이 저장된 작품', '<a class="link rv" href="#/gallery">오픈 갤러리 가기 <span class="ar">→</span></a>') + '</div>' +
    '<div class="strip-wrap"><div class="strip" id="strip">' + picks.map(function (w) { return ArtworkCard(w, { ratio: '3/4', meta: true }); }).join('') + '</div>' +
    '<div class="wrap strip-end"><span class="label muted">' + picks.length + ' Works · 옆으로 넘겨보세요</span><span class="sbtn"><button data-act="sprev" aria-label="이전 작품">' + IC.prev + '</button><button data-act="snext" aria-label="다음 작품">' + IC.next + '</button></span></div></div></section>';
  h += '<section class="archive"><div class="bgtype" aria-hidden="true">ARCHIVE</div><div class="wrap"><div class="arc">' +
    '<div class="rv"><span class="label muted">04 — Archive</span><h2 class="h2" style="margin-top:20px">Past Exhibitions</h2><p>막을 내린 전시도 사라지지 않아요. 지난 전시의 작품, 기획 글, 기록을 아카이브에서 다시 볼 수 있어요.</p><a class="link" href="#/archive">아카이브 들어가기 <span class="ar">→</span></a></div>' +
    '<div class="list rv">' + past.map(function (e) { return '<a href="#/exhibitions/' + e.id + '"><span class="y">' + e.startDate.slice(0, 4) + '</span><span class="t">' + esc(e.title) + '</span><span class="k">' + esc(e.subtitle) + (e.theme ? ' · ' + Q.theme(e.theme).en : '') + '</span></a>'; }).join('') + '</div></div></div></section>';
  /* 맨 끝: 곧 열리는 전시(SOON)로 이어지는 칸. 작품은 보여주지 않고 대표 이미지·오픈일만 */
  h += '<section class="sec hsoon"><div class="wrap">' + SecHead('05', 'Coming Soon', '공개 예정 전시', '곧 문을 여는 전시의 컨셉과 이야기를 먼저 만나보세요', '<a class="link rv" href="#/soon">SOON 가기 <span class="ar">→</span></a>') +
    (up.length ? '<div class="hsoon-g" style="--n:' + up.length + '">' + up.map(function (e) { var th = e.theme ? Q.theme(e.theme) : null;
      return '<a class="hsoon-c rv" href="#/exhibitions/' + e.id + '"><span class="soon-img">' + Img(e.coverImage, { w: 900, h: 600, ratio: '3/2', alt: '' }) + '<span class="dday">' + dday(e.startDate) + '</span></span>' +
        '<span class="label muted">' + dot(e.startDate) + ' 오픈' + (th ? ' · ' + th.en : '') + '</span><span class="ttl t-' + e.type + '">' + esc(e.title) + '</span><span class="ko">' + esc(e.subtitle) + '</span></a>'; }).join('') + '</div>'
      : EmptyState('공개 예정 전시가 없어요', '새 전시가 정해지면 SOON에서 소개할게요.')) +
    '<div class="hsoon-end rv"><a class="btn ghost" href="#/soon">공개 예정 전시 모두 보기 <span class="ar">→</span></a></div></div></section>';
  return h;
};

/* ───────────────── EXHIBITIONS (진행 중) ─────────────────
   설명·주제 선택 없이, 진행 중인 전시(최대 5개)와 각 전시의 작품을 바로 보여줘요. */
P.exhibitions = function () {
  var cur = Q.db().exhibitions.filter(function (e) { return e.status === 'current'; });
  var h = '<div class="exh-top"><div class="wrap"><span class="label muted">Now on View · 진행 중인 전시 ' + cur.length + '</span></div></div>';
  if (!cur.length) return h + '<div class="wrap">' + EmptyState('진행 중인 전시가 없어요', '곧 열릴 전시는 SOON에서 미리 볼 수 있어요.', '<a class="link" href="#/soon">공개 예정 전시 보기 <span class="ar">→</span></a>') + '</div>';
  return h + cur.map(function (e, i) { var ws = Q.exWorks(e.id), th = e.theme ? Q.theme(e.theme) : null, artists = Q.exArtists(e.id).map(function (u) { return esc(u.nickname); }).join(', ');
    return '<section class="exblock mood-' + e.mood + '" aria-label="' + esc(e.title) + '"><div class="wrap">' +
      '<a class="exb-head" href="#/exhibitions/' + e.id + '"><span class="exb-no">' + ('0' + (i + 1)).slice(-2) + '</span><span class="exb-t"><span class="label muted">' + period(e) + (th ? ' · ' + th.en : '') + '</span><span class="ttl t-' + e.type + '">' + esc(e.title) + '</span><span class="ko">' + esc(e.subtitle) + ' · ' + artists + '</span></span><span class="link">전시 입장하기 <span class="ar">→</span></span></a>' +
      '<div class="exb-works">' + ws.map(function (w, j) { var wh = ratioWH(w.ratio);
        return '<a class="exb-w rv" href="' + Q.workHref(w) + '">' + Img(Q.imageOf(w), { w: wh.w, h: wh.h, ratio: w.ratio, alt: w.title }) + '<span class="exb-cap"><span class="idx">' + ('0' + (j + 1)).slice(-2) + '</span><b>' + esc(w.title) + '</b><span class="muted">' + esc(Q.user(w.artistId).nickname) + '</span></span></a>'; }).join('') + '</div>' +
      '</div></section>'; }).join('');
};

/* ───────────────── SOON (공개 예정) ───────────────── */
function dday(d) { var n = Math.round((new Date(d) - new Date(Q.db().today)) / 864e5); return n > 0 ? 'D-' + n : n === 0 ? 'D-DAY' : ''; }
P.soon = function () {
  var up = Q.db().exhibitions.filter(function (e) { return e.status === 'upcoming'; }).sort(function (a, b) { return a.startDate < b.startDate ? -1 : 1; });
  return PageHead('Soon · 공개 예정 전시', 'Soon', '곧 문을 여는 전시. 작품은 전시가 열릴 때 공개하고, 지금은 컨셉과 기획 의도, 전시 이야기를 먼저 소개해요.') +
    '<section class="sec tight"><div class="wrap">' + (up.length ? '<div class="soonlist">' + up.map(function (e) { var th = e.theme ? Q.theme(e.theme) : null, artists = Q.exArtists(e.id).map(function (u) { return esc(u.nickname); }).join(', ');
      return '<article class="soon rv"><a class="soon-img" href="#/exhibitions/' + e.id + '" tabindex="-1" aria-hidden="true">' + Img(e.coverImage, { w: 900, h: 600, ratio: '3/2', alt: '' }) + '<span class="dday">' + dday(e.startDate) + '</span></a>' +
        '<div class="soon-txt"><div class="label muted">' + dot(e.startDate) + ' 오픈' + (th ? ' · ' + th.en : '') + '</div><h2 class="ttl t-' + e.type + '"><a href="#/exhibitions/' + e.id + '">' + esc(e.title) + '</a></h2><div class="ko">' + esc(e.subtitle) + ' · ' + artists + '</div><p>' + esc(e.description) + '</p>' +
        (e.sound ? '<p class="label muted soon-snd">♪ 소리가 있는 전시예요</p>' : '') +
        '<a class="link" href="#/exhibitions/' + e.id + '">전시 미리 보기 <span class="ar">→</span></a></div></article>'; }).join('') + '</div>'
      : EmptyState('공개 예정 전시가 없어요', '새 전시가 정해지면 이곳에 소개할게요.')) + '</div></section>';
};

P.exhibition = function (id) {
  var e = Q.exhibition(id); if (!e) return P.notfound();
  var ws = Q.exWorks(e.id), artists = Q.exArtists(e.id), th = e.theme ? Q.theme(e.theme) : null,
    st = { current: '진행 중', upcoming: '공개 예정', past: '종료된 전시 · 아카이브 기록' }[e.status],
    rel = Q.db().exhibitions.filter(function (x) { return x.id !== e.id && (x.theme && x.theme === e.theme); });
  if (rel.length < 3) rel = rel.concat(Q.db().exhibitions.filter(function (x) { return x.id !== e.id && rel.indexOf(x) < 0 && x.status === 'current'; })).slice(0, 3);
  var soon = e.status === 'upcoming', shown = soon ? [] : ws;
  var h = '<article class="exd mood-' + e.mood + '">' +
    '<section class="excover"><div class="bg">' + Img(e.coverImage, { w: 1600, h: 1000, alt: e.title + ' 대표 이미지' }) + '</div><div class="wrap excover-in">' +
    (e.status === 'past' ? '<a class="back" href="#/archive">← 아카이브</a>' : e.status === 'upcoming' ? '<a class="back" href="#/soon">← 공개 예정 전시</a>' : '<a class="back" href="#/exhibitions">← 진행 중인 전시</a>') +
    '<div class="label">' + st + (th ? ' · ' + th.en + ' ' + th.label : '') + ' · ' + e.kind + '</div><h1 class="display t-' + e.type + '">' + esc(e.title) + '</h1><p class="exsub">' + esc(e.subtitle) + '</p><p class="exper">' + (soon ? '<b class="ddaytxt">' + dday(e.startDate) + '</b> ' : '') + period(e) + '</p>' + SoundButton('e:' + e.id, e.sound, 'cover') +
    (shown.length ? '<button class="link" data-act="viewer" data-ex="' + e.id + '" data-i="0">몰입형으로 감상하기 <span class="ar">→</span></button>' : '') + '</div></section>' +
    '<section class="exintro"><div class="wrap exintro-g"><div class="stmt rv"><div class="label muted">기획 의도 · Curatorial Statement</div><blockquote>' + esc(e.curatorStatement) + '</blockquote></div>' +
    '<div class="exdesc rv"><div class="label muted">' + (soon ? '컨셉 · Concept' : '전시 소개') + '</div><p>' + esc(e.description) + '</p><dl class="amd"><div><dt>기간</dt><dd>' + period(e) + '</dd></div><div><dt>주제</dt><dd>' + (th ? th.en + ' · ' + th.label : '주제 없음') + '</dd></div>' +
    '<div><dt>참여 작가</dt><dd>' + (soon ? artists.map(function (u) { return esc(u.nickname); }).join(', ') : artists.length + '명') + '</dd></div>' + (soon ? '' : '<div><dt>작품</dt><dd>' + ws.length + '점</dd></div>') + '</dl></div></div></section>';
  if (soon) h += '<section class="exstory"><div class="wrap exstory-g"><div class="label muted rv">전시 이야기 · Story</div><div class="prose rv">' + String(e.story || e.description).split('\n').filter(Boolean).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
    '<p class="soon-note">작품은 ' + dot(e.startDate) + ' 전시가 열리면 공개돼요.</p></div></div></section>';
  else h += '<section class="rooms" id="works" aria-label="작품 감상">' +
    (shown.length ? shown.map(function (w, i) { var u = Q.user(w.artistId), wh = ratioWH(w.ratio);
      return '<div class="room r' + (i % 3) + ' rv"><div class="wrap room-g"><button class="room-img" data-act="viewer" data-ex="' + e.id + '" data-i="' + i + '" aria-label="' + esc(w.title) + ' 크게 보기">' + Img(Q.imageOf(w), { w: wh.w * 2, h: wh.h * 2, ratio: w.ratio, alt: w.title }) + '<span class="zoom">' + IC.expand + '</span></button>' +
        '<div class="room-cap"><span class="idx">' + ('0' + (i + 1)).slice(-2) + ' <i>/ ' + ('0' + shown.length).slice(-2) + '</i></span><h2>' + esc(w.title) + '</h2><div class="who">' + UserLink(u) + '</div><div class="label muted">' + lbl('field', w.field) + ' · ' + lbl('medium', w.medium) + ' · ' + w.createdAt.slice(0, 4) + '</div>' +
        '<p>' + esc(w.description) + '</p>' + SoundButton('w:' + w.id, w.sound) + '<a class="link" href="' + Q.workHref(w) + '">작품 이야기 · 감상 ' + Q.comments(w.id).length + ' <span class="ar">→</span></a></div></div></div>'; }).join('')
      : '<div class="wrap">' + EmptyState('아직 걸린 작품이 없어요', '작품이 공개되면 이곳에 전시돼요.') + '</div>') + '</section>';
  h += '<section class="sec tight exartists"><div class="wrap"><h2 class="h3">참여 작가</h2><div class="alist">' + artists.map(function (u) { var f = Q.field(u.field);
    return '<a class="aitem" href="#/artists/' + u.id + '">' + Img(u.profileImage, { w: 160, h: 160, ratio: '1/1' }) + '<span><b>' + esc(u.nickname) + '</b> ' + FeaturedArtistBadge(u, true) + '<br><span class="muted">' + (f ? f.label : '') + (soon ? ' · 공개 예정' : ' · 전시 작품 ' + ws.filter(function (w) { return w.artistId === u.id; }).length + '점') + '</span></span><span class="ar">→</span></a>'; }).join('') + '</div></div></section>';
  h += '<section class="sec tight related"><div class="wrap"><h2 class="h3">관련 전시</h2><div class="relgrid">' + rel.map(function (x) { return ExhibitionCard(x, '', '4/3'); }).join('') + '</div></div></section></article>';
  return h;
};

/* ───────────────── 전시 작품 상세 ─────────────────
   전시 안에서만 열리는 작품 화면. 작품 이야기(story)와 이 작품만의 감상(댓글)을 보여줘요.
   오픈 갤러리 작품 상세(P.work)와는 다른 화면이고, 오픈 갤러리로 연결되지 않아요. */
P.exWork = function (exId, wid) {
  var e = Q.exhibition(exId), w = Q.work(wid);
  if (!e || !w || w.space !== 'exhibition' || w.exhibitionId !== e.id) return P.notfound();
  if (!Q.exVisible(w)) return '<section class="stub"><div class="wrap"><span class="label muted">공개 예정 · ' + dot(e.startDate) + ' 오픈</span><h1 class="display">Not<br>Yet</h1><p style="max-width:32em;font-size:16px">전시가 열리면 감상할 수 있는 작품이에요.</p><div class="acts"><a class="link" href="#/exhibitions/' + e.id + '">전시 미리 보기 <span class="ar">→</span></a><a class="link" href="#/soon">공개 예정 전시 <span class="ar">→</span></a></div></div></section>';
  var u = Q.user(w.artistId), list = Q.exWorks(e.id).filter(Q.exVisible), i = list.indexOf(w), prev = list[i - 1], next = list[i + 1], wh = ratioWH(w.ratio), th = w.theme ? Q.theme(w.theme) : null,
    others = list.filter(function (x) { return x !== w; });
  var nav = function (x, dir) { return x ? '<a class="exw-' + dir + '" href="' + Q.workHref(x) + '"><span class="label muted">' + (dir === 'prev' ? '← 이전 작품' : '다음 작품 →') + '</span><b>' + esc(x.title) + '</b></a>' : '<span></span>'; };
  var h = '<article class="exd exw mood-' + e.mood + '">' +
    '<section class="wstage"><button class="wimg" style="--r:' + w.ratio + '" data-act="viewer" data-ex="' + e.id + '" data-i="' + i + '" aria-label="' + esc(w.title) + ' 크게 보기">' + Img(Q.imageOf(w), { w: wh.w * 3, h: wh.h * 3, ratio: w.ratio, alt: w.title }) + '<span class="zoom">' + IC.expand + '</span></button></section>' +
    '<section class="wbody"><div class="wrap"><a class="back" href="#/exhibitions/' + e.id + '">← ' + esc(e.title) + ' · ' + esc(e.subtitle) + '</a></div><div class="wrap wgrid"><div class="wmain">' +
    '<div class="label muted">' + ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + list.length).slice(-2) + ' · ' + esc(e.title) + (e.status === 'upcoming' ? ' · Preview' : e.status === 'past' ? ' · Archive' : '') + '</div><h1 class="wtitle">' + esc(w.title) + '</h1>' +
    '<div class="wartist">' + Img(u.profileImage, { w: 80, h: 80, ratio: '1/1', cls: 'mini' }) + '<div>' + UserLink(u) + '<div class="muted">' + (Q.field(u.field) ? Q.field(u.field).label : '') + ' · 전시 작가</div></div>' + FollowButton(u, 'sm') + '</div>' +
    '<div class="wtext"><p class="exw-lead">' + esc(w.description) + '</p><h2 class="label muted">작품 이야기 · Story</h2>' + String(w.story || '').split('\n').filter(Boolean).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div></div>' +
    '<aside class="wside">' + SoundButton('w:' + w.id, w.sound, 'full') + SaveButton(w, 'full') + ArtworkMetadata(w) +
    '<div class="wex"><div class="label muted">이 작품이 걸린 전시</div><a href="#/exhibitions/' + e.id + '">' + esc(e.title) + ' <span class="muted">' + esc(e.subtitle) + ' · ' + period(e) + '</span></a></div></aside></div>' +
    '<div class="wrap exw-nav">' + nav(prev, 'prev') + nav(next, 'next') + '</div></section>' +
    '<section class="sec tight comments" id="comments"><div class="wrap cwrap"><h2 class="h3">감상 <span class="muted">' + Q.comments(w.id).length + '</span></h2><p class="muted small exw-cnote">이 전시 작품에 남긴 감상이에요. 오픈 갤러리와는 따로 모여요.</p>' + CommentForm(w.id) + CommentList(w.id) + '</div></section>';
  if (others.length) h += '<section class="sec tight related"><div class="wrap"><div class="subhead"><h2 class="h3">이 전시의 다른 작품</h2><a class="link" href="#/exhibitions/' + e.id + '">전시로 돌아가기 <span class="ar">→</span></a></div><div class="row4">' + others.slice(0, 4).map(function (x) { return ArtworkCard(x, { ratio: '4/5' }); }).join('') + '</div></div></section>';
  return h + '</article>';
};

/* ───────────────── OPEN GALLERY ───────────────── */
P.gallery = function (seg, q) {
  var db = Q.db(), kw = (q.q || '').trim().toLowerCase();
  var list = Q.publicWorks().filter(function (w) { var u = Q.user(w.artistId);
    return (!q.field || w.field === q.field) && (!q.theme || w.theme === q.theme) && (!q.medium || w.medium === q.medium) && (!kw || (w.title + ' ' + (u ? u.nickname + ' ' + u.handle : '')).toLowerCase().indexOf(kw) > -1); });
  list.sort(q.sort === 'old' ? function (a, b) { return -Q.byNew(a, b); } : Q.byNew);
  var active = ['field', 'theme', 'medium'].filter(function (k) { return q[k]; }).length;
  var cta = OS.can('upload') ? '<a class="btn pri sm" href="#/upload">+ 작품 올리기</a>' : OS.me() && OS.role() === 'viewer' ? '<a class="btn ghost sm" href="#/mypage/settings">창작자로 전환하고 작품 올리기</a>' : !OS.me() ? '<a class="btn ghost sm" href="#/signup">창작자로 가입하고 작품 올리기</a>' : '';
  var h = PageHead('Open Gallery · 오픈 갤러리', 'Open Gallery', '일반 창작자가 자유롭게 작품을 올리고 나누는 공간이에요. 전시 작품은 이곳에 나오지 않아요.', '<div class="phead-cta">' + cta + '</div>') +
    '<div class="wrap gtools">' + SearchBar(q.q, '작품명 또는 작가명 검색', 'gallery') +
    FilterPanel([FilterGroup('분야', 'field', db.fields, q.field), FilterGroup('주제', 'theme', db.themes.map(function (x) { return { id: x.id, label: x.label, chip: x.en }; }), q.theme), FilterGroup('매체', 'medium', db.media, q.medium)], active) +
    '<div class="gmeta"><span class="muted" aria-live="polite">작품 ' + list.length + '점</span>' + (active || kw ? '<button class="txtbtn" data-act="filter-reset">필터 초기화</button>' : '') +
    '<label class="sort"><span class="sr">정렬</span><select data-act="sort"><option value="new"' + (q.sort !== 'old' ? ' selected' : '') + '>최신순</option><option value="old"' + (q.sort === 'old' ? ' selected' : '') + '>오래된 순</option></select></label></div></div>';
  if (q.state === 'error') return h + '<div class="wrap">' + ErrorState('작품을 불러오지 못했어요', '잠시 후 다시 시도해 주세요. (오류 화면 예시)', '<a class="btn ghost sm" href="#/gallery">다시 시도</a>') + '</div>';
  h += '<div class="wrap" id="gallery">' + (list.length ? '<div class="masonry">' + list.map(function (w) { return ArtworkCard(w, { meta: true }); }).join('') + '</div>'
    : EmptyState('조건에 맞는 작품이 없어요', '검색어나 필터를 바꿔보세요.', '<button class="btn ghost sm" data-act="filter-reset">필터 초기화</button>')) + '</div>';
  return h;
};

P.work = function (id) {
  var w = Q.work(id); if (!w) return P.notfound();
  if (w.space === 'exhibition') return P.exWork(w.exhibitionId, w.id);
  if (!OS.canSeeWork(w)) return P.denied('private');
  var u = Q.user(w.artistId), own = OS.canManageWork(w), more = Q.worksBy(u.id).filter(function (x) { return x.id !== w.id; }).slice(0, 4),
    rel = Q.publicWorks().filter(function (x) { return x.id !== w.id && x.artistId !== w.artistId && (x.theme === w.theme || x.field === w.field); }).sort(Q.byNew).slice(0, 4);
  var h = '<article class="wd">' + (w.status !== 'published' ? '<div class="wstatus">' + (w.status === 'draft' ? '초안 · 나에게만 보이는 작품이에요' : '보관됨 · 공개 목록에서 숨겨진 작품이에요') + (own ? ' <a href="#/works/' + w.id + '/edit">관리하기</a>' : '') + '</div>' : '') +
    '<section class="wstage"><button class="wimg" style="--r:' + w.ratio + '" data-act="viewer" data-work="' + w.id + '" aria-label="' + esc(w.title) + ' 크게 보기">' + Img(Q.imageOf(w), { w: ratioWH(w.ratio).w * 3, h: ratioWH(w.ratio).h * 3, ratio: w.ratio, alt: w.title }) + '<span class="zoom">' + IC.expand + '</span></button></section>' +
    '<section class="wbody"><div class="wrap wgrid"><div class="wmain"><div class="label muted">' + lbl('field', w.field) + (w.theme ? ' · ' + Q.theme(w.theme).en : '') + '</div><h1 class="wtitle">' + esc(w.title) + '</h1>' +
    '<div class="wartist">' + Img(u.profileImage, { w: 80, h: 80, ratio: '1/1', cls: 'mini' }) + '<div>' + UserLink(u) + '<div class="muted">' + (Q.field(u.field) ? Q.field(u.field).label : '') + ' · 팔로워 ' + Q.followers(u.id) + '</div></div>' + FollowButton(u, 'sm') + '</div>' +
    '<div class="wtext"><h2 class="label muted">작품 설명</h2><p>' + esc(w.description || '—') + '</p>' + (w.intent ? '<h2 class="label muted">제작 의도</h2><p class="intent">' + esc(w.intent) + '</p>' : '') + '</div></div>' +
    '<aside class="wside">' + SoundButton('w:' + w.id, w.sound, 'full') + SaveButton(w, 'full') + (own ? '<a class="btn ghost" href="#/works/' + w.id + '/edit">작품 수정 · 관리</a>' : '') + ArtworkMetadata(w) + '</aside></div></section>' +
    '<section class="sec tight comments" id="comments"><div class="wrap cwrap"><h2 class="h3">감상 <span class="muted">' + Q.comments(w.id).length + '</span></h2>' + CommentForm(w.id) + CommentList(w.id) + '</div></section>';
  if (more.length) h += '<section class="sec tight"><div class="wrap"><div class="subhead"><h2 class="h3">' + esc(u.nickname) + '의 다른 작품</h2><a class="link" href="#/artists/' + u.id + '">프로필 보기 <span class="ar">→</span></a></div><div class="row4">' + more.map(function (x) { return ArtworkCard(x, { ratio: '4/5' }); }).join('') + '</div></div></section>';
  if (rel.length) h += '<section class="sec tight paper"><div class="wrap"><div class="subhead"><h2 class="h3">관련 작품</h2><p class="muted">같은 주제나 분야의 작품</p></div><div class="row4">' + rel.map(function (x) { return ArtworkCard(x, { ratio: '4/5' }); }).join('') + '</div></div></section>';
  return h + '</article>';
};

P.workForm = function (id) {
  var w = id ? Q.work(id) : null;
  if (id && !w) return P.notfound();
  if (!OS.me()) return P.denied('login');
  if (w ? !OS.canManageWork(w) : !OS.can('upload')) return P.denied(w ? 'owner' : 'upload');
  return PageHead(w ? 'Edit · 작품 수정' : 'Upload · 작품 올리기', w ? 'Edit Work' : 'New Work', w ? '작품 정보와 공개 상태를 바꾸거나, 보관·삭제할 수 있어요.' : '오픈 갤러리에 공개할 작품을 등록해요. 창작자 회원 전용 화면이에요.') +
    '<div class="wrap">' + ArtworkForm(w) + '</div>';
};

/* ───────────────── ARTISTS ───────────────── */
P.artists = function (seg, q) {
  var match = function (u) { return !q.field || u.field === q.field; }, byName = function (a, b) { return a.nickname < b.nickname ? -1 : 1; },
    pros = Q.proArtists().filter(match).sort(byName), gal = Q.galleryCreators().filter(match).sort(byName), show = q.group || '';
  var block = function (key, en, ko, sub, list) { if (show && show !== key) return '';
    return '<section class="sec tight' + (key === 'gallery' ? ' paper' : '') + '"><div class="wrap"><div class="subhead"><h2 class="h3">' + en + ' <span class="muted">' + list.length + '</span></h2><p class="muted">' + ko + ' — ' + sub + '</p></div>' +
      (list.length ? '<div class="argrid">' + list.map(ArtistCard).join('') + '</div>' : EmptyState('조건에 맞는 ' + ko + '가 없어요', '다른 분야를 골라보세요.', '<button class="btn ghost sm" data-act="filter-reset">필터 초기화</button>')) + '</div></section>'; };
  return PageHead('Artists · 창작자', 'Artists', '전시를 여는 전시 작가와, 오픈 갤러리에서 활동하는 창작자.') +
    '<div class="wrap fbar">' + FilterGroup('분야', 'field', Q.db().fields, q.field) + FilterGroup('구분', 'group', [{ id: 'pro', label: '전시 작가' }, { id: 'gallery', label: '오픈 갤러리 창작자' }], q.group) + '</div>' +
    block('pro', 'Exhibition Artists', '전시 작가', 'EXHIBITIONS · SOON · ARCHIVE에서 작품을 선보이는 작가', pros) +
    block('gallery', 'Open Gallery Creators', '오픈 갤러리 창작자', '오픈 갤러리에 직접 작품을 올리는 창작자', gal);
};

P.artist = function (id) {
  var u = Q.user(id); if (!u || u.role !== 'creator') return P.notfound();
  var me = OS.me(), own = !!(me && me.id === u.id), ws = Q.worksBy(u.id), exw = Q.exWorksBy(u.id), exs = [];
  Q.db().exhibitions.forEach(function (e) { if (Q.exArtists(e.id).some(function (a) { return a.id === u.id; })) exs.push(e); });
  return (own ? '<div class="ownbar">' + DemoNote('내 프로필이에요. 다른 사람에게는 공개 작품만 보여요.').replace('DEMO', 'MY') + '</div>' : '') + ProfileHeader(u, own) +
    (exw.length ? '<section class="sec tight"><div class="wrap"><div class="subhead"><h2 class="h3">전시 작품 <span class="muted">' + exw.length + '</span></h2><p class="muted">전시 안에서 작품 이야기와 감상을 볼 수 있어요.</p></div><div class="masonry">' + exw.map(function (w) { return ArtworkCard(w, { meta: true }); }).join('') + '</div></div></section>' : '') +
    (u.isFeaturedArtist && !ws.length && !own ? '' : '<section class="sec tight"><div class="wrap"><div class="subhead"><h2 class="h3">오픈 갤러리 작품 <span class="muted">' + ws.length + '</span></h2>' + (own ? '<a class="link" href="#/upload">작품 올리기 <span class="ar">→</span></a>' : '') + '</div>' +
    (ws.length ? '<div class="masonry">' + ws.map(function (w) { return ArtworkCard(w, { meta: true }); }).join('') + '</div>' : EmptyState('아직 공개한 작품이 없어요', own ? '첫 작품을 올려보세요.' : '작품이 공개되면 이곳에 보여요.', own ? '<a class="btn pri sm" href="#/upload">작품 올리기</a>' : '')) + '</div></section>') +
    (exs.length ? '<section class="sec tight paper"><div class="wrap"><h2 class="h3">참여한 전시</h2><div class="relgrid">' + exs.map(function (e) { return ExhibitionCard(e, '', '4/3'); }).join('') + '</div></div></section>' : '');
};

/* ───────────────── ARCHIVE ───────────────── */
P.archive = function (seg, q) {
  var past = Q.db().exhibitions.filter(function (e) { return e.status === 'past'; }).sort(function (a, b) { return a.startDate < b.startDate ? 1 : -1; }),
    years = past.map(function (e) { return e.startDate.slice(0, 4); }).filter(function (y, i, a) { return a.indexOf(y) === i; }),
    list = past.filter(function (e) { return (!q.year || e.startDate.slice(0, 4) === q.year) && (!q.theme || e.theme === q.theme); });
  return PageHead('Archive · 아카이브', 'Archive', '막을 내린 전시의 기록. 종료된 전시도 작품과 기획 글을 그대로 감상할 수 있어요.') +
    '<div class="wrap fbar">' + FilterGroup('연도', 'year', years.map(function (y) { return { id: y, label: y }; }), q.year) + FilterGroup('주제', 'theme', Q.db().themes.map(function (x) { return { id: x.id, label: x.label, chip: x.en }; }), q.theme) + '</div>' +
    '<section class="sec tight"><div class="wrap">' + (list.length ? '<div class="exrows"><div class="exrows-h label muted" aria-hidden="true"><span></span><span>연도</span><span>전시</span><span>기간 · 참여 작가</span><span>주제</span></div>' + list.map(function (e) { return ExhibitionCard(e, 'row'); }).join('') + '</div>'
      : EmptyState('조건에 맞는 지난 전시가 없어요', '연도나 주제를 바꿔보세요.', '<button class="btn ghost sm" data-act="filter-reset">필터 초기화</button>')) + '</div></section>';
};

/* ───────────────── ABOUT ───────────────── */
P.about = function () {
  var V = [['Experimental', '실험', '익숙한 감상 방식에서 벗어난 새로운 시각 경험을 제안해요.'], ['Immersive', '몰입', '한 화면에 한 작품. 작품과 전시에 오롯이 빠져드는 경험을 만들어요.'], ['Curated', '기획', '모든 기획 전시는 분명한 주제와 기획 의도에서 출발해요.'], ['Exploratory', '탐색', '새로운 작품과 창작자를 발견하는 길을 여러 갈래로 열어둬요.'], ['Inclusive', '포용', '전문 작가의 기획 전시와 누구나 참여하는 오픈 갤러리가 한곳에 있어요.']];
  return '<section class="about-hero"><div class="wrap"><span class="label muted">About · 소개</span><h1 class="display">Beyond the<br>Ordinary.</h1><p class="lede">OTHER SPACE는 패션, 그래픽 디자인, 사진, 일러스트레이션, 디지털 아트를 온라인 전시로 경험하는 디지털 미술관이에요. 작품 이미지를 모아둔 곳이 아니라, 작품 안으로 걸어 들어가는 또 다른 공간을 지향해요.</p></div></section>' +
    '<section class="sec paper"><div class="wrap"><div class="shead"><span class="label muted no">01</span><div class="r"><h2 class="h2">Philosophy</h2></div></div><div class="values">' + V.map(function (v, i) { return '<div class="val rv"><span class="n">0' + (i + 1) + '</span><h3>' + v[0] + '</h3><b>' + v[1] + '</b><p>' + v[2] + '</p></div>'; }).join('') + '</div></div></section>' +
    '<section class="sec"><div class="wrap two"><div class="rv"><span class="label muted">02 — 디지털 전시의 목적</span><h2 class="h2s">언제 어디서나,<br>한 작품에 온전히.</h2></div><div class="rv prose"><p>물리적인 전시장은 시간과 장소의 제약이 있어요. OTHER SPACE는 화면 하나를 하나의 전시실로 다뤄, 누구나 원하는 때에 작품 앞에 설 수 있게 해요.</p><p>큰 이미지, 넓은 여백, 절제된 움직임으로 화면 너머의 소음을 줄이고 작품에만 집중할 수 있도록 설계했어요.</p></div></div></section>' +
    '<section class="sec paper"><div class="wrap"><div class="shead"><span class="label muted no">03</span><div class="r"><div><h2 class="h2">Connect</h2><p class="sub"><b>창작자와 관람객을 잇는 방식</b></p></div></div></div><div class="two">' +
    '<div class="conn rv"><h3>기획 전시</h3><p>운영팀과 초대 작가가 하나의 주제 아래 작품을 엮어요. 관람객은 기획 의도를 따라 작품을 차례로 감상해요.</p><a class="link" href="#/exhibitions">전시 보기 <span class="ar">→</span></a></div>' +
    '<div class="conn rv"><h3>오픈 갤러리</h3><p>창작자 회원이라면 누구나 작품을 공개할 수 있어요. 관람객은 저장과 팔로우, 감상 댓글로 창작자에게 응답해요. 눈에 띄는 창작자는 전시 작가로 소개되고 기획 전시로 이어지기도 해요.</p><a class="link" href="#/gallery">오픈 갤러리 보기 <span class="ar">→</span></a></div></div></div></section>' +
    '<section class="sec"><div class="wrap two"><div class="rv"><span class="label muted">04 — 전시 기획 방향</span><h2 class="h2s">하나의 주제,<br>여러 개의 시선.</h2></div><div class="rv prose"><p>MEMORY, IDENTITY, DREAMS, NATURE, ANXIETY, FUTURE처럼 누구나 겪는 주제에서 출발해요. 같은 주제라도 분야와 매체가 다른 작품을 나란히 놓아 새로운 대화를 만들어요.</p><p>전시마다 색, 서체, 배치를 달리해 각각이 독립된 공간처럼 느껴지도록 기획해요.</p></div></div></section>' +
    '<section class="sec paper" id="contact"><div class="wrap two"><div><span class="label muted">05 — 운영 및 문의</span><h2 class="h2s">Contact</h2></div><dl class="amd big"><div><dt>운영</dt><dd>OTHER SPACE 운영팀</dd></div><div><dt>전시·협업 문의</dt><dd>hello@otherspace.example <span class="muted">(예시 주소)</span></dd></div><div><dt>작품·신고 문의</dt><dd>report@otherspace.example <span class="muted">(예시 주소)</span></dd></div><div><dt>운영 시간</dt><dd>온라인 전시는 24시간 열려 있어요</dd></div></dl></div></section>';
};

/* ───────────────── 로그인 · 회원가입 · 재설정 ───────────────── */
function AuthShell(o) {
  return '<section class="auth"><div class="auth-art"><div class="bg">' + Img(o.art, { w: 800, h: 1000 }) + '</div><span class="label muted">' + o.label + '</span><h1 class="display" style="margin-top:16px">' + o.title + '</h1><p>' + o.sub + '</p></div>' +
    '<div class="auth-form"><div class="auth-in">' + o.body + '</div></div></section>'; }
function DemoBox(all) {
  return '<div class="demo"><h2><span class="tag">DEMO</span> 데모 계정으로 둘러보기</h2><p>실제 인증이 아니에요. 이 브라우저 탭에서만 로그인한 것처럼 보이고, 탭을 닫으면 사라져요.</p>' +
    '<div class="two">' + [['viewer', '감상 회원'], ['creator', '창작자 회원']].concat(all ? [['featured', '전시 작가 (창작자)'], ['admin', '운영자']] : []).map(function (d) { return '<button type="button" class="btn ghost" data-act="demo" data-type="' + d[0] + '">' + d[1] + '</button>'; }).join('') + '</div></div>'; }
P.login = function () {
  return AuthShell({ art: { gen: 'figure', seed: 7 }, label: 'Log in', title: 'Welcome<br>Back', sub: '다시 OTHER SPACE로 들어오세요. 저장한 작품과 팔로우한 창작자가 기다리고 있어요.', body:
    '<h1>로그인</h1><p class="lead">이메일과 비밀번호를 입력해 주세요.</p><form class="form" data-form="login" novalidate>' + Field('email', '이메일', 'email', 'you@example.com', '', 'email') + Field('password', '비밀번호', 'password', '비밀번호', '', 'current-password') +
    '<div class="notice" id="formMsg" role="alert"></div><button class="btn pri" type="submit">로그인</button><div class="row"><a href="#/reset">비밀번호를 잊으셨나요?</a><span>처음이신가요? <a href="#/signup">회원가입</a></span></div></form>' + DemoBox(true) });
};
var signupRole = null;
P.signup = function (seg) {
  if (seg[1] && ROLE_INFO[seg[1]]) { signupRole = seg[1]; var r = seg[1];
    return AuthShell({ art: { gen: r === 'creator' ? 'blocks' : 'rings', seed: 41 }, label: 'Join · Step 2 of 2', title: r === 'creator' ? 'Show<br>Your Work' : 'Find<br>Your Space', sub: ROLE_INFO[r].lead, body:
      '<div class="steps"><span class="on">01 회원 유형</span><span class="on">02 정보 입력</span></div><h1>정보 입력</h1><form class="form" data-form="signup" novalidate><div class="chosen"><span>선택한 유형 · <b>' + OS.ROLE_LABEL[r] + '</b> ' + OS.ROLE_EN[r] + '</span><a href="#/signup">변경</a></div><input type="hidden" name="role" value="' + r + '">' +
      Field('email', '이메일', 'email', 'you@example.com', '로그인할 때 사용해요.', 'email') + Field('password', '비밀번호', 'password', '8자 이상, 영문과 숫자 포함', '8자 이상, 영문과 숫자를 함께 써주세요.', 'new-password') +
      Field('password2', '비밀번호 확인', 'password', '비밀번호를 한 번 더 입력', '', 'new-password') + Field('nickname', '닉네임', 'text', r === 'creator' ? '작품과 함께 표시될 이름' : '다른 사람에게 보이는 이름', '2~20자. 다른 회원에게 보여요.', 'nickname', 'maxlength="20"') +
      '<div class="fld" id="f-terms"><span>약관 동의</span><div class="terms"><label class="all"><input type="checkbox" id="tAll"> 필수 약관 전체 동의</label><label><input type="checkbox" class="tReq" name="terms_service"> [필수] 이용약관 동의</label><details><summary>내용 보기</summary><p>프로토타입용 예시 문구예요. 실제 이용약관은 서비스 오픈 전에 확정돼요.</p></details>' +
      '<label><input type="checkbox" class="tReq" name="terms_privacy"> [필수] 개인정보 수집 및 이용 동의</label><details><summary>내용 보기</summary><p>수집 항목: 이메일, 닉네임. 이용 목적: 회원 식별과 서비스 제공. 프로토타입용 예시 문구예요.</p></details></div><small></small></div>' +
      '<div class="notice" id="formMsg" role="alert"></div><button class="btn pri" type="submit">가입하기</button><div class="row"><span>이미 계정이 있나요? <a href="#/login">로그인</a></span></div></form>' }); }
  return AuthShell({ art: { gen: 'lines', seed: 3 }, label: 'Join · Step 1 of 2', title: 'Join<br>Other Space', sub: '감상하는 사람도, 만드는 사람도. 어떤 방식으로 함께할지 먼저 골라주세요. 감상 회원은 가입한 뒤에도 마이페이지에서 창작자 회원으로 바꿀 수 있어요.', body:
    '<div class="steps"><span class="on">01 회원 유형</span><span>02 정보 입력</span></div><h1>회원 유형 선택</h1><p class="lead">두 유형의 차이를 확인하고 하나를 선택해 주세요.</p>' + RoleSelector(signupRole) +
    '<div class="form"><button class="btn pri" data-act="type-next"' + (signupRole ? '' : ' disabled') + '>' + (signupRole ? OS.ROLE_LABEL[signupRole] + '으로 계속하기' : '회원 유형을 선택해 주세요') + '</button><div class="row"><span>이미 계정이 있나요? <a href="#/login">로그인</a></span></div></div>' });
};
P.signupDone = function (role, nick) {
  return AuthShell({ art: { gen: 'particles', seed: 71 }, label: 'Join · Prototype', title: 'Almost<br>There', sub: '실제 서비스에서는 이 단계에서 계정이 만들어지고 인증 메일이 발송돼요.', body:
    '<div class="done-mark">✓</div><h1 style="margin-top:20px">입력 확인이 끝났어요, ' + esc(nick) + '님</h1><p class="lead">모든 항목이 형식 검사를 통과했어요.</p>' +
    '<div class="notice on" style="margin-top:28px"><b>프로토타입이라 실제 계정은 만들어지지 않았어요.</b><br>입력하신 이메일과 비밀번호는 어디에도 저장되거나 전송되지 않았어요.</div>' +
    '<div class="form"><button class="btn pri" data-act="demo" data-type="' + role + '" data-next="' + (role === 'creator' ? '/gallery' : '/mypage/profile?welcome=1') + '">' + OS.ROLE_LABEL[role] + ' 데모 계정으로 계속하기</button><a class="btn ghost" href="#/">HOME으로</a></div>' });
};
P.reset = function () {
  return AuthShell({ art: { gen: 'rings', seed: 107 }, label: 'Reset Password', title: 'Find<br>Your Way', sub: '가입한 이메일을 알려주시면 비밀번호를 다시 정할 수 있는 링크를 보내드려요.', body:
    '<h1>비밀번호 재설정</h1><p class="lead">가입할 때 사용한 이메일을 입력해 주세요.</p><form class="form" data-form="reset" novalidate>' + Field('email', '이메일', 'email', 'you@example.com', '', 'email') +
    '<div class="notice" id="formMsg" role="status"></div><button class="btn pri" type="submit">재설정 링크 받기</button><div class="row"><a href="#/login">로그인으로 돌아가기</a></div></form>' });
};

/* ───────────────── MY PAGE ───────────────── */
var MY_TABS = [['profile', 'Profile', '프로필'], ['works', 'My Works', '내 작품'], ['saved', 'Saved Works', '저장한 작품'], ['following', 'Following', '팔로우'], ['activity', 'Activity', '활동'], ['settings', 'Settings', '설정']];
P.mypage = function (seg, q) {
  var me = OS.me(); if (!me) return P.denied('login');
  var tab = seg[1] || 'profile', body = '';
  if (tab === 'profile') {
    body = (q.welcome ? '<div class="notice on welcome"><b>환영해요, ' + esc(me.nickname) + '님.</b> 프로필을 설정하고 공개 작품을 감상해 보세요. <a href="#/exhibitions">전시 보러 가기 →</a></div>' : '') +
      '<div class="mygrid"><form class="form narrow" data-form="profile" novalidate>' + Field('nickname', '닉네임', 'text', '닉네임', '2~20자', 'nickname', 'maxlength="20"', me.nickname) + TextArea('bio', '소개', '나를 한 줄로 소개해 주세요', me.bio, 3) +
      (me.role === 'creator' ? Select('field', '주 활동 분야', Q.db().fields, me.field, true) : '') + '<div class="fld"><span>프로필 이미지</span><div class="pimg">' + Img(me.profileImage, { w: 160, h: 160, ratio: '1/1' }) + '<button type="button" class="btn ghost sm" data-act="soon" data-msg="프로필 이미지 변경은 실제 파일 저장소를 연결한 뒤 제공돼요.">이미지 변경 (준비 중)</button></div></div>' +
      '<button class="btn pri" type="submit">프로필 저장</button></form><div class="mycard"><div class="label muted">공개 정보 미리보기</div><div class="pv">' + Img(me.profileImage, { w: 160, h: 160, ratio: '1/1', cls: 'mini' }) + '<div><b>' + esc(me.nickname) + '</b> ' + FeaturedArtistBadge(me, true) + '<p class="muted">' + esc(me.bio || '소개 없음') + '</p></div></div>' +
      (me.role === 'creator' ? '<a class="link" href="#/artists/' + me.id + '">내 창작자 프로필 보기 <span class="ar">→</span></a>' : '<p class="muted small">감상 회원은 공개 프로필 페이지가 없고, 댓글 옆에 닉네임만 표시돼요.</p>') + '</div></div>';
  } else if (tab === 'works') {
    if (me.role !== 'creator') body = '<div class="switchcard"><span class="label muted">For Creators</span><h3>작품 관리는 창작자 회원 기능이에요</h3><p>창작자 회원으로 전환하면 지금 계정 그대로 작품을 올리고 관리할 수 있어요. 저장한 작품, 팔로우, 댓글은 모두 유지돼요.</p><a class="btn pri sm" href="#/mypage/settings">창작자 회원으로 전환하기</a></div>';
    else { var all = Q.worksBy(me.id, true), f = q.status || 'all', C = function (s) { return all.filter(function (w) { return s === 'all' || w.status === s; }); }, list = C(f);
      body = '<div class="subhead"><div class="chips" role="group" aria-label="작품 상태">' + [['all', '전체'], ['published', '공개'], ['draft', '초안'], ['archived', '보관됨']].map(function (s) { return '<button class="chip' + (f === s[0] ? ' on' : '') + '" data-act="filter" data-k="status" data-v="' + (s[0] === 'all' ? '' : s[0]) + '" aria-pressed="' + (f === s[0]) + '">' + s[1] + ' ' + C(s[0]).length + '</button>'; }).join('') + '</div><a class="btn pri sm" href="#/upload">+ 작품 등록</a></div>' +
        (f === 'archived' ? '<p class="muted small" style="margin-bottom:20px">보관한 작품은 공개 목록에 나오지 않지만 여기에서 다시 확인하고 공개로 되돌릴 수 있어요.</p>' : '') +
        (list.length ? '<div class="mworks">' + list.map(function (w) { return '<div class="mw">' + ArtworkCard(w, { save: false, status: true, ratio: '1/1' }) + '<div class="mw-acts"><a class="txtbtn" href="#/works/' + w.id + '/edit">수정</a>' + (w.status === 'archived' ? '<button class="txtbtn" data-act="restore" data-id="' + w.id + '">공개로 되돌리기</button>' : '<button class="txtbtn" data-act="archive" data-id="' + w.id + '">보관</button>') + '<button class="txtbtn del" data-act="delete" data-id="' + w.id + '">삭제</button></div></div>'; }).join('') + '</div>'
          : EmptyState(f === 'all' ? '아직 올린 작품이 없어요' : '이 상태의 작품이 없어요', '', f === 'all' ? '<a class="btn pri sm" href="#/upload">첫 작품 올리기</a>' : '')); }
  } else if (tab === 'saved') { var sv = Q.savedBy(me.id);
    body = sv.length ? '<div class="masonry">' + sv.map(function (w) { return ArtworkCard(w, { meta: true }); }).join('') + '</div>' : EmptyState('저장한 작품이 없어요', '마음에 드는 작품의 저장 버튼을 눌러 모아보세요.', '<a class="btn ghost sm" href="#/gallery">오픈 갤러리 둘러보기</a>');
  } else if (tab === 'following') { var fl = Q.following(me.id);
    body = fl.length ? '<div class="alist">' + fl.map(function (u) { return '<div class="aitem"><a href="#/artists/' + u.id + '">' + Img(u.profileImage, { w: 160, h: 160, ratio: '1/1' }) + '</a><span><a href="#/artists/' + u.id + '"><b>' + esc(u.nickname) + '</b></a> ' + FeaturedArtistBadge(u, true) + '<br><span class="muted">' + (Q.field(u.field) ? Q.field(u.field).label : '') + ' · 공개 작품 ' + Q.worksBy(u.id).length + '점</span></span>' + FollowButton(u, 'sm') + '</div>'; }).join('') + '</div>'
      : EmptyState('팔로우한 창작자가 없어요', '좋아하는 창작자를 팔로우하면 여기에 모여요.', '<a class="btn ghost sm" href="#/artists">창작자 둘러보기</a>');
  } else if (tab === 'activity') { var cs = Q.commentsBy(me.id);
    body = '<h3 class="h4">내가 남긴 감상 <span class="muted">' + cs.length + '</span></h3>' + (cs.length ? '<ol class="acts">' + cs.map(function (c) { var w = Q.work(c.workId);
      return '<li><a href="' + (w ? Q.workHref(w) : '#/works/' + c.workId) + '">' + (w ? Img(Q.imageOf(w), { w: 120, h: 120, ratio: '1/1' }) : '') + '<span><b>' + (w ? esc(w.title) : '삭제된 작품') + '</b><p>' + esc(c.content) + '</p><time class="muted">' + dot(c.createdAt) + '</time></span></a></li>'; }).join('') + '</ol>' : EmptyState('남긴 감상이 없어요', '작품 상세 페이지에서 감상을 남겨보세요.'));
  } else if (tab === 'settings') {
    body = '<div class="setgrid"><section class="setbox"><h3 class="h4">계정</h3><dl class="amd"><div><dt>이메일</dt><dd>' + esc(me.email) + '</dd></div><div><dt>회원 유형</dt><dd>' + OS.ROLE_LABEL[me.role] + ' · ' + OS.ROLE_EN[me.role] + '</dd></div>' + (me.role === 'creator' ? '<div><dt>전시 작가</dt><dd>' + (me.isFeaturedArtist ? '지정됨 ' + FeaturedArtistBadge(me, true) : '지정되지 않음') + ' <span class="muted">(운영자가 관리)</span></dd></div>' : '') + '<div><dt>가입일</dt><dd>' + dot(me.createdAt) + '</dd></div></dl>' +
      '<div class="setacts"><button class="btn ghost sm" data-act="soon" data-msg="비밀번호 변경은 실제 인증을 연결한 뒤 제공돼요.">비밀번호 변경 (준비 중)</button><button class="btn ghost sm" data-act="logout">로그아웃</button></div></section>';
    if (q.switched) body += '<section class="setbox done"><div class="done-mark">✓</div><h3 class="h4">창작자 회원이 되었어요</h3><p>계정, 이메일, 닉네임, 저장한 작품, 팔로우, 댓글이 모두 그대로 유지돼요. 이제 작품을 올리고 관리할 수 있어요.</p>' + DemoNote('데모 전환이라 이 브라우저 탭에서만 적용돼요.') + '<div class="setacts"><a class="btn pri sm" href="#/upload">첫 작품 올리기</a><a class="btn ghost sm" href="#/artists/' + me.id + '">내 창작자 프로필</a></div></section>';
    else if (me.role === 'viewer') body += '<section class="setbox" id="switch"><span class="label muted">Switch to Creator</span><h3 class="h4">창작자 회원으로 전환</h3><p>새 계정을 만들 필요 없이 지금 계정에서 창작자 기능을 켤 수 있어요.</p><ul class="keep"><li>계정, 이메일, 닉네임 유지</li><li>저장한 작품, 팔로우 목록, 댓글 활동 유지</li><li>작품 업로드·수정·삭제·보관 기능 활성화</li></ul><button class="btn pri sm" data-act="switch-ask">창작자로 전환하기</button></section>';
    else if (me.role === 'creator') body += '<section class="setbox"><h3 class="h4">회원 유형 변경</h3><p class="muted">창작자 회원에서 감상 회원으로 바꾸는 기능은 이번 기획 범위에 포함되지 않아요.</p></section>';
    body += '<section class="setbox"><h3 class="h4">데모 상태</h3><p class="muted">저장, 팔로우, 댓글, 업로드 같은 변경은 이 브라우저 탭에만 남아요.</p><button class="btn ghost sm" data-act="reset-demo">데모 상태 초기화</button></section></div>';
  } else return P.notfound();
  var tabs = MY_TABS.filter(function (t) { return t[0] !== 'works' || me.role !== 'admin'; });
  return '<section class="myhead"><div class="wrap"><span class="label muted">My Page · ' + OS.ROLE_LABEL[me.role] + (OS.Auth.isDemo() ? ' · DEMO' : '') + '</span><h1 class="h2">' + esc(me.nickname) + ' ' + FeaturedArtistBadge(me) + '</h1></div></section>' +
    '<div class="wrap"><nav class="tabs" aria-label="마이페이지 메뉴">' + tabs.map(function (t) { return '<a href="#/mypage/' + t[0] + '"' + (tab === t[0] ? ' aria-current="page"' : '') + '><span>' + t[1] + '</span><small>' + t[2] + (t[0] === 'works' && me.role === 'viewer' ? ' · 창작자 전용' : '') + '</small></a>'; }).join('') + '</nav>' +
    '<div class="mybody">' + body + '</div></div>';
};

/* ───────────────── ADMIN ───────────────── */
P.admin = function (seg, q) {
  if (!OS.me()) return P.denied('login');
  if (!OS.can('admin')) return P.denied('admin');
  var db = Q.db(), sec = seg[1] || '', body = '';
  var count = function (r) { return db.users.filter(function (u) { return u.role === r; }).length; }, openR = db.reports.filter(function (r) { return r.status === 'open'; });
  if (sec === '') {
    body = '<h1 class="h3">대시보드</h1><div class="stats">' + [['진행 중 전시', db.exhibitions.filter(function (e) { return e.status === 'current'; }).length, '#/admin/exhibitions'], ['공개 작품', Q.publicWorks().length, '#/admin/works'], ['창작자 회원', count('creator'), '#/admin/members?role=creator'], ['감상 회원', count('viewer'), '#/admin/members?role=viewer'], ['전시 작가', db.users.filter(function (u) { return u.isFeaturedArtist; }).length, '#/admin/members?featured=1'], ['미처리 신고', openR.length, '#/admin/reports']]
      .map(function (s) { return '<a class="stat" href="' + s[2] + '"><span class="label muted">' + s[0] + '</span><b>' + s[1] + '</b></a>'; }).join('') + '</div>' +
      '<div class="two adm2"><section><h2 class="h4">최근 등록 작품</h2><table class="tbl"><tbody>' + db.works.slice().sort(Q.byNew).slice(0, 5).map(function (w) { return '<tr><td>' + Img(Q.imageOf(w), { w: 80, h: 80, ratio: '1/1', cls: 'tthumb' }) + '</td><td><a href="' + Q.workHref(w) + '">' + esc(w.title) + '</a><br><span class="muted">' + esc(Q.user(w.artistId).nickname) + '</span></td><td>' + StatusTag(w.status) + '</td></tr>'; }).join('') + '</tbody></table></section>' +
      '<section><h2 class="h4">미처리 신고</h2>' + (openR.length ? '<ul class="rlist">' + openR.map(ReportItem).join('') + '</ul>' : EmptyState('처리할 신고가 없어요', '', null, true)) + '</section></div>';
  } else if (sec === 'exhibitions' && seg[2]) {
    var e = seg[2] === 'new' ? null : Q.exhibition(seg[2]); if (seg[2] !== 'new' && !e) return P.notfound(); e = e || {};
    body = '<a class="back dark" href="#/admin/exhibitions">← 전시 목록</a><h1 class="h3">' + (e.id ? '전시 수정' : '새 전시 만들기') + '</h1><form class="form adform" data-form="exhibition" novalidate>' + (e.id ? '<input type="hidden" name="id" value="' + e.id + '">' : '') +
      '<div class="row2f">' + Field('title', '전시 제목 (영문)', 'text', 'Form in Tension', '', 'off', '', e.title) + Field('subtitle', '한글 제목', 'text', '긴장 속의 형태', '', 'off', '', e.subtitle) + '</div>' +
      TextArea('description', '전시 소개', '전시를 간단히 소개해 주세요', e.description, 3) + TextArea('curatorStatement', '기획 의도', '이 전시를 기획한 이유', e.curatorStatement, 4) +
      '<div class="row3">' + Select('theme', '주제', db.themes, e.theme, false) + Field('startDate', '시작일', 'date', '', '', 'off', '', e.startDate) + Field('endDate', '종료일', 'date', '', '', 'off', '', e.endDate) + '</div>' +
      '<div class="row3">' + Select('status', '상태', [{ id: 'upcoming', label: '공개 예정' }, { id: 'current', label: '진행 중' }, { id: 'past', label: '종료' }], e.status || 'upcoming', true) + Select('mood', '전시 분위기', [{ id: 'dark', label: '어두운 전시실' }, { id: 'paper', label: '밝은 종이' }, { id: 'stone', label: '회색 돌' }], e.mood || 'dark', true) + Select('type', '제목 서체', [{ id: 'serif', label: '세리프' }, { id: 'italic', label: '세리프 이탤릭' }, { id: 'sans', label: '산세리프' }], e.type || 'serif', true) + '</div>' +
      '<div class="fld"><span>대표 이미지 · 전시 작품</span><p class="muted small">진행 중 전시는 동시에 최대 ' + OS.MAX_CURRENT + '개까지 열 수 있어요. 이미지 업로드와 전시 작품 등록·배치 편집은 실제 저장소를 연결한 뒤 제공돼요. ' + (e.id ? '지금 걸린 작품: ' + Q.exWorks(e.id).length + '점' : '') + '</p></div>' +
      '<div class="notice" id="formMsg" role="alert"></div><div class="row2"><button class="btn pri" type="submit">' + (e.id ? '수정 내용 저장' : '전시 만들기') + '</button>' + (e.id ? '<a class="btn ghost" href="#/exhibitions/' + e.id + '">전시 페이지 보기</a>' : '') + '</div></form>';
  } else if (sec === 'exhibitions') {
    var exs = db.exhibitions.filter(function (x) { return !q.status || x.status === q.status; });
    body = '<div class="subhead"><h1 class="h3">전시 관리</h1><a class="btn pri sm" href="#/admin/exhibitions/new">+ 새 전시</a></div><div class="chips" role="group" aria-label="전시 상태">' + [['', '전체'], ['current', '진행 중'], ['upcoming', '공개 예정'], ['past', '종료']].map(function (s) { return '<button class="chip' + ((q.status || '') === s[0] ? ' on' : '') + '" data-act="filter" data-k="status" data-v="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '<div class="tblwrap"><table class="tbl"><thead><tr><th></th><th>전시</th><th>상태</th><th>기간</th><th>주제</th><th>작품</th><th></th></tr></thead><tbody>' + exs.map(function (x) {
        return '<tr><td>' + Img(x.coverImage, { w: 80, h: 80, ratio: '1/1', cls: 'tthumb' }) + '</td><td><b>' + esc(x.title) + '</b><br><span class="muted">' + esc(x.subtitle) + '</span></td><td>' + StatusTag(x.status) + '</td><td class="nw">' + period(x) + '</td><td>' + (x.theme ? Q.theme(x.theme).en : '—') + '</td><td>' + Q.exWorks(x.id).length + '</td><td class="nw"><a class="txtbtn" href="#/admin/exhibitions/' + x.id + '">수정</a> <a class="txtbtn" href="#/exhibitions/' + x.id + '">보기</a></td></tr>'; }).join('') + '</tbody></table></div>';
  } else if (sec === 'members') {
    var kw = (q.q || '').toLowerCase(), ms = db.users.filter(function (u) { return (!q.role || u.role === q.role) && (q.featured !== '1' || u.isFeaturedArtist) && (!kw || (u.nickname + u.email).toLowerCase().indexOf(kw) > -1); });
    body = '<h1 class="h3">회원 관리</h1><div class="adtools">' + SearchBar(q.q, '닉네임 또는 이메일', 'members') + '<div class="chips" role="group" aria-label="회원 유형">' + [['', '전체'], ['viewer', '감상 회원'], ['creator', '창작자 회원'], ['admin', '운영자']].map(function (s) { return '<button class="chip' + ((q.role || '') === s[0] ? ' on' : '') + '" data-act="filter" data-k="role" data-v="' + s[0] + '">' + s[1] + '</button>'; }).join('') +
      '<button class="chip' + (q.featured === '1' ? ' on' : '') + '" data-act="filter" data-k="featured" data-v="' + (q.featured === '1' ? '' : '1') + '">전시 작가</button></div></div>' +
      '<p class="muted small">전시 작가(Featured Artist)는 회원 유형이 아니라 창작자 회원에게 붙는 표시예요. 지정해도 작품 관리 권한은 바뀌지 않아요.</p>' +
      '<div class="tblwrap"><table class="tbl"><thead><tr><th>회원</th><th>이메일</th><th>회원 유형</th><th>전시 작가</th><th>가입일</th></tr></thead><tbody>' + (ms.length ? ms.map(function (u) { var self = OS.me().id === u.id;
        return '<tr><td><b>' + esc(u.nickname) + '</b> ' + FeaturedArtistBadge(u, true) + '</td><td class="muted">' + esc(u.email) + '</td><td><label class="sr" for="role-' + u.id + '">' + esc(u.nickname) + ' 회원 유형</label><select id="role-' + u.id + '" data-act="set-role" data-id="' + u.id + '"' + (self ? ' disabled title="본인 유형은 바꿀 수 없어요"' : '') + '>' + ['viewer', 'creator', 'admin'].map(function (r) { return '<option value="' + r + '"' + (u.role === r ? ' selected' : '') + '>' + OS.ROLE_LABEL[r] + '</option>'; }).join('') + '</select></td>' +
          '<td>' + (u.role === 'creator' ? '<button class="toggle' + (u.isFeaturedArtist ? ' on' : '') + '" role="switch" aria-checked="' + u.isFeaturedArtist + '" data-act="set-featured" data-id="' + u.id + '"><span></span>' + (u.isFeaturedArtist ? '지정됨' : '지정 안 함') + '</button>' : '<span class="muted small">창작자만 가능</span>') + '</td><td class="nw">' + dot(u.createdAt) + '</td></tr>'; }).join('') : '<tr><td colspan="5">' + EmptyState('조건에 맞는 회원이 없어요', '', null, true) + '</td></tr>') + '</tbody></table></div>';
  } else if (sec === 'works') {
    var wl = db.works.filter(function (w) { return !q.status || w.status === q.status; }).sort(Q.byNew);
    body = '<h1 class="h3">작품 관리</h1><div class="chips" role="group" aria-label="공개 상태">' + [['', '전체'], ['published', '공개'], ['draft', '초안'], ['archived', '숨김·보관']].map(function (s) { return '<button class="chip' + ((q.status || '') === s[0] ? ' on' : '') + '" data-act="filter" data-k="status" data-v="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '<div class="tblwrap"><table class="tbl"><thead><tr><th></th><th>작품</th><th>구분</th><th>창작자</th><th>분야 · 주제 · 매체</th><th>공개 상태</th></tr></thead><tbody>' + wl.map(function (w) { var u = Q.user(w.artistId);
        return '<tr><td>' + Img(Q.imageOf(w), { w: 80, h: 80, ratio: '1/1', cls: 'tthumb' }) + '</td><td><a href="' + Q.workHref(w) + '">' + esc(w.title) + '</a><br><span class="muted small">' + dot(w.createdAt) + '</span></td><td class="small nw">' + (w.space === 'exhibition' ? '전시 · ' + esc(Q.exhibition(w.exhibitionId).title) : '오픈 갤러리') + '</td><td>' + esc(u ? u.nickname : '') + '</td><td class="small">' + lbl('field', w.field) + ' · ' + (w.theme ? Q.theme(w.theme).en : '—') + ' · ' + lbl('medium', w.medium) + '</td>' +
          '<td><label class="sr" for="ws-' + w.id + '">' + esc(w.title) + ' 공개 상태</label><select id="ws-' + w.id + '" data-act="set-wstatus" data-id="' + w.id + '">' + [['published', '공개'], ['draft', '초안'], ['archived', '숨김·보관']].map(function (s) { return '<option value="' + s[0] + '"' + (w.status === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></td></tr>'; }).join('') + '</tbody></table></div>';
  } else if (sec === 'reports') {
    body = '<h1 class="h3">신고 관리</h1><p class="muted small">댓글과 작품에 들어온 신고를 검토하고 조치해요.</p><ul class="rlist big">' + db.reports.map(ReportItem).join('') + '</ul>';
  } else return P.notfound();
  return '<div class="admin"><div class="adminbar"><div class="wrap"><span class="label">OTHER SPACE · Admin</span><span class="label muted">' + esc(OS.me().nickname) + (OS.Auth.isDemo() ? ' · DEMO' : '') + '</span></div></div><div class="wrap admin-g">' + AdminSidebar(sec) + '<div class="admin-main">' + body + '</div></div></div>';
};
function StatusTag(s) { return '<span class="stag s-' + s + '">' + ({ published: '공개', draft: '초안', archived: '숨김·보관', current: '진행 중', upcoming: '공개 예정', past: '종료', open: '미처리', resolved: '처리 완료', hidden: '숨김 처리' }[s] || s) + '</span>'; }
function ReportItem(r) { var t = r.target === 'comment' ? Q.db().comments.filter(function (c) { return c.id === r.targetId; })[0] : Q.work(r.targetId), rep = Q.user(r.reporterId);
  var what = !t ? '<span class="muted">삭제된 콘텐츠</span>' : r.target === 'comment' ? '댓글 “' + esc(t.content) + '” <span class="muted">— ' + esc(Q.user(t.authorId).nickname) + '</span>' : '작품 <a href="' + Q.workHref(t) + '">' + esc(t.title) + '</a> <span class="muted">— ' + esc(Q.user(t.artistId).nickname) + '</span>';
  return '<li class="ritem"><div><div class="rtop">' + StatusTag(r.status) + '<span class="label muted">' + (r.target === 'comment' ? '댓글' : '작품') + ' 신고 · ' + dot(r.createdAt) + '</span></div><p>' + what + '</p><p class="muted small">사유: ' + esc(r.reason) + ' · 신고자 ' + esc(rep ? rep.nickname : '') + '</p></div>' +
    (r.status === 'open' && t ? '<div class="racts"><button class="btn ghost sm" data-act="report" data-id="' + r.id + '" data-do="resolved">문제 없음</button><button class="btn del sm" data-act="report" data-id="' + r.id + '" data-do="hidden">' + (r.target === 'comment' ? '댓글 삭제' : '작품 숨김') + '</button></div>' : '') + '</li>'; }

/* ───────────────── 검색 · 오류 · 권한 ───────────────── */
function searchAll(q) { q = (q || '').trim().toLowerCase(); var hit = function (s) { return !q || s.toLowerCase().indexOf(q) > -1; };
  return { ex: Q.db().exhibitions.filter(function (e) { return hit(e.title + ' ' + e.subtitle + ' ' + (e.theme ? Q.theme(e.theme).en + Q.theme(e.theme).label : '')); }),
    works: Q.publicWorks().concat(Q.db().works.filter(function (w) { return w.space === 'exhibition' && Q.exVisible(w); })).filter(function (w) { var u = Q.user(w.artistId); return hit(w.title + ' ' + u.nickname + ' ' + lbl('field', w.field) + ' ' + (w.theme ? Q.theme(w.theme).en : '')); }),
    artists: Q.creators().filter(function (u) { return hit(u.nickname + ' ' + u.handle + ' ' + u.bio + ' ' + (Q.field(u.field) || {}).label); }) }; }
P.search = function (seg, q) { var r = searchAll(q.q), n = r.ex.length + r.works.length + r.artists.length;
  return PageHead('Search · 검색 결과', q.q ? '“' + esc(q.q) + '”' : 'Search', q.q ? '전시 ' + r.ex.length + ' · 작품 ' + r.works.length + ' · 창작자 ' + r.artists.length : '찾고 싶은 작품, 작가, 전시를 입력해 주세요.') +
    '<div class="wrap">' + SearchBar(q.q, '작품, 작가, 전시 검색', 'page') + '</div>' +
    (q.q && !n ? '<div class="wrap">' + EmptyState('검색 결과가 없어요', '다른 단어로 찾아보거나, 오픈 갤러리를 둘러보세요.', '<a class="btn ghost sm" href="#/gallery">오픈 갤러리</a>') + '</div>' :
      (r.ex.length ? '<section class="sec tight"><div class="wrap"><h2 class="h3">전시 <span class="muted">' + r.ex.length + '</span></h2><div class="relgrid">' + r.ex.slice(0, 6).map(function (e) { return ExhibitionCard(e, '', '4/3'); }).join('') + '</div></div></section>' : '') +
      (r.works.length ? '<section class="sec tight"><div class="wrap"><h2 class="h3">작품 <span class="muted">' + r.works.length + '</span></h2><div class="masonry">' + r.works.slice(0, 12).map(function (w) { return ArtworkCard(w, { meta: true }); }).join('') + '</div></div></section>' : '') +
      (r.artists.length ? '<section class="sec tight"><div class="wrap"><h2 class="h3">창작자 <span class="muted">' + r.artists.length + '</span></h2><div class="argrid">' + r.artists.slice(0, 6).map(ArtistCard).join('') + '</div></div></section>' : '')); };
P.notfound = function () { return '<section class="stub"><div class="wrap"><span class="label muted">404 · 페이지를 찾을 수 없어요</span><h1 class="display">Somewhere<br>Else</h1><p class="muted" style="max-width:30em">주소가 바뀌었거나 없는 페이지예요. 다른 공간으로 이동해 보세요.</p><div class="acts"><a class="link" href="#/">HOME으로 <span class="ar">→</span></a><a class="link" href="#/gallery">오픈 갤러리 <span class="ar">→</span></a></div></div></section>'; };
P.denied = function (kind) { var me = OS.me(), cur = location.hash.slice(1);
  var M = { login: ['Members Only', '로그인한 회원만 볼 수 있는 페이지예요.'], upload: ['Creators Only', '작품 업로드는 창작자 회원만 할 수 있어요.' + (me ? ' 지금은 ' + OS.ROLE_LABEL[me.role] + '으로 로그인되어 있어요.' : '')],
    owner: ['Not Yours', '본인이 올린 작품만 수정하거나 관리할 수 있어요.'], admin: ['Admin Only', '운영자만 볼 수 있는 페이지예요.'], private: ['Private Work', '비공개 또는 보관된 작품이에요. 작품을 올린 창작자만 볼 수 있어요.'] }[kind];
  var acts = !me ? '<a class="link" href="#/login?next=' + encodeURIComponent(cur) + '">로그인 <span class="ar">→</span></a><a class="link" href="#/signup">회원가입 <span class="ar">→</span></a>'
    : kind === 'upload' && me.role === 'viewer' ? '<a class="link" href="#/mypage/settings">창작자 회원으로 전환하기 <span class="ar">→</span></a><a class="link" href="#/">HOME으로 <span class="ar">→</span></a>' : '<a class="link" href="#/">HOME으로 <span class="ar">→</span></a>';
  return '<section class="stub"><div class="wrap"><span class="label muted">접근 권한 안내</span><h1 class="display">' + M[0].replace(' ', '<br>') + '</h1><p style="max-width:32em;font-size:16px">' + M[1] + '</p><div class="acts">' + acts + '</div></div></section>'; };
