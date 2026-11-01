# 배경음악(BGM)·효과음(SFX) 제작 가이드

이 문서만 보고 처음부터 끝까지 만들 수 있도록 정리했습니다. **회색 상자 안의 글을 통째로 복사해 음악 생성 AI 프롬프트 칸에 붙여 넣으면 됩니다.**

- 배경음악 14곡 → `public/media/audio/`
- 효과음 14개 → `public/media/sfx/`

파일 이름만 정확하면 코드는 고칠 필요가 없습니다. 파일이 없는 곡·효과음은 조용히 건너뜁니다.

---

## 1. 한눈에 보기

### 폴더와 파일 이름 규칙

```
mygm-interactive/
└─ public/
   └─ media/
      ├─ audio/   ← 배경음악. <ID>.mp3  (예: poem-a.mp3)
      └─ sfx/     ← 효과음.   <ID>.mp3  (예: sfx-shutter.mp3)
```

- 확장자는 **반드시 `.mp3`**, 이름은 **모두 소문자**이며 아래 표의 ID와 한 글자도 다르면 안 됩니다.
- **`dist/` 폴더에는 넣지 마세요.** `dist/`는 빌드할 때마다 새로 만들어지는 결과물이라 넣은 파일이 지워집니다. 항상 `public/media/…`에 넣으면 빌드할 때 자동으로 복사됩니다.
- 생성 AI가 `.wav`나 `.m4a`로 주면 4장의 변환 명령으로 mp3로 바꿔 넣으세요.

### 기본 규격

| 구분 | 길이 | 형식 | 음량 | 주의 |
|---|---|---|---|---|
| 배경음악 | 60~120초 | mp3 192kbps, 44.1kHz, 스테레오 | 약 **-16 LUFS** | 보컬 없음, **처음과 끝이 이어지는 루프**, 페이드 인·아웃 없음 |
| 효과음 | 0.3~3초 | mp3 160kbps, 44.1kHz | 약 **-18 LUFS**, 최고점 -1dB | 앞쪽 무음 없이 바로 소리가 시작되게, 끝은 자연스럽게 사라지게 |

사이트가 곡을 바꿀 때 2.2초 동안 겹쳐 넘기므로, 곡에 페이드를 넣지 않아도 됩니다.

### 추천 도구

| 용도 | 도구 예시 | 설정 |
|---|---|---|
| 배경음악 | Suno, Udio, Stable Audio, ElevenLabs Music | **Instrumental(연주곡) 켜기**, 길이 90초 안팎 |
| 효과음 | ElevenLabs Sound Effects, Stable Audio | 길이 지정(아래 표), 프롬프트 영어 그대로 |

Suno는 "Style of Music" 칸에 붙여 넣고 가사 칸은 비운 채 Instrumental을 켜세요. Udio·Stable Audio·ElevenLabs는 프롬프트 칸에 그대로 붙여 넣으면 됩니다.

---

## 2. 배경음악 14곡

각 상자에는 공통 조건(연주곡, 루프, 페이드 없음)까지 들어 있어 그대로 복사하면 됩니다.

### 시 〈비켜 놓는 일〉

#### `poem-a` → `public/media/audio/poem-a.mp3`
- **쓰이는 곳**: 1연~14연(「문틈으로 나온 손이」까지)
- **느낌**: 새벽 4시, 형광등이 웅웅대는 아파트 복도. 차갑고 고요함.
```
Minimal ambient, 60 BPM, a low warm drone like a fluorescent light hum, sparse felt piano notes with long silences between them, a softened distant elevator chime, cold and still 4 a.m. apartment hallway, intimate and restrained. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `poem-b` → `public/media/audio/poem-b.mp3`
- **쓰이는 곳**: 15연 「문이 닫혔다」~수상소감
- **느낌**: 같은 악기로 시작하되 동이 트며 따뜻해짐. 담담한 위로.
```
Gentle dawn ambient, 60 BPM, the same felt piano and soft drone palette slowly warming, delicate string pad swelling under the piano, the piano becomes a little more melodic, first light of morning, tender and restrained relief. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

### 소설 〈독립〉

