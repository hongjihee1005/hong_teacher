#!/usr/bin/env python3
"""학년별 스도쿠 30문제 만들기 → puzzles.json (한 번 만들어 저장, 다시 돌려도 같은 결과)

    python3 _build/sudoku/gen.py

- 1·2학년 4×4(2×2 칸), 3·4학년 6×6(2×3 칸), 5·6학년 9×9(3×3 칸)
- 모든 문제는 (1) 답이 하나뿐이고 (2) '넣을 수 있는 수가 하나뿐인 칸 / 그 수가 들어갈 자리가 하나뿐' 두 가지 방법만으로
  처음부터 끝까지 풀립니다(찍기 없이 논리로만). 학년 안에서는 주어진 수가 많은 것(쉬운 것)부터 차례로 놓습니다.
"""
import json, random, pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent

GRADES = {  # 학년: (한 변, 칸 높이, 칸 너비, 주어지는 수 목표(최소, 최대))
    1: (4, 2, 2, (9, 11)), 2: (4, 2, 2, (6, 8)),
    3: (6, 2, 3, (20, 24)), 4: (6, 2, 3, (13, 17)),
    5: (9, 3, 3, (38, 44)), 6: (9, 3, 3, (28, 33)),
}

def units(n, bh, bw):
    us = [[r * n + c for c in range(n)] for r in range(n)] + [[r * n + c for r in range(n)] for c in range(n)]
    for br in range(0, n, bh):
        for bc in range(0, n, bw):
            us.append([(br + i) * n + bc + j for i in range(bh) for j in range(bw)])
    peers = [set() for _ in range(n * n)]
    for u in us:
        for a in u: peers[a] |= set(u) - {a}
    return us, peers

def full(n, bh, bw, rnd):
    us, peers = units(n, bh, bw)
    g = [0] * (n * n)
    def bt(i):
        if i == n * n: return True
        ds = list(range(1, n + 1)); rnd.shuffle(ds)
        for d in ds:
            if all(g[p] != d for p in peers[i]):
                g[i] = d
                if bt(i + 1): return True
        g[i] = 0
        return False
    bt(0); return g

def count(g, n, peers, limit=2):
    g = g[:]; c = [0]
    def bt():
        best, bc = -1, None
        for i in range(n * n):
            if g[i] == 0:
                cand = [d for d in range(1, n + 1) if all(g[p] != d for p in peers[i])]
                if bc is None or len(cand) < len(bc): best, bc = i, cand
                if not cand: return
        if best < 0: c[0] += 1; return
        for d in bc:
            g[best] = d; bt(); g[best] = 0
            if c[0] >= limit: return
    bt(); return c[0]

def logic(g, n, us, peers):
    """홑수(naked single)·숨은 홑수(hidden single)만으로 풀어 봄 → 다 풀리면 True"""
    g = g[:]
    while 0 in g:
        moved = False
        cand = {i: {d for d in range(1, n + 1) if all(g[p] != d for p in peers[i])} for i in range(n * n) if g[i] == 0}
        for i, cs in cand.items():
            if len(cs) == 1: g[i] = cs.pop(); moved = True
        if moved: continue
        for u in us:
            for d in range(1, n + 1):
                if any(g[i] == d for i in u): continue
                spots = [i for i in u if g[i] == 0 and d in cand[i]]
                if len(spots) == 1: g[spots[0]] = d; moved = True
        if not moved: return False
    return True

def make(grade, k, rnd):
    n, bh, bw, (lo, hi) = GRADES[grade]
    us, peers = units(n, bh, bw)
    target = rnd.randint(lo, hi)
    while True:
        sol = full(n, bh, bw, rnd)
        p = sol[:]
        order = list(range(n * n)); rnd.shuffle(order)
        for i in order:
            if sum(1 for v in p if v) <= target: break
            v = p[i]; p[i] = 0
            if count(p, n, peers) != 1 or not logic(p, n, us, peers): p[i] = v
        if sum(1 for v in p if v) <= hi: return p, sol

def main():
    out = {}
    for g in GRADES:
        rnd = random.Random(20261004 + g)
        seen, ps = set(), []
        while len(ps) < 30:
            p, s = make(g, len(ps), rnd)
            key = ''.join(map(str, p))
            if key in seen: continue
            seen.add(key); ps.append((p, s))
        ps.sort(key=lambda x: -sum(1 for v in x[0] if v))
        n, bh, bw, _ = GRADES[g]
        out[g] = dict(n=n, bh=bh, bw=bw, p=[''.join(map(str, p)) for p, s in ps], s=[''.join(map(str, s)) for p, s in ps])
        print(f'{g}학년: {n}×{n}, 주어진 수 {sum(1 for c in out[g]["p"][0] if c != "0")}~{sum(1 for c in out[g]["p"][-1] if c != "0")}개', file=sys.stderr)
    (HERE / 'puzzles.json').write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding='utf-8')

def check():
    """puzzles.json 점검: 답이 규칙에 맞고, 문제와 일치하고, 답이 하나뿐이고, 논리로 풀리는지"""
    data = json.loads((HERE / 'puzzles.json').read_text(encoding='utf-8')); bad = 0
    for g, d in data.items():
        n = d['n']; us, peers = units(n, d['bh'], d['bw'])
        assert len(d['p']) == 30
        for p, s in zip(d['p'], d['s']):
            P, S = [int(c) for c in p], [int(c) for c in s]
            ok = all(sorted(S[i] for i in u) == list(range(1, n + 1)) for u in us) and all(a in (0, b) for a, b in zip(P, S))
            ok = ok and count(P, n, peers) == 1 and logic(P, n, us, peers)
            bad += not ok
    print(f'스도쿠 점검: 문제 {sum(len(d["p"]) for d in data.values())}개, 이상 {bad}개'); return bad

if __name__ == '__main__':
    if sys.argv[1:] == ['check']: sys.exit(1 if check() else 0)
    main(); check()
