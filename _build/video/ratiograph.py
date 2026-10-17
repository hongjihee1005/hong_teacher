"""띠그래프·원그래프 부품 — 6학년 1학기 5단원

    items = [("축구", 40, ORANGE), ("피구", 25, BLUE), …]       # (항목, 백분율, 색) — 합계 100
    bd = band(items, width=10, height=1.0, center=(0, 1, 0))     # 띠: bd.segs[k], bd.labs[k]
    sc = band_scale(bd, step=10)                                  # 띠 위 0~100 % 눈금
    pc = pie(items, r=1.8, center=(0, -1, 0))                     # 원: 12시부터 시계 방향, pc.segs[k], pc.labs[k]
    ck = pie_ticks(pc, step=5)                                    # 원 둘레 눈금(5 %마다, 10 %마다 길게)
"""
import numpy as np
from manim import DOWN, PI, TAU, UP, Line, Rectangle, Sector, VGroup

from series_style import INK, M, T


def band(items, width=10.0, height=1.0, center=(0, 0, 0), size=26, show_pct=True):
    c = np.array(center, float)
    x = c[0] - width / 2
    segs, labs = VGroup(), VGroup()
    for name, p, col in items:
        w = width * p / 100
        r = Rectangle(width=w, height=height, fill_color=col, fill_opacity=0.75, stroke_color=INK, stroke_width=3)
        r.move_to([x + w / 2, c[1], 0])
        segs.add(r)
        txt = f"{name}\n{p} %" if show_pct else name
        t = M(txt, size)
        if t.width > w * 0.95:
            t.scale_to_fit_width(w * 0.92)
        labs.add(t.move_to(r.get_center()))
        x += w
    g = VGroup(segs, labs)
    g.segs, g.labs, g.width_, g.height_, g.c = segs, labs, width, height, c
    return g


def band_scale(bd, step=10, size=20):
    c, W, H = bd.c, bd.width_, bd.height_
    x0 = c[0] - W / 2
    y = c[1] + H / 2
    g = VGroup()
    for v in range(0, 101, step):
        x = x0 + W * v / 100
        g.add(Line([x, y, 0], [x, y + (0.18 if v % 50 else 0.26), 0], color=INK, stroke_width=2))
        if v % (step * 2) == 0 or step >= 20:
            g.add(T(str(v), size).move_to([x, y + 0.42, 0]))
    g.add(T("(%)", size).move_to([x0 + W + 0.45, y + 0.42, 0]))
    return g


def pie(items, r=1.8, center=(0, 0, 0), size=26, show_pct=True):
    c = np.array(center, float)
    segs, labs = VGroup(), VGroup()
    a = PI / 2
    for name, p, col in items:
        ang = TAU * p / 100
        s = Sector(radius=r, start_angle=a, angle=-ang, fill_color=col, fill_opacity=0.75, stroke_color=INK, stroke_width=3)
        s.move_arc_center_to(c)
        segs.add(s)
        mid = a - ang / 2
        rr = r * (0.6 if p >= 12 else 0.72)
        txt = f"{name}\n{p} %" if show_pct else name
        t = M(txt, size if p >= 12 else size - 4)
        labs.add(t.move_to(c + rr * np.array([np.cos(mid), np.sin(mid), 0])))
        a -= ang
    g = VGroup(segs, labs)
    g.segs, g.labs, g.r, g.c = segs, labs, r, c
    return g


def pie_ticks(pc, step=5):
    g = VGroup()
    for v in range(0, 100, step):
        a = PI / 2 - TAU * v / 100
        d = np.array([np.cos(a), np.sin(a), 0])
        L = 0.22 if v % 10 == 0 else 0.12
        g.add(Line(pc.c + d * pc.r, pc.c + d * (pc.r + L), color=INK, stroke_width=2))
    return g
