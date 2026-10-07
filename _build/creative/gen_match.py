#!/usr/bin/env python3
"""창의수학게임 › 성냥개비 식 고치기 문제 만들기 (2026-10-07)

    python3 gen_match.py          # data/match.json (같은 씨앗이면 언제나 같은 문제)
    python3 gen_match.py check    # 다시 만들어 저장된 것과 같은지, 답이 딱 하나인지 확인

규칙: 성냥개비로 만든 틀린 식에서 성냥개비를 정해진 개수(k)만큼 옮겨 맞는 식으로 만듦.
숫자는 7칸 숫자판 모양(a 위 · b 오른쪽 위 · c 오른쪽 아래 · d 아래 · e 왼쪽 아래 · f 왼쪽 위 · g 가운데),
연산 기호는 + (가로·세로) 와 − (가로), = 는 움직이지 않음. 옮긴 뒤에도 모든 자리가 숫자·기호여야 하고, 두 자리 수는 0으로 시작하지 않음.
문제마다 k개를 옮겨 맞는 식이 되는 방법이 **딱 하나**(결과 식이 하나)이고, 더 적게 옮겨서는 맞는 식이 안 됨.
쉬움: 한 자리 수끼리, 1개 옮기기 / 보통: 답이 두 자리일 수 있음, 1개 옮기기 / 도전: 2개 옮기기.
"""
import json, random, sys, pathlib
from itertools import combinations
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

SEG = {'0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg'}
OPS = {'+': 'hv', '-': 'h'}
DIG = {frozenset(v): k for k, v in SEG.items()}; OPP = {frozenset(v): k for k, v in OPS.items()}

def slots(eq):
    """'6+4=4' → [(종류, 글자)] — 종류 d(숫자)·o(+−)·e(=)"""
    return [('d' if ch.isdigit() else 'o' if ch in '+-' else 'e', ch) for ch in eq]

def positions(eq):
    """움직일 수 있는 성냥개비 자리 전체 [(자리 번호, 칸)]와 지금 놓인 것 집합"""
    allp, on = [], set()
    for i, (t, ch) in enumerate(slots(eq)):
        if t == 'e': continue
        cells = 'abcdefg' if t == 'd' else 'hv'
        for c in cells:
            allp.append((i, c))
            if c in (SEG[ch] if t == 'd' else OPS[ch]): on.add((i, c))
    return allp, on

def read(eq, on):
    """놓인 성냥개비 → 식 글자(못 읽으면 None)"""
    out = []
    for i, (t, ch) in enumerate(slots(eq)):
        if t == 'e': out.append('='); continue
        s = frozenset(c for (j, c) in on if j == i)
        r = (DIG if t == 'd' else OPP).get(s)
        if r is None: return None
        out.append(r)
    return ''.join(out)

def true_eq(s):
    if s is None: return False
    l, r = s.split('=')
    for part in [r] + [x for x in l.replace('-', '+').split('+')]:
        if len(part) > 1 and part[0] == '0': return False
    if '+' in l: a, b = l.split('+'); return int(a) + int(b) == int(r)
    a, b = l.split('-'); return int(a) - int(b) == int(r)

def lead0(s):   # 0으로 시작하는 두 자리 수가 있나
    import re
    return any(len(x) > 1 and x[0] == '0' for x in re.split(r'[+=-]', s))

def results(eq, k):
    """k개를 옮겨 나오는 맞는 식들(집합)"""
    allp, on = positions(eq); off = [p for p in allp if p not in on]; out = set()
    for rem in combinations(sorted(on), k):
        for add in combinations(off, k):
            new = (on - set(rem)) | set(add); s = read(eq, new)
            if true_eq(s): out.add(s)
    return out

LEVELS = {
    'easy':   dict(k=1, two=False),
    'normal': dict(k=1, two=True),
    'hard':   dict(k=2, two=True),
}

def rand_true(rng, two):
    while True:
        op = rng.choice('+-')
        if op == '+':
            a, b = rng.randint(0, 9), rng.randint(0, 9); c = a + b
            if not two and c > 9: continue
            if two and c < 10 and rng.random() < .5: continue
        else:
            if two and rng.random() < .5: a = rng.randint(10, 19); b = rng.randint(1, 9)
            else: a = rng.randint(1, 9); b = rng.randint(0, a)
            c = a - b
        return f'{a}{op}{b}={c}'

def gen():
    rng = random.Random(20261007); data = {}; seen = set()
    for lv, L in LEVELS.items():
        out = []
        while len(out) < 20:
            sol = rand_true(rng, L['two'])
            allp, on = positions(sol); off = [p for p in allp if p not in on]
            if len(off) < L['k']: continue
            rem = rng.sample(sorted(on), L['k']); add = rng.sample(off, L['k'])
            start = read(sol, (on - set(rem)) | set(add))
            if start is None or true_eq(start) or start in seen or lead0(start): continue
            if '=' not in start or start.count('=') != 1: continue
            if any(results(start, j) for j in range(1, L['k'])): continue   # 더 적게 옮겨서도 되면 빼기
            r = results(start, L['k'])
            if r != {sol}: continue
            seen.add(start); out.append({'q': start, 'a': sol, 'k': L['k']})
        data[lv] = out
    return data

def check(data):
    bad = []
    for lv, ps in data.items():
        for i, p in enumerate(ps, 1):
            if true_eq(p['q']): bad.append(f'{lv} {i}: 처음 식이 이미 맞음')
            if lead0(p['q']): bad.append(f'{lv} {i}: 0으로 시작하는 두 자리 수')
            if results(p['q'], p['k']) != {p['a']}: bad.append(f'{lv} {i}: 답이 딱 하나가 아님')
            if any(results(p['q'], j) for j in range(1, p['k'])): bad.append(f'{lv} {i}: 더 적게 옮겨도 됨')
            if len(p['q']) != len(p['a']) or any((a.isdigit()) != (b.isdigit()) for a, b in zip(p['q'], p['a'])): bad.append(f'{lv} {i}: 자리 모양이 다름')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'match.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(data)): bad.append('data/match.json이 생성기와 다름 — python3 gen_match.py로 다시 만드세요')
        print('\n'.join(bad) or '성냥개비 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('성냥개비', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요')
    for k, v in data.items(): print(' ', k, ' '.join(p['q'] + '→' + p['a'] for p in v))
