"""「수학 원리 돋보기」 5학년 9화 — 공배수와 최소공배수 (5-1 2단원 6·7차시, 화 코드 5-1-2-d)

버스 A는 4분마다, B는 6분마다 출발, 지금 함께 출발 → 다시 함께 출발하는 때?
4의 배수 4, 8, 12, 16, 20, 24 / 6의 배수 6, 12, 18, 24 → 공배수 12, 24, … 최소공배수 12
공배수는 최소공배수의 배수 / 나눗셈: (2) 4 6 → 2 3, 최소공배수 = 2 × 2 × 3 = 12
최종: GRADE=5 ./make_final.sh 9
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, ArcBetweenPoints, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   NumberLine, SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class G5Ep09(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 9
    EP_TITLE = "공배수와 최소공배수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.lines()
        self.ladder()
        self.closing(f"두 수의 공통된 배수가 {o('공배수')}, 그중 가장 작은 수가 {g('최소공배수')}\n공배수는 최소공배수의 배수예요",
                     next_preview="5학년 10화 · 함께 변하는 두 양")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("버스 가는 4분마다, 버스 나는 6분마다 출발해요.\n지금 함께 출발했다면 다음에 함께 출발하는 때는?", 40)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0.5, 1.4, 0])
        self.say("다시 동시에 출발하는 때는?", "버스 가는 4분마다, 버스 나는 6분마다 출발해요. 지금 함께 출발했다면 다음에 다시 함께 출발하는 때는 몇 분 뒤일까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def nl(self, y, step, col, name):
        n = NumberLine(x_range=[0, 26, 2], length=11.0, include_numbers=False, color=INK, stroke_width=3).move_to([0.5, y, 0])
        lab = T(name, 30, col).next_to(n, LEFT, buff=0.25)
        nums = VGroup(*[T(str(k), 22, SOFT).next_to(n.n2p(k), DOWN, buff=0.15) for k in range(0, 25, 2)])
        arcs = VGroup(*[ArcBetweenPoints(n.n2p(k), n.n2p(k + step), angle=-1.4, color=col, stroke_width=5) for k in range(0, 25 - step, step)])
        dots = VGroup(*[Dot(n.n2p(k), radius=0.1, color=col) for k in range(step, 25, step)])
        return n, lab, nums, arcs, dots

    def lines(self):
        self.section("두 수의 배수를 나란히")
        a = self.nl(1.3, 4, BLUE, "가 (4분)")
        b_ = self.nl(-0.6, 6, ORANGE, "나 (6분)")
        self.say("4씩, 6씩 뛰어 세기", "버스 가는 4분, 8분, 12분마다, 버스 나는 6분, 12분, 18분마다 출발해요. 수직선에서 뛰어 세어 볼게요.")
        for n, lab, nums, arcs, dots in (a, b_):
            self.play(Create(n), FadeIn(lab), FadeIn(nums), run_time=0.5)
            self.play(LaggedStart(*[Create(x) for x in arcs], lag_ratio=0.3, run_time=1.4), LaggedStart(*[FadeIn(d) for d in dots], lag_ratio=0.3, run_time=1.4))
        rings = VGroup(*[SurroundingRectangle(VGroup(Dot(a[0].n2p(k)), Dot(b_[0].n2p(k))), color=GREEN, buff=0.25, corner_radius=0.2, stroke_width=5) for k in (12, 24)])
        self.say(f"두 수의 공통된 배수: {g('12, 24, …')}", "두 수직선에서 함께 닿는 곳은 12와 24예요. 4와 6의 공통된 배수, 공배수라고 해요.")
        self.play(Create(rings), run_time=0.8)
        t = M(f"가장 작은 공배수 {g('12')} = {g('최소공배수')}  →  {o('12분 뒤')}에 함께 출발", 38).move_to([0, -2.0, 0])
        self.say(f"가장 작은 {g('12')}가 최소공배수", "공배수 가운데 가장 작은 수 12를 최소공배수라고 해요. 그래서 두 버스는 12분 뒤에 다시 함께 출발해요.")
        self.play(FadeIn(t), Indicate(rings[0], color=GREEN), run_time=0.8)
        self.wait(0.6)
        t2 = M(f"공배수 12, 24, 36, … = {o('12의 배수')}", 38, SOFT).move_to([0, 2.45, 0])
        self.say(f"공배수는 {o('최소공배수의 배수')}", "공배수 12, 24, 36은 모두 12의 배수예요. 공배수는 최소공배수의 배수예요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def ladder(self):
        self.section("나눗셈으로 최소공배수 구하기")
        x0, y0 = -4.6, 1.5
        r1 = VGroup(T("2", 54, GREEN).move_to([x0, y0, 0]), T("4", 54).move_to([x0 + 0.9, y0, 0]), T("6", 54).move_to([x0 + 2.0, y0, 0]))
        bar = VGroup(Line([x0 + 0.35, y0 + 0.38, 0], [x0 + 0.35, y0 - 0.42, 0], color=INK, stroke_width=4),
                     Line([x0 + 0.35, y0 - 0.42, 0], [x0 + 2.5, y0 - 0.42, 0], color=INK, stroke_width=4))
        r2 = VGroup(T("2", 54, ORANGE).move_to([x0 + 0.9, y0 - 0.9, 0]), T("3", 54, ORANGE).move_to([x0 + 2.0, y0 - 0.9, 0]))
        self.say("공약수 2로 나누면 2와 3", "4와 6을 공약수 2로 나누면 2와 3이 남아요.")
        self.play(FadeIn(r1), run_time=0.5)
        self.play(Create(bar), FadeIn(r2), run_time=0.7)
        res = M(f"최소공배수 = {g('2')} × {o('2')} × {o('3')} = {g('12')}", 46).move_to([2.7, 0.2, 0])
        self.say(f"나눈 수와 남은 수를 모두 곱해요 → {g('12')}", "최소공배수는 왼쪽에 나눈 수와 아래에 남은 수를 모두 곱해요. 2 곱하기 2 곱하기 3, 12예요.")
        self.play(Indicate(VGroup(r1[0], r2), color=GREEN), FadeIn(res), run_time=0.8)
        cmp_ = M(f"최대공약수는 {g('2')}만, 최소공배수는 {o('남은 수까지')} 곱해요", 36, SOFT).move_to([0, -1.6, 0])
        self.say("최대공약수와 견주어 봐요", "최대공약수는 왼쪽의 2만 곱하고, 최소공배수는 아래에 남은 수까지 모두 곱하는 것이 달라요.")
        self.play(FadeIn(cmp_), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
