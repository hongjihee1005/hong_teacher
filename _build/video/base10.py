"""수모형(백 모형·십 모형·일 모형) — 시리즈 여러 화에서 같이 씀

    rod = ten_rod()                 # 십 모형 (일 모형 10칸이 세로로 붙은 막대)
    cube = unit_cube()              # 일 모형
    flat = hundred_flat()           # 백 모형 (십 모형 10개)
    blocks = number_blocks(42)      # 42 → VGroup(백 묶음, 십 묶음, 일 묶음)
    anim, cubes = break_ten(rod, grid_points(c, 10, cols=5))   # 십 모형 1개 → 일 모형 10개
    p = plate("친구 1")             # 나누어 담는 접시(묶음)

십 모형의 칸 하나하나가 곧 일 모형과 같은 네모라서, break_ten()은
칸을 떼어 내 주황색으로 바꾸기만 하면 됩니다(같은 물체가 이어지므로 화면이 자연스러움).
"""
import numpy as np
from manim import DOWN, RIGHT, UP, AnimationGroup, LaggedStart, RoundedRectangle, Square, VGroup

from series_style import (BLUE, BLUE_DARK, ORANGE, ORANGE_DARK, PLATE, SOFT, SMALL, T)

UNIT = 0.26   # 일 모형 한 변 (화면 단위, 화면 높이 = 8)


def style_one(m):
    m.set_fill(ORANGE, opacity=1).set_stroke(ORANGE_DARK, width=2.5)
    return m


def style_ten(m):
    m.set_fill(BLUE, opacity=1).set_stroke(BLUE_DARK, width=2.5)
    return m


def unit_cube(size=UNIT):
    sq = Square(side_length=size)
    style_one(sq)
    sq.kind = "one"
    return sq


def ten_rod(size=UNIT):
    cells = [style_ten(Square(side_length=size)) for _ in range(10)]
    rod = VGroup(*cells).arrange(DOWN, buff=0)
    rod.kind = "ten"
    return rod


def hundred_flat(size=UNIT):
    flat = VGroup(*[ten_rod(size) for _ in range(10)]).arrange(RIGHT, buff=0)
    flat.kind = "hundred"
    return flat


def grid_points(center, n, cols, step=UNIT * 1.4, order="row"):
    """center를 가운데로 n개 자리를 cols칸씩 줄지어 돌려줌(위 줄부터, 왼쪽부터)"""
    center = np.array(center, dtype=float)
    rows = (n + cols - 1) // cols
    pts = []
    for i in range(n):
        r, c = divmod(i, cols)
        x = (c - (cols - 1) / 2) * step
        y = ((rows - 1) / 2 - r) * step
        pts.append(center + np.array([x, y, 0]))
    return pts


def number_blocks(n, size=UNIT, gap=None, ones_cols=2):
    """n을 백·십·일 모형으로. 반환: VGroup(백들, 십들, 일들) — 비어 있는 묶음도 자리를 둠"""
    gap = gap if gap is not None else size * 0.7
    h, t, u = n // 100, (n // 10) % 10, n % 10
    hs = VGroup(*[hundred_flat(size) for _ in range(h)]).arrange(RIGHT, buff=gap) if h else VGroup()
    ts = VGroup(*[ten_rod(size) for _ in range(t)]).arrange(RIGHT, buff=gap) if t else VGroup()
    us = VGroup(*[unit_cube(size) for _ in range(u)])
    if u:
        for cube, p in zip(us, grid_points([0, 0, 0], u, ones_cols, size * 1.35)):
            cube.move_to(p)
    parts = [m for m in (hs, ts, us) if len(m)]
    VGroup(*parts).arrange(RIGHT, buff=gap * 2, aligned_edge=DOWN)
    return VGroup(hs, ts, us)


def break_ten(rod, targets, run_time=2.0, lag=0.12):
    """십 모형 1개 → 일 모형 10개. 반환: (애니메이션, 일 모형 10개 VGroup)
    targets: 10개 자리(grid_points 등)"""
    cells = list(rod.submobjects)
    anims = []
    for cell, p in zip(cells, targets):
        cell.kind = "one"
        anims.append(cell.animate.move_to(p).set_fill(ORANGE, 1).set_stroke(ORANGE_DARK, 2.5))
    cubes = VGroup(*cells)
    return LaggedStart(*anims, lag_ratio=lag, run_time=run_time), cubes


def plate(label="", width=2.5, height=3.3, size=SMALL):
    """나누어 담는 접시(묶음). 이름표는 위에. 반환 VGroup(접시, 이름표)"""
    box = RoundedRectangle(corner_radius=0.35, width=width, height=height,
                           fill_color=PLATE, fill_opacity=1, stroke_color=SOFT, stroke_width=3)
    lab = T(label, size) if label else VGroup()
    if label:
        lab.next_to(box, UP, buff=0.18)
    return VGroup(box, lab)


def plate_slots(p, size=UNIT, ones_cols=2):
    """접시 안 자리: (십 모형 자리 목록, 일 모형 자리 목록)"""
    box = p[0]
    c = box.get_center()
    tens = [c + np.array([-box.width * 0.24 + k * size * 1.6, 0, 0]) for k in range(3)]
    ones = grid_points(c + np.array([box.width * 0.2, 0, 0]), 10, ones_cols, size * 1.38)
    # 위에서부터 채우도록: 10칸 중 앞쪽부터 쓰되, 가운데로 모이게 4개면 2×2
    return tens, ones


def ones_slots_centered(p, n, size=UNIT, cols=2):
    box = p[0]
    c = box.get_center() + np.array([box.width * 0.2, 0, 0])
    return grid_points(c, n, cols, size * 1.38)
