"""「수학 원리 돋보기」 개념 차근차근 21화 — 곱셈의 뜻: 묶어 세기와 몇 배

3개씩 4묶음 → 3 + 3 + 3 + 3 = 12 → 3 × 4 = 12 ('3 곱하기 4') / 몇 배: 3의 4배 / 같은 수를 여러 번 더할 때
이야기: × 는 1631년 오트레드 『Clavis Mathematicae』로 널리 퍼짐, 라이프니츠는 x와 헷갈린다며 점(·)을 씀(1698년 편지)
연습: 5개씩 3묶음 / 출처
최종: GRADE=c ./make_final.sh 21
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
from items import group_boxes, layout


class GcEp21(ConceptScene):
    EP_NO = 21
    EP_TITLE = "곱셈의 뜻: 묶어 세기와 몇 배"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.groups()
        self.times()
        self.story()
        self.practice()
        show_sources(self, [
            "· × 기호: W. Oughtred, 『Clavis Mathematicae』(런던, 1631) — F. Cajori, Nature 94(1914), MAA Convergence",
            "· 라이프니츠의 점(·): 1698년 요한 베르누이에게 보낸 편지 — MacTutor 수학사 'Earliest Uses of Symbols of Operation'",
        ])
        self.closing(f"{b('같은 수')}를 여러 번 더할 때 곱셈을 써요\n3개씩 4묶음 = 3의 4배 = 3 × 4 = {g('12')}",
                     next_preview="개념 차근차근 22화 · 2단·5단 만들기")
        self.wait(0.5)

    def groups(self):
        self.section("묶어 세기")
        its = VGroup(*[dot(RED, 0.22) for _ in range(12)])
        pts = layout(12, 3, 4, y=1.2, step=0.55, gap=1.1)
        for m, p in zip(its, pts):
            m.move_to(p)
        self.say("딸기가 몇 개일까요?", "딸기가 3개씩 묶음으로 있어요. 모두 몇 개일까요?")
        self.play(FadeIn(its, lag_ratio=0.05), run_time=0.8)
        bx = group_boxes(list(its), 3, 4)
        self.play(Create(bx), run_time=0.7)
        e = M(f"{b('3')} + {b('3')} + {b('3')} + {b('3')} = {g('12')}", 60).move_to([0, -0.4, 0])
        self.say("3씩 4번 더하면 12", "3개씩 4묶음이니 3을 네 번 더하면 12예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.0)
        self.settle()
        self.play(FadeOut(e), run_time=0.3)
        self.its, self.bx = its, bx

    def times(self):
        self.section("곱셈식으로")
        e = M(f"{b('3')} × {o('4')} = {g('12')}", 100).move_to([0, -0.5, 0])
        self.say(f"{b('3')} × {o('4')} = {g('12')}", "같은 수를 여러 번 더하는 것을 짧게 쓴 것이 곱셈이에요. 3 곱하기 4는 12.")
        self.play(Write(e), run_time=0.6)
        t = M(f"3개씩 {o('4묶음')} = 3의 {o('4배')}", 44).move_to([0, -1.8, 0])
        self.say(f"3의 {o('4배')}", "3개씩 4묶음을 3의 4배라고도 해요. 3의 4배는 12예요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: × 기호")
        bk = book("열쇠").scale(0.6).move_to([-4.2, 0.9, 0])
        yr = T("1631년", 48, ORANGE).next_to(bk, DOWN, buff=0.3)
        t = M(f"× 는 약 400년 전 영국의 수학 선생님\n{b('윌리엄 오트레드')}가 책에 쓰면서\n널리 퍼졌어요", 38).move_to([1.6, 1.0, 0])
        self.say(f"{o('1631년')}, 오트레드의 책", "곱하기 기호는 1631년 영국의 수학 선생님 윌리엄 오트레드가 『수학의 열쇠』라는 책에 쓰면서 널리 퍼졌어요.")
        self.play(FadeIn(bk), FadeIn(yr), FadeIn(t), run_time=0.8)
        d = M(f"라이프니츠: \"× 는 글자 x와 헷갈려요\" → {g('3 · 4')} 처럼 점을 썼어요", 36).move_to([0, -1.6, 0])
        self.say("라이프니츠는 점을 썼어요", "그런데 독일의 수학자 라이프니츠는 곱하기 기호가 알파벳 x와 헷갈린다며, 3 점 4처럼 점을 쓰자고 편지에 적었어요.")
        self.play(FadeIn(d), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        its = VGroup(*[dot(BLUE, 0.22) for _ in range(15)])
        for m, p in zip(its, layout(15, 5, 3, y=1.3, step=0.5, gap=1.0)):
            m.move_to(p)
        self.say("곱셈식으로 나타내 보세요", "연습해 볼까요? 구슬이 몇 개씩 몇 묶음인지 보고 곱셈식으로 나타내 보세요.")
        self.play(FadeIn(its), Create(group_boxes(list(its), 5, 3)), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"5개씩 3묶음 → {b('5')} × {o('3')} = {g('15')}", 56).move_to([0, -0.6, 0])
        self.say(f"5 × 3 = {g('15')}", "5개씩 3묶음이니 5 곱하기 3은 15예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
