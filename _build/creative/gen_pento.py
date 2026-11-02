#!/usr/bin/env python3
"""창의수학게임 › 펜토미노 채우기 문제 만들기 (2026-10-07)

    python3 gen_pento.py          # data/pento.json (같은 씨앗이면 언제나 같은 문제)
    python3 gen_pento.py check    # 다시 만들어 저장된 것과 같은지, 저장한 풀이가 판을 빈틈·겹침 없이 채우는지 확인

펜토미노: 정사각형 5개를 변끼리 이어 붙인 12가지 조각(F I L N P T U V W X Y Z). 조각은 돌리고 뒤집을 수 있음.
문제: 직사각형 판 + 서로 다른 조각 몇 개 → 조각을 모두 써서 판을 빈틈·겹침 없이 채우기. 채우는 방법은 여러 가지일 수 있고 어떤 방법이든 맞음.
조각 묶음은 판을 무작위 순서로 채워 나가는 탐색(빈 칸 중 맨 위·맨 왼쪽 칸부터)으로 찾고, 그 풀이를 저장함 → 모든 문제는 풀 수 있음.
쉬움: 5×3(3조각) · 5×4(4조각) / 보통: 5×5(5조각) · 6×5(6조각) / 도전: 7×5(7조각) · 8×5(8조각) · 마지막은 12조각 모두로 10×6.
"""
import json, random, sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True

BASE = {'F': [(1, 0), (2, 0), (0, 1), (1, 1), (1, 2)], 'I': [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4)], 'L': [(0, 0), (0, 1), (0, 2), (0, 3), (1, 3)],
        'N': [(0, 0), (0, 1), (1, 1), (1, 2), (1, 3)], 'P': [(0, 0), (1, 0), (0, 1), (1, 1), (0, 2)], 'T': [(0, 0), (1, 0), (2, 0), (1, 1), (1, 2)],
        'U': [(0, 0), (2, 0), (0, 1), (1, 1), (2, 1)], 'V': [(0, 0), (0, 1), (0, 2), (1, 2), (2, 2)], 'W': [(0, 0), (0, 1), (1, 1), (1, 2), (2, 2)],
        'X': [(1, 0), (0, 1), (1, 1), (2, 1), (1, 2)], 'Y': [(1, 0), (0, 1), (1, 1), (1, 2), (1, 3)], 'Z': [(0, 0), (1, 0), (1, 1), (1, 2), (2, 2)]}

def norm(cs):
    mx = min(x for x, y in cs); my = min(y for x, y in cs)
    return tuple(sorted((x - mx, y - my) for x, y in cs))

def orients(p):
    out, seen = [], set()
    for f in (0, 1):
        cs = [(-x if f else x, y) for x, y in BASE[p]]
        for r in range(4):
            n = norm(cs)
            if n not in seen: seen.add(n); out.append((r, f, n))
            cs = [(-y, x) for x, y in cs]   # 90° 돌리기(화면 좌표에서 시계 방향)
    return out
OR = {p: orients(p) for p in BASE}

def tile(W, H, k, rng, limit=200000):
    """W×H 판을 서로 다른 조각 k개로 채우는 방법 하나: [(조각, r, f, x, y)] — 조각 묶음과 놓는 차례는 무작위"""
    board = [[None] * W for _ in range(H)]; used = []; steps = [0]
    names = list(BASE)
    def first_empty():
        for y in range(H):
            for x in range(W):
                if board[y][x] is None: return x, y
    def rec():
        steps[0] += 1
        if steps[0] > limit: return False
        e = first_empty()
        if e is None: return len(used) == k
        if len(used) == k: return False
        ex, ey = e; rng.shuffle(names)
        for p in list(names):
            if any(u[0] == p for u in used): continue
            os_ = OR[p][:]; rng.shuffle(os_)
            for r, f, cs in os_:
                ax, ay = min(cs, key=lambda c: (c[1], c[0]))   # 조각의 맨 위·맨 왼쪽 칸을 빈 칸에 맞춤
                ox, oy = ex - ax, ey - ay; cells = [(ox + x, oy + y) for x, y in cs]
                if all(0 <= x < W and 0 <= y < H and board[y][x] is None for x, y in cells):
                    for x, y in cells: board[y][x] = p
                    used.append((p, r, f, ox, oy))
                    if rec(): return True
                    used.pop()
                    for x, y in cells: board[y][x] = None
        return False
    return list(used) if rec() else None

