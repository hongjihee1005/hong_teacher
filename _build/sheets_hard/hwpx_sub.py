# -*- coding: utf-8 -*-
"""3학년 수학 활동지(hwpx, 생성 스크립트 없음)의 글을 바꾸는 도구 — 도전형 다시 쓰기(2026-10-30)

    python3 hwpx_sub.py dump  파일.hwpx            # 글 조각(<hp:t>)을 번호와 함께 보기
    python3 hwpx_sub.py apply 파일.hwpx 바꿀.json  # [[번호, 옛 글, 새 글], ...] 차례로 바꿈(옛 글이 다르면 멈춤)

글 조각 하나를 통째로 바꿉니다(모양·표·칸은 그대로). 새 글은 옛 글과 비슷한 길이로 쓰세요(칸 폭이 정해져 있음).
"""
import json, re, sys, zipfile, shutil, os, tempfile
from xml.sax.saxutils import escape, unescape

T = re.compile(r'(<hp:t>)([^<]*)(</hp:t>)')

def secs(z):
    return sorted(n for n in z.namelist() if re.match(r'Contents/section\d+\.xml$', n))

def dump(p):
    z = zipfile.ZipFile(p); k = 0
    for n in secs(z):
        for m in T.finditer(z.read(n).decode('utf-8')):
            print(k, unescape(m.group(2))); k += 1

def apply(p, jp):
    subs = {int(i): (o, nw) for i, o, nw in json.load(open(jp, encoding='utf-8'))}
    z = zipfile.ZipFile(p); data = {n: z.read(n) for n in z.namelist()}; infos = z.infolist(); z.close()
    k = [0]; done = set()
    def rep(m):
        i = k[0]; k[0] += 1
        if i in subs:
            o, nw = subs[i]
            if unescape(m.group(2)) != o:
                sys.exit('번호 %d의 글이 다릅니다: %r (예상 %r)' % (i, unescape(m.group(2)), o))
            done.add(i); return m.group(1) + escape(nw) + m.group(3)
        return m.group(0)
    for n in secs(zipfile.ZipFile(p)):
        data[n] = T.sub(rep, data[n].decode('utf-8')).encode('utf-8')
    miss = set(subs) - done
    if miss: sys.exit('찾지 못한 번호: %s' % sorted(miss))
    tmp = tempfile.mktemp(suffix='.hwpx')
    with zipfile.ZipFile(tmp, 'w') as o:
        for info in infos:  # mimetype은 처음·압축 없이(원래 방식 그대로)
            o.writestr(info, data[info.filename], compress_type=info.compress_type)
    shutil.move(tmp, p); print('%d곳 바꿈: %s' % (len(done), p))

if __name__ == '__main__':
    {'dump': lambda: dump(sys.argv[2]), 'apply': lambda: apply(sys.argv[2], sys.argv[3])}[sys.argv[1]]()
