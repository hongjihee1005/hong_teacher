"""4-1 4단원 「다양한 생물과 우리 생활」 전용 그림 부품 (s4ep17~21, s4mm04)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 대략 (0, 0), 크기는 쓰는 쪽에서 fit()·scale().
  균류: mushroom(표고버섯) · mushroom_under(갓 안쪽 주름) · bread(mold) · mold_tuft(돋보기로 본 곰팡이)
        hyphae_view / mold_view(실체 현미경으로 본 모습, 원 안) · stereo_scope(실체 현미경, .parts 사전)
        log_mush(죽은 나무의 버섯) · moldy_fruit · moldy_leaf
  원생생물: spirogyra(해캄 가닥) · paramecium(짚신벌레) · stentor(나팔벌레) · pond(연못) · diving_beetle · water_hyacinth
        digital_scope(디지털 현미경 + 스마트 기기) · seaweed(미역) · laver(김)
  세균: coccus / bacillus / spirillum(공·막대·나선 모양 세균 무리) · bac_dot(번식 그림의 작은 세균)
  생활: cheese · jar(된장·간장) · kimchi · yogurt · red_sea(적조) · tooth(충치) · fish · o2_bubble
        pill_bottle · sprayer · bug · fuel_can · sewage · plastic_bottle · news_tv
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, VGroup, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK, SKIN
from kit_s3u12 import text_card, ox_mark, bin_box, slots  # noqa: F401
from kit_s3u24 import fit, E, C, L, R, P, S, eyes, smile, face  # noqa: F401

SW = 4
CAP = "#8B5A2B"
CAP_D = "#4A2E12"
STALK = "#F4EAD8"
STALK_D = "#BFAE8C"
BREAD = "#E8B46C"
BREAD_D = "#A9733F"
MOLD = "#9FB8A8"
MOLD_D = "#3F6B4C"
ALGA = "#5DBB4C"
ALGA_D = "#2E7A2A"
POND = "#BFE3F5"
POND_D = "#5AA9D6"
PARA = "#E7B7D2"     # 짚신벌레(염색한 표본 느낌의 분홍)
PARA_D = "#9A4A7A"
BAC_P = "#9B6BD6"    # 앱 세균 색
BAC_O = "#E2873A"
BAC_G = "#3FAE8A"
WOOD = "#8A5A2B"
WOOD_D = "#5A3A18"


def _rng(seed):
    return np.random.default_rng(seed)


# ══════════════ 균류 ══════════════
def mushroom(s=1.0, cap=CAP, edge=CAP_D, spots=True):
    """표고버섯 옆모습: 우산 같은 윗부분 + 막대 같은 아랫부분"""
    g = VGroup()
    g.add(R(0.34, 0.9, STALK, 0, -0.45, rad=0.12, stroke=STALK_D, sw=3))
    top = VMobject(fill_color=cap, fill_opacity=1, stroke_color=edge, stroke_width=SW)
    pts = [[-0.85, 0.0, 0], [-0.7, 0.42, 0], [0, 0.62, 0], [0.7, 0.42, 0], [0.85, 0.0, 0]]
    top.set_points_smoothly(pts)
    top.add_line_to(np.array([-0.85, 0.0, 0]))
    g.add(top)
    g.add(E(1.7, 0.16, "#D9C7A4", 0, 0.0, stroke=edge, sw=2))
    if spots:
        for (x, y) in [(-0.35, 0.36), (0.2, 0.45), (0.5, 0.25), (-0.6, 0.16)]:
            g.add(E(0.16, 0.08, "#F2E6CF", x, y, stroke=None, sw=0, op=0.9))
    g.scale(s)
    return g


def mushroom_under(r=1.0):
    """버섯 갓 안쪽(아래에서 본 모습): 주름이 많음"""
    g = VGroup(C(r, "#E9DCC2", stroke=CAP_D, sw=SW))
    for k in range(28):
        a = k * TAU / 28
        d = np.array([np.cos(a), np.sin(a), 0])
        g.add(Line(d * 0.28 * r, d * 0.95 * r, stroke_color="#A88F66", stroke_width=2.5))
    g.add(C(0.26 * r, STALK, stroke=STALK_D, sw=3))
    return g


def bread(mold=0.0, seed=2):
    """식빵 한 조각. mold 0~1: 곰팡이 자국 수"""
    g = VGroup()
    sh = VMobject(fill_color=BREAD, fill_opacity=1, stroke_color=BREAD_D, stroke_width=6)
    sh.set_points_as_corners([[-0.9, -0.95, 0], [-0.9, 0.35, 0]])
    sh.add_cubic_bezier_curve_to([-1.25, 0.5, 0], [-1.1, 1.05, 0], [-0.5, 1.0, 0])
    sh.add_cubic_bezier_curve_to([-0.2, 1.2, 0], [0.2, 1.2, 0], [0.5, 1.0, 0])
    sh.add_cubic_bezier_curve_to([1.1, 1.05, 0], [1.25, 0.5, 0], [0.9, 0.35, 0])
    sh.add_line_to(np.array([0.9, -0.95, 0]))
    sh.add_line_to(np.array([-0.9, -0.95, 0]))
    g.add(sh)
    g.add(R(1.55, 1.75, "#F6DFAE", 0, 0.0, rad=0.3, stroke=None, sw=0))
    spots = [(-0.35, 0.3, 0.2), (0.3, 0.55, 0.16), (0.1, -0.35, 0.22), (-0.45, -0.5, 0.13), (0.5, -0.05, 0.14),
             (-0.1, 0.7, 0.1), (0.55, -0.6, 0.11), (-0.55, 0.0, 0.1)]
    n = int(round(mold * len(spots)))
    sp = VGroup()
    for (x, y, r) in spots[:n]:
        sp.add(C(r, MOLD, x, y, stroke=None, sw=0))
        sp.add(C(r * 0.32, MOLD_D, x + r * 0.3, y - r * 0.2, stroke=None, sw=0))
    g.add(sp)
    g.spots = sp
    return g


def mold_tuft(w=2.4, n=26, seed=4, base=None):
    """돋보기로 본 곰팡이: 솜털 같은 가닥 끝에 둥근 알갱이"""
    rng = _rng(seed)
    g = VGroup()
    if base:
        g.add(R(w + 0.3, 0.3, base, 0, -0.75, rad=0.1, stroke=None, sw=0))
    for k in range(n):
        x = rng.uniform(-w / 2, w / 2)
        h = rng.uniform(0.6, 1.4)
        tip = np.array([x + rng.uniform(-0.15, 0.15), -0.6 + h, 0])
        g.add(S([(x, -0.6), (x + rng.uniform(-0.08, 0.08), -0.6 + h / 2), (tip[0], tip[1])], "#D8E6D4", 2.5))
        g.add(Dot(tip, radius=0.06, color=MOLD_D))
    return g


def scope_ring(r=1.6, bg="#F3ECDC"):
    """현미경으로 들여다본 동그란 화면(바탕 + 검은 테)"""
    return VGroup(C(r, bg, stroke=None, sw=0), Circle(radius=r, stroke_color="#222222", stroke_width=14))


def hyphae_view(r=1.6, seed=5, n=22):
    """실체 현미경으로 본 버섯의 균사: 실처럼 가늘고 긴 가닥이 거미줄처럼 엉켜 있음"""
    rng = _rng(seed)
    g = VGroup(C(r, "#F3ECDC", stroke=None, sw=0))
    for k in range(n):
        a = rng.uniform(0, TAU)
        p = np.array([np.cos(a), np.sin(a)]) * rng.uniform(0, r * 0.75)
        pts = [tuple(p)]
        for _ in range(4):
            p = p + rng.uniform(-0.55, 0.55, 2) * r / 1.6
            if np.linalg.norm(p) > r * 0.9:
                p = p * (r * 0.85 / np.linalg.norm(p))
            pts.append(tuple(p))
        g.add(S(pts, "#B8A27A", 7))
        g.add(S(pts, "#FFFDF6", 4))
    g.add(Circle(radius=r, stroke_color="#222222", stroke_width=14))
    return g


def mold_view(r=1.6, seed=6, n=16):
    """실체 현미경으로 본 곰팡이: 가늘고 긴 가닥 끝에 둥근 알갱이(포자가 든 주머니)"""
    rng = _rng(seed)
    g = VGroup(C(r, "#E8B46C", stroke=None, sw=0))
    for k in range(n):
        x = rng.uniform(-r * 0.75, r * 0.75)
        y0 = -np.sqrt(max(r * r - x * x, 0)) * 0.85
        h = rng.uniform(0.9, 2.0) * r / 1.6
        tx = x + rng.uniform(-0.25, 0.25)
        ty = min(y0 + h, np.sqrt(max(r * r - tx * tx, 0)) * 0.8)
        g.add(S([(x, y0), (x + rng.uniform(-0.12, 0.12), (y0 + ty) / 2), (tx, ty)], "#F2F6EE", 4))
        g.add(Dot([tx, ty, 0], radius=0.11 * r / 1.6, color="#2F5A3C").set_stroke("#1D3A26", 2))
    g.add(Circle(radius=r, stroke_color="#222222", stroke_width=14))
    return g


def stereo_scope(s=1.0):
    """실체 현미경(옆에서 본 단순한 그림). g.parts = {이름: 부분}"""
    g = VGroup()
    base = R(2.6, 0.45, "#E9EEF2", 0, -1.75, rad=0.12, sw=SW)
    pillar = R(0.42, 2.9, "#C9D2DA", 0.95, -0.15, rad=0.1, sw=SW)
    stage = R(1.9, 0.18, "#2B2B33", -0.15, -1.42, rad=0.04, sw=2)
    head = R(1.5, 0.75, "#E9EEF2", -0.05, 0.95, rad=0.15, sw=SW)
    turret = C(0.2, "#5E6A75", -0.05, 0.95, stroke=INK, sw=3)
    obj = R(0.5, 0.55, "#AEB7BF", -0.15, 0.32, rad=0.08, sw=SW)
    eye1 = R(0.26, 0.85, "#5E6A75", -0.4, 1.6, rad=0.06, sw=3).rotate(0.25)
    eye2 = R(0.26, 0.85, "#5E6A75", 0.15, 1.6, rad=0.06, sw=3).rotate(0.25)
    focus = C(0.28, "#5E6A75", 1.42, 0.3, stroke=INK, sw=3)
    light = C(0.18, "#F2B705", 0.9, -1.75, stroke=INK, sw=3)
    g.add(base, pillar, stage, obj, head, turret, eye1, eye2, focus, light)
    g.parts = {"eye": VGroup(eye1, eye2), "turret": turret, "obj": obj, "stage": stage, "focus": focus, "light": light}
    g.scale(s)
    return g


def log_mush(w=3.0):
    """쓰러진 죽은 나무와 버섯"""
    g = VGroup(R(w, 0.62, WOOD, 0, 0, rad=0.3, stroke=WOOD_D, sw=SW),
               E(0.5, 0.6, "#C79A62", w / 2 - 0.25, 0, stroke=WOOD_D, sw=3))
    for x, s_ in [(-0.8, 0.42), (-0.35, 0.32), (0.4, 0.38)]:
        m = mushroom(s_, spots=False)
        m.move_to([x, 0.3 + m.height / 2 - 0.05, 0])
        g.add(m)
    return g


def moldy_fruit(r=0.5):
    g = VGroup(C(r, "#E2573F", stroke="#8A1F19", sw=SW), L((0, r), (0.08, r + 0.22), WOOD_D, 5))
    for (x, y) in [(-0.2, 0.1), (0.15, -0.15), (0.1, 0.22)]:
        g.add(C(0.13 * r / 0.5, "#F2F2F2", x * r / 0.5, y * r / 0.5, stroke="#BBBBBB", sw=2))
    return g


def moldy_leaf(w=1.4, fill="#C9A24A", edge="#7A5A1A"):
    g = VGroup(E(w, w * 0.5, fill, stroke=edge, sw=SW), L((-w / 2, 0), (w / 2, 0), edge, 3))
    for (x, y) in [(-0.2, 0.08), (0.25, -0.07), (0.05, -0.1)]:
        g.add(C(0.08, "#F2F2F2", x * w / 1.4, y * w / 1.4, stroke="#BBBBBB", sw=2))
    return g


# ══════════════ 원생생물 ══════════════
def spirogyra(length=4.0, w=0.42, cells=4, spiral=True, col=ALGA, edge=ALGA_D):
    """해캄 한 가닥: 초록색 실처럼 가는 가닥, 대나무처럼 마디, 안에 나선 모양 띠와 둥근 알갱이"""
    g = VGroup(R(length, w, "#DFF2D6", 0, 0, rad=w / 2, stroke=edge, sw=3))
    seg = length / cells
    for k in range(1, cells):
        x = -length / 2 + k * seg
        g.add(L((x, -w / 2), (x, w / 2), edge, 3))
    if spiral:
        xs = np.linspace(-length / 2 + 0.08, length / 2 - 0.08, 120)
        band = VMobject(stroke_color=col, stroke_width=5)
        band.set_points_smoothly([[x, 0.34 * w * np.sin((x + length / 2) / seg * 2.5 * TAU), 0] for x in xs])
        g.add(band)
        for k in range(cells):
            cx = -length / 2 + (k + 0.5) * seg
            g.add(Dot([cx, 0, 0], radius=w * 0.13, color=edge))
    return g


def paramecium(s=1.0, col=PARA, edge=PARA_D, cilia=True):
    """짚신벌레: 길쭉한 둥근 모양, 바깥쪽에 가는 털, 몸 안쪽에 여러 가지 모양"""
    g = VGroup()
    body = VMobject(fill_color=col, fill_opacity=1, stroke_color=edge, stroke_width=SW)
    pts = [[-1.2, 0.0], [-1.0, 0.42], [-0.3, 0.5], [0.3, 0.35], [0.9, 0.45], [1.2, 0.1], [1.1, -0.35],
           [0.4, -0.48], [-0.4, -0.42], [-1.05, -0.38], [-1.2, 0.0]]
    body.set_points_smoothly([[x, y, 0] for x, y in pts])
    if cilia:
        cl = VGroup()
        n = 60
        for k in range(n):
            p = body.point_from_proportion(k / n)
            q = body.point_from_proportion((k + 0.5) / n)
            t = q - p
            nrm = np.array([t[1], -t[0], 0])
            nrm = nrm / (np.linalg.norm(nrm) + 1e-6)
            cl.add(Line(p, p + nrm * 0.14, stroke_color=edge, stroke_width=2))
        g.add(cl)
    g.add(body)
    g.add(E(0.55, 0.3, "#C77FAE", -0.15, 0.02, stroke=edge, sw=2))
    for (x, y, r) in [(0.6, 0.12, 0.1), (-0.75, 0.15, 0.09), (0.35, -0.22, 0.07), (-0.55, -0.2, 0.07)]:
        g.add(C(r, "#F7E3EF", x, y, stroke=edge, sw=2))
    g.scale(s)
    return g


def stentor(h=2.0, col="#6FB7D9", edge="#2F6F95"):
    """나팔벌레: 몸이 나팔처럼 생김"""
    g = VGroup()
    body = VMobject(fill_color=col, fill_opacity=1, stroke_color=edge, stroke_width=SW)
    body.start_new_path(np.array([-0.08, -1.0, 0]))
    body.add_cubic_bezier_curve_to([-0.1, -0.2, 0], [-0.5, 0.5, 0], [-0.8, 0.85, 0])
    body.add_cubic_bezier_curve_to([-0.3, 1.05, 0], [0.3, 1.05, 0], [0.8, 0.85, 0])
    body.add_cubic_bezier_curve_to([0.5, 0.5, 0], [0.1, -0.2, 0], [0.08, -1.0, 0])
    body.add_line_to(np.array([-0.08, -1.0, 0]))
    g.add(body, E(1.5, 0.3, "#A9D8EE", 0, 0.9, stroke=edge, sw=3))
    g.scale(h / 2.1)
    return g


def diving_beetle(s=1.0):
    g = VGroup()
    for sx in (-1, 1):
        for y in (-0.15, 0.1):
            g.add(L((0, y), (sx * 0.6, y - 0.18), INK, 4))
    g.add(E(0.8, 1.1, "#3B4A2A", 0, 0, stroke=INK, sw=3), E(0.4, 0.28, "#3B4A2A", 0, 0.62, stroke=INK, sw=3),
          L((0, 0.5), (0, -0.5), "#C9A24A", 3))
    g.scale(s)
    return g


def water_hyacinth(s=1.0):
    """부레옥잠: 물 위에 떠 있는 잎과 볼록한 잎자루, 보라 꽃"""
    g = VGroup()
    for x in (-0.45, 0.45):
        g.add(E(0.4, 0.5, "#7CC766", x * 0.7, -0.1, stroke="#2F6B2A", sw=3))
    for a in (-0.5, 0, 0.5):
        lf = E(0.55, 0.75, "#5DBB4C", 0, 0, stroke="#2F6B2A", sw=3).rotate(a).move_to([a * 0.9, 0.45, 0])
        g.add(lf)
    g.add(C(0.15, "#B58AD8", 0, 0.95, stroke="#6A3D9A", sw=3))
    g.scale(s)
    return g


def pond(w=12.0, h=3.4):
    """연못: 물과 둑, 갈대"""
    g = VGroup(R(w, h, POND, 0, 0, rad=0.4, stroke=POND_D, sw=SW, op=0.85))
    for x in (-w / 2 + 0.5, -w / 2 + 0.8, w / 2 - 0.6):
        g.add(L((x, h / 2 - 0.2), (x + 0.1, h / 2 + 0.9), "#4B8A37", 6))
        g.add(E(0.14, 0.5, "#8B5A2B", x + 0.1, h / 2 + 0.9, stroke=None, sw=0))
    return g


def digital_scope(s=1.0, screen=None):
    """디지털 현미경 + 스마트 기기(선으로 연결)"""
    g = VGroup()
    body = VGroup(R(0.55, 1.6, "#E9EEF2", -1.6, 0.1, rad=0.25, sw=SW), R(0.4, 0.3, "#5E6A75", -1.6, -0.75, rad=0.06, sw=3),
                  R(1.4, 0.2, "#C9D2DA", -1.6, -1.1, rad=0.05, sw=3), C(0.12, "#5E6A75", -1.6, 0.4, stroke=INK, sw=2))
    cable = S([(-1.6, 0.9), (-1.2, 1.3), (-0.4, 1.0), (0.1, 0.6)], "#5E6A75", 4)
    tab = R(2.3, 1.6, "#2A2A2A", 1.3, 0.0, rad=0.15, sw=SW)
    scr = R(2.0, 1.3, "#EEF7EE" if screen else "#111111", 1.3, 0.0, rad=0.05, stroke=None, sw=0)
    g.add(cable, body, tab, scr)
    g.screen = scr
    g.scale(s)
    return g


def seaweed(h=1.8, col="#6B4A2A"):
    """미역(바다에 사는 원생생물)"""
    g = VGroup()
    for k, x in enumerate((-0.35, 0.0, 0.35)):
        b = VMobject(fill_color=col, fill_opacity=1, stroke_color="#3E2A14", stroke_width=3)
        hh = h * (0.85 + 0.15 * (k % 2))
        b.set_points_smoothly([[x, -h / 2, 0], [x - 0.18, -h / 2 + hh * 0.3, 0], [x + 0.15, -h / 2 + hh * 0.65, 0],
                               [x, -h / 2 + hh, 0], [x + 0.08, -h / 2 + hh * 0.6, 0], [x - 0.05, -h / 2 + hh * 0.3, 0],
                               [x + 0.06, -h / 2, 0]])
        g.add(b)
    return g


def laver(w=1.4):
    """김 한 장"""
    g = VGroup(R(w, w * 0.85, "#1E2A1E", rad=0.06, stroke="#0F150F", sw=3))
    for k in range(4):
        g.add(L((-w / 2 + 0.1, -0.25 + k * 0.17), (w / 2 - 0.1, -0.22 + k * 0.17), "#33482F", 2))
    return g


# ══════════════ 세균 ══════════════
def _coccus(r=0.13, col=BAC_P):
    return C(r, col, stroke=INK, sw=2.5)


def coccus(n=9, col=BAC_P, r=0.16, seed=1, lump=True):
    """공 모양 세균 무리(뭉쳐 있음)"""
    g = VGroup()
    for k in range(n):
        a, d = k * 2.4, np.sqrt(k) * r * 1.6 if lump else k * r * 2.1
        pos = [np.cos(a) * d, np.sin(a) * d, 0] if lump else [d - n * r, 0, 0]
        g.add(_coccus(r, col).move_to(pos))
    g.move_to(ORIGIN)
    return g


def bacillus(n=3, col=BAC_G, w=0.75, h=0.24, seed=2):
    """막대 모양 세균"""
    rng = _rng(seed)
    g = VGroup()
    for k in range(n):
        b = R(w, h, col, rad=h / 2, sw=2.5).rotate(rng.uniform(-0.6, 0.6))
        b.move_to([(k - (n - 1) / 2) * w * 0.95, rng.uniform(-0.25, 0.25), 0])
        g.add(b)
    g.move_to(ORIGIN)
    return g


def spirillum(n=2, col=BAC_O, length=1.2, amp=0.12, seed=3):
    """나선 모양 세균(꼬불꼬불)"""
    g = VGroup()
    for k in range(n):
        xs = np.linspace(-length / 2, length / 2, 40)
        m = VMobject(stroke_color=INK, stroke_width=9)
        m.set_points_smoothly([[x, amp * np.sin((x + length / 2) / length * 3 * TAU), 0] for x in xs])
        m2 = m.copy().set_stroke(col, 6)
        grp = VGroup(m, m2).rotate(0.3 * (k - 0.5)).move_to([0, (k - (n - 1) / 2) * 0.45, 0])
        g.add(grp)
    return g


def bac_dot(r=0.09, col=BAC_P):
    return Dot(radius=r, color=col).set_stroke(INK, 1.5)


# ══════════════ 생활 속 ══════════════
def cheese(w=1.6):
    g = VGroup(P([(-w / 2, -0.35), (w / 2, -0.35), (w / 2, 0.15), (-w / 2, 0.45)], "#F7D774", stroke="#C9A12A"))
    g.add(P([(-w / 2, 0.45), (w / 2, 0.15), (w / 2 - 0.2, 0.25), (-w / 2 + 0.05, 0.6)], "#FBE7A0", stroke="#C9A12A", sw=3))
    for (x, y, r) in [(-0.35, 0.0, 0.1), (0.25, -0.1, 0.08), (0.45, 0.05, 0.06)]:
        g.add(C(r * w / 1.6, "#E9C35A", x * w / 1.6, y, stroke=None, sw=0))
    for (x, y) in [(-0.5, 0.15), (0.0, -0.18), (0.3, 0.12)]:
        g.add(S([(x * w / 1.6, y), (x * w / 1.6 + 0.08, y + 0.05), (x * w / 1.6 + 0.15, y - 0.02)], "#5F8FA0", 3))
    return g


def jar(label="된장", col="#A0522D"):
    g = VGroup(R(1.1, 1.2, col, 0, -0.1, rad=0.25, sw=SW), R(0.8, 0.22, "#6B3A1A", 0, 0.6, rad=0.06, sw=3))
    t = T(label, 26, PAPER).move_to([0, -0.1, 0])
    if t.width > 0.95:
        t.scale_to_fit_width(0.95)
    g.add(t)
    return g


def kimchi():
    g = VGroup(R(1.5, 1.1, "#CFE3EF", 0, 0, rad=0.2, stroke="#7AA7BD", sw=SW, op=0.9))
    g.add(P([(-0.65, 0.05), (-0.2, 0.25), (0.25, 0.1), (0.65, 0.2), (0.65, -0.48), (-0.65, -0.48)], "#E2573F", stroke=None, sw=0))
    g.add(R(1.6, 0.2, "#7AA7BD", 0, 0.62, rad=0.06, sw=3))
    return g


def yogurt():
    g = VGroup(P([(-0.45, 0.5), (0.45, 0.5), (0.35, -0.55), (-0.35, -0.55)], "#FFFFFF", stroke="#9AA6B0"),
               E(0.95, 0.18, "#F4A7C0", 0, 0.52, stroke="#C2667F", sw=3), R(0.65, 0.3, "#F4A7C0", 0, -0.05, rad=0.06, stroke=None, sw=0))
    return g


def red_sea(w=2.6, h=1.3):
    g = VGroup()
    sea = VMobject(fill_color="#B8453A", fill_opacity=1, stroke_color="#7A231C", stroke_width=SW)
    xs = np.linspace(-w / 2, w / 2, 30)
    sea.set_points_as_corners([[-w / 2, -h / 2, 0]] + [[x, h / 2 - 0.4 + 0.08 * np.sin(x * 5), 0] for x in xs] + [[w / 2, -h / 2, 0], [-w / 2, -h / 2, 0]])
    g.add(sea)
    f = fish(0.7, "#DDDDDD").rotate(PI).move_to([0.3, -0.2, 0])
    g.add(f)
    return g


def tooth(cavity=True):
    g = VGroup()
    t = VMobject(fill_color="#FFFFFF", fill_opacity=1, stroke_color="#999999", stroke_width=SW)
    t.set_points_smoothly([[-0.55, 0.5, 0], [0, 0.65, 0], [0.55, 0.5, 0], [0.5, -0.1, 0], [0.32, -0.8, 0], [0.12, -0.25, 0],
                           [-0.12, -0.25, 0], [-0.32, -0.8, 0], [-0.5, -0.1, 0], [-0.55, 0.5, 0]])
    g.add(t)
    if cavity:
        g.add(C(0.14, "#5A3A2A", 0.12, 0.3, stroke=None, sw=0))
    return g


def fish(w=1.4, col="#7CC0E0"):
    g = VGroup(E(w, w * 0.5, col, 0, 0, stroke=INK, sw=3),
               P([(w / 2 - 0.05, 0), (w / 2 + 0.35 * w / 1.4, 0.25 * w / 1.4), (w / 2 + 0.35 * w / 1.4, -0.25 * w / 1.4)], col, sw=3),
               Dot([-w * 0.28, w * 0.06, 0], radius=0.05 * w / 1.4, color=INK))
    return g


def o2_bubble(r=0.55):
    return VGroup(C(r, "#BFE6FB", stroke="#1C6FA8", sw=SW), M('<span foreground="#1C6FA8">산소</span>', 26).move_to(ORIGIN))


def pill_bottle():
    g = VGroup(R(0.9, 1.2, "#F2B705", 0, -0.1, rad=0.12, stroke="#9A7400", sw=SW, op=0.85),
               R(1.0, 0.3, PAPER, 0, 0.62, rad=0.06, sw=3), R(0.7, 0.45, PAPER, 0, -0.1, rad=0.05, stroke=None, sw=0),
               L((-0.12, -0.1), (0.12, -0.1), RED, 5), L((0, -0.22), (0, 0.02), RED, 5))
    for x in (0.75, 0.95):
        g.add(R(0.28, 0.14, "#FFFFFF", x, -0.6, rad=0.07, stroke="#999999", sw=2))
    return g


def sprayer():
    g = VGroup(R(0.8, 1.1, "#5DBB4C", 0, -0.2, rad=0.2, stroke="#2E7A2A", sw=SW), R(0.25, 0.3, "#2E7A2A", 0, 0.5, rad=0.05, sw=2),
               L((0.1, 0.6), (0.75, 0.75), INK, 5))
    for k in range(5):
        g.add(Dot([0.95 + k * 0.08, 0.8 + (k % 2) * 0.07 - 0.05, 0], radius=0.035, color=BLUE))
    return g


def bug(s=1.0, col="#6B8E23"):
    """작은 곤충(해충)"""
    g = VGroup()
    for y in (-0.12, 0.0, 0.12):
        for sx in (-1, 1):
            g.add(L((0, y), (sx * 0.32, y - 0.08), INK, 3))
    g.add(E(0.32, 0.5, col, 0, -0.02, stroke=INK, sw=3), C(0.12, col, 0, 0.3, stroke=INK, sw=3),
          L((-0.04, 0.4), (-0.15, 0.55), INK, 2), L((0.04, 0.4), (0.15, 0.55), INK, 2))
    g.scale(s)
    return g


def fuel_can():
    g = VGroup(R(1.0, 1.25, "#E2573F", 0, -0.1, rad=0.12, stroke="#8A1F19", sw=SW),
               R(0.3, 0.25, "#8A1F19", -0.25, 0.62, rad=0.04, sw=2),
               P([(0.0, 0.25), (0.25, -0.05), (-0.25, -0.05)], "#F2B705", stroke=None, sw=0),
               C(0.12, "#F2B705", 0, -0.12, stroke=None, sw=0))
    return g


def sewage():
    """하수 처리장(둥근 물탱크 둘)"""
    g = VGroup(R(3.0, 0.4, "#B8C4CC", 0, -0.6, rad=0.06, stroke="#6A7A84", sw=SW))
    for x, col in [(-0.75, "#7A6A3A"), (0.75, "#7FC6E8")]:
        g.add(E(1.2, 0.5, col, x, -0.3, stroke="#6A7A84", sw=SW))
    g.add(L((-0.1, -0.3), (0.1, -0.3), "#6A7A84", 6))
    return g


def plastic_bottle():
    g = VGroup(R(0.7, 1.3, "#BFE3F5", 0, -0.15, rad=0.2, stroke="#5AA9D6", sw=SW, op=0.85),
               R(0.3, 0.3, "#5AA9D6", 0, 0.65, rad=0.05, sw=3), L((-0.35, 0.05), (0.35, 0.05), "#5AA9D6", 3))
    return g


def news_tv(w=4.2, h=2.6):
    g = VGroup(R(w, h, "#2A2A2A", rad=0.2, sw=SW), R(w - 0.35, h - 0.35, "#EAF4FB", rad=0.08, stroke=None, sw=0),
               L((-0.5, -h / 2), (-0.8, -h / 2 - 0.4), INK, 5), L((0.5, -h / 2), (0.8, -h / 2 - 0.4), INK, 5))
    tag_ = R(1.5, 0.42, RED, -w / 2 + 1.05, h / 2 - 0.42, rad=0.08, stroke=None, sw=0)
    g.add(tag_, T("과학 뉴스", 24, PAPER).move_to(tag_))
    return g


# ══════════════ 세균이 사는 곳(u4-3) ══════════════
def phone():
    return VGroup(R(0.8, 1.5, "#2A2F3A", rad=0.12, sw=SW), R(0.64, 1.15, "#9ED3EE", 0, 0.03, rad=0.04, stroke=None, sw=0),
                  C(0.06, "#5E6A75", 0, -0.66, stroke=None, sw=0))


def belly():
    """사람 몸(배) 안의 장 — 꼬불꼬불한 관"""
    g = VGroup(E(1.7, 2.0, SKIN, 0, 0, stroke="#C99A6B", sw=SW))
    xs = np.linspace(-0.5, 0.5, 60)
    for k, y in enumerate((0.35, 0.0, -0.35)):
        g.add(S([(x, y + 0.1 * np.sin((x + 0.5) * 3 * TAU)) for x in xs], "#E88B8B", 9))
    return g


def soil_pile():
    g = VGroup(P([(-1.0, -0.4), (1.0, -0.4), (0.6, 0.2), (0.0, 0.4), (-0.6, 0.2)], "#8B6B4A", stroke="#5A3A18"))
    for (x, y) in [(-0.4, -0.1), (0.2, 0.05), (0.5, -0.2), (-0.1, -0.25)]:
        g.add(C(0.05, "#5A3A18", x, y, stroke=None, sw=0))
    g.add(L((0.05, 0.35), (0.05, 0.75), "#4B8A37", 5), E(0.3, 0.14, "#5DBB4C", 0.2, 0.68, stroke=None, sw=0))
    return g


def water_cup():
    return VGroup(P([(-0.45, 0.6), (0.45, 0.6), (0.35, -0.6), (-0.35, -0.6)], "#E9F6FC", stroke="#5AA9D6"),
                  P([(-0.41, 0.25), (0.41, 0.25), (0.35, -0.6), (-0.35, -0.6)], "#9ED3EE", stroke=None, sw=0))


def keyboard():
    g = VGroup(R(2.0, 0.8, "#D6DBE0", rad=0.08, sw=SW))
    for r_ in range(3):
        for c in range(7):
            g.add(R(0.2, 0.16, PAPER, -0.75 + c * 0.25, 0.22 - r_ * 0.22, rad=0.03, stroke="#8D96A0", sw=1.5))
    return g


def toilet():
    return VGroup(R(0.9, 0.9, PAPER, 0, 0.55, rad=0.08, stroke="#8D96A0", sw=SW),
                  E(1.4, 0.45, PAPER, 0, 0.0, stroke="#8D96A0", sw=SW),
                  P([(-0.5, -0.05), (0.5, -0.05), (0.3, -0.75), (-0.3, -0.75)], PAPER, stroke="#8D96A0"))


def strand_in_circle(r, off=0.0, w=0.5, ang=0.0, seg=1.2, spiral=True, dots=True, phase=0.0,
                     col=ALGA, edge=ALGA_D, fill="#DFF2D6"):
    """현미경 화면(반지름 r, 가운데 0,0) 안에서 잘린 해캄 가닥 하나 — 화면 밖으로 삐져나오지 않게 원으로 자름"""
    from manim import Intersection
    u = np.array([np.cos(ang), np.sin(ang), 0])
    n = np.array([-np.sin(ang), np.cos(ang), 0])
    c0 = n * off
    rect = Rectangle(width=4 * r, height=w).rotate(ang).move_to(c0)
    body = Intersection(rect, Circle(radius=r * 0.985), fill_color=fill, fill_opacity=1, stroke_color=edge, stroke_width=3)
    g = VGroup(body)
    hl = np.sqrt(max(r * r - off * off, 0))
    k0 = int(np.floor(-hl / seg)) - 1
    for k in range(k0, int(np.ceil(hl / seg)) + 2):
        t = k * seg + phase
        a, b = c0 + u * t + n * w / 2, c0 + u * t - n * w / 2
        if np.linalg.norm(a) < r * 0.97 and np.linalg.norm(b) < r * 0.97:
            g.add(Line(a, b, stroke_color=edge, stroke_width=3))
        mid = c0 + u * (t + seg / 2)
        if dots and np.linalg.norm(mid) < r * 0.9:
            g.add(Dot(mid, radius=w * 0.11, color=edge))
    if spiral:
        ts = np.linspace(-hl, hl, 200)
        pts = [c0 + u * t + n * (0.33 * w * np.sin((t - phase) / seg * 2.5 * TAU)) for t in ts]
        pts = [p for p in pts if np.linalg.norm(p) < r * 0.96]
        if len(pts) > 3:
            band = VMobject(stroke_color=col, stroke_width=max(2, 5 * w / 0.5))
            band.set_points_smoothly(pts)
            g.add(band)
    return g
