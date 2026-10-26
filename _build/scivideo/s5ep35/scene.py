"""「과학 원리 돋보기」 5학년 35화 — 여러 방식으로 이동하는 열 (5-2 3단원 열과 우리 생활 8차시, 화 코드 5-2-3-f)

바탕: grade5/science/sem2/u3-6.html(원본 _build_tb/src2/u3-6.html) — 도입(화덕에서 생선 굽기 → 복사),
그림 속 열의 이동 6가지(다리미 전도 · 전기 주전자 대류 · 창가 햇빛 복사 · 손목 얼음주머니 전도 · 찜기 대류 · 열 전구 복사),
특징 비교 표(전도 고체 · 대류 액체, 기체 · 복사 빛), 생각 바로잡기(빛은 물질이 아님),
온돌(① 구들장이 달구어짐 전도 · ② 구들장의 열이 방 안으로 복사 · ③ 방 안 공기 순환 대류, 2018년 국가무형유산),
한눈에 쏙(전도·대류·복사), 열은 한꺼번에 두세 가지 방식으로 이동하는 경우가 많음.
최종: ./make_final.sh s5ep35
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, GrowArrow, Circle, Line,
                   DashedLine)

from series_style import GREEN, INK, ORANGE, SOFT, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u23 as K

WC = {"전도": "#E07020", "대류": "#2F86C6", "복사": "#C99400"}


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def w(name):
    return f'<span foreground="{WC[name]}">{name}</span>'


class S5Ep35(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 35
    EP_TITLE = "여러 방식으로 이동하는 열"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.pictures()
        self.compare()
        self.ondol_scene()
        self.summary()
        self.closing(f"열은 {w('전도')}, {w('대류')}, {w('복사')}의 여러 방식으로 이동해요",
                     next_preview="5학년 36화 · 열의 이동을 어떻게 막을까?")
        self.wait(0.5)

    def badge(self, name, size=28):
        t = T(name, size, PAPER)
        b = K.R(t.width + 0.36, t.height + 0.24, WC[name], 0, 0, rad=0.14, stroke=WC[name], sw=2)
        t.move_to(b)
        return VGroup(b, t)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        dome = K.poly([(-2.2, -1.0), (-2.2, 0.2), (-1.4, 1.1), (0, 1.5), (1.4, 1.1), (2.2, 0.2), (2.2, -1.0)],
                      "#C98B4F", stroke="#7E5428", sw=5)
        mouth = K.R(2.6, 1.3, "#3A2418", 0, -0.35, rad=0.5, stroke=INK, sw=3)
        fire = VGroup(*[K.flame(0.75).move_to([x, -0.55, 0]) for x in (-0.7, 0.1, 0.8)])
        fish = VGroup(K.E(1.2, 0.42, "#B9C4CC", 0, 0, stroke=INK, sw=3),
                      K.poly([(0.55, 0), (0.95, 0.25), (0.95, -0.25)], "#B9C4CC", stroke=INK, sw=3)).move_to([-3.7, -0.3, 0])
        oven = VGroup(dome, mouth, fire).move_to([1.0, 0.5, 0])
        self.say("화덕에서 생선을 구울 때 열은 어떻게 이동할까요?",
                 "화덕에서 생선을 구워요. 이때 열은 전도, 대류, 복사 중 어떤 방식으로 이동할까요?")
        self.play(FadeIn(oven), FadeIn(fish), run_time=0.7)
        self.play(fish.animate.move_to([1.0, 0.15, 0]).scale(0.8), run_time=0.8)
        self.pause_screen(4, "전도, 대류, 복사 중 무엇일까요?")
        b = self.badge("복사", 36).move_to([4.8, 1.6, 0])
        self.say(f"화덕에서는 {w('복사')}로 열이 이동해 생선이 구워져요",
                 "화덕에서는 복사로 열이 이동해 생선이 구워져요. 오늘은 전도, 대류, 복사의 특징을 비교해 봐요.")
        self.play(FadeIn(b, scale=1.3), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 그림 속 열의 이동 ──
    def pictures(self):
        self.section("그림 속 열의 이동")
        specs = [(K.iron(), "다리미 바닥", "전도"), (K.kettle(boil=True), "전기 주전자 물", "대류"),
                 (K.window_sun(), "창가 햇빛", "복사"), (K.ice_pack(), "손목 얼음주머니", "전도"),
                 (K.steamer(), "찜기 속 음식", "대류"), (K.heat_lamp(True), "열 전구 아래", "복사")]
        cards = VGroup()
        for p, n, _ in specs:
            cards.add(K.pic_card(p, n, 3.6, 2.35, 28))
        cards.arrange_in_grid(2, 3, buff=(0.35, 0.3)).move_to([0, 0.25, 0])
        self.say("그림에서 열은 어떤 방식으로 이동할까요?",
                 "다리미, 전기 주전자, 창가의 햇빛, 손목에 댄 얼음주머니, 찜기, 열 전구예요. 각각 어떤 방식으로 열이 이동할까요?")
        self.play(FadeIn(cards, lag_ratio=0.12), run_time=1.2)
        self.pause_screen(5, "전도·대류·복사를 찾아보세요")
        badges = VGroup(*[self.badge(k).move_to(c.box.get_corner(UP + RIGHT) + np.array([-0.55, -0.32, 0]))
                          for c, (_, _, k) in zip(cards, specs)])
        self.say(f"다리미·얼음주머니는 {w('전도')}, 주전자·찜기는 {w('대류')}",
                 "다리미 바닥이 뜨거워지는 것과 손목의 열이 얼음주머니로 이동하는 것은 전도, 전기 주전자의 물이 끓고 찜기 안의 음식이 익는 것은 대류예요.")
        self.play(*[FadeIn(badges[i], scale=1.3) for i in (0, 3, 1, 4)], run_time=0.8)
        self.settle()
        self.say(f"창가의 햇빛·열 전구는 {w('복사')}예요",
                 "창가에 햇빛이 비쳐 방 안이 따뜻해지는 것과 열 전구의 빛이 비치는 부분이 따뜻해지는 것은 복사예요.")
        self.play(*[FadeIn(badges[i], scale=1.3) for i in (2, 5)], run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 특징 비교 ──
    def compare(self):
        self.section("특징 비교")
        tb = K.result_table(["방식", "어디에서 / 무엇에 의해", "특징"],
                            [[w("전도"), "고체", "접촉한 고체 물질을 따라 열이 이동해요"],
                             [w("대류"), "액체, 기체", "온도가 높아진 액체와 기체가 위로 올라가며 열이 이동해요"],
                             [w("복사"), "빛", "빛에 의해 열이 직접 이동해요"]],
                            [1.6, 3.2, 8.0], row_h=0.95, size=28).move_to([0, 0.5, 0])
        boxes = [m for m in tb if m.__class__.__name__ == "Rectangle"]
        rows = [VGroup(*boxes[3 * i:3 * i + 3], *[c for c in tb.cells[i] if len(c)]) for i in range(4)]
        self.say("열이 이동하는 세 가지 방식의 특징을 비교해요",
                 "열이 이동하는 세 가지 방식의 특징을 표로 비교해 봐요.")
        self.play(FadeIn(rows[0]), run_time=0.4)
        self.settle()
        narrs = ["전도는 고체에서, 접촉한 고체 물질을 따라 열이 이동해요.",
                 "대류는 액체와 기체에서, 온도가 높아진 액체와 기체가 위로 올라가며 열이 이동해요.",
                 "복사는 빛에 의해 열이 직접 이동해요."]
        subs = [f"{w('전도')}: 고체 물질을 따라", f"{w('대류')}: 액체·기체가 위로 올라가며", f"{w('복사')}: 빛에 의해 직접"]
        for i in range(3):
            self.say(subs[i], narrs[i])
            self.play(FadeIn(rows[i + 1], shift=UP * 0.15), run_time=0.5)
        self.settle()
        mis = K.text_card(["복사에서 '빛'은 열을 전해 주는 물질일까요?",
                           f"→ {g('아니요')}, 복사는 물질 없이 빛에 의해 열이 직접 이동해요"], w=12.6, size=34).move_to([0, 0.6, 0])
        self.say(f"복사는 고체·액체·기체 같은 {g('물질 없이')} 열이 이동해요",
                 "생각 바로잡기! 빛은 고체, 액체, 기체 같은 물질이 아니에요. 복사는 물질 없이 빛에 의해 열이 직접 이동하는 방식이에요.")
        self.play(FadeOut(VGroup(*rows)), FadeIn(mis, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 온돌 ──
    def ondol_scene(self):
        self.section("온돌")
        od = K.ondol(10.0).move_to([-0.6, 0.15, 0])
        self.say("우리 조상의 난방 방식, 온돌을 살펴봐요",
                 "아궁이에 불을 피워 방바닥 밑의 구들장을 달구면, 한번 데워진 방이 오랫동안 따뜻하게 유지돼요. 온돌 문화는 2018년 국가무형유산으로 지정되었어요.")
        self.play(FadeIn(od), run_time=0.8)
        self.settle()
        st = od.stone
        rm = od.rm
        m1 = VGroup(Circle(radius=0.28, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3),
                    T("①", 28)).move_to(st.get_left() + RIGHT * 1.0 + DOWN * 0.62)
        a2 = VGroup(*[K.heat_arrow((x, st.get_top()[1] + 0.05), (x, st.get_top()[1] + 0.8), col=K.SUNY, sw=7)
                      for x in (st.get_x() - 1.6, st.get_x() - 0.9)])
        m2 = VGroup(Circle(radius=0.28, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3),
                    T("②", 28)).move_to([st.get_x() - 2.2, st.get_top()[1] + 0.55, 0])
        x0, x1 = st.get_x() + 0.8, st.get_x() + 2.8
        y0, y1 = st.get_top()[1] + 0.35, rm.get_top()[1] - 0.45
        a3 = K.rect_loop(x0, x1, y0, y1, col=WC["대류"], sw=6)
        m3 = VGroup(Circle(radius=0.28, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3),
                    T("③", 28)).move_to([x1 + 0.6, (y0 + y1) / 2, 0])
        b1 = self.badge("전도").next_to(m1, RIGHT, buff=0.15)
        b2 = self.badge("복사").next_to(m2, LEFT, buff=0.15)
        b3 = self.badge("대류").next_to(m3, UP, buff=0.12)
        self.say(f"① 아궁이의 열로 구들장 전체가 뜨거워져요: {w('전도')}",
                 "첫째, 아궁이의 열로 구들장이 달구어지고, 구들장 전체가 뜨거워져요. 전도예요.")
        self.play(FadeIn(m1), FadeIn(b1), Indicate(st, color="#E07020", scale_factor=1.03), run_time=0.8)
        self.settle()
        self.say(f"② 뜨거워진 구들장의 열이 방 안으로 이동해요: {w('복사')}",
                 "둘째, 뜨거워진 구들장의 열이 방 안으로 이동해요. 복사예요.")
        self.play(FadeIn(m2), FadeIn(b2), *[GrowArrow(a) for a in a2], run_time=0.8)
        self.settle()
        self.say(f"③ 데워진 방 안의 공기가 순환해요: {w('대류')}",
                 "셋째, 데워진 방 안의 공기가 순환하면서 방 안 전체의 온도가 높아져요. 대류예요.")
        self.play(Create(a3), FadeIn(m3), FadeIn(b3), run_time=1.0)
        self.settle()
        self.say(f"열은 한꺼번에 {o('두세 가지 방식')}으로 이동하는 경우가 많아요",
                 "온돌은 전도, 복사, 대류를 모두 활용해 방을 오랫동안 따뜻하게 해요. 열은 한꺼번에 두세 가지 방식으로 이동하는 경우가 많아요.")
        self.play(Indicate(VGroup(b1, b2, b3), scale_factor=1.1), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"열은 {w('전도')}, {w('대류')}, {w('복사')}의 여러 방식으로 이동합니다."],
                           w=12.0, size=42).move_to([0, 0.6, 0])
        self.say(f"열은 {w('전도')}, {w('대류')}, {w('복사')}의 여러 방식으로 이동해요",
                 "열은 전도, 대류, 복사의 여러 방식으로 이동해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
