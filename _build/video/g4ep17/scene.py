"""「수학 원리 돋보기」 4학년 17화 — 몫이 두 자리인 나눗셈 (4-1 3단원 6·7차시, 화 코드 4-1-3-e)

736 ÷ 32 = 23: 32 × 20 = 640 빼고 남은 96에서 32 × 3 = 96 → 몫 20 + 3
950 ÷ 45 = 21 … 5: 마지막에 남은 수가 나머지(나누는 수보다 작음)
최종: GRADE=4 ./make_final.sh 17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage, j
from divlong import LongDiv


class G4Ep17(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 17
    EP_TITLE = "몫이 두 자리인 나눗셈"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.split(736, 32)
        self.longdiv(736, 32, "736 ÷ 32 세로셈")
        self.longdiv(950, 45, "950 ÷ 45 세로셈")
        self.closing(f"몫을 {b('십의 자리')}와 {o('일의 자리')}로 나누어 구해요\n마지막에 남은 수가 {g('나머지')} (나누는 수보다 작아요)",
                     next_preview="4학년 18화 · 어림셈은 언제 쓸까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M(f"자원봉사자 {b('736명')}을 {o('32명')}씩 모둠으로 나누면\n몇 모둠이 될까요?", 50)
        q.scale_to_fit_width(min(q.width, 11.0)).move_to([0, 1.4, 0])
        self.say("736명을 32명씩", "축제 자원봉사자 736명을 32명씩 모둠으로 나누면 몇 모둠이 될까요?")
        self.play(Write(q), run_time=1.2)
        e = M("736 ÷ 32 = ?", 100).move_to([0, -0.8, 0])
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.0)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def split(self, a, d):
        self.section("몫을 두 번에 나누어 구하기")
        rows = [
            (f"32 × {b('10')} = 320", "32 곱하기 10은 320."),
            (f"32 × {b('20')} = {b('640')}  ← 736을 넘지 않아요", "32 곱하기 20은 640, 736을 넘지 않아요. 32 곱하기 30은 960이라 너무 커요."),
            (f"736 − 640 = {o('96')}", "736에서 640을 빼면 96이 남아요."),
            (f"32 × {o('3')} = {o('96')}  ← 남은 96을 다시 나눠요", "남은 96을 다시 32로 나누면, 32 곱하기 3은 96."),
            (f"몫 = {b('20')} + {o('3')} = {g('23')}", "그래서 몫은 20과 3을 더한 23이에요. 23모둠이 돼요."),
        ]
        ms = VGroup(*[M(r, 44) for r, _ in rows]).arrange(DOWN, aligned_edge=LEFT, buff=0.28).move_to([0, 0.15, 0])
        ms.scale_to_fit_width(min(ms.width, 11.6))
        self.say(f"먼저 {b('몇십')}을 곱해 봐요", "몫을 한 번에 찾기 어려우면 두 번에 나누어 찾아요. 먼저 32에 몇십을 곱해 봐요.")
        for m, (mk, nar) in zip(ms, rows):
            self.say(mk, nar)
            self.play(FadeIn(m, shift=RIGHT * 0.2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def longdiv(self, a, d, sec):
        self.section(sec)
        q, r = divmod(a, d)
        qt, qu = q // 10, q % 10
        L = LongDiv(self, a, d, x_right=-1.0, y0=1.6, dy=0.78)
        self.say("세로셈으로 계산해요", f"{a} 나누기 {d}를 세로셈으로 계산해 볼게요.")
        L.show()
        first = a // 10
        self.say(f"{first} ÷ {d} → 몫 {b(str(qt))}는 {b('십의 자리')} 위에",
                 f"먼저 앞의 두 자리 {j(first, '을를')} {j(d, '으로')} 나누면 몫이 {qt}. 십의 자리 위에 {j(qt, '을를')} 써요. 이것은 {j(qt * 10, '을를')} 뜻해요.")
        L.quot(qt, color=BLUE, right_k=1)
        rest1 = a - d * qt * 10
        self.say(f"{d} × {qt} = {o(str(d * qt))} 빼고 {a % 10} 내리기",
                 f"{d} 곱하기 {qt}, {j(d * qt, '을를')} 쓰고 빼면 {first - d * qt}. 일의 자리 {j(a % 10, '을를')} 내려 쓰면 {j(rest1, '이가')} 돼요.")
        L.sub_line(d * qt, rest1, right_k=1, rest_k=0)
        self.say(f"{rest1} ÷ {d} → 몫 {o(str(qu))}은 {o('일의 자리')} 위에",
                 f"이제 {j(rest1, '을를')} {j(d, '으로')} 나누면 몫이 {qu}. 일의 자리 위에 {j(qu, '을를')} 써요.")
        L.quot(qu, color=ORANGE, right_k=0)
        self.say(f"{d} × {qu} = {o(str(d * qu))}, 남은 수 {g(str(r))}",
                 f"{d} 곱하기 {qu}, {j(d * qu, '을를')} 빼면 {j(r, '이가')} 남아요." + (f" {j(r, '은는')} {d}보다 작으니 나머지예요." if r else " 나누어떨어져요."))
        L.sub_line(d * qu, r, right_k=0, rest_k=0)
        ans = M(f"{a} ÷ {d} = {g(str(q))}" + (f" … {o(str(r))}" if r else ""), 56).move_to([3.5, 0.6, 0])
        chk = M(f"확인: {d} × {q}" + (f" + {r}" if r else "") + f" = {g(str(a))}", 44).move_to([3.5, -0.4, 0])
        VGroup(ans, chk).scale_to_fit_width(min(VGroup(ans, chk).width, 6.4))
        self.say(f"{a} ÷ {d} = {g(str(q))}" + (f" … {o(str(r))}" if r else ""), f"그래서 {a} 나누기 {d}는 몫이 {q}" + (f", 나머지가 {j(r, '이에요')}." if r else "예요."))
        self.play(FadeIn(ans), FadeIn(chk), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        if a == 950:
            self.hide_chip()
