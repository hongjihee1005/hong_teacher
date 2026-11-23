"""「수학 원리 돋보기」 개념 차근차근 35화 — 소수는 언제 생겼을까? 0.1

1을 10칸으로 → 한 칸은 1/10 = 0.1(영 점 일) / 소수점 / 0.1이 7개 = 0.7, 1과 0.3 = 1.3 / 9 cm 3 mm = 9.3 cm
이야기: 10진 소수는 중국·이슬람 수학자(알카시 1427 등)가 먼저 썼고, 1585년 네덜란드 스테빈이 작은 책 『10분의 1』로 쉽게 알림(표기는 ⓪①②),
소수점은 그 뒤 네이피어 등이 퍼뜨림 / 연습 / 출처
최종: GRADE=c ./make_final.sh 35
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
from decimal4 import dec_markup, dec_vertical, grid100


class GcEp35(ConceptScene):
    EP_NO = 35
    EP_TITLE = "소수는 언제 생겼을까? 0.1"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.tenth()
        self.count()
        self.story()
        self.practice()
        show_sources(self, [
            "· S. Stevin 『De Thiende(10분의 1)』(1585): MacTutor 수학사 'Simon Stevin', 브리태니커 'decimal fraction'",
            "· 알카시 『계산의 열쇠』(1427)와 이슬람·중국의 10진 소수: MacTutor 'al-Kashi', 브리태니커 'al-Kashi'",
            "· 소수점을 널리 쓰게 된 일: 브리태니커 'decimal fraction'(네이피어), Scientific American 소수점 기사",
        ])
        self.closing(f"1을 10칸으로 나눈 한 칸: 1/10 = {g('0.1')} (영 점 일)\n0.1이 7개면 0.7, 1과 0.3이면 1.3",
                     next_preview="개념 차근차근 36화 · 소수 두 자리·세 자리")
        self.wait(0.5)

    def tenth(self):
        self.section("1을 10칸으로")
        bar = frac_bar(10, 1, width=8.0).move_to([0, 1.4, 0])
        self.say("막대 1을 똑같이 10칸으로", "길이가 1인 막대를 똑같이 10칸으로 나누었어요. 한 칸은 10분의 1이에요.")
        self.play(FadeIn(bar), run_time=0.6)
        e = row(frac(1, 10, 56, cn=ORANGE), M(f"= {g('0.1')}", 70), size=70).move_to([0, 0.0, 0])
        self.say(f"1/10 = {g('0.1')}, 영 점 일", "10분의 1을 0.1이라고 쓰고 영 점 일이라고 읽어요. 가운데 점을 소수점이라고 하고, 0.1 같은 수를 소수라고 해요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def count(self):
        self.section("0.1이 몇 개")
        bar = frac_bar(10, 7, width=8.0).move_to([0, 1.6, 0])
        e1 = M(f"0.1이 {o('7개')} → {g('0.7')}", 56).move_to([0, 0.5, 0])
        self.say("0.1이 7개면 0.7", "칠한 칸은 0.1이 7개. 0.7, 영 점 칠이에요.")
        self.play(FadeIn(bar), FadeIn(e1), run_time=0.7)
        e2 = M(f"1과 0.3 → {g('1.3')} (일 점 삼)", 52).move_to([0, -0.5, 0])
        e3 = M(f"9 cm 3 mm = {g('9.3 cm')} (1 mm = 0.1 cm)", 44).move_to([0, -1.4, 0])
        self.say("1과 0.3은 1.3", "1과 0.3을 합하면 1.3, 일 점 삼. 길이에서도 9센티미터 3밀리미터는 9.3센티미터예요. 1밀리미터가 0.1센티미터라서요.")
        self.play(FadeIn(e2), run_time=0.4)
        self.play(FadeIn(e3), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 소수의 처음")
        t1 = M(f"10으로 나누어 쓰는 소수는 {o('중국')}과 {o('이슬람 세계')}의\n수학자들이 먼저 썼어요 (알카시, 1427년 책)", 38).move_to([0, 1.7, 0])
        self.say("중국과 이슬람 수학자들이 먼저", "10으로 나누어 나타내는 소수는 옛 중국과 이슬람 세계의 수학자들이 먼저 썼어요. 1427년 알카시의 책에도 자세히 나와요.")
        self.play(FadeIn(t1), run_time=0.6)
        bk = book("10분의1").scale(0.55).move_to([-4.4, -0.4, 0])
        t2 = M(f"{o('1585년')} 네덜란드의 {b('스테빈')}이 작은 책으로\n누구나 쓸 수 있게 알렸어요 (표기: 9⓪3①)", 38).move_to([1.2, 0.0, 0])
        self.say(f"{o('1585년')}, 스테빈의 작은 책", "1585년 네덜란드의 스테빈은 『10분의 1』이라는 작은 책으로 소수를 누구나 쓸 수 있게 알렸어요. 그때는 숫자 뒤에 동그라미 번호를 붙여 썼대요.")
        self.play(FadeIn(bk), FadeIn(t2), run_time=0.6)
        t3 = M("지금처럼 점(.)을 찍는 방법은 그 뒤 네이피어 같은 수학자들이 널리 퍼뜨렸어요", 32, SOFT).move_to([0, -1.6, 0])
        self.say("점을 찍는 방법은 그 뒤에", "지금처럼 점을 찍는 방법은 그 뒤 네이피어 같은 수학자들이 널리 퍼뜨렸어요.")
        self.play(FadeIn(t3), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("① 0.1이 6개인 수   ② 2와 0.5를 합한 수", 52).move_to([0, 1.2, 0])
        self.say("소수로 나타내 보세요", "연습해 볼까요? 0.1이 6개인 수와, 2와 0.5를 합한 수를 소수로 써 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① {g('0.6')} (영 점 육)   ② {g('2.5')} (이 점 오)", 56).move_to([0, -0.4, 0])
        self.say(f"{g('0.6')}, {g('2.5')}", "0.6, 영 점 육. 그리고 2.5, 이 점 오예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
