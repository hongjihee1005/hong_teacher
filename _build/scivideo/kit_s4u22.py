"""4-2 2단원 「생물과 환경」 전용 그림 부품 (s4ep22~26, s4mm05)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit().
  생물: PIC[이름]() — 3학년 동물 그림(kit_s3u12)·균류·세균(kit_s4u14)에 새 그림(매·직박구리·박새·갈매기·메뚜기·족제비·
        다람쥐·고라니·파리·토끼풀·괭이밥·풀·나무 여러 가지·소나무·미역)을 더함
  비생물: sun · drop(물) · air(공기) · soil(흙) · stone(돌)
  먹이 관계: node(이름) 카드 · arrow(먹이 카드, 먹는 카드) — 화살표는 앱과 같이 '먹이 → 먹는 생물', 빨강
  환경: ship · oil_film · weed · dish(싹 튼 씨) · mask_bird · wall(방음벽) · fish_ladder · eco_bridge · leaf
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Arrow, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK
from kit_s3u12 import fit, E, C, L, poly, smooth, eye, text_card, ox_mark, bin_box, slots  # noqa: F401
import kit_s3u12 as A3
import kit_s3u14 as A14
import kit_s4u14 as A4

SW = 4
LEAF = "#5FAE4A"
LEAF_D = "#2F6A2A"
TRUNK = "#8A5A2B"
SOILC = "#9A6A3A"
SKY = "#D6EFFA"
SEA = "#3F8FC4"
RIVER = "#6FB6DC"
GRASSC = "#9CC56A"
YEL = "#FFD21F"


def R(w, h, fill, x=0, y=0, rad=0.12, stroke=INK, sw=SW, op=1.0):
    return RoundedRectangle(corner_radius=min(rad, w / 2 - 1e-3, h / 2 - 1e-3), width=w, height=h, fill_color=fill,
                            fill_opacity=op, stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


# ══════════════ 새 ══════════════
def bird(body, head, wing, beak="#E8A23A", cheek=None, belly=None, beak_len=0.32, legs=True, cap=None):
    """옆모습 새(머리가 왼쪽). 앱의 bird(b,h,w,o)를 본뜸"""
    g = VGroup()
    tail = poly([(0.75, 0.05), (1.2, 0.2), (1.15, -0.12)], wing)
    bd = E(1.6, 0.85, body, 0.1, -0.05)
    g.add(tail)
    if legs:
        g.add(L((0.0, -0.45), (-0.05, -0.75), "#A66", 4), L((0.25, -0.45), (0.25, -0.75), "#A66", 4))
    g.add(bd)
    if belly:
        g.add(E(0.95, 0.35, belly, -0.05, -0.25, sw=0))
    g.add(E(0.9, 0.42, wing, 0.3, 0.0).rotate(-0.2))
    hd = C(0.36, head, -0.62, 0.35)
    g.add(hd)
    if cap:
        g.add(Arc(radius=0.36, start_angle=0.3, angle=2.4, stroke_color=cap, stroke_width=14).move_arc_center_to([-0.62, 0.35, 0]))
    if cheek:
        g.add(E(0.3, 0.2, cheek, -0.62, 0.24, sw=0))
    g.add(poly([(-0.92, 0.42), (-0.92 - beak_len, 0.33), (-0.92, 0.26)], beak, sw=2))
    g.add(eye(-0.75, 0.42, 0.05))
    return g


def hawk():
    return bird("#8A7563", "#8A7563", "#5E4B3C", beak="#E0B23A", cheek="#3D3027", belly="#E8DCCB", beak_len=0.22)


def bulbul():
    return bird("#8F969E", "#9AA1A8", "#6D747C", cheek="#9A5B3E", belly="#C9CED2")


def great_tit():
    return bird("#9DB070", "#222222", "#5F6F7A", beak="#333333", cheek="#FFFFFF", belly="#E9EADF", beak_len=0.2)


def gull():
    return bird("#F4F6F8", "#F4F6F8", "#9AA7B3", beak="#E8C23A", legs=False)


# ══════════════ 동물 ══════════════
def grasshopper():
    col = "#7DBE4A"
    g = VGroup()
    g.add(L((0.1, -0.1), (0.75, 0.45), LEAF_D, 7), L((0.75, 0.45), (1.05, -0.35), LEAF_D, 5))
    g.add(L((-0.3, -0.15), (-0.45, -0.45), LEAF_D, 4), L((-0.05, -0.15), (-0.1, -0.45), LEAF_D, 4))
    g.add(E(1.5, 0.42, col, 0.15, 0.0))
    g.add(E(0.95, 0.22, "#5E9A36", 0.35, 0.12).rotate(-0.08))
    g.add(C(0.24, col, -0.68, 0.06))
    g.add(smooth([(-0.75, 0.25), (-0.95, 0.65), (-1.25, 0.8)], INK, 3))
    g.add(eye(-0.75, 0.1, 0.05))
    return g


def weasel():
    col = "#C9862F"
    g = VGroup()
    g.add(smooth([(0.85, 0.0), (1.2, 0.1), (1.45, 0.35)], BROWN_DARK, 16))
    g.add(L((-0.45, -0.2), (-0.5, -0.5), BROWN_DARK, 7), L((0.6, -0.2), (0.65, -0.5), BROWN_DARK, 7))
    g.add(E(1.9, 0.5, col, 0.1, 0.0))
    g.add(E(0.6, 0.42, col, -0.95, 0.2))
    g.add(C(0.1, col, -0.8, 0.45, sw=3))
    g.add(Dot([-1.25, 0.2, 0], radius=0.05, color=INK), eye(-1.0, 0.27, 0.045))
    g.add(E(0.4, 0.15, "#F3E2C2", -0.95, 0.06, sw=0))
    return g


def squirrel():
    col = "#C98A4B"
    g = VGroup()
    g.add(smooth([(0.35, -0.45), (0.95, -0.2), (1.0, 0.45), (0.6, 0.75), (0.45, 0.4)], "#6B3D16", 30))
    g.add(smooth([(0.35, -0.45), (0.95, -0.2), (1.0, 0.45), (0.6, 0.75), (0.45, 0.4)], "#C07A3E", 22))
    g.add(E(0.9, 0.8, col, 0.05, -0.15))
    g.add(C(0.33, col, -0.35, 0.35))
    g.add(poly([(-0.3, 0.6), (-0.22, 0.85), (-0.12, 0.6)], col, sw=3))
    g.add(eye(-0.48, 0.4, 0.05), L((-0.1, -0.05), (0.0, -0.45), "#5A3010", 4))
    return g


def gorani():
    """고라니(사슴 무리, 뿔 없음)"""
    col = "#B58A5A"
    g = VGroup()
    for x in (-0.45, -0.25, 0.4, 0.6):
        g.add(L((x, -0.25), (x, -0.95), "#7A5530", 7))
    g.add(E(1.5, 0.65, col, 0.1, 0.0))
    g.add(poly([(-0.5, 0.15), (-0.75, 0.75), (-0.5, 0.75), (-0.3, 0.2)], col))
    g.add(E(0.55, 0.32, col, -0.8, 0.82).rotate(-0.3))
    g.add(E(0.18, 0.32, col, -0.55, 1.07).rotate(-0.5))
    g.add(eye(-0.8, 0.88, 0.045), Dot([-1.05, 0.75, 0], radius=0.05, color=INK))
    return g


def fly():
    g = VGroup()
    g.add(E(0.55, 0.32, "#BFE3F5", 0.1, 0.25, stroke="#7AA7BD", sw=3, op=0.8).rotate(0.5))
    g.add(E(0.55, 0.32, "#BFE3F5", 0.3, 0.2, stroke="#7AA7BD", sw=3, op=0.8).rotate(-0.4))
    g.add(E(0.8, 0.38, "#3A3A44", 0.15, -0.05))
    g.add(C(0.2, "#3A3A44", -0.35, 0.0))
    g.add(C(0.08, "#C0392B", -0.42, 0.06, sw=0))
    for x in (-0.05, 0.15, 0.35):
        g.add(L((x, -0.2), (x - 0.1, -0.45), INK, 3))
    return g


def strider():
    """소금쟁이: 가는 몸 + 아주 긴 다리"""
    g = VGroup()
    for (a, b, c) in (((-0.2, 0.0), (-0.6, 0.35), (-1.1, 0.3)), ((0.1, 0.0), (0.5, 0.4), (1.1, 0.5)), ((0.1, 0.0), (0.5, -0.35), (1.1, -0.45)),
                      ((-0.2, 0.0), (-0.55, -0.3), (-1.0, -0.4))):
        g.add(smooth([a, b, c], INK, 3))
    g.add(E(0.9, 0.18, "#4A4F57", 0, 0), C(0.09, "#4A4F57", -0.5, 0.0, sw=2))
    return g


def caterpillar():
    return A14.caterpillar(2.2)


def mushroom():
    return A4.mushroom(0.9)


def mold():
    return A4.mold_view(0.8)


def bacteria():
    g = VGroup(C(0.8, "#F6F0F8", stroke="#555555", sw=6))
    b = A4.bacillus(4, "#B98AD0", 0.42, 0.15)
    fit(b, 1.1, 1.0)
    g.add(b.move_to(ORIGIN))
    return g


def half_moon():
    """반달말(크게 확대): 초록 반달 모양 몇 개"""
    g = VGroup(C(0.8, "#EEF6F8", stroke="#555555", sw=6))
    for (x, y, a) in ((-0.25, 0.2, -0.5), (0.25, -0.05, 0.4), (-0.1, -0.35, 1.2)):
        m = Arc(radius=0.28, start_angle=0.3, angle=PI - 0.6, stroke_color=LEAF_D, stroke_width=14)
        g.add(m.rotate(a).move_to([x, y, 0]))
    return g


# ══════════════ 식물 ══════════════
def tree(col="#4F8F3A", fruit=None, fruit_col=None, flower=None):
    g = VGroup(R(0.34, 1.1, TRUNK, 0, -0.5, rad=0.05, stroke=BROWN_DARK, sw=3))
    for (x, y, r) in ((-0.45, 0.25, 0.5), (0.45, 0.25, 0.5), (0.0, 0.6, 0.6)):
        g.add(C(r, col, x, y, stroke=LEAF_D, sw=3))
    pts = [(-0.5, 0.2), (0.4, 0.45), (0.05, 0.75), (-0.25, 0.5), (0.55, 0.05)]
    if flower:
        for (x, y) in pts:
            g.add(C(0.09, flower, x, y, stroke="#C99A00", sw=2))
    if fruit:
        for (x, y) in pts[:3]:
            g.add(E(0.13, 0.17, fruit_col or "#9B6B2E", x + 0.1, y - 0.15, stroke=BROWN_DARK, sw=2))
    return g


def oak():
    return tree("#4F8F3A", fruit=True, fruit_col="#9B6B2E")


def oak2():
    return tree("#6A9C3E", fruit=True, fruit_col="#B8862E")


def cornel():
    """산수유: 노란 꽃 + 빨간 열매"""
    g = tree("#7AA64A", flower=YEL)
    for (x, y) in ((-0.2, -0.05), (0.3, 0.6)):
        g.add(E(0.13, 0.17, "#D62F2F", x, y, stroke="#7A1A1A", sw=2))
    return g


def pine():
    return VGroup(R(0.3, 0.7, TRUNK, 0, -0.75, rad=0.04, stroke=BROWN_DARK, sw=3),
                  poly([(0, 1.1), (-0.75, 0.1), (0.75, 0.1)], "#3F7D44", stroke="#2C5E2E", sw=3),
                  poly([(0, 0.6), (-0.9, -0.45), (0.9, -0.45)], "#3F7D44", stroke="#2C5E2E", sw=3))


def forsythia():
    """개나리: 휘어진 가지에 노란 꽃"""
    g = VGroup()
    for pts in ([(0, -0.8), (-0.3, 0.0), (-0.9, 0.5)], [(0, -0.8), (0.05, 0.1), (0.15, 0.8)], [(0, -0.8), (0.4, 0.0), (0.95, 0.4)]):
        g.add(smooth(pts, "#6E8F3A", 5))
    for (x, y) in ((-0.75, 0.42), (-0.45, 0.15), (-0.2, -0.15), (0.1, 0.65), (0.08, 0.3), (0.12, -0.05), (0.8, 0.35), (0.55, 0.12), (0.3, -0.2)):
        g.add(poly([(x, y + 0.12), (x - 0.1, y), (x, y - 0.12), (x + 0.1, y)], YEL, stroke="#C99A00", sw=2))
    return g


def _trileaf(cx, cy, s, col="#5CAE4A"):
    g = VGroup()
    for a in (PI / 2, PI / 2 + TAU / 3, PI / 2 - TAU / 3):
        d = np.array([np.cos(a), np.sin(a), 0]) * 0.2 * s
        g.add(E(0.36 * s, 0.32 * s, col, cx + d[0], cy + d[1], stroke=LEAF_D, sw=2))
    return g


def clover():
    """토끼풀: 잎 세 장 + 흰 꽃"""
    g = VGroup(L((0, -0.8), (0, 0.0), "#4F8F3A", 5), L((-0.45, -0.8), (-0.45, 0.35), "#4F8F3A", 4))
    g.add(_trileaf(0, 0.1, 1.2))
    g.add(C(0.24, PAPER, -0.45, 0.5, stroke="#BBBBBB", sw=3))
    return g


def wood_sorrel():
    """괭이밥: 하트 잎 세 장 + 노란 꽃"""
    g = VGroup(L((0, -0.8), (0, -0.05), "#4F8F3A", 4), L((0, -0.4), (0.5, 0.1), "#4F8F3A", 4))
    g.add(_trileaf(0, 0.05, 1.0, "#7CC35A"))
    for k in range(5):
        a = k * TAU / 5
        g.add(C(0.09, YEL, 0.5 + 0.11 * np.cos(a), 0.25 + 0.11 * np.sin(a), stroke="#C99A00", sw=2))
    return g


def grass():
    g = VGroup()
    for pts in ([(-0.3, -0.8), (-0.35, -0.2), (-0.7, 0.4)], [(-0.1, -0.8), (-0.1, 0.0), (-0.2, 0.75)],
                [(0.1, -0.8), (0.2, -0.1), (0.5, 0.55)], [(0.3, -0.8), (0.5, -0.4), (0.9, -0.15)]):
        g.add(smooth(pts, "#4F9A3A", 8))
    return g


def daisy():
    """개망초: 흰 꽃 여럿"""
    g = VGroup(L((0, -0.8), (0, 0.2), "#4F8F3A", 4), L((0, -0.2), (-0.4, 0.15), "#4F8F3A", 4), L((0, -0.2), (0.4, 0.2), "#4F8F3A", 4))
    for (x, y) in ((0, 0.3), (-0.4, 0.2), (0.4, 0.25)):
        g.add(C(0.2, PAPER, x, y, stroke="#BBBBBB", sw=2), C(0.08, "#F5C518", x, y, sw=0))
    return g


def cattail():
    g = VGroup()
    for pts in ([(-0.15, -0.9), (-0.15, 0.6)], [(0.2, -0.9), (0.2, 0.4)], [(-0.4, -0.9), (-0.55, 0.0), (-0.8, 0.5)], [(0.4, -0.9), (0.6, -0.1), (0.85, 0.3)]):
        g.add(smooth(pts, "#4F8F3A", 5) if len(pts) > 2 else L(pts[0], pts[1], "#4F8F3A", 5))
    g.add(R(0.2, 0.55, "#7A4A24", -0.15, 0.35, rad=0.09, stroke=INK, sw=2), R(0.2, 0.5, "#7A4A24", 0.2, 0.15, rad=0.09, stroke=INK, sw=2))
    return g


def seaweed():
    return A4.seaweed(1.6, "#5A6B2A")


def pondweed():
    """붕어마름: 줄기에 가는 잎이 돌려남"""
    g = VGroup(smooth([(0, -0.9), (-0.08, 0.0), (0.04, 0.9)], "#2F7A3E", 4))
    for y in (-0.55, -0.2, 0.15, 0.5):
        for dx, dy in ((-0.3, 0.12), (0.3, 0.12), (-0.2, 0.3), (0.2, 0.3)):
            g.add(L((0, y), (dx, y + dy), "#2F7A3E", 3))
    return g


def coral():
    return A3.coral()


def leaf(col="#C98A3A"):
    return E(0.5, 0.22, col, stroke="#7A4A1A", sw=2)


# ══════════════ 비생물 요소 ══════════════
def sun():
    g = VGroup(C(0.45, "#FFD23F", stroke="#E09A12", sw=4))
    for k in range(8):
        a = k * TAU / 8
        g.add(Line(0.58 * np.array([np.cos(a), np.sin(a), 0]), 0.8 * np.array([np.cos(a), np.sin(a), 0]),
                   stroke_color="#F2A900", stroke_width=7))
    return g


def drop():
    v = VMobject(fill_color="#7CC4EC", fill_opacity=1, stroke_color="#2F78B8", stroke_width=SW)
    v.set_points_smoothly([[0, 0.7, 0], [0.32, 0.05, 0], [0.38, -0.3, 0], [0, -0.58, 0], [-0.38, -0.3, 0], [-0.32, 0.05, 0], [0, 0.7, 0]])
    return VGroup(v, Arc(radius=0.2, start_angle=PI, angle=0.9, stroke_color=PAPER, stroke_width=5).move_to([-0.15, -0.15, 0]))


def air():
    g = VGroup()
    for k, y in enumerate((0.35, 0.0, -0.35)):
        g.add(smooth([(-0.75 + 0.1 * k, y), (-0.2, y + 0.12), (0.3, y - 0.05), (0.6, y + 0.12), (0.5 + 0.1 * k, y + 0.28)], "#7AA7C9", 7))
    return g


def soil():
    g = VGroup(poly([(-0.85, -0.35), (-0.5, 0.25), (0.0, 0.42), (0.5, 0.25), (0.85, -0.35)], "#A0703E", stroke="#6B4520", sw=SW))
    for (x, y) in ((-0.4, -0.1), (0.1, 0.15), (0.45, -0.15), (-0.05, -0.2)):
        g.add(Dot([x, y, 0], radius=0.05, color="#6B4520"))
    return g


def stone():
    return VGroup(poly([(-0.6, -0.3), (-0.45, 0.2), (0.1, 0.35), (0.6, 0.1), (0.55, -0.3)], "#9A9EA4", stroke="#555A60", sw=SW),
                  L((-0.2, 0.05), (0.15, -0.1), "#6E7378", 3))


def temp():
    """온도: 온도계"""
    return VGroup(R(0.26, 1.2, PAPER, 0, 0.15, rad=0.13, stroke=INK, sw=SW), C(0.24, RED, 0, -0.5, stroke=INK, sw=SW),
                  R(0.1, 0.8, RED, 0, -0.05, rad=0.05, stroke=None, sw=0))


def sand():
    g = VGroup(poly([(-0.85, -0.3), (-0.3, 0.2), (0.3, 0.25), (0.85, -0.3)], "#E2C98F", stroke="#B39A5A", sw=SW))
    for (x, y) in ((-0.3, -0.05), (0.0, 0.1), (0.3, -0.1), (0.5, -0.2), (-0.55, -0.2)):
        g.add(Dot([x, y, 0], radius=0.035, color="#B39A5A"))
    return g


PIC = {
    "토끼": A3.rabbit, "개구리": A3.frog, "뱀": A3.snake, "달팽이": A3.snail, "참새": A3.sparrow, "오리": A3.duck,
    "지렁이": A3.worm, "개미": A3.ant, "나비": A3.butterfly, "거미": A3.spider, "잠자리": A3.dragonfly, "두더지": A3.mole,
    "바다거북": A3.sea_turtle, "돌고래": A3.dolphin, "게": A3.crab, "조개": A3.clam, "다슬기": A3.snail_water, "산호": coral,
    "붕어": lambda: A3.fish("#C9A043"), "고등어": lambda: A3.fish("#5B84A8"), "소금쟁이": strider,
    "매": hawk, "직박구리": bulbul, "박새": great_tit, "갈매기": gull, "메뚜기": grasshopper, "족제비": weasel,
    "다람쥐": squirrel, "고라니": gorani, "파리": fly, "애벌레": caterpillar,
    "버섯": mushroom, "곰팡이": mold, "세균": bacteria, "반달말": half_moon,
    "상수리나무": oak, "갈참나무": oak2, "산수유": cornel, "소나무": pine, "개나리": forsythia, "나무": oak,
    "토끼풀": clover, "괭이밥": wood_sorrel, "풀": grass, "개망초": daisy, "부들": cattail, "미역": seaweed,
    "붕어마름": pondweed, "부레옥잠": A4.water_hyacinth,
    "햇빛": sun, "물": drop, "공기": air, "흙": soil, "돌": stone, "온도": temp, "모래": sand,
}


def pic(name, w=1.4, h=1.1):
    return fit(PIC[name](), w, h)


def item(name, w=1.4, h=1.1, size=28, col=INK):
    """그림 + 아래 이름"""
    p = pic(name, w, h)
    t = T(name, size, col).next_to(p, DOWN, buff=0.12)
    g = VGroup(p, t)
    g.pic, g.label = p, t
    return g


def node(name, w=1.45, h=1.15, size=26, stroke="#2F7D4A"):
    """먹이 관계 카드(앱 drawWeb의 둥근 네모: 흰 바탕 + 그림 + 이름)"""
    box = R(w, h, PAPER, rad=0.16, stroke=stroke, sw=4)
    p = pic(name, w * 0.72, h * 0.52).move_to([0, h * 0.12, 0])
    t = T(name, size).move_to([0, -h * 0.33, 0])
    if t.width > w * 0.92:
        t.scale_to_fit_width(w * 0.92)
    g = VGroup(box, p, t)
    g.box, g.pic, g.label = box, p, t
    g.name = name
    return g


def _edge_point(mob, d, pad=0.06):
    """mob 네모의 가장자리에서 방향 d로 나가는 점"""
    c = mob.get_center()
    hw, hh = mob.width / 2 + pad, mob.height / 2 + pad
    tx = hw / abs(d[0]) if abs(d[0]) > 1e-6 else 1e9
    ty = hh / abs(d[1]) if abs(d[1]) > 1e-6 else 1e9
    return c + d * min(tx, ty)


def arrow(food, eater, col=RED, sw=6):
    """먹이 카드 → 먹는 카드 화살표(앱과 같은 방향)"""
    a, b = food.get_center(), eater.get_center()
    d = (b - a) / max(np.linalg.norm(b - a), 1e-6)
    p1, p2 = _edge_point(food, d), _edge_point(eater, -d)
    return Arrow(p1, p2, buff=0, color=col, stroke_width=sw, max_tip_length_to_length_ratio=0.25,
                 max_stroke_width_to_length_ratio=12, tip_length=0.24)


# ══════════════ 환경 ══════════════
def ship():
    return VGroup(poly([(-1.3, 0.0), (1.3, 0.0), (1.0, -0.45), (-1.0, -0.45)], "#7A3A2A", stroke="#3A1A10", sw=SW),
                  R(1.0, 0.45, "#E6E6E6", -0.2, 0.23, rad=0.04, stroke="#555555", sw=3),
                  R(0.2, 0.7, "#555555", 0.55, 0.35, rad=0.03, stroke=INK, sw=2))


def weed(h=1.4, col="#3F8F46"):
    return smooth([(0, 0), (-0.18, h * 0.35), (0.05, h * 0.7), (-0.05, h)], col, 12)


def dish(n_sprout, w=2.6):
    """페트리 접시 + 씨 20개(앞의 n_sprout개는 싹 틈)"""
    g = VGroup(E(w, w * 0.62, "#EEF6FB", stroke="#7AA7BD", sw=5), E(w * 0.86, w * 0.5, "#E9F5FB", sw=0))
    for i in range(20):
        x = -w * 0.3 + (i % 5) * w * 0.15
        y = w * 0.13 - (i // 5) * w * 0.09
        g.add(E(0.09, 0.07, "#7A4A2A", x, y, sw=0))
        if i < n_sprout:
            g.add(L((x, y), (x, y + 0.2), "#4F9A3A", 3),
                  smooth([(x, y + 0.2), (x - 0.1, y + 0.27), (x - 0.15, y + 0.22)], "#6CBF4A", 4),
                  smooth([(x, y + 0.2), (x + 0.1, y + 0.27), (x + 0.15, y + 0.22)], "#6CBF4A", 4))
    return g


def mask(col="#DDE8F0"):
    return VGroup(Arc(radius=0.22, start_angle=PI / 2, angle=PI, stroke_color="#7A8A9A", stroke_width=3).move_to([-0.5, 0, 0]),
                  Arc(radius=0.22, start_angle=-PI / 2, angle=PI, stroke_color="#7A8A9A", stroke_width=3).move_to([0.5, 0, 0]),
                  R(0.9, 0.55, col, 0, 0, rad=0.12, stroke="#7A8A9A", sw=3),
                  L((-0.2, 0.08), (0.2, 0.08), "#9AAABA", 2), L((-0.2, -0.08), (0.2, -0.08), "#9AAABA", 2))


def wall(stickers=False, w=0.5, h=3.2):
    """투명한 방음벽(옆에서 본 모습). stickers=True면 무늬 스티커"""
    g = VGroup(R(w, h, "#DFF3FB", 0, 0, rad=0.04, stroke="#7AA7BD", sw=4, op=0.55))
    if stickers:
        for k in range(7):
            g.add(Dot([0, -h / 2 + 0.3 + k * (h - 0.6) / 6, 0], radius=0.09, color="#E07A3A"))
    return g


def fish_ladder(w=4.6):
    """둑 옆 물고기 이동 통로(계단 모양)"""
    g = VGroup()
    steps = 5
    for k in range(steps):
        x = -w / 2 + k * w / steps
        g.add(Rectangle(width=w / steps, height=0.35 + k * 0.32, fill_color="#9AA0A6", fill_opacity=1,
                        stroke_color="#555A60", stroke_width=3).move_to([x + w / steps / 2, -1.0 + (0.35 + k * 0.32) / 2, 0]))
        g.add(Rectangle(width=w / steps * 0.9, height=0.18, fill_color=RIVER, fill_opacity=0.9, stroke_width=0)
              .move_to([x + w / steps / 2, -1.0 + 0.35 + k * 0.32 + 0.09, 0]))
    return g


def eco_bridge(w=3.6):
    """도로 위 생태통로(흙과 나무로 덮인 다리)"""
    g = VGroup(R(w, 0.35, "#8A6A4A", 0, 0, rad=0.05, stroke=INK, sw=3),
               R(w, 0.12, GRASSC, 0, 0.2, rad=0.04, stroke=None, sw=0))
    for x in (-w * 0.38, w * 0.38):
        g.add(R(0.3, 1.2, "#B8B0A0", x, -0.75, rad=0.04, stroke=INK, sw=3))
    for x in (-w * 0.3, 0.0, w * 0.32):
        g.add(fit(tree("#5E9E4A"), 0.6, 0.7).move_to([x, 0.6, 0]))
    return g


def road(w=13.6, y=-1.9):
    g = VGroup(Rectangle(width=w, height=0.9, fill_color="#5A5E66", fill_opacity=1, stroke_width=0).move_to([0, y, 0]))
    for k in range(9):
        g.add(Rectangle(width=0.7, height=0.08, fill_color=PAPER, fill_opacity=1, stroke_width=0).move_to([-6 + k * 1.5, y, 0]))
    return g


def car(col="#D2453B"):
    return VGroup(R(1.4, 0.45, col, 0, 0, rad=0.12, stroke=INK, sw=3), R(0.8, 0.35, "#BFE3F5", -0.05, 0.33, rad=0.1, stroke=INK, sw=3),
                  C(0.15, "#333333", -0.4, -0.25, stroke=INK, sw=2), C(0.15, "#333333", 0.4, -0.25, stroke=INK, sw=2))


def island(w=3.4):
    g = VGroup(E(w * 1.15, 0.5, SEA, 0, -0.35, stroke="#2F78B8", sw=3),
               poly([(-w / 2, -0.3), (-w * 0.25, 0.25), (w * 0.1, 0.45), (w * 0.4, 0.15), (w / 2, -0.3)], "#9CC56A", stroke=LEAF_D, sw=3))
    for x in (-0.6, 0.1, 0.7):
        g.add(fit(tree("#4F8F3A"), 0.55, 0.65).move_to([x * w / 3.4, 0.35, 0]))
    return g


def fallen_log(w=3.0):
    g = VGroup(R(w, 0.55, "#8A5A2B", 0, 0.1, rad=0.25, stroke=BROWN_DARK, sw=4),
               E(0.45, 0.55, "#C9A06A", w / 2 - 0.1, 0.1, stroke=BROWN_DARK, sw=3))
    g.add(fit(A4.mushroom(0.5), 0.35, 0.35).move_to([-0.7, 0.55, 0]))
    g.add(fit(A3.pillbug(), 0.4, 0.25).move_to([0.2, -0.32, 0]))
    g.add(fit(A3.worm(), 0.55, 0.18).move_to([-0.6, -0.32, 0]))
    return g