def all_sets(W, H, k):
    """작은 판: 서로 다른 조각 k개로 채우는 묶음을 모두 — {묶음: 풀이 하나}"""
    board = [[None] * W for _ in range(H)]; used = []; out = {}
    def first_empty():
        for y in range(H):
            for x in range(W):
                if board[y][x] is None: return x, y
    def rec():
        e = first_empty()
        if e is None:
            if len(used) == k: out.setdefault(tuple(sorted(u[0] for u in used)), list(used))
            return
        if len(used) == k: return
        ex, ey = e
        for p in BASE:
            if any(u[0] == p for u in used): continue
            for r, f, cs in OR[p]:
                ax, ay = min(cs, key=lambda c: (c[1], c[0])); ox, oy = ex - ax, ey - ay; cells = [(ox + x, oy + y) for x, y in cs]
                if all(0 <= x < W and 0 <= y < H and board[y][x] is None for x, y in cells):
                    for x, y in cells: board[y][x] = p
                    used.append((p, r, f, ox, oy)); rec(); used.pop()
                    for x, y in cells: board[y][x] = None
    rec(); return out

# (가로, 세로, 조각 수, 문제 수, 방법) — all: 묶음을 모두 늘어놓고 고름 / rand: 무작위 탐색
LEVELS = {'easy': [(5, 3, 3, 7, 'all'), (5, 4, 4, 13, 'all')], 'normal': [(5, 5, 5, 10, 'all'), (6, 5, 6, 10, 'all')],
          'hard': [(7, 5, 7, 10, 'rand'), (8, 5, 8, 9, 'rand'), (10, 6, 12, 1, 'rand')]}

def gen():
    rng = random.Random(20261007); data = {}
    for lv, spec in LEVELS.items():
        out = []
        for W, H, k, cnt, how in spec:
            if how == 'all':
                sets = all_sets(W, H, k); keys = sorted(sets); rng.shuffle(keys)
                for key in keys[:cnt]: out.append({'w': W, 'h': H, 'p': list(key), 's': sets[key]})
            else:
                seen = set()
                while len(seen) < cnt:
                    sol = tile(W, H, k, rng, limit=300000 if k < 12 else 3000000)
                    if not sol: continue
                    key = tuple(sorted(p for p, *_ in sol))
                    if key in seen: continue
                    seen.add(key); out.append({'w': W, 'h': H, 'p': list(key), 's': sol})
        data[lv] = out
    return data

def check(data):
    bad = []
    for lv, ps in data.items():
        if len(ps) != 20: bad.append(f'{lv}: 문제 {len(ps)}개')
        for i, P in enumerate(ps, 1):
            cov = set()
            if sorted(p for p, *_ in P['s']) != P['p'] or len(set(P['p'])) != len(P['p']): bad.append(f'{lv} {i}: 조각 묶음'); continue
            for p, r, f, ox, oy in P['s']:
                cs = dict(((r2, f2), c) for r2, f2, c in OR[p]).get((r, f))
                if cs is None: bad.append(f'{lv} {i}: 방향'); break
                cells = {(ox + x, oy + y) for x, y in cs}
                if cells & cov or any(not (0 <= x < P['w'] and 0 <= y < P['h']) for x, y in cells): bad.append(f'{lv} {i}: 겹침·밖'); break
                cov |= cells
            if len(cov) != P['w'] * P['h']: bad.append(f'{lv} {i}: 빈틈')
    return bad

if __name__ == '__main__':
    out = HERE / 'data' / 'pento.json'
    data = gen(); bad = check(data)
    if sys.argv[1:2] == ['check']:
        if not bad and json.loads(out.read_text()) != json.loads(json.dumps(data)): bad.append('data/pento.json이 생성기와 다름 — python3 gen_pento.py로 다시 만드세요')
        print('\n'.join(bad) or '펜토미노 점검 통과'); sys.exit(1 if bad else 0)
    if bad: print('\n'.join(bad)); sys.exit(1)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    print('펜토미노', {k: len(v) for k, v in data.items()}, '문제를 만들고 점검했어요')
    for k, v in data.items(): print(' ', k, [f"{P['w']}x{P['h']}:" + ''.join(P['p']) for P in v])
