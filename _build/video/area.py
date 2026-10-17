"""넓이(5학년 1학기 6단원) 부품 — 모눈, 단위넓이 칸, 길이 표시

    gr = grid(cols, rows, s=0.5, center)        # 모눈(옅은 선)
    cells = unit_cells(cols, rows, s, center)   # 1 cm² 칸들(칠할 수 있게)
    dim(a, b, "5 cm", side=DOWN)                # 변 ab 옆 길이 글자
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Line, Square, VGroup

from series_style import BLUE, INK, ORANGE, PAPER, SOFT, T

GRID = "#CFC8BA"


def grid(cols, rows, s=0.5, center=(0, 0, 0), color=GRID, width=2):
    c = np.array(center, float)
    x0, y0 = c[0] - cols * s / 2, c[1] - rows * s / 2
    g = VGroup()
    for i in range(cols + 1):
        g.add(Line([x0 + i * s, y0, 0], [x0 + i * s, y0 + rows * s, 0], color=color, stroke_width=width))
    for j in range(rows + 1):
        g.add(Line([x0, y0 + j * s, 0], [x0 + cols * s, y0 + j * s, 0], color=color, stroke_width=width))
    return g


def gpt(cols, rows, s, center, i, j):
    """모눈 왼쪽 아래에서 i칸 오른쪽, j칸 위인 점"""
    c = np.array(center, float)
    return np.array([c[0] - cols * s / 2 + i * s, c[1] - rows * s / 2 + j * s, 0])


def unit_cells(cols, rows, s=0.5, center=(0, 0, 0), color=ORANGE, op=0.75):
    """왼쪽 아래부터 가로줄 차례로"""
    g = VGroup()
    for j in range(rows):
        for i in range(cols):
            p = gpt(cols, rows, s, center, i + 0.5, j + 0.5)
            g.add(Square(side_length=s, fill_color=color, fill_opacity=op, stroke_color=INK, stroke_width=2).move_to(p))
    return g


def dim(a, b, text, side=DOWN, size=32, color=INK, buff=0.25):
    a, b = np.array(a, float), np.array(b, float)
    t = T(text, size, color)
    t.move_to((a + b) / 2 + np.array(side) * buff + np.array(side) * t.height / 2 * (1 if side[1] else 0) + np.array(side) * t.width / 2 * (1 if side[0] else 0))
    return t