#### `novel-home` → `public/media/audio/novel-home.mp3`
- **쓰이는 곳**: 아빠와 볶음밥, 밤의 거실, 통닭과 맥주
- **느낌**: 아빠와 둘이 사는 집. 따뜻하지만 조금 쓸쓸함.
```
Warm lo-fi, 78 BPM, fingerpicked acoustic guitar and soft Rhodes electric piano, gentle brushed drums, cozy small apartment kitchen in the morning, father and daughter, warm but slightly bittersweet. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `novel-shop` → `public/media/audio/novel-shop.mp3`
- **쓰이는 곳**: 사탕 가게 장면들
- **느낌**: 알록달록한 사탕 가게의 한가한 오후. 가볍지만 조금 외로움.
```
Playful soft lo-fi, 92 BPM, glockenspiel and celesta melody with light pizzicato strings over a mellow laid-back beat, a quiet boutique candy shop in the afternoon, bright colors, light and charming but a little lonely. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `novel-night` → `public/media/audio/novel-night.mp3`
- **쓰이는 곳**: 5평 원룸의 기억, 재희와 보내는 밤
- **느낌**: 밤거리, 그리움과 망설임.
```
Late-night lo-fi, 72 BPM, muffled warm synth pads, soft round bass, subtle vinyl crackle, slow dusty drums, city streets at night after work, nostalgic, uncertain, quietly longing. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `novel-snow` → `public/media/audio/novel-snow.mp3`
- **쓰이는 곳**: 첫눈~어두운 현관
- **느낌**: 첫눈이 오는 밤의 정적, 꾹 참는 슬픔.
```
Solo piano, 56 BPM, very sparse and slow, soft notes drenched in long reverb, faint winter wind and room tone in the background, first snow falling at night, hushed silence, heartbreak held back. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `novel-sea` → `public/media/audio/novel-sea.mp3`
- **쓰이는 곳**: 부산 원룸~수상소감
- **느낌**: 바다 가까운 새 방, 조심스러운 희망.
```
Open airy ambient, 70 BPM, soft clean electric guitar harmonics and warm pads, gentle ocean waves far in the background, a small new room near the sea in morning light, hopeful new beginning, calm and spacious. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

### 희곡 〈마지막으로 불이 켜지는 집〉

#### `play-room` → `public/media/audio/play-room.mp3`
- **쓰이는 곳**: 지금 시간의 거실(1막 1·2장, 4·5장, 2막 5장 앞부분)
- **느낌**: 철거 전날의 빈집. 멜로디 없이 시계 초침과 전구 소리.
```
Theatrical sound design ambience, no melody, a wall clock ticking steadily, the faint electrical hum of a single incandescent light bulb, a very low sustained cello drone underneath, an old empty house the night before demolition, tense stillness. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `play-memory` → `public/media/audio/play-memory.mp3`
- **쓰이는 곳**: 1막 3장 「그 여름의 숙제」(과거 장면)
- **느낌**: 아이가 있던 여름 오후의 기억. 아련하고 따뜻함.
```
Nostalgic memory music, 84 BPM, a gentle music box melody with soft nylon-string guitar, faint cicadas, warm tape saturation and slight detune, a hazy childhood summer afternoon remembered years later, innocent and wistful. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `play-storm` → `public/media/audio/play-storm.mp3`
- **쓰이는 곳**: 정전과 폭우 장면
- **느낌**: 거센 여름 폭우, 불안이 차오름.
```
Dark cinematic ambience, no beat, heavy summer rainstorm on windows and a roof, distant rolling thunder, a low ominous string drone rising very slowly underneath, a blackout in a small house, growing dread. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `play-night` → `public/media/audio/play-night.mp3`
- **쓰이는 곳**: 2막 새벽 장면들(누나에게~빈자리의 계약)
- **느낌**: 새벽 2시의 고백, 슬프지만 따뜻함.
```
Intimate chamber music, 58 BPM, solo piano and solo cello in slow dialogue, a quiet 2 a.m. confession between a father and daughter at a kitchen table, sorrowful but warm, tender pauses. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `play-morning` → `public/media/audio/play-morning.mp3`
- **쓰이는 곳**: 스위치를 눌러 불이 꺼진 뒤~수상소감
- **느낌**: 아침빛이 들어오는 빈 거실, 조용한 용서.
```
Gentle morning strings and piano, 66 BPM, warm chords resolving into a major key, soft birdsong far away, morning light pouring into an empty living room, release and quiet forgiveness, hopeful and calm. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

### 문예평론 〈나의 친애하는 공범들에게〉

