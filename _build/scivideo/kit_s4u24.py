"""4-2 4단원 「기후변화와 우리 생활」 전용 그림 부품 (s4ep31~34, s4mm07)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit().
  날씨: sun_hot · snowflake · rain_cloud · snow_cloud · cracked_land · thermo(높이 0~1) · weather_pic(이름)
  자료: bar_chart(값 목록, 이름 목록) — .bars / .vals / .labels / .axis
  지도: world_map() — 앱 u4-1 지도의 대륙 좌표(경도·위도)를 그대로 옮김, .pin(경도, 위도)
  사람 활동: house · factory(연기) · car · plane · tree · stump · fire · tv · lamp · tap · boxes · trash_pile · heater_window
  모형실험: SeaTank(앱 u4-3 장치 좌표를 그대로 옮김) — 섬·집·나무 모형, 자갈(육지), 물(바닷물) 높이 LV
  빙하: glacier_scene(빙하가 큼/작음)
  대응: solar_panel · turbine · plug · tumbler · shelter · eco_car · bike
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU, WHITE,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, VGroup, VMobject, DashedLine)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK
from kit_s3u12 import fit, E, C, L, poly, smooth, text_card  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401
import kit_s3u22 as A22
from kit_s4u23 import kid, pic_card  # noqa: F401

SW = 4
LEAF = "#5FAE4A"
LEAF_D = "#2F6A2A"
TRUNK = "#8A5A2B"
SKY = "#D6EFFA"
SEA = "#3F8FC4"
SEA_L = "#8CCBEC"
SAND = "#E9C27A"
GRAVEL = "#B9A68A"
GRAVEL_D = "#9C8A70"
HOT = "#E2573F"
COLD = "#3A86C8"
WET = "#6B3FA0"
DRY = "#B07A2A"
GRAY = "#8F9AA3"
SMOKE = "#8A8A8A"
YEL = "#FFC93C"


def R(w, h, fill, x=0, y=0, rad=0.12, stroke=INK, sw=SW, op=1.0):
    return RoundedRectangle(corner_radius=max(1e-3, min(rad, w / 2 - 1e-3, h / 2 - 1e-3)), width=w, height=h,
                            fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


def rect(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0):
    return Rectangle(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke,
                     stroke_width=sw).move_to([x, y, 0])


# ══════════════ 날씨 그림 ══════════════
def sun_hot(r=0.55):
    g = VGroup()
    for i in range(10):
        a = i * TAU / 10
        g.add(Line([np.cos(a) * r * 1.25, np.sin(a) * r * 1.25, 0], [np.cos(a) * r * 1.75, np.sin(a) * r * 1.75, 0],
                   stroke_color="#F08A1C", stroke_width=7))
    g.add(Circle(radius=r, fill_color="#FFB02E", fill_opacity=1, stroke_color="#D9731A", stroke_width=4))
    return g


def snowflake(r=0.6, col=COLD):
    g = VGroup()
    for i in range(6):
        a = i * TAU / 6 + PI / 2
        d = np.array([np.cos(a), np.sin(a), 0])
        g.add(Line(ORIGIN, d * r, stroke_color=col, stroke_width=7))
        for s in (1, -1):
            b = a + s * 0.7
            p = d * r * 0.6
            g.add(Line(p, p + np.array([np.cos(b), np.sin(b), 0]) * r * 0.3, stroke_color=col, stroke_width=6))
    return g


def cloud(w=1.8, col="#9DB0BE"):
    g = VGroup(E(0.9, 0.6, col, -0.4, -0.05, stroke=INK, sw=3), E(1.0, 0.85, col, 0.1, 0.12, stroke=INK, sw=3),
               E(0.85, 0.6, col, 0.55, -0.05, stroke=INK, sw=3),
               Rectangle(width=1.5, height=0.32, fill_color=col, fill_opacity=1, stroke_width=0).move_to([0.08, -0.16, 0]))
    return fit(g, w, w)


def rain_cloud(w=1.8):
    c = cloud(w)
    drops = VGroup(*[Line([x, -0.3, 0], [x - 0.12, -0.75, 0], stroke_color=COLD, stroke_width=6).shift(DOWN * (0.15 * (i % 2)))
                     for i, x in enumerate(np.linspace(-0.6, 0.6, 5))])
    drops.next_to(c, DOWN, buff=0.05)
    return VGroup(c, drops)


def snow_cloud(w=1.8):
    c = cloud(w, "#C9D3DB")
    fl = VGroup(*[snowflake(0.16, "#5A8FC8").move_to([x, -0.6 - 0.2 * (i % 2), 0]) for i, x in enumerate(np.linspace(-0.6, 0.6, 4))])
    fl.next_to(c, DOWN, buff=0.08)
    return VGroup(c, fl)


def cracked_land(w=2.2):
    land = R(2.2, 0.9, "#D6A964", 0, 0, rad=0.1, stroke=BROWN_DARK, sw=3)
    cr = VGroup(
        smooth([(-0.9, 0.3), (-0.6, 0.0), (-0.7, -0.35)], BROWN_DARK, 4),
        smooth([(-0.2, 0.4), (0.0, 0.05), (0.25, -0.1), (0.2, -0.4)], BROWN_DARK, 4),
        smooth([(0.5, 0.35), (0.7, 0.05), (0.95, -0.2)], BROWN_DARK, 4),
        smooth([(0.0, 0.05), (-0.3, -0.25)], BROWN_DARK, 3))
    sprout = VGroup(L((0.0, 0.45), (0.0, 0.85), "#9A8A40", 5), L((0.0, 0.7), (-0.18, 0.85), "#9A8A40", 4),
                    L((0.0, 0.7), (0.18, 0.85), "#9A8A40", 4)).shift(LEFT * 0.55)
    s = sun_hot(0.25).move_to([0.75, 0.95, 0])
    return fit(VGroup(land, cr, sprout, s), w, w)


def flood_pic(w=2.2):
    h1 = house(0.9, "#E8C39E", "#B8452F").move_to([-0.45, 0.05, 0])
    h2 = house(0.75, "#F1E1C6", "#6B3FA0").move_to([0.5, 0.0, 0])
    water = R(2.3, 0.55, "#5D8FB3", 0, -0.35, rad=0.05, stroke="#3F6F93", sw=3, op=0.92)
    r = VGroup(*[Line([x, 1.05, 0], [x - 0.1, 0.75, 0], stroke_color=COLD, stroke_width=5) for x in np.linspace(-0.9, 0.9, 6)])
    return fit(VGroup(h1, h2, water, r), w, w)


def thermo(level=0.5, col=HOT, h=1.8):
    tube = R(0.32, h, PAPER, 0, 0, rad=0.16, stroke=INK, sw=4)
    bulb = Circle(radius=0.28, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([0, -h / 2, 0])
    fill_h = max(0.05, (h - 0.3) * level)
    liq = Rectangle(width=0.16, height=fill_h, fill_color=col, fill_opacity=1, stroke_width=0)
    liq.move_to([0, -h / 2 + fill_h / 2, 0])
    ticks = VGroup(*[L((0.16, y), (0.3, y), INK, 3) for y in np.linspace(-h / 2 + 0.35, h / 2 - 0.25, 5)])
    return VGroup(tube, liq, bulb, ticks)


def weather_pic(name, w=2.0):
    """폭염 · 한파 · 홍수 · 폭설 · 가뭄 그림"""
    if name == "폭염":
        g = VGroup(sun_hot(0.5).move_to([-0.35, 0.1, 0]), thermo(0.95, HOT, 1.5).move_to([0.75, 0.0, 0]))
    elif name == "한파":
        g = VGroup(snowflake(0.55).move_to([-0.35, 0.1, 0]), thermo(0.12, COLD, 1.5).move_to([0.75, 0.0, 0]))
    elif name == "홍수":
        g = flood_pic(2.2)
    elif name == "폭설":
        g = VGroup(snow_cloud(1.8), R(2.0, 0.35, WHITE, 0, -1.05, rad=0.15, stroke="#9DB0BE", sw=3))
    else:
        g = cracked_land(2.2)
    return fit(g, w, w * 0.8)


# ══════════════ 막대그래프 ══════════════
def bar_chart(vals, labels, vmax=20, step=5, w=8.0, h=3.6, col=HOT, unit="", ylabel="", size=26):
    """막대그래프: 아래 왼쪽 모서리가 (0, 0). .bars(완성 높이) .vals .labels .axis .zero(막대 밑 y)"""
    n = len(vals)
    g = VGroup()
    grid = VGroup()
    for v in range(0, vmax + 1, step):
        y = v / vmax * h
        grid.add(Line([0, y, 0], [w, y, 0], stroke_color="#C9D6DF", stroke_width=2))
        grid.add(T(str(v), size - 2, SOFT).move_to([-0.35, y, 0]))
    axis = VGroup(Line([0, 0, 0], [w, 0, 0], stroke_color=INK, stroke_width=4),
                  Line([0, 0, 0], [0, h + 0.2, 0], stroke_color=INK, stroke_width=4))
    gap = w / n
    bars, vtx, lbs = VGroup(), VGroup(), VGroup()
    for i, (v, lb) in enumerate(zip(vals, labels)):
        x = gap * (i + 0.5)
        bh = max(0.02, v / vmax * h)
        b = Rectangle(width=gap * 0.55, height=bh, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3)
        b.move_to([x, bh / 2, 0])
        bars.add(b)
        vtx.add(T(f"{v}{unit}", size + 4, INK).next_to(b, UP, buff=0.1))
        lbs.add(T(lb, size - 2, INK).move_to([x, -0.35, 0]))
    g.add(grid, axis, bars, vtx, lbs)
    if ylabel:
        yl = T(ylabel, size - 4, SOFT).next_to(axis[1], UP, buff=0.12).align_to(axis[1], LEFT)
        g.add(yl)
    g.bars, g.vals, g.labels, g.axis, g.grid = bars, vtx, lbs, axis, grid
    return g


# ══════════════ 세계 지도 (앱 u4-1의 대륙 좌표) ══════════════
LAND = [
    [(-168, 66), (-140, 70), (-95, 72), (-80, 63), (-62, 56), (-65, 45), (-76, 35), (-81, 25), (-90, 29), (-97, 26), (-97, 18), (-88, 15), (-79, 8), (-92, 15), (-105, 20), (-112, 30), (-118, 33), (-124, 40), (-125, 49), (-135, 58), (-150, 60), (-165, 60)],
    [(-55, 82), (-25, 83), (-20, 72), (-42, 60), (-55, 68)],
    [(-79, 9), (-62, 10), (-50, 0), (-35, -6), (-40, -22), (-55, -35), (-68, -55), (-75, -48), (-72, -30), (-81, -5)],
    [(-10, 36), (-9, 44), (-2, 48), (-4, 54), (5, 58), (8, 63), (14, 70), (30, 71), (40, 66), (40, 45), (28, 40), (20, 40), (18, 45), (12, 44), (16, 38), (10, 40), (0, 40)],
    [(-6, 50), (2, 51), (0, 58), (-6, 58)],
    [(-17, 21), (-10, 35), (10, 37), (32, 31), (43, 12), (51, 12), (40, -5), (40, -15), (33, -26), (20, -35), (13, -20), (9, 0), (-8, 4), (-17, 14)],
    [(40, 45), (40, 66), (60, 70), (100, 77), (140, 72), (178, 68), (170, 60), (155, 58), (140, 50), (131, 43), (129, 35), (126, 35), (125, 39), (121, 40), (121, 30), (110, 20), (106, 10), (100, 13), (98, 8), (92, 22), (80, 15), (77, 8), (72, 20), (66, 25), (57, 25), (52, 12), (43, 12), (35, 30), (36, 36), (28, 40)],
    [(130, 31), (141, 36), (142, 44), (140, 40), (134, 34)],
    [(114, -22), (130, -12), (137, -12), (142, -11), (146, -19), (153, -28), (150, -37), (140, -38), (132, -32), (115, -34)],
]


class WorldMap(VGroup):
    """가로 W 지도(경도 −180~180, 위도 84~−66). .pt(경도, 위도) → 화면 좌표"""

    def __init__(self, W=11.0):
        super().__init__()
        self.W = W
        self.H = W * 380 / 800
        self.sea = R(self.W, self.H, "#CFEAF9", 0, 0, rad=0.2, stroke="#7FAFCB", sw=3)
        self.add(self.sea)
        for ln in LAND:
            self.add(Polygon(*[self._raw(lo, la) for lo, la in ln], fill_color="#B9DCA0", fill_opacity=1,
                             stroke_color="#7FAE6A", stroke_width=3))

    def _raw(self, lo, la):
        x = (lo + 180) / 360 * self.W - self.W / 2
        y = self.H / 2 - (84 - la) / 150 * self.H * 380 / 380
        return np.array([x, y, 0])

    def pt(self, lo, la):
        # 지도를 옮긴 뒤에도 맞게: 바다 판의 왼쪽 위 기준
        ul = self.sea.get_corner(UP + LEFT)
        x = ul[0] + (lo + 180) / 360 * self.sea.width
        y = ul[1] - (84 - la) / 150 * self.sea.height
        return np.array([x, y, 0])


def pin(col=HOT, r=0.13):
    return Circle(radius=r, fill_color=col, fill_opacity=1, stroke_color=WHITE, stroke_width=5)


def sticker(name, col, size=24):
    t = T(name, size, WHITE)
    b = R(t.width + 0.3, t.height + 0.2, col, rad=0.12, stroke=WHITE, sw=3)
    t.move_to(b)
    return VGroup(b, t)


# ══════════════ 사람의 활동 ══════════════
def house(w=1.4, wall="#F1E1C6", roof="#B8452F"):
    body = rect(w, w * 0.72, wall, 0, 0, sw=3)
    rf = poly([(-w * 0.6, w * 0.36), (0, w * 0.8), (w * 0.6, w * 0.36)], roof, INK, 3)
    win = rect(w * 0.24, w * 0.22, "#9CC7E6", -w * 0.22, w * 0.05, sw=2)
    door = rect(w * 0.2, w * 0.36, "#A0673A", w * 0.22, -w * 0.18, sw=2)
    return VGroup(body, rf, win, door)


def smoke(n=4, s=0.18, col=SMOKE):
    return VGroup(*[Circle(radius=s * (1 + 0.35 * i), fill_color=col, fill_opacity=0.75 - 0.12 * i, stroke_width=0)
                    .move_to([0.18 * i, 0.32 * i * (1 + 0.15 * i), 0]) for i in range(n)])


def factory(with_smoke=True):
    base = rect(2.4, 1.0, "#A3ADB5", 0, -0.2, sw=3)
    saw = poly([(-1.2, 0.3), (-0.8, 0.65), (-0.8, 0.3), (-0.4, 0.65), (-0.4, 0.3), (0.0, 0.65), (0.0, 0.3)], "#6F7A83", INK, 3)
    ch1 = rect(0.24, 0.9, "#5B646B", 0.5, 0.75, sw=3)
    ch2 = rect(0.24, 1.2, "#5B646B", 0.95, 0.9, sw=3)
    wins = VGroup(*[rect(0.28, 0.22, "#FFE28A", -0.85 + 0.45 * i, -0.25, sw=2) for i in range(5)])
    g = VGroup(base, saw, ch1, ch2, wins)
    if with_smoke:
        g.smoke = VGroup(smoke().move_to(ch1.get_top() + UP * 0.55 + RIGHT * 0.25),
                         smoke().move_to(ch2.get_top() + UP * 0.55 + RIGHT * 0.25))
        g.add(g.smoke)
    return g


def car(col=COLD, w=1.4, exhaust=False):
    body = R(w, w * 0.3, col, 0, 0, rad=0.12, sw=3)
    top = R(w * 0.55, w * 0.25, col, -w * 0.02, w * 0.24, rad=0.1, sw=3)
    win = R(w * 0.42, w * 0.15, "#CFE8F7", -w * 0.02, w * 0.25, rad=0.05, sw=2)
    wh = VGroup(C(w * 0.11, "#333333", -w * 0.28, -w * 0.15, sw=2), C(w * 0.11, "#333333", w * 0.28, -w * 0.15, sw=2))
    g = VGroup(body, top, win, wh)
    if exhaust:
        g.add(VGroup(*[Circle(radius=0.08 + 0.05 * i, fill_color=SMOKE, fill_opacity=0.7 - 0.15 * i, stroke_width=0)
                       .move_to([-w * 0.55 - 0.18 * i, -w * 0.05 + 0.05 * i, 0]) for i in range(3)]))
    return g


def plane(w=1.6):
    body = R(w, w * 0.18, "#DFE7EE", 0, 0, rad=0.14, stroke="#5B646B", sw=3)
    wing = poly([(-0.1 * w, 0), (0.12 * w, 0), (-0.1 * w, -0.4 * w), (-0.22 * w, -0.4 * w)], "#B5C3CF", "#5B646B", 3)
    wing2 = poly([(-0.1 * w, 0), (0.08 * w, 0), (-0.12 * w, 0.32 * w), (-0.22 * w, 0.32 * w)], "#B5C3CF", "#5B646B", 3)
    tail = poly([(-0.42 * w, 0.05 * w), (-0.5 * w, 0.3 * w), (-0.38 * w, 0.3 * w), (-0.3 * w, 0.05 * w)], "#B5C3CF", "#5B646B", 3)
    return VGroup(wing2, tail, body, wing)


def tree(h=1.4, col="#3F9A4A"):
    trunk = rect(0.16 * h, 0.42 * h, TRUNK, 0, 0.21 * h, sw=3)
    crown = Circle(radius=0.36 * h, fill_color=col, fill_opacity=1, stroke_color=LEAF_D, stroke_width=3).move_to([0, 0.72 * h, 0])
    g = VGroup(trunk, crown)
    g.base_y = 0.0
    return g


def stump(h=1.4):
    return VGroup(rect(0.2 * h, 0.16 * h, TRUNK, 0, 0.08 * h, sw=3),
                  Ellipse(width=0.2 * h, height=0.07 * h, fill_color="#D9A066", fill_opacity=1, stroke_color=INK, stroke_width=2)
                  .move_to([0, 0.16 * h, 0]))


def fire(s=1.0):
    outer = smooth([(-0.35, 0), (-0.4, 0.35), (-0.15, 0.55), (-0.1, 0.9), (0.15, 0.6), (0.3, 0.75), (0.4, 0.35), (0.35, 0), (-0.35, 0)], "#E2573F", 3)
    outer.set_fill("#FF8A3C", 1)
    inner = smooth([(-0.18, 0), (-0.2, 0.25), (0.0, 0.5), (0.12, 0.3), (0.2, 0.2), (0.18, 0), (-0.18, 0)], "#FFD34D", 2)
    inner.set_fill("#FFD34D", 1)
    return VGroup(outer, inner).scale(s)


def forest(n=7, w=5.0, h=1.2, seed=1):
    rng = np.random.default_rng(seed)
    g = VGroup()
    for i in range(n):
        t = tree(h * (0.9 + 0.2 * rng.random()), "#3F9A4A" if i % 2 else "#5CB85C")
        t.move_to([-w / 2 + w * (i + 0.5) / n, 0, 0], aligned_edge=DOWN)
        g.add(t)
    return g


def tv(on=True):
    frame = R(1.3, 0.85, "#2A3A46", 0, 0.1, rad=0.08, sw=3)
    scr = rect(1.1, 0.65, "#6EC3F0" if on else "#44525C", 0, 0.1, sw=0)
    leg = VGroup(L((-0.3, -0.33), (-0.4, -0.5), INK, 5), L((0.3, -0.33), (0.4, -0.5), INK, 5))
    return VGroup(leg, frame, scr)


def lamp(on=True):
    bulb = Circle(radius=0.3, fill_color="#FFE28A" if on else "#E5E5E5", fill_opacity=1, stroke_color="#B58400", stroke_width=3)
    base = rect(0.22, 0.2, "#888888", 0, -0.35, sw=2)
    g = VGroup(base, bulb)
    if on:
        for a in (0.3, 0.9, 1.57, 2.24, 2.84):
            g.add(Line([np.cos(a) * 0.4, np.sin(a) * 0.4, 0], [np.cos(a) * 0.6, np.sin(a) * 0.6, 0], stroke_color="#FFC93C", stroke_width=5))
    return g


def tap(running=True):
    pipe = VGroup(L((-0.6, 0.5), (0.1, 0.5), "#8AA0A8", 12), L((0.1, 0.5), (0.1, 0.25), "#8AA0A8", 12))
    sink = R(1.3, 0.35, WHITE, 0, -0.55, rad=0.12, stroke="#8AA0A8", sw=4)
    g = VGroup(pipe, sink)
    if running:
        g.add(DashedLine([0.1, 0.2, 0], [0.1, -0.4, 0], stroke_color="#5AA9E6", stroke_width=8, dash_length=0.1))
    return g


def boxes(n=6):
    g = VGroup()
    for i in range(n):
        g.add(rect(0.5, 0.4, "#D9A066", -0.55 + 0.55 * (i % 3), -0.3 + 0.42 * (i // 3), stroke=BROWN_DARK, sw=3))
    return g


def trash_pile():
    g = VGroup(poly([(-0.7, -0.3), (-0.4, 0.1), (-0.1, -0.05), (0.2, 0.25), (0.6, -0.05), (0.75, -0.3)], "#C9B27A", BROWN_DARK, 3),
               C(0.13, HOT, -0.3, -0.12, sw=2), rect(0.18, 0.32, "#9CC7E6", 0.35, -0.08, sw=2),
               poly([(-0.05, -0.2), (0.1, 0.05), (0.2, -0.2)], "#EDEDED", INK, 2))
    return g


def heater_window():
    win = rect(0.9, 0.9, "#BFE6FB", -0.6, 0.15, stroke=BROWN_DARK, sw=3)
    sash = poly([(-1.05, 0.6), (-1.35, 0.45), (-1.35, -0.45), (-1.05, -0.3)], "#E7F6FD", BROWN_DARK, 3)
    wind = VGroup(smooth([(-0.9, 0.3), (-0.6, 0.38), (-0.35, 0.3)], "#7FB6D8", 4), smooth([(-0.85, 0.0), (-0.55, 0.08), (-0.3, 0.0)], "#7FB6D8", 4))
    heater = R(0.55, 0.7, HOT, 0.6, -0.15, rad=0.08, sw=3)
    bars = VGroup(*[L((0.42, y), (0.78, y), YEL, 4) for y in (0.0, -0.15, -0.3)])
    heat = VGroup(smooth([(0.5, 0.3), (0.56, 0.45), (0.5, 0.6)], HOT, 3), smooth([(0.7, 0.3), (0.76, 0.45), (0.7, 0.6)], HOT, 3))
    return VGroup(win, sash, wind, heater, bars, heat)


# ══════════════ 빙하 ══════════════
def glacier_scene(big=True, w=4.0):
    sky = R(4.0, 2.2, "#CFE8F7", 0, 0, rad=0.12, stroke=SOFT, sw=3)
    mt = poly([(-2.0, -1.1), (-2.0, -0.1), (-1.3, 0.7), (-0.7, 0.0), (-0.1, 0.8), (0.6, 0.1), (1.2, 0.6), (2.0, -0.1), (2.0, -1.1)],
              "#8A8F96", INK, 3)
    caps = VGroup(poly([(-1.3, 0.7), (-1.15, 0.52), (-1.45, 0.52)], WHITE, INK, 2),
                  poly([(-0.1, 0.8), (0.07, 0.6), (-0.27, 0.6)], WHITE, INK, 2),
                  poly([(1.2, 0.6), (1.34, 0.44), (1.06, 0.44)], WHITE, INK, 2))
    g = VGroup(sky, mt, caps)
    if big:
        gl = smooth([(-0.9, -1.1), (-0.8, -0.4), (-0.5, -0.05), (-0.1, 0.12), (0.3, -0.05), (0.62, -0.4), (0.8, -1.1)], "#9CC7E6", 4)
        gl.set_fill("#EEF8FF", 1)
        g.add(gl, smooth([(-0.5, -0.5), (-0.1, -0.4), (0.3, -0.5)], "#BCDCF0", 3), smooth([(-0.6, -0.8), (-0.1, -0.7), (0.5, -0.8)], "#BCDCF0", 3))
    else:
        val = smooth([(-0.9, -1.1), (-0.7, -0.65), (-0.35, -0.55), (0.0, -0.5), (0.35, -0.55), (0.62, -0.7), (0.8, -1.1)], INK, 3)
        val.set_fill("#8F9A85", 1)
        g.add(val, Ellipse(width=0.42, height=0.16, fill_color="#EEF8FF", fill_opacity=1, stroke_color="#9CC7E6", stroke_width=3).move_to([0.0, -0.3, 0]),
              Ellipse(width=1.0, height=0.2, fill_color="#6EC3F0", fill_opacity=1, stroke_width=0).move_to([0.0, -0.95, 0]))
    return fit(g, w, w * 0.6)


# ══════════════ 해수면 상승 모형실험 (앱 u4-3 좌표, 800×(90~340) 그림) ══════════════
class SeaTank:
    """앱의 tank(): 상자 x 60~740, 바닥 330, 위 160. 자갈은 x 300~740, 겉면 y = 330 − (x − 300) × 0.295.
    물 높이 LV = 308(처음) · 272(한 컵) · 246(두 컵) · 215(세 컵)."""
    LV = [308, 272, 246, 215]

    def __init__(self, s=0.0145, cx=0.0, cy=0.0):
        self.s, self.cx, self.cy = s, cx, cy

    def p(self, x, y):
        return np.array([self.cx + (x - 400) * self.s, self.cy + (245 - y) * self.s, 0])

    def gy(self, x):
        return 330 - (x - 300) * 0.295

    def box(self):
        a, b = self.p(60, 160), self.p(740, 330)
        return Rectangle(width=b[0] - a[0], height=a[1] - b[1], fill_color="#F4FBFF", fill_opacity=1,
                         stroke_color="#7FAFCB", stroke_width=6).move_to((a + b) / 2)

    def gravel(self):
        pts = [self.p(300, 330)] + [self.p(x, self.gy(x)) for x in range(300, 741, 20)] + [self.p(740, 330)]
        poly_ = Polygon(*pts, fill_color=GRAVEL, fill_opacity=1, stroke_color=GRAVEL_D, stroke_width=3)
        dots = VGroup()
        for x in range(312, 735, 22):
            y = self.gy(x) + 10
            k = 0
            while y < 326:
                dots.add(Circle(radius=5 * self.s, fill_color=GRAVEL_D if (x + k) % 2 else "#CBB99B", fill_opacity=1, stroke_width=0)
                         .move_to(self.p(x + (k % 2) * 6, y)))
                y += 14
                k += 1
        return VGroup(poly_, dots)

    def island(self):
        sand = VMobject(fill_color="#C9A36B", fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3)
        sand.set_points_smoothly([self.p(100, 330), self.p(118, 262), self.p(165, 222), self.p(212, 262), self.p(230, 330)])
        sand.add_line_to(self.p(100, 330))
        trunk = Line(self.p(165, 222), self.p(165, 188), stroke_color=TRUNK, stroke_width=7)
        lv = VGroup(*[smooth([tuple(self.p(165, 190)[:2]), tuple(self.p(165 + dx * 0.5, 180 + dy * 0.3)[:2]), tuple(self.p(165 + dx, 194 + dy)[:2])], "#3F9A4A", 7)
                      for dx, dy in ((-34, 0), (34, 0), (-20, -18), (20, -18))])
        return VGroup(sand, trunk, lv)

    def house(self):
        b = self.gy(430)
        a, c = self.p(404, b - 40), self.p(456, b)
        wall = Rectangle(width=c[0] - a[0], height=a[1] - c[1], fill_color="#F1E1C6", fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3).move_to((a + c) / 2)
        w1 = Rectangle(width=13 * self.s, height=12 * self.s, fill_color="#9CC7E6", fill_opacity=1, stroke_width=2, stroke_color=INK).move_to(self.p(417.5, b - 28))
        w2 = w1.copy().move_to(self.p(442.5, b - 28))
        rf = Polygon(self.p(398, b - 40), self.p(430, b - 80), self.p(462, b - 40), fill_color="#B8452F", fill_opacity=1, stroke_color=INK, stroke_width=3)
        return VGroup(wall, w1, w2, rf)

    def tree(self):
        b = self.gy(482)
        trunk = Rectangle(width=8 * self.s, height=44 * self.s, fill_color=TRUNK, fill_opacity=1, stroke_width=2, stroke_color=INK).move_to(self.p(482, b - 22))
        crown = Circle(radius=22 * self.s, fill_color="#3F9A4A", fill_opacity=1, stroke_color=LEAF_D, stroke_width=3).move_to(self.p(482, b - 58))
        return VGroup(trunk, crown)

    def water(self, y):
        a, b = self.p(62, y), self.p(738, 328)
        body = Rectangle(width=b[0] - a[0], height=max(0.01, a[1] - b[1]), fill_color="#3A9AD9", fill_opacity=0.42,
                         stroke_width=0).move_to((a + b) / 2)
        top = Line(self.p(62, y), self.p(738, y), stroke_color="#1C6FA8", stroke_width=5)
        return VGroup(body, top)

    def mark(self, y, label):
        ln = Line(self.p(740, y), self.p(770, y), stroke_color=RED, stroke_width=5)
        t = T(label, 22, RED).next_to(ln, RIGHT, buff=0.08)
        return VGroup(ln, t)

    def dry_line(self, y):
        """물에 닿지 않는 자갈 겉면(초록 굵은 선) — 자갈 겉면이 물 높이 y보다 위인 곳"""
        x0 = 300 + (330 - y) / 0.295
        pts = [self.p(x, self.gy(x)) for x in np.linspace(x0, 740, 12)]
        v = VMobject(stroke_color=GREEN, stroke_width=10)
        v.set_points_as_corners(pts)
        return v


# ══════════════ 대응 ══════════════
def solar_panel(w=1.8):
    pan = poly([(-0.9, 0.0), (0.7, 0.0), (0.9, 0.7), (-0.7, 0.7)], "#2F5FA8", INK, 3)
    grid = VGroup(*[L((-0.9 + 0.4 * i, 0.0), (-0.7 + 0.4 * i, 0.7), "#9CC7E6", 2) for i in range(1, 4)],
                  L((-0.8, 0.35), (0.8, 0.35), "#9CC7E6", 2))
    leg = VGroup(L((-0.3, 0.0), (-0.3, -0.5), INK, 5), L((0.4, 0.0), (0.4, -0.5), INK, 5))
    s = sun_hot(0.22).move_to([0.75, 1.15, 0])
    return fit(VGroup(leg, pan, grid, s), w, w)


def turbine(w=1.6):
    return fit(A22.wind_turbine(1.0), w * 0.8, w)


def plug(pulled=True):
    socket = R(0.7, 0.9, WHITE, -0.6, 0, rad=0.1, stroke=INK, sw=3)
    holes = VGroup(Dot([-0.6, 0.12, 0], radius=0.06, color=INK), Dot([-0.6, -0.12, 0], radius=0.06, color=INK))
    head = R(0.45, 0.5, "#EDEDED", 0.15 if pulled else -0.2, 0, rad=0.08, stroke=INK, sw=3)
    cord = smooth([(0.38 if pulled else 0.03, 0.0), (0.8, 0.1), (1.1, -0.3)], INK, 5)
    return VGroup(socket, holes, head, cord)


def tumbler():
    cup = poly([(-0.35, 0.6), (0.35, 0.6), (0.28, -0.6), (-0.28, -0.6)], "#7FC4A4", INK, 3)
    lid = R(0.8, 0.18, "#2E7D5B", 0, 0.68, rad=0.06, sw=3)
    band = rect(0.62, 0.18, WHITE, 0, 0.0, sw=2)
    return VGroup(cup, lid, band)


def tooth_cup():
    cup = poly([(-0.32, 0.45), (0.32, 0.45), (0.26, -0.45), (-0.26, -0.45)], "#9CC7E6", INK, 3)
    brush = VGroup(L((0.1, 0.3), (0.3, 1.0), "#E2573F", 7), R(0.14, 0.24, WHITE, 0.32, 1.05, rad=0.04, sw=2))
    return VGroup(brush, cup)


def shelter():
    roof = poly([(-1.0, 0.55), (1.0, 0.55), (0.8, 0.85), (-0.8, 0.85)], "#3A86C8", INK, 3)
    posts = VGroup(rect(0.1, 1.0, "#666666", -0.8, 0.05, sw=2), rect(0.1, 1.0, "#666666", 0.8, 0.05, sw=2))
    bench = rect(1.3, 0.12, TRUNK, 0, -0.15, sw=2)
    s = sun_hot(0.22).move_to([1.2, 1.25, 0])
    return VGroup(s, posts, bench, roof)


def eco_car(w=1.4):
    c = car(GREEN, w)
    leaf = Ellipse(width=0.36, height=0.2, fill_color="#9CE08A", fill_opacity=1, stroke_color=LEAF_D, stroke_width=2).rotate(0.5)
    leaf.move_to(c[0].get_center() + RIGHT * w * 0.2)
    return VGroup(c, leaf)


def bike(w=1.6):
    return fit(A22.bike(1.0), w, w)


def green_wall(w=6.0):
    """사막에 심은 숲의 띠(녹색 장벽)"""
    desert = R(w, 1.6, "#F0D7A0", 0, 0, rad=0.15, stroke=SOFT, sw=3)
    dunes = VGroup(smooth([(-w / 2 + 0.2, 0.25), (-1.5, 0.45), (-0.5, 0.25)], "#D9B26A", 4),
                   smooth([(0.6, 0.35), (1.6, 0.55), (w / 2 - 0.2, 0.3)], "#D9B26A", 4))
    belt = forest(14, w - 0.6, 0.55, seed=3).move_to([0, -0.45, 0], aligned_edge=DOWN)
    belt.shift(DOWN * 0.15)
    s = sun_hot(0.25).move_to([w / 2 - 0.6, 0.45, 0])
    return VGroup(desert, dunes, s, belt)


def lines(text, size=26, col=INK, bold=True, buff=0.12):
    """줄바꿈(\\n)이 있는 글을 줄마다 따로 만들어 가운데 맞춤(Text의 줄 간격이 좁아 글자가 겹치는 것을 피함)"""
    return VGroup(*[T(s, size, col, bold=bold) for s in text.split("\n")]).arrange(DOWN, buff=buff)
