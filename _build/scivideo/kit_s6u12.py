"""6-1 2단원 「물체의 운동」 전용 그림 부품 (s6ep07~12, s6mm02)

모두 직접 그린 단순한 벡터 그림. 수(거리·시간·속력)는 차시 앱(grade6/science/_build_tb/src/u2-1~u2-7.html) 스크립트의 값.
  탈것: car_top(위에서 본 태엽 자동차, 앞부분이 오른쪽 끝) · car_side(옆에서 본 자동차) · train · lift(승강기 칸) · robot(코딩 로봇) · bus(kit_s5u24)
  재기: tape(줄자: 출발선부터 cm 눈금) · zoom_tape(앞부분 근처를 크게 본 줄자) · stopwatch(초시계, .disp 글자 자리) · gauge(속력 계기판)
  정원판: Garden(7×7 칸, 가운데 분수, 꽃 네 가지, .pt(x, y) 칸 좌표 → 화면 좌표) · flower · fountain · bee(kit_s3u12)
  생활: ball · bird · slide(미끄럼틀) · bear · traffic_light · stop_line_road · zigzag_road · speed_sign · speed_bump · guard_rail
        seatbelt · airbag · gap_keep · speed_board(과속 경보) · bars(가로 막대그래프)
  그 밖: label·text_card·fit·ox_mark·bin_box(kit_s5u11) · word_card·result_table(kit_s5u13) · tree·name_text·arrow_right(kit_s6u11)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Arrow, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, Square,
                   VGroup, VMobject, DashedLine)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, person  # noqa: F401
from kit_s5u13 import word_card, result_table  # noqa: F401
from kit_s5u11 import label, text_card, fit, ox_mark, bin_box  # noqa: F401
from kit_s5u24 import bus, arrow_lr  # noqa: F401
from kit_s6u11 import tree, name_text, arrow_right  # noqa: F401
from kit_s3u12 import C, E, L, poly, smooth, bee  # noqa: F401

SW = 4
CAR_RED, CAR_BLUE, CAR_GREEN, CAR_YEL = "#E2573F", "#1C6FA8", "#27AE60", "#F1C40F"
ROAD = "#7F8C8D"
TAPE = "#FFD23F"


def R(w, h, fill, x=0, y=0, rad=0.0, stroke=INK, sw=SW, op=1.0):
    if rad:
        m = RoundedRectangle(corner_radius=rad, width=w, height=h, fill_color=fill, fill_opacity=op,
                             stroke_color=stroke or fill, stroke_width=sw if stroke else 0)
    else:
        m = Rectangle(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke or fill,
                      stroke_width=sw if stroke else 0)
    return m.move_to([x, y, 0])


# ══════════════ 탈것 ══════════════
def car_top(col=CAR_RED, s=1.0):
    """위에서 본 태엽 자동차. 앞부분(오른쪽 끝)이 (0, 0)."""
    w, h = 1.25 * s, 0.62 * s
    g = VGroup()
    for x in (-w * 0.78, -w * 0.22):
        for y in (h / 2 + 0.03 * s, -h / 2 - 0.03 * s):
            g.add(R(0.24 * s, 0.1 * s, "#333333", x, y, rad=0.03 * s, stroke=None))
    g.add(R(w, h, col, -w / 2, 0, rad=0.18 * s, stroke=INK, sw=3))
    g.add(R(0.42 * s, h * 0.72, "#CFE6F2", -w * 0.55, 0, rad=0.08 * s, stroke=INK, sw=2))
    g.add(R(0.1 * s, h * 0.9, "#333333", -0.07 * s, 0, rad=0.03 * s, stroke=None, op=0.35))
    key = VGroup(R(0.08 * s, 0.32 * s, "#C9A227", -w - 0.05 * s, 0, stroke=INK, sw=2),
                 E(0.16 * s, 0.14 * s, "#C9A227", -w - 0.13 * s, 0.11 * s, stroke=INK, sw=2),
                 E(0.16 * s, 0.14 * s, "#C9A227", -w - 0.13 * s, -0.11 * s, stroke=INK, sw=2))
    g.add(key)
    return g


def car_side(col=CAR_RED, w=1.6, face=1):
    """옆에서 본 자동차(가운데 기준). face=-1이면 왼쪽을 봄."""
    h = w * 0.3
    body = R(w, h, col, 0, 0, rad=0.1 * w, stroke=INK, sw=3)
    top = poly([(-w * 0.3, h / 2), (-w * 0.16, h * 1.25), (w * 0.2, h * 1.25), (w * 0.34, h / 2)], col, sw=3)
    win1 = poly([(-w * 0.22, h * 0.55), (-w * 0.13, h * 1.1), (0.0, h * 1.1), (0.0, h * 0.55)], "#CFE6F2", sw=2)
    win2 = poly([(w * 0.05, h * 0.55), (w * 0.05, h * 1.1), (w * 0.18, h * 1.1), (w * 0.27, h * 0.55)], "#CFE6F2", sw=2)
    wh = VGroup(C(w * 0.11, "#333333", -w * 0.28, -h / 2, sw=2), C(w * 0.11, "#333333", w * 0.3, -h / 2, sw=2))
    g = VGroup(top, win1, win2, body, wh)
    if face < 0:
        g.flip(UP)
    return g


def train(w=2.4):
    h = w * 0.3
    g = VGroup(R(w, h, "#1C6FA8", 0, 0, rad=0.12, stroke=INK, sw=3),
               poly([(w / 2, h / 2), (w / 2 + w * 0.13, -h / 2 + 0.05), (w / 2, -h / 2)], "#164F78", sw=3))
    for k in range(4):
        g.add(R(w * 0.13, h * 0.38, "#CFE6F2", -w * 0.36 + k * w * 0.22, h * 0.12, rad=0.03, stroke=INK, sw=2))
    g.add(C(w * 0.06, "#333333", -w * 0.3, -h / 2, sw=2), C(w * 0.06, "#333333", w * 0.3, -h / 2, sw=2))
    return g


def lift(w=1.2):
    h = w * 0.55
    return VGroup(R(w, h, "#90A4AE", 0, 0, stroke="#455A64", sw=3), L((0, -h / 2), (0, h / 2), "#455A64", 3))


def robot(s=1.0):
    return VGroup(L((0, 0.2 * s), (0, 0.38 * s), "#16A085", 5), C(0.07 * s, RED, 0, 0.42 * s, sw=2),
                  R(0.56 * s, 0.46 * s, "#16A085", 0, 0, rad=0.1 * s, stroke=INK, sw=3),
                  C(0.07 * s, PAPER, -0.12 * s, 0.05 * s, sw=2), C(0.07 * s, PAPER, 0.12 * s, 0.05 * s, sw=2))


# ══════════════ 재기 ══════════════
def tape(x0, y, cm_max=150, per_cm=0.075, every=20, minor=10, h=0.3, size=20):
    """줄자: x0가 0 cm. every cm마다 숫자, minor cm마다 눈금."""
    L_ = cm_max * per_cm
    g = VGroup(R(L_, h, TAPE, x0 + L_ / 2, y, stroke="#C49A00", sw=2))
    for c in range(0, cm_max + 1, minor):
        x = x0 + c * per_cm
        big = c % every == 0
        g.add(Line([x, y + h / 2, 0], [x, y + h / 2 - (0.17 if big else 0.1), 0], stroke_color=INK, stroke_width=2))
        if big:
            g.add(T(str(c), size, INK, bold=False).move_to([x, y - h / 2 - 0.17, 0]))
    g.add(R(0.3, 0.36, RED, x0 + L_ + 0.17, y, rad=0.06, stroke=INK, sw=2))
    return g


def zoom_tape(d, col, w=5.2, per_cm=0.42, size=24):
    """앞부분(d cm) 근처를 크게 본 줄자. 가운데 정렬된 그룹, 1 mm 눈금. .front = 앞부분 점선."""
    lo = int(np.floor(d)) - 6
    hi = lo + int(w / per_cm)
    g = VGroup(R(w + 0.1, 3.0, "#EFE6D6", 0, 0, rad=0.12, stroke=SOFT, sw=3))
    x0 = -w / 2
    ty = -0.55
    g.add(R(w, 0.5, TAPE, 0, ty, stroke="#C49A00", sw=2))
    for mm in range(0, (hi - lo) * 10 + 1):
        v = lo + mm / 10
        x = x0 + (v - lo) * per_cm
        big, half = mm % 10 == 0, mm % 5 == 0
        g.add(Line([x, ty + 0.25, 0], [x, ty + 0.25 - (0.26 if big else 0.17 if half else 0.09), 0],
                   stroke_color=INK, stroke_width=2.4 if big else 1.2))
        if big and int(round(v)) % 2 == 0:
            g.add(T(str(int(round(v))), size, INK, bold=False).move_to([x, ty - 0.48, 0]))
    fx = x0 + (d - lo) * per_cm
    body = R(2.2, 0.8, col, fx - 1.1, 0.55, rad=0.15, stroke=INK, sw=3)
    front = DashedLine([fx, 1.2, 0], [fx, -0.9, 0], stroke_color=RED, stroke_width=4, dash_length=0.08)
    g.add(body, front)
    g.front = front
    return g


def stopwatch(r=0.75):
    """초시계. .disp: 글자를 올릴 화면 자리(가운데)."""
    g = VGroup(R(0.24 * r, 0.22 * r, "#555555", 0, r * 1.08, rad=0.04, stroke=INK, sw=2),
               Circle(radius=r, fill_color="#33415C", fill_opacity=1, stroke_color=INK, stroke_width=4),
               R(1.4 * r, 0.62 * r, "#DFF3E4", 0, 0, rad=0.08, stroke=INK, sw=2))
    g.disp = g[2]
    return g


def gauge(val=60, vmax=120, r=1.4):
    g = VGroup(R(2.6 * r, 1.7 * r, "#1D2633", 0, 0.25 * r, rad=0.2 * r, stroke=INK, sw=3))
    g.add(Arc(radius=r, start_angle=0, angle=PI, stroke_color="#3D4B5C", stroke_width=14).shift(DOWN * 0.15 * r))
    c = np.array([0, -0.15 * r, 0])
    for k in range(0, vmax + 1, 20):
        a = PI * (1 - k / vmax)
        u = np.array([np.cos(a), np.sin(a), 0])
        g.add(Line(c + u * r * 0.85, c + u * r * 1.0, stroke_color=PAPER, stroke_width=3))
        g.add(T(str(k), int(18 * r), PAPER, bold=False).move_to(c + u * r * 0.66))
    a = PI * (1 - val / vmax)
    g.add(Line(c, c + np.array([np.cos(a), np.sin(a), 0]) * r * 0.82, stroke_color=RED, stroke_width=7))
    g.add(Dot(c, radius=0.08 * r, color=RED))
    g.add(T(f"{val} km/h", int(22 * r), "#BDF0CF").move_to(c + DOWN * 0.3 * r))
    return g


# ══════════════ 정원판 (u2-2) ══════════════
FLOWERS = [("수선화꽃", -3, 0, "#FFD23F"), ("제비꽃", 0, 2, "#8E44AD"), ("유채꽃", 2, 3, "#F1C40F"),
           ("진달래꽃", 1, -1, "#E86FA4")]


def flower(col, r=0.13):
    g = VGroup()
    for i in range(5):
        a = PI / 2 + i * TAU / 5
        g.add(Circle(radius=r, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=1.5)
              .move_to([np.cos(a) * r * 1.3, np.sin(a) * r * 1.3, 0]))
    g.add(Circle(radius=r * 0.75, fill_color="#FFF3A0", fill_opacity=1, stroke_color="#C49A00", stroke_width=2))
    return g


def fountain(r=0.26):
    return VGroup(Circle(radius=r, fill_color="#CFD8DC", fill_opacity=1, stroke_color="#90A4AE", stroke_width=3),
                  Circle(radius=r * 0.66, fill_color="#6EC3F0", fill_opacity=1, stroke_width=0),
                  L((0, -0.02), (0, r * 0.55), PAPER, 3))


class Garden:
    def __init__(self, center=(-3.0, 0.3), cell=0.62, size=20):
        self.c = np.array([center[0], center[1], 0.0])
        self.cell = cell
        n = 7
        W = n * cell
        g = VGroup(R(W, W, "#EAF6E2", center[0], center[1], stroke="#9FC48C", sw=3))
        for i in range(1, n):
            v = -W / 2 + i * cell
            g.add(Line(self.c + [v, -W / 2, 0], self.c + [v, W / 2, 0], stroke_color="#9FC48C", stroke_width=2))
            g.add(Line(self.c + [-W / 2, v, 0], self.c + [W / 2, v, 0], stroke_color="#9FC48C", stroke_width=2))
        g.add(fountain().move_to(self.pt(0, 0)))
        g.add(T("분수", size, INK).move_to(self.pt(0, 0) + DOWN * 0.42))
        self.flowers = {}
        for n_, x, y, col in FLOWERS:
            f = flower(col).move_to(self.pt(x, y) + UP * 0.07)
            t = T(n_, size - 2, INK).move_to(self.pt(x, y) + DOWN * 0.23)
            self.flowers[n_] = VGroup(f, t)
            g.add(self.flowers[n_])
        self.group = g

    def pt(self, x, y):
        return self.c + np.array([x * self.cell, y * self.cell, 0])


# ══════════════ 생활 그림 ══════════════
def ball(r=0.3, col="#F2F2F2"):
    g = VGroup(Circle(radius=r, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3))
    g.add(poly([(np.cos(PI / 2 + k * TAU / 5) * r * 0.35, np.sin(PI / 2 + k * TAU / 5) * r * 0.35) for k in range(5)], INK, sw=1))
    return g


def bird(s=1.0, col="#5B6F8F", fly=False):
    body = E(0.6 * s, 0.38 * s, col, 0, 0, sw=2)
    head = C(0.15 * s, col, 0.3 * s, 0.14 * s, sw=2)
    beak = poly([(0.43 * s, 0.16 * s), (0.56 * s, 0.13 * s), (0.43 * s, 0.09 * s)], "#F2A33A", sw=1.5)
    eye = Dot([0.34 * s, 0.18 * s, 0], radius=0.025 * s, color=PAPER)
    if fly:
        wing = poly([(-0.05 * s, 0.05 * s), (-0.3 * s, 0.45 * s), (0.12 * s, 0.1 * s)], col, sw=2)
    else:
        wing = E(0.32 * s, 0.18 * s, "#4A5C78", -0.06 * s, 0.0, sw=1.5)
    return VGroup(body, wing, head, beak, eye)


def slide(s=1.0):
    g = VGroup()
    for x in (-1.6 * s, -1.1 * s):
        g.add(L((x, -1.2 * s), (x, 1.0 * s), "#4A6FA5", 6))
    for k in range(5):
        y = -0.9 * s + k * 0.4 * s
        g.add(L((-1.6 * s, y), (-1.1 * s, y), "#4A6FA5", 5))
    g.add(R(0.62 * s, 0.14 * s, RED, -1.35 * s, 1.03 * s, stroke=INK, sw=2))
    sl = VMobject(stroke_color="#C49A00", stroke_width=4, fill_color="#FFD23F", fill_opacity=1)
    pts = [(-1.08, 1.0), (-0.3, 0.75), (0.6, -0.6), (1.4, -1.05), (1.7, -1.05), (1.7, -1.2), (1.3, -1.2),
           (0.45, -0.75), (-0.4, 0.55), (-1.08, 0.82)]
    sl.set_points_as_corners([[x * s, y * s, 0] for x, y in pts] + [[-1.08 * s, 1.0 * s, 0]])
    g.add(sl)
    return g


def bear(s=1.0, op=1.0):
    col = "#B07A46"
    g = VGroup(C(0.12 * s, "#A0673A", -0.2 * s, 0.62 * s, sw=2), C(0.12 * s, "#A0673A", 0.2 * s, 0.62 * s, sw=2),
               E(0.6 * s, 0.5 * s, col, 0, 0.0, sw=2), C(0.3 * s, col, 0, 0.42 * s, sw=2),
               E(0.24 * s, 0.17 * s, "#E8C9A4", 0, 0.34 * s, sw=1),
               Dot([0, 0.37 * s, 0], radius=0.04 * s, color=INK),
               Dot([-0.1 * s, 0.5 * s, 0], radius=0.035 * s, color=INK), Dot([0.1 * s, 0.5 * s, 0], radius=0.035 * s, color=INK))
    g.set_opacity(op)
    return g


def traffic_light(red=False, s=1.0):
    return VGroup(R(0.08 * s, 1.2 * s, "#6B7C93", 0, -0.75 * s, stroke=None),
                  R(0.42 * s, 0.82 * s, "#33415C", 0, 0.1 * s, rad=0.08 * s, stroke=INK, sw=2),
                  C(0.13 * s, "#E74C3C" if red else "#555555", 0, 0.3 * s, sw=1.5),
                  C(0.13 * s, "#555555" if red else "#2ECC71", 0, -0.1 * s, sw=1.5))


def stop_line_road(x0=-6.6, x1=6.6, y=-0.4, stop_x=3.2, h=1.5, rain=False):
    g = VGroup(R(x1 - x0, h, "#59636B" if rain else ROAD, (x0 + x1) / 2, y, stroke=None))
    n = int((x1 - x0) / 1.2)
    for k in range(n):
        g.add(R(0.6, 0.07, PAPER, x0 + 0.5 + k * 1.2, y, stroke=None))
    g.add(R(0.14, h, PAPER, stop_x, y, stroke=None))
    g.add(T("정지선", 26, INK).move_to([stop_x, y + h / 2 + 0.25, 0]))
    if rain:
        for i in range(40):
            xx = x0 + ((i * 1.37) % (x1 - x0))
            yy = y - h / 2 + ((i * 0.53) % (h + 2.2))
            g.add(Line([xx, yy, 0], [xx - 0.06, yy - 0.18, 0], stroke_color="#8FB3D9", stroke_width=2.5))
    return g


def zigzag_road(w=9.0, h=2.2):
    g = VGroup(R(w, h, "#6F7A82", 0, 0, stroke=None), L((-w / 2, 0), (w / 2, 0), "#FFD23F", 4))
    for sgn in (1, -1):
        pts = []
        for k in range(int(w / 0.5) + 1):
            x = -w / 2 + k * 0.5
            if x > w * 0.2:
                break
            pts.append([x, sgn * (h / 2 - (0.12 if k % 2 else 0.32)), 0])
        m = VMobject(stroke_color=PAPER, stroke_width=4)
        m.set_points_as_corners(pts)
        g.add(m)
    for i in range(6):
        g.add(R(0.22, h * 0.8 / 6 * 0.6, PAPER, w * 0.33, -h * 0.4 + (i + 0.5) * h * 0.8 / 6, stroke=None))
    return g


def speed_sign(n=30, r=0.45):
    return VGroup(R(0.08, 1.2, "#6B7C93", 0, -r - 0.55, stroke=None),
                  Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color=RED, stroke_width=9),
                  T(str(n), int(r * 64), INK))


def speed_bump(w=2.4):
    road = R(w, 0.4, ROAD, 0, -0.2, stroke=None)
    bump = VMobject(fill_color="#FFD23F", fill_opacity=1, stroke_color="#C49A00", stroke_width=3)
    bump.set_points_smoothly([[-w * 0.3, 0, 0], [0, 0.3, 0], [w * 0.3, 0, 0]])
    bump.add_line_to(np.array([-w * 0.3, 0, 0]))
    marks = VGroup(*[L((x, 0.07), (x + 0.1, 0.2), PAPER, 4) for x in (-w * 0.12, 0, w * 0.12)])
    return VGroup(road, bump, marks)


def guard_rail(w=2.4):
    g = VGroup(R(w, 0.3, ROAD, 0, -0.55, stroke=None))
    for x in (-w * 0.4, 0, w * 0.4):
        g.add(L((x, -0.4), (x, 0.35), "#6B7C93", 6))
    for y in (0.25, -0.05):
        g.add(R(w * 0.95, 0.14, "#E8EEF2", 0, y, rad=0.04, stroke=RED, sw=2))
    return g


def seatbelt():
    seat = R(1.2, 1.5, "#5B6F8F", 0, 0, rad=0.2, stroke=INK, sw=3)
    head = C(0.22, "#F1C7A1", 0, 0.5, sw=2)
    belt = VGroup(L((-0.45, 0.25), (0.45, -0.6), RED, 9), L((-0.45, -0.3), (0.45, -0.3), RED, 8))
    return VGroup(seat, head, belt)


def airbag():
    wheel = Circle(radius=0.45, stroke_color="#33415C", stroke_width=9).move_to([-0.45, 0, 0])
    bag = E(1.15, 1.0, "#F4F6F8", 0.35, 0.05, stroke="#9FB3C8", sw=4)
    return VGroup(wheel, bag)


def gap_keep():
    a = fit(car_side(CAR_BLUE, 1.2), 1.0, 0.5).move_to([-0.95, 0, 0])
    b = fit(car_side(CAR_RED, 1.2), 1.0, 0.5).move_to([0.95, 0, 0])
    m = VGroup(L((-0.4, -0.45), (0.4, -0.45), GREEN, 4), L((-0.4, -0.35), (-0.4, -0.55), GREEN, 4),
               L((0.4, -0.35), (0.4, -0.55), GREEN, 4))
    return VGroup(a, b, m)


def speed_board():
    return VGroup(R(0.1, 1.0, "#6B7C93", 0, -0.75, stroke=None), R(1.3, 0.75, "#1D2633", 0, 0.1, rad=0.08, stroke=INK, sw=3),
                  T("32", 34, "#FFD23F").move_to([0, 0.1, 0]))


def bars(items, vmax, x0=-4.2, length=9.0, y0=1.6, dy=0.78, h=0.42, size=28, unit="", show_val=True):
    """가로 막대: items [(이름, 값, 색)]. 반환 (이름들, 막대들, 값 글자들) — 막대는 왼쪽 끝 x0에 붙음."""
    names, bs, vals = VGroup(), VGroup(), VGroup()
    for i, (n, v, col) in enumerate(items):
        y = y0 - i * dy
        names.add(T(n, size, INK).next_to([x0 - 0.15, y, 0], LEFT, buff=0))
        w = max(0.04, length * v / vmax)
        b = R(w, h, col, x0 + w / 2, y, rad=min(0.08, w / 2), stroke=None, op=0.85)
        bs.add(b)
        vt = f"{v:g} {unit}".strip()
        vals.add(T(vt, size - 2, INK).next_to(b, RIGHT, buff=0.15))
    return names, bs, vals
