// 낭독 미리 듣기: Gemini 목소리로 만든 낭독만 모아 듣는 검토용 페이지.
// 작품 페이지와 따로 public/listen/ 의 음성을 쓴다(scripts/listen-copy.mjs 가 옮겨 둔다).
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './styles/base.css';
import './styles/listen.css';
import { createNarrator, loadNarration } from './lib/narrate.js';
import { WORKS, SITE, esc } from './lib/site.js';

const BASE = 'listen/tts/';
const contents = import.meta.glob('./content/{poem,novel,play}.json', { import: 'default' });
const SAMPLES = {
  poem: [{ file: 'poem-gemini-Charon.m4a', label: '1~2연 · 남성 목소리' }],
  novel: [
    { file: 'novel-gemini-Kore.m4a', label: '첫머리 · 여성 목소리 A' },
    { file: 'novel-gemini-Sulafat.m4a', label: '첫머리 · 여성 목소리 B' },
  ],
  play: [{ file: 'play-gemini-Leda-Algenib.m4a', label: '첫 대화 · 서윤(여) · 정호(남)' }],
};
const IDS = ['poem', 'novel', 'play'];
const store = {
  get: (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(`mungye:${k}`)) ?? d;
    } catch {
      return d;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(`mungye:${k}`, JSON.stringify(v));
    } catch {
      /* */
    }
  },
};

const app = document.getElementById('app');
app.innerHTML = `
  <header class="lh">
    <p class="lh__kicker">${esc(SITE.fullName)}</p>
    <h1 class="lh__title">낭독 미리 듣기</h1>
    <p class="lh__note">Google Gemini의 AI 목소리로 만든 낭독입니다. 본문은 지면에 실린 그대로이며, 숫자·기호만 소리 내어 읽기 좋게 바꿔 읽습니다. 검토용 페이지입니다.</p>
  </header>
  <main class="lw">
    ${IDS.map((id) => {
      const w = WORKS.find((x) => x.id === id);
      return `<section class="work" data-id="${id}">
        <p class="work__genre">${esc(w.genre)}</p>
        <h2 class="work__title">${esc(w.title)}</h2>
        <p class="work__by">${esc(w.author)} · ${esc(w.affiliation || '')}</p>
        <div class="work__full"><p class="work__status">전체 낭독을 불러오는 중…</p></div>
        <div class="work__samples">
          <p class="work__label">목소리 샘플</p>
          ${SAMPLES[id].map((s) => `<div class="sample"><p>${esc(s.label)}</p><audio controls preload="none" src="listen/samples/${s.file}"></audio></div>`).join('')}
        </div>
        <div class="reader" hidden></div>
      </section>`;
    }).join('')}
  </main>
  <footer class="lf">고대신문 2051호(2026년 11월 2일자) 수록작 · AI 낭독(Gemini)</footer>
  <div class="narrator" role="region" aria-label="낭독" hidden>
    <button type="button" data-n="prev" aria-label="이전 문단">${svg('<path d="M6.5 6v12"/><path d="M18 6.6v10.8a.6.6 0 0 1-.9.5L9.6 12.5a.6.6 0 0 1 0-1l7.5-5.4a.6.6 0 0 1 .9.5z" class="f"/>')}</button>
    <button type="button" class="narrator__main" data-n="toggle" aria-label="일시정지"></button>
    <button type="button" data-n="next" aria-label="다음 문단">${svg('<path d="M17.5 6v12"/><path d="M6 6.6v10.8a.6.6 0 0 0 .9.5l7.5-5.4a.6.6 0 0 0 0-1L6.9 6.1a.6.6 0 0 0-.9.5z" class="f"/>')}</button>
    <button type="button" class="narrator__rate" data-n="rate" aria-label="읽는 속도"></button>
    <button type="button" class="narrator__follow" data-n="follow" hidden>읽는 곳으로</button>
    <button type="button" data-n="close" aria-label="낭독 끄기">${svg('<path d="M7 7l10 10M17 7L7 17"/>')}</button>
  </div>`;

function svg(d) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
}
const PLAY = svg('<path d="M8 5.8v12.4a.8.8 0 0 0 1.2.7l9.9-6.2a.8.8 0 0 0 0-1.4L9.2 5.1a.8.8 0 0 0-1.2.7z" class="f"/>');
const PAUSE = svg('<rect x="6.5" y="5.5" width="3.6" height="13" rx="1" class="f"/><rect x="13.9" y="5.5" width="3.6" height="13" rx="1" class="f"/>');

