"""6-1 4단원 「지구의 운동」 전용 그림 부품 (s6ep20~24, s6mm04)

모두 직접 그린 단순한 벡터 그림. 천체 위치는 차시 앱(grade6/science/_build_tb/src/u4-1·u4-5.html)과 같은 식
(서울 북위 37.57°, 동경 126.98°, 한국 시각)으로 계산하고, 별자리 별 자료(J2000 적경·적위)도 앱 u4-5의 CST를 옮김.
  하늘:   SkyPanel(남쪽을 바라본 하늘 + 땅 + 동·남동·남·남서·서, .xy(az, alt)) · sun_icon · sun_sticker · star_dot
  계산:   sun_altaz(월, 일, 시) · star_altaz(적경, 적위, 연, 월, 일, 시) · CST(별자리 12개) · cst_group(별자리 그림)
  사람:   person_top(위에서 본 사람, 동·서 붙임쪽지) · lamp(전등) · star_role(별 역할) · compass(나침반)
  지구:   globe_top(북극 위에서 본 지구, 왼쪽이 밝음, 빨간 점 = 관측자) · earth_side(옆에서 본 지구, 기울어진 자전축)
          curved_arrow(시계 반대 방향 호 화살표)
  그 밖:  spinning_top(팽이) · carousel(회전목마) · dokdo(독도 해돋이) · classroom(공전 모형실험 교실)
"""
import math
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, DashedLine, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject, AnnularSector, Sector)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED
from kit_s5u11 import label, text_card, fit, ox_mark, bin_box, rnd  # noqa: F401
from kit_s5u13 import word_card, result_table  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401
from kit_s6u11 import name_text, arrow_right  # noqa: F401

RAD = math.pi / 180
SUN_Y = "#FFD23F"
SUN_O = "#E2573F"
NIGHT = "#0B1636"
DAY_SKY = "#A9D6F2"
GRASS = "#7FAE5A"
GRASS_N = "#1E2A1A"
OCEAN = "#2F7FC4"
LIT = "#4FA3E0"
DARK_E = "#1D2F52"
LANDC = "#5CB85C"
STAR_W = "#FFFFFF"
ALT_C = "#FF6B6B"     # 견우성 표시(빨강 펜)
ANT_C = "#6EC3F0"     # 안타레스 표시(파랑 펜)
LAMP_C = "#FFE27A"
LAMP_D = "#D08A00"
NAVY = "#0F3B5C"


# ── 천체 위치(앱과 같은 식) ────────────────────────────────────
def _jd(y, mo, d, h_ut):
    if mo <= 2:
        y -= 1
        mo += 12
    A = y // 100
    B = 2 - A + A // 4
    return math.floor(365.25 * (y + 4716)) + math.floor(30.6001 * (mo + 1)) + d + B - 1524.5 + h_ut / 24


def jdk(y, mo, d, h):
    return _jd(y, mo, d, h - 9)


def _gmst(J):
    D = J - 2451545
    return ((280.46061837 + 360.98564736629 * D) % 360 + 360) % 360


def _sun_rd(J):
    n = J - 2451545
    L_ = 280.460 + 0.9856474 * n
    g = (357.528 + 0.9856003 * n) * RAD
    lam = (L_ + 1.915 * math.sin(g) + 0.020 * math.sin(2 * g)) * RAD
    e = 23.439 * RAD
    return ((math.atan2(math.cos(e) * math.sin(lam), math.cos(lam)) / RAD / 15 + 24) % 24,
            math.asin(math.sin(e) * math.sin(lam)) / RAD)


def alt_az(ra_h, dec_d, J):
    LAT = 37.57 * RAD
    H = (_gmst(J) + 126.98 - ra_h * 15) * RAD
    d = dec_d * RAD
    alt = math.asin(math.sin(LAT) * math.sin(d) + math.cos(LAT) * math.cos(d) * math.cos(H))
    az = math.atan2(-math.cos(d) * math.sin(H), math.sin(d) * math.cos(LAT) - math.cos(d) * math.sin(LAT) * math.cos(H))
    return alt / RAD, (az / RAD + 360) % 360


def sun_altaz(mo, d, h, y=2026):
    J = jdk(y, mo, d, h)
    r = _sun_rd(J)
    return alt_az(r[0], r[1], J)


def star_altaz(ra, dec, y, mo, d, h):
    return alt_az(ra, dec, jdk(y, mo, d, h))


ALTAIR = (19.846, 8.87)
ANTARES = (16.490, -26.43)

