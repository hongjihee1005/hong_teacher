import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lessons import L as L1
from lessons2 import L as L2
from lessons3 import L as L3
from lessons4 import L as L4
from lessons5 import L as L5
from lessons6 import L as L6
L=L1+L2+L3+L4+L5+L6
eng = open(os.path.join(os.path.dirname(__file__), 'engine.html'), encoding='utf-8').read()
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
for l in L:
    cfg = {k: v for k, v in l.items() if k not in ('file', 'card')}
    js = json.dumps(cfg, ensure_ascii=False).replace('</', '<\\/')
    html = eng.replace('__TITLE__', l['title']).replace('__CONFIG__', js)
    open(os.path.join(out, l['file']), 'w', encoding='utf-8').write(html)
    print(l['file'], len(html))
