#!/usr/bin/env python3
"""우리 반 교실(class/index.html)을 만듭니다: python3 _build/class/build.py"""
import pathlib
H=pathlib.Path(__file__).resolve().parent; R=H.parents[1]
s=(H/'shell.html').read_text(encoding='utf-8')
s=s.replace('/*QRLIB*/',(H/'qr.min.js').read_text(encoding='utf-8')).replace('/*APPJS*/',(H/'app.js').read_text(encoding='utf-8'))
(R/'class').mkdir(exist_ok=True); (R/'class'/'index.html').write_text(s,encoding='utf-8'); print('class/index.html',len(s.encode()),'bytes')
import subprocess,sys; subprocess.run([sys.executable,str(R/'_build/theme/apply_content_theme.py'),str(R/'class'/'index.html')],check=True)  # 메인과 같은 글꼴·단색 아이콘·색 덮개