# 앱 u4-5의 별자리 자료: 이름, 계절, 별{기호: (적경 시, 적위 도, 크기)}, 이은 선
CST = {
    'leo': ('사자자리', 'spring', {'a': (10.1395, 11.967, 1.6), 'h': (10.1222, 16.763, 0.9), 'g': (10.3329, 19.842, 1.3), 'z': (10.2781, 23.417, 0.9), 'm': (9.8794, 26.007, 0.9), 'e': (9.7642, 23.774, 1.1), 'd': (11.2351, 20.524, 1.1), 't': (11.2373, 15.43, 0.9), 'b': (11.8177, 14.572, 1.3)}, 'a-h h-g g-z z-m m-e g-d d-b b-t t-a d-t'),
    'vir': ('처녀자리', 'spring', {'a': (13.4199, -11.161, 1.6), 'g': (12.6943, -1.449, 1.2), 'd': (12.9267, 3.398, 0.9), 'e': (13.0363, 10.959, 1.1), 'z': (13.5783, -0.596, 0.9), 'b': (11.8448, 1.765, 0.9), 'h': (12.3317, -0.667, 0.9), 't': (13.1658, -5.539, 0.8), 'i': (14.2669, -6.0, 0.8), 'm': (14.7176, -5.658, 0.8)}, 'b-h h-g g-d d-e g-t t-a d-z z-i i-m'),
    'hya': ('바다뱀자리', 'spring', {'d': (8.6276, 5.704, 0.9), 's': (8.6455, 3.341, 0.9), 'h': (8.7206, 3.399, 0.8), 'e': (8.7795, 6.419, 1.0), 'z': (8.9235, 5.946, 1.0), 't': (9.239, 2.314, 0.9), 'i': (9.6642, -1.143, 0.9), 'a': (9.4598, -8.659, 1.4), 'u': (9.858, -14.847, 0.9), 'l': (10.1764, -12.354, 0.9), 'm': (10.4348, -16.836, 0.9), 'n': (10.8271, -16.194, 0.9), 'x': (11.55, -31.858, 0.9), 'b': (11.8818, -33.908, 0.8), 'g': (13.3154, -23.171, 1.0), 'p': (14.1062, -26.682, 0.9)}, 'd-e e-z z-h h-s s-d z-t t-i i-a a-u u-l l-m m-n n-x x-b b-g g-p'),
    'aql': ('독수리자리', 'summer', {'a': (19.8464, 8.868, 1.6), 'g': (19.771, 10.613, 1.1), 'b': (19.9219, 6.407, 0.9), 'd': (19.4249, 3.115, 1.0), 'z': (19.0902, 13.863, 1.1), 'e': (18.9937, 15.068, 0.9), 't': (20.1884, -0.821, 1.0), 'l': (19.1042, -4.882, 0.9), 'h': (19.8745, 1.006, 0.9)}, 'g-a a-b a-d d-l d-z z-e b-h h-t'),
    'sco': ('전갈자리', 'summer', {'b': (16.0906, -19.806, 1.2), 'd': (16.0056, -22.622, 1.2), 'p': (15.9809, -26.114, 1.0), 's': (16.3531, -25.593, 1.0), 'a': (16.4901, -26.432, 1.6), 't': (16.598, -28.216, 1.0), 'e': (16.8361, -34.293, 1.1), 'm': (16.8645, -38.048, 1.0), 'z': (16.9097, -42.362, 1.0), 'h': (17.2025, -43.239, 1.0), 'th': (17.622, -42.998, 1.2), 'i': (17.793, -40.127, 1.0), 'k': (17.7081, -39.03, 1.1), 'l': (17.5601, -37.104, 1.3), 'u': (17.5127, -37.296, 1.0)}, 'b-d d-p d-s s-a a-t t-e e-m m-z z-h h-th th-i i-k k-l l-u'),
    'sgr': ('궁수자리', 'summer', {'g': (18.0968, -30.424, 1.0), 'd': (18.3499, -29.828, 1.1), 'e': (18.4029, -34.385, 1.3), 'l': (18.4662, -25.422, 1.1), 'f': (18.7609, -26.991, 1.0), 's': (18.9211, -26.297, 1.3), 't': (19.1157, -27.67, 1.0), 'z': (19.0436, -29.88, 1.1)}, 'g-d g-e d-e d-l l-f d-f f-s s-t t-z z-f z-e'),
    'peg': ('페가수스자리', 'autumn', {'a': (23.0793, 15.205, 1.3), 'b': (23.0629, 28.083, 1.3), 'g': (0.2206, 15.184, 1.2), 'A': (0.1398, 29.091, 1.3), 'e': (21.7364, 9.875, 1.3), 't': (22.17, 6.198, 1.0), 'z': (22.691, 10.831, 1.0), 'h': (22.7167, 30.221, 1.1), 'm': (22.8333, 24.602, 0.9), 'l': (22.7755, 23.566, 0.9), 'i': (22.1167, 25.345, 0.9), 'k': (21.7441, 25.645, 0.9)}, 'a-b b-A A-g g-a a-z z-t t-e b-h b-m m-l l-i i-k'),
    'psc': ('물고기자리', 'autumn', {'h': (1.5247, 15.346, 1.0), 'o': (1.7566, 9.158, 0.9), 'a': (2.034, 2.764, 1.0), 'n': (1.6905, 5.488, 0.8), 'm': (1.503, 6.144, 0.8), 'e': (1.0491, 7.89, 0.8), 'd': (0.8114, 7.585, 0.8), 'w': (23.9885, 6.863, 0.8), 'i': (23.6658, 5.626, 0.8), 't': (23.4661, 6.379, 0.8), 'g': (23.2861, 3.282, 0.9), 'k': (23.449, 1.256, 0.8), 'l': (23.7001, 1.78, 0.8), 'f': (1.229, 24.583, 0.8), 'u': (1.3244, 27.264, 0.8), 'ta': (1.1945, 30.09, 0.8), 'c': (1.1897, 21.034, 0.8)}, 'g-t t-i i-l l-k k-g i-w w-d d-e e-m m-n n-a a-o o-h h-c c-f f-u u-ta'),
    'aqr': ('물병자리', 'autumn', {'a': (22.0964, -0.32, 1.1), 'b': (21.526, -5.571, 1.1), 'g': (22.3609, -1.387, 0.9), 'z': (22.4806, -0.02, 0.9), 'h': (22.5892, -0.117, 0.9), 'p': (22.4213, 1.378, 0.8), 't': (22.2808, -7.783, 0.9), 'l': (22.8769, -7.58, 1.0), 'd': (22.9108, -15.821, 1.1), 'ta': (22.8265, -13.592, 0.9), 'e': (20.7946, -9.496, 0.9), 'f': (23.2384, -6.049, 0.9), 'ps': (23.2649, -9.087, 0.9), 'q': (23.1574, -21.172, 0.9)}, 'e-b b-a a-g g-z z-h z-p a-t t-l l-ta ta-d l-f f-ps d-q'),
    'gem': ('쌍둥이자리', 'winter', {'a': (7.5767, 31.888, 1.4), 'b': (7.7553, 28.026, 1.5), 'g': (6.6285, 16.399, 1.3), 'm': (6.3827, 22.514, 1.1), 'h': (6.2479, 22.507, 1.0), 'e': (6.7322, 25.131, 1.1), 'd': (7.3354, 21.982, 1.1), 'z': (7.0685, 20.57, 1.0), 'x': (6.7548, 12.896, 1.0), 't': (7.1857, 30.245, 1.0), 'l': (7.3017, 16.54, 1.0), 'u': (7.5983, 26.896, 0.9), 'i': (7.4287, 27.798, 0.9), 'th': (6.8798, 33.961, 0.9), 'n': (6.4829, 20.212, 0.9)}, 'a-t t-e e-m m-h t-th e-n a-b b-u u-i i-t u-d d-z z-g d-l l-x'),
    'ori': ('오리온자리', 'winter', {'bt': (5.9195, 7.407, 1.6), 'bl': (5.4189, 6.35, 1.3), 'mi': (5.5334, -0.299, 1.2), 'al': (5.6036, -1.202, 1.2), 'an': (5.6793, -1.943, 1.2), 'ri': (5.2423, -8.202, 1.6), 'sa': (5.7959, -9.67, 1.2), 'me': (5.5856, 9.934, 1.0)}, 'bt-me me-bl bt-bl bl-mi bt-an mi-al al-an mi-ri an-sa ri-sa'),
    'cma': ('큰개자리', 'winter', {'a': (6.7525, -16.716, 1.9), 'b': (6.3783, -17.956, 1.1), 'i': (6.9357, -17.054, 0.9), 'g': (7.0626, -15.633, 0.9), 'o': (7.0503, -23.833, 1.0), 'd': (7.1399, -26.393, 1.2), 'e': (6.9771, -28.972, 1.3), 'h': (7.4016, -29.303, 1.1), 'z': (6.3384, -30.063, 1.0), 't': (6.9032, -12.039, 0.9)}, 'b-a a-t t-g g-i i-a a-o o-d d-h d-e e-z'),
}
SEASON_KO = {'spring': '봄', 'summer': '여름', 'autumn': '가을', 'winter': '겨울'}
SEASON_DAY = {'spring': (2025, 4, 15), 'summer': (2025, 7, 15), 'autumn': (2025, 10, 15), 'winter': (2026, 1, 15)}
SEASON_COL = {'spring': "#E8789A", 'summer': "#2E9E5B", 'autumn': "#E08A2C", 'winter': "#5B7FD6"}


