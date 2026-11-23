"""「수학 원리 돋보기」 자연수 이야기 1화 — 자연수란 무엇일까?

- 자연수: 물건을 셀 때 쓰는 수 1, 2, 3, … / 1부터 하나씩 더해 가며 얻는 수 (표준국어대사전 뜻풀이 — 2차 인용으로 확인)
- 우리 초등 교과서에서 자연수는 1부터(0은 넣지 않음), 낱말은 3~4학년군에서 배움(2022 개정 교육과정 용어 목록)
- 세기의 다섯 원리: Gelman, R. & Gallistel, C. R. (1978) 『The Child's Understanding of Number』
  하나에 하나 · 늘 같은 차례 · 마지막 수가 전체 개수 · 무엇이든 셀 수 있음 · 어디부터 세어도 같음
최종: GRADE=n ./make_final.sh 1
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, Square, Star, Triangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fracbasic import step_card
from prepkit import PINK, RED, items
from storykit import show_sources


class NatScene(EpisodeScene):
    GRADE, SEM = "N", 1
    LABEL = "자연수 이야기 {}화"


class GnEp01(NatScene):
    EP_NO = 1
    EP_TITLE = "자연수란 무엇일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.count()
        self.meaning()
        self.rules()
        self.practice()
        show_sources(self, [
            "· 자연수의 뜻: 표준국어대사전 '자연수', 2022 개정 수학과 교육과정(교육부 고시 제2022-33호)",
            "· 세기의 다섯 원리: Gelman, R. · Gallistel, C. R. (1978),",
            "   『The Child's Understanding of Number』, Harvard University Press",
        ])
        self.closing(f"물건을 셀 때 쓰는 수 {g('1, 2, 3, …')} 이 {o('자연수')}\n1부터 시작해서 {b('1씩')} 커져요",
                     next_preview="자연수 이야기 2화 · 사람들은 언제부터 수를 세었을까?")
        self.wait(0.5)

    def count(self):
        self.section("세어 볼까요?")
        its = items(5, color=RED, y=0.9, step=1.0, r=0.32)
        self.say("구슬이 몇 개일까요?", "구슬이 몇 개 있을까요? 하나씩 세어 볼까요?")
        self.play(FadeIn(its, lag_ratio=0.2), run_time=0.8)
        nums = VGroup()
        for i, m in enumerate(its):
            t = T(str(i + 1), 56, BLUE).next_to(m, DOWN, buff=0.35)
            nums.add(t)
            self.play(Indicate(m, scale_factor=1.3), FadeIn(t, scale=1.4), run_time=0.5)
        self.say(f"하나, 둘, 셋, 넷, 다섯 → {g('5개')}", "하나, 둘, 셋, 넷, 다섯. 구슬은 5개예요.")
        self.wait(0.8)
        t = M(f"물건을 셀 때 쓰는 수 {b('1, 2, 3, 4, 5, …')}", 48).move_to([0, -1.3, 0])
        n = M(f"이런 수를 {o('자연수')}라고 해요", 54).move_to([0, -2.2, 0])
        self.say(f"세는 수 = {o('자연수')}", "이렇게 물건을 셀 때 쓰는 수 1, 2, 3, 4, 5를 자연수라고 해요.")
        self.play(FadeIn(t), run_time=0.5)
        self.play(Write(n), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def meaning(self):
        self.section("자연수의 뜻")
        steps = VGroup()
        x0 = -5.4
        for i in range(6):
            c = T(str(i + 1), 72, BLUE).move_to([x0 + i * 2.0, 0.9, 0])
            steps.add(c)
        arrows = VGroup(*[M(f"{o('+1')}", 34).move_to([x0 + i * 2.0 + 1.0, 1.6, 0]) for i in range(5)])
        self.say(f"{b('1')}부터 시작해서 하나씩 더해요", "자연수는 1부터 시작해요. 그리고 1씩 더해 가면 다음 자연수가 나와요.")
        self.play(FadeIn(steps[0], scale=1.4), run_time=0.5)
        for i in range(5):
            self.play(FadeIn(arrows[i]), FadeIn(steps[i + 1], shift=RIGHT * 0.3), run_time=0.45)
        dots = T("…", 72, BLUE).next_to(steps[-1], RIGHT, buff=0.4)
        self.play(FadeIn(dots), run_time=0.4)
        d = M(f"자연수: {b('1부터')} 시작하여 {o('하나씩 더하여')} 얻는 수", 44).move_to([0, -0.6, 0])
        self.say("사전의 뜻: 1부터 하나씩 더하여 얻는 수", "국어사전에서는 자연수를 1부터 시작하여 하나씩 더하여 얻는 수라고 풀이해요.")
        self.play(FadeIn(d), run_time=0.6)
        z = M(f"우리 교과서에서는 {g('0')}은 자연수에 넣지 않아요", 40, SOFT).move_to([0, -1.6, 0])
        self.say("0은 자연수에 넣지 않아요", "그래서 우리 교과서에서 자연수는 1부터예요. 0은 자연수에 넣지 않아요. 그 까닭은 3화에서 알아봐요.")
        self.play(FadeIn(z), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def rule(self, n, title, sub, narr, build):
        c = step_card(n, title, size=42, label=f"약속 {n}").move_to([0, 2.45, 0])
        self.say(sub, narr)
        self.play(FadeIn(c), run_time=0.4)
        objs = build()
        self.wait(1.0)
        self.settle()
        self.play(FadeOut(c), FadeOut(objs), run_time=0.4)

    def rules(self):
        self.section("바르게 세는 다섯 가지 약속")
        intro = M("아이들이 수를 셀 때 지키는 약속을 연구한 학자들이 있어요", 40).move_to([0, 0.8, 0])
        who = M("(겔만과 갈리스텔, 1978년 책)", 34, SOFT).move_to([0, 0.0, 0])
        self.say("세는 데에도 약속이 있어요", "미국의 심리학자 겔만과 갈리스텔은 1978년 책에서, 아이들이 수를 바르게 셀 때 지키는 다섯 가지 약속을 정리했어요.")
        self.play(FadeIn(intro), FadeIn(who), run_time=0.6)
        self.wait(0.8)
        self.settle()
        self.play(FadeOut(intro), FadeOut(who), run_time=0.4)

        def r1():
            its = items(4, color=RED, y=0.4, step=1.1, r=0.3)
            self.play(FadeIn(its), run_time=0.4)
            nums = VGroup()
            for i, m in enumerate(its):
                t = T(str(i + 1), 50, BLUE).next_to(m, DOWN, buff=0.3)
                nums.add(t)
                self.play(FadeIn(t), Indicate(m, scale_factor=1.25), run_time=0.4)
            return VGroup(its, nums)
        self.rule(1, f"물건 {o('하나')}에 수 {o('하나')}씩", "① 하나에 하나씩", "첫째, 물건 하나에 수를 하나씩 짝지어 세요. 빠뜨리거나 두 번 세면 안 돼요.", r1)

        def r2():
            t = M(f"{b('하나, 둘, 셋, 넷, 다섯')} …  (언제나 같은 차례)", 52).move_to([0, 0.4, 0])
            self.play(FadeIn(t), run_time=0.6)
            return t
        self.rule(2, "수는 언제나 같은 차례로 말해요", "② 늘 같은 차례로", "둘째, 수는 언제나 하나, 둘, 셋 같은 차례로 말해요. 하나, 셋, 둘처럼 바꾸면 안 돼요.", r2)

        def r3():
            its = items(4, color=RED, y=0.6, step=1.1, r=0.3)
            nums = VGroup(*[T(str(i + 1), 50, BLUE).next_to(m, DOWN, buff=0.3) for i, m in enumerate(its)])
            self.play(FadeIn(its), FadeIn(nums), run_time=0.4)
            self.play(Indicate(nums[-1], color=GREEN, scale_factor=1.6), run_time=0.7)
            t = M(f"마지막 수 {g('4')} = 모두 {g('4개')}", 50).move_to([0, -1.2, 0])
            self.play(FadeIn(t), run_time=0.5)
            return VGroup(its, nums, t)
        self.rule(3, f"{g('마지막')}에 말한 수가 전체 개수예요", "③ 마지막 수 = 전체 개수", "셋째, 마지막에 말한 수가 모두 몇 개인지를 알려 줘요. 넷까지 셌으면 모두 4개예요.", r3)

        def r4():
            shapes = VGroup(Star(color=ORANGE, fill_opacity=1).scale(0.4), Square(0.7, color=BLUE, fill_opacity=1),
                            Triangle(color=GREEN, fill_opacity=1).scale(0.45), items(1, color=PINK, r=0.3)[0],
                            T("소리", 40, INK)).arrange(RIGHT, buff=0.8).move_to([0, 0.5, 0])
            nums = VGroup(*[T(str(i + 1), 46, BLUE).next_to(s, DOWN, buff=0.35) for i, s in enumerate(shapes)])
            self.play(FadeIn(shapes, lag_ratio=0.2), run_time=0.8)
            self.play(FadeIn(nums, lag_ratio=0.3), run_time=1.0)
            return VGroup(shapes, nums)
        self.rule(4, "무엇이든 셀 수 있어요", "④ 무엇이든 셀 수 있어요", "넷째, 모양이 달라도, 소리나 박수처럼 눈에 보이지 않아도 무엇이든 셀 수 있어요.", r4)

        def r5():
            its = items(4, color=RED, y=0.6, step=1.1, r=0.3)
            self.play(FadeIn(its), run_time=0.3)
            order = [3, 1, 0, 2]
            nums = VGroup()
            for k, i in enumerate(order):
                t = T(str(k + 1), 50, ORANGE).next_to(its[i], DOWN, buff=0.3)
                nums.add(t)
                self.play(FadeIn(t), Indicate(its[i], scale_factor=1.25), run_time=0.4)
            t = M(f"어디부터 세어도 모두 {g('4개')}", 48).move_to([0, -1.2, 0])
            self.play(FadeIn(t), run_time=0.5)
            return VGroup(its, nums, t)
        self.rule(5, "어디부터 세어도 개수는 같아요", "⑤ 어디부터 세어도 같아요", "다섯째, 오른쪽부터 세든, 가운데부터 세든 빠짐없이 세면 개수는 언제나 같아요.", r5)
        clear_stage(self, 0.4)

    def practice(self):
        self.section("연습해요")
        pts = [(-4.6, 1.4), (-2.6, 0.4), (-0.6, 1.6), (1.2, 0.3), (3.0, 1.5), (4.8, 0.5), (-5.0, -0.4)]
        its = VGroup(*[items(1, color=RED if k % 2 else ORANGE, r=0.3)[0].move_to([x, y, 0]) for k, (x, y) in enumerate(pts)])
        self.say("흩어진 구슬은 모두 몇 개일까요?", "연습해 볼까요? 흩어져 있는 구슬은 모두 몇 개일까요? 다섯 가지 약속을 지키며 세어 보세요.")
        self.play(FadeIn(its, lag_ratio=0.15), run_time=0.9)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        for i, m in enumerate(its):
            t = T(str(i + 1), 40, BLUE).next_to(m, DOWN, buff=0.2)
            self.play(FadeIn(t), Indicate(m, scale_factor=1.25), run_time=0.35)
        a = M(f"마지막 수 {g('7')} → 모두 {g('7개')}", 52).move_to([0.8, -1.5, 0])
        self.say(f"모두 {g('7개')}", "하나씩 짝지어 세면 마지막 수가 7. 모두 7개예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
