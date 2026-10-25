"""4-2 3단원 「여러 가지 기체」 전용 그림 부품 (s4ep27~30, s4mm06)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit()·scale().
  공기(기체)는 작은 하늘색 점으로 그림(앱처럼 '입자'라는 말은 쓰지 않음): air_in(…)
  3-1 무게: bike(full) · floor_pump · pet_bottle(bulge) · hand_pump · vac_jar · scale_read(저울 숫자 바꾸기)
           seesaw(왼쪽 상자 + 오른쪽 물체, 기울기) · feather · piano · boat
  3-2 온도: soap_bottle(k) · warm_hands · jar_balloon(k) · tank(kind) · 생활: pingpong · pet_crushed · snack_bag · wrap_bowl
  3-3 압력: syringe(V, capped) · air_cushion(dip) · kid · vac_ball(r) · marshmallow · mountain_bag · gym_ball · sneaker · diver_bubbles
  3-4 생활 속 기체: soda_glass · air_bar · o2_can · chamber · o2_maker · airbag · h2_car · drone · airship · he_balloons
           lamp · dry_ice · candle · co2_layer · diver
  카드: pic_card(그림, 이름) · state_arrow(up)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, ArcBetweenPoints, Circle, DashedVMobject, Dot, Ellipse, Line, Polygon, Rectangle,
                   RoundedRectangle, VGroup, VMobject, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK, SKIN, backpack, e_scale  # noqa: F401
from kit_s3u12 import text_card, ox_mark  # noqa: F401
from kit_s3u24 import fit, E, C, L, R, P, S  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401
from kit_s3u21 import extinguisher, beach_ball  # noqa: F401
from kit_s3u22 import hot_balloon  # noqa: F401

SW = 4
AIR = "#4F93CF"
GLASS = "#E6F4FB"
GLASS_D = "#6FA6C2"
WATER = "#8FCDEE"
WATER_D = "#3F8EBE"
HOT = "#F3A07A"
ICE = "#EAF6FF"
ICE_D = "#8FBFDF"
RUB = "#E2573F"
RUB_D = "#8E2A20"
GRAY = "#8D96A0"
DGRAY = "#4C535B"
LGRAY = "#D6DBE0"
GAS_COL = {"산소": "#2F6FD6", "질소": "#2E9E5B", "이산화 탄소": "#8A5A14", "헬륨": "#B5408F", "수소": "#1F8A8A",
           "아르곤": "#7A4FB0"}


# ══════════════ 공기 점 ══════════════
def _unit_pts(n, seed):
    rng = np.random.default_rng(seed)
    # 고르게 퍼지도록 격자 + 흔들기
    k = int(np.ceil(np.sqrt(n * 1.6)))
    pts = []
    for i in range(k):
        for j in range(k):
            pts.append(((i + 0.5 + rng.uniform(-0.3, 0.3)) / k, (j + 0.5 + rng.uniform(-0.3, 0.3)) / k))
    rng.shuffle(pts)
    return pts[:n]


def air_in(x0, x1, y0, y1, n=24, seed=1, r=0.055, col=AIR):
    """네모 칸 안에 고르게 퍼진 공기 점 n개 — 같은 seed면 칸이 바뀌어도 점의 '차례 자리'가 같음(줄면 모임)"""
    return VGroup(*[Dot([x0 + u * (x1 - x0), y0 + v * (y1 - y0), 0], radius=r, color=col, fill_opacity=0.85)
                    for u, v in _unit_pts(n, seed)])


def air_ellipse(cx, cy, w, h, n=20, seed=2, r=0.05, col=AIR):
    """타원 안 공기 점"""
    out = VGroup()
    for u, v in _unit_pts(n * 2, seed):
        x, y = 2 * u - 1, 2 * v - 1
        if x * x + y * y <= 0.72:
            out.add(Dot([cx + x * w / 2, cy + y * h / 2, 0], radius=r, color=col, fill_opacity=0.85))
        if len(out) >= n:
            break
    return out


# ══════════════ 3-1 기체의 무게 ══════════════
def bike(full=True):
    """자전거 옆모습. full=False면 타이어가 납작"""
    g = VGroup()
    for x in (-1.15, 1.15):
        if full:
            g.add(Circle(radius=0.72, stroke_color=INK, stroke_width=14).move_to([x, 0, 0]))
        else:
            tire = VMobject(stroke_color=GRAY, stroke_width=9)
            pts = [[x + 0.72 * np.cos(t), max(-0.55, 0.72 * np.sin(t)), 0] for t in np.linspace(0, TAU, 60)]
            tire.set_points_smoothly(pts + [pts[0]])
            g.add(tire)
        g.add(Circle(radius=0.62, stroke_color=LGRAY, stroke_width=3).move_to([x, 0, 0]))
        g.add(Dot([x, 0, 0], radius=0.07, color=INK))
    fr = "#2F8F5B"
    for a, b in [((-1.15, 0), (-0.2, 0)), ((-0.2, 0), (-0.55, 0.85)), ((-0.55, 0.85), (0.7, 0.85)),
                 ((0.7, 0.85), (-0.2, 0)), ((0.7, 0.85), (1.15, 0)), ((-1.15, 0), (-0.55, 0.85))]:
        g.add(L(a, b, fr, 7))
    g.add(L((-0.55, 0.85), (-0.62, 1.1), INK, 6), R(0.5, 0.12, INK, -0.62, 1.15, rad=0.05, sw=0))
    g.add(L((0.7, 0.85), (0.8, 1.25), INK, 6), L((0.62, 1.28), (1.0, 1.28), INK, 7))
    if not full:
        g.shift(DOWN * 0.08)
    return g


def floor_pump():
    body = R(0.36, 1.6, "#3A78C8", 0, 0, rad=0.12, stroke=INK, sw=3)
    base = R(1.0, 0.16, DGRAY, 0, -0.85, rad=0.05, sw=0)
    rod = L((0, 0.8), (0, 1.15), GRAY, 6)
    handle = R(0.9, 0.14, INK, 0, 1.2, rad=0.06, sw=0)
    hose = S([(0.15, -0.6), (0.6, -0.8), (0.9, -0.3), (1.1, 0.1)], INK, 4)
    g = VGroup(hose, base, body, rod, handle)
    g.handle = VGroup(rod, handle)
    return g


def pet_bottle(bulge=0.0):
    """페트병 + 공기 주입 마개(위 단추). bulge 0~1이면 몸통이 조금 불룩(팽팽)"""
    w = 1.0 + 0.08 * bulge
    body = R(w, 1.9, GLASS, 0, -0.35, rad=0.32, stroke=GLASS_D, sw=4, op=0.85)
    shoulder = P([(-w / 2, 0.45), (w / 2, 0.45), (0.2, 0.95), (-0.2, 0.95)], GLASS, GLASS_D, 4, 0.85)
    neck = R(0.4, 0.22, GLASS, 0, 1.03, rad=0.04, stroke=GLASS_D, sw=3)
    cap = R(0.56, 0.36, "#3A3F45", 0, 1.3, rad=0.08, sw=0)
    btn = E(0.36, 0.2, RED, 0, 1.53, stroke=RUB_D, sw=2)
    rings = VGroup(*[L((-w / 2 + 0.06, y), (w / 2 - 0.06, y), GLASS_D, 2) for y in (-0.9, -0.7)])
    g = VGroup(body, shoulder, neck, rings, cap, btn)
    g.btn = btn
    return g


def hand_pump(h=1.2):
    barrel = R(0.34, h, "#F2B705", 0, 0, rad=0.1, stroke="#B08300", sw=3)
    rod = L((0, h / 2), (0, h / 2 + 0.3), GRAY, 6)
    knob = R(0.6, 0.14, INK, 0, h / 2 + 0.36, rad=0.06, sw=0)
    tip = R(0.18, 0.18, DGRAY, 0, -h / 2 - 0.08, rad=0.03, sw=0)
    g = VGroup(barrel, rod, knob, tip)
    g.top = VGroup(rod, knob)
    return g


def vac_jar(w=2.1, h=2.0):
    """공기를 빼는 장치의 용기(투명 원통 + 뚜껑, 뚜껑 가운데 단추). 아래 가운데가 (0,0)"""
    body = R(w, h, GLASS, 0, h / 2, rad=0.18, stroke=GLASS_D, sw=5, op=0.7)
    lid = R(w + 0.2, 0.3, "#3A3F45", 0, h + 0.12, rad=0.08, sw=0)
    btn = R(0.34, 0.16, RED, 0, h + 0.33, rad=0.05, stroke=RUB_D, sw=2)
    g = VGroup(body, lid, btn)
    g.lid, g.btn, g.inner_top, g.w, g.h = VGroup(lid, btn), btn, h, w, h
    return g


def scale_read(sc, text, size=30):
    """전자저울 숫자를 바꾼 새 글자(Transform에 씀)"""
    return T(text + " g", size, "#7CF2A4").move_to(sc.scr)


def feather():
    v = S([(0, -0.9), (0.05, 0.0), (0.0, 0.9)], INK, 3)
    lf = P([(0, -0.6), (-0.35, -0.1), (-0.32, 0.5), (0, 0.95), (0.3, 0.5), (0.33, -0.1)], "#F3EBDD", "#A89A80", 2)
    return VGroup(lf, v)


def piano():
    body = R(2.2, 1.5, "#2B2B33", 0, 0, rad=0.08, sw=0)
    keys = R(2.0, 0.32, PAPER, 0, 0.0, rad=0.02, stroke=INK, sw=2)
    blacks = VGroup(*[R(0.08, 0.18, INK, -0.85 + 0.25 * i, 0.07, rad=0.01, sw=0) for i in range(8)])
    legs = VGroup(R(0.14, 0.35, "#2B2B33", -0.95, -0.9, rad=0.02, sw=0), R(0.14, 0.35, "#2B2B33", 0.95, -0.9, rad=0.02, sw=0))
    return VGroup(body, keys, blacks, legs)


def boat(full=True):
    sx = 1.0 if full else 0.92
    hull = R(2.6 * sx, 0.7 if full else 0.4, "#F28C38", 0, 0, rad=0.33 if full else 0.18, stroke=INK, sw=4)
    inner = R(2.0 * sx, 0.3 if full else 0.14, "#FFD8B0", 0, 0.05, rad=0.12, sw=0)
    return VGroup(hull, inner)


class Seesaw:
    """윗접시 대신 긴 막대 저울: 왼쪽에 '교실 안 공기' 상자, 오른쪽에 물체를 올려 기울기 비교"""

    def __init__(self, center=(0, -1.0, 0), half=3.6):
        cx, cy, _ = center
        self.pivot = np.array([cx, cy, 0])
        self.half = half
        self.stand = P([(cx, cy), (cx - 0.5, cy - 1.1), (cx + 0.5, cy - 1.1)], BROWN, BROWN_DARK, 3)
        self.bar = R(2 * half, 0.18, "#5B6B78", cx, cy + 0.09, rad=0.08, sw=0)
        box = DashedVMobject(Rectangle(width=2.2, height=1.7, stroke_color=BLUE, stroke_width=4), num_dashes=28)
        fill = Rectangle(width=2.2, height=1.7, fill_color="#BFE6FB", fill_opacity=0.7, stroke_width=0)
        lab = VGroup(T("교실 안", 28, "#0F3B5C"), T("공기", 28, "#0F3B5C")).arrange(DOWN, buff=0.08)
        self.left = VGroup(fill, box, lab).move_to([cx - half + 1.2, cy + 0.18 + 0.85, 0])
        self.beam = VGroup(self.bar, self.left)
        self.right = None

    def group(self):
        return VGroup(self.stand, self.beam)

    def put(self, mob):
        mob.move_to([self.pivot[0] + self.half - 1.2, 0, 0])
        mob.shift(UP * (self.bar.get_top()[1] - mob.get_bottom()[1]))
        self.right = mob
        self.beam.add(mob)
        return mob


# ══════════════ 3-2 온도와 부피 ══════════════
def soap_bottle(k=0.0):
    """입구에 비눗물 막을 묻힌 유리병. k 0(평평) ~ 1(볼록)"""
    body = R(1.5, 1.6, GLASS, 0, -0.5, rad=0.3, stroke=GLASS_D, sw=5, op=0.8)
    sh = P([(-0.75, 0.1), (0.75, 0.1), (0.25, 0.65), (-0.25, 0.65)], GLASS, GLASS_D, 5, 0.8)
    neck = R(0.5, 0.35, GLASS, 0, 0.8, rad=0.04, stroke=GLASS_D, sw=4, op=0.8)
    top = 0.98
    if k <= 0.02:
        film = L((-0.25, top), (0.25, top), "#C77DDB", 6)
    else:
        film = ArcBetweenPoints([-0.25, top, 0], [0.25, top, 0], angle=-PI * min(1.0, 0.25 + k * 0.85),
                                stroke_color="#C77DDB", stroke_width=5)
        film.set_fill("#F2D8FA", opacity=0.55)
    g = VGroup(body, sh, neck, film)
    g.film_top = top
    return g


def warm_hands():
    g = VGroup()
    for sx in (-1, 1):
        g.add(E(0.75, 1.5, SKIN, sx * 0.62, -0.5, stroke="#C99A6B", sw=3))
        for j in range(3):
            g.add(E(0.5, 0.2, SKIN, sx * 0.35, -0.05 - 0.27 * j, stroke="#C99A6B", sw=2))
    return g


def jar_balloon(k=0.0):
    """집기병 + 입구에 씌운 고무풍선. k>0 부풂, k<0 쪼그라들어 병 안으로. 병 아래 가운데가 (0,0)"""
    body = R(1.4, 1.9, GLASS, 0, 0.95, rad=0.12, stroke=GLASS_D, sw=5, op=0.75)
    sh = P([(-0.7, 1.85), (0.7, 1.85), (0.3, 2.2), (-0.3, 2.2)], GLASS, GLASS_D, 5, 0.75)
    neck = R(0.6, 0.2, GLASS, 0, 2.3, rad=0.03, stroke=GLASS_D, sw=4, op=0.75)
    band = R(0.66, 0.08, "#C9A227", 0, 2.32, rad=0.02, sw=0)
    if k >= 0:
        hgt = 0.12 + 0.85 * k
        wid = 0.62 + 0.75 * k
        # 위 반타원(아래 반은 병목 안)
        up = VMobject(fill_color=RUB, fill_opacity=1, stroke_color=RUB_D, stroke_width=3)
        ts = np.linspace(0, PI, 40)
        up.set_points_as_corners([[wid / 2 * np.cos(t), 2.4 + hgt * np.sin(t), 0] for t in ts] + [[wid / 2, 2.4, 0]])
        bal = up
    else:
        d = -k
        bal = VMobject(fill_color=RUB, fill_opacity=1, stroke_color=RUB_D, stroke_width=3)
        ts = np.linspace(PI, TAU, 40)
        bal.set_points_as_corners([[0.3 * np.cos(t), 2.4 + (0.05 + 0.55 * d) * np.sin(t), 0] for t in ts] + [[-0.3, 2.4, 0]])
    g = VGroup(body, sh, neck, bal, band)
    return g


def tank(kind="hot", w=3.2, h=1.4):
    """수조(아래 가운데가 (0,0)). kind='hot' 뜨거운 물 / 'ice' 얼음물"""
    col = HOT if kind == "hot" else WATER
    water = R(w - 0.12, h * 0.78, col, 0, h * 0.39 + 0.04, rad=0.05, sw=0, op=0.55)
    glass = R(w, h, GLASS, 0, h / 2, rad=0.1, stroke=GLASS_D, sw=5, op=0.25)
    g = VGroup(water, glass)
    if kind == "hot":
        for x in (-w / 2 + 0.3, -w / 2 + 0.65, w / 2 - 0.65, w / 2 - 0.3):
            g.add(S([(x, h + 0.1), (x + 0.12, h + 0.35), (x - 0.08, h + 0.6), (x + 0.06, h + 0.85)], "#C9C3BE", 4))
    else:
        for (x, y) in [(-1.0, 0.95), (-0.45, 0.85), (0.6, 0.92), (1.05, 0.8), (0.15, 0.7)]:
            g.add(R(0.32, 0.3, ICE, x, y, rad=0.05, stroke=ICE_D, sw=2).rotate(0.3 * x))
    g.water_top = h * 0.78 + 0.04
    return g


def pingpong(dent=True):
    b = C(0.55, "#FFF4D6", stroke="#C9A24A", sw=4)
    g = VGroup(b)
    if dent:
        g.add(ArcBetweenPoints([-0.25, 0.48, 0], [0.25, 0.48, 0], angle=-PI * 0.6, stroke_color="#C9A24A", stroke_width=4))
        g.add(R(0.56, 0.14, "#FFF4D6", 0, 0.52, rad=0.02, sw=0))
        g.add(ArcBetweenPoints([-0.25, 0.47, 0], [0.25, 0.47, 0], angle=PI * 0.6, stroke_color="#C9A24A", stroke_width=4))
    return g


def pet_crushed(crushed=True):
    if not crushed:
        return fit(pet_bottle(), 0.7, 1.5)
    pts = [(-0.35, -0.9), (0.35, -0.9), (0.28, -0.4), (0.4, -0.05), (0.2, 0.3), (0.32, 0.55), (0.12, 0.8),
           (-0.12, 0.8), (-0.3, 0.5), (-0.18, 0.2), (-0.4, -0.15), (-0.25, -0.45)]
    body = P(pts, GLASS, GLASS_D, 4, 0.85)
    cap = R(0.28, 0.18, "#3A78C8", 0, 0.9, rad=0.04, sw=0)
    water = R(0.6, 0.18, WATER, 0, -0.78, rad=0.03, sw=0, op=0.8)
    return VGroup(body, water, cap)


def snack_bag(puff=0.0, label=True):
    """과자 봉지. puff 0(보통) ~ 1(빵빵)"""
    w, h = 1.2 + 0.25 * puff, 1.5
    bow = 0.05 + 0.28 * puff
    pts = []
    for t in np.linspace(0, 1, 12):
        pts.append([-w / 2 - bow * np.sin(PI * t), -h / 2 + h * t, 0])
    left = pts
    right = [[-p[0], p[1], 0] for p in pts[::-1]]
    top = [[x, h / 2 + 0.02 * np.sin(9 * x), 0] for x in np.linspace(-w / 2, w / 2, 8)]
    body = VMobject(fill_color="#3A78C8", fill_opacity=1, stroke_color="#1C4A9C", stroke_width=3)
    body.set_points_as_corners(left + top + right + [left[0]])
    g = VGroup(body, R(w + 0.06, 0.12, "#1C4A9C", 0, h / 2, rad=0.02, sw=0), R(w + 0.06, 0.12, "#1C4A9C", 0, -h / 2, rad=0.02, sw=0))
    if label:
        g.add(T("과자", 26, PAPER).move_to([0, 0, 0]))
    return g


def wrap_bowl(concave=True):
    bowl = P([(-0.95, 0.15), (0.95, 0.15), (0.65, -0.55), (-0.65, -0.55)], "#F7F2E8", INK, 4)
    food = E(1.3, 0.25, "#E8A23A", 0, 0.12, stroke=None, sw=0)
    wrap = ArcBetweenPoints([-0.98, 0.2, 0], [0.98, 0.2, 0], angle=(0.6 if concave else -0.6),
                            stroke_color="#7FB3D0", stroke_width=5)
    return VGroup(food, bowl, wrap)


# ══════════════ 3-3 압력과 부피 ══════════════
SYR_X0 = -3.6      # 주사기 입구 쪽 안 끝(0 mL)
SYR_K = 0.105      # 1 mL 길이


def syr_x(v):
    return SYR_X0 + v * SYR_K


def syringe(V=40.0, capped=True, n=26, force=0.0, y=0.4):
    """가로 주사기(왼쪽이 입구). V mL만큼 공기 칸, 피스톤, 눈금 0~60 mL. force>0이면 누르는 화살표 길이"""
    g = VGroup()
    x1 = syr_x(60) + 0.25
    barrel = R(x1 - SYR_X0, 1.0, GLASS, (SYR_X0 + x1) / 2, y, rad=0.08, stroke=GLASS_D, sw=5, op=0.7)
    tip = R(0.45, 0.32, GLASS, SYR_X0 - 0.22, y, rad=0.04, stroke=GLASS_D, sw=4, op=0.8)
    g.add(tip, barrel)
    xv = syr_x(V)
    g.add(R(xv - SYR_X0, 0.9, "#D8EEFB", (SYR_X0 + xv) / 2, y, rad=0.04, sw=0, op=0.9))
    g.add(air_in(SYR_X0 + 0.08, xv - 0.08, y - 0.36, y + 0.36, n=n, seed=7))
    for v in range(0, 61, 10):
        g.add(L((syr_x(v), y + 0.5), (syr_x(v), y + 0.3), DGRAY, 3))
        g.add(T(str(v), 22, DGRAY).move_to([syr_x(v), y + 0.72, 0]))
    for v in range(5, 61, 10):
        g.add(L((syr_x(v), y + 0.5), (syr_x(v), y + 0.38), DGRAY, 2))
    g.add(T("mL", 22, DGRAY).move_to([syr_x(60) + 0.55, y + 0.72, 0]))
    pis = R(0.22, 0.92, DGRAY, xv + 0.11, y, rad=0.03, sw=0)
    # 손잡이 쪽은 피스톤과 같이 움직임
    shift = xv - syr_x(40)
    rod = R(1.95, 0.18, GRAY, syr_x(40) + 0.2 + 0.98 + shift, y, rad=0.03, sw=0)
    head = R(0.2, 1.0, DGRAY, syr_x(40) + 0.2 + 1.95 + 0.1 + shift, y, rad=0.04, sw=0)
    g.add(rod, head, pis)
    if capped:
        g.add(R(0.32, 0.48, "#E07A6A", SYR_X0 - 0.5, y, rad=0.06, stroke="#8E2A20", sw=2))
    if force > 0.01:
        hx = head.get_right()[0]
        g.add(Arrow([hx + 0.25 + 1.6 * force, y, 0], [hx + 0.05, y, 0], buff=0, color=RED, stroke_width=10,
                    max_tip_length_to_length_ratio=0.35))
    return g


def air_cushion(dip=0.0, w=6.0, h=1.6, n=40):
    """풍선 놀이기구 바닥(공기 쿠션). dip>0이면 가운데가 눌려 들어감"""
    xs = np.linspace(-w / 2, w / 2, 60)
    top = [[x, h / 2 - dip * np.exp(-(x / 0.7) ** 2), 0] for x in xs]
    pts = top + [[w / 2, -h / 2, 0], [-w / 2, -h / 2, 0]]
    body = VMobject(fill_color="#F7C948", fill_opacity=1, stroke_color="#B08300", stroke_width=4)
    body.set_points_as_corners(pts + [top[0]])
    seams = VGroup(*[L((x, -h / 2 + 0.05), (x, h / 2 - 0.08 - (dip * np.exp(-(x / 0.7) ** 2))), "#D9A520", 3)
                     for x in np.linspace(-w / 2 + 0.75, w / 2 - 0.75, 6)])
    walls = VGroup(R(0.5, 1.8, "#E2573F", -w / 2 + 0.25, h / 2 + 0.8, rad=0.2, stroke=RUB_D, sw=3),
                   R(0.5, 1.8, "#3A78C8", w / 2 - 0.25, h / 2 + 0.8, rad=0.2, stroke="#1C4A9C", sw=3))
    return VGroup(walls, body, seams)


def kid(shirt="#2E9E5B"):
    head = C(0.28, SKIN, 0, 0.95, stroke=INK, sw=3)
    body = R(0.5, 0.7, shirt, 0, 0.35, rad=0.15, stroke=INK, sw=3)
    legs = VGroup(L((-0.12, 0.0), (-0.18, -0.45), INK, 7), L((0.12, 0.0), (0.18, -0.45), INK, 7))
    arms = VGroup(L((-0.25, 0.55), (-0.6, 0.85), SKIN, 7), L((0.25, 0.55), (0.6, 0.85), SKIN, 7))
    g = VGroup(legs, arms, body, head, Dot([-0.09, 0.98, 0], radius=0.035, color=INK), Dot([0.09, 0.98, 0], radius=0.035, color=INK))
    g.foot_y = -0.45
    return g


def vac_ball(r=1.0):
    """고무풍선(입구를 클립으로 묶음). 아래쪽이 (0,0) 근처, r 배율로 커짐"""
    bal = E(0.9 * r, 1.05 * r, RUB, 0, 0.62 * r, stroke=RUB_D, sw=3)
    shine = E(0.16 * r, 0.3 * r, PAPER, -0.2 * r, 0.82 * r, stroke=None, sw=0, op=0.45)
    knot = P([(0, 0.1 * r), (-0.07, 0.0), (0.07, 0.0)], RUB_D, None, 0)
    clip = R(0.22, 0.08, "#2F8F5B", 0, -0.04, rad=0.02, sw=0)
    return VGroup(bal, shine, knot, clip)


def marshmallow(r=1.0):
    body = R(0.7 * r, 0.55 * r, PAPER, 0, 0.28 * r, rad=0.18 * r, stroke="#E9B0C8", sw=3)
    top = E(0.7 * r, 0.18 * r, "#FFE3EE", 0, 0.55 * r, stroke="#E9B0C8", sw=3)
    return VGroup(body, top)


def mountain_bag(at_top=False):
    """산 아래·산 정상 과자 봉지"""
    mt = P([(-3.0, -1.3), (0.4, 1.6), (3.2, -1.3)], "#8DBF6A", "#4F7F3A", 4)
    snow = P([(0.4, 1.6), (-0.15, 1.1), (0.15, 1.2), (0.4, 1.0), (0.7, 1.2), (0.95, 1.12)], PAPER, "#4F7F3A", 2)
    flag = VGroup(L((0.4, 1.6), (0.4, 2.1), INK, 3), P([(0.4, 2.1), (0.75, 1.95), (0.4, 1.8)], RED, None, 0))
    bag = fit(snack_bag(1.0 if at_top else 0.0), 0.75 if at_top else 0.6, 0.85 if at_top else 0.75)
    bag.move_to([0.4, 2.0, 0] if at_top else [-2.4, -0.7, 0])
    if at_top:
        bag.move_to([1.25, 1.7, 0])
    return VGroup(mt, snow, flag, bag)


def gym_ball(squash=0.0):
    return E(1.6 * (1 + 0.15 * squash), 1.6 * (1 - 0.18 * squash), "#3FB7C9", 0, -0.0, stroke="#1F7F8F", sw=4)


def sneaker(pressed=False):
    sole = R(2.0, 0.3, PAPER, 0, -0.35, rad=0.12, stroke=INK, sw=3)
    pocket = E(0.7, 0.18 if pressed else 0.3, "#8FCDEE", 0.45, -0.35, stroke="#3F8EBE", sw=3, op=0.9)
    up = P([(-1.0, -0.2), (-0.9, 0.45), (-0.2, 0.55), (0.3, 0.1), (1.0, -0.05), (1.0, -0.2)], "#E2573F", INK, 3)
    lace = VGroup(*[L((-0.4 + 0.18 * i, 0.4 - 0.1 * i), (-0.25 + 0.18 * i, 0.25 - 0.1 * i), PAPER, 3) for i in range(3)])
    return VGroup(up, lace, sole, pocket)


def diver_bubbles():
    sea = R(2.4, 2.6, "#7FC6E8", 0, 0, rad=0.12, stroke="#2F6F95", sw=3, op=0.85)
    g = VGroup(sea, L((-1.2, 1.3), (1.2, 1.3), "#2F6F95", 4))
    for i, (x, y) in enumerate([(0.0, -0.9), (0.15, -0.35), (-0.05, 0.2), (0.2, 0.8)]):
        g.add(Circle(radius=0.08 + 0.07 * i, fill_color=PAPER, fill_opacity=0.6, stroke_color=PAPER, stroke_width=3).move_to([x, y, 0]))
    diver = VGroup(E(0.7, 0.3, "#2B2B33", -0.3, -1.05, stroke=None, sw=0), C(0.15, SKIN, 0.05, -1.0, stroke=INK, sw=2))
    g.add(diver)
    return g


def rise_balloon():
    g = VGroup()
    for i, (x, y, s) in enumerate([(-0.5, -0.9, 0.6), (0.0, 0.0, 0.85), (0.5, 0.95, 1.15)]):
        g.add(fit(vac_ball(1.0), 0.45 * s, 0.6 * s).move_to([x, y, 0]))
    sky = R(2.2, 2.6, "#D5ECFA", 0, 0, rad=0.12, stroke="#6FA6C2", sw=3)
    return VGroup(sky, g)


# ══════════════ 3-4 생활 속 기체 ══════════════
def soda_glass(n=10, seed=3):
    glass = P([(-0.6, 0.9), (0.6, 0.9), (0.45, -0.9), (-0.45, -0.9)], GLASS, GLASS_D, 4, 0.6)
    drink = P([(-0.57, 0.6), (0.57, 0.6), (0.45, -0.88), (-0.45, -0.88)], "#8A4B2A", None, 0, 0.9)
    rng = np.random.default_rng(seed)
    bub = VGroup(*[Circle(radius=rng.uniform(0.04, 0.08), stroke_color=PAPER, stroke_width=2).move_to(
        [rng.uniform(-0.38, 0.38), rng.uniform(-0.75, 0.5), 0]) for _ in range(n)])
    return VGroup(drink, bub, glass)


def air_bar(w=11.0, h=0.9):
    """공기를 이루는 기체 띠: 질소 약 78 % · 산소 약 21 % · 기타"""
    x0 = -w / 2
    wn, wo = w * 0.78, w * 0.21
    n = R(wn, h, GAS_COL["질소"], x0 + wn / 2, 0, rad=0.0, sw=0)
    o_ = R(wo, h, GAS_COL["산소"], x0 + wn + wo / 2, 0, rad=0.0, sw=0)
    e = R(w - wn - wo, h, SOFT, x0 + wn + wo + (w - wn - wo) / 2, 0, rad=0.0, sw=0)
    frame = R(w, h, PAPER, 0, 0, rad=0.0, stroke=INK, sw=3, op=0)
    tn = T("질소 약 78 %", 34, PAPER).move_to(n)
    to = T("산소 약 21 %", 30, PAPER).move_to(o_)
    if to.width > wo - 0.2:
        to.scale_to_fit_width(wo - 0.2)
    te = T("기타", 24, INK).next_to(e, UP, buff=0.12)
    return VGroup(n, o_, e, frame, tn, to, te)


def o2_can():
    body = R(0.5, 1.4, "#2F6FD6", 0, -0.1, rad=0.2, stroke="#1C4A9C", sw=3)
    top = R(0.3, 0.2, GRAY, 0, 0.7, rad=0.04, sw=0)
    mask = E(0.45, 0.3, PAPER, 0.55, 0.75, stroke=GRAY, sw=3)
    tube = S([(0.0, 0.8), (0.3, 1.0), (0.5, 0.85)], GRAY, 3)
    lab = T("O₂", 22, PAPER).move_to([0, -0.1, 0])
    return VGroup(tube, body, top, mask, lab)


def chamber():
    body = R(2.4, 1.0, "#DDE8F0", 0, 0, rad=0.48, stroke=DGRAY, sw=4)
    win = VGroup(*[C(0.16, "#9ED3EE", x, 0.1, stroke=DGRAY, sw=3) for x in (-0.6, 0.0, 0.6)])
    legs = VGroup(R(0.2, 0.25, DGRAY, -0.8, -0.6, rad=0.03, sw=0), R(0.2, 0.25, DGRAY, 0.8, -0.6, rad=0.03, sw=0))
    return VGroup(legs, body, win)


def o2_maker():
    box = R(1.0, 1.4, PAPER, 0, 0, rad=0.12, stroke=DGRAY, sw=4)
    scr = R(0.6, 0.3, "#20323F", 0, 0.35, rad=0.04, sw=0)
    t = T("O₂", 18, "#7CF2A4").move_to(scr)
    grill = VGroup(*[L((-0.3, -0.1 - 0.13 * i), (0.3, -0.1 - 0.13 * i), GRAY, 3) for i in range(4)])
    return VGroup(box, scr, t, grill)


def airbag():
    """운전대 앞에 부푼 에어백"""
    dash = P([(-1.3, -0.9), (1.3, -0.9), (1.3, -0.55), (-1.3, -0.35)], "#5B6B78", None, 0)
    col = L((-0.6, -0.5), (-0.35, 0.0), INK, 10)
    wheel = Circle(radius=0.55, stroke_color=INK, stroke_width=10).move_to([-0.35, 0.05, 0])
    bag = E(1.5, 1.25, PAPER, 0.45, 0.35, stroke=GRAY, sw=3)
    folds = VGroup(S([(0.0, 0.6), (0.3, 0.45), (0.55, 0.65)], LGRAY, 3), S([(0.2, 0.05), (0.5, 0.2), (0.85, 0.05)], LGRAY, 3))
    return VGroup(dash, col, wheel, bag, folds)


def h2_car():
    body = P([(-1.0, -0.2), (-0.9, 0.15), (-0.45, 0.2), (-0.25, 0.5), (0.45, 0.5), (0.7, 0.2), (1.05, 0.15), (1.1, -0.2)],
             "#2F8F5B", INK, 3)
    w = VGroup(C(0.2, INK, -0.55, -0.25, sw=0), C(0.2, INK, 0.65, -0.25, sw=0))
    t = T("H₂", 20, PAPER).move_to([0.1, 0.05, 0])
    return VGroup(body, w, t)


def drone():
    c = R(0.6, 0.3, "#2F8F5B", 0, 0, rad=0.08, stroke=INK, sw=3)
    arms = VGroup(L((-0.3, 0.05), (-0.8, 0.3), INK, 4), L((0.3, 0.05), (0.8, 0.3), INK, 4))
    props = VGroup(E(0.6, 0.1, GRAY, -0.8, 0.33, stroke=None, sw=0), E(0.6, 0.1, GRAY, 0.8, 0.33, stroke=None, sw=0))
    return VGroup(arms, props, c)


def airship():
    body = E(2.4, 0.9, "#9AA5AD", 0, 0, stroke=INK, sw=3)
    fin = P([(1.05, 0.0), (1.45, 0.4), (1.45, -0.4)], "#5B6B78", INK, 3)
    gond = R(0.5, 0.2, "#2C333A", 0, -0.55, rad=0.04, sw=0)
    return VGroup(fin, body, gond)


def he_balloons():
    g = VGroup()
    for x, y, c in [(-0.35, 0.3, "#E2578F"), (0.25, 0.5, "#F2B705"), (0.0, 0.0, "#3A78C8")]:
        g.add(L((x, y - 0.35), (0.0, -0.9), GRAY, 2))
        g.add(E(0.5, 0.62, c, x, y, stroke=INK, sw=2))
    return g


def lamp():
    tube = R(2.0, 0.28, "#FFF8D6", 0, 0, rad=0.14, stroke="#C9A227", sw=3)
    ends = VGroup(R(0.16, 0.34, GRAY, -1.05, 0, rad=0.03, sw=0), R(0.16, 0.34, GRAY, 1.05, 0, rad=0.03, sw=0))
    glow = VGroup(*[L((x, 0.25), (x, 0.45), "#F2B705", 3) for x in (-0.6, 0, 0.6)])
    return VGroup(tube, ends, glow)


def dry_ice():
    box = R(1.4, 0.9, PAPER, 0, -0.2, rad=0.08, stroke=DGRAY, sw=3)
    ice = VGroup(R(0.4, 0.3, ICE, -0.3, 0.38, rad=0.05, stroke=ICE_D, sw=2), R(0.4, 0.3, ICE, 0.2, 0.42, rad=0.05, stroke=ICE_D, sw=2))
    fog = VGroup(*[S([(x, 0.55), (x + 0.15, 0.75), (x - 0.05, 0.95)], "#C9D3DA", 4) for x in (-0.4, 0.05, 0.45)])
    return VGroup(box, ice, fog)


def candle(lit=True):
    stick = R(0.36, 1.1, PAPER, 0, -0.35, rad=0.04, stroke=INK, sw=3)
    wick = L((0, 0.2), (0, 0.32), INK, 3)
    g = VGroup(stick, wick)
    if lit:
        g.add(P([(0, 0.85), (-0.15, 0.45), (0, 0.3), (0.15, 0.45)], "#F7A21B", "#E2573F", 2))
    return g


def diver():
    body = E(1.6, 0.55, "#2B2B33", 0, 0, stroke=None, sw=0)
    head = C(0.22, SKIN, 0.9, 0.08, stroke=INK, sw=3)
    mask = R(0.2, 0.14, "#9ED3EE", 1.02, 0.12, rad=0.03, stroke=INK, sw=2)
    tank_ = R(1.0, 0.32, "#F2B705", -0.05, 0.36, rad=0.14, stroke="#B08300", sw=3)
    lab = T("공기", 18, INK).move_to(tank_)
    fins = P([(-0.8, 0.0), (-1.3, 0.25), (-1.3, -0.25)], "#3A78C8", None, 0)
    return VGroup(fins, body, tank_, lab, head, mask)


# ══════════════ 카드 ══════════════
def pic_card(pic, name, w=2.6, h=2.3, size=26, stroke=SOFT, col=INK):
    box = R(w, h, PAPER, 0, 0, rad=0.16, stroke=stroke, sw=4)
    fit(pic, w - 0.5, h - 0.85).move_to([0, 0.28, 0])
    t = T(name, size, col)
    if t.width > w - 0.2:
        t.scale_to_fit_width(w - 0.2)
    t.move_to([0, -h / 2 + 0.33, 0])
    return VGroup(box, pic, t)


def state_arrow(up=True, size=28):
    col = RED if up else BLUE
    txt = "부피가 늘어나요" if up else "부피가 줄어들어요"
    return M(f'<span foreground="{col}">{"↑" if up else "↓"} {txt}</span>', size)