#### `crit-a` → `public/media/audio/crit-a.mp3`
- **쓰이는 곳**: 1장~5장 앞부분
- **느낌**: 텅 빈 법정의 정적, 엄숙하고 사색적.
```
Austere minimal contemporary classical, no beat, sustained low cello and double bass drones, an occasional single soft prepared-piano note, the silence of an empty courtroom, contemplative, severe and serious. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

#### `crit-b` → `public/media/audio/crit-b.mp3`
- **쓰이는 곳**: 결론(「결국 우리에게 필요한 것은」)~수상소감
- **느낌**: 같은 악기가 현악 4중주로 열리며 연대감과 터널 끝의 빛.
```
Slow string quartet, 60 BPM, beginning from low cello and bass drones and opening into warm solemn chords, a feeling of quiet solidarity, light at the end of a long tunnel, dignified and hopeful. Instrumental only, no vocals, 90 seconds, seamless loop, no intro build-up, no fade-out ending, steady dynamics throughout.
```

---

## 3. 효과음 14개

> **효과음은 이미 모두 들어가 있습니다.** 아래 14개와 UI·전환·배경 소리 6개, 모두 20개를 Mixkit의 무료 효과음으로 채워 `public/media/sfx/`에 넣어 두었습니다(출처는 3-1).
> 바꾸고 싶은 소리만 같은 이름의 mp3로 덮어쓰면 됩니다. 파일이 없어지면 브라우저가 합성한 소리(`src/lib/synth.js`)가 대신 울립니다.
>
> 메인 화면 하단의 스피커 버튼, 작품 화면 오른쪽 위 스피커 버튼으로 모두 끌 수 있습니다(같은 설정을 공유).

### 3-1. 사용 중인 무료 효과음(출처·라이선스)

모두 [Mixkit](https://mixkit.co/free-sound-effects/)의 **Mixkit Sound Effects Free License** 음원입니다. 상업·비상업 프로젝트에 무료로 쓸 수 있고 출처 표기 의무는 없습니다. 단, 음원 파일만 따로 떼어 다시 배포하는 것은 금지입니다. 번호는 Mixkit의 효과음 번호이며 `https://assets.mixkit.co/active_storage/sfx/<번호>/<번호>-preview.mp3`에서 받았습니다.

| 파일(`public/media/sfx/`) | 쓰이는 곳 | Mixkit 원제 | 번호 |
|---|---|---|---|
| `ui-whoosh-in.mp3` | 작품 들어갈 때·다음 작품으로 | Short wind swoosh | 1461 |
| `ui-whoosh-out.mp3` | 메인으로 돌아갈 때 | Quick air woosh | 2605 |
| `ui-tap.mp3` | 버튼, 소리 켜기 | Cool interface click tone | 2568 |
| `ui-tick.mp3` | 메인 카드가 가운데에 걸릴 때 | On or off light switch tap | 2585 |
| `amb-rain.mp3` | 희곡 정전~폭우 장면의 빗소리(반복) | Rain long loop | 2394 |
| `amb-snow.mp3` | 소설 첫눈 장면의 바람(반복) | Wind blowing ambience | 2658 |
| `sfx-switch.mp3` | 희곡 스위치 | Light switch sound | 2579 |
| `sfx-thunder.mp3` | 희곡 천둥(앞 3.5초만) | Mid strength single thunder | 1298 |
| `sfx-power-off.mp3` | 희곡 정전 | Small electric glitch | 2595 |
| `sfx-door-rain.mp3` | 희곡 폭우 속 문 열림 | Creaky door open | 195 |
| `sfx-knock.mp3` | 희곡 노크 | Knocking on a thick wooden door | 197 |
| `sfx-machine.mp3` | 희곡 공사 장비 시동(앞 3초만) | Truck start engine | 1623 |
| `sfx-elevator.mp3` | 시 1연 | Elevator tone | 2863 |
| `sfx-water-thud.mp3` | 시 9연 | Plastic hit | 3204 |
| `sfx-shutter.mp3` | 시 12연 | Camera shutter click | 1133 |
| `sfx-door-lock.mp3` | 시 13연 | Door key in door lock | 2842 |
| `sfx-door-close.mp3` | 시 15연 | Door hard shut | 196 |
| `sfx-shop-bell.mp3` | 소설 가게 문 종 | Cartoon door melodic bell | 110 |
| `sfx-candy-drop.mp3` | 소설 사탕 떨어짐 | Tv remote control or plastic toy drop | 3088 |
| `sfx-can-open.mp3` | 소설 캔 따기 | Food can quick opening | 116 |

UI 소리는 애플식으로 짧고 작게(버튼 0.04초, 소리 크기 18% 안팎) 맞췄고, 같은 페이지 안의 장면 이동과 소리 끄기에는 소리를 내지 않습니다. 배경음악은 55%, 장면 효과음은 배경음악보다 작게 깔립니다.

