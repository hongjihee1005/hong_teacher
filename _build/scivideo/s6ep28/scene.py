"""「과학 원리 돋보기」 6학년 28화 — 태양 고도와 태양 에너지양 (6-2 1단원 계절의 변화 6차시, 화 코드 6-2-1-d)

바탕: grade6/science/sem2/u1-4.html(원본 _build_tb/src2/u1-4.html) — 도입(무대 조명은 수직으로 비춰야 좁은 곳에 모여 밝음),
실험 준비(스마트 기기·빨판 달린 막대·LED 손전등·자, 조도 측정기 앱 — 숫자가 클수록 빛이 셈, 약 20 cm 거리는 늘 같게, 안전),
가상 실험(그림자가 짧을 때 = 각이 큼 → 빛이 셈 → 에너지양 많음, 길 때는 반대 — 화면 숫자는 앱 가상 실험 식 1503 × sin(각)의 예),
손전등 = 태양, 스마트 기기 = 지표면, 각 = 태양 고도, 센서가 받는 에너지양 = 태양 에너지양,
같은 빛·다른 넓이(빛줄기 10개, 노란 칸에 닿는 수), 여름(76°)·겨울(29°) 빛줄기 8개 영상, 여름 덥고 겨울 추운 까닭,
'태양이 빛을 더 많이 내서'는 틀림, 한눈에 쏙.
최종: ./make_final.sh s6ep28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Flash,
                   Rectangle, RoundedRectangle, Line)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S6Ep28(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 28
    EP_TITLE = "태양 고도와 태양 에너지양"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.prepare()
        self.experiment()
        self.mapping()
        self.why()
        self.seasons()
        self.summary()
        self.closing(f"태양 고도가 높을수록 일정한 면적의 지표면이 받는\n태양 에너지양이 {o('많아요')}",
                     next_preview="6학년 29화 · 계절이 바뀌는 까닭")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        a = K.stage_light(35, w=5.6, cx=-3.2, y=-1.6)
        b = K.stage_light(90, w=5.6, cx=3.2, y=-1.6)
        la = K.label("비스듬히 비출 때", INK, 28).move_to([-2.9, 2.5, 0])
        lb = K.label("수직으로 비출 때", INK, 28).move_to([3.2, 2.5, 0])
        self.say("배우가 밝게 보이려면 조명을 어떻게 비춰야 할까요?", "무대 위 배우가 밝게 보이려면 조명을 어떻게 비춰야 할까요?")
        self.play(FadeIn(a), FadeIn(la), run_time=0.7)
        self.play(FadeIn(b), FadeIn(lb), run_time=0.7)
        self.settle()
        self.say(f"{o('수직')}으로 비추면 빛이 좁은 곳에 모여 더 밝아요",
                 "조명을 수직으로 비추면 빛이 좁은 곳에 모여 더 밝아요.")
        self.play(Circumscribe(b, color=ORANGE), run_time=1.0)
        self.settle()
        self.say(f"태양 고도에 따라 지표면이 받는 {o('에너지양')}도 달라질까요?",
                 "태양 고도에 따라 지표면이 받는 태양 에너지양도 달라질까요?")
        self.settle()
        clear_stage(self)

    # ── 실험 준비 ──
    def prepare(self):
        self.section("실험 준비")
        names = ["스마트 기기", "빨판 달린 막대", "LED 손전등", "자"]
        cards = VGroup(*[K.word_card(n, w=2.9, h=0.9, size=28) for n in names]).arrange(RIGHT, buff=0.25).move_to([0, 2.3, 0])
        self.say("준비물이에요", "준비물은 스마트 기기, 빨판 달린 막대, 발광 다이오드 손전등, 자예요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.9)
        st = K.steps_row(["빛의 세기 측정\n앱 실행", "카메라 센서 가까이\n빨판 막대 세우기", "약 20 cm에서 비추고\n그림자 짧을 때·길 때 재기"],
                         w=3.8, h=1.5, size=26, buff=0.45, accent=self.accent).move_to([0, 0.55, 0])
        self.say(f"손전등은 언제나 {o('약 20 cm')} 떨어진 곳에서 비춰요",
                 "앱을 켜고 센서 가까이에 막대를 세운 뒤, 손전등을 약 이십 센티미터 떨어진 곳에서 비춰 그림자가 짧을 때와 길 때를 재요.")
        self.play(FadeIn(st.cards[0]), run_time=0.4)
        for i in range(2):
            self.play(Create(st.arrows[i]), FadeIn(st.cards[i + 1]), run_time=0.5)
        self.settle()
        warn = K.safety_note("손전등 빛을 눈에 비추지 않아요. 다른 빛이 재어지지 않게 교실을 어둡게 해요", w=12.6, size=26).move_to([0, -1.3, 0])
        self.say(f"손전등 빛을 {r('눈에 비추지 않아요')}", "손전등의 빛을 눈에 비추지 않아요. 주변의 다른 빛이 재어지지 않도록 교실을 어둡게 해요.")
        self.play(FadeIn(warn), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def experiment(self):
        self.section("실험해요")
        A, B = 80, 30
        a = K.torch_rig(A, cx=-3.3, y=-1.15, R=2.2)
        b = K.torch_rig(B, cx=3.3, y=-1.15, R=2.2)
        la = M(f"그림자가 {o('짧을')} 때", 30).move_to([-2.6, 2.45, 0])
        lb = M(f"그림자가 {o('길')} 때", 30).move_to([3.3, 2.45, 0])
        self.say("그림자가 짧을 때와 길 때 빛의 세기를 비교해요",
                 "손전등의 각도를 바꿔, 막대의 그림자가 짧을 때와 길 때 빛의 세기를 비교해요.")
        self.play(FadeIn(a), FadeIn(la), run_time=0.7)
        self.play(FadeIn(b), FadeIn(lb), run_time=0.7)
        self.settle()
        ka = M(f"각이 {o('커요')}", 28).move_to([-3.3, -1.8, 0])
        kb = M(f"각이 {o('작아요')}", 28).move_to([3.3, -1.8, 0])
        self.say(f"그림자가 짧을 때 손전등과 스마트 기기가 이루는 각이 {o('커요')}",
                 "그림자가 짧을 때는 손전등과 스마트 기기가 이루는 각이 크고, 그림자가 길 때는 각이 작아요.")
        self.play(Indicate(a.arc, color=RED), Indicate(b.arc, color=RED), FadeIn(ka), FadeIn(kb), run_time=1.0)
        self.settle()
        self.pause_screen(5, "빛의 세기는 언제 더 셀까요?")
        ma = K.light_meter(K.lux(A), w=2.3, h=1.3, size=44).move_to([-1.0, 1.0, 0])
        mb = K.light_meter(K.lux(B), w=2.3, h=1.3, size=44).move_to([5.6, 1.0, 0])
        ex = T("(화면 숫자는 앱 가상 실험의 예)", 22, SOFT).move_to([0, -2.35, 0])
        self.say(f"각이 클 때 숫자가 더 커요 — 빛이 더 {o('세요')}",
                 "조도 측정기의 숫자가 클수록 빛이 세요. 각이 클 때 숫자가 더 커서 빛이 더 세요.")
        self.play(FadeIn(ma), FadeIn(mb), FadeIn(ex), run_time=0.8)
        self.play(Indicate(ma.val, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)
        tb = K.result_table(["", "손전등과 스마트 기기의 각", "빛의 세기", "센서가 받는 에너지양"],
                            [["그림자가 짧을 때", o("큽니다"), o("셉니다"), o("많습니다")],
                             ["그림자가 길 때", g("작습니다"), g("약합니다"), g("적습니다")]],
                            [3.0, 3.9, 2.4, 3.6], row_h=0.95, size=28).move_to([0, 0.8, 0])
        self.say(f"각이 클수록 빛이 세고, 받는 {o('에너지양이 많아요')}",
                 "각이 클수록 빛의 세기가 세고, 센서가 받는 에너지양이 많아요. 각이 작으면 빛이 약하고 에너지양이 적어요.")
        self.play(FadeIn(tb), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 무엇을 뜻할까 ──
    def mapping(self):
        self.section("모형과 실제")
        pairs = [("손전등", "태양"), ("스마트 기기", "지표면"), ("손전등과 스마트 기기가 이루는 각", "태양 고도"),
                 ("센서가 받는 에너지양", "태양 에너지양")]
        rows = VGroup()
        for a, b in pairs:
            l_ = K.word_card(a, w=6.0, h=0.85, size=28)
            r_ = K.word_card(b, w=3.4, h=0.85, size=30, col=self.accent)
            r_.next_to(l_, RIGHT, buff=1.5)
            ar = K.arrow_right(l_.get_right()[0] + 0.1, r_.get_left()[0] - 0.1, l_.get_center()[1], ORANGE, 6)
            rows.add(VGroup(l_, ar, r_))
        rows.arrange(DOWN, buff=0.28).move_to([0, 0.55, 0])
        self.say(f"손전등을 {o('태양')}이라고 하면 무엇을 뜻할까요?", "손전등을 태양이라고 하면, 실험의 각 부분은 무엇을 뜻할까요?")
        self.play(FadeIn(VGroup(*[r_[0] for r_ in rows]), lag_ratio=0.15), run_time=0.9)
        self.settle()
        self.say(f"손전등과 스마트 기기가 이루는 각은 {o('태양 고도')}예요",
                 "손전등은 태양, 스마트 기기는 지표면이에요. 손전등과 스마트 기기가 이루는 각은 태양 고도, 센서가 받는 에너지양은 태양 에너지양이에요.")
        for r_ in rows:
            self.play(Create(r_[1]), FadeIn(r_[2], shift=LEFT * 0.2), run_time=0.45)
        self.settle()
        clear_stage(self)

    # ── 같은 빛, 다른 넓이 ──
    def why(self):
        self.section("같은 빛, 다른 넓이")
        a = K.beam_panel(90, cx=-3.3, y=-1.3, length=2.4, show_count=True, size=28)
        b = K.beam_panel(30, cx=3.3, y=-1.3, length=2.4, show_count=True, size=28)
        ta = M(f"태양 고도 {o('90°')}", 30).move_to([-3.3, 2.4, 0])
        tb = M(f"태양 고도 {o('30°')}", 30).move_to([2.6, 2.4, 0])
        self.say(f"같은 빛줄기 10개가 {o('일정한 면적')}(노란 칸)에 몇 개 닿을까요?",
                 "같은 빛줄기 열 개를 비춰요. 노란 칸, 곧 일정한 면적에 닿는 빛줄기는 몇 개일까요?")
        self.play(FadeIn(VGroup(*[m for m in a if m is not a.cnt_text])), FadeIn(ta), run_time=0.8)
        self.play(FadeIn(VGroup(*[m for m in b if m is not b.cnt_text])), FadeIn(tb), run_time=0.8)
        self.pause_screen(5, "어느 쪽에 더 많이 닿을까요?")
        self.say(f"고도가 높으면 {o('10개')}, 낮으면 {g('6개')}만 닿아요",
                 "태양 고도가 높을 때는 열 개가 모두 닿고, 낮을 때는 여섯 개만 닿아요.")
        self.play(FadeIn(a.cnt_text), FadeIn(b.cnt_text), run_time=0.7)
        self.settle()
        self.say(f"각이 크면 빛이 {o('좁은 면적에 모이고')}, 작으면 넓게 퍼져요",
                 "손전등에서 나오는 빛의 양은 같아요. 각이 크면 좁은 면적에 모이고, 각이 작으면 넓게 퍼져요.")
        self.play(Indicate(a.box, color=ORANGE, scale_factor=1.2), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 여름과 겨울 ──
    def seasons(self):
        self.section("여름과 겨울")
        bgA = RoundedRectangle(corner_radius=0.2, width=6.4, height=4.9, fill_color="#FFF1D6", fill_opacity=1, stroke_width=0).move_to([-3.35, 0.1, 0])
        bgB = RoundedRectangle(corner_radius=0.2, width=6.4, height=4.9, fill_color="#E6EEF8", fill_opacity=1, stroke_width=0).move_to([3.35, 0.1, 0])
        a = K.beam_panel(76, n=8, beam_w=1.4, box_w=1.4, cx=-3.0, y=-1.15, length=2.7, show_count=False, w=5.6)
        b = K.beam_panel(29, n=8, beam_w=1.4, box_w=1.4, cx=3.7, y=-1.15, length=2.7, show_count=False, w=5.6)
        ta = T("여름", 34, K.SUMMER).move_to([-1.2, 2.2, 0])
        tb = T("겨울", 34, K.WINTER).move_to([5.9, 2.2, 0])
        ca = M(f"남중 고도 {o('높아요')} → 에너지양 {o('많아요')}", 26).move_to([-3.35, -1.95, 0])
        cb = M(f"남중 고도 {g('낮아요')} → 에너지양 {g('적어요')}", 26).move_to([3.35, -1.95, 0])
        self.say(f"여름에는 남중 고도가 {o('높아')} 빛이 좁은 면적에 모여요",
                 "여름에는 남중 고도가 높아 태양 빛이 좁은 면적에 모여요. 지표면이 받는 태양 에너지양이 많아요.")
        self.play(FadeIn(bgA), FadeIn(a), FadeIn(ta), run_time=0.8)
        self.play(FadeIn(ca), run_time=0.5)
        self.settle()
        self.say(f"겨울에는 남중 고도가 {g('낮아')} 빛이 넓게 퍼져요",
                 "겨울에는 남중 고도가 낮아 빛이 넓게 퍼져요. 받는 태양 에너지양이 적어요.")
        self.play(FadeIn(bgB), FadeIn(b), FadeIn(tb), run_time=0.8)
        self.play(FadeIn(cb), run_time=0.5)
        self.settle()
        hot = K.text_card([f"그래서 여름은 {r('덥고')}, 겨울은 {g('추워요')}"], size=30).move_to([0, -1.95, 0])
        self.say(f"그래서 여름에는 {r('덥고')} 겨울에는 {g('추워요')}",
                 "그래서 여름에는 지표면이 받는 태양 에너지양이 많아 덥고, 겨울에는 적어 추워요.")
        self.play(FadeOut(ca), FadeOut(cb), FadeIn(hot, scale=0.9), run_time=0.6)
        self.settle()
        clear_stage(self)
        q = K.text_card([f"“여름에는 태양이 빛을 {r('더 많이')} 내서 더워요.”"], size=36).move_to([0, 1.6, 0])
        self.say("이 말은 옳을까요?", "여름에는 태양이 빛을 더 많이 내기 때문에 덥다는 말, 옳을까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.pause_screen(4, "옳을까요?")
        x = K.ox_mark(False, 0.4).next_to(q, LEFT, buff=0.3)
        ans = K.text_card([f"태양에서 나오는 빛의 양은 계절마다 {o('거의 같아요')}",
                           f"달라지는 것은 {g('태양의 남중 고도')}예요"], size=32).move_to([0, -0.5, 0])
        self.say(f"태양이 내는 빛의 양은 계절마다 {o('거의 같아요')}",
                 "옳지 않아요. 태양에서 나오는 빛의 양은 계절마다 거의 같아요. 달라지는 것은 태양의 남중 고도예요.")
        self.play(FadeIn(x), FadeIn(ans), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"태양 고도가 높아질수록 일정한 면적의 지표면이 받는 태양 에너지양이 {o('많아집니다')}.",
                            f"태양 고도가 낮아질수록 일정한 면적의 지표면이 받는 태양 에너지양이 {g('적어집니다')}."], size=30).move_to([0, 0.6, 0])
        self.say(f"태양 고도가 높을수록 받는 태양 에너지양이 {o('많아요')}",
                 "태양 고도가 높아질수록 일정한 면적의 지표면이 받는 태양 에너지양이 많아지고, 낮아질수록 적어져요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
