"""「수학 원리 돋보기」 나눗셈 차근차근 1화 — 나눗셈은 언제 쓸까?

생활 속 세 장면: 사탕 6개를 2명에게 똑같이 / 6개를 2개씩 봉지에 / 리본 12 cm를 4 cm씩
'똑같이'가 아니면 나눗셈이 아님(5개·1개) / 연습: 나눗셈 상황 고르기
최종: GRADE=d ./make_final.sh 1
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, Rectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from division import clear_stage
from divkit import DivScene, deal
from items import check_mark, cross_mark
from prepkit import PINK, RED, dish, items, regroup

RIB = "#E46FA8"


class GdEp01(DivScene):
    EP_NO = 1
    EP_TITLE = "나눗셈은 언제 쓸까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.share()
        self.bags()
        self.ribbon()
        self.not_div()
        self.practice()
        self.closing(f"전체를 {g('똑같이')} 나눌 때 나눗셈을 써요\n나누어 주기 · 몇 개씩 묶기 · 몇 번 자르기",
                     next_preview="나눗셈 차근차근 2화 · 나눗셈 식 읽고 쓰기")
        self.wait(0.5)

    def share(self):
        self.section("장면 ① 나누어 주기")
        its = items(6, y=2.0, step=0.7, r=0.26)
        dishes = VGroup(dish("지우"), dish("민준")).arrange(RIGHT, buff=2.4).move_to([0, -0.6, 0])
        self.say("사탕 6개를 두 친구에게 똑같이", "사탕 6개를 두 친구에게 똑같이 나누어 주려고 해요.")
        self.play(FadeIn(its, lag_ratio=0.1), FadeIn(dishes), run_time=0.8)
        deal(self, its, dishes)
        t = M(f"한 명에게 {g('3개')}씩", 50).move_to([0, -2.0, 0])
        self.say(f"한 명에게 {g('3개')}씩", "한 명에게 3개씩 돌아가요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def bags(self):
        self.section("장면 ② 몇 개씩 묶기")
        its = items(6, y=0.8, step=0.7, r=0.26)
        self.say("사탕 6개를 2개씩 봉지에 담으면?", "이번에는 사탕 6개를 한 봉지에 2개씩 담아요. 몇 봉지가 될까요?")
        self.play(FadeIn(its, lag_ratio=0.1), run_time=0.6)
        regroup(self, its, 2, y=0.8, step=0.7, gap=1.4)
        t = M(f"{g('3봉지')}가 돼요", 50).move_to([0, -1.2, 0])
        self.say(f"{g('3봉지')}", "2개씩 담으면 3봉지가 돼요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def ribbon(self):
        self.section("장면 ③ 똑같은 길이로 자르기")
        u = 0.75
        rib = Rectangle(width=12 * u / 1.5, height=0.5, fill_color=RIB, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, 1.0, 0])
        lab = M("12 cm", 40).next_to(rib, UP, buff=0.25)
        self.say("리본 12 cm를 4 cm씩 자르면?", "리본 12센티미터를 4센티미터씩 자르면 몇 도막이 될까요?")
        self.play(FadeIn(rib), FadeIn(lab), run_time=0.6)
        w = rib.width
        cuts = VGroup(*[Line(rib.get_left() + RIGHT * w * k / 3 + UP * 0.4, rib.get_left() + RIGHT * w * k / 3 + DOWN * 0.4, color=INK, stroke_width=6) for k in (1, 2)])
        self.play(Create(cuts), run_time=0.7)
        pcs = VGroup(*[M("4 cm", 34).move_to(rib.get_left() + RIGHT * w * (k + 0.5) / 3 + DOWN * 0.6) for k in range(3)])
        t = M(f"{g('3도막')}이 돼요", 50).move_to([0, -1.2, 0])
        self.say(f"{g('3도막')}", "4센티미터씩 3도막이 돼요.")
        self.play(FadeIn(pcs), FadeIn(t), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)

    def not_div(self):
        self.section("'똑같이'가 중요해요")
        dishes = VGroup(dish("지우"), dish("민준")).arrange(RIGHT, buff=2.4).move_to([0, 0.0, 0])
        a = VGroup(*items(5, step=0.45, r=0.2)).arrange_in_grid(rows=3, buff=0.1).move_to(dishes[0].plate.get_center() + UP * 0.6)
        c = items(1, r=0.2).move_to(dishes[1].plate.get_center() + UP * 0.4)
        self.say("5개와 1개로 나누면 어떨까요?", "만약 5개와 1개로 나누면 어떨까요?")
        self.play(FadeIn(dishes), FadeIn(a), FadeIn(c), run_time=0.7)
        no = cross_mark(0.5).move_to([0, 2.2, 0])
        t = M(f"{o('똑같지 않으면')} 나눗셈이 아니에요", 48).move_to([0, -2.0, 0])
        self.say(f"{o('똑같지 않으면')} 나눗셈이 아니에요", "나누기는 했지만 똑같지 않아요. 나눗셈은 꼭 똑같이 나누는 것이에요.")
        self.play(Create(no), FadeIn(t), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        cards = VGroup(
            M("① 딸기 10개를 5명이 똑같이 나누어 먹어요", 38),
            M("② 빨간 구슬 3개와 파란 구슬 4개를 모아요", 38),
            M("③ 색종이 20장을 4장씩 나누어 묶어요", 38),
        ).arrange(DOWN, buff=0.5, aligned_edge=LEFT).move_to([-0.4, 0.6, 0])
        self.say("나눗셈을 쓰는 상황을 모두 고르세요", "연습해 볼까요? 나눗셈을 쓰는 상황을 모두 골라 보세요.")
        self.play(FadeIn(cards, lag_ratio=0.3), run_time=0.9)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        marks = VGroup(check_mark(0.4).next_to(cards[0], RIGHT, buff=0.4), cross_mark(0.32).next_to(cards[1], RIGHT, buff=0.4),
                       check_mark(0.4).next_to(cards[2], RIGHT, buff=0.4))
        self.say(f"①과 ③이 나눗셈, ②는 {o('덧셈')}", "1번과 3번이 똑같이 나누는 나눗셈이에요. 2번은 모으는 것이니 덧셈이에요.")
        self.play(FadeIn(marks, lag_ratio=0.3), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
