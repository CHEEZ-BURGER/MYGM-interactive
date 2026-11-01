// 사이트의 짧은 소리들.
// - UI: 버튼 톡, 카드 틱, 켜고 끄기 / 전환: 시네마틱 '슈웅' / 배경 소리: 비, 눈 오는 밤의 바람
// public/media/sfx/ 의 녹음 파일(Mixkit 무료 효과음, docs/AUDIO.md 참고)을 먼저 쓰고,
// 파일이 없거나 아직 받는 중이면 아래의 합성음으로 대신한다.
import { Howl } from 'howler';
import { Looper } from './looper.js';

const KEY = 'mungye:sound';

// ── 녹음 파일 ─────────────────────────────────────────────
// 애플식으로 짧고 작게: 소리는 '들린다'보다 '느껴진다' 정도로만
const UI_FILES = {
  tap: ['ui-tap', 0.18], // Cool interface click tone — 0.04초
  tick: ['ui-tick', 0.07], // On or off light switch tap — 카드가 가운데에 걸릴 때
  in: ['ui-whoosh-in', 0.26], // Short wind swoosh — 작품으로 들어갈 때
  out: ['ui-whoosh-out', 0.22], // Quick air woosh — 메인으로 나올 때
};
const howls = new Map(); // id -> Howl | null(파일 없음)
function fileSound(id, opts = {}) {
  if (!howls.has(id)) {
    howls.set(id, new Howl({ src: [`media/sfx/${id}.mp3`], preload: true, ...opts, onloaderror: () => howls.set(id, null) }));
  }
  return howls.get(id);
}
/** 파일이 준비돼 있으면 재생하고 true */
function playFile(id, volume) {
  const h = fileSound(id);
  if (!h || h.state() !== 'loaded') return false;
  h.volume(volume);
  h.play();
  return true;
}
// UI 소리는 작아서 처음부터 받아 둔다(누르는 순간 바로 나도록)
Object.values(UI_FILES).forEach(([id]) => fileSound(id));
let ctx = null;
let master = null;
let noise = null;

/** 사용자가 소리를 끄지 않았는지(처음 방문이면 켜진 것으로 본다) */
export function soundAllowed() {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    // 흰 소음 2초(여러 소리의 재료)
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** 사용자 조작 안에서 한 번 불러 소리를 낼 수 있게 깨운다. */
export function unlock() {
  ac();
}

// ── 재료 ────────────────────────────────────────────────
function out(pan = 0) {
  if (!pan || !ctx.createStereoPanner) return master;
  const p = ctx.createStereoPanner();
  p.pan.value = pan;
  p.connect(master);
  return p;
}
function env(g, t, a, peak, d) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}
function noiseSrc(t, dur, loop = false) {
  const s = ctx.createBufferSource();
  s.buffer = noise;
  s.loop = loop;
  s.start(t, Math.random() * 1.5);
  if (!loop) s.stop(t + dur);
  return s;
}
function filt(type, freq, q = 0.7) {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}
/** 짧은 소음 한 번(딸깍·톡) */
function burst(t, { type = 'highpass', freq = 2000, q = 0.7, dur = 0.02, peak = 0.3, pan = 0 } = {}) {
  const g = ctx.createGain();
  const f = filt(type, freq, q);
  noiseSrc(t, dur + 0.05).connect(f).connect(g).connect(out(pan));
  env(g, t, 0.002, peak, dur);
}
/** 음 하나(주파수가 미끄러질 수 있음) */
function tone(t, { type = 'sine', from = 440, to = from, dur = 0.2, peak = 0.2, a = 0.005, pan = 0 } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  if (to !== from) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  o.connect(g).connect(out(pan));
  env(g, t, a, peak, dur);
  o.start(t);
  o.stop(t + a + dur + 0.05);
}
/** 둔탁한 쿵 */
function thump(t, { freq = 110, peak = 0.5, dur = 0.18 } = {}) {
  tone(t, { from: freq, to: freq * 0.55, dur, peak });
  burst(t, { type: 'lowpass', freq: 700, dur: dur * 0.6, peak: peak * 0.4 });
}

// ── UI ──────────────────────────────────────────────────
// 합성음으로 대신하지 않는다(파일이 없으면 조용히 넘어간다).
let lastTick = 0;
export const ui = {
  /** 버튼을 누를 때 아주 짧은 톡 */
  tap() {
    if (soundAllowed()) playFile(...UI_FILES.tap);
  },
  /** 카드가 가운데에 걸릴 때 손끝에 걸리는 정도의 틱(빠르게 넘길 때 겹치지 않게 간격을 둔다) */
  tick() {
    const now = performance.now();
    if (!soundAllowed() || now - lastTick < 110) return;
    lastTick = now;
    playFile(...UI_FILES.tick);
  },
  /** 소리를 켤 때만 톡 한 번(끌 때는 조용히) */
  toggle(on) {
    if (on) playFile(...UI_FILES.tap);
  },
  /** 페이지를 오갈 때의 짧은 바람 소리. 'soft'(같은 페이지 장면 이동)는 소리를 내지 않는다. */
  whoosh(dir = 'in') {
    if (soundAllowed() && UI_FILES[dir]) playFile(...UI_FILES[dir]);
  },
};

