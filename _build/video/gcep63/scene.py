"""「수학 원리 돋보기」 개념 차근차근 63화 — 이상·이하·초과·미만

수직선: 이상(●, 포함) 이하(●) 초과(○, 포함 안 함) 미만(○) / 놀이기구 키 130 cm 이상 / 16 이상 35 이하
연습: 10 초과 15 미만인 자연수
최종: GRADE=c ./make_final.sh 63
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
from fraction import frac, frac_bar, row
from decimal4 import grid100
from conceptkit import number_line
from manim import Circle


class GcEp63(ConceptScene):
    EP_NO = 63
    EP_TITLE = "이상·이하·초과·미만"
    OUT_DIR = HERE

    def ray(self, nl, v, right, closed, color, y):
        x = nl.x(v)
        c = Circle(radius=0.14, color=color, stroke_width=5, fill_color=color if closed else "#FFFFFF", fill_opacity=1).move_to([x, y, 0])
        end = nl.x(20 if right else 0)
        ln = Line([x, y, 0], [end, y, 0], color=color, stroke_width=8)
        return VGroup(ln, c)

    def construct(self):
        self.opening()
        self.section("수직선으로 나타내기")
        nl = number_line(20, y=-1.0, label_every=2, size=30)
        self.play(FadeIn(nl), run_time=0.5)
        items = [(10, True, True, BLUE, 1.9, "10 이상: 10과 같거나 큰 수 (●)"),
                 (10, False, True, ORANGE, 1.1, "10 이하: 10과 같거나 작은 수 (●)"),
                 (10, True, False, GREEN, 0.3, "10 초과: 10보다 큰 수 (○)"),
                 (10, False, False, "#B05FD0", -0.5, "10 미만: 10보다 작은 수 (○)")]
        self.say("이상·이하는 ●, 초과·미만은 ○", "이상과 이하는 그 수를 포함해서 점을 까맣게, 초과와 미만은 그 수를 포함하지 않아서 점을 비워 둬요.")
        for v, right, closed, col, y, txt in items:
            r = self.ray(nl, v, right, closed, col, y)
            lab = M(txt, 32, col).move_to([-3.4 if not right else 3.4, y + 0.36, 0])
            self.play(Create(r), FadeIn(lab), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)
        self.step("생활 속에서", [(f"놀이 기구: 키 {o('130 cm 이상')}만 탈 수 있어요 → 130 cm는 {g('탈 수 있어요')}", 42, 1.2),
                  (f"{b('16 이상 35 이하')}: 16, 17, … , 35 (16과 35도 포함)", 44, 0.1)],
                  "이상은 그 수도 포함", "키 130센티미터 이상만 탈 수 있다면 딱 130센티미터인 사람도 탈 수 있어요. 16 이상 35 이하는 16과 35도 포함해요.")
        self.ask("10 초과 15 미만인 자연수", "10 초과 15 미만", "연습해 볼까요? 10 초과 15 미만인 자연수를 모두 써 보세요.",
                 f"{g('11, 12, 13, 14')} (10과 15는 포함하지 않아요)", f"{g('11, 12, 13, 14')}", "10과 15는 포함하지 않으니 11, 12, 13, 14예요.", qsize=60)
        self.closing(f"{b('이상·이하')}: 그 수를 포함 (●)\n{o('초과·미만')}: 그 수를 포함하지 않음 (○)",
                     next_preview="개념 차근차근 64화 · 올림·버림·반올림")
        self.wait(0.5)
