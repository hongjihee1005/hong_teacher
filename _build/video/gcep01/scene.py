"""「수학 원리 돋보기」 개념 차근차근 1화 — 9까지의 수: 하나·일·첫째

개수를 수로(구슬·손가락) → 1~9 읽는 두 방법(하나, 둘 … / 일, 이 …) → 차례를 나타내는 수(첫째, 둘째 …)
→ 같은 '3'이라도 개수(3개)와 차례(셋째)가 다름 → 0은 '하나도 없음' / 연습: 5개 세기, 넷째 찾기
최종: GRADE=c ./make_final.sh 1
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, RED

NATIVE = ["하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉"]
SINO = ["일", "이", "삼", "사", "오", "육", "칠", "팔", "구"]
ORD = ["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째", "여덟째", "아홉째"]


class GcEp01(ConceptScene):
    EP_NO = 1
    EP_TITLE = "9까지의 수: 하나·일·첫째"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.count()
        self.read_two()
        self.order()
        self.zero()
        self.practice()
        self.closing(f"수는 {b('몇 개')}인지도, {o('몇째')}인지도 나타내요\n3 → 셋 · 삼 (3개)   셋째 (차례)",
                     next_preview="개념 차근차근 2화 · 모으기와 가르기")
        self.wait(0.5)

    def count(self):
        self.section("몇 개일까요?")
        ds = dots(3, RED, cols=3, step=0.9, r=0.32).move_to([-2.5, 0.6, 0])
        self.say("사과가 몇 개일까요?", "여기 빨간 사과가 있어요. 몇 개일까요? 하나씩 세어 볼까요?")
        self.play(FadeIn(ds, lag_ratio=0.2), run_time=0.8)
        nums = VGroup()
        for k, d in enumerate(ds):
            n = T(str(k + 1), 48, BLUE).next_to(d, DOWN, buff=0.3)
            nums.add(n)
            self.play(Indicate(d, scale_factor=1.25, color=ORANGE), FadeIn(n), run_time=0.45)
        big = T("3", 160, BLUE).move_to([3.0, 0.6, 0])
        self.say(f"마지막에 센 수 {b('3')}이 사과의 개수", "하나, 둘, 셋. 마지막에 센 수 3이 사과의 개수예요. 숫자 3으로 나타내요.")
        self.play(Write(big), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def read_two(self):
        self.section("수를 읽는 두 가지 방법")
        rows = VGroup()
        for k in range(9):
            r = VGroup(T(str(k + 1), 54, INK), T(NATIVE[k], 40, BLUE), T(SINO[k], 40, ORANGE)).arrange(DOWN, buff=0.25)
            rows.add(r)
        rows.arrange(RIGHT, buff=0.55).move_to([0, 0.5, 0])
        lab1 = M(f"{b('하나, 둘, 셋')} — 개수를 셀 때 (사과 세 개)", 34).move_to([0, -1.6, 0])
        lab2 = M(f"{o('일, 이, 삼')} — 수 자체를 읽을 때 (3 더하기 2)", 34).move_to([0, -2.3, 0])
        self.say("1부터 9까지 두 가지로 읽어요", "1부터 9까지의 수는 두 가지로 읽어요. 하나, 둘, 셋, 그리고 일, 이, 삼.")
        self.play(LaggedStart(*[FadeIn(r, shift=UP * 0.2) for r in rows], lag_ratio=0.12), run_time=1.6)
        self.say(f"{b('하나·둘·셋')}과 {o('일·이·삼')}", "물건을 셀 때는 주로 하나, 둘, 셋으로, 식에서 수를 읽을 때는 일, 이, 삼으로 읽어요.")
        self.play(FadeIn(lab1), run_time=0.5)
        self.play(FadeIn(lab2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def order(self):
        self.section("차례를 나타내는 수")
        kids = VGroup(*[dot(c, 0.34) for c in [BLUE, ORANGE, GREEN, RED, "#B05FD0", BLUE, ORANGE]]).arrange(RIGHT, buff=0.55).move_to([0, 0.9, 0])
        flag = T("앞 ▶", 34, SOFT).next_to(kids, LEFT, buff=0.4)
        self.say("줄을 선 친구들, 앞에서부터", "친구들이 줄을 섰어요. 앞에서부터 차례를 세어 볼까요?")
        self.play(FadeIn(kids, lag_ratio=0.1), FadeIn(flag), run_time=0.8)
        labs = VGroup(*[T(ORD[k], 28, GREEN).next_to(kids[k], DOWN, buff=0.3) for k in range(7)])
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.15), run_time=1.4)
        box3 = SurroundingRectangle(VGroup(kids[:3]), color=BLUE, buff=0.15)
        box3b = SurroundingRectangle(VGroup(kids[2], labs[2]), color=ORANGE, buff=0.12)
        t = M(f"{b('세 명')}은 3명 모두 · {o('셋째')}는 한 명만", 42).move_to([0, -1.6, 0])
        self.say(f"{b('세 명')}과 {o('셋째')}는 달라요", "세 명은 앞의 세 친구 모두이고, 셋째는 세 번째에 선 한 친구만이에요. 같은 3이라도 뜻이 달라요.")
        self.play(Create(box3), run_time=0.5)
        self.play(Create(box3b), FadeIn(t), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def zero(self):
        self.section("하나도 없으면 0")
        plate = VGroup(*[dot(RED, 0.3) for _ in range(2)]).arrange(RIGHT, buff=0.3).move_to([-2.5, 0.5, 0])
        self.say("사과 2개를 하나씩 먹으면?", "접시에 사과 2개가 있어요. 하나씩 먹으면 어떻게 될까요?")
        self.play(FadeIn(plate), run_time=0.5)
        n = T("2", 120, BLUE).move_to([2.5, 0.5, 0])
        self.play(FadeIn(n), run_time=0.4)
        for k, v in enumerate(["1", "0"]):
            self.play(FadeOut(plate[k]), n.animate.become(T(v, 120, BLUE if v != "0" else GREEN).move_to([2.5, 0.5, 0])), run_time=0.6)
        t = M(f"하나도 없으면 {g('0')}(영)", 50).move_to([0, -1.6, 0])
        self.say(f"하나도 없으면 {g('0')}", "하나도 없을 때는 0이라 쓰고, 영이라고 읽어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        ds = VGroup(*[dot(c, 0.34) for c in [GREEN, GREEN, ORANGE, GREEN, ORANGE, GREEN, GREEN]]).arrange(RIGHT, buff=0.5).move_to([0, 1.2, 0])
        q = M(f"① 초록 구슬은 {b('몇 개')}?   ② 왼쪽에서 {o('넷째')} 구슬은 무슨 색?", 38).move_to([0, -0.3, 0])
        self.say("초록 구슬은 몇 개? 넷째는 무슨 색?", "연습해 볼까요? 초록 구슬은 몇 개일까요? 그리고 왼쪽에서 넷째 구슬은 무슨 색일까요?")
        self.play(FadeIn(ds, lag_ratio=0.1), FadeIn(q), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        nums = VGroup()
        k = 0
        for d in ds:
            if d.get_fill_color().to_hex().upper() == GREEN.upper():
                k += 1
                nums.add(T(str(k), 34, BLUE).next_to(d, UP, buff=0.2))
        box = SurroundingRectangle(ds[3], color=ORANGE, buff=0.12)
        a = M(f"① {b('5개')}   ② 넷째는 {g('초록')}", 46).move_to([0, -1.6, 0])
        self.say(f"① {b('5개')}  ② {g('초록')}", "초록 구슬은 하나, 둘, 셋, 넷, 다섯, 5개예요. 왼쪽에서 넷째 구슬은 초록이에요.")
        self.play(LaggedStart(*[FadeIn(n) for n in nums], lag_ratio=0.2), Create(box), FadeIn(a), run_time=1.2)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
