"""과학 영상 학년별 꾸밈 (선생님 요청 2026-10-25: "과학은 수학과 다른 색으로, 학년별로도 다른 식으로")

수학 영상은 학년·학기마다 단색 바탕만 다릅니다. 과학은 학년마다 '공책 모양'이 다릅니다:
  3학년 「관찰 공책」   연두 바탕 + 모눈,              둥근 이름표,          돋보기,   마인드맵 가운데 원,        굽은 가지
  4학년 「탐구 노트」   청록 바탕 + 공책 줄·빨간 여백선, 꼬리표 이름표,       플라스크, 둥근 네모,                 굽은 가지
  5학년 「실험 기록장」 모래빛 바탕 + 점 격자,          왼쪽 색띠 네모 이름표, 원자,     육각형,                    꺾은 가지
  6학년 「연구 설계도」 청사진 바탕 + 큰·작은 모눈,       이중 테 이름표,      행성,     고리 달린 행성,            곧은 가지
2학기는 같은 꾸밈에 바탕 빛깔만 조금 다름. 내용 그림의 색(빨강 힘·초록 답 등)은 모든 학년이 같음.
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU, Annulus, Arc, Circle, Dot, Ellipse, Line, Polygon,
                   Rectangle, RegularPolygon, RoundedRectangle, VGroup)

STYLES = {
    3: dict(name="관찰 공책", bg={1: "#F2F8E6", 2: "#F6F8E1"}, line="#D7E7C2", accent="#3C7F36", accent2="#7FB069",
            pattern="grid", chip="round", band="round", icon="magnifier", center="circle", branch="curve", leaf="round"),
    4: dict(name="탐구 노트", bg={1: "#E7F4F2", 2: "#E9F2EC"}, line="#BFDCD8", accent="#14707A", accent2="#E07A6A",
            pattern="lines", chip="tag", band="leftbar", icon="flask", center="rounded", branch="curve", leaf="tag"),
    5: dict(name="실험 기록장", bg={1: "#F5F1E4", 2: "#F3EEE6"}, line="#D8CCAE", accent="#8A5A14", accent2="#C99A3A",
            pattern="dots", chip="stripe", band="topline", icon="atom", center="hex", branch="elbow", leaf="square"),
    6: dict(name="연구 설계도", bg={1: "#E4EDF7", 2: "#E7ECF5"}, line="#BFD2EA", accent="#23508F", accent2="#6E93C8",
            pattern="blueprint", chip="double", band="double", icon="planet", center="planet", branch="straight", leaf="double"),
}


def style(grade):
    return STYLES.get(grade or 3, STYLES[3])


# ── 바탕 무늬 ────────────────────────────────────────────────
def background(st):
    p, c = st["pattern"], st["line"]
    W, H = 7.4, 4.2
    g = VGroup()
    if p == "grid":
        for x in np.arange(-7.0, 7.01, 0.5):
            g.add(Line([x, -H, 0], [x, H, 0], stroke_color=c, stroke_width=1.4))
        for y in np.arange(-4.0, 4.01, 0.5):
            g.add(Line([-W, y, 0], [W, y, 0], stroke_color=c, stroke_width=1.4))
    elif p == "lines":
        for y in np.arange(-3.85, 3.6, 0.62):
            g.add(Line([-W, y, 0], [W, y, 0], stroke_color=c, stroke_width=2))
        g.add(Line([-6.55, -H, 0], [-6.55, H, 0], stroke_color=st["accent2"], stroke_width=2.5))
    elif p == "dots":
        for x in np.arange(-6.8, 6.81, 0.68):
            for y in np.arange(-3.74, 3.75, 0.68):
                g.add(Dot([x, y, 0], radius=0.022, color=c))
    elif p == "blueprint":
        for x in np.arange(-7.0, 7.01, 0.35):
            g.add(Line([x, -H, 0], [x, H, 0], stroke_color=c, stroke_width=0.8))
        for y in np.arange(-4.2, 4.21, 0.35):
            g.add(Line([-W, y, 0], [W, y, 0], stroke_color=c, stroke_width=0.8))
        for x in np.arange(-7.0, 7.01, 1.75):
            g.add(Line([x, -H, 0], [x, H, 0], stroke_color=st["accent2"], stroke_width=1.5, stroke_opacity=0.55))
        for y in np.arange(-3.5, 3.51, 1.75):
            g.add(Line([-W, y, 0], [W, y, 0], stroke_color=st["accent2"], stroke_width=1.5, stroke_opacity=0.55))
    g.set_z_index(-100)
    return g


# ── 왼쪽 위 이름표 ───────────────────────────────────────────
def chip_box(st, w, h, paper):
    a = st["accent"]
    k = st["chip"]
    if k == "round":
        return RoundedRectangle(corner_radius=h / 2, width=w + 0.2, height=h, fill_color=a, fill_opacity=1, stroke_width=0)
    if k == "tag":
        body = Polygon([-w / 2 - 0.35, 0, 0], [-w / 2, h / 2, 0], [w / 2 + 0.1, h / 2, 0], [w / 2 + 0.1, -h / 2, 0],
                       [-w / 2, -h / 2, 0], fill_color=a, fill_opacity=1, stroke_width=0)
        hole = Circle(radius=0.07, fill_color=paper, fill_opacity=1, stroke_width=0).move_to([-w / 2 - 0.08, 0, 0])
        return VGroup(body, hole)
    if k == "stripe":
        body = Rectangle(width=w + 0.25, height=h, fill_color="#FFFFFF", fill_opacity=1, stroke_color=a, stroke_width=3)
        bar = Rectangle(width=0.22, height=h, fill_color=a, fill_opacity=1, stroke_width=0).align_to(body, LEFT)
        return VGroup(body, bar)
    # double
    outer = RoundedRectangle(corner_radius=0.08, width=w + 0.3, height=h + 0.14, fill_color=a, fill_opacity=1, stroke_width=0)
    inner = RoundedRectangle(corner_radius=0.05, width=w + 0.12, height=h - 0.04, fill_opacity=0, stroke_color="#FFFFFF", stroke_width=2)
    return VGroup(outer, inner)


def chip_text_color(st):
    return st["accent"] if st["chip"] == "stripe" else "#FFFFFF"


# ── 자막 띠 ─────────────────────────────────────────────────
def sub_band(st, width, height, paper, soft):
    a = st["accent"]
    k = st["band"]
    if k == "round":
        return VGroup(RoundedRectangle(corner_radius=height / 2, width=width, height=height, fill_color=paper,
                                       fill_opacity=0.97, stroke_color=st["accent2"], stroke_width=4))
    if k == "leftbar":
        body = RoundedRectangle(corner_radius=0.12, width=width, height=height, fill_color=paper, fill_opacity=0.97,
                                stroke_color=st["line"], stroke_width=2)
        bar = RoundedRectangle(corner_radius=0.06, width=0.22, height=height - 0.16, fill_color=a, fill_opacity=1,
                               stroke_width=0).move_to([-width / 2 + 0.22, 0, 0])
        return VGroup(body, bar)
    if k == "topline":
        body = Rectangle(width=width, height=height, fill_color=paper, fill_opacity=0.97, stroke_color=st["line"], stroke_width=2)
        top = Line([-width / 2, height / 2, 0], [width / 2, height / 2, 0], stroke_color=a, stroke_width=7)
        return VGroup(body, top)
    outer = RoundedRectangle(corner_radius=0.08, width=width, height=height, fill_color=paper, fill_opacity=0.97,
                             stroke_color=a, stroke_width=3)
    inner = RoundedRectangle(corner_radius=0.05, width=width - 0.18, height=height - 0.18, fill_opacity=0,
                             stroke_color=st["accent2"], stroke_width=1.5)
    return VGroup(outer, inner)


# ── 오프닝·마무리 그림 ──────────────────────────────────────
def icon(st, r=0.9, kind="ep"):
    a, b = st["accent"], st["accent2"]
    if kind == "mm":
        cols = [a, b, "#E0703A", "#2F6FD6", "#B5408F"]
        grp = VGroup()
        for i, c in enumerate(cols):
            ang = PI / 2 + i * TAU / 5
            end = np.array([np.cos(ang), np.sin(ang), 0]) * r
            grp.add(Line(ORIGIN, end, stroke_color=c, stroke_width=max(4, 14 * r)))
            grp.add(Dot(end, radius=0.2 * r, color=c))
        grp.add(Circle(radius=0.36 * r, fill_color="#FFFFFF", fill_opacity=1, stroke_color=a, stroke_width=max(3, 10 * r)))
        return grp
    k = st["icon"]
    w = max(4, 14 * r)
    if k == "magnifier":
        glass = Circle(radius=r, fill_color="#FFFFFF", fill_opacity=0.9, stroke_color=a, stroke_width=w * 1.15)
        leaf = Ellipse(width=r * 0.9, height=r * 0.5, fill_color=b, fill_opacity=1, stroke_width=0).rotate(0.6)
        vein = Line([-r * 0.32, -r * 0.18, 0], [r * 0.32, r * 0.18, 0], stroke_color=a, stroke_width=w * 0.3)
        handle = Line(ORIGIN, RIGHT * r * 1.1, stroke_color="#2B2B33", stroke_width=w * 1.8).rotate(-0.8, about_point=ORIGIN)
        handle.shift(glass.point_at_angle(-0.8))
        return VGroup(glass, leaf, vein, handle)
    if k == "flask":
        body = Polygon([-r * 0.22, r, 0], [r * 0.22, r, 0], [r * 0.22, r * 0.25, 0], [r * 0.85, -r * 0.85, 0],
                       [-r * 0.85, -r * 0.85, 0], [-r * 0.22, r * 0.25, 0], fill_color="#FFFFFF", fill_opacity=0.9,
                       stroke_color=a, stroke_width=w)
        liquid = Polygon([r * 0.5, -r * 0.2, 0], [r * 0.83, -r * 0.82, 0], [-r * 0.83, -r * 0.82, 0], [-r * 0.5, -r * 0.2, 0],
                         fill_color="#8FD0C8", fill_opacity=0.9, stroke_width=0)
        bub = VGroup(*[Circle(radius=r * s_, stroke_color=a, stroke_width=w * 0.35).move_to([x * r, y * r, 0])
                       for s_, x, y in [(0.09, -0.1, 0.45), (0.13, 0.12, 0.75), (0.07, -0.05, 1.12)]])
        return VGroup(liquid, body, bub)
    if k == "atom":
        core = Circle(radius=r * 0.2, fill_color=b, fill_opacity=1, stroke_width=0)
        orbs = VGroup(*[Ellipse(width=2 * r, height=0.7 * r, stroke_color=a, stroke_width=w * 0.6).rotate(t)
                        for t in (0, PI / 3, -PI / 3)])
        el = VGroup(*[Dot(o.point_from_proportion(p), radius=r * 0.09, color=a) for o, p in zip(orbs, (0.1, 0.45, 0.8))])
        return VGroup(orbs, core, el)
    # planet
    ball = Circle(radius=r * 0.62, fill_color=b, fill_opacity=1, stroke_color=a, stroke_width=w * 0.5)
    band = Arc(radius=r * 0.62, start_angle=PI * 0.15, angle=PI * 0.7, stroke_color="#FFFFFF", stroke_width=w * 0.4).scale(0.7)
    ring = Ellipse(width=2.2 * r, height=0.55 * r, stroke_color=a, stroke_width=w * 0.8).rotate(-0.35)
    star = VGroup(*[Dot([x * r, y * r, 0], radius=r * 0.05, color=a) for x, y in [(-1.0, 0.8), (0.95, 0.9), (1.1, -0.7)]])
    return VGroup(ball, band, ring, star)


# ── 마인드맵 모양 ───────────────────────────────────────────
def mm_center(st, radius, ink):
    k = st["center"]
    a = st["accent"]
    if k == "circle":
        return Circle(radius=radius, fill_color=a, fill_opacity=1, stroke_width=0)
    if k == "rounded":
        return RoundedRectangle(corner_radius=0.45, width=radius * 2.05, height=radius * 1.75, fill_color=a,
                                fill_opacity=1, stroke_width=0)
    if k == "hex":
        return RegularPolygon(6, fill_color=a, fill_opacity=1, stroke_width=0).scale(radius * 1.08)
    ball = Circle(radius=radius, fill_color=a, fill_opacity=1, stroke_width=0)
    ring = Ellipse(width=radius * 2.9, height=radius * 0.7, stroke_color=st["accent2"], stroke_width=6).rotate(-0.3)
    return VGroup(ring, ball)


def mm_leaf_box(st, w, h, col):
    k = st["leaf"]
    if k == "round":
        return RoundedRectangle(corner_radius=h / 2, width=w, height=h, fill_color=col, fill_opacity=0.12, stroke_color=col, stroke_width=3)
    if k == "tag":
        return Polygon([-w / 2 - 0.15, 0, 0], [-w / 2, h / 2, 0], [w / 2, h / 2, 0], [w / 2, -h / 2, 0], [-w / 2, -h / 2, 0],
                       fill_color=col, fill_opacity=0.12, stroke_color=col, stroke_width=3)
    if k == "square":
        return Rectangle(width=w, height=h, fill_color=col, fill_opacity=0.12, stroke_color=col, stroke_width=3)
    outer = RoundedRectangle(corner_radius=0.06, width=w, height=h, fill_color=col, fill_opacity=0.1, stroke_color=col, stroke_width=2.5)
    inner = RoundedRectangle(corner_radius=0.04, width=w - 0.1, height=h - 0.1, fill_opacity=0, stroke_color=col, stroke_width=1)
    return VGroup(outer, inner)


def mm_branch_node_box(st, w, h, col):
    k = st["leaf"]
    if k == "round":
        return RoundedRectangle(corner_radius=h / 2, width=w, height=h, fill_color=col, fill_opacity=1, stroke_width=0)
    if k == "square":
        return Rectangle(width=w, height=h, fill_color=col, fill_opacity=1, stroke_width=0)
    return RoundedRectangle(corner_radius=0.12, width=w, height=h, fill_color=col, fill_opacity=1, stroke_width=0)


def mm_link(st, start, end, col, width=12):
    from manim import CubicBezier, VMobject
    k = st["branch"]
    if k == "curve":
        return CubicBezier(start, start + RIGHT * 0.7, end - RIGHT * 0.7, end, stroke_color=col, stroke_width=width)
    if k == "elbow":
        mx = (start[0] + end[0]) / 2
        m = VMobject(stroke_color=col, stroke_width=width)
        m.set_points_as_corners([start, [mx, start[1], 0], [mx, end[1], 0], end])
        return m
    return Line(start, end, stroke_color=col, stroke_width=width)
