"""「수학 원리 돋보기」 개념 차근차근 9화 — 숫자는 어떻게 바뀌어 왔을까?

이집트: 1·10·100마다 다른 그림(막대·말발굽 모양·감긴 밧줄), 되풀이해 더함 → 자릿값 없음, 큰 수는 그림이 많음
로마: I V X L C, 0 기호 없음, 시계에서 IIII도 / 바빌로니아: 쐐기 두 가지로 1~59, 60씩 묶음, 처음엔 0이 없어 빈칸
인도 숫자: 0~9와 자릿값 → 지금 숫자 / 비교: 243을 세 가지로 / 연습: 이집트 숫자 읽기 / 출처 화면
그림 이름은 해석이 여러 가지라 '~처럼 생긴 그림'으로 말함(SOURCES_CONCEPT.md)
최종: GRADE=c ./make_final.sh 9
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arc, Circle, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon,
                   RoundedRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene
from storykit import scroll, show_sources

SAND = "#C9A86A"


def eg_one(h=0.7):
    return Line([0, -h / 2, 0], [0, h / 2, 0], color=INK, stroke_width=9)


def eg_ten(h=0.7):
    return Arc(radius=h * 0.42, start_angle=0, angle=np.pi, color=INK, stroke_width=9).stretch(1.25, 1)


def eg_hundred(h=0.7):
    pts = [np.array([0.05 * t * np.cos(t), 0.05 * t * np.sin(t), 0]) * (h / 0.7) for t in np.linspace(0, 4.5 * np.pi, 80)]
    from manim import VMobject
    v = VMobject(color=INK, stroke_width=8)
    v.set_points_smoothly(pts)
    tail = Line(pts[-1], pts[-1] + np.array([0, -h * 0.55, 0]), color=INK, stroke_width=8)
    return VGroup(v, tail)


def egypt(n, h=0.7):
    """n(999까지)을 이집트 상형 숫자 그림으로(큰 것부터 왼쪽)"""
    hs, ts, us = n // 100, (n // 10) % 10, n % 10
    parts = [eg_hundred(h) for _ in range(hs)] + [eg_ten(h) for _ in range(ts)] + [eg_one(h) for _ in range(us)]
    return VGroup(*parts).arrange(RIGHT, buff=0.18, aligned_edge=DOWN)


def wedge(kind, s=0.32):
    """바빌로니아 쐐기: 'one' 세운 쐐기, 'ten' 누운 쐐기"""
    if kind == "one":
        p = Polygon([-s / 2, s / 2, 0], [s / 2, s / 2, 0], [0, -s * 1.2, 0], fill_color=INK, fill_opacity=1, stroke_width=0)
    else:
        p = Polygon([s / 2, s / 2, 0], [s / 2, -s / 2, 0], [-s * 1.1, 0, 0], fill_color=INK, fill_opacity=1, stroke_width=0)
    return p


def baby(n, s=0.3):
    t, u = divmod(n, 10)
    return VGroup(*[wedge("ten", s) for _ in range(t)] + [wedge("one", s) for _ in range(u)]).arrange(RIGHT, buff=0.06)


class GcEp09(ConceptScene):
    EP_NO = 9
    EP_TITLE = "숫자는 어떻게 바뀌어 왔을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.egypt_part()
        self.rome()
        self.babylon()
        self.ours()
        self.practice()
        show_sources(self, [
            "· 이집트 상형 숫자·바빌로니아 숫자: MacTutor 수학사 'Egyptian numerals'·'Babylonian numerals'",
            "· 로마 숫자: Scientific American 'How to Work Roman Numerals'",
            "· 인도 숫자가 아랍을 거쳐 유럽으로: MacTutor 'The Arabic numeral system', 브리태니커",
        ])
        self.closing(f"옛 숫자들은 {o('그림을 되풀이')}하거나 {o('0이 없어')} 불편했어요\n지금 숫자는 {b('0~9')}와 {g('자릿값')}으로 어떤 수든 써요",
                     next_preview="개념 차근차근 10화 · 덧셈의 뜻: 모으기와 더하기")
        self.wait(0.5)

    def egypt_part(self):
        self.section("옛 이집트의 숫자")
        sc = scroll(12.4, 2.9).move_to([0, 1.2, 0])
        sym = VGroup(eg_one(), eg_ten(), eg_hundred()).arrange(RIGHT, buff=3.4).move_to([0, 1.75, 0])
        labs = VGroup(*[M(x, 28) for x in ["1\n막대", "10\n말발굽처럼 생긴 그림", "100\n감긴 밧줄처럼 생긴 그림"]])
        for s_, l in zip(sym, labs):
            l.move_to([s_.get_x(), 0.85, 0])
        self.say("옛 이집트 사람들의 숫자", "옛 이집트 사람들은 1, 10, 100마다 다른 그림을 썼어요. 1은 막대, 10은 말발굽처럼 생긴 그림, 100은 감긴 밧줄처럼 생긴 그림이에요.")
        self.play(FadeIn(sc), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(VGroup(s_, l)) for s_, l in zip(sym, labs)], lag_ratio=0.3), run_time=1.4)
        n = egypt(243, 0.6).move_to([-1.0, -0.95, 0])
        eq = M(f"= {g('243')}", 56).next_to(n, RIGHT, buff=0.5)
        self.say("243은 그림 9개", "243을 쓰려면 밧줄 2개, 말발굽 4개, 막대 3개. 그림을 모두 더해서 읽어요.")
        self.play(FadeIn(n, lag_ratio=0.1), FadeIn(eq), run_time=1.0)
        t = M(f"자리가 없어서 {o('그림을 되풀이')}해 더해요", 40).move_to([0, -1.95, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def rome(self):
        self.section("옛 로마의 숫자")
        row = VGroup(*[VGroup(T(a, 70, INK), T(v, 40, BLUE)).arrange(DOWN, buff=0.2) for a, v in [("I", "1"), ("V", "5"), ("X", "10"), ("L", "50"), ("C", "100")]]).arrange(RIGHT, buff=1.0).move_to([0, 1.3, 0])
        self.say("로마 숫자 I, V, X, L, C", "옛 로마 사람들은 글자로 수를 썼어요. I는 1, V는 5, X는 10, L은 50, C는 100.")
        self.play(LaggedStart(*[FadeIn(r) for r in row], lag_ratio=0.2), run_time=1.2)
        e = M(f"XII = 10 + 1 + 1 = {g('12')}", 56).move_to([0, -0.5, 0])
        self.say("XII는 12", "XII는 10, 1, 1을 더해서 12. 시계에서 로마 숫자를 본 적 있지요?")
        self.play(FadeIn(e), run_time=0.5)
        t = M(f"로마 숫자에는 {o('0이 없어요')}", 44).move_to([0, -1.7, 0])
        self.say(f"{o('0이 없어요')}", "로마 숫자에는 0을 나타내는 기호가 없어요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def babylon(self):
        self.section("옛 바빌로니아의 숫자")
        tab = RoundedRectangle(corner_radius=0.3, width=6.0, height=2.4, fill_color=SAND, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([-2.8, 0.8, 0])
        w1 = VGroup(wedge("one", 0.45)).move_to(tab.get_center() + LEFT * 1.4)
        w10 = VGroup(wedge("ten", 0.45)).move_to(tab.get_center() + RIGHT * 1.4)
        l1, l10 = T("1", 40, INK).next_to(w1, DOWN, buff=0.3), T("10", 40, INK).next_to(w10, DOWN, buff=0.3)
        self.say("점토판에 쐐기 모양으로", "옛 바빌로니아 사람들은 점토판에 쐐기 모양을 눌러 수를 썼어요. 세운 쐐기는 1, 누운 쐐기는 10이에요.")
        self.play(FadeIn(tab), FadeIn(w1), FadeIn(w10), FadeIn(l1), FadeIn(l10), run_time=0.8)
        t1 = M(f"이 두 가지로 1~59를 쓰고\n{o('60')}이 되면 한 자리 올라가요", 38).move_to([3.4, 1.0, 0])
        self.say(f"{o('60')}씩 묶어 자리가 올라가요", "이 두 가지로 1부터 59까지 쓰고, 60이 되면 한 자리 올라갔어요. 1시간이 60분인 것도 이 60씩 묶는 셈의 흔적이라고 해요.")
        self.play(FadeIn(t1), run_time=0.5)
        t2 = M(f"처음에는 {o('0')}이 없어 빈자리로 두었어요 → 헷갈리기 쉬웠어요", 38).move_to([0, -1.6, 0])
        self.say("처음에는 0이 없었어요", "그런데 처음에는 0이 없어서 빈자리를 그냥 비워 두었어요. 그래서 1과 60을 구별하기 어려울 때가 있었대요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def ours(self):
        self.section("지금 우리가 쓰는 숫자")
        rows = VGroup(
            VGroup(M("이집트", 36), egypt(243, 0.45)).arrange(RIGHT, buff=0.5),
            VGroup(M("로마", 36), T("CCXLIII", 50, INK)).arrange(RIGHT, buff=0.5),
            VGroup(M("지금", 36), T("243", 64, BLUE)).arrange(RIGHT, buff=0.5),
        ).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to([-1.2, 0.9, 0])
        self.say("243을 세 가지로 써 보면", "243을 세 가지 숫자로 써 볼까요? 이집트 숫자, 로마 숫자, 그리고 지금 숫자.")
        self.play(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.3) for r in rows], lag_ratio=0.4), run_time=1.6)
        t = M(f"인도에서 생긴 {b('0~9')}와 {g('자릿값')} 덕분에\n숫자 세 개로 짧게 써요", 40).move_to([0, -1.7, 0])
        self.say(f"{b('0~9')}와 {g('자릿값')} 덕분에 짧게", "지금 숫자는 인도에서 생겨 아랍을 거쳐 전해진 숫자예요. 0부터 9까지 열 개의 숫자와 자릿값 덕분에 숫자 세 개로 짧게 쓸 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        n = egypt(132, 0.7).move_to([0, 1.2, 0])
        q = M("이 이집트 숫자는 얼마일까요?", 46).move_to([0, -0.3, 0])
        self.say("이집트 숫자를 읽어 보세요", "연습해 볼까요? 이 이집트 숫자는 얼마일까요? 밧줄은 100, 말발굽은 10, 막대는 1이에요.")
        self.play(FadeIn(n, lag_ratio=0.1), FadeIn(q), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"100 1개 + 10 3개 + 1 2개 = {g('132')}", 52).move_to([0, -1.6, 0])
        self.say(f"{g('132')}", "밧줄 1개는 100, 말발굽 3개는 30, 막대 2개는 2. 모두 132예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
