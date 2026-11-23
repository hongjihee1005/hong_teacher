"""「수학 원리 돋보기」 나눗셈 차근차근 9화 — 나누어떨어진다는 것

12 ÷ 4 = 3(남는 것 없음, 나머지 0) → '나누어떨어진다' / 13 ÷ 4 = 3 … 1 → 나누어떨어지지 않음
연습: 18 ÷ 3, 19 ÷ 3, 20 ÷ 5, 22 ÷ 4 중 나누어떨어지는 것
최종: GRADE=d ./make_final.sh 9
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene
from items import check_mark, cross_mark, group_boxes, layout
from prepkit import RED, items

PUR = "#B05FD0"


def pur(s):
    return f'<span foreground="{PUR}">{s}</span>'


class GdEp09(DivScene):
    EP_NO = 9
    EP_TITLE = "나누어떨어진다는 것"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.compare()
        self.practice()
        self.closing(f"나머지가 {g('0')}이면 → {g('나누어떨어진다')}고 해요\n12 ÷ 4 = 3 (나누어떨어짐) · 13 ÷ 4 = 3 … 1 (아님)",
                     next_preview="나눗셈 차근차근 10화 · 나눗셈이 맞는지 확인하기")
        self.wait(0.5)

    def row(self, n, y):
        its = items(n, y=y, step=0.48, r=0.19)
        pts = layout(n, 4, n // 4, y=y, step=0.48, gap=0.8)
        for m, p in zip(its, pts):
            m.move_to(p + [-3.0, 0, 0])
        bx = group_boxes(list(its), 4, n // 4)
        return its, bx

    def compare(self):
        self.section("남는 것이 없으면")
        its1, bx1 = self.row(12, 1.5)
        its2, bx2 = self.row(13, -0.6)
        self.say("12개와 13개를 4개씩 묶어요", "구슬 12개와 13개를 각각 4개씩 묶어 볼까요?")
        self.play(FadeIn(its1), FadeIn(its2), run_time=0.6)
        self.play(FadeIn(bx1), FadeIn(bx2), run_time=0.6)
        e1 = M(f"12 ÷ 4 = 3  (나머지 {g('0')})", 40)
        e1.move_to([1.3 + e1.width / 2, 1.5, 0])
        e2 = M(f"13 ÷ 4 = 3 … {pur('1')}", 40)
        e2.move_to([1.3 + e2.width / 2, -0.6, 0])
        self.say(f"12는 남는 것이 {g('없어요')}", "12개는 남는 것이 하나도 없어요. 나머지가 0이에요.")
        self.play(FadeIn(e1), run_time=0.5)
        self.say(f"13은 {pur('1개')}가 남아요", "13개는 1개가 남아요. 나머지가 1이에요.")
        self.play(FadeIn(e2), Indicate(its2[-1], color=PUR, scale_factor=1.5), run_time=0.7)
        t = M(f"나머지가 {g('0')}일 때 → '12는 4로 {g('나누어떨어진다')}'", 46).move_to([0, -2.1, 0])
        self.say(f"나머지가 0이면 {g('나누어떨어진다')}", "이렇게 나머지가 0일 때, 12는 4로 나누어떨어진다고 해요. 13은 4로 나누어떨어지지 않아요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        exprs = [("18 ÷ 3", 18, 3), ("19 ÷ 3", 19, 3), ("20 ÷ 5", 20, 5), ("22 ÷ 4", 22, 4)]
        cards = VGroup(*[M(e[0], 60) for e in exprs]).arrange(RIGHT, buff=1.2).move_to([0, 1.0, 0])
        self.say("나누어떨어지는 것을 모두 고르세요", "연습해 볼까요? 나누어떨어지는 나눗셈을 모두 골라 보세요.")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        res = VGroup()
        for c, (_, a, d) in zip(cards, exprs):
            q, r = divmod(a, d)
            mk = (check_mark(0.45) if r == 0 else cross_mark(0.35)).next_to(c, DOWN, buff=0.35)
            lab = M(f"{q}" if r == 0 else f"{q} … {pur(str(r))}", 40).next_to(mk, DOWN, buff=0.25)
            res.add(mk, lab)
        self.say(f"{g('18 ÷ 3, 20 ÷ 5')}가 나누어떨어져요", "18 나누기 3은 6, 20 나누기 5는 4로 나누어떨어져요. 19 나누기 3과 22 나누기 4는 나머지가 있어요.")
        self.play(FadeIn(res, lag_ratio=0.15), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
