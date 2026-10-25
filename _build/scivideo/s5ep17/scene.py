"""「과학 원리 돋보기」 5학년 17화 — 음식물은 어떻게 될까? (5-1 4단원 우리 몸의 구조와 기능 3차시, 화 코드 5-1-4-b)

바탕: grade5/science/sem1/u4-2.html(원본 _build_tb/src/u4-2.html) — 도입(똥 = 소화되고 남은 찌꺼기, 음식물에서 영양소),
소화·소화기관 뜻, 소화기관 이름(입·식도·위·작은창자·큰창자·항문, 간·쓸개·이자), 생김새와 하는 일,
소화 과정 모형(음식물이 이동하며 잘게 쪼개짐), 이동 경로, 간·쓸개·이자, 생각 바로잡기(먹고 바로 똥 X), 한눈에 쏙.
최종: ./make_final.sh s5ep17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker, always_redraw,
                   Circle, Dot, Arrow, LaggedStart, MoveAlongPath, Transform, linear)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


# 음식물이 지나가는 길(앱 좌표) — 입 → 식도 → 위 → 작은창자 → 큰창자 → 항문
ROUTE = {
    'mouth': [(160, 84), (160, 92)],
    'eso': [(160, 92), (160, 128), (164, 156), (176, 184)],
    'stomach': [(176, 184), (190, 200), (204, 210), (200, 222), (184, 236)],
    'small': [(184, 236), (150, 252), (138, 262), (186, 262), (192, 268), (186, 274), (138, 274), (132, 280), (138, 286),
              (186, 286), (192, 292), (186, 298), (140, 298)],
    'large': [(140, 298), (122, 308), (120, 256), (129, 247), (197, 247), (206, 256), (206, 300), (182, 318), (163, 320)],
    'anus': [(163, 320), (161, 334), (161, 346)],
}
ORDER = ['mouth', 'eso', 'stomach', 'small', 'large', 'anus']
NAME = {'mouth': '입', 'eso': '식도', 'stomach': '위', 'small': '작은창자', 'large': '큰창자', 'anus': '항문'}
# 이름표: (가리키는 점(앱 좌표), 이름표 쪽 (dx, dy))
LAB = {'mouth': ((150, 84), (-2.0, 0.3)), 'eso': ((160, 118), (-2.3, -0.15)), 'stomach': ((214, 206), (1.9, 0.55)),
       'small': ((186, 286), (2.0, -0.35)), 'large': ((122, 285), (-1.6, -0.3)), 'anus': ((161, 338), (1.7, -0.75)),
       'liver': ((110, 196), (-1.6, -0.05)), 'gall': ((150, 218), (-2.6, -0.6)), 'pancreas': ((210, 233), (2.0, -0.05))}


class S5Ep17(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 17
    EP_TITLE = "음식물은 어떻게 될까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.names()
        self.jobs()
        self.model()
        self.helpers()
        self.myth()
        self.summary()
        self.closing(f"음식물을 잘게 쪼개 영양소를 몸속으로\n흡수하는 기관을 {g('소화기관')}이라고 해요",
                     next_preview="5학년 18화 · 혈액은 어떻게 온몸을 돌까?")
        self.wait(0.5)

    def body(self, x=-3.6, h=5.6):
        return K.body(K.DIGEST, h=h).move_to([x, 0.15, 0])

    def lab(self, b, key, size=28, col=None):
        (x, y), (dx, dy) = LAB[key]
        p = K.vpt(b, x, y)
        name = NAME.get(key, {'liver': '간', 'gall': '쓸개', 'pancreas': '이자'}.get(key))
        return K.pointer(p, p + RIGHT * dx + UP * dy, name, col or K.NAVY, size)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        q1 = K.text_card(["똥은 무엇으로 만들어질까요?"], w=8.0, size=42).move_to([0, 1.6, 0])
        self.say("똥은 무엇으로 만들어질까요?", "우리가 매일 누는 똥은 무엇으로 만들어질까요?")
        self.play(FadeIn(q1), run_time=0.6)
        self.pause_screen(5, "똥은 무엇으로 만들어질까요?")
        a1 = K.text_card([f"음식물이 {o('소화')}되고 남은 {o('음식물 찌꺼기')}"], w=9.4, size=38).move_to([0, 0.2, 0])
        self.say(f"음식물이 소화되고 남은 {o('찌꺼기')}가 똥이 돼요",
                 "우리가 먹은 음식물이 소화되고 남은 찌꺼기가 똥이 돼요.")
        self.play(FadeIn(a1, shift=UP * 0.2), run_time=0.6)
        a2 = K.text_card([f"음식물에서 몸에 필요한 {g('영양소')}를 얻어요"], w=9.4, size=38).move_to([0, -1.3, 0])
        self.say(f"음식물을 먹는 까닭은 {g('영양소')}를 얻기 위해서예요",
                 "우리가 음식물을 먹어야 하는 까닭은 음식물에서 몸에 필요한 영양소를 얻기 때문이에요.")
        self.play(FadeIn(a2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        self.play(FadeOut(VGroup(q1, a1, a2)), run_time=0.5)
        d = K.text_card([f"영양소를 흡수할 수 있도록 음식물을 잘게 쪼개는 과정 → {o('소화')}",
                         f"소화를 담당하는 기관 → {g('소화기관')}"], w=12.4, size=38).move_to([0, 0.6, 0])
        self.say(f"음식물을 잘게 쪼개는 과정이 {o('소화')}, 담당하는 기관이 {g('소화기관')}이에요",
                 "음식물 속의 영양소를 몸에서 흡수할 수 있도록 음식물을 잘게 쪼개는 과정을 소화라고 하고, 이를 담당하는 기관을 소화기관이라고 해요.")
        self.play(FadeIn(d), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 소화기관 이름 ──
    def names(self):
        self.section("소화기관")
        b = self.body(x=0, h=5.7)
        self.say("소화기관 그림에서 이름을 붙여 봐요", "소화기관 그림을 보며 이름을 붙여 봐요.")
        self.play(FadeIn(b), run_time=0.7)
        labs = {k: self.lab(b, k, 30) for k in ORDER}
        self.say(f"{o('입 · 식도 · 위 · 작은창자 · 큰창자 · 항문')}",
                 "입, 식도, 위, 작은창자, 큰창자, 항문이 있어요.")
        self.play(LaggedStart(*[FadeIn(labs[k]) for k in ORDER], lag_ratio=0.5), run_time=3.0)
        more = {k: self.lab(b, k, 26, SOFT) for k in ('liver', 'gall', 'pancreas')}
        self.say(f"{o('간 · 쓸개 · 이자')}도 함께 보여요", "그리고 간, 쓸개, 이자도 함께 보여요.")
        self.play(*[FadeIn(m) for m in more.values()], run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생김새와 하는 일 ──
    def jobs(self):
        self.section("생김새와 하는 일")
        b = self.body(x=-3.2)
        self.play(FadeIn(b), run_time=0.6)
        items = [
            ('mouth', None, ["이로 잘게 부수고,", "혀로 침과 섞어 물러지게 해요"], "이로 잘게 부수고, 혀로 침과 섞어 물러지게 해요",
             "입은 음식물을 이로 잘게 부수고, 혀로 침과 섞어 물러지게 해요."),
            ('eso', "긴 관 모양", ["음식물이 위로 이동하는", "통로예요"], "음식물이 위로 이동하는 통로예요",
             "식도는 긴 관 모양이에요. 음식물이 위로 이동하는 통로예요."),
            ('stomach', "볼록한 주머니 모양", ["소화를 돕는 액체를 분비해", "음식물을 잘게 쪼개요"], "소화를 돕는 액체를 분비해 음식물을 잘게 쪼개요",
             "위는 볼록한 주머니 모양이에요. 소화를 돕는 액체를 분비해 음식물을 잘게 쪼개요."),
            ('small', "가늘고 구불구불한 관", ["음식물을 더 잘게 쪼개고,", "영양소와 대부분의 수분을 흡수해요"], "더 잘게 쪼개고, 영양소와 대부분의 수분을 흡수해요",
             "작은창자는 가늘고 구불구불한 관 모양이에요. 음식물을 더 잘게 쪼개고, 영양소와 대부분의 수분을 흡수해요."),
            ('large', "굵은 관, 작은창자 바깥쪽", ["음식물 찌꺼기에서", "수분을 흡수해요"], "음식물 찌꺼기에서 수분을 흡수해요",
             "큰창자는 작은창자 바깥쪽에 있는 굵은 관 모양이에요. 음식물 찌꺼기에서 수분을 흡수해요."),
            ('anus', None, ["음식물 찌꺼기를", "몸 밖으로 내보내요"], "음식물 찌꺼기를 몸 밖으로 내보내요",
             "항문은 흡수되지 않고 남은 음식물 찌꺼기를 몸 밖으로 내보내요."),
        ]
        cur = None
        for key, shape, lines, job, narr in items:
            lab = self.lab(b, key, 30)
            head = [f"{o(NAME[key])}"] + ([f'<span foreground="{SOFT}">{shape}</span>'] if shape else [])
            card = K.text_card(head + lines, w=5.9, size=36).move_to([4.0, 0.4, 0])
            self.say(f"{o(NAME[key])}: {job}", narr)
            pts = K.path_pts(b, ROUTE[key])
            glow = K.polyline(pts, ORANGE, 12).set_stroke(opacity=0.75)
            new = VGroup(lab, card, glow)
            if cur is None:
                self.play(FadeIn(new), run_time=0.6)
            else:
                self.play(FadeOut(cur), FadeIn(new), run_time=0.6)
            cur = new
        self.settle()
        clear_stage(self)

    # ── 소화 과정 모형 ──
    def model(self):
        self.section("소화 과정 모형")
        b = self.body()
        self.say("소화 과정 모형으로 음식물의 모습을 살펴봐요",
                 "소화기관 도안 안에 소화 과정 막대를 넣고 천천히 내리면, 구멍으로 음식물의 모습이 보여요. 음식물은 어떻게 달라질까요?")
        self.play(FadeIn(b), run_time=0.6)
        self.settle()
        self.pause_screen(5, "음식물의 모습은 어떻게 달라질까요?")
        win_c = np.array([3.4, 0.6, 0])
        win = Circle(radius=1.55, fill_color=PAPER, fill_opacity=1, stroke_color=self.accent, stroke_width=6).move_to(win_c)
        self.play(FadeIn(win), run_time=0.4)
        sizes = {'mouth': (7, 0.32), 'eso': (10, 0.26), 'stomach': (18, 0.17), 'small': (34, 0.09), 'large': (14, 0.13), 'anus': (10, 0.13)}
        cols = {'large': "#9C6B3E", 'anus': "#7A4F2A"}
        notes = {'mouth': "입에서 잘게 부숴요", 'eso': "식도를 지나 위로", 'stomach': "위에서 잘게 쪼개요",
                 'small': "더 잘게 쪼개고 영양소·수분 흡수", 'large': "찌꺼기에서 수분 흡수", 'anus': "찌꺼기 → 몸 밖으로"}
        food = Dot(K.vpt(b, 160, 84), radius=0.11, color="#8A5A2B")
        self.add(food)
        cur = None
        tag = None
        for i, key in enumerate(ORDER):
            n, sz = sizes[key]
            bits = K.food_bits(n, sz, seed=i + 3, col=cols.get(key, "#D9A066"), w=1.9, h=1.6).move_to(win_c)
            nt = T(NAME[key], 38, self.accent).move_to(win_c + DOWN * 2.05)
            nt2 = T(notes[key], 28).move_to(win_c + DOWN * 2.55)
            new = VGroup(bits, nt, nt2)
            pth = K.polyline(K.path_pts(b, ROUTE[key]), ORANGE, 1)
            if key == 'mouth':
                self.say(f"{o('입')}에서 음식물을 잘게 부숴요",
                         "입에서 음식물을 이로 잘게 부숴요.")
            elif key == 'stomach':
                self.say(f"{o('위')}와 {o('작은창자')}를 지나며 점점 더 {o('잘게')} 쪼개져요",
                         "식도를 지나 위와 작은창자를 지나며 음식물은 점점 더 잘게 쪼개져요.")
            elif key == 'large':
                self.say(f"남은 {o('찌꺼기')}는 큰창자를 지나 항문으로 나가요",
                         "흡수되지 않고 남은 찌꺼기는 큰창자에서 수분이 흡수된 뒤, 항문을 통해 몸 밖으로 나가요.")
            if cur is not None:
                self.play(FadeOut(cur), run_time=0.2)
            anims = [MoveAlongPath(food, pth, rate_func=linear), FadeIn(new)]
            self.play(*anims, run_time=1.4 if key in ('small', 'large') else 0.9)
            cur = new
        self.say(f"음식물은 소화기관을 이동하면서 {g('잘게')} 쪼개져요",
                 "음식물은 소화기관을 이동하면서 잘게 쪼개져요.")
        self.settle()
        clear_stage(self)

    # ── 이동 경로 · 간 쓸개 이자 ──
    def helpers(self):
        self.section("이동 경로")
        chain = VGroup()
        for i, k in enumerate(ORDER):
            chain.add(K.label(NAME[k], self.accent if k != 'anus' else "#7A3F24", 36))
        chain.arrange(RIGHT, buff=0.55).move_to([0, 2.1, 0])
        arrs = VGroup(*[Arrow(chain[i].get_right(), chain[i + 1].get_left(), buff=0.08, color=ORANGE, stroke_width=6,
                              max_tip_length_to_length_ratio=0.4) for i in range(5)])
        self.say(f"입 → 식도 → 위 → 작은창자 → 큰창자 → 항문",
                 "음식물은 입, 식도, 위, 작은창자, 큰창자를 거치며 소화되고, 남은 찌꺼기는 항문으로 나가요.")
        for i in range(6):
            self.play(FadeIn(chain[i], shift=RIGHT * 0.2), *( [Create(arrs[i - 1])] if i else []), run_time=0.4)
        b = K.body(K.DIGEST, h=4.4).move_to([-2.8, -0.65, 0])
        hl = VGroup(*[self.lab(b, k, 26, "#2E7D4F") for k in ('liver', 'gall', 'pancreas')])
        card = K.text_card([f"{g('간 · 쓸개 · 이자')}", "음식물이 지나가지는 않지만", "소화를 돕는 소화기관이에요"],
                           w=6.0, size=34).move_to([3.6, -0.75, 0])
        self.say(f"{g('간, 쓸개, 이자')}는 음식물이 지나가지 않지만 소화를 도와요",
                 "간, 쓸개, 이자는 음식물이 지나가지는 않지만, 소화를 돕는 액체를 만들거나 내보내서 소화를 도와요.")
        self.play(FadeIn(b), FadeIn(hl), FadeIn(card), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def myth(self):
        self.section("생각 바로잡기")
        s1 = K.text_card(["음식물을 먹고 바로 똥이 나오면", "방금 먹은 음식이 소화가 잘된 것이에요."], w=10.4, size=38).move_to([0.5, 0.9, 0])
        self.say("먹자마자 똥이 나오면, 방금 먹은 음식이 소화가 잘된 걸까요?",
                 "음식물을 먹고 바로 똥이 나오면, 방금 먹은 음식이 소화가 잘된 것일까요?")
        self.play(FadeIn(s1), run_time=0.6)
        self.pause_screen(5, "맞을까요, 틀릴까요?")
        x1 = K.ox_mark(False, 0.4).next_to(s1, LEFT, buff=0.3)
        a = K.text_card([f"찌꺼기가 되려면 보통 {o('16시간')} 넘게 걸려요",
                         "먹자마자 나오는 것은 큰창자에 있던 찌꺼기예요"], w=10.4, size=34).move_to([0.5, -1.2, 0])
        self.say(f"아니에요. 찌꺼기가 되기까지 {o('오랜 시간')}이 걸려요",
                 "아니에요. 먹은 음식물이 소화기관을 지나 찌꺼기가 되려면 보통 16시간 넘게 걸려요. 밥을 먹자마자 나오는 것은 큰창자에 있던 찌꺼기예요.")
        self.play(Create(x1), FadeIn(a), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        b = self.body(x=-4.2, h=5.4)
        card = K.text_card(["음식물을 잘게 쪼개", "영양소를 몸속으로 흡수하는", f"기관을 {g('소화기관')}이라고 합니다."],
                           w=7.0, size=44).move_to([2.6, 0.5, 0])
        self.say(f"음식물을 잘게 쪼개 영양소를 흡수하는 기관이 {g('소화기관')}이에요",
                 "음식물을 잘게 쪼개 영양소를 몸속으로 흡수하는 기관을 소화기관이라고 해요. 영양소와 수분은 몸속으로 흡수되고, 나머지는 항문을 통해 몸 밖으로 나가요.")
        self.play(FadeIn(b), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
