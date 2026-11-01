# 고대신문 창간 79주년 문예공모 — 이미지 생성 프롬프트

만든 파일은 아래 **파일명 그대로** 넣으면 사이트에 바로 반영됩니다. 코드는 고칠 필요가 없습니다.

- 이미지 → `public/media/img/<ID>.webp` (`.jpg`, `.png`도 됩니다)
- 음악 → `public/media/audio/<ID>.mp3`

파일이 없는 동안에는 작품 색 그라데이션과 무음으로 대신 동작합니다. 개발 서버에서는 화면 왼쪽 아래에 `이미지 자리: <ID>` 표시가 뜹니다. 배포 사이트에서는 주소 뒤에 `?debug`를 붙이면 보입니다.
어느 문단에서 어떤 이미지·음악으로 바뀌는지는 `src/content/cues.js`에서 정합니다.

---

## 0. 공통 규격

### 이미지
| 항목 | 규격 |
|---|---|
| 비율·크기 | **16:9**, 가로 2400px 이상(최소 1920×1080) |
| 구도 | 휴대폰에서는 화면 가운데가 세로로 잘려 보입니다. **핵심 피사체는 화면 가운데 40% 폭 안에** 두세요 |
| 밝기 | 이미지 위에 글자가 올라갑니다. 전체적으로 **어둡고 여백이 많게** 만들어 주세요(희곡 `play-14`, `play-15`만 밝게) |
| 금지 | 읽을 수 있는 글자, 로고, 워터마크, 실존 인물, **정면 얼굴**(손·뒷모습·실루엣·사물 위주로) |
| 최적화 | 업로드 전 webp(품질 80) 또는 jpg(품질 82)로 변환해 장당 500KB 안팎으로 맞추세요 |

모든 프롬프트 끝에 공통 꼬리말을 붙입니다.
```
, 16:9 aspect ratio, main subject centered, dark and uncluttered with generous negative space, no text, no letters, no logos, no watermark, no visible faces
```

### 음악
배경음악과 효과음은 [AUDIO.md](AUDIO.md)를 보세요(복사용 프롬프트, 파일 이름, 넣을 위치, 변환 명령까지 정리).

---

## 1. 시 〈비켜 놓는 일〉 — 새벽 필름 사진

**스타일 가이드**: 35mm 필름 사진, 동트기 전 블루아워, 형광등과 센서등 빛, 차가운 남색 위에 호박색 빛 한 점. 시의 화자에게는 이름이 없으므로 **사람은 손과 몸의 일부로만** 보여줍니다.

스타일 꼬리말:
```
, 35mm film photograph, blue hour before dawn, cold fluorescent and motion-sensor lighting, desaturated navy blues with a single warm amber accent, fine film grain, shallow depth of field, Korean apartment building interior, quiet and still, cinematic
```

| ID | 위치 | 장면 | 프롬프트 |
|---|---|---|---|
| `poem-01` | 1연 | 새벽 네 시, 엘리베이터 거울 | Inside a small apartment elevator at 4 a.m., a mirrored wall reflecting a tall stack of cardboard delivery boxes carried in someone's arms, only a pair of tired eyes just visible above the boxes, stainless steel panels, flickering fluorescent ceiling light |
| `poem-02` | 3연 | 문이 바깥으로 열렸다 | An apartment front door swinging outward into a narrow corridor and pushing a cardboard box across the floor, warm light leaking from inside, cold blue corridor |
| `poem-03` | 5연 | 아이 신발이 나란한 집 | Corridor floor in front of an apartment door, a small pair of child's sneakers neatly lined up beside the doormat, a delivery box placed carefully off to one side, clear of the door's swing path |
| `poem-04` | 6연 | 생수가 바닥에 닿기 직전 | Close-up of gloved hands lowering a six-pack of bottled water wrapped in plastic toward a concrete corridor floor, the instant before it touches down, water inside the bottles catching the light |
| `poem-05` | 7연 | 문 아래 가느다란 틈 | Extreme low-angle close-up of the thin gap under a closed apartment door, a faint line of warm light from inside, fingertips resting on the cold floor nearby |
| `poem-06` | 11연 | 발소리를 돌려주는 긴 복도 | A long, empty apartment corridor at dawn, motion-sensor lights turning on one by one into the distance, a ring of keys clenched in a hand in the blurred foreground |
| `poem-07` | 12연 | 사진을 찍을 때마다 손을 먼저 뺐다 | Over-the-shoulder view of a smartphone screen photographing a delivery box in front of a door, the hand pulling back out of the frame, door number blurred and illegible |
| `poem-08` | 14연 | 문틈으로 나온 손 | A door opened just a crack, a hand from inside gripping the plastic handle of a bottled water pack while a gloved hand outside still holds part of the weight, warm interior light meeting the cold corridor |
| `poem-09` | 16연 | 빈손을 천천히 내려놓았다 | Apartment stairwell at the first light of dawn, an empty hand hanging loosely at someone's side on the stairs, pale light through a small window |

