"""「과학 원리 돋보기」 4학년 7화 — 물이 얼 때와 얼음이 녹을 때 (4-1 2단원 물의 상태 변화 3차시, 화 코드 4-1-2-b)

바탕: grade4/science/sem1/u2-2.html(원본 _build_tb/src/u2-2.html) — 도입(물을 가득 넣은 페트병을 냉동실에: 하루 뒤 부풀어 오름 → 꺼내 놓으면 다시 줄어듦),
부피(물질이 차지하는 공간의 크기, 병 속 높이를 유성펜으로 표시해 비교)·무게(전자저울),
실험해요 1(물 반 → 검은 선 → 무게 30.1 g → 소금을 섞은 얼음에 얼림 → 물기 닦기 → 빨간 선(더 높음) → 30.1 g, 물방울이 묻으면 30.4 g으로 재어짐 → 닦고 다시),
실험해요 2(따뜻한 물(40 ℃ 정도)에 녹임 → 파란 선 = 검은 선, 빨간 선보다 낮음 → 30.1 g), 저울 값은 앱이 밝힌 '예시 값',
정리 표·생각 바로잡기(부피가 늘어도 무게는 그대로), 생활 속 예 여섯 가지, 한눈에 쏙, 생각이 쑥(주스 유리병).
최종: ./make_final.sh s4ep07
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Arrow, Line,
                   DashedLine, Circumscribe, SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, e_scale
import kit_s4u12 as K

BLACK = "#111111"
MRED = "#D62D20"
MBLUE = "#1F5FD1"
W_H = 1.0            # 처음 물 높이
I_H = 1.14           # 얼음 높이(앱 그림 100 → 114)


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def eye(s=1.0):
    e = K.E(0.5, 0.3, PAPER, 0, 0, stroke=INK, sw=4)
    return VGroup(e, K.C(0.09, INK, 0.03, 0, sw=0)).scale(s)


class S4Ep07(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 7
    EP_TITLE = "물이 얼 때와 얼음이 녹을 때"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.how()
        self.exp1()
        self.exp2()
        self.organize()
        self.daily()
        self.summary()
        self.closing(f"물이 얼면 부피가 {o('늘어나고')}, 얼음이 녹으면 부피가 {o('줄어들어요')}\n"
                     f"무게는 두 경우 모두 {g('변하지 않아요')}",
                     next_preview="4학년 8화 · 증발과 끓음은 어떻게 다를까?")
        self.wait(0.5)

    # ── 궁금해요: 냉동실 페트병 ──
    def intro(self):
        self.section("궁금해요")
        fr = K.rect(3.4, 4.2, "#F4F7FA", stroke="#8A97A3", r=0.15).move_to([-3.2, 0.3, 0])
        frl = T("냉동실", 30, "#1C6FA8").next_to(fr.get_top(), DOWN, buff=0.15)
        bt = K.pet_frozen(0, 1.0).move_to([-3.2, 0.0, 0])
        day = T("넣은 날", 38).move_to([2.5, 1.8, 0])
        self.say("물을 가득 넣은 페트병을 냉동실에 넣어요", "물을 가득 넣은 페트병을 냉동실에 넣으면 어떻게 될까요?")
        self.play(FadeIn(fr), FadeIn(frl), FadeIn(bt), FadeIn(day), run_time=0.7)
        self.pause_screen(5, "하루 뒤 페트병은 어떻게 될까요?")
        self.say(f"하루 뒤, 페트병이 {o('부풀어 올랐어요')}", "하루 뒤 꺼내 보니, 물이 꽁꽁 언 페트병이 부풀어 올랐어요.")
        self.play(Transform(bt, K.pet_frozen(1, 1.0).move_to(bt)), Transform(day, T("하루 뒤", 38).move_to(day)), run_time=1.0)
        self.say("꺼내 놓았더니 얼음이 녹으면서 다시 줄어들었어요",
                 "꺼내 놓았더니 얼음이 녹으면서 다시 줄어들었어요. 무엇이 변한 걸까요?")
        self.play(FadeOut(fr), FadeOut(frl), bt.animate.move_to([-0.8, 0.0, 0]), run_time=0.6)
        self.play(Transform(bt, K.pet_frozen(2, 1.0).move_to([-0.8, 0.0, 0])), Transform(day, T("꺼낸 뒤", 38).move_to(day)), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 부피와 무게 ──
    def how(self):
        self.section("부피와 무게")
        d = K.text_card([f"{o('부피')}: 물질이 차지하는 공간의 크기"], size=44).move_to([0, 2.1, 0])
        self.say(f"{o('부피')}는 높이로, 무게는 {o('전자저울')}로 비교해요",
                 "부피는 물질이 차지하는 공간의 크기예요. 오늘은 병 속 물과 얼음의 높이를 유성펜으로 표시해 부피를 비교해요.")
        self.play(FadeIn(d), run_time=0.6)
        b = K.Bottle(-3.0, -2.0, 1.1, 2.6)
        bt = VGroup(b.outline(), b.fill(W_H), b.mark(W_H, BLACK))
        pen = T("부피: 유성펜으로 높이 표시", 34).move_to([-2.1, b.y + 0.05 + W_H + 0.4, 0], aligned_edge=LEFT)
        sc = e_scale("0.0").scale(1.3, about_point=np.zeros(3)).shift([4.3, -2.0, 0])
        scl = T("무게: 전자저울", 34).move_to([4.3, 0.45, 0])
        self.play(FadeIn(bt), FadeIn(pen), run_time=0.6)
        self.play(FadeIn(sc), FadeIn(scl), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 공통: 병 그리기 ──
    def bottle_at(self, x, y, h, ice=False, marks=()):
        b = K.Bottle(x, y, 1.1, 2.6)
        grp = VGroup(b.outline(), b.fill(h, ice))
        for lv, col, dashed in marks:
            grp.add(b.mark(lv, col, dashed))
        grp.b = b
        return grp

    def weigh(self, bt, sc, value, wet=None):
        """병을 저울에 올림. wet가 있으면 물방울 때문에 더 무겁게 나온 뒤 닦고 다시."""
        home = bt.get_center()
        top = sc.top_y * 1.3 - 2.0
        self.play(bt.animate.shift([sc.get_center()[0] - home[0], top - bt.get_bottom()[1], 0]), run_time=0.9)
        if wet is not None:
            self.play(Transform(sc.num, T(f"{wet} g", 40, "#7CF2A4").move_to(sc.scr)), run_time=0.4)
            return home
        self.play(Transform(sc.num, T(f"{value} g", 40, "#7CF2A4").move_to(sc.scr)), run_time=0.4)
        return home

    # ── 실험해요 1 ──
    def exp1(self):
        self.section("실험해요 1")
        safe = K.safety_note(f"소금을 섞은 얼음은 {r('맨손으로 만지지 않아요')} · 유리 기구가 깨지지 않게 · 병이 기울어지지 않게").move_to([0.2, 2.35, 0])
        self.play(FadeIn(safe), run_time=0.4)
        bt = self.bottle_at(-4.6, -2.0, W_H)
        sc = e_scale("0.0").scale(1.3, about_point=np.zeros(3)).shift([4.3, -2.0, 0])
        self.say("플라스틱병에 물을 반 정도 넣고 마개를 닫아요",
                 "플라스틱병에 물을 반 정도 넣고 마개를 닫아요.")
        self.play(FadeIn(bt), FadeIn(sc), run_time=0.6)
        b = bt.b
        ln = b.mark(W_H, BLACK)
        ey = eye(1.2).move_to([b.x + 1.3, b.y + 0.05 + W_H, 0])
        sight = DashedLine(ey.get_left(), [b.x + 0.6, b.y + 0.05 + W_H, 0], color=SOFT, stroke_width=3)
        self.say(f"물의 높이와 {o('눈높이를 수평으로')} 맞추고 검은 선",
                 "물의 높이와 눈높이를 수평으로 맞추고, 검은색 유성펜으로 표시해요.")
        self.play(FadeIn(ey), Create(sight), run_time=0.6)
        self.play(Create(ln), run_time=0.5)
        self.remove(ln)
        self.play(FadeOut(ey), FadeOut(sight), run_time=0.3)
        bt.add(ln)
        home = self.weigh(bt, sc, "30.1")
        note = T("30.1 g은 예시 값이에요", 28, SOFT).move_to([0.2, -1.5, 0])
        self.say(f"영점을 맞추고 재면 처음 무게: {o('30.1 g')}", "전자저울의 영점을 맞추고 재면, 처음 무게는 30.1그램이에요. 이 값은 예시 값이에요.")
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        self.play(bt.animate.move_to(home), FadeOut(note), Transform(sc.num, K.T("0.0 g", 40, "#7CF2A4").move_to(sc.scr)), run_time=0.8)

        # 얼리기
        bk = VGroup(K.big_beaker(2.6, 2.3), K.salt_ice(2.6, 2.2)).move_to([0, -0.85, 0])
        bk.shift(UP * (-2.0 - bk.get_bottom()[1]))
        bkl = T("소금을 섞은 얼음", 28).next_to(bk, UP, buff=0.12)
        self.say("소금을 섞은 얼음이 든 비커에 넣어 완전히 얼려요",
                 "소금을 섞은 얼음이 든 비커에 넣고, 물이 완전히 얼 때까지 기다려요. 소금을 섞은 얼음은 맨손으로 만지지 않아요.")
        self.play(FadeIn(bk), FadeIn(bkl), run_time=0.5)
        self.play(bt.animate.move_to([0, bt.get_center()[1] + 0.12, 0]), run_time=0.9)
        front = K.salt_ice(2.6, 2.2, front=True).move_to(bk[1]).shift(DOWN * 0.3)
        self.play(FadeIn(front), run_time=0.3)
        self.wait(0.6)
        self.play(FadeOut(front), run_time=0.3)
        self.play(bt.animate.move_to(home), run_time=0.9)
        ice = self.bottle_at(-4.6, -2.0, I_H, ice=True, marks=[(W_H, BLACK, False)])
        self.play(Transform(bt, ice), run_time=0.8)
        self.remove(bt)
        self.add(ice)
        bt = ice
        dr = bt.b.drops(10)
        self.say("꺼내면 병 바깥에 물방울이 맺혀요. 수건으로 닦아요",
                 "꺼내면 병 바깥에 물방울이 맺혀 있어요. 수건으로 닦아요.")
        self.play(FadeIn(dr), run_time=0.5)
        self.play(FadeOut(dr), run_time=0.6)
        red = bt.b.mark(I_H, MRED)
        self.say(f"얼음의 높이를 빨간 선으로: {r('검은 선보다 높아요!')}",
                 "얼음의 높이를 빨간색으로 표시해요. 검은 선보다 높아졌어요!")
        self.play(Create(red), run_time=0.6)
        bt.add(red)
        self.play(Indicate(red, color=MRED, scale_factor=1.3), run_time=0.8)
        self.say("그럼 무게는 어떻게 되었을까요?")
        self.pause_screen(5, "물이 언 뒤 무게는?")
        home = self.weigh(bt, sc, "30.4", wet="30.4")
        dr2 = bt.b.drops(10).shift(bt.get_center() - home)
        self.add(dr2)
        self.say(f"30.4 g? 병 바깥의 {r('물방울')} 무게까지 재어졌어요",
                 "30.4그램? 병 바깥에 맺힌 물방울의 무게도 함께 재어졌어요.")
        self.play(Indicate(dr2, color=BLUE), run_time=0.8)
        self.say(f"닦고 다시 재면 {g('30.1 g')} — 무게는 그대로예요",
                 "물기를 닦고 다시 재면 30.1그램, 처음 무게와 같아요.")
        self.play(FadeOut(dr2), run_time=0.5)
        self.play(Transform(sc.num, T("30.1 g", 40, "#7CF2A4").move_to(sc.scr)), run_time=0.4)
        res = M(f"부피: {o('늘어남')}   무게: {g('변화 없음')}", 40).move_to([-2.2, 0.9, 0])
        self.play(FadeOut(bk), FadeOut(bkl), run_time=0.3)
        self.say(f"물이 얼면 부피는 {o('늘어나고')}, 무게는 {g('변하지 않아요')}",
                 "물이 얼면 부피는 늘어나고, 무게는 변하지 않아요.")
        self.play(FadeIn(res), run_time=0.6)
        self.settle()
        self.bt_final, self.sc = bt, sc
        clear_stage(self)

    # ── 실험해요 2 ──
    def exp2(self):
        self.section("실험해요 2")
        safe = K.safety_note(f"따뜻한 물(40 ℃ 정도)에 {r('데지 않게')} · 유리 기구가 깨지지 않게").move_to([0.2, 2.35, 0])
        bt = self.bottle_at(-4.6, -2.0, I_H, ice=True, marks=[(W_H, BLACK, False), (I_H, MRED, False)])
        sc = e_scale("0.0").scale(1.3, about_point=np.zeros(3)).shift([4.3, -2.0, 0])
        bk = VGroup(K.big_beaker(2.6, 2.3), K.warm_water(2.6, 1.8)).move_to([0, -0.85, 0])
        bk.shift(UP * (-2.0 - bk.get_bottom()[1]))
        st = K.steam(3, 0.6, 0.6).next_to(bk, UP, buff=0.05)
        bkl = T("따뜻한 물", 28, "#B85A2E").next_to(st, UP, buff=0.05)
        self.say("얼린 병을 따뜻한 물이 든 비커에 넣어 녹여요",
                 "얼린 병을 따뜻한 물이 든 비커에 넣어 녹여요. 데지 않게 조심해요.")
        self.play(FadeIn(safe), FadeIn(bt), FadeIn(sc), FadeIn(bk), FadeIn(st), FadeIn(bkl), run_time=0.7)
        home = bt.get_center()
        self.play(bt.animate.move_to([0, home[1] + 0.12, 0]), run_time=0.9)
        self.wait(0.5)
        self.play(bt.animate.move_to(home), run_time=0.9)
        melt = self.bottle_at(-4.6, -2.0, W_H, marks=[(W_H, BLACK, False), (I_H, MRED, False)])
        self.play(Transform(bt, melt), run_time=0.8)
        self.remove(bt)
        self.add(melt)
        bt = melt
        blue = melt.b.mark(W_H, MBLUE, dashed=True).shift(RIGHT * 0.0)
        self.say("물기를 닦고 물의 높이를 파란 선으로 표시해요")
        self.pause_screen(5, "파란 선은 어디에 그어질까요?")
        self.play(Create(blue), run_time=0.6)
        self.say(f"파란 선은 빨간 선보다 낮고, {o('처음 검은 선과 같아요')}",
                 "파란 선은 빨간 선보다 낮고, 처음 검은 선과 같아요.")
        self.play(Indicate(blue, color=MBLUE, scale_factor=1.3), run_time=0.8)
        bt.add(blue)
        self.say(f"무게는? 물기를 닦고 재면 {g('30.1 g')} 그대로", "무게는 30.1그램, 그대로예요.")
        self.weigh(bt, sc, "30.1")
        res = M(f"부피: {o('줄어듦')}   무게: {g('변화 없음')}", 40).move_to([-2.2, 0.9, 0])
        self.play(FadeOut(bk), FadeOut(st), FadeOut(bkl), run_time=0.3)
        self.say(f"얼음이 녹으면 부피는 {o('줄어들고')}, 무게는 {g('변하지 않아요')}",
                 "얼음이 녹으면 부피는 줄어들고, 무게는 변하지 않아요.")
        self.play(FadeIn(res), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def organize(self):
        self.section("정리해요")
        cw, ch = 3.4, 1.0
        heads = ["구분", "부피", "무게"]
        rows = [["물이 얼 때", "늘어난다", "변화가 없다"], ["얼음이 녹을 때", "줄어든다", "변화가 없다"]]
        tbl = VGroup()
        for i, row in enumerate([heads] + rows):
            for j, txt in enumerate(row):
                w = 3.8 if j == 0 else cw
                x = -3.6 if j == 0 else (-3.6 + 1.9 + cw / 2 + (j - 1) * cw)
                cell = K.rect(w, ch, "#E6F1EC" if i == 0 else PAPER, stroke=SOFT, sw=3).move_to([x, 1.9 - i * ch, 0])
                col = INK if (i == 0 or j == 0) else (ORANGE if j == 1 else GREEN)
                t = T(txt, 36, col).move_to(cell)
                tbl.add(VGroup(cell, t))
        tbl.move_to([0, 1.0, 0])
        self.say("실험 결과를 표로 정리해요")
        self.play(*[FadeIn(c[0]) for c in tbl], *[FadeIn(c[1]) for k, c in enumerate(tbl) if k < 3 or k % 3 == 0], run_time=0.8)
        self.say(f"부피는 {o('변하고')}, 무게는 {g('변하지 않아요')}",
                 "물이 얼 때와 얼음이 녹을 때 부피는 변하고, 무게는 변하지 않아요.")
        self.play(*[FadeIn(c[1], scale=1.2) for k, c in enumerate(tbl) if k >= 3 and k % 3 != 0], run_time=0.8)
        self.settle()
        q = M(f"생각 바로잡기: 부피가 늘었으니 {r('무게도 늘었을까요?')}", 38).move_to([0, -1.2, 0])
        self.say("부피가 늘었으니 무게도 늘었을까요?", "물이 얼어 부피가 늘어났으니, 무게도 늘어났을까요?")
        self.play(FadeIn(q), run_time=0.5)
        a = M(f"아니요, 부피는 늘어나도 {g('무게는 그대로')}예요", 38).move_to([0, -2.0, 0])
        self.say(f"아니요! 부피는 늘어나도 무게는 {g('그대로')}예요", "아니요. 부피는 늘어나도 무게는 그대로예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 생활 속 예 ──
    def daily(self):
        self.section("생활 속 예")
        up = K.bin_box("물이 얼 때 부피가 늘어나서", 6.7, 4.9, BLUE, 32).move_to([-3.45, 0.3, 0])
        dn = K.bin_box("얼음이 녹을 때 부피가 줄어서", 6.7, 4.9, ORANGE, 32).move_to([3.45, 0.3, 0])
        self.say("우리 주변에서 부피가 변하는 예를 찾아요")
        self.play(FadeIn(up), FadeIn(dn), run_time=0.6)
        L = [("얼음 틀 위로 올라온 얼음", "얼음 틀에 물을 넣어 얼리면 얼음이 틀 위로 올라와요."),
             ("바위틈의 물이 얼어 바위가 쪼개져요", "추운 겨울 바위틈의 물이 얼면서 바위가 쪼개지기도 해요."),
             ("수도 계량기가 터져요", "겨울에 갑자기 추워지면 수도 계량기가 터지기도 해요."),
             ("그릇의 물이 얼며 솟는 역고드름", "그릇에 떠 놓은 물이 얼면서 얼음 기둥이 위로 솟기도 해요. 역고드름이라고 해요.")]
        R = [("튜브형 얼음과자를 녹이면 빈 공간", "튜브형 얼음과자를 녹이면 빈 공간이 생겨요."),
             ("부푼 페트병을 꺼내 놓으면 줄어들어요", "물이 얼어 부푼 페트병을 꺼내 놓으면 다시 줄어들어요.")]
        ys = [1.55, 0.6, -0.35, -1.3]
        lt = VGroup(*[T("· " + s, 30).move_to([-6.6, y, 0], aligned_edge=LEFT) for (s, _), y in zip(L, ys)])
        rt = VGroup(*[T("· " + s, 30).move_to([0.3, y, 0], aligned_edge=LEFT) for (s, _), y in zip(R, ys)])
        for t in list(lt) + list(rt):
            if t.width > 6.2:
                t.scale_to_fit_width(6.2, about_edge=LEFT)
        self.say("얼 때: 얼음 틀·바위틈·수도 계량기·역고드름",
                 "물이 얼면 부피가 늘어나서 얼음이 틀 위로 올라오고, 바위가 쪼개지고, 수도 계량기가 터지기도 해요.")
        self.play(FadeIn(lt, lag_ratio=0.4), run_time=2.0)
        self.say("녹을 때: 튜브형 얼음과자·부푼 페트병", "얼음이 녹으면 부피가 줄어서 얼음과자 튜브에 빈 공간이 생기고, 부푼 페트병이 줄어들어요.")
        self.play(FadeIn(rt, lag_ratio=0.4), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"물이 얼어 얼음으로 상태가 변하면 부피는 {r('늘어나고')},",
                            f"무게는 {r('변하지 않습니다')}."], w=12.4, size=46).move_to([0, 1.6, 0])
        self.say(f"물이 얼면 부피는 {r('늘어나고')}, 무게는 {r('변하지 않아요')}",
                 "물이 얼어 얼음으로 상태가 변하면 부피는 늘어나고, 무게는 변하지 않아요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        jar = VGroup(K.rect(1.2, 1.7, "#F9C25A", stroke=K.GLASS, r=0.2), K.rect(0.9, 0.25, "#C9463B", 0, 0.98, sw=0, r=0.05)).scale(0.85).move_to([-5.9, -1.0, 0])
        q = T("주스가 가득 든 유리병을 냉동실에 넣으면 안 되는 까닭은?", 34).move_to([-5.0, -0.5, 0], aligned_edge=LEFT)
        a = M(f"주스가 얼면서 {o('부피가 늘어나')} 유리병이 깨질 수 있어서", 34).move_to([-5.0, -1.5, 0], aligned_edge=LEFT)
        self.say("주스가 가득 든 유리병을 얼리면 안 되는 까닭은?",
                 "주스가 가득 담긴 유리병을 냉동실에 넣어 두면 안 되는 까닭은 무엇일까요?")
        self.play(FadeIn(jar), FadeIn(q), run_time=0.6)
        self.say(f"얼면서 {o('부피가 늘어나')} 유리병이 깨질 수 있어요",
                 "주스가 얼면서 부피가 늘어나 유리병이 깨질 수 있기 때문이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.settle()
        clear_stage(self)
