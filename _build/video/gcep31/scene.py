"""「수학 원리 돋보기」 개념 차근차근 31화 — 억과 조, 네 자리씩 끊어 읽기

천만의 10배 = 1억, 천억의 10배 = 1조 / 네 자리씩 끊으면 일 → 만 → 억 → 조 / 3845억 2600만
이야기: 우리는 네 자리마다 새 이름(만·억·조) — 옛 중국 수학책 『손자산경』의 '만의 만 배가 억, 억의 만 배가 조'
영어는 세 자리마다(thousand, million) → 쉼표를 세 자리마다 / 연습 / 출처
최종: GRADE=c ./make_final.sh 31
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
from bignum import chunk_row, grp_markup


class GcEp31(ConceptScene):
    EP_NO = 31
    EP_TITLE = "억과 조, 네 자리씩 끊어 읽기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.eok()
        self.cut()
        self.story()
        self.practice()
        show_sources(self, [
            "· '만의 만 배가 억, 억의 만 배가 조': 『손자산경(孫子算經)』 — 중국 고전 원문(ctext.org)",
            "· 옛 중국의 큰 수 단위: 브리태니커 'Shushu jiyi' / 영어 million의 유래: Online Etymology Dictionary",
        ])
        self.closing(f"{g('네 자리씩')} 끊으면 일 · {b('만')} · {o('억')} · 조\n천만의 10배 = 1억, 천억의 10배 = 1조",
                     next_preview="개념 차근차근 32화 · 뛰어 세기와 큰 수의 크기 비교")
        self.wait(0.5)

    def eok(self):
        self.section("억과 조")
        e1 = M(f"천만의 10배 = {o('1억')} (100000000)", 54).move_to([0, 1.4, 0])
        e2 = M(f"천억의 10배 = {g('1조')} (1000000000000)", 54).move_to([0, 0.2, 0])
        self.say(f"천만의 10배는 {o('1억')}", "천만의 10배는 1억이에요. 1 뒤에 0이 여덟 개. 그리고 천억의 10배는 1조, 0이 열두 개예요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.play(FadeIn(e2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def cut(self):
        self.section("네 자리씩 끊어 읽기")
        raw = T("384526000000", 76, INK).move_to([0, 1.6, 0])
        self.say("384526000000, 읽기 어렵지요?", "384526000000. 이렇게 길면 읽기 어렵지요? 오른쪽부터 네 자리씩 끊어 볼까요?")
        self.play(Write(raw), run_time=0.6)
        nums, labs = chunk_row("384526000000", size=76)
        grp = VGroup(nums, labs).move_to([0, -0.1, 0])
        self.play(FadeIn(nums), FadeIn(labs), run_time=0.8)
        r = M(f"3845{o('억')} 2600{b('만')} → {g('삼천팔백사십오억 이천육백만')}", 46).move_to([0, -2.0, 0])
        self.say("끊은 곳마다 억, 만을 붙여요", "끊은 곳마다 억, 만을 붙여 읽으면 삼천팔백사십오억 이천육백만이에요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 왜 네 자리씩일까?")
        t1 = M(f"옛 중국 수학책 『손자산경』:\n\"{o('만의 만 배가 억')}, {g('억의 만 배가 조')}\"", 44).move_to([0, 1.4, 0])
        self.say("옛 수학책에 적힌 단위", "옛 중국의 수학책 『손자산경』에는 만의 만 배가 억, 억의 만 배가 조라고 적혀 있어요. 그래서 우리는 네 자리마다 새 이름을 붙여요.")
        self.play(FadeIn(t1), run_time=0.6)
        t2 = M(f"영어는 {b('세 자리')}마다 새 이름: thousand, million …\n그래서 수에 쉼표를 세 자리마다 찍어요 (1,000,000)", 38).move_to([0, -0.4, 0])
        self.say("영어는 세 자리마다", "영어는 thousand, million처럼 세 자리마다 이름이 바뀌어서, 수에 쉼표를 세 자리마다 찍어요.")
        self.play(FadeIn(t2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = T("207000050000", 76, INK).move_to([0, 1.2, 0])
        self.say("네 자리씩 끊어 읽어 보세요", "연습해 볼까요? 이 수를 네 자리씩 끊어 읽어 보세요.")
        self.play(Write(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"2070억 5만 → {g('이천칠십억 오만')}", 56).move_to([0, -0.4, 0])
        self.say(f"{g('이천칠십억 오만')}", "2070 0005 0000. 이천칠십억 오만이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
