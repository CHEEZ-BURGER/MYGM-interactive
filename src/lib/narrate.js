// 낭독: 미리 만들어 둔 음성(public/media/tts)을 틀고, 지금 읽는 줄을 밝히며 화면이 따라 내려간다.
// 음성 파일과 위치표는 scripts/tts.mjs 가 만든다. 위치표가 없으면 이 기능은 드러나지 않는다.
import { registerFader, setDuck } from './audio.js';

const RATES = [1, 1.15, 1.3, 0.85];

/** 이 작품의 낭독 위치표가 있으면 받아 온다(없으면 null) */
export async function loadNarration(workId, base = 'media/tts/') {
  try {
    const r = await fetch(`${base}${workId}.json`);
    // 개발 서버는 없는 파일에도 HTML을 돌려주므로 형식까지 확인한다
    if (!r.ok || !(r.headers.get('content-type') || '').includes('json')) return null;
    const m = await r.json();
    return m.chunks?.length ? m : null;
  } catch {
    return null;
  }
}

/**
 * @param {object} o
 * @param {object} o.manifest  loadNarration 결과
 * @param {(k: string) => Element|null} o.unitEl  낭독 단위 → 화면의 요소
 * @param {(el: Element) => (Promise|'wait'|void)} o.ensure  화면에 안 보이는 요소를 보이게(평론 장면 넘기기). 'wait'이면 멈춰 기다린다(희곡 스위치)
 * @param {(state: string) => void} o.onState  'playing' | 'paused' | 'waiting' | 'stopped'
 * @param {(follow: boolean) => void} o.onFollow
 * @param {() => number} o.topInset  상단 바 높이
 * @param {{ get: Function, set: Function }} o.store
 * @param {MediaMetadataInit} o.meta
 * @param {string} [o.base]  음성 파일이 있는 폴더
 */
