"""「수학 원리 돋보기」 6학년 54화 — 비례식 활용 (6-2 4단원 6차시, 화 코드 6-2-4-e)

구하려는 것을 □라 하고, 두 양의 비를 같은 차례(시간 : 거리 = 시간 : 거리)로 써서 비례식을 세움
비례식의 성질(외항의 곱 = 내항의 곱), 비의 성질(같은 수 곱하기)로 □를 구함
(예시: 자전거로 2시간에 30 km → 5시간에는? 2 : 30 = 5 : □ → □ = 75 / 생각을 더하다: 파스타 3인분 면 270 g → 5인분은? — 이 영상에서 정한 예시)
최종: GRADE=6 ./make_final.sh 54
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class G6Ep54(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 54
    EP_TITLE = "비례식 활용"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.build_eq()
        self.two_ways()
        self.recipe()
        self.closing(f"구하려는 것을 {o('□')}라 하고 {b('같은 차례')}로 비례식을 세워요\n외항의 곱 = 내항의 곱, 또는 {g('같은 수 곱하기')}로 □를 구해요",
                     next_preview="6학년 55화 · 비례배분")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("자전거를 타고 2시간에 30 km를 가요.\n같은 빠르기로 5시간 동안에는 몇 km를 갈까요?", 42).move_to([0.6, 1.6, 0])
        self.say("5시간에는?", "자전거를 타고 2시간에 30 킬로미터를 가요. 같은 빠르기로 5시간 동안에는 몇 킬로미터를 갈까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def build_eq(self):
        self.section("비례식 세우기")
        t = M(f"(시간) : (거리) = (시간) : (거리)", 40).move_to([0, 1.6, 0])
        self.say(f"{b('같은 차례')}로 써요", "구하려는 거리를 □라 하고, 두 비를 같은 차례로 써요. 시간 대 거리는 시간 대 거리.")
        self.play(FadeIn(t), run_time=0.5)
        p = M(f"2 : 30 = 5 : {o('□')}", 72).move_to([0, 0.2, 0])
        self.say(f"2 : 30 = 5 : {o('□')}", "2 대 30은 5 대 □예요.")
        self.play(Write(p), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def two_ways(self):
        self.section("두 가지로 구하기")
        p = M(f"2 : 30 = 5 : {o('□')}", 60).move_to([0, 2.0, 0])
        self.play(FadeIn(p), run_time=0.4)
        a = M(f"{b('비례식의 성질')}\n2 × □ = 30 × 5\n2 × □ = 150\n□ = {g('75')}", 38).move_to([-3.2, -0.3, 0])
        self.say("외항의 곱 = 내항의 곱", "비례식의 성질을 쓰면 2 곱하기 □는 30 곱하기 5, 150이에요. □는 150 나누기 2, 75예요.")
        self.play(FadeIn(a), run_time=0.7)
        bb = M(f"{b('비의 성질')}\n2 × 2.5 = 5\n30 × 2.5 = □\n□ = {g('75')}", 38).move_to([3.2, -0.3, 0])
        self.say("2를 몇 배 하면 5?", "비의 성질을 써도 돼요. 2에 2.5를 곱하면 5이니, 30에도 2.5를 곱하면 75예요. 5시간 동안 75 킬로미터를 가요.")
        self.play(FadeIn(bb), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def recipe(self):
        self.section("요리 재료 구하기")
        q = M("토마토파스타 3인분에 면 270 g이 들어가요. 5인분에는?", 36).move_to([0, 1.9, 0])
        self.say("5인분에는 면이 몇 g?", "생각을 더해 볼게요. 토마토파스타 3인분에 면 270 그램이 들어가요. 5인분을 만들려면 면이 몇 그램 필요할까요?")
        self.play(FadeIn(q), run_time=0.5)
        e1 = M(f"(인분) : (면) → 3 : 270 = 5 : {o('□')}", 42).move_to([0, 0.6, 0])
        e2 = M(f"3 × □ = 270 × 5 = 1350 → □ = {g('450')}", 42).move_to([0, -0.5, 0])
        self.say(f"□ = {g('450 g')}", "3 대 270은 5 대 □. 3 곱하기 □는 1350이니 □는 450, 면 450 그램이 필요해요.")
        self.play(FadeIn(e1), run_time=0.6)
        self.play(FadeIn(e2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
