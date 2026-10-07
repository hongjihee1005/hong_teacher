"""빈칸 셈(□)·복면산(글자) 풀이기 — 답이 몇 개인지 셈"""
import re
from itertools import product, permutations

def _ok_lead(expr):   # 두 자리 이상 수가 0으로 시작하면 안 됨
    return not re.search(r'(?<![\d])0\d', expr)

def blank_solutions(pat):
    """'□8+4□=75' → □에 들어갈 숫자 차례 목록들"""
    n = pat.count('□'); out = []
    for ds in product('0123456789', repeat=n):
        it = iter(ds); s = re.sub('□', lambda m: next(it), pat)
        if not _ok_lead(s): continue
        l, r = s.split('=')
        if eval(l.replace('×', '*').replace('÷', '/')) == eval(r.replace('×', '*')): out.append(tuple(int(d) for d in ds))
    return out

def letter_solutions(pat, distinct=True):
    """'ABC×3=BBB' → {글자: 숫자} 목록(다른 글자는 다른 숫자)"""
    L = sorted(set(re.findall('[A-Z]', pat))); out = []
    for ds in (permutations('0123456789', len(L)) if distinct else product('0123456789', repeat=len(L))):
        m = dict(zip(L, ds)); s = ''.join(m.get(ch, ch) for ch in pat)
        if not _ok_lead(s): continue
        l, r = s.split('=')
        if eval(l.replace('×', '*')) == eval(r.replace('×', '*')): out.append({k: int(v) for k, v in m.items()})
    return out
