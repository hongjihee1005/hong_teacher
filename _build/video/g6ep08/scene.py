"""「수학 원리 돋보기」 6학년 8화 — 각기둥의 전개도 (6-1 2단원 5~6차시, 화 코드 6-1-2-c)

각기둥의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림 = 각기둥의 전개도
밑면 2개 + 옆면(한 밑면의 변의 수만큼 직사각형), 접었을 때 겹치는 면이 없고 맞닿는 선분의 길이가 같게
잘린 모서리는 실선, 잘리지 않은 모서리는 점선 / 어느 모서리를 자르는지에 따라 여러 가지 전개도
(예시 삼각기둥: 밑면은 세 변 3 cm, 4 cm, 5 cm인 직각삼각형, 높이 6 cm — 이 영상에서 정한 수)
최종: GRADE=6 ./make_final.sh 8
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, DashedLine, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from solid import prism

RECTS = [[(0, 0), (3, 0), (3, 6), (0, 6)], [(3, 0), (7, 0), (7, 6), (3, 6)], [(7, 0), (12, 0), (12, 6), (7, 6)]]
NETS = {
    1: RECTS + [[(3, 6), (7, 6), (3, 9)], [(3, 0), (7, 0), (3, -3)]],
    2: RECTS + [[(0, 6), (3, 6), (3, 10)], [(3, 0), (7, 0), (3, -3)]],
}


def net(kind, s, origin):
    """전개도: (면들, 실선, 점선). s = 1 cm의 화면 길이"""
    polys = NETS[kind]
    o_ = np.array(origin, float)

    def P(p):
        return o_ + np.array([p[0] * s, p[1] * s, 0])

    faces = VGroup()
    for k, poly in enumerate(polys):
        faces.add(Polygon(*[P(p) for p in poly], fill_color=BLUE if k < 3 else ORANGE, fill_opacity=0.35, stroke_width=0))
    cnt = {}
    for poly in polys:
        for i in range(len(poly)):
            e = tuple(sorted((poly[i], poly[(i + 1) % len(poly)])))
            cnt[e] = cnt.get(e, 0) + 1
    solid, dashed = VGroup(), VGroup()
    for e, c in cnt.items():
        if c == 1:
            solid.add(Line(P(e[0]), P(e[1]), color=INK, stroke_width=4))
        else:
            dashed.add(DashedLine(P(e[0]), P(e[1]), color=INK, stroke_width=3, dash_length=0.12))
    return faces, solid, dashed, P


class G6Ep08(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 8
    EP_TITLE = "각기둥의 전개도"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.unfold()
        self.check()
        self.many()
        self.closing(f"각기둥의 전개도: 밑면 {o('2개')}와 옆면(변의 수만큼 {b('직사각형')})\n접었을 때 {g('맞닿는 선분의 길이')}가 같아요",
                     next_preview="6학년 9화 · 각뿔이란?")
        self.wait(0.5)

    def solid3(self, center):
        s = prism([(0, 0), (4 * 0.42, 0), (0, 3 * 0.42 * 1.6)], 6 * 0.42, center=center)
        return s

    def problem(self):
        self.section("문제")
        q = M("삼각기둥의 모서리를 잘라서 펼치면\n어떤 모양이 될까요?", 44).move_to([0.6, 1.7, 0])
        self.say("잘라서 펼치면?", "삼각기둥의 모서리를 잘라서 평면 위에 펼치면 어떤 모양이 될까요?")
        self.play(Write(q), run_time=0.9)
        s = self.solid3((0, -0.7, 0))
        self.play(FadeIn(s.face(0, ORANGE, 0.3)), FadeIn(s.face(1, ORANGE, 0.5)), Create(s.edges()), run_time=0.8)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def unfold(self):
        self.section("펼친 그림 = 전개도")
        s = self.solid3((-4.3, 0.3, 0))
        sol = VGroup(s.face(0, ORANGE, 0.3), s.face(1, ORANGE, 0.5), *[s.face(k, BLUE, 0.3) for k in range(2, 5) if s.vis[k]], s.edges(width=4))
        self.play(FadeIn(sol), run_time=0.5)
        faces, solid, dashed, P = net(1, 0.36, (-0.2, -1.2, 0))
        self.say("옆면 3개를 펼치면 직사각형", "옆면 3개를 이어서 펼치면 직사각형 3개가 나란히 놓여요.")
        self.play(LaggedStart(*[FadeIn(f, shift=RIGHT * 0.3) for f in faces[:3]], lag_ratio=0.3, run_time=1.0))
        self.say(f"밑면 {o('2개')}가 위아래에", "밑면인 삼각형 2개는 옆면의 위와 아래에 붙어요.")
        self.play(FadeIn(faces[3], shift=DOWN * 0.3), FadeIn(faces[4], shift=UP * 0.3), run_time=0.8)
        self.play(Create(solid), Create(dashed), run_time=1.0)
        t = M(f"잘린 모서리는 {M_('실선')}, 잘리지 않은 모서리는 {o('점선')}", 30).move_to([0.8, 2.5, 0])
        lab = M(f"각기둥의 {g('전개도')}", 38).move_to([-4.3, -1.9, 0])
        self.say(f"이 그림이 각기둥의 {g('전개도')}", "각기둥의 모서리를 잘라서 펼쳐 놓은 그림을 각기둥의 전개도라고 해요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선으로 그려요.")
        self.play(FadeIn(t), FadeIn(lab), run_time=0.6)
        self.play(Indicate(dashed, color=ORANGE), run_time=0.8)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def check(self):
        self.section("맞닿는 선분의 길이")
        s = 0.42
        faces, solid, dashed, P = net(1, s, (-3.0, -0.9, 0))
        self.play(FadeIn(faces), FadeIn(solid), FadeIn(dashed), run_time=0.6)
        cm = VGroup(T("3 cm", 22, SOFT).move_to(P((1.5, 0.6))), T("4 cm", 22, SOFT).move_to(P((5, 0.6))),
                    T("5 cm", 22, SOFT).move_to(P((9.5, 0.6))), T("6 cm", 22, SOFT).next_to(Line(P((12, 0)), P((12, 6))), RIGHT, buff=0.08))
        self.play(FadeIn(cm), run_time=0.4)
        a1 = Line(P((3, 6)), P((3, 9)), color=ORANGE, stroke_width=10)
        a2 = Line(P((0, 6)), P((3, 6)), color=ORANGE, stroke_width=10)
        self.say(f"접으면 만나는 두 선분: {o('3 cm')}", "접었을 때 서로 맞닿는 선분은 길이가 같아야 해요. 삼각형의 3 cm 변은 옆면의 3 cm 변과 만나요.")
        self.play(Create(a1), Create(a2), run_time=0.8)
        b1 = Line(P((7, 6)), P((3, 9)), color=BLUE, stroke_width=10)
        b2 = Line(P((7, 6)), P((12, 6)), color=BLUE, stroke_width=10)
        self.say(f"{b('5 cm')}끼리 만나요", "삼각형의 5 cm 변은 옆면의 5 cm 변과 만나요.")
        self.play(Create(b1), Create(b2), run_time=0.8)
        t = M(f"접었을 때 {g('겹치는 면이 없고')}\n맞닿는 선분의 {g('길이가 같게')}", 30).move_to([4.7, 1.8, 0])
        self.say(f"겹치는 면 없이, 길이가 같게", "전개도를 그릴 때는 접었을 때 겹치는 면이 없고 맞닿는 선분의 길이가 같게 그려요.")
        self.play(FadeIn(t), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def many(self):
        self.section("여러 가지 전개도")
        f1, s1, d1, _ = net(1, 0.3, (-5.0, -1.4, 0))
        f2, s2, d2, _ = net(2, 0.3, (1.4, -1.4, 0))
        self.say("자르는 모서리가 다르면", "어느 모서리를 자르는지에 따라 여러 가지 전개도가 나와요.")
        self.play(FadeIn(VGroup(f1, s1, d1)), run_time=0.6)
        self.play(FadeIn(VGroup(f2, s2, d2)), run_time=0.6)
        t = M(f"밑면 {o('2개')}, 옆면 {b('3개')}는 언제나 같아요", 34).move_to([0, 2.4, 0])
        self.say(f"밑면 {o('2개')}와 옆면 {b('3개')}", "모양은 달라도 밑면 2개와 옆면 3개가 있고, 접으면 같은 삼각기둥이 돼요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()


def M_(s):
    return f"<b>{s}</b>"
