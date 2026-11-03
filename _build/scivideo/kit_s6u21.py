"""6-2 1단원 「계절의 변화」 전용 그림 부품 (s6ep25~29, s6mm05)

모두 직접 그린 단순한 벡터 그림. 값은 차시 앱(grade6/science/_build_tb/src2/u1-1 ~ u1-6.html)에 있는 수 그대로.
  측정기:  gnomon(태양 고도 측정기 옆모습: 막대기·그림자·실·각) · protractor(반원 각도기)
  그래프:  LineGraph(꺾은선그래프 — .pt(i, v) · .dots(값) · .line(값))
  하늘:    SkyDome(남쪽 하늘을 비스듬히 본 반구 — 계절별 태양이 지나는 길) · day_scene(시각별 하늘·그림자)
  빛:      beam_panel(같은 빛줄기 n개가 일정한 면적에 닿는 수) · flashlight · light_meter · stage_light
  지구:    orbit_view(태양 둘레 네 자리의 지구, 자전축 방향 고정) · globe_lamp(전등 + 지구본 옆모습 + 그림자)
  그 밖:   season_card(계절 축제 안내 한 장)
"""
import math
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, DashedLine, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject, Sector, DashedVMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED
from kit_s5u11 import label, text_card, fit, ox_mark, rnd  # noqa: F401
from kit_s5u13 import word_card, result_table  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401
from kit_s6u11 import name_text, arrow_right  # noqa: F401
from kit_s6u13 import pointer, steps_row  # noqa: F401
from kit_s6u14 import sun_icon, lamp, curved_arrow, earth_side, SUN_Y, SUN_O, NAVY, OCEAN, LANDC  # noqa: F401

RAD = math.pi / 180
SKY = "#BFE3FA"
GRASS = "#9CC77A"
BOARD = "#F3E7CF"
STICK = "#9CCC65"
STICK_D = "#4E7A1E"
STRING = "#C2332C"
SHADOW = "#555555"
ALT_COL = "#E08A00"      # 태양 고도 그래프(앱 색)
SHD_COL = "#6A4FA3"      # 그림자 길이 그래프
TMP_COL = "#C2332C"      # 기온 그래프
DAY_COL = "#1C6FA8"      # 낮의 길이 그래프
SUMMER = "#E2573F"
SPRING = "#16804A"
WINTER = "#1C6FA8"


def _arc_mark(vertex, a0, a1, r, col=STRING, sw=5):
    """꼭짓점 vertex에서 a0~a1(도, 시계 반대) 각 표시 호"""
    return Arc(radius=r, start_angle=a0 * RAD, angle=(a1 - a0) * RAD, arc_center=np.array(vertex, dtype=float),
               stroke_color=col, stroke_width=sw)


def sun_rays(target, alt, n=4, gap=0.42, length=2.6, col="#F0A020", from_left=True):
    """target 쪽으로 alt° 기울어 들어오는 나란한 햇빛 점선"""
    d = np.array([math.cos(alt * RAD) * (1 if from_left else -1), -math.sin(alt * RAD), 0])
    nrm = np.array([-d[1], d[0], 0])
    g = VGroup()
    for k in range(n):
        end = np.array(target, dtype=float) + nrm * gap * (k - (n - 1) / 2) - d * 0.55
        g.add(DashedLine(end - d * length, end, stroke_color=col, stroke_width=4, dash_length=0.14))
    return g


