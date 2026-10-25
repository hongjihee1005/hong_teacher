"""「과학 원리 돋보기」 4학년 28화 — 온도와 기체의 부피 (4-2 3단원 여러 가지 기체 3차시, 화 코드 4-2-3-b)

바탕: grade4/science/sem2/u3-2.html(원본 _build_tb/src2/u3-2.html) — 도입(유리병 입구 비눗물 막 + 따뜻한 손 → 막이 부풂,
까닭: 병 안 공기의 온도가 높아져 부피가 늘어남, '기체의 부피' = 기체가 차지하는 공간의 크기), 실험해요(고무풍선을 씌운 집기병을
뜨거운 물 → 부풀어 오름 / 꺼내 닦고 얼음물 → 쪼그라들어 집기병 안으로, 안전: 뜨거운 물·실험용 장갑·유리 기구·얼음 맨손 금지),
정리해요(일정한 양의 공기, 온도↑ 부피↑ · 온도↓ 부피↓, 다르게 한 조건 = 공기의 온도), 생활 속 예 6가지(탁구공·페트병·비치 볼·
과자 봉지·비닐 랩·열기구), 한눈에 쏙 '기체는 온도에 따라 부피가 달라집니다', 형성 평가 서술형(겨울철 타이어).
최종: ./make_final.sh s4ep28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Arrow,
                   ValueTracker, always_redraw, rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="{BLUE}">{s}</span>'


JS = 0.8   # 집기병 크기(정리 화면)
JL = 0.95  # 실험 화면


class S4Ep28(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 28
    EP_TITLE = "온도와 기체의 부피"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.lab()
        self.result()
        self.life()
        self.summary()
        self.closing(f"온도가 높아지면 기체의 부피는 {r('늘어나고')},\n온도가 낮아지면 {bl('줄어들어요')}",
                     next_preview="4학년 29화 · 압력과 기체의 부피")
        self.wait(0.5)

    # ── 궁금해요: 비눗물 막 ──
    def intro(self):
        self.section("궁금해요")
        k = ValueTracker(0.0)
        pos = np.array([-2.6, 0.4, 0])
        bot = always_redraw(lambda: K.soap_bottle(k.get_value()).scale(1.5).move_to(pos + UP * 0.12 * k.get_value(), aligned_edge=DOWN).shift(DOWN * 1.9))
        film_lab = T("비눗물 막", 28, "#9B4FB8").move_to([0.4, 1.55, 0])
        self.say("유리병 입구에 비눗물을 묻혀 막을 만들어요", "유리병 입구에 비눗물을 묻혀 얇은 막을 만들었어요.")
        self.add(bot)
        self.play(FadeIn(film_lab), run_time=0.5)
        hands = K.warm_hands().scale(1.5).move_to([-2.6, -0.55, 0])
        self.say(f"병을 {o('따뜻한 손')}으로 감싸면 어떻게 될까요?", "이 병을 따뜻한 손으로 감싸면 어떻게 될까요?")
        self.play(FadeIn(hands), run_time=0.6)
        self.pause_screen(5, "비눗물 막은 어떻게 될까요?")
        self.play(k.animate.set_value(1.0), run_time=2.0, rate_func=rate_functions.smooth)
        self.say(f"비눗물 막이 {r('부풀어 올라요')}", "비눗물 막이 볼록하게 부풀어 올랐어요.")
        self.settle()
        why = K.text_card([f"손의 따뜻한 기운으로 병 안 공기의 {o('온도가 높아져')}",
                           f"공기의 {r('부피가 늘어났어요')}"], w=7.4, size=32).move_to([3.0, 0.4, 0])
        self.play(FadeOut(film_lab), FadeIn(why), run_time=0.6)
        self.say(f"병 안 공기의 온도가 높아져 {r('부피가 늘어났어요')}",
                 "손의 따뜻한 기운으로 병 안 공기의 온도가 높아져, 공기가 차지하는 공간이 커졌어요.")
        self.settle()
        df = K.text_card([f"{g('기체의 부피')}: 기체가 차지하는 공간의 크기"], w=7.4, size=32, stroke=GREEN).next_to(why, DOWN, buff=0.35)
        self.play(FadeIn(df), run_time=0.5)
        self.say(f"기체가 차지하는 공간의 크기를 {g('기체의 부피')}라고 해요",
                 "기체가 차지하는 공간의 크기를 기체의 부피라고 해요.")
        self.settle()
        bot.clear_updaters()
        clear_stage(self)

    # ── 실험해요 ──
    def lab(self):
        self.section("실험해요")
        base = -2.3
        hot = K.tank("hot").move_to([-3.6, base, 0], aligned_edge=DOWN)
        ice = K.tank("ice").move_to([3.6, base, 0], aligned_edge=DOWN)
        hl = T("뜨거운 물", 34, RED).move_to([-3.6, 1.4, 0])
        il = T("얼음물", 34, BLUE).move_to([3.6, 1.4, 0])
        k = ValueTracker(0.0)
        jx = ValueTracker(0.0)
        jy = ValueTracker(-1.2)
        jar = always_redraw(lambda: K.jar_balloon(k.get_value()).scale(JL, about_point=np.array([0, 0, 0]))
                            .shift([jx.get_value(), jy.get_value(), 0]))
        self.say("집기병 입구에 고무풍선을 씌우고 고무줄로 고정해요",
                 "집기병 입구에 고무풍선을 씌우고 고무줄로 고정했어요.")
        self.add(jar)
        self.play(FadeIn(hot), FadeIn(ice), FadeIn(hl), FadeIn(il), run_time=0.7)
        safe = K.safety_note("뜨거운 물에 데지 않게 조심하고 실험용 장갑을 껴요. 얼음을 맨손으로 만지지 않아요.",
                             w=11.6, size=26).move_to([0.4, 2.25, 0])
        self.say(f"{r('뜨거운 물')}을 쓰니 실험용 장갑을 꼭 껴요",
                 "뜨거운 물에 데지 않게 조심하고, 실험복, 보안경, 실험용 장갑을 꼭 껴요. 유리 기구가 깨지지 않게 조심해요.")
        self.play(FadeIn(safe), run_time=0.5)
        self.settle()
        self.say(f"집기병을 {r('뜨거운 물')}에 넣으면 고무풍선은?", "집기병을 뜨거운 물이 든 수조에 넣으면 고무풍선은 어떻게 될까요?")
        self.play(jx.animate.set_value(-3.6), jy.animate.set_value(base + 0.08), run_time=1.0)
        self.pause_screen(5, "고무풍선은 어떻게 될까요?")
        self.play(k.animate.set_value(1.0), run_time=2.2, rate_func=rate_functions.smooth)
        self.say(f"고무풍선이 {r('부풀어 올라요')}", "고무풍선이 볼록하게 부풀어 올랐어요.")
        self.settle()
        self.say(f"꺼내서 바깥 면을 닦고 {bl('얼음물')}에 넣으면?",
                 "이번에는 집기병을 꺼내 바깥 면을 수건으로 닦고, 얼음물이 든 수조에 넣어 봐요.")
        self.play(jy.animate.set_value(-1.0), run_time=0.6)
        self.play(jx.animate.set_value(3.6), k.animate.set_value(0.0), run_time=1.2)
        self.play(jy.animate.set_value(base + 0.08), run_time=0.6)
        self.pause_screen(5, "이번에는 어떻게 될까요?")
        self.play(k.animate.set_value(-1.0), run_time=2.2, rate_func=rate_functions.smooth)
        self.say(f"고무풍선이 {bl('쪼그라들어')} 집기병 안으로 들어가요",
                 "고무풍선이 쪼그라들어 집기병 안으로 조금 들어갔어요.")
        self.settle()
        jar.clear_updaters()
        clear_stage(self)

    # ── 정리해요 ──
    def result(self):
        self.section("정리해요")
        def jar_dots(kk, x, n=22):
            j = K.jar_balloon(kk).scale(JS, about_point=np.array([0, 0, 0]))
            top = 2.4 * JS + (0.12 + 0.85 * kk) * JS * 0.7 if kk > 0 else 2.4 * JS - 0.4 * (-kk) * JS
            d = K.air_in(-0.48, 0.48, 0.12, max(1.4, top), n=n, seed=9)
            return VGroup(j, d).shift([x, -2.2, 0])
        A = jar_dots(1.0, -4.3)
        B = jar_dots(-1.0, 4.3)
        ta = VGroup(T("온도가 높아지면", 34), M(f"부피가 {r('늘어나요')}", 34)).arrange(DOWN, buff=0.15).move_to([-4.3, 1.25, 0])
        tb = VGroup(T("온도가 낮아지면", 34), M(f"부피가 {bl('줄어들어요')}", 34)).arrange(DOWN, buff=0.15).move_to([4.3, 1.25, 0])
        note = T("집기병과 고무풍선 안에는 일정한 양의 공기가 들어 있어요", 30, SOFT).move_to([0.4, 2.3, 0])
        self.say("고무풍선의 변화는 집기병 속 공기의 부피 변화를 보여 줘요",
                 "집기병과 고무풍선 안에는 일정한 양의 공기가 들어 있어요. 고무풍선의 변화는 그 공기의 부피 변화를 보여 줘요.")
        self.play(FadeIn(A), FadeIn(B), FadeIn(note), run_time=0.7)
        self.say(f"온도가 높아지면 부피가 {r('늘어나고')}, 낮아지면 {bl('줄어들어요')}",
                 "온도가 높아지면 기체의 부피는 늘어나고, 온도가 낮아지면 기체의 부피는 줄어들어요.")
        self.play(FadeIn(ta), run_time=0.5)
        self.play(FadeIn(tb), run_time=0.5)
        self.settle()
        cond = K.text_card([f"다르게 한 조건: {o('공기의 온도')}",
                            "같게 한 조건: 집기병·고무풍선·공기의 양"], w=6.2, size=26).move_to([0, -0.9, 0])
        self.play(FadeIn(cond), run_time=0.5)
        self.say(f"이 실험에서 다르게 한 조건은 {o('공기의 온도')}예요",
                 "이 실험에서는 공기의 온도만 다르게 하고, 집기병, 고무풍선, 공기의 양은 같게 했어요.")
        self.settle()
        clear_stage(self)

    # ── 생활 속 예 ──
    def life(self):
        self.section("생활 속 예")
        items = [
            ("찌그러진 탁구공 → 뜨거운 물", lambda: K.pingpong(True), lambda: K.pingpong(False), True, "탁구공이 펴져요"),
            ("물이 조금 남은 페트병 → 냉장고", lambda: K.pet_crushed(False), lambda: K.pet_crushed(True), False, "페트병이 찌그러져요"),
            ("비치 볼 → 뜨거운 해변", lambda: K.beach_ball().scale(0.8), lambda: K.beach_ball().scale(1.0), True, "비치 볼이 부풀어요"),
            ("과자 봉지 → 햇빛 비치는 곳", lambda: K.snack_bag(0.0), lambda: K.snack_bag(1.0), True, "과자 봉지가 부풀어요"),
            ("랩 씌운 뜨거운 음식 → 냉장고", lambda: K.wrap_bowl(False), lambda: K.wrap_bowl(True), False, "랩이 오목해져요"),
            ("열기구 속 공기를 가열", lambda: K.hot_balloon().scale(0.75), lambda: K.hot_balloon().scale(1.0), True, "풍선 부분이 부풀어요"),
        ]
        cards, after = VGroup(), []
        for i, (q, f0, f1, up, res) in enumerate(items):
            x = -4.35 + 4.35 * (i % 3)
            y = 1.35 if i < 3 else -1.15
            box = K.R(4.1, 2.35, PAPER, x, y, rad=0.16, stroke=SOFT, sw=4)
            qt = T(q, 24).move_to([x, y + 0.9, 0])
            if qt.width > 3.9:
                qt.scale_to_fit_width(3.9)
            p0, p1 = f0(), f1()
            s0 = min(1.5 / p0.width, 1.05 / p0.height, 1.9 / p1.width, 1.25 / p1.height)
            p0.scale(s0).move_to([x, y + 0.05, 0])
            p1.scale(s0).move_to([x, y + 0.05, 0])
            rt = M((r if up else bl)(("↑ " if up else "↓ ") + res), 26).move_to([x, y - 0.82, 0])
            cards.add(VGroup(box, qt, p0))
            after.append((p0, p1, rt, box, up))
        self.say("우리 주변에서 온도에 따라 기체의 부피가 변하는 예를 찾아요",
                 "우리 주변에서도 온도에 따라 기체의 부피가 변하는 예를 찾을 수 있어요. 어떻게 될까요?")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=1.2)
        self.pause_screen(6, "어떻게 될지 생각해 보세요")
        self.say(f"따뜻해지면 {r('부풀고')}, 차가워지면 {bl('쪼그라들어요')}",
                 "찌그러진 탁구공을 뜨거운 물에 넣으면 펴지고, 비치 볼과 과자 봉지, 열기구는 부풀어요. 물이 조금 남은 페트병을 냉장고에 넣으면 찌그러지고, 뜨거운 음식에 씌운 랩은 오목하게 들어가요.")
        for p0, p1, rt, box, up in after:
            self.play(Transform(p0, p1), FadeIn(rt), box.animate.set_stroke(RED if up else BLUE, 5), run_time=0.6)
            self.wait(0.6)
        self.settle()
        clear_stage(self)
        # 생각해 봐요: 겨울철 타이어
        self.section("생각해 봐요")
        q = K.text_card(["추운 겨울철에는 여름철보다", "자동차 타이어에 공기를 더 많이 넣어요. 왜 그럴까요?"], w=11.4, size=36).move_to([0, 1.2, 0])
        self.say("겨울철에는 왜 타이어에 공기를 더 많이 넣을까요?",
                 "추운 겨울철에는 여름철보다 자동차 타이어에 공기를 더 많이 넣어요. 왜 그럴까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.pause_screen(5, "온도와 부피를 생각해 보세요")
        a = K.text_card([f"겨울철에는 온도가 낮아 타이어 속 공기의 {bl('부피가 줄어들기')} 때문이에요"], w=11.4, size=32,
                        stroke=GREEN).move_to([0, -0.6, 0])
        self.play(FadeIn(a), run_time=0.6)
        self.say(f"온도가 낮아 타이어 속 공기의 {bl('부피가 줄어들어요')}",
                 "겨울철에는 온도가 낮아 타이어 속 공기의 부피가 줄어들기 때문에 공기를 더 많이 넣어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"기체는 {o('온도')}에 따라 {g('부피')}가 달라집니다."], w=12.0, size=52).move_to([0, 0.6, 0])
        self.say(f"기체는 {o('온도')}에 따라 {g('부피')}가 달라져요", "기체는 온도에 따라 부피가 달라져요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
