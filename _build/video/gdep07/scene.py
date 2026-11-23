"""「수학 원리 돋보기」 나눗셈 차근차근 7화 — 똑같이 나누고 남으면? 나머지

구슬 13개를 4명에게 → 3개씩, 1개 남음 → 13 ÷ 4 = 3 … 1, '13 나누기 4는 몫이 3이고 나머지가 1'
연습: 11개를 3명에게 → 3 … 2
최종: GRADE=d ./make_final.sh 7
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene, deal, term_eq, term_labels
from prepkit import RED, PINK, dish, items

PUR = "#B05FD0"


class GdEp07(DivScene):
    EP_NO = 7
    EP_TITLE = "똑같이 나누고 남으면? 나머지"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.share(13, 4, RED)
        self.write()
        self.practice()
        self.closing(f"똑같이 나누고 남은 수 = {M_pur('나머지')}\n13 ÷ 4 = {g('3')} … {M_pur('1')}  '몫이 3이고 나머지가 1'",
                     next_preview="나눗셈 차근차근 8화 · 나머지는 왜 나누는 수보다 작을까?")
        self.wait(0.5)

    def share(self, a, d, color, quick=False):
        self.section("똑같이 나누어 보기")
        its = items(a, color=color, y=2.1, step=0.5, r=0.2)
        names = ["가", "나", "다", "라", "마"][:d]
        dishes = VGroup(*[dish(n, w=2.0, h=0.75) for n in names]).arrange(RIGHT, buff=0.5).move_to([0, -0.3, 0])
        self.say(f"구슬 {a}개를 {d}명에게 똑같이", f"구슬 {a}개를 {d}명에게 똑같이 나누어 볼까요?")
        self.play(FadeIn(its, lag_ratio=0.04), FadeIn(dishes), run_time=0.8)
        q, r = divmod(a, d)
        deal(self, its[:q * d], dishes, quick=True)
        left = VGroup(*its[q * d:])
        box = SurroundingRectangle(left, color=PUR, buff=0.12, stroke_width=6)
        self.say(f"한 명에게 {g(str(q) + '개')}, {M_pur(str(r) + '개')}가 남아요",
                 f"한 명에게 {q}개씩 주고 나니 {r}개가 남았어요. 남은 {r}개는 {d}명에게 똑같이 나누어 줄 수 없어요.")
        self.play(Create(box), Indicate(left, color=PUR), run_time=0.8)
        self.wait(1.0)
        self.settle()
        self.stuff = VGroup(its, dishes, box)

    def write(self):
        self.section("나머지와 쓰는 법")
        self.play(self.stuff.animate.scale(0.6).move_to([0, 1.6, 0]), run_time=0.6)
        eq = term_eq(13, 4, 3, 1, size=96).move_to([0, -0.4, 0])
        self.say(f"남은 1을 {M_pur('나머지')}라고 해요", "남은 1을 나머지라고 해요. 식으로는 이렇게 써요.")
        self.play(Write(eq), run_time=1.0)
        labs = term_labels(eq, 30)
        self.play(FadeIn(labs[2]), FadeIn(labs[3]), run_time=0.6)
        r = M(f"읽기: '13 나누기 4는 몫이 {g('3')}이고 나머지가 {M_pur('1')}입니다'", 40).move_to([0, -2.25, 0])
        self.say("13 나누기 4는 몫이 3이고 나머지가 1", "13 나누기 4는 몫이 3이고 나머지가 1입니다, 라고 읽어요. 점 세 개 뒤에 나머지를 써요.")
        self.play(FadeIn(r), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def practice(self):
        self.section("연습해요")
        q = M("구슬 11개를 3명에게 똑같이 나누면?", 50).move_to([0, 1.0, 0])
        self.say("11개를 3명에게 나누면?", "연습해 볼까요? 구슬 11개를 3명에게 똑같이 나누면 몫과 나머지는 얼마일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.3)
        self.share(11, 3, PINK, quick=True)
        eq = M(f"11 ÷ 3 = {g('3')} … {M_pur('2')}", 70).move_to([0, -2.0, 0])
        self.say(f"11 ÷ 3 = {g('3')} … {M_pur('2')}", "한 명에게 3개씩, 2개가 남아요. 11 나누기 3은 몫이 3이고 나머지가 2예요.")
        self.play(Write(eq), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def M_pur(s):
    return f'<span foreground="{PUR}">{s}</span>'
