"""「과학 원리 돋보기」 3학년 30화 — 소리는 어떻게 날까? (3-2 3단원 소리의 성질 2차시, 화 코드 3-2-3-a)

바탕: grade3/science/sem2/u3-1.html — 도입(학교 오는 길의 소리: 자동차 경적·강아지 짖는 소리 …),
실험 1 목에 손을 대고 “아” 소리 내기(목이 떨림 / 소리를 내지 않으면 떨리지 않음), 상자에 건 고무줄 튕기기(위아래로 떨림,
떨림이 멈추면 소리도 멈춤), 실험 2 소리굽쇠(“웅~” 소리, 손을 대면 부르르, 물에 대면 물이 사방으로 튐 — 앱은 떨림을 크게 보여 줌),
전개 2 기타 줄(손바닥으로 잡으면 소리가 나지 않음)·작은북(좁쌀이 튀어 오름, 손바닥으로 누르면 멈춤),
한눈에 쏙 '소리가 나는 물체는 떨림이 있습니다', 생각+ '떨림을 멈추면 소리가 나지 않아요'.
최종: ./make_final.sh s3ep30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, LaggedStart, Dot,
                   rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S3Ep30(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 30
    EP_TITLE = "소리는 어떻게 날까?"
    OUT_DIR = HERE

    def construct(self):
        self.shakes = []
        self.opening()
        self.intro()
        self.neck_band()
        self.tuning_fork()
        self.guitar_drum()
        self.summary()
        self.closing(f"소리가 나는 물체는 {o('떨림')}이 있어요\n떨림이 멈추면 {g('소리도 멈춰요')}",
                     next_preview="3학년 31화 · 큰 소리와 작은 소리")
        self.wait(0.5)

    def shake(self, amp=0.0, speed=7.0, decay=0.0):
        sh = K.Shake(amp).live(self, speed, decay)
        self.shakes.append(sh)
        return sh

    def clear(self):
        for sh in self.shakes:
            sh.stop(self)
        self.shakes = []
        clear_stage(self)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sh = self.shake(0.3)
        a = tag("빵빵! 자동차 경적", BLUE, 40).move_to([-3.3, 1.2, 0])
        b = tag("멍멍! 강아지 짖는 소리", ORANGE, 40).move_to([3.0, -0.6, 0])
        ra = K.rings(a.get_right() + RIGHT * 0.1, sh, rmax=1.6, start=-0.7, span=1.4)
        rb = K.rings(b.get_left() + LEFT * 0.1, sh, rmax=1.6, start=PI - 0.7, span=1.4)
        self.say("학교 오는 길에 어떤 소리를 들었나요?",
                 "학교 오는 길에 어떤 소리를 들었나요? 자동차 경적 소리, 강아지 짖는 소리가 들렸을지도 몰라요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.5)
        self.add(ra)
        self.play(FadeIn(b, shift=UP * 0.2), run_time=0.5)
        self.add(rb)
        self.say("우리 주변에는 소리를 내는 물체가 아주 많아요", "우리 주변에는 소리를 내는 물체가 아주 많아요.")
        self.settle()
        q = T("소리는 어떻게 나는 걸까?", 64, ORANGE).move_to([0, 2.2, 0])
        self.say(f"소리는 {o('어떻게')} 나는 걸까요?", "그럼, 소리는 어떻게 나는 걸까요? 여러 가지 물체로 소리를 내며 관찰해 봐요.")
        self.play(FadeIn(q, scale=0.85), run_time=0.6)
        self.settle()
        self.clear()

    # ── 실험 1: 목과 고무줄 ──
    def neck_band(self):
        self.section("목과 고무줄")
        hd = K.head(1.0).move_to([-3.6, 0.6, 0])
        neck = hd[1].get_center()
        sh = self.shake(0.0, speed=9)
        hnd = K.hand(0.8).rotate(-PI / 2).move_to(neck + LEFT * 0.62 + DOWN * 0.05)
        marks = VGroup(*[K.vib_string(neck + RIGHT * 0.45 + UP * dy + LEFT * 0.05, neck + RIGHT * 0.75 + UP * dy, sh,
                                      col=ORANGE, sw=5) for dy in (-0.25, 0.0, 0.25)])
        mouth = hd.mouth.get_center() + RIGHT * 0.25
        rr = K.rings(mouth, sh, rmax=2.4, start=-0.55, span=1.1, ref=0.15)
        word = T("“아~”", 48, ORANGE).move_to(mouth + RIGHT * 1.6 + UP * 0.9)
        self.say("목에 손을 대고 “아~” 소리를 내 봐요", "목에 손을 살짝 대고 “아~” 하고 소리를 내 봐요.")
        self.play(FadeIn(hd), run_time=0.5)
        self.play(FadeIn(hnd, shift=RIGHT * 0.3), run_time=0.5)
        self.add(rr)
        self.pause_screen(4, "목에서 어떤 느낌이 들까요?")
        self.add(marks)
        self.play(sh.amp.animate.set_value(0.06), FadeIn(word), run_time=0.4)
        lab = tag("떨려요!", ORANGE, 40).move_to([0.6, -1.6, 0])
        self.say(f"목이 {o('떨리는')} 느낌이 들어요", "목이 떨리는 느낌이 들어요.")
        self.play(FadeIn(lab), run_time=0.4)
        self.settle()
        self.say("소리를 내지 않으면 떨리지 않아요", "이번에는 소리를 내지 않아 봐요. 소리를 내지 않으면 목이 떨리지 않아요.")
        self.play(sh.amp.animate.set_value(0.0), FadeOut(word), FadeOut(lab), FadeOut(marks), run_time=0.6)
        self.settle()
        self.clear()

        # 고무줄
        sh = self.shake(0.0, speed=7, decay=0.25)
        bx = K.rubber_box(sh, w=5.0, h=1.8, x=0.0, y=-0.6)
        rr = K.rings(bx.mid + UP * 0.3, sh, rmax=2.4, start=PI / 2 - 0.7, span=1.4, ref=0.2)
        self.say("플라스틱 상자에 건 고무줄을 튕겨 봐요", "이번에는 플라스틱 상자에 건 고무줄을 튕겨 봐요.")
        self.play(FadeIn(bx), run_time=0.5)
        self.add(rr)
        finger = K.hand(0.6).move_to(bx.mid + UP * 0.9 + RIGHT * 0.6)
        self.play(FadeIn(finger, shift=DOWN * 0.3), run_time=0.4)
        self.play(finger.animate.shift(UP * 0.6).set_opacity(0), sh.amp.animate.set_value(0.5), run_time=0.3)
        self.say(f"고무줄이 {o('떨리면서')} 소리가 나요", "튕긴 고무줄이 떨리면서 소리가 나요.")
        self.settle()
        slow = tag("느린 화면", BLUE, 40).move_to([-4.6, 1.6, 0])
        self.say("느린 화면으로 보면 위아래로 떨리는 게 잘 보여요",
                 "느린 화면으로 보면 고무줄이 위아래로 떨리는 모습이 더 잘 보여요.")
        sh.speed, sh.decay = 1.6, 0.0
        sh.amp.set_value(0.5)
        self.play(FadeIn(slow), run_time=0.3)
        self.settle()
        self.play(FadeOut(slow), run_time=0.3)
        sh.speed, sh.decay = 7, 0.0
        self.say(f"떨림이 멈추면 {r('소리도 멈춰요')}", "고무줄의 떨림이 멈추니 소리도 멈췄어요.")
        self.play(sh.amp.animate.set_value(0.0), run_time=2.0)
        self.settle()
        warn = T("고무줄은 너무 세게 당기지 않아요", 34, RED).move_to([0, 2.2, 0])
        self.say("실제 실험에서는 고무줄을 너무 세게 당기지 않아요",
                 "실제 실험에서는 고무줄이 끊어지지 않도록 너무 세게 당기지 않고, 목소리도 너무 크게 내지 않아요.")
        self.play(FadeIn(warn), run_time=0.4)
        self.settle()
        self.clear()

    # ── 실험 2: 소리굽쇠 ──
    def tuning_fork(self):
        self.section("소리굽쇠")
        sh = self.shake(0.0, speed=12, decay=0.25)
        fx, fy = -3.2, -0.2
        fk = K.fork(sh, 1.0, fx, fy)
        tip = np.array([fx, fy + 1.7, 0])
        rl = K.rings(tip + LEFT * 0.4, sh, rmax=2.0, start=PI - 0.6, span=1.2, ref=0.08)
        rr = K.rings(tip + RIGHT * 0.4, sh, rmax=2.0, start=-0.6, span=1.2, ref=0.08)
        self.say("U 자 모양의 쇠막대, 소리굽쇠예요", "U 자 모양의 쇠막대, 소리굽쇠예요. 고무망치로 가볍게 두드려 봐요.")
        self.play(FadeIn(fk), run_time=0.5)
        self.add(rl, rr)
        ml = K.mallet(1.6).move_to([fx + 1.6, fy + 2.0, 0])
        self.play(FadeIn(ml), run_time=0.3)
        self.play(ml.animate.shift(LEFT * 0.9 + DOWN * 0.2), run_time=0.25)
        self.play(ml.animate.shift(RIGHT * 0.9 + UP * 0.2), sh.amp.animate.set_value(0.12), run_time=0.25)
        word = T("“웅~”", 48, ORANGE).move_to([fx + 2.6, fy + 2.4, 0])
        self.play(FadeOut(ml), FadeIn(word), run_time=0.3)
        note = T("(영상에서는 떨림을 크게 보여 줘요)", 30, SOFT).move_to([2.6, -1.7, 0])
        self.say(f"소리굽쇠의 끝이 아주 빠르게 {o('떨려요')}",
                 "“웅~” 소리가 나요. 소리굽쇠의 끝이 아주 빠르게 떨리고 있어요. 영상에서는 떨림을 크게 보여 줘요.")
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        # 손 대 보기
        hnd = K.hand(0.7).rotate(PI / 2).move_to(tip + RIGHT * 0.75 + DOWN * 0.6)
        self.say("소리가 날 때 손을 살짝 대 보면?", "소리가 날 때 소리굽쇠에 손을 살짝 대 보면 어떤 느낌일까요?")
        sh.amp.set_value(0.12)
        self.play(FadeIn(hnd, shift=LEFT * 0.3), run_time=0.5)
        t1 = tag("“부르르” 떨리는 느낌", ORANGE, 38).move_to([2.6, 1.0, 0])
        self.say(f"손에 “부르르” {o('떨리는 느낌')}이 들어요", "손에 소리굽쇠가 “부르르” 떨리는 느낌이 들어요.")
        self.play(FadeIn(t1), run_time=0.4)
        self.settle()
        self.play(FadeOut(VGroup(hnd, t1, note, word)), run_time=0.4)
        # 물에 대 보기
        tk = K.tank(4.2, 1.6, 2.6, -1.2, level=0.75)
        self.say("이번에는 소리 나는 소리굽쇠를 물에 대 봐요",
                 "이번에는 소리가 나는 소리굽쇠의 끝을 물의 표면에 살짝 대 봐요.")
        self.play(FadeIn(tk), run_time=0.5)
        self.pause_screen(4, "물은 어떻게 될까요?")
        sh.amp.set_value(0.12)
        sh.decay = 0.0
        fk2 = K.fork(sh, 0.8, 2.6, tk.surface_y + 1.36 - 0.05, down=True)
        self.play(FadeOut(fk), FadeOut(rl), FadeOut(rr), FadeIn(fk2), run_time=0.5)
        surf = np.array([2.6, tk.surface_y, 0])
        spl = K.splash(surf, sh, h=1.0)
        self.add(spl)
        self.wait(1.2)
        t2 = tag("물이 사방으로 튀어요!", BLUE, 40).move_to([-3.2, 1.4, 0])
        self.say(f"물이 사방으로 튀어요 — 소리굽쇠가 {o('떨리고')} 있다는 증거예요",
                 "물이 사방으로 튀어요! 소리가 나는 소리굽쇠가 떨리고 있다는 증거예요.")
        self.play(FadeIn(t2), run_time=0.4)
        res = VGroup(T("듣기  ·  만지기  ·  물에 대기", 38, INK),
                     M(f"소리가 나는 소리굽쇠는 {o('떨려요')}", 42)).arrange(DOWN, buff=0.3)
        res.scale_to_fit_width(min(res.width, 6.2)).move_to([-3.4, -0.3, 0])
        self.say("세 가지 방법으로 관찰했어요", "듣기, 만지기, 물에 대기, 세 가지 방법으로 관찰했어요. 소리가 나는 소리굽쇠는 떨려요!")
        self.play(FadeIn(res, shift=UP * 0.2), run_time=0.5)
        self.settle()
        self.clear()

    # ── 기타와 북 ──
    def guitar_drum(self):
        self.section("기타와 북")
        sh = self.shake(0.0, speed=8, decay=0.0)
        gt = K.guitar(sh, w=7.4, x=0.2, y=0.6)
        rr = K.rings(gt.mid + UP * 0.6, sh, rmax=2.0, start=PI / 2 - 0.6, span=1.2, ref=0.15)
        self.say("기타 줄을 튕기면 줄이 떨리면서 소리가 나요", "기타 줄을 튕겨 봐요. 줄이 떨리면서 소리가 나요.")
        self.play(FadeIn(gt), run_time=0.5)
        self.add(rr)
        self.play(sh.amp.animate.set_value(0.18), run_time=0.3)
        self.settle()
        hnd = K.hand(0.85).move_to(gt.mid + RIGHT * 0.3 + UP * 0.05)
        self.say(f"손바닥으로 줄을 잡으면 {r('소리가 나지 않아요')}",
                 "소리가 날 때 손바닥으로 줄을 잡아 봐요. 줄이 떨리지 못해서 소리가 나지 않아요.")
        self.play(FadeIn(hnd, shift=DOWN * 0.4), sh.amp.animate.set_value(0.0), run_time=0.6)
        self.settle()
        for s_ in self.shakes:
            s_.stop(self)
        self.shakes = []
        clear_stage(self)

        sh = self.shake(0.0, speed=8, decay=0.0)
        dr = K.drum(sh, w=3.6, x=-2.6, y=-1.0, grains=8, jump=2.2)
        rr = K.rings(np.array([-2.6, dr.top + 0.3, 0]), sh, rmax=2.6, start=0.1, span=1.0, ref=0.15)
        st = K.stick(1.8).rotate(PI + 0.5).move_to([-0.6, dr.top + 1.0, 0])
        self.say("북채로 북을 치면 “둥~” 소리가 나요", "이번에는 북채로 작은북을 쳐 봐요. 북 위에는 좁쌀을 올려 두었어요.")
        self.play(FadeIn(dr), FadeIn(st), run_time=0.5)
        self.add(rr)
        self.play(st.animate.shift(LEFT * 0.4 + DOWN * 0.4), run_time=0.25)
        self.play(st.animate.shift(RIGHT * 0.4 + UP * 0.4), sh.amp.animate.set_value(0.2), run_time=0.25)
        t1 = tag("좁쌀이 통통 튀어 올라요", ORANGE, 40).move_to([3.3, 1.2, 0])
        t2 = T("→ 북의 막이 떨리고 있어요", 40, INK).move_to([3.3, 0.2, 0])
        self.say(f"좁쌀이 통통 튀어 올라요 — 북의 막이 {o('떨려요')}",
                 "“둥~” 소리가 나고, 북 위의 좁쌀이 통통 튀어 올라요. 북의 막이 떨리고 있다는 뜻이에요.")
        self.play(FadeIn(t1), run_time=0.4)
        self.play(FadeIn(t2), run_time=0.4)
        self.settle()
        hnd = K.hand(0.9).rotate(PI).move_to([-2.6, dr.top + 0.55, 0])
        t3 = T("떨림도, 좁쌀도, 소리도 멈춰요", 40, RED).move_to([3.3, -0.8, 0])
        self.say("손바닥으로 북을 누르면?", "소리가 날 때 손바닥으로 북을 누르면 어떻게 될까요?")
        self.play(FadeIn(hnd, shift=DOWN * 0.4), sh.amp.animate.set_value(0.0), run_time=0.6)
        self.say(f"막의 떨림이 멈추고, {r('소리도 멈춰요')}", "막의 떨림이 멈추고, 좁쌀도 멈추고, 소리도 멈춰요.")
        self.play(FadeIn(t3), run_time=0.4)
        self.settle()
        self.clear()

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        items = ["목", "고무줄", "소리굽쇠", "기타 줄", "북의 막"]
        chips = VGroup(*[tag(s_, BLUE, 38) for s_ in items]).arrange(RIGHT, buff=0.35).move_to([0, 2.0, 0])
        arrow = T("↓", 60, ORANGE).move_to([0, 0.95, 0])
        main = M(f"소리가 나는 물체는 {o('떨림')}이 있습니다", 56).move_to([0, -0.05, 0])
        self.say("소리가 날 때 모두 무엇이 있었나요?", "오늘 관찰한 물체들을 떠올려 봐요. 소리가 날 때 모두 무엇이 있었나요?")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in chips], lag_ratio=0.2), run_time=1.2)
        self.say(f"소리가 나는 물체는 {o('떨림')}이 있어요", "소리가 나는 물체는 모두 떨림이 있어요.")
        self.play(FadeIn(arrow), FadeIn(main, scale=0.9), run_time=0.6)
        self.settle()
        q = T("기타 줄에 손을 대서 떨림을 멈추면 소리는?", 40, INK).move_to([0, -1.25, 0])
        self.say("생각+ 떨림을 멈추면 소리는 어떻게 될까요?", "소리가 나는 기타 줄에 손을 대서 떨림을 멈추면 소리는 어떻게 될까요?")
        self.play(FadeIn(q), run_time=0.4)
        self.pause_screen(4, "떨림을 멈추면 소리는?")
        a = T("떨림이 멈추므로 소리가 나지 않아요", 44, GREEN).move_to([0, -1.25, 0])
        self.say(f"떨림이 멈추므로 {g('소리가 나지 않아요')}", "떨림이 멈추므로 소리가 나지 않아요.")
        self.play(FadeOut(q), FadeIn(a), run_time=0.5)
        self.settle()
        self.clear()
