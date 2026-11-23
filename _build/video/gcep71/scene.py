"""「수학 원리 돋보기」 개념 차근차근 71화 — 백분율

기준량을 100으로 볼 때의 비율, % (퍼센트) / 0.4 = 40/100 = 40 % / 비율 × 100 / 100칸 모눈 / 생활: 할인율, 득표율
이야기: % 는 이탈리아 상인들이 per cento(100마다)를 줄여 쓰던 글자가 모양이 바뀐 것(D. E. Smith 『Rara Arithmetica』 1908 보고) / 연습
최종: GRADE=c ./make_final.sh 71
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
from decimal4 import grid100


class GcEp71(ConceptScene):
    EP_NO = 71
    EP_TITLE = "백분율"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("100을 기준으로")
        g_ = grid100(40, size=3.0).move_to([-3.4, 0.5, 0])
        self.say("100칸 중 40칸", "100칸 중 40칸을 칠했어요. 기준량을 100으로 볼 때의 비율을 백분율이라고 해요.")
        self.play(FadeIn(g_), run_time=0.7)
        e1 = M(f"40/100 = 0.4 = {g('40 %')}", 56).move_to([2.6, 1.0, 0])
        e2 = M(f"비율 × 100 → 백분율\n0.4 × 100 = {g('40')} %", 46).move_to([2.6, -0.4, 0])
        self.say(f"{g('40 퍼센트')}", "100분의 40, 0.4를 40퍼센트라고 쓰고 읽어요. 비율에 100을 곱하면 백분율이 돼요.")
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("생활 속 백분율", [(f"할인율: 10000원짜리를 2000원 깎아 줘요 → 2000 ÷ 10000 = 0.2 = {g('20 %')}", 40, 1.2),
                  (f"득표율: 25명 중 15표 → 15 ÷ 25 = 0.6 = {g('60 %')}", 44, 0.2)],
                  "할인율과 득표율", "1만 원짜리 물건을 2000원 깎아 주면 할인율은 20퍼센트. 25명 중 15표를 받으면 득표율은 60퍼센트예요.")
        self.step("이야기: % 기호", [(f"이탈리아 상인들이 '100마다'라는 말 {o('per cento')}를", 44, 1.2),
                  ("빨리 쓰려고 줄여 적던 글자가 조금씩 모양이 바뀌어 % 가 되었대요", 40, 0.3)],
                  "% 는 '100마다'라는 말에서", "퍼센트 기호는 약 500, 600년 전 이탈리아 상인들이 100마다라는 뜻의 페르 첸토를 빨리 쓰려고 줄여 적던 글자가 조금씩 모양이 바뀌어 생겼다고 해요.")
        self.ask("3/5을 백분율로", "3/5을 백분율로", "연습해 볼까요? 5분의 3을 백분율로 나타내 보세요.",
                 f"3/5 = 0.6 → 0.6 × 100 = {g('60 %')}", f"{g('60 %')}", "5분의 3은 0.6, 100을 곱하면 60퍼센트예요.")
        show_sources(self, ["· % 기호의 유래: D. E. Smith 『Rara Arithmetica』(1908)의 보고 — 위키백과 'Percent sign'(Smith·Cajori 인용)"])
        self.closing(f"기준량을 {o('100')}으로 할 때의 비율: 백분율 (%)\n0.4 = 40/100 = {g('40 %')}",
                     next_preview="개념 차근차근 72화 · 비례식")
        self.wait(0.5)