// ── 장면 효과음(파일이 없을 때 대신 쓰는 합성음) ─────────────
const BANK = {
  'sfx-switch'(t) {
    burst(t, { freq: 1800, q: 1.2, type: 'bandpass', dur: 0.012, peak: 0.6 });
    thump(t, { freq: 180, peak: 0.18, dur: 0.05 });
    burst(t + 0.045, { freq: 3200, dur: 0.008, peak: 0.2 });
  },
  'sfx-shutter'(t) {
    burst(t, { freq: 2500, dur: 0.012, peak: 0.35 });
    burst(t + 0.07, { freq: 1800, dur: 0.02, peak: 0.25 });
  },
  'sfx-elevator'(t) {
    [1046.5, 2093, 3140].forEach((f, k) => tone(t, { from: f, dur: 1.4 - k * 0.3, peak: 0.09 / (k + 1), a: 0.004 }));
  },
  'sfx-water-thud'(t) {
    thump(t, { freq: 95, peak: 0.55, dur: 0.22 });
    const bp = filt('bandpass', 700, 3);
    bp.frequency.setValueAtTime(900, t + 0.05);
    bp.frequency.exponentialRampToValueAtTime(350, t + 0.6);
    const g = ctx.createGain();
    noiseSrc(t, 0.8).connect(bp).connect(g).connect(master);
    env(g, t + 0.04, 0.05, 0.12, 0.55);
  },
  'sfx-door-lock'(t) {
    burst(t, { type: 'bandpass', freq: 2600, q: 2, dur: 0.015, peak: 0.4 });
    const bp = filt('bandpass', 1800, 4);
    const g = ctx.createGain();
    noiseSrc(t + 0.05, 0.15).connect(bp).connect(g).connect(master);
    env(g, t + 0.05, 0.02, 0.12, 0.09);
    burst(t + 0.16, { type: 'bandpass', freq: 3200, q: 2, dur: 0.012, peak: 0.45 });
  },
  'sfx-door-close'(t) {
    thump(t, { freq: 70, peak: 0.6, dur: 0.3 });
    burst(t + 0.13, { type: 'bandpass', freq: 2400, q: 2, dur: 0.012, peak: 0.25 });
  },
  'sfx-shop-bell'(t) {
    [0, 0.09, 0.17, 0.3, 0.44].forEach((d, k) => {
      const f = 1650 + Math.random() * 300;
      tone(t + d, { from: f, dur: 1.1, peak: 0.06 / (1 + k * 0.25), pan: (Math.random() - 0.5) * 0.6 });
      tone(t + d, { from: f * 2.76, dur: 0.5, peak: 0.025, pan: (Math.random() - 0.5) * 0.6 });
    });
  },
  'sfx-candy-drop'(t) {
    thump(t, { freq: 220, peak: 0.35, dur: 0.07 });
    burst(t + 0.005, { freq: 4500, dur: 0.02, peak: 0.3 });
    [0.09, 0.15, 0.22].forEach((d) => burst(t + d, { freq: 5000, dur: 0.006, peak: 0.08 }));
  },
  'sfx-can-open'(t) {
    burst(t, { type: 'bandpass', freq: 1400, q: 1.5, dur: 0.02, peak: 0.6 });
    const g = ctx.createGain();
    noiseSrc(t + 0.01, 1).connect(filt('highpass', 4500)).connect(g).connect(master);
    env(g, t + 0.01, 0.01, 0.14, 0.8);
  },
  'sfx-knock'(t) {
    [0, 0.22, 0.44].forEach((d) => thump(t + d, { freq: 150, peak: 0.5, dur: 0.09 }));
  },
  'sfx-thunder'(t) {
    burst(t, { type: 'highpass', freq: 1500, dur: 0.12, peak: 0.25 });
    const g = ctx.createGain();
    const lp = filt('lowpass', 380);
    lp.frequency.setValueAtTime(600, t);
    lp.frequency.exponentialRampToValueAtTime(120, t + 3);
    noiseSrc(t, 3.2).connect(lp).connect(g).connect(master);
    env(g, t, 0.06, 0.9, 3);
  },
  'sfx-power-off'(t) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = 120;
    o.connect(filt('lowpass', 900)).connect(g).connect(master);
    g.gain.setValueAtTime(0.06, t);
    g.gain.setValueAtTime(0.06, t + 0.22);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
    o.start(t);
    o.stop(t + 0.3);
    burst(t + 0.24, { freq: 2200, dur: 0.01, peak: 0.25 });
  },
  'sfx-door-rain'(t) {
    burst(t, { type: 'bandpass', freq: 2000, q: 2, dur: 0.012, peak: 0.3 });
    const g = ctx.createGain();
    noiseSrc(t, 3).connect(filt('lowpass', 3500)).connect(filt('highpass', 250)).connect(g).connect(master);
    env(g, t + 0.05, 0.15, 0.5, 2.6);
  },
  'sfx-machine'(t) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(28, t);
    o.frequency.linearRampToValueAtTime(42, t + 1.2);
    o.connect(filt('lowpass', 220)).connect(g).connect(master);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.2, t + 1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
    o.start(t);
    o.stop(t + 3.1);
  },
};

