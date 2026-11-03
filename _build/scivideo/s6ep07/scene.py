"""「과학 원리 돋보기」 6학년 7화 — 운동하는 물체의 특징 (6-1 2단원 물체의 운동 1차시, 화 코드 6-1-2-a)

바탕: grade6/science/sem1/u2-1.html(원본 _build_tb/src/u2-1.html) — 도입(나뭇가지의 새가 날아감, 굴러가는 공과 가만히 있는 공),
교실을 5초 간격으로 두 번 찍어 비교(걸어가는 친구·시곗바늘은 다른 위치, 책상·창문·화분·창밖을 보는 친구·책 읽는 친구는 같은 위치),
공원(자전거 타는 사람·오리 배·비행기·달리는 사람)과 바닷가(갈매기·배·산책하는 사람과 개), 공통점(시간이 지남에 따라 위치가 변함),
일상의 '운동'과 과학의 운동, 주차된 자동차·철봉에 가만히 매달린 것(형성 평가), 한눈에 쏙(위치).
최종: ./make_final.sh s6ep07
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, Rotate,
                   SurroundingRectangle, Line, Circle, Dot)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, person, dumbbell
import kit_s6u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def panel(title, w, h, x, y, col=SOFT):
    box = K.R(w, h, PAPER, x, y, rad=0.15, stroke=col, sw=4)
    t = K.label(title, col if col != SOFT else INK, 28).next_to(box, UP, buff=0.12)
    return VGroup(box, t)


def wall_clock(r_=0.42):
    face = Circle(radius=r_, fill_color=PAPER, fill_opacity=1, stroke_color="#33415C", stroke_width=5)
    hands = VGroup(Line([0, 0, 0], [0, r_ * 0.55, 0], stroke_color="#33415C", stroke_width=5),
                   Line([0, 0, 0], [r_ * 0.45, 0, 0], stroke_color="#33415C", stroke_width=5))
    sec = Line([0, 0, 0], [0, r_ * 0.85, 0], stroke_color=RED, stroke_width=3)
    g_ = VGroup(face, hands, sec, Dot([0, 0, 0], radius=0.04, color=RED))
    g_.sec = sec
    return g_


class S6Ep07(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 7
    EP_TITLE = "운동하는 물체의 특징"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.classroom()
        self.park()
        self.common()
        self.misc()
        self.summary()
        self.closing(f"운동하는 물체는 시간이 지남에 따라\n물체의 {o('위치')}가 변해요",
                     next_preview="6학년 8화 · 물체의 운동을 나타내기")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        L_ = panel("처음 찍은 사진", 5.6, 3.6, -3.2, 0.2)
        R_ = panel("얼마 뒤 찍은 사진", 5.6, 3.6, 3.2, 0.2)
        trees = VGroup()
        for x in (-3.2, 3.2):
            tr = K.tree(2.2).move_to([x - 0.6, 0.0, 0])
            trees.add(tr)
        b1 = K.bird(0.9).move_to([-2.85, 0.75, 0])
        b2 = K.bird(0.9, fly=True).move_to([4.9, 1.45, 0])
        self.say("사진을 찍고 난 뒤 무엇이 달라졌나요?",
                 "나무가 있는 곳을 사진으로 찍고, 얼마 뒤에 다시 찍었어요. 무엇이 달라졌나요?")
        self.play(FadeIn(L_), FadeIn(R_), FadeIn(trees), FadeIn(b1), run_time=0.8)
        self.play(FadeIn(b2, shift=UP * 0.3 + RIGHT * 0.3), run_time=0.7)
        self.settle()
        self.say(f"새는 {o('날아가')} 위치가 바뀌고, 나무는 {g('그대로')}예요",
                 "나뭇가지에 앉아 있던 새는 날아가서 위치가 바뀌었고, 나무는 그 자리에 그대로 있어요.")
        self.play(Indicate(b2, color=ORANGE, scale_factor=1.3), run_time=0.9)
        self.settle()
        clear_stage(self)
        # 공
        ground = K.R(13.0, 0.25, "#9FD07F", 0, -1.3, stroke=None)
        b_still = K.ball(0.4).move_to([-3.6, -0.78, 0])
        b_roll = K.ball(0.4).move_to([0.2, -0.78, 0])
        kid = person(2.0, BLUE).move_to([-0.9, -0.17, 0])
        t1 = T("가만히 놓여 있는 공", 30).move_to([-3.6, 1.0, 0])
        t2 = T("굴러가는 공", 30).move_to([2.6, 1.0, 0])
        self.say("가만히 있는 공과 굴러가는 공, 운동하는 물체는?",
                 "운동장에 놓인 공을 차면 공이 굴러가요. 가만히 놓여 있는 공과 굴러가는 공 중에서 운동하는 물체는 어느 것일까요?")
        self.play(FadeIn(ground), FadeIn(b_still), FadeIn(b_roll), FadeIn(kid), FadeIn(t1), run_time=0.8)
        self.play(b_roll.animate.shift(RIGHT * 4.6).rotate(-3 * PI), FadeIn(t2), run_time=1.8)
        self.settle()
        clear_stage(self)

    # ── 관찰해요: 교실 사진 두 장 ──
    def classroom(self):
        self.section("관찰해요")
        box = K.R(11.4, 4.7, "#F6EFE1", 0, 0.25, rad=0.15, stroke="#33415C", sw=5)
        board = VGroup(K.R(3.0, 1.35, "#2F5D4A", -1.4, 1.6, stroke="#8A6B4A", sw=5),
                       T("물체의 운동", 28, "#E8F5EE").move_to([-1.4, 1.6, 0]))
        clock = wall_clock().move_to([-4.6, 1.75, 0])
        win = VGroup(K.R(2.4, 1.6, "#BFE3F7", 3.5, 1.5, stroke="#8A6B4A", sw=5),
                     Line([3.5, 0.7, 0], [3.5, 2.3, 0], stroke_color="#8A6B4A", stroke_width=4))
        pot = VGroup(K.poly([(4.75, 0.55), (4.8, 0.85), (5.2, 0.85), (5.25, 0.55)], "#C9673A", sw=2),
                     K.flower("#E2573F", 0.1).move_to([5.0, 1.05, 0]))
        sill = K.R(2.7, 0.12, "#B89A72", 3.75, 0.62, stroke=None)
        looker = person(1.7, "#7A5CC2").move_to([3.4, -0.85, 0])
        desk = VGroup(K.R(2.0, 0.16, "#B88A5A", 0.0, -0.4, stroke=None),
                      K.R(0.12, 1.1, "#9B7A52", -0.85, -1.0, stroke=None), K.R(0.12, 1.1, "#9B7A52", 0.85, -1.0, stroke=None))
        reader = person(1.5, ORANGE, pose="sit").move_to([0.55, -0.85, 0])
        book = K.R(0.32, 0.22, PAPER, -0.05, -0.2, stroke=SOFT, sw=2)
        walker = person(1.75, GREEN).move_to([-4.6, -0.83, 0])
        cam = K.label("5초 간격으로 두 번 찍기", INK, 28).move_to([0, 3.0, 0])
        room = VGroup(box, board, clock, win, sill, pot, looker, desk, reader, book, walker)
        self.say(f"교실을 {o('5초 간격')}으로 두 번 찍어 비교해요",
                 "삼각대에 스마트 기기를 고정하고, 교실 모습을 5초 간격으로 두 번 찍어 비교해요.")
        self.play(FadeIn(room), FadeIn(cam), run_time=1.0)
        self.settle()
        ghost = VGroup(walker.copy().set_opacity(0.25), clock.sec.copy().set_opacity(0.3))
        self.add(ghost)
        timer = T("5초 동안", 32, RED).move_to([4.3, 3.0, 0])
        self.say("찰칵! 그리고 5초 뒤에 또 찰칵!", "찰칵! 첫 번째 사진을 찍고, 5초 뒤에 두 번째 사진을 찍어요.")
        self.play(walker.animate.shift(RIGHT * 2.7),
                  Rotate(clock.sec, angle=-PI / 6, about_point=clock[0].get_center()),
                  FadeIn(timer), run_time=2.5, rate_func=lambda t: t)
        self.settle()
        self.pause_screen(5, "5초 뒤 다른 위치에 있는 물체는?")
        h1 = SurroundingRectangle(VGroup(walker, ghost[0]), color=ORANGE, buff=0.1, stroke_width=6)
        h2 = SurroundingRectangle(clock, color=ORANGE, buff=0.08, stroke_width=6)
        self.say(f"{o('걸어가는 친구')}와 {o('시곗바늘')}은 다른 위치에 있어요",
                 "걸어가는 친구와 시곗바늘은 5초 뒤에 다른 위치에 있어요.")
        self.play(Create(h1), Create(h2), run_time=0.8)
        self.settle()
        self.say("책상·창문·화분·친구 둘은 같은 위치에 있어요",
                 "책상, 창문, 화분, 창밖을 보는 친구, 책 읽는 친구는 같은 위치에 그대로 있어요.")
        self.play(*[Indicate(m, color=GREEN, scale_factor=1.05) for m in (desk, win, pot, looker, reader)], run_time=1.0)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"운동하는 물체는 시간이 지났을 때", f"{o('다른 위치')}에 있는 물체예요"], size=40).move_to([0, 0.4, 0])
        self.say(f"운동하는 물체는 시간이 지났을 때 {o('다른 위치')}에 있어요",
                 "그래서 운동하는 물체는 시간이 지났을 때 다른 위치에 있는 물체예요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 관찰해요: 공원과 바닷가 ──
    def park(self):
        names_m = ["자전거 타는 사람", "오리 배", "비행기", "달리는 사람"]
        names_s = ["나무", "운동 기구", "의자", "의자에 앉아 책 읽는 사람"]
        b1 = K.bin_box("운동해요", 6.2, 4.5, ORANGE).move_to([-3.25, 0.05, 0])
        b2 = K.bin_box("운동하지 않아요", 6.2, 4.5, BLUE).move_to([3.25, 0.05, 0])
        cards = VGroup(*[K.word_card(n, 4.6, 0.72, size=30) for n in names_m + names_s])
        for i, c in enumerate(cards):
            c.move_to([-3.25 if i < 4 else 3.25, 1.05 - 0.88 * (i % 4), 0])
        self.say("공원의 처음 모습과 얼마 뒤 모습을 비교해요",
                 "이번에는 공원의 처음 모습과 얼마 뒤 모습을 비교해 운동하는 물체를 찾아요.")
        self.play(FadeIn(b1), FadeIn(b2), run_time=0.6)
        self.say(f"자전거·오리 배·비행기·달리는 사람은 {o('위치가 변했어요')}",
                 "자전거 타는 사람, 오리 배, 비행기, 달리는 사람은 시간이 지나며 위치가 변했어요.")
        self.play(FadeIn(cards[:4], lag_ratio=0.2), run_time=1.2)
        self.say(f"나무·운동 기구·의자·책 읽는 사람은 {g('그대로')}예요",
                 "나무, 운동 기구, 의자, 의자에 앉아 책 읽는 사람은 위치가 그대로예요. 운동하지 않는 물체예요.")
        self.play(FadeIn(cards[4:], lag_ratio=0.2), run_time=1.2)
        self.settle()
        sea = K.text_card([f"바닷가에서는 {o('갈매기, 배, 산책하는 사람과 개')}가 운동해요",
                           "등대·바위·의자에 앉아 있는 사람은 운동하지 않아요"], w=12.6, size=32).move_to([0, -0.2, 0])
        self.play(FadeOut(VGroup(b1, b2, cards)), run_time=0.5)
        self.say("바닷가에서도 찾아봐요",
                 "바닷가에서는 갈매기, 배, 산책하는 사람과 개가 운동하고, 등대와 바위, 의자에 앉아 있는 사람은 운동하지 않아요.")
        self.play(FadeIn(sea, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 정리해요: 공통점 ──
    def common(self):
        self.section("정리해요")
        q = T("운동하는 물체의 공통점은?", 44).move_to([0, 2.3, 0])
        opts = ["시간이 지남에 따라 물체의 위치가 변해요", "시간이 지남에 따라 물체의 크기가 변해요", "살아 있는 물체만 운동해요"]
        cards = VGroup(*[K.word_card(t, 10.0, 0.9, size=34) for t in opts]).arrange(DOWN, buff=0.3).move_to([0, 0.05, 0])
        self.say("교실·공원·바닷가에서 찾은 운동하는 물체의 공통점은?",
                 "교실, 공원, 바닷가에서 찾은 운동하는 물체에는 어떤 공통점이 있을까요?")
        self.play(FadeIn(q), FadeIn(cards, lag_ratio=0.15), run_time=1.0)
        self.settle()
        self.pause_screen(4, "공통점을 골라 보세요")
        mark = SurroundingRectangle(cards[0], color=GREEN, buff=0.08, stroke_width=7)
        xs = VGroup(*[K.ox_mark(False, 0.22).next_to(c, RIGHT, buff=0.2) for c in cards[1:]])
        self.say(f"시간이 지남에 따라 물체의 {o('위치')}가 변해요",
                 "운동하는 물체는 모두 시간이 지남에 따라 물체의 위치가 변해요. 비행기나 자전거처럼 살아 있지 않은 물체도 운동해요.")
        self.play(Create(mark), FadeIn(xs), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        lp = panel("일상생활의 '운동'", 5.6, 3.7, -3.2, 0.1)
        rp = panel("과학에서 말하는 운동", 5.6, 3.7, 3.2, 0.1, BLUE)
        man = person(2.0, "#E67E22").move_to([-3.2, 0.15, 0])
        db = dumbbell(0.55).move_to([-2.5, 1.2, 0])
        t1 = T("몸을 단련하는 것", 30).move_to([-3.2, -1.3, 0])
        kid = person(1.8, GREEN).move_to([1.6, 0.35, 0])
        arrow = K.arrow_right(1.6, 4.4, -0.8, RED)
        t2 = M(f"시간에 따라 {o('위치가 변하는 것')}", 30).move_to([3.2, -1.3, 0])
        self.say("몸을 단련하는 것도 '운동'이라고 하지요?",
                 "일상생활에서는 몸을 단련하는 것도 운동이라고 말해요.")
        self.play(FadeIn(lp), FadeIn(man), FadeIn(db), FadeIn(t1), run_time=0.8)
        self.play(db.animate.shift(UP * 0.35), run_time=0.4)
        self.play(db.animate.shift(DOWN * 0.35), run_time=0.4)
        self.settle()
        self.say(f"과학에서는 {o('위치가 변할 때')} 운동한다고 해요",
                 "하지만 과학에서는 시간이 지남에 따라 물체의 위치가 변할 때 물체가 운동한다고 해요. 사람이나 동물도 물체에 들어가요.")
        self.play(FadeIn(rp), FadeIn(kid), run_time=0.6)
        self.play(Create(arrow), kid.animate.shift(RIGHT * 2.6), FadeIn(t2), run_time=1.4)
        self.settle()
        clear_stage(self)
        # 주차된 자동차·철봉
        lot = K.R(5.2, 2.7, "#E9EEF2", -3.2, 0.1, rad=0.12, stroke=SOFT, sw=3)
        ptxt = T("P 주차장", 28, "#33415C").move_to([-3.2, 1.1, 0])
        lines = VGroup(Line([-4.8, -1.05, 0], [-4.8, 0.7, 0], stroke_color=PAPER, stroke_width=6),
                       Line([-1.6, -1.05, 0], [-1.6, 0.7, 0], stroke_color=PAPER, stroke_width=6))
        car = K.car_side("#2E86C1", 2.4).move_to([-3.2, -0.2, 0])
        bar = VGroup(Line([1.6, -1.2, 0], [1.6, 1.4, 0], stroke_color="#6B7C93", stroke_width=8),
                     Line([4.8, -1.2, 0], [4.8, 1.4, 0], stroke_color="#6B7C93", stroke_width=8),
                     Line([1.6, 1.3, 0], [4.8, 1.3, 0], stroke_color="#6B7C93", stroke_width=7))
        hang = person(1.7, RED).move_to([3.2, 0.2, 0])
        hang.add(Line([3.05, 0.75, 0], [2.85, 1.3, 0], stroke_color=INK, stroke_width=8),
                 Line([3.35, 0.75, 0], [3.55, 1.3, 0], stroke_color=INK, stroke_width=8))
        tl = T("주차된 자동차", 30).move_to([-3.2, -1.65, 0])
        tr = T("철봉에 가만히 매달림", 30).move_to([3.2, -1.65, 0])
        self.say("주차된 자동차, 철봉에 가만히 매달린 것은 운동일까요?",
                 "주차된 자동차는 운동하는 물체일까요? 철봉에 가만히 매달려 있는 것은 과학에서 말하는 운동일까요?")
        self.play(FadeIn(VGroup(lot, lines, ptxt, car, tl)), FadeIn(VGroup(bar, hang, tr)), run_time=0.9)
        self.settle()
        xs = VGroup(K.ox_mark(False, 0.35).move_to([-1.0, 1.6, 0]), K.ox_mark(False, 0.35).move_to([5.6, 1.6, 0]))
        self.say(f"아니요, 시간이 지나도 {r('위치가 변하지 않아요')}",
                 "둘 다 운동이 아니에요. 시간이 지나도 위치가 변하지 않기 때문이에요. 달리는 자동차는 운동하는 물체예요.")
        self.play(FadeIn(xs), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        ghost = K.ball(0.45).set_opacity(0.3).move_to([-3.0, 0.9, 0])
        b = K.ball(0.45).move_to([-3.0, 0.9, 0])
        line = Line([-4.5, 0.42, 0], [4.5, 0.42, 0], stroke_color="#9FD07F", stroke_width=10)
        tp = T("처음 위치", 28, SOFT).move_to([-3.0, 1.75, 0])
        card = K.text_card([f"운동하는 물체는 시간이 지남에 따라", f"물체의 {o('위치')}이/가 변합니다."], w=11.6, size=40).move_to([0, -1.2, 0])
        self.say(f"운동하는 물체는 시간이 지남에 따라 {o('위치')}가 변해요")
        self.play(FadeIn(line), FadeIn(ghost), FadeIn(b), FadeIn(tp), run_time=0.6)
        self.add(ghost)
        self.play(b.animate.shift(RIGHT * 6).rotate(-3 * PI), run_time=1.4)
        tq = T("나중 위치", 28, ORANGE).next_to(b, UP, buff=0.4)
        self.play(FadeIn(tq), FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
