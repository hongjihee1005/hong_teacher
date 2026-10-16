"""「수학 원리 돋보기」 4학년 6화 — 큰 수의 크기 비교 (4-1 1단원 큰 수 8차시, 화 코드 4-1-1-f)

자리 수가 다르면 자리 수가 많은 쪽이 큼(12345678 > 9876543)
자리 수가 같으면 높은 자리부터 차례로 비교(52814790 < 52831045)
최종: GRADE=4 ./make_final.sh 6
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Rectangle,
                   SurroundingRectangle, Transform, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from bignum import digit_row, mix_form, pcol, span

PNAME = ["일", "십", "백", "천", "만", "십만", "백만", "천만", "억"]


class G4Ep06(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 6
    EP_TITLE = "큰 수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.diff_len()
        self.same_len()
        self.quiz()
        self.closing(f"자리 수가 다르면 {o('자리 수가 많은 쪽')}이 커요\n자리 수가 같으면 {g('높은 자리부터')} 차례로 비교해요",
                     next_preview="4학년 7화 · 각의 크기는 무엇으로 정할까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("두 지역의 나눔 성금 중 어느 쪽이 더 많을까요?", 50).move_to([0, 2.0, 0])
        a = M(f"가 지역  {span('52814790', INK)}원", 60).move_to([0, 0.6, 0])
        b = M(f"나 지역  {span('52831045', INK)}원", 60).move_to([0, -0.5, 0])
        self.say("어느 쪽이 더 많을까요?", "두 지역에서 모은 나눔 성금이에요. 어느 쪽이 더 많을까요?")
        self.play(Write(q), run_time=1.0)
        self.play(FadeIn(a, shift=UP * 0.2), FadeIn(b, shift=UP * 0.2), run_time=0.8)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def diff_len(self):
        self.section("자리 수가 다르면")
        r1 = digit_row("12345678", 2.2, 1.3, size=70, step=0.62)
        r2 = digit_row("9876543", 2.2, -0.1, size=70, step=0.62)
        self.say("12345678과 9876543", "먼저 12345678과 9876543을 비교해 볼까요? 9876543은 맨 앞 숫자가 9라서 더 커 보여요.")
        self.play(FadeIn(r1), FadeIn(r2), run_time=0.7)
        self.play(Indicate(r2[0], color=ORANGE, scale_factor=1.4), run_time=0.7)
        self.say("자리 수부터 세어 봐요", "하지만 먼저 자리 수를 세어 봐요. 오른쪽 끝, 일의 자리를 맞추어 놓았어요.")
        c1 = T("8자리", 44, BLUE).next_to(r1, RIGHT, buff=0.6)
        c2 = T("7자리", 44, BLUE).next_to(r2, RIGHT, buff=0.6).align_to(c1, LEFT)
        self.play(LaggedStart(*[Indicate(d, color=BLUE, scale_factor=1.2) for d in r1[::-1]], lag_ratio=0.08, run_time=1.0), FadeIn(c1))
        self.play(LaggedStart(*[Indicate(d, color=BLUE, scale_factor=1.2) for d in r2[::-1]], lag_ratio=0.08, run_time=1.0), FadeIn(c2))
        gap = SurroundingRectangle(r1[0], color=ORANGE, buff=0.12, stroke_width=5)
        self.say(f"{span('천만의 자리', pcol(7))}가 있는 쪽이 더 커요", "12345678은 천만의 자리가 있고, 9876543은 없어요. 그래서 자리 수가 많은 12345678이 더 커요.")
        self.play(Create(gap), run_time=0.6)
        res = M(f"12345678  {g('&gt;')}  9876543", 66).move_to([0, -1.6, 0])
        self.play(FadeIn(res, shift=UP * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def same_len(self):
        self.section("자리 수가 같으면")
        a, b = "52814790", "52831045"
        r1 = digit_row(a, 2.6, 1.5, size=70, step=0.68)
        r2 = digit_row(b, 2.6, 0.35, size=70, step=0.68)
        la = T("가", 44, SOFT).next_to(r1, LEFT, buff=0.6)
        lb = T("나", 44, SOFT).next_to(r2, LEFT, buff=0.6)
        self.say("둘 다 8자리예요", "이제 처음 문제예요. 가 지역과 나 지역의 성금은 둘 다 8자리예요.")
        self.play(FadeIn(r1), FadeIn(r2), FadeIn(la), FadeIn(lb), run_time=0.7)
        self.say(f"{g('높은 자리부터')} 차례로 비교해요", "자리 수가 같으면 가장 높은 자리부터 차례로 비교해요.")
        frame = None
        note = None
        for i in range(8):
            k = 7 - i
            col = VGroup(r1[i], r2[i])
            box = SurroundingRectangle(col, color=pcol(k), buff=0.12, stroke_width=6)
            same = a[i] == b[i]
            txt = M(f"{span(PNAME[k] + '의 자리', pcol(k))}  {a[i]} {'=' if same else ('&lt;' if a[i] < b[i] else '&gt;')} {b[i]}", 48).move_to([0, -0.85, 0])
            if frame is None:
                self.play(Create(box), FadeIn(txt), run_time=0.6)
            else:
                self.play(Transform(frame, box), Transform(note, txt), run_time=0.5)
            if frame is None:
                frame, note = box, txt
            if not same:
                break
            self.wait(0.35)
        self.say(f"{span('만의 자리', pcol(4))}에서 1 &lt; 3", "천만, 백만, 십만의 자리 숫자는 모두 같아요. 만의 자리에서 1과 3이 달라요. 3이 더 커요.")
        self.play(Indicate(r2[3], color=GREEN, scale_factor=1.5), run_time=0.8)
        res = M(f"52814790  {g('&lt;')}  52831045   →  {g('나 지역')}이 더 많아요", 50).move_to([0, -1.9, 0])
        res.scale_to_fit_width(min(res.width, 12.6))
        self.say(f"{g('나 지역')}이 더 많아요", "그래서 나 지역의 성금이 더 많아요. 뒤의 자리는 더 볼 필요가 없어요.")
        self.play(FadeIn(res, shift=UP * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def quiz(self):
        self.section("해 보기")
        q1 = M(f"① 81920000 ○ 8192000", 60).move_to([0, 1.7, 0])
        q2 = M(f"② 3억 2500만 ○ 3억 2050만", 60).move_to([0, -0.2, 0])
        self.say("○ 안에 &gt;, &lt;를 넣어 보세요", "○ 안에 크다, 작다 기호를 알맞게 넣어 보세요.")
        self.play(FadeIn(q1), FadeIn(q2), run_time=0.7)
        self.wait(0.6)
        self.pause_screen(5)
        a1 = M(f"① 81920000 {g('&gt;')} 8192000", 60).move_to(q1)
        a2 = M(f"② 3억 2500만 {g('&gt;')} 3억 2050만", 60).move_to(q2)
        n1 = M(f"8자리 &gt; 7자리", 38, SOFT).next_to(a1, DOWN, buff=0.2)
        n2 = M(f"억은 같고, 백만의 자리 5 &gt; 0", 38, SOFT).next_to(a2, DOWN, buff=0.2)
        self.say(f"① 자리 수 ② 높은 자리부터", "①은 8자리와 7자리라서 왼쪽이 커요. ②는 억이 같으니 그다음 자리부터 비교해요. 2500만이 2050만보다 커요.")
        self.play(Transform(q1, a1), FadeIn(n1), run_time=0.7)
        self.play(Transform(q2, a2), FadeIn(n2), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
