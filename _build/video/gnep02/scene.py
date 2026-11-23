"""「수학 원리 돋보기」 자연수 이야기 2화 — 사람들은 언제부터 수를 세었을까?

- 하나에 하나 짝짓기(양 한 마리 ↔ 조약돌 하나): 고고학자 슈만트-베세라트가 드는 설명용 예 → '이렇게 설명하기도 해요'
- calculate(계산하다) ← 라틴어 calculus '작은 돌' (Merriam-Webster, wordorigins)
- 레봄보 뼈: 남아프리카 레봄보 산맥 보더 동굴, 약 4만 3천 년 전, 눈금 29개(한쪽 부러짐) (PNAS 2012, MathWorld)
- 이샹고 뼈: 콩고민주공화국 이샹고, 1950년 발견, 약 2만 년 전(1만 8천~2만 5천 년, 의견 다름), 벨기에 브뤼셀 왕립 자연과학연구소 소장, 무엇을 셌는지 의견이 갈림 (연구소 자료)
- 인도-아라비아 숫자: 인도에서 생겨 이슬람 세계를 거쳐 유럽으로, 피보나치 1202년 『산반서』 (Britannica, MacTutor)
최종: GRADE=n ./make_final.sh 2
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, Ellipse, FadeIn, FadeOut, Indicate, LaggedStart, Line, Polygon,
                   RoundedRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from storykit import show_sources, timeline

BONE = "#EFE6D2"
STONE = "#9A9488"


class NatScene(EpisodeScene):
    GRADE, SEM = "N", 1
    LABEL = "자연수 이야기 {}화"


def sheep():
    body = Ellipse(width=0.9, height=0.6, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3)
    head = Ellipse(width=0.32, height=0.36, fill_color=INK, fill_opacity=1, stroke_width=0).next_to(body, RIGHT, buff=-0.08).shift(UP * 0.12)
    legs = VGroup(*[Line(body.get_bottom() + RIGHT * dx, body.get_bottom() + RIGHT * dx + DOWN * 0.22, color=INK, stroke_width=4)
                    for dx in (-0.25, 0.2)])
    return VGroup(legs, body, head)


def pebble():
    return Ellipse(width=0.36, height=0.26, fill_color=STONE, fill_opacity=1, stroke_color=INK, stroke_width=2)


def bone(n_marks, w=7.0, h=0.7, broken=False):
    pts = [[-w / 2, h / 2, 0], [w / 2, h / 2, 0], [w / 2, -h / 2, 0], [-w / 2, -h / 2, 0]]
    if broken:
        pts = [[-w / 2, h / 2, 0], [w / 2 - 0.2, h / 2, 0], [w / 2, 0.1, 0], [w / 2 - 0.3, -0.05, 0], [w / 2 - 0.1, -h / 2, 0], [-w / 2, -h / 2, 0]]
    shape = Polygon(*pts, fill_color=BONE, fill_opacity=1, stroke_color="#8C7A55", stroke_width=4)
    knob = Ellipse(width=0.7, height=h * 1.5, fill_color=BONE, fill_opacity=1, stroke_color="#8C7A55", stroke_width=4).move_to([-w / 2, 0, 0])
    xs = np.linspace(-w / 2 + 0.6, w / 2 - 0.5, n_marks)
    marks = VGroup(*[Line([x, h * 0.3, 0], [x, -h * 0.3, 0], color="#5A4A2A", stroke_width=3) for x in xs])
    return VGroup(knob, shape, marks)


class GnEp02(NatScene):
    EP_NO = 2
    EP_TITLE = "사람들은 언제부터 수를 세었을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.pebbles()
        self.bones()
        self.numerals()
        self.line()
        show_sources(self, [
            "· 양과 조약돌 짝짓기 설명: D. Schmandt-Besserat, 셈 토큰 연구(텍사스 대학교 자료)",
            "· calculate·calculus의 뜻: Merriam-Webster 'calculus', Word Origins",
            "· 레봄보 뼈: d'Errico 외(2012), PNAS 109권 / Wolfram MathWorld 'Lebombo Bone'",
            "· 이샹고 뼈: 벨기에 왕립 자연과학연구소 이샹고 안내 자료",
            "· 인도-아라비아 숫자: 브리태니커 백과 'Hindu-Arabic numerals', MacTutor 수학사",
        ])
        self.closing(f"사람들은 {o('수만 년 전')}부터 하나씩 짝지어 세었어요\n오늘 쓰는 숫자 1, 2, 3은 {b('인도')}에서 생겨 아라비아를 거쳐 왔어요",
                     next_preview="자연수 이야기 3화 · 자연수는 끝이 없어요, 그럼 0은?")
        self.wait(0.5)

    def pebbles(self):
        self.section("하나에 하나 짝짓기")
        flock = VGroup(*[sheep() for _ in range(5)]).arrange(RIGHT, buff=0.5).move_to([-2.2, 1.2, 0])
        self.say("숫자가 없던 옛날에는 어떻게 셌을까요?", "숫자가 없던 아주 옛날에는 양이 몇 마리인지 어떻게 알았을까요?")
        self.play(FadeIn(flock, lag_ratio=0.2), run_time=0.9)
        stones = VGroup(*[pebble().next_to(s, DOWN, buff=0.6) for s in flock])
        self.say(f"양 한 마리에 {o('조약돌 하나')}", "양 한 마리가 지나갈 때마다 조약돌을 하나씩 놓았다고 설명하는 학자도 있어요.")
        for s in stones:
            self.play(FadeIn(s, shift=DOWN * 0.2), run_time=0.35)
        t = M(f"저녁에 양과 돌을 짝지어 보면 빠진 양을 알 수 있어요", 40).move_to([0, -1.0, 0])
        self.say("돌과 짝지어 보면 빠진 양이 보여요", "저녁에 양과 조약돌을 하나씩 짝지어 보면, 수를 몰라도 빠진 양이 있는지 알 수 있지요.")
        self.play(FadeIn(t), FadeOut(flock[-1]), run_time=0.6)
        self.play(Indicate(stones[-1], color=ORANGE, scale_factor=1.5), run_time=0.7)
        self.settle()
        w = M(f"라틴어 {o('calculus')} = 작은 돌  →  영어 {b('calculate')} = 계산하다", 40).move_to([0, -2.1, 0])
        self.say(f"'계산하다'는 '작은 돌'에서 온 말", "영어로 계산하다는 캘큘레이트예요. 작은 돌을 뜻하는 라틴어 캘큘러스에서 온 말이에요. 옛 로마 사람들은 셈판에 작은 돌을 놓고 셈을 했어요.")
        self.play(FadeIn(w), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def bones(self):
        self.section("뼈에 새긴 눈금")
        b1 = bone(29, broken=True).move_to([0, 1.8, 0])
        n1 = M(f"{o('레봄보 뼈')} · 남아프리카 · 약 {o('4만 3천 년 전')}", 40).next_to(b1, DOWN, buff=0.35)
        self.say(f"약 {o('4만 3천 년 전')}의 레봄보 뼈", "남아프리카의 레봄보 산맥 동굴에서 약 4만 3천 년 전 뼈가 나왔어요. 눈금이 29개 새겨져 있는데, 한쪽 끝이 부러져 있어요.")
        self.play(FadeIn(b1), FadeIn(n1), run_time=0.8)
        self.play(LaggedStart(*[Indicate(m, color=ORANGE, scale_factor=1.6) for m in b1[2]], lag_ratio=0.05, run_time=1.4))
        b2 = bone(16, w=6.0).move_to([0, -0.3, 0])
        n2 = M(f"{b('이샹고 뼈')} · 콩고 · 약 {b('2만 년 전')}", 40).next_to(b2, DOWN, buff=0.35)
        self.say(f"약 {b('2만 년 전')}의 이샹고 뼈", "아프리카 콩고의 이샹고에서는 1950년에 약 2만 년 전 뼈가 발견되었어요. 지금은 벨기에 브뤼셀의 자연과학연구소에 있어요.")
        self.play(FadeIn(b2), FadeIn(n2), run_time=0.8)
        self.settle()
        t = M(f"무엇을 세었는지는 {g('아직 학자들의 의견이 갈려요')}", 38, SOFT).move_to([0, -2.25, 0])
        self.say("무엇을 세었는지는 아직 몰라요", "이 눈금으로 무엇을 세었는지는 아직 학자들 사이에 의견이 갈려요. 하지만 사람들이 아주 오래전부터 하나씩 표시하며 세었다는 흔적으로 보기도 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def numerals(self):
        self.section("숫자 1, 2, 3은 어디에서?")
        nums = VGroup(*[T(str(i), 90, BLUE) for i in range(1, 10)]).arrange(RIGHT, buff=0.45).move_to([0, 1.5, 0])
        self.say("우리가 쓰는 숫자 1부터 9", "우리가 날마다 쓰는 숫자 1, 2, 3은 어디에서 왔을까요?")
        self.play(FadeIn(nums, lag_ratio=0.1), run_time=0.9)
        route = VGroup(
            VGroup(RoundedRectangle(corner_radius=0.2, width=2.6, height=1.0, fill_color="#FBE3C8", fill_opacity=1, stroke_color=ORANGE, stroke_width=4),
                   M("인도", 40)),
            VGroup(RoundedRectangle(corner_radius=0.2, width=2.6, height=1.0, fill_color="#DCEBF8", fill_opacity=1, stroke_color=BLUE, stroke_width=4),
                   M("아라비아", 40)),
            VGroup(RoundedRectangle(corner_radius=0.2, width=2.6, height=1.0, fill_color="#DDF1E4", fill_opacity=1, stroke_color=GREEN, stroke_width=4),
                   M("유럽", 40)),
        )
        for r in route:
            r[1].move_to(r[0])
        route.arrange(RIGHT, buff=1.2).move_to([0, -0.3, 0])
        arrows = VGroup(*[M("→", 56).move_to((route[i].get_right() + route[i + 1].get_left()) / 2) for i in range(2)])
        self.say(f"{o('인도')}에서 생겨 {b('아라비아')}를 거쳐 {g('유럽')}으로", "이 숫자는 인도에서 생겨, 아라비아의 이슬람 세계 수학자들의 책을 거쳐 유럽으로 전해졌어요.")
        self.play(FadeIn(route[0]), run_time=0.4)
        self.play(FadeIn(arrows[0]), FadeIn(route[1]), run_time=0.5)
        self.play(FadeIn(arrows[1]), FadeIn(route[2]), run_time=0.5)
        t = M(f"그래서 {o('인도-아라비아 숫자')}라고 불러요\n(피보나치가 1202년 책으로 유럽에 널리 알림)", 36).move_to([0, -1.75, 0])
        self.say(f"{o('인도-아라비아 숫자')}", "그래서 이 숫자를 인도-아라비아 숫자라고 불러요. 이탈리아의 피보나치가 1202년에 쓴 책이 유럽에 널리 알렸어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def line(self):
        self.section("한눈에 보기")
        tl = timeline([("레봄보 뼈\n약 4만 3천 년 전", 0.05), ("이샹고 뼈\n약 2만 년 전", 0.38), ("인도 숫자\n약 1500년 전", 0.78), ("오늘", 0.97)], y=0.7, size=28)
        self.say("수를 세어 온 긴 역사", "사람들은 숫자를 만들기 훨씬 전부터 하나씩 짝지으며 수를 세어 왔어요.")
        self.play(Create(tl.bar), FadeIn(tl.marks, lag_ratio=0.4), run_time=1.4)
        t = M(f"자연수는 사람들이 {o('가장 먼저')} 쓰기 시작한 수로 여겨져요", 42).move_to([0, -1.7, 0])
        note = M("(띠의 간격은 실제 시간과 달라요)", 28, SOFT).next_to(tl, UP, buff=0.5)
        self.say(f"자연수는 {o('가장 먼저')} 쓴 수", "그래서 세는 수, 자연수는 사람들이 가장 먼저 쓰기 시작한 수로 여겨져요.")
        self.play(FadeIn(t), FadeIn(note), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
