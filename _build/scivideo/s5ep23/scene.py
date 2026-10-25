"""「과학 원리 돋보기」 5학년 23화 — 알갱이 크기가 다른 고체 혼합물 (5-2 1단원 혼합물의 분리 3차시, 화 코드 5-2-1-b)

바탕: grade5/science/sem2/u1-2.html(원본 _build_tb/src2/u1-2.html) — 도입(마스크가 황사·먼지를 걸러 줌),
실험 1(모래와 자갈 관찰: 모양 여러 가지, 색 모래 갈색·노란색·회색·검정색 등 / 자갈 갈색·회색·검정색 등, 크기 모래 < 자갈),
실험 2(크기 차이, 양이 많으면 체), 실험 3(체 고르기: 모래 < 체의 눈 < 자갈 → 눈이 중간인 체, 붓기·흔들기 3번 → 모래는 빠져나가고 자갈은 남음, 안전),
정리·생각 바로잡기(분리한 모래·자갈도 여전히 혼합물), 생활 속 예(체로 모래와 조개, 해변 쓰레기 수거 장비, 마스크),
생각이 한눈에 2(좁쌀 < 쌀 < 팥, 눈이 작은 체·큰 체), 한눈에 쏙(알갱이의 크기 차이).
최종: ./make_final.sh s5ep23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, FadeIn, FadeOut, Indicate, VGroup, SurroundingRectangle, Transform,
                   Rotate)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep23(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 23
    EP_TITLE = "알갱이 크기가 다른 고체 혼합물"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.choose()
        self.sieve_exp()
        self.wrap()
        self.life()
        self.grains()
        self.summary()
        self.closing(f"알갱이의 {o('크기')}가 다른 고체 혼합물은\n{g('체')}를 이용해 분리할 수 있어요",
                     next_preview="5학년 24화 · 섞이지 않는 액체 혼합물")
        self.wait(0.5)

    # ── 궁금해요: 마스크 ──
    def intro(self):
        self.section("궁금해요")
        fc = K.face(False, 1.3).move_to([4.2, 0.4, 0])
        wind = T("황사 바람 →", 32, "#8A6A3A").move_to([-4.6, 2.4, 0])
        ds = K.dust(34, -6.4, -2.6, -1.3, 1.6)
        self.say("황사나 먼지가 많은 날 쓰는 마스크는 어떤 역할을 할까요?",
                 "황사나 먼지가 많은 날 쓰는 마스크는 어떤 역할을 할까요?")
        self.play(FadeIn(fc), FadeIn(wind), FadeIn(ds), run_time=0.8)
        d1 = ds.copy()
        self.say("마스크를 쓰지 않으면 먼지가 그대로 들어가요",
                 "마스크를 쓰지 않았더니 황사와 먼지가 그대로 코와 입으로 들어갔어요.")
        self.play(d1.animate.arrange_in_grid(rows=5, buff=0.08).move_to([2.9, 0.0, 0]).set_opacity(0.3), FadeOut(ds),
                  run_time=1.6)
        self.settle()
        fm = K.face(True, 1.3).move_to([4.2, 0.4, 0])
        ds2 = K.dust(34, -6.4, -2.6, -1.3, 1.6, seed=5)
        self.play(FadeOut(d1), Transform(fc, fm), FadeIn(ds2), run_time=0.7)
        self.say(f"마스크를 쓰면 먼지가 {o('마스크에 걸려요')}",
                 "마스크를 썼더니 황사와 먼지가 마스크에 걸려 들어오지 못했어요.")
        self.play(*[d.animate.move_to([2.35 - 0.12 * (i % 3), -0.6 + 1.1 * K.rnd(i, 7), 0]) for i, d in enumerate(ds2)],
                  run_time=1.6)
        card = K.text_card([f"마스크는 공기 중의 황사나 먼지를 {g('걸러 줘요')}."], size=36).move_to([-0.6, -1.85, 0])
        self.say(f"마스크는 황사나 먼지를 {g('걸러 줘요')}",
                 "마스크는 공기 중의 황사나 먼지를 걸러 줘요. 오늘은 알갱이의 크기를 이용해 분리해 봐요.")
        self.play(FadeIn(card), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 관찰해요: 모래와 자갈 ──
    def observe(self):
        self.section("관찰해요")
        plate = K.E(4.2, 1.5, "#D9E4EA", -3.6, 0.6, "#9FB6C2", 3)
        mix = VGroup(K.sand_dots(-5.3, -1.9, 0.25, 0.95, 160, 2), K.gravel(-5.0, -2.2, 0.3, 0.9, 14, 5))
        nm = T("모래와 자갈의 혼합물", 30).next_to(plate, DOWN, buff=0.2)
        self.say("모래와 자갈의 혼합물을 관찰해요",
                 "돋보기로 모래와 자갈의 모양, 색깔, 크기를 비교해 봐요.")
        self.play(FadeIn(plate), FadeIn(mix), FadeIn(nm), run_time=0.8)
        sand = VGroup(*[K.stone(-0.95 + 1.9 * K.rnd(i, 6), -0.95 + 1.9 * K.rnd(i, 7), 0.11 + 0.05 * K.rnd(i, 8), K.SANDC[i % 5], i + 40)
                        for i in range(30) if (K.rnd(i, 6) - 0.5) ** 2 + (K.rnd(i, 7) - 0.5) ** 2 < 0.2])
        z1 = K.magnifier_zoom(sand, 1.2, "돋보기로 본 모래").move_to([1.3, 0.7, 0])
        grav = VGroup(*[K.stone(x, y, 0.42 + 0.1 * K.rnd(i, 9), K.GRAVC[i % 4], i + 70)
                        for i, (x, y) in enumerate([(-0.45, 0.35), (0.45, 0.4), (-0.4, -0.45), (0.45, -0.4), (0, 0)])])
        z2 = K.magnifier_zoom(grav, 1.2, "돋보기로 본 자갈").move_to([4.9, 0.7, 0])
        self.play(FadeIn(z1, scale=0.8), FadeIn(z2, scale=0.8), run_time=0.9)
        self.settle()
        clear_stage(self)
        tb = K.result_table(["구분", "모래", "자갈"],
                            [["모양", "둥근·세모·네모 모양 등 여러 가지", "둥근·세모·네모 모양 등 여러 가지"],
                             ["색깔", "갈색, 노란색, 회색, 검정색 등", "갈색, 회색, 검정색 등"],
                             ["크기", f"자갈보다 {o('작아요')}", f"모래보다 {o('커요')}"]],
                            [1.8, 5.4, 5.4], row_h=1.0, size=28).move_to([0, 0.55, 0])
        self.say(f"모양과 색은 여러 가지, 크기는 모래가 자갈보다 {o('작아요')}",
                 "모래와 자갈 모두 알갱이의 모양과 색깔이 여러 가지예요. 모래는 자갈보다 알갱이의 크기가 작아요.")
        self.play(FadeIn(tb), run_time=0.8)
        self.play(Indicate(VGroup(tb.cells[3][1], tb.cells[3][2]), color=ORANGE), run_time=0.8)
        self.settle()
        q = K.text_card([f"가장 큰 차이는 알갱이의 {o('크기')} → 크기 차이를 이용해 분리해요.",
                         f"양이 아주 많다면? 하나씩 골라내지 않고 {g('체')}와 같은 도구를 사용해요."], w=12.6, size=34
                        ).move_to([0, 0.6, 0])
        self.say(f"양이 많으면 {g('체')}와 같은 도구를 사용해요",
                 "가장 큰 차이는 알갱이의 크기예요. 양이 아주 많다면 체와 같은 도구로 쉽고 빠르게 분리할 수 있어요.")
        self.play(FadeOut(tb), FadeIn(q, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 체 고르기 ──
    def choose(self):
        self.section("체 고르기")
        rule = K.text_card([f"체의 눈 크기보다 {o('큰')} 알갱이는 체에 남고, {g('작은')} 알갱이는 빠져나가요."],
                           size=32).move_to([0, 2.3, 0])
        self.say("체의 눈보다 큰 알갱이는 남고, 작은 알갱이는 빠져나가요",
                 "체의 눈 크기보다 큰 알갱이는 체에 남고, 작은 알갱이는 체를 빠져나가요.")
        self.play(FadeIn(rule), run_time=0.6)
        sv = VGroup()
        for hole, n in ((0.035, "눈이 아주 작은 체"), (0.13, "눈이 중간인 체"), (0.42, "눈이 아주 큰 체")):
            f = K.sieve_face(hole, 3.0)
            sv.add(VGroup(f, T(n, 30).next_to(f, DOWN, buff=0.2)))
        sv.arrange(RIGHT, buff=0.6).move_to([0, 0.05, 0])
        self.say("모래와 자갈을 분리하려면 어떤 체를 쓸까요?")
        self.play(FadeIn(sv, lag_ratio=0.2), run_time=0.9)
        self.pause_screen(5, "어떤 체를 쓸까요?")
        box = SurroundingRectangle(sv[1], color=GREEN, buff=0.15, stroke_width=7)
        ineq = M(f"모래 알갱이의 크기  ＜  {g('체의 눈 크기')}  ＜  자갈 알갱이의 크기", 36).move_to([0, -2.05, 0])
        self.say(f"모래보다 크고 자갈보다 작은 눈 → {g('눈이 중간인 체')}",
                 "눈 크기가 모래 알갱이보다 크고 자갈 알갱이보다 작은 체를 쓰면, 모래만 빠져나가고 자갈은 체에 남아요.")
        self.play(FadeIn(box), FadeIn(ineq, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 체로 분리하기 ──
    def sieve_exp(self):
        self.section("실험해요")
        S = K.Sieve(0, 0.3, 5.0, 1.1)
        body = S.body()
        tr = K.tray(0, -1.75, 6.0)
        tn = T("쟁반", 28, SOFT).next_to(tr, RIGHT, buff=0.2)
        sn = T("눈이 중간인 체", 28).next_to(body, RIGHT, buff=0.2)
        self.say("① 혼합물을 체에 천천히 부어요",
                 "혼합물을 먼지가 날리지 않게 체에 천천히 부어요.")
        self.play(FadeIn(body), FadeIn(tr), FadeIn(tn), FadeIn(sn), run_time=0.7)
        sand, grav = S.inside(170, 12, 1, (0.16, 0.24))
        cup = K.P([(-0.5, 0.45), (0.5, 0.45), (0.4, -0.45), (-0.4, -0.45)], "#D9E4EA", K.STEEL, 3).move_to([-3.4, 2.4, 0])
        self.play(FadeIn(cup), run_time=0.3)
        self.play(Rotate(cup, -1.0), cup.animate.shift(RIGHT * 1.2), run_time=0.6)
        self.play(FadeIn(sand, shift=DOWN * 1.2), FadeIn(grav, shift=DOWN * 1.2), FadeOut(cup), run_time=0.8)
        safe = K.safety_note("실험복·보안경·실험용 장갑 · 모래와 자갈이 튀지 않게 조심해요", w=12.0, size=28).move_to([0.4, 2.2, 0])
        self.say("② 체를 흔들어요",
                 "실험복, 보안경, 실험용 장갑을 착용하고, 모래와 자갈이 떨어지거나 튀지 않게 조심해서 체를 흔들어요.")
        self.play(FadeIn(safe), run_time=0.4)
        moving = VGroup(body, sand, grav)
        for k in range(2):
            self.play(moving.animate.shift(RIGHT * 0.15), run_time=0.12)
            self.play(moving.animate.shift(LEFT * 0.3), run_time=0.18)
            self.play(moving.animate.shift(RIGHT * 0.15), run_time=0.12)
        self.pause_screen(5, "모래와 자갈은 어디에 있을까요?")
        fallen = K.sand_dots(-2.3, 2.3, -1.6, -1.45, 170, 2)
        for k in range(3):
            self.play(moving.animate.shift(RIGHT * 0.15), run_time=0.12)
            self.play(moving.animate.shift(LEFT * 0.3), run_time=0.18)
            self.play(moving.animate.shift(RIGHT * 0.15), run_time=0.12)
        self.play(Transform(sand, fallen), FadeOut(safe), run_time=1.2)
        l1 = K.label("자갈은 체에 남아요", ORANGE, 30).move_to([-3.2, 2.1, 0])
        l2 = K.label("모래는 쟁반에 쌓여요", GREEN, 30).move_to([4.0, -0.8, 0])
        self.say(f"모래는 체를 {g('빠져나가고')}, 자갈은 체에 {o('남아요')}",
                 "알갱이가 체의 눈보다 작은 모래는 체를 빠져나가 쟁반에 쌓이고, 체의 눈보다 큰 자갈은 체에 남아요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리해요 + 생각 바로잡기 ──
    def wrap(self):
        self.section("정리해요")
        c1 = K.text_card([f"알갱이의 크기가 다른 고체 혼합물은", f"알갱이의 {o('크기 차이')}를 이용해 {g('체')}로 분리해요."],
                         w=11.6, size=38).move_to([0.3, 1.85, 0])
        self.say(f"크기 차이를 이용해 {g('체')}로 분리해요",
                 "알갱이의 크기가 다른 고체 혼합물은 알갱이의 크기 차이를 이용해 체로 분리해요.")
        self.play(FadeIn(c1, scale=0.95), run_time=0.7)
        self.settle()
        self.section("생각 바로잡기")
        q = T("분리해 얻은 모래와 자갈은 이제 혼합물이 아닐까요?", 38).move_to([0, 0.45, 0])
        self.say("분리해 얻은 모래와 자갈은 이제 혼합물이 아닐까요?")
        self.play(FadeIn(q), run_time=0.5)
        a = K.text_card([f"아니요, 모래와 자갈도 {r('여전히 혼합물')}이에요.", "여러 가지 알갱이가 섞여 있어요."],
                        w=11.0, size=34).move_to([0, -1.0, 0])
        self.say(f"아니요, 모래와 자갈도 {r('여전히 혼합물')}이에요",
                 "아니요. 분리해 얻은 모래와 자갈도 여러 가지 알갱이가 섞여 있는 혼합물이에요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 예 ──
    def life(self):
        self.section("생활 속 예")
        shell = VGroup(K.sieve_face(0.1, 1.8), *[K.P([(-0.12, 0), (0.12, 0), (0, 0.16)], "#F4E6CF", "#8A6A3A", 2).move_to(
            [-0.5 + 0.25 * i, 0.05 + 0.1 * (i % 2), 0]) for i in range(5)])
        truck = VGroup(K.rect(1.8, 0.6, "#F08A24", 0, 0.2, "#8A4A10", 3, r=0.08), K.sieve_face(0.06, 0.8).move_to([1.3, 0.05, 0]),
                       K.Dot([-0.5, -0.2, 0], radius=0.2, color=INK), K.Dot([0.5, -0.2, 0], radius=0.2, color=INK))
        mask = K.face(True, 0.8)
        cards = VGroup(K.pic_card(shell, "체로 모래와 조개 분리하기", 4.1, 2.9, 24),
                       K.pic_card(truck, "해변 쓰레기 수거 장비", 4.1, 2.9, 26),
                       K.pic_card(mask, "마스크로 황사 걸러 내기", 4.1, 2.9, 26))
        cards.arrange(RIGHT, buff=0.3).move_to([0, 0.5, 0])
        self.say("생활 속에서 체처럼 크기 차이로 분리하는 예를 찾아봐요",
                 "생활 속에서 크기 차이를 이용해 분리하는 예를 찾아봐요.")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=1.0)
        self.say(f"강에서 체로 {o('모래와 조개')}를, 해변에서 {o('모래와 쓰레기')}를 분리해요",
                 "강에서 모래 속의 작은 조개를 잡을 때 체로 모래와 조개를 분리해요. 해변 쓰레기 수거 장비도 체를 사용해 모래와 쓰레기를 분리해요.")
        self.play(Indicate(cards[0][2]), Indicate(cards[1][2]), run_time=0.8)
        self.say(f"마스크는 크기가 큰 황사를 걸러 내고 {g('공기는 통과')}시켜요")
        self.play(Indicate(cards[2][2]), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각이 한눈에: 좁쌀·쌀·팥 ──
    def grains(self):
        self.section("생각해 봐요")
        size = M(f"알갱이의 크기:  좁쌀 ＜ 쌀 ＜ 팥", 36).move_to([0, 2.45, 0])
        mix = K.grain_bowl(["z", "r", "p"], 3.0, "섞여 있는 혼합물", 28, 1.4).scale(1.25).move_to([-4.3, 0.5, 0])
        self.say("좁쌀, 쌀, 팥이 섞인 혼합물은 어떻게 분리할까요?",
                 "알갱이의 크기는 좁쌀이 가장 작고 팥이 가장 커요. 섞인 것을 어떻게 분리할까요?")
        self.play(FadeIn(size), FadeIn(mix), run_time=0.7)
        s1 = VGroup(K.sieve_face(0.06, 2.0), T("눈이 작은 체\n(좁쌀＜눈＜쌀)", 24))
        s1[1].next_to(s1[0], DOWN, buff=0.12)
        s2 = VGroup(K.sieve_face(0.17, 2.0), T("눈이 큰 체\n(쌀＜눈＜팥)", 24))
        s2[1].next_to(s2[0], DOWN, buff=0.12)
        VGroup(s1, s2).arrange(RIGHT, buff=0.5).move_to([0.6, 0.6, 0])
        self.play(FadeIn(s1), FadeIn(s2), run_time=0.6)
        self.pause_screen(5, "체 두 개로 세 가지를 나누려면?")
        out = VGroup(K.grain_bowl(["z"], 1.6, "좁쌀", 26, 1.4), K.grain_bowl(["r"], 1.6, "쌀", 26, 1.4),
                     K.grain_bowl(["p"], 1.6, "팥", 26, 1.4)).arrange(RIGHT, buff=0.7).move_to([0.6, -1.65, 0])
        self.say(f"눈이 작은 체로 {o('좁쌀')}을, 눈이 큰 체로 {o('팥')}을 걸러 내요",
                 "눈이 작은 체로 좁쌀을 걸러 내고, 남은 쌀과 팥을 눈이 큰 체로 거르면 팥이 남아요. 어느 체를 먼저 써도 돼요.")
        self.play(FadeIn(out[0]), Indicate(s1), run_time=0.8)
        self.play(FadeIn(out[1]), FadeIn(out[2]), Indicate(s2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"모래와 자갈의 혼합물은 알갱이의 {o('크기')}", "차이를 이용해 분리할 수 있습니다."],
                           w=11.6, size=42).move_to([0, 1.2, 0])
        self.say(f"모래와 자갈은 알갱이의 {o('크기')} 차이로 분리해요",
                 "모래와 자갈의 혼합물은 알갱이의 크기 차이를 이용해 분리할 수 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