/** 합성음으로 효과음을 낸다. 없는 ID면 false. */
export function synthSfx(id) {
  if (!BANK[id] || !ac()) return false;
  BANK[id](ctx.currentTime + 0.01);
  return true;
}

// ── 배경 소리: 비, 눈 오는 밤의 바람 ───────────────────────
// 녹음 파일(amb-rain, amb-snow)을 반복 재생하고, 없으면 합성음으로.
const AMB = { rain: ['amb-rain', 0.14], snow: ['amb-snow', 0.1] };
const ambLoops = new Map(); // mode -> Looper(이음새 없이 반복)
let ambMode = null;
export function ambience(mode) {
  mode = mode || null;
  if (mode === ambMode) return;
  const prev = ambMode && ambLoops.get(ambMode);
  ambMode = mode;
  prev?.fadeOutAndStop(1500);
  synthAmbience(null);
  if (!mode) return;
  const [id, vol] = AMB[mode];
  if (!ambLoops.has(mode)) {
    ambLoops.set(
      mode,
      new Looper(`media/sfx/${id}.mp3`, {
        xfade: 3,
        onloaderror: () => {
          ambLoops.set(mode, null);
          if (ambMode === mode) synthAmbience(mode);
        },
      }),
    );
  }
  const loop = ambLoops.get(mode);
  if (loop) loop.fadeTo(vol, 1800);
  else synthAmbience(mode);
}

/** 페이지를 떠날 때: 배경 소리와 합성음을 ms 안에 줄인다(UI 소리는 fadeUi로 따로). */
export function fadeOutSynth(ms = 500) {
  for (const l of ambLoops.values()) l?.fadeAll(ms);
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.0001, ctx.currentTime, ms / 4000);
  }
}

/** 지금 나고 있는 UI 소리(슈웅 등)를 ms 안에 줄인다. */
export function fadeUi(ms = 200) {
  for (const h of howls.values()) {
    if (h) h._sounds.forEach((snd) => !snd._paused && h.fade(h.volume(snd._id), 0, ms, snd._id));
  }
}

let amb = null; // { mode, gain, nodes }
function synthAmbience(mode) {
  if ((amb?.mode ?? null) === (mode ?? null)) return;
  if (amb) {
    const { gain, nodes } = amb;
    if (ctx) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.5);
      setTimeout(() => nodes.forEach((n) => n.stop?.()), 2500);
    }
    amb = null;
  }
  if (!mode || !ac()) return;
  const t = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.value = 0.0001;
  gain.connect(master);
  const nodes = [];
  const src = noiseSrc(t, 0, true);
  nodes.push(src);
  if (mode === 'rain') {
    src.connect(filt('highpass', 400)).connect(filt('lowpass', 2600)).connect(gain);
    gain.gain.setTargetAtTime(0.13, t, 0.6);
  } else {
    // 눈: 멀리서 부는 낮은 바람이 천천히 오르내린다
    const bp = filt('bandpass', 420, 0.8);
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 0.09;
    depth.gain.value = 180;
    lfo.connect(depth).connect(bp.frequency);
    lfo.start(t);
    nodes.push(lfo);
    src.connect(bp).connect(gain);
    gain.gain.setTargetAtTime(0.07, t, 0.8);
  }
  amb = { mode, gain, nodes };
}

// 탭을 떠나면 합성 소리도 멈춘다
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend();
  else ctx.resume();
});

/**
 * 버튼을 누르면 톡. 페이지 이동·장면 이동(슈웅이 따로 나는 것)과 소리 켜기 버튼은 제외한다.
 */
export function bindUiSounds() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, [role="radio"], .pill');
    if (!el || el.disabled) return;
    if (el.closest('a[href], [data-sound-toggle], [data-seg], [data-scene-go], [data-scene-step], [data-start], .switch')) return;
    ui.tap();
  });
}
