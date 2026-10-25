"""「과학 원리 돋보기」 5학년 8화 — 빛은 어떻게 나아갈까? (5-1 2단원 빛의 성질 4차시, 화 코드 5-1-2-b)

바탕: grade5/science/sem1/u2-2.html(원본 _build_tb/src/u2-2.html) — 도입(구름 사이로 내려오는 햇빛·비 오는 밤 자동차 전조등·
어두운 밤 손전등의 빛, 빛은 어떤 모습으로 나아갈까?), 실험해요 1(구멍 뚫린 검은색 도화지를 통과한 햇빛: 아래 도화지를 위아래로
움직이면 빛이 닿는 자리가 한 줄로 옮겨 감, 도화지를 세우면 곧고 길게 비침 → 똑바로 나아가요, 안전: 태양을 직접 바라보지 않기·
햇빛 보안경), 실험해요 2(레이저 지시기 + 교실 어둡게 + 분무기로 물 뿌리기 → 곧게 나아가는 빛, 방향을 바꾸어도 곧게, 그림으로
나타내면 곧은 선, 안전: 레이저 빛을 사람·눈에 비추지 않기·레이저 보안경과 실험복·물은 지시기에 닿지 않게 앞쪽으로),
정리해요(빛의 직진, 불투명한 물체를 만나면 그림자, 손전등 두 개 → 그림자 두 개), 한눈에 쏙(빛의 직진, 그림자는 직진과 관련),
형성 평가 서술형(손으로 햇빛을 가리면 눈이 부시지 않은 까닭: 햇빛이 곧게 나아가다가 손에 막혀서).
최종: ./make_final.sh s5ep08
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Polygon,
                   Rectangle, Line, ValueTracker, always_redraw, Ellipse, ArcBetweenPoints, VMobject)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u12 as K
from kit_s3u24 import hand


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep08(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 8
    EP_TITLE = "빛은 어떻게 나아갈까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.sun_lab()
        self.laser_lab()
        self.shadow()
        self.hand_sun()
        self.summary()
        self.closing(f"빛이 곧게 나아가는 성질을 {g('빛의 직진')}이라고 해요",
                     next_preview="5학년 9화 · 빛을 거울에 비추면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        w, h, y = 3.95, 2.7, 0.75
        # ① 구름 사이 햇빛
        p1 = K.panel(w, h, "#9CC8E8", -4.15, y)
        cx = -4.15
        sh1 = VGroup(*[K.light_shaft([cx + a, y + 0.75], [cx + a + 0.35, y + 0.75], [cx + a + b, y - 1.2],
                                     [cx + a + b + 0.7, y - 1.2], col="#FFF6C2", op=0.75)
                       for a, b in ((-1.1, -0.5), (-0.1, 0.0), (0.8, 0.35))])
        gnd = Rectangle(width=w - 0.08, height=0.3, fill_color="#5F8F4E", fill_opacity=1, stroke_width=0).move_to([cx, y - 1.17, 0])
        cl = VGroup(K.E(2.2, 0.7, "#F4F6F8", cx - 0.6, y + 0.95, sw=0), K.E(2.4, 0.75, "#EEF1F4", cx + 0.7, y + 0.9, sw=0))
        f1 = VGroup(p1, sh1, gnd, cl)
        # ② 비 오는 밤 전조등
        p2 = K.panel(w, h, K.NIGHT2, 0, y)
        car = K.car_night(0.75).move_to([-1.2, y - 0.85, 0], aligned_edge=DOWN)
        lp = car.lamp.get_center()
        beam2 = Polygon(lp, [1.9, y + 0.35, 0], [1.9, y - 1.25, 0], fill_color=K.GLOW, fill_opacity=0.45, stroke_width=0)
        rain = VGroup(*[Line([x, yy, 0], [x - 0.06, yy - 0.22, 0], stroke_color="#8FB3D9", stroke_width=3)
                        for x, yy in ((-1.5, 1.8), (-0.6, 1.5), (0.4, 1.9), (1.3, 1.6), (0.9, 1.1), (-1.0, 1.15))])
        road = Rectangle(width=w - 0.08, height=0.25, fill_color="#333A44", fill_opacity=1, stroke_width=0).move_to([0, y - 1.2, 0])
        f2 = VGroup(p2, road, beam2, rain, car)
        # ③ 손전등
        p3 = K.panel(w, h, K.NIGHT, 4.15, y)
        fl = K.flashlight(True, 0.8).move_to([3.0, y - 0.1, 0])
        tp = fl.get_right()
        beam3 = Polygon(tp + UP * 0.12, [6.05, y + 0.9, 0], [6.05, y - 1.0, 0], tp + DOWN * 0.12,
                        fill_color=K.GLOW, fill_opacity=0.4, stroke_width=0)
        f3 = VGroup(p3, beam3, fl)
        caps = VGroup(T("구름 사이로 내려오는 햇빛", 26), T("비 오는 밤 자동차 전조등", 26), T("어두운 밤 손전등의 빛", 26))
        for c, x in zip(caps, (-4.15, 0, 4.15)):
            c.move_to([x, y - h / 2 - 0.35, 0])
        self.say("빛이 나아가는 모습을 어디서 보았나요?",
                 "구름 사이로 내려오는 햇빛, 자동차 전조등, 손전등의 빛처럼 빛이 나아가는 모습을 본 적이 있나요?")
        for f, c in zip((f1, f2, f3), caps):
            self.play(FadeIn(f), FadeIn(c), run_time=0.5)
        self.settle()
        self.say(f"빛은 어떤 모습으로 {o('나아가고')} 있었나요?",
                 "빛은 어떤 모습으로 나아가고 있었나요? 곧게? 구불구불하게?")
        self.settle()
        self.pause_screen(5, "빛은 어떻게 나아갈까요?")
        clear_stage(self)

    # ── 실험해요 1: 구멍을 통과한 햇빛 ──
    def sun_lab(self):
        self.section("실험해요 1")
        HY, H0, H1 = 1.65, -1.75, -1.0
        el = np.radians(62)
        k = np.cos(el) / np.sin(el)              # 아래로 1 내려갈 때 오른쪽으로 가는 거리
        sun = K.sun_s(0.42).move_to([-5.75, 2.3, 0])
        rays = VGroup(*[Line([x - (3.05 - HY) * k, 3.05, 0], [x, HY + 0.06, 0], stroke_color=K.SUNC, stroke_width=3,
                             stroke_opacity=0.6) for x in np.arange(-3.4, 6.2, 0.55)])
        top = VGroup(Rectangle(width=H0 + 6.4, height=0.12, fill_color=INK, fill_opacity=1, stroke_width=0).move_to([(-6.4 + H0) / 2, HY, 0]),
                     Rectangle(width=6.4 - H1, height=0.12, fill_color=INK, fill_opacity=1, stroke_width=0).move_to([(H1 + 6.4) / 2, HY, 0]))
        tl = T("구멍 뚫린 검은색 도화지", 26).move_to([3.4, HY + 0.32, 0])
        Y = ValueTracker(0.9)

        def beam():
            y = Y.get_value()
            s_ = (HY - y) * k
            return Polygon([H0, HY, 0], [H1, HY, 0], [H1 + s_, y, 0], [H0 + s_, y, 0], fill_color="#FFE14D",
                           fill_opacity=0.75, stroke_width=0)

        def lower():
            y = Y.get_value()
            s_ = (HY - y) * k
            bar = Rectangle(width=8.6, height=0.12, fill_color=INK, fill_opacity=1, stroke_width=0).move_to([-1.2, y - 0.06, 0])
            patch = Rectangle(width=H1 - H0, height=0.13, fill_color="#FFD000", fill_opacity=1, stroke_width=0).move_to(
                [(H0 + H1) / 2 + s_, y - 0.06, 0])
            lab = T("아래 검은색 도화지", 24, SOFT).next_to(bar, DOWN, buff=0.1).align_to(bar, LEFT)
            return VGroup(bar, patch, lab)

        bm = always_redraw(beam)
        lo = always_redraw(lower)
        self.say(f"구멍 뚫린 도화지 아래에 다른 도화지를 대요",
                 "구멍 뚫린 검은색 도화지를 햇빛에 비추고, 그 아래에 검은색 도화지를 대요.")
        self.play(FadeIn(sun), FadeIn(rays), FadeIn(top), FadeIn(tl), run_time=0.7)
        self.add(bm, lo)
        self.wait(0.3)
        self.settle()
        safe = K.safety_note("태양을 직접 바라보지 않아요. 햇빛 보안경을 써요.", w=8.4, size=28).move_to([2.6, -2.15, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.say(f"{r('태양을 직접 바라보지 않아요')}", "태양을 직접 바라보지 않아요. 햇빛 보안경을 써요.")
        self.settle()
        self.play(FadeOut(safe), run_time=0.3)
        self.say("아래 도화지를 위아래로 천천히 움직여요",
                 "아래 도화지를 위아래로 천천히 움직이며 빛이 닿는 자리를 관찰해요.")
        marks = VGroup()
        cents = []
        for y in (0.6, -0.5, -1.6):
            self.play(Y.animate.set_value(y), run_time=1.0)
            s_ = (HY - y) * k
            c = np.array([(H0 + H1) / 2 + s_, y - 0.06, 0])
            cents.append(c)
            mk = Rectangle(width=H1 - H0, height=0.08, fill_color=ORANGE, fill_opacity=0.9, stroke_width=0).move_to(c + UP * 0.1)
            marks.add(mk)
            self.add(mk)
        self.settle()
        self.pause_screen(5, "빛이 닿는 자리는 어떻게 될까요?")
        line = K.dashed([cents[0][0] - 0.35 * k, cents[0][1] + 0.35], [cents[-1][0] + 0.2 * k, cents[-1][1] - 0.2], col=RED, sw=5, op=1)
        self.play(Create(line), run_time=0.8)
        self.say(f"빛이 닿는 자리가 비스듬히 {o('한 줄로')} 옮겨 가요",
                 "도화지를 내릴수록 빛이 닿는 자리가 비스듬히 한 줄로 반듯하게 옮겨 가요.")
        self.settle()
        # 도화지를 세워 보기
        self.remove(bm, lo)
        self.play(*[FadeOut(m) for m in marks], FadeOut(line), run_time=0.3)
        bot = -2.05
        board = Rectangle(width=5.6, height=HY - 0.06 - bot, fill_color="#222222", fill_opacity=1, stroke_width=0).move_to([0.2, (HY - 0.06 + bot) / 2, 0])
        s_ = (HY - bot) * k
        streak = Polygon([H0, HY - 0.06, 0], [H1, HY - 0.06, 0], [H1 + s_, bot, 0], [H0 + s_, bot, 0], fill_color="#FFE14D",
                         fill_opacity=0.95, stroke_width=0)
        bl = VGroup(T("구멍 아래에", 26), T("세운 검은색 도화지", 26)).arrange(DOWN, buff=0.12).move_to([4.75, 0.2, 0])
        self.play(FadeIn(board), run_time=0.5)
        self.play(FadeIn(streak), FadeIn(bl), run_time=0.7)
        self.say(f"세운 도화지에는 햇빛이 {o('곧고 길게')} 비쳐요",
                 "이번에는 구멍 아래에 도화지를 세웠어요. 햇빛이 곧고 길게 비쳤어요.")
        self.settle()
        arr = K.ray([[H0 + 0.37 - 1.3 * k, HY + 1.3], [(H0 + H1) / 2 + s_ * 0.85, HY - (HY - bot) * 0.85]], col=RED, sw=7)
        self.play(Create(arr), run_time=0.8)
        self.say(f"구멍을 통과한 햇빛은 {g('똑바로 나아가요')}",
                 "구멍을 통과한 햇빛은 똑바로 나아가요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 2: 레이저 지시기 ──
    def laser_scene(self, ang, spray, y0=0.25):
        pn = K.panel(12.4, 4.5, K.NIGHT, 0, 0.45)
        wall = Rectangle(width=0.45, height=4.4, fill_color="#2A3040", fill_opacity=1, stroke_width=0).move_to([5.95, 0.45, 0])
        floor = Rectangle(width=12.3, height=0.35, fill_color="#20242C", fill_opacity=1, stroke_width=0).move_to([0, -1.6, 0])
        stand = Rectangle(width=0.16, height=y0 + 1.45, fill_color="#7D8A95", fill_opacity=1, stroke_width=0).move_to([-5.1, (y0 - 1.45) / 2, 0])
        lz = K.laser(1.0).rotate(np.radians(ang), about_point=np.array([0.0, 0, 0]))
        lz.shift([-4.8, y0, 0])
        tip = np.array([-4.8, y0, 0]) + np.array([np.cos(np.radians(ang)), np.sin(np.radians(ang)), 0]) * 0.07
        d = np.array([np.cos(np.radians(ang)), np.sin(np.radians(ang)), 0])
        hit = tip + d * ((5.72 - tip[0]) / d[0])
        dot = VGroup(K.C(0.16, K.LASER, hit[0], hit[1], sw=0).set_opacity(0.3), K.C(0.08, K.LASER, hit[0], hit[1], sw=0))
        grp = VGroup(pn, floor, wall, stand, lz, dot)
        if spray:
            ms = K.mist((-2.6, 2.4, -1.2, 2.4), n=70, seed=5)
            xa, xb = -2.6, 2.4
            pa = tip + d * ((xa - tip[0]) / d[0])
            pb = tip + d * ((xb - tip[0]) / d[0])
            grp.add(ms, Line(pa, pb, stroke_color="#FF2B2B", stroke_width=6))
        sp = K.spray_bottle(0.8).move_to([2.9, 2.0, 0])
        grp.add(sp)
        return grp

    def laser_lab(self):
        self.section("실험해요 2")
        sc = self.laser_scene(0, False)
        self.say("교실을 어둡게 하고 레이저 지시기를 켜요",
                 "이번에는 교실을 어둡게 하고 레이저 지시기를 켜요. 벽에 빨간 점만 보여요.")
        self.play(FadeIn(sc), run_time=0.7)
        self.settle()
        safe = K.safety_note("레이저 지시기의 빛을 사람에게, 특히 눈에 비추지 않아요. 레이저 보안경과 실험복을 입어요.",
                             w=12.6, size=26).move_to([0, -2.25, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.say(f"레이저 빛을 {r('사람의 눈에 비추지 않아요')}",
                 "레이저 지시기의 빛을 사람에게, 특히 눈에 비추지 않아요. 레이저 보안경과 실험복을 입어요.")
        self.settle()
        self.play(FadeOut(safe), run_time=0.3)
        self.say("레이저 지시기 앞쪽에 분무기로 물을 뿌리면?",
                 "분무기로 물을 뿌려요. 물이 레이저 지시기에 닿지 않게 약간 앞쪽으로 뿌려요.")
        self.settle()
        self.pause_screen(5, "빛이 지나가는 길은 어떤 모양일까요?")
        self.play(Transform(sc, self.laser_scene(0, True)), run_time=0.8)
        self.say(f"물방울 사이로 빛이 {o('곧게')} 나아가는 것이 보여요",
                 "물방울 사이로 빛이 지나가는 길이 보여요. 레이저 지시기의 빛이 곧게 나아가요.")
        self.settle()
        self.play(Transform(sc, self.laser_scene(9, True)), run_time=1.0)
        self.say(f"방향을 바꾸어도 빛은 {o('곧게')} 나아가요", "레이저 지시기의 방향을 바꾸어 다시 뿌려 봐도 빛은 곧게 나아가요.")
        self.settle()
        clear_stage(self)
        # 그림으로 나타내기
        def mini(kind):
            pn = K.panel(3.6, 1.6, "#1B2230", 0, 0)
            lz = Rectangle(width=0.3, height=0.4, fill_color="#555555", fill_opacity=1, stroke_width=0).move_to([-1.6, 0, 0])
            if kind == 0:
                ln = Line([-1.45, 0, 0], [1.65, 0, 0])
            elif kind == 1:
                ln = ArcBetweenPoints([-1.45, 0, 0], [1.65, 0.3, 0], angle=-1.2)
            else:
                ln = VMobject()
                xs = np.linspace(-1.45, 1.65, 60)
                ln.set_points_smoothly([[x, 0.3 * np.sin((x + 1.45) * 4.0), 0] for x in xs])
            ln.set_stroke("#FF3B3B", 6)
            return VGroup(pn, lz, ln)
        names = ["곧은 선", "굽은 선", "물결 선"]
        picks = VGroup(*[VGroup(mini(i), T(n, 30).shift(DOWN * 1.15)) for i, n in enumerate(names)]).arrange(RIGHT, buff=0.55).move_to([0, 0.7, 0])
        self.say("레이저 지시기의 빛을 그림으로 나타내면?",
                 "레이저 지시기의 빛이 나아가는 모습을 그림으로 나타내면 어느 것일까요?")
        self.play(FadeIn(picks, lag_ratio=0.2), run_time=0.8)
        self.settle()
        box = K.rect(picks[0].width + 0.3, picks[0].height + 0.3, PAPER, op=0, stroke=GREEN, sw=7, r=0.2).move_to(picks[0])
        self.play(Create(box), picks[1].animate.set_opacity(0.3), picks[2].animate.set_opacity(0.3), run_time=0.6)
        self.say(f"레이저 지시기의 빛은 {g('곧은 선')}으로 나타내요", "정답은 곧은 선이에요. 레이저 지시기의 빛은 곧게 나아가요.")
        self.settle()
        clear_stage(self)

    # ── 정리해요: 빛의 직진과 그림자 ──
    def shadow_scene(self, two):
        pn = K.panel(12.4, 4.5, "#2B3142", 0, 0.45)
        floor = Rectangle(width=12.3, height=0.3, fill_color="#3A3F4F", fill_opacity=1, stroke_width=0).move_to([0, -1.62, 0])
        WX = 5.2
        wall = Rectangle(width=0.5, height=4.4, fill_color=K.WALL, fill_opacity=1, stroke_width=0).move_to([WX + 0.25, 0.45, 0])
        ox, top, bot = 1.0, 0.5, -0.1
        stick = Rectangle(width=0.08, height=bot + 1.47, fill_color="#888888", fill_opacity=1, stroke_width=0).move_to([ox, (bot - 1.47) / 2, 0])
        obj = K.stand_obj(0.34, top - bot).move_to([ox, (top + bot) / 2, 0])
        grp = VGroup(pn, floor, wall)
        srcs = [((-5.2, 1.6), "#FFD23F")] + ([((-5.2, -1.2), "#7FD3FF")] if two else [])
        for (sx, sy), col in srcs:
            ends = []
            for oy in (top, bot):
                yw = sy + (oy - sy) * (WX - sx) / (ox - sx)
                ends.append(yw)
                grp.add(K.ray([[sx + 0.35, sy + (oy - sy) * 0.35 / (ox - sx)], [ox, oy]], col=col, sw=4, tip=0.2))
                grp.add(K.dashed([ox, oy], [WX, yw], col=col, sw=3, op=0.9))
            grp.add(Rectangle(width=0.5, height=abs(ends[0] - ends[1]), fill_color="#1D1F26",
                              fill_opacity=0.85 if not two else 0.7, stroke_width=0).move_to([WX + 0.25, (ends[0] + ends[1]) / 2, 0]))
            fl = K.flashlight(True, 0.8).rotate(np.arctan2((top + bot) / 2 - sy, ox - sx)).move_to([sx, sy, 0])
            grp.add(fl)
        grp.add(stick, obj)
        return grp

    def shadow(self):
        self.section("정리해요")
        card = K.text_card([f"빛이 곧게 나아가는 성질 = {g('빛의 직진')}"], w=9.0, size=44).move_to([0, 0.9, 0])
        self.say(f"빛이 곧게 나아가는 성질을 {g('빛의 직진')}이라고 해요",
                 "이처럼 빛이 곧게 나아가는 성질을 빛의 직진이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        self.play(FadeOut(card), run_time=0.3)
        sc = self.shadow_scene(False)
        self.play(FadeIn(sc), run_time=0.8)
        self.say(f"불투명한 물체를 만나면 더 나아가지 못해 {o('그림자')}가 생겨요",
                 "빛이 곧게 나아가다가 불투명한 물체를 만나면 더 이상 나아가지 못해 그림자가 생겨요.")
        self.settle()
        self.play(Transform(sc, self.shadow_scene(True)), run_time=0.9)
        self.say(f"손전등을 두 개 비추면 그림자도 {o('두 개')} 생겨요",
                 "물체에 두 개의 손전등을 비추면 그림자도 두 개 생겨요. 그 까닭은 무엇일까요?")
        self.settle()
        self.pause_screen(5, "그림자가 두 개 생기는 까닭은?")
        self.say(f"두 손전등의 빛이 각각 {g('곧게')} 나아가다 물체에 막혀요",
                 "두 손전등에서 나온 빛이 각각 곧게 나아가다가 물체에 막혀서 그림자가 두 개 생겨요.")
        self.settle()
        clear_stage(self)

    # ── 생활 속: 손으로 햇빛 가리기 ──
    def hand_sun(self):
        self.section("생활 속 직진")
        sun = K.sun_s(0.5).move_to([-5.2, 1.9, 0])
        ey = K.eye(1.3, LEFT).move_to([4.6, -0.6, 0])
        hd = hand(1.1).move_to([1.6, 0.2, 0])
        self.say("손으로 햇빛을 가리면 눈이 부시지 않아요. 왜일까요?",
                 "손으로 햇빛을 가리면 눈이 부시지 않아요. 그 까닭은 무엇일까요?")
        self.play(FadeIn(sun), FadeIn(ey), run_time=0.5)
        a, b = np.array([-4.6, 1.6]), np.array([4.0, -0.5])
        r0 = K.ray([a, b], col=K.SUNC, sw=7)
        K.play_ray(self, r0, 0.8)
        self.play(FadeIn(hd), FadeOut(r0), run_time=0.5)
        self.settle()
        self.pause_screen(5, "눈이 부시지 않은 까닭은?")
        stop = a + (b - a) * ((1.35 - a[0]) / (b[0] - a[0]))
        rays = VGroup(*[K.ray([a + np.array([0, dy]), stop + np.array([0, dy])], col=K.SUNC, sw=6) for dy in (-0.35, 0, 0.35)])
        for r_ in rays:
            K.play_ray(self, r_, 0.5)
        x = K.ox_mark(False, 0.25).move_to([3.2, -0.1, 0])
        self.play(FadeIn(x, scale=1.3), run_time=0.4)
        self.say(f"햇빛이 곧게 나아가다가 {o('손에 막혀서')} 눈까지 오지 못해요",
                 "햇빛이 곧게 나아가다가 손에 막혀서 눈까지 오지 못하기 때문이에요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"빛이 곧게 나아가는 성질을 빛의 {g('직진')}이라고 합니다.",
                            f"물체의 {o('그림자')}가 생기는 것은 빛이 직진하는 것과 관련 있어요."], w=12.6, size=40).move_to([0, 0.6, 0])
        self.say(f"빛은 곧게 나아가요. 이것을 빛의 {g('직진')}이라고 해요",
                 "빛이 곧게 나아가는 성질을 빛의 직진이라고 해요. 그림자가 생기는 것도 빛의 직진과 관련 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)
