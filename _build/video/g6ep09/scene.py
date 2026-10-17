"""「수학 원리 돋보기」 6학년 9화 — 각뿔이란? (6-1 2단원 7차시, 화 코드 6-1-2-d)

한 개의 다각형을 옆으로 둘러싼 면이 모두 삼각형인 입체도형 = 각뿔
밑면(한 개의 다각형), 밑면과 만나는 면 = 옆면(모두 삼각형), 밑면의 변의 수 = 옆면의 수
각기둥과 견주기: 각기둥은 밑면 2개·옆면 직사각형, 각뿔은 밑면 1개·옆면 삼각형
최종: GRADE=6 ./make_final.sh 9
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from solid import prism, pyramid, regular


class G6Ep09(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 9
    EP_TITLE = "각뿔이란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.faces()
        self.compare()
        self.closing(f"밑면이 {o('다각형 1개')}이고 옆면이 모두 {b('삼각형')}인 입체도형이 {g('각뿔')}\n밑면의 변의 수와 옆면의 수는 같아요",
                     next_preview="6학년 10화 · 각뿔의 이름과 구성 요소")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("이 입체도형들은 각기둥과 무엇이 다를까요?", 46).move_to([0.6, 2.2, 0])
        self.say("각기둥과 무엇이 다를까요?", "피라미드처럼 생긴 입체도형들이에요. 각기둥과 무엇이 다를까요?")
        self.play(Write(q), run_time=0.8)
        sol = VGroup(*[pyramid(regular(n, 0.95), 1.9, center=(x, -0.2, 0)).edges(width=4) for n, x in [(3, -4.5), (4, -1.5), (5, 1.5), (6, 4.5)]])
        self.play(LaggedStart(*[FadeIn(s) for s in sol], lag_ratio=0.2, run_time=1.0))
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def faces(self):
        self.section("밑면과 옆면")
        s = pyramid(regular(4, 1.8), 3.2, center=(-2.8, 0.1, 0))
        self.say("사각뿔을 살펴봐요", "사각형 하나와 삼각형들로 둘러싸인 입체도형을 살펴볼게요.")
        self.play(Create(s.edges()), run_time=1.0)
        base = s.face(0, ORANGE, 0.55)
        t1 = M(f"아래 다각형 1개 = {o('밑면')}", 36).move_to([3.3, 1.6, 0])
        self.say(f"다각형 하나가 {o('밑면')}", "각뿔에서 이 사각형과 같은 면을 밑면이라고 해요. 밑면은 1개예요.")
        self.play(FadeIn(base), FadeIn(t1), run_time=0.6)
        sides = VGroup(*[s.face(k, BLUE, 0.45) for k in range(1, 5) if s.vis[k]])
        t2 = M(f"밑면과 만나는 면 = {b('옆면')}", 36).move_to([3.3, 0.6, 0])
        self.say(f"밑면과 만나는 면이 {b('옆면')}, 모두 삼각형", "밑면과 만나는 면을 옆면이라고 해요. 각뿔의 옆면은 모두 삼각형이고, 한 점에서 만나요.")
        self.play(LaggedStart(*[FadeIn(f) for f in sides], lag_ratio=0.3, run_time=1.0), FadeIn(t2))
        t3 = M(f"밑면의 변 {o('4개')} = 옆면 {b('4개')}", 36).move_to([3.3, -0.4, 0])
        self.say(f"밑면의 변의 수 = {b('옆면의 수')}", "밑면의 변마다 옆면이 하나씩 붙어 있어서, 밑면의 변의 수와 옆면의 수는 같아요.")
        self.play(FadeIn(t3), run_time=0.5)
        d = M(f"이런 입체도형 = {g('각뿔')}", 40).move_to([3.3, -1.5, 0])
        self.play(FadeIn(d), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("각기둥과 각뿔")
        a = prism(regular(5, 1.3), 2.4, center=(-3.4, 0.8, 0))
        p = pyramid(regular(5, 1.3), 2.6, center=(3.0, 0.8, 0))
        ga = VGroup(a.face(0, ORANGE, 0.45), a.face(1, ORANGE, 0.6), a.edges(width=4))
        gp = VGroup(p.face(0, ORANGE, 0.45), p.edges(width=4))
        self.say("오각기둥과 오각뿔", "오각기둥과 오각뿔을 나란히 놓고 견주어 볼게요.")
        self.play(FadeIn(ga), FadeIn(gp), run_time=0.7)
        la = VGroup(M(f"밑면 {o('2개')}", 34), M(f"옆면 {b('직사각형')}", 34)).arrange(DOWN, buff=0.2).move_to([-3.4, -1.3, 0])
        lp = VGroup(M(f"밑면 {o('1개')}", 34), M(f"옆면 {b('삼각형')}", 34)).arrange(DOWN, buff=0.2).move_to([3.0, -1.3, 0])
        self.say(f"밑면은 {o('2개')}와 {o('1개')}, 옆면은 {b('직사각형')}과 {b('삼각형')}", "각기둥은 밑면이 2개이고 옆면이 직사각형이에요. 각뿔은 밑면이 1개이고 옆면이 삼각형이에요.")
        self.play(FadeIn(la), run_time=0.5)
        self.play(FadeIn(lp), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