**음악** → 배경음악·효과음은 [AUDIO.md](AUDIO.md)에 복사용 프롬프트로 정리했습니다.

---

## 2. 소설 〈독립〉 — 리소그래프 일러스트

**스타일 가이드**: 리소그래프 인쇄 느낌의 일러스트. 잉크는 **코랄 핑크, 민트, 딥 네이비** 세 가지만 쓰고, 입자감과 살짝 어긋난 인쇄(미스레지스트레이션)를 살립니다. 인물(서진·아빠·루이·재희)은 작게 그리거나 뒷모습으로 처리하고 얼굴은 그리지 않습니다. 지면 일러스트(박은준 기자)와는 다른 결로 갑니다.

스타일 꼬리말:
```
, risograph print illustration, only three ink colors: coral pink, mint green and deep navy, visible grain and slight misregistration, flat shapes, soft paper texture, everyday Korean setting, small figures seen from behind, no detailed faces, gentle melancholy
```

| ID | 위치(블록) | 장면 | 프롬프트 |
|---|---|---|---|
| `novel-01` | 0 | 아침, 아빠와 볶음밥 | A small Korean apartment kitchen and dining area in the morning, a frying pan of fried rice with potato and egg on the table, two spoons, a pile of unfolded laundry on the living room floor behind, sunlit veranda |
| `novel-02` | 9 | 가을 끝자락, 버스정류장 | A suburban bus stop in late autumn, dry leaves blowing in a chilly wind, a young woman running toward an arriving bus, seen from behind |
| `novel-03` | 11 | 사탕 가게 | Interior of a small boutique candy shop, shelves of glass jars full of colorful candies, giant lollipops, a counter with a register, a young clerk seen from behind, quiet afternoon |
| `novel-04` | 20 | 꽃다발 | A large bouquet of flowers lying on a candy shop counter, glittering under white shop lights, a broom leaning nearby, evening |
| `novel-05` | 40, 65 | 밤, TV 앞의 아빠 | A Korean apartment living room at night lit only by the glow of a TV, a middle-aged man lying on the floor in front of it seen from behind, comfortable mess |
| `novel-06` | 47 | 떨어진 사탕 | A giant lollipop cracked on a shop floor, shards of candy scattered, low angle |
| `novel-07` | 48 | 편의점 계산대 | A convenience store counter at 6 p.m., a roll of packing tape on the counter, a barcode scanner, only the clerk's hands visible, fluorescent light |
| `novel-08` | 50 | 5평짜리 방의 기억 | A cramped tiny studio room at night, a single bed, desk and small wardrobe filling the whole space, curtains that let in no light, laptop glow, loneliness |
| `novel-09` | 59 | 집 근처 술집 | A small neighborhood Korean pub at night, two young people seen from behind at a table crowded with side dishes and small glasses, warm hanging lamp |
| `novel-10` | 72 | 재희와 보내는 날들 | Two young people walking side by side down a quiet residential street at night after work, seen from behind, streetlights, a small gap between them |
| `novel-11` | 80 | 첫눈 | First snow beginning to fall at night outside a late-night burger restaurant with a glowing window, two figures walking away, snowflakes resting on their shoulders |
| `novel-12` | 99 | 눈 오는 날의 정적 | A silent snowy street at night under a single streetlight, two sets of footprints that stop facing each other, heavy stillness |
| `novel-13` | 102 | 어두운 현관, 소파와 담요 | A dark apartment entryway, a shoe cabinet with no men's dress shoes, a sofa with a blanket thrown over it, faint light from the window |
| `novel-14` | 107 | 통닭과 맥주 두 캔 | A late-night kitchen table, a black plastic bag, fried chicken in a paper box, two tall beer cans just opened, a drumstick on a small plate, a single warm lamp |
| `novel-15` | 126 | 아르바이트 마지막 날 | A candy shop at closing time on the last day, a large cracked candy in a cellophane wrap held out on an open palm, a suitcase waiting by the door, soft warm light |
| `novel-16` | 131 | 부산, 7평 원룸 | A small studio room in Busan with a bed, desk and wardrobe and a little empty space in the middle, a window showing the sea and harbor in morning light, a fresh start |

