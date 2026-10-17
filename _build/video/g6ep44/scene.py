"""「수학 원리 돋보기」 6학년 44화 — 나누어 주고 남는 양 (6-2 2단원 7차시, 화 코드 6-2-2-f)

흙 6.3 kg을 2 kg씩 담으면 6.3 − 2 − 2 − 2 = 0.3 → 3통에 담고 0.3 kg이 남음
몫이 자연수여야 할 때(사람 수, 도막 수)는 몫을 자연수 부분까지만 구하고, 남는 양의 소수점은 나누어지는 수의 처음 소수점 위치에 맞춤
12.4 ÷ 1.5 → 8명, 0.4 L / 확인: 1.5 × 8 + 0.4 = 12.4
최종: GRADE=6 ./make_final.sh 44
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from decdiv import DecDiv

GC = [ORANGE, BLUE, GREEN]


class G6Ep44(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 44
    EP_TITLE = "나누어 주고 남는 양"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.take()
        self.vertical()
        self.closing(f"몫이 자연수여야 하면 {o('자연수 부분까지만')} 구해요\n남는 양의 소수점은 {g('처음 소수점')} 위치에 맞추어 찍어요",
                     next_preview="6학년 45화 · 어느 방향에서 보았을까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("흙 6.3 kg을 화분에 2 kg씩 담으면\n몇 개의 화분에 담고, 몇 kg이 남을까요?", 42).move_to([0.6, 1.6, 0])
        self.say("6.3 ÷ 2는?", "흙 6.3 킬로그램을 화분에 2 킬로그램씩 담으려고 해요. 몇 개의 화분에 담고, 몇 킬로그램이 남을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def take(self):
        self.section("덜어 내기")
        U = 1.6
        parts = VGroup(*[Rectangle(width=2 * U, height=0.9, fill_color=GC[k], fill_opacity=0.55, stroke_color=INK, stroke_width=3) for k in range(3)],
                       Rectangle(width=0.3 * U, height=0.9, fill_color=SOFT, fill_opacity=0.5, stroke_color=INK, stroke_width=3)).arrange(RIGHT, buff=0).move_to([0, 1.5, 0])
        br = Brace(parts, UP, color=INK)
        bt = M("6.3 kg", 32).next_to(br, UP, buff=0.08)
        self.play(FadeIn(parts), FadeIn(br), FadeIn(bt), run_time=0.6)
        labs = VGroup(*[M(f"{k + 1}통 · 2 kg", 28).move_to(parts[k]) for k in range(3)])
        rest = M(o("0.3"), 26).next_to(parts[3], DOWN, buff=0.12)
        self.say(f"2 kg씩 {o('3통')}, {o('0.3 kg')}이 남아요", "2 킬로그램씩 덜어 내면 6.3 빼기 2 빼기 2 빼기 2는 0.3. 3통에 담고 0.3 킬로그램이 남아요.")
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.3, run_time=1.0), FadeIn(rest))
        e = M(f"6.3 − 2 − 2 − 2 = {o('0.3')}  →  {g('3통')}, 남는 양 {o('0.3 kg')}", 38).move_to([0, -0.1, 0])
        self.play(FadeIn(e), run_time=0.5)
        t = M(f"화분 수는 자연수 → 몫을 {b('자연수 부분까지만')}", 36).move_to([0, -1.1, 0])
        self.say(f"화분 수는 {b('자연수')}여야 해요", "화분의 수는 자연수여야 하니 몫을 자연수 부분까지만 구해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def vertical(self):
        self.section("세로셈: 12.4 ÷ 1.5")
        q = M("우유 12.4 L를 1.5 L씩 나누어 주면?", 32).move_to([3.0, 2.4, 0])
        self.play(FadeIn(q), run_time=0.4)
        d = DecDiv(self, "12.4", "1.5", x_left=-3.6, y0=1.1)
        self.say("소수점을 한 자리씩 옮겨 124 ÷ 15", "우유 12.4 리터를 1.5 리터씩 나누어 주면 몇 명에게 줄 수 있을까요? 소수점을 한 자리씩 옮겨 124 나누기 15로 계산해요.")
        d.show()
        old = d.pt
        d.move_point(1)
        self.say(f"몫은 자연수 {g('8')}까지만", "124 나누기 15는 8, 4가 남아요. 사람 수는 자연수이니 몫은 8까지만 구해요.")
        d.quot(2, "8")
        d.row("120", 2, 1)
        d.line(0, 2, 1)
        rem = d.row("4", 2, 2, ORANGE)
        self.play(old.animate.set_opacity(1).set_color(ORANGE), run_time=0.3)
        rp = d._dot(1, d.y(2), ORANGE)
        r0 = T("0", d.F, ORANGE).move_to([d.x(1), d.y(2), 0])
        t = M(f"남는 양의 소수점은\n{o('처음 소수점')} 위치에 → {o('0.4')}", 32).move_to([3.4, 0.9, 0])
        self.say(f"남는 양은 {o('0.4 L')}", "남는 양의 소수점은 나누어지는 수의 처음 소수점 위치에 맞추어 찍어요. 그래서 4가 아니라 0.4 리터가 남아요.")
        self.play(FadeIn(rp), FadeIn(r0), FadeIn(t), run_time=0.6)
        c = M(f"확인: 1.5 × 8 + 0.4 = {g('12.4')}", 34).move_to([3.4, -0.6, 0])
        self.say(f"{g('8명')}, {o('0.4 L')} 남아요", "8명에게 주고 0.4 리터가 남아요. 1.5 곱하기 8 더하기 0.4는 12.4로 맞는지 확인할 수 있어요.")
        self.play(FadeIn(c), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
