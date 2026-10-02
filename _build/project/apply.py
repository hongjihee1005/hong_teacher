#!/usr/bin/env python3
"""3-1 사회 홍지희 버전 11~21차시에 '우리 동네를 더 살기 좋은 곳으로' 프로젝트 판(soc31.js)을 넣습니다. 여러 번 실행해도 안전합니다.
   python3 _build/project/apply.py   (그다음 apply_content_theme.py)"""
import pathlib,re
R=pathlib.Path(__file__).resolve().parents[2]; JS=(pathlib.Path(__file__).with_name('soc31.js')).read_text(encoding='utf-8')
for n in ['11','12','1314','15','16','1718','19','2021']:
    f=R/f'grade3/social/sem1-hong/u1-l{n}.html'; s=f.read_text(encoding='utf-8')
    s=re.sub(r'<!--hj-proj-->.*?<!--/hj-proj-->','',s,flags=re.S)
    s=re.sub(r'<html([^>]*?) data-proj-lesson="[^"]*"',r'<html\1',s,count=1)
    s=re.sub(r'<html',f'<html data-proj-lesson="{n}"',s,count=1)
    j=s.rfind('</body>'); s=s[:j]+f'<!--hj-proj--><script>{JS}</script><!--/hj-proj-->'+s[j:]
    f.write_text(s,encoding='utf-8'); print(f.name)
