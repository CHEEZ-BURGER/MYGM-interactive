# 이미지 작업 인계서

고대신문 창간 79주년 문예공모 인터랙티브 기사(`mygm-interactive`)의 이미지를 고치고 채우는 작업을 위한 문서입니다. **이 문서만 보고 작업할 수 있게** 썼습니다.

- 작업 범위:
  - **A. 이미 넣은 이미지 중 고칠 것 2장**
  - **B. 아직 없는 이미지 24장 만들기**
- 결과물을 넣을 곳: `public/media/img/<ID>.webp`. 파일 이름만 맞으면 코드는 고칠 필요가 없습니다.
- 작업 전에 꼭 지킬 것: **본문 글자는 절대 고치지 않습니다**(수상자 동의 조건). 이미지 위치를 바꾸고 싶으면 직접 고치지 말고 제안으로 남겨 주세요(6장 참고).

---

## 1. 지금 그림체: 새 이미지도 이것에 맞춰 주세요

지금까지 들어간 24장(`poem-01~09`, `novel-01·09·10`, `play-01~05`, `crit-01~07`)은 모두 **같은 그림체**입니다. `docs/PROMPTS.md`에는 작품마다 다른 스타일(필름 사진, 리소그래프 등)이 적혀 있지만, **실제로 쓰기로 한 것은 지금 들어간 그림체**입니다. 새 이미지는 이쪽에 맞춰 주세요.

- 어두운 그래픽노블풍 일러스트. 펜·잉크 선에 수채화 같은 얇은 질감
- 영화 같은 조명: 차갑고 채도가 낮은 남청·회청색 그림자, 그 안에 따뜻한 호박색 실내등이나 창빛 한두 줄기
- 조용하고 쓸쓸한 분위기, 한국의 평범한 생활 공간(아파트 복도, 원룸, 단층집, 동네 골목)
- 사람은 뒷모습, 손, 실루엣 위주. **얼굴이 정면으로 또렷이 보이지 않게**
- 글자, 간판 문구, 로고, 워터마크 없음

모든 프롬프트 끝에 붙일 공통 꼬리말(영어 그대로):
```
, dark graphic-novel illustration, ink linework with subtle watercolor wash texture, cinematic lighting, cool desaturated blue-gray shadows with a single warm amber light source, quiet melancholic mood, everyday Korean setting, 16:9, main subject centered, no text, no letters, no logos, no watermark, faces hidden, turned away or in shadow, full-bleed image with no border or frame
```

### 규격

| 항목 | 값 |
|---|---|
| 크기 | **1376×768**(지금 이미지와 같음). 최소 1280×720 |
| 형식 | **webp**, 품질 80 안팎, 장당 100~250KB |
| 테두리 | **없음.** 화면 끝까지 꽉 차야 합니다(아래 A-1 참고) |
| 구도 | 휴대폰에서는 가운데가 4:3으로 잘려 보입니다. **핵심은 가운데 60% 안에** |
| 파일 이름 | 아래 표의 ID 그대로, 소문자 (예: `novel-02.webp`) |

webp 변환 예시(macOS, `cwebp`가 없으면 `brew install webp`):
```bash
cwebp -q 80 -resize 1376 768 원본.png -o ~/Desktop/mygm-interactive/public/media/img/novel-02.webp
```

---

## 2. A. 이미 넣은 이미지 중 고칠 것

### A-1. `crit-06.webp`: 흰 종이 테두리 제거 (필수)
- **문제**: 이 그림만 가장자리에 **크림색 종이 테두리**가 있습니다. 다른 이미지는 모두 화면 끝까지 꽉 차 있어서, 본문 안에서 이것만 액자처럼 떠 보입니다.
- **쓰이는 곳**: 문예평론 4장, 「남자가 죽은 이후, 기진은 진화와 함께 그를 땅에 묻는다」 문단 바로 위
- **고치는 법**: 둘 중 하나를 고르세요.
  1. 테두리 안쪽 그림만 잘라 내 1376×768로 다시 맞춥니다(가장 빠름. 비율이 맞는지 확인).
  2. 다시 생성합니다. 프롬프트:
```
A shovel standing upright in freshly turned dark earth in a woodland clearing at night, crescent moon, faint fog, the glowing outline of a plastic mushroom-farm greenhouse in the background, no people
```
  (뒤에 1장의 공통 꼬리말을 붙이세요)

