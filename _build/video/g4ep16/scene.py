"""「수학 원리 돋보기」 4학년 16화 — 몫이 한 자리인 (몇십몇)으로 나누기 (4-1 3단원 5차시, 화 코드 4-1-3-d)

76 ÷ 19 = 4 (19를 20으로 어림 → 20 × 4 = 80 > 76? 19 × 4 = 76) / 164 ÷ 52 = 3 … 8
확인: 나누는 수 × 몫 + 나머지 = 나누어지는 수
최종: GRADE=4 ./make_final.sh 16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Cross, FadeIn, FadeOut, Indicate, LaggedStart,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from divlong import LongDiv

RED = "#C0392B"


class G4Ep16(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 16
    EP_TITLE = "몫이 한 자리인 (몇십몇)으로 나누기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.table(76, 19, [3, 4, 5])
        self.longdiv(76, 19, "76 ÷ 19 세로셈")
        self.table(164, 52, [2, 3, 4])
        self.longdiv(164, 52, "164 ÷ 52 세로셈")
        self.closing(f"나누는 수에 몇을 곱해야 {o('넘지 않으면서 가장 가까운지')} 찾아요\n확인: 나누는 수 × 몫 + 나머지 = {g('나누어지는 수')}",
                     next_preview="4학년 17화 · 몫이 두 자리인 나눗셈")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"색종이 {b('76장')}을 한 사람에게 {o('19장')}씩 주면\n몇 명에게 줄 수 있을까요?", 50)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0, 1.4, 0])
        self.say("76장을 19장씩", "색종이 76장을 한 사람에게 19장씩 주면 몇 명에게 줄 수 있을까요?")
        self.play(Write(q), run_time=1.2)
        e = M("76 ÷ 19 = ?", 100).move_to([0, -0.8, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def table(self, a, d, ks):
        self.section("곱셈으로 몫 찾기")
        q = M(f"{a} ÷ {d}", 72).move_to([0.6, 2.05, 0])
        near = round(d, -1)
        self.say(f"{d}를 {o(str(near))}으로 어림해요", f"{d}는 {near}에 가까워요. {near}에 몇을 곱하면 {a}에 가까울까요? 그 근처를 {d}로 곱해 봐요.")
        self.play(FadeIn(q), run_time=0.5)
        rows = VGroup(*[M(f"{d} × {k} = {d * k}", 52) for k in ks]).arrange(DOWN, buff=0.3).move_to([-2.6, -0.2, 0])
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3, run_time=1.0))
        best = max(k for k in ks if d * k <= a)
        for i, k in enumerate(ks):
            if d * k > a:
                self.play(Create(Cross(rows[i], stroke_color=RED, stroke_width=6)), run_time=0.4)
        i = ks.index(best)
        self.say(f"{a}를 넘지 않는 가장 큰 곱 → {g(f'{d} × {best}')}", f"{a}를 넘지 않으면서 가장 가까운 곱은 {d} 곱하기 {best}, {d * best}이에요.")
        self.play(Create(SurroundingRectangle(rows[i], color=GREEN, buff=0.1, stroke_width=5)), run_time=0.5)
        r = a - d * best
        res = M(f"{a} ÷ {d} = {g(str(best))}" + (f" … {o(str(r))}" if r else ""), 58).move_to([3.0, 0.2, 0])
        self.say(f"몫 {g(str(best))}" + (f", 나머지 {o(str(r))}" if r else ", 나누어떨어져요"),
                 f"몫은 {best}" + (f", 나머지는 {r}이에요." if r else "이고, 나누어떨어져요."))
        self.play(FadeIn(res), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def longdiv(self, a, d, sec):
        self.section(sec)
        q, r = divmod(a, d)
        L = LongDiv(self, a, d, x_right=-1.2, y0=1.5)
        self.say("세로셈으로 써 볼까요?", f"{a} 나누기 {d}를 세로셈으로 써 볼까요?")
        L.show()
        self.say(f"몫 {g(str(q))}은 일의 자리 위에", f"몫 {q}는 일의 자리 위에 써요.")
        L.quot(q)
        self.say(f"{d} × {q} = {o(str(d * q))}을 쓰고 빼요", f"{d} 곱하기 {q}, {d * q}를 아래에 쓰고 빼면 {r}이 남아요.")
        L.sub_line(d * q, r)
        chk = M(f"확인: {d} × {q} + {r} = {g(str(a))}", 50).move_to([3.4, 0.3, 0])
        chk.scale_to_fit_width(min(chk.width, 6.4))
        self.say(f"확인: {d} × {q} + {r} = {g(str(a))}", f"맞는지 확인해요. {d} 곱하기 {q}에 나머지 {r}을 더하면 {a}. 나누어지는 수와 같아요." +
                 (f" 나머지 {r}은 나누는 수 {d}보다 작아요." if r else ""))
        self.play(FadeIn(chk), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        if a == 164:
            self.hide_chip()
