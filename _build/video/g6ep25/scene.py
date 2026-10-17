"""「수학 원리 돋보기」 6학년 25화 — 띠그래프·원그래프 그리기 (6-1 5단원 3차시, 화 코드 6-1-5-b)

① 각 항목의 백분율을 구해요 ② 백분율의 합계가 100 %인지 확인 ③ 백분율만큼 선을 그어 띠(원)를 나누어요(이전 항목에 이어서, 원은 중심에서 눈금까지)
④ 나눈 부분에 항목과 백분율을 써요 ⑤ 알맞은 제목을 써요
(예시 자료: 아침 식사 40명 — 밥 18, 빵 12, 시리얼 6, 기타 4 → 45·30·15·10 %, 이 영상에서 정한 자료)
최종: GRADE=6 ./make_final.sh 25
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, TAU, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from ratiograph import band, band_scale, pie, pie_ticks
from tablekit import table

PURPLE = "#7A4FB5"
ITEMS = [("밥", 45, ORANGE), ("빵", 30, BLUE), ("시리얼", 15, GREEN), ("기타", 10, PURPLE)]


class G6Ep25(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 25
    EP_TITLE = "띠그래프·원그래프 그리기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.percent()
        self.draw_band()
        self.draw_pie()
        self.closing(f"① 백분율 구하기 ② {g('합계 100 %')} 확인 ③ 백분율만큼 나누기\n④ 항목과 백분율 쓰기 ⑤ {o('제목')} 쓰기",
                     next_preview="6학년 26화 · 그래프 해석하기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("40명이 아침에 먹은 음식을 조사한 표예요.\n띠그래프와 원그래프로 어떻게 나타낼까요?", 40).move_to([0.6, 2.0, 0])
        self.say("어떻게 나타낼까요?", "40명이 아침에 먹은 음식을 조사한 표예요. 띠그래프와 원그래프로 어떻게 나타낼까요?")
        self.play(Write(q), run_time=1.0)
        frame, cells = table([["음식", "밥", "빵", "시리얼", "기타", "합계"], ["학생 수(명)", "18", "12", "6", "4", "40"]],
                             (0, 0.0), cw=1.5, hw=2.4, h=0.7, size=30)
        self.play(FadeIn(frame), *[FadeIn(c) for r in cells for c in r], run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def percent(self):
        self.section("① 백분율 ② 합계 확인")
        frame, cells = table([["음식", "밥", "빵", "시리얼", "기타", "합계"], ["학생 수(명)", "18", "12", "6", "4", "40"], ["백분율(%)", " ", " ", " ", " ", " "]],
                             (0, 1.6), cw=1.5, hw=2.4, h=0.66, size=30)
        self.play(FadeIn(frame), *[FadeIn(c) for r in cells[:2] for c in r], FadeIn(cells[2][0]), run_time=0.6)
        e = M(f"① 18 ÷ 40 × 100 = {o('45')}", 40).move_to([0, -0.3, 0])
        self.say(f"① 18 ÷ 40 × 100 = {o('45')}", "먼저 각 항목의 백분율을 구해요. 밥은 18 나누기 40 곱하기 100, 45 %예요.")
        self.play(FadeIn(e), run_time=0.5)
        vals = ["45", "30", "15", "10"]
        nums = VGroup(*[M(v, 30).move_to(frame[13 + k].get_center()) for k, v in enumerate(vals)])
        self.say("빵 30, 시리얼 15, 기타 10", "같은 방법으로 빵 30 %, 시리얼 15 %, 기타 10 %예요.")
        self.play(LaggedStart(*[FadeIn(n) for n in nums], lag_ratio=0.25, run_time=1.0))
        tot = M(g("100"), 30).move_to(frame[17].get_center())
        e2 = M(f"② 45 + 30 + 15 + 10 = {g('100')}", 40).move_to([0, -1.3, 0])
        self.say(f"② 합계가 {g('100 %')}인지 확인", "백분율을 모두 더하면 100 %가 되는지 확인해요.")
        self.play(FadeIn(e2), FadeIn(tot), run_time=0.6)
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)

    def draw_band(self):
        self.section("③ ④ 띠그래프")
        bd = band(ITEMS, width=10.0, height=1.1, center=(0, 0.4, 0), size=26)
        outline = band([(" ", 100, "#FFFFFF")], width=10.0, height=1.1, center=(0, 0.4, 0), show_pct=False)
        sc = band_scale(bd, step=10)
        self.say("눈금이 있는 띠에", "눈금이 100칸인 띠를 준비해요.")
        self.play(FadeIn(outline.segs), FadeIn(sc), run_time=0.6)
        self.say(f"③ 앞 항목에 {o('이어서')} 백분율만큼", "백분율만큼 선을 그어 띠를 나누어요. 앞 항목이 끝난 곳에 이어서 다음 항목을 그려요.")
        for k in range(4):
            self.play(FadeIn(bd.segs[k], shift=RIGHT * 0.2), run_time=0.45)
        self.say(f"④ 항목과 백분율을 써요", "나눈 부분에 항목과 백분율을 써요.")
        self.play(FadeIn(bd.labs), run_time=0.6)
        title = M(f"⑤ {o('아침에 먹은 음식')}", 36).move_to([0, 2.2, 0])
        self.say(f"⑤ {o('제목')}을 써요", "마지막으로 알맞은 제목을 써요.")
        self.play(FadeIn(title), run_time=0.5)
        self.wait(0.8)
        self.settle()
        clear_stage(self, 0.6)

    def draw_pie(self):
        self.section("③ ④ 원그래프")
        C = np.array([-1.6, 0.0, 0])
        pc = pie(ITEMS, r=1.9, center=C, size=26)
        base = pie([(" ", 100, "#FFFFFF")], r=1.9, center=C, show_pct=False)
        ck = pie_ticks(pc, step=5)
        self.say("눈금이 있는 원에", "이번에는 둘레에 눈금이 있는 원이에요.")
        self.play(FadeIn(base.segs), FadeIn(ck), run_time=0.6)
        self.say(f"③ {o('중심에서 눈금까지')} 선을 그어요", "원은 중심에서 눈금까지 선을 그어 나누어요. 12시 방향부터 시계 방향으로 이어서 그려요.")
        a = PI / 2
        for k, (_, p, _) in enumerate(ITEMS):
            a -= TAU * p / 100
            ln = Line(C, C + 1.9 * np.array([np.cos(a), np.sin(a), 0]), color=INK, stroke_width=4)
            self.play(Create(ln), FadeIn(pc.segs[k]), run_time=0.45)
        self.play(FadeIn(pc.labs), run_time=0.6)
        title = M(f"⑤ {o('아침에 먹은 음식')}", 34).move_to([3.6, 1.4, 0])
        t = M(f"띠그래프와 같은 자료,\n합계 {g('100 %')}", 32).move_to([3.6, 0.0, 0])
        self.say("⑤ 제목까지 쓰면 완성", "항목과 백분율, 제목을 쓰면 원그래프도 완성이에요.")
        self.play(FadeIn(title), FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
