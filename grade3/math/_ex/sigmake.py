#!/usr/bin/env python3
"""데이터 파일(ex_/help_/ans_*.py)에 칸 이름표 SIG를 적음 (2026-10-04)

  python3 sigmake.py            -> SIG가 없는 데이터 파일에만 지금 앱의 칸 이름표를 적음
  python3 sigmake.py 파일.py    -> 그 파일의 SIG를 지금 앱 기준으로 다시 적음(내용을 새 앱 차례에 맞게 고친 뒤)
데이터의 차례와 앱의 칸 차례가 같을 때(skel로 틀을 만들고 내용을 막 쓴 직후) 돌리세요.
자동 보완(_build/auto/run_all.py)이 SIG가 없는 새 데이터 파일에는 이것을 먼저 돌려 줍니다.
"""
import os, sys, glob, json, re, importlib
HERE = os.path.dirname(os.path.abspath(__file__)); MATH = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from sig import wyr
from help import sites
import apply as AP

MARK = '\n# 칸 이름표(sigmake.py) — 앱의 차례가 바뀌어도 이 이름표로 원래 칸을 찾아갑니다. 손으로 고치지 마세요.\nSIG = '


def sig_text(name, s):
    if name.startswith('ex_'): return json.dumps(AP.sigs(s, AP.calls(s)), ensure_ascii=False)
    W, Y, R = sites(s); g = wyr(s, W, Y, R)
    return '{' + ', '.join(f'"{k}": ' + json.dumps(g[k], ensure_ascii=False) for k in 'WYR') + '}'


def write(path):
    name = os.path.basename(path); t = open(path, encoding='utf-8').read()
    t = t.split(MARK)[0].rstrip('\n') + '\n'
    M = importlib.import_module(name[:-3])
    s = open(os.path.join(MATH, M.FILE), encoding='utf-8').read()
    open(path, 'w', encoding='utf-8').write(t + MARK + sig_text(name, s) + '\n')


if __name__ == '__main__':
    fs = sys.argv[1:] or [f for f in sorted(glob.glob(os.path.join(HERE, '*.py'))) if re.match(r'(ex|help|ans)_sem', os.path.basename(f)) and MARK not in open(f, encoding='utf-8').read()]
    for f in fs: write(os.path.abspath(f)); print('SIG', os.path.basename(f))
