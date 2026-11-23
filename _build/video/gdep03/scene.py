"""「수학 원리 돋보기」 나눗셈 차근차근 3화 — 몇 명에게? 몇 개씩? 두 가지 뜻

같은 12 ÷ 3: ① 12개를 3명에게 똑같이 → 한 명에게 4개 ② 12개를 3개씩 묶으면 → 4묶음
가려내는 방법: '몇 명(몇 묶음)에게'를 알면 ①, '한 묶음에 몇 개'를 알면 ② / 연습 2문제
최종: GRADE=d ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene, deal
from prepkit import PINK, RED, dish, items, regroup


class GdEp03(DivScene):
    EP_NO = 3
    EP_TITLE = "몇 명에게? 몇 개씩? 두 가지 뜻"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.two()
        self.tell()
        self.practice()
        self.closing(f"① {o('몇 명에게')} 똑같이 → 한 명의 몫   ② {b('몇 개씩')} 묶으면 → 묶음 수\n두 가지 모두 같은 나눗셈 식이에요",
                     next_preview="나눗셈 차근차근 4화 · 뺄셈으로 나눗셈하기")
        self.wait(0.5)

    def two(self):
        self.section("같은 식, 두 장면")
        eq = M(f"{b('12')} ÷ {o('3')} = {g('4')}", 72).move_to([0, 2.5, 0])
        self.play(FadeIn(eq), run_time=0.4)
        t1 = M(f"① 12개를 {o('3명에게')} 똑같이", 38).move_to([-3.6, 1.6, 0])
        its = items(12, y=2.1, step=0.3, r=0.12)
        its.move_to([-3.6, 0.9, 0])
        dishes = VGroup(*[dish(n, w=1.6, h=0.6) for n in ["가", "나", "다"]]).arrange(RIGHT, buff=0.3).move_to([-3.6, -0.6, 0])
        self.say(f"① {o('3명에게')} 나누어 주기", "첫째, 구슬 12개를 3명에게 똑같이 나누어 주는 장면이에요.")
        self.play(FadeIn(t1), FadeIn(its), FadeIn(dishes), run_time=0.7)
        for i, m in enumerate(its):
            d = dishes[i % 3].plate
            k = i // 3
            self.play(m.animate.move_to(d.get_center() + UP * 0.35 + RIGHT * (k % 2 - 0.5) * 0.3 + UP * (k // 2) * 0.3), run_time=0.15)
        a1 = M(f"한 명에게 {g('4개')}", 36).move_to([-3.6, -1.8, 0])
        self.play(FadeIn(a1), run_time=0.4)
        t2 = M(f"② 12개를 {b('3개씩')} 묶으면", 38).move_to([3.4, 1.6, 0])
        its2 = items(12, y=0.4, step=0.34, r=0.13)
        its2.move_to([3.4, 0.4, 0])
        self.say(f"② {b('3개씩')} 묶기", "둘째, 구슬 12개를 3개씩 묶는 장면이에요.")
        self.play(FadeIn(t2), FadeIn(its2), run_time=0.6)
        from items import group_boxes, layout
        pts = layout(12, 3, 4, y=0.4, step=0.34, gap=0.6)
        self.play(*[m.animate.move_to(p + [3.4, 0, 0]) for m, p in zip(its2, pts)], run_time=0.7)
        bx = group_boxes(list(its2), 3, 4)
        self.play(FadeIn(bx), run_time=0.5)
        a2 = M(f"{g('4묶음')}", 36).move_to([3.4, -1.8, 0])
        self.play(FadeIn(a2), run_time=0.4)
        self.say(f"둘 다 {b('12')} ÷ {o('3')} = {g('4')}", "두 장면 모두 12 나누기 3은 4로 나타내요. 하지만 4가 뜻하는 것이 달라요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def tell(self):
        self.section("어떻게 가려낼까?")
        r1 = M(f"'{o('몇 명')}에게 / {o('몇 군데')}에' 똑같이 → 답은 {g('한 명(한 군데)의 양')}", 36).move_to([0, 1.0, 0])
        r2 = M(f"'{b('몇 개씩')}' 묶거나 담으면 → 답은 {g('묶음(봉지) 수')}", 40).move_to([0, -0.2, 0])
        self.say("문제에서 무엇을 알려 주는지 보아요", "문제가 무엇을 알려 주는지 보면 가려낼 수 있어요.")
        self.play(FadeIn(r1), run_time=0.6)
        self.play(FadeIn(r2), run_time=0.6)
        t = M("답에 붙는 단위(개, 봉지, 명)도 달라져요", 38, SOFT).move_to([0, -1.6, 0])
        self.say("답의 단위도 달라져요", "그래서 답에 붙이는 단위도 개, 봉지처럼 달라져요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def ask(self, q, narr, ans, ans_narr):
        t = M(q, 40).move_to([0, 1.2, 0])
        if t.width > 12.4:
            t.scale_to_fit_width(12.4)
        self.say("어떤 뜻일까요? 식과 답은?", narr)
        self.play(FadeIn(t), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(ans, 44).move_to([0, -0.4, 0])
        self.say(ans, ans_narr)
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        self.ask("공책 15권을 5권씩 묶으면 몇 묶음일까요?", "연습 1. 공책 15권을 5권씩 묶으면 몇 묶음일까요?",
                 f"{b('5권씩')} 묶기 → 15 ÷ 5 = {g('3')}, {g('3묶음')}", "5권씩 묶는 뜻이에요. 15 나누기 5는 3, 3묶음이에요.")
        self.ask("쿠키 18개를 접시 3개에 똑같이 담으면 한 접시에 몇 개일까요?", "연습 2. 쿠키 18개를 접시 3개에 똑같이 담으면 한 접시에 몇 개일까요?",
                 f"{o('3접시에')} 똑같이 → 18 ÷ 3 = {g('6')}, {g('6개')}", "접시 3개에 똑같이 나누는 뜻이에요. 18 나누기 3은 6, 한 접시에 6개예요.")
        self.hide_chip()
