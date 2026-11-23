"""「수학 원리 돋보기」 개념 차근차근 44화 — 공약수와 최대공약수

12와 18의 약수 → 겹치는 것 1, 2, 3, 6(공약수), 가장 큰 6(최대공약수) / 공약수는 최대공약수의 약수
나누어 구하기(공통으로 나누는 수: 2, 3 → 2 × 3 = 6) / 생활: 사탕 12개·초콜릿 18개를 남김없이 똑같이 나눌 최대 인원
이야기(짧게): 유클리드 『원론』 7권에 두 수를 서로 빼고 나누어 최대공약수를 찾는 방법이 실려 있음 / 연습: 16과 24 / 출처
최종: GRADE=c ./make_final.sh 44
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


class GcEp44(ConceptScene):
    EP_NO = 44
    EP_TITLE = "공약수와 최대공약수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.common()
        self.divide()
        self.life()
        self.story()
        self.practice()
        show_sources(self, [
            "· 최대공약수를 찾는 방법(서로 빼고 나누기): 유클리드 『원론』 7권 1·2명제 — D. E. Joyce, Clark 대학교 원론 자료",
        ])
        self.closing(f"두 수의 공통인 약수 = {b('공약수')}, 그중 가장 큰 수 = {g('최대공약수')}\n12와 18 → 공약수 1, 2, 3, 6 · 최대공약수 {g('6')}",
                     next_preview="개념 차근차근 45화 · 공배수와 최소공배수")
        self.wait(0.5)

    def common(self):
        self.section("두 수의 약수에서 겹치는 것")
        a = M(f"12의 약수: {b('1')}, {b('2')}, {b('3')}, 4, {b('6')}, 12", 46).move_to([0, 1.6, 0])
        c = M(f"18의 약수: {b('1')}, {b('2')}, {b('3')}, {b('6')}, 9, 18", 46).move_to([0, 0.8, 0])
        self.say("12와 18의 약수", "12의 약수와 18의 약수를 나란히 써 볼까요?")
        self.play(FadeIn(a), FadeIn(c), run_time=0.6)
        t1 = M(f"공약수: {b('1, 2, 3, 6')}", 50).move_to([0, -0.3, 0])
        t2 = M(f"최대공약수: {g('6')}", 56).move_to([0, -1.2, 0])
        self.say(f"겹치는 것은 {b('공약수')}, 가장 큰 것은 {g('최대공약수')}", "두 수에 공통으로 있는 약수 1, 2, 3, 6을 공약수, 그중 가장 큰 6을 최대공약수라고 해요. 공약수는 모두 최대공약수 6의 약수예요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def divide(self):
        self.section("나누어 구하기")
        rows = VGroup(M(f"{o('2')} ) 12   18", 56), M(f"{o('3')} )   6     9", 56), M("        2     3", 56)).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to([-2.4, 0.6, 0])
        self.say("두 수를 함께 나누어요", "두 수를 함께 나눌 수 있는 수로 계속 나누어요. 12와 18을 2로 나누면 6과 9, 다시 3으로 나누면 2와 3. 더는 함께 나눌 수 없어요.")
        self.play(FadeIn(rows, lag_ratio=0.4), run_time=1.2)
        t = M(f"왼쪽 수를 곱하면\n최대공약수 {o('2')} × {o('3')} = {g('6')}", 46).move_to([3.0, 0.6, 0])
        self.say(f"2 × 3 = {g('6')}", "왼쪽에 나눈 수 2와 3을 곱하면 최대공약수 6이에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def life(self):
        self.section("생활 속 최대공약수")
        t = M("사탕 12개, 초콜릿 18개를 남김없이 똑같이 나누어 주려면\n최대 몇 명에게 줄 수 있을까요?", 42).move_to([0, 1.3, 0])
        a = M(f"12와 18의 최대공약수 → {g('6명')} (사탕 2개, 초콜릿 3개씩)", 46).move_to([0, -0.3, 0])
        self.say(f"최대 {g('6명')}", "사탕 12개와 초콜릿 18개를 남김없이 똑같이 나누어 주려면, 두 수를 모두 나누어떨어지게 하는 가장 큰 수, 최대공약수 6명에게 줄 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 2000년도 넘은 방법")
        bk = book("원론").scale(0.6).move_to([-4.2, 0.6, 0])
        t = M("약 2300년 전 그리스 수학자 유클리드의 책 『원론』에는\n두 수를 서로 빼고 나누어 최대공약수를 찾는 방법이\n실려 있어요. 지금도 쓰는 방법이에요", 36).move_to([1.4, 0.6, 0])
        self.say("유클리드의 『원론』", "그리스 수학자 유클리드의 책 『원론』에는 두 수를 서로 빼고 나누어 최대공약수를 찾는 방법이 실려 있어요. 지금도 컴퓨터가 쓰는 방법이에요.")
        self.play(FadeIn(bk), FadeIn(t), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("16과 24의 최대공약수는?", 60).move_to([0, 1.2, 0])
        self.say("16과 24의 최대공약수는?", "연습해 볼까요? 16과 24의 최대공약수를 구해 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"2로 세 번: 16, 24 → 8, 12 → 4, 6 → 2, 3 → 2 × 2 × 2 = {g('8')}", 44).move_to([0, -0.4, 0])
        self.say(f"{g('8')}", "2로 세 번 나누면 2와 3이 남아요. 2 곱하기 2 곱하기 2, 최대공약수는 8이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
