"""「과학 원리 돋보기」 4학년 18화 — 해캄과 짚신벌레 (4-1 4단원 다양한 생물과 우리 생활 4차시, 화 코드 4-1-4-b)

바탕: grade4/science/sem1/u4-2.html(원본 _build_tb/src/u4-2.html) — 도입(나팔벌레: 몸이 나팔처럼 생김), 연못 탐험(물 한 방울 확대,
연못·하천 생물 4가지), 해캄 맨눈·돋보기·만져 보기, 디지털 현미경 사용 순서(연결 → 애플리케이션 → 초점 휠, 60·250·1000배),
1000배로 본 해캄(나선 가닥·둥근 초록 알갱이·대나무 같은 마디)과 짚신벌레(길쭉한 둥근 모양·가는 털·몸 안쪽 여러 모양, 염색 표본),
정리(단순하고 작음, 눈·코·입이나 뿌리·줄기·잎이 없음), 원생생물 나누기(해캄·짚신벌레·종벌레·유글레나·반달말·미역 / 물방개·송사리 /
부레옥잠·검정말 / 표고버섯), 사는 곳(물이 고인 곳·흐르는 곳·바다), 한눈에 쏙 '종벌레와 반달말 같은 생물을 원생생물이라고 합니다'.
최종: ./make_final.sh s4ep18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circle, Circumscribe,
                   Transform, GrowFromCenter)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def item(pic, name, w=2.2, h=1.6, size=30):
    K.fit(pic, w, h)
    lab = T(name, size).next_to(pic, DOWN, buff=0.2)
    return VGroup(pic, lab)


def name_chip(text, col, size=28):
    t = T(text, size)
    box = K.R(t.width + 0.36, t.height + 0.26, PAPER, rad=0.14, stroke=col, sw=4)
    t.move_to(box)
    return VGroup(box, t)


class S4Ep18(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 18
    EP_TITLE = "해캄과 짚신벌레"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.pond_scene()
        self.haekam()
        self.digital()
        self.features()
        self.classify()
        self.where()
        self.summary()
        self.closing(f"해캄과 짚신벌레처럼 생김새가 단순한 생물을 {o('원생생물')}이라고 해요\n"
                     f"주로 {g('물이 있는 곳')}에서 살아요",
                     next_preview="4학년 19화 · 세균이 궁금해!")
        self.wait(0.5)

    # ── 궁금해요: 나팔벌레 ──
    def intro(self):
        self.section("궁금해요")
        st = K.stentor(3.0).move_to([-3.0, 0.3, 0])
        nm = T("나팔벌레", 44).next_to(st, DOWN, buff=0.3)
        self.say("이 생물의 이름은 나팔벌레예요", "이 생물의 이름은 나팔벌레예요. 왜 이런 이름이 붙었을까요?")
        self.play(FadeIn(st, scale=0.8), FadeIn(nm), run_time=0.8)
        self.pause_screen(5, "왜 이름이 나팔벌레일까요?")
        self.say(f"몸이 {o('나팔처럼')} 생겼기 때문이에요",
                 "몸이 나팔처럼 생겼기 때문이에요. 나팔벌레는 연못이나 하천에 사는 생물이에요.")
        self.play(Indicate(st, color=ORANGE, scale_factor=1.08), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 연못 탐험 ──
    def pond_scene(self):
        self.section("연못 탐험")
        pd = K.pond(12.4, 3.0).move_to([0, -0.6, 0])
        be = K.fit(K.diving_beetle(), 0.8, 1.0).move_to([-3.6, -1.2, 0])
        hy = K.fit(K.water_hyacinth(), 1.5, 1.4).move_to([-0.6, 0.7, 0])
        self.say("연못이나 하천에는 어떤 생물이 살까요?",
                 "연못이나 하천에는 물방개, 부레옥잠 같은 생물이 살아요.")
        self.play(FadeIn(pd), FadeIn(be), FadeIn(hy), run_time=0.8)
        drop = K.C(0.12, PAPER, 3.6, -0.9, stroke=K.POND_D, sw=4)
        self.play(GrowFromCenter(drop), run_time=0.4)
        zoom = VGroup(K.C(1.6, "#EAF6FB", stroke=K.POND_D, sw=8))
        zoom.add(K.spirogyra(2.6, 0.24, 3).rotate(0.4).move_to([-0.15, 0.55, 0]))
        zoom.add(K.paramecium(0.42).move_to([0.45, -0.6, 0]))
        zoom.add(K.paramecium(0.32).rotate(2.4).move_to([-0.75, -0.55, 0]))
        zoom.move_to([4.3, 1.0, 0])
        ln = Line(drop.get_center(), zoom.get_bottom(), stroke_color=K.POND_D, stroke_width=4)
        self.say(f"물 한 방울 속에도 {o('눈에 잘 보이지 않는')} 작은 생물이 살아요",
                 "물 한 방울을 확대해 보면, 눈에 잘 보이지 않는 작은 생물이 살고 있어요.")
        self.play(Create(ln), FadeIn(zoom, scale=0.3), run_time=1.0)
        l1 = T("해캄", 28).move_to(zoom.get_center() + np.array([-0.7, 1.15, 0]))
        l2 = T("짚신벌레", 28).move_to(zoom.get_center() + np.array([0.3, -1.25, 0]))
        self.say(f"초록색 가닥은 {g('해캄')}, 길쭉한 생물은 {o('짚신벌레')}예요",
                 "초록색 가닥은 해캄, 길쭉한 생물은 짚신벌레예요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 해캄 관찰 ──
    def haekam(self):
        self.section("해캄 관찰")
        eye = VGroup()
        rng = np.random.default_rng(7)
        for k in range(12):
            y0 = rng.uniform(-0.6, 0.6)
            pts = [(-1.5 + j * 0.5, y0 + rng.uniform(-0.25, 0.25)) for j in range(7)]
            eye.add(K.S(pts, K.ALGA if k % 2 else K.ALGA_D, 6))
        eye = K.fit(eye, 3.4, 1.6)
        mag = VGroup(K.C(1.5, "#EAF6E4", stroke=ORANGE, sw=12))
        for k in range(5):
            mag.add(K.S([(-1.3, -0.6 + k * 0.3), (-0.4, -0.4 + k * 0.28), (0.5, -0.65 + k * 0.32), (1.3, -0.45 + k * 0.3)], K.ALGA_D, 4))
        cells = [(eye, "맨눈", "초록색 가닥이 여러 개 뭉쳐 있어요"),
                 (mag, "돋보기", "실처럼 가늘고 긴 가닥, 더 크게 보여요")]
        self.say("해캄을 맨눈과 돋보기로 관찰해요", "해캄을 맨눈과 돋보기로 관찰해요.")
        grp = VGroup()
        for i, (pic, h, d) in enumerate(cells):
            K.fit(pic, 3.2, 2.6).move_to([-3.4 + i * 6.8, 0.6, 0])
            hd = T(h, 36, ORANGE).next_to(pic, UP, buff=0.2)
            ds = T(d, 28).next_to(pic, DOWN, buff=0.25)
            grp.add(VGroup(pic, hd, ds))
        self.play(FadeIn(grp[0]), run_time=0.6)
        self.say("맨눈: 초록색 가닥이 여러 개 뭉쳐 있어요", "맨눈으로 보면 초록색 가닥이 보이고, 여러 가닥이 뭉쳐 있어요.")
        self.play(FadeIn(grp[1]), run_time=0.6)
        self.say("돋보기: 실처럼 가늘고 긴 가닥이 크게 보여요", "돋보기로 보면 실처럼 가늘고 긴 가닥이 뭉쳐 있고, 맨눈으로 볼 때보다 크게 보여요.")
        self.say(f"실험용 장갑을 끼고 만져 보면 {o('미끈미끈, 부드러워요')}",
                 "실험용 장갑을 끼고 만져 보면 미끈미끈하고 부드러워요.")
        self.settle()
        clear_stage(self)

    # ── 디지털 현미경 ──
    def digital(self):
        self.section("디지털 현미경")
        ds = K.fit(K.digital_scope(), 5.0, 2.6).move_to([-3.2, 0.6, 0])
        steps = VGroup(*[T(t, 30) for t in ["① 스마트 기기에 연결해요", "② 애플리케이션을 켜요",
                                              "③ 초점 휠을 돌려 낮은 배율부터 봐요"]]).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        steps.move_to([3.4, 0.6, 0])
        self.say("해캄과 짚신벌레는 작아서 디지털 현미경으로 관찰해요",
                 "해캄과 짚신벌레는 크기가 작아서 디지털 현미경으로 관찰해요. 스마트 기기에 연결하고, 애플리케이션을 켜고, 낮은 배율부터 차례로 높여요.")
        self.play(FadeIn(ds), run_time=0.6)
        self.play(FadeIn(steps, lag_ratio=0.3), run_time=1.2)
        self.settle()
        clear_stage(self)

        # 해캄 60 → 250 → 1000
        rad = 1.75
        cx = np.array([-3.2, 0.45, 0])

        def view(content, bg):
            ring = Circle(radius=rad, stroke_color="#222222", stroke_width=14).move_to(cx)
            return VGroup(K.C(rad, bg, stroke=None, sw=0).move_to(cx), content, ring)

        def h_view(z):
            c = VGroup()
            if z == 60:
                for k, (off, ang) in enumerate([(-1.0, 0.25), (-0.5, -0.1), (0.0, 0.15), (0.5, -0.2), (1.0, 0.1)]):
                    c.add(K.strand_in_circle(rad, off, 0.1, ang, 0.35, spiral=False, dots=False, phase=k * 0.1))
            elif z == 250:
                for k, (off, ang) in enumerate([(-0.85, 0.15), (0.0, -0.05), (0.85, 0.2)]):
                    c.add(K.strand_in_circle(rad, off, 0.34, ang, 1.0, phase=k * 0.3))
            else:
                c.add(K.strand_in_circle(rad, 0.0, 1.15, 0.15, 2.2, phase=0.4))
            c.shift(cx)
            return view(c, "#EEF7EE")

        lab = T("해캄", 40).move_to([3.6, 2.45, 0])
        zl = T("60배", 40, ORANGE).move_to([3.6, 1.7, 0])
        v = h_view(60)
        self.say("해캄을 60배로 보면 초록색 실 같은 가닥이 여러 개 보여요",
                 "해캄을 60배로 보면 초록색 실 같은 가닥이 여러 개 보여요.")
        self.play(FadeIn(v), FadeIn(lab), FadeIn(zl), run_time=0.7)
        v2 = h_view(250)
        z2 = T("250배", 40, ORANGE).move_to(zl)
        self.say("250배로 높이면 가닥 안에 나선 모양이 보이기 시작해요",
                 "250배로 높이면 가닥 안에 초록색 나선 모양이 보이기 시작해요.")
        self.play(FadeOut(v), FadeIn(v2), Transform(zl, z2), run_time=0.7)
        self.pause_screen(5, "1000배로 보면 어떤 모습일까요?")
        v3 = h_view(1000)
        z3 = T("1000배", 40, ORANGE).move_to(zl)
        self.play(FadeOut(v2), FadeIn(v3), Transform(zl, z3), run_time=0.7)
        feats = VGroup(*[M(t, 30) for t in [f"· 초록색의 실처럼 가는 {o('나선')} 가닥",
                                             f"· 가닥 안의 작고 둥근 {g('초록색 알갱이')}",
                                             f"· 대나무처럼 {o('마디')}로 나누어짐"]]).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        feats.move_to([3.6, 0.0, 0])
        self.say("해캄(1000배): 나선 가닥, 초록색 알갱이, 대나무 같은 마디",
                 "1000배로 보면 초록색의 실처럼 가는 나선 가닥과 작고 둥근 초록색 알갱이가 보여요. 대나무처럼 마디로 나누어져 있어요.")
        self.play(FadeIn(feats, lag_ratio=0.3), run_time=1.2)
        self.settle()
        clear_stage(self)

        # 짚신벌레
        lab = T("짚신벌레 (1000배)", 40).move_to([3.6, 2.2, 0])
        pv = view(K.paramecium(1.25).rotate(-0.15).move_to(cx), "#F6EEF3")
        self.say("짚신벌레 영구 표본을 1000배로 관찰해요",
                 "짚신벌레 영구 표본도 1000배로 관찰해요. 염색한 표본이라 실제 색과 달라요.")
        self.play(FadeIn(pv), FadeIn(lab), run_time=0.7)
        feats = VGroup(*[M(t, 30) for t in [f"· {o('길쭉한 둥근')} 모양",
                                             f"· 바깥쪽에 {o('가는 털')}이 보여요",
                                             "· 몸 안쪽에 여러 가지 모양이 보여요"]]).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        feats.move_to([3.6, 0.0, 0])
        self.say("짚신벌레: 길쭉한 둥근 모양, 바깥쪽에 가는 털",
                 "짚신벌레는 길쭉한 둥근 모양이고, 바깥쪽에 가는 털이 보여요. 몸 안쪽에 여러 가지 모양이 보여요.")
        self.play(FadeIn(feats, lag_ratio=0.3), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def features(self):
        self.section("정리해요")
        hk = K.fit(K.spirogyra(3.0, 0.5, 3), 3.2, 0.8).move_to([-3.4, 1.6, 0])
        pm = K.fit(K.paramecium(), 2.6, 1.4).move_to([3.4, 1.6, 0])
        lines = [f"생김새가 동물이나 식물보다 {o('단순하고')} 크기가 {o('작아요')}",
                 f"눈·코·입이나 뿌리·줄기·잎이 {r('없어요')}"]
        card = K.text_card(lines, w=12.4, size=38).move_to([0, -0.6, 0])
        self.say(f"생김새가 {o('단순하고')}, 눈·코·입이나 뿌리·줄기·잎이 {r('없어요')}",
                 "해캄과 짚신벌레는 생김새가 동물이나 식물보다 단순하고 크기가 작아요. 눈, 코, 입이나 뿌리, 줄기, 잎이 없어요.")
        self.play(FadeIn(hk), FadeIn(pm), FadeIn(card), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 원생생물 ──
    def classify(self):
        self.section("원생생물")
        cols = [(ORANGE, "원생생물"), (BLUE, "동물"), (GREEN, "식물"), ("#8B5A2B", "균류")]
        bins = VGroup()
        ws = [5.0, 2.6, 2.6, 2.4]
        x = -6.6
        for (c, n), w in zip(cols, ws):
            b = K.bin_box(n, w, 3.6, c, 34)
            b.move_to([x + w / 2, 0.55, 0])
            x += w + 0.2
            bins.add(b)
        self.say(f"해캄과 짚신벌레 같은 생물을 {o('원생생물')}이라고 해요",
                 "해캄과 짚신벌레는 동물, 식물, 균류와 다른 생물이에요. 이런 생물을 원생생물이라고 해요.")
        self.play(FadeIn(bins), run_time=0.7)
        data = [(0, ["해캄", "짚신벌레", "종벌레", "유글레나", "반달말", "미역"]), (1, ["물방개", "송사리"]),
                (2, ["부레옥잠", "검정말"]), (3, ["표고버섯"])]
        chips = {}
        anims = []
        for bi, names in data:
            b = bins[bi]
            per = 2 if bi == 0 else 1
            dx = 2.3
            pos = K.slots(b.get_center()[0], b.get_top()[1] - 1.05, len(names), per, dx, 0.82)
            for n, p in zip(names, pos):
                c = name_chip(n, cols[bi][0], 28).move_to(p)
                chips[n] = c
                anims.append(FadeIn(c, shift=DOWN * 0.2))
        self.say("종벌레·유글레나·반달말도 원생생물이에요", "종벌레, 유글레나, 반달말도 원생생물이에요.")
        self.play(*anims, lag_ratio=0.08, run_time=2.0)
        self.say(f"해캄은 {r('식물이 아니고')}, 짚신벌레는 {r('동물이 아니에요')}",
                 "해캄은 초록색이지만 식물이 아니고, 짚신벌레는 이름에 벌레가 있지만 동물이 아니에요. 둘 다 원생생물이에요.")
        self.play(Circumscribe(chips["해캄"], color=RED), Circumscribe(chips["짚신벌레"], color=RED), run_time=1.2)
        self.say(f"바다에 사는 {o('미역')}도 원생생물이에요", "미역은 크고 식물처럼 보이지만, 바다에 사는 원생생물이에요.")
        self.play(Circumscribe(chips["미역"], color=ORANGE), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 사는 곳 ──
    def where(self):
        self.section("사는 곳")
        paddy = VGroup(K.R(2.8, 1.4, K.POND, rad=0.3, stroke=K.POND_D, sw=4),
                       *[K.L((x, -0.1), (x + 0.05, 0.6), "#4B8A37", 5) for x in (-0.9, -0.3, 0.3, 0.9)])
        river = VGroup(K.R(2.8, 1.4, "#C9B27A", rad=0.2, stroke=None, sw=0),
                       K.P([(-1.4, -0.3), (1.4, -0.5), (1.4, 0.2), (-1.4, 0.4)], K.POND, stroke=K.POND_D),
                       *[K.L((-0.8 + k * 0.6, 0.0), (-0.5 + k * 0.6, -0.05), K.POND_D, 4) for k in range(3)])
        sea = VGroup(K.R(2.8, 1.6, "#7FC6E8", rad=0.2, stroke="#2F6F95", sw=4), K.seaweed(1.1).move_to([-0.6, -0.15, 0]),
                     K.seaweed(1.0, "#556B2F").move_to([0.6, -0.2, 0]))
        its = [item(paddy, "논·연못: 물이 고인 곳", 3.2, 1.8, 30), item(river, "하천: 물이 흐르는 곳", 3.2, 1.8, 30),
               item(sea, "바다: 미역, 다시마", 3.2, 1.8, 30)]
        grp = VGroup(*its).arrange(RIGHT, buff=0.7).move_to([0, 0.6, 0])
        self.say("원생생물은 주로 어디에서 살까요?", "원생생물은 주로 어디에서 살까요?")
        self.play(FadeIn(grp, lag_ratio=0.2), run_time=1.2)
        self.say(f"주로 {g('물이 고인 곳')}이나 {g('물이 흐르는 곳')}, 바다에도 살아요",
                 "원생생물은 주로 논, 연못처럼 물이 고인 곳이나 하천처럼 물이 흐르는 곳에서 살아요. 미역, 다시마처럼 바다에 사는 것도 있어요. 생물이 사는 물을 오염하지 않도록 노력해요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"종벌레와 반달말 같은 생물을 {o('원생생물')}이라고 합니다.",
                            "원생생물은 동물, 식물, 균류와 다른 생물로",
                            f"생김새가 {o('단순')}하고 주로 {g('물이 있는 곳')}에서 삽니다."], w=12.6, size=42).move_to([0, 0.6, 0])
        self.say(f"종벌레와 반달말 같은 생물을 {o('원생생물')}이라고 해요",
                 "종벌레와 반달말 같은 생물을 원생생물이라고 해요. 원생생물은 동물, 식물, 균류와 다른 생물로, 생김새가 단순하고 주로 물이 있는 곳에서 살아요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
