"""「과학 원리 돋보기」 5학년 3화 — 지층을 이루는 암석 (5-1 1단원 지층과 화석 4차시, 화 코드 5-1-1-c)

바탕: grade5/science/sem1/u1-3.html(원본 _build_tb/src/u1-3.html) — 도입(쌀·콩·견과류 강정: 알갱이 크기가 다름),
퇴적암이 만들어지는 과정(① 운반 ② 쌓임 ③ 눌림: 알갱이 사이 공간이 좁아짐 ④ 붙음: 물에 녹아 있는 물질이 엉겨 붙게 함 ⑤ 오랜 시간 → 퇴적암),
지층은 주로 퇴적암, 퇴적암 표본 6개 관찰(만진 느낌·색깔·알갱이 크기 — 앱 값 그대로), 알갱이 크기로 분류(작은 ②④ · 중간 ①⑥ · 큰 ③⑤),
이암·사암·역암 설명, 역암 주의, 생각+(모래를 쥐어도 퇴적암이 되지 않는 까닭), 한눈에 쏙.
최종: ./make_final.sh s5ep03
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker, always_redraw,
                   linear, Arrow, LaggedStart, SurroundingRectangle)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


# 퇴적암 표본 ①~⑥ (앱 u1-3 값): 종류, 색, 만진 느낌, 색깔, 알갱이
ROCKS = [("sand", "#8A5E3A", "까끌까끌해요", "진한 갈색", "모래 알갱이 정도"),
         ("mud", "#E6CF6E", "매우 부드러워요", "노란색", "매우 작아 잘 보이지 않아요"),
         ("gravel", "#A3A09A", "거칠고 울퉁불퉁해요", "연한 회색과 진한 회색", "크고 작은 알갱이가 섞여 있어요"),
         ("mud", "#C9AE88", "부드러워요", "연한 갈색", "매우 작아요"),
         ("gravel", "#C4A985", "거칠어요", "연한 갈색", "크고 작은 알갱이가 섞여 있어요"),
         ("sand", "#C7C2B8", "약간 거친 부분이 있어요", "연한 회색", "모래 알갱이 정도")]
NUM = "①②③④⑤⑥"


class S5Ep03(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 3
    EP_TITLE = "지층을 이루는 암석"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.making()
        self.observe()
        self.three()
        self.squeeze()
        self.summary()
        self.closing(f"퇴적암은 알갱이의 {o('크기')}에 따라\n{g('이암, 사암, 역암')}으로 분류해요",
                     next_preview="5학년 4화 · 여러 가지 화석")
        self.wait(0.5)

    # ── 궁금해요: 강정 ──
    def intro(self):
        self.section("궁금해요")
        names = [("rice", "쌀 강정"), ("bean", "콩 강정"), ("nut", "견과류 강정")]
        gs = VGroup(*[VGroup(K.gangjeong(k, 3.0, 1.7), T(n, 30)).arrange(DOWN, buff=0.2) for k, n in names])
        gs.arrange(RIGHT, buff=0.7).move_to([0, 0.5, 0])
        self.say("여러 가지 강정은 무엇이 다른가요?", "여러 가지 강정이에요. 세 강정은 무엇이 다른가요?")
        self.play(FadeIn(gs, lag_ratio=0.2), run_time=1.0)
        self.say(f"강정을 이루는 {o('알갱이의 크기')}가 달라요",
                 "강정을 이루는 알갱이의 크기가 달라요. 쌀 강정은 알갱이가 작고, 견과류 강정은 알갱이가 커요.")
        self.play(LaggedStart(*[Indicate(x[0], color=ORANGE, scale_factor=1.06) for x in gs], lag_ratio=0.3), run_time=1.5)
        self.say("지층은 무엇으로 이루어져 있을까요?",
                 "지층을 자세히 보면 자갈, 모래, 진흙 등의 알갱이를 볼 수 있어요. 지층은 무엇으로 이루어져 있을까요?")
        self.settle()
        clear_stage(self)

    # ── 퇴적암이 되기까지 ──
    def making(self):
        self.section("퇴적암이 되기까지")
        base_y = -1.9
        water = K.rect(11.6, 4.6, K.WATER, y=0.4, stroke=K.WATER, sw=0, op=0.55)
        floor = K.rect(11.6, 0.25, "#B9A382", y=base_y - 0.125, stroke="#6B5235", sw=3)
        fl = T("바다나 호수 밑바닥", 26, "#6B5235").move_to([-4.6, base_y + 0.25, 0])
        note = T("퇴적물 알갱이를 크게 그린 그림", 26, SOFT).move_to([0, 2.45, 0])
        self.add(water)
        self.play(FadeIn(water), FadeIn(floor), FadeIn(fl), FadeIn(note), run_time=0.6)
        p, gl, so = ValueTracker(0.0), ValueTracker(0.0), ValueTracker(0.0)
        gr = always_redraw(lambda: K.grains(p.get_value(), gl.get_value(), solid=so.get_value())
                           .shift([0, base_y, 0]))
        gr0 = K.grains(0, 0).shift([0, base_y, 0])
        # ① 운반
        self.say(f"① 물이나 바람이 퇴적물을 {o('운반')}해요",
                 "퇴적암은 어떻게 만들어질까요? 먼저 물이나 바람이 자갈, 모래, 진흙 등의 퇴적물을 운반해요.")
        moving = gr0.copy().shift([-9.0, 0.6, 0]).set_opacity(0.95)
        self.play(moving.animate.shift([6.0, 0, 0]), run_time=1.6, rate_func=linear)
        # ② 쌓임
        self.say(f"② 운반된 퇴적물이 바다나 호수 밑바닥에 {o('쌓여요')}",
                 "운반된 퇴적물이 바다나 호수 밑바닥에 쌓여요.")
        self.play(moving.animate.move_to(gr0), run_time=1.2)
        self.remove(moving)
        self.add(gr)
        self.settle()
        # ③ 눌림
        top = K.grains(0, 0).top + base_y
        band = K.rect(9.6, 0.42, "#B9A382", y=top + 1.3, stroke="#6B5235", sw=3, op=0.95)
        bl = T("나중에 쌓인 퇴적물", 26).move_to(band)
        arr = K.press_arrows(-3.0, 3.0, top + 0.45, 3)
        self.say(f"③ 나중에 쌓인 퇴적물이 눌러 알갱이 사이가 {r('좁아져요')}",
                 "나중에 쌓인 퇴적물이 누르기 때문에, 퇴적물 알갱이 사이의 공간이 좁아져요.")
        self.play(FadeIn(VGroup(band, bl), shift=DOWN * 0.5), FadeIn(arr), FadeOut(note), run_time=0.7)
        top1 = K.grains(1, 0).top + base_y
        self.play(p.animate.set_value(1.0), VGroup(band, bl).animate.shift(DOWN * (top - top1)),
                  arr.animate.shift(DOWN * (top - top1)), run_time=2.0)
        self.settle()
        # ④ 붙음
        self.say(f"④ 물에 녹아 있는 물질이 알갱이를 {o('엉겨 붙게')} 해요",
                 "물에 녹아 있는 여러 가지 물질이 퇴적물 알갱이를 서로 엉겨 붙게 해요. 파란 점이 그 물질이에요.")
        self.play(gl.animate.set_value(1.0), FadeOut(arr), run_time=1.5)
        self.settle()
        # ⑤ 퇴적암
        ck = VGroup(K.clock(0.38), T("오랜 시간", 28)).arrange(RIGHT, buff=0.15).move_to([4.6, 1.6, 0])
        self.say(f"⑤ 오랜 시간 계속되어 단단한 {g('퇴적암')}이 돼요",
                 "이러한 과정이 오랜 시간 계속되어 단단한 퇴적암이 돼요.")
        self.play(FadeIn(ck), FadeOut(VGroup(band, bl)), run_time=0.5)
        self.play(so.animate.set_value(1.0), run_time=1.2)
        gr.clear_updaters()
        nm = K.label("단단한 퇴적암", GREEN, 32).move_to([0, 1.55, 0])
        self.play(FadeIn(nm), run_time=0.5)
        self.say(f"지층은 주로 {g('퇴적암')}으로 이루어져 있어요",
                 "오랜 시간에 걸쳐 지층이 만들어질 때 퇴적물은 굳어져 암석이 돼요. 이 암석을 퇴적암이라고 해요. 지층은 주로 퇴적암으로 이루어져 있어요.")
        self.settle()
        clear_stage(self)

    # ── 관찰해요: 퇴적암 6개 ──
    def observe(self):
        self.section("관찰해요")
        rocks = []
        for i, (k, col, *_r) in enumerate(ROCKS):
            rk = K.sed_rock(k, 0.75, seed=i + 2, col=col)
            rocks.append(VGroup(rk, T(NUM[i], 34).next_to(rk, DOWN, buff=0.12)))
        row = VGroup(*rocks).arrange(RIGHT, buff=0.35).move_to([0, 1.3, 0])
        self.say("퇴적암 표본 6개를 관찰해요",
                 "번호를 붙인 퇴적암 표본 여섯 개를 관찰해 봐요. 만졌을 때의 느낌, 색깔, 알갱이의 크기를 살펴봐요.")
        self.play(FadeIn(row, lag_ratio=0.15), run_time=1.2)
        # 예: ② 와 ③
        for i in (1, 2):
            k, col, feel, colr, size = ROCKS[i]
            zm = K.zoom_rock(k, 0.95).move_to([-4.4, -1.0, 0])
            card = K.text_card([f"퇴적암 {NUM[i]}", f"만졌을 때: {feel}", f"색깔: {colr}", f"알갱이: {size}"],
                               w=8.6, size=28).move_to([1.7, -1.0, 0])
            ring = SurroundingRectangle(rocks[i], color=ORANGE, buff=0.08, corner_radius=0.15, stroke_width=6)
            txt = (f"퇴적암 {NUM[i]}는 {o('매우 부드럽고')}, 알갱이가 잘 보이지 않아요" if i == 1 else
                   f"퇴적암 {NUM[i]}은 {o('거칠고')}, 크고 작은 알갱이가 섞여 있어요")
            narr = ("퇴적암 이는 만졌을 때 매우 부드럽고, 노란색이에요. 알갱이의 크기가 매우 작아서 잘 보이지 않아요." if i == 1 else
                    "퇴적암 삼은 거칠고 울퉁불퉁해요. 연한 회색과 진한 회색이 섞여 있고, 크고 작은 알갱이가 군데군데 섞여 있어요.")
            self.say(txt, narr)
            self.play(Create(ring), FadeIn(zm), FadeIn(card), run_time=0.7)
            self.settle()
            self.play(FadeOut(VGroup(ring, zm, card)), run_time=0.4)
        self.say(f"퇴적암마다 {o('알갱이의 크기')}가 서로 달라요",
                 "퇴적암 여섯 개를 모두 관찰해 보면, 퇴적암마다 알갱이의 크기가 서로 달라요.")
        self.settle()
        # 분류
        self.section("분류해요")
        names = [("알갱이가 작은 것", ORANGE), ("중간인 것", BLUE), ("큰 것", GREEN)]
        bins = VGroup(*[K.bin_box(n, 4.2, 2.6, c, 30) for n, c in names]).arrange(RIGHT, buff=0.3).move_to([0, -1.05, 0])
        self.say(f"색깔이 아니라 {o('알갱이의 크기')}로 세 가지로 나눠요",
                 "이제 알갱이의 크기에 따라 작은 것, 중간인 것, 큰 것으로 나눠 봐요. 색깔이 아니라 알갱이의 크기로 나눠요.")
        self.play(FadeIn(bins, lag_ratio=0.1), run_time=0.7)
        self.pause_screen(6, "알갱이 크기로 나누어 보세요")
        grp = {"mud": 0, "sand": 1, "gravel": 2}
        cnt = [0, 0, 0]
        moves = []
        for i, (k, *_r) in enumerate(ROCKS):
            b = grp[k]
            tgt = bins[b].box.get_center() + np.array([-1.0 + 2.0 * cnt[b], -0.25, 0])
            cnt[b] += 1
            moves.append(rocks[i].animate.scale(0.85).move_to(tgt))
        self.say(f"작은 것 ②, ④ · 중간인 것 ①, ⑥ · 큰 것 ③, ⑤",
                 "알갱이가 작은 것은 이와 사, 중간인 것은 일과 육, 큰 것은 삼과 오예요. 알갱이의 크기로 나누면 누가 나누어도 같은 결과가 나와요.")
        self.play(*moves, run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 이암·사암·역암 ──
    def three(self):
        self.section("이암·사암·역암")
        data = [("mud", "이암", "매우 작은 알갱이(진흙)", ORANGE),
                ("sand", "사암", "중간 크기 알갱이(모래)", BLUE),
                ("gravel", "역암", "큰 자갈 + 모래·진흙", GREEN)]
        cols = VGroup()
        for k, nm, d, c in data:
            zm = K.zoom_rock(k, 1.05)
            lab = K.label(nm, c, 40)
            dt = T(d, 30)
            if dt.width > 4.0:
                dt.scale_to_fit_width(4.0)
            cols.add(VGroup(zm, lab, dt).arrange(DOWN, buff=0.25))
        cols.arrange(RIGHT, buff=0.55).move_to([0, 0.35, 0])
        for c in cols:
            c[2].move_to([c[2].get_x(), cols[0][2].get_y(), 0])
        narr = ["이암은 주로 진흙이나 갯벌의 흙처럼 크기가 매우 작은 알갱이로 이루어져 있어요.",
                "사암은 주로 진흙보다 알갱이의 크기가 큰 모래로 이루어져 있어요.",
                "역암은 알갱이의 크기가 큰 자갈에 모래나 진흙 등이 섞여 이루어져 있어요."]
        subs = [f"{o('이암')}: 알갱이가 매우 작아요(진흙)", f"<span foreground=\"{BLUE}\">사암</span>: 알갱이가 중간이에요(모래)",
                f"{g('역암')}: 알갱이가 커요(자갈 + 모래·진흙)"]
        for i in range(3):
            self.say(subs[i], narr[i])
            self.play(FadeIn(cols[i], shift=UP * 0.2), run_time=0.7)
        self.say(f"역암은 자갈로만 이루어진 것이 {r('아니에요')}",
                 "주의해요. 역암은 자갈로만 이루어진 것이 아니에요. 큰 자갈에 모래나 진흙 등이 섞여 있어요.")
        self.play(Indicate(cols[2][0], color=RED, scale_factor=1.08), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각+: 모래를 쥐면? ──
    def squeeze(self):
        self.section("생각+")
        sand = K.sed_rock("sand", 0.9, seed=9, col=K.SAND).move_to([-3.2, 0.5, 0])
        q = T("모래를 손으로 세게 쥐면 퇴적암이 될까요?", 34).move_to([0, 2.4, 0])
        self.say("모래를 손으로 세게 쥐면 퇴적암이 될까요?",
                 "모래를 손으로 세게 쥐면 퇴적암처럼 단단하게 뭉쳐질까요?")
        self.play(FadeIn(q), FadeIn(sand), run_time=0.6)
        self.pause_screen(5, "왜 단단하게 뭉쳐지지 않을까요?")
        card = K.text_card([f"알갱이를 {o('붙게 하는 물질')}이 없어요", f"{o('오랜 시간')} 누르지 않았어요"],
                           w=6.6, size=34).move_to([2.6, 0.5, 0])
        self.say(f"붙게 하는 물질이 없고, {o('오랜 시간')} 누르지 않았기 때문이에요",
                 "손으로 쥐어도 단단하게 뭉쳐지지 않아요. 알갱이를 붙게 하는 물질이 없고, 오랜 시간 누르지 않았기 때문이에요.")
        self.play(FadeIn(card, shift=LEFT * 0.3), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        zs = VGroup(*[VGroup(K.zoom_rock(k, 0.7), T(n, 30)).arrange(DOWN, buff=0.15)
                      for k, n in (("mud", "이암"), ("sand", "사암"), ("gravel", "역암"))]).arrange(RIGHT, buff=0.8)
        zs.move_to([0, 1.5, 0])
        card = K.text_card([f"퇴적암은 암석을 이루고 있는 알갱이의 {o('크기')}에 따라",
                            f"{g('이암, 사암, 역암')}으로 분류할 수 있습니다."], w=12.4, size=38).move_to([0, -1.05, 0])
        self.say(f"퇴적암은 알갱이의 {o('크기')}에 따라 이암, 사암, 역암으로 분류해요",
                 "퇴적암은 암석을 이루고 있는 알갱이의 크기에 따라 이암, 사암, 역암으로 분류할 수 있어요.")
        self.play(FadeIn(zs, lag_ratio=0.15), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
