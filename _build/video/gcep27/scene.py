"""「수학 원리 돋보기」 개념 차근차근 27화 — (두·세 자리 수) × (두 자리 수)

24 × 13 = 24 × 3 + 24 × 10 (직사각형 넓이 그림으로 나누기) → 세로셈 두 줄(mul2.VertMul) / 어림으로 확인
연습: 32 × 21 = 672
최종: GRADE=c ./make_final.sh 27
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
from manim import Rectangle
from mul2 import VertMul


class GcEp27(ConceptScene):
    EP_NO = 27
    EP_TITLE = "(두·세 자리 수) × (두 자리 수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.area()
        self.vertical()
        self.practice()
        self.closing(f"곱하는 수를 {o('일의 자리')}와 {b('십의 자리')}로 나누어 곱하고 더해요\n24 × 13 = {o('72')} + {b('240')} = {g('312')}",
                     next_preview="개념 차근차근 28화 · 옛날 사람들의 곱셈법")
        self.wait(0.5)

    def area(self):
        self.section("나누어 곱하기")
        u = 0.16
        r1 = Rectangle(width=24 * u, height=10 * u, fill_color=BLUE, fill_opacity=0.35, stroke_color=INK, stroke_width=3)
        r2 = Rectangle(width=24 * u, height=3 * u, fill_color=ORANGE, fill_opacity=0.45, stroke_color=INK, stroke_width=3)
        grp = VGroup(r1, r2).arrange(DOWN, buff=0).move_to([-2.8, 0.6, 0])
        top = M("24", 36).next_to(grp, UP, buff=0.15)
        l1 = M(f"{b('10')}", 36).next_to(r1, LEFT, buff=0.15)
        l2 = M(f"{o('3')}", 36).next_to(r2, LEFT, buff=0.15)
        self.say("24 × 13을 둘로 나누어", "24 곱하기 13은 24씩 13줄이에요. 13줄을 10줄과 3줄로 나누어 생각해요.")
        self.play(FadeIn(grp), FadeIn(top), FadeIn(l1), FadeIn(l2), run_time=0.8)
        e1 = M(f"24 × {o('3')} = {o('72')}", 48).move_to([3.0, 1.2, 0])
        e2 = M(f"24 × {b('10')} = {b('240')}", 48).move_to([3.0, 0.3, 0])
        e3 = M(f"72 + 240 = {g('312')}", 52).move_to([3.0, -0.7, 0])
        self.say(f"72와 240을 더하면 {g('312')}", "24 곱하기 3은 72, 24 곱하기 10은 240. 더하면 312예요.")
        self.play(FadeIn(e1), run_time=0.4)
        self.play(FadeIn(e2), run_time=0.4)
        self.play(FadeIn(e3), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def vertical(self):
        self.section("세로셈 두 줄")
        v = VertMul(self, 24, 13, x_right=-1.4, y0=2.4, F=64, dy=0.82)
        self.say("세로셈으로", "같은 계산을 세로셈으로 써요.")
        v.show()
        self.say(f"첫째 줄: 24 × {o('3')}", "첫째 줄은 24 곱하기 일의 자리 3, 72.")
        v.row(0, 72)
        self.say(f"둘째 줄: 24 × {b('10')}", "둘째 줄은 24 곱하기 10, 240. 끝의 0은 흐리게 쓰거나 생략해요.")
        v.row(1, 240, faded_tail=1)
        self.say(f"더하면 {g('312')}", "두 줄을 더하면 312.")
        v.total()
        t = M(f"어림: 약 20 × 15 = 300 → 312와 {g('가까워요')}", 38).move_to([3.0, -1.4, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("32 × 21", 90).move_to([0, 1.2, 0])
        self.say("32 × 21은?", "연습해 볼까요? 32 곱하기 21을 구해 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"32 × 1 = 32,  32 × 20 = 640 → 32 + 640 = {g('672')}", 46).move_to([0, -0.4, 0])
        self.say(f"{g('672')}", "32 곱하기 1은 32, 32 곱하기 20은 640. 더하면 672예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
