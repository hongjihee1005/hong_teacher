"""「수학 원리 돋보기」 6학년 30화 — 1 m³ (6-1 6단원 5~6차시, 화 코드 6-1-6-c)

큰 부피를 cm³로 나타내면 수가 너무 커서 불편 → 한 모서리 1 m인 정육면체의 부피 = 1 m³ (1 세제곱미터)
1 m = 100 cm → 1 m³ 안에 1 cm³ 쌓기나무가 100 × 100 × 100 = 1000000개 → 1 m³ = 1000000 cm³
최종: GRADE=6 ./make_final.sh 30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cubes import P, box_cells, stack
from cuboid import Cuboid


class G6Ep30(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 30
    EP_TITLE = "1 m³"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unit()
        self.million()
        self.closing(f"한 모서리가 1 m인 정육면체의 부피가 {o('1 m³')} (1 세제곱미터)\n1 m³ = 100 × 100 × 100 cm³ = {g('1000000 cm³')}",
                     next_preview="6학년 31화 · 직육면체의 겉넓이")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("교실 크기만 한 상자의 부피를 cm³로 나타내면\n어떤 불편함이 있을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("cm³로 나타내면?", "교실처럼 아주 큰 공간의 부피를 cm³로 나타내면 어떤 불편함이 있을까요?")
        self.play(Write(q), run_time=1.0)
        e = M("가로 800 cm, 세로 600 cm, 높이 300 cm\n→ 144000000 cm³", 38, SOFT).move_to([0, -0.4, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def unit(self):
        self.section("1 m³")
        cb = Cuboid(2.4, 2.4, 2.4 * 2, (-3.6, 0.5, 0))
        faces = VGroup(cb.face("front", "#F2C14E", 0.55), cb.face("top", "#F2C14E", 0.75), cb.face("right", "#F2C14E", 0.4))
        self.play(FadeIn(faces), Create(cb.edges(show_hidden=False)), run_time=0.8)
        br = Brace(Line(cb.v[0], cb.v[1]), DOWN, color=INK)
        bt = T("1 m", 30).next_to(br, DOWN, buff=0.08)
        br2 = Brace(Line(cb.v[0], cb.v[3]), LEFT, color=INK)
        bt2 = T("1 m", 30).next_to(br2, LEFT, buff=0.08)
        self.play(FadeIn(br), FadeIn(bt), FadeIn(br2), FadeIn(bt2), run_time=0.5)
        d = M(f"한 모서리가 1 m인\n정육면체의 부피 = {o('1 m³')}", 38).move_to([2.8, 0.9, 0])
        r = M("1 세제곱미터라고 읽어요", 30, SOFT).move_to([2.8, -0.2, 0])
        self.say(f"큰 부피의 단위 {o('1 m³')}", "그래서 큰 부피는 한 모서리의 길이가 1 m인 정육면체의 부피를 단위로 써요. 1 m³라 쓰고 1 세제곱미터라고 읽어요.")
        self.play(FadeIn(d), run_time=0.6)
        self.play(FadeIn(r), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def million(self):
        self.section("1 m³는 몇 cm³?")
        s = 0.22
        row = stack(box_cells(10, 1, 1), s=s, center=(-3.4, 1.4, 0))
        lay = stack(box_cells(10, 1, 10), s=s, center=(-3.4, 0.2, 0), color="#7C9CC9")
        t1 = M(f"한 줄: {o('100개')}", 34).move_to([2.6, 1.8, 0])
        self.say(f"1 m = 100 cm, 한 줄에 {o('100개')}", "1 m는 100 cm예요. 1 m³ 상자의 한 모서리를 따라 1 cm³ 쌓기나무가 100개 놓여요. 그림은 10개만 그렸어요.")
        self.play(FadeIn(row), FadeIn(t1), run_time=0.7)
        t2 = M(f"한 층: 100 × 100 = {b('10000개')}", 34).move_to([2.6, 0.9, 0])
        self.say(f"한 층에 100 × 100 = {b('10000개')}", "그런 줄이 100줄이면 한 층에 100 곱하기 100, 10000개예요.")
        self.play(FadeOut(row), FadeIn(lay), FadeIn(t2), run_time=0.8)
        t3 = M(f"100층: 10000 × 100 = {g('1000000개')}", 34).move_to([2.6, 0.0, 0])
        self.say(f"100층이면 {g('1000000개')}", "그 층을 100층 쌓으면 100 곱하기 100 곱하기 100, 1000000개예요.")
        self.play(FadeIn(t3), run_time=0.6)
        r = M(f"1 m³ = {g('1000000 cm³')}", 52).move_to([0, -1.5, 0])
        self.say(f"1 m³ = {g('1000000 cm³')}", "그래서 1 m³는 1000000 cm³예요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
