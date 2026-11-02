import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './styles/base.css';
import './styles/work.css';
import { CUES, PLAY_PAST, PLAY_SWITCH_AT } from './content/cues.js';
import { chaptersOf, renderWork } from './lib/render.js';
import { fillMedia, imageExists, resolveImage } from './lib/stage.js';
import { createFx } from './lib/fx.js';
import { WORKS, esc } from './lib/site.js';
import { fadeEverything, isEnabled, playSfx, preloadSfx, setEnabled, setTrack } from './lib/audio.js';
import { initTransitions } from './lib/transition.js';
import { ambience, bindUiSounds, fadeUi, ui } from './lib/synth.js';
import { preloadFonts } from './lib/fonts.js';
import { getProgress, setProgress } from './lib/progress.js';
import { restore as restoreLines, reveal as revealLines, split as splitLines } from './lib/lines.js';

gsap.registerPlugin(ScrollTrigger);

const contents = import.meta.glob('./content/*.json', { import: 'default' });
const workId = document.body.dataset.work;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k, d) {
    try {
      return JSON.parse(localStorage.getItem(`mungye:${k}`)) ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(`mungye:${k}`, JSON.stringify(v));
    } catch {
      /* 저장 불가 환경 */
    }
  },
};
if (import.meta.env.DEV || new URLSearchParams(location.search).has('debug')) {
  document.documentElement.dataset.debug = '';
}

const work = await contents[`./content/${workId}.json`]();
const app = document.getElementById('app');
const isPast = workId === 'play' ? (i) => PLAY_PAST.some(([a, b]) => i >= a && i <= b) : () => false;
app.innerHTML = renderWork(work, { isPast });
const chapters = chaptersOf(work);
const fx = createFx();
// 커버·다음 작품 썸네일만 바로 채우고, 본문 이미지는 가까이 왔을 때 받는다
fillMedia(app.querySelector('.cover'));
fillMedia(app.querySelector('.work-nav'));
// 이 페이지에 쓰인 글자의 폰트를 먼저 받아 둔다(움직이는 도중 깜빡임·줄 어긋남 방지)
const ready = preloadFonts({
  serif: [...app.querySelectorAll('.work-body, .afterword, .footnotes')].map((el) => el.textContent).join(''),
  sans: app.textContent,
});
const transitions = initTransitions({ ready });
bindUiSounds();
let textEls = []; // 줄 단위로 올라오는 글(아래에서 채운다)
const sceneEls = [...app.querySelectorAll('.cscene')]; // 평론의 장면들

// ── 아이콘 ────────────────────────────────────────────────
const I = {
  back: '<path d="M15.5 5l-7 7 7 7"/>',
  on: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" class="f"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  off: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" class="f"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  toc: '<path d="M5 7h14M5 12h14M5 17h9"/>',
  text: '<path d="M3.75 18l4.5-12 4.5 12M5.4 14h5.7M14.5 18l2.875-7.5L20.25 18M15.45 15.6h3.85"/>',
  share: '<path d="M12 4v11M8 8l4-4 4 4"/><path d="M6 12v6.5h12V12"/>',
  prev: '<path d="M15 6l-6 6 6 6"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

// ── 상단 바: 장 진행 막대 / 뒤로 · 제목 · 목차·글자·소리·공유 ──
document.body.insertAdjacentHTML(
  'beforeend',
  `<div class="topbar">
     <div class="segments" role="navigation" aria-label="장 이동">
       ${chapters.map((c, n) => `<button type="button" class="seg" data-seg="${n}" title="${esc(c.label)}" aria-label="${esc(c.label)}로 이동"><span></span></button>`).join('')}
     </div>
     <div class="topbar__row">
       <a class="circle" href="./" data-back aria-label="작품 목록으로">${icon('back')}</a>
       <p class="topbar__title"><strong>${esc(work.title)}</strong><span class="topbar__chapter" aria-live="polite"></span></p>
       <div class="topbar__tools">
         <button type="button" class="circle" data-open="toc" aria-label="목차" aria-expanded="false">${icon('toc')}</button>
         <button type="button" class="circle" data-open="type" aria-label="글자 크기" aria-expanded="false">${icon('text')}</button>
         <button type="button" class="circle" data-sound-toggle aria-label="소리 켜기">${icon('off')}</button>
         <button type="button" class="circle" data-share aria-label="공유하기">${icon('share')}</button>
       </div>
     </div>
   </div>
   <div class="sheet" data-sheet="toc" hidden>
     <p class="sheet__title">목차</p>
     <ol class="toc">${chapters.map((c, n) => `<li><button type="button" data-seg="${n}">${esc(c.label)}</button></li>`).join('')}</ol>
   </div>
   <div class="sheet sheet--small" data-sheet="type" hidden>
     <p class="sheet__title">글자 크기</p>
     <div class="sizes" role="radiogroup" aria-label="글자 크기">
       ${[0, 1, 2, 3].map((s) => `<button type="button" role="radio" data-size="${s}" style="font-size:${15 + s * 2}px">가</button>`).join('')}
     </div>
   </div>
   <div class="toast" role="status" aria-live="polite"></div>`,
);

// 상단 바 높이(전구가 바로 아래에 붙는다)
const setTopbarH = () => document.documentElement.style.setProperty('--topbar-h', `${document.querySelector('.topbar').offsetHeight}px`);
setTopbarH();
addEventListener('resize', setTopbarH);

const toastEl = document.querySelector('.toast');
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2000);
}

