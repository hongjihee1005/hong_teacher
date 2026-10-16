"""「수학 원리 돋보기」 4학년 2화 — 다섯 자리 수와 자릿값 (4-1 1단원 큰 수 3차시, 화 코드 4-1-1-b)

10000이 2개, 1000이 3개, 100이 5개, 10이 8개, 1이 6개 → 23586(2만 3586), 이만 삼천오백팔십육
23586 = 20000 + 3000 + 500 + 80 + 6 / 77777: 같은 숫자도 자리마다 값이 다름 / 40305: 0인 자리는 읽지 않음
최종: GRADE=4 ./make_final.sh 2
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, LaggedStart,
                   SurroundingRectangle, TransformFromCopy, VGroup, Write)

from series_style import GREEN, INK, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from bignum import PlaceChart, num_card, pcol, place_markup, read_num, span

NAMES = ["만", "천", "백", "십", "일"]


class G4Ep02(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 2
    EP_TITLE = "다섯 자리 수와 자릿값"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.to_chart()
        self.values()
        self.same_digit()
        self.zeros()
        self.closing(f"다섯 자리 수는 {g('만')}의 자리부터 읽고,\n같은 숫자도 {g('자리')}에 따라 나타내는 값이 달라요",
                     next_preview="4학년 3화 · 십만, 백만, 천만")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("예준이가 모은 돈을 수 카드로 나타냈어요. 모두 얼마일까요?", 46)
        q.scale_to_fit_width(min(q.width, 10.6)).move_to([0.5, 2.2, 0])
        self.say("예준이가 모은 돈은 얼마일까요?", "예준이가 통장에 모은 돈을 수 카드로 나타냈어요. 모두 얼마일까요?")
        self.play(Write(q), run_time=1.2)
        cards = self.card_rows()
        cards.scale_to_fit_width(min(cards.width, 11.0)).move_to([0, -0.4, 0])
        self.play(LaggedStart(*[FadeIn(r, shift=UP * 0.2) for r in cards], lag_ratio=0.2, run_time=1.4))
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def card_rows(self):
        rows = VGroup()
        for i, (v, n) in enumerate([(10000, 2), (1000, 3), (100, 5), (10, 8), (1, 6)]):
            c = pcol(4 - i)
            row = VGroup(*[num_card(v, c, w=1.2 if v >= 1000 else (0.9 if v == 100 else 0.75), h=0.5, size=26) for _ in range(n)])
            row.arrange(RIGHT, buff=0.08)
            lab = M(f"{span(str(v), c)}이 {n}개", 34)
            rows.add(VGroup(lab, row).arrange(RIGHT, buff=0.35))
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.16)
        return rows

    def to_chart(self):
        self.section("자릿값 표에 나타내기")
        rows = self.card_rows()
        rows.scale_to_fit_width(6.0).move_to([-3.75, 0.5, 0])
        ch = PlaceChart(NAMES, cell_w=0.95, digit_size=56).move_to([3.75, 0.9, 0])
        self.say("10000이 2개, 1000이 3개, …", "10000이 2개, 1000이 3개, 100이 5개, 10이 8개, 1이 6개예요.")
        self.play(FadeIn(rows), FadeIn(ch), run_time=0.8)
        nar = ["10000이 2개이면 만의 자리에 2.", "1000이 3개이면 천의 자리에 3.", "100이 5개이면 백의 자리에 5.",
               "10이 8개이면 십의 자리에 8.", "1이 6개이면 일의 자리에 6."]
        for i, d in enumerate("23586"):
            dg = ch.digit(i, d)
            self.say(f"{span(NAMES[i] + '의 자리', pcol(4 - i))}에 {span(d, pcol(4 - i))}", nar[i])
            self.play(Indicate(rows[i], color=pcol(4 - i), scale_factor=1.06), run_time=0.5)
            self.play(TransformFromCopy(rows[i][0], dg), run_time=0.6)
            ch.add(dg)
        w1 = M(f"쓰기  {place_markup('23586')}  또는  {g('2만 3586')}", 50).move_to([0, -1.9, 0])
        self.say(f"쓰기: 23586 또는 {g('2만 3586')}", "23586 또는 2만 3586이라고 써요.")
        self.play(FadeOut(rows), ch.animate.move_to([0, 1.1, 0]), run_time=0.7)
        w1.move_to([0, -0.85, 0])
        self.play(FadeIn(w1, shift=UP * 0.2), run_time=0.6)
        # 읽기: 숫자 + 자리 이름
        parts = [("2", "만"), ("3", "천"), ("5", "백"), ("8", "십"), ("6", "")]
        rd = M(f"읽기  {g(read_num(23586))}", 50).move_to([0, -1.85, 0])
        self.say(f"읽기: {g('이만 삼천오백팔십육')}", "읽을 때는 숫자와 자리 이름을 함께 읽어요. 이만 삼천오백팔십육.")
        self.play(FadeIn(rd, shift=UP * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def values(self):
        self.section("숫자가 나타내는 값")
        top = M(place_markup("23586"), 110).move_to([0, 2.0, 0])
        self.say("각 숫자는 얼마를 나타낼까요?", "23586에서 각 숫자는 얼마를 나타낼까요?")
        self.play(FadeIn(top), run_time=0.6)
        vals = ["20000", "3000", "500", "80", "6"]
        col = VGroup(*[M(span(v, pcol(4 - i)), 54) for i, v in enumerate(vals)])
        plus = [T("+", 54) for _ in range(4)]
        line = VGroup()
        for i, c in enumerate(col):
            line.add(c)
            if i < 4:
                line.add(plus[i])
        line.arrange(RIGHT, buff=0.3)
        eqs = T("23586 =", 54).next_to(line, LEFT, buff=0.3)
        whole = VGroup(eqs, line)
        whole.scale_to_fit_width(min(whole.width, 12.6)).move_to([0, 0.2, 0])
        self.play(FadeIn(eqs), run_time=0.4)
        for i, c in enumerate(col):
            if i == 0:
                self.say(f"2는 만의 자리 → {span('20000', pcol(4))}", "2는 만의 자리 숫자라서 20000을 나타내요.")
            elif i == 1:
                self.say(f"3은 천의 자리 → {span('3000', pcol(3))}", "3은 천의 자리 숫자라서 3000.")
            elif i == 4:
                self.say("500, 80, 6", "5는 500, 8은 80, 6은 6을 나타내요.")
            self.play(Indicate(top[i], color=pcol(4 - i), scale_factor=1.25),
                      FadeIn(c, shift=DOWN * 0.3), *([FadeIn(plus[i])] if i < 4 else []), run_time=0.6)
        self.say(f"23586은 각 자리 값의 {g('합')}", "그래서 23586은 20000, 3000, 500, 80, 6을 모두 더한 수예요.")
        box = SurroundingRectangle(VGroup(eqs, line), color=GREEN, buff=0.2, stroke_width=5)
        self.play(Create(box), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def same_digit(self):
        self.section("같은 숫자, 다른 값")
        num = M(place_markup("77777"), 110).move_to([0, 2.35, 0])
        self.say("77777 — 숫자가 모두 7이에요", "77777은 숫자가 모두 7이에요. 그럼 다섯 개의 7은 모두 같은 값일까요?")
        self.play(FadeIn(num), run_time=0.6)
        vals = VGroup()
        for i, v in enumerate(["70000", "7000", "700", "70", "7"]):
            m = M(f"{span(NAMES[i] + '의 자리', pcol(4 - i))}  →  {span(v, pcol(4 - i))}", 40)
            vals.add(m)
        vals.arrange(DOWN, aligned_edge=LEFT, buff=0.14).move_to([0, -0.75, 0])
        self.say(f"같은 7이라도 {g('자리')}에 따라 값이 달라요",
                 "같은 7이라도 만의 자리는 70000, 천의 자리는 7000, 백의 자리는 700, 십의 자리는 70, 일의 자리는 7을 나타내요.")
        for i, m in enumerate(vals):
            self.play(Indicate(num[i], color=pcol(4 - i), scale_factor=1.3), FadeIn(m, shift=RIGHT * 0.2), run_time=0.55)
        self.wait(0.6)
        self.say(f"왼쪽으로 한 자리 갈 때마다 {o('10배')}", "왼쪽으로 한 자리 갈 때마다 나타내는 값이 10배씩 커져요.")
        arr = Arrow([3.4, -2.2, 0], [3.4, 1.0, 0], color=SOFT, stroke_width=6, buff=0)
        lab = M(o("× 10"), 44).next_to(arr, RIGHT, buff=0.2)
        arr.move_to([vals.get_right()[0] + 0.8, vals.get_center()[1], 0])
        lab.next_to(arr, RIGHT, buff=0.2)
        self.play(Create(arr), FadeIn(lab), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def zeros(self):
        self.section("0이 있는 수 읽기")
        ch = PlaceChart(NAMES, cell_w=1.05, digit_size=60).move_to([0, 1.3, 0])
        self.say("40305는 어떻게 읽을까요?", "40305는 어떻게 읽을까요?")
        self.play(FadeIn(ch), run_time=0.5)
        ch.fill(self, "40305")
        zs = [ch.digits[1], ch.digits[3]]
        rings = VGroup(*[SurroundingRectangle(z, color=SOFT, buff=0.12, stroke_width=4) for z in zs])
        self.say(f"0인 자리는 {g('읽지 않아요')}", "천의 자리와 십의 자리는 0이에요. 0인 자리는 읽지 않아요.")
        self.play(Create(rings), *[z.animate.set_opacity(0.3) for z in zs], run_time=0.7)
        rd = M(f"{span('4', pcol(4))}만  {span('3', pcol(2))}백  {span('5', pcol(0))}  →  {g(read_num(40305))}", 56).move_to([0, -1.2, 0])
        self.say(f"사만 삼백오", "그래서 40305는 사만 삼백오라고 읽어요.")
        self.play(FadeIn(rd, shift=UP * 0.2), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
