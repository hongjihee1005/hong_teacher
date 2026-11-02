#!/usr/bin/env python3
"""창의수학게임 › 목표 수 만들기 문제 만들기 (2026-10-07)

    python3 gen_make.py          # data/make.json (같은 씨앗이면 언제나 같은 문제)
    python3 gen_make.py check    # 다시 만들어 저장된 것과 같은지, 모든 문제를 만들 수 있는지 확인

규칙: 수 카드를 모두 한 번씩 써서 목표 수를 만듦. 카드 두 장과 셈 하나를 고르면 두 카드가 계산 결과 카드 한 장이 됨.
    뺄셈은 큰 수에서 작은 수를(0은 됨), 나눗셈은 나누어떨어질 때만. 마지막 한 장이 목표 수면 성공.
쉬움: 카드 3장(1~9), + − , 목표 5~20 / 보통: 카드 4장(1~9), + − ×, 목표 10~60, 곱셈을 꼭 써야 하는 문제 /
도전: 카드 4장(1~9), + − × ÷, 목표 24가 절반·나머지는 다른 수, 곱셈이나 나눗셈을 꼭 써야 하고 방법이 적은(어려운) 문제부터 고름.
문제마다 만드는 방법 하나(s: [[a, 셈, b], …])를 저장해 힌트·정답 보기에 씀. 단계 안에서는 만드는 방법이 많은(쉬운) 것부터.
"""
import json, random, sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

def calc(a, op, b):
    if op == '+': return a + b
    if op == '-': return a - b if a >= b else None
    if op == 'x': return a * b
    if op == '/': return a // b if b and a % b == 0 else None

def solutions(cards, ops, target, limit=10 ** 6):
    """만드는 방법(계산 차례)을 모두 셈 — (방법 수, 그중 하나)"""
    count = 0; first = None
    def rec(cs, steps):
        nonlocal count, first
        if len(cs) == 1:
            if cs[0] == target:
                count += 1
                if first is None: first = list(steps)
            return
        n = len(cs)
        for i in range(n):
            for j in range(n):
                if i == j: continue
                for op in ops:
                    if op in '+x' and i > j: continue   # 바꿔도 같은 셈은 한 번만
                    r = calc(cs[i], op, cs[j])
                    if r is None: continue
                    rest = [cs[k] for k in range(n) if k not in (i, j)] + [r]
                    steps.append([cs[i], op, cs[j]]); rec(rest, steps); steps.pop()
    rec(list(cards), [])
    return count, first

LEVELS = {
    'easy':   dict(k=3, ops='+-', t=(5, 20)),
    'normal': dict(k=4, ops='+-x', t=(10, 60), need='x'),
    'hard':   dict(k=4, ops='+-x/', t=(10, 48), need='x/'),
}

def gen():
    rng = random.Random(20261007); data = {}
    for lv, L in LEVELS.items():
        out, seen = [], set(); tries = 0
        while len(out) < (40 if lv == 'hard' else 20):
            tries += 1
            cards = sorted(rng.randint(1, 9) for _ in range(L['k']))
            t = 24 if lv == 'hard' and len(out) % 2 == 0 else rng.randint(*L['t'])
            key = (tuple(cards), t)
            if key in seen: continue
            n, s = solutions(cards, L['ops'], t)
            if not n: continue
            if 'need' in L:   # 덧셈·뺄셈만으로도 되면 빼기
                if solutions(cards, '+-', t)[0]: continue
            if lv == 'easy' and len(set(cards)) < 2: continue
            seen.add(key); out.append({'c': cards, 't': t, 'n': n, 's': s})
        if lv == 'hard':   # 방법이 적은(어려운) 것 20개 — 24 10개 + 다른 수 10개
            a = sorted([p for p in out if p['t'] == 24], key=lambda p: p['n'])[:10]
            b = sorted([p for p in out if p['t'] != 24], key=lambda p: p['n'])[:10]
            out = a + b
        data[lv] = sorted(out, key=lambda p: (-p['n'], p['t']))
        for p in data[lv]: p['ops'] = L['ops']
    return data

def check(data):
    bad = []
    for lv, ps in data.items():
        L = LEVELS[lv]
        if len(ps) != 20: bad.append(f'{lv}: 문제 수 {len(ps)}')
        for i, p in enumerate(ps, 1):
            n, _ = solutions(p['c'], p['ops'], p['t'])
            if not n or n != p['n']: bad.append(f'{lv} {i}: 만들 수 없거나 방법 수가 다름')
            if 'need' in L and solutions(p['c'], '+-', p['t'])[0]: bad.append(f'{lv} {i}: 덧셈·뺄셈만으로도 됨')
            cs = list(p['c'])   # 저장한 방법을 따라가 보기
            for a, op, b in p['s']:
                if a not in cs: bad.append(f'{lv} {i}: 방법이 카드와 안 맞음'); break
                cs.remove(a)
                if b not in cs: bad.append(f'{lv} {i}: 방법이 카드와 안 맞음'); break
                cs.remove(b); cs.append(calc(a, op, b))
            if cs != [p['t']]: bad.append(f'{lv} {i}: 저장한 방법으로 목표 수가 안 나옴')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'make.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(data)): bad.append('data/make.json이 생성기와 다름 — python3 gen_make.py로 다시 만드세요')
        print('\n'.join(bad) or '목표 수 만들기 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('목표 수 만들기', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요')
    for k, v in data.items(): print(' ', k, [(p['c'], p['t'], p['n']) for p in v][:20])
