"""「수학 원리 돋보기」 4학년 20화 — 뒤집으면 무엇이 바뀔까? (4-1 4단원 3·4차시, 화 코드 4-1-4-b)

오른쪽(왼쪽)으로 뒤집으면 왼쪽과 오른쪽이, 위쪽(아래쪽)으로 뒤집으면 위쪽과 아래쪽이 서로 바뀜
방향만 바뀌고 모양은 그대로 / 같은 쪽으로 두 번 뒤집으면 처음 모양 / 도장(찍은 모양은 좌우가 바뀜)
최종: GRADE=4 ./make_final.sh 20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, RoundedRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from move import grid, shape_on


def flip(S, mob, axis_pt, horizontal=True, run_time=1.4):
    """horizontal=True: 세로 선을 기준으로 좌우 뒤집기, False: 가로 선 기준 위아래 뒤집기"""
    c = mob.get_center()
    if horizontal:
        target = mob.copy().stretch(-1, 0, about_point=np.array([axis_pt[0], c[1], 0]))
    else:
        target = mob.copy().stretch(-1, 1, about_point=np.array([c[0], axis_pt[1], 0]))
    S.play(mob.animate.become(target), run_time=run_time)


class G4Ep20(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 20
    EP_TITLE = "뒤집으면 무엇이 바뀔까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.lr()
        self.ud()
        self.twice()
        self.stamp()
        self.closing(f"오른쪽·왼쪽으로 뒤집으면 {o('왼쪽과 오른쪽')}이,\n위쪽·아래쪽으로 뒤집으면 {o('위쪽과 아래쪽')}이 바뀌어요 ({g('모양은 그대로')})",
                     next_preview="4학년 21화 · 돌리면 무엇이 바뀔까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("도형을 오른쪽으로 뒤집으면 어떤 모양이 될까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        gd = grid(14, 6, 0.6, [0, -0.5, 0])
        sh = shape_on(gd, 2, 1)
        self.say("뒤집으면 어떻게 될까요?", "도형을 오른쪽으로 뒤집으면 어떤 모양이 될까요? 미는 것과 무엇이 다를까요?")
        self.play(Write(q), FadeIn(gd), FadeIn(sh), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def lr(self):
        self.section("오른쪽으로 뒤집기")
        gd = grid(14, 6, 0.6, [0, -0.3, 0])
        sh = shape_on(gd, 3, 1)
        ax = DashedLine(gd.pt(7, -0.3), gd.pt(7, 6.3), color=ORANGE, stroke_width=5)
        self.say("가운데 선을 거울처럼", "가운데 점선을 거울이라고 생각하고 도형을 오른쪽으로 뒤집어 볼까요?")
        self.play(FadeIn(gd), FadeIn(sh), Create(ax), run_time=0.8)
        ghost = sh.copy().set_opacity(0.25)
        self.add(ghost)
        self.bring_to_front(sh)
        flip(self, sh, gd.pt(7, 0), horizontal=True)
        self.say(f"{o('왼쪽')}과 {o('오른쪽')}이 서로 바뀌었어요", "뒤집었더니 튀어나온 부분이 오른쪽에서 왼쪽으로 갔어요. 왼쪽과 오른쪽이 서로 바뀌었어요.")
        self.play(Indicate(sh, color=ORANGE, scale_factor=1.05), run_time=0.8)
        self.say(f"위쪽과 아래쪽은 {g('그대로')}", "주황 점은 여전히 위쪽에 있어요. 위쪽과 아래쪽은 그대로예요.")
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)

    def ud(self):
        self.section("아래쪽으로 뒤집기")
        gd = grid(14, 8, 0.5, [0, -0.2, 0])
        sh = shape_on(gd, 5, 4)
        ax = DashedLine(gd.pt(-0.3, 4), gd.pt(14.3, 4), color=ORANGE, stroke_width=5)
        self.say("이번에는 아래쪽으로", "이번에는 가로 점선을 기준으로 아래쪽으로 뒤집어 볼까요?")
        self.play(FadeIn(gd), FadeIn(sh), Create(ax), run_time=0.8)
        ghost = sh.copy().set_opacity(0.25)
        self.add(ghost)
        self.bring_to_front(sh)
        flip(self, sh, gd.pt(0, 4), horizontal=False)
        self.say(f"{o('위쪽')}과 {o('아래쪽')}이 서로 바뀌었어요", "주황 점이 아래쪽으로 갔어요. 위쪽과 아래쪽이 서로 바뀌었어요. 왼쪽과 오른쪽은 그대로예요.")
        self.play(Indicate(sh, color=ORANGE, scale_factor=1.05), run_time=0.8)
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)

    def twice(self):
        self.section("두 번 뒤집으면")
        gd = grid(14, 6, 0.6, [0, -0.3, 0])
        sh = shape_on(gd, 5, 1)
        self.say("같은 쪽으로 두 번 뒤집으면?", "같은 쪽으로 두 번 뒤집으면 어떻게 될까요?")
        self.play(FadeIn(gd), FadeIn(sh), run_time=0.6)
        c = sh.get_center()
        flip(self, sh, c, horizontal=True, run_time=1.0)
        self.wait(0.3)
        flip(self, sh, c, horizontal=True, run_time=1.0)
        self.say(f"{g('처음 모양')}으로 돌아와요", "두 번 뒤집으면 처음 모양으로 돌아와요. 뒤집기를 해도 모양 자체는 변하지 않아요.")
        self.play(Indicate(sh, color=GREEN, scale_factor=1.05), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def stamp(self):
        self.section("도장을 찍으면")
        body = RoundedRectangle(corner_radius=0.2, width=2.4, height=2.4, fill_color="#F3EEE4", fill_opacity=1,
                                stroke_color=INK, stroke_width=4).move_to([-3.2, 0.3, 0])
        face = T("가", 120, "#C0392B").move_to(body)
        lab1 = T("도장에 새긴 글자", 34, SOFT).next_to(body, DOWN, buff=0.25)
        self.say("도장에 '가'를 새기면?", "도장에 새긴 글자를 종이에 찍으면 어떻게 될까요?")
        self.play(FadeIn(body), FadeIn(face), FadeIn(lab1), run_time=0.7)
        paper = RoundedRectangle(corner_radius=0.1, width=2.4, height=2.4, fill_color="#FFFFFF", fill_opacity=1,
                                 stroke_color=SOFT, stroke_width=3).move_to([3.2, 0.3, 0])
        print_ = face.copy().move_to(paper).stretch(-1, 0)
        lab2 = T("종이에 찍힌 모양", 34, SOFT).next_to(paper, DOWN, buff=0.25)
        self.play(FadeIn(paper), FadeIn(lab2), run_time=0.5)
        self.play(FadeIn(print_, scale=1.2), run_time=0.8)
        self.say(f"찍힌 모양은 {o('왼쪽과 오른쪽')}이 바뀌어요", "찍힌 모양은 왼쪽과 오른쪽이 바뀌어 있어요. 그래서 도장에는 글자를 뒤집어서 새겨요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
