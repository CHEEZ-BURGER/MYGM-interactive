import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './styles/base.css';
import './styles/hub.css';
import { SITE, WORKS, esc, logoHTML } from './lib/site.js';
import { fillMedia } from './lib/stage.js';
import { initTransitions } from './lib/transition.js';
import { preloadFonts } from './lib/fonts.js';
import { getProgress } from './lib/progress.js';
import { bindUiSounds, soundAllowed, ui, unlock } from './lib/synth.js';

const root = document.getElementById('hub');
const n = WORKS.length;
const COPIES = 4; // 네 작품을 이어 붙여 끝없이 흐르는 띠를 만든다
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 읽은 진도: 3% 미만은 표시하지 않고, 97% 이상은 다 읽은 것으로 본다
function progressOf(w) {
  const p = getProgress(w.id);
  if (!p || p.pct < 0.03) return { pct: 0, label: `${w.minutes}분` };
  if (p.pct >= 0.97) return { pct: 1, label: '다 읽음' };
  return { pct: p.pct, label: `${Math.round(p.pct * 100)}% 읽는 중` };
}

const card = (w, copy) => {
  const pr = progressOf(w);
  return `
  <li class="poster" ${copy ? 'aria-hidden="true"' : ''}>
    <a href="${w.id}.html" class="poster__link" tabindex="${copy ? -1 : 0}" draggable="false">
      <span class="poster__img" data-media="${w.cover}"><span class="media-label">이미지 자리: ${w.cover}</span></span>
      <span class="poster__meta"><span>${w.genre}</span><span>${pr.label}</span></span>
      <span class="poster__text">
        <span class="poster__title">${esc(w.title)}</span>
        <span class="poster__by">${esc(w.author)} · ${esc(w.affiliation)}</span>
        <span class="poster__teaser">${esc(w.teaser)}</span>
      </span>
      ${pr.pct ? `<span class="poster__progress" style="--pp:${pr.pct}"></span>` : ''}
    </a>
  </li>`;
};

root.innerHTML = `
  <div class="hub-bg" aria-hidden="true">
    ${WORKS.map((w) => `<div class="hub-bg__panel" data-media="${w.cover}"></div>`).join('')}
  </div>
  <header class="hub-head">
    <button type="button" class="circle hub-head__start" data-view aria-label="목록으로 보기" aria-pressed="false">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>
    </button>
    <a href="./" class="hub-head__brand">${logoHTML('wordmark')}</a>
    <button type="button" class="circle hub-head__end" data-sound-toggle aria-label="효과음 끄기" aria-pressed="true"></button>
  </header>

  <main class="hub-main">
    <header class="hub-intro">
      <h1 class="hub-title"><span>고대신문</span> ${SITE.name} 당선작</h1>
      <button type="button" class="hub-about" aria-expanded="false" aria-controls="hub-lede">
        공모 소개<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="hub-lede" id="hub-lede">
        <p>창간 79주년을 맞아 열린 고대신문 문예공모에 여러 대학의 학생들이 시 214편, 소설 25편, 희곡 10편, 문예평론 9편을 보내왔습니다. 네 부문에서 한 편씩 뽑힌 당선작을 지면에 실린 그대로, 그림과 소리와 함께 읽어 보세요.</p>
      </div>
    </header>
    <section class="strip" aria-label="당선작">
      <ul class="strip__track">${Array.from({ length: COPIES }, (_, c) => WORKS.map((w) => card(w, c > 0)).join('')).join('')}</ul>
    </section>
    <section class="list" hidden aria-label="당선작 목록">
      <ul>
        ${WORKS.map(
          (w) => `<li><a href="${w.id}.html">
            <span class="list__thumb" data-media="${w.cover}"></span>
            <span class="list__text"><small>${w.genre} 부문 당선작 · ${progressOf(w).label}</small><strong>${esc(w.title)}</strong><em>${esc(w.author)} · ${esc(w.affiliation)}</em></span>
          </a></li>`,
        ).join('')}
      </ul>
    </section>
    <div class="hub-actions">
      <a class="pill pill--primary hub-actions__open" href="${WORKS[0].id}.html"><span class="slot"><span class="slot__text">작품 읽기</span></span></a>
    </div>
  </main>

  <footer class="hub-foot">
    ${logoHTML('emblem', 'hub-foot__emblem')}
    <p>${SITE.fullName} · ${SITE.issue} · 이미지와 음악은 AI로 만들었어요.</p>
  </footer>`;

