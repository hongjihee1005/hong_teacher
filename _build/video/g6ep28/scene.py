"""「수학 원리 돋보기」 6학년 28화 — 부피와 1 cm³ (6-1 6단원 2차시, 화 코드 6-1-6-a)

부피: 어떤 물건이 공간에서 차지하는 크기
면끼리 맞대어 비교하기 어려운 상자 → 모양과 크기가 같은 쌓기나무로 똑같이 쌓아 그 수를 세어 비교
쓰는 물건에 따라 개수가 달라지므로 한 가지 단위: 한 모서리 1 cm인 정육면체의 부피 = 1 cm³ (1 세제곱센티미터)
(예시: 가 상자 4×2×3 = 24개, 나 상자 3×3×3 = 27개 — 이 영상에서 정한 크기)
최종: GRADE=6 ./make_final.sh 28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cubes import box_cells, cube, stack
from cuboid import Cuboid


class G6Ep28(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 28
    EP_TITLE = "부피와 1 cm³"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.count()
        self.unit()
        self.closing(f"{o('부피')}는 물건이 공간에서 차지하는 크기\n한 모서리가 1 cm인 정육면체의 부피가 {g('1 cm³')} (1 세제곱센티미터)",
                     next_preview="6학년 29화 · 직육면체의 부피")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("두 상자 중 어느 상자가 더 많은 공간을 차지할까요?", 44).move_to([0.6, 2.2, 0])
        self.say("어느 상자가 더 클까요?", "모양이 다른 두 상자가 있어요. 어느 상자가 더 많은 공간을 차지할까요?")
        self.play(Write(q), run_time=0.8)
        a = Cuboid(2.4, 1.8, 1.2 * 2, (-3.0, -0.3, 0))
        b_ = Cuboid(1.8, 1.8, 1.8 * 2, (2.6, -0.3, 0))
        self.play(Create(a.edges(show_hidden=False)), Create(b_.edges(show_hidden=False)), run_time=0.9)
        self.play(FadeIn(T("가", 32).move_to([-3.0, -1.9, 0])), FadeIn(T("나", 32).move_to([2.6, -1.9, 0])), run_time=0.3)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def count(self):
        self.section("쌓기나무로 세어 보기")
        ga = stack(box_cells(4, 3, 2), s=0.55, center=(-3.2, 0.6, 0))
        gb = stack(box_cells(3, 3, 3), s=0.55, center=(2.8, 0.6, 0), color="#7C9CC9")
        self.say("같은 쌓기나무로 채워요", "면끼리 맞대어 비교하기 어려우면 모양과 크기가 같은 쌓기나무로 두 상자를 똑같이 채워 세어 봐요.")
        self.play(LaggedStart(*[FadeIn(c) for c in ga], lag_ratio=0.03, run_time=1.4), LaggedStart(*[FadeIn(c) for c in gb], lag_ratio=0.03, run_time=1.4))
        la = M(f"가: 4 × 2 × 3 = {o('24개')}", 36).move_to([-3.2, -1.3, 0])
        lb = M(f"나: 3 × 3 × 3 = {b('27개')}", 36).move_to([2.8, -1.3, 0])
        self.say(f"가 {o('24개')}, 나 {b('27개')}", "가 상자에는 24개, 나 상자에는 27개가 들어가요. 나 상자의 부피가 더 커요.")
        self.play(FadeIn(la), FadeIn(lb), run_time=0.6)
        t = M(f"{o('부피')}: 물건이 공간에서 차지하는 크기", 36).move_to([0, 2.5, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def unit(self):
        self.section("1 cm³")
        q = M("쌓기나무 크기가 다르면 개수도 달라져요 → 한 가지 단위가 필요해요", 34).move_to([0, 2.4, 0])
        self.say("단위가 필요해요", "그런데 쓰는 쌓기나무의 크기가 다르면 개수도 달라져요. 그래서 모두가 같이 쓰는 단위가 필요해요.")
        self.play(FadeIn(q), run_time=0.5)
        c = stack([(0, 0, 0)], s=1.7, center=(-3.6, 0.3, 0), color="#F2C14E")
        self.play(FadeIn(c), run_time=0.5)
        f = c[0][0]
        br1 = Brace(f, DOWN, color=INK)
        t1 = T("1 cm", 28).next_to(br1, DOWN, buff=0.08)
        br2 = Brace(f, LEFT, color=INK)
        t2 = T("1 cm", 28).next_to(br2, LEFT, buff=0.08)
        self.play(FadeIn(br1), FadeIn(t1), FadeIn(br2), FadeIn(t2), run_time=0.5)
        d = M(f"한 모서리가 1 cm인\n정육면체의 부피 = {g('1 cm³')}", 38).move_to([2.6, 0.9, 0])
        r = M("1 세제곱센티미터라고 읽어요", 30, SOFT).move_to([2.6, -0.2, 0])
        self.say(f"부피의 단위 {g('1 cm³')}", "한 모서리의 길이가 1 cm인 정육면체의 부피를 1 cm³라 쓰고, 1 세제곱센티미터라고 읽어요.")
        self.play(FadeIn(d), run_time=0.6)
        self.play(FadeIn(r), run_time=0.4)
        e = M(f"가 상자의 부피 = {o('24 cm³')}", 36).move_to([2.6, -1.2, 0])
        self.say(f"쌓기나무가 1 cm³라면 가 상자는 {o('24 cm³')}", "1 cm³ 쌓기나무 24개가 들어가는 상자의 부피는 24 cm³예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
