"""「과학 원리 돋보기」 4학년 13화 — 화강암과 현무암 (4-1 3단원 땅의 변화 7차시, 화 코드 4-1-3-d)

바탕: grade4/science/sem1/u3-5.html(원본 _build_tb/src/u3-5.html) — 도입(돌하르방은 어두운색, 화성암 = 마그마가 식어 만들어진 암석),
암석 ①~④ 맨눈·디지털 현미경 관찰(① 밝음·큼, ② 어두움·작음·구멍 많음, ③ 밝음(연한 분홍)·큼, ④ 어두움·작음·구멍 조금),
분류(색깔이 밝은가?·알갱이가 큰가? → 같은 무리), 화강암 ①③·현무암 ②④, 마그마 식히기(깊은 곳 천천히 → 큰 알갱이 화강암,
지표 가까이 빨리 → 작은 알갱이 현무암, 구멍은 가스가 빠져나가며 생기기도 함), 구멍 없는 현무암도 있음, 석가탑·돌하르방, 한눈에 쏙.
최종: ./make_final.sh s4ep13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker,
                   always_redraw, linear, Line, SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u13 as K

ROCKS = [  # (번호, 종류, 분홍, 구멍)
    ("①", "granite", False, 0), ("②", "basalt", False, 14), ("③", "granite", True, 0), ("④", "basalt", False, 4)]


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def rock_n(i, rr=0.8):
    n, kind, pink, holes = ROCKS[i]
    rk = K.rock(kind, rr, seed=i + 1, pink=pink, holes=holes)
    tag = K.Circle(radius=0.22, fill_color=K.LAVA_Y, fill_opacity=1, stroke_color="#B58400", stroke_width=3)
    tag = VGroup(tag, T(n, 26, INK).move_to(tag)).move_to(rk.get_corner(UP + RIGHT) + np.array([-0.05, -0.05, 0]))
    return VGroup(rk, tag)


class S4Ep13(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 13
    EP_TITLE = "화강암과 현무암"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.classify()
        self.why()
        self.around()
        self.summary()
        self.closing(f"땅속 깊은 곳에서 천천히 식으면 알갱이가 큰 {o('화강암')}\n지표 가까이에서 빨리 식으면 알갱이가 작은 {BLUEs('현무암')}",
                     next_preview="4학년 14화 · 화산 활동은 해로울까, 이로울까?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        d1 = K.hareubang(2.8).move_to([-1.6, 0.4, 0])
        d2 = K.hareubang(2.8).move_to([1.6, 0.4, 0])
        lab = K.label("돌하르방(그림)", INK, 30).move_to([0, -1.75, 0])
        self.say("제주도에서 많이 볼 수 있는 돌하르방의 색깔은 어떠한가요?",
                 "제주도에서 많이 볼 수 있는 돌하르방이에요. 돌하르방의 색깔은 어떠한가요?")
        self.play(FadeIn(d1), FadeIn(d2), FadeIn(lab), run_time=0.8)
        self.say(f"{o('어두운 회색이나 검은색')}이고, 작은 구멍도 보여요",
                 "돌하르방은 진한 회색이나 검은색처럼 어두운색이에요. 표면에 작은 구멍도 보여요.")
        self.play(Indicate(d1, color=ORANGE, scale_factor=1.05), run_time=0.9)
        self.say(f"마그마가 식어 만들어진 암석을 {o('화성암')}이라고 해요",
                 "마그마가 식어 만들어진 암석을 화성암이라고 해요. 대표적인 화성암에는 화강암과 현무암이 있어요.")
        self.settle()
        clear_stage(self)

    # ── 관찰 ──
    def observe(self):
        self.section("관찰해요")
        paper = K.rect(6.0, 4.4, "#FFFFFF", x=-3.4, y=0.25, stroke=SOFT, sw=3)
        rks = VGroup(*[rock_n(i, 0.72) for i in range(4)])
        for i, rk in enumerate(rks):
            rk.move_to([-4.85 + (i % 2) * 2.9, 1.25 - (i // 2) * 2.05, 0])
        self.say("흰 종이 위에 암석 네 개를 놓고 관찰해요",
                 "흰 종이 위에 암석 네 개를 올려놓고 번호를 붙였어요. 맨눈과 디지털 현미경으로 관찰해 봐요.")
        self.play(FadeIn(paper), FadeIn(rks, lag_ratio=0.15), run_time=1.0)
        self.say("맨눈으로 보면 색깔이 달라요", "맨눈으로 보면, 암석 1번과 3번은 색깔이 밝아요. 3번은 연한 분홍빛이에요. 2번과 4번은 어두워요.")
        self.play(Indicate(VGroup(rks[0], rks[2]), color=ORANGE, scale_factor=1.06), run_time=0.9)
        self.pause_screen(5, "알갱이의 크기는 어떨까요?")
        self.say("디지털 현미경으로 알갱이를 자세히 봐요", "이번에는 디지털 현미경으로 알갱이를 자세히 봐요.")
        notes = {0: "알갱이가 크고, 검은색 알갱이가 군데군데 있어요",
                 1: "알갱이가 아주 작아요. 구멍이 많아요",
                 2: "알갱이가 크고, 연한 분홍빛이에요",
                 3: "알갱이가 아주 작아요. 구멍이 조금 있어요"}
        narr = {0: "암석 1번은 알갱이가 크고, 검은색 알갱이가 군데군데 있어요.",
                1: "암석 2번은 알갱이가 아주 작아 맨눈으로는 보기 어려웠어요. 표면에 구멍이 많아요.",
                2: "암석 3번도 알갱이가 커요.",
                3: "암석 4번은 알갱이가 아주 작고, 구멍이 조금 있어요."}
        prev = None
        for i in range(4):
            n, kind, pink, holes = ROCKS[i]
            zv = K.zoom_view(kind, 1.75, pink, holes=(6 if holes > 10 else 2) if holes else False).move_to([3.6, 0.5, 0])
            cap = T(f"암석 {n} · 디지털 현미경", 28).next_to(zv, DOWN, buff=0.15)
            ring = SurroundingRectangle(rks[i], buff=0.08, color=RED, corner_radius=0.15)
            self.say(f"암석 {n}: {notes[i]}", narr[i])
            if prev:
                self.play(FadeOut(prev), run_time=0.3)
            self.play(FadeIn(zv, scale=0.8), FadeIn(cap), Create(ring), run_time=0.7)
            prev = VGroup(zv, cap, ring)
            self.settle()
        self.play(FadeOut(prev), run_time=0.3)
        self.rks, self.paper = rks, paper
        clear_stage(self)

    # ── 분류 ──
    def classify(self):
        self.section("분류해요")
        yes = K.bin_box("그렇다", 6.3, 3.0, GREEN, 32).move_to([-3.35, 0.2, 0])
        no = K.bin_box("그렇지 않다", 6.3, 3.0, RED, 32).move_to([3.35, 0.2, 0])
        q1 = T("기준 1: 색깔이 밝은가?", 38).move_to([0, 2.35, 0])
        rks = VGroup(*[rock_n(i, 0.55) for i in range(4)])
        for i, rk in enumerate(rks):
            side = -3.35 if i in (0, 2) else 3.35
            rk.move_to([side + (-1.1 if i < 2 else 1.1), 0.3, 0])
        self.say("기준 1: 색깔이 밝은가?", "분류 기준에 따라 암석을 나누어 봐요. 첫 번째 기준은 색깔이 밝은가예요.")
        self.play(FadeIn(yes), FadeIn(no), FadeIn(q1), run_time=0.5)
        self.play(FadeIn(rks, lag_ratio=0.2), run_time=1.0)
        self.say(f"밝은 암석은 {o('①, ③')}, 어두운 암석은 ②, ④예요", "색깔이 밝은 암석은 1번과 3번, 어두운 암석은 2번과 4번이에요.")
        q2 = T("기준 2: 알갱이의 크기가 큰가?", 38).move_to(q1)
        self.say("기준 2: 알갱이의 크기가 큰가?", "두 번째 기준은 알갱이의 크기가 큰가예요.")
        self.play(FadeOut(q1), FadeIn(q2), run_time=0.5)
        self.play(Indicate(rks, color=ORANGE, scale_factor=1.05), run_time=0.8)
        self.say(f"알갱이가 큰 암석도 ①, ③! {o('나눈 무리가 같아요')}",
                 "알갱이가 큰 암석은 1번과 3번, 작은 암석은 2번과 4번이에요. 두 기준으로 나눈 무리가 같아요!")
        self.settle()
        n1 = M(o("화강암") + ": 색깔이 밝고, 알갱이가 커요", 26).move_to([yes.get_x(), -0.95, 0])
        n2 = M(f'<span foreground="{BLUE}">현무암</span>' + ": 색깔이 어둡고, 알갱이가 작아요", 26).move_to([no.get_x(), -0.95, 0])
        self.say(f"①, ③은 {o('화강암')}, ②, ④는 {BLUEs('현무암')}이에요",
                 "색깔이 밝고 알갱이가 큰 1번과 3번은 화강암이에요. 색깔이 어둡고 알갱이가 작은 2번과 4번은 현무암이에요.")
        self.play(FadeIn(n1), FadeIn(n2), run_time=0.6)
        self.say(f"현무암에는 구멍이 있기도 하지만, {r('구멍이 없는 현무암')}도 있어요",
                 "현무암은 구멍이 있기도 하지만, 구멍이 없는 현무암도 있어요. 4번처럼 구멍이 조금만 있는 것도 있었지요.")
        self.play(Indicate(rks[3], color=RED, scale_factor=1.15), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 왜 알갱이 크기가 다를까 ──
    def why(self):
        self.section("왜 다를까요?")
        bg = VGroup(K.rect(12.4, 4.7, "#8A7458", y=-0.1, sw=0), K.rect(12.4, 0.22, "#7AA35A", y=2.25, sw=0))
        t1 = T("지표", 30, "#FFFFFF").move_to([-5.6, 1.85, 0])
        t2 = T("땅속 깊은 곳", 30, "#FFFFFF").move_to([-4.9, -2.05, 0])
        p = ValueTracker(0.0)
        top = always_redraw(lambda: K.cool_box(4.6, 0.9, False, p.get_value()).move_to([2.4, 1.15, 0]))
        bot = always_redraw(lambda: K.cool_box(4.6, 1.2, True, p.get_value()).move_to([2.4, -1.15, 0]))
        l1 = T("지표 가까이: 빨리 식어요", 30, "#FFFFFF").move_to([2.4, 1.95, 0])
        l2 = T("땅속 깊은 곳: 천천히 식어요", 30, "#FFFFFF").move_to([2.4, -0.3, 0])
        self.say("왜 알갱이의 크기가 다를까요? 마그마를 식혀 봐요",
                 "화강암과 현무암은 왜 알갱이의 크기가 다를까요? 마그마를 식혀 봐요. 땅속 깊은 곳은 천천히, 지표 가까이는 빨리 식어요.")
        self.play(FadeIn(bg), FadeIn(t1), FadeIn(t2), FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.add(top, bot)
        self.pause_screen(5, "어느 쪽 알갱이가 클까요?")
        self.say("마그마가 식는 중…", "마그마가 식고 있어요. 알갱이가 생기는 모습을 봐요.")
        self.play(p.animate.set_value(1.0), run_time=4.0, rate_func=linear)
        top.clear_updaters(); bot.clear_updaters()
        a1 = M(f'<span foreground="{K.LAVA_Y}">알갱이가 작은 현무암</span>', 32).move_to([-3.0, 1.15, 0])
        a2 = M(f'<span foreground="{K.LAVA_Y}">알갱이가 큰 화강암</span>', 32).move_to([-3.0, -1.15, 0])
        self.say(f"지표 가까이에서 빨리 식으면 알갱이가 작은 {BLUEs('현무암')}",
                 "지표 가까이에서 빨리 식으면 알갱이가 작은 현무암이 만들어져요. 현무암의 구멍은 식는 동안 가스가 빠져나가며 생기기도 해요.")
        self.play(FadeIn(a1), run_time=0.5)
        self.say(f"땅속 깊은 곳에서 천천히 식으면 알갱이가 큰 {o('화강암')}",
                 "땅속 깊은 곳에서 천천히 식으면 알갱이가 큰 화강암이 만들어져요.")
        self.play(FadeIn(a2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 우리 주변 ──
    def around(self):
        self.section("우리 주변 암석")
        pg = K.pagoda(3.0).move_to([-3.2, 0.5, 0])
        hb = K.hareubang(2.8).move_to([3.2, 0.4, 0])
        l1 = M(f"석가탑 · {o('화강암')}", 34).next_to(pg, DOWN, buff=0.25)
        l2 = M(f"돌하르방 · {BLUEs('현무암')}", 34).next_to(hb, DOWN, buff=0.25).align_to(l1, DOWN)
        self.say("우리 주변에는 화강암과 현무암으로 만든 것이 많아요",
                 "우리 주변에는 화강암과 현무암으로 만든 건축물과 조각이 많아요.")
        self.play(FadeIn(pg), FadeIn(hb), run_time=0.7)
        self.say(f"석가탑은 {o('화강암')}, 돌하르방은 {BLUEs('현무암')}으로 만들었어요",
                 "석가탑은 화강암, 제주도의 돌하르방은 현무암으로 만들었어요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"마그마가 식어 만들어진 암석을 {o('화성암')}이라고 합니다.",
                            "암석의 색깔이 어둡고 알갱이의 크기가 작은 화성암은",
                            f"{BLUEs('현무암')}입니다."], w=12.4, size=44).move_to([0, 0.6, 0])
        self.say(f"마그마가 식어 만들어진 암석은 {o('화성암')}이에요",
                 "마그마가 식어 만들어진 암석을 화성암이라고 해요. 색깔이 어둡고 알갱이의 크기가 작은 화성암은 현무암이에요. 색깔이 밝고 알갱이가 큰 화성암은 화강암이에요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


def BLUEs(s):
    return f'<span foreground="{BLUE}">{s}</span>'
