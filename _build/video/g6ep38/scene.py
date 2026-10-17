"""「수학 원리 돋보기」 6학년 38화 — (대분수) ÷ (분수) (6-2 1단원 7차시, 화 코드 6-2-1-f)

운석 4 1/2 g을 페트리 접시 한 개에 3/4 g씩 → 4 1/2 ÷ 3/4
하윤: 9/2 ÷ 3/4 = 18/4 ÷ 3/4 = 18 ÷ 3 = 6 (통분) / 재민: 9/2 ÷ 3/4 = 9/2 × 4/3 = 6 (곱셈)
(생각을 더하다: 1 kg의 가격 — 1200 ÷ 2/5 = 3000원, 2000 ÷ 5/8 = 3200원)
최종: GRADE=6 ./make_final.sh 38
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, mixed, row

GC = [ORANGE, BLUE, GREEN, "#7A4FB5", "#D9668C", "#2A9D8F"]


class G6Ep38(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 38
    EP_TITLE = "(대분수) ÷ (분수)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.model()
        self.two_ways()
        self.price()
        self.closing(f"(대분수) ÷ (분수)는 대분수를 {o('가분수')}로 바꾼 다음\n{b('통분하여 분자끼리')} 나누거나 {g('분수의 곱셈')}으로 계산해요",
                     next_preview="6학년 39화 · (소수 한 자리) ÷ (소수 한 자리)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("운석 4와 1/2 g을 접시 한 개에 3/4 g씩 담으면\n접시가 몇 개 필요할까요?", 42).move_to([0.6, 1.6, 0])
        self.say("4와 1/2 ÷ 3/4는?", "남극에서 찾은 운석 4와 2분의 1 그램을 페트리 접시 한 개에 4분의 3 그램씩 담으려고 해요. 접시가 몇 개 필요할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def model(self):
        self.section("1/4 g씩 세어 보기")
        bars = VGroup(*[frac_bar(4, 4, width=2.4, height=0.7, color=SOFT) for _ in range(4)], frac_bar(4, 2, width=2.4, height=0.7, color=SOFT)[:2])
        bars.arrange(RIGHT, buff=0.12).move_to([0, 1.6, 0])
        cells = [c for b_ in bars for c in b_]
        self.say(f"4와 1/2 g = {o('1/4 g이 18개')}", "4와 2분의 1 그램을 4분의 1 그램짜리로 나누면 18칸이에요.")
        self.play(FadeIn(bars), run_time=0.6)
        for k in range(6):
            grp = VGroup(*cells[3 * k:3 * k + 3])
            self.play(*[c.animate.set_fill(GC[k], 0.8) for c in grp], run_time=0.25)
        nums = VGroup(*[T(str(k + 1), 28, GC[k]).next_to(VGroup(*cells[3 * k:3 * k + 3]), DOWN, buff=0.12) for k in range(6)])
        self.say(f"3칸씩 묶으면 {g('6접시')}", "4분의 3 그램은 3칸이니 3칸씩 묶으면 6묶음, 접시 6개가 필요해요.")
        self.play(FadeIn(nums), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def two_ways(self):
        self.section("두 가지 방법")
        a = row(mixed(4, 1, 2, 48), "÷", frac(3, 4, 48), "=", frac(9, 2, 48, cn=ORANGE), "÷", frac(3, 4, 48), size=46).move_to([0, 2.0, 0])
        self.say(f"먼저 {o('가분수')}로", "먼저 대분수 4와 2분의 1을 가분수 2분의 9로 바꿔요.")
        self.play(FadeIn(a), run_time=0.6)
        h = row(M(b("통분"), 36), ":", frac(18, 4, 48), "÷", frac(3, 4, 48), "=", "18 ÷ 3", "=", M(g("6"), 50), size=46).move_to([0, 0.5, 0])
        self.say(f"통분해서 18 ÷ 3 = {g('6')}", "하윤이는 통분했어요. 4분의 18 나누기 4분의 3, 분자끼리 18 나누기 3은 6이에요.")
        self.play(FadeIn(h), run_time=0.7)
        j = row(M(g("곱셈"), 36), ":", frac(9, 2, 48), "×", frac(4, 3, 48, cn=BLUE, cd=BLUE), "=", frac(36, 6, 48), "=", M(g("6"), 50), size=46).move_to([0, -1.0, 0])
        self.say(f"곱셈으로 해도 {g('6')}", "재민이는 곱셈으로 바꾸었어요. 2분의 9 곱하기 3분의 4, 6분의 36은 6이에요. 두 방법의 답이 같아요.")
        self.play(FadeIn(j), run_time=0.7)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def price(self):
        self.section("1 kg의 가격 견주기")
        t = M("당근 2/5 kg에 1200원(초록 가게), 5/8 kg에 2000원(싱싱 가게)", 34).move_to([0, 2.1, 0])
        self.say("어느 가게가 더 쌀까요?", "생각을 더해 볼게요. 초록 가게는 당근 5분의 2 킬로그램에 1200원, 싱싱 가게는 8분의 5 킬로그램에 2000원이에요. 1 킬로그램의 가격으로 견주어요.")
        self.play(FadeIn(t), run_time=0.6)
        e1 = row("1200 ÷", frac(2, 5, 46), "= (1200 ÷ 2) × 5 =", M(g("3000원"), 44), size=42).move_to([0, 0.7, 0])
        e2 = row("2000 ÷", frac(5, 8, 46), "= (2000 ÷ 5) × 8 =", M(o("3200원"), 44), size=42).move_to([0, -0.6, 0])
        self.play(FadeIn(e1), run_time=0.6)
        self.play(FadeIn(e2), run_time=0.6)
        r = M(f"{g('초록 가게')}가 더 저렴해요", 40).move_to([0, -1.7, 0])
        self.say(f"{g('초록 가게')}가 더 싸요", "1 킬로그램에 초록 가게는 3000원, 싱싱 가게는 3200원이라 초록 가게가 더 저렴해요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
