"""「수학 원리 돋보기」 개념 차근차근 75화 — □, △, ○ 모양

물건 본뜨기(상자 바닥 → □, 삼각김밥 → △, 컵 바닥 → ○) / 뾰족한 곳 4·3·0개, 곧은 선과 굽은 선 / 연습
최종: GRADE=c ./make_final.sh 75
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
from manim import Rectangle, Square, Circle, Triangle, Polygon, Angle, Arc, Dot, Ellipse, RoundedRectangle, ORIGIN, PI


class GcEp75(ConceptScene):
    EP_NO = 75
    EP_TITLE = "□, △, ○ 모양"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("본떠 보면")
        sq = Square(1.6, fill_color=ORANGE, fill_opacity=0.5, stroke_color=INK, stroke_width=5)
        tr = Triangle(fill_color=BLUE, fill_opacity=0.5, stroke_color=INK, stroke_width=5).scale(1.1)
        ci = Circle(radius=0.85, fill_color=GREEN, fill_opacity=0.5, stroke_color=INK, stroke_width=5)
        sh = VGroup(sq, tr, ci).arrange(RIGHT, buff=1.8).move_to([0, 1.2, 0])
        labs = VGroup(*[M(x, 34) for x in ["상자 바닥 → □", "삼각김밥 → △", "컵 바닥 → ○"]])
        for l, s_ in zip(labs, sh):
            l.next_to(s_, DOWN, buff=0.35)
        self.say("물건을 종이에 대고 본떠요", "물건을 종이에 대고 따라 그리면 여러 모양이 나와요. 상자 바닥은 네모, 삼각김밥은 세모, 컵 바닥은 동그라미.")
        self.play(LaggedStart(*[FadeIn(VGroup(s_, l)) for s_, l in zip(sh, labs)], lag_ratio=0.3), run_time=1.4)
        f = VGroup(M(f"뾰족한 곳 {o('4개')}\n곧은 선", 32), M(f"뾰족한 곳 {o('3개')}\n곧은 선", 32), M(f"뾰족한 곳 {o('없음')}\n굽은 선", 32))
        for x, l in zip(f, labs):
            x.next_to(l, DOWN, buff=0.25)
        self.say("뾰족한 곳의 수", "네모는 뾰족한 곳이 4개, 세모는 3개, 동그라미는 없고 굽은 선으로 되어 있어요.")
        self.play(FadeIn(f, lag_ratio=0.3), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("시계 · 공책 · 표지판(세모) 은?", "어떤 모양일까요?", "연습해 볼까요? 동그란 시계, 공책, 세모 표지판은 어떤 모양일까요?",
                 f"시계 {g('○')} · 공책 {o('□')} · 표지판 {b('△')}", "○, □, △", "시계는 동그라미, 공책은 네모, 세모 표지판은 세모 모양이에요.", qsize=56)
        self.closing(f"{o('□')} 뾰족한 곳 4개 · {b('△')} 3개 · {g('○')} 없음(굽은 선)",
                     next_preview="개념 차근차근 76화 · 삼각형·사각형·원, 오각형·육각형")
        self.wait(0.5)