def cst_names(season):
    return [v[0] for v in CST.values() if v[1] == season]


# ── 남쪽 하늘 그림 ────────────────────────────────────────────
class SkyPanel(VGroup):
    """남쪽을 바라본 하늘(방위각 60°~300°, 고도 0°~90°). .xy(az, alt)로 화면 좌표.
    sine=True면 앱 u4-5처럼 높은 곳을 덜 늘림(별자리용)."""

    def __init__(self, night=False, w=12.4, cx=0.0, hor=-1.45, top=2.85, ground=0.95, sine=False,
                 landscape=True, size=30):
        super().__init__()
        self.night, self.w, self.cx, self.hor, self.top, self.sine = night, w, cx, hor, top, sine
        sky = Rectangle(width=w, height=top - hor, fill_color=NIGHT if night else DAY_SKY, fill_opacity=1,
                        stroke_color=INK, stroke_width=3).move_to([cx, (top + hor) / 2, 0])
        gr = Rectangle(width=w, height=ground, fill_color=GRASS_N if night else GRASS, fill_opacity=1,
                       stroke_color=INK, stroke_width=3).move_to([cx, hor - ground / 2, 0])
        self.sky, self.ground = sky, gr
        self.add(sky)
        if landscape:
            self.add(self._land())
        self.add(gr)
        labs = VGroup()
        for az, n in ((90, "동"), (135, "남동"), (180, "남"), (225, "남서"), (270, "서")):
            x = self.xy(az, 0)[0]
            big = len(n) == 1
            t = T(n, size if big else int(size * 0.72), INK if big else ("#DDE6F0" if night else "#24391A"))
            if big:
                bx = RoundedRectangle(corner_radius=0.1, width=0.66, height=0.56, fill_color=PAPER, fill_opacity=1,
                                      stroke_color=NAVY, stroke_width=3)
                VGroup(bx, t).move_to([x, hor - ground / 2, 0])
                t.move_to(bx)
                labs.add(VGroup(bx, t))
            else:
                t.move_to([x, hor - ground / 2, 0])
                labs.add(t)
            labs.add(Line([x, hor, 0], [x, hor - 0.12, 0], stroke_color="#DDE6F0" if night else "#2F4A1E", stroke_width=3))
        self.labels = labs
        self.add(labs)

    def xy(self, az, alt):
        k = math.cos(alt * RAD) if self.sine else 1.0
        x = self.cx + (az - 180) / 120.0 * (self.w / 2 - 0.15) * k
        y = self.hor + alt / 90.0 * (self.top - self.hor - 0.1)
        return np.array([x, y, 0])

    def inside(self, az, alt):
        p = self.xy(az, alt)
        return alt > 0 and abs(p[0] - self.cx) < self.w / 2 - 0.1 and p[1] < self.top - 0.1

    def _land(self):
        g = VGroup()
        dark = self.night
        bcol = "#3A3326" if dark else "#E3D3B6"
        h0 = self.hor
        # 학교 건물(남동쪽)·아파트(남쪽 조금 서)·나무·산(서쪽)
        x0, x1 = self.xy(148, 0)[0], self.xy(170, 0)[0]
        hb = 0.42
        g.add(Rectangle(width=x1 - x0, height=hb, fill_color=bcol, fill_opacity=1, stroke_color="#5A4A33",
                        stroke_width=2).move_to([(x0 + x1) / 2, h0 + hb / 2, 0]))
        if not dark:
            for i in range(5):
                for j in range(2):
                    g.add(Rectangle(width=0.14, height=0.1, fill_color="#8FC3E6", fill_opacity=1, stroke_width=0)
                          .move_to([x0 + 0.22 + i * (x1 - x0 - 0.3) / 4.4, h0 + 0.12 + j * 0.16, 0]))
        a0, a1 = self.xy(198, 0)[0], self.xy(208, 0)[0]
        g.add(Rectangle(width=a1 - a0, height=0.62, fill_color="#33302A" if dark else "#D8CCBA", fill_opacity=1,
                        stroke_color="#5A4A33", stroke_width=2).move_to([(a0 + a1) / 2, h0 + 0.31, 0]))
        m0, m1, m2 = self.xy(240, 0)[0], self.xy(262, 0)[0], self.xy(292, 0)[0]
        g.add(Polygon([m0, h0, 0], [m1, h0 + 0.38, 0], [(m1 + m2) / 2, h0 + 0.22, 0], [m2 - 0.3, h0 + 0.45, 0],
                      [m2, h0, 0], fill_color="#2F3A2A" if dark else "#8FB48A", fill_opacity=1, stroke_width=0))
        for az, hh in ((105, 0.5), (122, 0.36), (184, 0.55), (225, 0.4)):
            x = self.xy(az, 0)[0]
            g.add(Rectangle(width=0.07, height=hh * 0.5, fill_color="#6B4A2A", fill_opacity=1, stroke_width=0)
                  .move_to([x, h0 + hh * 0.25, 0]))
            g.add(Ellipse(width=hh * 0.9, height=hh * 0.7, fill_color="#2A3324" if dark else "#3F7D3A",
                          fill_opacity=1, stroke_width=0).move_to([x, h0 + hh * 0.62, 0]))
        return g


