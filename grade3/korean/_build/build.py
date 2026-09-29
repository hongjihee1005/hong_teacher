import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lessons import L
eng = open(os.path.join(os.path.dirname(__file__), 'engine.html'), encoding='utf-8').read()
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
for l in L:
    cfg = {k: v for k, v in l.items() if k not in ('file', 'card')}
    js = json.dumps(cfg, ensure_ascii=False).replace('</', '<\\/')
    html = eng.replace('__TITLE__', l['title']).replace('__CONFIG__', js)
    open(os.path.join(out, l['file']), 'w', encoding='utf-8').write(html)
    print(l['file'], len(html))
