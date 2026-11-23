"""「수학 원리 돋보기」 개념 차근차근 102화 — 몇 시, 몇 시 30분

짧은바늘(시)·긴바늘(분) / 긴바늘이 12 → '몇 시'(3시) / 긴바늘이 6 → '몇 시 30분'(짧은바늘은 두 수 사이) / 연습: 7시 30분
최종: GRADE=c ./make_final.sh 102
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


class GcEp102(ConceptScene):
    EP_NO = 102
    EP_TITLE = "몇 시, 몇 시 30분"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("몇 시")
        c = clock(3, 0, r=1.6, center=(-4.3, 0.4, 0))
        self.say("짧은바늘과 긴바늘", "시계에는 짧은바늘과 긴바늘이 있어요. 짧은바늘은 시를, 긴바늘은 분을 알려 줘요.")
        self.play(FadeIn(c), run_time=0.6)
        t = M(f"긴바늘이 {b('12')}, 짧은바늘이 {o('3')}\n→ {g('3시')}", 46).move_to([1.8, 0.6, 0])
        self.say(f"{g('3시')}", "긴바늘이 12를 가리키고 짧은바늘이 3을 가리키면 3시예요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.section("몇 시 30분")
        c = clock(3, 30, r=1.6, center=(-4.3, 0.4, 0))
        self.play(FadeIn(c), run_time=0.5)
        t = M(f"긴바늘이 {b('6')}, 짧은바늘이 {o('3과 4 사이')}\n→ {g('3시 30분')}", 44).move_to([1.8, 0.6, 0])
        self.say(f"{g('3시 30분')}", "긴바늘이 6을 가리키고, 짧은바늘이 3과 4 사이에 있으면 3시 30분이에요. 짧은바늘은 3에서 4로 가는 중이라 가운데쯤 있어요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("연습해요")
        c = clock(7, 30, r=1.5, center=(0, 0.6, 0))
        self.say("몇 시 몇 분일까요?", "연습해 볼까요? 이 시계는 몇 시 몇 분일까요?")
        self.play(FadeIn(c), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"{g('7시 30분')}", 56).move_to([0, -1.5, 0])
        self.say(f"{g('7시 30분')}", "긴바늘이 6, 짧은바늘이 7과 8 사이. 7시 30분이에요.")
        self.play(FadeIn(a), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
        self.closing(f"{o('짧은바늘')}: 시 · {b('긴바늘')}: 분\n긴바늘이 12면 '몇 시', 6이면 '몇 시 30분'",
                     next_preview="개념 차근차근 103화 · 몇 시 몇 분, 왜 60분과 24시간일까?")
        self.wait(0.5)
