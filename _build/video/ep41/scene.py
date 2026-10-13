"""「수학 원리 돋보기」 41화 — 올림이 두 번 있는 곱셈 (1학기 4단원 6차시, 화 코드 1-4-c)

23 × 5: 어림(약 20 × 5 = 약 100) → 정확히 115 / 36 × 4: 일의 자리 올림 2, 십의 자리 올림 1 → 144
최종: ./make_final.sh 41
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, UP, FadeIn, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from multiply import mul_vertical


class Ep41(EpisodeScene):
    EP_NO = 41
    EP_TITLE = "올림이 두 번 있는 곱셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.estimate()
        self.section("세로셈으로 23 × 5")
        mul_vertical(self, 23, 5)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.section("올림 두 번! 36 × 4")
        mul_vertical(self, 36, 4)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.biggest()
        self.closing(f"일의 자리 올림은 {b('십의 자리 곱에 더하고')}\n십의 자리 올림은 {g('백의 자리에 써요')}",
                     next_preview="42화 · 1 cm보다 짧은 길이, mm")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"만화 그리기 체험을 한 회에 {b('23명')}씩 {o('5회')} 해요.\n모두 몇 명일까요?", 52).move_to([0, 1.3, 0])
        self.say("한 회에 23명씩 5회", "만화 창작실에서 만화 그리기 체험을 한 회에 23명씩 5회 해요. 모두 몇 명일까요?")
        self.play(Write(q), run_time=1.2)
        e = M("23 × 5 = ?", 100).move_to([0, -0.8, 0])
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def estimate(self):
        self.section("먼저 어림하기")
        a = M(f"23 → {b('약 20')}", 60).move_to([0, 1.3, 0])
        c = M(f"약 20 × 5 = {g('약 100')}", 66).move_to([0, 0.0, 0])
        self.say(f"23은 {b('약 20')}", "계산하기 전에 어림해 볼까요? 23은 20에 가까우니 약 20.")
        self.play(FadeIn(a), run_time=0.5)
        self.say(f"약 20 × 5 = {g('약 100')}", "약 20 곱하기 5는 약 100. 답은 100쯤 될 거예요.")
        self.play(FadeIn(c), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def biggest(self):
        self.section("곱이 가장 크려면?")
        q = M(f"수 카드 {b('5')}, {b('6')}, {b('9')}로 (몇십몇) × (몇)을 만들어요", 46).move_to([0, 2.3, 0])
        self.say("곱이 가장 큰 곱셈을 만들어 볼까요?", "수 카드 5, 6, 9를 한 번씩 써서 곱이 가장 큰 몇십몇 곱하기 몇을 만들어 볼까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(2.0)
        rows = VGroup(M("95 × 6 = 570", 50), M("96 × 5 = 480", 50), M(f"65 × 9 = {g('585')}", 50))
        rows.arrange(DOWN, buff=0.4).move_to([0, 0.2, 0])
        self.say(f"가장 큰 수 9를 곱하는 수로! 65 × 9 = {g('585')}", "여러 가지로 만들어 보면 가장 큰 수 9를 곱하는 수로 쓴 65 곱하기 9가 585로 가장 커요.")
        for r in rows:
            self.play(FadeIn(r), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
