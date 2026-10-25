"""「과학 원리 돋보기」 3학년 23화 — 고체·액체·기체는 어떻게 다를까? (3-2 1단원 물질의 성질 5~6차시, 화 코드 3-2-1-d)

바탕: grade3/science/sem2/u1-4.html — 도입(레몬차 주전자를 찻잔에 따르기: 레몬 껍질 고체·찻물 액체·공기 기체),
가상 실험실 1(나무·플라스틱 막대, 물·주스를 모양이 다른 용기 ㉮㉯㉰에 옮기기, 처음 높이 표시 → 다시 ㉮로: 높이 같음),
모래는 고체(알갱이마다 모양이 정해져 있음), 가상 실험실 2(바닥에 구멍 뚫린 컵 + 압축 물휴지를 뒤집어 물속에:
① 구멍을 막은 컵 → 물휴지 그대로·수조 물 높이 조금 높아짐 ② 막지 않은 컵 → 공기가 구멍으로 빠져나가 물휴지가 젖어 커짐·물 높이 거의 그대로),
기체 이용(풍선·자전거 타이어·공기 포장재), 성질 비교표(기체의 부피 칸은 '4학년 때 더 배워요'), 한눈에 쏙, 형성 평가.
최종: ./make_final.sh s3ep23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, RoundedRectangle,
                   Rectangle, Circle, DashedLine, ValueTracker, always_redraw, Transform, Arrow, Polygon, Dot)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u21 as K
import kit_s3u12 as K12


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


S_COL = {"고체": "#B9834E", "액체": "#2F7FC1", "기체": "#7A4FB0"}


def st_tag(s, size=34):
    t = T(s, size, PAPER)
    bx = RoundedRectangle(corner_radius=0.15, width=t.width + 0.4, height=t.height + 0.26, fill_color=S_COL[s],
                          fill_opacity=1, stroke_width=0)
    t.move_to(bx)
    return VGroup(bx, t)


class S3Ep23(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 23
    EP_TITLE = "고체·액체·기체는 어떻게 다를까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.tea()
        self.vessels()
        self.sand()
        self.cups()
        self.uses()
        self.table()
        self.closing(f"{o('고체')}는 모양·부피가 그대로, {b_('액체')}는 모양만 바뀌고,\n"
                     f"{g('기체')}는 공간을 차지하고 이동할 수 있어요",
                     next_preview="3학년 마인드맵 5 · 물질의 성질")
        self.wait(0.5)

    # ── 궁금해요: 레몬차 ──
    def tea(self):
        self.section("궁금해요")
        pot = K.fit(K.glass_teapot(0.1), 3.4, 2.8).move_to([-2.6, 0.9, 0])
        cup_o = VMob_cup().move_to([2.6, -1.0, 0])
        self.say("레몬차를 찻잔에 부으면 주전자 안의 물질은?", "레몬차를 찻잔에 부으면 주전자 안의 물질은 어떻게 될까요?")
        self.play(FadeIn(pot), FadeIn(cup_o), run_time=0.7)
        tip = pot.get_right() + UP * 0.6 + LEFT * 0.1
        stream = K.smooth([tuple(tip[:2]), (tip[0] + 0.9, tip[1] - 0.2), (2.6, -0.4)], K.TEA, 10)
        liq = Rectangle(width=1.1, height=0.02, fill_color=K.TEA, fill_opacity=0.85, stroke_width=0).move_to(cup_o.get_bottom() + UP * 0.08)
        self.add(liq)
        self.bring_to_front(cup_o)
        # 주전자 안 찻물 높이를 낮춤(같은 비율로 맞춰 넣기)
        nt = K.fit(K.glass_teapot(-0.45), 3.4, 2.8).move_to(pot.get_center())
        self.say(f"{b_('찻물')}은 흘러나와 찻잔에 담겨요", "찻물은 주전자 입구를 통해 흘러나와 찻잔에 담겼어요.")
        self.play(Create(stream), run_time=0.5)
        self.play(Transform(pot.tea, nt.tea), liq.animate.stretch_to_fit_height(1.0, about_edge=DOWN), run_time=1.6)
        self.play(FadeOut(stream), run_time=0.3)
        t1 = VGroup(T("레몬 껍질", 32), st_tag("고체", 30)).arrange(RIGHT, buff=0.2).move_to([-2.6, -1.25, 0])
        t2 = VGroup(T("찻물", 32), st_tag("액체", 30)).arrange(RIGHT, buff=0.2).next_to(cup_o, UP, buff=0.35)
        t3 = VGroup(T("빈 곳의 공기", 32), st_tag("기체", 30)).arrange(RIGHT, buff=0.2).move_to([0.9, 2.2, 0])
        self.say(f"레몬 껍질은 {o('고체')}, 빈 곳에는 {g('공기')}가 있어요",
                 "레몬 껍질은 고체라서 주전자 안에 남았어요. 찻물은 액체, 주전자 안의 빈 곳에는 기체인 공기가 있어요.")
        self.play(FadeIn(t1), run_time=0.4)
        self.play(FadeIn(t2), run_time=0.4)
        self.play(FadeIn(t3), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 실험 1: 여러 모양의 용기 ──
    def vessels(self):
        self.section("실험해요")
        V = K.three_vessels(xs=(-4.4, 0.0, 4.4), base=-2.35)
        outs = VGroup(*[v.outline() for v in V])
        labs = VGroup(*[T(n, 36).move_to([v.cx, 1.25, 0]) for n, v in zip(["㉮", "㉯", "㉰"], V)])
        d = M(f"{o('부피')}: 물질이 차지하는 공간의 크기", 40).move_to([0, 2.45, 0])
        self.say(f"{o('부피')}는 물질이 차지하는 공간의 크기예요",
                 "부피는 어떤 물질이 차지하는 공간의 크기예요. 모양이 다른 용기에 옮기며 모양과 부피가 변하는지 관찰해요.")
        self.play(FadeIn(d), FadeIn(outs), FadeIn(labs), run_time=0.8)
        # 고체: 나무 막대
        rod = K.rod("wood", 1.9, 0.3).rotate(PI / 2)
        poses = [([V[0].cx, V[0].base + 1.0, 0], 0.0), ([V[1].cx + 0.1, V[1].base + 0.45 + 0.55, 0], 1.15),
                 ([V[2].cx + 0.05, V[2].base + 1.0, 0], 0.25)]
        rod.move_to(poses[0][0])
        self.say(f"나무 막대를 ㉮㉯㉰에 넣어 봐요", "먼저 나무 막대를 용기 가, 나, 다에 차례로 넣어 봐요.")
        self.play(FadeIn(rod, shift=DOWN * 0.5), run_time=0.6)
        ang = 0.0
        for p, a in poses[1:]:
            self.play(rod.animate.move_to(p).rotate(a - ang), run_time=0.8)
            ang = a
        self.say(f"막대는 {g('모양도 크기(부피)도 그대로')}예요", "어느 용기에 넣어도 나무 막대의 모양과 크기, 곧 부피는 그대로예요. 고체예요.")
        self.play(Indicate(rod, color=ORANGE), run_time=0.8)
        self.settle()
        self.play(FadeOut(rod), run_time=0.4)
        # 액체: 물
        vols = [ValueTracker(0.0) for _ in range(3)]
        VOL = 1.95
        liq = always_redraw(lambda: VGroup(*[V[i].liquid(vols[i].get_value(), K.WATER, 0.75) for i in range(3)]))
        self.add(liq)
        self.bring_to_front(outs)
        self.say(f"이번에는 {b_('물')}을 ㉮에 담고 높이를 표시해요", "이번에는 물을 용기 가에 담고, 물의 높이를 유성펜으로 표시해요.")
        self.play(vols[0].animate.set_value(VOL), run_time=1.0)
        hy = V[0].y(V[0].level(VOL))
        mark = VGroup(Line([V[0].cx - 0.75, hy, 0], [V[0].cx + 0.75, hy, 0], stroke_color=INK, stroke_width=6),
                      T("처음 높이", 26).move_to([V[0].cx + 1.35, hy + 0.3, 0]))
        self.play(Create(mark), run_time=0.5)

        def pour(i, j, rt=1.4):
            a = np.array([V[i].cx, V[i].y(V[i].H) + 0.1, 0])
            b2 = np.array([V[j].cx, V[j].y(V[j].H) + 0.1, 0])
            st = K.smooth([tuple(a[:2]), ((a[0] + b2[0]) / 2, max(a[1], b2[1]) + 1.0), tuple(b2[:2])], K.WATER_D, 8)
            self.play(Create(st), run_time=0.3)
            self.play(vols[i].animate.set_value(0.0), vols[j].animate.set_value(VOL), run_time=rt)
            self.play(FadeOut(st), run_time=0.2)
        self.say(f"㉯로 옮기면 넓게 퍼지고, ㉰에서는 둥글게 — {o('모양이 바뀌어요')}",
                 "용기 나로 옮기면 물이 넓게 퍼지고, 용기 다에서는 둥근 모양이 돼요. 물은 담는 용기에 따라 모양이 바뀌어요.")
        pour(0, 1)
        pour(1, 2)
        self.pause_screen(5, "다시 ㉮로 옮기면 물의 높이는?")
        self.say(f"다시 ㉮로 옮기면 {g('처음 높이와 똑같아요')}", "다시 용기 가로 옮겼더니 처음 표시한 높이와 똑같아요.")
        pour(2, 0)
        self.play(Indicate(mark, color=GREEN, scale_factor=1.15), run_time=0.8)
        self.say(f"액체는 모양은 변해도 {g('부피는 변하지 않아요')}", "액체는 담는 용기에 따라 모양은 변하지만, 부피는 변하지 않아요.")
        self.settle()
        self.remove(liq)
        clear_stage(self)

    # ── 모래 ──
    def sand(self):
        self.section("생각해요")
        rng = np.random.default_rng(11)
        pile = Polygon([-5.6, -1.6, 0], [-1.4, -1.6, 0], [-3.5, 0.4, 0], fill_color=K.SAND, fill_opacity=1, stroke_color="#C9A866",
                       stroke_width=4)
        grains = VGroup(*[Dot([x, y, 0], radius=0.035, color="#B8955A") for x, y in
                          zip(rng.uniform(-4.8, -2.2, 40), rng.uniform(-1.5, -0.6, 40))])
        lens = Circle(radius=1.8, fill_color=PAPER, fill_opacity=1, stroke_color=K.IRON_D, stroke_width=8).move_to([2.6, 0.3, 0])
        big = VGroup()
        for k in range(7):
            a = k * 2 * PI / 7
            c = np.array([2.6 + 1.0 * np.cos(a) * (k > 0), 0.3 + 1.0 * np.sin(a) * (k > 0), 0])
            n = 6
            pts = [c + np.array([0.38 * (0.75 + 0.25 * rng.random()) * np.cos(t), 0.33 * (0.75 + 0.25 * rng.random()) * np.sin(t), 0])
                   for t in np.linspace(0, 2 * PI, n, endpoint=False)]
            big.add(Polygon(*pts, fill_color=K.SAND, fill_opacity=1, stroke_color="#A7834A", stroke_width=4))
        link = Line([-3.3, -0.6, 0], lens.point_at_angle(PI * 1.1), stroke_color=K.IRON_D, stroke_width=4)
        self.say("모래는 부으면 흐르는데, 고체일까요?", "모래는 부으면 흐르는 것처럼 보여요. 모래는 고체일까요, 액체일까요?")
        self.play(FadeIn(pile), FadeIn(grains), run_time=0.6)
        self.play(Create(link), FadeIn(lens), FadeIn(big, lag_ratio=0.1), run_time=1.0)
        self.say(f"알갱이 하나하나는 {o('모양과 부피가 그대로')} — {g('고체')}예요",
                 "가까이 보면 알갱이마다 모양이 정해져 있어요. 알갱이 하나하나의 모양과 부피가 변하지 않으니 모래는 고체예요.")
        tg = st_tag("고체", 40).move_to([2.6, -1.95, 0])
        self.play(FadeIn(tg), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 실험 2: 공간을 차지하는 기체 ──
    def cups(self):
        self.section("실험해요")
        xs = [-3.5, 3.5]
        tanks, cups, dots = VGroup(), [], []
        for i, x in enumerate(xs):
            tk = K.tank(3.6, 2.8, 0.62).move_to([x, -1.0, 0])
            tanks.add(tk)
            cp = K.hole_cup(1.3, 1.5, tape_on=(i == 0)).move_to([x, 1.15, 0])
            dt = K.air_dots(x - 0.55, x + 0.55, 0.5, 1.75, 16, seed=8 + i, r=0.045)
            cups.append(cp)
            dots.append(dt)
        heads = VGroup(T("① 구멍을 막은 컵", 34).move_to([xs[0], 2.55, 0]), T("② 구멍을 막지 않은 컵", 34).move_to([xs[1], 2.55, 0]))
        self.say(f"컵 안쪽에 {o('압축 물휴지')}를 붙이고 컵을 뒤집어요",
                 "바닥에 구멍이 뚫린 투명한 컵 안쪽에 압축 물휴지를 붙이고, 컵을 뒤집어 물속에 넣어요. 압축 물휴지는 물에 젖으면 커져요.")
        self.play(FadeIn(tanks), FadeIn(heads), *[FadeIn(c) for c in cups], run_time=0.8)
        self.say("한 컵은 구멍을 테이프로 막고, 한 컵은 막지 않아요", "한 컵은 구멍을 셀로판테이프로 막고, 다른 컵은 막지 않아요. 공기는 점으로 나타냈어요.")
        self.play(*[FadeIn(d) for d in dots], Indicate(cups[0].tape, color=ORANGE, scale_factor=1.4), run_time=0.8)
        self.pause_screen(5, "물휴지는 어떻게 될까요?")
        down = 1.15 - (-1.62)
        # ① 막은 컵
        self.say(f"① 막은 컵: 물이 들어오지 않아 {g('물휴지가 그대로')}예요",
                 "구멍을 막은 컵을 물속에 넣으면, 컵 안으로 물이 들어오지 않아 압축 물휴지는 그대로예요.")
        w0 = tanks[0].water
        self.play(VGroup(cups[0], dots[0]).animate.shift(DOWN * down),
                  w0.animate.stretch_to_fit_height(w0.height + 0.22, about_edge=DOWN), run_time=1.6)
        up = Arrow([xs[0] + 2.05, -1.2, 0], [xs[0] + 2.05, -0.35, 0], buff=0, color=BLUE, stroke_width=8)
        self.say(f"수조 물 높이는 조금 높아져요 — 공기가 {o('공간을 차지')}해요",
                 "수조 안 물의 높이는 처음보다 조금 높아졌어요. 컵 안의 공기가 공간을 차지하고 있기 때문이에요.")
        self.play(Create(up), run_time=0.5)
        self.settle()
        # ② 막지 않은 컵
        self.say(f"② 막지 않은 컵: 공기가 {o('구멍으로 빠져나가요')}",
                 "구멍을 막지 않은 컵을 넣으면, 컵 안의 공기가 구멍으로 빠져나가요.")
        self.play(VGroup(cups[1], dots[1]).animate.shift(DOWN * down), run_time=1.4)
        hole = cups[1].get_top()
        bubbles = VGroup(*[Circle(radius=0.08 + 0.03 * k, stroke_color=K.GLASS_D, stroke_width=4).move_to(hole + UP * (0.2 + 0.4 * k))
                           for k in range(3)])
        air = cups[1].air
        self.play(dots[1].animate.move_to(hole + UP * 1.4).set_opacity(0),
                  air.animate.stretch_to_fit_height(0.12, about_edge=UP),
                  FadeIn(bubbles, shift=UP * 0.6, lag_ratio=0.3), run_time=1.6)
        self.play(FadeOut(bubbles, shift=UP * 0.5), run_time=0.4)
        self.say(f"물이 들어와 물휴지가 {b_('젖어서 커져요')}", "그러자 물이 컵 안으로 들어와 압축 물휴지가 물에 젖어 커졌어요. 수조 물 높이는 거의 그대로예요.")
        tis = cups[1].tissue
        self.play(tis.animate.stretch(1.6, 0).stretch(3.0, 1).shift(DOWN * 0.15).set_fill("#C9D3DA", opacity=1), run_time=0.8)
        self.say(f"기체는 {g('공간을 차지하고, 이동할 수 있어요')}", "이 실험으로 기체는 공간을 차지하고, 이동할 수 있다는 것을 알 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 생활 속 기체 ──
    def uses(self):
        self.section("생활 속 기체")
        its = [(K.balloon_dog, "풍선", "공기가 가득 채워 모양을 만들어요"), (K.bike_tire, "자전거 타이어", "공기를 넣어 부풀려요"),
               (K.bubble_wrap, "공기 포장재", "공기가 충격을 줄여 줘요")]
        row = VGroup()
        for i, (f, n, d) in enumerate(its):
            x = -4.5 + i * 4.5
            p = K.fit(f(), 2.4, 1.9).move_to([x, 1.0, 0])
            row.add(VGroup(p, T(n, 36).move_to([x, -0.45, 0]), T(d, 26, SOFT).move_to([x, -1.1, 0])))
        self.say(f"풍선·타이어·공기 포장재는 {g('공기가 공간을 차지')}하는 성질을 이용해요",
                 "풍선, 자전거 타이어, 공기 포장재는 공기가 공간을 차지하는 성질을 이용한 물체예요.")
        self.play(FadeIn(row, lag_ratio=0.25), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 성질 비교표 ──
    def table(self):
        self.section("정리해요")
        rows = [("담는 용기에 따라 모양이 변하나요?", ["×", "○", "○"]),
                ("담는 용기에 따라 부피가 변하나요?", ["×", "×", None]),
                ("흐르는 성질이 있나요?", ["×", "○", "○"]),
                ("대부분 눈에 보이나요?", ["○", "○", "×"]),
                ("공간을 차지하나요?", ["○", "○", "○"])]
        cw = [6.4, 2.1, 2.1, 2.4]
        x0 = -sum(cw) / 2
        y0, rh = 2.45, 0.8
        grp = VGroup()
        for j, s in enumerate(["고체", "액체", "기체"]):
            grp.add(st_tag(s, 32).move_to([x0 + sum(cw[:j + 1]) + cw[j + 1] / 2, y0, 0]))
        cells = []
        for i, (q, vals) in enumerate(rows):
            y = y0 - (i + 1) * rh
            line = Line([x0, y + rh / 2, 0], [x0 + sum(cw), y + rh / 2, 0], stroke_color=SOFT, stroke_width=3)
            qq = T(q, 30).move_to([x0 + 0.1, y, 0], aligned_edge=LEFT)
            cs = VGroup()
            for j, v in enumerate(vals):
                x = x0 + sum(cw[:j + 1]) + cw[j + 1] / 2
                if v is None:
                    cs.add(T("4학년 때 더 배워요", 22, SOFT).move_to([x, y, 0]))
                else:
                    cs.add(T(v, 40, GREEN if v == "○" else RED).move_to([x, y, 0]))
            grp.add(line, qq)
            cells.append(cs)
        self.say("고체, 액체, 기체의 성질을 표로 비교해요", "고체, 액체, 기체의 성질을 표로 비교해 볼까요?")
        self.play(FadeIn(grp, lag_ratio=0.05), run_time=1.0)
        self.play(FadeIn(cells[0]), FadeIn(cells[1]), run_time=0.6)
        self.say(f"{o('고체')}는 용기가 바뀌어도 {g('모양과 부피가 변하지 않아요')}",
                 "고체는 담는 용기에 관계없이 모양과 부피가 변하지 않아요. 액체는 모양은 변하지만 부피는 변하지 않아요.")
        self.play(FadeIn(cells[2]), FadeIn(cells[3]), run_time=0.6)
        self.say(f"셋은 성질이 다르지만, 모두 {g('공간을 차지해요')}", "고체, 액체, 기체는 서로 다른 성질을 가지고 있지만, 모두 공간을 차지해요.")
        self.play(FadeIn(cells[4]), run_time=0.5)
        self.settle()
        clear_stage(self)


def VMob_cup():
    """빈 찻잔(가운데 (0,0))"""
    from manim import VMobject
    cup = VMobject(stroke_color=K.GLASS_D, stroke_width=6)
    cup.set_points_as_corners([[-0.7, 0.6, 0], [-0.55, -0.6, 0], [0.55, -0.6, 0], [0.7, 0.6, 0]])
    handle = Circle(radius=0.28, stroke_color=K.GLASS_D, stroke_width=6).move_to([0.85, 0.1, 0])
    saucer = Line([-1.0, -0.66, 0], [1.0, -0.66, 0], stroke_color=K.GLASS_D, stroke_width=7)
    return VGroup(handle, cup, saucer)
