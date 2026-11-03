"""6-2 4단원 「과학과 나의 진로」 전용 그림 부품 (s6ep35~36, s6mm07)

모두 직접 그린 단순한 벡터 그림. 내용(문제·해결 방법·직업)은 차시 앱 grade6/science/_build_tb/src2/u4-1 ~ u4-5.html에서 옮김.
  식당:   waiter(종업원) · kiosk(키오스크) · serve_robot(서빙 로봇) · shop_panel(식당 그림 판)
  현재 사회: crib(비어 있는 신생아 침대) · factory(굴뚝과 오르는 그래프) · expo(과학 기술 박람회 화면)
  자료:   pop_chart(연도별 인구 구조 띠그래프 — 앱 u4-1 '더 알아보기' 값 그대로)
  문제:   P_COL·P_NAME(인구·환경·윤리 색과 이름) · p_icon(사람들·지구·저울) · prob_tag(문제 이름표) · chain(생각의 사슬 상자 줄)
  해결:   solar_panel(재생 에너지) · lock_icon(정보 보안) · robot_icon(로봇·자동화)
  마무리: NoNextClosing — '다음 영상'이 없을 때(단원·시리즈 마지막 편) 그 줄을 아예 그리지 않는 closing
"""
import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI,
                   Arc, Arrow, Circle, Dot, Ellipse, FadeIn, FadeOut, Line, Polygon, Rectangle, RoundedRectangle,
                   VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, SMALL, T, M, plain
from scikit import RED, SKIN, person
from kit_s5u11 import label, text_card, fit, ox_mark, bin_box  # noqa: F401
from kit_s5u13 import word_card, result_table  # noqa: F401
from kit_s6u11 import arrow_right  # noqa: F401

SW = 4
P_COL = ["#2F6FD6", "#2E9E5B", "#C07A12"]          # 인구 · 환경 · 윤리 (앱 모둠 색과 비슷하게)
P_NAME = ["인구 문제", "환경 문제", "윤리 문제"]
POP_C = ["#5FB3E8", "#9CCC3C", "#E2573F"]           # 앱 u4-1 그래프 색


def rr(w, h, fill, x=0.0, y=0.0, stroke=INK, sw=SW, r=0.08, op=1.0):
    return RoundedRectangle(corner_radius=r, width=w, height=h, fill_color=fill, fill_opacity=op,
                            stroke_color=stroke, stroke_width=sw).move_to([x, y, 0])


# ── 식당 ──
def waiter(h=1.9):
    p = person(h, shirt="#2B2B33")
    tray = VGroup(Line([0.25, 1.28 * h / 2.6, 0], [0.95, 1.28 * h / 2.6, 0], stroke_color=SOFT, stroke_width=6),
                  Ellipse(width=0.42, height=0.2, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=2)
                  .move_to([0.6, 1.4 * h / 2.6, 0]))
    return VGroup(p, tray)