### A-2. `poem-01.webp`: 배달하는 사람의 얼굴 가리기 (권장)
- **문제**: 시의 첫 연은 「엘리베이터 거울에는 / 상자 위로 내 눈만 떠 있었다」입니다. 그런데 그림에는 상자가 턱까지만 와서 **얼굴이 다 보입니다.** 이 시의 화자는 이름도 얼굴도 드러나지 않는 사람이라는 점이 핵심입니다(수상소감: "시 속의 사람에게는 이름이 없습니다").
- **이 이미지가 쓰이는 곳(세 군데)**:
  - 시 페이지 커버
  - 메인 화면의 시 카드와 배경
  - 공유 이미지 `og-poem.jpg`, `og-hub.jpg`
- **고치는 법**: 상자를 눈 바로 아래까지 쌓아 **눈만 보이게** 다시 생성합니다. 모자챙 그림자로 눈까지 어둡게 해도 좋습니다. 구도, 색, 엘리베이터 거울 배경은 지금 그림을 그대로 참고 이미지로 쓰세요.
```
Inside a small apartment elevator at 4 a.m., seen in the mirrored back wall: a delivery worker in a cap holding a tall stack of cardboard boxes that covers his whole face up to just below the eyes, only a pair of tired eyes visible above the boxes, cap brim shading them, stainless steel panels, cold fluorescent light, no people other than the reflection
```
- 다시 만들면 **`og-poem.jpg`, `og-hub.jpg`도 같은 그림으로 다시 만들어야** 합니다. 두 파일은 이 그림 위에 제목 글자를 얹은 공유용 이미지입니다(1200×630).

### 참고(고치지 않아도 됨)
- `crit-03.webp`(거친 밤바다): 지금 자리(하쿠를 소개하는 문단)도 괜찮습니다. 다만 결말의 「바다를 등지고 아무리 멀리 가도…」 문단으로 옮기면 인용과 더 잘 맞물립니다. 옮길지는 담당자 판단에 맡기고, 옮기려면 6장의 방법을 따르세요.
- 이미 반영한 위치 이동: `play-05`, `crit-05`, `crit-06`, `crit-07`은 장면이 실제로 나오는 문단으로 옮겼습니다. 다시 옮기지 마세요.

---

## 3. B. 아직 없는 이미지 24장

각 표의 **위치**는 "이 문단 바로 위에 이미지가 들어간다"는 뜻입니다. 프롬프트 뒤에는 1장의 공통 꼬리말을 붙이세요.

### 3-1. 소설 〈독립〉 13장

**인물 설정**: 이미 있는 `novel-09`, `novel-10`과 맞춰 주세요.
- **서진**: 20대 중반 여성, 어깨 아래 긴 검은 머리, 어두운 재킷
- **재희**: 20대 중반 남성, 짧은 검은 머리, 청재킷
- **아빠**: 50대 남성
- **루이**: 사탕 가게 사장, 40~50대 여성, 긴 웨이브 머리

**배경**: 계절은 가을 끝자락에서 첫눈까지입니다.

