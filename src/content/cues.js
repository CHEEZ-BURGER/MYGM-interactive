// 문단별 연출 큐.
//
// at    : 블록 번호(src/content/<작품>.json 의 "i") 또는 'speech'(수상소감) / 'review'(심사평)
// img   : public/media/img/<id>.(webp|jpg|png) — 없으면 작품 색 그라데이션으로 대체
// audio : public/media/audio/<id>.mp3 — 없으면 무음
// fx    : 계속 이어지는 화면 효과 'snow' | 'rain' | null (이어받음)
// pulse : 그 순간 한 번만 일어나는 효과 'flash'(셔터) | 'blackout'(암전)
// sfx   : 그 순간 한 번 울리는 효과음 public/media/sfx/<id>.mp3 (아래로 읽어 내려갈 때만)
// 생략한 값은 직전 큐를 그대로 이어받는다. img: null 은 이미지를 걷어낸다.
// 각 id 의 생성 프롬프트는 docs/PROMPTS.md 에 있다.

export const CUES = {
  poem: [
    { at: 0, img: 'poem-01', audio: 'poem-a', sfx: 'sfx-elevator' }, // 새벽 네 시 / 엘리베이터 거울
    { at: 2, img: 'poem-02' }, // 문이 바깥으로 열렸다
    { at: 4, img: 'poem-03' }, // 아이 신발이 나란한 집
    { at: 5, img: 'poem-04' }, // 생수는 바닥에 닿기 직전이
    { at: 6, img: 'poem-05' }, // 문 아래 가느다란 틈
    { at: 8, sfx: 'sfx-water-thud' }, // 한 번은 쿵 소리가 났다
    { at: 10, img: 'poem-06' }, // 긴 복도가 돌려주는 발소리
    { at: 11, img: 'poem-07', pulse: 'flash', sfx: 'sfx-shutter' }, // 사진을 찍을 때마다
    { at: 12, sfx: 'sfx-door-lock' }, // 안쪽에서 잠금쇠가 돌아갔다
    { at: 13, img: 'poem-08' }, // 문틈으로 나온 손
    { at: 14, audio: 'poem-b', pulse: 'blackout', sfx: 'sfx-door-close' }, // 문이 닫혔다
    { at: 15, img: 'poem-09' }, // 빈손을 천천히 내려놓았다
    { at: 'speech', img: null, volume: 0.35 },
  ],
  novel: [
    { at: 0, img: 'novel-01', audio: 'novel-home' }, // 볶음밥, 아빠와 아침
    { at: 9, img: 'novel-02' }, // 가을 끝자락 버스정류장
    { at: 11, img: 'novel-03', audio: 'novel-shop' }, // 사탕 가게
    { at: 20, img: 'novel-04', sfx: 'sfx-shop-bell' }, // 가게 문 종소리, 꽃다발
    { at: 40, img: 'novel-05', audio: 'novel-home' }, // 밤, 집, 아빠
    { at: 47, img: 'novel-06', audio: 'novel-shop', sfx: 'sfx-candy-drop' }, // 떨어진 사탕
    { at: 48, img: 'novel-07' }, // 편의점 계산대, 재희
    { at: 50, img: 'novel-08', audio: 'novel-night' }, // 5평짜리 방의 기억
    { at: 59, img: 'novel-09' }, // 집 근처 술집
    { at: 65, img: 'novel-05', audio: 'novel-home' }, // TV 앞의 아빠
    { at: 72, img: 'novel-10', audio: 'novel-night' }, // 재희와 보내는 날들
    { at: 80, img: 'novel-11', audio: 'novel-snow', fx: 'snow' }, // 첫눈
    { at: 99, img: 'novel-12' }, // 눈 오는 날의 정적
    { at: 102, img: 'novel-13', fx: null }, // 어두운 현관(눈이 그친 뒤)
    { at: 107, img: 'novel-14', audio: 'novel-home', sfx: 'sfx-can-open' }, // 통닭과 맥주 두 캔
    { at: 126, img: 'novel-15', audio: 'novel-shop' }, // 아르바이트 마지막 날
    { at: 131, img: 'novel-16', audio: 'novel-sea' }, // 부산, 7평 원룸
    { at: 'speech', img: null, volume: 0.35 },
  ],
  play: [
    { at: 0, img: 'play-01', audio: 'play-room' }, // 무대 / 귤껍질
    { at: 73, img: 'play-02' }, // 이삿짐의 목록
    { at: 99, sfx: 'sfx-knock' }, // 노크
    { at: 135, img: 'play-03' }, // 제1막의 밤, 식탁에서
    { at: 170, img: 'play-04', audio: 'play-memory' }, // 그 여름의 숙제(과거)
    { at: 211, sfx: 'sfx-thunder' }, // 천둥
    { at: 219, audio: 'play-storm', fx: 'rain', pulse: 'blackout', sfx: 'sfx-power-off' }, // 정전, 폭우
    { at: 234, img: 'play-05', sfx: 'sfx-door-rain' }, // 문이 열리며 거센 빗소리(문이 열린 그림은 여기서)
    { at: 235, img: 'play-06', audio: 'play-room', fx: null }, // 철거하는 사람
    { at: 284, img: 'play-07' }, // 봉투
    { at: 319, img: 'play-08', audio: 'play-night' }, // 누나에게
    { at: 361, img: 'play-09' }, // 말하지 않은 죄
    { at: 419, img: 'play-10' }, // 집의 설계도
    { at: 444, img: 'play-11' }, // 없는 사람의 자리
    { at: 488, img: 'play-12' }, // 빈자리의 계약
    { at: 539, img: 'play-13', audio: 'play-room' }, // 꺼지는 연습
    { at: 567, sfx: 'sfx-machine' }, // 멀리서 공사 장비의 시동 소리
    { at: 585, img: 'play-14', audio: 'play-morning' }, // 스위치 — 불이 꺼진다(딸깍 소리는 버튼을 누를 때)
    { at: 593, img: 'play-15' }, // 빈 거실, 귤껍질
    { at: 'speech', img: null, volume: 0.35 },
  ],
  critique: [
    { at: 0, img: 'crit-01', audio: 'crit-a' }, // 1. 죄인-되기
    { at: 5, img: 'crit-02' }, // 2. 피고석의 빈자리
    { at: 7, img: 'crit-03' }, // 하쿠, 바다
    { at: 10, img: 'crit-04' }, // 어떤 이름을 적어야 할까
    { at: 21, img: 'crit-05' }, // 3장: 선숙의 물류 현장이 처음 나오는 문단
    { at: 28, img: 'crit-06' }, // 4장: 기진과 진화가 남자를 땅에 묻는 문단
    { at: 39, img: 'crit-07' }, // 5장: 영인과 인범이 터널에서 사고 차량을 발견하는 문단
    { at: 41, img: 'crit-08', audio: 'crit-b' }, // 공범의 자리
    { at: 'speech', img: null, volume: 0.35 },
  ],
};

// 희곡: 독자가 직접 스위치를 눌러야 이 블록부터 공개된다.
export const PLAY_SWITCH_AT = 585;

// 희곡: 과거(기억) 장면으로 표시할 블록 범위 [시작, 끝]
export const PLAY_PAST = [
  [170, 234],
  [485, 487],
  [573, 575],
];
