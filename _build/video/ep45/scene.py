"""「수학 원리 돋보기」 45화 — 시간의 덧셈 (1학기 5단원 6차시, 화 코드 1-5-d)

2분 30초 + 1분 40초: 초끼리 70초 → 60초 = 1분 받아올림 → 4분 10초 / 시각 + 시간: 11시 50분 10초 + 3분 30초
최종: ./make_final.sh 45
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, UP, FadeIn, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from measure import unit_calc


class Ep45(EpisodeScene):
    EP_NO = 45
    EP_TITLE = "시간의 덧셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.section("같은 단위끼리 더하기")
        unit_calc(self, (2, 30), (1, 40), "+", big="분", small="초", base=60)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.clock_time()
        self.closing(f"시는 시끼리, {b('분')}은 분끼리, {o('초')}는 초끼리\n{o('60초')} = {b('1분')}으로 받아올려요",
                     next_preview="46화 · 시간의 뺄셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"과학 실험 동영상 {b('2분')} {o('30초')}, 아기 동물 동영상 {b('1분')} {o('40초')}.\n두 동영상을 이어 붙이면 모두 몇 분 몇 초일까요?", 46)
        q.scale_to_fit_width(min(q.width, 11.8)).move_to([0, 0.8, 0])
        self.say("동영상 두 개를 이어 붙여요", "과학 실험 동영상은 2분 30초, 아기 동물 동영상은 1분 40초예요. 이어 붙이면 모두 몇 분 몇 초일까요?")
        self.play(Write(q), run_time=1.3)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def clock_time(self):
        self.section("시각에 시간 더하기")
        q = M(f"배달 드론이 {g('11시 50분 10초')}에 출발해 {b('3분')} {o('30초')} 뒤 도착", 44).move_to([0, 2.2, 0])
        q.scale_to_fit_width(min(q.width, 11.8))
        self.say("출발 시각에 걸린 시간을 더해요", "배달 드론이 11시 50분 10초에 출발해서 3분 30초 뒤에 도착해요. 도착 시각은 언제일까요?")
        self.play(FadeIn(q), run_time=0.5)
        rows = [
            (f"{o('초')}: 10 + 30 = {o('40초')}", "초끼리 더하면 10초 더하기 30초, 40초."),
            (f"{b('분')}: 50 + 3 = {b('53분')}", "분끼리 더하면 50분 더하기 3분, 53분."),
            (f"시: 그대로 {g('11시')}", "시는 그대로 11시예요."),
        ]
        for k, (mk, nar) in enumerate(rows):
            m = M(mk, 50).move_to([0, 1.0 - k * 0.9, 0])
            self.say(mk, nar)
            self.play(FadeIn(m), run_time=0.5)
        a = M(f"도착 시각: {g('11시 53분 40초')}", 58).move_to([0, -1.9, 0])
        self.say(f"도착 시각은 {g('11시 53분 40초')}", "그래서 도착 시각은 11시 53분 40초예요. 시각에 시간을 더하면 시각이 돼요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
