"""「과학 원리 돋보기」 6학년 12화 — 속력과 안전 (6-1 2단원 물체의 운동 6차시, 화 코드 6-1-2-f)

바탕: grade6/science/sem1/u2-6.html(원본 _build_tb/src/u2-6.html) — 도입(어린이 보호 구역의 지그재그 차선: 도로가 좁다고 느껴 속력을 줄이게 함),
위험 상황(30 km/h·60 km/h로 달리다 빨간불: 앱 그림의 멈추는 거리는 빠르기의 제곱에 비례하게 그린 것 — 30은 정지선 앞, 60은 정지선을 넘어 멈춤,
빗길은 더 멀리), 상황별 안전 수칙 6가지, 안전장치(자동차: 안전띠·에어백·차간 거리 유지 장치 / 도로: 과속 경보 시스템·과속 방지턱·안전 울타리),
형성 평가(안전 울타리 설명 고르기, 자동계단), 비나 눈이 오는 날, 한눈에 쏙(안전장치).
u2-7(교통안전 실천 점검표: 수칙 3~5개를 정해 일주일 동안 점검해 습관으로)을 마지막에 녹임.
최종: ./make_final.sh s6ep12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Line, Transform,
                   SurroundingRectangle, Rectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def px(x):
    """앱 그림(가로 720) x → 화면"""
    return (x - 360) / 55.0


class S6Ep12(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 12
    EP_TITLE = "속력과 안전"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.danger()
        self.rules()
        self.devices()
        self.misc()
        self.habit()
        self.summary()
        self.closing(f"속력이 빠를수록 {r('위험')}이 커져요\n{o('안전장치')}를 설치하고 {g('안전 수칙')}을 지켜요",
                     next_preview="6학년 13화 · 세포가 궁금해!")
        self.wait(0.5)

    # ── 궁금해요: 지그재그 차선 ──
    def intro(self):
        self.section("궁금해요")
        road = K.zigzag_road(11.0, 2.6).move_to([-0.6, 0.4, 0])
        zone = K.label("어린이 보호 구역", PAPER, 30, fill="#C0392B").move_to([-1.2, 2.25, 0])
        sign = K.speed_sign(30, 0.55).move_to([5.9, 0.9, 0])
        car = K.car_side("#2E86C1", 1.6).move_to([-5.0, 0.95, 0])
        self.say("지그재그로 그려진 차선은 무슨 뜻일까요?",
                 "어린이 보호 구역의 도로에 차선이 지그재그로 그려져 있어요. 무슨 뜻일까요?")
        self.play(FadeIn(road), FadeIn(zone), FadeIn(sign), FadeIn(car), run_time=0.8)
        self.play(car.animate.shift(RIGHT * 4.0), run_time=2.0, rate_func=lambda t: 1 - (1 - t) ** 2)
        self.settle()
        card = K.text_card([f"도로가 {o('좁아 보여서')} 운전자가 {g('속력을 줄이게')} 해요"], size=36).move_to([0, -1.85, 0])
        self.say(f"도로가 좁아 보여 운전자가 {g('속력을 줄이게')} 해요",
                 "같은 너비의 도로도 차선을 지그재그로 그리면 좁아 보여서 운전자가 속력을 줄이게 돼요. 속력과 안전은 어떤 관계가 있을까요?")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 조사해요: 위험 상황 ──
    def drive(self, v, rain, road_y=0.0, ghost=None):
        """앱 drive(): 신호 지점(420)까지 일정하게, 빨간불 뒤 멈출 때까지 거리 v²/30(빗길 v²/14) px"""
        sig, start = 420, 80
        stopD = v * v / (14 if rain else 30)
        w = 1.4
        car = K.car_side(K.CAR_RED, w).move_to([px(start) - w / 2, road_y + 0.15, 0])
        self.add(car)
        vs = v * 3.2 / 55.0          # 화면 속 빠르기(단위/초)
        d1 = px(sig) - px(start)
        self.play(car.animate.shift(RIGHT * d1), run_time=d1 / vs, rate_func=lambda t: t)
        self.light_red()
        d2 = stopD / 55.0
        self.play(car.animate.shift(RIGHT * d2), run_time=max(0.4, 2 * d2 / vs), rate_func=lambda t: t * (2 - t))
        return car

    def light_red(self):
        new = K.traffic_light(True, 1.2).move_to(self.tl)
        self.play(Transform(self.tl, new), run_time=0.2)

    def light_green(self):
        new = K.traffic_light(False, 1.2).move_to(self.tl)
        self.play(Transform(self.tl, new), run_time=0.2)

    def danger(self):
        self.section("조사해요")
        SLx = px(520)
        road = K.stop_line_road(-6.6, 6.6, 0.0, SLx, 1.8)
        self.tl = K.traffic_light(False, 1.2).move_to([px(633), 1.85, 0])
        lab = K.label("30 km/h", INK, 30).move_to([-4.6, 1.75, 0])
        self.say("빠르기가 다른 자동차 앞에서 신호가 빨간불로 바뀌면?",
                 "자동차가 달리다가 정지선 앞에서 신호가 빨간불로 바뀌어요. 먼저 시속 30 킬로미터로 달려 볼게요.")
        self.play(FadeIn(road), FadeIn(self.tl), FadeIn(lab), run_time=0.7)
        c30 = self.drive(30, False)
        ok = K.label("정지선 앞에서 멈췄어요", GREEN, 28).move_to([-0.8, -1.55, 0])
        self.play(FadeIn(ok), run_time=0.3)
        self.settle()
        self.pause_screen(4, "60 km/h로 달리면 어떻게 될까요?")
        self.play(FadeOut(ok), c30.animate.set_opacity(0.3), run_time=0.4)
        self.light_green()
        lab2 = K.label("60 km/h", RED, 30).move_to([-4.6, 1.75, 0])
        self.say(f"이번에는 {r('60 km/h')}로 달려요", "이번에는 시속 60 킬로미터로 달려요.")
        self.play(Transform(lab, lab2), run_time=0.3)
        c60 = self.drive(60, False)
        bad = K.label("정지선을 넘어서야 멈췄어요", RED, 28).move_to([-0.8, -1.55, 0])
        self.play(FadeIn(bad), run_time=0.3)
        self.settle()
        self.say(f"속력이 빠르면 {r('바로 멈추기 어려워요')}",
                 "60 킬로미터로 달린 자동차는 바로 멈추지 못하고 정지선을 넘어서 멈췄어요. 속력이 빠른 물체는 바로 멈추기 어려워요.")
        self.play(Indicate(c60, color=RED), run_time=0.8)
        self.settle()
        clear_stage(self)
        # 빗길
        road = K.stop_line_road(-6.6, 6.6, 0.0, SLx, 1.8, rain=True)
        self.tl = K.traffic_light(False, 1.2).move_to([px(633), 1.85, 0])
        lab = K.label("빗길 · 30 km/h", INK, 30).move_to([-4.3, 1.75, 0])
        dry = K.car_side(K.CAR_RED, 1.4).move_to([px(420 + 30) - 0.7, 0.15, 0]).set_opacity(0.3)
        dryt = K.label("마른 길에서 멈춘 곳", SOFT, 22).move_to([0.6, 1.3, 0])
        self.say("길이 미끄러우면 어떨까요?", "비가 와서 길이 미끄러우면 어떨까요? 같은 시속 30 킬로미터로 달려 봐요.")
        self.play(FadeIn(road), FadeIn(self.tl), FadeIn(lab), FadeIn(dry), FadeIn(dryt), run_time=0.7)
        self.drive(30, True)
        self.settle()
        card = K.text_card([f"속력이 {r('빠를수록')}, 길이 {r('미끄러울수록')}",
                            "멈출 때까지 움직이는 거리가 길어져요"], size=32).move_to([0, -1.85, 0])
        note = T("그림의 멈추는 거리는 알아보기 쉽게 나타낸 것", 22, SOFT).move_to([0, -2.75, 0])
        self.say(f"빠를수록, 미끄러울수록 {r('멈추는 거리가 길어요')}",
                 "속력이 빠를수록, 길이 미끄러울수록 멈출 때까지 움직이는 거리가 길어져요. 그림의 멈추는 거리는 알아보기 쉽게 나타낸 것이에요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        c1 = K.text_card([f"자동차의 속력이 빠르면 갑자기 속력을 줄일 수 없어 {r('더 큰 사고')}가 날 수 있어요"], w=13.0, size=30).move_to([0, 0.9, 0])
        c2 = K.text_card([f"계단에서 뛰어다니면 다른 사람과 부딪히거나 {r('넘어져 다칠 수')} 있어요"], w=13.0, size=30).move_to([0, -0.4, 0])
        self.say("속력이 빠를 때 생길 수 있는 위험 상황",
                 "자동차가 빠르면 갑자기 속력을 줄일 수 없어 더 큰 사고가 나고, 계단에서 뛰면 부딪히거나 넘어져 다칠 수 있어요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.5)
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 조사해요: 안전 수칙 ──
    def rules(self):
        rows = [["계단을 오르내릴 때", "뛰지 않고 걸어서 오르내려요"],
                ["자동차를 운전할 때", "어린이 보호 구역에서는 정해진 속력보다 천천히"],
                ["자동계단을 이용할 때", "손잡이를 잡고 서서 이용해요"],
                ["자전거를 탈 때", "보호 장비를 착용하고 적당한 속력으로"],
                ["횡단보도에서 기다릴 때", "한 발짝 뒤에 서서 기다려요"],
                ["골목에서 나올 때", "잠깐 멈추고 좌우를 살펴요"]]
        tab = K.result_table(["상황", "속력과 관련된 안전 수칙"], rows, [4.2, 8.4], row_h=0.66, size=28).move_to([0, 0.4, 0])
        self.say("상황마다 지켜야 할 안전 수칙을 조사해요",
                 "상황마다 지켜야 할 속력과 관련된 안전 수칙을 조사해 정리해요.")
        self.play(FadeIn(tab), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 조사해요: 안전장치 ──
    def devices(self):
        b1 = K.bin_box("자동차", 6.4, 4.9, ORANGE).move_to([-3.3, 0.25, 0])
        b2 = K.bin_box("도로", 6.4, 4.9, BLUE).move_to([3.3, 0.25, 0])
        cars = [(K.seatbelt(), "안전띠"), (K.airbag(), "에어백"), (K.gap_keep(), "차간 거리 유지 장치")]
        roads = [(K.speed_board(), "과속 경보 시스템"), (K.speed_bump(), "과속 방지턱"), (K.guard_rail(), "안전 울타리")]
        def cards(lst, cx):
            g_ = VGroup(*[K.pic_card(p, n, 2.0, 1.95, size=21) for p, n in lst]).arrange(RIGHT, buff=0.1)
            return g_.move_to([cx, 0.65, 0])
        c1, c2 = cards(cars, -3.3), cards(roads, 3.3)
        f1 = M(f"충돌하거나 갑자기 멈출 때 탑승자를 {g('보호')}해요", 26).move_to([-3.3, -1.0, 0])
        f2 = M(f"운전자가 {g('속력을 줄이게')} 하거나 충격을 막아요", 26).move_to([3.3, -1.0, 0])
        for f_ in (f1, f2):
            if f_.width > 6.0:
                f_.scale_to_fit_width(6.0)
        self.say(f"자동차에 설치된 {o('안전장치')}",
                 "자동차에 설치된 안전장치예요. 안전띠는 충돌하거나 갑자기 멈출 때 탑승자를 좌석에 고정하고, 에어백은 공기주머니를 부풀려 충격을 줄여요. 차간 거리 유지 장치는 앞차와 안전거리를 유지하게 해요.")
        self.play(FadeIn(b1), FadeIn(b2), run_time=0.5)
        self.play(FadeIn(c1, lag_ratio=0.2), FadeIn(f1), run_time=1.0)
        self.settle()
        self.say(f"도로에 설치된 {o('안전장치')}",
                 "도로에도 안전장치가 있어요. 과속 경보 시스템은 속력을 재어 알려 주고, 과속 방지턱은 운전자가 속력을 줄이게 해요. 안전 울타리는 충격을 흡수하고 보행자를 보호해요.")
        self.play(FadeIn(c2, lag_ratio=0.2), FadeIn(f2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        q = K.text_card(["안전 울타리는 자동차의 속력을", "실시간으로 재어 알려 준다?"], size=40).move_to([0, 1.4, 0])
        self.say("안전 울타리는 자동차의 속력을 재어 알려 줄까요?",
                 "안전 울타리는 자동차의 속력을 실시간으로 재어 알려 줄까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.settle()
        xm = K.ox_mark(False, 0.45).next_to(q, RIGHT, buff=0.3)
        a = K.text_card([f"속력을 재어 알려 주는 것은 {o('과속 경보 시스템')}",
                         f"안전 울타리는 {g('충격을 흡수하고 보행자를 보호')}해요"], size=34).move_to([0, -1.0, 0])
        self.say(f"아니요, 그것은 {o('과속 경보 시스템')}이에요",
                 "아니요. 속력을 실시간으로 재어 알려 주는 것은 과속 경보 시스템이에요. 안전 울타리는 충격을 흡수하고 보행자를 보호해요.")
        self.play(Create(xm), FadeIn(a, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
        c1 = K.text_card(["비나 눈이 내리는 날에는?",
                          f"· 자동차가 {g('완전히 멈춘 것')}을 확인하고 횡단보도를 건너요",
                          f"· 운전자는 {g('더 느린 속력')}으로 운전해요",
                          f"· 비를 맞지 않게 횡단보도를 {r('뛰어서 건너면 안 돼요')}"], w=12.4, size=32).move_to([0, 1.2, 0])
        c2 = K.text_card([f"자동계단: 뛰거나 걷지 않고 {g('손잡이를 잡고 서서')} 이용해요"], w=12.4, size=32).move_to([0, -1.55, 0])
        self.say("비나 눈이 오면 길이 미끄러워 멈추기 더 어려워요",
                 "비나 눈이 오면 길이 미끄러워 멈추기 더 어려워요. 자동차가 완전히 멈춘 것을 확인하고 건너고, 운전자는 더 느린 속력으로 운전해요.")
        self.play(FadeIn(c1), run_time=0.7)
        self.settle()
        self.say(f"자동계단에서는 {g('손잡이를 잡고 서서')} 타요",
                 "자동계단을 이용할 때는 뛰거나 걷지 않고 손잡이를 잡고 서서 이용해요.")
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 실천해요: 점검표 (u2-7) ──
    def habit(self):
        self.section("실천해요")
        rules = ["자동차를 타면 안전띠를 매요.", "골목에서 나올 때 잠깐 멈추고 좌우를 살펴요.", "계단을 오르내릴 때 뛰지 않고 걸어요."]
        days = ["월", "화", "수", "목", "금", "토", "일"]
        tab = K.result_table(["교통안전 수칙"] + days, [[r_] + [""] * 7 for r_ in rules], [7.0] + [0.72] * 7,
                             row_h=0.8, size=26).move_to([0, 0.4, 0])
        title = T("우리 모둠 교통안전 실천 점검표", 34).next_to(tab, UP, buff=0.25)
        self.say("교통안전 수칙을 습관으로 만들어요",
                 "실천할 수 있는 교통안전 수칙을 3개에서 5개 정해 실천 점검표를 만들어요.")
        self.play(FadeIn(title), FadeIn(tab), run_time=0.8)
        self.settle()
        marks = VGroup()
        pat = [[1, 1, 1, 1, 1, 0, 0], [1, 0, 1, 1, 0, 0, 0], [1, 1, 1, 0, 1, 0, 0]]
        for i in range(3):
            for j in range(7):
                if pat[i][j]:
                    x, y = tab.cells[0][j + 1].get_x(), tab.cells[i + 1][0].get_y()
                    marks.add(T("○", 30, GREEN).move_to([x, y, 0]))
        self.say(f"일주일 동안 실천한 날에 표시하며 {g('꾸준히')} 지켜요",
                 "일주일 동안 실천한 날에 표시하며 꾸준히 지켜 습관이 되게 해요.")
        self.play(FadeIn(marks, lag_ratio=0.08), run_time=1.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        pics = VGroup(K.pic_card(K.seatbelt(), "안전띠", 2.4, 2.1, size=24), K.pic_card(K.speed_bump(), "과속 방지턱", 2.4, 2.1, size=24),
                      K.pic_card(K.guard_rail(), "안전 울타리", 2.4, 2.1, size=24)).arrange(RIGHT, buff=0.4).move_to([0, 1.5, 0])
        card = K.text_card([f"속력이 빠를수록 안전사고의 위험이 커지므로", f"자동차나 도로에는 {o('안전장치')}를 설치합니다."],
                           w=12.0, size=38).move_to([0, -1.05, 0])
        self.say(f"자동차나 도로에 {o('안전장치')}를 설치해요",
                 "속력이 빠를수록 안전사고의 위험이 커지므로 자동차나 도로에 안전장치를 설치하고, 우리는 안전 수칙을 잘 지켜요.")
        self.play(FadeIn(pics, lag_ratio=0.2), run_time=0.8)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
