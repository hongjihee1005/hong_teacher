"""「과학 원리 돋보기」 4학년 4화 — 자석과 자석이 만나면? (4-1 1단원 자석의 이용 5차시, 화 코드 4-1-1-d)

바탕: grade4/science/sem1/u1-4.html(원본 _build_tb/src/u1-4.html) — 도입(고리 자석 끼우개 두 개: 한쪽은 떠 있고 한쪽은 붙어 있음),
실험해요 1(알루미늄 포일로 감싼 막대자석의 양 끝에 N극을 가까이 → 붙는 쪽은 S극, 밀려나는 쪽은 N극),
실험해요 2(N극-N극·S극-S극 밀어 냄, N극-S극 끌어당김), 정리, 생각+(밀려나는 장난감 자동차: 동전 자석의 N극이 막대자석 쪽),
형성 평가(고리 자석이 떠 있으려면 같은 극끼리 마주 보게), 한눈에 쏙 '같은 극 밀어 내는 힘, 다른 극 끌어당기는 힘'.
최종: ./make_final.sh s4ep04
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Arrow,
                   SurroundingRectangle, rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def n_(s):
    return f'<span foreground="{K.NC}">{s}</span>'


def s_(s):
    return f'<span foreground="{K.SC}">{s}</span>'


GRAY = "#5D6873"


def ring(top):
    """고리 자석(옆): 위 절반·아래 절반을 따로(나중에 극 색으로 칠함). .top_pole"""
    w, h = 1.7, 0.4
    up = K.rect(w, h / 2, GRAY, y=h / 4, sw=3)
    dn = K.rect(w, h / 2, GRAY, y=-h / 4, sw=3)
    g_ = VGroup(up, dn)
    g_.top_pole = top
    return g_


def stack(x, tops, base_y=-2.1):
    st = K.stand(2.9, 2.6).move_to([x, base_y + 1.55, 0])
    st.shift(UP * (base_y - st[1].get_bottom()[1]))
    rings = VGroup()
    y = base_y + 0.2
    prev = None
    for t in tops:
        rg = ring(t)
        bottom = "S" if t == "N" else "N"
        if prev is not None and prev == bottom:
            y += 0.55        # 같은 극끼리 마주 봄 → 떠 있음
        rg.move_to([x, y + 0.2, 0])
        y += 0.4
        prev = t
        rings.add(rg)
    # 막대가 고리 가운데를 지나가게 맨 앞에 다시 그림
    pole_front = K.rect(0.18, rings.get_top()[1] - base_y - 0.2 + 0.4, "#B98552", sw=2)
    pole_front.move_to([x, (base_y + 0.2 + rings.get_top()[1] + 0.4) / 2, 0])
    return VGroup(st, rings, pole_front)


class S4Ep04(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 4
    EP_TITLE = "자석과 자석이 만나면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.rings_intro()
        self.foil()
        self.pairs()
        self.rule()
        self.car()
        self.summary()
        self.closing(f"{o('같은 극')}끼리는 서로 {r('밀어 내고')},\n{o('다른 극')}끼리는 서로 {g('끌어당겨요')}",
                     next_preview="4학년 5화 · 나침반과 자석")
        self.wait(0.5)

    # ── 궁금해요: 고리 자석 ──
    def rings_intro(self):
        self.section("궁금해요")
        A = stack(-3.0, ["N", "S", "N"])
        B = stack(3.0, ["N", "N", "N"])
        la = T("끼우개 ㉮", 34).move_to([-3.0, 2.5, 0])
        lb = T("끼우개 ㉯", 34).move_to([3.0, 2.5, 0])
        self.A, self.B = A, B
        self.say("고리 자석 끼우개 두 개에 고리 자석을 세 개씩 끼웠어요",
                 "고리 자석 끼우개 두 개에 고리 자석을 세 개씩 끼웠어요.")
        self.play(FadeIn(A), FadeIn(B), FadeIn(la), FadeIn(lb), run_time=0.9)
        self.say("두 끼우개의 고리 자석 모양은 어떻게 다른가요?", "두 끼우개의 고리 자석 모양은 어떻게 다른가요?")
        self.pause_screen(5, "모양이 어떻게 다른가요?")
        self.say(f"㉮는 고리 자석이 {o('공중에 떠 있고')}, ㉯는 {o('서로 붙어 있어요')}",
                 "끼우개 가는 고리 자석이 공중에 떠 있고, 끼우개 나는 서로 붙어 있어요.")
        self.play(Indicate(A[1], color=ORANGE, scale_factor=1.06), run_time=0.8)
        self.play(Indicate(B[1], color=ORANGE, scale_factor=1.06), run_time=0.8)
        self.say("고리 자석을 뒤집어 끼우면 모양이 달라져요. 왜 그럴까요?",
                 "고리 자석을 뒤집어 끼우면 모양이 달라져요. 왜 그럴까요? 자석과 자석을 가까이 하면 어떤 일이 생기는지 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 1: 포일 자석 ──
    def foil(self):
        self.section("실험해요 1")
        fm = K.foil_magnet(3.0, 0.7).move_to([0, 0.3, 0])
        fl = T("알루미늄 포일로 감싼 막대자석", 32).next_to(fm, UP, buff=0.35)
        self.say("포일로 감싼 막대자석, 어느 쪽이 N극일까요?",
                 "알루미늄 포일로 감싼 막대자석이 있어요. 어느 쪽이 N극일까요?")
        self.play(FadeIn(fm), FadeIn(fl), run_time=0.6)
        self.say(f"막대자석의 {n_('N극')}을 양쪽 끝에 차례로 가까이 해요",
                 "막대자석의 N극을 포일 자석의 양쪽 끝에 차례로 가까이 해 볼게요.")
        self.pause_screen(5, "양쪽 끝에서 어떤 일이 생길까요?")
        # 왼쪽 끝: 막대자석 오른쪽 끝이 N
        pL = K.bar_magnet("S", 2.6, 0.62).move_to([-6.0, 0.3, 0])
        self.play(FadeIn(pL), run_time=0.3)
        self.play(pL.animate.shift(RIGHT * (fm.get_left()[0] - 0.45 - pL.get_right()[0])), run_time=1.0)
        self.play(pL.animate.shift(RIGHT * 0.45), run_time=0.2)
        rl = T("서로 달라붙어요", 32, GREEN).move_to([-3.3, -0.8, 0])
        self.play(FadeIn(rl), run_time=0.3)
        self.say(f"왼쪽 끝은 N극과 {g('서로 달라붙어요')}", "왼쪽 끝에 N극을 가까이 했더니 서로 달라붙었어요.")
        self.settle()
        self.play(FadeOut(pL), run_time=0.4)
        # 오른쪽 끝: 막대자석 왼쪽 끝이 N
        pR = K.bar_magnet("N", 2.6, 0.62).move_to([6.0, 0.3, 0])
        self.play(FadeIn(pR), run_time=0.3)
        self.play(pR.animate.shift(LEFT * (pR.get_left()[0] - fm.get_right()[0] - 0.45)), run_time=1.0)
        self.play(pR.animate.shift(LEFT * 0.25), fm.animate.shift(LEFT * 0.9), fl.animate.shift(LEFT * 0.9),
                  rl.animate.shift(LEFT * 0.9), run_time=0.6)
        rr = T("밀려나요", 32, RED).move_to([pR.get_center()[0], -0.8, 0])
        self.play(FadeIn(rr), run_time=0.3)
        self.say(f"오른쪽 끝은 {r('밀려나요')}", "오른쪽 끝에 N극을 가까이 했더니 포일 자석이 밀려났어요.")
        self.settle()
        self.play(FadeOut(pR), run_time=0.3)
        capL = K.pole_cap("S", 0.6, 0.7).move_to(fm.get_left() + RIGHT * 0.3)
        capR = K.pole_cap("N", 0.6, 0.7).move_to(fm.get_right() + LEFT * 0.3)
        self.say("포일을 벗겨 확인해 봐요", "이제 포일을 한쪽씩 조금 벗겨서 어떤 극인지 확인해 봐요.")
        self.play(FadeIn(capL), run_time=0.5)
        self.play(FadeIn(capR), run_time=0.5)
        self.say(f"N극에 붙은 쪽은 {s_('S극')}, 밀려난 쪽은 {n_('N극')}이에요",
                 "N극에 붙은 쪽은 S극, 붙지 않고 밀려난 쪽은 N극이었어요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 2: 두 막대자석 ──
    def pair(self, a, b, y):
        """a: 왼쪽 자석의 오른쪽 끝 극, b: 오른쪽 자석의 왼쪽 끝 극"""
        A = K.bar_magnet("S" if a == "N" else "N", 2.2, 0.55).move_to([-2.9, y, 0])
        B = K.bar_magnet(b, 2.2, 0.55).move_to([2.4, y, 0])
        self.play(FadeIn(A), FadeIn(B), run_time=0.3)
        self.play(B.animate.shift(LEFT * 1.6), run_time=0.7)
        if a == b:
            mid = (A.get_right()[0] + B.get_left()[0]) / 2
            arrows = VGroup(Arrow([mid - 0.1, y + 0.55, 0], [mid - 1.0, y + 0.55, 0], buff=0, color=RED, stroke_width=6),
                            Arrow([mid + 0.1, y + 0.55, 0], [mid + 1.0, y + 0.55, 0], buff=0, color=RED, stroke_width=6))
            self.play(B.animate.shift(RIGHT * 0.9), FadeIn(arrows), run_time=0.6)
            res = T("서로 밀어 내요", 34, RED)
            extra = arrows
        else:
            self.play(B.animate.shift(LEFT * (B.get_left()[0] - A.get_right()[0])), run_time=0.25)
            res = T("서로 끌어당겨요", 34, GREEN)
            extra = VGroup()
        res.move_to([5.2, y, 0])
        self.play(FadeIn(res), run_time=0.3)
        return VGroup(A, B, extra, res)

    def pairs(self):
        self.section("실험해요 2")
        self.say("같은 극과 다른 극을 가까이 하면?", "이번에는 막대자석 두 개로, 같은 극끼리와 다른 극끼리를 가까이 해 볼게요.")
        self.pause_screen(5, "같은 극끼리, 다른 극끼리는?")
        heads = VGroup()
        rows = [("N", "N", 1.9, f"{n_('N극')}과 {n_('N극')}"), ("S", "S", 0.2, f"{s_('S극')}과 {s_('S극')}"),
                ("N", "S", -1.5, f"{n_('N극')}과 {s_('S극')}")]
        for a, b, y, txt in rows:
            hd = M(txt, 32).move_to([-5.55, y, 0])
            heads.add(hd)
            self.say(f"{txt}을 가까이 하면?", f"{plain_pole(a)}과 {plain_pole(b)}을 가까이 해 봐요.")
            self.play(FadeIn(hd), run_time=0.3)
            self.pair(a, b, y)
            if a == b:
                self.say(f"{txt}: 서로 {r('밀어 내요')}", f"{plain_pole(a)}과 {plain_pole(b)}은 서로 밀어 내요.")
            else:
                self.say(f"{txt}: 서로 {g('끌어당겨요')}", "N극과 S극은 서로 끌어당겨요. 철컥 붙었어요.")
            self.settle()
        self.say("손으로도 밀어 내는 힘과 끌어당기는 힘을 느낄 수 있어요",
                 "손목에 힘을 주지 말고 자연스럽게 가까이 가져가면, 밀어 내는 힘과 끌어당기는 힘을 손으로 느낄 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def rule(self):
        self.section("정리해요")
        c1 = K.text_card([f"{o('같은 극')}끼리 가까이 하면 서로 {r('밀어 내요')}"], w=10.0, size=44).move_to([0, 2.1, 0])
        c2 = K.text_card([f"{o('다른 극')}끼리 가까이 하면 서로 {g('끌어당겨요')}"], w=10.0, size=44).move_to([0, 0.9, 0])
        self.say(f"같은 극은 {r('밀어 내고')}, 다른 극은 {g('끌어당겨요')}",
                 "자석과 자석을 같은 극끼리 가까이 하면 서로 밀어 내고, 다른 극끼리 가까이 하면 서로 끌어당겨요.")
        self.play(FadeIn(c1), run_time=0.5)
        self.play(FadeIn(c2), run_time=0.5)
        self.settle()
        self.play(VGroup(c1, c2).animate.scale(0.72).move_to([3.4, 1.6, 0]), run_time=0.6)
        A = stack(-3.6, ["N", "S", "N"], base_y=-2.1)
        self.play(FadeIn(A), run_time=0.5)
        self.say("고리 자석이 떠 있는 까닭은?", "그럼 처음에 본 고리 자석은 왜 공중에 떠 있었을까요?")
        anims = []
        labs = VGroup()
        for rg in A[1]:
            top = rg.top_pole
            bot = "S" if top == "N" else "N"
            anims += [rg[0].animate.set_fill(K.POLE[top]), rg[1].animate.set_fill(K.POLE[bot])]
            labs.add(T(top, 26, K.POLE[top]).move_to(rg[0].get_center() + RIGHT * 1.15),
                     T(bot, 26, K.POLE[bot]).move_to(rg[1].get_center() + RIGHT * 1.15))
        self.play(*anims, run_time=0.8)
        self.play(FadeIn(labs), run_time=0.3)
        self.say(f"마주 보는 면이 {o('같은 극')}이라 서로 {r('밀어 내기')} 때문이에요",
                 "고리 자석의 마주 보는 면이 같은 극이라서 서로 밀어 내기 때문에 공중에 떠 있어요.")
        self.play(Indicate(VGroup(A[1][0][0], A[1][1][1]), color=ORANGE, scale_factor=1.08), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 생각+: 장난감 자동차 ──
    def car(self):
        self.section("생각+")
        tbl = K.rect(12.6, 0.1, "#C9B27A", y=-1.6, sw=0)
        car = K.toy_car().move_to([1.6, -1.6 + 0.62, 0])
        coin = K.rect(0.34, 0.6, K.NC, sw=3).next_to(car[0], LEFT, buff=0)
        cl = T("N", 26, PAPER).move_to(coin)
        cg = VGroup(car, coin, cl)
        bar = K.bar_magnet("S", 2.6, 0.6).move_to([-4.6, coin.get_center()[1], 0])
        self.say("자동차 뒤에 동전 모양 자석을 붙여요", "장난감 자동차 뒤에 동전 모양 자석을 붙였어요.")
        self.play(FadeIn(tbl), FadeIn(car), FadeIn(coin), FadeIn(bar), run_time=0.7)
        self.say(f"막대자석의 {n_('N극')}을 가까이 할 때 자동차가 밀려 나게 하려면?",
                 "막대자석의 N극을 가까이 할 때 자동차가 밀려 나게 하려면, 동전 자석을 어떻게 붙여야 할까요?")
        self.pause_screen(5, "동전 자석을 어떻게 붙일까요?")
        self.play(FadeIn(cl), run_time=0.3)
        self.say(f"동전 자석의 {n_('N극')}이 막대자석 쪽을 보게 붙여요",
                 "동전 자석의 N극이 막대자석 쪽을 보게 붙여요. 같은 극끼리는 서로 밀어 내니까요.")
        self.play(bar.animate.shift(RIGHT * (coin.get_left()[0] - 0.4 - bar.get_right()[0])), run_time=1.0)
        self.play(cg.animate.shift(RIGHT * 2.6), run_time=1.2, rate_func=rate_functions.ease_out_cubic)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"자석과 자석을 같은 극끼리 가까이 하면",
                            f"서로 {r('밀어')} 내는 힘이 작용하고,",
                            f"다른 극끼리 가까이 하면 서로 {g('끌어당기는')} 힘이 작용합니다."],
                           w=12.6, size=44).move_to([0, 0.6, 0])
        self.say(f"같은 극은 {r('밀어 내는 힘')}, 다른 극은 {g('끌어당기는 힘')}",
                 "자석과 자석을 같은 극끼리 가까이 하면 서로 밀어 내는 힘이 작용하고, 다른 극끼리 가까이 하면 서로 끌어당기는 힘이 작용해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


def plain_pole(p):
    return "N극" if p == "N" else "S극"