**음악** → 배경음악·효과음은 [AUDIO.md](AUDIO.md)에 복사용 프롬프트로 정리했습니다.

---

## 3. 희곡 〈마지막으로 불이 켜지는 집〉 — 연극 무대 사진

**스타일 가이드**: 모든 장면이 **같은 무대 세트 하나**에서 벌어집니다. 객석 정면에서 본 구도를 고정하고, 장면마다 **조명과 소품만** 바꿉니다. 원작의 지문처럼 장면이 지날수록 가구가 사라집니다. 사람은 넣지 않습니다(민우는 `play-15`에서 흔적으로만).

> **일관성 팁**: `play-01`을 먼저 만들어 마음에 드는 세트를 확정하세요. 나머지는 그 이미지를 **참조 이미지(이미지 투 이미지, 스타일·구도 참조, 편집 기능)**로 넣어 조명과 소품만 바꿔 달라고 요청하면 같은 집처럼 보입니다.

세트 공통 설명(모든 프롬프트 앞에 붙임):
```
Theatrical stage photograph of a single fixed set seen straight-on from the audience like a proscenium stage: the living room of an old one-story Korean house on the eve of demolition, a single bare incandescent bulb hanging at the center, a wall clock, a wooden dining table with chairs, a family photo frame on the wall, pencil height marks on the wall, a small bedroom door at left, the front door at right, dark stage wings,
```
스타일 꼬리말:
```
, dramatic theatrical lighting, realistic stage set materials, consistent set design across the series, no actors
```

| ID | 위치(블록) | 장면 | 프롬프트(세트 설명 뒤에 붙임) |
|---|---|---|---|
| `play-01` | 0 무대·1장 | 늦은 오후, 켜진 전구 | late afternoon, the interior darker than outside, the bulb lit even in daytime, tangerines and one unbroken spiral of tangerine peel on the table, a man's dress shoes and a child's worn sneakers by the front door |
| `play-02` | 73 2장 | 이삿짐의 목록 | three open cardboard moving boxes on the floor with blank paper tags, an old broken radio, scattered papers and an unpaid bill |
| `play-03` | 135 밤, 식탁 | 저녁 식탁 | dinner set on the table: braised cutlassfish in a pot, three bowls of rice, three pairs of chopsticks, warm evening glow under the bulb |
| `play-04` | 170 3장(과거) | 그 여름의 숙제 | memory scene lit from upstage with hazy warm sepia summer light, a child's paper airplane resting on an open university brochure, a child's homework sheet, the rest of the stage in shadow |
| `play-05` | 234 문이 열리며 거센 빗소리 | 정전과 폭우 | blackout during a summer storm, the bulb dark, a flash of lightning through the window, rain streaking the glass, the front door ajar with rain blowing in |
| `play-06` | 235 4장 | 철거하는 사람 | 9 p.m., a white safety helmet and a document case on the table, the pencil height marks on the wall lit by the bulb |
| `play-07` | 284 5장 | 봉투 | 11 p.m., a yellowed old envelope on the table under the bulb, the small bedroom door closed with a thin line of light beneath it |
| `play-08` | 319 2막 1장 | 누나에게 | 1 a.m., the small child's bedroom opened up on the same stage, a desk with a small notebook and a folded sheet of paper, a paper airplane, cool moonlight |
| `play-09` | 361 2장 | 말하지 않은 죄 | 2 a.m., two chairs facing each other across the table, two untouched glasses of water, the bulb as the only light, everything else in deep shadow |
| `play-10` | 419 설계도 | 집의 설계도 | an old yellowed architectural blueprint of the small house unfolded on the table, dawn blue beginning at the window |
| `play-11` | 444 3장 | 없는 사람의 자리 | 3:30 a.m., the child's bedroom door wide open, a pair of old child's sneakers with neatly tied laces on the floor in front of it |
| `play-12` | 488 4장 | 빈자리의 계약 | 5 a.m., most furniture gone, a pale rectangle on the wall where the family photo used to hang, the height marks beside it |
| `play-13` | 539 5장 | 꺼지는 연습 | 7 a.m., the room almost empty: only the table, two chairs and the lit bulb, cold blue morning outside the windows, one last tangerine on the table |
| `play-14` | 585 스위치 | 불이 꺼진다 | the bulb just switched off, warm golden morning light pouring through the gap of the front door across the bare floor, dust floating in the light, **bright image** |
| `play-15` | 593 마지막 지문 | 빈 거실 | the empty stage, the front door wide open to morning light, a broken tangerine peel lying under the table, the dark bulb, the faint translucent ghost of a paper airplane on the floor, **bright image** |