def sun_icon(r=0.24, glass=False):
    """태양(관측 안경으로 본 모습이면 주황 원)"""
    if glass:
        return Circle(radius=r * 0.8, fill_color="#FF9A2E", fill_opacity=1, stroke_color=SUN_Y, stroke_width=4)
    g = VGroup(Circle(radius=r, fill_color=SUN_Y, fill_opacity=1, stroke_color=SUN_O, stroke_width=4))
    for i in range(8):
        a = i * TAU / 8
        g.add(Line([math.cos(a) * r * 1.25, math.sin(a) * r * 1.25, 0], [math.cos(a) * r * 1.6, math.sin(a) * r * 1.6, 0],
                   stroke_color=SUN_O, stroke_width=4))
    return g


def sun_sticker(time_text, r=0.2, size=20):
    s = sun_icon(r)
    t = T(time_text, size, INK)
    bx = RoundedRectangle(corner_radius=0.08, width=t.width + 0.2, height=t.height + 0.12, fill_color=PAPER,
                          fill_opacity=0.95, stroke_width=0)
    lab = VGroup(bx, t)
    t.move_to(bx)
    lab.next_to(s, DOWN, buff=0.08)
    g = VGroup(s, lab)
    g.sun, g.lab = s, lab
    return g


def fmt_h(h):
    hh = int(h)
    mm = int(round((h - hh) * 60))
    hh24 = hh % 24
    ap = "오전" if hh24 < 12 else "오후"
    h12 = hh24 - 12 if hh24 > 12 else hh24
    return f"{ap} {h12}시" + (f" {mm}분" if mm else "")


def star_dot(r=0.06, col=STAR_W):
    return Dot(radius=r, color=col)


def bg_stars(x0, x1, y0, y1, n=40, seed=3, op=0.6):
    g = VGroup()
    for i in range(n):
        x = x0 + (x1 - x0) * rnd(i, seed)
        y = y0 + (y1 - y0) * rnd(i, seed + 7)
        g.add(Dot([x, y, 0], radius=0.025 if i % 4 else 0.04, color=STAR_W).set_opacity(op))
    return g


def cst_group(sky, key, J, hl=False, name=True, size=22, line_col="#7FA8E8"):
    """별자리 하나를 하늘 그림에 그림(보이는 별 2개 이상일 때). 돌려주는 VGroup의 .center_pt"""
    n, season, stars, ln = CST[key]
    pts = {}
    for k, (ra, de, m) in stars.items():
        a, z = alt_az(ra, de, J)
        pts[k] = (sky.inside(z, a), sky.xy(z, a), m)
    vis = [p for p in pts.values() if p[0]]
    g = VGroup()
    g.center_pt = None
    if len(vis) < 2:
        return g
    col = SUN_Y if hl else line_col
    for e in ln.split():
        u, v = e.split('-')
        if pts[u][0] and pts[v][0]:
            g.add(Line(pts[u][1], pts[v][1], stroke_color=col, stroke_width=4 if hl else 2.5))
    for p in vis:
        g.add(Dot(p[1], radius=0.028 * p[2] + 0.015, color=STAR_W))
    c = sum(p[1] for p in vis) / len(vis)
    g.center_pt = c
    if name:
        t = T(n, size, "#3A2A00" if hl else PAPER)
        bx = RoundedRectangle(corner_radius=0.08, width=t.width + 0.24, height=t.height + 0.14,
                              fill_color=SUN_Y if hl else "#26335F", fill_opacity=0.95, stroke_width=0)
        t.move_to(bx)
        lab = VGroup(bx, t)
        top = max(p[1][1] for p in vis)
        lab.move_to([c[0], min(top + 0.28, sky.top - 0.25), 0])
        g.lab = lab
        g.add(lab)
    return g


