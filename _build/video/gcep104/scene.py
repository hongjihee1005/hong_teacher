"""「수학 원리 돋보기」 개념 차근차근 104화 — 초, 시간의 덧셈과 뺄셈

초바늘 한 칸 = 1초, 60초 = 1분 / 덧셈: 1시 40분 + 30분 = 1시 70분 → 2시 10분(60분을 1시간으로) / 뺄셈: 3시 10분 − 40분 → 1시간을 60분으로 받아내림 → 2시 30분
연습: 2분 50초 + 1분 30초
최종: GRADE=c ./make_final.sh 104
"""
import numpy as np
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
from conceptkit import clock
from manim import Rectangle, Square, Circle, Dot, PI


class GcEp104(ConceptScene):
    EP_NO = 104
    EP_TITLE = "초, 시간의 덧셈과 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("초", [(f"초바늘이 작은 눈금 한 칸 = {o('1초')}", 50, 1.3), (f"{o('60초')} = 1분", 60, 0.2)],
                  "60초는 1분", "초바늘이 작은 눈금 한 칸을 가는 동안이 1초예요. 초바늘이 한 바퀴 돌면 60초, 곧 1분이에요.")
        self.step("시간의 덧셈", [("1시 40분 + 30분", 60, 1.6), ("= 1시 70분", 54, 0.6),
                  (f"70분 = {o('1시간')} 10분 → {g('2시 10분')}", 54, -0.4)],
                  "60분이 되면 1시간으로", "1시 40분에서 30분이 지나면 1시 70분. 60분이 넘으면 60분을 1시간으로 올려 2시 10분이에요.")
        self.step("시간의 뺄셈", [("3시 10분 − 40분", 60, 1.6), (f"3시 10분 = {b('2시 70분')} (1시간을 60분으로)", 50, 0.6),
                  (f"2시 70분 − 40분 = {g('2시 30분')}", 54, -0.4)],
                  "1시간을 60분으로 받아내림", "10분에서 40분을 뺄 수 없으니, 1시간을 60분으로 바꾸어 2시 70분으로 생각해요. 70분 빼기 40분은 30분, 2시 30분이에요.")
        self.ask("2분 50초 + 1분 30초", "2분 50초 + 1분 30초", "연습해 볼까요? 2분 50초 더하기 1분 30초는 얼마일까요?",
                 f"3분 80초 → 60초 = 1분 → {g('4분 20초')}", f"{g('4분 20초')}", "3분 80초에서 60초를 1분으로 올리면 4분 20초예요.", qsize=60)
        self.closing(f"60초 = 1분 · 60분 = 1시간\n시간 계산은 {o('60')}이 되면 올리고, 모자라면 60으로 받아내려요",
                     next_preview="개념 차근차근 105화 · 달력: 1주일과 1년")
        self.wait(0.5)
