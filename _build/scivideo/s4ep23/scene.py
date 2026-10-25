"""「과학 원리 돋보기」 4학년 23화 — 생물 요소를 분류해 볼까? (4-2 2단원 생물과 환경 4차시, 화 코드 4-2-2-b)

바탕: grade4/science/sem2/u2-2.html(원본 _build_tb/src2/u2-2.html) — 도입(우리는 음식을 먹어 양분을 얻음, 스스로 양분을 만드는 생물은 식물),
생물 카드 12장(CARD: 괭이밥·개나리·갈참나무 / 토끼·개구리·뱀·달팽이·박새·잠자리 / 버섯·곰팡이·세균), 역할 세 가지(R 문장 그대로),
분류, 숲속 이야기 영상(괭이밥·개망초 → 애벌레 → 박새 → 낙엽을 버섯·곰팡이가 분해 → 양분을 다시 이용), 오개념(지렁이 = 소비자,
버섯 = 분해자, 분해자는 '일부 세균'), 한눈에 쏙(소비자), 생각이 쑥(분해자가 사라지면 죽은 생물체와 배출물이 계속 쌓임).
최종: ./make_final.sh s4ep23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Rectangle, Dot, ValueTracker,
                   always_redraw, linear, Arrow, Circumscribe, Transform)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, person, fruit
import kit_s4u22 as K

PURPLE = "#7A4FB0"


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def pu(s):
    return f'<span foreground="{PURPLE}">{s}</span>'


CARD = [("괭이밥", "p"), ("개나리", "p"), ("갈참나무", "p"), ("토끼", "c"), ("개구리", "c"), ("뱀", "c"),
        ("달팽이", "c"), ("박새", "c"), ("잠자리", "c"), ("버섯", "d"), ("곰팡이", "d"), ("세균", "d")]
COL = {"p": GREEN, "c": ORANGE, "d": PURPLE}
NAME = {"p": "생산자", "c": "소비자", "d": "분해자"}


def tag(text, col, size=30):
    t = T(text, size, PAPER)
    b = K.R(t.width + 0.4, t.height + 0.26, col, rad=0.2, stroke=None, sw=0)
    t.move_to(b)
    return VGroup(b, t)


class S4Ep23(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 23
    EP_TITLE = "생물 요소를 분류해 볼까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.roles()
        self.sort()
        self.story()
        self.tricky()
        self.no_decomposer()
        self.summary()
        self.closing(f"생물 요소는 역할에 따라 {g('생산자')}, {o('소비자')}, {pu('분해자')}로 분류해요",
                     next_preview="4학년 24화 · 먹고 먹히는 관계")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        kid = person(2.6).move_to([-3.6, 0.2, 0])
        ap = fruit("apple", 0.8).move_to([-2.4, 0.6, 0])
        self.say("우리는 필요한 양분을 어떻게 얻을까요?", "우리는 살아가는 데 필요한 양분을 어떻게 얻고 있을까요?")
        self.play(FadeIn(kid), FadeIn(ap), run_time=0.6)
        self.say(f"우리는 {o('음식을 먹어서')} 양분을 얻어요",
                 "우리는 음식을 먹어서 필요한 양분을 얻어요.")
        self.play(ap.animate.move_to(kid.get_top() + DOWN * 0.45 + RIGHT * 0.3).scale(0.5), run_time=0.8)
        self.play(FadeOut(ap), run_time=0.3)
        sun = K.pic("햇빛", 1.3, 1.3).move_to([1.6, 2.0, 0])
        plant = K.pic("괭이밥", 2.0, 2.2).move_to([3.6, -0.1, 0])
        q = T("?", 90, ORANGE).move_to([5.3, 1.0, 0])
        self.say("다른 생물을 먹지 않고 스스로 양분을 만드는 생물은?",
                 "그렇다면 다른 생물을 먹지 않고 스스로 양분을 만드는 생물은 무엇일까요?")
        self.play(FadeIn(sun), FadeIn(plant), FadeIn(q), run_time=0.7)
        self.pause_screen(5, "스스로 양분을 만드는 생물은?")
        rays = VGroup(*[Arrow(sun.get_center() + np.array([0.5, -0.4 - 0.25 * k, 0]), plant.get_top() + np.array([-0.5 + 0.4 * k, -0.3, 0]),
                              color="#F2A900", stroke_width=6, buff=0.05) for k in range(3)])
        self.say(f"{g('식물')}은 햇빛 등을 이용해 스스로 양분을 만들어요",
                 "식물은 햇빛 등을 이용해 스스로 양분을 만들어요.")
        self.play(FadeOut(q), Create(rays, lag_ratio=0.2), Indicate(plant, color=GREEN), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 역할 세 가지 ──
    def roles(self):
        self.section("조사해요")
        rows = [("p", "생산자", "햇빛 등을 이용해 스스로 양분을 만들어요.", "괭이밥"),
                ("c", "소비자", "다른 생물을 먹이로 하여 살아가요.", "토끼"),
                ("d", "분해자", "죽은 생물체나 배출물을 분해해 양분을 얻고\n다른 생물이 이용할 수 있게 해요.", "버섯")]
        grp = VGroup()
        for k, (key, nm, d, ex) in enumerate(rows):
            lab = tag(nm, COL[key], 38)
            dd = VGroup(*[T(line, 30) for line in d.split("\n")]).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
            p = K.pic(ex, 1.2, 1.0)
            row = VGroup(p, lab, dd)
            p.move_to([-5.6, 1.85 - k * 1.75, 0])
            lab.move_to([-3.75, 1.85 - k * 1.75, 0])
            dd.next_to(lab, RIGHT, buff=0.5)
            grp.add(row)
        narr = ["괭이밥처럼 스스로 양분을 만드는 생물을 생산자라고 해요.",
                "토끼처럼 다른 생물을 먹이로 하는 생물은 소비자예요.",
                "버섯처럼 죽은 생물체나 배출물을 분해해 양분을 얻는 생물은 분해자예요."]
        subs = [f"스스로 양분을 만들면 {g('생산자')}", f"다른 생물을 먹이로 하면 {o('소비자')}",
                f"죽은 생물체·배출물을 분해하면 {pu('분해자')}"]
        for k in range(3):
            self.say(subs[k], narr[k])
            self.play(FadeIn(grp[k], shift=RIGHT * 0.3), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 분류해요 ──
    def sort(self):
        self.section("분류해요")
        xs = {"p": -4.55, "c": 0.0, "d": 4.55}
        bins = {}
        for key in ("p", "c", "d"):
            b = K.bin_box(NAME[key], 4.25, 4.0, COL[key], 38).move_to([xs[key], 0.85, 0])
            bins[key] = b
        cards = VGroup(*[K.node(n, 1.3, 1.05, 24, stroke=SOFT) for n, _ in CARD]).arrange(RIGHT, buff=0.12)
        cards.scale_to_fit_width(13.4).move_to([0, -2.05, 0])
        self.say("생물 카드를 생산자, 소비자, 분해자로 분류해요",
                 "생물 카드를 생산자, 소비자, 분해자로 분류해 봐요.")
        self.play(FadeIn(VGroup(*bins.values())), FadeIn(cards, lag_ratio=0.05), run_time=1.2)
        self.pause_screen(6, "어느 칸에 들어갈까요?")
        cnt = {"p": 0, "c": 0, "d": 0}
        anims = []
        for c, (n, key) in zip(cards, CARD):
            k = cnt[key]
            cnt[key] += 1
            per = 3 if key == "c" else 2
            nrow = (3 if key == "c" else 2)
            col_i, row_i = k % per, k // per
            x = xs[key] + (col_i - (per - 1) / 2) * 1.38
            y = 1.35 - row_i * 1.25 if key == "c" else 1.35 - row_i * 1.25
            if key != "c" and k == 2:
                x, y = xs[key], 0.1
            tgt = K.node(n, 1.25, 1.05, 24, stroke=COL[key]).move_to([x, y, 0])
            anims.append(Transform(c, tgt))
        self.say(f"생산자: 괭이밥, 개나리, 갈참나무", "생산자는 괭이밥, 개나리, 갈참나무예요.")
        self.play(*[a for a, (n, k) in zip(anims, CARD) if k == "p"], run_time=1.0)
        self.say(f"소비자: 토끼, 개구리, 뱀, 달팽이, 박새, 잠자리",
                 "소비자는 토끼, 개구리, 뱀, 달팽이, 박새, 잠자리예요.")
        self.play(*[a for a, (n, k) in zip(anims, CARD) if k == "c"], run_time=1.0)
        self.say(f"분해자: 버섯, 곰팡이, 세균",
                 "분해자는 버섯, 곰팡이, 세균이에요.")
        self.play(*[a for a, (n, k) in zip(anims, CARD) if k == "d"], run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 숲속 이야기 ──
    def story(self):
        self.section("숲속 이야기")
        GY = -1.0
        ground = VGroup(Rectangle(width=13.4, height=1.5, fill_color="#8F6236", fill_opacity=1, stroke_width=0).move_to([0, GY - 0.75, 0]),
                        Rectangle(width=13.4, height=0.16, fill_color="#7CB65A", fill_opacity=1, stroke_width=0).move_to([0, GY, 0]))
        sun = K.pic("햇빛", 1.2, 1.2).move_to([-5.6, 2.3, 0])
        p1 = K.pic("괭이밥", 1.6, 1.9)
        p1.move_to([-3.3, GY + p1.height / 2 - 0.05, 0])
        p2 = K.pic("개망초", 1.6, 1.9)
        p2.move_to([-1.0, GY + p2.height / 2 - 0.05, 0])
        self.say(f"괭이밥과 개망초는 스스로 양분을 만들어요: {g('생산자')}",
                 "괭이밥과 개망초는 햇빛 등을 이용해 스스로 양분을 만드는 생산자예요.")
        self.play(FadeIn(ground), FadeIn(sun), FadeIn(p1), FadeIn(p2), run_time=0.8)
        rays = VGroup(*[Arrow(sun.get_center() + np.array([0.4, -0.4, 0]), p.get_top() + DOWN * 0.2, color="#F2A900",
                              stroke_width=6, buff=0.1) for p in (p1, p2)])
        t1 = tag("생산자", GREEN).move_to([-2.2, -2.05, 0])
        self.play(Create(rays), run_time=0.7)
        self.play(FadeIn(t1), run_time=0.4)
        cat = K.pic("애벌레", 1.3, 0.4).move_to([3.0, GY + 0.22, 0])
        self.say(f"애벌레는 잎을 먹어요: {o('소비자')}", "애벌레는 잎을 먹는 소비자예요.")
        self.play(FadeIn(cat), FadeOut(rays), run_time=0.5)
        self.play(cat.animate.move_to([-0.2, GY + 0.22, 0]), run_time=1.6, rate_func=linear)
        bird = K.pic("박새", 1.4, 1.0).move_to([4.8, 2.2, 0])
        t2 = tag("소비자", ORANGE).move_to([1.6, -2.05, 0])
        self.say(f"박새는 애벌레를 먹어요: 박새도 {o('소비자')}", "박새는 애벌레를 먹어요. 박새도 소비자예요.")
        self.play(FadeIn(bird), FadeIn(t2), run_time=0.5)
        self.play(bird.animate.move_to(cat.get_center() + UP * 0.45), run_time=1.3)
        self.play(FadeOut(cat), bird.animate.move_to([3.0, 2.0, 0]), run_time=1.0)
        leaves = VGroup(*[K.leaf().rotate(k * 0.5).move_to([2.2 + k * 0.55, 2.6 - (k % 2) * 0.3, 0]) for k in range(5)])
        self.say("낙엽과 죽은 생물체가 떨어져 쌓여요", "낙엽과 죽은 생물체가 땅에 쌓여요.")
        self.play(FadeIn(leaves), FadeOut(bird), run_time=0.5)
        self.play(*[lf.animate.move_to([2.2 + k * 0.55, GY + 0.15, 0]) for k, lf in enumerate(leaves)], run_time=1.4)
        mu = K.pic("버섯", 0.9, 0.9).move_to([3.0, GY + 0.55, 0])
        mo = K.pic("곰팡이", 1.0, 1.0).move_to([4.7, GY + 0.95, 0])
        t3 = tag("분해자", PURPLE).move_to([4.0, -2.05, 0])
        self.say(f"버섯과 곰팡이가 낙엽을 분해해요: {pu('분해자')}",
                 "버섯과 곰팡이가 낙엽을 분해해 양분을 얻어요. 분해자예요.")
        self.play(FadeIn(mu), FadeIn(mo), FadeIn(t3), run_time=0.6)
        self.play(*[lf.animate.scale(0.25).set_opacity(0.4) for lf in leaves], run_time=1.6)
        dots = VGroup(*[Dot([2.3 + k * 0.4, GY - 0.45 - 0.15 * (k % 2), 0], radius=0.09, color="#FFE46B").set_stroke("#A47A00", 2) for k in range(7)])
        self.say(f"분해된 양분은 다른 생물이 {g('다시 이용')}해요",
                 "분해된 양분은 다른 생물이 다시 이용할 수 있어요.")
        self.play(FadeIn(dots), run_time=0.4)
        self.play(*[d.animate.move_to([p1.get_x() + (k - 3) * 0.12 if k % 2 else p2.get_x() + (k - 3) * 0.12, GY - 0.35, 0])
                    for k, d in enumerate(dots)], run_time=1.6)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def tricky(self):
        self.section("생각 바로잡기")
        w = K.item("지렁이", 2.4, 1.0, 36).move_to([-3.4, 1.5, 0])
        m = K.item("버섯", 1.8, 1.6, 36).move_to([3.4, 1.5, 0])
        q1 = T("썩은 나뭇잎 등을 먹어요", 28, SOFT).next_to(w, DOWN, buff=0.25)
        q2 = T("식물처럼 땅에서 자라요", 28, SOFT).next_to(m, DOWN, buff=0.25)
        self.say("지렁이와 버섯은 생산자, 소비자, 분해자 중 무엇일까요?",
                 "썩은 나뭇잎을 먹는 지렁이와, 땅에서 자라는 버섯은 무엇일까요?")
        self.play(FadeIn(w), FadeIn(m), FadeIn(q1), FadeIn(q2), run_time=0.8)
        self.pause_screen(5, "지렁이와 버섯은?")
        a1 = tag("소비자", ORANGE, 36).next_to(q1, DOWN, buff=0.3)
        a2 = tag("분해자", PURPLE, 36).next_to(q2, DOWN, buff=0.3)
        self.say(f"지렁이는 다른 생물을 먹고 사는 {o('소비자')}예요",
                 "지렁이는 썩은 나뭇잎 같은 다른 생물을 먹고 살아가므로 소비자예요.")
        self.play(FadeIn(a1, scale=0.8), run_time=0.5)
        self.say(f"버섯은 스스로 양분을 만들지 못하는 {pu('분해자')}예요",
                 "버섯은 스스로 양분을 만들지 못하고, 죽은 생물체를 분해해 양분을 얻는 분해자예요.")
        self.play(FadeIn(a2, scale=0.8), run_time=0.5)
        note = T("세균 중에는 스스로 양분을 만드는 것도 있어서, 분해자는 '일부 세균'이라고 말해요", 26, SOFT).move_to([0, -2.1, 0])
        self.say("분해자는 '일부 세균'이라고 말해요",
                 "세균 중에는 스스로 양분을 만드는 것도 있어서, 분해자는 일부 세균이라고 말해요.")
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 생각이 쑥: 분해자가 사라지면 ──
    def floor(self, cx, on):
        GY = -0.65
        box = K.R(6.0, 3.9, "#E8F2DC", cx, 0.3, rad=0.2, stroke=SOFT, sw=3)
        soil = Rectangle(width=5.9, height=0.95, fill_color="#9A6A3A", fill_opacity=1, stroke_width=0).move_to([cx, GY - 0.5, 0])
        tr = K.pic("갈참나무", 1.6, 2.1).move_to([cx - 2.0, GY + 1.05, 0])
        title = M(f"{pu('분해자')}가 있을 때" if on else f"{r('분해자')}가 사라지면", 34).move_to([cx, 2.65, 0])
        g_ = VGroup(box, soil, tr, title)
        if on:
            g_.add(K.pic("버섯", 0.6, 0.6).move_to([cx + 2.2, GY + 0.3, 0]), K.pic("곰팡이", 0.65, 0.65).move_to([cx + 1.3, GY + 1.6, 0]))
        return g_

    def pile(self, cx, n):
        GY = -0.65
        g_ = VGroup()
        for i in range(n):
            x = cx - 1.0 + (i * 0.53) % 2.6
            y = GY + 0.08 + (i // 5) * 0.13
            g_.add(K.leaf("#C98A3A" if i % 3 else "#A8743A").scale(0.75).rotate((i * 37 % 60 - 30) * PI_ / 180).move_to([x, y, 0]))
        return g_

    def no_decomposer(self):
        self.section("생각이 쑥")
        L, Rr = self.floor(-3.35, True), self.floor(3.35, False)
        self.say("생태계에서 분해자가 사라지면 어떤 일이 생길까요?", "생태계에서 분해자가 사라지면 어떤 일이 생길까요?")
        self.play(FadeIn(L), FadeIn(Rr), run_time=0.8)
        self.pause_screen(5, "분해자가 사라지면?")
        m = ValueTracker(0)
        month = always_redraw(lambda: M(f"{o(str(int(round(m.get_value()))))}달", 40).move_to([0, -2.15, 0]))
        lp = always_redraw(lambda: self.pile(-3.35, min(int(round(m.get_value())), 2) * 2))
        rp = always_redraw(lambda: self.pile(3.35, int(round(m.get_value())) * 3))
        self.add(month, lp, rp)
        self.say("한 달씩 시간을 흐르게 해 봐요", "한 달씩 시간을 흐르게 하며 땅 위를 살펴봐요.")
        self.play(m.animate.set_value(10), run_time=5.0, rate_func=linear)
        for mob in (month, lp, rp):
            mob.clear_updaters()
        self.say(f"죽은 생물체와 배출물이 분해되지 않고 {r('계속 쌓여요')}",
                 "분해자가 사라지면 죽은 생물체와 배출물이 분해되지 않고 계속 쌓여요.")
        self.play(Circumscribe(rp, color=RED), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["생태계를 구성하는 생물 요소는 그 역할에 따라",
                            f"{g('생산자')}, {o('소비자')}, {pu('분해자')}로 분류할 수 있습니다."], size=42).move_to([0, 1.0, 0])
        self.say(f"생물 요소는 역할에 따라 {g('생산자')}, {o('소비자')}, {pu('분해자')}로 나눠요",
                 "생태계를 구성하는 생물 요소는 그 역할에 따라 생산자, 소비자, 분해자로 분류할 수 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


PI_ = np.pi
