"""「수학 원리 돋보기」 나눗셈 차근차근 14화 — 십 모형을 풀어서 나누기

52 ÷ 4: 십 모형 5개를 4묶음 → 1개씩, 남은 십 모형 1개를 일 모형 10개로 바꾸기 → 일 모형 12개를 4묶음 → 3개씩 → 13
세로셈과 나란히(남은 1을 내린 2와 함께 12로)
최종: GRADE=d ./make_final.sh 14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import DivBoard, clear_stage, long_division
from divkit import DivScene


class GdEp14(DivScene):
    EP_NO = 14
    EP_TITLE = "십 모형을 풀어서 나누기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        board = DivBoard(self, 52, 4, who="모둠", item="구슬", unit="개")
        board.show_number()
        board.show_plates()
        board.deal_tens()
        board.exchange()
        board.deal_ones()
        board.show_result()
        board.clear()
        long_division(self, 52, 4, who="모둠", unit="개")
        self.closing(f"나누고 남은 {b('십 모형')}은 {o('일 모형 10개')}로 바꾸어 계속 나눠요\n52 ÷ 4 = {g('13')}",
                     next_preview="나눗셈 차근차근 15화 · 세 자리 수 나누기, 몫은 몇 자리?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"{b('5')}{o('2')} ÷ 4 = ?", 100).move_to([0, 1.0, 0])
        t = M("십 모형 5개는 4묶음으로 똑같이 나누면 1개가 남아요. 어떻게 할까요?", 40).move_to([0, -0.6, 0])
        self.say("52 ÷ 4, 남는 십 모형은?", "52 나누기 4를 해 볼까요? 십 모형 5개를 4묶음으로 나누면 1개가 남아요. 남은 십 모형은 어떻게 할까요?")
        self.play(Write(q), run_time=0.6)
        self.play(FadeIn(t), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)
