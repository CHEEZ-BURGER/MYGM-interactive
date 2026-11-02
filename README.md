# 고대신문 창간 79주년 문예공모 — 인터랙티브 기사

배포 주소: https://cheez-burger.github.io/MYGM-interactive/

고대신문 2051호(2026년 11월 2일자)에 수록된 문예공모 당선작 네 편을 이미지와 소리와 함께 읽는 정적 사이트입니다.

| 페이지 | 작품 |
|---|---|
| `index.html` | 허브: 끝없이 흐르는 작품 포스터 띠 / 목록 보기 |
| `poem.html` | 시 〈비켜 놓는 일〉 김철우 |
| `novel.html` | 소설 〈독립〉 박정연 |
| `play.html` | 희곡 〈마지막으로 불이 켜지는 집〉 김민성 |
| `critique.html` | 문예평론 〈나의 친애하는 공범들에게〉 김인환 |

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 에 배포용 결과물
```

## 구조

- `src/content/<작품>.json`: 본문, 수상소감, 심사평. **본문은 지면 그대로 두어야 합니다**(수상자 동의 조건). 교정할 때는 이 파일을 직접 고치세요.
- `src/content/cues.js`: 어느 문단에서 이미지·음악이 바뀌는지 정합니다. 블록 번호는 JSON의 `"i"` 값입니다.
- `public/media/img/`, `public/media/audio/`: 생성한 이미지·음악을 넣는 곳입니다. 파일명과 프롬프트는 [docs/PROMPTS.md](docs/PROMPTS.md)를 보세요.
- `public/brand/`: 고대신문 로고(엠블럼, 가로형·세로형 워드마크)와 파비콘. 로고는 CSS 마스크로 칠하므로 배경에 맞춰 글자색을 그대로 따릅니다. 교체할 때는 같은 이름의 투명 PNG로 덮어쓰면 됩니다.
- `scripts/build_content.py`: PDF 추출본(`content-src/`)으로 콘텐츠 JSON을 다시 만듭니다. **실행하면 JSON을 직접 교정한 내용이 덮어써집니다.**

## 배포 (GitHub Pages)

1. GitHub에 저장소를 만들고 이 폴더를 `main` 브랜치로 push합니다.
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 바꿉니다.
3. 이후 `main`에 push할 때마다 `.github/workflows/deploy.yml`이 빌드와 배포를 자동으로 합니다.
   주소: `https://<계정>.github.io/<저장소>/`

경로를 모두 상대 경로로 빌드하므로 저장소 이름이 바뀌어도 설정을 고칠 필요가 없습니다.

## 공개 전 확인

- [ ] 본문을 지면 PDF와 대조해 교정(특히 시 본문과 희곡 등장인물 소개는 이미지에서 판독함)
- [ ] 이미지·음악 저작권과 AI 생성 표기(하단 크레딧에 표기돼 있음)
- [ ] 공유 미리보기 이미지(`og-*.jpg`) 제작