// 본문(글자는 그대로, 감싸기만)
function blockHTML(b) {
  const a = `data-i="${b.i}"`;
  switch (b.t) {
    case 'stanza':
      return `<div class="stanza" ${a}>${b.lines.map((l) => `<span class="ln">${esc(l)}</span>`).join('')}</div>`;
    case 'break':
      return `<p class="sep" ${a}>*</p>`;
    case 'h':
    case 'scene':
      return `<h3 class="r-h" ${a}>${esc(b.text)}</h3>`;
    case 'stage':
    case 'dir':
      return `<p class="r-dir" ${a}>${esc(b.text)}</p>`;
    case 'line':
      return `<p class="r-line" ${a}><b>${esc(b.speaker)}</b> ${esc(b.text)}</p>${b.dir ? `<p class="r-dir">${esc(b.dir)}</p>` : ''}`;
    default:
      return `<p class="r-p" ${a}>${esc(b.text)}</p>`;
  }
}

const bar = document.querySelector('.narrator');
const mainBtn = bar.querySelector('[data-n="toggle"]');
const rateBtn = bar.querySelector('[data-n="rate"]');
const followBtn = bar.querySelector('[data-n="follow"]');
const paintRate = (r) => (rateBtn.textContent = `${Number.isInteger(r) ? r.toFixed(1) : r}×`);
let active = null; // { id, narrator }

async function setup(id) {
  const sec = app.querySelector(`.work[data-id="${id}"]`);
  const full = sec.querySelector('.work__full');
  const manifest = await loadNarration(id, BASE);
  if (!manifest) {
    full.innerHTML = '<p class="work__status">전체 낭독은 만드는 중이에요. 우선 아래 샘플로 목소리를 들어 보세요.</p>';
    return;
  }
  const mins = Math.round(manifest.chunks.reduce((n, c) => n + c.dur, 0) / 60000);
  full.innerHTML = `<button type="button" class="pill pill--primary" data-listen>${PLAY}<span>전체 듣기 · 약 ${mins}분</span></button>`;
  const reader = sec.querySelector('.reader');
  let narrator = null;
  full.querySelector('[data-listen]').addEventListener('click', async () => {
    if (!narrator) {
      const work = await contents[`./content/${id}.json`]();
      reader.innerHTML = work.blocks.map(blockHTML).join('');
      reader.hidden = false;
      narrator = createNarrator({
        manifest,
        base: BASE,
        unitEl: (k) => {
          if (k === 'title') return null;
          if (k.endsWith('d')) return reader.querySelector(`[data-i="${k.slice(0, -1)}"]`)?.nextElementSibling ?? null;
          return reader.querySelector(`[data-i="${k}"]`);
        },
        ensure: () => {},
        onState: (s) => {
          const on = s !== 'stopped' && s !== 'done';
          sec.classList.toggle('is-narrating', on);
          if (active?.id === id) {
            bar.hidden = !on;
            mainBtn.innerHTML = s === 'playing' ? PAUSE : PLAY;
            mainBtn.setAttribute('aria-label', s === 'playing' ? '일시정지' : '이어 듣기');
          }
        },
        onFollow: (f) => active?.id === id && (followBtn.hidden = f),
        topInset: () => 0,
        store,
        meta: { title: work.title, artist: work.author, album: SITE.fullName },
      });
    }
    if (active && active.id !== id) active.narrator.stop();
    active = { id, narrator };
    paintRate(narrator.rate);
    reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    await new Promise((r) => setTimeout(r, 500));
    narrator.state === 'stopped' ? narrator.start() : narrator.toggle();
  });
}
IDS.forEach(setup);

bar.addEventListener('click', (e) => {
  const b = e.target.closest('[data-n]');
  if (!b || !active) return;
  const n = active.narrator;
  const act = b.dataset.n;
  if (act === 'toggle') n.toggle();
  if (act === 'prev') n.prev();
  if (act === 'next') n.next();
  if (act === 'rate') paintRate(n.cycleRate());
  if (act === 'follow') n.refollow();
  if (act === 'close') n.stop();
});

// 샘플은 한 번에 하나만
document.addEventListener(
  'play',
  (e) => {
    if (e.target.tagName !== 'AUDIO') return;
    document.querySelectorAll('.sample audio').forEach((a) => a !== e.target && a.pause());
    if (active?.narrator.state === 'playing') active.narrator.toggle();
  },
  true,
);
