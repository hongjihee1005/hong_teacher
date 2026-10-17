"""「수학 원리 돋보기」 6학년 26화 — 그래프 해석하기 (6-1 5단원 6차시, 화 코드 6-1-5-c)

띠그래프·원그래프에서 비율이 가장 높은(낮은) 항목, 비율이 같은 항목, 몇 배인지 등을 알 수 있음
두 그래프를 함께 보면 연도끼리 비율을 견줄 수 있음
(예시 자료: 좋아하는 간식 2024년 과일 30·빵 35·떡 20·기타 15 %, 2025년 과일 40·빵 25·떡 20·기타 15 % — 이 영상에서 정한 자료)
최종: GRADE=6 ./make_final.sh 26
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from ratiograph import band

PURPLE = "#7A4FB5"
Y24 = [("과일", 30, ORANGE), ("빵", 35, BLUE), ("떡", 20, GREEN), ("기타", 15, PURPLE)]
Y25 = [("과일", 40, ORANGE), ("빵", 25, BLUE), ("떡", 20, GREEN), ("기타", 15, PURPLE)]


class G6Ep26(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 26
    EP_TITLE = "그래프 해석하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.read_one()
        self.compare()
        self.closing(f"띠그래프·원그래프에서 {o('가장 높은 항목')}, {b('같은 항목')}, {g('몇 배')}인지 읽어요\n두 그래프를 함께 보면 해마다 어떻게 바뀌었는지 알 수 있어요",
                     next_preview="6학년 27화 · 비율이 같으면 실제 양도 같을까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("좋아하는 간식을 조사한 띠그래프예요.\n어떤 사실을 알 수 있을까요?", 42).move_to([0.6, 1.8, 0])
        self.say("무엇을 알 수 있을까요?", "우리 학교 학생들이 좋아하는 간식을 조사한 띠그래프예요. 어떤 사실을 알 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        bd = band(Y25, width=10.0, height=1.0, center=(0, -0.3, 0), size=26)
        self.play(FadeIn(bd), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def read_one(self):
        self.section("한 그래프 읽기")
        bd = band(Y25, width=10.0, height=1.1, center=(0, 1.8, 0), size=26)
        lab = T("2025년", 28, SOFT).next_to(bd, UP, buff=0.15).align_to(bd, LEFT)
        self.play(FadeIn(bd), FadeIn(lab), run_time=0.5)
        r1 = SurroundingRectangle(bd.segs[0], color=ORANGE, buff=0.06, stroke_width=6)
        t1 = M(f"가장 높은 항목: {o('과일 40 %')}", 38).move_to([0, 0.3, 0])
        self.say(f"비율이 가장 높은 것은 {o('과일')}", "비율이 가장 높은 간식은 40 %인 과일이에요.")
        self.play(Create(r1), FadeIn(t1), run_time=0.6)
        t2 = M(f"과일 40 %는 떡 20 %의 {g('2배')}", 38).move_to([0, -0.6, 0])
        self.say(f"과일은 떡의 {g('2배')}", "과일 40 %는 떡 20 %의 2배예요. 과일을 좋아하는 학생이 떡을 좋아하는 학생의 2배라는 뜻이에요.")
        self.play(FadeIn(t2), Indicate(bd.segs[2], color=GREEN), run_time=0.7)
        t3 = M(f"과일과 빵을 합하면 {b('65 %')}", 38).move_to([0, -1.5, 0])
        self.say(f"과일과 빵을 합하면 {b('65 %')}", "과일과 빵을 좋아하는 학생을 합하면 40 더하기 25, 65 %로 절반이 넘어요.")
        self.play(FadeIn(t3), run_time=0.5)
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("두 해 견주기")
        b1 = band(Y24, width=10.0, height=0.95, center=(0.4, 1.7, 0), size=24)
        b2 = band(Y25, width=10.0, height=0.95, center=(0.4, 0.2, 0), size=24)
        l1 = T("2024년", 26, SOFT).next_to(b1, LEFT, buff=0.15)
        l2 = T("2025년", 26, SOFT).next_to(b2, LEFT, buff=0.15)
        self.say("2024년과 2025년", "2024년과 2025년의 띠그래프를 위아래로 나란히 놓아 볼게요.")
        self.play(FadeIn(b1), FadeIn(b2), FadeIn(l1), FadeIn(l2), run_time=0.7)
        g1 = DashedLine(b1.segs[0].get_corner(DOWN + RIGHT), b2.segs[0].get_corner(UP + RIGHT), color=ORANGE, stroke_width=4)
        t1 = M(f"과일은 30 % → 40 %, {o('늘었어요')}", 34).move_to([0, -1.0, 0])
        self.say(f"과일은 {o('늘고')}, 빵은 {b('줄었어요')}", "과일은 30 %에서 40 %로 늘었고, 빵은 35 %에서 25 %로 줄었어요.")
        self.play(Create(g1), FadeIn(t1), run_time=0.6)
        t2 = M(f"빵은 35 % → 25 %, {b('줄었어요')} / 떡은 {g('20 %로 같아요')}", 34).move_to([0, -1.7, 0])
        self.play(FadeIn(t2), run_time=0.5)
        self.say(f"떡은 두 해 모두 {g('20 %')}", "떡은 두 해 모두 20 %로 비율이 같아요.")
        self.play(Indicate(b1.segs[2], color=GREEN), Indicate(b2.segs[2], color=GREEN), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
