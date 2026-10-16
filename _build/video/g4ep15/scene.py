"""「수학 원리 돋보기」 4학년 15화 — 몇십으로 나누기 (4-1 3단원 곱셈과 나눗셈 4차시, 화 코드 4-1-3-c)

160 ÷ 20 = 8 (16 ÷ 2와 같은 몫, 20 × 8 = 160) / 271 ÷ 50 = 5 … 21
몫 어림 → 크면 1 작게, 나머지가 나누는 수보다 크거나 같으면 1 크게 / 나머지 < 나누는 수
최종: GRADE=4 ./make_final.sh 15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   RoundedRectangle, SurroundingRectangle, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from base10 import ten_rod

RED = "#C0392B"


class G4Ep15(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 15
    EP_TITLE = "몇십으로 나누기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.rods()
        self.table()
        self.remainder()
        self.closing(f"곱셈으로 {o('몫을 어림')}하고 고쳐요\n나머지는 언제나 {g('나누는 수보다 작아야')} 해요",
                     next_preview="4학년 16화 · 몫이 한 자리인 (몇십몇)으로 나누기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"풍선 {b('160개')}를 한 상자에 {o('20개')}씩 담으면\n몇 상자가 될까요?", 52)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0, 1.4, 0])
        self.say("160개를 20개씩", "풍선 160개를 한 상자에 20개씩 담으면 몇 상자가 될까요?")
        self.play(Write(q), run_time=1.2)
        e = M("160 ÷ 20 = ?", 100).move_to([0, -0.8, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def rods(self):
        self.section("십 모형으로 보기")
        prs = VGroup(*[VGroup(ten_rod(0.16), ten_rod(0.16)).arrange(RIGHT, buff=0.06) for _ in range(8)]).arrange(RIGHT, buff=0.36).move_to([0, 1.3, 0])
        rods = VGroup(*[r for pr in prs for r in pr])
        self.say(f"160은 십 모형 {b('16개')}", "160은 십 모형 16개예요. 20은 십 모형 2개.")
        self.play(LaggedStart(*[FadeIn(r) for r in rods], lag_ratio=0.05, run_time=1.0))
        boxes = VGroup()
        for k in range(8):
            pair = VGroup(rods[2 * k], rods[2 * k + 1])
            boxes.add(SurroundingRectangle(pair, color=ORANGE, buff=0.07, stroke_width=4))
        self.say(f"2개씩 묶으면 {o('8묶음')}", "십 모형을 2개씩 묶으면 8묶음이에요.")
        self.play(LaggedStart(*[Create(bx) for bx in boxes], lag_ratio=0.15, run_time=1.4))
        l1 = M(f"16 ÷ 2 = {o('8')}  →  160 ÷ 20 = {g('8')}", 56).move_to([0, -0.6, 0])
        self.say(f"16 ÷ 2와 몫이 같아요 → {g('8')}", "그래서 160 나누기 20은 16 나누기 2와 몫이 같은 8이에요. 8상자가 돼요.")
        self.play(FadeIn(l1), run_time=0.6)
        l2 = M(f"확인: 20 × 8 = {g('160')}", 50).move_to([0, -1.7, 0])
        self.play(FadeIn(l2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def table(self):
        self.section("곱셈으로 몫 어림하기")
        q = M("271 ÷ 50 = ?", 72).move_to([0.6, 2.05, 0])
        self.say("271 ÷ 50은?", "이번에는 271 나누기 50이에요. 50에 몇을 곱하면 271에 가까울까요?")
        self.play(FadeIn(q), run_time=0.5)
        rows = VGroup()
        for k in (4, 5, 6):
            v = 50 * k
            rows.add(M(f"50 × {k} = {v}", 52))
        rows.arrange(DOWN, buff=0.3).move_to([-2.6, -0.2, 0])
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3, run_time=1.0))
        bad = Cross(rows[2], stroke_color=RED, stroke_width=6)
        self.say(f"300은 271보다 커서 {span_red('안 돼요')}", "50 곱하기 6은 300, 271보다 커서 뺄 수 없어요.")
        self.play(Create(bad), run_time=0.5)
        ok = SurroundingRectangle(rows[1], color=GREEN, buff=0.1, stroke_width=5)
        self.say(f"271을 넘지 않는 가장 큰 곱 → {g('50 × 5 = 250')}", "271을 넘지 않으면서 가장 가까운 곱은 50 곱하기 5, 250이에요.")
        self.play(Create(ok), run_time=0.5)
        r = M(f"271 − 250 = {o('21')}", 52).move_to([3.0, 0.4, 0])
        a = M(f"271 ÷ 50 = {g('5')} … {o('21')}", 56).move_to([3.0, -0.7, 0])
        self.say(f"몫 {g('5')}, 나머지 {o('21')}", "271에서 250을 빼면 21이 남아요. 몫은 5, 나머지는 21이에요.")
        self.play(FadeIn(r), run_time=0.5)
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def remainder(self):
        self.section("몫을 고치는 방법")
        l1 = M(f"몫을 {o('4')}로 어림하면  271 − 200 = {o('71')}", 46).move_to([0, 1.7, 0]).shift(RIGHT * 0.4)
        l2 = M(f"나머지 71 ≥ 50 → 몫을 {g('1 크게')}", 46).move_to([0, 0.75, 0])
        l3 = M(f"몫을 {o('6')}로 어림하면  50 × 6 = 300 &gt; 271", 46).move_to([0, -0.4, 0])
        l4 = M(f"빼는 수가 더 커요 → 몫을 {g('1 작게')}", 46).move_to([0, -1.35, 0])
        self.say("몫을 잘못 어림했다면?", "만약 몫을 4로 어림했다면, 남은 71이 나누는 수 50보다 커요. 한 번 더 나눌 수 있으니 몫을 1 크게 해요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.5)
        self.say("너무 크게 어림했다면?", "몫을 6으로 어림하면 50 곱하기 6이 271보다 커서 뺄 수 없어요. 몫을 1 작게 해요.")
        self.play(FadeIn(l3), run_time=0.5)
        self.play(FadeIn(l4), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def span_red(s):
    return f'<span foreground="{RED}">{s}</span>'
