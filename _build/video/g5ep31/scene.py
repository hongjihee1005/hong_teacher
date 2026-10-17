"""「수학 원리 돋보기」 5학년 31화 — 이상·이하·초과·미만 (5-2 1단원 2·3차시, 화 코드 5-2-1-a)

놀이기구 키 140 cm 이상: 140과 같거나 큰 수 (●, 오른쪽) / 145 이하: 같거나 작은 수 (●, 왼쪽)
110 초과: 110보다 큰 수 (○) / 64 미만: 64보다 작은 수 (○) — 기준 수가 들어가지 않음
최종: GRADE=5 ./make_final.sh 31
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from numrange import numline, rng

RED = "#C0392B"


class G5Ep31(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 31
    EP_TITLE = "이상·이하·초과·미만"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.ijang()
        self.cho()
        self.table()
        self.closing(f"{o('이상·이하')}는 기준 수를 포함해요(●)\n{b('초과·미만')}은 기준 수를 포함하지 않아요(○)",
                     next_preview="5학년 32화 · 두 조건을 함께 쓰는 수의 범위")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("키가 140 cm 이상이면 탈 수 있는 놀이기구예요.\n키가 140 cm인 친구는 탈 수 있을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("140 cm 이상", "키가 140센티미터 이상이면 탈 수 있는 놀이기구가 있어요. 키가 딱 140센티미터인 친구는 탈 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def ijang(self):
        self.section("이상과 이하")
        nl, labs = numline(136, 146, 1, 11.0, [0, 0.9, 0])
        self.play(Create(nl), FadeIn(labs), run_time=0.6)
        r = rng(nl, 140, None, True, color=ORANGE)
        t = M(f"140과 {o('같거나 큰')} 수 = 140 {o('이상')}인 수", 42).move_to([0, 2.4, 0])
        self.say(f"140과 같거나 큰 수 = 140 {o('이상')}", "140, 141, 145처럼 140과 같거나 큰 수를 140 이상인 수라고 해요. 140도 들어가니 키가 140센티미터인 친구도 탈 수 있어요.")
        self.play(FadeIn(t), Create(r), run_time=0.9)
        n = M(f"● 는 그 수가 {o('들어간다')}는 표시", 34, SOFT).move_to([0, -0.4, 0])
        self.play(FadeIn(n), run_time=0.4)
        nl2, labs2 = numline(140, 150, 1, 11.0, [0, -1.9, 0])
        r2 = rng(nl2, None, 145, True, True, color=BLUE)
        t2 = M(f"145와 {b('같거나 작은')} 수 = 145 {b('이하')}", 38).move_to([0, -0.6, 0])
        self.say(f"145와 같거나 작은 수 = 145 {b('이하')}", "143, 144, 145처럼 145와 같거나 작은 수는 145 이하인 수예요. ●에서 왼쪽으로 선을 그어요.")
        self.play(FadeOut(n), Create(nl2), FadeIn(labs2), FadeIn(t2), Create(r2), run_time=0.9)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def cho(self):
        self.section("초과와 미만")
        nl, labs = numline(106, 116, 1, 11.0, [0, 0.9, 0])
        r = rng(nl, 110, None, False, color=ORANGE)
        t = M(f"110보다 {o('큰')} 수 = 110 {o('초과')}인 수", 42).move_to([0, 2.4, 0])
        self.say(f"110보다 큰 수 = 110 {o('초과')}", "110.8, 113처럼 110보다 큰 수를 110 초과인 수라고 해요. 110은 들어가지 않아요.")
        self.play(Create(nl), FadeIn(labs), FadeIn(t), Create(r), run_time=1.0)
        n = M(f"○ 는 그 수가 {RED_T('들어가지 않는다')}는 표시", 34, SOFT).move_to([0, -0.4, 0])
        self.play(FadeIn(n), run_time=0.4)
        nl2, labs2 = numline(58, 68, 1, 11.0, [0, -1.9, 0])
        r2 = rng(nl2, None, 64, True, False, color=BLUE)
        t2 = M(f"64보다 {b('작은')} 수 = 64 {b('미만')}", 38).move_to([0, -0.6, 0])
        self.say(f"64보다 작은 수 = 64 {b('미만')}", "59, 60, 63처럼 64보다 작은 수는 64 미만인 수예요. 64는 들어가지 않으니 ○로 나타내요.")
        self.play(FadeOut(n), Create(nl2), FadeIn(labs2), FadeIn(t2), Create(r2), run_time=0.9)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def table(self):
        self.section("한눈에 정리")
        rows = [("이상", "같거나 크다", "●", ORANGE), ("이하", "같거나 작다", "●", ORANGE), ("초과", "크다", "○", BLUE), ("미만", "작다", "○", BLUE)]
        g_ = VGroup()
        for k, (a, d, s, c) in enumerate(rows):
            r = VGroup(T(a, 48, c), T(d, 40), T(s, 48, c)).arrange(RIGHT, buff=1.2)
            r[0].move_to([-3.2, 1.6 - k * 0.95, 0]); r[1].move_to([0.2, 1.6 - k * 0.95, 0]); r[2].move_to([3.4, 1.6 - k * 0.95, 0])
            g_.add(r)
        self.say(f"기준 수가 들어가면 {o('●')}, 안 들어가면 {b('○')}", "정리하면 이상과 이하는 기준 수가 들어가서 ●, 초과와 미만은 기준 수가 들어가지 않아서 ○로 나타내요.")
        self.play(LaggedStart(*[FadeIn(r) for r in g_], lag_ratio=0.3, run_time=1.6))
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
