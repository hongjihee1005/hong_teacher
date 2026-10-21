# -*- coding: utf-8 -*-
"""표지 PDF의 쪽 크기를 정확히 맞춤 — 크로미움은 PDF 쪽 크기를 반올림해서(0.2mm쯤 틀림) 2mm 크게 그린 뒤 여기서 잘라 냄.
    python3 fixbox.py 파일.pdf 가로mm 세로mm   (MediaBox·CropBox·BleedBox = 정확한 크기, TrimBox = 재단 여백 3mm 안쪽)"""
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject
PT = 72 / 25.4
p, W, H = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
r = PdfReader(p); w = PdfWriter()
for pg in r.pages:
    top = float(pg.mediabox.top)
    box = RectangleObject([0, top - H * PT, W * PT, top])
    pg.mediabox = box; pg.cropbox = box; pg.bleedbox = box
    pg.trimbox = RectangleObject([3 * PT, top - (H - 3) * PT, (W - 3) * PT, top - 3 * PT])
    w.add_page(pg)
w.write(p)
