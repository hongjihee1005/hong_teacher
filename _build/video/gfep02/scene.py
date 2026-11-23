"""「수학 원리 돋보기」 분수 특별편 2화 — 부분을 분수로 나타내는 3단계

막대 5칸 중 2칸 → ① 전체 칸 수 = 분모 ② 색칠한 칸 수 = 분자 ③ 분모부터 읽기 '5분의 2'
→ 위아래를 바꾸면 다른 수(5분의 2 ≠ 2분의 5) → 연습: 원 8조각 중 3, 정사각형 4칸 중 3
최종: GRADE=f ./make_final.sh 2
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, pie, row
from fracbasic import grid, three_steps
from items import cross_mark


class GfEp02(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 2
    EP_TITLE = "부분을 분수로 나타내는 3단계"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.steps()
        self.swap()
        self.practice()
        self.closing(f"① 전체 칸 수 → {b('분모')}(아래)   ② 색칠한 칸 수 → {o('분자')}(위)\n③ 분모부터 읽어요: {b('5분의')} {o('2')}",
                     next_preview="분수 특별편 3화 · 헷갈리는 그림도 3단계로")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        self.bar = frac_bar(5, 2, width=6.0, height=1.0).move_to([-2.6, 0.3, 0])
        self.say("막대를 똑같이 나누어 색칠했어요", "막대를 똑같이 나누어 일부분을 색칠했어요.")
        self.play(FadeIn(self.bar), run_time=0.6)
        q = M(f"색칠한 부분을 {o('분수')}로 나타내 볼까요?", 48).move_to([0, 2.45, 0])
        self.say("색칠한 부분은 전체의 얼마일까요?", "색칠한 부분은 전체의 얼마일까요? 분수로 나타내 볼까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        self.play(FadeOut(q), run_time=0.4)

    def steps(self):
        self.section("3단계로 나타내기")
        self.result = three_steps(self, self.bar, [0, 1], pos=(3.8, 0.3, 0))
        self.wait(1.0)
        self.settle()

    def swap(self):
        self.section("위아래를 바꾸면?")
        clear_stage(self, 0.4)
        good = frac(2, 5, 90, cn=ORANGE, cd=BLUE).move_to([-2.4, -0.1, 0])
        bad = frac(5, 2, 90, cn=SOFT, cd=SOFT).move_to([2.4, -0.1, 0])
        self.say("자주 하는 실수: 위아래를 바꿔 쓰기", "자주 하는 실수가 있어요. 위와 아래를 바꿔 쓰는 거예요.")
        self.play(FadeIn(good), FadeIn(bad), run_time=0.6)
        no = cross_mark(0.5).next_to(bad, UP, buff=0.35)
        lg = M(f"{b('5분의')} {o('2')}", 40).next_to(good, DOWN, buff=0.4)
        lb = M("2분의 5 (전혀 다른 수)", 40, SOFT).next_to(bad, DOWN, buff=0.4)
        self.say("5분의 2와 2분의 5는 다른 수예요", "5분의 2와 2분의 5는 전혀 다른 수예요. 2분의 5는 1보다도 커요.")
        self.play(Create(no), FadeIn(lg), FadeIn(lb), run_time=0.6)
        tip = M(f"아래({b('분모')}) = 전체가 몇 칸인지,  위({o('분자')}) = 그중 몇 칸인지", 42).move_to([0, 2.3, 0])
        self.say(f"아래는 {b('전체')}, 위는 {o('그중의 몇')}", "아래 분모는 전체가 몇 칸인지, 위 분자는 그중의 몇 칸인지 나타내요.")
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def one(self, fig, cells, shaded, ans_n, ans_d, intro, intro_n):
        self.say(intro, intro_n)
        self.play(FadeIn(fig), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        res = three_steps(self, cells, shaded, pos=(3.8, 0.2, 0), quick=True)
        self.say(f"답: {b(str(ans_d) + '분의')} {o(str(ans_n))}", f"답은 {ans_d}분의 {ans_n}이에요.")
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        p = pie(8, 3, 1.55).move_to([-3.0, 0.1, 0])
        self.one(p, p, [0, 1, 2], 3, 8, "연습 1: 색칠한 부분은?", "연습 1. 피자를 똑같이 나누어 일부분에 색칠했어요. 색칠한 부분을 분수로 나타내 보세요.")
        gr = grid(2, 2, filled={0, 1, 3}, cw=1.5, ch=1.5).move_to([-3.0, 0.1, 0])
        self.one(gr, gr, [0, 1, 3], 3, 4, "연습 2: 색칠한 부분은?", "연습 2. 이번에는 정사각형이에요. 색칠한 부분을 분수로 나타내 보세요.")
        self.hide_chip()
