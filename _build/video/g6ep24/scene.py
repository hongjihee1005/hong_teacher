"""「수학 원리 돋보기」 6학년 24화 — 띠그래프와 원그래프 (6-1 5단원 2차시, 화 코드 6-1-5-a)

전체에 대한 각 부분의 비율을 띠 모양에 나타낸 그래프 = 띠그래프, 원 모양에 나타낸 그래프 = 원그래프
두 그래프 모두 백분율의 합계는 100 %, 전체에 대한 각 부분의 비율을 한눈에 알아보고 비교하기 편리
(예시 자료: 좋아하는 운동 20명 — 축구 8, 피구 5, 줄넘기 4, 기타 3 → 40·25·20·15 %, 이 영상에서 정한 자료)
최종: GRADE=6 ./make_final.sh 24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from ratiograph import band, pie
from tablekit import table

PURPLE = "#7A4FB5"
ITEMS = [("축구", 40, ORANGE), ("피구", 25, BLUE), ("줄넘기", 20, GREEN), ("기타", 15, PURPLE)]


class G6Ep24(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 24
    EP_TITLE = "띠그래프와 원그래프"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.band_()
        self.pie_()
        self.closing(f"전체에 대한 각 부분의 비율을 띠 모양에 나타내면 {o('띠그래프')}\n원 모양에 나타내면 {b('원그래프')}, 백분율의 합계는 {g('100 %')}",
                     next_preview="6학년 25화 · 띠그래프·원그래프 그리기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("반 친구 20명이 좋아하는 운동을 조사했어요.\n전체에 대한 각 운동의 비율을 한눈에 보려면?", 40).move_to([0.6, 2.0, 0])
        self.say("한눈에 보려면?", "반 친구 20명이 좋아하는 운동을 조사했어요. 전체에 대한 각 운동의 비율을 한눈에 보려면 어떻게 나타내면 좋을까요?")
        self.play(Write(q), run_time=1.0)
        frame, cells = table([["운동", "축구", "피구", "줄넘기", "기타", "합계"], ["학생 수(명)", "8", "5", "4", "3", "20"]],
                             (0, 0.0), cw=1.5, hw=2.4, h=0.7, size=30)
        self.play(FadeIn(frame), *[FadeIn(c) for r in cells for c in r], run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def band_(self):
        self.section("띠그래프")
        frame, cells = table([["운동", "축구", "피구", "줄넘기", "기타", "합계"], ["백분율(%)", "40", "25", "20", "15", "100"]],
                             (0, 2.0), cw=1.5, hw=2.4, h=0.62, size=28)
        self.say("백분율로 나타내면", "학생 수를 백분율로 나타내면 축구 40 %, 피구 25 %, 줄넘기 20 %, 기타 15 %, 합계는 100 %예요.")
        self.play(FadeIn(frame), *[FadeIn(c) for r in cells for c in r], run_time=0.6)
        bd = band(ITEMS, width=10.0, height=1.1, center=(0, 0.0, 0), size=26)
        self.say(f"띠 모양에 나타내면 {o('띠그래프')}", "전체를 긴 띠로 보고 각 부분의 비율만큼 나누어 나타낸 그래프를 띠그래프라고 해요.")
        self.play(LaggedStart(*[FadeIn(s, shift=RIGHT * 0.3) for s in bd.segs], lag_ratio=0.3, run_time=1.4), FadeIn(bd.labs))
        t = M(f"띠 전체 = {g('100 %')}", 36).move_to([0, -1.3, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.play(Indicate(bd.segs[0], color=ORANGE, scale_factor=1.05), run_time=0.6)
        self.say(f"축구가 {o('가장 많아요')}", "띠의 길이를 보면 축구가 가장 넓어서 가장 많은 학생이 좋아한다는 것을 한눈에 알 수 있어요.")
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)

    def pie_(self):
        self.section("원그래프")
        bd = band(ITEMS, width=10.0, height=1.1, center=(0, 1.9, 0), size=26)
        self.play(FadeIn(bd), run_time=0.4)
        pc = pie(ITEMS, r=1.75, center=(0, -0.5, 0), size=26)
        self.say(f"원 모양에 나타내면 {b('원그래프')}", "같은 자료를 원 모양에 나누어 나타낼 수도 있어요. 이것을 원그래프라고 해요.")
        self.play(*[ReplacementTransform(bd.segs[k].copy(), pc.segs[k]) for k in range(4)], run_time=1.6)
        self.play(FadeIn(pc.labs), run_time=0.5)
        t1 = M(f"원 전체 = {g('100 %')}", 34).move_to([4.6, -0.2, 0])
        t2 = M("각 부분의 비율을\n한눈에 비교해요", 30).move_to([4.6, -1.2, 0])
        self.say(f"합계는 언제나 {g('100 %')}", "띠그래프와 원그래프는 모두 백분율의 합계가 100 %예요. 전체에 대한 각 부분의 비율을 한눈에 알아보고 비교하기 편리해요.")
        self.play(FadeIn(t1), FadeIn(t2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
