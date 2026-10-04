import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lessons import L as L1
from lessons2 import L as L2
from lessons3 import L as L3
from lessons4 import L as L4
from lessons5 import L as L5
from lessons6 import L as L6
L=L1+L2+L3+L4+L5+L6
# 글쓰기 칸별 '💡 도움'(help_uN.py) — 차시 id·글쓰기 단계 id·칸 이름으로 찾아 f['help']로 넣음
import glob, importlib
for hf in sorted(glob.glob(os.path.join(os.path.dirname(__file__), 'help_u*.py'))):
    H = importlib.import_module(os.path.basename(hf)[:-3]).HELP
    for l in L:
        for sid, cols in H.get(l['id'], {}).items():
            ws = [s for st in l['stages'] for s in st['steps'] if s['t'] == 'write' and s.get('id') == sid]
            assert len(ws) == 1, (l['id'], sid, len(ws))
            for lab, v in cols.items():
                fs = [f for f in ws[0]['fields'] if f['l'] == lab]
                assert len(fs) == 1 and len(v) == 2 and all(v), (l['id'], sid, lab)
                fs[0]['help'] = v
eng = open(os.path.join(os.path.dirname(__file__), 'engine.html'), encoding='utf-8').read()
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
for l in L:
    cfg = {k: v for k, v in l.items() if k not in ('file', 'card')}
    js = json.dumps(cfg, ensure_ascii=False).replace('</', '<\\/')
    html = eng.replace('__TITLE__', l['title']).replace('__CONFIG__', js)
    open(os.path.join(out, l['file']), 'w', encoding='utf-8').write(html)
    print(l['file'], len(html))
