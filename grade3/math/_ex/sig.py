"""칸 이름표(서명)로 짝 찾기 (2026-10-04)

앱을 새로 빌드해 덮으면서 차시·칸이 늘거나 순서가 바뀌어도, 예시·도움·답이 원래 칸을 찾아가게 합니다.
데이터 파일(ex_/help_/ans_*.py)의 SIG에는 '그 내용을 쓸 때의 칸 이름표'가 차례대로 들어 있습니다.
이름표 = [차시 번호, 단계 안내(inst), 칸 이름(사고 전략 칸 제목들·글쓰기 질문 q들·탐구 칸 설정)]

짝 찾기 순서: ① 세 가지 모두 같음 → ② 안내와 칸 이름이 같음(차시 번호가 바뀐 경우) → ③ 차시 번호와 칸 이름이 같음(안내 글을 고친 경우)
어느 것과도 짝이 없는 지금 앱의 칸은 '내용이 필요한 새 칸'(todo)으로 알립니다.
"""
import re

QRE = re.compile(r'\bq: *"((?:[^"\\]|\\.)*)"')


def ctx(s, pos):
    """pos 앞에서 가장 가까운 차시 번호와 단계 안내"""
    b = s[:pos]
    no = list(re.finditer(r'\bno: *(\d+), *title: *"', b))
    inst = list(re.finditer(r'\binst: *"((?:[^"\\]|\\.)*)"', b))
    return [int(no[-1].group(1)) if no else 0, inst[-1].group(1) if inst else '']


def key_of_obj(text):
    """탐구 칸 설정 { q, ph, … }에서 help·ans를 뺀 글자(공백 정리)"""
    t = re.sub(r', (help|ans|ex): (\[(?:"(?:[^"\\]|\\.)*"(?:, )?)*\]|"(?:[^"\\]|\\.)*")', '', text)
    return re.sub(r'\s+', ' ', t)


def remap(old, cur):
    """old·cur: 이름표 목록. 돌려줌: {지금 칸 차례: 데이터 차례}"""
    out, used = {}, set()
    for f in (lambda g: (g[0], g[1], _t(g[2])), lambda g: (g[1], _t(g[2])), lambda g: (g[0], _t(g[2]))):
        pool = {}
        for i, g in enumerate(old):
            if i not in used: pool.setdefault(f(g), []).append(i)
        for j, g in enumerate(cur):
            if j in out: continue
            q = pool.get(f(g))
            if q: i = q.pop(0); out[j] = i; used.add(i)
    return out


def _t(x):
    return tuple(x) if isinstance(x, list) else x


def wyr(s, W, Y, R):
    """help.py의 sites() 결과 → 이름표 {'W': [...], 'Y': [...], 'R': [...]}"""
    out = {'W': [], 'Y': [], 'R': []}
    for objs in W:
        p = objs[0][0] if objs else 0
        out['W'].append(ctx(s, p) + [[(QRE.search(s[a:k + 1]) or [None, ''])[1] for a, k in objs]])
    for name, xs in (('Y', Y), ('R', R)):
        for a, k in xs: out[name].append(ctx(s, a) + [key_of_obj(s[a:k + 1])])
    return out


def align(s, W, Y, R, M, blank, todo, label):
    """데이터 M(W·Y·R, SIG)을 지금 앱의 칸 차례에 맞춤. 짝이 없는 칸은 blank로 채우고 todo에 적음"""
    cur = wyr(s, W, Y, R)
    S = getattr(M, 'SIG', None)
    if S is None:
        assert [len(x) for x in W] == [len(x) for x in M.W] and len(Y) == len(M.Y) and len(R) == len(M.R), (M.FILE, '칸 수가 앱과 다름(SIG 없음)')
        return M.W, M.Y, M.R
    res = []
    # 글쓰기(W)는 칸 하나하나로 펼쳐 짝을 찾음 — 한 단계에 질문이 더해지거나 빠져도 나머지 칸은 그대로 찾아감
    flat = lambda sg: [[g[0], g[1], q] for g in sg for q in g[2]]
    old_f = flat(S['W']); data_f = [x for v in M.W for x in v]; cur_f = flat(cur['W'])
    mp = remap(old_f, cur_f); al = []; j = 0
    for objs, g in zip(W, cur['W']):
        row = []
        for q in g[2]:
            if j in mp: row.append(data_f[mp[j]])
            else:
                row.append(blank); todo.append(f'{label} {M.FILE} W 차시 {g[0]} | {g[1][:60]} | {q}'[:300])
            j += 1
        al.append(row)
    res.append(al)
    for name, data in (('Y', M.Y), ('R', M.R)):
        mp = remap(S[name], cur[name]); al = []
        for j, g in enumerate(cur[name]):
            if j in mp: al.append(data[mp[j]])
            else:
                al.append(blank); todo.append(f'{label} {M.FILE} {name} 차시 {g[0]} | {g[1][:60]} | {g[2]}'[:300])
        res.append(al)
    return res
