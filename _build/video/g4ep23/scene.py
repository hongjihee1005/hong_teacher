"""「수학 원리 돋보기」 4학년 23화 — 표를 막대그래프로 나타내기 (4-1 5단원 4차시, 화 코드 4-1-5-b)

① 가로·세로에 무엇을 나타낼지 ② 가장 큰 수까지 나타낼 수 있게 눈금 한 칸의 크기 ③ 막대 그리기 ④ 제목
눈금 한 칸을 1·2로 바꾸면 그래프 높이가 달라짐
최종: GRADE=4 ./make_final.sh 23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowFromEdge, Indicate, LaggedStart,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from chart import Chart

ITEMS = ["종이", "플라스틱", "캔", "유리병"]
VALS = [14, 18, 8, 6]


class G4Ep23(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 23
    EP_TITLE = "표를 막대그래프로 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.steps()
        self.scale_choice()
        self.closing(f"① 가로·세로 정하기 ② {o('눈금 한 칸')} 정하기\n③ 막대 그리기 ④ {g('제목')} 쓰기",
                     next_preview="4학년 24화 · 막대그래프로 무엇을 판단할까?")
        self.wait(0.5)

    def table(self):
        tbl = VGroup()
        for i, (a, v) in enumerate(zip(["종류"] + ITEMS + ["합계"], ["개수(개)"] + VALS + [sum(VALS)])):
            col = VGroup(T(a, 30, INK if i else SOFT), T(str(v), 34, INK if i else SOFT)).arrange(DOWN, buff=0.35)
            tbl.add(col)
        return tbl.arrange(RIGHT, buff=0.6)

    def problem(self):
        self.section("문제")
        q = M("한 주 동안 모은 재활용품을 막대그래프로 나타내려면?", 44)
        q.scale_to_fit_width(min(q.width, 10.4)).move_to([0.6, 2.25, 0])
        tbl = self.table().move_to([0, 0.2, 0])
        self.say("표를 막대그래프로", "한 주 동안 모은 재활용품의 개수를 표로 정리했어요. 막대그래프로 나타내려면 어떻게 해야 할까요?")
        self.play(Write(q), FadeIn(tbl), run_time=1.2)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def steps(self):
        self.section("네 단계로 그리기")
        tbl = self.table()
        tbl.scale_to_fit_width(4.3).move_to([4.6, 0.6, 0])
        self.add(tbl)
        ch = Chart(ITEMS, vmax=20, step=2, origin=[-5.6, -1.75, 0], w=7.6, h=3.3, ylab="(개)")
        g0 = ch.axes_group
        self.say(f"① 가로에 {o('종류')}, 세로에 {o('개수')}", "첫째, 가로에 재활용품 종류를, 세로에 개수를 나타내기로 정해요.")
        self.play(FadeIn(ch.xlabels), run_time=0.6)
        self.say(f"② 가장 큰 수 {o('18')}까지 → 한 칸 {o('2개')}", "둘째, 가장 큰 수 18까지 나타낼 수 있도록 눈금 한 칸의 크기를 정해요. 한 칸을 2개로 하면 10칸이면 돼요.")
        self.play(FadeIn(g0), run_time=0.8)
        bars = ch.bars(VALS)
        self.say("③ 개수에 맞게 막대를 그려요", "셋째, 개수에 맞게 막대를 그려요. 14는 7칸, 18은 9칸, 8은 4칸, 6은 3칸이에요.")
        self.play(LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.3, run_time=2.0))
        title = T("한 주 동안 모은 재활용품", 36).move_to([-1.8, 2.3, 0])
        self.say(f"④ 알맞은 {g('제목')}을 써요", "넷째, 그래프에 알맞은 제목을 써요.")
        self.play(Write(title), run_time=0.8)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def scale_choice(self):
        self.section("눈금 한 칸의 크기")
        a = Chart(ITEMS, vmax=20, step=1, origin=[-6.2, -1.75, 0], w=5.2, h=3.4, label_size=24, tick_every=5, ylab="(개)")
        b = Chart(ITEMS, vmax=20, step=2, origin=[1.0, -1.75, 0], w=5.2, h=3.4, label_size=24, tick_every=1, ylab="(개)")
        ta = M(f"한 칸 = {o('1개')}", 36).move_to([-3.6, 2.35, 0])
        tb = M(f"한 칸 = {o('2개')}", 36).move_to([3.6, 2.35, 0])
        self.say("눈금 한 칸을 다르게 하면?", "같은 자료를 눈금 한 칸의 크기를 다르게 해서 나타내 볼까요? 왼쪽은 한 칸이 1개, 오른쪽은 한 칸이 2개예요.")
        self.play(FadeIn(a.axes_group), FadeIn(b.axes_group), FadeIn(ta), FadeIn(tb), run_time=0.8)
        self.play(LaggedStart(*[GrowFromEdge(x, DOWN) for x in a.bars(VALS)], lag_ratio=0.2, run_time=1.2),
                  LaggedStart(*[GrowFromEdge(x, DOWN) for x in b.bars(VALS)], lag_ratio=0.2, run_time=1.2))
        self.say(f"모양은 같고, {o('칸 수')}가 달라요", "막대의 모양은 같지만, 막대가 차지하는 칸 수가 달라요. 그래서 그래프를 읽을 때는 눈금 한 칸의 크기를 꼭 확인해요.")
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
