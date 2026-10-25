"""「과학 원리 돋보기」 3학년 36화 — 감염병은 왜 위험할까? (3-2 4단원 감염병과 건강한 생활 3차시, 화 코드 3-2-4-b)

바탕: grade3/science/sem2/u4-2.html — 도입(예방 접종의 좋은 점 고르기), 경험 나누기(붙임쪽지 예시 5개),
감염병이 크게 유행하면(마을 6곳: 병원·도서관·가게·카페·행사장·공항·우리 집의 평소/유행 때, '코로나19처럼 아주 크게 유행했을 때의
모습이에요. 모든 감염병이 이렇게 되지는 않아요'), 세계적으로 유행했던 감염병(코로나19·결핵), 안전한 사회를 위한 노력 고르기,
'감염병에 걸린 것은 누구의 잘못도 아니에요', 정리(위험한 까닭 4가지), 형성 평가.
최종: ./make_final.sh s3ep36
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, Circumscribe,
                   Arrow, Transform, Circle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag, person, place
import kit_s3u24 as K
from kit_s3u12 import text_card, ox_mark


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


PL = [("hosp", "아픈 사람이 많지 않아요", "아픈 사람이 많아 병원이 붐벼요"),
      ("lib", "책을 빌리러 사람들이 와요", "공공시설이 문을 닫아요"),
      ("shop", "손님이 북적여요", "손님이 줄어 문을 닫기도 해요"),
      ("fest", "운동회와 축제가 열려요", "여러 행사가 취소돼요"),
      ("air", "여행 가는 사람이 많아요", "여행을 가지 못해 공항이 한산해요"),
      ("home", "학교에 가고 친구를 만나요", "아프면 격리되어 집에만 있어요")]


class S3Ep36(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 36
    EP_TITLE = "감염병은 왜 위험할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experience()
        self.town()
        self.world()
        self.society()
        self.summary()
        self.closing(f"감염병은 {r('생명을 위협하고')} {o('다른 사람에게 옮을 수 있어요')}\n"
                     f"그래서 감염병을 {g('예방하는 것')}이 중요해요",
                     next_preview="3학년 37화 · 감염병에는 어떻게 걸릴까?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sy = K.syringe(1.9).move_to([-4.4, 0.6, 0])
        self.say("예방 접종을 해 본 적이 있나요?", "여러분은 예방 접종을 해 본 적이 있나요?")
        self.play(FadeIn(sy, scale=0.8), run_time=0.5)
        items = [("감염병에 걸려 아픈 사람이 줄어들어요", True), ("감염병이 다른 사람에게 옮는 일이 줄어들어요", True),
                 ("키가 커져요", False), ("공부를 잘하게 돼요", False)]
        cards = K.choice_grid(items, cols=1, size=30, w=7.6, h=0.7, dy=0.88, top=2.0, cx=2.4)
        self.say("많은 사람이 예방 접종을 하면 좋은 점은?", "많은 사람이 예방 접종을 하면 어떤 점이 좋을까요?")
        self.play(LaggedStart(*[FadeIn(c, shift=LEFT * 0.2) for c in cards], lag_ratio=0.12), run_time=1.0)
        self.pause_screen(4, "좋은 점을 모두 골라요")
        self.say(f"아픈 사람이 줄고, {g('옮는 일도 줄어요')}",
                 "예방 접종을 하면 아픈 사람이 줄고, 다른 사람에게 옮는 일도 줄어요.")
        self.play(*K.reveal_marks(cards), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 경험 나누기 ──
    def experience(self):
        self.section("경험 나누기")
        seeds = ["열이 나서 학교에 못 갔어요", "친구를 만나지 못해 심심했어요", "가족에게 옮을까 봐 걱정됐어요",
                 "집에만 있어서 답답했어요", "목이 아파 밥을 못 먹었어요"]
        cols = ["#FFE066", "#B2F2BB", "#A5D8FF", "#FFD8A8", "#EEBEFA"]
        pos = [(-4.0, 1.7), (0.3, 1.9), (4.3, 1.6), (-2.0, -0.1), (2.4, -0.2)]
        notes = VGroup(*[K.sticky(t, c, 28, 4.0).rotate((i % 5 - 2) * 0.03).move_to([x, y, 0])
                         for i, (t, c, (x, y)) in enumerate(zip(seeds, cols, pos))])
        self.say("감염병에 걸렸을 때 불편했던 경험을 나눠요",
                 "감염병에 걸렸을 때 불편했던 경험을 붙임쪽지에 써서 나눠 봐요.")
        self.play(LaggedStart(*[FadeIn(n, shift=DOWN * 0.2) for n in notes], lag_ratio=0.25), run_time=1.8)
        self.say(f"몸도 아프고 {o('생활도 불편해져요')}",
                 "열이 나서 학교에 못 가고, 친구를 못 만나고, 가족에게 옮을까 봐 걱정했어요. 감염병에 걸리면 몸도 아프고 생활도 불편해져요.")
        self.settle()
        clear_stage(self)

    # ── 크게 유행하면 ──
    def town(self):
        self.section("크게 유행하면")
        xs = [-4.5, 0.0, 4.5]
        cards, caps, cards2, caps2 = VGroup(), VGroup(), VGroup(), VGroup()
        for i, (k, a, b) in enumerate(PL):
            x, y = xs[i % 3], (1.5 if i < 3 else -0.72)
            c = K.place_card(k, False, 2.3, 1.75).move_to([x, y, 0])
            c2 = K.place_card(k, True, 2.3, 1.75).move_to([x, y, 0])
            t = T(a, 25, INK).move_to([x, y - 1.13, 0])
            t2 = T(b, 25, RED).move_to([x, y - 1.13, 0])
            for tt in (t, t2):
                if tt.width > 4.0:
                    tt.scale_to_fit_width(4.0)
            cards.add(c); caps.add(t); cards2.add(c2); caps2.add(t2)
        self.say("평소 우리 마을의 모습이에요", "평소 우리 마을의 모습이에요. 여섯 곳을 살펴봐요.")
        self.play(LaggedStart(*[FadeIn(VGroup(c, t), scale=0.9) for c, t in zip(cards, caps)], lag_ratio=0.12),
                  run_time=1.6)
        self.say("학교에 가고, 축제가 열리고, 여행도 가요",
                 "병원은 붐비지 않고, 가게에는 손님이 북적여요. 운동회와 축제가 열리고, 여행 가는 사람도 많아요.")
        self.settle()
        self.say(f"감염병이 {r('크게 유행하면')} 어떻게 될까요?", "그런데 감염병이 크게 유행하면 어떤 일이 일어날까요?")
        self.pause_screen(5, "마을에 어떤 일이 생길까요?")
        self.play(*[Transform(a, b) for a, b in zip(cards, cards2)], *[Transform(a, b) for a, b in zip(caps, caps2)],
                  run_time=1.0)
        self.say(f"병원이 붐비고, {r('행사가 취소되고')}, 가게가 문을 닫아요",
                 "아픈 사람이 많아 병원이 붐벼요. 도서관 같은 공공시설이 문을 닫고, 손님이 줄어 가게가 문을 닫기도 해요. 여러 행사도 취소돼요.")
        self.play(LaggedStart(*[Indicate(caps[i], color=RED, scale_factor=1.08) for i in range(4)], lag_ratio=0.3),
                  run_time=1.6)
        self.say(f"여행을 못 가고, 아프면 {r('격리')}되어 집에만 있어요",
                 "여행을 가지 못해 공항이 한산해지고, 아프면 격리되어 집에만 있어야 해요.")
        self.play(LaggedStart(*[Indicate(caps[i], color=RED, scale_factor=1.08) for i in (4, 5)], lag_ratio=0.3),
                  run_time=1.0)
        self.settle()
        self.play(FadeOut(VGroup(cards, caps)), run_time=0.4)
        card = text_card([f"감염병이 크게 유행하면 아픈 것뿐 아니라", f"{r('생활 전체')}가 불편해져요",
                          "(코로나19처럼 아주 크게 유행했을 때의 모습이에요.", " 모든 감염병이 이렇게 되지는 않아요.)"], size=36)
        card.move_to([0, 0.5, 0])
        self.say(f"아픈 것뿐 아니라 {r('생활 전체')}가 불편해져요",
                 "감염병이 크게 유행하면 아픈 것뿐 아니라 생활 전체가 불편해져요. 이것은 코로나19처럼 아주 크게 유행했을 때의 모습이고, 모든 감염병이 이렇게 되지는 않아요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 세계적 유행 ──
    def world(self):
        self.section("세계적 유행")
        globe = VGroup(Circle(radius=0.75, fill_color="#5DA9E0", fill_opacity=1, stroke_color=INK, stroke_width=4),
                       K.E(0.5, 0.35, "#7CBF5E", -0.2, 0.25, sw=3), K.E(0.4, 0.5, "#7CBF5E", 0.3, -0.25, sw=3))
        c1 = VGroup(globe, K.germ("ball", K.GERM_G, 0.45).move_to([0.6, 0.55, 0]))
        c1.move_to([-5.0, 1.2, 0])
        t1 = text_card([f"{o('코로나19')}", "2019년 말에 처음 알려진 뒤", "두 달 만에 전 세계로 퍼졌어요",
                        "학교와 가게가 문을 닫기도 했어요"], size=30).move_to([-1.0, 1.0, 0])
        c2 = K.germ("rod", K.GERM_P, 0.75).move_to([2.6, -1.35, 0])
        t2 = text_card([f"{o('결핵')}", "아주 오래전부터 전 세계 사람들의", "건강을 위협해 온 감염병",
                        "아기 때 예방 접종(BCG)을 꼭 해요"], size=30).move_to([3.4, 0.9, 0])
        t1.move_to([-3.45, -0.15, 0]); c1.next_to(t1, UP, buff=0.2)
        t2.move_to([3.45, -0.15, 0]); c2.next_to(t2, UP, buff=0.35)
        self.say("세계적으로 유행했던 감염병도 있어요", "세계적으로 크게 유행했던 감염병도 있어요.")
        self.play(FadeIn(c1, scale=0.8), FadeIn(t1, shift=UP * 0.2), run_time=0.7)
        self.say(f"코로나19는 {o('두 달 만에')} 전 세계로 퍼졌어요",
                 "코로나19는 2019년 말에 처음 알려진 뒤 두 달 만에 전 세계로 퍼졌어요. 많은 사람이 아팠고, 학교와 가게가 문을 닫기도 했어요.")
        self.play(FadeIn(c2, scale=0.8), FadeIn(t2, shift=UP * 0.2), run_time=0.7)
        self.say(f"결핵은 오래전부터 건강을 위협해 왔어요",
                 "결핵은 아주 오래전부터 전 세계 사람들의 건강을 위협해 온 감염병이에요. 우리나라는 아기 때 예방 접종을 꼭 해요.")
        self.settle()
        clear_stage(self)

    # ── 우리 사회의 노력 ──
    def society(self):
        self.section("우리 사회의 노력")
        items = [("필요한 예방 접종을 해요", True), ("감염병이 유행하는지 계속 살펴요", True),
                 ("아프면 쉬고, 다른 사람에게 옮기지 않도록 조심해요", True),
                 ("아픈 친구를 놀려요", False), ("아파도 숨기고 참아요", False)]
        cards = K.choice_grid(items, cols=1, size=30, w=9.6, h=0.66, dy=0.82, top=2.15)
        self.say("감염병으로부터 안전한 사회를 만들려면?", "감염병으로부터 안전한 사회를 만들려면 어떻게 해야 할까요?")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in cards], lag_ratio=0.12), run_time=1.1)
        self.pause_screen(4, "알맞은 노력을 골라요")
        self.say(f"예방 접종 · 살피기 · {g('아프면 쉬기')}",
                 "필요한 예방 접종을 하고, 감염병이 유행하는지 계속 살피고, 아프면 쉬면서 다른 사람에게 옮기지 않도록 조심해요.")
        self.play(*K.reveal_marks(cards), run_time=0.8)
        self.settle()
        self.play(FadeOut(cards), *[FadeOut(c.mark) for c in cards], run_time=0.4)
        msg = text_card([f"감염병에 걸린 것은 {g('누구의 잘못도 아니에요')}",
                         "아픈 친구를 탓하지 않고 따뜻하게 대해 주어요"], size=40).move_to([0, 0.5, 0])
        self.say(f"감염병에 걸린 것은 {g('누구의 잘못도 아니에요')}",
                 "감염병에 걸린 것은 누구의 잘못도 아니에요. 아픈 친구를 탓하지 않고 따뜻하게 대해 주는 것이 중요해요.")
        self.play(FadeIn(msg, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리")
        self.say("감염병은 왜 위험할까요?", "정리해요. 감염병은 왜 위험할까요?")
        items = [("몸이 아프고 생명이 위험할 수도 있어요", True), ("다른 사람에게 병을 옮길 수 있어요", True),
                 ("일상생활이 불편해져요", True), ("세계적으로 유행할 수도 있어요", True), ("키가 작아져요", False)]
        cards = K.choice_grid(items, cols=1, size=30, w=7.8, h=0.66, dy=0.8, top=2.2, cx=1.9)
        # 왼쪽: 한 사람에게서 다른 사람에게 옮는 그림
        p0 = person(1.3, "#E57F3C"); place(p0, -5.2, 0.4)
        ps = VGroup(*[place(person(1.0, BLUE), x, y) for x, y in [(-6.2, -1.6), (-4.2, -1.6), (-5.2, -1.8)]])
        arrows = VGroup(*[Arrow(p0.get_bottom() + DOWN * 0.05, q.get_top() + UP * 0.05, buff=0.05, color=RED,
                                stroke_width=5, tip_length=0.18) for q in ps])
        gm = K.germ("ball", K.GERM_G, 0.3).move_to(p0.get_top() + UP * 0.3 + RIGHT * 0.4)
        self.play(LaggedStart(*[FadeIn(c, shift=LEFT * 0.2) for c in cards], lag_ratio=0.12), FadeIn(p0), FadeIn(gm),
                  run_time=1.2)
        self.say(f"생명이 위험하고, {r('다른 사람에게 옮을 수 있어요')}",
                 "감염병에 걸리면 몸이 아프고 생명이 위험할 수도 있어요. 또 다른 사람에게 병을 옮길 수 있어요.")
        self.play(*[FadeIn(c.mark, scale=0.6) for c in cards[:2]], *[c.box.animate.set_stroke(GREEN, 6) for c in cards[:2]],
                  LaggedStart(*[Create(a) for a in arrows], lag_ratio=0.3), FadeIn(ps, lag_ratio=0.3), run_time=1.2)
        self.say(f"생활이 불편해지고, {r('세계적으로 유행')}할 수도 있어요",
                 "일상생활이 불편해지고, 세계적으로 유행할 수도 있어요. 키가 작아지는 것과는 관계가 없어요.")
        self.play(*K.reveal_marks(cards[2:]), run_time=0.8)
        self.settle()
        self.play(Circumscribe(VGroup(*cards[:4]), color=GREEN), run_time=1.0)
        clear_stage(self)
