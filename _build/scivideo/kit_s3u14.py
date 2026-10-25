"""3학년 1학기 4단원 「생물의 한살이」 그림 부품 (s3ep15~19, s3mm04)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 (0, 0).
  배추흰나비: bf_egg(알) · caterpillar(애벌레) · pupa(번데기) · butterfly(어른벌레, .head .chest .belly) · kale_leaf(잎)
  씨 싹 틔우기: seed_cup(물 있음/없음, 무씨 단계 0~4)
  식물 기르기: kale_pot(상태 good·wilt·pale·start) · light_cover(햇빛 차단 장치) · sun · drop
  동물: frog_stage(0 알 ~ 4 다 자란 개구리) · dog(강아지·개) · mantis(사마귀) · ootheca(알집) · quail_egg(메추라기 알)
  식물 한살이: balsam(봉숭아 단계) · apple_tree(사과나무 단계) — 아래 가운데(땅)가 (0, 0)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, ArcBetweenPoints, Circle, CurvedArrow, Dot, Ellipse, Line, Polygon, Rectangle,
                   RoundedRectangle, VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T
from scikit import BROWN, BROWN_DARK, GROUND, RED

LEAF = "#6DB65B"
LEAF_D = "#3E8537"
LEAF_PALE = "#C8DC8E"
WILT = "#B8A45A"
EGG_Y = "#F2C744"
WING = "#FBF7E4"
PINK = "#EC6F9E"
WATER = "#8EC9EE"
SEED = "#8B3F2A"


def smooth_shape(pts, fill, stroke=INK, sw=3, opacity=1.0):
    m = VMobject(fill_color=fill, fill_opacity=opacity, stroke_color=stroke, stroke_width=sw)
    p = [np.array([x, y, 0.0]) for x, y in pts]
    m.set_points_smoothly(p + [p[0]])
    return m


# ── 배추흰나비 ───────────────────────────────────────────────
def kale_leaf(w=3.2, color=LEAF, angle=0.0):
    pts = [(-0.5, 0), (-0.35, 0.2), (0, 0.3), (0.32, 0.22), (0.5, 0.02), (0.33, -0.2), (0, -0.28), (-0.35, -0.18)]
    body = smooth_shape([(x * w, y * w) for x, y in pts], color, LEAF_D, 4)
    rib = Line([-0.5 * w, 0, 0], [0.42 * w, 0.02 * w, 0], stroke_color=LEAF_D, stroke_width=4)
    veins = VGroup(*[Line([x * w, 0, 0], [(x + 0.1) * w, s * 0.17 * w, 0], stroke_color=LEAF_D, stroke_width=2.5)
                     for x in (-0.25, 0.0, 0.22) for s in (1, -1)])
    g = VGroup(body, rib, veins)
    g.rotate(angle)
    return g


def bf_egg(h=1.0, color=EGG_Y):
    """배추흰나비알: 길쭉하고 주름진 옥수수 모양(세워져 붙어 있음). 아래 가운데가 (0,0)"""
    w = h * 0.42
    pts = [(0, h), (w * 0.35, h * 0.9), (w * 0.5, h * 0.55), (w * 0.45, h * 0.2), (w * 0.3, 0.0),
           (-w * 0.3, 0.0), (-w * 0.45, h * 0.2), (-w * 0.5, h * 0.55), (-w * 0.35, h * 0.9)]
    body = smooth_shape(pts, color, "#B8901C", max(1.5, 3 * h))
    ridges = VGroup(*[Line([x * w, h * 0.12, 0], [x * w * 0.8, h * 0.86, 0], stroke_color="#C9A12A",
                           stroke_width=max(1, 2.2 * h)) for x in (-0.25, 0.0, 0.25)])
    return VGroup(body, ridges)


def caterpillar(length=3.0, color="#7CC36B", hairs=True):
    """애벌레: 여러 마디의 긴 원통 모양(오른쪽이 머리). 아래가 y=0"""
    n = max(5, int(round(length / 0.32)))
    r = length / n * 0.62
    segs = VGroup()
    for i in range(n):
        x = -length / 2 + r + i * (length - 2 * r) / (n - 1)
        segs.add(Circle(radius=r, fill_color=color, fill_opacity=1, stroke_color=LEAF_D,
                        stroke_width=max(1.5, 2.5 * r / 0.2)).move_to([x, r, 0]))
    head = segs[-1]
    eye = Dot(head.get_center() + np.array([r * 0.35, r * 0.25, 0]), radius=max(0.02, r * 0.16), color=INK)
    g = VGroup(segs, eye)
    if hairs:
        hs = VGroup()
        for s in segs:
            c = s.get_center()
            for a in (0.6, 1.57, 2.5):
                p = c + r * np.array([np.cos(a), np.sin(a), 0])
                hs.add(Line(p, p + 0.35 * r * np.array([np.cos(a), np.sin(a), 0]), stroke_color=LEAF_D,
                            stroke_width=max(1, 1.6 * r / 0.2)))
        g.add(hs)
    return g


def pupa(h=2.0, color="#8CC860"):
    """번데기: 가운데가 볼록하고 양쪽 끝이 뾰족(세로). 가운데가 (0,0)"""
    pts = [(0, 0.5), (0.1, 0.36), (0.2, 0.12), (0.17, -0.12), (0.08, -0.36), (0, -0.5),
           (-0.08, -0.36), (-0.15, -0.12), (-0.16, 0.12), (-0.09, 0.36)]
    body = smooth_shape([(x * h, y * h) for x, y in pts], color, "#4F7A35", 3.5)
    lines = VGroup(*[Line([-0.12 * h, y * h, 0], [0.13 * h, (y - 0.02) * h, 0], stroke_color="#4F7A35", stroke_width=2)
                     for y in (-0.2, -0.28, -0.36)])
    silk = Line([0, 0.5 * h, 0], [0, 0.62 * h, 0], stroke_color="#D9D2B8", stroke_width=4)
    g = VGroup(silk, body, lines)
    g.body = body
    return g


def butterfly(s=1.0, wings=WING):
    """배추흰나비 어른벌레(위에서 본 모습). .head .chest .belly .wings로 부분을 가리킬 수 있음"""
    fw = smooth_shape([(0.05, 0.05), (0.5, 0.55), (1.2, 0.75), (1.45, 0.5), (1.1, 0.05), (0.4, -0.05)], wings, INK, 3)
    hw = smooth_shape([(0.05, -0.05), (0.6, -0.1), (1.0, -0.45), (0.8, -0.9), (0.35, -0.8), (0.08, -0.35)], wings, INK, 3)
    tip = smooth_shape([(1.12, 0.73), (1.35, 0.64), (1.44, 0.48), (1.28, 0.52)], INK, INK, 1)
    sp1 = Dot([0.8, 0.32, 0], radius=0.09, color=INK)
    sp2 = Dot([0.55, -0.22, 0], radius=0.07, color=INK)
    right = VGroup(fw, hw, tip, sp1, sp2)
    left = right.copy().flip(UP, about_point=ORIGIN)
    head = Circle(radius=0.13, fill_color="#5C5C5C", fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([0, 0.42, 0])
    chest = Ellipse(width=0.24, height=0.44, fill_color="#5C5C5C", fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([0, 0.1, 0])
    belly = Ellipse(width=0.18, height=0.78, fill_color="#6E6E6E", fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([0, -0.5, 0])
    rings = VGroup(*[Line([-0.08, y, 0], [0.08, y, 0], stroke_color=INK, stroke_width=1.5) for y in (-0.3, -0.5, -0.7)])
    ant = VGroup()
    for sgn in (1, -1):
        ln = Line([0.04 * sgn, 0.52, 0], [0.32 * sgn, 1.05, 0], stroke_color=INK, stroke_width=3)
        ant.add(ln, Dot([0.32 * sgn, 1.05, 0], radius=0.05, color=INK))
    g = VGroup(left, right, ant, belly, rings, chest, head)
    g.scale(s, about_point=ORIGIN)
    g.head, g.chest, g.belly, g.wings = head, chest, VGroup(belly, rings), VGroup(left, right)
    return g


# ── 씨가 싹 트려면: 컵 장치 ──────────────────────────────────
def seeds(stage=0, n=5, width=1.5, y=0.0):
    """무씨 한 줄. stage 0 마른 씨 · 1 부풂 · 2 껍질이 벗겨지고 하얀 뿌리 · 3 싹(떡잎) · 4 더 자람"""
    g = VGroup()
    for i in range(n):
        x = -width / 2 + i * width / (n - 1)
        sz = 0.11 if stage == 0 else 0.15
        col = SEED if stage < 2 else "#C98B5E"
        if stage >= 2:
            g.add(Line([x, y + 0.03, 0], [x + 0.06, y - 0.32, 0], stroke_color="#B8A77E", stroke_width=6))
            g.add(Line([x, y + 0.03, 0], [x + 0.06, y - 0.32, 0], stroke_color="#FFFDF5", stroke_width=3))
        if stage >= 3:
            hgt = 0.35 if stage == 3 else 0.7
            g.add(Line([x, y, 0], [x, y + hgt, 0], stroke_color="#7CC36B", stroke_width=4))
            for sgn in (1, -1):
                g.add(Ellipse(width=0.24, height=0.13, fill_color="#8BD17C", fill_opacity=1, stroke_color=LEAF_D,
                              stroke_width=1.5).move_to([x + sgn * 0.12, y + hgt + 0.02, 0]).rotate(sgn * 0.35))
        else:
            g.add(Ellipse(width=sz * 1.25, height=sz, fill_color=col, fill_opacity=1, stroke_width=0).move_to([x, y + sz / 2, 0]))
    return g


def seed_cup(water=True, stage=0, s=1.0):
    """큰 컵 안에 작은 컵을 끼운 장치(심지·원 모양 부직포·무씨). 아래 가운데가 (0,0). .seeds .water"""
    big = Polygon([-0.95, 2.2, 0], [0.95, 2.2, 0], [0.75, 0, 0], [-0.75, 0, 0],
                  fill_color="#E8F3FA", fill_opacity=0.45, stroke_color="#7FA8C2", stroke_width=4)
    wat = Polygon([-0.86, 1.25, 0], [0.86, 1.25, 0], [0.75, 0.04, 0], [-0.75, 0.04, 0],
                  fill_color=WATER, fill_opacity=0.85 if water else 0, stroke_width=0)
    small = Polygon([-0.98, 2.55, 0], [0.98, 2.55, 0], [0.7, 1.55, 0], [-0.7, 1.55, 0],
                    fill_color="#F7F7F7", fill_opacity=0.9, stroke_color="#9AA4AA", stroke_width=4)
    wick = Line([0, 1.55, 0], [0, 0.25, 0], stroke_color="#E4DCC8", stroke_width=10)
    pad = Ellipse(width=1.75, height=0.22, fill_color="#E3F1FA" if water else "#F4EFE4", fill_opacity=1,
                  stroke_color="#C5BBA6", stroke_width=2).move_to([0, 2.5, 0])
    sd = seeds(stage, n=5, width=1.2, y=2.52)
    g = VGroup(big, wat, wick, small, pad, sd)
    g.scale(s, about_point=ORIGIN)
    g.seeds, g.water = sd, wat
    return g


# ── 식물이 잘 자라려면: 케일 화분 ─────────────────────────────
def kale_pot(state="start", s=1.0):
    """케일 화분. state: start(처음) · good(잎이 커지고 줄기가 굵음) · wilt(시듦) · pale(잎이 연하고 줄기가 가늚)
    아래 가운데가 (0,0)"""
    pot = Polygon([-0.8, 1.0, 0], [0.8, 1.0, 0], [0.6, 0, 0], [-0.6, 0, 0], fill_color="#C8744A", fill_opacity=1,
                  stroke_color="#8A4A2A", stroke_width=4)
    rim = Rectangle(width=1.8, height=0.22, fill_color="#B5653E", fill_opacity=1, stroke_color="#8A4A2A",
                    stroke_width=4).move_to([0, 1.05, 0])
    soil = Ellipse(width=1.55, height=0.18, fill_color="#5B4030", fill_opacity=1, stroke_width=0).move_to([0, 1.14, 0])
    cfg = {"start": (0.9, 7, LEAF, 0.9, 0.0), "good": (1.4, 10, "#3F9A3A", 1.25, 0.0),
           "wilt": (1.35, 5, WILT, 0.85, -0.85), "pale": (1.6, 3.5, LEAF_PALE, 0.8, 0.0)}[state]
    hgt, sw, col, lw, droop = cfg
    base = np.array([0, 1.18, 0])
    stem = Line(base, base + UP * hgt, stroke_color="#5E9E4A" if state != "wilt" else "#9C8B48", stroke_width=sw)
    if state == "wilt":
        stem = ArcBetweenPoints(base, base + np.array([0.35, hgt * 0.9, 0]), angle=-0.6,
                                stroke_color="#9C8B48", stroke_width=sw)
    leaves = VGroup()
    top = stem.get_end()
    for i, (frac, sgn) in enumerate([(0.45, 1), (0.6, -1), (0.8, 1), (1.0, -1)]):
        p = base + (top - base) * frac
        a = (0.35 + droop) if sgn > 0 else (PI - 0.35 - droop)
        lf = kale_leaf(lw, col).shift(RIGHT * lw * 0.46)
        lf.rotate(a, about_point=ORIGIN).shift(p)
        leaves.add(lf)
    g = VGroup(stem, leaves, pot, rim, soil)
    g.scale(s, about_point=ORIGIN)
    return g


def light_cover(w=2.6, h=3.6):
    """햇빛 차단 장치(아래 가운데가 (0,0))"""
    box = RoundedRectangle(corner_radius=0.12, width=w, height=h, fill_color="#5D6670", fill_opacity=0.78,
                           stroke_color="#3C434A", stroke_width=4).move_to([0, h / 2, 0])
    t = T("햇빛 차단 장치", 24, PAPER).move_to([0, h - 0.35, 0])
    return VGroup(box, t)


def sun(r=0.55):
    c = Circle(radius=r, fill_color="#FFC93C", fill_opacity=1, stroke_color="#E09A12", stroke_width=4)
    rays = VGroup(*[Line(r * 1.25 * np.array([np.cos(a), np.sin(a), 0]), r * 1.7 * np.array([np.cos(a), np.sin(a), 0]),
                         stroke_color="#E09A12", stroke_width=5) for a in np.arange(0, TAU, TAU / 8)])
    return VGroup(rays, c)


def drop(h=0.6, color=WATER):
    pts = [(0, 0.5), (0.18, 0.12), (0.26, -0.15), (0.13, -0.38), (0, -0.42), (-0.13, -0.38), (-0.26, -0.15), (-0.18, 0.12)]
    return smooth_shape([(x * h * 1.6, y * h * 1.6) for x, y in pts], color, "#3B86C0", 3)


# ── 여러 동물 ─────────────────────────────────────────────────
FROG = "#6BAF4F"
FROG_D = "#3D7A2C"


def frog_stage(k, s=1.0):
    """개구리 한살이 단계 k: 0 알 · 1 올챙이 · 2 뒷다리가 나온 올챙이 · 3 앞다리가 나오고 꼬리가 짧아진 어린 개구리 · 4 다 자란 개구리"""
    if k == 0:
        g = VGroup()
        rng = np.random.default_rng(3)
        for i in range(11):
            p = np.array([rng.uniform(-0.75, 0.75), rng.uniform(-0.45, 0.45), 0])
            g.add(Circle(radius=0.2, fill_color="#DCEFF7", fill_opacity=0.8, stroke_color="#8DB7CC", stroke_width=2).move_to(p))
            g.add(Dot(p, radius=0.06, color=INK))
        return g.scale(s, about_point=ORIGIN)
    if k in (1, 2):
        head = Ellipse(width=0.8, height=0.6, fill_color="#3E3A33", fill_opacity=1, stroke_width=0).move_to([0.4, 0, 0])
        tail = smooth_shape([(0.05, 0.18), (-0.5, 0.2), (-1.05, 0.05), (-1.2, 0.0), (-1.05, -0.05), (-0.5, -0.18), (0.05, -0.18)],
                            "#5A544A", "#3E3A33", 2)
        eye = Dot([0.62, 0.1, 0], radius=0.05, color=PAPER)
        g = VGroup(tail, head, eye)
        if k == 2:
            for sgn in (1, -1):
                g.add(Line([0.05, -0.15 * sgn, 0], [-0.25, -0.42 * sgn, 0], stroke_color="#3E3A33", stroke_width=6))
                g.add(Line([-0.25, -0.42 * sgn, 0], [-0.1, -0.55 * sgn, 0], stroke_color="#3E3A33", stroke_width=6))
        return g.scale(s, about_point=ORIGIN)
    # 3, 4: 위에서 본 개구리
    body = Ellipse(width=1.0, height=1.2, fill_color=FROG, fill_opacity=1, stroke_color=FROG_D, stroke_width=3)
    head = Ellipse(width=0.9, height=0.6, fill_color=FROG, fill_opacity=1, stroke_color=FROG_D, stroke_width=3).move_to([0, 0.6, 0])
    eyes = VGroup(*[VGroup(Circle(radius=0.14, fill_color=FROG, fill_opacity=1, stroke_color=FROG_D, stroke_width=3),
                           Dot(radius=0.06, color=INK)).move_to([sgn * 0.28, 0.82, 0]) for sgn in (1, -1)])
    legs = VGroup()
    for sgn in (1, -1):
        legs.add(VMobject(stroke_color=FROG_D, stroke_width=9).set_points_as_corners(
            [[sgn * 0.35, 0.35, 0], [sgn * 0.7, 0.45, 0], [sgn * 0.75, 0.75, 0]]))
        legs.add(VMobject(stroke_color=FROG_D, stroke_width=11).set_points_as_corners(
            [[sgn * 0.35, -0.45, 0], [sgn * 0.85, -0.25, 0], [sgn * 0.6, -0.7, 0], [sgn * 0.95, -0.9, 0]]))
    g = VGroup(legs, body, head, eyes)
    if k == 3:
        tail = Polygon([-0.15, -0.55, 0], [0.15, -0.55, 0], [0, -0.95, 0], fill_color="#5A8F45", fill_opacity=1, stroke_width=0)
        g.add_to_back(tail)
        g.scale(0.7)
    return g.scale(s, about_point=ORIGIN)


def dog(s=1.0, puppy=False):
    """옆에서 본 개(오른쪽을 봄). 강아지는 작고 눈을 감음. 아래 가운데가 (0,0)"""
    col, dk = "#D9A86C", "#9C6B35"
    body = RoundedRectangle(corner_radius=0.35, width=2.0, height=0.8, fill_color=col, fill_opacity=1,
                            stroke_color=dk, stroke_width=3).move_to([0, 1.05, 0])
    head = Circle(radius=0.45, fill_color=col, fill_opacity=1, stroke_color=dk, stroke_width=3).move_to([1.15, 1.55, 0])
    snout = Ellipse(width=0.5, height=0.32, fill_color="#E8C493", fill_opacity=1, stroke_color=dk, stroke_width=3).move_to([1.5, 1.42, 0])
    nose = Dot([1.73, 1.47, 0], radius=0.07, color=INK)
    ear = Ellipse(width=0.32, height=0.6, fill_color=dk, fill_opacity=1, stroke_width=0).move_to([0.95, 1.65, 0]).rotate(-0.4)
    if puppy:
        eye = Arc(radius=0.08, start_angle=PI, angle=PI, stroke_color=INK, stroke_width=3).move_to([1.25, 1.66, 0])
    else:
        eye = Dot([1.25, 1.68, 0], radius=0.06, color=INK)
    legs = VGroup(*[RoundedRectangle(corner_radius=0.08, width=0.24, height=0.8, fill_color=col, fill_opacity=1,
                                     stroke_color=dk, stroke_width=3).move_to([x, 0.4, 0]) for x in (-0.7, -0.4, 0.45, 0.75)])
    tail = Line([-1.0, 1.25, 0], [-1.4, 1.75, 0], stroke_color=dk, stroke_width=10)
    g = VGroup(tail, legs, body, ear, head, snout, nose, eye)
    return g.scale(s * (0.55 if puppy else 1.0), about_point=ORIGIN)


def mantis(s=1.0, color="#7CB342"):
    """사마귀(옆, 오른쪽을 봄). 아래가 y=0"""
    dk = "#4E7A23"
    belly = Ellipse(width=1.8, height=0.42, fill_color=color, fill_opacity=1, stroke_color=dk, stroke_width=3).move_to([-0.9, 0.75, 0]).rotate(0.12)
    chest = Line([0.0, 0.85, 0], [0.75, 1.55, 0], stroke_color=dk, stroke_width=14)
    head = Polygon([0.7, 1.75, 0], [1.05, 1.6, 0], [0.75, 1.42, 0], fill_color=color, fill_opacity=1, stroke_color=dk, stroke_width=3)
    eye = Dot([0.82, 1.62, 0], radius=0.05, color=INK)
    fore = VMobject(stroke_color=dk, stroke_width=7).set_points_as_corners([[0.6, 1.4, 0], [1.0, 1.0, 0], [0.95, 1.45, 0]])
    legs = VGroup(*[VMobject(stroke_color=dk, stroke_width=5).set_points_as_corners([[x, 0.8, 0], [x + 0.25 * d, 0.45, 0], [x + 0.35 * d, 0.0, 0]])
                    for x, d in ((-0.1, 1), (-0.3, -1), (-0.5, -1))])
    ant = Line([0.95, 1.7, 0], [1.4, 2.2, 0], stroke_color=dk, stroke_width=3)
    wing = Ellipse(width=1.6, height=0.3, fill_color="#A5D16E", fill_opacity=0.9, stroke_color=dk, stroke_width=2).move_to([-0.7, 0.95, 0]).rotate(0.12)
    g = VGroup(legs, belly, wing, chest, fore, head, eye, ant)
    return g.scale(s, about_point=ORIGIN)


def ootheca(s=1.0):
    """사마귀 알집(나뭇가지에 붙음)"""
    twig = Line([-1.2, 0.35, 0], [1.2, 0.45, 0], stroke_color=BROWN_DARK, stroke_width=10)
    case = smooth_shape([(-0.55, 0.3), (-0.3, 0.1), (0.2, 0.0), (0.55, 0.15), (0.6, 0.38), (0, 0.42)], "#C9A26B", "#8A6A3E", 3)
    case.move_to([0, 0.05, 0])
    lines = VGroup(*[Line([x, -0.12, 0], [x + 0.05, 0.25, 0], stroke_color="#8A6A3E", stroke_width=2) for x in (-0.3, -0.1, 0.1, 0.3)])
    return VGroup(twig, case, lines).scale(s, about_point=ORIGIN)


def quail_egg(s=1.0):
    e = Ellipse(width=0.8, height=1.05, fill_color="#F1E6CF", fill_opacity=1, stroke_color="#A89573", stroke_width=3)
    rng = np.random.default_rng(5)
    sp = VGroup(*[Dot([rng.uniform(-0.28, 0.28), rng.uniform(-0.38, 0.38), 0], radius=rng.uniform(0.04, 0.09), color="#6A4A30")
                  for _ in range(14)])
    return VGroup(e, sp).scale(s, about_point=ORIGIN)


# ── 식물 한살이 ───────────────────────────────────────────────
def _herb_leaf(p, ang, size, col):
    lf = Ellipse(width=size, height=size * 0.42, fill_color=col, fill_opacity=1, stroke_color=LEAF_D, stroke_width=2)
    lf.move_to(p + size * 0.48 * np.array([np.cos(ang), np.sin(ang), 0])).rotate(ang)
    return lf


def balsam(stage, s=1.0):
    """봉숭아. stage: seed · sprout · leafy · flower · fruit · dead. 아래 가운데(땅)가 (0,0)"""
    g = VGroup()
    if stage == "seed":
        for x in (-0.25, 0, 0.25):
            g.add(Ellipse(width=0.16, height=0.13, fill_color="#6D4C41", fill_opacity=1, stroke_width=0).move_to([x, -0.12, 0]))
        return g.scale(s, about_point=ORIGIN)
    if stage == "sprout":
        g.add(Line(ORIGIN, UP * 0.55, stroke_color="#7CC36B", stroke_width=6))
        for sgn in (1, -1):
            g.add(_herb_leaf(UP * 0.55, PI / 2 - sgn * 1.1, 0.42, "#8BD17C"))
        return g.scale(s, about_point=ORIGIN)
    dead = stage == "dead"
    hgt = 2.4 if stage != "dead" else 1.9
    stem_col = "#7DAF55" if not dead else "#9A7B4F"
    stem = Line(ORIGIN, UP * hgt, stroke_color=stem_col, stroke_width=9)
    g.add(stem)
    for i, y in enumerate(np.linspace(0.5, hgt - 0.1, 6)):
        sgn = 1 if i % 2 == 0 else -1
        if dead:
            g.add(_herb_leaf(UP * y, -PI / 2 + sgn * 0.5, 0.5, "#B59A62"))
        else:
            g.add(_herb_leaf(UP * y, PI / 2 - sgn * 1.0, 0.75, "#5FAE52"))
    if stage == "flower":
        for i, y in enumerate((1.1, 1.6, 2.1)):
            for sgn in (1, -1):
                f = VGroup(*[Circle(radius=0.11, fill_color=PINK, fill_opacity=1, stroke_width=0).move_to(
                    0.11 * np.array([np.cos(a), np.sin(a), 0])) for a in np.arange(0, TAU, TAU / 5)],
                           Dot(radius=0.06, color="#FFE082"))
                f.move_to([sgn * 0.2, y + 0.05, 0])
                g.add(f)
    if stage == "fruit":
        for y in (1.1, 1.6, 2.1):
            for sgn in (1, -1):
                g.add(Ellipse(width=0.2, height=0.42, fill_color="#9CCC65", fill_opacity=1, stroke_color=LEAF_D,
                              stroke_width=2).move_to([sgn * 0.2, y, 0]).rotate(sgn * 0.3))
    if dead:
        g.rotate(-0.25, about_point=ORIGIN)
        for x in (0.6, 0.85, 1.05):
            g.add(Ellipse(width=0.15, height=0.12, fill_color="#6D4C41", fill_opacity=1, stroke_width=0).move_to([x, 0.05, 0]))
    return g.scale(s, about_point=ORIGIN)


def apple_tree(stage, s=1.0):
    """사과나무. stage: seed · sprout · sapling · bare(겨울눈) · blossom · fruit · leafy. 아래 가운데(땅)가 (0,0)"""
    if stage in ("seed", "sprout"):
        if stage == "seed":
            return VGroup(Ellipse(width=0.2, height=0.3, fill_color="#4E342E", fill_opacity=1, stroke_width=0).move_to([0, -0.15, 0])).scale(s, about_point=ORIGIN)
        g = VGroup(Line(ORIGIN, UP * 0.6, stroke_color="#7CC36B", stroke_width=6))
        for sgn in (1, -1):
            g.add(_herb_leaf(UP * 0.6, PI / 2 - sgn * 1.0, 0.45, "#8BD17C"))
        return g.scale(s, about_point=ORIGIN)
    if stage == "sapling":
        g = VGroup(Line(ORIGIN, UP * 1.5, stroke_color=BROWN, stroke_width=10))
        for i, y in enumerate((0.7, 1.0, 1.3, 1.55)):
            sgn = 1 if i % 2 else -1
            g.add(_herb_leaf(UP * y, PI / 2 - sgn * 0.9, 0.55, "#5FAE52"))
        return g.scale(s, about_point=ORIGIN)
    trunk = Polygon([-0.22, 0, 0], [0.22, 0, 0], [0.14, 2.0, 0], [-0.14, 2.0, 0], fill_color=BROWN, fill_opacity=1,
                    stroke_color=BROWN_DARK, stroke_width=3)
    br = VGroup(*[Line([0, 1.6 + 0.2 * k, 0], [d * 0.95, 2.5 + 0.25 * k, 0], stroke_color=BROWN_DARK, stroke_width=7)
                  for k, d in ((0, -1), (0, 1), (1, -0.5), (1, 0.55))])
    br.add(Line([0, 2.0, 0], [0, 2.85, 0], stroke_color=BROWN_DARK, stroke_width=7))
    g = VGroup(trunk, br)
    tips = [np.array([d * 0.95, 2.5 + 0.25 * k, 0]) for k, d in ((0, -1), (0, 1), (1, -0.5), (1, 0.55))] + [np.array([0, 2.85, 0])]
    if stage == "bare":
        for p in tips:
            g.add(Ellipse(width=0.13, height=0.22, fill_color="#8D6E63", fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=2).move_to(p + UP * 0.08))
        return g.scale(s, about_point=ORIGIN)
    crown_col = "#6DB65B" if stage in ("fruit", "leafy") else "#A8D58C"
    crown = VGroup(*[Circle(radius=r_, fill_color=crown_col, fill_opacity=1, stroke_width=0).move_to(p)
                     for r_, p in ((0.8, [0, 2.75, 0]), (0.65, [-0.75, 2.45, 0]), (0.65, [0.75, 2.45, 0]),
                                   (0.6, [-0.35, 3.25, 0]), (0.6, [0.4, 3.25, 0]))])
    g = VGroup(trunk, crown)
    rng = np.random.default_rng(7)
    if stage == "blossom":
        for _ in range(16):
            p = np.array([rng.uniform(-1.2, 1.2), rng.uniform(2.0, 3.6), 0])
            g.add(VGroup(*[Circle(radius=0.08, fill_color="#FCE4EC", fill_opacity=1, stroke_color="#E8A5B8", stroke_width=1).move_to(
                p + 0.08 * np.array([np.cos(a), np.sin(a), 0])) for a in np.arange(0, TAU, TAU / 5)], Dot(p, radius=0.04, color="#F4B400")))
    if stage == "fruit":
        for p in ([-0.8, 2.2], [0.75, 2.3], [-0.2, 2.9], [0.45, 3.2], [-0.55, 3.15], [0.15, 2.35], [1.0, 2.75], [-1.05, 2.7]):
            g.add(Circle(radius=0.16, fill_color=RED, fill_opacity=1, stroke_color="#8E2A22", stroke_width=2).move_to([p[0], p[1], 0]))
    return g.scale(s, about_point=ORIGIN)


def ground_strip(x0=-6.8, x1=6.8, y=0.0, color="#B89B72"):
    return Line([x0, y, 0], [x1, y, 0], stroke_color=color, stroke_width=6)


SEASON = {"봄": "#5DAA4A", "여름": "#D9534F", "가을": "#E08A1E", "겨울": "#3F7FC4"}


def season_chip(name, size=34):
    t = T(name, size, PAPER)
    key = name.split()[-1]
    r = RoundedRectangle(corner_radius=0.22, width=t.width + 0.5, height=t.height + 0.3,
                         fill_color=SEASON.get(key, SOFT), fill_opacity=1, stroke_width=0)
    t.move_to(r)
    return VGroup(r, t)
