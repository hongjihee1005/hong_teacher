"""「과학 원리 돋보기」 3학년 31화 — 큰 소리와 작은 소리 (3-2 3단원 소리의 성질 3차시, 화 코드 3-2-3-b)

바탕: grade3/science/sem2/u3-2.html — 도입(운동회 응원·멀리 있는 친구 부를 때 큰 소리 / 도서관·아기가 잘 때 작은 소리),
실험 1 글로켄슈필(채를 드는 높이 = 치는 세기, 세게 4~5 → 측정기 값이 크고 음판이 크게 떨림 / 약하게 1~2 → 작게),
실험 2 고무줄(세게 튕기면 크게 떨리고 큰 소리), 두 실험의 공통점, 다른 탐구(작은북 위 스타이로폼 공이 높이/조금 튐,
스피커 음량), 한눈에 쏙 '소리의 크고 작은 정도 = 소리의 세기', 생각+ 트라이앵글(큰 소리는 세게, 작은 소리는 약하게).
측정기 값은 앱이 채 높이로 계산하는 가상 값이라 수를 쓰지 않고 바늘로만 보여 줌.
최종: ./make_final.sh s3ep31
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, LaggedStart,
                   ValueTracker, SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S3Ep31(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 31
    EP_TITLE = "큰 소리와 작은 소리"
    OUT_DIR = HERE

    def construct(self):
        self.shakes = []
        self.opening()
        self.intro()
        self.glocken()
        self.band()
        self.common()
        self.other()
        self.summary()
        self.closing(f"소리의 크고 작은 정도를 {o('소리의 세기')}라고 해요\n세게 치면 {g('큰 소리')}, 약하게 치면 {g('작은 소리')}가 나요",
                     next_preview="3학년 32화 · 높은 소리와 낮은 소리")
        self.wait(0.5)

    def shake(self, amp=0.0, speed=7.0, decay=0.0):
        sh = K.Shake(amp).live(self, speed, decay)
        self.shakes.append(sh)
        return sh

    def clear(self):
        for sh in self.shakes:
            sh.stop(self)
        self.shakes = []
        for m in list(self.mobjects):
            m.clear_updaters() if hasattr(m, "_bar_jit") else None
        clear_stage(self)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sits = ["운동회에서 친구를 응원할 때", "도서관에서 친구에게 말할 때", "아기가 자고 있을 때", "멀리 있는 친구를 부를 때"]
        ans = ["큰", "작은", "작은", "큰"]
        rows = VGroup()
        for i, s_ in enumerate(sits):
            rows.add(T(s_, 40, INK).move_to([-2.0, 2.0 - i * 1.05, 0]))
        self.say("큰 소리와 작은 소리는 언제 낼까요?", "큰 소리와 작은 소리는 언제 낼까요? 알맞은 소리의 크기를 골라 봐요.")
        self.play(LaggedStart(*[FadeIn(x, shift=RIGHT * 0.2) for x in rows], lag_ratio=0.25), run_time=1.2)
        self.pause_screen(5, "큰 소리일까요, 작은 소리일까요?")
        tags = VGroup()
        for i, a in enumerate(ans):
            col = ORANGE if a == "큰" else BLUE
            tags.add(tag(f"{a} 소리", col, 40).move_to([3.9, 2.0 - i * 1.05, 0]))
        self.say(f"응원할 때·멀리 부를 때는 {o('큰 소리')}, 도서관·아기 곁에서는 {b_('작은 소리')}",
                 "응원할 때와 멀리 있는 친구를 부를 때는 큰 소리, 도서관에서 말할 때와 아기가 자고 있을 때는 작은 소리를 내요.")
        self.play(LaggedStart(*[FadeIn(t_, scale=0.8) for t_ in tags], lag_ratio=0.25), run_time=1.2)
        self.settle()
        self.say("큰 소리와 작은 소리를 낼 때 떨림은 어떻게 다를까요?",
                 "상황에 따라 소리의 크기를 다르게 내요. 큰 소리와 작은 소리를 낼 때 떨림은 어떻게 다를까요?")
        self.settle()
        self.clear()

    # ── 실험 1: 글로켄슈필 ──
    def glocken(self):
        self.section("글로켄슈필")
        sh = self.shake(0.0, speed=10, decay=0.5)
        gl = K.glock(8, x=-2.4, y=0.1, w=6.0, hmax=2.6, hmin=1.4)
        bar = gl.bars[3]
        c0 = bar.get_center().copy()
        bar.add_updater(lambda m: m.move_to(c0 + UP * sh.val()))
        bar._bar_jit = True
        mt = K.meter(ValueTracker(0), x=4.6, y=0.3, s=1.1, show_num=False)
        rr = K.rings(c0 + UP * 1.6, sh, rmax=1.6, start=PI / 2 - 0.6, span=1.2, ref=0.12)
        self.say("글로켄슈필 음판을 채로 쳐서 소리를 내요",
                 "글로켄슈필은 금속 음판을 채로 쳐서 소리를 내는 악기예요. 소리 측정기로 소리의 크기를 재 봐요.")
        self.play(FadeIn(gl), FadeIn(mt), run_time=0.6)
        self.add(rr)
        ml = K.mallet(1.6).move_to(c0 + UP * 2.2 + RIGHT * 0.6)
        self.play(FadeIn(ml), run_time=0.3)
        hl = T("채를 높이 들어 세게", 38, ORANGE).move_to([4.5, 2.45, 0])
        self.say(f"채를 높이 들어 {o('세게')} 쳐요", "먼저 채를 높이 들었다가 세게 쳐 봐요.")
        self.play(FadeIn(hl), ml.animate.shift(UP * 0.5 + RIGHT * 0.3), run_time=0.5)
        self.play(ml.animate.move_to(c0 + UP * 1.35 + RIGHT * 0.55), run_time=0.2)
        sh.amp.set_value(0.14)
        self.play(ml.animate.shift(UP * 0.9 + RIGHT * 0.4), mt.val.animate.set_value(85), run_time=0.4)
        lab1 = tag("큰 소리 · 음판이 크게 떨려요", ORANGE, 36).move_to([1.8, -2.0, 0])
        self.say(f"측정기 바늘이 많이 움직이고, 음판이 {o('크게 떨려요')}",
                 "큰 소리가 나요. 측정기 바늘이 많이 움직이고, 음판이 크게 떨려요.")
        self.play(FadeIn(lab1), run_time=0.4)
        self.settle()
        self.play(mt.val.animate.set_value(0), FadeOut(lab1), FadeOut(hl), run_time=0.5)
        sh.amp.set_value(0.0)
        hl2 = T("채를 낮게 들어 약하게", 38, BLUE).move_to([4.5, 2.45, 0])
        self.say(f"이번에는 채를 낮게 들어 {b_('약하게')} 쳐요", "이번에는 채를 조금만 들었다가 약하게 쳐 봐요.")
        self.play(FadeIn(hl2), run_time=0.4)
        self.pause_screen(4, "약하게 치면 어떻게 될까요?")
        self.play(ml.animate.move_to(c0 + UP * 1.35 + RIGHT * 0.55), run_time=0.3)
        sh.amp.set_value(0.035)
        self.play(ml.animate.shift(UP * 0.4 + RIGHT * 0.2), mt.val.animate.set_value(30), run_time=0.4)
        lab2 = tag("작은 소리 · 음판이 작게 떨려요", BLUE, 36).move_to([1.8, -2.0, 0])
        self.say(f"바늘이 조금 움직이고, 음판이 {b_('작게 떨려요')}",
                 "작은 소리가 나요. 측정기 바늘이 조금만 움직이고, 음판이 작게 떨려요.")
        self.play(FadeIn(lab2), run_time=0.4)
        self.settle()
        bar.clear_updaters()
        self.clear()
        tb = K.table([["", "세게 칠 때", "약하게 칠 때"],
                      ["소리의 크기", o("큰 소리"), b_("작은 소리")],
                      ["측정기 값", "커요", "작아요"],
                      ["음판의 떨림", o("크게 떨려요"), b_("작게 떨려요")]],
                     [3.2, 3.8, 3.8], h=0.95, size=36, x=0, y=0.3)
        self.say(f"음판을 세게 칠수록 {o('크게 떨리고')} 큰 소리가 나요",
                 "결과를 정리해요. 음판을 세게 칠수록 음판이 크게 떨리고 큰 소리가 나요.")
        self.play(FadeIn(tb), run_time=0.6)
        self.settle()
        warn = T("실제로는 주변을 조용히 하고, 너무 세게 치지 않아요", 30, RED).move_to([0, -2.1, 0])
        self.play(FadeIn(warn), run_time=0.3)
        self.wait(1.5)
        self.clear()

    # ── 실험 2: 고무줄 ──
    def band(self):
        self.section("고무줄")
        sh = self.shake(0.0, speed=7, decay=0.0)
        bx = K.rubber_box(sh, w=5.0, h=1.6, x=-2.0, y=-0.9)
        mt = K.meter(ValueTracker(0), x=4.6, y=0.3, s=1.1, show_num=False)
        rr = K.rings(bx.mid + UP * 0.4, sh, rmax=2.4, start=PI / 2 - 0.7, span=1.4, ref=0.45)
        self.say("고무줄을 당기는 높이를 바꾸며 튕겨 봐요", "이번에는 상자에 건 고무줄을 당기는 높이를 바꾸며 튕겨 봐요.")
        self.play(FadeIn(bx), FadeIn(mt), run_time=0.5)
        self.add(rr)
        t1 = tag("세게 튕길 때", ORANGE, 38).move_to([-2.0, 2.4, 0])
        self.say(f"{o('세게')} 튕기면 고무줄이 {o('크게 떨리고')} 큰 소리가 나요",
                 "고무줄을 높이 당겼다가 세게 튕기면, 고무줄이 크게 떨리고 큰 소리가 나요.")
        self.play(FadeIn(t1), sh.amp.animate.set_value(0.55), mt.val.animate.set_value(80), run_time=0.5)
        self.settle()
        t2 = tag("약하게 튕길 때", BLUE, 38).move_to([-2.0, 2.4, 0])
        self.say(f"{b_('약하게')} 튕기면 {b_('작게 떨리고')} 작은 소리가 나요",
                 "조금만 당겼다가 약하게 튕기면, 고무줄이 작게 떨리고 작은 소리가 나요.")
        self.play(FadeOut(t1), FadeIn(t2), sh.amp.animate.set_value(0.13), mt.val.animate.set_value(28), run_time=0.6)
        self.settle()
        self.clear()

    # ── 공통점 ──
    def common(self):
        self.section("공통점")
        q = T("두 실험의 공통점은 무엇일까요?", 50, INK).move_to([0, 1.6, 0])
        self.say("글로켄슈필과 고무줄, 두 실험의 공통점은?", "글로켄슈필과 고무줄, 두 실험의 공통점은 무엇일까요?")
        self.play(FadeIn(q), run_time=0.4)
        self.pause_screen(5, "두 실험의 공통점은?")
        a1 = M(f"큰 소리가 날 때는 물체가 {o('크게')} 떨리고", 46).move_to([0, 0.3, 0])
        a2 = M(f"작은 소리가 날 때는 물체가 {b_('작게')} 떨려요", 46).move_to([0, -0.7, 0])
        self.say(f"큰 소리 → {o('크게')} 떨림, 작은 소리 → {b_('작게')} 떨림",
                 "큰 소리가 날 때는 물체가 크게 떨리고, 작은 소리가 날 때는 물체가 작게 떨려요.")
        self.play(FadeIn(a1, shift=UP * 0.2), run_time=0.5)
        self.play(FadeIn(a2, shift=UP * 0.2), run_time=0.5)
        self.settle()
        self.clear()

    # ── 다른 탐구: 작은북과 스피커 ──
    def other(self):
        self.section("다른 탐구")
        sh = self.shake(0.0, speed=7, decay=0.0)
        dr = K.drum(sh, w=3.4, x=-3.6, y=-1.2, grains=5, grain_col="#FFFFFF", grain_r=0.13, jump=4.0)
        tl = T("작은북 위 스타이로폼 공", 34, INK).move_to([-3.6, -2.35, 0])
        self.say("작은북 위에 스타이로폼 공을 올리고 쳐 봐요", "같은 주제의 다른 탐구예요. 작은북 위에 스타이로폼 공을 올리고 쳐 봐요.")
        self.play(FadeIn(dr), FadeIn(tl), run_time=0.5)
        a = tag("세게 치면 공이 높이 튀어요", ORANGE, 34).move_to([-3.4, 1.9, 0])
        self.say(f"{o('세게')} 치면 큰 소리, 공이 {o('높이')} 튀어 올라요",
                 "세게 치면 큰 소리가 나고, 스타이로폼 공이 높이 튀어 올라요. 북이 크게 떨려요.")
        self.play(sh.amp.animate.set_value(0.38), FadeIn(a), run_time=0.4)
        self.settle()
        b = tag("약하게 치면 공이 조금만 튀어요", BLUE, 34).move_to([-3.4, 1.9, 0])
        self.say(f"{b_('약하게')} 치면 작은 소리, 공이 {b_('조금만')} 튀어요",
                 "약하게 치면 작은 소리가 나고, 공이 조금만 튀어요. 북이 작게 떨려요.")
        self.play(sh.amp.animate.set_value(0.07), FadeOut(a), FadeIn(b), run_time=0.5)
        self.settle()
        # 스피커
        sh2 = self.shake(0.0, speed=9, decay=0.0)
        sp = K.speaker(1.2, 2.6, -0.3)
        cone = sp.cone
        cc = cone.get_center().copy()
        w0 = cone.width
        cone.add_updater(lambda m: m.set(width=w0 * (1 + 0.6 * abs(sh2.val()))).move_to(cc))
        rr = K.rings(sp.get_right() + LEFT * 0.2 + DOWN * 0.3, sh2, rmax=2.6, start=-0.6, span=1.2, ref=0.3)
        vol = T("음량", 34, INK).move_to([2.6, 1.9, 0])
        self.say("스피커의 음량을 크게, 작게 바꿔 봐요", "스피커의 음량을 가장 크게, 가장 작게 바꿔 봐요. 스피커의 떨림이 어떻게 달라질까요?")
        self.play(FadeIn(sp), FadeIn(vol), run_time=0.5)
        self.add(rr)
        self.play(sh2.amp.animate.set_value(0.4), run_time=0.4)
        self.wait(1.5)
        self.play(sh2.amp.animate.set_value(0.08), run_time=0.8)
        self.say(f"북도 스피커도 큰 소리가 날 때 {o('크게 떨려요')}",
                 "북도 스피커도 큰 소리가 날 때 크게 떨리고, 작은 소리가 날 때 작게 떨려요.")
        self.play(sh2.amp.animate.set_value(0.4), run_time=0.6)
        warn = T("스피커 소리는 너무 크게 하지 않아요", 30, RED).move_to([2.8, -2.2, 0])
        self.play(FadeIn(warn), run_time=0.3)
        self.settle()
        cone.clear_updaters()
        self.clear()

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        main = M(f"소리의 크고 작은 정도를 {o('소리의 세기')}라고 해요", 52).move_to([0, 1.8, 0])
        self.say(f"소리의 크고 작은 정도 = {o('소리의 세기')}", "소리의 크고 작은 정도를 소리의 세기라고 해요.")
        self.play(FadeIn(main, scale=0.9), run_time=0.6)
        self.settle()
        tri = K.triangle_inst(1.0).move_to([-4.0, -0.6, 0])
        q = T("트라이앵글로 큰 소리와 작은 소리를 내려면?", 38, INK).move_to([1.4, 0.3, 0])
        self.say("생각+ 트라이앵글로 큰 소리와 작은 소리를 내려면?", "트라이앵글로 큰 소리와 작은 소리를 내려면 어떻게 쳐야 할까요?")
        self.play(FadeIn(tri), FadeIn(q), run_time=0.5)
        self.pause_screen(4, "어떻게 쳐야 할까요?")
        a = VGroup(M(f"큰 소리는 {o('세게')} 치고,", 44), M(f"작은 소리는 {b_('약하게')} 쳐요", 44)).arrange(DOWN, buff=0.25)
        a.move_to([1.4, -1.0, 0])
        self.say(f"큰 소리는 {o('세게')}, 작은 소리는 {b_('약하게')} 쳐요",
                 "큰 소리는 세게 치고, 작은 소리는 약하게 쳐요. 세게 치면 크게 떨려 큰 소리가 나요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.5)
        self.settle()
        self.clear()


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'
