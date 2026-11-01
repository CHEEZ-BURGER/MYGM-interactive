// 문단을 화면에 보이는 줄 단위로 잘라 한 줄씩 올라오게 한다.
// 다 올라온 뒤에도 마크업을 바꾸지 않는다(바꾸는 순간 다시 그려지며 깜빡이기 때문).
// 글자 크기·화면 폭이 바뀔 때만 restore()로 원래 문단으로 되돌린다.

const original = new WeakMap();

/**
 * 지금 화면에 그려진 그대로 글자 하나하나의 위치를 재서 줄이 바뀌는 지점을 찾는다.
 * (한국어는 글자 사이에서도 줄이 바뀌므로 단어 단위로 재면 틀린다)
 * @returns {Array<Array<Node|{text:string}>>} 줄마다 들어갈 조각 목록
 */
function measureLines(el) {
  const lines = [];
  let lastTop = null;
  let cur = null;
  const newLine = (top) => {
    cur = [];
    lines.push(cur);
    lastTop = top;
  };
  const range = document.createRange();
  for (const node of [...el.childNodes]) {
    if (node.nodeType !== Node.TEXT_NODE) {
      // 각주 버튼 같은 요소는 통째로 하나의 조각
      const r = node.getBoundingClientRect();
      if (lastTop === null || r.top - lastTop > 4) newLine(r.top);
      cur.push(node);
      continue;
    }
    const text = node.textContent;
    let start = 0;
    for (let i = 0; i < text.length; i++) {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rects = range.getClientRects();
      if (!rects.length) continue; // 줄 끝에서 사라진 공백
      const top = rects[0].top;
      if (lastTop === null) newLine(top);
      else if (top - lastTop > 4) {
        if (i > start) cur.push({ text: text.slice(start, i) });
        start = i;
        newLine(top);
      }
    }
    if (lastTop === null) newLine(0);
    if (start < text.length) cur.push({ text: text.slice(start) });
  }
  return lines;
}

/** el을 줄로 나눈다(이미 나눴으면 그대로). 나눈 줄 수를 돌려준다. */
export function split(el) {
  if (original.has(el)) return el.querySelectorAll('.ln').length;
  original.set(el, el.innerHTML);
  const lines = measureLines(el);
  el.replaceChildren(
    ...lines.map((parts, i) => {
      const ln = document.createElement('span');
      ln.className = 'ln';
      ln.style.setProperty('--li', i);
      const inner = document.createElement('span');
      inner.className = 'ln-in';
      inner.append(...parts.map((p) => (p.text != null ? document.createTextNode(p.text) : p)));
      ln.append(inner);
      return ln;
    }),
  );
  el.classList.add('is-split');
  return lines.length;
}

/** 줄을 나눈 상태에서 한 줄씩 올린다. */
export function reveal(el) {
  split(el);
  void el.offsetHeight; // 시작 위치를 먼저 그리게 한다
  el.classList.add('is-in');
}

export function restore(el) {
  if (!original.has(el)) return;
  el.innerHTML = original.get(el);
  original.delete(el);
  el.classList.remove('is-split');
}
