"""「수학 원리 돋보기」 4학년 14화 — (세 자리 수) × (몇십몇) (4-1 3단원 곱셈과 나눗셈 3차시, 화 코드 4-1-3-b)

213 × 18 = 213 × 8 + 213 × 10 = 1704 + 2130 = 3834 (넓이 그림 두 조각 → 세로셈 두 줄)
먼저 어림: 200 × 20 = 4000쯤 / 해 보기 326 × 27 = 8802
최종: GRADE=4 ./make_final.sh 14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from mul2 import VertMul

LB, LO = "#BBD3F5", "#F9D3A8"


class G4Ep14(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 14
    EP_TITLE = "(세 자리 수) × (몇십몇)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.estimate()
        self.area()
        self.vertical(213, 18)
        self.second()
        self.closing(f"몇십몇을 {o('몇')}과 {b('몇십')}으로 나누어 곱하고\n두 줄을 {g('더해요')}",
                     next_preview="4학년 15화 · 몇십으로 나누기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"축제 기념품을 한 상자에 {b('213개')}씩 {o('18상자')}\n준비했어요. 모두 몇 개일까요?", 50)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0, 1.4, 0])
        self.say("213개씩 18상자", "축제 기념품을 한 상자에 213개씩 18상자 준비했어요. 모두 몇 개일까요?")
        self.play(Write(q), run_time=1.2)
        e = M("213 × 18 = ?", 100).move_to([0, -0.8, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def estimate(self):
        self.section("먼저 어림하기")
        l1 = M(f"213 → {o('약 200')},   18 → {o('약 20')}", 56).move_to([0, 1.3, 0])
        l2 = M(f"200 × 20 = {g('4000')}  → 답은 4000쯤", 56).move_to([0, 0.0, 0])
        self.say("계산하기 전에 어림해 봐요", "계산하기 전에 어림해 볼까요? 213은 약 200, 18은 약 20이에요.")
        self.play(FadeIn(l1), run_time=0.6)
        self.say(f"200 × 20 = {g('4000')}쯤", "200 곱하기 20은 4000. 답은 4000쯤이 되겠어요.")
        self.play(FadeIn(l2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def area(self):
        self.section("두 조각으로 나누기")
        u = 0.27
        x0, y0 = -5.6, 1.3
        H = 2.6
        W1, W2 = 10 * u * 1.6, 8 * u * 1.6
        r1 = Rectangle(width=W1, height=H, fill_color=LB, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x0 + W1 / 2, y0 - H / 2, 0])
        r2 = Rectangle(width=W2, height=H, fill_color=LO, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x0 + W1 + W2 / 2, y0 - H / 2, 0])
        side = T("213", 40).next_to(VGroup(r1, r2), LEFT, buff=0.2)
        tw = VGroup(T("10", 40, BLUE).next_to(r1, UP, buff=0.15), T("8", 40, ORANGE).next_to(r2, UP, buff=0.15))
        self.say(f"18을 {b('10')}과 {o('8')}로 나누어요", "213 곱하기 18을 직사각형으로 생각하고, 18을 10과 8로 나누어요.")
        self.play(FadeIn(r1), FadeIn(r2), FadeIn(side), FadeIn(tw), run_time=0.8)
        l1 = VGroup(T("213×10", 30), T("2130", 38, BLUE)).arrange(DOWN, buff=0.05).move_to(r1)
        l2 = VGroup(T("213×8", 30), T("1704", 38, ORANGE)).arrange(DOWN, buff=0.05).move_to(r2)
        self.say(f"213 × {o('8')} = {o('1704')}", "오른쪽 조각은 213 곱하기 8, 1704.")
        self.play(FadeIn(l2), Indicate(r2, color=ORANGE, scale_factor=1.03), run_time=0.7)
        self.say(f"213 × {b('10')} = {b('2130')}", "왼쪽 조각은 213 곱하기 10, 2130.")
        self.play(FadeIn(l1), Indicate(r1, color=BLUE, scale_factor=1.03), run_time=0.7)
        tot = M(f"1704 + 2130 = {g('3834')}", 52).move_to([3.3, -0.2, 0])
        self.say(f"두 조각을 더하면 {g('3834')}", "두 조각을 더하면 3834. 어림한 4000과도 가까워요.")
        self.play(FadeIn(tot), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self, a, c):
        self.section("세로셈 두 줄")
        v = VertMul(self, a, c, x_right=-1.4, y0=2.4, F=64, dy=0.82)
        self.say("세로셈으로 계산해요", f"세로셈으로 {a} 곱하기 {c}를 계산해 볼게요.")
        v.show()
        cu, ct = c % 10, c // 10 * 10
        s1 = M(f"{a} × {o(str(cu))} = {o(str(a * cu))}", 40).move_to([3.0, 0.75, 0])
        self.say(f"첫째 줄: {a} × {o(str(cu))}", f"첫째 줄은 {a} 곱하기 일의 자리 {cu}, {a * cu}.")
        v.row(0, a * cu)
        self.play(FadeIn(s1), run_time=0.4)
        s2 = M(f"{a} × {b(str(ct))} = {b(str(a * ct))}", 40).move_to([3.0, -0.07, 0])
        self.say(f"둘째 줄: {a} × {b(str(ct))} → 끝의 0은 생략", f"둘째 줄은 {a} 곱하기 {ct}, {a * ct}. 끝의 0은 흐리게 쓰거나 생략해요.")
        v.row(1, a * ct, faded_tail=1)
        self.play(FadeIn(s2), run_time=0.4)
        self.say(f"두 줄을 더하면 {g(str(a * c))}", f"두 줄을 더하면 {a * c}. 기념품은 모두 {a * c}개예요.")
        v.total()
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def second(self):
        self.section("해 보기")
        q = M("326 × 27 = ?", 84).move_to([0, 1.8, 0])
        self.say("326 × 27은?", "326 곱하기 27은 얼마일까요? 먼저 어림해 보고 계산해요.")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(5)
        rows = VGroup(M(f"326 × {o('7')} = {o('2282')}", 52), M(f"326 × {b('20')} = {b('6520')}", 52),
                      M(f"2282 + 6520 = {g('8802')}", 56)).arrange(DOWN, buff=0.35).move_to([0, -0.3, 0])
        self.say(f"2282 + 6520 = {g('8802')}", "326 곱하기 7은 2282, 326 곱하기 20은 6520. 더하면 8802예요. 어림한 300 곱하기 30, 9000과 가까워요.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.4, run_time=1.4))
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
