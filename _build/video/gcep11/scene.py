"""「수학 원리 돋보기」 개념 차근차근 11화 — 뺄셈의 뜻: 덜어 내기와 비교하기

덜어 내기(쿠키 5개 중 2개 먹음 → 3) / 비교하기(빨강 5, 파랑 3 → 2개 더 많음) → 둘 다 5 − 2 = 3, 5 − 3 = 2
식 읽기, '차' / 뺄셈은 순서를 바꾸면 안 됨 / 이야기: − 기호도 비드만 1489년 책 / 연습 / 출처
최종: GRADE=c ./make_final.sh 11
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

class GcEp11(ConceptScene):
    EP_NO = 11
    EP_TITLE = "뺄셈의 뜻: 덜어 내기와 비교하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.take()
        self.compare()
        self.read()
        self.practice()
        show_sources(self, [
            "· − 기호가 처음 인쇄된 책: J. Widmann(라이프치히, 1489) — MacTutor 수학사 'Johannes Widman', MAA Convergence",
        ])
        self.closing(f"뺄셈은 {o('덜어 내기')}와 {b('비교하기')}: 5 − 2 = {g('3')}\n뺄셈은 순서를 바꾸면 안 돼요",
                     next_preview="개념 차근차근 12화 · = 는 '같다'예요")
        self.wait(0.5)

    def take(self):
        self.section("장면 ① 덜어 내기")
        a = dots(5, ORANGE, cols=5, step=0.8, r=0.3).move_to([0, 1.2, 0])
        self.say("쿠키 5개 중 2개를 먹으면?", "쿠키 5개가 있어요. 2개를 먹으면 몇 개가 남을까요?")
        self.play(FadeIn(a), run_time=0.5)
        xs = VGroup(*[cross_mark(0.36).move_to(a[k]) for k in (3, 4)])
        self.play(Create(xs), run_time=0.5)
        self.play(FadeOut(VGroup(a[3], a[4], xs)), run_time=0.6)
        e = M(f"5 − {o('2')} = {g('3')}", 90).move_to([0, -0.6, 0])
        self.say(f"남은 것은 {g('3개')}: 5 − 2 = 3", "남은 쿠키는 3개. 덜어 내고 남은 것을 구할 때 뺄셈을 써요. 5 빼기 2는 3.")
        self.play(Write(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def compare(self):
        self.section("장면 ② 비교하기")
        a = dots(5, RED, cols=5, step=0.8, r=0.28).move_to([0, 1.6, 0])
        c = dots(3, BLUE, cols=3, step=0.8, r=0.28)
        c.move_to(a[0].get_center() + DOWN * 1.1, aligned_edge=LEFT).shift(LEFT * 0.28)
        self.say("빨간 구슬 5개, 파란 구슬 3개", "빨간 구슬 5개와 파란 구슬 3개. 빨간 구슬이 몇 개 더 많을까요?")
        self.play(FadeIn(a), FadeIn(c), run_time=0.6)
        ls = VGroup(*[Line(a[k].get_bottom(), c[k].get_top(), color=SOFT, stroke_width=3) for k in range(3)])
        self.play(Create(ls), run_time=0.6)
        box = SurroundingRectangle(VGroup(a[3], a[4]), color=GREEN, buff=0.1)
        e = M(f"5 − 3 = {g('2')}", 90).move_to([0, -1.0, 0])
        self.say(f"{g('2개')} 더 많아요: 5 − 3 = 2", "짝을 지으면 빨간 구슬 2개가 남아요. 두 수의 차이를 구할 때도 뺄셈을 써요. 5 빼기 3은 2.")
        self.play(Create(box), Write(e), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def read(self):
        self.section("식을 읽어요")
        e = M(f"5 − 2 = {g('3')}", 100).move_to([0, 1.4, 0])
        r1 = M("5 빼기 2는 3과 같습니다", 46).move_to([0, 0.1, 0])
        r2 = M(f"5와 2의 {g('차')}는 3입니다", 46).move_to([0, -0.7, 0])
        self.say("뺀 결과는 '차'", "5 빼기 2는 3과 같습니다. 또는 5와 2의 차는 3입니다라고 읽어요.")
        self.play(FadeIn(e), FadeIn(r1), FadeIn(r2), run_time=0.8)
        t = M(f"2 − 5 는 5 − 2와 {o('달라요')} (순서를 바꾸면 안 돼요)", 42).move_to([0, -1.9, 0])
        self.say(f"순서를 바꾸면 {o('안 돼요')}", "덧셈과 달리 뺄셈은 순서를 바꾸면 안 돼요. 쿠키 2개에서 5개를 먹을 수는 없지요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q1 = M("① 사탕 8개 중 3개를 동생에게 주면 몇 개 남을까요?", 40).move_to([0, 1.4, 0])
        q2 = M("② 남학생 6명, 여학생 4명. 남학생이 몇 명 더 많을까요?", 40).move_to([0, 0.4, 0])
        self.say("뺄셈식을 쓰고 답을 구해요", "연습해 볼까요? 두 문제의 뺄셈식을 쓰고 답을 구해 보세요.")
        self.play(FadeIn(q1), FadeIn(q2), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"① 8 − 3 = {g('5')} (덜어 내기)    ② 6 − 4 = {g('2')} (비교하기)", 42).move_to([0, -1.2, 0])
        self.say(f"① {g('5개')}  ② {g('2명')}", "1번은 덜어 내기, 8 빼기 3은 5개. 2번은 비교하기, 6 빼기 4는 2명이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
