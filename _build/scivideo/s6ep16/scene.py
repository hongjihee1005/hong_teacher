"""「과학 원리 돋보기」 6학년 16화 — 잎에서 양분이 만들어진다고? (6-1 3단원 식물의 구조와 기능 5차시, 화 코드 6-1-3-d)

바탕: grade6/science/sem1/u3-4.html(원본 _build_tb/src/u3-4.html) — 도입(식물은 햇빛이 잘 드는 창가), 잎의 생김새(잎몸·잎자루·잎맥),
하루 전 잎 하나에 알루미늄 포일(햇빛 받은 잎/못 받은 잎 비교), 광합성산물 확인 실험 5단계(포일 벗기기·잎자루로 구분 → 뜨거운 물 1분 →
에탄올 시험관을 뜨거운 물에 10분(초록색 색소가 빠짐) → 헹구기 → 아이오딘-아이오딘화 칼륨 용액), 결과(포일 안 씌운 잎 청람색, 씌운 잎 변화 없음,
용액은 녹말과 반응하면 청람색), 광합성 뜻, 양분의 이동 차례, 넓은 잎, 형성 평가 오답(잎에서만·잎에서만 사용 ×), 한눈에 쏙.
최종: ./make_final.sh s6ep16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform,
                   Rectangle, RoundedRectangle, Line, Circle, Rotate, VMobject)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def blue(s):
    return f'<span foreground="{K.IODINE}">{s}</span>'


def pot_plant(h=1.8):
    pot = K.poly([(-0.4, 0), (0.4, 0), (0.55, 0.55), (-0.55, 0.55)], "#D9805A", stroke="#8E4A2E", sw=3)
    pl = K.small_herb(h - 0.5, seed=3).shift([0, 0.55, 0])
    return VGroup(pl, pot)


class S6Ep16(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 16
    EP_TITLE = "잎에서 양분이 만들어진다고?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.parts()
        self.prepare()
        self.experiment()
        self.define()
        self.move()
        self.misc()
        self.summary()
        self.closing(f"식물은 빛을 이용해 이산화 탄소와 물로\n양분을 만들어요 — {o('광합성')}",
                     next_preview="6학년 17화 · 잎에 도달한 물은?")
        self.wait(0.5)

    def intro(self):
        self.section("궁금해요")
        win = VGroup(Rectangle(width=4.0, height=3.2, fill_color="#DFF3FF", fill_opacity=1, stroke_color="#8A6A44", stroke_width=8),
                     Line([0, -1.6, 0], [0, 1.6, 0], stroke_color="#8A6A44", stroke_width=6),
                     Line([-2.0, 0, 0], [2.0, 0, 0], stroke_color="#8A6A44", stroke_width=6)).move_to([-3.2, 0.7, 0])
        sn = K.sun(0.42).move_to([-4.2, 1.55, 0])
        p1 = pot_plant(1.8).move_to([-3.2, -1.1, 0])
        locker = Rectangle(width=2.8, height=3.4, fill_color="#3A3F46", fill_opacity=1, stroke_color="#22262B", stroke_width=5).move_to([3.2, 0.3, 0])
        p2 = pot_plant(1.8).move_to([3.2, -0.3, 0]).set_opacity(0.55)
        l1 = T("햇빛이 잘 드는 창가", 30).move_to([-3.2, -2.2, 0])
        l2 = T("빛이 들지 않는 사물함 안", 30).move_to([3.2, -2.2, 0])
        self.say("교실에서 식물을 어디에 두는 것이 좋을까요?", "교실에서 식물을 기를 때 어디에 놓는 것이 좋을까요?")
        self.play(FadeIn(win), FadeIn(sn), FadeIn(p1), FadeIn(locker), FadeIn(p2), FadeIn(l1), FadeIn(l2), run_time=0.9)
        self.say(f"대부분의 식물은 {o('햇빛')}이 잘 드는 곳에서 잘 자라요",
                 "대부분의 식물은 햇빛이 잘 드는 곳에서 잘 자라요. 식물이 잘 자라는 데 햇빛이 필요한 것 같아요.")
        self.play(Indicate(VGroup(win, p1), color=ORANGE, scale_factor=1.04), run_time=0.9)
        self.settle()
        clear_stage(self)

    def parts(self):
        self.section("잎의 생김새")
        lf = K.leaf_part(1.25).move_to([-2.2, 0.2, 0])
        ps = VGroup(K.pointer(lf.pt("blade"), (2.0, 1.8), "잎몸", INK, 34),
                    K.pointer(lf.pt("vein"), (2.3, 0.4), "잎맥", INK, 34),
                    K.pointer(lf.pt("stalk"), (1.6, -1.6), "잎자루", INK, 34))
        self.say(f"잎은 대부분 {o('잎몸')}과 {o('잎자루')}로 이루어져 있어요",
                 "식물의 잎은 대부분 잎몸과 잎자루로 이루어져 있고, 잎몸에는 잎맥이 있어요. 잎의 색깔은 대부분 초록색이에요.")
        self.play(FadeIn(lf), run_time=0.6)
        self.play(FadeIn(ps, lag_ratio=0.25), run_time=1.2)
        self.settle()
        clear_stage(self)

    def prepare(self):
        self.section("실험 준비")
        l1 = K.leaf_part(0.95).move_to([-2.6, 0.3, 0])
        l2 = K.leaf_part(0.95).move_to([2.6, 0.3, 0])
        fo = K.foil(l2.blade.width + 0.35, l2.blade.height + 0.35).move_to(l2.blade)
        sn = K.sun(0.4).move_to([0, 2.3, 0])
        n1 = T("포일을 씌우지 않은 잎", 30).next_to(l1, DOWN, buff=0.2)
        n2 = T("포일을 씌운 잎", 30).next_to(l2, DOWN, buff=0.2)
        self.say(f"하루 전, 잎 하나에만 {o('알루미늄 포일')}을 씌워요",
                 "실험 하루 전, 잎 하나에만 알루미늄 포일을 씌워요.")
        self.play(FadeIn(l1), FadeIn(l2), FadeIn(sn), FadeIn(n1), FadeIn(n2), run_time=0.7)
        self.play(FadeIn(fo, scale=1.1), run_time=0.6)
        self.say(f"{o('햇빛을 받은 잎')}과 {o('받지 못한 잎')}을 비교하려고요",
                 "포일을 씌운 잎은 햇빛을 받지 못해요. 햇빛을 받는지만 다르게 하고, 다른 조건은 모두 같게 해서 두 잎을 비교해요.")
        self.play(Indicate(fo, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    def experiment(self):
        self.section("실험해요")
        st = K.steps_row(["① 두 잎을 따서\n포일 벗기기", "② 뜨거운 물에\n1분", "③ 에탄올 시험관을\n뜨거운 물에 10분",
                          "④ 물에\n헹구기", "⑤ 아이오딘-아이오딘화\n칼륨 용액 떨어뜨리기"],
                         w=2.45, h=1.45, size=25, buff=0.32, accent=self.accent)
        st.scale_to_fit_width(12.4).move_to([0.35, 1.55, 0])
        self.say("다음 날 오후, 두 잎을 따서 실험해요",
                 "다음 날 오후에 두 잎을 따서 포일을 벗겨요. 포일을 씌우지 않은 잎은 잎자루를 길게, 씌운 잎은 짧게 잘라 구분해요.")
        self.play(FadeIn(st.cards[0]), run_time=0.5)
        for i in range(4):
            self.play(Create(st.arrows[i]), FadeIn(st.cards[i + 1]), run_time=0.4)
        self.settle()
        bk = K.beaker(2.2, 1.9, K.WATER, 0.7, steam=True).move_to([-3.4, -1.3, 0])
        tt = K.test_tube(1.9, 0.5, "#DDEFC0", 0.6).move_to([-3.4, -1.15, 0])
        lv = VGroup(*[K.E(0.16, 0.5, K.PALE_LEAF, -3.4 + dx, -1.4, stroke=K.LEAF_EDGE, sw=2) for dx in (-0.08, 0.08)])
        card = K.text_card([f"에탄올에 넣어 두면 잎의 {o('초록색 색소')}가 빠져나와", "잎의 색이 연해져요"], size=28).move_to([2.35, -1.2, 0])
        self.say(f"에탄올에서 잎의 {o('초록색 색소')}가 빠져 색이 연해져요",
                 "에탄올이 든 시험관을 뜨거운 물에 10분쯤 담가 두면 잎의 초록색 색소가 빠져나와 잎의 색이 연해져요.")
        self.play(FadeIn(bk), FadeIn(tt), FadeIn(lv), FadeIn(card), Indicate(st.cards[2], color=ORANGE), run_time=0.9)
        self.settle()
        warn = K.safety_note("뜨거운 물 화상 조심 · 시험관 입구는 사람이 없는 쪽 · 환기", w=11.0, size=28).move_to([0.3, 0.3, 0])
        self.say(f"시험관 입구는 {r('사람이 없는 쪽')}으로, 창문을 열어 환기해요",
                 "뜨거운 물에 화상을 입지 않도록 조심하고, 에탄올이 든 시험관 입구는 사람이 없는 쪽을 향하게 해요.")
        self.play(FadeIn(warn), run_time=0.5)
        self.settle()
        clear_stage(self)
        d1 = K.petri(1.5).move_to([-3.0, 0.35, 0])
        d2 = K.petri(1.5).move_to([3.0, 0.35, 0])
        a = K.leaf_part(0.75, K.PALE_LEAF).move_to([-3.0, 0.35, 0])
        b = K.leaf_part(0.75, K.PALE_LEAF).move_to([3.0, 0.35, 0])
        b.stalk.scale(0.45, about_edge=UP)
        n1 = T("포일을 씌우지 않은 잎", 30).next_to(d1, DOWN, buff=0.2)
        n2 = T("포일을 씌운 잎", 30).next_to(d2, DOWN, buff=0.2)
        self.say("아이오딘-아이오딘화 칼륨 용액을 떨어뜨려요",
                 "페트리 접시에 두 잎을 놓고 아이오딘-아이오딘화 칼륨 용액을 떨어뜨려요.")
        self.play(FadeIn(d1), FadeIn(d2), FadeIn(a), FadeIn(b), FadeIn(n1), FadeIn(n2), run_time=0.8)
        self.pause_screen(5, "두 잎의 색깔은 어떻게 될까요?")
        self.say(f"포일을 씌우지 않은 잎만 {blue('청람색')}으로 변해요",
                 "햇빛을 받은 잎은 청람색으로 변하고, 포일을 씌워 햇빛을 받지 못한 잎은 색깔 변화가 없어요.")
        self.play(a.blade.animate.set_fill(K.IODINE), run_time=1.4)
        r1 = T("청람색", 34, K.IODINE).next_to(n1, DOWN, buff=0.12)
        r2 = T("변화 없음", 34, SOFT).next_to(n2, DOWN, buff=0.12)
        self.play(FadeIn(r1), FadeIn(r2), run_time=0.5)
        self.settle()
        tip = K.text_card([f"아이오딘-아이오딘화 칼륨 용액은 {o('녹말')}과 반응하면 {blue('청람색')}"], size=28).move_to([0.6, 2.45, 0])
        self.say(f"햇빛을 받은 잎에서 {o('녹말')}이 만들어졌어요",
                 "이 용액은 녹말과 반응하면 청람색으로 변해요. 그러니까 햇빛을 받은 잎에서 녹말이 만들어졌어요. 양분이 만들어지려면 빛이 필요해요.")
        self.play(FadeIn(tip), run_time=0.5)
        self.settle()
        clear_stage(self)

    def define(self):
        self.section("광합성")
        sn = K.sun(0.5).move_to([-5.2, 1.0, 0])
        co = T("이산화 탄소", 34).move_to([-2.4, 1.0, 0])
        wa = T("물", 34, K.WATER_C).move_to([0.0, 1.0, 0])
        plus = VGroup(T("+", 44).move_to([-3.9, 1.0, 0]), T("+", 44).move_to([-0.9, 1.0, 0]))
        arr = K.arrow_right(0.7, 2.3, 1.0, self.accent, 8)
        lf = K.leaf_part(0.6).move_to([3.4, 1.1, 0])
        out = T("양분", 40, ORANGE).move_to([5.3, 1.0, 0])
        cap = T("빛", 30, "#C98A00").next_to(sn, DOWN, buff=0.15)
        self.say(f"빛을 이용해 이산화 탄소와 물로 양분을 만들어요 — {o('광합성')}",
                 "식물이 빛을 이용해 이산화 탄소와 물로 양분을 만드는 것을 광합성이라고 해요.")
        self.play(FadeIn(sn), FadeIn(cap), FadeIn(co), FadeIn(wa), FadeIn(plus), run_time=0.8)
        self.play(Create(arr), FadeIn(lf), FadeIn(out), run_time=0.8)
        card = K.text_card([f"광합성은 주로 {o('잎')}에서 가장 활발하게 일어나요"], size=36).move_to([0, -1.1, 0])
        self.say(f"광합성은 주로 {o('잎')}에서 가장 활발하게 일어나요", "광합성은 주로 잎에서 가장 활발하게 일어나요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def move(self):
        self.section("양분의 이동")
        st = K.steps_row(["잎에서 광합성으로\n양분을 만들어요", "양분은 녹말로\n저장돼요", "다른 형태로 바뀌어\n줄기를 통해\n식물 전체로 이동",
                          "각 기관에서 사용되고\n남은 양분은 저장돼요"], w=2.95, h=1.9, size=27, buff=0.42, accent=self.accent).move_to([0, 0.9, 0])
        self.say("잎에서 만들어진 양분은 어떻게 될까요?", "잎에서 만들어진 양분은 어떻게 될까요?")
        self.play(FadeIn(st.cards[0]), run_time=0.5)
        self.say(f"녹말로 저장되었다가 {o('줄기')}를 통해 식물 전체로 이동해요",
                 "양분은 녹말로 저장되었다가 다른 형태로 바뀌어 줄기를 통해 식물 전체로 이동해요. 각 기관에서 사용되고, 남은 양분은 저장돼요.")
        for i in range(3):
            self.play(Create(st.arrows[i]), FadeIn(st.cards[i + 1]), run_time=0.5)
        self.settle()
        q = K.text_card([f"많은 식물의 잎이 납작하고 넓은 까닭은?",
                         f"→ {o('빛을 받는 면적')}이 넓어 광합성이 잘 일어나요"], size=32).move_to([0, -1.3, 0])
        self.say(f"잎이 넓으면 {o('빛을 받는 면적')}이 넓어 광합성이 잘 일어나요",
                 "많은 식물의 잎이 납작하고 넓은 것은 빛을 받는 면적이 넓어 광합성이 잘 일어나기 때문이에요.")
        self.play(FadeIn(q, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def misc(self):
        self.section("생각 바로잡기")
        rows = [("광합성은 잎에서만 일어난다.", False, "주로 잎에서 가장 활발하지만, 잎에서만은 아니에요"),
                ("광합성으로 만든 양분은 잎에서만 사용된다.", False, "줄기를 통해 식물 전체로 이동해 사용돼요")]
        grp = VGroup()
        for t_, ok, why in rows:
            bx = RoundedRectangle(corner_radius=0.16, width=11.4, height=1.55, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=4)
            tt = T(t_, 36).move_to(bx.get_center() + UP * 0.3 + RIGHT * 0.4)
            wy = T(why, 28, GREEN).move_to(bx.get_center() + DOWN * 0.35 + RIGHT * 0.4)
            mk = K.ox_mark(ok, 0.3).move_to(bx.get_left() + RIGHT * 0.6)
            grp.add(VGroup(bx, tt, wy, mk))
        grp.arrange(DOWN, buff=0.4).move_to([0, 0.5, 0])
        self.say("이 말은 맞을까요?", "광합성에 관한 이 말들은 맞을까요?")
        self.play(*[FadeIn(VGroup(c[0], c[1])) for c in grp], run_time=0.7)
        self.wait(1.2)
        self.say(f"광합성은 {o('주로')} 잎에서 — 양분은 {g('식물 전체')}에서 쓰여요",
                 "광합성은 주로 잎에서 가장 활발하게 일어나지만 잎에서만 일어나는 것은 아니에요. 만들어진 양분은 식물 전체로 이동해 사용돼요.")
        self.play(*[FadeIn(VGroup(c[2], c[3])) for c in grp], run_time=0.8)
        self.settle()
        clear_stage(self)

    def summary(self):
        self.section("한눈에 쏙")
        sn = K.sun(0.45).move_to([-4.6, 1.2, 0])
        lf = K.leaf_part(0.8).move_to([-1.6, 0.9, 0])
        d = K.petri(1.0).move_to([1.8, 0.9, 0])
        a = K.leaf_part(0.48, K.IODINE).move_to([1.8, 0.9, 0])
        card = K.text_card([f"식물이 빛을 이용해 이산화 탄소와 물로 양분을 만드는 것을", f"{o('광합성')}이라고 합니다."], size=36).move_to([0, -1.4, 0])
        self.say(f"빛을 이용해 양분을 만드는 것을 {o('광합성')}이라고 해요",
                 "식물이 빛을 이용해 이산화 탄소와 물로 양분을 만드는 것을 광합성이라고 해요.")
        self.play(FadeIn(sn), FadeIn(lf), FadeIn(d), FadeIn(a), run_time=0.7)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
