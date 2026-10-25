"""「과학 원리 돋보기」 5학년 7화 — 물체를 보려면 무엇이 필요할까? (5-1 2단원 빛의 성질 2~3차시, 화 코드 5-1-2-a)

바탕: grade5/science/sem1/u2-1.html(원본 _build_tb/src/u2-1.html) — 도입(밤바다에서 등대가 필요한 까닭: 등대 빛이 어두운
바다를 밝혀 배가 바위를 피하고 육지의 위치를 앎), 실험해요(어둠상자: ① 물체 넣고 뚜껑 닫기 ② 손전등으로 구멍 막기 ③ 관찰 구멍으로
보기 — 잘 보이지 않음 ④ 손전등 켜고 보기 — 물체가 보임, 안전: 손전등 빛을 사람 눈에 비추지 않기·어둠상자 움직이지 않기,
물체를 넣는 친구는 다른 친구가 보지 못하게), 정리해요(물체를 비추는 빛, 가로등, 낮에는 햇빛·밤에는 전등, 빛이 전혀 없으면 오래
기다려도 보이지 않음), 준비해요(빛이 없으면 불편한 일 — 소리·냄새는 빛이 없어도), 한눈에 쏙(물체를 비추는 빛 · 전등을 꺼도
보이는 까닭: 빛을 내는 물체·방 밖에서 들어오는 빛).
('물체가 반사한 빛이 눈에 들어온다'는 다음 차시 u2-3에서 배우므로 이 편에서는 말하지 않음)
최종: ./make_final.sh s5ep07
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Polygon,
                   Rectangle, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep07(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 7
    EP_TITLE = "물체를 보려면 무엇이 필요할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.dark_box_lab()
        self.need_light()
        self.no_light()
        self.summary()
        self.closing(f"물체를 보려면 물체를 비추는 {g('빛')}이 있어야 해요",
                     next_preview="5학년 8화 · 빛은 어떻게 나아갈까?")
        self.wait(0.5)

    # ── 궁금해요: 밤바다의 등대 ──
    def sea_scene(self, on):
        pn = K.panel(12.4, 4.6, K.NIGHT2, 0, 0.45)
        sea = Rectangle(width=12.3, height=1.9, fill_color=K.SEA_N, fill_opacity=1, stroke_width=0).move_to([0, -0.85, 0])
        st = K.stars((-5.8, 5.8, 1.4, 2.5), n=10, seed=2)
        land = Polygon([3.6, -1.8, 0], [4.2, 0.0, 0], [5.4, 0.25, 0], [6.15, 0.05, 0], [6.15, -1.8, 0],
                       fill_color="#2C2620", fill_opacity=1, stroke_width=0)
        lh = K.lighthouse(on, 0.9).move_to([4.65, 1.05, 0], aligned_edge=DOWN).shift(DOWN * 0.95)
        op = 1.0 if on else 0.08
        sh = K.ship(1.0, op).move_to([-3.6, -0.3, 0])
        rk = K.rocks(1.0, op).move_to([-0.6, -0.95, 0])
        grp = VGroup(pn, sea, st, land)
        if on:
            c = lh.lamp.get_center()
            beam = Polygon(c, [-6.1, 0.9, 0], [-6.1, -1.75, 0], fill_color=K.GLOW, fill_opacity=0.28, stroke_width=0)
            grp.add(beam)
        grp.add(sh, rk, lh)
        return grp

    def intro(self):
        self.section("궁금해요")
        dark = self.sea_scene(False)
        self.say("등대 불이 꺼진 밤바다예요. 바다에 무엇이 있을까요?",
                 "등대 불이 꺼진 밤바다예요. 무엇이 있을까요?")
        self.play(FadeIn(dark), run_time=0.8)
        self.say(f"밤바다에서 {o('등대')}가 필요한 까닭은 무엇일까요?",
                 "밤바다에서 등대가 필요한 까닭은 무엇일까요?")
        self.settle()
        self.pause_screen(5, "등대가 필요한 까닭은 무엇일까요?")
        lit = self.sea_scene(True)
        self.play(Transform(dark, lit), run_time=1.0)
        self.say(f"등대 빛이 비추자 {o('배')}와 {o('바위')}가 보여요",
                 "등대 불을 켰어요. 등대 빛이 비추자 배와 바위가 보여요.")
        self.settle()
        self.say(f"등대 빛이 어두운 바다를 {g('밝혀')} 배가 바위를 피해요",
                 "등대에서 나오는 빛이 어두운 바다를 밝혀 주어, 배가 바위를 피하고 육지의 위치를 알 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요: 어둠상자 ──
    def dark_box_lab(self):
        self.section("실험해요")
        box = K.dark_box(lid=False).scale(1.05).move_to([-3.4, 0.0, 0])
        steps = K.text_card(["① 물체 넣고 뚜껑 닫기", "② 손전등으로 구멍 막기", "③ 관찰 구멍으로 보기", "④ 손전등 켜고 보기"],
                            w=4.4, size=28).move_to([4.2, 1.4, 0])
        self.say(f"{o('어둠상자')} 속의 물체를 관찰해요",
                 "어둠상자 속의 물체를 관찰해 볼게요.")
        self.play(FadeIn(box), FadeIn(steps[0]), run_time=0.6)
        for t in steps[1]:
            self.play(FadeIn(t, shift=RIGHT * 0.2), run_time=0.3)
        self.settle()
        # ① 물체 넣기
        pg = K.penguin(0.7).move_to([-3.6, 2.6, 0])
        self.play(Indicate(steps[1][0], color=ORANGE), FadeIn(pg, shift=DOWN * 0.3), run_time=0.6)
        self.play(pg.animate.move_to([-3.6, 0.3, 0]).scale(0.5), run_time=0.7)
        self.remove(pg)
        box2 = K.dark_box(lid=True).scale(1.05).move_to(box)
        self.play(Transform(box, box2), run_time=0.5)
        self.say("친구가 몰래 물체를 넣고 뚜껑을 닫아요",
                 "친구가 몰래 물체를 넣고 뚜껑을 닫아요. 물체를 넣는 친구는 다른 친구가 물체를 보지 못하게 해요.")
        self.settle()
        # ② 손전등으로 구멍 막기
        fl = K.flashlight(False, 1.0).rotate(-PI / 2)
        hole = box2.top_hole.get_center()
        fl.move_to(hole + UP * (fl.height / 2 - 0.05))
        self.play(Indicate(steps[1][1], color=ORANGE), FadeIn(fl, shift=DOWN * 0.3), run_time=0.6)
        self.say(f"손전등으로 위 구멍을 막아요. 아직 {o('켜지 않아요')}",
                 "손전등으로 뚜껑의 구멍을 빈틈없이 막아요. 아직 손전등은 켜지 않아요.")
        self.settle()
        safe = K.safety_note("손전등의 빛을 사람의 눈에 비추지 않아요. 관찰할 때는 어둠상자를 움직이지 않아요.",
                             w=12.6, size=26).move_to([0, -2.15, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.say("손전등의 빛을 사람의 눈에 비추지 않아요",
                 "손전등의 빛을 사람의 눈에 비추지 않아요. 관찰할 때는 어둠상자를 움직이지 않아요.")
        self.settle()
        self.play(FadeOut(safe), run_time=0.3)
        # ③ 관찰 구멍으로 보기
        view = K.peep_view(False, 1.05).move_to([4.7, -1.2, 0])
        cap = T("관찰 구멍으로 본 모습", 24, SOFT).next_to(view, LEFT, buff=0.3)
        arr = Arrow(box2.peep.get_center() + RIGHT * 0.2, view.get_left() + LEFT * 0.05, buff=0.05, color=SOFT,
                    stroke_width=4, max_tip_length_to_length_ratio=0.12)
        self.play(Indicate(steps[1][2], color=ORANGE), Create(arr), run_time=0.6)
        self.play(FadeIn(view, scale=0.8), run_time=0.5)
        self.say(f"손전등을 켜기 전에는 물체가 {r('잘 보이지 않아요')}",
                 "관찰 구멍으로 보았어요. 손전등을 켜기 전에는 안이 깜깜해서 물체가 무엇인지 잘 보이지 않아요.")
        self.settle()
        self.pause_screen(5, "손전등을 켜면 어떻게 될까요?")
        # ④ 손전등 켜기
        fl2 = K.flashlight(True, 1.0).rotate(-PI / 2).move_to(fl)
        top = hole + DOWN * 0.05
        beam = Polygon(top + LEFT * 0.22, top + RIGHT * 0.22, [hole[0] + 1.0, -1.15, 0], [hole[0] - 1.0, -1.15, 0],
                       fill_color=K.GLOW, fill_opacity=0.45, stroke_width=0)
        lit = K.peep_view(True, 1.05, K.penguin()).move_to(view)
        self.play(Indicate(steps[1][3], color=ORANGE), Transform(fl, fl2), run_time=0.5)
        self.play(FadeIn(beam), run_time=0.5)
        self.play(Transform(view, lit), run_time=0.6)
        self.say(f"손전등을 켜니 {o('펭귄 인형')}이 잘 보여요!",
                 "손전등을 켜니 어둠상자 안이 밝아져서 물체가 잘 보여요. 펭귄 인형이었어요!")
        self.settle()
        clear_stage(self)

    # ── 정리해요: 물체를 비추는 빛 ──
    def need_light(self):
        self.section("정리해요")
        opts = ["물체를 비추는 빛", "더 큰 관찰 구멍", "조용한 교실", "밝은 색의 물체"]
        cards = VGroup(*[K.text_card([t], w=4.6, size=34) for t in opts]).arrange_in_grid(2, 2, buff=(0.4, 0.35)).move_to([0, 0.9, 0])
        self.say("어둠상자 속의 물체를 보려면 무엇이 필요했나요?",
                 "어둠상자 속의 물체를 보려면 무엇이 필요했나요?")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.8)
        self.settle()
        self.play(cards[0][0].animate.set_stroke(GREEN, 7), cards[0][1].animate.set_color(GREEN),
                  *[c.animate.set_opacity(0.35) for c in cards[1:]], run_time=0.6)
        self.say(f"물체를 보려면 {g('물체를 비추는 빛')}이 있어야 해요",
                 "맞아요. 손전등을 켜기 전에는 보이지 않았어요. 물체를 보려면 물체를 비추는 빛이 있어야 해요.")
        self.settle()
        clear_stage(self)
        # 가로등
        def street(on):
            pn = K.panel(12.4, 4.4, "#1C2740" if on else "#05070C", 0, 0.55)
            road = Rectangle(width=12.3, height=1.2, fill_color="#3A3F47" if on else "#0A0B0D", fill_opacity=1,
                             stroke_width=0).move_to([0, -1.05, 0])
            lamp = K.street_lamp(on, 2.6).move_to([-3.2, -0.45, 0], aligned_edge=DOWN)
            op = 1.0 if on else 0.07
            hs = K.house(1.2, True).move_to([1.6, -0.45, 0], aligned_edge=DOWN).set_opacity(op)
            car = K.car_night(0.9, "#2F7FD0").move_to([-1.8, -0.55, 0], aligned_edge=DOWN).set_opacity(op)
            man = K.walker(1.3).move_to([4.2, -0.6, 0], aligned_edge=DOWN)
            grp = VGroup(pn, road)
            if on:
                b = lamp.bulb.get_center()
                grp.add(Polygon(b, [-5.4, -1.6, 0], [-0.6, -1.6, 0], fill_color=K.GLOW, fill_opacity=0.3, stroke_width=0))
            grp.add(lamp, hs, car, man)
            msg = T("길이 잘 보이네." if on else "어두워서 앞이 잘 보이지 않아.", 28, PAPER).move_to([3.9, 1.9, 0])
            grp.add(msg)
            return grp
        s_on = street(True)
        self.say("가로등이 켜져 있어서 길이 잘 보여요", "밤길이에요. 가로등이 켜져 있어서 길이 잘 보여요.")
        self.play(FadeIn(s_on), run_time=0.7)
        self.settle()
        self.play(Transform(s_on, street(False)), run_time=0.9)
        self.say(f"가로등을 끄면 {r('빛이 없어서')} 물체가 보이지 않아요",
                 "가로등을 껐어요. 빛이 없으면 자동차도 집도 보이지 않아요.")
        self.settle()
        self.play(Transform(s_on, street(True)), run_time=0.7)
        self.say(f"낮에는 {o('햇빛')}, 밤에는 {o('전등')}이 빛을 내요",
                 "낮에는 햇빛이 있어서, 밤에는 많은 전등이 빛을 내서 주변의 물체를 볼 수 있어요.")
        self.settle()
        clear_stage(self)
        # 생각 바로잡기
        self.section("생각 바로잡기")
        q = K.text_card(["빛이 전혀 없는 곳에서 오래 기다리면", f"물체가 {o('보이게 될까요')}?"], w=10.0, size=42).move_to([0, 1.2, 0])
        self.say("빛이 전혀 없는 곳에서 오래 기다리면 보일까요?",
                 "빛이 전혀 없는 곳에서 오래 기다리면 눈이 익숙해져서 물체가 보이게 될까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.settle()
        self.pause_screen(5, "오래 기다리면 보일까요?")
        a = K.text_card([f"{r('아니요!')} 빛이 전혀 없으면 오래 기다려도 보이지 않아요",
                         f"어두운 곳에서 조금씩 보이는 것은 {o('아주 적은 빛')}이라도 있기 때문이에요"],
                        w=12.6, size=32, stroke=GREEN).move_to([0, -0.9, 0])
        self.play(FadeIn(a), run_time=0.6)
        self.say(f"빛이 전혀 없으면 오래 기다려도 {r('보이지 않아요')}",
                 "아니에요. 어두운 곳에서 조금 보이는 것은 아주 적은 빛이라도 있기 때문이에요. 빛이 전혀 없다면 아무것도 보이지 않아요.")
        self.settle()
        clear_stage(self)

    # ── 빛이 없으면 불편한 일 ──
    def no_light(self):
        self.section("빛이 없다면?")
        items = [("길을 걷다가 돌에 걸려 넘어져요", True), ("문손잡이를 더듬어 찾아야 해요", True),
                 ("부르는 소리를 들을 수 없어요", False), ("세수를 하기 어려워요", True),
                 ("음식 냄새를 맡을 수 없어요", False), ("책을 읽을 수 없어요", True)]
        cards = VGroup(*[K.text_card([t], w=6.2, size=27) for t, _ in items]).arrange_in_grid(3, 2, buff=(0.35, 0.28)).move_to([0, 0.75, 0])
        for c in cards:
            c[1].shift(LEFT * 0.3)
        self.say("빛이 모두 사라진다면 무엇이 불편해질까요?",
                 "빛이 모두 사라진다면 어떤 일이 불편해질까요?")
        self.play(FadeIn(cards, lag_ratio=0.1), run_time=0.9)
        self.settle()
        marks = VGroup()
        for c, (_, ok) in zip(cards, items):
            mk = K.ox_mark(ok, 0.2).move_to(c.get_right() + LEFT * 0.36)
            marks.add(mk)
        self.play(*[c[0].animate.set_stroke(GREEN if ok else RED, 6) for c, (_, ok) in zip(cards, items)],
                  FadeIn(marks, lag_ratio=0.1), run_time=0.9)
        self.say(f"물체를 {r('볼 수 없어서')} 생활의 많은 일이 불편해져요",
                 "빛이 없으면 물체를 볼 수 없어서 걷기, 세수하기, 책 읽기처럼 생활의 많은 일이 불편해져요.")
        self.settle()
        self.say(f"하지만 {o('소리')}와 {o('냄새')}는 빛이 없어도 느낄 수 있어요",
                 "하지만 소리를 듣고 냄새를 맡는 것은 빛이 없어도 할 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"물체를 보기 위해서는 물체를 비추는 {g('빛')}이 있어야 합니다."], w=12.6, size=46).move_to([0, 1.7, 0])
        self.say(f"물체를 보기 위해서는 물체를 비추는 {g('빛')}이 있어야 해요",
                 "물체를 보기 위해서는 물체를 비추는 빛이 있어야 합니다.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        q = T("방 안의 전등을 꺼서 어두운데도 물체가 보이는 까닭은?", 34).move_to([0, 0.35, 0])
        a1 = K.text_card([f"방 안에 {o('빛을 내는 물체')}가 있어요"], w=6.0, size=30, stroke=GREEN)
        a2 = K.text_card([f"방 밖에서 {o('빛이 들어와요')}"], w=6.0, size=30, stroke=GREEN)
        VGroup(a1, a2).arrange(RIGHT, buff=0.4).move_to([0, -0.85, 0])
        self.say("전등을 꺼서 어두운데도 물체가 보이는 까닭은?",
                 "방 안의 전등을 꺼서 어두운데도 물체가 보일 때가 있어요. 그 까닭은 무엇일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.settle()
        self.play(FadeIn(a1, shift=UP * 0.2), FadeIn(a2, shift=UP * 0.2), run_time=0.6)
        self.say(f"빛을 내는 물체나 방 밖에서 들어오는 {g('빛')}이 있기 때문이에요",
                 "방 안에 빛을 내는 물체가 있거나, 방 밖에서 빛이 들어오기 때문이에요. 빛이 없어도 물체가 저절로 보이는 것은 아니에요.")
        self.settle()
        clear_stage(self)
