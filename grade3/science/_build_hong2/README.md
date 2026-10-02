# 3-2 과학 · 홍지희 선생님 버전 작업 폴더 (실험·탐구 중심, 2026.10.2 시작)

3-1 버전(`../_build_hong`)의 틀을 복사해 **실험·탐구를 늘린 새 단계**를 더했습니다. 결과물은 `../sem2-hong/`.
3-1 버전을 따로 검토한 결과(탐구 수준이 교과서 버전과 비슷함, 결론이 낱말 조립, 기록값이 이어지지 않음, 반복 측정·반 전체 자료 없음)를 반영했습니다.

## 새 단계 (`engine_lab2.js`, `lab2.css`)
- `design` 🧭 실험 설계: 질문마다 카드를 고르고 '생각 확인하기'로 까닭을 봅니다. `ok: True`(꼭 필요·빠뜨리면 점선 표시), `False`(틀림·안전), `None`(판정 없이 인정).
- `pgrid` 🔮 예상 표: 차시의 `grids[g]`(rows·cols) 칸을 눌러 예상. cols마다 `o`/`x` 글자, `ev`(근거 문장 앞말).
- `board` 📊 우리 반 자료판: 모둠(`groups`, 기본 6)마다 결과 입력 → '반 전체'에서 모둠 수·막대 그래프·⚠️(모둠마다 다름).
- `gcmp` ⚖️ 예상과 결과 비교: 예상 표와 반 전체 결과(많은 쪽)를 칸마다 견줌(초록 같음·주황 다름).
- `claim` ✍️ 근거로 결론: 자료판에서 근거 단추를 만들어 '근거 / 결론' 칸에 쓰고, 그다음 교과서 문장과 비교.
- 기존 `lab`에 `routine`으로 배지 이름을 바꿀 수 있습니다(예: '자유롭게 관찰하기').

## 만들기·점검
- `python3 build.py sci32-u1-l2` → `../sem2-hong/u1-l2.html` (사이트 공통 연락처 줄·홈 단추는 `site_snippets.html`에서 넣음)
- `python3 index_build.py` → 목록. 그다음 저장소 루트에서 `python3 _build/theme/apply_theme.py grade3/science/sem2-hong/index.html`, `python3 _build/theme/apply_content_theme.py grade3/science/sem2-hong/u*.html`
- `python3 check.py ../sem2-hong/u1-l2.html` (크롬북·갤럭시탭·교실 화면 세 크기)

## 진행 상황
- 1단원 2차시 견본: 독립 검토(치명 0·중요 4·경미 6) 모두 반영. 선생님 확인을 받은 뒤 나머지 차시를 만듭니다.
- 지도서 텍스트: 세션 작업 폴더의 s1~s4.txt(3-2 과학 지도서 1~4단원 pdftotext).
