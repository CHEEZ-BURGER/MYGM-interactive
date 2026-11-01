// 장면 효과: 눈·비(계속), 셔터·암전(한 번)

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createFx() {
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const veil = document.createElement('div');
  veil.className = 'fx-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.append(canvas, veil);
  const ctx = canvas.getContext('2d');

  let mode = null;
  let parts = [];
  let raf = 0;
  let alpha = 0; // 효과 전체의 페이드
  let w = 0;
  let h = 0;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  function resize() {
    w = innerWidth;
    h = innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', resize);
  resize();

  function spawn(kind) {
    if (kind === 'snow') {
      return { x: Math.random() * w, y: Math.random() * -h, r: 1 + Math.random() * 2.6, vy: 0.35 + Math.random() * 0.8, sway: Math.random() * Math.PI * 2 };
    }
    return { x: Math.random() * (w + 200), y: Math.random() * -h, len: 14 + Math.random() * 18, vy: 9 + Math.random() * 7 };
  }

  let lastMode = null;
  // 바탕이 밝으면(소설의 흰 바탕) 흰 눈이 묻히므로 푸른 회색 눈송이로 바꾼다
  let light = false;
  function readTheme() {
    const m = getComputedStyle(document.body).backgroundColor.match(/\d+(\.\d+)?/g) || [0, 0, 0];
    const [r, g, b] = m.map(Number);
    light = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6;
  }
  function frame() {
    const target = mode ? 1 : 0;
    alpha += (target - alpha) * 0.04;
    ctx.clearRect(0, 0, w, h);
    const kind = mode || lastMode;
    if (kind && alpha > 0.01) {
      const want = kind === 'snow' ? Math.round(w / 9) : Math.round(w / 6);
      while (parts.length < want) parts.push(spawn(kind));
      ctx.globalAlpha = alpha;
      if (kind === 'snow') {
        for (const p of parts) {
          p.sway += 0.01;
          p.y += p.vy;
          p.x += Math.sin(p.sway) * 0.4;
          if (p.y > h + 5) Object.assign(p, spawn('snow'), { y: -5 });
          // 큰 눈송이일수록 가까이 있는 듯 진하게
          const a = 0.35 + (p.r / 3.6) * 0.45;
          ctx.fillStyle = light ? `rgba(118,136,165,${a})` : `rgba(255,255,255,${Math.min(0.95, a + 0.2)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, light ? p.r + 0.4 : p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.strokeStyle = light ? 'rgba(90,110,140,0.35)' : 'rgba(190,210,235,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const p of parts) {
          p.y += p.vy;
          p.x -= p.vy * 0.18;
          if (p.y > h + 20) Object.assign(p, spawn('rain'), { y: -20 });
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.len * 0.18, p.y - p.len);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    } else {
      parts = [];
      raf = 0;
    }
  }

  return {
    set(next) {
      if (reduce || next === mode) return;
      if (next) readTheme();
      if (next && lastMode && next !== lastMode) parts = [];
      mode = next;
      if (next) lastMode = next;
      if (!raf) raf = requestAnimationFrame(frame);
    },
    pulse(kind) {
      if (reduce || !kind) return;
      veil.className = `fx-veil is-${kind}`;
      void veil.offsetWidth; // 애니메이션 재시작
      veil.classList.add('is-on');
    },
  };
}
