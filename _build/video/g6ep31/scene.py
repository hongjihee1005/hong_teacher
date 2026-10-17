"""「수학 원리 돋보기」 6학년 31화 — 직육면체의 겉넓이 (6-1 6단원 7~8차시, 화 코드 6-1-6-d)

입체도형의 겉면의 넓이 = 겉넓이
(직육면체의 겉넓이) = (여섯 면의 넓이의 합) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2 = (한 밑면의 넓이) × 2 + (옆면의 넓이)
옆면을 하나의 직사각형으로 보면 가로는 밑면의 둘레, 세로는 높이 / (정육면체의 겉넓이) = (한 면의 넓이) × 6
(예시: 가로 5 cm, 세로 3 cm, 높이 4 cm → 15·20·12, 47 × 2 = 94 cm² — 이 영상에서 정한 크기)
최종: GRADE=6 ./make_final.sh 31
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Polygon, Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cuboid import Cuboid

YEL = "#F2C14E"
U = 0.36   # 1 cm


def rect(x0, y0, w, h, color, op=0.55):
    return Polygon([x0, y0, 0], [x0 + w * U, y0, 0], [x0 + w * U, y0 + h * U, 0], [x0, y0 + h * U, 0],
                   fill_color=color, fill_opacity=op, stroke_color=INK, stroke_width=3)


class G6Ep31(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 31
    EP_TITLE = "직육면체의 겉넓이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.net()
        self.three()
        self.side()
        self.closing(f"(직육면체의 겉넓이) = (세 면의 넓이의 합) × {o('2')}\n= (한 밑면의 넓이) × 2 + ({b('밑면의 둘레')}) × ({g('높이')})",
                     next_preview="6학년 32화 · 부피가 같아도 겉넓이는 다를까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가로 5 cm, 세로 3 cm, 높이 4 cm인 상자를\n포장지로 겹치지 않게 싸려면 몇 cm²가 필요할까요?", 40).move_to([0.6, 1.8, 0])
        self.say("포장지는 몇 cm²?", "가로 5 cm, 세로 3 cm, 높이 4 cm인 상자를 포장지로 겹치지 않게 싸려면 포장지가 몇 cm² 필요할까요?")
        self.play(Write(q), run_time=1.0)
        cb = Cuboid(5 * 0.4, 4 * 0.4, 3 * 0.4 * 2, (0, -0.6, 0))
        self.play(FadeIn(cb.face("front", YEL, 0.5)), FadeIn(cb.face("top", ORANGE, 0.5)), FadeIn(cb.face("right", BLUE, 0.45)), Create(cb.edges(show_hidden=False)), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def layout(self, x0=-5.2, y0=-1.7):
        """전개도: 옆면 띠(앞 5, 오른 3, 뒤 5, 왼 3) 높이 4, 위·아래 밑면(5×3)은 앞면 위아래"""
        xs = [x0, x0 + 5 * U, x0 + 8 * U, x0 + 13 * U]
        ws = [5, 3, 5, 3]
        cols = [YEL, BLUE, YEL, BLUE]
        sides = VGroup(*[rect(x, y0 + 3 * U, w, 4, c) for x, w, c in zip(xs, ws, cols)])
        top = rect(x0, y0 + 7 * U, 5, 3, ORANGE)
        bot = rect(x0, y0, 5, 3, ORANGE)
        return sides, top, bot

    def net(self):
        self.section("펼쳐 보기")
        sides, top, bot = self.layout()
        self.say("상자를 펼치면 여섯 면", "상자를 펼치면 직사각형 여섯 개가 나와요. 입체도형의 겉면의 넓이를 겉넓이라고 해요.")
        self.play(LaggedStart(FadeIn(bot), *[FadeIn(s) for s in sides], FadeIn(top), lag_ratio=0.2, run_time=1.4))
        labs = VGroup(M("15", 30).move_to(top), M("15", 30).move_to(bot), M("20", 30).move_to(sides[0]), M("12", 30).move_to(sides[1]),
                      M("20", 30).move_to(sides[2]), M("12", 30).move_to(sides[3]))
        self.say("마주 보는 면끼리 넓이가 같아요", "마주 보는 면은 모양과 크기가 같아요. 5 곱하기 3은 15, 5 곱하기 4는 20, 3 곱하기 4는 12가 두 개씩 있어요.")
        self.play(FadeIn(labs), run_time=0.6)
        e = M(f"15 + 15 + 20 + 20 + 12 + 12 = {g('94')} (cm²)", 36).move_to([2.6, 2.0, 0])
        self.say(f"여섯 면을 모두 더하면 {g('94 cm²')}", "여섯 면의 넓이를 모두 더하면 94 cm²예요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)

    def three(self):
        self.section("세 면 × 2")
        cb = Cuboid(5 * 0.5, 4 * 0.5, 3 * 0.5 * 2, (-3.4, 0.2, 0))
        f = VGroup(cb.face("front", YEL, 0.6), cb.face("top", ORANGE, 0.6), cb.face("right", BLUE, 0.55))
        self.play(FadeIn(f), Create(cb.edges(show_hidden=False)), run_time=0.7)
        self.say("한 꼭짓점에서 만나는 세 면", "한 꼭짓점에서 만나는 세 면은 서로 다른 면이에요. 나머지 세 면은 이 세 면과 똑같아요.")
        self.play(Indicate(f, scale_factor=1.05), run_time=0.8)
        e = M(f"(15 + 20 + 12) × {o('2')} = 47 × 2 = {g('94')}", 40).move_to([2.6, 0.6, 0])
        self.say(f"(세 면의 합) × {o('2')}", "그래서 세 면의 넓이를 더해 2를 곱해도 돼요. 15 더하기 20 더하기 12는 47, 곱하기 2는 94예요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def side(self):
        self.section("밑면 × 2 + 옆면")
        sides, _, _ = self.layout(-5.6, -0.6)
        b1 = rect(1.0, 0.6, 5, 3, ORANGE)
        b2 = rect(3.2, 0.6, 5, 3, ORANGE)
        bl = M(f"밑면 2개: 15 × 2", 28).next_to(VGroup(b1, b2), UP, buff=0.15)
        self.play(FadeIn(sides), FadeIn(b1), FadeIn(b2), FadeIn(bl), run_time=0.5)
        band = Rectangle(width=16 * U, height=4 * U, stroke_color=GREEN, stroke_width=7, fill_opacity=0).move_to(sides)
        br = Brace(band, DOWN, color=BLUE)
        bt = M(f"밑면의 둘레 5 + 3 + 5 + 3 = {b('16')}", 28).next_to(br, DOWN, buff=0.05)
        self.say(f"옆면은 하나의 직사각형: 가로는 {b('밑면의 둘레')}", "옆면 네 개를 이어 하나의 직사각형으로 보면 가로는 밑면의 둘레 16 cm, 세로는 높이 4 cm예요.")
        self.play(Create(band), run_time=0.6)
        self.play(FadeIn(br), FadeIn(bt), run_time=0.5)
        e = M(f"15 × 2 + {b('16')} × {g('4')} = 30 + 64 = {g('94')} (cm²)", 38).move_to([0, -1.25, 0])
        self.say(f"15 × 2 + 16 × 4 = {g('94')}", "그래서 한 밑면의 넓이 곱하기 2에 옆면의 넓이 16 곱하기 4를 더해도 94 cm²예요.")
        self.play(FadeIn(e), run_time=0.6)
        c = M(f"정육면체: (한 면의 넓이) × {o('6')}", 30).move_to([3.0, -0.35, 0])
        self.say(f"정육면체는 한 면 × {o('6')}", "정육면체는 여섯 면이 모두 같으니 한 면의 넓이에 6을 곱해요.")
        self.play(FadeIn(c), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
