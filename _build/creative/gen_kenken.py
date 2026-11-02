#!/usr/bin/env python3
"""창의수학게임 › 계산 스도쿠(켄켄) 문제 만들기 (2026-10-07)

    python3 gen_kenken.py          # data/kenken.json (같은 씨앗이면 언제나 같은 문제)
    python3 gen_kenken.py check    # 다시 만들어 저장된 것과 같은지, 모든 문제가 논리만으로 하나의 답에 이르는지 확인

규칙: N×N 칸의 가로줄·세로줄마다 1~N이 한 번씩. 굵은 선으로 묶인 칸(묶음)의 수를 적힌 셈(+ − × ÷)으로 계산하면 적힌 수가 됨.
    − 와 ÷ 는 두 칸 묶음에만(큰 수에서 작은 수를 빼거나 나눔). 한 칸 묶음은 그 수가 그대로 적힘.
쉬움 4×4 덧셈만 · 보통 5×5 덧셈·뺄셈 · 도전 6×6 사칙연산, 단계마다 20문제.
모든 문제는 '찍지 않고' 풀립니다: 묶음마다 될 수 있는 수 조합을 따져 지우기 + 줄마다 남은 자리가 하나뿐인 수·칸에 남은 수가 하나뿐인 칸만으로 모든 칸이 정해져야 문제로 씀
(이렇게 정해지면 답은 저절로 하나뿐).
"""
import json, random, sys, pathlib
from itertools import product
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

LEVELS = {
    'easy':   dict(n=4, ops='+', sizes=[1, 2, 2, 2, 3, 3], max_single=2),
    'normal': dict(n=5, ops='+-', sizes=[1, 2, 2, 2, 2, 3, 3], max_single=2),
    'hard':   dict(n=6, ops='+-x/', sizes=[1, 2, 2, 2, 2, 3, 3, 4], max_single=2),
}

def latin(rng, n):
    rows = [[(r + c) % n + 1 for c in range(n)] for r in range(n)]
    rng.shuffle(rows); cols = list(range(n)); rng.shuffle(cols); sym = list(range(1, n + 1)); rng.shuffle(sym)
    return [sym[rows[r][cols[c]] - 1] for r in range(n) for c in range(n)]

def cages_of(rng, n, sizes, max_single):
    for _ in range(200):
        cage = [-1] * (n * n); out = []; order = list(range(n * n)); rng.shuffle(order); single = 0
        for s in order:
            if cage[s] >= 0: continue
            want = rng.choice(sizes); cells = [s]; cage[s] = len(out)
            while len(cells) < want:
                nb = [m for c in cells for m in (c - n, c + n, c - 1 if c % n else -1, c + 1 if c % n < n - 1 else -1) if 0 <= m < n * n and cage[m] < 0]
                if not nb: break
                m = rng.choice(nb); cage[m] = len(out); cells.append(m)
            if len(cells) == 1: single += 1
            out.append(sorted(cells))
        if single <= max_single: return out
    return None

def value(op, vals):
    if op == '+': return sum(vals)
    if op == 'x':
        p = 1
        for v in vals: p *= v
        return p
    a, b = max(vals), min(vals)
    if op == '-': return a - b
    if op == '/': return a // b if a % b == 0 else None

def ops_for(rng, cells, sol, ops):
    vals = [sol[c] for c in cells]
    if len(cells) == 1: return '=', vals[0]
    can = [o for o in ops if (o in '+x' or len(cells) == 2) and value(o, vals) is not None]
    # 두 칸 묶음은 − ÷ 를 자주, 큰 묶음은 + × 를
    w = [3 if (o in '-/' and len(cells) == 2) else 2 if o == 'x' else 2 for o in can]
    o = rng.choices(can, w)[0]
    return o, value(o, vals)

