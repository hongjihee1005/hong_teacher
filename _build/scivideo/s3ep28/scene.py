"""「과학 원리 돋보기」 3학년 28화 — 밀물과 썰물 (3-2 2단원 지구의 모습 7차시, 화 코드 3-2-2-e)

바탕: grade3/science/sem2/u2-5.html — 도입(같은 바닷가 사진 ㉮ 바위 아래가 물에 잠김 / ㉯ 바위 아래로 사람이 걸어 다님),
하루 동안 같은 바닷가 지켜보기(바닷물 높이 lvl(t) = 0.5 + 0.5·cos(2π(t − 3)/12.4), 바닷길·배·눈금 기둥,
관찰 기록표 6·9·12·15·18시의 잠긴 눈금 수 — 앱 식으로 계산하면 1·0·1·4·2칸), 그래프 '높아졌다 낮아졌다를 되풀이',
밀물·썰물 분류 카드 8장, 제부도 사진(배가 땅 위에 얹힘 → 썰물), 안내 방송(밀물이 되어 갯벌 밖으로),
따개비(밀물 때 바닷물에 잠기는 곳), 안전(어른과 함께, 밀물은 생각보다 빠름), 한눈에 쏙.
최종: ./make_final.sh s3ep28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circumscribe, LaggedStart,
                   ValueTracker, always_redraw, Dot, Rectangle, linear, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag, person
import kit_s3u22 as K
from kit_s3u12 import text_card, bin_box, barnacle


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


def app_reading(t):
    """앱 u2-5의 잠긴 눈금 수"""
    wy = 340 - K.tide_level(t) * (340 - 222)
    return max(0, min(6, int(np.floor((314 - wy) / 20 + 1e-9))))


def rock_panel(high, label):
    """같은 바닷가 두 모습: 꽃병처럼 생긴 바위 + 물 높이"""
    frame = Rectangle(width=5.2, height=3.4, stroke_color=INK, stroke_width=4)
    sky = Rectangle(width=5.2, height=3.4, fill_color=K.SKY, fill_opacity=1, stroke_width=0)
    ground = Rectangle(width=5.2, height=0.5, fill_color=K.MUD, fill_opacity=1, stroke_width=0).move_to([0, -1.45, 0])
    rock = K.P([(-0.55, -1.2), (-0.3, -0.4), (-0.75, 0.6), (-0.6, 1.1), (0.7, 1.1), (0.8, 0.5), (0.35, -0.4), (0.55, -1.2)],
               K.ROCK, K.ROCK_D, 4)
    top = K.E(1.5, 0.35, K.LAND, 0.05, 1.15, stroke=K.LAND_D, sw=3)
    grp = VGroup(sky, ground, rock, top)
    if high:
        water = Rectangle(width=5.2, height=1.6, fill_color=K.SEA, fill_opacity=0.8, stroke_width=0).move_to([0, -0.9, 0])
        grp.add(water, K.waves(-2.5, 2.5, -0.1, 0.06, 6, K.SEA_D, 4))
    else:
        for x in (-1.6, 1.4, 2.0):
            p = person(0.8, ORANGE if x < 0 else BLUE)
            p.shift([x, -1.2, 0])
            grp.add(p)
    grp.add(frame)
    lab = T(label, 40, ORANGE).next_to(frame, UP, buff=0.12)
    return VGroup(grp, lab)


class S3Ep28(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 28
    EP_TITLE = "밀물과 썰물"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.day()
        self.graph()
        self.define()
        self.life()
        self.closing(f"바닷물이 육지 쪽으로 밀려 들어오는 것은 {o('밀물')}\n"
                     f"바다 쪽으로 빠져나가는 것은 {b_('썰물')}이에요",
                     next_preview="3학년 29화 · 살아 숨 쉬는 갯벌")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        a = rock_panel(True, "사진 ㉮").scale(0.95).move_to([-3.3, 0.15, 0])
        b = rock_panel(False, "사진 ㉯").scale(0.95).move_to([3.3, 0.15, 0])
        self.say("같은 바닷가를 서로 다른 때에 본 모습이에요",
                 "두 그림은 캐나다 호프웰 록스 바닷가를 서로 다른 때에 본 모습이에요.")
        self.play(FadeIn(a, shift=UP * 0.2), FadeIn(b, shift=UP * 0.2), run_time=0.8)
        self.say("바위와 물을 비교해 보세요. 무엇이 달라졌나요?", "바위와 물을 잘 비교해 보세요. 무엇이 달라졌나요?")
        self.pause_screen(4, "무엇이 달라졌을까요?")
        self.say(f"바위는 그대로! {o('바닷물의 높이')}가 달라졌어요",
                 "바위의 모양과 자리는 똑같아요. 바닷물의 높이가 달라져서, ㉯에서는 물에 잠겼던 땅이 드러나 바위 아래까지 걸어갈 수 있어요.")
        self.play(Indicate(a[0][4], color=BLUE, scale_factor=1.03), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 하루 동안 지켜보기 ──
    def day(self):
        self.section("관찰해요")
        lv = ValueTracker(K.tide_level(6))
        tm = ValueTracker(6.0)
        shore = K.TideShore(lv)
        pic = shore.group()
        clock = always_redraw(lambda: T(f"{int(tm.get_value()):02d}:{int(round((tm.get_value() % 1) * 60)) % 60:02d}", 52, INK)
                              .move_to([-4.6, 2.35, 0]))
        cnt = always_redraw(lambda: T(f"잠긴 눈금 {shore.ticks_under()}칸", 36, RED).move_to([1.4, 2.4, 0]))
        lab_isl = T("섬", 32, INK).move_to([3.4, 1.75, 0])
        lab_pole = T("눈금 기둥", 28, INK).move_to([-0.3, 0.55, 0])
        lab_road = T("바닷길", 28, INK).move_to([0.8, -2.2, 0])
        self.say("하루 동안 같은 바닷가를 지켜봐요",
                 "아침 6시부터 같은 바닷가를 지켜봐요. 바닷물의 높이, 섬으로 가는 바닷길, 배, 눈금 기둥을 살펴보세요.")
        self.play(FadeIn(pic), FadeIn(clock), FadeIn(lab_isl), FadeIn(lab_pole), run_time=0.8)
        self.add(cnt)
        self.wait(0.5)

        def run(t1, rt):
            self.play(tm.animate.set_value(t1), lv.animate.set_value(K.tide_level(t1)), run_time=rt, rate_func=linear)

        run(9.2, 2.5)
        self.play(FadeIn(lab_road), run_time=0.3)
        self.say(f"9시쯤: 바닷물이 가장 낮아요 — {o('바닷길')}이 드러나고 배가 땅에 얹혀요",
                 "9시쯤에는 바닷물의 높이가 가장 낮아요. 섬으로 가는 바닷길이 드러나 걸어서 갈 수 있고, 배는 땅 위에 얹혀 있어요.")
        self.settle()
        self.play(FadeOut(lab_road), run_time=0.3)
        run(15.2, 4.0)
        self.say(f"오후 3시쯤: 바닷물이 가장 높아요 — 바닷길이 잠기고 배가 떠요",
                 "오후 3시쯤에는 바닷물의 높이가 가장 높아요. 바닷길이 물에 잠기고, 배는 물에 둥둥 떠 있어요.")
        self.settle()
        run(21.0, 3.0)
        self.say(f"같은 곳이라도 바닷물의 높이는 {g('높아졌다 낮아졌다')} 해요",
                 "다시 바닷물이 낮아져요. 같은 장소라도 하루 동안 바닷물의 높이가 높아졌다 낮아졌다 해요.")
        self.settle()
        shore.stop()
        cnt.clear_updaters()
        clock.clear_updaters()
        clear_stage(self)

    # ── 기록표와 그래프 ──
    def graph(self):
        self.section("기록해요")
        times = [6, 9, 12, 15, 18]
        vals = [app_reading(t) for t in times]
        x0, y0, dx, dy = -3.8, -1.6, 2.0, 0.62
        axes = VGroup(Line([x0 - 0.6, y0, 0], [x0 + 4 * dx + 0.6, y0, 0], stroke_color=INK, stroke_width=4),
                      Line([x0 - 0.6, y0, 0], [x0 - 0.6, y0 + 6 * dy + 0.2, 0], stroke_color=INK, stroke_width=4))
        grid = VGroup(*[Line([x0 - 0.6, y0 + k * dy, 0], [x0 + 4 * dx + 0.6, y0 + k * dy, 0], stroke_color=SOFT, stroke_width=1.5)
                        for k in range(1, 7)])
        ylabs = VGroup(*[T(str(k), 26, SOFT).move_to([x0 - 0.95, y0 + k * dy, 0]) for k in range(0, 7)])
        xlabs = VGroup(*[T(f"{t}시", 30, INK).move_to([x0 + i * dx, y0 - 0.38, 0]) for i, t in enumerate(times)])
        ttl = T("잠긴 눈금 수(칸)", 30, RED).move_to([x0 + 0.6, y0 + 6 * dy + 0.45, 0])
        self.say("시각마다 물에 잠긴 빨간 눈금의 수를 기록해요",
                 "시각마다 물에 잠긴 빨간 눈금의 수를 세어 그래프로 나타내요.")
        self.play(Create(axes), FadeIn(grid), FadeIn(ylabs), FadeIn(xlabs), FadeIn(ttl), run_time=0.8)
        pts = [np.array([x0 + i * dx, y0 + v * dy, 0]) for i, v in enumerate(vals)]
        dots = VGroup(*[Dot(p, radius=0.11, color=BLUE) for p in pts])
        nums = VGroup(*[T(f"{v}칸", 30, BLUE).next_to(p, UP, buff=0.15) for v, p in zip(vals, pts)])
        segs = VGroup(*[Line(pts[i], pts[i + 1], stroke_color=BLUE, stroke_width=6) for i in range(4)])
        self.play(LaggedStart(*[FadeIn(VGroup(d, n), scale=0.7) for d, n in zip(dots, nums)], lag_ratio=0.3), run_time=1.5)
        self.play(Create(segs), run_time=1.2)
        self.say("그래프를 보면 바닷물의 높이는 어떻게 변했나요?", "그래프를 보면 하루 동안 바닷물의 높이는 어떻게 변했나요?")
        self.pause_screen(4, "그래프에서 무엇을 알 수 있나요?")
        self.say(f"낮아졌다가 높아지고, 다시 낮아져요 — {g('되풀이')}해요",
                 "바닷물의 높이는 높아졌다가 낮아지고, 다시 높아졌다가 낮아지는 것을 되풀이해요.")
        self.play(Circumscribe(segs, color=GREEN), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 밀물과 썰물 ──
    def define(self):
        self.section("밀물과 썰물")
        lb = bin_box("밀물", 6.4, 4.3, ORANGE, 46).move_to([-3.4, 0.15, 0])
        rb = bin_box("썰물", 6.4, 4.3, BLUE, 46).move_to([3.4, 0.15, 0])
        li = VGroup(*[T(x, 30, INK) for x in ("바닷물의 높이가 높아져요", "바닷물이 육지 쪽으로 밀려 들어와요",
                                               "섬으로 가는 바닷길이 물에 잠겨요", "땅에 얹혀 있던 배가 물에 떠올라요")])
        ri = VGroup(*[T(x, 30, INK) for x in ("바닷물의 높이가 낮아져요", "바닷물이 바다 쪽으로 빠져나가요",
                                               "물에 잠겼던 갯벌이 드러나요", "물에 떠 있던 배가 땅에 얹혀요")])
        for grp, box in ((li, lb), (ri, rb)):
            grp.arrange(DOWN, buff=0.32, aligned_edge=LEFT)
            if grp.width > 5.9:
                grp.scale_to_fit_width(5.9)
            grp.move_to(box.box.get_center() + DOWN * 0.35)
        self.say(f"바닷물이 육지 쪽으로 밀려 들어오는 현상 = {o('밀물')}",
                 "바닷물의 높이가 높아지면서 바닷물이 육지 쪽으로 밀려 들어오는 현상을 밀물이라고 해요.")
        self.play(FadeIn(lb), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(x, shift=RIGHT * 0.2) for x in li[:2]], lag_ratio=0.3), run_time=0.8)
        self.say(f"바닷물이 바다 쪽으로 빠져나가는 현상 = {b_('썰물')}",
                 "바닷물의 높이가 낮아지면서 바닷물이 바다 쪽으로 빠져나가는 현상을 썰물이라고 해요.")
        self.play(FadeIn(rb), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(x, shift=LEFT * 0.2) for x in ri[:2]], lag_ratio=0.3), run_time=0.8)
        self.say("밀물 때는 바닷길이 잠기고 배가 떠올라요, 썰물 때는?",
                 "밀물 때는 바닷길이 잠기고 배가 떠올라요. 썰물 때는 갯벌이 드러나고 배가 땅에 얹혀요.")
        self.play(LaggedStart(*[FadeIn(x, shift=RIGHT * 0.2) for x in li[2:]], lag_ratio=0.3), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(x, shift=LEFT * 0.2) for x in ri[2:]], lag_ratio=0.3), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생활 속 밀물과 썰물 ──
    def life(self):
        self.section("생활 속으로")
        # 제부도: 땅 위에 얹힌 배
        mud = Rectangle(width=6.0, height=1.2, fill_color=K.MUD, fill_opacity=1, stroke_width=0).move_to([-3.4, -0.9, 0])
        boats = VGroup(*[VGroup(K.P([(-0.55, 0.0), (0.55, 0.0), (0.38, -0.25), (-0.38, -0.25)], K.BROWN, INK, 3),
                                Line([0, 0, 0], [0, 0.7, 0], stroke_color=INK, stroke_width=3)).move_to([x, -0.05, 0])
                         for x in (-4.8, -3.2, -1.7)])
        cap = T("경기 화성 제부도", 28, SOFT).move_to([-3.4, -1.8, 0])
        self.say("배들이 물 위가 아니라 땅 위에 얹혀 있어요. 언제일까요?",
                 "경기 화성 제부도의 모습이에요. 배들이 물 위가 아니라 땅 위에 얹혀 있어요. 밀물 때일까요, 썰물 때일까요?")
        self.play(FadeIn(mud), FadeIn(boats), FadeIn(cap), run_time=0.6)
        ans1 = tag("썰물 때 모습", BLUE, 40).move_to([-3.4, 1.5, 0])
        self.say(f"{b_('썰물')}이 되어 바닷물이 낮아지면 배가 땅에 얹혀요",
                 "썰물 때 모습이에요. 바닷물의 높이가 낮아지면 배가 땅 위에 얹혀요. 다시 밀물이 되면 배가 물에 떠올라요.")
        self.play(FadeIn(ans1, scale=0.8), run_time=0.5)
        # 안내 방송
        speaker = text_card(["“갯벌 밖으로 나오세요!”"], size=40).move_to([3.4, 1.5, 0])
        self.say("갯벌에서 “갯벌 밖으로 나오세요!” 방송이 나와요. 왜일까요?",
                 "갯벌에서 놀고 있는데 갯벌 밖으로 나오세요 하는 방송이 나와요. 왜일까요?")
        self.play(FadeIn(speaker, shift=DOWN * 0.2), run_time=0.5)
        self.pause_screen(4, "왜 나오라고 할까요?")
        ans2 = text_card([f"{o('밀물')}이 되어 바닷물이", "육지 쪽으로 들어오기 때문이에요"], size=34).move_to([3.4, -0.3, 0])
        self.say(f"{o('밀물')}이 되면 갯벌이 다시 물에 잠기기 때문이에요",
                 "밀물이 되어 바닷물이 육지 쪽으로 들어오기 때문이에요. 바닷물의 높이가 높아져 갯벌이 다시 물에 잠겨요.")
        self.play(FadeIn(ans2, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)
        # 따개비
        bar = K.fit(barnacle(), 3.2, 1.6).move_to([-3.4, 0.4, 0])
        self.say("바닷가 바위나 기둥에 따개비가 붙어 사는 까닭은?",
                 "바닷가 기둥이나 바위에 바다 생물인 따개비가 붙어 사는 까닭은 무엇일까요?")
        self.play(FadeIn(bar), run_time=0.5)
        ans3 = text_card([f"그곳이 {o('밀물')} 때", "바닷물에 잠기는 곳이라서"], size=38).move_to([2.8, 0.4, 0])
        self.say(f"그곳이 {o('밀물')} 때 바닷물에 잠기는 곳이라서 살 수 있어요",
                 "그곳이 밀물 때 바닷물에 잠기는 곳이라서, 바다 생물인 따개비가 살 수 있어요.")
        self.play(FadeIn(ans3, shift=LEFT * 0.2), run_time=0.5)
        self.settle()
        warn = T("바닷길·갯벌은 꼭 어른과 함께! 밀물은 생각보다 빠르게 들어와요", 32, RED).move_to([0, -1.8, 0])
        self.say(f"{r('안전')}: 꼭 어른과 함께, 정해진 시각보다 일찍 나와요",
                 "바닷길이나 갯벌에는 꼭 어른과 함께 가고, 정해진 시각보다 일찍 나와요.")
        self.play(FadeIn(warn), run_time=0.4)
        self.settle()
        clear_stage(self)
