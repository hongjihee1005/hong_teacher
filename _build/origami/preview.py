"""모든 단계를 한 장에 그려 보기: python3 preview.py g1 → /tmp 밖 스크래치에 html"""
import sys, json, importlib, pathlib
out = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'preview.html')
ms = []
for g in sys.argv[1].split(','):
    ms += importlib.import_module('models_' + g).MODELS
from geo import finalize; finalize(ms)
eng = open('engine.js', encoding='utf-8').read()
css = open('svg.css', encoding='utf-8').read()
out.write_text('<!doctype html><meta charset=utf-8><style>' + css + 'body{font:13px sans-serif;margin:8px}.m{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.s{width:200px;border:1px solid #ccc}.s p{margin:2px;height:48px;overflow:hidden}</style><div id=r></div><script>' + eng +
              'var M=' + json.dumps(ms, ensure_ascii=False) + ';var h="";M.forEach(function(m){h+="<h3>"+m.name+"</h3><div class=m>";m.steps.forEach(function(s,i){h+="<div class=s>"+OG.render(s.d,m.color,s.z)+"<p>"+(i+1)+". "+s.t+"</p></div>"});h+="</div>"});document.getElementById("r").innerHTML=h</script>', encoding='utf-8')
print(out)
