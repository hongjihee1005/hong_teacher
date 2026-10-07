#!/usr/bin/env python3
"""창의수학게임 › 저울 퍼즐 문제 만들기 (2026-10-07)

    python3 gen_balance.py          # data/balance.json (같은 씨앗이면 언제나 같은 문제)
    python3 gen_balance.py check    # 다시 만들어 저장된 것과 같은지, 무게가 딱 하나로 정해지는지 확인

규칙: 수평을 이룬 저울 몇 개를 보고 모양(●▲■★) 하나하나의 무게를 찾음. 무게는 모두 자연수.
저울 하나 = 왼쪽 접시와 오른쪽 접시의 무게가 같다는 식. 접시에는 모양과 숫자 추(그 수만큼의 무게)가 놓임.
문제: {k: 모양 수, w: [모양별 무게], sc: [[왼쪽 토큰들, 오른쪽 토큰들], …]} 토큰은 모양 번호 0~3 또는 {'n': 수}.
모든 문제는 저울 식들의 '방정식 개수 = 모양 수'이고 유리수로 풀어도 답이 하나뿐(행렬의 계수가 꽉 참)이며 그 답이 저장한 무게와 같음 → 답이 딱 하나.
쉬움: 모양 2개 · 저울 2개(하나는 '모양 = 수'), 무게 1~9 / 보통: 모양 3개 · 저울 3개(모양이 한 가지뿐인 저울은 많아야 1개), 무게 2~12 /
도전: 모양 3~4개 · 저울 3~4개(모양이 한 가지뿐인 저울 없음 — 모두 두 모양 이상을 이어서 풀어야 함), 무게 2~15.
"""
import json, random, sys, pathlib
from fractions import Fraction
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

def side_val(side, w): return sum(w[t] if isinstance(t, int) else t['n'] for t in side)

def coeffs(sc, k):
    """저울 하나 → (모양별 계수, 상수): Σ계수·무게 = 상수"""
    a = [0] * k; c = 0
    for t in sc[0]:
        if isinstance(t, int): a[t] += 1
        else: c -= t['n']
    for t in sc[1]:
        if isinstance(t, int): a[t] -= 1
        else: c += t['n']
    return a, c

def solve(scs, k):
    """유리수로 풀어 답이 하나뿐이면 그 답, 아니면 None"""
    M = [[Fraction(x) for x in a] + [Fraction(c)] for a, c in (coeffs(s, k) for s in scs)]
    r = 0
    for col in range(k):
        piv = next((i for i in range(r, len(M)) if M[i][col] != 0), None)
        if piv is None: return None
        M[r], M[piv] = M[piv], M[r]
        M[r] = [x / M[r][col] for x in M[r]]
        for i in range(len(M)):
            if i != r and M[i][col] != 0: M[i] = [a - M[i][col] * b for a, b in zip(M[i], M[r])]
        r += 1
    if any(all(x == 0 for x in row[:k]) and row[k] != 0 for row in M): return None
    return [M[i][k] for i in range(k)]

LEVELS = {
    'easy':   dict(k=(2, 2), wr=(1, 9), direct=(1, 1)),
    'normal': dict(k=(3, 3), wr=(2, 12), direct=(0, 1)),
    'hard':   dict(k=(3, 4), wr=(2, 15), direct=(0, 0)),
}

def is_direct(sc):   # 모양이 한 가지뿐인 저울(예: ● = 6, ● ● = 14, ● = ● … 은 없음) — 그 저울만으로 무게가 바로 나옴
    return len({t for t in sc[0] + sc[1] if isinstance(t, int)}) == 1

def make_scale(rng, k, w, direct):
    if direct:
        s = rng.randrange(k); return [[s], [{'n': w[s]}]]
    for _ in range(200):
        left = sorted(rng.choices(range(k), k=rng.randint(1, 3)))
        kind = rng.random()
        if kind < .5:   # 모양끼리 (남는 무게는 숫자 추로 맞춤)
            right = sorted(rng.choices(range(k), k=rng.randint(1, 3)))
            if set(left) & set(right): continue
            d = side_val(left, w) - side_val(right, w)
            if d > 0: right = right + [{'n': d}]
            elif d < 0: left = left + [{'n': -d}]
        else:           # 모양들 = 숫자 추
            if len(left) == 1: continue
            right = [{'n': side_val(left, w)}]
        if len(left) + len(right) > 6 or side_val(left, w) > 40: continue
        return [left, right]

def gen():
    rng = random.Random(20261007); data = {}; seen = set()
    for lv, L in LEVELS.items():
        out = []
        while len(out) < 20:
            k = rng.randint(*L['k']); w = [rng.randint(*L['wr']) for _ in range(k)]
            if len(set(w)) < k: continue   # 모양마다 무게가 다르게
            nd = rng.randint(*L['direct']); scs = [make_scale(rng, k, w, i < nd) for i in range(k)]
            if any(s is None for s in scs): continue
            if sum(is_direct(s) for s in scs) != nd: continue
            if any(not any(isinstance(t, int) for t in s[0] + s[1]) for s in scs): continue
            sol = solve(scs, k)
            if sol != w: continue
            rng.shuffle(scs)
            key = json.dumps(scs, sort_keys=True)
            if key in seen: continue
            seen.add(key); out.append({'k': k, 'w': w, 'sc': scs})
        data[lv] = sorted(out, key=lambda p: (p['k'], sum(len(s[0]) + len(s[1]) for s in p['sc'])))
    return data

def check(data):
    bad = []
    for lv, ps in data.items():
        L = LEVELS[lv]
        for i, p in enumerate(ps, 1):
            k, w = p['k'], p['w']
            if solve(p['sc'], k) != w: bad.append(f'{lv} {i}: 답이 하나로 정해지지 않거나 다름')
            for s in p['sc']:
                if side_val(s[0], w) != side_val(s[1], w): bad.append(f'{lv} {i}: 저울이 수평이 아님')
            if not (L['direct'][0] <= sum(is_direct(s) for s in p['sc']) <= L['direct'][1]): bad.append(f'{lv} {i}: 모양 = 수 저울 개수')
            if not all(L['wr'][0] <= x <= L['wr'][1] for x in w): bad.append(f'{lv} {i}: 무게 범위')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'balance.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(data)): bad.append('data/balance.json이 생성기와 다름 — python3 gen_balance.py로 다시 만드세요')
        print('\n'.join(bad) or '저울 퍼즐 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('저울 퍼즐', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요')
    S = '●▲■★'
    for lv in data:
        for p in data[lv][:3] + data[lv][-1:]:
            f = lambda side: ' '.join(S[t] if isinstance(t, int) else str(t['n']) for t in side)
            print(' ', lv, p['w'], ' | '.join(f(a) + ' = ' + f(b) for a, b in p['sc']))
