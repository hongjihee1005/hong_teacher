"""「수학 원리 돋보기」 자연수 이야기 3화 — 자연수는 끝이 없어요, 그럼 0은?

- 모든 자연수에는 '다음 수'(1 더한 수)가 있다: 이탈리아 수학자 페아노, 1889년 『산술의 원리』 (MacTutor)
- 그래서 가장 큰 자연수는 없다(아무리 큰 수에도 1을 더할 수 있음)
- 0은 셀 때 쓰지 않음 / 0을 수로 다룬 기록: 인도 브라마굽타 628년 (MacTutor, Britannica) — 세는 수보다 훨씬 늦게
- 우리 초등 교과서: 자연수는 1부터(0은 넣지 않음). 수학책에 따라 0을 넣기도 함(국제 표준 ISO 80000-2) (Britannica, MathWorld)
최종: GRADE=n ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   ReplacementTransform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from items import check_mark, cross_mark
from storykit import book, show_sources


class NatScene(EpisodeScene):
    GRADE, SEM = "N", 1
    LABEL = "자연수 이야기 {}화"


class GnEp03(NatScene):
    EP_NO = 3
    EP_TITLE = "자연수는 끝이 없어요, 그럼 0은?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.next_number()
        self.biggest()
        self.zero()
        self.practice()
        show_sources(self, [
            "· 페아노의 '다음 수': MacTutor 수학사 'Giuseppe Peano' (1889년 『Arithmetices principia』)",
            "· 브라마굽타와 0(628년): MacTutor 'Brahmagupta'·'A history of Zero', 브리태니커 'Brahmagupta'",
            "· 0을 자연수에 넣는 정의와 넣지 않는 정의: 브리태니커 'natural number', Wolfram MathWorld",
            "· 우리 교과서의 자연수: 표준국어대사전 '자연수', 2022 개정 수학과 교육과정",
        ])
        self.closing(f"모든 자연수에는 {o('다음 수')}가 있어서 {g('끝이 없어요')}\n{b('0')}은 셀 때 쓰지 않아서, 우리 교과서에서는 자연수가 아니에요",
                     next_preview="자연수 이야기를 모두 마쳤어요!")
        self.wait(0.5)

    def next_number(self):
        self.section("다음 수")
        cells = VGroup()
        for i in range(1, 8):
            cells.add(T(str(i), 64, BLUE))
        cells.arrange(RIGHT, buff=0.9).move_to([0, 1.2, 0])
        arcs = VGroup(*[M(o("+1"), 30).move_to((cells[i].get_center() + cells[i + 1].get_center()) / 2 + UP * 0.55) for i in range(6)])
        self.say("자연수 다음에는 언제나 다음 수가 있어요", "1 다음은 2, 2 다음은 3. 자연수에는 언제나 1을 더한 다음 수가 있어요.")
        self.play(FadeIn(cells[0]), run_time=0.4)
        for i in range(6):
            self.play(FadeIn(arcs[i]), FadeIn(cells[i + 1], shift=RIGHT * 0.2), run_time=0.4)
        bk = book("수").scale(0.6).move_to([-4.6, -1.0, 0])
        t = M(f"이탈리아 수학자 {o('페아노')}(1889년):\n'모든 자연수에는 {o('다음 수')}가 있다'", 40).move_to([1.2, -1.1, 0])
        self.say(f"{o('페아노')}가 정리한 자연수의 약속", "이탈리아의 수학자 페아노는 1889년에 쓴 책에서 자연수의 규칙을 정리했어요. 가장 중요한 것이 모든 자연수에는 다음 수가 있다는 것이에요.")
        self.play(FadeIn(bk), FadeIn(t), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def biggest(self):
        self.section("가장 큰 자연수는?")
        q = M("가장 큰 자연수는 무엇일까요?", 54).move_to([0, 2.0, 0])
        self.say("가장 큰 자연수는 무엇일까요?", "그럼 가장 큰 자연수는 무엇일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        tries = ["100", "10000", "1000000"]
        cur = None
        for s in tries:
            n1 = int(s) + 1
            line = M(f"{b(s)}  →  {b(s)} + {o('1')} = {g(str(n1))}", 52).move_to([0, 0.3, 0])
            if line.width > 12.6:
                line.scale_to_fit_width(12.6)
            self.say(f"{s}보다 1 큰 수 {n1}", f"{s}이라고 하면, {s} 더하기 1이 있어요. 더 큰 수가 생기지요.")
            self.play(FadeIn(line) if cur is None else ReplacementTransform(cur, line), run_time=0.6)
            cur = line
            self.wait(0.4)
        t = M(f"아무리 큰 수도 {o('1')}을 더하면 더 커져요\n→ 가장 큰 자연수는 {g('없어요')}", 42).move_to([0, -1.5, 0])
        self.say(f"가장 큰 자연수는 {g('없어요')}", "아무리 큰 수를 말해도 1을 더하면 더 큰 수가 생겨요. 그래서 가장 큰 자연수는 없어요. 자연수는 끝없이 이어져요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def zero(self):
        self.section("0은 자연수일까?")
        plate = M(f"접시에 사과가 {g('없어요')} → {b('0')}개", 50).move_to([0, 2.0, 0])
        self.say("아무것도 없을 때는 0", "접시에 아무것도 없으면 0개라고 해요. 그런데 0은 하나, 둘 하고 셀 때는 나오지 않아요.")
        self.play(FadeIn(plate), run_time=0.6)
        t1 = M(f"0을 {o('수')}로 다룬 기록: 인도 {o('브라마굽타')}, {o('628년')}", 42).move_to([0, 0.8, 0])
        self.say(f"0을 수로 다룬 것은 {o('628년')} 인도", "0을 다른 수처럼 더하고 빼는 수로 다룬 기록은 인도의 수학자 브라마굽타가 628년에 쓴 책에 나와요.")
        self.play(FadeIn(t1), run_time=0.6)
        t2 = M(f"세는 수는 수만 년 전부터 → 0은 {g('훨씬 나중에')} 수가 되었어요", 40).move_to([0, -0.1, 0])
        self.say(f"0은 {g('훨씬 나중에')} 수가 되었어요", "사람들은 수만 년 전부터 수를 세었지만, 0은 훨씬 나중에야 수로 쓰이게 되었어요.")
        self.play(FadeIn(t2), run_time=0.6)
        self.settle()
        ok = M(f"우리 교과서: 자연수 = {b('1, 2, 3, …')}  ({b('0')}은 넣지 않아요)", 42).move_to([0, -1.2, 0])
        self.say(f"우리 교과서에서 자연수는 {b('1부터')}", "그래서 우리 교과서에서 자연수는 세는 수 1, 2, 3이에요. 0은 자연수에 넣지 않아요.")
        self.play(FadeIn(ok), run_time=0.6)
        n = M("(어떤 수학책이나 국제 표준에서는 0을 넣기도 해요)", 32, SOFT).move_to([0, -2.0, 0])
        self.say("0을 넣는 책도 있어요", "참고로 어른들이 보는 어떤 수학책이나 국제 표준에서는 0도 자연수에 넣기도 해요. 정하는 방법이 두 가지인 셈이에요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("자연수를 찾아요")
        items = ["7", "0", "15", "100", "2분의 1", "3"]
        oks = [True, False, True, True, False, True]
        cards = VGroup(*[M(x, 56) for x in items]).arrange(RIGHT, buff=0.9).move_to([0, 0.8, 0])
        self.say("이 가운데 자연수를 모두 찾아보세요", "이 가운데 우리 교과서의 자연수를 모두 찾아보세요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.9)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        marks = VGroup(*[(check_mark(0.45) if ok else cross_mark(0.35)).next_to(c, DOWN, buff=0.4) for c, ok in zip(cards, oks)])
        self.say(f"자연수: {g('7, 15, 100, 3')}", "자연수는 7, 15, 100, 3이에요. 0과 2분의 1은 셀 때 쓰는 수가 아니라서 자연수가 아니에요.")
        self.play(FadeIn(marks, lag_ratio=0.15), run_time=0.9)
        t = M(f"0과 {o('분수')}는 자연수가 아니에요", 42).move_to([0, -1.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
