// 사이트 전역 정보

export const SITE = {
  name: '창간 79주년 문예공모',
  fullName: '고대신문 창간 79주년 문예공모 당선작',
  issue: '고대신문 2051호(2026. 11. 2.) 게재',
};

// 허브 카드와 작품 하단 링크에 쓰는 목록. teaser는 작품 본문에서 그대로 옮긴 한 줄.
export const WORKS = [
  {
    id: 'poem',
    genre: '시',
    title: '비켜 놓는 일',
    author: '김철우',
    affiliation: '공과대 건축19',
    cover: 'poem-01',
    minutes: 3, // 읽는 데 걸리는 대략의 시간(분)
    teaser: '새벽 네 시\n엘리베이터 거울에는',
  },
  {
    id: 'novel',
    genre: '소설',
    title: '독립',
    author: '박정연',
    affiliation: '국민대 공연예술학24',
    cover: 'novel-01',
    minutes: 17, // 읽는 데 걸리는 대략의 시간(분)
    teaser: '서진이 너 나가면, 아빠도 이 집 정리하고 원룸 하나 구하려고.',
  },
  {
    id: 'play',
    genre: '희곡',
    title: '마지막으로 불이 켜지는 집',
    author: '김민성',
    affiliation: '생명대 식품자원경제25',
    cover: 'play-01',
    minutes: 17, // 읽는 데 걸리는 대략의 시간(분)
    teaser: '천장 전구는 극의 시작부터 끝 직전까지 켜져 있다.',
  },
  {
    id: 'critique',
    genre: '문예평론',
    title: '나의 친애하는 공범들에게',
    author: '김인환',
    affiliation: '중앙대 대학원·문예창작학과',
    cover: 'crit-01',
    minutes: 18, // 읽는 데 걸리는 대략의 시간(분)
    teaser: '나의 친애하는 공범들에게, 우리는 이미 그 자리에 어쩔 수 없이 함께 있다.',
  },
];

// 고대신문 로고. public/brand/*.png 를 CSS 마스크로 칠하므로 글자색(currentColor)을 그대로 따른다.
// kind: 'emblem'(KU 엠블럼) | 'wordmark'(가로형) | 'stacked'(세로형) | 'lockup'(엠블럼+가로형)
export function logoHTML(kind = 'lockup', cls = '') {
  const label = 'aria-label="고대신문 The Korea University Weekly" role="img"';
  if (kind === 'lockup') {
    return `<span class="logo-lockup ${cls}" ${label}><span class="logo logo--emblem"></span><span class="logo logo--wordmark"></span></span>`;
  }
  return `<span class="logo logo--${kind} ${cls}" ${label}></span>`;
}

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
