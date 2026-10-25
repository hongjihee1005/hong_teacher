"""「과학 원리 돋보기」 5학년 1화 — 지층은 어떤 특징이 있을까? (5-1 1단원 지층과 화석 2차시, 화 코드 5-1-1-a)

바탕: grade5/science/sem1/u1-1.html(원본 _build_tb/src/u1-1.html) — 도입(무지개떡: 줄무늬·여러 겹·층마다 색깔),
지층의 뜻(자갈·모래·진흙 등 퇴적물이 쌓여 층을 이룸, 산비탈·바닷가 절벽), 지층 카드 6장 관찰(유성펜 선 긋기, 모양·두께·색깔),
모양으로 분류(수평 ①④ · 휘어진 ②③ · 끊어진 ⑤⑥), 세 지층 공통점, 생각+(샌드위치·교과서·이불), 한눈에 쏙.
사진 대신 그린 그림(앱과 같음).
최종: ./make_final.sh s5ep01
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, SurroundingRectangle)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


# 카드 ①~⑥: (모양, 변형, 설명)
CARDS = [("flat", 0, "수평", "얇은 층과 두꺼운 층이 섞여 있어요", "갈색, 회색, 검은색 등의 층이 있어요"),
         ("fold", 0, "휘어진", "층마다 두께가 조금씩 달라요", "여러 가지 색깔의 층이 있어요"),
         ("fold", 1, "휘어진", "층마다 두께가 조금씩 달라요", "층마다 색깔이 조금씩 달라요"),
         ("flat", 2, "수평", "층이 얇고, 두께가 조금씩 달라요", "층마다 색깔이 조금씩 달라요"),
         ("fault", 0, "끊어진", "얇은 층과 두꺼운 층이 섞여 있어요", "층마다 색깔이 달라요"),
         ("fault", 1, "끊어진", "층마다 두께가 조금씩 달라요", "층마다 색깔이 달라요")]
NUM = "①②③④⑤⑥"


def soccer(r=0.7):
    import numpy as np
    from manim import RegularPolygon, Line
    ball = K.Circle(radius=r, fill_color="#FFFFFF", fill_opacity=1, stroke_color=INK, stroke_width=5)
    pent = RegularPolygon(5, fill_color=INK, fill_opacity=1, stroke_width=0).scale(r * 0.3).rotate(np.pi / 2)
    g = VGroup(ball, pent)
    for k in range(5):
        a = np.pi / 2 + k * 2 * np.pi / 5
        g.add(Line([r * 0.3 * np.cos(a), r * 0.3 * np.sin(a), 0], [r * np.cos(a), r * np.sin(a), 0],
                   stroke_color=INK, stroke_width=4))
    return g


class S5Ep01(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 1
    EP_TITLE = "지층은 어떤 특징이 있을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.classify()
        self.compare()
        self.around()
        self.summary()
        self.closing(f"지층은 여러 층으로 이루어져 {o('줄무늬')}가 보이고\n모양이 {g('다양')}해요",
                     next_preview="5학년 2화 · 지층은 어떻게 만들어질까?")
        self.wait(0.5)

    # ── 궁금해요: 무지개떡 ──
    def intro(self):
        self.section("궁금해요")
        cake = K.rainbow_cake(4.2).move_to([0, 0.3, 0])
        cap = T("여러 색의 떡을 겹겹이 쌓은 무지개떡", 32).move_to([0, 2.5, 0])
        self.say("무지개떡은 어떤 모습인가요?", "무지개떡을 본 적이 있나요? 무지개떡은 어떤 모습인가요?")
        self.play(FadeIn(cake, shift=UP * 0.3), FadeIn(cap), run_time=0.8)
        self.say(f"{o('줄무늬')}가 보이고, 떡이 {o('여러 겹')}으로 쌓여 있어요",
                 "줄무늬가 보이고, 떡이 여러 겹으로 쌓여 있어요.")
        self.play(Indicate(cake[1], color=ORANGE, scale_factor=1.05), run_time=1.0)
        self.say(f"층마다 {o('색깔')}이 달라요", "그리고 층마다 색깔이 달라요.")
        self.settle()
        self.play(cake.animate.scale(0.6).move_to([-4.3, 0.2, 0]), FadeOut(cap), run_time=0.8)
        st = K.strata("flat", [(K.LAYER_COLS[i], t, x) for i, (t, x) in enumerate(
            [(1.0, "gravel"), (0.7, "sand"), (1.2, "mud"), (0.6, "sand"), (1.0, "gravel"), (0.8, "mud")])],
            w=6.4, h=3.6, tex=True).move_to([2.2, 0.3, 0])
        self.play(FadeIn(st), run_time=0.8)
        self.say(f"퇴적물이 쌓여 층을 이루는 것을 {r('지층')}이라고 해요",
                 "땅에서도 이런 모습을 볼 수 있어요. 자갈, 모래, 진흙 등의 다양한 퇴적물이 쌓여 층을 이루는 것을 지층이라고 해요.")
        nm = K.label("지층", RED, 40).next_to(st, UP, buff=0.15)
        self.play(FadeIn(nm), run_time=0.5)
        self.say(f"지층은 {o('산비탈')}이나 {o('바닷가 절벽')}에서 볼 수 있어요",
                 "지층은 산비탈이나 바닷가의 절벽 등에서 볼 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 관찰해요: 지층 카드 6장 ──
    def observe(self):
        self.section("관찰해요")
        cards = VGroup()
        for i, (k, v, *_rest) in enumerate(CARDS):
            c = K.card(k, w=3.3, h=1.85, title=f"카드 {NUM[i]}", size=28, seed=i, var=v)
            cards.add(c)
        cards.arrange_in_grid(rows=2, cols=3, buff=(0.45, 0.3)).move_to([0, 0.05, 0])
        self.cards = cards
        self.say("지층 카드로 여러 가지 지층을 관찰해요",
                 "지층 카드로 여러 가지 지층을 관찰해 봐요. 사진 대신 그림으로 나타냈어요.")
        self.play(FadeIn(cards, lag_ratio=0.12), run_time=1.4)
        self.say(f"유성펜으로 층의 {r('줄무늬')}를 따라 선을 그어요",
                 "카드에 유성펜으로 층의 줄무늬를 따라 선을 그어 봐요.")
        pens = VGroup(*[K.pen_lines(c.strata) for c in cards])
        self.play(*[Create(p) for p in pens], run_time=2.2)
        self.pens = pens
        self.say(f"지층의 {o('모양')}, 층의 {o('두께')}, {o('색깔')}을 살펴봐요",
                 "선을 그으니 줄무늬가 잘 보여요. 지층의 모양, 층의 두께, 색깔을 살펴봐요.")
        self.settle()
        # 카드 ① 크게
        others = VGroup(*[VGroup(c, p) for j, (c, p) in enumerate(zip(cards, pens)) if j != 0])
        one = VGroup(cards[0], pens[0])
        self.play(FadeOut(others), one.animate.scale(1.35).move_to([-3.6, 0.4, 0]), run_time=0.8)
        k, v, shape, thick, col = CARDS[0]
        info = K.text_card([f"모양: {o('수평')}으로 쌓여 있어요", f"두께: {thick}", f"색깔: {col}"],
                           w=6.6, size=30).move_to([3.4, 0.4, 0])
        self.say("카드 ①은 지층이 수평으로 쌓여 있어요",
                 "카드 일을 볼까요? 지층이 수평으로 쌓여 있고, 얇은 층과 두꺼운 층이 섞여 있어요. 갈색, 회색, 검은색 등의 층이 있어요.")
        self.play(FadeIn(info, shift=LEFT * 0.3), run_time=0.7)
        self.say(f"지층마다 모양, 두께, 색깔이 {o('서로 달라요')}",
                 "카드 여섯 장을 모두 관찰하면, 지층마다 모양, 층의 두께, 색깔이 서로 달라요.")
        self.settle()
        clear_stage(self)

    # ── 분류해요: 모양으로 ──
    def classify(self):
        self.section("분류해요")
        names = [("수평인 지층", ORANGE), ("휘어진 지층", "#2F6FD6"), ("끊어진 지층", GREEN)]
        bins = VGroup(*[K.bin_box(n, 4.3, 4.4, c, 32) for n, c in names]).arrange(RIGHT, buff=0.25).move_to([0, 0.35, 0])
        self.say("지층의 모양에 따라 카드를 분류해 봐요",
                 "이번에는 지층의 모양에 따라 카드를 분류해 봐요. 선을 그은 줄무늬가 곧은지, 휘었는지, 중간에 끊어졌는지 봐요.")
        small = []
        for i, (k, v, *_r) in enumerate(CARDS):
            c = K.card(k, w=2.9, h=1.55, title=f"카드 {NUM[i]}", size=24, seed=i, var=v)
            c.add(K.pen_lines(c.strata, sw=4))
            small.append(c)
        row = VGroup(*small).arrange(RIGHT, buff=0.12).scale(0.72).move_to([0, 0.35, 0])
        self.play(FadeIn(row, lag_ratio=0.1), run_time=0.8)
        self.pause_screen(6, "카드를 어떻게 나눌 수 있을까요?")
        grp = {"flat": 0, "fold": 1, "fault": 2}
        slots = {0: [], 1: [], 2: []}
        for i, (k, *_r) in enumerate(CARDS):
            slots[grp[k]].append(i)
        moves = []
        for bi, idx in slots.items():
            for j, i in enumerate(idx):
                moves.append(small[i].animate.move_to(bins[bi].box.get_center() + [0, 0.7 - j * 1.75, 0]))
        self.play(FadeIn(bins), run_time=0.6)
        self.say(f"수평인 모양 ①, ④ · 휘어진 모양 ②, ③ · 끊어진 모양 ⑤, ⑥",
                 "수평인 모양은 카드 일과 사, 휘어진 모양은 카드 이와 삼, 끊어진 모양은 카드 오와 육이에요.")
        self.play(*moves, run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 여러 가지 지층: 공통점 ──
    def compare(self):
        self.section("여러 가지 지층")
        data = [("flat", "수평인 지층", "경상남도 고성군"), ("fold", "휘어진 지층", "전북특별자치도 군산시"),
                ("fault", "끊어진 지층", "전라남도 여수시")]
        cs = VGroup()
        for i, (k, nm, place) in enumerate(data):
            c = K.card(k, w=3.9, h=2.6, seed=i)
            t1 = T(nm, 32).next_to(c, DOWN, buff=0.15)
            t2 = T(f"({place})", 24, SOFT).next_to(t1, DOWN, buff=0.08)
            cs.add(VGroup(c, t1, t2))
        cs.arrange(RIGHT, buff=0.45).move_to([0, 0.5, 0])
        self.say("세 지층을 비교해 보고, 특징을 이야기해요",
                 "우리나라 여러 곳에서 볼 수 있는 세 지층이에요. 수평인 지층, 휘어진 지층, 끊어진 지층을 비교해 보고 특징을 이야기해 봐요.")
        self.play(FadeIn(cs, lag_ratio=0.15), run_time=1.2)
        self.pause_screen(6, "세 지층에서 함께 볼 수 있는 특징은?")
        pens = VGroup(*[K.pen_lines(c[0].strata) for c in cs])
        self.say(f"모두 {o('여러 층')}으로 이루어져 {o('줄무늬')}가 보여요",
                 "세 지층은 모두 여러 층으로 이루어져 있고, 줄무늬가 보여요.")
        self.play(*[Create(p) for p in pens], run_time=1.5)
        self.say(f"층마다 {o('두께')}와 {o('색깔')}이 달라요", "그리고 층마다 두께와 색깔이 달라요.")
        self.settle()
        self.say(f"하지만 지층의 모양은 {r('모두 같지 않아요')}",
                 "하지만 세 지층의 모양은 모두 같지 않아요. 수평인 지층, 휘어진 지층, 끊어진 지층처럼 지층의 모양은 다양해요.")
        self.play(*[Indicate(c[1], color=RED) for c in cs], run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각+ : 층을 이루는 것 ──
    def around(self):
        self.section("생각+")
        items = [(K.sandwich(2.0), "샌드위치", True), (K.books(1.9), "서랍 속에 쌓아 둔 교과서", True),
                 (K.quilts(2.0), "이불장에 개어 쌓은 이불", True),
                 (soccer(), "축구공", False)]
        cols = VGroup()
        for pic, nm, ok in items:
            K.fit(pic, 2.3, 1.6)
            t = T(nm, 26).next_to(pic, DOWN, buff=0.25)
            if t.width > 3.0:
                t.scale_to_fit_width(3.0)
            cols.add(VGroup(pic, t))
        cols.arrange(RIGHT, buff=0.55).move_to([0, 0.5, 0])
        for c in cols:
            c[1].move_to([c[1].get_x(), -0.75, 0])
        self.say("우리 주변에서 지층처럼 층을 이루고 있는 것은?",
                 "우리 주변에서 지층처럼 층층이 쌓여 있는 것을 찾아볼까요?")
        self.play(FadeIn(cols, lag_ratio=0.15), run_time=1.0)
        self.pause_screen(5, "층층이 쌓여 있는 것은 무엇일까요?")
        marks = VGroup()
        for c, (_, _, ok) in zip(cols, items):
            marks.add(K.ox_mark(ok, 0.35).next_to(c[1], DOWN, buff=0.25))
        self.say(f"샌드위치, 교과서, 이불은 {g('층층이')} 쌓여 있어요",
                 "샌드위치, 서랍 속에 쌓아 둔 교과서, 이불장에 개어 쌓은 이불은 여러 가지가 층층이 쌓인 모습이 지층과 비슷해요. 축구공은 층을 이루고 있지 않아요.")
        self.play(FadeIn(marks, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        cs = VGroup(*[K.card(k, w=2.6, h=1.6, seed=i) for i, k in enumerate(("flat", "fold", "fault"))]).arrange(RIGHT, buff=0.35)
        cs.move_to([0, 1.65, 0])
        card = K.text_card([f"지층은 여러 층으로 이루어져 {o('줄무늬')}가 보이고,",
                            f"모양이 {g('다양')}합니다."], w=11.5, size=42).move_to([0, -0.85, 0])
        self.say(f"지층은 {o('줄무늬')}가 보이고, 모양이 {g('다양')}해요",
                 "지층은 여러 층으로 이루어져 줄무늬가 보이고, 모양이 다양해요.")
        self.play(FadeIn(cs, lag_ratio=0.1), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