def season_sky(season, w=12.4, cx=0.0, hor=-1.45, top=2.85, ground=0.95, names=True, only=None, hl=None, size=22,
               date=None):
    """그 계절 오후 9시 남쪽 하늘 + 그 계절 대표 별자리(only=별자리 키 목록이면 그것만).
    이름표는 별자리 위·오른쪽·왼쪽·아래 중 다른 별자리·이름표와 겹치지 않는 곳. .date_tag(그림 밖에 놓을 날짜 띠)"""
    y, m, d = date or SEASON_DAY[season]
    J = jdk(y, m, d, 21)
    sky = SkyPanel(night=True, w=w, cx=cx, hor=hor, top=top, ground=ground, sine=True, landscape=False)
    keys = only if only is not None else [k for k, v in CST.items() if v[1] == season]
    groups = [cst_group(sky, k, J, hl=(hl == k), name=False) for k in keys]
    boxes = [(g.get_left()[0], g.get_right()[0], g.get_bottom()[1], g.get_top()[1]) for g in groups if len(g)]
    cs = VGroup(*groups)
    labs = VGroup()
    if names:
        placed = []
        for k, g in zip(keys, groups):
            if not len(g):
                continue
            n = CST[k][0]
            t = T(n, size, "#3A2A00" if hl == k else PAPER)
            bx = RoundedRectangle(corner_radius=0.08, width=t.width + 0.24, height=t.height + 0.14,
                                  fill_color=SUN_Y if hl == k else "#26335F", fill_opacity=0.95, stroke_width=0)
            t.move_to(bx)
            lab = VGroup(bx, t)
            L_, R_, B_, U_ = g.get_left()[0], g.get_right()[0], g.get_bottom()[1], g.get_top()[1]
            cxx, cyy = g.get_center()[0], g.get_center()[1]
            hw, hh = lab.width / 2, lab.height / 2
            cands = [(cxx, U_ + hh + 0.06), (R_ + hw + 0.08, cyy), (L_ - hw - 0.08, cyy), (cxx, B_ - hh - 0.06),
                     (R_ + hw + 0.08, U_ - hh), (L_ - hw - 0.08, U_ - hh)]

            def ok(px, py):
                if py + hh > top - 0.05 or py - hh < hor + 0.05 or px - hw < cx - w / 2 + 0.05 or px + hw > cx + w / 2 - 0.05:
                    return False
                for (l, r, b, u) in boxes + placed:
                    if px + hw > l - 0.03 and px - hw < r + 0.03 and py + hh > b - 0.03 and py - hh < u + 0.03:
                        if (l, r, b, u) == (L_, R_, B_, U_):
                            continue
                        return False
                return True
            pos = next((c for c in cands if ok(*c)), cands[0])
            lab.move_to([pos[0], pos[1], 0])
            placed.append((pos[0] - hw, pos[0] + hw, pos[1] - hh, pos[1] + hh))
            g.lab = lab
            labs.add(lab)
    sky.add(cs, labs)
    sky.csts, sky.labs = cs, labs
    tag = T(f"{m}월 {d}일 오후 9시 · 남쪽 하늘", 22, PAPER)
    bx = RoundedRectangle(corner_radius=0.08, width=tag.width + 0.3, height=tag.height + 0.16, fill_color="#26335F",
                          fill_opacity=1, stroke_width=0)
    tag.move_to(bx)
    sky.date_tag = VGroup(bx, tag)
    return sky


# ── 역할놀이·사람 ────────────────────────────────────────────
def lamp(s=1.0, name="전등"):
    g = VGroup()
    for i in range(10):
        a = i * TAU / 10
        g.add(Line([0.42 * math.cos(a), 0.42 * math.sin(a), 0], [0.58 * math.cos(a), 0.58 * math.sin(a), 0],
                   stroke_color="#F0A020", stroke_width=6))
    g.add(Circle(radius=0.33, fill_color=LAMP_C, fill_opacity=1, stroke_color=LAMP_D, stroke_width=4))
    if name:
        g.add(T(name, 20, "#7A4A00"))
    return g.scale(s)


def star_shape(r=0.22, col="#FFF59A", stroke="#B8860B"):
    pts = []
    for i in range(10):
        a = PI / 2 + i * PI / 5
        rr = r if i % 2 == 0 else r * 0.42
        pts.append([rr * math.cos(a), rr * math.sin(a), 0])
    return Polygon(*pts, fill_color=col, fill_opacity=1, stroke_color=stroke, stroke_width=2)


def star_role(s=1.0, name="별 역할"):
    g = VGroup(Circle(radius=0.36, fill_color="#6EC3F0", fill_opacity=1, stroke_color="#1C6FA8", stroke_width=4),
               star_shape(0.24))
    if name:
        g.add(T(name, 20, NAVY).next_to(g[0], DOWN, buff=0.08))
    return g.scale(s)


