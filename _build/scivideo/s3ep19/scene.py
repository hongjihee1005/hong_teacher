"""「과학 원리 돋보기」 3학년 19화 — 한해살이 식물과 여러해살이 식물 (3-1 4단원 생물의 한살이 9차시, 화 코드 3-1-4-e)

바탕: grade3/science/sem1/u4-7.html — 도입(은행나무: 해마다 같은 자리, 모든 식물이 여러 해 사는 것은 아님),
봉숭아와 사과나무 계절 넘기기(봄 둘 다 싹 / 여름 봉숭아 꽃, 어린 사과나무 잎·줄기 / 가을 봉숭아 열매·씨 / 겨울 봉숭아 씨를 남기고 한살이를 마침, 사과나무 겨울눈 /
몇 년 뒤 봄 새 봉숭아 싹, 사과나무 새순·꽃 / 가을 새 봉숭아 씨, 사과나무 열매 — 해마다 반복),
이름(한해살이식물·여러해살이식물), 공통점(씨가 싹 트고 자라 꽃이 피고 열매를 맺어 씨를 만듦)·차이점,
분류 놀이(벼·봉숭아·나팔꽃·강낭콩·강아지풀·옥수수 / 민들레·은행나무·사과나무·비비추·감나무·개나리),
생각 바로잡기(풀은 모두 한해살이식물? — 민들레·비비추), 생각+(땅속뿌리나 줄기, 겨울눈으로 겨울을 지냄), 한눈에 쏙.
EPISODES.md의 핵심 장면은 '강낭콩·사과나무'였지만 앱이 봉숭아와 사과나무를 견주어 앱을 따름. 화면 낱말은 앱처럼 '한해살이식물'(붙여 씀).
최종: ./make_final.sh s3ep19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, Rectangle, RoundedRectangle,
                   Transform, VGroup, LaggedStart, Ellipse)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import BROWN, BROWN_DARK, RED, clear_stage, tag
from kit_s3u14 import apple_tree, balsam, ground_strip, season_chip, PINK

GROUND_Y = -1.55
LX, RX = -3.4, 3.4


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def p_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


class S3Ep19(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 19
    EP_TITLE = "한해살이 식물과 여러해살이 식물"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.seasons()
        self.names()
        self.compare()
        self.sort()
        self.myth()
        self.closing(f"한 해 동안 한살이를 마치고 죽으면 {o('한해살이식물')},\n여러 해 동안 살며 한살이 과정의 일부를 반복하면 {p_('여러해살이식물')}",
                     next_preview="3학년 마인드맵 4 · 생물의 한살이")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        gnd = ground_strip(-6.8, 6.8, GROUND_Y)
        tree = apple_tree("leafy", 1.1).move_to([0, GROUND_Y, 0], aligned_edge=DOWN)
        self.say("해마다 같은 자리에서 볼 수 있는 나무가 있어요",
                 "학교나 동네의 은행나무처럼, 해마다 같은 자리에서 볼 수 있는 식물이 있어요.")
        self.play(Create(gnd), FadeIn(tree, shift=UP * 0.3), run_time=0.8)
        q = T("모든 식물이 여러 해 동안 살까요?", 44, INK).move_to([0.6, 2.65, 0])
        self.say("모든 식물이 겨울을 지내고 여러 해 동안 살아갈까요?",
                 "그럼 모든 식물이 겨울을 지내고 여러 해 동안 살아갈 수 있을까요?")
        self.play(FadeIn(q), tree.animate.shift(DOWN * 0.0).scale(0.9, about_edge=DOWN), run_time=0.5)
        self.pause_screen(4, "모든 식물이 여러 해 동안 살까요?")
        self.say(f"아니요, {o('한 해 안에 죽는 식물')}도 있어요",
                 "아니요. 씨를 만든 뒤 한 해 안에 죽는 식물도 있어요. 봉숭아와 사과나무의 한살이를 견주어 봐요.")
        self.settle()
        clear_stage(self)

    # ── 계절 넘기기 ──
    def lane_pics(self, b, a):
        bp = balsam(b, 1.05).move_to([LX, GROUND_Y, 0], aligned_edge=DOWN)
        if b == "seed":
            bp.move_to([LX, GROUND_Y - 0.1, 0])
        ap = apple_tree(a, 1.0 if a not in ("sprout", "sapling") else 1.05).move_to([RX, GROUND_Y, 0], aligned_edge=DOWN)
        return bp, ap

    def seasons(self):
        self.section("봉숭아와 사과나무")
        gnd = VGroup(ground_strip(-6.8, -0.4, GROUND_Y), ground_strip(0.4, 6.8, GROUND_Y))
        div = Line([0, 2.2, 0], [0, GROUND_Y - 0.4, 0], stroke_color=SOFT, stroke_width=3)
        n1 = T("봉숭아", 40, PINK).move_to([LX, GROUND_Y - 0.5, 0])
        n2 = T("사과나무", 40, RED).move_to([RX, GROUND_Y - 0.5, 0])
        self.play(Create(gnd), Create(div), FadeIn(n1), FadeIn(n2), run_time=0.6)
        seq = [
            ("봄", "sprout", "sprout", "봄: 둘 다 씨에서 싹이 터요", "봄에는 봉숭아도 사과나무도 씨에서 싹이 터요."),
            ("여름", "flower", "sapling", "여름: 봉숭아는 꽃이 피고, 사과나무는 잎과 줄기가 자라요",
             "여름이 되면 봉숭아는 꽃이 피고, 어린 사과나무는 잎과 줄기가 자라요."),
            ("가을", "fruit", "sapling", "가을: 봉숭아는 열매를 맺어 씨를 만들어요", "가을에는 봉숭아가 열매를 맺어 씨를 만들어요."),
            ("겨울", "dead", "bare", f"겨울: 봉숭아는 {r('한살이를 마치고')}, 사과나무는 겨울눈으로",
             "겨울이 되면 봉숭아는 씨를 남기고 한살이를 마쳐요. 사과나무는 죽지 않고 겨울눈으로 겨울을 지내요."),
            ("몇 년 뒤 봄", "sprout", "blossom", "몇 년 뒤 봄: 씨에서 새 봉숭아, 사과나무는 꽃이 피어요",
             "몇 년 뒤 봄, 떨어진 씨에서 새 봉숭아가 싹 텄어요. 적당한 크기로 자란 사과나무는 새순이 나오고 꽃이 피어요."),
            ("가을", "fruit", "fruit", f"사과나무는 해마다 꽃과 열매를 {o('반복')}해요",
             "가을에는 새 봉숭아도 씨를 만들고, 사과나무는 열매를 맺어요. 사과나무는 해마다 이 과정을 반복해요."),
        ]
        chip = None
        bp = ap = None
        for i, (sn, b, a, sub, narr) in enumerate(seq):
            nb, na = self.lane_pics(b, a)
            nc = season_chip(sn, 36).move_to([0, 2.65, 0])
            self.say(sub, narr)
            anims = []
            if chip is None:
                anims += [FadeIn(nc)]
            else:
                anims += [FadeOut(chip), FadeIn(nc)]
            if bp is None:
                anims += [FadeIn(nb, shift=UP * 0.2), FadeIn(na, shift=UP * 0.2)]
            else:
                anims += [FadeOut(bp), FadeIn(nb), FadeOut(ap), FadeIn(na)]
            self.play(*anims, run_time=0.9)
            chip, bp, ap = nc, nb, na
            if i == 3:
                self.settle()
        self.settle()
        clear_stage(self)

    # ── 이름 ──
    def names(self):
        self.section("이름을 붙여요")
        lb = balsam("flower", 0.85).move_to([LX, 0.9, 0])
        rb = apple_tree("fruit", 0.6).move_to([RX, 0.9, 0])
        self.play(FadeIn(lb), FadeIn(rb), run_time=0.5)
        self.say("두 식물의 한살이는 무엇이 다를까요?", "봉숭아와 사과나무의 한살이는 무엇이 다를까요?")
        self.pause_screen(4, "두 식물은 무엇이 다를까요?")
        t1 = VGroup(T("한해살이식물", 50, ORANGE), T("한 해 동안 한살이를 마치고 죽어요", 32, INK)).arrange(DOWN, buff=0.2)
        t2 = VGroup(T("여러해살이식물", 50, BLUE), T("여러 해 동안 살며 한살이 일부를 반복해요", 32, INK)).arrange(DOWN, buff=0.2)
        k = min(1.0, 6.2 / max(t1.width, t2.width))
        t1.scale(k)
        t2.scale(k)
        t1.move_to([LX, -1.25, 0])
        t2.move_to([RX, -1.25, 0])
        self.say(f"봉숭아처럼 한 해 동안 한살이를 마치고 죽는 식물 = {o('한해살이식물')}",
                 "봉숭아처럼 한 해 동안 한살이를 마치고 죽는 식물을 한해살이식물이라고 해요.")
        self.play(FadeIn(t1, shift=UP * 0.2), run_time=0.5)
        self.say(f"사과나무처럼 여러 해 동안 사는 식물 = {p_('여러해살이식물')}",
                 "사과나무처럼 여러 해 동안 죽지 않고 살아가면서 한살이 과정의 일부를 반복하는 식물을 여러해살이식물이라고 해요.")
        self.play(FadeIn(t2, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 공통점·차이점 ──
    def compare(self):
        self.section("공통점과 차이점")
        steps = ["씨", "싹", "자람", "꽃", "열매", "씨"]
        row = VGroup()
        for i, s in enumerate(steps):
            row.add(tag(s, GREEN, 40))
            if i < len(steps) - 1:
                row.add(T("→", 40, SOFT))
        row.arrange(RIGHT, buff=0.25).move_to([0, 1.7, 0])
        self.say(f"공통점: 씨가 싹 트고 자라 {g('꽃')}이 피고 {g('열매')}를 맺어 씨를 만들어요",
                 "두 무리 모두 씨가 싹 트고 자라 꽃이 피고 열매를 맺어 씨를 만들어요.")
        self.play(LaggedStart(*[FadeIn(x, shift=RIGHT * 0.15) for x in row], lag_ratio=0.12), run_time=1.2)
        a = VGroup(T("한해살이식물", 40, ORANGE), T("씨로 겨울을 지내요", 34, INK)).arrange(DOWN, buff=0.25).move_to([LX, -0.6, 0])
        b_ = VGroup(T("여러해살이식물", 40, BLUE), T("겨울에도 죽지 않아요", 34, INK)).arrange(DOWN, buff=0.25).move_to([RX, -0.6, 0])
        div = Line([0, 0.4, 0], [0, -1.6, 0], stroke_color=SOFT, stroke_width=3)
        self.say(f"차이점: 한살이에 걸리는 {o('기간')}이 달라요",
                 "차이점은 한살이에 걸리는 기간이에요. 한해살이식물은 씨로 겨울을 지내고, 여러해살이식물은 겨울에도 죽지 않아요.")
        self.play(FadeIn(a), Create(div), FadeIn(b_), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 분류 ──
    def sort(self):
        self.section("분류해요")
        boxes = VGroup()
        for x, nm, col in ((LX, "한해살이식물", ORANGE), (RX, "여러해살이식물", BLUE)):
            bx = RoundedRectangle(corner_radius=0.25, width=6.4, height=4.2, fill_color=PAPER, fill_opacity=0.85,
                                  stroke_color=col, stroke_width=5).move_to([x, 0.25, 0])
            h = T(nm, 40, col).move_to([x, 1.85, 0])
            boxes.add(VGroup(bx, h))
        ann = ["벼", "봉숭아", "나팔꽃", "강낭콩", "강아지풀", "옥수수"]
        per = ["민들레", "은행나무", "사과나무", "비비추", "감나무", "개나리"]
        ac = VGroup(*[tag(t, ORANGE, 34) for t in ann]).arrange_in_grid(rows=3, cols=2, buff=(0.4, 0.28)).move_to([LX, -0.1, 0])
        pc = VGroup(*[tag(t, BLUE, 34) for t in per]).arrange_in_grid(rows=3, cols=2, buff=(0.4, 0.28)).move_to([RX, -0.1, 0])
        self.say("여러 식물을 두 무리로 나누어요", "여러 가지 식물을 한해살이식물과 여러해살이식물로 나누어 봐요.")
        self.play(FadeIn(boxes), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(c, shift=DOWN * 0.15) for c in ac], lag_ratio=0.15), run_time=1.0)
        self.say("벼, 봉숭아, 나팔꽃, 강낭콩, 강아지풀, 옥수수는 한해살이식물",
                 "벼, 봉숭아, 나팔꽃, 강낭콩, 강아지풀, 옥수수는 한 해 동안 사는 한해살이식물이에요.")
        self.play(LaggedStart(*[FadeIn(c, shift=DOWN * 0.15) for c in pc], lag_ratio=0.15), run_time=1.0)
        self.say("민들레, 은행나무, 사과나무, 비비추, 감나무, 개나리는 여러해살이식물",
                 "민들레, 은행나무, 사과나무, 비비추, 감나무, 개나리는 여러 해 동안 사는 여러해살이식물이에요.")
        self.settle()
        self.pc = pc
        self.keep = VGroup(boxes, ac, pc)

    # ── 생각 바로잡기 ──
    def myth(self):
        self.section("생각 바로잡기")
        q = T("풀은 모두 한해살이식물이다?", 44, INK).move_to([0.9, 2.65, 0])
        self.play(self.keep.animate.shift(DOWN * 0.15), FadeIn(q), run_time=0.5)
        self.say("풀은 모두 한해살이식물일까요?", "생각을 바로잡아 봐요. 풀은 모두 한해살이식물일까요?")
        self.pause_screen(4, "풀은 모두 한해살이식물일까요?")
        x_ = T("×", 70, RED).next_to(q, LEFT, buff=0.25)
        self.say(f"민들레, 비비추 같은 풀도 {p_('여러해살이식물')}이에요",
                 "아니에요. 민들레, 비비추 같은 풀은 겨울에도 땅속 부분이 살아남아 여러 해 동안 살아가는 여러해살이식물이에요.")
        self.play(FadeIn(x_, scale=0.6), Indicate(self.pc[0], color=RED), Indicate(self.pc[3], color=RED), run_time=1.0)
        self.say("여러해살이식물은 땅속뿌리나 줄기, 겨울눈으로 겨울을 지내요",
                 "여러해살이식물은 땅속뿌리나 줄기가 살아남거나, 사과나무처럼 겨울눈의 모습으로 겨울을 지내요.")
        self.settle()
        clear_stage(self)
