"""「수학 원리 돋보기」 개념 차근차근 4화 — 10개씩 묶음과 낱개: 자릿값

구슬 23개를 10개씩 묶으면 2묶음과 낱개 3 → 23 / 십 모형·일 모형 / 같은 숫자 2도 자리에 따라 20과 2
이야기: 0~9 열 개로 어떤 수든 쓰는 방법은 인도에서 생겨 아랍을 거쳐 유럽으로(피보나치 1202년 『산반서』)
연습: 10개씩 4묶음과 낱개 7 → 47 / 출처 화면 (SOURCES_CONCEPT.md)
최종: GRADE=c ./make_final.sh 4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, RED
from base10 import number_blocks
from bignum import PlaceChart
from storykit import book, show_sources, timeline


class GcEp04(ConceptScene):
    EP_NO = 4
    EP_TITLE = "10개씩 묶음과 낱개: 자릿값"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.bundle()
        self.blocks()
        self.place()
        self.story()
        self.practice()
        show_sources(self, [
            "· 인도 숫자가 아랍을 거쳐 유럽으로: MacTutor 수학사 'The Arabic numeral system', 브리태니커 'al-Khwarizmi'",
            "· 피보나치 『산반서(Liber Abaci)』 1202년, 첫 장의 '아홉 개의 인도 숫자와 0': L. E. Sigler 영역 『Fibonacci's Liber Abaci』(Springer, 2002)",
        ])
        self.closing(f"{b('10개씩 묶음')}은 십의 자리, {o('낱개')}는 일의 자리\n같은 숫자도 {g('자리')}에 따라 값이 달라요 (23의 2는 20)",
                     next_preview="개념 차근차근 5화 · 100까지의 수, 뛰어 세기")
        self.wait(0.5)

    def bundle(self):
        self.section("10개씩 묶어 세기")
        ds = VGroup(*[dot(RED, 0.17) for _ in range(23)])
        for i, d in enumerate(ds):
            d.move_to([-5.2 + (i % 12) * 0.5, 1.6 - (i // 12) * 0.5 + ((i * 7) % 5 - 2) * 0.05, 0])
        self.say("구슬이 몇 개일까요?", "구슬이 많아요. 하나씩 세면 헷갈리지요. 10개씩 묶어 세어 볼까요?")
        self.play(FadeIn(ds, lag_ratio=0.03), run_time=1.0)
        targets = []
        for i in range(23):
            if i < 20:
                gi, k = divmod(i, 10)
                targets.append([-4.6 + gi * 3.2 + (k % 5) * 0.42, 0.2 - (k // 5) * 0.42, 0])
            else:
                targets.append([2.4 + (i - 20) * 0.5, 0.0, 0])
        self.play(*[d.animate.move_to(p) for d, p in zip(ds, targets)], run_time=1.4)
        boxes = VGroup(*[SurroundingRectangle(VGroup(*ds[k * 10:(k + 1) * 10]), color=BLUE, buff=0.12) for k in range(2)])
        self.play(Create(boxes), run_time=0.6)
        t = M(f"10개씩 {b('2묶음')}과 낱개 {o('3개')} → {g('23')}", 52).move_to([0, -1.6, 0])
        self.say(f"10개씩 {b('2묶음')}과 낱개 {o('3개')}: {g('23')}", "10개씩 2묶음과 낱개 3개. 그래서 23, 이십삼 또는 스물셋이에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def blocks(self):
        self.section("십 모형과 일 모형")
        bl = number_blocks(23, size=0.3).move_to([-2.6, 0.6, 0])
        self.say("10개씩 묶음은 십 모형으로", "10개씩 묶음 하나를 막대 하나로 나타낸 것이 십 모형, 낱개 하나는 일 모형이에요.")
        self.play(FadeIn(bl, lag_ratio=0.1), run_time=0.8)
        ch = PlaceChart(["십", "일"], cell_w=1.5).move_to([3.0, 0.6, 0])
        self.play(FadeIn(ch), run_time=0.4)
        ch.fill(self, "23")
        t = M(f"{b('십의 자리')} 2 · {o('일의 자리')} 3", 48).move_to([0, -1.8, 0])
        self.say(f"{b('십의 자리')} 2, {o('일의 자리')} 3", "십 모형의 수 2는 십의 자리에, 일 모형의 수 3은 일의 자리에 써요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def place(self):
        self.section("자리에 따라 값이 달라요")
        a = T("23", 140, INK).move_to([-3.0, 0.8, 0])
        c = T("32", 140, INK).move_to([3.0, 0.8, 0])
        a[0].set_color(BLUE); a[1].set_color(ORANGE); c[0].set_color(BLUE); c[1].set_color(ORANGE)
        self.say("23과 32, 숫자는 같은데?", "23과 32는 같은 숫자 2와 3으로 썼어요. 그런데 같은 수일까요?")
        self.play(Write(a), Write(c), run_time=0.7)
        la = M(f"2 → {b('20')}, 3 → {o('3')}", 44).next_to(a, DOWN, buff=0.4)
        lc = M(f"3 → {b('30')}, 2 → {o('2')}", 44).next_to(c, DOWN, buff=0.4)
        self.play(FadeIn(la), FadeIn(lc), run_time=0.6)
        t = M(f"숫자가 놓인 {g('자리')}가 값을 정해요: {g('자릿값')}", 46).move_to([0, -1.9, 0])
        self.say(f"{g('자릿값')}", "23의 2는 20이지만, 32의 2는 그냥 2예요. 숫자가 놓인 자리가 값을 정해요. 이것을 자릿값이라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 열 개의 숫자")
        digs = T("0 1 2 3 4 5 6 7 8 9", 64, BLUE).move_to([0, 2.3, 0])
        self.say("숫자는 0부터 9까지 열 개뿐", "우리가 쓰는 숫자는 0부터 9까지 열 개뿐이에요. 자릿값 덕분에 열 개만으로 어떤 큰 수든 쓸 수 있어요.")
        self.play(Write(digs), run_time=0.8)
        tl = timeline([("인도", 0.1), ("아랍 학자들", 0.5), ("유럽", 0.9)], y=1.1, size=36)
        self.say(f"{o('인도')}에서 생겨 아랍을 거쳐 유럽으로", "이렇게 수를 쓰는 방법은 인도에서 생겨, 아랍의 학자들을 거쳐 유럽으로 전해졌어요. 그래서 아라비아 숫자라고도 하지만, 처음 생긴 곳은 인도예요.")
        self.play(FadeIn(tl), run_time=0.8)
        bk = book("산반서").scale(0.6).move_to([-4.2, -1.0, 0])
        t = M(f"피보나치(이탈리아)가 {o('1202년')} 책에\n'아홉 개의 인도 숫자와 0이면\n어떤 수든 쓸 수 있다'", 34).move_to([1.6, -1.0, 0])
        self.say(f"피보나치, {o('1202년')} 『산반서』", "1202년 이탈리아의 피보나치는 『산반서』라는 책의 첫 장에, 아홉 개의 인도 숫자와 0만 있으면 어떤 수든 쓸 수 있다고 적어 유럽에 알렸어요.")
        self.play(FadeIn(bk), FadeIn(t), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        bl = number_blocks(47, size=0.22).move_to([0, 1.5, 0])
        q = M(f"10개씩 {b('4묶음')}과 낱개 {o('7개')}는?", 52).move_to([0, -0.4, 0])
        self.say("10개씩 4묶음과 낱개 7개는?", "연습해 볼까요? 10개씩 4묶음과 낱개 7개는 얼마일까요?")
        self.play(FadeIn(bl, lag_ratio=0.1), FadeIn(q), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"{g('47')} (사십칠, 마흔일곱)", 56).move_to([0, -1.8, 0])
        self.say(f"{g('47')}", "십의 자리 4, 일의 자리 7. 47, 사십칠 또는 마흔일곱이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
