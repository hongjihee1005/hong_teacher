"""「과학 원리 돋보기」 6학년 34화 — 연소 생성물과 생태계 (6-2 2단원 물질의 연소 7차시, 화 코드 6-2-2-e)

바탕: grade6/science/sem2/u2-5.html(원본 _build_tb/src2/u2-5.html) — 도입(자동차 엔진 속에서 연료가 연소, 전기 자동차도 전기를 생산하는
과정에서 연소가 일어날 수 있음), 생각 열기(자동차·비행기·화력 발전소·쓰레기 소각장·가스레인지는 연소 / 자전거·태양광 패널은 아님),
피해 사례 네 가지(구상나무·산호초·조개류 껍데기·북극곰 — 원인과 현황), 조사할 때 출처, 토의(공통점은 이산화 탄소 배출량 증가, 계속 늘면
피해가 더 커짐, 배출량을 줄여요), 한눈에 쏙(대기 중 이산화 탄소가 많아지면 생태계에 많은 피해), 늘리는 행동·줄이는 행동 나누기,
형성 평가(이산화 탄소가 생태계에 피해). 실천은 u2-6(창의가 팡팡: 이산화 탄소를 줄이는 실천 방법 — 꾸준히, 예시 문구)에서 가져옴.
최종: ./make_final.sh s6ep34
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u22 as K
import kit_s4u24 as K4
import kit_s6u11 as K61
from kit_s3u12 import bin_box


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def gr(s):
    return f'<span foreground="#55606A">{s}</span>'


class S6Ep34(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 34
    EP_TITLE = "연소 생성물과 생태계"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.town()
        self.cases()
        self.discuss()
        self.actions()
        self.summary()
        self.closing(f"연소로 생긴 {gr('이산화 탄소')}가 많아지면 생태계에 피해를 줘요\n{g('이산화 탄소를 줄이는 생활')}을 꾸준히 실천해요",
                     next_preview="6학년 35화 · 미래 사회의 문제")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        car = K4.car("#D2453B", 3.0, exhaust=True).move_to([-3.6, 0.2, 0])
        q = K.text_card(["자동차가 움직이는 것과", "연소는 어떤 관계가 있을까요?"], size=32).move_to([2.7, 1.3, 0])
        self.say("자동차가 움직이는 것과 연소는 어떤 관계가 있을까요?", "자동차가 움직이는 것과 연소는 어떤 관계가 있을까요?")
        self.play(FadeIn(car), FadeIn(q), run_time=0.8)
        self.settle()
        a = K.text_card([f"엔진 속에서 {o('연료가 연소')}하면서 움직여요"], size=30).move_to([2.7, -0.55, 0])
        ev = K.text_card(["전기 자동차는 연소가 일어나지 않지만,", "전기를 생산하는 과정에서 연소가 일어날 수 있어요"], size=24).move_to([2.7, -1.85, 0])
        self.say(f"엔진 속에서 {o('연료가 연소')}하면서 움직여요",
                 "자동차는 엔진 속에서 연료가 연소하면서 움직여요. 전기 자동차는 내부에서 연소가 일어나지 않지만, 전기를 생산하는 과정에서 연소가 일어날 수 있어요.")
        self.play(FadeIn(a), FadeIn(ev), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 생활 곳곳의 연소 ──
    def town(self):
        self.section("생활 속 연소")
        items = [(K4.car("#D2453B", 1.6), "자동차", True), (K4.plane(1.8), "비행기", True),
                 (K61.factory(1.0), "화력 발전소", True), (K.incinerator(), "쓰레기 소각장", True),
                 (K.gas_stove(), "가스레인지", True), (K4.bike(1.6), "자전거", False), (K4.solar_panel(1.8), "태양광 패널", False)]
        cards = VGroup()
        for pic, nm, ok in items:
            c = K.case_card(pic, nm, " ", w=2.75, h=2.25, size=12, head=28)
            cards.add(c)
        top = VGroup(*cards[:4]).arrange(RIGHT, buff=0.3)
        bot = VGroup(*cards[4:]).arrange(RIGHT, buff=0.3)
        VGroup(top, bot).arrange(DOWN, buff=0.25).move_to([0, 0.1, 0])
        self.say("우리 생활에서 연소가 일어나는 곳을 찾아봐요", "우리 생활 곳곳에서 일어나는 연소를 찾아봐요. 연소가 일어나는 곳은 어디일까요?")
        self.play(FadeIn(cards, lag_ratio=0.12), run_time=1.2)
        self.settle()
        marks = VGroup()
        for c, (_, _, ok) in zip(cards, items):
            m = K.ox_mark(ok, 0.26).move_to(c.box.get_corner(RIGHT + UP) + np.array([-0.35, -0.35, 0]))
            if ok:
                c.box.set_stroke(ORANGE, 5)
            marks.add(m)
        self.say(f"교통수단·발전소·소각장·가스 불에서 {o('연소')}가 일어나요",
                 "자동차와 비행기는 연료를 연소시켜 움직이고, 화력 발전소는 연료를 태워 전기를 만들어요. 쓰레기 소각장과 가스레인지에서도 연소가 일어나요. 자전거와 태양광 패널은 연소가 일어나지 않아요.")
        self.play(FadeIn(marks, lag_ratio=0.1), run_time=1.0)
        self.settle()
        self.say(f"연소가 일어나면 {gr('이산화 탄소')}가 생겨요", "우리 생활 곳곳에서 연소가 일어나고, 이산화 탄소가 생겨요.")
        self.play(Indicate(VGroup(*cards[:5]), color=ORANGE, scale_factor=1.03), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 피해 사례 ──
    def cases(self):
        self.section("생태계 피해")
        head = K.text_card([f"대기 중 {gr('이산화 탄소')}가 많아지면 → {r('기후변화')}, 일부는 바다에 녹아 {r('바다 산성화')}"], w=11.2, size=26).move_to([0.3, 2.15, 0])
        cs = [(K.gujeong(True), "말라 죽는 구상나무", "강수량 감소·최저기온 상승\n→ 나무가 하얗게 변하며\n집단으로 말라 죽어요"),
              (K61.coral_reef(True), "하얗게 변한 산호초", "바닷물 온도가 오르고 산성화\n→ 산호초가 하얗게 변해요\n(백화 현상)"),
              (K.shell_pair(), "약해지는 조개껍데기", "바다가 산성화되어\n→ 껍데기가 얇아지거나\n쉽게 깨져요"),
              (K.polar_ice(), "줄어드는 동식물", "적응하지 못한 동식물이\n줄거나 멸종해요\n(북극곰: 바다 얼음이 줄어요)")]
        cards = VGroup(*[K.case_card(p, t, b, w=3.25, h=4.0, size=21, head=25) for p, t, b in cs]).arrange(RIGHT, buff=0.2).move_to([0, -0.4, 0])
        self.say(f"이산화 탄소가 많아지면 {r('기후변화')}와 {r('바다 산성화')}가 생겨요",
                 "연소로 생긴 이산화 탄소가 대기 중에 많아지면 기후변화에 영향을 주고, 그 일부가 바다에 녹아 바다를 산성화하기도 해요.")
        self.play(FadeIn(head), run_time=0.6)
        self.settle()
        self.say(f"구상나무가 말라 죽고, 산호초가 {r('하얗게')} 변해요",
                 "우리나라 고유종인 구상나무가 하얗게 변하며 집단으로 말라 죽고 있어요. 바닷물의 온도가 오르고 산성화되어 산호초가 하얗게 변해요.")
        self.play(FadeIn(cards[:2], lag_ratio=0.3), run_time=1.0)
        self.settle()
        self.say(f"조개껍데기가 약해지고, 동식물이 {r('줄어들어요')}",
                 "산성화된 바다에서 조개류의 껍데기가 얇아지거나 쉽게 깨져요. 기후변화에 적응하지 못한 동식물은 줄거나 멸종해요. 북극곰은 바다 얼음이 줄어 먹이 사냥이 어려워요.")
        self.play(FadeIn(cards[2:], lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 토의 ──
    def discuss(self):
        self.section("토의해요")
        self.pause_screen(5, "여러 피해 사례의 공통점은?")
        rows = VGroup(
            K.text_card([f"공통점: 모두 {gr('이산화 탄소')}의 {r('배출량이 증가')}하기 때문에 생겨요"], w=12.0, size=30),
            K.text_card([f"배출량이 계속 늘면: 기후변화와 해양 산성화가 심해져 {r('피해가 더 커져요')}"], w=12.0, size=30),
            K.text_card([f"피해를 줄이려면: 이산화 탄소의 {g('배출량을 줄여요')}"], w=12.0, size=30),
        ).arrange(DOWN, buff=0.3).move_to([0, 0.4, 0])
        self.say(f"모두 {gr('이산화 탄소')} 배출량이 늘어나서 생긴 피해예요",
                 "여러 생태계 피해 사례는 모두 이산화 탄소의 배출량이 증가하기 때문에 생겨요. 배출량이 계속 늘면 기후변화와 해양 산성화가 심해져 피해가 더 커질 거예요.")
        self.play(FadeIn(rows[0]), FadeIn(rows[1]), run_time=0.9)
        self.settle()
        self.say(f"피해를 줄이려면 이산화 탄소의 {g('배출량을 줄여요')}", "생태계 피해를 줄이려면 이산화 탄소의 배출량을 줄여야 해요.")
        self.play(FadeIn(rows[2], shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 늘리는 행동 · 줄이는 행동 + 실천 ──
    def actions(self):
        self.section("우리의 실천")
        up = bin_box("이산화 탄소를 늘려요", 6.2, 3.6, RED, 32).move_to([-3.35, 0.75, 0])
        dn = bin_box("이산화 탄소를 줄여요", 6.2, 3.6, GREEN, 32).move_to([3.35, 0.75, 0])
        U = ["빈방에 전등을 켜 놓았어요", "가까운 곳도 자동차를 타고 갔어요", "냉난방 온도를 너무 낮게·높게 했어요"]
        D = ["가까운 거리는 걸어 다녔어요", "자전거를 탔어요", "대중교통을 이용했어요"]
        uc = VGroup(*[K.word_card(t, w=5.6, h=0.7, size=26) for t in U]).arrange(DOWN, buff=0.16).move_to(up.box.get_center() + DOWN * 0.3)
        dc = VGroup(*[K.word_card(t, w=5.6, h=0.7, size=26) for t in D]).arrange(DOWN, buff=0.16).move_to(dn.box.get_center() + DOWN * 0.3)
        self.say("이산화 탄소의 양에 영향을 준 행동을 나누어 봐요",
                 "빈방에 전등을 켜 놓거나, 가까운 곳도 자동차를 타고 가거나, 냉난방 온도를 너무 낮게 또는 높게 하면 이산화 탄소가 늘어나요.")
        self.play(FadeIn(up), FadeIn(dn), FadeIn(uc, lag_ratio=0.2), run_time=1.0)
        self.settle()
        self.say(f"걷기·자전거·대중교통은 이산화 탄소를 {g('줄여요')}",
                 "가까운 거리는 걸어 다니고, 자전거를 타고, 대중교통을 이용하면 이산화 탄소를 줄일 수 있어요.")
        self.play(FadeIn(dc, lag_ratio=0.2), run_time=0.9)
        self.settle()
        more = K.text_card([f"물 절약 · 쓰지 않는 플러그 뽑기 · 일회용품 줄이기 · 음식물 남기지 않기 → {g('꾸준히')} 실천해요"], size=26).move_to([0, -1.85, 0])
        self.say(f"작은 실천을 {g('꾸준히')} 이어가요",
                 "물 절약하기, 쓰지 않는 플러그 뽑기, 일회용품 줄이기, 음식물 남기지 않기도 이산화 탄소를 줄이는 방법이에요. 한 번이 아니라 꾸준히 실천해요.")
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        f = K61.factory(1.6).move_to([-4.4, 0.3, 0])
        card = K.text_card([f"대기 중에 {gr('이산화 탄소')}가 많아지면", "생태계에 많은 피해를 줍니다."], w=7.6, size=34).move_to([2.4, 1.0, 0])
        fix = K.text_card([f"산소는 연소 생성물이 {r('아니에요')}", f"생태계에 피해를 주는 연소 생성물은 {gr('이산화 탄소')}"], w=7.6, size=28).move_to([2.4, -1.2, 0])
        self.say(f"대기 중에 {gr('이산화 탄소')}가 많아지면 생태계에 피해를 줘요",
                 "대기 중에 이산화 탄소가 많아지면 생태계에 많은 피해를 줘요.")
        self.play(FadeIn(f), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        self.settle()
        self.say("자동차·비행기·쓰레기를 태울 때도 연소 생성물이 생겨요",
                 "산소는 연소 생성물이 아니에요. 자동차나 비행기를 이용할 때, 쓰레기를 태울 때도 연소 생성물이 생기고, 그중 이산화 탄소가 생태계에 피해를 줘요.")
        self.play(FadeIn(fix, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
