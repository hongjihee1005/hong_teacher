"""「과학 원리 돋보기」 4학년 10화 — 흐르는 물은 땅을 어떻게 바꿀까? (4-1 3단원 땅의 변화 2차시, 화 코드 4-1-3-a)

바탕: grade4/science/sem1/u3-1.html(원본 _build_tb/src/u3-1.html) — 도입(비 오기 전·후 운동장), 실험(종이컵 홈 → 흙 언덕 20 cm 정도 →
꼭대기에 컵 → 커피 찌꺼기 → 물 붓기 → 관찰), 결과(위쪽이 많이 깎이고 아래쪽에 쌓임, 커피 찌꺼기는 위에서 아래로),
생각+(물의 양 적게·많게: 많으면 윗부분이 더 많이 깎이고 아래쪽에 더 많이 쌓임), 침식·운반·퇴적, 한눈에 쏙.
흙 언덕 모양은 앱의 baseY·hillY 식 그대로(kit_s4u13.hill).
최종: ./make_final.sh s4ep10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker,
                   always_redraw, linear, Arrow, SurroundingRectangle)

from series_style import GREEN, INK, ORANGE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S4Ep10(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 10
    EP_TITLE = "흐르는 물은 땅을 어떻게 바꿀까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.result()
        self.amount()
        self.three_works()
        self.summary()
        self.closing(f"흐르는 물은 흙을 깎고({r('침식')}), 옮기고({o('운반')}), 쌓아요({g('퇴적')})\n그래서 땅의 모습이 변해요",
                     next_preview="4학년 11화 · 강 주변 지형")
        self.wait(0.5)

    # ── 궁금해요: 운동장 ──
    def intro(self):
        self.section("궁금해요")
        before = K.yard(0).move_to([0, 0.35, 0])
        cap = T("비가 오기 전의 운동장", 34).move_to([0, 2.55, 0])
        self.say("비가 오기 전과 온 후의 운동장은 어떻게 다를까요?",
                 "비가 오기 전과 비가 온 뒤의 운동장 모습은 어떻게 다를까요?")
        self.play(FadeIn(before), FadeIn(cap), run_time=0.8)
        rain = K.rain(50).move_to(before)
        self.play(FadeIn(rain), run_time=0.4)
        self.play(rain.animate.shift(DOWN * 0.4), run_time=1.2, rate_func=linear)
        after = K.yard(1).move_to(before)
        cap2 = T("비가 온 뒤의 운동장", 34).move_to(cap)
        self.play(FadeOut(rain), FadeOut(before), FadeIn(after), FadeOut(cap), FadeIn(cap2), run_time=1.0)
        self.say(f"물이 흐른 자국이 생기고 {o('울퉁불퉁')}해졌어요",
                 "비가 그친 뒤 운동장에는 물이 흐른 자국이 생기고 울퉁불퉁해졌어요. 빗물이 흐른 자리를 따라 흙이 파이고, 흙이 낮은 곳으로 옮겨졌어요.")
        self.say("흐르는 물은 땅을 어떻게 바꿀까요?", "흐르는 물은 땅의 모습을 어떻게 바꿀까요? 실험으로 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요: 흙 언덕 ──
    def experiment(self):
        self.section("실험해요")
        ground = K.ground_strip()
        hh = ValueTracker(0.0)
        hillm = always_redraw(lambda: K.hill(0, 1, hh.get_value()))
        self.say("종이컵에 홈을 만들고, 흙을 쌓아 흙 언덕을 만들어요",
                 "먼저 종이컵의 위쪽에 가위로 홈을 만들어요. 그리고 꽃삽으로 흙을 쌓아 흙 언덕을 만들어요.")
        self.add(hillm)
        self.play(FadeIn(ground), run_time=0.4)
        self.play(hh.animate.set_value(1.0), run_time=2.0)
        hillm.clear_updaters()
        ruler = VGroup(K.L((-3.4, K.HY0), (-3.4, K._hy(155)), INK, 5),
                       K.L((-3.6, K._hy(155)), (-3.2, K._hy(155)), INK, 5))
        rl = T("20 cm 정도", 30).next_to(ruler, LEFT, buff=0.2)
        self.say(f"흙 언덕은 {o('20 cm 정도')} 높이로 쌓고 살짝 다져요",
                 "흙 언덕은 20센티미터 정도 높이로 쌓고, 손으로 살짝 두드려 다져요.")
        self.play(Create(ruler), FadeIn(rl), run_time=0.7)
        cup = K.paper_cup()
        self.say("꼭대기에 종이컵을 넣고, 커피 찌꺼기를 뿌려요",
                 "흙 언덕의 가장 위쪽을 파내어 종이컵을 넣어요. 그리고 커피 찌꺼기를 흙 언덕 위에 조금 뿌려요. 흙이 어떻게 이동하는지 쉽게 볼 수 있어요.")
        self.play(FadeIn(cup, shift=DOWN * 0.5), FadeOut(ruler), FadeOut(rl), run_time=0.7)
        cf = K.coffee(0)
        self.play(FadeIn(cf, lag_ratio=0.05), run_time=1.0)
        self.say("페트병의 물을 종이컵에 천천히 부어요",
                 "이제 페트병의 물을 종이컵에 천천히 부어요. 종이컵 홈으로 물이 흘러나와 흙 언덕을 따라 흘러요.")
        bt = K.bottle(-110).move_to(K.paper_cup().get_center() + np.array([-0.6, 1.1, 0]))
        self.play(FadeIn(bt), run_time=0.4)
        self.wait(0.5)
        self.cup, self.ground, self.hill0, self.cf, self.bt = cup, ground, hillm, cf, bt
        self.pause_screen(6, "흙 언덕은 어떻게 변할까요?")

        p = ValueTracker(0.0)
        hill2 = always_redraw(lambda: K.hill(p.get_value(), 1))
        water = always_redraw(lambda: K.water_line(p.get_value(), 1, upto=420 + 280 * min(1, p.get_value() * 4)))
        cf2 = always_redraw(lambda: K.coffee(p.get_value(), p.get_value(), 1))
        self.remove(hillm, cf)
        self.add(hill2, water, cup, cf2)
        self.say("물이 흙 언덕을 따라 흘러요", "물이 흙 언덕을 따라 흘러내려요. 흙과 커피 찌꺼기를 잘 살펴봐요.")
        self.play(p.animate.set_value(1.0), run_time=6.0, rate_func=linear)
        for m in (hill2, water, cf2):
            m.clear_updaters()
        self.play(FadeOut(water), FadeOut(bt), run_time=0.5)
        ghost = K.hill_ghost()
        self.say("원래 모습(점선)과 비교해 봐요", "물을 모두 흘려 보냈어요. 원래 모습인 점선과 비교해 봐요.")
        self.play(Create(ghost), run_time=1.2)
        self.settle()
        self.hill2, self.cf2, self.ghost = hill2, cf2, ghost

    # ── 결과 ──
    def result(self):
        self.section("결과를 찾아요")
        top = np.array([K._hx(470), K._hy(K.hill_y(470, 1)) + 0.05, 0])
        bot = np.array([K._hx(625), K._hy(K.hill_y(625, 1)), 0])
        a1 = Arrow(top + np.array([1.6, 1.4, 0]), top + np.array([0.15, 0.1, 0]), color=RED, stroke_width=8, buff=0.05)
        l1 = M(r("많이 깎인 곳: 위쪽"), 34).next_to(a1.get_start(), UP + RIGHT * 0.3, buff=0.1)
        self.say(f"흙 언덕 {r('위쪽')}에서 흙이 많이 깎였어요",
                 "흙이 많이 깎인 곳은 어디일까요? 흙 언덕의 위쪽에서 흙이 많이 깎였어요. 점선보다 낮아졌지요.")
        self.play(Create(a1), run_time=0.6)
        self.play(FadeIn(l1), run_time=0.4)
        a2 = Arrow(bot + np.array([1.3, 1.2, 0]), bot + np.array([0.1, 0.12, 0]), color=GREEN, stroke_width=8, buff=0.05)
        l2 = M(g("많이 쌓인 곳: 아래쪽"), 34).next_to(a2.get_start(), UP, buff=0.1).shift(RIGHT * 0.3)
        self.say(f"흙 언덕 {g('아래쪽')}에 흙이 많이 쌓였어요",
                 "흙이 많이 쌓인 곳은 흙 언덕의 아래쪽이에요. 점선보다 높아졌어요.")
        self.play(Create(a2), run_time=0.6)
        self.play(FadeIn(l2), run_time=0.4)
        self.say(f"커피 찌꺼기는 {o('위에서 아래로')} 옮겨져 쌓였어요",
                 "커피 찌꺼기는 어떻게 움직였나요? 위에서 아래로 옮겨져 아래쪽에 쌓였어요. 물은 높은 곳에서 낮은 곳으로 흐르니까요.")
        self.play(Indicate(self.cf2, color=ORANGE, scale_factor=1.15), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 물의 양 ──
    def amount(self):
        self.section("생각+")
        self.say("흘려 보내는 물의 양을 바꾸면 어떻게 될까요?",
                 "흘려 보내는 물의 양을 바꾸면 어떻게 될까요? 흙 언덕의 높이와 물을 붓는 높이는 같게 하고, 물의 양만 다르게 해 봐요.")
        L = VGroup(K.ground_strip(), K.hill(0), K.paper_cup())
        Rr = VGroup(K.ground_strip(), K.hill(0), K.paper_cup())
        L.scale(0.55).move_to([-3.4, 0.0, 0])
        Rr.scale(0.55).move_to([3.4, 0.0, 0])
        tl = M("물의 양 " + o("적게"), 36).move_to([-3.4, 1.9, 0])
        tr = M("물의 양 " + o("많게"), 36).move_to([3.4, 1.9, 0])
        self.play(FadeIn(L), FadeIn(Rr), FadeIn(tl), FadeIn(tr), run_time=0.8)
        self.pause_screen(5, "물의 양이 많으면 어떻게 될까요?")
        out = []
        for grp, a, cx in ((L, 0.45, -3.4), (Rr, 1.25, 3.4)):
            new = VGroup(K.ground_strip(), K.hill(1, a), K.paper_cup(), K.hill_ghost(), K.depth_mark(1, a))
            new.scale(0.55)
            new.shift(np.array([cx, 0, 0]) - (VGroup(K.ground_strip(), K.hill(0), K.paper_cup()).scale(0.55).get_center()))
            new.align_to(grp, DOWN)
            out.append(new)
        self.say("가상 실험으로 물을 부어 깎인 깊이를 비교해요",
                 "가상 실험으로 물을 부어 보고, 흙 언덕 윗부분이 깎인 깊이를 빨간 선으로 비교해요.")
        self.play(FadeOut(L), FadeIn(out[0]), run_time=1.2)
        self.play(FadeOut(Rr), FadeIn(out[1]), run_time=1.2)
        self.say(f"물의 양이 많으면 윗부분이 {r('더 많이 깎이고')}, 아래쪽에 {g('더 많이 쌓여요')}",
                 "물의 양이 많을 때 흙 언덕의 윗부분이 더 많이 깎이고, 아래쪽에 흙이 더 많이 쌓였어요.")
        self.play(Indicate(out[1][4], color=RED, scale_factor=1.3), run_time=1.0)
        self.say("실제로는 여러 까닭으로 결과가 조금씩 다를 수 있어요",
                 "가상 실험은 실제 실험을 대신하지 않아요. 실제로는 여러 까닭으로 결과가 조금씩 다를 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 세 가지 일 ──
    def three_works(self):
        self.section("흐르는 물의 작용")
        items = [("침식 작용", "바위나 돌, 흙을 깎아 내는 것", RED, 470),
                 ("운반 작용", "돌이나 흙을 다른 곳으로 옮기는 것", ORANGE, 560),
                 ("퇴적 작용", "운반된 돌이나 흙이 쌓이는 것", GREEN, 640)]
        base = VGroup(K.ground_strip(), K.hill(1), K.paper_cup(), K.coffee(1, 1))
        dots = VGroup(*[K.Circle(radius=0.32, stroke_color=col, stroke_width=8).move_to(
            [K._hx(hx), K._hy(K.hill_y(hx, 1)) + 0.05, 0]) for _, _, col, hx in items])
        pic = VGroup(base, dots).scale(0.6).move_to([-3.2, -0.3, 0])
        self.play(FadeIn(base), run_time=0.6)
        rows = VGroup()
        for i, (nm, d, col, hx) in enumerate(items):
            row = VGroup(K.label(nm, col, 34), T(d, 28)).arrange(DOWN, buff=0.15, aligned_edge=LEFT)
            row.move_to([3.5, 1.7 - i * 1.6, 0])
            rows.add(row)
        narr = ["흙 언덕 위쪽에서 흙이 깎였지요. 물이 흘러가며 바위나 돌을 깎아 내는 것을 침식 작용이라고 해요.",
                "커피 찌꺼기가 물을 따라 옮겨졌어요. 돌이나 흙을 다른 곳으로 이동시키는 것을 운반 작용이라고 해요.",
                "흙 언덕 아래쪽에 흙이 쌓였어요. 운반된 돌이나 흙이 쌓이는 것을 퇴적 작용이라고 해요."]
        for i, (nm, d, col, hx) in enumerate(items):
            self.say(f'<span foreground="{col}">{nm}</span>: {d}', narr[i])
            self.play(Create(dots[i]), FadeIn(rows[i], shift=LEFT * 0.3), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"흐르는 {o('물')}은 침식 작용, 운반 작용, 퇴적 작용을 하여",
                            "땅의 모습을 변화시킵니다.",
                            f"물이 흘러가며 바위나 돌을 깎아 내는 것을 {r('침식')} 작용,",
                            f"운반된 돌이나 흙이 쌓이는 것을 {g('퇴적')} 작용이라고 합니다."], w=12.8, size=40).move_to([0, 0.4, 0])
        self.say(f"흐르는 물은 {r('침식')}·{o('운반')}·{g('퇴적')} 작용으로 땅을 바꿔요",
                 "흐르는 물은 침식 작용, 운반 작용, 퇴적 작용을 하여 땅의 모습을 변화시켜요. 물이 흘러가며 바위나 돌을 깎아 내는 것을 침식 작용, 운반된 돌이나 흙이 쌓이는 것을 퇴적 작용이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
