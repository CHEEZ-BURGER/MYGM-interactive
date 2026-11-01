// 한글 웹폰트는 글자 범위별로 나뉘어 필요할 때 받아진다. 화면이 움직이는 도중에 받아지면
// 대체 글꼴 → 웹폰트로 바뀌며 글자가 깜빡이고, 줄 나눔도 어긋난다.
// 그래서 이 페이지에 쓰인 글자만 골라 미리 받아 두고, 준비가 끝난 뒤에 장면을 연다.

const uniq = (s) => [...new Set(s.replace(/\s+/g, ''))].join('');

export function preloadFonts({ serif = '', sans = '' } = {}, timeout = 4000) {
  if (!document.fonts?.load) return Promise.resolve();
  const jobs = [];
  if (serif) jobs.push(document.fonts.load('400 16px "Noto Serif KR"', uniq(serif)));
  if (sans) jobs.push(document.fonts.load('600 16px "Pretendard Variable"', uniq(sans)));
  return Promise.race([Promise.allSettled(jobs), new Promise((r) => setTimeout(r, timeout))]).then(() => {
    document.documentElement.classList.add('is-ready');
  });
}
