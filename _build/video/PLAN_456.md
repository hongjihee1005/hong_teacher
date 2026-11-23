# 「수학 원리 돋보기」 4·5·6학년 제작 진행표 (이어 하기용)

**새 세션이면 이 파일부터 읽고, 아래 '다음 할 일'부터 이어서 만드세요.**
(선생님 요청 2026-10-16: 세션이 끝나면 다음 세션에서 이어서 계속. **4-1 → 4-2 → 5-1 → 5-2 → 6-1 → 6-2** 차례로 만들고, **노션은 영상을 다 만든 뒤에 한꺼번에 정리**. 미리보기 없이 최종본, 이 작업은 자동 승인.)
작업 브랜치 `claude/stoic-allen-97qqrm`에 커밋·푸시. 3학년 편 기록은 `PLAN.md`.

## 정한 것
- **색:** 학년·학기마다 바탕색이 다름(`series_style.py`의 `THEMES`, 선생님 요청 2026-10-16). 3학년 크림 / 4-1 민트 / 4-2 하늘 / 5-1 연보라 / 5-2 살구 / 6-1 연노랑 / 6-2 연분홍. 숫자·모형 색(주황 일, 파랑 십, 보라 백, 초록 답)은 모든 학년이 같음.
- **이름:** 학년마다 1화부터. 폴더 `g4ep01`, 장면 클래스 `G4Ep01`, 화면 "4학년 1화". 장면에 `GRADE, SEM = 4, 1`을 적음.
- **화 번호:** 학년 목록(`EPISODES_G4.md` …)의 표 차례 그대로(1학기 먼저). 4학년: 1~28화 = 1학기, 29~56화 = 2학기.
- **명령:** `GRADE=4 ./make_final.sh 1`(최종본 + 피아노 배경음악 + 장면 사진 `media/frames/g4ep01/`), 점검용 저화질 `GRADE=4 MEDIA=media_p MANIM=/opt/manimenv/bin/manim ./render.sh 1 preview`.
- **목록이 아직 없는 학년:** 그 학년 차례가 되면 먼저 `EPISODES_G5.md`·`EPISODES_G6.md`를 4학년과 같은 기준으로 만든다(바탕: `gradeN/math/_build/units/[sem2/]*.tb.js`의 question·summary). 6학년 수학 앱이 main에 아직 없으면 수학 작업 브랜치(`_build/mathplan/PLAN.md` 현황 표)에서 찾고, 그래도 없으면 교과서 차시 목록을 확인해 만든다(모르는 것은 지어내지 않음).
- **부품:** 3학년 부품(`base10`·`multiply`·`division`·`addsub`·`fraction`·`geom`·`graph`·`measure`)에 더해 4학년 큰 수 `bignum.py`(지폐, 자릿값 표, 자리별 색, 네 자리 묶음 색).
- 대기열을 기다리는 명령에 `bash ./make_final` 글자를 넣지 말 것(대기열 실행기가 자기를 렌더링으로 알아보고 멈춤). `[m]ake_final.sh [0-9]`처럼 씀.

## 한 편 만드는 차례
1. 학년 목록에서 그 편의 차시·예시·핵심 장면을 보고, 앱 원본(`tb.js`)의 같은 차시 question·summary·예시 수를 확인한다.
2. `gNepMM/scene.py`를 쓴다(앞 화를 본뜨고 공통 부품을 씀).
3. 저화질로 한 번 렌더링해 장면 사진을 보고 겹침·잘림·숫자를 고친다.
4. `GRADE=N ./make_final.sh MM` → 장면 사진을 **모두** 본다 → 커밋·푸시 → 아래 표에 ✅.

## 진행표
| 학년·학기 | 목록 | 화 | 상태 |
|---|---|---|---|
| 4-1 | `EPISODES_G4.md` | 1~28화 | ✅ 최종본 모두 커밋 |
| 4-2 | `EPISODES_G4.md` | 29~56화 | ✅ 최종본 모두 커밋(2026-10-17) |
| 5-1 | `EPISODES_G5.md` | 1~30화 | 장면 30편 모두 씀(부품 `mixcalc.py` 계산 순서 선, `corresp.py` 대응 표, `area.py` 모눈·단위넓이). 최종본 1~30 커밋 ✅ |
| 5-2 | `EPISODES_G5.md` | 31~62화 | 장면 32편 모두 씀(부품 `numrange.py` 수의 범위, `cuboid.py` 직육면체). ✅ 최종본 31~62 모두 커밋(2026-10-17) |
| 6-1 | `EPISODES_G6.md` | 1~32화 | ✅ 최종본 모두 커밋(2026-10-17). 장면 32편(부품 `solid.py` 각기둥·각뿔, `decdiv.py` 소수 세로 나눗셈·소수 모형, `tablekit.py` 표, `ratiograph.py` 띠·원그래프, `cubes.py` 쌓기나무). |
| 6-2 | `EPISODES_G6.md` | 33~66화 | ✅ 최종본 모두 커밋(2026-10-17). 장면 34편(부품 `round3d.py` 원기둥·원뿔·구, `cubes.py`에 위·앞·옆에서 본 모양). |

