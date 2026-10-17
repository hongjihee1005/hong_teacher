"""「수학 원리 돋보기」 5학년 59화 — 평균으로 비교하고 모르는 값 구하기 (5-2 6단원 4차시, 화 코드 5-2-6-c)

모둠 가(4명) 모은 책 합계 48권, 모둠 나(5명) 55권 → 합계로는 나가 많지만 평균은 가 12권, 나 11권 → 가가 더 잘함
평균 80점, 4과목 → 합계 320점 / 세 과목 76, 85, 78점 → 남은 과목 320 − 239 = 81점
최종: GRADE=5 ./make_final.sh 59
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#C0392B"


class G5Ep59(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 59
    EP_TITLE = "평균으로 비교하고 모르는 값 구하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.compare()
        self.unknown()
        self.closing(f"사람 수가 다른 두 모둠은 {o('평균')}으로 견주어요\n(평균) × (자료의 수) = {g('전체의 합')}, 여기서 아는 값을 빼면 모르는 값",
                     next_preview="5학년 60화 · 가능성을 말로 나타내고 비교하기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("4명인 가 모둠은 책 48권, 5명인 나 모둠은 55권을 읽었어요.\n어느 모둠이 더 많이 읽었다고 할 수 있을까요?", 38)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0.4, 1.6, 0])
        self.say("사람 수가 다른 두 모둠", "4명인 가 모둠은 책을 모두 48권, 5명인 나 모둠은 55권 읽었어요. 어느 모둠이 더 많이 읽었다고 할 수 있을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def compare(self):
        self.section("평균으로 견주기")
        w = M(f"합계: 48권 &lt; 55권 → 나 모둠?", 42, SOFT).move_to([0, 1.9, 0])
        x = Cross(w, stroke_color=RED, stroke_width=5)
        self.say("합계로 견주면 안 돼요", "합계만 보면 나 모둠이 많지만, 나 모둠은 사람이 한 명 더 많아요. 합계로 견주면 공평하지 않아요.")
        self.play(FadeIn(w), run_time=0.5)
        self.play(Create(x), run_time=0.5)
        a = M(f"가 모둠: 48 ÷ 4 = {o('12권')}", 48).move_to([0, 0.6, 0])
        b_ = M(f"나 모둠: 55 ÷ 5 = {b('11권')}", 48).move_to([0, -0.4, 0])
        self.say(f"평균으로 견주면 가 {o('12권')}, 나 {b('11권')}", "한 사람이 읽은 책의 평균으로 견줘요. 가 모둠은 48 나누기 4, 12권. 나 모둠은 55 나누기 5, 11권.")
        self.play(FadeIn(a), run_time=0.5)
        self.play(FadeIn(b_), run_time=0.5)
        r = M(f"{g('가 모둠')}이 더 많이 읽었다고 할 수 있어요", 44).move_to([0, -1.6, 0])
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def unknown(self):
        self.section("모르는 값 구하기")
        q = M("네 과목 평균이 80점이에요. 국어 76, 수학 85, 과학 78점이면\n사회는 몇 점일까요?", 38)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0.4, 2.0, 0])
        self.say("평균을 알 때 모르는 점수", "네 과목 점수의 평균이 80점이에요. 국어 76점, 수학 85점, 과학 78점이면 사회는 몇 점일까요?")
        self.play(FadeIn(q), run_time=0.6)
        e1 = M(f"전체의 합 = 80 × 4 = {o('320')}", 46).move_to([0, 0.6, 0])
        self.say(f"(평균) × (자료의 수) = {o('320')}", "평균에 과목 수를 곱하면 네 과목 점수를 모두 더한 값이 돼요. 80 곱하기 4, 320점.")
        self.play(FadeIn(e1), run_time=0.5)
        e2 = M(f"사회 = 320 − (76 + 85 + 78) = 320 − 239 = {g('81')}", 44).move_to([0, -0.5, 0])
        self.say(f"아는 점수를 빼면 {g('81점')}", "전체에서 아는 세 과목 점수의 합 239를 빼면 81. 사회는 81점이에요.")
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
