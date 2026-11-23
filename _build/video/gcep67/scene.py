"""「수학 원리 돋보기」 개념 차근차근 67화 — 도형 배열과 계산식 배열

사각형 1, 4, 9, 16개(□×□) / 계산식: 1 + 3 = 4, 1 + 3 + 5 = 9, 1 + 3 + 5 + 7 = 16 (홀수 합 = 같은 수 곱)
연습: 다섯째 모양의 사각형 수
최종: GRADE=c ./make_final.sh 67
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
from manim import Rectangle, Square, Triangle, Circle


class GcEp67(ConceptScene):
    EP_NO = 67
    EP_TITLE = "도형 배열과 계산식 배열"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("커지는 정사각형")
        figs = VGroup()
        for n in range(1, 5):
            g_ = VGroup(*[Square(side_length=0.36, fill_color=ORANGE if (r == n - 1 or c == n - 1) and n > 1 else BLUE, fill_opacity=0.9, stroke_color=INK, stroke_width=2).move_to([c * 0.36, -r * 0.36, 0]) for r in range(n) for c in range(n)])
            figs.add(VGroup(g_, T(f"{n * n}개", 34, INK).next_to(g_, DOWN, buff=0.25)))
        figs.arrange(RIGHT, buff=0.9, aligned_edge=DOWN).move_to([0, 1.0, 0])
        self.say("사각형이 몇 개씩 늘어날까요?", "작은 사각형으로 만든 정사각형이 점점 커져요. 1개, 4개, 9개, 16개.")
        self.play(LaggedStart(*[FadeIn(f) for f in figs], lag_ratio=0.3), run_time=1.4)
        t = M(f"1 × 1, 2 × 2, 3 × 3, 4 × 4 → 다섯째는 5 × 5 = {g('25개')}", 46).move_to([0, -1.2, 0])
        self.say("같은 수를 두 번 곱한 수", "한 변의 사각형 수를 두 번 곱한 수예요. 다섯째는 5 곱하기 5, 25개가 될 거예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("계산식 배열", [(f"1 + 3 = {g('4')} = 2 × 2", 48, 1.6), (f"1 + 3 + 5 = {g('9')} = 3 × 3", 48, 0.8),
                  (f"1 + 3 + 5 + 7 = {g('16')} = 4 × 4", 48, 0.0),
                  (f"늘어나는 {o('주황 사각형')} 수가 3, 5, 7 … 홀수예요", 40, -0.9)],
                  "홀수를 차례로 더하면", "새로 붙는 주황 사각형은 3개, 5개, 7개로 홀수예요. 1부터 홀수를 차례로 더하면 같은 수를 두 번 곱한 수가 돼요.")
        self.ask("1 + 3 + 5 + 7 + 9 = ?", "다음 식의 값은?", "연습해 볼까요? 1부터 9까지 홀수를 더한 값은 얼마일까요? 규칙을 써 보세요.",
                 f"홀수 5개 → 5 × 5 = {g('25')}", f"{g('25')}", "홀수가 5개라서 5 곱하기 5, 25예요.", qsize=64)
        self.closing(f"도형과 계산식에서 {g('커지는 규칙')}을 찾아요\n1 + 3 + 5 + 7 = 4 × 4 = 16",
                     next_preview="개념 차근차근 68화 · 대응 관계와 식")
        self.wait(0.5)
