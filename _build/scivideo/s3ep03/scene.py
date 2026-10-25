"""「과학 원리 돋보기」 3학년 3화 — 무게를 정확히 비교하려면? 용수철저울 (3-1 1단원 4·5차시, 화 코드 3-1-1-c)

바탕: grade3/science/sem1/u1-3.html(손으로 들어 보기의 한계, 전자저울 쓰는 차례 — 평평한 곳·전원·영점·올리고 읽기,
학용품 색연필 8.3 g·사인펜 9.4 g·보드 마커 14.6 g·자 11.2 g, 단위 g·kg, 생활 속 저울)
grade3/science/sem1/u1-4.html(용수철저울 0~250 g, 큰 눈금 25 g·작은 눈금 5 g, 영점 조절 나사, 표시 자가 멈추면 눈높이에서 읽기,
색연필 160 g·사인펜 120 g·고무찰흙 75 g, 너무 무거운 물체는 걸지 않기, 공을 빼면 표시 자가 위로)
최종: ./make_final.sh s3ep03
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, RoundedRectangle, VGroup, Write,
                   always_redraw, Circumscribe, LaggedStart)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, SpringScale, clear_stage, e_scale, ground, tag, zoom_reading


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def cup(color, s=1.0):
    from manim import Polygon, Arc, PI
    body = Polygon([-0.4, 0.8, 0], [0.4, 0.8, 0], [0.3, 0, 0], [-0.3, 0, 0], fill_color=PAPER, fill_opacity=1,
                   stroke_color=SOFT, stroke_width=3)
    scoop = Arc(radius=0.42, start_angle=0, angle=PI, fill_color=color, fill_opacity=1, stroke_width=0).move_to([0, 0.95, 0])
    return VGroup(scoop, body).scale(s, about_point=np.zeros(3))


def bag(name, w=1.5):
    b = RoundedRectangle(corner_radius=0.12, width=w, height=0.5, fill_color="#F3F7FB", fill_opacity=1,
                         stroke_color=BLUE, stroke_width=3)
    t = T(name, 28, INK).move_to(b)
    return VGroup(b, t)


class S3Ep03(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 3
    EP_TITLE = "무게를 정확히 비교하려면? 용수철저울"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.hands()
        self.electronic()
        self.spring_parts()
        self.spring_measure()
        self.life()
        self.closing(f"물체의 무게를 정확하게 비교하려면 {o('저울')}을 써요.\n용수철저울은 무거운 물체일수록 표시 자가 {r('더 아래')}를 가리켜요",
                     next_preview="3학년 4화 · 작은 힘으로 들어 올리는 도구의 비밀")
        self.wait(0.5)

    # ── 손으로 들어 보기 ──
    def hands(self):
        self.section("궁금해요")
        cups = VGroup(cup("#F6B5C8", 1.3), cup("#FFE9A8", 1.3), cup("#C9E7B5", 1.3)).arrange(RIGHT, buff=1.6).move_to([0, 0.6, 0])
        qs = VGroup(*[T("?", 60, ORANGE).next_to(c, UP, buff=0.25) for c in cups])
        self.say("가장 많이 담긴 아이스크림은 어느 것일까요?", "컵에 담긴 아이스크림 세 개가 있어요. 가장 많이 담긴 아이스크림을 어떻게 찾아낼 수 있을까요?")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in cups], lag_ratio=0.25), run_time=1.0)
        self.play(FadeIn(qs), run_time=0.4)
        self.say("손으로 들어 보면 정확하게 알 수 있을까?", "손으로 하나씩 들어 보거나 양손에 들고 어림해 보면, 정확하게 비교할 수 있을까요?")
        self.pause_screen(5)
        self.say(f"무게가 비슷하면 손으로는 {r('정확하게 비교하기 어려워요')}",
                 "아니요. 무게가 비슷한 물체는 손으로 들어서는 정확하게 비교할 수 없어요. 느낌은 사람마다 다를 수도 있어요.")
        self.say(f"무게를 정확하게 비교하려면 {o('저울')}이 필요해요", "그래서 무게를 정확하게 비교하려면 저울이 필요해요.")
        self.settle()
        clear_stage(self)

    # ── 전자저울 ──
    def electronic(self):
        self.section("전자저울")
        gnd = ground(-1.2, -6.3, 6.3)
        sc = e_scale("- - -").scale(1.6, about_point=np.zeros(3)).shift([-2.6, -1.2, 0])
        steps = [("① 평평한 곳에 놓아요", "전자저울은 평평한 곳에 놓고 수평을 확인해요."),
                 ("② 전원 단추를 눌러요", "전원 단추를 눌러 켜요."),
                 ("③ 영점 단추로 0을 맞춰요", "영점 단추를 눌러 화면의 숫자를 0으로 맞춰요."),
                 ("④ 물체를 올리고 숫자를 읽어요", "물체를 하나씩 올리고, 화면에 나타난 숫자를 읽어요.")]
        lst = VGroup(*[T(s, 38, INK) for s, _ in steps]).arrange(DOWN, buff=0.38, aligned_edge=LEFT).move_to([3.6, 1.4, 0])
        self.say("전자저울로 무게를 재는 차례", "전자저울로 무게를 재는 차례를 알아봐요.")
        self.play(Create(gnd), FadeIn(sc), run_time=0.8)
        for i, (s, narr) in enumerate(steps):
            self.say(s, narr)
            self.play(FadeIn(lst[i], shift=RIGHT * 0.2), run_time=0.4)
            if i == 1:
                self.play(Indicate(sc[4], scale_factor=1.6), run_time=0.6)
                self._swap(sc, "1.3")
            if i == 2:
                self.play(Indicate(sc[5], scale_factor=1.6), run_time=0.6)
                self._swap(sc, "0.0")
        self.settle()
        self.play(FadeOut(lst), run_time=0.4)
        items = [("색연필", 8.3), ("사인펜", 9.4), ("보드 마커", 14.6), ("자", 11.2)]
        results = VGroup()
        top = sc.get_top()[1] - 0.0
        self.say("학용품 네 개의 무게를 재 봐요", "학용품 네 개의 무게를 하나씩 재 볼게요.")
        for i, (nm, w) in enumerate(items):
            it = tag(nm, INK, 32).move_to([-2.6, top + 0.35, 0])
            self.play(FadeIn(it, shift=DOWN * 0.3), run_time=0.4)
            self._swap(sc, f"{w}")
            row = T(f"{nm}  {w} g", 40, INK).move_to([3.4, 2.0 - i * 0.8, 0])
            self.play(FadeIn(row), FadeOut(it), run_time=0.5)
            self._swap(sc, "0.0", 0.2)
            results.add(row)
        self.say("가장 무거운 학용품은?", "어느 학용품이 가장 무거울까요?")
        self.pause_screen(4)
        self.say(f"{r('보드 마커')}가 가장 무겁고 {g('색연필')}이 가장 가벼워요",
                 "보드 마커가 가장 무겁고, 색연필이 가장 가벼워요. 저울을 쓰니 무게를 숫자로 정확하게 비교할 수 있어요.")
        self.play(Indicate(results[2], color=RED), Indicate(results[0], color=GREEN), run_time=1.0)
        self.say(f"무게의 단위는 {o('그램(g)')}이나 {o('킬로그램(kg)')}을 써요", "무게를 나타내는 단위로는 그램이나 킬로그램을 써요.")
        self.settle()
        clear_stage(self)

    def _swap(self, sc, text, rt=0.3):
        new = T(text + " g", 30, "#7CF2A4").scale(1.6).move_to(sc.scr)
        old = sc.num
        self.play(FadeOut(old), FadeIn(new), run_time=rt)
        sc.remove(old)
        sc.add(new)
        sc.num = new

    # ── 용수철저울 이름 ──
    def spring_parts(self):
        self.section("용수철저울")
        ss = SpringScale(x=-3.2)
        self.ss = ss
        G = ss.group()
        self.say("용수철저울의 각 부분을 알아봐요", "이번에는 용수철저울이에요. 각 부분의 이름을 알아봐요.")
        self.play(FadeIn(G), run_time=0.8)
        names = [("손잡이", ss.parts["ring"].get_center()), ("영점 조절 나사", ss.parts["knob"].get_center()),
                 ("눈금", [ss.x - 0.6, ss.y_of(125), 0]), ("표시 자", [ss.x - 0.3, ss.y_of(0), 0]),
                 ("고리", [ss.x + 0.12, ss.hook_y() - 0.15, 0])]
        labs = VGroup()
        for i, (nm, p) in enumerate(names):
            lab = tag(nm, BLUE, 34).move_to([0.9, 2.7 - i * 0.95, 0])
            ln = Line(lab.get_left(), np.array(p) + RIGHT * 0.3, stroke_color=BLUE, stroke_width=3)
            labs.add(VGroup(ln, lab))
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.25), run_time=1.6)
        self.say(f"큰 눈금 한 칸은 {o('25 g')}, 작은 눈금 한 칸은 {o('5 g')}", "이 용수철저울은 큰 눈금 한 칸이 25 그램, 작은 눈금 한 칸이 5 그램을 나타내요.")
        zr = zoom_reading(50, center=(1.0, 0.6), span=30)
        zr[-1].set_opacity(0)
        self.play(FadeOut(labs), FadeIn(zr), run_time=0.6)
        self.settle()
        self.play(FadeOut(zr), run_time=0.3)
        self.say(f"{r('주의')}  고리에 찔리지 않게, 너무 무거운 물체는 걸지 않아요",
                 "고리에 찔리지 않게 조심하고, 수박처럼 너무 무거운 물체는 걸지 않아요. 용수철저울이 고장 날 수 있어요.")
        self.settle()

    # ── 용수철저울로 재기 ──
    def spring_measure(self):
        ss = self.ss
        self.section("무게 재기")
        self.say(f"① 영점 조절 나사로 표시 자를 {o('0')}에 맞춰요", "먼저 영점 조절 나사를 돌려 표시 자를 눈금 0에 맞춰요.")
        self.play(Indicate(ss.parts["knob"], scale_factor=2.0), run_time=0.8)
        self.say("② 고리에 물체를 걸고, 표시 자가 멈추면 눈높이에서 읽어요",
                 "고리에 물체를 걸고, 표시 자가 움직이지 않을 때 표시 자와 눈높이를 맞추어 눈금을 읽어요.")
        self.settle()
        items = [("색연필", 160), ("사인펜", 120), ("고무찰흙", 75)]
        rows = VGroup()
        for i, (nm, w) in enumerate(items):
            b = bag(nm)
            b.add_updater(lambda m: m.move_to(ss.hook_point() + DOWN * 0.3))
            self.say(f"{nm}을 걸면?", f"{nm}을 걸어 볼게요.")
            self.play(FadeIn(b), run_time=0.4)
            self.play(ss.w.animate.set_value(w), run_time=1.4)
            zr = zoom_reading(w, center=(0.4, 0.6), span=30)
            big_ = (w // 25) * 25
            nsm = (w - big_) // 5
            how = f"큰 눈금 {big_} g에서 작은 눈금 {nsm}칸" if nsm else f"큰 눈금 {big_} g"
            self.play(FadeIn(zr), run_time=0.4)
            self.say(f"{how} → {g(str(w) + ' g')}", f"{how}이니까, {w} 그램이에요.")
            row = T(f"{nm}  {w} g", 42, INK).move_to([3.4, 2.0 - i * 0.85, 0], aligned_edge=LEFT)
            self.play(FadeIn(row), run_time=0.4)
            rows.add(row)
            self.settle()
            b.clear_updaters()
            self.play(FadeOut(zr), FadeOut(b), ss.w.animate.set_value(0), run_time=0.8)
        self.say("가장 무거운 물체와 가장 가벼운 물체는?", "가장 무거운 물체와 가장 가벼운 물체는 무엇일까요?")
        self.pause_screen(4)
        self.say(f"{r('색연필')}이 가장 무겁고, {g('고무찰흙')}이 가장 가벼워요",
                 "색연필이 160 그램으로 가장 무겁고, 고무찰흙이 75 그램으로 가장 가벼워요. 색연필이 85 그램 더 무거워요.")
        self.play(Indicate(rows[0], color=RED), Indicate(rows[2], color=GREEN), run_time=1.0)
        self.say(f"무거운 물체일수록 용수철이 {o('더 많이 늘어나')} 표시 자가 아래로 내려가요",
                 "무거운 물체를 걸수록 용수철이 더 많이 늘어나서, 표시 자가 더 아래를 가리켜요.")
        self.play(ss.w.animate.set_value(160), run_time=1.0)
        self.play(ss.w.animate.set_value(75), run_time=0.8)
        self.play(ss.w.animate.set_value(0), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 저울 ──
    def life(self):
        self.section("생활 속 저울")
        cards = VGroup(*[tag(t, c, 40) for t, c in
                         [("정육점에서 고기를 살 때", RED), ("몸무게를 잴 때", BLUE), ("공항에서 가방을 부칠 때", ORANGE),
                          ("우체국에서 택배를 보낼 때", GREEN)]]).arrange_in_grid(2, 2, buff=(0.6, 0.6)).move_to([0, 0.6, 0])
        self.say("일상생활에서도 저울로 무게를 정확하게 비교해요",
                 "일상생활에서도 고기나 과일을 살 때, 몸무게를 잴 때, 택배나 여행 가방을 보낼 때 저울로 무게를 정확하게 재요.")
        self.play(LaggedStart(*[FadeIn(c, scale=0.9) for c in cards], lag_ratio=0.25), run_time=1.4)
        self.settle()
        clear_stage(self)
