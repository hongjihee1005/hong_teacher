"""「과학 원리 돋보기」 5학년 32화 — 고체에서 열의 이동(전도) (5-2 3단원 열과 우리 생활 4차시, 화 코드 5-2-3-c)

바탕: grade5/science/sem2/u3-3.html(원본 _build_tb/src2/u3-3.html) — 도입(석쇠에 닿지 않은 고기 부위),
긴 구리판 한쪽 끝 가열(고온용 열 변색 붙임딱지, 가열한 끝에서 먼 쪽으로), ㄷ자 구리판(㉠→㉤, 끊어진 곳으로는 이동하지 않음),
전도 정의, 생각 바로잡기(종류가 다른 고체도 맞닿아 있으면 이동), 철판, 한눈에 쏙(전도), 국에 담근 금속 숟가락, 안전.
붙임딱지 색(보라 → 노랑)은 앱 그림의 색을 그대로 씀.
최종: ./make_final.sh s5ep32
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, GrowArrow,
                   ValueTracker, Circle, linear)

from series_style import GREEN, INK, ORANGE, SOFT, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep32(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 32
    EP_TITLE = "고체에서 열의 이동(전도)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.long_plate()
        self.u_plate()
        self.conduction()
        self.summary()
        self.closing(f"온도가 높은 부분에서 낮은 부분으로\n고체 물질을 따라 열이 이동하는 방식: {o('전도')}",
                     next_preview="5학년 33화 · 액체와 기체에서 열의 이동(대류)")
        self.wait(0.5)

    def heat(self, plate, to, run_time=4.0):
        vt = ValueTracker(-1)
        plate.add_updater(lambda m: m.set_front(vt.get_value()))
        self.play(vt.animate.set_value(to), run_time=run_time, rate_func=linear)
        plate.clear_updaters()

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        rack = VGroup(*[K.rect(5.0, 0.08, "#555555", 0, -0.35 - k * 0.0, stroke="#555555", sw=0) for k in range(1)])
        rack.add(*[K.rect(0.08, 0.3, "#555555", -2.4 + k * 0.6, -0.35, stroke="#555555", sw=0) for k in range(9)])
        meat = K.R(3.4, 0.9, "#C9644A", 0, 0.2, rad=0.3, stroke="#7A2E1F", sw=4)
        fire = VGroup(*[K.flame(0.9).move_to([x, -1.25, 0]) for x in (-1.6, 0, 1.6)])
        scene = VGroup(fire, rack, meat).move_to([0, 0.6, 0])
        self.say("석쇠에 닿지 않은 고기의 부위도 잘 익는 까닭은?",
                 "석쇠에서 고기를 구우면 석쇠에 닿지 않은 위쪽 부위도 잘 익어요. 그 까닭은 무엇일까요?")
        self.play(FadeIn(scene), run_time=0.8)
        self.pause_screen(4, "고기의 윗부분은 어떻게 익을까요?")
        ar = VGroup(*[K.heat_arrow((x, meat.get_bottom()[1] - 0.05), (x, meat.get_top()[1] + 0.35), col=K.SUNY, sw=10)
                      for x in (-0.9, 0, 0.9)])
        self.say(f"닿은 부위에서 닿지 않은 부위로 {o('열이 이동')}할 것 같아요",
                 "석쇠에 닿은 부위가 먼저 익고, 닿지 않은 부위로 열이 이동해 고기가 모두 익을 것 같아요. 고체에서 열이 이동하는 방식을 실험으로 알아봐요.")
        self.play(*[GrowArrow(a) for a in ar], run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 긴 구리판 ──
    def long_plate(self):
        self.section("긴 구리판")
        pl = K.Plate(K.long_rows(32, 2), cs=0.3, heat=(1, 31)).move_to([0, 0.9, 0])
        cd = K.candle(True, 1.0).move_to(pl.at(1, 31) + DOWN * 1.05)
        name = T("고온용 열 변색 붙임딱지를 붙인 긴 구리판", 28, INK).next_to(pl, UP, buff=0.3)
        self.say("긴 구리판에 열 변색 붙임딱지를 붙이고 한쪽 끝을 가열해요",
                 "긴 구리판 윗면에 고온용 열 변색 붙임딱지를 붙이고, 스탠드의 집게로 고정한 뒤 촛불로 한쪽 끝을 가열해요.")
        self.play(FadeIn(pl), FadeIn(name), run_time=0.6)
        self.play(FadeIn(cd, shift=UP * 0.2), run_time=0.5)
        safe = K.safety_note("실험복·보안경·안전 장갑을 착용해요. 화재와 화상에 주의하고, 뜨거운 구리판은 맨손으로 만지지 않아요.",
                             w=12.8, size=25).move_to([0, -1.85, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.pause_screen(4, "붙임딱지의 색깔은 어떻게 변할까요?")
        self.say("붙임딱지의 색깔이 어떻게 변하는지 봐요",
                 "가열한 끝부분부터 색깔이 변하기 시작해, 점점 먼 쪽으로 색깔이 변해요.")
        self.heat(pl, pl.max * 0.93, 5.0)
        ar = K.heat_arrow((pl.get_right()[0] - 0.3, pl.get_top()[1] + 0.95), (pl.get_left()[0] + 0.5, pl.get_top()[1] + 0.95), sw=9)
        self.play(FadeOut(name), GrowArrow(ar), run_time=0.8)
        self.settle()
        card = K.text_card([f"온도가 {r('높은')} 부분에서 온도가 {o('낮은')} 부분으로",
                            "구리판을 따라 열이 이동해요"], size=34).move_to([0, -0.55, 0])
        self.say(f"온도가 높은 부분에서 낮은 부분으로 {g('구리판을 따라')} 열이 이동해요",
                 "긴 구리판에서는 온도가 높은 부분에서 온도가 낮은 부분으로 구리판을 따라 열이 이동해요.")
        self.play(FadeOut(safe), FadeOut(cd), FadeIn(card), run_time=0.5)
        self.settle()
        note = K.text_card(["붙임딱지는 눈에 보이지 않는 열의 이동을 색깔 변화로 보려고 붙였어요"], size=28).move_to([0, -2.05, 0])
        self.say("붙임딱지가 없어도 구리판에서는 열이 이동해요",
                 "붙임딱지는 눈에 보이지 않는 열의 이동을 색깔 변화로 보기 위해 붙인 거예요. 붙임딱지가 없어도 구리판에서는 열이 이동해요.")
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── ㄷ자 구리판 ──
    def u_plate(self):
        self.section("ㄷ자 구리판")
        pl = K.Plate(K.u_rows(12, 20, 3), cs=0.3, heat=(1, 19)).move_to([-1.6, 0.35, 0])
        fl = K.flame(0.7).move_to(pl.at(1, 19) + RIGHT * 0.55)
        gap = T("끊어진 부분", 26, SOFT).move_to(pl.at(6, 13))
        marks = VGroup()
        for nm, (rr, cc) in zip("㉠㉡㉢㉣㉤", [(1, 12), (1, 1), (6, 1), (10, 11), (10, 19)]):
            c = Circle(radius=0.24, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(pl.at(rr, cc))
            marks.add(VGroup(c, T(nm, 26, INK).move_to(c)))
        self.say("ㄷ자 모양 구리판의 한쪽 끝을 가열하면?",
                 "이번에는 ㄷ자 모양 구리판의 한쪽 끝을 가열해요. 끊어진 곳 건너편 끝은 언제 색깔이 변할까요?")
        self.play(FadeIn(pl), FadeIn(fl), FadeIn(gap), FadeIn(marks), run_time=0.7)
        self.pause_screen(5, "㉤은 언제 색깔이 변할까요?")
        self.say("가열한 끝에서 시작해 구리판을 따라 차례로 변해요",
                 "가열한 끝에서 시작해 ㄷ자 구리판을 따라 차례로 색깔이 변했어요.")
        self.heat(pl, pl.max * 1.02, 6.0)
        order = T("㉠ → ㉡ → ㉢ → ㉣ → ㉤", 36, ORANGE)
        order.scale_to_fit_width(min(order.width, 5.0)).move_to([4.3, 1.0, 0])
        self.play(FadeIn(order), run_time=0.5)
        self.settle()
        card = K.text_card([f"구리판을 {g('따라')} 열이 이동해요",
                            f"끊어진 부분으로는 {r('이동하지 않아요')}"], w=5.3, size=32).move_to([4.3, -0.5, 0])
        self.say(f"끊어진 곳 건너편 ㉤은 {r('가장 나중에')} 변했어요",
                 "끊어진 곳 건너편은 가장 나중에 변했어요. 열은 끊어진 부분을 건너뛰지 않고, 가열한 부분에서 구리판을 따라 이동해요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), Indicate(marks[4], scale_factor=1.3), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 전도 ──
    def conduction(self):
        self.section("전도")
        card = K.text_card([f"온도가 높은 부분에서 온도가 낮은 부분으로",
                            f"고체 물질을 따라 열이 이동하는 방식 → {o('전도')}"], size=40).move_to([0, 1.3, 0])
        self.say(f"고체 물질을 따라 열이 이동하는 방식을 {o('전도')}라고 해요",
                 "고체의 한 부분을 가열하면 그 부분의 온도가 높아지고, 가열한 부분에서 온도가 낮은 주변으로 열이 이동해 주변의 온도도 높아져요. 이처럼 고체 물질을 따라 열이 이동하는 방식을 전도라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        mis = K.text_card(["종류가 다른 고체끼리는 열이 이동하지 않을까요?",
                           f"→ {g('아니요')}, 맞닿아 있거나 연결되어 있으면 열이 이동해요"], w=12.6, size=30).move_to([0, -1.0, 0])
        self.say(f"종류가 다른 고체라도 {g('맞닿아 있으면')} 열이 이동해요",
                 "생각 바로잡기! 다른 종류의 고체라도 맞닿아 있거나 연결되어 있으면 열이 이동해요. 석쇠의 금속에서 고기로 열이 이동한 것처럼요.")
        self.play(FadeIn(mis, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        pan = VGroup(K.rect(4.2, 0.22, "#6B7A88", 0, 0, stroke=INK, sw=3),
                     K.flame(1.0).move_to([0, -0.75, 0]))
        pan.move_to([-3.4, 0.8, 0])
        ar = VGroup(K.heat_arrow((-3.4, 1.15), (-5.2, 1.15), sw=7), K.heat_arrow((-3.4, 1.15), (-1.6, 1.15), sw=7))
        t1 = K.lines("불 위에 놓은 철판\n전체가 뜨거워져요", 28).move_to([-3.4, -0.9, 0])
        sp = K.soup_spoon().scale(1.2).move_to([3.4, 0.7, 0])
        t2 = K.lines("국에 담근 금속 숟가락\n손잡이도 뜨거워져요", 28).move_to([3.4, -0.9, 0])
        self.section("생활 속 전도")
        self.say(f"철판과 숟가락도 {o('전도')}로 뜨거워져요",
                 "불 위에 철판을 놓으면 가열한 부분에서 철판을 따라 열이 이동해 철판 전체가 뜨거워져요. 뜨거운 국에 담근 금속 숟가락도 전도로 손잡이 쪽까지 점점 뜨거워져요.")
        self.play(FadeIn(pan), FadeIn(t1), FadeIn(sp), FadeIn(t2), run_time=0.7)
        self.play(*[GrowArrow(a) for a in ar], run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"온도가 높은 부분에서 온도가 낮은 부분으로 고체 물질을",
                            f"따라 열이 이동하는 방식을 {o('전도')}(이)라고 합니다."], w=12.4, size=38).move_to([0, 0.6, 0])
        self.say(f"고체 물질을 따라 열이 이동하는 방식: {o('전도')}",
                 "온도가 높은 부분에서 온도가 낮은 부분으로 고체 물질을 따라 열이 이동하는 방식을 전도라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
