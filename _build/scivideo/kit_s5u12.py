"""5-1 2단원 「빛의 성질」 전용 그림 부품 (s5ep07~11, s5mm02)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit()·scale().
  빛의 길: ray(점 목록) — 화살표 달린 곧은 선(꺾이는 곳마다 선이 나뉨, 선마다 가운데에 화살촉) · play_ray(장면, 빛)
           to_box(점, 방향, 상자) · mirror_bounce(점, 방향, 거울 양 끝, 상자) — 평면거울 반사(들어간 각 = 나온 각)
           lens_trace(…) — 볼록·오목 렌즈 굴절(굴절률 1.5, 앱과 같은 계산) · water_dir(…) — 공기↔물(1.33)
  판: panel(어두운 그림 판) · stars
  2-1: lighthouse · ship · rocks · dark_box(어둠상자) · flashlight(on) · peep_view · penguin · street_lamp · house · walker
  2-2: sun_s(해) · light_shaft · car_night · paper_hole · laser(지시기) · mist(물방울) · stand_obj
  2-3: plane_mirror(위에서 본 평면거울) · room_side · target(세모·네모·원) · mountain_town · eye · apple
  2-4: ant · magnifier · lens_shape(종류) · lens_poly · tank(물 + 우유)
  2-5: car_mirror · dental · lamp_shade · shoe_mirror · reading_glasses · loupe · camera · telescope · microscope
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, DashedLine, DashedVMobject, Dot, Ellipse, Line, Polygon, Rectangle,
                   RoundedRectangle, VGroup, VMobject, Create, FadeIn)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK, SKIN
from kit_s3u12 import fit, text_card, ox_mark, bin_box, smooth, E, C, L, poly  # noqa: F401
from kit_s4u12 import safety_note, rect  # noqa: F401
from kit_s4u23 import pic_card  # noqa: F401

SW = 4
LASER = "#E8322B"
SUNC = "#E59A00"       # 밝은 바탕 위 햇빛 선
GLOW = "#FFE680"       # 어두운 판 위 빛
NIGHT = "#141A26"
NIGHT2 = "#1F2A40"
SEA_N = "#0D2A4A"
GLASS = "#BFE6FB"
GLASS_D = "#2E86C1"
MIRROR = "#7FC6EC"
WOOD = "#B98B55"
WOOD_D = "#7E5A32"
WALL = "#E9E2D0"
GRAY = "#8D96A0"
DGRAY = "#4A5D6E"
LEAF = "#6DB35A"
WATER = "#8FCDEE"
WHITE = "#FFFFFF"


def P2(p):
    return np.array([p[0], p[1], 0.0])


# ══════════════ 빛의 길 ══════════════
def ray(pts, col=LASER, sw=7, tip=0.26, op=1.0, tips=True, at=0.55):
    """화살표 달린 빛의 길(곧은 선들). r.segs·r.heads: 선과 화살촉 목록(play_ray로 차례로 그림)"""
    pts = [P2(p) for p in pts]
    g = VGroup()
    g.segs, g.heads = [], []
    for a, b in zip(pts[:-1], pts[1:]):
        ln = Line(a, b, stroke_color=col, stroke_width=sw, stroke_opacity=op)
        g.add(ln)
        g.segs.append(ln)
        hd = VGroup()
        d = b - a
        Ld = np.linalg.norm(d)
        if tips and Ld > tip * 2.2:
            u = d / Ld
            n = np.array([-u[1], u[0], 0])
            m = a + d * at
            hd = Polygon(m + u * tip * 0.62, m - u * tip * 0.45 + n * tip * 0.5, m - u * tip * 0.45 - n * tip * 0.5,
                         fill_color=col, fill_opacity=op, stroke_width=0)
            g.add(hd)
        g.heads.append(hd)
    return g


def dashed(a, b, col=WHITE, sw=4, op=0.8):
    return DashedLine(P2(a), P2(b), dash_length=0.14, dashed_ratio=0.55, stroke_color=col, stroke_width=sw,
                      stroke_opacity=op)


def play_ray(scene, r, run_time=1.2):
    """빛이 나아가는 차례대로 선을 그림(길이에 비례한 시간)"""
    lens = [max(s.get_length(), 0.05) for s in r.segs]
    tot = sum(lens)
    for s, h, l_ in zip(r.segs, r.heads, lens):
        anims = [Create(s)]
        scene.play(*anims, run_time=max(0.15, run_time * l_ / tot))
        if len(h):
            scene.add(h)


def to_box(p, d, box):
    """점 p에서 방향 d로 갈 때 상자(x0, x1, y0, y1) 끝에 닿는 점"""
    x0, x1, y0, y1 = box
    ts = []
    if d[0] > 1e-9:
        ts.append((x1 - p[0]) / d[0])
    if d[0] < -1e-9:
        ts.append((x0 - p[0]) / d[0])
    if d[1] > 1e-9:
        ts.append((y1 - p[1]) / d[1])
    if d[1] < -1e-9:
        ts.append((y0 - p[1]) / d[1])
    t = min(t for t in ts if t > 1e-9)
    return np.array([p[0] + d[0] * t, p[1] + d[1] * t])


def unit(v):
    v = np.array(v[:2], dtype=float)
    return v / np.linalg.norm(v)


def deg_dir(deg):
    return np.array([np.cos(np.radians(deg)), np.sin(np.radians(deg))])


def mirror_bounce(p, d, ma, mb, box):
    """평면거울(ma–mb 선분) 반사: [출발, 거울에 닿은 점, 상자 끝] (못 닿으면 [출발, 상자 끝])
    반사 방향 = d − 2(d·n)n (들어간 각과 나온 각이 같음)"""
    p, d, ma, mb = (np.array(v[:2], dtype=float) for v in (p, d, ma, mb))
    d = d / np.linalg.norm(d)
    u = mb - ma
    den = d[0] * (-u[1]) - d[1] * (-u[0])
    if abs(den) > 1e-9:
        w = ma - p
        t = (w[0] * (-u[1]) - w[1] * (-u[0])) / den
        s = (d[0] * w[1] - d[1] * w[0]) / den
        if t > 1e-6 and 0 <= s <= 1:
            q = p + d * t
            n = unit([-u[1], u[0]])
            r = d - 2 * np.dot(d, n) * n
            return [p, q, to_box(q, r, box)], r
    return [p, to_box(p, d, box)], d


def reflect_point(q, ma, mb):
    """점 q를 거울 선에 대해 뒤집은 점(거울 속 상) — 맞히기 방향 계산용"""
    q, ma, mb = (np.array(v[:2], dtype=float) for v in (q, ma, mb))
    u = unit(mb - ma)
    v = q - ma
    proj = ma + u * np.dot(v, u)
    return 2 * proj - q


# ── 굴절(굴절 법칙) ──
def refract(d, n_, n1, n2):
    """d: 들어가는 방향(단위), n_: 경계의 수직 방향(단위). 굴절된 방향(전반사면 None)"""
    d = unit(d)
    n_ = unit(n_)
    ci = -np.dot(n_, d)
    if ci < 0:
        n_ = -n_
        ci = -ci
    e = n1 / n2
    k = 1 - e * e * (1 - ci * ci)
    if k < 0:
        return None
    return e * d + (e * ci - np.sqrt(k)) * n_


def water_dir(i_deg, n1=1.0, n2=1.33):
    """위에서 아래로(공기 → 물) 수직에서 i°만큼 기울어 들어갈 때: (들어가는 방향, 물속 방향)"""
    d = np.array([np.sin(np.radians(i_deg)), -np.cos(np.radians(i_deg))])
    return d, refract(d, [0, 1], n1, n2)


class Lens:
    """옆(위)에서 본 렌즈: kind 'cv'(볼록)·'cc'(오목), 가운데 (x0, y0), 반높이 H, 면의 반지름 R"""

    def __init__(self, kind="cv", x0=0.0, y0=0.0, H=1.5, R=3.0, n=1.5):
        self.kind, self.x0, self.y0, self.H, self.R, self.n = kind, x0, y0, H, R, n
        sag = R - np.sqrt(R * R - H * H)
        if kind == "cv":
            tc = 0.08 + 2 * sag
            self.S = [((x0 - tc / 2 + R, y0), -1), ((x0 + tc / 2 - R, y0), 1)]
        else:
            tc = 0.12
            self.S = [((x0 - tc / 2 - R, y0), 1), ((x0 + tc / 2 + R, y0), -1)]

    def _hit(self, p, d, s):
        (cx, cy), side = s
        o = p - np.array([cx, cy])
        b = np.dot(o, d)
        cc = np.dot(o, o) - self.R ** 2
        disc = b * b - cc
        if disc < 0:
            return None
        for t in (-b - np.sqrt(disc), -b + np.sqrt(disc)):
            if t < 1e-6:
                continue
            q = p + d * t
            if np.sign(q[0] - cx) == side and abs(q[1] - self.y0) <= self.H:
                return q
        return None

    def trace(self, h, x_start, box):
        """왼쪽 x_start에서 높이 y0+h로 수평하게 들어간 빛의 길(점 목록)"""
        p = np.array([x_start, self.y0 + h])
        d = np.array([1.0, 0.0])
        pts = [p]
        q1 = self._hit(p, d, self.S[0])
        if q1 is not None:
            c0 = np.array(self.S[0][0])
            d = refract(d, (q1 - c0) / self.R, 1, self.n)
            pts.append(q1)
            q2 = self._hit(q1, d, self.S[1])
            if q2 is not None:
                c1 = np.array(self.S[1][0])
                d = refract(d, (q2 - c1) / self.R, self.n, 1)
                pts.append(q2)
                p = q2
            else:
                p = q1
        pts.append(to_box(p, d, box))
        return pts

    def shape(self, fill=GLASS, op=0.75, stroke=GLASS_D, sw=4):
        a, b = [], []
        for y in np.linspace(self.y0 - self.H, self.y0 + self.H, 31):
            dy = y - self.y0
            w = np.sqrt(self.R ** 2 - dy * dy)
            (c0, s0), (c1, s1) = self.S
            a.append([c0[0] + s0 * w, y, 0])
            b.append([c1[0] + s1 * w, y, 0])
        return Polygon(*(a + b[::-1]), fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)


def lens_icon(kind="bi", h=1.6):
    """렌즈 단면 그림(앱의 여섯 가지 모양): bi·pl·me(볼록) / bc·pc·mc(오목)"""
    f = {"bi": (lambda y: -(4 + 18 * (1 - y * y)), lambda y: 4 + 18 * (1 - y * y)),
         "pl": (lambda y: -5, lambda y: 5 + 26 * (1 - y * y)),
         "me": (lambda y: -6 - 24 * (1 - y * y), lambda y: 6 - 12 * (1 - y * y)),
         "bc": (lambda y: -4 - 16 * y * y, lambda y: 4 + 16 * y * y),
         "pc": (lambda y: -5, lambda y: 5 + 24 * y * y),
         "mc": (lambda y: -9 - 12 * (1 - y * y), lambda y: 9 - 24 * (1 - y * y))}[kind]
    s = h / 100
    ys = np.linspace(-1, 1, 25)
    a = [[f[0](y) * s, y * 50 * s, 0] for y in ys]
    b = [[f[1](y) * s, y * 50 * s, 0] for y in ys]
    return Polygon(*(a + b[::-1]), fill_color=GLASS, fill_opacity=1, stroke_color=GLASS_D, stroke_width=4)


# ══════════════ 판 ══════════════
def panel(w, h, fill=NIGHT, x=0, y=0, stroke=INK, sw=4, r=0.22):
    return RoundedRectangle(corner_radius=r, width=w, height=h, fill_color=fill, fill_opacity=1,
                            stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


def stars(box, n=9, seed=1, col=WHITE):
    rng = np.random.default_rng(seed)
    x0, x1, y0, y1 = box
    return VGroup(*[Dot([rng.uniform(x0, x1), rng.uniform(y0, y1), 0], radius=0.03, color=col, fill_opacity=0.75)
                    for _ in range(n)])


# ══════════════ 2-1 물체를 보려면 ══════════════
def lighthouse(on=False, s=1.0):
    """등대(아래 가운데가 (0,0)). g.lamp: 불빛 자리"""
    body_c = "#F4F1EA" if on else "#5D5A55"
    tower = Polygon([-0.32, 0, 0], [0.32, 0, 0], [0.22, 1.9, 0], [-0.22, 1.9, 0], fill_color=body_c, fill_opacity=1,
                    stroke_color=INK, stroke_width=3)
    bands = VGroup(*[Polygon([-0.3 + 0.02 * k, y, 0], [0.3 - 0.02 * k, y, 0], [0.28 - 0.02 * k, y + 0.22, 0],
                             [-0.28 + 0.02 * k, y + 0.22, 0], fill_color="#C94F3D", fill_opacity=1, stroke_width=0)
                     for k, y in ((1, 0.4), (4, 1.15))])
    lamp = Rectangle(width=0.4, height=0.32, fill_color=GLOW if on else "#3A3A3A", fill_opacity=1, stroke_color=INK,
                     stroke_width=3).move_to([0, 2.06, 0])
    roof = Polygon([-0.32, 2.22, 0], [0.32, 2.22, 0], [0, 2.5, 0], fill_color="#C94F3D", fill_opacity=1,
                   stroke_color=INK, stroke_width=3)
    g = VGroup(tower, bands, lamp, roof).scale(s, about_point=ORIGIN)
    g.lamp = lamp
    return g


def ship(s=1.0, op=1.0):
    hull = Polygon([-0.9, 0.3, 0], [0.9, 0.3, 0], [0.65, -0.05, 0], [-0.65, -0.05, 0], fill_color="#C94F3D",
                   fill_opacity=op, stroke_width=0)
    cab = Rectangle(width=0.5, height=0.36, fill_color="#EEEEEE", fill_opacity=op, stroke_width=0).move_to([0, 0.48, 0])
    mast = Rectangle(width=0.06, height=0.42, fill_color="#DDDDDD", fill_opacity=op, stroke_width=0).move_to([0.05, 0.86, 0])
    return VGroup(hull, cab, mast).scale(s)


def rocks(s=1.0, op=1.0):
    a = Polygon([-0.9, 0, 0], [-0.6, 0.45, 0], [-0.2, 0.55, 0], [0.1, 0.3, 0], [0.2, 0, 0], fill_color="#5B5F66",
                fill_opacity=op, stroke_width=0)
    b = Polygon([0.1, 0, 0], [0.35, 0.35, 0], [0.65, 0.4, 0], [0.9, 0, 0], fill_color="#4F535A", fill_opacity=op,
                stroke_width=0)
    return VGroup(a, b).scale(s)


def flashlight(on=False, s=1.0):
    """손전등: 오른쪽을 향함(빛 나오는 곳 g.tip). 쓰는 쪽에서 rotate"""
    body = RoundedRectangle(corner_radius=0.08, width=0.9, height=0.34, fill_color=DGRAY, fill_opacity=1,
                            stroke_color=INK, stroke_width=3).move_to([-0.25, 0, 0])
    head = Polygon([0.2, -0.2, 0], [0.2, 0.2, 0], [0.42, 0.3, 0], [0.42, -0.3, 0], fill_color="#7A8D9E", fill_opacity=1,
                   stroke_color=INK, stroke_width=3)
    glass = Line([0.42, -0.28, 0], [0.42, 0.28, 0], stroke_color=GLOW if on else "#9AA3AD", stroke_width=6)
    btn = Rectangle(width=0.16, height=0.08, fill_color=GREEN if on else RED, fill_opacity=1, stroke_width=0).move_to([-0.35, 0.21, 0])
    g = VGroup(body, head, glass, btn).scale(s, about_point=ORIGIN)
    g.tip = np.array([0.42 * s, 0, 0])
    return g


def penguin(s=1.0):
    body = E(1.0, 1.3, "#26323B", 0, 0, sw=0)
    belly = E(0.62, 0.95, WHITE, 0, -0.08, sw=0)
    head = C(0.36, "#26323B", 0, 0.78, sw=0)
    eyes = VGroup(C(0.08, WHITE, -0.12, 0.82, sw=0), C(0.08, WHITE, 0.12, 0.82, sw=0),
                  Dot([-0.11, 0.82, 0], radius=0.035, color=INK), Dot([0.13, 0.82, 0], radius=0.035, color=INK))
    beak = Polygon([-0.08, 0.68, 0], [0.08, 0.68, 0], [0, 0.56, 0], fill_color="#F6A623", fill_opacity=1, stroke_width=0)
    feet = VGroup(E(0.32, 0.12, "#F6A623", -0.2, -0.66, sw=0), E(0.32, 0.12, "#F6A623", 0.2, -0.66, sw=0))
    return VGroup(feet, body, belly, head, eyes, beak).scale(s)


def dark_box(lid=True):
    """어둠상자(앞·위·옆면이 보이는 상자). g.top_hole · g.peep(옆면 관찰 구멍) · g.front"""
    front = Polygon([-1.7, -1.2, 0], [1.3, -1.2, 0], [1.3, 0.9, 0], [-1.7, 0.9, 0], fill_color="#8A6A42", fill_opacity=1,
                    stroke_color=INK, stroke_width=3)
    side = Polygon([1.3, -1.2, 0], [2.1, -0.75, 0], [2.1, 1.35, 0], [1.3, 0.9, 0], fill_color="#6F5434", fill_opacity=1,
                   stroke_color=INK, stroke_width=3)
    top = Polygon([-1.7, 0.9, 0], [1.3, 0.9, 0], [2.1, 1.35, 0], [-0.9, 1.35, 0],
                  fill_color="#6D5130" if lid else "#3B2A18", fill_opacity=1, stroke_color=INK, stroke_width=3)
    hole = Ellipse(width=0.5, height=0.16, fill_color="#1D140A", fill_opacity=1, stroke_width=0).move_to([0.2, 1.12, 0])
    peep = Circle(radius=0.15, fill_color="#120C06", fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([1.7, 0.2, 0])
    g = VGroup(front, side, top, hole, peep)
    g.front, g.top_hole, g.peep = front, hole, peep
    return g


def peep_view(lit=False, r=1.25, obj=None):
    """관찰 구멍으로 본 모습(둥근 창)"""
    ring = Circle(radius=r, fill_color="#E9DCC2" if lit else "#000000", fill_opacity=1, stroke_color="#3B3B3B",
                  stroke_width=12)
    g = VGroup(ring)
    if lit:
        glow = Ellipse(width=r * 1.6, height=r * 0.8, fill_color="#FFF8D0", fill_opacity=0.7, stroke_width=0).move_to([0, r * 0.5, 0])
        g.add(glow)
        if obj is not None:
            g.add(fit(obj, r * 1.1, r * 1.3).move_to([0, -0.08 * r, 0]))
    else:
        g.add(T("깜깜해요…", 28, "#777777"))
    return g


def street_lamp(on=True, h=2.4):
    pole = Rectangle(width=0.1, height=h, fill_color="#555555", fill_opacity=1, stroke_width=0).move_to([0, h / 2, 0])
    arm = Arc(radius=0.28, start_angle=PI, angle=-PI * 0.75, stroke_color="#555555", stroke_width=7).move_to([0.2, h + 0.08, 0])
    bulb = Ellipse(width=0.42, height=0.18, fill_color="#FFF3A6" if on else "#333333", fill_opacity=1,
                   stroke_width=0).move_to([0.0, h, 0])
    g = VGroup(pole, arm, bulb)
    g.bulb = bulb
    return g


def house(s=1.0, win_on=True):
    b = Rectangle(width=1.5, height=0.9, fill_color="#55606B", fill_opacity=1, stroke_width=0).move_to([0, 0.45, 0])
    roof = Polygon([-0.9, 0.9, 0], [0.9, 0.9, 0], [0, 1.45, 0], fill_color="#7A5A45", fill_opacity=1, stroke_width=0)
    w = Rectangle(width=0.32, height=0.32, fill_color="#FFD36B" if win_on else "#333333", fill_opacity=1,
                  stroke_width=0).move_to([-0.35, 0.5, 0])
    return VGroup(b, roof, w).scale(s, about_point=ORIGIN)


def walker(s=1.0, shirt="#3E7BC4"):
    head = C(0.17, "#F2C79B", 0, 0.95, sw=0)
    body = RoundedRectangle(corner_radius=0.1, width=0.3, height=0.5, fill_color=shirt, fill_opacity=1,
                            stroke_width=0).move_to([0, 0.55, 0])
    legs = VGroup(Line([-0.06, 0.32, 0], [-0.14, 0, 0]), Line([0.06, 0.32, 0], [0.14, 0, 0])).set_stroke(INK, 6)
    return VGroup(legs, body, head).scale(s, about_point=ORIGIN)


# ══════════════ 2-2 빛의 직진 ══════════════
def sun_s(r=0.42, col="#FFD23F"):
    c = Circle(radius=r, fill_color=col, fill_opacity=1, stroke_color="#E5A100", stroke_width=3)
    rays_ = VGroup(*[Line(np.array([np.cos(a), np.sin(a), 0]) * r * 1.25, np.array([np.cos(a), np.sin(a), 0]) * r * 1.6,
                          stroke_color="#E5A100", stroke_width=4) for a in np.linspace(0, TAU, 9)[:-1]])
    return VGroup(rays_, c)


def light_shaft(top_l, top_r, bot_l, bot_r, col=GLOW, op=0.55):
    return Polygon(P2(top_l), P2(top_r), P2(bot_r), P2(bot_l), fill_color=col, fill_opacity=op, stroke_width=0)


def car_night(s=1.0, col="#C0392B"):
    b = RoundedRectangle(corner_radius=0.1, width=1.3, height=0.5, fill_color=col, fill_opacity=1, stroke_width=0).move_to([0, 0.35, 0])
    t = RoundedRectangle(corner_radius=0.1, width=0.8, height=0.36, fill_color=col, fill_opacity=1, stroke_width=0).move_to([-0.1, 0.72, 0])
    w = VGroup(C(0.16, "#111111", -0.38, 0.1, sw=0), C(0.16, "#111111", 0.38, 0.1, sw=0))
    lamp = C(0.08, "#FFF8C0", 0.62, 0.4, sw=0)
    g = VGroup(b, t, w, lamp).scale(s, about_point=ORIGIN)
    g.lamp = lamp
    return g


def laser(s=1.0, on=True):
    """레이저 지시기: 오른쪽을 향함(빛 나오는 곳 g.tip)"""
    body = RoundedRectangle(corner_radius=0.1, width=1.1, height=0.24, fill_color="#3A3F48", fill_opacity=1,
                            stroke_color=INK, stroke_width=2).move_to([-0.55, 0, 0])
    btn = Rectangle(width=0.14, height=0.06, fill_color=LASER if on else "#777777", fill_opacity=1, stroke_width=0).move_to([-0.7, 0.14, 0])
    nose = Rectangle(width=0.08, height=0.14, fill_color="#888888", fill_opacity=1, stroke_width=0).move_to([0.03, 0, 0])
    g = VGroup(body, btn, nose).scale(s, about_point=ORIGIN)
    g.tip = np.array([0.07 * s, 0, 0])
    return g


def mist(box, n=60, seed=3, col="#9FB7D6", op=0.7):
    rng = np.random.default_rng(seed)
    x0, x1, y0, y1 = box
    return VGroup(*[Dot([rng.uniform(x0, x1), rng.uniform(y0, y1), 0], radius=0.035, color=col, fill_opacity=op)
                    for _ in range(n)])


def spray_bottle(s=1.0):
    body = RoundedRectangle(corner_radius=0.12, width=0.5, height=0.8, fill_color="#5DADE2", fill_opacity=0.85,
                            stroke_color=INK, stroke_width=3).move_to([0, -0.2, 0])
    neck = Rectangle(width=0.26, height=0.26, fill_color="#2E86C1", fill_opacity=1, stroke_width=0).move_to([0, 0.33, 0])
    nozzle = Rectangle(width=0.36, height=0.12, fill_color="#2E86C1", fill_opacity=1, stroke_width=0).move_to([-0.2, 0.42, 0])
    return VGroup(body, neck, nozzle).scale(s)


def stand_obj(w=0.36, h=0.9, col="#C76B3A"):
    """막대 위에 세운 불투명한 물체(그림자 실험)"""
    o = RoundedRectangle(corner_radius=0.08, width=w, height=h, fill_color=col, fill_opacity=1, stroke_color=INK,
                         stroke_width=3)
    return o


# ══════════════ 2-3 빛의 반사 ══════════════
def plane_mirror(a, b, back=0.16, col=MIRROR):
    """거울 선분 a–b(반사면) + 뒤쪽 나무 받침(뒷면 쪽 방향은 a→b의 오른쪽)"""
    a, b = P2(a), P2(b)
    u = (b - a) / np.linalg.norm(b - a)
    n = np.array([u[1], -u[0], 0])
    backp = Polygon(a, b, b + n * back, a + n * back, fill_color=WOOD, fill_opacity=1, stroke_color=WOOD_D, stroke_width=2)
    face = Line(a, b, stroke_color=col, stroke_width=11)
    shine = Line(a, b, stroke_color=WHITE, stroke_width=3)
    return VGroup(backp, face, shine)


def target(kind, x, y, s=0.42, col="#5B6B78"):
    board = RoundedRectangle(corner_radius=0.06, width=s * 1.7, height=s * 1.7, fill_color="#FDF2D6", fill_opacity=1,
                             stroke_color="#C9A85A", stroke_width=3).move_to([x, y, 0])
    if kind == "tri":
        sh = Polygon([x, y + s * 0.55, 0], [x + s * 0.55, y - s * 0.45, 0], [x - s * 0.55, y - s * 0.45, 0],
                     fill_color=col, fill_opacity=1, stroke_width=0)
    elif kind == "sq":
        sh = Rectangle(width=s * 0.95, height=s * 0.95, fill_color=col, fill_opacity=1, stroke_width=0).move_to([x, y, 0])
    else:
        sh = Circle(radius=s * 0.52, fill_color=col, fill_opacity=1, stroke_width=0).move_to([x, y, 0])
    g = VGroup(board, sh)
    g.shape = sh
    return g


def eye(s=1.0, look=RIGHT):
    """옆에서 본 눈(오른쪽을 봄)"""
    white = Polygon([-0.5, 0, 0], [0, 0.28, 0], [0.5, 0, 0], [0, -0.28, 0], fill_color=WHITE, fill_opacity=1,
                    stroke_color=INK, stroke_width=4)
    white.round_corners(radius=0.12)
    iris = Circle(radius=0.2, fill_color="#5A3A22", fill_opacity=1, stroke_width=0).move_to([0.12, 0, 0])
    pup = Dot([0.15, 0, 0], radius=0.09, color=INK)
    g = VGroup(white, iris, pup).scale(s)
    if look is LEFT:
        g.flip(UP)
    return g


def apple(s=1.0):
    body = VMobject(fill_color="#D93A32", fill_opacity=1, stroke_color="#8E1F1A", stroke_width=3)
    pts = [[0, 0.45], [-0.35, 0.6], [-0.6, 0.25], [-0.5, -0.3], [-0.2, -0.55], [0, -0.48], [0.2, -0.55], [0.5, -0.3],
           [0.6, 0.25], [0.35, 0.6], [0, 0.45]]
    body.set_points_smoothly([P2(p) for p in pts])
    stem = Line([0, 0.45, 0], [0.08, 0.72, 0], stroke_color="#6B4A2A", stroke_width=5)
    leaf = Ellipse(width=0.32, height=0.14, fill_color="#4CAF50", fill_opacity=1, stroke_width=0).rotate(0.5).move_to([0.25, 0.68, 0])
    return VGroup(body, stem, leaf).scale(s)


# ══════════════ 2-4 렌즈 ══════════════
def ant(s=1.0, col="#3A2A1E"):
    parts = VGroup(E(0.24, 0.18, col, -0.3, 0, sw=0), E(0.24, 0.18, col, -0.02, 0, sw=0), E(0.4, 0.26, col, 0.32, 0, sw=0))
    legs = VGroup()
    for x in (-0.08, 0.0, 0.08):
        legs.add(Line([x, 0, 0], [x - 0.12, 0.22, 0]), Line([x, 0, 0], [x - 0.12, -0.22, 0]))
    legs.add(Line([-0.4, 0.05, 0], [-0.55, 0.22, 0]), Line([-0.4, 0.05, 0], [-0.52, 0.28, 0]))
    legs.set_stroke(col, 3)
    return VGroup(legs, parts).scale(s)


def magnifier(r=0.9, col="#5A4632"):
    glass = Circle(radius=r, fill_color="#CFEFFF", fill_opacity=0.25, stroke_color=col, stroke_width=12)
    d = np.array([np.cos(-PI / 4), np.sin(-PI / 4), 0])
    handle = Line(d * r * 1.05, d * r * 2.0, stroke_color=col, stroke_width=22)
    return VGroup(glass, handle)


def tank(x0=-4.6, x1=4.6, wy=0.15, by=-2.25, top=1.5):
    """옆에서 본 투명한 통 + 우유를 탄 물(위가 열림)"""
    water = Rectangle(width=x1 - x0, height=wy - by, fill_color="#E9EEF3", fill_opacity=0.28, stroke_width=0).move_to(
        [(x0 + x1) / 2, (wy + by) / 2, 0])
    wall = VMobject(stroke_color="#9FB3C8", stroke_width=5)
    wall.set_points_as_corners([P2([x0, top]), P2([x0, by]), P2([x1, by]), P2([x1, top])])
    surf = Line([x0, wy, 0], [x1, wy, 0], stroke_color="#CFE3F5", stroke_width=3)
    la = T("공기", 26, "#CFE3F5").move_to([x1 - 0.55, wy + 0.32, 0])
    lw = T("물", 26, "#CFE3F5").move_to([x1 - 0.55, wy - 0.35, 0])
    return VGroup(water, wall, surf, la, lw)


# ══════════════ 2-5 생활 속 거울과 렌즈 ══════════════
def car_mirror():
    b = RoundedRectangle(corner_radius=0.12, width=2.2, height=0.6, fill_color="#2F7FD0", fill_opacity=1, stroke_width=0).move_to([0, -0.2, 0])
    t = Polygon([-0.6, 0.1, 0], [-0.3, 0.6, 0], [0.5, 0.6, 0], [0.8, 0.1, 0], fill_color="#2F7FD0", fill_opacity=1, stroke_width=0)
    w1 = Polygon([-0.45, 0.14, 0], [-0.25, 0.5, 0], [0.08, 0.5, 0], [0.08, 0.14, 0], fill_color="#CFEAFF", fill_opacity=1, stroke_width=0)
    w2 = Polygon([0.16, 0.14, 0], [0.16, 0.5, 0], [0.45, 0.5, 0], [0.65, 0.14, 0], fill_color="#CFEAFF", fill_opacity=1, stroke_width=0)
    wh = VGroup(C(0.24, "#222222", -0.6, -0.5, sw=0), C(0.24, "#222222", 0.6, -0.5, sw=0))
    m = RoundedRectangle(corner_radius=0.06, width=0.3, height=0.24, fill_color=MIRROR, fill_opacity=1, stroke_color="#2C5D8A",
                         stroke_width=4).move_to([-0.78, 0.42, 0])
    arm = Line([-0.66, 0.34, 0], [-0.52, 0.15, 0], stroke_color="#2C5D8A", stroke_width=4)
    g = VGroup(b, t, w1, w2, wh, arm, m)
    g.spot = m
    return g


def dental():
    rod = Line([-0.9, -0.6, 0], [0.55, 0.3, 0], stroke_color="#8A9AA8", stroke_width=9)
    m = Circle(radius=0.26, fill_color="#CFEFFF", fill_opacity=1, stroke_color="#8A9AA8", stroke_width=5).move_to([0.72, 0.4, 0])
    g = VGroup(rod, m)
    g.spot = m
    return g


def lamp_shade():
    cord = Line([0, 0.95, 0], [0, 0.45, 0], stroke_color="#555555", stroke_width=4)
    shade = Polygon([-0.75, -0.2, 0], [-0.3, 0.45, 0], [0.3, 0.45, 0], [0.75, -0.2, 0], fill_color="#C9D3DA", fill_opacity=1,
                    stroke_color=INK, stroke_width=3)
    inner = Polygon([-0.6, -0.2, 0], [-0.22, 0.32, 0], [0.22, 0.32, 0], [0.6, -0.2, 0], fill_color="#EAF6FF", fill_opacity=1,
                    stroke_color=MIRROR, stroke_width=4)
    bulb = C(0.15, "#FFF3A6", 0, -0.12, sw=2)
    beam = Polygon([-0.55, -0.25, 0], [0.55, -0.25, 0], [0.95, -1.0, 0], [-0.95, -1.0, 0], fill_color="#FFF6B0",
                   fill_opacity=0.6, stroke_width=0)
    g = VGroup(beam, cord, shade, inner, bulb)
    g.spot = inner
    return g


def shoe_mirror():
    floor = Rectangle(width=2.4, height=0.2, fill_color="#D9C49A", fill_opacity=1, stroke_width=0).move_to([0, -0.85, 0])
    m = Rectangle(width=0.7, height=1.5, fill_color="#CFEFFF", fill_opacity=1, stroke_color=WOOD_D, stroke_width=5).move_to([0.6, 0, 0])
    shoe = Polygon([-1.0, -0.75, 0], [-0.95, -0.55, 0], [-0.7, -0.5, 0], [-0.45, -0.62, 0], [-0.2, -0.65, 0], [-0.2, -0.75, 0],
                   fill_color="#C0392B", fill_opacity=1, stroke_width=0)
    shoe2 = shoe.copy().set_fill(opacity=0.45).scale(0.8).move_to([0.6, -0.5, 0])
    g = VGroup(floor, m, shoe2, shoe)
    g.spot = m
    return g


def reading_glasses():
    l1 = Circle(radius=0.48, fill_color="#E6F6FF", fill_opacity=1, stroke_color="#5A4632", stroke_width=7).move_to([-0.6, 0, 0])
    l2 = Circle(radius=0.48, fill_color="#E6F6FF", fill_opacity=1, stroke_color="#5A4632", stroke_width=7).move_to([0.6, 0, 0])
    br = Arc(radius=0.14, start_angle=0, angle=PI, stroke_color="#5A4632", stroke_width=6).move_to([0, 0.08, 0])
    t1 = T("가", 34, INK).move_to(l1)
    t2 = T("나", 34, INK).move_to(l2)
    g = VGroup(l1, l2, br, t1, t2)
    g.spot = VGroup(l1, l2)
    return g


def loupe():
    leaf = Polygon([0.1, -0.9, 0], [0.9, -0.5, 0], [1.1, -0.1, 0], [0.5, -0.4, 0], fill_color=LEAF, fill_opacity=1, stroke_width=0)
    g0 = Circle(radius=0.5, fill_color="#E6F6FF", fill_opacity=0.85, stroke_color="#2E7D32", stroke_width=8).move_to([-0.25, 0.25, 0])
    h = Line([0.12, -0.12, 0], [0.7, -0.7, 0], stroke_color="#2E7D32", stroke_width=14)
    bug = ant(0.9).move_to([-0.25, 0.25, 0])
    g = VGroup(leaf, h, g0, bug)
    g.spot = g0
    return g


def camera():
    body = RoundedRectangle(corner_radius=0.16, width=2.0, height=1.15, fill_color="#3A3F48", fill_opacity=1, stroke_width=0)
    top = RoundedRectangle(corner_radius=0.06, width=0.55, height=0.22, fill_color="#3A3F48", fill_opacity=1, stroke_width=0).move_to([-0.5, 0.65, 0])
    l1 = Circle(radius=0.42, fill_color="#222222", fill_opacity=1, stroke_width=0).move_to([0, -0.02, 0])
    l2 = Circle(radius=0.28, fill_color="#6FA8DC", fill_opacity=1, stroke_width=0).move_to([0, -0.02, 0])
    g = VGroup(top, body, l1, l2)
    g.spot = l1
    return g


def telescope():
    tube = RoundedRectangle(corner_radius=0.08, width=1.9, height=0.38, fill_color="#D9DDE3", fill_opacity=1, stroke_color=INK,
                            stroke_width=3)
    front = Rectangle(width=0.2, height=0.56, fill_color="#9AA3AD", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0.95, 0, 0])
    lens = Ellipse(width=0.12, height=0.48, fill_color=GLASS, fill_opacity=1, stroke_width=0).move_to([1.07, 0, 0])
    g0 = VGroup(tube, front, lens).rotate(0.42).move_to([0, 0.35, 0])
    legs = VGroup(Line([-0.05, 0.2, 0], [-0.55, -0.9, 0]), Line([-0.05, 0.2, 0], [0.45, -0.9, 0]),
                  Line([-0.05, 0.2, 0], [-0.05, -0.9, 0])).set_stroke("#9AA3AD", 5)
    g = VGroup(legs, g0)
    g.spot = lens
    return g


def microscope():
    base = RoundedRectangle(corner_radius=0.06, width=1.2, height=0.22, fill_color=DGRAY, fill_opacity=1, stroke_width=0).move_to([0, -0.85, 0])
    arm = Arc(radius=0.6, start_angle=-PI / 2, angle=PI, stroke_color=DGRAY, stroke_width=16).move_to([0.25, -0.1, 0])
    stage = Rectangle(width=0.9, height=0.1, fill_color="#555555", fill_opacity=1, stroke_width=0).move_to([-0.15, -0.35, 0])
    tube = Rectangle(width=0.24, height=0.95, fill_color="#D9DDE3", fill_opacity=1, stroke_color=INK, stroke_width=3).rotate(-0.25).move_to([-0.15, 0.35, 0])
    g = VGroup(base, arm, stage, tube)
    g.spot = tube
    return g
