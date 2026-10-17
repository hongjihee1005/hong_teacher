"""「수학 원리 돋보기」 5학년 54화 — 직육면체의 성질 (5-2 5단원 4차시, 화 코드 5-2-5-c)

계속 늘여도 만나지 않는 두 면 = 서로 평행, 이 두 면 = 밑면 / 평행한 면은 3쌍(앞·뒤, 위·아래, 왼·오른)
밑면과 만나는 면 = 옆면, 밑면과 옆면은 수직 / 한 면과 수직인 면은 4개
최종: GRADE=5 ./make_final.sh 54
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cuboid import Cuboid
from shapes import PURPLE, right_mark

RED = "#C0392B"


class G5Ep54(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 54
    EP_TITLE = "직육면체의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.parallel()
        self.perp()
        self.closing(f"직육면체에서 서로 {o('평행한 면')}은 3쌍, 이 두 면이 {b('밑면')}\n밑면과 옆면은 {g('수직')}, 한 면과 수직인 면은 4개",
                     next_preview="5학년 55화 · 정육면체의 전개도")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("직육면체에서 마주 보는 면과\n서로 만나는 면은 어떤 관계일까요?", 44).move_to([0.6, 1.9, 0])
        cb = Cuboid(3.0, 1.8, 2.4, [0, -0.8, 0])
        self.say("마주 보는 면, 만나는 면", "직육면체에서 마주 보는 면과 서로 만나는 면은 어떤 관계일까요?")
        self.play(Write(q), FadeIn(VGroup(cb.face("front", ORANGE, 0.3), cb.edges())), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def parallel(self):
        self.section("마주 보는 면")
        cb = Cuboid(3.4, 2.0, 2.6, [-3.0, 0.3, 0])
        ed = cb.edges()
        self.play(Create(ed), run_time=0.7)
        top, bot = cb.face("top", ORANGE, 0.55), cb.face("bottom", ORANGE, 0.55)
        self.say(f"위와 아래 면은 {o('만나지 않아요')}", "위의 면과 아래의 면은 아무리 늘여도 만나지 않아요. 이런 두 면을 서로 평행하다고 해요.")
        self.play(FadeIn(top), FadeIn(bot), run_time=0.7)
        t1 = M(f"계속 늘여도 만나지 않는 두 면\n= 서로 {o('평행')}, 이 두 면 = {o('밑면')}", 36).move_to([3.3, 1.5, 0])
        self.play(FadeIn(t1), run_time=0.5)
        fr, bk = cb.face("front", BLUE, 0.45), cb.face("back", BLUE, 0.45)
        lf, rt = cb.face("left", GREEN, 0.45), cb.face("right", GREEN, 0.45)
        self.say(f"평행한 면은 {g('3쌍')}", "앞과 뒤, 왼쪽과 오른쪽도 서로 평행해요. 평행한 면은 모두 3쌍이고, 어느 쌍이든 밑면이 될 수 있어요.")
        self.play(FadeOut(top), FadeOut(bot), FadeIn(fr), FadeIn(bk), run_time=0.7)
        self.play(FadeOut(fr), FadeOut(bk), FadeIn(lf), FadeIn(rt), run_time=0.7)
        t2 = M(f"평행한 면은 {g('3쌍')}", 42).move_to([3.3, 0.0, 0])
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def perp(self):
        self.section("밑면과 옆면")
        cb = Cuboid(3.4, 2.0, 2.6, [-3.0, 0.3, 0])
        ed = cb.edges()
        bot = cb.face("bottom", ORANGE, 0.6)
        self.play(Create(ed), FadeIn(bot), run_time=0.7)
        sides = VGroup(cb.face("front", BLUE, 0.35), cb.face("right", BLUE, 0.35), cb.face("back", BLUE, 0.25), cb.face("left", BLUE, 0.25))
        t1 = M(f"밑면과 만나는 면 = {b('옆면')}", 38).move_to([3.3, 1.6, 0])
        self.say(f"밑면과 만나는 면이 {b('옆면')}", "아래 면을 밑면이라고 하면, 밑면과 만나는 네 면을 옆면이라고 해요.")
        self.play(LaggedStart(*[FadeIn(s) for s in sides], lag_ratio=0.3, run_time=1.2), FadeIn(t1))
        rm = right_mark(cb.v[1], cb.v[0] - cb.v[1], cb.v[2] - cb.v[1], 0.28, color=RED)
        t2 = M(f"밑면과 옆면은 {g('수직')}", 40).move_to([3.3, 0.5, 0])
        self.say(f"밑면과 옆면은 {g('수직')}으로 만나요", "삼각자를 대어 보면 밑면과 옆면은 직각으로, 수직으로 만나요.")
        self.play(Create(rm), FadeIn(t2), run_time=0.7)
        t3 = M(f"한 면과 수직인 면은 {o('4개')}", 40).move_to([3.3, -0.6, 0])
        self.say(f"한 면과 수직인 면은 {o('4개')}", "그래서 한 면과 수직으로 만나는 면은 4개예요. 마주 보는 면 하나만 빼고 모두 수직이에요.")
        self.play(FadeIn(t3), Indicate(sides, color=BLUE), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
