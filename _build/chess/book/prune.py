# -*- coding: utf-8 -*-
"""HWPX에서 본문이 쓰지 않는 그림(BinData)을 뺌 — 권으로 나눈 교재에 한 권짜리 책의 그림이 모두 남아 있어서(2026-10-21)
    python3 _build/chess/book/prune.py 파일.hwpx [...]   (그 자리에서 고침)"""
import re, sys, os, zipfile


def prune(p):
    Z = zipfile.ZipFile(p)
    used = set()
    for n in Z.namelist():
        if n.startswith('Contents/') and n.endswith('.xml') and 'content.hpf' not in n:
            used |= set(re.findall(r'binaryItemIDRef="([^"]+)"', Z.read(n).decode('utf-8')))
    hpf = Z.read('Contents/content.hpf').decode('utf-8')
    drop = {}
    for m in re.finditer(r'<opf:item id="([^"]+)" href="(BinData/[^"]+)"[^>]*/>', hpf):
        if m.group(1) not in used:
            drop[m.group(2)] = m.group(0)
    for x in drop.values():
        hpf = hpf.replace(x, '')
    tmp = p + '.tmp'
    with zipfile.ZipFile(tmp, 'w') as z:
        for zi in Z.infolist():
            if zi.filename in drop:
                continue
            data = hpf.encode('utf-8') if zi.filename == 'Contents/content.hpf' else Z.read(zi.filename)
            z.writestr(zipfile.ZipInfo(zi.filename, zi.date_time), data, compress_type=zi.compress_type)
    a = os.path.getsize(p)
    os.replace(tmp, p)
    print('%s: 그림 %d개 뺌, %.1fMB → %.1fMB' % (os.path.basename(p), len(drop), a / 1e6, os.path.getsize(p) / 1e6))


if __name__ == '__main__':
    for p in sys.argv[1:]:
        prune(p)
