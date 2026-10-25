"""「과학 원리 돋보기」 5학년 9화 — 빛을 거울에 비추면? (5-1 2단원 빛의 성질 5차시, 화 코드 5-1-2-c)

바탕: grade5/science/sem1/u2-3.html(원본 _build_tb/src/u2-3.html) — 도입(창문으로 들어온 햇빛이 책상 위 거울에 닿아 천장을 비춤,
천장의 전등은 꺼짐), 실험해요 1(흰 종이 위에 수직으로 세운 평면거울에 레이저 지시기의 빛을 여러 방향으로 비추기(위에서 본 모습)
→ 방향이 바뀌어 나아가요, 안전: 레이저 빛을 사람·눈에 비추지 않기·레이저 보안경·거울이 깨지지 않게), 실험해요 2(거울에 비춘 빛으로
세모·네모·원 모양판 맞히기, 지나치게 경쟁하지 않고 차례대로), 정리해요(빛의 반사: 빛이 직진하다가 거울에 부딪치면 나아가는 방향이
바뀜, 물체가 반사한 빛이 눈에 들어와 물체를 봄, 산꼭대기 거울로 그늘진 마을에 햇빛 — 노르웨이 리우칸 마을), 한눈에 쏙(반사한 빛,
스마트 기기 화면·호수·자동차 표면 / 그림자는 직진).
들어간 각과 나온 각이 같게 그림(앱에 '입사각·반사각'이라는 말이 없어 말로는 하지 않음).
최종: ./make_final.sh s5ep09
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Polygon,
                   Rectangle, Line, Ellipse, Flash)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def laser_at(tip, deg, s=1.0):
    """빛 나오는 곳이 tip, 방향 deg(도)인 레이저 지시기"""
    lz = K.laser(s)
    lz.rotate(np.radians(deg), about_point=np.array([0.0, 0, 0]))
    off = np.array([np.cos(np.radians(deg)), np.sin(np.radians(deg)), 0]) * 0.07 * s
    lz.shift(np.array([tip[0], tip[1], 0]) - off)
    return lz


class S5Ep09(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 9
    EP_TITLE = "빛을 거울에 비추면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.lab1()
        self.lab2()
        self.reflection()
        self.town()
        self.summary()
        self.closing(f"빛이 거울에 부딪쳐 나아가는 방향이 바뀌는 성질 = {g('빛의 반사')}",
                     next_preview="5학년 10화 · 렌즈와 물을 지날 때")
        self.wait(0.5)

    # ── 궁금해요: 천장의 밝은 빛 ──
    def intro(self):
        self.section("궁금해요")
        pn = K.panel(12.4, 4.6, "#FBF4E6", 0, 0.45)
        ceil = Rectangle(width=12.3, height=0.3, fill_color="#EFE3C8", fill_opacity=1, stroke_width=0).move_to([0, 2.58, 0])
        lwall = Rectangle(width=0.35, height=4.5, fill_color="#E8DCC0", fill_opacity=1, stroke_width=0).move_to([-6.0, 0.45, 0])
        win = Rectangle(width=0.32, height=0.9, fill_color="#BFE6FB", fill_opacity=1, stroke_color="#8A6A3E", stroke_width=4).move_to([-6.0, 1.9, 0])
        wl = T("창문", 24, "#8A6A3E").move_to([-5.35, 1.25, 0])
        desk = VGroup(Rectangle(width=5.0, height=0.18, fill_color="#A87B4F", fill_opacity=1, stroke_width=0).move_to([-0.3, -1.05, 0]),
                      Rectangle(width=0.16, height=0.7, fill_color="#8A6A3E", fill_opacity=1, stroke_width=0).move_to([-2.5, -1.5, 0]),
                      Rectangle(width=0.16, height=0.7, fill_color="#8A6A3E", fill_opacity=1, stroke_width=0).move_to([1.9, -1.5, 0]))
        MX, MY = -0.5, -0.92
        mir = Rectangle(width=1.2, height=0.1, fill_color=K.MIRROR, fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([MX, MY, 0])
        ml = T("거울", 24, "#0F3B5C").move_to([MX, -1.4, 0])
        lamp = Rectangle(width=1.0, height=0.12, fill_color="#DDDDDD", fill_opacity=1, stroke_width=0).move_to([2.4, 2.37, 0])
        ll = T("전등(꺼짐)", 22, "#888888").move_to([2.4, 2.0, 0])
        a = np.radians(30)
        wx = -5.85
        wy = MY + (MX - wx) * np.tan(a)
        cx = MX + (2.43 - MY) / np.tan(a)
        spot = Ellipse(width=0.9, height=0.22, fill_color="#FFF59A", fill_opacity=1, stroke_width=0).move_to([cx, 2.4, 0])
        self.say("천장을 비추는 밝은 빛은 어디에서 온 것일까요?",
                 "천장의 전등은 꺼져 있는데, 천장을 비추는 이 빛은 어디에서 온 것일까요?")
        self.play(FadeIn(VGroup(pn, ceil, lwall, win, wl, desk, mir, ml, lamp, ll, spot)), run_time=0.8)
        self.play(Indicate(spot, color=ORANGE, scale_factor=1.3), run_time=0.8)
        self.settle()
        self.pause_screen(5, "천장의 빛은 어디에서 왔을까요?")
        path = K.ray([[wx, wy], [MX, MY + 0.05], [cx, 2.4]], col=K.SUNC, sw=7)
        self.say("빛이 지나온 길을 따라가 봐요", "빛이 지나온 길을 따라가 봐요.")
        K.play_ray(self, path, 2.0)
        self.settle()
        self.say(f"햇빛이 {o('거울')}을 만나 방향이 바뀌어 천장을 비췄어요",
                 "창밖에서 들어온 햇빛이 거울을 만나 방향이 바뀌어 천장을 비춘 거예요. 거울은 스스로 빛을 내지 않아요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 1: 평면거울에 비추기(위에서 본 모습) ──
    def lab1(self):
        self.section("실험해요 1")
        box = (-6.1, 6.1, -1.85, 2.65)
        paper = K.panel(12.2, 4.5, PAPER, 0, 0.4, stroke=SOFT)
        ma, mb = (3.7, -1.35), (3.7, 2.2)
        mir = K.plane_mirror(ma, mb)
        mlab = T("평면거울", 26, "#0F3B5C").move_to([4.75, 2.25, 0])
        top = T("위에서 내려다본 모습", 24, SOFT).move_to([-4.6, 2.3, 0])
        self.say("흰 종이 위에 평면거울을 수직으로 세워요",
                 "흰 종이를 깔고 받침대에 끼운 평면거울을 수직으로 세웠어요. 위에서 내려다본 모습이에요.")
        self.play(FadeIn(paper), FadeIn(mir), FadeIn(mlab), FadeIn(top), run_time=0.7)
        self.settle()
        safe = K.safety_note("레이저 지시기의 빛을 사람에게, 특히 눈에 비추지 않아요. 레이저 보안경을 써요. 거울이 깨지지 않게 조심해요.",
                             w=12.6, size=25).move_to([0, -2.3, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.say(f"레이저 빛을 {r('사람에게 비추지 않아요')}",
                 "레이저 지시기의 빛을 사람에게, 특히 눈에 비추지 않아요. 레이저 보안경을 쓰고, 거울이 깨지지 않게 조심해요.")
        self.settle()
        self.play(FadeOut(safe), run_time=0.3)
        shots = [((-4.6, 1.7), -14), ((-4.6, -1.0), 13), ((-4.6, 0.6), -4)]
        olds = VGroup()
        lz = None
        for k, (p, deg) in enumerate(shots):
            pts, _ = K.mirror_bounce(p, K.deg_dir(deg), mb, ma, box)
            new_lz = laser_at(p, deg)
            if lz is None:
                lz = new_lz
                self.play(FadeIn(lz), run_time=0.4)
            else:
                self.play(Transform(lz, new_lz), run_time=0.5)
            if k == 0:
                first = K.ray(pts[:2], col=K.LASER, sw=6)
                self.say("교실을 어둡게 하고 레이저 지시기를 거울을 향해 켜요",
                         "교실을 어둡게 하고 레이저 지시기를 거울을 향해 켜요.")
                K.play_ray(self, first, 0.8)
                self.settle()
                self.pause_screen(5, "거울에 닿은 빛은 어떻게 될까요?")
                second = K.ray(pts[1:], col=K.LASER, sw=6)
                K.play_ray(self, second, 0.9)
                cur = VGroup(first, second)
                self.say(f"거울에 부딪친 빛은 나아가는 {o('방향이 바뀌어요')}",
                         "거울에 부딪친 빛은 사라지지 않고, 나아가는 방향이 바뀌어 다시 곧게 나아가요.")
                self.settle()
                self.say("여러 방향으로 비추어 봐요", "위치와 방향을 바꾸어 여러 번 비추어 봐요.")
            else:
                cur = K.ray(pts, col=K.LASER, sw=6)
                K.play_ray(self, cur, 1.2)
            self.play(cur.animate.set_opacity(0.3), run_time=0.3)
            olds.add(cur)
        self.settle()
        self.say(f"어느 방향으로 비추어도 거울에서 {o('방향이 바뀌어')} 곧게 나아가요",
                 "어느 방향으로 비추어도 빛은 거울에서 나아가는 방향이 바뀌고, 다시 곧게 나아가요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 2: 모양판 맞히기 ──
    def lab2(self):
        self.section("실험해요 2")
        box = (-6.1, 6.1, -1.85, 2.65)
        paper = K.panel(12.2, 4.5, PAPER, 0, 0.4, stroke=SOFT)
        ma, mb = (4.0, -1.3), (4.0, 2.1)
        mir = K.plane_mirror(ma, mb)
        L0 = np.array([-0.4, -0.3])
        tg = {"tri": K.target("tri", -3.0, 2.0), "sq": K.target("sq", -5.0, 0.9), "ci": K.target("ci", -4.2, -1.2)}
        hits = VGroup(*[T(t, 30, SOFT) for t in ("▲ 세모", "■ 네모", "● 원")]).arrange(RIGHT, buff=0.5).move_to([1.0, -1.5, 0])
        self.say("거울에 비춘 빛으로 세모·네모·원을 맞혀요",
                 "모양판을 세우고 조금 떨어진 곳에 평면거울을 세웠어요. 거울에 비춘 빛으로 세모, 네모, 원을 모두 맞혀 봐요.")
        lz = laser_at(L0, 0)
        self.play(FadeIn(paper), FadeIn(mir), *[FadeIn(v) for v in tg.values()], FadeIn(hits), FadeIn(lz), run_time=0.8)
        self.settle()
        self.pause_screen(5, "어느 쪽으로 비추어야 할까요?")
        names = {"tri": 0, "sq": 1, "ci": 2}
        for key in ("tri", "sq", "ci"):
            t = tg[key].shape.get_center()
            img = K.reflect_point(t[:2], ma, mb)
            d = K.unit(img - L0)
            deg = np.degrees(np.arctan2(d[1], d[0]))
            tip = L0
            q = tip + d * ((ma[0] - tip[0]) / d[0])
            self.play(Transform(lz, laser_at(L0, deg)), run_time=0.5)
            rr = K.ray([tip, q, t[:2]], col=K.LASER, sw=6)
            K.play_ray(self, rr, 1.0)
            self.play(tg[key].shape.animate.set_color(GREEN), hits[names[key]].animate.set_color(GREEN),
                      Flash(t, color=K.LASER, line_length=0.25, num_lines=10), run_time=0.5)
            self.play(rr.animate.set_opacity(0.3), run_time=0.2)
            if key == "tri":
                self.say(f"거울에서 방향이 바뀐 빛이 {g('세모')}를 맞혔어요!",
                         "거울에서 방향이 바뀐 빛이 세모에 닿았어요!")
                self.settle()
        self.say(f"레이저나 거울의 방향을 바꾸면 빛의 {o('방향')}도 바뀌어요",
                 "레이저 지시기나 거울의 방향을 바꾸면 빛이 나아가는 방향도 바뀌어요. 친구와 차례대로 해요.")
        self.settle()
        clear_stage(self)

    # ── 정리해요: 빛의 반사 ──
    def reflection(self):
        self.section("정리해요")
        card = K.text_card([f"빛이 직진하다가 거울에 부딪치면 나아가는 방향이 바뀌어요",
                            f"이러한 빛의 성질을 {g('빛의 반사')}라고 해요"], w=12.4, size=38).move_to([0, 1.65, 0])
        self.say(f"이런 빛의 성질을 {g('빛의 반사')}라고 해요",
                 "빛이 직진하다가 거울에 부딪치면 나아가는 방향이 바뀌어요. 빛의 이러한 성질을 빛의 반사라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        sun = K.sun_s(0.42).move_to([-5.0, 0.05, 0])
        ap = K.apple(0.9).move_to([-0.6, -1.45, 0])
        ey = K.eye(1.2, LEFT).move_to([4.6, -0.45, 0])
        self.play(FadeIn(sun), FadeIn(ap), FadeIn(ey), run_time=0.5)
        self.say("우리는 어떻게 사과를 볼 수 있을까요?", "그럼 우리는 어떻게 사과를 볼 수 있을까요?")
        self.settle()
        r1 = K.ray([[-4.4, -0.25], ap.get_left() + RIGHT * 0.1 + UP * 0.15], col=K.SUNC, sw=6)
        r2 = K.ray([ap.get_right() + LEFT * 0.1 + UP * 0.15, ey.get_left() + RIGHT * 0.1], col=RED, sw=6)
        K.play_ray(self, r1, 0.7)
        K.play_ray(self, r2, 0.7)
        self.say(f"물체가 {o('반사한 빛')}이 우리 눈에 들어오기 때문이에요",
                 "햇빛이 사과에 닿아 반사되고, 사과가 반사한 빛이 우리 눈에 들어오기 때문이에요.")
        self.settle()
        clear_stage(self)

    # ── 생활 속: 산꼭대기 거울 ──
    def town_scene(self, lit, ang_ok=True):
        pn = K.panel(12.4, 4.6, "#CFE9F7", 0, 0.45)
        gy = -1.6
        lm = Polygon([-6.15, gy, 0], [-4.0, 1.5, 0], [-1.6, gy, 0], fill_color="#6B8F5A", fill_opacity=1, stroke_width=0)
        rm = Polygon([1.4, gy, 0], [3.8, 1.8, 0], [6.15, 0.3, 0], [6.15, gy, 0], fill_color="#5D7F4D", fill_opacity=1, stroke_width=0)
        gnd = Rectangle(width=12.3, height=0.25, fill_color="#7AA35F", fill_opacity=1, stroke_width=0).move_to([0, gy - 0.1, 0])
        sun_c = np.array([5.5, 2.3])
        sun = K.sun_s(0.38).move_to([sun_c[0], sun_c[1], 0])
        peak = np.array([3.8, 1.8])
        dsh = K.unit(peak - sun_c)
        xg = peak[0] + dsh[0] * ((gy - peak[1]) / dsh[1])
        if xg < -6.15:
            yl = peak[1] + dsh[1] * ((-6.15 - peak[0]) / dsh[0])
            spts = [[peak[0], peak[1], 0], [-6.15, yl, 0], [-6.15, gy, 0], [1.4, gy, 0]]
        else:
            spts = [[peak[0], peak[1], 0], [xg, gy, 0], [1.4, gy, 0]]
        shade = Polygon(*spts, fill_color="#2C3E50",
                        fill_opacity=0.08 if lit else 0.35, stroke_width=0)
        houses = VGroup()
        for i, x in enumerate((-0.6, 0.15, 0.9)):
            hh = 0.45 + 0.12 * (i % 2)
            body = Rectangle(width=0.5, height=hh, fill_color="#F6E7C8" if lit else "#9C927F", fill_opacity=1,
                             stroke_width=0).move_to([x, gy + hh / 2, 0])
            roof = Polygon([x - 0.32, gy + hh, 0], [x + 0.32, gy + hh, 0], [x, gy + hh + 0.3, 0],
                           fill_color="#D35400" if lit else "#7A5A45", fill_opacity=1, stroke_width=0)
            houses.add(body, roof)
        vl = T("그늘진 마을" if not lit else "밝아진 마을", 24, "#0F3B5C").move_to([0.15, -0.35, 0])
        grp = VGroup(pn, shade, lm, rm, gnd, houses, sun, vl)
        M_ = np.array([-4.0, 1.62])
        vil = np.array([0.15, gy + 0.6])
        din = K.unit(M_ - sun_c)
        dout = K.unit(vil - M_)
        N = K.unit(dout - din)
        u = np.array([N[1], -N[0]])
        mir = K.plane_mirror(M_ - u * 0.38, M_ + u * 0.38, back=0.1)
        grp.add(mir)
        grp.sun_c, grp.M, grp.vil = sun_c, M_, vil
        return grp

    def town(self):
        self.section("생활 속 반사")
        sc = self.town_scene(False)
        self.say("높은 산으로 둘러싸여 해가 들지 않는 마을이 있어요",
                 "높은 산에 가려 햇빛이 들지 않는 마을이 있어요.")
        self.play(FadeIn(sc), run_time=0.8)
        self.settle()
        self.say(f"산꼭대기에 커다란 {o('거울')}을 설치했어요. 왜일까요?",
                 "그래서 산꼭대기에 커다란 거울을 설치했어요. 왜 거울을 설치했을까요?")
        self.settle()
        self.pause_screen(5, "산꼭대기에 거울을 설치한 까닭은?")
        rr = K.ray([sc.sun_c + K.unit(sc.M - sc.sun_c) * 0.55, sc.M, sc.vil], col=K.SUNC, sw=7)
        K.play_ray(self, rr, 1.8)
        lit = self.town_scene(True)
        self.play(Transform(sc, lit), run_time=0.8)
        self.say(f"거울이 햇빛을 {o('반사')}해 그늘진 마을에 햇빛이 들어요",
                 "산꼭대기의 거울이 햇빛을 반사해 그늘진 마을에 햇빛이 들게 해요. 노르웨이의 리우칸 마을은 실제로 산꼭대기에 커다란 거울을 설치했어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"우리가 물체를 볼 수 있는 까닭은 물체가 {g('반사')}한 빛이",
                            "우리 눈에 들어오기 때문입니다."], w=12.0, size=34).move_to([0, 2.0, 0])
        self.say(f"물체가 {g('반사')}한 빛이 눈에 들어와 물체를 볼 수 있어요",
                 "우리가 물체를 볼 수 있는 까닭은 물체가 반사한 빛이 우리 눈에 들어오기 때문입니다.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        items = [("꺼진 스마트 기기 화면에 얼굴이 비쳐요", True), ("잔잔한 호수에 주변 경치가 비쳐요", True),
                 ("매끄러운 자동차 표면에 얼굴이 비쳐요", True), ("햇빛을 받은 나무 뒤에 그림자가 생겨요", False)]
        cards = VGroup(*[K.text_card([t], w=6.3, size=25) for t, _ in items]).arrange_in_grid(2, 2, buff=(0.3, 0.3)).move_to([0, -0.55, 0])
        for c in cards:
            c[1].shift(LEFT * 0.25)
        self.say("거울처럼 빛의 반사가 일어나는 것을 골라 봐요",
                 "거울처럼 빛의 반사가 일어나는 현상을 모두 골라 봐요.")
        self.play(FadeIn(cards, lag_ratio=0.1), run_time=0.8)
        self.settle()
        marks = VGroup(*[K.ox_mark(ok, 0.2).move_to(c.get_right() + LEFT * 0.36) for c, (_, ok) in zip(cards, items)])
        self.play(*[c[0].animate.set_stroke(GREEN if ok else RED, 6) for c, (_, ok) in zip(cards, items)],
                  FadeIn(marks, lag_ratio=0.1), run_time=0.8)
        self.say(f"매끄러운 면은 거울처럼 빛을 반사해요. 그림자는 {o('직진')}이에요",
                 "매끄러운 표면에서는 거울처럼 빛이 반사되어 모습이 비쳐요. 그림자는 빛의 직진 때문에 생겨요.")
        self.settle()
        clear_stage(self)
