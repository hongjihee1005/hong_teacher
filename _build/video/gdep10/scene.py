"""「수학 원리 돋보기」 나눗셈 차근차근 10화 — 나눗셈이 맞는지 확인하기

13 ÷ 4 = 3 … 1 → 접시 4개에 3개씩 + 남은 1개를 다시 모으면 13 → 4 × 3 + 1 = 13
(나누는 수) × (몫) + (나머지) = (나누어지는 수) / 연습: 23 ÷ 5 = 4 … 3 확인, 23 ÷ 5 = 3 … 7?
최종: GRADE=d ./make_final.sh 10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene, slot
from items import check_mark, cross_mark
from prepkit import RED, dish, items

PUR = "#B05FD0"


def pur(s):
    return f'<span foreground="{PUR}">{s}</span>'


class GdEp10(DivScene):
    EP_NO = 10
    EP_TITLE = "나눗셈이 맞는지 확인하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.gather()
        self.formula()
        self.practice()
        self.closing(f"{o('나누는 수')} × {g('몫')} + {pur('나머지')} = {b('나누어지는 수')}\n4 × 3 + 1 = 13 이면 맞게 계산한 거예요",
                     next_preview="나눗셈 차근차근 11화 · 나머지를 어떻게 할까? 생활 문제")
        self.wait(0.5)

    def gather(self):
        self.section("다시 모아 보기")
        eq = M(f"13 ÷ 4 = {g('3')} … {pur('1')}", 64).move_to([0, 2.5, 0])
        self.say("13 ÷ 4 = 3 … 1, 맞을까요?", "13 나누기 4는 몫이 3, 나머지가 1이었어요. 맞게 계산했는지 어떻게 알 수 있을까요?")
        self.play(FadeIn(eq), run_time=0.5)
        dishes = VGroup(*[dish(n, w=2.0, h=0.75) for n in ["가", "나", "다", "라"]]).arrange(RIGHT, buff=0.5).move_to([0, 0.2, 0])
        its = items(13, y=0, step=0.4, r=0.18)
        for i in range(12):
            its[i].move_to(slot(dishes[i % 4], i // 4))
        its[12].move_to([5.6, 0.4, 0])
        self.play(FadeIn(dishes), FadeIn(its), run_time=0.6)
        t1 = M(f"{o('4')}명에게 {g('3')}개씩 → {o('4')} × {g('3')} = 12", 44).move_to([0, -1.3, 0])
        self.say(f"{o('4')} × {g('3')} = 12", "나누어 준 것을 모으면 4명에게 3개씩, 4 곱하기 3은 12예요.")
        self.play(FadeIn(t1), run_time=0.5)
        t2 = M(f"남은 {pur('1')}개를 더하면 12 + {pur('1')} = {b('13')}", 44).move_to([0, -2.1, 0])
        self.say(f"남은 {pur('1')}개를 더하면 {b('13')}", "여기에 남은 1개를 더하면 13. 처음에 있던 13개와 같아요. 맞게 계산했어요!")
        self.play(FadeIn(t2), Indicate(its[12], color=PUR, scale_factor=1.5), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def formula(self):
        self.section("확인하는 식")
        f = M(f"{o('나누는 수')} × {g('몫')} + {pur('나머지')} = {b('나누어지는 수')}", 54).move_to([0, 1.0, 0])
        e = M(f"{o('4')} × {g('3')} + {pur('1')} = {b('13')}", 72).move_to([0, -0.4, 0])
        self.say("확인하는 식", "나누는 수와 몫을 곱하고 나머지를 더하면, 나누어지는 수가 나와야 해요.")
        self.play(FadeIn(f), run_time=0.6)
        self.play(Write(e), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        a1 = M(f"① 23 ÷ 5 = {g('4')} … {pur('3')}", 56).move_to([-3.4, 1.2, 0])
        a2 = M(f"② 23 ÷ 5 = {g('3')} … {pur('8')}", 56).move_to([3.4, 1.2, 0])
        self.say("두 답을 확인해 보세요", "연습해 볼까요? 23 나누기 5를 두 친구가 이렇게 풀었어요. 확인하는 식으로 맞는지 알아보세요.")
        self.play(FadeIn(a1), FadeIn(a2), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        c1 = M(f"5 × 4 + 3 = {b('23')}", 46).next_to(a1, DOWN, buff=0.6)
        c2 = M(f"5 × 3 + 8 = {b('23')}", 46).next_to(a2, DOWN, buff=0.6)
        self.say("둘 다 23이 나와요", "둘 다 확인하는 식에서 23이 나와요.")
        self.play(FadeIn(c1), FadeIn(c2), run_time=0.6)
        k1 = check_mark(0.45).next_to(c1, DOWN, buff=0.35)
        k2 = cross_mark(0.35).next_to(c2, DOWN, buff=0.35)
        w = M(f"그런데 ②는 나머지 {pur('8')}이 나누는 수 5보다 커요", 38).next_to(k2, DOWN, buff=0.3)
        self.say(f"하지만 ②는 나머지가 {o('너무 커요')}", "그런데 2번은 나머지 8이 나누는 수 5보다 커서 틀렸어요. 확인할 때는 나머지가 나누는 수보다 작은지도 꼭 보아요.")
        self.play(Create(k1), Create(k2), FadeIn(w), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
