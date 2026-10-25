"""「과학 원리 돋보기」 3학년 12화 — 물에 사는 식물과 부레옥잠 (3-1 3단원 식물의 생활 4차시, 화 코드 3-1-3-c)

바탕: grade3/science/sem1/u3-3.html — 부레옥잠 실험실(안전: 실험복·안전 장갑, 자를 때 손 조심 / 잎몸·잎자루(풍선처럼 부풂)·뿌리(수염처럼 빽빽, 물속)·줄기,
잎자루를 가로·세로로 자름 → 단면에 작은 공기주머니가 벌집처럼 빽빽, 물속에서 누르면 공기 방울이 나와 위로 올라감 → 공기주머니 덕분에 물에 쉽게 뜸),
물에 사는 식물 8가지(잎이 물 위로 높이: 연꽃·갈대 / 잎이 물 위에 떠: 수련·마름 / 떠서: 부레옥잠·개구리밥 / 잠겨서: 검정말·붕어마름),
물 흐르게 하기(검정말 줄기가 휨), 생각 바로잡기(부푼 부분은 줄기가 아니라 잎자루), 한눈에 쏙(붕어마름·검정말은 줄기가 가늘며 잘 휘어),
생각+(물속에 넣었다 손을 떼면 떠오름).
최종: ./make_final.sh s3ep12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, Line, RoundedRectangle, VGroup,
                   Circumscribe, Transform, DashedLine, AnimationGroup, Rectangle, Circle, Ellipse, Polygon, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, SKIN, clear_stage, tag
from kit_s3u13 import (LEAF_EDGE, WATER, WATER_EDGE, bubble, bure_okjam, gaegurbap, galdae, geomjeongmal, honeycomb,
                       lotus, suryeon, water_body, wind_lines)


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def finger():
    return VGroup(RoundedRectangle(corner_radius=0.22, width=0.46, height=1.6, fill_color=SKIN, fill_opacity=1,
                                   stroke_color=INK, stroke_width=3),
                  RoundedRectangle(corner_radius=0.08, width=0.3, height=0.3, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=INK, stroke_width=2).shift(DOWN * 0.55))


class S3Ep12(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 12
    EP_TITLE = "물에 사는 식물과 부레옥잠"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.pond()
        self.observe()
        self.cut()
        self.press()
        self.why_float()
        self.others()
        self.flow()
        self.check()
        self.closing(f"부레옥잠은 잎자루 속 {o('공기주머니')} 덕분에 물에 뜨고,\n검정말은 줄기가 가늘어 {g('잘 휘어요')}",
                     next_preview="3학년 13화 · 사막과 높은 산의 식물")
        self.wait(0.5)

    # ── 연못 ──
    def pond(self):
        self.section("궁금해요")
        w = water_body(top=0.2, bottom=-2.45)
        plants = VGroup(lotus(2.2).shift([-4.6, -2.45, 0]), suryeon(1.3).shift([-1.6, 0.2, 0]),
                        bure_okjam(0.75).shift([1.6, 0.2, 0]), geomjeongmal(2.0, 0.2).shift([4.6, -2.45, 0]))
        self.say("강이나 연못에서 식물을 본 적이 있나요?", "강이나 연못에서 식물을 본 적이 있나요?")
        self.play(FadeIn(w), FadeIn(plants, lag_ratio=0.2), run_time=1.2)
        self.say("물에 사는 식물은 땅에 사는 식물과 어떤 점이 다를까요?",
                 "물에 사는 식물은 땅에 사는 식물과 어떤 점이 다를까요?")
        self.settle()
        clear_stage(self)

    # ── 부레옥잠 관찰 ──
    def observe(self):
        self.section("관찰해요")
        safe = M(f"실험복 · 안전 장갑 착용  ·  자를 때 {r('손을 다치지 않게')} 조심", 32).move_to([0.6, 2.65, 0])
        w = water_body(x0=-4.2, x1=4.2, top=-0.2, bottom=-2.45)
        b = bure_okjam(1.6).shift([0, -0.2, 0])
        self.b = b
        self.say("부레옥잠을 관찰해요", "부레옥잠을 관찰해요. 실험복과 안전 장갑을 착용하고, 자를 때 손을 다치지 않게 조심해요.")
        self.play(FadeIn(safe), FadeIn(w), FadeIn(b), run_time=1.0)
        labels = [
            ("잎몸", b.blade[1].get_center(), [-4.2, 1.6, 0], "잎몸은 물 위에서 위를 향하고 있어요."),
            ("잎자루", b.stalks[0][1].get_center(), [-5.3, -0.3, 0], "잎자루는 풍선처럼 부풀어 있어요. 만져 보면 말랑말랑해요."),
            ("뿌리", b.roots.get_center() + DOWN * 0.3, [-4.0, -2.0, 0], "뿌리는 수염처럼 빽빽하게 나 있고, 물속에 있어요."),
            ("줄기", b.stem.get_right(), [4.6, -0.9, 0], "줄기는 잎자루 아래에 있어요."),
        ]
        subs = [f"{o('잎몸')}은 물 위에서 위를 향해요", f"{o('잎자루')}가 풍선처럼 부풀어 있어요",
                f"{o('뿌리')}는 수염처럼 빽빽하고 물속에 있어요", f"{o('줄기')}는 잎자루 아래에 있어요"]
        for (nm, pt, pos, n), sub in zip(labels, subs):
            tg = tag(nm, LEAF_EDGE, 36).move_to(pos)
            ar = Arrow(tg.get_center(), pt, buff=0.05, stroke_color=LEAF_EDGE, stroke_width=5, max_tip_length_to_length_ratio=0.1)
            self.say(sub, n)
            self.play(Create(ar), FadeIn(tg, scale=0.8), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 자르기 ──
    def cut(self):
        self.section("실험해요")
        stalk = Ellipse(width=1.5, height=2.3, fill_color="#A6DC8A", fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=5).move_to([-4.3, 0.3, 0])
        cut1 = DashedLine([-5.4, 0.3, 0], [-3.2, 0.3, 0], stroke_color=RED, stroke_width=5)
        cut2 = DashedLine([-4.3, 1.6, 0], [-4.3, -1.0, 0], stroke_color=RED, stroke_width=5)
        self.say("부레옥잠의 잎자루를 잘라요", "부레옥잠의 잎자루를 가로로 한 번, 세로로 한 번 잘라요.")
        self.play(FadeIn(stalk), run_time=0.5)
        self.play(Create(cut1), Create(cut2), run_time=0.8)
        q1 = RoundedRectangle(corner_radius=0.2, width=2.4, height=2.4, fill_color="#DDF2C9", fill_opacity=1, stroke_color=SOFT, stroke_width=3).move_to([-0.6, 0.3, 0])
        q2 = RoundedRectangle(corner_radius=0.2, width=2.0, height=2.8, fill_color="#DDF2C9", fill_opacity=1, stroke_color=SOFT, stroke_width=3).move_to([3.6, 0.3, 0])
        qm1 = T("?", 80, SOFT).move_to(q1)
        qm2 = T("?", 80, SOFT).move_to(q2)
        t1 = T("가로 단면", 32, INK).next_to(q1, DOWN, buff=0.2)
        t2 = T("세로 단면", 32, INK).next_to(q2, DOWN, buff=0.2)
        self.say("잘린 면을 돋보기로 관찰해요", "잘린 면을 돋보기로 관찰해 봐요.")
        self.play(FadeIn(VGroup(q1, qm1, t1, q2, qm2, t2)), run_time=0.6)
        self.pause_screen(5, "잘린 면의 속 모양은 어떨까요?")
        h1 = honeycomb(1.15, True).move_to(q1)
        h2 = honeycomb(1.25, False).move_to(q2)
        self.play(FadeOut(VGroup(q1, qm1, q2, qm2)), FadeIn(h1, scale=0.8), FadeIn(h2, scale=0.8), run_time=0.8)
        self.say(f"동글동글한 작은 {o('공기주머니')}가 벌집처럼 빽빽해요",
                 "동글동글한 작은 공기주머니가 벌집처럼 빽빽하게 있어요.")
        self.play(Indicate(h1[1], color=ORANGE, scale_factor=1.05), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 물속에서 누르기 ──
    def press(self):
        beaker = VGroup(
            Rectangle(width=3.6, height=3.4, fill_color=WATER, fill_opacity=0.85, stroke_width=0).move_to([0, -0.85, 0]),
            Line([-1.85, 1.3, 0], [-1.85, -2.55, 0], stroke_color=SOFT, stroke_width=6),
            Line([1.85, 1.3, 0], [1.85, -2.55, 0], stroke_color=SOFT, stroke_width=6),
            Line([-1.85, -2.55, 0], [1.85, -2.55, 0], stroke_color=SOFT, stroke_width=6),
            Line([-1.8, 0.85, 0], [1.8, 0.85, 0], stroke_color=WATER_EDGE, stroke_width=4))
        piece = Ellipse(width=1.3, height=0.9, fill_color="#A6DC8A", fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=4).move_to([0, -1.95, 0])
        f = finger().move_to([0, 0.0, 0])
        self.say("자른 잎자루를 물속에 넣고 손가락으로 눌러요", "자른 잎자루를 물속에 넣고 손가락으로 눌러 봐요.")
        self.play(FadeIn(beaker), FadeIn(piece), run_time=0.6)
        self.play(FadeIn(f, shift=DOWN * 0.4), run_time=0.5)
        self.pause_screen(5, "어떤 일이 일어날까요?")
        self.play(f.animate.shift(DOWN * 0.95), piece.animate.stretch(0.7, 1).shift(DOWN * 0.1), run_time=0.6)
        rng = np.random.default_rng(5)
        bubs = VGroup(*[bubble(rng.uniform(0.07, 0.13)).move_to([rng.uniform(-0.6, 0.6), -1.8 + rng.uniform(-0.1, 0.2), 0]) for _ in range(12)])
        self.add(bubs)
        self.say(f"{o('공기 방울')}이 나와 위로 올라가요", "잎자루에서 여러 개의 공기 방울이 나와 위로 올라가요.")
        self.play(*[bb.animate.shift(UP * rng.uniform(2.1, 2.6)) for bb in bubs], run_time=1.8, lag_ratio=0.08)
        self.play(FadeOut(bubs), run_time=0.3)
        self.settle()
        clear_stage(self)

    def why_float(self):
        self.section("정리해요")
        w = water_body(x0=-6.5, x1=-0.3, top=-0.4, bottom=-2.45)
        b = bure_okjam(1.1).shift([-3.4, -0.4, 0])
        hc = honeycomb(0.7).move_to([-5.7, 1.4, 0])
        ln = Line(hc.get_bottom(), b.stalks[0][1].get_left(), stroke_color=SOFT, stroke_width=3)
        txt = VGroup(M(f"잎자루 속 {o('공기주머니')}에", 40), M("공기가 들어 있어서", 40), M(f"물에 {g('쉽게 떠요')}", 40)).arrange(DOWN, buff=0.25).move_to([3.4, 0.6, 0])
        self.say(f"잎자루 속 공기주머니 덕분에 물에 {g('쉽게 떠요')}",
                 "부레옥잠은 잎자루가 풍선처럼 부풀어 있고, 잎자루 속 공기주머니에 공기가 들어 있어서 물에 쉽게 떠요.")
        self.play(FadeIn(w), FadeIn(b), Create(ln), FadeIn(hc), run_time=0.8)
        self.play(FadeIn(txt, lag_ratio=0.3), run_time=0.9)
        self.say(f"생각 바로잡기: 부푼 부분은 줄기가 아니라 {o('잎자루')}예요",
                 "생각 바로잡기! 부레옥잠의 풍선처럼 부푼 부분은 줄기가 아니라 잎자루예요. 줄기는 잎자루 아래에 있어요.")
        self.play(Circumscribe(b.stalks, color=ORANGE), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 여러 가지 물에 사는 식물 ──
    def others(self):
        self.section("조사해요")
        w = water_body(top=-0.35, bottom=-2.5)
        self.add(w)
        self.play(FadeIn(w), run_time=0.4)
        groups = [
            ("잎이 물 위로 높이", -5.25, VGroup(lotus(2.3).shift([-5.9, -2.5, 0]), galdae(2.5).shift([-4.6, -2.5, 0])),
             "연꽃 · 갈대", "연꽃과 갈대는 잎이 물 위로 높이 자라요. 갈대는 줄기가 단단해요."),
            ("잎이 물 위에 떠", -1.85, VGroup(suryeon(1.4).shift([-2.0, -0.35, 0]), Line([-1.0, -2.5, 0], [-1.3, -0.4, 0], stroke_color="#4B8A37", stroke_width=3),
                                          Line([-2.0, -2.5, 0], [-2.0, -0.4, 0], stroke_color="#4B8A37", stroke_width=3),
                                          *[Polygon([-1.3 + dx - 0.16, -0.35, 0], [-1.3 + dx, -0.27, 0], [-1.3 + dx + 0.16, -0.35, 0], [-1.3 + dx, -0.43, 0],
                                                    fill_color="#3E8E3A", fill_opacity=1, stroke_color=LEAF_EDGE, stroke_width=2) for dx in (-0.2, 0.05, 0.3)]),
             "수련 · 마름", "수련과 마름은 물속 땅에 뿌리를 내리고 잎이 물 위에 떠 있어요."),
            ("물에 떠서", 1.75, VGroup(bure_okjam(0.75).shift([1.2, -0.35, 0]), gaegurbap(4).shift([2.6, -0.35, 0])),
             "부레옥잠 · 개구리밥", "부레옥잠과 개구리밥은 물에 떠서 살아요. 뿌리가 물속으로 뻗어 있어요."),
            ("물속에 잠겨서", 5.25, VGroup(geomjeongmal(1.8, 0.1).shift([4.8, -2.5, 0]), geomjeongmal(1.6, -0.15, 6).shift([5.8, -2.5, 0])),
             "검정말 · 붕어마름", "검정말과 붕어마름은 몸 전체가 물속에 잠겨서 살아요."),
        ]
        self.sub_plants = {}
        for title, x, pics, names, n in groups:
            hd = T(title, 30, BLUE).move_to([x, 2.55, 0])
            nm = T(names, 26, INK).move_to([x, 2.05, 0])
            self.say(f"{title} — {names}", n)
            self.play(FadeIn(hd), FadeIn(nm), FadeIn(pics, shift=UP * 0.2), run_time=0.8)
            self.sub_plants[title] = pics
        self.pond_w = w

    def flow(self):
        sub = self.sub_plants["물속에 잠겨서"]
        bent = VGroup(geomjeongmal(1.8, 0.75).shift([4.8, -2.5, 0]), geomjeongmal(1.6, 0.6, 6).shift([5.8, -2.5, 0]))
        lines = VGroup(*[Line([3.6, y, 0], [4.6, y, 0], stroke_color=PAPER, stroke_width=6) for y in (-0.9, -1.4, -1.9)])
        self.say("물이 흐르면 어떻게 될까요?", "물이 흐르면 검정말은 어떻게 될까요?")
        self.play(FadeIn(lines, shift=RIGHT * 0.5), run_time=0.5)
        self.play(Transform(sub, bent), lines.animate.shift(RIGHT * 0.6), run_time=1.0)
        self.say(f"가는 줄기가 물의 흐름을 따라 {o('잘 휘어요')}",
                 "검정말 줄기는 가늘어서 물의 흐름을 따라 잘 휘어요. 그래서 줄기가 부러지지 않고 물속에서 살 수 있어요.")
        self.settle()
        clear_stage(self)
        self.section("정리해요")
        box = RoundedRectangle(corner_radius=0.3, width=12.6, height=2.0, fill_color=PAPER, fill_opacity=1,
                               stroke_color=GREEN, stroke_width=5).move_to([0, 1.2, 0])
        txt = M(f"붕어마름이나 검정말은 줄기가 가늘며 {o('잘 휘어')}\n물속에 잠겨서 살기에 적당해요", 40).move_to(box)
        self.say("한눈에 쏙 정리해요", "한눈에 정리해요. 붕어마름이나 검정말은 줄기가 가늘며 잘 휘어 물속에 잠겨서 살기에 적당해요.")
        self.play(FadeIn(box), FadeIn(txt), run_time=0.8)
        more = M(f"잎에 {o('공기')}가 들어 있거나 줄기가 잘 휘는 등\n{o('물')}에서 살기에 알맞은 생김새와 생활 방식", 36).move_to([0, -1.0, 0])
        self.say(f"물에서 살기에 {g('알맞은')} 생김새와 생활 방식", "물에 사는 식물은 물에서 살기에 알맞은 생김새와 생활 방식을 가지고 있어요.")
        self.play(FadeIn(more), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각+ ──
    def check(self):
        self.section("생각해요")
        w = water_body(x0=-3.5, x1=3.5, top=0.3, bottom=-2.45)
        b = bure_okjam(0.8).shift([0, -1.25, 0])
        hand = finger().move_to(b.blade.get_top() + UP * 0.75)
        self.say("부레옥잠을 물속에 집어넣고 손을 떼면?", "부레옥잠을 물속으로 집어넣고 손을 떼면 어떻게 될까요?")
        self.play(FadeIn(w), FadeIn(b), FadeIn(hand), run_time=0.6)
        self.pause_screen(5, "떠오를까요, 가라앉을까요?")
        self.play(hand.animate.shift(UP * 1.0), run_time=0.4)
        self.play(FadeOut(hand), b.animate.shift(UP * 1.55), run_time=1.3)
        self.say(f"물 위로 {g('떠올라요')} — 잎자루 속 공기 덕분이에요",
                 "물 위로 다시 떠올라요. 잎자루 속 공기주머니에 공기가 들어 있기 때문이에요.")
        self.settle()
        clear_stage(self)
