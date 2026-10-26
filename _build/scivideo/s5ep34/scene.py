"""「과학 원리 돋보기」 5학년 34화 — 빛에 의한 열의 이동(복사) (5-2 3단원 열과 우리 생활 7차시, 화 코드 5-2-3-e)

바탕: grade5/science/sem2/u3-5.html(원본 _build_tb/src2/u3-5.html) — 도입(햇빛이 강한 날은 왜 더울까?),
검은색 판 실험(그늘에서 두 판 17.5 °C → 1분 뒤 햇빛 26.7 °C · 그늘 17.8 °C, 지도서 예시 값),
여러 장소(운동장 바닥 25.1/17.3 · 계단 26.3/17.7 · 건물 벽 25.4/17.5), 추리(햇빛에 의해 열이 이동), 복사 정의,
생각 바로잡기(전도·대류는 물질을 통해, 복사는 물질 없이 빛에 의해), 복사의 예(햇빛·보온 등·난로),
열 전구 실험(23.4 → 41.9 °C, 비치지 않는 판 23.4 °C), 한눈에 쏙(빛), 모닥불, 안전.
최종: ./make_final.sh s5ep34
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, GrowArrow, Dot, Line,
                   Transform, DashedLine)

from series_style import GREEN, INK, ORANGE, SOFT, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep34(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 34
    EP_TITLE = "빛에 의한 열의 이동(복사)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.plates()
        self.places()
        self.radiation()
        self.lamp()
        self.summary()
        self.closing(f"{o('복사')}는 고체·액체·기체 같은 물질 없이\n{g('빛')}에 의해 열이 이동하는 방식이에요",
                     next_preview="5학년 35화 · 여러 방식으로 이동하는 열")
        self.wait(0.5)

    def temp_tag(self, v, col=RED):
        t = T(f"{v} °C", 30, col)
        bx = K.R(t.width + 0.3, t.height + 0.22, PAPER, 0, 0, rad=0.1, stroke=col, sw=3)
        t.move_to(bx)
        return VGroup(bx, t)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sun = K.sun_hot(0.6).move_to([-3.4, 1.4, 0])
        kid = K.kid("#E67E22").scale(1.4).move_to([0.5, 0.0, 0])
        rays = VGroup(*[Line(sun.get_center() + np.array([0.9, -0.5 - k * 0.15, 0]),
                             kid.get_center() + np.array([-0.4, 0.6 - k * 0.5, 0]),
                             stroke_color=K.SUNY, stroke_width=6) for k in range(3)])
        self.say("햇빛이 강한 날은 왜 더울까요?",
                 "햇빛이 강한 날 밖에 나가면 몸이 금세 더워져요. 햇빛이 강한 날은 왜 더울까요?")
        self.play(FadeIn(sun), FadeIn(kid), run_time=0.6)
        self.play(*[Create(x) for x in rays], run_time=0.8)
        self.pause_screen(4, "햇빛이 강한 날은 왜 더울까요?")
        self.say(f"햇빛이 {o('열의 이동')}과 관련 있는 것 같아요",
                 "햇빛이 열의 이동과 관련 있는 것 같아요. 햇빛이 비치는 곳과 비치지 않는 곳의 온도를 재어 확인해 봐요.")
        self.play(Indicate(kid, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 검은색 판 ──
    def plates(self):
        self.section("검은색 판 실험")
        ground = K.rect(14.2, 1.6, "#E8C98F", 0, -1.7, stroke="#E8C98F", sw=0)
        wall = K.rect(2.2, 3.6, "#C9B9A6", -6.0, 0.4, stroke="#8A7A66", sw=3)
        shade = K.poly([(-4.9, 2.2), (-4.9, -2.5), (0.2, -2.5), (0.2, -0.9)], "#000000", stroke="#000000", sw=0, op=0.13)
        sun = K.sun_hot(0.45).move_to([5.1, 2.0, 0])
        lb1 = T("그늘", 28, "#5A4A36").move_to([-2.4, 1.6, 0])
        lb2 = T("햇빛이 비치는 곳", 28, "#5A4A36").move_to([2.4, 1.3, 0])
        pa = K.black_plate().move_to([-3.2, -0.7, 0])
        pb = K.black_plate().move_to([-1.4, -0.7, 0])
        na = T("판 ㄱ", 24).next_to(pa, DOWN, buff=0.12)
        nb = T("판 ㄴ", 24).next_to(pb, DOWN, buff=0.12)
        self.say("검은색 판 두 장을 그늘에서 먼저 재요",
                 "검은색 판 두 장을 준비해 그늘에서 적외선 온도계로 온도를 재요. 두 판 모두 17.5도로 같아요.")
        self.play(FadeIn(ground), FadeIn(wall), FadeIn(shade), FadeIn(sun), FadeIn(lb1), FadeIn(lb2), run_time=0.6)
        self.play(FadeIn(pa), FadeIn(pb), FadeIn(na), FadeIn(nb), run_time=0.5)
        ta = self.temp_tag("17.5").next_to(pa, UP, buff=0.15)
        tb = self.temp_tag("17.5").next_to(pb, UP, buff=0.15)
        self.play(FadeIn(ta), FadeIn(tb), run_time=0.5)
        self.settle()
        self.say("판 ㄴ을 햇빛이 비치는 곳에서 1분 동안 들어요",
                 "판 하나는 햇빛이 비치는 곳에서, 다른 판은 그늘에서 들고 1분을 기다린 뒤 두 판의 온도를 재요.")
        self.play(FadeOut(tb), VGroup(pb, nb).animate.move_to([3.3, -0.6, 0]), FadeOut(ta), run_time=1.0)
        rays = VGroup(*[Line(sun.get_center() + np.array([-0.45, -0.45 + k * 0.12, 0]), [2.85 + k * 0.45, -0.2, 0],
                             stroke_color=K.SUNY, stroke_width=5) for k in range(3)])
        self.play(*[Create(x) for x in rays], run_time=0.6)
        safe = K.safety_note("햇빛을 직접 바라보지 않고 햇빛 보안경을 써요. 레이저 빛이 눈을 향하지 않게 해요.",
                             w=12.4, size=26).move_to([0, -2.3, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.pause_screen(5, "1분 뒤 어느 판의 온도가 더 높을까요?")
        ta = self.temp_tag("17.8").next_to(pa, UP, buff=0.15)
        tb = self.temp_tag("26.7").next_to(pb, UP, buff=0.15)
        self.say(f"햇빛 쪽 판 {r('26.7 °C')}, 그늘 쪽 판 {o('17.8 °C')}",
                 "1분 뒤 햇빛이 비치는 곳에서 든 판은 26.7도, 그늘에서 든 판은 17.8도예요. 햇빛이 비치는 곳의 판이 더 높아요. 온도는 지도서의 예시 값이에요.")
        self.play(FadeIn(ta), FadeIn(tb, scale=1.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 여러 장소 ──
    def places(self):
        self.section("여러 장소에서")
        tb = K.result_table(["장소", "햇빛이 비치는 곳(°C)", "햇빛이 비치지 않는 곳(°C)"],
                            [["운동장 바닥", "25.1", "17.3"], ["계단", "26.3", "17.7"], ["건물 벽", "25.4", "17.5"]],
                            [2.8, 4.3, 4.6], row_h=0.85, size=30).move_to([0, 0.9, 0])
        boxes = [m for m in tb if m.__class__.__name__ == "Rectangle"]
        hl = VGroup(*[K.rect(4.3, 0.85, "#FFE9A8", boxes[3 * i + 1].get_x(), boxes[3 * i + 1].get_y(), stroke="#FFE9A8", sw=0, op=0.7)
                      for i in range(1, 4)])
        self.say("운동장 바닥, 계단, 건물 벽에서도 비교해요",
                 "운동장 바닥, 계단, 건물 벽에서 햇빛이 비치는 곳과 비치지 않는 곳의 온도를 비교해요. 표의 값은 지도서의 예시 값이에요.")
        self.play(FadeIn(tb), run_time=0.6)
        self.settle()
        self.say(f"세 장소 모두 햇빛이 비치는 곳이 {r('더 높아요')}",
                 "세 장소 모두 같은 장소에서 햇빛이 비치는 곳의 온도가 햇빛이 비치지 않는 곳보다 더 높아요.")
        self.add(hl)
        self.bring_to_front(tb)
        self.play(FadeIn(hl), run_time=0.6)
        self.settle()
        card = K.text_card([f"햇빛이 비치는 곳의 온도가 더 높아요 → {g('햇빛에 의해 열이 이동')}해요"], size=34).move_to([0, -1.6, 0])
        self.say(f"햇빛에 의해 {g('열이 이동')}한다는 것을 알 수 있어요",
                 "햇빛이 비치는 곳의 온도가 더 높은 것으로 보아, 햇빛에 의해 열이 이동한다는 것을 추리할 수 있어요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 복사 ──
    def radiation(self):
        self.section("복사")
        card = K.text_card([f"햇빛을 받으면 그늘에 있을 때보다 몸이 더 따뜻해져요.",
                            f"이처럼 {g('빛')}에 의해 열이 이동하는 방식 → {o('복사')}"], w=12.4, size=36).move_to([0, 1.6, 0])
        self.say(f"빛에 의해 열이 이동하는 방식을 {o('복사')}라고 해요",
                 "햇빛을 받으면 그늘에 있을 때보다 몸이 더 따뜻해져요. 햇빛에 의해 열이 이동했기 때문이에요. 이처럼 빛에 의해 열이 이동하는 방식을 복사라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        a = K.word_card("전도·대류: 물질을 통해", 5.6, 0.95, K.COLD, 32)
        b = K.word_card("복사: 물질 없이 빛에 의해", 5.6, 0.95, ORANGE, 32)
        VGroup(a, b).arrange(RIGHT, buff=0.5).move_to([0, -0.2, 0])
        self.say(f"전도·대류는 물질을 통해, 복사는 {g('물질 없이 빛')}에 의해",
                 "생각 바로잡기! 전도와 대류는 고체, 액체, 기체와 같은 물질을 통해 열이 이동하지만, 복사는 그런 물질 없이 빛에 의해 열이 이동해요.")
        self.play(FadeIn(a), FadeIn(b), run_time=0.6)
        self.settle()
        pics = [(K.sun_hot(0.4), "햇빛이 비친 곳"), (K.heat_lamp(True), "보온 등 아래 음식"), (K.flame(1.4), "난로 앞")]
        cards = VGroup(*[K.pic_card(p, n, 3.2, 1.9, 26, stroke=ORANGE) for p, n in pics]).arrange(RIGHT, buff=0.35).move_to([0, -1.75, 0])
        self.say(f"햇빛, 보온 등, 난로 앞이 따뜻한 것은 {o('복사')}예요",
                 "햇빛이 비친 곳이 따뜻해지는 것, 보온 등 아래 음식이 따뜻하게 유지되는 것, 난로 앞에 가면 따뜻한 것은 모두 복사로 열이 이동하기 때문이에요.")
        self.play(FadeOut(card), VGroup(a, b).animate.move_to([0, 1.7, 0]), run_time=0.5)
        cards.move_to([0, -0.3, 0])
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 열 전구 ──
    def lamp(self):
        self.section("열 전구로 실험")
        lp = K.heat_lamp(True).scale(1.2).move_to([-3.0, 0.35, 0])
        floor = K.rect(13.0, 0.4, "#D9CBB8", 0, -1.5, stroke="#D9CBB8", sw=0)
        pa = K.black_plate(1.5, 0.3).move_to([-3.0, -1.15, 0])
        pb = K.black_plate(1.5, 0.3).move_to([3.0, -1.15, 0])
        na = T("열 전구를 비춘 판", 26).next_to(pa, DOWN, buff=0.35)
        nb = T("비추지 않는 판", 26).next_to(pb, DOWN, buff=0.35)
        ta = self.temp_tag("23.4").next_to(pa, UP, buff=0.5).shift(RIGHT * 1.9)
        tb = self.temp_tag("23.4").next_to(pb, UP, buff=0.5)
        self.say("비가 오는 날에는 열 전구로도 실험할 수 있어요",
                 "비가 와서 운동장에 나가기 어려울 때는 열 전구로 실험해요. 처음 두 판의 온도는 23.4도로 같아요.")
        self.play(FadeIn(floor), FadeIn(pa), FadeIn(pb), FadeIn(na), FadeIn(nb), FadeIn(ta), FadeIn(tb), run_time=0.6)
        self.play(FadeIn(lp), run_time=0.5)
        self.settle()
        ta2 = self.temp_tag("41.9").move_to(ta)
        self.say(f"1분 뒤 빛을 비춘 판은 {r('41.9 °C')}, 다른 판은 그대로 23.4 °C",
                 "열 전구를 켜고 1분 뒤, 빛이 비치는 곳의 판은 41.9도로 올라갔고, 빛이 비치지 않는 곳의 판은 23.4도 그대로예요. 열 전구의 빛에 의해 열이 이동했어요.")
        self.play(Transform(ta, ta2), run_time=0.8)
        safe = K.safety_note("열 전구의 빛이 나오는 부분을 맨눈으로 오래 쳐다보지 않아요. 안전 장갑을 껴요.",
                             w=9.6, size=24).move_to([1.7, 2.6, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"복사는 {o('빛')}에 의해 열이 이동하는 방식입니다."], w=11.0, size=42).move_to([0, 1.0, 0])
        self.say(f"복사는 {o('빛')}에 의해 열이 이동하는 방식이에요",
                 "복사는 빛에 의해 열이 이동하는 방식이에요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        more = K.text_card([f"모닥불 근처가 따뜻해요 → {g('모닥불의 빛')}에 의해 열이 이동"], size=34).move_to([0, -1.1, 0])
        self.say(f"모닥불 근처가 따뜻한 것도 {g('빛에 의해')} 열이 이동했기 때문이에요",
                 "모닥불 근처에 가면 따뜻함이 느껴지는 까닭은 모닥불의 빛에 의해 열이 이동했기 때문이에요.")
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
