"""「과학 원리 돋보기」 3학년 34화 — 소음을 줄이려면? (3-2 3단원 소리의 성질 8차시, 화 코드 3-2-3-e)

바탕: grade3/science/sem2/u3-6.html — 도입(소음: 다른 사람을 불쾌하게 하거나 해를 끼칠 수 있는 시끄러운 소리,
소음을 들으면 스트레스·집중이 어려움·다른 곳으로 가고 싶음, 같은 소리라도 듣는 사람과 상황에 따라 소음이 되기도 함 —
공연장 음악 / 밤늦게 옆집), 소음 탐정(학교: 큰 소리로 떠들기·복도에서 뛰기·문을 세게 닫기·의자 끌기 /
집: 텔레비전 소리 크게·소파에서 뛰어내리기(층간 소음)·식탁 의자 끌기·밤늦게 악기 연주 → 줄이는 방법, 측정기 값이 작아짐),
방음재(음악실·방송실 벽에 붙여 소리를 흡수), 우리 반 조용히 도전(10초 동안 60 아래 초록), 실천표,
한눈에 쏙 실천 순서(상황 찾기 → 방법 조사 → 계획 → 실천과 평가), 형성 평가 서술형 예 '버스에서는 작은 목소리로 이야기한다'.
최종: ./make_final.sh s3ep34
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, LaggedStart,
                   ValueTracker, Polygon, Transform, Cross, RoundedRectangle, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def pair_card(bad, good, w=6.3, x=0.0, y=0.0):
    """소음 상황(빨강) 카드 — .good: 줄이는 방법(초록) 카드(같은 자리)"""
    def mk(txt, col, fill):
        t = T(txt, 32, col)
        if t.width > w - 0.4:
            t.scale_to_fit_width(w - 0.4)
        box = RoundedRectangle(corner_radius=0.18, width=w, height=0.95, fill_color=fill, fill_opacity=1,
                               stroke_color=col, stroke_width=4).move_to([x, y, 0])
        t.move_to(box)
        return VGroup(box, t)
    a = mk(bad, RED, "#FDECEA")
    a.good = mk(good, GREEN, "#E8F5EC")
    return a


class S3Ep34(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 34
    EP_TITLE = "소음을 줄이려면?"
    OUT_DIR = HERE

    def construct(self):
        self.shakes = []
        self.opening()
        self.intro()
        self.school()
        self.home()
        self.absorb()
        self.steps()
        self.life()
        self.closing(f"{r('소음')}은 다른 사람을 불쾌하게 하거나 해를 끼칠 수 있어요\n소음을 줄이는 방법을 {g('꾸준히 실천')}해요",
                     next_preview="3학년 마인드맵 7 · 소리의 성질")
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
        word = T("소음", 80, RED).move_to([0, 2.1, 0])
        mean = T("다른 사람을 불쾌하게 하거나 해를 끼칠 수 있는 시끄러운 소리", 38, INK).move_to([0, 0.95, 0])
        self.say("시끄러운 소리 때문에 힘들었던 적이 있나요?", "시끄러운 소리 때문에 힘들었던 적이 있나요?")
        self.play(FadeIn(word, scale=0.8), run_time=0.5)
        self.say(f"다른 사람을 불쾌하게 하거나 해를 끼칠 수 있는 소리 = {r('소음')}",
                 "다른 사람을 불쾌하게 하거나 해를 끼칠 수 있는 시끄러운 소리를 소음이라고 해요.")
        self.play(FadeIn(mean), run_time=0.5)
        self.settle()
        feels = VGroup(tag("스트레스를 받아요", RED, 34), tag("책 읽기에 집중하기 어려워요", RED, 34),
                       tag("다른 곳으로 가고 싶어요", RED, 34)).arrange(RIGHT, buff=0.3).move_to([0, -0.4, 0])
        if feels.width > 13:
            feels.scale_to_fit_width(13)
        self.say("소음을 들으면 어떤 느낌이 들까요?", "소음을 들으면 어떤 느낌이 들까요? 스트레스를 받고, 책 읽기에 집중하기 어렵고, 다른 곳으로 가고 싶어져요.")
        self.play(LaggedStart(*[FadeIn(f_, shift=UP * 0.2) for f_ in feels], lag_ratio=0.3), run_time=1.2)
        self.settle()
        self.play(FadeOut(VGroup(feels, mean)), run_time=0.4)
        c1 = K.card(["공연장의 큰 음악", f"→ {g('즐거운 소리')}"], w=5.6, size=36).move_to([-3.2, 0.0, 0])
        c2 = K.card(["밤늦게 옆집에서 들리는 음악", f"→ {r('소음')}"], w=5.6, size=36).move_to([3.2, 0.0, 0])
        self.say("같은 소리라도 상황에 따라 소음이 되기도 해요",
                 "같은 소리라도 듣는 사람과 상황에 따라 소음이 되기도 하고 아니기도 해요. 공연장의 큰 음악은 즐겁지만, 밤늦게 옆집에서 들리면 소음이 돼요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.5)
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.5)
        self.settle()
        self.clear()

    def detective(self, title, rows, narr_q, narr_a, pause_msg=None):
        mt = K.meter(ValueTracker(0), x=5.2, y=0.4, s=0.95, show_num=False)
        cards = VGroup()
        for i, (bad, good) in enumerate(rows):
            cards.add(pair_card(bad, good, w=8.6, x=-1.6, y=2.1 - i * 1.15))
        self.say(*narr_q)
        self.play(FadeIn(mt), LaggedStart(*[FadeIn(c, shift=RIGHT * 0.2) for c in cards], lag_ratio=0.25),
                  mt.val.animate.set_value(88), run_time=1.4)
        self.settle()
        if pause_msg:
            self.pause_screen(4, pause_msg)
        self.say(*narr_a)
        self.play(LaggedStart(*[Transform(c, c.good) for c in cards], lag_ratio=0.35), mt.val.animate.set_value(25), run_time=2.0)
        self.settle()
        return mt, cards

    # ── 소음 탐정: 학교 ──
    def school(self):
        self.section("소음 탐정 · 학교")
        rows = [("교실에서 큰 소리로 떠들기", "작은 목소리로 차례를 지켜 말해요"),
                ("복도에서 뛰기", "복도에서는 걸어 다녀요"),
                ("교실 문을 세게 닫기", "문을 살짝 닫고, 문에 스펀지(완충재)를 붙여요"),
                ("의자를 끌어서 옮기기", "의자를 들어서 옮기고, 의자 다리에 패드를 붙여요")]
        self.detective("학교", rows,
                       (f"학교에서 {r('소음')}이 나는 곳을 찾아요", "학교에서 소음이 나는 곳을 찾아봐요. 소리 측정기의 바늘이 많이 올라가요."),
                       (f"다른 사람을 배려하는 {g('방법')}으로 바꿔요",
                        "작은 목소리로 말하고, 복도에서는 걸어 다니고, 문은 살짝 닫고, 의자는 들어서 옮겨요. 측정기 값이 작아졌어요."),
                       "소음을 어떻게 줄일까요?")
        self.clear()

    # ── 소음 탐정: 집 ──
    def home(self):
        self.section("소음 탐정 · 집")
        rows = [("텔레비전 소리를 크게 켜기", "텔레비전 소리를 알맞게 줄여요"),
                ("소파에서 뛰어내리기 (층간 소음)", "뛰어내리지 않고, 바닥에 매트나 카펫을 깔아요"),
                ("식탁 의자를 끌기", "의자 다리에 소음 방지 패드를 붙여요"),
                ("밤늦게 악기 연주하기", "늦은 시간에는 연주하지 않아요")]
        self.detective("집", rows,
                       (f"집에서도 {r('소음')}이 생겨요", "집에서도 소음이 생겨요. 아래층과 이웃에게 들리는 소리도 생각해 봐요."),
                       (f"작은 실천으로 {g('모두가 편안해져요')}",
                        "텔레비전 소리는 알맞게 줄이고, 바닥에 매트를 깔고, 의자 다리에 패드를 붙이고, 늦은 시간에는 연주하지 않아요."))
        self.clear()

    # ── 방음재 ──
    def absorb(self):
        self.section("방음재")
        sh = self.shake(0.3, speed=6)
        wall_x = 3.4
        wall = K.R(0.5, 4.6, "#C9B9A6", wall_x + 0.55, 0.3, stroke=INK, sw=3, r=0.02)
        foam = VGroup()
        for k in range(9):
            yy = 2.3 - k * 0.5
            foam.add(Polygon([wall_x + 0.3, yy, 0], [wall_x - 0.15, yy - 0.25, 0], [wall_x + 0.3, yy - 0.5, 0],
                             fill_color="#5A5A70", fill_opacity=1, stroke_color=INK, stroke_width=2))
        sp = K.speaker(1.0, -4.6, 0.3)
        rr = K.rings(np.array([-3.9, 0.3, 0]), sh, rmax=7.05, n=6, start=-0.35, span=0.7, ref=0.3, speed=0.12)
        self.say(f"소리를 흡수하는 {o('방음재')}", "소리를 흡수하는 방음재예요. 음악실이나 방송실 벽에 붙여 소음을 줄여요.")
        self.play(FadeIn(wall), FadeIn(foam), FadeIn(sp), run_time=0.6)
        self.add(rr)
        lab = tag("방음재: 소리를 흡수해요", BLUE, 36).move_to([-0.3, 2.45, 0])
        self.play(FadeIn(lab), run_time=0.4)
        self.settle()
        sh.amp.set_value(0)
        self.play(FadeOut(VGroup(wall, foam, sp, lab)), run_time=0.4)
        mt = K.meter(ValueTracker(0), x=0, y=0.0, s=1.4, show_num=False)
        self.say(f"우리 반 조용히 도전! 10초 동안 {g('초록색')}을 지켜요",
                 "우리 반 조용히 도전도 해 봐요. 모두 함께 10초 동안 측정기 값을 초록색, 60 아래로 유지해요.")
        self.play(FadeIn(mt), mt.val.animate.set_value(35), run_time=0.6)
        self.settle()
        self.clear()

    # ── 한눈에 쏙: 실천 순서 ──
    def steps(self):
        self.section("한눈에 쏙")
        items = ["학교와 집에서 소음이 많이 일어나는 상황을 찾아요",
                 "소음을 줄이는 방법을 조사해요",
                 "소음 줄이기 실천 계획을 세워요",
                 "계획한 대로 실천하고 스스로 평가해요"]
        rows = VGroup()
        for i, it in enumerate(items):
            num = K.R(0.7, 0.7, ORANGE, 0, 0, stroke=ORANGE, sw=0, r=0.35)
            nt = T(str(i + 1), 36, PAPER).move_to(num)
            tx = T(it, 36, INK)
            row = VGroup(VGroup(num, nt), tx).arrange(RIGHT, buff=0.35)
            row.move_to([0, 2.1 - i * 1.1, 0], aligned_edge=LEFT).shift(LEFT * 5.6)
            rows.add(row)
        self.say("소음을 줄이는 방법을 실천하는 순서는?", "소음을 줄이는 방법을 실천하는 순서를 정리해 봐요. 무엇부터 할까요?")
        self.pause_screen(4, "무엇부터 할까요?")
        subs = [f"① {o('상황 찾기')}", f"② {o('방법 조사')}", f"③ {o('계획 세우기')}", f"④ {o('실천하고 평가하기')}"]
        for row, sub, it in zip(rows, subs, items):
            self.say(sub, it + ".")
            self.play(FadeIn(row, shift=RIGHT * 0.2), run_time=0.4)
        self.settle()
        note = T("실천표에 날마다 표시하며 꾸준히 실천해요", 34, GREEN).move_to([0, -2.25, 0])
        self.play(FadeIn(note), run_time=0.4)
        self.wait(1.2)
        self.clear()

    # ── 생활 속에서 ──
    def life(self):
        self.section("생활 속에서")
        bus = VGroup(K.R(7.0, 2.4, "#F2C230", 0, 0.6, stroke=INK, sw=4, r=0.35),
                     *[K.R(1.1, 0.8, "#CFE7F5", -2.6 + k * 1.35, 1.05, stroke=INK, sw=3, r=0.08) for k in range(5)],
                     K.R(0.9, 1.4, "#CFE7F5", 2.95, 0.4, stroke=INK, sw=3, r=0.05)).shift(LEFT * 0.0)
        wheels = VGroup(*[K.E(0.8, 0.8, "#3C3C46", x, -0.65, sw=3) for x in (-2.2, 2.0)])
        q = T("버스나 지하철에서 내가 할 수 있는 일은?", 38, INK).move_to([0.9, 2.5, 0])
        self.say("버스나 지하철에서는 어떻게 할까요?", "버스나 지하철에서 소음을 줄이기 위해 내가 실천할 수 있는 방법은 무엇일까요?")
        self.play(FadeIn(bus), FadeIn(wheels), FadeIn(q), run_time=0.6)
        self.pause_screen(4, "내가 할 수 있는 방법은?")
        a = tag("버스에서는 작은 목소리로 이야기해요", GREEN, 40).move_to([0, -1.7, 0])
        self.say(f"예: 버스에서는 {g('작은 목소리')}로 이야기해요", "예를 들어, 버스에서는 작은 목소리로 이야기해요. 배운 방법을 꾸준히 실천해 봐요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.5)
        self.settle()
        self.clear()
