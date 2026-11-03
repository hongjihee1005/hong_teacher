"""「과학 원리 돋보기」 6학년 15화 — 줄기의 생김새와 하는 일 (6-1 3단원 식물의 구조와 기능 4차시, 화 코드 6-1-3-c)

바탕: grade6/science/sem1/u3-3.html(원본 _build_tb/src/u3-3.html) — 도입(은행나무 줄기는 곧고 굵음, 등나무 줄기는 감아 올라감 → 다양),
백합 관찰(줄기는 곧음·잎 여러 개·꽃잎 흰색), 단면(가로: 흰색 점이 퍼짐, 세로: 흰색 선), 붉은색 색소 물에 하루(앱 영상 차례) →
꽃과 잎이 붉은빛, 다시 자른 단면(붉은 점·붉은 선 = 물이 이동한 통로), 정리(물은 줄기를 통해 잎·꽃으로, 줄기는 곧게 서서 지지),
여러 가지 줄기(봉선화·나팔꽃·딸기·감자, 담쟁이덩굴), 감자는 줄기·고구마는 뿌리, 한눈에 쏙.
최종: ./make_final.sh s6ep15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform,
                   Rectangle, RoundedRectangle, Line, Circle, Rotate, VMobject)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def vine_pole(h=2.6, turns=3.5, leaves=True):
    """막대를 감고 올라가는 줄기. 바닥 가운데 = (0,0)"""
    pole = Rectangle(width=0.16, height=h, fill_color="#C9A77A", fill_opacity=1, stroke_color=K.SOIL_D, stroke_width=2).move_to([0, h / 2, 0])
    pts = [np.array([0.22 * np.sin(t * turns * 2 * np.pi), 0.1 + t * (h - 0.2), 0]) for t in np.linspace(0, 1, 60)]
    v = VMobject(stroke_color=K.STEM, stroke_width=6)
    v.set_points_smoothly(pts)
    g_ = VGroup(pole, v)
    if leaves:
        for i, t in enumerate(np.linspace(0.2, 0.9, 4)):
            sg = 1 if i % 2 else -1
            g_.add(K.E(0.42, 0.22, K.LEAF_FILL, sg * 0.42, t * h, stroke=K.LEAF_EDGE, sw=2))
    return g_


def runner(w=3.0):
    """땅 위를 기듯이 뻗는 줄기(딸기). 왼쪽 그루 = (0,0)"""
    g_ = VGroup()
    st = VMobject(stroke_color=K.STEM, stroke_width=5)
    st.set_points_smoothly([[0, 0.1, 0], [w * 0.3, 0.22, 0], [w * 0.6, 0.12, 0], [w, 0.08, 0]])
    g_.add(st)
    for x in (0.0, w * 0.55, w):
        for a in (-0.5, 0, 0.5):
            e = K.E(0.22, 0.42, K.LEAF_FILL, x, 0.35, stroke=K.LEAF_EDGE, sw=2)
            e.rotate(a, about_point=np.array([x, 0.12, 0]))
            g_.add(e)
    g_.add(K.C(0.12, "#E2453B", w * 0.3, 0.05, stroke="#9A2A22", sw=2))
    return g_


class S6Ep15(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 15
    EP_TITLE = "줄기의 생김새와 하는 일"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.lily_look()
        self.cut()
        self.dye()
        self.kinds()
        self.misc()
        self.summary()
        self.closing(f"줄기에는 {o('물이 이동하는 통로')}가 있고,\n대부분 곧게 서서 식물을 {g('지지')}해요",
                     next_preview="6학년 16화 · 잎에서 양분이 만들어진다고?")
        self.wait(0.5)

    def intro(self):
        self.section("궁금해요")
        t1 = K.tree(3.6).move_to([-3.2, 0.3, 0])
        t2 = vine_pole(3.4).move_to([2.6, 0.3, 0])
        l1 = T("은행나무", 32).next_to(t1, DOWN, buff=0.2)
        l2 = T("등나무", 32).next_to(t2, DOWN, buff=0.2)
        self.say("내가 아는 식물 줄기는 어떻게 생겼나요?", "내가 알고 있는 식물 줄기의 생김새를 이야기해 볼까요?")
        self.play(FadeIn(t1), FadeIn(t2), FadeIn(l1), FadeIn(l2), run_time=0.8)
        self.say(f"은행나무는 {o('곧고 굵고')}, 등나무는 {o('감아 올라가요')}",
                 "은행나무 줄기는 곧고 굵어요. 등나무 줄기는 다른 구조물을 감아 올라가요.")
        self.play(Indicate(t1[1], color=ORANGE), run_time=0.7)
        self.play(Indicate(t2[1], color=ORANGE), run_time=0.7)
        self.say(f"식물에 따라 줄기의 생김새는 {g('다양해요')}",
                 "식물에 따라 줄기의 생김새는 다양해요. 줄기는 뿌리와 잎, 꽃 등을 연결해요.")
        self.settle()
        clear_stage(self)

    def lily_look(self):
        self.section("관찰해요")
        ly = K.lily(4.6).move_to([-3.6, 0.3, 0])
        card = K.text_card([f"· 백합 줄기는 {o('곧습니다')}.", f"· 줄기에 여러 개의 {o('잎')}이 붙어 있습니다.",
                            f"· 꽃잎은 {o('흰')}색입니다."], size=36).move_to([2.6, 0.5, 0])
        self.say("백합의 생김새를 관찰해요", "백합의 생김새를 관찰해요.")
        self.play(FadeIn(ly, shift=UP * 0.2), run_time=0.8)
        self.say(f"줄기는 {o('곧고')}, 여러 개의 {o('잎')}이 붙어 있어요",
                 "백합 줄기는 곧고, 줄기에 여러 개의 잎이 붙어 있어요. 꽃잎은 흰색이에요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    def sections(self, red, y=0.4):
        c = K.stem_cross(1.25, red).move_to([-2.4, y, 0])
        l = K.stem_long(1.0, 3.0, red).move_to([2.4, y, 0])
        lc = T("가로로 자른 단면", 32).next_to(c, DOWN, buff=0.25)
        ll = T("세로로 자른 단면", 32).next_to(l, DOWN, buff=0.25)
        return c, l, lc, ll

    def cut(self):
        self.section("줄기 단면")
        c, l, lc, ll = self.sections(0.0)
        warn = K.safety_note("줄기는 유리판 위에서 자르고, 안전 장갑을 껴요", w=8.6, size=28).move_to([0, 2.65, 0])
        self.say("백합 줄기를 가로와 세로로 잘라 봐요", "백합 줄기를 가로와 세로로 잘라 단면을 관찰해요.")
        self.play(FadeIn(warn), FadeIn(c), FadeIn(l), FadeIn(lc), FadeIn(ll), run_time=0.8)
        self.say(f"가로 단면은 {o('흰색 점')}, 세로 단면은 {o('흰색 선')}이 보여요",
                 "가로 단면에는 흰색 점들이 퍼져 있는 것처럼 보이고, 세로 단면에는 흰색 선들이 보여요.")
        self.play(Indicate(VGroup(*c[1:]), color=ORANGE), run_time=0.8)
        self.play(Indicate(VGroup(*l[1:]), color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    def dye(self):
        self.section("실험해요")
        fl = K.flask(1.9, K.DYE, 0.65).move_to([0, -1.5, 0])
        fl.shift([0, -2.45 - fl.get_bottom()[1], 0])
        ly = K.lily(4.4)
        ly.shift([0, fl.get_bottom()[1] + 0.25, 0])
        self.say(f"붉은색 색소를 녹인 물에 백합 줄기를 넣어요",
                 "선생님이 붉은색 식용 색소를 녹여 준비한 물에 백합 줄기를 넣고, 햇빛이 잘 드는 곳에 하루 동안 놓아두어요.")
        self.play(FadeIn(fl), run_time=0.5)
        self.play(FadeIn(ly, shift=DOWN * 0.3), run_time=0.8)
        self.bring_to_front(fl)
        sn = K.sun(0.45).move_to([4.0, 1.9, 0])
        day = T("하루 뒤", 40, self.accent).move_to([4.0, 0.7, 0])
        self.play(FadeIn(sn), run_time=0.4)
        self.settle()
        self.pause_screen(5, "하루 뒤 백합은 어떻게 변할까요?")
        ly2 = K.lily(4.4, 1.0)
        ly2.move_to(ly)
        self.say(f"꽃과 잎이 {r('붉은빛')}을 띠어요",
                 "하루 뒤, 백합의 꽃과 잎이 붉은빛을 띠어요. 줄기가 잎, 꽃과도 연결되어 있기 때문이에요.")
        self.play(FadeIn(day), Transform(ly, ly2), run_time=1.6)
        self.settle()
        clear_stage(self)
        c, l, lc, ll = self.sections(1.0)
        self.say(f"다시 잘라 보면 {r('붉은 점')}과 {r('붉은 선')}이 보여요",
                 "하루 뒤 줄기를 다시 자르면, 가로 단면에는 붉은 점들이 퍼져 있고, 세로 단면에는 붉은 선들이 줄기를 따라 이어져 있어요.")
        self.play(FadeIn(c), FadeIn(l), FadeIn(lc), FadeIn(ll), run_time=0.8)
        self.settle()
        tag = K.text_card([f"붉게 물든 부분 = {o('물이 이동한 통로')}"], size=36, stroke=ORANGE).move_to([0, 2.6, 0])
        self.say(f"붉게 물든 부분은 {o('물이 이동한 통로')}예요",
                 "줄기가 색소를 만든 것이 아니라, 색소 물이 줄기의 통로를 따라 올라온 거예요. 붉게 물든 부분은 물이 이동한 통로예요.")
        self.play(FadeIn(tag), run_time=0.6)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"· 줄기에서 붉게 변한 부분은 {o('물')}이 이동한 통로입니다.",
                            f"· 물은 {o('줄기')}를 통해 잎과 꽃 등으로 이동합니다.",
                            f"· 대부분의 식물 줄기는 곧게 서서 식물을 {g('지지')}합니다."], size=36).move_to([0, 0.4, 0])
        self.say(f"물은 {o('줄기')}를 통해 잎과 꽃으로 이동해요",
                 "물은 줄기를 통해 잎과 꽃 등으로 이동해요. 그리고 대부분의 식물 줄기는 곧게 서서 식물을 지지해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    def kinds(self):
        self.section("여러 가지 줄기")
        pics = [K.balsam("all", bag=False), vine_pole(2.0), runner(2.2), K.potato(1.5)]
        names = ["봉선화", "나팔꽃", "딸기", "감자"]
        jobs = ["곧게 서서\n식물을 지지", "다른 식물이나 물체를\n감고 올라감", "땅 위를\n기듯이 뻗음", "줄기에\n양분을 저장"]
        cards = VGroup()
        for p, n, j in zip(pics, names, jobs):
            box = RoundedRectangle(corner_radius=0.2, width=3.1, height=4.6, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=4)
            K.fit(p, 2.4, 2.2).move_to(box.get_center() + UP * 0.85)
            nt = T(n, 34).move_to(box.get_center() + DOWN * 0.65)
            jt = K.name_text(j, 26, self.accent).move_to(box.get_center() + DOWN * 1.55)
            cards.add(VGroup(box, p, nt, jt))
        cards.arrange(RIGHT, buff=0.3).move_to([0, 0.25, 0])
        self.say("식물마다 줄기의 생김새와 하는 일이 달라요",
                 "봉선화 줄기는 곧게 서서 식물을 지지하고, 나팔꽃 줄기는 다른 식물이나 물체를 감고 올라가요.")
        self.play(FadeIn(cards[0]), run_time=0.5)
        self.play(FadeIn(cards[1]), run_time=0.5)
        self.settle()
        self.say(f"딸기는 {o('땅 위를 기듯이')}, 감자는 줄기에 {o('양분을 저장')}해요",
                 "딸기 줄기는 땅 위를 기듯이 뻗고, 감자는 줄기에 양분을 저장해요. 담쟁이덩굴 줄기는 다른 식물이나 물체를 타고 올라가요.")
        self.play(FadeIn(cards[2]), run_time=0.5)
        self.play(FadeIn(cards[3]), run_time=0.5)
        self.settle()
        clear_stage(self)

    def misc(self):
        self.section("생각 바로잡기")
        sp = K.sweet_potato(2.4).move_to([-3.2, 0.5, 0])
        po = K.potato(2.0).move_to([3.2, 0.5, 0])
        q = T("감자는 고구마처럼 뿌리일까요?", 44).move_to([0, 2.5, 0])
        self.say("감자는 고구마처럼 식물의 뿌리일까요?", "감자는 고구마처럼 식물의 뿌리일까요?")
        self.play(FadeIn(q), FadeIn(sp), FadeIn(po), run_time=0.7)
        ls = T("고구마 = 뿌리", 40, ORANGE).next_to(sp, DOWN, buff=0.45)
        lp = T("감자 = 줄기", 40, GREEN).next_to(po, DOWN, buff=0.45)
        self.say(f"고구마는 {o('뿌리')}, 감자는 양분을 저장하는 {g('줄기')}예요",
                 "고구마는 뿌리에 양분을 저장해요. 감자는 고구마와 비슷해 보이지만 양분을 저장하는 줄기예요.")
        self.play(FadeIn(ls), run_time=0.5)
        self.play(FadeIn(lp), Indicate(po, color=GREEN), run_time=0.8)
        self.settle()
        clear_stage(self)

    def summary(self):
        self.section("한눈에 쏙")
        ly = K.lily(3.0, 1.0).move_to([-4.6, 0.8, 0])
        c = K.stem_cross(0.9, 1.0).move_to([-1.6, 0.8, 0])
        l = K.stem_long(0.7, 2.2, 1.0).move_to([0.4, 0.8, 0])
        t2 = vine_pole(2.2).move_to([2.6, 0.8, 0])
        po = K.potato(1.3).move_to([4.8, 0.6, 0])
        card = K.text_card([f"줄기에는 {o('물')}이 이동하는 통로가 있습니다."], size=40).move_to([0, -1.7, 0])
        self.say(f"줄기에는 {o('물')}이 이동하는 통로가 있어요",
                 "줄기에는 물이 이동하는 통로가 있어요. 뿌리에서 흡수한 물은 이 통로를 통해 잎이나 꽃으로 이동해요.")
        self.play(FadeIn(VGroup(ly, c, l, t2, po), lag_ratio=0.1), run_time=0.9)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
