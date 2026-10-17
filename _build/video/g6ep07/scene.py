"""「수학 원리 돋보기」 6학년 7화 — 각기둥의 이름과 구성 요소 (6-1 2단원 4차시, 화 코드 6-1-2-b)

밑면의 모양에 따라 삼각기둥, 사각기둥, 오각기둥, …
모서리: 면과 면이 만나는 선분, 꼭짓점: 모서리와 모서리가 만나는 점, 높이: 두 밑면 사이의 거리
한 밑면의 변의 수 □ → 면 □ + 2, 모서리 □ × 3, 꼭짓점 □ × 2 (생각을 더하다: 육각기둥 이쑤시개 18, 공 12)
최종: GRADE=6 ./make_final.sh 7
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, DoubleArrow, Dot, FadeIn, FadeOut, Indicate, LaggedStart,
                   Line, Polygon, Rectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from solid import prism, regular

NAMES = {3: "삼각기둥", 4: "사각기둥", 5: "오각기둥", 6: "육각기둥"}


def table(rows, center, cw=1.5, hw=3.4, h=0.62, size=30):
    """rows: [[머리, 값…], …] → (틀, 글자 격자)"""
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


class G6Ep07(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 7
    EP_TITLE = "각기둥의 이름과 구성 요소"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.names()
        self.parts()
        self.counts()
        self.closing(f"각기둥의 이름은 {o('밑면의 모양')}으로 정해요\n한 밑면의 변의 수가 □이면 면 □+2, 모서리 {b('□×3')}, 꼭짓점 {g('□×2')}",
                     next_preview="6학년 8화 · 각기둥의 전개도")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("육각기둥을 이쑤시개(모서리)와 공(꼭짓점)으로 만들려면\n각각 몇 개가 필요할까요?", 40).move_to([0.6, 1.8, 0])
        self.say("이쑤시개와 공은 몇 개?", "육각기둥을 이쑤시개와 스타이로폼 공으로 만들려고 해요. 이쑤시개는 모서리, 공은 꼭짓점이에요. 각각 몇 개가 필요할까요?")
        self.play(Write(q), run_time=1.0)
        s = prism(regular(6, 1.2), 1.9, center=(0, -0.6, 0))
        dots = VGroup(*[Dot(p, radius=0.09, color=ORANGE) for p in s.p])
        self.play(Create(s.edges(width=4)), FadeIn(dots), run_time=0.9)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def names(self):
        self.section("밑면의 모양으로 이름 짓기")
        xs = [-4.4, 0, 4.4]
        grp = VGroup()
        labs = VGroup()
        for n, x in zip([3, 4, 5], xs):
            s = prism(regular(n, 1.1), 2.0, center=(x, 0.9, 0))
            grp.add(VGroup(s.face(0, ORANGE, 0.4), s.face(1, ORANGE, 0.7), s.edges(width=4)))
            labs.add(M(f"밑면 {o(['삼각형', '사각형', '오각형'][n - 3])}\n→ {g(NAMES[n])}", 34).move_to([x, -1.0, 0]))
        self.say(f"밑면이 삼각형이면 {g('삼각기둥')}", "각기둥은 밑면의 모양에 따라 이름을 정해요. 밑면이 삼각형이면 삼각기둥, 사각형이면 사각기둥, 오각형이면 오각기둥이에요.")
        self.play(LaggedStart(*[FadeIn(x) for x in grp], lag_ratio=0.3, run_time=1.2))
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.3, run_time=1.2))
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def parts(self):
        self.section("모서리 · 꼭짓점 · 높이")
        s = prism(regular(5, 1.6), 3.0, center=(-2.6, 0.2, 0))
        base = s.edges(width=5)
        self.play(FadeIn(base), run_time=0.5)
        e = s.edges(color=BLUE, width=8, show_hidden=False)
        t1 = M(f"{b('모서리')}: 면과 면이 만나는 선분", 34).move_to([3.3, 1.7, 0])
        self.say(f"면과 면이 만나는 선분: {b('모서리')}", "면과 면이 만나는 선분을 모서리라고 해요.")
        self.play(Create(e), FadeIn(t1), run_time=0.9)
        self.play(FadeOut(e), run_time=0.3)
        dots = VGroup(*[Dot(p, radius=0.11, color=ORANGE) for p in s.p])
        t2 = M(f"{o('꼭짓점')}: 모서리와 모서리가 만나는 점", 34).move_to([3.3, 0.7, 0])
        self.say(f"모서리끼리 만나는 점: {o('꼭짓점')}", "모서리와 모서리가 만나는 점을 꼭짓점이라고 해요.")
        self.play(LaggedStart(*[FadeIn(d, scale=2) for d in dots], lag_ratio=0.08, run_time=0.9), FadeIn(t2))
        x = s.p[s.n + 1][0] + 0.55
        ar = DoubleArrow([x, s.p[1][1], 0], [x, s.p[s.n + 1][1], 0], color=GREEN, buff=0, stroke_width=5, tip_length=0.22)
        t3 = M(f"{g('높이')}: 두 밑면 사이의 거리", 34).move_to([3.3, -0.3, 0])
        self.say(f"두 밑면 사이의 거리: {g('높이')}", "두 밑면 사이의 거리를 높이라고 해요.")
        self.play(Create(ar), FadeIn(t3), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def counts(self):
        self.section("개수의 규칙")
        rows = [["한 밑면의 변의 수", "3", "4", "5", "6"],
                ["면의 수", "5", "6", "7", "8"],
                ["모서리의 수", "9", "12", "15", "18"],
                ["꼭짓점의 수", "6", "8", "10", "12"]]
        frame, cells = table(rows, (0, 1.0), cw=1.4, hw=3.6, h=0.66, size=30)
        self.say("변의 수에 따라 세어 보면", "한 밑면의 변의 수에 따라 면, 모서리, 꼭짓점의 수를 세어 표로 나타냈어요.")
        self.play(FadeIn(frame), *[FadeIn(cells[r][0]) for r in range(4)], *[FadeIn(cells[0][c]) for c in range(1, 5)], run_time=0.6)
        self.play(LaggedStart(*[FadeIn(cells[r][c]) for c in range(1, 5) for r in range(1, 4)], lag_ratio=0.05, run_time=1.2))
        rules = [("면", "□ + 2", ORANGE, "밑면 2개와 옆면 □개"), ("모서리", "□ × 3", BLUE, "위 □개, 아래 □개, 옆 □개"), ("꼭짓점", "□ × 2", GREEN, "위 □개, 아래 □개")]
        ys = [-1.0, -1.65, -2.3]
        rl = VGroup()
        for (nm, f, c, why), y in zip(rules, ys):
            rl.add(M(f"{nm} = <span foreground='{c}'>{f}</span>   ({why})", 32).move_to([0, y, 0]))
        self.say(f"면 □+2, 모서리 {b('□×3')}, 꼭짓점 {g('□×2')}", "면은 밑면 2개와 옆면 □개라서 □ 더하기 2, 모서리는 위·아래·옆에 □개씩이라 □ 곱하기 3, 꼭짓점은 위·아래에 □개씩이라 □ 곱하기 2예요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rl], lag_ratio=0.4, run_time=1.5))
        self.play(Indicate(cells[2][4], color=BLUE, scale_factor=1.4), Indicate(cells[3][4], color=GREEN, scale_factor=1.4), run_time=0.8)
        self.say(f"육각기둥: 이쑤시개 {b('18개')}, 공 {g('12개')}", "그래서 육각기둥에는 이쑤시개 6 곱하기 3, 18개와 공 6 곱하기 2, 12개가 필요해요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
