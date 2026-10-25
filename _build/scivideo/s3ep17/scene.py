"""「과학 원리 돋보기」 3학년 17화 — 식물이 잘 자라려면? (3-1 4단원 생물의 한살이 7차시, 화 코드 3-1-4-c)

바탕: grade3/science/sem1/u4-5.html — 도입(물을 오래 주지 않음·햇빛이 들지 않는 곳 → 잘 자라지 못함),
실험 설계(비슷한 크기로 자란 케일 화분 두 개, 다르게 할 조건 물의 양 또는 햇빛의 양 — 모둠마다 달리 골라 반 전체에서 두 결과,
같게 할 조건 온도·흙·식물의 종류·식물이 자란 정도·화분의 크기·화분을 놓는 장소, 두 화분 모두 햇빛이 잘 드는 같은 창가),
물 실험(가 화분 하루에 한 번 / 나 화분 주지 않기, 적당히 — 화분 받침에 살짝 흘러나올 정도),
햇빛 실험(한 화분에만 햇빛 차단 장치, 물은 똑같이), 결과(14일째: 물을 준 케일 잎이 커지고 줄기가 굵어짐 / 물을 주지 않은 케일 잎과 줄기가 시듦,
햇빛을 받은 케일 잎이 크고 진한 초록색·줄기 굵음 / 못 받은 케일 잎이 연한 초록색·줄기 가늚), 한눈에 쏙(적당한 양의 물과 햇빛),
생각 바로잡기(온도가 높을수록? 물은 많이 줄수록?), 생명 지킴이, 생각+(실내 식물은 햇빛이 잘 드는 곳).
최종: ./make_final.sh s3ep17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, Rectangle, Transform, VGroup,
                   LaggedStart, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import BROWN, BROWN_DARK, RED, clear_stage, tag
from kit_s3u14 import drop, kale_pot, light_cover, sun


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def window(x=0.0, w=11.0):
    """창가: 창틀 + 선반"""
    frame = Rectangle(width=w, height=3.6, fill_color="#DDF0FB", fill_opacity=0.6, stroke_color="#9AB5C6", stroke_width=6).move_to([x, 1.0, 0])
    mid = Line([x, -0.8, 0], [x, 2.8, 0], stroke_color="#9AB5C6", stroke_width=6)
    shelf = Rectangle(width=w + 0.6, height=0.22, fill_color=BROWN, fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3).move_to([x, -0.95, 0])
    return VGroup(frame, mid, shelf)


class S3Ep17(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 17
    EP_TITLE = "식물이 잘 자라려면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.design()
        self.water_exp()
        self.light_exp()
        self.summary()
        self.myth()
        self.closing(f"식물이 잘 자라려면 {o('적당한 양의 물')}과 {o('햇빛')}이 필요해요",
                     next_preview="3학년 18화 · 여러 동물의 한살이")
        self.wait(0.5)

    def pots(self, a="start", b="start", x=2.6, y=-0.84):
        pa = kale_pot(a, 1.0).move_to([-x, 0, 0], aligned_edge=DOWN).shift(UP * y)
        pb = kale_pot(b, 1.0).move_to([x, 0, 0], aligned_edge=DOWN).shift(UP * y)
        return pa, pb

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        p = kale_pot("wilt", 1.3).move_to([0, -0.9, 0], aligned_edge=DOWN)
        self.say("키우던 식물이 잘 자라지 못한 적이 있나요?", "식물을 키우다가 잘 자라지 못한 적이 있나요? 왜 그랬을까요?")
        self.play(FadeIn(p, shift=UP * 0.3), run_time=0.6)
        self.pause_screen(4, "왜 잘 자라지 못했을까요?")
        a = tag("물을 오랫동안 주지 않았어요", BLUE, 34).move_to([-3.9, 1.3, 0])
        b = tag("햇빛이 들지 않는 곳에 두었어요", ORANGE, 34).move_to([3.9, 1.3, 0])
        for t_ in (a, b):
            if t_.width > 5.0:
                t_.scale_to_fit_width(5.0)
        self.say(f"{b_('물')}이 부족하거나 {o('햇빛')}을 받지 못했을 수 있어요",
                 "물을 오랫동안 주지 않았거나, 햇빛이 들지 않는 곳에 두었을 수 있어요. 정말 그런지 실험으로 알아봐요.")
        self.play(FadeIn(a, shift=DOWN * 0.2), FadeIn(b, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 실험 설계 ──
    def design(self):
        self.section("실험 설계")
        pa, pb = self.pots()
        la = T("가 화분", 36, INK).next_to(pa, DOWN, buff=0.32)
        lb = T("나 화분", 36, INK).next_to(pb, DOWN, buff=0.32)
        self.say("비슷한 크기로 자란 케일 화분 두 개를 써요",
                 "비슷한 크기로 자란 같은 종류의 케일 화분 두 개를 써요. 그래야 공정하게 비교할 수 있어요.")
        self.play(FadeIn(pa), FadeIn(pb), FadeIn(la), FadeIn(lb), run_time=0.6)
        d1 = tag("물의 양", BLUE, 40)
        d2 = tag("햇빛의 양", ORANGE, 40)
        orr = T("또는", 36, SOFT)
        drow = VGroup(T("다르게 할 조건", 38, RED), d1, orr, d2).arrange(RIGHT, buff=0.3).move_to([0, 2.4, 0])
        self.say(f"{r('다르게 할 조건')}은 하나만 — 물의 양 또는 햇빛의 양",
                 "두 화분에 다르게 할 조건을 하나만 골라요. 물의 양이나 햇빛의 양이에요. 모둠마다 다른 조건을 고르면 반 전체에서 두 가지 결과를 모두 볼 수 있어요.")
        self.play(FadeIn(drow, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        self.play(FadeOut(VGroup(pa, pb, la, lb)), drow.animate.move_to([0, 1.9, 0]), run_time=0.6)
        same = ["온도", "흙", "식물의 종류", "식물이 자란 정도", "화분의 크기", "화분을 놓는 장소"]
        chips = VGroup(*[tag(t, GREEN, 36) for t in same]).arrange_in_grid(rows=2, cols=3, buff=(0.3, 0.3))
        if chips.width > 12.6:
            chips.scale_to_fit_width(12.6)
        head = T("같게 할 조건", 38, GREEN)
        srow = VGroup(head, chips).arrange(DOWN, buff=0.35).move_to([0, -0.2, 0])
        self.say(f"나머지 조건은 모두 {g('같게')} 해요",
                 "온도, 흙, 식물의 종류, 식물이 자란 정도, 화분의 크기, 화분을 놓는 장소처럼 나머지 조건은 모두 같게 해요.")
        self.play(FadeIn(head), LaggedStart(*[FadeIn(c, shift=UP * 0.15) for c in chips], lag_ratio=0.12), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 물 실험 ──
    def water_exp(self):
        self.section("실험 ① 물")
        win = window()
        pa, pb = self.pots()
        la = T("가 · 하루에 한 번 물", 34, BLUE).next_to(pa, DOWN, buff=0.32)
        lb = T("나 · 물을 주지 않아요", 34, BROWN_DARK).next_to(pb, DOWN, buff=0.32)
        self.say("두 화분을 햇빛이 잘 드는 같은 창가에 두어요",
                 "두 화분을 햇빛이 잘 드는 같은 창가에 두어요. 가 화분에는 하루에 한 번 물을 주고, 나 화분에는 물을 주지 않아요.")
        self.play(FadeIn(win), FadeIn(pa), FadeIn(pb), run_time=0.6)
        self.play(FadeIn(la), FadeIn(lb), run_time=0.4)
        drops = VGroup(*[drop(0.28).move_to(pa.get_top() + np.array([dx, 0.5, 0])) for dx in (-0.4, 0, 0.4)])
        self.play(FadeIn(drops, shift=DOWN * 0.3), run_time=0.4)
        self.play(FadeOut(drops, shift=DOWN * 0.4), run_time=0.4)
        self.say("물은 화분 받침에 살짝 흘러나올 정도로 적당히 줘요",
                 "물을 줄 때는 화분 받침에 물이 살짝 흘러나올 정도로 적당히 줘요.")
        self.say("14일 동안 기르면 두 케일은 어떻게 될까요?", "이렇게 14일 동안 기르면 두 케일은 어떻게 될까요?")
        self.pause_screen(5, "두 케일은 어떻게 될까요?")
        na, nb = self.pots("good", "wilt")
        day = T("14일째", 40, ORANGE).move_to([0, 2.75, 0])
        self.play(FadeIn(day), Transform(pa, na), Transform(pb, nb), run_time=1.4)
        ra = tag("잎이 커지고 줄기가 굵어졌어요", GREEN, 30).move_to([-3.0, -2.0, 0])
        rb = tag("잎과 줄기가 시들었어요", RED, 30).move_to([3.0, -2.0, 0])
        self.say(f"물을 준 케일은 {g('잘 자라고')}, 주지 않은 케일은 {r('시들었어요')}",
                 "물을 준 케일은 잎이 커지고 줄기가 굵어졌어요. 물을 주지 않은 케일은 흙이 마르고 잎과 줄기가 시들었어요.")
        self.play(FadeIn(ra), FadeIn(rb), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 햇빛 실험 ──
    def light_exp(self):
        self.section("실험 ② 햇빛")
        win = window()
        pa, pb = self.pots()
        cover = light_cover(2.3, 3.4).move_to([2.6, -0.84, 0], aligned_edge=DOWN)
        la = T("가 · 햇빛을 받아요", 34, ORANGE).next_to(pa, DOWN, buff=0.32)
        lb = T("나 · 햇빛을 막아요", 34, "#4A535B").next_to(pb, DOWN, buff=0.32)
        self.say("다른 모둠은 한 화분에만 햇빛 차단 장치를 씌워요",
                 "다른 모둠은 햇빛의 양을 다르게 했어요. 나 화분에만 햇빛 차단 장치를 씌우고, 두 화분에 물은 똑같이 줘요.")
        self.play(FadeIn(win), FadeIn(pa), FadeIn(pb), FadeIn(la), FadeIn(lb), run_time=0.6)
        self.play(FadeIn(cover, shift=DOWN * 0.5), run_time=0.6)
        self.pause_screen(4, "두 케일은 어떻게 될까요?")
        na, nb = self.pots("good", "pale")
        day = T("14일째", 40, ORANGE).move_to([0, 2.75, 0])
        self.play(FadeIn(day), Transform(pa, na), Transform(pb, nb), run_time=1.0)
        self.play(FadeOut(cover, shift=UP * 0.5), run_time=0.6)
        ra = tag("잎이 크고 진한 초록색, 줄기가 굵어요", GREEN, 28).move_to([-3.25, -2.0, 0])
        rb = tag("잎이 연한 초록색, 줄기가 가늘어요", RED, 28).move_to([3.25, -2.0, 0])
        self.say(f"햇빛을 못 받은 케일은 {r('잎이 연하고 줄기가 가늘어요')}",
                 "햇빛을 받은 케일은 잎이 크고 진한 초록색이며 줄기가 굵어졌어요. 햇빛을 받지 못한 케일은 잎이 연한 초록색이고 줄기가 가늘어요.")
        self.play(FadeIn(ra), FadeIn(rb), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        d = drop(0.9).move_to([-2.6, 0.7, 0])
        s_ = sun(0.8).move_to([2.6, 0.7, 0])
        plus = T("+", 90, SOFT).move_to([0, 0.7, 0])
        l1 = T("적당한 양의 물", 44, BLUE).move_to([-2.6, -1.1, 0])
        l2 = T("햇빛", 44, ORANGE).move_to([2.6, -1.1, 0])
        self.say(f"식물이 잘 자라려면 {b_('적당한 양의 물')}과 {o('햇빛')}이 필요해요",
                 "두 실험 결과를 모으면, 식물이 잘 자라려면 적당한 양의 물과 햇빛이 필요하다는 것을 알 수 있어요.")
        self.play(FadeIn(d, scale=0.6), FadeIn(l1), run_time=0.5)
        self.play(FadeIn(plus), FadeIn(s_, scale=0.6), FadeIn(l2), run_time=0.5)
        self.say("실내에서 기르는 식물도 햇빛이 잘 드는 곳에 두어요",
                 "그래서 실내에서 기르는 식물도 햇빛이 잘 드는 곳에 두고, 적당한 양의 물을 꾸준히 주어요.")
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def myth(self):
        self.section("생각 바로잡기")
        m1 = T("온도가 높을수록 식물이 잘 자란다?", 44, INK).move_to([0, 2.1, 0])
        a1 = T("식물은 알맞은 온도에서 잘 자라요", 40, GREEN).move_to([0, 1.2, 0])
        m2 = T("물은 많이 줄수록 좋다?", 44, INK).move_to([0, -0.1, 0])
        a2 = T("너무 많이 주면 뿌리가 썩을 수 있어요", 40, GREEN).move_to([0, -1.0, 0])
        x1 = T("×", 70, RED).next_to(m1, LEFT, buff=0.25)
        x2 = T("×", 70, RED).next_to(m2, LEFT, buff=0.25)
        self.say("온도가 높을수록 식물이 잘 자랄까요?", "온도가 높을수록 식물이 잘 자랄까요?")
        self.play(FadeIn(m1), run_time=0.4)
        self.say(f"아니에요, {g('알맞은 온도')}에서 잘 자라요", "아니에요. 너무 더우면 오히려 잘 자라지 못해요. 식물은 알맞은 온도에서 잘 자라요.")
        self.play(FadeIn(x1, scale=0.6), FadeIn(a1), run_time=0.5)
        self.say("물은 많이 줄수록 좋을까요?", "그럼 물은 많이 줄수록 좋을까요?")
        self.play(FadeIn(m2), run_time=0.4)
        self.say(f"아니에요, {g('적당한 양')}의 물이 필요해요", "아니에요. 물을 너무 많이 주면 뿌리가 썩을 수 있어요. 적당한 양의 물이 필요해요.")
        self.play(FadeIn(x2, scale=0.6), FadeIn(a2), run_time=0.5)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'
