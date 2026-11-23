"""「수학 원리 돋보기」 개념 차근차근 5화 — 100까지의 수, 뛰어 세기

수 배열표(1~100): 가로는 1씩, 세로는 10씩 커짐 / 99 다음은 100(10개씩 10묶음)
2씩·5씩·10씩 뛰어 세기 / 거꾸로 뛰어 세기 / 연습: 35에서 10씩 3번
최종: GRADE=c ./make_final.sh 5
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene

CW, CH = 0.66, 0.5


def chart():
    cells, nums = VGroup(), VGroup()
    for v in range(1, 101):
        r, c = divmod(v - 1, 10)
        box = Rectangle(width=CW, height=CH, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=2).move_to([c * CW, -r * CH, 0])
        cells.add(box)
        nums.add(T(str(v), 22, INK).move_to(box))
    return VGroup(cells, nums)


class GcEp05(ConceptScene):
    EP_NO = 5
    EP_TITLE = "100까지의 수, 뛰어 세기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.table()
        self.skip()
        self.back()
        self.practice()
        self.closing(f"수 배열표: 오른쪽으로 {b('1씩')}, 아래로 {o('10씩')} 커져요\n{g('뛰어 세기')}: 2씩 · 5씩 · 10씩, 거꾸로도",
                     next_preview="개념 차근차근 6화 · 짝수와 홀수")
        self.wait(0.5)

    def table(self):
        self.section("수 배열표")
        ch = chart().move_to([-2.9, -0.1, 0])
        self.ch = ch
        self.say("1부터 100까지 수 배열표", "1부터 100까지 수를 10개씩 한 줄로 늘어놓았어요. 수 배열표라고 해요.")
        self.play(FadeIn(ch[0]), LaggedStart(*[FadeIn(n) for n in ch[1]], lag_ratio=0.01), run_time=1.8)
        row = SurroundingRectangle(ch[0][20:30], color=BLUE, buff=0.03)
        col = SurroundingRectangle(VGroup(*[ch[0][k] for k in range(4, 100, 10)]), color=ORANGE, buff=0.03)
        t1 = M(f"오른쪽으로 {b('1씩')} 커져요", 36).move_to([3.9, 1.2, 0])
        t2 = M(f"아래로 {o('10씩')} 커져요", 36).move_to([3.9, 0.2, 0])
        self.say(f"오른쪽으로 {b('1씩')}, 아래로 {o('10씩')}", "오른쪽으로 가면 1씩, 아래로 내려가면 10씩 커져요. 아래로 가면 십의 자리 숫자만 하나씩 커져요.")
        self.play(Create(row), FadeIn(t1), run_time=0.6)
        self.play(Create(col), FadeIn(t2), run_time=0.6)
        hundred = SurroundingRectangle(ch[0][99], color=GREEN, buff=0.03)
        t3 = M(f"99 다음은 {g('100')}\n(10개씩 10묶음)", 36).move_to([3.9, -1.1, 0])
        self.say(f"99 다음은 {g('100')}", "99 다음 수는 100, 백이라고 읽어요. 10개씩 10묶음이에요.")
        self.play(Create(hundred), FadeIn(t3), run_time=0.6)
        self.wait(1.2)
        self.settle()
        self.play(FadeOut(VGroup(row, col, hundred, t1, t2, t3)), run_time=0.4)

    def mark(self, start, step, n, color):
        ch = self.ch
        ring = VGroup()
        for k in range(n):
            v = start + step * k
            if not 1 <= v <= 100:
                break
            ring.add(ch[0][v - 1].copy().set_fill(color, 0.55))
        return ring

    def skip(self):
        self.section("뛰어 세기")
        for step, col, txt, narr in [(2, BLUE, f"{b('2씩')} 뛰어 세기:\n2, 4, 6, 8 …", "2씩 뛰어 세면 2, 4, 6, 8. 색칠한 칸이 세로로 줄을 이루어요."),
                                     (5, ORANGE, f"{o('5씩')} 뛰어 세기:\n5, 10, 15, 20 …", "5씩 뛰어 세면 5, 10, 15, 20. 일의 자리가 5와 0으로 번갈아 나와요."),
                                     (10, GREEN, f"{g('10씩')} 뛰어 세기:\n10, 20, 30 …", "10씩 뛰어 세면 10, 20, 30. 맨 오른쪽 한 줄이에요.")]:
            ring = self.mark(step, step, 100 // step, col)
            t = M(txt, 36).move_to([3.9, 0.2, 0])
            self.say(txt.split(":")[0], narr)
            self.play(LaggedStart(*[FadeIn(r) for r in ring], lag_ratio=0.03), FadeIn(t), run_time=1.4)
            self.wait(0.8)
            self.settle()
            self.play(FadeOut(ring), FadeOut(t), run_time=0.4)

    def back(self):
        self.section("거꾸로 뛰어 세기")
        ring = self.mark(90, -10, 9, ORANGE)
        t = M(f"90에서 {o('10씩 거꾸로')}\n90, 80, 70 … 10", 36).move_to([3.9, 0.2, 0])
        self.say(f"{o('10씩 거꾸로')} 뛰어 세기", "거꾸로 뛰어 셀 수도 있어요. 90에서 10씩 작아지게 90, 80, 70, 그리고 10까지.")
        self.play(LaggedStart(*[FadeIn(r) for r in ring], lag_ratio=0.12), FadeIn(t), run_time=1.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M(f"{b('35')}에서 {o('10씩')} 3번 뛰어 세면?", 60).move_to([0, 1.2, 0])
        self.say("35에서 10씩 3번 뛰어 세면?", "연습해 볼까요? 35에서 10씩 3번 뛰어 세면 어떤 수가 될까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"35 → 45 → 55 → {g('65')}", 64).move_to([0, -0.4, 0])
        t = M("십의 자리 숫자만 3 → 4 → 5 → 6", 38, SOFT).move_to([0, -1.6, 0])
        self.say(f"{g('65')}", "35, 45, 55, 65. 십의 자리 숫자만 하나씩 커져서 65예요.")
        self.play(FadeIn(a), FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
