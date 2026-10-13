"""「수학 원리 돋보기」 5화 — 나눗셈이 맞는지 확인하기 (2학기 2단원 나눗셈 8차시, 화 코드 2-2-d)

17 ÷ 5 = 3 … 2 → 묶음을 다시 모으면 5 × 3 + 2 = 17 → 확인식 → 친구 계산 확인(43 ÷ 6, 50 ÷ 8, 29 ÷ 4)
→ 거꾸로 찾기(□ ÷ 7 = 8 … 3)
최종: ./make_final.sh 5
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (
    DOWN, LEFT, RIGHT, UP,
    Arrow, Create, FadeIn, FadeOut, GrowFromCenter, Indicate, LaggedStart, RoundedRectangle,
    SurroundingRectangle, VGroup, Write,
)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage, j
from items import battery, check_mark, cross_mark, group_boxes, layout


class Ep05(EpisodeScene):
    EP_NO = 5
    EP_TITLE = "나눗셈이 맞는지 확인하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.backward()
        self.formula()
        self.friends()
        self.reverse_find()
        self.closing(f"(나누는 수) × ({b('몫')}) + ({o('나머지')})\n= ({g('나누어지는 수')})이면 계산이 맞아요",
                     next_preview="6화 · 세 자리 수 나누기")
        self.wait(0.5)

    # ── 문제 ──
    def problem(self):
        self.section("문제")
        eq = M(f"17 ÷ 5 = {b('3')} … {o('2')}", 120).move_to([0, 0.9, 0])
        who = M("지호의 답", 52, SOFT).next_to(eq, UP, buff=0.4)
        self.say("지호가 나눗셈을 계산했어요", "지호가 나눗셈을 계산했어요. 17 나누기 5는 3, 나머지 2.")
        self.play(FadeIn(who), Write(eq), run_time=1.4)
        self.wait(1.0)
        q = M(f"이 답이 맞는지 {g('어떻게')} 확인할 수 있을까요?", 56).move_to([0, -1.1, 0])
        self.say("이 답이 맞는지 어떻게 확인할 수 있을까요?", "이 답이 맞는지 어떻게 확인할 수 있을까요?")
        self.play(FadeIn(q, shift=UP * 0.2), run_time=0.8)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    # ── 거꾸로 생각하기 (핵심 장면) ──
    def backward(self):
        self.section("거꾸로 생각하기")
        bats = VGroup(*[battery() for _ in range(17)])
        for bt, p in zip(bats, layout(17, 5, 3, y=1.15)):
            bt.move_to(p)
        boxes = group_boxes(bats, 5, 3)
        left = VGroup(*bats[15:])
        ring = SurroundingRectangle(left, color=ORANGE, buff=0.12, stroke_width=6, corner_radius=0.15)
        eq = M(f"17 ÷ 5 = {b('3')} … {o('2')}", 76).move_to([0.5, 2.2, 0])
        self.say(f"나눗셈은 {b('5개씩 3묶음')}, {o('2개')} 남은 것", "17 나누기 5는 5개씩 3묶음, 그리고 2개가 남은 것이에요.")
        self.play(FadeIn(eq), LaggedStart(*[GrowFromCenter(x) for x in bats], lag_ratio=0.04, run_time=1.2))
        self.play(Create(boxes), Create(ring), run_time=0.9)
        self.wait(1.0)
        self.say("거꾸로, 다시 모아 볼까요?", "이번에는 거꾸로, 나눈 것을 다시 모아 볼까요?")
        self.wait(0.6)
        l1 = M(f"5 × {b('3')} = 15", 76).move_to([0, -0.2, 0])
        self.say(f"{b('5개씩 3묶음')}은 5 × {b('3')} = 15", "5개씩 3묶음은 5 곱하기 3, 15개예요.")
        self.play(Indicate(boxes, color=BLUE), run_time=0.8)
        self.play(Write(l1), run_time=0.9)
        self.wait(0.8)
        l2 = M(f"15 + {o('2')} = {g('17')}", 76).move_to([0, -1.4, 0])
        self.say(f"남은 {o('2개')}를 더하면 {g('17')}", "여기에 남은 2개를 더하면 17. 처음 수가 다시 나왔어요!")
        self.play(Indicate(left, color=ORANGE), run_time=0.7)
        self.play(Write(l2), run_time=0.9)
        all_pts = layout(17, 17, 0, y=1.15, step=0.52)
        self.play(FadeOut(boxes), FadeOut(ring), *[bt.animate.move_to(p) for bt, p in zip(bats, all_pts)], run_time=1.2)
        lab = T("17개", 44, GREEN).next_to(bats, DOWN, buff=0.2)
        self.play(FadeIn(lab, scale=1.3), Indicate(l2[-2:], color=GREEN), run_time=0.8)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    # ── 확인식 ──
    def formula(self):
        self.section("확인하는 식")
        eq = M(f"17 ÷ 5 = {b('3')} … {o('2')}", 90).move_to([0, 2.0, 0])
        chk = M(f"5 × {b('3')} + {o('2')} = {g('17')}", 90).move_to([0, 0.3, 0])
        self.say("나눗셈과 확인하는 식을 나란히 놓아요", "나눗셈과 확인하는 식을 나란히 놓아 볼게요.")
        self.play(FadeIn(eq), run_time=0.6)
        self.play(Write(chk), run_time=1.0)
        self.wait(0.6)
        # 같은 수끼리 이어 보기: 17÷5=3…2 글자 차례 1,7,÷,5,=,3,…,2 / 5,×,3,+,2,=,1,7
        pairs = [(eq[3], chk[0], INK), (eq[5], chk[2], BLUE), (eq[7], chk[4], ORANGE), (eq[0:2], chk[6:8], GREEN)]
        marks = VGroup()
        for a, c, col in pairs:
            col = SOFT if col == INK else col
            marks.add(SurroundingRectangle(a, color=col, buff=0.08, stroke_width=6, corner_radius=0.1),
                      SurroundingRectangle(c, color=col, buff=0.08, stroke_width=6, corner_radius=0.1))
        self.say("같은 수끼리 이어 보면", "같은 수끼리 짝지어 보면 어떤 규칙이 보일까요?")
        for k in range(0, len(marks), 2):
            self.play(Create(marks[k]), Create(marks[k + 1]), run_time=0.6)
            self.wait(0.3)
        self.wait(1.0)
        words = M(f"(나누는 수) × ({b('몫')}) + ({o('나머지')}) = ({g('나누어지는 수')})", 46)
        bg = SurroundingRectangle(words, color=GREEN, buff=0.25, stroke_width=6, corner_radius=0.2).set_fill(PAPER, 1)
        VGroup(bg, words).move_to([0, -1.55, 0])
        self.say(f"나누는 수 × {b('몫')} + {o('나머지')} = {g('나누어지는 수')}",
                 "나누는 수 곱하기 몫, 더하기 나머지가 나누어지는 수와 같으면 계산이 맞아요.")
        self.play(FadeIn(bg), Write(words), run_time=1.2)
        self.wait(2.0)
        self.settle()
        clear_stage(self, 0.6)

    # ── 친구의 계산 확인하기 ──
    def friends(self):
        self.section("친구의 계산 확인하기")
        cases = [
            ("민호", 43, 6, 7, 2),
            ("지아", 50, 8, 6, 2),
            ("준서", 29, 4, 6, 5),
        ]
        for name, a, d, q, r in cases:
            head = M(f"{name}", 50, SOFT).move_to([-4.6, 2.3, 0])
            eq = M(f"{a} ÷ {d} = {b(str(q))} … {o(str(r))}", 90).move_to([0.6, 2.3, 0])
            self.say(f"{name}: {a} ÷ {d} = {b(str(q))} … {o(str(r))}",
                     f"{name}는 {a} 나누기 {j(d, '을를')} {q}, 나머지 {j(r, '으로')} 계산했어요.")
            self.play(FadeIn(head), Write(eq), run_time=1.0)
            self.wait(0.4)
            val = d * q + r
            chk = M(f"{d} × {b(str(q))} + {o(str(r))} = {d * q} + {o(str(r))} = {val}", 66).move_to([0, 0.75, 0])
            self.say("확인하는 식으로 계산해요", f"확인하는 식으로 계산하면 {d} 곱하기 {q}는 {d * q}, 더하기 {r}는 {val}.")
            self.play(Write(chk), run_time=1.2)
            self.wait(0.8)
            if val != a:
                verdict = M(f"{val} ≠ {a}  →  틀렸어요", 60).move_to([0, -0.6, 0])
                mark = cross_mark(0.8).next_to(eq, RIGHT, buff=0.5)
                fix = M(f"바르게: {a} ÷ {d} = {g(f'{a // d} … {a % d}')}", 56).move_to([0, -1.75, 0])
                self.say(f"{g(j(a, '이가'))} 아니라 {j(val, '이가')} 나왔어요", f"처음 수 {j(a, '이가')} 아니라 {j(val, '이가')} 나왔어요. 계산이 틀렸어요.")
                self.play(FadeIn(verdict, shift=UP * 0.2), Create(mark), run_time=0.8)
                self.wait(0.6)
                self.say(f"바르게 하면 {g(f'{a // d} … {a % d}')}", f"바르게 계산하면 {a // d}, 나머지 {a % d}예요. 확인하면 {d * (a // d)} 더하기 {a % d}는 {a}.")
                self.play(FadeIn(fix, shift=UP * 0.2), run_time=0.7)
            elif r >= d:
                verdict = M(f"{val} = {a} 이지만 {o(f'나머지 {r}')} &gt; 나누는 수 {d}", 54).move_to([0, -0.6, 0])
                mark = cross_mark(0.8).next_to(eq, RIGHT, buff=0.5)
                fix = M(f"바르게: {a} ÷ {d} = {g(f'{a // d} … {a % d}')}", 56).move_to([0, -1.75, 0])
                self.say(f"{j(a, '이가')} 나왔지만… {o('나머지')}를 보세요!",
                         f"{j(a, '이가')} 나왔어요. 그런데 나머지 {j(r, '이가')} 나누는 수 {d}보다 커요. {d}개로 한 묶음을 더 만들 수 있으니 틀렸어요.")
                self.play(FadeIn(verdict, shift=UP * 0.2), run_time=0.8)
                self.play(Indicate(eq[-1], color=ORANGE, scale_factor=1.4), Create(mark), run_time=0.9)
                self.wait(0.6)
                self.say(f"바르게 하면 {g(f'{a // d} … {a % d}')}", f"바르게 계산하면 {a // d}, 나머지 {a % d}예요.")
                self.play(FadeIn(fix, shift=UP * 0.2), run_time=0.7)
            else:
                verdict = M(f"{g(f'{val} = {a}')}  →  맞았어요", 60).move_to([0, -0.6, 0])
                mark = check_mark(0.8).next_to(eq, RIGHT, buff=0.5)
                ok2 = M(f"{o(f'나머지 {r}')} &lt; 나누는 수 {d}  도 확인!", 52).move_to([0, -1.75, 0])
                self.say(f"처음 수 {g(j(a, '이가'))} 나왔어요!", f"처음 수 {j(a, '이가')} 나왔어요. 나머지 {r}도 {d}보다 작으니 맞았어요!")
                self.play(FadeIn(verdict, shift=UP * 0.2), Create(mark), run_time=0.8)
                self.play(FadeIn(ok2, shift=UP * 0.2), run_time=0.7)
            self.wait(1.6)
            self.settle()
            clear_stage(self, 0.5)
        tip = M(f"확인할 때 두 가지:\n① 확인하는 식이 {g('처음 수')}가 되는지\n② {o('나머지')}가 {b('나누는 수')}보다 작은지", 52)
        bg = RoundedRectangle(corner_radius=0.3, width=tip.width + 0.8, height=tip.height + 0.6, fill_color=PAPER,
                              fill_opacity=1, stroke_color=GREEN, stroke_width=6)
        VGroup(bg, tip).move_to([0, 0.4, 0])
        self.say("확인할 때는 두 가지를 봐요", "확인할 때는 두 가지를 봐요. 확인하는 식이 처음 수가 되는지, 그리고 나머지가 나누는 수보다 작은지.")
        self.play(FadeIn(bg), Write(tip), run_time=1.4)
        self.wait(2.0)
        self.settle()
        clear_stage(self, 0.6)

    # ── 거꾸로 찾기 ──
    def reverse_find(self):
        self.section("어떤 수를 찾아라")
        q = M(f"어떤 수를 7로 나누었더니\n몫이 {b('8')}, 나머지가 {o('3')}이었어요", 50).move_to([0.4, 1.85, 0])
        self.say("확인하는 식으로 어떤 수를 찾을 수도 있어요",
                 "확인하는 식을 쓰면 어떤 수를 거꾸로 찾을 수도 있어요. 어떤 수를 7로 나누었더니 몫이 8, 나머지가 3이었어요.")
        self.play(Write(q), run_time=1.4)
        self.wait(0.8)
        e1 = M(f"□ ÷ 7 = {b('8')} … {o('3')}", 80).move_to([0, 0.35, 0])
        self.play(FadeIn(e1, shift=UP * 0.2), run_time=0.7)
        self.wait(0.6)
        e2 = M(f"7 × {b('8')} + {o('3')} = 56 + {o('3')} = {g('59')}", 70).move_to([0, -1.05, 0])
        self.say(f"7 × {b('8')} + {o('3')} = {g('59')}", "7 곱하기 8은 56, 더하기 3은 59. 어떤 수는 59예요.")
        self.play(Write(e2), run_time=1.2)
        ans = M(f"□ = {g('59')}", 64).move_to([0, -2.1, 0])
        self.play(FadeIn(ans, scale=1.3), run_time=0.6)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
