"""「수학 원리 돋보기」 개념 차근차근 64화 — 올림·버림·반올림

올림: 243 → 백의 자리까지 300(아래 자리 수를 올림) / 버림: 243 → 200 / 반올림: 바로 아래 자리 0~4 버림, 5~9 올림 3482 → 3500(백), 3480(십)
생활: 학생 124명이 버스 한 대에 40명 → 올림 4대 / 사과 485개를 10개씩 상자에 → 버림 48상자 / 연습: 5761을 세 가지로(백의 자리까지)
최종: GRADE=c ./make_final.sh 64
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
from decimal4 import grid100


class GcEp64(ConceptScene):
    EP_NO = 64
    EP_TITLE = "올림·버림·반올림"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("세 가지 어림", [(f"243을 백의 자리까지", 54, 1.9),
                  (f"{o('올림')}: 아래 자리 수를 올려요 → {g('300')}", 50, 0.9),
                  (f"{b('버림')}: 아래 자리 수를 버려요 → {g('200')}", 50, 0.0),
                  (f"반올림: 바로 아래 자리가 0~4면 버림, 5~9면 올림 → 4라서 {g('200')}", 42, -0.9)],
                  "올림·버림·반올림", "243을 백의 자리까지 나타내 볼까요? 올림은 아래 자리 수를 올려 300, 버림은 아래 자리 수를 버려 200, 반올림은 바로 아래 십의 자리 4를 보고 버려서 200이에요.")
        self.step("생활 속 어림", [(f"학생 124명, 버스 한 대에 40명 → 3대로는 부족 → {o('올림')} {g('4대')}", 42, 1.2),
                  (f"사과 485개를 10개씩 상자에 → 남은 5개는 상자가 안 됨 → {b('버림')} {g('48상자')}", 40, 0.1)],
                  "상황에 맞게 골라요", "학생 124명이 40명씩 버스를 타면, 남는 학생도 타야 하니 올림해서 4대. 사과 485개를 10개씩 상자에 담으면 다 찬 상자만 세니 버림해서 48상자예요.")
        self.ask("5761을 백의 자리까지 올림·버림·반올림", "5761을 세 가지로", "연습해 볼까요? 5761을 올림, 버림, 반올림하여 백의 자리까지 나타내 보세요.",
                 f"올림 {g('5800')} · 버림 {g('5700')} · 반올림 {g('5800')}", "5800, 5700, 5800", "올림은 5800, 버림은 5700, 반올림은 십의 자리 6을 보고 올려서 5800이에요.", qsize=48)
        self.closing(f"{o('올림')}: 올려요 · {b('버림')}: 버려요 · 반올림: 0~4 버림, 5~9 올림\n상황에 알맞은 어림을 골라요",
                     next_preview="개념 차근차근 65화 · 무늬에서 규칙 찾기")
        self.wait(0.5)
