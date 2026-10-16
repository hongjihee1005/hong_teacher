"""「수학 원리 돋보기」 5학년 12화 — 대응 관계를 기호로 식 세우기 (5-1 3단원 4·5차시, 화 코드 5-1-3-c)

솜사탕 자전거: 솜사탕 1개에 페달 4분 → (시간) = (솜사탕의 수) × 4, 솜사탕 □, 시간 △ → △ = □ × 4, □ = △ ÷ 4
식을 쓰면 표에 없는 큰 수도 바로: 솜사탕 30개 → 120분
풍력 발전기 ◇, 날개 ♡ → ♡ = ◇ × 3 (기호는 바꾸어도 됨)
최종: GRADE=5 ./make_final.sh 12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   SurroundingRectangle, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from corresp import CTable


class G5Ep12(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 12
    EP_TITLE = "대응 관계를 기호로 식 세우기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.symbol()
        self.big()
        self.wind()
        self.closing(f"두 양을 {o('□, △')} 같은 기호로 나타내면\n대응 관계를 {g('간단한 식')}으로 쓸 수 있어요",
                     next_preview="5학년 13화 · 크기가 같은 분수 만들기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("자전거 페달을 4분 밟으면 솜사탕 1개가 만들어져요.\n솜사탕 30개를 만들려면 몇 분이 걸릴까요?", 38)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0.5, 1.5, 0])
        self.say("솜사탕 30개를 만들려면?", "자전거 페달을 4분 동안 밟으면 그 힘으로 솜사탕 1개가 만들어져요. 솜사탕 30개를 만들려면 몇 분이 걸릴까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def symbol(self):
        self.section("기호로 나타내기")
        tb = CTable(["솜사탕의 수(개)", "시간(분)"], [1, 2, 3, 4, 5], [4, 8, 12, 16, 20], center=[-0.8, 1.6, 0])
        self.say("표로 나타내면", "표로 나타내면 솜사탕이 1개씩 늘 때마다 시간은 4분씩 늘어요.")
        self.play(FadeIn(tb.frame), FadeIn(tb.top), FadeIn(tb.bot), run_time=0.8)
        e = M(f"(시간) = (솜사탕의 수) × 4", 46).move_to([0, -0.1, 0])
        self.say("말로 된 식", "시간은 솜사탕의 수의 4배예요.")
        self.play(FadeIn(e), run_time=0.5)
        e2 = M(f"{o('△')} = {b('□')} × 4", 72).move_to([0, -0.1, 0])
        key = M(f"솜사탕의 수 {b('□')},  시간 {o('△')}", 36, SOFT).move_to([0, -1.2, 0])
        self.say(f"솜사탕의 수를 {b('□')}, 시간을 {o('△')}로", "솜사탕의 수를 네모, 시간을 세모라고 하면 세모는 네모 곱하기 4. 아주 간단해져요.")
        self.play(FadeIn(key), ReplacementTransform(e, e2), run_time=0.9)
        e3 = M(f"{b('□')} = {o('△')} ÷ 4", 52).move_to([0, -2.0, 0])
        self.say(f"거꾸로 {b('□')} = {o('△')} ÷ 4", "거꾸로 네모는 세모 나누기 4로도 나타낼 수 있어요.")
        self.play(FadeIn(e3), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def big(self):
        self.section("표에 없는 큰 수")
        e = M(f"{o('△')} = {b('□')} × 4", 64).move_to([0, 1.6, 0])
        self.play(FadeIn(e), run_time=0.4)
        e2 = M(f"{o('△')} = {b('30')} × 4 = {g('120')}", 64).move_to([0, 0.2, 0])
        self.say(f"□에 30을 넣으면 → {g('120')}", "표를 30칸까지 늘리지 않아도, 네모에 30을 넣으면 30 곱하기 4, 120. 솜사탕 30개는 120분이 걸려요.")
        self.play(FadeIn(e2), run_time=0.7)
        n = M(f"식이 있으면 {g('표에 없는 수')}도 바로 구해요", 44).move_to([0, -1.4, 0])
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def wind(self):
        self.section("생활 속 대응 관계")
        tb = CTable(["풍력 발전기의 수(대)", "날개의 수(개)"], [1, 2, 3, 4], [3, 6, 9, 12], center=[0, 1.6, 0], hw=3.2)
        self.say("풍력 발전기 1대에 날개 3개", "풍력 발전기 1대에는 날개가 3개 있어요.")
        self.play(FadeIn(tb.frame), FadeIn(tb.top), FadeIn(tb.bot), run_time=0.8)
        e = M(f"♡ = ◇ × 3", 64).move_to([-2.4, -0.6, 0])
        k = M(f"발전기 ◇, 날개 ♡", 34, SOFT).next_to(e, DOWN, buff=0.25)
        self.say("발전기를 ◇, 날개를 ♡로", "발전기의 수를 마름모, 날개의 수를 하트로 나타내면 하트는 마름모 곱하기 3이에요.")
        self.play(FadeIn(e), FadeIn(k), run_time=0.6)
        n = M(f"어떤 기호를 쓰는지,\n무엇을 기준으로 하는지에 따라\n식이 {o('달라질 수 있어요')}", 34).move_to([3.0, -0.7, 0])
        self.say(f"기호와 기준에 따라 식이 {o('달라질 수 있어요')}", "같은 대응 관계라도 어떤 기호를 쓰는지, 무엇을 기준으로 하는지에 따라 식은 달라질 수 있어요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
