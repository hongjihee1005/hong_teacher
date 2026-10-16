"""「수학 원리 돋보기」 4학년 56화 — 모양 조각으로 만들고 채우기 (4-2 6단원 6·7차시, 화 코드 4-2-6-d)

정육각형 = 정삼각형 6개 = 마름모 3개 = 사다리꼴 2개 = 사다리꼴 1 + 마름모 1 + 정삼각형 1
정삼각형의 한 각 60°가 6개 모이면 360° → 가운데에 빈틈이 없음
최종: GRADE=4 ./make_final.sh 56
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedVMobject, FadeIn, FadeOut, Indicate, LaggedStart, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from shapes import PURPLE, arc_at, poly, regular

RED = "#C0392B"
YEL = "#E5B700"
TRI, RHO, TRAP, HEX = GREEN, BLUE, RED, YEL


def hexv(c, s):
    c = np.array(c, float)
    return c, [c + s * np.array([np.cos(np.radians(60 * k)), np.sin(np.radians(60 * k)), 0]) for k in range(6)]


def pieces(kind, c, s):
    C, V = hexv(c, s)
    if kind == "tri":
        return [(poly([C, V[k], V[(k + 1) % 6]], fill=TRI, op=0.85, width=4)) for k in range(6)]
    if kind == "rho":
        return [poly([C, V[k], V[k + 1], V[(k + 2) % 6]], fill=RHO, op=0.85, width=4) for k in (0, 2, 4)]
    if kind == "trap":
        return [poly([V[0], V[1], V[2], V[3]], fill=TRAP, op=0.85, width=4), poly([V[3], V[4], V[5], V[0]], fill=TRAP, op=0.85, width=4)]
    return [poly([V[0], V[1], V[2], V[3]], fill=TRAP, op=0.85, width=4), poly([C, V[3], V[4], V[5]], fill=RHO, op=0.85, width=4),
            poly([C, V[5], V[0]], fill=TRI, op=0.85, width=4)]


class G4Ep56(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 56
    EP_TITLE = "모양 조각으로 만들고 채우기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.fill()
        self.why()
        self.closing(f"모양 조각을 {o('빈틈없이, 겹치지 않게')} 이어 붙이면\n같은 모양을 {g('여러 가지 방법')}으로 채울 수 있어요",
                     next_preview="4학년 편 끝! 5학년에서 또 만나요")
        self.wait(0.5)

    def outline(self, c, s):
        _, V = hexv(c, s)
        return DashedVMobject(poly(V, color=INK, width=4), num_dashes=36)

    def problem(self):
        self.section("문제")
        q = M("정육각형을 모양 조각으로 채워 볼까요?", 46).move_to([0.6, 2.3, 0])
        hx = self.outline([0, -0.5, 0], 1.6)
        tray = VGroup(poly(regular(3, 0.55, [0, 0, 0]), fill=TRI, op=0.85, width=4),
                      pieces("rho", [0, 0, 0], 0.95)[0],
                      pieces("trap", [0, 0, 0], 0.95)[0]).arrange(DOWN, buff=0.35).move_to([4.6, -0.4, 0])
        names = VGroup(*[T(s, 28).next_to(t, LEFT, buff=0.3) for s, t in zip(["정삼각형", "마름모", "사다리꼴"], tray)])
        self.say("정육각형을 채워 봐요", "정삼각형, 마름모, 사다리꼴 모양 조각으로 정육각형을 빈틈없이 채울 수 있을까요?")
        self.play(Write(q), Create(hx), FadeIn(tray), FadeIn(names), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def fly(self, kind, c, s, label, say, nar):
        hx = self.outline(c, s)
        ps = pieces(kind, c, s)
        self.say(say, nar)
        self.play(Create(hx), run_time=0.4)
        anims = []
        for p in ps:
            tgt = p.copy()
            p.shift(DOWN * 3.2).set_opacity(0)
            anims.append(p.animate.become(tgt))
        self.play(LaggedStart(*anims, lag_ratio=0.25, run_time=0.6 + 0.25 * len(ps)))
        lab = M(label, 32).move_to([c[0], c[1] - s - 0.55, 0])
        self.play(FadeIn(lab), run_time=0.4)

    def fill(self):
        self.section("여러 가지 방법")
        s = 1.15
        cs = [[-5.1, 0.6, 0], [-1.7, 0.6, 0], [1.7, 0.6, 0], [5.1, 0.6, 0]]
        self.fly("tri", cs[0], s, f"정삼각형 {g('6개')}", f"정삼각형 {g('6개')}", "정삼각형 6개로 채울 수 있어요.")
        self.fly("rho", cs[1], s, f"마름모 {b('3개')}", f"마름모 {b('3개')}", "마름모 3개로도 채울 수 있어요.")
        self.fly("trap", cs[2], s, f"사다리꼴 {o('2개')}", f"사다리꼴 {o('2개')}", "사다리꼴 2개로도 채울 수 있어요.")
        self.fly("mix", cs[3], s, "세 가지를 하나씩", "섞어서도 채울 수 있어요", "사다리꼴, 마름모, 정삼각형을 하나씩 섞어서 채울 수도 있어요.")
        n = M(f"정삼각형 2개 = {b('마름모 1개')},  정삼각형 3개 = {o('사다리꼴 1개')}", 36).move_to([0, -2.15, 0])
        self.say(f"정삼각형으로 마름모·사다리꼴을 만들 수 있어요", "정삼각형 2개를 붙이면 마름모, 3개를 붙이면 사다리꼴이 돼요. 그래서 여러 방법으로 채울 수 있어요.")
        self.play(FadeIn(n), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def why(self):
        self.section("가운데에 빈틈이 없는 까닭")
        c = np.array([-2.6, -0.1, 0])
        ps = pieces("tri", c, 1.7)
        self.say("정삼각형 6개가 가운데에 모여요", "정삼각형 6개가 가운데 한 점에 모여 있어요.")
        self.play(FadeIn(VGroup(*ps)), run_time=0.6)
        _, V = hexv(c, 1.7)
        arcs = VGroup(*[arc_at([c, V[k], V[(k + 1) % 6]], 0, 0.45 + 0.1 * (k % 2), ORANGE if k % 2 else BLUE) for k in range(6)])
        self.play(LaggedStart(*[Create(a) for a in arcs], lag_ratio=0.2, run_time=1.2))
        t = M(f"정삼각형의 한 각은 {o('60°')}\n60° × 6 = {g('360°')}", 42).move_to([3.1, 0.4, 0])
        self.say(f"60° × 6 = {g('360°')}, 한 바퀴", "정삼각형의 한 각은 60도예요. 6개가 모이면 60 곱하기 6, 360도로 꼭 한 바퀴가 돼서 빈틈이 생기지 않아요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