// 소리
const soundBtn = document.querySelector('[data-sound-toggle]');
function paintSound() {
  const on = isEnabled();
  soundBtn.innerHTML = icon(on ? 'on' : 'off');
  soundBtn.setAttribute('aria-label', on ? '소리 끄기' : '소리 켜기');
  soundBtn.setAttribute('aria-pressed', String(on));
}
soundBtn.addEventListener('click', () => {
  setEnabled(!isEnabled());
  ui.toggle(isEnabled());
  if (isEnabled()) ambience(currentFx);
  if (isEnabled()) preloadSfx([...new Set((CUES[workId] || []).map((c) => c.sfx).filter(Boolean))]);
  paintSound();
  toast(isEnabled() ? '소리를 켰어요' : '소리를 껐어요');
});
paintSound();

// 공유
document.querySelector('[data-share]').addEventListener('click', async () => {
  const data = { title: `${work.title} · ${work.author}`, text: `고대신문 창간 79주년 문예공모 ${work.genre} 부문 당선작`, url: location.href.split('?')[0] };
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch {
      /* 취소 */
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(data.url);
    toast('링크를 복사했어요');
  } catch {
    toast('주소창의 링크를 복사해 주세요');
  }
});

// 시트(목차·글자 크기)
function closeSheets() {
  document.querySelectorAll('.sheet').forEach((s) => (s.hidden = true));
  document.querySelectorAll('[data-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
}
document.querySelectorAll('[data-open]').forEach((btn) =>
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const sheet = document.querySelector(`[data-sheet="${btn.dataset.open}"]`);
    const willOpen = sheet.hidden;
    closeSheets();
    sheet.hidden = !willOpen;
    btn.setAttribute('aria-expanded', String(willOpen));
  }),
);
document.addEventListener('click', (e) => !e.target.closest('.sheet') && closeSheets());
addEventListener('keydown', (e) => e.key === 'Escape' && closeSheets());

// 글자 크기
function applySize(s) {
  resetPendingLines();
  document.documentElement.style.setProperty('--fs-step', s);
  document.querySelectorAll('[data-size]').forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.size) === s)));
  ScrollTrigger.refresh();
}
document.querySelectorAll('[data-size]').forEach((b) =>
  b.addEventListener('click', () => {
    applySize(Number(b.dataset.size));
    store.set('size-picked', Number(b.dataset.size)); // 직접 고른 크기만 기억한다
  }),
);
// 기본 글자 크기: 휴대폰은 가장 작은 단계, 그 밖은 두 번째 단계. 직접 고른 적이 있으면 그 크기.
applySize(store.get('size-picked', null) ?? (matchMedia('(max-width: 640px)').matches ? 0 : 1));

const scrollToEl = (el, ratio = 0.16) =>
  scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * ratio, behavior: 'instant' });
// 장면을 건너뛸 때는 커튼으로 화면을 닦고 그 사이에 자리를 옮긴다
const jumpTo = (el, ratio) => transitions.wipe(() => scrollToEl(el, ratio));

