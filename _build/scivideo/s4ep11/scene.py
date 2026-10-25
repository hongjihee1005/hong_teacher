"""「과학 원리 돋보기」 4학년 11화 — 강 주변 지형 (4-1 3단원 땅의 변화 3차시, 화 코드 4-1-3-b)

바탕: grade4/science/sem1/u3-2.html(원본 _build_tb/src/u3-2.html) — 도입(강물은 산에서 바다로), 강 지도 ①상류·②중류·③하류 가까이 보기,
붙임딱지(강폭·경사·돌), 물 흐름(상류 빠르게 → 침식 활발, 하류 느리게 → 퇴적 활발, 세 작용은 어디서나 함께),
강 주변 지형(폭포·계곡 상류, 구불구불 중류, 모래사장·넓고 편평한 땅 하류), 한눈에 쏙.
최종: ./make_final.sh s4ep11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker,
                   always_redraw, linear, Arrow, Dot, SurroundingRectangle, Transform)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S4Ep11(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 11
    EP_TITLE = "강 주변 지형"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.compare()
        self.works()
        self.landforms()
        self.summary()
        self.closing(f"강 상류는 {r('침식')} 작용, 강 하류는 {g('퇴적')} 작용이 활발해요\n그래서 강 상류와 강 하류의 지형이 달라요",
                     next_preview="4학년 12화 · 화산이 궁금해!")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        mp = K.river_map().scale(0.92).move_to([0, 0.15, 0])
        self.say("강물은 어디에서 어디로 흐를까요?",
                 "보트를 타고 물살을 따라 내려가는 래프팅은 강의 어디에서 출발하면 좋을까요? 먼저, 강물은 어디에서 어디로 흐를까요?")
        self.play(FadeIn(mp), run_time=0.8)
        self.pause_screen(5, "강물은 어디에서 어디로?")
        arr = Arrow([-4.4, 1.9, 0], [3.2, -0.6, 0], color=ORANGE, stroke_width=10, buff=0)
        self.say(f"강물은 높은 {o('산')}에서 낮은 {o('바다')}로 흘러요",
                 "강물은 높은 산에서 시작해 낮은 바다로 흘러가요. 물은 높은 곳에서 낮은 곳으로 흐르니까요.")
        self.play(Create(arr), run_time=1.0)
        self.settle()
        self.play(FadeOut(arr), run_time=0.3)
        self.mp = mp

    # ── 관찰해요 ──
    def observe(self):
        self.section("관찰해요")
        mp = self.mp
        sp = {k: mp.get_center() + (v - K.river_map().get_center()) * 0.92 for k, v in mp.spots.items()}
        marks = {k: K.spot_mark(n).move_to(sp[k] + UP * 0.55) for k, n in (("up", "①"), ("mid", "②"), ("down", "③"))}
        self.say(f"산에 가까운 곳은 {o('강 상류')}, 바다에 가까운 곳은 {o('강 하류')}예요",
                 "산에 가까운 곳을 강 상류, 바다에 가까운 곳을 강 하류라고 해요. 그 중간쯤은 강 중류예요.")
        self.play(*[FadeIn(m, scale=1.4) for m in marks.values()], run_time=0.6)
        nm = {"up": "① 강 상류", "mid": "② 강 중류", "down": "③ 강 하류"}
        pics = {"up": K.near_up, "mid": K.near_mid, "down": K.near_down}
        texts = {
            "up": [("강폭이 좁아요", (1.4, -1.0)), ("경사가 급한 계곡", (-1.6, 1.3)), ("폭포", (1.3, 0.9)),
                   ("커다란 바위", (-1.5, -1.0))],
            "mid": [("구불구불 흘러요", (0, 1.35))],
            "down": [("강폭이 넓어요", (0, -0.45)), ("고운 모래와 흙", (1.5, -1.55)), ("넓고 편평한 땅", (-1.5, 1.0))],
        }
        says = {
            "up": ("강 상류: 강폭이 좁고, 경사가 급해요",
                   "강 상류를 가까이 볼까요? 강폭이 좁고 강의 경사가 급해요. 물이 빠르게 흐르고, 커다란 바위와 모난 돌이 많아요. 폭포나 계곡을 볼 수 있어요."),
            "mid": ("강 중류: 강이 구불구불하게 흘러요",
                    "강 중류는 강 상류와 강 하류의 중간쯤이에요. 강이 구불구불하게 흘러요."),
            "down": ("강 하류: 강폭이 넓고, 경사가 완만해요",
                     "강 하류는 강폭이 넓고 강의 경사가 완만해요. 물이 느리게 흐르고, 고운 모래와 흙으로 이루어진 넓고 편평한 땅을 볼 수 있어요."),
        }
        for k in ("up", "mid", "down"):
            small = VGroup(mp, *marks.values())
            self.play(small.animate.scale(0.42).move_to([-4.45, 1.35, 0]), run_time=0.6) if k == "up" else None
            pic = pics[k]().scale(0.9).move_to([2.0, 0.05, 0])
            title = K.label(nm[k], INK, 32).next_to(pic, UP, buff=0.12)
            ring = SurroundingRectangle(marks[k], buff=0.06, color=RED, corner_radius=0.2)
            labs = VGroup(*[K.label(t, INK, 26).move_to(pic.get_center() + np.array([x, y, 0]) * 0.95) for t, (x, y) in texts[k]])
            self.say(*says[k])
            self.play(FadeIn(pic), FadeIn(title), Create(ring), run_time=0.7)
            self.play(FadeIn(labs, lag_ratio=0.3), run_time=1.0)
            self.settle()
            self.play(FadeOut(VGroup(pic, title, ring, labs)), run_time=0.4)
        clear_stage(self)

    # ── 비교 ──
    def compare(self):
        self.section("붙임딱지로 정리")
        up = K.bin_box("강 상류", 6.2, 4.4, RED, 38).move_to([-3.3, 0.2, 0])
        dn = K.bin_box("강 하류", 6.2, 4.4, BLUE, 38).move_to([3.3, 0.2, 0])
        self.play(FadeIn(up), FadeIn(dn), run_time=0.6)
        rows = [("강폭이 좁아요", "강폭이 넓어요"), ("강의 경사가 급해요", "강의 경사가 완만해요"),
                ("바위나 큰 돌이 많아요", "모래나 흙이 많아요")]
        self.say("강 상류와 강 하류의 특징을 붙임딱지로 정리해요", "강 상류와 강 하류의 특징을 붙임딱지로 정리해 봐요.")
        narr = ["강폭은 강 상류가 좁고, 강 하류가 넓어요.", "강의 경사는 강 상류가 급하고, 강 하류가 완만해요.",
                "강 상류에는 바위나 큰 돌이 많고, 강 하류에는 모래나 흙이 많아요."]
        for i, (a, b) in enumerate(rows):
            ca = K.label(a, INK, 32, "#FFF4D6").move_to([-3.3, 1.1 - i * 1.15, 0])
            cb = K.label(b, INK, 32, "#FFF4D6").move_to([3.3, 1.1 - i * 1.15, 0])
            self.say(f"{r(a)}  ↔  {b}" if False else f"상류: {a} / 하류: {b}", narr[i])
            self.play(FadeIn(ca, shift=DOWN * 0.3), FadeIn(cb, shift=DOWN * 0.3), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 물의 작용 ──
    def works(self):
        self.section("흐르는 물의 작용")
        L = K.flow_slope(True).move_to([-3.4, 0.2, 0])
        R = K.flow_slope(False).move_to([3.4, 0.2, 0])
        lt = T("강 상류 · 경사가 급해요", 32).move_to([-3.4, 2.3, 0])
        rt = T("강 하류 · 경사가 완만해요", 32).move_to([3.4, 2.3, 0])
        self.say("두 곳의 물 흐름을 비교해 봐요", "강 상류와 강 하류의 물 흐름을 비교해 봐요. 점은 물에 실려 가는 돌과 흙이에요.")
        self.play(FadeIn(L), FadeIn(R), FadeIn(lt), FadeIn(rt), run_time=0.7)
        tt = ValueTracker(0.0)
        a0, a1 = L[1].get_start(), L[1].get_end()
        b0, b1 = R[1].get_start(), R[1].get_end()

        def dots():
            gg = VGroup()
            t = tt.get_value()
            for i in range(10):
                u = (t * 0.55 + i / 10) % 1
                gg.add(Dot(a0 + (a1 - a0) * u, radius=0.07, color="#5A3C1E"))
                v = (t * 0.12 + i / 10) % 1
                gg.add(Dot(b0 + (b1 - b0) * v, radius=0.06, color="#5A3C1E"))
            n = min(14, int(t * 1.5))
            for i in range(n):
                gg.add(Dot(b1 + np.array([-0.15 - i * 0.12, 0.07 + (i % 3) * 0.04, 0]), radius=0.06, color="#5A3C1E"))
            return gg
        dm = always_redraw(dots)
        self.add(dm)
        fast = M(r("빠르게!"), 34).move_to([-2.4, 1.2, 0])
        slow = M(g("느리게…"), 34).move_to([3.4, 1.0, 0])
        self.play(tt.animate.set_value(4.0), FadeIn(fast), FadeIn(slow), run_time=4.0, rate_func=linear)
        self.pause_screen(6, "흙 언덕 실험과 비교하면?")
        self.say(f"강 상류는 물이 빠르게 흘러 {r('침식 작용')}이 활발해요",
                 "흙 언덕에서 흙이 많이 깎인 위쪽과 비슷한 곳은 강 상류예요. 강 상류는 경사가 급해 물이 빠르게 흘러요. 그래서 침식 작용이 퇴적 작용보다 활발해요.")
        self.play(tt.animate.set_value(7.0), Indicate(lt, color=RED), run_time=3.0, rate_func=linear)
        self.say(f"강 하류는 물이 느리게 흘러 {g('퇴적 작용')}이 활발해요",
                 "흙이 많이 쌓인 아래쪽과 비슷한 곳은 강 하류예요. 강 하류는 경사가 완만해 물이 느리게 흘러요. 그래서 운반된 돌이나 흙이 쌓이는 퇴적 작용이 활발해요.")
        self.play(tt.animate.set_value(10.0), Indicate(rt, color=GREEN), run_time=3.0, rate_func=linear)
        dm.clear_updaters()
        self.say(f"세 작용은 어디서나 함께 일어나요. {o('더 활발한 작용')}이 달라요",
                 "침식, 운반, 퇴적 작용은 강의 어디에서나 함께 일어나요. 다만 곳에 따라 더 활발한 작용이 달라요.")
        self.settle()
        clear_stage(self)

    # ── 강 주변 지형 ──
    def landforms(self):
        self.section("강 주변 지형")
        self.say("오랜 시간 흐르는 강물이 강 주변 지형을 서서히 바꾸었어요",
                 "오랜 시간 흐르는 강물이 침식, 운반, 퇴적 작용을 일으키며 강 주변 지형을 서서히 바꾸었어요.")
        cols = [("강 상류", RED, ["폭포", "계곡"]), ("강 중류", ORANGE, ["구불구불 흐르는 강"]),
                ("강 하류", BLUE, ["모래사장", "넓고 편평한 땅"])]
        boxes = VGroup()
        for i, (nm, col, items) in enumerate(cols):
            b = K.bin_box(nm, 4.2, 4.4, col, 36).move_to([(i - 1) * 4.45, 0.2, 0])
            boxes.add(b)
        self.play(FadeIn(boxes), run_time=0.6)
        narr = ["폭포와 계곡은 강 상류에서 볼 수 있어요.", "강 중류에서는 구불구불 흐르는 강을 볼 수 있어요.",
                "모래사장과 넓고 편평한 땅은 강 하류에서 볼 수 있어요."]
        subs = ["강 상류: 폭포, 계곡", "강 중류: 구불구불 흐르는 강", "강 하류: 모래사장, 넓고 편평한 땅"]
        pics = [K.near_up(), K.near_mid(), K.near_down()]
        for i, (nm, col, items) in enumerate(cols):
            pic = K.fit(pics[i], 3.5, 1.9).move_to(boxes[i].box.get_center() + UP * 0.55)
            words = VGroup(*[K.label(w, col, 28) for w in items]).arrange(DOWN, buff=0.12)
            words.next_to(pic, DOWN, buff=0.15)
            self.say(subs[i], narr[i])
            self.play(FadeIn(pic), FadeIn(words, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"강 상류에서는 {r('침식')} 작용이 활발하게 일어나고,",
                            f"강 하류에서는 {g('퇴적')} 작용이 활발하게 일어납니다."], w=12.4, size=44).move_to([0, 0.6, 0])
        self.say(f"강 상류는 {r('침식')}, 강 하류는 {g('퇴적')} 작용이 활발해요",
                 "강 상류에서는 침식 작용이 활발하게 일어나고, 강 하류에서는 퇴적 작용이 활발하게 일어나요. 그래서 강 상류와 강 하류의 지형이 서로 달라요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