def person_top(th=0.0, s=1.0, tags=("동", "서"), arrow=True):
    """위에서 본 사람. th = 바라보는 쪽(화면 위쪽에서 시계 반대 방향 라디안). 왼손에 tags[0], 오른손에 tags[1]."""
    body = VGroup(
        Line([-0.95, 0, 0], [0.95, 0, 0], stroke_color="#FFD9B0", stroke_width=12),
        Ellipse(width=0.95, height=0.42, fill_color="#E2573F", fill_opacity=1, stroke_color="#7A2A1F", stroke_width=4),
        Circle(radius=0.2, fill_color="#5A3A22", fill_opacity=1, stroke_color="#2F1E10", stroke_width=3),
    )
    if arrow:
        body.add(Line([0, 0.26, 0], [0, 0.66, 0], stroke_color=GREEN, stroke_width=6),
                 Polygon([-0.12, 0.62, 0], [0.12, 0.62, 0], [0, 0.82, 0], fill_color=GREEN, fill_opacity=1, stroke_width=0))
    body.rotate(th, about_point=ORIGIN)
    g = VGroup(body)
    for side, txt in ((-1, tags[0]), (1, tags[1])):
        if not txt:
            continue
        p = np.array([side * 1.15 * math.cos(th), side * 1.15 * math.sin(th), 0])
        t = T(txt, 24, INK)
        bx = RoundedRectangle(corner_radius=0.06, width=0.44, height=0.4, fill_color="#FFE680", fill_opacity=1,
                              stroke_color="#B8860B", stroke_width=2.5).move_to(p)
        t.move_to(bx)
        g.add(VGroup(bx, t))
    return g.scale(s)


def compass(r=0.45):
    g = VGroup(Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color=NAVY, stroke_width=4),
               Polygon([0, r * 0.8, 0], [r * 0.2, 0, 0], [-r * 0.2, 0, 0], fill_color="#C2332C", fill_opacity=1, stroke_width=0),
               Polygon([0, -r * 0.8, 0], [r * 0.2, 0, 0], [-r * 0.2, 0, 0], fill_color="#9FB3C0", fill_opacity=1, stroke_width=0),
               T("N", 18, NAVY).move_to([0, r + 0.16, 0]))
    return g


# ── 지구 ─────────────────────────────────────────────────────
def curved_arrow(r=1.4, a0=-0.5, a1=1.4, col="#2E9E5B", sw=6, center=ORIGIN, cw=False):
    """원호 화살표(기본: 시계 반대 방향, a0 → a1 라디안)"""
    if cw:
        a0, a1 = a1, a0
    arc = Arc(radius=r, start_angle=a0, angle=a1 - a0, arc_center=center, stroke_color=col, stroke_width=sw)
    end = np.array(center) + r * np.array([math.cos(a1), math.sin(a1), 0])
    d = np.sign(a1 - a0)
    tang = np.array([-math.sin(a1), math.cos(a1), 0]) * d
    nrm = np.array([math.cos(a1), math.sin(a1), 0])
    tip = Polygon(end + tang * 0.22, end - tang * 0.05 + nrm * 0.15, end - tang * 0.05 - nrm * 0.15,
                  fill_color=col, fill_opacity=1, stroke_width=0)
    return VGroup(arc, tip)


def globe_top(R=1.4, phi=0.0, sun_dir=PI, show_obs=True, obs_label="", lab_size=22, land=True):
    """북극 위에서 내려다본 지구. sun_dir = 태양 쪽 방향(라디안, 기본 왼쪽). phi = 관측자(빨간 점) 각도.
    지구가 시계 반대 방향으로 돌면 phi가 커짐."""
    g = VGroup(Circle(radius=R, fill_color=DARK_E, fill_opacity=1, stroke_width=0))
    lit = Sector(radius=R, start_angle=sun_dir - PI / 2, angle=PI, fill_color=LIT, fill_opacity=1, stroke_width=0)
    g.add(lit)
    if land:
        for i, (rr, aa, sz) in enumerate(((0.55, 0.3, 0.32), (0.7, 1.9, 0.28), (0.45, 3.4, 0.26), (0.75, 4.6, 0.3))):
            a = aa + phi
            c = [R * rr * math.cos(a), R * rr * math.sin(a), 0]
            g.add(Ellipse(width=R * sz, height=R * sz * 0.7, fill_color=LANDC, fill_opacity=0.45, stroke_width=0)
                  .rotate(a).move_to(c))
    g.add(Circle(radius=R, stroke_color=NAVY, stroke_width=4))
    g.add(Dot(radius=0.05, color=PAPER))
    if show_obs:
        p = np.array([R * 0.72 * math.cos(phi), R * 0.72 * math.sin(phi), 0])
        u = np.array([math.cos(phi), math.sin(phi), 0])
        g.add(Line(p, p + u * R * 0.38, stroke_color="#FF4D4D", stroke_width=5))
        g.add(Dot(p, radius=0.1, color="#FF4D4D").set_stroke(PAPER, 2))
        if obs_label:
            t = T(obs_label, lab_size, PAPER)
            t.move_to(p - u * 0.42)
            g.add(t)
    return g


LAND = [(50, 10, 26), (40, 60, 30), (20, 100, 20), (60, 90, 22), (37, 127, 9, 'k'), (-10, -60, 24), (30, -100, 26),
        (0, 20, 24), (-25, 135, 20), (55, -40, 14), (-20, -50, 16), (10, -10, 12)]


