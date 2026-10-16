"""소수(4학년 2학기 3단원) 부품 — 100칸 모눈, 소수 자리 표

    g = grid100(k, size=3.0)       # 1을 100칸으로 나눈 모눈, 앞 k칸 칠함(위 줄부터 왼쪽→오른쪽)
"""
from manim import DOWN, RIGHT, Rectangle, Square, VGroup

from series_style import BLUE, INK, ORANGE, PAPER, SOFT, T

GREEN2 = "#1F8A70"
DCOL = {0: INK, -1: ORANGE, -2: BLUE, -3: GREEN2}   # 일의 자리, 소수 첫째·둘째·셋째


def grid100(k=0, size=3.0, color=ORANGE, cols=10):
    s = size / cols
    cells = VGroup(*[Square(side_length=s, fill_color=color if i < k else PAPER, fill_opacity=1,
                            stroke_color=SOFT, stroke_width=1.5) for i in range(cols * cols)])
    cells.arrange_in_grid(rows=cols, cols=cols, buff=0)
    frame = Rectangle(width=size, height=size, stroke_color=INK, stroke_width=4).move_to(cells)
    return VGroup(cells, frame)


def dec_markup(s):
    """'1.76' → 자리마다 색칠한 마크업"""
    if "." not in s:
        return f'<span foreground="{INK}">{s}</span>'
    a, b = s.split(".")
    out = f'<span foreground="{INK}">{a}.</span>'
    for i, ch in enumerate(b):
        out += f'<span foreground="{DCOL[-(i + 1)]}">{ch}</span>'
    return out
