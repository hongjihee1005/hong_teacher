"""「수학 원리 돋보기」 개념 차근차근 81화 — 각도와 각도기, 왜 360°일까?

각의 크기 = 벌어진 정도(변의 길이와 상관없음) / 직각을 90등분한 1° / 각도기 읽기(중심·밑금 맞추기, 0에서 시작하는 눈금) / 예각·둔각
이야기: 원을 360°로 나누는 방법은 바빌로니아 60진법 천문학에서 와서 그리스 히파르코스가 이어받음, 왜 360인지는 여러 설 / 연습 / 출처
최종: GRADE=c ./make_final.sh 81
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from conceptkit import poly, regular, right_mark
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, Arrow, PI


class GcEp81(ConceptScene):
    EP_NO = 81
    EP_TITLE = "각도와 각도기, 왜 360°일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("각의 크기")
        v = np.array([-4.5, -0.4, 0])
        a1 = VGroup(Line(v, v + np.array([3.0, 0, 0]), color=INK, stroke_width=6), Line(v, v + 3.0 * np.array([np.cos(0.6), np.sin(0.6), 0]), color=INK, stroke_width=6))
        v2 = np.array([1.0, -0.4, 0])
        a2 = VGroup(Line(v2, v2 + np.array([1.3, 0, 0]), color=INK, stroke_width=6), Line(v2, v2 + 1.3 * np.array([np.cos(1.2), np.sin(1.2), 0]), color=INK, stroke_width=6))
        self.say("어느 각이 더 클까요?", "변이 긴 각과 변이 짧은 각. 어느 각이 더 클까요? 각의 크기는 변의 길이가 아니라 두 변이 벌어진 정도예요.")
        self.play(Create(a1), Create(a2), run_time=0.8)
        self.play(Create(Angle(a1[0], a1[1], radius=0.6, color=ORANGE, stroke_width=6)), Create(Angle(a2[0], a2[1], radius=0.5, color=GREEN, stroke_width=6)), run_time=0.5)
        t = M(f"더 많이 벌어진 {g('오른쪽')}이 더 커요", 46).move_to([0, -1.7, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.step("각도와 각도기", [(f"직각을 똑같이 90으로 나눈 하나: {o('1도 (1°)')}  → 직각 = 90°", 44, 1.5),
                  ("각도기: 중심을 꼭짓점에, 밑금을 한 변에 맞추고", 42, 0.5),
                  ("그 변이 0에서 시작하는 눈금을 읽어요", 42, -0.2),
                  (f"{g('예각')}: 0°~90° 사이 · {b('둔각')}: 90°~180° 사이", 42, -1.1)],
                  "1°와 각도기", "직각을 똑같이 90으로 나눈 하나를 1도라고 해요. 직각은 90도. 각도기의 중심을 꼭짓점에, 밑금을 한 변에 맞추고, 그 변이 0에서 시작하는 쪽 눈금을 읽어요.")
        self.section("이야기: 왜 360°일까?")
        c = Circle(radius=1.2, stroke_color=INK, stroke_width=5).move_to([-5.2, 0.6, 0])
        ticks = VGroup(*[Line(c.get_center() + 1.2 * np.array([np.cos(a), np.sin(a), 0]), c.get_center() + 1.05 * np.array([np.cos(a), np.sin(a), 0]), color=INK, stroke_width=3) for a in np.linspace(0, 2 * PI, 36, endpoint=False)])
        t1 = M(f"원을 {o('360°')}로 나누는 방법은\n60씩 묶어 세던 옛 {b('바빌로니아')} 천문학에서 와서\n그리스 학자 히파르코스가 이어받았어요", 34).move_to([1.2, 1.6, 0])
        t2 = M("왜 하필 360인지는 여러 설이 있어요\n(1년이 약 360일이라서? 나누기 쉬운 수라서?)\n정확히는 아직 몰라요", 32, SOFT).next_to(t1, DOWN, buff=0.45)
        self.say("바빌로니아에서 그리스로", "원을 360도로 나누는 방법은 60씩 묶어 세던 옛 바빌로니아의 천문학에서 와서, 그리스 학자 히파르코스가 이어받았어요. 왜 하필 360인지는 1년의 날수와 비슷해서라는 설, 나누기 쉬운 수라서라는 설이 있지만 정확히는 아직 몰라요.")
        self.play(Create(c), Create(ticks), FadeIn(t1), run_time=0.9)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("직각 2개를 합한 각은 몇 도? 한 바퀴는?", "몇 도일까요?", "연습해 볼까요? 직각 2개를 합한 각은 몇 도일까요? 한 바퀴는요?",
                 f"90° × 2 = {g('180°')} (일직선) · 한 바퀴 {g('360°')}", "180°, 360°", "직각 2개는 180도로 일직선이고, 한 바퀴는 360도예요.", qsize=52, asize=50)
        show_sources(self, ["· 360° 나눔의 기원: MacTutor 수학사 'Hipparchus'·'Babylonian numerals'",
                            "· 360인 까닭은 확실하지 않음: UNLV 천문학 자료 'Babylonian 360 degrees'"])
        self.closing(f"각의 크기는 {o('벌어진 정도')}, 직각 = {g('90°')}\n원 한 바퀴 360°는 바빌로니아 천문학에서 왔어요",
                     next_preview="개념 차근차근 82화 · 삼각형 세 각의 합 180°, 사각형 360°")
        self.wait(0.5)
