"""「과학 원리 돋보기」 3학년 25화 — 지구 표면은 어떤 모습일까? (3-2 2단원 지구의 모습 3~4차시, 화 코드 3-2-2-b)

바탕: grade3/science/sem2/u2-2.html — 도입(수박 줄무늬: 눈으로 보면 정확히 알기 어려움 → 같은 크기 붙임딱지를 붙이고 개수 세기),
지구 표면 사진 카드 9가지(산·들·강·호수·바다·빙하·사막·계곡·갯벌의 설명), 우리나라에서 보기 어려운 모습(빙하·사막),
POE(예상 → 지구본 칸마다 절반이 넘는 쪽 붙임딱지 → 개수 세어 비교), 정리 '지구 표면에서 바다가 육지보다 더 넓습니다',
한눈에 쏙 '육지 ＜ 바다', 형성 평가 3(육지 42장, 바다 98장).
최종: ./make_final.sh s3ep25
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Rectangle, Circle,
                   LaggedStart, Circumscribe, Rotate, SurroundingRectangle, Transform, AnimationGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u22 as K
from kit_s3u12 import text_card


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def watermelon(rad=1.5):
    body = Circle(radius=rad, fill_color="#5DB04A", fill_opacity=1, stroke_color="#2F6B2A", stroke_width=5)
    stripes = VGroup()
    for k in range(-3, 4):
        x = k * rad * 0.28
        h = np.sqrt(max(rad ** 2 - x ** 2, 0)) * 0.96
        pts = [np.array([x + 0.09 * rad * np.sin(t * 6), t * h, 0]) for t in np.linspace(-1, 1, 25)]
        from manim import VMobject
        st = VMobject(stroke_color="#1F4A1C", stroke_width=14)
        st.set_points_smoothly(pts)
        stripes.add(st)
    stem = Line([0, rad, 0], [0.1, rad + 0.25, 0], stroke_color="#7E5428", stroke_width=8)
    return VGroup(body, stripes, stem)


DESC = {"산": "주위보다 높게 솟아 있고 나무가 많아요", "들": "편평하고 넓은 땅이에요", "강": "물이 넓고 길게 흘러요",
        "호수": "땅이 우묵하게 들어가 물이 고여 있어요", "바다": "짠 바닷물로 가득 차 있고 넓고 커요",
        "빙하": "아주 큰 얼음덩어리예요", "사막": "모래 언덕이 끝없이 펼쳐져요",
        "계곡": "산과 산 사이로 맑은 물이 빠르게 흘러요", "갯벌": "썰물 때 드러나는 편평한 땅이에요"}


class S3Ep25(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 25
    EP_TITLE = "지구 표면은 어떤 모습일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.surface()
        self.predict()
        self.stickers()
        self.compare()
        self.closing(f"지구 표면에는 산·들·강·호수·바다 등 {o('다양한 모습')}이 있어요\n"
                     f"지구 표면에서 {g('바다가 육지보다 더 넓어요')}",
                     next_preview="3학년 26화 · 바닷물은 육지의 물과 어떻게 다를까?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        wm = watermelon(1.55).move_to([-3.6, 0.4, 0])
        self.say("수박 표면에서 어느 색깔이 더 넓어 보이나요?", "수박의 줄무늬를 보세요. 초록색과 짙은 색 중 어느 색깔이 더 넓어 보이나요?")
        self.play(FadeIn(wm, scale=0.8), run_time=0.7)
        q = T("눈으로 보면 정확히 알기 어려워요", 38, INK).move_to([2.6, 1.3, 0])
        self.say("보는 사람에 따라 다르게 보일 수 있어요", "보는 사람에 따라 다르게 보일 수 있어요. 눈으로만 보면 정확히 알기 어렵지요.")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(4, "정확하게 비교하는 방법은?")
        ways = VGroup(T("같은 크기의 붙임딱지를 붙이고", 36, GREEN), T("개수를 세어 비교해요", 36, GREEN)).arrange(DOWN, buff=0.2)
        ways.move_to([2.6, -0.2, 0])
        dots = VGroup(*[K.RoundedRectangle(corner_radius=0.04, width=0.28, height=0.28, fill_color=PAPER, fill_opacity=1,
                                           stroke_color=ORANGE, stroke_width=3).move_to(wm.get_center() + np.array([x, y, 0]))
                        for x in (-0.6, -0.3, 0, 0.3, 0.6) for y in (-0.3, 0, 0.3)])
        self.say(f"같은 크기의 {o('붙임딱지')}를 붙이고 개수를 세어요",
                 "같은 크기의 붙임딱지를 붙이고 개수를 세어 비교하면, 누가 해도 똑같은 결과가 나와요.")
        self.play(FadeIn(ways, shift=UP * 0.2), LaggedStart(*[FadeIn(d, scale=0.5) for d in dots], lag_ratio=0.05), run_time=1.2)
        self.say("오늘은 이 방법으로 지구 표면을 비교해요", "오늘은 이 방법으로 지구 표면의 육지와 바다 넓이를 비교해 볼 거예요.")
        self.settle()
        clear_stage(self)

    # ── 지구 표면의 모습 ──
    def surface(self):
        self.section("관찰해요")
        names = list(K.SURFACE)
        cards = VGroup()
        for i, n in enumerate(names):
            c = K.surface_pic(n, 2.3, 1.3, 32)
            x = -5.4 + (i % 5) * 2.7 if i < 5 else -4.05 + (i - 5) * 2.7
            y = 1.65 if i < 5 else -0.55
            c.move_to([x, y, 0])
            cards.add(c)
        self.say("지구 표면에는 어떤 모습이 있을까요?", "지구 표면에는 어떤 모습이 있을까요? 사진 카드를 살펴봐요.")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in cards], lag_ratio=0.1), run_time=1.8)
        groups = [(["산", "들", "강"], "산은 주위보다 높게 솟아 있고 나무가 많아요. 들은 편평하고 넓은 땅이고, 강은 물이 넓고 길게 흘러요."),
                  (["호수", "바다", "계곡"], "호수는 땅이 우묵하게 들어가 물이 고여 있어요. 바다는 짠 바닷물로 가득 차 있고, 계곡은 산과 산 사이로 맑은 물이 빠르게 흘러요."),
                  (["빙하", "사막", "갯벌"], "빙하는 아주 큰 얼음덩어리, 사막은 모래 언덕이 끝없이 펼쳐진 곳, 갯벌은 썰물 때 드러나는 편평한 땅이에요.")]
        for grp, narr in groups:
            sub = " · ".join(f"{o(n)}" for n in grp)
            self.say(sub, narr)
            self.play(*[Indicate(cards[names.index(n)], color=ORANGE, scale_factor=1.08) for n in grp], run_time=0.9)
        self.say("우리나라에서 보기 어려운 모습은 무엇일까요?", "이 가운데 우리나라에서 보기 어려운 모습은 무엇일까요?")
        self.pause_screen(4, "우리나라에서 보기 어려운 모습은?")
        boxes = VGroup(*[SurroundingRectangle(cards[names.index(n)], color=RED, buff=0.08, corner_radius=0.1) for n in ("빙하", "사막")])
        self.say(f"{r('빙하')}와 {r('사막')}은 우리나라에서 보기 어려워요",
                 "빙하와 사막은 우리나라에서 보기 어렵지만, 지구 표면의 다양한 모습 가운데 하나예요.")
        self.play(Create(boxes), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 예상 ──
    def predict(self):
        self.section("예상해요")
        e = K.earth(1.6, atmo=False).move_to([-3.4, 0.35, 0])
        self.say(f"지구 표면을 크게 {o('육지')}와 {o('바다')}로 나누어 봐요",
                 "지구 표면은 크게 육지와 바다로 나눌 수 있어요. 지구본을 돌려 보며 살펴봐요.")
        self.play(FadeIn(e), run_time=0.5)
        self.play(Rotate(e[1], 0.5, about_point=e[0].get_center()), Rotate(e[2], 0.5, about_point=e[0].get_center()), run_time=1.0)
        opts = VGroup(T("바다가 더 넓을 것 같아요", 36, BLUE), T("육지가 더 넓을 것 같아요", 36, GREEN),
                      T("비슷할 것 같아요", 36, INK)).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([2.6, 0.35, 0])
        self.say("육지와 바다 중 어디가 더 넓을까요?", "육지와 바다 중 어디가 더 넓을까요? 먼저 예상해 봐요.")
        self.play(FadeIn(opts, lag_ratio=0.2), run_time=0.8)
        self.pause_screen(4, "어디가 더 넓을까요?")
        self.settle()
        clear_stage(self)

    # ── 붙임딱지 붙이기 ──
    def stickers(self):
        self.section("관찰해요")
        rule = VGroup(M(f"칸 안에서 {g('육지')}가 절반을 넘으면 → {g('육지 붙임딱지')}", 32),
                      M(f"칸 안에서 {b_('바다')}가 절반을 넘으면 → {b_('바다 붙임딱지')}", 32)).arrange(DOWN, buff=0.18, aligned_edge=LEFT)
        rule.move_to([0, 2.35, 0])
        grid = K.sticker_grid(0.34, filled=False).move_to([0, -0.4, 0])
        self.say("지구본에 붙임딱지를 겹치지 않게 붙여요",
                 "지구본에 칸을 나누고, 붙임딱지를 겹치지 않게 붙여요. 지구본을 펼쳐서 한눈에 보면 이렇게 돼요.")
        self.play(FadeIn(grid), run_time=0.6)
        self.say("칸마다 절반이 넘는 쪽의 붙임딱지를 붙여요",
                 "칸 안에서 육지가 절반을 넘으면 육지 붙임딱지를, 바다가 절반을 넘으면 바다 붙임딱지를 붙여요.")
        self.play(FadeIn(rule, shift=DOWN * 0.15), run_time=0.6)
        anims = []
        for sq, kind in grid.cells:
            anims.append(sq.animate.set_fill(K.LAND if kind == "L" else K.SEA, opacity=1))
        self.play(LaggedStart(*anims, lag_ratio=0.02), run_time=3.0)
        self.say(f"파란색 {b_('바다')}가 초록색 {g('육지')}보다 넓어 보여요",
                 "펼친 지구본을 보면 파란색 바다가 초록색 육지보다 훨씬 넓어 보여요. 개수를 세어 확인해 봐요.")
        self.settle()
        self.grid = grid
        self.rule = rule

    # ── 개수 비교 ──
    def compare(self):
        self.section("설명해요")
        land, sea = K.grid_counts()
        grid = self.grid
        self.play(FadeOut(self.rule), grid.animate.scale(0.75).move_to([-4.2, 0.7, 0]), run_time=0.8)
        tab = VGroup(
            T("구분", 30, SOFT), T("육지 붙임딱지", 30, GREEN), T("바다 붙임딱지", 30, BLUE),
            T("붙임딱지 수", 30, SOFT), T(f"{land}장", 44, GREEN), T(f"{sea}장", 44, BLUE))
        for i, t in enumerate(tab):
            t.move_to([-0.55 + (i % 3) * 2.9, 1.9 - (i // 3) * 0.9, 0])
        lines = VGroup(Line([-1.6, 1.45, 0], [6.6, 1.45, 0], stroke_color=SOFT, stroke_width=3))
        self.say(f"육지 붙임딱지 {g(f'{land}장')}, 바다 붙임딱지 {b_(f'{sea}장')}",
                 f"붙임딱지 수를 세었더니 육지 붙임딱지는 {land}장, 바다 붙임딱지는 {sea}장이었어요.")
        self.play(FadeIn(tab[:3]), Create(lines), FadeIn(tab[3]), run_time=0.6)
        self.play(FadeIn(tab[4], scale=0.8), FadeIn(tab[5], scale=0.8), run_time=0.6)
        unit = 0.085
        x0 = -1.3
        bs = VGroup(*[K.RoundedRectangle(corner_radius=0.02, width=unit * 0.9 * 0.85, height=0.36, fill_color=K.SEA, fill_opacity=1,
                                         stroke_width=0).move_to([x0 + unit * 0.85 * (k + 0.5), -0.85, 0]) for k in range(sea)])
        bl = VGroup(*[K.RoundedRectangle(corner_radius=0.02, width=unit * 0.9 * 0.85, height=0.36, fill_color=K.LAND, fill_opacity=1,
                                         stroke_width=0).move_to([x0 + unit * 0.85 * (k + 0.5), -0.25, 0]) for k in range(land)])
        self.say("붙임딱지를 한 줄로 늘어놓으면?", "붙임딱지를 한 줄로 늘어놓아 비교해 볼까요?")
        self.play(LaggedStart(*[FadeIn(x) for x in bl], lag_ratio=0.02), run_time=1.0)
        self.play(LaggedStart(*[FadeIn(x) for x in bs], lag_ratio=0.01), run_time=1.2)
        self.say(f"바다 줄이 육지 줄보다 {o('훨씬 길어요')}", "바다 줄이 육지 줄보다 훨씬 길어요.")
        self.settle()
        res = M(f"육지 {o('＜')} 바다", 64).move_to([2.4, -1.75, 0])
        self.say(f"지구 표면에서 {g('바다가 육지보다 더 넓어요')}",
                 "지구 표면에서 바다가 차지하는 부분이 육지보다 더 넓어요. 지구 표면의 많은 부분은 바다로 덮여 있어요.")
        self.play(FadeIn(res, scale=0.8), run_time=0.6)
        self.play(Circumscribe(res, color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'
