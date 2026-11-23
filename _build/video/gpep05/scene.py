"""「수학 원리 돋보기」 분수 준비 5화 — 나눗셈 ① 똑같이 나누어 주기

사탕 12개를 접시 3개에 한 개씩 돌아가며 → 4개씩 → 12 ÷ 3 = 4 ('12 나누기 3은 4')
똑같지 않게 나누면 나눗셈이 아님 / 연습: 10개를 2명에게 → 5개씩
최종: GRADE=p ./make_final.sh 5
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import DOWN, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from items import check_mark, cross_mark
from prepkit import PINK, RED, PrepScene, dish, items


def slot(d, k, cols=2, step=0.5):
    """접시 d 위 k번째 자리"""
    c = d.plate.get_center() + UP * 0.55
    r, q = divmod(k, cols)
    return c + np.array([(q - (cols - 1) / 2) * step, r * step, 0])


class GpEp05(PrepScene):
    EP_NO = 5
    EP_TITLE = "나눗셈 ① 똑같이 나누어 주기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.share()
        self.fair()
        self.practice()
        self.closing(f"12개를 3명에게 {g('똑같이')} 나누어 주면 4개씩\n{b('12')} ÷ {o('3')} = {g('4')}  ('12 나누기 3은 4')",
                     next_preview="분수 준비 6화 · 나눗셈 ② 몇 개씩 묶기")
        self.wait(0.5)

    def deal(self, its, dishes, quick=False):
        n, d = len(its), len(dishes)
        for i, m in enumerate(its):
            self.play(m.animate.move_to(slot(dishes[i % d], i // d)), run_time=0.22 if quick else 0.35)

    def share(self):
        self.section("나누어 주기")
        its = items(12, y=2.0, step=0.55, r=0.21)
        dishes = VGroup(*[dish(n) for n in ["가 접시", "나 접시", "다 접시"]]).arrange(RIGHT, buff=1.4).move_to([0, -0.6, 0])
        self.say("사탕 12개를 3명에게 똑같이 나누어 주려면?", "사탕 12개를 친구 3명에게 똑같이 나누어 주려고 해요. 한 명에게 몇 개씩 줄 수 있을까요?")
        self.play(FadeIn(its, lag_ratio=0.05), FadeIn(dishes), run_time=0.9)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.say("한 개씩 돌아가며 나누어 줘요", "한 개씩 돌아가며 나누어 줘 볼까요? 가, 나, 다, 가, 나, 다…")
        self.deal(its, dishes)
        labs = VGroup(*[T("4개", 40, GREEN).next_to(d, UP, buff=1.25) for d in dishes])
        self.say(f"한 명에게 {g('4개')}씩", "다 나누어 주었더니 한 명에게 4개씩 돌아갔어요.")
        self.play(FadeIn(labs), run_time=0.5)
        eq = M(f"{b('12')} ÷ {o('3')} = {g('4')}", 64).move_to([0, -2.15, 0])
        self.say(f"{b('12')} ÷ {o('3')} = {g('4')}", "이것을 12 나누기 3은 4라고 쓰고 읽어요. 나눗셈이에요.")
        self.play(Write(eq), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def fair(self):
        self.section("'똑같이'가 중요해요")
        dishes = VGroup(*[dish(n) for n in ["가", "나", "다"]]).arrange(RIGHT, buff=1.4).move_to([0, -0.4, 0])
        counts = [6, 4, 2]
        ms = VGroup()
        for d, c in zip(dishes, counts):
            for k in range(c):
                ms.add(VGroup(*items(1, step=0.5, r=0.21)).move_to(slot(d, k)))
        self.say("이렇게 나누면 어떨까요?", "만약 이렇게 6개, 4개, 2개로 나누면 어떨까요?")
        self.play(FadeIn(dishes), FadeIn(ms, lag_ratio=0.05), run_time=0.9)
        no = cross_mark(0.5).move_to([0, 2.3, 0])
        t = M("똑같지 않으면 나눗셈이 아니에요", 46).move_to([0, -2.1, 0])
        self.say(f"{o('똑같지 않으면')} 나눗셈이 아니에요", "모두 12개를 나누었지만 똑같지 않아요. 나눗셈은 꼭 똑같이 나누는 거예요.")
        self.play(Create(no), FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        its = items(10, color=PINK, y=2.0, step=0.55, r=0.21)
        dishes = VGroup(*[dish(n) for n in ["가 접시", "나 접시"]]).arrange(RIGHT, buff=2.4).move_to([0, -0.6, 0])
        self.say("10개를 2명에게 똑같이 나누면?", "연습해 볼까요? 사탕 10개를 2명에게 똑같이 나누어 주면 한 명에게 몇 개씩일까요?")
        self.play(FadeIn(its, lag_ratio=0.05), FadeIn(dishes), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        self.deal(its, dishes, quick=True)
        eq = M(f"{b('10')} ÷ {o('2')} = {g('5')}", 64).move_to([0, -2.15, 0])
        self.say(f"한 명에게 {g('5개')}: {b('10')} ÷ {o('2')} = {g('5')}", "한 명에게 5개씩이에요. 10 나누기 2는 5.")
        self.play(Write(eq), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
