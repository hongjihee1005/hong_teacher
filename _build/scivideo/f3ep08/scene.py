"""「처음 배우는 과학」 3학년 8화 — 극지방과 사막에 사는 동물 (3-1 2단원 동물의 생활 6차시, 화 코드 3-1-2-d)

바탕: grade3/science/sem1/u2-4.html — 도입(추운 겨울 견디기, 극지방·사막 ENV), 몸에 지방이 있으면 좋은 점 실험
(큰 지퍼 백에 바셀린 1/3 → 작은 지퍼 백 → 양손을 얼음물에 → 바셀린 쪽 손이 덜 차가움, 얼음물 = 극지방의 추운 환경 · 바셀린 = 동물의 두꺼운 지방),
생각 바로잡기(지방이 열을 내는 것이 아님), 극지방 동물(북극곰·순록·하프물범·펭귄), 사막 동물(낙타·사막여우·이집트땅거북·사막전갈),
사막여우의 큰 귀, 수행 평가 2 정리 문장, 한눈에 쏙(북극곰 체온 유지), 형성 평가 1.
앱의 가상 온도계 값은 '예시 값'이라 수를 쓰지 않음. (손가락 장갑 탐구·짝 찾기 놀이·생각+(동굴)·형성 평가 2~4는 길이 때문에 뺌)
실제 그림: photos/f3ep08/ (WANT.md)
최종: TTS_SPEED=1.0 ./make_voice.sh f3ep08
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Circle, Circumscribe, Create, FadeIn, FadeOut, GrowArrow, GrowFromEdge,
                   Indicate, Rectangle, RoundedRectangle, Square, Line, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, SKIN, clear_stage
import kit_s3u12 as K
import firstkit as F


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


VAS = "#F2D35B"   # 바셀린
ICE = "#CFEAF7"

# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "bear_fur": (1100, 420), "bear_body": (1050, 520),
    "rein_hoof1": (870, 1005), "rein_hoof2": (1490, 1010),
    "peng_group": (950, 560),
    "camel_hump": (1150, 150), "camel_eye": (468, 145),
    "fox_earL": (760, 170), "fox_earR": (1130, 170),
}


def hand():
    palm = RoundedRectangle(corner_radius=0.2, width=0.9, height=0.9, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=3)
    fingers = VGroup(*[RoundedRectangle(corner_radius=0.1, width=0.2, height=0.55 - 0.08 * abs(i - 1.5), fill_color=SKIN, fill_opacity=1,
                                        stroke_color=INK, stroke_width=3).move_to([-0.33 + 0.22 * i, 0.6 - 0.04 * abs(i - 1.5), 0]) for i in range(4)])
    thumb = RoundedRectangle(corner_radius=0.1, width=0.2, height=0.5, fill_color=SKIN, fill_opacity=1, stroke_color=INK,
                             stroke_width=3).rotate(0.7).move_to([-0.55, 0.05, 0])
    wrist = Rectangle(width=0.7, height=0.9, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, -0.85, 0])
    return VGroup(wrist, fingers, thumb, palm)


def bag(w, h, col=PAPER):
    b = RoundedRectangle(corner_radius=0.12, width=w, height=h, fill_color=col, fill_opacity=0.35, stroke_color="#6E8FA8", stroke_width=4)
    zip_ = Line(b.get_corner(UP + LEFT) + DOWN * 0.15 + RIGHT * 0.05, b.get_corner(UP + RIGHT) + DOWN * 0.15 + LEFT * 0.05,
                stroke_color="#3F7FBF", stroke_width=6)
    return VGroup(b, zip_)


class F3Ep08(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 8
    EP_TITLE = "극지방과 사막에 사는 동물"
    SERIES = "처음 배우는 과학"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.wonder()
        self.experiment()
        self.meaning()
        self.polar()
        self.desert()
        self.sort_home()
        self.summary()
        self.check()
        self.closing(f"극지방 동물은 {o('두꺼운 지방')}·{o('촘촘한 털')}로 추위를 견디고\n"
                     f"사막 동물은 {g('큰 귀')}·{g('혹')}으로 건조한 환경을 견뎌요",
                     next_preview="처음 배우는 과학 3학년 9화 · 동물의 특징을 본뜬 생활용품")
        self.wait(0.5)

    # ── 궁금해요 ──
    def wonder(self):
        self.section("궁금해요")
        self.say("추운 겨울날, 우리는 어떻게 추위를 견디나요?", "추운 겨울날, 우리는 어떤 방법으로 추위를 견디나요?")
        items = VGroup(*[VGroup(K.ox_mark(True, 0.2), T(t, 44)).arrange(RIGHT, buff=0.35)
                         for t in ("따뜻한 옷을 입어요", "모자와 장갑을 착용해요", "목도리를 둘러요")]).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        items.move_to([0, 0.4, 0])
        self.play(FadeIn(items, lag_ratio=0.25), run_time=1.2)
        self.say("따뜻한 옷, 모자와 장갑, 목도리로 견뎌요", "따뜻한 옷을 입고, 모자와 장갑을 착용하고, 목도리를 둘러요.")
        self.settle()
        clear_stage(self)
        self.section("새 낱말")
        p1 = F.photo("f3ep08/polar_bear", width=6.3).move_to([-3.45, 0.75, 0])
        p2 = F.photo("f3ep08/camel", width=6.3).move_to([3.45, 0.75, 0])
        c1 = F.caption(p1, "극지방", 40, BLUE)
        c2 = F.caption(p2, "사막", 40, ORANGE)
        self.say(f"{b_('극지방')}은 눈과 빙하로 덮여 있고 매우 추워요", "극지방. 극지방은 눈과 빙하로 덮여 있고 매우 추워요.")
        self.play(FadeIn(p1), FadeIn(c1), run_time=0.7)
        self.say(f"{o('사막')}은 비가 적게 내려 건조하고, 낮과 밤의 온도 차이가 커요",
                 "사막. 사막은 비가 적게 내려 건조하고, 낮과 밤의 온도 차이가 커요.")
        self.play(FadeIn(p2), FadeIn(c2), run_time=0.7)
        self.say("몹시 춥거나 건조한 곳에도 동물이 살까요?", "이렇게 몹시 춥거나 건조한 곳에도 동물이 살까요?")
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def experiment(self):
        self.section("실험해요")
        self.say("극지방 동물은 추위를 어떻게 견딜까요?", "극지방 동물은 추위를 어떻게 견딜까요? 몸에 지방이 있으면 좋은 점을 실험으로 알아봐요.")
        big1 = bag(2.6, 3.0).move_to([-3.0, 0.6, 0])
        big2 = bag(2.6, 3.0).move_to([3.0, 0.6, 0])
        l1 = T("바셀린이 든 지퍼 백", 32).next_to(big1, UP, buff=0.12)
        l2 = T("빈 지퍼 백", 32).next_to(big2, UP, buff=0.12)
        self.play(FadeIn(big1), FadeIn(big2), FadeIn(l1), FadeIn(l2), run_time=0.6)
        vas = RoundedRectangle(corner_radius=0.1, width=2.4, height=1.0, fill_color=VAS, fill_opacity=1, stroke_width=0)
        vas.align_to(big1[0], DOWN).shift(UP * 0.1).set_x(-3.0)
        self.say(f"① 큰 지퍼 백에 {o('바셀린')}을 1/3 정도 넣어요", "큰 지퍼 백 하나에 바셀린을 3분의 1 정도 넣어요.")
        self.play(GrowFromEdge(vas, DOWN), run_time=0.8)
        small1 = bag(1.5, 2.2, "#FFFFFF").move_to([-3.0, 0.45, 0])
        small2 = bag(1.5, 2.2, "#FFFFFF").move_to([3.0, 0.45, 0])
        self.say("② ③ 두 큰 지퍼 백에 작은 지퍼 백을 하나씩 넣어요",
                 "바셀린이 든 큰 지퍼 백과 빈 큰 지퍼 백에 작은 지퍼 백을 하나씩 넣어요.")
        self.play(FadeIn(small1, shift=DOWN * 0.5), FadeIn(small2, shift=DOWN * 0.5), run_time=0.7)
        wrap = VGroup(Rectangle(width=0.4, height=2.0, fill_color=VAS, fill_opacity=1, stroke_width=0).move_to([-4.0, 0.35, 0]),
                      Rectangle(width=0.4, height=2.0, fill_color=VAS, fill_opacity=1, stroke_width=0).move_to([-2.0, 0.35, 0]))
        self.play(FadeIn(wrap), run_time=0.4)
        h1 = hand().scale(0.75).move_to([-3.0, 2.6, 0])
        h2 = hand().scale(0.75).move_to([3.0, 2.6, 0])
        tub = Rectangle(width=13.6, height=1.7, fill_color=K.WATER, fill_opacity=0.55, stroke_color=K.WATER_D, stroke_width=5).move_to([0, -1.55, 0])
        cubes = VGroup(*[Square(0.4, fill_color=ICE, fill_opacity=0.95, stroke_color="#7FB5D6", stroke_width=3).rotate(0.3 * i).move_to([x, -0.9, 0])
                         for i, x in enumerate((-6.0, -0.8, 0.4, 5.9, -5.2, 6.4))])
        self.say(f"④ 양손을 넣고 {b_('얼음물')}에 담가요",
                 "양손을 작은 지퍼 백에 넣고 얼음물에 담가요. 손을 얼음물에 오랫동안 담가 두지는 않아요.")
        self.play(h1.animate.move_to([-3.0, 0.3, 0]), h2.animate.move_to([3.0, 0.3, 0]), run_time=0.8)
        top = VGroup(big1, big2, vas, wrap, small1, small2, h1, h2, l1, l2)
        self.play(FadeIn(tub), FadeIn(cubes), top.animate.shift(DOWN * 0.55), run_time=0.8)
        self.pause_screen(5, "어느 쪽 손이 덜 차가울까요?")
        lab = T("차가움", 30, SOFT)
        bar1 = Rectangle(width=0.9, height=0.35, fill_color=BLUE, fill_opacity=1, stroke_width=0)
        bar2 = Rectangle(width=2.9, height=0.35, fill_color=BLUE, fill_opacity=1, stroke_width=0)
        g1 = VGroup(lab.copy(), bar1).arrange(RIGHT, buff=0.2).move_to([-3.0, 2.75, 0])
        g2 = VGroup(lab.copy(), bar2).arrange(RIGHT, buff=0.2).move_to([3.0, 2.75, 0])
        self.play(FadeOut(l1), FadeOut(l2), run_time=0.3)
        self.play(GrowFromEdge(g1, LEFT), GrowFromEdge(g2, LEFT), run_time=0.8)
        self.say(f"바셀린이 든 쪽 손이 {g('덜 차가워요')}",
                 "빈 지퍼 백에 넣은 손은 차가웠고, 바셀린이 든 지퍼 백에 넣은 손은 덜 차가웠어요.")
        self.play(Circumscribe(h1, color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 실험이 뜻하는 것 + 생각 바로잡기 ──
    def meaning(self):
        self.section("정리해요")
        a1 = VGroup(T("얼음물", 42, BLUE), T("→", 44, SOFT), T("극지방의 추운 환경", 42)).arrange(RIGHT, buff=0.4)
        a2 = VGroup(T("바셀린", 42, "#C69A12"), T("→", 44, SOFT), T("극지방 동물의 두꺼운 지방", 42)).arrange(RIGHT, buff=0.4)
        VGroup(a1, a2).arrange(DOWN, buff=0.6, aligned_edge=LEFT).move_to([0, 1.2, 0])
        self.say(f"얼음물은 {b_('극지방의 추운 환경')}이에요", "실험에서 얼음물은 극지방의 추운 환경을 뜻해요.")
        self.play(FadeIn(a1, shift=RIGHT * 0.2), run_time=0.5)
        self.say(f"바셀린은 동물의 두꺼운 {o('지방')}이에요", "바셀린은 극지방에 사는 동물의 몸에 있는 두꺼운 지방을 뜻해요. 지방.")
        self.play(FadeIn(a2, shift=RIGHT * 0.2), run_time=0.5)
        c = M(f"두꺼운 {o('지방')}은 {g('추위를 견디게')} 도와줘요", 44).move_to([0, -1.1, 0])
        self.say(f"두꺼운 {o('지방')}은 추위를 견디게 도와줘요", "바셀린처럼, 극지방에 사는 동물의 몸에 있는 두꺼운 지방은 추위를 견디게 도와줘요.")
        self.play(FadeIn(c), run_time=0.5)
        self.settle()
        clear_stage(self)
        self.section("생각 바로잡기")
        q = M(f"“지방이 스스로 열을 내서 따뜻해진다?”", 48).move_to([0, 2.3, 0])
        self.say("지방이 스스로 열을 내서 따뜻해질까요?", "지방이 스스로 열을 내서 따뜻해지는 걸까요?")
        self.play(FadeIn(q), run_time=0.5)
        fat = Circle(radius=1.55, fill_color=VAS, fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([-3.2, -0.3, 0])
        body = Circle(radius=1.0, fill_color="#F3B9A0", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(fat)
        bt = T("몸", 36).move_to(body)
        ft = T("지방", 32, "#8A6A00").move_to(fat.get_center() + UP * 1.2 + LEFT * 0.62)
        arrows = VGroup(*[Arrow(fat.get_center() + 0.55 * np.array([np.cos(a), np.sin(a), 0]),
                                fat.get_center() + 1.45 * np.array([np.cos(a), np.sin(a), 0]), buff=0, color=RED, stroke_width=8,
                                max_tip_length_to_length_ratio=0.35) for a in (0.0, 1.57, 3.14, 4.71)])
        stop = VGroup(*[K.ox_mark(False, 0.16).move_to(fat.get_center() + 1.75 * np.array([np.cos(a), np.sin(a), 0])) for a in (0.0, 1.57, 3.14, 4.71)])
        self.play(FadeIn(fat), FadeIn(body), FadeIn(bt), FadeIn(ft), FadeIn(K.ox_mark(False, 0.3).next_to(q, RIGHT, buff=0.3)), run_time=0.6)
        self.play(Create(arrows), run_time=0.6)
        self.play(FadeIn(stop), run_time=0.4)
        t = VGroup(M(f"지방이 열을 만드는 것이 {r('아니에요')}", 40),
                   M(f"몸의 따뜻함이 {o('빠져나가는 것을 막아')}", 40),
                   M(f"{g('체온을 유지')}하게 도와줘요", 40)).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([2.7, -0.3, 0])
        self.say(f"따뜻함이 {o('빠져나가는 것을 막아')} {g('체온을 유지')}해요",
                 "아니에요. 지방이 열을 만드는 것이 아니라, 두꺼운 지방이 몸의 따뜻함이 밖으로 빠져나가는 것을 막아 체온을 유지하게 도와줘요.")
        self.play(FadeIn(t, lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 극지방 동물 ──
    def polar(self):
        self.section("조사해요")
        self.say(f"{b_('극지방')}에 사는 동물을 살펴봐요", "극지방에는 북극곰, 순록, 하프물범, 펭귄 등이 살아요. 하나씩 살펴봐요.")
        ph = F.photo("f3ep08/polar_bear", height=5.2).move_to([0, 0.35, 0])
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["bear_fur"], "촘촘한 털", to=(2.2, 1.2))
        self.say(f"북극곰은 몸이 {o('촘촘한 털')}로 덮여 있어요", "북극곰은 몸이 촘촘한 털로 덮여 있어요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say(f"두꺼운 {o('지방')}이 있어 {g('체온을 유지')}해요", "그리고 몸에 두꺼운 지방이 있어 체온을 유지해요.")
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep08/reindeer", height=5.2).move_to([0, 0.35, 0])
        self.say("눈 위에 서 있는 순록이에요", "눈 위에 서 있는 순록이에요.")
        self.play(FadeIn(ph), run_time=0.7)
        r1 = F.ring(ph, P["rein_hoof1"], r=0.5)
        r2 = F.ring(ph, P["rein_hoof2"], r=0.5)
        self.say(f"{o('발굽')}이 넓고 편평해요", "순록의 발을 보세요. 발굽이 넓고 편평해요.")
        self.play(Create(r1), Create(r2), run_time=0.7)
        self.say(f"그래서 {g('눈에 발이 잘 빠지지 않아요')}", "그래서 눈에 발이 잘 빠지지 않고 눈 위를 걸을 수 있어요.")
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep08/penguins", height=5.2).move_to([0, 0.35, 0])
        self.say("펭귄은 몸이 털로 덮여 있어요", "펭귄은 몸이 털로 덮여 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        rg = F.ring(ph, P["peng_group"], rx=3.2, ry=1.6)
        self.say(f"여러 펭귄이 {o('몸을 맞대')} 추위를 견뎌요", "여러 펭귄이 서로 몸을 맞대 추위를 견뎌요.")
        self.play(Create(rg), run_time=0.8)
        self.say(f"하프물범은 새끼 때 털이 흰색이고 {o('빙하 위')}에서 살아요",
                 "하프물범은 새끼 때는 털이 흰색이고, 빙하 위에서 주로 생활해요.")
        self.settle()
        clear_stage(self)

    # ── 사막 동물 ──
    def desert(self):
        self.say(f"{o('사막')}에 사는 동물을 살펴봐요", "이번에는 사막이에요. 사막에는 낙타, 사막여우, 이집트땅거북, 사막전갈 등이 살아요.")
        ph = F.photo("f3ep08/camel", height=5.2).move_to([0, 0.35, 0])
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["camel_hump"], "혹", to=(2.0, 0.4))
        self.say(f"낙타는 등의 {o('혹')}에 지방을 저장해요",
                 "낙타는 등의 혹에 지방을 저장해, 물과 먹이가 없어도 며칠 동안 살 수 있어요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        a2, t2 = F.callout(ph, P["camel_eye"], "긴 눈썹", to=(0.6, -1.6))
        self.say(f"{o('긴 눈썹')}과 귀 주위 털이 모래로부터 보호해요",
                 "눈썹과 귀 주위의 털이 길어, 모래로부터 눈과 귀를 보호해요.")
        self.play(GrowArrow(a2), FadeIn(t2), run_time=0.7)
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep08/fennec", height=5.2).move_to([0, 0.35, 0])
        self.say("사막여우는 몸에 비해 귀가 커요", "사막여우예요. 몸에 비해 귀가 아주 커요.")
        self.play(FadeIn(ph), run_time=0.7)
        self.pause_screen(5, "큰 귀는 어떤 점이 좋을까요?")
        r1 = F.ring(ph, P["fox_earL"], r=0.7)
        r2 = F.ring(ph, P["fox_earR"], r=0.7)
        self.say(f"큰 귀로 {o('몸속의 열을 내보내요')}", "사막여우는 큰 귀로 몸속의 열을 내보내요.")
        self.play(Create(r1), Create(r2), run_time=0.7)
        self.say(f"그리고 {g('작은 소리도 잘 들어요')}", "그리고 작은 소리도 잘 들어요.")
        self.settle()
        clear_stage(self)
        tort = K.card("이집트땅거북", 4.2, 3.2, 36).move_to([-3.2, 0.7, 0])
        scor = K.card("사막전갈", 4.2, 3.2, 36).move_to([3.2, 0.7, 0])
        t1 = M(f"몸이 작고 등껍질이 {o('돔 모양')}", 34).next_to(tort, DOWN, buff=0.25)
        t2 = M(f"돌 아래나 틈에 {o('몸을 숨겨요')}", 34).next_to(scor, DOWN, buff=0.25)
        self.say(f"이집트땅거북은 등껍질이 {o('돔 모양')}으로 높이 솟아 있어요",
                 "이집트땅거북은 몸이 작고, 등껍질이 돔 모양으로 높이 솟아 있어요.")
        self.play(FadeIn(tort), FadeIn(t1), run_time=0.7)
        self.say(f"사막전갈은 돌 아래나 틈 사이에 {o('숨어')} 살아요", "사막전갈은 돌 아래나 틈 사이에 몸을 숨기며 살아요.")
        self.play(FadeIn(scor), FadeIn(t2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 어디에 살까요? ──
    def sort_home(self):
        self.section("분류해요")
        names = ["북극곰", "순록", "하프물범", "펭귄", "낙타", "사막여우", "사막전갈", "이집트땅거북"]
        order = [4, 0, 6, 2, 5, 3, 7, 1]
        cards = VGroup(*[K.card(names[i], 2.6, 2.0, 30) for i in order]).arrange_in_grid(2, 4, buff=0.25).move_to([0, 0.5, 0])
        self.say("어디에 살까요? 사는 곳에 따라 나누어 봐요", "이 동물들은 어디에 살까요? 극지방과 사막으로 나누어 봐요.")
        self.play(FadeIn(cards, lag_ratio=0.08), run_time=1.2)
        self.pause_screen(5, "극지방? 사막?")
        pb = K.bin_box("극지방", 6.6, 4.6, BLUE).move_to([-3.45, 0.1, 0])
        db = K.bin_box("사막", 6.6, 4.6, ORANGE).move_to([3.45, 0.1, 0])
        self.play(FadeIn(pb), FadeIn(db), cards.animate.scale(0.75), run_time=0.6)
        byname = {names[i]: c for i, c in zip(order, cards)}
        anims = []
        for j, n in enumerate(names):
            x0 = -3.45 if j < 4 else 3.45
            k = j % 4
            anims.append(byname[n].animate.move_to([x0 + (-1.5 if k % 2 == 0 else 1.5), 0.85 - (k // 2) * 1.75, 0]))
        self.play(*anims, run_time=1.4)
        self.say(f"북극곰·순록·하프물범·펭귄은 {b_('극지방')}에 살아요", "북극곰, 순록, 하프물범, 펭귄은 극지방에 살아요.")
        self.say(f"낙타·사막여우·사막전갈·이집트땅거북은 {o('사막')}에 살아요", "낙타, 사막여우, 사막전갈, 이집트땅거북은 사막에 살아요.")
        self.say(f"몹시 춥거나 건조한 곳에도 {g('여러 동물')}이 살아요", "몹시 춥거나 건조한 곳에도 여러 동물이 살고 있어요.")
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        c1 = K.text_card([f"극지방에 사는 동물은 두꺼운 {o('지방')}이 있거나 {o('촘촘한 털')}이 나 있어",
                          f"{b_('추위를 견딜')} 수 있어요"], size=38).move_to([0, 1.3, 0])
        c2 = K.text_card([f"사막에 사는 동물은 {o('큰 귀')}가 있거나 {o('혹')}에 지방을 저장해",
                          f"{g('건조한 사막의 환경을 견딜')} 수 있어요"], size=38).move_to([0, -0.9, 0])
        self.say(f"극지방 동물은 {o('지방')}·{o('털')}로 추위를 견뎌요",
                 "극지방에 사는 동물은 두꺼운 지방이 있거나 촘촘한 털이 나 있어 추위를 견딜 수 있어요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.6)
        self.say(f"사막 동물은 {o('큰 귀')}·{o('혹')}으로 건조한 환경을 견뎌요",
                 "사막에 사는 동물은 큰 귀가 있거나 혹에 지방을 저장해 건조한 사막의 환경을 견딜 수 있어요.")
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        q = K.text_card(["빛이 거의 없는 동굴이나 깊은 바닷속에 사는 동물은", "어떤 특징이 있을까요?"], size=40).move_to([0, 1.6, 0])
        self.say("빛이 거의 없는 곳에 사는 동물은 어떤 특징이 있을까요?",
                 "생각해 봐요. 빛이 거의 없는 동굴이나 깊은 바닷속에 사는 동물은 어떤 특징이 있을까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.pause_screen(5, "친구와 이야기해 봐요")
        ex = VGroup(M(f"예) 동굴의 박쥐는 {o('초음파')}로 먹이의 위치를 알아내요", 36),
                    M(f"예) 깊은 바닷속 초롱아귀는 {o('빛을 내는 촉수')}로 먹이를 꾀어요", 36)).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        ex.move_to([0, -0.6, 0])
        self.say("박쥐는 초음파로, 초롱아귀는 빛을 내는 촉수로 먹이를 찾아요",
                 "예를 들어 동굴에 사는 박쥐는 초음파로 먹이의 위치를 알아내요. 깊은 바닷속에 사는 초롱아귀는 빛을 내는 촉수로 먹이를 꾀어 잡아먹어요.")
        self.play(FadeIn(ex, lag_ratio=0.3), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        q = K.text_card(["• 촘촘하게 털이 나 있어요.  • 몸에 두꺼운 지방이 있어요.", "• 매우 추운 지역에 살아요."], size=38).move_to([0, 1.55, 0])
        self.say("다음 설명에 해당하는 동물은?", "다음 설명에 해당하는 동물은 어느 것일까요?")
        self.play(FadeIn(q), run_time=0.5)
        opts = ["① 낙타", "② 북극곰", "③ 사막전갈", "④ 사막여우", "⑤ 이집트땅거북"]
        ts = VGroup(*[T(s, 36) for s in opts]).arrange(RIGHT, buff=0.38).move_to([0, -0.3, 0])
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=0.8)
        self.pause_screen(5, "어느 동물일까요?")
        self.play(Circumscribe(ts[1], color=GREEN), ts[1].animate.set_color(GREEN), run_time=1.0)
        self.say(f"정답은 ② {g('북극곰')}이에요", "정답은 2번 북극곰이에요. 북극곰은 두꺼운 지방이 있어 체온을 유지하기에 좋아요.")
        self.settle()
        clear_stage(self)
        stm = [("순록은 발굽이 넓고 편평해 눈에 발이 잘 빠지지 않는다.", True),
               ("사막여우는 몸에 비해 작은 귀가 있어 열을 잘 지킨다.", False)]
        rows = VGroup(*[T(f"{i + 1}. {t}", 36) for i, (t, _) in enumerate(stm)]).arrange(DOWN, buff=0.7, aligned_edge=LEFT).move_to([-0.5, 0.8, 0])
        self.say("맞으면 ○, 틀리면 ×를 골라요", "맞으면 동그라미, 틀리면 가위표를 골라요.")
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=0.8)
        self.pause_screen(5, "○일까요, ×일까요?")
        marks = VGroup(*[K.ox_mark(ok, 0.26).next_to(rows[i], RIGHT, buff=0.4) for i, (_, ok) in enumerate(stm)])
        self.play(FadeIn(marks, lag_ratio=0.4), run_time=0.8)
        fix = M(f"사막여우는 몸에 비해 {o('큰 귀')}로 몸속의 열을 내보내요", 38).move_to([0, -1.4, 0])
        self.say(f"1번 ○, 2번 × — 사막여우는 {o('큰 귀')}로 열을 내보내요",
                 "1번은 맞아요. 2번은 틀린 말이에요. 사막여우는 몸에 비해 큰 귀로 몸속의 열을 내보내요.")
        self.play(FadeIn(fix), run_time=0.5)
        self.settle()
        clear_stage(self)
