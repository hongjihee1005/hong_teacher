"""3학년 2학기 3단원 「소리의 성질」 전용 그림 부품 (s3ep30~34, s3mm07)

모두 직접 그린 단순한 벡터 그림. 따로 적지 않으면 그림 가운데가 (0, 0).
  떨림:   Shake(떨림 크기·차례 ValueTracker) — sh.run(초, 처음 크기, 끝 크기, 빠르기)를 play에 넣음
          vib_string(p0, p1, sh) 떨리는 줄 · rings(c, sh) 퍼져 나가는 소리 동그라미(호)
  물건:   fork(소리굽쇠, sh) · rubber_box(고무줄 상자, sh) · drum(작은북 + 좁쌀/공, sh) · guitar(sh) ·
          glock(글로켄슈필 음판) · mallet(채) · kalimba · ukulele(sh, 누르는 곳) · panpipe · boomwhacker ·
          triangle_inst · speaker · ear · meter(소리 측정기 바늘, ValueTracker) · head(얼굴 옆모습, 목)
  전달:   bell_jar(공기 빼는 장치, 공기 ValueTracker) · tank(수조) · castanets · desk · cup_phone(실 전화기)
  기타:   card(글 카드) · two_col(두 칸 표)
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle,
                   ValueTracker, VGroup, VMobject, always_redraw, linear)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import BROWN, BROWN_DARK, RED, SKIN

SW = 4
METAL = "#B8C2CC"
METAL_D = "#6F7C88"
GOLD = "#E8B94A"
WOOD = "#D9A066"
WOOD_D = "#9A6430"
WATER = "#9FD3F2"
WATER_D = "#3F8FC9"
WAVE = "#E0703A"          # 소리 동그라미 색
AIR = "#8FB8DE"
BAR_COLS = ["#E8524A", "#F08A1C", "#F2C230", "#5DB85A", "#3BA6C8", "#3F6FD6", "#8A5BC8", "#D1508F"]


def fit(mob, w=2.0, h=1.4):
    s = min(w / max(mob.width, 1e-3), h / max(mob.height, 1e-3))
    mob.scale(s)
    return mob


def P(pts, fill, stroke=INK, sw=SW, op=1.0):
    return Polygon(*[[x, y, 0] for x, y in pts], fill_color=fill, fill_opacity=op, stroke_color=stroke, stroke_width=sw)


def R(w, h, fill, x=0, y=0, stroke=INK, sw=SW, r=0.08, op=1.0):
    return RoundedRectangle(corner_radius=min(r, w / 2.1, h / 2.1), width=w, height=h, fill_color=fill, fill_opacity=op,
                            stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


def E(w, h, fill, x=0, y=0, stroke=INK, sw=SW, op=1.0):
    return Ellipse(width=w, height=h, fill_color=fill, fill_opacity=op, stroke_color=stroke,
                   stroke_width=sw).move_to([x, y, 0])


def L(a, b, col=INK, sw=SW):
    return Line([a[0], a[1], 0], [b[0], b[1], 0], stroke_color=col, stroke_width=sw)


# ══════════════ 떨림 ══════════════
class Shake:
    """떨림 상태: amp(떨림 크기), ph(떨림 차례). 그림 부품이 always_redraw로 읽어 움직임."""

    def __init__(self, amp=0.0):
        self.amp = ValueTracker(amp)
        self.ph = ValueTracker(0.0)

    def val(self, k=1.0):
        return self.amp.get_value() * np.sin(self.ph.get_value() * k)

    def a(self):
        return self.amp.get_value()

    def live(self, scene, speed=7.0, decay=0.0):
        """장면에 넣어 기다리는 동안에도 저절로 떨리게 함. decay: 1초마다 줄어드는 정도(0이면 그대로)"""
        self.speed, self.decay = speed, decay
        self.ph.clear_updaters()
        self.amp.clear_updaters()
        self.ph.add_updater(lambda m, dt: m.increment_value(TAU * self.speed * dt))
        self.amp.add_updater(lambda m, dt: m.set_value(m.get_value() * np.exp(-self.decay * dt)) if self.decay else None)
        scene.add(self.ph, self.amp)
        return self

    def stop(self, scene):
        self.ph.clear_updaters()
        self.amp.clear_updaters()
        self.amp.set_value(0)
        scene.remove(self.ph, self.amp)

    def run(self, seconds, a0=None, a1=None, speed=7.0):
        """play(*sh.run(…), run_time=초, rate_func=linear)에 넣는 애니메이션 목록.
        a0: 시작 크기(바로 바꿈), a1: 끝 크기(없으면 그대로)"""
        if a0 is not None:
            self.amp.set_value(a0)
        anims = [self.ph.animate.increment_value(TAU * speed * seconds)]
        if a1 is not None:
            anims.append(self.amp.animate.set_value(a1))
        return anims


def play_shake(scene, sh, seconds, a0=None, a1=None, speed=7.0, extra=()):
    scene.play(*sh.run(seconds, a0, a1, speed), *extra, run_time=seconds, rate_func=linear)


def string_pts(p0, p1, off, n=40, mode=1):
    p0, p1 = np.array(p0, dtype=float), np.array(p1, dtype=float)
    d = p1 - p0
    nrm = np.array([-d[1], d[0], 0]) / max(np.linalg.norm(d), 1e-6)
    return [p0 + d * s + nrm * off * np.sin(PI * s * mode) for s in np.linspace(0, 1, n)]


def vib_string(p0, p1, sh, col=INK, sw=5, glow=None):
    """양 끝이 고정된 줄 — sh가 떨리면 가운데가 크게 흔들림. glow: 떨릴 때 줄 색"""
    def draw():
        m = VMobject(stroke_color=(glow if (glow and sh.a() > 0.01) else col), stroke_width=sw)
        m.set_points_smoothly(string_pts(p0, p1, sh.val()))
        return m
    return always_redraw(draw)


def rings(c, sh, rmax=2.2, n=4, start=-0.6, span=1.2, col=WAVE, ref=0.25, sw=6, r0=0.35, speed=0.18):
    """c에서 퍼져 나가는 소리(호). start·span: 호가 향하는 각도(라디안). 떨림 크기(ref 기준)에 따라 진해짐."""
    c = np.array(c, dtype=float)

    def draw():
        g = VGroup()
        k = min(1.0, sh.a() / ref)
        if k < 0.02:
            return g
        t = (sh.ph.get_value() * speed / TAU) % 1.0
        for i in range(n):
            f = (i + t) / n
            rad = r0 + f * (rmax - r0)
            op = k * (1 - f) ** 0.8
            g.add(Arc(radius=rad, start_angle=start, angle=span, arc_center=c,
                      stroke_color=col, stroke_width=sw * (0.6 + 0.4 * k), stroke_opacity=op))
        return g
    return always_redraw(draw)


def sound_word(text, col=WAVE, size=40):
    return T(text, size, col)


# ══════════════ 물건 ══════════════
def head(s=1.0):
    """옆모습 얼굴(오른쪽을 봄) + 목. .neck: 목 가운데, .mouth: 입 자리"""
    face = Circle(radius=0.9, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=SW)
    hair = Arc(radius=0.92, start_angle=0.55, angle=2.5, stroke_color="#4A3426", stroke_width=22)
    eye = Dot([0.45, 0.2, 0], radius=0.07, color=INK)
    mouth = E(0.22, 0.26, "#A8443A", 0.62, -0.38, sw=3)
    neck = R(0.62, 0.9, SKIN, 0.0, -1.25, sw=SW, r=0.05)
    body = R(1.9, 0.7, BLUE, 0.0, -1.95, stroke=INK, sw=SW, r=0.3)
    g = VGroup(body, neck, face, hair, eye, mouth)
    g.neck = np.array([0.0, -1.25, 0])
    g.mouth_pt = np.array([0.85, -0.38, 0])
    g.mouth = mouth
    g.scale(s, about_point=ORIGIN)
    g.neck = g.neck * s
    g.mouth_pt = g.mouth_pt * s
    return g


def hand(s=1.0, col=SKIN):
    """손바닥(위에서 본 모양, 손가락이 위)"""
    palm = R(0.7, 0.7, col, 0, 0, sw=3, r=0.25)
    fingers = VGroup(*[R(0.15, 0.45, col, x, 0.48, sw=3, r=0.07) for x in (-0.24, -0.08, 0.08, 0.24)])
    thumb = R(0.15, 0.38, col, -0.42, 0.08, sw=3, r=0.07).rotate(0.6)
    return VGroup(fingers, thumb, palm).scale(s)


def fork(sh, s=1.0, x=0.0, y=0.0, down=False):
    """소리굽쇠(U 자 + 손잡이). 가지 끝이 sh에 따라 안팎으로 떨림.
    U 자 바닥이 (x, y), 가지 끝이 (x, y+1.7s). down=True면 거꾸로(가지 끝이 (x, y−1.7s))"""
    sg = -1 if down else 1

    def P_(lx, ly):
        return np.array([x + lx, y + sg * ly, 0])

    def draw():
        d = sh.val() * s
        gap = 0.26 * s
        top = 1.7 * s
        prongs = VGroup()
        for side in (-1, 1):
            m = VMobject(stroke_color=METAL_D, stroke_width=16 * s)
            m.set_points_smoothly([P_(side * gap + side * d * (k / 6) ** 2, top * k / 6) for k in range(7)])
            prongs.add(m)
        bottom = VMobject(stroke_color=METAL_D, stroke_width=16 * s)
        bottom.set_points_smoothly([P_(gap * np.cos(a), gap * np.sin(a)) for a in np.linspace(PI, 2 * PI, 9)])
        stem = Line(P_(0, -gap), P_(0, -1.0 * s), stroke_color=METAL_D, stroke_width=16 * s)
        grip = R(0.26 * s, 0.6 * s, "#3C3C46", x, y + sg * (-1.25 * s), stroke=INK, sw=2, r=0.08)
        return VGroup(stem, grip, bottom, prongs)
    return always_redraw(draw)


def rubber_box(sh, w=4.2, h=1.6, x=0.0, y=0.0, glow=ORANGE):
    """플라스틱 상자에 가로로 건 고무줄 — .p0 .p1 줄 양 끝"""
    box = R(w, h, "#CFE7F5", x, y, stroke="#5D8FB0", sw=5, r=0.12, op=0.9)
    hole = E(w * 0.42, h * 0.45, "#A9D0E8", x, y, stroke="#5D8FB0", sw=3)
    p0 = np.array([x - w / 2 - 0.05, y + h / 2 + 0.12, 0])
    p1 = np.array([x + w / 2 + 0.05, y + h / 2 + 0.12, 0])
    band = vib_string(p0, p1, sh, col="#C9761F", sw=7, glow=glow)
    g = VGroup(box, hole, band)
    g.p0, g.p1, g.band = p0, p1, band
    g.mid = (p0 + p1) / 2
    return g


def drum(sh, w=3.2, x=0.0, y=0.0, grains=7, grain_col="#E9C46A", grain_r=0.07, jump=3.0):
    """작은북(옆모습) + 막 위 알갱이(좁쌀·스타이로폼 공). 막이 떨리면 알갱이가 튀어 오름.
    .top: 막 가운데 높이"""
    h = w * 0.42
    side = R(w, h, "#D2453B", x, y, stroke=INK, sw=SW, r=0.05)
    zig = VGroup(*[L((x - w / 2 + w * k / 6, y + h / 2 - 0.08), (x - w / 2 + w * (k + 0.5) / 6, y - h / 2 + 0.08), "#F6E3B4", 3)
                   for k in range(6)])
    zig2 = VGroup(*[L((x - w / 2 + w * (k + 0.5) / 6, y - h / 2 + 0.08), (x - w / 2 + w * (k + 1) / 6, y + h / 2 - 0.08), "#F6E3B4", 3)
                    for k in range(6)])
    top_y = y + h / 2
    skin = E(w, w * 0.22, "#F7F1E3", x, top_y, stroke=INK, sw=SW)
    rng = np.random.RandomState(3)
    xs = np.linspace(x - w * 0.32, x + w * 0.32, grains) + rng.uniform(-0.05, 0.05, grains)
    off = rng.uniform(0, TAU, grains)

    def draw():
        a = sh.a()
        ph = sh.ph.get_value()
        g = VGroup()
        for i, gx in enumerate(xs):
            hop = abs(np.sin(ph * 0.5 + off[i])) * a * jump
            g.add(Circle(radius=grain_r, fill_color=grain_col, fill_opacity=1, stroke_color=INK, stroke_width=1.5)
                  .move_to([gx, top_y + grain_r + 0.02 + hop, 0]))
        return g
    pts = always_redraw(draw)
    grp = VGroup(side, zig, zig2, skin, pts)
    grp.top = top_y
    grp.skin = skin
    return grp


def stick(length=1.8, col=WOOD, tip=None):
    """북채·채(가로로 놓인 막대, 오른쪽 끝이 머리)"""
    bar = L((-length / 2, 0), (length / 2, 0), col, 10)
    head_ = Circle(radius=0.14, fill_color=tip or col, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([length / 2, 0, 0])
    return VGroup(bar, head_)


def guitar(sh, w=5.6, x=0.0, y=0.0):
    """기타(옆으로 누운 모양) — 가운데 줄 하나가 sh에 따라 떨림. .s0 .s1 줄 양 끝"""
    body = VGroup(E(w * 0.36, w * 0.34, "#E2A15A", x - w * 0.28, y, sw=SW),
                  E(w * 0.30, w * 0.27, "#E2A15A", x - w * 0.02, y, sw=SW))
    cover = E(w * 0.26, w * 0.2, "#E2A15A", x - w * 0.15, y, stroke="#E2A15A", sw=0)
    hole = Circle(radius=w * 0.055, fill_color="#5A3A1E", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x - w * 0.12, y, 0])
    neck = R(w * 0.48, w * 0.07, "#8A5A2E", x + w * 0.36, y, sw=3, r=0.03)
    headp = R(w * 0.1, w * 0.1, "#6E4522", x + w * 0.62, y, sw=3, r=0.04)
    bridge = R(w * 0.03, w * 0.1, "#5A3A1E", x - w * 0.33, y, sw=2, r=0.01)
    s0 = np.array([x - w * 0.33, y, 0])
    s1 = np.array([x + w * 0.58, y, 0])
    others = VGroup(*[L((s0[0], y + dy), (s1[0], y + dy * 0.7), "#DDD8CC", 2) for dy in (-0.12, -0.06, 0.06, 0.12)])
    main = vib_string(s0, s1, sh, col="#F4EFE2", sw=4, glow="#FFD54A")
    g = VGroup(body, cover, hole, neck, headp, bridge, others, main)
    g.s0, g.s1 = s0, s1
    g.mid = (s0 + s1) / 2
    return g


def glock(n=8, x=0.0, y=0.0, w=5.6, hmax=2.2, hmin=1.1, labels=False):
    """글로켄슈필 — 왼쪽 음판이 가장 길고 오른쪽으로 갈수록 짧음. .bars[i]"""
    frame = VGroup(R(w + 0.3, 0.18, WOOD, x, y + hmax / 2 + 0.05, stroke=WOOD_D, sw=3, r=0.04),
                   R(w + 0.3, 0.18, WOOD, x, y - hmax / 2 + 0.25, stroke=WOOD_D, sw=3, r=0.04))
    bars = VGroup()
    bw = w / n * 0.78
    for i in range(n):
        h = hmax - (hmax - hmin) * i / (n - 1)
        bx = x - w / 2 + w / n * (i + 0.5)
        bar = R(bw, h, BAR_COLS[i % len(BAR_COLS)], bx, y + hmax / 2 - h / 2 + 0.05 - 0.05, stroke=INK, sw=3, r=0.05)
        dots = VGroup(Dot([bx, bar.get_top()[1] - 0.18, 0], radius=0.04, color=INK),
                      Dot([bx, bar.get_bottom()[1] + 0.18, 0], radius=0.04, color=INK))
        b = VGroup(bar, dots)
        if labels:
            lab = T("도레미파솔라시도"[i], 26, PAPER).move_to(bar.get_center() + DOWN * (h / 2 - 0.35))
            b.add(lab)
        bars.add(b)
    g = VGroup(frame, bars)
    g.bars = bars
    return g


def mallet(length=1.6, tip="#E8524A"):
    """채: 손잡이가 오른쪽 위, 머리가 왼쪽 아래(끝이 원점)"""
    h_ = Circle(radius=0.17, fill_color=tip, fill_opacity=1, stroke_color=INK, stroke_width=3)
    bar = Line(ORIGIN, [length * 0.7, length * 0.7, 0], stroke_color=WOOD_D, stroke_width=9)
    return VGroup(bar, h_)


def kalimba(x=0.0, y=0.0, w=3.6, n=9):
    """칼림바(위에서 본 모양) — 가운데 건반이 가장 길고 양쪽 끝으로 갈수록 짧음. .keys[i]"""
    board = R(w, w * 0.95, WOOD, x, y, stroke=WOOD_D, sw=SW, r=0.3)
    hole = Circle(radius=w * 0.1, fill_color="#5A3A1E", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x, y - w * 0.22, 0])
    bridge = R(w * 0.85, 0.12, METAL_D, x, y + w * 0.02, stroke=INK, sw=2, r=0.03)
    keys = VGroup()
    kw = w * 0.07
    for i in range(n):
        d = abs(i - (n - 1) / 2) / ((n - 1) / 2)       # 0 가운데 → 1 끝
        ln = w * (0.62 - 0.3 * d)
        kx = x - w * 0.38 + w * 0.76 * i / (n - 1)
        top = y + w * 0.02 + 0.05
        keys.add(R(kw, ln, METAL, kx, top + ln / 2 - 0.15, stroke=METAL_D, sw=2, r=0.03))
    g = VGroup(board, hole, keys, bridge)
    g.keys = keys
    return g


def ukulele(sh, x=0.0, y=0.0, w=6.4, press=0.0):
    """우쿨렐레(옆으로 누운 모양, 몸통이 왼쪽). press: 누르는 곳(0=누르지 않음, 0.5=절반 길이).
    떨리는 부분(몸통 쪽 다리 ~ 누른 곳)이 노랗게 떨림. .seg(press) → (p0, p1)"""
    body = VGroup(E(w * 0.3, w * 0.28, "#F0B26A", x - w * 0.33, y, sw=SW),
                  E(w * 0.24, w * 0.22, "#F0B26A", x - w * 0.12, y, sw=SW))
    cover = E(w * 0.2, w * 0.17, "#F0B26A", x - w * 0.22, y, stroke="#F0B26A", sw=0)
    hole = Circle(radius=w * 0.045, fill_color="#5A3A1E", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x - w * 0.12, y, 0])
    neck = R(w * 0.5, w * 0.065, "#8A5A2E", x + w * 0.22, y, sw=3, r=0.03)
    headp = R(w * 0.09, w * 0.09, "#6E4522", x + w * 0.5, y, sw=3, r=0.04)
    bridge = R(w * 0.03, w * 0.09, "#5A3A1E", x - w * 0.38, y, sw=2, r=0.01)
    s0 = np.array([x - w * 0.38, y, 0])
    s1 = np.array([x + w * 0.46, y, 0])
    frets = VGroup(*[L((x - w * 0.03 + w * 0.47 * k / 7, y - w * 0.032), (x - w * 0.03 + w * 0.47 * k / 7, y + w * 0.032), "#D9D2C2", 2)
                     for k in range(1, 7)])
    g = VGroup(body, cover, hole, neck, frets, headp, bridge)
    g.s0, g.s1 = s0, s1
    g.press_tracker = ValueTracker(press)

    def seg():
        p = g.press_tracker.get_value()
        return s0, s1 + (s0 - s1) * p

    def draw():
        a, b = seg()
        grp = VGroup()
        grp.add(Line(s0, s1, stroke_color="#E8E2D2", stroke_width=3))
        m = VMobject(stroke_color=("#FFC928" if sh.a() > 0.01 else "#F4EFE2"), stroke_width=6)
        m.set_points_smoothly(string_pts(a, b, sh.val()))
        grp.add(m)
        p = g.press_tracker.get_value()
        if p > 0.01:
            grp.add(Circle(radius=0.2, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(b + UP * 0.05))
        return grp
    g.string = always_redraw(draw)
    g.add(g.string)
    g.seg = seg
    return g


def panpipe(x=0.0, y=0.0, n=8, w=3.2, hmax=2.6, hmin=0.9):
    """팬파이프 — 왼쪽 관이 가장 길고 오른쪽으로 갈수록 짧음(위가 가지런함)"""
    tubes = VGroup()
    tw = w / n
    top = y + hmax / 2
    for i in range(n):
        h = hmax - (hmax - hmin) * i / (n - 1)
        tubes.add(R(tw * 0.92, h, "#E9C78F", x - w / 2 + tw * (i + 0.5), top - h / 2, stroke=WOOD_D, sw=3, r=0.06))
    band = R(w + 0.1, 0.22, "#B5651D", x, top - 0.45, stroke=INK, sw=3, r=0.05)
    g = VGroup(tubes, band)
    g.tubes = tubes
    return g


def boomwhacker(x=0.0, y=0.0, n=5, gap=0.75, hmax=2.8, hmin=1.2):
    """붐웨커 — 길이가 다른 색 관(바닥이 가지런함)"""
    g = VGroup()
    cols = ["#E8524A", "#F08A1C", "#F2C230", "#5DB85A", "#3F6FD6"]
    bot = y - hmax / 2
    for i in range(n):
        h = hmax - (hmax - hmin) * i / (n - 1)
        g.add(R(0.48, h, cols[i % 5], x - gap * (n - 1) / 2 + gap * i, bot + h / 2, stroke=INK, sw=3, r=0.2))
    g.tubes = g
    return g


def triangle_inst(s=1.0):
    pts = [np.array([0, 1.0, 0]), np.array([-0.85, -0.5, 0]), np.array([0.85, -0.5, 0])]
    m = VMobject(stroke_color=METAL_D, stroke_width=10)
    m.set_points_as_corners([pts[1] + RIGHT * 0.25, pts[1], pts[0], pts[2]])
    cord = Line(pts[0], pts[0] + UP * 0.5, stroke_color=RED, stroke_width=4)
    return VGroup(cord, m).scale(s)


def speaker(s=1.0, x=0.0, y=0.0):
    """스피커(앞모습). .cone: 떨리는 원"""
    box = R(1.4, 1.9, "#3C3C46", 0, 0, stroke=INK, sw=SW, r=0.15)
    cone = Circle(radius=0.5, fill_color="#6B6B78", fill_opacity=1, stroke_color="#A0A0AC", stroke_width=4).move_to([0, -0.25, 0])
    dot = Circle(radius=0.16, fill_color="#9A9AA6", fill_opacity=1, stroke_width=0).move_to([0, -0.25, 0])
    tw = Circle(radius=0.17, fill_color="#6B6B78", fill_opacity=1, stroke_color="#A0A0AC", stroke_width=3).move_to([0, 0.55, 0])
    g = VGroup(box, cone, dot, tw).scale(s).move_to([x, y, 0])
    g.cone = VGroup(cone, dot)
    return g


def ear(s=1.0, face=LEFT):
    """귀(소리가 들어오는 쪽이 face)"""
    outer = VMobject(stroke_color=INK, stroke_width=SW, fill_color=SKIN, fill_opacity=1)
    pts = [(0.0, 0.75), (0.45, 0.6), (0.55, 0.1), (0.35, -0.3), (0.15, -0.65), (-0.15, -0.75), (-0.3, -0.5)]
    outer.set_points_smoothly([np.array([x, y, 0]) for x, y in pts] + [np.array([0.0, 0.75, 0])])
    inner = VMobject(stroke_color=INK, stroke_width=3)
    inner.set_points_smoothly([np.array([x, y, 0]) for x, y in [(0.05, 0.45), (0.3, 0.35), (0.3, 0.0), (0.12, -0.2), (0.15, -0.4)]])
    g = VGroup(outer, inner)
    if face is RIGHT:
        g.flip(UP)
    return g.scale(s)


def meter(val=None, x=0.0, y=0.0, s=1.0, vmax=100, label="소리 측정기", show_num=True):
    """반원 눈금 소리 측정기(앱 그림처럼 초록 → 노랑 → 빨강). val: ValueTracker(0~vmax). .needle"""
    val = val or ValueTracker(0)
    c = np.array([x, y, 0])
    rad = 1.25 * s
    plate = R(3.1 * s, 2.2 * s, "#1E1E2A", x, y + 0.45 * s, stroke=INK, sw=3, r=0.25 * s)
    arcs = VGroup(
        Arc(radius=rad, start_angle=PI, angle=-PI / 2, arc_center=c, stroke_color="#4CAF50", stroke_width=18 * s),
        Arc(radius=rad, start_angle=PI / 2, angle=-PI / 4, arc_center=c, stroke_color="#F2C230", stroke_width=18 * s),
        Arc(radius=rad, start_angle=PI / 4, angle=-PI / 4, arc_center=c, stroke_color="#E8524A", stroke_width=18 * s),
    )
    lab = T(label, int(22 * s), "#DDDDE6").move_to([x, y - 0.4 * s, 0])

    def needle():
        v = max(0.0, min(vmax, val.get_value()))
        ang = PI - PI * v / vmax
        tip = c + rad * 0.92 * np.array([np.cos(ang), np.sin(ang), 0])
        grp = VGroup(Line(c, tip, stroke_color=PAPER, stroke_width=6 * s),
                     Dot(c, radius=0.09 * s, color=PAPER))
        if show_num:
            grp.add(T(f"{int(round(v))}", int(34 * s), PAPER).move_to(c + UP * 0.55 * s))
        return grp
    nd = always_redraw(needle)
    g = VGroup(plate, arcs, lab, nd)
    g.val = val
    g.needle = nd
    return g


# ══════════════ 전달 ══════════════
def bell_jar(air, x=0.0, y=0.0, w=3.4, h=3.2, n=46):
    """공기를 빼는 장치: 투명 통 + 손잡이 + 안의 스피커와 탈지면. air: ValueTracker(1 = 공기 가득 → 0).
    .spk_pt: 스피커 소리 나오는 자리"""
    base = R(w + 0.6, 0.3, "#9AA3AC", x, y - h / 2 - 0.15, stroke=INK, sw=3, r=0.05)
    jar = R(w, h, "#E6F3FA", x, y, stroke="#6AA3C4", sw=5, r=0.35, op=0.45)
    cotton = E(w * 0.8, 0.35, "#FFFFFF", x, y - h / 2 + 0.22, stroke="#C8D2DA", sw=2)
    spk = speaker(0.55, x - w * 0.18, y - h / 2 + 0.85)
    rng = np.random.RandomState(7)
    pts = np.c_[rng.uniform(x - w / 2 + 0.25, x + w / 2 - 0.25, n), rng.uniform(y - h / 2 + 0.5, y + h / 2 - 0.25, n)]
    order = rng.permutation(n)

    def draw():
        k = int(round(air.get_value() * n))
        return VGroup(*[Dot([pts[i, 0], pts[i, 1], 0], radius=0.06, color=AIR) for i in order[:k]])
    dots = always_redraw(draw)
    tube = L((x + w / 2, y + h / 2 - 0.5), (x + w / 2 + 0.7, y + h / 2 - 0.5), "#7E8A93", 10)
    pump = R(0.5, 1.6, "#C9CED2", x + w / 2 + 0.95, y + h / 2 - 0.5, stroke=INK, sw=3, r=0.08)
    handle = VGroup(L((x + w / 2 + 0.95, y + h / 2 + 0.3), (x + w / 2 + 0.95, y + h / 2 + 0.75), INK, 6),
                    R(0.8, 0.16, "#3C3C46", x + w / 2 + 0.95, y + h / 2 + 0.8, stroke=INK, sw=2, r=0.05))
    g = VGroup(base, cotton, spk, dots, jar, tube, pump, handle)
    g.spk_pt = spk.get_center() + RIGHT * 0.4
    g.handle = handle
    g.dots = dots
    return g


def tank(w=4.0, h=2.4, x=0.0, y=0.0, level=0.8):
    glass = R(w, h, "#F2FAFD", x, y, stroke="#6AA3C4", sw=5, r=0.08, op=0.3)
    wh = h * level
    water = Rectangle(width=w - 0.1, height=wh, fill_color=WATER, fill_opacity=0.75, stroke_width=0).move_to([x, y - h / 2 + wh / 2 + 0.03, 0])
    g = VGroup(water, glass)
    g.surface_y = y - h / 2 + wh
    return g


def castanets(s=1.0, open_=0.0):
    """캐스터네츠(옆모습 두 쪽, open_ 0 → 닫힘)"""
    a = E(1.0, 0.42, "#B5401F", 0, 0.12 + open_ * 0.3, sw=3)
    b = E(1.0, 0.42, "#9E3519", 0, -0.12 - open_ * 0.3, sw=3)
    cord = L((-0.55, 0.0), (-0.85, 0.0), RED, 4)
    return VGroup(cord, a, b).scale(s)


def desk(w=6.0, x=0.0, y=0.0):
    top = R(w, 0.35, WOOD, x, y, stroke=WOOD_D, sw=4, r=0.05)
    grain = VGroup(*[L((x - w / 2 + 0.3 + k * 0.9, y + 0.05), (x - w / 2 + 0.8 + k * 0.9, y - 0.05), WOOD_D, 2) for k in range(int(w / 0.9))])
    legs = VGroup(R(0.25, 1.4, WOOD_D, x - w / 2 + 0.35, y - 0.85, stroke=INK, sw=3, r=0.03),
                  R(0.25, 1.4, WOOD_D, x + w / 2 - 0.35, y - 0.85, stroke=INK, sw=3, r=0.03))
    g = VGroup(legs, top, grain)
    g.top_y = y + 0.175
    return g


def pencil(length=1.4):
    body = R(length, 0.18, "#F2C230", 0, 0, stroke=INK, sw=2, r=0.02)
    tip = P([(length / 2, 0.09), (length / 2 + 0.25, 0), (length / 2, -0.09)], "#F1D9B5", INK, 2)
    lead = P([(length / 2 + 0.17, 0.03), (length / 2 + 0.25, 0), (length / 2 + 0.17, -0.03)], INK, INK, 1)
    return VGroup(body, tip, lead)


def cup(s=1.0, face=RIGHT):
    """종이컵(옆으로 누움, 입구가 face 반대쪽 — face 쪽이 바닥)"""
    c = P([(-0.4, 0.42), (0.4, 0.3), (0.4, -0.3), (-0.4, -0.42)], "#F7F1E3", INK, 3)
    rim = E(0.16, 0.86, "#EDE3CC", -0.4, 0, sw=3)
    g = VGroup(c, rim)
    if face is LEFT:
        g.flip(UP)
    return g.scale(s)


def phone_line(p0, p1, sh, taut=True, col="#C9761F"):
    """실 전화기의 실. taut=False면 아래로 처짐(sh 떨림은 거의 전달 안 됨)"""
    p0, p1 = np.array(p0, dtype=float), np.array(p1, dtype=float)

    def draw():
        m = VMobject(stroke_color=col, stroke_width=4)
        if taut:
            m.set_points_smoothly(string_pts(p0, p1, sh.val() * 0.5, mode=3))
        else:
            pts = [p0 + (p1 - p0) * s + DOWN * 1.2 * np.sin(PI * s) for s in np.linspace(0, 1, 30)]
            m.set_points_smoothly(pts)
        return m
    return always_redraw(draw)


# ══════════════ 글 ══════════════
def card(lines, w=None, size=36, col=INK, fill=PAPER, stroke=SOFT, pad=0.32):
    ts = VGroup(*[M(l, size, col) for l in lines]).arrange(DOWN, buff=0.2, aligned_edge=LEFT)
    W = min(w or ts.width + 2 * pad, 13.4)
    if ts.width > W - 2 * pad:
        ts.scale_to_fit_width(W - 2 * pad)
    box = RoundedRectangle(corner_radius=0.22, width=W, height=ts.height + 2 * pad, fill_color=fill, fill_opacity=1,
                           stroke_color=stroke, stroke_width=4)
    ts.move_to(box)
    return VGroup(box, ts)


def table(rows, widths, h=0.78, size=32, head_fill="#FCE9D2", x=0.0, y=0.0):
    """표: rows = [[칸, …], …] (첫 줄은 머리). 칸 글은 MarkupText. .cells[r][c]"""
    W = sum(widths)
    grp = VGroup()
    cells = []
    top = y + h * len(rows) / 2
    for ri, row in enumerate(rows):
        cx = x - W / 2
        line = []
        for ci, txt in enumerate(row):
            w = widths[ci]
            fill = head_fill if ri == 0 or ci == 0 else PAPER
            box = Rectangle(width=w, height=h, fill_color=fill, fill_opacity=1, stroke_color=SOFT, stroke_width=3)
            box.move_to([cx + w / 2, top - h * (ri + 0.5), 0])
            t = M(txt, size, INK)
            if t.width > w - 0.25:
                t.scale_to_fit_width(w - 0.25)
            t.move_to(box)
            cell = VGroup(box, t)
            grp.add(cell)
            line.append(cell)
            cx += w
        cells.append(line)
    grp.cells = cells
    return grp


def splash(c, sh, n=9, h=0.9, ref=0.08, col=WATER_D):
    """c(물 표면)에서 물방울이 튀어 오름 — sh 떨림 크기에 따라"""
    c = np.array(c, dtype=float)
    angs = np.linspace(0.45, PI - 0.45, n)
    offs = np.random.RandomState(5).uniform(0, 1, n)

    def draw():
        g = VGroup()
        k = min(1.0, sh.a() / ref)
        if k < 0.05:
            return g
        t = sh.ph.get_value() / TAU * 0.35
        for i, a in enumerate(angs):
            f = (t + offs[i]) % 1.0
            dist = h * k * (0.6 + 0.4 * ((i * 7) % 3) / 2)
            p = c + np.array([np.cos(a) * dist * f, np.sin(a) * dist * 4 * f * (1 - f), 0])
            g.add(Dot(p, radius=0.07, color=col).set_opacity(0.4 + 0.6 * (1 - f)))
        return g
    return always_redraw(draw)
