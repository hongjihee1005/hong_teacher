"""「수학 원리 돋보기」 16화 — 눈금 읽기와 어림 (2학기 5단원 4·8차시, 화 코드 2-5-b)

비커 눈금(작은 눈금 한 칸 = 100 mL, 50 mL) → 큰 눈금부터, 한 칸이 얼마인지 → 저울 눈금(한 칸 100 g)
→ 어림: 잘 아는 물건을 기준으로(종이컵 약 200 mL, 1 L 우유갑) → 어림과 잰 값의 차이
최종: ./make_final.sh 16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Arrow, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, ValueTracker, VGroup, Write,
    always_redraw,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from measure import Beaker, cup, dial_face, needle, bottle


def fit(m, y, x=3.2, w=6.0):
    if m.width > w:
        m.scale_to_fit_width(w)
    return m.move_to([x, y, 0])


class Ep16(EpisodeScene):
    EP_NO = 16
    EP_TITLE = "눈금 읽기와 어림"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.beaker100()
        self.beaker50()
        self.scale()
        self.estimate()
        self.closing(f"{b('큰 눈금')}부터 읽고, {o('작은 눈금 한 칸')}이 얼마인지 확인해요\n잘 아는 물건을 기준으로 어림해요",
                     next_preview="17화 · 들이의 덧셈과 뺄셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        bk = Beaker(1000, major=500, minor=100, height=4.0, width=2.0, label_every=500).move_to([-2.6, 0.0, 0])
        bk.set_level(700)
        self.say("비커에 물이 담겨 있어요", "비커에 물이 담겨 있어요. 물의 양은 얼마일까요?")
        self.play(FadeIn(bk), run_time=0.7)
        q = fit(M(f"눈금을 {b('어떻게')} 읽을까요?", 56), 0.6)
        self.say("숫자가 없는 눈금은 어떻게 읽을까요?", "숫자가 쓰여 있지 않은 눈금은 어떻게 읽어야 할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def beaker100(self):
        self.section("비커 눈금 읽기")
        bk = Beaker(1000, major=500, minor=100, height=4.4, width=2.0, label_every=500).move_to([-3.4, 0.1, 0])
        bk.set_level(700)
        self.play(FadeIn(bk), run_time=0.5)
        y500 = bk.glass[1].get_center()[1] + 4.4 * 0.5
        self.say(f"① {b('큰 눈금')}: 500 mL를 넘었어요", "먼저 숫자가 있는 큰 눈금부터 봐요. 물이 500밀리리터를 넘었어요.")
        hl = Line(bk.glass[0].get_left() + [0, y500 - bk.glass[0].get_left()[1], 0] + LEFT * 0.1, [bk.get_right()[0] - 0.4, y500, 0], color=BLUE, stroke_width=6)
        self.play(Create(hl), run_time=0.5)
        s1 = fit(M(f"① {b('큰 눈금')}부터: 500 mL", 46), 1.8)
        self.play(FadeIn(s1), run_time=0.5)
        self.wait(0.6)
        self.say(f"② 500과 1000 사이가 {o('5칸')} → 한 칸은 {o('100 mL')}", "500에서 1000까지가 작은 눈금 5칸으로 나뉘어 있어요. 500 나누기 5, 한 칸은 100밀리리터예요.")
        s2 = fit(M(f"② 한 칸 = 500 ÷ 5 = {o('100 mL')}", 42), 0.7)
        self.play(FadeIn(s2), LaggedStart(*[Indicate(t, color=ORANGE, scale_factor=1.6) for t in bk.ticks[5:10]], lag_ratio=0.2), run_time=1.2)
        self.wait(0.6)
        self.say(f"③ 500에서 {o('2칸')} 더 → {g('700 mL')}", "500에서 2칸 더 올라갔으니 600, 700. 700밀리리터예요.")
        s3 = fit(M(f"③ 500 + {o('100 + 100')} = {g('700 mL')}", 46), -0.4)
        self.play(FadeIn(s3), run_time=0.6)
        self.play(Indicate(bk.water, color=GREEN, scale_factor=1.02), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def beaker50(self):
        self.section("한 칸이 다르면?")
        bk = Beaker(500, major=100, minor=50, height=4.4, width=2.0, label_every=100).move_to([-3.4, 0.1, 0])
        bk.set_level(350)
        self.say("이 비커는 한 칸이 얼마일까요?", "이번 비커는 눈금이 다르게 나뉘어 있어요. 작은 눈금 한 칸은 얼마일까요?")
        self.play(FadeIn(bk), run_time=0.6)
        self.wait(1.5)
        s1 = fit(M(f"100과 200 사이가 {o('2칸')} → 한 칸 {o('50 mL')}", 44), 1.2)
        self.say(f"100 사이가 {o('2칸')} → 한 칸은 {o('50 mL')}", "숫자 100과 200 사이가 2칸이니 한 칸은 50밀리리터예요.")
        self.play(FadeIn(s1), run_time=0.6)
        s2 = fit(M(f"300 + {o('50')} = {g('350 mL')}", 56), 0.0)
        self.say(f"300에서 한 칸 더 → {g('350 mL')}", "300에서 한 칸 더 올라갔으니 300 더하기 50, 350밀리리터예요.")
        self.play(FadeIn(s2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def scale(self):
        self.section("저울 눈금 읽기")
        c = np.array([-3.0, 0.1, 0])
        face = dial_face(c, 2.1)
        v = ValueTracker(0)
        nd = always_redraw(lambda: needle(c, v.get_value(), 2.1))
        self.say("저울도 같은 방법으로 읽어요", "무게를 재는 저울도 같은 방법으로 읽어요. 사과 상자를 올려 볼게요.")
        self.play(FadeIn(face), FadeIn(nd), run_time=0.6)
        self.play(v.animate.set_value(1300), run_time=1.6)
        s1 = fit(M(f"① 큰 눈금: {b('1 kg')}을 넘었어요", 44), 1.7)
        s2 = fit(M(f"② 1 kg이 {o('10칸')} → 한 칸 {o('100 g')}", 44), 0.7)
        s3 = fit(M(f"③ 1 kg에서 {o('3칸')} → {g('1 kg 300 g')}", 44), -0.3)
        self.say(f"① 숫자 {b('1')}을 넘었어요: 1 kg", "먼저 큰 눈금을 보면 바늘이 1킬로그램을 넘었어요.")
        self.play(FadeIn(s1), run_time=0.5)
        self.say(f"② 1 kg이 {o('10칸')} → 한 칸은 {o('100 g')}", "1킬로그램은 1000그램이고 10칸으로 나뉘어 있으니 한 칸은 100그램이에요.")
        self.play(FadeIn(s2), run_time=0.5)
        self.say(f"③ 3칸 더 → {g('1 kg 300 g')}", "1킬로그램에서 3칸 더 갔으니 1킬로그램 300그램이에요.")
        self.play(FadeIn(s3), run_time=0.5)
        nd.clear_updaters()
        self.play(Indicate(nd, color=GREEN, scale_factor=1.1), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def estimate(self):
        self.section("어림하기")
        cp = cup(ORANGE, 0.9).move_to([-4.0, 0.9, 0])
        lc = M(f"종이컵 한 컵 ≈ {o('약 200 mL')}", 38).next_to(cp, DOWN, buff=0.35)
        bt = bottle(2.4, 1.0).move_to([0.3, 0.9, 0])
        self.say("어림할 때는 잘 아는 물건을 기준으로", "재기 전에 어림할 때는 잘 아는 물건을 기준으로 삼으면 좋아요. 종이컵 한 컵은 약 200밀리리터예요.")
        self.play(FadeIn(cp), FadeIn(lc), run_time=0.7)
        self.say("이 물병은 종이컵으로 몇 컵쯤일까요?", "이 물병은 종이컵으로 몇 컵쯤 될 것 같나요?")
        self.play(FadeIn(bt), run_time=0.5)
        self.wait(2.0)
        cups = VGroup(*[cup(ORANGE, 0.45) for _ in range(5)]).arrange(RIGHT, buff=0.15).move_to([3.9, 0.9, 0])
        e = M(f"약 5컵 → {o('약 1000 mL')} = {b('약 1 L')}", 44).move_to([1.6, -0.9, 0])
        self.say(f"약 5컵이면 {b('약 1 L')}", "약 5컵쯤이면 200의 5배, 약 1000밀리리터, 곧 약 1리터라고 어림할 수 있어요.")
        self.play(LaggedStart(*[FadeIn(x) for x in cups], lag_ratio=0.2, run_time=1.0), FadeIn(e))
        r = M(f"재어 보니 {g('1 L 200 mL')} → 어림과 {o('200 mL')} 차이", 44).move_to([0.6, -1.9, 0])
        self.say(f"재어 보니 1 L 200 mL, 차이는 {o('200 mL')}", "실제로 재어 보니 1리터 200밀리리터였어요. 어림한 값과 200밀리리터 차이가 나요. 어림은 '약'을 붙여 말해요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
