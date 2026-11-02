import { Howl, Howler } from 'howler';
import { ambience, fadeOutSynth, synthSfx, unlock } from './synth.js';
import { Looper } from './looper.js';

const FADE_MS = 2200;
const BGM_GAIN = 0.55; // 배경음악은 글을 방해하지 않을 만큼만
const KEY = 'mungye:sound';
const tracks = new Map(); // id -> Looper | null(파일 없음)

let enabled = false;
let currentId = null;
let level = 1; // 큐가 지정하는 상대 볼륨(수상소감 구간에서 낮아짐)

export function savedPreference() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function savePreference(v) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* 사생활 보호 모드 등 */
  }
}

function track(id) {
  if (tracks.has(id)) return tracks.get(id);
  const loop = new Looper(`media/audio/${id}.mp3`, {
    xfade: 4, // 곡 끝 4초 전에 같은 곡을 겹쳐 틀어 이음새 없이 반복
    onloaderror: () => {
      tracks.set(id, null);
      if (import.meta.env.DEV) console.info(`[audio] ${id}.mp3 없음 — 무음으로 진행`);
    },
  });
  tracks.set(id, loop);
  return loop;
}

function fadeOut(loop) {
  // 다른 곡으로 넘어가거나 소리를 끌 때: 천천히 줄인 뒤 멈춘다
  if (loop) loop.fadeOutAndStop(FADE_MS);
}

function fadeIn(loop) {
  // 멈춰 있던 곡은 무음에서, 줄어들던 곡은 지금 음량에서 서서히 올린다
  if (loop) loop.fadeTo(level * BGM_GAIN, FADE_MS);
}

/** 큐가 바뀔 때 호출. id가 같으면 볼륨만 맞춘다. */
export function setTrack(id, volume = 1) {
  const changed = id !== currentId;
  const prev = currentId ? tracks.get(currentId) : null;
  currentId = id;
  level = volume;
  if (!enabled) return;
  if (changed) fadeOut(prev);
  if (id) fadeIn(track(id));
}

export function setEnabled(on) {
  enabled = on;
  savePreference(on ? 'on' : 'off');
  if (on) unlock();
  else ambience(null);
  document.documentElement.dataset.sound = on ? 'on' : 'off';
  if (on) {
    Howler.mute(false);
    if (currentId) fadeIn(track(currentId));
  } else {
    for (const l of tracks.values()) fadeOut(l);
  }
}

/**
 * 페이지를 떠나기 직전에 부른다. 지금 나는 모든 소리(배경음악·효과음·배경 소리·UI)를 ms 안에 줄여
 * 페이지가 바뀌는 순간 툭 끊기지 않게 한다.
 */
export function fadeEverything(ms = 500) {
  for (const l of tracks.values()) l?.fadeAll(ms);
  for (const h of sfx.values()) {
    if (h && h !== 'synth') h._sounds.forEach((s) => !s._paused && h.fade(h.volume(s._id), 0, ms, s._id));
  }
  fadeOutSynth(ms);
}

export const isEnabled = () => enabled;

// 효과음: 한 번만 울리는 짧은 소리.
// public/media/sfx/<id>.mp3 가 있으면 그 파일을, 없으면 synth.js의 합성음을 쓴다.
const sfx = new Map(); // id -> Howl | 'synth'
async function probeSfx(id) {
  if (sfx.has(id)) return;
  sfx.set(id, 'synth'); // 확인하는 동안에는 합성음으로
  try {
    const r = await fetch(`media/sfx/${id}.mp3`, { method: 'HEAD' });
    // 개발 서버는 없는 파일에도 HTML을 돌려주므로 형식까지 확인한다
    if (r.ok && (r.headers.get('content-type') || '').startsWith('audio')) {
      sfx.set(id, new Howl({ src: [`media/sfx/${id}.mp3`], onloaderror: () => sfx.set(id, 'synth') }));
    }
  } catch {
    /* 오프라인 등: 합성음 유지 */
  }
}
/** 소리를 켰을 때 이 작품의 효과음을 미리 확인·받아 둔다(울릴 때 늦지 않게). */
export function preloadSfx(ids) {
  ids.forEach(probeSfx);
}
// 파일마다 알맞은 음량, 긴 파일은 앞부분만 쓰고(max초) 서서히 줄인다
const SFX_OPTS = {
  // 장면 효과음은 배경음악 아래로 은은하게. 긴 파일은 앞부분만 쓰고 서서히 줄인다.
  'sfx-thunder': { volume: 0.35, max: 3.5 },
  'sfx-machine': { volume: 0.18, max: 3 },
  'sfx-door-close': { volume: 0.22 },
  'sfx-door-rain': { volume: 0.3 },
  'sfx-knock': { volume: 0.4 },
  'sfx-switch': { volume: 0.5 },
  'sfx-water-thud': { volume: 0.3 },
  'sfx-candy-drop': { volume: 0.3 },
  'sfx-shop-bell': { volume: 0.25 },
  'sfx-elevator': { volume: 0.22 },
  'sfx-door-lock': { volume: 0.3 },
  'sfx-shutter': { volume: 0.3 },
  'sfx-power-off': { volume: 0.3 },
  'sfx-can-open': { volume: 0.35 },
};
export function playSfx(id, volume) {
  if (!enabled || !id) return;
  if (!sfx.has(id)) probeSfx(id);
  const h = sfx.get(id);
  if (h && h !== 'synth') {
    const o = SFX_OPTS[id] || {};
    const v = volume ?? o.volume ?? 0.3;
    const sid = h.play();
    h.volume(v, sid);
    if (o.max) setTimeout(() => h.fade(v, 0, 1200, sid), o.max * 1000);
  } else synthSfx(id);
}

// 탭을 떠나면 소리를 멈추고, 돌아오면 이어서 재생
document.addEventListener('visibilitychange', () => {
  if (!enabled) return;
  Howler.mute(document.hidden);
});
