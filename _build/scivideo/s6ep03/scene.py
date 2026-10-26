"""「과학 원리 돋보기」 6학년 3화 — 산성 용액과 염기성 용액의 성질 (6-1 1단원 산과 염기 4차시, 화 코드 6-1-1-c)

바탕: grade6/science/sem1/u1-3.html(원본 _build_tb/src/u1-3.html) — 도입(달걀을 식초에 넣으면? 레몬즙 신맛·제빵 소다 용액 미끈 —
과학실 용액은 맛보거나 만지지 않음), 실험(홈판 두 줄: 묽은 염산 / 묽은 수산화 나트륨 용액에 달걀 껍데기·조개껍데기·삶은 달걀흰자·
삶은 닭 가슴살, 줄마다 다른 핀셋, 조금 더 진한 용액이라 더 조심·환기), 시간에 따른 변화(넣은 직후·하루·사흘·일주일 — 앱 영상 설명 그대로),
결과 기록, 정리(탄산 칼슘·단백질), 더 알아봐요(대리암 조각·두부), 한눈에 쏙, 형성 평가(메추리알 예시 답).
최종: ./make_final.sh s6ep03
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, Transform,
                   RoundedRectangle, Rectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from scikit import RED, clear_stage
import kit_s6u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


MATN = ["달걀 껍데기", "조개껍데기", "삶은 달걀흰자", "삶은 닭 가슴살"]
MATF = [K.eggshell, K.clamshell, K.egg_white, K.chicken]


class S6Ep03(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 3
    EP_TITLE = "산성 용액과 염기성 용액의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.result()
        self.more()
        self.summary()
        self.closing(f"{r('산성 용액')}은 탄산 칼슘을, {b('염기성 용액')}은 단백질을 녹여요",
                     next_preview="6학년 4화 · 둘을 섞으면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        G = K.Glass(-3.2, -1.9, 2.6, 2.9, "beaker")
        liq = G.liquid(2.1, "#F2C94C", 0.5)
        egg = K.Ellipse(width=1.0, height=1.3, fill_color="#F5EBD7", fill_opacity=1, stroke_color="#B9A48A",
                        stroke_width=4).move_to([-3.2, -1.2, 0])
        nm = T("식초", 32).next_to(G.top(), UP, buff=0.25)
        self.say("달걀을 식초에 넣으면 어떻게 될까요?",
                 "식초에 달걀을 일주일쯤 담가 두면 어떻게 될까요?")
        self.play(FadeIn(VGroup(liq, G.glass(), nm)), FadeIn(egg, shift=DOWN * 0.5), run_time=0.9)
        note = K.text_card([f"레몬즙은 신맛, 제빵 소다 용액은 미끈미끈", f"{r('과학실의 용액은 맛보거나 맨손으로 만지지 않아요')}"],
                           w=7.0, size=28).move_to([3.0, 0.4, 0])
        self.say("산성 용액과 염기성 용액은 서로 다른 성질이 있어요",
                 "레몬즙은 신맛이 나고 제빵 소다 용액은 미끈미끈한 것처럼, 산성 용액과 염기성 용액은 서로 다른 성질이 있어요. 과학실의 용액은 맛보거나 맨손으로 만지지 않아요.")
        self.play(FadeIn(note), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 실험해요 ──
    def experiment(self):
        self.section("실험해요")
        P_ = K.SpotPlate(4, 2, gap=2.45, r=0.72, center=(1.0, 0.35), names=MATN, size=26, row_gap=1.75,
                         row_names=["묽은 염산", "묽은 수산화\n나트륨 용액"])
        self.P = P_
        self.say("묽은 염산과 묽은 수산화 나트륨 용액에 네 가지 물질을 넣어요",
                 "홈판 첫째 줄에는 묽은 염산, 둘째 줄에는 묽은 수산화 나트륨 용액을 넣고, 네 가지 물질을 넣어요.")
        self.play(FadeIn(P_.group), FadeIn(P_.names), FadeIn(P_.rnames), run_time=0.7)
        self.play(*[P_.liq[i].animate.set_fill(K.CLEAR, opacity=0.9) for i in range(8)], run_time=0.5)
        self.say("이번 실험은 용액이 조금 더 진해서 더 조심해요",
                 "이번 실험은 조금 더 진한 용액을 써서 더 조심해요. 환기가 잘 되는 곳에서, 줄마다 다른 핀셋으로 살살 넣어요.")
        mats = VGroup()
        for j in range(2):
            for i in range(4):
                mats.add(MATF[i](1.25).move_to(P_.center(i, j)))
        self.play(LaggedStart(*[FadeIn(m, shift=DOWN * 0.4) for m in mats], lag_ratio=0.08), run_time=1.4)
        self.mats = mats
        self.settle()
        bub = VGroup(*[K.bubbles(P_.center(i, 0)[0] - 0.4, P_.center(i, 0)[0] + 0.4, P_.center(i, 0)[1] - 0.3,
                                 P_.center(i, 0)[1] + 0.5, n=9, seed=i + 2, rmin=0.04, rmax=0.08) for i in (0, 1)])
        self.say(f"넣은 직후: 묽은 염산 속 껍데기에서 {o('기포')}가 발생해요",
                 "넣자마자 묽은 염산에 넣은 달걀 껍데기와 조개껍데기에서 기포가 발생해요. 다른 것은 변화가 없어요.")
        self.play(FadeIn(bub, lag_ratio=0.1), run_time=0.8)
        self.settle()
        self.pause_screen(5, "시간이 지나면 어떻게 될까요?")
        day = K.label("하루 뒤", self.accent, 32).move_to([1.0, 2.55, 0])
        self.say("하루 뒤: 껍데기들이 기포를 내며 점점 작아져요",
                 "하루 뒤, 달걀 껍데기와 조개껍데기가 기포를 내며 점점 작아져요.")
        self.play(FadeIn(day), mats[0].animate.scale(0.7), mats[1].animate.scale(0.7), run_time=1.2)
        self.settle()
        day2 = K.label("사흘 뒤", self.accent, 32).move_to(day)
        cl = VGroup(*[K.cloudy_dots(P_.center(i, 1), 0.66, 30, seed=i + 5) for i in (2, 3)])
        self.say(f"사흘 뒤: 묽은 수산화 나트륨 용액 속 흰자·닭 가슴살이 {o('흐물흐물')}",
                 "사흘 뒤, 묽은 수산화 나트륨 용액에 넣은 삶은 달걀흰자와 닭 가슴살이 조금씩 흐물흐물해지고 용액이 뿌옇게 흐려져요.")
        self.play(Transform(day, day2), mats[6].animate.scale(0.75).set_opacity(0.7), mats[7].animate.scale(0.75).set_opacity(0.7),
                  FadeIn(cl), mats[0].animate.scale(0.75), mats[1].animate.scale(0.75), run_time=1.2)
        self.settle()
        day3 = K.label("일주일 뒤", self.accent, 32).move_to(day)
        self.say(f"일주일 뒤: 산성은 껍데기를, 염기성은 흰자·닭 가슴살을 {o('녹였어요')}",
                 "일주일 뒤, 산성 용액은 달걀 껍데기와 조개껍데기를, 염기성 용액은 삶은 달걀흰자와 닭 가슴살을 녹였어요.")
        self.play(Transform(day, day3), mats[0].animate.scale(0.5), mats[1].animate.scale(0.5), FadeOut(bub),
                  mats[6].animate.scale(0.6).set_opacity(0.45), mats[7].animate.scale(0.6).set_opacity(0.45), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 결과 ──
    def result(self):
        self.section("정리해요")
        A, N, S_ = r("기포가 발생하며\n녹는다"), "변화 없다", b("흐물흐물해진다\n(녹는다)")
        head = [""] + MATN
        rows = [["묽은 염산", A, A, N, N], ["묽은 수산화\n나트륨 용액", N, N, S_, S_]]
        tab = K.result_table(head, rows, [3.4, 2.45, 2.45, 2.45, 2.45], row_h=1.0, size=26).move_to([0, 1.2, 0])
        self.say("관찰한 결과를 정리해요", "관찰한 결과를 표로 정리해요.")
        self.play(FadeIn(tab), run_time=0.8)
        c1 = K.text_card([f"달걀 껍데기·조개껍데기", f"주요 성분: {o('탄산 칼슘')}"], w=6.3, size=30).move_to([-3.3, -1.5, 0])
        c2 = K.text_card([f"삶은 달걀흰자·닭 가슴살", f"주요 성분: {g('단백질')}"], w=6.3, size=30).move_to([3.3, -1.5, 0])
        self.say(f"껍데기는 {o('탄산 칼슘')}, 흰자·닭 가슴살은 {g('단백질')}",
                 "달걀 껍데기와 조개껍데기의 주요 성분은 탄산 칼슘이고, 삶은 달걀흰자와 닭 가슴살의 주요 성분은 단백질이에요.")
        self.play(FadeIn(c1, shift=UP * 0.2), FadeIn(c2, shift=UP * 0.2), run_time=0.7)
        self.settle()
        self.say(f"{r('산성 용액')}은 탄산 칼슘을, {b('염기성 용액')}은 단백질을 녹여요",
                 "산성 용액은 탄산 칼슘을 녹이고, 염기성 용액은 단백질을 녹이는 성질이 있어요.")
        self.play(Indicate(c1, color=RED, scale_factor=1.04), Indicate(c2, color=BLUE, scale_factor=1.04), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 더 알아봐요 ──
    def more(self):
        self.section("더 알아봐요")
        m1 = K.marble(2.4).move_to([-3.2, 0.9, 0])
        m2 = K.tofu(2.2).move_to([3.2, 0.9, 0])
        t1 = M(f"대리암 조각 · 주요 성분 {o('탄산 칼슘')}", 30).next_to(m1, DOWN, buff=0.35)
        t2 = M(f"두부 · 주요 성분 {g('단백질')}", 30).next_to(m2, DOWN, buff=0.35)
        self.say("대리암 조각과 두부를 넣으면 어떻게 될까요?",
                 "대리암 조각의 주요 성분은 탄산 칼슘, 두부의 주요 성분은 단백질이에요. 묽은 염산과 묽은 수산화 나트륨 용액에 넣으면 어떻게 될까요?")
        self.play(FadeIn(m1), FadeIn(m2), FadeIn(t1), FadeIn(t2), run_time=0.8)
        self.pause_screen(5, "어느 용액에서 변화가 나타날까요?")
        a1 = K.label("묽은 염산에서 변화", RED, 30).next_to(t1, DOWN, buff=0.3)
        a2 = K.label("묽은 수산화 나트륨 용액에서 변화", BLUE, 30).next_to(t2, DOWN, buff=0.3)
        self.say(f"대리암 조각은 {r('묽은 염산')}, 두부는 {b('묽은 수산화 나트륨 용액')}",
                 "대리암 조각은 묽은 염산에서, 두부는 묽은 수산화 나트륨 용액에서 변화가 나타나요.")
        self.play(FadeIn(a1, shift=UP * 0.2), FadeIn(a2, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"달걀 껍데기를 {r('산성')} 용액에 넣으면", "기포가 발생하며 녹습니다."], w=11.0, size=40).move_to([0, 1.5, 0])
        self.say(f"달걀 껍데기를 {r('산성')} 용액에 넣으면 기포가 발생하며 녹아요")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        card2 = K.text_card([f"식초에 메추리알을 넣으면 껍데기에서 {o('기포')}가 발생하며 녹아요.",
                             "식초는 산성 용액이라 껍데기의 탄산 칼슘을 녹이기 때문이에요."], w=12.6, size=30).move_to([0, -0.85, 0])
        self.say(f"식초 속 메추리알 껍데기도 {o('기포')}를 내며 녹아요",
                 "그래서 식초에 메추리알을 넣으면 껍데기에서 기포가 발생하며 녹아요. 식초는 산성 용액이고, 껍데기의 주요 성분인 탄산 칼슘을 녹이기 때문이에요.")
        self.play(FadeIn(card2, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
