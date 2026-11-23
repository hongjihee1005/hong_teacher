"""「수학 원리 돋보기」 나눗셈 차근차근 2화 — 나눗셈 식 읽고 쓰기

구슬 12개를 3명에게 → 4개씩 → 12 ÷ 3 = 4 / 나누어지는 수·나누는 수·몫 / '12 나누기 3은 4'
÷ 기호 / 연습: 20 ÷ 5 = 4의 이름 붙이기
최종: GRADE=d ./make_final.sh 2
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene, deal, term_eq, term_labels
from prepkit import RED, dish, items


class GdEp02(DivScene):
    EP_NO = 2
    EP_TITLE = "나눗셈 식 읽고 쓰기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.story()
        self.names()
        self.practice()
        self.closing(f"{b('12')} ÷ {o('3')} = {g('4')}  '12 나누기 3은 4'\n{b('나누어지는 수')} · {o('나누는 수')} · {g('몫')}",
                     next_preview="나눗셈 차근차근 3화 · 몇 명에게? 몇 개씩? 두 가지 뜻")
        self.wait(0.5)

    def story(self):
        self.section("식으로 나타내기")
        its = items(12, y=2.1, step=0.55, r=0.21)
        dishes = VGroup(*[dish(n) for n in ["가", "나", "다"]]).arrange(RIGHT, buff=1.4).move_to([0, -0.4, 0])
        self.say("구슬 12개를 3명에게 똑같이", "구슬 12개를 3명에게 똑같이 나누어 주어요.")
        self.play(FadeIn(its, lag_ratio=0.05), FadeIn(dishes), run_time=0.8)
        deal(self, its, dishes, quick=True)
        self.say(f"한 명에게 {g('4개')}씩", "한 명에게 4개씩이에요.")
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.5)
        eq = term_eq(12, 3, 4, size=120).move_to([0, 0.5, 0])
        self.say("이것을 식으로 쓰면", "이것을 식으로 써 볼까요?")
        self.play(Write(eq), run_time=1.2)
        r = M(f"읽기: '{b('12')} 나누기 {o('3')}은 {g('4')}'", 50).move_to([0, -1.6, 0])
        self.say(f"'{b('12')} 나누기 {o('3')}은 {g('4')}'", "12 나누기 3은 4라고 읽어요. 가운데 기호는 나누기 기호예요.")
        self.play(FadeIn(r), Indicate(eq[1], scale_factor=1.4), run_time=0.8)
        self.wait(1.0)
        self.settle()
        self.eq = eq
        self.play(FadeOut(r), run_time=0.3)

    def names(self):
        self.section("이름 붙이기")
        eq = self.eq
        labs = term_labels(eq, 40)
        nar = ["처음에 있던 전체 12는 나누어지는 수예요.", "몇으로 나누는지 알려 주는 3은 나누는 수예요.", "나누어서 나온 답 4는 몫이라고 해요."]
        subs = [f"전체 {b('12')} = {b('나누어지는 수')}", f"{o('3')} = {o('나누는 수')}", f"답 {g('4')} = {g('몫')}"]
        for lb, s, n_ in zip(labs, subs, nar):
            self.say(s, n_)
            self.play(Create(lb[0]), FadeIn(lb[1]), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        eq = term_eq(20, 5, 4, size=110).move_to([0, 0.5, 0])
        self.say("20 ÷ 5 = 4, 각각의 이름은?", "연습해 볼까요? 20 나누기 5는 4. 20, 5, 4의 이름을 말해 보세요.")
        self.play(Write(eq), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        labs = term_labels(eq, 40)
        self.say(f"{b('20')} 나누어지는 수, {o('5')} 나누는 수, {g('4')} 몫", "20은 나누어지는 수, 5는 나누는 수, 4는 몫이에요.")
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.4, run_time=1.2))
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
