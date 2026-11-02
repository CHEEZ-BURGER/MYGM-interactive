// 애플식 모서리: 원호가 아니라 곡률이 서서히 바뀌며 직선으로 이어지는 '연속 곡률' 모서리.
// CSS(corner-shape)는 아직 아이폰 사파리에서 안 되므로, 요소 크기에 맞춘 경로로 잘라 낸다.
// 반지름은 CSS 변수 --sq 로 정한다(없으면 border-radius 값). 크기가 바뀌면 다시 그린다.

const SELECTOR = '.pill, .resume button, .scene-nav__btn, .sizes button, .toc button, .feed-item__go';
const SMOOTHING = 0.6; // iOS 아이콘·버튼과 같은 정도

const rad = (deg) => (deg * Math.PI) / 180;

/** 너비·높이·반지름으로 연속 곡률 사각형 경로를 만든다(Figma의 corner smoothing 방식) */
export function squirclePath(w, h, r, s = SMOOTHING) {
  const max = Math.min(w, h) / 2;
  r = Math.min(r, max);
  let p = (1 + s) * r;
  if (p > max) {
    s = Math.max(0, max / r - 1);
    p = max;
  }
  const arc = 90 * (1 - s);
  const arcLen = Math.sin(rad(arc / 2)) * r * Math.SQRT2;
  const alpha = (90 - arc) / 2;
  const p3p4 = r * Math.tan(rad(alpha / 2));
  const beta = 45 * s;
  const c = p3p4 * Math.cos(rad(beta));
  const d = c * Math.tan(rad(beta));
  const b = (p - arcLen - c - d) / 3;
  const a = 2 * b;
  const f = (n) => +n.toFixed(2);
  const [A, AB, ABC, C, D, L, BC] = [a, a + b, a + b + c, c, d, arcLen, b + c].map(f);
  return [
    `M ${f(w - p)} 0`,
    `c ${A} 0 ${AB} 0 ${ABC} ${D}`,
    `a ${f(r)} ${f(r)} 0 0 1 ${L} ${L}`,
    `c ${D} ${C} ${D} ${BC} ${D} ${ABC}`,
    `L ${f(w)} ${f(h - p)}`,
    `c 0 ${A} 0 ${AB} ${-D} ${ABC}`,
    `a ${f(r)} ${f(r)} 0 0 1 ${-L} ${L}`,
    `c ${-C} ${D} ${-BC} ${D} ${-ABC} ${D}`,
    `L ${f(p)} ${f(h)}`,
    `c ${-A} 0 ${-AB} 0 ${-ABC} ${-D}`,
    `a ${f(r)} ${f(r)} 0 0 1 ${-L} ${-L}`,
    `c ${-D} ${-C} ${-D} ${-BC} ${-D} ${-ABC}`,
    `L 0 ${f(p)}`,
    `c 0 ${-A} 0 ${-AB} ${D} ${-ABC}`,
    `a ${f(r)} ${f(r)} 0 0 1 ${L} ${-L}`,
    `c ${C} ${-D} ${BC} ${-D} ${ABC} ${-D}`,
    'Z',
  ].join(' ');
}

const ro = new ResizeObserver((entries) => {
  for (const en of entries) paint(en.target, en.borderBoxSize?.[0]);
});

function paint(el, box) {
  const w = box ? box.inlineSize : el.offsetWidth;
  const h = box ? box.blockSize : el.offsetHeight;
  if (!w || !h) return;
  const cs = getComputedStyle(el);
  const r = parseFloat(cs.getPropertyValue('--sq')) || parseFloat(cs.borderTopLeftRadius) || 0;
  el.style.clipPath = r ? `path('${squirclePath(w, h, r)}')` : '';
}

/** root 안의 버튼들에 연속 곡률 모서리를 입힌다(이미 입힌 것은 건너뛴다) */
export function smoothCorners(root = document) {
  root.querySelectorAll(SELECTOR).forEach((el) => {
    if (el.dataset.sq != null) return;
    el.dataset.sq = '';
    ro.observe(el);
  });
}
