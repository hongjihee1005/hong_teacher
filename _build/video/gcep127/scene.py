"""「수학 원리 돋보기」 개념 차근차근 127화 — 그래프 고르고 읽기

목적에 맞는 그래프: 많고 적음 비교 → 막대, 시간에 따른 변화 → 꺾은선, 전체에 대한 비율 → 띠·원, 큰 수를 그림으로 → 그림그래프
그래프 읽을 때 주의: 눈금 한 칸의 크기, 물결선, 전체가 다르면 같은 %도 양이 다름 / 연습 / 시리즈 마무리
최종: GRADE=c ./make_final.sh 127
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
from conceptkit import poly, bar_chart
from manim import Rectangle, Square, Circle, Dot, DashedLine, PI, Sector, VMobject, GrowFromEdge
from fraction import frac_bar


class GcEp127(ConceptScene):
    EP_NO = 127
    EP_TITLE = "그래프 고르고 읽기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.step("무엇을 보여 주고 싶나요?", [(f"많고 적음을 비교 → {b('막대그래프')}", 46, 1.8),
                  (f"시간에 따른 변화 → {o('꺾은선그래프')}", 46, 0.9),
                  (f"전체에 대한 비율 → {g('띠그래프 · 원그래프')}", 46, 0.0),
                  ("큰 수를 그림으로 한눈에 → 그림그래프", 46, -0.9)],
                  "목적에 맞는 그래프", "그래프는 보여 주고 싶은 것에 따라 골라요. 많고 적음은 막대그래프, 시간에 따른 변화는 꺾은선그래프, 전체에 대한 비율은 띠그래프와 원그래프, 큰 수는 그림그래프가 알맞아요.", hold=1.6)
        self.step("읽을 때 조심해요", [(f"① 눈금 {o('한 칸')}이 얼마인지 먼저 봐요", 44, 1.4),
                  (f"② {o('물결선')}이 있으면 아래가 줄여져 있어요 (차이가 커 보여요)", 40, 0.5),
                  (f"③ 전체가 다르면 같은 {o('30 %')}라도 실제 양이 달라요", 42, -0.4)],
                  "그래프를 바르게 읽기", "그래프를 읽을 때는 눈금 한 칸의 크기를 먼저 보고, 물결선이 있는지 확인해요. 또 전체의 수가 다르면 같은 30퍼센트라도 실제 양은 달라요.", hold=1.6)
        self.ask("한 달 동안 매일 잰 강낭콩 키에 알맞은 그래프는?", "어떤 그래프?", "연습해 볼까요? 한 달 동안 매일 잰 강낭콩의 키를 나타내기 알맞은 그래프는 무엇일까요?",
                 f"{o('꺾은선그래프')} (시간에 따른 변화)", "꺾은선그래프", "날마다 변하는 키를 보여 주니 꺾은선그래프가 알맞아요.", qsize=50)
        self.closing(f"보여 주고 싶은 것에 맞는 그래프를 골라요\n「개념 차근차근」 127편, {g('끝까지 함께해 줘서 고마워요!')}",
                     next_preview="자연수 이야기 · 분수 특별편 · 나눗셈 차근차근도 함께 보아요")
        self.wait(0.5)
