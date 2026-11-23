"""「수학 원리 돋보기」 개념 차근차근 99화 — 왜 같은 단위가 필요할까?

책상 길이를 뼘으로 재면 사람마다 다름(동생 8뼘, 선생님 5뼘) → 모두가 같은 단위 필요
이야기: 옛날에는 몸으로 잼 — 큐빗(팔꿈치~손끝), 뼘, 발 / 우리나라 '자'(10치 = 1자, 『경국대전』), 시대마다 길이가 달랐음(주척 약 20.6 cm, 영조척 약 30.8 cm) / 출처
최종: GRADE=c ./make_final.sh 99
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


class GcEp99(ConceptScene):
    EP_NO = 99
    EP_TITLE = "왜 같은 단위가 필요할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("뼘으로 재면")
        desk = Rectangle(width=8.0, height=0.4, fill_color="#C98B4B", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, 1.6, 0])
        self.say("책상 길이를 뼘으로 재면", "책상의 길이를 뼘으로 재 볼까요? 동생은 8뼘, 선생님은 5뼘이라고 했어요. 같은 책상인데 왜 다를까요?")
        self.play(FadeIn(desk), run_time=0.4)
        s1 = VGroup(*[Line([-4 + k * 1.0, 1.1, 0], [-3 + k * 1.0, 1.1, 0], color=ORANGE, stroke_width=8) for k in range(8)]).set_stroke(width=8)
        s2 = VGroup(*[Line([-4 + k * 1.6, 0.5, 0], [-2.4 + k * 1.6, 0.5, 0], color=BLUE, stroke_width=8) for k in range(5)])
        self.play(LaggedStart(*[Create(x) for x in s1], lag_ratio=0.15), run_time=1.0)
        self.play(LaggedStart(*[Create(x) for x in s2], lag_ratio=0.15), run_time=0.8)
        t = M(f"동생 {o('8뼘')} · 선생님 {b('5뼘')} → 사람마다 뼘의 길이가 달라요", 42).move_to([0, -0.6, 0])
        t2 = M(f"그래서 누구에게나 똑같은 {g('단위')}가 필요해요", 46).move_to([0, -1.5, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.say(f"누구에게나 같은 {g('단위')}", "사람마다 뼘의 길이가 달라서 잰 결과가 달라요. 그래서 누가 재도 같은 결과가 나오는 단위가 필요해요.")
        self.play(FadeIn(t2), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("이야기: 몸으로 잰 옛 단위", [(f"{o('큐빗')}: 팔꿈치에서 손끝까지 (옛 이집트 등)", 44, 1.6),
                  (f"{b('뼘')}·{b('발')}: 손을 편 길이, 발 길이", 44, 0.7),
                  (f"우리나라 {g('자')}: 10치 = 1자 (『경국대전』)", 44, -0.2),
                  ("그런데 '한 자'의 길이도 시대와 쓰임마다 달랐어요 (약 20 cm ~ 31 cm)", 36, -1.1)],
                  "옛날에는 몸으로 쟀어요", "옛날 사람들은 팔꿈치에서 손끝까지인 큐빗, 뼘, 발 길이로 쟀어요. 우리나라는 자와 치를 썼는데, 한 자의 길이도 시대와 쓰임마다 달랐대요.")
        show_sources(self, ["· 큐빗: 브리태니커 'cubit'",
                            "· 우리나라의 자(척)·치: 한국민족문화대백과사전 '표준척'·'주척'·'영조척'"])
        self.closing(f"뼘·발처럼 몸으로 재면 {o('사람마다')} 달라요\n누구에게나 같은 {g('단위')}가 필요해요 → cm, m",
                     next_preview="개념 차근차근 100화 · 1 cm와 1 m, 미터의 탄생")
        self.wait(0.5)
