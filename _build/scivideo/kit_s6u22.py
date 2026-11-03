"""6-2 2단원 「물질의 연소」 전용 그림 부품 (s6ep30~34, s6mm06)

모두 직접 그린 단순한 벡터 그림. 값·결과는 차시 앱(grade6/science/_build_tb/src2/u2-1 ~ u2-6.html) 그대로.
  불:      flame(양초·알코올 불꽃) · candle(받침 위 양초, 녹아 짧아짐·촛농) · alcohol_lamp(알코올램프, 뚜껑) · campfire
  기구:    cover(아크릴 통) · flask_balloon(식초 든 삼각 플라스크 + 고무풍선) · o2_beaker(과산화 수소수 + 아이오딘화 칼륨)
           plate_rig(삼발이 위 철판 + 성냥 머리·나무 부분) · cobalt_paper(푸른색 염화 코발트 종이) · lime_jar(석회수 병)
           petri_dish(가루 + 용액 방울) · heat_waves
  정리:    cond_chip(연소 조건 이름표 ○/×) · case_card(그림 + 제목 + 글)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject, interpolate_color, ManimColor)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED
from kit_s3u12 import fit, E, C, L, poly, smooth, text_card, ox_mark  # noqa: F401
from kit_s4u12 import safety_note  # noqa: F401
from kit_s5u13 import word_card, result_table  # noqa: F401
from kit_s5u11 import label  # noqa: F401
from kit_s6u11 import name_text, arrow_right  # noqa: F401
from kit_s6u13 import pointer, steps_row  # noqa: F401

SW = 4
GLASS = "#8FB1C6"
GLASS_F = "#EEF6FB"
VINEGAR = "#F4E7B8"
WAX = "#FBF3E2"
WAX_D = "#D9C7A7"
ALC = "#D7ECF7"
COBALT = "#3D6FD1"
COBALT_R = "#D9536A"
LIME = "#EAF6FB"
LIME_C = "#E4E4DC"
IRON = "#9AA3AB"
HOT_IRON = "#D9543A"
WOOD = "#E0C08A"
WOOD_D = "#4A3A2A"
MATCH = "#C0392B"
TABLE = "#E6D6B2"


def mixc(a, b, t):
    return interpolate_color(ManimColor(a), ManimColor(b), float(max(0.0, min(1.0, t))))


def rr(w, h, fill, x=0.0, y=0.0, stroke=INK, sw=SW, r=0.06, op=1.0):
    return RoundedRectangle(corner_radius=r, width=w, height=h, fill_color=fill, fill_opacity=op,
                            stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


def blob(pts, fill, stroke=None, sw=0, op=1.0):
    v = VMobject(fill_color=fill, fill_opacity=op, stroke_color=stroke or fill, stroke_width=sw)
    v.set_points_smoothly([[p[0], p[1], 0] for p in pts] + [[pts[0][0], pts[0][1], 0]])
    return v


# ══════════════ 불꽃 ══════════════
def flame(s=1.0, kind="candle", glow=True):
    """밑 가운데가 (0, 0)인 불꽃. kind: candle(노란색·붉은색) / alcohol(푸른색)"""
    if kind == "alcohol":
        c1, c2, c3 = "#5B8FE8", "#C7D8FF", "#F08A5A"
    else:
        c1, c2, c3 = "#F08A24", "#FFD34D", "#5A5A7A"
    outer = blob([(0, 0), (-0.2, 0.18), (-0.13, 0.5), (0, 0.85), (0.13, 0.5), (0.2, 0.18)], c1, op=0.85)
    inner = blob([(0, 0.04), (-0.1, 0.16), (-0.06, 0.38), (0, 0.6), (0.06, 0.38), (0.1, 0.16)], c2)
    core = E(0.08, 0.14, c3, 0, 0.1, stroke=None, sw=0, op=0.8)
    g = VGroup()
    if glow:
        g.add(Circle(radius=0.55, fill_color="#FFE9A0", fill_opacity=0.22, stroke_width=0).move_to([0, 0.38, 0]))
    g.add(outer, inner, core)
    return g.scale(s, about_point=ORIGIN)


def smoke_curl(h=0.7, col="#A9A9A9"):
    return smooth([(0, 0), (-0.1, h * 0.3), (0.06, h * 0.6), (-0.04, h)], col, 4)


def candle(h=1.5, lit=True, w=0.36, melt=0.0, dish=True, fs=1.0):
    """받침 위 양초. 밑 가운데 (0, 0). melt(0~1): 짧아지고 촛농이 흐름. .flame .wick_top"""
    hh = h * (1 - 0.45 * melt)
    g = VGroup()
    if dish:
        g.add(E(w * 3.0, 0.2, "#C9A66B", 0, 0.02, stroke="#9A7A44", sw=3))
    body = rr(w, hh, WAX, 0, hh / 2 + 0.05, stroke=WAX_D, sw=3, r=0.03)
    g.add(body)
    if melt > 0.05:
        g.add(E(w * 0.85, 0.08, "#FFF8DC", 0, hh + 0.04, stroke="#E8D8A8", sw=2))
        d = 0.15 + 0.5 * melt
        g.add(blob([(-w / 2 - 0.01, hh), (-w / 2 - 0.07, hh - d * 0.6), (-w / 2 - 0.02, hh - d), (-w / 2 + 0.04, hh - d * 0.5)],
                   WAX, WAX_D, 2))
        g.add(blob([(w / 2 + 0.01, hh - 0.02), (w / 2 + 0.06, hh - d * 0.45), (w / 2 + 0.02, hh - d * 0.7), (w / 2 - 0.04, hh - 0.2)],
                   WAX, WAX_D, 2))
        if melt > 0.4:
            g.add(E(w * 1.5, 0.08, WAX, 0.1, 0.12, stroke=WAX_D, sw=2))
    wick = L((0, hh + 0.05), (0, hh + 0.17), INK, 4)
    g.add(wick)
    g.wick_top = np.array([0, hh + 0.13, 0])
    g.flame = None
    if lit:
        f = flame(fs).shift(g.wick_top)
        g.add(f)
        g.flame = f
    return g


def alcohol_lamp(level=0.6, lit=True, cap=False, s=1.0):
    """알코올램프 옆모습. 밑 가운데 (0, 0). level: 알코올 양(0~1)"""
    g = VGroup()
    body = blob([(-0.62, 0.04), (-0.7, 0.35), (-0.45, 0.75), (-0.14, 0.86), (0.14, 0.86), (0.45, 0.75), (0.7, 0.35), (0.62, 0.04)],
                GLASS_F, GLASS, 4, op=0.9)
    g.add(body)
    lv = 0.06 + 0.62 * level
    liq = blob([(-0.6, 0.06), (-0.66, min(lv, 0.35)), (-0.5, lv), (0.5, lv), (0.66, min(lv, 0.35)), (0.6, 0.06)], ALC, op=0.95)
    g.add(liq, E(1.3, 0.12, "#C9B48A", 0, 0.02, stroke=None, sw=0, op=0.7))
    g.add(rr(0.3, 0.2, "#BBBBBB", 0, 0.95, stroke="#888888", sw=2, r=0.03))
    g.add(L((0, 0.6), (0, 1.12), "#F2EBD9", 5))
    g.wick_top = np.array([0, 1.1, 0])
    g.flame = None
    if lit and not cap:
        f = flame(0.95, "alcohol").shift(g.wick_top)
        g.add(f)
        g.flame = f
    if cap:
        g.add(blob([(-0.28, 0.86), (-0.3, 1.2), (-0.14, 1.36), (0.14, 1.36), (0.3, 1.2), (0.28, 0.86)], "#CFD8DE", GLASS, 3))
    return g.scale(s, about_point=ORIGIN)


def campfire(burning=True, s=1.0):
    g = VGroup(L((-0.75, 0.0), (0.55, 0.32), "#8A5A2B", 16), L((0.75, 0.0), (-0.55, 0.32), "#8A5A2B", 16))
    if burning:
        f = flame(2.2).shift([0, 0.14, 0])
        g.add(f)
        g.flame = f
    return g.scale(s, about_point=ORIGIN)


def lamp_rays(r=0.75):
    """빛: 불꽃 둘레로 퍼지는 빛살"""
    g = VGroup(Circle(radius=r * 0.9, fill_color="#FFF2A8", fill_opacity=0.5, stroke_width=0).move_to([0, 0.45, 0]))
    g.add(flame(0.9, glow=False))
    for a in np.linspace(0, TAU, 9)[:-1]:
        d = np.array([np.cos(a), np.sin(a), 0])
        c = np.array([0, 0.45, 0])
        g.add(Line(c + d * r * 1.05, c + d * r * 1.45, stroke_color="#F0A020", stroke_width=6))
    return g


def heat_waves(n=3, h=0.8, col="#E2573F", gap=0.28):
    return VGroup(*[smooth([(x, 0), (x + 0.08, h * 0.33), (x - 0.06, h * 0.66), (x + 0.04, h)], col, 4)
                    for x in np.linspace(-gap * (n - 1) / 2, gap * (n - 1) / 2, n)])


# ══════════════ 기구 ══════════════
def cover(w=2.2, h=2.6, x=0.0):
    """바닥이 뚫린 투명 아크릴 통. 밑 가운데 (x, 0)"""
    g = VGroup(rr(w, h, "#DFF0FA", x, h / 2, stroke="#7FB3D5", sw=5, r=0.08, op=0.28))
    g.add(L((x - w / 2 + 0.2, h - 0.25), (x - w / 2 + 0.2, h * 0.45), "#FFFFFF", 4).set_opacity(0.7))
    return g


def table_top(w=13.0, y=0.0):
    return Rectangle(width=w, height=0.32, fill_color=TABLE, fill_opacity=1, stroke_width=0).move_to([0, y - 0.16, 0])


def flask_balloon(name="", col="#E2706A", powder="#FBF7EE", state="hang", inflate=0.0, bubbles=0.0, sunk=False, size=26):
    """식초가 든 삼각 플라스크 + 고무풍선. 밑 가운데 (0, 0). state: hang(늘어뜨림) / up(세움)"""
    g = VGroup()
    neck_y = 1.75
    body = Polygon([-0.17, neck_y, 0], [-0.17, 1.3, 0], [-0.82, 0.02, 0], [0.82, 0.02, 0], [0.17, 1.3, 0], [0.17, neck_y, 0],
                   fill_color=GLASS_F, fill_opacity=0.8, stroke_color=GLASS, stroke_width=4)
    vin = Polygon([-0.52, 0.62, 0], [0.52, 0.62, 0], [0.79, 0.05, 0], [-0.79, 0.05, 0], fill_color=VINEGAR, fill_opacity=0.95,
                  stroke_width=0)
    g.add(vin, body)
    if sunk:
        g.add(E(1.1, 0.12, "#E9DFC4", 0, 0.1, stroke=None, sw=0))
    if bubbles > 0:
        for k in range(9):
            x = -0.5 + k * 0.125
            y = 0.15 + ((k * 0.17) % 0.42)
            g.add(Circle(radius=0.04 + 0.015 * (k % 3), fill_color=PAPER, fill_opacity=bubbles, stroke_color="#C8B46A",
                         stroke_width=2).move_to([x, y, 0]).set_stroke(opacity=bubbles))
        g.add(blob([(-0.5, 0.62), (0.5, 0.62), (0.45, 0.7), (-0.45, 0.7)], PAPER, op=0.9 * bubbles))
    g.add(rr(0.4, 0.14, col, 0, neck_y + 0.02, stroke=None, sw=0, r=0.04))
    if state == "hang":
        b = blob([(0.05, neck_y + 0.05), (0.45, neck_y + 0.35), (0.8, neck_y + 0.15), (0.6, neck_y - 0.2), (0.2, neck_y - 0.05)], col)
        g.add(b)
        for k in range(3):
            g.add(Dot([0.42 + k * 0.1, neck_y + 0.08 + 0.04 * (k % 2), 0], radius=0.04, color=powder).set_stroke("#BBBBBB", 1))
    else:
        ry = 0.42 + 0.6 * inflate
        rx = 0.3 + 0.4 * inflate
        b = Ellipse(width=2 * rx, height=2 * ry, fill_color=col, fill_opacity=1, stroke_width=0).move_to([0, neck_y + ry - 0.05, 0])
        g.add(b, Arc(radius=rx * 0.55, start_angle=1.9, angle=0.8, stroke_color=PAPER, stroke_width=4).move_to(
            [-rx * 0.35, neck_y + ry * 1.45, 0]).set_opacity(0.6))
    g.add(T("식초", 22, "#6A5A30").move_to([0, 0.32, 0]))
    if name:
        t = T(name, size, INK)
        t.next_to(g, UP, buff=0.12)
        g.add(t)
        g.name = t
    return g


def o2_beaker(bubbles=True, s=1.0):
    """묽은 과산화 수소수 + 아이오딘화 칼륨 → 보글거리며 산소 발생"""
    g = VGroup(rr(0.75, 0.62, "#E8F1D8", 0, 0.31, stroke=None, sw=0, r=0.02, op=0.95),
               Polygon([-0.42, 0.95, 0], [-0.42, 0.02, 0], [0.42, 0.02, 0], [0.42, 0.95, 0], fill_opacity=0,
                       stroke_color=GLASS, stroke_width=4))
    if bubbles:
        for k in range(7):
            g.add(Circle(radius=0.04, fill_color=PAPER, fill_opacity=1, stroke_color="#9FC7DE", stroke_width=2).move_to(
                [-0.3 + k * 0.1, 0.15 + (k * 0.13) % 0.45, 0]))
    return g.scale(s, about_point=ORIGIN)


def plate_rig(heat=0.0, head="raw", wood="raw", d=1.6):
    """삼발이 위 철판, 가운데를 알코올램프로 가열. 성냥 머리(왼쪽)·나무(오른쪽)를 가운데에서 같은 거리 d에.
    head: raw / fire / burnt,  wood: raw / dark / fire.  밑(탁자) (0, 0). .head_pt .wood_pt .center"""
    g = VGroup()
    py = 1.85
    for x in (-1.9, 1.9):
        g.add(L((x * 0.95, 0.0), (x, py - 0.05), "#555555", 7))
    g.add(L((0, 0.0), (0, 0.0), "#555555", 1))
    lamp = alcohol_lamp(0.6, lit=heat > 0, s=0.82)
    g.add(lamp)
    pl = rr(4.6, 0.14, mixc(IRON, HOT_IRON, heat * 0.8), 0, py + 0.07, stroke="#6E767D", sw=3, r=0.02)
    g.add(pl)
    if heat > 0:
        g.add(Ellipse(width=1.6 * heat + 0.2, height=0.12, fill_color=HOT_IRON, fill_opacity=0.65 * heat, stroke_width=0)
              .move_to([0, py + 0.07, 0]))
    top = py + 0.16
    hx, wx = -d, d
    g.add(rr(0.32, 0.16, WOOD_D if head == "burnt" else MATCH, hx, top + 0.08, stroke=INK, sw=2, r=0.07))
    g.add(rr(0.55, 0.1, WOOD if wood == "raw" else WOOD_D, wx, top + 0.05, stroke="#A88A5A", sw=2, r=0.01))
    if head == "fire":
        g.add(flame(0.75).shift([hx, top + 0.12, 0]))
    if head == "burnt":
        g.add(smoke_curl(0.5).shift([hx, top + 0.18, 0]))
    if wood == "fire":
        g.add(flame(0.6).shift([wx, top + 0.1, 0]))
    g.head_pt = np.array([hx, top + 0.1, 0])
    g.wood_pt = np.array([wx, top + 0.1, 0])
    g.center = np.array([0, top, 0])
    return g


def cobalt_paper(red=0.0, w=0.42, h=1.0, drop=False):
    g = VGroup(rr(w, h, mixc(COBALT, COBALT_R, red), 0, 0, stroke="#2B4F99", sw=2, r=0.02))
    g.add(rr(w + 0.12, 0.16, "#FFFFFF", 0, h * 0.18, stroke="#CFE3F0", sw=2, r=0.01, op=0.55))
    if drop:
        g.add(blob([(0, h / 2 + 0.45), (-0.09, h / 2 + 0.24), (0, h / 2 + 0.16), (0.09, h / 2 + 0.24)], "#7FB3D5"))
    return g


def lime_jar(cloudy=0.0, cap=True, s=1.0):
    """석회수 병. 밑 가운데 (0, 0)"""
    g = VGroup()
    liq = rr(0.62, 0.7, mixc(LIME, LIME_C, cloudy), 0, 0.38, stroke=None, sw=0, r=0.08)
    g.add(liq)
    if cloudy > 0.05:
        for k in range(10):
            g.add(Dot([-0.22 + (k % 5) * 0.11, 0.15 + (k // 5) * 0.25 + (k % 3) * 0.06, 0], radius=0.035,
                      color=PAPER).set_opacity(cloudy * 0.95))
    g.add(rr(0.72, 1.0, GLASS_F, 0, 0.52, stroke=GLASS, sw=4, r=0.12, op=0.25))
    g.add(rr(0.44, 0.16, GLASS_F, 0, 1.08, stroke=GLASS, sw=3, r=0.03, op=0.4))
    if cap:
        g.add(rr(0.5, 0.16, "#6E9BC0", 0, 1.22, stroke="#3F6E94", sw=2, r=0.04))
    return g.scale(s, about_point=ORIGIN)


def petri_dish(powder="#FFFFFF", drop=None, r=0.9):
    g = VGroup(E(2 * r, 0.75 * r, "#EEF4F7", 0, 0, stroke="#9FB3BF", sw=4),
               E(1.1 * r, 0.38 * r, powder, 0, 0.02, stroke="#E2E2E2", sw=2))
    if drop:
        g.add(E(0.62 * r, 0.22 * r, drop, 0, 0.03, stroke=None, sw=0, op=0.9))
    return g


# ══════════════ 정리 카드 ══════════════
def cond_chip(text, on=True, w=3.6, size=30):
    col = GREEN if on else "#A0A0A0"
    box = rr(w, 0.78, "#E6F6EE" if on else "#F2F2F2", 0, 0, stroke=col, sw=4, r=0.16)
    mk = T("○" if on else "×", size + 4, col if on else RED)
    t = T(text, size, col if on else "#999999")
    row = VGroup(mk, t).arrange(RIGHT, buff=0.18)
    if row.width > w - 0.3:
        row.scale_to_fit_width(w - 0.3)
    row.move_to(box)
    g = VGroup(box, row)
    g.box, g.mark, g.text = box, mk, t
    return g


def case_card(pic, title, lines, w=3.2, h=3.9, size=22, head=28, col=INK):
    box = rr(w, h, PAPER, 0, 0, stroke=SOFT, sw=4, r=0.18)
    fit(pic, w - 0.6, 1.35).move_to([0, h / 2 - 0.95, 0])
    tt = T(title, head, col)
    if tt.width > w - 0.25:
        tt.scale_to_fit_width(w - 0.25)
    tt.move_to([0, h / 2 - 1.95, 0])
    body = name_text(lines, size)
    if body.width > w - 0.3:
        body.scale_to_fit_width(w - 0.3)
    body.next_to(tt, DOWN, buff=0.2)
    g = VGroup(box, pic, tt, body)
    g.box, g.pic, g.title, g.body = box, pic, tt, body
    return g


# ══════════════ 생활 속 그림 ══════════════
def gas_stove(lit=True):
    g = VGroup(rr(2.0, 0.42, "#DADFE3", 0, 0.21, stroke=INK, sw=3, r=0.06),
               C(0.08, "#555555", -0.6, 0.21, stroke=None, sw=0), C(0.08, "#555555", 0.6, 0.21, stroke=None, sw=0),
               rr(1.2, 0.08, "#555555", 0, 0.5, stroke=None, sw=0))
    if lit:
        for x in (-0.3, -0.1, 0.1, 0.3):
            g.add(flame(0.32, "alcohol", glow=False).shift([x, 0.5, 0]))
    g.add(rr(1.0, 0.5, "#8A9AA6", 0, 1.05, stroke=INK, sw=3, r=0.08), L((0.5, 1.15), (0.95, 1.2), INK, 6))
    return g


def incinerator():
    g = VGroup(rr(1.8, 1.0, "#C9B9A0", 0, 0.5, stroke=INK, sw=3, r=0.04),
               rr(0.3, 1.2, "#8C867C", 0.55, 1.4, stroke=INK, sw=3, r=0.02),
               rr(0.6, 0.45, "#5A4A3A", -0.35, 0.32, stroke=INK, sw=2, r=0.04))
    g.add(flame(0.5, glow=False).shift([-0.35, 0.12, 0]))
    for k in range(3):
        g.add(Circle(radius=0.16 + 0.07 * k, fill_color="#8E8E8E", fill_opacity=0.6, stroke_width=0)
              .move_to([0.65 + 0.22 * k, 2.15 + 0.25 * k, 0]))
    return g


def gujeong(dry=False):
    """구상나무(바늘잎나무) — dry면 하얗게 말라 죽은 모습"""
    trunk = rr(0.14, 0.5, "#9C6B3C", 0, 0.25, stroke=INK, sw=2, r=0.02)
    col = "#D9D4C8" if dry else "#3F7A4A"
    st = "#9A8B7A" if dry else "#2F5A35"
    g = VGroup(trunk)
    for k, (wd, y) in enumerate(((1.1, 0.5), (0.85, 0.85), (0.6, 1.17))):
        g.add(Polygon([-wd / 2, y, 0], [wd / 2, y, 0], [0, y + 0.55, 0], fill_color=col, fill_opacity=1, stroke_color=st,
                      stroke_width=3))
    return g


def shell_pair():
    """튼튼한 껍데기와 얇아진(금 간) 껍데기"""
    a = VGroup(poly([(0, 0), (-0.55, 0.45), (-0.2, 0.75), (0.2, 0.75), (0.55, 0.45)], "#F0E0D0", "#B99577", 4))
    for x in (-0.25, 0, 0.25):
        a.add(L((0, 0.02), (x, 0.72), "#B99577", 2))
    b = a.copy().shift(RIGHT * 1.5)
    b[0].set_stroke(opacity=0.6).set_fill(opacity=0.55)
    b.add(VGroup(L((1.42, 0.62), (1.55, 0.45), RED, 3), L((1.55, 0.45), (1.47, 0.3), RED, 3)))
    return VGroup(a, b)


def polar_ice():
    ice = poly([(-0.9, 0), (0.9, 0), (1.05, 0.15), (-1.05, 0.15)], "#FFFFFF", "#BBCCDD", 3)
    sea = rr(2.8, 0.35, "#4A95C8", 0, -0.1, stroke=None, sw=0, r=0.02)
    body = E(0.95, 0.5, "#F6F3EA", 0, 0.42, stroke="#CFC8B8", sw=3)
    head = C(0.2, "#F6F3EA", 0.5, 0.55, stroke="#CFC8B8", sw=3)
    eye = Dot([0.56, 0.6, 0], radius=0.03, color=INK)
    return VGroup(sea, ice, body, head, eye)