## 다음 할 일
- 5학년 최종본: 대기열이 끝난 화는 장면 사진 확인 → 커밋(`ls g5ep*/*bgm_piano.mp4`로 확인, 새 세션이면 빠진 화를 `GRADE=5 ./make_final.sh N`).
- **4·5·6학년 영상 184편(56 + 62 + 66) 모두 완성·커밋(2026-10-17).** 이어 하기 예약 작업은 껐음. 노션 정리도 끝(2026-10-17): 학습 자료실 아래 '수학 원리 돋보기 (4·5·6학년 개념 설명 영상)' 세 쪽, 영상 목록 56·62·66줄.
- 부품: 큰 수 `bignum.py`, 각도 `angle.py`, 두 줄 곱셈 `mul2.py`, 세로 나눗셈 `divlong.py`, 이동 `move.py`, 막대·꺾은선 `chart.py`(물결선 `wave`), 도형 `shapes.py`(직각 표시 `right_mark`, 평행 표시 `par_mark`, 같은 길이 `tick`), 소수 `decimal4.py`(100칸 모눈, 소수 세로셈 `dec_vertical`), 계산 순서 `mixcalc.py`, 대응 표 `corresp.py`, 모눈 `area.py`, 수의 범위 `numrange.py`, 직육면체 `cuboid.py`.
- 모두 끝나면: 노션에 4·5·6학년 '영상 목록' 정리(3학년 '영상 목록' 데이터베이스와 같은 모양), 이어 하기 트리거 끄기.

## 분수 특별편 「분수 기초 차근차근」 (2026-11-23 선생님 요청)
- 요청: 아이들이 진분수·가분수·대분수와 '부분을 분수로 나타내기'를 잘 못함 → 단계별로 차근차근, 여러 편으로.
- 목록 `EPISODES_FR.md`(11편), 폴더 `gfep01`~`gfep11`, 화면 "분수 특별편 N화", 바탕 연청록(`THEMES[("F", 1)]`, 장면에 `GRADE, SEM = "F", 1`, `LABEL = "분수 특별편 {}화"`).
- 공통 부품 `fracbasic.py`: '1단계' 이름표 카드 `step_card`, 빈 분수 틀 `frac_slots`, 부분 → 분수 3단계 `three_steps`(분모 → 분자 → 읽기), 부채꼴 안 글자 자리 `spot`, 칸 `grid`, 띄운 대분수 `mixed_wide`.
- 명령: `GRADE=f ./make_final.sh N`. 장면 사진은 `FRAME_AT=mid`(자막이 바뀐 뒤 1.8초)로 뽑으면 구역 끝 지우기 전 장면이 보임(`frames.py`).

## 분수 준비 「곱셈부터 차근차근」 (2026-11-23 선생님 요청)
- 요청: 분수를 아주 많이 어려워하는 아이들용, 곱셈부터 차근차근. 목록 `EPISODES_PREP.md`(12편: 묶어 세기 → 곱셈 → 배열 → 구구가 생각나지 않을 때 → 나눗셈 두 뜻 → 곱셈으로 나눗셈 → 하나를 똑같이 → 단위분수 → 크기 → 12의 3분의 1 → 12의 3분의 2), 다 보면 분수 특별편 1화로 이어짐.
- 폴더 `gpep01`~`gpep12`, 화면 "분수 준비 N화", 바탕 연한 연두(`THEMES[("P", 1)]`), 장면 바탕 `prepkit.PrepScene`(구슬 줄 `items`, 묶기 `regroup`, 뛰어 세기 `count_under`, 배열 `grid_items`, 접시 `dish`). 명령 `GRADE=p ./make_final.sh N`.

