"""「과학 원리 돋보기」 3학년 16화 — 씨가 싹 트려면? (3-1 4단원 생물의 한살이 6차시, 화 코드 3-1-4-b)

바탕: grade3/science/sem1/u4-4.html — 봄에 싹이 트는 까닭(날씨가 따뜻해지고 비가 내려서), 식물의 한살이 뜻,
실험 계획(다르게 할 조건 물의 양 / 같게 할 조건 씨의 종류·온도·컵을 놓는 장소·햇빛이 비추는 정도·바람이 부는 정도·컵과 부직포의 크기),
장치(작은 컵 심지 → 원 모양 부직포 → 한쪽 큰 컵에만 물 → 작은 컵 끼우기 → 무씨, 무씨는 먹지 않음, 같은 곳에 둠, 물 보충),
결과(물을 담은 컵: 부풂 → 껍질이 벗겨지고 하얀 뿌리 → 싹 / 물을 담지 않은 컵: 그대로), 결론(물이 필요),
물 외의 조건(알맞은 온도 — 더 알아보기: 어둠상자에 넣어 냉장실·냉장고 밖), 생각 바로잡기(빛이 꼭 필요하지 않음), 한눈에 쏙.
최종: ./make_final.sh s3ep16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, Rectangle, RoundedRectangle,
                   Transform, VGroup, LaggedStart, SurroundingRectangle, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import BROWN, BROWN_DARK, RED, clear_stage, tag
from kit_s3u14 import balsam, ground_strip, seed_cup, seeds, sun, drop


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def fridge():
    body = RoundedRectangle(corner_radius=0.15, width=2.2, height=3.6, fill_color="#F4F7F9", fill_opacity=1,
                            stroke_color="#8C99A3", stroke_width=5).move_to([0, 1.8, 0])
    split = Line([-1.1, 2.6, 0], [1.1, 2.6, 0], stroke_color="#8C99A3", stroke_width=4)
    h1 = Line([0.8, 3.2, 0], [0.8, 2.85, 0], stroke_color="#8C99A3", stroke_width=8)
    h2 = Line([0.8, 2.3, 0], [0.8, 1.6, 0], stroke_color="#8C99A3", stroke_width=8)
    return VGroup(body, split, h1, h2)


def dark_box(sprout=False):
    box = Rectangle(width=1.4, height=0.9, fill_color="#5B4636", fill_opacity=1, stroke_color="#3B2C20", stroke_width=3)
    sd = seeds(3 if sprout else 0, n=4, width=0.8, y=-0.45).set_z_index(2)
    g_ = VGroup(box, sd)
    return g_


class S3Ep16(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 16
    EP_TITLE = "씨가 싹 트려면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.plan()
        self.experiment()
        self.result()
        self.temperature()
        self.light()
        self.closing(f"씨가 싹 트려면 {o('물')}과 {o('알맞은 온도')}가 필요해요",
                     next_preview="3학년 17화 · 식물이 잘 자라려면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        gnd = VGroup(Rectangle(width=13.6, height=1.0, fill_color="#B89B72", fill_opacity=0.55, stroke_width=0).move_to([0, -2.0, 0]),
                     ground_strip(-6.8, 6.8, -1.5))
        sprouts = VGroup(*[balsam("sprout", 1.3).move_to([x, -1.5 + 0.4, 0]) for x in (-4, -1.3, 1.3, 4)])
        sn = sun(0.6).move_to([4.8, 2.0, 0])
        self.say("봄이 되면 많은 식물의 싹이 터요. 왜 그럴까요?",
                 "봄이 되면 많은 식물의 싹이 터요. 왜 봄에 싹이 많이 틀까요?")
        self.play(FadeIn(gnd), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(s_, shift=UP * 0.4) for s_ in sprouts], lag_ratio=0.25), run_time=1.2)
        self.pause_screen(4, "봄에 싹이 많이 트는 까닭은?")
        rain = VGroup(*[drop(0.3).move_to([x, y, 0]) for x, y in ((-4.5, 2.0), (-3.6, 1.4), (-2.7, 2.2), (-1.8, 1.5))])
        self.say(f"날씨가 {o('따뜻해지고')} {o('비가 내리기')} 때문이에요",
                 "봄이 되면 날씨가 따뜻해지고 비가 내리기 때문이에요.")
        self.play(FadeIn(sn, scale=0.6), LaggedStart(*[FadeIn(d, shift=DOWN * 0.3) for d in rain], lag_ratio=0.2), run_time=1.0)
        word = T("식물의 한살이", 56, ORANGE).move_to([0, 2.2, 0])
        self.say(f"씨가 싹 트고 자라 다시 씨를 만드는 과정 = {o('식물의 한살이')}",
                 "식물의 씨가 싹 트고 자라 꽃이 피고 열매를 맺어 다시 씨를 만드는 과정을 식물의 한살이라고 해요. 그 첫걸음, 싹 트는 데 필요한 조건을 알아봐요.")
        self.play(FadeIn(word, scale=0.8), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 실험 계획 ──
    def plan(self):
        self.section("실험 계획")
        q = T("씨가 싹 트는 데 물이 필요할까?", 50, INK).move_to([0, 2.3, 0])
        self.say("씨가 싹 트는 데 물이 필요한지 실험해요", "씨가 싹 트는 데 물이 필요한지 알아보는 실험을 계획해요.")
        self.play(FadeIn(q), run_time=0.5)
        diff_h = T("다르게 할 조건", 40, RED)
        diff = tag("물의 양", RED, 40)
        dcol = VGroup(diff_h, diff).arrange(DOWN, buff=0.35).move_to([-4.4, 0.8, 0])
        same_h = T("같게 할 조건", 40, GREEN)
        items = ["씨의 종류", "온도", "컵을 놓는 장소", "햇빛이 비추는 정도", "바람이 부는 정도", "컵과 부직포의 크기"]
        chips = VGroup(*[tag(t, GREEN, 36) for t in items])
        chips.arrange_in_grid(rows=3, cols=2, buff=(0.3, 0.3), col_alignments="ll")
        if chips.width > 8.0:
            chips.scale_to_fit_width(8.0)
        scol = VGroup(same_h, chips).arrange(DOWN, buff=0.4)
        if scol.height > 4.0:
            scol.scale_to_fit_height(4.0)
        scol.move_to([2.4, 0, 0]).align_to(np.array([0, 1.8, 0]), UP)
        self.say(f"{r('다르게 할 조건')}은 물의 양 하나뿐이에요",
                 "한쪽 컵에는 물을 주고, 다른 쪽 컵에는 물을 주지 않아요. 그래서 다르게 할 조건은 물의 양이에요.")
        self.play(FadeIn(dcol, shift=UP * 0.2), run_time=0.6)
        self.say(f"나머지는 모두 {g('같게')} 해요",
                 "씨의 종류, 온도, 컵을 놓는 장소, 햇빛과 바람 같은 나머지 조건은 모두 같게 해요. 그래야 물이 주는 영향만 알 수 있어요.")
        self.play(FadeIn(same_h), LaggedStart(*[FadeIn(c, shift=UP * 0.15) for c in chips], lag_ratio=0.15), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 장치 ──
    def experiment(self):
        self.section("실험해요")
        cw = seed_cup(True, 0, 1.05).move_to([-2.7, -0.15, 0])
        cd = seed_cup(False, 0, 1.05).move_to([2.7, -0.15, 0])
        lw = T("물을 담은 컵", 38, BLUE).next_to(cw, DOWN, buff=0.15)
        ld = T("물을 담지 않은 컵", 38, BROWN_DARK).next_to(cd, DOWN, buff=0.15)
        self.cw, self.cd = cw, cd
        self.say("작은 컵에 부직포 심지와 원 모양 부직포를 끼워요",
                 "작은 컵 구멍에 부직포 심지를 끼우고, 그 위에 원 모양 부직포를 올려요.")
        self.play(FadeIn(VGroup(cw[2], cw[3], cw[4], cd[2], cd[3], cd[4]), shift=DOWN * 0.3), run_time=0.8)
        self.say(f"{o('한쪽 큰 컵에만')} 물을 담고, 작은 컵을 끼워요",
                 "한쪽 큰 컵에만 물을 담고, 큰 컵 안에 작은 컵을 끼워요. 심지가 물에 잠겨 부직포가 젖어요.")
        self.play(FadeIn(VGroup(cw[0], cw[1], cd[0], cd[1])), run_time=0.6)
        self.add(cw[2], cw[3], cw[4], cd[2], cd[3], cd[4])
        self.play(FadeIn(lw), FadeIn(ld), run_time=0.4)
        self.say("무씨를 골고루 올리고, 두 컵을 같은 곳에 두어요",
                 "부직포 위에 무씨를 골고루 올리고, 두 컵을 같은 곳에 두어요. 실험에 쓰는 무씨는 먹지 않아요.")
        self.play(FadeIn(cw.seeds, shift=DOWN * 0.2), FadeIn(cd.seeds, shift=DOWN * 0.2), run_time=0.6)
        self.say("두 컵의 무씨는 어떻게 될까요?", "며칠 동안 관찰하면 두 컵의 무씨는 어떻게 될까요? 예상해 봐요.")
        self.pause_screen(5, "두 컵의 무씨는 어떻게 될까요?")
        steps = [(1, "물을 머금고 부풀었어요"), (2, "껍질이 벗겨지고 하얀 뿌리가 나와요"), (3, "싹이 텄어요!")]
        cap = None
        for st, txt in steps:
            base_y = cw[4].get_center()[1] + 0.02 * 1.05
            new = seeds(st, n=5, width=1.2 * 1.05, y=base_y)
            new.shift(RIGHT * cw[4].get_center()[0])
            self.say(f"물을 담은 컵: {g(txt)}", {1: "물을 담은 컵의 무씨가 물을 머금고 부풀었어요.",
                                               2: "씨의 껍질이 벗겨지고 하얀 뿌리가 나오기 시작했어요.",
                                               3: "물을 담은 컵의 무씨에서 싹이 텄어요! 물을 담지 않은 컵의 무씨는 그대로예요."}[st])
            self.play(Transform(cw.seeds, new), run_time=0.8)
        self.say("큰 컵의 물이 줄면 보충해 부직포가 늘 젖어 있게 해요",
                 "실험하는 동안 큰 컵의 물이 줄어들면 물을 보충해서, 부직포가 항상 젖어 있게 해요.")
        self.play(Indicate(cw.water, color=BLUE, scale_factor=1.03), run_time=0.8)
        self.settle()

    # ── 결과 ──
    def result(self):
        self.section("결과")
        cw, cd = self.cw, self.cd
        rw = tag("껍질이 벗겨지고 싹이 텄어요", GREEN, 32).move_to([-3.1, 2.55, 0])
        rd = tag("싹이 트지 않고 그대로예요", RED, 32).move_to([3.1, 2.55, 0])
        self.say("물을 담은 컵의 무씨만 싹이 텄어요", "결과를 정리해요. 물을 담은 컵의 무씨는 싹이 텄고, 물을 담지 않은 컵의 무씨는 싹이 트지 않았어요.")
        self.play(FadeIn(rw, shift=DOWN * 0.2), FadeIn(rd, shift=DOWN * 0.2), run_time=0.6)
        self.say(f"씨가 싹 트는 데에는 {o('물')}이 필요해요", "그래서 씨가 싹 트는 데에는 물이 필요하다는 것을 알 수 있어요.")
        self.play(Indicate(rw, color=GREEN), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 온도 ──
    def temperature(self):
        self.section("물 말고 또?")
        self.say("물 말고 또 무엇이 필요할까요?", "씨가 싹 트려면 물 말고 또 무엇이 필요할까요? 봄이 되면 날씨가 따뜻해졌던 것을 떠올려 봐요.")
        fr = fridge().move_to([-2.8, 0.35, 0])
        lab1 = T("냉장고 안", 36, BLUE).next_to(fr, DOWN, buff=0.15)
        b_in = dark_box(False).move_to(fr[0].get_center() + DOWN * 0.55)
        b_out = dark_box(False).move_to([2.8, -0.6, 0])
        table = Line([1.6, -1.07, 0], [4.0, -1.07, 0], stroke_color=BROWN, stroke_width=8)
        lab2 = T("냉장고 밖", 36, ORANGE).move_to([2.8, lab1.get_center()[1], 0])
        self.say("무씨 컵을 어둠상자에 넣어 냉장고 안과 밖에 두어요",
                 "무씨를 올린 컵 두 개를 각각 어둠상자에 넣어, 하나는 냉장고의 냉장실에, 다른 하나는 냉장고 밖에 두어요. 다르게 할 조건은 온도예요.")
        self.play(FadeIn(fr), FadeIn(lab1), FadeIn(table), FadeIn(lab2), run_time=0.6)
        self.play(FadeIn(b_in), FadeIn(b_out), run_time=0.5)
        self.pause_screen(4, "어느 쪽 무씨가 싹 틀까요?")
        new_out = dark_box(True).move_to(b_out)
        self.say(f"냉장고 밖의 무씨만 싹이 텄어요", "며칠 뒤 상자를 열어 보니, 냉장고에 넣어 둔 무씨는 싹이 트지 않았고, 냉장고 밖에 둔 무씨는 싹이 텄어요.")
        self.play(Transform(b_out, new_out), run_time=0.8)
        x_ = Cross(b_in, stroke_color=RED, stroke_width=6).scale(0.6)
        self.play(Create(x_), run_time=0.4)
        self.say(f"씨가 싹 트는 데에는 {o('알맞은 온도')}도 필요해요",
                 "온도가 낮은 곳에서는 씨가 싹 트지 않아요. 씨가 싹 트는 데에는 알맞은 온도도 필요해요.")
        self.settle()
        clear_stage(self)

    # ── 빛 ──
    def light(self):
        self.section("생각 바로잡기")
        claim = T("씨가 싹 트려면 빛이 꼭 필요하다?", 50, INK).move_to([0, 2.2, 0])
        self.say("씨가 싹 트려면 빛이 꼭 필요할까요?", "이번에는 생각을 바로잡아 봐요. 씨가 싹 트려면 빛이 꼭 필요할까요?")
        self.play(FadeIn(claim), run_time=0.5)
        soil = Rectangle(width=8.0, height=2.6, fill_color="#6B4E37", fill_opacity=1, stroke_width=0).move_to([0, -1.0, 0])
        sd = VGroup(*[seeds(3, n=2, width=1.0, y=0).move_to([x, -1.3, 0]) for x in (-2.4, 0, 2.4)])
        self.play(FadeIn(soil), FadeIn(sd), run_time=0.6)
        no = T("×", 90, RED).next_to(claim, LEFT, buff=0.3)
        self.say(f"빛이 들지 않는 {o('흙 속')}에서도 싹이 터요",
                 "아니에요. 빛이 들지 않는 어두운 흙 속에서도 씨는 싹이 터요. 앞의 실험에서도 어둠상자 안의 무씨가 싹이 텄지요.")
        self.play(FadeIn(no, scale=0.6), Indicate(sd, color=GREEN), run_time=0.8)
        self.settle()
        clear_stage(self)
