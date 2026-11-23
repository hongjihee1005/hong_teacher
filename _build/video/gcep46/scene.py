"""「수학 원리 돋보기」 개념 차근차근 46화 — 소수(素數)는 무엇일까?

약수가 1과 자기 자신뿐인 수(2, 3, 5, 7 …), 1은 소수가 아님 / 0.1 같은 소수(小數)와 이름만 같음
에라토스테네스의 체: 2~50에서 2·3·5·7의 배수 지우기 → 남는 수 15개
이야기: 약 2200년 전 그리스의 에라토스테네스가 생각했다고 전해짐(니코마코스 『산술 입문』이 전함) / 연습: 소수 고르기 / 출처
최종: GRADE=c ./make_final.sh 46
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
from fraction import frac, frac_bar, row
from manim import Rectangle


class GcEp46(ConceptScene):
    EP_NO = 46
    EP_TITLE = "소수(素數)는 무엇일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.meaning()
        self.sieve()
        self.practice()
        show_sources(self, [
            "· 에라토스테네스의 체: 니코마코스 『산술 입문』 1권 13장이 전함 — 위키백과 'Sieve of Eratosthenes', 동테네시 주립대 수학사 강의 노트",
        ])
        self.closing(f"약수가 {g('1과 자기 자신')}뿐인 수 = 소수(素數): 2, 3, 5, 7, 11 …\n1은 소수가 아니에요",
                     next_preview="개념 차근차근 47화 · 크기가 같은 분수")
        self.wait(0.5)

    def meaning(self):
        self.section("약수가 두 개뿐인 수")
        rows = VGroup(M(f"7의 약수: 1, 7 → {g('소수')}", 48), M(f"9의 약수: 1, 3, 9 → 소수 아님", 48, SOFT), M(f"1의 약수: 1 → 소수 아님", 48, SOFT)).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to([0, 1.0, 0])
        self.say("약수가 1과 자기 자신뿐", "7의 약수는 1과 7뿐이에요. 이렇게 약수가 1과 자기 자신, 딱 두 개뿐인 수를 소수라고 해요. 9는 3으로도 나누어져서 소수가 아니고, 1은 약수가 하나뿐이라 소수가 아니에요.")
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=1.0)
        t = M("(0.1 같은 소수(小數)와 이름의 소리만 같고 뜻은 달라요)", 32, SOFT).move_to([0, -1.2, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def sieve(self):
        self.section("에라토스테네스의 체")
        cw, ch = 0.95, 0.52
        cells, nums = {}, VGroup()
        grid = VGroup()
        for v in range(1, 51):
            r, c = divmod(v - 1, 10)
            box = Rectangle(width=cw, height=ch, stroke_color=SOFT, stroke_width=2, fill_color="#FFFFFF", fill_opacity=1).move_to([-4.3 + c * cw, 2.1 - r * ch, 0])
            t = T(str(v), 28, INK).move_to(box)
            cells[v] = (box, t)
            grid.add(box, t)
        self.say("1부터 50까지 늘어놓고", "약 2200년 전 그리스의 에라토스테네스는 소수만 걸러 내는 방법을 생각했다고 전해져요. 수를 늘어놓고 배수를 지워 가는 방법이에요.")
        self.play(FadeIn(grid, lag_ratio=0.01), run_time=1.0)
        self.play(cells[1][1].animate.set_opacity(0.2), run_time=0.3)
        side = M("", 36).move_to([3.8, 0.8, 0])
        for p, col in [(2, BLUE), (3, ORANGE), (5, GREEN), (7, "#B05FD0")]:
            lab = M(f'<span foreground="{col}">{p}</span>는 남기고 {p}의 배수를 지워요', 34).move_to([3.4, 1.4 - [2, 3, 5, 7].index(p) * 0.55, 0])
            self.say(f"{p}의 배수를 지워요", f"{p}는 남기고, {p}의 배수를 모두 지워요.")
            outs = [cells[v][1] for v in range(p * 2, 51, p)]
            self.play(cells[p][0].animate.set_fill(col, 0.45), FadeIn(lab), *[o_.animate.set_opacity(0.2) for o_ in outs], run_time=0.8)
        t = M(f"남은 수 {g('15개')}가 50까지의 소수", 40).move_to([3.4, -1.2, 0])
        self.say(f"남은 {g('15개')}가 소수", "남은 2, 3, 5, 7, 11, 13 … 47까지 15개가 50까지의 소수예요. 체로 거르듯 남긴다고 에라토스테네스의 체라고 불러요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        nums = VGroup(*[T(str(v), 70, INK) for v in (15, 17, 21, 23, 27)]).arrange(RIGHT, buff=1.0).move_to([0, 1.2, 0])
        self.say("소수를 모두 고르세요", "연습해 볼까요? 15, 17, 21, 23, 27 중 소수를 모두 골라 보세요.")
        self.play(FadeIn(nums), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        for n_, v in zip(nums, (15, 17, 21, 23, 27)):
            n_.set_color(GREEN if v in (17, 23) else SOFT)
        a = M(f"{g('17, 23')} (15 = 3 × 5, 21 = 3 × 7, 27 = 3 × 9)", 46).move_to([0, -0.4, 0])
        self.say(f"{g('17과 23')}", "17과 23이 소수예요. 15, 21, 27은 모두 3으로 나누어져요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
