#!/usr/bin/env python3
"""창의수학게임 › 마방진 문제 만들기 (2026-10-07)

    python3 gen_magic.py          # data/magic.json (같은 씨앗이면 언제나 같은 문제)
    python3 gen_magic.py check    # 모든 문제가 '답이 하나뿐'인지 다시 확인

3×3: 1~9로 만드는 마방진 8가지(돌리기·뒤집기)를 바탕으로, 보통 단계는 수를 '처음 수 + 간격×(k−1)'로 바꾼 것(예: 2~10, 1·3·5…17, 10·20…90)도 씀.
4×4: 1~16 마방진 7,040가지를 모두 구해 두고, 남긴 칸(주어진 수)과 맞는 마방진이 정확히 하나일 때만 문제로 씀.
"""
import json, random, sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

def lines(n):
    L = [[r * n + c for c in range(n)] for r in range(n)] + [[r * n + c for r in range(n)] for c in range(n)]
    return L + [[i * n + i for i in range(n)], [i * n + n - 1 - i for i in range(n)]]

def all3():
    base = [8, 1, 6, 3, 5, 7, 4, 9, 2]
    out = set()
    g = [base[i:i + 3] for i in range(0, 9, 3)]
    for _ in range(4):
        g = [list(r) for r in zip(*g[::-1])]
        out.add(tuple(sum(g, []))); out.add(tuple(sum([r[::-1] for r in g], [])))
    return sorted(out)

def all4():
    """1~16, 합 34인 4×4 마방진 모두(7,040가지)"""
    S, res, g, used = 34, [], [0] * 16, [False] * 17
    def ok_row(r): return sum(g[r * 4:r * 4 + 4]) == S
    def rec(i):
        if i == 16:
            if all(sum(g[j] for j in l) == S for l in lines(4)): res.append(tuple(g))
            return
        r, c = divmod(i, 4)
        for v in range(1, 17):
            if used[v]: continue
            g[i] = v
            if c == 3 and not ok_row(r): continue
            if c < 3 and sum(g[r * 4:i + 1]) + (3 - c) > S: continue   # 남은 칸이 1 이상
            if r == 3:
                if sum(g[k] for k in range(c, 16, 4)) != S: continue
                if c == 0 and g[3] + g[6] + g[9] + g[12] != S: continue
                if c == 3 and g[0] + g[5] + g[10] + g[15] != S: continue
            used[v] = True; rec(i + 1); used[v] = False
        g[i] = 0
    rec(0)
    return res

def matches(sol, giv): return all(v == 0 or v == s for v, s in zip(giv, sol))

def make(rng, cands, sol, keep):
    """sol에서 keep개 칸만 남겨 답이 하나뿐인 문제를 찾음(여러 번 시도)"""
    n = len(sol)
    for _ in range(400):
        idx = rng.sample(range(n), keep)
        giv = [sol[i] if i in idx else 0 for i in range(n)]
        if sum(1 for c in cands if matches(c, giv)) == 1: return giv
    return None

def gen():
    rng = random.Random(20261007)
    S3 = all3(); S4 = all4(); assert len(S3) == 8 and len(S4) == 7040, (len(S3), len(S4))
    data, seen = {'easy': [], 'normal': [], 'hard': []}, set()
    def add(lv, n, sol, giv, a=1, d=1):
        key = (lv, tuple(giv))
        if key in seen: return False
        seen.add(key); data[lv].append({'n': n, 'g': giv, 's': list(sol), 'sum': sum(sol[:n]), 'a': a, 'd': d}); return True
    # 쉬움: 1~9, 4칸 주어짐(앞 10문제), 3칸 주어짐(뒤 10문제)
    while len(data['easy']) < 20:
        keep = 4 if len(data['easy']) < 10 else 3
        sol = rng.choice(S3); giv = make(rng, S3, sol, keep)
        if giv: add('easy', 3, sol, giv)
    # 보통: 다른 수 묶음(처음 수 a, 간격 d)의 3×3, 2~3칸 주어짐
    sets = [(2, 1), (3, 1), (1, 2), (2, 2), (5, 5), (10, 10), (4, 3), (0, 1), (11, 1), (3, 4)]
    while len(data['normal']) < 20:
        a, d = sets[len(data['normal']) // 2]
        cands = [tuple(a + d * (v - 1) for v in c) for c in S3]
        sol = rng.choice(cands); keep = 3 if len(data['normal']) % 2 == 0 else 2
        giv = make(rng, cands, sol, keep)
        if giv: add('normal', 3, sol, giv, a, d)
    # 도전: 4×4(1~16, 합 34), 앞 10문제 9칸·뒤 10문제 8칸 주어짐
    while len(data['hard']) < 20:
        keep = 9 if len(data['hard']) < 10 else 8
        sol = rng.choice(S4); giv = make(rng, S4, sol, keep)
        if giv: add('hard', 4, sol, giv)
    return data, S3, S4

def check(data, S3=None, S4=None):
    S3 = S3 or all3(); S4 = S4 or all4(); bad = []
    for lv, ps in data.items():
        for i, p in enumerate(ps, 1):
            n = p['n']; cands = S4 if n == 4 else [tuple(p['a'] + p['d'] * (v - 1) for v in c) for c in S3]
            m = [c for c in cands if matches(c, p['g'])]
            if len(m) != 1 or list(m[0]) != p['s']: bad.append(f'{lv} {i}: 답 {len(m)}개')
            if any(sum(p['s'][j] for j in l) != p['sum'] for l in lines(n)): bad.append(f'{lv} {i}: 마방진 아님')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'magic.json'
    if sys.argv[1:] == ['check']:
        bad = check(json.loads(out.read_text()))
        print('\n'.join(bad) or '마방진 점검 통과'); sys.exit(1 if bad else 0)
    data, S3, S4 = gen(); bad = check(data, S3, S4)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('마방진', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요')
