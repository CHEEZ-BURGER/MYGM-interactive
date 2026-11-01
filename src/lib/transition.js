// 장면 전환. 모든 전환은 아래에서 위로 이어진다.
//  나갈 때: 지금 장면이 위로 밀려 올라가는 동안 어두운 막이 아래에서 올라와 화면을 덮는다.
//  들어올 때: 막이 계속 위로 빠져나가고, 새 장면이 아래에서 따라 올라온다.
// 막과 장면이 같은 곡선으로 움직여서 빈 틈이 드러나지 않는다.
// 막의 색은 도착할 화면의 바탕색이라, 검게 꺼지지 않고 다음 장면의 색으로 자연스럽게 넘어간다.

import { fadeUi, ui } from './synth.js';
import { fadeEverything } from './audio.js';

const KEY = 'mungye:wipe';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DUR = 650;
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
// 페이지별 바탕색(각 HTML 머리의 막 색과 같게 유지)
const PAGE_BG = { index: '#0c0d10', poem: '#0e1626', novel: '#ffffff', play: '#15120e', critique: '#f7f7f5' };
const bgOf = (url) => PAGE_BG[(new URL(url, location.href).pathname.split('/').pop() || 'index.html').replace('.html', '')] || PAGE_BG.index;
const currentBg = () => getComputedStyle(document.body).backgroundColor;

const sceneEl = () => document.querySelector('#app, #hub');

export function initTransitions({ ready = Promise.resolve() } = {}) {
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.append(curtain);
  const html = document.documentElement;

  function run(curtainFrames, sceneFrames) {
    if (reduce) return Promise.resolve();
    const opts = { duration: DUR, easing: EASE, fill: 'forwards' };
    const a = curtain.animate(curtainFrames, opts);
    const b = sceneEl()?.animate(sceneFrames, opts);
    // 탭이 가려져 애니메이션이 멈춰도 전환이 영영 끝나지 않는 일이 없도록 시간 제한을 둔다
    const limit = new Promise((r) => setTimeout(r, DUR + 400));
    return Promise.race([Promise.all([a.finished, b?.finished]), limit]).then(() => [a, b]);
  }

  function paint(color) {
    curtain.style.background = color;
    html.style.background = color;
  }

  async function cover(color = currentBg()) {
    paint(color);
    html.classList.add('is-moving');
    curtain.style.visibility = 'visible';
    const anims = await run(
      [{ transform: 'translate3d(0,100%,0)' }, { transform: 'translate3d(0,0,0)' }],
      [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-14vh,0)' }],
    );
    curtain.style.transform = 'none';
    anims?.forEach((x) => x?.cancel());
    // 막이 덮은 동안 장면은 아래쪽 대기 위치로
    const el = sceneEl();
    if (el && !reduce) el.style.transform = 'translate3d(0,14vh,0)';
  }

  async function uncover() {
    curtain.style.visibility = 'visible';
    curtain.style.transform = 'none';
    const el = sceneEl();
    const anims = await run(
      [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-100%,0)' }],
      [{ transform: 'translate3d(0,14vh,0)' }, { transform: 'translate3d(0,0,0)' }],
    );
    anims?.forEach((x) => x?.cancel());
    if (el) el.style.transform = '';
    curtain.style.visibility = 'hidden';
    html.classList.remove('is-moving');
    html.style.background = '';
  }

  // 이전 페이지에서 막을 덮고 넘어왔다면 걷어 낸다
  if (html.classList.contains('wipe-in')) {
    paint(bgOf(location.href));
    curtain.style.visibility = 'visible';
    curtain.style.transform = 'none';
    html.classList.remove('wipe-in');
    html.classList.add('is-moving');
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* */
    }
    // 폰트가 준비된 뒤에 막을 걷는다(도중에 글자가 바뀌며 깜빡이지 않게)
    ready.then(() => requestAnimationFrame(() => requestAnimationFrame(uncover)));
  }
  // 뒤로 가기로 캐시에서 되살아난 경우 남은 상태를 정리
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    curtain.style.visibility = 'hidden';
    html.classList.remove('is-moving');
    const el = sceneEl();
    if (el) {
      el.style.transform = '';
      el.style.clipPath = '';
      el.style.background = '';
      document.documentElement.style.background = '';
      document.body.style.background = '';
      el.getAnimations().forEach((a) => a.cancel());
    }
    document.querySelectorAll('.collapse-thumb').forEach((t) => t.remove());
    document.body.classList.remove('is-collapsing');
  });

  const go = async (href) => {
    ui.whoosh('in');
    // 배경음악·효과음은 막이 덮이는 동안 줄이고, 슈웅도 페이지가 바뀌기 직전에 살짝 줄여 툭 끊기지 않게
    fadeEverything(DUR);
    setTimeout(() => fadeUi(200), Math.max(0, DUR - 220));
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* */
    }
    await cover(bgOf(href));
    location.assign(href);
  };

  // 사이트 안 링크. data-back 링크는 각 페이지가 따로 처리한다.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.hasAttribute('data-back')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.href === location.href) return;
    e.preventDefault();
    go(url.href);
  });

  return {
    go,
    /** 막으로 덮은 사이에 fn을 실행하고 다시 걷는다(같은 페이지 안 장면 이동). */
    async wipe(fn) {
      ui.whoosh('soft');
      await cover();
      fn();
      // 자리를 옮긴 뒤 한 번 그려지고 나서 걷는다(화면이 가려져 있어도 멈추지 않게 시간 제한)
      await new Promise((r) => {
        requestAnimationFrame(() => requestAnimationFrame(r));
        setTimeout(r, 60);
      });
      await uncover();
    },
  };
}
