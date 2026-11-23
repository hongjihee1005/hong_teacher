"""「수학 원리 돋보기」 개념 차근차근 3화 — 10을 만드는 짝

10칸 틀: 7개 있으면 빈칸 3 → 7과 3은 10의 짝 / 1-9, 2-8, 3-7, 4-6, 5-5
손가락 10개로도 / 쓰임: 받아올림(14화)에서 '10 만들기' / 연습: 6의 짝, 짝 찾기 카드
최종: GRADE=c ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, ten_frame, RED


class GcEp03(ConceptScene):
    EP_NO = 3
    EP_TITLE = "10을 만드는 짝"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.frame()
        self.pairs()
        self.why()
        self.practice()
        self.closing(f"{g('10')}을 만드는 짝: 1과 9 · 2와 8 · 3과 7 · 4와 6 · 5와 5\n10칸 틀의 {b('채운 칸')}과 {o('빈칸')}이 짝이에요",
                     next_preview="개념 차근차근 4화 · 10개씩 묶음과 낱개: 자릿값")
        self.wait(0.5)

    def frame(self):
        self.section("10칸 틀")
        f = ten_frame(7, BLUE).move_to([0, 0.8, 0])
        self.say("10칸 틀에 구슬 7개", "10칸짜리 틀이에요. 구슬 7개를 넣었어요. 빈칸은 몇 개일까요?")
        self.play(FadeIn(f[0]), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(d, scale=0.5) for d in f[1]], lag_ratio=0.12), run_time=1.0)
        empties = VGroup(*[dot(ORANGE, 0.26).set_fill(opacity=0.0).set_stroke(ORANGE, 4).move_to(f[0][k]) for k in range(7, 10)])
        self.play(LaggedStart(*[Create(e) for e in empties], lag_ratio=0.2), run_time=0.8)
        t = M(f"채운 칸 {b('7')} + 빈칸 {o('3')} = {g('10')}", 54).move_to([0, -1.5, 0])
        self.say(f"7과 3은 10을 만드는 짝", "빈칸은 3개예요. 7과 3을 모으면 10. 7과 3은 10을 만드는 짝이에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def pairs(self):
        self.section("10을 만드는 짝 모두")
        rows = VGroup()
        for k in range(1, 6):
            f = ten_frame(k, BLUE, cell=0.42)
            for j in range(k, 10):
                f[1].add(dot(ORANGE, 0.14).move_to(f[0][j]))
            lab = M(f"{b(str(k))} 과 {o(str(10 - k))}", 40)
            rows.add(VGroup(f, lab).arrange(RIGHT, buff=0.5))
        rows.arrange(DOWN, buff=0.22, aligned_edge=LEFT).scale(0.88).move_to([-1.0, -0.1, 0])
        self.say("1과 9, 2와 8, 3과 7, 4와 6, 5와 5", "10을 만드는 짝을 모두 찾아요. 1과 9, 2와 8, 3과 7, 4와 6, 그리고 5와 5.")
        self.play(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.3) for r in rows], lag_ratio=0.3), run_time=2.0)
        t = M(f"짝을 바꾸어도 같아요\n(9와 1, 8과 2 …)", 36, SOFT).move_to([4.6, 0.2, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def why(self):
        self.section("왜 10이 중요할까?")
        hands = VGroup(*[VGroup(*[dot(BLUE if h == 0 else ORANGE, 0.22) for _ in range(5)]).arrange(RIGHT, buff=0.12) for h in range(2)]).arrange(RIGHT, buff=0.8).move_to([0, 1.6, 0])
        self.say("손가락은 모두 10개", "우리 손가락은 모두 10개예요. 그리고 우리가 쓰는 수는 10개가 모이면 한 자리 올라가요.")
        self.play(FadeIn(hands, lag_ratio=0.1), run_time=0.7)
        e = M(f"{b('8')} + {o('5')} = {b('8')} + {o('2')} + {o('3')} = {g('10')} + 3 = 13", 50).move_to([0, -0.1, 0])
        self.say("8 + 5는 10을 먼저 만들면 쉬워요", "8 더하기 5를 할 때, 8의 짝인 2를 먼저 더해 10을 만들고 남은 3을 더하면 13. 쉽게 계산할 수 있어요.")
        self.play(FadeIn(e), run_time=0.6)
        t = M("(14화 '10을 만들어 더하기'에서 자세히)", 32, SOFT).move_to([0, -1.3, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        cards = VGroup(*[T(str(v), 64, c) for v, c in [(6, BLUE), (9, BLUE), (2, BLUE), (4, ORANGE), (1, ORANGE), (8, ORANGE)]]).arrange(RIGHT, buff=0.9).move_to([0, 1.2, 0])
        q = M("더해서 10이 되는 짝을 찾아 보세요", 44).move_to([0, -0.3, 0])
        self.say("10이 되는 짝을 찾아요", "연습해 볼까요? 6, 9, 2, 4, 1, 8. 더해서 10이 되는 짝을 찾아 보세요.")
        self.play(FadeIn(cards, lag_ratio=0.1), FadeIn(q), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"{b('6')}과 {o('4')} · {b('9')}와 {o('1')} · {b('2')}와 {o('8')}", 52).move_to([0, -1.6, 0])
        self.say("6과 4, 9와 1, 2와 8", "6과 4, 9와 1, 2와 8이 10을 만드는 짝이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
