"""과학 영상 그림 부품 — 사람·상자·힘 화살표·물건 그림(모두 직접 그린 벡터)

화면 좌표: 가로 −7.1 ~ 7.1, 세로 −4 ~ 4. 자막 띠가 아래(y −2.72 아래)를 쓰므로 그림은 y −2.5 ~ 3.1 안에.
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI,
                   Arc, Arrow, Circle, Dot, Ellipse, FadeOut, Line, Polygon, Rectangle,
                   RoundedRectangle, VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T

RED = "#D2453B"
BROWN = "#B9834E"
BROWN_DARK = "#7E5428"
SKIN = "#F4C9A0"
GROUND = "#9C8F7E"


def clear_stage(scene, run_time=0.6, keep=()):
    """자막·로고·구역 이름표를 뺀 모든 그림을 지움"""
    keep = set(keep) | {scene._mark}
    if scene._sub is not None:
        keep |= {scene._sub, *scene._sub}
    if scene._chip is not None:
        keep |= {scene._chip, *scene._chip}
    gone = [m for m in scene.mobjects if m not in keep]
    if gone:
        scene.play(*[FadeOut(m) for m in gone], run_time=run_time)


def ground(y=-1.9, x0=-6.8, x1=6.8):
    return Line([x0, y, 0], [x1, y, 0], stroke_color=GROUND, stroke_width=6)


def person(h=2.6, shirt=BLUE, pose="stand", face=RIGHT):
    """사람(막대 몸 + 둥근 머리). pose: stand · push(두 팔 앞으로) · pull(두 팔 앞으로 굽힘) · sit
    발바닥이 (0, 0)에 오도록 그림. face=LEFT면 좌우를 뒤집음."""
    s = h / 2.6
    w = 7 * s
    head = Circle(radius=0.32 * s, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=w * 0.6).move_to([0, 2.25 * s, 0])
    body = RoundedRectangle(corner_radius=0.18 * s, width=0.62 * s, height=1.05 * s,
                            fill_color=shirt, fill_opacity=1, stroke_width=0).move_to([0, 1.38 * s, 0])
    if pose == "sit":
        legs = VGroup(Line([0, 0.9 * s, 0], [0.62 * s, 0.9 * s, 0]), Line([0.62 * s, 0.9 * s, 0], [0.62 * s, 0.3 * s, 0]))
    else:
        legs = VGroup(Line([-0.12 * s, 0.86 * s, 0], [-0.25 * s, 0, 0]), Line([0.12 * s, 0.86 * s, 0], [0.25 * s, 0, 0]))
    for l in legs:
        l.set_stroke(INK, w * 1.6)
    sh = [0.12 * s, 1.75 * s, 0]
    if pose in ("push", "pull"):
        tip = [0.95 * s, 1.45 * s, 0] if pose == "push" else [0.75 * s, 1.35 * s, 0]
        arms = VGroup(Line(sh, tip), Line([sh[0], sh[1] - 0.1 * s, 0], [tip[0], tip[1] - 0.12 * s, 0]))
    elif pose == "sit":
        arms = VGroup(Line(sh, [0.42 * s, 1.35 * s, 0]), Line([-0.05 * s, 1.75 * s, 0], [0.3 * s, 1.3 * s, 0]))
    else:
        arms = VGroup(Line(sh, [0.35 * s, 0.95 * s, 0]), Line([-0.12 * s, 1.75 * s, 0], [-0.35 * s, 0.95 * s, 0]))
    for a in arms:
        a.set_stroke(INK, w * 1.3)
    p = VGroup(legs, arms, body, head) if pose == "sit" else VGroup(legs, body, arms, head)
    p.hand = np.array(arms[0].get_end()) if pose in ("push", "pull") else None
    if face is LEFT or (isinstance(face, np.ndarray) and face[0] < 0):
        p.flip(UP, about_point=ORIGIN)
        if p.hand is not None:
            p.hand = p.hand * np.array([-1, 1, 1])
    return p


def place(mob, x, y):
    """발바닥(아래 가운데)을 (x, y)에 — person()처럼 (0, 0)이 발인 그림용"""
    mob.shift([x, y, 0])
    if getattr(mob, "hand", None) is not None:
        mob.hand = mob.hand + np.array([x, y, 0])
    return mob


def box(w=2.0, h=1.5, label="", color=BROWN):
    """종이 상자(아래 가운데가 (0,0))"""
    b = Rectangle(width=w, height=h, fill_color=color, fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=5)
    b.move_to([0, h / 2, 0])
    tape = Line([-w / 2, h * 0.86, 0], [w / 2, h * 0.86, 0], stroke_color=BROWN_DARK, stroke_width=4)
    g = VGroup(b, tape)
    if label:
        g.add(T(label, int(46 * min(1, w / 2)), PAPER).move_to([0, h * 0.6, 0]))
    return g


def bundle(w=1.1, h=0.26):
    """복사용지 한 묶음(포장지 + 띠)"""
    r = Rectangle(width=w, height=h, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=3)
    band = Rectangle(width=w * 0.22, height=h, fill_color="#7FB3E8", fill_opacity=1, stroke_width=0).move_to(r)
    return VGroup(r, band)


def force_arrow(start, size=1.0, direction=RIGHT, color=RED):
    """힘 화살표: size가 클수록 길고 굵음(0.3 ~ 2)"""
    start = np.array(start, dtype=float)
    end = start + np.array(direction) * (0.7 + 1.1 * size)
    return Arrow(start, end, buff=0, color=color, stroke_width=8 + 14 * size,
                 max_tip_length_to_length_ratio=0.45, max_stroke_width_to_length_ratio=14)


def force_bar(value, vmax=1.0, length=4.0, height=0.42, color=RED):
    """막대(왼쪽 끝이 (0,0)) — 힘의 크기 비교용"""
    w = max(0.05, length * value / vmax)
    return Rectangle(width=w, height=height, fill_color=color, fill_opacity=1, stroke_width=0).move_to([w / 2, 0, 0])


def backpack(full=False, s=1.0):
    """책가방(아래 가운데가 (0,0)). full이면 불룩하고 책이 보임"""
    w, h = (1.35 if full else 1.15) * s, 1.45 * s
    bag = RoundedRectangle(corner_radius=0.3 * s, width=w, height=h, fill_color="#E0703A", fill_opacity=1,
                           stroke_color="#9B4520", stroke_width=5 * s).move_to([0, h / 2, 0])
    pocket = RoundedRectangle(corner_radius=0.15 * s, width=w * 0.62, height=h * 0.32, fill_color="#C95A28",
                              fill_opacity=1, stroke_width=0).move_to([0, h * 0.3, 0])
    strap = Arc(radius=0.32 * s, start_angle=0, angle=PI, stroke_color="#9B4520", stroke_width=8 * s).move_to([0, h + 0.15 * s, 0])
    g = VGroup(strap, bag, pocket)
    if full:
        for i, c in enumerate([BLUE, GREEN, ORANGE]):
            g.add(Rectangle(width=0.22 * s, height=0.5 * s, fill_color=c, fill_opacity=1, stroke_width=0)
                  .move_to([(-0.3 + 0.3 * i) * s, h - 0.05 * s, 0]))
        g[1].stretch(1.08, 0)
    return g


def cart(full=False, s=1.0):
    """마트 카트(바퀴 아래가 (0,0))"""
    basket = Polygon([-1.0, 1.55, 0], [1.05, 1.55, 0], [0.8, 0.55, 0], [-0.8, 0.55, 0],
                     stroke_color=INK, stroke_width=5, fill_color="#D8E4EE", fill_opacity=1)
    grid = VGroup(*[Line([x, 1.5, 0], [x * 0.8, 0.6, 0], stroke_color=SOFT, stroke_width=2) for x in np.linspace(-0.7, 0.7, 6)])
    handle = Line([-1.0, 1.55, 0], [-1.45, 1.9, 0], stroke_color=INK, stroke_width=6)
    frame = Line([-0.8, 0.55, 0], [-0.7, 0.22, 0], stroke_color=INK, stroke_width=5)
    frame2 = Line([0.8, 0.55, 0], [0.7, 0.22, 0], stroke_color=INK, stroke_width=5)
    wheels = VGroup(Circle(radius=0.14, fill_color=INK, fill_opacity=1, stroke_width=0).move_to([-0.6, 0.14, 0]),
                    Circle(radius=0.14, fill_color=INK, fill_opacity=1, stroke_width=0).move_to([0.6, 0.14, 0]))
    g = VGroup(handle, basket, grid, frame, frame2, wheels)
    if full:
        goods = VGroup(
            Rectangle(width=0.5, height=0.7, fill_color=RED, fill_opacity=1, stroke_width=0).move_to([-0.55, 1.75, 0]),
            Rectangle(width=0.45, height=0.9, fill_color=GREEN, fill_opacity=1, stroke_width=0).move_to([-0.05, 1.85, 0]),
            Circle(radius=0.28, fill_color=ORANGE, fill_opacity=1, stroke_width=0).move_to([0.45, 1.75, 0]),
            Rectangle(width=0.4, height=0.55, fill_color=BLUE, fill_opacity=1, stroke_width=0).move_to([0.75, 1.68, 0]),
        )
        g.add_to_back(goods)
    return g.scale(s, about_point=ORIGIN)


def dumbbell(s=1.0):
    """쇠 아령(아래 가운데가 (0,0))"""
    bar = Rectangle(width=1.0, height=0.14, fill_color="#8C939B", fill_opacity=1, stroke_width=0).move_to([0, 0.3, 0])
    w1 = RoundedRectangle(corner_radius=0.06, width=0.26, height=0.6, fill_color="#4A5058", fill_opacity=1, stroke_width=0).move_to([-0.55, 0.3, 0])
    w2 = w1.copy().move_to([0.55, 0.3, 0])
    return VGroup(bar, w1, w2).scale(s, about_point=ORIGIN)


def swing(rider_h=1.6, shirt=BLUE, x=0.0, top=2.6, seat_y=0.2):
    """그네: 위 막대에 매단 두 줄 + 앉은 사람. 막대 위치 top, 의자 높이 seat_y"""
    rope1 = Line([x - 0.45, top, 0], [x - 0.45, seat_y, 0], stroke_color=SOFT, stroke_width=4)
    rope2 = Line([x + 0.45, top, 0], [x + 0.45, seat_y, 0], stroke_color=SOFT, stroke_width=4)
    seat = Rectangle(width=1.1, height=0.12, fill_color=BROWN_DARK, fill_opacity=1, stroke_width=0).move_to([x, seat_y, 0])
    hp = rider_h * 1.6
    sc = hp / 2.6
    rider = person(hp, shirt, pose="sit")
    rider.shift([x - 0.15 * sc, seat_y + 0.06 - 0.9 * sc, 0])
    g = VGroup(rope1, rope2, seat, rider)
    g.pivot = np.array([x, top, 0])
    return g


def tag(text, color=INK, size=36, fill=PAPER):
    """둥근 이름표"""
    t = T(text, size, color)
    r = RoundedRectangle(corner_radius=0.18, width=t.width + 0.4, height=t.height + 0.3,
                         fill_color=fill, fill_opacity=1, stroke_color=color, stroke_width=3)
    t.move_to(r)
    return VGroup(r, t)


# ── 수평 잡기 판 ─────────────────────────────────────────────
class Board:
    """받침대 위 숫자 판(가운데 받침점, 양쪽 1~5번 칸). 판 위 물체는 판과 함께 기울어짐.
        bd = Board(center=[0, -0.6, 0]); scene.add(bd.stand, bd.plank)
        obj = bd.put(sq_block(), "L", 2)          # 왼쪽 2번 칸에 올림(판 그룹에 들어감)
        scene.play(bd.tilt_to(-0.18))            # 왼쪽이 내려감(+ 는 오른쪽이 내려감)
    """

    def __init__(self, center=(0, -0.6, 0), half=4.8, slots=5, numbers=True):
        from manim import Triangle
        self.c = np.array(center, dtype=float)
        self.half = half
        self.step = half / (slots + 0.5)
        self.angle = 0.0
        self.counts = {}
        plank = Rectangle(width=2 * half, height=0.2, fill_color="#D9B47A", fill_opacity=1,
                          stroke_color=BROWN_DARK, stroke_width=3).move_to(self.c + UP * 0.1)
        marks = VGroup()
        if numbers:
            for side in (-1, 1):
                for n in range(1, slots + 1):
                    x = self.c[0] + side * n * self.step
                    marks.add(Line([x, self.c[1], 0], [x, self.c[1] + 0.2, 0], stroke_color=BROWN_DARK, stroke_width=2))
                    marks.add(T(str(n), 26, BROWN_DARK).move_to([x, self.c[1] - 0.22, 0]))
        self.plank = VGroup(plank, marks)
        tri = Triangle(fill_color=SOFT, fill_opacity=1, stroke_width=0).scale(0.55)
        tri.move_to(self.c + DOWN * (tri.height / 2))
        base = Rectangle(width=2.2, height=0.14, fill_color=SOFT, fill_opacity=1, stroke_width=0).next_to(tri, DOWN, buff=0)
        self.stand = VGroup(tri, base)
        self.pivot = self.c + DOWN * 0.0

    def x_of(self, side, n):
        return self.c[0] + (-1 if side == "L" else 1) * n * self.step

    def put(self, mob, side, n):
        """물체를 칸 위에 올리고(쌓이면 위로) 판 그룹에 넣음 — 판이 수평일 때 부를 것"""
        k = self.counts.get((side, n), 0)
        top = self.c[1] + 0.2
        h = mob.height
        mob.move_to([self.x_of(side, n), top + h / 2 + k * h, 0])
        self.counts[(side, n)] = k + 1
        mob.slot = (side, n)
        self.plank.add(mob)
        return mob

    def lift(self, mob):
        """판 그룹에서 빼기(옮기기 전에)"""
        self.counts[mob.slot] -= 1
        self.plank.remove(mob)

    def tilt_to(self, angle, run_time=1.0):
        from manim import Rotate
        d = angle - self.angle
        self.angle = angle
        return Rotate(self.plank, -d, about_point=self.pivot, run_time=run_time)


def sq_block(color=ORANGE, s=0.55):
    """나무 블록(같은 무게 물체)"""
    return RoundedRectangle(corner_radius=0.06, width=s, height=s, fill_color=color, fill_opacity=1,
                            stroke_color=INK, stroke_width=3)


def fruit(kind="apple", s=1.0):
    """귤·사과 그림(가운데가 (0,0))"""
    if kind == "apple":
        body = Circle(radius=0.36 * s, fill_color=RED, fill_opacity=1, stroke_color="#8E2A22", stroke_width=3)
        leaf = Ellipse(width=0.22 * s, height=0.12 * s, fill_color=GREEN, fill_opacity=1, stroke_width=0).move_to([0.12 * s, 0.4 * s, 0])
        stem = Line([0, 0.3 * s, 0], [0.02 * s, 0.45 * s, 0], stroke_color=BROWN_DARK, stroke_width=4)
        return VGroup(body, stem, leaf)
    body = Circle(radius=0.28 * s, fill_color=ORANGE, fill_opacity=1, stroke_color="#B25E08", stroke_width=3)
    dot = Dot([0, 0.24 * s, 0], radius=0.04 * s, color=GREEN)
    return VGroup(body, dot)
