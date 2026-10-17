"""「수학 원리 돋보기」 5학년 35화 — 어떤 어림을 써야 할까? (5-2 1단원 8차시, 화 코드 5-2-1-e)

사과파이 485개를 10개씩 상자에 담아 팖 → 남은 5개는 못 팖 → 48상자 (버림, 최대)
124명이 10명씩 타는 버스 → 남은 4명도 타야 함 → 13번 (올림, 최소)
키 145.7 cm를 일의 자리까지 → 146 cm (반올림, 대략의 값)
최종: GRADE=5 ./make_final.sh 35
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, RoundedRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage


class G5Ep35(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 35
    EP_TITLE = "어떤 어림을 써야 할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.cases()
        self.closing(f"남은 것을 쓸 수 없으면 {b('버림')}, 남은 것도 꼭 필요하면 {o('올림')}\n대략의 값을 말할 때는 {g('반올림')}",
                     next_preview="5학년 36화 · (진분수) × (자연수)")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("올림, 버림, 반올림 중에서\n어떤 어림을 써야 할지는 어떻게 정할까요?", 44).move_to([0.6, 1.6, 0])
        self.say("어떤 어림을 쓸까요?", "올림, 버림, 반올림 가운데 어떤 어림을 써야 할지는 어떻게 정할까요? 상황을 잘 살펴봐요.")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def card(self, title, body, ans, col, y):
        box = RoundedRectangle(width=12.2, height=1.25, corner_radius=0.2, stroke_color=col, stroke_width=4, fill_color="#FFFFFF", fill_opacity=0.7).move_to([0, y, 0])
        t = M(title, 32).move_to([-5.7, y + 0.22, 0], aligned_edge=LEFT)
        bd = M(body, 26, SOFT).move_to([-5.7, y - 0.27, 0], aligned_edge=LEFT)
        a = M(ans, 36).move_to([4.3, y, 0])
        return VGroup(box, t, bd), a

    def cases(self):
        self.section("상황 따라 고르기")
        c1, a1 = self.card("사과파이 485개, 10개씩 상자에 담아 팔면?", "남은 5개는 상자를 채우지 못해 팔 수 없어요", f"{b('버림')} → 48상자", BLUE, 1.9)
        c2, a2 = self.card("124명이 10명씩 타는 버스, 몇 번 운행?", "남은 4명도 모두 타야 해요", f"{o('올림')} → 13번", ORANGE, 0.45)
        c3, a3 = self.card("키 145.7 cm, 약 몇 cm?", "대략의 값을 말해요", f"{g('반올림')} → 146 cm", GREEN, -1.0)
        self.say("사과파이 485개를 10개씩 상자에", "사과파이 485개를 10개씩 상자에 담아 팔아요. 남은 5개는 상자를 다 채우지 못해 팔 수 없어요.")
        self.play(FadeIn(c1), run_time=0.6)
        self.say(f"남은 것을 쓸 수 없으면 {b('버림')} → 48상자", "남은 것을 쓸 수 없을 때는 버림을 써요. 최대 48상자를 팔 수 있어요.")
        self.play(FadeIn(a1), run_time=0.5)
        self.say("124명이 10명씩 타는 버스", "124명이 10명씩 타는 버스로 이동해요. 남은 4명도 모두 타야 해요.")
        self.play(FadeIn(c2), run_time=0.6)
        self.say(f"남은 것도 필요하면 {o('올림')} → 13번", "남은 것도 꼭 필요할 때는 올림을 써요. 버스는 적어도 13번 운행해야 해요.")
        self.play(FadeIn(a2), run_time=0.5)
        self.say("키 145.7 cm를 대략", "키 145.7센티미터를 대략 몇 센티미터라고 말할까요?")
        self.play(FadeIn(c3), run_time=0.6)
        self.say(f"대략의 값은 {g('반올림')} → 146 cm", "대략의 값을 말할 때는 반올림을 써요. 소수 첫째 자리 7을 올려 약 146센티미터예요.")
        self.play(FadeIn(a3), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
