"""「과학 원리 돋보기」 4학년 14화 — 화산 활동은 해로울까, 이로울까? (4-1 3단원 땅의 변화 8차시, 화 코드 4-1-3-e)

바탕: grade4/science/sem1/u3-6.html(원본 _build_tb/src/u3-6.html) — 도입(화산 주변 온천: 땅속 마그마가 지하수를 데움),
마을 그림 7곳(화산 가스·화산재와 비행기·흐르는 용암 / 기름진 밭·온천·지열 발전소·화산 지형 관광), 피해와 이로운 점 나누기,
발표(화산재는 피해도 주지만 오랜 시간 뒤 땅을 기름지게, 화산재로 등산용품·화장품, 화성암 건축 자재, 땅속 열로 온천·지열 발전,
화산 가스는 마시면 안 됨), 한눈에 쏙. 피해는 담담하게.
최종: ./make_final.sh s4ep14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, VGroup, Circle, SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def town():
    gg = VGroup(K.rect(13.6, 2.7, "#9CC77A", y=-1.35, sw=0))
    vol = VGroup(K.P([(-3.8, -0.3), (-1.2, 2.0), (-0.5, 2.0), (2.1, -0.3)], K.MT, K.MT_D, 4),
                 K.P([(-1.2, 2.0), (-1.05, 1.85), (-0.65, 1.85), (-0.5, 2.0)], "#3B322A", "#3B322A", 2))
    gas = K.gas_puffs(0.25, 1.0, (-0.85, 1.8)).scale(0.7, about_point=np.array([-0.85, 1.9, 0]))
    for c in gas:
        c.set_stroke(SOFT, 2, opacity=c.get_fill_opacity())
    ash = VGroup(*[K.E(w, h, "#8B9096", x=x, y=y, sw=0, op=0.75) for x, y, w, h in
                   ((1.4, 2.5, 2.4, 0.6), (3.0, 2.6, 2.6, 0.7), (0.2, 2.3, 1.2, 0.45))])
    pl = K.plane(0.9).move_to([4.6, 2.35, 0])
    lv = K.VMobject(stroke_color=K.LAVA, stroke_width=16)
    lv.set_points_smoothly([[-0.6, 1.85, 0], [-0.1, 1.2, 0], [0.5, 0.5, 0], [1.2, -0.05, 0], [1.9, -0.4, 0]])
    trees = VGroup(*[K.tree(0.8).move_to([x, -0.45, 0]) for x in (2.4, 2.9, 3.4)])
    fl = K.flame(0.7).move_to([2.55, -0.25, 0])
    fd = K.field(2.4).move_to([-5.3, -1.3, 0])
    sp = K.spa(2.2).move_to([-1.8, -1.75, 0])
    geo = K.geo_plant().move_to([1.6, -1.75, 0])
    tour = K.tourists().scale(1.1).move_to([5.3, -1.2, 0])
    gg.add(vol, ash, pl, lv, trees, fl, gas, fd, sp, geo, tour)
    gg.spots = {"gas": gas, "ash": VGroup(ash, pl), "lava": VGroup(lv, fl), "field": fd, "spa": sp, "geo": geo, "tour": tour}
    return gg


class S4Ep14(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 14
    EP_TITLE = "화산 활동은 해로울까, 이로울까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.survey()
        self.sort()
        self.use()
        self.summary()
        self.closing(f"화산 활동은 우리 생활에 {r('피해')}를 주기도 하지만\n{g('이로운 점')}도 있어요",
                     next_preview="4학년 15화 · 지진은 어떤 영향을 줄까?")
        self.wait(0.5)

    # ── 궁금해요: 온천 ──
    def intro(self):
        self.section("궁금해요")
        vol = VGroup(K.P([(-4.2, -0.9), (-1.8, 1.7), (-1.2, 1.7), (1.2, -0.9)], K.MT, K.MT_D, 4),
                     K.rect(13.6, 1.6, "#8FBF6A", y=-1.7, sw=0))
        sp = K.spa(3.4).scale(1.1).move_to([3.4, -1.2, 0])
        lab = K.label("김이 나는 온천", INK, 30).move_to([3.4, -2.25, 0])
        self.say("화산 주변에는 온천이 많아요. 왜 그럴까요?",
                 "화산 주변에는 김이 나는 온천이 많아요. 그 까닭은 무엇일까요?")
        self.play(FadeIn(vol), FadeIn(sp), FadeIn(lab), run_time=0.8)
        self.pause_screen(5, "화산 주변에 온천이 많은 까닭은?")
        mg = K.E(3.4, 0.5, K.MAGMA, x=-1.5, y=-2.05, sw=0, op=0.9)
        self.say(f"땅속의 뜨거운 {r('마그마')}가 땅속의 물을 데워요",
                 "화산 활동을 일으키는 땅속의 뜨거운 마그마가 땅속의 물, 지하수를 뜨겁게 만들어요. 햇빛만으로는 땅속의 물이 이렇게 뜨거워지기 어려워요.")
        self.play(FadeIn(mg), run_time=0.6)
        self.play(Indicate(sp, color=ORANGE, scale_factor=1.06), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 조사해요: 마을 그림 ──
    def survey(self):
        self.section("조사해요")
        tw = town()
        self.say("화산 활동이 우리 생활에 미치는 영향을 찾아요",
                 "화산 주변 마을 그림에서 화산 활동이 우리 생활에 미치는 영향을 찾아봐요. 모두 일곱 곳이에요.")
        self.play(FadeIn(tw), run_time=0.8)
        items = [
            ("gas", "화산 가스", RED, (-2.6, 2.6), "화산 가스는 사람들의 숨쉬기를 어렵게 해요",
             "화산 활동으로 나오는 화산 가스는 사람들의 호흡, 곧 숨쉬기를 어렵게 해요."),
            ("ash", "화산재와 비행기", RED, (3.2, 1.6), "화산재 때문에 비행기가 다니기 어려워요",
             "화산재가 하늘 높이 올라가면 비행기가 다니기 어려워져요. 화산재가 마을을 뒤덮기도 해요."),
            ("lava", "흐르는 용암", RED, (3.2, 0.6), "흐르는 용암으로 산불이 나기도 해요",
             "지표를 흐르는 용암으로 화재, 산불이 일어나기도 해요."),
            ("field", "기름진 밭", GREEN, (-5.3, -0.35), "화산재는 오랜 시간 뒤 땅을 기름지게 해요",
             "화산재는 오랜 시간이 지난 후 땅을 기름지게 만들어 농작물이 자라는 데 도움을 줘요."),
            ("spa", "온천", GREEN, (-3.3, -0.85), "데워진 물을 온천으로 이용해요",
             "땅속의 뜨거운 마그마로 데워진 물을 온천으로 이용해요. 관광 자원이 되기도 해요."),
            ("geo", "지열 발전소", GREEN, (0.1, -0.85), "땅속의 뜨거운 열로 전기를 만들어요",
             "땅속의 뜨거운 열을 이용해 전기를 만들어요. 이것을 지열 발전이라고 해요."),
            ("tour", "화산 지형 관광", GREEN, (5.6, 0.3), "독특한 화산 지형은 관광 자원이 돼요",
             "화산 활동으로 만들어진 독특한 지형은 관광 자원이 되기도 해요."),
        ]
        for k, nm, col, pos, sub, narr in items:
            tgt = tw.spots[k]
            ring = SurroundingRectangle(tgt, buff=0.1, color=col, corner_radius=0.2, stroke_width=6)
            lb = K.label(nm, col, 28).move_to([pos[0], pos[1], 0])
            self.say(sub, narr)
            self.play(Create(ring), FadeIn(lb, scale=1.2), run_time=0.6)
            self.settle()
            self.play(FadeOut(ring), run_time=0.25)
        self.settle()
        clear_stage(self)

    # ── 나누기 ──
    def sort(self):
        self.section("피해와 이로운 점")
        h = K.bin_box("피해", 6.4, 4.6, RED, 38).move_to([-3.35, 0.2, 0])
        b = K.bin_box("이로운 점", 6.4, 4.6, GREEN, 38).move_to([3.35, 0.2, 0])
        self.say("조사한 영향을 피해와 이로운 점으로 나누어요",
                 "조사한 영향을 화산 활동이 주는 피해와 이로운 점으로 나누어 봐요.")
        self.play(FadeIn(h), FadeIn(b), run_time=0.5)
        bad = ["화산 가스: 숨쉬기가 어려워요", "화산재: 비행기 운항이 어려워요", "용암: 마을·숲을 덮거나 화재"]
        good = ["화산재: 땅이 기름져 농작물이 잘 자라요", "온천: 관광 자원으로 이용해요", "땅속의 높은 열: 지열 발전"]
        gb = VGroup(*[T(t, 27) for t in bad]).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to(h.box.get_center() + DOWN * 0.25)
        gg = VGroup(*[T(t, 27) for t in good]).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to(b.box.get_center() + DOWN * 0.25)
        for grp in (gb, gg):
            if grp.width > 6.0:
                grp.scale_to_fit_width(6.0)
        self.say(f"{r('피해')}: 화산 가스, 화산재, 용암",
                 "화산 가스는 호흡을 어렵게 하고, 화산재는 비행기 운항을 어렵게 해요. 용암은 마을이나 숲을 덮거나 화재를 일으켜요.")
        self.play(FadeIn(gb, lag_ratio=0.3), run_time=1.0)
        self.say(f"{g('이로운 점')}: 기름진 땅, 온천, 지열 발전",
                 "화산재는 오랜 시간이 지나 땅을 기름지게 해요. 온천을 개발해 관광 자원으로 이용하고, 땅속의 높은 열로 지열 발전을 해요.")
        self.play(FadeIn(gg, lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 화산 분출물 이용 ──
    def use(self):
        self.section("생각+")
        self.say("화산 분출물은 피해만 줄까요?", "화산 분출물은 피해만 줄까요? 화산재를 다시 생각해 봐요.")
        ash = K.ash_cloud(0.9, 1, (0, 0)).scale(0.7).move_to([-4.2, 1.0, 0])
        fd = K.field(2.6).move_to([-4.2, -1.0, 0])
        arr = Arrow([-4.2, 0.45, 0], [-4.2, -0.35, 0], color=GREEN, stroke_width=6, buff=0)
        lt = T("오랜 시간이 지나면", 26).next_to(arr, RIGHT, buff=0.15)
        self.play(FadeIn(ash), run_time=0.5)
        self.pause_screen(5, "화산재는 피해만 줄까요?")
        self.say(f"화산재는 오랜 시간이 지나면 {g('땅을 기름지게')} 해요",
                 "화산재는 마을을 뒤덮거나 비행기 운항을 어렵게 하지만, 오랜 시간이 지나면 땅을 기름지게 해요.")
        self.play(Create(arr), FadeIn(lt), FadeIn(fd), run_time=0.8)
        uses = VGroup(*[K.label(t, GREEN, 28) for t in
                        ("화산재로 등산용품·화장품을 만들어요", "용암이 굳은 암석(화성암)을 건축 자재로 써요",
                         "땅속의 열로 온천과 지열 발전을 해요")]).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to([3.0, 0.7, 0])
        self.say("화산 분출물을 우리 생활에 이용하기도 해요",
                 "화산 분출물을 우리 생활에 이용하기도 해요. 화산재로 등산용품이나 화장품을 만들고, 용암이 굳은 암석인 화성암을 건축 자재로 써요. 땅속의 열로 온천과 지열 발전을 해요.")
        self.play(FadeIn(uses, lag_ratio=0.4), run_time=1.4)
        no = M(f"화산 가스는 {r('마시면 안 돼요')}", 32).move_to([3.0, -1.4, 0])
        self.say(f"화산 가스는 호흡을 어렵게 해요. {r('마시면 안 돼요')}",
                 "하지만 화산 가스는 사람들의 호흡을 어렵게 해요. 마시면 안 돼요.")
        self.play(FadeIn(no), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["화산 활동으로 나오는 화산 분출물은",
                            f"우리 생활에 {r('피해')}를 주지만, {g('이로운')} 점도 있습니다."], w=12.0, size=46).move_to([0, 0.6, 0])
        self.say(f"화산 분출물은 피해를 주지만, {g('이로운 점')}도 있어요",
                 "화산 활동으로 나오는 화산 분출물은 우리 생활에 피해를 주지만, 이로운 점도 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