fillMedia(root);
const ready = preloadFonts({ sans: root.textContent });
initTransitions({ ready });
bindUiSounds();

// 효과음 켜고 끄기(작품 페이지의 소리 설정과 같은 값을 쓴다)
const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" class="f"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
const ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" class="f"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
const soundBtn = root.querySelector('[data-sound-toggle]');
const paintSound = () => {
  const on = soundAllowed();
  soundBtn.innerHTML = on ? ICON_ON : ICON_OFF;
  soundBtn.setAttribute('aria-pressed', String(on));
  soundBtn.setAttribute('aria-label', on ? '효과음 끄기' : '효과음 켜기');
};
paintSound();
soundBtn.addEventListener('click', () => {
  const on = !soundAllowed();
  try {
    localStorage.setItem('mungye:sound', on ? 'on' : 'off');
  } catch {
    /* */
  }
  paintSound();
  ui.toggle(on);
});
// 첫 조작에서 소리를 깨워 두어, 카드를 누르는 순간의 슈웅이 늦지 않게
addEventListener('pointerdown', unlock, { once: true });

// ── 끝없이 흐르는 카드 띠 ─────────────────────────────────
// 스냅 없이 움직인 만큼 흐르고, 가운데에 가까울수록 카드가 선형으로 커진다.
const track = root.querySelector('.strip__track');
const cards = [...track.children];
const total = cards.length;
const openBtn = root.querySelector('.hub-actions__open');
const bgPanels = [...root.querySelectorAll('.hub-bg__panel')];