## 분수 이야기(분수 특별편 12~14화)·자연수 이야기(3편) (2026-11-23 선생님 요청)
- 사실·역사 영상: 원고 전에 출처 조사부터(하위 작업, 웹 검색 발췌 — 이 환경은 원문 사이트를 열 수 없음). 확인 못 한 것은 넣지 않거나 '전해지는/이렇게 설명해요'로 표시. 화마다 끝에 '이 영상의 출처'.
- 목록: `EPISODES_FR.md` 아래 '분수 이야기', `EPISODES_NAT.md`(자연수, 폴더 `gnep01~03`, 바탕 모래색 `THEMES[("N", 1)]`, 명령 `GRADE=n`).
- 부품 `storykit.py`: 시간 띠 `timeline`, 파피루스 `scroll`, 옛 책 `book`, 출처 화면 `show_sources`. `fracbasic.step_card(..., label="약속 1")`처럼 이름표 글을 바꿀 수 있음.
- 주의: 화면 글에 `&`를 쓰면 MarkupText가 깨짐(· 등으로 바꿈).

## 나눗셈 차근차근 (20편, 2026-11-23 선생님 요청)
- 목록 `EPISODES_DIV.md`(뜻·식 읽기·두 뜻·뺄셈·곱셈구구·1과 0·나머지·검산·생활 문제·몇십·세로셈·세 자리·두 자리 수로 나누기·문장제·곱셈과 구별·□ 구하기·분수와 잇기), 폴더 `gdep01~20`, 화면 "나눗셈 차근차근 N화", 바탕 연보라(`THEMES[("D", 1)]`), 명령 `GRADE=d`.
- 부품 `divkit.py`: `DivScene`, 접시 칸 `slot`, 나누어 주기 `deal`, 용어 이름표 `term_eq`·`term_labels`(나누어지는 수·나누는 수·몫·나머지).
- 썸네일 `thumbs.py`(시리즈 `gd`) → `./add_thumb.sh gdepNN`으로 영상 앞 2초에 넣은 `*_final_thumb.mp4`.
- 2026-11-23 공통 수정: `series_style.M`이 너비 13.2를 넘으면 저절로 줄임(화면 밖 넘침 방지). `division.long_division_n`은 세 자리 이상이면 줄 간격·글자를 줄임(두 자리는 그대로).

## 정한 것 (2026-11-23 선생님): 썸네일은 기본, 사실은 출처로
- **모든 영상은 썸네일을 넣은 판(`*_final_thumb.mp4`)이 완성본입니다.** 새 영상은 `thumbs.py`에 그림 글자를 넣고 `./add_thumb.sh 폴더`까지 해야 끝. 3~6학년 본편 235편도 2026-11-23에 넣음(그림 글자 `thumbs_main.py`, 제목은 장면의 EP_TITLE, `python3 thumbs.py main`).
- 역사·사실이 들어가는 영상은 **논문·도서·기사 등 출처로 확인한 것만** 쓰고, 화마다 끝에 '이 영상의 출처' 화면. 확인 못 한 일화는 빼거나 '전해지는 이야기'로.
- 다음 큰 작업: 「개념 차근차근」(`EPISODES_CONCEPT.md`, 127편) — 1부부터.

## 개념 차근차근 진행 현황 (`EPISODES_CONCEPT.md`, 폴더 `gcepNN`, `GRADE=c`)
- 부품 `conceptkit.py`(ConceptScene·구슬 dot/dots·10칸 틀 ten_frame·모으기 가르기 pair_card·수직선 number_line/jumps·구구 table_rows). 사실 확인 기록 `SOURCES_CONCEPT.md`.
- 썸네일 `thumbs.py`의 `gc` 시리즈(EP에 gcepNN 줄). 장면 메서드 이름에 `add`·`remove` 등 Scene 메서드 이름을 쓰지 말 것(34화에서 오류).
- 2026-11-23: **127화 장면·썸네일 모두 완성.** 미리보기 점검: 1~76, 79, 83~86화 끝(고침 반영). 최종본은 `$SP/finc.sh 번호…`로 만드는 중(1~53화부터). 남은 일: 77~127화 미리보기 점검 → 최종본 → 보내기.
- 최종 만들기 스크립트(세션이 바뀌면 다시 만들기): render final → `music/gen_bgm.py 길이 --style piano` → `add_bgm.py`(GRADE=c) → `./add_thumb.sh gcepNN`.
- 최종 만들기: `$SP/find.sh`와 같은 방식(GRADE=c, gcepNN) — render final → gen_bgm piano → add_bgm → add_thumb.sh.
- 2026-11-23 밤: 긴 작업은 세션 백그라운드 시간 제한(2시간)에 걸려 `setsid nohup $SP/runall.sh`(이어서 하기, 이미 된 화는 건너뜀)로 돌림 — 개념 차근차근 최종본 + 3~6학년 썸네일 넣기. 세션이 바뀌면 같은 내용의 스크립트를 만들어 다시 돌리면 됨(스크립트 내용: fin/th 함수, PLAN 위 '최종 만들기' 참고).
