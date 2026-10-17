"""「수학 원리 돋보기」 6학년 27화 — 비율이 같으면 실제 양도 같을까? (6-1 5단원 8~9차시 생각을 더하다, 화 코드 6-1-5-d)

띠그래프와 원그래프는 비율을 나타냄. 전체의 양이 다르면 비율이 같아도 실제 양은 다를 수 있고,
비율이 늘어나도 전체의 양이 줄면 실제 양은 줄 수 있음 → 그래프와 표를 함께 보고 판단
(예시 수: 가 학교 200명·나 학교 500명의 30 % / 작년 400명의 25 %, 올해 300명의 30 % — 이 영상에서 정한 수)
최종: GRADE=6 ./make_final.sh 27
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from ratiograph import pie

GRAY = "#CFC6B0"


class G6Ep27(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 27
    EP_TITLE = "비율이 같으면 실제 양도 같을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.same_ratio()
        self.more_ratio()
        self.closing(f"그래프는 {o('비율')}을 나타내요. 전체의 양이 다르면\n비율이 같아도 {b('실제 양은 다를 수')} 있어요 → {g('표와 함께')} 보고 판단해요",
                     next_preview="6학년 28화 · 부피와 1 cm³")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가 학교와 나 학교 모두 걸어서 등교하는 학생이 30 %예요.\n걸어서 등교하는 학생 수도 같을까요?", 40).move_to([0.6, 1.6, 0])
        self.say("학생 수도 같을까요?", "가 학교와 나 학교 모두 걸어서 등교하는 학생이 30 %예요. 걸어서 등교하는 학생 수도 같을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def same_ratio(self):
        self.section("전체가 다르면")
        p1 = pie([("걸어서", 30, ORANGE), ("그 밖", 70, GRAY)], r=1.15, center=(-3.4, 0.9, 0), size=24)
        p2 = pie([("걸어서", 30, ORANGE), ("그 밖", 70, GRAY)], r=1.85, center=(2.6, 0.6, 0), size=26)
        l1 = M(f"가 학교 {b('200명')}", 32).next_to(p1, DOWN, buff=0.25)
        l2 = M(f"나 학교 {b('500명')}", 32).next_to(p2, DOWN, buff=0.25)
        self.say("두 학교 모두 30 %", "두 원그래프 모두 걸어서 등교하는 학생이 30 %예요. 하지만 가 학교는 전체 200명, 나 학교는 전체 500명이에요.")
        self.play(FadeIn(p1), FadeIn(p2), run_time=0.7)
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.5)
        e1 = M(f"200 × 0.3 = {o('60명')}", 34).next_to(l1, DOWN, buff=0.2)
        e2 = M(f"500 × 0.3 = {o('150명')}", 34).next_to(l2, DOWN, buff=0.2)
        self.say(f"60명과 {o('150명')}", "실제 학생 수는 200의 30 %인 60명과 500의 30 %인 150명으로 달라요.")
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def more_ratio(self):
        self.section("비율이 늘었는데?")
        p1 = pie([("우유", 25, BLUE), ("그 밖", 75, GRAY)], r=1.5, center=(-3.2, 0.8, 0), size=24)
        p2 = pie([("우유", 30, BLUE), ("그 밖", 70, GRAY)], r=1.3, center=(2.6, 0.8, 0), size=24)
        l1 = M(f"작년: 전체 {b('400명')}의 25 %", 30).next_to(p1, DOWN, buff=0.25)
        l2 = M(f"올해: 전체 {b('300명')}의 30 %", 30).next_to(p2, DOWN, buff=0.25)
        self.say("우유를 고른 비율이 늘었어요", "우유를 고른 학생의 비율이 작년 25 %에서 올해 30 %로 늘었어요. 우유를 고른 학생 수도 늘었을까요?")
        self.play(FadeIn(p1), FadeIn(p2), FadeIn(l1), FadeIn(l2), run_time=0.7)
        e1 = M(f"400 × 0.25 = {o('100명')}", 32).next_to(l1, DOWN, buff=0.2)
        e2 = M(f"300 × 0.3 = {o('90명')}", 32).next_to(l2, DOWN, buff=0.2)
        self.say(f"100명 → {o('90명')}, 오히려 줄었어요", "작년은 400의 25 %인 100명, 올해는 300의 30 %인 90명이에요. 전체가 줄어서 비율이 늘었는데도 실제 학생 수는 줄었어요.")
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
