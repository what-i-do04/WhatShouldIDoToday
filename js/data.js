/* =========================================================
   OTHER SPACE — 샘플 데이터 (가상)
   - 모든 페이지가 이 파일 하나의 데이터를 함께 사용해요.
   - 필드 이름은 기획서 14번 데이터 모델(Users, Works, Comments, Saves,
     Follows, Exhibitions, ExhibitionWorks)과 맞춰 두었어요.
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

  /* Users — role: viewer / creator / admin, isFeaturedArtist 는 운영자가 지정하는 표시 속성 */
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
    { id: 'u10', email: 'orion@sample.otherspace', nickname: '오리온', handle: 'orion.oh', role: 'creator', isFeaturedArtist: false, field: 'other', profileImage: { gen: 'rings', seed: 17 },
      bio: '빛과 소리를 쓰는 설치 작업자. 전시장 자체를 매체로 다룬다.', createdAt: '2026-05-30' },
    { id: 'u11', email: 'haram@sample.otherspace', nickname: '백하람', handle: 'haram.baek', role: 'creator', isFeaturedArtist: false, field: 'photo', profileImage: { gen: 'horizon', seed: 27 },
      bio: '안개 낀 해안선을 찍는다. 아무것도 일어나지 않는 풍경을 오래 바라본다.', createdAt: '2026-10-10' },
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

  /* Works — status: draft / published / archived. ratio 는 카드 이미지 비율 */
  function W(id, title, artistId, field, theme, medium, gen, seed, ratio, createdAt, description, intent, status) {
    return { id: id, title: title, image: { gen: gen, seed: seed }, imageUrl: '', description: description, intent: intent,
      artistId: artistId, field: field, theme: theme, medium: medium, status: status || 'published',
      ratio: ratio, createdAt: createdAt, updatedAt: createdAt };
  }
  var works = [
    W('w01', 'Form in Tension No.1', 'u01', 'digital', 'anxiety', 'digital', 'lines', 3, '4/5', '2026-09-20',
      '수백 개의 선이 원형 받침 위에서 솟아오르며 하나의 산맥을 이룬다.', '서로를 당기는 힘이 균형을 잃기 직전의 순간을 붙잡고 싶었다.'),
    W('w02', 'Form in Tension No.4', 'u01', 'digital', 'anxiety', 'digital', 'lines', 44, '3/4', '2026-09-22',
      '선의 밀도가 높아질수록 형태는 오히려 흐려진다.', '빽빽함과 텅 빔이 같은 것일 수 있는지 묻는다.'),
    W('w03', 'Orbit Study', 'u01', 'digital', 'future', 'digital', 'rings', 112, '1/1', '2026-08-02',
      '서로 다른 중심을 가진 원들이 한 점을 향해 수렴한다.', '궤도는 보이지 않는 규칙의 흔적이다.'),
    W('w04', 'Exit, 23:40', 'u02', 'photo', 'memory', 'photography', 'figure', 105, '4/5', '2026-10-26',
      '자정 직전, 비상구 불빛 아래 서 있는 한 사람.', '도시가 비워지는 시간에만 보이는 얼굴들이 있다.'),
    W('w05', 'Corridor', 'u02', 'photo', 'memory', 'photography', 'figure', 111, '3/4', '2026-10-21',
      '끝이 보이지 않는 복도와 그 끝의 빛.', '기억은 늘 복도의 끝에서 빛난다.'),
    W('w06', 'After Light III', 'u02', 'photo', 'memory', 'photography', 'figure', 7, '3/2', '2026-09-10',
      '빈 전시장에 남은 마지막 조명.', '빛이 꺼진 다음에도 공간은 무언가를 기억한다.'),
    W('w07', 'Low Frequency', 'u03', 'graphic', 'identity', 'digital', 'halftone', 110, '4/5', '2026-10-23',
      '저주파 소리를 망점의 크기로 옮긴 포스터 연작.', '들리지 않는 소리도 형태를 가질 수 있다.'),
    W('w08', 'Rings for Nobody', 'u03', 'graphic', 'future', 'digital', 'rings', 107, '1/1', '2026-10-24',
      '아무도 듣지 않는 신호를 위한 동심원.', '수신자가 없는 메시지를 시각화했다.'),
    W('w09', '겹쳐 입은 오후', 'u04', 'fashion', 'identity', 'photography', 'fabric', 102, '3/4', '2026-10-28',
      '버려진 셔츠 세 벌을 겹쳐 만든 한 벌의 옷.', '옷이 쌓이는 방식으로 사람의 하루를 기록하고 싶었다.'),
    W('w10', 'Pleat No.4', 'u04', 'fashion', 'identity', 'mixed', 'fabric', 109, '4/5', '2026-10-25',
      '주름이 몸의 움직임을 따라 열리고 닫힌다.', '주름은 옷에 남은 시간이다.'),
    W('w11', 'ㅎ의 구조', 'u05', 'graphic', 'identity', 'digital', 'blocks', 103, '3/4', '2026-10-27',
      '한글 ㅎ을 일곱 개의 면으로 해체한 포스터.', '글자가 소리를 잃으면 무엇이 남는지 보고 싶었다.'),
    W('w12', '종이의 무게', 'u05', 'graphic', 'memory', 'mixed', 'blocks', 29, '4/5', '2025-11-12',
      '인쇄물이 쌓인 높이로 만든 타이포그래피.', ''),
    W('w13', '잠든 여우', 'u06', 'illust', 'dreams', 'drawing', 'bloom', 104, '1/1', '2026-10-27',
      '꿈속에서 색이 번지는 여우.', '잠들기 직전의 흐릿한 감각을 색으로 옮겼다.'),
    W('w14', '밤의 정원', 'u06', 'illust', 'dreams', 'drawing', 'garden', 108, '4/5', '2026-10-24',
      '밤에만 피는 꽃들이 모인 정원.', ''),
    W('w15', 'Tide Lines', 'u07', 'digital', 'memory', 'video', 'lines', 101, '3/2', '2026-10-28',
      '파도가 남긴 선을 따라 움직이는 3분 길이의 영상 작업. 대표 장면.', '사라지는 것의 궤적만 남기고 싶었다.'),
    W('w16', 'Dust Choir', 'u07', 'digital', 'memory', 'digital', 'particles', 106, '4/5', '2026-10-26',
      '먼지 입자 4,000개가 한 점으로 모였다 흩어진다.', '기억은 모이는 순간보다 흩어지는 순간에 더 선명하다.'),
    W('w17', 'Shadow Cut', 'u08', 'fashion', 'identity', 'photography', 'portrait', 113, '3/4', '2026-10-15',
      '그림자의 형태를 따라 재단한 코트.', '빛이 만드는 실루엣까지 옷의 일부로 본다.'),
    W('w18', 'Soft Armor 01', 'u08', 'fashion', 'identity', 'photography', 'portrait', 114, '4/5', '2026-10-12',
      '패딩 소재로 만든 부드러운 갑옷.', '보호와 노출이 동시에 일어나는 옷.'),
    W('w19', '잎의 사람', 'u09', 'illust', 'nature', 'drawing', 'garden', 115, '3/4', '2026-10-19',
      '잎맥이 사람의 손금이 되는 순간.', ''),
    W('w20', '광합성', 'u09', 'illust', 'nature', 'drawing', 'bloom', 116, '1/1', '2026-10-09',
      '빛을 먹는 사람들의 초상.', '식물처럼 빛만으로 살 수 있다면.'),
    W('w21', 'Room Tone', 'u10', 'other', 'anxiety', 'mixed', 'rings', 117, '3/2', '2026-10-04',
      '빈 방의 소음을 빛의 고리로 바꾼 설치 작업의 기록 사진.', '아무 소리도 없는 방은 없다.'),
    W('w22', 'Fog Line', 'u11', 'photo', 'nature', 'photography', 'horizon', 118, '3/2', '2026-10-27',
      '안개에 지워진 수평선.', '경계가 사라질 때 풍경은 더 넓어진다.'),
    W('w23', '썰물', 'u11', 'photo', 'nature', 'photography', 'horizon', 119, '4/5', '2026-10-20',
      '물이 빠진 갯벌 위의 빛.', ''),
    W('w24', 'Green Static', 'u10', 'other', 'nature', 'video', 'particles', 120, '1/1', '2026-10-01',
      '숲의 소리를 노이즈로 바꾼 영상 작업.', ''),
    W('w25', 'Tomorrow Residue', 'u03', 'graphic', 'future', 'digital', 'halftone', 121, '3/4', '2026-10-18',
      '내일 남게 될 흔적을 미리 인쇄한 포스터.', ''),
    W('w26', 'Monochrome City 7', 'u02', 'photo', 'identity', 'photography', 'figure', 23, '4/5', '2025-06-01',
      '흑백으로만 남은 도시의 밤.', ''),
    W('w27', 'Second Skin', 'u04', 'fashion', 'identity', 'mixed', 'fabric', 37, '3/4', '2025-09-05',
      '피부처럼 얇은 옷.', ''),
    W('w28', 'Night Bloom', 'u06', 'illust', 'dreams', 'drawing', 'bloom', 33, '4/5', '2024-11-11',
      '밤에 피는 꽃.', ''),
    /* 공개 목록에 나오지 않는 작품 (본인만 확인 가능) */
    W('w29', '보관한 시안: 접힌 셔츠', 'u04', 'fashion', 'identity', 'photography', 'fabric', 130, '3/4', '2026-08-30',
      '초기 시안. 보관 처리되어 공개 목록에서 숨겨진 상태.', '', 'archived'),
    W('w30', '작업 중: 레이어 연구', 'u04', 'fashion', 'memory', 'mixed', 'fabric', 131, '4/5', '2026-10-27',
      '아직 공개하지 않은 초안.', '', 'draft')
  ];

  /* Exhibitions — status: current / upcoming / past
     mood: 전시마다 다른 시각적 분위기 (dark / paper / stone), type: 제목 서체 스타일 */
  var exhibitions = [
    { id: 'form-in-tension', title: 'Form in Tension', subtitle: '긴장 속의 형태', theme: 'anxiety', kind: '기획 전시', mood: 'dark', type: 'serif',
      coverImage: { gen: 'lines', seed: 3 }, startDate: '2026-10-01', endDate: '2026-12-20', status: 'current', featured: true,
      description: '수백 개의 선이 서로를 당기고 밀어내며 만드는 형태. 밀도와 공백 사이에서 흔들리는 디지털 조형과 설치 기록을 함께 소개합니다.',
      curatorStatement: '불안은 무너지기 직전의 균형이다. 이 전시는 선 하나하나가 서로를 지탱하는 힘, 그리고 그 힘이 언제든 풀려버릴 수 있다는 감각을 따라간다. 관람객은 화면을 넘길 때마다 조금씩 다른 긴장을 마주하게 된다.' },
    { id: 'after-light', title: 'After Light', subtitle: '빛 이후', theme: 'memory', kind: '기획 전시', mood: 'stone', type: 'serif',
      coverImage: { gen: 'figure', seed: 7 }, startDate: '2026-09-12', endDate: '2026-11-30', status: 'current', featured: true,
      description: '해가 진 뒤 도시에 남은 빛을 따라 걷는 사진 전시. 아무도 없는 출입구와 그 앞에 선 한 사람.',
      curatorStatement: '기억은 빛이 사라진 뒤에야 형태를 갖는다. 문이호와 이한빛은 각자 사진과 영상으로, 꺼지기 직전의 빛과 꺼진 이후의 잔상을 기록한다.' },
    { id: 'soft-armor', title: 'Soft Armor', subtitle: '부드러운 갑옷', theme: 'identity', kind: '기획 전시', mood: 'paper', type: 'sans',
      coverImage: { gen: 'portrait', seed: 113 }, startDate: '2026-10-15', endDate: '2026-12-31', status: 'current', featured: true,
      description: '몸을 보호하는 동시에 드러내는 옷에 대한 실험. 신진 디자이너와 초대 작가가 함께 참여했습니다.',
      curatorStatement: '옷은 가장 가까운 건축이다. 이 전시는 정체성을 감추는 동시에 드러내는 옷, 부드럽지만 단단한 경계에 대해 이야기한다.' },
    { id: 'quiet-signal', title: 'Quiet Signal', subtitle: '조용한 신호', theme: 'future', kind: '기획 전시', mood: 'paper', type: 'serif',
      coverImage: { gen: 'halftone', seed: 9 }, startDate: '2026-10-20', endDate: '2027-01-15', status: 'current',
      description: '점, 망점, 해체된 글자. 소리 없이 전달되는 신호를 다룬 그래픽 디자이너 두 사람의 대화.',
      curatorStatement: '미래는 아직 도착하지 않은 신호다. 두 디자이너는 들리지 않는 것을 보이게 만드는 방법을 각자의 언어로 제안한다.' },
    { id: 'nocturne-zoo', title: 'Nocturne Zoo', subtitle: '밤의 동물원', theme: 'dreams', kind: '오픈 갤러리 공모전', mood: 'dark', type: 'italic',
      coverImage: { gen: 'bloom', seed: 17 }, startDate: '2026-10-05', endDate: '2026-11-20', status: 'current',
      description: '오픈 갤러리 공모로 선정된 신진 일러스트레이터들의 그룹전.',
      curatorStatement: '꿈은 가장 사적인 전시장이다. 오픈 갤러리에서 처음 작품을 공개한 창작자들이 잠과 꿈 사이의 동물들을 그렸다.' },
    { id: 'green-static', title: 'Green Static', subtitle: '초록의 잡음', theme: 'nature', kind: '기획 전시', mood: 'stone', type: 'sans',
      coverImage: { gen: 'horizon', seed: 118 }, startDate: '2026-11-20', endDate: '2027-02-28', status: 'upcoming',
      description: '자연의 소리와 풍경을 데이터와 노이즈로 다시 듣는 전시.',
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
    { id: 'second-skin', title: 'Second Skin', subtitle: '두 번째 피부', theme: 'identity', kind: '오픈 갤러리 공모전', mood: 'paper', type: 'italic',
      coverImage: { gen: 'fabric', seed: 37 }, startDate: '2025-09-01', endDate: '2025-10-31', status: 'past',
      description: '피부처럼 몸에 붙는 옷을 주제로 한 공모전.',
      curatorStatement: '옷과 몸의 경계가 사라지는 지점.' },
    { id: 'night-bloom', title: 'Night Bloom', subtitle: '밤에 피는 것들', theme: 'dreams', kind: '기획 전시', mood: 'dark', type: 'italic',
      coverImage: { gen: 'bloom', seed: 33 }, startDate: '2024-11-01', endDate: '2025-01-31', status: 'past',
      description: '밤과 꿈을 그린 일러스트레이션 전시.',
      curatorStatement: '어둠 속에서만 보이는 색이 있다.' }
  ];

  /* ExhibitionWorks — 전시에 걸린 작품과 순서 */
  var exhibitionWorks = [];
  function EW(exId, ids) { ids.forEach(function (w, i) { exhibitionWorks.push({ exhibitionId: exId, workId: w, displayOrder: i + 1 }); }); }
  EW('form-in-tension', ['w01', 'w02', 'w03', 'w21']);
  EW('after-light', ['w06', 'w04', 'w05', 'w15', 'w16']);
  EW('soft-armor', ['w18', 'w17', 'w09', 'w10']);
  EW('quiet-signal', ['w07', 'w08', 'w11', 'w25']);
  EW('nocturne-zoo', ['w13', 'w14', 'w19', 'w20']);
  EW('green-static', ['w22', 'w23', 'w24']);
  EW('tomorrow-residue', ['w25', 'w08']);
  EW('drift-memory', ['w16', 'w15']);
  EW('monochrome-city', ['w26', 'w05']);
  EW('paper-weight', ['w12', 'w11']);
  EW('second-skin', ['w27', 'w10']);
  EW('night-bloom', ['w28', 'w13']);

  var comments = [
    { id: 'c01', workId: 'w04', authorId: 'v02', content: '비상구 불빛이 이렇게 따뜻할 수 있다니. 한참 봤어요.', createdAt: '2026-10-27T21:10' },
    { id: 'c02', workId: 'w04', authorId: 'u07', content: '빛의 온도가 정말 좋네요. 다음 작업도 기대할게요.', createdAt: '2026-10-28T09:02' },
    { id: 'c03', workId: 'w01', authorId: 'v03', content: '화면을 넘길 때마다 선이 흔들리는 것 같아요.', createdAt: '2026-10-20T18:40' },
    { id: 'c04', workId: 'w01', authorId: 'u03', content: '밀도의 리듬이 음악처럼 읽혀요.', createdAt: '2026-10-21T11:15' },
    { id: 'c05', workId: 'w09', authorId: 'v01', content: '셔츠 세 벌이라는 게 믿기지 않아요!', createdAt: '2026-10-28T10:30' },
    { id: 'c06', workId: 'w13', authorId: 'v02', content: '색이 번지는 방식이 꿈 같아요.', createdAt: '2026-10-27T23:50' },
    { id: 'c07', workId: 'w11', authorId: 'u05', content: '보러 와주셔서 감사합니다. 연작으로 이어갈 예정이에요.', createdAt: '2026-10-27T15:20' },
    { id: 'c08', workId: 'w16', authorId: 'v01', content: '흩어지는 순간이 제일 좋네요.', createdAt: '2026-10-26T20:05' },
    { id: 'c09', workId: 'w22', authorId: 'v03', content: '수평선이 지워지니까 오히려 바다가 넓어 보여요.', createdAt: '2026-10-27T19:00' },
    { id: 'c10', workId: 'w07', authorId: 'v02', content: '소리를 보는 느낌.', createdAt: '2026-10-24T13:12' }
  ];

  var saves = [
    { userId: 'v01', workId: 'w04', createdAt: '2026-10-27' },
    { userId: 'v01', workId: 'w13', createdAt: '2026-10-26' },
    { userId: 'v01', workId: 'w01', createdAt: '2026-10-21' },
    { userId: 'u04', workId: 'w17', createdAt: '2026-10-16' }
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
    { id: 'r02', target: 'work', targetId: 'w24', reason: '저작권 확인 요청', reporterId: 'v02', status: 'open', createdAt: '2026-10-27' },
    { id: 'r03', target: 'comment', targetId: 'c03', reason: '스팸 의심', reporterId: 'u05', status: 'resolved', createdAt: '2026-10-21' }
  ];

  return { fields: fields, themes: themes, media: media, users: users, works: works, exhibitions: exhibitions,
    exhibitionWorks: exhibitionWorks, comments: comments, saves: saves, follows: follows, reports: reports,
    today: '2026-10-28' };
})();
