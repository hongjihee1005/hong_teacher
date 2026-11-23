"""「수학 원리 돋보기」 개념 차근차근 65화 — 무늬에서 규칙 찾기

○△○△○△ → 되풀이되는 부분(○△) / 색 규칙 빨강·빨강·파랑 / 다음에 올 모양 / 몇째에 무엇이 / 연습
최종: GRADE=c ./make_final.sh 65
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
from manim import Rectangle, Square, Triangle, Circle


def shape(k, s=0.55):
    if k == "c":
        return Circle(radius=s / 2, fill_color=ORANGE, fill_opacity=1, stroke_color=INK, stroke_width=3)
    if k == "t":
        return Triangle(fill_color=BLUE, fill_opacity=1, stroke_color=INK, stroke_width=3).scale(s / 1.7)
    return Square(side_length=s * 0.9, fill_color=GREEN, fill_opacity=1, stroke_color=INK, stroke_width=3)


class GcEp65(ConceptScene):
    EP_NO = 65
    EP_TITLE = "무늬에서 규칙 찾기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.section("되풀이되는 부분")
        seq = VGroup(*[shape(k) for k in "ctctctct"]).arrange(RIGHT, buff=0.35).move_to([0, 1.4, 0])
        self.say("무늬를 볼까요?", "동그라미, 세모, 동그라미, 세모. 무늬에서 되풀이되는 부분을 찾아볼까요?")
        self.play(LaggedStart(*[FadeIn(x) for x in seq], lag_ratio=0.15), run_time=1.2)
        boxes = VGroup(*[SurroundingRectangle(VGroup(seq[k], seq[k + 1]), color=GREEN, buff=0.1) for k in range(0, 8, 2)])
        t = M(f"{g('○△')}가 되풀이돼요 → 다음은 {o('○')}", 50).move_to([0, -0.2, 0])
        self.say(f"{g('○△')}가 되풀이돼요", "동그라미와 세모가 짝이 되어 되풀이돼요. 그래서 다음에는 동그라미가 와요.")
        self.play(Create(boxes), FadeIn(t), run_time=0.7)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.section("몇째에 무엇이 올까?")
        seq2 = VGroup(*[shape(k) for k in "ccsccscc"]).arrange(RIGHT, buff=0.35).move_to([0, 1.4, 0])
        self.say("○○□가 되풀이", "동그라미, 동그라미, 네모가 되풀이되는 무늬예요. 열둘째에는 무엇이 올까요?")
        self.play(LaggedStart(*[FadeIn(x) for x in seq2], lag_ratio=0.15), run_time=1.2)
        t2 = M(f"3개씩 되풀이 → 3째, 6째, 9째, {g('12째')}는 모두 {g('□')}", 46).move_to([0, -0.2, 0])
        self.say(f"12째는 {g('네모')}", "3개씩 되풀이되니 3째, 6째, 9째, 12째는 모두 네모예요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)
        self.ask("△ △ ○ △ △ ○ △ △ ?", "?에 올 모양은?", "연습해 볼까요? 세모, 세모, 동그라미가 되풀이돼요. 물음표에 올 모양은 무엇일까요?",
                 f"△△○가 되풀이 → {g('○')}", f"{g('동그라미')}", "세모 세모 동그라미가 되풀이되니 물음표에는 동그라미가 와요.", qsize=64)
        self.closing(f"무늬에서 {g('되풀이되는 부분')}을 찾으면\n다음에 올 것, 몇째에 올 것을 알 수 있어요",
                     next_preview="개념 차근차근 66화 · 수 배열에서 규칙 찾기")
        self.wait(0.5)
