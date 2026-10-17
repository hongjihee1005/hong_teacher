"""「수학 원리 돋보기」 6학년 39화 — (소수 한 자리) ÷ (소수 한 자리) (6-2 2단원 2차시, 화 코드 6-2-2-a)

3.6은 0.1이 36개, 0.9는 0.1이 9개 → 3.6 ÷ 0.9 = 36 ÷ 9 = 4
나누어지는 수와 나누는 수를 각각 10배 해도 몫은 같음 / 세로셈: 두 수의 소수점을 오른쪽으로 한 자리씩 옮김
분수로: 36/10 ÷ 9/10 = 36 ÷ 9 = 4
최종: GRADE=6 ./make_final.sh 39
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv, tenth_block
from fraction import frac, row

GC = [ORANGE, BLUE, GREEN, "#7A4FB5"]


class G6Ep39(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 39
    EP_TITLE = "(소수 한 자리) ÷ (소수 한 자리)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.count()
        self.scale()
        self.vertical()
        self.closing(f"나누어지는 수와 나누는 수를 {o('똑같이 10배')} 해도 몫은 같아요\n3.6 ÷ 0.9 = 36 ÷ 9 = {g('4')}",
                     next_preview="6학년 40화 · (소수 두 자리) ÷ (소수 두 자리)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("전선 3.6 m를 0.9 m씩 자르면 몇 도막이 될까요?", 44).move_to([0.6, 1.6, 0])
        self.say("3.6 ÷ 0.9는?", "과학 기술 체험관에서 전선 3.6 미터를 0.9 미터씩 자르려고 해요. 몇 도막이 될까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def count(self):
        self.section("0.1이 몇 개?")
        bars = VGroup(*[tenth_block(1.0) for _ in range(36)]).arrange(RIGHT, buff=0.05).move_to([0, 1.6, 0])
        t = M(f"3.6 = 0.1이 {o('36개')}, 0.9 = 0.1이 {b('9개')}", 38).move_to([0, 0.5, 0])
        self.say(f"0.1이 {o('36개')}와 {b('9개')}", "3.6은 0.1이 36개, 0.9는 0.1이 9개예요.")
        self.play(LaggedStart(*[FadeIn(x) for x in bars], lag_ratio=0.02, run_time=1.0), FadeIn(t))
        for k in range(4):
            self.play(*[bars[9 * k + i].animate.set_fill(GC[k], 1) for i in range(9)], run_time=0.3)
        nums = VGroup(*[T(str(k + 1), 28, GC[k]).next_to(VGroup(*bars[9 * k:9 * k + 9]), DOWN, buff=0.12) for k in range(4)])
        e = M(f"3.6 ÷ 0.9 = 36 ÷ 9 = {g('4')}", 46).move_to([0, -0.9, 0])
        self.say(f"9개씩 묶으면 {g('4묶음')}", "0.1 36개를 9개씩 묶으면 4묶음. 그래서 3.6 나누기 0.9는 36 나누기 9, 4예요.")
        self.play(FadeIn(nums), run_time=0.4)
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def scale(self):
        self.section("똑같이 10배 하기")
        a = M("3.6 ÷ 0.9", 56).move_to([-2.6, 1.5, 0])
        bb = M("36 ÷ 9", 56).move_to([-2.6, -0.3, 0])
        ar1 = Arrow(a.get_bottom() + LEFT * 1.1, bb.get_top() + LEFT * 0.7, color=SOFT, buff=0.08, stroke_width=5)
        ar2 = Arrow(a.get_bottom() + RIGHT * 1.0, bb.get_top() + RIGHT * 0.7, color=SOFT, buff=0.08, stroke_width=5)
        n1 = M(o("× 10"), 30).next_to(ar1, LEFT, buff=0.1)
        n2 = M(o("× 10"), 30).next_to(ar2, RIGHT, buff=0.1)
        r = M(f"몫은 똑같이 {g('4')}", 44).move_to([3.0, 0.6, 0])
        self.say(f"두 수를 똑같이 {o('10배')} 해도 몫은 같아요", "나누어지는 수와 나누는 수를 똑같이 10배 해도 몫은 같아요. 그래서 자연수의 나눗셈으로 바꾸어 계산할 수 있어요.")
        self.play(FadeIn(a), run_time=0.4)
        self.play(Create(ar1), Create(ar2), FadeIn(n1), FadeIn(n2), FadeIn(bb), run_time=0.8)
        self.play(FadeIn(r), run_time=0.4)
        f = row(frac(36, 10, 46), "÷", frac(9, 10, 46), "= 36 ÷ 9 =", M(g("4"), 48), size=44).move_to([0, -1.6, 0])
        self.say("분수로 바꾸어도 같아요", "분수로 바꾸면 10분의 36 나누기 10분의 9, 분모가 같으니 분자끼리 36 나누기 9예요.")
        self.play(FadeIn(f), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈")
        d = DecDiv(self, "3.6", "0.9", x_left=-1.4, y0=1.4)
        self.say("소수점을 옮겨요", "세로셈에서는 나누는 수가 자연수가 되도록 두 수의 소수점을 오른쪽으로 한 자리씩 옮겨요.")
        d.show()
        d.move_point(1)
        t = M(f"3.6 → 36, 0.9 → 9", 34).move_to([3.4, 1.4, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.say(f"36 ÷ 9 = {g('4')}", "그다음 36 나누기 9처럼 계산하면 몫은 4예요.")
        d.quot(1, "4")
        d.row("36", 1, 1)
        d.line(0, 1, 1)
        d.row("0", 1, 2)
        r = M(f"{g('4')}도막", 44).move_to([3.4, 0.0, 0])
        self.play(FadeIn(r), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
