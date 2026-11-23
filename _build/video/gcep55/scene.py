"""「수학 원리 돋보기」 개념 차근차근 55화 — (분수) × (분수)

1/2 × 1/3: 정사각형을 세로로 3등분 → 그중 1을 가로로 2등분 → 6칸 중 1칸 = 1/6 / 2/3 × 3/4 = 6/12 = 1/2 (넓이 그림)
분자끼리, 분모끼리 곱함 / 1보다 작은 수를 곱하면 곱이 작아지는 까닭 / 연습 3/5 × 2/3
최종: GRADE=c ./make_final.sh 55
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
from fraction import frac, frac_bar, row
from manim import Rectangle


def square_grid(cols, rows, sc, sr, size=3.4):
    """cols×rows 칸, 왼쪽 sc열·위 sr행이 겹친 곳 진하게"""
    cw, ch = size / cols, size / rows
    g_ = VGroup()
    for r in range(rows):
        for c in range(cols):
            fill = GREEN if (c < sc and r < sr) else (BLUE if c < sc else "#FFFFFF")
            op = 0.85 if fill == GREEN else (0.35 if fill == BLUE else 1)
            g_.add(Rectangle(width=cw, height=ch, fill_color=fill, fill_opacity=op, stroke_color=INK, stroke_width=3).move_to([c * cw, -r * ch, 0]))
    return g_


class GcEp55(ConceptScene):
    EP_NO = 55
    EP_TITLE = "(분수) × (분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("넓이 그림으로")
        sq = square_grid(3, 2, 1, 1).move_to([-3.2, 0.6, 0])
        self.say("1/2 × 1/3은 1/3의 반", "2분의 1 곱하기 3분의 1은 3분의 1의 반이라는 뜻이에요. 정사각형을 세로로 3등분해 1칸을 칠하고, 그것을 가로로 반으로 나누어 볼까요?")
        self.play(FadeIn(sq), run_time=0.8)
        e = M(f"6칸 중 1칸 → 1/2 × 1/3 = {g('1/6')}", 50).move_to([2.6, 1.0, 0])
        t = M("분자끼리 1 × 1, 분모끼리 2 × 3", 40).move_to([2.6, 0.0, 0])
        self.say(f"6칸 중 1칸, {g('1/6')}", "전체가 6칸이 되고 그중 1칸이에요. 6분의 1. 분자끼리, 분모끼리 곱한 것과 같아요.")
        self.play(FadeIn(e), FadeIn(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("2/3 × 3/4")
        sq2 = square_grid(4, 3, 3, 2, size=3.2).move_to([-3.2, 0.6, 0])
        self.say("3/4의 2/3", "4분의 3을 칠하고, 그중 3분의 2를 다시 칠하면 겹친 곳이 몇 칸일까요?")
        self.play(FadeIn(sq2), run_time=0.8)
        e2 = M(f"12칸 중 6칸 → (2 × 3)/(3 × 4) = 6/12 = {g('1/2')}", 44).move_to([2.6, 0.8, 0])
        t2 = M(f"곱이 {o('3/4보다 작아요')}\n1보다 작은 수를 곱하면 작아져요", 38).move_to([2.6, -0.4, 0])
        self.say("1보다 작은 수를 곱하면 작아져요", "12칸 중 6칸, 2분의 1이에요. 4분의 3보다 작아졌지요? 4분의 3의 일부만 가져왔으니까요. 1보다 작은 수를 곱하면 곱이 작아져요.")
        self.play(FadeIn(e2), FadeIn(t2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("3/5 × 2/3", "3/5 × 2/3", "연습해 볼까요? 5분의 3 곱하기 3분의 2를 계산해 보세요.",
                 f"(3 × 2)/(5 × 3) = 6/15 = {g('2/5')}", f"{g('2/5')}", "15분의 6, 약분하면 5분의 2예요.")
        self.closing(f"(분수) × (분수): {b('분자끼리')}, {o('분모끼리')} 곱해요\n1보다 작은 수를 곱하면 곱이 작아져요",
                     next_preview="개념 차근차근 56화 · (소수) × (자연수)")
        self.wait(0.5)
