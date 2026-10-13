"""「수학 원리 돋보기」 46화 — 시간의 뺄셈 (1학기 5단원 7차시, 화 코드 1-5-e)

3분 20초 − 1분 50초: 초끼리 뺄 수 없어 1분을 60초로 → 80 − 50 = 30초, 2 − 1 = 1분 → 1분 30초
시각 − 시각 = 시간(열차 걸린 시간)
최종: ./make_final.sh 46
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, UP, FadeIn, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from measure import unit_calc


class Ep46(EpisodeScene):
    EP_NO = 46
    EP_TITLE = "시간의 뺄셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.section("초끼리 뺄 수 없으면?")
        unit_calc(self, (3, 20), (1, 50), "-", big="분", small="초", base=60)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.train()
        self.closing(f"초끼리 뺄 수 없으면 {b('1분')}을 {o('60초')}로 바꾸어 빼요\n시각 − 시각 = {g('걸린 시간')}",
                     next_preview="47화 · '똑같이' 나누어야 분수예요")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"볶음밥은 {b('3분')} {o('20초')}, 만두는 {b('1분')} {o('50초')} 데워요.\n볶음밥을 얼마나 더 오래 데울까요?", 48)
        q.scale_to_fit_width(min(q.width, 11.8)).move_to([0, 0.8, 0])
        self.say("볶음밥 3분 20초, 만두 1분 50초", "전자레인지로 냉동 볶음밥은 3분 20초, 냉동 만두는 1분 50초 데워요. 볶음밥을 얼마나 더 오래 데울까요?")
        self.play(Write(q), run_time=1.3)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def train(self):
        self.section("걸린 시간 구하기")
        q = M(f"서울역 출발 {b('9시 10분')}, 부산역 도착 {o('11시 50분')}", 48).move_to([0, 2.1, 0])
        self.say("열차가 가는 데 걸린 시간은?", "고속 열차가 서울역에서 9시 10분에 출발해 부산역에 11시 50분에 도착했어요. 걸린 시간은?")
        self.play(FadeIn(q), run_time=0.5)
        rows = [
            (f"분: 50 − 10 = {g('40분')}", "분끼리 빼면 50분 빼기 10분, 40분."),
            (f"시: 11 − 9 = {g('2시간')}", "시끼리 빼면 11 빼기 9, 2시간."),
        ]
        for k, (mk, nar) in enumerate(rows):
            m = M(mk, 52).move_to([0, 0.8 - k * 1.0, 0])
            self.say(mk, nar)
            self.play(FadeIn(m), run_time=0.5)
        a = M(f"걸린 시간: {g('2시간 40분')}", 58).move_to([0, -1.5, 0])
        self.say(f"걸린 시간은 {g('2시간 40분')}", "그래서 걸린 시간은 2시간 40분이에요. 시각에서 시각을 빼면 걸린 시간이 돼요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
