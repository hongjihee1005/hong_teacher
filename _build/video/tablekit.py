"""표 부품 — 첫 열(머리)과 첫 행을 색칠한 격자 표

    frame, cells = table([["머리", "1", "2"], ["어른", "6", "12"]], center=(0, 1), cw=1.4, hw=3.0, h=0.66, size=30)
    cells[r][c]   # 칸 글자(M 마크업)
"""
from manim import Rectangle, VGroup

from series_style import INK, PAPER, M

HEAD = "#EFE6C8"


def table(rows, center=(0, 0), cw=1.4, hw=3.0, h=0.66, size=30, head_row=True):
    nr, nc = len(rows), len(rows[0])
    W = hw + cw * (nc - 1)
    x0 = center[0] - W / 2
    y0 = center[1] + nr * h / 2
    frame = VGroup()
    cells = []
    for r in range(nr):
        line = []
        for c in range(nc):
            w = hw if c == 0 else cw
            x = x0 if c == 0 else x0 + hw + cw * (c - 1)
            head = c == 0 or (head_row and r == 0)
            rect = Rectangle(width=w, height=h, stroke_color=INK, stroke_width=2,
                             fill_color=HEAD if head else PAPER, fill_opacity=1).move_to([x + w / 2, y0 - h * (r + 0.5), 0])
            frame.add(rect)
            line.append(M(rows[r][c], size).move_to(rect.get_center()))
        cells.append(line)
    return frame, cells
