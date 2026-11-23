"""「수학 원리 돋보기」 개념 차근차근 103화 — 몇 시 몇 분, 왜 60분과 24시간일까?

긴바늘 숫자 한 칸 = 5분(5씩 뛰어 세기), 작은 눈금 1분 → 4시 25분 / 1시간 = 60분, 하루 = 24시간, 오전·오후
이야기: 하루를 낮 12·밤 12로 나눈 생각은 옛 이집트, 60씩 묶는 생각은 옛 바빌로니아 — 두 생각이 합쳐짐. 왜 12와 60인지는 확실하지 않음 / 출처
최종: GRADE=c ./make_final.sh 103
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


class GcEp103(ConceptScene):
    EP_NO = 103
    EP_TITLE = "몇 시 몇 분, 왜 60분과 24시간일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("몇 시 몇 분")
        c = clock(4, 25, r=1.6, center=(-4.3, 0.4, 0))
        self.say("긴바늘의 숫자 한 칸은 5분", "긴바늘이 숫자 1을 가리키면 5분, 2는 10분. 숫자 한 칸이 5분이라 5씩 뛰어 세요. 작은 눈금 한 칸은 1분이에요.")
        self.play(FadeIn(c), run_time=0.6)
        t = M(f"긴바늘 5 → 5 × 5 = {b('25분')}\n짧은바늘 4와 5 사이 → {o('4시')}\n→ {g('4시 25분')}", 42).move_to([1.8, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("1시간과 하루", [(f"긴바늘이 한 바퀴 = {o('60분')} = 1시간", 50, 1.5),
                  (f"하루 = {b('24시간')} (짧은바늘이 두 바퀴)", 50, 0.5),
                  ("밤 12시~낮 12시: 오전 · 낮 12시~밤 12시: 오후", 42, -0.5)],
                  "60분, 24시간", "긴바늘이 한 바퀴 돌면 60분, 곧 1시간이에요. 하루는 24시간이고, 밤 12시부터 낮 12시까지를 오전, 낮 12시부터 밤 12시까지를 오후라고 해요.")
        self.step("이야기: 왜 24와 60일까?", [(f"하루를 {o('낮 12, 밤 12')}로 나눈 생각: 옛 {o('이집트')}", 44, 1.4),
                  (f"{b('60')}씩 묶어 세는 생각: 옛 {b('바빌로니아')}", 44, 0.5),
                  ("두 생각이 합쳐져 24시간, 60분, 60초가 되었어요", 42, -0.4),
                  ("왜 하필 12와 60을 골랐는지는 아직 확실하지 않아요", 36, -1.3)],
                  "이집트와 바빌로니아", "하루를 낮 12, 밤 12로 나눈 생각은 옛 이집트에서, 60씩 묶는 생각은 옛 바빌로니아에서 왔어요. 두 생각이 합쳐져 지금의 시간이 되었어요. 왜 12와 60을 골랐는지는 아직 확실하지 않대요.", hold=1.6)
        show_sources(self, ["· 시간 나눔의 역사: Scientific American 'Why is a minute divided into 60 seconds, an hour into 60 minutes, yet there are only 24 hours in a day?'",
                            "· 이집트 별시계: McMaster 대학교 Brighter World 기사"])
        self.closing(f"숫자 한 칸 = 5분 · 1시간 = {o('60분')} · 하루 = {b('24시간')}\n시간 나누기는 이집트와 바빌로니아에서 왔어요",
                     next_preview="개념 차근차근 104화 · 초, 시간의 덧셈과 뺄셈")
        self.wait(0.5)
