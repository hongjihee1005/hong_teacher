"""「과학 원리 돋보기」 4학년 19화 — 세균이 궁금해! (4-1 4단원 다양한 생물과 우리 생활 5차시, 화 코드 4-1-4-c)

바탕: grade4/science/sem1/u4-3.html(원본 _build_tb/src/u4-3.html) — 도입(손을 씻는 까닭, 세균 보기 안경 = 점으로 그려 보여 줌,
세균은 균류·원생생물보다 작아 맨눈 관찰이 어려움), 사진 조사(공·막대·나선 모양, 전자 현미경 사진에 색을 입힌 것, 이름은 외우지 않음),
모여 있는 모습(하나씩·뭉쳐·연결), 사는 곳 6곳(땅·물·입안·장·문손잡이·휴대 전화), 번식 실험실(먹이 + 알맞은 온도 → 둘로 나뉨,
8번 → 256마리, '실제 수와 시간은 세균과 조건에 따라 달라요'), 크기 비교(버섯 > 짚신벌레 > 세균), 한눈에 쏙 '세균은 균류나 원생생물보다
크기가 작습니다', 생각이 쑥(화장실·쓰레기통·문손잡이·키보드), 형성 평가(모두 공 모양 ×, 복잡 ×, 맨눈 관찰 어려움 ◯, 빠르게 번식).
최종: ./make_final.sh s4ep19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circumscribe, Transform,
                   Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u14 as K
import kit_s3u24 as K3


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def item(pic, name, w=2.0, h=1.5, size=28):
    K.fit(pic, w, h)
    lab = T(name, size).next_to(pic, DOWN, buff=0.2)
    return VGroup(pic, lab)


def dots_on(mob, n=14, seed=1, r_=0.06, dy=0.0, sx=0.35, sy=0.35):
    rng = np.random.default_rng(seed)
    cols = [K.BAC_P, K.BAC_O, K.BAC_G]
    g_ = VGroup()
    c = mob.get_center() + np.array([0, dy * mob.height, 0])
    for k in range(n):
        p = c + np.array([rng.uniform(-mob.width * sx, mob.width * sx), rng.uniform(-mob.height * sy, mob.height * sy), 0])
        g_.add(K.bac_dot(r_, cols[k % 3]).move_to(p))
    return g_


class S4Ep19(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 19
    EP_TITLE = "세균이 궁금해!"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.shapes()
        self.where()
        self.grow()
        self.size()
        self.correct()
        self.summary()
        self.closing(f"세균은 {o('공·막대·나선 모양')} 등이 있고 {r('크기가 매우 작아요')}\n"
                     f"살기 알맞은 조건이 되면 {g('빠르게 번식해요')}",
                     next_preview="4학년 20화 · 다양한 생물이 우리 생활에 주는 영향")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        hd = K.fit(K3.hand(), 2.4, 2.6).move_to([-3.2, 0.5, 0])
        br = K.fit(K.bread(0.0), 2.0, 2.0).move_to([2.6, 0.4, 0])
        self.say("음식을 먹기 전에 왜 손을 씻어야 할까요?", "음식을 먹기 전에 손을 씻어야 하는 까닭은 무엇일까요?")
        self.play(FadeIn(hd), FadeIn(br), run_time=0.6)
        self.pause_screen(5, "손을 씻어야 하는 까닭은?")
        dts = dots_on(hd, 18, 2)
        note = T("세균을 점으로 그려서 보여 준 그림", 28, SOFT).move_to([-3.2, -1.95, 0])
        self.say(f"손에 있던 {r('세균')}이 음식과 함께 입으로 들어갈 수 있어요",
                 "손에 있던 세균이 음식과 함께 입으로 들어가 질병에 걸릴 수 있어서 손을 씻어야 해요.")
        self.play(FadeIn(dts, lag_ratio=0.05), FadeIn(note), run_time=1.0)
        self.play(dts[:6].animate.move_to(br.get_center()), run_time=1.0)
        self.say(f"세균은 너무 작아서 {o('맨눈으로 볼 수 없어요')}",
                 "실제 세균은 너무 작아서 맨눈으로 볼 수 없어요. 세균은 균류나 원생생물보다 크기가 작아요.")
        self.settle()
        clear_stage(self)

    # ── 세균의 생김새 ──
    def shapes(self):
        self.section("세균의 생김새")
        self.say("세균의 모습은 사진 자료로 찾아봐요",
                 "세균은 맨눈으로 관찰하기 어려워서 사진이나 동영상 자료로 생김새를 살펴봐요.")
        pics = [(K.coccus(9, K.BAC_P, 0.2), "공 모양"), (K.bacillus(3, K.BAC_G, 0.95, 0.32), "막대 모양"),
                (K.spirillum(2, K.BAC_O, 1.6, 0.16), "나선 모양")]
        grp = VGroup()
        for i, (p, n) in enumerate(pics):
            frame = K.R(3.6, 2.6, "#1F2430", rad=0.15, stroke=SOFT, sw=4)
            K.fit(p, 2.8, 1.9).move_to(frame)
            lab = T(n, 38).next_to(frame, DOWN, buff=0.25)
            grp.add(VGroup(frame, p, lab))
        grp.arrange(RIGHT, buff=0.6).move_to([0, 0.75, 0])
        self.play(FadeIn(grp, lag_ratio=0.3), run_time=1.5)
        self.say(f"세균은 {o('공 모양, 막대 모양, 나선 모양')} 등이 있어요",
                 "세균은 생김새가 단순하고, 공 모양, 막대 모양, 나선 모양 등이 있어요.")
        note = T("사진은 전자 현미경으로 찍고 색을 입힌 것이라 실제 색과 달라요", 28, SOFT).move_to([0, -1.95, 0])
        self.say("세균 사진의 색은 실제 색이 아니에요",
                 "세균 사진은 전자 현미경으로 찍고 디지털로 색을 입힌 모습이라 원래 세균의 색과 달라요. 세균의 이름은 외우지 않아도 돼요.")
        self.play(FadeIn(note), run_time=0.5)
        self.settle()
        clear_stage(self)
        # 모여 있는 모습
        a = VGroup(*[K.bacillus(1, K.BAC_G, 0.9, 0.3, seed=k).move_to([(k - 1) * 1.2, (k % 2) * 0.4 - 0.2, 0]) for k in range(3)])
        b = K.coccus(14, K.BAC_O, 0.17)
        c = VGroup(*[K.C(0.2, K.BAC_P, (k - 3) * 0.4, 0, stroke=INK, sw=2.5) for k in range(7)])
        its = [item(a, "하나씩", 3.0, 1.6, 34), item(b, "한곳에 뭉쳐", 3.0, 1.6, 34), item(c, "여러 개 연결", 3.0, 1.6, 34)]
        grp = VGroup(*its).arrange(RIGHT, buff=1.0).move_to([0, 0.6, 0])
        self.say("모여 있는 모습도 여러 가지예요",
                 "모여 있는 모습도 여러 가지예요. 하나씩 떨어져 있기도 하고, 한곳에 뭉쳐 있거나 여러 개가 연결되어 있기도 해요.")
        self.play(FadeIn(grp, lag_ratio=0.3), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 사는 곳 ──
    def where(self):
        self.section("세균이 사는 곳")
        mouth = K3.face("ok", 0.8)
        its = [item(K.soil_pile(), "땅(흙)"), item(K.water_cup(), "물"), item(mouth, "입안"),
               item(K.belly(), "장 속"), item(K3.door_knob(), "문손잡이"), item(K.phone(), "휴대 전화")]
        grp = VGroup(*its).arrange_in_grid(2, 3, buff=(1.4, 0.55)).move_to([0, 0.45, 0])
        self.say("세균은 어디에 살까요?", "세균은 어디에 살까요? 세균 보기 안경을 쓰고 찾아봐요.")
        self.play(FadeIn(grp, lag_ratio=0.12), run_time=1.2)
        dts = VGroup(*[dots_on(it[0], 8, k + 5, 0.055, *((-0.25, 0.2, 0.08) if k == 2 else (0.0, 0.35, 0.35))) for k, it in enumerate(its)])
        self.play(FadeIn(dts, lag_ratio=0.1), run_time=1.2)
        self.say(f"땅, 물, {o('생물의 몸속')}, {o('물건')}에도 살아요",
                 "세균은 땅과 물, 우리 입안이나 장 같은 생물의 몸속, 문손잡이와 휴대 전화 같은 물건에도 살아요.")
        self.say(f"세균은 우리 주변 {g('곳곳에')} 있어요", "세균은 우리 주변 곳곳에 있어요.")
        self.settle()
        clear_stage(self)

    # ── 번식 ──
    def grow(self):
        self.section("세균의 번식")
        conds = VGroup(K.text_card(["먹이(양분)"], size=34), K.text_card(["알맞은 온도"], size=34)).arrange(DOWN, buff=0.35)
        conds.move_to([-4.6, 1.2, 0])
        self.say("살기 알맞은 조건을 만들어 주면 세균은 어떻게 될까요?",
                 "그림으로 흉내 낸 번식 실험이에요. 세균에게 먹이와 알맞은 온도를 만들어 주면 어떻게 될까요?")
        self.play(FadeIn(conds, lag_ratio=0.3), run_time=0.8)
        self.pause_screen(5, "세균의 수는 어떻게 될까요?")
        center = np.array([1.6, 0.35, 0])

        def colony(n):
            g_ = VGroup()
            for k in range(n):
                ang, rr = k * 2.4, np.sqrt(k) * 0.12
                g_.add(K.bac_dot(0.085, K.BAC_P).move_to(center + np.array([np.cos(ang) * rr * 1.5, np.sin(ang) * rr, 0])))
            return g_

        n = 1
        col = colony(1)
        cnt = M(f"세균 {o('1')}마리", 40).move_to([1.6, 2.6, 0])
        self.play(FadeIn(col), FadeIn(cnt), run_time=0.4)
        self.say("세균은 하나가 둘로 나뉘어 수가 늘어나요", "세균은 하나가 둘로 나뉘면서 수가 늘어나요.")
        for t in range(1, 9):
            n *= 2
            nc = colony(n)
            ncnt = M(f"세균 {o(str(n))}마리 ({t}번 나뉨)", 40).move_to(cnt)
            self.play(FadeOut(col), FadeIn(nc), FadeOut(cnt), FadeIn(ncnt), run_time=0.45)
            col, cnt = nc, ncnt
        self.say(f"짧은 시간에 1마리가 {r('256마리')}가 되었어요",
                 "짧은 시간에 1마리가 256마리가 되었어요. 세균은 살기 알맞은 조건이 되면 많은 수로 빠르게 번식해요.")
        note = T("실제로 늘어나는 수와 걸리는 시간은 세균과 조건에 따라 달라요", 26, SOFT).move_to([0, -2.1, 0])
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 크기 비교 ──
    def size(self):
        self.section("크기 비교")
        mu = K.fit(K.mushroom(), 3.0, 3.0)
        pm = K.fit(K.paramecium(), 1.6, 0.8)
        bc = K.fit(K.coccus(5, K.BAC_P, 0.1), 0.35, 0.35)
        its = [item(mu, "버섯 (균류)", 3.0, 3.0, 32), item(pm, "짚신벌레 (원생생물)", 1.6, 0.8, 32),
               item(bc, "세균", 0.35, 0.35, 32)]
        grp = VGroup(*its).arrange(RIGHT, buff=1.1, aligned_edge=DOWN).move_to([0, 0.5, 0])
        gts = VGroup(*[T(">", 60, ORANGE).move_to((its[i][1].get_center() + its[i + 1][1].get_center()) / 2 + UP * 0.9) for i in range(2)])
        self.say("크기가 큰 것부터 차례로 놓아 봐요", "버섯, 짚신벌레, 세균을 크기가 큰 것부터 차례로 놓아 봐요.")
        self.play(FadeIn(grp, lag_ratio=0.3), run_time=1.2)
        self.play(FadeIn(gts), run_time=0.4)
        note = T("크기를 정확한 비율로 그린 것은 아니에요", 26, SOFT).move_to([0, -2.1, 0])
        self.say(f"버섯 > 짚신벌레 > 세균: 세균이 {r('가장 작아요')}",
                 "버섯, 짚신벌레, 세균 차례로 커요. 세균은 균류나 원생생물보다 크기가 작아서 맨눈으로 관찰하기 어려워요.")
        self.play(FadeIn(note), Circumscribe(its[2], color=RED), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def correct(self):
        self.section("생각 바로잡기")
        rows = [("세균은 모두 공 모양이에요.", False, "공·막대·나선 모양 등 여러 가지예요"),
                ("세균은 생김새가 복잡해요.", False, "세균은 생김새가 단순해요"),
                ("세균은 매우 작아 맨눈으로 보기 어려워요.", True, "맞아요")]
        grp = VGroup()
        for i, (q, ok, why) in enumerate(rows):
            qt = T(q, 36).move_to([-1.0, 2.1 - i * 1.4, 0]).align_to([-6.0, 0, 0], LEFT)
            wt = M(g(why) if ok else r(why), 30).next_to(qt, DOWN, buff=0.18).align_to(qt, LEFT)
            mk = K.ox_mark(ok, 0.3).move_to([5.9, qt.get_center()[1] - 0.2, 0])
            grp.add(VGroup(qt, wt, mk))
        self.say("이런 생각, 맞을까요?", "세균에 대한 이런 생각, 맞을까요?")
        self.play(FadeIn(VGroup(*[x[0] for x in grp]), lag_ratio=0.2), run_time=1.0)
        self.pause_screen(5, "맞는 생각은 무엇일까요?")
        self.play(FadeIn(VGroup(*[VGroup(x[1], x[2]) for x in grp]), lag_ratio=0.3), run_time=1.2)
        self.say(f"세균은 생김새가 {o('단순')}하고 모양이 {o('여러 가지')}예요",
                 "세균은 모두 공 모양이 아니라 여러 가지 모양이 있고, 생김새가 단순해요. 크기가 매우 작아 맨눈으로 관찰하기 어려워요.")
        self.settle()
        clear_stage(self)
        # 학교에서
        its = [item(K.toilet(), "화장실"), item(K3.door_knob(), "문손잡이"), item(K.keyboard(), "함께 쓰는 키보드", 2.4, 1.2)]
        grp = VGroup(*its).arrange(RIGHT, buff=1.2).move_to([0, 0.6, 0])
        self.say("학교에서 세균이 많을 것 같은 곳은 어디일까요?",
                 "학교에서 세균이 많을 것 같은 곳은 어디일까요? 화장실, 문손잡이, 여러 사람이 함께 쓰는 키보드 같은 곳이에요.")
        self.play(FadeIn(grp, lag_ratio=0.2), run_time=1.0)
        self.say(f"세균은 주변 곳곳에 있으니 {g('손을 자주 씻어요')}", "세균은 우리 주변 곳곳에 있으니 손을 자주 씻어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"세균은 균류나 원생생물보다 크기가 {r('작습니다')}.",
                            f"세균은 생김새가 단순하고, {o('공·막대·나선 모양')} 등이 있습니다.",
                            f"살기 알맞은 조건이 되면 많은 수로 {g('빠르게 번식')}합니다."], w=12.8, size=40).move_to([0, 0.6, 0])
        self.say(f"세균은 균류나 원생생물보다 크기가 {r('작아요')}",
                 "세균은 균류나 원생생물보다 크기가 작아요. 생김새가 단순하고, 살기 알맞은 조건이 되면 많은 수로 빠르게 번식해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
