"""「과학 원리 돋보기」 4학년 24화 — 먹고 먹히는 관계 (4-2 2단원 생물과 환경 5~6차시, 화 코드 4-2-2-c)

바탕: grade4/science/sem2/u2-3.html(원본 _build_tb/src2/u2-3.html) — 도입(개구리가 먹는 동물: 애벌레·메뚜기·파리·거미 /
개구리를 먹는 동물: 매·뱀·족제비·오리), 먹이사슬·먹이그물 영상(CP 자리·E 순서 그대로: 풀 → 메뚜기 → 개구리, 메뚜기·개구리 → 오리,
오리 → 매·족제비), 생물 카드 9장 먹이 관계 모형(POS 자리·REL 16개 그대로, 정리 1: 족제비가 먹는 생물 4가지),
단순한 먹이 관계(토끼풀 → 애벌레 → 개구리 → 매)와 복잡한 먹이 관계에서 개구리가 사라질 때, 낱말 정리, 한눈에 쏙(먹이그물).
화살표는 앱과 같이 '먹이가 되는 생물 → 먹는 생물' 방향, 빨간색(앱 drawWeb). 먹이사슬 장면의 처음 두 화살표는 앱처럼 초록으로 강조.
앱 '생각이 쑥'(직박구리가 사라지면)은 뱀·다람쥐가 든 다른 그물이라 빼고, 같은 뜻의 '개구리가 사라지면'만 씀.
최종: ./make_final.sh s4ep24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, GrowArrow, Line, Circumscribe)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u22 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


POS = {'직박구리': (730, 232), '산수유': (612, 366), '애벌레': (400, 407), '토끼풀': (188, 366), '토끼': (75, 262),
       '오리': (101, 158), '개구리': (211, 89), '매': (400, 57), '족제비': (653, 120)}
REL = [('토끼풀', '애벌레'), ('토끼풀', '토끼'), ('산수유', '애벌레'), ('산수유', '직박구리'), ('애벌레', '직박구리'), ('애벌레', '개구리'),
       ('애벌레', '오리'), ('개구리', '오리'), ('개구리', '족제비'), ('개구리', '매'), ('직박구리', '족제비'), ('직박구리', '매'),
       ('오리', '족제비'), ('오리', '매'), ('토끼', '족제비'), ('족제비', '매')]


def web_xy(nm):
    x, y = POS[nm]
    return np.array([(x - 402) * 0.0171, 2.45 - (y - 57) * 0.01229, 0])


def tag(text, col, size=34):
    t = T(text, size, PAPER)
    b = K.R(t.width + 0.44, t.height + 0.28, col, rad=0.2, stroke=None, sw=0)
    t.move_to(b)
    return VGroup(b, t)


class S4Ep24(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 24
    EP_TITLE = "먹고 먹히는 관계"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.chain()
        self.web()
        self.gone()
        self.summary()
        self.closing(f"먹이사슬이 그물처럼 얽힌 것이 {r('먹이그물')}이에요\n먹이그물이 복잡할수록 생태계가 {g('안정적으로 유지')}돼요",
                     next_preview="4학년 25화 · 인간 활동은 생태계에 어떤 영향을 줄까?")
        self.wait(0.5)

    # ── 궁금해요: 개구리 ──
    def intro(self):
        self.section("궁금해요")
        frog = K.item("개구리", 1.8, 1.4, 34).move_to([0, 0.6, 0])
        bl = K.bin_box("개구리가 먹는 동물", 4.6, 3.9, GREEN, 32).move_to([-4.4, 0.6, 0])
        br = K.bin_box("개구리를 먹는 동물", 4.6, 3.9, RED, 32).move_to([4.4, 0.6, 0])
        self.say("개구리가 먹는 동물과 개구리를 먹는 동물은?",
                 "개구리가 먹는 동물과 개구리를 먹는 동물에는 어떤 것이 있을까요?")
        self.play(FadeIn(frog), FadeIn(bl), FadeIn(br), run_time=0.8)
        self.pause_screen(5, "개구리가 먹는 동물은?")
        eat = VGroup(*[K.item(n, 1.4, 0.95, 28) for n in ("애벌레", "메뚜기", "파리", "거미")]).arrange_in_grid(2, 2, buff=(0.5, 0.35))
        eat.move_to(bl.box.get_center() + DOWN * 0.3)
        eaten = VGroup(*[K.item(n, 1.4, 0.95, 28) for n in ("매", "뱀", "족제비", "오리")]).arrange_in_grid(2, 2, buff=(0.5, 0.35))
        eaten.move_to(br.box.get_center() + DOWN * 0.3)
        self.say(f"개구리는 애벌레, 메뚜기, 파리, 거미 등을 {g('먹어요')}",
                 "개구리는 애벌레, 메뚜기, 파리, 거미 등을 먹어요.")
        self.play(FadeIn(eat, lag_ratio=0.2), run_time=1.0)
        self.say(f"매, 뱀, 족제비, 오리 등은 개구리를 {r('먹어요')}",
                 "그리고 매, 뱀, 족제비, 오리 등은 개구리를 먹어요.")
        self.play(FadeIn(eaten, lag_ratio=0.2), run_time=1.0)
        self.say(f"생물들은 서로 {o('먹고 먹히는 관계')}에 있어요", "이처럼 생물들은 서로 먹고 먹히는 관계에 있어요.")
        self.settle()
        clear_stage(self)

    # ── 먹이사슬 → 먹이그물 (앱 영상) ──
    def chain(self):
        self.section("먹이사슬")
        CP = {'풀': (80, 272), '메뚜기': (230, 272), '개구리': (380, 272), '오리': (305, 160), '매': (200, 52), '족제비': (420, 52)}

        def xy(n):
            x, y = CP[n]
            return np.array([(x - 250) * 0.0275 - 0.4, 2.2 - (y - 52) * 0.0175, 0])
        nd = {n: K.node(n, 1.6, 1.25, 28).move_to(xy(n)) for n in CP}
        self.say(f"{g('풀')}은 스스로 양분을 만들어요", "풀은 스스로 양분을 만들어요.")
        self.play(FadeIn(nd['풀'], scale=0.8), run_time=0.5)
        self.say("메뚜기는 풀을 먹어요 (풀 → 메뚜기)", "메뚜기는 풀을 먹어요. 풀에서 메뚜기 쪽으로 화살표를 그려요.")
        self.play(FadeIn(nd['메뚜기'], scale=0.8), run_time=0.5)
        a1 = K.arrow(nd['풀'], nd['메뚜기'], GREEN, 8)
        self.play(GrowArrow(a1), run_time=0.6)
        self.say("개구리는 메뚜기를 먹어요 (메뚜기 → 개구리)", "개구리는 메뚜기를 먹어요.")
        self.play(FadeIn(nd['개구리'], scale=0.8), run_time=0.5)
        a2 = K.arrow(nd['메뚜기'], nd['개구리'], GREEN, 8)
        self.play(GrowArrow(a2), run_time=0.6)
        lab = tag("먹이사슬", GREEN, 38).move_to([5.0, xy('개구리')[1], 0])
        self.say(f"먹고 먹히는 관계가 사슬처럼 이어진 것을 {g('먹이사슬')}이라고 해요",
                 "이처럼 생물이 서로 먹고 먹히는 관계가 사슬처럼 한 방향으로 연결된 것을 먹이사슬이라고 해요.")
        self.play(FadeIn(lab, shift=LEFT * 0.3), run_time=0.5)
        note = M(f"화살표: {g('먹이가 되는 생물')} → {r('먹는 생물')}", 32).move_to([0, -2.2, 0])
        self.say("화살표는 먹이에서 먹는 생물 쪽으로 그려요",
                 "화살표는 먹이가 되는 생물에서 먹는 생물 쪽으로 그려요. 방향을 반대로 그리지 않게 조심해요.")
        self.play(FadeIn(note), run_time=0.5)
        self.settle()
        self.play(FadeOut(note), FadeOut(lab), a1.animate.set_color(RED), a2.animate.set_color(RED), run_time=0.5)
        self.say("오리는 메뚜기뿐만 아니라 개구리도 먹어요", "오리는 메뚜기뿐만 아니라 개구리도 먹어요.")
        self.play(FadeIn(nd['오리'], scale=0.8), run_time=0.5)
        a3, a4 = K.arrow(nd['메뚜기'], nd['오리']), K.arrow(nd['개구리'], nd['오리'])
        self.play(GrowArrow(a3), GrowArrow(a4), run_time=0.6)
        self.say("오리는 매나 족제비에게 잡아먹혀요", "오리는 매나 족제비에게 잡아먹혀요.")
        self.play(FadeIn(nd['매'], scale=0.8), FadeIn(nd['족제비'], scale=0.8), run_time=0.5)
        a5, a6 = K.arrow(nd['오리'], nd['매']), K.arrow(nd['오리'], nd['족제비'])
        self.play(GrowArrow(a5), GrowArrow(a6), run_time=0.6)
        lab2 = tag("먹이그물", ORANGE, 38).move_to([5.0, xy('오리')[1], 0])
        self.say(f"여러 먹이사슬이 그물처럼 얽힌 것을 {r('먹이그물')}이라고 해요",
                 "여러 개의 먹이사슬이 그물처럼 복잡하게 얽혀 있는 것을 먹이그물이라고 해요.")
        self.play(FadeIn(lab2, shift=LEFT * 0.3), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 먹이 관계 모형 ──
    def make_web(self):
        nd = {n: K.node(n, 1.42, 1.05, 24).move_to(web_xy(n)) for n in POS}
        ar = {(a, b): K.arrow(nd[a], nd[b], RED, 5) for a, b in REL}
        return nd, ar

    def web(self):
        self.section("먹이 관계 모형")
        nd, ar = self.make_web()
        self.say("생물 카드 9장으로 먹이 관계 모형을 만들어요",
                 "생물 카드 아홉 장으로 먹이 관계 모형을 만들어요. 먼저 토끼풀 카드를 놓고, 먹이 관계에 있는 카드를 이어 붙여요.")
        self.play(FadeIn(nd['토끼풀'], scale=0.8), run_time=0.5)
        order = ['토끼', '애벌레', '산수유', '직박구리', '개구리', '오리', '족제비', '매']
        shown = {'토끼풀'}
        for n in order:
            shown.add(n)
            new = [ar[e] for e in REL if n in e and e[0] in shown and e[1] in shown]
            self.play(FadeIn(nd[n], scale=0.8), *[GrowArrow(a) for a in new], run_time=0.55)
        self.say("처음에는 사슬 같던 관계가 그물처럼 복잡해졌어요",
                 "처음에는 사슬처럼 단순했던 먹이 관계가, 카드를 모두 놓으니 그물처럼 복잡해졌어요.")
        self.settle()
        self.say("족제비가 먹는 생물은 무엇일까요?", "완성된 모형을 보고 족제비가 먹는 생물을 모두 찾아봐요.")
        self.play(Indicate(nd['족제비'], color=ORANGE), run_time=0.8)
        self.pause_screen(5, "족제비가 먹는 생물은?")
        ins = [e for e in REL if e[1] == '족제비']
        others = [ar[e] for e in REL if e not in ins]
        self.say(f"족제비는 직박구리, 개구리, 오리, 토끼를 먹어요",
                 "족제비 쪽으로 들어오는 화살표를 따라가 봐요. 족제비는 직박구리, 개구리, 오리, 토끼를 먹어요.")
        self.play(*[a.animate.set_opacity(0.15) for a in others],
                  *[ar[e].animate.set_color(GREEN).set_stroke(width=9) for e in ins], run_time=0.8)
        self.play(*[Circumscribe(nd[e[0]], color=GREEN) for e in ins], run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 개구리가 사라지면 ──
    def gone(self):
        self.section("개구리가 사라지면")
        names = ['토끼풀', '애벌레', '개구리', '매']
        nd = {n: K.node(n, 1.7, 1.3, 28).move_to([-4.8 + i * 3.2, 0.9, 0]) for i, n in enumerate(names)}
        ars = [K.arrow(nd[a], nd[b], RED, 7) for a, b in zip(names, names[1:])]
        head = T("단순한 먹이 관계", 38).move_to([0, 2.5, 0])
        self.say("단순한 먹이 관계에서 개구리가 사라지면 어떻게 될까요?",
                 "단순한 먹이 관계에서 개구리가 사라지면 어떻게 될까요?")
        self.play(FadeIn(head), *[FadeIn(v) for v in nd.values()], *[GrowArrow(a) for a in ars], run_time=1.0)
        self.pause_screen(5, "개구리가 사라지면 매는?")
        x = VGroup(Line(UP + LEFT, DOWN + RIGHT), Line(UP + RIGHT, DOWN + LEFT)).set_stroke(RED, 10).scale(0.55).move_to(nd['개구리'])
        msg = T("먹을 것이 없어요!", 34, RED).next_to(nd['매'], DOWN, buff=0.35)
        self.play(Create(x), nd['개구리'].animate.set_opacity(0.3), ars[1].animate.set_opacity(0.15), ars[2].animate.set_opacity(0.15), run_time=0.8)
        self.say(f"매는 먹을 것이 없어 살 수 없고, 생태계가 {r('유지되기 어려워요')}",
                 "매는 먹을 것이 없어 살 수 없어요. 생태계가 유지되기 어려워요.")
        self.play(FadeIn(msg), nd['매'].animate.set_opacity(0.4), run_time=0.6)
        self.settle()
        clear_stage(self)

        nd2, ar2 = self.make_web()
        self.say("복잡한 먹이 관계에서는 어떨까요?", "이번에는 복잡한 먹이 관계에서 개구리가 사라지게 해 봐요.")
        self.play(*[FadeIn(v) for v in nd2.values()], *[FadeIn(a) for a in ar2.values()], run_time=1.0)
        x2 = VGroup(Line(UP + LEFT, DOWN + RIGHT), Line(UP + RIGHT, DOWN + LEFT)).set_stroke(RED, 9).scale(0.45).move_to(nd2['개구리'])
        fr = [ar2[e] for e in REL if '개구리' in e]
        self.play(Create(x2), nd2['개구리'].animate.set_opacity(0.3), *[a.animate.set_opacity(0.1) for a in fr], run_time=0.8)
        ins = [e for e in REL if e[1] == '매' and e[0] != '개구리']
        self.say(f"매는 직박구리, 오리, 족제비를 먹고 {g('살 수 있어요')}",
                 "개구리가 사라져도 매는 직박구리, 오리, 족제비를 먹고 살 수 있어요. 생태계가 유지될 수 있어요.")
        self.play(*[ar2[e].animate.set_color(GREEN).set_stroke(width=9) for e in ins], Indicate(nd2['매'], color=GREEN), run_time=1.0)
        self.say(f"먹이 관계가 {o('복잡')}하면 다른 먹이를 먹고 살아갈 수 있어요",
                 "이처럼 먹이 관계가 복잡하면 어떤 생물이 사라져도 다른 먹이를 먹고 살아갈 수 있어, 생태계를 안정적으로 유지하는 데 도움이 돼요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        c1 = K.text_card([f"{g('먹이사슬')}: 먹고 먹히는 관계가 사슬처럼 한 방향으로 연결된 것"], size=34).move_to([0, 1.9, 0])
        c2 = K.text_card([f"생물의 먹이 관계가 서로 복잡하게 얽혀 있는 것을", f"{r('먹이그물')}이라고 합니다."], size=44).move_to([0, 0.15, 0])
        ex = M(f"바르게 나타낸 먹이사슬:  토끼풀 → 토끼 → 뱀", 34).move_to([0, -1.75, 0])
        self.say(f"먹이사슬은 {g('한 방향')}, 먹이그물은 {r('여러 방향')}으로 얽혀요",
                 "먹이사슬은 먹고 먹히는 관계가 한 방향으로 연결되고, 먹이그물은 여러 방향으로 얽혀 있어요.")
        self.play(FadeIn(c1), run_time=0.6)
        self.play(FadeIn(c2, scale=0.95), run_time=0.7)
        self.say("토끼풀 → 토끼 → 뱀처럼 먹이부터 차례로 써요",
                 "먹이사슬은 토끼풀, 토끼, 뱀처럼 먹이가 되는 생물부터 차례로 화살표로 이어 써요.")
        self.play(FadeIn(ex), run_time=0.5)
        self.settle()
        clear_stage(self)
