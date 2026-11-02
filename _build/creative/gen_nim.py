#!/usr/bin/env python3
"""창의수학게임 › 님 게임 판 만들기 (2026-10-07)

    python3 gen_nim.py          # data/nim.json
    python3 gen_nim.py check    # 다시 만들어 같은지, 모든 판이 '먼저 하는 사람이 잘하면 반드시 이기는' 판인지 확인

규칙: 돌 무더기(줄)에서 번갈아 돌을 가져가고, 마지막 돌을 가져가는 사람이 이김.
쉬움: 한 줄, 한 번에 1~2개 / 보통: 한 줄, 1~3개 / 도전: 3~4줄, 한 줄에서 몇 개든(1개 이상).
판: {p: [줄마다 돌 수], k: 한 번에 가져갈 수 있는 최대(0이면 제한 없음)} — 단계마다 10판.
모든 판은 먼저 하는 사람(학생)이 바른 방법으로 하면 이기는 판이어서, 컴퓨터를 이길 수 있음.
check는 공식(한 줄: 돌 수가 (k+1)의 배수가 아니면 이김 / 여러 줄: 줄마다 돌 수를 2진법으로 더한 '님 합'이 0이 아니면 이김)과
모든 경우를 따라가 보는 계산(작은 판 전부)이 같은지 확인함.
"""
import json, random, sys, pathlib
from functools import lru_cache
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

def win_formula(p, k):
    if len(p) == 1 and k: return p[0] % (k + 1) != 0
    x = 0
    for n in p: x ^= n
    return x != 0

@lru_cache(None)
def win_search(p, k):   # 지금 차례인 사람이 이기는 판인가(모두 따라가 보기)
    for i, n in enumerate(p):
        for t in range(1, (min(n, k) if k else n) + 1):
            q = tuple(sorted(p[:i] + (n - t,) + p[i + 1:]))
            if not any(q) or not win_search(q, k): return True
    return False

def gen():
    rng = random.Random(20261007); data = {}
    specs = {'easy': (2, lambda: [rng.randint(5, 20)]), 'normal': (3, lambda: [rng.randint(13, 27)]),
             'hard': (0, lambda: sorted(rng.randint(1, 7) for _ in range(rng.choice((3, 3, 4)))))}
    for lv, (k, mk) in specs.items():
        out, seen = [], set()
        while len(out) < 10:
            p = mk(); key = tuple(p)
            if key in seen or not win_formula(p, k): continue
            if lv == 'hard' and sum(p) < 9: continue
            seen.add(key); out.append({'p': p, 'k': k})
        data[lv] = sorted(out, key=lambda q: sum(q['p']))
    return data

def check(data):
    bad = []
    for lv, ps in data.items():
        if len(ps) != 10: bad.append(f'{lv}: 판 {len(ps)}개')
        for i, q in enumerate(ps, 1):
            f = win_formula(q['p'], q['k']); s = win_search(tuple(sorted(q['p'])), q['k'])
            if not f or f != s: bad.append(f'{lv} {i}: 먼저 하는 사람이 이기는 판이 아니거나 공식과 계산이 다름')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'nim.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(data)): bad.append('data/nim.json이 생성기와 다름 — python3 gen_nim.py로 다시 만드세요')
        print('\n'.join(bad) or '님 게임 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('님 게임', {k: len(v) for k, v in data.items()}, '판을 만들고 점검했어요')
    for k, v in data.items(): print(' ', k, [q['p'] for q in v])
