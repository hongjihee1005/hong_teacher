# -*- coding: utf-8 -*-
"""기본형 활동지가 그대로인지 점검: 지금 파일과 git의 기준(기본 origin/main)을 견줌(content.hpf의 날짜는 뺌)
    python3 _build/sheets_hard/basic_same.py [경로 글자] [기준 커밋]"""
import glob, io, subprocess, sys, zipfile
key = sys.argv[1] if len(sys.argv) > 1 else ''
ref = sys.argv[2] if len(sys.argv) > 2 else 'origin/main'
bad = 0
for f in sorted(glob.glob('grade*/math/*/sheets/*기본형.hwpx')):
    if key not in f: continue
    old = zipfile.ZipFile(io.BytesIO(subprocess.check_output(['git', 'show', '%s:%s' % (ref, f)])))
    new = zipfile.ZipFile(f)
    if set(old.namelist()) != set(new.namelist()): print('파일 목록 다름', f); bad += 1; continue
    d = [n for n in old.namelist() if n != 'Contents/content.hpf' and old.read(n) != new.read(n)]
    if d: print('바뀜', f, d); bad += 1
print('기본형 점검: 바뀐 파일 %d개' % bad)
sys.exit(1 if bad else 0)
