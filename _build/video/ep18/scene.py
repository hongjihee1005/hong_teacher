"""「수학 원리 돋보기」 18화 — 무게는 어떻게 비교하고 나타낼까? (2학기 5단원 6·7차시, 화 코드 2-5-d)

양팔저울(당근과 양파) → 바둑돌로 세기(지우개 6, 풀 12, 가위 18) → 단위가 다르면 비교 어려움
→ kg, g, t (1 kg = 1000 g, 1 t = 1000 kg) → 단위 바꾸기 → 솜 1 kg과 쇠 1 kg
최종: ./make_final.sh 18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP,
    Circle, Create, Ellipse, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, Transform, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from measure import balance

STONE = "#3A3A40"


def carrot():
    body = Ellipse(width=0.42, height=1.3, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=2.5)
    leaf = Ellipse(width=0.22, height=0.45, fill_color="#5BAA55", fill_opacity=1, stroke_width=0).next_to(body, UP, buff=-0.05)
    return VGroup(body, leaf).rotate(1.2)


def onion():
    return VGroup(Circle(radius=0.38, fill_color="#C9A27A", fill_opacity=1, stroke_color=INK, stroke_width=2.5),
                  Ellipse(width=0.1, height=0.3, fill_color="#8A6A4A", fill_opacity=1, stroke_width=0).shift(UP * 0.42))


def stones(n, cols=6, r=0.15):
    g = VGroup(*[Circle(radius=r, fill_color=STONE, fill_opacity=1, stroke_width=0) for _ in range(n)])
    g.arrange_in_grid(cols=cols, buff=0.05)
    return g


class Ep18(EpisodeScene):
    EP_NO = 18
    EP_TITLE = "무게는 어떻게 비교하고 나타낼까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.scale_cmp()
        self.count_stones()
        self.units()
        self.convert()
        self.cotton()
        self.closing(f"무게의 단위: {b('kg')}, {o('g')}, t\n{b('1 kg')} = {o('1000 g')},  1 t = 1000 kg",
                     next_preview="19화 · 무게의 덧셈과 뺄셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        c, on = carrot().scale(1.4).move_to([-2.0, -0.2, 0]), onion().scale(1.5).move_to([2.0, -0.3, 0])
        self.say("당근과 양파가 있어요", "당근과 양파가 있어요. 손으로 들어 보면 비슷해서 잘 모르겠어요.")
        self.play(FadeIn(c), FadeIn(on), run_time=0.7)
        q = M(f"어느 것이 {b('더 무거울까요')}?", 56).move_to([0, 2.2, 0])
        self.say("어느 것이 더 무거울까요?", "어느 것이 더 무거울까요? 어떻게 비교할 수 있을까요?")
        self.play(Write(q), run_time=0.9)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def scale_cmp(self):
        self.section("양팔저울로 비교하기")
        c0 = np.array([0, 0.9, 0])
        bal = balance(c0, 0.0)
        self.say("양팔저울에 하나씩 올려요", "양팔저울 양쪽에 당근과 양파를 하나씩 올려 볼게요.")
        self.play(FadeIn(bal), run_time=0.6)
        bal2 = balance(c0, 0.22)
        cr = carrot().move_to(bal2.lp + UP * 0.3)
        on = onion().move_to(bal2.rp + UP * 0.35)
        cr0 = carrot().move_to(bal.lp + UP * 0.3)
        on0 = onion().move_to(bal.rp + UP * 0.35)
        self.play(FadeIn(cr0, shift=DOWN * 0.3), FadeIn(on0, shift=DOWN * 0.3), run_time=0.6)
        self.play(Transform(bal, bal2), Transform(cr0, cr), Transform(on0, on), run_time=1.2)
        self.say(f"{o('당근')} 쪽이 내려갔어요 → 당근이 {b('더 무거워요')}", "당근 쪽이 아래로 내려갔어요. 내려간 쪽이 더 무거워요. 당근이 더 무거워요.")
        self.play(Indicate(cr0, color=ORANGE, scale_factor=1.2), run_time=0.8)
        q = M(f"그런데 {g('얼마나')} 더 무거울까요?", 46).move_to([0, -2.2, 0])
        self.say(f"그런데 {g('얼마나')} 더 무거울까요?", "그런데 얼마나 더 무거운지는 알 수 없어요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def count_stones(self):
        self.section("바둑돌로 세기")
        names = [("지우개", 6), ("풀", 12), ("가위", 18)]
        rows = VGroup()
        for i, (nm, n) in enumerate(names):
            y = 1.5 - i * 1.15
            rows.add(VGroup(T(nm, 46).move_to([-4.6, y, 0]), stones(n, 6).move_to([-1.6, y, 0]).align_to([-2.8, 0, 0], LEFT),
                            M(f"바둑돌 {b(str(n))}개", 46).move_to([3.4, y, 0])))
        self.say("같은 물건, 바둑돌의 수로 세어요", "이번에는 바둑돌을 단위로 무게를 세어 볼게요. 바둑돌 몇 개와 무게가 같은지 재었어요.")
        for r in rows:
            self.play(FadeIn(r[0]), LaggedStart(*[FadeIn(s) for s in r[1]], lag_ratio=0.03), FadeIn(r[2]), run_time=0.9)
        self.say(f"가위는 풀보다 바둑돌 {b('6개')}만큼 더 무거워요", "가위는 18개, 풀은 12개. 가위가 풀보다 바둑돌 6개만큼 더 무거워요.")
        self.play(Indicate(rows[2][1][12:], color=BLUE, scale_factor=1.3), run_time=0.9)
        self.wait(0.6)
        msg = M(f"사람마다 단위가 다르면 비교가 어려워요 → {g('약속한 단위')}", 42).move_to([0, -2.2, 0])
        self.say(f"단위가 다르면 비교가 어려워 {g('약속한 단위')}가 필요해요",
                 "그런데 누구는 바둑돌로, 누구는 클립으로 재면 비교하기 어려워요. 그래서 약속한 단위가 필요해요.")
        self.play(FadeIn(msg), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def units(self):
        self.section("무게의 단위 kg, g, t")
        l1 = M(f"{b('1 kg')}  읽기: 1 {b('킬로그램')}", 56).move_to([0, 2.0, 0])
        l2 = M(f"{o('1 g')}  읽기: 1 {o('그램')}", 56).move_to([0, 1.0, 0])
        eq = M(f"{b('1 kg')} = {o('1000 g')}", 84).move_to([0, -0.3, 0])
        self.say(f"무게의 단위 {b('킬로그램(kg)')}과 {o('그램(g)')}", "무게의 단위에는 킬로그램과 그램이 있어요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.5)
        self.say(f"{b('1 kg')}은 {o('1000 g')}과 같아요", "1킬로그램은 1000그램과 같아요.")
        self.play(Write(eq), run_time=0.8)
        bx = SurroundingRectangle(eq, color=GREEN, buff=0.2, stroke_width=6, corner_radius=0.15)
        self.play(Create(bx), run_time=0.4)
        t1 = M(f"아주 무거운 것: {g('1 t')} (1 톤) = 1000 kg", 46).move_to([0, -1.75, 0])
        self.say(f"트럭 짐처럼 아주 무거우면 {g('톤(t)')}", "트럭에 실은 짐처럼 아주 무거운 것은 톤을 써요. 1톤은 1000킬로그램이에요.")
        self.play(FadeIn(t1), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def convert(self):
        self.section("단위 바꾸기")
        rows = [
            (f"{b('2 kg')} {o('400 g')} = {b('2000 g')} + {o('400 g')} = {g('2400 g')}", "2킬로그램 400그램은 2000그램과 400그램, 2400그램이에요."),
            (f"{g('1800 g')} = {b('1000 g')} + {o('800 g')} = {b('1 kg')} {o('800 g')}", "1800그램은 1000그램과 800그램, 곧 1킬로그램 800그램이에요."),
            (f"{b('2 kg')} {o('300 g')}  ○  {g('2500 g')}  →  2300 g &lt; 2500 g", "2킬로그램 300그램과 2500그램을 비교하려면 같은 단위로 바꿔요. 2300그램이 2500그램보다 가벼워요."),
        ]
        for i, (mk, nar) in enumerate(rows):
            m = M(mk, 48)
            m.scale_to_fit_width(min(m.width, 12.4)).move_to([0, 1.6 - i * 1.3, 0])
            self.say(mk.split("  →")[0].replace("○", "와"), nar)
            self.play(FadeIn(m, shift=RIGHT * 0.2), run_time=0.7)
            self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def cotton(self):
        self.section("솜 1 kg과 쇠 1 kg")
        cotton = VGroup(*[Circle(radius=0.55, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=3).shift(
            np.array([0.6 * np.cos(a), 0.45 * np.sin(a), 0])) for a in np.linspace(0, 6.28, 7)]).scale(1.1).move_to([-3.2, 1.0, 0])
        iron = VGroup(Circle(radius=0.32, fill_color="#7A7F88", fill_opacity=1, stroke_color=INK, stroke_width=3)).move_to([3.2, 1.0, 0])
        l1 = M("솜 1 kg", 46).next_to(cotton, DOWN, buff=0.35)
        l2 = M("쇠 1 kg", 46).next_to(iron, DOWN, buff=0.35).align_to(l1, DOWN)
        self.say("솜 1 kg과 쇠 1 kg, 어느 것이 더 무거울까요?", "솜 1킬로그램과 쇠 1킬로그램, 어느 것이 더 무거울까요?")
        self.play(FadeIn(cotton), FadeIn(iron), FadeIn(l1), FadeIn(l2), run_time=0.8)
        self.wait(2.0)
        a = M(f"무게는 {g('똑같아요')}! 크기(차지하는 자리)만 달라요", 44).move_to([0, -2.3, 0])
        self.say(f"둘 다 1 kg, 무게는 {g('같아요')}", "둘 다 1킬로그램이라 무게는 똑같아요. 솜이 자리를 더 많이 차지할 뿐이에요. 크다고 꼭 무거운 것은 아니에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
