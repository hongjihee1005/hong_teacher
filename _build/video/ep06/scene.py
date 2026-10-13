"""「수학 원리 돋보기」 6화 — 세 자리 수 나누기 (2학기 2단원 나눗셈 9·10차시, 화 코드 2-2-e)

248 ÷ 4 = 62 (백 모형 2개를 십 모형 20개로) → 세로셈 → 375 ÷ 3 = 125 (자리별로) → 157 ÷ 5 = 31 … 2
최종: ./make_final.sh 6
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Circumscribe, Create, FadeIn, FadeOut, GrowFromCenter, Indicate, LaggedStart, Rectangle,
    SurroundingRectangle, Triangle, VGroup, Write,
)

from series_style import BG, BLUE, GREEN, INK, ORANGE, PAPER, SMALL, SOFT, EpisodeScene, M, T, b, g, o
from base10 import hundred_flat, plate, ten_rod, unit_cube
from division import clear_stage, j, long_division_n
from items import check_mark

LEAF = "#7DB86A"
TRUNK = "#9A6A3F"
S = 0.12   # 수모형 크기


def k(s):
    return f'<span foreground="{INK}">{s}</span>'


def num3(n, size):
    h, t, u = str(n)
    return M(f"{h}{b(t)}{o(u)}", size)


class Ep06(EpisodeScene):
    EP_NO = 6
    EP_TITLE = "세 자리 수 나누기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.blocks()
        long_division_n(self, 248, 4, who="학교", unit="그루")
        self.by_place()
        long_division_n(self, 157, 5, who="모둠", unit="장", title="나머지가 있을 때")
        self.check157()
        self.closing(f"세 자리 수도 {g('큰 자리부터')}: 백 → {b('십')} → {o('일')}\n나눌 수 없으면 아래 자리로 바꾸어 계속 나눠요",
                     next_preview="7화 · 원의 중심과 반지름")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        q = M(f"나무 묘목 {k('2')}{b('4')}{o('8')}그루를 {o('4개 학교')}에 똑같이 나누면\n한 학교는 몇 그루씩 받을까요?", 52)
        q.scale_to_fit_width(min(q.width, 11.4)).move_to([0, 1.6, 0])
        self.say(f"나무 묘목 {k('2')}{b('4')}{o('8')}그루가 있어요", "나무 묘목이 248그루 있어요.")
        self.play(Write(q), run_time=1.6)
        self.say(f"{o('4개 학교')}에 똑같이 나누어요", "4개 학교에 똑같이 나누어 주려고 해요. 한 학교는 몇 그루씩 받을까요?")
        self.wait(0.8)
        expr = M(f"{k('2')}{b('4')}{o('8')} ÷ 4 = ?", 110).move_to([0, -0.4, 0])
        self.play(FadeIn(expr, shift=UP * 0.2), run_time=0.7)
        ask = M(f"이번에는 {k('백의 자리')}가 있어요. 어디부터 나눌까요?", 46).move_to([0, -1.7, 0])
        self.say(f"{k('백의 자리')}가 있으면 어디부터 나눌까요?", "이번에는 백의 자리가 있어요. 어디부터 나누어야 할까요?")
        self.play(FadeIn(ask), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 수모형으로 248 ÷ 4 ──
    def blocks(self):
        self.section("수모형으로 나누기")
        px = -5.15
        label = num3(248, 96).move_to([px, 2.3, 0])
        flats = VGroup(*[hundred_flat(S) for _ in range(2)]).arrange(DOWN, buff=0.2).move_to([px - 0.75, 0.3, 0])
        rods = VGroup(*[ten_rod(S) for _ in range(4)]).arrange(RIGHT, buff=0.08).next_to(flats, RIGHT, buff=0.25)
        rods.align_to(flats, DOWN)
        ones = VGroup(*[unit_cube(S) for _ in range(8)]).arrange(UP, buff=0.04).next_to(rods, RIGHT, buff=0.2)
        ones.align_to(flats, DOWN)
        plates = VGroup(*[plate(f"{i}학교", width=2.15, height=2.9, size=40) for i in range(1, 5)]).arrange(RIGHT, buff=0.22)
        plates.move_to([1.85, 0.45, 0])

        self.say(f"{k('2')}{b('4')}{o('8')}을 수모형으로 나타내요", "248을 수모형으로 나타내요.")
        self.play(FadeIn(label), run_time=0.5)
        self.play(FadeIn(flats, shift=DOWN * 0.2), run_time=0.6)
        self.play(FadeIn(rods, shift=DOWN * 0.2), FadeIn(ones, shift=DOWN * 0.2), run_time=0.6)
        self.say(f"{k('백 모형 2개')}, {b('십 모형 4개')}, {o('일 모형 8개')}",
                 "백 모형 2개, 십 모형 4개, 일 모형 8개예요.", wait=0.6)
        self.say("4개 학교에 똑같이 나누어요", "이것을 4개 학교에 똑같이 나누어요.")
        self.play(LaggedStart(*[FadeIn(p, shift=UP * 0.2) for p in plates], lag_ratio=0.15, run_time=0.9))
        self.bring_to_front(flats, rods, ones)
        self.say(f"{k('백 모형 2개')}는 4학교에 나눌 수 없어요", "가장 큰 자리부터 볼까요? 백 모형은 2개뿐이라 4개 학교에 하나씩 줄 수 없어요.")
        self.play(Circumscribe(flats, color=INK, buff=0.1, stroke_width=6, run_time=1.2))
        self.wait(0.5)

        # 백 모형 → 십 모형 20개 (핵심 장면)
        self.say(f"{k('백 모형 2개')}를 {b('십 모형 20개')}로 바꿔요!", "그럴 때는 백 모형 2개를 십 모형 20개로 바꾸어요!")
        cover = Rectangle(width=15, height=6.1, fill_color=BG, fill_opacity=0.92, stroke_width=0).move_to([0, 0.75, 0])
        self.play(FadeIn(cover), run_time=0.4)
        self.bring_to_front(flats)
        self.play(flats.animate.scale(2.0).arrange(RIGHT, buff=1.2).move_to([0, 1.0, 0]), run_time=1.0)
        all_rods = []
        anims = []
        for fi, fl in enumerate(flats):
            for ri, rod in enumerate(fl.submobjects):
                x = (fi * 10 + ri - 9.5) * 0.52
                anims.append(rod.animate.move_to([x, 0.9, 0]))
                all_rods.append(rod)
        self.play(LaggedStart(*anims, lag_ratio=0.04, run_time=1.6))
        cnt = T("20개", 52, BLUE).move_to([0, -0.6, 0])
        eq = M(f"{k('백 모형 2개')} = {b('십 모형 20개')}", 66).move_to([0, -1.6, 0])
        bx = SurroundingRectangle(eq, color=BLUE, buff=0.25, stroke_width=6, corner_radius=0.2).set_fill(PAPER, 1)
        self.play(FadeIn(cnt, scale=1.4), run_time=0.4)
        self.play(FadeIn(bx), Write(eq), run_time=0.9)
        self.wait(1.6)
        self.say(f"{b('십 모형')}은 모두 {b('24개')} (20개 + 4개)", "원래 있던 십 모형 4개와 합하면 십 모형은 모두 24개예요.")
        all_rods += list(rods)
        grid = []
        for idx in range(24):
            r, c = divmod(idx, 12)
            grid.append(np.array([-6.35 + c * 0.2, 0.95 - r * 1.42, 0]))
        self.play(FadeOut(VGroup(cnt, eq, bx)), FadeOut(cover), run_time=0.4)
        self.play(*[rd.animate.scale_to_fit_height(S * 10).move_to(p) for rd, p in zip(all_rods, grid)],
                  ones.animate.move_to([px + 1.6, -0.6, 0]), run_time=1.3)
        lab24 = T("24", 44, BLUE).move_to([-5.25, -1.75, 0])
        self.play(FadeIn(lab24), label[0].animate.set_opacity(0.3), run_time=0.4)
        self.wait(0.8)

        # 십 모형 24개 나누기
        self.say(f"{b('십 모형 24개')}를 한 학교에 {b('6개씩')}", "십 모형 24개를 4개 학교에 나누면 한 학교에 6개씩이에요.")
        k_ = 0
        for r in range(6):
            mv = []
            for i, p in enumerate(plates):
                c = p[0].get_center()
                mv.append(all_rods[k_].animate.move_to(c + np.array([-0.82 + r * 0.2, 0, 0])))
                k_ += 1
            self.play(*mv, run_time=0.45)
        self.play(FadeOut(lab24), run_time=0.3)
        self.wait(0.6)
        self.say(f"{o('일 모형 8개')}는 한 학교에 {o('2개씩')}", "일 모형 8개는 한 학교에 2개씩이에요.")
        for r in range(2):
            mv = []
            for i, p in enumerate(plates):
                c = p[0].get_center()
                mv.append(ones[r * 4 + i].animate.move_to(c + np.array([0.6, 0.12 - r * 0.24, 0])))
            self.play(*mv, run_time=0.6)
        self.wait(0.5)
        labs = VGroup(*[M(f"{b('6')}{o('2')}", 64).next_to(p[0], DOWN, buff=0.18) for p in plates])
        self.say(f"한 학교 = {b('십 모형 6개')} + {o('일 모형 2개')} = {g('62')}그루",
                 "한 학교에 십 모형 6개와 일 모형 2개, 62그루씩이에요.")
        self.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in labs], lag_ratio=0.15, run_time=0.9))
        boxes = VGroup(*[SurroundingRectangle(VGroup(p[0], l), color=GREEN, buff=0.08, stroke_width=5, corner_radius=0.25)
                         for p, l in zip(plates, labs)])
        self.play(Create(boxes), run_time=0.7)
        self.wait(1.8)
        self.settle()
        clear_stage(self)

    # ── 375 ÷ 3 자리별로 ──
    def by_place(self):
        self.section("자리별로 나누어 보기")
        head = M(f"{k('3')}{b('7')}{o('5')} ÷ 3 = ?", 84).move_to([0, 2.35, 0])
        rows = [
            (f"{k('백')}: {k('3')} ÷ 3 = {k('1')}", "백의 자리부터. 3 나누기 3은 1. 백 모형이 1개씩이에요."),
            (f"{b('십')}: {b('7')} ÷ 3 = {b('2')}, 남은 {b('십 1개')} → {o('일 10개')}",
             "십의 자리. 7 나누기 3은 2, 십 모형 1개가 남아요. 남은 십 모형 1개는 일 모형 10개로 바꿔요."),
            (f"{o('일')}: {o('10 + 5 = 15')}, {o('15 ÷ 3 = 5')}", "일의 자리. 10과 5를 합한 15를 3으로 나누면 5."),
            (f"몫: {k('100')} + {b('20')} + {o('5')} = {g('125')}", "모두 모으면 100 더하기 20 더하기 5, 몫은 125예요."),
        ]
        self.say(f"{k('3')}{b('7')}{o('5')} ÷ 3도 큰 자리부터", "375 나누기 3도 큰 자리부터 차례로 나누어 볼까요?")
        self.play(Write(head), run_time=0.9)
        ms = []
        for idx, (mk, nar) in enumerate(rows):
            m = M(mk, 50)
            m.scale_to_fit_width(min(m.width, 11.0)).move_to([0, 1.15 - idx * 0.95, 0])
            ms.append(m)
            self.say(mk, nar)
            self.play(FadeIn(m, shift=RIGHT * 0.2), run_time=0.6)
            self.wait(0.8)
        self.play(Indicate(ms[-1], color=GREEN, scale_factor=1.08), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    # ── 157 ÷ 5 확인 ──
    def check157(self):
        self.section("곱셈으로 확인하기")
        e = M(f"157 ÷ 5 = {g('31')} … {o('2')}", 96).move_to([0, 1.5, 0])
        chk = M(f"5 × {g('31')} + {o('2')} = 155 + {o('2')} = 157", 66).move_to([0, -0.05, 0])
        self.say("확인하는 식으로 확인해요", "5화에서 배운 확인하는 식으로 확인해요. 5 곱하기 31은 155, 더하기 2는 157.")
        self.play(Write(e), run_time=0.9)
        self.play(Write(chk), run_time=1.1)
        mark = check_mark(0.8).next_to(chk, RIGHT, buff=0.4)
        ok = M(f"{o('나머지 2')} &lt; 나누는 수 5", 52).move_to([0, -1.4, 0])
        self.say(f"처음 수 157이 나오고, {o('나머지 2')} &lt; 5", "처음 수 157이 나오고, 나머지 2도 5보다 작아요. 바르게 계산했어요!")
        self.play(Create(mark), FadeIn(ok, shift=UP * 0.2), run_time=0.8)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
