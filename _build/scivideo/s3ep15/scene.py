"""「과학 원리 돋보기」 3학년 15화 — 배추흰나비의 한살이 (3-1 4단원 생물의 한살이 2~5차시, 화 코드 3-1-4-a)

바탕: grade3/science/sem1/u4-1.html(동물의 한살이 뜻, 관찰하기 좋은 동물: 주변에서 쉽게 보고 한살이 기간이 짧은 동물,
한살이 기간 약 한 달, 준비물 사육 망·케일 화분·분무기·쟁반, 손으로 만지지 않기·떨어진 애벌레는 잎이나 나뭇가지를 대 주기),
u4-2.html(알: 길쭉하고 주름진 옥수수 모양·노란색·약 1 mm·움직이지 않음 / 알껍데기를 갉아 먹음(영양분·흔적 없애기) /
애벌레: 긴 원통 모양·마디·털, 허물을 네 번 벗으며 커짐 약 2 mm~30 mm, 연한 노란색 → 초록색 /
번데기: 가운데 볼록·양쪽 끝 뾰족, 약 25 mm, 한곳에 붙어 이동하지 않음, 주변과 비슷한 색, 생각 바로잡기 '죽은 것이 아님' /
날개돋이 / 어른벌레: 머리(더듬이·눈 한 쌍, 대롱 모양 입)·가슴(날개 두 쌍, 다리 세 쌍)·배, 곤충 / 한눈에 쏙),
u4-3.html(한살이 순서, 단계별 기간: 5~7일, 15~20일, 7~10일 — 기온에 따라 달라짐).
최종: ./make_final.sh s3ep15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, CurvedArrow, FadeIn, FadeOut, Indicate, Line, Rectangle,
                   RoundedRectangle, SurroundingRectangle, Transform, VGroup, Write, LaggedStart, Circumscribe, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import BROWN_DARK, RED, clear_stage, tag
from kit_s3u14 import (LEAF, bf_egg, butterfly, caterpillar, kale_leaf, kale_pot, pupa, drop)


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def facts(rows, x=1.2, y=1.8, gap=0.78, size=36):
    """오른쪽 관찰 기록 카드: [(항목, 내용)] — 오른쪽 끝이 x=6.6을 넘지 않게 줄임"""
    width = 6.6 - (x + 1.5)
    grp = VGroup()
    for i, (k, v) in enumerate(rows):
        kk = T(k, size - 2, ORANGE)
        vv = T(v, size, INK)
        if vv.width > width:
            vv.scale_to_fit_width(width)
        kk.move_to([x, y - i * gap, 0], aligned_edge=LEFT)
        vv.move_to([x + 1.5, y - i * gap, 0], aligned_edge=LEFT)
        grp.add(VGroup(kk, vv))
    return grp


class S3Ep15(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 15
    EP_TITLE = "배추흰나비의 한살이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.prepare()
        self.egg()
        self.larva()
        self.pupa_part()
        self.adult()
        self.cycle()
        self.closing(f"배추흰나비의 한살이는\n{o('알')} → {o('애벌레')} → {o('번데기')} → {o('어른벌레')}의 순으로 이루어져요",
                     next_preview="3학년 16화 · 씨가 싹 트려면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        bf = butterfly(1.3).move_to([-3.2, 0.6, 0])
        self.say("나비를 본 적이 있나요?", "꽃밭에서 나비를 본 적이 있나요? 오늘은 배추흰나비를 만나 봐요.")
        self.play(FadeIn(bf, shift=UP * 0.4), run_time=0.6)
        self.play(bf.animate.shift(RIGHT * 6.4 + UP * 0.4), run_time=1.4)
        word = T("동물의 한살이", 64, ORANGE).move_to([0, 2.0, 0])
        mean = T("태어나고 자라서 자손을 남기는 과정", 44, INK).move_to([0, 0.9, 0])
        self.say(f"태어나고 자라서 자손을 남기는 과정 = {o('동물의 한살이')}",
                 "동물이 태어나고 자라서 자손을 남기는 과정을 동물의 한살이라고 해요.")
        self.play(FadeOut(bf), FadeIn(word, scale=0.8), run_time=0.6)
        self.play(FadeIn(mean, shift=UP * 0.2), run_time=0.5)
        self.say("한살이를 관찰하기 좋은 동물은?", "한살이를 관찰하려면 어떤 동물이 좋을까요?")
        self.pause_screen(4, "어떤 동물이 관찰하기 좋을까요?")
        a = tag("주변에서 쉽게 볼 수 있는 동물", GREEN, 38).move_to([0, -0.3, 0])
        b = tag("한살이 기간이 짧은 동물", GREEN, 38).move_to([0, -1.35, 0])
        self.say(f"배추흰나비는 쉽게 볼 수 있고, 한살이 기간이 {o('약 한 달')}로 짧아요",
                 "주변에서 쉽게 볼 수 있고 한살이 기간이 짧은 동물이 좋아요. 배추흰나비는 한살이 기간이 약 한 달이에요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.5)
        self.play(FadeIn(b, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 기를 준비 ──
    def prepare(self):
        self.section("기를 준비")
        cx = -3.4
        net = VGroup(
            RoundedRectangle(corner_radius=0.15, width=4.6, height=4.0, fill_color=PAPER, fill_opacity=0.35,
                             stroke_color="#7E8A93", stroke_width=5),
            *[Line([x, -2.0, 0], [x, 2.0, 0], stroke_color="#AEB8BF", stroke_width=1.5) for x in np.arange(-2.05, 2.1, 0.5)],
            *[Line([-2.3, y, 0], [2.3, y, 0], stroke_color="#AEB8BF", stroke_width=1.5) for y in np.arange(-1.75, 1.8, 0.5)],
        ).move_to([cx, 0.45, 0])
        tray = RoundedRectangle(corner_radius=0.1, width=4.0, height=0.28, fill_color="#C9CED2", fill_opacity=1,
                                stroke_color="#7E8A93", stroke_width=3).move_to([cx, -1.35, 0])
        pot = kale_pot("start", 0.95)
        pot.move_to([cx, -1.2 + pot.height / 2, 0])
        self.say(f"{b_('사육 망')}, 케일 화분, 쟁반, 분무기를 준비해요",
                 "사육 망, 애벌레의 먹이인 케일 화분, 똥을 받는 쟁반, 물이 든 분무기를 준비해요.")
        self.play(FadeIn(tray), FadeIn(pot, shift=DOWN * 0.3), run_time=0.5)
        self.play(Create(net), run_time=0.7)
        tx = 2.7
        t1 = tag("사육 망 — 기생벌을 막아요", BLUE, 34).move_to([tx, 2.1, 0])
        t2 = tag("케일 화분 — 애벌레의 먹이", GREEN, 34).move_to([tx, 1.05, 0])
        t3 = tag("쟁반 — 똥을 받아요", ORANGE, 34).move_to([tx, 0.0, 0])
        t4 = tag("분무기 — 물 주기", "#3B86C0", 34).move_to([tx, -1.05, 0])
        self.play(LaggedStart(*[FadeIn(t, shift=LEFT * 0.2) for t in (t1, t2, t3, t4)], lag_ratio=0.35), run_time=1.4)
        self.settle()
        self.play(FadeOut(VGroup(t1, t2, t3, t4)), run_time=0.4)
        warn = VGroup(T("알 · 애벌레 · 번데기 · 어른벌레는", 34, RED), T("손으로 만지지 않아요", 40, RED)).arrange(DOWN, buff=0.18)
        warn.move_to([2.8, 1.7, 0])
        self.say(f"{r('손으로 만지지 않아요')}", "중요한 약속! 배추흰나비알, 애벌레, 번데기, 어른벌레는 손으로 만지지 않아요.")
        self.play(FadeIn(warn), run_time=0.5)
        cat = caterpillar(1.3).move_to([2.0, -1.6, 0])
        twig = Line([4.3, -0.3, 0], [3.05, -1.45, 0], stroke_color=BROWN_DARK, stroke_width=10)
        self.say("애벌레가 떨어지면 잎이나 나뭇가지를 대 주어요",
                 "애벌레가 떨어지면 잎이나 나뭇가지를 대 주어 스스로 올라오게 해요.")
        self.play(FadeIn(cat), Create(twig), run_time=0.6)
        self.play(cat.animate.shift(RIGHT * 0.9 + UP * 0.25).rotate(0.6), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 알 ──
    def egg(self):
        self.section("알")
        leaf = kale_leaf(5.4, LEAF).move_to([-3.6, -0.2, 0])
        e = bf_egg(1.6).move_to([-3.6, 0.65, 0])
        self.play(FadeIn(leaf), run_time=0.4)
        self.play(FadeIn(e, scale=0.3), run_time=0.5)
        rows = facts([("모양", "길쭉하고 주름진 옥수수 모양"), ("색깔", "노란색"), ("크기", "약 1 mm"), ("움직임", "움직이지 않아요")],
                     x=-0.4)
        self.say(f"알: 길쭉하고 주름진 {o('옥수수 모양')}, 노란색, 약 1 mm",
                 "잎에 붙은 알을 돋보기로 봐요. 길쭉하고 주름진 옥수수 모양이고, 노란색이며, 약 1 밀리미터예요. 움직이지 않아요.")
        self.play(LaggedStart(*[FadeIn(x, shift=LEFT * 0.2) for x in rows], lag_ratio=0.3), run_time=1.2)
        self.settle()
        self.play(FadeOut(rows), run_time=0.4)
        self.say("알에서 나온 애벌레는 맨 먼저 무엇을 할까요?", "알에서 애벌레가 나와요. 애벌레는 맨 먼저 무엇을 할까요?")
        cat = caterpillar(0.9, "#EFE07F").move_to([-2.5, 0.0, 0])
        self.play(e.animate.set_opacity(0.55), run_time=0.4)
        self.play(FadeIn(cat, shift=RIGHT * 0.3), run_time=0.5)
        self.pause_screen(4, "애벌레는 무엇을 할까요?")
        self.say(f"{o('알껍데기')}를 갉아 먹어요", "알껍데기를 갉아 먹어요. 영양분을 보충하고, 흔적을 없애 자신을 보호하려는 거예요.")
        self.play(cat.animate.shift(LEFT * 0.4), e.animate.stretch(0.5, 1, about_edge=DOWN), run_time=1.0)
        self.play(FadeOut(e), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 애벌레 ──
    def larva(self):
        self.section("애벌레")
        lens = [0.7, 1.15, 1.7, 2.3, 3.2]
        cols = ["#EFE07F", "#B9E27A", "#98D56A", "#7CC36B", "#5FAE52"]
        cat = caterpillar(lens[0], cols[0]).move_to([0, 0.6, 0])
        leaf = kale_leaf(9.0, LEAF).move_to([0, 0.2, 0]).set_opacity(0.35)
        cnt = T("허물을 0번 벗었어요", 40, ORANGE).move_to([0, 2.5, 0])
        self.say(f"애벌레는 잎을 먹고 자라며 {o('허물')}을 벗어요",
                 "애벌레는 잎을 갉아 먹고 기어서 움직여요. 먹고 자라 몸이 꽉 끼면 허물을 벗어요.")
        self.play(FadeIn(leaf), FadeIn(cat), FadeIn(cnt), run_time=0.6)
        for k in range(1, 5):
            new = caterpillar(lens[k], cols[k]).move_to([0, 0.6, 0])
            skin = cat.copy().set_fill("#F3F0D8").set_stroke("#D8D0B0")
            self.add(skin)
            self.play(skin.animate.shift(LEFT * 3.4 + DOWN * 1.0).scale(0.6).set_opacity(0.0),
                      Transform(cat, new), Transform(cnt, T(f"허물을 {k}번 벗었어요", 40, ORANGE).move_to([0, 2.5, 0])),
                      run_time=0.8)
            self.remove(skin)
        rows = VGroup(
            T("약 2 mm  →  약 30 mm", 42, INK),
            T("연한 노란색  →  초록색", 42, INK),
        ).arrange(DOWN, buff=0.35).move_to([0, -1.25, 0])
        self.say(f"허물을 {o('네 번')} 벗으며 약 30 mm까지 커져요",
                 "허물을 네 번 벗으면서 약 2 밀리미터에서 약 30 밀리미터까지 커지고, 몸 색깔은 연한 노란색에서 초록색으로 변해요.")
        self.play(FadeIn(rows[0]), run_time=0.4)
        self.play(FadeIn(rows[1]), run_time=0.4)
        self.say("긴 원통 모양이고, 몸에 마디와 털이 있어요", "애벌레의 몸은 긴 원통 모양이고, 여러 개의 마디와 털이 있어요.")
        self.play(Indicate(cat, color=GREEN, scale_factor=1.08), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 번데기 ──
    def pupa_part(self):
        self.section("번데기")
        stem = Line([-5.0, 2.6, 0], [-5.0, -2.2, 0], stroke_color="#6EAF4E", stroke_width=22)
        twig = Line([-2.2, 2.6, 0], [-2.2, -2.2, 0], stroke_color=BROWN_DARK, stroke_width=22)
        p1 = pupa(2.0, "#8CC860").move_to([-4.55, 0.4, 0]).rotate(-0.12)
        p2 = pupa(2.0, "#A88F5C").move_to([-1.75, 0.4, 0]).rotate(-0.12)
        self.say(f"다 자란 애벌레는 {o('번데기')}가 돼요, 주변과 비슷한 색으로",
                 "다 자란 애벌레는 먹는 것을 멈추고, 실로 몸을 고정한 뒤 번데기가 돼요. 번데기는 주변과 비슷한 색깔로 변해요.")
        self.play(Create(stem), Create(twig), run_time=0.6)
        self.play(FadeIn(p1, scale=0.6), FadeIn(p2, scale=0.6), run_time=0.8)
        self.play(Indicate(p1, color=GREEN), Indicate(p2, color=BROWN_DARK), run_time=1.0)
        rows = facts([("모양", "가운데가 볼록, 양쪽 끝이 뾰족"), ("크기", "약 25 mm"), ("움직임", "한곳에 붙어 이동하지 않아요")],
                     x=0.0, y=1.5, gap=0.9, size=36)
        self.say("가운데가 볼록하고 양쪽 끝이 뾰족, 이동하지 않아요",
                 "번데기는 가운데가 볼록하고 양쪽 끝이 뾰족해요. 약 25 밀리미터이고, 먹지 않으며 한곳에 붙어 이동하지 않아요.")
        self.play(LaggedStart(*[FadeIn(x, shift=LEFT * 0.2) for x in rows], lag_ratio=0.3), run_time=1.2)
        self.settle()
        self.play(FadeOut(rows), run_time=0.4)
        q = T("움직이지 않으니 죽은 걸까?", 46, RED).move_to([2.6, 1.0, 0])
        self.say("움직임이 없는 번데기는 죽은 것일까요?", "움직임이 없는 번데기는 죽은 것일까요?")
        self.play(FadeIn(q), run_time=0.4)
        self.pause_screen(4, "번데기는 죽은 걸까요?")
        a = T("아니요, 살아 있어요!", 50, GREEN).move_to([2.6, -0.2, 0])
        self.say(f"번데기는 {g('살아 있어요')} — 이동하지 않을 뿐이에요",
                 "아니에요. 번데기는 이동하지 않을 뿐 살아 있어요. 가끔 제자리에서 꿈틀거리기도 해요.")
        self.play(FadeIn(a, scale=0.8), run_time=0.5)
        self.play(p2.animate.rotate(0.12), run_time=0.25)
        self.play(p2.animate.rotate(-0.12), run_time=0.25)
        self.settle()
        clear_stage(self)

    # ── 어른벌레 ──
    def adult(self):
        self.section("어른벌레")
        p = pupa(2.4, "#C8D9B0").move_to([-3.5, 0.4, 0])
        twig = Line([-5.6, 2.0, 0], [-1.4, 2.0, 0], stroke_color=BROWN_DARK, stroke_width=14)
        self.say(f"번데기에서 어른벌레가 나와요 — {o('날개돋이')}",
                 "번데기의 등이 갈라지며 어른벌레가 나와요. 젖은 날개를 말린 뒤 날 수 있어요. 이것을 날개돋이라고 해요.")
        self.play(Create(twig), FadeIn(p), run_time=0.6)
        bf = butterfly(0.35).move_to([-3.5, 0.6, 0])
        self.play(FadeIn(bf), p.animate.set_opacity(0.35), run_time=0.7)
        self.play(bf.animate.scale(4.0).move_to([2.6, 0.4, 0]), run_time=1.4)
        word = tag("날개돋이", ORANGE, 40).move_to([-3.5, -2.0, 0])
        self.play(FadeIn(word), run_time=0.4)
        self.settle()
        self.play(FadeOut(VGroup(p, twig, word)), bf.animate.move_to([-3.6, 0.2, 0]), run_time=0.6)
        parts = [
            (bf.head, "머리", "더듬이·눈 한 쌍, 대롱 모양의 입", "머리에는 더듬이와 눈이 한 쌍씩 있고, 대롱 모양의 입으로 꽃의 꿀을 빨아 먹어요."),
            (bf.chest, "가슴", "날개 두 쌍, 다리 세 쌍", "가슴에는 날개 두 쌍과 다리 세 쌍이 있어요."),
            (bf.belly, "배", "길쭉하고 마디가 있어요", "배는 길쭉하고 마디가 있어요."),
        ]
        rows = VGroup()
        for i, (mob, nm, desc, narr) in enumerate(parts):
            row = VGroup(T(nm, 40, ORANGE), T(desc, 34, INK)).arrange(RIGHT, buff=0.35)
            if row.width > 7.6:
                row.scale_to_fit_width(7.6)
            row.move_to([-1.2, 1.6 - i * 1.05, 0], aligned_edge=LEFT)
            box = SurroundingRectangle(mob, color=ORANGE, buff=0.08, corner_radius=0.08)
            self.say(f"{o(nm)}: {desc}", narr)
            self.play(Create(box), FadeIn(row, shift=LEFT * 0.2), run_time=0.6)
            self.wait(0.2)
            self.play(FadeOut(box), run_time=0.3)
            rows.add(row)
        insect = tag("머리·가슴·배 + 다리 세 쌍 = 곤충", GREEN, 38).move_to([2.6, -1.75, 0])
        self.say(f"이런 동물을 {g('곤충')}이라고 해요",
                 "몸이 머리, 가슴, 배로 구분되고 다리가 세 쌍인 동물을 곤충이라고 해요. 배추흰나비는 곤충이에요.")
        self.play(FadeIn(insect, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한살이 정리 ──
    def cycle(self):
        self.section("정리해요")
        c = np.array([0, 0.25, 0])
        pos = [c + np.array([-4.6, 0.0, 0]), c + np.array([0, 2.0, 0]), c + np.array([4.6, 0.0, 0]), c + np.array([0, -1.75, 0])]
        pics = [bf_egg(1.3), caterpillar(2.4), pupa(1.6).rotate(PI / 2), butterfly(0.72)]
        names = ["알", "애벌레", "번데기", "어른벌레"]
        days = ["5일~7일", "15일~20일", "7일~10일", ""]
        items = VGroup()
        for p, pic, nm in zip(pos, pics, names):
            pic.move_to(p + UP * 0.2)
            lab = T(nm, 38, INK).next_to(pic, DOWN, buff=0.15)
            items.add(VGroup(pic, lab))
        items[3][1].next_to(items[3][0], RIGHT, buff=0.3)
        arrows = VGroup()
        ends = [(items[0], items[1]), (items[1], items[2]), (items[2], items[3]), (items[3], items[0])]
        for k, (a_, b_) in enumerate(ends):
            st = a_.get_center()
            en = b_.get_center()
            d = en - st
            st2 = st + d * (0.36 if k < 3 else 0.42)
            en2 = st + d * (0.64 if k < 3 else 0.7)
            arw = CurvedArrow(st2, en2, angle=-0.6, color=ORANGE, stroke_width=6, tip_length=0.22)
            arrows.add(arw)
        self.say("배추흰나비의 한살이를 정리해요", "배추흰나비의 한살이를 처음부터 정리해 볼게요.")
        self.play(FadeIn(items[0], scale=0.8), run_time=0.5)
        narr = ["알에서 애벌레가 나와요. 알을 낳고 보통 5일에서 7일이 지나면 애벌레가 나와요.",
                "애벌레는 허물을 벗으며 자라고, 보통 15일에서 20일이 지나면 번데기가 돼요.",
                "번데기가 된 뒤 약 7일에서 10일이 지나면 어른벌레가 나와요.",
                "어른벌레는 짝짓기를 한 뒤에 알을 낳아요. 그래서 한살이가 다시 이어져요."]
        subs = [f"알 → 애벌레 (보통 {days[0]})", f"애벌레 → 번데기 (보통 {days[1]})", f"번데기 → 어른벌레 (약 {days[2]})",
                f"어른벌레가 알을 낳아 {o('한살이가 다시 이어져요')}"]
        for k in range(4):
            self.say(subs[k], narr[k])
            anims = [Create(arrows[k])]
            if k < 3:
                anims.append(FadeIn(items[k + 1], scale=0.8))
            self.play(*anims, run_time=0.8)
        note = T("기온에 따라 기간은 달라질 수 있어요", 30, SOFT).move_to([0, 0.25, 0])
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'
