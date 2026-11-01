// 끊김 없는 반복 재생.
// 브라우저의 기본 반복(loop)은 곡 끝에서 툭 끊긴 뒤 처음부터 다시 시작한다(끝이 잦아드는 곡은 잠깐 무음이 생긴다).
// 그래서 곡이 끝나기 몇 초 전에 같은 곡을 하나 더 무음에서 틀고, 둘을 교차시켜 넘긴다.
import { Howl } from 'howler';

export class Looper {
  /**
   * @param {string} src
   * @param {{ xfade?: number, onloaderror?: () => void }} opts xfade: 교차 시간(초)
   */
  constructor(src, { xfade = 4, onloaderror } = {}) {
    this.xfade = xfade;
    this.vol = 0; // 목표 음량
    this.cur = null; // 지금 들리는 재생 id
    this.timer = 0;
    this.active = false;
    this.howl = new Howl({
      src: [src],
      html5: true, // 긴 파일을 통째로 풀지 않고 흘려 듣는다
      preload: true,
      volume: 0,
      onloaderror: () => onloaderror?.(),
    });
  }

  get playing() {
    return this.active;
  }

  /** 지금 음량에서 v까지 ms 동안 바꾼다. 멈춰 있었다면 무음에서 시작한다. */
  fadeTo(v, ms) {
    this.vol = v;
    if (!this.active) {
      if (v <= 0) return;
      this.active = true;
      this.cur = this.howl.play();
      this.howl.volume(0, this.cur);
      this.schedule();
    }
    this.howl.fade(this.howl.volume(this.cur), v, ms, this.cur);
    this.settle(ms);
  }

  // 페이드가 느려지거나 멈춰도(탭이 가려진 경우 등) 끝나는 시점에 목표 음량을 확실히 맞춘다
  settle(ms) {
    clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => {
      if (this.active && this.cur != null) this.howl.volume(this.vol, this.cur);
    }, ms + 60);
  }

  /** 서서히 줄인 뒤 멈춘다. */
  fadeOutAndStop(ms) {
    if (!this.active) return;
    this.fadeTo(0, ms);
    const id = this.cur;
    clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(() => {
      if (this.vol > 0) return; // 그사이 다시 켜졌으면 둔다
      this.stop(id);
    }, ms + 80);
  }

  stop() {
    clearTimeout(this.timer);
    clearTimeout(this.stopTimer);
    this.active = false;
    this.howl.stop();
    this.cur = null;
  }

  // 곡이 끝나기 xfade초 전에 다음 회차를 시작하도록 예약
  schedule() {
    clearTimeout(this.timer);
    const d = this.howl.duration();
    if (!d) {
      this.howl.once('load', () => this.active && this.schedule());
      return;
    }
    const pos = Number(this.howl.seek(this.cur)) || 0;
    const wait = Math.max(0.2, d - pos - this.xfade);
    this.timer = setTimeout(() => this.cross(), wait * 1000);
  }

  cross() {
    if (!this.active) return;
    const old = this.cur;
    const ms = this.xfade * 1000;
    const next = this.howl.play();
    this.howl.volume(0, next);
    this.howl.fade(0, this.vol, ms, next);
    this.howl.fade(this.howl.volume(old), 0, ms, old);
    setTimeout(() => this.howl.stop(old), ms + 120);
    this.cur = next;
    this.settle(ms);
    this.schedule();
  }

  /** 페이지를 떠날 때 등, 남은 소리를 ms 안에 모두 줄인다. */
  fadeAll(ms) {
    if (!this.active) return;
    this.vol = 0;
    clearTimeout(this.timer);
    this.howl._sounds.forEach((s) => s._paused || this.howl.fade(this.howl.volume(s._id), 0, ms, s._id));
  }
}
