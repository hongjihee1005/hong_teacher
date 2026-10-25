"""「과학 원리 돋보기」 5학년 6화 — 화석이 알려 주는 비밀 (5-1 1단원 지층과 화석 8차시, 화 코드 5-1-1-f)

바탕: grade5/science/sem1/u1-6.html(원본 _build_tb/src/u1-6.html) — 도입(갯벌 발자국: 물갈퀴가 있는 새, 근거로 추리),
공룡 발자국 화석(크기 → 공룡의 크기, 간격 → 움직임, 모양 → 종류, 깊이 → 무게), 과거에 있었던 일 추리(정답이 하나가 아님),
💡 추리는 관찰한 사실과 지식으로 · 우리나라 공룡 발자국 화석, 산호 화석(나뭇가지와 비슷, 세로로 길쭉한 기둥 →
오늘날 산호: 따뜻하고 깊이가 얕은 바다, 수온이 20 ℃ 아래로 잘 내려가지 않는 곳 → 과거에 따뜻하고 얕은 바다, 산호는 동물),
고사리 화석(따뜻하고 습기가 많은 육지), 화석을 이용해 알 수 있는 것(지구의 모양과 크기는 아님) · 소중히 보존, 한눈에 쏙(산호 화석).
(앱의 공룡알 화석·체험 더하기는 길이 때문에 뺌)
최종: ./make_final.sh s5ep06
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Arrow, Line, Polygon,
                   DoubleArrow, LaggedStart)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def duck_foot(s=1.0):
    web = Polygon([0, -0.35, 0], [-0.55, 0.45, 0], [0, 0.6, 0], [0.55, 0.45, 0],
                  fill_color="#8E7458", fill_opacity=0.85, stroke_color=K.FC, stroke_width=3)
    toes = VGroup(*[Line([0, -0.35, 0], [x, y, 0], stroke_color=K.FC, stroke_width=6)
                    for x, y in ((-0.55, 0.45), (0, 0.62), (0.55, 0.45))])
    return VGroup(web, toes).scale(s)


class S5Ep06(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 6
    EP_TITLE = "화석이 알려 주는 비밀"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.tracks()
        self.coral()
        self.fern()
        self.know()
        self.summary()
        self.closing(f"화석으로 옛날 생물의 {o('모습')}과 과거의 {o('환경')}을 알 수 있어요\n산호 화석 → {g('따뜻하고 얕은 바다')}",
                     next_preview="5학년 마인드맵 1 · 지층과 화석")
        self.wait(0.5)

    # ── 궁금해요: 갯벌 발자국 ──
    def intro(self):
        self.section("궁금해요")
        mud = K.rect(9.0, 3.6, "#B9A27E", y=0.4, stroke="#7E6A50", sw=4, r=0.2)
        cap = T("갯벌에 찍힌 발자국", 30).move_to([0, 2.55, 0])
        feet = VGroup(*[duck_foot(0.8).rotate(-0.3 if i % 2 else 0.3).move_to([-3.2 + i * 1.6, 0.1 + (0.5 if i % 2 else -0.3), 0])
                        for i in range(5)])
        self.say("어떤 동물의 발자국일까요?", "갯벌에 찍힌 발자국이에요. 어떤 동물의 발자국일까요? 무엇을 근거로 했나요?")
        self.play(FadeIn(mud), FadeIn(cap), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(f, scale=0.7) for f in feet], lag_ratio=0.25), run_time=1.4)
        self.pause_screen(5, "무엇을 근거로 추리했나요?")
        self.say(f"발가락 사이에 {o('물갈퀴')}가 있으니 오리 같은 새예요",
                 "발가락 사이에 물갈퀴가 있으니 오리 같은 새의 발자국이에요. 발자국을 근거로 추리했어요.")
        self.play(Indicate(feet[2], color=ORANGE, scale_factor=1.3), run_time=1.0)
        self.say("화석으로 우리는 무엇을 알 수 있을까요?",
                 "화석으로는 무엇을 알 수 있을까요? 화석이 알려 주는 정보로 과거 생물의 모습과 환경을 추리해 봐요.")
        self.settle()
        clear_stage(self)

    # ── 공룡 발자국 화석 ──
    def tracks(self):
        self.section("공룡 발자국")
        tw, big, small = K.trackway(10.0, 3.6)
        VGroup(tw).move_to([0, 0.75, 0])
        self.say("공룡 발자국 화석으로 무엇을 알 수 있을까요?",
                 "공룡 발자국 화석이에요. 발자국의 크기와 발자국 사이의 간격을 재어 봐요.")
        self.play(FadeIn(tw), run_time=0.8)
        b0, b1 = big[0], big[1]
        da = DoubleArrow([b0.get_x(), b0.get_bottom()[1] - 0.25, 0], [b1.get_x(), b0.get_bottom()[1] - 0.25, 0],
                         color=RED, stroke_width=5, buff=0, tip_length=0.2)
        dl = T("간격", 24, RED).next_to(da, DOWN, buff=0.05)
        sa = DoubleArrow(b0.get_corner(DOWN + LEFT) + LEFT * 0.15, b0.get_corner(UP + LEFT) + LEFT * 0.15,
                         color=RED, stroke_width=5, buff=0, tip_length=0.2)
        sl = T("크기", 24, RED).next_to(sa, LEFT, buff=0.05)
        self.play(Create(da), FadeIn(dl), Create(sa), FadeIn(sl), run_time=0.8)
        self.pause_screen(5, "발자국으로 무엇을 알 수 있을까요?")
        rows = [("발자국의 크기", "공룡의 크기"), ("발자국 사이의 간격", "공룡의 움직임"),
                ("발자국의 모양", "공룡의 종류"), ("발자국의 깊이", "공룡의 무게")]
        tbl = VGroup()
        for a, b in rows:
            tbl.add(VGroup(T(a, 28), T("→", 28, ORANGE), T(b, 28, GREEN)).arrange(RIGHT, buff=0.25))
        tbl.arrange_in_grid(rows=2, cols=2, buff=(0.9, 0.25), col_alignments="ll").move_to([0, -1.75, 0])
        self.play(VGroup(tw, da, dl, sa, sl).animate.shift(UP * 0.35), run_time=0.4)
        self.say(f"크기로 {o('공룡의 크기')}, 간격으로 {o('움직임')}을 짐작해요",
                 "발자국의 크기로 공룡의 크기를 짐작할 수 있고, 발자국 사이의 간격으로 공룡의 움직임을 알 수 있어요.")
        self.play(FadeIn(tbl[0]), FadeIn(tbl[1]), run_time=0.6)
        self.say(f"모양으로 {o('공룡의 종류')}, 깊이로 {o('무게')}를 짐작해요",
                 "발자국의 모양으로 어떤 공룡이었는지 종류를 알 수 있고, 발자국의 깊이로 공룡의 무게를 짐작할 수 있어요.")
        self.play(FadeIn(tbl[2]), FadeIn(tbl[3]), run_time=0.6)
        self.settle()
        self.play(FadeOut(tbl), run_time=0.3)
        self.say("과거에 이곳에서 무슨 일이 있었을까요?",
                 "큰 발자국과 작은 발자국을 보고 과거에 무슨 일이 있었는지 추리해 봐요. 정답은 하나가 아니에요.")
        self.play(Indicate(big, color=ORANGE, scale_factor=1.05), Indicate(small, color=BLUE, scale_factor=1.1), run_time=1.2)
        note = K.text_card(["예) 발이 큰 공룡과 작은 공룡이 걸어가다가 서로 만났어요",
                            "추리는 관찰한 사실과 알고 있는 지식을 바탕으로 해요"], w=12.6, size=28).move_to([0, -1.8, 0])
        self.say(f"추리는 {o('관찰한 사실')}과 {o('지식')}을 바탕으로 해요",
                 "예를 들어 큰 공룡과 작은 공룡이 걸어가다 만났다고 추리할 수 있어요. 추리는 관찰한 사실과 알고 있는 지식을 바탕으로 해요.")
        self.play(FadeOut(VGroup(da, dl, sa, sl)), FadeIn(note, shift=UP * 0.2), run_time=0.6)
        self.say("우리나라는 공룡이 살기 좋은 환경이었어요",
                 "우리나라에서는 공룡 발자국 화석이 많이 발견되어, 과거에 공룡이 살기 좋은 환경이었다는 것을 알 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 산호 화석 ──
    def coral(self):
        self.section("산호 화석")
        sl = K.slab("coral", 3.6, 2.8).move_to([-3.8, 0.7, 0])
        d1 = T("나뭇가지와 생김새가 비슷해요", 28).next_to(sl, DOWN, buff=0.2)
        d2 = T("세로로 길쭉한 기둥 모양", 28).next_to(d1, DOWN, buff=0.1)
        self.say("산호 화석이 발견된 곳은 과거에 어떤 환경이었을까요?",
                 "산호 화석은 나뭇가지와 생김새가 비슷하고, 세로로 길쭉한 기둥 모양이에요. 이곳은 과거에 어떤 환경이었을까요?")
        self.play(FadeIn(sl), FadeIn(d1), FadeIn(d2), run_time=0.8)
        sea = K.warm_sea(5.6, 3.2).move_to([3.2, 0.5, 0])
        st = T("오늘날 산호가 사는 곳", 28).next_to(sea, UP, buff=0.12)
        self.say(f"오늘날 산호는 {o('따뜻하고 깊이가 얕은 바다')}에 살아요",
                 "오늘날 산호는 대체로 따뜻하고 깊이가 얕은 바다, 수온이 20도 아래로 잘 내려가지 않는 곳에 살아요.")
        self.play(FadeIn(sea), FadeIn(st), run_time=0.8)
        self.pause_screen(5, "과거에 어떤 환경이었을까요?")
        ans = K.label("과거: 따뜻하고 깊이가 얕은 바다", GREEN, 30).move_to([3.2, -1.6, 0])
        self.say(f"과거에 {g('따뜻하고 깊이가 얕은 바다')}였어요",
                 "산호 화석이 발견된 곳은 과거에 따뜻하고 깊이가 얕은 바다였다는 것을 알 수 있어요. 참, 산호는 식물이 아니라 동물이에요.")
        self.play(FadeIn(ans, scale=0.9), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 고사리 화석 ──
    def fern(self):
        self.section("고사리 화석")
        sl = K.slab("fern", 3.6, 2.8).move_to([-3.8, 0.7, 0])
        land = K.humid_land(5.6, 3.2).move_to([3.2, 0.5, 0])
        st = T("오늘날 고사리가 잘 자라는 곳", 28).next_to(land, UP, buff=0.12)
        self.say("고사리 화석이 발견된 곳의 과거 환경은?",
                 "고사리는 오늘날 따뜻하고 습기가 많은 곳에서 잘 자라요. 고사리 화석이 발견된 곳은 어땠을까요?")
        self.play(FadeIn(sl), FadeIn(land), FadeIn(st), run_time=0.8)
        ans = K.label("과거: 따뜻하고 습기가 많은 육지", GREEN, 30).move_to([3.2, -1.6, 0])
        self.say(f"과거에 {g('따뜻하고 습기가 많은 육지')}였어요",
                 "고사리 화석이 발견된 곳은 과거에 따뜻하고 습기가 많은 육지였다는 것을 알 수 있어요.")
        self.play(FadeIn(ans, scale=0.9), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 화석으로 알 수 있는 것 ──
    def know(self):
        self.section("화석의 가치")
        items = [("옛날에 살았던 생물의 생김새와 특징", True), ("옛날에 살았던 생물의 생활 모습", True),
                 ("화석이 발견된 곳의 과거 환경", True), ("지층이 쌓인 당시의 환경", True), ("지구의 모양과 크기", False)]
        rows = VGroup(*[T(t, 30) for t, _ in items]).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([0.4, 0.55, 0])
        marks = VGroup(*[K.ox_mark(ok, 0.24).next_to(rw, LEFT, buff=0.35) for rw, (t, ok) in zip(rows, items)])
        self.say("화석을 이용해 알 수 있는 것은?", "화석을 이용해 알 수 있는 것을 모두 찾아봐요.")
        self.play(FadeIn(rows, lag_ratio=0.12), run_time=0.9)
        self.say(f"옛날 생물의 모습과 {o('과거의 환경')}을 알 수 있어요",
                 "화석으로 옛날 생물의 생김새와 특징, 생활 모습, 화석이 발견된 곳의 과거 환경, 지층이 쌓인 당시의 환경을 알 수 있어요. 지구의 모양과 크기는 알 수 없어요.")
        self.play(FadeIn(marks, lag_ratio=0.15), run_time=0.9)
        self.say(f"그래서 화석은 {g('소중히 보존')}해야 해요",
                 "이처럼 화석은 과거 지구에 관한 많은 정보를 알려 줘요. 그래서 화석은 소중히 보존해야 해요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        sl = K.slab("coral", 2.8, 2.0).move_to([-2.4, 1.45, 0])
        sea = K.warm_sea(4.6, 2.2).move_to([2.9, 1.45, 0])
        ar = Arrow([-0.8, 1.45, 0], [0.35, 1.45, 0], color=ORANGE, stroke_width=8, buff=0)
        card = K.text_card(["화석이 발견된 지역의 환경이 과거에 따뜻하고 깊이가 얕은",
                            f"바다였다는 것을 알려 주는 화석은 {g('산호')} 화석입니다."], w=12.8, size=36).move_to([0, -1.1, 0])
        self.say(f"과거에 따뜻하고 얕은 바다였음을 알려 주는 화석은 {g('산호')} 화석이에요",
                 "화석이 발견된 지역의 환경이 과거에 따뜻하고 깊이가 얕은 바다였다는 것을 알려 주는 화석은 산호 화석이에요.")
        self.play(FadeIn(sl), Create(ar), FadeIn(sea), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
