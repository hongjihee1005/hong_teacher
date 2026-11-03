"""「과학 원리 돋보기」 6학년 32화 — 물질이 타려면? (6-2 2단원 물질의 연소 3~4차시, 화 코드 6-2-2-c)

바탕: grade6/science/sem2/u2-3.html(원본 _build_tb/src2/u2-3.html) — 도입(불을 피울 때 부채질 → 공기를 불어 넣어 더 잘 타게),
실험 1(두 촛불을 아크릴 통으로 덮기, ㉡에는 묽은 과산화 수소수 + 아이오딘화 칼륨 비커 → 산소 발생, ㉠이 먼저 꺼지고 ㉡이 더 오래 탐,
산소는 물질이 타는 것을 돕는 성질, ㉠이 꺼져도 산소는 남아 있지만 충분하지 않음), 실험 2(철판 가운데에서 같은 거리의 성냥 머리·나무 부분,
철판 가운데 가열 → 머리 부분에 먼저 불, 나무 부분은 검게 변하다가 더 오래 가열하자 불), 정리(연소·발화점, 산소가 많을수록 활발, 송풍기·화로
공기 조절), 연소의 조건 켜고 끄기(하나라도 없으면 연소가 일어나지 않음: 통으로 덮어 공기를 막음·온도가 발화점보다 낮음), 생각+(마찰·볼록 렌즈·
가열한 철판 → 온도, 부채질·송풍기 → 산소, 장작 더 넣기 → 탈 물질), 체험 더하기(로켓), 한눈에 쏙·생각이 쑥(마른나무 마찰).
최종: ./make_final.sh s6ep32
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform, Circle,
                   RoundedRectangle, Rectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u22 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="#2F6FD6">{s}</span>'


class S6Ep32(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 32
    EP_TITLE = "물질이 타려면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.oxygen()
        self.temperature()
        self.define()
        self.conditions()
        self.life()
        self.summary()
        self.closing(f"물질이 연소하려면 {o('탈 물질')}, {bl('산소')},\n{r('발화점 이상의 온도')}가 모두 필요해요",
                     next_preview="6학년 33화 · 연소 후의 변화")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        fire = K.campfire(True, 1.1).move_to([-3.6, -0.4, 0])
        fan = VGroup(K.poly([(0, 0), (-0.9, 0.9), (-0.2, 1.25), (0.35, 1.2), (0.9, 0.7)], "#F7D9A0", "#B9893A", 4),
                     K.L((0, 0), (0.5, -0.7), "#8A5A2B", 10)).move_to([-0.9, 0.2, 0])
        wind = VGroup(*[K.L((-1.6, y), (-2.4, y - 0.15), "#7FB3D5", 6) for y in (0.5, 0.1, -0.3)])
        q = K.text_card(["불을 피울 때", "부채질을 하는 까닭은?"], size=34).move_to([3.6, 1.3, 0])
        self.say("불을 피울 때 부채질을 하는 까닭은 무엇일까요?", "불을 피울 때 부채질을 하는 까닭은 무엇일까요?")
        self.play(FadeIn(fire), FadeIn(fan), FadeIn(q), run_time=0.8)
        self.settle()
        a = K.text_card([f"{bl('공기')}를 불어 넣어", "불이 더 잘 타게 하려고"], size=32).move_to([3.6, -0.8, 0])
        self.say(f"{bl('공기')}를 불어 넣어 불이 더 잘 타게 해요",
                 "공기를 불어 넣어 불이 더 잘 타게 하려고 부채질을 해요.")
        self.play(FadeIn(wind, shift=LEFT * 0.3), FadeIn(a), fire.flame.animate.scale(1.15, about_edge=DOWN), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 실험 1 : 산소 ──
    def oxygen(self):
        self.section("실험 1 · 산소")
        y0 = -2.1
        base = K.table_top(10.0, y0).move_to([-1.6, y0 - 0.16, 0])
        c1 = K.candle(1.1, True, w=0.4, fs=1.0).shift([-4.6, y0, 0])
        c2 = K.candle(1.1, True, w=0.4, fs=1.0).shift([-1.6, y0, 0])
        bk = K.o2_beaker(True, 0.9).shift([-0.4, y0, 0])
        n1 = K.label("㉠ 양초만", INK, 28).move_to([-4.6, 2.2, 0])
        n2 = K.label("㉡ 양초 + 비커", INK, 28).move_to([-1.0, 2.2, 0])
        info = K.text_card([f"비커: 묽은 과산화 수소수 +", "아이오딘화 칼륨 두 숟가락", f"→ {bl('산소')}가 발생해요"], w=5.2, size=28).move_to([4.15, 0.5, 0])
        self.say("두 촛불을 아크릴 통으로 덮으면 어떻게 될까요?",
                 "양초 두 개에 불을 붙이고, 한쪽에는 묽은 과산화 수소수와 아이오딘화 칼륨을 넣은 비커를 놓아요. 산소가 발생해요.")
        self.play(FadeIn(base), FadeIn(c1), FadeIn(c2), FadeIn(bk), FadeIn(n1), FadeIn(n2), run_time=0.8)
        self.play(FadeIn(info, shift=LEFT * 0.2), run_time=0.5)
        self.settle()
        cv1 = K.cover(2.6, 2.9, -4.6).shift(UP * y0)
        cv2 = K.cover(2.6, 2.9, -1.0).shift(UP * y0)
        safe = K.text_card([r("안전"), "과산화 수소수가 피부에 묻으면", "흐르는 물로 오래 씻어요", "연소한 뒤 아크릴 통이", "뜨거울 수 있어요"],
                           w=5.2, size=28, stroke=RED, fill="#FFF1EE").move_to([4.15, 0.5, 0])
        self.say("크기가 같은 아크릴 통 두 개로 동시에 덮어요",
                 "크기가 같은 아크릴 통 두 개로 동시에 덮어요. 과산화 수소수가 피부에 묻으면 물로 오래 씻어요.")
        self.play(FadeIn(cv1, shift=DOWN * 0.4), FadeIn(cv2, shift=DOWN * 0.4), FadeOut(info), FadeIn(safe), run_time=0.8)
        self.settle()
        self.pause_screen(5, "어느 촛불이 더 오래 탈까요?")
        sm1 = K.smoke_curl(0.7).move_to(c1.wick_top + UP * 0.45 + RIGHT * -4.6 * 0)
        sm1.move_to([-4.6, c1.wick_top[1] + y0 + 0.45, 0])
        self.say(f"㉠ 양초만 덮은 촛불이 {r('먼저 꺼졌어요')}", "양초만 덮은 촛불 가가 먼저 꺼졌어요.")
        self.play(FadeOut(c1.flame), FadeIn(sm1), run_time=0.8)
        self.settle()
        sm2 = K.smoke_curl(0.7).move_to([-1.6, c2.wick_top[1] + y0 + 0.45, 0])
        self.say(f"㉡은 조금 더 {o('오래 타다가')} 꺼졌어요", "비커와 함께 덮은 촛불 나는 조금 더 오래 타다가 꺼졌어요.")
        self.play(Indicate(c2.flame, color=ORANGE), run_time=0.9)
        self.play(FadeOut(c2.flame), FadeIn(sm2), run_time=0.7)
        self.settle()
        why = K.text_card([f"{bl('산소')}는 물질이 타는 것을 {o('돕는')} 성질이 있어요",
                           "㉠이 꺼졌을 때도 산소는 남아 있지만,", f"탈 만큼 {r('충분하지 않아요')}"], w=5.6, size=27).move_to([4.0, 0.5, 0])
        self.say(f"{bl('산소')}는 물질이 타는 것을 {o('도와요')}",
                 "산소는 물질이 타는 것을 돕는 성질이 있어요. 가가 꺼졌을 때도 산소는 남아 있지만, 탈 만큼 충분하지 않아요.")
        self.play(FadeOut(safe), FadeIn(why, shift=LEFT * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 실험 2 : 온도 ──
    def temperature(self):
        self.section("실험 2 · 온도")
        y0 = -2.3
        base = K.table_top(9.0, y0).move_to([-1.6, y0 - 0.16, 0])

        def rig(heat, head, wood):
            m = K.plate_rig(heat, head, wood, d=1.5).scale(1.05)
            m.shift([-1.6 - m.center[0] * 0, y0 - m.get_bottom()[1], 0])
            return m
        rg = rig(0.0, "raw", "raw")
        lh = K.label("성냥의 머리 부분", MATCH_COL, 26).move_to([-3.7, 1.35, 0])
        lw = K.label("성냥의 나무 부분", "#8A5A2B", 26).move_to([0.5, 1.35, 0])
        note = K.text_card(["철판 가운데로부터", f"{o('같은 거리')}에 놓고", "철판 가운데를 가열해요"], w=4.6, size=28).move_to([4.6, 0.6, 0])
        self.say(f"성냥의 머리 부분과 나무 부분을 {o('같은 거리')}에 놓아요",
                 "성냥의 머리 부분과 나무 부분을 철판 가운데로부터 같은 거리에 놓고, 가운데를 가열해요.")
        self.play(FadeIn(base), FadeIn(rg), FadeIn(lh), FadeIn(lw), FadeIn(note), run_time=0.8)
        self.settle()
        safe = K.safety_note("철판·삼발이가 매우 뜨거워요 — 식을 때까지 만지지 않기 · 얼굴을 가까이하지 않기", w=11.6, size=26).move_to([0.2, 2.45, 0])
        self.say("안전: 철판과 삼발이는 식을 때까지 만지지 않아요",
                 "철판과 삼발이는 매우 뜨거우니 식을 때까지 만지지 않고, 얼굴을 가까이하지 않아요.")
        self.play(FadeIn(safe), Transform(rg, rig(0.6, "raw", "raw")), run_time=0.8)
        self.settle()
        self.pause_screen(5, "어느 쪽에 먼저 불이 붙을까요?")
        self.say(f"{r('성냥의 머리 부분')}에 먼저 불이 붙었어요",
                 "머리 부분에 먼저 불이 붙었어요. 불을 직접 붙이지 않았는데도 탔어요. 나무 부분은 검게 변하고 있어요.")
        self.play(FadeOut(safe), Transform(rg, rig(0.9, "fire", "dark")), run_time=1.0)
        self.settle()
        self.say("더 오래 가열하자 나무 부분에도 불이 붙었어요",
                 "더 오래 가열하자 나무 부분에도 불이 붙었어요.")
        self.play(Transform(rg, rig(1.0, "burnt", "fire")), run_time=1.0)
        self.settle()
        why = K.text_card([f"성냥의 머리 부분의 {r('발화점')}이", "나무 부분보다 낮기 때문이에요"], w=4.6, size=28).move_to([4.6, 0.6, 0])
        self.say(f"머리 부분의 {r('발화점')}이 더 {o('낮기')} 때문이에요",
                 "머리 부분이 먼저 불이 붙은 까닭은 머리 부분의 발화점이 더 낮기 때문이에요.")
        self.play(FadeOut(note), FadeIn(why, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리: 연소와 발화점 ──
    def define(self):
        self.section("정리해요")
        a = K.text_card([f"{o('연소')}: 물질이 {bl('산소')}와 만나", f"빛과 열을 내면서 타는 현상"], w=6.2, size=32).move_to([-3.3, 1.2, 0])
        b = K.text_card([f"{r('발화점')}: 어떤 물질이", "타기 시작하는 온도"], w=6.2, size=32).move_to([3.3, 1.2, 0])
        a2 = K.text_card([f"공기 중에 산소가 {o('많을수록')}", "연소가 활발하게 일어나요"], w=6.2, size=28).move_to([-3.3, -1.0, 0])
        b2 = K.text_card([f"온도가 발화점 {r('이상')}이 되어야 타요", "발화점은 물질에 따라 달라요"], w=6.2, size=28).move_to([3.3, -1.0, 0])
        self.say(f"물질이 산소와 만나 빛과 열을 내며 타는 현상이 {o('연소')}예요",
                 "물질이 산소와 만나 빛과 열을 내면서 타는 현상을 연소라고 해요. 산소가 많을수록 연소가 활발해요.")
        self.play(FadeIn(a), FadeIn(a2), run_time=0.8)
        self.settle()
        self.say(f"물질이 타기 시작하는 온도가 {r('발화점')}이에요",
                 "물질이 타기 시작하는 온도를 발화점이라고 해요. 발화점은 물질에 따라 달라요.")
        self.play(FadeIn(b), FadeIn(b2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 연소의 조건 ──
    def conditions(self):
        self.section("연소의 조건")
        y0 = -1.9
        names = ["탈 물질", "산소(공기)", "발화점 이상의 온도"]

        def chips(on):
            return VGroup(*[K.cond_chip(n, on[i], w=4.2, size=30) for i, n in enumerate(names)]).arrange(DOWN, buff=0.3).move_to([3.6, 0.4, 0])

        def scene_(on):
            gq = VGroup()
            if on[0]:
                gq.add(K.campfire(on[1] and on[2], 1.25).shift([-3.2, y0, 0]))
            else:
                gq.add(T("(탈 물질 없음)", 30, SOFT).move_to([-3.2, y0 + 0.5, 0]))
            if on[0] and not on[1]:
                gq.add(K.cover(3.2, 3.5, -3.2).shift(UP * y0))
                gq.add(K.label("통으로 덮어 공기를 막았어요", INK, 24).move_to([-3.2, y0 + 3.9, 0]))
            if on[0] and on[1] and not on[2]:
                gq.add(K.label("온도가 발화점보다 낮아요", INK, 24).move_to([-3.2, y0 + 2.6, 0]))
            if on[0] and not (on[1] and on[2]):
                gq.add(K.smoke_curl(0.8).move_to([-3.2, y0 + 1.1, 0]))
            return gq
        ground = K.table_top(6.0, y0).move_to([-3.2, y0 - 0.16, 0])
        on = [True, True, True]
        sc, ch = scene_(on), chips(on)
        self.say(f"세 가지 조건이 {g('모두')} 있으면 연소가 일어나요",
                 "탈 물질, 산소, 발화점 이상의 온도가 모두 있으면 연소가 일어나요.")
        self.play(FadeIn(ground), FadeIn(sc), FadeIn(ch, lag_ratio=0.2), run_time=1.0)
        self.settle()
        for k, (sub, narr) in enumerate([
                (f"산소를 막으면 → {r('꺼져요')}", "통으로 덮어 공기를 막으면 꺼져요."),
                (f"온도가 발화점보다 낮으면 → {r('꺼져요')}", "온도가 발화점보다 낮으면 꺼져요."),
                (f"탈 물질이 없으면 → {r('타지 않아요')}", "탈 물질이 없으면 연소가 일어나지 않아요.")]):
            idx = [1, 2, 0][k]
            on2 = [True, True, True]
            on2[idx] = False
            self.say(sub, narr)
            self.play(Transform(sc, scene_(on2)), Transform(ch, chips(on2)), run_time=0.9)
            self.settle()
        self.say(f"조건이 {r('하나라도')} 없으면 연소가 일어나지 않아요",
                 "조건이 하나라도 없으면 연소는 일어나지 않아요.")
        self.play(Transform(sc, scene_(on)), Transform(ch, chips(on)), run_time=0.9)
        self.play(Circumscribe(ch, color=ORANGE), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각+ : 불을 직접 붙이지 않아도 ──
    def life(self):
        self.section("생활 속 연소")
        from kit_s3u12 import bin_box
        cols = [("탈 물질", "#8A5A2B", ["꺼져 가는 모닥불에", "장작 더 넣기"]),
                ("산소", "#2F6FD6", ["숯불에 부채질하기", "송풍기로 공기 넣기"]),
                ("발화점 이상의 온도", RED, ["마른나무를 마찰해 불 피우기", "볼록 렌즈로 햇빛 모으기", "가열한 철판 위의 성냥"])]
        boxes = VGroup()
        for nm, col, items in cols:
            bx = bin_box(nm, 4.2, 4.5, col, 32)
            ws = VGroup(*[K.word_card(t, w=3.9, h=0.7, size=24) for t in items]).arrange(DOWN, buff=0.16)
            ws.move_to(bx.box.get_center() + DOWN * 0.3)
            boxes.add(VGroup(bx, ws))
        boxes.arrange(RIGHT, buff=0.3).move_to([0, 0.25, 0])
        self.say("불을 직접 붙이지 않아도 조건을 채우면 연소가 일어나요",
                 "불을 직접 붙이지 않아도 조건을 채우면 연소가 일어나요.")
        self.play(FadeIn(VGroup(*[b[0] for b in boxes])), run_time=0.6)
        self.play(FadeIn(boxes[2][1], lag_ratio=0.2), run_time=0.8)
        self.settle()
        self.say(f"마찰·볼록 렌즈·가열한 철판은 {r('온도')}를 높여요",
                 "마찰, 볼록 렌즈, 가열한 철판은 온도를 높이고, 부채질과 송풍기는 산소를, 장작은 탈 물질을 채워 줘요.")
        self.play(FadeIn(boxes[1][1], lag_ratio=0.2), FadeIn(boxes[0][1], lag_ratio=0.2), run_time=0.9)
        self.settle()
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        fire = K.campfire(True, 1.0).move_to([-4.6, -0.3, 0])
        card = K.text_card(["물질이 연소하려면 탈 물질과", f"{bl('산')}{bl('소')}, 발화점 이상의 온도가", "필요합니다."], w=7.4, size=36).move_to([2.3, 1.0, 0])
        think = K.text_card(["마른나무를 마찰하면 불이 붙는 까닭:", f"마찰로 생긴 {r('열')} 때문에 온도가 발화점 이상으로 높아져서"], w=7.4, size=26).move_to([2.3, -1.3, 0])
        self.say(f"연소하려면 탈 물질, {bl('산소')}, 발화점 이상의 온도가 필요해요",
                 "물질이 연소하려면 탈 물질과 산소, 발화점 이상의 온도가 필요해요.")
        self.play(FadeIn(fire), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        self.settle()
        self.say(f"마찰로 생긴 {r('열')}이 온도를 발화점 이상으로 높여요",
                 "마른나무를 마찰하면 마찰로 생긴 열 때문에 온도가 발화점 이상으로 높아져요.")
        self.play(FadeIn(think, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)


MATCH_COL = K.MATCH
