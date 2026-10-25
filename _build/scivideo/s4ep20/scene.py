"""「과학 원리 돋보기」 4학년 20화 — 다양한 생물이 우리 생활에 주는 영향 (4-1 4단원 다양한 생물과 우리 생활 6차시, 화 코드 4-1-4-d)

바탕: grade4/science/sem1/u4-4.html(원본 _build_tb/src/u4-4.html) — 도입(곰팡이로 만든 치즈: 건강에 좋고 맛있는 음식, 곰팡이가 늘 해로운
것만은 아님, 다양한 생물은 생태계를 형성하고 유지하는 데 중요한 역할), 자료 카드 14장(균류: 치즈·간장·된장, 약재·음식 재료, 죽은 생물 분해 /
음식·물건을 상하게 함, 독버섯, 식물의 병 · 원생생물: 김·미역·다시마, 산소, 먹이 / 적조 · 세균: 김치·요구르트, 죽은 생물 분해 / 질병, 충치),
교과서 그림 5장면(김치 익히기·죽은 나무 분해·적조·충치·빵이 상함), 생각 바로잡기 3문항, 한눈에 쏙 '이로운 영향과 해로운 영향을 모두 줍니다'.
최종: ./make_final.sh s4ep20
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
import kit_s3u24 as K3


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def fx_card(pic, text, col, w=5.6, h=1.15, size=28):
    box = K.R(w, h, PAPER, rad=0.16, stroke=col, sw=5)
    K.fit(pic, 1.0, 0.95).move_to(box.get_left() + RIGHT * 0.65)
    t = M(text, size)
    if t.width > w - 1.45:
        t.scale_to_fit_width(w - 1.45)
    t.move_to(box.get_center() + RIGHT * 0.5)
    return VGroup(box, pic, t)


def poison():
    m = K.mushroom(1.0, cap=RED, edge="#8A1F19", spots=False)
    for (x, y) in [(-0.35, 0.33), (0.15, 0.45), (0.5, 0.22)]:
        m.add(K.C(0.08, "#FFFFFF", x, y, stroke=None, sw=0))
    return m


ORG = [
    ("균류", "#8B5A2B",
     [(lambda: VGroup(K.cheese(), K.jar("된장").scale(0.7).shift(RIGHT * 1.3)), "치즈·간장·된장을 만들어요"),
      (lambda: K.mushroom(), "버섯을 약재·음식 재료로 써요"),
      (lambda: K.log_mush(), "죽은 생물을 분해해요")],
     [(lambda: K.bread(1.0), "음식이나 물건을 상하게 해요"),
      (poison, "독버섯을 먹으면 병에 걸려요"),
      (lambda: K.moldy_leaf(1.4, "#7CC766", "#2F6B2A"), "식물에 병을 일으키기도 해요")]),
    ("원생생물", ORANGE,
     [(lambda: VGroup(K.laver(), K.seaweed(1.4).shift(RIGHT * 1.3)), "김·미역·다시마는 식품이에요"),
      (lambda: K.o2_bubble(), "산소를 만들어요"),
      (lambda: K.fish(), "다른 생물의 먹이가 돼요")],
     [(lambda: K.red_sea(), "적조 현상을 일으켜요")]),
    ("세균", K.BAC_P,
     [(lambda: VGroup(K.kimchi(), K.yogurt().shift(RIGHT * 1.5)), "김치·요구르트를 만들어요"),
      (lambda: K.log_mush(), "죽은 생물을 분해해요")],
     [(lambda: K3.face("sick", 0.8), "다른 생물에게 질병을 일으켜요"),
      (lambda: K.tooth(), "입안에서 충치를 일으켜요")]),
]

NARR = {
    "균류": ("균류는 곰팡이를 이용해 치즈, 간장, 된장을 만들고, 버섯을 약재나 음식 재료로 써요. 죽은 생물을 분해하기도 해요.",
             "하지만 음식이나 물건을 상하게 하고, 독버섯을 먹으면 질병에 걸릴 수 있어요. 식물에 병을 일으키기도 해요."),
    "원생생물": ("원생생물인 김, 미역, 다시마는 식품으로 이용돼요. 원생생물은 산소를 만들고, 다른 생물의 먹이가 돼요.",
              "하지만 오염 물질이 많아지면 수가 빠르게 늘어나 적조 현상을 일으켜요."),
    "세균": ("세균은 김치와 요구르트를 만드는 데 이용되고, 죽은 생물을 분해해요.",
           "하지만 다른 생물에게 질병을 일으키기도 하고, 입안에서 충치를 일으키기도 해요."),
}


class S4Ep20(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 20
    EP_TITLE = "다양한 생물이 우리 생활에 주는 영향"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.research()
        self.scenes()
        self.correct()
        self.summary()
        self.closing(f"균류·원생생물·세균은 우리 생활에\n{g('이로운 영향')}과 {r('해로운 영향')}을 모두 줘요",
                     next_preview="4학년 21화 · 생명 과학이 우리 생활에 이용되는 예")
        self.wait(0.5)

    # ── 궁금해요: 치즈 ──
    def intro(self):
        self.section("궁금해요")
        ch = K.fit(K.cheese(), 3.2, 2.0).move_to([-3.0, 0.5, 0])
        lab = T("곰팡이를 이용해 만든 치즈", 34).next_to(ch, DOWN, buff=0.35)
        self.say("곰팡이를 이용해 만든 치즈를 먹으면 어떻게 될까요?",
                 "곰팡이를 이용해 만든 치즈가 있어요. 이 치즈를 먹으면 어떻게 될까요?")
        self.play(FadeIn(ch), FadeIn(lab), run_time=0.7)
        self.pause_screen(5, "곰팡이 치즈를 먹으면?")
        ok = M(f"건강에 좋고\n{g('맛있는 음식')}이에요", 44).move_to([3.3, 0.6, 0])
        self.say(f"이 치즈는 건강에 좋고 {g('맛있는 음식')}이에요",
                 "이 치즈는 건강에 좋고 맛있는 음식이에요. 곰팡이가 늘 해로운 것만은 아니에요.")
        self.play(FadeIn(ok, shift=UP * 0.2), run_time=0.6)
        self.say(f"균류·원생생물·세균은 우리 생활에 {o('어떤 영향')}을 줄까요?",
                 "우리 주변에는 균류, 원생생물, 세균 같은 다양한 생물이 살아요. 이 생물들은 우리 생활에 어떤 영향을 줄까요?")
        self.settle()
        clear_stage(self)

    # ── 조사해요 ──
    def research(self):
        self.section("조사해요")
        for name, col, good, bad in ORG:
            head = T(name, 48, col).move_to([0, 2.6, 0])
            gh = T("이로운 영향", 34, GREEN).move_to([-3.2, 1.85, 0])
            bh = T("해로운 영향", 34, RED).move_to([3.2, 1.85, 0])
            gc = VGroup(*[fx_card(f(), t, GREEN) for f, t in good]).arrange(DOWN, buff=0.2).next_to(gh, DOWN, buff=0.25)
            bc = VGroup(*[fx_card(f(), t, RED) for f, t in bad]).arrange(DOWN, buff=0.2).next_to(bh, DOWN, buff=0.25)
            gc.move_to([gh.get_center()[0], gc.get_center()[1], 0])
            bc.move_to([bh.get_center()[0], bc.get_center()[1], 0])
            ga = "가" if name == "균류" else "이"
            self.say(f"{name}{ga} 주는 {g('이로운 영향')}",
                     NARR[name][0])
            self.play(FadeIn(head), FadeIn(gh), FadeIn(bh), run_time=0.5)
            self.play(FadeIn(gc, lag_ratio=0.25), run_time=1.0)
            self.say(f"{name}{ga} 주는 {r('해로운 영향')}",
                     NARR[name][1])
            self.play(FadeIn(bc, lag_ratio=0.25), run_time=1.0)
            self.settle()
            clear_stage(self)

    # ── 교과서 그림 ──
    def scenes(self):
        self.section("이로울까, 해로울까?")
        items = [(K.kimchi(), "김치를 익혀요", "세균", True), (K.log_mush(), "죽은 나무 분해", "균류", True),
                 (K.red_sea(), "적조 현상", "원생생물", False), (K.tooth(), "충치", "세균", False),
                 (K.bread(1.0), "빵이 상했어요", "균류", False)]
        cards = VGroup()
        for pic, t, who, ok in items:
            box = K.R(2.4, 2.4, PAPER, rad=0.16, stroke=SOFT, sw=4)
            K.fit(pic, 1.9, 1.3).move_to(box.get_center() + UP * 0.3)
            lab = T(t, 26).move_to(box.get_center() + DOWN * 0.8)
            if lab.width > 2.2:
                lab.scale_to_fit_width(2.2)
            c = VGroup(box, pic, lab)
            cards.add(c)
        cards.arrange(RIGHT, buff=0.25).move_to([0, 1.1, 0])
        self.say("다섯 장면은 이로운 영향일까요, 해로운 영향일까요?",
                 "그림의 다섯 장면은 이로운 영향일까요, 해로운 영향일까요?")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=1.2)
        self.pause_screen(6, "이로운 영향일까, 해로운 영향일까?")
        tags = VGroup()
        for c, (pic, t, who, ok) in zip(cards, items):
            tg = M(f"{who}\n{g('이로워요') if ok else r('해로워요')}", 28).next_to(c, DOWN, buff=0.25)
            tags.add(tg)
        self.say(f"김치·분해는 {g('이로운 영향')}, 적조·충치·상한 빵은 {r('해로운 영향')}",
                 "세균이 김치를 익히고, 균류가 죽은 나무를 분해하는 것은 이로운 영향이에요. 원생생물의 적조, 세균의 충치, 곰팡이가 빵을 상하게 하는 것은 해로운 영향이에요.")
        self.play(FadeIn(tags, lag_ratio=0.2), *[c[0].animate.set_stroke(GREEN if it[3] else RED, 6) for c, it in zip(cards, items)], run_time=1.2)
        self.settle()
        clear_stage(self)
        # 적조 더 보기
        rs = K.fit(K.red_sea(), 4.6, 2.3).move_to([-3.2, 0.6, 0])
        txt = VGroup(*[T(t, 32) for t in ["강이나 바다에 오염 물질이 많아지면", "일부 원생생물의 수가 빠르게 늘어나요",
                                           "바다가 붉게 보이고", "여러 생물에 피해를 줘요"]]).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        txt.move_to([3.0, 0.6, 0])
        self.say(f"{r('적조')}: 원생생물이 너무 많아져 바다가 붉게 보여요",
                 "적조 현상은 강이나 바다에 오염 물질이 많아지면 일부 원생생물의 수가 빠르게 늘어나 생겨요. 바다가 붉게 보이고 여러 생물에 피해를 줘요.")
        self.play(FadeIn(rs), FadeIn(txt, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def correct(self):
        self.section("생각 바로잡기")
        rows = [("세균은 모두 병을 일으킨다.", False, "장에 사는 세균 중에는 소화를 돕는 세균도 있어요"),
                ("곰팡이는 음식을 만드는 데 이용되기도 한다.", True, "치즈, 간장, 된장을 만들어요"),
                ("원생생물은 우리 생활에 아무 영향을 주지 않는다.", False, "산소를 만들고 먹이가 되지만, 적조도 일으켜요")]
        grp = VGroup()
        for i, (q, ok, why) in enumerate(rows):
            qt = T(q, 34).move_to([0, 2.15 - i * 1.4, 0]).align_to([-6.2, 0, 0], LEFT)
            wt = M(g(why) if ok else r(why), 28).next_to(qt, DOWN, buff=0.18).align_to(qt, LEFT)
            mk = K.ox_mark(ok, 0.3).move_to([6.0, qt.get_center()[1] - 0.2, 0])
            grp.add(VGroup(qt, wt, mk))
        self.say("이런 생각, 맞을까요?", "이런 생각, 맞을까요?")
        self.play(FadeIn(VGroup(*[x[0] for x in grp]), lag_ratio=0.2), run_time=1.0)
        self.pause_screen(5, "맞는 생각은 무엇일까요?")
        self.play(FadeIn(VGroup(*[VGroup(x[1], x[2]) for x in grp]), lag_ratio=0.3), run_time=1.2)
        self.say(f"세균·곰팡이·원생생물은 {g('이로운 영향')}도 줘요",
                 "세균이 모두 병을 일으키는 것은 아니에요. 장에 사는 세균 중에는 소화를 돕는 세균도 있어요. 곰팡이는 음식을 만드는 데 이용되고, 원생생물은 산소를 만들지만 적조를 일으키기도 해요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["다양한 생물은 된장, 김치와 같은 음식을 만드는 데",
                            f"이용되는 등의 {g('이로운')} 영향과",
                            f"다른 생물에게 질병을 일으키는 등의 {r('해로운')} 영향을",
                            "모두 줍니다."], w=12.6, size=40).move_to([0, 0.6, 0])
        self.say(f"다양한 생물은 {g('이로운 영향')}과 {r('해로운 영향')}을 모두 줘요",
                 "다양한 생물은 된장, 김치 같은 음식을 만드는 데 이용되는 등의 이로운 영향과, 다른 생물에게 질병을 일으키는 등의 해로운 영향을 모두 줘요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
