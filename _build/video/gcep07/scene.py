"""「수학 원리 돋보기」 개념 차근차근 7화 — 수의 크기 비교, > 와 <

구슬로 비교(하나씩 짝 → 남는 쪽이 큼) / 두 자리 수는 십의 자리부터, 같으면 일의 자리 / 기호 >, < 읽기(큰 쪽으로 벌어짐)
이야기: >, < 는 1631년 영국 토머스 해리엇의 책(그가 죽은 뒤 엮은 책)에 처음 인쇄 / 연습: 46 ○ 64, 58 ○ 53 / 출처 화면
최종: GRADE=c ./make_final.sh 7
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, RED
from storykit import book, show_sources


class GcEp07(ConceptScene):
    EP_NO = 7
    EP_TITLE = "수의 크기 비교와 부등호"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.match()
        self.two_digit()
        self.signs()
        self.story()
        self.practice()
        show_sources(self, [
            "· 부등호 &gt;, &lt; 가 처음 인쇄된 책: T. Harriot, 『Artis Analyticae Praxis』(런던, 1631) — 브리태니커 해당 항목",
            "· 같은 책 소장 기록: 솔즈베리 대성당 도서관 장서 목록",
        ])
        self.closing(f"{b('높은 자리')}부터 비교해요: 십의 자리 → 일의 자리\n{g('큰 수')} 쪽으로 입을 벌려요: 64 &gt; 46, 46 &lt; 64",
                     next_preview="개념 차근차근 8화 · 세 자리 수와 네 자리 수")
        self.wait(0.5)

    def match(self):
        self.section("어느 쪽이 더 많을까?")
        a = VGroup(*[dot(BLUE, 0.26) for _ in range(5)]).arrange(RIGHT, buff=0.35).move_to([-0.7, 1.2, 0])
        c = VGroup(*[dot(ORANGE, 0.26) for _ in range(7)]).arrange(RIGHT, buff=0.35).move_to([0, -0.2, 0])
        c.align_to(a, LEFT)
        self.say("파란 구슬 5개, 주황 구슬 7개", "파란 구슬 5개와 주황 구슬 7개. 하나씩 짝 지어 비교해 볼까요?")
        self.play(FadeIn(a), FadeIn(c), run_time=0.6)
        ls = VGroup(*[Line(a[k].get_bottom(), c[k].get_top(), color=SOFT, stroke_width=3) for k in range(5)])
        self.play(Create(ls), run_time=0.8)
        box = SurroundingRectangle(c[5:], color=GREEN, buff=0.1)
        t = M(f"주황이 {g('2개')} 남아요 → 7이 5보다 {g('커요')}", 48).move_to([0, -1.8, 0])
        self.say(f"7은 5보다 {g('커요')}", "주황 구슬이 2개 남았어요. 그래서 7은 5보다 커요. 5는 7보다 작아요.")
        self.play(Create(box), FadeIn(t), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def two_digit(self):
        self.section("두 자리 수 비교")
        a, c = T("46", 120, INK).move_to([-2.6, 1.0, 0]), T("64", 120, INK).move_to([2.6, 1.0, 0])
        self.say("46과 64, 어느 수가 클까요?", "46과 64. 어느 수가 더 클까요?")
        self.play(Write(a), Write(c), run_time=0.6)
        self.play(a[0].animate.set_color(BLUE), c[0].animate.set_color(BLUE), run_time=0.4)
        t1 = M(f"{b('십의 자리')}부터: 4 &lt; 6 → {g('64')}가 커요", 46).move_to([0, -0.6, 0])
        self.say(f"{b('십의 자리')}부터 비교", "높은 자리인 십의 자리부터 비교해요. 4와 6, 6이 크니까 64가 더 커요. 일의 자리는 볼 필요가 없어요.")
        self.play(FadeIn(t1), run_time=0.5)
        t2 = M(f"십의 자리가 같으면 {o('일의 자리')}: 58 &gt; 53", 46).move_to([0, -1.6, 0])
        self.say(f"같으면 {o('일의 자리')}", "십의 자리가 같으면 일의 자리를 비교해요. 58과 53은 8이 3보다 크니 58이 더 커요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def signs(self):
        self.section("> 와 < 기호")
        e1 = M(f"{g('64')} &gt; 46", 110).move_to([0, 1.6, 0])
        r1 = M("64는 46보다 큽니다", 44).next_to(e1, DOWN, buff=0.3)
        e2 = M(f"46 &lt; {g('64')}", 110).move_to([0, -0.8, 0])
        r2 = M("46은 64보다 작습니다", 44).next_to(e2, DOWN, buff=0.3)
        self.say("&gt; 와 &lt; 는 크기를 나타내는 기호", "크기를 비교할 때는 기호를 써요. 64는 46보다 큽니다를 64 큰 쪽 기호 46으로 써요.")
        self.play(FadeIn(e1), FadeIn(r1), run_time=0.6)
        self.say(f"입은 언제나 {g('큰 수')} 쪽으로", "46은 64보다 작습니다는 46 작은 쪽 기호 64. 기호의 벌어진 쪽이 언제나 큰 수를 향해요.")
        self.play(FadeIn(e2), FadeIn(r2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 기호는 언제 생겼을까?")
        bk = book("대수").scale(0.7).move_to([-4.0, 1.1, 0])
        yr = T("1631년", 56, ORANGE).next_to(bk, DOWN, buff=0.3)
        t = M(f"&gt; 와 &lt; 는 약 400년 전,\n영국 수학자 {b('토머스 해리엇')}의 책에\n처음 인쇄되어 나왔어요", 40).move_to([2.0, 0.8, 0])
        self.say(f"{o('1631년')}, 토머스 해리엇의 책", "이 기호는 약 400년 전인 1631년, 영국의 수학자 토머스 해리엇의 대수 책에 처음 인쇄되어 나왔어요.")
        self.play(FadeIn(bk), FadeIn(yr), FadeIn(t), run_time=0.8)
        t2 = M("(해리엇이 세상을 떠난 뒤 다른 사람들이 엮은 책이라,\n기호를 누가 처음 생각했는지는 의견이 갈려요)", 30, SOFT).move_to([0, -2.0, 0])
        self.say("누가 처음 생각했는지는 의견이 갈려요", "다만 이 책은 해리엇이 세상을 떠난 뒤 다른 사람들이 엮은 책이라, 기호를 해리엇이 직접 만들었는지는 의견이 갈려요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q1 = M("① 39 ○ 41", 70).move_to([-3.0, 1.0, 0])
        q2 = M("② 75 ○ 72", 70).move_to([3.0, 1.0, 0])
        self.say("○ 안에 &gt; 와 &lt; 중 알맞은 것은?", "연습해 볼까요? 동그라미 안에 큰 쪽 기호와 작은 쪽 기호 중 알맞은 것을 넣어 보세요.")
        self.play(FadeIn(q1), FadeIn(q2), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a1 = M(f"39 {g('&lt;')} 41", 70).move_to([-3.0, -0.4, 0])
        a2 = M(f"75 {g('&gt;')} 72", 70).move_to([3.0, -0.4, 0])
        t = M("① 십의 자리 3 &lt; 4    ② 십의 자리가 같아 일의 자리 5 &gt; 2", 36, SOFT).move_to([0, -1.8, 0])
        self.say("39 &lt; 41, 75 &gt; 72", "39는 41보다 작고, 75는 72보다 커요.")
        self.play(FadeIn(a1), FadeIn(a2), FadeIn(t), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
