"""「수학 원리 돋보기」 4학년 24화 — 막대그래프로 무엇을 판단할까? (4-1 5단원 7차시, 화 코드 4-1-5-c)

가장 많은 것·가장 적은 것, 늘어나거나 줄어드는 모습(통계적 사실) → 사실을 근거로 의견·결정
최종: GRADE=4 ./make_final.sh 24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowFromEdge, Indicate, LaggedStart,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from chart import Chart

MONTHS = ["3월", "4월", "5월", "6월", "7월"]
TRASH = [36, 30, 24, 20, 14]
ITEMS = ["떡볶이", "김밥", "샐러드", "주먹밥"]
VOTE = [12, 7, 3, 9]


class G4Ep24(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 24
    EP_TITLE = "막대그래프로 무엇을 판단할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.facts()
        self.decide()
        self.closing(f"막대그래프에서 {o('사실')}을 찾고\n그 사실을 {g('근거')}로 의견을 말하거나 결정해요",
                     next_preview="4학년 25화 · 수의 배열에서 규칙 찾기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("학교 쓰레기양이 어떻게 바뀌었을까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        ch = Chart(MONTHS, vmax=40, step=5, origin=[-4.6, -1.75, 0], w=9.2, h=3.0, ylab="(kg)", tick_every=2)
        bars = ch.bars(TRASH, color=ORANGE)
        self.say("달마다 모은 쓰레기양", "환경 보호 실천 학교에서 달마다 버린 쓰레기양을 막대그래프로 나타냈어요. 무엇을 알 수 있을까요?")
        self.play(Write(q), FadeIn(ch.axes_group), run_time=1.0)
        self.play(LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.2, run_time=1.4))
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def facts(self):
        self.section("사실 찾기")
        ch = Chart(MONTHS, vmax=40, step=5, origin=[-5.6, -1.75, 0], w=7.0, h=3.4, ylab="(kg)", tick_every=2)
        bars = ch.bars(TRASH, color=ORANGE)
        self.play(FadeIn(ch.axes_group), FadeIn(bars), run_time=0.6)
        lines = [
            (f"3월이 {o('가장 많아요')} (36 kg)", "3월이 36킬로그램으로 가장 많아요.", 0),
            (f"7월이 {o('가장 적어요')} (14 kg)", "7월이 14킬로그램으로 가장 적어요.", 4),
            (f"달마다 {g('줄어들고')} 있어요", "막대가 달마다 짧아져요. 쓰레기양이 계속 줄어들고 있어요.", None),
        ]
        ms = VGroup()
        for k, (mk, nar, idx) in enumerate(lines):
            m = M(mk, 38)
            m.scale_to_fit_width(min(m.width, 4.6)).move_to([1.9, 1.2 - k * 0.9, 0], aligned_edge=LEFT)
            ms.add(m)
            self.say(mk, nar)
            anims = [FadeIn(m, shift=LEFT * 0.2)]
            if idx is not None:
                anims.append(Indicate(bars[idx], color=GREEN, scale_factor=1.08))
            else:
                anims.append(LaggedStart(*[Indicate(b, color=GREEN, scale_factor=1.05) for b in bars], lag_ratio=0.15))
            self.play(*anims, run_time=1.0)
        op = M(f"의견: 분리배출이 {g('효과가 있었어요')}", 40).move_to([0.6, 2.4, 0])
        self.say("사실을 근거로 의견을 말해요", "이 사실을 근거로, 우리 학교의 분리배출과 쓰레기 줄이기 활동이 효과가 있었다고 의견을 말할 수 있어요.")
        self.play(FadeIn(op), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def decide(self):
        self.section("결정하기")
        q = M("축제 간식은 무엇으로 정할까요?", 44).move_to([0.6, 2.3, 0])
        ch = Chart(ITEMS, vmax=14, step=2, origin=[-5.6, -1.75, 0], w=7.0, h=3.0, ylab="(명)")
        bars = ch.bars(VOTE)
        self.say("반 친구들이 좋아하는 간식", "가정의 달 축제 간식을 정하려고 반 친구들이 좋아하는 간식을 조사했어요.")
        self.play(FadeIn(q), FadeIn(ch.axes_group), run_time=0.6)
        self.play(LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.2, run_time=1.2))
        a = M(f"가장 많은 {o('떡볶이')}를 준비해요", 38)
        a.scale_to_fit_width(min(a.width, 4.8)).move_to([1.9, 0.6, 0], aligned_edge=LEFT)
        b_ = M(f"샐러드는 {g('조금만')}", 38).move_to([1.9, -0.4, 0], aligned_edge=LEFT)
        self.say(f"가장 많은 {o('떡볶이')}로 결정", "떡볶이를 좋아하는 친구가 12명으로 가장 많으니 떡볶이를 준비하고, 샐러드는 3명이니 조금만 준비하면 좋겠어요.")
        self.play(Indicate(bars[0], color=ORANGE, scale_factor=1.08), FadeIn(a), run_time=0.8)
        self.play(Indicate(bars[2], color=GREEN, scale_factor=1.08), FadeIn(b_), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
