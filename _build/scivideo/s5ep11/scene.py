"""「과학 원리 돋보기」 5학년 11화 — 생활 속 거울과 렌즈 (5-1 2단원 빛의 성질 7차시, 화 코드 5-1-2-e)

바탕: grade5/science/sem1/u2-5.html(원본 _build_tb/src/u2-5.html) — 도입(거울이 없으면 불편한 일: 비누 거품 확인·옷 입은 모습·
뒤에서 오는 차 / 작은 글씨를 크게 보는 것은 렌즈), 조사해요(자동차·치과 도구·전등·신발 가게 → 거울, 돋보기안경·관찰용 확대경·사진기·
망원경 → 렌즈, 거울은 빛을 반사하는 성질을, 렌즈는 빛이 굴절하는 성질을 이용), 쓰임새 정리(화장실 거울·자동차 뒷거울·신발 가게의
거울·손거울 / 돋보기·수술용 확대경·보석 확대경·사진기), 한눈에 쏙(물체의 크기를 다르게 보거나 멀리 있는 물체를 잘 보기 위해 렌즈,
거울이 빛을 반사하는 성질·렌즈에서 빛이 굴절하는 성질을 생활에 이용, 거울을 붙이면 편리할 물건 생각하기), 형성 평가(현미경·손거울·
망원경·자동차 뒷거울·돋보기·치과 거울 나누기). 발표해요(붙임쪽지 발표 자료)는 활동이라 뺌.
최종: ./make_final.sh s5ep11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Circle,
                   SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o, b
from scikit import RED, clear_stage
import kit_s5u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


MIR, LEN = BLUE, ORANGE


class S5Ep11(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 11
    EP_TITLE = "생활 속 거울과 렌즈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.find()
        self.uses()
        self.summary()
        self.sort_quiz()
        self.closing(f"거울은 빛의 {b('반사')}를, 렌즈는 빛의 {o('굴절')}을 이용해 생활에 쓰여요",
                     next_preview="5학년 마인드맵 2 · 빛의 성질")
        self.wait(0.5)

    def ox_cards(self, items, w=6.2, size=27, y=0.6, cols=2):
        rows = (len(items) + cols - 1) // cols
        cards = VGroup(*[K.text_card([t], w=w, size=size) for t, _ in items]).arrange_in_grid(rows, cols, buff=(0.32, 0.3)).move_to([0, y, 0])
        for c in cards:
            c[1].shift(LEFT * 0.25)
        return cards

    def mark_cards(self, cards, items):
        marks = VGroup(*[K.ox_mark(ok, 0.2).move_to(c.get_right() + LEFT * 0.36) for c, (_, ok) in zip(cards, items)])
        self.play(*[c[0].animate.set_stroke(GREEN if ok else RED, 6) for c, (_, ok) in zip(cards, items)],
                  FadeIn(marks, lag_ratio=0.1), run_time=0.8)

    # ── 궁금해요: 거울이 없다면? ──
    def intro(self):
        self.section("궁금해요")
        items = [("비누 거품이 남았는지 볼 수 없어요", True), ("옷을 바르게 입었는지 볼 수 없어요", True),
                 ("뒤에서 오는 차를 확인하기 어려워요", True), ("작은 글씨를 크게 볼 수 없어요", False)]
        cards = self.ox_cards(items, w=6.3, size=26, y=0.7)
        self.say("거울이 없으면 어떤 점이 불편할까요?",
                 "아침에 세수할 때, 옷을 입을 때 거울을 본 적이 있지요? 거울이 없으면 어떤 점이 불편할까요?")
        self.play(FadeIn(cards, lag_ratio=0.1), run_time=0.8)
        self.settle()
        self.pause_screen(5, "거울이 없으면 불편한 일은?")
        self.mark_cards(cards, items)
        self.say(f"거울이 없으면 내 모습이나 {o('뒤쪽')}을 볼 수 없어요",
                 "거울이 없으면 내 모습이나 뒤쪽을 볼 수 없어 불편해요. 작은 글씨를 크게 보는 것은 렌즈, 돋보기가 하는 일이에요.")
        self.settle()
        clear_stage(self)

    # ── 조사해요: 거울과 렌즈를 찾아라 ──
    def find(self):
        self.section("조사해요")
        data = [(K.car_mirror(), "자동차", "m"), (K.dental(), "치과 도구", "m"), (K.lamp_shade(), "전등", "m"),
                (K.shoe_mirror(), "신발 가게", "m"), (K.reading_glasses(), "돋보기안경", "l"), (K.loupe(), "관찰용 확대경", "l"),
                (K.camera(), "사진기", "l"), (K.telescope(), "망원경", "l")]
        order = [0, 4, 1, 5, 2, 6, 3, 7]
        cards = VGroup(*[K.pic_card(data[i][0], data[i][1], 2.95, 2.15, size=26) for i in order])
        cards.arrange_in_grid(2, 4, buff=(0.3, 0.28)).move_to([0, 0.3, 0])
        self.say("물건 속에서 거울이나 렌즈가 있는 곳을 찾아요",
                 "그림 속 물건에서 거울이나 렌즈가 있는 곳을 찾고, 거울인지 렌즈인지 골라 봐요.")
        self.play(FadeIn(cards, lag_ratio=0.08), run_time=1.0)
        self.settle()
        self.pause_screen(5, "거울일까요, 렌즈일까요?")
        tags = VGroup()
        anims = []
        for c, i in zip(cards, order):
            kind = data[i][2]
            col = MIR if kind == "m" else LEN
            sp = data[i][0].spot
            ring = SurroundingRectangle(sp, color="#FFC93C", buff=0.06, stroke_width=6, corner_radius=0.08)
            nm = T(f"{data[i][1]} → {'거울' if kind == 'm' else '렌즈'}", 24, col)
            if nm.width > 2.75:
                nm.scale_to_fit_width(2.75)
            nm.move_to(c[2])
            tags.add(ring)
            anims += [c[0].animate.set_stroke(col, 6), Transform(c[2], nm)]
        self.play(*anims, FadeIn(tags, lag_ratio=0.05), run_time=1.2)
        self.say(f"자동차·치과 도구·전등·신발 가게에는 {b('거울')}이 있어요",
                 "자동차의 뒷거울, 치과 도구의 작은 거울, 전등 갓 안쪽의 거울, 신발 가게의 거울은 모두 거울이에요.")
        self.settle()
        self.say(f"돋보기안경·확대경·사진기·망원경에는 {o('렌즈')}가 있어요",
                 "돋보기안경, 관찰용 확대경, 사진기, 망원경에는 렌즈가 들어 있어요.")
        self.settle()
        self.say(f"거울은 빛의 {b('반사')}를, 렌즈는 빛의 {o('굴절')}을 이용해요",
                 "거울은 빛을 반사하는 성질을, 렌즈는 빛이 굴절하는 성질을 이용해요.")
        self.settle()
        clear_stage(self)

    # ── 쓰임새 정리 ──
    def uses(self):
        self.section("쓰임새")
        m = K.text_card([f"{b('거울')}을 이용하는 예",
                         "· 화장실 거울: 얼굴이 잘 씻겼는지 확인해요",
                         "· 자동차 뒷거울: 뒤에 있는 차를 봐요",
                         "· 신발 가게의 거울: 신발 신은 모습을 봐요",
                         "· 손거울: 들고 다니며 얼굴을 봐요"], w=6.4, size=26, stroke=MIR)
        l = K.text_card([f"{o('렌즈')}를 이용하는 예",
                         "· 돋보기: 작은 글씨를 크게 확대해서 봐요",
                         "· 수술용 확대경: 수술 부위를 크게 봐요",
                         "· 보석 확대경: 작은 보석을 자세히 봐요",
                         "· 사진기: 볼록·오목 렌즈로 사진을 찍어요"], w=6.4, size=26, stroke=LEN)
        VGroup(m, l).arrange(RIGHT, buff=0.3).move_to([0, 0.55, 0])
        self.say(f"{b('거울')}은 모습이나 보이지 않는 곳을 볼 때 써요",
                 "거울은 세수할 때 얼굴을 확인하고, 자동차 뒤를 보고, 신발 신은 모습을 볼 때 써요.")
        self.play(FadeIn(m, shift=UP * 0.2), run_time=0.6)
        self.settle()
        self.say(f"{o('렌즈')}는 물체를 크게, 자세히 볼 때 써요",
                 "렌즈는 작은 글씨나 수술 부위, 작은 보석을 크게 볼 때 쓰고, 사진기에도 볼록 렌즈와 오목 렌즈가 들어 있어요.")
        self.play(FadeIn(l, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"물체의 크기를 다르게 보거나 멀리 있는 물체를",
                            f"잘 보기 위해 {o('렌즈')}를 사용합니다."], w=11.6, size=40).move_to([0, 1.7, 0])
        self.say(f"크기를 다르게 보거나 멀리 있는 물체를 볼 때 {o('렌즈')}를 써요",
                 "물체의 크기를 다르게 보거나 멀리 있는 물체를 잘 보기 위해 렌즈를 사용합니다.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        q = T("생활용품에 거울을 붙이면 더 편리해질 물건은?", 34).move_to([0, 0.25, 0])
        ideas = VGroup(K.text_card(["안경에 거울", "→ 뒤를 볼 수 있게"], w=3.9, size=27),
                       K.text_card(["창문에 거울", "→ 뜨거운 햇빛을 반사"], w=3.9, size=27),
                       K.text_card(["책상에 거울", "→ 뒤에서 오는 사람 보기"], w=3.9, size=27)).arrange(RIGHT, buff=0.3).move_to([0, -1.1, 0])
        self.say("거울을 붙이면 더 편리해질 물건을 생각해 봐요",
                 "생활용품 중에서 거울을 붙이면 더욱 편리할 것 같은 물건을 생각해 봐요.")
        self.play(FadeIn(q), run_time=0.4)
        self.settle()
        self.pause_screen(5, "내 생각을 말해 보세요")
        self.play(FadeIn(ideas, lag_ratio=0.2), run_time=0.8)
        self.say(f"거울에 {b('반사')}된 빛으로 뒤를 보거나 햇빛을 막을 수 있어요",
                 "안경이나 책상에 거울을 붙이면 거울에 반사된 빛으로 뒤를 볼 수 있고, 창문에 붙이면 뜨거운 햇빛을 반사할 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 확인해 봐요: 거울과 렌즈 나누기 ──
    def sort_quiz(self):
        self.section("확인해 봐요")
        names = [("현미경", "l"), ("손거울", "m"), ("망원경", "l"), ("자동차 뒷거울", "m"), ("돋보기", "l"), ("치과 거울", "m")]
        chips = VGroup(*[K.text_card([n], size=28, pad=0.17) for n, _ in names]).arrange(RIGHT, buff=0.25).move_to([0, 2.05, 0])
        if chips.width > 12.8:
            chips.scale_to_fit_width(12.8)
        b1 = K.bin_box("거울을 이용한 것", 6.0, 3.1, MIR).move_to([-3.2, -0.65, 0])
        b2 = K.bin_box("렌즈를 이용한 것", 6.0, 3.1, LEN).move_to([3.2, -0.65, 0])
        self.say("거울을 이용한 것과 렌즈를 이용한 것으로 나누어 봐요",
                 "거울을 이용한 것과 렌즈를 이용한 것으로 나누어 봐요.")
        self.play(FadeIn(chips, lag_ratio=0.1), FadeIn(b1), FadeIn(b2), run_time=0.8)
        self.settle()
        self.pause_screen(4, "거울일까요, 렌즈일까요?")
        nm = nl = 0
        anims = []
        for c, (n, k) in zip(chips, names):
            if k == "m":
                tgt = [-3.2, -0.35 - nm * 0.62, 0]
                nm += 1
            else:
                tgt = [3.2, -0.35 - nl * 0.62, 0]
                nl += 1
            anims.append(c.animate.move_to(tgt))
        self.play(*anims, run_time=1.2)
        self.say(f"손거울·뒷거울·치과 거울은 {b('거울')}, 현미경·망원경·돋보기는 {o('렌즈')}",
                 "손거울, 자동차 뒷거울, 치과 거울은 거울을 이용하고, 현미경, 망원경, 돋보기는 렌즈를 이용해요.")
        self.settle()
        clear_stage(self)
