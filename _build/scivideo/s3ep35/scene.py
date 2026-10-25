"""「과학 원리 돋보기」 3학년 35화 — 감염병이란 무엇일까? (3-2 4단원 감염병과 건강한 생활 2차시, 화 코드 3-2-4-a)

바탕: grade3/science/sem2/u4-1.html — 도입(감기 증상 고르기: 콧물·기침·열·목 아픔 / 체온계 '열은 몸이 아프다는 신호'),
감염병이란(병원체가 몸에 들어와 걸리는 질병, 병원체는 아주 작아 눈으로 볼 수 없음, 감염병 고르기: 감기·독감·식중독·수족구병),
증상 카드 7가지(독감·식중독·수족구병·유행 각결막염·파상풍·무좀·코로나19), '이름·증상을 외우는 것이 목표가 아니에요',
생각 바로잡기 OX 4, 한눈에 쏙 '병원체가 몸에 들어와 걸리는 질병을 감염병이라고 합니다', 형성 평가.
병원체 그림은 아주 크게, 단순하게 그린 것(실제로는 눈에 보이지 않음).
최종: ./make_final.sh s3ep35
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, Circumscribe,
                   Arrow, RoundedRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag, person, place
import kit_s3u24 as K
from kit_s3u12 import text_card, ox_mark


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


SYMP = [("독감", "열이 심하게 나고, 재채기와 콧물이 나요"),
        ("식중독", "오염된 음식을 먹어 설사를 하고 배가 아파요"),
        ("수족구병", "입안과 손발에 물집이 생겨요"),
        ("유행 각결막염", "눈이 빨개지고 가려워요"),
        ("파상풍", "흙이나 못에 상처가 오염되어 근육이 굳어져요"),
        ("무좀", "피부가 허옇게 되거나 갈라지고 매우 간지러워요"),
        ("코로나19", "열이 나고 기침을 하며, 냄새를 잘 못 맡기도 해요")]


class S3Ep35(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 35
    EP_TITLE = "감염병이란 무엇일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.meaning()
        self.symptoms()
        self.ox()
        self.summary()
        self.closing(f"{o('병원체')}가 우리 몸에 들어와 걸리는 질병을\n{g('감염병')}이라고 해요",
                     next_preview="3학년 36화 · 감염병은 왜 위험할까?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        f = K.face("sick", 1.15).move_to([-3.6, 0.6, 0])
        th = K.thermometer(1.8).move_to([-1.4, 0.7, 0]).rotate(-0.35)
        self.say("감기에 걸려 본 적이 있나요?", "여러분은 감기에 걸려 본 적이 있나요?")
        self.play(FadeIn(f, scale=0.8), run_time=0.6)
        self.say(f"열이 나는 것은 몸이 {o('아프다는 신호')}예요",
                 "체온계로 열을 재요. 열이 나는 것은 몸이 아프다는 신호예요.")
        self.play(FadeIn(th, shift=LEFT * 0.3), run_time=0.5)
        items = [("콧물이 나요", True), ("기침을 해요", True), ("열이 나요", True), ("목이 아파요", True),
                 ("키가 갑자기 커져요", False), ("머리카락 색이 바뀌어요", False)]
        cards = K.choice_grid(items, cols=1, size=30, w=5.4, h=0.62, dy=0.74, top=2.3, cx=3.4)
        self.say("감기에 걸렸을 때 나타나는 증상은?", "감기에 걸렸을 때 나타나는 증상을 모두 골라 볼까요?")
        self.play(LaggedStart(*[FadeIn(c, shift=LEFT * 0.2) for c in cards], lag_ratio=0.12), run_time=1.2)
        self.pause_screen(4, "감기 증상을 모두 골라요")
        self.say(f"콧물·기침·열·목 아픔이 {g('감기 증상')}이에요",
                 "콧물, 기침, 열, 목이 아픈 것이 감기 증상이에요. 키가 커지거나 머리카락 색이 바뀌지는 않아요.")
        self.play(*K.reveal_marks(cards), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 감염병이란 ──
    def meaning(self):
        self.section("감염병이란")
        kid = person(2.6, BLUE)
        place(kid, 4.2, -2.1)
        germs = VGroup(K.germ("ball", K.GERM_G, 1.0).move_to([-4.0, 0.7, 0]),
                       K.germ("rod", K.GERM_P, 0.95).move_to([-1.4, 0.9, 0]),
                       K.germ("dots", K.GERM_O, 0.95).move_to([-2.6, -0.7, 0]))
        lab = tag("병원체", ORANGE, 40).move_to([-2.6, 2.3, 0])
        note = T("그림은 아주 크게 그린 것이에요", 26, SOFT).move_to([-2.6, -1.85, 0])
        self.say(f"우리 몸에 병을 일으키는 아주 작은 것 = {o('병원체')}",
                 "감기처럼 우리 몸에 병을 일으키는 아주 작은 것을 병원체라고 해요.")
        self.play(FadeIn(kid), LaggedStart(*[FadeIn(x, scale=0.5) for x in germs], lag_ratio=0.2),
                  FadeIn(lab), run_time=1.2)
        self.play(FadeIn(note), run_time=0.3)
        self.say(f"병원체는 아주 작아서 {r('눈으로 볼 수 없어요')}",
                 "병원체는 아주 작아서 눈으로 볼 수 없어요. 여기에서는 알아보기 쉽게 크게 그렸어요.")
        self.settle()
        head = kid[-1].get_center()
        self.say(f"병원체가 몸에 들어와 걸리는 질병 = {g('감염병')}",
                 "이런 병원체가 우리 몸에 들어와 걸리는 질병을 감염병이라고 해요.")
        self.play(*[x.animate.scale(0.45).move_to(head + np.array([0.0, -0.1 * i, 0])).set_opacity(0.0)
                    for i, x in enumerate(germs)], run_time=1.4)
        card = text_card([f"병원체가 몸에 들어와 걸리는 질병", f"= {g('감염병')}"], size=40).move_to([-1.6, 0.8, 0])
        self.play(FadeIn(card, shift=UP * 0.2), FadeOut(note), FadeOut(lab), run_time=0.5)
        self.settle()
        clear_stage(self)

        items = [("감기", True), ("독감", True), ("식중독", True), ("수족구병", True),
                 ("넘어져서 생긴 무릎 상처", False), ("젖니가 빠짐", False)]
        cards = K.choice_grid(items, cols=2, size=34, w=5.6, h=0.78, dy=1.0, top=1.9)
        self.say("다음 중 감염병은 무엇일까요?", "다음 중 감염병인 것을 모두 골라 볼까요?")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in cards], lag_ratio=0.12), run_time=1.2)
        self.pause_screen(4, "감염병을 모두 골라요")
        self.say(f"감기·독감·식중독·수족구병은 {g('감염병')}이에요",
                 "감기, 독감, 식중독, 수족구병이 감염병이에요. 다친 상처나 이가 빠지는 것은 감염병이 아니에요.")
        self.play(*K.reveal_marks(cards), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 증상 카드 ──
    def symptoms(self):
        self.section("여러 가지 감염병")
        self.say("우리 주변에는 여러 가지 감염병이 있어요", "우리 주변에는 여러 가지 감염병이 있어요. 증상 카드를 살펴봐요.")
        rows = VGroup()
        for i, (nm, s) in enumerate(SYMP):
            y = 2.2 - i * 0.62
            box = RoundedRectangle(corner_radius=0.15, width=13.0, height=0.58, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=SOFT, stroke_width=3).move_to([0, y, 0])
            st = T(s, 28, INK).move_to([-1.55, y, 0])
            if st.width > 8.6:
                st.scale_to_fit_width(8.6)
            st.align_to(box, LEFT).shift(RIGHT * 0.3)
            q = T("?", 34, SOFT).move_to([4.9, y, 0])
            nt = T(nm, 32, ORANGE).move_to([4.9, y, 0])
            row = VGroup(box, st, q)
            row.nm = nt
            rows.add(row)
        self.play(LaggedStart(*[FadeIn(rw, shift=UP * 0.15) for rw in rows], lag_ratio=0.1), run_time=1.6)
        self.say("증상을 읽고 어떤 감염병인지 떠올려요", "증상을 읽고 어떤 감염병인지 떠올려 봐요.")
        self.pause_screen(5, "증상에 알맞은 감염병은?")
        self.say(f"독감 · 식중독 · 수족구병 · 유행 각결막염",
                 "열이 심하게 나는 독감, 오염된 음식을 먹어 걸리는 식중독, 물집이 생기는 수족구병, 눈이 빨개지는 유행 각결막염이에요.")
        self.play(LaggedStart(*[FadeOut(rw[2]) for rw in rows[:4]], *[FadeIn(rw.nm) for rw in rows[:4]], lag_ratio=0.1),
                  run_time=1.0)
        self.say("파상풍 · 무좀 · 코로나19",
                 "상처가 오염되어 근육이 굳는 파상풍, 피부가 갈라지고 간지러운 무좀, 냄새를 잘 못 맡기도 하는 코로나19도 있어요.")
        self.play(LaggedStart(*[FadeOut(rw[2]) for rw in rows[4:]], *[FadeIn(rw.nm) for rw in rows[4:]], lag_ratio=0.1),
                  run_time=0.9)
        self.settle()
        self.play(FadeOut(rows), *[FadeOut(rw.nm) for rw in rows], run_time=0.4)
        msg = text_card(["감염병의 이름과 증상을 외우는 것보다",
                         f"{g('어떻게 예방할지')} 생각하는 것이 더 중요해요"], size=40).move_to([0, 0.5, 0])
        self.say(f"이름을 외우기보다 {g('예방')}을 생각해요",
                 "감염병의 이름과 증상을 외우는 것이 목표가 아니에요. 어떻게 예방할지 생각하는 것이 더 중요해요.")
        self.play(FadeIn(msg, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def ox(self):
        self.section("생각 바로잡기")
        qs = [("모든 감염병은 다른 사람에게 옮아요.", False, "파상풍처럼 다른 사람에게 옮지 않는 감염병도 있어요"),
              ("독감은 그냥 독한 감기예요.", False, "감기와 독감은 원인이 되는 병원체가 서로 달라요"),
              ("무좀은 발에만 생겨요.", False, "손, 손발톱, 얼굴 등 몸의 여러 곳에 생길 수 있어요"),
              ("감염병은 병원체가 몸에 들어와 걸리는 병이에요.", True, "병원체는 너무 작아서 눈으로 볼 수 없어요")]
        rows = VGroup()
        for i, (q, a, e) in enumerate(qs):
            y = 2.1 - i * 1.15
            qt = T(q, 32, INK).move_to([-0.6, y + 0.18, 0])
            qt.align_to([-6.3, 0, 0], LEFT)
            et = T(e, 26, GREEN if a else RED).move_to([0, y - 0.3, 0])
            et.align_to([-6.0, 0, 0], LEFT)
            mk = ox_mark(a, 0.28).move_to([5.9, y, 0])
            rows.add(VGroup(qt, et, mk))
        self.say("맞으면 ○, 틀리면 ×", "맞으면 동그라미, 틀리면 가위표예요. 네 문장을 읽어 볼까요?")
        self.play(LaggedStart(*[FadeIn(rw[0], shift=RIGHT * 0.2) for rw in rows], lag_ratio=0.15), run_time=1.2)
        self.pause_screen(5, "맞을까요, 틀릴까요?")
        self.say(f"모든 감염병이 옮는 것은 {r('아니에요')}",
                 "모든 감염병이 다른 사람에게 옮는 것은 아니에요. 파상풍처럼 옮지 않는 감염병도 있어요.")
        self.play(FadeIn(rows[0][2], scale=0.6), FadeIn(rows[0][1]), run_time=0.5)
        self.say(f"독감은 감기와 {r('병원체가 달라요')}",
                 "독감은 그냥 독한 감기가 아니에요. 감기와 원인이 되는 병원체가 달라요.")
        self.play(FadeIn(rows[1][2], scale=0.6), FadeIn(rows[1][1]), run_time=0.5)
        self.say(f"무좀은 발에만 생기지 {r('않아요')}",
                 "무좀은 발뿐 아니라 손, 손발톱, 얼굴 등 몸의 여러 곳에 생길 수 있어요.")
        self.play(FadeIn(rows[2][2], scale=0.6), FadeIn(rows[2][1]), run_time=0.5)
        self.say(f"병원체가 몸에 들어와 걸리는 병 — {g('맞아요')}",
                 "감염병은 병원체가 몸에 들어와 걸리는 병이에요. 이 문장은 맞아요.")
        self.play(FadeIn(rows[3][2], scale=0.6), FadeIn(rows[3][1]), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("한눈에 쏙")
        gs = K.germ_trio(0.7).move_to([-4.4, 0.6, 0])
        card = text_card(["병원체가 몸에 들어와 걸리는", f"질병을 {o('감염병')}이라고 합니다."], size=44).move_to([1.9, 0.6, 0])
        self.say(f"병원체가 몸에 들어와 걸리는 질병 = {o('감염병')}",
                 "정리해요. 병원체가 몸에 들어와 걸리는 질병을 감염병이라고 해요.")
        self.play(FadeIn(gs, scale=0.8), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        self.play(Circumscribe(card, color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)
