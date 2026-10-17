"""「수학 원리 돋보기」 6학년 48화 — 위에서 본 모양에 수 쓰기 (6-2 3단원 5차시, 화 코드 6-2-3-d)

위에서 본 모양의 각 자리에 그 자리에 쌓인 쌓기나무의 개수를 씀 → 모양이 한 가지로만 만들어짐
필요한 쌓기나무의 개수 = 위에서 본 모양에 쓴 수를 모두 더한 것
앞과 옆에서 본 모양은 각 방향의 각 줄에 쓰여 있는 가장 큰 수만큼 칸을 칠함
(예시 모양: 47화와 같은 모양, 수 1·2·1 / 3·1 → 8개)
최종: GRADE=6 ./make_final.sh 48
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cubes import flat, front_view, heights_cells, side_view, stack, top_view

H = {(0, 0): 1, (1, 0): 2, (2, 0): 1, (0, 1): 3, (1, 1): 1}
VC = "#7C9CC9"


class G6Ep48(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 48
    EP_TITLE = "위에서 본 모양에 수 쓰기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.numbers()
        self.views()
        self.closing(f"위에서 본 모양에 {o('쌓인 개수')}를 쓰면 모양이 한 가지로 정해져요\n쌓기나무의 개수 = {g('쓴 수를 모두 더한 것')}",
                     next_preview="6학년 49화 · 층별로 나타내기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("쌓은 모양을 한 가지로 정확하게 알려 주려면\n어떻게 나타내면 좋을까요?", 42).move_to([0.6, 2.2, 0])
        self.say("정확하게 알려 주려면?", "쌓기나무로 쌓은 모양을 친구에게 한 가지로 정확하게 알려 주려면 어떻게 나타내면 좋을까요?")
        self.play(Write(q), run_time=0.9)
        st = stack(heights_cells(H), s=0.7, center=(0, -0.5, 0))
        self.play(FadeIn(st), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def numbers(self):
        self.section("자리마다 개수 쓰기")
        st = stack(heights_cells(H), s=0.7, center=(-3.4, 0.4, 0))
        self.play(FadeIn(st), run_time=0.4)
        tv = flat(top_view(H), s=0.85, center=(2.6, 0.6, 0), color="#E8DDBE", frame=(3, 2))
        lt = T("위에서 본 모양", 26, SOFT).next_to(tv, UP, buff=0.15)
        self.say("위에서 본 모양에", "위에서 본 모양을 그리고, 각 자리에 그 자리에 쌓인 쌓기나무의 개수를 써요.")
        self.play(FadeIn(tv), FadeIn(lt), run_time=0.5)
        ox, oy = 2.6 - 0.85, 0.6 - 0.425
        nums = VGroup()
        for (x, z), h in sorted(H.items(), key=lambda kv: (kv[0][1], kv[0][0])):
            nums.add(T(str(h), 40, ORANGE).move_to([ox + x * 0.85, oy + z * 0.85, 0]))
        self.play(LaggedStart(*[FadeIn(n, scale=1.5) for n in nums], lag_ratio=0.25, run_time=1.2))
        t1 = M(f"모양이 {b('한 가지로')} 정해져요", 34).move_to([2.6, -1.0, 0])
        self.say(f"모양이 {b('한 가지')}로 정해져요", "자리마다 몇 개가 쌓였는지 모두 알 수 있으니 모양이 한 가지로만 만들어져요.")
        self.play(FadeIn(t1), run_time=0.5)
        t2 = M(f"1 + 2 + 1 + 3 + 1 = {g('8')}(개)", 38).move_to([0, -1.9, 0])
        self.say(f"쓴 수를 모두 더하면 {g('8개')}", "필요한 쌓기나무의 개수는 쓴 수를 모두 더한 것과 같아요. 1 더하기 2 더하기 1 더하기 3 더하기 1, 8개예요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def views(self):
        self.section("앞과 옆에서 본 모양 그리기")
        s = 0.7
        tv = flat(top_view(H), s=s, center=(-3.6, 0.2, 0), color="#E8DDBE", frame=(3, 2))
        ox, oy = -3.6 - s, 0.2 - s / 2
        nums = VGroup(*[T(str(h), 34, ORANGE).move_to([ox + x * s, oy + z * s, 0]) for (x, z), h in H.items()])
        self.play(FadeIn(tv), FadeIn(nums), run_time=0.5)
        cols = VGroup(*[SurroundingRectangle(VGroup(*[n for n, ((x, z), _) in zip(nums, H.items()) if x == c]), color=BLUE, buff=0.12, stroke_width=4) for c in range(3)])
        fv = flat(front_view(H), s=0.55, center=(1.0, 0.4, 0), color=VC)
        lf = M(f"{b('앞')}에서 본 모양\n3 · 2 · 1", 26).next_to(fv, DOWN, buff=0.25)
        self.say(f"{b('앞')}에서 본 모양: 줄마다 {b('가장 큰 수')}", "앞에서 본 모양은 세로줄마다 쓰인 가장 큰 수만큼 칸을 칠해요. 왼쪽 줄은 1과 3 중 3, 가운데 줄은 2, 오른쪽 줄은 1이에요.")
        self.play(Create(cols), run_time=0.6)
        self.play(FadeIn(fv), FadeIn(lf), run_time=0.6)
        self.play(FadeOut(cols), run_time=0.3)
        rows = VGroup(*[SurroundingRectangle(VGroup(*[n for n, ((x, z), _) in zip(nums, H.items()) if z == r]), color=GREEN, buff=0.12, stroke_width=4) for r in range(2)])
        sv = flat(side_view(H), s=0.55, center=(4.6, 0.4, 0), color=VC)
        ls = M(f"{g('옆')}에서 본 모양\n2 · 3", 26).next_to(sv, DOWN, buff=0.25)
        self.say(f"{g('옆')}에서 본 모양: 앞줄 2, 뒷줄 3", "옆에서 본 모양은 가로줄마다 가장 큰 수만큼 칠해요. 앞줄은 2, 뒷줄은 3이에요.")
        self.play(Create(rows), run_time=0.6)
        self.play(FadeIn(sv), FadeIn(ls), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
