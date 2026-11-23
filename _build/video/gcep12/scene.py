"""「수학 원리 돋보기」 개념 차근차근 12화 — = 는 '같다'예요

= 는 '답을 쓰라'가 아니라 '양쪽이 같다' → 저울 / 3 + 5 = 8, 8 = 3 + 5, 3 + 5 = 4 + 4
8 + 4 = □ + 5 에서 □는 12가 아니라 7 — 미국 연구에서 많은 초등학생이 12나 17이라고 씀(Falkner·Levi·Carpenter 1999)
이야기: = 는 1557년 영국 로버트 레코드 『The Whetstone of Witte』, '길이가 같은 평행선 두 개보다 더 같은 것은 없다'
연습: 6 + 2 = □ + 5 → 3 / 출처
최종: GRADE=c ./make_final.sh 12
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
from manim import Polygon, Rectangle


def balance(y=-0.2):
    beam = Line([-4.0, y + 1.0, 0], [4.0, y + 1.0, 0], color=INK, stroke_width=8)
    post = Line([0, y + 1.0, 0], [0, y - 1.4, 0], color=INK, stroke_width=8)
    base = Polygon([-0.9, y - 1.4, 0], [0.9, y - 1.4, 0], [0, y - 0.9, 0], fill_color=INK, fill_opacity=1, stroke_width=0)
    pans = VGroup(*[Rectangle(width=2.6, height=0.12, fill_color=INK, fill_opacity=1, stroke_width=0).move_to([x, y + 0.35, 0]) for x in (-3.0, 3.0)])
    strings = VGroup(*[Line([x, y + 1.0, 0], [x + dx, y + 0.42, 0], color=INK, stroke_width=3) for x in (-3.0, 3.0) for dx in (-1.1, 1.1)])
    return VGroup(beam, post, base, strings, pans)


class GcEp12(ConceptScene):
    EP_NO = 12
    EP_TITLE = "= 는 '같다'예요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.scale_part()
        self.both()
        self.trap()
        self.story()
        self.practice()
        show_sources(self, [
            "· = 기호의 처음: R. Recorde, 『The Whetstone of Witte』(1557) — 브리태니커 'Robert Recorde', MAA Convergence",
            "· 등호를 '답을 쓰라는 뜻'으로 아는 문제: K. P. Falkner, L. Levi, T. P. Carpenter(1999),",
            "  'Children's understanding of equality', Teaching Children Mathematics 6(4) / E. J. Knuth 외(2006), JRME 37(4)",
        ])
        self.closing(f"= 는 '답을 쓰세요'가 아니라 {g('양쪽이 같아요')}\n8 + 4 = □ + 5 → □ = {g('7')}",
                     next_preview="개념 차근차근 13화 · 0을 더하고 빼면?")
        self.wait(0.5)

    def scale_part(self):
        self.section("= 는 저울과 같아요")
        bal = balance(0.6)
        lt = M(f"{b('3')} + {o('5')}", 60).move_to([-3.0, 1.22, 0])
        rt = M(f"{g('8')}", 60).move_to([3.0, 1.22, 0])
        self.say("양쪽이 똑같으면 저울은 수평", "저울의 양쪽 무게가 똑같으면 저울은 기울지 않고 수평이 돼요.")
        self.play(FadeIn(bal), run_time=0.6)
        self.play(FadeIn(lt), FadeIn(rt), run_time=0.5)
        e = M(f"3 + 5 {g('=')} 8", 80).move_to([0, -1.6, 0])
        self.say(f"= 는 '양쪽이 {g('같다')}'", "등호는 바로 이 저울처럼, 왼쪽과 오른쪽이 같다는 뜻이에요.")
        self.play(Write(e), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def both(self):
        self.section("이런 식도 맞아요")
        rows = VGroup(M("3 + 5 = 8", 64), M(f"{g('8 = 3 + 5')}", 64), M(f"{g('3 + 5 = 4 + 4')}", 64)).arrange(DOWN, buff=0.45).move_to([-1.5, 0.6, 0])
        ks = VGroup(*[check_mark(0.4).next_to(r, RIGHT, buff=0.4) for r in rows])
        self.say("셋 다 맞는 식일까요?", "3 더하기 5는 8. 8은 3 더하기 5. 3 더하기 5는 4 더하기 4. 셋 다 맞는 식일까요?")
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=1.0)
        self.say("셋 다 맞아요: 양쪽이 모두 8", "셋 다 맞아요. 양쪽이 모두 8로 같으니까요. 답이 꼭 오른쪽에만 오는 것은 아니에요.")
        self.play(LaggedStart(*[Create(k) for k in ks], lag_ratio=0.3), run_time=0.9)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def trap(self):
        self.section("많이 틀리는 문제")
        q = M("8 + 4 = □ + 5", 90).move_to([0, 1.8, 0])
        self.say("□에 알맞은 수는?", "8 더하기 4는 네모 더하기 5. 네모에 알맞은 수는 무엇일까요?")
        self.play(Write(q), run_time=0.6)
        self.wait(0.4)
        w = M(f"□ = 12?  {o('틀려요')}   (= 를 '답을 쓰라'로 생각한 것)", 40).move_to([0, 0.5, 0])
        self.say("12라고 쓰면 틀려요", "8 더하기 4를 계산해서 12라고 쓰기 쉬워요. 그런데 그러면 양쪽이 12와 17로 같지 않아요.")
        self.play(FadeIn(w), run_time=0.5)
        a = M(f"왼쪽 12 = 오른쪽 □ + 5 → □ = {g('7')}", 52).move_to([0, -0.5, 0])
        self.say(f"양쪽이 같아야 하니 □ = {g('7')}", "왼쪽은 12. 오른쪽도 12가 되어야 하니, 네모 더하기 5가 12, 네모는 7이에요.")
        self.play(FadeIn(a), run_time=0.5)
        t = M("미국의 한 연구에서는 많은 초등학생이 12나 17이라고 썼대요", 34, SOFT).move_to([0, -1.6, 0])
        self.say("미국 연구에서도 많이 틀렸어요", "미국의 한 연구에서도 이 문제에 많은 초등학생이 12나 17이라고 썼대요. 등호의 뜻을 바르게 아는 것이 중요해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: = 기호의 처음")
        l1 = Line([-1.6, 1.25, 0], [1.6, 1.25, 0], color=BLUE, stroke_width=14)
        l2 = Line([-1.6, 0.75, 0], [1.6, 0.75, 0], color=BLUE, stroke_width=14)
        self.say("= 는 1557년 영국의 로버트 레코드가", "등호는 1557년 영국의 수학자 로버트 레코드가 쓴 책 『The Whetstone of Witte』에 처음 나와요.")
        self.play(Create(l1), Create(l2), run_time=0.8)
        yr = M(f"{o('1557년')} · 로버트 레코드", 44).move_to([0, 2.3, 0])
        self.play(FadeIn(yr), run_time=0.4)
        t = M("\"길이가 같은 평행선 두 개보다\n더 같은 것은 없으니까\"", 44, GREEN).move_to([0, -0.6, 0])
        self.say("'평행선 두 개보다 더 같은 것은 없다'", "레코드는 길이가 같은 평행선 두 개보다 더 같은 것은 없으니까 이 기호를 쓴다고 적었어요.")
        self.play(FadeIn(t), run_time=0.6)
        t2 = M("(옛 영어 원문: \"noe .2. thynges, can be moare equalle\")", 28, SOFT).move_to([0, -1.9, 0])
        self.play(FadeIn(t2), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("6 + 2 = □ + 5", 90).move_to([0, 1.2, 0])
        self.say("□에 알맞은 수는?", "연습해 볼까요? 6 더하기 2는 네모 더하기 5. 네모에 알맞은 수는?")
        self.play(Write(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"왼쪽 8 → □ + 5 = 8 → □ = {g('3')}", 56).move_to([0, -0.6, 0])
        self.say(f"□ = {g('3')}", "왼쪽은 8. 네모 더하기 5가 8이 되어야 하니 네모는 3이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
