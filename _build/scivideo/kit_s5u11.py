"""5-1 1단원 「지층과 화석」 전용 그림 부품 (s5ep01~06, s5mm01)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 (0, 0).
  지층: strata(kind='flat'|'fold'|'fault', layers, w, h) — .lines(층 경계선, '유성펜 선 긋기'용)
        rainbow_cake(무지개떡) · stone_tower(돌탑) · sandwich · books · quilts
  지층 모형: tank(투명한 사각 통 + 물) · tank_layer(통 바닥에 쌓인 층) · mat_cup(자갈과 모래·모래·진흙 컵)
  실제 지층: earth_section(stage) — 강이 실어 온 퇴적물이 바다 밑에 쌓임 → 눌림 → 굳음 → 드러나 깎임
  퇴적암: grains(p_press, glue)(퇴적물 알갱이 크게 본 그림) · sed_rock(mud|sand|gravel) · zoom_rock · gangjeong(강정)
  화석: fossil(kind) — trilobite fern fish ammonite ginkgo bird_foot dino_foot dino_bone dung egg coral pinecone
        slab(kind)(돌판 위의 화석) · dig_site(흙더미 속 공룡 뼈)
  화석 모형: clay_tray(stage) · hand_dough
  화석 만들어지기: fossil_section(stage)
  화석의 비밀: trackway(공룡 발자국 길) · warm_sea(따뜻하고 얕은 바다) · humid_land(따뜻하고 습한 육지)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, DashedVMobject, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup, VMobject, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED, BROWN, BROWN_DARK, SKIN
from kit_s3u12 import fit, text_card, ox_mark, bin_box  # noqa: F401
from kit_s3u22 import P, S, E, L, cloud, sun_s, SEA, SEA_D, SEA_L, SKY  # noqa: F401

SW = 4
GRAVEL = "#A39A8E"
GRAVEL_D = "#6E665C"
SAND = "#E6C47E"
SAND_D = "#B8924A"
MUD = "#9C7B5C"
MUD_D = "#6E5440"
CLAY = "#B98A5E"
PLASTER = "#F4F2EC"
STONE = "#CDBFA6"
STONE_D = "#8E7F66"
BONE = "#F1E6CC"
WATER = "#BFE3F5"
WATER_D = "#5DA9E0"
LAYER_COLS = ["#C9A26B", "#8E8478", "#E3C78F", "#A7765A", "#D8BE96", "#7C6F63", "#C79870"]


def rnd(i, k):
    x = np.sin(i * 127.1 + k * 311.7) * 43758.5453
    return x - np.floor(x)


def rect(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0, r=0.0):
    if r:
        m = RoundedRectangle(corner_radius=r, width=w, height=h, fill_color=fill, fill_opacity=op,
                             stroke_color=stroke, stroke_width=sw)
    else:
        m = Rectangle(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)
    return m.move_to([x, y, 0])


def label(text, col=INK, size=28, fill=PAPER):
    t = T(text, size, col)
    r = RoundedRectangle(corner_radius=0.08, width=t.width + 0.3, height=t.height + 0.22, fill_color=fill,
                         fill_opacity=1, stroke_color=col, stroke_width=3)
    t.move_to(r)
    return VGroup(r, t)


def texture(x0, x1, y0, y1, tex, seed=0):
    """네모 칸 안의 알갱이 무늬: gravel(큰 동그라미) · sand(작은 점) · mud(짧은 가는 줄)"""
    g = VGroup()
    w, h = x1 - x0, y1 - y0
    if tex == "gravel":
        n = int(w * h * 5) + 2
        for i in range(n):
            r = 0.07 + 0.08 * rnd(i, seed)
            x = x0 + r + (w - 2 * r) * rnd(i, seed + 1)
            y = y0 + r + (h - 2 * r) * rnd(i, seed + 2)
            if h > 2 * r:
                g.add(Ellipse(width=2 * r * 1.25, height=2 * r, fill_color=GRAVEL, fill_opacity=1,
                              stroke_color=GRAVEL_D, stroke_width=2).move_to([x, y, 0]))
    elif tex == "sand":
        n = int(w * h * 26) + 2
        for i in range(n):
            g.add(Dot([x0 + 0.05 + (w - 0.1) * rnd(i, seed + 3), y0 + 0.04 + (h - 0.08) * rnd(i, seed + 4), 0],
                      radius=0.022, color=SAND_D))
    elif tex == "mud":
        n = int(w * h * 3) + 1
        for i in range(n):
            x = x0 + 0.15 + (w - 0.45) * rnd(i, seed + 5)
            y = y0 + 0.08 + (h - 0.16) * rnd(i, seed + 6)
            g.add(Line([x, y, 0], [x + 0.28, y, 0], stroke_color=MUD_D, stroke_width=2, stroke_opacity=0.6))
    return g


# ══════════════ 지층 ══════════════
def strata(kind="flat", layers=None, w=5.0, h=3.2, amp=0.75, shift=0.7, tex=False, seed=0):
    """지층 단면. layers = [(색, 두께 비율, 무늬)…] 아래층부터. kind: flat 수평 · fold 휘어진 · fault 끊어진
    돌려주는 VGroup: [층들, 테두리] + .lines(경계선 VGroup, 위로 갈수록 나중)"""
    if layers is None:
        layers = [(LAYER_COLS[i % len(LAYER_COLS)], [1.0, 0.6, 1.3, 0.8, 1.1, 0.7][i % 6], None) for i in range(6)]
    tot = sum(t for _, t, _ in layers)
    hs = [t / tot * h for _, t, _ in layers]
    x0, x1, yb, yt = -w / 2, w / 2, -h / 2, h / 2
    body = VGroup()
    lines = VGroup()
    xs = np.linspace(x0, x1, 61)
    cum = [yb]
    for hh in hs:
        cum.append(cum[-1] + hh)

    if kind == "flat":
        for i, (col, _, tx) in enumerate(layers):
            body.add(rect(w, hs[i], col, x=0, y=(cum[i] + cum[i + 1]) / 2, stroke=col, sw=1))
            if tex and tx:
                body.add(texture(x0, x1, cum[i], cum[i + 1], tx, seed + i * 7))
        for c in cum[1:-1]:
            lines.add(Line([x0, c, 0], [x1, c, 0], stroke_color=INK, stroke_width=3))
    elif kind == "fold":
        def f(x):
            return amp * np.cos(np.pi * x / (w * 0.62))
        def bnd(c):
            return [min(yt, max(yb, c + f(x) - amp * 0.4)) for x in xs]
        # 아래쪽은 휘어진 층이 화면 밖까지 이어지므로 경계를 넉넉하게
        cs = [yb - amp] + [yb + (cum[i] - yb) * 1.0 for i in range(1, len(cum) - 1)] + [yt + amp * 2]
        for i, (col, _, _) in enumerate(layers):
            lo, hi = bnd(cs[i]), bnd(cs[i + 1])
            pts = [[x, y, 0] for x, y in zip(xs, lo)] + [[x, y, 0] for x, y in zip(xs[::-1], hi[::-1])]
            body.add(Polygon(*pts, fill_color=col, fill_opacity=1, stroke_color=col, stroke_width=1))
        for c in cs[1:-1]:
            m = VMobject(stroke_color=INK, stroke_width=3)
            m.set_points_smoothly([[x, y, 0] for x, y in zip(xs, bnd(c))])
            lines.add(m)
    else:  # fault
        xm, k = 0.25, 0.32           # 끊어진 선 x = xm + k*y (아래로 갈수록 왼쪽)
        def xf(y):
            return xm + k * y
        for i, (col, _, _) in enumerate(layers):
            a, b = cum[i], cum[i + 1]
            # 왼쪽 그대로
            body.add(Polygon([x0, a, 0], [xf(a), a, 0], [xf(b), b, 0], [x0, b, 0],
                             fill_color=col, fill_opacity=1, stroke_color=col, stroke_width=1))
            # 오른쪽은 shift만큼 내려감(맨 위층은 위로 늘림, 맨 아래층은 아래 끝까지)
            ra = max(yb, a - shift) if i > 0 else yb
            rb = min(yt, b - shift) if i < len(layers) - 1 else yt
            if rb - ra < 0.01:
                continue
            body.add(Polygon([xf(ra), ra, 0], [x1, ra, 0], [x1, rb, 0], [xf(rb), rb, 0],
                             fill_color=col, fill_opacity=1, stroke_color=col, stroke_width=1))
        for c in cum[1:-1]:
            lines.add(Line([x0, c, 0], [xf(c), c, 0], stroke_color=INK, stroke_width=3))
            if c - shift > yb:
                lines.add(Line([xf(c - shift), c - shift, 0], [x1, c - shift, 0], stroke_color=INK, stroke_width=3))
        body.add(Line([xf(yb), yb, 0], [xf(yt), yt, 0], stroke_color="#5B3A1E", stroke_width=6))
    frame = Rectangle(width=w, height=h, stroke_color=INK, stroke_width=SW)
    lines.set_stroke(opacity=0)          # 보이지 않게 함께 움직임 — 선 긋기는 pen_lines(g)
    g = VGroup(body, lines, frame)
    g.lines = lines
    g.layer_ys = cum
    return g


def pen_lines(s, col=None, sw=5):
    """지층 경계선을 따라 긋는 유성펜 선(복사본)"""
    return s.lines.copy().set_stroke(color=col or RED, width=sw, opacity=1)


def card(kind, w=3.6, h=2.4, title=None, size=26, seed=0, var=0):
    """지층 카드(사진 대신 그림) + 아래 이름"""
    pal = {"flat": [("#C9A26B", 1.0), ("#8E8478", 0.5), ("#E3C78F", 1.2), ("#6E6258", 0.4), ("#D8BE96", 0.9), ("#A7765A", 0.7)],
           "fold": [("#B9B3A6", 0.8), ("#7C6F63", 0.6), ("#D9C9A3", 0.9), ("#9A8670", 0.7), ("#C7B48F", 0.8), ("#6F655B", 0.6)],
           "fault": [("#B98A5E", 0.9), ("#E1C795", 0.7), ("#7E6A57", 0.6), ("#D2AE7A", 1.0), ("#9B8C7A", 0.6), ("#C99D6E", 0.8)]}
    lay = pal[kind][var:] + pal[kind][:var]
    if var:
        lay = [(c, t * (0.7 + 0.6 * rnd(i, var))) for i, (c, t) in enumerate(lay)]
    s = strata(kind, [(c, t, None) for c, t in lay], w=w, h=h, amp=0.45 * (1 + 0.3 * var), shift=0.42 + 0.1 * var, seed=seed)
    g = VGroup(s)
    g.strata = s
    if title:
        t = T(title, size).next_to(s, DOWN, buff=0.15)
        g.add(t)
        g.title = t
    return g


def rainbow_cake(w=3.6, cols=("#F6B4C3", "#FFE08A", "#B9E4A0", "#A9D3F2", "#D4B8EE", "#FFFFFF")):
    g = VGroup()
    hs = [0.42, 0.34, 0.46, 0.38, 0.42, 0.36]
    y = 0.0
    for c, hh in zip(cols, hs):
        g.add(rect(w, hh, c, y=y + hh / 2, stroke=INK, sw=3, r=0.05))
        y += hh
    plate = E(w * 1.25, 0.4, "#FFFFFF", y=-0.05, stroke=SOFT, sw=3)
    g = VGroup(plate, g)
    return g.move_to(ORIGIN)


def stone_tower(n=5, w=2.2):
    g = VGroup()
    y = 0.0
    cols = ["#9A9088", "#B0A79E", "#8E857C", "#A89F95", "#BFB7AE", "#958C83"]
    for i in range(n):
        ww = w * (1 - i * 0.14)
        hh = 0.5 - i * 0.03
        g.add(E(ww, hh, cols[i % 6], y=y + hh / 2, stroke=INK, sw=4))
        y += hh * 0.92
    return g.move_to(ORIGIN)


def sandwich(w=2.2):
    cols = [("#E8C27F", 0.28), ("#7BBF5E", 0.14), ("#E8524A", 0.14), ("#F8E27A", 0.14), ("#E8C27F", 0.28)]
    g = VGroup()
    y = 0
    for c, hh in cols:
        g.add(rect(w, hh, c, y=y + hh / 2, sw=3, r=0.06))
        y += hh
    return g.move_to(ORIGIN)


def books(w=2.0):
    cols = ["#E07A5F", "#3D85C6", "#F2CC5C", "#6AA84F", "#8E7CC3"]
    g = VGroup()
    y = 0
    for i, c in enumerate(cols):
        hh = 0.22 + 0.06 * (i % 2)
        g.add(rect(w - 0.12 * (i % 3), hh, c, x=0.05 * (i % 2), y=y + hh / 2, sw=3, r=0.03))
        y += hh
    return g.move_to(ORIGIN)


def quilts(w=2.2):
    cols = ["#F4A6A6", "#A6C8F4", "#F7DC8C", "#B7E1A1"]
    g = VGroup()
    y = 0
    for c in cols:
        g.add(rect(w, 0.32, c, y=y + 0.16, sw=3, r=0.14))
        y += 0.32
    return g.move_to(ORIGIN)


# ══════════════ 지층 모형 (u1-2) ══════════════
MAT = {"gravel": ("자갈과 모래", "#B5AA9C", "gravel", 0.55),
       "sand": ("모래", SAND, "sand", 0.5),
       "mud": ("진흙", MUD, "mud", 0.45)}


def tank(w=4.6, h=3.2, water=0.25):
    """투명한 사각 통(테두리) + 물. 바닥 왼쪽 끝 좌표는 g.bottom"""
    wat = rect(w - 0.08, h * water, WATER, y=-h / 2 + h * water / 2, stroke=WATER, sw=0, op=0.75)
    box = VMobject(stroke_color="#5A7D8C", stroke_width=6)
    box.set_points_as_corners([[-w / 2, h / 2, 0], [-w / 2, -h / 2, 0], [w / 2, -h / 2, 0], [w / 2, h / 2, 0]])
    g = VGroup(wat, box)
    g.w, g.h = w, h
    g.water = wat
    return g


def tank_layer(tk, key, y0, hh, seed=0):
    """통 안 y0(통 바닥에서의 높이)부터 hh 두께의 층"""
    c = tk.get_center()
    w = tk.w - 0.12
    _, col, tx, _ = MAT[key]
    yb = c[1] - tk.h / 2 + y0
    body = rect(w, hh, col, x=c[0], y=yb + hh / 2, stroke=col, sw=1)
    return VGroup(body, texture(c[0] - w / 2, c[0] + w / 2, yb, yb + hh, tx, seed))


def mat_cup(key, s=1.0):
    name, col, tx, _ = MAT[key]
    w, h = 1.1, 1.3
    body = Polygon([-w / 2, h / 2, 0], [w / 2, h / 2, 0], [w * 0.38, -h / 2, 0], [-w * 0.38, -h / 2, 0],
                   fill_color="#FFFFFF", fill_opacity=0.5, stroke_color="#5A7D8C", stroke_width=4)
    fill = Polygon([-w * 0.44, 0.05, 0], [w * 0.44, 0.05, 0], [w * 0.38, -h / 2 + 0.03, 0], [-w * 0.38, -h / 2 + 0.03, 0],
                   fill_color=col, fill_opacity=1, stroke_width=0)
    wat = Polygon([-w * 0.47, 0.35, 0], [w * 0.47, 0.35, 0], [w * 0.44, 0.05, 0], [-w * 0.44, 0.05, 0],
                  fill_color=WATER, fill_opacity=0.8, stroke_width=0)
    tex = texture(-w * 0.36, w * 0.36, -h / 2 + 0.05, 0.02, tx, 3)
    t = T(name, 26).next_to(body, DOWN, buff=0.12)
    g = VGroup(wat, fill, tex, body, t)
    return g.scale(s)


# ══════════════ 실제 지층이 만들어지는 과정 (u1-2 정리) ══════════════
def earth_section(stage=1, w=11.0, h=4.6):
    """stage 1 쌓여요 · 2 눌려요 · 3 굳어져요 · 4 드러나요(땅 위로 솟아 깎임)"""
    x0, x1, yb = -w / 2, w / 2, -h / 2
    g = VGroup()
    sky = rect(w, h, SKY, stroke=SKY, sw=0)
    g.add(sky)
    lay = [("#B5AA9C", "gravel"), (SAND, "sand"), (MUD, "mud"), (SAND, "sand"), ("#B5AA9C", "gravel"), (MUD, "mud")]
    if stage < 4:
        sea_top = yb + h * 0.72
        land = P([(x0, yb), (x0, sea_top + 0.6), (x0 + 2.2, sea_top + 0.45), (x0 + 3.0, sea_top - 0.3),
                  (x0 + 3.6, yb + 0.8), (x0 + 3.6, yb)], "#9CC77A", stroke="#5E8C45")
        sea = rect(w - 3.0, sea_top - yb, SEA_L, x=(x0 + 3.0 + x1) / 2, y=(sea_top + yb) / 2, stroke=SEA_L, sw=0, op=1)
        g.add(sea, land)
        # 강물
        g.add(S([(x0 + 0.2, sea_top + 0.62), (x0 + 1.4, sea_top + 0.5), (x0 + 2.6, sea_top + 0.3), (x0 + 3.1, sea_top - 0.05)],
                close=False, stroke=SEA_D, sw=10))
        n = {1: 3, 2: 6, 3: 6}[stage]
        th = 0.34 if stage == 1 else (0.27 if stage == 2 else 0.25)
        y = yb
        layers = VGroup()
        for i in range(n):
            col, tx = lay[i]
            lx0 = x0 + 3.4 - i * 0.05
            layers.add(rect(x1 - lx0, th, col, x=(lx0 + x1) / 2, y=y + th / 2, stroke=INK, sw=2))
            layers.add(texture(lx0, x1, y, y + th, tx, i * 5))
            y += th
        g.add(layers)
        g.add(waves_line(x0 + 3.0, x1, sea_top))
        g.layers = layers
        g.top_y = y
        if stage == 3:
            g.add(VGroup(*[Line([x0 + 3.5, yb + 0.25 * k, 0], [x1, yb + 0.25 * k, 0], stroke_color=INK, stroke_width=4)
                           for k in range(1, 6)]))
    else:
        # 땅 위로 솟은 지층이 깎여 절벽에서 보임
        top = yb + h * 0.62
        cliff_x = 0.6
        th = 0.36
        y = yb
        for i in range(7):
            col, tx = lay[i % 6]
            g.add(rect(cliff_x - x0, th, col, x=(x0 + cliff_x) / 2, y=y + th / 2, stroke=INK, sw=2))
            g.add(texture(x0, cliff_x, y, y + th, tx, i * 5))
            y += th
        g.add(rect(cliff_x - x0, 0.25, "#9CC77A", x=(x0 + cliff_x) / 2, y=y + 0.12, stroke="#5E8C45", sw=3))
        # 깎여 나간 앞쪽(낮은 땅)
        g.add(P([(cliff_x, yb), (cliff_x, yb + 0.7), (cliff_x + 1.6, yb + 0.4), (x1, yb + 0.35), (x1, yb)], "#9CC77A", stroke="#5E8C45"))
        g.add(sun_s(0.4).move_to([x1 - 1.0, h / 2 - 0.8, 0]))
        g.top_y = y
    g.add(Rectangle(width=w, height=h, stroke_color=INK, stroke_width=SW))
    return g


def waves_line(x0, x1, y, col=SEA_D):
    pts = [(x, y + 0.06 * np.sin(x * 5)) for x in np.linspace(x0, x1, 40)]
    m = VMobject(stroke_color=col, stroke_width=4)
    m.set_points_smoothly([[x, yy, 0] for x, yy in pts])
    return m


def press_arrows(x0, x1, y, n=4, col=RED):
    return VGroup(*[Arrow([x, y + 0.9, 0], [x, y, 0], color=col, stroke_width=8, buff=0,
                          max_tip_length_to_length_ratio=0.35) for x in np.linspace(x0, x1, n)])


def clock(r=0.45, col=INK):
    c = Circle(radius=r, fill_color=PAPER, fill_opacity=1, stroke_color=col, stroke_width=5)
    h1 = Line(ORIGIN, UP * r * 0.65, stroke_color=col, stroke_width=5)
    h2 = Line(ORIGIN, RIGHT * r * 0.5, stroke_color=col, stroke_width=5)
    return VGroup(c, h1, h2)


# ══════════════ 퇴적암 (u1-3) ══════════════
def _grain_pos(n_col=7, n_row=4):
    out = []
    for r_ in range(n_row):
        for c in range(n_col):
            out.append((c + (0.5 if r_ % 2 else 0) + 0.25 * (rnd(r_ * 9 + c, 1) - 0.5), r_ + 0.2 * (rnd(r_ * 9 + c, 2) - 0.5)))
    return out


GRAIN_COLS = ["#C9A26B", "#B5AA9C", "#E3C78F", "#A7765A", "#D8BE96"]


def grains(p=0.0, glue=0.0, w=6.4, n_col=7, n_row=4, r=0.36, solid=0.0):
    """퇴적물 알갱이를 크게 본 그림. p 0→1 눌려서 알갱이 사이가 좁아짐, glue 0→1 물에 녹은 물질(파란 점),
    solid 0→1 단단한 퇴적암 테두리. 바닥이 y=0."""
    gap0, gap1 = 2.55 * r, 1.98 * r
    gap = gap0 + (gap1 - gap0) * p
    pos = _grain_pos(n_col, n_row)
    g = VGroup()
    grs = VGroup()
    for i, (cx, cy) in enumerate(pos):
        rr = r * (0.85 + 0.25 * rnd(i, 3))
        x = (cx - (n_col - 0.5) / 2) * gap
        y = r + cy * gap * 0.9
        grs.add(Ellipse(width=2 * rr * 1.08, height=2 * rr, fill_color=GRAIN_COLS[i % 5], fill_opacity=1,
                        stroke_color=INK, stroke_width=3).move_to([x, y, 0]).rotate(rnd(i, 4) * PI))
    g.add(grs)
    if glue > 0:
        dots = VGroup()
        for i, (cx, cy) in enumerate(pos):
            for k in range(2):
                x = (cx + 0.5 - (n_col - 0.5) / 2) * gap + 0.08 * (rnd(i, 10 + k) - 0.5)
                y = r + (cy + 0.45 + 0.1 * k) * gap * 0.9
                if cx + 0.5 < n_col - 0.2 and cy < n_row - 0.6:
                    dots.add(Dot([x, y, 0], radius=0.075, color=BLUE, fill_opacity=glue))
        g.add(dots)
    top = r + (n_row - 1) * gap * 0.9 + r
    W = (n_col + 0.2) * gap
    if solid > 0:
        g.add(Rectangle(width=W, height=top + 0.1, stroke_color="#3B2A1A", stroke_width=6 * solid,
                        stroke_opacity=solid).move_to([0.0, (top + 0.1) / 2 - 0.05, 0]))
    g.top = top
    return g


ROCK = {"mud": ("이암", "#D8C38F", None), "sand": ("사암", "#B98A5E", "sand"), "gravel": ("역암", "#A9A196", "gravel")}


def _blob(r=1.0, seed=1):
    pts = []
    for i in range(14):
        a = i * TAU / 14
        rr = r * (0.82 + 0.22 * rnd(i, seed))
        pts.append((rr * np.cos(a) * 1.25, rr * np.sin(a) * 0.85))
    return pts


def sed_rock(kind="sand", r=1.0, seed=1, col=None):
    name, col0, tx = ROCK[kind]
    col = col or col0
    body = S(_blob(r, seed), fill=col, stroke=INK, sw=4)
    g = VGroup(body)
    if tx == "sand":
        for i in range(70):
            a, d = rnd(i, seed + 7) * TAU, np.sqrt(rnd(i, seed + 8)) * r * 0.75
            g.add(Dot([d * np.cos(a) * 1.2, d * np.sin(a) * 0.75, 0], radius=0.025, color="#7E5A35"))
    elif tx == "gravel":
        for i in range(60):
            a, d = rnd(i, seed + 7) * TAU, np.sqrt(rnd(i, seed + 8)) * r * 0.75
            g.add(Dot([d * np.cos(a) * 1.2, d * np.sin(a) * 0.75, 0], radius=0.02, color="#6E665C"))
        for i in range(9):
            a, d = rnd(i, seed + 9) * TAU, np.sqrt(rnd(i, seed + 10)) * r * 0.62
            rr = r * (0.13 + 0.08 * rnd(i, seed + 11))
            g.add(Ellipse(width=rr * 2.4, height=rr * 1.8, fill_color=["#7C756C", "#C9C2B8", "#8E857C"][i % 3], fill_opacity=1,
                          stroke_color=INK, stroke_width=2).move_to([d * np.cos(a) * 1.2, d * np.sin(a) * 0.75, 0]))
    return g


def zoom_rock(kind="sand", R=1.2):
    """돋보기로 본 모습: 동그라미 안에 알갱이(이암 아주 작음 · 사암 중간 · 역암 큰 자갈 + 작은 알갱이)"""
    name, col, tx = ROCK[kind]
    disc = Circle(radius=R, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=6)
    g = VGroup(disc)
    if kind == "mud":
        for i in range(160):
            a, d = rnd(i, 21) * TAU, np.sqrt(rnd(i, 22)) * R * 0.92
            g.add(Dot([d * np.cos(a), d * np.sin(a), 0], radius=0.012, color="#9C8558"))
    elif kind == "sand":
        for i in range(60):
            a, d = rnd(i, 23) * TAU, np.sqrt(rnd(i, 24)) * R * 0.85
            rr = 0.07 + 0.03 * rnd(i, 25)
            g.add(Circle(radius=rr, fill_color=["#E3C78F", "#C9A26B", "#A7765A"][i % 3], fill_opacity=1,
                         stroke_color="#6E5440", stroke_width=1.5).move_to([d * np.cos(a), d * np.sin(a), 0]))
    else:
        for i in range(70):
            a, d = rnd(i, 26) * TAU, np.sqrt(rnd(i, 27)) * R * 0.9
            g.add(Dot([d * np.cos(a), d * np.sin(a), 0], radius=0.03, color="#6E665C"))
        spots = [(-0.45, 0.35, 0.36), (0.42, 0.42, 0.3), (0.05, -0.45, 0.4), (-0.6, -0.4, 0.22), (0.68, -0.25, 0.22)]
        for i, (x, y, rr) in enumerate(spots):
            g.add(Ellipse(width=rr * 2.2 * R / 1.2, height=rr * 1.7 * R / 1.2, fill_color=["#7C756C", "#C9C2B8", "#8E857C"][i % 3],
                          fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x * R / 1.2, y * R / 1.2, 0]))
    return g


def gangjeong(kind="rice", w=2.4, h=1.3):
    col = {"rice": "#F3E6C4", "bean": "#E9D6A8", "nut": "#E2C792"}[kind]
    bar = rect(w, h, col, sw=4, r=0.12)
    g = VGroup(bar)
    if kind == "rice":
        for i in range(90):
            g.add(Ellipse(width=0.1, height=0.06, fill_color="#FFFFFF", fill_opacity=1, stroke_color="#B9A27A",
                          stroke_width=1).move_to([(rnd(i, 31) - 0.5) * (w - 0.2), (rnd(i, 32) - 0.5) * (h - 0.16), 0]))
    elif kind == "bean":
        for i in range(24):
            g.add(Circle(radius=0.12, fill_color=["#5B3A1E", "#7A9A3A", "#F0D9A0"][i % 3], fill_opacity=1, stroke_color=INK,
                         stroke_width=1.5).move_to([(i % 8 - 3.5) * w / 8.6 + 0.04 * (rnd(i, 33) - 0.5),
                                                    (i // 8 - 1) * h / 3.4, 0]))
    else:
        for i in range(8):
            g.add(Ellipse(width=0.5, height=0.34, fill_color=["#A8703A", "#C99A5E", "#8C5A2E"][i % 3], fill_opacity=1,
                          stroke_color=INK, stroke_width=2).move_to([(i % 4 - 1.5) * w / 4.4, (i // 4 - 0.5) * h / 2.3, 0])
                  .rotate(rnd(i, 34)))
    return g


# ══════════════ 화석 그림 (u1-4 ~ u1-6) ══════════════
FC = "#6B5A44"       # 화석 선 색


def _trilobite():
    body = Ellipse(width=1.2, height=1.8, fill_color="#9A8A70", fill_opacity=1, stroke_color=FC, stroke_width=4)
    head = Arc(radius=0.62, start_angle=0, angle=PI, stroke_color=FC, stroke_width=4).move_to([0, 0.62, 0])
    g = VGroup(body, head)
    for k in range(8):
        y = 0.35 - k * 0.15
        hw = 0.55 * np.sqrt(max(0.05, 1 - (y / 0.9) ** 2))
        g.add(Line([-hw, y, 0], [hw, y, 0], stroke_color=FC, stroke_width=3))
    g.add(Line([-0.18, 0.4, 0], [-0.18, -0.8, 0], stroke_color=FC, stroke_width=3),
          Line([0.18, 0.4, 0], [0.18, -0.8, 0], stroke_color=FC, stroke_width=3))
    g.add(Dot([-0.25, 0.62, 0], radius=0.06, color=FC), Dot([0.25, 0.62, 0], radius=0.06, color=FC))
    return g


def _fern():
    stem = S([(0, -1.0), (0.08, -0.2), (0.0, 0.5), (-0.12, 1.0)], close=False, stroke=FC, sw=5)
    g = VGroup(stem)
    for k in range(7):
        t = k / 7
        y = -0.8 + t * 1.7
        x = 0.06 * np.sin(t * 3)
        ln = 0.75 * (1 - t * 0.75)
        for sgn in (-1, 1):
            g.add(Ellipse(width=ln, height=0.17, fill_color="#8C9A6A", fill_opacity=1, stroke_color=FC, stroke_width=2)
                  .move_to([x + sgn * ln / 2, y + 0.05, 0]).rotate(sgn * 0.35))
    return g


def _fish():
    body = Ellipse(width=2.0, height=0.8, fill_color="#A99A80", fill_opacity=0.6, stroke_color=FC, stroke_width=4)
    tail = Polygon([0.95, 0, 0], [1.45, 0.4, 0], [1.45, -0.4, 0], fill_color="#A99A80", fill_opacity=0.6,
                   stroke_color=FC, stroke_width=4)
    spine = Line([-0.75, 0, 0], [1.0, 0, 0], stroke_color=FC, stroke_width=5)
    g = VGroup(tail, body, spine)
    for k in range(9):
        x = -0.45 + k * 0.17
        hh = 0.3 * np.sqrt(max(0.1, 1 - (x / 1.0) ** 2))
        g.add(Line([x, hh, 0], [x + 0.08, 0, 0], stroke_color=FC, stroke_width=2.5),
              Line([x, -hh, 0], [x + 0.08, 0, 0], stroke_color=FC, stroke_width=2.5))
    g.add(Polygon([0.1, 0.36, 0], [0.45, 0.62, 0], [0.55, 0.32, 0], fill_color="#A99A80", fill_opacity=0.6, stroke_color=FC, stroke_width=3))
    g.add(Dot([-0.7, 0.08, 0], radius=0.07, color=FC))
    return g


def _ammonite():
    pts = []
    for i in range(160):
        a = i * 0.11
        rr = 0.05 + 0.032 * a
        pts.append([rr * np.cos(a), rr * np.sin(a), 0])
    sp = VMobject(stroke_color=FC, stroke_width=5)
    sp.set_points_smoothly(pts)
    disc = Circle(radius=0.62, fill_color="#B8A47E", fill_opacity=1, stroke_color=FC, stroke_width=4)
    g = VGroup(disc, sp)
    for k in range(18):
        a = k * TAU / 18
        g.add(Line([0.42 * np.cos(a), 0.42 * np.sin(a), 0], [0.61 * np.cos(a), 0.61 * np.sin(a), 0],
                   stroke_color=FC, stroke_width=2.5))
    return g.scale(1.4)


def _ginkgo():
    fanp = [(0, -0.2)] + [(1.0 * np.cos(a), 1.0 * np.sin(a) - 0.2) for a in np.linspace(0.35, PI - 0.35, 14)]
    fan = S(fanp, fill="#C9B26A", stroke=FC, sw=4)
    g = VGroup(fan, Line([0, -0.2, 0], [0.05, -1.0, 0], stroke_color=FC, stroke_width=5))
    for a in np.linspace(0.5, PI - 0.5, 9):
        g.add(Line([0, -0.2, 0], [0.85 * np.cos(a), 0.85 * np.sin(a) - 0.2, 0], stroke_color=FC, stroke_width=1.8))
    g.add(Line([0, -0.2, 0], [0, 0.75, 0], stroke_color=PAPER, stroke_width=3))
    return g


def _bird_foot():
    g = VGroup()
    for a in (-0.55, 0, 0.55):
        g.add(Line([0, 0, 0], [0.75 * np.sin(a), 0.75 * np.cos(a), 0], stroke_color=FC, stroke_width=9))
    g.add(Line([0, 0, 0], [0, -0.3, 0], stroke_color=FC, stroke_width=9))
    return g


def _dino_foot(s=1.0, col="#7E6A50"):
    toes = VGroup()
    for a, ln in ((-0.5, 0.95), (0, 1.1), (0.5, 0.95)):
        toes.add(Ellipse(width=0.48, height=ln, fill_color=col, fill_opacity=1, stroke_color=FC, stroke_width=3)
                 .move_to([0.5 * np.sin(a), 0.45 * np.cos(a) + 0.05, 0]).rotate(-a))
    pad = Ellipse(width=1.0, height=0.85, fill_color=col, fill_opacity=1, stroke_color=FC, stroke_width=3).move_to([0, -0.3, 0])
    return VGroup(pad, toes).scale(s)


def _dino_bone():
    def knob(x):
        return VGroup(Circle(radius=0.22, fill_color=BONE, fill_opacity=1, stroke_color=FC, stroke_width=4).move_to([x, 0.16, 0]),
                      Circle(radius=0.22, fill_color=BONE, fill_opacity=1, stroke_color=FC, stroke_width=4).move_to([x, -0.16, 0]))
    shaft = rect(1.7, 0.36, BONE, stroke=FC, sw=4)
    return VGroup(knob(-0.9), knob(0.9), shaft).rotate(0.3)


def _dung():
    g = VGroup(E(1.4, 0.55, "#8C6A44", y=-0.25, stroke=FC), E(1.1, 0.5, "#8C6A44", y=0.12, stroke=FC),
               E(0.7, 0.42, "#8C6A44", y=0.45, stroke=FC))
    return g


def _eggs():
    g = VGroup()
    for i, (x, y) in enumerate(((-0.55, 0.3), (0.05, 0.42), (0.6, 0.25), (-0.3, -0.3), (0.35, -0.35))):
        g.add(Ellipse(width=0.62, height=0.78, fill_color="#D9CCB0", fill_opacity=1, stroke_color=FC, stroke_width=4)
              .move_to([x, y, 0]).rotate(0.3 * (rnd(i, 41) - 0.5)))
    return g


def _coral():
    g = VGroup()
    for i, x in enumerate((-0.6, -0.2, 0.2, 0.6)):
        hh = 1.2 + 0.4 * rnd(i, 42)
        g.add(rect(0.3, hh, "#E8D8C0", x=x, y=-0.8 + hh / 2, stroke=FC, sw=3, r=0.12))
        for k in range(int(hh / 0.25)):
            g.add(Line([x - 0.13, -0.7 + k * 0.25, 0], [x + 0.13, -0.7 + k * 0.25, 0], stroke_color=FC, stroke_width=1.6))
    return g


def _pinecone():
    body = Ellipse(width=0.9, height=1.5, fill_color="#9A7A54", fill_opacity=1, stroke_color=FC, stroke_width=4)
    g = VGroup(body)
    for k in range(5):
        y = -0.5 + k * 0.25
        g.add(Arc(radius=0.4, start_angle=PI + 0.6, angle=PI - 1.2, stroke_color=FC, stroke_width=2.5).move_to([0, y, 0]))
    return g


def _shell(col="#B8A47E", s=1.0):
    pts = [(0, -0.5)] + [(0.7 * np.cos(a), 0.55 * np.sin(a) - 0.05) for a in np.linspace(0.15, PI - 0.15, 14)]
    fan = S(pts, fill=col, stroke=FC, sw=4)
    g = VGroup(fan)
    for a in np.linspace(0.45, PI - 0.45, 7):
        g.add(Line([0, -0.45, 0], [0.62 * np.cos(a), 0.5 * np.sin(a) - 0.05, 0], stroke_color=FC, stroke_width=2))
    return g.scale(s)


FOSSIL = {"trilobite": _trilobite, "fern": _fern, "fish": _fish, "ammonite": _ammonite, "ginkgo": _ginkgo,
          "bird_foot": _bird_foot, "dino_foot": _dino_foot, "dino_bone": _dino_bone, "dung": _dung, "egg": _eggs,
          "coral": _coral, "pinecone": _pinecone, "shell": _shell}


def fossil(kind, w=1.6, h=1.6):
    return fit(FOSSIL[kind](), w, h)


def slab(kind, w=2.4, h=2.0, title=None, size=26, seed=3):
    pts = [(w / 2 * np.cos(a) * (0.92 + 0.1 * rnd(i, seed)), h / 2 * np.sin(a) * (0.9 + 0.12 * rnd(i, seed + 1)))
           for i, a in enumerate(np.linspace(0, TAU, 12, endpoint=False))]
    stone = S(pts, fill=STONE, stroke=STONE_D, sw=4)
    f = fossil(kind, w * 0.62, h * 0.62)
    g = VGroup(stone, f)
    if title:
        t = T(title, size).next_to(stone, DOWN, buff=0.12)
        g.add(t)
        g.title = t
    g.stone = stone
    return g


def dig_site(w=6.0, h=2.4, n=5):
    """흙더미에 덮인 공룡 뼈. 돌려줌: (전체, 흙더미 목록)"""
    ground = rect(w, h, "#D2B48C", stroke="#8B5E30", sw=4, r=0.1)
    bones = VGroup()
    for i in range(n):
        b = _dino_bone().scale(0.55).move_to([-w / 2 + (i + 0.5) * w / n, -0.1 + 0.25 * ((i % 2) - 0.5), 0])
        bones.add(b)
    skull = VGroup(E(1.0, 0.6, BONE, stroke=FC), Circle(radius=0.08, fill_color=FC, fill_opacity=1, stroke_width=0).move_to([0.2, 0.08, 0]))
    skull.move_to([w / 2 - 0.6, 0.55, 0])
    piles = VGroup()
    for i in range(n):
        piles.add(S([(-0.7, -0.6), (-0.5, 0.1), (0, 0.45), (0.5, 0.15), (0.7, -0.6)], fill="#B9905F", stroke="#7E5428", sw=3)
                  .move_to([-w / 2 + (i + 0.5) * w / n, -0.05, 0]))
    return VGroup(ground, bones, skull), piles


# ══════════════ 화석 모형 (u1-5) ══════════════
def bowl(w=4.2, h=1.8):
    return VGroup(Line([-w / 2, h / 2, 0], [-w / 2 + 0.2, -h / 2, 0], stroke_color="#7A8C96", stroke_width=6),
                  Line([-w / 2 + 0.2, -h / 2, 0], [w / 2 - 0.2, -h / 2, 0], stroke_color="#7A8C96", stroke_width=6),
                  Line([w / 2 - 0.2, -h / 2, 0], [w / 2, h / 2, 0], stroke_color="#7A8C96", stroke_width=6))


def clay_layer(w=3.5, h=0.55, imprint=False):
    c = rect(w, h, CLAY, stroke="#7F5A3A", sw=3, r=0.06)
    g = VGroup(c)
    if imprint:
        g.add(_shell("#8E6A48", 0.9).set_stroke(color="#5E4834").move_to([0, 0.02, 0]))
    return g


def hand_dough(press=1.0):
    dough = E(4.0, 1.3, "#F2DDB8", stroke="#B9905F")
    g = VGroup(dough)
    if press >= 1:
        hand = VGroup(E(0.9, 0.7, "#D9BE90", stroke="#9C7B5C", sw=3, y=-0.12))
        for a, ln in ((-0.9, 0.45), (-0.35, 0.6), (0, 0.65), (0.35, 0.6), (0.85, 0.42)):
            hand.add(Ellipse(width=0.17, height=ln, fill_color="#D9BE90", fill_opacity=1, stroke_color="#9C7B5C", stroke_width=3)
                     .move_to([0.42 * np.sin(a), 0.2 + ln / 2 * np.cos(a) * 0.8, 0]).rotate(-a * 0.6))
        g.add(hand.scale(0.85).move_to([0, 0.05, 0]))
    return g


# ══════════════ 화석이 만들어지는 과정 (u1-5) ══════════════
def fossil_section(stage=1, w=10.0, h=4.8):
    """1 가라앉음 · 2 빠르게 쌓임 · 3 화석이 됨 · 4 깎임 · 5 발견"""
    x0, x1, yb, yt = -w / 2, w / 2, -h / 2, h / 2
    g = VGroup()
    lay = [("#C9A26B", "sand"), (MUD, "mud"), ("#E3C78F", "sand"), ("#B5AA9C", "gravel"), ("#D8BE96", "sand"), (MUD, "mud")]
    fx, th = 0.3, 0.4
    if stage <= 3:
        g.add(rect(w, h, SEA_L, stroke=SEA_L, sw=0))
        g.add(rect(w, 0.5, "#C9A26B", y=yb + 0.25, stroke=INK, sw=2))
        g.add(texture(x0, x1, yb, yb + 0.5, "sand", 2))
        n = {1: 0, 2: 1, 3: 5}[stage]
        y = yb + 0.5
        for i in range(n):
            col, tx = lay[i + 1]
            g.add(rect(w, th, col, y=y + th / 2, stroke=INK, sw=2), texture(x0, x1, y, y + th, tx, i * 3))
            y += th
        f = _fish().scale(0.7)
        if stage == 1:
            f.move_to([fx, yb + 0.5 + 0.3, 0])
        else:
            f.move_to([fx, yb + 0.5 + 0.18, 0]).set_opacity(0.85 if stage == 2 else 0.95)
            if stage == 3:
                f.set_color(FC)
        g.add(f)
        g.fish = f
        g.add(waves_line(x0, x1, yt - 0.25))
        g.top_y = y
    else:
        # 물 밖으로 드러난 지층(언덕) — 4: 깎이는 중, 5: 화석이 드러남
        g.add(rect(w, h, SKY, stroke=SKY, sw=0))
        n = 6
        top = yb + 0.5 + th * (n - 1)
        cut = top - (0.6 if stage == 4 else 1.65)        # 깎여 내려간 높이
        y = yb
        g.add(rect(w, 0.5, "#C9A26B", y=yb + 0.25, stroke=INK, sw=2))
        y = yb + 0.5
        for i in range(n - 1):
            col, tx = lay[i + 1]
            a, b = y, min(y + th, cut)
            if b > a:
                g.add(rect(w, b - a, col, y=(a + b) / 2, stroke=INK, sw=2), texture(x0, x1, a, b, tx, i * 3))
            y += th
        g.add(rect(w, 0.18, "#9CC77A", y=min(top, cut) + 0.09, stroke="#5E8C45", sw=3))
        f = _fish().scale(0.7).set_color(FC).move_to([fx, yb + 0.5 + 0.18, 0])
        if stage == 5:
            f.move_to([fx, yb + 0.5 + 0.18, 0])
        g.add(f)
        g.fish = f
        g.add(sun_s(0.38).move_to([x1 - 0.9, yt - 0.7, 0]))
        g.top_y = cut
    g.add(Rectangle(width=w, height=h, stroke_color=INK, stroke_width=SW))
    return g


# ══════════════ 화석이 알려 주는 비밀 (u1-6) ══════════════
def trackway(w=10.0, h=3.6):
    """큰 공룡 발자국과 작은 공룡 발자국이 이어지다 만남"""
    bg = rect(w, h, "#D9C29A", stroke=STONE_D, sw=4, r=0.12)
    big, small = VGroup(), VGroup()
    for i in range(5):
        x = -w / 2 + 1.0 + i * 1.55
        y = -0.85 + (0.28 if i % 2 else -0.28)
        big.add(_dino_foot(0.55, "#9A7E58").rotate(-PI / 2).move_to([x, y, 0]))
    for i in range(6):
        x = w / 2 - 0.7 - i * 0.62
        y = 0.95 + (0.12 if i % 2 else -0.12) - i * 0.12
        small.add(_dino_foot(0.25, "#9A7E58").rotate(PI / 2).move_to([x, y, 0]))
    return VGroup(bg, big, small), big, small


def warm_sea(w=5.0, h=3.0):
    g = VGroup(rect(w, h, SKY, stroke=SKY, sw=0))
    g.add(rect(w, h * 0.62, "#7CC6E8", y=-h / 2 + h * 0.31, stroke="#7CC6E8", sw=0))
    g.add(waves_line(-w / 2, w / 2, -h / 2 + h * 0.62))
    g.add(rect(w, 0.3, SAND, y=-h / 2 + 0.15, stroke=SAND_D, sw=2))
    for i, x in enumerate((-1.6, -0.6, 0.7, 1.7)):
        g.add(_coral().scale(0.45).set_fill(color=["#F28C8C", "#F7B267", "#C792EA", "#F28C8C"][i], opacity=1)
              .move_to([x, -h / 2 + 0.6, 0]))
    g.add(sun_s(0.38).move_to([w / 2 - 0.6, h / 2 - 0.5, 0]))
    g.add(Rectangle(width=w, height=h, stroke_color=INK, stroke_width=SW))
    return g


def humid_land(w=5.0, h=3.0):
    g = VGroup(rect(w, h, "#E3F1DA", stroke="#E3F1DA", sw=0))
    g.add(rect(w, 0.5, "#8DBF6A", y=-h / 2 + 0.25, stroke="#5E8C45", sw=2))
    for i, x in enumerate((-1.7, -0.6, 0.5, 1.6)):
        f = _fern().scale(0.7)
        f.set_stroke(color="#2F6B2F")
        for m in f[1:]:
            m.set_fill("#5FA35A", opacity=1)
        g.add(f.move_to([x, -h / 2 + 1.2, 0]))
    for i in range(10):
        g.add(Dot([-w / 2 + 0.4 + i * 0.47, h / 2 - 0.4 - 0.3 * (i % 3), 0], radius=0.05, color=WATER_D))
    g.add(sun_s(0.38).move_to([w / 2 - 0.6, h / 2 - 0.5, 0]))
    g.add(Rectangle(width=w, height=h, stroke_color=INK, stroke_width=SW))
    return g
