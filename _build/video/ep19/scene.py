"""「수학 원리 돋보기」 19화 — 무게의 덧셈과 뺄셈 (2학기 5단원 9차시, 화 코드 2-5-e)

2 kg 700 g + 1 kg 600 g (1000 g = 1 kg 받아올림) → 4 kg 200 g − 1 kg 500 g (받아내림)
→ 들이와 나란히: 같은 원리 → 생활 문제
최종: ./make_final.sh 19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, UP, FadeIn, Write, VGroup, SurroundingRectangle, Create

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from measure import unit_calc


class Ep19(EpisodeScene):
    EP_NO = 19
    EP_TITLE = "무게의 덧셈과 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.section("1000 g이 넘으면?")
        unit_calc(self, (2, 700), (1, 600), "+", big="kg", small="g")
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.section("뺄 수 없으면?")
        unit_calc(self, (4, 200), (1, 500), "-", big="kg", small="g")
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.side_by_side()
        self.life()
        self.closing(f"{b('kg')}은 {b('kg')}끼리, {o('g')}은 {o('g')}끼리\n{o('1000 g')} = {b('1 kg')}, 들이와 같은 원리예요",
                     next_preview="20화 · 그림그래프는 어떻게 읽을까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        a = M(f"사과 {b('2 kg')} {o('700 g')}", 56).move_to([0, 1.6, 0])
        c = M(f"배 {b('1 kg')} {o('600 g')}", 56).move_to([0, 0.5, 0])
        self.say("사과와 배를 한 상자에 담아요", "사과 2킬로그램 700그램과 배 1킬로그램 600그램을 한 상자에 담았어요.")
        self.play(FadeIn(a), FadeIn(c), run_time=0.8)
        q = M(f"모두 몇 kg 몇 g일까요?", 56).move_to([0, -0.9, 0])
        self.say("모두 몇 kg 몇 g일까요?", "상자에 담은 과일은 모두 몇 킬로그램 몇 그램일까요?")
        self.play(Write(q), run_time=0.9)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def side_by_side(self):
        self.section("들이와 무게, 같은 원리")
        l1 = M(f"들이:  {o('1000 mL')} = {b('1 L')}", 60).move_to([0, 1.4, 0])
        l2 = M(f"무게:  {o('1000 g')} = {b('1 kg')}", 60).move_to([0, 0.2, 0])
        self.say("들이와 무게를 나란히 놓아 봐요", "17화에서 배운 들이 계산과 나란히 놓아 볼까요?")
        self.play(FadeIn(l1), run_time=0.6)
        self.play(FadeIn(l2), run_time=0.6)
        t = M(f"작은 단위가 {o('1000')} 모이면 큰 단위 {b('1')}", 50)
        bg = SurroundingRectangle(t, color=GREEN, buff=0.22, stroke_width=6, corner_radius=0.18).set_fill(PAPER, 1)
        VGroup(bg, t).move_to([0, -1.3, 0])
        self.say(f"작은 단위가 {o('1000')} 모이면 큰 단위 {b('1')}", "작은 단위가 1000 모이면 큰 단위 1이 돼요. 그래서 계산 방법도 똑같아요.")
        self.play(FadeIn(bg), Write(t), run_time=0.9)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def life(self):
        self.section("생활 속 문제")
        q = M(f"설탕 {b('1 kg')}에서 {o('350 g')}을 썼어요.\n남은 설탕은 몇 g일까요?", 52).move_to([0, 1.5, 0])
        self.say("설탕 1 kg에서 350 g을 쓰면?", "설탕 1킬로그램에서 350그램을 썼어요. 남은 설탕은 몇 그램일까요?")
        self.play(Write(q), run_time=1.1)
        self.wait(2.0)
        a = M(f"{b('1 kg')} = {o('1000 g')} → 1000 − 350 = {g('650 g')}", 54).move_to([0, -0.4, 0])
        self.say(f"1 kg은 1000 g, 1000 − 350 = {g('650 g')}", "1킬로그램을 1000그램으로 바꾸면 1000 빼기 350, 650그램이 남아요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.7)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
