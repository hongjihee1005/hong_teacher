"""「수학 원리 돋보기」 6학년 50화 — 비의 성질 (6-2 4단원 2차시, 화 코드 6-2-4-a)

비 1 : 2에서 기호 : 앞의 1 = 전항, 뒤의 2 = 후항
비의 전항과 후항에 0이 아닌 같은 수를 곱하거나 같은 수로 나누어도 비율은 같음 / 같은 수를 더하면 비율이 달라짐
(예시: 1 : 2 = 2 : 4 = 3 : 6, 비율 1/2 / 1+1 : 2+1 = 2 : 3 → 2/3)
최종: GRADE=6 ./make_final.sh 50
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Brace, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart,
                   Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row

RED = "#C0392B"


def bars(a, bb, u=0.5, center=(0, 0, 0)):
    """전항 a칸(주황), 후항 bb칸(파랑) 막대 두 줄"""
    ra = VGroup(*[Rectangle(width=u, height=0.45, fill_color=ORANGE, fill_opacity=0.8, stroke_color=INK, stroke_width=2) for _ in range(a)]).arrange(RIGHT, buff=0)
    rb = VGroup(*[Rectangle(width=u, height=0.45, fill_color=BLUE, fill_opacity=0.6, stroke_color=INK, stroke_width=2) for _ in range(bb)]).arrange(RIGHT, buff=0)
    ra.next_to(rb, UP, buff=0.12).align_to(rb, LEFT)
    return VGroup(ra, rb).move_to(center)


class G6Ep50(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 50
    EP_TITLE = "비의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.terms()
        self.multiply()
        self.add_wrong()
        self.closing(f"비의 {o('전항')}과 {b('후항')}에 0이 아닌 같은 수를 곱하거나\n같은 수로 나누어도 {g('비율은 같아요')}",
                     next_preview="6학년 51화 · 간단한 자연수의 비")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("포도 원액과 물을 1 : 2로 섞은 주스와\n2 : 4로 섞은 주스는 맛의 진하기가 같을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("진하기가 같을까요?", "새 활용 체험관에서 주스를 만들어요. 원액과 물을 1 대 2로 섞은 주스와 2 대 4로 섞은 주스는 진하기가 같을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def terms(self):
        self.section("전항과 후항")
        r = VGroup(T("1", 110, ORANGE), T(":", 110), T("2", 110, BLUE)).arrange(RIGHT, buff=0.4).move_to([0, 0.8, 0])
        self.play(FadeIn(r), run_time=0.5)
        b1 = Brace(r[0], DOWN, color=ORANGE)
        b2 = Brace(r[2], DOWN, color=BLUE)
        t1 = M(o("전항"), 38).next_to(b1, DOWN, buff=0.1)
        t2 = M(b("후항"), 38).next_to(b2, DOWN, buff=0.1)
        self.say(f"앞은 {o('전항')}, 뒤는 {b('후항')}", "비 1 대 2에서 기호 앞에 있는 1을 전항, 뒤에 있는 2를 후항이라고 해요.")
        self.play(FadeIn(b1), FadeIn(t1), FadeIn(b2), FadeIn(t2), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def multiply(self):
        self.section("같은 수를 곱하면")
        rows = [(1, 2, "1 : 2"), (2, 4, "2 : 4"), (3, 6, "3 : 6")]
        ys = [1.7, 0.2, -1.3]
        grp = VGroup()
        for (a, bb, s), y in zip(rows, ys):
            br = bars(a, bb, 0.42, (-1.6, y, 0)).align_to([-5.0, 0, 0], LEFT)
            lab = M(s, 40).move_to([-5.9, y, 0])
            rt = row("비율", frac(a, bb, 40, cn=ORANGE, cd=BLUE), "=", frac(1, 2, 40, cn=GREEN, cd=GREEN), size=38).move_to([3.4, y, 0])
            grp.add(VGroup(lab, br, rt))
        self.say("전항과 후항에 2를 곱하면 2 : 4", "1 대 2의 전항과 후항에 2를 곱하면 2 대 4, 3을 곱하면 3 대 6이에요.")
        self.play(FadeIn(grp[0][:2]), run_time=0.5)
        self.play(FadeIn(grp[1][:2]), run_time=0.5)
        self.play(FadeIn(grp[2][:2]), run_time=0.5)
        self.say(f"비율은 모두 {g('1/2')}", "비율을 구해 보면 모두 2분의 1로 같아요. 원액이 늘어난 만큼 물도 똑같은 배로 늘어났기 때문이에요. 그래서 두 주스의 진하기는 같아요.")
        self.play(LaggedStart(*[FadeIn(x[2]) for x in grp], lag_ratio=0.3, run_time=1.0))
        t = M(f"÷ 같은 수도 비율이 같아요  3 : 6 → 1 : 2", 32).move_to([0, -2.2, 0])
        self.say(f"같은 수로 {b('나누어도')} 같아요", "반대로 3 대 6의 전항과 후항을 3으로 나누면 1 대 2, 비율은 그대로예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def add_wrong(self):
        self.section("같은 수를 더하면?")
        a = M(f"1 : 2  →  비율 {g('1/2')}", 44).move_to([0, 1.6, 0])
        bb = M(f"(1 + 1) : (2 + 1) = 2 : 3  →  비율 {o('2/3')}", 44).move_to([0, 0.3, 0])
        self.say("1을 더하면?", "그런데 전항과 후항에 같은 수 1을 더하면 2 대 3이 돼요. 비율은 3분의 2로 달라져요.")
        self.play(FadeIn(a), run_time=0.5)
        self.play(FadeIn(bb), run_time=0.6)
        x = M(f"같은 수를 {o('더하면')} 비율이 {o('달라져요')}", 40, RED).move_to([0, -1.1, 0])
        self.say(f"더하면 {o('달라져요')}", "같은 수를 곱하거나 나눌 때만 비율이 같고, 같은 수를 더하면 비율이 달라져요.")
        self.play(FadeIn(x), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
