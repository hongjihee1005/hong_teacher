"""「과학 원리 돋보기」 6학년 11화 — 속력 (6-1 2단원 물체의 운동 5차시, 화 코드 6-1-2-e)

바탕: grade6/science/sem1/u2-5.html(원본 _build_tb/src/u2-5.html) — 도입(서로 반대 방향으로 달리는 두 자동차), 속력(일정한 시간 동안 이동한 거리,
속력 = 이동 거리 ÷ 걸린 시간, 2시간 동안 120 km → 60 km/h, '육십 킬로미터 매 시', 2 m/s '이 미터 매 초', 단위가 같으면 숫자가 클수록 빠름),
활동 1(태엽 자동차: 135 cm/5초 27.0 · 122 cm/5초 24.4 · 100 cm/4.2초 23.8 · 100 cm/5.8초 17.2 cm/s), 활동 2(교통수단: 자전거 20 km/1시간 20 ·
자동차 145 km/2시간 72.5 · 기차 450 km/3시간 150 · 배 138 km/4시간 34.5 · 비행기 4,500 km/5시간 900 km/h, 배와 자전거 비교),
계기판(60 km/h), 형성 평가(치타 50 m/10초 = 5 m/s, 호랑이 100 m/25초 = 4 m/s), 한눈에 쏙(속력).
u2-7 배움 다지기의 일출봉 문제(50 km, 한 시간 뒤 해돋이, 자전거 20·오토바이 40·자동차 60 km/h → 자동차)를 생활 속에 녹임.
최종: ./make_final.sh s6ep11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Line, DashedLine,
                   SurroundingRectangle, GrowFromEdge, ValueTracker, always_redraw, Rectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S6Ep11(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 11
    EP_TITLE = "속력"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.concept()
        self.cars()
        self.transport()
        self.life()
        self.summary()
        self.closing(f"{o('속력')} = 이동 거리 ÷ 걸린 시간\n단위가 같으면 숫자가 {g('클수록')} 빨라요",
                     next_preview="6학년 12화 · 속력과 안전")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        road = K.R(13.0, 2.4, K.ROAD, 0, 0.3, stroke=None)
        mid = DashedLine([-6.5, 0.3, 0], [6.5, 0.3, 0], stroke_color=PAPER, stroke_width=5, dash_length=0.35)
        c1 = K.car_side(K.CAR_RED, 2.0, 1).move_to([-3.0, 0.95, 0])
        c2 = K.car_side(K.CAR_BLUE, 2.0, -1).move_to([3.0, -0.35, 0])
        ar = VGroup(K.arrow_lr(-1.0, 1.0, 2.1, RED, 7), K.arrow_lr(1.0, -1.0, -1.3, BLUE, 7))
        self.say("반대 방향으로 달리는 두 자동차, 누가 더 빠를까요?",
                 "두 자동차가 서로 반대 방향으로 달려서 같은 출발선에 놓고 비교할 수 없어요. 어떻게 비교할까요?")
        self.play(FadeIn(road), FadeIn(mid), FadeIn(c1), FadeIn(c2), FadeIn(ar), run_time=0.7)
        self.play(c1.animate.shift(RIGHT * 4.5), c2.animate.shift(LEFT * 3.5), run_time=2.0, rate_func=lambda t: t)
        self.settle()
        card = K.text_card([f"두 자동차가 {o('1시간 동안')} 이동한 거리를 구해 비교하면 어떨까요?"], size=34).move_to([0, -2.2, 0])
        self.say(f"{o('같은 시간')} 동안 이동한 거리로 바꾸어 비교해요",
                 "두 자동차가 1시간 동안 이동한 거리를 구하면 같은 기준으로 비교할 수 있어요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 개념: 속력 ──
    def concept(self):
        self.section("속력")
        f = K.text_card([f"{o('속력')} = 이동 거리 ÷ 걸린 시간"], size=50, stroke=self.accent).move_to([0, 2.3, 0])
        sub = T("일정한 시간(1초, 1분, 1시간) 동안 물체가 이동한 거리", 30, SOFT).next_to(f, DOWN, buff=0.2)
        self.say(f"{o('속력')}은 일정한 시간 동안 물체가 이동한 거리예요",
                 "이동 거리와 걸린 시간이 모두 다른 물체의 빠르기는 속력으로 비교해요. 속력은 일정한 시간 동안 물체가 이동한 거리예요.")
        self.play(FadeIn(f), FadeIn(sub), run_time=0.7)
        self.settle()
        x0, k = -5.4, 0.09
        road = K.R(12.0, 0.6, K.ROAD, x0 + 6.0, -0.6, stroke=None)
        ticks = VGroup()
        for km, h in ((0, 0), (60, 1), (120, 2)):
            x = x0 + km * k
            ticks.add(Line([x, -1.0, 0], [x, -0.2, 0], stroke_color=INK, stroke_width=3),
                      T(f"{km} km", 26).move_to([x, -1.25, 0]), T(f"{h}시간", 26, BLUE).move_to([x, 0.2, 0]))
        car = K.car_side(K.CAR_RED, 1.1).move_to([x0, -0.45, 0])
        self.say(f"자동차가 {o('2시간')} 동안 {o('120 km')}를 달렸어요", "자동차가 2시간 동안 120 킬로미터를 달렸어요.")
        self.play(FadeIn(road), FadeIn(ticks), FadeIn(car), run_time=0.6)
        seg = VGroup()
        for i in range(2):
            a, b_ = x0 + 60 * i * k, x0 + 60 * (i + 1) * k
            self.play(car.animate.move_to([b_, -0.45, 0]), run_time=1.3, rate_func=lambda t: t)
            seg.add(VGroup(Line([a, 0.4, 0], [b_, 0.4, 0], stroke_color=RED, stroke_width=5),
                           T("1시간 동안 60 km", 24, RED).move_to([(a + b_) / 2, 0.65, 0])))
            self.play(FadeIn(seg[-1]), run_time=0.3)
        self.settle()
        eq = M(f"120 km ÷ 2 h = {o('60 km/h')}", 48).move_to([0, -1.9, 0])
        self.say(f"120 km ÷ 2 h = {o('60 km/h')}",
                 "속력은 120 킬로미터 나누기 2시간, 60 킬로미터 매 시예요. 1시간 동안 60 킬로미터를 이동한 것과 같은 빠르기예요.")
        self.play(FadeIn(eq, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        rows = VGroup(
            M(f"{o('60 km/h')}  읽기: 육십 킬로미터 매 시", 40),
            M(f"{o('2 m/s')}  읽기: 이 미터 매 초", 40),
            M("→ 1초 동안 2 m를 이동한 것과 같은 빠르기", 34, SOFT),
        ).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to([0, 1.1, 0])
        note = K.text_card([f"속력의 단위가 같을 때, 숫자가 {g('클수록')} 더 빨라요"], size=38, stroke=self.accent).move_to([0, -1.4, 0])
        self.say("속력의 단위: km/h(킬로미터 매 시), m/s(미터 매 초)",
                 "속력의 단위에는 킬로미터 매 시, 미터 매 초 등이 있어요. 2 미터 매 초는 이 미터 매 초라고 읽어요.")
        self.play(FadeIn(rows, lag_ratio=0.2), run_time=1.0)
        self.settle()
        self.say(f"단위가 같으면 숫자가 {g('클수록')} 빨라요", "속력의 단위가 같을 때 속력을 나타내는 숫자가 클수록 더 빨라요.")
        self.play(FadeIn(note, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 활동 1: 태엽 자동차 ──
    def cars(self):
        self.section("활동해요")
        head = ["태엽 자동차", "이동 거리(cm)", "걸린 시간(초)", "속력(cm/s)"]
        data = [("빨간색", "135", "5", "27.0"), ("파란색", "122", "5", "24.4"), ("초록색", "100", "4.2", "23.8"), ("노란색", "100", "5.8", "17.2")]
        tab = K.result_table(head, [[a, b_, c, ""] for a, b_, c, _ in data], [2.8, 3.0, 3.0, 3.0], row_h=0.72, size=32).move_to([0, 0.55, 0])
        note = T("위 두 줄은 '같은 시간' 실험, 아래 두 줄은 '같은 거리' 실험에서 잰 값", 26, SOFT).next_to(tab, DOWN, buff=0.25)
        self.say("앞의 두 실험에서 잰 태엽 자동차의 속력을 구해요",
                 "앞에서 같은 시간 실험과 같은 거리 실험으로 잰 값이에요. 네 태엽 자동차의 속력을 구해 볼까요?")
        self.play(FadeIn(tab), FadeIn(note), run_time=0.8)
        self.settle()
        self.pause_screen(5, "속력을 계산해 보세요")
        vals = VGroup()
        for i, d in enumerate(data):
            x, y = tab.cells[0][3].get_x(), tab.cells[i + 1][0].get_y()
            vals.add(T(d[3], 32, ORANGE).move_to([x, y, 0]))
        self.say(f"빨간색 {o('27.0')}, 파란색 {o('24.4')}, 초록색 {o('23.8')}, 노란색 {o('17.2')} cm/s",
                 "빨간색은 27.0, 파란색은 24.4, 초록색은 23.8, 노란색은 17.2 센티미터 매 초예요. 소수 첫째 자리까지 나타냈어요.")
        self.play(FadeIn(vals, lag_ratio=0.25), run_time=1.2)
        self.settle()
        order = M(f"빠른 순서: {o('빨간색 → 파란색 → 초록색 → 노란색')}", 38).move_to([0, -1.75, 0])
        self.say("속력을 구하면 다른 실험의 자동차도 한꺼번에 비교해요",
                 "빨간색, 파란색, 초록색, 노란색 자동차 순서로 빨라요. 속력을 구하면 서로 다른 실험에서 잰 자동차도 한꺼번에 비교할 수 있어요.")
        self.play(FadeOut(note), FadeIn(order, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 활동 2: 교통수단 ──
    def transport(self):
        head = ["교통수단", "이동 거리", "걸린 시간", "속력(km/h)"]
        data = [("자전거", "20 km", "1시간", 20), ("자동차", "145 km", "2시간", 72.5), ("기차", "450 km", "3시간", 150),
                ("배", "138 km", "4시간", 34.5), ("비행기", "4,500 km", "5시간", 900)]
        tab = K.result_table(head, [[a, b_, c, ""] for a, b_, c, _ in data], [2.6, 2.8, 2.6, 3.0], row_h=0.66, size=32).move_to([0, 0.35, 0])
        self.say("여러 교통수단의 속력도 구해 볼까요?", "이번에는 여러 교통수단의 속력을 구해 빠르기를 비교해요.")
        self.play(FadeIn(tab), run_time=0.7)
        self.settle()
        self.pause_screen(5, "교통수단의 속력을 구해 보세요")
        vals = VGroup()
        for i, d in enumerate(data):
            x, y = tab.cells[0][3].get_x(), tab.cells[i + 1][0].get_y()
            vals.add(T(f"{d[3]:g}", 32, ORANGE).move_to([x, y, 0]))
        self.say(f"자전거 20, 자동차 72.5, 기차 150, 배 34.5, 비행기 {o('900')} km/h",
                 "자전거는 20, 자동차는 72.5, 기차는 150, 배는 34.5, 비행기는 900 킬로미터 매 시예요.")
        self.play(FadeIn(vals, lag_ratio=0.2), run_time=1.2)
        self.settle()
        clear_stage(self)
        items = [("비행기", 900, "#2E86C1"), ("기차", 150, "#16A085"), ("자동차", 72.5, K.CAR_RED),
                 ("배", 34.5, "#8E44AD"), ("자전거", 20, "#E67E22")]
        names, bs, vls = K.bars(items, 900, x0=-3.6, length=8.4, y0=2.3, dy=0.6, h=0.4, size=30, unit="km/h")
        self.say(f"{o('비행기 → 기차 → 자동차 → 배 → 자전거')} 순으로 빨라요",
                 "비행기, 기차, 자동차, 배, 자전거 순서로 빨라요.")
        self.play(FadeIn(names), run_time=0.4)
        self.play(*[GrowFromEdge(b, LEFT) for b in bs], run_time=1.6)
        self.play(FadeIn(vls), run_time=0.4)
        self.settle()
        card = K.text_card([f"배는 4시간, 자전거는 1시간 걸렸으니 자전거가 빠르다? {r('아니요!')}",
                            f"배 {o('34.5 km/h')} ＞ 자전거 {o('20 km/h')} → {g('배가 더 빨라요')}"], size=32).move_to([0, -1.65, 0])
        self.say(f"걸린 시간만 보지 말고 {o('속력')}으로 비교해요",
                 "걸린 시간만 보면 안 돼요. 배의 속력은 34.5, 자전거는 20 킬로미터 매 시이므로 배가 더 빨라요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 ──
    def life(self):
        self.section("생활 속에서")
        gg = K.gauge(60, 120, 1.6).move_to([-3.4, 0.5, 0])
        txt = K.text_card(["자동차 계기판의 속력을 보고", f"빠르기를 조절해 {g('안전하게 운전')}해요"], size=34).move_to([2.9, 0.5, 0])
        self.say("빠르기를 속력으로 나타내면 무엇이 편리할까요?",
                 "자동차의 빠르기를 속력으로 나타내면 어떤 점이 편리할까요?")
        self.play(FadeIn(gg), run_time=0.6)
        self.settle()
        self.say(f"계기판을 보고 빠르기를 조절해 {g('안전하게')} 운전해요",
                 "계기판에 표시되는 속력을 보고 빠르기를 조절해 안전하게 운전할 수 있어요.")
        self.play(FadeIn(txt, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        q1 = K.text_card(["치타: 50 m를 10초에", "호랑이: 100 m를 25초에"], size=38).move_to([-3.5, 0.6, 0])
        a1 = VGroup(M(f"치타  50 m ÷ 10 s = {o('5 m/s')}", 36), M(f"호랑이  100 m ÷ 25 s = {o('4 m/s')}", 36)
                    ).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([3.4, 0.6, 0])
        self.say("치타와 호랑이 중 누가 더 빠를까요?",
                 "치타는 50 미터를 10초에, 호랑이는 100 미터를 25초에 달릴 수 있대요. 누가 더 빠를까요?")
        self.play(FadeIn(q1), run_time=0.6)
        self.settle()
        self.say(f"치타 {o('5 m/s')} ＞ 호랑이 {o('4 m/s')} — 치타가 더 빨라요",
                 "치타의 속력은 5 미터 매 초, 호랑이는 4 미터 매 초이므로 치타가 호랑이보다 더 빨라요.")
        self.play(FadeIn(a1, lag_ratio=0.3), run_time=0.8)
        self.settle()
        q2 = K.text_card(["일출봉까지 50 km, 한 시간 뒤에 해가 떠요.",
                          "자전거 20 km/h · 오토바이 40 km/h · 자동차 60 km/h"], size=34).move_to([0, 0.9, 0])
        self.say("50 km 떨어진 일출봉, 한 시간 안에 가려면?",
                 "여기에서 일출봉까지 50 킬로미터이고 한 시간 뒤에 해가 떠요. 일출을 보려면 어떤 교통수단을 골라야 할까요?")
        self.play(FadeOut(q1), FadeOut(a1), run_time=0.4)
        self.play(FadeIn(q2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        a2 = M(f"한 시간에 60 km를 가는 {g('자동차')}!", 40).next_to(q2, DOWN, buff=0.5)
        self.say(f"한 시간에 60 km를 가는 {g('자동차')}를 타요",
                 "자동차는 한 시간에 60 킬로미터를 갈 수 있어서 50 킬로미터 떨어진 일출봉까지 한 시간 안에 도착해요.")
        self.play(FadeIn(a2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"물체의 {o('속력')}은 이동 거리를", "걸린 시간으로 나누어 구합니다."], w=10.6, size=42).move_to([0, 0.9, 0])
        unit = M(f"단위 {o('km/h')} · {o('m/s')} — 단위가 같을 때 숫자가 클수록 빨라요", 32).move_to([0, -1.2, 0])
        self.say(f"{o('속력')}은 이동 거리를 걸린 시간으로 나누어 구해요")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.play(FadeIn(unit), run_time=0.5)
        self.settle()
        clear_stage(self)
