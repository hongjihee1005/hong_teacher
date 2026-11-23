"""「수학 원리 돋보기」 개념 차근차근 100화 — 1 cm와 1 m, 미터의 탄생

1 cm(일 센티미터) 자로 재기(0에 맞추기) / 100 cm = 1 m / 1 m 20 cm = 120 cm / 어림하기
이야기: 1791년 프랑스, 북극~적도 자오선의 1천만분의 1, 들랑브르·메샹 측량(1792~1798), 1875년 미터 협약, 지금은 빛으로 정의(1983)
우리나라: 1959년 미터 협약 가입, 1964년부터 미터법 전면 사용 / 출처
최종: GRADE=c ./make_final.sh 100
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
from manim import Rectangle, Square, Circle, Dot, Arrow, PI


class GcEp100(ConceptScene):
    EP_NO = 100
    EP_TITLE = "1 cm와 1 m, 미터의 탄생"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("1 cm와 자")
        ruler = Rectangle(width=10.0, height=0.8, fill_color="#F6E7B0", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, 1.2, 0])
        ticks = VGroup(*[Line([-5 + k, 1.6, 0], [-5 + k, 1.25, 0], color=INK, stroke_width=3) for k in range(11)])
        nums = VGroup(*[T(str(k), 26).move_to([-5 + k, 1.0, 0]) for k in range(11)])
        pen = Rectangle(width=6.0, height=0.25, fill_color=BLUE, fill_opacity=1, stroke_width=0).move_to([-2.0, 2.0, 0])
        self.say("자의 0에 맞추어 재요", "자의 큰 눈금 한 칸이 1센티미터예요. 연필의 한쪽 끝을 자의 0에 맞추면 다른 쪽 끝이 가리키는 수가 길이예요.")
        self.play(FadeIn(ruler), FadeIn(ticks), FadeIn(nums), run_time=0.6)
        self.play(FadeIn(pen), run_time=0.4)
        t = M(f"연필의 길이 = {g('6 cm')} (6 센티미터)", 46).move_to([0, -0.2, 0])
        self.play(FadeIn(t), run_time=0.4)
        t2 = M(f"100 cm = {o('1 m')} (1 미터) · 1 m 20 cm = {o('120 cm')}", 44).move_to([0, -1.2, 0])
        self.say(f"100 cm = {o('1 m')}", "1센티미터가 100개 모이면 1미터예요. 1미터 20센티미터는 120센티미터.")
        self.play(FadeIn(t2), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("이야기: 미터의 탄생", [(f"{o('1791년')} 프랑스: 북극에서 적도까지 거리의 {g('1천만분의 1')}을 1 m로", 40, 1.7),
                  ("천문학자 들랑브르와 메샹이 1792~1798년 프랑스~스페인 땅을 직접 측량했어요", 34, 0.9),
                  (f"{o('1875년')} 17개 나라가 미터 협약 → 세계가 함께 쓰는 단위", 40, 0.1),
                  ("지금은 빛이 아주 짧은 시간 동안 가는 거리로 1 m를 정해요 (1983년)", 36, -0.7),
                  (f"우리나라: 1959년 미터 협약 가입, {g('1964년')}부터 미터법을 전면 사용", 38, -1.5)],
                  "누구나 함께 쓰는 1 m", "약 230년 전 프랑스는 북극에서 적도까지 거리의 1천만분의 1을 1미터로 정하고, 천문학자들이 6년 넘게 땅을 측량했어요. 1875년에는 여러 나라가 미터 협약을 맺었고, 우리나라는 1964년부터 미터법을 전면적으로 쓰고 있어요.", hold=2.0)
        show_sources(self, ["· 미터의 역사·정의: 국제도량형국(BIPM) 'History of the metre', 제17차 국제도량형총회(1983) 결의 1",
                            "· 우리나라 미터법: 국가기록원 '우리나라의 기록: 미터법', 국가기술표준원"])
        self.closing(f"1 cm가 100개면 {o('1 m')}\n1 m는 1791년 프랑스에서 지구 크기를 바탕으로 정했어요",
                     next_preview="개념 차근차근 101화 · 1 mm와 1 km")
        self.wait(0.5)
