"""「과학 원리 돋보기」 5학년 19화 — 숨을 쉴 때 (5-1 4단원 우리 몸의 구조와 기능 5차시, 화 코드 5-1-4-d)

바탕: grade5/science/sem1/u4-4.html(원본 _build_tb/src/u4-4.html) — 도입(수영할 때 얼굴을 물 위로 내밀어 공기를 들이마심),
호흡·호흡기관 뜻, 호흡기관(코·숨관·숨관가지·폐)과 하는 일, 숨을 들이마실 때 가슴이 부풀어 오르고 내쉴 때 원래 위치로,
호흡기관 모형(종이봉투 2장·주름 빨대 2개 → 불어 넣으면 봉투가 부풂 = 들이마실 때), 공기 경로(들숨·날숨),
생각 바로잡기(산소만 들어오고 이산화 탄소만 나간다 X — 모두 공기), 입으로도 숨(코와 입이 연결), 한눈에 쏙.
최종: ./make_final.sh s5ep19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker, always_redraw,
                   Dot, Arrow, Line, Arc, Circle, Ellipse, Rectangle, LaggedStart, linear, there_and_back, PI)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


AIRB = "#3f84ad"
IN_L = [(160, 66), (160, 92), (160, 148), (138, 160), (130, 186)]
IN_R = [(160, 66), (160, 92), (160, 148), (182, 160), (190, 186)]


class S5Ep19(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 19
    EP_TITLE = "숨을 쉴 때"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.organs()
        self.chest()
        self.model()
        self.route()
        self.myth()
        self.summary()
        self.closing(f"코로 들이마신 공기는 숨관과 숨관가지를 지나 {o('폐')}로 들어가고,\n폐는 {g('산소')}를 받아들이고 이산화 탄소를 내보내요",
                     next_preview="5학년 20화 · 노폐물은 어떻게 나갈까?")
        self.wait(0.5)

    # ── 궁금해요: 수영 ──
    def intro(self):
        self.section("궁금해요")
        water = Rectangle(width=12.0, height=2.6, fill_color="#9ED3EE", fill_opacity=0.85, stroke_width=0).move_to([0, -1.2, 0])
        waves = VGroup(*[Arc(radius=0.35, start_angle=0, angle=PI, stroke_color="#4A9BD0", stroke_width=5).move_to([-5.6 + i * 0.72, 0.18, 0])
                         for i in range(16)])
        kid = K.kid("before", 0.95).move_to([0, 0.35, 0])
        kid_in = kid.copy().shift(DOWN * 1.9)
        cap_sw = VGroup(Ellipse(width=1.7, height=0.9, fill_color="#F2A65A", fill_opacity=1, stroke_width=0)).move_to([0, 1.0, 0])
        self.say("수영할 때 왜 얼굴을 물 위로 내밀까요?", "수영할 때 얼굴을 물 위로 내미는 까닭은 무엇일까요?")
        self.play(FadeIn(kid_in), FadeIn(water), FadeIn(waves), run_time=0.7)
        self.play(kid_in.animate.shift(UP * 1.9), run_time=0.8)
        puff = VGroup(*[Arc(radius=0.15 + 0.12 * j, start_angle=-0.6, angle=1.2, stroke_color=SOFT, stroke_width=5).move_to([0.75 + 0.2 * j, 0.05, 0]) for j in range(3)])
        self.play(FadeIn(puff, lag_ratio=0.3), run_time=0.6)
        self.pause_screen(5, "얼굴을 물 위로 내미는 까닭은?")
        a = K.text_card([f"물속에서는 숨을 쉴 수 없어", f"{o('공기')}를 들이마셔야 해요"], w=6.0, size=36).move_to([3.7, 2.2, 0])
        self.say(f"물속에서는 숨을 쉴 수 없어 {o('공기')}를 들이마셔야 해요",
                 "사람은 물속에서 숨을 쉴 수 없어요. 그래서 얼굴을 물 위로 내밀어 코로 공기를 들이마셔야 해요.")
        self.play(FadeIn(a), run_time=0.6)
        self.settle()
        clear_stage(self)
        d = K.text_card([f"숨을 들이마시고 내쉬는 활동 → {o('호흡')}",
                         f"호흡을 담당하는 기관 → {g('호흡기관')}"], w=10.4, size=40).move_to([0, 0.6, 0])
        self.say(f"숨을 들이마시고 내쉬는 활동이 {o('호흡')}, 담당 기관이 {g('호흡기관')}이에요",
                 "숨을 들이마시고 내쉬는 활동을 호흡이라고 하고, 이를 담당하는 기관을 호흡기관이라고 해요.")
        self.play(FadeIn(d), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 호흡기관 ──
    def organs(self):
        self.section("호흡기관")
        b = K.body(K.RESP, h=5.8).move_to([-3.7, 0.1, 0])
        self.say("호흡기관에는 무엇이 있을까요?", "호흡기관 그림을 보며 이름을 붙여 봐요.")
        self.play(FadeIn(b), run_time=0.6)
        P = lambda x, y: K.vpt(b, x, y)
        labs = {
            'nose': K.pointer(P(165, 66), P(165, 66) + RIGHT * 1.9 + UP * 0.3, "코", AIRB, 32),
            'trachea': K.pointer(P(167, 112), P(167, 112) + RIGHT * 2.0, "숨관", AIRB, 32),
            'bronchi': K.pointer(P(186, 168), P(186, 168) + RIGHT * 1.75 + DOWN * 0.1, "숨관가지", AIRB, 32),
            'lung': VGroup(K.pointer(P(116, 196), P(116, 196) + LEFT * 1.0 + DOWN * 0.5, "폐", "#b25c68", 32),
                           K.pointer(P(206, 205), P(206, 205) + RIGHT * 1.3 + DOWN * 0.5, "폐", "#b25c68", 32)),
        }
        items = [('nose', f"{o('코')}: 공기가 드나드는 곳", "코는 공기가 드나드는 곳이에요."),
                 ('trachea', f"{o('숨관')}: 공기가 이동하는 통로", "숨관은 공기가 이동하는 통로예요."),
                 ('bronchi', f"{o('숨관가지')}: 숨관과 폐를 연결하는 통로",
                  "숨관가지는 여러 갈래로 갈라져 숨관과 폐를 연결하며, 공기가 이동하는 통로예요."),
                 ('lung', f"{o('폐')}: 산소를 받아들이고, 이산화 탄소를 내보내요",
                  "폐는 가슴의 좌우에 하나씩 있어요. 산소를 받아들이고, 이산화 탄소를 몸 밖으로 내보내요.")]
        cards = VGroup()
        for i, (k, sub, narr) in enumerate(items):
            line = K.text_card([sub], w=6.6, size=32).move_to([3.55, 2.2 - i * 1.25, 0])
            cards.add(line)
            self.say(sub, narr)
            self.play(FadeIn(labs[k]), FadeIn(line, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 가슴 변화 ──
    def chest(self):
        self.section("가슴의 변화")
        pos = np.array([-3.4, 0.1, 0])
        b = K.body([], h=5.8).move_to(pos)
        lungs = K.vb_svg(K.ORG['lungL'] + K.ORG['lungR'] + K.ORG['trachea'] + K.ORG['bronchi'] + K.ORG['nose'],
                         (-10, 0, 340, 470), 5.8).move_to(pos)
        c = K.vpt(b, 160, 180)
        self.say("가슴에 손을 얹고 숨을 크게 들이마시고 내쉬어 봐요",
                 "가슴에 양손을 얹고 천천히 숨을 크게 들이마시고 내쉬어 봐요. 가슴은 어떻게 될까요?")
        self.play(FadeIn(b), FadeIn(lungs), run_time=0.6)
        arrs = VGroup(*[Arrow(c + d * 0.9, c + d * 1.55, buff=0, color=ORANGE, stroke_width=7) for d in (LEFT, RIGHT)])
        c1 = K.text_card([self.acc("숨을 들이마실 때"), f"가슴이 {o('부풀어 올라요')}"], w=5.6, size=36).move_to([3.6, 1.3, 0])
        self.say(f"숨을 들이마시면 가슴이 {o('부풀어 올라요')}",
                 "숨을 들이마시면 가슴이 부풀어 올라요.")
        self.play(lungs.animate.scale(1.12, about_point=c), FadeIn(arrs), FadeIn(c1), run_time=1.4)
        c2 = K.text_card([self.acc("숨을 내쉴 때"), f"가슴이 {o('원래 위치')}로 돌아가요"], w=5.6, size=36).move_to([3.6, -1.1, 0])
        self.say(f"숨을 내쉬면 가슴이 {o('원래 위치')}로 돌아가요",
                 "숨을 내쉬면 가슴이 원래의 위치로 돌아가요.")
        self.play(lungs.animate.scale(1 / 1.12, about_point=c), FadeOut(arrs), FadeIn(c2), run_time=1.4)
        self.settle()
        clear_stage(self)

    def acc(self, t):
        return f'<span foreground="{self.accent}">{t}</span>'

    # ── 실험해요: 호흡기관 모형 ──
    def model(self):
        self.section("실험해요")
        prep = K.text_card(["준비물", "종이봉투 2장, 주름 빨대 2개", "셀로판테이프, 호흡기관 붙임딱지"], w=6.4, size=32).move_to([3.4, 1.6, 0])
        self.say("종이봉투와 주름 빨대로 호흡기관 모형을 만들어요",
                 "종이봉투 두 장, 주름 빨대 두 개, 셀로판테이프, 호흡기관 붙임딱지로 호흡기관 모형을 만들어요.")
        bm0 = K.bag_model(0, 1.15, stickers=False).move_to([-3.2, 0.1, 0])
        self.play(FadeIn(prep), FadeIn(bm0), run_time=0.7)
        steps = K.text_card(["① 빨대 두 개의 긴 쪽을 테이프로 감아요", "② 짧은 쪽을 각각 종이봉투 안에 넣고 감아요",
                             "③ 붙임딱지를 각 기관의 위치에 붙여요"], w=7.0, size=30).move_to([3.4, -1.0, 0])
        bm1 = K.bag_model(0, 1.15, stickers=True).move_to([-3.2, 0.1, 0])
        self.say("빨대를 봉투에 넣어 테이프로 감고, 붙임딱지를 붙여요",
                 "빨대 두 개의 긴 쪽을 테이프로 감고, 짧은 쪽을 각각 종이봉투 안에 넣어 감아요. 그리고 호흡기관 붙임딱지를 붙여요.")
        self.play(FadeIn(steps), FadeOut(bm0), FadeIn(bm1), run_time=0.8)
        top = bm1.get_top()
        names = VGroup(T("코·숨관", 28, AIRB).next_to(top, LEFT, buff=0.2).shift(DOWN * 0.3),
                       T("숨관가지", 28, AIRB).move_to([-3.2, 0.05, 0]).shift(UP * 0.55),
                       T("폐", 30, "#b25c68").move_to(bm1.get_bottom() + DOWN * 0.3 + LEFT * 1.45),
                       T("폐", 30, "#b25c68").move_to(bm1.get_bottom() + DOWN * 0.3 + RIGHT * 1.45))
        self.play(FadeIn(names), run_time=0.5)
        self.say("빨대에 공기를 불어 넣으면 어떻게 될까요?", "빨대에 천천히 공기를 불어 넣어요. 종이봉투는 어떻게 될까요?")
        self.settle()
        self.pause_screen(5, "종이봉투는 어떻게 될까요?")
        self.play(FadeOut(VGroup(prep, steps)), run_time=0.3)
        p = ValueTracker(0)
        bm = always_redraw(lambda: K.bag_model(p.get_value(), 1.15, stickers=True).move_to([-3.2, 0.1, 0]))
        self.remove(bm1)
        self.add(bm)
        air = VGroup(*[Dot(radius=0.07, color=AIRB) for _ in range(6)])
        a = K.text_card([f"종이봉투가 {o('부풀어 올라요')}", "공기를 불어 넣는 것은", f"숨을 {g('들이마실 때')}와 같아요"],
                        w=6.0, size=36).move_to([3.5, 0.6, 0])
        self.say(f"종이봉투가 {o('부풀어 올라요')}. 숨을 들이마실 때와 같아요",
                 "종이봉투가 부풀어 올라요. 공기를 불어 넣는 것은 우리가 숨을 들이마실 때와 같아요.")
        self.play(p.animate.set_value(1), FadeIn(a), run_time=2.0)
        n = K.text_card(["실제로는 갈비뼈와 가로막이 움직여", "공기가 몸속으로 들어와요"], w=6.0, size=30).move_to([3.5, -1.6, 0])
        self.say("실제로는 갈비뼈와 가로막이 움직여 공기가 들어와요",
                 "실제 우리 몸에서는 갈비뼈와 가로막이 움직여 공기가 몸속으로 들어와요.")
        self.play(FadeIn(n), run_time=0.5)
        self.settle()
        bm.clear_updaters()
        clear_stage(self)

    # ── 공기의 이동 경로 ──
    def route(self):
        self.section("공기의 이동 경로")
        pos = np.array([-3.6, 0.1, 0])
        b = K.body(K.RESP, h=5.8).move_to(pos)
        self.play(FadeIn(b), run_time=0.5)
        L = K.path_pts(b, IN_L)
        R = K.path_pts(b, IN_R)
        t = ValueTracker(0)
        mode = {"dir": 1, "col": AIRB}

        def dots():
            grp = VGroup()
            for pts in (L, R):
                for k in range(5):
                    f = (t.get_value() + k / 5) % 1
                    if mode["dir"] < 0:
                        f = 1 - f
                    grp.add(Dot(K.along(pts, f), radius=0.075, color=mode["col"]).set_stroke(PAPER, 1.5))
            return grp
        dd = always_redraw(dots)
        chain_in = self.chain(["코", "숨관", "숨관가지", "폐"], AIRB).move_to([3.4, 1.6, 0])
        hd1 = T("숨을 들이마실 때", 34, AIRB).next_to(chain_in, UP, buff=0.25)
        self.say(f"들이마실 때: {o('코 → 숨관 → 숨관가지 → 폐')}",
                 "숨을 들이마실 때 공기는 코, 숨관, 숨관가지를 지나 폐로 들어가요.")
        self.add(dd)
        self.play(FadeIn(hd1), FadeIn(chain_in, lag_ratio=0.3), t.animate.set_value(2), run_time=3.0, rate_func=linear)
        mode["dir"], mode["col"] = -1, "#8D96A0"
        chain_out = self.chain(["폐", "숨관가지", "숨관", "코"], "#6E7780").move_to([3.4, -0.8, 0])
        hd2 = T("숨을 내쉴 때", 34, "#6E7780").next_to(chain_out, UP, buff=0.25)
        self.say(f"내쉴 때: {o('폐 → 숨관가지 → 숨관 → 코')}",
                 "숨을 내쉴 때는 몸속에서 생긴 이산화 탄소를 포함한 공기가 폐, 숨관가지, 숨관, 코를 거쳐 몸 밖으로 나가요.")
        self.play(FadeIn(hd2), FadeIn(chain_out, lag_ratio=0.3), t.animate.set_value(4), run_time=3.0, rate_func=linear)
        self.play(t.animate.set_value(6), run_time=2.5, rate_func=linear)
        self.settle()
        dd.clear_updaters()
        clear_stage(self)

    def chain(self, names, col):
        g_ = VGroup(*[K.label(n, col, 32) for n in names]).arrange(RIGHT, buff=0.45)
        arrs = VGroup(*[Arrow(g_[i].get_right(), g_[i + 1].get_left(), buff=0.06, color=ORANGE, stroke_width=5,
                              max_tip_length_to_length_ratio=0.45) for i in range(len(names) - 1)])
        return VGroup(*[x for pair in zip(g_, list(arrs) + [VGroup()]) for x in pair])

    # ── 생각 바로잡기 ──
    def myth(self):
        self.section("생각 바로잡기")
        s1 = K.text_card(["숨을 들이마실 때는 산소만 들어오고,", "내쉴 때는 이산화 탄소만 나가요."], w=10.0, size=38).move_to([0.5, 1.6, 0])
        self.say("들이마실 때 산소만, 내쉴 때 이산화 탄소만 나갈까요?",
                 "숨을 들이마실 때는 산소만 들어오고, 내쉴 때는 이산화 탄소만 나갈까요?")
        self.play(FadeIn(s1), run_time=0.6)
        self.pause_screen(5, "맞을까요, 틀릴까요?")
        x1 = K.ox_mark(False, 0.4).next_to(s1, LEFT, buff=0.3)
        a = K.text_card([f"들이마시고 내쉬는 것은 모두 여러 기체가 섞인 {o('공기')}예요",
                         f"내쉬는 공기에는 산소가 조금 적고, 이산화 탄소가 조금 더 많아요"], w=11.4, size=32).move_to([0.5, -0.3, 0])
        self.say(f"아니에요. 들이마시고 내쉬는 것은 모두 {o('공기')}예요",
                 "아니에요. 들이마시고 내쉬는 것은 모두 여러 가지 기체가 섞인 공기예요. 내쉬는 공기에는 산소가 조금 적고, 이산화 탄소가 조금 더 많아요.")
        self.play(Create(x1), FadeIn(a), run_time=0.8)
        q = K.text_card([f"입으로도 숨을 쉴 수 있는 까닭: 코와 입이 몸속에서 {g('연결')}되어 있어요"], w=11.4, size=32).move_to([0.5, -1.85, 0])
        self.say(f"입으로도 숨을 쉴 수 있어요. 코와 입이 {g('연결')}되어 있거든요",
                 "입으로도 숨을 쉴 수 있는 까닭은 코의 안쪽과 입의 안쪽이 연결되어 있기 때문이에요. 그래서 공기가 숨관과 숨관가지를 지나 폐로 가요.")
        self.play(FadeIn(q), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        b = K.body(K.RESP, h=5.4).move_to([-4.3, 0.15, 0])
        card = K.text_card(["코로 들이마신 공기는", f"숨관과 숨관가지를 지나 {o('폐')}로", "들어갑니다.",
                            f"폐는 {g('산소')}를 받아들이고,", "이산화 탄소를 몸 밖으로 내보냅니다."],
                           w=7.4, size=40).move_to([2.5, 0.4, 0])
        self.say(f"폐는 {g('산소')}를 받아들이고, 이산화 탄소를 몸 밖으로 내보내요",
                 "코로 들이마신 공기는 숨관과 숨관가지를 지나 폐로 들어가요. 폐는 산소를 받아들이고, 이산화 탄소를 몸 밖으로 내보내요. 산소는 우리가 몸을 움직이거나 몸속 기관이 일하는 데 쓰여요.")
        self.play(FadeIn(b), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
