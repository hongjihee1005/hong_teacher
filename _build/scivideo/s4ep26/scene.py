"""「과학 원리 돋보기」 4학년 26화 — 생태계를 보전하려면? (4-2 2단원 생물과 환경 8차시, 화 코드 4-2-2-e)

바탕: grade4/science/sem2/u2-5.html(원본 _build_tb/src2/u2-5.html) — 도입(함부로 버린 마스크 끈이 새의 다리에 감김, 영향 2가지),
카드 뉴스(「과학」 52쪽: 우리나라 연안에서 죽은 바다거북 10마리 중 8마리가 플라스틱 쓰레기를 먹음, 필요한 노력 3가지),
토의 보드(앱 I 목록: 알맞은 의견 5개·알맞지 않은 의견 2개), 바다거북 보호와 생태계 보전의 관련(먹이 관계 유지),
다양한 노력(새 충돌 방지 스티커·물고기 이동 통로·생태계 보호 구역(예: 한려 해상 국립 공원)·생태통로),
우리가 할 수 있는 노력과 국가나 사회가 할 수 있는 노력(앱 sorter 목록), 한눈에 쏙(생태계), 생각이 쑥(우리 지역의 노력).
최종: ./make_final.sh s4ep26
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Rectangle, Line, Arc,
                   Circumscribe, Rotate, PI)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u22 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def chip(text, col, size=27, w=None):
    t = T(text, size)
    bw = w or t.width + 0.36
    if t.width > bw - 0.25:
        t.scale_to_fit_width(bw - 0.25)
    b = K.R(bw, t.height + 0.3, PAPER, rad=0.14, stroke=col, sw=4)
    t.move_to(b)
    return VGroup(b, t)


class S4Ep26(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 26
    EP_TITLE = "생태계를 보전하려면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.turtle()
        self.board()
        self.efforts()
        self.who()
        self.summary()
        self.closing(f"생태계를 보전하려면 {o('우리')}와 {o('국가·사회')}가 함께 노력해야 해요\n일회용품을 줄이는 작은 실천도 {g('생태계 보전')}에 도움이 돼요",
                     next_preview="4학년 마인드맵 5 · 생물과 환경")
        self.wait(0.5)

    # ── 궁금해요: 마스크 ──
    def intro(self):
        self.section("궁금해요")
        bird = K.pic("참새", 2.6, 2.0).move_to([-1.0, 0.7, 0])
        mask = K.mask().scale(1.3).move_to([0.6, -1.0, 0])
        foot = bird.get_bottom() + RIGHT * 0.15
        loop = VGroup(Line(foot + LEFT * 0.25, mask.get_left() + UP * 0.1, stroke_color="#7A8A9A", stroke_width=4),
                      Arc(radius=0.18, angle=2 * PI, stroke_color="#7A8A9A", stroke_width=5).move_to(foot + UP * 0.12))
        self.say("새가 힘들어하고 있어요. 까닭은 무엇일까요?", "새가 힘들어하고 있어요. 그 까닭은 무엇일까요?")
        self.play(FadeIn(bird), FadeIn(mask), Create(loop), run_time=0.8)
        self.play(bird.animate.shift(UP * 0.15), rate_func=lambda t: np.sin(t * 4 * np.pi) ** 2, run_time=1.0)
        self.pause_screen(5, "새가 힘들어하는 까닭은?")
        self.say(f"사람들이 함부로 버린 {r('마스크 끈')}이 다리에 감겼어요",
                 "사람들이 함부로 버린 마스크의 끈이 새의 다리에 감겨서 힘들어하고 있어요.")
        self.play(Circumscribe(VGroup(loop, mask), color=RED), run_time=1.0)
        e = VGroup(chip("끈이 다리에 감겨 자유롭게 날지 못해요", RED, 28),
                   chip("먹이인 줄 알고 먹어 건강을 해칠 수 있어요", RED, 28)).arrange(DOWN, buff=0.3).move_to([3.4, 1.6, 0])
        self.say("마스크를 함부로 버리면 생물이 피해를 입어요",
                 "마스크를 함부로 버리면 새가 자유롭게 날지 못하거나, 동물이 먹이인 줄 알고 먹어 건강을 해칠 수 있어요.")
        self.play(VGroup(bird, mask, loop).animate.shift(LEFT * 2.4), FadeIn(e, lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 카드 뉴스: 바다거북 ──
    def turtle(self):
        self.section("카드 뉴스")
        card = K.R(12.6, 4.9, "#0F3B5C", 0, 0.4, rad=0.3, stroke=None, sw=0)
        head = T("우리나라 바다거북, 플라스틱 먹고 죽어 간다.", 42, PAPER).move_to([0, 2.3, 0])
        turtles = VGroup(*[K.pic("바다거북", 0.95, 0.65) for _ in range(10)]).arrange(RIGHT, buff=0.22).move_to([0, 0.75, 0])
        txt = M(f'<span foreground="#FFFFFF">우리나라 연안에서 죽은 바다거북 10마리 중 </span><span foreground="#FFC93C">8마리</span>'
                f'<span foreground="#FFFFFF">가</span>', 34).move_to([0, -0.4, 0])
        txt2 = T("플라스틱 쓰레기를 먹은 것으로 나타났어요.", 34, PAPER).move_to([0, -1.05, 0])
        src = T("「과학」 52쪽 카드 뉴스의 내용", 24, SOFT).move_to([0, -2.25, 0])
        self.say("카드 뉴스를 보고 바다거북을 지킬 방법을 생각해요",
                 "카드 뉴스를 보고 바다거북을 보호하기 위해 어떤 노력이 필요한지 알아봐요.")
        self.play(FadeIn(card), FadeIn(head), FadeIn(turtles, lag_ratio=0.08), FadeIn(src), run_time=1.2)
        rings = VGroup(*[Arc(radius=0.48, angle=2 * PI, stroke_color="#FFC93C", stroke_width=6).move_to(t) for t in turtles[:8]])
        self.say(f"죽은 바다거북 10마리 중 {r('8마리')}가 플라스틱 쓰레기를 먹었어요",
                 "우리나라 연안에서 죽은 바다거북 10마리 중 8마리가 플라스틱 쓰레기를 먹은 것으로 나타났어요.")
        self.play(FadeIn(txt), FadeIn(txt2), Create(rings, lag_ratio=0.1), run_time=1.4)
        self.settle()
        self.play(FadeOut(VGroup(card, head, turtles, txt, txt2, rings, src)), run_time=0.5)
        need = VGroup(chip("플라스틱 제품의 사용을 줄여요", GREEN, 32, 11.0),
                      chip("쓰레기를 함부로 버리지 않고, 버려진 쓰레기를 거두어요", GREEN, 32, 11.0),
                      chip("강 하구에 쓰레기가 바다로 나가는 것을 막는 시설을 만들어요", GREEN, 32, 11.0)).arrange(DOWN, buff=0.35)
        need.move_to([0.8, 0.5, 0])
        tt = K.pic("바다거북", 1.6, 1.1).move_to([-5.6, 0.5, 0])
        self.say("바다거북을 보호하려면 어떤 노력이 필요할까요?", "바다거북을 보호하기 위해 필요한 노력은 무엇일까요?")
        self.play(FadeIn(tt), run_time=0.4)
        self.pause_screen(5, "바다거북을 보호하려면?")
        self.say(f"플라스틱을 줄이고, 쓰레기를 거두고, {o('막는 시설')}을 만들어요",
                 "플라스틱 제품의 사용을 줄이고, 쓰레기를 함부로 버리지 않고 거두며, 쓰레기가 바다로 나가는 것을 막는 시설을 만들어야 해요.")
        self.play(FadeIn(need, lag_ratio=0.3), run_time=1.2)
        self.say(f"바다거북을 지키면 먹이 관계가 유지되어 {g('생태계 보전')}에 도움이 돼요",
                 "바다거북을 보호하면 먹이 관계가 유지되어 생태계가 안정적으로 유지돼요.")
        self.settle()
        clear_stage(self)

    # ── 토의 보드 ──
    def board(self):
        self.section("토의해요")
        I = [("다회용 물병을 사용해요", True), ("비닐봉지의 사용을 줄여요", True), ("일회용 빨대의 사용을 줄여요", True),
             ("물휴지 대신 손수건을 사용해요", True), ("쓰레기를 버릴 때 분리배출을 철저하게 해요", True),
             ("종이컵을 마음껏 써요", False), ("바닷가에서 쓴 쓰레기는 모래에 묻어요", False)]
        rows = VGroup(*[chip(t, SOFT, 28, 6.2) for t, _ in I]).arrange_in_grid(cols=2, buff=(0.4, 0.3), flow_order="dr").move_to([0, 0.5, 0])
        self.say("바다거북을 살리기 위해 우리가 할 수 있는 일은?",
                 "바다거북을 살리기 위해 우리가 할 수 있는 일을 골라 봐요.")
        self.play(FadeIn(rows, lag_ratio=0.1), run_time=1.2)
        self.pause_screen(5, "알맞은 의견은?")
        self.say(f"일회용품과 쓰레기를 줄이는 {g('작은 실천')}이 바다거북을 살려요",
                 "쓰레기와 일회용품을 줄이는 작은 실천이 바다거북을 살려요.")
        self.play(*[row[0].animate.set_stroke(GREEN, 6) for row, (_, ok) in zip(rows, I) if ok], run_time=0.8)
        self.say(f"종이컵을 마음껏 쓰거나 쓰레기를 모래에 묻으면 {r('안 돼요')}",
                 "종이컵 같은 일회용품을 많이 쓰면 쓰레기가 늘어나요. 쓰레기를 모래에 묻으면 바다와 해변이 오염돼요.")
        self.play(*[row[0].animate.set_stroke(RED, 6) for row, (_, ok) in zip(rows, I) if not ok], run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 다양한 노력 ──
    def efforts(self):
        self.section("생태계 보전 노력")
        # ① 새 충돌 방지 스티커
        wall0 = K.wall(False).move_to([1.5, 0.5, 0])
        bird = K.pic("참새", 1.0, 0.75).move_to([-4.5, 1.2, 0])
        cap = T("투명한 방음벽", 30).next_to(wall0, DOWN, buff=0.25)
        self.say("투명한 방음벽은 새가 보지 못하고 부딪히기 쉬워요",
                 "투명한 방음벽은 새가 알아보지 못해 부딪히기 쉬워요.")
        self.play(FadeIn(wall0), FadeIn(bird), FadeIn(cap), run_time=0.6)
        self.play(bird.animate.move_to([1.0, 1.0, 0]), run_time=1.0)
        bang = T("쿵!", 44, RED).move_to([0.3, 2.1, 0])
        self.play(FadeIn(bang, scale=1.4), bird.animate.rotate(-0.6).shift(DOWN * 0.8 + LEFT * 0.3), run_time=0.5)
        wall1 = K.wall(True).move_to(wall0)
        bird2 = K.pic("참새", 1.0, 0.75).move_to([-4.5, 1.2, 0])
        self.say(f"방음벽에 {o('스티커')}를 붙이면 새가 장애물로 알아보고 피해 가요",
                 "방음벽에 스티커를 붙이면 새가 무늬를 장애물로 알아보고 피해 가요. 새의 충돌을 막을 수 있어요.")
        self.play(FadeOut(bang), FadeOut(bird), FadeOut(wall0), FadeIn(wall1), FadeIn(bird2), run_time=0.6)
        self.play(bird2.animate.move_to([-0.2, 2.2, 0]), run_time=0.8)
        self.play(bird2.animate.move_to([3.0, 2.6, 0]), run_time=0.8)
        self.settle()
        clear_stage(self)
        # ② ③ ④ 한 화면에
        road = K.road(6.0, -1.0).move_to([-3.4, -0.75, 0])
        bridge = K.eco_bridge(3.6).move_to([-3.4, 0.35, 0])
        deer = K.pic("고라니", 1.0, 1.0).move_to([-5.2, 1.25, 0])
        p1 = VGroup(road, bridge)
        c1 = T("생태통로", 34, GREEN).move_to([-3.4, 2.5, 0])
        ladder = K.fish_ladder(3.6).move_to([3.4, 0.2, 0])
        fish = K.pic("붕어", 0.7, 0.35).move_to([1.8, -0.6, 0])
        c2 = T("물고기 이동 통로", 34, GREEN).move_to([3.4, 2.5, 0])
        self.say(f"도로 위나 아래에 동물이 다니는 {g('생태통로')}를 만들어요",
                 "동물이 안전하게 이동할 수 있도록 도로 위나 아래에 생태통로를 만들어요.")
        self.play(FadeIn(p1), FadeIn(deer), FadeIn(c1), run_time=0.7)
        self.play(deer.animate.move_to([-3.4, 1.0, 0]), run_time=0.8)
        self.play(deer.animate.move_to([-1.5, 1.25, 0]), run_time=0.8)
        self.say(f"둑에 {g('물고기 이동 통로')}를 만들어 물고기를 보호해요",
                 "물고기가 이동하기 어려운 둑 같은 장애물에는 물고기가 올라갈 수 있는 통로를 만들어요.")
        self.play(FadeIn(ladder), FadeIn(fish), FadeIn(c2), run_time=0.7)
        for k in range(4):
            self.play(fish.animate.move_to([2.2 + k * 0.72, -0.35 + k * 0.32, 0]), run_time=0.35)
        self.settle()
        self.play(FadeOut(VGroup(p1, deer, c1, ladder, fish, c2)), run_time=0.4)
        isl = K.island(4.2).move_to([0, 0.5, 0])
        flag = VGroup(Line([0, 0, 0], [0, 1.0, 0], stroke_color=INK, stroke_width=5),
                      K.poly([(0, 1.0), (0.6, 0.82), (0, 0.64)], RED, sw=2)).move_to([1.2, 1.5, 0])
        c3 = T("생태계 보호 구역 (예: 한려 해상 국립 공원)", 32, GREEN).move_to([0, -1.2, 0])
        self.say(f"{g('생태계 보호 구역')}을 정해 생물의 서식지를 지켜요",
                 "생태계 보호 구역을 지정하여 생물의 서식지를 보호해요. 한려 해상 국립 공원이 그 예예요.")
        self.play(FadeIn(isl), Create(flag), FadeIn(c3), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 누가 할 수 있을까 ──
    def who(self):
        self.section("누가 노력할까요")
        bl = K.bin_box("우리가 할 수 있는 노력", 6.4, 4.9, ORANGE, 34).move_to([-3.35, 0.12, 0])
        br = K.bin_box("국가나 사회가 할 수 있는 노력", 6.4, 4.9, BLUE, 34).move_to([3.35, 0.12, 0])
        me = ["물을 아껴 쓰고 에너지를 절약해요", "야생 동물 보호를 위한 캠페인을 해요", "음식을 남기지 않고 쓰레기를 함부로 버리지 않아요",
              "가까운 거리는 걷거나 자전거를 이용해요", "합성 세제 대신 친환경 비누나 세제를 써요"]
        gov = ["동물이 이동할 수 있도록 생태통로를 만들어요", "국가 간에 오염 물질을 줄이자는 협약을 맺어요",
               "생태계 보호 구역이나 국립 공원으로 정해요", "둑에 물고기가 이동할 수 있는 통로를 만들어요"]
        gm = VGroup(*[chip(t, ORANGE, 25, 6.0) for t in me]).arrange(DOWN, buff=0.18).move_to(bl.box.get_center() + DOWN * 0.3)
        gg = VGroup(*[chip(t, BLUE, 25, 6.0) for t in gov]).arrange(DOWN, buff=0.18).move_to(br.box.get_center() + DOWN * 0.3)
        self.say("생태계 보전을 위해 누가 어떤 노력을 할 수 있을까요?",
                 "생태계 보전을 위해 누가 어떤 노력을 할 수 있을까요?")
        self.play(FadeIn(bl), FadeIn(br), run_time=0.6)
        self.say(f"{o('우리')}는 물·에너지 절약, 쓰레기 줄이기 같은 일을 해요",
                 "우리는 물과 에너지를 아끼고, 쓰레기를 함부로 버리지 않는 노력을 할 수 있어요.")
        self.play(FadeIn(gm, lag_ratio=0.15), run_time=1.2)
        self.say(f"{BLUE_(('국가와 사회'))}는 개인이 하기 어려운 큰 노력을 해요",
                 "국가나 사회는 생태통로, 국가 간 협약, 보호 구역처럼 개인이 하기 어려운 큰 노력을 해요.")
        self.play(FadeIn(gg, lag_ratio=0.15), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"일회용품의 사용을 줄이면 {g('생태계')}를", "보전하는 데 도움이 됩니다."], size=46).move_to([0, 1.5, 0])
        loc = VGroup(chip("숲에 나무를 심고, 도로 옆에 가로수를 심어요", GREEN, 28, 11.0),
                     chip("물고기가 알을 낳는 시기에는 물고기를 잡지 못하게 해요", GREEN, 28, 11.0)).arrange(DOWN, buff=0.25).move_to([0, -0.9, 0])
        self.say(f"일회용품을 줄이면 {g('생태계')}를 보전하는 데 도움이 돼요",
                 "일회용품의 사용을 줄이면 생태계를 보전하는 데 도움이 돼요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.say("우리 지역에서도 생태계를 지키는 노력을 해요",
                 "우리 지역에서도 나무를 심고, 물고기가 알을 낳는 시기에는 잡지 못하게 해요.")
        self.play(FadeIn(loc, lag_ratio=0.3), run_time=0.8)
        self.settle()
        clear_stage(self)


def BLUE_(s):
    return f'<span foreground="{BLUE}">{s}</span>'
