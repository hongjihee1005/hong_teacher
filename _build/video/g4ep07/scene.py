"""「수학 원리 돋보기」 4학년 7화 — 각의 크기는 무엇으로 정할까? (4-1 2단원 각도 2차시, 화 코드 4-1-2-a)

각의 크기 = 두 변이 벌어진 정도(변의 길이와 상관없음) / 겹쳐서 비교 / 같은 조각(단위)으로 세어 비교
조각 크기가 다르면 칸 수가 달라져서 같은 단위가 필요함 → 다음 화의 1°
최종: GRADE=4 ./make_final.sh 7
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rotate, Transform,
                   ValueTracker, VGroup, Write, always_redraw)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from angle import PURPLE, angle_fig, unit, wedge
from bignum import span


class G4Ep07(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 7
    EP_TITLE = "각의 크기는 무엇으로 정할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.length()
        self.overlap()
        self.units()
        self.closing(f"각의 크기는 두 변이 {g('벌어진 정도')}예요\n변의 길이와는 {o('상관없어요')}",
                     next_preview="4학년 8화 · 1°는 얼마만큼일까? 각도기 읽기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("숲 놀이터 미끄럼틀 두 개, 어느 쪽 각이 더 클까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        a = angle_fig([-5.2, -1.4, 0], 40, L=4.2)
        b = angle_fig([1.4, -1.4, 0], 55, L=2.0)
        la = T("가", 44, SOFT).next_to(a, DOWN, buff=0.2)
        lb = T("나", 44, SOFT).next_to(b, DOWN, buff=0.2)
        self.say("어느 각이 더 클까요?", "숲 놀이터의 두 각이에요. 어느 쪽 각이 더 클까요? 가는 변이 길고, 나는 변이 짧아요.")
        self.play(Write(q), run_time=1.0)
        self.play(Create(a), Create(b), FadeIn(la), FadeIn(lb), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def length(self):
        self.section("변이 길어지면?")
        L = ValueTracker(1.6)
        v = np.array([-1.5, -1.5, 0])
        ang = always_redraw(lambda: angle_fig(v, 45, L=L.get_value()))
        self.say("변을 길게 늘여 볼까요?", "이 각의 두 변을 길게 늘여 볼까요?")
        self.add(ang)
        self.play(FadeIn(ang), run_time=0.5)
        self.play(L.animate.set_value(5.0), run_time=1.8)
        self.say(f"벌어진 정도는 {o('그대로')}예요", "변이 길어져도 두 변이 벌어진 정도는 그대로예요. 각의 크기는 변하지 않아요.")
        self.play(L.animate.set_value(2.2), run_time=1.4)
        self.play(L.animate.set_value(4.0), run_time=1.0)
        m = M(f"각의 크기 = 두 변이 {g('벌어진 정도')}", 56).move_to([0, 2.2, 0])
        self.say(f"각의 크기는 두 변이 {g('벌어진 정도')}", "각의 두 변이 벌어진 정도를 각의 크기라고 해요.")
        self.play(FadeIn(m, shift=DOWN * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def overlap(self):
        self.section("겹쳐서 비교하기")
        a = angle_fig([-5.2, -1.2, 0], 40, L=4.2)
        b = angle_fig([1.4, -1.2, 0], 55, L=2.0, color=PURPLE)
        self.say("나를 가 위에 겹쳐 봐요", "투명 종이에 나 각을 본떠서 가 각 위에 겹쳐 볼까요?")
        self.play(FadeIn(a), FadeIn(b), run_time=0.6)
        self.play(b.animate.shift(a.v - b.v), run_time=1.4)
        self.say(f"꼭짓점과 한 변을 맞추면 {span('나', PURPLE)}가 더 벌어졌어요",
                 "꼭짓점과 한 변을 맞추어 겹치면, 나의 다른 한 변이 가보다 더 벌어져 있어요. 그래서 나의 각이 더 커요.")
        self.play(Indicate(b.s2, color=PURPLE, scale_factor=1.05), run_time=0.8)
        res = M(f"변은 짧아도 {span('나', PURPLE)}의 각이 더 커요", 54).move_to([2.6, 1.8, 0])
        self.play(FadeIn(res, shift=DOWN * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def units(self):
        self.section("조각으로 세어 보기")
        va, vb = np.array([-5.0, -1.3, 0]), np.array([1.2, -1.3, 0])
        a = angle_fig(va, 40, L=3.2, arc_r=0.0001)
        b = angle_fig(vb, 60, L=3.2, arc_r=0.0001)
        self.say("같은 조각을 몇 개 붙일 수 있을까요?", "이번에는 똑같은 부채꼴 조각을 붙여서 세어 볼까요?")
        self.play(FadeIn(a), FadeIn(b), run_time=0.5)
        wa = VGroup(*[wedge(va, 10, 10 * i, r=2.0) for i in range(4)])
        wb = VGroup(*[wedge(vb, 10, 10 * i, r=2.0) for i in range(6)])
        self.play(LaggedStart(*[FadeIn(w, scale=0.6) for w in wa], lag_ratio=0.3, run_time=1.2))
        ca = T("4칸", 44, ORANGE).move_to(va + np.array([2.6, 2.4, 0]))
        self.play(FadeIn(ca), run_time=0.3)
        self.play(LaggedStart(*[FadeIn(w, scale=0.6) for w in wb], lag_ratio=0.3, run_time=1.5))
        cb = T("6칸", 44, ORANGE).move_to(vb + np.array([2.6, 2.4, 0]))
        self.play(FadeIn(cb), run_time=0.3)
        self.say(f"같은 조각으로 세면 {o('4칸 &lt; 6칸')}", "같은 조각으로 세어 보면 4칸과 6칸, 오른쪽 각이 더 커요.")
        self.wait(1.0)
        # 조각 크기를 바꾸면
        big = VGroup(*[wedge(vb, 20, 20 * i, r=2.0, color=GREEN) for i in range(3)])
        cb2 = T("3칸?", 44, GREEN).move_to(cb)
        self.say(f"조각이 커지면 {g('3칸')}… 칸 수가 달라져요", "그런데 오른쪽 각을 두 배 큰 조각으로 세면 3칸이에요. 4칸인 왼쪽보다 작아 보이지요?")
        self.play(FadeOut(wb), FadeIn(big), Transform(cb, cb2), run_time=1.0)
        self.wait(0.8)
        m = M(f"그래서 모두가 똑같이 쓰는 {g('단위')}가 필요해요", 46)
        m.scale_to_fit_width(min(m.width, 10.4)).move_to([0.6, 2.25, 0])
        self.say(f"모두가 같은 {g('단위')}로 재야 해요", "그래서 각의 크기를 잴 때는 모두가 똑같이 쓰는 단위가 필요해요. 그 단위가 다음 화에 나오는 1도예요.")
        self.play(FadeIn(m, shift=DOWN * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