# ── 태양 고도 측정기 ──────────────────────────────────────────
def gnomon(alt=40, stick=1.4, x0=-2.0, y0=-1.4, string=True, arc=True, rays=True, sun=True, deg_label=None,
           board_w=None, size=28, right=True, sun_d=3.4):
    """태양 고도 측정기 옆모습. 막대기(수수깡) 밑동 (x0, y0), 길이 stick. 태양은 왼쪽 위(alt°).
    .stick .shadow .string .arc .tip(그림자 끝) .top(막대 끝) .sun"""
    L = stick / math.tan(alt * RAD)
    s = 1 if right else -1
    bw = board_w or max(L + 1.4, 3.0)
    g = VGroup()
    board = Rectangle(width=bw, height=0.22, fill_color=BOARD, fill_opacity=1, stroke_color="#8A6A3A", stroke_width=3)
    board.move_to([x0 + s * (bw / 2 - 0.5), y0 - 0.11, 0])
    ruler = Rectangle(width=bw - 0.4, height=0.07, fill_color="#FFE680", fill_opacity=1, stroke_color="#8A6A1A", stroke_width=2)
    ruler.move_to([x0 + s * (bw / 2 - 0.5), y0 + 0.035, 0])
    g.add(board, ruler)
    tip = np.array([x0 + s * L, y0 + 0.07, 0])
    top = np.array([x0, y0 + 0.07 + stick, 0])
    shadow = Line([x0, y0 + 0.08, 0], tip, stroke_color=SHADOW, stroke_width=10, stroke_opacity=0.7)
    st = RoundedRectangle(corner_radius=0.04, width=0.14, height=stick, fill_color=STICK, fill_opacity=1,
                          stroke_color=STICK_D, stroke_width=3).move_to([x0, y0 + 0.07 + stick / 2, 0])
    g.add(shadow, st)
    g.stick, g.shadow, g.tip, g.top = st, shadow, tip, top
    if string:
        sl = Line(top, tip, stroke_color=STRING, stroke_width=5)
        g.string = sl
        g.add(sl)
    if arc:
        a0, a1 = (180 - alt, 180) if right else (0, alt)
        am = _arc_mark(tip, a0, a1, 0.62, STRING)
        g.arc = am
        g.add(am)
        if deg_label:
            t = T(deg_label, size, STRING)
            t.next_to(tip, RIGHT if right else LEFT, buff=0.2).shift(UP * (0.25 + t.height / 2))
            g.deg = t
            g.add(t)
    if rays:
        g.rays = sun_rays(top + np.array([0, 0.05, 0]), alt, n=4, gap=0.45, length=2.4, from_left=right)
        g.add(g.rays)
    if sun:
        d = np.array([-math.cos(alt * RAD) * s, math.sin(alt * RAD), 0])
        g.sun = sun_icon(0.3).move_to(top + d * sun_d)
        g.add(g.sun)
    return g


def protractor(r=1.0, ticks=True, col="#1C6FA8"):
    g = VGroup(Sector(radius=r, start_angle=0, angle=PI, fill_color="#DCEFFC", fill_opacity=0.75, stroke_color=col,
                      stroke_width=4))
    if ticks:
        for a in range(0, 181, 10):
            L = 0.16 * r if a % 30 == 0 else 0.09 * r
            c, s_ = math.cos(a * RAD), math.sin(a * RAD)
            g.add(Line([c * (r - L), s_ * (r - L), 0], [c * r, s_ * r, 0], stroke_color=col, stroke_width=3))
    g.add(Dot(ORIGIN, radius=0.05, color=col))
    return g


