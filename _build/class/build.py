#!/usr/bin/env python3
"""우리 반 교실(class/index.html)을 만듭니다: python3 _build/class/build.py"""
import pathlib,sys
H=pathlib.Path(__file__).resolve().parent; R=H.parents[1]
sys.path.insert(0,str(R/'_build/theme')); import apply_theme as T
s=(H/'shell.html').read_text(encoding='utf-8')
# 메뉴 쪽과 같은 틀(2026-10-29): 위 머리 막대 · 남색 제목 띠 · 남색 꼬리말 — 모양은 theme.css의 '정돈된 사이트 틀'에서 그대로 가져옴
css=(R/'_build/theme/theme.css').read_text(encoding='utf-8')
def cut(a,b): i=css.index(a); return css[i:css.index(b,i)]
site=cut('/* ───────── 정돈된 사이트 틀','/* 묶음 제목 */')+cut('/* 남색 꼬리말 */','/* ───────── 판 안의 항목')
s=s.replace('/*SITECSS*/',site,1).replace('<!--HJTOP-->',T.topbar('class/index.html'),1).replace('<!--HJFB-->',T.footbrand(),1)
TOPJS=(R/'_build/theme/theme.js').read_text(encoding='utf-8'); TOPJS=TOPJS[TOPJS.index('(function(){/* 위 머리 막대'):]; TOPJS=TOPJS[:TOPJS.index('})();')+5]
s=s.replace('/*TOPJS*/',TOPJS,1)
s=s.replace('/*QRLIB*/',(H/'qr.min.js').read_text(encoding='utf-8')).replace('/*APPJS*/',(H/'app.js').read_text(encoding='utf-8'))
(R/'class').mkdir(exist_ok=True); (R/'class'/'index.html').write_text(s,encoding='utf-8'); print('class/index.html',len(s.encode()),'bytes')
import subprocess; subprocess.run([sys.executable,str(R/'_build/theme/apply_content_theme.py'),str(R/'class'/'index.html')],check=True)  # 메인과 같은 글꼴·단색 아이콘·색 덮개
