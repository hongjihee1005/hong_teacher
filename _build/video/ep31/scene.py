"""「수학 원리 돋보기」 31화 — 받아내림이 두 번 있으면? (1학기 1단원 7차시, 화 코드 1-1-d)

426 − 279: 일 → 십에서, 십 → 백에서 차례로 받아내림 → 147 / 500 − 199: 0이 있으면 백에서 십으로, 다시 일로
→ 다른 방법: 500 − 200 + 1 → 확인: 147 + 279 = 426
최종: ./make_final.sh 31
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, EpisodeScene, M, T, b, g, o
from division import clear_stage
from multiply import cm
from addsub import sub_vertical
from items import check_mark


class Ep31(EpisodeScene):
    EP_NO = 31
    EP_TITLE = "받아내림이 두 번 있으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.section("세로셈으로 426 − 279")
        sub_vertical(self, 426, 279)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.check()
        self.section("0이 있으면? 500 − 199")
        sub_vertical(self, 500, 199)
        self.settle(); self.clear_sub(); clear_stage(self, 0.6)
        self.easy_way()
        self.closing(f"뺄 수 없을 때마다 {g('바로 윗자리에서 받아내려요')}\n받아내린 자리가 {o('1 작아진 것')}을 잊지 말아요",
                     next_preview="32화 · 선분, 반직선, 직선은 무엇이 다를까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"구조한 동물 {cm('4', 2)}{cm('2', 1)}{cm('6', 0)}마리 중 {cm('2', 2)}{cm('7', 1)}{cm('9', 0)}마리를 바다로 돌려보냈어요.\n남은 동물은 몇 마리일까요?", 46)
        q.scale_to_fit_width(min(q.width, 11.6)).move_to([0, 1.5, 0])
        self.say("426마리 중 279마리", "동물 구조 단체에서 구조한 동물 426마리 중에서 279마리를 바다로 돌려보냈어요. 남은 동물은 몇 마리일까요?")
        self.play(Write(q), run_time=1.3)
        e = M("426 − 279 = ?", 110).move_to([0, -0.5, 0])
        self.say("일의 자리도, 십의 자리도 뺄 수 없어요", "일의 자리 6에서 9를, 십의 자리 2에서 7을 뺄 수 없어요. 받아내림이 두 번 있으면 어떻게 할까요?")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def check(self):
        self.section("덧셈으로 확인하기")
        e = M(f"147 + 279 = {g('426')}", 90).move_to([0, 0.7, 0])
        self.say("덧셈으로 확인해 볼까요?", "뺄셈이 맞는지 덧셈으로 확인해 볼까요? 147 더하기 279는 426. 처음 수가 나왔어요!")
        self.play(Write(e), run_time=1.0)
        self.play(Create(check_mark(0.8).next_to(e, RIGHT, buff=0.4)), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def easy_way(self):
        self.section("계산하기 쉽게 바꾸기")
        l1 = M(f"500 − 199 → 500 − {b('200')} = 300", 60).move_to([0, 1.3, 0])
        l2 = M(f"199는 200보다 {o('1')} 작으니 {o('1')}을 더해요", 46).move_to([0, 0.2, 0])
        l3 = M(f"300 + {o('1')} = {g('301')}", 70).move_to([0, -1.0, 0])
        self.say("다른 방법도 있어요", "다른 방법도 있어요. 199 대신 200을 빼면 500 빼기 200, 300.")
        self.play(FadeIn(l1), run_time=0.6)
        self.say(f"1을 더 뺐으니 {o('1')}을 더해요", "199보다 1을 더 뺐으니까 다시 1을 더해요.")
        self.play(FadeIn(l2), run_time=0.6)
        self.say(f"300 + 1 = {g('301')}, 세로셈과 같아요", "300 더하기 1은 301. 세로셈으로 구한 답과 같아요.")
        self.play(FadeIn(l3), run_time=0.6)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
