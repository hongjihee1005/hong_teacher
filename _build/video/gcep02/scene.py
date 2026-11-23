"""「수학 원리 돋보기」 개념 차근차근 2화 — 모으기와 가르기

모으기: 구슬 2개와 3개를 모으면 5 / 가르기: 5를 1과 4, 2와 3 … (네 가지)
→ 모으기는 덧셈, 가르기는 뺄셈의 바탕 / 연습: 6을 가르는 방법
최종: GRADE=c ./make_final.sh 2
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, pair_card


class GcEp02(ConceptScene):
    EP_NO = 2
    EP_TITLE = "모으기와 가르기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.gather()
        self.split()
        self.all_ways()
        self.link()
        self.practice()
        self.closing(f"{g('모으기')}: 두 수를 모아 한 수로 → 덧셈의 바탕\n{o('가르기')}: 한 수를 두 수로 → 뺄셈의 바탕",
                     next_preview="개념 차근차근 3화 · 10을 만드는 짝")
        self.wait(0.5)

    def gather(self):
        self.section("모으기")
        a = VGroup(*[dot(BLUE, 0.3) for _ in range(2)]).arrange(RIGHT, buff=0.25).move_to([-3.2, 1.0, 0])
        c = VGroup(*[dot(ORANGE, 0.3) for _ in range(3)]).arrange(RIGHT, buff=0.25).move_to([3.2, 1.0, 0])
        la, lc = T("2", 60, BLUE).next_to(a, DOWN, buff=0.35), T("3", 60, ORANGE).next_to(c, DOWN, buff=0.35)
        self.say("왼손에 2개, 오른손에 3개", "왼손에 구슬 2개, 오른손에 구슬 3개가 있어요. 두 손의 구슬을 한곳에 모아 볼까요?")
        self.play(FadeIn(a), FadeIn(c), FadeIn(la), FadeIn(lc), run_time=0.7)
        self.play(a.animate.move_to([-1.3, -0.8, 0]), c.animate.move_to([0.65, -0.8, 0]), run_time=1.0)
        t = M(f"2와 3을 {g('모으면')} 5", 56).move_to([0, -1.9, 0])
        self.say(f"2와 3을 모으면 {g('5')}", "하나, 둘, 셋, 넷, 다섯. 2와 3을 모으면 5가 돼요. 이것을 모으기라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def split(self):
        self.section("가르기")
        ds = VGroup(*[dot(GREEN, 0.3) for _ in range(5)]).arrange(RIGHT, buff=0.25).move_to([0, 1.4, 0])
        l = T("5", 60, GREEN).next_to(ds, UP, buff=0.3)
        self.say("구슬 5개를 두 접시에 나누어 담으면?", "이번에는 구슬 5개를 두 접시에 나누어 담아요.")
        self.play(FadeIn(ds), FadeIn(l), run_time=0.6)
        self.play(ds[:1].animate.move_to([-2.6, -0.6, 0]).set_fill(BLUE), ds[1:].animate.arrange(RIGHT, buff=0.25).move_to([2.2, -0.6, 0]).set_fill(ORANGE), run_time=1.0)
        t = M(f"5는 {b('1')}과 {o('4')}로 {o('가를')} 수 있어요", 50).move_to([0, -2.0, 0])
        self.say(f"5를 {b('1')}과 {o('4')}로 가르기", "5는 1과 4로 가를 수 있어요. 한 수를 두 수로 나누는 것을 가르기라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def all_ways(self):
        self.section("5를 가르는 여러 방법")
        cards = VGroup(*[pair_card(5, k, 5 - k, size=54).scale(0.62) for k in range(1, 5)]).arrange(RIGHT, buff=0.45).move_to([0, 0.6, 0])
        self.say("5는 몇과 몇으로 가를 수 있을까?", "5는 1과 4, 2와 3, 3과 2, 4와 1로 가를 수 있어요.")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in cards], lag_ratio=0.25), run_time=1.6)
        t = M(f"한쪽이 {b('1씩 커지면')} 다른 쪽은 {o('1씩 작아져요')}", 44).move_to([0, -1.9, 0])
        self.say("한쪽이 1 커지면 다른 쪽은 1 작아져요", "왼쪽이 1씩 커지면 오른쪽은 1씩 작아져요. 그래서 빠뜨리지 않고 모두 찾을 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def link(self):
        self.section("덧셈과 뺄셈으로 이어져요")
        c = pair_card(5, 2, 3, size=64).scale(0.8).move_to([-3.4, 0.3, 0])
        e1 = M(f"{g('모으기')} → {b('2')} + {o('3')} = {g('5')}", 54).move_to([2.2, 1.0, 0])
        e2 = M(f"{o('가르기')} → {g('5')} − {b('2')} = {o('3')}", 54).move_to([2.2, -0.4, 0])
        self.say("모으기는 덧셈, 가르기는 뺄셈으로", "2와 3을 모으는 것은 덧셈 2 더하기 3은 5, 5를 2와 3으로 가르는 것은 뺄셈 5 빼기 2는 3으로 이어져요.")
        self.play(FadeIn(c), run_time=0.5)
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        t = M("(덧셈과 뺄셈은 개념 차근차근 10·11화에서 자세히)", 32, SOFT).move_to([0, -2.1, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M(f"{g('6')}은 몇과 몇으로 가를 수 있을까요? (모두)", 46).move_to([0, 2.0, 0])
        self.say("6을 가르는 방법을 모두 찾아요", "연습해 볼까요? 6은 몇과 몇으로 가를 수 있을지 모두 찾아보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        cards = VGroup(*[pair_card(6, k, 6 - k, size=54).scale(0.5) for k in range(1, 6)]).arrange(RIGHT, buff=0.35).move_to([0, -0.2, 0])
        a = M(f"1과 5 · 2와 4 · 3과 3 · 4와 2 · 5와 1 → {g('다섯 가지')}", 40).move_to([0, -2.1, 0])
        self.say(f"{g('다섯 가지')}", "1과 5, 2와 4, 3과 3, 4와 2, 5와 1. 모두 다섯 가지예요.")
        self.play(LaggedStart(*[FadeIn(c) for c in cards], lag_ratio=0.2), FadeIn(a), run_time=1.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
