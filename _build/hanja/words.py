#!/usr/bin/env python3
"""한자어 목록 data/words.tsv 만들기 (처음 한 번, 또는 낱말을 다시 고를 때만)

    python3 words.py <libhangul 저장소 경로>

libhangul(https://github.com/libhangul/libhangul, data/hanja는 BSD-3, Choe Hwanjin)의
hanja.txt(한자어 → 독음)와 freq-hanjaeo.txt(쓰임 빈도)에서
① 2~4글자 ② 모든 글자가 한국어문회 1급까지의 배정한자(3,500자) ③ 독음이 하나로 정해지는(두음법칙 차이만 있으면 두음법칙을 따른 쪽)
④ 쓰임 빈도가 MIN(3급Ⅱ 이상 한자가 들면 MIN_HI) 이상인 낱말만 골라 '한자어<TAB>독음<TAB>빈도'로 적습니다. 빌드는 이 파일만 씁니다.
"""
import csv, sys, pathlib, unicodedata as ud, collections
HERE = pathlib.Path(__file__).resolve().parent
LH = pathlib.Path(sys.argv[1]) / 'data' / 'hanja'
MIN_LO = 3000   # 6급까지의 한자로만 된 낱말(쉬운 급)은 더 흔한 것만
MIN = 2500   # 쓰임 빈도 기준(이보다 드문 낱말은 어색한 것이 많음)
MIN_HI = 1000   # 3급Ⅱ 이상 한자가 든 낱말은 원래 어려운 낱말이라 기준을 낮춤
NG = set('姦淫娼妓屍賭痲麻')   # 어린이 시험지에 알맞지 않은 글자가 든 낱말은 뺌
NGW = set('''拷問 自殺 殺人 殺害 死體 虐殺 暗殺 賣春 人民軍 病身 食母 下手人 反共 反民主 反美 對共 對南 對民 對日 五一六 四山 八白
安家 白車 後場 前場 家出 野合 放火 在所者 民放 女工 小便 大便 發作 下人 主戰 野戰 地上戰 全面戰 內戰 出戰 苦戰 開戰 人民學校'''.split())
LV = ['8급', '7급Ⅱ', '7급', '6급Ⅱ', '6급', '5급Ⅱ', '5급', '4급Ⅱ', '4급', '3급Ⅱ', '3급', '2급', '1급']
LVOF = {ud.normalize('NFC', r['hanja']): LV.index(r['level']) for r in csv.DictReader(open(HERE / 'data' / 'hanja.csv', encoding='utf-8')) if r['level'] in LV}
ok = set(LVOF)
N = lambda s: ud.normalize('NFC', s)
from dueum import dueum
rd = collections.defaultdict(set)
for line in open(LH / 'hanja.txt', encoding='utf-8'):
    if line.startswith('#') or line.count(':') < 2: continue
    h, w = line.split(':')[:2]
    w = N(w)
    if 2 <= len(w) <= 4 and all(c in ok for c in w) and len(h) == len(w): rd[w].add(h)
fr = {}
for line in open(LH / 'freq-hanjaeo.txt', encoding='utf-8'):
    k, v = line.rstrip('\n').rsplit(':', 1)
    k = N(k)
    if k in rd: fr[k] = max(fr.get(k, 0), int(v) % 1000000)
out = []
for w, hs in rd.items():
    f = fr.get(w, 0)
    mx = max(LVOF[c] for c in w)
    if f < (MIN_LO if mx <= 4 else MIN if mx < 9 else MIN_HI) or w in NGW or any(c in NG for c in w): continue
    if len(hs) > 1:   # 두음법칙만 다르면 두음법칙을 따른 쪽
        first = {h[0] for h in hs}; rest = {h[1:] for h in hs}
        if len(rest) != 1: continue
        d = [h for h in hs if h[0] == dueum(h[0])]
        if len(d) != 1 or any(dueum(x) != d[0][0] for x in first): continue
        hs = set(d)
    out.append((w, hs.pop(), f))
out.sort(key=lambda x: (-x[2], x[0]))
with open(HERE / 'data' / 'words.tsv', 'w', encoding='utf-8') as fp:
    fp.write('# libhangul data/hanja (BSD-3, Copyright (c) 2005,2006 Choe Hwanjin) 에서 고른 한자어. words.py로 만듦\n')
    for w, h, f in out: fp.write(f'{w}\t{h}\t{f}\n')
print(len(out), '낱말')
