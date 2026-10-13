"""「수학 원리 돋보기」 3화 — 몇십몇은 어느 자리부터 나눌까? (2학기 2단원 나눗셈 3차시, 화 코드 2-2-b)

48 ÷ 4 = 12 (나무 묘목, 내림 없음): 십 모형 먼저, 일 모형 나중 → 세로셈 → 66 ÷ 3, 84 ÷ 2 → 왜 큰 자리부터일까(42 ÷ 3)
최종: ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Create, FadeIn, FadeOut, GrowFromCenter, Indicate, LaggedStart, Line, Rectangle,
    RoundedRectangle, SurroundingRectangle, Triangle, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SMALL, SOFT, EpisodeScene, M, T, b, g, o
from base10 import grid_points
from division import DivBoard, clear_stage, long_division

LEAF = "#7DB86A"
TRUNK = "#9A6A3F"


def check_mark(size=0.6, color=GREEN):
    p0, p1, p2 = (np.array(v) * size for v in ([-0.5, 0, 0], [-0.15, -0.4, 0], [0.55, 0.45, 0]))
    return VGroup(Line(p0, p1, stroke_width=14, color=color), Line(p1, p2, stroke_width=14, color=color))


def sapling():
    """나무 묘목"""
    leaf = Triangle(fill_color=LEAF, fill_opacity=1, stroke_color=INK, stroke_width=2).scale(0.16)
    trunk = Rectangle(width=0.06, height=0.1, fill_color=TRUNK, fill_opacity=1, stroke_width=0)
    trunk.next_to(leaf, DOWN, buff=0)
    return VGroup(trunk, leaf)


class Ep03(EpisodeScene):
    EP_NO = 3
    EP_TITLE = "몇십몇은 어느 자리부터 나눌까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.blocks()
        long_division(self, 48, 4, who="모둠", unit="그루")
        self.by_place()
        self.why_big_first()
        self.closing(f"나눗셈은 {g('큰 자리부터')}!\n{b('십 모형')}을 먼저, {o('일 모형')}을 나중에 나눠요",
                     next_preview="4화 · 나머지는 무엇일까?")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        trees = VGroup(*[sapling() for _ in range(48)])
        for tr, p in zip(trees, grid_points([-3.3, -0.55, 0], 48, 12, 0.42)):
            tr.move_to(p)
        lab = T("48그루", SMALL, BLUE).next_to(trees, DOWN, buff=0.25)
        groups = VGroup(*[RoundedRectangle(corner_radius=0.22, width=1.05, height=1.05, fill_color=PAPER,
                                           fill_opacity=1, stroke_color=SOFT, stroke_width=4) for _ in range(4)]
                        ).arrange(RIGHT, buff=0.22).move_to([3.75, -0.4, 0])
        glabs = VGroup(*[T(f"{i}모둠", 28).move_to(gp) for i, gp in enumerate(groups, 1)])
        q = M(f"나무 묘목 {b('48그루')}를 {o('4모둠')}이 똑같이 나누어 심으면\n한 모둠은 몇 그루씩 심을까요?", 52)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0.3, 2.1, 0])

        self.say(f"학교 화단에 나무 묘목 {b('48그루')}를 심어요", "학교 화단에 나무 묘목 48그루를 심으려고 해요.")
        self.play(LaggedStart(*[GrowFromCenter(t) for t in trees], lag_ratio=0.02, run_time=1.6), FadeIn(lab))
        self.say(f"{o('4모둠')}이 똑같이 나누어 심어요", "네 모둠이 똑같이 나누어 심어요.")
        self.play(LaggedStart(*[FadeIn(VGroup(gp, gl), shift=UP * 0.2) for gp, gl in zip(groups, glabs)],
                              lag_ratio=0.2, run_time=1.0))
        self.say("한 모둠은 몇 그루씩 심을까요?", "한 모둠은 몇 그루씩 심을까요?")
        self.play(Write(q), run_time=1.6)
        self.wait(1.2)
        expr = M(f"{b('4')}{o('8')} ÷ 4 = ?", 120).move_to([0.3, 2.1, 0])
        self.say(f"식으로 쓰면 {b('4')}{o('8')} ÷ 4", "식으로 쓰면 48 나누기 4예요.")
        self.play(FadeOut(q), FadeIn(expr, shift=DOWN * 0.2), run_time=0.8)
        self.wait(1.0)
        ask = M(f"{b('십의 자리')}와 {o('일의 자리')}, 어느 자리부터 나눌까요?", 48)
        ask.scale_to_fit_width(min(ask.width, 11.0)).move_to([0, 0.85, 0])
        self.say(f"{b('십의 자리')}와 {o('일의 자리')} 중 어느 자리부터 나눌까요?",
                 "십의 자리와 일의 자리 중에서 어느 자리부터 나누어야 할까요?")
        self.play(FadeIn(ask, shift=UP * 0.2), run_time=0.8)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 수모형으로 나누기 ──
    def blocks(self):
        self.section("수모형으로 나누기")
        board = DivBoard(self, 48, 4, who="모둠", item="묘목", unit="그루")
        board.show_number()
        board.show_plates()
        board.deal_tens()
        board.deal_ones()
        board.show_result()
        board.clear()

    # ── 자리별로 나누어 보기 (66 ÷ 3, 84 ÷ 2) ──
    def by_place(self):
        self.section("자리별로 나누어 보기")
        rows = []
        for i, (a, d) in enumerate(((66, 3), (84, 2))):
            t, u = divmod(a, 10)
            y = 1.6 - i * 2.75
            head = M(f"{b(str(t))}{o(str(u))} ÷ {d} = ?", 76).move_to([-4.2, y, 0])
            s1 = M(f"{b(f'{t}0 ÷ {d} = {t // d}0')}", 52).move_to([0.6, y + 0.45, 0])
            s2 = M(f"{o(f'{u} ÷ {d} = {u // d}')}", 52).move_to([0.6, y - 0.45, 0]).align_to(s1, LEFT)
            tot = M(f"= {g(str(a // d))}", 76).move_to([4.8, y, 0])
            bx = max(s1.get_right()[0], s2.get_right()[0]) + 0.4
            brace = Line([bx, s1.get_top()[1], 0], [bx, s2.get_bottom()[1], 0], color=SOFT, stroke_width=5)
            tot.next_to(brace, RIGHT, buff=0.45)
            rows.append((a, d, t, u, head, s1, s2, brace, tot))
        a, d, t, u, head, s1, s2, brace, tot = rows[0]
        self.say(f"같은 방법으로 {b(str(t))}{o(str(u))} ÷ {d}", f"같은 방법으로 {a} 나누기 {d}도 해 봐요.")
        self.play(Write(head), run_time=0.8)
        self.say(f"{b('십의 자리')} 먼저: {b(f'{t}0 ÷ {d} = {t // d}0')}",
                 f"십의 자리부터. {t}0 나누기 {j3(d)} {t // d}0.")
        self.play(FadeIn(s1, shift=RIGHT * 0.2), run_time=0.6)
        self.say(f"그다음 {o('일의 자리')}: {o(f'{u} ÷ {d} = {u // d}')}",
                 f"그다음 일의 자리. {u} 나누기 {j3(d)} {u // d}.")
        self.play(FadeIn(s2, shift=RIGHT * 0.2), run_time=0.6)
        self.say(f"모으면 {b(f'{t // d}0')} + {o(str(u // d))} = {g(str(a // d))}",
                 f"모으면 {t // d}0 더하기 {u // d}, {a // d}예요.")
        self.play(Create(brace), FadeIn(tot, scale=1.3), run_time=0.7)
        self.wait(1.2)
        a, d, t, u, head, s1, s2, brace, tot = rows[1]
        self.say(f"{b(str(t))}{o(str(u))} ÷ {d}도 {b('십의 자리')}부터",
                 f"{a} 나누기 {d}도 십의 자리부터 나누어요. {t}0 나누기 {d}는 {t // d}0, {u} 나누기 {d}는 {u // d}.")
        self.play(Write(head), run_time=0.7)
        self.play(FadeIn(s1, shift=RIGHT * 0.2), run_time=0.5)
        self.play(FadeIn(s2, shift=RIGHT * 0.2), run_time=0.5)
        self.say(f"{b(f'{t // d}0')} + {o(str(u // d))} = {g(str(a // d))}", f"그래서 {a // d}예요.")
        self.play(Create(brace), FadeIn(tot, scale=1.3), run_time=0.7)
        self.wait(1.5)
        self.settle()
        clear_stage(self, 0.6)

        # 곱셈으로 확인
        self.section("곱셈으로 확인하기")
        e = M(f"48 ÷ 4 = {g('12')}", 100).move_to([0, 1.7, 0])
        chk = M(f"확인  4 × 12 = {g('48')}", 80).move_to([0, 0.1, 0])
        split = M(f"4 × {b('10')} = {b('40')},   4 × {o('2')} = {o('8')},   {b('40')} + {o('8')} = 48", 48)
        split.move_to([0, -1.15, 0])
        self.say("처음 문제로 돌아가 곱셈으로 확인해요", "처음 문제로 돌아가서, 곱셈으로 확인해 볼까요? 4 곱하기 12는?")
        self.play(Write(e), run_time=0.9)
        self.play(FadeIn(chk[:7], shift=UP * 0.2), run_time=0.7)
        self.play(FadeIn(split, shift=UP * 0.2), run_time=0.8)
        self.wait(1.4)
        self.play(FadeIn(chk[7:], scale=1.5), run_time=0.5)
        mark = check_mark(0.8).next_to(chk, RIGHT, buff=0.4)
        self.say(f"처음 묘목 수 {g('48그루')}와 같아요!", "처음 묘목 수 48그루와 같아요. 바르게 계산했어요!")
        self.play(Create(mark), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 왜 큰 자리부터일까? (42 ÷ 3) ──
    def why_big_first(self):
        self.section("왜 큰 자리부터일까?")
        title = M(f"1화의 {b('4')}{o('2')} ÷ 3을 두 가지 순서로 나누어 보면?", 46).move_to([0, 2.3, 0])
        self.say(f"1화에서 본 {b('4')}{o('2')} ÷ 3으로 견주어 봐요",
                 "왜 큰 자리부터 나눌까요? 1화에서 본 42 나누기 3으로 견주어 봐요.")
        self.play(FadeIn(title), run_time=0.7)

        def card(x, head, color, lines):
            box = RoundedRectangle(corner_radius=0.3, width=6.4, height=3.95, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=color, stroke_width=5).move_to([x, -0.25, 0])
            h = M(head, 44).move_to([x, 1.2, 0])
            ls = VGroup(*[M(t, 36) for t in lines]).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
            ls.scale_to_fit_width(min(ls.width, 5.9)).move_to([x, -0.6, 0])
            return box, h, ls

        lbox, lh, ll = card(-3.35, f"{o('일의 자리')}부터 나누면", SOFT, [
            f"① {o('일 모형 2개')} ÷ 3 → 못 나눠요",
            f"② {b('십 모형 4개')} ÷ 3 → 1개씩, 1개 남음",
            f"③ 남은 1개 → {o('일 모형 10개')}",
            f"④ {o('일 모형')}을 {o('또')} 나눠야 해요",
        ])
        rbox, rh, rl = card(3.35, f"{b('십의 자리')}부터 나누면", GREEN, [
            f"① {b('십 모형 4개')} ÷ 3 → 1개씩, 1개 남음",
            f"② 남은 1개 → {o('일 모형 10개')}",
            f"③ 2개와 합쳐 {o('12개')} ÷ 3 = {o('4')}",
            f"④ {g('한 번에')} 끝! 몫 {g('14')}",
        ])
        self.say(f"{o('일의 자리')}부터 나누면?", "먼저 일의 자리부터 나누면 어떻게 될까요?")
        self.play(FadeIn(lbox), FadeIn(lh), run_time=0.6)
        for ln in ll:
            self.play(FadeIn(ln, shift=RIGHT * 0.2), run_time=0.5)
            self.wait(0.5)
        self.say(f"남은 {b('십 모형')}을 바꾸면 {o('일 모형')}을 또 나눠야 해요",
                 "일 모형 2개는 세 모둠에 나눌 수 없어요. 십 모형을 나누고 남은 1개를 일 모형으로 바꾸면, 일 모형을 또 나누어야 해요.",
                 wait=0.6)
        self.say(f"{b('십의 자리')}부터 나누면?", "이번에는 십의 자리부터 나누어 볼까요?")
        self.play(FadeIn(rbox), FadeIn(rh), run_time=0.6)
        for ln in rl:
            self.play(FadeIn(ln, shift=RIGHT * 0.2), run_time=0.5)
            self.wait(0.5)
        self.say(f"남은 것을 {o('작은 자리')}로 넘겨 {g('한 번에')} 끝나요",
                 "십 모형을 나누고 남은 것은 일 모형으로 바꾸어, 원래 일 모형과 함께 한 번에 나눌 수 있어요.", wait=0.6)
        self.play(Indicate(rbox, color=GREEN, scale_factor=1.03), run_time=0.9)
        concl = M(f"그래서 나눗셈은 {g('큰 자리부터')} 나눠요", 52)
        concl_bg = SurroundingRectangle(concl, color=GREEN, buff=0.2, stroke_width=6, corner_radius=0.2).set_fill(PAPER, 1)
        VGroup(concl_bg, concl).move_to([0, 2.3, 0])
        self.say(f"그래서 나눗셈은 {g('큰 자리부터')}!", "그래서 나눗셈은 큰 자리부터 나누어요.")
        self.play(FadeOut(title), FadeIn(concl_bg), Write(concl), run_time=0.9)
        self.wait(2.0)
        self.settle()
        self.clear_sub()
        clear_stage(self, 0.7)
        self.hide_chip()


def j3(d):
    """'나누기 3은' — 나누는 수 뒤 조사"""
    from division import j
    return j(d, "은는")