// 읽기 버튼: 폭은 고정(줄 폭을 다 쓴다), 글자만 슬롯머신처럼 위로 넘어간다.
// 그래도 들어가지 않는 좁은 화면에서는 제목만 말줄임(…)으로 줄이고 '읽기'는 항상 보이게 한다.
let slotLabel = '';
function labelEl(title, cls = 'slot__text') {
  const el = document.createElement('span');
  el.className = cls;
  el.innerHTML = '<span class="slot__title"></span><span class="slot__verb">읽기</span>';
  el.firstChild.textContent = `〈${title}〉`;
  return el;
}
function setLabel(title) {
  if (title === slotLabel) return;
  const first = !slotLabel;
  slotLabel = title;
  const slot = openBtn.querySelector('.slot');
  if (first || reduceMotion) {
    slot.replaceChildren(labelEl(title));
    return;
  }
  const old = [...slot.children];
  const next = labelEl(title, 'slot__text is-next');
  slot.append(next);
  const opts = { duration: 520, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' };
  old.forEach((o) => o.animate([{ transform: getComputedStyle(o).transform === 'none' ? 'translateY(0)' : getComputedStyle(o).transform }, { transform: 'translateY(-110%)' }], opts).finished.then(() => o.remove()));
  next.animate([{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], opts).finished.then(() => next.classList.remove('is-next'));
}

let step = 0; // 카드 폭 + 간격
let x = 0; // 현재 위치(px)
let tx = 0; // 목표 위치(px)
let raf = 0;
let active = -1;
let ratio = 0; // 카드 몇 장만큼 와 있는지(화면 폭이 바뀌어도 같은 자리에 머물도록)
const fromBack = (() => {
  try {
    const v = sessionStorage.getItem('mungye:back');
    sessionStorage.removeItem('mungye:back');
    return Boolean(v);
  } catch {
    return false;
  }
})();

try {
  ratio = Number(sessionStorage.getItem('mungye:hub')) || 0;
} catch {
  /* */
}

const wrap = (v, m) => ((((v + m / 2) % m) + m) % m) - m / 2;

function measure() {
  const w = cards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
  if (step) ratio = x / step;
  step = w + gap;
  x = tx = ratio * step;
  render();
  // 작품 화면에서 돌아올 때 이 자리로 줄어들 수 있게 가운데 카드 자리를 남긴다
  const r = track.getBoundingClientRect();
  try {
    sessionStorage.setItem(
      'mungye:slot',
      JSON.stringify({ left: (innerWidth - w) / 2, top: r.top, width: w, height: track.offsetHeight, vw: innerWidth, vh: innerHeight }),
    );
  } catch {
    /* */
  }
}

function render() {
  const span = total * step;
  let best = 0;
  let bestD = Infinity;
  for (let k = 0; k < total; k++) {
    const off = wrap(k * step - x, span);
    const a = Math.abs(off) / step;
    const c = cards[k];
    c.style.transform = `translate3d(${off}px,0,0)`;
    // 가운데와의 거리에 비례(0~1)
    c.style.setProperty('--t', Math.max(0, 1 - a).toFixed(3));
    c.style.setProperty('--o', (off / step).toFixed(3)); // 카드 안 사진의 시차
    // 1.0~1.6장 거리에서 서서히 사라져 같은 작품이 두 번 보이지 않는다
    const vis = a <= 1 ? 1 : Math.max(0, (1.6 - a) / 0.6);
    c.style.opacity = vis.toFixed(3);
    c.style.visibility = vis === 0 ? 'hidden' : '';
    if (a < bestD) {
      bestD = a;
      best = k;
    }
  }
  if (best !== active) {
    if (active !== -1) ui.tick(); // 다음 카드가 가운데에 걸릴 때 가벼운 틱
    cards[active]?.classList.remove('is-active');
    cards[best].classList.add('is-active');
    active = best;
    const w = WORKS[best % n];
    openBtn.href = `${w.id}.html`;
    setLabel(w.title);
  }
  // 배경: 작품마다 한 장씩, 그 작품의 가장 가까운 카드와 함께 한 화면 폭씩 미끄러진다
  const near = new Array(n).fill(Infinity);
  for (let k = 0; k < total; k++) {
    const off = wrap(k * step - x, span);
    if (Math.abs(off) < Math.abs(near[k % n])) near[k % n] = off;
  }
  const vw = innerWidth;
  bgPanels.forEach((p, w) => {
    const o = (near[w] / step) * vw;
    p.style.transform = `translate3d(${o.toFixed(1)}px,0,0)`;
    p.style.visibility = Math.abs(o) >= vw ? 'hidden' : '';
  });
}

function tick() {
  const d = tx - x;
  x = Math.abs(d) < 0.3 ? tx : x + d * (reduceMotion ? 1 : 0.12);
  render();
  raf = x === tx ? 0 : requestAnimationFrame(tick);
  if (!raf) {
    try {
      sessionStorage.setItem('mungye:hub', String(x / step));
    } catch {
      /* */
    }
  }
}
function moveTo(v) {
  tx = v;
  if (!raf) raf = requestAnimationFrame(tick);
}
const go = (d) => moveTo((Math.round(tx / step) + d) * step);

// 휠·트랙패드: 굴린 만큼 그대로 흐른다
root.querySelector('.strip').addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    moveTo(tx + d * (e.deltaMode === 1 ? 30 : 1));
  },
  { passive: false },
);

