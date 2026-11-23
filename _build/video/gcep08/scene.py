"""「수학 원리 돋보기」 개념 차근차근 8화 — 세 자리 수와 네 자리 수

100이 10개면 1000 / 백 모형 2·십 모형 3·일 모형 5 → 235(이백삼십오) / 자릿값 표
같은 숫자 3도 자리에 따라 300·30·3 / 네 자리 수 2416 / 0이 있는 자리(405) / 연습: 3062 읽기
최종: GRADE=c ./make_final.sh 8
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene
from base10 import hundred_flat, number_blocks, ten_rod
from bignum import PlaceChart

PUR = "#B05FD0"


class GcEp08(ConceptScene):
    EP_NO = 8
    EP_TITLE = "세 자리 수와 네 자리 수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.three()
        self.same_digit()
        self.zero()
        self.thousand()
        self.practice()
        self.closing(f"수는 {g('자리')}마다 값이 달라요: 천 · 백 · 십 · 일\n빈 자리는 {o('0')}으로 채워 써요 (405, 3062)",
                     next_preview="개념 차근차근 9화 · 숫자는 어떻게 바뀌어 왔을까?")
        self.wait(0.5)

    def three(self):
        self.section("세 자리 수")
        bl = number_blocks(235, size=0.17).move_to([-2.6, 0.6, 0])
        self.say("백 모형 2개, 십 모형 3개, 일 모형 5개", "백 모형 2개, 십 모형 3개, 일 모형 5개가 있어요. 모두 얼마일까요?")
        self.play(FadeIn(bl, lag_ratio=0.1), run_time=1.0)
        ch = PlaceChart(["백", "십", "일"]).move_to([3.4, 0.6, 0])
        self.play(FadeIn(ch), run_time=0.4)
        ch.fill(self, "235")
        t = M(f"{g('235')} (이백삼십오)", 56).move_to([0, -1.9, 0])
        self.say(f"{g('235')}, 이백삼십오", "백이 2개, 십이 3개, 일이 5개라서 235. 이백삼십오라고 읽어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def same_digit(self):
        self.section("같은 숫자, 다른 값")
        n = T("333", 150, INK).move_to([0, 1.3, 0])
        self.say("333의 세 숫자 3은 값이 같을까요?", "333에는 숫자 3이 세 번 나와요. 세 숫자의 값은 모두 같을까요?")
        self.play(Write(n), run_time=0.6)
        self.wait(0.4)
        cols = [ORANGE, BLUE, GREEN]
        labs = VGroup(*[M(f'<span foreground="{c}">{v}</span>', 50) for c, v in zip(cols, ["300", "30", "3"])])
        for k, l in enumerate(labs):
            n[k].set_color(cols[k])
            l.next_to(n[k], DOWN, buff=0.7)
        self.play(LaggedStart(*[FadeIn(l, shift=DOWN * 0.2) for l in labs], lag_ratio=0.3), run_time=1.2)
        t = M(f"{o('백의 자리')} 3 = 300 · {b('십의 자리')} 3 = 30 · {g('일의 자리')} 3 = 3", 40).move_to([0, -1.9, 0])
        self.say("자리에 따라 300, 30, 3", "백의 자리 3은 300, 십의 자리 3은 30, 일의 자리 3은 3. 숫자가 어느 자리에 있는지에 따라 값이 달라져요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def zero(self):
        self.section("빈 자리는 0")
        bl = number_blocks(405, size=0.17).move_to([-2.6, 0.6, 0])
        self.say("백 모형 4개, 일 모형 5개. 십 모형은 없어요", "백 모형 4개와 일 모형 5개. 십 모형은 하나도 없어요.")
        self.play(FadeIn(bl, lag_ratio=0.1), run_time=0.8)
        ch = PlaceChart(["백", "십", "일"]).move_to([3.4, 0.6, 0])
        self.play(FadeIn(ch), run_time=0.4)
        ch.fill(self, "405")
        t = M(f"십의 자리가 비었으니 {o('0')} → {g('405')} (사백오)", 46).move_to([0, -1.9, 0])
        self.say(f"빈 자리에 {o('0')}을 써요: 405", "십의 자리가 비었으면 0을 써서 405. 0을 빼고 45라고 쓰면 전혀 다른 수가 돼요. 읽을 때는 사백오.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def thousand(self):
        self.section("네 자리 수")
        flats = VGroup(*[hundred_flat(0.12) for _ in range(10)]).arrange_in_grid(rows=2, buff=0.12).move_to([-3.0, 0.8, 0])
        self.say("백 모형 10개가 모이면?", "백 모형 10개가 모이면 천, 1000이에요.")
        self.play(FadeIn(flats, lag_ratio=0.08), run_time=1.0)
        lab = M(f"100이 10개 → {PUR_M('1000')} (천)", 44).next_to(flats, DOWN, buff=0.35)
        self.play(FadeIn(lab), run_time=0.5)
        ch = PlaceChart(["천", "백", "십", "일"]).move_to([3.0, 0.8, 0])
        self.play(FadeIn(ch), run_time=0.4)
        self.play(FadeOut(lab), run_time=0.3)
        ch.fill(self, "2416")
        t = M(f"{g('2416')} (이천사백십육)", 52).move_to([0, -2.0, 0])
        self.say(f"{g('2416')}, 이천사백십육", "천이 2개, 백이 4개, 십이 1개, 일이 6개면 2416. 이천사백십육이라고 읽어요. 십이 1개일 때는 일십이 아니라 십이라고 읽어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M(f"{g('3062')} 를 읽어 보세요", 70).move_to([0, 1.3, 0])
        self.say("3062를 읽어 보세요", "연습해 볼까요? 3062를 읽어 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        ch = PlaceChart(["천", "백", "십", "일"]).move_to([0, 0.0, 0])
        self.play(FadeIn(ch), run_time=0.4)
        ch.fill(self, "3062")
        a = M(f"{g('삼천육십이')} (백의 자리 0은 읽지 않아요)", 44).move_to([0, -1.9, 0])
        self.say(f"{g('삼천육십이')}", "삼천육십이. 백의 자리가 0이면 그 자리는 읽지 않아요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def PUR_M(s):
    return f'<span foreground="{PUR}">{s}</span>'
