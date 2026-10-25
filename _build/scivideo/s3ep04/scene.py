"""「과학 원리 돋보기」 3학년 4화 — 작은 힘으로 들어 올리는 도구의 비밀 (3-1 1단원 6차시, 화 코드 3-1-1-d)

바탕: grade3/science/sem1/u1-5.html — 고인돌·피라미드 도입, 물체를 들어 올리려면 물체의 무게만큼의 힘,
힘 측정기로 우유 직접 들기 180 → 지레(받침대에서 가까운 쪽에 우유, 먼 쪽을 누름) 45 → 빗면(나무토막에 나무판을 비스듬히) 40,
생각 바로잡기(지레와 빗면의 숫자는 서로 비교하지 않고 각각 직접 들 때와 비교), 경사로·화물차 짐칸 빗면.
최종: ./make_final.sh s3ep04
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, Polygon, Rectangle,
                   RoundedRectangle, Rotate, Triangle, VGroup, Write, LaggedStart, Circle, Ellipse)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import BROWN, BROWN_DARK, GROUND, RED, clear_stage, force_bar, ground, person, place, tag


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def milk(s=1.0):
    """우유 갑(아래 가운데가 (0,0))"""
    body = Rectangle(width=0.7, height=0.95, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, 0.475, 0])
    roof = Polygon([-0.35, 0.95, 0], [0.35, 0.95, 0], [0.18, 1.25, 0], [-0.18, 1.25, 0],
                   fill_color="#9CC8F0", fill_opacity=1, stroke_color=INK, stroke_width=3)
    band = Rectangle(width=0.7, height=0.3, fill_color="#9CC8F0", fill_opacity=1, stroke_width=0).move_to([0, 0.45, 0])
    t = T("우유", 22, INK).move_to([0, 0.45, 0])
    return VGroup(body, band, roof, t).scale(s, about_point=np.zeros(3))


def meter(val="0"):
    """힘 측정기(손잡이 위, 고리 아래). .num 글자"""
    box = RoundedRectangle(corner_radius=0.15, width=1.3, height=0.85, fill_color="#FFE7A8", fill_opacity=1,
                           stroke_color=INK, stroke_width=4)
    scr = RoundedRectangle(corner_radius=0.06, width=0.95, height=0.45, fill_color="#20323F", fill_opacity=1, stroke_width=0).move_to(box)
    num = T(val, 30, "#7CF2A4").move_to(scr)
    handle = Line(box.get_top(), box.get_top() + UP * 0.35, stroke_color=INK, stroke_width=6)
    grip = RoundedRectangle(corner_radius=0.1, width=0.7, height=0.22, fill_color=INK, fill_opacity=1, stroke_width=0).next_to(handle, UP, buff=0)
    hook = Line(box.get_bottom(), box.get_bottom() + DOWN * 0.35, stroke_color=INK, stroke_width=5)
    g_ = VGroup(box, scr, num, handle, grip, hook)
    g_.num, g_.scr = num, scr
    return g_


class S3Ep04(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 4
    EP_TITLE = "작은 힘으로 들어 올리는 도구의 비밀"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.dolmen()
        self.direct()
        self.lever()
        self.ramp()
        self.compare()
        self.life()
        self.closing(f"{o('지레')}나 {o('빗면')} 같은 도구를 이용하면\n직접 들어 올릴 때보다 {g('더 작은 힘')}으로 들어 올릴 수 있어요",
                     next_preview="3학년 마인드맵 1 · 힘과 우리 생활")
        self.wait(0.5)

    def setnum(self, m, val, rt=0.3):
        new = T(val, 30, "#7CF2A4").move_to(m.scr)
        self.play(FadeOut(m.num), FadeIn(new), run_time=rt)
        m.remove(m.num)
        m.add(new)
        m.num = new

    # ── 고인돌 ──
    def dolmen(self):
        self.section("궁금해요")
        gnd = ground(-1.6, -6.3, 6.3)
        leg1 = Rectangle(width=0.8, height=1.6, fill_color="#A39C92", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([-1.3, -0.8, 0])
        leg2 = leg1.copy().move_to([1.3, -0.8, 0])
        top = Polygon([-2.6, 0.0, 0], [2.7, 0.0, 0], [2.3, 0.75, 0], [-2.2, 0.85, 0], fill_color="#8E877D", fill_opacity=1,
                      stroke_color=INK, stroke_width=3)
        dol = VGroup(leg1, leg2, top)
        lab = T("고인돌", 40, SOFT).move_to([0, 1.5, 0])
        self.say("옛날 사람들은 무거운 돌을 어떻게 옮겼을까요?", "고인돌이에요. 옛날 사람들은 이렇게 아주 무거운 돌을 어떻게 옮겨 올렸을까요?")
        self.play(Create(gnd), FadeIn(dol), FadeIn(lab), run_time=1.0)
        self.pause_screen(5)
        ideas = VGroup(*[tag(t, c, 36) for t, c in [("여러 사람이 힘을 모아서", BLUE), ("통나무를 굴려서", ORANGE), ("도구를 이용해서", GREEN)]])
        ideas.arrange(RIGHT, buff=0.4).scale_to_fit_width(11.4).move_to([0, 1.8, 0])
        self.play(FadeOut(lab), run_time=0.2)
        self.say(f"여러 사람의 힘, 통나무, 그리고 {g('도구')}를 이용했어요", "여러 사람이 힘을 모으거나, 통나무를 굴리거나, 도구를 이용했을 거예요.")
        self.play(LaggedStart(*[FadeIn(i, shift=DOWN * 0.2) for i in ideas], lag_ratio=0.3), run_time=1.0)
        self.say(f"물체를 들어 올리려면 {o('물체의 무게만큼의 힘')}이 필요해요",
                 "물체를 그냥 들어 올리려면 물체의 무게만큼의 힘이 필요해요. 도구를 쓰면 어떻게 달라지는지 실험해 봐요.")
        self.settle()
        clear_stage(self)

    # ── 직접 들기 ──
    def direct(self):
        self.section("직접 들어 올리기")
        gnd = ground(-2.0, -6.3, 6.3)
        mk = place(milk(1.3), 0, -2.0)
        mt = meter("0").move_to([0, 1.2, 0])
        self.say("힘 측정기로 우유를 직접 들어 올려요", "힘 측정기의 고리에 우유를 걸고, 천천히 들어 올려요.")
        self.play(Create(gnd), FadeIn(mk), FadeIn(mt), run_time=0.8)
        string = Line(mt[5].get_end(), mk.get_top(), stroke_color=INK, stroke_width=3)
        self.play(Create(string), run_time=0.4)
        self.play(VGroup(mk, mt, string).animate.shift(UP * 0.6), run_time=1.0)
        self.setnum(mt, "180")
        self.say(f"직접 들어 올릴 때 드는 힘의 크기는 {r('180')}", "우유를 직접 들어 올릴 때 드는 힘의 크기는 180이에요. 이 숫자가 우유의 무게만큼의 힘이에요.")
        self.play(Indicate(mt.num, color=RED, scale_factor=1.4), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 지레 ──
    def lever(self):
        self.section("지레")
        y0 = -1.4
        gnd = ground(-2.0, -6.3, 6.3)
        piv = np.array([-1.6, y0, 0])
        stand = Triangle(fill_color=SOFT, fill_opacity=1, stroke_width=0).scale(0.6)
        stand.stretch_to_fit_height(0.6).next_to(piv, DOWN, buff=0)
        plank = Rectangle(width=7.0, height=0.18, fill_color="#D9B47A", fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3)
        plank.move_to(piv + RIGHT * 1.9 + UP * 0.09)
        self.say("받침대 위에 나무판을 올려 지레를 만들어요", "받침대 위에 나무판을 올려 지레를 만들어요.")
        self.play(Create(gnd), FadeIn(stand), FadeIn(plank), run_time=0.8)
        self.say("우유를 어디에 올려놓을까요?", "우유를 받침대에서 가까운 쪽과 먼 쪽 중에서 어디에 올려놓을까요?")
        self.pause_screen(5, "받침대에서 가까운 쪽? 먼 쪽?")
        # 판 왼쪽 끝은 받침대에서 1.6, 오른쪽 끝은 5.4
        mk = milk(1.0)
        mk.move_to(piv + LEFT * 1.25 + UP * (0.18 + mk.height / 2))
        lever = VGroup(plank, mk)
        self.say(f"받침대에서 {o('가까운 쪽')}에 우유를 올리고, {o('먼 쪽')}을 눌러요",
                 "받침대에서 가까운 쪽에 우유를 올리고, 받침대에서 먼 쪽을 힘 측정기로 천천히 눌러요.")
        self.play(FadeIn(mk, shift=DOWN * 0.3), run_time=0.5)
        p0 = np.array([4.9, 0.18, 0])
        mt = meter("0")
        mt.shift(piv + p0 - mt[5].get_end())
        self.play(FadeIn(mt), run_time=0.4)
        ang = 0.12
        p1 = np.array([p0[0] * np.cos(ang) + p0[1] * np.sin(ang), -p0[0] * np.sin(ang) + p0[1] * np.cos(ang), 0])
        self.play(Rotate(lever, -ang, about_point=piv), mt.animate.shift(p1 - p0), run_time=1.4)
        self.setnum_rot(mt, "45")
        self.say(f"지레를 이용할 때: {r('180')} → {g('45')}", "지레를 이용해 우유를 들어 올릴 때 드는 힘의 크기는 45예요. 직접 들 때 180보다 훨씬 작아요.")
        self.play(Indicate(mt.num, color=GREEN, scale_factor=1.4), run_time=0.8)
        self.say(f"지레를 이용하면 직접 들 때보다 {g('더 작은 힘')}이 들어요", "지레를 이용해 물체를 들어 올리면, 직접 들어 올릴 때보다 더 작은 힘이 들어요.")
        self.settle()
        clear_stage(self)

    def setnum_rot(self, m, val):
        new = T(val, 30, "#7CF2A4").move_to(m.scr)
        self.play(FadeOut(m.num), FadeIn(new), run_time=0.3)
        m.remove(m.num)
        m.add(new)
        m.num = new

    # ── 빗면 ──
    def ramp(self):
        self.section("빗면")
        yb = -2.0
        gnd = ground(yb, -6.3, 6.3)
        blocks = VGroup(*[Rectangle(width=1.2, height=0.5, fill_color=BROWN, fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3)
                          .move_to([3.6, yb + 0.25 + 0.5 * i, 0]) for i in range(4)])
        top = np.array([3.0, yb + 2.0, 0])
        bot = np.array([-3.4, yb, 0])
        board = Line(bot, top, stroke_color="#C8A065", stroke_width=16)
        self.say("나무토막을 쌓고 나무판을 비스듬히 올려 빗면을 만들어요", "나무토막을 쌓고, 나무판을 비스듬히 올려 빗면을 만들어요.")
        self.play(Create(gnd), LaggedStart(*[FadeIn(b) for b in blocks], lag_ratio=0.2), run_time=0.9)
        self.play(Create(board), run_time=0.6)
        d = (top - bot) / np.linalg.norm(top - bot)
        nrm = np.array([-d[1], d[0], 0])
        ang = np.arctan2(d[1], d[0])
        mk = milk(0.9).rotate(ang, about_point=np.zeros(3))
        mk.move_to(bot + d * 0.9 + nrm * 0.55)
        mt = meter("0").rotate(ang - PI / 2).move_to(bot + d * 3.0 + nrm * 0.62)
        mt[2].rotate(-(ang - PI / 2))
        rope = Line(mk.get_center() + d * 0.4, mt.get_center() - d * 0.75, stroke_color=INK, stroke_width=3)
        self.say("빗면을 따라 우유를 천천히 끌어 올려요", "힘 측정기에 우유를 걸고, 빗면을 따라 천천히 끌어 올려요.")
        self.play(FadeIn(mk), FadeIn(mt), Create(rope), run_time=0.6)
        self.play(VGroup(mk, mt, rope).animate.shift(d * 2.4), run_time=2.0)
        self.setnum(mt, "40")
        self.say(f"빗면을 이용할 때: {r('180')} → {g('40')}", "빗면을 따라 우유를 끌어 올릴 때 드는 힘의 크기는 40이에요. 직접 들 때 180보다 작아요.")
        self.play(Indicate(mt.num, color=GREEN, scale_factor=1.4), run_time=0.8)
        self.say(f"빗면을 이용해도 직접 들 때보다 {g('더 작은 힘')}이 들어요", "빗면을 이용해 끌어 올려도, 직접 들어 올릴 때보다 더 작은 힘이 들어요.")
        self.settle()
        clear_stage(self)

    # ── 결과 비교 ──
    def compare(self):
        self.section("결과 비교")
        rows = [("직접 들어 올릴 때", 180, RED), ("지레를 이용할 때", 45, GREEN), ("빗면을 이용할 때", 40, GREEN)]
        grp = VGroup()
        for i, (nm, v, c) in enumerate(rows):
            y = 1.7 - i * 1.3
            lab = T(nm, 40, INK).move_to([-4.4, y, 0])
            bar = force_bar(v, vmax=180, length=6.0, height=0.55, color=c).move_to([-1.7, y, 0], aligned_edge=LEFT)
            num = T(str(v), 42, c).next_to(bar, RIGHT, buff=0.25)
            grp.add(VGroup(lab, bar, num))
        self.say("세 가지 방법을 비교해 봐요", "직접 들어 올릴 때와 도구를 이용할 때를 막대로 비교해 봐요.")
        for row in grp:
            row[1].stretch(0.01, 0, about_edge=LEFT)
            self.play(FadeIn(row[0]), run_time=0.3)
            self.add(row[1])
            self.play(row[1].animate.stretch(100, 0, about_edge=LEFT), FadeIn(row[2]), run_time=0.7)
        self.say(f"도구를 이용하면 {g('더 작은 힘')}으로 들어 올릴 수 있어요", "도구를 이용하면 직접 들어 올릴 때보다 더 작은 힘으로 들어 올릴 수 있어요.")
        self.play(Indicate(VGroup(grp[1][1], grp[2][1]), color=GREEN), run_time=1.0)
        self.say(f"생각 바로잡기: 지레(45)와 빗면(40)은 {o('서로 비교하지 않아요')}",
                 "그런데 지레의 45와 빗면의 40은 서로 비교하지 않아요. 두 실험은 방법이 달라서, 각각 직접 들어 올릴 때와 비교해요.")
        self.settle()
        clear_stage(self)

    # ── 생활 속 ──
    def life(self):
        self.section("생활 속 도구")
        yb = -1.6
        gnd = ground(yb, -6.3, 6.3)
        door = Rectangle(width=1.6, height=2.6, fill_color="#CFE0EE", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([4.6, yb + 0.6 + 1.3, 0])
        step = Rectangle(width=2.6, height=0.6, fill_color="#D8D1C6", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([4.6, yb + 0.3, 0])
        rampx = Polygon([3.3, yb + 0.6, 0], [3.3, yb, 0], [-0.4, yb, 0], fill_color="#E8DCC8", fill_opacity=1, stroke_color=INK, stroke_width=3)
        lab = tag("경사로 = 빗면", ORANGE, 40).move_to([1.4, 1.2, 0])
        self.say("건물 입구의 경사로도 빗면을 이용한 예예요",
                 "건물 입구의 경사로도 빗면을 이용한 예예요. 경사로를 따라 끌어 올리면 직접 들어 올릴 때보다 더 작은 힘이 들어요.")
        self.play(Create(gnd), FadeIn(door), FadeIn(step), FadeIn(rampx), run_time=0.9)
        self.play(FadeIn(lab), run_time=0.4)
        self.say("화물차 짐칸에 빗면을 설치하는 까닭은?", "화물차의 짐칸에 빗면을 설치하기도 해요. 왜 그럴까요?")
        self.pause_screen(4)
        self.say(f"무거운 짐을 {g('작은 힘')}으로 올리기 위해서예요", "무거운 짐을 빗면을 따라 끌어 올리면, 작은 힘으로도 짐칸에 올릴 수 있기 때문이에요.")
        self.settle()
        clear_stage(self)
