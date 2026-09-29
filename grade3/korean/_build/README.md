# 3학년 국어 수업 세트 만드는 틀

- `engine.html` — 모든 차시가 함께 쓰는 화면 틀(단계 종류: talk, book, cards, mc, sort, order, match, fill, listen, write, sum, final, bingo)
- `lessons.py`(1단원), `lessons2.py`(2단원), `lessons3.py`(3단원), `lessons4.py`(4단원) — 차시별 내용(지도서 근거와 쪽수를 교사 안내에 적음). 새 단원은 `lessons5.py`를 만들고 `build.py`에 추가
- `build.py` — `python3 build.py ../sem2` 로 HTML을 만듦
- `check.py` — 크롬북(1366×680)·갤럭시탭(800×1180)에서 모든 화면을 넘기며 오류·넘침·스크롤 점검 (경로는 파일 안에서 고쳐 쓰기)
