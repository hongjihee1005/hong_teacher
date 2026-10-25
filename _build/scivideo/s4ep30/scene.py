"""「과학 원리 돋보기」 4학년 30화 — 생활 속 여러 가지 기체 (4-2 3단원 여러 가지 기체 5~8차시, 화 코드 4-2-3-d)

바탕: grade4/science/sem2/u3-4.html(원본 _build_tb/src2/u3-4.html) — 도입(탄산음료 기포 = 이산화 탄소, 공기 방울이 아님;
공기 = 질소 약 78 %·산소 약 21 %·기타(아르곤 약 0.9 %, 이산화 탄소 약 0.03 % …)), 조사(믿을 만한 내용만 올리고 출처 밝히기,
'질소는 공기 중에 가장 적다'는 틀린 글 걸러 내기), 기체 이용 예(산소: 휴대용 산소통·고압 산소 치료 장치·산소 발생기 /
질소: 과자 봉지·에어백 / 이산화 탄소: 탄산음료·소화기·드라이아이스 / 헬륨: 장식용 풍선·비행선 / 수소: 수소 자동차·드론),
생각 바로잡기 3가지(소화기 까닭, 조건에 따라 고체·액체, 잠수부 공기통), 한눈에 쏙(산소).
u3-5(기체 소개 이모티콘·네 컷 만화)의 '나는 어떤 기체일까요?' 수수께끼를 퀴즈로 씀.
최종: ./make_final.sh s4ep30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Arrow,
                   ValueTracker, always_redraw, rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u23 as K

GC = K.GAS_COL


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def gas_chip(name, size=44):
    t = T(name, size, PAPER)
    box = K.R(t.width + 0.6, t.height + 0.4, GC[name], rad=0.2, sw=0)
    t.move_to(box)
    return VGroup(box, t)


class S4Ep30(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 30
    EP_TITLE = "생활 속 여러 가지 기체"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.research()
        self.uses()
        self.myths()
        self.riddle()
        self.summary()
        self.closing(f"산소·질소·이산화 탄소·헬륨·수소 등 기체는\n{o('성질')}에 따라 우리 생활에 {g('다양하게 이용돼요')}",
                     next_preview="4학년 마인드맵 6 · 여러 가지 기체")
        self.wait(0.5)

    # ── 궁금해요: 탄산음료 기포 ──
    def intro(self):
        self.section("궁금해요")
        gl = K.soda_glass(14).scale(1.6).move_to([-3.2, 0.3, 0])
        self.say("탄산음료를 컵에 따르면 기포가 생겨요", "탄산음료의 뚜껑을 열고 컵에 따르면 기포가 보글보글 생겨요.")
        self.play(FadeIn(gl), run_time=0.6)
        bub = gl[1]
        self.play(*[b.animate.shift(UP * 0.45) for b in bub], run_time=1.0)
        opts = VGroup(*[T(t, 36) for t in ["공기 방울", "이산화 탄소", "수증기", "산소"]]).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to([2.6, 0.5, 0])
        self.say("톡 쏘는 느낌을 내는 이 기포는 어떤 기체일까요?", "톡 쏘는 느낌을 내는 이 기포는 어떤 기체일까요?")
        self.play(FadeIn(opts, lag_ratio=0.2), run_time=0.8)
        self.pause_screen(5, "어떤 기체일까요?")
        self.play(Indicate(opts[1], color=GREEN, scale_factor=1.25), opts[0].animate.set_opacity(0.35),
                  opts[2].animate.set_opacity(0.35), opts[3].animate.set_opacity(0.35), run_time=0.8)
        self.say(f"{o('이산화 탄소')}예요. 공기 방울이 아니에요",
                 "이산화 탄소예요. 공기 방울이라고 생각하는 친구가 많지만, 탄산음료에는 이산화 탄소가 녹아 있어 톡 쏘는 느낌을 내요.")
        self.settle()
        clear_stage(self)
        bar = K.air_bar(11.6, 1.0).move_to([0, 0.8, 0])
        etc = T("기타: 아르곤 약 0.9 %, 이산화 탄소 약 0.03 %, 아주 적은 양의 네온·헬륨·수소 등", 26, SOFT).move_to([0, -0.5, 0])
        self.section("공기 속 기체")
        self.say(f"공기에는 {o('질소')}, {o('산소')}, 이산화 탄소 등이 섞여 있어요",
                 "공기에는 질소가 약 78 퍼센트, 산소가 약 21 퍼센트, 그리고 아르곤, 이산화 탄소 같은 기체가 조금 섞여 있어요.")
        self.play(FadeIn(bar, lag_ratio=0.1), run_time=1.0)
        self.play(FadeIn(etc), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 조사해요 ──
    def research(self):
        self.section("조사해요")
        good = K.text_card([f"{o('과학관 누리집')}", "산소는 다른 물질이 타는 것을 돕는 성질이 있어요."], w=6.3, size=28, stroke=GREEN).move_to([-3.3, 0.7, 0])
        bad = K.text_card([f"{r('어느 누리 소통망 글(출처 없음)')}", "질소는 공기 중에 가장 적게 들어 있는 기체래요!"], w=6.3, size=28, stroke=RED).move_to([3.3, 0.7, 0])
        self.say("스마트 기기로 여러 가지 기체를 조사해요",
                 "스마트 기기로 기체의 종류, 성질, 이용 사례를 조사해요. 믿을 만한 내용인지 살펴요.")
        self.play(FadeIn(good), FadeIn(bad), run_time=0.7)
        self.pause_screen(5, "어느 글을 믿을 수 있을까요?")
        ok = M(g("올려요"), 34).next_to(good, DOWN, buff=0.3)
        no = M(r("걸러 내요"), 34).next_to(bad, DOWN, buff=0.3)
        self.play(FadeIn(ok), FadeIn(no), bad.animate.set_opacity(0.45), run_time=0.6)
        self.say(f"질소는 공기 중에 {o('가장 많아요')}. 틀린 글은 걸러 내요",
                 "공기에는 질소가 가장 많아요. 출처가 없는 글은 확인하고, 조사한 내용의 출처를 밝혀요.")
        self.settle()
        clear_stage(self)

    # ── 여러 가지 기체를 이용한 예 ──
    def uses(self):
        self.section("기체 이용 예")
        rows = [
            ("산소", "숨을 쉬는 데 필요하고, 다른 물질이 타는 것을 도와요",
             [(K.o2_can(), "휴대용 산소통"), (K.chamber(), "고압 산소 치료 장치"), (K.o2_maker(), "산소 발생기")],
             "산소는 숨을 쉬는 데 필요하고, 다른 물질이 타는 것을 도와요. 휴대용 산소통, 고압 산소 치료 장치, 산소 발생기에 이용돼요."),
            ("질소", "식품을 신선하게 보존하고, 에어백을 채워요",
             [(K.snack_bag(0.6), "질소 포장 과자 봉지"), (K.airbag(), "자동차 에어백")],
             "질소는 과자 봉지에 채워 과자를 신선하게 보존하고, 자동차 에어백을 채워 탑승자를 보호해요."),
            ("이산화 탄소", "톡 쏘는 맛, 불을 끄는 소화기",
             [(K.soda_glass(8), "탄산음료"), (K.extinguisher(), "이산화 탄소 소화기"), (K.dry_ice(), "드라이아이스")],
             "이산화 탄소는 탄산음료의 톡 쏘는 맛을 내고, 소화기에 이용돼요. 고체 이산화 탄소인 드라이아이스는 아이스크림을 차갑게 해요."),
            ("헬륨", "공기보다 가벼워 위로 떠요",
             [(K.he_balloons(), "장식용 풍선"), (K.airship(), "비행선")],
             "헬륨은 공기보다 가벼워 위로 뜨는 성질이 있어, 장식용 풍선이나 비행선을 띄우는 데 이용돼요."),
            ("수소", "오염 물질을 내보내지 않는 친환경 연료",
             [(K.h2_car(), "수소 자동차"), (K.drone(), "수소 연료 전지 드론")],
             "수소는 오염 물질을 내보내지 않는 친환경 연료로, 수소 자동차와 수소 연료 전지 드론에 이용돼요."),
        ]
        subs = {"산소": f"{o('산소')}: 숨쉬기, 물질이 타는 것을 도와요",
                "질소": f"{o('질소')}: 과자 봉지, 자동차 에어백",
                "이산화 탄소": f"{o('이산화 탄소')}: 탄산음료, 소화기, 드라이아이스",
                "헬륨": f"{o('헬륨')}: 장식용 풍선, 비행선",
                "수소": f"{o('수소')}: 수소 자동차, 드론"}
        for name, prop, pics, narr in rows:
            chip = gas_chip(name)
            pt = T(prop, 34)
            head = VGroup(chip, pt).arrange(RIGHT, buff=0.4).move_to([0.3, 2.2, 0])
            if head.width > 12.6:
                head.scale_to_fit_width(12.6)
            cards = VGroup(*[K.pic_card(p, n, 3.6, 3.0, size=26, stroke=GC[name]) for p, n in pics]).arrange(RIGHT, buff=0.45).move_to([0, -0.5, 0])
            self.say(subs[name], narr)
            self.play(FadeIn(head), FadeIn(cards, lag_ratio=0.2), run_time=0.9)
            self.settle()
            self.play(FadeOut(head), FadeOut(cards), run_time=0.35)
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def myths(self):
        self.section("생각 바로잡기")
        # 1. 소화기
        box = K.R(3.0, 2.4, K.GLASS, -3.3, -0.6, rad=0.1, stroke=K.GLASS_D, sw=5, op=0.35)
        cd = K.candle(True).scale(1.1).move_to([-3.3, -0.85, 0])
        h = ValueTracker(0.0)
        layer = always_redraw(lambda: K.R(2.86, max(0.02, h.get_value()), "#B38A55", -3.3, -1.78 + h.get_value() / 2, rad=0.02, sw=0, op=0.45))
        q = K.text_card(["이산화 탄소 소화기로", "불을 끌 수 있는 까닭은?"], w=6.6, size=34).move_to([3.0, 1.0, 0])
        self.say("이산화 탄소 소화기로 불을 끌 수 있는 까닭은?", "이산화 탄소 소화기로 불을 끌 수 있는 까닭은 무엇일까요?")
        self.play(FadeIn(box), FadeIn(cd), FadeIn(q), run_time=0.6)
        self.add(layer)
        self.play(h.animate.set_value(1.9), run_time=2.2)
        self.play(FadeOut(cd[2]), run_time=0.4)
        a = K.text_card([f"이산화 탄소가 공기보다 {o('아래로 가라앉아')}", f"불 주변의 {g('공기를 막아 주기')} 때문이에요"], w=6.6, size=30, stroke=GREEN).move_to([3.0, -1.0, 0])
        self.play(FadeIn(a), run_time=0.5)
        self.say(f"공기보다 {o('아래로 가라앉아')} 공기를 막아 주기 때문이에요",
                 "이산화 탄소가 공기보다 아래로 가라앉아 공기를 막아 주기 때문이에요. 이산화 탄소 자체에 불을 끄는 성질이 있는 것은 아니에요.")
        self.settle()
        layer.clear_updaters()
        clear_stage(self)
        # 2. 언제나 기체? / 3. 잠수부
        di = K.pic_card(K.dry_ice(), "드라이아이스 = 고체 이산화 탄소", 5.6, 3.2, size=28).move_to([-3.2, 0.4, 0])
        dv = K.pic_card(K.diver(), "잠수부의 통 = 공기통", 5.6, 3.2, size=28).move_to([3.2, 0.4, 0])
        self.say(f"산소·질소·이산화 탄소도 조건에 따라 {o('고체나 액체')}가 될 수 있어요",
                 "산소, 질소, 이산화 탄소가 언제나 기체인 것은 아니에요. 조건에 따라 고체나 액체가 될 수도 있어요. 드라이아이스는 고체 이산화 탄소예요.")
        self.play(FadeIn(di), run_time=0.6)
        self.settle()
        self.say(f"잠수부의 통에는 산소만이 아니라 {o('공기')}가 들어 있어요",
                 "잠수부가 물속에서 메는 통에는 산소만 들어 있는 것이 아니라, 질소와 산소가 섞인 공기가 들어 있어요.")
        self.play(FadeIn(dv), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 나는 어떤 기체일까요? (u3-5) ──
    def riddle(self):
        self.section("나는 누구일까요?")
        cards = [("나는 과자 봉지를 채워서", "과자가 부서지지 않고 신선하게 지켜 줘.", "질소", "질소예요")]
        for i, (l1, l2, ans, ans_s) in enumerate(cards):
            c = K.text_card([l1, l2], w=10.0, size=38).move_to([0, 1.2, 0])
            self.say("기체 친구의 말을 듣고 누구인지 맞혀 봐요" if i == 0 else "이번 기체 친구는 누구일까요?",
                     f"기체 친구가 말해요. {l1} {l2} 나는 누구일까요?")
            self.play(FadeIn(c), run_time=0.5)
            self.pause_screen(4, "나는 어떤 기체일까요?")
            a = gas_chip(ans, 52).move_to([0, -0.7, 0])
            self.play(FadeIn(a, scale=1.2), run_time=0.5)
            self.say(f"정답은 {o(ans_s)}", f"정답은 {ans_s}.")
            self.settle()
            self.play(FadeOut(c), FadeOut(a), run_time=0.35)
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"우리가 숨을 쉬는 데 반드시 필요하며,",
                            f"다른 물질이 타는 것을 돕는 성질이 있는 기체는 {g('산소')}입니다."], w=12.6, size=42).move_to([0, 0.6, 0])
        self.say(f"숨을 쉬는 데 필요하고 물질이 타는 것을 돕는 기체는 {g('산소')}",
                 "우리가 숨을 쉬는 데 반드시 필요하며, 다른 물질이 타는 것을 돕는 성질이 있는 기체는 산소예요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
