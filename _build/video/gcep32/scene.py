"""「수학 원리 돋보기」 개념 차근차근 32화 — 뛰어 세기와 큰 수의 크기 비교

10만씩 뛰어 세기(십만의 자리만 1씩) / 1억씩 / 크기 비교: 자리 수가 다르면 자리 수가 많은 쪽, 같으면 높은 자리부터
연습: 3억 4500만 ○ 3억 5400만
최종: GRADE=c ./make_final.sh 32
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
from bignum import grp_markup


class GcEp32(ConceptScene):
    EP_NO = 32
    EP_TITLE = "뛰어 세기와 큰 수의 크기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.skip()
        self.compare()
        self.practice()
        self.closing(f"10만씩 뛰어 세면 {b('십만의 자리')}만 1씩 커져요\n크기 비교: {o('자리 수')} → 같으면 {g('높은 자리부터')}",
                     next_preview="개념 차근차근 33화 · 분모가 같은 분수의 크기 비교")
        self.wait(0.5)

    def skip(self):
        self.section("10만씩 뛰어 세기")
        vals = [2350000 + 100000 * k for k in range(5)]
        rows = VGroup(*[M(f"{v // 10000}만", 52) for v in vals]).arrange(RIGHT, buff=0.7).move_to([0, 1.2, 0])
        self.say("235만에서 10만씩", "235만에서 10만씩 뛰어 세어 볼까요? 245만, 255만, 265만, 275만.")
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.3), run_time=1.4)
        t = M(f"{b('십만의 자리')} 숫자만 3 → 4 → 5 → 6 → 7", 46).move_to([0, -0.2, 0])
        self.say(f"{b('십만의 자리')}만 1씩", "십만의 자리 숫자만 1씩 커져요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def compare(self):
        self.section("큰 수의 크기 비교")
        e1 = M(f"8900만 ○ 1억 200만", 56).move_to([0, 1.6, 0])
        t1 = M(f"자리 수가 다르면: {o('자리 수가 많은 쪽')}이 커요 → 8900만 {g('&lt;')} 1억 200만", 38).move_to([0, 0.7, 0])
        self.say(f"자리 수가 많은 쪽이 커요", "8900만과 1억 200만. 자리 수가 다르면 자리 수가 많은 쪽이 더 커요. 1억 200만이 더 커요.")
        self.play(FadeIn(e1), run_time=0.4)
        self.play(FadeIn(t1), run_time=0.5)
        e2 = M(f"5720만 ○ 5690만", 56).move_to([0, -0.4, 0])
        t2 = M(f"자리 수가 같으면 {g('높은 자리부터')}: 백만의 자리 7 &gt; 6 → 5720만 {g('&gt;')} 5690만", 38).move_to([0, -1.3, 0])
        self.say(f"같으면 {g('높은 자리부터')}", "5720만과 5690만은 자리 수가 같아요. 높은 자리부터 비교하면 천만의 자리는 같고, 백만의 자리 7이 6보다 커서 5720만이 더 커요.")
        self.play(FadeIn(e2), run_time=0.4)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("3억 4500만 ○ 3억 5400만", 64).move_to([0, 1.2, 0])
        self.say("어느 쪽이 클까요?", "연습해 볼까요? 동그라미 안에 큰 쪽 기호와 작은 쪽 기호 중 알맞은 것을 넣어 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"3억 4500만 {g('&lt;')} 3억 5400만 (천만의 자리 4 &lt; 5)", 48).move_to([0, -0.4, 0])
        self.say("3억 4500만이 더 작아요", "억의 자리는 같고, 천만의 자리 4가 5보다 작아서 3억 4500만이 더 작아요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
