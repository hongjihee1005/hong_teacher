"""「수학 원리 돋보기」 개념 차근차근 10화 — 덧셈의 뜻: 모으기와 더하기

두 묶음을 합치기(합병: 빨간 3 + 파란 2) / 늘어나기(첨가: 3마리에 2마리가 더 옴) → 둘 다 3 + 2 = 5
식 읽기 '3 더하기 2는 5', '3과 2의 합은 5' / 바꾸어 더해도 같음 2 + 3
이야기: + 기호가 처음 인쇄된 책 — 요하네스 비드만, 1489년 독일 라이프치히의 상업 계산책(그때는 '남음' 표시에 가까웠다는 해석)
연습: 4 + 3 / 출처 화면
최종: GRADE=c ./make_final.sh 10
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


class GcEp10(ConceptScene):
    EP_NO = 10
    EP_TITLE = "덧셈의 뜻: 모으기와 더하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.join()
        self.more()
        self.read()
        self.story()
        self.practice()
        show_sources(self, [
            "· + 기호가 처음 인쇄된 책: J. Widmann, 『Behend und hüpsch Rechnung uff allen Kauffmanschafften』(라이프치히, 1489)",
            "  — MacTutor 수학사 'Johannes Widman', 미국수학협회(MAA) Convergence 'Widman's Commercial Arithmetic'",
        ])
        self.closing(f"덧셈은 {b('합치기')}와 {o('늘어나기')}: 3 + 2 = {g('5')}\n순서를 바꾸어 더해도 같아요: 2 + 3 = 5",
                     next_preview="개념 차근차근 11화 · 뺄셈의 뜻: 덜어 내기와 비교하기")
        self.wait(0.5)

    def join(self):
        self.section("장면 ① 합치기")
        a = dots(3, RED, cols=3, step=0.7, r=0.28).move_to([-3.4, 1.0, 0])
        c = dots(2, BLUE, cols=2, step=0.7, r=0.28).move_to([3.4, 1.0, 0])
        self.say("빨간 풍선 3개와 파란 풍선 2개", "빨간 풍선 3개와 파란 풍선 2개가 있어요. 풍선은 모두 몇 개일까요?")
        self.play(FadeIn(a), FadeIn(c), run_time=0.6)
        self.play(a.animate.move_to([-0.6, 1.0, 0]), c.animate.move_to([1.5, 1.0, 0]), run_time=0.9)
        e = M(f"{o('3')} + {b('2')} = {g('5')}", 90).move_to([0, -0.8, 0])
        self.say(f"모두 {g('5개')}: 3 + 2 = 5", "두 묶음을 합치면 모두 5개. 식으로 3 더하기 2는 5라고 써요.")
        self.play(Write(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def more(self):
        self.section("장면 ② 늘어나기")
        a = dots(3, GREEN, cols=3, step=0.7, r=0.28).move_to([-1.0, 1.0, 0])
        lab = M("연못의 오리 3마리", 36).next_to(a, UP, buff=0.3)
        self.say("오리 3마리가 있는데 2마리가 더 오면?", "연못에 오리 3마리가 있어요. 2마리가 더 날아왔어요. 이제 몇 마리일까요?")
        self.play(FadeIn(a), FadeIn(lab), run_time=0.6)
        c = dots(2, GREEN, cols=2, step=0.7, r=0.28).move_to([5.5, 2.4, 0])
        self.play(c.animate.move_to([1.45, 1.0, 0]), run_time=1.0)
        e = M(f"3 + 2 = {g('5')}", 90).move_to([0, -0.8, 0])
        self.say(f"늘어나도 덧셈: {g('5마리')}", "있던 것에 더 생겨서 늘어나는 것도 덧셈이에요. 3 더하기 2는 5, 5마리예요.")
        self.play(Write(e), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def read(self):
        self.section("식을 읽어요")
        e = M(f"{o('3')} + {b('2')} = {g('5')}", 100).move_to([0, 1.4, 0])
        r1 = M("3 더하기 2는 5와 같습니다", 46).move_to([0, 0.0, 0])
        r2 = M(f"3과 2의 {g('합')}은 5입니다", 46).move_to([0, -0.8, 0])
        self.say("두 가지로 읽어요", "3 더하기 2는 5와 같습니다. 또는 3과 2의 합은 5입니다라고 읽어요. 더한 결과를 합이라고 해요.")
        self.play(FadeIn(e), run_time=0.4)
        self.play(FadeIn(r1), run_time=0.4)
        self.play(FadeIn(r2), run_time=0.4)
        t = M(f"바꾸어 더해도 같아요: {b('2')} + {o('3')} = {g('5')}", 44).move_to([0, -2.0, 0])
        self.say("2 + 3도 5", "더하는 두 수의 순서를 바꾸어 2 더하기 3을 해도 5로 같아요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: + 기호의 처음")
        bk = book("계산책").scale(0.7).move_to([-4.0, 0.6, 0])
        yr = T("1489년", 52, ORANGE).next_to(bk, DOWN, buff=0.3)
        t = M(f"+ 기호는 1489년 독일의\n{b('요하네스 비드만')}이 쓴\n상인들의 계산책에 처음 인쇄되었어요", 40).move_to([1.8, 0.9, 0])
        self.say(f"{o('1489년')} 독일, 비드만의 계산책", "더하기 기호는 1489년 독일의 요하네스 비드만이 쓴 상인들의 계산책에 처음 인쇄되어 나왔어요. 빼기 기호도 같은 책에 나와요.")
        self.play(FadeIn(bk), FadeIn(yr), FadeIn(t), run_time=0.8)
        t2 = M("그때는 '남는다'는 표시에 더 가까웠다는 해석도 있어요.\n지금처럼 '더하기'로 널리 쓰인 것은 그 뒤의 일이에요.", 30, SOFT).move_to([0, -1.9, 0])
        self.say("처음엔 뜻이 조금 달랐대요", "그때는 무게가 남는다는 표시에 더 가까웠다는 해석도 있어요. 지금처럼 더하기라는 뜻으로 널리 쓰인 것은 그 뒤의 일이에요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        a = dots(4, RED, cols=4, step=0.7, r=0.26).move_to([-2.2, 1.4, 0])
        c = dots(3, BLUE, cols=3, step=0.7, r=0.26).move_to([2.4, 1.4, 0])
        q = M("빨간 구슬 4개와 파란 구슬 3개, 모두 몇 개?", 44).move_to([0, 0.0, 0])
        self.say("4개와 3개, 모두 몇 개?", "연습해 볼까요? 빨간 구슬 4개와 파란 구슬 3개. 덧셈식을 쓰고 모두 몇 개인지 구해 보세요.")
        self.play(FadeIn(a), FadeIn(c), FadeIn(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        e = M(f"4 + 3 = {g('7')}", 80).move_to([0, -1.5, 0])
        self.say(f"4 + 3 = {g('7')}", "4 더하기 3은 7. 모두 7개예요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
