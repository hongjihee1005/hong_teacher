"""「수학 원리 돋보기」 4학년 5화 — 뛰어 세면 어느 자리가 변할까? (4-1 1단원 큰 수 7차시, 화 코드 4-1-1-e)

10만씩 뛰어 세면 십만의 자리 숫자가 1씩, 20만씩 뛰어 세면 2씩 커짐 / 십만 자리 9 다음은 백만 자리로 받아올림
1억씩 뛰어 센 수에서 변하는 자리 찾기
최종: GRADE=4 ./make_final.sh 5
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, CurvedArrow, FadeIn, FadeOut, Indicate, LaggedStart,
                   RoundedRectangle, SurroundingRectangle, VGroup, Write)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from bignum import EOK, TENK, digit_row, mix_form, pcol, span

YS = [1.95, 1.05, 0.15, -0.75, -1.65]


class G4Ep05(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 5
    EP_TITLE = "뛰어 세면 어느 자리가 변할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.jump(2540000, 100000, "10만씩", 5, "십만", 1, "10만씩 뛰어 세기")
        self.jump(2740000, 100000, "10만씩", 5, "십만", 1, "9 다음은?", carry=True)
        self.jump(1350000, 200000, "20만씩", 5, "십만", 2, "20만씩 뛰어 세기")
        self.which()
        self.closing(f"10만씩 뛰어 세면 {span('십만의 자리', TENK)} 숫자가 {o('1씩')},\n20만씩 뛰어 세면 {o('2씩')} 커져요",
                     next_preview="4학년 6화 · 큰 수의 크기 비교")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"예준이네 학교는 책 보내기 운동으로 모은 돈이\n{g('254만 원')}이에요. 해마다 {o('10만 원')}씩 더 모으면?", 50)
        q.scale_to_fit_width(min(q.width, 11.2)).move_to([0, 1.7, 0])
        self.say("254만에서 10만씩 커지면?", "책 보내기 운동으로 모은 돈이 254만 원이에요. 해마다 10만 원씩 더 모으면 어떻게 될까요?")
        self.play(Write(q), run_time=1.4)
        e = M(f"254만 → ? → ? → ?", 72).move_to([0, -0.4, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def jump(self, start, step, step_txt, n, place_name, inc, sec, carry=False):
        self.section(sec)
        k = len(str(step)) - 1 - (1 if str(step)[0] != "1" else 0)
        k = len(str(step // int(str(step)[0]))) - 1          # 바뀌는 자리(10만 → 5)
        rows = []
        for i in range(n):
            v = start + i * step
            r = digit_row(str(v), 0.6, YS[i], size=60, step=0.56)
            rows.append(r)
        head = T(place_name, 34, pcol(k)).move_to([0.6 - k * 0.56, 2.65, 0])
        intro = {"10만씩 뛰어 세기": ("254만부터 10만씩 뛰어 세어 봐요", "254만부터 10만씩 뛰어 세어 볼게요."),
                 "9 다음은?": ("십만의 자리가 9를 넘으면?", "이번에는 274만부터 10만씩 뛰어 세어 볼까요? 십만의 자리가 9를 넘으면 어떻게 될까요?"),
                 "20만씩 뛰어 세기": ("135만부터 20만씩", "135만부터 20만씩 뛰어 세면 어떻게 될까요?")}[sec]
        self.say(*intro)
        self.play(FadeIn(rows[0]), run_time=0.5)
        mixes = VGroup()
        m0 = T(mix_form(start), 38, SOFT).move_to([4.6, YS[0], 0])
        mixes.add(m0)
        self.play(FadeIn(m0), run_time=0.3)
        for i in range(1, n):
            a = CurvedArrow(rows[i - 1].get_right() + RIGHT * 0.3, rows[i].get_right() + RIGHT * 0.3, angle=-1.6, color=ORANGE)
            lab = T(f"+{step_txt[:-1]}", 30, ORANGE).next_to(a, RIGHT, buff=0.08)
            mm = T(mix_form(start + i * step), 38, SOFT).move_to([4.6, YS[i], 0])
            self.play(Create(a), FadeIn(lab), run_time=0.45)
            changed = [d for d, e in zip(rows[i - 1], rows[i]) if True]
            self.play(FadeIn(rows[i], shift=DOWN * 0.15), FadeIn(mm), run_time=0.5)
            mixes.add(mm)
        col = VGroup(*[r.at(k) for r in rows])
        box = SurroundingRectangle(col, color=pcol(k), buff=0.12, stroke_width=5)
        if not carry:
            self.say(f"{span(place_name + '의 자리', pcol(k))} 숫자가 {o(str(inc) + '씩')} 커져요",
                     f"{place_name}의 자리 숫자만 {inc}씩 커지고, 다른 자리 숫자는 그대로예요.")
            self.play(FadeIn(head), Create(box), run_time=0.7)
            self.play(LaggedStart(*[Indicate(d, color=pcol(k), scale_factor=1.3) for d in col], lag_ratio=0.2, run_time=1.2))
        else:
            self.play(FadeIn(head), Create(box), run_time=0.7)
            up = VGroup(rows[2].at(k + 1), rows[3].at(k + 1))
            self.say(f"9 다음은 0, {span('백만의 자리', pcol(k + 1))}가 1 커져요",
                     "십만의 자리가 9에서 10이 되면 0이 되고, 백만의 자리 숫자가 1 커져요. 284만 다음은 294만, 그다음은 304만이에요.")
            self.play(Indicate(rows[2].at(k), color=pcol(k), scale_factor=1.4), run_time=0.6)
            self.play(Create(SurroundingRectangle(rows[3].at(k + 1), color=pcol(k + 1), buff=0.1, stroke_width=5)),
                      Indicate(rows[3].at(k + 1), color=pcol(k + 1), scale_factor=1.4), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def which(self):
        self.section("어느 자리가 변할까?")
        start, step = 350000000, 100000000
        rows = [digit_row(str(start + i * step), 0.9, YS[i], size=58, step=0.52) for i in range(4)]
        self.say("어느 자리 숫자가 변했을까요?", "이번에는 거꾸로 생각해요. 어느 자리 숫자가 얼마씩 변했을까요?")
        self.play(LaggedStart(*[FadeIn(r, shift=DOWN * 0.15) for r in rows], lag_ratio=0.3, run_time=1.4))
        mixes = VGroup(*[T(mix_form(start + i * step), 38, SOFT).move_to([4.7, YS[i], 0]) for i in range(4)])
        self.play(FadeIn(mixes), run_time=0.5)
        self.wait(0.8)
        self.pause_screen(5)
        col = VGroup(*[r.at(8) for r in rows])
        box = SurroundingRectangle(col, color=EOK, buff=0.12, stroke_width=5)
        head = T("억", 34, EOK).move_to([0.9 - 8 * 0.52, 2.65, 0])
        self.say(f"{span('억의 자리', EOK)} 숫자가 1씩 → {g('1억씩')} 뛰어 세었어요",
                 "억의 자리 숫자가 3, 4, 5, 6으로 1씩 커졌어요. 1억씩 뛰어 센 거예요.")
        self.play(Create(box), FadeIn(head), run_time=0.7)
        self.play(LaggedStart(*[Indicate(d, color=EOK, scale_factor=1.3) for d in col], lag_ratio=0.2, run_time=1.2))
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
