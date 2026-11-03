"""「과학 원리 돋보기」 6학년 31화 — 물질이 탈 때 나타나는 현상 (6-2 2단원 물질의 연소 2차시, 화 코드 6-2-2-b)

바탕: grade6/science/sem2/u2-2.html(원본 _build_tb/src2/u2-2.html) — 도입(케이크용 초에 불을 붙이고 전등을 끄면 주변이 환해지고 따뜻해짐),
양초 관찰(안전 수칙, 불꽃 모양 위아래로 길쭉·노란색·붉은색 등·흔들림, 열 변색 종이: 가까울수록 더 따뜻, 전등을 끄면 주변이 밝아짐,
시간이 지나면 촛농이 흘러내리고 길이가 짧아짐), 알코올 관찰(푸른색·붉은색 등, 알코올의 양이 줄어듦), 알코올램프 끄기(뚜껑을 옆에서 살며시),
결과 비교 표, 공통적인 현상(빛·열·타는 물질의 양이 줄어듦), 생각+(빛 이용: 유등·막대 폭죽·청사초롱·정전 때 촛불 / 열 이용: 벽난로·
가스레인지·숯불 구이·석유난로), 한눈에 쏙·생각이 쑥(정전 때 촛불 → 빛).
최종: ./make_final.sh s6ep31
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform, Circle,
                   RoundedRectangle, Rectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u22 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="#2F6FD6">{s}</span>'


ROOM = "#2C3550"


class S6Ep31(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 31
    EP_TITLE = "물질이 탈 때 나타나는 현상"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.safety()
        self.observe("candle")
        self.observe("alcohol")
        self.lamp_off()
        self.common()
        self.uses()
        self.summary()
        self.closing(f"물질이 탈 때에는 {o('빛')}과 {r('열')}이 발생하고,\n타는 물질의 양이 줄어들어요",
                     next_preview="6학년 32화 · 물질이 타려면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        cake = VGroup(K.rr(3.0, 1.1, "#F7D9E3", 0, 0, stroke="#C98BA0", sw=4, r=0.12),
                      K.rr(3.0, 0.3, "#FFFFFF", 0, 0.45, stroke="#C98BA0", sw=3, r=0.1))
        cs = VGroup(*[K.candle(0.7, True, w=0.14, dish=False, fs=0.45).move_to([x, 1.1, 0]) for x in (-0.8, 0, 0.8)])
        pic = VGroup(cake, cs).move_to([-3.4, 0.0, 0])
        q = K.text_card(["케이크용 초에 불을 붙이고", "전등을 끄면 주변이 어떻게 될까요?"], size=32).move_to([3.0, 1.4, 0])
        self.say("초에 불을 붙이고 전등을 끄면 어떻게 될까요?", "케이크용 초에 불을 붙이고 전등을 끄면 주변이 어떻게 될까요?")
        self.play(FadeIn(pic), FadeIn(q), run_time=0.8)
        self.settle()
        a = K.text_card([f"주변이 {o('환해지고')} {r('따뜻해져요')}"], size=34).move_to([3.0, -0.6, 0])
        self.say(f"주변이 {o('환해지고')} {r('따뜻해져요')}",
                 "주변이 환해지고 따뜻해져요. 물질이 탈 때 나타나는 현상을 관찰해 봐요.")
        self.play(FadeIn(a, shift=UP * 0.2), *[Indicate(c.flame, color=ORANGE) for c in cs], run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 안전 ──
    def safety(self):
        self.section("안전 수칙")
        items = ["면장갑·보안경·실험복을 착용해요", "비상구·소화기·모래 보관함 위치를 확인해요",
                 "주변의 탈 수 있는 물체를 치워요", "불꽃 윗부분은 매우 뜨거워요 — 위에서 들여다보지 않아요",
                 "화상을 입으면 바로 찬물로 식히고 선생님께 알려요"]
        card = K.text_card([f"{r('●')} {t}" for t in items], w=11.0, size=32).move_to([0, 0.3, 0])
        self.say(f"불을 다룰 때는 {r('안전 수칙')}을 먼저 확인해요",
                 "면장갑과 보안경, 실험복을 착용하고, 비상구와 소화기, 모래 보관함 위치를 확인하고, 주변의 탈 수 있는 물체를 치워요.")
        self.play(FadeIn(card[0]), FadeIn(card[1][:3], lag_ratio=0.3), run_time=1.0)
        self.settle()
        self.say(f"불꽃 윗부분은 {r('매우 뜨거워요')}",
                 "불꽃 윗부분은 매우 뜨거우니 위에서 들여다보지 않아요. 화상을 입으면 바로 찬물로 식혀요.")
        self.play(FadeIn(card[1][3:], lag_ratio=0.3), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 관찰 (양초 · 알코올) ──
    def observe(self, kind):
        is_c = kind == "candle"
        self.section("양초가 탈 때" if is_c else "알코올이 탈 때")
        room = RoundedRectangle(corner_radius=0.3, width=5.6, height=4.75, fill_color="#FFFDF6", fill_opacity=1,
                                stroke_color=SOFT, stroke_width=4).move_to([-3.7, 0.05, 0])
        base_y = -2.0
        top = K.table_top(5.3, base_y).move_to([-3.7, base_y - 0.16, 0])

        def make(t):
            m = K.candle(2.0, True, w=0.42, melt=t, fs=1.4) if is_c else K.alcohol_lamp(0.75 - 0.45 * t, True, s=1.35)
            m.shift(RIGHT * -3.7 + UP * base_y)
            return m
        obj = make(0.0)
        name = "양초" if is_c else "알코올"
        col_txt = "노란색·붉은색 등" if is_c else f"{bl('푸른색')}·붉은색 등"
        lines = [f"불꽃: 위아래로 길쭉, {col_txt}",
                 f"불꽃 주변이 {r('따뜻해져요')}",
                 f"불꽃 주변이 {o('밝아져요')}",
                 ("촛농이 흘러내리고 " + f"{g('길이가 짧아져요')}") if is_c else f"알코올의 {g('양이 줄어들어요')}"]
        card = K.text_card(lines, w=6.6, size=30).move_to([3.4, 0.3, 0])
        rows = card[1]
        self.add(room, top)
        self.say(f"{name}에 불을 붙이고 불꽃을 자세히 봐요",
                 "양초의 불꽃은 위아래로 길쭉하고, 노란색, 붉은색 등이에요. 불꽃이 계속 흔들려요."
                 if is_c else
                 "알코올램프를 평평한 곳에 두고 불을 붙여요. 불꽃은 위아래로 길쭉하고, 푸른색, 붉은색 등이에요.")
        self.play(FadeIn(obj), FadeIn(card[0]), FadeIn(rows[0]), run_time=0.8)
        f = obj.flame
        self.play(f.animate.stretch(1.08, 1, about_edge=DOWN).shift(RIGHT * 0.04), run_time=0.4)
        self.play(f.animate.stretch(1 / 1.08, 1, about_edge=DOWN).shift(LEFT * 0.04), run_time=0.4)
        self.settle()
        # 열 변색 종이
        fc = f.get_center()
        near = K.rr(0.7, 0.24, "#C0392B", fc[0] + 0.95, fc[1] + 0.1, stroke=INK, sw=2, r=0.03)
        far = K.rr(0.7, 0.24, "#F1C40F", fc[0] + 2.1, fc[1] + 0.1, stroke=INK, sw=2, r=0.03)
        hp = K.label("열 변색 종이", INK, 24).move_to([fc[0] + 1.5, fc[1] + 0.85, 0])
        waves = K.heat_waves(3, 0.6).move_to(f.get_top() + UP * 0.45)
        self.say(f"불꽃에 가까울수록 더 {r('따뜻해요')}",
                 "열 변색 종이로 재 보면 불꽃 주변이 따뜻하고, 가까울수록 더 따뜻해요.")
        self.play(FadeIn(near), FadeIn(far), FadeIn(hp), FadeIn(waves), FadeIn(rows[1]), run_time=0.8)
        self.settle()
        # 전등 끄기
        dark = RoundedRectangle(corner_radius=0.3, width=5.6, height=4.75, fill_color=ROOM, fill_opacity=0.82,
                                stroke_width=0).move_to(room)
        glow = Circle(radius=1.6, fill_color="#FFF2A8", fill_opacity=0.35, stroke_width=0).move_to(f.get_center() + UP * 0.1)
        self.say(f"전등을 끄면 불꽃 주변이 {o('밝아져요')}", "교실 전등을 꺼 봐요. 불꽃 주변이 밝아져요.")
        self.play(FadeOut(VGroup(near, far, hp, waves)), FadeIn(dark), run_time=0.6)
        self.add(glow, obj)
        self.play(FadeIn(glow), FadeIn(rows[2]), run_time=0.6)
        self.settle()
        # 시간이 지나면
        later = make(1.0)
        clock = K.label("시간이 지나면", INK, 26).move_to([-3.7, 2.0, 0])
        self.say(f"시간이 지나면 {name}의 {g('양이 줄어들어요')}" if not is_c else f"시간이 지나면 양초의 {g('길이가 짧아져요')}",
                 "시간이 지나면 양초가 녹아 심지 아래에 고이고, 촛농이 흘러내려요. 양초의 길이가 점점 짧아져요."
                 if is_c else "시간이 지날수록 알코올의 양이 점점 줄어들어요.")
        self.play(FadeOut(VGroup(dark, glow)), FadeIn(clock), run_time=0.5)
        self.play(Transform(obj, later), FadeIn(rows[3]), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 알코올램프 끄기 ──
    def lamp_off(self):
        self.section("불 끄기")
        a = K.alcohol_lamp(0.6, True, s=1.25).move_to([-3.3, 0.25, 0])
        b = K.alcohol_lamp(0.6, False, cap=True, s=1.25).move_to([3.3, 0.05, 0])
        xa = K.ox_mark(False, 0.4).move_to([-3.3, 2.3, 0])
        ob = K.ox_mark(True, 0.4).move_to([3.3, 2.3, 0])
        ta = K.text_card(["㉮ 입으로 세게 불어서 꺼요"], size=28).move_to([-3.3, -2.0, 0])
        tb = K.text_card(["㉯ 뚜껑을 옆에서 살며시 덮어 꺼요"], size=28).move_to([3.3, -2.0, 0])
        self.say("알코올램프의 불은 어떻게 끌까요?", "알코올램프의 불은 어떻게 끌까요?")
        self.play(FadeIn(a), FadeIn(b), FadeIn(ta), FadeIn(tb), run_time=0.8)
        self.settle()
        self.say(f"입으로 불지 않고, {o('뚜껑을 옆에서 살며시')} 덮어요",
                 "입으로 불면 알코올램프 안의 증기에 불이 붙을 수 있어 위험해요. 면장갑을 낀 손으로 뚜껑을 옆에서 살며시 덮어 꺼요.")
        self.play(FadeIn(xa), FadeIn(ob), Circumscribe(tb, color=GREEN), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 공통점 ──
    def common(self):
        self.section("결과 비교")
        tab = K.result_table(["구분", "양초", "알코올"],
                             [["불꽃의 색깔", "노란색·붉은색 등", "푸른색·붉은색 등"],
                              ["불꽃의 모양", "위아래로 길쭉하다", "위아래로 길쭉하다"],
                              ["밝기", "주변이 밝아진다", "주변이 밝아진다"],
                              ["따뜻한 정도", "주변이 따뜻해진다", "주변이 따뜻해진다"],
                              ["타는 물질의 양", "점점 줄어든다", "점점 줄어든다"]],
                             [3.2, 3.8, 3.8], row_h=0.74, size=28).move_to([0, 0.35, 0])
        self.say("양초와 알코올이 탈 때를 비교해 봐요",
                 "양초와 알코올이 탈 때의 관찰 결과를 비교해 봐요. 불꽃의 색깔은 조금 달랐어요.")
        self.play(FadeIn(tab), run_time=0.8)
        self.settle()
        self.pause_screen(5, "양초와 알코올이 탈 때의 공통점은?")
        clear_stage(self)
        cards = VGroup(
            K.case_card(VGroup(K.lamp_rays()), "빛", "불꽃 주변이\n밝아져요", w=3.6, h=3.6, size=28, head=40, col=ORANGE),
            K.case_card(K.heat_waves(3, 0.9), "열", "불꽃 주변이\n따뜻해져요", w=3.6, h=3.6, size=28, head=40, col=RED),
            K.case_card(VGroup(K.candle(1.3, False, w=0.3), K.candle(0.7, False, w=0.3).shift(RIGHT * 0.9)), "양이 줄어요",
                        "타는 물질의 양이\n줄어들어요", w=3.6, h=3.6, size=28, head=36, col=GREEN),
        ).arrange(RIGHT, buff=0.4).move_to([0, 0.5, 0])
        self.say(f"공통점: {o('빛')}과 {r('열')}이 나고, 타는 물질의 양이 줄어요",
                 "공통으로 빛이 나서 주변이 밝아지고, 열이 나서 따뜻해져요. 그리고 타는 물질의 양이 줄어들어요.")
        self.play(FadeIn(cards, lag_ratio=0.3), run_time=1.2)
        self.settle()
        note = K.text_card([f"불꽃 색깔은 서로 달랐고, 촛농은 양초에서만 흘렀어요 → {r('공통점이 아니에요')}"], size=28).move_to([0, -2.05, 0])
        self.say("불꽃의 색깔과 촛농은 공통점이 아니에요",
                 "불꽃의 색깔은 양초와 알코올이 서로 달랐고, 촛농은 양초에서만 흘러내렸어요. 그래서 공통적인 현상이 아니에요.")
        self.play(FadeIn(note, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각+ : 빛과 열을 이용 ──
    def uses(self):
        self.section("생활 속 연소")
        from kit_s3u12 import bin_box
        lb = bin_box("주로 빛을 이용해요", 6.2, 4.4, ORANGE, 34).move_to([-3.35, 0.2, 0])
        hb = bin_box("주로 열을 이용해요", 6.2, 4.4, RED, 34).move_to([3.35, 0.2, 0])
        L_ = ["강물 위의 유등", "막대 폭죽의 불꽃", "청사초롱", "정전 때 켠 촛불"]
        H_ = ["벽난로의 장작불", "가스레인지의 불꽃", "숯불 구이", "석유난로"]
        lc = VGroup(*[K.word_card(t, w=4.6, h=0.72, size=28) for t in L_]).arrange(DOWN, buff=0.18).move_to([-3.35, -0.15, 0])
        hc = VGroup(*[K.word_card(t, w=4.6, h=0.72, size=28) for t in H_]).arrange(DOWN, buff=0.18).move_to([3.35, -0.15, 0])
        self.say(f"물질이 탈 때 나는 {o('빛')}으로 어두운 곳을 밝혀요",
                 "유등, 막대 폭죽, 청사초롱, 정전 때 켠 촛불은 빛으로 어두운 곳을 밝혀요.")
        self.play(FadeIn(lb), FadeIn(hb), FadeIn(lc, lag_ratio=0.2), run_time=1.2)
        self.settle()
        self.say(f"{r('열')}로 따뜻하게 하거나 음식을 조리해요",
                 "벽난로, 가스레인지, 숯불 구이, 석유난로는 열로 따뜻하게 하거나 음식을 조리해요.")
        self.play(FadeIn(hc, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        c = K.candle(1.8, True, w=0.4, fs=1.3).move_to([-4.6, -0.2, 0])
        a = K.alcohol_lamp(0.6, True, s=1.2).move_to([-2.4, -0.55, 0])
        card = K.text_card([f"양초와 알코올이 탈 때", f"{o('빛')}과 {r('열')}이 발생합니다."], w=6.6, size=38).move_to([3.0, 0.9, 0])
        think = K.text_card(["정전 때 촛불을 켜는 것은", f"물질이 탈 때 발생하는 {o('빛')}을 이용한 것"], w=6.6, size=30).move_to([3.0, -1.2, 0])
        self.say(f"물질이 탈 때에는 {o('빛')}과 {r('열')}이 발생해요", "양초와 알코올이 탈 때 빛과 열이 발생해요.")
        self.play(FadeIn(c), FadeIn(a), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        self.settle()
        self.say(f"정전 때 촛불은 {o('빛')}을 이용해요", "정전이 되었을 때 촛불을 켜는 것은 물질이 탈 때 발생하는 빛을 이용한 거예요.")
        self.play(FadeIn(think, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
