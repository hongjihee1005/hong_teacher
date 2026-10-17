"""「수학 원리 돋보기」 5학년 46화 — 점대칭도형의 성질 (5-2 3단원 8·9차시, 화 코드 5-2-3-f)

대칭의 중심을 중심으로 180° 돌렸을 때 겹치는 점·변·각 = 대응점·대응변·대응각 (길이·크기 같음)
대응점을 이은 선분은 모두 대칭의 중심을 지나고, 대칭의 중심이 그 선분을 똑같이 둘로 나눔
→ 점대칭도형 그리기: 꼭짓점에서 대칭의 중심을 지나 같은 거리만큼 반대쪽에 점
최종: GRADE=5 ./make_final.sh 46
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import poly, tick
from move import grid

RED = "#C0392B"
HALF = [(0, -1), (2, -1), (3, 1), (1, 1)]


class G5Ep46(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 46
    EP_TITLE = "점대칭도형의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.props()
        self.draw()
        self.closing(f"대응점을 이은 선분은 {o('대칭의 중심')}을 지나고\n대칭의 중심이 그 선분을 {g('똑같이 둘로')} 나눠요",
                     next_preview="5학년 47화 · (소수) × (자연수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("점대칭도형에서 대응점을 이은 선분은\n어떤 특징이 있을까요?", 44).move_to([0.6, 1.9, 0])
        P = [np.array(p) for p in ([-1.6, -1.4, 0], [0.4, -1.4, 0], [1.6, 0.2, 0], [-0.4, 0.2, 0])]
        self.say("대응점을 이은 선분", "점대칭도형에서 대응점을 이은 선분에는 어떤 특징이 있을까요?")
        self.play(Write(q), FadeIn(poly(P, fill=BLUE)), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def props(self):
        self.section("대응점을 이으면")
        c = np.array([-2.6, 0.1, 0])
        s = 0.75
        pts = [(-2.0, -1.2), (0.6, -1.2), (2.0, 0.1), (2.0, 1.2), (-0.6, 1.2), (-2.0, -0.1)]
        P = [c + s * np.array([x, y, 0]) for x, y in pts]
        sh = poly(P, fill=ORANGE, op=0.3)
        d = Dot(c, radius=0.1, color=RED)
        lc = T("대칭의 중심", 26, RED).move_to(c + DOWN * 1.3)
        self.play(FadeIn(sh), FadeIn(d), FadeIn(lc), run_time=0.6)
        pairs = [(0, 3), (1, 4), (2, 5)]
        cols = [BLUE, GREEN, "#7A4FB5"]
        segs, tks = VGroup(), VGroup()
        for (i, j), col in zip(pairs, cols):
            segs.add(Line(P[i], P[j], color=col, stroke_width=5))
            tks.add(tick(P[i], c, 1, color=col), tick(c, P[j], 1, color=col))
        self.say("180° 돌렸을 때 겹치는 점끼리 이으면", "대칭의 중심을 중심으로 180도 돌렸을 때 겹치는 대응점끼리 선분으로 이어 볼게요.")
        self.play(LaggedStart(*[Create(sg) for sg in segs], lag_ratio=0.4, run_time=1.5))
        self.say(f"모두 {o('대칭의 중심')}을 지나요", "대응점을 이은 선분은 모두 대칭의 중심을 지나요.")
        self.play(Indicate(d, color=RED, scale_factor=2.2), run_time=0.7)
        self.say(f"중심이 {g('똑같이 둘로')} 나눠요", "그리고 대칭의 중심은 대응점을 이은 선분을 똑같이 둘로 나눠요. 중심에서 두 대응점까지의 거리가 같아요.")
        self.play(Create(tks), run_time=0.7)
        t = M(f"대응변의 길이와 대응각의 크기도\n{g('서로 같아요')}", 36).move_to([3.4, 0.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def draw(self):
        self.section("점대칭도형 완성하기")
        gd = grid(12, 6, 0.55, [-2.4, 0.2, 0])
        O = gd.pt(6, 3)
        half = [gd.pt(6 + x, 3 + y) for x, y in [(0, 2), (-3, 2), (-5, 0), (-2, 0), (0, -2)]]
        lines = VGroup(*[Line(half[k], half[k + 1], color=INK, stroke_width=6) for k in range(len(half) - 1)])
        d = Dot(O, radius=0.1, color=RED)
        self.say("반쪽과 대칭의 중심", "도형의 반쪽과 대칭의 중심이 있어요. 점대칭도형으로 완성해 볼게요.")
        self.play(FadeIn(gd), Create(lines), FadeIn(d), run_time=0.8)
        opp = [2 * O - p for p in half]
        guides = VGroup(*[DashedLine(p, q, color=ORANGE, stroke_width=3) for p, q in zip(half[1:-1], opp[1:-1])])
        dots = VGroup(*[Dot(q, radius=0.09, color=ORANGE) for q in opp[1:-1]])
        self.say(f"중심을 지나 {o('같은 거리')}만큼 반대쪽에 점", "각 꼭짓점에서 대칭의 중심을 지나 같은 거리만큼 반대쪽으로 가서 대응점을 찍어요.")
        self.play(LaggedStart(*[Create(gl) for gl in guides], lag_ratio=0.3, run_time=1.2), LaggedStart(*[FadeIn(x, scale=2) for x in dots], lag_ratio=0.3, run_time=1.2))
        other = VGroup(*[Line(opp[k], opp[k + 1], color=ORANGE, stroke_width=6) for k in range(len(opp) - 1)])
        self.say(f"이으면 {g('완성')}", "대응점을 차례로 이으면 점대칭도형이 완성돼요.")
        self.play(Create(other), run_time=1.0)
        t = M(f"중심까지의 거리가 같게!", 36).move_to([3.9, 0.4, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
