"""「수학 원리 돋보기」 개념 차근차근 19화 — 세 자리 수 덧셈·뺄셈

덧셈: 일 → 십 → 백, 받아올림 두 번 368 + 257 = 625 / 뺄셈: 받아내림 두 번 432 − 178 = 254
어림으로 확인(약 370 + 260 ≈ 630) / 연습
최종: GRADE=c ./make_final.sh 19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from addsub import add_vertical, sub_vertical


class GcEp19(ConceptScene):
    EP_NO = 19
    EP_TITLE = "세 자리 수 덧셈·뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("받아올림이 두 번")
        self.say("368 + 257", "368 더하기 257. 두 자리 수와 똑같이 일의 자리부터 차례로 더해요.")
        add_vertical(self, 368, 257)
        self.settle()
        clear_stage(self, 0.5)
        self.section("받아내림이 두 번")
        self.say("432 − 178", "432 빼기 178. 일의 자리부터 차례로 빼요.")
        sub_vertical(self, 432, 178)
        self.settle()
        clear_stage(self, 0.5)
        self.estimate()
        self.practice()
        self.closing(f"세 자리 수도 {o('일 → 십 → 백')} 차례로, 두 자리 수와 같은 방법\n어림셈으로 답이 알맞은지 확인해요",
                     next_preview="개념 차근차근 20화 · 계산을 도와준 도구들")
        self.wait(0.5)

    def estimate(self):
        self.section("어림으로 확인해요")
        e1 = M(f"368 + 257 → 약 {b('370')} + {o('260')} = {g('630')}", 54).move_to([0, 1.0, 0])
        e2 = M(f"계산한 답 625 → 630과 {g('가까워요')}", 50).move_to([0, -0.2, 0])
        self.say("답이 알맞은지 어림으로", "답이 알맞은지 어림해 볼까요? 368은 약 370, 257은 약 260. 더하면 약 630. 계산한 625와 가까우니 알맞아요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 476 + 385", 64), M("② 503 − 267", 64)).arrange(RIGHT, buff=1.6).move_to([0, 1.2, 0])
        self.say("세로셈으로 계산해 보세요", "연습해 볼까요? 세로셈으로 계산해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① {g('861')}    ② {g('236')}", 64).move_to([0, -0.2, 0])
        t = M("② 십의 자리가 0이라 백의 자리에서 먼저 받아내려요", 36, SOFT).move_to([0, -1.3, 0])
        self.say(f"① {g('861')}  ② {g('236')}", "476 더하기 385는 861. 503 빼기 267은 236이에요. 2번은 십의 자리가 0이라 백의 자리에서 먼저 받아내려요.")
        self.play(FadeIn(a), FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
