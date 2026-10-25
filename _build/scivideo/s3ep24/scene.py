"""「과학 원리 돋보기」 3학년 24화 — 지구를 둘러싼 기체, 대기 (3-2 2단원 지구의 모습 2차시, 화 코드 3-2-2-a)

바탕: grade3/science/sem2/u2-1.html — 도입(우주에서 본 지구, 푸른 층 = 대기), 비닐봉지·부채 실험 5단계
(휘두르기 → 입구 막기 → 부채질 → 누르며 손바닥 쪽으로 열기: 시원한 바람·종이 띠 → 알게 된 점), 안전(봉지 터짐·부채),
대기 스위치(있을 때 / 없을 때 7가지, '바닷물이 짠 것은 대기와 관계없음'), 숨은 대기 찾기 8곳, 한눈에 쏙, 형성 평가 1.
최종: ./make_final.sh s3ep24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Write, Rotate,
                   LaggedStart, Circumscribe, Dot, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u22 as K
from kit_s3u12 import text_card, ox_mark


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S3Ep24(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 24
    EP_TITLE = "지구를 둘러싼 기체, 대기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.bag()
        self.switch()
        self.hidden()
        self.summary()
        self.closing(f"지구를 둘러싸고 있는 기체를 지구의 {o('대기')}라고 해요\n"
                     f"대기는 {g('눈에 보이지 않지만 우리 주변에 있어요')}",
                     next_preview="3학년 25화 · 지구 표면은 어떤 모습일까?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        e = K.earth(1.9).move_to([0, 0.35, 0])
        self.say("우주에서 본 지구예요", "우주에서 지구를 바라보면 어떤 모습일까요?")
        self.play(FadeIn(e, scale=0.7), run_time=0.9)
        self.say(f"지구를 감싼 얇은 {o('푸른 층')}은 무엇일까요?",
                 "지구의 가장자리를 보면 지구를 얇게 감싸고 있는 푸른색 층이 보여요. 이것은 무엇일까요?")
        self.play(Indicate(e.atmo, color="#3C9BE0", scale_factor=1.06), run_time=1.2)
        self.pause_screen(4, "푸른 층은 무엇일까요?")
        lab = tag("대기", ORANGE, 46).move_to([3.6, 1.9, 0])
        arr = Arrow(lab.get_left() + LEFT * 0.05, e.get_center() + np.array([1.6, 1.25, 0]), buff=0.05,
                    color=ORANGE, stroke_width=6)
        self.say(f"지구를 둘러싸고 있는 기체 = {o('대기')}", "지구를 둘러싸고 있는 기체를 지구의 대기라고 해요.")
        self.play(FadeIn(lab, shift=LEFT * 0.2), Create(arr), run_time=0.7)
        self.say("우리 주변에도 대기가 있을까요?", "그럼 우리 주변에도 대기가 있을까요? 실험으로 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 비닐봉지 실험 ──
    def bag(self):
        self.section("실험해요")
        tools = VGroup(K.plastic_bag(False, 2.2), K.fan(1.0)).arrange(RIGHT, buff=1.4).move_to([0, 0.6, 0])
        warn = T("봉지가 터지거나 부채가 친구에게 부딪히지 않게 조심해요", 32, RED).move_to([0, -1.2, 0])
        self.say("비닐봉지와 부채를 준비해요", "준비물은 비닐봉지와 부채예요. 봉지가 터지거나 부채가 친구에게 부딪히지 않게 조심해요.")
        self.play(FadeIn(tools, lag_ratio=0.3), FadeIn(warn), run_time=0.8)
        self.settle()
        self.play(FadeOut(tools), FadeOut(warn), run_time=0.4)

        step = T("", 40)
        flat = K.plastic_bag(False, 2.6).move_to([-2.8, 0.4, 0])
        full = K.plastic_bag(True, 2.6).move_to([-2.8, 0.4, 0])

        def show_step(txt):
            nonlocal step
            new = T(txt, 40, ORANGE).move_to([0, 2.55, 0])
            self.play(FadeOut(step), FadeIn(new, shift=DOWN * 0.15), run_time=0.4)
            step = new

        # ① 휘두르기
        self.say(f"① 비닐봉지 입구를 벌리고 크게 {o('휘둘러요')}",
                 "첫째, 비닐봉지 입구를 벌리고 크게 휘둘러요. 비닐봉지가 점점 부풀어 올라요.")
        show_step("① 휘두르기")
        self.play(FadeIn(flat), run_time=0.3)
        self.play(flat.animate.shift(RIGHT * 1.5 + UP * 0.4).rotate(0.3), run_time=0.5)
        self.play(flat.animate.shift(RIGHT * 1.5 + DOWN * 0.4).rotate(-0.3), run_time=0.5)
        full.move_to(flat)
        self.play(FadeOut(flat), FadeIn(full), run_time=0.5)
        # ② 입구 막기
        hand = K.E(0.5, 0.75, "#F4C9A0", 0, 0, sw=3).next_to(full, LEFT, buff=-0.25)
        self.say("② 부풀어 오른 봉지의 입구를 손으로 꼭 막아요", "둘째, 부풀어 오른 비닐봉지의 입구를 손으로 꼭 막아요. 봉지가 빵빵해요.")
        show_step("② 입구 막기")
        self.play(FadeIn(hand, shift=RIGHT * 0.2), run_time=0.4)
        bagset = VGroup(full, hand)
        # ③ 부채질
        f = K.fan(1.1).move_to([3.6, 0.7, 0]).rotate(0.5)
        self.say(f"③ 부채질을 하면 봉지가 {o('이리저리 흔들려요')}",
                 "셋째, 부채질을 해요. 비닐봉지가 이리저리 흔들려요. 봉지 안에 무엇인가 들어 있는 것 같아요.")
        show_step("③ 부채질")
        self.play(FadeIn(f), run_time=0.3)
        for k in range(2):
            self.play(Rotate(f, -0.6), bagset.animate.shift(LEFT * 0.25).rotate(0.08), run_time=0.35)
            self.play(Rotate(f, 0.6), bagset.animate.shift(RIGHT * 0.25).rotate(-0.08), run_time=0.35)
        self.play(FadeOut(f), run_time=0.3)
        # ④ 누르기
        self.say("④ 봉지를 누르며 입구를 손바닥 쪽으로 살짝 열어요",
                 "넷째, 비닐봉지를 누르면서 입구를 다른 손바닥 쪽으로 살짝 열어요.")
        show_step("④ 누르며 열기")
        palm = K.E(0.6, 0.95, "#F4C9A0", 0, 0, sw=3).move_to(full.get_left() + LEFT * 1.6)
        strip = Line(palm.get_top() + UP * 0.05, palm.get_top() + UP * 0.05 + DOWN * 0.9, stroke_color=BLUE, stroke_width=10)
        self.play(FadeIn(palm), FadeIn(strip), hand.animate.shift(UP * 0.55 + RIGHT * 0.1), run_time=0.5)
        self.say("손바닥에는 어떤 느낌이 들까요?", "입구 앞에 댄 손바닥에는 어떤 느낌이 들까요?")
        self.pause_screen(4, "손바닥에 어떤 느낌이 들까요?")
        dots = VGroup(*[Dot(full.get_left() + np.array([0.1 - 0.4 * k, 0.15 * ((k % 3) - 1), 0]), radius=0.07, color=BLUE)
                        for k in range(5)])
        flat2 = K.plastic_bag(False, 2.6).move_to(full)
        self.say(f"손바닥에 {o('시원한 바람')}이 느껴지고 종이 띠가 날려요",
                 "봉지 안에서 무엇인가 빠져나오면서 손바닥에 시원한 바람이 느껴지고, 종이 띠가 날려요.")
        self.play(FadeIn(dots, shift=LEFT * 0.6), Rotate(strip, 1.0, about_point=strip.get_start()),
                  Transform_(full, flat2), run_time=1.2)
        # ⑤ 알게 된 점
        show_step("⑤ 알게 된 점")
        self.say(f"봉지 안에는 눈에 보이지 않는 {o('공기')}가 있었어요",
                 "눈에 보이지 않지만 비닐봉지 안에는 공기가 있었어요. 우리 주변을 둘러싼 이 공기가 바로 지구의 대기예요.")
        card = text_card([f"우리 주변을 둘러싼 공기 = 지구의 {o('대기')}"], size=42).move_to([0, -1.45, 0])
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 대기 스위치 ──
    def switch(self):
        self.section("상상 실험")
        e = K.earth(1.25).move_to([0, 0.9, 0])
        atmo = e.atmo
        e.remove(atmo)
        sw = T("대기 없애 보기", 34, RED).move_to([3.6, 0.9, 0])
        self.say(f"상상 실험: 지구에 {o('대기가 없다면')}?", "상상 실험을 해 봐요. 지구에 대기가 없다면 어떤 일이 일어날까요?")
        self.play(FadeIn(atmo), FadeIn(e), run_time=0.5)
        self.pause_screen(5, "대기가 없다면 어떻게 될까요?")
        self.play(FadeIn(sw), run_time=0.3)
        self.play(FadeOut(atmo), FadeOut(sw), e.animate.scale(0.75).move_to([0, 1.55, 0]), run_time=0.8)
        rows = [("숨 쉬기", "생물이 숨을 쉴 수 없어 살 수 없어요"),
                ("구름", "구름이 생기지 않아 비나 눈이 오지 않아요"),
                ("연·열기구", "연이 날지 못하고, 열기구가 뜨지 못해요"),
                ("바람", "풍력 발전기가 멈추고, 돛단배가 움직이지 못해요"),
                ("햇빛", "태양에서 오는 해로운 빛이 그대로 들어와요")]
        grp = VGroup()
        for i, (k, v) in enumerate(rows):
            kk = T(k, 32, ORANGE)
            vv = T(v, 32, INK)
            row = VGroup(kk, vv)
            kk.move_to([-5.0, 0.2 - i * 0.55, 0], aligned_edge=LEFT)
            vv.move_to([-2.9, 0.2 - i * 0.55, 0], aligned_edge=LEFT)
            grp.add(row)
        self.say(f"생물이 숨을 쉴 수 없어 {r('살 수 없어요')}",
                 "대기가 없으면 생물이 숨을 쉴 수 없어 살 수 없어요. 구름이 생기지 않아 비나 눈도 오지 않아요.")
        self.play(FadeIn(grp[0], shift=LEFT * 0.2), run_time=0.4)
        self.play(FadeIn(grp[1], shift=LEFT * 0.2), run_time=0.4)
        self.say("연·열기구·풍력 발전기·돛단배도 움직이지 못해요",
                 "연이 날지 못하고 열기구가 뜨지 못해요. 바람이 없으니 풍력 발전기와 돛단배도 멈춰요.")
        self.play(FadeIn(grp[2], shift=LEFT * 0.2), run_time=0.4)
        self.play(FadeIn(grp[3], shift=LEFT * 0.2), run_time=0.4)
        self.say("태양에서 오는 해로운 빛이 그대로 들어와요",
                 "또 대기는 태양에서 오는 해로운 빛을 막아 주는데, 대기가 없으면 그 빛이 그대로 들어와요.")
        self.play(FadeIn(grp[4], shift=LEFT * 0.2), run_time=0.4)
        self.settle()
        self.play(FadeOut(grp), run_time=0.4)
        q = text_card([f"바닷물이 더 짜질까요?  →  {r('아니요')}", "바닷물이 짠 것은 대기와 관계가 없어요"], size=38).move_to([0, -0.9, 0])
        self.say("그럼 바닷물이 더 짜질까요?", "그럼 대기가 없으면 바닷물이 더 짜질까요? 아니에요. 바닷물이 짠 것은 대기와 관계가 없어요.")
        self.play(FadeIn(q, shift=UP * 0.2), run_time=0.5)
        atmo2 = K.earth(1.25 * 0.75).atmo.move_to(e[0])
        self.play(FadeIn(atmo2), run_time=0.6)
        self.say(f"대기가 있어 생물이 살 수 있어요 — 대기는 {g('소중해요')}",
                 "대기가 있어서 생물이 숨을 쉬고, 살기에 알맞은 온도가 유지돼요. 대기는 정말 소중해요.")
        self.settle()
        clear_stage(self)

    # ── 숨은 대기 찾기 ──
    def hidden(self):
        self.section("숨은 대기 찾기")
        pics = [(K.cloud(1.5), "구름", "구름이 생기고 비나 눈이 와요"),
                (K.hot_balloon(0.85), "열기구", "하늘로 떠올라요"),
                (K.wind_turbine(0.75), "풍력 발전기", "바람이 불어 돌아가요"),
                (K.sailboat(0.75), "돛단배", "돛이 바람을 받아 움직여요"),
                (K.kite(0.75), "연날리기", "바람을 타고 연이 날아요"),
                (K.bike(0.75), "자전거", "바퀴에 공기를 넣어요"),
                (K.ball(0.45), "공놀이", "공에 공기를 넣어요"),
                (K.tree_s(1.3), "동물과 식물", "숨을 쉬고 살 수 있어요")]
        self.say(f"대기가 있어 볼 수 있는 모습을 {o('8곳')} 찾아요",
                 "우리 주변에서 대기가 있기 때문에 볼 수 있는 모습을 찾아봐요. 모두 여덟 곳이에요.")
        cards = VGroup()
        for i, (p, nm, desc) in enumerate(pics):
            K.fit(p, 1.5, 1.05)
            x = -5.1 + (i % 4) * 3.4
            y = 1.95 if i < 4 else -0.3
            p.move_to([x, y, 0])
            t = T(nm, 32, INK).move_to([x, y - 0.85, 0])
            d = T(desc, 24, SOFT).move_to([x, y - 1.25, 0])
            if d.width > 3.2:
                d.scale_to_fit_width(3.2)
            cards.add(VGroup(p, t, d))
        self.play(LaggedStart(*[FadeIn(c[0], scale=0.7) for c in cards], lag_ratio=0.12), run_time=1.6)
        self.pause_screen(4, "대기가 하는 일을 말해 보세요")
        self.say("구름·열기구·풍력 발전기·돛단배", "구름이 생겨 비나 눈이 오고, 열기구가 떠오르고, 바람으로 풍력 발전기와 돛단배가 움직여요.")
        self.play(LaggedStart(*[FadeIn(VGroup(c[1], c[2])) for c in cards[:4]], lag_ratio=0.2), run_time=1.2)
        self.say("연날리기·자전거·공놀이·숨 쉬는 동물과 식물", "연이 바람을 타고 날고, 자전거 바퀴와 공에는 공기를 넣어요. 동물과 식물은 숨을 쉬고 살 수 있어요.")
        self.play(LaggedStart(*[FadeIn(VGroup(c[1], c[2])) for c in cards[4:]], lag_ratio=0.2), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("한눈에 쏙")
        e = K.earth(1.2).move_to([-4.3, 0.4, 0])
        card = text_card([f"지구를 둘러싸고 있는 기체를", f"지구의 {o('대기')}라고 합니다.",
                          f"대기는 {g('눈에 보이지 않지만')}", "우리 주변에 있어요."], size=42).move_to([1.8, 0.4, 0])
        self.say(f"지구를 둘러싸고 있는 기체 = 지구의 {o('대기')}",
                 "정리해요. 지구를 둘러싸고 있는 기체를 지구의 대기라고 해요. 대기는 눈에 보이지 않지만 우리 주변에 있어요.")
        self.play(FadeIn(e), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        self.play(Circumscribe(card, color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)


def Transform_(a, b):
    from manim import Transform
    return Transform(a, b)
