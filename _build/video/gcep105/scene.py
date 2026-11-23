"""「수학 원리 돋보기」 개념 차근차근 105화 — 달력: 1주일과 1년

1주일 = 7일, 같은 요일은 7일마다 / 1년 = 12개월, 달마다 날수(31·30·28 또는 29) / 주먹 셈법(손가락 마디)
이야기: 7일 1주는 바빌로니아·유대 전통에 뿌리, 율리우스력(기원전 46년), 그레고리력(1582년, 10일 건너뜀), 우리나라 양력은 1896년 1월 1일부터 / 연습 / 출처
최종: GRADE=c ./make_final.sh 105
"""
import numpy as np
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
from conceptkit import clock
from manim import Rectangle, Square, Circle, Dot, PI
from manim import Rectangle


class GcEp105(ConceptScene):
    EP_NO = 105
    EP_TITLE = "달력: 1주일과 1년"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("1주일은 7일")
        days = "일월화수목금토"
        cells = VGroup()
        for k in range(14):
            r, c = divmod(k, 7)
            box = Rectangle(width=1.1, height=0.75, stroke_color=SOFT, stroke_width=2, fill_color="#FFFFFF", fill_opacity=1).move_to([-3.3 + c * 1.1, 1.0 - r * 0.75, 0])
            cells.add(VGroup(box, T(str(k + 1), 32, "#E2574C" if c == 0 else INK).move_to(box)))
        head = VGroup(*[T(d, 30, "#E2574C" if i == 0 else INK).move_to([-3.3 + i * 1.1, 1.65, 0]) for i, d in enumerate(days)])
        self.say("같은 요일은 7일마다", "달력에서 1주일은 7일이에요. 같은 요일은 7일마다 돌아와서, 세로로 보면 7씩 커져요.")
        self.play(FadeIn(head), FadeIn(cells, lag_ratio=0.03), run_time=1.0)
        t = M(f"1일과 {o('8일')}은 같은 요일 (1 + 7 = 8)", 44).move_to([0, -1.0, 0])
        self.play(FadeIn(t), run_time=0.4)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.5)
        self.step("1년은 12개월", [(f"31일: 1·3·5·7·8·10·12월 · 30일: 4·6·9·11월", 42, 1.3),
                  (f"2월: {o('28일')} (4년에 한 번 29일)", 46, 0.4),
                  ("주먹을 쥐고 손가락 마디를 세면 31일인 달을 찾을 수 있어요", 36, -0.6)],
                  "달마다 날수", "1년은 12개월이에요. 31일인 달, 30일인 달이 있고, 2월은 28일, 4년에 한 번 29일이에요.")
        self.step("이야기: 달력의 역사", [(f"7일 1주: 옛 {b('바빌로니아')}·유대 전통에 뿌리가 있어요", 40, 1.7),
                  (f"기원전 46년 로마의 {o('율리우스 카이사르')}가 달력을 고쳤어요", 40, 0.9),
                  (f"{o('1582년')} 그레고리우스 13세가 다시 고쳐 10일을 건너뛰었어요", 40, 0.1),
                  (f"우리나라는 {g('1896년 1월 1일')}부터 이 양력을 나라의 달력으로 썼어요", 40, -0.7)],
                  "달력도 고쳐 왔어요", "7일 1주는 옛 바빌로니아와 유대 전통에 뿌리가 있어요. 로마의 율리우스 카이사르가 달력을 고쳤고, 1582년 다시 고친 그레고리력을 지금 써요. 우리나라는 1896년 1월 1일부터 이 양력을 썼어요.", hold=1.8)
        self.ask("3월 5일이 화요일이면 3월 19일은?", "무슨 요일?", "연습해 볼까요? 3월 5일이 화요일이면 3월 19일은 무슨 요일일까요?",
                 f"19 − 5 = 14 = 7 × 2 → {g('화요일')}", f"{g('화요일')}", "14일 뒤는 2주 뒤라서 같은 화요일이에요.", qsize=56)
        show_sources(self, ["· 1주일·그레고리력: 브리태니커 'week', 'Ten Days That Vanished'",
                            "· 우리나라 양력 채택(건양): 한국민족문화대백과사전 '건양'"])
        self.closing(f"1주일 = {o('7일')}, 같은 요일은 7일마다\n1년 = 12개월, 지금 달력은 1582년 그레고리력",
                     next_preview="개념 차근차근 106화 · 들이: L와 mL")
        self.wait(0.5)
