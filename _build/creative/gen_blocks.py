#!/usr/bin/env python3
"""창의수학게임 › 쌓기나무 문제 만들기 (2026-10-07)

    python3 gen_blocks.py          # data/blocks.json (같은 씨앗이면 언제나 같은 문제)
    python3 gen_blocks.py check    # 다시 만들어 저장된 것과 같은지, 답이 맞는지 확인

판: 3×3 칸(위에서 본 모양, 아래쪽이 '앞'), 칸마다 쌓은 개수 0~3. 쌓기나무는 바닥부터 빈틈없이 쌓음.
위에서 본 모양 = 쌓기나무가 있는 칸 / 앞에서 본 모양 = 왼쪽부터 세로줄마다 가장 높은 개수 / 옆(오른쪽)에서 본 모양 = 앞줄부터 가로줄마다 가장 높은 개수.
쉬움: 입체 그림을 보고 똑같이 쌓기 — 뒤·왼쪽이 더 높거나 같은 모양(가려진 쌓기나무 없음).
보통: 위·앞·옆에서 본 모양을 보고 쌓기 — 세 모양에 맞는 쌓기가 **딱 하나**인 문제만(0~3개 쌓기 4^9가지를 모두 늘어놓아 확인).
도전: 세 모양에 맞게 쌓되 쌓기나무를 **가장 적게**(10문제) 또는 **가장 많이**(10문제) — 맞는 쌓기가 여러 가지이고 가장 적은·많은 개수가 다른 문제만.
"""
import json, random, sys, pathlib
from itertools import product
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True
N = 3

def views(h):   # h[y][x] (y=0 뒤 … y=2 앞)
    top = tuple(tuple(1 if h[y][x] else 0 for x in range(N)) for y in range(N))
    front = tuple(max(h[y][x] for y in range(N)) for x in range(N))
    side = tuple(max(h[y][x] for x in range(N)) for y in reversed(range(N)))   # 왼쪽이 앞줄
    return top, front, side

def all_maps():
    out = {}
    for hs in product(range(4), repeat=N * N):
        h = tuple(tuple(hs[y * N:(y + 1) * N]) for y in range(N))
        out.setdefault(views(h), []).append(h)
    return out

def monotone(h):   # 뒤(y 작음)·왼쪽(x 작음)이 더 높거나 같음 → 앞·오른쪽에서 볼 때 가려지는 쌓기나무가 없음
    return all(h[y][x] >= h[y][x + 1] for y in range(N) for x in range(N - 1)) and all(h[y][x] >= h[y + 1][x] for y in range(N - 1) for x in range(N))

def connected(h):
    cells = [(y, x) for y in range(N) for x in range(N) if h[y][x]]
    if not cells: return False
    seen = {cells[0]}; st = [cells[0]]
    while st:
        y, x = st.pop()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            c = (y + dy, x + dx)
            if c in cells and c not in seen: seen.add(c); st.append(c)
    return len(seen) == len(cells)

def total(h): return sum(map(sum, h))

def gen():
    rng = random.Random(20261007); M = all_maps(); data = {}
    # 쉬움
    easy = sorted({h for hs in M.values() for h in hs if monotone(h) and connected(h) and 4 <= total(h) <= 12 and sum(1 for r in h for v in r if v) >= 3})
    rng.shuffle(easy); easy = sorted(easy[:20], key=total)
    data['easy'] = [{'h': [list(r) for r in h]} for h in easy]
    # 보통: 답이 하나뿐
    uniq = [(k, v[0]) for k, v in M.items() if len(v) == 1 and connected(v[0]) and 6 <= total(v[0]) <= 15 and not monotone(v[0])]
    uniq.sort(); rng.shuffle(uniq); pick = sorted(uniq[:20], key=lambda kv: total(kv[1]))
    data['normal'] = [{'h': [list(r) for r in h]} for k, h in pick]
    # 도전: 가장 적게 / 가장 많이
    multi = []
    for k, v in M.items():
        v = [h for h in v if connected(h)]
        if len(v) < 3: continue
        lo, hi = min(map(total, v)), max(map(total, v))
        if hi - lo >= 2 and sum(map(sum, k[0])) >= 4: multi.append((k, v, lo, hi))
    multi.sort(key=lambda t: t[0]); rng.shuffle(multi)
    hard = []
    for i, (k, v, lo, hi) in enumerate(multi[:20]):
        want = 'min' if i % 2 == 0 else 'max'; goal = lo if want == 'min' else hi
        ex = next(h for h in sorted(v) if total(h) == goal)
        hard.append({'v': [[list(r) for r in k[0]], list(k[1]), list(k[2])], 'want': want, 'n': goal, 'h': [list(r) for r in ex]})
    data['hard'] = sorted(hard, key=lambda p: (p['want'], p['n']))
    return data

def check(data):
    bad = []; M = all_maps()
    for i, p in enumerate(data['easy'], 1):
        h = tuple(map(tuple, p['h']))
        if not (monotone(h) and connected(h)): bad.append(f'easy {i}: 가려진 쌓기나무가 있거나 떨어져 있음')
    for i, p in enumerate(data['normal'], 1):
        h = tuple(map(tuple, p['h']))
        if len(M[views(h)]) != 1: bad.append(f'normal {i}: 세 모양에 맞는 쌓기가 하나가 아님')
    for i, p in enumerate(data['hard'], 1):
        k = (tuple(map(tuple, p['v'][0])), tuple(p['v'][1]), tuple(p['v'][2])); v = M.get(k, [])
        ts = [total(h) for h in v]
        if not v or p['n'] != (min(ts) if p['want'] == 'min' else max(ts)) or views(tuple(map(tuple, p['h']))) != k or total(p['h']) != p['n']: bad.append(f'hard {i}: 가장 적은·많은 개수가 다름')
    for lv in data:
        if len(data[lv]) != 20: bad.append(f'{lv}: 문제 {len(data[lv])}개')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'blocks.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(data)): bad.append('data/blocks.json이 생성기와 다름 — python3 gen_blocks.py로 다시 만드세요')
        print('\n'.join(bad) or '쌓기나무 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('쌓기나무', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요')
    print('  hard', [(p['want'], p['n']) for p in data['hard']])
