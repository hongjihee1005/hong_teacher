"""「수학 원리 돋보기」 개념 차근차근 36화 — 소수 두 자리·세 자리

100칸 모눈: 한 칸 = 1/100 = 0.01(영 점 영일) / 0.37 = 0.1이 3개 + 0.01이 7개 / 1/1000 = 0.001
자리 이름: 소수 첫째·둘째·셋째 자리 / 2.546 읽기(이 점 오사육) / 1 m = 100 cm → 0.01 m = 1 cm
연습: 0.01이 45개, 3.208 읽기
최종: GRADE=c ./make_final.sh 36
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
from fraction import frac, frac_bar, row
from decimal4 import dec_markup, dec_vertical, grid100


class GcEp36(ConceptScene):
    EP_NO = 36
    EP_TITLE = "소수 두 자리·세 자리"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.hundredth()
        self.places()
        self.practice()
        self.closing(f"1/100 = {o('0.01')},  1/1000 = {b('0.001')}\n소수는 숫자를 하나씩 읽어요: 2.546 → 이 점 오사육",
                     next_preview="개념 차근차근 37화 · 소수의 크기 비교")
        self.wait(0.5)

    def hundredth(self):
        self.section("1을 100칸으로")
        g_ = grid100(37, size=3.2).move_to([-3.4, 0.4, 0])
        self.say("1을 100칸으로 나누면", "1을 똑같이 100칸으로 나누었어요. 한 칸은 100분의 1, 0.01이라고 쓰고 영 점 영일이라고 읽어요.")
        self.play(FadeIn(g_), run_time=0.8)
        e1 = M(f"한 칸 = 1/100 = {o('0.01')}", 48).move_to([2.6, 1.3, 0])
        e2 = M(f"37칸 = {g('0.37')}\n(0.1이 3개, 0.01이 7개)", 44).move_to([2.6, 0.0, 0])
        self.say(f"37칸은 {g('0.37')}", "칠한 37칸은 0.37, 영 점 삼칠. 0.1이 3줄, 0.01이 7칸이에요.")
        self.play(FadeIn(e1), run_time=0.4)
        self.play(FadeIn(e2), run_time=0.4)
        e3 = M(f"1/1000 = {b('0.001')} (영 점 영영일)", 40).move_to([2.6, -1.3, 0])
        self.say(f"1/1000 = {b('0.001')}", "100칸 하나를 또 10칸으로 나누면 1000분의 1, 0.001이에요.")
        self.play(FadeIn(e3), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def places(self):
        self.section("자리 이름과 읽기")
        n = M(dec_markup("2.546"), 120).move_to([0, 1.3, 0])
        self.say("2.546", "2.546을 볼까요?")
        self.play(FadeIn(n), run_time=0.5)
        labs = M(f"일의 자리 2 · {o('소수 첫째')} 5 · {b('소수 둘째')} 4 · 소수 셋째 6", 38).move_to([0, -0.1, 0])
        self.say("소수 첫째, 둘째, 셋째 자리", "소수점 오른쪽은 차례로 소수 첫째 자리, 둘째 자리, 셋째 자리예요.")
        self.play(FadeIn(labs), run_time=0.5)
        r = M(f"읽기: {g('이 점 오사육')} (오백사십육이 아니에요)", 46).move_to([0, -1.1, 0])
        self.say(f"{g('이 점 오사육')}", "소수점 아래는 숫자를 하나씩 읽어요. 이 점 오사육. 오백사십육이라고 읽지 않아요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("① 0.01이 45개인 수   ② 3.208 읽기", 52).move_to([0, 1.2, 0])
        self.say("두 문제를 풀어요", "연습해 볼까요? 0.01이 45개인 수를 쓰고, 3.208을 읽어 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① {g('0.45')}   ② {g('삼 점 이영팔')}", 60).move_to([0, -0.4, 0])
        self.say(f"{g('0.45')}, {g('삼 점 이영팔')}", "0.01이 45개면 0.45. 3.208은 삼 점 이영팔이라고 읽어요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
