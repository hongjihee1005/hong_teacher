"""「수학 원리 돋보기」 6학년 10화 — 각뿔의 이름과 구성 요소 (6-1 2단원 8~9차시, 화 코드 6-1-2-e)

밑면의 모양에 따라 삼각뿔, 사각뿔, 오각뿔, …
모서리, 꼭짓점, 각뿔의 꼭짓점(옆면이 모두 만나는 점), 높이(각뿔의 꼭짓점과 밑면 사이의 거리)
밑면의 변의 수 □ → 면 □ + 1, 모서리 □ × 2, 꼭짓점 □ + 1 (생각을 더하다: 육각뿔 이쑤시개 12, 공 7)
최종: GRADE=6 ./make_final.sh 10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import right_mark
from solid import Solid, pyramid, regular

NAMES = {3: "삼각뿔", 4: "사각뿔", 5: "오각뿔", 6: "육각뿔"}


def table(rows, center, cw=1.4, hw=3.6, h=0.66, size=30):
    nr, nc = len(rows), len(rows[0])
    W = hw + cw * (nc - 1)
    x0 = center[0] - W / 2
    y0 = center[1] + nr * h / 2
    frame = VGroup()
    cells = []
    for r in range(nr):
        line = []
        for c in range(nc):
            w = hw if c == 0 else cw
            x = x0 if c == 0 else x0 + hw + cw * (c - 1)
            rect = Rectangle(width=w, height=h, stroke_color=INK, stroke_width=2,
                             fill_color="#EFE6C8" if c == 0 or r == 0 else PAPER, fill_opacity=1).move_to([x + w / 2, y0 - h * (r + 0.5), 0])
            frame.add(rect)
            line.append(M(rows[r][c], size).move_to(rect.get_center()))
        cells.append(line)
    return frame, cells


class G6Ep10(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 10
    EP_TITLE = "각뿔의 이름과 구성 요소"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.names()
        self.parts()
        self.counts()
        self.closing(f"각뿔의 이름은 {o('밑면의 모양')}으로 정해요\n밑면의 변의 수가 □이면 면 □+1, 모서리 {b('□×2')}, 꼭짓점 {g('□+1')}",
                     next_preview="6학년 11화 · (소수) ÷ (자연수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("육각뿔을 이쑤시개(모서리)와 공(꼭짓점)으로 만들려면\n각각 몇 개가 필요할까요?", 40).move_to([0.6, 1.8, 0])
        self.say("이쑤시개와 공은 몇 개?", "이번에는 육각뿔을 이쑤시개와 공으로 만들려고 해요. 각각 몇 개가 필요할까요?")
        self.play(Write(q), run_time=1.0)
        s = pyramid(regular(6, 1.2), 2.0, center=(0, -0.6, 0))
        dots = VGroup(*[Dot(p, radius=0.09, color=ORANGE) for p in s.p])
        self.play(Create(s.edges(width=4)), FadeIn(dots), run_time=0.9)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def names(self):
        self.section("밑면의 모양으로 이름 짓기")
        xs = [-4.4, 0, 4.4]
        grp, labs = VGroup(), VGroup()
        for n, x in zip([3, 4, 5], xs):
            s = pyramid(regular(n, 1.15), 2.1, center=(x, 0.9, 0))
            grp.add(VGroup(s.face(0, ORANGE, 0.5), s.edges(width=4)))
            labs.add(M(f"밑면 {o(['삼각형', '사각형', '오각형'][n - 3])}\n→ {g(NAMES[n])}", 34).move_to([x, -1.0, 0]))
        self.say(f"밑면이 삼각형이면 {g('삼각뿔')}", "각뿔도 밑면의 모양에 따라 이름을 정해요. 밑면이 삼각형이면 삼각뿔, 사각형이면 사각뿔, 오각형이면 오각뿔이에요.")
        self.play(LaggedStart(*[FadeIn(x) for x in grp], lag_ratio=0.3, run_time=1.2))
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.3, run_time=1.2))
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def parts(self):
        self.section("각뿔의 꼭짓점과 높이")
        s = pyramid(regular(5, 1.8), 3.2, center=(-2.8, 0.2, 0))
        self.play(FadeIn(s.edges()), FadeIn(s.face(0, ORANGE, 0.3)), run_time=0.5)
        dots = VGroup(*[Dot(p, radius=0.1, color=ORANGE) for p in s.p])
        t1 = M(f"{o('꼭짓점')}: 모서리와 모서리가 만나는 점", 28).move_to([3.5, 1.9, 0])
        self.say(f"모서리끼리 만나는 점: {o('꼭짓점')}", "각뿔에서도 면과 면이 만나는 선분을 모서리, 모서리와 모서리가 만나는 점을 꼭짓점이라고 해요.")
        self.play(LaggedStart(*[FadeIn(d, scale=2) for d in dots], lag_ratio=0.1, run_time=0.8), FadeIn(t1))
        apex = s.p[s.n]
        big = Dot(apex, radius=0.17, color=GREEN)
        t2 = M(f"{g('각뿔의 꼭짓점')}: 옆면이 모두 만나는 점", 28).move_to([3.5, 0.9, 0])
        self.say(f"옆면이 모두 만나는 점: {g('각뿔의 꼭짓점')}", "꼭짓점 중에서도 옆면이 모두 만나는 점을 각뿔의 꼭짓점이라고 해요.")
        self.play(FadeIn(big, scale=2), FadeIn(t2), run_time=0.6)
        cen3 = np.mean(s.v3[:s.n], axis=0)
        foot = Solid._proj(cen3) + (s.p[0] - Solid._proj(s.v3[0]))
        hl = DashedLine(apex, foot, color=BLUE, stroke_width=5, dash_length=0.12)
        fd = Dot(foot, radius=0.07, color=BLUE)
        rm = right_mark(foot, apex - foot, RIGHT, 0.22, BLUE, 4)
        t3 = M(f"{b('높이')}: 각뿔의 꼭짓점과 밑면 사이의 거리", 28).move_to([3.5, -0.1, 0])
        self.say(f"꼭짓점에서 밑면까지 수직인 거리: {b('높이')}", "각뿔의 꼭짓점에서 밑면에 수직인 선분의 길이, 곧 각뿔의 꼭짓점과 밑면 사이의 거리를 높이라고 해요.")
        self.play(Create(hl), FadeIn(fd), Create(rm), FadeIn(t3), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def counts(self):
        self.section("개수의 규칙")
        rows = [["밑면의 변의 수", "3", "4", "5", "6"],
                ["면의 수", "4", "5", "6", "7"],
                ["모서리의 수", "6", "8", "10", "12"],
                ["꼭짓점의 수", "4", "5", "6", "7"]]
        frame, cells = table(rows, (0, 1.0))
        self.say("변의 수에 따라 세어 보면", "밑면의 변의 수에 따라 면, 모서리, 꼭짓점의 수를 세어 표로 나타냈어요.")
        self.play(FadeIn(frame), *[FadeIn(cells[r][0]) for r in range(4)], *[FadeIn(cells[0][c]) for c in range(1, 5)], run_time=0.6)
        self.play(LaggedStart(*[FadeIn(cells[r][c]) for c in range(1, 5) for r in range(1, 4)], lag_ratio=0.05, run_time=1.2))
        rules = [("면", "□ + 1", ORANGE, "밑면 1개와 옆면 □개"), ("모서리", "□ × 2", BLUE, "밑면에 □개, 옆에 □개"), ("꼭짓점", "□ + 1", GREEN, "밑면에 □개와 각뿔의 꼭짓점 1개")]
        rl = VGroup()
        for (nm, f, c, why), y in zip(rules, [-1.0, -1.65, -2.3]):
            rl.add(M(f"{nm} = <span foreground='{c}'>{f}</span>   ({why})", 32).move_to([0, y, 0]))
        self.say(f"면 □+1, 모서리 {b('□×2')}, 꼭짓점 {g('□+1')}", "면은 밑면 1개와 옆면 □개, 모서리는 밑면에 □개와 옆에 □개, 꼭짓점은 밑면에 □개와 각뿔의 꼭짓점 1개예요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rl], lag_ratio=0.4, run_time=1.5))
        self.play(Indicate(cells[2][4], color=BLUE, scale_factor=1.4), Indicate(cells[3][4], color=GREEN, scale_factor=1.4), run_time=0.8)
        self.say(f"육각뿔: 이쑤시개 {b('12개')}, 공 {g('7개')}", "그래서 육각뿔에는 이쑤시개 6 곱하기 2, 12개와 공 6 더하기 1, 7개가 필요해요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
