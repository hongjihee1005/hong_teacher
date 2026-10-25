"""「과학 원리 돋보기」 4학년 21화 — 생명 과학이 우리 생활에 이용되는 예 (4-1 4단원 다양한 생물과 우리 생활 8차시, 화 코드 4-1-4-e)

바탕: grade4/science/sem1/u4-6.html(원본 _build_tb/src/u4-6.html) — 도입(과학 뉴스 3가지: 플라스틱을 분해하는 세균, 사람에게 피해가 없는
생물 농약, 바다에 흘러나온 기름을 없애는 미생물; 생명 과학 = 다양한 생물을 연구해 우리 생활의 여러 가지 문제를 해결하는 데 도움을 주는
과학 분야), 조사 예 7가지(균류: 질병을 치료하는 약·생물 농약 / 원생생물: 건강식품·생물 연료 / 세균: 하수 처리장 정화·많은 양의 약품·
플라스틱 제품), 생명 과학 마을 4곳(약·생물 연료·하수 처리장·생물 농약), 한눈에 쏙 '다양한 생물을 연구하는 생명 과학은 우리 생활의 여러
가지 문제를 해결하는 데 도움을 줍니다', 생명 존중(이용되는 생물도 생명을 가진 존재, 새 특징을 발견하면 여러 영향도 생각), 형성 평가 서술형(해충 → 균류 생물 농약).
최종: ./make_final.sh s4ep21
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circumscribe)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


FUN, PRO, BAC = "#8B5A2B", ORANGE, K.BAC_P


def ex_card(pic, text, col, w=4.2, h=1.5, size=26):
    box = K.R(w, h, PAPER, rad=0.16, stroke=col, sw=5)
    K.fit(pic, 1.05, 1.1).move_to(box.get_left() + RIGHT * 0.7)
    t = M(text, size)
    if t.width > w - 1.5:
        t.scale_to_fit_width(w - 1.5)
    t.move_to(box.get_center() + RIGHT * 0.55)
    return VGroup(box, pic, t)


def pesticide():
    return VGroup(K.sprayer(), K.bug(0.7).move_to([1.3, -0.3, 0]))


def health_food():
    g_ = VGroup(K.R(0.9, 1.1, "#5DBB4C", 0, -0.1, rad=0.15, stroke="#2E7A2A", sw=4), K.R(1.0, 0.25, PAPER, 0, 0.55, rad=0.05, sw=3))
    for x in (-0.2, 0.2):
        g_.add(K.E(0.3, 0.16, "#F2B705", x, -0.15, stroke="#9A7400", sw=2))
    return g_


def flask():
    g_ = VGroup(K.P([(-0.2, 0.7), (0.2, 0.7), (0.2, 0.2), (0.6, -0.6), (-0.6, -0.6), (-0.2, 0.2)], "#E9F6FC", stroke="#5AA9D6"),
                K.P([(-0.42, -0.35), (0.42, -0.35), (0.6, -0.6), (-0.6, -0.6)], "#B58AD8", stroke=None, sw=0))
    for (x, y) in [(-0.2, -0.48), (0.1, -0.5), (0.3, -0.45)]:
        g_.add(K.bac_dot(0.05, K.BAC_P).move_to([x, y, 0]))
    return g_


class S4Ep21(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 21
    EP_TITLE = "생명 과학이 우리 생활에 이용되는 예"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.examples()
        self.village()
        self.respect()
        self.summary()
        self.closing(f"다양한 생물을 연구하는 {o('생명 과학')}은\n우리 생활의 여러 가지 {g('문제를 해결하는 데 도움')}을 줘요",
                     next_preview="4학년 마인드맵 4 · 다양한 생물과 우리 생활")
        self.wait(0.5)

    # ── 궁금해요: 과학 뉴스 ──
    def intro(self):
        self.section("궁금해요")
        tv = K.news_tv(6.2, 3.6).move_to([-2.8, 0.6, 0])
        news = ["플라스틱을 분해하는 세균", "사람에게 피해가 없는 생물 농약", "바다에 흘러나온 기름을 없애는 미생물"]
        self.say("생명 과학과 관련된 뉴스를 본 적이 있나요?", "생명 과학과 관련된 뉴스를 본 적이 있나요?")
        self.play(FadeIn(tv), run_time=0.6)
        heads = VGroup(*[T(n, 30).move_to(tv.get_center() + DOWN * 0.15) for n in news])
        for h in heads:
            if h.width > 5.6:
                h.scale_to_fit_width(5.6)
        pics = [K.fit(K.plastic_bottle(), 1.2, 1.6), K.fit(pesticide(), 1.9, 1.4), K.fit(VGroup(K.R(2.6, 1.3, "#7FC6E8", rad=0.15, stroke="#2F6F95", sw=4), K.E(1.3, 0.45, "#2A2A2A", 0.2, 0.05, stroke=None, sw=0, op=0.85), K.E(0.5, 0.2, "#2A2A2A", -0.7, -0.3, stroke=None, sw=0, op=0.85)), 2.2, 1.2)]
        for p in pics:
            p.move_to([3.9, 0.6, 0])
        self.say("과학자들은 생물을 이용해 여러 문제를 해결하려고 연구해요",
                 "플라스틱을 분해하는 세균, 사람에게 피해가 없는 생물 농약, 바다에 흘러나온 기름을 없애는 미생물 이야기예요.")
        cur = None
        for h, p in zip(heads, pics):
            if cur is None:
                self.play(FadeIn(h), FadeIn(p), run_time=0.5)
            else:
                self.play(FadeOut(cur[0]), FadeOut(cur[1]), FadeIn(h), FadeIn(p), run_time=0.5)
            cur = (h, p)
            self.wait(1.6)
        self.play(FadeOut(cur[0]), FadeOut(cur[1]), run_time=0.3)
        self.pause_screen(5, "생명 과학은 어떤 과학일까요?")
        df = K.text_card([f"{o('생명 과학')}: 다양한 생물을 연구해",
                          f"우리 생활의 여러 가지 {g('문제를 해결')}하는 데",
                          "도움을 주는 과학 분야"], w=8.4, size=34).move_to([2.2, 0.6, 0])
        self.play(tv.animate.scale(0.55).move_to([-5.0, 0.6, 0]), run_time=0.5)
        self.play(FadeIn(df), run_time=0.6)
        self.say(f"생명 과학은 생물을 연구해 {g('문제를 해결')}하는 데 도움을 줘요",
                 "생명 과학은 다양한 생물을 연구해 우리 생활의 여러 가지 문제를 해결하는 데 도움을 주는 과학 분야예요.")
        self.settle()
        clear_stage(self)

    # ── 조사해요 ──
    def examples(self):
        self.section("조사해요")
        cols = [("균류", FUN, [(K.pill_bottle(), f"세균이 자라지 못하게 하는 균류 → {o('질병을 치료하는 약')}"),
                              (pesticide(), f"곤충의 몸에 자라 곤충을 죽게 하는 균류 → {o('생물 농약')}")]),
                ("원생생물", PRO, [(health_food(), f"건강에 좋은 성분이 있는 원생생물 → {o('건강식품')}"),
                                 (K.fuel_can(), f"몸에 기름 성분이 있는 원생생물 → {o('생물 연료')}")]),
                ("세균", BAC, [(K.sewage(), f"오염 물질을 분해하는 세균 → {o('하수 처리장에서 물 정화')}"),
                              (flask(), f"빠르게 번식하는 세균 → {o('짧은 시간에 많은 양의 약품')}"),
                              (K.plastic_bottle(), f"몸에 플라스틱 원료가 있는 세균 → {o('플라스틱 제품')}")])]
        narr = ["균류를 이용한 예예요. 세균이 자라지 못하게 하는 균류로 질병을 치료하는 약을 만들고, 곤충의 몸에 자라 곤충을 죽게 하는 균류로 생물 농약을 만들어요.",
                "원생생물을 이용한 예예요. 건강에 좋은 성분이 있는 원생생물로 건강식품을, 몸에 기름 성분이 있는 원생생물로 생물 연료를 만들어요.",
                "세균을 이용한 예예요. 오염 물질을 분해하는 세균으로 하수 처리장에서 물을 정화하고, 빠르게 번식하는 세균으로 짧은 시간에 많은 약품을 만들어요. 몸에 플라스틱 원료가 있는 세균으로 플라스틱 제품도 만들어요."]
        subs = [f"{o('균류')}: 질병을 치료하는 약, 생물 농약",
                f"{o('원생생물')}: 건강식품, 생물 연료",
                f"{o('세균')}: 물 정화, 많은 양의 약품, 플라스틱 제품"]
        for i, (nm, col, exs) in enumerate(cols):
            head = T(nm + "을 이용해요" if nm != "균류" else nm + "를 이용해요", 44, col).move_to([0, 2.45, 0])
            cards = VGroup(*[ex_card(p, t, col, w=12.6, h=1.3, size=32) for p, t in exs]).arrange(DOWN, buff=0.25)
            cards.next_to(head, DOWN, buff=0.35)
            self.say(subs[i], narr[i])
            self.play(FadeIn(head), FadeIn(cards, lag_ratio=0.3), run_time=1.0)
            self.settle()
            self.play(FadeOut(head), FadeOut(cards), run_time=0.4)
        clear_stage(self)

    # ── 생명 과학 마을 ──
    def village(self):
        self.section("생명 과학 마을")
        places = [(K.pill_bottle(), "약을 만들어요", "곰팡이(균류)", FUN),
                  (K.fuel_can(), "생물 연료", "바닷속 원생생물", PRO),
                  (K.sewage(), "하수 처리장", "세균", BAC),
                  (pesticide(), "생물 농약", "균류", FUN)]
        cards = VGroup()
        for p, t, who, col in places:
            box = K.R(3.0, 2.6, PAPER, rad=0.16, stroke=SOFT, sw=4)
            K.fit(p, 2.2, 1.4).move_to(box.get_center() + UP * 0.35)
            lab = T(t, 30).move_to(box.get_center() + DOWN * 0.8)
            cards.add(VGroup(box, p, lab))
        cards.arrange(RIGHT, buff=0.3).move_to([0, 1.0, 0])
        self.say("생명 과학 마을의 네 곳은 어떤 생물을 이용했을까요?",
                 "생명 과학 마을이에요. 네 곳에서는 각각 어떤 생물을 이용했을까요?")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=1.2)
        self.pause_screen(6, "어떤 생물을 이용했을까요?")
        tags = VGroup(*[T(w, 30, c).next_to(cd, DOWN, buff=0.25) for cd, (p, t, w, c) in zip(cards, places)])
        self.say(f"약·농약은 {o('균류')}, 연료는 {o('원생생물')}, 물 정화는 {o('세균')}",
                 "곰팡이를 이용해 약을 만들고, 바닷속 원생생물로 생물 연료를 만들어요. 하수 처리장에서는 세균으로 오염된 물을 정화하고, 균류로 만든 생물 농약을 뿌려요.")
        self.play(FadeIn(tags, lag_ratio=0.2), *[cd[0].animate.set_stroke(c, 6) for cd, (p, t, w, c) in zip(cards, places)], run_time=1.0)
        self.settle()
        clear_stage(self)
        # 해충 문제
        field = VGroup(K.R(4.2, 0.6, "#C79A62", 0, -0.6, rad=0.05, stroke=None, sw=0),
                       *[K.L((x, -0.3), (x, 0.4), "#3F8F46", 6) for x in np.linspace(-1.8, 1.8, 10)],
                       *[K.bug(0.45).move_to([x, y, 0]) for x, y in ((-1.2, 0.5), (0.3, 0.7), (1.3, 0.45))])
        field.move_to([-3.4, 0.6, 0])
        q = T("해충이 농작물을 갉아 먹어요!", 36).move_to([2.8, 1.6, 0])
        self.say("해충이 농작물을 갉아 먹을 때 생명 과학으로 어떻게 해결할까요?",
                 "해충이 농작물을 갉아 먹어요. 생명 과학을 이용해 어떻게 해결할 수 있을까요?")
        self.play(FadeIn(field), FadeIn(q), run_time=0.7)
        self.pause_screen(5, "어떻게 해결할 수 있을까요?")
        ans = K.text_card([f"곤충의 몸에 자라 곤충을 죽게 하는",
                           f"{o('균류')}를 이용해 {g('생물 농약')}을 만들어요"], size=32).move_to([2.8, 0.2, 0])
        self.say(f"곤충을 죽게 하는 {o('균류')}로 {g('생물 농약')}을 만들어요",
                 "곤충의 몸에 자라 곤충을 죽게 하는 균류를 이용해 생물 농약을 만들 수 있어요.")
        self.play(FadeIn(ans), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생명 존중 ──
    def respect(self):
        self.section("생각이 쑥")
        lines = [f"생활 속의 여러 문제를 해결하는 데 {g('도움')}을 줘요",
                 f"건강에 좋은 균류·원생생물로 {o('건강식품·영양제')}를 만들 수 있어요"]
        card = K.text_card(lines, w=12.6, size=36).move_to([0, 1.4, 0])
        self.say("생명 과학을 이용하면 어떤 점이 좋을까요?",
                 "생명 과학을 이용하면 생활 속의 여러 문제를 해결하는 데 도움을 줘요. 건강에 좋은 성분이 있는 균류나 원생생물로 건강식품이나 영양제를 만들 수도 있어요.")
        self.play(FadeIn(card), run_time=0.7)
        card2 = K.text_card([f"이용되는 생물도 {r('생명을 가진 존재')}예요. 소중하게 다뤄요.",
                             "새로운 특징을 발견하면 여러 가지 영향도 생각해요."], w=12.6, size=36,
                            stroke=GREEN).move_to([0, -0.85, 0])
        self.say(f"생명 과학에 이용되는 생물도 {g('소중하게')} 다뤄요",
                 "생명 과학에서 이용되는 생물도 생명을 가진 존재이므로 소중하게 다뤄야 해요. 새로운 생물의 특징을 발견했을 때는 우리 생활에 주는 여러 가지 영향도 생각해 봐야 해요.")
        self.play(FadeIn(card2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"다양한 생물을 연구하는 {o('생명 과학')}은",
                            f"우리 생활의 여러 가지 {g('문제를 해결')}하는 데",
                            "도움을 줍니다."], w=12.6, size=44).move_to([0, 0.6, 0])
        self.say(f"생명 과학은 우리 생활의 여러 가지 {g('문제를 해결')}하는 데 도움을 줘요",
                 "다양한 생물을 연구하는 생명 과학은 우리 생활의 여러 가지 문제를 해결하는 데 도움을 줘요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
