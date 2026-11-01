// 콘텐츠 JSON → HTML. 본문 글자는 바꾸지 않고 감싸기만 한다.
import { CUES } from '../content/cues.js';
import { WORKS, SITE, esc, logoHTML } from './site.js';

const SUP = { '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };

// 평론 각주 기호(¹²³…)를 누를 수 있는 버튼으로 감싼다. 기호 자체는 그대로 둔다.
function withFootnotes(text) {
  return esc(text).replace(
    /[¹²³⁴⁵⁶⁷⁸⁹]/g,
    (m) => `<button class="fn-ref" type="button" data-fn="${SUP[m]}" aria-label="각주 ${SUP[m]}">${m}</button>`,
  );
}

const WHO = { 서윤: 'seoyun', 정호: 'jeongho', 미영: 'miyoung', 민우: 'minwoo', 도현: 'dohyeon' };

function block(work, b, past) {
  const attr = `data-i="${b.i}"${past ? ' data-past' : ''}`;
  switch (b.t) {
    case 'stanza':
      return `<div class="stanza" ${attr}>${b.lines.map((l, n) => `<span class="verse ln" style="--li:${n}"><span class="ln-in">${esc(l)}</span></span>`).join('')}</div>`;
    case 'p':
      return `<p class="para" ${attr}>${work.id === 'critique' ? withFootnotes(b.text) : esc(b.text)}</p>`;
    case 'quote':
      return `<p class="para para--quote" ${attr}>${esc(b.text)}</p>`;
    case 'h':
      return `<h2 class="section-h" ${attr}><span class="hd">${esc(b.text)}</span></h2>`;
    case 'break':
      return `<p class="scene-break" ${attr} aria-label="장면 전환">*</p>`;
    case 'scene':
      return `<h2 class="scene-h" ${attr}><span class="hd">${esc(b.text)}</span></h2>`;
    case 'stage':
      return `<p class="stage-desc" ${attr}>${esc(b.text)}</p>`;
    case 'dir':
      return `<p class="dir" ${attr}>${esc(b.text)}</p>`;
    case 'line':
      return (
        `<p class="line" data-who="${WHO[b.speaker] || 'x'}" ${attr}><span class="line__who">${esc(b.speaker)}</span><span class="line__sep"> : </span><span class="line__what">${esc(b.text)}</span></p>` +
        (b.dir ? `<p class="dir"${past ? ' data-past' : ''}>${esc(b.dir)}</p>` : '')
      );
    case 'end':
      return `<p class="play-end" ${attr}>${esc(b.text)}</p>`;
    default:
      return '';
  }
}

// 이미지가 바뀌는 지점마다 본문 흐름 안에 이미지를 끼운다(첫 이미지는 커버가 맡는다).
function mediaCard(id) {
  return `<figure class="media" aria-hidden="true"><span class="media__img" data-media="${id}"><span class="media-label">이미지 자리: ${id}</span></span></figure>`;
}

function cast(work) {
  if (!work.cast) return '';
  return `
  <section class="cast" aria-label="등장인물">
    <h2 class="kicker">등장인물</h2>
    <dl class="cast__list">
      ${work.cast
        .map(
          (c) => `<div class="cast__item" data-who="${WHO[c.name]}">
            <dt class="cast__name">${esc(c.name)} <small>${c.age}</small></dt>
            <dd class="cast__desc">${esc(c.desc)}</dd>
          </div>`,
        )
        .join('')}
    </dl>
  </section>`;
}

function footnotes(work) {
  if (!work.footnotes) return '';
  return `
  <section class="footnotes" aria-label="각주">
    <h2 class="kicker">각주</h2>
    <ol>${work.footnotes.map((f) => `<li value="${f.n}">${esc(f.text)}</li>`).join('')}</ol>
  </section>`;
}

export function renderWork(work, { isPast = () => false } = {}) {
  const s = work.speech;
  const r = work.review;
  const meta = WORKS.find((w) => w.id === work.id);
  const cardAt = new Map();
  for (const c of CUES[work.id] || []) if (typeof c.at === 'number' && c.img && c.at > 0) cardAt.set(c.at, c.img);
  const html = (b) => (cardAt.has(b.i) ? mediaCard(cardAt.get(b.i)) : '') + block(work, b, isPast(b.i));
  let body = work.blocks.map(html).join('\n');

  // 평론: 번호 붙은 장마다 하나의 장면으로 나누고, 장면 끝에 이전·다음 이동을 둔다
  if (work.id === 'critique') {
    const scenes = [];
    for (const b of work.blocks) {
      if (b.t === 'h' || !scenes.length) scenes.push({ title: b.t === 'h' ? b.text : '', blocks: [] });
      scenes.at(-1).blocks.push(b);
    }
    body = scenes
      .map((sc, k) => {
        const prev = scenes[k - 1];
        const next = scenes[k + 1];
        return `<section class="cscene" data-scene="${k}">
          ${sc.blocks.map(html).join('\n')}
          <nav class="scene-nav" aria-label="장 이동">
            ${prev ? `<button type="button" class="scene-nav__btn" data-scene-go="${k - 1}"><small>이전 장</small><span>${esc(prev.title)}</span></button>` : '<span></span>'}
            ${next ? `<button type="button" class="scene-nav__btn scene-nav__btn--next" data-scene-go="${k + 1}"><small>다음 장</small><span>${esc(next.title)}</span></button>` : ''}
          </nav>
        </section>`;
      })
      .join('\n');
  }

  return `
  <header class="cover" data-cue-anchor="head">
    <div class="cover__img" data-media="${meta.cover}"><span class="media-label">이미지 자리: ${meta.cover}</span></div>
    <div class="cover__inner">
      ${logoHTML('emblem', 'cover__logo')}
      <p class="cover__label">${esc(work.label)}</p>
      <h1 class="cover__title">${esc(work.title)}</h1>
      <p class="cover__by">${esc(work.author)} <span>${esc(work.affiliation)}</span></p>
      <p class="cover__meta">읽는 데 약 ${meta.minutes}분</p>
      <div class="resume" role="radiogroup" aria-label="어디서부터 읽을까요" hidden>
        <button type="button" role="radio" aria-checked="true" data-resume="yes"><small>이어서 읽기</small><span class="resume__where"></span></button>
        <button type="button" role="radio" aria-checked="false" data-resume="no"><small>처음부터</small><span>${esc(work.title)}</span></button>
      </div>
      <div class="cover__actions">
        <button type="button" class="pill pill--primary" data-start="on">소리와 함께 읽기</button>
        <button type="button" class="pill" data-start="off">소리 없이 읽기</button>
      </div>
      <p class="cover__note">이어폰을 권해요. 오른쪽 위 버튼으로 언제든 소리를 끄고 켤 수 있어요.</p>
    </div>
  </header>

  ${cast(work)}

  <article class="work-body work-body--${work.id}" lang="ko">
    ${body}
  </article>

  ${footnotes(work)}

  <section class="afterword" data-cue-anchor="speech">
    <p class="kicker">${esc(work.genre)} 부문 당선작 수상소감</p>
    <h2 class="afterword__title">${esc(s.title)}</h2>
    ${s.paragraphs.map((p) => `<p class="para">${esc(p)}</p>`).join('')}
    <p class="afterword__sign">${esc(work.author)}(${esc(work.affiliation)})</p>
  </section>

  <section class="afterword" data-cue-anchor="review">
    <p class="kicker">${esc(work.genre)} 부문 심사평</p>
    <h2 class="afterword__title">${esc(r.title)}</h2>
    ${r.paragraphs.map((p) => `<p class="para">${esc(p)}</p>`).join('')}
    <p class="afterword__sign">${esc(r.judge)} ${esc(r.affiliation)}</p>
  </section>

  <nav class="work-nav" aria-label="다른 작품">
    <p class="kicker">다음 작품</p>
    ${(() => {
      const nx = WORKS[(WORKS.indexOf(meta) + 1) % WORKS.length];
      return `<a class="next-card" href="${nx.id}.html">
        <span class="next-card__img" data-media="${nx.cover}"></span>
        <span class="next-card__text">
          <small>${nx.genre} 부문 당선작 · 약 ${nx.minutes}분</small>
          <strong>${esc(nx.title)}</strong>
          <em>${esc(nx.author)} · ${esc(nx.affiliation)}</em>
        </span>
      </a>`;
    })()}
    <p class="kicker">다른 작품</p>
    <ul>
      ${WORKS.filter((o) => o.id !== work.id && o !== WORKS[(WORKS.indexOf(meta) + 1) % WORKS.length])
        .map(
          (o) => `<li><a href="${o.id}.html" data-work-link="${o.id}">
            <span class="work-nav__thumb" data-media="${o.cover}"></span>
            <span><small>${o.genre} · 약 ${o.minutes}분</small><strong>${esc(o.title)}</strong><em>${esc(o.author)}</em></span>
          </a></li>`,
        )
        .join('')}
    </ul>
    <footer class="site-foot">
      ${logoHTML('wordmark', 'site-foot__logo')}
      <p>${SITE.fullName}<br />${SITE.issue} · 이미지와 음악은 AI로 만들었어요.</p>
      <a class="pill" href="./" data-back>처음으로</a>
    </footer>
  </nav>`;
}

// 장(章) 목록: 상단 구간형 진행 바와 이동 메뉴에 쓴다.
export function chaptersOf(work) {
  const out = [];
  work.blocks.forEach((b, k) => {
    const prev = work.blocks[k - 1];
    if (k === 0) out.push({ at: b.i, label: b.t === 'h' || b.t === 'scene' ? b.text : '처음' });
    else if (b.t === 'stanza') out.push({ at: b.i, label: `${k + 1}연` });
    else if (b.t === 'h') out.push({ at: b.i, label: b.text });
    else if (b.t === 'scene' && b.text !== '무대') out.push({ at: b.i, label: b.text });
    else if (prev?.t === 'break') out.push({ at: b.i, label: `장면 ${out.length + 1}` });
  });
  if (work.id === 'poem') out[0].label = '1연';
  if (work.id === 'novel') out[0].label = '장면 1';
  out.push({ at: 'speech', label: '수상소감' }, { at: 'review', label: '심사평' });
  return out;
}