def earth_side(R=1.5, rot=0.0, tilt=23.5, axis=True, labels=True, korea=True):
    """옆에서 본 지구(자전축 기울어짐). rot = 자전한 각(라디안) — 앱 u4-2 영상과 같은 땅 배치."""
    g = VGroup(Circle(radius=R, fill_color=OCEAN, fill_opacity=1, stroke_color=NAVY, stroke_width=4))
    for item in LAND:
        la, lo, sz = item[0], item[1], item[2]
        a = lo * RAD + rot
        z = math.cos(la * RAD) * math.cos(a)
        if z <= 0.05:
            continue
        x = R * math.cos(la * RAD) * math.sin(a)
        y = R * math.sin(la * RAD)
        if len(item) > 3:
            if korea:
                g.add(Dot([x, y, 0], radius=0.09, color="#FF4D4D").set_stroke(PAPER, 2))
        else:
            g.add(Ellipse(width=max(0.02, sz * z / 118 * R * 2), height=sz * 0.7 / 118 * R * 2, fill_color=LANDC,
                          fill_opacity=0.95, stroke_width=0).move_to([x, y, 0]))
    g.add(Ellipse(width=2 * R, height=R * 0.27, stroke_color=PAPER, stroke_width=2, stroke_opacity=0.45, fill_opacity=0))
    if axis:
        g.add(Line([0, -R - 0.45, 0], [0, R + 0.45, 0], stroke_color=SUN_Y, stroke_width=6))
        g.add(Dot([0, R, 0], radius=0.06, color=PAPER), Dot([0, -R, 0], radius=0.06, color=PAPER))
    g.rotate(-tilt * RAD, about_point=ORIGIN)
    if labels:
        n = T("북극", 24, NAVY)
        s = T("남극", 24, NAVY)
        top = np.array([math.sin(tilt * RAD), math.cos(tilt * RAD), 0]) * (R + 0.75)
        n.move_to(top)
        s.move_to(-top)
        g.add(n, s)
    return g


# ── 그 밖의 그림 ─────────────────────────────────────────────
def spinning_top(s=1.0):
    g = VGroup(
        Polygon([-0.8, 0.3, 0], [0.8, 0.3, 0], [0, -0.75, 0], fill_color="#E2573F", fill_opacity=1, stroke_color=INK, stroke_width=4),
        Ellipse(width=1.6, height=0.42, fill_color="#FFD23F", fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([0, 0.3, 0]),
        Line([0, 0.3, 0], [0, 0.85, 0], stroke_color=INK, stroke_width=8),
        Line([0, -0.75, 0], [0, -0.95, 0], stroke_color=INK, stroke_width=5),
    )
    for i in range(3):
        g.add(Arc(radius=0.55, start_angle=-PI * 0.9 + i * 0.2, angle=PI * 0.8, stroke_color="#2F6FD6", stroke_width=3)
              .stretch(0.26, 1).move_to([0, 0.28 - 0.04 * i, 0]))
    return g.scale(s)


def carousel(s=1.0):
    g = VGroup(
        Polygon([-2.0, 1.1, 0], [0, 1.75, 0], [2.0, 1.1, 0], fill_color="#E2573F", fill_opacity=1, stroke_color="#7A1F1A", stroke_width=4),
        Ellipse(width=4.0, height=0.5, fill_color="#FFD23F", fill_opacity=1, stroke_color="#7A1F1A", stroke_width=3).move_to([0, 1.08, 0]),
        Rectangle(width=0.22, height=2.6, fill_color="#C2332C", fill_opacity=1, stroke_color="#7A1F1A", stroke_width=3).move_to([0, -0.2, 0]),
        Ellipse(width=4.2, height=0.7, fill_color="#D9C7AD", fill_opacity=1, stroke_color="#7A6A50", stroke_width=3).move_to([0, -1.5, 0]),
    )
    for x, col in ((-1.4, "#FFFFFF"), (1.4, "#F6C0CF")):
        g.add(Line([x, 1.0, 0], [x, -1.3, 0], stroke_color="#B8860B", stroke_width=4))
        horse = VGroup(Ellipse(width=0.8, height=0.4, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3),
                       Ellipse(width=0.3, height=0.42, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0.38, 0.26, 0]),
                       Line([-0.25, -0.18, 0], [-0.3, -0.5, 0], stroke_color=INK, stroke_width=4),
                       Line([0.25, -0.18, 0], [0.3, -0.5, 0], stroke_color=INK, stroke_width=4))
        if x > 0:
            horse.flip(UP)
        horse.move_to([x, -0.3, 0])
        g.add(horse)
    return g.scale(s)


def dokdo(w=8.0, h=3.4):
    """앱 u4-1 도입 그림: 동쪽 바다 위의 태양과 독도(서도·동도)"""
    sx = w / 800.0
    sy = h / 300.0

    def P(x, y):
        return [-w / 2 + x * sx, h / 2 - y * sy, 0]
    g = VGroup(Rectangle(width=w, height=h * 232 / 300, fill_color="#F6C58A", fill_opacity=1, stroke_width=0)
               .move_to([0, h / 2 - h * 116 / 300, 0]))
    g.add(Rectangle(width=w, height=h * 116 / 300, fill_color="#7FB6E0", fill_opacity=1, stroke_width=0)
          .move_to([0, h / 2 - h * 58 / 300, 0]))
    g.add(Rectangle(width=w, height=h * 74 / 300, fill_color="#2F6F9F", fill_opacity=1, stroke_width=0)
          .move_to([0, -h / 2 + h * 37 / 300, 0]))
    sun = Arc(radius=28 * sx, start_angle=0, angle=PI, arc_center=P(700, 226), fill_color=SUN_Y, fill_opacity=1,
              stroke_color="#F08A24", stroke_width=3)
    g.add(Circle(radius=60 * sx, fill_color=SUN_Y, fill_opacity=0.25, stroke_width=0).move_to(P(700, 226)), sun)
    for i in range(5):
        g.add(Rectangle(width=(48 + i * 12) * sx, height=3 * sy, fill_color="#FFD98A", fill_opacity=0.8 - i * 0.12,
                        stroke_width=0).move_to(P(700, 236 + i * 9)))
    west = [P(*p) for p in ((110, 228), (150, 170), (185, 120), (215, 74), (236, 66), (256, 92), (290, 140), (325, 186), (352, 228))]
    east = [P(*p) for p in ((430, 228), (456, 176), (490, 150), (528, 146), (560, 132), (590, 150), (612, 186), (626, 228))]
    g.add(Polygon(*west, fill_color="#6B5A46", fill_opacity=1, stroke_color="#3D3226", stroke_width=3))
    g.add(Polygon(*east, fill_color="#7A6650", fill_opacity=1, stroke_color="#3D3226", stroke_width=3))
    g.add(T("서도", 22, PAPER).move_to(P(232, 258)), T("동도", 22, PAPER).move_to(P(528, 258)))
    for x, n in ((36, "서"), (764, "동")):
        bx = RoundedRectangle(corner_radius=0.08, width=0.5, height=0.42, fill_color=PAPER, fill_opacity=1,
                              stroke_color=NAVY, stroke_width=2).move_to(P(x, 278))
        g.add(bx, T(n, 24, NAVY).move_to(bx))
    g.add(Rectangle(width=w, height=h, stroke_color=INK, stroke_width=3))
    return g


