"""「과학 원리 돋보기」 4학년 2화 — 자석과 철 사이의 힘 (4-1 1단원 자석의 이용 3차시, 화 코드 4-1-1-b)

바탕: grade4/science/sem1/u1-2.html(원본 _build_tb/src/u1-2.html) — 도입(자석 낚시: 물고기 입의 철 조각),
실험해요 1(관찰 도움판: 막대자석을 천천히 밀면 철 클립이 닿기 전에 끌려와 붙음),
실험해요 2(바로·플라스틱판·종이판을 사이에 두고 들어 올리기 — 모두 딸려 올라옴),
다른 탐구(연필에 끼운 고리 자석이 철자 쪽으로 굴러감 — 철도 자석을 끌어당김), 정리(두 가지 특징),
생각+(물컵 속 철 클립을 컵 바깥 자석으로 끌어 올리기), 한눈에 쏙 '서로 끌어당기는 힘'.
최종: ./make_final.sh s4ep02
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circle,
                   RegularPolygon, Rotate, SurroundingRectangle, Arrow, rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S4Ep02(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 2
    EP_TITLE = "자석과 철 사이의 힘"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.fishing()
        self.board()
        self.lift()
        self.ring_roll()
        self.features()
        self.cup()
        self.summary()
        self.closing(f"자석과 철은 {o('약간 떨어져 있어도')},\n사이에 종이·플라스틱이 있어도 {g('서로 끌어당겨요')}",
                     next_preview="4학년 3화 · 자석의 극")
        self.wait(0.5)

    # ── 궁금해요: 자석 낚시 ──
    def fishing(self):
        self.section("궁금해요")
        pond = K.rect(12.6, 2.6, K.WATER, stroke=K.WATER_D, op=0.6, r=0.3).move_to([0, -1.2, 0])
        f1 = K.toy_fish("#FFB347", 1.6).move_to([-3.2, -1.3, 0])
        f2 = K.toy_fish("#C9A2FF", 1.6, face=LEFT).move_to([3.0, -1.0, 0])
        mouth_lab = T("입: 철 조각", 28, INK).next_to(f1.mouth, UP, buff=0.55).shift(RIGHT * 0.3)
        arr = Arrow(mouth_lab.get_bottom(), f1.mouth.get_top(), buff=0.06, color=INK, stroke_width=4,
                    max_tip_length_to_length_ratio=0.3)
        mag = K.rect(0.4, 0.5, K.NC, sw=3)
        rod_line = Line([0, 3.0, 0], [0, 0.25, 0], stroke_color=INK, stroke_width=3)
        rod = VGroup(rod_line, mag.move_to([0, 0.0, 0]))
        rod.move_to([-1.0, 1.4, 0])
        self.say("자석 낚싯대로 장난감 물고기를 낚아요", "자석 낚싯대로 장난감 물고기를 낚으려고 해요. 물고기 입에는 철 조각이 있어요.")
        self.play(FadeIn(pond), FadeIn(f1), FadeIn(f2), FadeIn(rod), run_time=0.8)
        self.play(Create(arr), run_time=0.3)
        self.play(FadeIn(mouth_lab), run_time=0.3)
        self.say("자석을 꼬리에 가까이 하면?", "낚싯대 끝의 자석을 물고기 꼬리에 가까이 하면 어떨까요?")
        tail = f1[0].get_center()
        self.play(rod.animate.shift(np.array([tail[0] - mag.get_center()[0], tail[1] + 0.45 - mag.get_center()[1], 0])),
                  run_time=1.0)
        self.say(f"꼬리 쪽은 {r('아무 일도 없어요')}", "꼬리 쪽은 아무 일도 없어요.")
        self.wait(0.6)
        self.pause_screen(5, "자석을 어디에 가까이 해야 할까요?")
        m_ = f1.mouth.get_center()
        self.play(rod.animate.shift(np.array([m_[0] - mag.get_center()[0], m_[1] + 0.5 - mag.get_center()[1], 0])),
                  FadeOut(VGroup(arr, mouth_lab)), run_time=1.0)
        self.play(f1.animate.shift(UP * (mag.get_bottom()[1] - f1.mouth.get_top()[1])), run_time=0.25)
        self.play(VGroup(rod, f1).animate.shift(UP * 1.6), run_time=0.9)
        self.say(f"물고기의 {o('철로 만든 부분(입)')}에 가까이 해요",
                 "자석을 물고기의 철로 만든 부분인 입에 가까이 해야 해요. 자석과 철 조각이 서로 끌어당겼어요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 1: 관찰 도움판 ──
    def board(self):
        self.section("실험해요 1")
        brd = K.rect(12.0, 2.2, "#FFF8E6", stroke="#C9B27A", sw=4, r=0.15).move_to([0, -0.2, 0])
        mag = K.bar_magnet("N", 2.8, 0.66).move_to([-4.3, -0.2, 0])
        cl = K.fit(K.clip(), 1.4, 0.5).move_to([3.4, -0.2, 0])
        lab = T("관찰 도움판", 30, SOFT).next_to(brd, UP, buff=0.15).align_to(brd, LEFT)
        self.say("관찰 도움판에 철 클립과 막대자석을 올려놓아요", "관찰 도움판에 철 클립과 막대자석을 올려놓았어요.")
        self.play(FadeIn(brd), FadeIn(lab), FadeIn(mag), FadeIn(cl), run_time=0.7)
        self.say(f"막대자석을 {o('천천히')} 철 클립 쪽으로 밀어요", "막대자석을 철 클립 쪽으로 천천히 밀어 볼게요.")
        self.pause_screen(5, "철 클립은 어떻게 움직일까요?")
        self.say("천천히, 천천히……", "천천히 밀어요.")
        gap = cl.get_left()[0] - mag.get_right()[0]
        self.play(mag.animate.shift(RIGHT * (gap - 1.1)), run_time=3.0, rate_func=rate_functions.linear)
        gap_line = VGroup(Line(mag.get_right() + UP * 0.6, cl.get_left() + UP * 0.6, stroke_color=ORANGE, stroke_width=5))
        gl = T("아직 닿지 않았는데", 30, ORANGE).next_to(gap_line, UP, buff=0.12)
        self.play(FadeIn(gap_line), FadeIn(gl), run_time=0.3)
        self.play(cl.animate.shift(LEFT * (cl.get_left()[0] - mag.get_right()[0])), FadeOut(gap_line), FadeOut(gl), run_time=0.25)
        pop = M(g("딱!"), 50).next_to(cl, UP, buff=0.5)
        self.play(FadeIn(pop, scale=1.4), run_time=0.3)
        self.say(f"철 클립이 {o('닿기 전에')} 자석 쪽으로 이동해서 붙어요",
                 "철 클립이 자석에 닿기 전에 자석 쪽으로 이동해서 붙었어요.")
        self.settle()
        self.say(f"자석과 철은 {g('약간 떨어져 있어도')} 서로 끌어당겨요",
                 "자석과 철 클립은 약간 떨어져 있어도 서로 끌어당겨요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 2: 사이에 판을 두고 ──
    def lift(self):
        self.section("실험해요 2")
        xs = [-4.4, 0.0, 4.4]
        names = ["바로 가까이", "플라스틱판을 대고", "종이판을 대고"]
        kinds = [None, "plastic", "paper"]
        heads = VGroup(*[T(n, 32).move_to([x, 2.55, 0]) for n, x in zip(names, xs)])
        table = VGroup(*[K.rect(3.6, 0.1, "#C9B27A", x=x, y=-1.85, sw=0) for x in xs])
        clips = VGroup(*[K.fit(K.clip(), 1.3, 0.45).move_to([x, -1.55, 0]) for x in xs])
        mags = VGroup(*[K.bar_magnet_v("N", 2.0, 0.55).move_to([x, 1.2, 0]) for x in xs])
        plates = VGroup()
        for k, x in zip(kinds, xs):
            if k:
                plates.add(K.plate(k, 2.4, 0.12).move_to([x, -0.95, 0]))
        self.say("세 가지 방법으로 막대자석을 철 클립에 가까이 해요",
                 "이번에는 세 가지 방법으로 막대자석을 철 클립에 가까이 한 다음 들어 올려 봐요.")
        self.play(FadeIn(heads), FadeIn(table), FadeIn(clips), FadeIn(mags), run_time=0.8)
        self.say("플라스틱판과 종이판을 사이에 놓아요", "가운데는 플라스틱판, 오른쪽은 종이판을 사이에 대요. 막대자석과 판을 붙인 채로 함께 들어 올려요.")
        self.play(FadeIn(plates), run_time=0.5)
        self.pause_screen(5, "판이 있어도 철 클립이 딸려 올까요?")
        # 내려가기
        tgt = [-1.55 + 0.3 + 0.5, -0.95 + 0.06 + 0.02, -0.95 + 0.06 + 0.02]
        self.play(*[m.animate.shift(DOWN * (m.get_bottom()[1] - t)) for m, t in zip(mags, tgt)], run_time=1.0)
        movers = []
        for i in range(3):
            top = mags[i].get_bottom()[1] if i == 0 else plates[i - 1].get_bottom()[1]
            movers.append(clips[i].animate.shift(UP * (top - clips[i].get_top()[1])))
        self.play(*movers, run_time=0.25)
        groups = [VGroup(mags[0], clips[0]), VGroup(mags[1], plates[0], clips[1]), VGroup(mags[2], plates[1], clips[2])]
        self.play(*[g_.animate.shift(UP * 0.9) for g_ in groups], run_time=1.0)
        oks = VGroup(*[K.ox_mark(True, 0.32).move_to([x + 1.35, -1.25, 0]) for x in xs])
        self.say(f"세 경우 모두 철 클립이 {g('딸려 올라와요')}", "세 경우 모두 철 클립이 딸려 올라왔어요.")
        self.play(FadeIn(oks, lag_ratio=0.2), run_time=0.7)
        self.say(f"{o('자석에 붙지 않는 물체')}가 사이에 있어도 서로 끌어당겨요",
                 "플라스틱이나 종이처럼 자석에 붙지 않는 물체가 사이에 있어도, 자석과 철은 서로 끌어당겨요.")
        self.settle()
        clear_stage(self)

    # ── 다른 탐구: 고리 자석 ──
    def ring_roll(self):
        self.section("같은 주제 다른 탐구")
        tbl = K.rect(12.4, 0.1, "#C9B27A", y=-1.3, sw=0)
        ring = VGroup(Circle(radius=0.75, fill_color="#5D6873", fill_opacity=1, stroke_color=INK, stroke_width=3),
                      RegularPolygon(6, radius=0.2, fill_color="#F2C14E", fill_opacity=1, stroke_color=INK,
                                     stroke_width=2),
                      Line([0, 0.3, 0], [0, 0.72, 0], stroke_color="#7D8A95", stroke_width=5))
        ring.move_to([-3.0, -1.25 + 0.75, 0])
        rl = T("연필에 끼운 고리 자석", 30).next_to(ring, UP, buff=0.3)
        ruler = K.fit(K.iron_ruler(), 3.0, 0.5).move_to([4.6, -0.5, 0])
        rul = T("철자", 30).next_to(ruler, UP, buff=0.2)
        self.say("철로 만든 물체도 자석을 끌어당길까요?", "그럼 반대로, 철로 만든 물체도 자석을 끌어당길까요?")
        self.play(FadeIn(tbl), FadeIn(ring), FadeIn(rl), FadeIn(ruler), FadeIn(rul), run_time=0.7)
        self.say(f"철자를 고리 자석에 {o('붙지 않게')} 가까이 가져가요",
                 "고리 자석 가운데에 연필을 끼워 세웠어요. 철자를 고리 자석에 붙지 않게 가까이 가져가 볼게요.")
        self.play(VGroup(ruler, rul).animate.shift(LEFT * 2.2), FadeOut(rl), run_time=1.0)
        self.pause_screen(5, "고리 자석은 어느 쪽으로 움직일까요?")
        d = ruler.get_left()[0] - 0.04 - ring.get_right()[0]
        self.play(ring.animate.shift(RIGHT * d).rotate(-d / 0.75), run_time=1.6, rate_func=rate_functions.ease_in_quad)
        self.say(f"고리 자석이 {o('철자 쪽으로')} 굴러갔어요", "고리 자석이 철자 쪽으로 굴러갔어요.")
        self.settle()
        self.say(f"철도 자석을 끌어당겨요. 자석과 철은 {g('서로')} 끌어당겨요",
                 "철로 만든 물체도 자석을 끌어당겨요. 자석과 철은 서로 끌어당기는 거예요.")
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def features(self):
        self.section("정리해요")
        c1 = K.text_card([f"① {o('약간 떨어져 있어도')} 서로 끌어당겨요"], w=12.0, size=44).move_to([0, 1.5, 0])
        c2 = K.text_card([f"② 플라스틱이나 종이처럼 {o('자석에 붙지 않는 물체')}가", "     사이에 있어도 서로 끌어당겨요"],
                         w=12.0, size=44).move_to([0, -0.5, 0])
        self.say("자석과 철 사이에 작용하는 힘의 특징", "자석과 철로 만든 물체 사이에 작용하는 힘의 특징을 정리해 봐요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.6)
        self.say(f"약간 떨어져 있어도, 사이에 물체가 있어도 {g('끌어당겨요')}",
                 "약간 떨어져 있어도 서로 끌어당기고, 플라스틱이나 종이처럼 자석에 붙지 않는 물체가 사이에 있어도 서로 끌어당겨요.")
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각+: 물컵 속 철 클립 ──
    def cup(self):
        self.section("생각+")
        cp = K.cup_water(2.0, 2.8).move_to([-0.4, -0.6, 0])
        cl = K.fit(K.clip(), 0.9, 0.32).move_to([-0.4, -1.75, 0])
        mag = K.bar_magnet("N", 1.6, 0.5).move_to([1.6, -1.75, 0])
        self.say("물이 든 컵 속 철 클립을 손대지 않고 꺼내려면?",
                 "물이 든 컵 속의 철 클립을, 손대지 않고 물을 쏟지 않으며 꺼내려면 어떻게 할까요?")
        self.play(FadeIn(cp), FadeIn(cl), run_time=0.6)
        self.pause_screen(5, "손대지 않고 꺼내는 방법은?")
        self.play(FadeIn(mag), mag.animate.move_to([0.95, -1.75, 0]), run_time=0.6)
        self.play(cl.animate.move_to([0.15, -1.75, 0]), run_time=0.25)
        self.play(mag.animate.shift(UP * 2.35), cl.animate.shift(UP * 2.35), run_time=1.6)
        self.say(f"컵 바깥에 자석을 대고 {o('컵 입구까지')} 끌어 올려요",
                 "컵 바깥에 자석을 대고 컵 입구까지 끌어 올려요. 자석을 실에 매단 낚싯대를 물속에 넣어 꺼낼 수도 있어요.")
        self.settle()
        self.say(f"컵이나 물이 사이에 있어도 {g('서로 끌어당기기')} 때문이에요",
                 "자석과 철 클립 사이에 컵이나 물이 있어도 서로 끌어당기기 때문이에요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"자석과 철로 만든 물체 사이에는",
                            f"서로 {r('끌어당기는')} 힘이 작용합니다."], w=12.0, size=50).move_to([0, 0.6, 0])
        self.say(f"자석과 철 사이에는 서로 {r('끌어당기는')} 힘이 작용해요",
                 "자석과 철로 만든 물체 사이에는 서로 끌어당기는 힘이 작용해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
