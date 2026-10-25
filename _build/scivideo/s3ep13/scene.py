"""「과학 원리 돋보기」 3학년 13화 — 사막과 높은 산의 식물 (3-1 3단원 식물의 생활 5차시, 화 코드 3-1-3-d)

바탕: grade3/science/sem1/u3-4.html — 사막 ⭕❌(비가 거의 내리지 않아 건조 ⭕ / 언제나 뜨거운 곳 ❌: 밤에는 추움, 기준은 비의 양),
알로에 실험실(안전 장갑, 가장자리 가시 / 잎이 두껍고 표면이 매끈하며 광택, 가장자리에 가시 / 집게로 잡고 플라스틱 칼로 자름, 먹지 않음 /
단면: 껍질이 두껍고 안쪽이 미끌미끌하고 축축, 휴지가 젖음 / 까닭: 두꺼운 잎에 물 저장, 두꺼운 껍질이 물이 빠져나가는 것을 막음, 가시가 동물에게 먹히는 것을 막음),
선인장(줄기가 굵어 물 저장, 잎이 가시 모양), 뿌리(얕고 넓게 퍼진 뿌리 · 깊게 뻗은 뿌리),
높은 산(한라산 꼭대기: 기온이 낮고 바람이 셈 / 한라솜다리·암매(키 3~5 cm, 모여서)·눈잣나무(줄기가 누워서) / 강한 바람 실험),
한눈에 쏙(사막 식물은 잎이 두껍거나 줄기가 굵음), 생각+(눈잣나무를 산 아래에서 키우면 위로 곧게).
최종: ./make_final.sh s3ep13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, Line, RoundedRectangle, VGroup,
                   Circumscribe, Transform, DashedLine, Rectangle, Circle, Ellipse, Polygon, Rotate, Wiggle, there_and_back)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
from kit_s3u13 import (DARK_GREEN, LEAF_EDGE, SAND, aloe, aloe_section, ammae, cactus, dune, mountain, nunjat,
                       roots_shallow_deep, small_herb, soil, sun, tree, wind_lines)


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S3Ep13(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 13
    EP_TITLE = "사막과 높은 산의 식물"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.desert()
        self.aloe_lab()
        self.cactus_roots()
        self.mountain_plants()
        self.summary()
        self.think()
        self.closing(f"사막 식물은 {o('잎이 두껍거나 줄기가 굵어')} 물을 저장하고,\n높은 산 식물은 {g('키가 작거나 줄기가 누워')} 바람을 견뎌요",
                     next_preview="3학년 14화 · 식물의 특징을 본뜬 생활용품")
        self.wait(0.5)

    # ── 사막 ──
    def desert(self):
        self.section("궁금해요")
        sd = Rectangle(width=13.6, height=0.6, fill_color=SAND, fill_opacity=1, stroke_width=0).move_to([0, -2.2, 0])
        d1 = dune(7, 1.0).move_to([-3.2, -1.45, 0])
        s_ = sun(0.5).move_to([5.0, 0.4, 0])
        c = cactus(2.0).shift([1.0, -1.9, 0])
        self.say("물이 부족한 곳에서 식물은 어떻게 살까요?", "비가 아주 적게 내리는 사막에도 식물이 살아요. 어떻게 살까요?")
        self.play(FadeIn(sd), FadeIn(d1), FadeIn(s_), FadeIn(c), run_time=1.0)
        q1 = M(f"① 사막은 일 년 내내 비가 거의 내리지 않아 건조해요   {g('맞아요')}", 34).move_to([0, 2.55, 0])
        q2 = M("② 사막은 언제나 뜨거운 곳이에요", 34).move_to([0, 1.85, 0]).align_to(q1, LEFT)
        self.say(f"사막은 비가 거의 내리지 않아 {o('건조')}해요", "사막은 일 년 내내 비가 거의 내리지 않아 건조한 곳이에요.")
        self.play(FadeIn(q1), run_time=0.5)
        self.say("사막은 언제나 뜨거운 곳일까요?", "그럼 사막은 언제나 뜨거운 곳일까요?")
        self.play(FadeIn(q2), run_time=0.5)
        self.pause_screen(4, "맞을까요, 틀릴까요?")
        x = T("틀려요", 34, RED).next_to(q2, RIGHT, buff=0.5)
        self.play(FadeIn(x, scale=1.5), run_time=0.4)
        self.say(f"생각 바로잡기: 사막은 {r('밤에는 추워요')} — 기준은 {o('비의 양')}",
                 "아니에요. 사막은 밤에는 추워요. 사막의 기준은 기온이 아니라 비의 양이에요.")
        self.settle()
        clear_stage(self)

    # ── 알로에 ──
    def aloe_lab(self):
        self.section("관찰해요")
        a = aloe(2.2).shift([-3.6, -1.6, 0])
        safe = M(f"안전 장갑 착용 · 가장자리 {r('가시')} 조심 · 실험에 쓴 알로에는 {r('먹지 않아요')}", 30).move_to([0.6, 2.65, 0])
        self.say("사막에 사는 알로에를 관찰해요", "알로에를 관찰해 봐요. 가장자리에 가시가 있으니 안전 장갑을 끼고, 실험에 쓴 알로에는 먹지 않아요.")
        self.play(FadeIn(a), FadeIn(safe), run_time=0.8)
        f1 = tag("잎이 두꺼워요", LEAF_EDGE, 36).move_to([2.6, 1.3, 0])
        f2 = tag("표면이 매끈하고 광택이 나요", LEAF_EDGE, 36).move_to([2.6, 0.3, 0])
        f3 = tag("가장자리에 가시가 있어요", RED, 36).move_to([2.6, -0.7, 0])
        self.say(f"잎이 {o('두껍고')} 표면이 매끈하며 광택이 나요", "알로에 잎은 두껍고, 표면이 매끈하며 광택이 나요.")
        self.play(FadeIn(f1), FadeIn(f2), run_time=0.6)
        self.say(f"잎의 가장자리에는 {r('가시')}가 있어요", "잎의 가장자리에는 가시가 있어요.")
        self.play(FadeIn(f3), run_time=0.5)
        self.settle()
        clear_stage(self)
        self.section("실험해요")
        lf = Polygon([-5.6, 0.2, 0], [-1.2, 0.55, 0], [-0.4, 0.3, 0], [-1.2, 0.0, 0], [-5.6, -0.25, 0], fill_color="#6FBF8A",
                     fill_opacity=1, stroke_color="#2F6B48", stroke_width=4)
        tongs = VGroup(Line([-6.6, 1.0, 0], [-5.2, 0.35, 0], stroke_color=SOFT, stroke_width=8),
                       Line([-6.6, -0.9, 0], [-5.2, -0.4, 0], stroke_color=SOFT, stroke_width=8))
        knife = VGroup(Polygon([-2.8, 1.6, 0], [-2.55, 1.6, 0], [-2.55, 0.8, 0], [-2.8, 0.95, 0], fill_color="#DDE6EE", fill_opacity=1, stroke_color=SOFT, stroke_width=3),
                       RoundedRectangle(corner_radius=0.06, width=0.3, height=0.8, fill_color=BLUE, fill_opacity=1, stroke_width=0).move_to([-2.68, 2.0, 0]))
        self.say("집게로 잡고 플라스틱 칼로 잘라요", "알로에를 집게로 잡고 플라스틱 칼로 잘라요.")
        self.play(FadeIn(lf), FadeIn(tongs), FadeIn(knife), run_time=0.7)
        self.play(knife.animate.shift(DOWN * 1.35), run_time=0.6)
        box = RoundedRectangle(corner_radius=0.2, width=3.6, height=2.4, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=3).move_to([3.2, 0.5, 0])
        qm = T("?", 80, SOFT).move_to(box)
        lab = T("자른 면(단면)", 32, INK).next_to(box, DOWN, buff=0.2)
        self.say("자른 면을 관찰해요", "자른 면을 관찰해요.")
        self.play(FadeIn(box), FadeIn(qm), FadeIn(lab), run_time=0.5)
        self.pause_screen(5, "알로에 잎 속은 어떨까요?")
        sec = aloe_section(1.15).move_to(box)
        self.play(FadeOut(qm), FadeIn(sec, scale=0.8), run_time=0.7)
        skin = tag("껍질이 두꺼워요", "#2F6B48", 30).move_to([3.2, 2.45, 0])
        self.say(f"껍질이 {o('두껍고')} 안쪽이 {o('미끌미끌하고 축축해요')}",
                 "알로에 잎은 껍질이 두껍고, 껍질 안쪽이 젤리처럼 미끌미끌하고 축축해요.")
        self.play(FadeIn(skin), run_time=0.4)
        tissue = RoundedRectangle(corner_radius=0.05, width=1.5, height=1.5, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=2).move_to([6.0, 0.5, 0])
        wet = Circle(radius=0.45, fill_color="#BFE3F5", fill_opacity=0.9, stroke_width=0).move_to(tissue)
        self.say(f"휴지를 대면 젖어요 — 잎 속에 {o('물')}이 많아요", "단면에 휴지를 대면 휴지가 젖어요. 잎 속에 물이 많이 들어 있어요.")
        self.play(FadeIn(tissue), run_time=0.3)
        self.play(FadeIn(wet, scale=0.3), run_time=0.8)
        self.settle()
        clear_stage(self)
        self.section("정리해요")
        a2 = aloe(2.0).shift([-4.6, -1.5, 0])
        rs = VGroup(M(f"① 잎이 두꺼워 {o('물을 많이 저장')}해요", 36),
                    M(f"② 두꺼운 껍질이 물이 {o('빠져나가는 것')}을 막아요", 36),
                    M(f"③ 가시가 물이 필요한 동물에게 {o('먹히는 것')}을 막아요", 36)).arrange(DOWN, aligned_edge=LEFT, buff=0.45).move_to([1.6, 0.6, 0])
        self.play(FadeIn(a2), run_time=0.5)
        nn = ["알로에가 사막에서 살 수 있는 까닭! 잎이 두꺼워서 물을 많이 저장할 수 있어요.", "껍질이 두꺼워 물이 밖으로 빠져나가는 것을 막아 줘요.",
              "잎 가장자리의 가시는 물이 필요한 동물에게 먹히는 것을 막아 줘요."]
        subs = [f"잎이 두꺼워 {o('물을 많이 저장')}해요", f"두꺼운 껍질이 물이 {o('빠져나가는 것')}을 막아요",
                f"가시가 동물에게 {o('먹히는 것')}을 막아요"]
        for row, sb, n in zip(rs, subs, nn):
            self.say(sb, n)
            self.play(FadeIn(row, shift=RIGHT * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 선인장과 뿌리 ──
    def cactus_roots(self):
        self.section("조사해요")
        gr = Rectangle(width=13.6, height=2.0, fill_color=SAND, fill_opacity=1, stroke_width=0).move_to([0, -1.5, 0])
        c = cactus(2.4).shift([-3.6, -0.5, 0])
        t1 = M(f"줄기가 {o('굵어')} 줄기에 물을 저장해요", 30).move_to([-2.0, 2.1, 0], aligned_edge=LEFT)
        t2 = M(f"잎이 {o('가시 모양')}이라 물이 빠져나가는 것을 막아요", 30).move_to([-2.0, 1.4, 0], aligned_edge=LEFT)
        self.say(f"선인장은 줄기가 {o('굵어')} 물을 저장해요", "선인장은 줄기가 굵어 줄기에 물을 저장할 수 있어요.")
        self.play(FadeIn(gr), FadeIn(c), FadeIn(t1), run_time=0.8)
        self.say(f"잎은 {o('가시 모양')}이에요", "선인장의 잎은 가시 모양이어서, 물이 밖으로 빠져나가는 것을 막아 줘요.")
        self.play(FadeIn(t2), Indicate(c, scale_factor=1.05, color=None), run_time=0.8)
        rt = roots_shallow_deep(2.2).stretch(0.8, 1).shift([-3.6, -0.5, 0])
        self.play(Create(rt), run_time=1.0)
        a1 = tag("얕고 넓게 퍼진 뿌리", ORANGE, 30).move_to([1.2, -0.25, 0])
        a2 = tag("땅속 깊게 뻗은 뿌리", BLUE, 30).move_to([-0.6, -1.7, 0])
        self.say(f"비가 조금 내리면 {o('얕고 넓은 뿌리')}가 빠르게 흡수해요",
                 "뿌리도 살펴볼까요? 비가 조금 내리면, 얕고 넓게 퍼진 뿌리가 땅 위쪽에 스며든 물을 빠르게 흡수해요.")
        self.play(FadeIn(a1), run_time=0.4)
        self.say(f"비가 오지 않아도 {b_('깊은 뿌리')}가 깊은 곳의 물을 흡수해요",
                 "비가 오지 않아도, 땅속 깊게 뻗은 뿌리는 땅속 깊은 곳에 있는 물을 흡수할 수 있어요.")
        self.play(FadeIn(a2), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 높은 산 ──
    def mountain_plants(self):
        self.section("높은 산")
        mt = mountain(7.0, 3.6).shift([-3.0, -2.3, 0])
        info = VGroup(M(f"한라산 꼭대기 부근", 36), M(f"기온이 {o('낮고')} 바람이 {o('세게')} 불어요", 36)).arrange(DOWN, buff=0.2).move_to([3.4, 1.9, 0])
        self.say("한라산처럼 높은 산에는 어떤 식물이 살까요?", "한라산처럼 높은 산에는 어떤 식물이 살까요? 꼭대기 부근은 기온이 낮고 바람이 세게 불어요.")
        self.play(FadeIn(mt), FadeIn(info), run_time=0.8)
        self.settle()
        self.play(FadeOut(mt), FadeOut(info), run_time=0.5)
        gr = soil(y=-1.6)
        som = VGroup(*[small_herb(0.8, "#FFFFFF", i) for i in range(3)]).arrange(RIGHT, buff=0.05, aligned_edge=DOWN).shift([-4.6, -1.6, 0])
        am = ammae(11).scale(2.4).shift([-0.6, -1.6, 0])
        nj = nunjat(3.4).shift([2.4, -1.6, 0])
        n1 = T("한라솜다리", 32, INK).move_to([-4.6, 0.1, 0])
        n2 = T("암매", 32, INK).move_to([-0.6, 0.1, 0])
        n3 = T("눈잣나무", 32, INK).move_to([4.1, 0.1, 0])
        self.add(gr)
        self.say(f"한라솜다리는 {o('키가 작아요')}", "한라산에 사는 한라솜다리는 키가 작아요.")
        self.play(FadeIn(gr), FadeIn(som), FadeIn(n1), run_time=0.6)
        self.say(f"암매는 키가 3~5 cm이고 {o('모여서')} 자라요", "암매는 키가 3에서 5센티미터쯤이고, 바위틈에서 모여서 자라요.")
        self.play(FadeIn(am), FadeIn(n2), run_time=0.6)
        self.say(f"눈잣나무는 줄기가 {o('누워서')} 자라요", "눈잣나무는 높은 산에서 줄기가 누워서 자라요.")
        self.play(FadeIn(nj), FadeIn(n3), run_time=0.6)
        self.settle()
        self.play(FadeOut(VGroup(som, am, n1, n2)), run_time=0.4)
        tall = tree(3.6, DARK_GREEN).shift([-2.6, -1.6, 0])
        tt = T("키 큰 나무", 30, INK).move_to([-2.6, 2.4, 0])
        self.say("강한 바람이 불면 어떻게 될까요?", "강한 바람이 불면 어떻게 될까요?")
        self.play(FadeIn(tall), FadeIn(tt), run_time=0.6)
        wl = wind_lines(-6.8, (0.2, 1.0, 1.8), 2.2)
        foot = np.array([-2.6, -1.6, 0])
        self.play(FadeIn(wl, shift=RIGHT * 0.8), run_time=0.5)
        for _ in range(1):
            self.play(Rotate(tall, angle=-0.16, about_point=foot), wl.animate.shift(RIGHT * 0.3), run_time=0.5)
            self.play(Rotate(tall, angle=0.16, about_point=foot), wl.animate.shift(LEFT * 0.3), run_time=0.5)
        self.say(f"키가 작거나 누워 자라면 {o('바람을 덜 받아요')}",
                 "키 큰 나무는 바람에 크게 흔들려요. 키가 작거나 줄기가 누워서 자라는 식물은 바람을 덜 받아요.")
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        box1 = RoundedRectangle(corner_radius=0.3, width=12.6, height=1.7, fill_color=PAPER, fill_opacity=1,
                                stroke_color=ORANGE, stroke_width=5).move_to([0, 1.6, 0])
        t1 = M(f"사막에 사는 식물은 잎이 {o('두껍')}거나 줄기가 {o('굵은')} 특징이 있어요", 32).move_to(box1)
        box2 = box1.copy().set_stroke(GREEN).move_to([0, -0.6, 0])
        t2 = M(f"높은 산에 사는 식물은 대부분 {g('키가 작거나 모여 살거나')}\n{g('줄기가 누워서')} 자라 낮은 기온과 센 바람을 견뎌요", 34).move_to(box2)
        self.say("한눈에 쏙 정리해요", "사막에 사는 식물은 잎이 두껍거나 줄기가 굵어요. 높은 산에 사는 식물은 대부분 키가 작거나, 모여 살거나, 줄기가 누워서 자라요.")
        self.play(FadeIn(box1), FadeIn(t1), run_time=0.7)
        self.play(FadeIn(box2), FadeIn(t2), run_time=0.7)
        self.settle()
        clear_stage(self)

    def think(self):
        self.section("생각해요")
        gr = soil(y=-1.6)
        nj = nunjat(2.6).shift([-4.6, -1.6, 0])
        l1 = T("높은 산", 32, INK).move_to([-3.3, 0.9, 0])
        l2 = T("산 아래", 32, INK).move_to([3.3, 0.9, 0])
        q = T("?", 96, SOFT).move_to([3.3, -0.5, 0])
        self.say("눈잣나무를 산 아래에서 키우면 어떻게 자랄까요?", "눈잣나무를 바람이 많이 불지 않는 산 아래에서 키우면 어떻게 자랄까요?")
        self.play(FadeIn(gr), FadeIn(nj), FadeIn(l1), FadeIn(l2), FadeIn(q), run_time=0.7)
        self.pause_screen(5, "위로 곧게? 그대로 누워서?")
        up = tree(2.8, "#2E7D4F").shift([3.3, -1.6, 0])
        self.play(FadeOut(q), FadeIn(up, shift=UP * 0.3), run_time=0.7)
        self.say(f"바람이 약한 산 아래에서는 {g('위로 곧게')} 자라요",
                 "바람이 많이 불지 않는 산 아래에서는 위로 곧게 자라요. 식물마다 특징이 달라서 모든 식물이 그렇지는 않아요.")
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'