def logic_solve(n, cages):
    """찍지 않고 풀기. 모든 칸이 정해지면 그 답, 아니면 None"""
    dom = [set(range(1, n + 1)) for _ in range(n * n)]
    def ok_combo(cells, vals):
        for i in range(len(cells)):
            for j in range(i + 1, len(cells)):
                a, b = cells[i], cells[j]
                if vals[i] == vals[j] and (a // n == b // n or a % n == b % n): return False
        return True
    changed = True
    while changed:
        changed = False
        for cg in cages:
            cells, op, t = cg['c'], cg['op'], cg['t']
            if op == '=':
                if dom[cells[0]] != {t}: dom[cells[0]] = {t}; changed = True
                continue
            allowed = [set() for _ in cells]
            for vals in product(*[sorted(dom[c]) for c in cells]):
                if value(op, vals) == t and ok_combo(cells, vals):
                    for i, v in enumerate(vals): allowed[i].add(v)
            for i, c in enumerate(cells):
                if dom[c] - allowed[i]: dom[c] &= allowed[i]; changed = True
                if not dom[c]: return None
        units = [[r * n + c for c in range(n)] for r in range(n)] + [[r * n + c for r in range(n)] for c in range(n)]
        for u in units:
            for c in u:   # 정해진 칸의 수는 같은 줄 다른 칸에서 지움
                if len(dom[c]) == 1:
                    v = next(iter(dom[c]))
                    for d in u:
                        if d != c and v in dom[d]: dom[d].discard(v); changed = True
                        if not dom[d]: return None
            for v in range(1, n + 1):   # 줄에서 그 수가 갈 자리가 하나뿐
                where = [c for c in u if v in dom[c]]
                if not where: return None
                if len(where) == 1 and len(dom[where[0]]) > 1: dom[where[0]] = {v}; changed = True
    if all(len(d) == 1 for d in dom): return [next(iter(d)) for d in dom]
    return None

def gen():
    rng = random.Random(20261007)
    data, seen = {}, set()
    for lv, L in LEVELS.items():
        out = []; n = L['n']; tries = 0
        while len(out) < 20:
            tries += 1
            sol = latin(rng, n); cg = cages_of(rng, n, L['sizes'], L['max_single'])
            if not cg: continue
            cages = []
            for cells in cg:
                op, t = ops_for(rng, cells, sol, L['ops']); cages.append({'c': cells, 'op': op, 't': t})
            if lv != 'easy' and not any(c['op'] not in '+=' for c in cages): continue
            if lv == 'hard' and len({c['op'] for c in cages} & set('-x/')) < 3: continue   # 도전은 − × ÷ 가 다 나오게
            if logic_solve(n, cages) != sol: continue
            key = json.dumps(cages)
            if key in seen: continue
            seen.add(key); out.append({'n': n, 'cages': cages, 's': sol})
        data[lv] = out
    return data

def check(data):
    bad = []
    for lv, ps in data.items():
        for i, p in enumerate(ps, 1):
            n, s = p['n'], p['s']
            for r in range(n):
                if sorted(s[r * n:(r + 1) * n]) != list(range(1, n + 1)) or sorted(s[r::n]) != list(range(1, n + 1)): bad.append(f'{lv} {i}: 줄에 같은 수'); break
            cells = sorted(c for cg in p['cages'] for c in cg['c'])
            if cells != list(range(n * n)): bad.append(f'{lv} {i}: 묶음이 칸을 다 덮지 않음')
            for cg in p['cages']:
                v = [s[c] for c in cg['c']]
                if (cg['op'] == '=' and (len(v) != 1 or v[0] != cg['t'])) or (cg['op'] != '=' and value(cg['op'], v) != cg['t']): bad.append(f'{lv} {i}: 묶음 계산이 틀림')
                if cg['op'] in '-/' and len(v) != 2: bad.append(f'{lv} {i}: − ÷ 는 두 칸만')
                if cg['op'] not in '=' + LEVELS[lv]['ops']: bad.append(f'{lv} {i}: 이 단계에 없는 셈')
                st = [cg['c'][0]]; seen = {cg['c'][0]}
                while st:
                    c = st.pop()
                    for m in cg['c']:
                        if m not in seen and (abs(m - c) == n or (abs(m - c) == 1 and m // n == c // n)): seen.add(m); st.append(m)
                if len(seen) != len(cg['c']): bad.append(f'{lv} {i}: 묶음이 이어져 있지 않음')
            if logic_solve(n, p['cages']) != s: bad.append(f'{lv} {i}: 찍지 않고는 풀리지 않음')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'kenken.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(data)): bad.append('data/kenken.json이 생성기와 다름 — python3 gen_kenken.py로 다시 만드세요')
        print('\n'.join(bad) or '계산 스도쿠 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('계산 스도쿠', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요')
