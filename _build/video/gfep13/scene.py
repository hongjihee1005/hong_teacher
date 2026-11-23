"""「수학 원리 돋보기」 분수 특별편 13화 — 분수 이야기 ② 분수를 쓰는 모양은 어떻게 바뀌었을까?

사실 확인(2026-11, 출처는 영상 끝):
- 인도: 브라마굽타(628년쯤)·바스카라(1150년쯤)는 분자를 위, 분모를 아래에 썼지만 가로선이 없었음 (MacTutor, Jeff Miller 'fractions')
- 가로선: 12세기 북아프리카 알하사르의 책이 가로선을 쓴 가장 오래된 기록으로 알려짐 (MAA Convergence — '처음인 듯하다'고 표현)
- 피보나치 『산반서(Liber Abaci)』 1202년: 유럽에서 처음 가로선, 대분수를 쓸 때 분수를 자연수 왼쪽에 씀(2/6 8 = 8과 6분의 2) (MAA)
- 빗금(/): 18~19세기에 인쇄하기 편해서 퍼짐 (MacTutor, Jeff Miller — Cajori 인용)
최종: GRADE=f ./make_final.sh 13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, ReplacementTransform,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row
from fracbasic import mixed_wide
from items import check_mark
from storykit import book, show_sources, timeline


def nobar(n, d, size=80):
    top = T(str(n), size, ORANGE)
    bot = T(str(d), size, BLUE)
    return VGroup(top, bot).arrange(DOWN, buff=0.15)


class GfEp13(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 13
    EP_TITLE = "분수 이야기 ② 분수를 쓰는 모양은 어떻게 바뀌었을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.india()
        self.bar()
        self.fibonacci()
        self.slash()
        self.line()
        show_sources(self, [
            "· 인도의 분수 쓰기·빗금: MacTutor 수학사, Jeff Miller 'Earliest Uses of Symbols … Fractions'",
            "  (F. Cajori, 『A History of Mathematical Notations』 인용)",
            "· 알하사르의 가로선, 피보나치의 대분수 쓰기: 미국수학협회(MAA) Convergence 자료",
            "· 피보나치 『산반서(Liber Abaci)』 1202년: 브리태니커 백과 'Fibonacci'",
        ])
        self.closing(f"인도 — {o('위아래')}로 쓰기, 북아프리카·유럽 — {b('가로선')} 더하기\n오늘날의 분수 모양은 오랜 시간에 걸쳐 만들어졌어요",
                     next_preview="분수 특별편 14화 · 진분수·가분수·대분수, 이름에 담긴 뜻")
        self.wait(0.5)

    def india(self):
        self.section("인도 · 약 1400년 전")
        self.say("옛날 사람들은 분수를 어떻게 썼을까요?", "지금 우리는 분수를 가로선 위아래에 써요. 옛날 사람들도 이렇게 썼을까요?")
        now = frac(3, 4, 100, cn=ORANGE, cd=BLUE).move_to([3.6, 0.9, 0])
        nl = M("오늘날", 36).next_to(now, DOWN, buff=0.4)
        self.play(FadeIn(now), FadeIn(nl), run_time=0.6)
        old = nobar(3, 4, 100).move_to([-3.4, 0.9, 0])
        ol = M("인도의 옛 수학책", 36).next_to(old, DOWN, buff=0.4)
        self.say(f"인도: 위에 {o('분자')}, 아래에 {b('분모')} — 그런데 {g('가로선이 없어요')}",
                 "인도의 수학자 브라마굽타는 약 1400년 전, 628년쯤에 분자를 위에, 분모를 아래에 썼어요. 그런데 가운데 가로선은 없었어요.")
        self.play(FadeIn(old), FadeIn(ol), run_time=0.7)
        self.play(Indicate(old, color=GREEN, scale_factor=1.1), run_time=0.8)
        t = M("위아래로 쓰는 방법은 인도에서 왔다고 보는 학자가 많아요", 38, SOFT).move_to([0, -2.1, 0])
        self.say("위아래로 쓰는 방법", "지금처럼 위아래로 쓰는 방법은 인도에서 시작되었다고 보는 학자가 많아요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def bar(self):
        self.section("가로선이 생겼어요 · 약 900년 전")
        old = nobar(3, 4, 100).move_to([0, 0.5, 0])
        self.say("가로선은 언제 생겼을까요?", "그럼 가운데 가로선은 언제 생겼을까요?")
        self.play(FadeIn(old), run_time=0.5)
        ln = Line(LEFT * 0.55, RIGHT * 0.55, color=INK, stroke_width=8).move_to(old.get_center())
        self.play(old[0].animate.shift(UP * 0.15), old[1].animate.shift(DOWN * 0.15), run_time=0.5)
        self.play(Create(ln), run_time=0.7)
        t = M(f"12세기 북아프리카의 수학자 {b('알하사르')}의 책", 42).move_to([0, -1.2, 0])
        self.say(f"12세기 북아프리카 {b('알하사르')}의 책", "지금 남아 있는 기록 가운데 가로선을 쓴 가장 오래된 것은 12세기 북아프리카의 수학자 알하사르의 책으로 알려져 있어요.")
        self.play(FadeIn(t), run_time=0.6)
        t2 = M("(아랍 세계의 수학자들이 쓰던 방법)", 34, SOFT).next_to(t, DOWN, buff=0.25)
        self.play(FadeIn(t2), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def fibonacci(self):
        self.section("유럽 · 피보나치 1202년")
        bk = book("산반서").move_to([-4.9, 0.4, 0])
        nm = M("『산반서』\n(1202년)", 32).next_to(bk, DOWN, buff=0.25)
        self.say(f"이탈리아의 {o('피보나치')}가 유럽에 알렸어요", "이탈리아의 피보나치는 1202년 산반서라는 책을 썼어요. 이 책에서 가로선 분수를 썼고, 유럽에 널리 알렸어요.")
        self.play(FadeIn(bk), FadeIn(nm), run_time=0.7)
        q = M("그런데 피보나치는 대분수를 이렇게 썼어요", 38).move_to([1.6, 2.35, 0])
        old = row(frac(2, 6, 70, cn=ORANGE, cd=BLUE), T("8", 90, GREEN), size=60, buff=0.25).move_to([1.4, 0.5, 0])
        self.say("분수를 자연수 왼쪽에!", "그런데 재미있게도 피보나치는 대분수를 쓸 때 분수를 자연수의 왼쪽에 썼어요. 아랍 사람들이 쓰던 방법이었어요.")
        self.play(FadeIn(q), FadeIn(old), run_time=0.7)
        arrow = M("→", 60).move_to([1.4, -0.7, 0])
        now = mixed_wide(8, 2, 6, 70, cw=GREEN, cn=ORANGE, cd=BLUE).move_to([1.4, -1.85, 0])
        nl = M("오늘날: 8과 6분의 2", 34).next_to(now, RIGHT, buff=0.5)
        self.say(f"오늘날은 {g('자연수를 먼저')}: 8과 6분의 2", "오늘날 우리는 자연수를 먼저 쓰고 분수를 오른쪽에 써요. 8과 6분의 2라고 읽지요.")
        self.play(FadeIn(arrow), FadeIn(now), FadeIn(nl), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def slash(self):
        self.section("빗금(/)으로 쓰기")
        a = frac(3, 4, 100, cn=ORANGE, cd=BLUE).move_to([-2.4, 0.5, 0])
        s = M(f"{o('3')}/{b('4')}", 100).move_to([2.4, 0.5, 0])
        self.say("3/4처럼 빗금으로 쓰기도 해요", "가끔 3, 빗금, 4처럼 한 줄로 쓴 분수를 보지요?")
        self.play(FadeIn(a), FadeIn(s), run_time=0.6)
        t = M(f"훨씬 뒤 {o('18~19세기')}에 인쇄하기 편해서 퍼졌어요", 42).move_to([0, -1.2, 0])
        self.say(f"{o('18~19세기')}, 인쇄하기 편해서", "이 빗금 쓰기는 훨씬 뒤인 18세기에서 19세기 무렵, 책에 인쇄하기 편해서 널리 퍼졌어요.")
        self.play(FadeIn(t), run_time=0.5)
        t2 = M(f"학교 수학에서는 {g('가로선')}으로 써요", 40).move_to([0, -2.1, 0])
        self.say(f"학교에서는 {g('가로선')}으로 써요", "우리 교과서에서는 가로선으로 쓰는 분수를 배워요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def line(self):
        self.section("한눈에 보기")
        tl = timeline([("인도\n628년쯤", 0.1), ("알하사르\n12세기", 0.4), ("피보나치\n1202년", 0.55), ("빗금\n18~19세기", 0.82)], y=0.7)
        self.say("분수 모양의 역사", "분수를 쓰는 모양은 이렇게 여러 나라를 거치며 조금씩 바뀌어 왔어요.")
        self.play(Create(tl.bar), FadeIn(tl.marks, lag_ratio=0.4), run_time=1.4)
        t = M(f"위아래로 쓰기({o('인도')}) + 가로선({b('북아프리카')}) → 오늘날의 분수", 40).move_to([0, -1.6, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