// ── 시작(커버) ────────────────────────────────────────────
document.documentElement.classList.add('is-gated');
// 지난번에 읽던 곳이 있으면 '이어서 / 처음부터'를 고를 수 있게 한다
const saved = getProgress(workId);
const resumeEl = app.querySelector('.resume');
let resume = Boolean(saved && saved.pct >= 0.03 && saved.pct < 0.97 && app.querySelector(`[data-i="${saved.i}"]`));
if (resume) {
  resumeEl.hidden = false;
  resumeEl.querySelector('.resume__where').textContent = `${saved.label || '읽던 곳'} · ${Math.round(saved.pct * 100)}%`;
  resumeEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-resume]');
    if (!b) return;
    resume = b.dataset.resume === 'yes';
    resumeEl.querySelectorAll('[data-resume]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
  });
}
app.querySelector('.cover').addEventListener('click', (e) => {
  const b = e.target.closest('[data-start]');
  if (!b) return;
  setEnabled(b.dataset.start === 'on');
  paintSound();
  if (isEnabled()) preloadSfx([...new Set((CUES[workId] || []).map((c) => c.sfx).filter(Boolean)), ...(workId === 'play' ? ['sfx-switch'] : [])]);
  transitions.wipe(() => {
    if (resume) {
      if (sceneEls.length && saved.scene != null) applyScene(saved.scene);
      scrollToEl(app.querySelector(`[data-i="${saved.i}"]`), 0.3);
    } else scrollToEl(app.querySelector('.cast, .work-body'), 0.1);
    document.documentElement.classList.remove('is-gated');
    document.body.classList.add('is-reading');
    setTopbarH();
  });
});

// ── 등장 애니메이션 ───────────────────────────────────────
// 글(.rt)은 화면에 들어오기 조금 전에 줄을 나눠 두었다가, 들어오면 한 줄씩 올린다.
const TEXT = '.work-body .para, .work-body .stage-desc, .work-body .dir, .afterword > .para, .footnotes li';
const BOX =
  '.work-body .line, .work-body .scene-break, .work-body .play-end, .scene-nav, .afterword > .kicker, .afterword > .afterword__title, .afterword > .afterword__sign, .cast .kicker, .cast__item, .footnotes .kicker, .work-nav .kicker, .next-card, .work-nav li, .site-foot';
const MOTION = '.work-body .media, .work-body .stanza, .scene-h, .section-h';
textEls = [...app.querySelectorAll(TEXT)];
textEls.forEach((el) => el.classList.add('rt'));
app.querySelectorAll(BOX).forEach((el) => el.classList.add('rv'));
// 목록처럼 이어지는 상자는 차례로
app.querySelectorAll('.cast__list, .work-nav ul').forEach((list) => [...list.children].forEach((c, k) => c.style.setProperty('--d', k)));

