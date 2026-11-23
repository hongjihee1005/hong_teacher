"""「수학 원리 돋보기」 개념 차근차근 29화 — ÷ 기호 이야기와 나눗셈 안내

나눗셈의 두 뜻 요약(똑같이 나누기 12 ÷ 3 = 4 / 몇 개씩 묶기) / 곱셈과 나눗셈은 가족(3 × 4 = 12 ↔ 12 ÷ 3 = 4)
이야기: ÷ 는 1659년 스위스 란의 책 『Teutsche Algebra』에 처음, 1668년 영어판으로 영국에 퍼짐, 그 전엔 뺄셈 표시로도 쓰였음(Cajori)
나눗셈 차근차근 시리즈(20편) 안내 / 출처
최종: GRADE=c ./make_final.sh 29
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
from prepkit import dish


class GcEp29(ConceptScene):
    EP_NO = 29
    EP_TITLE = "÷ 기호 이야기와 나눗셈 안내"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.meaning()
        self.family()
        self.story()
        self.guide()
        show_sources(self, [
            "· ÷ 기호가 처음 나온 책: J. H. Rahn, 『Teutsche Algebra』(1659) — MacTutor 수학사 'Johann Heinrich Rahn'",
            "· ÷ 가 그 전에 뺄셈 표시로도 쓰인 일: F. Cajori, 『A History of Mathematical Notations』(1928)",
        ])
        self.closing(f"나눗셈은 {o('똑같이 나누기')}와 {b('몇 개씩 묶기')}\n곱셈과 가족: 3 × 4 = 12 ↔ 12 ÷ 3 = {g('4')}",
                     next_preview="개념 차근차근 30화 · 만, 십만, 백만, 천만")
        self.wait(0.5)

    def meaning(self):
        self.section("나눗셈의 두 가지 뜻")
        t1 = M(f"① 사탕 12개를 {o('3명에게 똑같이')} → 한 명에게 4개", 44).move_to([0, 1.2, 0])
        t2 = M(f"② 사탕 12개를 {b('3개씩 묶으면')} → 4묶음", 44).move_to([0, 0.2, 0])
        e = M(f"둘 다 12 ÷ 3 = {g('4')}", 64).move_to([0, -1.1, 0])
        self.say("나눗셈의 두 가지 뜻", "나눗셈에는 두 가지 뜻이 있어요. 똑같이 나누어 주기, 그리고 몇 개씩 묶기. 둘 다 12 나누기 3은 4로 써요.")
        self.play(FadeIn(t1), run_time=0.4)
        self.play(FadeIn(t2), run_time=0.4)
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def family(self):
        self.section("곱셈과 나눗셈은 가족")
        e1 = M(f"{b('3')} × {o('4')} = {g('12')}", 70).move_to([0, 1.2, 0])
        e2 = M(f"{g('12')} ÷ {b('3')} = {o('4')}    {g('12')} ÷ {o('4')} = {b('3')}", 60).move_to([0, -0.2, 0])
        self.say("곱셈으로 나눗셈의 답을 찾아요", "3 곱하기 4는 12. 그래서 12 나누기 3은 4, 12 나누기 4는 3. 곱셈구구로 나눗셈의 답을 찾을 수 있어요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: ÷ 기호")
        sym = T("÷", 200, BLUE).move_to([-4.0, 0.6, 0])
        t1 = M(f"{o('1659년')} 스위스의 {b('란')}이 쓴\n대수 책에 처음 나와요", 42).move_to([1.6, 1.2, 0])
        self.say(f"{o('1659년')}, 스위스 란의 책", "나누기 기호는 1659년 스위스의 수학자 란이 쓴 대수 책에 처음 나와요. 이 책이 영어로 옮겨지면서 영국에도 퍼졌어요.")
        self.play(FadeIn(sym), FadeIn(t1), run_time=0.7)
        t2 = M("그 전에는 같은 모양이\n빼기 표시로 쓰이기도 했대요", 40).move_to([1.6, -0.6, 0])
        self.say("그 전에는 빼기 표시로도", "재미있게도 그 전에는 같은 모양이 빼기 표시로 쓰이기도 했대요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def guide(self):
        self.section("나눗셈 더 배우기")
        t = M(f"나눗셈은 {g('「나눗셈 차근차근」 20편')}에서\n뜻 · 나머지 · 세로셈 · 문장제까지 차근차근!", 46).move_to([0, 0.6, 0])
        self.say("나눗셈 차근차근 20편에서", "나눗셈은 나눗셈 차근차근 시리즈 20편에서 뜻과 나머지, 세로셈, 문장제까지 차근차근 배울 수 있어요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
