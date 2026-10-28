/* =========================================================
   상태 · 조회 · 권한 · 인증
   - DB: data.js 를 복사한 데모용 상태. 저장·팔로우·댓글·업로드 같은 변경은
     이 브라우저 탭(sessionStorage)에만 남고, 탭을 닫으면 처음 상태로 돌아가요.
   - 권한 확인은 화면에서 버튼을 숨기는 용도일 뿐이에요.
     실제 서비스에서는 같은 규칙을 서버(DB 정책, 예: Supabase RLS)에서 다시 검사해야 해요.
   ========================================================= */
window.OS = (function () {
  var KEY = 'os-proto-state-v4', MAX_CURRENT = 5; // 진행 중 전시는 동시에 최대 5개
  var DB, session = { userId: null, demo: false }, uploads = {}; // uploads: 업로드한 이미지 미리보기(메모리에만)

  function fresh() { return JSON.parse(JSON.stringify(window.OS_DATA)); }
  function load() {
    try { var s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (s && s.db) { DB = s.db; session = s.session || session; return; } } catch (e) {}
    DB = fresh();
  }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify({ db: DB, session: session })); } catch (e) {} }
  function reset() { DB = fresh(); session = { userId: null, demo: false }; uploads = {}; save(); }
  load();

  /* ── 조회 ── */
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  var Q = {
    db: function () { return DB; },
    field: function (id) { return find(DB.fields, id); },
    theme: function (id) { return find(DB.themes, id); },
    medium: function (id) { return find(DB.media, id); },
    user: function (id) { return find(DB.users, id); },
    work: function (id) { return find(DB.works, id); },
    exhibition: function (id) { return find(DB.exhibitions, id); },
    creators: function () { return DB.users.filter(function (u) { return u.role === 'creator'; }); },
    /* 전시 작가(전문 작가)와 오픈 갤러리 창작자(일반 창작자) */
    proArtists: function () { return Q.creators().filter(function (u) { return u.isFeaturedArtist; }); },
    galleryCreators: function () { return Q.creators().filter(function (u) { return !u.isFeaturedArtist; }); },
    /* 오픈 갤러리 공개 목록: 오픈 갤러리 작품(space: gallery) 중 published 만. 전시 작품은 절대 섞이지 않음 */
    publicWorks: function () { return DB.works.filter(function (w) { return w.space === 'gallery' && w.status === 'published'; }); },
    worksBy: function (uid, includeHidden) { return DB.works.filter(function (w) { return w.space === 'gallery' && w.artistId === uid && (includeHidden || w.status === 'published'); }).sort(byNew); },
    /* 전시 작품: 공개 예정 전시의 작품은 전시가 열리기 전까지 보이지 않음 (SOON 은 소개만) */
    exWorksBy: function (uid) { return DB.works.filter(function (w) { return w.space === 'exhibition' && w.artistId === uid && Q.exVisible(w); }); },
    exVisible: function (w) { var e = Q.exhibition(w.exhibitionId); if (!e) return false; return e.status !== 'upcoming'; },
    workHref: function (w) { return w.space === 'exhibition' ? '#/exhibitions/' + w.exhibitionId + '/works/' + w.id : '#/works/' + w.id; },
    currentCount: function (exceptId) { return DB.exhibitions.filter(function (e) { return e.status === 'current' && e.id !== exceptId; }).length; },
    exWorks: function (exId) {
      return DB.exhibitionWorks.filter(function (x) { return x.exhibitionId === exId; }).sort(function (a, b) { return a.displayOrder - b.displayOrder; })
        .map(function (x) { return find(DB.works, x.workId); }).filter(function (w) { return w && w.status === 'published'; });
    },
    exArtists: function (exId) { var seen = {}, out = []; Q.exWorks(exId).forEach(function (w) { if (!seen[w.artistId]) { seen[w.artistId] = 1; out.push(Q.user(w.artistId)); } }); return out; },
        comments: function (wid) { return DB.comments.filter(function (c) { return c.workId === wid; }).sort(function (a, b) { return a.createdAt < b.createdAt ? -1 : 1; }); },
    commentsBy: function (uid) { return DB.comments.filter(function (c) { return c.authorId === uid; }).sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; }); },
    followers: function (uid) { return DB.follows.filter(function (f) { return f.followingId === uid; }).length; },
    following: function (uid) { return DB.follows.filter(function (f) { return f.followerId === uid; }).map(function (f) { return Q.user(f.followingId); }).filter(Boolean); },
    savedBy: function (uid) { return DB.saves.filter(function (s) { return s.userId === uid; }).map(function (s) { return Q.work(s.workId); }).filter(function (w) { return w && w.status === 'published'; }); },
    saveCount: function (wid) { return DB.saves.filter(function (s) { return s.workId === wid; }).length; },
    imageOf: function (w) { return uploads[w.id] || w.imageUrl || w.image; }
  };
  function byNew(a, b) { return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0; }
  Q.byNew = byNew;

  /* ── 권한 ── */
  var PERMS = {
    guest: ['view'],
    viewer: ['view', 'comment', 'follow', 'save', 'profile'],
    creator: ['view', 'comment', 'follow', 'save', 'profile', 'upload', 'manage_own'],
    admin: ['view', 'comment', 'follow', 'save', 'profile', 'admin']
  };
  var ROLE_LABEL = { guest: '방문자', viewer: '감상 회원', creator: '창작자 회원', admin: '운영자' };
  var ROLE_EN = { guest: 'Guest', viewer: 'Viewer', creator: 'Creator', admin: 'Admin' };
  function me() { return session.userId ? Q.user(session.userId) : null; }
  function role() { var u = me(); return u ? u.role : 'guest'; }
  function can(p) { return PERMS[role()].indexOf(p) > -1; }
  function canManageWork(w) { var u = me(); return !!(u && w && ((u.role === 'creator' && w.artistId === u.id) || u.role === 'admin')); }
  function canSeeWork(w) { return w && (w.status === 'published' || canManageWork(w)); }

  /* ── 동작 (데모: 이 탭의 상태만 바뀜) ── */
  var A = {
    isSaved: function (wid) { var u = me(); return !!(u && DB.saves.some(function (s) { return s.userId === u.id && s.workId === wid; })); },
    toggleSave: function (wid) { var u = me(); if (!u) return null; var on = A.isSaved(wid);
      if (on) DB.saves = DB.saves.filter(function (s) { return !(s.userId === u.id && s.workId === wid); }); else DB.saves.push({ userId: u.id, workId: wid, createdAt: DB.today });
      save(); return !on; },
    isFollowing: function (uid) { var u = me(); return !!(u && DB.follows.some(function (f) { return f.followerId === u.id && f.followingId === uid; })); },
    toggleFollow: function (uid) { var u = me(); if (!u || u.id === uid) return null; var on = A.isFollowing(uid);
      if (on) DB.follows = DB.follows.filter(function (f) { return !(f.followerId === u.id && f.followingId === uid); }); else DB.follows.push({ followerId: u.id, followingId: uid, createdAt: DB.today });
      save(); return !on; },
    addComment: function (wid, text) { var u = me(); if (!u || !can('comment')) return null;
      var c = { id: 'c' + Date.now(), workId: wid, authorId: u.id, content: text, createdAt: new Date().toISOString().slice(0, 16) };
      DB.comments.push(c); save(); return c; },
    deleteComment: function (cid) { DB.comments = DB.comments.filter(function (c) { return c.id !== cid; }); save(); },
    saveWork: function (data, imagePreview) { var u = me(), w;
      if (data.id) { w = Q.work(data.id); if (!canManageWork(w)) return null; Object.keys(data).forEach(function (k) { w[k] = data[k]; }); w.updatedAt = DB.today; }
      else { if (!can('upload')) return null; w = Object.assign({ id: 'n' + Date.now(), space: 'gallery', image: { gen: 'rings', seed: Date.now() % 997 }, imageUrl: '', artistId: u.id, ratio: '4/5', createdAt: DB.today, updatedAt: DB.today }, data); DB.works.push(w); }
      if (imagePreview) uploads[w.id] = imagePreview;
      save(); return w; },
    setStatus: function (wid, status) { var w = Q.work(wid); if (!canManageWork(w)) return false; w.status = status; w.updatedAt = DB.today; save(); return true; },
    deleteWork: function (wid) { var w = Q.work(wid); if (!canManageWork(w)) return false;
      DB.works = DB.works.filter(function (x) { return x.id !== wid; });
      DB.exhibitionWorks = DB.exhibitionWorks.filter(function (x) { return x.workId !== wid; });
      save(); return true; },
    switchToCreator: function () { var u = me(); if (!u || u.role !== 'viewer') return false; u.role = 'creator'; if (!u.field) u.field = 'other'; save(); return true; },
    updateProfile: function (d) { var u = me(); if (!u) return; ['nickname', 'bio', 'field'].forEach(function (k) { if (d[k] !== undefined) u[k] = d[k]; }); save(); },
    /* 운영자 전용 */
    adminSetRole: function (uid, r) { if (!can('admin')) return false; var u = Q.user(uid); u.role = r; if (r !== 'creator') u.isFeaturedArtist = false; save(); return true; },
    adminSetFeatured: function (uid, on) { if (!can('admin')) return false; var u = Q.user(uid); if (u.role !== 'creator') return false; u.isFeaturedArtist = on; save(); return true; },
    adminSetWorkStatus: function (wid, s) { if (!can('admin')) return false; Q.work(wid).status = s; save(); return true; },
    adminSaveExhibition: function (d) { if (!can('admin')) return null; var e = d.id && Q.exhibition(d.id);
      if (d.status === 'current' && Q.currentCount(e ? e.id : null) >= MAX_CURRENT) return { error: 'max_current' };
      if (e) Object.keys(d).forEach(function (k) { e[k] = d[k]; });
      else { e = Object.assign({ id: 'ex-' + Date.now(), kind: '기획 전시', mood: 'dark', type: 'serif', coverImage: { gen: 'lines', seed: Date.now() % 997 } }, d); DB.exhibitions.push(e); }
      save(); return e; },
    adminReport: function (rid, status) { if (!can('admin')) return false; var r = find(DB.reports, rid); r.status = status; save(); return true; }
  };

  /* ── 인증 어댑터 ──
     화면은 Auth 의 함수만 불러요. 지금은 실제 인증이 연결되지 않은 상태라
     signIn / signUp / resetPassword 는 'not_connected' 로 끝나고, 데모 계정만 쓸 수 있어요.
     실제 연결 예: signIn → supabase.auth.signInWithPassword({ email, password }) */
  var DEMO = { viewer: 'v01', creator: 'u04', featured: 'u01', admin: 'a01' };
  var Auth = {
    connected: false,
    signIn: function () { return Promise.reject({ code: 'not_connected' }); },
    signUp: function () { return Promise.reject({ code: 'not_connected' }); },
    resetPassword: function () { return Promise.reject({ code: 'not_connected' }); },
    demoSignIn: function (type) { session = { userId: DEMO[type], demo: true }; save(); return Promise.resolve(me()); },
    signOut: function () { session = { userId: null, demo: false }; save(); return Promise.resolve(); },
    isDemo: function () { return session.demo; }
  };

  return { Q: Q, A: A, Auth: Auth, me: me, role: role, can: can, canManageWork: canManageWork, canSeeWork: canSeeWork,
    ROLE_LABEL: ROLE_LABEL, ROLE_EN: ROLE_EN, MAX_CURRENT: MAX_CURRENT, reset: reset };
})();
