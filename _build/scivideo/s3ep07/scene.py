"""「과학 원리 돋보기」 3학년 7화 — 물에 사는 동물과 물갈퀴 (3-1 2단원 동물의 생활 5차시, 화 코드 3-1-2-c)

바탕: grade3/science/sem1/u2-3.html — 도입(붕어: 지느러미·부드러운 곡선 모양 몸), 가상 실험실
(물이 담긴 원형 수조·페트병 뚜껑·부챗살·넓은 셀로판테이프·가위, ㈎ 부챗살 → 조금 출렁 / ㈏ 물갈퀴처럼 만든 부챗살 → 많이 출렁·뚜껑이 더 많이 움직임,
손에 힘이 더 느껴짐), 결과 정리(물을 더 많이 밀어 내 빠르게), 개구리·오리·수달·바다거북, 동물 조사(DEX), 이동 방법 분류,
한눈에 쏙(개구리·수달 물갈퀴), 생각+(고등어·돌고래), 형성 평가 1(수달).
뚜껑이 움직인 칸 수는 앱에서 젓기마다 조금씩 달라(㈎ 1.5~2.5칸, ㈏ 5~7칸) 영상에서는 수를 말하지 않고 움직임만 보여 줌.
최종: ./make_final.sh s3ep07
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, Create, Ellipse, FadeIn, FadeOut, Indicate, Line, Rectangle,
                   RoundedRectangle, VGroup, Rotate, AnimationGroup, Succession)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, BROWN_DARK, clear_stage
import kit_s3u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


X0, UNIT = -0.6, 0.66      # 눈금 0의 자리, 한 칸
SURF = 0.55                # 물 위
PIV = np.array([-3.3, 2.35, 0.0])   # 부챗살 축


def fan(webbed):
    angs = [-0.5, -0.25, 0.0, 0.25, 0.5]
    g_ = VGroup()
    ends = []
    for a in angs:
        d = np.array([np.sin(a), -np.cos(a), 0])
        ends.append((PIV + d * 0.9, PIV + d * 3.0))
    webs = VGroup()
    for i in range(4):
        a1, b1 = ends[i]
        a2, b2 = ends[i + 1]
        webs.add(K.poly([a1[:2], b1[:2], b2[:2], a2[:2]], "#F3E6A0", op=0.95, sw=2))
    ribs = VGroup(*[Line(PIV, e[1], stroke_color=BROWN_DARK, stroke_width=7) for e in ends])
    knob = K.C(0.14, BROWN_DARK, PIV[0], PIV[1], sw=2)
    g_.add(webs, ribs, knob)
    g_.webs = webs
    if not webbed:
        webs.set_opacity(0)
    return g_


class S3Ep07(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 7
    EP_TITLE = "물에 사는 동물과 물갈퀴"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.result()
        self.survey()
        self.summary()
        self.check()
        self.closing(f"물갈퀴가 있는 발은 물을 {o('더 많이 밀어 내')}\n물속에서 {g('빠르게')} 움직일 수 있어요",
                     next_preview="3학년 8화 · 극지방과 사막에 사는 동물")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        water = Rectangle(width=14.4, height=4.6, fill_color=K.WATER, fill_opacity=0.55, stroke_width=0).move_to([0, 0.2, 0])
        fish = K.fit(K.fish(K.GOLD, 2.0), 3.6, 2.0).move_to([4.5, 0.3, 0])
        self.say("물고기는 어떻게 물속에서 빠르게 움직일까요?", "물고기는 어떻게 물속에서 빠르게 움직일 수 있을까요?")
        self.play(FadeIn(water), run_time=0.4)
        self.play(FadeIn(fish), fish.animate.move_to([-4.3, 0.3, 0]), run_time=1.6)
        self.pause_screen(5, "물고기가 빠르게 움직이는 까닭은?")
        t1 = M(f"몸에 {o('지느러미')}가 있어요", 44).move_to([-0.8, 1.4, 0], aligned_edge=LEFT)
        t2 = M(f"몸이 {o('부드러운 곡선 모양')}이에요", 44).move_to([-0.8, -0.8, 0], aligned_edge=LEFT)
        self.say(f"몸에 {o('지느러미')}가 있어서요", "몸에 지느러미가 있어서요.")
        self.play(FadeIn(t1), Indicate(fish[2:4], color=RED, scale_factor=1.4), run_time=1.0)
        self.say(f"몸이 {o('부드러운 곡선 모양')}이라서요", "그리고 몸이 부드러운 곡선 모양이라서 물속에서 헤엄을 잘 쳐요.")
        self.play(FadeIn(t2), Circumscribe(fish[1], color=RED), run_time=1.0)
        self.say("그럼 물갈퀴가 있는 발은 어떤 점이 좋을까요?", "그럼 개구리나 오리처럼 발에 물갈퀴가 있으면 어떤 점이 좋을까요? 실험으로 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def experiment(self):
        self.section("실험해요")
        water = Rectangle(width=11.8, height=SURF + 2.0, fill_color=K.WATER, fill_opacity=0.7, stroke_width=0).move_to([0.3, (SURF - 2.0) / 2, 0])
        tank = VGroup(Line([-5.6, SURF + 0.5, 0], [-5.6, -2.0, 0]), Line([-5.6, -2.0, 0], [6.2, -2.0, 0]),
                      Line([6.2, -2.0, 0], [6.2, SURF + 0.5, 0])).set_stroke(INK, 5)
        ticks = VGroup()
        for i in range(11):
            x = X0 + i * UNIT
            ticks.add(Line([x, -1.75, 0], [x, -1.55 if i % 5 else -1.45, 0], stroke_color=INK, stroke_width=3))
            if i % 2 == 0:
                ticks.add(T(str(i), 24, INK).move_to([x, -1.2, 0]))
        ticks.add(Line([X0, -1.75, 0], [X0 + 10 * UNIT, -1.75, 0], stroke_color=INK, stroke_width=3))
        cap = VGroup(Rectangle(width=0.5, height=0.22, fill_color=RED, fill_opacity=1, stroke_color=INK, stroke_width=3)).move_to([X0, SURF + 0.06, 0])
        self.say("물이 담긴 수조에 페트병 뚜껑을 띄워요", "물이 담긴 수조에 페트병 뚜껑을 띄워요. 수조 속 눈금으로 뚜껑이 움직인 거리를 읽어요.")
        self.play(FadeIn(water), Create(tank), FadeIn(ticks), run_time=0.8)
        self.play(FadeIn(cap, shift=DOWN * 0.6), run_time=0.6)
        self.water, self.cap = water, cap
        f = fan(False)
        self.say(f"㈎ {o('부챗살')}을 펼쳐 물속에서 저어요", "가 실험이에요. 부챗살을 펼친 뒤 물속에서 저으면서 뚜껑을 움직여요. 부챗살 사이에는 빈틈이 있어요.")
        self.play(FadeIn(f), run_time=0.6)
        la = T("㈎ 부챗살", 38, INK).move_to([1.5, 2.45, 0])
        self.play(FadeIn(la), run_time=0.3)
        self.stir(f, 2.0, small=True)
        self.say(f"물이 {o('조금')} 출렁이고 뚜껑이 {o('조금')} 움직여요", "물이 조금 출렁거리고, 뚜껑이 조금 움직였어요.")
        mark_a = Line([X0 + 2.0 * UNIT, -0.95, 0], [X0 + 2.0 * UNIT, -0.55, 0], stroke_color=ORANGE, stroke_width=8)
        ta = T("㈎", 30, ORANGE).next_to(mark_a, UP, buff=0.05)
        self.play(Create(mark_a), FadeIn(ta), run_time=0.4)
        self.settle()
        # 테이프 붙이기
        self.play(self.cap.animate.move_to([X0, SURF + 0.06, 0]), run_time=0.5)
        f2 = fan(True)
        self.say(f"㈏ 부챗살에 테이프를 붙여 {o('물갈퀴')}처럼 만들어요",
                 "나 실험이에요. 가위로 넓은 셀로판테이프를 잘라 부챗살 사이의 빈틈에 붙여, 개구리 발의 물갈퀴처럼 만들어요.")
        lb = T("㈏ 물갈퀴처럼 만든 부챗살", 38, INK).move_to([1.5, 2.45, 0])
        self.play(FadeOut(la), FadeIn(lb), run_time=0.3)
        self.remove(f)
        self.add(f2)
        f2.webs.set_opacity(0)
        for w in f2.webs:
            self.play(w.animate.set_fill(opacity=0.95).set_stroke(opacity=1), run_time=0.35)
        self.say("같은 힘으로 저으면 어떻게 될까요?", "이제 물갈퀴처럼 만든 부챗살로 같은 힘으로 저으면 어떻게 될까요?")
        self.pause_screen(5, "뚜껑이 더 많이 움직이는 것은 ㈎? ㈏?")
        self.stir(f2, 6.0, small=False)
        self.say(f"물이 {o('많이')} 출렁이고 뚜껑이 {g('훨씬 많이')} 움직여요",
                 "물이 더 많이 출렁거리고, 뚜껑이 훨씬 많이 움직였어요. 손에도 힘이 더 느껴져요.")
        mark_b = Line([X0 + 6.0 * UNIT, -0.95, 0], [X0 + 6.0 * UNIT, -0.55, 0], stroke_color=GREEN, stroke_width=8)
        tb = T("㈏", 30, GREEN).next_to(mark_b, UP, buff=0.05)
        self.play(Create(mark_b), FadeIn(tb), run_time=0.4)
        self.say(f"너무 세게 저으면 {r('물이 튀어요')} — 튄 물은 닦아요",
                 "너무 세게 저으면 물이 밖으로 튀어 바닥이 미끄러워질 수 있어요. 주변에 튄 물은 닦아요.")
        self.settle()
        clear_stage(self)

    def stir(self, f, dist, small):
        cap = self.cap
        self.play(Rotate(f, angle=-0.35, about_point=PIV), run_time=0.4)
        n = 2 if small else 5
        rings = VGroup(*[Ellipse(width=(0.6 + 0.5 * i) * (1 if small else 1.6), height=(0.2 + 0.12 * i) * (1 if small else 1.6),
                                 stroke_color=K.WATER_D, stroke_width=4 if small else 6).move_to([PIV[0], SURF, 0]) for i in range(n)])
        self.play(Rotate(f, angle=0.7, about_point=PIV), FadeIn(rings, lag_ratio=0.2),
                  cap.animate.move_to([X0 + dist * UNIT, SURF + 0.06, 0]), run_time=1.6)
        self.play(Rotate(f, angle=-0.35, about_point=PIV), FadeOut(rings), run_time=0.5)

    # ── 결과 ──
    def result(self):
        self.section("정리해요")
        rows = VGroup(
            VGroup(T("", 10), T("물의 출렁임", 34, SOFT), T("뚜껑", 34, SOFT)),
            VGroup(T("㈎ 부챗살", 38), T("조금 출렁여요", 38), T("조금 움직여요", 38)),
            VGroup(T("㈏ 물갈퀴 부챗살", 38), M(o("많이 출렁여요"), 38), M(g("더 많이 움직여요"), 38)),
        )
        xs = [-4.2, 0.4, 4.3]
        for i, row in enumerate(rows):
            for j, c in enumerate(row):
                c.move_to([xs[j], 2.2 - i * 0.85, 0])
        lines = VGroup(Line([-6.6, 1.78, 0], [6.6, 1.78, 0], stroke_color=SOFT, stroke_width=3))
        self.say("실험 결과를 정리해요", "실험 결과를 정리해 볼게요.")
        self.play(FadeIn(lines), FadeIn(rows, lag_ratio=0.2), run_time=1.0)
        c = K.text_card([f"발에 {o('물갈퀴')}가 있으면 물을 {o('더 많이 밀어 내')}",
                         f"물속에서 {g('빠르게')} 움직일 수 있어요"], size=42).move_to([0, -0.3, 0])
        self.say(f"물갈퀴가 있으면 물을 {o('더 많이 밀어 내')} {g('빠르게')} 움직여요",
                 "발에 물갈퀴가 있으면 물을 더 많이 밀어 내서 물속에서 빠르게 움직일 수 있어요.")
        self.play(FadeIn(c, shift=UP * 0.2), run_time=0.7)
        self.settle()
        self.play(FadeOut(VGroup(rows, lines, c)), run_time=0.5)
        names = ["개구리", "오리", "수달", "바다거북"]
        cs = VGroup(*[K.card(n, 2.6, 2.3, 34) for n in names]).arrange(RIGHT, buff=0.4).move_to([0, 0.5, 0])
        self.say("개구리·오리·수달·바다거북도 발로 헤엄쳐요",
                 "개구리, 오리, 수달, 바다거북처럼 물갈퀴나 지느러미 모양의 발로 헤엄치는 동물이 있어요. 실험처럼, 물갈퀴가 있는 발은 물을 더 많이 밀어 내요.")
        self.play(FadeIn(cs, lag_ratio=0.15), run_time=1.0)
        self.play(Indicate(cs[0], color=GREEN), Indicate(cs[1], color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 조사 ──
    def survey(self):
        self.section("조사해요")
        self.say("강·호수와 갯벌·바다에 사는 동물을 조사해요", "강이나 호수, 갯벌, 바다에 사는 동물을 조사해 볼까요?")
        river = ["붕어", "수달", "물방개", "다슬기"]
        sea = ["농게", "돌고래", "조개", "따개비"]
        hr = T("강이나 호수", 36, BLUE).move_to([-3.6, 2.6, 0])
        hs = T("갯벌과 바다", 36, BLUE).move_to([3.4, 2.6, 0])
        notes = {
            "붕어": "지느러미로 헤엄쳐요", "수달": "물갈퀴 발로 헤엄쳐요", "물방개": "다리로 헤엄쳐요", "다슬기": "바닥을 기어다녀요",
            "농게": "다리로 걸어 다녀요", "돌고래": "지느러미로 헤엄쳐요", "조개": "갯벌을 기어다녀요", "따개비": "바위에 붙어 살아요"}
        rowr = VGroup(*[K.card(n, 1.55, 1.45, 28) for n in river]).arrange(RIGHT, buff=0.15).move_to([-3.6, 1.4, 0])
        rows_ = VGroup(*[K.card(n, 1.55, 1.45, 28) for n in sea]).arrange(RIGHT, buff=0.15).move_to([3.55, 1.4, 0])
        div = Line([-0.05, 2.8, 0], [-0.05, -2.2, 0], stroke_color=SOFT, stroke_width=3)
        self.play(FadeIn(hr), FadeIn(hs), Create(div), FadeIn(rowr, lag_ratio=0.1), FadeIn(rows_, lag_ratio=0.1), run_time=1.0)
        info_r = VGroup(*[M(f"{n} — {o(notes[n])}", 30) for n in river]).arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([-3.6, -0.75, 0])
        info_s = VGroup(*[M(f"{n} — {o(notes[n])}", 30) for n in sea]).arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([3.55, -0.75, 0])
        self.say(f"붕어는 {o('지느러미')}, 수달은 {o('물갈퀴 발')}로 헤엄쳐요",
                 "강이나 호수에서 붕어는 지느러미로 헤엄치고, 수달은 땅과 물을 오가며 물속에서는 물갈퀴가 있는 발로 헤엄쳐요.")
        self.play(FadeIn(info_r[:2], lag_ratio=0.3), run_time=0.8)
        self.say(f"물방개는 {o('다리')}로 헤엄치고, 다슬기는 {o('기어다녀요')}",
                 "물방개는 뒷다리에 잔털이 많아 다리로 헤엄치고, 다슬기는 바닥이나 바위를 기어다녀요.")
        self.play(FadeIn(info_r[2:], lag_ratio=0.3), run_time=0.8)
        self.say(f"농게는 {o('걷고')}, 돌고래는 {o('헤엄치고')}, 조개는 {o('기어다니고')}, 따개비는 {o('붙어')} 살아요",
                 "갯벌의 농게는 다리로 걸어 다니고, 바다의 돌고래는 지느러미로 헤엄쳐요. 조개는 갯벌을 기어다니고, 따개비는 바위에 붙어서 살아요.")
        self.play(FadeIn(info_s, lag_ratio=0.3), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        c = K.text_card([f"물에 사는 동물은 {o('지느러미')}, {o('물갈퀴가 있는 발')}, {o('다리')}로 헤엄치는 등",
                         f"{g('물에서 살기에 알맞은')} 생김새와 생활 방식을 가지고 있어요"], size=40).move_to([0, 1.5, 0])
        self.say(f"물에 사는 동물은 {g('물에서 살기에 알맞은')} 생김새를 가졌어요",
                 "물에 사는 동물은 지느러미, 물갈퀴가 있는 발, 다리로 헤엄쳐 다니는 등 물에서 살기에 알맞은 생김새와 생활 방식을 가지고 있어요.")
        self.play(FadeIn(c, shift=UP * 0.2), run_time=0.7)
        fr = K.fit(K.webbed_foot(True, K.LEAF), 1.4, 1.5).move_to([-4.6, -1.0, 0])
        ft = M(f"개구리, 수달 → {o('물갈퀴')}가 있는 발", 36).next_to(fr, RIGHT, buff=0.3)
        self.say(f"개구리·수달은 {o('물갈퀴')}가 있는 발로 헤엄쳐요", "개구리와 수달은 물갈퀴가 있는 발로 물속을 헤엄쳐 다녀요.")
        self.play(FadeIn(fr), FadeIn(ft), run_time=0.6)
        self.settle()
        self.play(FadeOut(VGroup(fr, ft)), run_time=0.3)
        d = K.fit(K.dolphin(), 2.6, 1.3).move_to([-4.6, -1.0, 0])
        dt = M(f"고등어, 돌고래 → {o('곡선 모양 몸')} + {o('지느러미')}", 36).next_to(d, RIGHT, buff=0.3)
        self.say(f"고등어·돌고래는 {o('곡선 모양 몸')}과 {o('지느러미')}가 있어요",
                 "고등어와 돌고래는 몸이 부드러운 곡선 모양이고 지느러미가 있어 바닷속에서 살기에 알맞아요.")
        self.play(FadeIn(d), FadeIn(dt), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        q = K.text_card(["땅과 물을 오가며 살고, 물속에서는", f"{o('물갈퀴가 있는 발')}로 헤엄쳐 다니는 동물은?"], size=40).move_to([0, 1.7, 0])
        self.say("땅과 물을 오가며, 물갈퀴 발로 헤엄치는 동물은?",
                 "땅과 물을 오가며 살고, 물속에서는 물갈퀴가 있는 발로 헤엄쳐 다니는 동물은 어느 것일까요?")
        self.play(FadeIn(q), run_time=0.5)
        opts = ["① 붕어", "② 상어", "③ 수달", "④ 다슬기", "⑤ 돌고래"]
        ts = VGroup(*[T(s, 42) for s in opts]).arrange(RIGHT, buff=0.6).move_to([0, -0.3, 0])
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=0.8)
        self.pause_screen(5, "어느 동물일까요?")
        self.play(Circumscribe(ts[2], color=GREEN), ts[2].animate.set_color(GREEN), run_time=1.0)
        ot = K.fit(K.otter(), 2.6, 1.0).move_to([0, -1.6, 0])
        self.say(f"정답은 ③ {g('수달')}이에요", "정답은 3번 수달이에요.")
        self.play(FadeIn(ot), run_time=0.5)
        self.settle()
        clear_stage(self)
