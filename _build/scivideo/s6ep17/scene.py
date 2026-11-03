"""「과학 원리 돋보기」 6학년 17화 — 잎에 도달한 물은? (6-1 3단원 식물의 구조와 기능 6차시, 화 코드 6-1-3-e)

바탕: grade6/science/sem1/u3-5.html(원본 _build_tb/src/u3-5.html) — 도입(식물이 많은 온실 안이 더 습함 → 식물에서 수증기),
푸른색 염화 코발트 종이(물을 흡수하면 붉은색, 핀셋으로 집음), 증산 작용 확인 실험(페트리 접시에 붙인 종이 · 잎 뒷면에 붙인 종이 · 햇빛 · 10분 →
접시 종이 그대로 푸른색, 잎 종이 붉은색, 접시는 비교용), 기공(강낭콩 모양 세포 두 개 사이 작은 구멍, 대부분 잎 뒷면),
물의 이동과 증산 작용(앱 영상 차례: 뿌리 → 줄기 → 잎 → 기공 밖), 증산 작용이 하는 일, 더 알아보기(봉선화 세 개에 비닐봉지 —
잎을 그대로 둔 것에 물방울이 가장 많음), 사막 식물의 좁은 잎, 한눈에 쏙.
최종: ./make_final.sh s6ep17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform,
                   Rectangle, RoundedRectangle, Line, Circle, Rotate, VMobject, MoveAlongPath, Dot, AnimationGroup,
                   LaggedStart)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def cb(s):
    return f'<span foreground="{K.CO_BLUE}">{s}</span>'


def cr(s):
    return f'<span foreground="#D04A6C">{s}</span>'


class S6Ep17(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 17
    EP_TITLE = "잎에 도달한 물은?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.paper()
        self.experiment()
        self.stoma()
        self.flow()
        self.bags()
        self.desert()
        self.summary()
        self.closing(f"잎에 도달한 물의 일부는 {o('기공')}을 통해\n수증기로 빠져나가요 — {g('증산 작용')}",
                     next_preview="6학년 18화 · 꽃의 생김새와 하는 일")
        self.wait(0.5)

    def intro(self):
        self.section("궁금해요")
        gh = K.greenhouse(5.2, 3.0, mist=True).move_to([-2.4, 0.2, 0])
        self.say("식물이 많은 온실 안은 밖보다 습할까요, 건조할까요?",
                 "식물이 많은 온실 안의 습도는 온실 밖의 습도와 어떻게 다를까요?")
        self.play(FadeIn(gh), run_time=0.8)
        card = K.text_card([f"온실 안이 더 {o('습해요')}", "많은 식물에서 수증기가", "나오기 때문인 것 같아요"], size=34).move_to([4.2, 0.4, 0])
        self.say(f"온실 안이 더 {o('습해요')} — 식물에서 수증기가 나오는 것 같아요",
                 "식물이 많은 온실 안이 더 습해요. 안경에 김이 서린 적이 있나요? 온실 안의 많은 식물에서 수증기가 나오기 때문인 것 같아요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), Indicate(gh.mist, color=K.WATER_C, scale_factor=1.05), run_time=0.9)
        self.settle()
        clear_stage(self)

    def paper(self):
        self.section("염화 코발트 종이")
        p = K.cobalt(2.0).move_to([-2.4, 0.3, 0])
        lab = T("푸른색 염화 코발트 종이", 32).next_to(p, DOWN, buff=0.3)
        self.say("푸른색 염화 코발트 종이에 물을 한 방울 떨어뜨려요",
                 "푸른색 염화 코발트 종이에 물을 한 방울 떨어뜨려 봐요.")
        self.play(FadeIn(p), FadeIn(lab), run_time=0.6)
        dr = K.E(0.3, 0.42, K.WATER, -2.4, 2.4, stroke=K.WATER_C, sw=3)
        self.play(FadeIn(dr), run_time=0.3)
        self.play(dr.animate.move_to([-2.4, 0.3, 0]).set_opacity(0), run_time=0.6)
        spot = K.E(1.0, 0.8, K.CO_RED, -2.4, 0.3, stroke=K.CO_RED, sw=0)
        self.play(FadeIn(spot, scale=0.4), run_time=0.7)
        card = K.text_card([f"물을 흡수하면 {cr('붉은색')}으로 변해요", "밀봉해 보관하고, 핀셋으로 집어요"], size=32).move_to([3.3, 0.3, 0])
        self.say(f"물을 흡수하면 {cr('붉은색')}으로 변해요",
                 "푸른색 염화 코발트 종이는 물을 흡수하면 붉은색으로 변해요. 그래서 밀봉해 보관하고, 맨손이 아닌 핀셋으로 집어요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def experiment(self):
        self.section("실험해요")
        d = K.petri(1.3).move_to([-3.3, 0.4, 0])
        p1 = K.cobalt(0.7).move_to(d)
        lf = K.leaf_part(0.95).move_to([3.0, 0.5, 0])
        p2 = K.cobalt(0.7).move_to(lf.blade.get_center() + DOWN * 0.05)
        n1 = T("페트리 접시에 붙인 종이", 30).move_to([-3.3, -1.45, 0])
        n2 = T("잎 뒷면에 붙인 종이", 30).move_to([3.0, -1.45, 0])
        self.say(f"페트리 접시와 {o('잎 뒷면')}에 종이를 붙이고 햇빛에 10분",
                 "페트리 접시와 잎 뒷면에 각각 푸른색 염화 코발트 종이를 붙이고, 햇빛이 잘 드는 곳에 10분 동안 놓아두어요.")
        self.play(FadeIn(d), FadeIn(p1), FadeIn(n1), run_time=0.6)
        self.play(FadeIn(lf), FadeIn(p2), FadeIn(n2), run_time=0.6)
        sn = K.sun(0.4).move_to([0, 2.2, 0])
        self.play(FadeIn(sn), run_time=0.4)
        self.settle()
        self.pause_screen(5, "10분 뒤 두 종이의 색깔은?")
        self.say(f"접시의 종이는 그대로 {cb('푸른색')}, 잎 뒷면의 종이는 {cr('붉은색')}",
                 "10분 뒤, 페트리 접시에 붙인 종이는 그대로 푸른색이고, 잎 뒷면에 붙인 종이는 붉은색으로 변했어요.")
        self.play(p2.animate.set_fill(K.CO_RED), run_time=1.4)
        self.settle()
        card = K.text_card([f"잎을 통해 물이 식물 {o('밖으로')} 빠져나가요"], size=36, stroke=ORANGE).move_to([0, -2.35 + 0.0, 0]).shift(UP * 0.0)
        card.move_to([0, 2.55, 0])
        self.say(f"접시 종이는 {o('비교용')} — 공기 중의 물 때문이 아니에요",
                 "페트리 접시에도 종이를 붙인 것은 잎에 붙인 종이와 비교하려고예요. 공기 중의 물 때문에 색이 변한 것이 아님을 알 수 있어요.")
        self.play(FadeOut(sn), Indicate(p1, color=K.CO_BLUE, scale_factor=1.2), run_time=0.8)
        self.say(f"잎을 통해 물이 식물 {o('밖으로')} 빠져나가요",
                 "잎 뒷면에 붙인 종이만 붉게 변한 것으로 보아, 잎을 통해 물이 식물 밖으로 빠져나가요.")
        self.play(FadeIn(card), run_time=0.5)
        self.settle()
        clear_stage(self)

    def stoma(self):
        self.section("기공")
        v = K.cell_view("leaf", 1.75).move_to([-3.4, 0.35, 0])
        big = K.guard_pair(1.1).move_to([2.8, 0.4, 0])
        ring = Circle(radius=1.9, stroke_color=ORANGE, stroke_width=5).move_to([2.8, 0.4, 0])
        ptr = K.pointer(big.hole.get_center(), (5.4, -1.3), "기공", ORANGE, 36)
        self.say("사철나무잎 표피세포에서 본 강낭콩 모양 세포 두 개를 떠올려요",
                 "사철나무잎 뒷면의 표피세포를 관찰했던 것을 떠올려 봐요. 강낭콩 모양의 세포 두 개가 마주 보고 있었지요.")
        self.play(FadeIn(v), run_time=0.7)
        self.play(Create(ring), FadeIn(big), run_time=0.8)
        self.say(f"두 세포 사이의 아주 작은 구멍이 {o('기공')}이에요",
                 "두 세포 사이에 있는 아주 작은 구멍을 기공이라고 해요.")
        self.play(FadeIn(ptr), Indicate(big.hole, color=ORANGE, scale_factor=1.6), run_time=0.9)
        self.say(f"기공은 대부분 {o('잎의 뒷면')}에 있어요 — 그래서 뒷면에 붙였어요",
                 "기공은 대부분 잎의 뒷면에 있어요. 그래서 실험할 때 염화 코발트 종이를 잎 뒷면에 붙였어요.")
        self.settle()
        clear_stage(self)

    def flow(self):
        self.section("증산 작용")
        h = K.herb(5.6).move_to([-3.0, 0.15, 0])
        self.say(f"뿌리에서 흡수한 물은 {o('줄기')}를 거쳐 잎에 도달해요",
                 "뿌리에서 물을 흡수해요. 흡수한 물은 줄기를 거쳐 잎에 도달해요.")
        self.play(FadeIn(h), run_time=0.7)
        paths = h.water_paths()
        dots = VGroup()
        anims = []
        for k in range(10):
            pth = paths[k % 5]
            v = VMobject().set_points_as_corners(pth)
            d = Dot(pth[0], radius=0.08, color=K.WATER_C).set_stroke("#FFFFFF", 1.5)
            dots.add(d)
            anims.append(MoveAlongPath(d, v))
        self.play(LaggedStart(*anims, lag_ratio=0.12), run_time=2.6)
        self.settle()
        tips = h.leaf_tips()
        puffs = VGroup(*[K.vapor_puffs(t + np.array([0, 0.05, 0]), 3) for t in tips])
        card = K.text_card([f"잎에 도달한 물의 일부가 {o('수증기')}가 되어", f"{o('기공')}을 통해 식물 밖으로 빠져나가요",
                            f"→ {g('증산 작용')}"], size=32).move_to([3.4, 1.2, 0])
        self.say(f"물의 일부는 {o('수증기')}가 되어 기공으로 나가요 — {g('증산 작용')}",
                 "잎에 도달한 물의 일부는 수증기가 되어 잎의 기공을 통해 식물 밖으로 빠져나가요. 이것을 증산 작용이라고 해요.")
        self.play(FadeOut(dots), FadeIn(puffs, shift=UP * 0.3, lag_ratio=0.1), FadeIn(card), run_time=1.0)
        self.settle()
        jobs = K.text_card([f"증산 작용이 하는 일", f"· 뿌리에서 흡수된 물이 {o('잎까지 도달')}하게 해요",
                            f"· 식물의 {o('온도를 조절')}해요"], size=30).move_to([3.4, -1.15, 0])
        self.say(f"물을 {o('잎까지 끌어올리고')}, 식물의 {o('온도를 조절')}해요",
                 "증산 작용은 뿌리에서 흡수된 물이 잎까지 도달하게 하고, 식물의 온도를 조절해요. 양분을 만들거나 흙 속의 물을 흡수하는 일은 아니에요.")
        self.play(FadeIn(jobs, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def bags(self):
        self.section("더 알아보기")
        kinds = [("all", "잎을 그대로"), ("half", "잎을 절반만"), ("none", "잎을 모두 뗌")]
        ps = VGroup(*[K.balsam(k, True, 0, 2.8).move_to([x, 0.1, 0]) for (k, _), x in zip(kinds, (-4.2, 0, 4.2))])
        ls = VGroup(*[T(t, 30).move_to([x, -1.8, 0]) for (_, t), x in zip(kinds, (-4.2, 0, 4.2))])
        self.say("봉선화 세 개에 투명한 비닐봉지를 씌워 햇빛에 두어요",
                 "비슷한 봉선화 세 개를 하나는 그대로, 하나는 잎을 절반만, 하나는 잎을 모두 떼어 내고 투명한 비닐봉지를 씌워 햇빛에 두었어요.")
        self.play(FadeIn(ps, lag_ratio=0.1), FadeIn(ls), run_time=0.9)
        self.pause_screen(5, "물방울이 가장 많이 맺힌 것은?")
        news = [K.balsam(k, True, n, 2.8).move_to(p) for (k, _), n, p in zip(kinds, (34, 14, 2), ps)]
        self.say(f"{o('잎을 그대로 둔')} 봉선화에 물방울이 가장 많아요",
                 "잎을 그대로 둔 봉선화의 비닐봉지 안에 물방울이 가장 많이 생겼어요. 식물의 잎을 통해 물이 식물 밖으로 빠져나가요.")
        self.play(*[Transform(p, n_) for p, n_ in zip(ps, news)], run_time=1.4)
        self.play(Indicate(ls[0], color=ORANGE), run_time=0.7)
        self.settle()
        clear_stage(self)

    def desert(self):
        self.section("생각해요")
        sn = K.sun(0.5).move_to([-5.2, 2.0, 0])
        dune = K.poly([(-6.6, -1.8), (-3.0, -0.9), (0.2, -1.5), (0.2, -2.2), (-6.6, -2.2)], "#F0D9A0", stroke="#C9A35A", sw=3)
        pl = VGroup(K.L((-3.2, -1.0), (-3.2, 0.9), K.STEM, 6),
                    *[K.E(0.12, 0.85, K.LEAF_FILL, -3.2 + sg * 0.25, y, stroke=K.LEAF_EDGE, sw=2).rotate(-sg * 0.5)
                      for sg, y in ((1, 0.6), (-1, 0.2), (1, -0.2), (-1, 0.75))])
        q = T("사막 식물의 잎이 좁으면 좋은 점은?", 40).move_to([0.8, 2.6, 0])
        self.say("사막에 사는 식물의 잎이 좁으면 어떤 점이 좋을까요?", "사막에 사는 식물의 잎이 좁아 유리한 점은 무엇일까요?")
        self.play(FadeIn(q), FadeIn(sn), FadeIn(dune), FadeIn(pl), run_time=0.8)
        card = K.text_card([f"잎이 좁으면 증산 작용으로", f"빠져나가는 물이 {o('적어')}", f"물을 {g('아낄 수 있어요')}"], size=34).move_to([3.6, 0.0, 0])
        self.say(f"잎이 좁으면 빠져나가는 물이 적어 {g('물을 아낄 수 있어요')}",
                 "물이 부족한 사막에서 잎이 넓으면 증산 작용이 활발해 식물 안의 물이 부족해질 수 있어요. 잎이 좁으면 물이 덜 빠져나가 살아가기에 유리해요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def summary(self):
        self.section("한눈에 쏙")
        lf = K.leaf_part(0.8).move_to([-3.6, 1.0, 0])
        pf = VGroup(*[K.vapor_puffs(lf.blade.get_top() + np.array([dx, 0, 0]), 3) for dx in (-0.4, 0.3)])
        gp = K.guard_pair(0.55).move_to([0.0, 1.0, 0])
        gl = T("기공", 30, ORANGE).next_to(gp, DOWN, buff=0.15)
        bl = K.balsam("all", True, 30, 2.2).move_to([3.6, 0.9, 0])
        card = K.text_card([f"식물의 잎에 도달한 물의 일부가 수증기가 되어 식물 밖으로", f"빠져나가는 것을 {o('증산 작용')}이라고 합니다."], size=34).move_to([0, -1.55, 0])
        self.say(f"잎의 물이 수증기로 빠져나가는 것을 {o('증산 작용')}이라고 해요",
                 "식물의 잎에 도달한 물의 일부가 수증기가 되어 식물 밖으로 빠져나가는 것을 증산 작용이라고 해요.")
        self.play(FadeIn(lf), FadeIn(pf), FadeIn(gp), FadeIn(gl), FadeIn(bl), run_time=0.8)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
