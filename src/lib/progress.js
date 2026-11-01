// 작품별 읽은 위치(이어 읽기, 메인 카드의 진도 표시에 쓴다)

const key = (id) => `mungye:progress:${id}`;

/** @returns {{ i: number, pct: number, label: string, scene?: number } | null} */
export function getProgress(id) {
  try {
    return JSON.parse(localStorage.getItem(key(id)));
  } catch {
    return null;
  }
}

export function setProgress(id, data) {
  try {
    localStorage.setItem(key(id), JSON.stringify(data));
  } catch {
    /* 저장 불가 환경 */
  }
}
