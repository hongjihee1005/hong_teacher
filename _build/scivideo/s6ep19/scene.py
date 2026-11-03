"""「과학 원리 돋보기」 6학년 19화 — 식물의 기관은 연결되어 있어요 (6-1 3단원 식물의 구조와 기능 8차시, 화 코드 6-1-3-g)

바탕: grade6/science/sem1/u3-7.html(원본 _build_tb/src/u3-7.html) — 도입(톱니바퀴 하나가 빠지면 시계가 멈춤 → 식물도 기관이 연결),
식물의 기관(애기똥풀: 뿌리·줄기·잎·꽃·열매, 열매는 좁은 원기둥 모양), 기관이 하는 일 짝짓기, 물과 양분의 이동 경로(물: 뿌리 → 줄기 → 잎 →
기공 밖, 양분: 잎 → 줄기 → 식물 전체, 남은 양분은 뿌리·줄기·열매 등에 저장), 이동 놀이 정리(공통으로 지나간 기관은 줄기),
한 기관에 문제가 생기면, 한눈에 쏙. 더 알아보기는 u3-8(창의가 팡팡 · 우리 반 식물도감)의 나누기 문제(애기똥풀 노란색 즙, 토끼풀 꽃·줄기,
소나무 바늘잎·노란 꽃가루).
최종: ./make_final.sh s6ep19
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform,
                   Rectangle, RoundedRectangle, Line, Circle, Rotate, VMobject, MoveAlongPath, Dot, Square, LaggedStart,
                   rate_functions, PI)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def wb(s):
    return f'<span foreground="{K.WATER_C}">{s}</span>'


def fy(s):
    return f'<span foreground="#B88A00">{s}</span>'


class S6Ep19(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 19
    EP_TITLE = "식물의 기관은 연결되어 있어요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.organs()
        self.paths()
        self.linked()
        self.more()
        self.summary()
        self.closing(f"뿌리에서 흡수한 물과 잎에서 만든 양분은\n{o('줄기')}를 통해 식물 전체로 이동해요",
                     next_preview="6학년 20화 · 하루 동안 태양과 별의 위치")
        self.wait(0.5)

    def intro(self):
        self.section("궁금해요")
        g1 = K.gear(0.95, 12, "#F2C94C").move_to([-5.0, 0.4, 0])
        g2 = K.gear(0.62, 8, "#7FB3E0").move_to([-3.38, 0.4, 0])
        g3 = K.gear(0.56, 8, "#9CC56B").move_to([-2.0, 0.4, 0])
        ck = K.clock_face(1.5).move_to([2.6, 0.4, 0])
        self.say("톱니바퀴 하나가 빠지면 어떻게 될까요?", "톱니바퀴 하나가 빠지면 어떻게 될까요?")
        self.play(FadeIn(VGroup(g1, g2, g3, ck)), run_time=0.7)
        c = ck[0].get_center()
        self.play(Rotate(g1, -PI / 3), Rotate(g2, PI / 2), Rotate(g3, -PI / 2), Rotate(ck.hand, -PI / 2, about_point=c),
                  run_time=1.6, rate_func=rate_functions.linear)
        self.play(g2.animate.shift(DOWN * 2.2).set_opacity(0.3), run_time=0.7)
        self.play(Rotate(g1, -PI / 6), run_time=0.8)
        stop = T("멈췄어요!", 40, RED).next_to(ck, DOWN, buff=0.25)
        self.say(f"하나가 빠지자 {r('시계가 멈췄어요')}", "하나가 빠지자 시계가 멈췄어요. 톱니바퀴들이 연결되어 함께 움직이기 때문이에요.")
        self.play(FadeIn(stop), run_time=0.5)
        self.say(f"식물도 각 기관이 {o('연결')}되어 있을 것 같아요", "식물도 이와 같이 각 기관이 연결되어 있을 것 같아요.")
        self.settle()
        clear_stage(self)

    def organs(self):
        self.section("식물의 기관")
        h = K.herb(5.2).move_to([-2.9, 0.12, 0])
        L = [("fruit", "열매", (-6.2, 2.3)), ("flower", "꽃", (0.6, 2.4)), ("leaf", "잎", (-6.3, 0.2)),
             ("stem", "줄기", (0.6, 0.6)), ("root", "뿌리", (0.6, -1.9))]
        ps = VGroup(*[K.pointer(h.pt(k), at, t, INK, 32) for k, t, at in L])
        self.say(f"식물은 {o('뿌리 · 줄기 · 잎 · 꽃 · 열매')} 등으로 이루어져 있어요",
                 "애기똥풀을 살펴봐요. 식물은 뿌리, 줄기, 잎, 꽃, 열매 등으로 이루어져 있어요. 애기똥풀의 열매는 좁은 원기둥 모양이에요.")
        self.play(FadeIn(h), run_time=0.7)
        self.play(FadeIn(ps, lag_ratio=0.2), run_time=1.4)
        self.settle()
        jobs = K.text_card([f"{o('뿌리')}: 물을 흡수해요", f"{o('줄기')}: 물과 양분이 이동하는 통로",
                            f"{o('잎')}: 양분을 만들고, 물을 내보내요", f"{o('꽃')}: 꽃가루받이, 씨를 만들어요",
                            f"{o('열매')}: 씨를 보호하고 퍼뜨려요"], w=5.6, size=27).move_to([4.15, 0.25, 0])
        self.say("기관마다 생김새와 하는 일이 달라요",
                 "뿌리는 물을 흡수하고, 줄기는 물과 양분이 이동하는 통로예요. 잎은 양분을 만들고 물을 내보내요. 꽃은 씨를 만들고, 열매는 씨를 보호하고 퍼뜨려요.")
        self.play(FadeOut(VGroup(*[p for p in ps if p.lab.get_center()[0] > 0])), FadeIn(jobs, shift=LEFT * 0.2), run_time=0.8)
        self.settle()
        clear_stage(self)

    def paths(self):
        self.section("물과 양분의 이동")
        h = K.herb(5.2).move_to([-3.0, 0.12, 0])
        self.play(FadeIn(h), run_time=0.6)
        wp = h.water_paths()
        dots, anims = VGroup(), []
        for k in range(10):
            pth = wp[k % 5]
            v = VMobject().set_points_as_corners(pth)
            d = Dot(pth[0], radius=0.08, color=K.WATER_C).set_stroke("#FFFFFF", 1.5)
            dots.add(d)
            anims.append(MoveAlongPath(d, v))
        wcard = K.text_card([f"{wb('물')}: 뿌리 → 줄기 → 잎", "→ 일부는 기공을 통해 밖으로"], w=6.4, size=30).move_to([3.75, 1.4, 0])
        self.say(f"{wb('물')}은 뿌리에서 흡수되어 {o('줄기')}를 통해 이동해요",
                 "뿌리에서 흡수된 물은 줄기를 통해 식물의 각 부분으로 이동하여 사용되고, 물의 일부는 잎의 기공을 통해 식물 밖으로 빠져나가요.")
        self.play(LaggedStart(*anims, lag_ratio=0.12), FadeIn(wcard), run_time=2.6)
        puffs = VGroup(*[K.vapor_puffs(t, 3) for t in h.leaf_tips()])
        self.play(FadeIn(puffs, shift=UP * 0.2), FadeOut(dots), run_time=0.6)
        self.settle()
        fp = h.food_paths()
        sq, anims = VGroup(), []
        for k in range(10):
            pth = fp[k % 5]
            v = VMobject().set_points_as_corners(pth)
            s_ = Square(0.16, fill_color=K.FOOD_C, fill_opacity=1, stroke_color="#A87A00", stroke_width=2).move_to(pth[0])
            sq.add(s_)
            anims.append(MoveAlongPath(s_, v))
        fcard = K.text_card([f"{fy('양분')}: 잎 → 줄기 → 식물 전체", "→ 남은 양분은 뿌리·줄기·열매 등에 저장"], w=6.4, size=30).move_to([3.75, -0.9, 0])
        self.say(f"{fy('양분')}은 잎에서 만들어져 {o('줄기')}를 통해 이동해요",
                 "잎에서 광합성으로 만들어진 양분은 줄기를 통해 식물의 각 부분으로 이동하여 사용되고, 남은 양분은 뿌리나 줄기, 열매 등에 저장돼요.")
        self.play(FadeOut(puffs), LaggedStart(*anims, lag_ratio=0.12), FadeIn(fcard), run_time=2.8)
        self.settle()
        self.pause_screen(5, "물과 양분이 모두 지나가는 기관은?")
        self.say(f"물과 양분이 모두 지나가는 기관은 {o('줄기')}예요",
                 "물은 잎에서 끝나고, 양분은 열매나 뿌리 쪽으로 가요. 물과 양분이 모두 지나가는 기관은 줄기예요.")
        self.play(Indicate(h.parts["stem"], color=ORANGE, scale_factor=1.05), run_time=1.0)
        self.settle()
        clear_stage(self)

    def linked(self):
        self.section("생각해요")
        h = K.herb(5.0).move_to([-4.0, 0.2, 0])
        g1 = K.gear(0.55, 10, "#F2C94C").move_to([1.4, 1.2, 0])
        g2 = K.gear(0.42, 8, "#7FB3E0").move_to([2.55, 1.2, 0])
        g3 = K.gear(0.42, 8, "#9CC56B").move_to([3.57, 1.2, 0])
        q = T("한 기관에 문제가 생긴다면?", 40).move_to([2.4, 2.65, 0])
        self.say("식물의 한 기관에 문제가 생긴다면 어떻게 될까요?", "식물의 기관 중 한 기관에 문제가 생긴다면 식물은 어떻게 될까요?")
        self.play(FadeIn(h), FadeIn(q), FadeIn(VGroup(g1, g2, g3)), run_time=0.7)
        card = K.text_card([f"각 기관은 서로 {o('밀접한 관련')}이 있어서", f"다른 기관에도 {r('영향')}을 주어", "식물이 살아가는 데 문제가 생길 수 있어요"], size=30).move_to([2.75, -0.6, 0])
        self.say(f"다른 기관에도 {r('영향')}을 주어 살아가는 데 문제가 생겨요",
                 "식물의 각 기관은 각자의 역할이 있지만 서로 밀접한 관련이 있어서, 한 기관에 문제가 생기면 다른 기관에도 영향을 주어 생명활동에 문제가 생길 수 있어요.")
        self.play(FadeIn(card, shift=UP * 0.2), h.parts["root"].animate.set_opacity(0.25), run_time=0.8)
        self.settle()
        clear_stage(self)

    def more(self):
        self.section("더 알아보기")
        items = [(K.small_flower(4, "#FFD93B", 0.6, "#C9A300", "#E8B800"), "애기똥풀", "줄기나 잎을 자르면\n노란색 즙이 나와요"),
                 (VGroup(*[K.C(0.1, "#FFFFFF", np.cos(a) * 0.32, np.sin(a) * 0.32, stroke="#9AA0A6", sw=2) for a in np.linspace(0, 6.28, 14)],
                         *[K.C(0.1, "#FFFFFF", np.cos(a) * 0.14, np.sin(a) * 0.14, stroke="#9AA0A6", sw=2) for a in np.linspace(0, 6.28, 7)]),
                  "토끼풀", "여러 송이의 꽃이 모여\n하나의 꽃처럼 보여요"),
                 (VGroup(*[K.L((0, 0), (np.sin(a) * 0.9, np.cos(a) * 0.9), "#2F6B2A", 5) for a in (-0.25, 0.25)],
                         K.L((0, -0.2), (0, 0.05), K.BROWN, 6)), "소나무", "바늘 모양 잎이 2개씩 나고\n봄에 노란 꽃가루가 날려요")]
        cards = VGroup()
        for p, n, t_ in items:
            box = RoundedRectangle(corner_radius=0.2, width=4.1, height=4.3, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=4)
            K.fit(p, 1.6, 1.4).move_to(box.get_center() + UP * 1.1)
            nt = T(n, 36, self.accent).move_to(box.get_center() + DOWN * 0.15)
            tt = K.name_text(t_, 28)
            if tt.width > 3.75:
                tt.scale_to_fit_width(3.75)
            tt.move_to(box.get_center() + DOWN * 1.2)
            cards.add(VGroup(box, p, nt, tt))
        cards.arrange(RIGHT, buff=0.35).move_to([0, 0.3, 0])
        self.say("식물마다 구조와 특징이 서로 달라요 — 우리 반 식물도감",
                 "우리 반 친구들의 모습이 서로 다르듯이 식물도 각자 다른 모습과 특징이 있어요. 식물의 특징을 조사해 우리 반 식물도감을 만들어 봐요.")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=1.2)
        self.settle()
        clear_stage(self)

    def summary(self):
        self.section("한눈에 쏙")
        h = K.herb(4.4).move_to([-4.0, 0.6, 0])
        st = h.parts["stem"]
        lab = K.pointer(h.pt("stem"), (-0.9, 1.6), "줄기", ORANGE, 34)
        card = K.text_card([f"뿌리에서 흡수한 물과 잎에서 만든 양분은", f"{o('줄기')}를 통해 식물 전체로 이동합니다."], w=7.4, size=36).move_to([3.2, 0.3, 0])
        self.say(f"물과 양분은 {o('줄기')}를 통해 식물 전체로 이동해요",
                 "뿌리에서 흡수한 물과 잎에서 만든 양분은 줄기를 통해 식물 전체로 이동해요. 이처럼 식물의 각 기관은 서로 연결되어 있어요.")
        self.play(FadeIn(h), FadeIn(lab), run_time=0.7)
        self.play(FadeIn(card, shift=LEFT * 0.2), Indicate(st, color=ORANGE, scale_factor=1.04), run_time=0.8)
        self.settle()
        clear_stage(self)