// 이미지는 가까이 왔을 때 받아 두고, 다 받은 뒤에만 올린다(빈 상자가 먼저 올라왔다가 사진이 툭 뜨지 않게)
const mediaReady = new WeakMap();
function prepMedia(el) {
  const img = el.querySelector('[data-media]') || (el.dataset.media ? el : null);
  if (!img || mediaReady.has(el)) return mediaReady.get(el);
  const job = resolveImage(img.dataset.media).then((url) => {
    if (url) img.style.backgroundImage = `url("${url}")`;
    img.classList.toggle('is-placeholder', !url);
  });
  mediaReady.set(el, job);
  return job;
}
const showIO = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target;
      showIO.unobserve(el);
      prepIO.unobserve(el);
      if (el.classList.contains('rt')) revealLines(el);
      else if (el.querySelector('[data-media]') || el.dataset.media) {
        // 사진이 늦어도 1.2초 안에는 올린다
        Promise.race([prepMedia(el), new Promise((r) => setTimeout(r, 1200))]).then(() => el.classList.add('is-in'));
      } else el.classList.add('is-in');
    }
  },
  { rootMargin: '0px 0px -6% 0px' },
);
const prepIO = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target;
      if (el.classList.contains('rt') && !el.classList.contains('is-in')) splitLines(el);
      else prepMedia(el);
    }
  },
  { rootMargin: '0px 0px 60% 0px' },
);
function observeReveal(scope) {
  scope.querySelectorAll(`.rt, .rv, ${MOTION}`).forEach((el) => {
    if (reduceMotion) {
      prepMedia(el);
      return el.classList.add('is-in');
    }
    showIO.observe(el);
    if (el.classList.contains('rt') || el.querySelector('[data-media]')) prepIO.observe(el);
  });
}
// 글자 크기나 화면 폭이 바뀌면 나눠 둔 줄을 모두 원래 문단으로 되돌린다
// (이미 올라온 글은 그대로 보이고, 아직 안 올라온 글은 들어올 때 다시 나눈다)
function resetPendingLines() {
  textEls.forEach((el) => restoreLines(el));
}
let resizeTimer;
let lastW = innerWidth;
addEventListener('resize', () => {
  // 휴대폰 주소창이 접히며 높이만 바뀌는 경우는 무시한다(그때마다 줄을 다시 짜면 튄다)
  if (innerWidth === lastW) return;
  lastW = innerWidth;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resetPendingLines, 150);
});
// 폰트가 준비된 뒤에 줄을 나누기 시작한다(대체 글꼴 기준으로 나누면 나중에 줄이 어긋나 튄다)
// 아직 만들지 않은 이미지 자리는 배포 화면에서 빈 상자로 보이지 않게 미리 빼 둔다
// (개발 화면에서는 '이미지 자리' 표시를 위해 남긴다). 커버가 화면을 덮고 있는 동안 처리해 튀지 않는다.
const mediaChecked = document.documentElement.hasAttribute('data-debug')
  ? Promise.resolve()
  : Promise.all(
      [...app.querySelectorAll('.work-body .media')].map(async (m) => {
        if (!(await imageExists(m.querySelector('[data-media]').dataset.media))) m.remove();
      }),
    );
Promise.all([ready, mediaChecked]).then(() => {
  ScrollTrigger.refresh();
  observeReveal(app);
});

// ── 큐(음악·효과) ─────────────────────────────────────────
const resolved = [];
{
  let prev = { audio: null, volume: 1, fx: null };
  for (const c of CUES[workId] || []) {
    prev = {
      at: c.at,
      audio: 'audio' in c ? c.audio : prev.audio,
      volume: c.volume ?? prev.volume,
      fx: 'fx' in c ? c.fx : prev.fx,
      pulse: c.pulse,
      sfx: c.sfx,
    };
    resolved.push(prev);
  }
}
let currentFx = null;
function apply(idx, entering = false) {
  const c = resolved[Math.max(0, idx)];
  if (!c) return;
  setTrack(c.audio, c.volume);
  fx.set(c.fx);
  // 비·눈 장면에는 빗소리·바람 소리를 함께 깐다
  currentFx = c.fx;
  if (isEnabled()) ambience(c.fx);
  if (entering) {
    fx.pulse(c.pulse);
    playSfx(c.sfx);
  }
}
function anchorOf(at) {
  if (typeof at !== 'number') return app.querySelector(`[data-cue-anchor="${at}"]`);
  const el = app.querySelector(`[data-i="${at}"]`);
  const prev = el?.previousElementSibling;
  return prev?.classList.contains('media') ? prev : el;
}
// 효과·음악은 그 문장이 화면 가운데에 닿을 때 바뀐다.
// 화면에 나와 있는 문장에만 걸고, 장면이 바뀌거나 잠금이 풀리면 다시 건다.
let cueTriggers = [];
let playUnlocked = workId !== 'play';
const cueEl = (at) => (typeof at === 'number' ? app.querySelector(`[data-i="${at}"]`) : anchorOf(at));
function bindCues() {
  cueTriggers.forEach((t) => t.kill());
  cueTriggers = [];
  resolved.forEach((c, idx) => {
    if (!playUnlocked && (typeof c.at !== 'number' || c.at >= PLAY_SWITCH_AT)) return;
    const el = cueEl(c.at);
    if (!el || el.offsetParent === null) return;
    cueTriggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        onEnter: () => apply(idx, true),
        onLeaveBack: () => apply(idx - 1),
      }),
    );
  });
}
bindCues();
apply(0);

