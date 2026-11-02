#!/usr/bin/env python3
"""획순 자료 data/strokes.json 만들기 (처음 한 번, 또는 자료를 다시 고를 때만)

    python3 strokes.py <kanjivg 저장소 경로> <hanzi-writer-data 패키지 경로>

한 글자마다 획(SVG 길, 109×109 칸)을 쓰는 차례대로 적습니다. 고르는 차례:
 1) KanjiVG(https://kanjivg.tagaini.net, CC BY-SA 3.0, Ulrich Apel) — 획 수가 한국어문회 자료의 총획과 같을 때
 2) KanjiVG의 艹(3획)를 한국식 4획(가로-세로-가로-세로)으로 나눴더니 총획과 같아질 때
 3) Hanzi Writer data(https://github.com/chanind/hanzi-writer-data, Arphic Public License, Make Me a Hanzi에서 옴)의 획 가운데선 — 총획과 같을 때
 총획이 맞는 자료가 없으면 싣지 않습니다(글자 모양이 한국 표준과 다를 수 있어서). 辶(4획)·礻(示) 등이 그런 경우가 많습니다.
일본·중국 자료라 한국 교과서 획순과 다른 글자가 조금 있을 수 있습니다.
"""
import sys, re, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import gen
KVG = pathlib.Path(sys.argv[1]) / 'kanji'
HW = pathlib.Path(sys.argv[2])

def rnd(d):
    return re.sub(r'-?\d+\.\d+', lambda m: ('%.1f' % float(m.group(0))).rstrip('0').rstrip('.'), d)

def start(d):
    m = re.match(r'\s*[Mm]\s*(-?[\d.]+)[ ,]*(-?[\d.]+)', d)
    return float(m.group(1)), float(m.group(2))

def end_abs(d):
    """KanjiVG 길의 끝점(대략): 상대 c 명령의 마지막 점을 더해 감"""
    x, y = start(d)
    for cmd, args in re.findall(r'([MmCcSsLl])([^MmCcSsLl]*)', d)[1:]:
        n = [float(v) for v in re.findall(r'-?\d*\.?\d+', args)]
        step = {'c': 6, 'C': 6, 's': 4, 'S': 4, 'l': 2, 'L': 2}[cmd]
        for k in range(0, len(n) - step + 1, step):
            px, py = n[k + step - 2], n[k + step - 1]
            if cmd.islower(): x, y = x + px, y + py
            else: x, y = px, py
    return x, y

def kvg(c):
    f = KVG / f'{ord(c):05x}.svg'
    if not f.exists(): return None, None
    s = f.read_text(encoding='utf-8')
    s = s[s.index('StrokePaths'):s.index('StrokeNumbers')]
    paths = re.findall(r'<path id="kvg:[^"]*-s(\d+)"[^>]* d="([^"]+)"', s)
    paths = [d for _, d in sorted(paths, key=lambda x: int(x[0]))]
    # 艹 묶음(3획) 찾기
    grass = []
    for g in re.finditer(r'<g [^>]*kvg:element="艹"[^>]*>(.*?)</g>', s, re.S):
        ids = [int(i) for i in re.findall(r'-s(\d+)"', g.group(1))]
        if len(ids) == 3 and ids == list(range(ids[0], ids[0] + 3)): grass.append(ids[0] - 1)
    return paths, grass

def split_grass(paths, k):
    """k번째(0부터) 가로획과 그 뒤 두 세로획 → 왼쪽 가로, 왼쪽 세로, 오른쪽 가로, 오른쪽 세로"""
    h, v1, v2 = paths[k], paths[k + 1], paths[k + 2]
    (x0, y0), (x1, y1) = start(h), end_abs(h)
    xa, xb = start(v1)[0], start(v2)[0]
    if not (x0 < xa < xb < x1): return None
    xm = (xa + xb) / 2; t = (xm - x0) / (x1 - x0); ym = y0 + (y1 - y0) * t; g = 2.5
    left = f'M{x0:.1f},{y0:.1f}L{xm - g:.1f},{ym - (y1 - y0) * g / (x1 - x0):.1f}'
    right = f'M{xm + g:.1f},{ym + (y1 - y0) * g / (x1 - x0):.1f}L{x1:.1f},{y1:.1f}'
    return paths[:k] + [left, v1, right, v2] + paths[k + 3:]

def hw(c):
    f = HW / f'{c}.json'
    if not f.exists(): return None
    md = json.loads(f.read_text(encoding='utf-8'))['medians']
    k = 109 / 1024
    return ['M' + 'L'.join(f'{x * k:.1f},{(900 - y) * k:.1f}' for x, y in m) for m in md]

out, src = {}, {'kvg': 0, 'kvg+艹': 0, 'hw': 0, '없음': 0}
for c, d in gen.CH.items():
    n = d['st']; got = None
    p, grass = kvg(c)
    if p and len(p) == n: got, how = p, 'kvg'
    elif p and grass and len(p) + len(grass) == n:
        q = p
        for k in sorted(grass, reverse=True):
            q = split_grass(q, k) if q else None
        if q and len(q) == n: got, how = q, 'kvg+艹'
    if not got:
        h = hw(c)
        if h and len(h) == n: got, how = h, 'hw'
    if not got: src['없음'] += 1; continue
    src[how] += 1
    out[c] = [rnd(x.strip()) for x in got]
(HERE / 'data' / 'strokes.json').write_text(
    '{\n' + ',\n'.join(f'"{c}":{json.dumps(v, ensure_ascii=False, separators=(",", ":"))}' for c, v in out.items()) + '\n}\n', encoding='utf-8')
print(src)
