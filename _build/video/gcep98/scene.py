"""「수학 원리 돋보기」 개념 차근차근 98화 — 비교하기: 길다·무겁다·넓다·많다

길이: 한쪽 끝을 맞추어 대어 봄(길다·짧다) / 무게: 손으로 들기·시소(무겁다·가볍다) / 넓이: 겹쳐 보기(넓다·좁다) / 들이: 옮겨 담기(많다·적다) / 연습
최종: GRADE=c ./make_final.sh 98
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
from manim import Rectangle, Square, Circle, Polygon, Dot, PI
from cuboid import Cuboid
from round3d import cylinder, cone, sphere
from cubes import stack, heights_cells


class GcEp98(ConceptScene):
    EP_NO = 98
    EP_TITLE = "비교하기: 길다·무겁다·넓다·많다"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("길이 비교")
        a = Rectangle(width=4.6, height=0.35, fill_color=ORANGE, fill_opacity=1, stroke_width=0).move_to([-0.7, 1.4, 0])
        c = Rectangle(width=3.2, height=0.35, fill_color=BLUE, fill_opacity=1, stroke_width=0)
        c.move_to([0, 0.8, 0]).align_to(a, LEFT)
        base = Line([a.get_left()[0], 2.0, 0], [a.get_left()[0], 0.4, 0], color=SOFT, stroke_width=4)
        self.say("한쪽 끝을 맞추어 대어 봐요", "길이를 비교할 때는 한쪽 끝을 똑같이 맞추고 다른 쪽 끝을 봐요. 주황 막대가 더 길고, 파랑 막대가 더 짧아요.")
        self.play(FadeIn(a), FadeIn(c), Create(base), run_time=0.7)
        t = M(f"주황이 더 {o('길다')} · 파랑이 더 {b('짧다')}", 44).move_to([0, -0.3, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.step("무게·넓이·들이", [(f"무게: 들어 보거나 시소에 올려요 → {o('무겁다')} · {b('가볍다')}", 42, 1.5),
                  (f"넓이: 겹쳐 보아 남는 쪽이 → {o('넓다')} · {b('좁다')}", 42, 0.5),
                  (f"담을 수 있는 양: 옮겨 담아 넘치면 → {o('많다')} · {b('적다')}", 42, -0.5)],
                  "무엇을 비교하느냐에 따라 다른 말", "무게는 무겁다와 가볍다, 넓이는 넓다와 좁다, 담을 수 있는 양은 많다와 적다로 말해요. 시소는 무거운 쪽이 내려가고, 넓이는 겹쳐 보고, 들이는 옮겨 담아 비교해요.")
        self.ask("시소에서 형 쪽이 내려갔어요. 누가 더 무거울까요?", "누가 더 무거울까?", "연습해 볼까요? 시소에서 형 쪽이 아래로 내려갔어요. 누가 더 무거울까요?",
                 f"{g('형')}이 더 무거워요", "형", "무거운 쪽이 아래로 내려가니 형이 더 무거워요.", qsize=46)
        self.closing(f"길이 {o('길다·짧다')} · 무게 {o('무겁다·가볍다')}\n넓이 {b('넓다·좁다')} · 들이 {b('많다·적다')}",
                     next_preview="개념 차근차근 99화 · 왜 같은 단위가 필요할까?")
        self.wait(0.5)
