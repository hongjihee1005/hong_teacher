"""「수학 원리 돋보기」 개념 차근차근 74화 — 여러 가지 모양: 상자·둥근기둥·공

생활 물건 분류: 상자 모양(평평한 면, 뾰족한 곳, 쌓을 수 있음) / 둥근기둥 모양(눕히면 굴러감, 세우면 쌓임) / 공 모양(어느 쪽으로나 굴러감)
연습: 주사위·통조림·구슬
최종: GRADE=c ./make_final.sh 74
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
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, Ellipse, RoundedRectangle, ORIGIN, PI


def box3d(w=1.4, h=1.0, d=0.5, color=ORANGE):
    front = Rectangle(width=w, height=h, fill_color=color, fill_opacity=0.9, stroke_color=INK, stroke_width=4)
    top = poly([(-w / 2, h / 2), (w / 2, h / 2), (w / 2 + d, h / 2 + d * 0.6), (-w / 2 + d, h / 2 + d * 0.6)], color, 0.6, 4)
    side = poly([(w / 2, h / 2), (w / 2, -h / 2), (w / 2 + d, -h / 2 + d * 0.6), (w / 2 + d, h / 2 + d * 0.6)], color, 0.45, 4)
    return VGroup(side, top, front)


def cyl(w=1.0, h=1.4, color=BLUE):
    body = Rectangle(width=w, height=h, fill_color=color, fill_opacity=0.75, stroke_width=0)
    top = Ellipse(width=w, height=w * 0.35, fill_color=color, fill_opacity=0.5, stroke_color=INK, stroke_width=4).move_to(body.get_top())
    bot = Ellipse(width=w, height=w * 0.35, stroke_color=INK, stroke_width=4).move_to(body.get_bottom())
    ls = VGroup(Line(body.get_corner(UP + LEFT), body.get_corner(DOWN + LEFT), color=INK, stroke_width=4),
                Line(body.get_corner(UP + RIGHT), body.get_corner(DOWN + RIGHT), color=INK, stroke_width=4))
    return VGroup(body, bot, ls, top)


def ball(r=0.6, color=GREEN):
    return VGroup(Circle(radius=r, fill_color=color, fill_opacity=0.85, stroke_color=INK, stroke_width=4),
                  Circle(radius=r * 0.2, fill_color="#FFFFFF", fill_opacity=0.7, stroke_width=0).move_to([-r * 0.35, r * 0.35, 0]))


class GcEp74(ConceptScene):
    EP_NO = 74
    EP_TITLE = "여러 가지 모양: 상자·둥근기둥·공"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("세 가지 모양")
        shapes = VGroup(box3d(), cyl(), ball()).scale(1.3).arrange(RIGHT, buff=3.0).move_to([0, 1.4, 0])
        names = VGroup(*[M(x, 40, c) for x, c in [("상자 모양", ORANGE), ("둥근기둥 모양", BLUE), ("공 모양", GREEN)]])
        for n_, s_ in zip(names, shapes):
            n_.next_to(s_, DOWN, buff=0.4)
        self.say("물건을 모양에 따라 나누면", "우리 주변의 물건을 모양에 따라 나누면 상자 모양, 둥근기둥 모양, 공 모양이 있어요.")
        self.play(LaggedStart(*[FadeIn(VGroup(s_, n_)) for s_, n_ in zip(shapes, names)], lag_ratio=0.3), run_time=1.4)
        self.wait(1.0)
        feats = VGroup(M("평평한 면·뾰족한 곳\n잘 쌓여요", 34), M("눕히면 굴러가요\n세우면 쌓여요", 34), M("어느 쪽으로나\n잘 굴러가요", 34))
        for f_, n_ in zip(feats, names):
            f_.next_to(n_, DOWN, buff=0.3)
        self.say("쌓아 보고, 굴려 보면", "상자 모양은 평평한 면과 뾰족한 곳이 있어 잘 쌓여요. 둥근기둥 모양은 눕히면 굴러가고 세우면 쌓여요. 공 모양은 어느 쪽으로나 잘 굴러가요.")
        self.play(FadeIn(feats, lag_ratio=0.3), run_time=1.0)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("주사위 · 통조림 · 구슬은 어떤 모양?", "어떤 모양일까요?", "연습해 볼까요? 주사위, 통조림, 구슬은 각각 어떤 모양일까요?",
                 f"주사위 {o('상자')} · 통조림 {b('둥근기둥')} · 구슬 {g('공')}", "상자, 둥근기둥, 공", "주사위는 상자 모양, 통조림은 둥근기둥 모양, 구슬은 공 모양이에요.", qsize=56, asize=50)
        self.closing(f"{o('상자 모양')} · {b('둥근기둥 모양')} · {g('공 모양')}\n쌓고 굴려 보면 특징을 알 수 있어요",
                     next_preview="개념 차근차근 75화 · □, △, ○ 모양")
        self.wait(0.5)
