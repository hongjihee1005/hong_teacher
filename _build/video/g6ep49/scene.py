"""「수학 원리 돋보기」 6학년 49화 — 층별로 나타내기 (6-2 3단원 6차시, 화 코드 6-2-3-e)

쌓기나무로 만든 모양을 1층, 2층, 3층으로 나누어 각 층을 위에서 본 모양으로 나타냄 → 모양이 한 가지로 정해짐
1층 모양 = 위에서 본 모양, 위층에 쌓으려면 바로 아래층의 같은 자리에 쌓기나무가 있어야 함
(예시 모양: 47·48화와 같은 모양 — 1층 5개, 2층 2개, 3층 1개)
최종: GRADE=6 ./make_final.sh 49
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cubes import flat, heights_cells, stack

H = {(0, 0): 1, (1, 0): 2, (2, 0): 1, (0, 1): 3, (1, 1): 1}
LC = ["#F2C14E", "#7C9CC9", "#6FBF8E"]


def layer(k):
    return [(x, z) for (x, z), h in H.items() if h > k]


class G6Ep49(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 49
    EP_TITLE = "층별로 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.layers()
        self.closing(f"쌓은 모양을 {o('1층, 2층, 3층')}으로 나누어 위에서 본 모양으로 그려요\n1층은 {b('위에서 본 모양')}과 같고, 위층은 {g('아래층 같은 자리')} 위에만",
                     next_preview="6학년 50화 · 비의 성질")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("쌓은 모양을 층마다 나누어 그리면\n어떤 모양일까요?", 44).move_to([0.6, 2.2, 0])
        self.say("층마다 나누어 그리면?", "쌓기나무로 쌓은 모양을 1층, 2층, 3층으로 나누어 그리면 각 층은 어떤 모양일까요?")
        self.play(Write(q), run_time=0.9)
        cells = heights_cells(H)
        st = stack(cells, s=0.7, center=(0, -0.5, 0), colors={c: LC[c[1]] for c in cells})
        self.play(FadeIn(st), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def layers(self):
        self.section("한 층씩 떼어 보기")
        cells = heights_cells(H)
        st = stack(cells, s=0.62, center=(-4.4, 0.5, 0), colors={c: LC[c[1]] for c in cells})
        self.play(FadeIn(st), run_time=0.4)
        xs = [-1.2, 1.6, 4.4]
        names = ["1층", "2층", "3층"]
        narr = ["1층은 바닥에 놓인 쌓기나무예요. 위에서 본 모양과 같아요. 5개예요.",
                "2층은 2층에 놓인 쌓기나무만 그려요. 2개예요. 2층 쌓기나무 아래에는 반드시 1층 쌓기나무가 있어요.",
                "3층에는 1개가 있어요."]
        cnt = [5, 2, 1]
        for k in range(3):
            fl = flat(layer(k), s=0.55, center=(xs[k], 0.4, 0), color=LC[k], frame=(3, 2))
            lab = M(f"<span foreground='{LC[k]}'><b>{names[k]}</b></span>  {cnt[k]}개", 32).next_to(fl, UP, buff=0.2)
            self.say(f"{names[k]}: {cnt[k]}개", narr[k])
            self.play(FadeIn(fl), FadeIn(lab), run_time=0.6)
        r = M(f"5 + 2 + 1 = {g('8')}(개)", 40).move_to([1.6, -1.0, 0])
        self.say(f"모두 {g('8개')}", "층별 개수를 모두 더하면 5 더하기 2 더하기 1, 8개예요.")
        self.play(FadeIn(r), run_time=0.5)
        t = M(f"층별로 나타내면 모양이 {b('한 가지로')} 정해져요", 34).move_to([1.6, -1.8, 0])
        self.say(f"모양이 {b('한 가지')}로 정해져요", "층별로 나타낸 대로 만들면 모양이 한 가지로만 만들어지고, 각 층의 모양과 개수를 정확하게 알 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