export function createNarrator({ manifest, unitEl, ensure, onState, onFollow, topInset, store, meta, base = 'media/tts/' }) {
  // 모든 단위를 한 줄로: 몇 번째 파일의 몇 ms부터인지
  // 읽는 순서대로. 희곡처럼 대사와 지문이 다른 파일에 있으면 단위마다 파일을 오간다.
  const units = manifest.units
    ? manifest.units.map((u) => ({ ...u, ci: u.c }))
    : manifest.chunks.flatMap((c, ci) => c.units.map((u) => ({ ...u, ci })));
  let jumping = false;
  const audio = new Audio();
  audio.preload = 'auto';
  let ci = -1; // 지금 걸린 파일
  let ui = -1; // 지금 읽는 단위
  let state = 'stopped';
  let follow = true;
  let raf = 0;
  let rate = store.get('narrate-rate', 1);
  let speakingEl = null;
  let lineEl = null;
  let programmaticUntil = 0;
  let waitingFor = -1; // 잠겨 있어 기다리는 단위
  let fadeTimer = 0;

  const setState = (s) => {
    state = s;
    onState(s);
    setDuck(s === 'playing');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = s === 'playing' ? 'playing' : 'paused';
  };

  function load(n) {
    if (n === ci) return;
    ci = n;
    audio.src = `${base}${manifest.chunks[n].src}`;
    audio.playbackRate = rate;
    audio.preservesPitch = true;
  }

  /** k번째 단위부터 읽는다 */
  async function seek(k, { play = true } = {}) {
    k = Math.max(0, Math.min(units.length - 1, k));
    const u = units[k];
    const el = unitEl(u.k);
    if (el && el.offsetParent === null) {
      const r = ensure(el);
      if (r === 'wait') return wait(k);
      if (r) await r;
    }
    load(u.ci);
    if (audio.readyState < 1) await new Promise((r) => audio.addEventListener('loadedmetadata', r, { once: true }));
    audio.currentTime = u.t / 1000;
    mark(k);
    if (play) {
      clearTimeout(fadeTimer);
      audio.volume = 1;
      try {
        await audio.play();
      } catch {
        return setState('paused');
      }
      setState('playing');
      loop();
    }
  }

  // 잠긴 곳 앞에서 멈춰 기다린다(밝힌 곳은 그대로 두어 다음 버튼으로 넘어가지 않게)
  function wait(k) {
    audio.pause();
    cancelAnimationFrame(raf);
    waitingFor = k;
    setState('waiting');
  }

  /** 잠김이 풀렸을 때(희곡 스위치) 기다리던 곳부터 */
  function resumeWaiting() {
    if (state !== 'waiting' || waitingFor < 0) return;
    const k = waitingFor;
    waitingFor = -1;
    setTimeout(() => seek(k), 600);
  }

  function clearMarks() {
    speakingEl?.classList.remove('is-speaking');
    lineEl?.classList.remove('is-spoken');
    speakingEl = lineEl = null;
  }

  function mark(k) {
    if (k === ui && speakingEl) return;
    ui = k;
    clearMarks();
    speakingEl = unitEl(units[k].k);
    speakingEl?.classList.add('is-speaking');
  }

  // 원문 글자 위치 → 그 글자가 들어 있는 줄
  function lineAt(el, offset) {
    const lines = el.querySelectorAll(':scope > .ln');
    if (!lines.length) return null;
    const verse = el.classList.contains('stanza');
    let n = 0;
    for (const ln of lines) {
      n += ln.textContent.length + (verse ? 1 : 0);
      if (offset < n) return ln;
    }
    return lines[lines.length - 1];
  }

  function frame() {
    if (state !== 'playing') return;
    const ms = audio.currentTime * 1000;
    // 지금 단위가 끝나면 읽는 순서의 다음 단위로. 같은 파일에서 바로 이어지면 그대로 두고,
    // 다른 파일(희곡의 지문 ↔ 대사)이거나 떨어져 있으면 그리로 옮긴다.
    const cur = units[ui];
    if (!jumping && cur && cur.ci === ci && ms >= cur.e - 15 && units[ui + 1]) {
      const nx = units[ui + 1];
      if (nx.ci !== ci || Math.abs(nx.t - cur.e) > 5) {
        jumping = true;
        seek(ui + 1).finally(() => (jumping = false));
        return;
      }
      const el = unitEl(nx.k);
      if (el && el.offsetParent === null) {
        const r = ensure(el);
        if (r === 'wait') return wait(ui + 1);
      }
      mark(ui + 1);
    }
    // 단어 → 줄
    const u = units[ui];
    if (speakingEl && u?.w?.length) {
      let off = 0;
      for (const [t, o] of u.w) {
        if (t > ms) break;
        off = o;
      }
      const ln = lineAt(speakingEl, off);
      if (ln !== lineEl) {
        lineEl?.classList.remove('is-spoken');
        lineEl = ln;
        lineEl?.classList.add('is-spoken');
      }
    }
    if (follow) keepInView(lineEl || speakingEl);
  }

  function loop() {
    cancelAnimationFrame(raf);
    const step = () => {
      frame();
      if (state === 'playing') raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  // 탭이 가려져 그리기가 멈춰도 위치는 따라간다
  audio.addEventListener('timeupdate', () => document.hidden && frame());

  function keepInView(el) {
    if (!el || el.offsetParent === null) return;
    const r = el.getBoundingClientRect();
    const top = topInset() + innerHeight * 0.1;
    const bottom = innerHeight * 0.68;
    if (r.top >= top && r.bottom <= bottom) return;
    programmaticUntil = performance.now() + 1200;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({ top: r.top + scrollY - innerHeight * 0.36, behavior: reduce ? 'auto' : 'smooth' });
  }

  // 파일 하나가 끝나면 다음 파일로
  audio.addEventListener('ended', () => {
    if (state !== 'playing' || jumping) return;
    if (!units[ui + 1]) {
      stop();
      onState('done');
      return;
    }
    jumping = true;
    seek(ui + 1).finally(() => (jumping = false));
  });

  // 직접 스크롤하면 따라가기를 멈춘다
  const userScroll = () => {
    if (state === 'stopped' || performance.now() < programmaticUntil) return;
    if (follow) {
      follow = false;
      onFollow(false);
    }
  };
  addEventListener('wheel', userScroll, { passive: true });
  addEventListener('touchmove', userScroll, { passive: true });
  addEventListener('keydown', (e) => ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key) && userScroll());

  /** 화면에서 지금 보이는 첫 단위 */
  function firstVisible() {
    const top = topInset() + 8;
    let found = -1;
    for (let k = 0; k < units.length; k++) {
      const el = unitEl(units[k].k);
      if (!el || el.offsetParent === null) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom > top) {
        found = k;
        break;
      }
    }
    if (found < 0) return 0;
    // 본문 맨 앞에서 시작하면 제목부터 읽는다
    const prev = units[found - 1];
    return prev && !unitEl(prev.k) && found === 1 ? 0 : found;
  }

  function stop() {
    cancelAnimationFrame(raf);
    audio.pause();
    clearMarks();
    ui = -1;
    waitingFor = -1;
    setState('stopped');
  }

  // 다른 페이지로 넘어갈 때 함께 잦아든다
  registerFader((ms) => {
    if (state !== 'playing') return;
    const v0 = audio.volume;
    const t0 = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = v0 * (1 - p);
      if (p < 1) fadeTimer = setTimeout(tick, 30);
      else audio.pause();
    };
    tick();
  });

  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata(meta);
      navigator.mediaSession.setActionHandler('play', () => api.toggle());
      navigator.mediaSession.setActionHandler('pause', () => api.toggle());
      navigator.mediaSession.setActionHandler('previoustrack', () => api.prev());
      navigator.mediaSession.setActionHandler('nexttrack', () => api.next());
    } catch {
      /* 지원하지 않는 동작 */
    }
  }

  const api = {
    get state() {
      return state;
    },
    get rate() {
      return rate;
    },
    /** 처음 누를 때는 화면에 보이는 곳부터 */
    start() {
      follow = true;
      onFollow(true);
      return seek(firstVisible());
    },
    toggle() {
      if (state === 'playing') {
        audio.pause();
        cancelAnimationFrame(raf);
        setState('paused');
      } else if (state === 'paused') {
        // 그사이 다른 곳으로 스크롤해 두었으면 거기서부터
        const el = speakingEl;
        const r = el?.getBoundingClientRect();
        if (!follow && r && (r.bottom < 0 || r.top > innerHeight)) return api.start();
        audio.play().then(() => {
          setState('playing');
          loop();
        });
      } else if (state === 'waiting') seek(waitingFor);
      else if (state === 'stopped') api.start();
    },
    prev() {
      if (ui < 0) return;
      const u = units[ui];
      const into = audio.currentTime * 1000 - u.t;
      return seek(into > 1500 ? ui : ui - 1);
    },
    next() {
      if (ui < 0) return;
      return seek(ui + 1);
    },
    /** 따라가기 다시 켜기 */
    refollow() {
      follow = true;
      onFollow(true);
      programmaticUntil = performance.now() + 1200;
      keepInView(lineEl || speakingEl);
    },
    cycleRate() {
      rate = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
      audio.playbackRate = rate;
      store.set('narrate-rate', rate);
      return rate;
    },
    stop,
    resumeWaiting,
  };
  return api;
}