소리별 음량과 "앞 몇 초만" 같은 설정은 `src/lib/audio.js`의 `SFX_OPTS`(장면 효과음)와 `src/lib/synth.js`의 `UI_FILES`·`AMB`(UI·배경 소리)에서 숫자로 조절합니다.

효과음은 **아래로 읽어 내려가다 해당 문장이 화면 가운데에 닿는 순간 한 번** 울립니다. 위로 되돌아갈 때는 울리지 않습니다. 희곡의 `sfx-switch`만 스위치를 누르는 순간 울립니다.

| ID | 작품 | 울리는 문장 | 길이 |
|---|---|---|---|
| `sfx-elevator` | 시 | 1연 「새벽 네 시 / 엘리베이터 거울에는」 | 1.5초 |
| `sfx-water-thud` | 시 | 9연 「한 번은 쿵 소리가 났다」 | 1초 |
| `sfx-shutter` | 시 | 12연 「사진을 찍을 때마다」 | 0.5초 |
| `sfx-door-lock` | 시 | 13연 「안쪽에서 잠금쇠가 돌아갔다」 | 1초 |
| `sfx-door-close` | 시 | 15연 「문이 닫혔다」 | 1.5초 |
| `sfx-shop-bell` | 소설 | 「가게 문이 짤랑거리는 종소리를 내며 열렸다」 | 2초 |
| `sfx-candy-drop` | 소설 | 「떨어진 사탕이 바닥에 부딪히는 소리」 | 1초 |
| `sfx-can-open` | 소설 | 「캔이 시원한 소리를 내며 열렸다」 | 1초 |
| `sfx-knock` | 희곡 | (노크. 미영이 반찬통을 들고 들어온다.) | 1.5초 |
| `sfx-thunder` | 희곡 | (천둥. 서윤이 창밖을 본다.) | 3초 |
| `sfx-power-off` | 희곡 | (갑자기 전등이 꺼진다.) | 1초 |
| `sfx-door-rain` | 희곡 | (문이 열리며 거센 빗소리. …) | 3초 |
| `sfx-machine` | 희곡 | (멀리서 공사 장비의 시동 소리가 들린다.) | 3초 |
| `sfx-switch` | 희곡 | 독자가 스위치를 누를 때 | 0.4초 |

#### `sfx-elevator` → `public/media/sfx/sfx-elevator.mp3`
```
A single soft apartment elevator arrival chime, quiet and slightly distant, in an empty concrete hallway at night, short natural reverb, no voices, 1.5 seconds.
```

#### `sfx-water-thud` → `public/media/sfx/sfx-water-thud.mp3`
```
A heavy six-pack of plastic water bottles set down a little too hard on a concrete floor, a dull thud followed by water sloshing inside the bottles, quiet hallway, no voices, 1 second.
```

#### `sfx-shutter` → `public/media/sfx/sfx-shutter.mp3`
```
A single quiet smartphone camera shutter click, clean and close, no voices, 0.5 seconds.
```

#### `sfx-door-lock` → `public/media/sfx/sfx-door-lock.mp3`
```
An apartment door lock being turned from the inside, a soft metallic latch click and bolt sliding, heard from the hallway, no voices, 1 second.
```

#### `sfx-door-close` → `public/media/sfx/sfx-door-close.mp3`
```
A heavy apartment front door closing gently and latching shut, a soft muffled thump, heard from the hallway outside, short reverb, no voices, 1.5 seconds.
```

#### `sfx-shop-bell` → `public/media/sfx/sfx-shop-bell.mp3`
```
A small brass shop door bell jingling as a door opens, bright and cheerful, small quiet shop interior, no voices, 2 seconds.
```

#### `sfx-candy-drop` → `public/media/sfx/sfx-candy-drop.mp3`
```
A large hard candy lollipop falling onto a tiled shop floor with a dull knock and a small crack, a few tiny shards skittering, no voices, 1 second.
```

#### `sfx-can-open` → `public/media/sfx/sfx-can-open.mp3`
```
A cold beer can being opened, a crisp pop and fizzing hiss, close and clean, quiet kitchen at night, no voices, 1 second.
```

#### `sfx-knock` → `public/media/sfx/sfx-knock.mp3`
```
Three gentle knocks on an old wooden front door, polite and hesitant, heard from inside a quiet house, no voices, 1.5 seconds.
```

#### `sfx-thunder` → `public/media/sfx/sfx-thunder.mp3`
```
A single deep thunder clap rolling away into the distance during heavy summer rain, heard from inside a small house, no voices, 3 seconds.
```

