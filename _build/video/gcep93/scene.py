"""「수학 원리 돋보기」 개념 차근차근 93화 — 각기둥

두 밑면이 평행하고 합동인 다각형, 옆면은 직사각형 / 밑면 모양으로 이름(삼각기둥·사각기둥·오각기둥) / 면 □+2, 모서리 □×3, 꼭짓점 □×2 / 연습: 육각기둥
최종: GRADE=c ./make_final.sh 93
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
from solid import prism, pyramid, regular as sreg
from round3d import cylinder, cone, sphere
from cubes import stack, heights_cells, flat, top_view, front_view, side_view


class GcEp93(ConceptScene):
    EP_NO = 93
    EP_TITLE = "각기둥"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("각기둥")
        sol = VGroup(*[prism(sreg(n, 0.85), 1.6, center=(x, 0.6, 0)).edges(width=4) for n, x in [(3, -4.2), (4, -1.4), (5, 1.4), (6, 4.2)]])
        names = VGroup(*[M(x, 34).move_to([p, -0.9, 0]) for x, p in [("삼각기둥", -4.2), ("사각기둥", -1.4), ("오각기둥", 1.4), ("육각기둥", 4.2)]])
        self.say("위아래 면이 평행하고 합동", "위와 아래에 있는 두 면이 서로 평행하고 합동인 다각형이고, 옆면이 모두 직사각형인 입체도형을 각기둥이라고 해요. 밑면의 모양에 따라 이름을 붙여요.")
        self.play(LaggedStart(*[FadeIn(s_) for s_ in sol], lag_ratio=0.25), FadeIn(names), run_time=1.4)
        t = M(f"두 밑면: {b('평행·합동')} · 옆면: {o('직사각형')}", 42).move_to([0, -1.8, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("면·모서리·꼭짓점의 수", [("밑면이 □각형인 각기둥", 46, 1.5),
                  (f"면: □ + 2 · 모서리: □ × 3 · 꼭짓점: □ × 2", 48, 0.5),
                  (f"삼각기둥 → 면 {g('5')}, 모서리 {g('9')}, 꼭짓점 {g('6')}", 46, -0.5)],
                  "규칙으로 세기", "밑면이 네모각형이면 면은 네모 더하기 2, 모서리는 네모 곱하기 3, 꼭짓점은 네모 곱하기 2예요. 삼각기둥은 면 5, 모서리 9, 꼭짓점 6.")
        self.ask("육각기둥의 면·모서리·꼭짓점은?", "육각기둥은?", "연습해 볼까요? 육각기둥의 면, 모서리, 꼭짓점의 수를 구해 보세요.",
                 f"면 {g('8')} · 모서리 {g('18')} · 꼭짓점 {g('12')}", "8, 18, 12", "6 더하기 2는 8, 6 곱하기 3은 18, 6 곱하기 2는 12예요.", qsize=60)
        self.closing(f"두 밑면이 {b('평행·합동')}, 옆면이 {o('직사각형')}: 각기둥\n면 □+2 · 모서리 □×3 · 꼭짓점 □×2",
                     next_preview="개념 차근차근 94화 · 각뿔과 피라미드")
        self.wait(0.5)
