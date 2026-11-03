# 사고전략 메뉴 (`thinking/`) 빌드

하버드 Project Zero 사고 루틴을 **탐구 단계별 · 교과별**로 정리한 메뉴입니다. `thinking/` 안의 HTML은 직접 고치지 말고 여기서 다시 만듭니다.

```bash
python3 _build/strategy/build.py
python3 _build/theme/apply_theme.py && python3 _build/theme/apply_content_theme.py
```

| 파일 | 내용 |
|---|---|
| `data_routines.py` | 사고전략 23개 (교사용 안내·학생용 안내·활동지 칸 구성) |
| `data_more.py` | 탐구 5단계, 교과 10개, 첫 안내 |
| `build.py` | HTML 틀, 활동지 칸 종류(grid·lines·table·compass·rope·circle·ten·news·bridge·map·zoom·check) |
| `menu.css` `menu.js` `foot.html` `home.html` `tolist.html` `*-css.css` | 기존 페이지에서 복사한 공통 조각 |

만들어지는 페이지

- `thinking/index.html` 사고전략 방 → `stage/`(탐구 단계별), `subject/`(교과별), `routines/`(23가지), `guide.html`(첫 안내)
- 자료 페이지는 모두 **교사용 안내 · 학생용 안내 · 활동지** 세 탭(`#teacher` `#student` `#sheet`)입니다.
- 활동지는 화면에서 쓰면 그 기기 localStorage(`hj-think-v1:경로`)에 저장되고, A4 세로 한 장으로 인쇄됩니다(빈 활동지 인쇄 가능).

저작권: PZ 사고 루틴 원문은 CC BY-NC-ND 4.0(변경 금지)입니다. 원문을 번역해 싣지 말고, 생각을 바탕으로 새로 쓴 글과 원문 링크만 둡니다.
탐구 5단계는 PZ 공식 분류가 아니라 『Making Thinking Visible』(2011)의 세 묶음을 바탕으로 다시 나눈 것이므로 페이지에 그 사실을 밝혀 둡니다.

## 아이용 따로 사이트 '생각 도구' (2026-11-03)

```bash
python3 _build/strategy/kids.py      # → _build/strategy/standalone/
```

- 저장소 `hongjihee1005/thinking-tools`(https://hongjihee1005.github.io/thinking-tools/)가 `repo/.github/workflows/sync.yml`로 한 시간마다 `standalone/`을 가져갑니다.
- 학생용 안내·활동지만 남기고(교사용 탭 제거), 첫 화면은 과목·탐구 단계에서 도구를 고르는 아이용 화면입니다. 자료실로 가는 링크는 넣지 않습니다(`kids.py`가 점검).
- 데이터를 고치면 `build.py`와 `kids.py`를 둘 다 돌리세요.