| ID | 위치(이 문단 바로 위) | 장면 | 프롬프트 |
|---|---|---|---|
| `novel-02` | 「아빠의 말에 떠밀리듯 집을 나왔다…」 | 가을 끝 버스정류장으로 달려감 | A suburban bus stop in late autumn, dry leaves blowing in a chilly wind, a young woman with long dark hair running toward an arriving bus, seen from behind |
| `novel-03` | 「사탕 가게에서 아르바이트를 하게 된 것은…」 | 사탕 가게 내부 | Interior of a small boutique candy shop, shelves of glass jars full of colorful candies, giant lollipops, a wooden counter with a register, a young woman clerk seen from behind, quiet afternoon light |
| `novel-04` | 「가게 문이 짤랑거리는 종소리를 내며 열렸다…」 | 카운터 위의 큰 꽃다발 | A large bouquet of roses lying on a candy shop counter, glittering under white shop lights, a broom leaning nearby, evening, the shop door with a small brass bell |
| `novel-05` | 「이야기를 들은 아빠는 네가 드디어 미쳤구나, 했다…」 (같은 그림을 「집에는 아직 잠들지 않은 아빠가 TV 앞에…」에도 한 번 더 씀) | 밤, TV 앞의 아빠 | A Korean apartment living room at night lit only by the glow of a TV, a middle-aged man lying on the floor in front of it seen from behind, folded laundry nearby |
| `novel-06` | 「사탕 가게에서 들렸을 때 가장 소름 돋는 소리는…」 | 바닥에 떨어져 깨진 큰 막대사탕 | A giant swirl lollipop cracked on a tiled candy shop floor, a few shards scattered, low angle, shelves of candy jars blurred behind |
| `novel-07` | 「두 사람은 지금쯤 만났으려나…」 | 편의점 계산대, 포장 테이프 | A convenience store counter at 6 p.m., a roll of packing tape on the counter, a barcode scanner, only the young male clerk's hands visible, fluorescent light, rows of goods behind |
| `novel-08` | 「월세 45만 원을 주고 살던 나의 5평짜리 방…」 | 기억 속의 작은 원룸 | A cramped tiny studio room at night, a single bed, desk and small wardrobe filling the whole space, curtains that let in no light, the glow of a laptop on the desk, loneliness |
| `novel-11` | 「일을 마친 뒤 재희를 만나 늦게까지 하는 식당에서 수제버거를…」 | 첫눈이 내리기 시작하는 밤 | First snow beginning to fall at night outside a late-night burger restaurant with a warm glowing window, a young woman and a young man walking away side by side, snowflakes resting on their shoulders |
| `novel-12` | 「둘다 한동안 말이 없었다. 눈이 오면…」 | 눈 내린 거리의 정적 | A silent snowy residential street at night under a single streetlight, two sets of footprints in the snow that stop facing each other, heavy stillness |
| `novel-13` | 「힘 없는 손으로 현관문을 열었다…」 | 불 꺼진 현관과 소파 | A dark apartment entryway at night, a shoe cabinet with no men's dress shoes on it, a sofa with a blanket thrown over it, faint light from the window |
| `novel-14` | 「지금 보니 아빠의 한 손에는 검정 비닐 봉투가…」 | 늦은 밤 통닭과 맥주 두 캔 | A late-night kitchen table, a black plastic bag, fried chicken in a paper box, two tall beer cans just opened, a drumstick on a small plate, a single warm pendant lamp |
| `novel-15` | 「아르바이트 마지막 날에는…」 | 마지막 날, 깨진 사탕 선물 | A candy shop at closing time on the last day, a large cracked candy in a cellophane wrap held out on an open palm, a small suitcase waiting by the door, soft warm light |
| `novel-16` | 「부산에서 지내게 된 방은…」 | 바다가 보이는 7평 원룸 | A small studio room in Busan with a bed, desk and wardrobe and a little empty space in the middle, a window showing the sea and harbor in early morning light, a fresh start, slightly brighter and warmer than the other images |

### 3-2. 희곡 〈마지막으로 불이 켜지는 집〉 10장

**모두 같은 무대 세트입니다.** `play-01.webp`를 **참조 이미지**로 넣고 조명과 소품만 바꿔 달라고 요청하세요(이미지 투 이미지, 편집 기능, 스타일·구도 참조).

**고정할 것**:
- 객석 정면에서 본 단층집 거실
- 천장 가운데 매달린 알전구, 벽시계, 가족사진 액자, 창문
- 왼쪽의 작은 방문, 가운데 뒤쪽의 출입구, 오른쪽의 현관문
- 나무 식탁과 의자, 현관 앞 신발

**장면이 지날수록 가구가 하나씩 사라집니다**(원작 지문). 사람은 넣지 않습니다.

세트 공통 설명(각 프롬프트 앞에 붙임):
```
Theatrical stage set seen straight-on from the audience, the same living room of an old one-story Korean house as the reference image: a single bare bulb hanging at the center, a wall clock, a family photo frame, a window, a small bedroom door at left, a doorway at the back, the front door at right, a wooden dining table with chairs, dark stage wings, no actors,
```

| ID | 위치(이 문단 바로 위) | 장면 | 프롬프트(세트 설명 뒤에) |
|---|---|---|---|
| `play-06` | 제1막 제4장-철거하는 사람 | 밤 9시, 안전모 | 9 p.m., the bulb lit, a white safety helmet and a document case on the table, pencil height marks on the wall lit by the bulb |
| `play-07` | 제1막 제5장-봉투 | 밤 11시, 바랜 봉투 | 11 p.m., a yellowed old envelope on the table under the lit bulb, the small bedroom door closed with a thin line of light beneath it |
| `play-08` | 제2막 제1장-누나에게 | 새벽 1시, 아이 방 | 1 a.m., the small bedroom door open revealing a child's desk with a small notebook, a folded sheet of paper and a paper airplane, cool moonlight, the living room bulb still lit |
| `play-09` | 제2막 제2장-말하지 않은 죄 | 새벽 2시, 마주 놓인 의자 | 2 a.m., two chairs facing each other across the table, two untouched glasses of water, the lit bulb as the only light, everything else in deep shadow |
| `play-10` | 제2막의 새벽, 집의 설계도 | 낡은 설계도 | an old yellowed architectural blueprint of the small house unfolded on the table, the lit bulb overhead, dawn blue beginning at the window |
| `play-11` | 제2막 제3장-없는 사람의 자리 | 새벽 3시 반, 낡은 운동화 | 3:30 a.m., the small bedroom door wide open, a pair of old child's sneakers with neatly tied laces on the floor in front of it, the lit bulb |
| `play-12` | 제2막 제4장-빈자리의 계약 | 새벽 5시, 비어 가는 집 | 5 a.m., most furniture gone, a pale rectangle on the wall where the family photo used to hang, pencil height marks beside it, the lit bulb, early blue light |
| `play-13` | 제2막 제5장-꺼지는 연습 | 아침 7시, 텅 빈 거실 | 7 a.m., the room almost empty: only the table, two chairs and the lit bulb, cold blue morning outside the windows, one last tangerine on the table |
| `play-14` | (정호가 스위치를 누른다. 전구가 꺼진다. …) | 불이 꺼지고 아침빛 | the bulb just switched off, warm golden morning light pouring through the gap of the open front door across the bare floor, dust floating in the light, **brighter than all other play images** |
| `play-15` | (두 사람이 나간다. 빈 거실. …) | 빈 무대, 귤껍질 | the empty stage, the front door wide open to morning light, a broken tangerine peel lying under the table, the dark unlit bulb, the faint translucent outline of a paper airplane on the floor, **bright** |

