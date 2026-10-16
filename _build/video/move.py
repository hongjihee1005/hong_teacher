"""평면도형의 이동(4학년 1학기 4단원) 부품 — 모눈판, 방향이 보이는 도형

    gd = grid(cols=14, rows=7, s=0.6, center=[0, 0, 0])
    sh = shape_on(gd, col, row)        # 모눈 칸 (col, row)에 왼쪽 아래를 맞춘 도형(깃발 모양, 위쪽에 점)
    gd.pt(col, row)                    # 모눈 꼭짓점 좌표
"""
import numpy as np
from manim import Dot, Line, Polygon, VGroup

from series_style import BLUE, INK, ORANGE, SOFT

FLAG = [(0, 0), (1, 0), (1, 2), (3, 2), (3, 3), (0, 3)]   # ㄱ자를 뒤집은 모양(위·아래·왼·오른쪽이 모두 다름)


def grid(cols=14, rows=7, s=0.6, center=(0, 0, 0), color="#C9C2B4"):
    c = np.array(center, float)
    x0 = c[0] - cols * s / 2
    y0 = c[1] - rows * s / 2
    g = VGroup()
    for i in range(cols + 1):
        g.add(Line([x0 + i * s, y0, 0], [x0 + i * s, y0 + rows * s, 0], color=color, stroke_width=2))
    for j in range(rows + 1):
        g.add(Line([x0, y0 + j * s, 0], [x0 + cols * s, y0 + j * s, 0], color=color, stroke_width=2))
    g.s, g.x0, g.y0, g.cols, g.rows = s, x0, y0, cols, rows
    g.pt = lambda i, j: np.array([x0 + i * s, y0 + j * s, 0.0])
    return g


def shape_on(gd, col, row, pts=FLAG, color=BLUE, mark=True):
    P = [gd.pt(col + x, row + y) for x, y in pts]
    poly = Polygon(*P, fill_color=color, fill_opacity=0.55, stroke_color=INK, stroke_width=4)
    g = VGroup(poly)
    if mark:   # 위쪽에 표시 점(방향을 보기 쉽게)
        top = gd.pt(col + 1.5, row + 2.5)
        g.add(Dot(top, radius=0.11, color=ORANGE))
    return g