# ── 꺾은선그래프 ─────────────────────────────────────────────
class LineGraph(VGroup):
    """x 칸 이름 xs, 세로 ymin~ymax(눈금 step). .pt(i, v)로 화면 점. 오른쪽 세로축(r_*)도 둘 수 있음."""

    def __init__(self, xs, ymin, ymax, step, w=6.0, h=3.4, center=(0, 0), title="", unit="", col=INK,
                 size=22, xsize=20, r_range=None, r_unit="", r_col=INK, fmt=None, r_fmt=None, tsize=26):
        super().__init__()
        self.xs, self.ymin, self.ymax, self.w, self.h = xs, ymin, ymax, w, h
        cx, cy = center
        self.x0, self.x1, self.y0, self.y1 = cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2
        bg = Rectangle(width=w, height=h, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=3).move_to([cx, cy, 0])
        self.add(bg)
        n = int(round((ymax - ymin) / step))
        fmt = fmt or (lambda v: f"{v:g}")
        for k in range(n + 1):
            v = ymin + k * step
            y = self.yv(v)
            self.add(Line([self.x0, y, 0], [self.x1, y, 0], stroke_color="#C9D6E2", stroke_width=2))
            self.add(T(fmt(v), size, col).next_to([self.x0, y, 0], LEFT, buff=0.12))
        for i, x in enumerate(xs):
            xx = self.xi(i)
            self.add(Line([xx, self.y0, 0], [xx, self.y1, 0], stroke_color="#E3EBF2", stroke_width=1.5))
            self.add(T(x, xsize, INK).next_to([xx, self.y0, 0], DOWN, buff=0.12))
        self.r_range = r_range
        if r_range:
            rmin, rmax, rstep = r_range
            self.rmin, self.rmax = rmin, rmax
            r_fmt = r_fmt or (lambda v: f"{v:g}")
            m = int(round((rmax - rmin) / rstep))
            for k in range(m + 1):
                v = rmin + k * rstep
                y = self.y0 + (v - rmin) / (rmax - rmin) * h
                self.add(T(r_fmt(v), size, r_col).next_to([self.x1, y, 0], RIGHT, buff=0.12))
            if r_unit:
                self.add(T(r_unit, size, r_col).next_to([self.x1, self.y1, 0], UP, buff=0.12).shift(RIGHT * 0.6))
        if unit:
            self.add(T(unit, size, col).next_to([self.x0, self.y1, 0], UP, buff=0.12).shift(LEFT * (0.6 if r_range else 0.3)))
        if title:
            self.add(T(title, tsize, col).next_to(bg, UP, buff=0.12))

    def xi(self, i):
        return self.x0 + self.w / len(self.xs) * (i + 0.5)

    def yv(self, v):
        return self.y0 + (v - self.ymin) / (self.ymax - self.ymin) * self.h

    def yr(self, v):
        return self.y0 + (v - self.rmin) / (self.rmax - self.rmin) * self.h

    def pt(self, i, v, right=False):
        return np.array([self.xi(i), self.yr(v) if right else self.yv(v), 0])

    def dots(self, vals, col, right=False, r=0.08):
        return VGroup(*[Dot(self.pt(i, v, right), radius=r, color=col) for i, v in enumerate(vals)])

    def line(self, vals, col, right=False, sw=6):
        pts = [self.pt(i, v, right) for i, v in enumerate(vals)]
        m = VMobject(stroke_color=col, stroke_width=sw)
        m.set_points_as_corners(pts)
        return m


# ── 하늘 반구(계절별 태양의 길) ───────────────────────────────
LAT = 37.5


