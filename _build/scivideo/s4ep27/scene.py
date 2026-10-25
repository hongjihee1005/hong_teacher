"""「과학 원리 돋보기」 4학년 27화 — 보이지 않는 기체도 무게가 있을까? (4-2 3단원 여러 가지 기체 2차시, 화 코드 4-2-3-a)

바탕: grade4/science/sem2/u3-1.html(원본 _build_tb/src2/u3-1.html) — 도입(납작한 자전거 타이어에 펌프로 공기를 넣으면 무게는?),
전자저울 사용법(평평한 곳·수평 → 전원 → 영점 → 올려놓고 읽기), 실험해요 1(페트병 + 공기 주입 마개: 넣기 전 54.0 g → 20번 눌러
팽팽해진 뒤 54.2 g, 안전: 약 25번보다 많이 누르지 않기·실험복·보안경·실험용 장갑), 실험해요 2(공기를 빼는 장치: 254.8 g → 펌프질 뒤
254.3 g, 안전: 뚜껑 가운데 단추를 누른 뒤 열기), 정리(공기는 무게가 있어요), 생각 바로잡기(54.2 g이 모두 공기의 무게? 늘어난 0.2 g이
더 넣은 공기), 교실 안 공기(피아노 한 대와 비슷, 1 m 상자 공기 약 1.29 kg, 교실 약 200 kg), 생활(고무보트), 한눈에 쏙.
최종: ./make_final.sh s4ep27
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Arrow, Rotate,
                   rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def record(label, val="?", col=SOFT):
    t1 = T(label, 28)
    t2 = T(val, 44, col)
    box = K.R(3.0, 1.35, PAPER, rad=0.16, stroke=col, sw=4)
    VGroup(t1, t2).arrange(DOWN, buff=0.12).move_to(box)
    return VGroup(box, t1, t2)


class S4Ep27(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 27
    EP_TITLE = "보이지 않는 기체도 무게가 있을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.scale_use()
        self.lab1()
        self.lab2()
        self.result()
        self.classroom()
        self.summary()
        self.closing(f"공기와 같은 기체는 눈에 보이지 않고 손으로 잡을 수 없지만\n{g('무게가 있어요')}",
                     next_preview="4학년 28화 · 온도와 기체의 부피")
        self.wait(0.5)

    # ── 궁금해요: 자전거 타이어 ──
    def intro(self):
        self.section("궁금해요")
        b0 = K.bike(False).scale(1.35).move_to([-1.6, 0.2, 0])
        pump = K.floor_pump().scale(1.1).move_to([2.6, 0.1, 0])
        self.say("바람이 빠져 납작한 자전거 타이어에 공기를 넣어요",
                 "바람이 빠져 납작한 자전거 타이어에 펌프로 공기를 넣어 볼게요.")
        self.play(FadeIn(b0), FadeIn(pump), run_time=0.7)
        for _ in range(3):
            self.play(pump.handle.animate.shift(DOWN * 0.45), run_time=0.25)
            self.play(pump.handle.animate.shift(UP * 0.45), run_time=0.25)
        b1 = K.bike(True).scale(1.35).move_to(b0)
        self.play(Transform(b0, b1), run_time=0.8)
        self.say(f"빵빵해진 자전거의 {o('무게')}는 어떻게 될까요?",
                 "타이어가 빵빵해질 때까지 공기를 더 넣으면, 자전거의 무게는 어떻게 될까요?")
        self.settle()
        self.pause_screen(5, "자전거의 무게는 어떻게 될까요?")
        clear_stage(self)

    # ── 전자저울 ──
    def scale_use(self):
        self.section("전자저울")
        sc = K.e_scale("0.0", 3.6).move_to([-4.7, -0.6, 0])
        steps = [f"① {o('평평한 곳')}에 놓고 수평을 맞춰요",
                 f"② {o('전원')} 단추를 누르고 숫자가 멈출 때까지 기다려요",
                 f"③ {o('영점')} 단추를 눌러 영점을 맞춰요",
                 f"④ 물체를 올려놓고 숫자가 멈추면 {o('무게를 읽어요')}"]
        card = K.text_card(steps, w=8.4, size=30).move_to([2.35, 0.3, 0])
        self.say(f"아주 작은 무게 차이를 재야 해서 {o('전자저울')}을 써요",
                 "공기를 넣거나 빼기 전과 후의 아주 작은 무게 차이를 재야 해서 전자저울을 써요. 평평한 곳, 전원, 영점, 그리고 무게 읽기 차례예요.")
        self.play(FadeIn(sc), FadeIn(card[0]), run_time=0.5)
        for t in card[1]:
            self.play(FadeIn(t, shift=RIGHT * 0.2), run_time=0.4)
            self.wait(0.5)
        self.settle()
        clear_stage(self)

    # ── 실험해요 1: 공기를 넣기 전과 후 ──
    def lab1(self):
        self.section("실험해요 1")
        sc = K.e_scale("0.0", 3.6).move_to([-3.4, -2.05, 0], aligned_edge=DOWN)
        bot = K.pet_bottle(0).scale(1.05)
        bot.move_to([0.6, -0.3, 0])
        lab = T("공기 주입 마개", 26, SOFT).next_to(bot, RIGHT, buff=0.4).shift(UP * 1.2)
        arr = Arrow(lab.get_left(), bot.btn.get_right(), buff=0.08, color=SOFT, stroke_width=4, max_tip_length_to_length_ratio=0.25)
        rA, rB = record("공기를 넣기 전"), record("공기를 넣은 후")
        VGroup(rA, rB).arrange(DOWN, buff=0.3).move_to([5.2, 0.4, 0])
        self.say("페트병에 공기 주입 마개를 끼우고 무게를 재요",
                 "페트병에 공기 주입 마개를 끼웠어요. 먼저 공기를 넣기 전의 무게를 재요.")
        self.play(FadeIn(sc), FadeIn(bot), FadeIn(rA), FadeIn(rB), run_time=0.7)
        self.play(Create(arr), run_time=0.3)
        self.play(FadeIn(lab), run_time=0.3)
        self.play(FadeOut(arr), FadeOut(lab), bot.animate.move_to([sc.get_center()[0], sc.get_top()[1] + bot.height / 2, 0]), run_time=0.8)
        self.play(Transform(sc.num, K.scale_read(sc, "54.0")), run_time=0.4)
        vA = T("54.0 g", 44, BLUE).move_to(rA[2])
        self.play(Transform(rA[2], vA), rA[0].animate.set_stroke(BLUE, 5), run_time=0.4)
        self.say(f"공기를 넣기 전 무게는 {o('54.0 g')}이에요", "공기를 넣기 전 무게는 54.0 그램이에요.")
        self.settle()
        # 내려놓고 마개 누르기
        self.play(bot.animate.move_to([0.8, -0.3, 0]), Transform(sc.num, K.scale_read(sc, "0.0")), run_time=0.7)
        safe = K.safety_note("공기를 너무 많이 넣지 않아요(약 25번보다 많이 누르면 마개가 튕겨 나갈 수 있어요)",
                             w=11.6, size=26).move_to([0.4, 2.25, 0])
        self.say(f"저울에서 내려놓고 마개를 {o('20번')} 눌러 공기를 넣어요",
                 "저울에서 내려놓고 공기 주입 마개를 20번 눌러 공기를 넣어요.")
        self.play(FadeIn(safe), run_time=0.4)
        cnt = T("0번", 34, ORANGE).next_to(bot, LEFT, buff=0.5).shift(UP * 0.8)
        self.add(cnt)
        for i in range(1, 21, 2):
            new = K.pet_bottle(i / 20).scale(1.05).move_to(bot)
            self.play(bot.btn.animate.stretch(0.5, 1), run_time=0.08)
            self.play(Transform(bot, new), Transform(cnt, T(f"{i + 1}번", 34, ORANGE).move_to(cnt)), run_time=0.14)
        feel = T("팽팽해요!", 34, GREEN).next_to(bot, RIGHT, buff=0.4)
        self.play(FadeIn(feel, scale=1.2), run_time=0.4)
        self.say(f"만져 보니 페트병이 {o('팽팽해졌어요')}", "살짝 만져 보니 페트병이 팽팽해졌어요.")
        self.settle()
        self.play(FadeOut(feel), FadeOut(cnt), FadeOut(safe), run_time=0.3)
        self.pause_screen(5, "무게는 어떻게 되었을까요?")
        self.play(bot.animate.move_to([sc.get_center()[0], sc.get_top()[1] + bot.height / 2, 0]), run_time=0.8)
        self.play(Transform(sc.num, K.scale_read(sc, "54.2")), run_time=0.4)
        vB = T("54.2 g", 44, RED).move_to(rB[2])
        self.play(Transform(rB[2], vB), rB[0].animate.set_stroke(RED, 5), run_time=0.4)
        self.say(f"공기를 넣은 후 무게는 {o('54.2 g')}. 무게가 {r('늘어났어요')}",
                 "공기를 넣은 후 무게는 54.2 그램이에요. 공기를 더 넣었더니 무게가 늘어났어요.")
        note = T("※ 잰 무게는 페트병마다 달라요. 실제 실험에서는 내가 잰 결과를 그대로 써요.", 24, SOFT).move_to([0.6, -2.35, 0])
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 실험해요 2: 공기를 빼기 전과 후 ──
    def lab2(self):
        self.section("실험해요 2")
        sc = K.e_scale("0.0", 3.6).move_to([-3.4, -2.05, 0], aligned_edge=DOWN)
        jar = K.vac_jar(1.9, 1.7)
        dots = K.air_in(-0.82, 0.82, 0.15, 1.55, n=36, seed=4)
        jg = VGroup(jar, dots).move_to([sc.get_center()[0], sc.get_top()[1], 0], aligned_edge=DOWN)
        lab = T("공기를 빼는 장치", 28, SOFT).next_to(jg, UP, buff=0.3)
        rC, rD = record("공기를 빼기 전"), record("공기를 뺀 후")
        VGroup(rC, rD).arrange(DOWN, buff=0.3).move_to([5.2, 0.4, 0])
        self.say("이번에는 공기를 빼는 장치의 무게를 재요",
                 "이번에는 공기를 빼는 장치의 무게를 먼저 재요.")
        self.play(FadeIn(sc), FadeIn(jg), FadeIn(lab), FadeIn(rC), FadeIn(rD), run_time=0.7)
        self.play(Transform(sc.num, K.scale_read(sc, "254.8")), run_time=0.4)
        self.play(Transform(rC[2], T("254.8 g", 40, BLUE).move_to(rC[2])), rC[0].animate.set_stroke(BLUE, 5), run_time=0.4)
        self.say(f"공기를 빼기 전 무게는 {o('254.8 g')}이에요", "공기를 빼기 전 용기의 무게는 254.8 그램이에요.")
        self.settle()
        self.play(FadeOut(lab), jg.animate.move_to([0.6, -1.6, 0], aligned_edge=DOWN), Transform(sc.num, K.scale_read(sc, "0.0")), run_time=0.7)
        pump = K.hand_pump(1.1).move_to([0.6, 0, 0])
        pump.shift(UP * (jar.lid.get_top()[1] - pump.get_bottom()[1]))
        self.play(FadeIn(pump), run_time=0.4)
        self.say("저울에서 내려놓고 펌프로 용기 안의 공기를 빼내요",
                 "저울에서 내려놓고, 펌프질이 힘들어질 때까지 공기를 빼내요.")
        keep = list(range(len(dots)))
        rng = np.random.default_rng(5)
        rng.shuffle(keep)
        for k in range(4):
            gone = VGroup(*[dots[i] for i in keep[k * 5:(k + 1) * 5]])
            self.play(pump.top.animate.shift(DOWN * 0.3), run_time=0.2)
            self.play(pump.top.animate.shift(UP * 0.3), FadeOut(gone, shift=UP * 0.5), run_time=0.25)
        self.settle()
        self.pause_screen(5, "무게는 어떻게 되었을까요?")
        self.play(FadeOut(pump), run_time=0.3)
        self.play(jg.animate.move_to([sc.get_center()[0], sc.get_top()[1], 0], aligned_edge=DOWN), run_time=0.8)
        self.play(Transform(sc.num, K.scale_read(sc, "254.3")), run_time=0.4)
        self.play(Transform(rD[2], T("254.3 g", 40, RED).move_to(rD[2])), rD[0].animate.set_stroke(RED, 5), run_time=0.4)
        self.say(f"공기를 뺀 후 무게는 {o('254.3 g')}. 무게가 {r('줄어들었어요')}",
                 "공기를 뺀 후 무게는 254.3 그램. 무게가 줄어들었어요.")
        self.settle()
        safe = K.safety_note("뚜껑을 열 때는 뚜껑 가운데 단추를 누른 뒤에 열어요(억지로 열면 다칠 수 있어요)",
                             w=11.6, size=26).move_to([0.4, 2.25, 0])
        self.play(FadeIn(safe), Indicate(jar.btn, color=RED, scale_factor=1.6), run_time=0.8)
        self.say(f"뚜껑은 {o('가운데 단추')}를 누른 뒤에 열어요",
                 "뚜껑은 가운데 단추를 누른 뒤에 열어요. 억지로 열면 다칠 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def result(self):
        self.section("정리해요")
        c1 = K.text_card([f"공기를 넣으면 무게가 {r('늘어나요')}   54.0 g → 54.2 g",
                          f"공기를 빼면 무게가 {BLUE_S('줄어들어요')}   254.8 g → 254.3 g"], w=12.0, size=36).move_to([0, 1.6, 0])
        big = M(f"공기는 {g('무게가 있어요')}", 64).move_to([0, -0.1, 0])
        self.say("두 실험으로 알 수 있는 공기의 성질은?",
                 "공기를 넣으면 무게가 늘고, 빼면 줄었어요. 알 수 있는 공기의 성질은?")
        self.play(FadeIn(c1), run_time=0.6)
        self.settle()
        self.play(FadeIn(big, scale=0.9), run_time=0.6)
        self.say(f"공기는 {g('무게가 있어요')}", "공기는 무게가 있어요.")
        self.settle()
        self.play(FadeOut(c1), FadeOut(big), run_time=0.4)
        # 생각 바로잡기
        bot = K.pet_bottle(1).scale(1.0).move_to([-4.6, 0.6, 0])
        tag = T("54.2 g", 40, RED).next_to(bot, DOWN, buff=0.3)
        q = K.text_card(["페트병이 54.2 g이었으면", f"페트병 속 공기의 무게가 {o('54.2 g')}일까요?"], w=8.2, size=36).move_to([1.8, 1.2, 0])
        self.section("생각 바로잡기")
        self.say("54.2 g이 모두 공기의 무게일까요?", "페트병이 54.2 그램이었으면, 페트병 속 공기의 무게가 54.2 그램일까요?")
        self.play(FadeIn(bot), FadeIn(tag), FadeIn(q), run_time=0.6)
        self.pause_screen(5, "54.2 g이 모두 공기의 무게일까요?")
        a = K.text_card([f"아니요! 54.2 g에는 {o('페트병과 마개의 무게')}도 들어 있어요",
                         f"늘어난 {g('0.2 g')}이 더 넣은 공기의 무게예요"], w=8.6, size=32, stroke=GREEN).move_to([1.8, -1.0, 0])
        self.play(FadeIn(a), run_time=0.6)
        self.say(f"늘어난 {g('0.2 g')}이 더 넣은 공기의 무게예요",
                 "아니에요. 54.2 그램에는 페트병과 마개의 무게도 들어 있어요. 늘어난 0.2 그램이 더 넣은 공기의 무게예요.")
        self.settle()
        clear_stage(self)

    # ── 교실 안 공기의 무게 ──
    def classroom(self):
        self.section("교실 안 공기")
        ss = K.Seesaw(center=(0, -1.2, 0), half=4.0)
        self.say("교실 안 공기를 모두 모아 저울에 올리면?",
                 "저울의 한쪽에 우리 교실 안에 있는 공기를 모두 모아 올리고, 다른 쪽에 무엇을 올리면 비슷할까요?")
        self.play(FadeIn(ss.group()), run_time=0.6)
        cands = VGroup(K.pic_card(K.feather(), "깃털 한 개", 2.4, 2.0), K.pic_card(K.backpack(False), "책가방 한 개", 2.4, 2.0),
                       K.pic_card(K.piano(), "피아노 한 대", 2.4, 2.0)).arrange(RIGHT, buff=0.35).move_to([0, 1.95, 0])
        self.play(FadeIn(cands, lag_ratio=0.2), run_time=0.8)
        self.pause_screen(5, "무엇과 비슷할까요?")
        pv = ss.pivot
        # 깃털: 공기 쪽(왼쪽)이 내려감
        f = K.fit(K.feather(), 0.5, 1.0)
        ss.put(f)
        self.play(FadeIn(f), run_time=0.3)
        self.play(Rotate(ss.beam, angle=0.2, about_point=pv), run_time=0.8)
        self.say(f"깃털, 책가방보다 교실 안 공기가 {r('훨씬 무거워요')}",
                 "깃털이나 책가방보다 교실 안 공기가 훨씬 무거워요.")
        self.settle()
        self.play(Rotate(ss.beam, angle=-0.2, about_point=pv), FadeOut(f), run_time=0.6)
        ss.beam.remove(f)
        pi_ = K.fit(K.piano(), 1.9, 1.3)
        ss.put(pi_)
        self.play(FadeIn(pi_), Indicate(cands[2], color=GREEN), run_time=0.6)
        self.say(f"{g('피아노 한 대')}와 비슷해요. 거의 수평이에요!", "피아노를 올리면 거의 수평이 돼요. 교실 안 공기의 무게는 피아노 한 대와 비슷해요.")
        self.settle()
        info = K.text_card([f"가로·세로·높이가 모두 1 m인 상자 속 공기: 약 {o('1.29 kg')}",
                            f"교실 안 공기: {o('200 kg')} 정도"], w=11.5, size=32).move_to([0, 1.95, 0])
        self.play(FadeOut(cands), FadeIn(info), run_time=0.6)
        self.say(f"교실 안 공기는 {o('200 kg')} 정도예요",
                 "가로, 세로, 높이가 1 미터인 상자 속 공기는 약 1.29 킬로그램, 교실 안 공기는 200 킬로그램 정도예요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"공기와 같은 기체는 대부분 {o('눈에 보이지 않고')}",
                            f"{o('손으로 잡을 수 없지만')} {g('무게')}가 있습니다."], w=12.4, size=48).move_to([0, 0.6, 0])
        self.say(f"기체는 보이지 않아도 {g('무게')}가 있어요",
                 "공기와 같은 기체는 대부분 눈에 보이지 않고 손으로 잡을 수 없지만 무게가 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


def BLUE_S(s):
    return f'<span foreground="{BLUE}">{s}</span>'