def kiosk(s=1.0):
    stand = rr(0.9 * s, 2.0 * s, "#E3E8EE", r=0.12 * s)
    scr = rr(0.66 * s, 1.0 * s, "#2B4C7E", y=0.35 * s, sw=2, r=0.05 * s)
    btns = VGroup(*[rr(0.22 * s, 0.16 * s, c, x=(-0.15 + 0.3 * (i % 2)) * s, y=(0.6 - 0.28 * (i // 2)) * s, sw=0, r=0.03)
                    for i, c in enumerate(["#FFD166", "#7EC8F0", "#9CCC3C", "#F28B82"])])
    slot = rr(0.4 * s, 0.08 * s, INK, y=-0.45 * s, sw=0, r=0.02)
    return VGroup(stand, scr, btns, slot)


def serve_robot(s=1.0, col="#FFFFFF"):
    base = rr(0.9 * s, 0.32 * s, "#6B7C8F", y=-0.9 * s, r=0.12 * s)
    pole = rr(0.16 * s, 1.0 * s, "#B7C3CF", y=-0.25 * s, sw=2, r=0.04)
    tray = VGroup(rr(1.0 * s, 0.1 * s, "#B7C3CF", y=-0.1 * s, sw=2, r=0.03),
                  Ellipse(width=0.5 * s, height=0.2 * s, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=2)
                  .move_to([0, 0.0, 0]))
    head = rr(0.8 * s, 0.55 * s, col, y=0.55 * s, r=0.15 * s)
    eyes = VGroup(Dot([-0.16 * s, 0.58 * s, 0], radius=0.06 * s, color=INK), Dot([0.16 * s, 0.58 * s, 0], radius=0.06 * s, color=INK))
    smile = Arc(radius=0.12 * s, start_angle=PI + 0.5, angle=PI - 1.0, stroke_color=INK, stroke_width=3).move_to([0, 0.43 * s, 0])
    wheels = VGroup(Dot([-0.3 * s, -1.08 * s, 0], radius=0.09 * s, color=INK), Dot([0.3 * s, -1.08 * s, 0], radius=0.09 * s, color=INK))
    return VGroup(pole, base, wheels, tray, head, eyes, smile)


def robot_icon(s=1.0):
    head = rr(0.9 * s, 0.7 * s, PAPER, y=0.35 * s, stroke="#6B7C8F", r=0.16 * s)
    eyes = VGroup(Dot([-0.18 * s, 0.38 * s, 0], radius=0.07 * s, color=INK), Dot([0.18 * s, 0.38 * s, 0], radius=0.07 * s, color=INK))
    ant = VGroup(Line([0, 0.7 * s, 0], [0, 0.92 * s, 0], stroke_color="#6B7C8F", stroke_width=4),
                 Dot([0, 0.95 * s, 0], radius=0.07 * s, color=RED))
    body = rr(0.8 * s, 0.62 * s, PAPER, y=-0.38 * s, stroke="#6B7C8F", r=0.12 * s)
    return VGroup(ant, head, eyes, body)


def table(w=1.6):
    return VGroup(rr(w, 0.14, "#C98F52", r=0.03, sw=3), Line([0, -0.07, 0], [0, -0.85, 0], stroke_color="#8A5A1C", stroke_width=8))


def shop_panel(era="now", w=6.2, h=3.9):
    """식당 그림 판. era: 'past'(10년 전) · 'now'(현재). 바닥 높이 = 판 아래에서 0.35"""
    bg = rr(w, h, "#FFF6E8", stroke=SOFT, r=0.2)
    floor_y = -h / 2 + 0.35
    fl = Rectangle(width=w - 0.1, height=0.3, fill_color="#E6D6B2", fill_opacity=1, stroke_width=0).move_to([0, floor_y - 0.12, 0])
    g = VGroup(bg, fl)
    tb = table(1.5).move_to([-1.4, floor_y + 0.55, 0], aligned_edge=DOWN)
    guest = person(1.6, shirt="#9CCC3C", pose="sit").move_to([-2.45, floor_y, 0], aligned_edge=DOWN)
    g.add(tb, guest)
    if era == "past":
        wt = waiter(1.9).move_to([0.7, floor_y, 0], aligned_edge=DOWN)
        wt.flip(UP)
        cnt = VGroup(rr(1.4, 1.0, "#C98F52", r=0.04), T("계산대", 20, PAPER)).move_to([2.15, floor_y + 0.5, 0])
        cnt[1].move_to(cnt[0])
        g.add(cnt, wt)
        g.items = VGroup(wt)
    else:
        k = kiosk(0.95).move_to([2.15, floor_y, 0], aligned_edge=DOWN)
        rb = serve_robot(0.85).move_to([0.45, floor_y, 0], aligned_edge=DOWN)
        g.add(k, rb)
        g.kiosk, g.robot = k, rb
    return g


# ── 현재 사회의 모습 ──
def crib(s=1.0):
    frame = VGroup(Line([-0.9 * s, -0.5 * s, 0], [0.9 * s, -0.5 * s, 0]), Line([-0.9 * s, 0.25 * s, 0], [0.9 * s, 0.25 * s, 0]),
                   Line([-0.9 * s, -0.75 * s, 0], [-0.9 * s, 0.45 * s, 0]), Line([0.9 * s, -0.75 * s, 0], [0.9 * s, 0.45 * s, 0]))
    bars = VGroup(*[Line([x * s, -0.5 * s, 0], [x * s, 0.25 * s, 0]) for x in np.linspace(-0.6, 0.6, 5)])
    for m in [*frame, *bars]:
        m.set_stroke("#C98F52", 7 if m in frame else 4)
    mat = rr(1.75 * s, 0.16 * s, "#F7D9E6", y=-0.42 * s, sw=2, r=0.04)
    return VGroup(mat, bars, frame)


def factory(s=1.0):
    bld = Polygon([-1.0, -0.8, 0], [-1.0, 0.0, 0], [-0.5, 0.3, 0], [-0.5, 0.0, 0], [0.0, 0.3, 0], [0.0, 0.0, 0],
                  [0.5, 0.3, 0], [0.5, -0.8, 0], fill_color="#B7A99A", fill_opacity=1, stroke_color=INK, stroke_width=3).scale(s)
    chim = rr(0.25 * s, 1.0 * s, "#8A7F74", x=0.3 * s, y=0.55 * s, sw=3, r=0.02)
    smoke = VGroup(*[Circle(radius=(0.13 + 0.05 * i) * s, fill_color="#9AA3AB", fill_opacity=0.7, stroke_width=0)
                     .move_to([(0.35 + 0.22 * i) * s, (1.2 + 0.22 * i) * s, 0]) for i in range(3)])
    ax = VGroup(Line([0.75 * s, -0.8 * s, 0], [1.75 * s, -0.8 * s, 0]), Line([0.75 * s, -0.8 * s, 0], [0.75 * s, 0.6 * s, 0]))
    ax.set_stroke(INK, 3)
    up = VGroup(Line([0.8 * s, -0.6 * s, 0], [1.15 * s, -0.35 * s, 0]), Line([1.15 * s, -0.35 * s, 0], [1.4 * s, -0.1 * s, 0]),
                Line([1.4 * s, -0.1 * s, 0], [1.7 * s, 0.45 * s, 0]))
    up.set_stroke(RED, 6)
    return VGroup(smoke, chim, bld, ax, up)


def expo(s=1.0):
    scr = rr(2.2 * s, 1.3 * s, "#1D2B3A", y=0.35 * s, stroke="#9AA7B5", r=0.08)
    ai = T("인공지능", int(24 * s), "#7EC8F0").move_to(scr)
    rays = VGroup(*[Line([0, 0, 0], [0.22 * s, 0, 0], stroke_color="#FFD166", stroke_width=4)
                    .rotate(a, about_point=ORIGIN).shift(scr.get_corner(UP + RIGHT) + np.array([0.1, 0.1, 0]) * s) for a in (0, 0.6, 1.2)])
    stand = Line([0, -0.3 * s, 0], [0, -0.75 * s, 0], stroke_color="#9AA7B5", stroke_width=6)
    ppl = VGroup(person(1.0 * s, shirt="#F28B82").move_to([-0.75 * s, -0.95 * s, 0], aligned_edge=DOWN),
                 person(0.9 * s, shirt="#7EC8F0").move_to([0.75 * s, -0.95 * s, 0], aligned_edge=DOWN))
    return VGroup(stand, scr, ai, rays, ppl)


# ── 인구 구조 그래프 (앱 u4-1 '더 알아보기', 자료: 저출산고령사회위원회 · 2040·2070년은 예상 값) ──
POP = [("1960", 42.3, 54.8, 2.9), ("1980", 34.0, 62.2, 3.8), ("2000", 21.1, 71.7, 7.2),
       ("2020", 12.2, 72.1, 15.7), ("2040", 8.8, 56.8, 34.4), ("2070", 7.5, 46.1, 46.4)]


def pop_chart(W=9.6, row=0.5, gap=0.18, size=22):
    """띠그래프 판. 반환 그룹: .rows[i] = (이름, [띠 3개], [수 3개]), .legend"""
    g = VGroup()
    rows = []
    legend = VGroup()
    for i, n in enumerate(["만 0~14세", "만 15~64세", "만 65세 이상"]):
        sq = Rectangle(width=0.36, height=0.26, fill_color=POP_C[i], fill_opacity=1, stroke_width=0)
        legend.add(VGroup(sq, T(n, size, INK).next_to(sq, RIGHT, buff=0.12)))
    legend.arrange(RIGHT, buff=0.5)
    y = 0
    for i, (yr, *v) in enumerate(POP):
        name = T(yr + "년" + ("*" if i >= 4 else ""), size, INK)
        name.move_to([-W / 2 - 0.15, y, 0], aligned_edge=RIGHT)
        x = -W / 2
        bars, nums = VGroup(), VGroup()
        for k, val in enumerate(v):
            w = W * val / 100
            b_ = Rectangle(width=w, height=row, fill_color=POP_C[k], fill_opacity=1, stroke_color=PAPER, stroke_width=2)
            b_.move_to([x + w / 2, y, 0])
            t = T(f"{val}%", size - 4, PAPER if w > 0.6 else INK)
            if w > 0.6:
                t.move_to(b_)
            else:
                t.next_to(b_, RIGHT, buff=0.06)
            bars.add(b_)
            nums.add(t)
            x += w
        rows.append((name, bars, nums))
        g.add(name, bars, nums)
        y -= row + gap
    legend.next_to(g, UP, buff=0.3)
    note = T("* 앞으로를 예상한 값", size - 4, SOFT).next_to(g, DOWN, buff=0.15, aligned_edge=RIGHT)
    g.add(legend, note)
    g.rows, g.legend, g.note = rows, legend, note
    return g


# ── 문제 아이콘·이름표 ──
def p_icon(k, r=0.42):
    col = P_COL[k]
    if k == 0:      # 사람들
        g = VGroup()
        for dx, s in ((-0.36, 0.8), (0.36, 0.8), (0, 1.0)):
            g.add(Circle(radius=0.15 * s * r / 0.42, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=2)
                  .move_to([dx * r / 0.42, 0.18 * r / 0.42, 0]),
                  Arc(radius=0.26 * s * r / 0.42, start_angle=0, angle=PI, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=2)
                  .move_to([dx * r / 0.42, -0.22 * r / 0.42, 0]))
        return g
    if k == 1:      # 지구
        e = Circle(radius=r, fill_color="#3D7FD1", fill_opacity=1, stroke_color=INK, stroke_width=3)
        l1 = Polygon(*[np.array([x, y, 0]) * r for x, y in ((-0.6, 0.3), (-0.2, 0.55), (0.1, 0.25), (-0.15, -0.1), (-0.5, -0.2))],
                     fill_color="#5AA84A", fill_opacity=1, stroke_width=0)
        l2 = Polygon(*[np.array([x, y, 0]) * r for x, y in ((0.25, -0.2), (0.6, -0.05), (0.5, -0.5), (0.2, -0.6))],
                     fill_color="#5AA84A", fill_opacity=1, stroke_width=0)
        return VGroup(e, l1, l2)
    # 저울
    q = r / 0.42
    post = Line([0, -0.4 * q, 0], [0, 0.38 * q, 0], stroke_color=col, stroke_width=5)
    beam = Line([-0.45 * q, 0.28 * q, 0], [0.45 * q, 0.28 * q, 0], stroke_color=col, stroke_width=5)
    pans = VGroup(*[Arc(radius=0.17 * q, start_angle=PI, angle=PI, stroke_color=col, stroke_width=4, fill_color="#F2C94C", fill_opacity=1)
                    .move_to([sx * 0.45 * q, 0.02 * q, 0]) for sx in (-1, 1)])
    strings = VGroup(*[Line([sx * 0.45 * q, 0.28 * q, 0], [sx * 0.45 * q, 0.08 * q, 0], stroke_color=col, stroke_width=3) for sx in (-1, 1)])
    base = Line([-0.25 * q, -0.4 * q, 0], [0.25 * q, -0.4 * q, 0], stroke_color=col, stroke_width=6)
    return VGroup(post, beam, strings, pans, base)


def prob_tag(k, size=30, text=None):
    ic = p_icon(k, 0.3)
    t = T(text or P_NAME[k], size, P_COL[k])
    box = RoundedRectangle(corner_radius=0.16, width=t.width + ic.width + 0.65, height=max(t.height, ic.height) + 0.3,
                           fill_color=PAPER, fill_opacity=1, stroke_color=P_COL[k], stroke_width=4)
    VGroup(ic, t).arrange(RIGHT, buff=0.18).move_to(box)
    return VGroup(box, ic, t)


def chain(texts, col, w=2.9, h=1.5, size=22, gap=0.55, heads=None):
    """생각의 사슬: 상자들을 화살표로 이은 줄. texts: 줄마다 글(\n 줄바꿈), heads: 상자 위 작은 이름"""
    boxes = VGroup()
    for i, s in enumerate(texts):
        b_ = rr(w, h, PAPER, stroke=col, r=0.14)
        t = VGroup(*[T(x, size, INK) for x in s.split("\n")]).arrange(DOWN, buff=0.08)
        if t.width > w - 0.2:
            t.scale_to_fit_width(w - 0.2)
        t.move_to(b_)
        grp = VGroup(b_, t)
        if heads:
            hd = T(heads[i], size - 4, col).next_to(b_, UP, buff=0.08)
            grp.add(hd)
        boxes.add(grp)
    boxes.arrange(RIGHT, buff=gap, aligned_edge=DOWN)
    arrows = VGroup(*[Arrow(boxes[i][0].get_right(), boxes[i + 1][0].get_left(), buff=0.05, stroke_width=6, color=col,
                            max_tip_length_to_length_ratio=0.45) for i in range(len(texts) - 1)])
    g = VGroup(boxes, arrows)
    g.boxes, g.arrows = boxes, arrows
    return g


# ── 해결 그림 ──
def solar_panel(s=1.0):
    pnl = Polygon([-0.8, -0.2, 0], [-0.5, 0.45, 0], [0.8, 0.45, 0], [0.5, -0.2, 0],
                  fill_color="#2B4C7E", fill_opacity=1, stroke_color="#9AB", stroke_width=3).scale(s)
    lines = VGroup(*[Line(np.array([(-0.8 + 1.3 * u) * s, -0.2 * s, 0]), np.array([(-0.5 + 1.3 * u) * s, 0.45 * s, 0]),
                          stroke_color="#9AB", stroke_width=2) for u in (1 / 3, 2 / 3)])
    hl = Line(np.array([-0.65 * s, 0.125 * s, 0]), np.array([0.65 * s, 0.125 * s, 0]), stroke_color="#9AB", stroke_width=2)
    leg = Line([0, -0.2 * s, 0], [0, -0.7 * s, 0], stroke_color="#6B7C8F", stroke_width=6)
    sun = VGroup(Circle(radius=0.25 * s, fill_color="#FFC93C", fill_opacity=1, stroke_width=0),
                 *[Line([0.33 * s, 0, 0], [0.45 * s, 0, 0], stroke_color="#F0A020", stroke_width=4).rotate(a * PI / 4, about_point=ORIGIN)
                   for a in range(8)]).move_to([0.75 * s, 0.95 * s, 0])
    return VGroup(leg, pnl, lines, hl, sun)


def lock_icon(s=1.0, col="#C07A12"):
    shackle = Arc(radius=0.3 * s, start_angle=0, angle=PI, stroke_color=col, stroke_width=10 * s).move_to([0, 0.38 * s, 0])
    legs = VGroup(Line([-0.3 * s, 0.25 * s, 0], [-0.3 * s, 0.05 * s, 0]), Line([0.3 * s, 0.25 * s, 0], [0.3 * s, 0.05 * s, 0]))
    legs.set_stroke(col, 10 * s)
    body = rr(0.95 * s, 0.75 * s, "#FFD166", y=-0.25 * s, stroke=col, r=0.1 * s)
    hole = VGroup(Dot([0, -0.18 * s, 0], radius=0.08 * s, color=INK), Line([0, -0.2 * s, 0], [0, -0.42 * s, 0], stroke_color=INK, stroke_width=6 * s))
    return VGroup(shackle, legs, body, hole)


def icon_card(pic, title, lines, w=3.9, h=3.4, col=INK, size=24, head=28, pic_h=1.2):
    """그림 + 제목 + 설명 줄 카드"""
    box = rr(w, h, PAPER, stroke=col, r=0.18)
    fit(pic, w - 0.6, pic_h)
    pic.move_to(box.get_top() + DOWN * (0.25 + pic_h / 2))
    t = T(title, head, col).next_to(pic, DOWN, buff=0.18)
    if t.width > w - 0.3:
        t.scale_to_fit_width(w - 0.3)
    body = VGroup(*[M(x, size) for x in lines]).arrange(DOWN, buff=0.1)
    if body.width > w - 0.3:
        body.scale_to_fit_width(w - 0.3)
    body.next_to(t, DOWN, buff=0.15)
    g = VGroup(box, pic, t, body)
    g.box, g.pic, g.title, g.body = box, pic, t, body
    return g


# ── 마무리: 다음 영상 줄 없이 ──
class NoNextClosing:
    """series_style.EpisodeScene.closing은 next_preview가 비어 있어도 '다음 영상' 이름표를 그리고 그 뒤를 빈칸으로 둠.
    단원·시리즈의 마지막 편은 이 섞음 클래스를 먼저 물려받아, 다음 영상이 없으면 그 줄을 그리지 않고 핵심 카드를 가운데에 둠.
    (그 밖은 공통 closing과 같음: 10초, 오늘의 핵심 + 카드 + 왼쪽 아래 시리즈 표시)"""

    def closing(self, summary_markup, next_preview=""):
        if next_preview:
            return super().closing(summary_markup, next_preview=next_preview)
        from manim import DL
        self.settle()
        t0 = self.now()
        self._section = "마무리"
        self.clear_sub()
        self.hide_chip()
        head = T("오늘의 핵심", 64, self.accent)
        body = M(summary_markup, 58)
        if body.width > 12.4:
            body.scale_to_fit_width(12.4)
        card = RoundedRectangle(corner_radius=0.35, width=13.2, height=body.height + 1.3,
                                fill_color=PAPER, fill_opacity=1, stroke_color=self.accent, stroke_width=6)
        body.move_to(card)
        box = VGroup(card, body)
        VGroup(head, box).arrange(DOWN, buff=0.45).move_to([0, 0.45, 0])
        mag = self.icon(0.32)
        series = T(f"「{self.SERIES}」 {self.ep_label()}", 34, SOFT)
        logo = VGroup(mag, series).arrange(RIGHT, buff=0.3).to_corner(DL, buff=0.45)
        self._log.append((t0, "마무리", plain(summary_markup), plain(summary_markup)))
        self.play(FadeIn(head, shift=DOWN * 0.2), FadeIn(logo), run_time=0.6)
        self.play(FadeIn(box, scale=0.95), run_time=0.9)
        self.wait(max(0.0, 10.0 - 0.8 - (self.now() - t0)))
        self.play(FadeOut(VGroup(head, box, logo)), run_time=0.8)
