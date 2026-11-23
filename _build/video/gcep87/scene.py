"""「수학 원리 돋보기」 개념 차근차근 87화 — 밀기·뒤집기·돌리기

밀기: 모양은 그대로, 위치만 / 뒤집기: 왼쪽·오른쪽(좌우가 바뀜), 위·아래 / 돌리기: 시계 방향 90°·180° / 연습: 오른쪽으로 두 번 뒤집으면?
최종: GRADE=c ./make_final.sh 87
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
from conceptkit import poly, regular, right_mark
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, DashedLine, Rotate, PI


def flag():
    return VGroup(poly([(0, 0), (0, 1.4), (0.9, 1.1), (0.2, 0.8), (0.2, 0)], ORANGE, 0.8))


class GcEp87(ConceptScene):
    EP_NO = 87
    EP_TITLE = "밀기·뒤집기·돌리기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("밀기")
        f = flag().move_to([-4.0, 0.6, 0])
        self.say("밀면 모양은 그대로", "도형을 오른쪽으로 밀면 위치만 바뀌고 모양은 그대로예요.")
        self.play(FadeIn(f), run_time=0.4)
        g2 = f.copy()
        self.play(g2.animate.shift(RIGHT * 4.0), run_time=1.0)
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.5)
        self.section("뒤집기")
        f = flag().move_to([-3.0, 0.6, 0])
        axis = DashedLine([-1.6, -1.2, 0], [-1.6, 2.4, 0], color=SOFT)
        self.say("오른쪽으로 뒤집으면 좌우가 바뀌어요", "도형을 오른쪽으로 뒤집으면 왼쪽과 오른쪽이 서로 바뀌어요. 위쪽으로 뒤집으면 위와 아래가 바뀌어요.")
        self.play(FadeIn(f), Create(axis), run_time=0.5)
        g2 = f.copy()
        self.play(g2.animate.flip(UP).move_to([-0.2, 0.6, 0]), run_time=1.0)
        g3 = f.copy()
        self.play(g3.animate.flip(RIGHT).move_to([3.4, 0.6, 0]), run_time=1.0)
        t = VGroup(M("오른쪽으로 뒤집기", 32).next_to(g2, DOWN, buff=0.3), M("위쪽으로 뒤집기", 32).next_to(g3, DOWN, buff=0.3))
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.section("돌리기")
        f = flag().move_to([-3.6, 0.4, 0])
        self.say("시계 방향으로 90°, 180°", "도형을 시계 방향으로 90도 돌리면 위쪽이 오른쪽으로 가요. 180도 돌리면 위아래가 거꾸로 돼요.")
        self.play(FadeIn(f), run_time=0.4)
        g2 = f.copy()
        self.play(Rotate(g2, -PI / 2), run_time=0.8)
        self.play(g2.animate.move_to([0, 0.4, 0]), run_time=0.4)
        g3 = f.copy()
        self.play(Rotate(g3, -PI), run_time=0.8)
        self.play(g3.animate.move_to([3.6, 0.4, 0]), run_time=0.4)
        t = VGroup(M("90°", 36).next_to(g2, DOWN, buff=0.3), M("180°", 36).next_to(g3, DOWN, buff=0.3))
        self.play(FadeIn(t), run_time=0.3)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("오른쪽으로 두 번 뒤집으면?", "두 번 뒤집으면?", "연습해 볼까요? 도형을 오른쪽으로 두 번 뒤집으면 어떻게 될까요?",
                 f"{g('처음 모양')}과 같아져요", "처음과 같아요", "한 번 뒤집으면 좌우가 바뀌고, 한 번 더 뒤집으면 다시 처음 모양이 돼요.", qsize=60)
        self.closing(f"{b('밀기')}: 위치만 · {o('뒤집기')}: 좌우나 위아래가 바뀜\n{g('돌리기')}: 90°, 180° … 돌린 만큼 방향이 바뀜",
                     next_preview="개념 차근차근 88화 · 합동")
        self.wait(0.5)
