"""「과학 원리 돋보기」 4학년 12화 — 화산이 궁금해! (4-1 3단원 땅의 변화 4차시, 화 코드 4-1-3-c)

바탕: grade4/science/sem1/u3-3.html(원본 _build_tb/src/u3-3.html) — 도입(한라산 꼭대기 움푹 파인 곳·백록담),
화산과 화산이 아닌 산 비교(한라산·므라피산 / 지리산·안나푸르나산: 봉우리 하나, 분화구, 연기, 눈은 특징 아님),
화산 활동 그림 영상(마그마 → 연기 → 회색 가루 → 돌 조각 → 붉은 액체 → 식어 굳음), 분출물 기체·액체·고체,
낱말(마그마·용암·분화구·화산 분출물), 화산섬(제주도·울릉도·독도), 한눈에 쏙. 사진 대신 그림.
최종: ./make_final.sh s4ep12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker,
                   always_redraw, linear, Arrow, Line, SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def volc(o_, gw=12.4):
    """화산 활동 한 장면(앱 u3-3 volcano(o)를 본뜸)"""
    gg = VGroup(K.rect(gw, 0.85, "#8A7458", y=-2.02, sw=0))
    if o_.get("under"):
        gg.add(K.magma_chamber(o_["under"]))
    body = K.volcano_body(7.0, 3.0, -1.6)
    gg.add(body)
    if o_.get("under"):
        gg.add(K.P([(-0.12, -1.6), (-0.08, 1.3), (0.08, 1.3), (0.12, -1.6)], K.MAGMA, K.MAGMA, 0, op=0.35 + 0.6 * o_["under"]))
    if o_.get("lava"):
        gg.add(K.lava(o_["lava"], o_.get("cool", 0)))
    if o_.get("gas"):
        gg.add(K.gas_puffs(o_.get("gt", 0), o_["gas"]))
    if o_.get("ash"):
        gg.add(K.ash_cloud(o_["ash"], o_.get("ashA", 1)))
    if o_.get("bomb"):
        gg.add(K.bombs(o_.get("bt", 0), o_["bomb"]))
    return gg


class S4Ep12(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 12
    EP_TITLE = "화산이 궁금해!"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.compare()
        self.eruption()
        self.sort()
        self.words()
        self.islands()
        self.summary()
        self.closing(f"마그마가 지표면을 뚫고 나와 만들어진 지형이 {o('화산')}이에요\n화산 활동으로 나오는 물질은 {r('화산 분출물')}이에요",
                     next_preview="4학년 13화 · 화강암과 현무암")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        m = K.halla().scale(1.25).move_to([0, 0.2, 0])
        lab = K.label("제주도 한라산(그림)", INK, 30).move_to([0, -1.85, 0])
        self.say("한라산 꼭대기는 움푹 파여 있고, 물이 고여 있어요",
                 "제주도 한라산의 꼭대기예요. 움푹 파인 곳에 물이 고여 있어요. 이곳을 백록담이라고 해요.")
        self.play(FadeIn(m), FadeIn(lab), run_time=0.8)
        ring = SurroundingRectangle(m[1], buff=0.15, color=ORANGE, corner_radius=0.2)
        self.play(Create(ring), run_time=0.6)
        self.say("한라산 꼭대기가 움푹 파인 까닭은 무엇일까요?",
                 "한라산 꼭대기가 움푹 파인 까닭은 무엇일까요? 비나 바람에 깎였을까요, 아니면 산 속에서 어떤 물질이 나온 뒤 만들어졌을까요?")
        self.pause_screen(5, "꼭대기가 움푹 파인 까닭은?")
        self.settle()
        clear_stage(self)

    # ── 화산과 화산이 아닌 산 ──
    def compare(self):
        self.section("화산 살펴보기")
        h1 = K.bin_box("화산", 6.5, 4.6, RED, 36).move_to([-3.4, 0.25, 0])
        h2 = K.bin_box("화산이 아닌 산", 6.5, 4.6, BLUE, 36).move_to([3.4, 0.25, 0])
        a = VGroup(K.halla().scale(0.5), T("한라산", 26)).arrange(DOWN, buff=0.1)
        b = VGroup(K.smoky_volcano().scale(0.5), T("므라피산", 26)).arrange(DOWN, buff=0.1)
        c = VGroup(K.ridge().scale(0.5), T("지리산", 26)).arrange(DOWN, buff=0.1)
        d = VGroup(K.ridge().scale(0.5), T("안나푸르나산", 26)).arrange(DOWN, buff=0.1)
        for p_ in (a[0], b[0], c[0], d[0]):
            K.fit(p_, 2.8, 1.6)
        for q in (a, b, c, d):
            q.arrange(DOWN, buff=0.1)
        VGroup(a, b).arrange(RIGHT, buff=0.3).move_to(h1.box.get_center() + DOWN * 0.15)
        VGroup(c, d).arrange(RIGHT, buff=0.3).move_to(h2.box.get_center() + DOWN * 0.15)
        self.say("화산과 화산이 아닌 산의 모습을 비교해요",
                 "화산과 화산이 아닌 산을 비교해 봐요. 한라산과 므라피산은 화산, 지리산과 안나푸르나산은 화산이 아닌 산이에요.")
        self.play(FadeIn(h1), FadeIn(h2), run_time=0.5)
        self.play(FadeIn(VGroup(a, b, c, d), lag_ratio=0.2), run_time=1.2)
        self.say(f"화산은 {o('봉우리가 하나')}인 경우가 많아요",
                 "화산은 봉우리가 하나인 경우가 많아요. 화산이 아닌 산은 봉우리가 여러 개 이어져 있지요.")
        self.play(Indicate(VGroup(a[0], b[0]), color=ORANGE, scale_factor=1.06), run_time=1.0)
        self.say(f"꼭대기에 {o('움푹 파인 곳')}이 있거나 {o('연기')}가 나오기도 해요",
                 "화산은 꼭대기에 움푹 파인 곳이 있는 것도 있고, 꼭대기에서 연기가 나오기도 해요.")
        self.play(Indicate(a[0][1], color=ORANGE, scale_factor=1.4), Indicate(b[0][2:], color=ORANGE), run_time=1.0)
        self.say(f"꼭대기에 쌓인 눈은 화산의 특징이 {r('아니에요')}",
                 "꼭대기에 쌓인 눈은 화산의 특징이 아니에요. 화산이 아닌 산에도 눈이 쌓여요. 화산은 크기와 모양이 다양해요.")
        self.settle()
        clear_stage(self)

    # ── 화산 활동 ──
    def eruption(self):
        self.section("화산 활동 살펴보기")
        t = ValueTracker(0.0)

        def frame():
            x = t.get_value()
            o_ = {"gt": x * 0.35, "bt": x * 0.7}
            if x < 4:
                o_["under"] = min(1, x / 3 + 0.01)
            elif x < 8:
                o_["gas"] = min(1, (x - 4) / 1.5)
            elif x < 12:
                o_.update(gas=1, ash=(x - 8) / 4 + 0.01, ashA=1)
            elif x < 16:
                o_.update(gas=1, ash=1, ashA=1 - 0.5 * (x - 12) / 4, bomb=1)
            elif x < 21:
                o_.update(gas=0.7, ash=1, ashA=0.35, lava=min(1, (x - 16) / 4))
            else:
                o_.update(gas=0.4, ash=1, ashA=0.2, lava=1, cool=min(1, (x - 21) / 4))
            return volc(o_)
        sc = always_redraw(frame)
        self.add(sc)
        mg = K.label("마그마", K.MAGMA, 30).move_to([2.9, -2.05, 0])
        self.say("땅속 깊은 곳에는 암석이 녹은 물질, 마그마가 있어요",
                 "땅속 깊은 곳에는 암석이 녹은 물질인 마그마가 있어요. 마그마가 지표면의 약한 부분으로 올라와요.")
        self.play(FadeIn(mg), t.animate.set_value(3.9), run_time=3.5, rate_func=linear)
        self.play(FadeOut(mg), run_time=0.3)
        self.say("꼭대기에서 무엇이 나오는지 살펴봐요",
                 "꼭대기에서 무엇이 나오는지, 색깔과 움직임을 살펴봐요.")
        self.play(t.animate.set_value(8.0), run_time=3.0, rate_func=linear)
        self.say("회색 가루가 하늘 높이 퍼져요", "회색 가루가 하늘 높이 퍼져 주변이 뿌옇게 돼요.")
        self.play(t.animate.set_value(12.0), run_time=3.0, rate_func=linear)
        self.say("크고 작은 돌 조각이 튀어 나와요", "크고 작은 돌 조각이 튀어 나와요.")
        self.play(t.animate.set_value(16.0), run_time=3.0, rate_func=linear)
        self.say("붉은색 액체가 산비탈을 따라 흘러내려요", "붉은색 액체가 쏟아져 나와 산비탈을 따라 흘러내려요.")
        self.play(t.animate.set_value(21.0), run_time=3.2, rate_func=linear)
        self.say("흘러내린 붉은 액체는 식어서 검게 굳어요", "흘러내린 붉은 액체는 시간이 지나며 식어 검게 굳어요.")
        self.play(t.animate.set_value(25.0), run_time=3.0, rate_func=linear)
        sc.clear_updaters()
        self.pause_screen(6, "어떤 물질들이 나왔나요?")
        self.say(f"연기, 회색 가루, 돌 조각, 붉은 액체가 나왔어요",
                 "연기, 회색 가루, 돌 조각, 붉은 액체가 나왔어요. 화산에 따라 한 가지만 나오기도 해요.")
        self.settle()
        clear_stage(self)

    # ── 분출물 ──
    def sort(self):
        self.section("화산 분출물")
        self.say(f"화산 활동으로 나오는 물질을 {o('화산 분출물')}이라고 해요",
                 "화산 활동으로 나오는 물질을 화산 분출물이라고 해요. 기체, 액체, 고체로 나누어 봐요.")
        cols = [("기체", BLUE), ("액체", RED), ("고체", "#6B5B4B")]
        bx = VGroup(*[K.bin_box(n, 4.2, 4.3, c, 38).move_to([(i - 1) * 4.45, 0.2, 0]) for i, (n, c) in enumerate(cols)])
        self.play(FadeIn(bx), run_time=0.5)
        gas = K.gas_puffs(0.3, 1, (0, 0)).scale(0.8)
        lv = VGroup(K.P([(-1.2, -0.3), (1.2, -0.3), (1.2, -0.5), (-1.2, -0.5)], "#7B6D5D", K.MT_D, 0))
        m = K.VMobject(stroke_color=K.LAVA, stroke_width=18)
        m.set_points_smoothly([[-1.1, 0.4, 0], [-0.3, 0.1, 0], [0.4, -0.15, 0], [1.1, -0.3, 0]])
        lv.add(m)
        ash = K.ash_cloud(0.8, 1, (0, -0.6)).scale(0.6)
        bm = VGroup(*[K.P([(-0.09, 0), (-0.03, 0.1), (0.09, 0.06), (0.08, -0.06), (-0.04, -0.09)], "#3A2F28", "#3A2F28", 1).scale(2.2).shift([x, y, 0])
                      for x, y in ((-0.6, 0), (0.1, 0.2), (0.6, -0.15))])
        items = [(0, gas, "화산 가스", "기체인 화산 가스예요. 꼭대기에서 피어오르는 연기처럼 생긴 것이에요."),
                 (1, lv, "용암", "붉게 흘러내린 것은 용암이에요. 용암은 액체예요."),
                 (2, VGroup(ash, bm), "화산재 · 화산 암석 조각", "회색 가루인 화산재와 돌 조각인 화산 암석 조각은 고체예요.")]
        n2 = 0
        for i, pic, nm, narr in items:
            b = bx[i].box
            if i == 2:
                ash.move_to([0, 0.9, 0]); bm.move_to([0, -0.3, 0])
            K.fit(pic, 3.0, 2.2 if i == 2 else 1.6).move_to(b.get_center() + np.array([0, 0.25, 0]))
            lb = K.label(nm, INK, 30 if i < 2 else 26).next_to(pic, DOWN, buff=0.12)
            self.say("화산재와 화산 암석 조각 → 고체" if i == 2 else f"{nm} → {cols[i][0]}", narr)
            self.play(FadeIn(pic), FadeIn(lb), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 낱말 ──
    def words(self):
        self.section("화산과 관련된 낱말")
        v = volc({"under": 1, "lava": 0.75, "gas": 0.6, "gt": 0.3}, gw=8.0).scale(0.72).move_to([-3.2, 0.3, 0])
        self.play(FadeIn(v), run_time=0.6)
        tops = v[2].get_top()
        defs = [("마그마", "땅속 깊은 곳에서 암석이 녹아 있는 물질", K.MAGMA,
                 v[1][0].get_center(), "마그마는 땅속 깊은 곳에서 암석이 녹아 있는 물질이에요."),
                ("용암", "마그마가 지표면으로 흘러나온 것", "#E08A00",
                 v[4][0].point_from_proportion(0.6), "용암은 마그마가 지표면으로 흘러나온 것이에요."),
                ("분화구", "화산 꼭대기의 움푹 파인 곳", "#0F3B5C",
                 v[2][1].get_center(), "분화구는 화산 꼭대기의 움푹 파인 곳이에요.")]
        rows = VGroup()
        for i, (nm, d, col, pt, narr) in enumerate(defs):
            row = VGroup(K.label(nm, col, 34), T(d, 26)).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
            row.move_to([3.6, (-1.25, 0.35, 1.95)[i], 0])
            rows.add(row)
            arr = Arrow(row[0].get_left() + LEFT * 0.05, pt, color=col, stroke_width=6, buff=0.12)
            self.say(f'<span foreground="{col}">{nm}</span>: {d}', narr)
            self.play(Create(arr), run_time=0.5)
            self.play(FadeIn(row), run_time=0.4)
        self.say(f"분화구에 물이 고여 호수가 생기기도 해요. {o('백록담')}처럼요",
                 "분화구에 물이 고여 호수가 생기기도 해요. 한라산의 백록담이 그런 곳이에요. 처음 궁금했던 움푹 파인 곳이 바로 분화구였어요.")
        self.settle()
        clear_stage(self)

    # ── 화산섬 ──
    def islands(self):
        self.section("생각+")
        self.say("우리나라에서 화산 활동으로 만들어진 섬은 어디일까요?",
                 "화산 활동으로 바다에 화산섬이 생기거나, 육지에 화산이 생기기도 해요. 우리나라에서 화산 활동으로 만들어진 섬은 어디일까요?")
        isl = VGroup(*[K.island(n, 1.8) for n in ("제주도", "울릉도", "독도", "강화도")]).arrange(RIGHT, buff=0.55).move_to([0, 0.4, 0])
        self.play(FadeIn(isl, lag_ratio=0.15), run_time=1.0)
        self.pause_screen(5, "화산섬을 모두 골라요")
        marks = VGroup(*[K.ox_mark(i < 3, 0.5).move_to(isl[i][1].get_center()) for i in range(4)])
        self.say(f"{g('제주도, 울릉도, 독도')}는 화산섬이에요. 강화도는 아니에요",
                 "제주도, 울릉도, 독도는 화산 활동으로 만들어진 화산섬이에요. 강화도는 화산섬이 아니에요.")
        self.play(FadeIn(marks, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["땅속의 마그마가 지표면의 약한 부분을 뚫고 나오는",
                            f"화산 활동으로 만들어진 지형을 {o('화산')}이라고 합니다.",
                            f"화산 활동으로 나오는 물질을 {r('화산 분출물')}이라고 합니다."], w=12.6, size=42).move_to([0, 0.6, 0])
        self.say(f"마그마가 뚫고 나와 만들어진 지형이 {o('화산')}이에요",
                 "땅속의 마그마가 지표면의 약한 부분을 뚫고 나오는 화산 활동으로 만들어진 지형을 화산이라고 해요. 화산 활동으로 나오는 물질은 화산 분출물이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
