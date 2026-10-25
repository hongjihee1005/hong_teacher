"""「과학 원리 돋보기」 3학년 2화 — 수평 잡기로 무게를 비교해요 (3-1 1단원 힘과 우리 생활 3차시, 화 코드 3-1-1-b)

바탕: grade3/science/sem1/u1-2.html — 시소(아빠와 나, 무거운 사람이 앞쪽), '수평'의 뜻,
숫자 판 탐구(① 판 가운데를 받침대에 ② 2번 칸에 물체 → 기울어짐 ③ 반대쪽 2번 칸 → 수평 ④ 한 개 더 → 기울어짐 ⑤ 다른 쪽 물체를 옮겨 수평),
정리 표(같은 거리 + 수평 → 무게가 같음 / 기울어지면 기울어진 쪽이 무거움), 귤과 사과, 양팔저울,
형성 평가 3번(수평일 때 받침점에 가까운 물체가 더 무거움).
최종: ./make_final.sh s3ep02
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Write, Circumscribe)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, Board, clear_stage, fruit, person, sq_block, tag


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S3Ep02(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 2
    EP_TITLE = "수평 잡기로 무게를 비교해요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.seesaw()
        self.same_distance()
        self.diff_distance()
        self.summary_table()
        self.fruits()
        self.closing(f"받침점으로부터 {o('같은 거리')}에 있는 두 물체가\n{g('수평')}을 이루면 두 물체의 무게는 같아요",
                     next_preview="3학년 3화 · 무게를 정확히 비교하려면? 용수철저울")
        self.wait(0.5)

    # ── 시소 ──
    def seesaw(self):
        self.section("궁금해요")
        bd = Board(center=[0, -0.9, 0], half=5.4, numbers=False)
        kid = person(1.6, ORANGE, "sit", face=LEFT)
        kid.shift([bd.x_of("R", 4.6) + 0.15, bd.c[1] + 0.2 - 0.9 * 1.6 / 2.6, 0])
        dad = person(2.5, BLUE, "sit")
        dad.shift([bd.x_of("L", 4.6) - 0.2, bd.c[1] + 0.2 - 0.9 * 2.5 / 2.6, 0])
        bd.plank.add(kid, dad)
        kt = tag("나", ORANGE).move_to([4.6, 2.3, 0])
        dt = tag("아빠", BLUE).move_to([-4.6, 2.3, 0])
        self.say("아빠와 내가 시소를 타요", "아빠와 내가 시소를 타요. 아빠는 나보다 훨씬 무거워요.")
        self.play(FadeIn(bd.stand), FadeIn(bd.plank), FadeIn(kt), FadeIn(dt), run_time=0.8)
        self.say("아빠가 맨 뒤에 앉으면 아빠 쪽으로 기울어져요", "아빠가 맨 뒤에 앉으면, 시소가 아빠 쪽으로 쿵 기울어져요.")
        self.play(bd.tilt_to(-0.2), run_time=1.0)
        self.say("어디에 앉으면 기울어지지 않을까?", "어떻게 하면 시소가 어느 쪽으로도 기울어지지 않을까요?")
        self.pause_screen(5, "아빠는 어디에 앉으면 좋을까요?")
        self.say(f"무거운 사람이 {o('앞쪽')}, 가벼운 사람이 {o('뒤쪽')}에 앉아요",
                 "무거운 아빠가 받침점에 가까운 앞쪽에 앉고, 가벼운 내가 뒤쪽에 앉으면 돼요.")
        self.play(bd.tilt_to(0.0, 0.6))
        bd.plank.remove(dad)
        self.play(dad.animate.shift(RIGHT * (bd.x_of("L", 1.6) - bd.x_of("L", 4.6))), run_time=1.0)
        bd.plank.add(dad)
        self.wait(0.3)
        lv = Line([-5.6, bd.c[1] + 0.32, 0], [5.6, bd.c[1] + 0.32, 0], stroke_color=GREEN, stroke_width=4).set_opacity(0.0)
        word = T("수평", 64, GREEN).move_to([0, 2.3, 0])
        self.say(f"어느 쪽으로도 기울어지지 않은 상태를 {g('수평')}이라고 해요",
                 "이렇게 어느 쪽으로도 기울어지지 않은 상태를 수평이라고 해요.")
        self.play(FadeIn(word, scale=0.8), Indicate(bd.plank, color=GREEN, scale_factor=1.02), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 같은 거리 ──
    def same_distance(self):
        self.section("실험해요")
        bd = Board(center=[0, -0.9, 0])
        self.bd = bd
        self.say("숫자가 표시된 판을 받침대 가운데에 올려요", "숫자가 표시된 판의 가운데를 받침대에 올려놓아요. 판이 수평을 이루어요.")
        self.play(FadeIn(bd.stand), FadeIn(bd.plank), run_time=0.8)
        fulcrum = T("받침점", 34, SOFT).next_to(bd.stand, DOWN, buff=0.12)
        self.play(FadeIn(fulcrum), run_time=0.4)
        a = bd.put(sq_block(ORANGE), "L", 2)
        a.shift(UP * 1.5)
        self.say("왼쪽 2번 칸에 물체를 하나 올려요", "왼쪽 판의 2번 칸에 물체를 하나 올려요.")
        self.play(a.animate.shift(DOWN * 1.5), run_time=0.5)
        self.play(bd.tilt_to(-0.16), run_time=0.8)
        self.say("물체를 올린 쪽으로 기울어져요", "판이 물체를 올린 쪽으로 기울어졌어요.")
        b = bd.put(sq_block(ORANGE), "R", 2)
        bd.plank.remove(b)
        b.rotate(0.16, about_point=bd.pivot)
        b.shift(UP * 1.5)
        self.say("오른쪽 2번 칸에도 같은 물체를 올리면?", "이번에는 오른쪽 판의 2번 칸에 똑같은 물체를 하나 올리면 어떻게 될까요?")
        self.play(b.animate.shift(DOWN * 1.5), run_time=0.5)
        bd.plank.add(b)
        self.play(bd.tilt_to(0.0), run_time=0.8)
        self.say(f"받침점에서 {o('같은 거리')}에 있는 같은 무게 물체 → {g('수평')}",
                 "판이 수평을 이루어요. 무게가 같은 두 물체를 받침점으로부터 같은 거리에 올리면 수평을 이뤄요.")
        arc_l = Line([bd.x_of("L", 2), -2.3, 0], [0, -2.3, 0], stroke_color=ORANGE, stroke_width=6)
        arc_r = Line([0, -2.3, 0], [bd.x_of("R", 2), -2.3, 0], stroke_color=ORANGE, stroke_width=6)
        self.play(FadeOut(fulcrum), Create(arc_l), Create(arc_r), run_time=0.8)
        self.settle()
        self.play(FadeOut(VGroup(arc_l, arc_r)), run_time=0.3)
        self.a, self.b = a, b

    # ── 다른 거리 ──
    def diff_distance(self):
        bd, a, b = self.bd, self.a, self.b
        c = sq_block(ORANGE)
        self.say("왼쪽 물체 위에 한 개를 더 올려요", "왼쪽 2번 칸의 물체 위에 물체를 한 개 더 조심스럽게 올려요.")
        bd.put(c, "L", 2)
        bd.plank.remove(c)
        c.shift(UP * 1.4)
        self.play(c.animate.shift(DOWN * 1.4), run_time=0.5)
        bd.plank.add(c)
        self.play(bd.tilt_to(-0.16), run_time=0.8)
        self.say("물체가 두 개 있는 쪽으로 기울어져요", "판이 물체가 두 개 있는 쪽으로 기울어졌어요.")
        self.say("오른쪽 물체를 어디로 옮기면 수평이 될까?", "그럼 오른쪽에 있는 물체 하나를 어느 칸으로 옮기면 수평이 될까요?")
        self.pause_screen(5, "오른쪽 물체를 몇 번 칸으로 옮길까요?")
        bd.lift(b)
        self.say("받침점에서 먼 쪽으로 옮겨 봐요", "받침점에서 먼 쪽으로 한 칸씩 옮겨 볼게요.")
        for n in (3, 4):
            self.play(b.animate.shift(RIGHT * bd.step * 0.985 + UP * bd.step * 0.16), run_time=0.6)
            if n == 3:
                self.wait(0.5)
        bd.plank.add(b)
        b.slot = ("R", 4)
        self.play(bd.tilt_to(0.0), run_time=0.9)
        self.say(f"4번 칸에서 {g('수평')}을 이루어요", "오른쪽 4번 칸으로 옮기니 판이 수평을 이루어요.")
        n2 = T("2번", 40, BLUE).move_to([bd.x_of("L", 2), -2.0, 0])
        n4 = T("4번", 40, BLUE).move_to([bd.x_of("R", 4), -2.0, 0])
        self.play(FadeIn(n2), FadeIn(n4), run_time=0.4)
        self.say(f"무게가 다르면 {o('다른 거리')}에서 수평 — 무거운 쪽이 받침점에 가까워요",
                 "무게가 다른 두 물체는 받침점으로부터 서로 다른 거리에서 수평을 이뤄요. 더 무거운 쪽이 받침점에 더 가까이 있어요.")
        self.play(Circumscribe(VGroup(a, c), color=RED), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 정리 표 ──
    def summary_table(self):
        self.section("정리해요")
        rows = [
            ("같은 거리 · 수평", g("두 물체의 무게가 같아요")),
            ("같은 거리 · 기울어짐", r("기울어진 쪽 물체가 더 무거워요")),
            ("다른 거리 · 수평", o("받침점에 가까운 물체가 더 무거워요")),
        ]
        ys = [1.6, 0.2, -1.2]
        grp = VGroup()
        self.say("물체의 무게를 비교하는 방법을 정리해요", "수평 잡기로 물체의 무게를 비교하는 방법을 정리해 볼게요.")
        for (cond, res), y in zip(rows, ys):
            c = T(cond, 40, INK).move_to([-6.4, y, 0], aligned_edge=LEFT)
            a = T("→", 44, SOFT).move_to([-1.15, y, 0])
            rr = M(res, 38)
            if rr.width > 7.2:
                rr.scale_to_fit_width(7.2)
            rr.move_to([-0.65, y, 0], aligned_edge=LEFT)
            grp.add(VGroup(c, a, rr))
        lines = VGroup(*[Line([-6.6, y, 0], [6.6, y, 0], stroke_color=SOFT, stroke_width=2) for y in (0.9, -0.5)])
        self.play(Create(lines), run_time=0.4)
        for i, row in enumerate(grp):
            narr = ["받침점으로부터 같은 거리에 있는 두 물체가 수평을 이루면, 두 물체의 무게는 같아요.",
                    "같은 거리에 올렸는데 판이 기울어지면, 기울어진 쪽 물체가 더 무거워요.",
                    "서로 다른 거리에서 수평을 이루면, 받침점에 가까운 물체가 더 무거워요."][i]
            sub = ["같은 거리 + 수평 → 두 물체의 무게가 같아요",
                   "같은 거리 + 기울어짐 → 기울어진 쪽이 더 무거워요",
                   "다른 거리 + 수평 → 받침점에 가까운 쪽이 더 무거워요"][i]
            self.say(sub, narr)
            self.play(FadeIn(row, shift=RIGHT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 귤과 사과 ──
    def fruits(self):
        self.section("확인해요")
        bd = Board(center=[0, -0.6, 0])
        self.play(FadeIn(bd.stand), FadeIn(bd.plank), run_time=0.6)
        m = bd.put(fruit("mandarin", 1.4), "L", 4)
        ap = bd.put(fruit("apple", 1.4), "R", 4)
        mt = T("귤", 40, ORANGE).move_to([bd.x_of("L", 4), 1.6, 0])
        at = T("사과", 40, RED).move_to([bd.x_of("R", 4), 1.6, 0])
        self.say("같은 거리에 귤과 사과를 올렸더니…", "받침점으로부터 같은 거리에 귤과 사과를 올렸더니, 판이 사과 쪽으로 기울어졌어요.")
        self.play(FadeIn(mt), FadeIn(at), run_time=0.4)
        self.play(bd.tilt_to(0.16), run_time=1.0)
        self.pause_screen(4, "어느 것이 더 무거울까요?")
        self.say(f"사과 쪽으로 기울어졌으니 {r('사과')}가 더 무거워요", "판이 사과 쪽으로 기울어졌으니, 사과가 더 무거워요.")
        self.play(Indicate(ap, color=RED, scale_factor=1.3), run_time=1.0)
        self.say("양팔저울도 수평 잡기로 무게를 비교해요",
                 "양팔저울도 가운데 받침점이 있어서, 수평 잡기로 두 물체의 무게를 비교하는 도구예요.")
        self.settle()
        clear_stage(self)
