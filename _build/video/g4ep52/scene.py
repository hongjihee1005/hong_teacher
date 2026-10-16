"""「수학 원리 돋보기」 4학년 52화 — 꺾은선그래프로 앞으로를 예상하기 (4-2 5단원 7차시, 화 코드 4-2-5-c)

강낭콩 키(cm) 1~5주: 2, 5, 8, 11, 14 (한 주에 3 cm씩) → 6주는 약 17 cm로 예상(점선), 실제는 16 cm — 예상이 늘 맞지는 않음
두 그래프 함께 보기: 가 4, 6, 8, 10, 12 / 나 1, 4, 7, 10, 13 → 4주에 같아지고 5주부터 나가 더 큼
최종: GRADE=4 ./make_final.sh 52
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from chart import Chart

RED = "#C0392B"
WEEKS = ["1주", "2주", "3주", "4주", "5주", "6주"]
BEAN = [2, 5, 8, 11, 14]
A = [4, 6, 8, 10, 12]
B = [1, 4, 7, 10, 13]


class G4Ep52(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 52
    EP_TITLE = "꺾은선그래프로 앞으로를 예상하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.predict()
        self.two()
        self.closing(f"꺾은선의 {o('흐름')}을 보면 앞으로를 어림할 수 있어요\n하지만 예상은 {g('늘 맞지는 않아요')}",
                     next_preview="4학년 53화 · 다각형은 어떤 도형일까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("6주째 강낭콩의 키는 얼마쯤일까요?", 48).move_to([0.6, 2.2, 0])
        h = VGroup(T("주", 32, SOFT), *[T(s, 32) for s in WEEKS[:5]], T("6주", 32, RED)).arrange(RIGHT, buff=0.55)
        v = VGroup(T("키(cm)", 32, SOFT), *[T(str(x), 32, ORANGE) for x in BEAN], T("?", 36, RED))
        for i, t in enumerate(v):
            t.move_to([h[i].get_x(), -0.6, 0])
        tb = VGroup(h, v).move_to([0, 0.3, 0])
        self.say("6주째 키를 예상해 봐요", "강낭콩의 키를 5주 동안 재었어요. 아직 재지 않은 6주째 키는 얼마쯤일까요?")
        self.play(Write(q), FadeIn(tb), run_time=1.2)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def predict(self):
        self.section("흐름으로 예상하기")
        ch = Chart(WEEKS, vmax=18, step=1, origin=[-5.6, -1.8, 0], w=6.3, h=3.7, label_size=28, tick_every=2, ylab="(cm)")
        dots, lines = ch.dots(BEAN), ch.lines(BEAN)
        self.say("1주부터 5주까지 꺾은선그래프", "1주부터 5주까지 강낭콩의 키를 꺾은선그래프로 나타냈어요.")
        self.play(FadeIn(ch.axes_group), run_time=0.5)
        self.play(LaggedStart(*[Create(l) for l in lines], lag_ratio=0.6, run_time=1.4), FadeIn(dots))
        steps = VGroup(*[T("+3", 26, BLUE).move_to([(ch.x(i) + ch.x(i + 1)) / 2 - 0.15, (ch.y(BEAN[i]) + ch.y(BEAN[i + 1])) / 2 + 0.35, 0]) for i in range(4)])
        self.say(f"한 주에 {b('3 cm')}씩 자랐어요", "선분의 기울기가 모두 같아요. 한 주에 3센티미터씩 자랐어요.")
        self.play(LaggedStart(*[FadeIn(s) for s in steps], lag_ratio=0.3, run_time=1.0))
        pd = DashedLine([ch.x(4), ch.y(14), 0], [ch.x(5), ch.y(17), 0], color=RED, stroke_width=5)
        pp = Dot([ch.x(5), ch.y(17), 0], radius=0.1, color=RED)
        n1 = M(f"6주: 약 {o('17 cm')}로 예상", 36).move_to([4.0, 1.2, 0])
        self.say(f"흐름대로라면 6주에는 약 {o('17 cm')}", "이 흐름대로 선을 점선으로 이어 보면, 6주째에는 약 17센티미터가 될 거라고 예상할 수 있어요.")
        self.play(Create(pd), FadeIn(pp), FadeIn(n1), run_time=0.9)
        real = Dot([ch.x(5), ch.y(16), 0], radius=0.11, color=GREEN)
        rl = Line([ch.x(4), ch.y(14), 0], [ch.x(5), ch.y(16), 0], color=GREEN, stroke_width=6)
        n2 = M(f"실제로 재어 보니 {g('16 cm')}", 36).move_to([4.0, 0.1, 0])
        self.say(f"실제로는 {g('16 cm')}였어요", "그런데 6주째에 실제로 재어 보니 16센티미터였어요. 키가 자라는 빠르기가 조금 느려졌어요.")
        self.play(Create(rl), FadeIn(real), FadeIn(n2), run_time=0.8)
        n3 = M(f"예상은 {o('어림')}이에요\n늘 맞지는 않아요", 36).move_to([4.0, -1.3, 0])
        self.say(f"예상은 어림, {o('늘 맞지는 않아요')}", "꺾은선그래프의 흐름으로 앞으로를 예상할 수 있지만, 예상은 어림이라 늘 맞지는 않아요.")
        self.play(FadeIn(n3), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def two(self):
        self.section("두 그래프를 함께 보기")
        ch = Chart(WEEKS[:5], vmax=14, step=1, origin=[-5.4, -1.8, 0], w=6.6, h=3.7, label_size=28, tick_every=2, ylab="(cm)")
        la, lb = ch.lines(A, color=BLUE), ch.lines(B, color=ORANGE)
        da, db = ch.dots(A, color=BLUE), ch.dots(B, color=ORANGE)
        ka = T("가", 32, BLUE).next_to(da[-1], RIGHT, buff=0.15).shift(DOWN * 0.2)
        kb = T("나", 32, ORANGE).next_to(db[-1], RIGHT, buff=0.15).shift(UP * 0.2)
        self.say("두 식물의 키를 한 그래프에", "가 식물과 나 식물의 키를 한 그래프에 함께 나타냈어요.")
        self.play(FadeIn(ch.axes_group), run_time=0.5)
        self.play(Create(la), Create(lb), FadeIn(da), FadeIn(db), FadeIn(ka), FadeIn(kb), run_time=1.4)
        self.say(f"나는 처음엔 작지만 {o('더 빨리')} 자라요", "나 식물은 처음에는 작지만 선이 더 많이 기울어 있어요. 가보다 더 빨리 자라요.")
        self.play(Indicate(lb, color=ORANGE), run_time=0.8)
        cross = Dot([ch.x(3), ch.y(10), 0], radius=0.16, color=RED)
        n1 = M(f"4주: 둘 다 {g('10 cm')}", 40).move_to([4.2, 1.0, 0])
        n2 = M(f"5주부터 {o('나')}가 더 커요", 40).move_to([4.2, -0.2, 0])
        self.say(f"두 선이 만나는 4주에 키가 같아요", "두 선이 만나는 4주에 둘 다 10센티미터로 키가 같아요.")
        self.play(FadeIn(cross, scale=2), FadeIn(n1), run_time=0.7)
        self.say(f"그 뒤로는 {o('나')}가 더 커요", "그 뒤 5주부터는 나 식물이 가 식물보다 더 커요. 두 그래프를 함께 보면 이렇게 견주기 쉬워요.")
        self.play(FadeIn(n2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
