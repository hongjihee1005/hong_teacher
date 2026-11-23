"""「수학 원리 돋보기」 개념 차근차근 22화 — 2단·5단 만들기

2단: 수직선에서 2씩 뛰어 세기 → 2, 4, 6 … 18, 곱이 2씩 커짐 / 5단: 5씩, 일의 자리 5와 0이 번갈아
곱셈구구는 외우기 전에 '만들 수' 있어요(앞의 곱 + n) / 연습: 2 × 7, 5 × 6
최종: GRADE=c ./make_final.sh 22
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
from conceptkit import jumps, number_line, table_rows


class GcEp22(ConceptScene):
    EP_NO = 22
    EP_TITLE = "2단·5단 만들기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.dan(2, 20, BLUE, "2씩 뛰어 세면 2단", "2단은 2씩 뛰어 세면 만들어져요. 2, 4, 6, 8. 곱이 2씩 커져요.")
        self.dan(5, 45, ORANGE, "5씩 뛰어 세면 5단", "5단은 5씩 뛰어 세요. 5, 10, 15, 20. 일의 자리가 5와 0으로 번갈아 나와요.")
        self.make()
        self.practice()
        self.closing(f"2단은 {b('2씩')}, 5단은 {o('5씩')} 커져요\n잊어버리면 앞의 곱에 {g('더해서')} 만들 수 있어요",
                     next_preview="개념 차근차근 23화 · 3·6단, 4·8단")
        self.wait(0.5)

    def dan(self, n, top, col, sub, narr):
        self.section(f"{n}단")
        nl = number_line(top, y=0.6, label_every=n if n > 2 else 2, size=24)
        self.say(sub, narr)
        self.play(FadeIn(nl), run_time=0.5)
        js = jumps(self, nl, n, 9 if n * 9 <= top else top // n, color=col, run_each=0.3)
        rows = table_rows(n, 9, 30, col).scale(0.9)
        rows.arrange_in_grid(rows=3, buff=(0.5, 0.12), flow_order="dr").move_to([0, -1.6, 0])
        self.play(FadeIn(rows, lag_ratio=0.05), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def make(self):
        self.section("잊어버렸을 때")
        e1 = M(f"5 × 6 = ?", 70).move_to([0, 1.4, 0])
        e2 = M(f"5 × 5 = 25 → 25 + {o('5')} = {g('30')}", 60).move_to([0, 0.1, 0])
        self.say("앞의 곱에 한 번 더 더해요", "5 곱하기 6이 생각나지 않으면, 아는 5 곱하기 5는 25에 5를 한 번 더 더하면 30이에요.")
        self.play(FadeIn(e1), run_time=0.4)
        self.play(FadeIn(e2), run_time=0.5)
        t = M("곱셈구구는 외우기 전에 만들 수 있어요", 42, SOFT).move_to([0, -1.2, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        qs = VGroup(M("① 2 × 7", 70), M("② 5 × 6", 70)).arrange(RIGHT, buff=2.2).move_to([0, 1.2, 0])
        self.say("2 × 7, 5 × 6", "연습해 볼까요? 2 곱하기 7과 5 곱하기 6을 구해 보세요.")
        self.play(FadeIn(qs), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① {g('14')}    ② {g('30')}", 70).move_to([0, -0.4, 0])
        self.say(f"{g('14')}와 {g('30')}", "2 곱하기 7은 14, 5 곱하기 6은 30이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
