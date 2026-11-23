"""「수학 원리 돋보기」 개념 차근차근 94화 — 각뿔과 피라미드

밑면 1개(다각형), 옆면은 삼각형, 한 점(각뿔의 꼭짓점)에서 만남 / 이름(삼각뿔·사각뿔…) / 면 □+1, 모서리 □×2, 꼭짓점 □+1
이야기: 약 4500년 전 이집트 쿠푸왕의 대피라미드 — 밑면이 정사각형인 사각뿔, 밑변 약 230 m, 처음 높이 약 147 m(Britannica) / 연습 / 출처
최종: GRADE=c ./make_final.sh 94
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
from manim import Rectangle, Square, Circle, Polygon, Dot, PI
from cuboid import Cuboid
from solid import prism, pyramid, regular as sreg
from round3d import cylinder, cone, sphere
from cubes import stack, heights_cells, flat, top_view, front_view, side_view


class GcEp94(ConceptScene):
    EP_NO = 94
    EP_TITLE = "각뿔과 피라미드"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("각뿔")
        sol = VGroup(*[pyramid(sreg(n, 0.95), 1.8, center=(x, 0.6, 0)).edges(width=4) for n, x in [(3, -3.6), (4, 0.0), (5, 3.6)]])
        names = VGroup(*[M(x, 36).move_to([p, -1.0, 0]) for x, p in [("삼각뿔", -3.6), ("사각뿔", 0.0), ("오각뿔", 3.6)]])
        self.say("밑면이 하나, 옆면은 삼각형", "밑면이 다각형 하나이고, 옆면이 모두 삼각형인 입체도형을 각뿔이라고 해요. 옆면이 모두 만나는 점을 각뿔의 꼭짓점이라고 해요.")
        self.play(LaggedStart(*[FadeIn(s_) for s_ in sol], lag_ratio=0.3), FadeIn(names), run_time=1.3)
        t = M(f"면 □ + 1 · 모서리 □ × 2 · 꼭짓점 □ + 1", 44).move_to([0, -1.9, 0])
        self.say("면 □+1, 모서리 □×2, 꼭짓점 □+1", "밑면이 네모각형이면 면은 네모 더하기 1, 모서리는 네모 곱하기 2, 꼭짓점은 네모 더하기 1이에요.")
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("이야기: 피라미드")
        pyr = pyramid(sreg(4, 1.6), 2.4, center=(-3.4, 0.4, 0))
        P = VGroup(pyr.face(1, "#D9B36A", 0.8), pyr.face(2, "#C9A35A", 0.8), pyr.face(3, "#E3C27E", 0.8), pyr.face(4, "#B8924A", 0.8), pyr.edges(show_hidden=False))
        t1 = M(f"약 4500년 전 이집트 {o('쿠푸왕')}의 대피라미드\n밑면이 정사각형인 {g('사각뿔')}", 40).move_to([2.2, 1.2, 0])
        t2 = M("밑변 한 변 약 230 m\n처음 높이 약 147 m", 40).move_to([2.2, -0.3, 0])
        self.say(f"쿠푸왕의 대피라미드는 {g('사각뿔')}", "약 4500년 전 이집트 쿠푸왕의 대피라미드는 밑면이 정사각형인 사각뿔이에요. 밑변 한 변이 약 230미터, 처음 높이는 약 147미터였대요. 지금은 꼭대기가 깎여 조금 낮아졌어요.")
        self.play(FadeIn(P), FadeIn(t1), run_time=0.8)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("사각뿔의 면·모서리·꼭짓점은?", "사각뿔은?", "연습해 볼까요? 사각뿔의 면, 모서리, 꼭짓점의 수를 구해 보세요.",
                 f"면 {g('5')} · 모서리 {g('8')} · 꼭짓점 {g('5')}", "5, 8, 5", "4 더하기 1은 5, 4 곱하기 2는 8, 4 더하기 1은 5예요.", qsize=60)
        show_sources(self, ["· 기자의 대피라미드(쿠푸왕): 브리태니커 'Great Pyramid of Giza'·'Khufu'"])
        self.closing(f"밑면 하나, 옆면이 {o('삼각형')}: 각뿔\n대피라미드는 밑면이 정사각형인 {g('사각뿔')}",
                     next_preview="개념 차근차근 95화 · 원기둥")
        self.wait(0.5)