// 끌기·스와이프(손을 뗀 속도만큼 더 흐른다)
let drag = null;
track.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  drag = { x0: e.clientX, t0: x, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, id: e.pointerId };
});
addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const now = performance.now();
  drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
  drag.lastX = e.clientX;
  drag.lastT = now;
  if (Math.abs(e.clientX - drag.x0) > 5) drag.moved = true;
  x = tx = drag.t0 - (e.clientX - drag.x0);
  render();
});
addEventListener('pointerup', () => {
  if (!drag) return;
  const { v, moved } = drag;
  drag = null;
  if (!moved) return;
  moveTo(tx - v * 260);
  track.addEventListener('click', (e) => e.preventDefault(), { capture: true, once: true });
});

// 옆 카드를 누르면 가운데로, 가운데 카드를 누르면 작품으로
cards.forEach((c, k) =>
  c.addEventListener('click', (e) => {
    const off = wrap(k * step - x, total * step);
    if (Math.abs(off) < step * 0.25) return;
    e.preventDefault();
    moveTo(x + off);
  }),
);
addEventListener('keydown', (e) => {
  if (!root.querySelector('.list').hidden) return;
  if (e.key === 'ArrowRight') go(1);
  if (e.key === 'ArrowLeft') go(-1);
});
addEventListener('resize', measure);

// 공모 소개 펼치기·접기. 펼쳐지는 동안 카드가 움직이므로, 끝나면 카드 위치를 다시 잰다
const aboutBtn = root.querySelector('.hub-about');
const lede = root.querySelector('.hub-lede');
aboutBtn.addEventListener('click', () => {
  const open = aboutBtn.getAttribute('aria-expanded') !== 'true';
  aboutBtn.setAttribute('aria-expanded', String(open));
  lede.classList.toggle('is-open', open);
});
lede.addEventListener('transitionend', (e) => e.propertyName === 'grid-template-rows' && measure());

// 카드 ↔ 목록 보기
const viewBtn = root.querySelector('[data-view]');
viewBtn.addEventListener('click', () => {
  const list = root.querySelector('.list');
  const toList = list.hidden;
  const swap = () => {
    list.hidden = !toList;
    root.querySelector('.strip').hidden = toList;
    openBtn.hidden = toList;
    viewBtn.setAttribute('aria-pressed', String(toList));
    viewBtn.setAttribute('aria-label', toList ? '카드로 보기' : '목록으로 보기');
    viewBtn.innerHTML = toList
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="4" width="10" height="16" rx="1.5"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>';
    if (!toList) measure();
  };
  if (document.startViewTransition && !reduceMotion) document.startViewTransition(swap);
  else swap();
});

measure();

// 첫 등장: 가운데부터 바깥쪽으로 차례로 아래에서 올라온다.
// 작품 화면에서 돌아온 경우에는 가운데 카드는 그대로 두고 나머지만 서서히 나타난다.
if (fromBack) {
  root.classList.add('is-back');
  // 한 번 그려진 다음 장면 시작(화면이 가려져 그리기가 멈춰도 진행되게 시간 제한)
  const nextFrame = (fn) => {
    let done = false;
    const run = () => !done && ((done = true), fn());
    requestAnimationFrame(() => requestAnimationFrame(run));
    setTimeout(run, 80);
  };
  ready.then(() => nextFrame(() => root.classList.add('is-back-in')));
} else if (!reduceMotion) {
  track.classList.add('is-intro');
  cards.forEach((c, k) => {
    const d = Math.abs(Math.round(wrap(k * step - x, total * step) / step));
    c.querySelector('.poster__link').style.setProperty('--intro', `${0.15 + d * 0.1}s`);
  });
  // 폰트가 준비된 뒤에 올라온다(도중에 글자가 바뀌며 깜빡이지 않게)
  ready.then(() => {
    let done = false;
    const start = () => !done && ((done = true), track.classList.remove('is-intro'));
    requestAnimationFrame(() => requestAnimationFrame(start));
    setTimeout(start, 80);
    setTimeout(() => cards.forEach((c) => c.querySelector('.poster__link').style.removeProperty('--intro')), 1700);
  });
}
