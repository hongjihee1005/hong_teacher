#!/usr/bin/env python3
"""창의수학게임 › 하노이 탑 문제 만들기 (2026-10-07)

    python3 gen_hanoi.py          # data/hanoi.json (같은 씨앗이면 언제나 같은 문제)
    python3 gen_hanoi.py check    # 다시 만들어 저장된 것과 같은지, 가장 적은 횟수가 맞는지 확인

규칙: 원판을 한 번에 하나씩, 기둥 맨 위의 원판만 옮기고, 큰 원판을 작은 원판 위에 놓을 수 없음. 원판을 모두 목표 기둥으로 옮기면 성공.
문제: {n: 원판 수, s: [원판 1(가장 작음)~n이 있는 기둥 0·1·2], g: 목표 기둥, m: 가장 적은 횟수}
    처음부터(모두 한 기둥에) 시작하는 문제와 '중간에서 시작'(원판이 여러 기둥에 흩어진 상태)하는 문제를 섞고, 단계 안에서는 가장 적은 횟수가 작은 것부터.
가장 적은 횟수: 큰 원판부터 보며, 원판 k가 목표 기둥에 없으면 2^(k−1)번을 더하고 더 작은 원판들의 목표를 '나머지 기둥'으로 바꿈
(원판 k를 옮기려면 더 작은 원판이 모두 나머지 기둥에 있어야 하므로). check는 이 값을 너비 우선 탐색으로 따로 구해 견줌.
"""
import json, random, sys, pathlib
from collections import deque
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

def min_moves(s, g):
    t, m = g, 0
    for k in range(len(s), 0, -1):
        if s[k - 1] != t: m += 2 ** (k - 1); t = 3 - s[k - 1] - t
    return m

def bfs(s, g):
    n = len(s); goal = tuple([g] * n); start = tuple(s); seen = {start: 0}; q = deque([start])
    while q:
        u = q.popleft()
        if u == goal: return seen[u]
        top = {}
        for k in range(n, 0, -1): top[u[k - 1]] = k   # 기둥마다 맨 위(가장 작은) 원판
        for a, k in top.items():
            for b in range(3):
                if b != a and (b not in top or top[b] > k):
                    v = list(u); v[k - 1] = b; v = tuple(v)
                    if v not in seen: seen[v] = seen[u] + 1; q.append(v)

LEVELS = {   # (원판 수, 처음부터 시작하는 문제 수, 중간에서 시작하는 문제 수)
    'easy':   [(2, 1, 0), (3, 2, 9)],
    'normal': [(4, 2, 10)],
    'hard':   [(5, 2, 6), (6, 2, 2)],
}

def gen():
    rng = random.Random(20261007); data = {}
    for lv, spec in LEVELS.items():
        out, seen = [], set()
        for n, full, mid in spec:
            for g in (2, 1)[:full]:
                p = {'n': n, 's': [0] * n, 'g': g}; p['m'] = min_moves(p['s'], g); out.append(p); seen.add((tuple(p['s']), g))
            k = 0
            while k < mid:
                s = [rng.randrange(3) for _ in range(n)]; g = rng.randrange(3); m = min_moves(s, g)
                if (tuple(s), g) in seen or len(set(s)) < 2 or m < 2 ** (n - 1) - 1 or m > 2 ** n - 2: continue   # 흩어져 있고, 너무 쉽지 않게
                seen.add((tuple(s), g)); out.append({'n': n, 's': s, 'g': g, 'm': m}); k += 1
        data[lv] = sorted(out, key=lambda p: (p['n'], p['m'], p['s'] != [0] * p['n']))
    return data

def check(data):
    bad = []
    for lv, ps in data.items():
        for i, p in enumerate(ps, 1):
            b = bfs(p['s'], p['g'])
            if b != p['m'] or min_moves(p['s'], p['g']) != p['m']: bad.append(f'{lv} {i}: 가장 적은 횟수가 다름({p["m"]} / 탐색 {b})')
            if len(p['s']) != p['n'] or any(x not in (0, 1, 2) for x in p['s']): bad.append(f'{lv} {i}: 원판 자리')
            if p['m'] == 0: bad.append(f'{lv} {i}: 이미 다 옮겨져 있음')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'hanoi.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(data)): bad.append('data/hanoi.json이 생성기와 다름 — python3 gen_hanoi.py로 다시 만드세요')
        print('\n'.join(bad) or '하노이 탑 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('하노이 탑', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요')
    for k, v in data.items(): print(' ', k, [(p['n'], p['m']) for p in v])
