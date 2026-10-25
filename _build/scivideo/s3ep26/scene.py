"""「과학 원리 돋보기」 3학년 26화 — 바닷물은 육지의 물과 어떻게 다를까? (3-2 2단원 지구의 모습 5차시, 화 코드 3-2-2-c)

바탕: grade3/science/sem2/u2-3.html — 도입(무인도: 바닷물은 짜고 여러 물질이 녹아 있어 마시기에 알맞지 않음),
가상 실험실(안전 준비, 관찰표: 색깔 없다/없다·냄새 없다/거의 없다, 맛보지 않기, 다르게 할 조건 = 물의 종류,
같게 할 조건 = 물의 양·끓임쪽 개수·증발 접시 크기·가열 시간, 스포이트 1 mL씩, 끓임쪽: 갑자기 끓어오르는 것을 막음,
핫플레이트 동시 가열·멀리서 관찰·뜨거우니 집게, 결과: 육지의 물 접시 아무것도 남지 않음 / 바닷물 접시 흰색 가루 물질),
생각 바로잡기(소금만 들어 있다? → 여러 가지 물질, 짠맛과 쓴맛), 염전, 지구의 물 100컵(바닷물 약 97 · 빙하 약 2 · 지하수·강·호수 약 1),
한눈에 쏙 '육지의 물과 달리 바닷물에는 소금과 같은 여러 가지 물질이 녹아 있습니다'.
최종: ./make_final.sh s3ep26
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circumscribe,
                   LaggedStart, SurroundingRectangle, Transform, VMobject, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u22 as K
from kit_s3u12 import text_card, bin_box


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def steam(x, y):
    grp = VGroup()
    for k in range(3):
        m = VMobject(stroke_color=K.GRAY, stroke_width=4)
        xs = x + (k - 1) * 0.35
        m.set_points_smoothly([np.array([xs + 0.08 * np.sin(t * 4), y + t * 0.7, 0]) for t in np.linspace(0, 1, 8)])
        grp.add(m)
    return grp


class S3Ep26(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 26
    EP_TITLE = "바닷물은 육지의 물과 어떻게 다를까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.plan()
        self.heat()
        self.result()
        self.cups()
        self.closing(f"육지의 물과 달리 바닷물에는\n{o('소금')}과 같은 {g('여러 가지 물질')}이 녹아 있어요",
                     next_preview="3학년 27화 · 바닷가에는 어떤 지형이 있을까?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sea = K.Rectangle(width=13.2, height=2.6, fill_color=K.SEA, fill_opacity=0.85, stroke_width=0).move_to([0, -1.2, 0])
        isl = K.P([(-1.8, 0.1), (-1.2, 0.6), (0.0, 0.8), (1.2, 0.55), (1.8, 0.1)], K.SAND, K.SAND_D, 3)
        palm = VGroup(Line([0, 0.7, 0], [0.2, 2.0, 0], stroke_color=K.BROWN, stroke_width=12),
                      *[K.E(1.1, 0.3, K.LAND, 0.2 + 0.45 * np.cos(a), 2.05 + 0.25 * np.sin(a), sw=3).rotate(a)
                        for a in (0.3, 1.3, 2.5, 3.6)])
        waves = VGroup(*[K.waves(-6.4, 6.4, y, 0.06, 12, PAPER, 3) for y in (-0.6, -1.3, -2.0)])
        self.say("무인도에서 목이 말라요!", "바다에 둘러싸인 무인도에 왔어요. 목이 말라요! 물은 아주 많은데, 모두 바닷물이에요.")
        self.play(FadeIn(sea), FadeIn(waves), FadeIn(isl), FadeIn(palm), run_time=0.8)
        self.say("왜 바닷물을 마시지 않을까요?", "주위에 바닷물이 가득한데, 왜 바닷물을 마시지 않을까요?")
        self.pause_screen(4, "왜 바닷물을 마시지 않을까요?")
        ans = text_card([f"바닷물은 {o('짜고')}, {o('여러 가지 물질')}이 녹아 있어서", "마시기에 알맞지 않아요"], size=38).move_to([0, -1.2, 0])
        self.say(f"바닷물은 짜고 {o('여러 가지 물질')}이 녹아 있어요",
                 "바닷물은 짜고, 여러 가지 물질이 녹아 있어서 마시기에 알맞지 않아요. 정말 육지의 물과 다른지 실험으로 확인해 봐요.")
        self.play(FadeIn(ans, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 관찰과 실험 계획 ──
    def plan(self):
        self.section("실험해요")
        gear = VGroup(tag("실험복", BLUE, 34), tag("보안경", BLUE, 34), tag("실험용 장갑", BLUE, 34)).arrange(RIGHT, buff=0.4)
        gear.move_to([0, 2.4, 0])
        self.say(f"실험 전에 {o('실험복·보안경·장갑')}을 착용해요", "실험 전에 실험복, 보안경, 실험용 장갑을 착용해요. 유리 기구가 깨지지 않게 조심해요.")
        self.play(FadeIn(gear, lag_ratio=0.2), run_time=0.7)
        b1 = K.beaker("육지의 물", K.SEA_L).move_to([-3.6, 0.2, 0])
        b2 = K.beaker("바닷물", K.SEA_L).move_to([-1.2, 0.2, 0])
        rows = VGroup(T("색깔: 둘 다 없어요", 34, INK), T("냄새: 없어요 / 거의 없어요", 34, INK))
        rows.arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([3.3, 0.6, 0])
        self.say("비커에 담아 색깔과 냄새를 관찰해요",
                 "비커에 육지의 물과 바닷물을 담아 관찰해요. 두 물 모두 색깔이 없고, 냄새는 없거나 거의 없어요.")
        self.play(FadeIn(b1), FadeIn(b2), run_time=0.5)
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=0.8)
        no = T("실험에 쓰는 물질은 맛보거나 마시지 않아요", 34, RED).move_to([1.2, -1.5, 0])
        self.say(f"{r('맛보거나 마시지 않아요')}", "주의! 실험에 사용하는 물질은 맛보거나 마시지 않아요.")
        self.play(FadeIn(no), run_time=0.4)
        self.settle()
        self.play(FadeOut(VGroup(gear, rows, no)), b1.animate.move_to([-4.6, 0.6, 0]), b2.animate.move_to([-2.4, 0.6, 0]),
                  run_time=0.6)
        self.say("가열하기 전에는 비슷해 보여요. 어떻게 알아낼까요?",
                 "가열하기 전에는 두 물이 비슷해 보여요. 두 물을 가열해서 남는 것을 비교해 볼 거예요.")
        diff = bin_box("다르게 할 조건", 4.4, 1.2, ORANGE, 32).move_to([2.7, 2.0, 0])
        same = bin_box("같게 할 조건", 4.4, 2.8, GREEN, 32).move_to([2.7, -0.3, 0])
        d1 = T("물의 종류", 34, INK).move_to(diff.box.get_center() + DOWN * 0.2)
        s_items = VGroup(*[T(x, 30, INK) for x in ("물의 양", "끓임쪽 개수", "증발 접시 크기", "가열하는 시간(동시에)")])
        s_items.arrange(DOWN, buff=0.16).move_to(same.box.get_center() + DOWN * 0.25)
        self.play(FadeIn(diff), FadeIn(same), run_time=0.5)
        self.say(f"비교하려는 {o('물의 종류')}만 다르게, 나머지는 {g('같게')}",
                 "육지의 물과 바닷물을 비교하는 실험이라서, 물의 종류만 다르게 하고 나머지 조건은 모두 같게 해요.")
        self.play(FadeIn(d1, scale=0.8), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(x, shift=LEFT * 0.2) for x in s_items], lag_ratio=0.25), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 가열 ──
    def heat(self):
        self.section("실험해요")
        hp = K.hot_plate(8.4).move_to([0, -1.6, 0])
        d1 = K.evap_dish(2.4, water=True).move_to([-2.6, -0.95, 0])
        d2 = K.evap_dish(2.4, water=True).move_to([2.6, -0.95, 0])
        l1 = T("육지의 물", 34, INK).move_to([-2.6, 0.3, 0])
        l2 = T("바닷물", 34, INK).move_to([2.6, 0.3, 0])
        self.say(f"증발 접시에 스포이트로 {o('1 mL씩')} 같은 양을 넣어요",
                 "두 증발 접시에 스포이트로 같은 양을 넣어요. 실험 시간이 오래 걸리지 않게 1 밀리리터씩만 넣어요.")
        self.play(FadeIn(hp), FadeIn(d1), FadeIn(d2), FadeIn(l1), FadeIn(l2), run_time=0.6)
        chip_t = T("끓임쪽: 물이 갑자기 끓어오르는 것을 막아요", 32, ORANGE).move_to([0, 1.3, 0])
        self.say("끓임쪽을 같은 개수만큼 넣어요", "끓임쪽도 같은 개수만큼 넣어요. 끓임쪽은 물이 갑자기 끓어오르는 것을 막아 줘요.")
        self.play(FadeIn(chip_t), Indicate(d1[-1], color=ORANGE), Indicate(d2[-1], color=ORANGE), run_time=0.9)
        self.settle()
        self.play(FadeOut(chip_t), run_time=0.3)
        self.say("핫플레이트에 올려 두 접시를 동시에 가열해요",
                 "핫플레이트를 켜서 두 접시를 동시에 가열해요. 두 접시에서 김이 나요.")
        self.play(hp[2].animate.set_fill("#FF5A3C"), run_time=0.3)
        st = VGroup(steam(-2.6, -0.6), steam(2.6, -0.6))
        self.play(Create(st), run_time=1.0)
        warn = VGroup(T("물질이 튈 수 있으니 멀리서 관찰해요", 32, RED),
                      T("뜨거운 기구는 만지지 말고 집게를 써요", 32, RED)).arrange(DOWN, buff=0.15).move_to([0, 1.75, 0])
        self.say(f"{r('멀리서 관찰')}하고, 뜨거운 접시는 {r('만지지 않아요')}",
                 "가열할 때 물질이 튈 수 있으니 멀리서 관찰해요. 가열한 기구는 매우 뜨거우니 손으로 만지지 말고 증발 접시 집게를 써요.")
        self.play(FadeIn(warn), run_time=0.5)
        self.settle()
        self.play(FadeOut(st), FadeOut(warn), run_time=0.4)
        self.d1, self.d2, self.hp, self.l1, self.l2 = d1, d2, hp, l1, l2

    # ── 결과 ──
    def result(self):
        self.say("물이 모두 없어지면 접시 안에 무엇이 남을까요?", "증발 접시 안의 물이 모두 없어졌어요. 두 접시에는 무엇이 남았을까요?")
        e1 = K.evap_dish(2.4).move_to(self.d1)
        e2 = K.evap_dish(2.4, residue=False).move_to(self.d2)
        self.play(Transform(self.d1, e1), Transform(self.d2, e2), self.hp[2].animate.set_fill("#D2453B"), run_time=0.6)
        self.pause_screen(5, "무엇이 남았을까요?")
        r2 = K.evap_dish(2.4, residue=True).move_to(self.d2)
        self.play(Transform(self.d2, r2), run_time=0.8)
        t1 = T("아무것도 남지 않았어요", 32, INK).move_to([-2.6, 1.0, 0])
        t2 = T("흰색 가루 물질이 남았어요", 32, ORANGE).move_to([2.6, 1.0, 0])
        self.section("결과")
        self.say(f"바닷물 접시에만 {o('흰색 가루 물질')}이 남았어요",
                 "육지의 물을 가열한 접시에는 아무것도 남지 않았고, 바닷물을 가열한 접시에는 흰색 가루 물질이 남았어요.")
        self.play(FadeIn(t1), FadeIn(t2), run_time=0.6)
        self.settle()
        card = text_card([f"육지의 물과 달리 바닷물에는 {o('어떤 물질')}이 녹아 있어요",
                          f"바닷물을 가열하면 {o('흰색 가루')} 물질을 얻을 수 있어요"], size=36).move_to([0, 1.65, 0])
        self.say(f"바닷물에는 {o('어떤 물질')}이 녹아 있어요",
                 "가열하기 전에는 비슷해 보였지만, 바닷물에는 어떤 물질이 녹아 있었어요. 그래서 가열하면 흰색 가루 물질을 얻을 수 있어요.")
        self.play(FadeOut(VGroup(t1, t2)), FadeIn(card, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        self.section("생각 바로잡기")
        q = M(f"“바닷물에는 {o('소금')}만 들어 있다?”", 50).move_to([0, 1.8, 0])
        x = T("아니에요", 46, RED).move_to([0, 0.8, 0])
        a = text_card([f"소금이 가장 많지만, 그 밖에도 {g('여러 가지 물질')}이 녹아 있어요",
                       "그래서 바닷물은 짠맛과 함께 쓴맛도 나요"], size=36).move_to([0, -0.6, 0])
        self.say("바닷물에는 소금만 들어 있을까요?", "바닷물에는 소금만 들어 있을까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.say(f"소금이 가장 많지만 {g('여러 가지 물질')}이 녹아 있어요",
                 "아니에요. 바닷물에는 소금이 가장 많지만, 그 밖에도 여러 가지 물질이 녹아 있어요. 그래서 짠맛과 함께 쓴맛도 나요.")
        self.play(FadeIn(x, scale=0.8), FadeIn(a, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 지구의 물 100컵 ──
    def cups(self):
        self.section("지구의 물")
        grid = K.cup_grid(s=0.34, gap=0.42).move_to([-3.3, 0.4, 0])
        for c in grid:
            c.set_fill(PAPER)
        self.say("지구의 물을 모두 모아 100컵에 나누어 담는다면?",
                 "지구에 있는 물을 모두 모아 100컵에 나누어 담는다고 생각해 봐요. 몇 컵이 바닷물일까요?")
        self.play(FadeIn(grid, lag_ratio=0.005), run_time=1.0)
        self.pause_screen(4, "몇 컵이 바닷물일까요?")
        cols = [K.SEA] * 97 + [K.ICE] * 2 + ["#B9E28C"]
        self.play(LaggedStart(*[c.animate.set_fill(col) for c, col in zip(grid, cols)], lag_ratio=0.01), run_time=1.8)
        legend = VGroup(
            VGroup(K.cup(K.SEA, 0.5), T("바닷물 약 97컵", 38, INK)).arrange(RIGHT, buff=0.3),
            VGroup(K.cup(K.ICE, 0.5), T("빙하 약 2컵", 38, INK)).arrange(RIGHT, buff=0.3),
            VGroup(K.cup("#B9E28C", 0.5), T("지하수·강·호수 약 1컵", 38, INK)).arrange(RIGHT, buff=0.3),
        ).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([3.3, 0.9, 0])
        self.say(f"100컵 가운데 약 {o('97컵')}이 바닷물이에요",
                 "100컵 가운데 약 97컵이 바닷물이에요. 지구의 물은 대부분 바다에 있어요.")
        self.play(FadeIn(legend[0], shift=LEFT * 0.2), run_time=0.5)
        self.say(f"육지의 물은 {o('빙하')}가 가장 많고, 지하수·강·호수에도 있어요",
                 "육지의 물은 얼음 상태인 빙하가 가장 많고, 지하수, 강, 호수에도 있어요.")
        self.play(FadeIn(legend[1], shift=LEFT * 0.2), run_time=0.5)
        self.play(FadeIn(legend[2], shift=LEFT * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)
