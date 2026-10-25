"""「과학 원리 돋보기」 3학년 32화 — 높은 소리와 낮은 소리 (3-2 3단원 소리의 성질 4차시(+5차시 정리), 화 코드 3-2-3-c)

바탕: grade3/science/sem2/u3-3.html — 도입(글로켄슈필 음판은 왜 길이가 다를까? 짧은 음판 → 더 높은 소리),
실험 1 칼림바(가장 짧은 건반(양쪽 끝) → 높은 소리, 가장 긴 건반(가운데) → 낮은 소리, 소리 높이 측정기),
실험 2 우쿨렐레(누르지 않기(가장 길게) → 낮은 소리, 절반 길이 → 높은 소리, '줄을 짧게 잡을수록 높은 소리'),
다른 탐구 팬파이프·붐웨커(긴 관 낮은 소리, 짧은 관 높은 소리 → '물체의 길이가 짧을수록 높은 소리'),
생각 바로잡기(높은 소리가 큰 소리는 아님: 모기 소리는 높지만 작은 소리, 천둥소리는 낮지만 큰 소리),
한눈에 쏙 '소리의 높고 낮은 정도 = 소리의 높낮이', 생각+ 플라스틱 자를 더 길게 내밀면 더 낮은 소리.
u3-4.html(세기와 높낮이가 다른 소리를 내 보자) 한눈에 쏙 표(세기 = 물체가 떨리는 크기 / 높낮이 = 물체의 길이)와
💭 '우쿨렐레로 높은 소리를 크게 내려면 → 줄을 짧게 잡고 세게 튕겨요'를 끝에 덧붙임(그 차시는 따로 편이 없음).
소리 높이 측정기의 계이름은 앱에서 그때그때 정해져 쓰지 않음.
최종: ./make_final.sh s3ep32
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, LaggedStart,
                   ValueTracker, always_redraw, Dot, Polygon, Ellipse, RoundedRectangle, SurroundingRectangle, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


def pitch_meter(val, x=5.0, y=0.3, h=3.2):
    """소리 높이 측정기: 세로 막대, 위 '높음' 아래 '낮음', val(0~1) 높이에 표시"""
    plate = K.R(1.9, h + 1.3, "#1E1E2A", x, y, stroke=INK, sw=3, r=0.2)
    col = K.R(0.38, h, "#3A3A4A", x - 0.25, y - 0.1, stroke="#3A3A4A", sw=0, r=0.15)
    hi = T("높음", 26, "#F2C230").move_to([x + 0.45, y - 0.1 + h / 2 - 0.15, 0])
    lo = T("낮음", 26, "#8FB8DE").move_to([x + 0.45, y - 0.1 - h / 2 + 0.15, 0])
    lab = T("소리 높이", 24, "#DDDDE6").move_to([x, y + h / 2 + 0.38, 0])

    def mark():
        v = val.get_value()
        if v < 0:
            return VGroup()
        yy = y - 0.1 - h / 2 + 0.2 + v * (h - 0.4)
        return VGroup(K.R(0.6, 0.22, ORANGE, x - 0.25, yy, stroke=PAPER, sw=2, r=0.08))
    return VGroup(plate, col, hi, lo, lab, always_redraw(mark))


def mosquito(s=1.0):
    body = Ellipse(width=0.9, height=0.22, fill_color="#5A5A64", fill_opacity=1, stroke_color=INK, stroke_width=3)
    head = Dot([-0.52, 0.02, 0], radius=0.12, color="#5A5A64")
    nose = Line([-0.62, 0.0, 0], [-0.95, -0.12, 0], stroke_color=INK, stroke_width=3)
    w1 = Ellipse(width=0.55, height=0.28, fill_color="#DDEBF5", fill_opacity=0.8, stroke_color=SOFT, stroke_width=2).move_to([0.05, 0.28, 0]).rotate(0.4)
    w2 = Ellipse(width=0.55, height=0.28, fill_color="#DDEBF5", fill_opacity=0.8, stroke_color=SOFT, stroke_width=2).move_to([0.25, 0.22, 0]).rotate(0.7)
    legs = VGroup(*[Line([x, -0.08, 0], [x - 0.15, -0.45, 0], stroke_color=INK, stroke_width=2) for x in (-0.25, 0.0, 0.25)])
    return VGroup(legs, w1, w2, body, head, nose).scale(s)


def thunder(s=1.0):
    c = VGroup(*[Ellipse(width=w, height=h, fill_color="#9AA3AC", fill_opacity=1, stroke_color="#6F7C88", stroke_width=3).move_to([x, y, 0])
                 for w, h, x, y in ((1.2, 0.8, -0.5, 0), (1.4, 1.0, 0.2, 0.15), (1.1, 0.7, 0.8, -0.05))])
    bolt = Polygon([0.1, -0.2, 0], [-0.25, -0.95, 0], [0.05, -0.9, 0], [-0.2, -1.6, 0], [0.45, -0.7, 0], [0.15, -0.75, 0], [0.4, -0.2, 0],
                   fill_color="#F2C230", fill_opacity=1, stroke_color=ORANGE, stroke_width=3)
    return VGroup(bolt, c).scale(s)


class S3Ep32(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 32
    EP_TITLE = "높은 소리와 낮은 소리"
    OUT_DIR = HERE

    def construct(self):
        self.shakes = []
        self.opening()
        self.intro()
        self.kalimba_part()
        self.ukulele_part()
        self.pipes()
        self.myth()
        self.summary()
        self.both()
        self.closing(f"소리의 높고 낮은 정도를 {o('소리의 높낮이')}라고 해요\n물체의 길이가 {g('짧을수록 높은 소리')}, {g('길수록 낮은 소리')}가 나요",
                     next_preview="3학년 33화 · 소리는 무엇을 통해 전달될까?")
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

    def hit(self, sh, bar, amp=0.08):
        """음판·건반 하나를 떨리게(위아래로)"""
        c0 = bar.get_center().copy()
        bar.add_updater(lambda m: m.move_to(c0 + UP * sh.val()))
        sh.amp.set_value(amp)
        return bar

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sh = self.shake(0.0, speed=10, decay=0.6)
        gl = K.glock(8, x=-1.6, y=0.3, w=6.6, hmax=3.0, hmin=1.4, labels=True)
        pv = ValueTracker(-1)
        pm = pitch_meter(pv, x=4.9, y=0.3)
        self.say("글로켄슈필의 음판은 왜 길이가 다를까요?", "글로켄슈필의 음판은 왜 길이가 다를까요?")
        self.play(FadeIn(gl), run_time=0.6)
        self.play(Indicate(gl.bars[0], scale_factor=1.05), Indicate(gl.bars[7], scale_factor=1.1), run_time=0.9)
        self.play(FadeIn(pm), run_time=0.4)
        lo = tag("긴 음판", BLUE, 34).next_to(gl.bars[0], DOWN, buff=0.3)
        self.say("긴 음판부터 쳐 봐요", "짧은 음판과 긴 음판의 소리를 비교해요. 먼저 가장 긴 음판을 쳐 봐요.")
        self.play(FadeIn(lo), run_time=0.3)
        self.hit(sh, gl.bars[0], 0.07)
        self.play(pv.animate.set_value(0.12), run_time=0.5)
        self.settle()
        hi = tag("짧은 음판", ORANGE, 34).next_to(gl.bars[7], DOWN, buff=0.3)
        self.say("짧은 음판을 칠 때 소리는 어떤가요?", "이번에는 가장 짧은 음판을 쳐요. 긴 음판을 칠 때와 비교해 소리가 어떤가요?")
        self.play(FadeIn(hi), run_time=0.3)
        self.pause_screen(4, "더 높을까요, 더 낮을까요?")
        self.hit(sh, gl.bars[7], 0.07)
        self.play(pv.animate.set_value(0.9), run_time=0.5)
        self.say(f"짧은 음판을 칠수록 {o('높은 소리')}가 나요",
                 "더 높은 소리가 나요. 짧은 음판을 칠수록 높은 소리가 나요. 음판의 길이에 따라 소리의 높낮이가 달라져요.")
        self.settle()
        for b in gl.bars:
            b.clear_updaters()
        self.clear()

    # ── 실험 1: 칼림바 ──
    def kalimba_part(self):
        self.section("칼림바")
        sh = self.shake(0.0, speed=10, decay=0.6)
        kb = K.kalimba(x=-2.0, y=-0.4, w=4.2, n=9)
        pv = ValueTracker(-1)
        pm = pitch_meter(pv, x=4.6, y=0.3)
        self.say("칼림바는 금속 건반을 손끝으로 튕겨요", "칼림바는 금속 건반을 손끝으로 튕겨 소리를 내는 악기예요. 건반의 길이가 서로 달라요.")
        self.play(FadeIn(kb), FadeIn(pm), run_time=0.6)
        mid = kb.keys[4]
        end = kb.keys[0]
        t1 = tag("가장 긴 건반(가운데)", BLUE, 32).move_to([-2.0, 2.65, 0])
        self.say(f"가운데 가장 긴 건반 → {b_('낮은 소리')}", "가운데에 있는 가장 긴 건반을 튕기면 낮은 소리가 나요.")
        self.play(FadeIn(t1), Indicate(mid, color=BLUE), run_time=0.6)
        self.hit(sh, mid, 0.05)
        self.play(pv.animate.set_value(0.1), run_time=0.5)
        self.settle()
        t2 = tag("가장 짧은 건반(양쪽 끝)", ORANGE, 32).move_to([-2.0, 2.65, 0])
        self.say(f"양쪽 끝 가장 짧은 건반 → {o('높은 소리')}", "양쪽 끝에 있는 가장 짧은 건반을 튕기면 높은 소리가 나요.")
        self.play(FadeOut(t1), FadeIn(t2), Indicate(end, color=ORANGE), run_time=0.6)
        self.hit(sh, end, 0.05)
        self.play(pv.animate.set_value(0.92), run_time=0.5)
        self.settle()
        for k in kb.keys:
            k.clear_updaters()
        self.clear()

    # ── 실험 2: 우쿨렐레 ──
    def ukulele_part(self):
        self.section("우쿨렐레")
        sh = self.shake(0.0, speed=9, decay=0.0)
        uk = K.ukulele(sh, x=-1.4, y=0.0, w=8.6, press=0.0)
        pv = ValueTracker(-1)
        pm = pitch_meter(pv, x=5.6, y=0.3, h=2.8)
        self.say("우쿨렐레 줄을 누르면 떨리는 줄의 길이가 달라져요",
                 "우쿨렐레 줄을 손가락으로 누르면 떨리는 줄의 길이가 달라져요. 떨리는 부분은 노란색으로 보여요.")
        self.play(FadeIn(uk), FadeIn(pm), run_time=0.6)
        t1 = tag("누르지 않기 — 가장 길게", BLUE, 34).move_to([-1.4, 2.0, 0])
        self.say(f"누르지 않고 튕기면 {b_('낮은 소리')}", "줄을 누르지 않고 가장 길게 튕기면 낮은 소리가 나요.")
        self.play(FadeIn(t1), sh.amp.animate.set_value(0.18), pv.animate.set_value(0.15), run_time=0.5)
        self.settle()
        self.play(sh.amp.animate.set_value(0.0), run_time=0.3)
        t2 = tag("절반 길이를 누르기", ORANGE, 34).move_to([-1.4, 2.0, 0])
        self.say("이번에는 줄의 절반 길이를 눌러요", "이번에는 줄의 가운데를 눌러, 떨리는 줄의 길이를 처음의 절반으로 줄여 봐요.")
        self.play(FadeOut(t1), FadeIn(t2), uk.press_tracker.animate.set_value(0.5), run_time=0.8)
        self.pause_screen(4, "소리는 어떻게 달라질까요?")
        self.play(sh.amp.animate.set_value(0.12), pv.animate.set_value(0.8), run_time=0.5)
        self.say(f"줄을 짧게 잡을수록 {o('높은 소리')}가 나요", "더 높은 소리가 나요. 줄을 짧게 잡고 튕길수록 높은 소리가 나요.")
        self.settle()
        self.clear()

    # ── 다른 탐구: 팬파이프와 붐웨커 ──
    def pipes(self):
        self.section("다른 탐구")
        pp = K.panpipe(x=-3.4, y=0.3, n=8, w=3.6, hmax=3.0, hmin=1.0)
        bw = K.boomwhacker(x=2.8, y=0.3, n=5, gap=0.85, hmax=3.0, hmin=1.2)
        l1 = T("팬파이프 — 입으로 불어요", 32, INK).move_to([-3.4, -1.75, 0])
        l2 = T("붐웨커 — 가볍게 두드려요", 32, INK).move_to([2.8, -1.75, 0])
        self.say("팬파이프와 붐웨커도 길이가 다른 관이 있어요",
                 "팬파이프는 길이가 다른 관을 입으로 불고, 붐웨커는 길이가 다른 관을 가볍게 두드려요.")
        self.play(FadeIn(pp), FadeIn(bw), FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.settle()
        self.say(f"긴 관은 {b_('낮은 소리')}, 짧은 관은 {o('높은 소리')}",
                 "두 악기 모두 긴 관은 낮은 소리, 짧은 관은 높은 소리가 나요.")
        self.play(Indicate(pp.tubes[0], color=BLUE), Indicate(bw[0], color=BLUE), run_time=0.8)
        self.play(Indicate(pp.tubes[7], color=ORANGE), Indicate(bw[4], color=ORANGE), run_time=0.8)
        self.settle()
        main = M(f"물체의 길이가 {o('짧을수록')} 높은 소리가 나요", 46).move_to([0, 2.55, 0])
        self.say(f"물체의 길이가 {o('짧을수록')} 높은 소리가 나요", "물체의 길이가 짧을수록 높은 소리가 나요.")
        self.play(FadeIn(main, shift=DOWN * 0.2), run_time=0.5)
        self.settle()
        self.clear()

    # ── 생각 바로잡기 ──
    def myth(self):
        self.section("생각 바로잡기")
        q = T("높은 소리는 큰 소리일까?", 56, RED).move_to([0.4, 2.55, 0])
        self.say("높은 소리는 큰 소리일까요?", "높은 소리는 큰 소리일까요?")
        self.play(FadeIn(q, scale=0.9), run_time=0.5)
        self.pause_screen(4, "높은 소리 = 큰 소리?")
        mq = mosquito(1.6).move_to([-3.4, 0.5, 0])
        th = thunder(1.05).move_to([3.0, 0.45, 0])
        l1 = M(f"모기 소리: {o('높지만')} {b_('작은')} 소리", 38).move_to([-3.3, -1.0, 0])
        l2 = M(f"천둥소리: {b_('낮지만')} {o('큰')} 소리", 38).move_to([3.0, -1.0, 0])
        self.say(f"모기 소리는 {o('높지만 작은')} 소리예요", "아니에요. 모기 소리는 높지만 작은 소리예요.")
        self.play(FadeIn(mq), FadeIn(l1), run_time=0.5)
        self.play(mq.animate.shift(RIGHT * 0.4 + UP * 0.2), run_time=0.4)
        self.play(mq.animate.shift(LEFT * 0.4 + DOWN * 0.2), run_time=0.4)
        self.say(f"천둥소리는 {b_('낮지만 큰')} 소리예요", "천둥소리는 낮지만 큰 소리예요.")
        self.play(FadeIn(th), FadeIn(l2), run_time=0.5)
        self.settle()
        a = T("소리의 높낮이와 세기는 서로 달라요", 44, GREEN).move_to([0, -2.0, 0])
        self.say(f"소리의 {o('높낮이')}와 {o('세기')}는 서로 달라요", "높은 소리가 큰 소리는 아니에요. 소리의 높낮이와 세기는 서로 달라요.")
        self.play(FadeIn(a), run_time=0.4)
        self.settle()
        self.clear()

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        main = M(f"소리의 높고 낮은 정도를 {o('소리의 높낮이')}라고 해요", 50).move_to([0, 2.2, 0])
        self.say(f"소리의 높고 낮은 정도 = {o('소리의 높낮이')}", "소리의 높고 낮은 정도를 소리의 높낮이라고 해요.")
        self.play(FadeIn(main, scale=0.9), run_time=0.6)
        self.settle()
        top = -0.2
        desk = K.R(4.6, 1.2, K.WOOD, -3.8, top - 0.6, stroke=K.WOOD_D, sw=4, r=0.05)
        ruler = K.R(4.0, 0.22, "#F7E7A6", -1.0, top + 0.11, stroke=INK, sw=3, r=0.02)
        hand_ = K.hand(0.6).rotate(PI).move_to([-1.9, top + 0.5, 0])
        q = T("자를 더 길게 내밀고 튕기면?", 40, INK).move_to([3.6, 1.2, 0])
        self.say("생각+ 책상 모서리의 자를 더 길게 내밀면?",
                 "책상 모서리에 내민 플라스틱 자를 더 길게 내밀고 튕기면 소리가 어떻게 달라질까요?")
        self.play(FadeIn(desk), FadeIn(ruler), FadeIn(hand_), FadeIn(q), run_time=0.6)
        self.play(ruler.animate.shift(RIGHT * 0.9), run_time=0.6)
        self.pause_screen(4, "소리는 어떻게 달라질까요?")
        a = T("더 낮은 소리가 나요", 46, GREEN).move_to([3.6, -1.2, 0])
        self.say(f"떨리는 부분이 길어져 {g('더 낮은 소리')}가 나요", "더 낮은 소리가 나요. 길이가 길수록 낮은 소리가 나기 때문이에요.")
        self.play(FadeIn(a), run_time=0.4)
        self.settle()
        self.clear()

    # ── 세기와 높낮이 함께 (u3-4 정리) ──
    def both(self):
        self.section("세기와 높낮이")
        tb = K.table([["", "세기", "높낮이"],
                      ["무엇이 달라지나요?", "물체가 떨리는 크기", "물체의 길이"],
                      ["큰 · 높은 소리", o("세게 연주해요"), o("짧은 부분을 연주해요")],
                      ["작은 · 낮은 소리", b_("약하게 연주해요"), b_("긴 부분을 연주해요")]],
                     [3.6, 4.2, 4.6], h=0.92, size=34, x=0, y=0.85)
        self.say("세기와 높낮이를 함께 정리해요",
                 "세기와 높낮이를 함께 정리해요. 세기는 물체가 떨리는 크기, 높낮이는 물체의 길이에 따라 달라져요.")
        self.play(FadeIn(tb), run_time=0.6)
        self.settle()
        q = T("우쿨렐레로 높은 소리를 크게 내려면?", 40, INK).move_to([0, -1.95, 0])
        self.say("우쿨렐레로 높은 소리를 크게 내려면?", "그럼 우쿨렐레로 높은 소리를 크게 내려면 어떻게 할까요?")
        self.play(FadeIn(q), run_time=0.4)
        self.pause_screen(4, "높은 소리를 크게 내려면?")
        a = M(f"줄을 {o('짧게')} 잡고 {o('세게')} 튕겨요", 46, GREEN).move_to([0, -1.95, 0])
        self.say(f"줄을 {o('짧게')} 잡고 {o('세게')} 튕겨요", "줄을 짧게 잡고 세게 튕겨요. 높낮이는 줄의 길이로, 세기는 튕기는 힘으로 정해요.")
        self.play(FadeOut(q), FadeIn(a), run_time=0.5)
        self.settle()
        self.clear()
