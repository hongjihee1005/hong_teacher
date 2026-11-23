"""「수학 원리 돋보기」 나눗셈 차근차근 18화 — 곱셈일까 나눗셈일까?

구별: 전체를 모르고 구하면 곱셈(한 봉지 6개씩 4봉지 → 24), 전체를 알고 나누면 나눗셈(24개를 6개씩 → 4봉지)
연습 3문제: 한 상자에 8개씩 5상자 → 곱셈 40 / 사과 32개를 4명에게 → 나눗셈 8 / 의자 7개씩 6줄 → 곱셈 42
최종: GRADE=d ./make_final.sh 18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene
from items import group_boxes, layout
from prepkit import RED, items


class GdEp18(DivScene):
    EP_NO = 18
    EP_TITLE = "곱셈일까 나눗셈일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.pair()
        self.rule()
        self.practice()
        self.closing(f"{g('전체')}를 구하면 → {b('곱셈')}\n{g('전체')}를 알고 똑같이 나누면 → {o('나눗셈')}",
                     next_preview="나눗셈 차근차근 19화 · 거꾸로 생각하기: 어떤 수 구하기")
        self.wait(0.5)

    def pic(self, y):
        its = items(24, y=y, step=0.3, r=0.12)
        pts = layout(24, 6, 4, y=y, step=0.3, gap=0.6)
        for m, p in zip(its, pts):
            m.move_to(p)
        return VGroup(its, group_boxes(list(its), 6, 4))

    def pair(self):
        self.section("두 문제 견주기")
        q1 = M(f"① 한 봉지에 6개씩 {b('4봉지')}면 모두 몇 개?", 40).move_to([0, 2.4, 0])
        p1 = self.pic(1.5)
        a1 = M(f"전체를 {g('모름')} → 6 × 4 = {b('24')} ({b('곱셈')})", 40).move_to([0, 0.75, 0])
        self.say("① 6개씩 4봉지, 모두 몇 개?", "첫째 문제. 한 봉지에 6개씩 4봉지면 모두 몇 개일까요? 전체를 모르니 곱셈으로 구해요.")
        self.play(FadeIn(q1), FadeIn(p1), run_time=0.6)
        self.play(FadeIn(a1), run_time=0.5)
        q2 = M(f"② {g('24개')}를 6개씩 담으면 몇 봉지?", 40).move_to([0, -0.3, 0])
        p2 = self.pic(-1.1)
        a2 = M(f"전체 24를 {g('앎')} → 24 ÷ 6 = {o('4')} ({o('나눗셈')})", 40).move_to([0, -1.95, 0])
        self.say("② 24개를 6개씩, 몇 봉지?", "둘째 문제. 24개를 6개씩 담으면 몇 봉지일까요? 전체 24를 알고 나누니 나눗셈이에요.")
        self.play(FadeIn(q2), FadeIn(p2), run_time=0.6)
        self.play(FadeIn(a2), run_time=0.5)
        self.say("그림은 같아도 묻는 것이 달라요", "두 문제의 그림은 똑같아요. 무엇을 묻는지가 달라요.")
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self):
        self.section("가려내는 방법")
        r1 = M(f"'모두 몇 개?' — {g('전체')}를 구해요 → {b('곱셈')}", 48).move_to([0, 1.0, 0])
        r2 = M(f"'몇씩? 몇 묶음?' — {g('전체')}를 알고 나눠요 → {o('나눗셈')}", 48).move_to([0, -0.2, 0])
        self.say("전체를 구하는지, 알고 나누는지", "문제에서 전체를 구하는지, 전체를 알고 나누는지를 보면 돼요.")
        self.play(FadeIn(r1), run_time=0.6)
        self.play(FadeIn(r2), run_time=0.6)
        t = M("헷갈리면 그림을 그려 보아요", 40, SOFT).move_to([0, -1.5, 0])
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        qs = [("① 한 상자에 8개씩 5상자, 모두 몇 개?", f"{b('곱셈')} 8 × 5 = 40"),
              ("② 사과 32개를 4명에게 똑같이 나누면?", f"{o('나눗셈')} 32 ÷ 4 = 8"),
              ("③ 의자를 한 줄에 7개씩 6줄 놓으면 모두?", f"{b('곱셈')} 7 × 6 = 42")]
        rows = VGroup(*[M(q, 36) for q, _ in qs]).arrange(DOWN, buff=0.6, aligned_edge=LEFT).move_to([0, 0.6, 0])
        rows.shift(RIGHT * (-6.5 - rows.get_left()[0]))
        self.say("곱셈일까 나눗셈일까?", "연습해 볼까요? 세 문제가 곱셈인지 나눗셈인지 가려내고 답을 구해 보세요.")
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=0.9)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        ans = VGroup(*[M(a, 32).next_to(r, RIGHT, buff=0.4) for r, (_, a) in zip(rows, qs)])
        self.say("① 곱셈 ② 나눗셈 ③ 곱셈", "1번은 곱셈으로 40, 2번은 나눗셈으로 8, 3번은 곱셈으로 42예요.")
        self.play(FadeIn(ans, lag_ratio=0.3), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
