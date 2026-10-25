"""5-2 3단원 「열과 우리 생활」 전용 그림 부품 (s5ep30~36, s5mm07)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit().
  온도계: probe_thermo(값)(탐침 온도계 — .txt .tip) · alcohol_thermo(°C)(알코올 온도계 — .col_for(°C) .y_of(°C))
          ir_gun(값)(적외선 온도계 — .muzzle) · reading(값)(온도 표시 글)
  그릇: cup(물 색, 이름) · col_of(°C)(따뜻하면 붉게, 차가우면 푸르게 — 앱 u3-2 색)
  열의 이동: heat_arrow(a, b)(빨간 열 화살표) · flame · candle
  두 물체: cyl_can(원통 °C, 캔 °C)(앱 u3-2 장치) · temp_graph(HOT, COLD)(앱 u3-2 꺾은선그래프 — .pts(i) .lines)
  전도: Plate(행 글자 목록, 칸 크기, 가열 칸)(열 변색 붙임딱지 — 앱 u3-3 mkPlate처럼 판을 따라 거리 → .set_front(f) .at(r, c))
  대류: tank(물 높이)(사각 통) · loops(가운데 위로 → 양옆 → 벽 따라 아래 화살표) · along(path, s)
        acryl_box(아크릴 통) · room(난로·냉방기 자리)
  복사: black_plate · sun_rays · heat_lamp
  생활: iron · kettle · window_sun · ice_pack · steamer · ondol · spoon_soup · pot_on_stand · mitt · parasol · coat_layers · thermos
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Arrow, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, Square,
                   VGroup, VMobject, DashedLine)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, SKIN
from kit_s3u12 import fit, E, C, L, poly, smooth, text_card, ox_mark  # noqa: F401
from kit_s4u24 import R, rect, sun_hot, lines  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401
from kit_s5u13 import word_card, pic_card, result_table  # noqa: F401
from kit_s5u11 import label  # noqa: F401
from kit_s4u23 import kid  # noqa: F401

SW = 4
NAVY = "#0F3B5C"
GLASS = "#7AA7BD"
WATER = "#CFE9F8"
JUICE = "#F5A35A"
CU = "#C8763A"
CU_D = "#9C5A2A"
ST_COLD = "#5B3F8C"     # 열 변색 붙임딱지(처음)
ST_HOT = "#F6C445"      # 열 변색 붙임딱지(색깔 변함)
INK_P = "#7D4FB3"       # 잉크
HOT = "#C0392B"
COLD = "#1C6FA8"
HEAT = "#E2573F"        # 열 화살표
SUNY = "#FFD23F"


def _mix(a, b, f):
    a = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    f = max(0.0, min(1.0, f))
    return "#" + "".join(f"{round(x * (1 - f) + y * f):02X}" for x, y in zip(a, b))


def col_of(t):
    """앱 u3-2의 온도 색(45 °C 붉음 → 10 °C 푸름)"""
    if t >= 28:
        return _mix("#F7B2A5", "#F2D9C0", (45 - t) / 17)
    if t >= 18:
        return _mix("#F2D9C0", "#E6EEF2", (28 - t) / 10)
    return _mix("#E6EEF2", "#A9D4F2", (18 - t) / 8)


# ══════════════ 온도계 ══════════════
def reading(val, size=30, col=NAVY):
    return T(val, size, col)


def probe_thermo(val="", on=True, probe=1.5, s=1.0):
    """탐침 온도계(몸체 위, 탐침이 아래로). .txt 표시 글, .tip 탐침 끝"""
    body = R(1.0, 1.15, "#F4F7FA", 0, 0, rad=0.16, stroke=NAVY, sw=4)
    scr = R(0.8, 0.38, "#D9F0D0" if on else "#9AA6B0", 0, 0.24, rad=0.05, stroke=NAVY, sw=2)
    btn = C(0.1, "#E2573F", 0, -0.22, stroke=NAVY, sw=2)
    pr = poly([(-0.05, -0.575), (0.05, -0.575), (0.03, -0.575 - probe), (0, -0.575 - probe - 0.08),
               (-0.03, -0.575 - probe)], "#B8C2CC", stroke="#6B7A88", sw=2)
    txt = reading(val if val else "--.-", 24).move_to(scr)
    if txt.width > 0.72:
        txt.scale_to_fit_width(0.72)
    g = VGroup(pr, body, scr, btn, txt)
    g.scale(s)
    g.txt = txt
    g.scr = scr
    g.tip_y = lambda: pr.get_bottom()[1]
    return g


def probe_txt(g, val, size=24):
    t = reading(val, size).move_to(g.scr)
    if t.width > g.scr.width * 0.9:
        t.scale_to_fit_width(g.scr.width * 0.9)
    return t


class AlcoholThermo(VGroup):
    """알코올 온도계 0~40 °C. (0,0) 가운데, 높이 h"""

    def __init__(self, c=20.0, h=4.2, vmax=40, **kw):
        super().__init__(**kw)
        self.h, self.vmax = h, vmax
        self.y0 = -h / 2 + 0.55          # 0 °C 높이
        self.y1 = h / 2 - 0.3            # vmax 높이
        frame = R(1.1, h, PAPER, 0, 0, rad=0.2, stroke="#A0673A", sw=4)
        tube = R(0.16, h - 0.5, "#EEF3F6", -0.15, 0.05, rad=0.08, stroke="#B8C2CC", sw=2)
        bulb = C(0.17, "#D63C32", -0.15, -h / 2 + 0.32, stroke="#D63C32", sw=1)
        ticks = VGroup()
        nums = VGroup()
        for t in range(0, vmax + 1, 5):
            y = self.y_of(t)
            ticks.add(L((-0.05, y), (0.1 if t % 10 else 0.2, y), INK, 2))
            if t % 10 == 0:
                nums.add(T(str(t), 18, INK, bold=False).move_to([0.36, y, 0]))
        self.frame = frame
        self.col = self.col_for(c)
        unit = T("°C", 20, INK).move_to([0.32, h / 2 - 0.12, 0])
        self.add(frame, tube, self.col, bulb, ticks, nums, unit)

    def _o(self):
        f = getattr(self, "frame", None)
        k = (f.height / self.h) if f is not None else 1.0
        return (f.get_center() if f is not None else np.zeros(3)), k

    def y_of(self, c):
        o, k = self._o()
        return o[1] + k * (self.y0 + (self.y1 - self.y0) * c / self.vmax)

    def col_for(self, c):
        o, k = self._o()
        bot = o[1] + k * (-self.h / 2 + 0.32)
        top = self.y_of(c)
        r = Rectangle(width=0.09 * k, height=max(0.01, top - bot), fill_color="#D63C32", fill_opacity=1, stroke_width=0)
        r.move_to([o[0] - 0.15 * k, (top + bot) / 2, 0])
        return r


def alcohol_thermo(c=20.0, h=4.2):
    return AlcoholThermo(c, h)


def ir_gun(val="", on=True):
    """적외선 온도계(총 모양, 오른쪽을 겨눔). .muzzle 레이저가 나가는 곳"""
    body = poly([(0, 0), (1.3, 0), (1.5, 0.2), (1.7, 0.2), (1.7, -0.35), (1.5, -0.35), (1.35, -0.25), (0.85, -0.25),
                 (0.7, -1.1), (0.35, -1.1), (0.5, -0.25), (0, -0.25)], "#F2C94C", stroke="#7A5A12", sw=3)
    scr = R(0.62, 0.3, "#D9F0D0" if on else "#9AA6B0", 0.4, 0.05 - 0.17 + 0.17 - 0.12 + 0.12 - 0.06, rad=0.04,
            stroke=INK, sw=2)
    scr.move_to([0.42, -0.04, 0])
    trig = R(0.14, 0.24, "#E2573F", 0.95, -0.42, rad=0.04, stroke=INK, sw=2)
    txt = reading(val, 18).move_to(scr)
    if txt.width > 0.55:
        txt.scale_to_fit_width(0.55)
    g = VGroup(body, trig, scr, txt)
    g.scr = scr
    g.txt = txt
    g.muzzle = lambda: body.get_right() + DOWN * 0.07
    return g


# ══════════════ 그릇 ══════════════
def cup(fill=WATER, name="", w=1.4, h=1.7, level=0.8, steam=False, ice=False):
    hb, ht = w * 0.4, w / 2
    pts = [(-ht, h), (-hb, 0), (hb, 0), (ht, h)]
    back = poly(pts, "#F4FBFF", stroke=GLASS, sw=5, op=0.5)
    lh = h * level
    lw = hb + (ht - hb) * level
    liq = poly([(-lw + 0.06, lh), (-hb + 0.06, 0.05), (hb - 0.06, 0.05), (lw - 0.06, lh)], fill, stroke=fill, sw=1)
    g = VGroup(back, liq)
    if ice:
        for (x, y, a) in ((-0.2, lh - 0.25, 0.25), (0.22, lh - 0.4, -0.1)):
            g.add(R(0.3, 0.3, "#E9F7FF", x, y, rad=0.05, stroke="#9FC9E6", sw=2).rotate(a))
    if steam:
        for k in (-0.35, 0, 0.35):
            g.add(smooth([(k, h + 0.1), (k - 0.1, h + 0.3), (k, h + 0.5), (k - 0.1, h + 0.7)], "#E2A3A3", 4))
    g.add(VMobject(stroke_color=GLASS, stroke_width=6).set_points_as_corners([[p[0], p[1], 0] for p in pts]))
    if name:
        g.add(T(name, 28, NAVY).move_to([0, -0.32, 0]))
    g.liq = liq
    g.move_to(ORIGIN)
    return g


def heat_arrow(a, b, col=HEAT, sw=9):
    return Arrow([a[0], a[1], 0], [b[0], b[1], 0], buff=0, color=col, stroke_width=sw,
                 max_tip_length_to_length_ratio=0.35, tip_length=0.24)


def flame(s=1.0):
    outer = VMobject(fill_color="#F08A24", fill_opacity=1, stroke_width=0)
    outer.set_points_smoothly([[0, 0, 0], [-0.22, 0.25, 0], [0, 0.7, 0], [0.22, 0.25, 0], [0, 0, 0]])
    inner = VMobject(fill_color=SUNY, fill_opacity=1, stroke_width=0)
    inner.set_points_smoothly([[0, 0.03, 0], [-0.1, 0.18, 0], [0, 0.4, 0], [0.1, 0.18, 0], [0, 0.03, 0]])
    glow = Circle(radius=0.5, fill_color="#F08A24", fill_opacity=0.18, stroke_width=0).move_to([0, 0.3, 0])
    return VGroup(glow, outer, inner).scale(s)


def candle(lit=True, h=1.0):
    stick = R(0.32, h, "#F4E6CF", 0, -h / 2, rad=0.03, stroke="#D9C7A7", sw=3)
    wick = L((0, 0), (0, 0.12), INK, 3)
    g = VGroup(stick, wick)
    if lit:
        g.add(flame(0.65).move_to([0, 0.33, 0]))
    return g


# ══════════════ 두 물체 (앱 u3-2) ══════════════
def cyl_can(th=45.0, tc=10.0, w=4.4, h=3.4, arrows=False):
    """뚜껑 덮은 원통(따뜻한 물) 안에 알루미늄 캔(차가운 물). 바닥 가운데 (0, 0)"""
    g = VGroup()
    water = rect(w - 0.12, h * 0.82, col_of(th), 0, h * 0.41 + 0.04, stroke=col_of(th), sw=0)
    can = R(w * 0.38, h * 0.76, "#D9DEE3", 0, h * 0.38 + 0.04, rad=0.08, stroke="#8B98A5", sw=5)
    cw = rect(w * 0.38 - 0.18, h * 0.64, col_of(tc), 0, h * 0.33 + 0.08, stroke=col_of(tc), sw=0)
    wall = R(w, h, "#F4FBFF", 0, h / 2, rad=0.12, stroke=GLASS, sw=6, op=0.25)
    lid = R(w + 0.2, 0.22, "#A0673A", 0, h + 0.05, rad=0.05, stroke=INK, sw=2)
    g.add(water, can, cw, wall, lid)
    g.water, g.can_water = water, cw
    if arrows:
        aw = VGroup()
        for k in range(3):
            y = h * 0.3 + k * h * 0.17
            aw.add(heat_arrow((-w / 2 + 0.25, y), (-w * 0.19 - 0.05, y), sw=7))
            aw.add(heat_arrow((w / 2 - 0.25, y), (w * 0.19 + 0.05, y), sw=7))
        g.add(aw)
        g.arrows = aw
    return g


HOT_T = [45.0, 27.5, 23.4, 20.5, 19.6, 18.9]
COLD_T = [10.0, 14.2, 15.7, 16.4, 17.3, 18.0]


def temp_graph(hot=HOT_T, cold=COLD_T, W=7.6, H=4.2, vmax=50, legend=True):
    """앱 u3-2 그래프: 가로 0~5분, 세로 0~50 °C. .gx(t) .gy(v) .hot .cold(선+점) .ax"""
    g = VGroup()
    x0, y0 = -W / 2 + 0.7, -H / 2 + 0.45
    x1, y1 = W / 2 - 0.2, H / 2 - 0.25

    def gx(t):
        return x0 + (x1 - x0) * t / 5

    def gy(v):
        return y0 + (y1 - y0) * v / vmax
    grid = VGroup()
    for v in range(0, vmax + 1, 10):
        grid.add(L((x0, gy(v)), (x1, gy(v)), "#D5DDE4", 2))
        grid.add(T(str(v), 22, INK, bold=False).move_to([x0 - 0.3, gy(v), 0]))
    for t in range(6):
        grid.add(L((gx(t), y0), (gx(t), y1), "#EEF2F5", 2))
        grid.add(T(str(t), 22, INK, bold=False).move_to([gx(t), y0 - 0.28, 0]))
    ax = VGroup(L((x0, y0), (x1 + 0.1, y0), INK, 4), L((x0, y0), (x0, y1 + 0.1), INK, 4))
    xl = T("시간(분)", 22, INK).move_to([x1 - 0.3, y0 - 0.62, 0])
    yl = T("온도(°C)", 22, INK).move_to([x0 + 0.1, y1 + 0.32, 0])
    bg = R(W, H + 0.9, PAPER, 0, 0.05, rad=0.15, stroke=SOFT, sw=3)
    g.add(bg, grid, ax, xl, yl)

    def series(vals, col):
        pts = [[gx(t), gy(v), 0] for t, v in enumerate(vals)]
        ln = VMobject(stroke_color=col, stroke_width=6).set_points_as_corners(pts)
        dots = VGroup(*[Dot(p, radius=0.08, color=col) for p in pts])
        return VGroup(ln, dots)
    g.hot = series(hot, HOT)
    g.cold = series(cold, COLD)
    g.gx, g.gy = gx, gy
    if legend:
        lg = VGroup(VGroup(L((0, 0), (0.45, 0), HOT, 6), T("원통에 든 물", 22, HOT)).arrange(RIGHT, buff=0.12),
                    VGroup(L((0, 0), (0.45, 0), COLD, 6), T("알루미늄 캔에 든 물", 22, COLD)).arrange(RIGHT, buff=0.12)
                    ).arrange(DOWN, buff=0.1, aligned_edge=LEFT)
        lg.move_to([x1 - lg.width / 2 - 0.1, y1 - lg.height / 2 - 0.05, 0])
        g.legend = lg
        g.add(lg)
    return g


# ══════════════ 전도 (앱 u3-3) ══════════════
class Plate(VGroup):
    """구리판 위 열 변색 붙임딱지. rows: '#'(판) '.'(빈 곳) 글자 줄 목록. 가열 칸 heat=(r, c)에서
    판을 따라 잰 거리(앱과 같은 8방향, 모서리를 가로지르지 않음)가 front 이하인 칸만 색이 바뀜."""

    def __init__(self, rows, cs=0.25, heat=(0, 0), border=True, **kw):
        super().__init__(**kw)
        R_, C_ = len(rows), len(rows[0])
        on = lambda r, c: 0 <= r < R_ and 0 <= c < C_ and rows[r][c] == "#"  # noqa: E731
        INF = 1e9
        dist = [[INF] * C_ for _ in range(R_)]
        dist[heat[0]][heat[1]] = 0
        import heapq
        q = [(0, heat[0], heat[1])]
        while q:
            d, r, c = heapq.heappop(q)
            if d > dist[r][c]:
                continue
            for dr, dc, w in ((1, 0, 1), (-1, 0, 1), (0, 1, 1), (0, -1, 1), (1, 1, 1.414), (1, -1, 1.414),
                              (-1, 1, 1.414), (-1, -1, 1.414)):
                nr, nc = r + dr, c + dc
                if not on(nr, nc):
                    continue
                if dr and dc and not (on(r + dr, c) and on(r, c + dc)):
                    continue
                if d + w < dist[nr][nc]:
                    dist[nr][nc] = d + w
                    heapq.heappush(q, (d + w, nr, nc))
        self.cs, self.R, self.C = cs, R_, C_
        self.x0, self.y0 = -C_ * cs / 2, R_ * cs / 2
        self.cells = []
        self.max = 0
        sq = VGroup()
        for r in range(R_):
            for c in range(C_):
                if on(r, c):
                    s = Square(side_length=cs * 1.02, fill_color=ST_COLD, fill_opacity=1, stroke_width=0)
                    s.move_to(self._at(r, c))
                    sq.add(s)
                    self.cells.append((s, dist[r][c]))
                    self.max = max(self.max, dist[r][c])
        base = VGroup()
        for r in range(R_):
            for c in range(C_):
                if on(r, c):
                    base.add(Square(side_length=cs * 1.02 + 0.06, fill_color=CU, fill_opacity=1, stroke_width=0)
                             .move_to(self._at(r, c)))
        self.r0 = Dot(ORIGIN, radius=0.001, fill_opacity=0, stroke_width=0)
        self.r1 = Dot(RIGHT, radius=0.001, fill_opacity=0, stroke_width=0)
        self.add(base, sq, self.r0, self.r1)
        self.dist = dist
        self.front = -1

    def _at(self, r, c):
        return np.array([self.x0 + (c + 0.5) * self.cs, self.y0 - (r + 0.5) * self.cs, 0])

    def at(self, r, c):
        o = self.r0.get_center()
        k = np.linalg.norm(self.r1.get_center() - o)
        return o + k * self._at(r, c)

    def set_front(self, f):
        self.front = f
        for s, d in self.cells:
            s.set_fill(ST_HOT if d <= f else ST_COLD, opacity=1)
        return self


def long_rows(n=30, h=2):
    return ["#" * n for _ in range(h)]


def u_rows(R_=12, C_=20, t=3):
    """ㄷ자: 위·아래 띠와 왼쪽 세로 띠 (오른쪽이 열림)"""
    return ["".join("#" if (r < t or r >= R_ - t or c < t) else "." for c in range(C_)) for r in range(R_)]


# ══════════════ 대류 (앱 u3-4) ══════════════
def tank(w=5.0, h=3.0, level=0.75, stand=True):
    """사각 통(바닥 가운데 (0,0)), 받침 컵 두 개 위"""
    g = VGroup()
    if stand:
        for x in (-w / 2 + 0.55, w / 2 - 0.55):
            g.add(poly([(x - 0.45, -0.75), (x - 0.38, 0), (x + 0.38, 0), (x + 0.45, -0.75)], "#E9F4FB", stroke=GLASS, sw=3))
        g.add(rect(w + 0.6, 0.08, "#CFD8DC", 0, -0.79, stroke="#CFD8DC", sw=0))
    g.add(rect(w - 0.08, h * level, WATER, 0, h * level / 2 + 0.02, stroke=WATER, sw=0, op=0.85))
    g.add(rect(w, h, "#F4FBFF", 0, h / 2, stroke=GLASS, sw=6, op=0.2))
    return g


def hot_cup(w=1.1, h=0.75, txt="뜨거운 물", col="#F7B2A5", line="#C0392B"):
    c = poly([(-w / 2, -h), (-w / 2 + 0.07, 0), (w / 2 - 0.07, 0), (w / 2, -h)], col, stroke=line, sw=3)
    t = T(txt, 18, line).move_to([0, -h / 2, 0])
    return VGroup(c, t)


def along(path, s):
    pts = [np.array(p, dtype=float) for p in path]
    segs = [np.linalg.norm(pts[i + 1] - pts[i]) for i in range(len(pts) - 1)]
    Ltot = sum(segs)
    s = s % Ltot
    for i, d in enumerate(segs):
        if s <= d:
            return pts[i] + (pts[i + 1] - pts[i]) * (s / d)
        s -= d
    return pts[-1]


def loop_paths(cx, top, bot, lft, rgt):
    pr = [(cx, bot), (cx, top), (rgt, top), (rgt, bot), (cx + 0.1, bot)]
    pl = [(2 * cx - x, y) for x, y in pr]
    return pl, pr


def loops(cx, top, bot, lft, rgt, col=HOT, sw=7):
    """가운데 위로 → 위에서 양옆 → 벽 따라 아래 → 바닥 따라 가운데로"""
    g = VGroup()
    g.add(heat_arrow((cx, bot), (cx, top - 0.05), col, sw))
    for w, s in ((lft, -1), (rgt, 1)):
        g.add(heat_arrow((cx + s * 0.15, top), (w, top), col, sw))
        g.add(heat_arrow((w, top - 0.12), (w, bot + 0.05), col, sw))
        g.add(heat_arrow((w - s * 0.05, bot), (cx + s * 0.25, bot), col, sw))
    return g


def acryl_box(w=2.6, h=3.4):
    g = VGroup(R(w, h, "#EEF7FC", 0, h / 2, rad=0.08, stroke=GLASS, sw=6, op=0.3))
    for k in range(4):
        g.add(C(0.08, "#F3EEE6", -w / 2 + 0.35 + k * (w - 0.7) / 3, 0.22, stroke=GLASS, sw=2))
    return g


def room(heater=None, cooler=None, tint=None, W=5.2, H=3.4):
    """방(바닥 가운데 (0,0)). heater='low'|'high', cooler='high'|'low'. tint: 'warm'|'cool'|'warmtop'|'coolbottom'"""
    g = VGroup()
    rows = 6
    for r in range(rows):
        c = "#EEF3F6"
        if tint == "warm":
            c = ["#FBDECC", "#FBDAC8", "#FAD6C3", "#FAD2BE", "#F9CDB9", "#F9C9B5"][r]
        elif tint == "warmtop":
            c = "#DFE9F2" if r < 3 else ("#F8D6C8" if r == 3 else "#F7B2A5")
        elif tint == "cool":
            c = ["#C0DCF2", "#C3DEF3", "#C6E0F4", "#C9E2F5", "#CCE4F6", "#CFE6F7"][r]
        elif tint == "coolbottom":
            c = "#A9D4F2" if r < 2 else ("#D6E8F4" if r == 2 else "#F3E6DC")
        g.add(rect(W, H / rows, c, 0, (r + 0.5) * H / rows, stroke=c, sw=0))
    g.add(rect(W, H, "#FFFFFF", 0, H / 2, stroke="#7A5A3A", sw=8, op=0))
    g.add(rect(W, 0.3, "#C9A77C", 0, -0.15, stroke="#7A5A3A", sw=3))
    if heater:
        y = 0.35 if heater == "low" else H - 0.4
        hb = R(0.75, 0.6, "#E2573F", -W / 2 + 0.6, y, rad=0.08, stroke="#7A1F14", sw=3)
        g.add(hb, T("난로", 20, PAPER).move_to(hb))
        g.heater = hb
    if cooler:
        y = H - 0.35 if cooler == "high" else 0.35
        cb = R(1.15, 0.45, PAPER, W / 2 - 0.75, y, rad=0.08, stroke=COLD, sw=3)
        g.add(cb, T("냉방기", 20, COLD).move_to(cb))
        g.cooler = cb
    return g


# ══════════════ 복사 (앱 u3-5) ══════════════
def black_plate(w=1.2, h=0.9):
    return R(w, h, "#1D1D1D", 0, 0, rad=0.04, stroke="#555555", sw=3)


def sun_rays(r=0.5):
    return sun_hot(r)


def heat_lamp(on=True):
    cap = rect(0.9, 0.25, "#888888", 0, 0.5, stroke=INK, sw=2)
    shade = poly([(-0.6, 0.38), (0.6, 0.38), (0.4, -0.05), (-0.4, -0.05)], "#FFB35C" if on else "#DDDDDD",
                 stroke="#A0673A", sw=3)
    g = VGroup(cap, shade)
    if on:
        g.add(poly([(-0.4, -0.05), (0.4, -0.05), (1.1, -2.0), (-1.1, -2.0)], "#FFB35C", stroke="#FFB35C", sw=0, op=0.28))
    return g


# ══════════════ 생활 그림 ══════════════
def iron():
    plate = poly([(-1.0, 0), (1.1, 0), (1.1, 0.15), (-1.0, 0.15)], "#C0C6CC", stroke=INK, sw=3)
    body = VMobject(fill_color="#E2573F", fill_opacity=1, stroke_color="#7A1F14", stroke_width=3)
    body.set_points_smoothly([[-0.95, 0.15, 0], [-0.6, 0.7, 0], [0.4, 0.85, 0], [1.05, 0.85, 0], [1.05, 0.15, 0]])
    body.add_line_to([-0.95, 0.15, 0])
    handle = Arc(radius=0.5, start_angle=0.2, angle=2.7, stroke_color=INK, stroke_width=7).move_to([0.2, 1.05, 0])
    cloth = rect(2.6, 0.18, "#8BB0D6", 0, -0.09, stroke=INK, sw=2)
    return VGroup(cloth, body, plate, handle)


def kettle(boil=True):
    body = R(1.1, 1.3, "#DFE7EE", 0, 0.65, rad=0.2, stroke="#5F7685", sw=4)
    base = R(1.3, 0.22, "#555555", 0, -0.08, rad=0.05, stroke=INK, sw=2)
    spout = poly([(0.5, 0.95), (0.9, 1.25), (0.95, 1.15), (0.55, 0.75)], "#DFE7EE", stroke="#5F7685", sw=3)
    handle = Arc(radius=0.42, start_angle=PI / 2, angle=PI, stroke_color="#5F7685", stroke_width=8).move_to([-0.7, 0.75, 0])
    g = VGroup(handle, spout, body, base)
    if boil:
        g.add(loops(0, 1.05, 0.25, -0.35, 0.35, col=COLD, sw=4))
    return g


def window_sun():
    frame = rect(2.0, 1.4, "#DFF1FB", 0, 0.7, stroke="#8A7A66", sw=6)
    bar = L((0, 0), (0, 1.4), "#8A7A66", 4)
    sun = sun_hot(0.2).move_to([0.55, 1.05, 0])
    beam = poly([(-0.9, 0.05), (0.9, 0.05), (1.3, -1.3), (-0.5, -1.3)], SUNY, stroke=SUNY, sw=0, op=0.3)
    return VGroup(beam, frame, bar, sun)


def ice_pack():
    arm = R(2.2, 0.55, SKIN, 0, 0, rad=0.25, stroke="#D8A77A", sw=3)
    pack = R(0.8, 0.75, "#A9D4F2", 0.1, 0.18, rad=0.2, stroke=COLD, sw=3)
    return VGroup(arm, pack)


def steamer():
    pot = R(1.6, 0.5, "#9AA6B0", 0, 0.25, rad=0.08, stroke=INK, sw=3)
    b1 = R(1.6, 0.5, "#E8C27A", 0, 0.75, rad=0.1, stroke="#A5651E", sw=3)
    b2 = R(1.6, 0.5, "#E8C27A", 0, 1.25, rad=0.1, stroke="#A5651E", sw=3)
    st = VGroup(*[smooth([(k, 1.6), (k - 0.1, 1.8), (k, 2.0)], "#C9D3DA", 4) for k in (-0.45, 0, 0.45)])
    return VGroup(pot, b1, b2, st)


def soup_spoon():
    bowl = poly([(-1.0, 0.6), (1.0, 0.6), (0.7, 0), (-0.7, 0)], "#E9F1F6", stroke=INK, sw=3)
    soup = poly([(-0.92, 0.48), (0.92, 0.48), (0.66, 0.06), (-0.66, 0.06)], "#E8A35A", stroke="#E8A35A", sw=0)
    sp = VGroup(L((-0.1, 0.25), (0.75, 1.35), "#9AA6B0", 9), E(0.3, 0.18, "#B8C2CC", -0.15, 0.2, stroke=INK, sw=2))
    return VGroup(bowl, soup, sp)


def pot_on_stand():
    stand = R(1.7, 0.18, "#E8A35A", 0, 0.09, rad=0.05, stroke="#A0673A", sw=2)
    pot = R(1.4, 0.8, "#9AA6B0", 0, 0.6, rad=0.08, stroke="#5F7685", sw=3)
    st = VGroup(*[smooth([(k, 1.1), (k - 0.1, 1.3), (k, 1.5)], "#C9D3DA", 4) for k in (-0.35, 0, 0.35)])
    return VGroup(stand, pot, st)


def mitt(col="#E2573F"):
    m = VMobject(fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3)
    m.set_points_smoothly([[-0.45, -0.8, 0], [-0.5, 0.2, 0], [-0.2, 0.75, 0], [0.25, 0.7, 0], [0.4, 0.1, 0],
                           [0.75, 0.3, 0], [0.7, -0.1, 0], [0.4, -0.8, 0]])
    m.add_line_to([-0.45, -0.8, 0])
    return m


def parasol():
    top = poly([(-1.0, 0.6), (0, 1.2), (1.0, 0.6)], "#E07AA0", stroke=INK, sw=3)
    pole = L((0, 1.2), (0, -0.4), INK, 5)
    hook = Arc(radius=0.12, start_angle=PI, angle=PI, stroke_color=INK, stroke_width=5).move_to([0.12, -0.45, 0])
    return VGroup(pole, hook, top)


def coat_layers():
    head = C(0.3, SKIN, 0, 1.05, stroke=INK, sw=3)
    l1 = R(1.1, 1.3, "#3D6FA8", 0, 0.1, rad=0.25, stroke=INK, sw=3)
    l2 = R(0.75, 1.3, "#E8C27A", 0, 0.1, rad=0.2, stroke=INK, sw=2)
    l3 = R(0.4, 1.3, "#E2573F", 0, 0.1, rad=0.15, stroke=INK, sw=2)
    sc = R(0.8, 0.2, "#5CB85C", 0, 0.75, rad=0.1, stroke=INK, sw=2)
    return VGroup(l1, l2, l3, sc, head)


def thermos():
    body = R(0.8, 1.9, "#7FB3D5", 0, 0, rad=0.2, stroke=INK, sw=3)
    cap = R(0.7, 0.4, "#2F6FD6", 0, 1.1, rad=0.08, stroke=INK, sw=3)
    return VGroup(body, cap)


def window_closed():
    frame = rect(1.8, 1.6, "#DFF1FB", 0, 0, stroke="#8A7A66", sw=7)
    bar = L((0, -0.8), (0, 0.8), "#8A7A66", 5)
    snow = VGroup(*[Dot([x, y, 0], radius=0.05, color="#FFFFFF") for x, y in
                    ((-0.5, 0.4), (-0.2, -0.2), (0.4, 0.5), (0.6, -0.3), (-0.6, -0.5), (0.2, 0.1))])
    return VGroup(frame, snow, bar)


def ondol(W=10.0):
    """앱 u3-6 온돌 단면: 아궁이 → 구들장 아래 불길 → 방. .room .stone .fire_pos"""
    g = VGroup()
    rm = rect(W * 0.72, 2.0, "#FDF1DF", 0.6, 1.6, stroke="#8A5A2B", sw=5)
    stone = rect(W * 0.72, 0.35, "#9A8F86", 0.6, 0.42, stroke="#5A524C", sw=3)
    under = rect(W * 0.72, 0.8, "#4A3A30", 0.6, -0.17, stroke="#4A3A30", sw=0)
    pil = VGroup(*[rect(0.3, 0.8, "#6A5A4C", 0.6 - W * 0.3 + k * W * 0.15, -0.17, stroke="#6A5A4C", sw=0) for k in range(5)])
    agu = R(1.5, 1.0, "#3A2418", -W * 0.36 + 0.6 - 0.95, -0.07, rad=0.12, stroke=INK, sw=2)
    fire = flame(0.7).move_to(agu.get_center() + DOWN * 0.1)
    chim = rect(0.36, 2.7, "#8A7A66", 0.6 + W * 0.36 + 0.18, 0.75, stroke=INK, sw=2)
    hot = VGroup(*[smooth([(0.6 - W * 0.32 + k * 1.6, -0.1), (0.6 - W * 0.32 + k * 1.6 + 0.35, 0.05),
                           (0.6 - W * 0.32 + k * 1.6 + 0.7, -0.1)], "#F08A24", 5) for k in range(4)])
    g.add(rm, under, pil, hot, stone, agu, fire, chim)
    g.add(T("방", 26, INK).move_to(rm.get_top() + DOWN * 0.3))
    g.add(T("구들장", 22, PAPER).move_to(stone))
    g.add(T("아궁이", 22, INK).next_to(agu, DOWN, buff=0.1))
    g.add(T("굴뚝", 20, INK).next_to(chim, UP, buff=0.08))
    g.rm, g.stone = rm, stone
    return g