// ── 장 진행 막대 ───────────────────────────────────────────
const segEls = [...document.querySelectorAll('.segments .seg')];
let segTops = [];
const chapterEl = (c) => anchorOf(c.at);
let currentScene = 0; // 평론에서 지금 보고 있는 장면
function measureSegments() {
  segTops = chapters.map((c) => {
    const el = chapterEl(c);
    return el && el.offsetParent !== null ? el.getBoundingClientRect().top + scrollY : Infinity;
  });
  segTops.push(app.querySelector('.work-nav').getBoundingClientRect().top + scrollY);
}
let segQueued = false;
const chapterLabelEl = document.querySelector('.topbar__chapter');
let lastChapter = -1;
let saveTimer = 0;
function paintSegments() {
  segQueued = false;
  const y = scrollY + innerHeight * 0.4;
  // 상단 바에 지금 읽고 있는 장면 이름
  let cur = 0;
  segTops.forEach((t, n) => n < chapters.length && t !== Infinity && t <= y && (cur = n));
  if (workId === 'critique' && cur < sceneEls.length) cur = currentScene;
  if (cur !== lastChapter) {
    lastChapter = cur;
    chapterLabelEl.textContent = chapters[cur]?.label === '처음' ? '' : chapters[cur]?.label || '';
  }
  // 읽은 위치 저장(메인 카드의 진도와 이어 읽기에 쓴다)
  if (document.body.classList.contains('is-reading')) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveProgress(chapters[cur]?.label), 300);
  }
  segEls.forEach((s, n) => {
    if (workId === 'critique' && n < sceneEls.length && n !== currentScene) {
      s.style.setProperty('--p', n < currentScene ? 1 : 0);
      return;
    }
    const a = segTops[n];
    const b = segTops.slice(n + 1).find((t) => t !== Infinity) ?? a;
    const p = a === Infinity ? 0 : Math.min(1, Math.max(0, (y - a) / Math.max(1, b - a)));
    s.style.setProperty('--p', p.toFixed(3));
  });
}
ScrollTrigger.addEventListener('refresh', () => {
  measureSegments();
  paintSegments();
});
addEventListener(
  'scroll',
  () => {
    if (!segQueued) {
      segQueued = true;
      requestAnimationFrame(paintSegments);
    }
  },
  { passive: true },
);
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-seg]');
  if (!b) return;
  const n = Number(b.dataset.seg);
  closeSheets();
  if (workId === 'critique') {
    if (n < sceneEls.length) return showScene(n);
    if (currentScene !== sceneEls.length - 1) return showScene(sceneEls.length - 1, chapterEl(chapters[n]));
  }
  const el = chapterEl(chapters[n]);
  if (!el || el.offsetParent === null) return toast('스위치를 누른 뒤에 볼 수 있어요');
  jumpTo(el);
});

