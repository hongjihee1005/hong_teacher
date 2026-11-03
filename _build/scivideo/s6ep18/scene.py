"""「과학 원리 돋보기」 6학년 18화 — 꽃의 생김새와 하는 일 (6-1 3단원 식물의 구조와 기능 7차시, 화 코드 6-1-3-f)

바탕: grade6/science/sem1/u3-6.html(원본 _build_tb/src/u3-6.html) — 도입(애기똥풀꽃 노란색·꽃잎 4장, 제비꽃 보라색·꽃잎 5장,
무궁화 꽃잎 5장 → 생김새는 다양하지만 공통 구조), 꽃의 구조(암술 둘레에 수술, 바깥에 꽃잎, 꽃잎 아래 꽃받침), 달맞이꽃 분리 관찰(암술 1개·
윗부분 네 갈래, 수술 8개·노란색, 꽃잎 4장·각각 떨어짐, 꽃받침 4개가 2개씩 합쳐지며 뒤로 젖혀짐), 꽃가루받이(복숭아꽃, 곤충·새·바람·물 — 흙은 아님),
씨와 열매가 되는 차례, 열매가 하는 일, 생각 바로잡기(모든 꽃에 네 부분이 다 있지는 않음), 화려한 꽃잎, 한눈에 쏙.
최종: ./make_final.sh s6ep18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform,
                   Rectangle, RoundedRectangle, Line, Circle, Rotate, VMobject, Dot, ArcBetweenPoints)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S6Ep18(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 18
    EP_TITLE = "꽃의 생김새와 하는 일"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.structure()
        self.dalmaji()
        self.pollinate()
        self.fruit()
        self.misc()
        self.summary()
        self.closing(f"꽃가루받이가 이루어지면 {o('씨')}가 생기고,\n씨를 둘러싼 부분이 자라 {g('열매')}가 돼요",
                     next_preview="6학년 19화 · 식물의 기관은 연결되어 있어요")
        self.wait(0.5)

    def intro(self):
        self.section("궁금해요")
        fs = VGroup(K.small_flower(4, "#FFD93B", 0.85, "#C9A300", "#E8B800"),
                    K.small_flower(5, "#9B6BC4", 0.85, "#5E3A86", "#F2D24A"),
                    K.small_flower(5, "#F3A6C4", 0.95, "#B5527A", "#B5274F")).arrange(RIGHT, buff=2.0).move_to([0, 0.9, 0])
        ns = VGroup(*[K.name_text(t, 28).next_to(f, DOWN, buff=0.35) for t, f in
                      zip(["애기똥풀꽃\n노란색 · 꽃잎 4장", "제비꽃\n보라색 · 꽃잎 5장", "무궁화\n꽃잎 5장"], fs)])
        self.say("내가 좋아하는 꽃은 어떻게 생겼나요?", "내가 좋아하는 꽃은 어떻게 생겼는지 이야기해 볼까요?")
        self.play(FadeIn(fs, lag_ratio=0.2), FadeIn(ns, lag_ratio=0.2), run_time=1.0)
        self.say(f"색깔·크기·모양은 다양하지만 {o('공통된 구조')}도 있어요",
                 "꽃은 식물의 종류에 따라 색깔이나 크기, 모양이 다양하지만, 구조를 살펴보면 공통된 부분도 있어요.")
        self.settle()
        clear_stage(self)

    def structure(self):
        self.section("꽃의 구조")
        f = K.flower_parts(4.6).move_to([-2.6, 0.2, 0])
        ps = VGroup(K.pointer(f.pt("pistil"), (2.0, 2.4), "암술", "#4E7F2A", 34),
                    K.pointer(f.pt("stamen"), (2.4, 1.2), "수술", "#B88A00", 34),
                    K.pointer(f.pt("petal"), (-6.1, 1.6), "꽃잎", "#C4547A", 34),
                    K.pointer(f.pt("sepal"), (2.0, -1.2), "꽃받침", "#3F6E1E", 34))
        self.say("꽃은 암술·수술·꽃잎·꽃받침으로 이루어져 있어요", "꽃의 구조를 알아봐요.")
        self.play(FadeIn(f), run_time=0.7)
        self.play(FadeIn(ps[0]), Indicate(f.pistil, color=ORANGE), run_time=0.7)
        self.play(FadeIn(ps[1]), run_time=0.5)
        self.say(f"암술 둘레를 {o('수술')}이 둘러싸고, 바깥에 {o('꽃잎')}이 있어요",
                 "암술 주변을 수술이 둘러싸고 있어요. 암술과 수술 바깥에 꽃잎이 있고, 꽃잎 아래쪽에 꽃받침이 있어요.")
        self.play(FadeIn(ps[2]), run_time=0.5)
        self.play(FadeIn(ps[3]), Indicate(f.sepals, color=ORANGE), run_time=0.7)
        self.settle()
        clear_stage(self)

    def dalmaji(self):
        self.section("관찰해요")
        paper = Rectangle(width=13.2, height=4.4, fill_color="#FFFFFF", fill_opacity=1, stroke_color=SOFT, stroke_width=3).move_to([0, 0.35, 0])
        pis, sta, pet, sep = K.dalmaji_parts()
        xs = [-5.0, -1.9, 1.5, 4.9]
        for m, x in zip((pis, sta, pet, sep), xs):
            K.fit(m, 2.6, 2.0).move_to([x, 1.05, 0])
        heads = ["암술", "수술", "꽃잎", "꽃받침"]
        notes = ["1개 · 윗부분이\n네 갈래", "8개 · 노란색", "4장 · 각각\n떨어져 있음", "4개가 2개씩 합쳐지며\n뒤로 젖혀짐"]
        hs = VGroup(*[T(h, 34, self.accent).move_to([x, -0.35, 0]) for h, x in zip(heads, xs)])
        nt = VGroup(*[K.name_text(n, 26).move_to([x, -1.15, 0]) for n, x in zip(notes, xs)])
        self.say("달맞이꽃을 분리해 흰 종이 위에 놓아요", "핀셋으로 달맞이꽃의 부분을 하나씩 떼어 흰 종이 위에 놓아요.")
        self.play(FadeIn(paper), run_time=0.4)
        self.play(*[FadeIn(m, shift=DOWN * 0.2) for m in (pis, sta, pet, sep)], FadeIn(hs), run_time=1.0)
        self.say(f"암술 {o('1개')}, 수술 {o('8개')}, 꽃잎 {o('4장')}, 꽃받침 {o('4개')}",
                 "암술은 한 개이고 윗부분이 네 갈래로 갈라져 있어요. 수술은 여덟 개이고 노란색이에요.")
        self.play(FadeIn(nt[0]), FadeIn(nt[1]), run_time=0.6)
        self.settle()
        self.say(f"꽃받침은 2개씩 합쳐지며 {o('뒤로 젖혀져요')}",
                 "꽃잎은 네 장이고 각각 떨어져 있어요. 꽃받침은 네 개가 두 개씩 합쳐지며 뒤로 젖혀져요.")
        self.play(FadeIn(nt[2]), FadeIn(nt[3]), run_time=0.6)
        self.settle()
        clear_stage(self)

    def pollinate(self):
        self.section("꽃가루받이")
        f = K.flower_parts(4.6).move_to([-2.4, 0.2, 0])
        b = K.bee().scale(0.75).move_to([3.4, 2.2, 0])
        self.say("수술의 꽃가루가 암술로 어떻게 옮겨 갈까요?", "수술에 있는 꽃가루가 암술에 어떻게 옮겨 붙을까요?")
        self.play(FadeIn(f), FadeIn(b), run_time=0.7)
        st = f.stamens[-1].get_center()
        pi = f.pistil[2].get_center()
        self.play(b.animate.move_to(st + UP * 0.35 + RIGHT * 0.2), run_time=1.0)
        pol = VGroup(*[Dot(st + np.array([0.06 * k - 0.1, 0.1 + 0.03 * (k % 2), 0]), radius=0.05, color="#F2C230").set_stroke("#B88A00", 1) for k in range(5)])
        self.play(FadeIn(pol), run_time=0.3)
        self.play(b.animate.move_to(pi + UP * 0.4), pol.animate.move_to(pi + UP * 0.05), run_time=1.1)
        card = K.text_card([f"수술의 {o('꽃가루')}가 암술에 옮겨 붙는 것", f"= {g('꽃가루받이')}"], w=5.9, size=32).move_to([3.75, -0.6, 0])
        self.say(f"꽃가루가 암술에 옮겨 붙는 것을 {g('꽃가루받이')}라고 해요",
                 "수술에 있는 꽃가루가 곤충 등의 도움으로 암술에 옮겨 붙어요. 이것을 꽃가루받이라고 해요.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        clear_stage(self)
        items = [("곤충", K.bee().scale(0.55), True), ("새", K.bird(1.5), True), ("바람", K.wind_lines(0, (0.0, 0.35, 0.7), 1.2), True),
                 ("물", VGroup(*[K.E(0.22, 0.32, K.WATER, x, 0, stroke=K.WATER_C, sw=3) for x in (-0.3, 0.1, 0.5)]), True),
                 ("흙", K.poly([(-0.7, -0.2), (0.7, -0.2), (0.4, 0.25), (-0.4, 0.25)], K.SOIL, stroke=K.SOIL_D, sw=3), False)]
        cards = VGroup()
        for n, p, ok in items:
            cards.add(K.pic_card(p, n, 2.3, 2.4, 32))
        cards.arrange(RIGHT, buff=0.3).move_to([0, 0.5, 0])
        self.say("꽃가루가 옮겨 가도록 돕는 것은 무엇일까요?", "꽃가루가 암술로 옮겨 붙도록 도와주는 것은 무엇일까요?")
        self.play(FadeIn(cards, lag_ratio=0.1), run_time=0.8)
        self.pause_screen(5, "도와주는 것을 모두 골라요")
        marks = VGroup(*[K.ox_mark(ok, 0.28).move_to(c_.get_corner(UP + RIGHT) + np.array([-0.35, -0.35, 0])) for c_, (_, _, ok) in zip(cards, items)])
        self.say(f"{o('곤충')}·{o('새')}·{o('바람')}·{o('물')}이 도와요 — 흙은 아니에요",
                 "꽃가루는 곤충, 새, 바람, 물 등의 도움으로 암술에 옮겨 붙어요. 흙이 꽃가루를 옮기지는 않아요.")
        self.play(FadeIn(marks), cards[4].animate.set_opacity(0.45), run_time=0.8)
        self.settle()
        clear_stage(self)

    def fruit(self):
        self.section("씨와 열매")
        pics = [K.peach_flower(0.75), K.pistil_seed(1.4, 0.0), K.pistil_seed(1.4, 0.55), K.peach(0.8, True)]
        texts = ["꽃가루받이", "암술 속에\n씨가 생겨요", "씨를 둘러싼 부분도\n함께 자라요", "열매가 돼요"]
        cards = VGroup()
        for p, t_ in zip(pics, texts):
            box = RoundedRectangle(corner_radius=0.2, width=2.7, height=3.4, fill_color=PAPER, fill_opacity=1, stroke_color=self.accent, stroke_width=4)
            K.fit(p, 1.9, 1.7).move_to(box.get_center() + UP * 0.55)
            tt = K.name_text(t_, 27)
            if tt.width > 2.45:
                tt.scale_to_fit_width(2.45)
            tt.move_to(box.get_center() + DOWN * 1.05)
            cards.add(VGroup(box, p, tt))
        cards.arrange(RIGHT, buff=0.55).move_to([0, 0.8, 0])
        arrs = VGroup(*[K.arrow_right(cards[i].get_right()[0] + 0.06, cards[i + 1].get_left()[0] - 0.06, 0.8, self.accent, 7) for i in range(3)])
        self.say("복숭아꽃이 열매가 되는 과정을 봐요", "복숭아꽃이 열매가 되는 과정을 살펴봐요.")
        self.play(FadeIn(cards[0]), run_time=0.5)
        self.say(f"꽃가루받이가 되면 암술 속에 {o('씨')}가 생겨요",
                 "꽃가루받이가 이루어지면 암술 속에 씨가 생겨요.")
        self.play(Create(arrs[0]), FadeIn(cards[1]), run_time=0.6)
        self.say(f"씨를 둘러싼 부분도 함께 자라 {g('열매')}가 돼요",
                 "씨가 자라면서 씨를 둘러싼 부분도 함께 자라 열매가 돼요.")
        self.play(Create(arrs[1]), FadeIn(cards[2]), run_time=0.6)
        self.play(Create(arrs[2]), FadeIn(cards[3]), run_time=0.6)
        self.settle()
        job = K.text_card([f"열매는 {o('씨를 보호')}하고, 씨가 익으면 {o('멀리 퍼지게')} 해요"], size=34).move_to([0, -1.85, 0])
        self.say(f"열매는 씨를 {o('보호')}하고, 익으면 멀리 {o('퍼지게')} 해요",
                 "열매는 씨를 보호하고, 씨가 익으면 멀리 퍼지게 해요. 꽃이 씨를 만들고 열매가 씨를 퍼뜨리면서 식물은 세대를 이어 가요.")
        self.play(FadeIn(job, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def misc(self):
        self.section("생각 바로잡기")
        bx = RoundedRectangle(corner_radius=0.16, width=12.0, height=1.1, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([0, 1.8, 0])
        tt = T("모든 꽃은 암술, 수술, 꽃잎, 꽃받침을 모두 가지고 있다.", 34)
        tt.scale_to_fit_width(min(tt.width, 10.4)).move_to(bx).shift(RIGHT * 0.5)
        mk = K.ox_mark(False, 0.3).move_to(bx.get_left() + RIGHT * 0.55)
        self.say("모든 꽃에 네 부분이 다 있을까요?", "모든 꽃은 암술, 수술, 꽃잎, 꽃받침을 모두 가지고 있을까요?")
        self.play(FadeIn(bx), FadeIn(tt), run_time=0.6)
        self.wait(1.0)
        self.say(f"아니요, 종류에 따라 {o('일부가 없는')} 꽃도 있어요",
                 "아니요. 꽃은 종류에 따라 암술, 수술, 꽃잎, 꽃받침 가운데 일부가 없는 것도 있어요.")
        self.play(FadeIn(mk), run_time=0.5)
        self.settle()
        fl = K.small_flower(5, "#E2457A", 0.8, "#9A2A55", "#F2D24A").move_to([-2.6, -0.6, 0])
        b = K.bee().scale(0.6).move_to([-0.9, 0.15, 0])
        card = K.text_card([f"꽃잎의 색이 화려하면", f"{o('벌이나 나비')}를 불러들이기 좋아요"], size=32).move_to([2.9, -0.6, 0])
        self.say(f"꽃잎이 화려하면 {o('곤충')}을 불러들이기 좋아요",
                 "곤충의 도움으로 꽃가루받이를 하는 꽃은 꽃잎의 색이 화려하면 벌이나 나비를 불러들이기 좋아요. 곤충이 많이 모이면 꽃가루받이가 될 가능성이 높아져요.")
        self.play(FadeIn(fl), FadeIn(b), FadeIn(card), run_time=0.7)
        self.play(b.animate.move_to(fl.get_center() + UP * 0.3), run_time=0.9)
        self.settle()
        clear_stage(self)

    def summary(self):
        self.section("한눈에 쏙")
        f = K.flower_parts(2.8).move_to([-4.2, 0.9, 0])
        p1 = K.pistil_seed(1.0, 0.3).move_to([-0.8, 0.8, 0])
        pe = K.peach(0.85, True).move_to([2.4, 0.8, 0])
        a1 = K.arrow_right(-2.9, -1.6, 0.8, self.accent, 7)
        a2 = K.arrow_right(0.0, 1.2, 0.8, self.accent, 7)
        card = K.text_card([f"꽃은 씨를 만들고, 씨가 자라면서 씨를 둘러싼 부분이", f"함께 자라 {o('열매')}가 됩니다."], size=36).move_to([0, -1.55, 0])
        self.say(f"꽃은 씨를 만들고, 씨를 둘러싼 부분이 자라 {o('열매')}가 돼요",
                 "꽃은 씨를 만들고, 씨가 자라면서 씨를 둘러싼 부분이 함께 자라 열매가 돼요.")
        self.play(FadeIn(f), Create(a1), FadeIn(p1), Create(a2), FadeIn(pe), run_time=0.9)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
