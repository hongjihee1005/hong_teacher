"""「수학 원리 돋보기」 개념 차근차근 30화 — 만, 십만, 백만, 천만

1000이 10개면 10000(만) / 10배씩: 만 → 십만 → 백만 → 천만 (자리 하나씩 왼쪽으로) / 자릿값 표 3725만 4018
읽기: 삼천칠백이십오만 사천십팔 / 연습: 6080만 3000 읽기
최종: GRADE=c ./make_final.sh 30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from bignum import PlaceChart, bill


class GcEp30(ConceptScene):
    EP_NO = 30
    EP_TITLE = "만, 십만, 백만, 천만"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.man()
        self.tenfold()
        self.chart()
        self.practice()
        self.closing(f"1000이 10개면 {g('10000(만)')}, 그다음은 {b('10배')}씩\n만 → 십만 → 백만 → 천만",
                     next_preview="개념 차근차근 31화 · 억과 조, 네 자리씩 끊어 읽기")
        self.wait(0.5)

    def man(self):
        self.section("1000이 10개면?")
        bs = VGroup(*[bill(1000, w=1.4, h=0.66) for _ in range(10)]).arrange_in_grid(rows=2, buff=0.18).move_to([-2.6, 0.8, 0])
        self.say("1000원짜리 10장은?", "1000원짜리 지폐가 10장 있어요. 모두 얼마일까요?")
        self.play(FadeIn(bs, lag_ratio=0.08), run_time=1.0)
        big = bill(10000, w=2.4, h=1.1).move_to([3.4, 0.8, 0])
        e = M(f"1000이 10개 → {g('10000')} (만, 일만)", 50).move_to([0, -1.4, 0])
        self.say(f"{g('10000')}, 만", "1000이 10개면 10000이에요. 만 또는 일만이라고 읽어요.")
        self.play(FadeIn(big), FadeIn(e), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def tenfold(self):
        self.section("10배씩 커져요")
        rows = VGroup(*[M(f"{n:>9}  {name}", 50) for n, name in [(10000, "만"), (100000, "십만"), (1000000, "백만"), (10000000, "천만")]])
        rows = VGroup(*[VGroup(T(str(n), 54, INK), T(name, 46, BLUE)).arrange(RIGHT, buff=0.6) for n, name in [(10000, "만"), (100000, "십만"), (1000000, "백만"), (10000000, "천만")]])
        for r in rows:
            pass
        rows.arrange(DOWN, buff=0.35, aligned_edge=RIGHT).move_to([-0.5, 0.6, 0])
        arrows = VGroup(*[M("× 10", 32, ORANGE).next_to(VGroup(rows[k], rows[k + 1]), RIGHT, buff=0.6) for k in range(3)])
        self.say("10배씩 커지면 자리가 하나씩", "만의 10배는 십만, 십만의 10배는 백만, 백만의 10배는 천만. 10배가 될 때마다 0이 하나씩 늘어 자리가 하나 올라가요.")
        self.play(LaggedStart(*[FadeIn(r, shift=UP * 0.2) for r in rows], lag_ratio=0.35), run_time=1.6)
        self.play(FadeIn(arrows, lag_ratio=0.3), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def chart(self):
        self.section("자릿값 표로 읽기")
        ch = PlaceChart(["천만", "백만", "십만", "만", "천", "백", "십", "일"], cell_w=1.25, head_size=28, digit_size=54).move_to([0, 1.2, 0])
        self.say("37254018", "37254018을 자릿값 표에 넣어 볼까요?")
        self.play(FadeIn(ch), run_time=0.4)
        ch.fill(self, "37254018")
        r = M(f"{b('3725')}만 {o('4018')} → {g('삼천칠백이십오만 사천십팔')}", 48).move_to([0, -1.1, 0])
        self.say("만을 기준으로 끊어 읽어요", "만의 자리 앞 3725에 만을 붙이고, 뒤 4018을 이어 읽어요. 삼천칠백이십오만 사천십팔.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M(f"{g('60803000')} 을 읽어 보세요", 70).move_to([0, 1.2, 0])
        self.say("60803000을 읽어 보세요", "연습해 볼까요? 60803000을 읽어 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"6080만 3000 → {g('육천팔십만 삼천')}", 56).move_to([0, -0.4, 0])
        self.say(f"{g('육천팔십만 삼천')}", "만을 기준으로 끊으면 6080만 3000. 육천팔십만 삼천이에요. 0인 자리는 읽지 않아요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