// ── 평론: 장면 넘기기 ─────────────────────────────────────
function applyScene(k) {
  currentScene = k;
  sceneEls.forEach((el, j) => el.classList.toggle('is-current', j === k));
  document.body.classList.toggle('is-last-scene', k === sceneEls.length - 1);
  paintSceneCtrl();
  ScrollTrigger.refresh();
  bindCues();
}
function showScene(k, target) {
  if (k < 0 || k >= sceneEls.length) return;
  const go = () => {
    currentScene = k;
    sceneEls.forEach((el, j) => el.classList.toggle('is-current', j === k));
    document.body.classList.toggle('is-last-scene', k === sceneEls.length - 1);
    paintSceneCtrl();
    ScrollTrigger.refresh();
    bindCues();
    // 이 장면 첫 문장까지의 음악·효과 상태로 맞춘다
    const first = Number(sceneEls[k].querySelector('[data-i]').dataset.i);
    let idx = 0;
    resolved.forEach((c, j) => typeof c.at === 'number' && c.at <= first && (idx = j));
    apply(idx);
    const el = target || sceneEls[k];
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - (document.querySelector('.topbar').offsetHeight + 28), behavior: 'instant' });
  };
  if (k === currentScene && target) return jumpTo(target);
  transitions.wipe(go);
}
let paintSceneCtrl = () => {};
if (sceneEls.length) {
  sceneEls[0].classList.add('is-current');
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="scene-ctrl" role="group" aria-label="장면 넘기기">
       <button type="button" class="circle" data-scene-step="-1" aria-label="이전 장">${icon('prev')}</button>
       <span class="scene-ctrl__count" aria-live="polite"></span>
       <button type="button" class="circle" data-scene-step="1" aria-label="다음 장">${icon('next')}</button>
     </div>`,
  );
  const ctrl = document.querySelector('.scene-ctrl');
  // 맨 아래 '처음으로' 버튼이 화면에 들어오면 장 넘기기 버튼을 아래로 내려 겹치지 않게 한다
  new IntersectionObserver(([en]) => ctrl.classList.toggle('is-away', en.isIntersecting)).observe(
    app.querySelector('.site-foot [data-back]'),
  );
  paintSceneCtrl = () => {
    ctrl.querySelector('.scene-ctrl__count').textContent = `${currentScene + 1} / ${sceneEls.length}`;
    ctrl.querySelector('[data-scene-step="-1"]').disabled = currentScene === 0;
    ctrl.querySelector('[data-scene-step="1"]').disabled = currentScene === sceneEls.length - 1;
  };
  paintSceneCtrl();
  ctrl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-scene-step]');
    if (b) showScene(currentScene + Number(b.dataset.sceneStep));
  });
  app.addEventListener('click', (e) => {
    const b = e.target.closest('[data-scene-go]');
    if (b) showScene(Number(b.dataset.sceneGo));
  });
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea') || !document.body.classList.contains('is-reading')) return;
    if (e.key === 'ArrowRight') showScene(currentScene + 1);
    if (e.key === 'ArrowLeft') showScene(currentScene - 1);
  });
}

// ── 평론: 각주 펼치기 ──────────────────────────────────────
if (work.footnotes) {
  app.addEventListener('click', (e) => {
    const ref = e.target.closest('.fn-ref');
    if (!ref) return;
    const para = ref.closest('.para');
    const n = ref.dataset.fn;
    const open = para.nextElementSibling?.dataset.fnNote === n;
    app.querySelectorAll('.fn-note').forEach((x) => x.remove());
    app.querySelectorAll('.fn-ref[aria-expanded="true"]').forEach((x) => x.setAttribute('aria-expanded', 'false'));
    if (!open) {
      const note = document.createElement('aside');
      note.className = 'fn-note';
      note.dataset.fnNote = n;
      note.innerHTML = `<b>${n}</b> ${esc(work.footnotes.find((f) => String(f.n) === n).text)}`;
      para.after(note);
      ref.setAttribute('aria-expanded', 'true');
    }
    ScrollTrigger.refresh();
  });
}

// ── 희곡: 전구와 스위치 ────────────────────────────────────
if (workId === 'play') {
  document.body.classList.add('bulb-on', 'play-locked');
  document.body.insertAdjacentHTML('beforeend', `<div class="bulb" aria-hidden="true"></div>`);
  app.querySelectorAll('.work-body > *').forEach((el) => {
    const i = Number(el.dataset.i ?? el.nextElementSibling?.dataset.i);
    if (i >= PLAY_SWITCH_AT) el.dataset.locked = '';
  });
  const gateEl = anchorOf(PLAY_SWITCH_AT);
  gateEl.insertAdjacentHTML(
    'beforebegin',
    `<div class="switch-cue">
       <button class="switch" type="button" aria-label="스위치를 눌러 전구 끄기">
         <span class="switch__plate"><span class="switch__toggle"></span></span>
       </button>
       <p class="switch-cue__hint">스위치를 직접 눌러 불을 꺼 주세요</p>
     </div>`,
  );
  const cue = app.querySelector('.switch-cue');
  cue.classList.add('rv');
  if (reduceMotion) cue.classList.add('is-in');
  else showIO.observe(cue);
  const sw = cue.querySelector('.switch');
  sw.addEventListener(
    'click',
    () => {
      sw.classList.add('is-off');
      sw.disabled = true;
      playSfx('sfx-switch');
      document.body.classList.remove('bulb-on');
      fx.pulse('blackout');
      setTimeout(() => {
        document.body.classList.remove('play-locked');
        document.body.classList.add('is-morning');
        cue.querySelector('.switch-cue__hint').textContent = '';
        ScrollTrigger.refresh();
        playUnlocked = true;
        bindCues();
        apply(resolved.findIndex((c) => c.at === PLAY_SWITCH_AT));
        scrollTo({ top: gateEl.getBoundingClientRect().top + scrollY - innerHeight * 0.3, behavior: reduceMotion ? 'auto' : 'smooth' });
      }, 900);
    },
    { once: true },
  );
}

document.fonts?.ready.then(() => ScrollTrigger.refresh());

// ── 메인으로 돌아가기: 지금 화면을 그대로 둔 채 사방을 잘라 메인의 카드 자리로 줄인다 ──
function hubSlot() {
  try {
    const r = JSON.parse(sessionStorage.getItem('mungye:slot'));
    if (r && r.vw === innerWidth && r.vh === innerHeight) return r;
  } catch {
    /* */
  }
  // 저장된 자리가 없으면 메인 화면의 카드 크기 규칙으로 계산
  const w = Math.min(innerWidth * 0.68, Math.max(240, Math.min(innerWidth * 0.21, 300)));
  const h = Math.min(w * 1.42, innerHeight - 260);
  return { left: (innerWidth - w) / 2, top: (innerHeight - h) / 2 - 30, width: w, height: h };
}
async function collapseToHub() {
  const meta = WORKS.find((w) => w.id === workId);
  const idx = WORKS.indexOf(meta);
  try {
    sessionStorage.setItem('mungye:hub', String(idx));
    sessionStorage.setItem('mungye:back', '1');
  } catch {
    /* */
  }
  ui.whoosh('out');
  fadeEverything(700); // 배경음악·효과음이 화면이 줄어드는 동안 함께 잦아든다
  setTimeout(() => fadeUi(220), 820);
  if (reduceMotion) return location.assign('./');
  const r = hubSlot();
  const vw = document.documentElement.clientWidth;
  const H = app.offsetHeight;
  const y = scrollY;
  const dark = '#0c0d10';
  // 페이지 바탕을 잘려 들어가는 화면 쪽에 붙여 둔다. 바깥만 메인 화면의 어두운 색이 되어
  // (본문이 투명해져 화면 전체가 까맣게 보이지 않고) 줄어드는 모양이 또렷하게 보인다.
  app.style.background = getComputedStyle(document.body).backgroundColor;
  document.documentElement.style.background = dark;
  document.body.style.background = dark;
  document.body.classList.add('is-collapsing');
  const from = `inset(${y}px 0px ${Math.max(0, H - y - innerHeight)}px 0px round 0px)`;
  const to = `inset(${y + r.top}px ${vw - r.left - r.width}px ${Math.max(0, H - y - r.top - r.height)}px ${r.left}px round 6px)`;
  await app.animate([{ clipPath: from }, { clipPath: to }], { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }).finished;
  // 줄어든 자리에 메인 카드의 썸네일이 서서히 떠오른다
  const thumb = document.createElement('div');
  thumb.className = `collapse-thumb is-placeholder`;
  thumb.dataset.media = meta.cover;
  Object.assign(thumb.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  const url = await resolveImage(meta.cover);
  if (url) {
    thumb.style.backgroundImage = `url("${url}")`;
    thumb.classList.remove('is-placeholder');
  }
  document.body.append(thumb);
  await thumb.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out', fill: 'forwards' }).finished;
  location.assign('./');
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-back]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  collapseToHub();
});

// ── 읽은 위치 저장 ─────────────────────────────────────────
function saveProgress(label) {
  const bar = document.querySelector('.topbar').offsetHeight;
  const blocks = app.querySelectorAll('.work-body [data-i]');
  let i = 0;
  for (const el of blocks) {
    if (el.offsetParent === null) continue;
    if (el.getBoundingClientRect().top > bar) {
      i = Number(el.dataset.i);
      break;
    }
  }
  const span = (from, to) => Math.min(1, Math.max(0, (scrollY - from) / Math.max(1, to - from)));
  const top = (el) => el.getBoundingClientRect().top + scrollY;
  const navTop = top(app.querySelector('.work-nav')) - innerHeight;
  let pct;
  if (sceneEls.length) {
    // 평론: 장면 수로 나눈 몫 + 지금 장면 안에서 읽은 만큼
    const sc = sceneEls[currentScene];
    const last = currentScene === sceneEls.length - 1;
    const inScene = span(top(sc), last ? navTop : top(sc) + sc.offsetHeight - innerHeight);
    pct = (currentScene + inScene) / sceneEls.length;
  } else pct = span(top(app.querySelector('.cast, .work-body')), navTop);
  setProgress(workId, { i, pct: Number(pct.toFixed(3)), label: label === '처음' ? '' : label, scene: sceneEls.length ? currentScene : undefined });
}

