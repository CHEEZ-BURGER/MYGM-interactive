// 이미지 파일 찾기와 채우기. 확장자를 차례로 시도하고, 없으면 자리 표시로 남긴다.

const EXTS = ['webp', 'jpg', 'png'];
const resolved = new Map(); // id -> Promise<url | null>

function probe(url) {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok(true);
    img.onerror = () => ok(false);
    img.src = url;
  });
}

export function resolveImage(id) {
  if (!id) return Promise.resolve(null);
  if (!resolved.has(id)) {
    resolved.set(
      id,
      (async () => {
        for (const ext of EXTS) {
          const url = `media/img/${id}.${ext}`;
          if (await probe(url)) return url;
        }
        return null;
      })(),
    );
  }
  return resolved.get(id);
}

/** [data-media] 요소의 배경으로 이미지를 채운다. 파일이 없으면 is-placeholder. */
export function fillMedia(root = document) {
  root.querySelectorAll('[data-media]').forEach(async (el) => {
    const url = await resolveImage(el.dataset.media);
    if (url) el.style.backgroundImage = `url("${url}")`;
    el.classList.toggle('is-placeholder', !url);
  });
}

/** 이미지 파일이 있는지만 가볍게 확인한다(내려받지 않음). */
export async function imageExists(id) {
  for (const ext of EXTS) {
    try {
      const r = await fetch(`media/img/${id}.${ext}`, { method: 'HEAD' });
      // 개발 서버는 없는 파일에도 HTML을 돌려주므로 형식까지 본다
      if (r.ok && (r.headers.get('content-type') || '').startsWith('image')) return true;
    } catch {
      /* */
    }
  }
  return false;
}
