"""「과학 원리 돋보기」 3학년 9화 — 동물의 특징을 본뜬 생활용품 (3-1 2단원 동물의 생활 7차시, 화 코드 3-1-2-e)

바탕: grade3/science/sem1/u2-5.html — 도입(새의 날개·개구리의 물갈퀴·두더지의 앞다리·문어의 빨판), 흡착판(둥글고 오목, 거울에 붙음)과
물놀이용 물갈퀴(손에 착용, 물을 더 많이 밀어 냄) 관찰, 어떤 동물?(문어의 빨판·개구리의 발), 조사 카드(수리 발→집게 차, 도마뱀부치 발→접착테이프,
산양 발굽→등산화, 상어 피부의 작은 돌기→전신 수영복), 교과서 속 예(두더지→굴착기, 산천어→고속 열차, 뱀→탐색구조 로봇),
좋은 점(생활을 편리하게), 한눈에 쏙(흡착판 = 문어 빨판), 생각+(하늘을 나는 로봇 — 새 날개 예시), 형성 평가 3(OX).
최종: ./make_final.sh s3ep09
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, Create, FadeIn, FadeOut, Indicate, Line, Rectangle,
                   RoundedRectangle, VGroup, Wiggle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, SKIN, clear_stage
import kit_s3u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def hand_side():
    """옆에서 본 손(헤엄치는 손) — 손가락 모음"""
    palm = RoundedRectangle(corner_radius=0.18, width=0.9, height=0.7, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=3)
    fingers = VGroup(*[RoundedRectangle(corner_radius=0.08, width=0.5, height=0.15, fill_color=SKIN, fill_opacity=1, stroke_color=INK,
                                        stroke_width=3).move_to([0.6, 0.24 - 0.16 * i, 0]) for i in range(4)])
    return VGroup(fingers, palm)


class S3Ep09(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 9
    EP_TITLE = "동물의 특징을 본뜬 생활용품"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.which()
        self.more()
        self.good()
        self.summary()
        self.check()
        self.closing(f"사람들은 {o('동물의 특징')}을 이용해 생활용품을 만들어\n우리 생활을 {g('편리하게')} 해요",
                     next_preview="3학년 마인드맵 2 · 동물의 생활")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        self.say("동물의 특징을 하나 가질 수 있다면?", "동물의 특징을 하나 가질 수 있다면, 어떤 것을 고르고 싶나요?")
        items = [("새의 날개", K.wing_pic), ("개구리의 물갈퀴", lambda: K.webbed_foot(True, K.LEAF)),
                 ("두더지의 앞다리", K.mole), ("문어의 빨판", K.octopus_arm)]
        cs = VGroup(*[K.card(n, 3.0, 2.6, 32, pic=f) for n, f in items]).arrange(RIGHT, buff=0.3).move_to([0, 0.6, 0])
        self.play(FadeIn(cs, lag_ratio=0.15), run_time=1.2)
        self.say(f"사람들은 {o('동물의 특징')}을 이용해 생활용품을 만들었어요",
                 "사람들은 이런 동물의 특징을 이용해 여러 가지 생활용품을 만들었어요. 어떤 것이 있는지 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 관찰 ──
    def observe(self):
        self.section("관찰해요")
        mirror = Rectangle(width=0.5, height=4.2, fill_color="#DDEFF8", fill_opacity=1, stroke_color="#6E8FA8", stroke_width=5).move_to([-0.6, 0.4, 0])
        shine = Line([-0.7, 1.8, 0], [-0.5, 1.2, 0], stroke_color=PAPER, stroke_width=6)
        cup = K.fit(K.suction_cup(), 1.6, 1.4).rotate(np.pi / 2).move_to([-4.0, 0.4, 0])
        name = T("흡착판", 40).move_to([-4.0, 2.2, 0])
        mt = T("거울", 32, SOFT).next_to(mirror, DOWN, buff=0.15)
        self.say(f"{o('흡착판')}은 둥글고 오목한 모양이에요", "흡착판을 관찰해요. 흡착판은 둥글고 오목한 모양이에요.")
        self.play(FadeIn(mirror), FadeIn(shine), FadeIn(mt), FadeIn(cup), FadeIn(name), run_time=0.7)
        self.say("거울에 눌러 붙였다가 잡아당겨 봐요", "흡착판을 거울에 눌러 붙인 다음, 잡아당겨 봐요.")
        tgt = mirror.get_left()[0] - cup.width / 2 + 0.05
        self.play(cup.animate.set_x(tgt), run_time=0.8)
        self.play(cup.animate.stretch(0.8, 0).set_x(tgt + 0.08), run_time=0.3)
        self.play(Wiggle(cup, scale_value=1.05, rotation_angle=0.03), run_time=0.8)
        self.say(f"잡아당겨도 잘 떨어지지 않아요 — {g('거울이나 벽에 잘 붙어요')}",
                 "잡아당겨도 잘 떨어지지 않아요. 흡착판은 거울이나 벽에 잘 붙어요.")
        self.settle()
        clear_stage(self)
        # 물갈퀴 경주
        lanes = VGroup(*[Rectangle(width=11.4, height=1.6, fill_color=K.WATER, fill_opacity=0.6, stroke_color=K.WATER_D, stroke_width=3).move_to([0.7, y, 0])
                         for y in (1.2, -0.7)])
        goal = Line([5.6, 2.1, 0], [5.6, -1.6, 0], stroke_color=RED, stroke_width=6)
        h1 = hand_side().move_to([-4.3, 1.2, 0])
        glove = K.fit(K.swim_glove(), 1.0, 1.0).rotate(-np.pi / 2).move_to([-4.3, -0.7, 0])
        t1 = T("맨손", 32).move_to([-6.3, 1.2, 0])
        t2 = T("물갈퀴", 32).move_to([-6.3, -0.7, 0])
        self.say(f"손에 끼는 {o('물놀이용 물갈퀴')}로 물을 저어 봐요", "이번에는 손에 끼는 물놀이용 물갈퀴를 끼고 같은 힘으로 물을 저어 봐요.")
        self.play(FadeIn(lanes), Create(goal), FadeIn(h1), FadeIn(glove), FadeIn(t1), FadeIn(t2), run_time=0.8)
        self.play(h1.animate.shift(RIGHT * 4.0), glove.animate.shift(RIGHT * 9.3), run_time=2.2)
        self.say(f"물갈퀴를 낀 손이 {g('먼저 도착')}했어요", "물갈퀴를 낀 손이 먼저 도착했어요!")
        self.play(Indicate(glove, color=GREEN, scale_factor=1.3), run_time=0.8)
        self.say(f"손가락 사이 막이 물을 {o('더 많이 밀어 내요')}",
                 "물갈퀴는 손가락 사이가 막으로 이어져 있어 물을 더 많이 밀어 낼 수 있어요. 그래서 물에서 빠르게 헤엄칠 때 사용해요.")
        self.settle()
        clear_stage(self)

    # ── 어떤 동물? ──
    def which(self):
        self.section("생각해요")
        cup = K.card("흡착판", 2.8, 2.1, 34, pic=K.suction_cup).move_to([-4.4, 1.2, 0])
        glv = K.card("물놀이용 물갈퀴", 2.8, 2.1, 30, pic=K.swim_glove).move_to([-4.4, -1.15, 0])
        self.say("흡착판과 물갈퀴는 어떤 동물의 특징을 이용했을까요?", "흡착판과 물놀이용 물갈퀴는 어떤 동물의 특징을 이용했을까요?")
        self.play(FadeIn(cup), FadeIn(glv), run_time=0.6)
        self.pause_screen(5, "어떤 동물의 특징을 이용했을까요?")
        oc = K.card("문어의 빨판", 2.8, 2.1, 32, pic=K.octopus_arm).move_to([4.4, 1.2, 0])
        fr = K.card("개구리의 발", 2.8, 2.1, 32, pic=lambda: K.webbed_foot(True, K.LEAF)).move_to([4.4, -1.15, 0])
        a1 = M(f"← 다른 물체에 {o('잘 붙어요')}", 32).move_to([0.0, 1.2, 0])
        a2 = M(f"← 발가락 사이 {o('물갈퀴')}", 32).move_to([0.0, -1.15, 0])
        self.say(f"흡착판은 {o('문어의 빨판')}을 이용했어요", "흡착판은 다른 물체에 잘 붙는 문어 빨판의 특징을 이용해 만들었어요.")
        self.play(FadeIn(oc, shift=LEFT * 0.3), FadeIn(a1), run_time=0.7)
        self.say(f"물놀이용 물갈퀴는 {o('개구리의 발')}을 이용했어요",
                 "물놀이용 물갈퀴는 물속에서 헤엄을 잘 치는 개구리 발의 특징을 이용해 만들었어요.")
        self.play(FadeIn(fr, shift=LEFT * 0.3), FadeIn(a2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 더 조사 ──
    def pairs(self, rows, narrs):
        grp = VGroup()
        for i, (an, af, it, itf) in enumerate(rows):
            y = 1.75 - i * 1.6
            ap = K.fit(af(), 1.5, 1.05).move_to([-5.4, y, 0])
            at = T(an, 32).move_to([-3.0, y, 0])
            ar = T("→", 48, ORANGE).move_to([-0.6, y, 0])
            ip = K.fit(itf(), 1.5, 1.05).move_to([1.5, y, 0])
            itx = T(it, 32).move_to([4.2, y, 0])
            grp.add(VGroup(ap, at, ar, ip, itx))
        for row, (sub, narr) in zip(grp, narrs):
            self.say(sub, narr)
            self.play(FadeIn(row[:2], shift=RIGHT * 0.2), run_time=0.5)
            self.play(Create(row[2]), FadeIn(row[3:], shift=RIGHT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def more(self):
        self.section("조사해요")
        self.pairs([("수리 발", K.eagle_foot, "집게 차", K.tongs_truck),
                    ("도마뱀부치 발", K.gecko, "접착테이프", K.tape_roll),
                    ("산양 발굽", K.goat_hoof, "등산화", K.hiking_boot)],
                   [(f"먹이를 놓치지 않는 {o('수리 발')} → {g('집게 차')}",
                     "먹이를 잘 잡고 놓치지 않는 수리 발의 특징을 이용해, 물건을 집어 옮기는 집게 차를 만들었어요."),
                    (f"벽에 잘 붙는 {o('도마뱀부치 발')} → {g('접착테이프')}",
                     "발바닥에 털이 있어 벽에 잘 붙는 도마뱀부치 발의 특징을 이용해 접착력이 강한 접착테이프를 만들었어요."),
                    (f"미끄러지지 않는 {o('산양 발굽')} → {g('등산화')}",
                     "바위에서 잘 미끄러지지 않는 산양 발굽의 특징을 이용해 등산화를 만들었어요.")])
        self.section("교과서 속 예")
        self.pairs([("두더지 앞다리", K.mole, "굴착기", K.excavator),
                    ("산천어", K.masu, "고속 열차", K.ktx),
                    ("뱀", K.snake, "탐색구조 로봇", K.snake_robot)],
                   [(f"땅을 잘 파는 {o('두더지 앞다리')} → {g('굴착기')}", "땅을 잘 파는 두더지 앞다리의 특징을 이용해 굴착기를 만들었어요."),
                    (f"부드러운 곡선 모양의 {o('산천어')} → {g('고속 열차')}", "부드러운 곡선 모양인 산천어의 생김새를 이용해 고속 열차를 만들었어요."),
                    (f"가늘고 긴 {o('뱀')} → {g('탐색구조 로봇')}",
                     "가늘고 긴 뱀의 생김새를 이용한 탐색구조 로봇은 사람이 들어가기 어려운 좁은 틈 사이도 자유자재로 움직여요.")])

    def good(self):
        self.section("생각해요")
        q = T("동물의 특징을 이용하면 어떤 점이 좋을까요?", 46).move_to([0, 2.1, 0])
        self.say("동물의 특징을 이용하면 어떤 점이 좋을까요?", "동물의 특징을 이용하면 어떤 점이 좋을까요?")
        self.play(FadeIn(q), run_time=0.5)
        y = VGroup(K.ox_mark(True, 0.28), T("우리 생활을 편리하게 해 줘요", 44)).arrange(RIGHT, buff=0.4).move_to([0, 0.5, 0])
        n = VGroup(K.ox_mark(False, 0.28), T("동물을 잡아서 써야 해요", 44, SOFT)).arrange(RIGHT, buff=0.4).move_to([0, -0.9, 0])
        self.say(f"우리 생활을 {g('편리하게')} 해 줘요", "동물의 특징을 이용한 생활용품은 우리 생활을 편리하게 해 줘요.")
        self.play(FadeIn(y, shift=UP * 0.2), run_time=0.6)
        self.say(f"동물을 잡는 것이 아니라 {o('생김새를 본떠')} 만들어요", "동물을 잡아서 쓰는 것이 아니라, 동물의 생김새를 본떠 만들어요.")
        self.play(FadeIn(n, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        cup = K.fit(K.suction_cup(), 2.0, 1.6).move_to([-3.6, 0.9, 0])
        arm = K.fit(K.octopus_arm(), 3.0, 1.4).move_to([3.4, 0.9, 0])
        eq = T("←", 64, ORANGE).move_to([0, 0.9, 0])
        t = M(f"흡착판은 {o('문어')} 빨판의 특징을 이용해 만든 것이에요", 42).move_to([0, -1.0, 0])
        self.say(f"흡착판은 {o('문어')} 빨판의 특징을 이용했어요", "흡착판은 문어 빨판의 특징을 이용해 만든 것이에요.")
        self.play(FadeIn(cup), FadeIn(arm), FadeIn(eq), FadeIn(t), run_time=0.8)
        self.settle()
        clear_stage(self)
        q = T("하늘을 나는 로봇을 만든다면?", 48).move_to([0, 2.0, 0])
        w = K.fit(K.swallow(), 3.2, 1.8).move_to([0, 0.2, 0])
        self.say("하늘을 나는 로봇에는 어떤 동물의 특징을 이용할까요?", "하늘을 나는 로봇을 개발하려면 어떤 동물의 특징을 이용하면 좋을까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(4, "어떤 동물의 특징을 이용할까요?")
        self.say(f"예) 하늘을 날아다니는 {o('새 날개')}의 특징을 이용해요",
                 "예를 들어 하늘을 날아다니는 새 날개의 특징을 이용할 수 있어요. 여러 가지 생각이 모두 좋아요!")
        self.play(FadeIn(w, shift=UP * 0.3), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        q = K.text_card(["“고속 열차는 뱀의 생김새를 이용해 만들었다.”"], size=44).move_to([0, 1.6, 0])
        self.say("맞으면 ○, 틀리면 ×", "맞으면 동그라미, 틀리면 가위표를 골라요. 고속 열차는 뱀의 생김새를 이용해 만들었다.")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(4, "○일까요, ×일까요?")
        x = K.ox_mark(False, 0.55).move_to([0, -0.1, 0])
        self.play(FadeIn(x, scale=1.4), run_time=0.5)
        t = M(f"고속 열차는 {o('산천어')}의 부드러운 곡선 모양을 이용했어요", 40).move_to([0, -1.5, 0])
        self.say(f"× — 고속 열차는 {o('산천어')}의 생김새를 이용했어요",
                 "틀린 말이에요. 고속 열차는 부드러운 곡선 모양인 산천어의 생김새를 이용했어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.settle()
        clear_stage(self)
