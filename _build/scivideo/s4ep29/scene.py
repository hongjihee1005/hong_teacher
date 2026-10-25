"""「과학 원리 돋보기」 4학년 29화 — 압력과 기체의 부피 (4-2 3단원 여러 가지 기체 4차시, 화 코드 4-2-3-c)

바탕: grade4/science/sem2/u3-3.html(원본 _build_tb/src2/u3-3.html) — 도입(풍선 놀이기구에서 힘을 주어 뛰면 눌린 부분이 들어가며
공기의 부피가 줄어듦, '압력' = 일정한 넓이에 작용하는 힘), 실험해요 1(주사기에 공기 40 mL, 마개로 입구를 막고 피스톤을 누르면
피스톤이 들어가고 부피가 줄어듦, 누를수록 손에 느껴지는 힘이 커짐, 손을 떼면 원래대로; 안전: 무리하게 누르지 않기·마개가 빠지지 않게),
실험해요 2(공기를 빼는 장치 속 고무풍선: 펌프로 공기를 빼면 압력이 낮아져 고무풍선이 커짐, 단추를 누르면 처음 크기, 마시멜로도 부풂;
안전: 뚜껑 단추), 탐구 보고서(압력↑ 부피↓ · 압력↓ 부피↑), 생활 속 예(산 정상 과자 봉지 + 카드 5가지), 한눈에 쏙.
(EPISODES.md의 '액체는 거의 그대로' 비교는 앱에 없어 넣지 않음)
최종: ./make_final.sh s4ep29
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Arrow,
                   ValueTracker, always_redraw, rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="{BLUE}">{s}</span>'


class S4Ep29(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 29
    EP_TITLE = "압력과 기체의 부피"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.lab1()
        self.lab2()
        self.report()
        self.life()
        self.summary()
        self.closing(f"압력이 높아지면 기체의 부피는 {bl('줄어들고')},\n압력이 낮아지면 {r('늘어나요')}",
                     next_preview="4학년 30화 · 생활 속 여러 가지 기체")
        self.wait(0.5)

    # ── 궁금해요: 풍선 놀이기구 ──
    def intro(self):
        self.section("궁금해요")
        dip = ValueTracker(0.0)
        cush = always_redraw(lambda: K.air_cushion(dip.get_value()).move_to([0, -1.3, 0]))
        kd = K.kid().scale(1.1)
        self.add(cush)
        kd.move_to([0, 0, 0])
        y0 = cush[1].get_critical_point(UP)[1]
        kd.shift(UP * (y0 - (kd.get_bottom()[1])))
        self.say("풍선 놀이기구에서 힘을 주어 뛰어요", "풍선 놀이기구에서 힘을 주어 뛰어 볼까요?")
        self.play(FadeIn(kd), run_time=0.5)
        for _ in range(2):
            self.play(kd.animate.shift(UP * 1.2), run_time=0.35, rate_func=rate_functions.ease_out_quad)
            self.play(kd.animate.shift(DOWN * 1.6), dip.animate.set_value(0.4), run_time=0.4, rate_func=rate_functions.ease_in_quad)
            self.play(kd.animate.shift(UP * 0.4), dip.animate.set_value(0.0), run_time=0.3)
        self.play(kd.animate.shift(DOWN * 0.4), dip.animate.set_value(0.4), run_time=0.4)
        self.say("발로 누른 부분이 안으로 들어갈 때 공기의 부피는?",
                 "발로 누른 부분이 안으로 들어갈 때, 풍선 놀이기구 속 공기의 부피는 어떻게 될까요?")
        self.pause_screen(5, "공기의 부피는 어떻게 될까요?")
        self.say(f"눌린 부분이 들어가며 공기의 부피가 {bl('줄어들어요')}",
                 "발로 밟은 부분이 눌려 들어가면서 풍선 놀이기구 속 공기의 부피가 줄어들어요.")
        self.settle()
        cush.clear_updaters()
        df = K.text_card([f"{g('압력')}: 일정한 넓이에 작용하는 힘"], w=8.4, size=36, stroke=GREEN).move_to([0, 2.3, 0])
        self.play(FadeIn(df), run_time=0.5)
        self.say(f"일정한 넓이에 작용하는 힘을 {g('압력')}이라고 해요",
                 "공기가 든 것을 누르면 크기가 달라져요. 기체에 작용하는 압력이 변했기 때문이에요. 일정한 넓이에 작용하는 힘을 압력이라고 해요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 1: 주사기 ──
    def lab1(self):
        self.section("실험해요 1")
        V = ValueTracker(40.0)
        cap = ValueTracker(0.0)

        def syr():
            v = V.get_value()
            f = max(0.0, (40 / v - 1) / (40 / 20 - 1)) if cap.get_value() > 0.5 else 0.0
            return K.syringe(v, cap.get_value() > 0.5, force=f, y=0.3)
        sy = always_redraw(syr)
        vt = always_redraw(lambda: M(f"공기의 부피: {o(str(int(round(V.get_value()))) + ' mL')}", 40).move_to([0, -1.35, 0]))
        self.say(f"주사기에 공기를 {o('40 mL')} 넣었어요", "주사기에 공기를 3분의 2 정도, 40 밀리리터 넣었어요.")
        self.add(sy)
        self.play(FadeIn(vt), run_time=0.5)
        self.say(f"{o('주사기 마개')}로 입구를 막아요", "공기가 빠져나가지 않게 주사기 마개로 입구를 막아요.")
        self.play(cap.animate.set_value(1.0), run_time=0.3)
        self.settle()
        safe = K.safety_note("주사기의 피스톤을 무리하게 누르지 않아요. 마개가 빠지지 않게 조심해요.",
                             w=11.6, size=26).move_to([0.4, 2.25, 0])
        self.say("피스톤을 누르면 어떻게 될까요?", "이제 피스톤을 눌러 볼게요. 어떻게 될까요?")
        self.play(FadeIn(safe), run_time=0.4)
        self.pause_screen(5, "피스톤을 누르면 어떻게 될까요?")
        self.play(V.animate.set_value(30), run_time=1.6, rate_func=rate_functions.smooth)
        self.say(f"피스톤이 들어가고 공기의 부피가 {bl('줄어들어요')}",
                 "피스톤이 주사기 속으로 들어가고, 공기의 부피가 줄어들었어요.")
        self.play(V.animate.set_value(25), run_time=1.2, rate_func=rate_functions.smooth)
        self.settle()
        self.say(f"누를수록 손에 느껴지는 {r('힘이 커져요')}", "더 누를수록 손에 느껴지는 힘이 커져요. 무리하게 누르지 않아요.")
        self.settle()
        self.say("손을 떼면 피스톤이 다시 밀려 나와요", "손을 떼니 피스톤이 다시 밀려 나와 공기의 부피가 원래대로 돌아왔어요.")
        self.play(V.animate.set_value(40), run_time=1.4, rate_func=rate_functions.smooth)
        self.settle()
        res = K.text_card([f"피스톤을 누르면 {r('압력이 높아져')} 공기의 {bl('부피가 줄어요')}"], w=11.0, size=34, stroke=GREEN).move_to([0, -0.6, 0])
        self.play(FadeOut(vt), FadeIn(res), run_time=0.5)
        self.say(f"압력이 높아지면 기체의 부피가 {bl('줄어들어요')}",
                 "피스톤을 누르면 주사기 속 공기에 작용하는 압력이 높아져요. 압력이 높아지면 기체의 부피가 줄어들어요.")
        self.settle()
        sy.clear_updaters()
        clear_stage(self)

    # ── 실험해요 2: 공기를 빼는 장치 ──
    def lab2(self):
        self.section("실험해요 2")
        jar = K.vac_jar(2.1, 2.0).scale(1.15).move_to([-1.6, -2.2, 0], aligned_edge=DOWN)
        rr = ValueTracker(1.0)
        ball = always_redraw(lambda: K.vac_ball(rr.get_value()).scale(1.15, about_point=np.array([0, 0, 0]))
                             .shift([-1.6, -2.2 + 0.2, 0]))
        pump = K.hand_pump(1.1)
        pump.move_to([-1.6, 0, 0]).shift(UP * (jar.lid.get_top()[1] - pump.get_bottom()[1]))
        self.say("공기를 넣고 묶은 고무풍선을 용기에 넣고 뚜껑을 닫아요",
                 "공기를 조금 넣고 클립으로 묶은 고무풍선을 공기를 빼는 장치의 용기에 넣고 뚜껑을 닫았어요.")
        self.play(FadeIn(jar), run_time=0.5)
        self.add(ball)
        self.play(FadeIn(pump), run_time=0.4)
        self.settle()
        self.say("펌프로 용기 안의 공기를 빼내면 고무풍선은?", "펌프로 용기 안의 공기를 빼내면 고무풍선은 어떻게 될까요?")
        self.pause_screen(5, "고무풍선은 어떻게 될까요?")
        for i in range(6):
            self.play(pump.top.animate.shift(DOWN * 0.3), run_time=0.18)
            self.play(pump.top.animate.shift(UP * 0.3), rr.animate.set_value(1 + (i + 1) * 0.075), run_time=0.25)
        info = K.text_card([f"공기를 빼면 고무풍선에 작용하는 {bl('압력이 낮아져요')}",
                            f"→ 고무풍선 속 공기의 {r('부피가 늘어나요')}"], w=7.4, size=28).move_to([3.4, 0.5, 0])
        self.say(f"고무풍선이 {r('커졌어요')}", "고무풍선이 커졌어요. 용기 속 공기를 빼내면 고무풍선에 작용하는 압력이 낮아져서, 고무풍선 속 공기의 부피가 늘어나요.")
        self.play(FadeIn(info), run_time=0.5)
        self.settle()
        self.say(f"{o('뚜껑 가운데 단추')}를 누르면 처음 크기로 돌아와요",
                 "뚜껑 가운데 단추를 누르니 공기가 다시 들어가 압력이 처음과 같아졌고, 고무풍선이 처음 크기로 돌아왔어요.")
        self.play(FadeOut(pump), Indicate(jar.btn, color=RED, scale_factor=1.6), run_time=0.6)
        self.play(rr.animate.set_value(1.0), run_time=1.0)
        safe = K.safety_note("뚜껑은 가운데 단추를 누른 뒤에 열어요(억지로 열면 다칠 수 있어요).", w=11.6, size=26).move_to([0.4, 2.25, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.settle()
        ball.clear_updaters()
        self.play(FadeOut(ball), FadeOut(info), run_time=0.3)
        m = ValueTracker(1.0)
        mm = always_redraw(lambda: K.marshmallow(m.get_value()).scale(1.6, about_point=np.array([0, 0, 0])).shift([-1.6, -2.2 + 0.18, 0]))
        self.add(mm)
        mt = T("마시멜로로도 해 봐요", 34).move_to([3.4, 0.5, 0])
        self.play(FadeIn(mt), run_time=0.4)
        self.play(m.animate.set_value(1.45), run_time=1.6)
        self.say(f"마시멜로도 {r('부풀어 올라요')}. 마시멜로 속에도 공기가 있어요",
                 "마시멜로를 넣고 공기를 빼도 마시멜로가 부풀어 올라요. 마시멜로 속에도 공기가 들어 있어요.")
        self.settle()
        mm.clear_updaters()
        clear_stage(self)

    # ── 탐구 보고서 ──
    def report(self):
        self.section("정리해요")
        c1 = K.text_card([f"압력이 {r('높아지면')} 기체의 부피는 {bl('줄어들어요')}", "주사기 피스톤을 누를 때"], w=6.2, size=30).move_to([-3.25, 0.7, 0])
        c2 = K.text_card([f"압력이 {bl('낮아지면')} 기체의 부피는 {r('늘어나요')}", "용기의 공기를 빼낼 때"], w=6.2, size=30).move_to([3.25, 0.7, 0])
        self.say("압력에 따른 기체의 부피 변화를 정리해요",
                 "압력이 높아지면 기체의 부피는 줄어들고, 압력이 낮아지면 기체의 부피는 늘어나요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.5)
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 생활 속 예 ──
    def life(self):
        self.section("생활 속 예")
        mt = K.mountain_bag(False)[:3].scale(1.25).move_to([-1.0, -0.4, 0])
        t = ValueTracker(0.0)
        A = mt[0].get_vertices()[0] + np.array([0.9, 0.55, 0])
        B = mt[0].get_vertices()[1] + np.array([0.75, -0.25, 0])
        bag = always_redraw(lambda: K.fit(K.snack_bag(t.get_value(), label=False), 0.6 + 0.2 * t.get_value(), 0.75)
                            .move_to(A + (B - A) * t.get_value()))
        lo = T("산 아래", 28).move_to(A + np.array([0, -0.75, 0]))
        hi = T("산 정상", 28).next_to(mt, UP, buff=0.05).shift(RIGHT * 1.6 + DOWN * 0.4)
        self.say("과자 봉지를 들고 산에 올라가요", "과자 봉지를 들고 높은 산에 올라가 볼게요.")
        self.play(FadeIn(mt), FadeIn(lo), FadeIn(hi), run_time=0.6)
        self.add(bag)
        self.play(t.animate.set_value(1.0), run_time=2.4, rate_func=rate_functions.smooth)
        note = K.text_card([f"산 정상은 산 아래보다 주위의 {bl('압력이 낮아')}", f"과자 봉지가 {r('부풀어 올라요')}"],
                           w=5.6, size=28).move_to([4.2, -0.6, 0])
        self.play(FadeIn(note), run_time=0.5)
        self.say(f"산 정상에서는 과자 봉지가 {r('부풀어 올라요')}",
                 "높은 산 정상은 산 아래보다 주위의 압력이 낮아서, 과자 봉지가 부풀어 올라요.")
        self.settle()
        bag.clear_updaters()
        clear_stage(self)
        items = [(K.gym_ball(1.0), "큰 공 위에 앉아 누르면", False, "공이 작아져요"),
                 (K.sneaker(True), "운동화 공기 주머니가 땅에 닿으면", False, "주머니가 작아져요"),
                 (K.rise_balloon(), "고무풍선이 하늘로 올라가면", True, "점점 커지다가 터져요"),
                 (K.diver_bubbles(), "잠수부가 내뿜은 공기 방울", True, "올라갈수록 커져요")]
        cards = VGroup()
        tags = VGroup()
        for i, (pic, q, up, res) in enumerate(items):
            x = -4.9 + 3.27 * i
            box = K.R(3.05, 3.9, PAPER, x, 0.4, rad=0.16, stroke=SOFT, sw=4)
            qt = T(q, 22).move_to([x, 1.95, 0])
            if qt.width > 2.85:
                qt.scale_to_fit_width(2.85)
            K.fit(pic, 2.2, 2.0).move_to([x, 0.45, 0])
            cards.add(VGroup(box, qt, pic))
            lab = VGroup(T(res, 22, RED if up else BLUE),
                         T("압력↓ 부피↑" if up else "압력↑ 부피↓", 24, RED if up else BLUE)).arrange(DOWN, buff=0.1).move_to([x, -0.95, 0])
            tags.add(lab)
        self.say("우리 주변에서 압력에 따라 부피가 변하는 예를 찾아요",
                 "우리 주변에서 압력에 따라 기체의 부피가 변하는 예를 더 찾아봐요. 압력이 높아졌을까요, 낮아졌을까요?")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=1.0)
        self.pause_screen(5, "압력이 높아졌을까요, 낮아졌을까요?")
        self.say(f"누르면 {r('압력↑')} {bl('부피↓')}, 위로 올라가면 {bl('압력↓')} {r('부피↑')}",
                 "큰 공을 누르거나 운동화 공기 주머니가 땅에 닿으면 압력이 높아져 부피가 줄어들어요. 고무풍선이 하늘로 올라가거나 공기 방울이 물 위로 올라갈수록 압력이 낮아져 부피가 늘어나요.")
        for c, tg, (_, _, up, _) in zip(cards, tags, items):
            self.play(FadeIn(tg), c[0].animate.set_stroke(RED if up else BLUE, 5), run_time=0.5)
            self.wait(0.8)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"기체는 {o('압력')}에 따라 {g('부피')}가 달라집니다."], w=12.0, size=52).move_to([0, 0.6, 0])
        self.say(f"기체는 {o('압력')}에 따라 {g('부피')}가 달라져요", "기체는 압력에 따라 부피가 달라져요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
