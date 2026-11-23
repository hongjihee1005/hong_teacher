"""「수학 원리 돋보기」 개념 차근차근 122화 — 막대그래프와 플레이페어

좋아하는 운동(축구 8, 피구 6, 줄넘기 3, 수영 5) → 가로·세로·눈금 한 칸 정하기 → 막대 / 가장 많은 것·적은 것, 몇 배 / 표와 비교
이야기: 1786년 영국 윌리엄 플레이페어가 『The Commercial and Political Atlas』에 막대그래프를 실음(널리 알려진 처음) / 연습 / 출처
최종: GRADE=c ./make_final.sh 122
"""
import numpy as np
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowFromEdge, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from conceptkit import poly
from manim import Rectangle, Square, Circle, Dot, DashedLine, PI, Sector
from fraction import frac_bar
from conceptkit import bar_chart


class GcEp122(ConceptScene):
    EP_NO = 122
    EP_TITLE = "막대그래프와 플레이페어"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("막대그래프 그리기")
        ch = bar_chart([("축구", 8), ("피구", 6), ("줄넘기", 3), ("수영", 5)], x0=-5.0, y0=-1.3, unit=0.36, ticks=2, step=2)
        self.say("가로와 세로를 정하고 눈금을 그려요", "좋아하는 운동을 조사했어요. 가로에 운동, 세로에 학생 수를 정하고 눈금 한 칸의 크기를 정해 막대를 그려요.")
        self.play(FadeIn(ch[0]), FadeIn(ch[1]), FadeIn(ch[3]), run_time=0.6)
        self.play(LaggedStart(*[GrowFromEdge(b_, DOWN) for b_ in ch.bars], lag_ratio=0.25), run_time=1.4)
        t = M(f"가장 많은 운동: {g('축구')}\n축구는 줄넘기보다 {o('5명')} 더\n막대 길이로 한눈에 비교", 38).move_to([3.4, 0.6, 0])
        self.say("막대의 길이로 비교", "막대가 가장 긴 축구를 가장 많이 좋아해요. 막대의 길이로 많고 적음을 한눈에 비교할 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.step("이야기: 막대그래프의 처음", [(f"약 240년 전, {o('1786년')} 영국의 {b('윌리엄 플레이페어')}", 44, 1.3),
                  ("숫자 표를 한눈에 보이게 하려고 무역 자료를 막대로 그려 책에 실었어요", 38, 0.3),
                  ("자료를 막대로 나타낸 그래프로 가장 널리 알려진 처음이에요", 36, -0.6)],
                  "플레이페어의 막대그래프", "약 240년 전인 1786년, 영국의 윌리엄 플레이페어는 숫자로 된 무역 자료를 한눈에 보이게 하려고 막대로 그려 책에 실었어요. 자료를 막대로 나타낸 그래프로 가장 널리 알려진 처음이에요.", hold=1.6)
        self.ask("세로 눈금 한 칸이 2명일 때, 막대가 7칸이면?", "몇 명일까요?", "연습해 볼까요? 세로 눈금 한 칸이 2명을 나타낼 때, 막대가 7칸이면 몇 명일까요?",
                 f"2 × 7 = {g('14명')}", f"{g('14명')}", "한 칸이 2명이니 7칸은 14명이에요.", qsize=50)
        show_sources(self, ["· 플레이페어의 막대그래프(1786): M. Friendly, 'A Brief History of Data Visualization'·'The Golden Age of Statistical Graphics'"])
        self.closing(f"막대그래프: 막대의 {o('길이')}로 많고 적음을 한눈에\n눈금 한 칸의 크기를 먼저 확인해요",
                     next_preview="개념 차근차근 123화 · 꺾은선그래프")
        self.wait(0.5)
