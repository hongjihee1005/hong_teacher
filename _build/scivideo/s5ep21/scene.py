"""「과학 원리 돋보기」 5학년 21화 — 운동할 때 몸의 변화 (5-1 4단원 우리 몸의 구조와 기능 7차시, 화 코드 5-1-4-f)

바탕: grade5/science/sem1/u4-6.html(원본 _build_tb/src/u4-6.html) — 도입(달리기 전·후: 얼굴이 빨개짐·숨이 가빠짐·땀),
운동 전·운동 직후·5분 휴식 후 체온과 1분 동안의 맥박 수(「실험관찰」 예시 값: 36.5·36.8·36.6 ℃, 65·103·68회 — 앱 DATA),
그래프로 나타내기(맥박 빨라짐·체온 올라감·쉬면 비슷해짐), 몸을 움직이기 위해 각 기관이 하는 일(산소·이산화 탄소·영양소·노폐물),
호흡이 빨라지는 까닭·심장이 빠르게 뛰는 까닭, 콧구멍 밴드, 한눈에 쏙.
최종: ./make_final.sh s5ep21
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker, always_redraw,
                   Dot, Arrow, Line, Rectangle, RoundedRectangle, GrowFromEdge, GrowArrow, LaggedStart, Circle,
                   SurroundingRectangle, linear)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


TEMP = [36.5, 36.8, 36.6]
PULSE = [65, 103, 68]
COLS = ["운동 전", "운동 직후", "5분 휴식 후"]


class S5Ep21(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 21
    EP_TITLE = "운동할 때 몸의 변화"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.measure()
        self.graph()
        self.organs()
        self.why()
        self.summary()
        self.closing(f"운동을 하면 {o('호흡')}이 빨라지고 {o('심장')}이 빠르게 뛰어요\n우리 몸의 각 기관은 {g('서로 영향을 주고받으며')} 일해요",
                     next_preview="5학년 마인드맵 4 · 우리 몸의 구조와 기능")
        self.wait(0.5)

    def acc(self, t):
        return f'<span foreground="{self.accent}">{t}</span>'

    # ── 궁금해요: 달리기 전과 후 ──
    def intro(self):
        self.section("궁금해요")
        k1 = K.kid("before", 1.25).move_to([-3.3, 0.2, 0])
        k2 = K.kid("after", 1.25).move_to([3.3, 0.2, 0])
        t1 = T("달리기를 하기 전", 34, K.NAVY).next_to(k1, UP, buff=0.3)
        t2 = T("달리기를 한 후", 34, K.NAVY).next_to(k2, UP, buff=0.3)
        ar = Arrow([-1.0, 0.2, 0], [1.0, 0.2, 0], buff=0, color=RED, stroke_width=8)
        self.say("달리기를 하기 전과 후, 친구의 모습은 어떻게 다를까요?",
                 "달리기를 하기 전과 후, 친구의 모습은 어떤 점이 다를까요? 달라진 곳 세 군데를 찾아봐요.")
        self.play(FadeIn(k1), FadeIn(t1), GrowArrow(ar), FadeIn(k2), FadeIn(t2), run_time=0.9)
        self.pause_screen(5, "달라진 곳 세 군데를 찾아봐요")
        rings = VGroup(SurroundingRectangle(k2.cheeks, color=ORANGE, buff=0.08, corner_radius=0.15, stroke_width=6),
                       SurroundingRectangle(k2.breath, color=ORANGE, buff=0.08, corner_radius=0.15, stroke_width=6),
                       SurroundingRectangle(k2.sweat, color=ORANGE, buff=0.08, corner_radius=0.15, stroke_width=6))
        found = VGroup(*[K.label(s, ORANGE, 30) for s in ("얼굴이 빨개졌어요", "숨이 가빠졌어요", "땀이 났어요")]).arrange(RIGHT, buff=0.3).move_to([0, -2.25, 0])
        self.say(f"{o('얼굴이 빨개지고')}, {o('숨이 가빠지고')}, {o('땀')}이 났어요",
                 "얼굴이 빨개지고, 숨이 가빠지고, 땀이 났어요. 운동을 하면 우리 몸속에서는 어떤 일이 일어날까요?")
        self.play(LaggedStart(*[Create(x) for x in rings], lag_ratio=0.4), FadeIn(found, lag_ratio=0.3), run_time=1.6)
        self.settle()
        clear_stage(self)

    # ── 측정해요 ──
    def table(self):
        cw = [3.6, 2.4, 2.4, 2.4]
        rh = 0.82
        x0 = -sum(cw) / 2
        rows = [["구분"] + COLS, ["체온(℃)", "", "", ""], ["1분 동안의 맥박 수(회)", "", "", ""]]
        grp = VGroup()
        cells = {}
        for i, row in enumerate(rows):
            x = x0
            for j, txt in enumerate(row):
                fill = "#EFE6D2" if i == 0 or j == 0 else PAPER
                rc = Rectangle(width=cw[j], height=rh, fill_color=fill, fill_opacity=1, stroke_color=SOFT, stroke_width=3)
                rc.move_to([x + cw[j] / 2, -i * rh, 0])
                grp.add(rc)
                cells[(i, j)] = rc
                if txt:
                    t = T(txt, 28 if j == 0 and i == 2 else 30)
                    if t.width > cw[j] - 0.2:
                        t.scale_to_fit_width(cw[j] - 0.2)
                    t.move_to(rc)
                    grp.add(t)
                x += cw[j]
        grp.cells = cells
        return grp

    def measure(self):
        self.section("측정해요")
        tb = self.table().move_to([0, 1.15, 0])
        note = M(f"{o('맥박')}: 심장의 박동이 목이나 팔목 등에서 느껴지는 것", 30).move_to([0.9, 2.75, 0])
        self.say("운동 전과 후에 체온과 1분 동안의 맥박 수를 재요",
                 "운동하기 전과 운동한 후에 체온과 1분 동안의 맥박 수를 재어 봐요. 맥박은 심장의 박동이 목이나 팔목 등에서 느껴지는 것이에요.")
        self.play(FadeIn(note), FadeIn(tb), run_time=0.8)
        steps = VGroup(*[K.label(s, self.accent, 28) for s in ("① 운동 전 측정", "② 제자리 뛰기", "③ 운동 직후 측정", "④ 5분 쉰 뒤 측정")]
                       ).arrange(RIGHT, buff=0.25).move_to([0, -0.9, 0])
        self.play(FadeIn(steps, lag_ratio=0.2), run_time=0.8)
        vals = {}
        for j in range(3):
            c1 = tb.cells[(1, j + 1)]
            c2 = tb.cells[(2, j + 1)]
            vals[j] = VGroup(T(f"{TEMP[j]}", 34, ORANGE).move_to(c1), T(f"{PULSE[j]}", 34, RED).move_to(c2))
        self.say(f"운동 전: 체온 {o('36.5 ℃')}, 맥박 수 {o('65회')}",
                 "운동 전에는 체온이 36.5도, 1분 동안의 맥박 수가 65회예요.")
        self.play(Indicate(steps[0]), FadeIn(vals[0]), run_time=0.8)
        self.say("제자리 뛰기를 한 뒤, 바로 재면 어떻게 될까요?",
                 "이제 제자리 뛰기를 해요. 운동을 마치고 바로 재면 체온과 맥박 수는 어떻게 될까요?")
        self.play(Indicate(steps[1]), run_time=0.6)
        self.settle()
        self.pause_screen(5, "체온과 맥박 수는 어떻게 될까요?")
        self.say(f"운동 직후: 체온 {o('36.8 ℃')}, 맥박 수 {r('103회')}",
                 "운동 직후에는 체온이 36.8도, 맥박 수가 103회로 늘었어요.")
        self.play(Indicate(steps[2]), FadeIn(vals[1]), run_time=0.8)
        self.say(f"5분 쉰 뒤: 체온 {o('36.6 ℃')}, 맥박 수 {o('68회')}",
                 "5분 동안 쉰 뒤에는 체온이 36.6도, 맥박 수가 68회예요.")
        self.play(Indicate(steps[3]), FadeIn(vals[2]), run_time=0.8)
        cav = M("※ 「실험관찰」의 예시 값이에요. 실제 값은 사람마다 달라요.", 26, SOFT).move_to([0, -1.75, 0])
        self.play(FadeIn(cav), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 그래프 ──
    def graph(self):
        self.section("그래프로 나타내요")
        ox, oy = -5.7, -2.0
        W, H = 6.9, 4.3
        ax = VGroup(Line([ox, oy, 0], [ox + W, oy, 0], stroke_color=INK, stroke_width=4),
                    Line([ox, oy, 0], [ox, oy + H, 0], stroke_color=RED, stroke_width=4),
                    Line([ox + W, oy, 0], [ox + W, oy + H, 0], stroke_color=ORANGE, stroke_width=4))
        ticks = VGroup()
        for v in (0, 40, 80, 120):
            y = oy + v / 120 * H
            ticks.add(Line([ox - 0.1, y, 0], [ox, y, 0], stroke_color=RED, stroke_width=3), T(str(v), 24, RED).move_to([ox - 0.45, y, 0]))
            if v:
                ticks.add(Line([ox, y, 0], [ox + W, y, 0], stroke_color=SOFT, stroke_width=1.5, stroke_opacity=0.5))
        for tv in (36.0, 36.5, 37.0):
            y = oy + (tv - 36.0) / 1.0 * H
            ticks.add(Line([ox + W, y, 0], [ox + W + 0.1, y, 0], stroke_color=ORANGE, stroke_width=3), T(f"{tv}", 24, ORANGE).move_to([ox + W + 0.5, y, 0]))
        yl = T("맥박 수(회)", 26, RED).move_to([ox + 0.3, oy + H + 0.3, 0])
        yr = T("체온(℃)", 26, ORANGE).move_to([ox + W - 0.1, oy + H + 0.3, 0])
        xs = [ox + W * (k + 0.5) / 3 for k in range(3)]
        xl = VGroup(*[T(c, 28).move_to([x, oy - 0.35, 0]) for x, c in zip(xs, COLS)])
        bars = VGroup(*[Rectangle(width=1.1, height=PULSE[k] / 120 * H, fill_color="#F08A8A", fill_opacity=0.9, stroke_color=RED,
                                  stroke_width=3).move_to([xs[k], oy + PULSE[k] / 120 * H / 2, 0]) for k in range(3)])
        bnum = VGroup(*[T(str(PULSE[k]), 26, RED).next_to(bars[k], UP, buff=0.08).shift(LEFT * 0.3) for k in range(3)])
        pts = [np.array([xs[k], oy + (TEMP[k] - 36.0) * H, 0]) for k in range(3)]
        line = VGroup(Line(pts[0], pts[1], stroke_color=ORANGE, stroke_width=6), Line(pts[1], pts[2], stroke_color=ORANGE, stroke_width=6))
        dots = VGroup(*[Dot(p, radius=0.11, color=ORANGE).set_stroke(PAPER, 3) for p in pts])
        tnum = VGroup(*[T(str(TEMP[k]), 24, ORANGE).next_to(pts[k], RIGHT, buff=0.12).shift(DOWN * 0.28) for k in range(3)])
        self.say("측정 결과를 그래프로 나타내요. 막대는 맥박 수, 선은 체온이에요",
                 "측정 결과를 그래프로 나타내 봐요. 막대는 맥박 수, 점과 선은 체온이에요.")
        self.play(Create(ax), FadeIn(ticks), FadeIn(yl), FadeIn(yr), FadeIn(xl), run_time=0.8)
        self.play(LaggedStart(*[GrowFromEdge(b_, DOWN) for b_ in bars], lag_ratio=0.3), FadeIn(bnum), run_time=1.2)
        self.play(FadeIn(dots), Create(line), FadeIn(tnum), run_time=1.0)
        card = K.text_card([f"운동할 때 {r('맥박')}이 빨라져요", f"운동할 때 {o('체온')}이 올라가요", f"쉬고 나면 운동 전과 {g('비슷해져요')}"],
                           w=4.5, size=30).move_to([4.6, 0.3, 0])
        self.say(f"운동하면 {r('맥박이 빨라지고')} {o('체온이 올라가요')}",
                 "그래프를 보면 운동할 때 맥박이 빨라지고 체온이 올라가요.")
        self.play(FadeIn(card[0]), FadeIn(card[1][0]), FadeIn(card[1][1]), Indicate(bars[1]), Indicate(dots[1]), run_time=0.9)
        self.say(f"쉬고 나면 다시 운동 전과 {g('비슷해져요')}",
                 "그리고 쉬고 나면 다시 운동 전과 비슷해져요.")
        self.play(FadeIn(card[1][2]), Indicate(bars[2]), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 각 기관이 하는 일 ──
    def organs(self):
        self.section("함께 일하는 기관")
        mp = K.organ_map(9.0).move_to([0, 0.2, 0])
        self.say("몸을 움직이기 위해 각 기관은 어떤 일을 할까요?",
                 "몸을 움직이기 위해 우리 몸의 각 기관은 어떤 일을 할까요?")
        self.play(FadeIn(VGroup(*mp.box.values()), lag_ratio=0.15), run_time=1.2)
        steps = [
            ([], 'bone', f"{o('뼈와 근육')}: 산소와 영양소를 이용해 몸을 움직여요",
             "뼈와 근육은 산소와 영양소를 이용해 몸을 움직여요."),
            ([2], 'dig', f"{o('소화기관')}: 음식물을 소화해 {o('영양소')}를 흡수해요",
             "소화기관은 음식물을 소화해 영양소를 흡수해요."),
            ([0, 1], 'resp', f"{o('호흡기관')}: {o('산소')}를 받아들이고, 이산화 탄소를 내보내요",
             "호흡기관은 산소를 받아들이고, 이산화 탄소를 몸 밖으로 내보내요."),
            ([3], 'circ', f"{o('순환기관')}: 산소와 영양소를 온몸에 운반해요",
             "순환기관은 산소와 영양소를 온몸에 운반하고, 이산화 탄소는 호흡기관으로, 노폐물은 배설기관으로 운반해요."),
            ([4], 'exc', f"{o('배설기관')}: 혈액 속의 {o('노폐물')}을 걸러 내보내요",
             "배설기관은 혈액 속의 노폐물을 걸러 내어 몸 밖으로 내보내요."),
        ]
        for arrs, key, sub, narr in steps:
            self.say(sub, narr)
            anims = [Indicate(mp.box[key], scale_factor=1.06, color=ORANGE)]
            for i in arrs:
                anims += [GrowArrow(mp.arr[i][0]), FadeIn(mp.arr[i][1])]
            self.play(*anims, run_time=0.9)
        self.say(f"우리 몸의 각 기관은 {g('서로 영향을 주고받으며')} 일해요",
                 "이처럼 우리 몸의 각 기관은 서로 영향을 주고받으며 작용해요.")
        self.settle()
        clear_stage(self)

    # ── 왜 그럴까요? ──
    def why(self):
        self.section("왜 그럴까요?")
        q1 = K.text_card(["운동을 하면 호흡이 빨라지는 까닭은?"], w=8.4, size=36).move_to([0, 2.2, 0])
        self.say("운동을 하면 왜 호흡이 빨라질까요?", "운동을 하면 호흡이 빨라지는 까닭은 무엇일까요?")
        self.play(FadeIn(q1), run_time=0.5)
        self.pause_screen(4, "호흡기관이 하는 일을 떠올려 봐요")
        a1 = M(f"뼈와 근육이 많이 움직이려면 {o('산소')}가 많이 필요해요 → 산소를 많이 흡수", 32).move_to([0, 1.25, 0])
        self.say(f"{o('산소')}를 많이 흡수하기 위해서예요",
                 "뼈와 근육이 많이 움직이려면 산소가 많이 필요해요. 그래서 산소를 많이 흡수하기 위해 호흡이 빨라져요.")
        self.play(FadeIn(a1), run_time=0.6)
        q2 = K.text_card(["운동을 하면 심장이 빠르게 뛰는 까닭은?"], w=8.4, size=36).move_to([0, 0.05, 0])
        a2 = M(f"{o('산소')}와 {o('영양소')}를 온몸에 빠르게 운반하기 위해서예요", 32).move_to([0, -0.9, 0])
        self.say(f"산소와 영양소를 온몸에 {o('빠르게 운반')}하기 위해서예요",
                 "운동을 하면 심장이 빠르게 뛰는 까닭은, 순환기관이 산소와 영양소를 온몸에 빠르게 운반하기 위해서예요.")
        self.play(FadeIn(q2), FadeIn(a2), run_time=0.7)
        a3 = K.text_card([f"운동을 하면 체온이 {o('올라가고')} 땀이 나기도 해요.",
                          f"콧구멍을 넓혀 주는 밴드: 공기가 잘 드나들어 {g('호흡하기 쉬워져요')}"], w=11.6, size=32).move_to([0, -2.0, 0])
        self.say(f"체온이 올라가 땀이 나기도 하고, 콧구멍 밴드는 {g('호흡')}을 도와요",
                 "운동을 하면 체온이 올라가고 땀이 나기도 해요. 운동할 때 콧구멍을 넓혀 주는 밴드를 붙이면 공기가 잘 드나들어 호흡하기 쉬워져요.")
        self.play(FadeIn(a3), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"운동을 하면 산소를 많이 흡수하기 위해 {o('호흡')}이 빨라지고,",
                            f"산소와 영양소를 온몸에 빠르게 운반하기 위해",
                            f"{o('심장')}이 빠르게 뜁니다.",
                            f"우리 몸의 각 기관은 {g('서로 영향을 주고받으며')} 작용해요."], w=12.4, size=40).move_to([0, 0.4, 0])
        self.say(f"운동을 하면 {o('호흡')}이 빨라지고 {o('심장')}이 빠르게 뛰어요",
                 "운동을 하면 산소를 많이 흡수하기 위해 호흡이 빨라지고, 산소와 영양소를 온몸에 빠르게 운반하기 위해 심장이 빠르게 뛰어요. 우리 몸의 각 기관은 서로 영향을 주고받으며 작용해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
