"""「수학 원리 돋보기」 5학년 32화 — 두 조건을 함께 쓰는 수의 범위 (5-2 1단원 4차시, 화 코드 5-2-1-b)

16 이상 35 이하: 16 이상(오른쪽) ∩ 35 이하(왼쪽) → 두 점 사이, 양 끝 ●
태권도 체급: 30 kg 초과 33 kg 이하 → 30은 ○, 33은 ● / 몸무게 33 kg는 들어가고 30 kg는 안 들어감
최종: GRADE=5 ./make_final.sh 32
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from numrange import numline, rng


class G5Ep32(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 32
    EP_TITLE = "두 조건을 함께 쓰는 수의 범위"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.both()
        self.weight()
        self.closing(f"두 조건을 {o('모두')} 만족하는 수는 두 범위가 {g('겹치는 부분')}\n끝이 들어가면 ●, 안 들어가면 ○",
                     next_preview="5학년 33화 · 올림과 버림")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("16 이상 35 이하인 수를\n수직선에 어떻게 나타낼까요?", 46).move_to([0.6, 1.6, 0])
        self.say("16 이상 35 이하", "16 이상 35 이하인 수는 어떤 수일까요? 수직선에 어떻게 나타낼까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def both(self):
        self.section("두 범위가 겹치는 곳")
        nl, labs = numline(10, 40, 1, 11.4, [0, -0.3, 0], label_every=10)
        self.play(Create(nl), FadeIn(labs), run_time=0.6)
        a = rng(nl, 16, None, True, color=ORANGE, y_off=1.6)
        b_ = rng(nl, None, 35, True, True, color=BLUE, y_off=1.0)
        la = T("16 이상", 30, ORANGE).next_to(a, UP, buff=0.12)
        lb = T("35 이하", 30, BLUE).next_to(b_, UP, buff=0.12).set_x(-4.6)
        from manim import Dot
        d16 = T("16", 26, ORANGE).next_to(nl.n2p(16), DOWN, buff=0.18)
        d35 = T("35", 26, BLUE).next_to(nl.n2p(35), DOWN, buff=0.18)
        self.say(f"{o('16 이상')}과 {b('35 이하')}", "16 이상은 16에서 오른쪽, 35 이하는 35에서 왼쪽이에요.")
        self.play(Create(a), FadeIn(la), FadeIn(d16), run_time=0.7)
        self.play(Create(b_), FadeIn(lb), FadeIn(d35), run_time=0.7)
        c = rng(nl, 16, 35, True, True, color=GREEN, y_off=0.45)
        self.say(f"두 조건을 모두 만족하는 곳은 {g('16부터 35까지')}", "두 조건을 모두 만족하는 수는 두 범위가 겹치는 부분, 16과 같거나 크고 35와 같거나 작은 수예요. 16과 35에 ●을 찍고 그 사이에 선을 그어요.")
        self.play(Create(c), run_time=0.8)
        self.play(Indicate(c, color=GREEN), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def weight(self):
        self.section("초과와 이하를 함께")
        t = M(f"태권도 체급: 몸무게 {o('30 kg 초과')} {b('33 kg 이하')}", 40).move_to([0, 2.3, 0])
        nl, labs = numline(28, 35, 1, 11.0, [0, 0.0, 0])
        self.say("30 kg 초과 33 kg 이하", "어떤 태권도 체급은 몸무게가 30킬로그램 초과 33킬로그램 이하예요.")
        self.play(FadeIn(t), Create(nl), FadeIn(labs), run_time=0.8)
        r = rng(nl, 30, 33, False, True, color=GREEN, y_off=0.55)
        self.say(f"30은 {o('○')}, 33은 {b('●')}", "30은 들어가지 않으니 ○, 33은 들어가니 ●로 나타내고 사이를 이어요.")
        self.play(Create(r), run_time=0.8)
        n = M(f"33 kg → {g('들어가요')},  30 kg → {o('안 들어가요')}", 40).move_to([0, -1.4, 0])
        self.say(f"33 kg는 {g('들어가고')}, 30 kg는 안 들어가요", "그래서 몸무게가 33킬로그램인 사람은 이 체급에 들어가고, 30킬로그램인 사람은 들어가지 않아요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
