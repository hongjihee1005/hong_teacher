"""「과학 원리 돋보기」 6학년 23화 — 지구의 공전 (6-1 4단원 지구의 운동 6차시, 화 코드 6-1-4-d)

바탕: grade6/science/sem1/u4-4.html(원본 _build_tb/src/u4-4.html) — 도입(회전목마의 말은 가운데 기둥을 중심으로,
팽이·바람개비 = 제자리에서 / 회전목마의 말·쥐불놀이의 불 = 다른 것의 둘레를, 공전의 뜻), 모형실험 준비(지구본·관측자 모형(우리나라)·
갓 없는 전등·면장갑, 전등을 등지고 서서 한밤, 자전축 같은 방향·거리 일정), 교실 모형실험(가: 칠판·시계·시간표, 나: 창문·화분,
다: 사물함·거울, 라: 창문·출입문), 지구의 공전 영상(일 년에 한 바퀴·서→동, 자전하면서 공전, 위치에 따라 밤하늘이 달라짐),
자전과 공전 비교 나누기, 생각이 한눈에(달·인공위성), 한눈에 쏙, 형성 평가 ○×.
최종: ./make_final.sh s6ep23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import math
import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker, Rotate,
                   Rectangle, RoundedRectangle, Line, DashedLine, Dot, Circle, Ellipse, always_redraw, linear)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S6Ep23(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 23
    EP_TITLE = "지구의 공전"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.prepare()
        self.room()
        self.movie()
        self.compare()
        self.think()
        self.summary()
        self.check()
        self.closing(f"지구는 {o('태양')}을 중심으로 일 년에 한 바퀴씩\n{g('서쪽에서 동쪽으로')} 공전해요",
                     next_preview="6학년 24화 · 계절마다 다른 별자리")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        car = K.carousel(1.0).move_to([-3.2, 0.3, 0])
        self.say("회전목마의 말은 무엇을 중심으로 돌고 있나요?")
        self.play(FadeIn(car), run_time=0.6)
        pole = car[2]
        ring = Ellipse(width=3.4, height=0.8, stroke_color=GREEN, stroke_width=5).move_to([-3.2, -0.6, 0])
        self.say(f"{o('가운데 세워진 기둥')}을 중심으로 돌아요",
                 "가운데 세워진 기둥을 중심으로 돌아요. 말은 돌면서 위치가 계속 달라져요.")
        self.play(Indicate(pole, color=ORANGE, scale_factor=1.1), Create(ring), run_time=1.0)
        self.settle()
        bins = VGroup(K.bin_box("제자리에서 돌아요", 5.6, 1.7, BLUE_SELF, 28), K.bin_box("다른 것의 둘레를 돌아요", 5.6, 1.7, GREEN, 28))
        bins.arrange(DOWN, buff=0.3).move_to([3.1, 0.35, 0])
        items = [("팽이", 0), ("바람개비", 0), ("회전목마의 말", 1), ("쥐불놀이의 불", 1)]
        cards = VGroup(*[K.word_card(t_, 2.5, 0.65, size=24) for t_, _ in items])
        for k, (c_, (_, b_)) in enumerate(zip(cards, items)):
            j = k % 2
            c_.move_to(bins[b_].box.get_center() + np.array([-1.35 + 2.7 * j, -0.25, 0]))
        self.say("회전하는 모습이 비슷한 것끼리 나누어요",
                 "팽이와 바람개비는 제자리에서, 회전목마의 말과 쥐불놀이의 불은 다른 것의 둘레를 돌아요.")
        self.play(FadeIn(bins), run_time=0.5)
        self.play(FadeIn(cards, lag_ratio=0.25), run_time=1.2)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"한 천체가 다른 천체의 둘레를", f"주기적으로 도는 일 = {o('공전')}"], w=10.4, size=46).move_to([0, 1.0, 0])
        sub = M(f"지구는 하루에 한 바퀴씩 {g('자전')}하면서 태양 주위를 {o('공전')}해요", 36).move_to([0, -1.0, 0])
        self.say(f"다른 천체의 둘레를 주기적으로 도는 일 = {o('공전')}",
                 "한 천체가 다른 천체의 둘레를 주기적으로 도는 일을 공전이라고 해요. 지구는 자전하면서 태양 주위를 공전해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.play(FadeIn(sub), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 실험 준비 ──
    def prepare(self):
        self.section("실험 준비")
        rules = K.text_card([f"관측자 모형은 지구본의 {o('우리나라')}에 붙여요",
                             f"{o('전등을 등지고')} 서요 → 우리나라가 한밤",
                             f"① 자전축은 {g('항상 같은 방향')}으로",
                             f"② 위치마다 우리나라가 {g('한밤')}이 되게",
                             f"③ 지구본과 전등의 {g('거리는 일정하게')}"], w=8.4, size=34).move_to([2.2, 0.35, 0])
        lp = K.lamp(1.1).move_to([-5.6, 0.6, 0])
        gl = K.globe_top(0.7, phi=0.0, sun_dir=PI, land=False).move_to([-3.7, 0.6, 0])
        self.say("지구본·관측자 모형·갓 없는 전등·면장갑을 준비해요",
                 "지구본, 관측자 모형, 갓 없는 전등, 면장갑을 준비해요.")
        self.play(FadeIn(lp), FadeIn(gl), run_time=0.6)
        self.play(FadeIn(rules[0]), FadeIn(rules[1][0:2]), run_time=0.6)
        self.say(f"전등을 등지고 서서 우리나라가 {o('한밤')}이 되게 해요",
                 "관측자 모형은 우리나라에 붙이고, 전등을 등지고 서요. 그러면 우리나라가 한밤이 돼요.")
        self.settle()
        self.say(f"자전축 방향은 같게, 전등과의 {g('거리는 일정하게')}",
                 "옮길 때 자전축은 같은 방향으로, 전등과의 거리는 일정하게 해요.")
        self.play(FadeIn(rules[1][2:]), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 교실 모형실험 ──
    def room(self):
        self.section("실험해요")
        rm = K.classroom(2.6)
        off = np.array([-3.2, 0.2, 0]) - rm.get_center()
        rm.shift(off)
        rm.pos = {k_: v_ + off for k_, v_ in rm.pos.items()}
        rm.center_pt = rm.center_pt + off
        self.say(f"지구본을 {o('가 → 나 → 다 → 라')} 위치로 옮기며 관찰해요",
                 "지구본을 가, 나, 다, 라 위치로 옮기며 관측자 모형 앞에 보이는 것을 관찰해요.")
        self.play(FadeIn(rm), run_time=0.8)
        arr = K.curved_arrow(104 * rm.k, 0.35, 1.15, "#1C6FA8", 5, center=rm.center_pt)
        dir_t = T("공전 방향", 20, "#1C6FA8").move_to(rm.center_pt + np.array([0.0, -0.45, 0]))
        self.play(Create(arr), FadeIn(dir_t), run_time=0.6)
        seen = VGroup()
        gl = None
        for i, key in enumerate(["가", "나", "다", "라"]):
            p = rm.pos[key]
            out = rm.out[key]
            new = K.globe_at(p, out, 1.25)
            u = np.array([math.cos(out), math.sin(out), 0])
            ray = Line(p + u * 0.42, p + u * 1.05, stroke_color="#FF4D4D", stroke_width=6)
            new = VGroup(new, ray)
            if gl is None:
                self.play(FadeIn(new), FadeOut(rm.marks[i]), run_time=0.5)
            else:
                self.play(FadeOut(gl), FadeIn(new), FadeOut(rm.marks[i]), run_time=0.5)
            gl = new
            row = M(f"{o(key + ' 위치')}: {K.CLASS_SEE[key]}", 34)
            seen.add(row)
            seen.arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([3.3, 0.85, 0]).align_to([1.2, 0, 0], LEFT)
            if i == 0:
                self.say(f"가 위치: {o('칠판, 시계, 시간표')}가 보여요", "가 위치에서는 칠판, 시계, 시간표가 보여요.")
            elif i == 1:
                self.say("나 위치: 창문, 화분", "나 위치로 옮기면 창문과 화분이 보여요.")
            elif i == 2:
                self.say("다 위치: 사물함, 거울", "다 위치에서는 사물함과 거울이 보여요.")
            else:
                self.say("라 위치: 창문, 출입문", "라 위치에서는 창문과 출입문이 보여요.")
            self.play(FadeIn(row), run_time=0.4)
            self.settle()
        self.settle()
        self.pause_screen(5, "보이는 모습은 어땠나요?")
        card = K.text_card([f"지구본의 {o('위치')}에 따라", f"보이는 모습이 {g('달라져요')}"], w=5.6, size=34).move_to([3.3, -1.75, 0])
        self.say(f"위치에 따라 보이는 모습이 {g('달라져요')}",
                 "위치에 따라 보이는 모습이 달라요. 지구도 공전하면서 위치가 달라지면 밤하늘에 보이는 모습이 달라져요.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 지구의 공전(영상) ──
    def movie(self):
        self.section("지구의 공전")
        cx, cy, RX, RY = 0.0, 0.25, 4.3, 2.0
        al = ValueTracker(1.5 * PI)
        bg = VGroup()
        for i in range(60):
            a = i * 6 * K.RAD
            if 0.9 < cx + 6.6 * math.cos(a) and cy + 2.75 * math.sin(a) < -2.1:
                continue          # 아래 오른쪽 '크기·거리' 알림 글과 겹치는 별은 뺌
            bg.add(Dot([cx + 6.6 * math.cos(a), cy + 2.75 * math.sin(a), 0], radius=0.035 if i % 4 else 0.055, color=SOFT))
        orbit = Ellipse(width=2 * RX, height=2 * RY, stroke_color="#7FA7BF", stroke_width=3).move_to([cx, cy, 0])
        sun = VGroup(Circle(radius=0.75, fill_color=K.SUN_Y, fill_opacity=0.3, stroke_width=0),
                     Circle(radius=0.55, fill_color=K.SUN_Y, fill_opacity=1, stroke_color=K.SUN_O, stroke_width=3),
                     T("태양", 28, "#7A4A00")).move_to([cx, cy, 0])
        note = T("※ 태양과 지구의 크기, 거리는 실제와 달라요", 20, SOFT).move_to([3.6, -2.45, 0])
        show_hot = ValueTracker(0.0)

        def epos():
            a = al.get_value()
            return np.array([cx + RX * math.cos(a), cy + RY * math.sin(a), 0])

        def earth():
            p = epos()
            out = math.atan2(p[1] - cy, p[0] - cx)
            e = K.globe_top(0.38, phi=al.get_value() * 6, sun_dir=out + PI, land=False).move_to(p)
            gg = VGroup(e)
            if show_hot.get_value() > 0.5:
                u = np.array([math.cos(out), math.sin(out), 0])
                gg.add(DashedLine(p + u * 0.45, p + u * 2.0, stroke_color=ORANGE, stroke_width=5))
            return gg

        def hot():
            gg = VGroup()
            if show_hot.get_value() < 0.5:
                return gg
            p = epos()
            out = math.atan2(p[1] - cy, p[0] - cx)
            for d in bg:
                q = d.get_center()
                a = math.atan2(q[1] - cy, q[0] - cx)
                if abs((a - out + 3 * PI) % (2 * PI) - PI) < 0.45:
                    gg.add(Dot(q, radius=0.09, color=ORANGE))
            return gg
        e = always_redraw(earth)
        h = always_redraw(hot)
        self.say(f"지구는 {o('태양')}을 중심으로 일정한 길을 따라 돌아요",
                 "지구는 태양을 중심으로 일정한 길을 따라 회전해요.")
        self.play(FadeIn(bg), Create(orbit), FadeIn(sun), FadeIn(note), run_time=1.0)
        self.add(e, h)
        arr = K.curved_arrow(1.0, -0.6, 0.6, GREEN, 5, center=[cx + RX - 1.0, cy, 0])
        lab = T("서 → 동", 26, GREEN).move_to([cx + RX + 0.85, cy + 0.2, 0])
        self.say(f"{o('일 년에 한 바퀴')}, {g('서쪽에서 동쪽으로')} — 지구의 공전",
                 "일 년에 한 바퀴씩 서쪽에서 동쪽으로 회전해요. 이것이 지구의 공전이에요.")
        self.play(FadeIn(lab), al.animate.set_value(3.5 * PI), run_time=5.0, rate_func=linear)
        self.settle()
        self.say(f"지구는 하루에 한 바퀴씩 {g('자전')}하면서 {o('공전')}해요",
                 "지구는 하루에 한 바퀴씩 자전하면서 태양 주위를 공전해요.")
        self.play(al.animate.set_value(4.2 * PI), run_time=2.0, rate_func=linear)
        self.settle()
        show_hot.set_value(1.0)
        self.say(f"지구의 {o('위치')}에 따라 밤하늘에 보이는 모습이 {g('달라져요')}",
                 "지구의 위치에 따라 밤하늘에 보이는 별들이 달라져요.")
        self.play(al.animate.set_value(5.5 * PI), run_time=5.0, rate_func=linear)
        self.settle()
        e.clear_updaters()
        h.clear_updaters()
        clear_stage(self)

    # ── 자전과 공전 비교 ──
    def compare(self):
        self.section("자전과 공전")
        bins = VGroup(K.bin_box("자전", 4.2, 3.6, BLUE_SELF, 34), K.bin_box("둘 다", 3.6, 3.6, ORANGE, 34),
                      K.bin_box("공전", 4.2, 3.6, GREEN, 34)).arrange(RIGHT, buff=0.25).move_to([0, 0.5, 0])
        rot = ["자전축을 중심으로", "하루에 한 바퀴", "낮과 밤이 번갈아"]
        rev = ["태양을 중심으로", "일 년에 한 바퀴", "위치에 따라 밤하늘이 달라짐"]
        def col(lst, bx, w, sz=24):
            c_ = VGroup(*[K.word_card(t_, w, 0.72, size=sz) for t_ in lst]).arrange(DOWN, buff=0.18)
            return c_.move_to(bx.box.get_center() + DOWN * 0.3)
        a = col(rot, bins[0], 3.8)
        b_ = col(["서쪽에서 동쪽으로", "회전해요"], bins[1], 3.2)
        c = col(rev, bins[2], 3.9, 22)
        self.say("자전일까요, 공전일까요?")
        self.play(FadeIn(bins), run_time=0.5)
        self.play(FadeIn(a, lag_ratio=0.2), run_time=0.8)
        self.say(f"자전: 자전축 중심·{o('하루에 한 바퀴')}·낮과 밤",
                 "자전은 자전축을 중심으로 하루에 한 바퀴, 낮과 밤이 번갈아 나타나요.")
        self.settle()
        self.play(FadeIn(c, lag_ratio=0.2), run_time=0.8)
        self.say(f"공전: 태양 중심·{o('일 년에 한 바퀴')}·밤하늘이 달라져요",
                 "공전은 태양을 중심으로 일 년에 한 바퀴, 위치에 따라 밤하늘이 달라져요.")
        self.settle()
        self.play(FadeIn(b_), run_time=0.6)
        self.say(f"둘 다 {g('서쪽에서 동쪽으로')} 회전해요", "자전과 공전은 모두 서쪽에서 동쪽으로 회전해요.")
        self.settle()
        clear_stage(self)

    # ── 생각해요 ──
    def think(self):
        self.section("생각해요")
        q = T("지구 주위를 공전하는 것은 무엇일까요?", 42).move_to([0, 2.2, 0])
        earth = K.earth_side(0.75, 0.5, axis=False, labels=False, korea=False).move_to([0, -0.2, 0])
        orb = Ellipse(width=6.4, height=2.6, stroke_color="#7FA7BF", stroke_width=3).move_to([0, -0.2, 0])
        moon = Circle(radius=0.32, fill_color="#D9D9D9", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([-3.2, -0.2, 0])
        sat = VGroup(Rectangle(width=0.3, height=0.3, fill_color="#B0B8C0", fill_opacity=1, stroke_color=INK, stroke_width=2),
                     Rectangle(width=0.5, height=0.18, fill_color="#2F6FD6", fill_opacity=1, stroke_color=INK, stroke_width=2).shift(LEFT * 0.42),
                     Rectangle(width=0.5, height=0.18, fill_color="#2F6FD6", fill_opacity=1, stroke_color=INK, stroke_width=2).shift(RIGHT * 0.42)
                     ).move_to([2.6, 0.75, 0])
        ml = T("달", 30).next_to(moon, DOWN, buff=0.15)
        sl = T("인공위성", 28).next_to(sat, UP, buff=0.15)
        sun = VGroup(K.sun_icon(0.4), ).move_to([5.6, 1.5, 0])
        sunx = VGroup(K.ox_mark(False, 0.3).move_to([5.6, 1.5, 0]))
        sunt = M(f"태양 {r('×')} — 지구가 태양 주위를 돌아요", 28).move_to([2.6, -2.05, 0])
        self.say("지구 주위를 공전하는 것을 모두 골라요", "지구 주위를 공전하는 것은 무엇일까요?")
        self.play(FadeIn(q), FadeIn(earth), FadeIn(orb), run_time=0.6)
        self.settle()
        self.say(f"{g('달')}과 {g('인공위성')}은 지구 주위를 공전해요",
                 "달과 인공위성은 지구 주위를 공전해요. 태양은 지구 주위를 돌지 않아요.")
        self.play(FadeIn(moon), FadeIn(ml), FadeIn(sat), FadeIn(sl), FadeIn(sun), run_time=0.6)
        self.play(FadeIn(sunx), FadeIn(sunt), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["지구가 태양을 중심으로 일 년에 한 바퀴씩", "일정한 길을 따라 회전하는 것을", f"지구의 {o('공전')}이라고 합니다."],
                           w=12.0, size=42).move_to([0, 0.5, 0])
        self.say(f"지구의 {o('공전')}", "지구가 태양을 중심으로 일 년에 한 바퀴씩 일정한 길을 따라 회전하는 것을 지구의 공전이라고 합니다.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인해요 ──
    def check(self):
        self.section("확인해요")
        items = [("⑴ 지구가 태양을 중심으로 회전한다.", True), ("⑵ 지구가 하루에 한 바퀴씩 회전한다.", False),
                 ("⑶ 지구의 위치에 따라 밤하늘에 보이는 모습이 달라진다.", True)]
        cards = VGroup(*[K.word_card(t_, 10.6, 0.95, size=30) for t_, _ in items]).arrange(DOWN, buff=0.3).move_to([0.6, 0.9, 0])
        self.say("지구의 공전 — 옳으면 ○, 옳지 않으면 ×", "옳으면 동그라미, 옳지 않으면 가위표를 골라요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.8)
        self.pause_screen(5, "○일까요, ×일까요?")
        marks = VGroup(*[K.ox_mark(ok, 0.28).next_to(c_, LEFT, buff=0.25) for c_, (_, ok) in zip(cards, items)])
        self.say(f"⑵ {r('×')} — 공전은 {o('일 년에 한 바퀴')}, 하루에 한 바퀴는 자전",
                 "둘째가 틀렸어요. 공전은 일 년에 한 바퀴예요. 하루에 한 바퀴씩 회전하는 것은 자전이에요.")
        self.play(FadeIn(marks, lag_ratio=0.2), run_time=0.8)
        self.settle()
        clear_stage(self)


BLUE_SELF = "#2F6FD6"
