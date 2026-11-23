"""「수학 원리 돋보기」 개념 차근차근 77화 — 선분·직선·반직선과 『원론』

선분 ㄱㄴ(양끝 있음) / 직선(양쪽 끝없이) / 반직선 ㄱㄴ(ㄱ에서 시작해 ㄴ 쪽으로 끝없이, ㄴㄱ과 다름)
이야기: 유클리드 『원론』(기원전 300년 무렵, 13권) 1권 '점은 부분이 없는 것', '선은 폭이 없는 길이' / 연습 / 출처
최종: GRADE=c ./make_final.sh 77
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
from conceptkit import poly, regular, right_mark
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, Arrow, PI


class GcEp77(ConceptScene):
    EP_NO = 77
    EP_TITLE = "선분·직선·반직선과 『원론』"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("세 가지 곧은 선")
        y = [1.8, 0.5, -0.8]
        a, c = -2.0, 2.0
        seg = VGroup(Line([a, y[0], 0], [c, y[0], 0], color=BLUE, stroke_width=7), Dot([a, y[0], 0], color=INK), Dot([c, y[0], 0], color=INK))
        lin = VGroup(Line([-6.0, y[1], 0], [6.0, y[1], 0], color=ORANGE, stroke_width=7), Dot([a, y[1], 0], color=INK), Dot([c, y[1], 0], color=INK))
        ray = VGroup(Line([a, y[2], 0], [6.0, y[2], 0], color=GREEN, stroke_width=7), Dot([a, y[2], 0], color=INK), Dot([c, y[2], 0], color=INK))
        labs = [M(f"{b('선분')} ㄱㄴ: 두 점을 곧게 이은 선 (양 끝이 있어요)", 32), M(f"{o('직선')}: 양쪽으로 끝없이 늘인 곧은 선", 32), M(f"{g('반직선')} ㄱㄴ: ㄱ에서 시작해 ㄴ 쪽으로 끝없이", 32)]
        self.say("선분, 직선, 반직선", "두 점을 곧게 이은 선을 선분, 양쪽으로 끝없이 늘인 곧은 선을 직선, 한 점에서 시작해 한쪽으로만 끝없이 늘인 선을 반직선이라고 해요.")
        for obj, lab, yy in zip([seg, lin, ray], labs, y):
            lab.move_to([0, yy + 0.45, 0])
            self.play(Create(obj[0]), FadeIn(obj[1:]), FadeIn(lab), run_time=0.7)
        t = M("반직선 ㄱㄴ과 반직선 ㄴㄱ은 시작점이 달라 서로 달라요", 34, SOFT).move_to([0, -1.9, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.section("이야기: 『원론』")
        bk = book("원론").scale(0.6).move_to([-4.6, 0.6, 0])
        t1 = M(f"약 2300년 전 그리스의 {b('유클리드')}는\n그때까지의 도형 지식을 13권의 책 『원론』으로 정리했어요", 36).move_to([1.2, 1.4, 0])
        t2 = M(f"\"{o('점')}은 부분이 없는 것\"\n\"{o('선')}은 폭이 없는 길이\"", 44, GREEN).move_to([1.2, 0.0, 0])
        t3 = M("이런 약속으로 시작하는 이 책은 2000년 넘게 기하 교과서로 쓰였어요", 32, SOFT).move_to([0.6, -1.3, 0])
        self.say("유클리드의 『원론』", "약 2300년 전 그리스의 유클리드는 그때까지 알려진 도형 지식을 13권의 책 『원론』으로 정리했어요. 점은 부분이 없는 것, 선은 폭이 없는 길이라는 약속으로 시작하고, 2000년 넘게 기하 교과서로 쓰였어요.")
        self.play(FadeIn(bk), FadeIn(t1), run_time=0.6)
        self.play(FadeIn(t2), run_time=0.5)
        self.play(FadeIn(t3), run_time=0.4)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("끝이 한쪽에만 있는 곧은 선은?", "무엇일까요?", "연습해 볼까요? 끝이 한쪽에만 있고 다른 쪽으로 끝없이 늘인 곧은 선의 이름은?",
                 f"{g('반직선')}", f"{g('반직선')}", "반직선이에요.", qsize=60)
        show_sources(self, ["· 유클리드 『원론』: 브리태니커 'Elements', MacTutor 수학사 'Euclid'",
                            "· 1권 정의(점·선): T. L. Heath 번역(1908), D. E. Joyce 『Euclid's Elements』(Clark 대학교)"])
        self.closing(f"{b('선분')}: 양 끝 · {o('직선')}: 양쪽으로 끝없이 · {g('반직선')}: 한쪽으로 끝없이\n도형의 약속은 2300년 전 『원론』에서부터",
                     next_preview="개념 차근차근 78화 · 각과 직각")
        self.wait(0.5)
