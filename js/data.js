/* =========================================================
   OTHER SPACE — 샘플 데이터 (가상)
   - 모든 페이지가 이 파일 하나의 데이터를 함께 사용해요.
   - 필드 이름은 기획서 14번 데이터 모델(Users, Works, Comments, Saves,
     Follows, Exhibitions, ExhibitionWorks)과 맞춰 두었어요.
   - 작품은 두 공간으로 나뉘어요: 오픈 갤러리 작품(space: 'gallery')과 전시 작품(space: 'exhibition').
   - image / profileImage / coverImage:
       지금은 { gen: '스타일', seed: 숫자 } 형태의 임시 생성 이미지예요.
       실제 이미지를 넣을 때는 'https://...jpg' 같은 주소 문자열로 바꾸면 돼요.
   ========================================================= */
window.OS_DATA = (function () {

  /* 분류 체계: 분야 · 주제 · 매체는 서로 다른 목록으로 관리 */
  var fields = [
    { id: 'fashion',  label: '패션',           en: 'Fashion' },
    { id: 'graphic',  label: '그래픽 디자인',   en: 'Graphic Design' },
    { id: 'photo',    label: '사진',           en: 'Photography' },
    { id: 'illust',   label: '일러스트레이션',  en: 'Illustration' },
    { id: 'digital',  label: '디지털 아트',     en: 'Digital Art' },
    { id: 'other',    label: '기타',           en: 'Other' }
  ];
  var themes = [
    { id: 'memory',   label: '기억',   en: 'MEMORY' },
    { id: 'identity', label: '정체성', en: 'IDENTITY' },
    { id: 'dreams',   label: '꿈',     en: 'DREAMS' },
    { id: 'nature',   label: '자연',   en: 'NATURE' },
    { id: 'anxiety',  label: '불안',   en: 'ANXIETY' },
    { id: 'future',   label: '미래',   en: 'FUTURE' }
  ];
  var media = [
    { id: 'photography', label: '사진',         en: 'Photography' },
    { id: 'drawing',     label: '드로잉',       en: 'Drawing' },
    { id: 'digital',     label: '디지털 이미지', en: 'Digital Image' },
    { id: 'mixed',       label: '혼합 매체',     en: 'Mixed Media' },
    { id: 'video',       label: '영상',         en: 'Video' },
    { id: 'other',       label: '기타',         en: 'Other' }
  ];

  /* Users — role: viewer / creator / admin
     isFeaturedArtist: 운영자가 지정하는 '전시 작가(전문 작가)' 표시. 이 작가들의 작품만 EXHIBITIONS · SOON · ARCHIVE 에 걸리고,
     표시가 없는 창작자(일반 창작자)는 OPEN GALLERY 에서 활동해요. */
  var users = [
    { id: 'u01', email: 'seojin@sample.otherspace', nickname: '한서진', handle: 'seojin.han', role: 'creator', isFeaturedArtist: true,  field: 'digital', profileImage: { gen: 'lines', seed: 11 },
      bio: '선과 밀도로 공간의 긴장을 만드는 디지털 조형 작가. 수백 개의 선이 서로를 당기는 순간을 기록한다.', createdAt: '2025-03-02' },
    { id: 'u02', email: 'iho@sample.otherspace', nickname: '문이호', handle: 'iho.moon', role: 'creator', isFeaturedArtist: true,  field: 'photo', profileImage: { gen: 'figure', seed: 21 },
      bio: '해가 진 뒤의 도시를 긴 노출로 기록하는 사진가. 아무도 없는 출입구와 그 앞의 한 사람을 찍는다.', createdAt: '2025-01-18' },
    { id: 'u03', email: 'jiwoo@sample.otherspace', nickname: '강지우', handle: 'jiwoo.kang', role: 'creator', isFeaturedArtist: true,  field: 'graphic', profileImage: { gen: 'halftone', seed: 61 },
      bio: '점과 망점으로 소리를 시각화하는 그래픽 디자이너.', createdAt: '2025-02-11' },
    { id: 'u04', email: 'dahae@sample.otherspace', nickname: '윤다해', handle: 'dahae.yoon', role: 'creator', isFeaturedArtist: false, field: 'fashion', profileImage: { gen: 'fabric', seed: 31 },
      bio: '버려진 원단을 겹쳐 입는 구조를 실험하는 신진 디자이너. 옷이 몸을 감싸는 방식에 관심이 있다.', createdAt: '2026-09-01' },
    { id: 'u05', email: 'ruel@sample.otherspace', nickname: '박루엘', handle: 'ruel.park', role: 'creator', isFeaturedArtist: false, field: 'graphic', profileImage: { gen: 'blocks', seed: 41 },
      bio: '한글 자소를 해체해 포스터를 만든다.', createdAt: '2026-06-20' },
    { id: 'u06', email: 'noa@sample.otherspace', nickname: '서노아', handle: 'noa.seo', role: 'creator', isFeaturedArtist: false, field: 'illust', profileImage: { gen: 'bloom', seed: 51 },
      bio: '잠들기 직전의 동물들을 그리는 일러스트레이터.', createdAt: '2026-08-14' },
    { id: 'u07', email: 'hanbit@sample.otherspace', nickname: '이한빛', handle: 'hanbit.lee', role: 'creator', isFeaturedArtist: false, field: 'digital', profileImage: { gen: 'particles', seed: 71 },
      bio: '파티클 시뮬레이션으로 기억이 흩어지는 과정을 표현한다.', createdAt: '2026-10-02' },
    { id: 'u08', email: 'maru@sample.otherspace', nickname: '정마루', handle: 'maru.jung', role: 'creator', isFeaturedArtist: true,  field: 'fashion', profileImage: { gen: 'portrait', seed: 81 },
      bio: '그림자를 재단하는 패션 디자이너. 실루엣과 빛을 함께 디자인한다.', createdAt: '2025-05-09' },
    { id: 'u09', email: 'eunsol@sample.otherspace', nickname: '최은솔', handle: 'eunsol.choi', role: 'creator', isFeaturedArtist: false, field: 'illust', profileImage: { gen: 'garden', seed: 91 },
      bio: '식물과 사람의 경계를 그린다.', createdAt: '2026-07-07' },
    { id: 'u10', email: 'orion@sample.otherspace', nickname: '오리온', handle: 'orion.oh', role: 'creator', isFeaturedArtist: true,  field: 'other', profileImage: { gen: 'rings', seed: 17 },
      bio: '빛과 소리를 쓰는 설치 작가. 전시장 자체를 매체로 다룬다.', createdAt: '2025-05-30' },
    { id: 'u11', email: 'haram@sample.otherspace', nickname: '백하람', handle: 'haram.baek', role: 'creator', isFeaturedArtist: false, field: 'photo', profileImage: { gen: 'horizon', seed: 27 },
      bio: '안개 낀 해안선을 찍는다. 아무것도 일어나지 않는 풍경을 오래 바라본다.', createdAt: '2026-10-10' },
    { id: 'u12', email: 'sea@sample.otherspace', nickname: '류세아', handle: 'sea.ryu', role: 'creator', isFeaturedArtist: true,  field: 'illust', profileImage: { gen: 'bloom', seed: 61 },
      bio: '밤과 잠, 꿈속의 동물을 그리는 일러스트레이터. 그림책과 전시를 오가며 작업한다.', createdAt: '2025-04-15' },
    /* 감상 회원 */
    { id: 'v01', email: 'viewer@demo.otherspace', nickname: '감상하는 사람', handle: 'viewer', role: 'viewer', isFeaturedArtist: false, field: null, profileImage: { gen: 'rings', seed: 5 },
      bio: '주말마다 전시를 봅니다.', createdAt: '2026-04-12' },
    { id: 'v02', email: 'roa@sample.otherspace', nickname: '김로아', handle: 'roa.kim', role: 'viewer', isFeaturedArtist: false, field: null, profileImage: { gen: 'bloom', seed: 6 },
      bio: '', createdAt: '2026-02-03' },
    { id: 'v03', email: 'jun@sample.otherspace', nickname: '이준', handle: 'jun.lee', role: 'viewer', isFeaturedArtist: false, field: null, profileImage: { gen: 'halftone', seed: 8 },
      bio: '', createdAt: '2026-07-21' },
    /* 운영자 */
    { id: 'a01', email: 'admin@demo.otherspace', nickname: 'OTHER SPACE 운영팀', handle: 'admin', role: 'admin', isFeaturedArtist: false, field: null, profileImage: { gen: 'lines', seed: 2 },
      bio: '', createdAt: '2025-01-01' }
  ];

  /* Works — 두 공간의 작품을 space 로 나눠요. 두 공간의 작품은 서로 연결되지 않아요.
     - space: 'gallery'    오픈 갤러리 작품. 일반 창작자가 직접 올리고 관리해요. status: draft / published / archived
     - space: 'exhibition' 전시 작품. 전시 작가의 작품으로, 하나의 전시(exhibitionId)에만 속하고
                           작품 이야기(story)와 댓글을 전시 안에서 따로 가져요. 오픈 갤러리에는 나오지 않아요.
     ratio 는 카드 이미지 비율 */
  function W(id, title, artistId, field, theme, medium, gen, seed, ratio, createdAt, description, intent, status) {
    return { id: id, space: 'gallery', title: title, image: { gen: gen, seed: seed }, imageUrl: '', description: description, intent: intent,
      artistId: artistId, field: field, theme: theme, medium: medium, status: status || 'published',
      ratio: ratio, createdAt: createdAt, updatedAt: createdAt };
  }
  var works = [
    W('w09', '겹쳐 입은 오후', 'u04', 'fashion', 'identity', 'photography', 'fabric', 102, '3/4', '2026-10-28',
      '버려진 셔츠 세 벌을 겹쳐 만든 한 벌의 옷.', '옷이 쌓이는 방식으로 사람의 하루를 기록하고 싶었다.'),
    W('w10', 'Pleat No.4', 'u04', 'fashion', 'identity', 'mixed', 'fabric', 109, '4/5', '2026-10-25',
      '주름이 몸의 움직임을 따라 열리고 닫힌다.', '주름은 옷에 남은 시간이다.'),
    W('w11', 'ㅎ의 구조', 'u05', 'graphic', 'identity', 'digital', 'blocks', 103, '3/4', '2026-10-27',
      '한글 ㅎ을 일곱 개의 면으로 해체한 포스터.', '글자가 소리를 잃으면 무엇이 남는지 보고 싶었다.'),
    W('w12', '종이의 무게', 'u05', 'graphic', 'memory', 'mixed', 'blocks', 129, '4/5', '2025-11-12',
      '인쇄물이 쌓인 높이로 만든 타이포그래피.', ''),
    W('w13', '잠든 여우', 'u06', 'illust', 'dreams', 'drawing', 'bloom', 104, '1/1', '2026-10-27',
      '꿈속에서 색이 번지는 여우.', '잠들기 직전의 흐릿한 감각을 색으로 옮겼다.'),
    W('w14', '밤의 정원', 'u06', 'illust', 'dreams', 'drawing', 'garden', 108, '4/5', '2026-10-24',
      '밤에만 피는 꽃들이 모인 정원.', ''),
    W('w15', 'Tide Lines', 'u07', 'digital', 'memory', 'video', 'lines', 101, '3/2', '2026-10-28',
      '파도가 남긴 선을 따라 움직이는 3분 길이의 영상 작업. 대표 장면.', '사라지는 것의 궤적만 남기고 싶었다.'),
    W('w16', 'Dust Choir', 'u07', 'digital', 'memory', 'digital', 'particles', 106, '4/5', '2026-10-26',
      '먼지 입자 4,000개가 한 점으로 모였다 흩어진다.', '기억은 모이는 순간보다 흩어지는 순간에 더 선명하다.'),
    W('w19', '잎의 사람', 'u09', 'illust', 'nature', 'drawing', 'garden', 115, '3/4', '2026-10-19',
      '잎맥이 사람의 손금이 되는 순간.', ''),
    W('w20', '광합성', 'u09', 'illust', 'nature', 'drawing', 'bloom', 116, '1/1', '2026-10-09',
      '빛을 먹는 사람들의 초상.', '식물처럼 빛만으로 살 수 있다면.'),
    W('w22', 'Fog Line', 'u11', 'photo', 'nature', 'photography', 'horizon', 122, '3/2', '2026-10-27',
      '안개에 지워진 수평선.', '경계가 사라질 때 풍경은 더 넓어진다.'),
    W('w23', '썰물', 'u11', 'photo', 'nature', 'photography', 'horizon', 119, '4/5', '2026-10-20',
      '물이 빠진 갯벌 위의 빛.', ''),
    W('w27', 'Second Skin', 'u04', 'fashion', 'identity', 'mixed', 'fabric', 137, '3/4', '2025-09-05',
      '피부처럼 얇은 옷.', ''),
    W('w28', 'Night Bloom', 'u06', 'illust', 'dreams', 'drawing', 'bloom', 133, '4/5', '2024-11-11',
      '밤에 피는 꽃.', ''),
    W('w31', '받침 없는 글자', 'u05', 'graphic', 'future', 'digital', 'blocks', 156, '4/5', '2026-10-22',
      '받침을 모두 지운 문장으로 만든 포스터.', '덜어낸 자리에서 다음 글자가 생긴다.'),
    W('w32', 'Glitch Garden', 'u07', 'digital', 'future', 'digital', 'particles', 157, '1/1', '2026-10-16',
      '오류 난 이미지에서 자라난 정원.', ''),
    W('w33', '창가의 고양이', 'u09', 'illust', 'memory', 'drawing', 'bloom', 158, '3/4', '2026-10-11',
      '어릴 적 살던 집 창가에 늘 앉아 있던 고양이.', '기억 속의 색은 실제보다 따뜻하다.'),
    W('w34', '새벽 버스', 'u11', 'photo', 'anxiety', 'photography', 'horizon', 159, '3/2', '2026-10-06',
      '첫차 창밖으로 지나가는 흐린 풍경.', ''),
    /* 전시 작가도 개인 작업은 오픈 갤러리에 올릴 수 있어요. 전시 작품과는 별개의 작품이에요. */
    W('w35', '산책 메모 #12', 'u02', 'photo', 'nature', 'photography', 'horizon', 160, '3/2', '2026-10-25',
      '전시와 상관없이 주말 산책길에 찍은 강변.', '전시 작업 사이사이 남기는 개인 기록.'),
    /* 공개 목록에 나오지 않는 작품 (본인만 확인 가능) */
    W('w29', '보관한 시안: 접힌 셔츠', 'u04', 'fashion', 'identity', 'photography', 'fabric', 130, '3/4', '2026-08-30',
      '초기 시안. 보관 처리되어 공개 목록에서 숨겨진 상태.', '', 'archived'),
    W('w30', '작업 중: 레이어 연구', 'u04', 'fashion', 'memory', 'mixed', 'fabric', 131, '4/5', '2026-10-27',
      '아직 공개하지 않은 초안.', '', 'draft')
  ];

  /* 전시 작품 — 전시 작가의 작품. story 는 전시 안 작품 상세에서 보여주는 긴 이야기(문단은 줄바꿈으로 구분) */
  var exhibitionWorks = [], exOrder = {};
  function X(id, exId, title, artistId, field, theme, medium, gen, seed, ratio, createdAt, description, story) {
    exOrder[exId] = (exOrder[exId] || 0) + 1;
    exhibitionWorks.push({ exhibitionId: exId, workId: id, displayOrder: exOrder[exId] });
    works.push({ id: id, space: 'exhibition', exhibitionId: exId, title: title, image: { gen: gen, seed: seed }, imageUrl: '', description: description, story: story,
      artistId: artistId, field: field, theme: theme, medium: medium, status: 'published', ratio: ratio, createdAt: createdAt, updatedAt: createdAt });
  }
  /* Form in Tension */
  X('x01', 'form-in-tension', 'Form in Tension No.1', 'u01', 'digital', 'anxiety', 'digital', 'lines', 3, '4/5', '2026-09-20',
    '수백 개의 선이 원형 받침 위에서 솟아오르며 하나의 산맥을 이룬다.',
    '한서진은 이 작업을 위해 412개의 선을 하나씩 직접 배치했다. 선은 서로를 밀어내는 규칙과 끌어당기는 규칙을 동시에 따른다. 두 힘이 맞서는 자리마다 봉우리가 생기고, 힘이 풀리는 자리마다 골짜기가 생긴다.\n작가는 \'무너지기 직전의 균형\'을 기록하고 싶었다고 말한다. 작업 노트에는 선 하나를 옮길 때마다 전체 형태가 흔들렸다는 메모가 남아 있다. 화면 앞에 오래 머물수록 선의 떨림이 보이기 시작한다.');
  X('x02', 'form-in-tension', 'Form in Tension No.4', 'u01', 'digital', 'anxiety', 'digital', 'lines', 44, '3/4', '2026-09-22',
    '선의 밀도가 높아질수록 형태는 오히려 흐려진다.',
    '연작의 네 번째 작업에서 작가는 선의 수를 세 배로 늘렸다. 빽빽해진 선은 더 이상 산맥처럼 보이지 않고, 안개처럼 번진 덩어리가 된다.\n\'많아질수록 사라진다\'는 역설이 이 작업의 출발점이다. 가까이 다가가면 선 하나하나가 보이고, 멀어지면 형태 전체가 지워진다. 관람 거리에 따라 다른 작품이 된다.');
  X('x03', 'form-in-tension', 'Orbit Study', 'u01', 'digital', 'future', 'digital', 'rings', 112, '1/1', '2026-08-02',
    '서로 다른 중심을 가진 원들이 한 점을 향해 수렴한다.',
    '연작을 시작하기 전, 작가가 힘의 규칙을 실험하던 습작이다. 일곱 개의 중심에서 출발한 궤도가 하나의 점을 향해 조금씩 기울어진다.\n완성작보다 단순하지만, 이후 모든 작업에 쓰인 \'보이지 않는 규칙\'이 가장 투명하게 드러난다. 전시는 이 습작을 마지막 방에 두어 관람객이 처음으로 돌아가게 한다.');
  X('x04', 'form-in-tension', 'Room Tone', 'u10', 'other', 'anxiety', 'mixed', 'rings', 117, '3/2', '2026-10-04',
    '빈 방의 소음을 빛의 고리로 바꾼 설치 작업의 기록 사진.',
    '오리온은 아무도 없는 방에서 48시간 동안 소리를 녹음했다. 냉장고, 형광등, 먼 도로의 진동처럼 평소엔 들리지 않던 소음이 기록됐다.\n그 소리의 크기를 빛의 고리로 바꿔 방 안에 다시 띄운 것이 이 설치다. 이번 전시에서는 한서진의 선 작업과 나란히 놓여, \'조용함 속의 긴장\'이라는 주제를 소리 쪽에서 보여준다.');
  /* After Light */
  X('x05', 'after-light', 'After Light III', 'u02', 'photo', 'memory', 'photography', 'figure', 7, '3/2', '2026-09-10',
    '빈 전시장에 남은 마지막 조명.',
    '문이호는 전시가 끝난 날 밤, 작품을 모두 걷어낸 전시장에서 이 사진을 찍었다. 벽에는 액자 자국만 남았고, 조명 하나가 아직 켜져 있었다.\n작가는 \'빛이 꺼진 다음에도 공간은 무언가를 기억한다\'고 쓴다. 8분 노출로 찍은 이 사진에는 조명이 꺼지기 직전의 마지막 몇 초가 겹쳐 있다.');
  X('x06', 'after-light', 'Exit, 23:40', 'u02', 'photo', 'memory', 'photography', 'figure', 105, '4/5', '2026-10-26',
    '자정 직전, 비상구 불빛 아래 서 있는 한 사람.',
    '도시가 비워지는 시간에만 보이는 얼굴들이 있다. 문이호는 3년 동안 밤 11시 이후의 지하철역 출구를 찍어왔다.\n이 사진 속 인물은 작가가 모르는 사람이다. 촬영 뒤 동의를 구했고, 그는 \'매일 이 시간에 여기서 한 번 숨을 고른다\'고 말했다. 초록 비상구 불빛이 그 짧은 쉼을 감싼다.');
  X('x07', 'after-light', 'Corridor', 'u02', 'photo', 'memory', 'photography', 'figure', 111, '3/4', '2026-10-21',
    '끝이 보이지 않는 복도와 그 끝의 빛.',
    '오래된 병원 복도를 한 장의 긴 노출로 담았다. 복도 끝 창문에서 들어오는 빛이 바닥을 따라 길게 번진다.\n작가에게 복도는 기억이 저장되는 방식과 닮았다. 가까운 것은 흐리고, 먼 끝만 또렷하게 빛난다.');
  X('x08', 'after-light', 'Last Train', 'u02', 'photo', 'memory', 'photography', 'figure', 140, '3/2', '2026-10-24',
    '막차가 떠난 뒤의 승강장.',
    '막차가 떠나고 승강장 조명이 하나씩 꺼지는 4분을 한 장에 담았다. 마지막으로 남은 불빛이 화면 오른쪽에 머문다.\n이 사진으로 전시의 동선이 끝난다. 관람객은 빛이 사라지는 장면을 보고 전시장을 나서게 된다.');
  /* Soft Armor */
  X('x09', 'soft-armor', 'Soft Armor 01', 'u08', 'fashion', 'identity', 'photography', 'portrait', 114, '4/5', '2026-10-12',
    '패딩 소재로 만든 부드러운 갑옷.',
    '정마루는 갑옷의 구조를 그대로 가져오되, 모든 판을 패딩으로 바꿨다. 몸을 지키는 형태는 남았지만 어떤 충격도 막지 못한다.\n작가는 \'보호받고 싶은 마음과 드러나고 싶은 마음이 한 벌의 옷 안에 동시에 있다\'고 말한다. 촬영은 해 질 녘 자연광으로만 진행했다.');
  X('x10', 'soft-armor', 'Shadow Cut', 'u08', 'fashion', 'identity', 'photography', 'portrait', 113, '3/4', '2026-10-15',
    '그림자의 형태를 따라 재단한 코트.',
    '오후 4시의 그림자를 바닥에 그대로 따라 그린 뒤, 그 선으로 코트를 재단했다. 그래서 이 코트는 같은 시간, 같은 각도의 빛 아래에서만 완전한 실루엣이 된다.\n빛이 만드는 형태까지 옷의 일부로 보는 작가의 방식이 가장 잘 드러난 작업이다.');
  X('x11', 'soft-armor', 'Quilted Silence', 'u08', 'fashion', 'identity', 'mixed', 'fabric', 141, '4/5', '2026-10-18',
    '소리를 흡수하는 원단으로 만든 망토.',
    '녹음실 흡음재에서 출발한 원단 연구다. 망토를 두르면 주변 소리가 한층 작아진다.\n작가는 몸을 가리는 대신 소음을 가리는 옷을 상상했다. 전시에서는 사진과 함께 원단 샘플의 확대 이미지를 나란히 보여준다.');
  X('x12', 'soft-armor', 'Second Coat', 'u08', 'fashion', 'identity', 'photography', 'portrait', 142, '3/4', '2026-10-20',
    '코트 위에 한 번 더 입는 코트.',
    '두 벌의 코트를 겹쳐 입었을 때 생기는 틈을 디자인의 중심에 놓았다. 안쪽 코트와 바깥 코트 사이의 공기가 형태를 만든다.\n연작의 마지막 작업으로, 갑옷에서 시작한 질문이 \'두 번째 피부\'로 이어진다.');
  /* Quiet Signal */
  X('x13', 'quiet-signal', 'Low Frequency', 'u03', 'graphic', 'identity', 'digital', 'halftone', 110, '4/5', '2026-10-23',
    '저주파 소리를 망점의 크기로 옮긴 포스터 연작.',
    '강지우는 사람의 귀로는 거의 들리지 않는 20Hz 이하의 소리를 녹음해, 진폭을 망점의 크기로 옮겼다. 큰 점은 큰 진동이고, 빈 자리는 침묵이다.\n들리지 않는 소리도 형태를 가질 수 있는지 묻는 작업이다. 포스터는 실제로 오프셋 인쇄로 제작되었고, 전시에서는 고해상도 스캔으로 보여준다.');
  X('x14', 'quiet-signal', 'Rings for Nobody', 'u03', 'graphic', 'future', 'digital', 'rings', 107, '1/1', '2026-10-24',
    '아무도 듣지 않는 신호를 위한 동심원.',
    '1970년대에 우주로 보낸 전파 메시지에서 영감을 받았다. 수신자가 있는지 알 수 없는 신호를 동심원으로 그렸다.\n작가는 \'답장이 오지 않아도 보내는 일\'에 대해 생각했다고 말한다. 원의 간격은 실제 메시지의 신호 간격을 따른다.');
  X('x15', 'quiet-signal', 'Static Letter', 'u03', 'graphic', 'identity', 'digital', 'halftone', 143, '3/4', '2026-10-25',
    '잡음 속에 숨겨진 한 통의 편지.',
    '멀리서 보면 텔레비전 잡음 화면처럼 보인다. 가까이 다가가면 망점 사이로 손글씨 편지의 문장이 드러난다.\n편지는 작가가 보내지 못한 것이다. 내용을 모두 읽을 수 없도록 일부러 잡음의 밀도를 조절했다.');
  X('x16', 'quiet-signal', 'Dead Air', 'u03', 'graphic', 'future', 'digital', 'blocks', 144, '4/5', '2026-10-26',
    '방송이 끊긴 순간을 면으로 나눈 포스터.',
    '라디오 방송 사고로 7초 동안 아무 소리도 나가지 않았던 기록에서 출발했다. 7초를 일곱 개의 면으로 나눴다.\n전시의 마지막 작업으로, 신호가 사라진 자리 역시 하나의 메시지라는 점을 보여준다.');
  /* Nocturne Zoo */
  X('x17', 'nocturne-zoo', '잠들기 전의 사슴', 'u12', 'illust', 'dreams', 'drawing', 'bloom', 145, '1/1', '2026-09-28',
    '눈꺼풀이 무거워진 사슴의 꿈.',
    '류세아는 동물원 사육사들의 야간 기록을 읽으며 이 연작을 시작했다. 사슴은 잠들기 직전 귀를 세 번 움직인다는 문장이 출발점이었다.\n색은 잠에 빠져드는 속도에 맞춰 바깥에서 안쪽으로 번진다. 수채 위에 색연필을 겹쳐 흐린 경계를 만들었다.');
  X('x18', 'nocturne-zoo', '밤의 수족관', 'u12', 'illust', 'dreams', 'drawing', 'garden', 146, '4/5', '2026-10-02',
    '불 꺼진 수족관을 헤엄치는 물고기들.',
    '관람객이 모두 떠난 수족관에서는 물고기들이 다른 길로 헤엄친다는 상상을 그렸다. 낮에는 보이지 않던 해초 사이의 길이 드러난다.\n화면 아래쪽의 작은 빛은 수조 청소 로봇이다. 작가가 실제로 본 장면이라고 한다.');
  X('x19', 'nocturne-zoo', '꿈꾸는 부엉이', 'u12', 'illust', 'dreams', 'drawing', 'bloom', 147, '3/4', '2026-10-06',
    '낮에 잠드는 부엉이가 꾸는 밤의 꿈.',
    '모두가 잠든 밤에 깨어 있는 동물은 낮에 어떤 꿈을 꿀까. 부엉이의 꿈속에서는 해가 뜨지 않는다.\n작가는 이 그림을 위해 같은 구도를 열네 번 다시 그렸다. 마지막 판에서 처음으로 부엉이의 눈을 감겼다.');
  X('x20', 'nocturne-zoo', '달빛 정원', 'u12', 'illust', 'nature', 'drawing', 'garden', 148, '4/5', '2026-10-10',
    '동물원 뒤편, 아무도 들어가지 않는 정원.',
    '연작의 마지막 장면이다. 모든 동물이 잠든 뒤 정원에만 달빛이 남는다.\n앞선 세 작품에 나온 동물들이 아주 작게 숨어 있다. 전시를 처음부터 본 관람객만 찾을 수 있도록 배치했다.');
  /* Green Static (공개 예정) */
  X('x21', 'green-static', 'Green Static', 'u10', 'other', 'nature', 'video', 'particles', 120, '1/1', '2026-10-01',
    '숲의 소리를 노이즈로 바꾼 영상 작업.',
    '오리온은 국립공원 세 곳에서 한 계절 동안 숲의 소리를 녹음했다. 새소리, 바람, 벌레 소리를 주파수별로 나눠 초록 입자의 움직임으로 바꿨다.\n전시가 열리면 12분 길이의 영상 전체를 감상할 수 있다.');
  X('x22', 'green-static', 'Fog Room', 'u02', 'photo', 'nature', 'photography', 'horizon', 118, '3/2', '2026-10-08',
    '안개가 들어찬 숲속 오두막.',
    '문이호가 처음으로 도시 밖에서 찍은 연작이다. 안개가 오두막 안까지 밀려 들어온 새벽을 담았다.\n밤의 도시를 찍던 작가가 \'자연에도 출구가 있는지\' 찾아 나선 기록이다.');
  X('x23', 'green-static', 'Canopy Noise', 'u10', 'other', 'nature', 'mixed', 'particles', 149, '4/5', '2026-10-12',
    '나뭇잎이 겹쳐 만든 소리의 지도.', '나무 꼭대기에 마이크 스무 개를 매달아 만든 소리 지도. 전시 공개 후 전체 작업을 볼 수 있다.');
  /* Tomorrow Residue (공개 예정) */
  X('x24', 'tomorrow-residue', 'Tomorrow Residue', 'u03', 'graphic', 'future', 'digital', 'halftone', 121, '3/4', '2026-10-18',
    '내일 남게 될 흔적을 미리 인쇄한 포스터.',
    '강지우는 다음 날 신문의 1면을 예측해 미리 인쇄하는 작업을 30일 동안 이어갔다. 맞힌 날보다 틀린 날이 훨씬 많았다.\n전시에서는 예측과 실제 1면을 나란히 걸어, 미래를 상상하는 일이 남기는 흔적을 보여준다.');
  X('x25', 'tomorrow-residue', 'Future Index', 'u03', 'graphic', 'future', 'digital', 'blocks', 150, '4/5', '2026-10-27',
    '아직 오지 않은 날짜로 만든 색인.', '2030년부터 2099년까지의 날짜를 면의 크기로 정리한 색인 포스터. 전시 공개 후 전체를 볼 수 있다.');
  /* 지난 전시 (아카이브) */
  X('x26', 'drift-memory', 'Drift 01', 'u01', 'digital', 'memory', 'digital', 'particles', 19, '4/5', '2026-04-20',
    '한 장의 사진이 입자로 흩어지는 과정.',
    '한서진은 어린 시절 사진 한 장을 4,000개의 입자로 나눈 뒤, 입자들이 서서히 흩어지도록 했다. 사진 속 얼굴은 1분 만에 알아볼 수 없게 된다.\n기억은 저장되는 것이 아니라 매번 다시 만들어진다는 전시의 질문에서 출발한 첫 작업이다.');
  X('x27', 'drift-memory', 'Drift 02', 'u01', 'digital', 'memory', 'video', 'particles', 151, '3/2', '2026-04-28',
    '흩어진 입자가 다른 얼굴로 다시 모인다.',
    'Drift 01에서 흩어진 입자가 이번에는 전혀 다른 얼굴로 모인다. 작가는 \'기억을 떠올릴 때마다 조금씩 다른 사람이 된다\'고 말한다.\n두 작업은 한 화면에서 이어지도록 설계되었다.');
  X('x28', 'monochrome-city', 'Monochrome City 7', 'u02', 'photo', 'identity', 'photography', 'figure', 23, '4/5', '2025-05-10',
    '흑백으로만 남은 도시의 밤.',
    '문이호의 첫 개인전 대표작이다. 색을 지운 서울의 밤 골목에서 간판과 창문만 사각형으로 남는다.\n작가는 색을 지우면 도시의 구조가 보인다고 말한다. 이 연작은 이후 After Light로 이어졌다.');
  X('x29', 'monochrome-city', 'Crosswalk', 'u02', 'photo', 'identity', 'photography', 'figure', 152, '3/4', '2025-05-22',
    '신호가 바뀌기 직전의 횡단보도.',
    '신호가 바뀌기 직전 2초 동안 횡단보도 앞에 선 사람들을 찍었다. 모두 같은 방향을 보고 있지만 표정은 모두 다르다.\n흑백 속에서 사람들의 자세가 더 또렷해진다.');
  X('x30', 'paper-weight', 'Paper Weight', 'u03', 'graphic', null, 'mixed', 'blocks', 29, '4/5', '2025-09-15',
    '인쇄물이 쌓인 높이로 만든 타이포그래피.',
    '한 해 동안 작업실에 쌓인 인쇄물의 높이를 재고, 그 높이로 글자의 굵기를 정했다. 가장 바쁜 달의 글자가 가장 굵다.\n가벼운 종이도 쌓이면 무게가 된다는 전시의 문장을 그대로 시각화했다.');
  X('x31', 'paper-weight', 'Stack No.3', 'u03', 'graphic', null, 'mixed', 'blocks', 153, '3/4', '2025-09-28',
    '버려진 교정지를 층층이 쌓은 구조물.', '교정지 312장을 쌓아 만든 구조물의 기록 사진. 각 층에는 고쳐진 문장이 남아 있다.');
  X('x32', 'second-skin', 'Second Skin', 'u08', 'fashion', 'identity', 'mixed', 'fabric', 37, '3/4', '2025-08-20',
    '피부처럼 얇은 옷.',
    '정마루는 0.1mm 두께의 원단으로 몸에 꼭 붙는 옷을 만들었다. 입으면 옷과 피부의 경계가 거의 보이지 않는다.\n옷과 몸의 경계가 사라지는 지점을 찾는 실험으로, 이후 Soft Armor 연작의 출발점이 되었다.');
  X('x33', 'second-skin', 'Membrane', 'u08', 'fashion', 'identity', 'photography', 'portrait', 154, '4/5', '2025-09-02',
    '빛이 통과하는 막 같은 상의.', '역광에서만 형태가 드러나는 상의. 작가는 옷을 \'몸과 세계 사이의 막\'으로 정의한다.');
  X('x34', 'night-bloom', 'Night Bloom', 'u12', 'illust', 'dreams', 'drawing', 'bloom', 33, '4/5', '2024-10-15',
    '밤에 피는 꽃.',
    '류세아의 첫 전시 대표작이다. 어둠 속에서만 보이는 색을 찾기 위해, 불을 끄고 손전등 하나로 그림을 그렸다.\n꽃잎의 가장자리만 밝게 남은 것은 손전등이 닿은 자리이기 때문이다.');
  X('x35', 'night-bloom', 'Moth Garden', 'u12', 'illust', 'dreams', 'drawing', 'garden', 155, '1/1', '2024-10-25',
    '불빛을 찾아 모여든 나방의 정원.', '정원 한가운데의 작은 등불을 향해 나방들이 모여든다. 작가는 \'빛을 향하는 마음\'을 그렸다고 말한다.');

  /* Exhibitions — status: current / upcoming / past
     진행 중(current) 전시는 동시에 최대 5개까지 열 수 있어요 (store.js MAX_CURRENT).
     mood: 전시마다 다른 시각적 분위기 (dark / paper / stone), type: 제목 서체 스타일 */
  var exhibitions = [
    { id: 'form-in-tension', title: 'Form in Tension', subtitle: '긴장 속의 형태', theme: 'anxiety', kind: '기획 전시', mood: 'dark', type: 'serif',
      coverImage: { gen: 'lines', seed: 3 }, startDate: '2026-10-01', endDate: '2026-12-20', status: 'current', featured: true,
      description: '수백 개의 선이 서로를 당기고 밀어내며 만드는 형태. 밀도와 공백 사이에서 흔들리는 디지털 조형과 설치 기록을 함께 소개합니다.',
      curatorStatement: '불안은 무너지기 직전의 균형이다. 이 전시는 선 하나하나가 서로를 지탱하는 힘, 그리고 그 힘이 언제든 풀려버릴 수 있다는 감각을 따라간다. 관람객은 화면을 넘길 때마다 조금씩 다른 긴장을 마주하게 된다.' },
    { id: 'after-light', title: 'After Light', subtitle: '빛 이후', theme: 'memory', kind: '기획 전시', mood: 'stone', type: 'serif',
      coverImage: { gen: 'figure', seed: 7 }, startDate: '2026-09-12', endDate: '2026-11-30', status: 'current', featured: true,
      description: '해가 진 뒤 도시에 남은 빛을 따라 걷는 사진 전시. 아무도 없는 출입구와 그 앞에 선 한 사람.',
      curatorStatement: '기억은 빛이 사라진 뒤에야 형태를 갖는다. 문이호는 꺼지기 직전의 빛과 꺼진 이후의 잔상을 3년 동안 기록했다.' },
    { id: 'soft-armor', title: 'Soft Armor', subtitle: '부드러운 갑옷', theme: 'identity', kind: '기획 전시', mood: 'paper', type: 'sans',
      coverImage: { gen: 'portrait', seed: 113 }, startDate: '2026-10-15', endDate: '2026-12-31', status: 'current', featured: true,
      description: '몸을 보호하는 동시에 드러내는 옷에 대한 실험. 패션 디자이너 정마루의 개인전.',
      curatorStatement: '옷은 가장 가까운 건축이다. 이 전시는 정체성을 감추는 동시에 드러내는 옷, 부드럽지만 단단한 경계에 대해 이야기한다.' },
    { id: 'quiet-signal', title: 'Quiet Signal', subtitle: '조용한 신호', theme: 'future', kind: '기획 전시', mood: 'paper', type: 'serif',
      coverImage: { gen: 'halftone', seed: 9 }, startDate: '2026-10-20', endDate: '2027-01-15', status: 'current',
      description: '점, 망점, 끊긴 방송. 소리 없이 전달되는 신호를 다룬 그래픽 디자이너 강지우의 개인전.',
      curatorStatement: '미래는 아직 도착하지 않은 신호다. 강지우는 들리지 않는 것을 보이게 만드는 방법을 네 가지 언어로 제안한다.' },
    { id: 'nocturne-zoo', title: 'Nocturne Zoo', subtitle: '밤의 동물원', theme: 'dreams', kind: '기획 전시', mood: 'dark', type: 'italic',
      coverImage: { gen: 'bloom', seed: 17 }, startDate: '2026-10-05', endDate: '2026-11-20', status: 'current',
      description: '모두가 잠든 밤, 동물원의 동물들은 어떤 꿈을 꿀까. 일러스트레이터 류세아의 개인전.',
      curatorStatement: '꿈은 가장 사적인 전시장이다. 류세아는 잠과 꿈 사이에 머무는 동물들을 네 장면으로 그렸다.' },
    { id: 'green-static', title: 'Green Static', subtitle: '초록의 잡음', theme: 'nature', kind: '기획 전시', mood: 'stone', type: 'sans',
      coverImage: { gen: 'horizon', seed: 118 }, startDate: '2026-11-20', endDate: '2027-02-28', status: 'upcoming',
      description: '자연의 소리와 풍경을 데이터와 노이즈로 다시 듣는 전시. 오리온과 문이호가 함께해요.',
      curatorStatement: '자연은 조용하지 않다. 우리가 듣지 못할 뿐이다.' },
    { id: 'tomorrow-residue', title: 'Tomorrow Residue', subtitle: '내일의 잔여물', theme: 'future', kind: '기획 전시', mood: 'paper', type: 'serif',
      coverImage: { gen: 'halftone', seed: 121 }, startDate: '2026-12-10', endDate: '2027-03-15', status: 'upcoming',
      description: '아직 일어나지 않은 일의 흔적을 미리 기록하는 그래픽 전시.',
      curatorStatement: '미래를 상상하는 일은 언제나 현재의 흔적을 남긴다.' },
    { id: 'drift-memory', title: 'Drift Memory', subtitle: '흩어지는 기억', theme: 'memory', kind: '기획 전시', mood: 'dark', type: 'serif',
      coverImage: { gen: 'particles', seed: 19 }, startDate: '2026-05-01', endDate: '2026-07-31', status: 'past',
      description: '파티클 시뮬레이션으로 기억의 흩어짐을 표현한 디지털 아트 전시.',
      curatorStatement: '기억은 저장되는 것이 아니라 매번 다시 만들어진다.' },
    { id: 'monochrome-city', title: 'Monochrome City', subtitle: '단색의 도시', theme: 'identity', kind: '기획 전시', mood: 'stone', type: 'sans',
      coverImage: { gen: 'figure', seed: 23 }, startDate: '2025-06-01', endDate: '2025-08-31', status: 'past',
      description: '흑백으로만 기록한 서울의 밤.',
      curatorStatement: '색을 지우면 도시의 구조가 보인다.' },
    { id: 'paper-weight', title: 'Paper Weight', subtitle: '종이의 무게', theme: null, kind: '기획 전시', mood: 'paper', type: 'serif',
      coverImage: { gen: 'blocks', seed: 29 }, startDate: '2025-10-01', endDate: '2025-12-20', status: 'past',
      description: '인쇄물과 타이포그래피의 물성을 다룬 전시. 특정 주제에 속하지 않은 전시의 예시예요.',
      curatorStatement: '종이는 가볍지만, 쌓이면 무게가 된다.' },
    { id: 'second-skin', title: 'Second Skin', subtitle: '두 번째 피부', theme: 'identity', kind: '기획 전시', mood: 'paper', type: 'italic',
      coverImage: { gen: 'fabric', seed: 37 }, startDate: '2025-09-01', endDate: '2025-10-31', status: 'past',
      description: '피부처럼 몸에 붙는 옷을 주제로 한 전시.',
      curatorStatement: '옷과 몸의 경계가 사라지는 지점.' },
    { id: 'night-bloom', title: 'Night Bloom', subtitle: '밤에 피는 것들', theme: 'dreams', kind: '기획 전시', mood: 'dark', type: 'italic',
      coverImage: { gen: 'bloom', seed: 33 }, startDate: '2024-11-01', endDate: '2025-01-31', status: 'past',
      description: '밤과 꿈을 그린 일러스트레이션 전시.',
      curatorStatement: '어둠 속에서만 보이는 색이 있다.' }
  ];

  var comments = [
    { id: 'c01', workId: 'x06', authorId: 'v02', content: '비상구 불빛이 이렇게 따뜻할 수 있다니. 한참 봤어요.', createdAt: '2026-10-27T21:10' },
    { id: 'c02', workId: 'x06', authorId: 'u07', content: '빛의 온도가 정말 좋네요. 다음 작업도 기대할게요.', createdAt: '2026-10-28T09:02' },
    { id: 'c03', workId: 'x01', authorId: 'v03', content: '화면을 넘길 때마다 선이 흔들리는 것 같아요.', createdAt: '2026-10-20T18:40' },
    { id: 'c04', workId: 'x01', authorId: 'u03', content: '밀도의 리듬이 음악처럼 읽혀요.', createdAt: '2026-10-21T11:15' },
    { id: 'c05', workId: 'w09', authorId: 'v01', content: '셔츠 세 벌이라는 게 믿기지 않아요!', createdAt: '2026-10-28T10:30' },
    { id: 'c06', workId: 'w13', authorId: 'v02', content: '색이 번지는 방식이 꿈 같아요.', createdAt: '2026-10-27T23:50' },
    { id: 'c07', workId: 'w11', authorId: 'u05', content: '보러 와주셔서 감사합니다. 연작으로 이어갈 예정이에요.', createdAt: '2026-10-27T15:20' },
    { id: 'c08', workId: 'w16', authorId: 'v01', content: '흩어지는 순간이 제일 좋네요.', createdAt: '2026-10-26T20:05' },
    { id: 'c09', workId: 'w22', authorId: 'v03', content: '수평선이 지워지니까 오히려 바다가 넓어 보여요.', createdAt: '2026-10-27T19:00' },
    { id: 'c11', workId: 'x17', authorId: 'v01', content: '사슴 귀가 세 번 움직인다는 이야기를 읽고 다시 보니 더 좋아요.', createdAt: '2026-10-22T22:10' },
    { id: 'c12', workId: 'x09', authorId: 'v02', content: '패딩으로 만든 갑옷이라니, 입어보고 싶어요.', createdAt: '2026-10-19T14:30' },
    { id: 'c10', workId: 'x13', authorId: 'v02', content: '소리를 보는 느낌.', createdAt: '2026-10-24T13:12' }
  ];

  var saves = [
    { userId: 'v01', workId: 'x06', createdAt: '2026-10-27' },
    { userId: 'v01', workId: 'w13', createdAt: '2026-10-26' },
    { userId: 'v01', workId: 'x01', createdAt: '2026-10-21' },
    { userId: 'u04', workId: 'x10', createdAt: '2026-10-16' }
  ];
  var follows = [
    { followerId: 'v01', followingId: 'u02', createdAt: '2026-09-15' },
    { followerId: 'v01', followingId: 'u06', createdAt: '2026-10-10' },
    { followerId: 'v02', followingId: 'u02', createdAt: '2026-08-01' },
    { followerId: 'v02', followingId: 'u01', createdAt: '2026-08-04' },
    { followerId: 'v03', followingId: 'u01', createdAt: '2026-10-01' },
    { followerId: 'u07', followingId: 'u02', createdAt: '2026-10-03' },
    { followerId: 'u04', followingId: 'u08', createdAt: '2026-09-02' },
    { followerId: 'u03', followingId: 'u01', createdAt: '2026-05-11' },
    { followerId: 'u05', followingId: 'u03', createdAt: '2026-06-22' },
    { followerId: 'v02', followingId: 'u04', createdAt: '2026-10-20' }
  ];

  /* 신고 (운영자 화면 데모용) */
  var reports = [
    { id: 'r01', target: 'comment', targetId: 'c10', reason: '의미 없는 댓글', reporterId: 'v03', status: 'open', createdAt: '2026-10-25' },
    { id: 'r02', target: 'work', targetId: 'w32', reason: '저작권 확인 요청', reporterId: 'v02', status: 'open', createdAt: '2026-10-27' },
    { id: 'r03', target: 'comment', targetId: 'c03', reason: '스팸 의심', reporterId: 'u05', status: 'resolved', createdAt: '2026-10-21' }
  ];

  return { fields: fields, themes: themes, media: media, users: users, works: works, exhibitions: exhibitions,
    exhibitionWorks: exhibitionWorks, comments: comments, saves: saves, follows: follows, reports: reports,
    today: '2026-10-28' };
})();