class SkyDome(VGroup):
    """남쪽에서 비스듬히 내려다본 하늘 반구. 지평선은 타원(가로 R, 세로 R*k), 동은 왼쪽, 서는 오른쪽, 남은 앞(아래)."""

    def __init__(self, R=3.6, k=0.3, center=(0, -1.3), labels=True, size=28, dome=False):
        super().__init__()
        self.R, self.k, self.c = R, k, np.array([center[0], center[1], 0.0])
        ground = Ellipse(width=2 * R, height=2 * R * k, fill_color=GRASS, fill_opacity=0.9, stroke_color="#4E7A1E",
                         stroke_width=3).move_to(self.c)
        dome = Arc(radius=R, start_angle=0, angle=PI, arc_center=self.c, stroke_color="#8FB3CC", stroke_width=3)
        self.add(ground)
        if dome:
            self.add(dome)
        self.ground = ground
        if labels:
            for az, n in ((90, "동"), (180, "남"), (270, "서"), (0, "북")):
                p = self.xy(az, 0)
                off = {90: LEFT, 270: RIGHT, 180: DOWN, 0: UP}[az]
                t = T(n, size, INK)
                bx = RoundedRectangle(corner_radius=0.08, width=0.56, height=0.5, fill_color=PAPER, fill_opacity=1,
                                      stroke_color=NAVY, stroke_width=3)
                lab = VGroup(bx, t)
                t.move_to(bx)
                lab.move_to(p + off * 0.42)
                self.add(lab)
        self.add(Dot(self.c, radius=0.07, color=INK))

    def xy(self, az, alt):
        """방위각(북 0°, 동 90°) · 고도 → 화면"""
        e = math.cos(alt * RAD) * math.sin(az * RAD)       # 동쪽 +
        nn = math.cos(alt * RAD) * math.cos(az * RAD)      # 북쪽 +
        z = math.sin(alt * RAD)
        return self.c + np.array([-e * self.R, z * self.R + nn * self.R * self.k, 0])

    def sun_path(self, dec, col, sw=6, dashed=False):
        """적위 dec°인 날 태양이 지평선 위에 있는 동안의 길. .rise .set .noon 화면 점"""
        pts = []
        for i in range(0, 721):
            H = -180 + i * 0.5
            la, de, h = LAT * RAD, dec * RAD, H * RAD
            sa = math.sin(la) * math.sin(de) + math.cos(la) * math.cos(de) * math.cos(h)
            alt = math.asin(sa)
            if alt < 0:
                continue
            az = math.atan2(math.sin(h), math.cos(h) * math.sin(la) - math.tan(de) * math.cos(la)) / RAD + 180
            pts.append(self.xy(az, alt / RAD))
        m = VMobject(stroke_color=col, stroke_width=sw)
        m.set_points_smoothly(pts[::6] + [pts[-1]])
        if dashed:
            m = DashedVMobject(m, num_dashes=50)
        m.rise, m.set_, m.noon = pts[0], pts[-1], pts[len(pts) // 2]
        m.noon_alt = 90 - LAT + dec
        return m

    def noon_mark(self, dec, col):
        """남중 고도 표시: 가운데에서 남쪽 지평선 ↔ 남중한 태양까지의 호"""
        a = 90 - LAT + dec
        p_s = self.xy(180, 0)
        p_n = self.xy(180, a)
        g = VGroup(Line(self.c, p_n, stroke_color=col, stroke_width=3), DashedLine(self.c, p_s, stroke_color=col, stroke_width=3))
        return g


# ── 빛줄기와 일정한 면적 ─────────────────────────────────────
def beam_panel(alt, w=4.8, n=10, beam_w=1.5, box_w=1.5, cx=0.0, y=-1.6, title=None, show_count=True, size=26,
               col_in="#F0A020", col_out="#F6CF86", sun=True, length=3.0):
    """앱 u1-4 '같은 빛, 다른 넓이': 폭 beam_w인 빛줄기 n개가 alt°로 땅에 닿음. 가운데 노란 칸(box_w)에 닿는 수 .count"""
    g = VGroup()
    ground = Rectangle(width=w, height=0.5, fill_color="#C9B08A", fill_opacity=1, stroke_width=0).move_to([cx, y - 0.25, 0])
    g.add(ground)
    box = Rectangle(width=box_w, height=0.14, fill_color="#FFE680", fill_opacity=1, stroke_color="#C9861A", stroke_width=3)
    box.move_to([cx, y - 0.07, 0])
    ux, uy = math.cos(alt * RAD), math.sin(alt * RAD)
    foot = beam_w / uy
    cnt = 0
    rays = VGroup()
    for kk in range(n):
        hx = cx - foot / 2 + foot * (kk + 0.5) / n
        inside = abs(hx - cx) <= box_w / 2 + 1e-6
        cnt += inside
        sx, sy = hx - length * ux, y + length * uy
        rays.add(Line([sx, sy, 0], [hx, y, 0], stroke_color=col_in if inside else col_out,
                      stroke_width=5 if inside else 3))
    g.add(rays, box)
    g.rays, g.box, g.count = rays, box, cnt
    am = _arc_mark([cx - foot / 2, y, 0], 180 - alt, 180, 0.5, STRING, 4)
    g.add(am)
    g.arc = am
    if sun:
        s = sun_icon(0.26).move_to([cx - (length + 0.5) * ux, y + (length + 0.5) * uy, 0])
        g.sun = s
        g.add(s)
    if title:
        tt = T(title, size, INK).move_to([cx, y + length * 0.98 + 0.25, 0])
        g.add(tt)
    if show_count:
        c = M(f'노란 칸에 닿는 빛줄기 <span foreground="{RED}">{cnt}개</span>', size).move_to([cx, y - 0.85, 0])
        g.cnt_text = c
        g.add(c)
    return g


def flashlight(s=1.0, angle=0.0):
    """손전등(빛이 나오는 쪽이 오른쪽). angle 라디안만큼 돌림"""
    body = RoundedRectangle(corner_radius=0.08, width=0.95, height=0.36, fill_color="#5A6270", fill_opacity=1,
                            stroke_color="#222", stroke_width=3)
    head = Polygon([0.45, -0.18, 0], [0.75, -0.3, 0], [0.75, 0.3, 0], [0.45, 0.18, 0], fill_color="#7A828E",
                   fill_opacity=1, stroke_color="#222", stroke_width=3)
    lens = Line([0.75, -0.28, 0], [0.75, 0.28, 0], stroke_color="#FFE680", stroke_width=8)
    g = VGroup(body, head, lens).scale(s)
    g.rotate(angle, about_point=ORIGIN)
    return g


def phone(w=2.6, s=1.0):
    """눕혀 놓은 스마트 기기(옆모습)와 카메라 센서"""
    g = VGroup(RoundedRectangle(corner_radius=0.05, width=w, height=0.16, fill_color="#DFE6EE", fill_opacity=1,
                                stroke_color="#555", stroke_width=3),
               Dot([0, 0.02, 0], radius=0.05, color="#1C6FA8"))
    return g.scale(s)


def light_meter(value, w=2.4, h=1.4, size=48):
    """조도 측정기 화면(숫자가 클수록 빛이 셈)"""
    box = RoundedRectangle(corner_radius=0.16, width=w, height=h, fill_color="#111111", fill_opacity=1,
                           stroke_color="#888888", stroke_width=4)
    t1 = T("조도 측정기", 20, "#9FD8FF").move_to(box.get_top() + DOWN * 0.24)
    v = T(f"{value:,}", size, PAPER).move_to(box.get_center() + DOWN * 0.08)
    t2 = T("숫자가 클수록 빛이 세요", 16, "#9FD8FF").move_to(box.get_bottom() + UP * 0.18)
    g = VGroup(box, t1, v, t2)
    g.val = v
    return g


def lux(a):
    """앱 u1-4 가상 실험의 화면 숫자(예시): round(1503·sin a)"""
    return int(round(1503 * math.sin(a * RAD)))


def torch_rig(alt, cx=0.0, y=-1.2, R=2.6, stick=0.5, w=3.4):
    """손전등 실험 옆모습: 스마트 기기 위 빨판 막대, 손전등이 alt°로 비춤, 막대 그림자. .light(빛 띠)"""
    g = VGroup()
    ph = phone(w).move_to([cx, y, 0])
    g.add(ph)
    ux, uy = math.cos(alt * RAD), math.sin(alt * RAD)
    lx, ly = cx - R * ux, y + R * uy
    half = 0.34 / uy
    beam = Polygon([lx, ly, 0], [cx - half, y + 0.08, 0], [cx + half, y + 0.08, 0], fill_color="#FFF3A8",
                   fill_opacity=0.35 + 0.4 * uy, stroke_width=0)
    spot = Rectangle(width=2 * half, height=0.06, fill_color="#FFF6C0", fill_opacity=0.5 + 0.5 * uy,
                     stroke_width=0).move_to([cx, y + 0.1, 0])
    g.add(beam, spot)
    sx = cx + 0.55
    L = stick / math.tan(alt * RAD)
    g.add(Line([sx, y + 0.1, 0], [sx + L, y + 0.1, 0], stroke_color="#222", stroke_width=8, stroke_opacity=0.75))
    g.add(Line([sx, y + 0.1, 0], [sx, y + 0.1 + stick, 0], stroke_color="#8A5A2A", stroke_width=6))
    fl = flashlight(0.9, -alt * RAD).move_to([lx - 0.25 * ux, ly + 0.25 * uy, 0])
    g.add(fl)
    am = _arc_mark([cx - half, y + 0.08, 0], 180 - alt, 180, 0.55, STRING, 4)
    g.add(am)
    g.beam, g.spot, g.arc, g.fl = beam, spot, am, fl
    g.shadow_len = L
    return g


def stage_light(alt, w=5.6, cx=0.0, y=-1.5):
    """무대 조명: 배우를 alt°로 비춤(수직이면 좁고 밝음)"""
    g = VGroup(Rectangle(width=w, height=3.9, fill_color="#2A2140", fill_opacity=1, stroke_width=0).move_to([cx, y + 1.7, 0]),
               Rectangle(width=w, height=0.5, fill_color="#8A5A2A", fill_opacity=1, stroke_width=0).move_to([cx, y - 0.25, 0]))
    ux, uy = math.cos(alt * RAD), math.sin(alt * RAD)
    R = 2.9
    lx, ly = cx - R * ux, y + R * uy
    half = 0.42 / uy
    g.add(Polygon([lx, ly, 0], [cx - half, y, 0], [cx + half, y, 0], fill_color="#FFF3A8", fill_opacity=0.15 + 0.35 * uy,
                  stroke_width=0))
    g.add(Ellipse(width=2 * half, height=0.16, fill_color="#FFF6C0", fill_opacity=0.25 + 0.7 * uy, stroke_width=0)
          .move_to([cx, y, 0]))
    # 배우
    g.add(Circle(radius=0.17, fill_color="#FFD9B0", fill_opacity=1, stroke_width=0).move_to([cx, y + 1.05, 0]),
          Polygon([cx - 0.2, y + 0.86, 0], [cx + 0.2, y + 0.86, 0], [cx + 0.28, y + 0.3, 0], [cx - 0.28, y + 0.3, 0],
                  fill_color="#4A7AD0", fill_opacity=1, stroke_width=0),
          Line([cx - 0.1, y + 0.3, 0], [cx - 0.1, y, 0], stroke_color="#2A2A4A", stroke_width=7),
          Line([cx + 0.1, y + 0.3, 0], [cx + 0.1, y, 0], stroke_color="#2A2A4A", stroke_width=7))
    g.add(flashlight(0.8, -alt * RAD).move_to([lx, ly, 0]))
    return g


# ── 공전하는 지구 ────────────────────────────────────────────
def mini_earth(r=0.42, tilt=23.5, hl=False):
    """궤도 그림의 작은 지구: 북반구 초록, 자전축(노랑)은 화면 오른쪽으로 tilt° 기움"""
    g = VGroup(Circle(radius=r, fill_color=OCEAN, fill_opacity=1, stroke_color=PAPER, stroke_width=3))
    cap = Sector(radius=r * 0.97, start_angle=0.25, angle=PI - 0.5, fill_color=LANDC, fill_opacity=0.95 if hl else 0.7,
                 stroke_width=0)
    eq = Ellipse(width=2 * r, height=r * 0.36, stroke_color=PAPER, stroke_width=2, stroke_opacity=0.6)
    ax = Line([0, -r - 0.22, 0], [0, r + 0.22, 0], stroke_color=SUN_Y, stroke_width=5)
    inner = VGroup(cap, eq, ax).rotate(-tilt * RAD, about_point=ORIGIN)
    g.add(inner)
    return g


def orbit_view(tilt=23.5, rx=4.6, ry=1.55, center=(0, 0.25), labels=True, size=28, er=0.42):
    """태양 둘레 공전 궤도(위에서 비스듬히). 봄(뒤)·여름(왼쪽)·가을(앞)·겨울(오른쪽). .earths .pos .sun .orbit"""
    c = np.array([center[0], center[1], 0.0])
    g = VGroup()
    orb = DashedVMobject(Ellipse(width=2 * rx, height=2 * ry, stroke_color="#9FB3C8", stroke_width=3).move_to(c), num_dashes=60)
    sun = VGroup(Circle(radius=0.62, fill_color=SUN_Y, fill_opacity=1, stroke_color=SUN_O, stroke_width=5))
    for i in range(12):
        a = i * TAU / 12
        sun.add(Line([0.75 * math.cos(a), 0.75 * math.sin(a), 0], [0.95 * math.cos(a), 0.95 * math.sin(a), 0],
                     stroke_color=SUN_O, stroke_width=5))
    sun.move_to(c)
    g.add(orb, sun)
    pos = {"봄": c + UP * ry, "여름": c + LEFT * rx, "가을": c + DOWN * ry, "겨울": c + RIGHT * rx}
    earths = {}
    for n, p in pos.items():
        e = mini_earth(er, tilt).move_to(p)
        earths[n] = e
        g.add(e)
        if labels:
            t = T(n, size, PAPER if False else INK)
            bx = RoundedRectangle(corner_radius=0.08, width=t.width + 0.24, height=t.height + 0.16, fill_color=PAPER,
                                  fill_opacity=0.95, stroke_width=0)
            lab = VGroup(bx, t)
            t.move_to(bx)
            lab.next_to(e, DOWN, buff=0.12) if n != "봄" else lab.next_to(e, UP, buff=0.1)
            g.add(lab)
    g.earths, g.pos, g.sun, g.orbit, g.c = earths, pos, sun, orb, c
    return g


def globe_lamp(tau=0.0, shadow=1.4, R=1.35, cx=1.6, cy=0.3, lamp_x=-3.6, k=0.42, size=28, show_len=True):
    """앱 u1-5 옆모습: 왼쪽 전등, 오른쪽 지구본(북극이 전등 쪽으로 tau° 기움, 앞뒤로 기울면 0),
    우리나라(북위 37.5°)의 전등 쪽 면에 막대 + 그림자(shadow cm × k). .globe .stick .shadow"""
    g = VGroup()
    lp = lamp(1.15, "전등").move_to([lamp_x, cy, 0])
    g.add(lp)
    for j in range(-2, 3):
        g.add(DashedLine([lamp_x + 0.75, cy + j * 0.38, 0], [cx - R - 0.25, cy + j * 0.38, 0], stroke_color="#F0A020",
                         stroke_width=3, dash_length=0.14, stroke_opacity=0.7))
    c = np.array([cx, cy, 0])
    lit = Sector(radius=R, start_angle=PI / 2, angle=PI, arc_center=c, fill_color="#4FA3E0", fill_opacity=1, stroke_width=0)
    body = VGroup(Circle(radius=R, fill_color="#1D2F52", fill_opacity=1, stroke_width=0).move_to(c), lit,
                  Circle(radius=R, stroke_color=NAVY, stroke_width=4).move_to(c))
    g.add(body)
    # 자전축: 수직에서 tau°만큼 북극이 왼쪽(전등 쪽)으로
    t_ = tau * RAD
    up = np.array([-math.sin(t_), math.cos(t_), 0])
    g.add(Line(c - up * (R + 0.4), c + up * (R + 0.4), stroke_color=SUN_Y, stroke_width=6))
    eq_dir = np.array([up[1], -up[0], 0])
    g.add(Line(c - eq_dir * R, c + eq_dir * R, stroke_color=PAPER, stroke_width=2, stroke_opacity=0.5))
    # 우리나라: 적도에서 37.5° 위, 전등 쪽(왼쪽)
    left = -eq_dir
    p_dir = left * math.cos(37.5 * RAD) + up * math.sin(37.5 * RAD)
    kp = c + p_dir * R
    tang = up * math.cos(37.5 * RAD) - left * math.sin(37.5 * RAD)    # 지표면을 따라 북쪽
    stick = Line(kp, kp + p_dir * 0.42, stroke_color="#8A5A2A", stroke_width=7)
    sh = Line(kp, kp + tang * shadow * k, stroke_color="#111111", stroke_width=8, stroke_opacity=0.9)
    g.add(sh, stick, Dot(kp, radius=0.07, color="#FF4D4D"))
    g.stick, g.shadow, g.kp = stick, sh, kp
    if show_len:
        tl = label(f"그림자 길이 {shadow} cm", STRING, size).move_to([cx, cy - R - 0.55, 0])
        g.len_label = tl
        g.add(tl)
    return g


def season_card(season, col, lines, w=3.2, size=24, head=32):
    h = T(season, head, col)
    ls = VGroup(*[M(x, size) for x in lines]).arrange(DOWN, buff=0.16)
    if ls.width > w - 0.4:
        ls.scale_to_fit_width(w - 0.4)
    body = VGroup(h, ls).arrange(DOWN, buff=0.22)
    box = RoundedRectangle(corner_radius=0.2, width=w, height=body.height + 0.5, fill_color=PAPER, fill_opacity=1,
                           stroke_color=col, stroke_width=5)
    body.move_to(box)
    return VGroup(box, body)
