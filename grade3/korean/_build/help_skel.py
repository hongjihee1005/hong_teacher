#!/usr/bin/env python3
"""국어 글쓰기 칸별 '💡 도움' 빈 틀: python3 help_skel.py 2 > help_u2.py  (한 줄짜리 칸은 뺌)
   검사: python3 help_skel.py check 2"""
import sys, importlib, json
mods = {1: 'lessons', 2: 'lessons2', 3: 'lessons3', 4: 'lessons4', 5: 'lessons5', 6: 'lessons6'}
def fields(u):
    for l in importlib.import_module(mods[u]).L:
        for st in l['stages']:
            for s in st['steps']:
                if s['t'] == 'write':
                    fs = [f for f in s['fields'] if not f.get('one')]
                    if fs: yield l, s, fs
if sys.argv[1] == 'check':
    u = int(sys.argv[2]); H = importlib.import_module(f'help_u{u}').HELP; bad = 0
    for l, s, fs in fields(u):
        for f in fs:
            v = H.get(l['id'], {}).get(s['id'], {}).get(f['l'])
            if not v or len(v) != 2 or not all(x.strip() for x in v): print('빠짐', l['id'], s['id'], f['l']); bad += 1
    print('문제', bad); sys.exit()
u = int(sys.argv[1]); cur = None
print(f"# {u}단원 글쓰기 칸별 '💡 도움' — 예시 답안이 아니라 쓰는 차례·넣을 것 2줄. (help_skel.py로 만든 틀)\nHELP = {{")
for l, s, fs in fields(u):
    if cur != l['id']:
        if cur: print(' },')
        cur = l['id']; print(f" {l['id']!r}: {{  # {l['title']} | 목표: {l['goal']}")
    print(f"  # [{s['id']}] {s['hd']}" + (f" | 예시 답안: {json.dumps(s['model'], ensure_ascii=False)[:160]}" if s.get('model') else ''))
    print(f"  {s['id']!r}: {{")
    for f in fs: print(f"   # 칸: {f['l']} | 부제: {f.get('s','')} | 안내 글자: {f.get('ph','').replace(chr(10),' / ')}\n   {f['l']!r}: ['', ''],")
    print('  },')
if cur: print(' },')
print('}')