`play-14`, `play-15`는 독자가 스위치를 눌러 불을 끈 뒤 **화면 전체가 밝은 아침 색으로 바뀐 상태**에서 보입니다. 다른 희곡 이미지보다 확실히 밝게 만들어 주세요.

### 3-3. 문예평론 〈나의 친애하는 공범들에게〉 1장

| ID | 위치(이 문단 바로 위) | 장면 | 프롬프트 |
|---|---|---|---|
| `crit-08` | 「결국 우리에게 필요한 것은 스스로를 거대한 주범으로 상정하는 일도…」 | 긴 터널 끝의 첫 빛 | The exit of a long dark highway tunnel opening onto the first light of dawn, two small silhouettes standing side by side at the mouth of the tunnel, seen from inside the tunnel, no faces |

`crit-07`(터널 속 사고 차량)과 같은 터널처럼 보이게 `crit-07.webp`를 참조 이미지로 쓰세요.

---

## 4. 검수 체크리스트

이미지마다 아래를 확인해 주세요.

- [ ] 1376×768 webp, 250KB 이하
- [ ] 테두리·여백 없이 화면 끝까지 꽉 참
- [ ] 글자, 로고, 워터마크 없음
- [ ] 얼굴이 정면으로 또렷하지 않음
- [ ] 1장의 그림체(어두운 그래픽노블, 남청 그림자와 호박색 빛)와 같은 계열
- [ ] 위치 문단을 실제로 읽어 보고 장면이 맞는지(그 문단보다 **앞서** 일어날 일을 보여 주지 않는지)
- [ ] 희곡: `play-01`과 같은 세트로 보이는지(문, 창, 시계 위치)
- [ ] 소설: 인물 생김새가 `novel-09`, `novel-10`과 이어지는지

---

## 5. 넣고 확인하기

```bash
cd ~/Desktop/mygm-interactive && npm run dev
```
1. 브라우저에서 작품을 열고 해당 장면까지 내려갑니다.
2. 개발 화면에서는 아직 없는 이미지 자리에 `이미지 자리: novel-02` 같은 표시가 왼쪽 아래에 보입니다. 파일을 넣으면 그 자리에 바로 그림이 뜹니다.
3. 배포 화면(`npm run build` 뒤 `npx vite preview`)에서는 파일이 없는 자리가 자동으로 빠집니다. 넣으면 자동으로 나타납니다.

---

## 6. 이미지 위치를 바꾸고 싶을 때

위치는 `src/content/cues.js`에서 정합니다. 예: `{ at: 39, img: 'crit-07' }`. `at`의 숫자는 `src/content/<작품>.json`에 있는 문단의 `"i"` 값이고, 이미지는 그 문단 **바로 위**에 들어갑니다. 같은 줄에 `audio`, `fx`, `pulse`, `sfx`가 함께 있으면 그 값은 그 문단에 그대로 두고 `img`만 옮기세요(음악·효과가 바뀌는 시점이 함께 움직이지 않게). 목록은 문단 번호 순서를 유지해야 합니다.

**직접 고치기보다 제안으로 남겨 주세요.** 원래 담당자가 확인한 뒤 반영합니다.

---

## 7. 하지 말 것

- 본문 텍스트(`src/content/*.json`)를 고치지 않습니다.
- 파일 이름을 바꾸거나 새 ID를 만들지 않습니다(코드가 이름으로 찾습니다).
- `og-*.jpg` 공유 이미지는 A-2를 할 때만 다시 만듭니다.
- `dist/` 폴더에 넣지 않습니다(빌드할 때마다 지워집니다).