#### `sfx-power-off` → `public/media/sfx/sfx-power-off.mp3`
```
Sudden power outage in a small house, an electrical buzz cutting off abruptly and a light bulb filament ticking as it dies, then silence, no voices, 1 second.
```

#### `sfx-door-rain` → `public/media/sfx/sfx-door-rain.mp3`
```
A wooden front door swinging open into a violent summer rainstorm, heavy rain rushing in loudly, wind gust, no voices, 3 seconds.
```

#### `sfx-machine` → `public/media/sfx/sfx-machine.mp3`
```
A distant heavy construction excavator engine starting up and idling, heard from inside a quiet empty house in the early morning, muffled by walls, no voices, 3 seconds.
```

#### `sfx-switch` → `public/media/sfx/sfx-switch.mp3`
```
A single old plastic wall light switch being flipped off, a crisp mechanical click, close and dry, no voices, 0.4 seconds.
```

---

## 4. 다듬고 옮기기

### 4-1. 고르기
- 배경음악은 한 번에 2~4개를 만들어 **처음 3초와 마지막 3초를 이어 들었을 때 어색하지 않은 것**을 고르세요. 루프 이음새가 가장 중요합니다.
- 효과음은 **소리가 바로 시작되는 것**을 고르세요. 앞에 무음이 길면 문장과 박자가 어긋납니다.

### 4-2. 변환과 음량 맞추기(ffmpeg)
ffmpeg가 없으면 먼저 설치합니다.
```bash
brew install ffmpeg
```

내려받은 파일이 있는 폴더에서 실행하세요. `내려받은파일.wav`와 끝의 ID만 바꾸면 됩니다.

배경음악(음량 -16 LUFS, mp3 192kbps):
```bash
ffmpeg -i 내려받은파일.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -ac 2 -b:a 192k ~/Desktop/mygm-interactive/public/media/audio/poem-a.mp3
```

효과음(앞쪽 무음 자르기 + 음량 -18 LUFS, mp3 160kbps):
```bash
ffmpeg -i 내려받은파일.wav -af "silenceremove=start_periods=1:start_threshold=-50dB,loudnorm=I=-18:TP=-1" -ar 44100 -ac 2 -b:a 160k ~/Desktop/mygm-interactive/public/media/sfx/sfx-shutter.mp3
```

이미 mp3인데 음량만 맞추려면 입력 파일 이름만 `.mp3`로 바꿔 같은 명령을 쓰면 됩니다. 출력 파일 이름이 입력과 같으면 안 되니, 다른 폴더에서 실행하세요.

### 4-3. 확인
```bash
cd ~/Desktop/mygm-interactive && npm run dev
```
1. 브라우저에서 작품을 열고 **소리와 함께 읽기**를 누릅니다.
2. 해당 장면까지 내려가 곡이 바뀌는지, 효과음이 문장과 맞는지 들어 봅니다.
3. 파일 이름이 틀리면 개발자 도구 콘솔에 `[audio] poem-a.mp3 없음` 또는 `[sfx] sfx-shutter.mp3 없음`이 찍힙니다.

효과음이 울리는 위치를 바꾸려면 `src/content/cues.js`의 `sfx:` 줄을 옮기면 됩니다. 숫자는 문단 번호(`src/content/<작품>.json`의 `"i"`)입니다.

---

## 5. 체크리스트

배경음악 → `public/media/audio/`
- [ ] poem-a.mp3
- [ ] poem-b.mp3
- [ ] novel-home.mp3
- [ ] novel-shop.mp3
- [ ] novel-night.mp3
- [ ] novel-snow.mp3
- [ ] novel-sea.mp3
- [ ] play-room.mp3
- [ ] play-memory.mp3
- [ ] play-storm.mp3
- [ ] play-night.mp3
- [ ] play-morning.mp3
- [ ] crit-a.mp3
- [ ] crit-b.mp3

효과음 → `public/media/sfx/`
- [ ] sfx-elevator.mp3
- [ ] sfx-water-thud.mp3
- [ ] sfx-shutter.mp3
- [ ] sfx-door-lock.mp3
- [ ] sfx-door-close.mp3
- [ ] sfx-shop-bell.mp3
- [ ] sfx-candy-drop.mp3
- [ ] sfx-can-open.mp3
- [ ] sfx-knock.mp3
- [ ] sfx-thunder.mp3
- [ ] sfx-power-off.mp3
- [ ] sfx-door-rain.mp3
- [ ] sfx-machine.mp3
- [ ] sfx-switch.mp3
