"""「과학 원리 돋보기」 4학년 5화 — 나침반과 자석 (4-1 1단원 자석의 이용 6차시, 화 코드 4-1-1-e)

바탕: grade4/science/sem1/u1-5.html(원본 _build_tb/src/u1-5.html) — 도입(복도의 나침반 중 하나만 방향이 다름 → 근처 막대자석),
나의 생각(바늘은 철일까, 자석일까? 철이라면 어느 극에나 끌려오고, 자석이라면 극에 따라 끌려오거나 밀려남),
탐구(N극을 가까이 → 빨간색 부분이 자석의 반대쪽, S극 → 자석 쪽, 나침반을 N극/S극에 가까이 해도 같음),
정리(극에 따라 방향이 다름 → 바늘은 자석, 빨간색 부분이 바늘의 N극), 나침반 사용법(N극이 가리키는 쪽이 북쪽, 자석과 멀리 보관),
한눈에 쏙 '나침반 바늘은 자석으로 만들어졌습니다'.
최종: ./make_final.sh s4ep05
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Rotate, Arrow,
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


class S4Ep05(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 5
    EP_TITLE = "나침반과 자석"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.hypothesis()
        self.explore()
        self.conclude()
        self.usage()
        self.summary()
        self.closing(f"나침반 바늘은 {o('자석')}이라서 막대자석의 극에 따라\n가리키는 방향이 달라지고, 바늘의 {n_('N극')}은 {g('북쪽')}을 가리켜요",
                     next_preview="4학년 마인드맵 1 · 자석의 이용")
        self.wait(0.5)

    def turn(self, c, d, run_time=1.0):
        """바늘을 d(라디안)만큼 돌림 — 살짝 지나쳤다 돌아옴"""
        p = c.cen.get_center()
        self.play(Rotate(c.needle, d * 1.15, about_point=p), run_time=run_time * 0.7)
        self.play(Rotate(c.needle, -d * 0.15, about_point=p), run_time=run_time * 0.3)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        pos = [(-4.6, 1.0), (-2.2, 1.6), (0.2, 1.0), (-3.4, -0.9), (-1.0, -0.9)]
        comps = VGroup(*[K.compass(0.6).move_to([x, y, 0]) for x, y in pos])
        odd = K.compass(0.6).move_to([3.0, 0.3, 0])
        na = K.north_arrow(0.8).move_to([-6.2, 0.7, 0])
        self.say("복도에 나침반을 놓았더니 바늘이 모두 같은 쪽을 가리켜요",
                 "친구들이 복도에 나침반을 여러 개 놓았어요. 바늘이 모두 같은 쪽을 가리켜요.")
        self.play(FadeIn(comps, lag_ratio=0.1), FadeIn(odd), FadeIn(na), run_time=1.0)
        mag = K.bar_magnet("S", 2.2, 0.5).move_to([4.6, -1.5, 0])
        self.say("그런데 한 나침반만 방향이 갑자기 달라졌어요", "그런데 한 나침반만 바늘이 가리키는 방향이 갑자기 달라졌어요.")
        self.turn(odd, -2.85, 1.2)
        self.play(Indicate(odd, color=ORANGE, scale_factor=1.15), run_time=0.8)
        self.pause_screen(5, "왜 방향이 달라졌을까요?")
        self.play(FadeIn(mag), run_time=0.6)
        self.say(f"나침반 근처에 {o('막대자석')}이 있었기 때문이에요",
                 "나침반 근처에 막대자석이 있었기 때문이에요. 그렇다면 나침반 바늘은 무엇으로 만들어졌을까요?")
        self.play(Indicate(mag, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 나의 생각 ──
    def hypothesis(self):
        self.section("나의 생각")
        q = T("나침반 바늘은 무엇으로 만들어졌을까요?", 46).move_to([0.6, 2.45, 0])
        c1 = K.text_card([f"바늘이 {o('철')}이라면", "→ 어느 극을 가까이 해도", "    막대자석 쪽으로 끌려와요"], w=6.3, size=36).move_to([-3.3, 0.2, 0])
        c2 = K.text_card([f"바늘이 {o('자석')}이라면", "→ 극에 따라 끌려오기도 하고", "    밀려나기도 해요"], w=6.3, size=36).move_to([3.3, 0.2, 0])
        self.say("나침반 바늘은 철일까요, 자석일까요?", "나침반 바늘은 철로 만들어졌을까요, 아니면 자석일까요? 내 생각을 정해 봐요.")
        self.play(FadeIn(q), run_time=0.5)
        self.say(f"바늘이 철이라면 {o('어느 극에나')} 끌려와요", "만약 바늘이 철이라면, 막대자석의 어느 극을 가까이 해도 막대자석 쪽으로 끌려올 거예요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.6)
        self.say(f"바늘이 자석이라면 {o('극에 따라')} 끌려오거나 밀려나요",
                 "만약 바늘이 자석이라면, 같은 극끼리는 밀어 내고 다른 극끼리는 끌어당기니까, 극에 따라 끌려오기도 하고 밀려나기도 할 거예요.")
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 탐구해요 ──
    def case(self, near_pole, row_y=None):
        c = K.compass(1.0).move_to([-2.6, 0.4, 0])
        left = near_pole                     # 막대자석 왼쪽 끝(나침반 쪽) 극
        mag = K.bar_magnet(left, 2.8, 0.66).move_to([5.0, 0.4, 0])
        self.play(FadeIn(c), FadeIn(mag), run_time=0.4)
        self.play(mag.animate.move_to([0.6 + 1.4 + 0.3, 0.4, 0]), run_time=1.4)
        d = PI / 2 if near_pole == "N" else -PI / 2
        self.turn(c, d, 1.0)
        return c, mag

    def explore(self):
        self.section("탐구해요")
        self.say(f"막대자석의 {n_('N극')}을 나침반에 천천히 가까이 해요",
                 "막대자석의 N극을 나침반에 천천히 가까이 해 볼게요. 바늘이 멈추면 빨간색 부분이 어느 쪽을 가리키는지 봐요.")
        self.pause_screen(5, "빨간색 부분은 어느 쪽을 가리킬까요?")
        c, mag = self.case("N")
        lab = T("자석의 반대쪽", 36, RED).move_to([-2.6, -1.25, 0])
        self.play(FadeIn(lab), run_time=0.3)
        self.say(f"{n_('N극')}을 가까이 하면 빨간색 부분이 {r('자석의 반대쪽')}을 가리켜요",
                 "N극을 가까이 하면 빨간색 부분이 막대자석의 반대쪽을 가리켜요.")
        self.settle()
        self.play(FadeOut(VGroup(c, mag, lab)), run_time=0.4)
        self.say(f"이번에는 {s_('S극')}을 가까이 해요", "이번에는 막대자석의 S극을 나침반에 천천히 가까이 해 볼게요.")
        c, mag = self.case("S")
        lab = T("자석 쪽", 36, GREEN).move_to([-2.6, -1.25, 0])
        self.play(FadeIn(lab), run_time=0.3)
        self.say(f"{s_('S극')}을 가까이 하면 빨간색 부분이 {g('자석 쪽')}을 가리켜요",
                 "S극을 가까이 하면 빨간색 부분이 막대자석 쪽을 가리켜요.")
        self.settle()
        self.play(FadeOut(VGroup(c, mag, lab)), run_time=0.4)
        # 결과 표
        rows = [(f"① 막대자석의 {n_('N극')}을 나침반에", r("자석의 반대쪽")),
                (f"② 막대자석의 {s_('S극')}을 나침반에", g("자석 쪽")),
                (f"③ 나침반을 막대자석의 {n_('N극')}에", r("자석의 반대쪽")),
                (f"④ 나침반을 막대자석의 {s_('S극')}에", g("자석 쪽"))]
        head = VGroup(T("실험", 34, SOFT).move_to([-2.4, 2.3, 0]), T("빨간색 부분이 가리키는 곳", 34, SOFT).move_to([3.6, 2.3, 0]))
        lines = VGroup()
        for i, (a, b) in enumerate(rows):
            y = 1.4 - i * 0.95
            lines.add(VGroup(M(a, 36).move_to([-2.4, y, 0]), M(b, 36).move_to([3.6, y, 0])))
        self.say("나침반을 자석에 가까이 해도 결과는 같아요",
                 "나침반을 막대자석의 N극이나 S극에 가까이 가져가도 결과는 같았어요. 표로 정리해 볼게요.")
        self.play(FadeIn(head), FadeIn(lines, lag_ratio=0.25), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def conclude(self):
        self.section("정리해요")
        q = M(f"빨간색 부분이 가리키는 방향은 극에 따라 {o('달라요')}", 42).move_to([0.5, 2.4, 0])
        self.say(f"가까운 극에 따라 바늘이 가리키는 방향이 {o('달라요')}",
                 "나침반과 가까운 막대자석의 극에 따라, 빨간색 부분이 가리키는 방향이 달라요.")
        self.play(FadeIn(q), run_time=0.5)
        cf = K.text_card([f"바늘이 철이라면 → 항상 {o('자석 쪽')}을 가리킬 거예요"], w=11.0, size=38).move_to([0, 1.1, 0])
        cm = K.text_card([f"그런데 {n_('N극')}을 가까이 하면 {r('반대쪽')}을 가리켰어요"], w=11.0, size=38).move_to([0, -0.15, 0])
        self.say("바늘이 철이라면 항상 자석 쪽을 가리킬 텐데……",
                 "바늘이 철이라면 항상 자석 쪽을 가리킬 텐데, N극을 가까이 했을 때 빨간색 부분은 자석의 반대쪽을 가리켰어요.")
        self.play(FadeIn(cf), run_time=0.5)
        self.play(FadeIn(cm), run_time=0.5)
        ans = M(f"나침반 바늘은 {o('자석')}이에요!", 54).move_to([0, -1.55, 0])
        self.say(f"그러니까 나침반 바늘은 {o('자석')}이에요", "그러니까 나침반 바늘은 자석이에요. 내 생각과 같았나요?")
        self.play(FadeIn(ans, scale=1.2), run_time=0.6)
        self.settle()
        self.play(FadeOut(VGroup(q, cf, cm, ans)), run_time=0.4)
        c = K.compass(1.2).move_to([-2.6, 0.2, 0])
        mag = K.bar_magnet("N", 2.8, 0.66).move_to([1.6, 0.2, 0])
        self.add(c)
        self.play(FadeIn(c), run_time=0.3)
        self.play(FadeIn(mag), run_time=0.3)
        self.turn(c, PI / 2, 0.8)
        tag = T("바늘의 N극", 34, K.NC).move_to([-2.6 - 1.2, 1.7, 0])
        arr = Arrow(tag.get_bottom(), c.get_center() + LEFT * 0.75 + UP * 0.12, buff=0.08, color=K.NC, stroke_width=5)
        self.say(f"빨간색 부분이 바늘의 {n_('N극')}이에요",
                 "빨간색 부분이 바늘의 N극이에요. 같은 극끼리는 밀어 내고 다른 극끼리는 끌어당기기 때문에, 막대자석의 극에 따라 바늘이 가리키는 방향이 달라져요.")
        self.play(Create(arr), run_time=0.4)
        self.play(FadeIn(tag), run_time=0.3)
        self.settle()
        clear_stage(self)

    # ── 나침반 사용법 ──
    def usage(self):
        self.section("나침반 사용법")
        c = K.compass(1.3).move_to([-4.6, -0.5, 0])
        na = K.north_arrow(1.0).move_to([-4.6, 1.55, 0])
        tips = K.text_card(["① 평평한 곳에 놓아요",
                            "② 바늘이 멈출 때까지 기다려요",
                            f"③ 바늘의 {n_('N극(빨간색 부분)')}이 가리키는 쪽이 {g('북쪽')}",
                            "④ 쓰고 나면 자석과 멀리 떨어뜨려 보관해요"], w=8.9, size=38).move_to([2.2, 0.1, 0])
        self.say("나침반은 이렇게 써요", "나침반은 평평한 곳에 놓고, 바늘이 멈출 때까지 기다려요.")
        self.play(FadeIn(c), FadeIn(tips[0]), FadeIn(tips[1][0]), FadeIn(tips[1][1]), run_time=0.6)
        self.say(f"바늘의 N극이 가리키는 쪽이 {g('북쪽')}이에요",
                 "바늘의 N극, 빨간색 부분이 가리키는 방향이 북쪽이에요.")
        self.play(FadeIn(tips[1][2]), FadeIn(na), run_time=0.5)
        self.play(Indicate(c.needle[1], color=K.NC, scale_factor=1.15), run_time=0.8)
        self.say("실험이 끝나면 나침반은 자석과 멀리 보관해요",
                 "실험이 끝나면 나침반은 자석과 멀리 떨어뜨려 보관해요. 주변에 다른 자석이나 철로 만든 물체가 있으면 멀리 떨어뜨려 놓아요.")
        self.play(FadeIn(tips[1][3]), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"나침반 바늘은 {r('자석')}으로 만들어졌습니다.",
                            "같은 극끼리는 밀어 내고 다른 극끼리는 끌어당기기 때문에,",
                            "막대자석의 극에 따라 나침반 바늘이 가리키는 방향이 달라져요."], w=12.8, size=42).move_to([0, 0.6, 0])
        self.say(f"나침반 바늘은 {r('자석')}으로 만들어졌어요",
                 "나침반 바늘은 자석으로 만들어졌어요. 같은 극끼리는 밀어 내고 다른 극끼리는 끌어당기기 때문에, 막대자석의 극에 따라 나침반 바늘이 가리키는 방향이 달라져요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
