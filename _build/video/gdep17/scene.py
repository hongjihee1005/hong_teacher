"""「수학 원리 돋보기」 나눗셈 차근차근 17화 — 나눗셈 문장제 3단계

① 전체(나누어지는 수) 찾기 ② 몇으로 나누는지(나누는 수) 찾기 ③ 식을 쓰고 답에 알맞은 단위
예: 연필 35자루를 5명에게 똑같이 → 35 ÷ 5 = 7, 7자루 / 연습: 귤 27개를 4개씩 담으면 → 6봉지, 3개 남음
최종: GRADE=d ./make_final.sh 17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene
from fracbasic import step_card

PUR = "#B05FD0"


def pur(s):
    return f'<span foreground="{PUR}">{s}</span>'


class GdEp17(DivScene):
    EP_NO = 17
    EP_TITLE = "나눗셈 문장제 3단계"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.solve("연필 {A}자루를 {D}명에게 똑같이 나누어 주면\n한 명에게 몇 자루씩 줄 수 있을까요?", 35, 5, "자루",
                   "연필 35자루를 5명에게 똑같이 나누어 주면, 한 명에게 몇 자루씩 줄 수 있을까요?", sec="3단계로 풀기")
        a = M(f"답: 한 명에게 {g('7자루')}", 50).move_to([0, -2.0, 0])
        self.say(f"답: {g('7자루')}", "몫 7에 알맞은 단위를 붙여요. 답은 한 명에게 7자루예요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)
        self.practice()
        self.closing(f"① 전체 = {b('나누어지는 수')}  ② 몇으로 = {o('나누는 수')}\n③ 식 쓰고, 답에 {g('알맞은 단위')}(나머지의 뜻도 함께)",
                     next_preview="나눗셈 차근차근 18화 · 곱셈일까 나눗셈일까?")
        self.wait(0.5)

    def solve(self, tmpl, a, d, unit, narr, sec, quick=False):
        self.section(sec)
        text = tmpl.format(A=b(str(a)), D=o(str(d)))
        q = M(text, 42).move_to([0, 1.95, 0])
        self.say("문제를 읽어요", narr)
        self.play(FadeIn(q), run_time=0.6)
        if not quick:
            self.wait(0.6)
            self.pause_screen(5)
            self.settle()
        c1 = step_card(1, f"전체는? → {b(str(a))} ({b('나누어지는 수')})", size=40).move_to([0, 0.9, 0])
        self.say(f"1단계: 전체는 {b(str(a))}", f"1단계. 처음에 있는 전체는 {a}예요. 나누어지는 수예요.")
        self.play(FadeIn(c1), run_time=0.5)
        c2 = step_card(2, f"몇으로 나누나? → {o(str(d))} ({o('나누는 수')})", size=40).move_to([0, 0.0, 0])
        self.say(f"2단계: 몇으로? {o(str(d))}", f"2단계. 몇으로 나누는지 찾아요. {d}로 나누어요.")
        self.play(FadeIn(c2), run_time=0.5)
        qq, r = divmod(a, d)
        rtxt = f" … {pur(str(r))}" if r else ""
        c3 = step_card(3, f"식: {a} ÷ {d} = {g(str(qq))}{rtxt}", size=40).move_to([0, -0.9, 0])
        self.say(f"3단계: {a} ÷ {d} = {qq}" + (f" … {r}" if r else ""), f"3단계. 식을 쓰고 계산해요. {a} 나누기 {d}는 {qq}" + (f", 나머지 {r}." if r else "."))
        self.play(FadeIn(c3), run_time=0.5)
        return qq, r

    def practice(self):
        self.section("연습해요")
        qq, r = self.solve("귤 {A}개를 한 봉지에 {D}개씩 담으면\n몇 봉지가 되고, 몇 개가 남을까요?", 27, 4, "봉지",
                           "연습해 볼까요? 귤 27개를 한 봉지에 4개씩 담으면 몇 봉지가 되고, 몇 개가 남을까요?", sec="연습해요")
        a = M(f"답: {g('6봉지')}가 되고 {pur('3개')}가 남아요", 50).move_to([0, -2.0, 0])
        self.say(f"답: {g('6봉지')}, {pur('3개')} 남음", "몫 6은 봉지 수, 나머지 3은 남은 귤이에요. 답은 6봉지가 되고 3개가 남아요. 단위를 꼭 붙여요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
