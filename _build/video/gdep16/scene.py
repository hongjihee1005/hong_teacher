"""「수학 원리 돋보기」 나눗셈 차근차근 16화 — 두 자리 수로 나누기: 몫 어림하기

76 ÷ 19: 19를 20으로 어림 → 76 ÷ 20 → 약 3 → 19 × 3 = 57, 76 − 57 = 19(나머지가 나누는 수와 같아 너무 큼) → 1 크게 → 19 × 4 = 76
164 ÷ 52: 50으로 어림 → 3 → 52 × 3 = 156, 나머지 8 / 크면 1 작게, 나머지가 크면 1 크게
최종: GRADE=d ./make_final.sh 16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene
from divlong import LongDiv
from fracbasic import step_card
from items import check_mark, cross_mark

PUR = "#B05FD0"


def pur(s):
    return f'<span foreground="{PUR}">{s}</span>'


class GdEp16(DivScene):
    EP_NO = 16
    EP_TITLE = "두 자리 수로 나누기: 몫 어림하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.estimate()
        self.longdiv(76, 19)
        self.second()
        self.longdiv(164, 52)
        self.closing(f"나누는 수를 {o('몇십')}으로 어림해 몫을 짐작 → 곱해서 확인\n곱이 {o('크면')} 몫을 1 작게, {pur('나머지')}가 나누는 수보다 크거나 같으면 1 크게",
                     next_preview="나눗셈 차근차근 17화 · 나눗셈 문장제 3단계")
        self.wait(0.5)

    def estimate(self):
        self.section("76 ÷ 19, 몫을 어림해요")
        q = M(f"{b('76')} ÷ {o('19')} = ?", 80).move_to([0, 2.3, 0])
        self.say("76 ÷ 19, 19단은 몰라요", "76 나누기 19를 해 볼까요? 19단은 외우지 않았으니 몫을 어림해요.")
        self.play(Write(q), run_time=0.6)
        c1 = step_card(1, f"19를 {o('20')}으로 어림: 76 ÷ 20 → 몫은 약 {g('3')}", size=38).move_to([0, 1.1, 0])
        self.say("1단계: 19를 20으로 어림하면 약 3", "1단계. 19는 20에 가까우니 20으로 어림해요. 20 곱하기 3은 60, 20 곱하기 4는 80이니 몫은 약 3이에요.")
        self.play(FadeIn(c1), run_time=0.6)
        c2 = step_card(2, f"곱해서 확인: 19 × 3 = 57, 76 − 57 = {pur('19')}", size=38).move_to([0, 0.1, 0])
        self.say("2단계: 19 × 3 = 57, 남은 수 19", "2단계. 곱해서 확인해요. 19 곱하기 3은 57, 76에서 빼면 19가 남아요.")
        self.play(FadeIn(c2), run_time=0.6)
        c3 = step_card(3, f"남은 수 {pur('19')}가 나누는 수 19와 같아요 → 몫을 {g('1 크게')}: 4", size=38).move_to([0, -0.9, 0])
        self.say(f"3단계: 남은 수가 너무 커요 → {g('4')}", "3단계. 남은 19가 나누는 수 19와 같으니 한 번 더 나눌 수 있어요. 몫을 1 크게 해서 4로 고쳐요.")
        self.play(FadeIn(c3), run_time=0.6)
        a = M(f"19 × {g('4')} = 76 → 76 ÷ 19 = {g('4')}", 52).move_to([0, -2.0, 0])
        self.say(f"19 × 4 = 76, 몫은 {g('4')}", "19 곱하기 4는 76. 76 나누기 19는 나누어떨어지고 몫은 4예요.")
        self.play(FadeIn(a), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def longdiv(self, a, d):
        self.section(f"세로셈으로: {a} ÷ {d}")
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
        self.say(f"확인: {d} × {q} + {r} = {g(str(a))}", f"맞는지 확인해요. {d} 곱하기 {q}에 나머지 {r}을 더하면 {a}예요.")
        self.play(FadeIn(chk), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def second(self):
        self.section("164 ÷ 52도 어림해요")
        q = M(f"{b('164')} ÷ {o('52')} = ?", 80).move_to([0, 2.0, 0])
        self.say("164 ÷ 52는?", "이번에는 164 나누기 52예요. 어떻게 어림할까요?")
        self.play(Write(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        t1 = M(f"52를 {o('50')}으로 어림: 50 × 3 = 150 → 몫은 약 {g('3')}", 44).move_to([0, 0.7, 0])
        t2 = M(f"52 × 3 = 156, 164 − 156 = {pur('8')} (8 &lt; 52 이니 알맞아요)", 44).move_to([0, -0.3, 0])
        self.say("52를 50으로 어림해 약 3", "52를 50으로 어림하면 50 곱하기 3이 150이라 몫은 약 3이에요.")
        self.play(FadeIn(t1), run_time=0.6)
        self.say(f"52 × 3 = 156, 나머지 {pur('8')}", "52 곱하기 3은 156, 164에서 빼면 8이 남아요. 8은 52보다 작으니 몫 3이 알맞아요.")
        self.play(FadeIn(t2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)
