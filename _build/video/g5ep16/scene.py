"""「수학 원리 돋보기」 5학년 16화 — 분모가 다른 분수의 크기 비교 (5-1 4단원 6차시, 화 코드 5-1-4-d)

딸기 맛 3/5, 초코 맛 4/7: 통분 21/35 > 20/35 → 딸기 맛이 더 많이
세 분수 2/3, 3/4, 5/8: 둘씩 통분해 차례로 → 2/3 < 3/4, 3/4 > 5/8, 2/3 > 5/8 → 3/4 > 2/3 > 5/8
대분수는 자연수 부분 먼저
최종: GRADE=5 ./make_final.sh 16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row, mixed


class G5Ep16(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 16
    EP_TITLE = "분모가 다른 분수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.two()
        self.three()
        self.closing(f"분모가 다른 분수는 {o('통분')}해서 분자끼리 견주어요\n세 분수는 {b('둘씩')} 차례로, 대분수는 {g('자연수 부분')}부터",
                     next_preview="5학년 17화 · 분수와 소수의 크기 비교")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("딸기 맛 젤라토는 3/5, 초코 맛은 4/7만큼 남았어요.\n어느 맛이 더 많이 남았을까요?", 40).move_to([0.6, 1.6, 0])
        self.say("3/5과 4/7 중 큰 분수는?", "딸기 맛 젤라토는 5분의 3, 초코 맛은 7분의 4만큼 남았어요. 어느 맛이 더 많이 남았을까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def two(self):
        self.section("통분하여 비교하기")
        e = row(frac(3, 5, 60), "와", frac(4, 7, 60), size=50).move_to([0, 1.9, 0])
        self.play(FadeIn(e), run_time=0.5)
        e2 = row(frac(21, 35, 70, cn=ORANGE), M(f"{g('&gt;')}", 70), frac(20, 35, 70, cn=BLUE), size=54).move_to([0, -0.15, 0])
        self.say(f"분모 35로 통분하면 {o('21/35')}, {b('20/35')}", "5와 7의 최소공배수 35로 통분하면 35분의 21과 35분의 20이에요.")
        self.play(FadeIn(e2[0]), FadeIn(e2[2]), run_time=0.7)
        self.say(f"분자를 견주면 21 > 20", "분모가 같아졌으니 분자만 견주면 돼요. 21이 20보다 크니 5분의 3이 더 커요.")
        self.play(FadeIn(e2[1]), run_time=0.5)
        t = M(f"{g('딸기 맛')}이 더 많이 남았어요", 46).move_to([0, -2.0, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def three(self):
        self.section("세 분수는 둘씩")
        fs = row(frac(2, 3, 58), ",", frac(3, 4, 58), ",", frac(5, 8, 58), size=54).move_to([0, 2.0, 0])
        self.say("2/3, 3/4, 5/8의 크기는?", "세 분수 3분의 2, 4분의 3, 8분의 5의 크기를 견주어 볼게요. 두 분수씩 통분해서 차례로 견주어요.")
        self.play(FadeIn(fs), run_time=0.5)
        lines = [
            (f"2/3 = 8/12,  3/4 = 9/12  →  2/3 {o('&lt;')} 3/4", "3분의 2와 4분의 3은 12분의 8과 12분의 9. 4분의 3이 더 커요."),
            (f"3/4 = 6/8,  5/8  →  3/4 {o('&gt;')} 5/8", "4분의 3과 8분의 5는 8분의 6과 8분의 5. 4분의 3이 더 커요."),
            (f"2/3 = 16/24,  5/8 = 15/24  →  2/3 {o('&gt;')} 5/8", "3분의 2와 8분의 5는 24분의 16과 24분의 15. 3분의 2가 더 커요."),
        ]
        rows = VGroup()
        for k, (mk, nar) in enumerate(lines):
            r = M(mk, 38).move_to([0, 0.9 - k * 0.75, 0])
            rows.add(r)
            self.say(mk.split("→")[1].strip(), nar)
            self.play(FadeIn(r), run_time=0.5)
        res = M(f"{g('3/4 &gt; 2/3 &gt; 5/8')}", 52).move_to([0, -1.6, 0])
        self.say(f"큰 순서로 {g('3/4, 2/3, 5/8')}", "그래서 큰 순서대로 4분의 3, 3분의 2, 8분의 5예요.")
        self.play(FadeIn(res), run_time=0.5)
        n = M(f"대분수는 {b('자연수 부분')}을 먼저 견주어요", 34, SOFT).move_to([0, -2.3, 0])
        self.say(f"대분수는 {b('자연수 부분')}부터", "대분수의 크기를 견줄 때는 자연수 부분을 먼저 견주고, 같으면 분수 부분을 통분해서 견주어요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
