# 과학 영상 한 단원 만들기 — 작성자 안내 (여러 단원을 동시에 만들 때)

맡은 단원의 개념 편(sNepMM)과 그 단원 마인드맵(sNmmMM)을 최종본까지 만듭니다. 작업 폴더 `_build/scivideo/`.

## 먼저 읽을 것
- `PLAN.md`(정한 것), `EPISODES.md`·`episodes.py`(맡은 편의 화 코드·차시 앱·제목·핵심 장면).
- 견본: `s3ep01`~`s3ep04/scene.py`(개념 편), `s3mm01/scene.py`(마인드맵 편). 같은 짜임·말투로 씁니다.
- 공통 틀: `series_style.py`(EpisodeScene: `opening` `section` `say(자막, 나레이션)` `pause_screen` `closing` `settle`), `scikit.py`(그림 부품·`clear_stage`), `mindmap.py`, `sci_theme.py`(학년 꾸밈 — 저절로 적용).
- 차시 앱 글: `python3 apptext.py ../../gradeN/science/semS/uU-L.html 8000` (4~6학년은 원본 `../../gradeN/science/_build_tb/src[2]/uU-L.html`도). 실험 값은 앱 안 스크립트에 있을 때가 많으니 `grep`으로 찾습니다.

## 지킬 것
- **내용은 그 차시 앱에 있는 것만.** 실험 결과·수·정리 문장을 앱에서 그대로 가져옵니다. 앱에 없는 수치·사실을 지어내지 않습니다. 확실하지 않으면 빼고 보고에 적습니다.
- 개념 편 짜임: `opening()` → 궁금해요(앱 도입) → 실험·관찰(결과 앞에 `pause_screen`) → 정리(앱 '한눈에 쏙') → 생활 속·생각 바로잡기(앱에 있으면) → `closing(핵심 한 줄, next_preview="3학년 N화 · 다음 제목")`. 1분 30초~3분.
- 마인드맵 편: `MindMapScene` 상속, 가지 = 그 단원 개념 편(차시) 차례, 잎은 짧게(렌더링 때 `[경고]`가 뜨면 줄임). `NEXT`는 다음 단원 첫 편.
- 자막은 한 줄(길면 저절로 줄어드니 30자 안팎), 나레이션은 어린이에게 말하듯 '~요'. 색 강조는 `o()`(주황) `g()`(초록) 과 장면 파일 안의 `r()`(빨강).
- 화살표 달린 이름표는 화살표를 먼저 그리고 이름표를 위에 얹기. 글꼴에 없는 글자: ⚠ ✓ 등 이모지는 쓰지 않음(㉮㉯①→←·×÷○△★℃은 됨).
- **공통 파일(`series_style.py` `scikit.py` `mindmap.py` `sci_theme.py` `make_final.sh` `render.sh` `PLAN.md` `EPISODES.md` `episodes.py`)은 고치지 않습니다.** 새 그림 부품은 단원 전용 파일 `kit_s{학년}u{학기}{단원}.py`(예: `kit_s3u12.py`)나 장면 파일 안에 만듭니다. 공통에 넣으면 좋을 부품은 보고에 적어 주세요.
- 커밋·푸시하지 않습니다(정리하는 쪽이 함).

## 만들고 확인하기
1. (선택) 저화질: `MEDIA=media_p ./render.sh s3ep05 preview` → `/opt/manimenv/bin/python frames.py s3ep05 preview media_p/frames/s3ep05` → 사진 확인.
2. 최종: `./make_final.sh s3ep05` (렌더링 임시 폴더는 편마다 `media_r/<편>`이라 동시에 돌려도 됨) (1920×1080, 배경음악, 장면 사진 `media/frames/s3ep05/sheet*.png`).
3. 장면 사진을 **모두** 열어 봅니다: 글자·그림 겹침, 화면 밖으로 잘림, 자막 띠(아래)·왼쪽 위 이름표·오른쪽 위 로고와 겹침, 틀린 내용. 고칠 것이 있으면 고쳐 2를 다시.
4. 보고: 만든 편(폴더·제목·길이), 앱과 다르게 하거나 빼서 확인이 필요한 곳, 공통에 넣으면 좋을 부품.

화면 좌표: 가로 −7.1~7.1, 세로 −4~4. 그림은 y −2.5~3.0 안에(아래는 자막 띠, 왼쪽 위 이름표, 오른쪽 위 로고).
제작 도구가 없으면 `PLAN.md`의 설치 줄. Pillow 12 이상이면 `/opt/manimenv/bin/pip install "pillow<12"`.
