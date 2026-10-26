"""5-2 4단원 「자원과 에너지」 전용 그림 부품 (s5ep37~40, s5mm08)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit().
  공통: icard(그림 + 여러 줄 글 카드) · res_bin(제목 달린 분류 상자) · chip_card(작은 글 카드)
  자원: glass_water · book · iron_bar · water_drop · dirty_water · polluted_to_clean · source_row(검색 결과 줄 + ○/×)
  재생 에너지: village(앱 u4-2 「재생 에너지 마을」 그림을 본떠 .spots[k] = 태양·풍력·수력·해양·지열·바이오)
            dam · sea_power · geo_power · bio_farm · solar_heater · island_wind · desert_sun
  지속가능: classroom(on) — 앱 u4-3 빈 교실(전등·컴퓨터·텔레비전·선풍기, .dev[k]) · ladder · slide
  효율: faucet(running, sensor) · grade_label(1~5등급, 고른 등급 강조) · multitap · led_bulb · rain_barrel
        model_house(앱 u4-4 집 모형: 뽁뽁이·우드록·색점토·손난로·탐침 온도계) · temp_lines(두 집 모형 온도 꺾은선)
        eco_house(앱 u4-4 에너지 효율 집 그림: 단열재·이중창·차양·열 교환기·옥상 정원·태양 전지판·지열, .spots[k])
        night_city(lights) — 어스아워
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, WHITE,
                   Arc, Arrow, Circle, Dot, DashedLine, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK
from kit_s3u12 import fit, E, C, L, poly, smooth, text_card, ox_mark, bin_box  # noqa: F401
from kit_s4u24 import (R, rect, sun_hot, lines, solar_panel, turbine, plug, factory, car, house, tree, stump,  # noqa: F401
                       forest, tv, lamp, tap, bike, eco_car, smoke, tumbler, trash_pile, fire)
from kit_s4u12 import safety_note  # noqa: F401
from kit_s4u23 import kid, h2_car  # noqa: F401
from kit_s5u13 import word_card, result_table  # noqa: F401
from kit_s5u21 import ore_pic, recycle_item  # noqa: F401
from kit_s3u21 import bubble_wrap  # noqa: F401
from kit_s4u14 import fuel_can  # noqa: F401
import kit_s3u22 as A22

SW = 4
SKY = "#DFF3FF"
HILL = "#B9DC9C"
GRASS = "#9FD08A"
SOIL = "#B48A62"
SEA = "#3F9BE0"
WATER = "#5FB4EA"
GRAY = "#A3A9B8"
GRAY_D = "#6F778A"
HOT = "#E2573F"
COLD = "#3A86C8"
YEL = "#FFD23F"
WOOD = "#E9D9A6"
CLAY = "#EF8A3C"
WATER_C = "#2F6FD6"   # 물 자원 색
FOREST_C = "#2E9E5B"  # 산림 자원 색
MINERAL_C = "#8A6A3A"  # 광물 자원 색


# ══════════════ 공통 ══════════════
def icard(pic, text, w=3.0, h=2.9, stroke=SOFT, size=25, fill=PAPER):
    """그림 + 여러 줄 글 카드"""
    box = R(w, h, fill, rad=0.18, stroke=stroke, sw=5)
    p = fit(pic, w - 0.7, h * 0.46).move_to(box.get_top() + DOWN * h * 0.3)
    t = lines(text, size)
    if t.width > w - 0.25:
        t.scale_to_fit_width(w - 0.25)
    t.move_to(box.get_bottom() + UP * h * 0.22)
    g = VGroup(box, p, t)
    g.box, g.pic, g.text = box, p, t
    return g


def chip_card(text, col=INK, size=26, w=None, fill=PAPER, h=0.72):
    t = M(text, size, col)
    W = w or t.width + 0.5
    if t.width > W - 0.3:
        t.scale_to_fit_width(W - 0.3)
    box = RoundedRectangle(corner_radius=0.14, width=W, height=h, fill_color=fill, fill_opacity=1, stroke_color=col,
                           stroke_width=3)
    t.move_to(box)
    return VGroup(box, t)


def res_bin(title, w, h, col, pic=None, size=32):
    """분류 상자(위에 그림 + 제목)"""
    box = RoundedRectangle(corner_radius=0.22, width=w, height=h, fill_color=col, fill_opacity=0.10,
                           stroke_color=col, stroke_width=5)
    t = T(title, size, col)
    if pic is not None:
        fit(pic, 0.7, 0.6)
        head = VGroup(pic, t).arrange(RIGHT, buff=0.18)
    else:
        head = t
    head.next_to(box.get_top(), DOWN, buff=0.16)
    g = VGroup(box, head)
    g.box, g.head = box, head
    g.inner_top = head.get_bottom()[1] - 0.15
    return g


# ══════════════ 자원 ══════════════
def water_drop(col=WATER, s=1.0):
    d = smooth([(0, 0.55), (-0.32, 0.0), (-0.3, -0.25), (0, -0.42), (0.3, -0.25), (0.32, 0.0), (0, 0.55)], "#1F6FB0", 3)
    d.set_fill(col, 1)
    shine = E(0.1, 0.2, WHITE, -0.13, -0.08, stroke=WHITE, sw=0, op=0.7)
    return VGroup(d, shine).scale(s)


def glass_water():
    cup = poly([(-0.45, 0.6), (0.45, 0.6), (0.36, -0.6), (-0.36, -0.6)], "#EAF6FD", "#7FB8D6", 4)
    water = poly([(-0.41, 0.25), (0.41, 0.25), (0.36, -0.58), (-0.36, -0.58)], "#9CD3F2", "#9CD3F2", 0)
    return VGroup(water, cup)


def book():
    cover = R(1.1, 1.4, "#E0703A", 0, 0, rad=0.06, stroke=INK, sw=3)
    pages = R(0.14, 1.3, "#FFF8E8", 0.55, 0, rad=0.02, stroke=INK, sw=2)
    band = R(0.7, 0.22, "#FFF1D6", -0.05, 0.3, rad=0.04, stroke=INK, sw=2)
    return VGroup(pages, cover, band)


def iron_bar():
    top = poly([(-0.8, 0.15), (0.5, 0.15), (0.8, 0.4), (-0.5, 0.4)], "#C7CDD3", INK, 3)
    front = R(1.3, 0.45, "#9AA3AB", -0.15, -0.075, rad=0.02, stroke=INK, sw=3)
    side = poly([(0.5, 0.15), (0.8, 0.4), (0.8, -0.05), (0.5, -0.3)], "#7D868E", INK, 3)
    return VGroup(top, front, side)


def dirty_water():
    cup = glass_water()
    cup[0].set_fill("#A08A5A", 1).set_stroke("#A08A5A")
    dots = VGroup(*[Dot([x, y, 0], radius=0.05, color="#5E4B2A") for x, y in ((-0.2, -0.2), (0.15, -0.35), (0.0, 0.05), (0.22, -0.05), (-0.15, -0.45))])
    return VGroup(cup, dots)


def source_row(title, note, ok, w=9.6, size=26):
    """검색 결과 한 줄 + 오른쪽 ○/× 표시(.mark)"""
    box = R(w, 1.0, PAPER, rad=0.14, stroke=SOFT, sw=3)
    t1 = T(title, size, INK)
    t2 = T(note, size - 6, SOFT)
    tx = VGroup(t1, t2).arrange(DOWN, buff=0.08, aligned_edge=LEFT)
    if tx.width > w - 1.4:
        tx.scale_to_fit_width(w - 1.4)
    tx.move_to(box).align_to(box, LEFT).shift(RIGHT * 0.3)
    mark = ox_mark(ok, 0.24).move_to(box.get_right() + LEFT * 0.55)
    g = VGroup(box, tx)
    g.mark = mark
    return g


# ══════════════ 재생 에너지 ══════════════
def blades(r=0.55):
    g = VGroup()
    for a in (0, 2 * PI / 3, 4 * PI / 3):
        b = poly([(0, 0), (-0.06, r), (0, r + 0.08), (0.06, r)], WHITE, "#8AA0B0", 2).rotate(a, about_point=ORIGIN)
        g.add(b)
    g.add(Circle(radius=0.07, fill_color="#CFD8DE", fill_opacity=1, stroke_color="#8AA0B0", stroke_width=2))
    return g


def windmill(h=1.6, r=0.55):
    tower = poly([(-0.05, -h), (0.05, -h), (0.03, 0), (-0.03, 0)], "#EEF2F5", "#8AA0B0", 2)
    g = VGroup(tower, blades(r))
    g.rotor = g[1]
    return g


def dam():
    lake = poly([(-1.2, 0.5), (0.0, 0.62), (-0.05, -0.5), (-1.2, -0.55)], WATER, WATER, 0)
    wall = poly([(-0.05, 0.65), (0.25, 0.65), (0.55, -0.9), (-0.15, -0.9)], GRAY, GRAY_D, 3)
    fall = smooth([(0.45, -0.1), (0.75, -0.3), (0.85, -0.9)], "#7FC8F0", 12)
    plant = R(0.55, 0.42, "#D6DBE4", 1.05, -0.72, rad=0.04, stroke=GRAY_D, sw=2)
    bolt = poly([(1.05, -0.55), (0.98, -0.72), (1.06, -0.72), (1.0, -0.88), (1.14, -0.68), (1.06, -0.68), (1.12, -0.55)], "#E2B13C", "#A8842E", 1)
    return VGroup(lake, wall, fall, plant, bolt)


def sea_power():
    sea = poly([(-1.4, 0.2), (1.4, 0.25), (1.4, -1.0), (-1.4, -1.0)], SEA, SEA, 0)
    wv = VGroup(*[A22.waves(-1.3, 1.3, y, 0.06, 6, "#BFE5FF", 3) for y in (0.0, -0.4)])
    wall = R(0.18, 1.6, "#8B93A3", -0.4, -0.2, rad=0.02, stroke="#5D6676", sw=2)
    turb = VGroup(C(0.13, "#E2B13C", -0.4, -0.55, stroke="#A8842E", sw=2), C(0.13, "#E2B13C", -0.4, -0.05, stroke="#A8842E", sw=2))
    buoy = VGroup(poly([(0.65, 0.3), (1.05, 0.3), (0.98, 0.08), (0.72, 0.08)], HOT, INK, 2), L((0.85, 0.3), (0.85, 0.6), "#555555", 4))
    return VGroup(sea, wv, wall, turb, buoy)


def geo_power():
    ground = R(2.2, 1.5, SOIL, 0, -0.85, rad=0.04, stroke=BROWN_DARK, sw=2)
    hot = E(1.6, 0.35, "#E2573F", 0, -1.45, stroke=None, sw=0, op=0.7)
    bld = R(0.9, 0.6, "#E9EDF2", 0, 0.2, rad=0.04, stroke=GRAY_D, sw=3)
    stm = VGroup(*[Circle(radius=0.08 + 0.05 * i, fill_color=WHITE, fill_opacity=0.9 - 0.15 * i, stroke_width=0)
                   .move_to([-0.2 + 0.05 * i, 0.6 + 0.2 * i, 0]) for i in range(3)])
    p1 = L((-0.15, -0.1), (-0.15, -1.4), HOT, 6)
    p2 = L((0.15, -1.4), (0.15, -0.1), COLD, 6)
    return VGroup(ground, hot, p1, p2, bld, stm)


def cow(s=1.0):
    body = E(1.0, 0.5, WHITE, 0, 0, stroke="#555555", sw=3)
    spots = VGroup(E(0.22, 0.16, "#333333", -0.15, 0.05, stroke=None, sw=0), E(0.18, 0.14, "#333333", 0.2, -0.06, stroke=None, sw=0))
    head = E(0.36, 0.3, WHITE, 0.6, 0.15, stroke="#555555", sw=3)
    legs = VGroup(*[L((x, -0.2), (x, -0.5), "#555555", 5) for x in (-0.3, -0.12, 0.15, 0.32)])
    return VGroup(legs, body, spots, head).scale(s)


def bio_farm():
    barn = VGroup(R(1.0, 0.7, "#C9634A", -0.9, 0.0, rad=0.02, stroke="#8A3A27", sw=2),
                  poly([(-1.5, 0.33), (-0.9, 0.75), (-0.3, 0.33)], "#8A3A27", "#8A3A27", 2))
    c = cow(0.75).move_to([0.25, -0.15, 0])
    tank = VGroup(poly([(0.85, -0.35), (0.85, 0.05), (1.0, 0.3), (1.35, 0.3), (1.5, 0.05), (1.5, -0.35)], "#7CB85A", "#3F6A26", 2),
                  T("가스", 18, WHITE).move_to([1.17, -0.05, 0]))
    return VGroup(barn, c, tank)


def solar_heater():
    """태양열 집열판(지붕 위 검은 판 + 물통)"""
    roof = poly([(-1.2, -0.4), (0, 0.5), (1.2, -0.4)], "#C9634A", "#8A3A27", 3)
    panel = poly([(-0.6, 0.0), (0.25, 0.62), (0.45, 0.42), (-0.4, -0.2)], "#2A2F36", INK, 2)
    tankh = R(0.5, 0.28, "#DDE3EA", 0.65, 0.65, rad=0.1, stroke=GRAY_D, sw=2)
    s = sun_hot(0.3).move_to([-1.0, 1.0, 0])
    wall = R(1.8, 0.8, "#F4E3C3", 0, -0.8, rad=0.02, stroke="#A9733F", sw=2)
    return VGroup(wall, roof, panel, tankh, s)


def island_wind():
    sea = E(4.0, 1.2, SEA, 0, -0.3, stroke=None, sw=0)
    land = E(2.4, 0.6, HILL, 0, -0.15, stroke="#6E9A55", sw=3)
    wm = VGroup(*[windmill(0.9, 0.35).move_to([x, 0.55, 0]) for x in (-0.6, 0.1, 0.8)])
    wind = VGroup(*[smooth([(-2.0, y), (-1.6, y + 0.08), (-1.2, y)], "#7FA6C0", 4) for y in (0.9, 0.5)])
    return VGroup(sea, land, wm, wind)


def desert_sun():
    sand = poly([(-1.8, -0.6), (-0.6, -0.1), (0.4, -0.4), (1.8, 0.0), (1.8, -0.9), (-1.8, -0.9)], "#F0D7A0", "#D9B26A", 3)
    s = sun_hot(0.45).move_to([0.9, 0.8, 0])
    pv = solar_panel(1.0).move_to([-0.6, 0.1, 0])
    return VGroup(sand, s, pv)


def village(W=12.6, H=5.4):
    """앱 u4-2 「재생 에너지 마을」(800×430)을 본뜬 그림. .spots[k](sun·wind·water·sea·geo·bio)·.P(x, y)"""
    s = W / 800.0

    def P(x, y):
        return np.array([(x - 400) * s, (215 - y) * s, 0])
    g = VGroup()
    sky = Rectangle(width=W, height=H * 0.62, fill_color=SKY, fill_opacity=1, stroke_width=0).move_to(P(400, 130))
    sky.stretch_to_fit_height(260 * s).move_to(P(400, 130))
    hill = Polygon(*[P(*p) for p in [(0, 200), (120, 160), (240, 175), (330, 120), (440, 100), (560, 150), (640, 205), (640, 240), (0, 240)]],
                   fill_color=HILL, fill_opacity=1, stroke_width=0)
    field = Rectangle(width=800 * s, height=100 * s, fill_color=GRASS, fill_opacity=1, stroke_width=0).move_to(P(400, 285))
    soil = Rectangle(width=800 * s, height=100 * s, fill_color=SOIL, fill_opacity=1, stroke_width=0).move_to(P(400, 380))
    hotl = Rectangle(width=800 * s, height=26 * s, fill_color="#E2733A", fill_opacity=1, stroke_width=0).move_to(P(400, 418))
    g.add(sky, hill, field, soil, hotl)
    sunb = sun_hot(0.42).move_to(P(58, 50))
    g.add(sunb)
    spots = {}
    # 태양: 집 + 지붕 전지판
    hs = house(1.6).move_to(P(146, 200))
    v = hs[1].get_vertices()   # 지붕: 왼쪽 아래 · 꼭대기 · 오른쪽 아래
    a, b_ = v[1] + 0.3 * (v[2] - v[1]), v[1] + 0.85 * (v[2] - v[1])
    nrm = np.array([0.6, 0.8, 0]) * 0.3
    pv = Polygon(a + nrm * 0.15, b_ + nrm * 0.15, b_ + nrm, a + nrm, fill_color="#244A7A", fill_opacity=1, stroke_color="#CFE7F2", stroke_width=2)
    spots["sun"] = VGroup(hs, pv)
    # 풍력
    w1 = windmill(1.25, 0.5).move_to(P(272, 120))
    w2 = windmill(1.45, 0.6).move_to(P(322, 102))
    spots["wind"] = VGroup(w1, w2)
    # 수력
    spots["water"] = fit(dam(), 2.0, 1.9).move_to(P(446, 165))
    # 해양
    spots["sea"] = fit(sea_power(), 2.4, 2.2).move_to(P(724, 262))
    # 지열
    spots["geo"] = fit(geo_power(), 1.6, 2.6).move_to(P(582, 322))
    # 바이오
    spots["bio"] = fit(bio_farm(), 3.4, 1.4).move_to(P(412, 290))
    for k in ("sun", "wind", "water", "bio", "geo", "sea"):
        g.add(spots[k])
    g.spots = spots
    g.P = P
    return g


# ══════════════ 지속가능 ══════════════
def desk_pc(on=True):
    desk = R(1.6, 0.18, "#C9965F", 0, -0.5, rad=0.03, stroke=BROWN_DARK, sw=2)
    scr = R(1.0, 0.7, "#5FB4EA" if on else "#2F2F36", 0, 0.05, rad=0.06, stroke="#2F2F36", sw=4)
    st = R(0.12, 0.2, "#555555", 0, -0.38, rad=0.01, stroke=None, sw=0)
    return VGroup(desk, st, scr)


def fan(on=True):
    pole = VGroup(L((0, -0.1), (0, -0.8), GRAY_D, 5), L((-0.3, -0.8), (0.3, -0.8), GRAY_D, 5))
    head = C(0.42, "#EEF2F5", 0, 0.2, stroke=GRAY_D, sw=3)
    bl = VGroup(*[E(0.18, 0.36, "#7FB8D6", 0, 0.38, stroke=None, sw=0).rotate(a, about_point=[0, 0.2, 0]) for a in (0, 2.1, 4.2)])
    g = VGroup(pole, head, bl)
    if on:
        g.add(Arc(radius=0.55, start_angle=0.3, angle=1.2, stroke_color="#7FB8D6", stroke_width=3).move_arc_center_to([0, 0.2, 0]))
    return g


def ceiling_light(on=True):
    g = VGroup()
    for x in (-0.6, 0.6):
        g.add(R(1.0, 0.2, "#FFF3B0" if on else "#CFD5DD", x, 0, rad=0.08, stroke="#8A93A3", sw=2))
        if on:
            for dx in (-0.3, 0, 0.3):
                g.add(L((x + dx, -0.16), (x + dx * 1.5, -0.45), "#F0C24B", 3))
    return g


def classroom(on=None, W=10.0, H=4.2):
    """빈 교실: .dev = {light, pc, tv, fan} — on은 켜진 것들의 집합"""
    on = {"light", "pc", "tv", "fan"} if on is None else set(on)
    wall = R(W, H, "#FFFBE8" if "light" in on else "#E9EDF2", 0, 0, rad=0.1, stroke=SOFT, sw=3)
    floor = R(W, 0.7, "#D8C3A0", 0, -H / 2 + 0.35, rad=0.02, stroke=None, sw=0)
    board = VGroup(R(2.8, 1.5, "#2F5D48", -W / 2 + 1.9, 0.6, rad=0.06, stroke="#8A5A2B", sw=5),
                   T("이동 수업 중", 26, WHITE).move_to([-W / 2 + 1.9, 0.6, 0]))
    dev = {
        "light": ceiling_light("light" in on).move_to([0.2, H / 2 - 0.35, 0]),
        "pc": desk_pc("pc" in on).move_to([-0.5, -0.65, 0]),
        "tv": tv("tv" in on).scale(1.4).move_to([W / 2 - 1.5, 0.75, 0]),
        "fan": fan("fan" in on).move_to([1.5, -0.6, 0]),
    }
    desks = VGroup(R(1.0, 0.14, "#C9965F", -W / 2 + 1.3, -1.05, rad=0.02, stroke=None, sw=0),
                   R(1.0, 0.14, "#C9965F", -W / 2 + 2.6, -1.05, rad=0.02, stroke=None, sw=0))
    g = VGroup(wall, floor, board, desks, *dev.values())
    g.dev = dev
    return g


def ladder(h=1.0, col=GREEN):
    g = VGroup(L((-0.22, -h / 2), (-0.22, h / 2), col, 6), L((0.22, -h / 2), (0.22, h / 2), col, 6))
    for i in range(4):
        y = -h / 2 + h * (i + 0.5) / 4
        g.add(L((-0.22, y), (0.22, y), col, 5))
    return g


def slide(h=1.0, col="#E07A3C"):
    return VGroup(smooth([(-0.4, h / 2), (-0.1, h / 2 - 0.05), (0.05, 0.0), (0.2, -h / 2 + 0.1), (0.5, -h / 2)], col, 9),
                  L((-0.4, h / 2), (-0.4, -h / 2), col, 5))


# ══════════════ 효율 ══════════════
def faucet(running=True, sensor=False, w=2.6, label=""):
    base = R(2.2, 0.32, "#E9EDF2", 0, -1.2, rad=0.08, stroke="#8A93A3", sw=2)
    spout = VGroup(R(1.0, 0.24, "#C6CCD8", -0.2, 0.8, rad=0.06, stroke=GRAY_D, sw=2),
                   R(0.24, 0.45, "#C6CCD8", 0.18, 0.6, rad=0.06, stroke=GRAY_D, sw=2))
    head = C(0.08, HOT, -0.45, 0.8, stroke=None, sw=0) if sensor else R(0.24, 0.24, GRAY_D, -0.45, 1.05, rad=0.04, stroke=None, sw=0)
    g = VGroup(base, spout, head)
    if running:
        g.add(R(0.16, 1.55, WATER, 0.18, -0.38, rad=0.04, stroke=None, sw=0))
    if label:
        g.add(T(label, 28, INK).move_to([0, 1.55, 0]))
    return g


GRADE_COLS = ["#2E9E5B", "#7CBF3A", "#E8C21E", "#F08A1C", "#D2453B"]


def grade_label(pick=None, w=3.0):
    """에너지 소비 효율 등급 표(1~5등급 막대). pick: 강조할 등급"""
    g = VGroup()
    box = R(w, 3.0, PAPER, 0, 0, rad=0.12, stroke=INK, sw=3)
    head = T("에너지 소비 효율 등급", 22, INK).move_to([0, 1.2, 0])
    g.add(box, head)
    bars = VGroup()
    for i in range(5):
        y = 0.75 - i * 0.48
        bw = 1.1 + 0.32 * i
        b = poly([(-w / 2 + 0.25, y + 0.18), (-w / 2 + 0.25 + bw, y + 0.18), (-w / 2 + 0.45 + bw, y), (-w / 2 + 0.25 + bw, y - 0.18),
                  (-w / 2 + 0.25, y - 0.18)], GRADE_COLS[i], INK, 2)
        t = T(f"{i + 1}", 22, WHITE).move_to([-w / 2 + 0.45, y, 0])
        bars.add(VGroup(b, t))
    g.add(bars)
    g.bars = bars
    if pick:
        y = 0.75 - (pick - 1) * 0.48
        arr = poly([(w / 2 - 0.15, y + 0.2), (w / 2 - 0.15, y - 0.2), (w / 2 - 0.5, y)], INK, INK, 1)
        g.add(arr)
    return g


def multitap():
    body = R(2.2, 0.5, WHITE, 0, 0, rad=0.12, stroke=INK, sw=3)
    holes = VGroup(*[VGroup(Dot([x - 0.06, 0, 0], radius=0.04, color=INK), Dot([x + 0.06, 0, 0], radius=0.04, color=INK)) for x in (-0.5, 0.0, 0.5)])
    sw_ = R(0.3, 0.3, "#E2573F", 0.88, 0, rad=0.05, stroke=INK, sw=2)
    cord = smooth([(-1.1, 0), (-1.5, -0.2), (-1.8, 0.1)], INK, 4)
    return VGroup(cord, body, holes, sw_)


def led_bulb(on=True):
    bulb = C(0.42, "#FFF6C8" if on else "#EEEEEE", 0, 0.25, stroke="#B58400", sw=3)
    base = VGroup(R(0.42, 0.34, "#DDE3EA", 0, -0.32, rad=0.04, stroke=GRAY_D, sw=2), R(0.26, 0.12, GRAY_D, 0, -0.55, rad=0.03, stroke=None, sw=0))
    led = T("LED", 20, "#B58400").move_to([0, 0.25, 0])
    g = VGroup(bulb, base, led)
    if on:
        for a in np.linspace(0.3, PI - 0.3, 5):
            d = np.array([np.cos(a), np.sin(a), 0])
            g.add(Line([0, 0.25, 0] + d * 0.55, [0, 0.25, 0] + d * 0.8, stroke_color="#F2B705", stroke_width=4))
    return g


def rain_barrel():
    barrel = R(1.0, 1.2, "#5FA8D3", 0, -0.2, rad=0.12, stroke=INK, sw=3)
    lid = R(1.1, 0.14, "#2F6FB0", 0, 0.42, rad=0.04, stroke=INK, sw=2)
    drops = VGroup(*[water_drop(s=0.25).move_to([x, 1.0 + 0.1 * i, 0]) for i, x in enumerate((-0.3, 0.1, 0.4))])
    return VGroup(barrel, lid, drops)


def paper_back():
    """이면지(뒷면에 다시 쓰는 종이)"""
    a = R(1.0, 1.3, "#F2F2F2", -0.12, 0.08, rad=0.03, stroke=SOFT, sw=2)
    b = R(1.0, 1.3, WHITE, 0.08, -0.08, rad=0.03, stroke=INK, sw=2)
    ln = VGroup(*[L((-0.3, y), (0.45, y), "#9CC7E6", 3) for y in (0.3, 0.05, -0.2, -0.45)])
    return VGroup(a, b, ln)


def model_house(bub=1, wood=False, clay=False, warm=False, temp=None, name="", w=3.0):
    """앱 u4-4 집 모형(200×190 그림을 그대로 옮김). 위 탐침 온도계에 temp(글)"""
    s = w / 200.0

    def P(x, y):
        return [(x - 100) * s, (100 - y) * s, 0]
    g = VGroup()
    st = WOOD if wood else "#A9733F"
    sw = 12 if wood else 3
    body = Polygon(P(30, 70), P(170, 70), P(170, 160), P(30, 160), fill_color="#F4E3C3", fill_opacity=1, stroke_color=st, stroke_width=sw)
    roof = Polygon(P(18, 74), P(100, 18), P(182, 74), fill_color="#D9B48A", fill_opacity=1, stroke_color=st, stroke_width=sw)
    win = Polygon(P(48, 92), P(100, 92), P(100, 132), P(48, 132), fill_color="#CFE7F2", fill_opacity=1, stroke_color="#7FB8D6", stroke_width=2)
    g.add(body, roof, win)
    if bub:
        r = 0.055 if bub > 1 else 0.04
        for i in range(4):
            for j in range(3):
                g.add(Circle(radius=r, fill_color=WHITE, fill_opacity=0.95, stroke_color="#7FB8D6", stroke_width=1).move_to(P(56 + i * 12, 100 + j * 12)))
    if clay:
        for x, y in ((32, 72), (168, 72), (32, 158), (168, 158), (100, 20)):
            g.add(Circle(radius=0.09, fill_color=CLAY, fill_opacity=1, stroke_width=0).move_to(P(x, y)))
    if warm:
        g.add(RoundedRectangle(corner_radius=0.06, width=44 * s, height=18 * s, fill_color=HOT, fill_opacity=1, stroke_width=0).move_to(P(132, 147)))
    probe = Line(P(100, -6), P(100, 98), stroke_color=GRAY_D, stroke_width=4)
    disp = RoundedRectangle(corner_radius=0.08, width=1.25, height=0.5, fill_color="#2F2F36", fill_opacity=1, stroke_width=0).move_to(P(100, -20))
    g.add(probe, disp)
    g.disp = disp
    g.temp = None
    if temp is not None:
        tt = T(temp, 28, "#9FF0B0").move_to(disp)
        g.add(tt)
        g.temp = tt
    if name:
        nm = T(name, 26, INK).move_to(P(100, 186))
        g.add(nm)
        g.name = nm
    return g


def temp_text(v, disp):
    return T(v, 28, "#9FF0B0").move_to(disp)


LT = [29.8, 27.3, 26.6, 26.0, 25.7, 25.5]   # 앱 u4-4 단열하지 않은 집 모형(지도서 예시 결과)
RT = [29.8, 29.4, 29.1, 28.5, 28.2, 27.9]   # 단열을 한 집 모형


def temp_lines(W=7.4, H=3.6, y0=25.0, y1=30.0):
    """두 집 모형 온도 꺾은선(가로: 처음~5분 뒤). .ax .l1 .l2 .d1 .d2 .P(i, v)"""
    def P(i, v):
        return np.array([i / 5 * W, (v - y0) / (y1 - y0) * H, 0])
    g = VGroup()
    grid = VGroup()
    for v in range(int(y0), int(y1) + 1):
        grid.add(Line(P(0, v), P(5, v), stroke_color="#E3D6C9", stroke_width=2))
        grid.add(T(f"{v}", 22, SOFT).move_to(P(0, v) + LEFT * 0.35))
    xl = VGroup(*[T("처음" if i == 0 else f"{i}분", 22, SOFT).move_to(P(i, y0) + DOWN * 0.32) for i in range(6)])
    ax = VGroup(Line(P(0, y0), P(5, y0), stroke_color=INK, stroke_width=4), Line(P(0, y0), P(0, y1) + UP * 0.2, stroke_color=INK, stroke_width=4))
    unit = T("(°C)", 22, SOFT).next_to(ax[1], UP, buff=0.08)

    def series(vals, col):
        pts = [P(i, v) for i, v in enumerate(vals)]
        ln = VGroup(*[Line(pts[i], pts[i + 1], stroke_color=col, stroke_width=6) for i in range(5)])
        ds = VGroup(*[Dot(p, radius=0.08, color=col) for p in pts])
        return ln, ds
    l1, d1 = series(LT, HOT)
    l2, d2 = series(RT, COLD)
    g.add(grid, xl, ax, unit, l1, l2, d1, d2)
    g.ax, g.l1, g.l2, g.d1, g.d2, g.P = ax, l1, l2, d1, d2, P
    g.move_to(ORIGIN)
    return g


def eco_house(W=10.0):
    """앱 u4-4 에너지 효율 집(640×360). .spots[k](ins·win·sh·hx·gd·pv·geo)"""
    s = W / 640.0

    def P(x, y):
        return np.array([(x - 320) * s, (180 - y) * s, 0])

    def poly_(pts, fill, stroke=INK, sw=3, op=1.0):
        return Polygon(*[P(*p) for p in pts], fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)

    def rr(x, y, w, h, fill, stroke=INK, sw=3):
        return poly_([(x, y), (x + w, y), (x + w, y + h), (x, y + h)], fill, stroke, sw)
    g = VGroup()
    g.add(rr(0, 0, 640, 270, "#E6F4FB", "#E6F4FB", 0), rr(0, 270, 640, 90, SOIL, SOIL, 0), rr(0, 262, 640, 10, "#7FBF6A", "#7FBF6A", 0))
    g.add(sun_hot(0.35).move_to(P(590, 44)))
    g.add(rr(120, 120, 400, 142, "#FFF7E8", "#8A5A2B", 3))
    g.add(poly_([(310, 120), (310, 108), (520, 70), (520, 120)], "#C9634A", "#8A3A27", 2))
    sp = {}
    ins = VGroup(rr(120, 120, 14, 142, "#F2D16A", "#C9A12F", 2),
                 *[Line(P(120, 130 + 20 * i), P(134, 140 + 20 * i), stroke_color="#C9A12F", stroke_width=2) for i in range(6)])
    win = VGroup(rr(160, 160, 70, 52, "#CFE7F2", "#3F84AD", 3), Line(P(172, 160), P(172, 212), stroke_color="#3F84AD", stroke_width=2),
                 Line(P(184, 160), P(184, 212), stroke_color="#3F84AD", stroke_width=2))
    sh = VGroup(poly_([(150, 150), (240, 150), (232, 136), (158, 136)], "#4FA457", "#2F6A36", 2),
                DashedLine(P(560, 70), P(250, 140), stroke_color="#F0C24B", stroke_width=3, dash_length=0.15))
    hx = VGroup(rr(310, 190, 60, 56, "#D6DBE4", GRAY_D, 2),
                Arrow(P(322, 206), P(360, 206), buff=0, stroke_color=HOT, stroke_width=4, max_tip_length_to_length_ratio=0.35),
                Arrow(P(358, 228), P(320, 228), buff=0, stroke_color=COLD, stroke_width=4, max_tip_length_to_length_ratio=0.35))
    gd = VGroup(rr(120, 108, 190, 14, "#8A5A2B", "#8A5A2B", 1),
                *[Circle(radius=r * s, fill_color="#4FA457", fill_opacity=1, stroke_width=0).move_to(P(x, y))
                  for x, y, r in ((140, 104, 10), (170, 100, 13), (210, 104, 10), (250, 100, 12), (290, 104, 9))])
    pvp = VGroup(rr(0, 0, 140, 24, "#244A7A", "#CFE7F2", 2),
                 *[Line(P(35 * i, 0), P(35 * i, 24), stroke_color="#9CC6E6", stroke_width=1.5) for i in (1, 2, 3)],
                 Line(P(0, 12), P(140, 12), stroke_color="#9CC6E6", stroke_width=1.5))
    pvp.rotate(10.3 * PI / 180, about_point=P(0, 0)).shift(P(350, 100) - P(0, 0))
    geo = VGroup(rr(430, 226, 60, 22, "#D6DBE4", GRAY_D, 2),
                 Line(P(440, 248), P(440, 340), stroke_color=HOT, stroke_width=5), Line(P(480, 340), P(480, 248), stroke_color=HOT, stroke_width=5),
                 Arc(radius=20 * s, start_angle=PI, angle=PI, stroke_color=HOT, stroke_width=5).move_arc_center_to(P(460, 340)),
                 Line(P(450, 248), P(450, 334), stroke_color=COLD, stroke_width=4), Line(P(470, 334), P(470, 248), stroke_color=COLD, stroke_width=4))
    sp.update(ins=ins, win=win, sh=sh, hx=hx, gd=gd, pv=pvp, geo=geo)
    for k in ("ins", "win", "sh", "hx", "gd", "pv", "geo"):
        g.add(sp[k])
    g.spots = sp
    g.P = P
    return g


def night_city(lights=True, W=6.0):
    sky = R(W, 3.0, "#1E2A4A", 0, 0, rad=0.12, stroke=None, sw=0)
    g = VGroup(sky)
    moon = C(0.25, "#F7E9A0", W / 2 - 0.6, 1.0, stroke=None, sw=0)
    g.add(moon)
    xs = np.linspace(-W / 2 + 0.6, W / 2 - 0.6, 6)
    hs = [1.4, 2.0, 1.2, 1.8, 1.5, 1.1]
    for x, h in zip(xs, hs):
        b = R(0.8, h, "#3A4766", x, -1.5 + h / 2, rad=0.02, stroke=None, sw=0)
        g.add(b)
        for j in range(int(h / 0.4)):
            for dx in (-0.18, 0.18):
                g.add(R(0.16, 0.16, "#FFE28A" if lights else "#2A3350", x + dx, -1.5 + 0.3 + j * 0.4, rad=0.01, stroke=None, sw=0))
    return g


def arrow_lr(x0, x1, y, col=INK, sw=8):
    return Arrow([x0, y, 0], [x1, y, 0], buff=0, stroke_color=col, stroke_width=sw, max_tip_length_to_length_ratio=0.2)


def bus(w=2.4):
    body = R(w, w * 0.42, "#F2B33D", 0, 0, rad=0.14, stroke=INK, sw=3)
    wins = VGroup(*[R(w * 0.16, w * 0.13, "#CFE8F7", -w * 0.33 + i * w * 0.2, w * 0.07, rad=0.03, stroke=INK, sw=2) for i in range(4)])
    wh = VGroup(C(w * 0.08, "#333333", -w * 0.3, -w * 0.21, sw=2), C(w * 0.08, "#333333", w * 0.3, -w * 0.21, sw=2))
    return VGroup(body, wins, wh)


def phone_charge():
    ph = R(0.7, 1.3, "#2F2F36", 0, 0, rad=0.1, stroke=INK, sw=3)
    scr = R(0.56, 1.0, "#9CD3F2", 0, 0.05, rad=0.05, stroke=None, sw=0)
    bat = VGroup(R(0.3, 0.5, WHITE, 0, 0.05, rad=0.04, stroke=INK, sw=2), R(0.22, 0.3, GREEN, 0, -0.03, rad=0.02, stroke=None, sw=0))
    cord = smooth([(0, -0.65), (0.1, -0.95), (0.6, -1.0), (0.9, -0.7)], INK, 4)
    return VGroup(ph, scr, bat, cord)


def heater_door(closed=True):
    """교실 문을 닫아 열이 빠져나가지 않게"""
    frame = R(1.3, 2.0, "#E9DDC8", 0, 0, rad=0.02, stroke=BROWN_DARK, sw=3)
    door = R(1.1, 1.85, "#C9965F", 0, -0.05, rad=0.02, stroke=BROWN_DARK, sw=3)
    knob = C(0.06, "#E2B13C", 0.38, -0.1, stroke=None, sw=0)
    win = R(0.5, 0.45, "#CFE7F2", 0, 0.45, rad=0.02, stroke=BROWN_DARK, sw=2)
    heat = VGroup(*[smooth([(x, -0.6), (x - 0.08, -0.4), (x + 0.08, -0.2), (x, 0.0)], HOT, 4) for x in (-1.1, -0.8)])
    return VGroup(frame, door, knob, win, heat)
