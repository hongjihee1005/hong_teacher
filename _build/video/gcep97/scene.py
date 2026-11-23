"""「수학 원리 돋보기」 개념 차근차근 97화 — 쌓기나무: 위·앞·옆에서 본 모양

쌓기나무 개수 세기(숨은 나무) / 위에서 본 모양에 층수 쓰기 → 개수 = 수의 합 / 앞·옆에서 본 모양 / 층별로 나타내기 / 연습
최종: GRADE=c ./make_final.sh 97
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


class GcEp97(ConceptScene):
    EP_NO = 97
    EP_TITLE = "쌓기나무: 위·앞·옆에서 본 모양"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("몇 개일까?")
        hmap = {(0, 0): 2, (1, 0): 1, (0, 1): 3, (1, 1): 1, (2, 1): 1}
        st = stack(heights_cells(hmap), s=0.55, center=(-3.0, 0.4, 0))
        self.say("쌓기나무가 몇 개일까요?", "쌓기나무로 만든 모양이에요. 몇 개일까요? 뒤에 가려 보이지 않는 쌓기나무가 있을 수 있어요.")
        self.play(FadeIn(st), run_time=0.8)
        grid = VGroup()
        for (x, z), h in hmap.items():
            sq = Square(0.8, stroke_color=INK, stroke_width=3, fill_color="#FFFFFF", fill_opacity=1).move_to([2.0 + x * 0.8, 0.4 + z * 0.8, 0])
            grid.add(VGroup(sq, T(str(h), 40, ORANGE).move_to(sq)))
        lab = M("위에서 본 모양에 층수를 써요", 36).next_to(grid, UP, buff=0.3)
        self.say("위에서 본 모양에 층수 쓰기", "위에서 본 모양을 그리고, 칸마다 그 자리에 쌓인 개수를 쓰면 숨은 쌓기나무까지 정확히 셀 수 있어요.")
        self.play(FadeIn(grid), FadeIn(lab), run_time=0.7)
        t = M(f"2 + 1 + 3 + 1 + 1 = {g('8개')}", 52).move_to([0, -1.6, 0])
        self.say(f"모두 {g('8개')}", "칸에 쓴 수를 모두 더하면 8. 쌓기나무는 8개예요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.step("앞과 옆에서 본 모양", [("앞에서 보면: 줄마다 가장 높은 층만 보여요", 42, 1.2),
                  ("옆에서 보면: 옆에서 본 줄마다 가장 높은 층", 42, 0.3),
                  ("층별로 나누어 그리면 모양을 정확히 알 수 있어요 (1층 = 위에서 본 모양)", 36, -0.7)],
                  "앞, 옆에서 본 모양", "앞에서 본 모양은 앞뒤로 같은 줄에서 가장 높은 층만 보여요. 층별로 나누어 그리면 1층 모양은 위에서 본 모양과 같아요.")
        self.ask("위에서 본 칸의 수가 3, 2, 1, 2이면 모두 몇 개?", "모두 몇 개?", "연습해 볼까요? 위에서 본 모양의 칸에 쓴 수가 3, 2, 1, 2이면 쌓기나무는 모두 몇 개일까요?",
                 f"3 + 2 + 1 + 2 = {g('8개')}", f"{g('8개')}", "칸의 수를 모두 더하면 8개예요.", qsize=48)
        self.closing(f"위에서 본 모양에 {o('층수')}를 쓰면 개수 = {g('수의 합')}\n앞·옆에서는 줄마다 가장 높은 층이 보여요",
                     next_preview="개념 차근차근 98화 · 비교하기: 길다·무겁다·넓다·많다")
        self.wait(0.5)