CLASS_SEE = {'가': '칠판, 시계, 시간표', '나': '창문, 화분', '다': '사물함, 거울', '라': '창문, 출입문'}


def classroom(S=3.2):
    """앱 u4-4 교실(위에서 내려다본 모습): 가운데 전등, 둘레에 가·나·다·라. .pos[가] 좌표"""
    k = S / 200.0

    def P(x, y):
        return np.array([(x - 220) * k, (200 - y) * k, 0])
    g = VGroup(Rectangle(width=400 * k, height=360 * k, fill_color="#F8F4EC", fill_opacity=1, stroke_color="#7A6A50", stroke_width=5))
    g.add(Rectangle(width=200 * k, height=16 * k, fill_color="#2F5A3A", fill_opacity=1, stroke_width=0).move_to(P(220, 30)))
    g.add(T("칠판", 20, "#2F5A3A").move_to(P(220, 52)))
    g.add(Circle(radius=9 * k, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=2).move_to(P(345, 34)))
    g.add(T("시계", 16, INK).move_to(P(345, 56)))
    g.add(Rectangle(width=28 * k, height=16 * k, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=2).move_to(P(88, 32)))
    g.add(T("시간표", 16, INK).move_to(P(88, 54)))
    for y in (130, 270):
        g.add(Rectangle(width=12 * k, height=80 * k, fill_color="#9FD3F0", fill_opacity=1, stroke_width=0).move_to(P(28, y)))
    g.add(T("창문", 18, "#1C6FA8").move_to(P(60, 130)))
    g.add(Circle(radius=10 * k, fill_color="#5CB85C", fill_opacity=1, stroke_width=0).move_to(P(48, 200)))
    g.add(T("화분", 18, "#2F7D4A").move_to(P(60, 232)))
    for i in range(6):
        g.add(Rectangle(width=30 * k, height=14 * k, fill_color="#C9A46C", fill_opacity=1, stroke_color="#7A5A30", stroke_width=2)
              .move_to(P(95 + i * 34, 371)))
    g.add(Rectangle(width=40 * k, height=12 * k, fill_color="#CFE6F2", fill_opacity=1, stroke_color="#7A8C96", stroke_width=2).move_to(P(340, 372)))
    g.add(T("사물함", 18, "#7A5A30").move_to(P(160, 350)), T("거울", 18, "#5A7D8C").move_to(P(340, 350)))
    g.add(Rectangle(width=12 * k, height=60 * k, fill_color="#9FD3F0", fill_opacity=1, stroke_width=0).move_to(P(412, 130)))
    g.add(Rectangle(width=14 * k, height=70 * k, fill_color="#A0784A", fill_opacity=1, stroke_width=0).move_to(P(411, 285)))
    g.add(T("창문", 18, "#1C6FA8").move_to(P(378, 130)), T("출입문", 18, "#7A5A30").move_to(P(370, 285)))
    ring = Circle(radius=104 * k, stroke_color="#1C6FA8", stroke_width=3)
    ring = DashedVMobjectSafe(ring)
    g.add(ring.move_to(P(220, 200)))
    g.add(lamp(0.42 * S / 3.2, name="").move_to(P(220, 200)))
    g.pos = {'가': P(220, 96), '나': P(112, 200), '다': P(220, 304), '라': P(328, 200)}
    g.out = {'가': PI / 2, '나': PI, '다': -PI / 2, '라': 0.0}
    g.center_pt = P(220, 200)
    g.k = k
    marks = VGroup()
    for key, p in g.pos.items():
        c = Circle(radius=25 * k, fill_color=PAPER, fill_opacity=1, stroke_color="#9FB3C0", stroke_width=3).move_to(p)
        marks.add(VGroup(c, T(key, 26, NAVY).move_to(p)))
    g.marks = marks
    g.add(marks)
    return g


def DashedVMobjectSafe(m):
    from manim import DashedVMobject
    return DashedVMobject(m, num_dashes=40)


def globe_at(p, out_angle, k=1.0):
    """교실 위치 p에 놓은 작은 지구본: 전등 쪽 반이 밝고, 관측자(빨간 점)는 바깥(out_angle)을 향함 = 한밤"""
    R = 0.32 * k
    g = globe_top(R, phi=out_angle, sun_dir=out_angle + PI, land=False)
    return g.move_to(p)
