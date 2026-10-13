# 「수학 원리 돋보기」 개념 설명 영상 (Manim)

교실 TV로 바로 트는 수학 개념 설명 영상 시리즈입니다. 소리 없이 자막만 들어 있고, 더빙은 Vrew에서 합니다.
사이트(GitHub Pages)에는 걸리지 않는 제작 원본 폴더입니다.

| 파일 | 하는 일 |
|---|---|
| `series_style.py` | **시리즈 공통**: 색(배경·글자·파랑=십·주황=일·초록=답), 한글 글꼴 자동 고르기, 자막 띠, 왼쪽 위 구역 이름표, 오프닝(5초), '생각해 보세요' 멈춤 화면, 마무리(10초), 나레이션 원고 자동 작성 |
| `base10.py` | **수모형 함수**: 일 모형 `unit_cube()`, 십 모형 `ten_rod()`, 백 모형 `hundred_flat()`, 수 → 수모형 `number_blocks(n)`, 십 모형 1개 → 일 모형 10개 `break_ten()`, 접시(묶음) `plate()` |
| `epNN/scene.py` | 화마다 장면 (`EpisodeScene`을 물려받아 `construct()`만 씀) |
| `epNN/narration.txt` | 렌더링할 때 저절로 만들어지는 **시간 표시 나레이션 원고**(Vrew용) |
| `epNN/timeline.json` | 자막이 바뀌는 시각(장면 확인용) |
| `fonts/` | 도장방(도장 만들기)과 같은 본문 글꼴 고운돋움(모든 글자). SIL OFL 1.1, 출처 Google Fonts(github.com/google/fonts) |
| `render.sh` | 미리보기·최종 렌더링 |
| `frames.py` | 완성 영상에서 자막마다 장면을 뽑아 6장씩 모아 보기(숫자·계산 확인용) |

## 1. 설치 (처음 한 번)

Manim Community 공식 설치 안내: https://docs.manim.community/en/stable/installation.html
이 시리즈는 LaTeX를 쓰지 않으므로(글자는 모두 한글 글꼴로 그림) **LaTeX(MiKTeX·MacTeX)는 설치하지 않아도 됩니다.**

### 윈도
1. 파이썬 설치: https://www.python.org/downloads/ 에서 3.12를 받아 설치(첫 화면에서 **Add python.exe to PATH** 체크).
2. FFmpeg 설치: 명령 프롬프트에서 `winget install ffmpeg`
3. Manim 설치: `pip install manim`
4. 한글 글꼴은 설치하지 않아도 됩니다(`fonts/` 폴더의 글꼴을 프로그램이 스스로 불러 씀).
5. 확인: `manim --version`

### 맥
1. Homebrew(https://brew.sh) 설치 뒤: `brew install python ffmpeg pango pkg-config`
2. `pip3 install manim`
3. 한글 글꼴은 설치하지 않아도 됩니다(`fonts/` 폴더의 글꼴을 씀).

글꼴은 `series_style.py`가 `fonts/`의 고운돋움을 등록해 씁니다. 그 폴더가 없으면 `FONT_CANDIDATES` 차례(Noto Sans KR → Noto Sans CJK KR → 나눔고딕 → 맑은 고딕 → Apple SD Gothic Neo)로 컴퓨터에 있는 것을 고릅니다.

## 2. 렌더링

```bash
cd _build/video
./render.sh 1 preview     # 저화질 미리보기 854×480·15fps (약 1분) → ep01/ep01_preview.mp4
./render.sh 1 final       # 최종 1920×1080·30fps (몇 분)        → ep01/ep01_final.mp4
```

윈도 명령 프롬프트에서는 `render.sh` 대신:

```bat
cd _build\video
manim -qh --fps 30 --media_dir media --disable_caching -o ep01_final.mp4 ep01\scene.py Ep01
```
(완성 파일은 `media\videos\scene\1080p30\ep01_final.mp4`)

렌더링이 끝나면 `ep01/narration.txt`가 새 시간으로 다시 쓰입니다.

## 3. 새 화 만들기

1. `ep01/`을 `ep02/`로 복사하고 `scene.py`의 클래스 이름을 `Ep02`, `EP_NO = 2`, `EP_TITLE`을 바꿉니다.
2. `construct()` 안에서
   - `self.opening()` — 오프닝 5초
   - `self.section("이름")` — 왼쪽 위 구역 이름표
   - `self.say("자막", "나레이션")` — 자막을 바꾸고 원고에 시간과 함께 적음. 앞 나레이션을 읽을 시간(1초에 6글자)이 모자라면 저절로 기다림
   - `self.pause_screen(5)` — '잠시 멈추고 이야기해 보세요'
   - `self.closing("핵심 한 줄", next_preview="다음 화 예고 문구")` — 마무리 10초
3. 글자 색: `b('십')`(파랑) `o('일')`(주황) `g('답')`(초록)을 `M(f"...")` 안에서 섞어 씁니다.
4. 미리보기 → `python frames.py 2 preview`로 장면 사진을 보고 숫자·계산·겹침 확인 → 최종.

## 4. 1화에서 정한 것

- 「초등교사 홍지희」: 선생님 캐릭터 로고(`assets/logo.png`, 동그라미 밖 투명)를 오른쪽 위에 작게 처음부터 끝까지 고정(`LOGO_H`로 크기 조절). 왼쪽 위는 구역 이름표, 아래는 자막 자리라 비어 있는 오른쪽 위를 씀.

- 세로셈은 3학년 교과서처럼 나누어지는 수 위에 몫을 쓰는 꼴(`3 ) 42`), 십의 자리 단계는 파랑·일의 자리 단계는 주황으로 수모형 장면과 색을 맞춤.
- 4 아래에 쓰는 3은 '나누어 준 십 모형 3개(30)'라고 자막으로 알려 줌(선생님이 주신 순서대로 30이 아닌 3만 씀 — 교과서 표기와 같은지는 확인하지 못함).
- 남은 1(십)을 일 모형 10개로 바꾸는 순간, 세로셈의 그 1도 파랑 → 주황으로 바뀌어 '12'의 1이 됨.
