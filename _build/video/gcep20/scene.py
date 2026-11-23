"""「수학 원리 돋보기」 개념 차근차근 20화 — 계산을 도와준 도구들

손가락 → 산가지(중국 전국 시대 무렵부터, 막대를 늘어놓아 자리마다 수, 빈칸이 0; 조선에서는 산학의 기본 계산법으로 조선 말기까지)
→ 주판(중국 명나라 때 지금 모양의 그림, 우리나라에 들어온 정확한 때는 알 수 없음, 1920~30년대에 널리) → 계산기
산가지로 23 나타내기(세로 막대·가로 막대 번갈아) / 연습 / 출처 (SOURCES_CONCEPT.md 1부 '산가지·주판')
최종: GRADE=c ./make_final.sh 20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from manim import Rectangle

STICK = "#B4874A"


def stick(vertical=True, L=0.55):
    a, b2 = ([0, -L / 2, 0], [0, L / 2, 0]) if vertical else ([-L / 2, 0, 0], [L / 2, 0, 0])
    return Line(a, b2, color=STICK, stroke_width=11)


def rod_digit(d, vertical=True, L=0.55):
    """산가지 숫자 1~9: 1~5는 막대 d개, 6~9는 가로(세로) 막대 하나 = 5 + 나머지"""
    g_ = VGroup()
    if d <= 5:
        for k in range(d):
            s = stick(vertical, L)
            s.shift((RIGHT if vertical else UP) * (k - (d - 1) / 2) * 0.16)
            g_.add(s)
    else:
        top = stick(not vertical, L * 0.9).shift(UP * 0.36 if vertical else RIGHT * 0.0)
        g_.add(top)
        for k in range(d - 5):
            s = stick(vertical, L * 0.8)
            s.shift((RIGHT if vertical else UP) * (k - (d - 6) / 2) * 0.16 + (DOWN * 0.05 if vertical else LEFT * 0.0))
            g_.add(s)
    return g_


class GcEp20(ConceptScene):
    EP_NO = 20
    EP_TITLE = "계산을 도와준 도구들"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.fingers()
        self.rods()
        self.abacus()
        self.practice()
        show_sources(self, [
            "· 산가지: 한국민족문화대백과사전 '산가지' (중국 전국 시대 무렵부터, 조선에서는 조선 말기까지 산학의 기본 계산법)",
            "· 주판: 한국민족문화대백과사전 '주산'·'주판', 한국수학사학회지 「주산의 역사와 우리나라 학교 주산교육 동향」",
            "· 산가지 숫자 모양: 위키백과 'Counting rods'",
        ])
        self.closing(f"손가락 → {o('산가지')} → {b('주판')} → 계산기\n도구가 바뀌어도 {g('자리마다 수를 놓는 생각')}은 같아요",
                     next_preview="개념 차근차근 21화 · 곱셈의 뜻: 묶어 세기와 몇 배")
        self.wait(0.5)

    def fingers(self):
        self.section("가장 먼저 쓴 도구")
        hands = VGroup(*[VGroup(*[dot(BLUE if h == 0 else ORANGE, 0.24) for _ in range(5)]).arrange(RIGHT, buff=0.12) for h in range(2)]).arrange(RIGHT, buff=0.8).move_to([0, 1.2, 0])
        self.say("손가락은 언제나 가지고 다니는 계산 도구", "사람들이 가장 먼저 쓴 계산 도구는 손가락이에요. 그런데 손가락은 10개뿐이라 큰 수를 계산하기 어려웠어요.")
        self.play(FadeIn(hands, lag_ratio=0.08), run_time=0.8)
        t = M("큰 수를 계산하려면 다른 도구가 필요했어요", 44).move_to([0, -0.6, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def rods(self):
        self.section("산가지")
        row = VGroup(*[VGroup(rod_digit(d), T(str(d), 34, INK)).arrange(DOWN, buff=0.3) for d in range(1, 10)]).arrange(RIGHT, buff=0.55).move_to([0, 1.5, 0])
        self.say("작은 막대 산가지", "옛날 중국과 우리나라에서는 산가지라는 작은 막대를 늘어놓아 수를 나타내고 계산했어요.")
        self.play(LaggedStart(*[FadeIn(r) for r in row], lag_ratio=0.1), run_time=1.4)
        n = VGroup(rod_digit(2, vertical=False), rod_digit(3, vertical=True)).arrange(RIGHT, buff=0.7).move_to([-2.2, -0.6, 0])
        lab = M(f"= {g('23')}", 56).next_to(n, RIGHT, buff=0.6)
        self.say("자리마다 막대 방향을 바꾸어", "자리마다 막대를 세로와 가로로 번갈아 놓아 자리를 구별했어요. 빈 자리는 비워 두어 0을 나타냈어요.")
        self.play(FadeIn(n), FadeIn(lab), run_time=0.6)
        t = M("조선에서는 산가지를 조선 말기까지 썼어요", 40).move_to([0, -1.9, 0])
        self.say("조선에서는 조선 말기까지", "중국에서는 주판이 퍼지며 산가지를 쓰지 않게 되었지만, 조선에서는 산가지가 조선 말기까지 수학 계산의 기본 도구였어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def abacus(self):
        self.section("주판")
        frame = Rectangle(width=7.0, height=3.0, stroke_color=INK, stroke_width=6).move_to([0, 0.9, 0])
        beam = Line(frame.get_left() + UP * 0.45, frame.get_right() + UP * 0.45, color=INK, stroke_width=6)
        cols = VGroup()
        for k in range(7):
            x = -3.0 + k * 1.0
            rodl = Line([x, -0.6, 0], [x, 2.4, 0], color=SOFT, stroke_width=3)
            beads = VGroup(*[Rectangle(width=0.7, height=0.28, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([x, y, 0]) for y in (2.0, 0.85, 0.5, 0.15, -0.2)])
            cols.add(VGroup(rodl, beads))
        self.say("주판: 알을 움직여 계산", "그 뒤에는 막대에 알을 꿴 주판으로 계산했어요. 위의 알 하나는 5, 아래 알 하나는 1을 나타내요.")
        self.play(FadeIn(cols), Create(frame), Create(beam), run_time=1.0)
        t1 = M("지금 같은 모양의 주판 그림은 중국 명나라 때 책에 나와요", 36).move_to([0, -1.2, 0])
        t2 = M("우리나라에 들어온 정확한 때는 알 수 없고, 1920~30년대에 널리 쓰였어요", 32, SOFT).move_to([0, -1.9, 0])
        self.say("우리나라에 들어온 때는 정확히 몰라요", "지금 같은 모양의 주판 그림은 중국 명나라 때의 책에 나와요. 우리나라에 처음 들어온 정확한 때는 알 수 없고, 1920년대와 30년대에 널리 쓰였대요.")
        self.play(FadeIn(t1), FadeIn(t2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        n = VGroup(rod_digit(4, vertical=False), rod_digit(7, vertical=True)).arrange(RIGHT, buff=0.8).move_to([0, 1.2, 0])
        q = M("이 산가지 수는 얼마일까요?", 46).move_to([0, -0.2, 0])
        self.say("산가지 수를 읽어 보세요", "연습해 볼까요? 이 산가지 수는 얼마일까요? 왼쪽이 십의 자리, 오른쪽이 일의 자리예요.")
        self.play(FadeIn(n), FadeIn(q), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"십의 자리 4, 일의 자리 5 + 2 = 7 → {g('47')}", 50).move_to([0, -1.4, 0])
        self.say(f"{g('47')}", "십의 자리 막대 4개는 40, 일의 자리는 위의 막대 하나가 5, 아래 막대 2개가 2라서 7. 47이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
