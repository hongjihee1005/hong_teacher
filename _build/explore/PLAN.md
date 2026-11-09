# 탐구 실험관 — 진행 계획 (2026-11-09 밤, 선생님: "자러 가니 자동으로 계속, 사용량이 다 되면 풀릴 때 자동으로 다시 시작")

**깨어나면 이 파일의 '다음 할 일'에서 [ ]인 첫 줄부터 이어서 하고, 끝내면 [x]로 바꿔 커밋하세요.**
작업 브랜치 `claude/science-experiment-materials-review-sitgfe`. 요구서·점검 스크립트는 세션 스크래치(COMMON.md·G4COMMON.md·REVIEW.md, g4*/walk.js)에 있음 — 없으면 CLAUDE.md '3학년 과학 탐구 체험관' 절과 3학년 실험관 원본을 보고 같은 방식으로.

## 현황
- 3학년 실험관 9개(3-1·3-2 모든 단원) — main에 열림.
- 4학년 1학기 실험관 4개 `grade4/science/explore/`(magnet·water·land·micro, 원본 `_build/explore/g4*/`) — 작업 브랜치에만, main 아님. 메뉴 `grade4/science/explore/index.html`·과학방 카드 있음.

## 다음 할 일
- [x] 1. water(물의 상태 변화) 점검 마무리: 빌드 → 세 화면(1280·1920·390, 밝게·어둡게) 끝까지 눌러 오류·넘침·인쇄 1쪽·카드 배율 0.76↑
- [x] 2. 네 실험관 독립 검토(서로 다른 검토자, 원본 lessons_uN.py·교과서 앱 src와 대조) — magnet·land·micro는 2026-11-09 검토 중간에 멈췄음, 처음부터 다시
- [x] 3. 메뉴 설명·CLAUDE.md에 4학년 실험관 절 추가, `_build/auto/run_all.py`에 g4 넷 등록
- [ ] 4. `git fetch origin main && git merge origin/main` → `python3 _build/auto/run_all.py` 문제 0개(무관하게 바뀐 todo.md·common/words/idiom.html은 되돌림) → `git push origin HEAD:main` → 자동 보완 Actions 성공 확인
- [ ] 5. 4학년 2학기(2·3·4단원)는 홍지희 버전 원본이 없음 — 교과서 버전 `_build_tb/src2/`에서 실험이 있는 차시로 실험관을 만들지 선생님께 여쭙기(그 전엔 만들지 않음). 5·6학년도 같음.
- [ ] 6. 다 끝나면 선생님께 한국어 보고(무엇을 열었는지·고친 것·확인할 것·주소·근거), 깨우기 예약 끄기
