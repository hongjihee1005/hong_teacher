"""「수학 원리 돋보기」 6학년 21화 — 생활 속 비율 (6-1 4단원 5차시, 화 코드 6-1-4-d)

빠르기: 걸린 시간에 대한 간 거리, 인구: 넓이에 대한 인구 (그 밖에 지도, 판매한 비율)
기준량과 비교하는 양을 찾아 비율을 구한 다음 크기를 비교
(예시 수: 가 자동차 2시간 160 km, 나 자동차 3시간 210 km / 가 마을 넓이 4 km² 인구 2000명, 나 마을 넓이 5 km² 인구 2250명 — 이 영상에서 정한 수)
최종: GRADE=6 ./make_final.sh 21
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup,
                   Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, row
from tablekit import table


class G6Ep21(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 21
    EP_TITLE = "생활 속 비율"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.speed()
        self.people()
        self.closing(f"생활 속 비율은 {b('기준량')}과 {o('비교하는 양')}을 먼저 찾아요\n빠르기 = 간 거리 ÷ 걸린 시간, 인구 비율 = 인구 ÷ 넓이",
                     next_preview="6학년 22화 · 백분율이란?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("가 자동차는 2시간에 160 km,\n나 자동차는 3시간에 210 km를 갔어요.\n어느 자동차가 더 빠를까요?", 42).move_to([0.6, 1.4, 0])
        self.say("어느 자동차가 더 빠를까요?", "가 자동차는 2시간에 160 킬로미터, 나 자동차는 3시간에 210 킬로미터를 갔어요. 어느 자동차가 더 빠를까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def speed(self):
        self.section("빠르기")
        t = M(f"빠르기 = {b('걸린 시간')}에 대한 {o('간 거리')}의 비율", 40).move_to([0, 2.2, 0])
        self.say(f"기준량은 {b('걸린 시간')}", "빠르기는 걸린 시간에 대한 간 거리의 비율이에요. 기준량은 걸린 시간, 비교하는 양은 간 거리예요.")
        self.play(FadeIn(t), run_time=0.6)
        frame, cells = table([[" ", "간 거리", "걸린 시간", "빠르기"], ["가", "160 km", "2시간", " "], ["나", "210 km", "3시간", " "]],
                             (0, 0.6), cw=2.8, hw=1.2, h=0.7, size=32)
        self.play(FadeIn(frame), *[FadeIn(c) for r in cells for c in r[:3]], run_time=0.6)
        a = M(f"160 ÷ 2 = {g('80')}", 32).move_to(frame[7].get_center())
        b_ = M(f"210 ÷ 3 = {g('70')}", 32).move_to(frame[11].get_center())
        self.say(f"가 {g('80')}, 나 {g('70')}", "가 자동차는 160 나누기 2, 80. 나 자동차는 210 나누기 3, 70이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.play(FadeIn(b_), run_time=0.5)
        r = M(f"80 &gt; 70 → {g('가 자동차')}가 더 빨라요", 40).move_to([0, -1.4, 0])
        self.say(f"{g('가 자동차')}가 더 빨라요", "1시간에 간 거리로 견주면 가 자동차가 더 빨라요.")
        self.play(FadeIn(r), Create(SurroundingRectangle(a, color=GREEN, buff=0.1)), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def people(self):
        self.section("넓이에 대한 인구")
        t = M(f"{b('넓이')}에 대한 {o('인구')}의 비율", 40).move_to([0, 2.2, 0])
        self.say(f"어느 마을이 더 붐빌까요?", "두 마을 중 어느 마을에 사람이 더 많이 모여 살까요? 넓이에 대한 인구의 비율로 견주어요.")
        self.play(FadeIn(t), run_time=0.6)
        frame, cells = table([[" ", "인구", "넓이", "1 km²에 사는 사람"], ["가 마을", "2000명", "4 km²", " "], ["나 마을", "2250명", "5 km²", " "]],
                             (0, 0.6), cw=3.0, hw=1.8, h=0.7, size=28)
        self.play(FadeIn(frame), *[FadeIn(c) for r in cells for c in r[:4]], run_time=0.6)
        a = M(f"2000 ÷ 4 = {g('500')}", 30).move_to(frame[7].get_center())
        b_ = M(f"2250 ÷ 5 = {g('450')}", 30).move_to(frame[11].get_center())
        self.say(f"가 {g('500')}명, 나 {g('450')}명", "가 마을은 2000 나누기 4, 500명. 나 마을은 2250 나누기 5, 450명이에요.")
        self.play(FadeIn(a), FadeIn(b_), run_time=0.6)
        r = M(f"인구는 나 마을이 많지만, 더 붐비는 곳은 {g('가 마을')}", 38).move_to([0, -1.4, 0])
        self.say(f"더 붐비는 곳은 {g('가 마을')}", "인구는 나 마을이 더 많지만, 넓이에 대한 인구의 비율은 가 마을이 더 커서 가 마을이 더 붐벼요.")
        self.play(FadeIn(r), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
