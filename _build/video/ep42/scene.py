"""「수학 원리 돋보기」 42화 — 1 cm보다 짧은 길이, mm (1학기 5단원 길이와 시간 2차시, 화 코드 1-5-a)

나사 길이는 1 cm보다 짧아요 → 1 cm를 크게 확대해 10칸 → 1 mm → 1 cm = 10 mm → 8 cm 5 mm = 85 mm
최종: ./make_final.sh 42
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   RoundedRectangle, SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage

WOOD = "#F3E3B5"


def ruler(x0, y0, cm, unit, mm=True, size=24):
    body = Rectangle(width=cm * unit + 0.4, height=0.75, fill_color=WOOD, fill_opacity=1, stroke_color=SOFT, stroke_width=3)
    body.move_to([x0 + cm * unit / 2, y0 - 0.37, 0])
    ticks = VGroup()
    for k in range(cm * 10 + 1):
        if not mm and k % 10:
            continue
        x = x0 + k * unit / 10
        h = 0.32 if k % 10 == 0 else (0.22 if k % 5 == 0 else 0.13)
        ticks.add(Line([x, y0, 0], [x, y0 - h, 0], color=INK, stroke_width=3 if k % 10 == 0 else 1.6))
    nums = VGroup(*[T(str(k), size).move_to([x0 + k * unit, y0 - 0.55, 0]) for k in range(cm + 1)])
    return VGroup(body, ticks, nums)


class Ep42(EpisodeScene):
    EP_NO = 42
    EP_TITLE = "1 cm보다 짧은 길이, mm"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.zoom()
        self.measure()
        self.convert()
        self.closing(f"1 cm를 10칸으로 똑같이 나눈 한 칸 → {o('1 mm')}\n{b('1 cm')} = {o('10 mm')}",
                     next_preview="43화 · 1000 m는 1 km")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        r = ruler(-4.0, 0.0, 3, 2.6, mm=False, size=30)
        screw = VGroup(Rectangle(width=1.6, height=0.18, fill_color=SOFT, fill_opacity=1, stroke_width=0),
                       Rectangle(width=0.2, height=0.45, fill_color=INK, fill_opacity=1, stroke_width=0)).arrange(RIGHT, buff=0)
        screw.move_to([-4.0 + 0.9, 0.35, 0])
        self.say("나사 길이를 재려고 해요", "서윤이가 작은 나사의 길이를 재려고 해요. 그런데 1 cm보다 짧아요.")
        self.play(FadeIn(r), FadeIn(screw), run_time=0.8)
        q = M("1 cm보다 짧은 길이는 어떻게 나타낼까요?", 50).move_to([0, 2.2, 0])
        self.say("1 cm보다 짧은 길이는 어떻게 나타낼까요?", "1 cm보다 짧은 길이는 어떻게 나타낼 수 있을까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def zoom(self):
        self.section("1 cm를 크게 보면")
        small = ruler(-5.6, 2.0, 5, 0.8, mm=True, size=22)
        self.play(FadeIn(small), run_time=0.5)
        box = SurroundingRectangle(VGroup(*small[1][10:21]), color=ORANGE, buff=0.05, stroke_width=4)
        self.say("자에서 1 cm를 크게 확대해 볼까요?", "자에서 1과 2 사이, 1 cm를 크게 확대해 볼까요?")
        self.play(Create(box), run_time=0.5)
        x0, x1, y = -4.5, 4.5, -0.1
        big = VGroup(Line([x0, y, 0], [x1, y, 0], color=INK, stroke_width=4))
        for k in range(11):
            x = x0 + (x1 - x0) * k / 10
            h = 0.9 if k in (0, 10) else (0.6 if k == 5 else 0.4)
            big.add(Line([x, y, 0], [x, y + h, 0], color=INK, stroke_width=4 if k in (0, 10) else 2.5))
        l1 = DashedLine(box.get_corner(DOWN + LEFT), [x0, y + 0.9, 0], color=ORANGE, stroke_width=2)
        l2 = DashedLine(box.get_corner(DOWN + RIGHT), [x1, y + 0.9, 0], color=ORANGE, stroke_width=2)
        self.play(Create(l1), Create(l2), FadeIn(big), run_time=1.0)
        lab = T("1 cm", 40, BLUE).move_to([0, y - 0.5, 0])
        self.play(FadeIn(lab), run_time=0.4)
        cnt = VGroup(*[T(str(k + 1), 28, ORANGE).move_to([x0 + (x1 - x0) * (k + 0.5) / 10, y + 0.25, 0]) for k in range(10)])
        self.say(f"1 cm가 똑같이 {o('10칸')}으로 나뉘어 있어요", "1 cm가 작은 눈금으로 똑같이 10칸 나뉘어 있어요.")
        self.play(LaggedStart(*[FadeIn(c) for c in cnt], lag_ratio=0.12, run_time=1.4))
        d = M(f"작은 눈금 한 칸 → {o('1 mm')} (1 밀리미터)", 46).move_to([0, -1.4, 0])
        self.say(f"한 칸의 길이를 {o('1 mm')}라고 해요", "작은 눈금 한 칸의 길이를 1 mm라 쓰고, 1 밀리미터라고 읽어요.")
        self.play(FadeIn(d), Indicate(cnt[0], color=ORANGE, scale_factor=1.6), run_time=0.8)
        e = M(f"{b('1 cm')} = {o('10 mm')}", 60).move_to([0, -2.3, 0])
        self.say(f"{b('1 cm')} = {o('10 mm')}", "그래서 1 cm는 10 mm와 같아요.")
        self.play(FadeIn(e), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def measure(self):
        self.section("색연필 길이 재기")
        unit = 1.2
        r = ruler(-5.4, 0.4, 9, unit, mm=True, size=26)
        pencil = VGroup(Rectangle(width=8.5 * unit - 0.3, height=0.32, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=2),
                        )
        pencil.move_to([-5.4 + (8.5 * unit - 0.3) / 2, 0.85, 0])
        from manim import Polygon
        tip = Polygon([-5.4 + 8.5 * unit - 0.3, 0.69, 0], [-5.4 + 8.5 * unit - 0.3, 1.01, 0], [-5.4 + 8.5 * unit, 0.85, 0],
                      color=INK, fill_color="#E7C9A0", fill_opacity=1, stroke_width=2)
        self.say("색연필의 왼쪽 끝을 0에 맞추어요", "색연필의 왼쪽 끝을 자의 눈금 0에 맞추어 길이를 재어 볼게요.")
        self.play(FadeIn(r), FadeIn(pencil), FadeIn(tip), run_time=0.8)
        self.say(f"8 cm에서 작은 눈금 {o('5칸')} 더", "오른쪽 끝은 8 cm에서 작은 눈금 5칸을 더 갔어요.")
        self.play(Indicate(VGroup(*r[1][80:86]), color=ORANGE, scale_factor=1.5), run_time=1.0)
        d = M(f"{b('8 cm')} {o('5 mm')}  (8 센티미터 5 밀리미터)", 50).move_to([0, -1.2, 0])
        self.say(f"{b('8 cm')} {o('5 mm')}", "그래서 색연필의 길이는 8 cm 5 mm예요.")
        self.play(FadeIn(d), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def convert(self):
        self.section("mm로 바꾸기")
        l1 = M(f"{b('8 cm')} = {o('80 mm')}", 60).move_to([0, 1.5, 0])
        l2 = M(f"{b('8 cm')} {o('5 mm')} = 80 mm + 5 mm = {g('85 mm')}", 56).move_to([0, 0.3, 0])
        l3 = M(f"{g('63 mm')} = 60 mm + 3 mm = {b('6 cm')} {o('3 mm')}", 56).move_to([0, -0.9, 0])
        self.say(f"1 cm가 10 mm이니 8 cm는 {o('80 mm')}", "1 cm가 10 mm이니까 8 cm는 80 mm예요.")
        self.play(FadeIn(l1), run_time=0.5)
        self.say(f"8 cm 5 mm = {g('85 mm')}", "그래서 8 cm 5 mm는 80 mm와 5 mm를 더한 85 mm예요.")
        self.play(FadeIn(l2), run_time=0.5)
        self.say(f"거꾸로 63 mm = {b('6 cm')} {o('3 mm')}", "거꾸로 63 mm는 60 mm와 3 mm, 곧 6 cm 3 mm예요.")
        self.play(FadeIn(l3), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
