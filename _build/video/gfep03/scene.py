"""「수학 원리 돋보기」 분수 특별편 3화 — 헷갈리는 그림도 3단계로

① 색칠한 칸이 흩어져 있어도 세면 됨(6칸 중 3칸 → 6분의 3)
② 색칠하지 않은 부분(8칸 중 3칸 → 8분의 3, 색칠한 부분 8분의 5)
③ 자주 하는 실수: 색칠 2칸·안 칠 3칸을 '3분의 2'로 → 분모는 전체 5칸 → 5분의 2
최종: GRADE=f ./make_final.sh 3
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Brace, Create, FadeIn, FadeOut, Indicate, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row
from fracbasic import grid, three_steps
from items import check_mark, cross_mark


class GfEp03(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 3
    EP_TITLE = "헷갈리는 그림도 3단계로"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.scattered()
        self.unshaded()
        self.mistake()
        self.closing(f"칸이 흩어져 있어도 {o('세면')} 돼요\n{b('분모')}는 언제나 {g('전체')} 칸 수!",
                     next_preview="분수 특별편 4화 · 칸 크기가 다르면 어떻게 할까?")
        self.wait(0.5)

    def scattered(self):
        self.section("흩어진 칸")
        gr = grid(3, 2, filled={0, 2, 4}, cw=1.3, ch=1.3).move_to([-3.2, 0.2, 0])
        self.say("색칠한 칸이 떨어져 있어요", "이번에는 색칠한 칸이 여기저기 떨어져 있어요. 그래도 분수로 나타낼 수 있을까요?")
        self.play(FadeIn(gr), run_time=0.6)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        three_steps(self, gr, [0, 2, 4], pos=(3.6, 0.2, 0))
        t = M(f"붙어 있지 않아도 {o('세기만')} 하면 돼요", 42).move_to([0, -2.1, 0])
        self.say(f"답: {b('6분의')} {o('3')}  — 흩어져도 괜찮아요", "답은 6분의 3이에요. 칸이 붙어 있지 않아도 세기만 하면 돼요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def unshaded(self):
        self.section("색칠하지 않은 부분")
        gr = grid(4, 2, filled={0, 1, 3, 5, 6}, cw=1.15, ch=1.15).move_to([-3.0, 0.2, 0])
        self.say("이번에는 색칠하지 않은 부분을 분수로", "이번에는 색칠하지 않은 흰 부분을 분수로 나타내 볼까요?")
        self.play(FadeIn(gr), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        white = [i for i in range(8) if i not in {0, 1, 3, 5, 6}]
        three_steps(self, gr, white, pos=(3.6, 0.2, 0), what="색칠하지 않은 부분", quick=True)
        a = row("색칠한 부분", frac(5, 8, 46, cn=ORANGE, cd=BLUE), "+ 색칠하지 않은 부분", frac(3, 8, 46, cd=BLUE), "= 전체", size=36).move_to([0, -1.95, 0])
        self.say(f"색칠한 부분은 {o('8분의 5')}, 합하면 전체(8분의 8)",
                 "색칠하지 않은 부분은 8분의 3, 색칠한 부분은 8분의 5. 둘을 합하면 8칸 전체가 돼요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def mistake(self):
        self.section("자주 하는 실수")
        bar = frac_bar(5, 2, width=6.0, height=1.0).move_to([0, 1.1, 0])
        self.say("색칠한 부분을 분수로 나타내면?", "막대를 똑같이 5칸으로 나누어 2칸을 색칠했어요. 어떤 친구가 3분의 2라고 썼어요.")
        self.play(FadeIn(bar), run_time=0.5)
        wrong = frac(2, 3, 80, cn=ORANGE, cd=SOFT).move_to([-3.0, -1.0, 0])
        why = M("색칠한 2칸, 안 칠한 3칸이라서?", 38, SOFT).next_to(wrong, RIGHT, buff=0.5)
        self.play(FadeIn(wrong), FadeIn(why), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5, "무엇이 틀렸을까요?")
        self.settle()
        no = cross_mark(0.5).next_to(wrong, LEFT, buff=0.3)
        self.say(f"분모에 '{o('안 칠한 칸')}'을 쓰면 안 돼요", "분모에는 안 칠한 칸 수가 아니라 전체 칸 수를 써야 해요.")
        self.play(Create(no), run_time=0.4)
        br = Brace(bar, UP, color=BLUE)
        bt = M(f"전체 {b('5칸')}  (2 + 3 = 5)", 40).next_to(br, UP, buff=0.15)
        self.say(f"전체는 2 + 3 = {b('5칸')}", "색칠한 2칸과 안 칠한 3칸을 합한 전체 5칸이 분모예요.")
        self.play(Create(br), FadeIn(bt), run_time=0.6)
        right = frac(2, 5, 80, cn=ORANGE, cd=BLUE).move_to([3.0, -1.0, 0])
        ok = check_mark(0.5).next_to(right, RIGHT, buff=0.3)
        self.say(f"답: {b('5분의')} {o('2')}", "그래서 색칠한 부분은 5분의 2예요.")
        self.play(FadeOut(why), FadeIn(right), Create(ok), run_time=0.6)
        self.play(Indicate(right, color=GREEN, scale_factor=1.15), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
