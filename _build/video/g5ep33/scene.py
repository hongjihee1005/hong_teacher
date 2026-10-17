"""「수학 원리 돋보기」 5학년 33화 — 올림과 버림 (5-2 1단원 5·6차시, 화 코드 5-2-1-c)

호두과자 243개가 필요, 10개씩 상자로만 팖 → 24상자로는 3개 모자람 → 25상자 250개 (올림)
243을 올림하여 십의 자리까지 250, 백의 자리까지 300
스티커 228개를 10개씩 기념품 1개로 바꿈 → 22개, 220장 사용 (버림) / 버림하여 십의 자리 220, 백의 자리 200
최종: GRADE=5 ./make_final.sh 33
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

RED = "#C0392B"
BROWN = "#B5835A"


def boxes(n, color=BROWN, w=0.42, h=0.34, cols=13):
    g_ = VGroup(*[Rectangle(width=w, height=h, fill_color=color, fill_opacity=0.85, stroke_color=INK, stroke_width=2) for _ in range(n)])
    return g_.arrange_in_grid(cols=cols, buff=0.08)


class G5Ep33(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 33
    EP_TITLE = "올림과 버림"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.up()
        self.down()
        self.closing(f"{o('올림')}: 구하려는 자리 아래 수를 올려요 (모자라면 안 될 때)\n{b('버림')}: 구하려는 자리 아래 수를 버려요 (남는 것은 쓸 수 없을 때)",
                     next_preview="5학년 34화 · 반올림")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("호두과자 243개가 필요해요. 10개씩 든 상자로만 판다면\n적어도 몇 개를 사야 할까요?", 40)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0.5, 1.6, 0])
        self.say("243개가 필요한데 10개씩만 판다면?", "호두과자 243개가 필요해요. 가게에서는 10개씩 든 상자로만 팔아요. 적어도 몇 개를 사야 할까요?")
        self.play(Write(q), run_time=1.0)
        self.wait(0.8)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def up(self):
        self.section("올림")
        bx = boxes(24).move_to([-1.6, 1.3, 0])
        lab = M(f"24상자 = 240개 → {RED_T('3개 모자라요')}", 38).move_to([-1.6, -0.1, 0])
        self.say("24상자면 240개", "10개씩 24상자를 사면 240개라서 3개가 모자라요.")
        self.play(LaggedStart(*[FadeIn(x) for x in bx], lag_ratio=0.03, run_time=1.2), FadeIn(lab))
        extra = Rectangle(width=0.42, height=0.34, fill_color=ORANGE, fill_opacity=0.9, stroke_color=INK, stroke_width=2).next_to(bx[-1], RIGHT, buff=0.08)
        lab2 = M(f"한 상자 더 → 25상자 = {o('250개')}", 40).move_to([-1.6, -0.9, 0])
        self.say(f"한 상자 더 사야 해요 → {o('250개')}", "모자라면 안 되니 한 상자를 더 사야 해요. 25상자, 250개를 사야 해요.")
        self.play(FadeIn(extra, scale=1.5), FadeIn(lab2), run_time=0.7)
        n = M(f"243 → 250  :  일의 자리 3을 {o('10으로 올려')} 생각했어요 = {o('올림')}", 34).move_to([0, -1.8, 0])
        self.say(f"아래 자리를 올리는 방법 = {o('올림')}", "243의 일의 자리 3을 10으로 올려 250으로 나타냈어요. 이렇게 구하려는 자리 아래의 수를 올려서 나타내는 방법을 올림이라고 해요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(0.6)
        self.settle()
        clear_stage(self, 0.6)
        r1 = M(f"243을 올림하여 {o('십의 자리')}까지  →  {o('250')}", 44).move_to([0, 1.2, 0])
        r2 = M(f"243을 올림하여 {b('백의 자리')}까지  →  {b('300')}", 44).move_to([0, 0.0, 0])
        n2 = M(f"올림한 수는 원래 수와 {g('같거나 커요')}", 40).move_to([0, -1.3, 0])
        self.say(f"백의 자리까지 올림하면 {b('300')}", "243을 올림하여 십의 자리까지 나타내면 250, 백의 자리까지 나타내면 43을 100으로 올려 300이에요.")
        self.play(FadeIn(r1), run_time=0.5)
        self.play(FadeIn(r2), run_time=0.5)
        self.play(FadeIn(n2), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def down(self):
        self.section("버림")
        q = M("스티커 10장마다 기념품 1개로 바꿔 줘요.\n스티커 228장으로 최대 몇 장을 쓸 수 있을까요?", 38).move_to([0.6, 2.0, 0])
        self.say("스티커 228장", "축제에서 스티커 10장마다 기념품 1개로 바꿔 줘요. 스티커 228장으로 최대 몇 장을 쓸 수 있을까요?")
        self.play(FadeIn(q), run_time=0.6)
        bx = boxes(22, color=BLUE).move_to([-1.6, 0.4, 0])
        left = VGroup(*[Rectangle(width=0.1, height=0.34, fill_color=SOFT, fill_opacity=0.7, stroke_width=1) for _ in range(8)]).arrange(RIGHT, buff=0.03).next_to(bx, RIGHT, buff=0.3)
        lab = M(f"10장 묶음 22개 = {b('220장')}, 남은 8장은 {RED_T('못 바꿔요')}", 36).move_to([0, -0.8, 0])
        self.say(f"220장만 쓸 수 있어요", "10장씩 22번 바꾸면 220장을 써요. 남은 8장으로는 바꿀 수 없어요.")
        self.play(LaggedStart(*[FadeIn(x) for x in bx], lag_ratio=0.03, run_time=1.0), FadeIn(left), FadeIn(lab))
        n = M(f"228 → 220  :  일의 자리 8을 {b('0으로 버려')} 생각했어요 = {b('버림')}", 34).move_to([0, -1.6, 0])
        self.say(f"아래 자리를 버리는 방법 = {b('버림')}", "228의 일의 자리 8을 0으로 버려 220으로 나타냈어요. 이렇게 구하려는 자리 아래의 수를 버려서 나타내는 방법을 버림이라고 해요. 백의 자리까지 버림하면 200이에요.")
        self.play(FadeIn(n), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def RED_T(s):
    return f'<span foreground="{RED}">{s}</span>'
