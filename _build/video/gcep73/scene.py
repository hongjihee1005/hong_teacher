"""「수학 원리 돋보기」 개념 차근차근 73화 — 비례배분

전체를 주어진 비로 나누기: 사탕 10개를 2 : 3 → 전체 5칸 중 2칸·3칸 → 10 × 2/5 = 4, 10 × 3/5 = 6 (막대 그림)
확인: 4 + 6 = 10 / 연습: 24를 5 : 3
최종: GRADE=c ./make_final.sh 73
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
from manim import Rectangle


class GcEp73(ConceptScene):
    EP_NO = 73
    EP_TITLE = "비례배분"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("전체를 비로 나누기")
        bar = frac_bar(5, 0, width=7.0).move_to([0, 1.5, 0])
        for k in range(5):
            bar[k].set_fill(ORANGE if k < 2 else BLUE, 1)
        self.say("사탕 10개를 2 : 3으로", "사탕 10개를 형과 동생이 2 대 3으로 나누려고 해요. 막대를 2칸과 3칸, 모두 5칸으로 나누어 볼까요?")
        self.play(FadeIn(bar), run_time=0.6)
        e1 = M(f"형: 10 × {o('2/5')} = {g('4')}개", 46).move_to([-3.2, 0.1, 0])
        e2 = M(f"동생: 10 × {b('3/5')} = {g('6')}개", 46).move_to([3.2, 0.1, 0])
        self.say(f"형 {g('4개')}, 동생 {g('6개')}", "형은 전체의 5분의 2, 10 곱하기 5분의 2는 4개. 동생은 5분의 3, 6개예요.")
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.6)
        t = M(f"확인: 4 + 6 = 10,  4 : 6 = 2 : 3", 44).move_to([0, -1.1, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("24를 5 : 3으로 비례배분", "24를 5 : 3으로", "연습해 볼까요? 24를 5 대 3으로 비례배분해 보세요.",
                 f"24 × 5/8 = {g('15')},  24 × 3/8 = {g('9')}", f"{g('15')}와 {g('9')}", "전체 8칸 중 5칸과 3칸. 24 곱하기 8분의 5는 15, 8분의 3은 9예요.", qsize=64)
        self.closing(f"비례배분: 전체 × {o('(내 몫 / 비의 합)')}\n10을 2 : 3으로 → {g('4')}와 {g('6')}",
                     next_preview="개념 차근차근 74화 · 여러 가지 모양: 상자·둥근기둥·공")
        self.wait(0.5)
