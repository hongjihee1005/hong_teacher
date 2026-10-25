"""「과학 원리 돋보기」 5학년 2화 — 지층은 어떻게 만들어질까? (5-1 1단원 지층과 화석 3차시, 화 코드 5-1-1-b)

바탕: grade5/science/sem1/u1-2.html(원본 _build_tb/src/u1-2.html) — 도입(돌탑: 가장 아래 돌을 먼저 쌓음),
실험(투명한 사각 통에 물 1/4, 컵 3개에 자갈과 모래·모래·진흙을 절반, 물을 부어 잠기게, 정한 순서대로 한 번에 붓기 → 먼저 넣은 것이 가장 아래),
다른 모둠 모형 추리(먼저 쌓인 층부터), 실제 지층(① 쌓여요 ② 눌려요 ③ 굳어져요 ④ 드러나요), 모형과 실제 비교,
생각+(컵의 물 = 퇴적물을 바다나 호수 밑바닥으로 운반), 한눈에 쏙(아래층이 위층보다 먼저).
최종: ./make_final.sh s5ep02
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowFromEdge, Indicate, VGroup, Transform,
                   Arrow, Dot, Rotate, SurroundingRectangle, LaggedStart)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep02(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 2
    EP_TITLE = "지층은 어떻게 만들어질까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.model()
        self.infer()
        self.real()
        self.compare()
        self.water()
        self.summary()
        self.closing(f"지층의 {o('아래')}에 있는 층은 위에 있는 층보다\n{g('먼저')} 만들어진 것이에요",
                     next_preview="5학년 3화 · 지층을 이루는 암석")
        self.wait(0.5)

    # ── 궁금해요: 돌탑 ──
    def intro(self):
        self.section("궁금해요")
        tw = K.stone_tower(5, 3.0).move_to([0, 0.3, 0])
        cap = T("돌을 하나씩 쌓아 올린 돌탑", 32).move_to([0, 2.55, 0])
        self.say("돌탑에서 어느 돌을 가장 먼저 쌓았을까요?",
                 "돌을 하나씩 쌓아 올린 돌탑이에요. 돌탑에서 어느 돌을 가장 먼저 쌓았을까요?")
        self.play(FadeIn(cap), FadeIn(tw[0], shift=DOWN * 0.3), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(s_, shift=DOWN * 0.4) for s_ in tw[1:]], lag_ratio=0.3), run_time=1.4)
        self.pause_screen(5, "가장 먼저 쌓은 돌은 어느 것일까요?")
        ring = SurroundingRectangle(tw[0], color=GREEN, buff=0.12, corner_radius=0.2, stroke_width=7)
        self.say(f"{g('가장 아래')}에 있는 돌을 가장 먼저 쌓았어요",
                 "가장 아래에 있는 돌을 가장 먼저 쌓았어요. 돌탑은 아래에서부터 쌓으니까요.")
        self.play(Create(ring), run_time=0.6)
        self.say("지층에서 가장 먼저 쌓인 층은 어디일까요?",
                 "그렇다면 지층에서 가장 먼저 쌓인 층은 어디일까요? 지층 모형을 만들며 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요: 지층 모형 ──
    def water_to(self, tk, top):
        """통의 물 높이를 바닥에서 top까지"""
        c = tk.get_center()
        new = K.rect(tk.w - 0.08, top, K.WATER, x=c[0], y=c[1] - tk.h / 2 + top / 2, stroke=K.WATER, sw=0, op=0.75)
        return Transform(tk.water, new)

    def pour(self, tk, cup, key, y0, seed):
        hh = K.MAT[key][3]
        c = tk.get_center()
        home = cup.get_center()
        self.play(cup.animate.move_to([c[0] + 0.3, c[1] + tk.h / 2 + 0.75, 0]), run_time=0.6)
        self.play(Rotate(cup, -1.9), run_time=0.4)
        col = K.MAT[key][1]
        drops = VGroup(*[Dot([c[0] - 0.6 + 1.2 * K.rnd(i, seed), c[1] + tk.h / 2 - 0.1 + 0.4 * K.rnd(i, seed + 1), 0],
                             radius=0.06, color=col) for i in range(22)])
        lay = K.tank_layer(tk, key, y0, hh, seed)
        self.add(drops)
        self.play(drops.animate.shift(DOWN * (tk.h - y0 - 0.2)).set_opacity(0.2), run_time=0.7)
        self.remove(drops)
        self.play(GrowFromEdge(lay, DOWN), self.water_to(tk, max(0.8, y0 + hh + 0.6)), run_time=0.7)
        self.play(Rotate(cup, 1.9), run_time=0.3)
        self.play(cup.animate.move_to(home).set_opacity(0.35), run_time=0.4)
        return lay

    def model(self):
        self.section("실험해요")
        tk = K.tank(4.6, 3.2, 0.0).move_to([-2.6, 0.0, 0])
        tl = T("투명한 사각 통", 28).next_to(tk, DOWN, buff=0.15)
        self.say(f"투명한 사각 통에 물을 {o('4분의 1')} 정도 부어요",
                 "지층 모형을 만들어 봐요. 먼저 투명한 사각 통에 물을 4분의 1 정도 부어요.")
        self.play(Create(tk[1]), FadeIn(tl), run_time=0.7)
        self.play(self.water_to(tk, 0.8), run_time=0.8)
        cups = VGroup(*[K.mat_cup(k, 1.0) for k in ("gravel", "sand", "mud")]).arrange(RIGHT, buff=0.35).move_to([3.6, 0.6, 0])
        self.say(f"컵 3개에 {o('자갈과 모래')}, {o('모래')}, {o('진흙')}을 절반 정도 채워요",
                 "투명한 컵 세 개에 자갈과 모래, 모래, 진흙을 각각 절반 정도 채우고, 물을 부어 잠기게 해요.")
        self.play(FadeIn(cups, lag_ratio=0.2), run_time=0.9)
        self.say("넣을 순서를 정해, 컵 속 물과 함께 한 번에 부어요",
                 "순서를 정해 컵 속의 물과 함께 한 번에 부어요. 자갈과 모래, 모래, 진흙 순서로 넣어 볼게요.")
        nums = VGroup(*[T(f"{i + 1}", 34, ORANGE).next_to(c, UP, buff=0.12) for i, c in enumerate(cups)])
        self.play(FadeIn(nums, lag_ratio=0.2), run_time=0.6)
        self.settle()
        self.pause_screen(6, "먼저 넣은 것은 어디에 쌓일까요?")
        y = 0.0
        lays = []
        for i, k in enumerate(("gravel", "sand", "mud")):
            lays.append(self.pour(tk, cups[i], k, y, 10 + i))
            y += K.MAT[k][3]
            if i == 0:
                self.say(f"자갈과 모래가 통 {o('바닥')} 쪽에 쌓였어요",
                         "자갈과 모래가 통의 바닥 쪽에 쌓였어요.")
        labs = VGroup()
        for i, (lay, k) in enumerate(zip(lays, ("gravel", "sand", "mud"))):
            labs.add(T(f"{i + 1}번째로 쌓임", 26, GREEN).next_to(lay, RIGHT, buff=0.25))
        self.say(f"{g('먼저 넣은 것')}이 가장 {g('아래')}에 쌓였어요",
                 "지층 모형이 완성됐어요. 먼저 넣은 것이 가장 아래에 쌓였어요. 아래에서부터 층이 쌓였어요.")
        self.play(FadeOut(VGroup(cups, nums)), run_time=0.4)
        self.play(FadeIn(labs, lag_ratio=0.3), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 추리해요: 다른 모둠 모형 ──
    def infer(self):
        self.section("추리해요")
        tk = K.tank(4.6, 3.2, 0.0).move_to([0, 0.2, 0])
        order = ("mud", "gravel", "sand")
        y = 0.0
        lays = VGroup()
        for i, k in enumerate(order):
            lays.add(K.tank_layer(tk, k, y, K.MAT[k][3], 30 + i))
            y += K.MAT[k][3]
        wat = K.rect(4.52, y + 0.6, K.WATER, x=0, y=0.2 - 1.6 + (y + 0.6) / 2, stroke=K.WATER, sw=0, op=0.75)
        cap = T("다른 모둠의 지층 모형", 30).next_to(tk, UP, buff=0.15)
        self.say("다른 모둠의 지층 모형이에요. 쌓인 순서를 추리해요",
                 "다른 모둠이 만든 지층 모형이에요. 완성된 모형만 보고 먼저 쌓인 층부터 추리해 봐요.")
        self.play(FadeIn(wat), FadeIn(lays), Create(tk[1]), FadeIn(cap), run_time=0.9)
        self.pause_screen(5, "어느 층이 가장 먼저 쌓였을까요?")
        labs = VGroup()
        for i, lay in enumerate(lays):
            labs.add(M(f"{i + 1}번째 · {K.MAT[order[i]][0]}", 28).next_to(lay, RIGHT, buff=0.3))
        self.say(f"{g('가장 아래층')}이 가장 먼저, 가장 위층이 가장 나중에 쌓였어요",
                 "가장 아래의 진흙 층이 가장 먼저, 가장 위의 모래 층이 가장 나중에 쌓였어요.")
        self.play(FadeIn(labs, lag_ratio=0.4), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 실제 지층이 만들어지는 과정 ──
    def real(self):
        self.section("실제 지층은?")
        steps = [("① 쌓여요", "흐르는 물이 운반한 자갈, 모래, 진흙이 쌓여요",
                  "실제 지층은 어떻게 만들어질까요? 흐르는 물이 운반한 자갈, 모래, 진흙 등이 바다나 호수 밑바닥에 쌓여요."),
                 ("② 눌려요", "계속 쌓이면 먼저 쌓인 것이 눌려요",
                  "자갈, 모래, 진흙 등이 계속 쌓이면 먼저 쌓인 것이 눌려요."),
                 ("③ 굳어져요", "오랜 시간이 지나면 단단히 굳어져 지층이 돼요",
                  "오랜 시간이 지나면 자갈, 모래, 진흙 등이 단단히 굳어져 지층이 만들어져요."),
                 ("④ 드러나요", "지층이 땅 위로 드러난 뒤 깎이면 볼 수 있어요",
                  "지층이 땅 위로 드러난 뒤 깎이면 우리가 지층을 볼 수 있어요.")]
        cur = None
        for i, (tag, sub, narr) in enumerate(steps):
            pic = K.earth_section(i + 1).scale(0.95).move_to([0, 0.3, 0])
            lab = K.label(tag, self.accent, 32).move_to(pic.get_corner(UP + RIGHT) + np.array([-1.0, -0.45, 0]))
            extra = VGroup()
            if i == 1:
                L = pic.get_left()[0]
                extra = K.press_arrows(-1.5, 4.5, pic.get_bottom()[1] + 1.75, 4)
            if i == 2:
                extra = VGroup(K.clock(0.4), T("오랜 시간", 28)).arrange(RIGHT, buff=0.15).move_to([2.4, 1.2, 0])
            if i == 3:
                lab.move_to(pic.get_corner(UP + LEFT) + np.array([1.2, -0.45, 0]))
            new = VGroup(pic, lab, extra)
            self.say(sub, narr)
            if cur is None:
                self.play(FadeIn(new), run_time=0.8)
            else:
                self.play(FadeOut(cur), FadeIn(new), run_time=0.9)
            if i == 1:
                self.play(extra.animate.shift(DOWN * 0.25), run_time=0.6)
            cur = new
        self.say(f"지층은 {o('아래에서부터')} 쌓이고, {o('오랜 시간')}이 걸려요",
                 "지층은 아래에서부터 차례대로 쌓이고, 만들어지는 데 오랜 시간이 걸려요.")
        self.settle()
        clear_stage(self)

    # ── 모형과 실제 비교 ──
    def compare(self):
        self.section("모형과 실제")
        hd = VGroup(K.label("지층 모형", BLUE, 34), K.label("실제 지층", "#8A5A14", 34)).arrange(RIGHT, buff=4.0).move_to([0, 2.5, 0])
        same = K.text_card([f"{g('둘 다')}: 층의 줄무늬가 보이고, 층층이 쌓여 있어요",
                            "아래에 있는 층이 먼저 쌓였어요"], w=12.0, size=32).move_to([0, 1.2, 0])
        dif_l = K.text_card(["오랜 시간이 걸리지 않아요", "단단하지 않아요"], w=5.6, size=30).move_to([-3.2, -1.35, 0])
        dif_r = K.text_card(["만들어지기까지 오랜 시간이 걸려요", "단단해요"], w=5.8, size=30).move_to([3.2, -1.35, 0])
        hd2 = VGroup(T("모형", 28, BLUE).next_to(dif_l, UP, buff=0.12), T("실제", 28, "#8A5A14").next_to(dif_r, UP, buff=0.12))
        self.say("지층 모형과 실제 지층을 비교해요",
                 "지층 모형과 실제 지층을 비교해 봐요.")
        self.play(FadeIn(hd), run_time=0.5)
        self.say(f"{g('같은 점')}: 줄무늬, 층층이, 아래층이 먼저",
                 "둘 다 층의 줄무늬가 보이고, 층층이 쌓여 있어요. 그리고 아래에 있는 층이 먼저 쌓였어요.")
        self.play(FadeIn(same, shift=DOWN * 0.2), run_time=0.7)
        self.say(f"{r('다른 점')}: 실제 지층은 오랜 시간에 걸쳐 단단하게 굳어져요",
                 "하지만 모형은 금방 만들어지고 단단하지 않아요. 실제 지층은 오랜 시간에 걸쳐 단단하게 굳어져요.")
        self.play(FadeIn(VGroup(dif_l, dif_r, hd2), shift=UP * 0.2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생각+: 컵의 물 ──
    def water(self):
        self.section("생각+")
        cup = K.mat_cup("sand", 1.3).move_to([-4.0, 0.6, 0])
        pic = K.earth_section(1).scale(0.6).move_to([2.6, 0.5, 0])
        arr = Arrow([-2.8, 0.6, 0], [-0.8, 0.6, 0], color=ORANGE, stroke_width=8, buff=0)
        self.say("모형에서 컵의 물은 무엇을 나타낼까요?",
                 "지층 모형 만들기에서 컵에 담긴 물은 실제 지층이 만들어질 때 어떤 역할을 할까요?")
        self.play(FadeIn(cup), FadeIn(pic), run_time=0.7)
        self.pause_screen(4, "컵의 물은 어떤 역할을 할까요?")
        self.say(f"퇴적물을 바다나 호수 밑바닥으로 {o('운반')}해 쌓이게 해요",
                 "컵의 물은 자갈, 모래, 진흙을 바다나 호수 밑바닥으로 운반해 쌓이게 해요.")
        self.play(Create(arr), run_time=0.6)
        self.say("자연에서는 나뉘어 쌓이기도, 섞여서 쌓이기도 해요",
                 "실제 자연에서는 자갈, 모래, 진흙이 따로 나뉘어 쌓이기도 하고, 섞여서 쌓이기도 해요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        st = K.strata("flat", [(K.LAYER_COLS[i], t, None) for i, t in enumerate((1.0, 0.8, 1.1, 0.7))], w=4.0, h=2.6)
        st.move_to([-3.6, 0.5, 0])
        arr = Arrow(st.get_corner(DOWN + RIGHT) + RIGHT * 0.4, st.get_corner(UP + RIGHT) + RIGHT * 0.4,
                    color=ORANGE, stroke_width=8, buff=0)
        a1 = T("먼저", 28, GREEN).next_to(arr.get_start(), RIGHT, buff=0.15)
        a2 = T("나중", 28, ORANGE).next_to(arr.get_end(), RIGHT, buff=0.15)
        card = K.text_card([f"지층의 {o('아래')}에 있는 층은", f"위에 있는 층보다 {g('먼저')}", "만들어진 것입니다."],
                           w=6.4, size=40).move_to([3.0, 0.5, 0])
        self.say(f"지층의 아래에 있는 층은 위에 있는 층보다 {g('먼저')} 만들어졌어요",
                 "지층의 아래에 있는 층은 위에 있는 층보다 먼저 만들어진 것이에요.")
        self.play(FadeIn(st), Create(arr), FadeIn(a1), FadeIn(a2), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
