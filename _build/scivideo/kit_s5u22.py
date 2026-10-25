"""5-2 2단원 「날씨와 우리 생활」 전용 그림 부품 (s5ep26~29, s5mm06)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit().
  기상 요소: two_sunny(맑은 날 둘: 8 °C 외투 · 31 °C 부채) · weather_app(앱 u2-1 날씨 애플리케이션 화면 — .parts[k])
            compass(북동풍: 북동쪽에서 불어오는 바람) · day_chart(앱 u2-1 9월 3일~10일 자료 — .cols[i] .gap(i))
  생활: umbrella · hat · hand_fan · greenhouse
  이슬·안개·구름: cup_tissue(차가운 컵 밑 젖은 휴지) · can_on_towel(stage) · paper_test(포도 음료·캔 물방울)
            fog_jar(물·향 연기·얼음 지퍼 백·뿌옇기) · sky_heights(kind)(이슬·안개·구름이 생기는 높이)
  기압: two_regions(ㄱ 맑음·ㄴ 비) · pressure_map(가운데 1012와 주변 값) · air_column(일정한 넓이 위 공기)
        satellite(앱 u2-4 위성 사진 그림 좌표를 그대로 옮김, 'oct12'|'oct22')
  바람: beach_windsock(바람자루가 육지 쪽) · WindBox(앱 u2-5 모형실험 장치: 모래 20 °C · 따뜻한 물 34 °C · 향 연기)
        sea_land(night)(바닷가 낮·밤, 바람 화살표 — 낮 바다 → 육지 해풍, 밤 육지 → 바다 육풍)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU, WHITE,
                   Arc, Arrow, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, VGroup, VMobject,
                   DashedVMobject, Intersection)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK, SKIN
from kit_s3u12 import fit, E, C, L, poly, smooth, text_card, ox_mark  # noqa: F401
from kit_s4u24 import R, rect, sun_hot, rain_cloud, thermo, lines  # noqa: F401
from kit_s4u24 import cloud as gray_cloud  # noqa: F401
from kit_s3u22 import cloud as white_cloud  # noqa: F401
from kit_s4u23 import kid, air_in  # noqa: F401
from kit_s4u12 import (cold_can, dew_grass, window_drops, dehumidifier, laundry, mirror, snowman,  # noqa: F401
                       safety_note, ice_cube)
from kit_s5u11 import label  # noqa: F401
from kit_s5u13 import word_card, pic_card, result_table, Glass  # noqa: F401

SW = 4
SKY = "#D6EFFA"
SKY_N = "#1E2A4A"
SEA = "#3A8FC7"
SEA_N = "#24507A"
LAND = "#E0C48A"
LAND_N = "#6D5F45"
GRASS = "#8CC977"
HOT = "#E2573F"
COLD = "#3A86C8"
HUM = "#4FB3C8"
SMOKE = "#B9C1C7"
WATER_L = "#BFE6F7"
WATER_D = "#2F8FC8"
YEL = "#FFC93C"
HIGH = "#1F6FD1"    # 고기압 표시(파랑)
LOW = "#D63A2F"     # 저기압 표시(빨강)


# ══════════════ 기상 요소 ══════════════
def hand_fan(s=1.0):
    blade = Polygon([0, 0, 0], [-0.45, 0.75, 0], [0.45, 0.75, 0], fill_color="#F2A65A", fill_opacity=1,
                    stroke_color=INK, stroke_width=3)
    top = Arc(radius=0.52, start_angle=PI / 2 - 0.55, angle=1.1, stroke_color=INK, stroke_width=3).move_to([0, 0.8, 0])
    handle = L((0, 0), (0, -0.45), BROWN_DARK, 8)
    return VGroup(blade, top, handle).scale(s)


def coat_kid():
    k = kid("#2F6FAE")
    scarf = R(0.55, 0.14, "#C2332C", 0, 0.67, rad=0.05, stroke=INK, sw=2)
    k.add(scarf)
    return k


def fan_kid():
    k = kid("#F4A261")
    f = hand_fan(0.55).rotate(-0.5).move_to([0.75, 1.0, 0])
    k.add(f)
    return k


def sunny_panel(title, temp, cold=True, w=5.4, h=3.8):
    bg = R(w, h, SKY, 0, 0, rad=0.2, stroke=SOFT, sw=3)
    grass = rect(w - 0.04, 0.7, GRASS, 0, -h / 2 + 0.36, stroke=GRASS, sw=0)
    s = sun_hot(0.36).move_to([w / 2 - 0.85, h / 2 - 0.8, 0])
    cl = white_cloud(1.2).move_to([-w / 2 + 1.1, h / 2 - 1.0, 0])
    k = (coat_kid() if cold else fan_kid())
    k.scale(1.35).move_to([-0.6, -h / 2 + 0.7 + k.height * 0.5 * 1.0 - 0.15, 0])
    th = thermo(0.18 if cold else 0.85, COLD if cold else HOT, 1.5).move_to([1.35, -h / 2 + 1.45, 0])
    tt = T(temp, 30, INK).next_to(th, RIGHT, buff=0.2)
    tl = T(title, 30, "#0F3B5C").move_to([-w / 2 + 0.25, h / 2 - 0.35, 0], aligned_edge=LEFT)
    g = VGroup(bg, grass, cl, s, k, th, tt, tl)
    g.kid, g.th, g.temp = k, th, tt
    return g


def two_sunny():
    a = sunny_panel("맑은 날 ①", "8 °C", True)
    b = sunny_panel("맑은 날 ②", "31 °C", False)
    return VGroup(a, b).arrange(RIGHT, buff=0.5)


def small_rain(s=0.42):
    return fit(rain_cloud(1.6), s * 2, s * 2)


def weather_app():
    """앱 u2-1 날씨 애플리케이션 화면. .parts: t(기온) w(바람) h(습도) c(구름의 양) r(강수량)"""
    W, H = 7.4, 5.3
    body = RoundedRectangle(corner_radius=0.38, width=W, height=H, fill_color="#6F8DA6", fill_opacity=1,
                            stroke_color="#2C3E50", stroke_width=8)
    g = VGroup(body)
    top_y = H / 2 - 0.85
    icon = small_rain(0.5).move_to([-W / 2 + 0.95, top_y, 0])
    big = T("23 °C", 64, WHITE).move_to([-W / 2 + 2.6, top_y, 0])

    def pill(text):
        t = T(text, 26, WHITE)
        b = RoundedRectangle(corner_radius=0.22, width=t.width + 0.36, height=0.5, fill_color="#5A7891",
                             fill_opacity=1, stroke_color=WHITE, stroke_width=2)
        t.move_to(b)
        return VGroup(b, t)
    p_rain = pill("비")
    p_cloud = pill("구름 많음")
    p_amt = pill("강수량 6 mm")
    VGroup(p_rain, p_cloud).arrange(RIGHT, buff=0.15).move_to([1.55, top_y + 0.32, 0])
    p_amt.move_to([1.55, top_y - 0.33, 0])
    g.add(icon, big, p_rain, p_cloud, p_amt)
    # 표
    rows = [["시간", "09시", "10시", "11시", "12시"], ["날씨", "", "", "", ""],
            ["기온", "23 °C", "22 °C", "22 °C", "23 °C"], ["풍속", "3 m/s", "3 m/s", "3 m/s", "2 m/s"],
            ["풍향", "남서", "남서", "남서", "서"], ["습도", "85 %", "80 %", "75 %", "70 %"]]
    cw = [1.3, 1.35, 1.35, 1.35, 1.35]
    rh = 0.56
    tw = sum(cw)
    y0 = top_y - 0.85
    row_mobs = []
    for ri, row in enumerate(rows):
        x = -tw / 2
        rg = VGroup()
        for ci, txt in enumerate(row):
            w = cw[ci]
            box = Rectangle(width=w, height=rh, fill_color="#FFFFFF", fill_opacity=0.12 if ci else 0.2,
                            stroke_color="#DDE6EE", stroke_width=2).move_to([x + w / 2, y0 - ri * rh - rh / 2, 0])
            rg.add(box)
            if ri == 1 and ci > 0:
                rg.add(small_rain(0.22).move_to(box))
            elif txt:
                rg.add(T(txt, 24, WHITE).move_to(box))
            x += w
        row_mobs.append(rg)
        g.add(rg)
    g.parts = {"t": VGroup(big, row_mobs[2]), "w": VGroup(row_mobs[3], row_mobs[4]), "h": VGroup(row_mobs[5]),
               "c": VGroup(p_cloud), "r": VGroup(p_amt)}
    g.rows = row_mobs
    return g


def compass(r=1.6, wind="북동"):
    """8방위 + 바람 화살표: wind쪽에서 불어오는(가운데를 지나 반대쪽으로 가는) 바람"""
    DIRS = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"]
    disk = Circle(radius=r, fill_color="#F3FBFF", fill_opacity=1, stroke_color="#9CC3D8", stroke_width=4)
    g = VGroup(disk)
    for i, d in enumerate(DIRS):
        a = PI / 2 - i * PI / 4
        t = T(d, 30 if len(d) == 1 else 24, RED if d == wind else "#0F3B5C")
        t.move_to([np.cos(a) * (r + 0.42), np.sin(a) * (r + 0.42), 0])
        g.add(t)
    i = DIRS.index(wind)
    a = PI / 2 - i * PI / 4
    d = np.array([np.cos(a), np.sin(a), 0])
    arr = Arrow(d * r * 0.88, -d * r * 0.5, buff=0, stroke_width=12, color="#1C6FA8",
                max_tip_length_to_length_ratio=0.25)
    g.add(arr)
    g.arrow = arr
    return g


DAYS = [("9월 3일", "rain", 29, 23, 78), ("9월 4일", "rain", 30, 24, 80), ("9월 5일", "few", 33, 25, 70),
        ("9월 6일", "sun", 32, 24, 65), ("9월 7일", "sun", 32, 22, 55), ("9월 8일", "sun", 31, 20, 60),
        ("9월 9일", "sun", 31, 22, 66), ("9월 10일", "rain", 30, 23, 68)]


def day_icon(kind, s=0.32):
    if kind == "sun":
        return sun_hot(s * 0.8)
    if kind == "few":
        return VGroup(sun_hot(s * 0.6).shift(UP * 0.12 + RIGHT * 0.15), white_cloud(s * 2.2).shift(DOWN * 0.08 + LEFT * 0.1))
    return small_rain(s)


def day_chart(W=12.4, H=4.9):
    """앱 u2-1 여러 날 자료: 최고 기온(빨강)·최저 기온(파랑) 꺾은선 + 습도(하늘색) 막대.
    .cols[i](날마다 바탕) .gap(i)(최고-최저 차이 꺾쇠) .bars .labels"""
    g = VGroup()
    x0, x1 = -W / 2 + 1.3, W / 2 - 0.3
    base = -H / 2 + 0.45
    top = H / 2 - 0.85
    n = len(DAYS)
    dx = (x1 - x0) / n
    X = [x0 + dx * (i + 0.5) for i in range(n)]

    def Y(v):   # 기온 15~35 °C
        return base + (v - 15) / 20 * (top - base)

    def HY(h):  # 습도 0~100 %
        return base + h / 100 * (top - base) * 0.5
    cols = VGroup()
    for i, d in enumerate(DAYS):
        c = R(dx - 0.1, H - 0.05, "#EEF3F8" if d[1] == "rain" else "#FFFDF3", X[i], 0, rad=0.1, sw=0)
        c.set_stroke(width=0)
        cols.add(c)
    g.add(cols)
    for v in (15, 20, 25, 30, 35):
        g.add(Line([x0 - 0.05, Y(v), 0], [x1, Y(v), 0], stroke_color="#DCE6EC", stroke_width=2))
        g.add(T(f"{v}°C", 20, SOFT).move_to([x0 - 0.45, Y(v), 0]))
    bars = VGroup()
    for i, d in enumerate(DAYS):
        b = Rectangle(width=0.42, height=HY(d[4]) - base, fill_color="#8FD3DF", fill_opacity=0.75, stroke_width=0)
        b.move_to([X[i], (HY(d[4]) + base) / 2, 0])
        bt = T(f"{d[4]}%", 20, "#1F6F7D").move_to([X[i], base + 0.2, 0])
        bars.add(VGroup(b, bt))
    g.add(bars)
    labels = VGroup()
    for i, d in enumerate(DAYS):
        labels.add(T(d[0], 22, INK).move_to([X[i], -H / 2 + 0.12, 0]))
        g.add(day_icon(d[1]).move_to([X[i], H / 2 - 0.4, 0]))
    g.add(labels)
    for j, col in ((2, HOT), (3, COLD)):
        pts = [[X[i], Y(d[j]), 0] for i, d in enumerate(DAYS)]
        ln = VMobject(stroke_color=col, stroke_width=5)
        ln.set_points_as_corners(pts)
        g.add(ln)
        for i, d in enumerate(DAYS):
            g.add(Dot(pts[i], radius=0.08, color=col))
            g.add(T(str(d[j]), 22, col).move_to([X[i] + 0.27, Y(d[j]) + (0.24 if j == 2 else -0.24), 0]))
    leg = VGroup(VGroup(Dot(radius=0.08, color=HOT), T("최고 기온", 20, HOT)).arrange(RIGHT, buff=0.1),
                 VGroup(Dot(radius=0.08, color=COLD), T("최저 기온", 20, COLD)).arrange(RIGHT, buff=0.1),
                 VGroup(Rectangle(width=0.2, height=0.2, fill_color="#8FD3DF", fill_opacity=1, stroke_width=0),
                        T("습도", 20, "#1F6F7D")).arrange(RIGHT, buff=0.1)).arrange(RIGHT, buff=0.4)
    leg.move_to([0, H / 2 + 0.3, 0])
    g.add(leg)
    g.leg = leg
    g.cols, g.bars, g.labels, g.X, g.Y = cols, bars, labels, X, Y

    def gap(i, col="#7A4F00"):
        d = DAYS[i]
        x = X[i] - 0.36
        a, b = Y(d[2]), Y(d[3])
        br = VGroup(Line([x, a, 0], [x, b, 0], stroke_color=col, stroke_width=6),
                    Line([x - 0.09, a, 0], [x + 0.09, a, 0], stroke_color=col, stroke_width=6),
                    Line([x - 0.09, b, 0], [x + 0.09, b, 0], stroke_color=col, stroke_width=6))
        return br
    g.gap = gap
    return g


# ══════════════ 생활 ══════════════
def umbrella(s=1.0, col="#2F6FD6"):
    canopy = Arc(radius=0.8, start_angle=0, angle=PI, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3)
    base = Line([-0.8, 0, 0], [0.8, 0, 0], stroke_color=INK, stroke_width=3)
    shaft = L((0, 0), (0, -0.9), INK, 5)
    hook = Arc(radius=0.15, start_angle=PI, angle=PI, stroke_color=INK, stroke_width=5).move_to([0.15, -0.95, 0])
    return VGroup(canopy, base, shaft, hook).scale(s)


def hat(s=1.0, col="#F2C14E"):
    brim = E(1.6, 0.35, col, 0, 0, stroke=INK, sw=3)
    crown = Arc(radius=0.5, start_angle=0, angle=PI, fill_color=col, fill_opacity=1, stroke_color=INK,
                stroke_width=3).move_to([0, 0.25, 0])
    band = R(0.98, 0.12, "#C2332C", 0, 0.08, rad=0.03, sw=0)
    return VGroup(brim, crown, band).scale(s)


def greenhouse(s=1.0):
    body = Arc(radius=1.0, start_angle=0, angle=PI, fill_color="#E8F6FB", fill_opacity=0.85, stroke_color="#7AA7BD",
               stroke_width=5)
    base = L((-1, 0), (1, 0), BROWN_DARK, 5)
    ribs = VGroup(*[L((x, 0), (x, np.sqrt(max(0, 1 - x * x))), "#7AA7BD", 3) for x in (-0.5, 0, 0.5)])
    ropes = VGroup(L((-0.7, 0.71), (-1.3, -0.05), BROWN_DARK, 3), L((0.7, 0.71), (1.3, -0.05), BROWN_DARK, 3))
    pegs = VGroup(rect(0.1, 0.2, BROWN, -1.3, -0.1, sw=2), rect(0.1, 0.2, BROWN, 1.3, -0.1, sw=2))
    return VGroup(body, base, ribs, ropes, pegs).scale(s)


# ══════════════ 이슬 · 안개 · 구름 ══════════════
def cup_tissue(wet=True):
    tissue = poly([(-1.1, -0.95), (1.1, -0.95), (1.25, -0.75), (-1.25, -0.75)], WHITE, "#C9D2D8", 3)
    g = VGroup(tissue)
    if wet:
        g.add(E(1.5, 0.16, "#A9D6EE", 0, -0.85, sw=0, op=0.9))
    glass = poly([(-0.6, -0.82), (0.6, -0.82), (0.75, 0.9), (-0.75, 0.9)], "#F4FBFF", "#7AA7BD", 5, op=0.4)
    drink = poly([(-0.57, -0.78), (0.57, -0.78), (0.68, 0.45), (-0.68, 0.45)], "#E9A23B", "#E9A23B", 0, op=0.85)
    ices = VGroup(*[ice_cube(0.32).move_to([x, y, 0]) for x, y in ((-0.25, 0.25), (0.22, 0.12))])
    g.add(drink, ices, glass)
    if wet:
        g.add(*[Ellipse(width=0.09, height=0.13, fill_color=WATER_L, fill_opacity=1, stroke_color=WATER_D,
                        stroke_width=2).move_to([x, y, 0])
                for x, y in ((-0.55, 0.4), (-0.48, -0.1), (-0.62, -0.5), (0.55, 0.55), (0.5, 0.0), (0.58, -0.45), (0.0, -0.6))])
    return g


def towel(w=2.4):
    return poly([(-w / 2, -0.12), (w / 2, -0.12), (w / 2 + 0.15, 0.12), (-w / 2 + 0.15, 0.12)], "#F6E7C8", "#C9A979", 3)


def can_on_towel(stage=0):
    tw = towel(2.6)
    can = cold_can(stage, 1.0)
    can.move_to([0, 0.95, 0])
    tw.move_to([0, 0.0, 0])
    g = VGroup(tw, can)
    if stage == 3:
        g.add(E(1.2, 0.12, "#C9A979", 0, 0.02, sw=0, op=0.7))
    return g


def paper_test(dab=True):
    def sheet(title, col):
        bg = rect(3.2, 2.1, WHITE, 0, 0, stroke="#BBBBBB", sw=3)
        g = VGroup(bg)
        blob = VMobject(fill_color=col if col else WHITE, fill_opacity=0.85 if col else 0,
                        stroke_color="#A9CBE0" if not col else col, stroke_width=3 if not col else 0)
        blob.set_points_smoothly([[-0.6, 0.2, 0], [0.0, 0.5, 0], [0.6, 0.2, 0], [0.4, -0.45, 0], [-0.3, -0.5, 0], [-0.6, 0.2, 0]])
        if dab:
            if col:
                g.add(blob)
            else:
                g.add(DashedVMobject(blob, num_dashes=24), T("투명하게 젖음", 22, "#5B8FB0"))
        t = T(title, 26, INK).next_to(bg, DOWN, buff=0.18)
        g.add(t)
        return g
    a = sheet("포도 음료수", "#7D3C98")
    b = sheet("캔 표면의 물방울", None)
    return VGroup(a, b).arrange(RIGHT, buff=0.8)


def fog_jar(water=0.0, smoke=0.0, bag=False, fog=0.0, w=2.0, h=2.6):
    """집기병(옆 모습). water: 물 높이 비율, smoke: 향 연기 진하기, bag: 얼음 지퍼 백, fog: 뿌연 정도(0~1)"""
    J = Glass(0, -h / 2, w, h, "jar")
    g = VGroup(J.glass())
    if water:
        g.add(J.liquid(water * h, "#CFE9F8"))
    if smoke:
        g.add(*[Circle(radius=r_, fill_color=SMOKE, fill_opacity=0.55 * smoke, stroke_width=0).move_to([x, y, 0])
                for x, y, r_ in ((-0.35, 0.3, 0.32), (0.2, 0.45, 0.38), (0.0, -0.05, 0.34), (0.4, 0.0, 0.26), (-0.4, -0.3, 0.25))])
    if fog:
        g.add(rect(w * 0.9, h * 0.86, WHITE, 0, h * 0.02, sw=0, op=0.72 * fog))
    if bag:
        b = R(w * 1.15, 0.6, "#EAF6FF", 0, h / 2 + 0.32, rad=0.12, stroke="#8FBFDF", sw=4)
        cubes = VGroup(*[ice_cube(0.3).move_to([x, h / 2 + 0.32, 0]) for x in (-0.6, -0.15, 0.3, 0.72)])
        zip_ = L((-w * 0.55, h / 2 + 0.55), (w * 0.55, h / 2 + 0.55), "#3A86C8", 4)
        g.add(b, cubes, zip_)
    return g


def ground_scene(W=12.6, H=5.0, sky=SKY):
    bg = R(W, H, sky, 0, 0, rad=0.2, stroke=SOFT, sw=3)
    hills = poly([(-W / 2 + 0.02, -H / 2 + 1.2), (-W / 2 + 2.0, -H / 2 + 1.9), (-W / 2 + 3.6, -H / 2 + 1.4),
                  (-0.4, -H / 2 + 2.3), (1.6, -H / 2 + 1.5), (3.6, -H / 2 + 1.9), (W / 2 - 0.02, -H / 2 + 1.3),
                  (W / 2 - 0.02, -H / 2 + 0.02), (-W / 2 + 0.02, -H / 2 + 0.02)], "#8DB58A", "#8DB58A", 0)
    fld = rect(W - 0.04, 0.9, "#6F9B6A", 0, -H / 2 + 0.47, sw=0)
    return VGroup(bg, hills, fld)


def sky_heights(kind="all", W=12.6, H=5.0):
    """이슬(물체 표면) · 안개(지표면 가까이) · 구름(높은 곳). kind: 'dew'|'fog'|'cloud'|'all'"""
    g = ground_scene(W, H)
    base = -H / 2 + 0.9
    ax = Arrow([-W / 2 + 0.5, base - 0.1, 0], [-W / 2 + 0.5, H / 2 - 0.3, 0], buff=0, stroke_width=6, color="#0F3B5C",
               max_tip_length_to_length_ratio=0.06)
    g.add(ax, T("높은 곳", 24, "#0F3B5C").move_to([-W / 2 + 1.35, H / 2 - 0.45, 0]),
          T("지표면", 24, "#0F3B5C").move_to([-W / 2 + 1.25, base + 0.25, 0]))
    gr = VGroup()
    for i in range(7):
        x = -3.9 + i * 1.6
        gr.add(dew_grass().scale(0.75).move_to([x, base + 0.15, 0]))
    g.add(gr)
    g.dew = VGroup(*[sub[1] for sub in gr])
    g.fog = rect(W - 0.1, 1.5, WHITE, 0, base + 0.55, sw=0, op=0.75)
    g.clouds = VGroup(white_cloud(2.4).move_to([-1.8, H / 2 - 1.0, 0]), white_cloud(2.0).move_to([1.6, H / 2 - 0.8, 0]),
                      white_cloud(1.5).move_to([4.4, H / 2 - 1.2, 0]))
    if kind in ("fog", "all"):
        g.add(g.fog)
    if kind in ("cloud", "all"):
        g.add(g.clouds)
    if kind == "dew":
        pass
    g.base = base
    return g


# ══════════════ 기압 ══════════════
def man(col="#E67E22", umb=None):
    k = kid(col)
    if umb:
        u = umbrella(0.5, umb).move_to([0.45, 1.55, 0])
        k.add(u)
    return k


def two_regions(w=5.6, h=3.8):
    a_bg = R(w, h, "#BFE6FB", 0, 0, rad=0.2, stroke=SOFT, sw=3)
    a = VGroup(a_bg, rect(w - 0.04, 0.8, GRASS, 0, -h / 2 + 0.42, sw=0), sun_hot(0.42).move_to([w / 2 - 0.9, h / 2 - 0.9, 0]),
               white_cloud(1.1).move_to([-w / 2 + 1.0, h / 2 - 1.0, 0]))
    for x, c in ((-1.4, "#E67E22"), (-0.3, "#16A085"), (0.9, "#8E44AD")):
        a.add(man(c).scale(1.2).move_to([x, -h / 2 + 1.35, 0]))
    a.add(T("ㄱ 지역", 30, "#0F3B5C").move_to([-w / 2 + 0.25, h / 2 - 0.35, 0], aligned_edge=LEFT))
    b_bg = R(w, h, "#8E9AA6", 0, 0, rad=0.2, stroke=SOFT, sw=3)
    b = VGroup(b_bg, rect(w - 0.04, 0.8, "#7AA36B", 0, -h / 2 + 0.42, sw=0))
    for x, y, s in ((-1.6, 1.0, 1.8), (0.1, 1.15, 2.1), (1.8, 0.95, 1.6)):
        b.add(gray_cloud(s, "#5D6D7E").move_to([x, y, 0]))
    rnd = np.random.default_rng(3)
    for _ in range(26):
        x = rnd.uniform(-w / 2 + 0.3, w / 2 - 0.3)
        y = rnd.uniform(-0.9, 0.5)
        b.add(L((x, y), (x - 0.06, y - 0.22), "#D6EAF8", 3))
    for x, c, u in ((-1.0, "#2C3E50", "#E74C3C"), (0.9, "#C0392B", "#2980B9")):
        b.add(man(c, u).scale(1.2).move_to([x, -h / 2 + 1.45, 0]))
    b.add(T("ㄴ 지역", 30, WHITE).move_to([-w / 2 + 0.25, h / 2 - 0.35, 0], aligned_edge=LEFT))
    return VGroup(a, b).arrange(RIGHT, buff=0.5)


def pressure_map(around, center=1012, s=1.0):
    P = [(-1.5, 0.8), (1.5, 0.8), (-1.5, -0.8), (1.5, -0.8)]
    g = VGroup(R(4.4, 3.0, "#F3FBFF", 0, 0, rad=0.2, stroke="#9CC3D8", sw=3))
    for (x, y), v in zip(P, around):
        g.add(L((0, 0), (x, y), "#CFE0EA", 5))
    for (x, y), v in zip(P, around):
        g.add(C(0.48, WHITE, x, y, stroke="#9CC3D8", sw=3), T(str(v), 28, "#48646F").move_to([x, y, 0]))
    cc = C(0.62, "#FFF4CC", 0, 0, stroke="#F2B705", sw=5)
    g.add(cc, T("가", 26, "#7A4F00").move_to([0, 0.22, 0]), T(str(center), 32, INK).move_to([0, -0.15, 0]))
    g.center_node = cc
    return g.scale(s)


def air_column(w=3.0, h=3.4):
    ground_ = rect(w + 1.6, 0.4, "#C9A77A", 0, -h / 2 - 0.2, stroke=BROWN_DARK, sw=3)
    area = rect(w, 0.14, ORANGE, 0, -h / 2 + 0.07, sw=0)
    col = rect(w, h, "#EAF4FB", 0, 0, stroke="#7FB2D6", sw=3, op=0.6)
    dots = air_in(-w / 2 + 0.15, w / 2 - 0.15, -h / 2 + 0.2, h / 2 - 0.15, n=46, seed=4, r=0.06)
    arr = Arrow([0, h / 2 - 0.3, 0], [0, -h / 2 + 0.35, 0], buff=0, stroke_width=10, color=RED,
                max_tip_length_to_length_ratio=0.15)
    g = VGroup(col, dots, ground_, area, arr)
    g.area, g.arrow = area, arr
    return g


# 앱 u2-4 기상 위성 사진 그림(400×300)의 좌표 그대로
_LAND = [(0, 0), (262, 0), (262, 20), (250, 55), (240, 80), (225, 95), (232, 120), (240, 150), (245, 180), (240, 205),
         (225, 220), (205, 225), (185, 222), (175, 205), (180, 185), (170, 170), (178, 150), (165, 135), (172, 115),
         (160, 100), (150, 85), (130, 95), (120, 120), (125, 150), (105, 175), (100, 210), (90, 260), (70, 300), (0, 300)]
_JAPAN = [(290, 232), (312, 214), (332, 198), (350, 170), (372, 148), (400, 112), (400, 150), (382, 176), (362, 200),
          (336, 226), (310, 246), (292, 252)]
SAT = {
    "oct12": dict(clouds=[(330, 30, 60, 22), (380, 70, 30, 40), (40, 40, 30, 14), (360, 270, 50, 18), (90, 280, 40, 10)],
                  H=(205, 150), L=(328, 40)),
    "oct22": dict(clouds=[(200, 150, 90, 70), (150, 110, 50, 40), (260, 190, 60, 40), (230, 90, 40, 30), (300, 230, 45, 25),
                          (120, 200, 30, 30)], H=(70, 90), L=(200, 160)),
}


def satellite(day="oct12", W=5.6):
    k = W / 400.0
    Hh = 300 * k

    def P(x, y):
        return [(x - 200) * k, -(y - 150) * k, 0]
    frame = Rectangle(width=W, height=Hh)
    g = VGroup(Rectangle(width=W, height=Hh, fill_color="#0B1A2E", fill_opacity=1, stroke_color="#55657A", stroke_width=4))
    g.add(Polygon(*[P(x, y) for x, y in _LAND], fill_color="#3B4A3C", fill_opacity=1, stroke_width=0))
    g.add(Polygon(*[P(x, y) for x, y in _JAPAN], fill_color="#3B4A3C", fill_opacity=1, stroke_width=0))
    g.add(Ellipse(width=20 * k, height=10 * k, fill_color="#3B4A3C", fill_opacity=1, stroke_width=0).move_to(P(205, 252)))
    d = SAT[day]
    cl = VGroup()
    for cx, cy, rx, ry in d["clouds"]:
        for f, op in ((1.25, 0.22), (1.0, 0.45), (0.75, 0.75)):
            e = Ellipse(width=2 * rx * k * f, height=2 * ry * k * f).move_to(P(cx, cy))
            e = Intersection(e, frame, fill_color=WHITE, fill_opacity=op, stroke_width=0)
            cl.add(e)
    # 화면 밖으로 번지지 않게 사진 틀 안으로
    g.add(cl)
    g.add(T("동해", 22, "#9FC3DD").move_to(P(312, 115)))
    hi = VGroup(Circle(radius=20 * k, fill_color=HIGH, fill_opacity=1, stroke_color=WHITE, stroke_width=3),
                T("고", 26, WHITE)).move_to(P(*d["H"]))
    lo = VGroup(Circle(radius=20 * k, fill_color=LOW, fill_opacity=1, stroke_color=WHITE, stroke_width=3),
                T("저", 26, WHITE)).move_to(P(*d["L"]))
    hi[1].move_to(hi[0])
    lo[1].move_to(lo[0])
    g.add(hi, lo)
    g.hi, g.lo, g.clouds = hi, lo, cl
    return g


# ══════════════ 바람 ══════════════
def windsock(s=1.0):
    pole = rect(0.12, 2.4, "#7A5A3A", 0, 0, sw=0)
    sock = poly([(0.06, 1.15), (1.9, 0.9), (1.9, 0.6), (0.06, 0.48)], "#E74C3C", INK, 3)
    stripes = VGroup(*[L((x, 1.15 - (x - 0.06) * 0.136 - 0.02), (x, 0.48 + (x - 0.06) * 0.065 + 0.02), WHITE, 9)
                       for x in (0.55, 1.05, 1.55)])
    return VGroup(pole, sock, stripes).scale(s)


def beach_windsock(W=12.4, H=4.8):
    bg = R(W, H, "#BFE6FB", 0, 0, rad=0.2, stroke=SOFT, sw=3)
    sea = poly([(-W / 2 + 0.02, -0.6), (-0.4, -0.6), (0.0, -H / 2 + 0.02), (-W / 2 + 0.02, -H / 2 + 0.02)], SEA, SEA, 0)
    land = poly([(-0.4, -0.6), (W / 2 - 0.02, -0.45), (W / 2 - 0.02, -H / 2 + 0.02), (0.0, -H / 2 + 0.02)], LAND, LAND, 0)
    s = sun_hot(0.42).move_to([0, H / 2 - 0.85, 0])
    ws = windsock(1.0)
    ws.shift(np.array([2.6, -0.52, 0]) - ws[0].get_bottom())
    g = VGroup(bg, sea, land, s, ws,
               T("바다", 34, WHITE).move_to([-3.8, -1.5, 0]), T("육지", 34, "#8A6A3E").move_to([4.0, -1.6, 0]),
               T("바람자루", 26, "#0F3B5C").next_to(ws[0], UP, buff=0.12))
    g.sock = ws
    return g


class WindBox:
    """앱 u2-5 바람 발생 모형실험 장치(800×330 그림 좌표를 화면으로 옮김).
    모래(왼쪽, 20 °C) · 따뜻한 물(오른쪽, 34 °C) · 가운데 향 연기 그릇"""

    def __init__(self, W=11.0):
        self.k = W / 800.0
        self.W = W

    def P(self, x, y):
        return np.array([(x - 400) * self.k, -(y - 175) * self.k, 0])

    def therm(self, x, y, v, col):
        k = self.k
        tube = Rectangle(width=18 * k, height=44 * k, fill_color="#111111", fill_opacity=1, stroke_color="#666666",
                         stroke_width=2).move_to(self.P(x, y - 18))
        liq = Rectangle(width=11 * k, height=34 * k, fill_color=col, fill_opacity=1, stroke_width=0).move_to(self.P(x, y - 18))
        return VGroup(tube, liq)

    def box(self):
        k = self.k
        floor = Rectangle(width=self.W + 0.4, height=30 * k, fill_color="#C9A77A", fill_opacity=1, stroke_width=0).move_to(self.P(400, 315))
        back = Rectangle(width=580 * k, height=260 * k, fill_color="#1D232B", fill_opacity=1, stroke_color="#9FB3C2",
                         stroke_width=5).move_to(self.P(400, 170))
        cap = T("뒷면이 검은색인 투명한 상자", 22, "#9FB3C2").move_to(self.P(400, 64))
        return VGroup(floor, back, cap)

    def bowls(self):
        P = self.P
        sand_b = Polygon(P(150, 230), P(320, 230), P(310, 296), P(160, 296), fill_color="#E8F4FA", fill_opacity=0.35,
                         stroke_color="#CFE3EE", stroke_width=4)
        sand = Polygon(P(154, 246), P(316, 246), P(309, 294), P(161, 294), fill_color="#D9B77A", fill_opacity=1, stroke_width=0)
        wat_b = Polygon(P(480, 230), P(650, 230), P(640, 296), P(490, 296), fill_color="#E8F4FA", fill_opacity=0.35,
                        stroke_color="#CFE3EE", stroke_width=4)
        wat = Polygon(P(484, 246), P(646, 246), P(639, 294), P(491, 294), fill_color="#5DADE2", fill_opacity=1, stroke_width=0)
        t1 = self.therm(176, 284, 20, "#3B82C4")
        t2 = self.therm(626, 284, 34, "#E74C3C")
        n1 = T("모래 20 °C", 30, "#6B5030").move_to(P(235, 345))
        n2 = T("따뜻한 물 34 °C", 30, "#1C6FA8").move_to(P(565, 345))
        g = VGroup(sand, sand_b, wat, wat_b, t1, t2, n1, n2)
        g.sand, g.water = VGroup(sand, sand_b), VGroup(wat, wat_b)
        return g

    def incense(self, lid=True, smoke=True):
        P = self.P
        cup = Polygon(P(360, 236), P(440, 236), P(434, 296), P(366, 296), fill_color="#E8F4FA", fill_opacity=0.4,
                      stroke_color="#CFE3EE", stroke_width=4)
        clay = Ellipse(width=44 * self.k, height=16 * self.k, fill_color="#7F8C8D", fill_opacity=1, stroke_width=0).move_to(P(400, 282))
        sticks = VGroup(*[Line(P(x, 280), P(x, 250), stroke_color="#8A5A2B", stroke_width=4) for x in (388, 400, 412)])
        g = VGroup(cup, clay, sticks)
        if smoke:
            g.add(*[Circle(radius=r_ * self.k, fill_color="#C8CED3", fill_opacity=0.85, stroke_width=0).move_to(P(x, y))
                    for x, y, r_ in ((386, 252, 14), (410, 248, 16), (400, 266, 14))])
        if lid:
            g.lid = Rectangle(width=88 * self.k, height=8 * self.k, fill_color="#AAB7C4", fill_opacity=1, stroke_width=0).move_to(P(400, 232))
            g.add(g.lid)
        return g

    def puffs(self, t, n=26, op=0.75):
        """연기 알갱이(시각 t, 0~1): 바닥 가까이에서 모래 쪽 → 따뜻한 물 쪽으로, 물 위에서 조금 떠오름(앱과 같은 식)"""
        P = self.P
        Rr = lambda i: ((i * 73) % 100) / 100
        g = VGroup()
        for i in range(n):
            ph = (t * 1.6 + Rr(i)) % 1
            if ph < 0.65:
                x = 400 + ph / 0.65 * 170
                y = 238 - Rr(i + 3) * 12
            else:
                q = (ph - 0.65) / 0.35
                x = 570 + q * 40 + Rr(i + 7) * 20 - 10
                y = 238 - q * 45
            if t > 0.2 and Rr(i + 5) < 0.25:
                x = 250 + ph * 150
                y = 236 - Rr(i + 1) * 10
            g.add(Circle(radius=(9 + Rr(i + 2) * 8) * self.k, fill_color="#C8CED3",
                         fill_opacity=(0.35 + 0.4 * min(1, t * 3)) * op / 0.75, stroke_width=0).move_to(P(x, y)))
        return g

    def flow_arrow(self):
        a = Arrow(self.P(280, 205), self.P(540, 205), buff=0, stroke_width=10, color=YEL, max_tip_length_to_length_ratio=0.12)
        t = T("향 연기가 움직이는 방향", 24, YEL).next_to(a, UP, buff=0.08)
        return VGroup(a, t)


def sea_land(night=False, W=12.4, H=4.4):
    """앱 u2-5 바닷가 낮·밤 그림. 바다 왼쪽, 육지 오른쪽. .arrow(바람) .boxes(온도·기압 글)"""
    sky = SKY_N if night else "#BFE6FB"
    bg = R(W, H, sky, 0, 0, rad=0.2, stroke=SOFT, sw=3)
    sea_top = -0.55
    land_top = -0.4
    sea = rect(W / 2, H / 2 + sea_top, SEA_N if night else SEA, -W / 4, (-H / 2 + sea_top) / 2, sw=0)
    land = rect(W / 2, H / 2 + land_top, LAND_N if night else LAND, W / 4, (-H / 2 + land_top) / 2, sw=0)
    if night:
        sky_obj = VGroup(Circle(radius=0.38, fill_color="#F4F1C9", fill_opacity=1, stroke_width=0),
                         Circle(radius=0.34, fill_color=SKY_N, fill_opacity=1, stroke_width=0).shift(RIGHT * 0.17 + UP * 0.1))
    else:
        sky_obj = sun_hot(0.36)
    sky_obj.move_to([0, H / 2 - 0.65, 0])
    t_sea = T("바다", 30, WHITE).move_to([-W / 4, -H / 2 + 0.55, 0])
    t_land = T("육지", 30, "#F1E5C8" if night else "#6B5030").move_to([W / 4, -H / 2 + 0.55, 0])
    g = VGroup(bg, sea, land, sky_obj, t_sea, t_land)
    g.sea_x, g.land_x = -W / 4, W / 4
    g.top_y = H / 2
    return g


def wind_arrow(x0, x1, y, col=YEL, sw=14):
    return Arrow([x0, y, 0], [x1, y, 0], buff=0, stroke_width=sw, color=col, max_tip_length_to_length_ratio=0.12)


def hl_badge(high=True, r=0.36):
    c = Circle(radius=r, fill_color=HIGH if high else LOW, fill_opacity=1, stroke_color=WHITE, stroke_width=4)
    t = T("고" if high else "저", 30, WHITE).move_to(c)
    return VGroup(c, t)