**음악** → 배경음악·효과음은 [AUDIO.md](AUDIO.md)에 복사용 프롬프트로 정리했습니다.

---

## 4. 문예평론 〈나의 친애하는 공범들에게〉 — 흑백 하프톤

**스타일 가이드**: 흑백, 거친 입자의 하프톤·동판화 질감. 사람 없이 **장소와 사물만** 담습니다. 법정, 바다, 물류센터, 터널처럼 평론이 다루는 네 소설의 공간을 '증거 사진'처럼 보여줍니다.

스타일 꼬리말:
```
, black and white, grainy monochrome photograph with halftone print and etching texture, high contrast, sparse minimal composition, architectural and object-focused, documentary evidence-photo feel, no people
```

| ID | 위치(블록) | 장면 | 프롬프트 |
|---|---|---|---|
| `crit-01` | 0 「1. 죄인-되기」 | 빈 법정 | An empty courtroom seen from the back of the gallery, rows of empty benches, the judge's bench far away, tall windows |
| `crit-02` | 5 「2. 피고석의 빈자리」 | 빈 피고인석 | An empty defendant's dock with a small blank nameplate, a single spotlight falling on the empty chair |
| `crit-03` | 7 하쿠와 바다 | 바다 | A dark sea at dusk seen from a breakwater, a distant cluster of concert stage lights on the shore, waves meeting from different directions |
| `crit-04` | 10 「어떤 이름을 적어야 할까」 | 서명란 | Extreme close-up of a blank form with an empty signature line, a pen hovering just above it |
| `crit-05` | 21 선숙의 물류 현장(3장) | 새벽 물류센터 | A huge logistics warehouse at 4 a.m., conveyor belts and rows of parcels, tiny distant silhouettes of workers, lockers for phones by the entrance |
| `crit-06` | 28 남자를 땅에 묻는 장면(4장) | 흙과 삽 | A shovel standing upright in freshly turned dark earth in a woodland clearing at night, the outline of a mushroom-farm greenhouse in the background |
| `crit-07` | 39 터널의 사고 차량(5장) | 터널 | Inside a dark highway tunnel before sunrise, a crashed car with hazard lights blinking, another car stopped behind it with its door left open |
| `crit-08` | 41 공범의 자리 | 터널 출구 | The exit of a long tunnel opening onto the first light of day, two small silhouettes standing side by side at the mouth of the tunnel |

**음악** → 배경음악·효과음은 [AUDIO.md](AUDIO.md)에 복사용 프롬프트로 정리했습니다.

---

## 5. 허브·공유 이미지

| 파일 | 규격 | 내용 |
|---|---|---|
| `hub-cover` | 16:9 | 표지 배경. 프롬프트: *A door left slightly ajar in a dark hallway just before dawn, a thin vertical line of warm light spilling across the floor, minimal, painterly, deep shadows* + 공통 꼬리말 |
| `og-hub.jpg` | 1200×630 | 카카오톡·SNS 공유 미리보기. ***제목 글자가 들어가므로 AI 말고 Figma나 캔바로 제작**(hub-cover 위에 고대신문 로고와 「창간 79주년 문예공모」) |
| `og-poem.jpg`, `og-novel.jpg`, `og-play.jpg`, `og-critique.jpg` | 1200×630 | 작품별 공유 이미지. 각 작품 첫 이미지 위에 작품 제목과 필명 |

---

## 6. 진행 체크리스트

이미지 49장, 음악 14곡입니다.

- [ ] 시: poem-01 ~ poem-09, poem-a, poem-b
- [ ] 소설: novel-01 ~ novel-16, novel-home, novel-shop, novel-night, novel-snow, novel-sea
- [ ] 희곡: play-01 ~ play-15, play-room, play-memory, play-storm, play-night, play-morning
- [ ] 평론: crit-01 ~ crit-08, crit-a, crit-b
- [ ] hub-cover, og-hub, og-poem, og-novel, og-play, og-critique
