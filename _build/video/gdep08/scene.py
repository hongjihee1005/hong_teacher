"""「수학 원리 돋보기」 나눗셈 차근차근 8화 — 나머지는 왜 나누는 수보다 작을까?

13 ÷ 4를 2 … 5라고 하면? 남은 5개로 4명에게 한 개씩 더 줄 수 있음 → 3 … 1
나머지는 언제나 나누는 수보다 작아요(4로 나누면 나머지는 0, 1, 2, 3 중 하나) / 연습: 17 ÷ 5 = 2 … 7?
최종: GRADE=d ./make_final.sh 8
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene, slot
from items import check_mark, cross_mark
from prepkit import RED, dish, items

PUR = "#B05FD0"


def pur(s):
    return f'<span foreground="{PUR}">{s}</span>'


class GdEp08(DivScene):
    EP_NO = 8
    EP_TITLE = "나머지는 왜 나누는 수보다 작을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.wrong()
        self.rule()
        self.practice()
        self.closing(f"{pur('나머지')}는 언제나 {o('나누는 수')}보다 작아요\n나머지가 크거나 같으면 → 한 번 더 나눌 수 있어요",
                     next_preview="나눗셈 차근차근 9화 · 나누어떨어진다는 것")
        self.wait(0.5)

    def wrong(self):
        self.section("이 답은 맞을까?")
        q = M(f"13 ÷ 4 = 2 … {pur('5')} ?", 70).move_to([0, 2.4, 0])
        self.say("13 ÷ 4 = 2 … 5라고 했어요", "어떤 친구가 13 나누기 4를 몫 2, 나머지 5라고 했어요. 맞을까요?")
        self.play(Write(q), run_time=0.6)
        dishes = VGroup(*[dish(n, w=2.0, h=0.75) for n in ["가", "나", "다", "라"]]).arrange(RIGHT, buff=0.5).move_to([0, -0.2, 0])
        its = items(13, y=1.2, step=0.45, r=0.18)
        self.play(FadeIn(dishes), run_time=0.4)
        for i in range(8):
            its[i].move_to(slot(dishes[i % 4], i // 4))
        left = VGroup(*its[8:])
        left.arrange(RIGHT, buff=0.12).move_to([0, 1.3, 0])
        self.play(FadeIn(its), run_time=0.6)
        box = SurroundingRectangle(left, color=PUR, buff=0.12, stroke_width=6)
        self.play(Create(box), run_time=0.4)
        self.wait(0.4)
        self.pause_screen(5)
        self.settle()
        self.say(f"남은 5개로 {o('한 명에 하나씩 더')} 줄 수 있어요", "남은 5개로 4명에게 한 개씩 더 줄 수 있어요.")
        for k, i in enumerate(range(8, 12)):
            self.play(its[i].animate.move_to(slot(dishes[k], 2)), run_time=0.3)
        self.play(box.animate.surround(its[12], buff=0.12), run_time=0.4)
        no = cross_mark(0.45).next_to(q, LEFT, buff=0.3)
        a = M(f"13 ÷ 4 = {g('3')} … {pur('1')}", 70).move_to([0, -2.1, 0])
        self.say(f"바른 답은 {g('3')} … {pur('1')}", "그래서 바른 답은 몫 3, 나머지 1이에요.")
        self.play(Create(no), Write(a), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("나머지의 약속")
        t = M(f"{pur('나머지')} &lt; {o('나누는 수')}", 80).move_to([0, 1.6, 0])
        self.say(f"{pur('나머지')}는 {o('나누는 수')}보다 작아요", "나머지는 언제나 나누는 수보다 작아야 해요. 같거나 크면 한 번 더 나눌 수 있기 때문이에요.")
        self.play(Write(t), run_time=0.7)
        ex = M(f"4로 나누면 나머지는 {pur('0, 1, 2, 3')} 중 하나", 50).move_to([0, 0.0, 0])
        self.say("4로 나누면 나머지는 0, 1, 2, 3", "예를 들어 4로 나누면 나머지는 0, 1, 2, 3 가운데 하나예요. 4나 5는 나올 수 없어요.")
        self.play(FadeIn(ex), run_time=0.5)
        tip = M("계산한 뒤 꼭 나머지와 나누는 수를 견주어 보세요", 40, SOFT).move_to([0, -1.4, 0])
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M(f"17 ÷ 5 = 2 … {pur('7')}  맞을까요?", 64).move_to([0, 1.2, 0])
        self.say("17 ÷ 5 = 2 … 7, 맞을까요?", "연습해 볼까요? 17 나누기 5를 2, 나머지 7이라고 했어요. 맞을까요?")
        self.play(Write(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        no = cross_mark(0.45).next_to(q, LEFT, buff=0.3)
        a = M(f"나머지 7이 5보다 커요 → 한 번 더: 17 ÷ 5 = {g('3')} … {pur('2')}", 46).move_to([0, -0.4, 0])
        self.say(f"바른 답 {g('3')} … {pur('2')}", "나머지 7이 나누는 수 5보다 커서 틀렸어요. 5를 한 번 더 덜어 내면 몫 3, 나머지 2예요.")
        self.play(Create(no), FadeIn(a), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
