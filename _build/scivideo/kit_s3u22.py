"""3학년 2학기 2단원 「지구의 모습」 전용 그림 부품 (s3ep24~29, s3mm06)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 (0, 0).
  대기: earth(지구, atmo=대기 띠) · plastic_bag(부푼 비닐봉지) · fan(부채) · cloud · kite · hot_balloon ·
        wind_turbine · sailboat · bike · ball · tree_s(나무) · sun_s
  지구 표면: sticker_grid(지구본 펼친 붙임딱지 칸, 육지 42 · 바다 98) · surface_pic(산·들·강·호수·바다·빙하·사막·계곡·갯벌)
  바닷물: beaker · evap_dish(증발 접시, residue) · hot_plate · cup_grid(물 100컵)
  바닷가 지형: landform(넓은 모래 해변·가파른 절벽·바닷가 동굴·구멍 뚫린 바위·바위 기둥·갯벌)
  밀물과 썰물: tide_shore(바닷가 단면, ValueTracker로 물 높이), tide_level(t) — 앱 u2-5의 lvl(t)
  갯벌: tidal_flat(갯벌 바탕) · mudskipper(짱뚱어) · lugworm(갯지렁이) · pickleweed(퉁퉁마디) · seepweed(칠면초) ·
        oystercatcher(검은머리물떼새) · spoonbill(저어새) · tank(수조, 흐림 정도)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, Annulus,
                   VGroup, VMobject, always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T
from scikit import BROWN, BROWN_DARK, RED

SW = 4
SEA = "#5DA9E0"
SEA_D = "#2F78B8"
SEA_L = "#BFE3F5"
LAND = "#7CBF5E"
LAND_D = "#3E8537"
SAND = "#EFD39A"
SAND_D = "#C9A766"
ROCK = "#9A9088"
ROCK_D = "#6B625B"
MUD = "#9C7B5C"
MUD_D = "#6E5440"
ICE = "#E6F4FB"
GRAY = "#8D96A0"
WHITE = "#FFFFFF"
SKY = "#D7EEFA"


def fit(mob, w=2.0, h=1.4):
    s = min(w / max(mob.width, 1e-3), h / max(mob.height, 1e-3))
    mob.scale(s)
    return mob


def P(pts, fill, stroke=INK, sw=SW, op=1.0):
    return Polygon(*[[x, y, 0] for x, y in pts], fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)


def S(pts, fill=None, stroke=INK, sw=SW, op=1.0, close=True):
    """부드러운 곡선(닫으면 칠함)"""
    p = [np.array([x, y, 0.0]) for x, y in pts]
    m = VMobject(stroke_color=stroke, stroke_width=sw)
    if close:
        p = p + [p[0]]
    m.set_points_smoothly(p)
    if fill:
        m.set_fill(fill, opacity=op)
    return m


def E(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0):
    return Ellipse(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke,
                   stroke_width=sw).move_to([x, y, 0])


def L(a, b, col=INK, sw=SW):
    return Line([a[0], a[1], 0], [b[0], b[1], 0], stroke_color=col, stroke_width=sw)


def waves(x0, x1, y, amp=0.08, n=4, col=SEA_D, sw=4):
    xs = np.linspace(x0, x1, 8 * n + 1)
    m = VMobject(stroke_color=col, stroke_width=sw)
    m.set_points_smoothly([np.array([x, y + amp * np.sin((x - x0) / (x1 - x0) * n * TAU), 0]) for x in xs])
    return m


# ══════════════ 대기 ══════════════
def earth(r=1.6, atmo=True):
    """지구(바다 + 육지 덩어리 몇 개). atmo=True면 둘레에 얇은 푸른 대기 띠(.atmo)"""
    sea = Circle(radius=r, fill_color=SEA, fill_opacity=1, stroke_color=SEA_D, stroke_width=4)
    lands = VGroup(
        S([(-0.55, 0.55), (-0.2, 0.75), (0.05, 0.5), (-0.1, 0.15), (-0.35, 0.0), (-0.6, 0.2)], LAND, LAND_D, 3),
        S([(0.25, 0.2), (0.6, 0.35), (0.75, 0.0), (0.55, -0.45), (0.3, -0.3)], LAND, LAND_D, 3),
        S([(-0.45, -0.35), (-0.15, -0.3), (-0.1, -0.65), (-0.35, -0.8), (-0.55, -0.6)], LAND, LAND_D, 3),
    ).scale(r)
    clouds = VGroup(*[E(0.5 * r, 0.12 * r, WHITE, x * r, y * r, stroke=WHITE, sw=0, op=0.8)
                      for x, y in ((-0.2, 0.35), (0.45, -0.1), (-0.5, -0.15))])
    g = VGroup(sea, lands, clouds)
    if atmo:
        a = Annulus(inner_radius=r, outer_radius=r * 1.12, fill_color="#7FC4F2", fill_opacity=0.55, stroke_width=0)
        g.add_to_back(a)
        g.atmo = a
    return g


def plastic_bag(full=True, w=2.0):
    """부푼 비닐봉지(입구가 왼쪽). full=False면 쭈그러진 봉지"""
    if full:
        body = S([(-0.75, 0.25), (-0.4, 0.62), (0.4, 0.68), (0.95, 0.35), (1.0, -0.3), (0.5, -0.66), (-0.4, -0.6), (-0.75, -0.25)],
                 "#F4F8FB", GRAY, 4, 0.85)
    else:
        body = S([(-0.75, 0.15), (-0.3, 0.25), (0.3, 0.12), (0.9, 0.18), (0.95, -0.1), (0.4, -0.22), (-0.3, -0.18), (-0.75, -0.12)],
                 "#F4F8FB", GRAY, 4, 0.85)
    mouth = L((-0.82, 0.25), (-0.82, -0.25), GRAY, 6)
    shine = Arc(radius=0.4, start_angle=1.8, angle=0.8, stroke_color=WHITE, stroke_width=6).move_to([0.15, 0.35, 0])
    g = VGroup(body, mouth, shine)
    return fit(g, w, w)


def fan(s=1.0):
    blade = Polygon([0, 0, 0], [-0.55, 0.9, 0], [0.55, 0.9, 0], fill_color="#F2A65A", fill_opacity=1, stroke_color=INK, stroke_width=3)
    top = Arc(radius=0.62, start_angle=PI / 2 - 0.55, angle=1.1, stroke_color=INK, stroke_width=3).move_to([0, 0.95, 0])
    ribs = VGroup(*[L((0, 0), (x, 0.88), BROWN_DARK, 2) for x in (-0.35, 0, 0.35)])
    handle = L((0, 0), (0, -0.6), BROWN_DARK, 10)
    return VGroup(blade, ribs, top, handle).scale(s)


def cloud(w=1.6, col=WHITE):
    g = VGroup(E(0.9, 0.55, col, -0.35, 0, stroke=GRAY, sw=3), E(1.0, 0.75, col, 0.15, 0.12, stroke=GRAY, sw=3),
               E(0.8, 0.5, col, 0.55, -0.02, stroke=GRAY, sw=3),
               Rectangle(width=1.5, height=0.3, fill_color=col, fill_opacity=1, stroke_width=0).move_to([0.1, -0.12, 0]))
    return fit(g, w, w)


def kite(s=1.0):
    body = P([(0, 0.6), (0.4, 0), (0, -0.6), (-0.4, 0)], "#F06A6A", INK, 3)
    cross = VGroup(L((0, 0.6), (0, -0.6), INK, 2), L((-0.4, 0), (0.4, 0), INK, 2))
    tail = S([(0, -0.6), (-0.15, -0.85), (0.1, -1.1), (-0.1, -1.35)], None, INK, 3, close=False)
    bows = VGroup(*[P([(x - 0.08, y + 0.05), (x + 0.08, y - 0.05), (x + 0.08, y + 0.05), (x - 0.08, y - 0.05)], "#F7C948", INK, 2)
                    for x, y in ((-0.12, -0.85), (0.08, -1.1))])
    return VGroup(tail, bows, body, cross).scale(s)


def hot_balloon(s=1.0):
    env = S([(0, 1.0), (0.55, 0.8), (0.7, 0.3), (0.45, -0.25), (0.18, -0.5), (-0.18, -0.5), (-0.45, -0.25), (-0.7, 0.3), (-0.55, 0.8)],
            "#F28C38", INK, 3)
    stripe = S([(0, 1.0), (0.22, 0.6), (0.2, -0.1), (0.1, -0.5), (-0.1, -0.5), (-0.2, -0.1), (-0.22, 0.6)], "#F7D046", INK, 2)
    ropes = VGroup(L((-0.16, -0.5), (-0.14, -0.78), INK, 2), L((0.16, -0.5), (0.14, -0.78), INK, 2))
    basket = Rectangle(width=0.32, height=0.22, fill_color=BROWN, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, -0.88, 0])
    return VGroup(env, stripe, ropes, basket).scale(s)


def wind_turbine(s=1.0, angle=0.0):
    tower = P([(-0.06, -1.4), (0.06, -1.4), (0.03, 0.4), (-0.03, 0.4)], WHITE, GRAY, 3)
    hub = Circle(radius=0.08, fill_color=WHITE, fill_opacity=1, stroke_color=GRAY, stroke_width=3).move_to([0, 0.42, 0])
    blades = VGroup()
    for k in range(3):
        b = P([(0, 0), (0.07, 0.15), (0.03, 0.95), (-0.03, 0.95), (-0.05, 0.15)], WHITE, GRAY, 3)
        b.rotate(angle + k * TAU / 3, about_point=ORIGIN)
        blades.add(b)
    blades.shift([0, 0.42, 0])
    g = VGroup(tower, blades, hub).scale(s)
    g.blades = blades
    return g


def sailboat(s=1.0):
    hull = P([(-0.8, 0), (0.8, 0), (0.55, -0.3), (-0.55, -0.3)], BROWN, INK, 3)
    mast = L((0, 0), (0, 1.3), INK, 4)
    sail = P([(0.05, 1.25), (0.05, 0.1), (0.75, 0.1)], WHITE, INK, 3)
    sail2 = P([(-0.05, 1.0), (-0.05, 0.1), (-0.55, 0.1)], "#F9E0A0", INK, 3)
    return VGroup(mast, sail, sail2, hull).scale(s)


def bike(s=1.0):
    w1 = Circle(radius=0.42, stroke_color=INK, stroke_width=5).move_to([-0.6, 0, 0])
    w2 = Circle(radius=0.42, stroke_color=INK, stroke_width=5).move_to([0.6, 0, 0])
    frame = VGroup(L((-0.6, 0), (-0.1, 0), BLUE, 5), L((-0.1, 0), (0.25, 0.5), BLUE, 5), L((-0.6, 0), (-0.25, 0.5), BLUE, 5),
                   L((-0.25, 0.5), (0.25, 0.5), BLUE, 5), L((0.25, 0.5), (0.6, 0), BLUE, 5),
                   L((-0.25, 0.5), (-0.3, 0.65), INK, 4), L((-0.42, 0.67), (-0.18, 0.67), INK, 6),
                   L((0.25, 0.5), (0.3, 0.72), INK, 4), L((0.22, 0.75), (0.42, 0.72), INK, 5))
    return VGroup(w1, w2, frame).scale(s)


def ball(r=0.35):
    c = Circle(radius=r, fill_color=WHITE, fill_opacity=1, stroke_color=INK, stroke_width=3)
    p = Polygon(*[[0.4 * r * np.cos(a), 0.4 * r * np.sin(a), 0] for a in np.linspace(PI / 2, PI / 2 + TAU, 6)[:-1]],
                fill_color=INK, fill_opacity=1, stroke_width=0)
    return VGroup(c, p)


def tree_s(h=1.4):
    trunk = Rectangle(width=0.16 * h, height=0.4 * h, fill_color=BROWN, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, 0.2 * h, 0])
    crown = Circle(radius=0.38 * h, fill_color=LAND, fill_opacity=1, stroke_color=LAND_D, stroke_width=3).move_to([0, 0.72 * h, 0])
    return VGroup(trunk, crown)


def sun_s(r=0.45):
    g = VGroup(Circle(radius=r, fill_color="#F7B733", fill_opacity=1, stroke_width=0))
    for i in range(8):
        a = i * TAU / 8
        g.add(Line([np.cos(a) * r * 1.3, np.sin(a) * r * 1.3, 0], [np.cos(a) * r * 1.75, np.sin(a) * r * 1.75, 0],
                   stroke_color="#F7B733", stroke_width=5))
    return g


# ══════════════ 지구 표면 ══════════════
# 지구본을 펼친 붙임딱지 칸(14 × 10 = 140칸). L = 육지(42칸), . = 바다(98칸) — 앱 u2-2 형성 평가의 '육지 42장, 바다 98장'
GRID_MAP = [
    "..............",
    "..LLL...LLLL..",
    ".LLL...LLLLL..",
    "..LL...LLLL...",
    "...L...LL.LL..",
    "....L..LLL....",
    "....LL..LL....",
    "....L...L..LL.",
    "..............",
    "....LLLL......",
]


def grid_counts():
    land = sum(row.count("L") for row in GRID_MAP)
    return land, len(GRID_MAP) * len(GRID_MAP[0]) - land


def sticker_grid(cell=0.36, filled=True):
    """붙임딱지 칸 모음 VGroup. .cells[i] = (칸, 'L'/'S'), filled=False면 빈 칸(흰색)"""
    rows, cols = len(GRID_MAP), len(GRID_MAP[0])
    g = VGroup()
    cells = []
    for i, row in enumerate(GRID_MAP):
        for j, ch in enumerate(row):
            kind = "L" if ch == "L" else "S"
            col = (LAND if kind == "L" else SEA) if filled else WHITE
            sq = RoundedRectangle(corner_radius=0.05, width=cell * 0.9, height=cell * 0.9, fill_color=col, fill_opacity=1,
                                  stroke_color=GRAY, stroke_width=1.5)
            sq.move_to([(j - (cols - 1) / 2) * cell, ((rows - 1) / 2 - i) * cell, 0])
            g.add(sq)
            cells.append((sq, kind))
    g.cells = cells
    return g


def _field():
    base = P([(-1, -0.5), (1, -0.5), (1, 0.1), (-1, 0.1)], "#B9D86A", LAND_D, 3)
    rows = VGroup(*[L((-0.95, y), (0.95, y), "#8DB24A", 3) for y in (-0.35, -0.2, -0.05)])
    sky = P([(-1, 0.1), (1, 0.1), (1, 0.6), (-1, 0.6)], SKY, SKY, 0)
    hill = S([(-1, 0.1), (-0.5, 0.35), (0, 0.15), (0.6, 0.3), (1, 0.1)], None, LAND_D, 3, close=False)
    return VGroup(sky, base, rows, hill)


def _mountain():
    sky = P([(-1, -0.5), (1, -0.5), (1, 0.6), (-1, 0.6)], SKY, SKY, 0)
    m1 = P([(-1, -0.5), (-0.3, 0.5), (0.4, -0.5)], "#6FAE5A", LAND_D, 3)
    m2 = P([(-0.1, -0.5), (0.5, 0.3), (1, -0.5)], "#8CC06C", LAND_D, 3)
    trees = VGroup(*[P([(x - 0.07, y), (x, y + 0.16), (x + 0.07, y)], "#2F6B2A", "#2F6B2A", 1) for x, y in
                     ((-0.5, -0.1), (-0.3, 0.1), (-0.1, -0.2), (0.45, 0.0), (0.65, -0.25), (-0.65, -0.35))])
    return VGroup(sky, m1, m2, trees)


def _river():
    base = P([(-1, -0.5), (1, -0.5), (1, 0.6), (-1, 0.6)], "#B9D86A", LAND_D, 0)
    river = P([(-0.25, 0.55), (0.05, 0.4), (0.15, 0.25), (-0.05, 0.05), (-0.15, -0.15), (0.05, -0.35), (0.3, -0.5), (0.65, -0.5),
               (0.35, -0.3), (0.2, -0.12), (0.3, 0.08), (0.45, 0.28), (0.35, 0.45), (0.15, 0.55)], SEA, SEA_D, 3)
    return VGroup(base, river)


def _lake():
    base = P([(-1, -0.5), (1, -0.5), (1, 0.6), (-1, 0.6)], "#B9D86A", LAND_D, 0)
    m = P([(-1, 0.1), (-0.5, 0.6), (0, 0.1)], "#6FAE5A", LAND_D, 3)
    m2 = P([(0, 0.1), (0.55, 0.6), (1, 0.1)], "#8CC06C", LAND_D, 3)
    lake = E(1.3, 0.55, SEA, 0, -0.18, stroke=SEA_D, sw=3)
    return VGroup(base, m, m2, lake)


def _sea():
    sky = P([(-1, 0.0), (1, 0.0), (1, 0.6), (-1, 0.6)], SKY, SKY, 0)
    sea = P([(-1, -0.5), (1, -0.5), (1, 0.0), (-1, 0.0)], SEA, SEA_D, 0)
    w = VGroup(*[waves(-0.9, 0.9, y, 0.05, 4, WHITE, 3) for y in (-0.15, -0.35)])
    return VGroup(sky, sea, w)


def _glacier():
    sky = P([(-1, -0.5), (1, -0.5), (1, 0.6), (-1, 0.6)], SKY, SKY, 0)
    sea = P([(-1, -0.5), (1, -0.5), (1, -0.2), (-1, -0.2)], SEA, SEA_D, 0)
    ice = P([(-1, -0.2), (-1, 0.3), (-0.6, 0.35), (-0.3, 0.2), (0.1, 0.38), (0.5, 0.22), (1, 0.3), (1, -0.2)], ICE, "#7FB5D6", 3)
    cracks = VGroup(*[L((x, -0.2), (x + 0.05, 0.15), "#7FB5D6", 2) for x in (-0.6, -0.2, 0.2, 0.6)])
    return VGroup(sky, sea, ice, cracks)


def _desert():
    sky = P([(-1, -0.5), (1, -0.5), (1, 0.6), (-1, 0.6)], "#FBEBC4", "#FBEBC4", 0)
    d1 = P([(-1, -0.5), (-1, 0.0), (-0.75, 0.15), (-0.5, 0.25), (-0.25, 0.12), (0.0, -0.05), (0.25, 0.1), (0.5, 0.2),
            (0.75, 0.08), (1, -0.05), (1, -0.5)], SAND, SAND_D, 3)
    d2 = P([(-1, -0.5), (-1, -0.3), (-0.6, -0.2), (-0.3, -0.27), (0.0, -0.3), (0.3, -0.2), (0.6, -0.15), (1, -0.35), (1, -0.5)],
           "#E6C27E", SAND_D, 3)
    sun = Circle(radius=0.12, fill_color="#F7B733", fill_opacity=1, stroke_width=0).move_to([0.65, 0.42, 0])
    return VGroup(sky, d1, d2, sun)


def _valley():
    sky = P([(-1, -0.5), (1, -0.5), (1, 0.6), (-1, 0.6)], SKY, SKY, 0)
    m1 = P([(-1, -0.5), (-1, 0.55), (-0.15, -0.5)], "#6FAE5A", LAND_D, 3)
    m2 = P([(1, -0.5), (1, 0.55), (0.15, -0.5)], "#6FAE5A", LAND_D, 3)
    stream = P([(-0.2, -0.5), (0.2, -0.5), (0.05, 0.0), (-0.05, 0.0)], SEA, SEA_D, 2)
    return VGroup(sky, m1, m2, stream)


def _mudflat():
    sky = P([(-1, 0.1), (1, 0.1), (1, 0.6), (-1, 0.6)], SKY, SKY, 0)
    sea = P([(-1, 0.1), (1, 0.1), (1, 0.2), (-1, 0.2)], SEA, SEA, 0)
    mud = P([(-1, -0.5), (1, -0.5), (1, 0.1), (-1, 0.1)], MUD, MUD_D, 3)
    holes = VGroup(*[E(0.08, 0.04, MUD_D, x, y, stroke=MUD_D, sw=1) for x, y in
                     ((-0.7, -0.2), (-0.35, -0.35), (-0.1, -0.1), (0.3, -0.3), (0.6, -0.15), (0.75, -0.4))])
    return VGroup(sky, sea, mud, holes)


SURFACE = {"산": _mountain, "들": _field, "강": _river, "호수": _lake, "바다": _sea,
           "빙하": _glacier, "사막": _desert, "계곡": _valley, "갯벌": _mudflat}


def surface_pic(name, w=2.4, h=1.6, size=34):
    """지구 표면 그림 카드: 그림(가로 2 · 세로 1.1 틀) + 아래 이름"""
    pic = SURFACE[name]()
    frame = Rectangle(width=2.0, height=1.1, stroke_color=INK, stroke_width=3).move_to([0, 0.05, 0])
    pic = VGroup(pic, frame)
    fit(pic, w, h)
    t = T(name, size, INK).next_to(pic, DOWN, buff=0.12)
    g = VGroup(pic, t)
    g.pic, g.label = pic, t
    return g


# ══════════════ 바닷물 ══════════════
def beaker(label="", water=SEA_L, w=1.2, h=1.5, size=28):
    glass = VGroup(L((-w / 2, h / 2), (-w / 2, -h / 2), GRAY, 5), L((-w / 2, -h / 2), (w / 2, -h / 2), GRAY, 5),
                   L((w / 2, -h / 2), (w / 2, h / 2), GRAY, 5), L((-w / 2, h / 2), (-w / 2 - 0.12, h / 2 + 0.1), GRAY, 5))
    wat = Rectangle(width=w - 0.08, height=h * 0.6, fill_color=water, fill_opacity=0.8, stroke_width=0)
    wat.move_to([0, -h / 2 + h * 0.3 + 0.03, 0])
    g = VGroup(wat, glass)
    if label:
        t = T(label, size, INK).next_to(glass, DOWN, buff=0.15)
        g.add(t)
    return g


def evap_dish(w=2.0, residue=False, water=False):
    """증발 접시(옆에서 본 모양, 위가 열림). residue=True면 흰색 가루 물질"""
    dish = S([(-1.0, 0.25), (-0.8, -0.12), (-0.4, -0.27), (0.4, -0.27), (0.8, -0.12), (1.0, 0.25)], None, GRAY, 5, close=False)
    inner = P([(-0.93, 0.2), (0.93, 0.2), (0.75, -0.1), (0.4, -0.22), (-0.4, -0.22), (-0.75, -0.1)], "#F3F1EC", GRAY, 0)
    rim = E(2.0, 0.22, "#ECE9E2", 0, 0.25, stroke=GRAY, sw=4)
    g = VGroup(inner, rim, dish)
    chips = VGroup(Dot([-0.1, 0.2, 0], radius=0.05, color=ROCK_D), Dot([0.1, 0.22, 0], radius=0.05, color=ROCK_D))
    if water:
        g.add(E(1.7, 0.16, SEA_L, 0, 0.24, stroke=SEA_D, sw=2))
    if residue:
        pts = [(-0.65, 0.22), (-0.45, 0.27), (-0.3, 0.2), (0.25, 0.26), (0.4, 0.2), (0.6, 0.24), (-0.55, 0.3), (0.5, 0.29), (0.0, 0.3)]
        g.add(VGroup(*[E(0.2, 0.07, WHITE, x, y, stroke="#C9C4BA", sw=1.5) for x, y in pts]))
    g.add(chips)
    return fit(g, w, w)


def hot_plate(w=4.6):
    body = RoundedRectangle(corner_radius=0.08, width=w, height=0.35, fill_color="#5A6068", fill_opacity=1, stroke_color=INK, stroke_width=3)
    top = Rectangle(width=w - 0.3, height=0.08, fill_color="#3A3F45", fill_opacity=1, stroke_width=0).move_to([0, 0.2, 0])
    knob = Circle(radius=0.08, fill_color="#D2453B", fill_opacity=1, stroke_width=0).move_to([w / 2 - 0.3, -0.02, 0])
    return VGroup(body, top, knob)


def cup(col=SEA, s=0.36):
    c = P([(-0.5, 0.5), (0.5, 0.5), (0.38, -0.5), (-0.38, -0.5)], col, INK, 2)
    return c.scale(s)


def cup_grid(n_sea=97, n_ice=2, n_land=1, s=0.36, gap=0.44):
    """물 100컵(10 × 10): 바닷물(파랑) → 빙하(흰색) → 지하수·강·호수(연두)"""
    g = VGroup()
    cols = [SEA] * n_sea + [ICE] * n_ice + ["#B9E28C"] * n_land
    for k, col in enumerate(cols):
        i, j = divmod(k, 10)
        c = cup(col, s).move_to([(j - 4.5) * gap, (4.5 - i) * gap, 0])
        g.add(c)
    return g


# ══════════════ 바닷가 지형 (옆에서 본 모습, 틀 가로 2 · 세로 1.3) ══════════════
def _sky_sea(sea_y=-0.15):
    sky = P([(-1, -0.65), (1, -0.65), (1, 0.65), (-1, 0.65)], SKY, SKY, 0)
    sea = P([(-1, -0.65), (1, -0.65), (1, sea_y), (-1, sea_y)], SEA, SEA_D, 0)
    return VGroup(sky, sea)


def _lf_beach():
    bg = _sky_sea(-0.1)
    sand = P([(-1, -0.65), (1, -0.65), (1, -0.38), (0.5, -0.33), (0.2, -0.28), (-0.4, -0.08), (-1, 0.05)], SAND, SAND_D, 3)
    foam = waves(0.0, 0.95, -0.33, 0.03, 3, WHITE, 3)
    return VGroup(bg, sand, foam)


def _lf_cliff():
    bg = _sky_sea(-0.3)
    cliff = P([(-1, -0.65), (-1, 0.55), (-0.15, 0.55), (-0.1, 0.2), (0.0, -0.1), (-0.05, -0.65)], ROCK, ROCK_D, 3)
    grass = P([(-1, 0.55), (-0.15, 0.55), (-0.15, 0.62), (-1, 0.62)], LAND, LAND_D, 2)
    lines = VGroup(*[L((-0.9, y), (-0.2, y), ROCK_D, 2) for y in (0.25, -0.05, -0.35)])
    spray = VGroup(*[Dot([x, y, 0], radius=0.035, color=WHITE) for x, y in ((0.05, -0.2), (0.12, -0.12), (0.1, -0.28), (0.18, -0.2))])
    return VGroup(bg, cliff, grass, lines, spray)


def _lf_cave():
    bg = _sky_sea(-0.3)
    rock = P([(-1, -0.65), (-1, 0.45), (-0.2, 0.55), (0.6, 0.35), (0.75, -0.65)], ROCK, ROCK_D, 3)
    cave = S([(-0.25, -0.35), (-0.2, 0.05), (0.15, 0.15), (0.45, -0.05), (0.5, -0.35)], "#3E3833", ROCK_D, 3)
    sea_in = P([(-1, -0.65), (1, -0.65), (1, -0.3), (-1, -0.3)], SEA, SEA_D, 0, 0.9)
    return VGroup(bg, rock, cave, sea_in)


def _lf_arch():
    bg = _sky_sea(-0.3)
    arch = VGroup(P([(-0.75, -0.3), (-0.8, 0.35), (-0.4, 0.5), (0.4, 0.5), (0.8, 0.3), (0.75, -0.3), (0.35, -0.3), (0.3, 0.05),
                     (0.0, 0.15), (-0.3, 0.05), (-0.35, -0.3)], ROCK, ROCK_D, 3))
    boat = P([(-0.12, -0.25), (0.12, -0.25), (0.08, -0.31), (-0.08, -0.31)], BROWN, INK, 2).shift(RIGHT * 0.0)
    return VGroup(bg, arch, boat)


def _lf_stack():
    bg = _sky_sea(-0.3)
    stack = P([(-0.2, -0.3), (-0.25, 0.1), (-0.15, 0.45), (0.0, 0.55), (0.12, 0.4), (0.2, 0.05), (0.18, -0.3)], ROCK, ROCK_D, 3)
    shore = P([(-1, -0.65), (-1, -0.1), (-0.6, -0.2), (-0.5, -0.65)], ROCK, ROCK_D, 3)
    gull = VGroup(Arc(radius=0.06, start_angle=0, angle=PI, stroke_color=INK, stroke_width=3).move_to([-0.04, 0.6, 0]),
                  Arc(radius=0.06, start_angle=0, angle=PI, stroke_color=INK, stroke_width=3).move_to([0.08, 0.6, 0]))
    return VGroup(bg, stack, shore, gull)


def _lf_flat():
    sky = P([(-1, -0.65), (1, -0.65), (1, 0.65), (-1, 0.65)], SKY, SKY, 0)
    sea = P([(0.55, -0.1), (1, -0.1), (1, -0.05), (0.55, -0.05)], SEA, SEA, 0)
    mud = P([(-1, -0.65), (1, -0.65), (1, -0.1), (-1, -0.1)], MUD, MUD_D, 3)
    holes = VGroup(*[E(0.08, 0.035, MUD_D, x, y, stroke=MUD_D, sw=1) for x, y in
                     ((-0.7, -0.3), (-0.35, -0.48), (-0.05, -0.25), (0.3, -0.42), (0.6, -0.28))])
    return VGroup(sky, sea, mud, holes)


LANDFORM = {"넓은 모래 해변": _lf_beach, "가파른 절벽": _lf_cliff, "바닷가 동굴": _lf_cave,
            "구멍 뚫린 바위": _lf_arch, "바위 기둥": _lf_stack, "갯벌": _lf_flat}


def landform(name, w=2.6, h=1.75, size=32, label=True):
    pic = LANDFORM[name]()
    frame = Rectangle(width=2.0, height=1.3, stroke_color=INK, stroke_width=3)
    pic = VGroup(pic, frame)
    fit(pic, w, h)
    g = VGroup(pic)
    g.pic = pic
    if label:
        t = T(name, size, INK).next_to(pic, DOWN, buff=0.12)
        g.add(t)
        g.label = t
    return g


# ══════════════ 밀물과 썰물 ══════════════
def tide_level(t):
    """앱 u2-5의 바닷물 높이(0 낮음 ~ 1 높음): 0.5 + 0.5·cos(2π(t − 3)/12.4), t는 시각(시)"""
    return 0.5 + 0.5 * np.cos(2 * PI * (t - 3) / 12.4)


class TideShore:
    """바닷가 단면: 왼쪽 육지(비탈) — 오른쪽 바다, 가운데 섬으로 가는 바닷길, 눈금 기둥, 배.
    level(ValueTracker 0~1)에 따라 물 높이가 바뀜. group()으로 그림을 얻음."""
    X0, X1 = -6.6, 6.6
    Y_BOT = -2.45
    LOW_Y, HIGH_Y = -1.75, -0.35

    def __init__(self, level):
        self.level = level

    def water_y(self):
        v = self.level.get_value()
        return self.LOW_Y + v * (self.HIGH_Y - self.LOW_Y)

    def group(self):
        X0, X1, YB = self.X0, self.X1, self.Y_BOT
        sky = Rectangle(width=X1 - X0, height=3.0 - YB, fill_color=SKY, fill_opacity=0.55, stroke_width=0).move_to(
            [(X0 + X1) / 2, (3.0 + YB) / 2, 0])
        # 땅: 왼쪽 육지 높음 → 갯벌(낮고 편평) → 섬(오른쪽 가운데)
        land = P([(X0, YB), (X0, 0.4), (-4.6, 0.3), (-3.6, -1.2), (-2.6, -1.85), (0.6, -1.95), (1.4, -1.9), (2.0, -1.4),
                  (2.6, -0.2), (3.4, 0.25), (4.2, -0.1), (4.8, -1.6), (5.4, -2.2), (X1, -2.25), (X1, YB)], MUD, MUD_D, 3)
        sand = P([(X0, 0.4), (-4.6, 0.3), (-4.3, -0.15), (X0, -0.1)], LAND, LAND_D, 0)
        road = P([(-2.5, -1.92), (-2.25, -1.52), (1.75, -1.52), (2.0, -1.92)], "#D8C7A2", MUD_D, 2)   # 섬으로 가는 바닷길(물이 가장 낮을 때만 드러남)
        island_tree = tree_s(0.9).move_to([3.4, 0.25 + 0.45, 0])
        # 눈금 기둥: 빨간 눈금 6칸 — 앱 u2-5와 같게, 물이 가장 높아도 4칸까지 잠김
        pole_x = -0.3
        lo, hi = self.LOW_Y, self.HIGH_Y
        tick_y = [lo + (26 + 20 * k) / 118 * (hi - lo) for k in range(1, 7)]
        pole = Rectangle(width=0.18, height=tick_y[-1] + 0.2 + 1.52, fill_color=WHITE, fill_opacity=1, stroke_color=INK,
                         stroke_width=3).move_to([pole_x, (tick_y[-1] + 0.2 - 1.52) / 2, 0])
        ticks = VGroup(*[Line([pole_x - 0.09, y, 0], [pole_x + 0.09, y, 0], stroke_color=RED, stroke_width=6) for y in tick_y])
        self.tick_y = tick_y
        static = VGroup(sky, land, sand, road, island_tree, pole, ticks)
        self.pole_x = pole_x

        def water():
            y = self.water_y()
            body = Rectangle(width=X1 - X0, height=y - YB, fill_color=SEA, fill_opacity=0.72, stroke_width=0).move_to(
                [(X0 + X1) / 2, (y + YB) / 2, 0])
            top = waves(X0 + 2.0, X1, y, 0.05, 10, SEA_D, 4)
            return VGroup(body, top)

        def boat():
            y = max(self.water_y() + 0.12, -1.2)      # 물이 낮으면 갯벌 위에 얹힘
            b = P([(-0.55, 0.0), (0.55, 0.0), (0.38, -0.25), (-0.38, -0.25)], BROWN, INK, 3)
            m = VGroup(L((0, 0), (0, 0.7), INK, 3), P([(0.04, 0.65), (0.04, 0.08), (0.45, 0.08)], WHITE, INK, 2))
            return VGroup(m, b).shift([-3.15, y, 0])

        self.water = always_redraw(water)
        self.boat = always_redraw(boat)
        return VGroup(static, self.water, self.boat)

    def ticks_under(self):
        y = self.water_y()
        return sum(1 for t in self.tick_y if t <= y)

    def stop(self):
        self.water.clear_updaters()
        self.boat.clear_updaters()


# ══════════════ 갯벌 ══════════════
def tidal_flat(x0=-6.6, x1=6.6, top=-0.6, bottom=-2.45):
    mud = Rectangle(width=x1 - x0, height=top - bottom, fill_color=MUD, fill_opacity=1, stroke_width=0).move_to(
        [(x0 + x1) / 2, (top + bottom) / 2, 0])
    edge = Line([x0, top, 0], [x1, top, 0], stroke_color=MUD_D, stroke_width=4)
    rng = np.random.default_rng(3)
    holes = VGroup(*[E(0.14, 0.06, MUD_D, x, y, stroke=MUD_D, sw=1) for x, y in
                     zip(rng.uniform(x0 + 0.3, x1 - 0.3, 14), rng.uniform(bottom + 0.2, top - 0.2, 14))])
    return VGroup(mud, edge, holes)


def mudskipper(s=1.0):
    body = S([(-0.7, 0.0), (-0.3, 0.15), (0.35, 0.18), (0.6, 0.05), (0.55, -0.1), (0.0, -0.15), (-0.6, -0.08)], "#8A7A5E", INK, 3)
    tail = P([(-0.65, 0.0), (-0.95, 0.18), (-0.95, -0.18)], "#8A7A5E", INK, 3)
    fin = S([(-0.2, 0.15), (0.0, 0.38), (0.25, 0.18)], "#A8936C", INK, 2)
    eyes = VGroup(Circle(radius=0.08, fill_color=WHITE, fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([0.4, 0.27, 0]),
                  Dot([0.42, 0.28, 0], radius=0.035, color=INK))
    pec = E(0.22, 0.12, "#A8936C", 0.2, -0.15, sw=2)
    return VGroup(tail, fin, body, pec, eyes).scale(s)


def lugworm(s=1.0):
    mound = VGroup(*[E(0.22, 0.12, "#B08E6C", x, y, stroke=MUD_D, sw=2) for x, y in
                     ((-0.25, 0), (-0.05, 0.05), (0.15, 0), (0.0, 0.14), (-0.15, 0.14), (0.25, 0.1))])
    worm = S([(0.35, 0.05), (0.5, 0.18), (0.65, 0.05), (0.8, 0.18)], None, "#D07A6A", 8, close=False)
    return VGroup(mound, worm).scale(s)


def pickleweed(s=1.0):
    g = VGroup()
    for x, h in ((-0.25, 0.7), (0.0, 0.9), (0.25, 0.65)):
        stem = VGroup(*[E(0.12, 0.2, "#7CBF5E", x, 0.1 + k * 0.18, stroke=LAND_D, sw=2) for k in range(int(h / 0.18))])
        g.add(stem)
    return g.scale(s)


def seepweed(s=1.0):
    g = VGroup()
    for x, h in ((-0.3, 0.6), (-0.05, 0.85), (0.2, 0.7), (0.4, 0.5)):
        g.add(L((x, 0), (x, h), "#A8332E", 4))
        for k in range(1, 4):
            y = h * k / 4
            g.add(L((x, y), (x - 0.12, y + 0.1), "#C8423B", 3), L((x, y), (x + 0.12, y + 0.1), "#C8423B", 3))
    return g.scale(s)


def _bird(body_col, head_col, beak_col, beak="long", s=1.0):
    body = E(0.9, 0.45, body_col, 0, 0, sw=3)
    wing = S([(-0.35, 0.1), (0.1, 0.18), (0.3, 0.0), (-0.2, -0.05)], body_col, INK, 2)
    head = Circle(radius=0.17, fill_color=head_col, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0.45, 0.25, 0])
    if beak == "spoon":
        bk = VGroup(L((0.6, 0.25), (1.0, 0.18), beak_col, 5), E(0.18, 0.12, beak_col, 1.05, 0.17, stroke=INK, sw=2))
    else:
        bk = L((0.6, 0.25), (0.98, 0.2), beak_col, 6)
    legs = VGroup(L((-0.05, -0.2), (-0.1, -0.6), "#E07A7A", 3), L((0.1, -0.2), (0.12, -0.6), "#E07A7A", 3))
    eye = Dot([0.5, 0.29, 0], radius=0.03, color=INK if head_col != INK else WHITE)
    return VGroup(legs, body, wing, head, bk, eye).scale(s)


def oystercatcher(s=1.0):
    return _bird("#3A3A40", "#2B2B33", "#E8463C", "long", s)


def spoonbill(s=1.0):
    return _bird(WHITE, WHITE, INK, "spoon", s)


def tank(cloudy=1.0, clam=False, w=2.6, h=1.8):
    """수조: cloudy 1(뿌옇게 흐림) ~ 0(맑음), clam=True면 바지락"""
    murky = np.array([0.62, 0.52, 0.38])
    clear = np.array([0.72, 0.87, 0.95])
    c = clear + (murky - clear) * cloudy
    col = "#%02X%02X%02X" % tuple(int(v * 255) for v in c)
    water = Rectangle(width=w - 0.1, height=h * 0.8, fill_color=col, fill_opacity=0.9, stroke_width=0).move_to([0, -h * 0.08, 0])
    glass = VGroup(L((-w / 2, h / 2), (-w / 2, -h / 2), GRAY, 5), L((-w / 2, -h / 2), (w / 2, -h / 2), GRAY, 5),
                   L((w / 2, -h / 2), (w / 2, h / 2), GRAY, 5))
    g = VGroup(water, glass)
    if clam:
        for x in (-0.6, 0.0, 0.6):
            g.add(E(0.42, 0.22, "#D9B48A", x, -h / 2 + 0.16, sw=3))
    return g
