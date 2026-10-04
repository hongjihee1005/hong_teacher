# 공통 › 한자 급수 (한국어문회)

- `data/hanja.csv` — 한국어문회 급수별 배정한자(대표 훈음·부수·획수). 출처: 사단법인 한국어문회 홈페이지 학습자료의 엑셀을
  [rycont/hanja-grade-dataset](https://github.com/rycont/hanja-grade-dataset)이 CSV로 옮긴 것. 데이터의 저작권은 한국어문회에 있습니다.
- `data/words.tsv` — 한자어와 독음. [libhangul](https://github.com/libhangul/libhangul) `data/hanja/hanja.txt`·`freq-hanjaeo.txt`
  (Copyright (c) 2005,2006 Choe Hwanjin, BSD-3-Clause)에서 `words.py`로 고른 것.
- 만들기: `python3 build.py` (먼저 `gen.py check`), 점검만: `python3 gen.py check`, 시험지 글로 보기: `python3 gen.py show 5-2 3`.
- `data/strokes.json` — 획순(109×109 칸의 SVG 길, 쓰는 차례). `strokes.py <kanjivg> <hanzi-writer-data>`로 만듦.
  [KanjiVG](https://kanjivg.tagaini.net) (Copyright (C) 2009-2011 Ulrich Apel, **CC BY-SA 3.0** — 이 파일도 같은 조건으로 나눕니다) 및
  [Hanzi Writer data](https://github.com/chanind/hanzi-writer-data) (Make Me a Hanzi에서 옴, Arphic Public License — `data/ARPHICPL.TXT`).
