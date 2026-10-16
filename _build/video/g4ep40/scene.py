"""「수학 원리 돋보기」 4학년 40화 — 0.3과 0.30은 같을까? 소수의 크기 비교 (4-2 3단원 6차시, 화 코드 4-2-3-c)

0.3 = 0.30 (0.1 3칸 = 0.01 30칸, 끝자리 0을 붙여도 같음)
비교: 0.01이 몇 개인지 세거나, 자연수 부분 → 소수 첫째 → 둘째 → 셋째 자리 차례 (2.45 < 2.5, 1.307 > 1.304)
최종: GRADE=4 ./make_final.sh 40
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, SurroundingRectangle, Transform, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decimal4 import GREEN2, dec_markup, grid100


class G4Ep40(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 40
    EP_TITLE = "0.3과 0.30은 같을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.same()
        self.compare()
        self.closing(f"소수 끝자리의 {o('0')}은 붙이거나 빼도 크기가 같아요\n크기 비교는 {g('높은 자리부터')} 차례로",
                     next_preview="4학년 41화 · 10배 하면 소수점은?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("2.45 m와 2.5 m, 어느 쪽이 더 길까요?", 50).move_to([0.6, 1.6, 0])
        w = M(f"45가 5보다 크니까 2.45가 더 길까요?", 44, SOFT).move_to([0, 0.0, 0])
        self.say("2.45와 2.5 중 더 큰 수는?", "할아버지 댁 창문 두 개의 길이가 2.45미터와 2.5미터예요. 어느 쪽이 더 길까요?")
        self.play(Write(q), run_time=0.9)
        self.play(FadeIn(w), run_time=0.5)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def same(self):
        self.section("0.3 = 0.30")
        a = grid100(30, 3.4, color=ORANGE).move_to([-3.3, 0.2, 0])
        b_ = grid100(30, 3.4, color=BLUE).move_to([3.3, 0.2, 0])
        for k in range(3):
            pass
        la = M(f"0.1이 3개 = {o('0.3')}", 44).next_to(a, DOWN, buff=0.25)
        lb = M(f"0.01이 30개 = {b('0.30')}", 44).next_to(b_, DOWN, buff=0.25)
        self.say(f"0.1이 3개, 0.01이 30개", "왼쪽은 0.1이 3줄, 0.3이에요. 오른쪽은 0.01이 30칸, 0.30이에요.")
        self.play(FadeIn(a), FadeIn(la), FadeIn(b_), FadeIn(lb), run_time=0.8)
        eq = M(f"{o('0.3')} = {b('0.30')}", 70).move_to([0, 2.35, 0])
        self.say(f"칠한 넓이가 같아요 → {o('0.3')} = {b('0.30')}", "칠한 넓이가 똑같아요. 0.3과 0.30은 같은 수예요. 소수는 오른쪽 끝에 0을 붙여도 크기가 같아요.")
        self.play(FadeIn(eq), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("높은 자리부터 비교하기")
        r1 = M(dec_markup("2.45"), 96).move_to([-2.0, 1.3, 0])
        r2 = M(dec_markup("2.5"), 96).move_to([-2.0, -0.1, 0]).align_to(r1, LEFT)
        self.say("자리를 맞추어 써 봐요", "두 수를 소수점을 맞추어 위아래로 써 볼까요?")
        self.play(FadeIn(r1), FadeIn(r2), run_time=0.6)
        r2b = M(dec_markup("2.50"), 96).move_to(r2, aligned_edge=LEFT)
        self.say(f"2.5 = 2.5{o('0')}로 생각하면 쉬워요", "2.5 끝에 0을 붙여 2.50으로 생각하면 자리 수가 같아져요.")
        self.play(Transform(r2, r2b), run_time=0.6)
        box1 = SurroundingRectangle(VGroup(r1[0], r2[0]), color=SOFT, buff=0.1)
        self.say("자연수 부분은 2로 같아요", "먼저 자연수 부분을 비교하면 둘 다 2로 같아요.")
        self.play(Create(box1), run_time=0.5)
        box2 = SurroundingRectangle(VGroup(r1[2], r2[2]), color=ORANGE, buff=0.1, stroke_width=5)
        self.say(f"소수 첫째 자리: {o('4 &lt; 5')}", "다음으로 소수 첫째 자리를 비교하면 4와 5, 5가 더 커요.")
        self.play(Transform(box1, box2), run_time=0.6)
        res = M(f"2.45 {g('&lt;')} 2.5", 72).move_to([3.4, 0.6, 0])
        self.say(f"2.5 m 창문이 {g('더 길어요')}", "그래서 2.5가 더 커요. 2.5미터 창문이 더 길어요. 0.01이 245개와 250개라고 생각해도 같아요.")
        self.play(FadeIn(res), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
