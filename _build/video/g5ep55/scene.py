"""「수학 원리 돋보기」 5학년 55화 — 정육면체의 전개도 (5-2 5단원 5차시, 화 코드 5-2-5-d)

모서리를 잘라 평면에 펼친 그림 = 전개도 (잘린 모서리 실선, 잘리지 않은 모서리 점선)
정사각형 6개, 접었을 때 겹치는 면이 없어야 함, 마주 보는 면은 서로 떨어져 있음(같은 색)
한 정육면체도 여러 모양으로 펼칠 수 있음 / 한 줄에 5개 이상, 한 꼭짓점에 4면이 모이면 안 됨
최종: GRADE=5 ./make_final.sh 55
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   Square, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cuboid import Cuboid

RED = "#C0392B"
PUR = "#7A4FB5"


def net(cells, s, center, colors=None):
    """cells: [(col, row)], 위에서 아래로 row 증가. 바깥 테두리는 실선, 안쪽 맞닿은 변은 점선"""
    c = np.array(center, float)
    cols = [x for x, _ in cells]
    rows = [y for _, y in cells]
    cx, cy = (min(cols) + max(cols) + 1) / 2, (min(rows) + max(rows) + 1) / 2
    sq = VGroup()
    pos = {}
    for k, (x, y) in enumerate(cells):
        p = c + np.array([(x + 0.5 - cx) * s, -(y + 0.5 - cy) * s, 0])
        pos[(x, y)] = p
        col = colors[k] if colors else ORANGE
        sq.add(Square(side_length=s, fill_color=col, fill_opacity=0.45, stroke_width=0).move_to(p))
    lines = VGroup()
    S = set(cells)
    for (x, y) in cells:
        p = pos[(x, y)]
        h = s / 2
        for (dx, dy), (a, b_) in {(1, 0): ((h, -h), (h, h)), (-1, 0): ((-h, -h), (-h, h)), (0, -1): ((-h, h), (h, h)), (0, 1): ((-h, -h), (h, -h))}.items():
            A, B = p + np.array([a[0], a[1], 0]), p + np.array([b_[0], b_[1], 0])
            if (x + dx, y + dy) in S:
                if (dx, dy) in ((1, 0), (0, 1)):
                    lines.add(DashedLine(A, B, color=INK, stroke_width=3, dash_length=0.1))
            else:
                lines.add(Line(A, B, color=INK, stroke_width=5))
    return VGroup(sq, lines)


CROSS = [(1, 0), (0, 1), (1, 1), (2, 1), (3, 1), (1, 2)]
# 위(1,0)·아래(1,2) 마주 봄, 왼(0,1)·오른(2,1) 마주 봄, 앞(1,1)·뒤(3,1) 마주 봄
CROSS_COL = [ORANGE, GREEN, BLUE, GREEN, BLUE, ORANGE]


class G5Ep55(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 55
    EP_TITLE = "정육면체의 전개도"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unfold()
        self.many()
        self.closing(f"정육면체의 전개도는 {o('정사각형 6개')}, 접었을 때 {g('겹치는 면이 없어야')} 해요\n잘린 모서리는 실선, 잘리지 않은 모서리는 점선",
                     next_preview="5학년 56화 · 직육면체의 전개도")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("정육면체의 모서리를 잘라 펼치면\n어떤 모양이 될까요?", 44).move_to([0.6, 1.9, 0])
        cb = Cuboid(2.0, 2.0, 2.0, [0, -0.8, 0])
        self.say("정육면체를 펼치면?", "정육면체 모양 상자의 모서리를 잘라서 평면 위에 펼치면 어떤 모양이 될까요?")
        self.play(Write(q), FadeIn(VGroup(cb.face("front", BLUE, 0.4), cb.face("top", ORANGE, 0.4), cb.face("right", GREEN, 0.4), cb.edges(show_hidden=False))), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def unfold(self):
        self.section("펼쳐 보기")
        cb = Cuboid(1.8, 1.8, 1.8, [-4.4, 0.4, 0])
        cube = VGroup(cb.face("front", BLUE, 0.45), cb.face("top", ORANGE, 0.45), cb.face("right", GREEN, 0.45), cb.edges())
        self.play(FadeIn(cube), run_time=0.5)
        n = net(CROSS, 1.0, [0.2, 0.4, 0], CROSS_COL)
        self.say("모서리를 잘라 펼치면", "모서리 몇 개를 잘라서 평면 위에 펼쳐 볼게요.")
        self.play(FadeIn(n[0], shift=RIGHT * 0.6), run_time=1.0)
        self.play(Create(n[1]), run_time=0.8)
        t = M(f"정사각형 {o('6개')}\n= 정육면체의 {g('전개도')}", 32).move_to([4.6, 1.4, 0])
        self.say(f"정사각형 6개짜리 {g('전개도')}", "모서리를 잘라서 펼쳐 놓은 그림을 전개도라고 해요. 정육면체의 전개도는 정사각형 6개예요.")
        self.play(FadeIn(t), run_time=0.5)
        t2 = M(f"잘린 모서리 {o('실선')}\n안 잘린 모서리 {b('점선')}", 30).move_to([4.6, -0.5, 0])
        self.say(f"잘린 모서리는 {o('실선')}, 안 잘린 모서리는 {b('점선')}", "잘린 모서리는 실선으로, 잘리지 않고 접히는 모서리는 점선으로 그려요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.say(f"같은 색은 접었을 때 {g('마주 보는 면')}", "같은 색끼리는 접었을 때 마주 보는 면이에요. 전개도에서 서로 떨어져 있어요.")
        self.play(Indicate(n[0], color=GREEN, scale_factor=1.03), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def many(self):
        self.section("여러 가지 모양")
        a = net([(0, 0), (0, 1), (1, 1), (2, 1), (3, 1), (3, 2)], 0.62, [-4.6, 0.9, 0])
        b_ = net([(0, 0), (1, 0), (1, 1), (2, 1), (2, 2), (3, 2)], 0.62, [-0.9, 0.9, 0])
        c = net([(0, 0), (1, 0), (2, 0), (2, 1), (3, 1), (4, 1)], 0.62, [3.3, 0.9, 0])
        self.say(f"한 정육면체도 {o('여러 모양')}으로 펼칠 수 있어요", "한 정육면체도 어느 모서리를 자르느냐에 따라 여러 가지 모양으로 펼칠 수 있어요.")
        self.play(LaggedStart(*[FadeIn(x) for x in (a, b_, c)], lag_ratio=0.3, run_time=1.2))
        bad = net([(0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (1, 1)], 0.62, [-2.6, -1.3, 0])
        bad2 = net([(0, 0), (1, 0), (0, 1), (1, 1), (2, 1), (3, 1)], 0.62, [2.8, -1.3, 0])
        x1 = Cross(bad, stroke_color=RED, stroke_width=6).scale(0.8)
        x2 = Cross(bad2, stroke_color=RED, stroke_width=6).scale(0.8)
        self.say(f"접었을 때 {RED_T('겹치는 면')}이 있으면 안 돼요", "하지만 한 줄에 다섯 면이 이어지거나, 네 면이 정사각형으로 모여 있으면 접었을 때 겹치는 면이 생겨서 전개도가 아니에요.")
        self.play(FadeIn(bad), FadeIn(bad2), run_time=0.6)
        self.play(Create(x1), Create(x2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
