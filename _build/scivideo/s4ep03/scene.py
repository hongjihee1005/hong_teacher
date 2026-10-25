"""「과학 원리 돋보기」 4학년 3화 — 자석의 극 (4-1 1단원 자석의 이용 4차시, 화 코드 4-1-1-c)

바탕: grade4/science/sem1/u1-3.html(원본 _build_tb/src/u1-3.html) — 도입(쏟아진 철 클립을 모으려면 자석의 어느 부분?),
예상(빵 끈 조각이 골고루/양쪽 끝/가운데), 실험(막대자석·둥근기둥 모양 자석을 빵 끈 조각 그릇에 넣었다가 들어 올리기 →
양쪽 끝부분에 가장 많이, 가운데는 거의 없음), 자석의 극(막대·둥근기둥은 양쪽 끝, 고리 자석은 앞면·뒷면, 공 모양 자석),
하나의 자석에 극 두 개 — N극과 S극, 형성 평가(양쪽 끝이 모두 N극은 틀림), 한눈에 쏙 '자석의 극'.
최종: ./make_final.sh s4ep03
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circle, Ellipse,
                   SurroundingRectangle, Wiggle, rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def n_(s):
    return f'<span foreground="{K.NC}">{s}</span>'


def s_(s):
    return f'<span foreground="{K.SC}">{s}</span>'


class S4Ep03(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 3
    EP_TITLE = "자석의 극"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.predict()
        self.experiment()
        self.poles()
        self.correct()
        self.summary()
        self.closing(f"자석에서 철로 만든 물체가 가장 많이 붙는 곳이 {o('극')}이고,\n"
                     f"한 자석에는 {n_('N극')}과 {s_('S극')}, 두 개의 극이 있어요",
                     next_preview="4학년 4화 · 자석과 자석이 만나면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        rng = np.random.default_rng(5)
        clips = VGroup()
        for _ in range(22):
            c = K.fit(K.clip(), 0.75, 0.27).rotate(rng.random() * PI)
            c.move_to([-3.0 + rng.random() * 6.0, -1.9 + rng.random() * 1.0, 0])
            clips.add(c)
        tbl = K.rect(12.4, 0.1, "#C9B27A", y=-2.35, sw=0)
        mag = K.bar_magnet("N", 3.2, 0.7).move_to([0, 1.3, 0])
        self.say("쏟아진 철 클립을 편리하게 모으려면?", "철 클립이 책상 위에 쏟아졌어요. 편리하게 모으려면 어떻게 해야 할까요?")
        self.play(FadeIn(tbl), FadeIn(clips, lag_ratio=0.03), run_time=1.0)
        self.play(FadeIn(mag, shift=DOWN * 0.3), run_time=0.5)
        ends = VGroup(*[Circle(radius=0.55, stroke_color=ORANGE, stroke_width=6).move_to(mag.get_edge_center(d))
                        for d in (LEFT, RIGHT)])
        mid = Circle(radius=0.55, stroke_color=BLUE, stroke_width=6).move_to(mag.get_center())
        self.say(f"막대자석의 {o('끝부분')}? {b_('가운데')}? 어디나 똑같을까요?",
                 "막대자석의 어느 부분을 가까이 해야 더 빨리 모을 수 있을까요? 끝부분일까요, 넓적한 가운데일까요, 아니면 어느 부분이나 똑같을까요?")
        self.play(Create(ends), Create(mid), run_time=0.8)
        self.settle()
        self.pause_screen(5, "어느 부분을 가까이 할까요?")
        clear_stage(self)

    # ── 예상해요 ──
    def predict(self):
        self.section("예상해요")
        self.say("빵 끈 조각은 막대자석에 어떤 모양으로 붙을까요?",
                 "빵 끈 속에는 가는 철사가 들어 있어요. 빵 끈 조각이 든 그릇에 막대자석을 넣었다가 꺼내면 어떻게 붙을까요?")
        opts = VGroup()
        names = ["골고루 붙어요", "양쪽 끝부분에 많이", "가운데에 많이"]
        rng = np.random.default_rng(2)
        for i, nm in enumerate(names):
            m = K.bar_magnet("N", 2.6, 0.5, label=False)
            ties = VGroup()
            for j in range(18):
                a = rng.random() * PI
                if i == 0:
                    x, y = -1.2 + j * 0.14, (0.4 if j % 2 else -0.4)
                elif i == 1:
                    sd = 1 if j % 2 else -1
                    x, y = sd * (1.3 - (j % 5) * 0.07) + sd * 0.12, ((j % 7) - 3) * 0.13
                else:
                    x, y = -0.5 + (j % 9) * 0.12, (0.4 if j % 2 else -0.4)
                ties.add(K.tie(x, y, a, 0.3, sw=6))
            box = K.rect(3.9, 2.6, PAPER, stroke=SOFT, sw=3, r=0.2)
            grp = VGroup(box, m, ties, T(nm, 30).move_to([0, -0.95, 0]))
            VGroup(m, ties).shift(UP * 0.25)
            grp.move_to([(i - 1) * 4.3, 0.6, 0])
            opts.add(grp)
        self.play(FadeIn(opts, lag_ratio=0.2), run_time=1.0)
        self.say("내 생각을 정하고, 까닭도 친구에게 말해 봐요",
                 "정답을 맞히는 것이 아니라 내 생각을 정하는 시간이에요. 까닭도 친구에게 말해 봐요.")
        self.pause_screen(5, "빵 끈 조각은 어디에 많이 붙을까요?")
        clear_stage(self)

    # ── 실험해요 ──
    def dip(self, mag, L_, H, seed, n, name):
        bw = K.bowl(4.6, 1.1).move_to([0, -1.75, 0])
        heap = K.ties_heap(-1.9, 1.9, -2.15, -1.4, 50, seed)
        mag.move_to([0, 1.5, 0])
        lab = T(name, 36).move_to([0, 2.6, 0])
        self.play(FadeIn(bw), FadeIn(heap), FadeIn(mag), FadeIn(lab), run_time=0.6)
        self.play(mag.animate.move_to([0, -1.55, 0]), run_time=1.0)
        self.play(mag.animate.shift(RIGHT * 0.25), run_time=0.15)
        self.play(mag.animate.shift(LEFT * 0.5), run_time=0.25)
        self.play(mag.animate.shift(RIGHT * 0.25), run_time=0.15)
        tf = K.tufts_bar(L_, H, n, seed).move_to(mag.get_center())
        tf.shift(mag.get_center() - tf.get_center())
        keep = VGroup(*heap[::3])
        self.remove(heap)
        self.add(keep, tf)
        self.play(VGroup(mag, tf).animate.move_to([0, 0.9, 0]), run_time=1.4)
        return VGroup(bw, keep, lab), tf

    def experiment(self):
        self.section("실험해요")
        self.say("빵 끈 조각이 든 그릇에 막대자석을 넣었다가 들어 올려요",
                 "빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 천천히 들어 올려 볼게요.")
        mag = K.bar_magnet("N", 3.4, 0.7)
        rest, tf = self.dip(mag, 3.4, 0.7, 11, 44, "막대자석")
        rings = VGroup(*[Ellipse(width=1.6, height=1.9, stroke_color="#FFC93C", stroke_width=8)
                         .move_to(mag.get_edge_center(d)) for d in (LEFT, RIGHT)])
        self.say(f"빵 끈 조각이 {o('양쪽 끝부분')}에 가장 많이 붙어요",
                 "빵 끈 조각이 막대자석의 양쪽 끝부분에 가장 많이 붙었어요.")
        self.play(Create(rings), run_time=0.7)
        self.say(f"가운데 부분에는 {r('거의 붙지 않아요')}", "가운데 부분에는 빵 끈 조각이 거의 붙지 않았어요.")
        self.play(Indicate(mag, color=BLUE, scale_factor=1.04), run_time=0.8)
        self.settle()
        self.play(FadeOut(VGroup(rest, tf, mag, rings)), run_time=0.5)
        self.say("둥근기둥 모양 자석으로도 해 봐요", "이번에는 둥근기둥 모양 자석으로도 해 봐요.")
        cyl = K.cyl_magnet(3.0, 0.75)
        rest, tf = self.dip(cyl, 3.0, 0.75, 29, 36, "둥근기둥 모양 자석")
        rings = VGroup(*[Ellipse(width=1.6, height=1.9, stroke_color="#FFC93C", stroke_width=8)
                         .move_to(cyl.get_edge_center(d)) for d in (LEFT, RIGHT)])
        self.play(Create(rings), run_time=0.6)
        self.say(f"둥근기둥 모양 자석도 {o('양쪽 끝부분')}에 많이 붙어요",
                 "둥근기둥 모양 자석도 양쪽 끝부분에 빵 끈 조각이 가장 많이 붙었어요.")
        self.settle()
        clear_stage(self)

    # ── 자석의 극 ──
    def poles(self):
        self.section("자석의 극")
        card = K.text_card([f"자석에서 철로 만든 물체가 {o('가장 많이 붙는 부분')}을", f"자석의 {r('극')}이라고 해요."],
                           w=11.5, size=44).move_to([0, 1.9, 0])
        self.say(f"철이 가장 많이 붙는 부분을 자석의 {r('극')}이라고 해요",
                 "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 자석의 극이라고 해요.")
        self.play(FadeIn(card), run_time=0.7)
        # 여러 모양 자석
        xs = [-5.0, -1.7, 1.6, 4.9]
        y0 = -0.75
        bar = K.bar_magnet("N", 2.2, 0.45, label=False)
        bt = K.tufts_bar(2.2, 0.45, 22, 3)
        cyl = K.cyl_magnet(1.9, 0.55)
        ct = K.tufts_bar(1.9, 0.55, 20, 5)
        ring = K.ring_side(1.4)
        rng = np.random.default_rng(9)
        rt = VGroup(*[K.tie(sd * (0.38 + rng.random() * 0.2), (rng.random() - 0.5) * 1.3, (rng.random() - 0.5) * 1.2, 0.28)
                      for sd in [(-1) ** k for k in range(16)]])
        ball = K.ball_magnet(0.55)
        bat = VGroup(*[K.tie(np.sin(a) * 0.5, sd * (0.66 + rng.random() * 0.15), PI / 2 + a, 0.28)
                       for sd, a in [((-1) ** k, (rng.random() - 0.5) * 1.4) for k in range(18)]])
        shapes = [VGroup(bar, bt), VGroup(cyl, ct), VGroup(ring, rt), VGroup(ball, bat)]
        names = ["막대자석", "둥근기둥 모양", "고리 자석(옆)", "공 모양 자석"]
        grp = VGroup()
        for sh, nm, x in zip(shapes, names, xs):
            sh.move_to([x, y0, 0])
            grp.add(VGroup(sh, T(nm, 28).move_to([x, y0 - 1.35, 0])))
        self.say("여러 가지 모양의 자석에서 극을 찾아요", "여러 가지 모양의 자석이에요. 빵 끈이 붙은 모습을 보고 극을 찾아봐요.")
        self.play(FadeIn(grp, lag_ratio=0.15), run_time=1.0)
        spots = [[bar.get_left(), bar.get_right()], [cyl.get_left(), cyl.get_right()],
                 [ring.get_left() + LEFT * 0.1, ring.get_right() + RIGHT * 0.1], [ball.get_top() + UP * 0.12, ball.get_bottom() + DOWN * 0.12]]
        dots = VGroup()
        for pair in spots:
            for p in pair:
                c = Circle(radius=0.2, fill_color="#FFC93C", fill_opacity=1, stroke_color="#B58400", stroke_width=3)
                dots.add(VGroup(c, T("극", 20).move_to(c)).move_to(p))
        self.say(f"모양은 달라도 극은 {o('두 군데')}예요", "모양은 달라도 한 자석에 극이 두 군데 있어요. 막대자석과 둥근기둥 모양 자석은 양쪽 끝부분, 고리 자석은 앞면과 뒷면이에요.")
        self.play(FadeIn(dots, lag_ratio=0.1), run_time=1.4)
        self.settle()
        self.pause_screen(5, "하나의 자석에는 극이 몇 개일까요?")
        self.play(FadeOut(VGroup(grp, dots)), run_time=0.4)
        big = K.bar_magnet("N", 5.0, 1.0).move_to([0, -0.6, 0])
        nl = T("N극", 44, K.NC).next_to(big, DOWN, buff=0.3).align_to(big, LEFT).shift(RIGHT * 0.6)
        sl = T("S극", 44, K.SC).next_to(big, DOWN, buff=0.3).align_to(big, RIGHT).shift(LEFT * 0.6)
        self.say(f"한 자석의 극은 두 개, {n_('N극')}과 {s_('S극')}이에요",
                 "하나의 자석에는 항상 두 개의 극이 있고, 각각 N극과 S극으로 나타내요.")
        self.play(FadeIn(big), run_time=0.5)
        self.play(FadeIn(nl), FadeIn(sl), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def correct(self):
        self.section("생각 바로잡기")
        q = M("“막대자석의 양쪽 끝에 있는 극은 모두 N극이야.”", 42).move_to([0.5, 2.2, 0])
        wrong = K.bar_magnet("N", 4.0, 0.8, label=False).move_to([0, 0.5, 0])
        wl = VGroup(T("N", 44, PAPER).move_to(wrong[0]), T("N", 44, PAPER).move_to(wrong[1]))
        wrong[1].set_fill(K.NC)
        self.say("양쪽 끝 극이 모두 N극일까요?", "한 친구가 막대자석의 양쪽 끝에 있는 극은 모두 N극이라고 말했어요. 맞을까요?")
        self.play(FadeIn(q), FadeIn(wrong), FadeIn(wl), run_time=0.7)
        x = K.ox_mark(False, 0.55).move_to(wrong.get_center())
        self.play(FadeIn(x, scale=1.4), run_time=0.4)
        right = K.bar_magnet("N", 4.0, 0.8).move_to([0, -1.1, 0])
        ok = K.ox_mark(True, 0.4).next_to(right, RIGHT, buff=0.4)
        self.say(f"한쪽 끝은 {n_('N극')}, 다른 쪽 끝은 {s_('S극')}이에요",
                 "틀렸어요. 막대자석의 한쪽 끝은 N극, 다른 쪽 끝은 S극이에요.")
        self.play(FadeIn(right), FadeIn(ok), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["자석에서 철로 만든 물체가 가장 많이 붙는 곳을",
                            f"자석의 {r('극')}이라고 합니다.",
                            f"자석의 극은 각각 {n_('N극')}과 {s_('S극')}으로 나타내요."], w=12.2, size=44).move_to([0, 0.6, 0])
        self.say(f"철이 가장 많이 붙는 곳이 자석의 {r('극')}이에요",
                 "자석에서 철로 만든 물체가 가장 많이 붙는 곳을 자석의 극이라고 해요. 자석의 극은 각각 N극과 S극으로 나타내요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'
