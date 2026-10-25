"""「과학 원리 돋보기」 3학년 5화 — 동물을 어떻게 분류할까? (3-1 2단원 동물의 생활 2차시, 화 코드 3-1-2-a)

바탕: grade3/science/sem1/u2-1.html — 도입 양말 나누기(색깔·무늬·모양), 분류의 뜻,
동물 카드 12장 관찰(날개·다리·더듬이·지느러미, 「실험관찰」 22쪽 결과 A{}), 공통점과 차이점,
분류 기준 고르기('날개가 있는가?' 등), 세 친구의 '생김새가 귀여운가?'·'다리가 있는가?' 결과(FAIR),
주관적·상대적 표현, 한눈에 쏙(나비·문어·제비·뱀), 형성 평가 1·3.
최종: ./make_final.sh s3ep05
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Write,
                   RoundedRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


ANIMALS = ["토끼", "거미", "문어", "상어", "개미", "뱀", "개구리", "달팽이", "제비", "붕어", "지렁이", "나비"]
FEAT = {  # 날개 w, 다리 l, 더듬이 a, 지느러미 f — 앱 A{}
    "토끼": "l", "거미": "l", "문어": "l", "상어": "f", "개미": "la", "뱀": "", "개구리": "l",
    "달팽이": "a", "제비": "wl", "붕어": "f", "지렁이": "", "나비": "wla"}
SOCKS = [("#e2573f", "stripe", True), ("#e2573f", "none", False), ("#3b77c9", "dot", True), ("#3b77c9", "stripe", False),
         ("#f2b928", "none", True), ("#f2b928", "dot", False), ("#e2573f", "dot", False), ("#3b77c9", "none", True)]
COLNAME = {"#e2573f": "빨간색", "#3b77c9": "파란색", "#f2b928": "노란색"}


class S3Ep05(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 5
    EP_TITLE = "동물을 어떻게 분류할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.socks()
        self.observe()
        self.sort_by("w", "날개가 있는가?", wide=True)
        self.sort_by("l", "다리가 있는가?", wide=False)
        self.fair()
        self.summary()
        self.check()
        self.closing(f"동물은 날개·다리처럼 {o('특징')}에 따라 분류해요\n"
                     f"분류 기준은 {g('누가 분류해도 같은 결과')}가 나와야 해요",
                     next_preview="3학년 6화 · 우리 주변·땅속에 사는 동물")
        self.wait(0.5)

    # ── 양말 나누기 ──
    def socks(self):
        self.section("궁금해요")
        ss = VGroup(*[K.fit(K.sock(c, p, l), 0.9, 1.6 if l else 0.95) for c, p, l in SOCKS])
        for i, s in enumerate(ss):
            s.move_to([-5.6 + i * 1.6, 0.4, 0], aligned_edge=DOWN)
        self.say("빨래를 개다가 양말이 뒤죽박죽 섞였어요", "빨래를 개다가 양말이 뒤죽박죽 섞였어요. 어떻게 나누면 좋을까요?")
        self.play(FadeIn(ss, lag_ratio=0.1), run_time=1.0)
        # 색깔로
        self.say(f"{o('색깔')}을 기준으로 나누어 봐요", "먼저 색깔을 기준으로 나누어 볼게요.")
        groups = ["#e2573f", "#3b77c9", "#f2b928"]
        anims, labels = [], VGroup()
        for gi, col in enumerate(groups):
            idx = [i for i, s in enumerate(SOCKS) if s[0] == col]
            cx = -4.6 + gi * 4.6
            labels.add(T(COLNAME[col], 36, INK).move_to([cx, 2.5, 0]))
            for j, i in enumerate(idx):
                anims.append(ss[i].animate.move_to([cx + (j - (len(idx) - 1) / 2) * 1.15, 0.4, 0], aligned_edge=DOWN))
        divs = VGroup(*[Line([x, -1.0, 0], [x, 2.8, 0], stroke_color=SOFT, stroke_width=3) for x in (-2.3, 2.3)])
        self.play(*anims, run_time=1.2)
        self.play(FadeIn(labels), Create(divs), run_time=0.5)
        # 모양으로
        self.say(f"이번에는 {o('모양')}을 기준으로 나누어 봐요", "이번에는 모양을 기준으로 나누어 볼까요?")
        anims, labels2 = [], VGroup()
        for gi, lng in enumerate((True, False)):
            idx = [i for i, s in enumerate(SOCKS) if s[2] == lng]
            cx = -3.5 + gi * 7.0
            labels2.add(T("목이 긴 양말" if lng else "발목 양말", 36, INK).move_to([cx, 2.5, 0]))
            for j, i in enumerate(idx):
                anims.append(ss[i].animate.move_to([cx + (j - (len(idx) - 1) / 2) * 1.3, 0.4, 0], aligned_edge=DOWN))
        div2 = Line([0, -1.0, 0], [0, 2.8, 0], stroke_color=SOFT, stroke_width=3)
        self.play(FadeOut(labels), FadeOut(divs), *anims, run_time=1.2)
        self.play(FadeIn(labels2), Create(div2), run_time=0.5)
        self.say(f"같은 양말도 {o('기준')}에 따라 다르게 나눌 수 있어요", "같은 양말도 기준에 따라 다르게 나눌 수 있어요.")
        self.settle()
        self.play(FadeOut(VGroup(ss, labels2, div2)), run_time=0.5)
        word = T("분류", 72, self.accent).move_to([0, 1.7, 0])
        card = K.text_card([f"{o('공통점')}과 {o('차이점')}을 알아보고,", f"{g('공통점이 있는 것끼리')} 묶는 활동"], size=44).move_to([0, -0.2, 0])
        self.say(f"{g('분류')}: 공통점이 있는 것끼리 묶는 활동", "이렇게 공통점과 차이점을 알아보고, 공통점이 있는 것끼리 묶는 활동을 분류라고 해요.")
        self.play(FadeIn(word, scale=0.8), FadeIn(card, shift=UP * 0.2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 동물 관찰 ──
    def observe(self):
        self.section("관찰해요")
        cards = VGroup()
        for i, n in enumerate(ANIMALS):
            c = K.card(n, 2.05, 1.85, 30)
            c.move_to([-5.5 + (i % 6) * 2.2, 1.3 - (i // 6) * 2.0, 0])
            cards.add(c)
        self.cards = {n: c for n, c in zip(ANIMALS, cards)}
        self.say("동물 카드 12장을 관찰해요", "동물 카드에 있는 열두 가지 동물을 관찰해 볼게요.")
        self.play(FadeIn(cards, lag_ratio=0.06), run_time=1.6)
        self.say(f"{o('날개')}·{o('다리')}·{o('더듬이')}·{o('지느러미')}가 있는지 살펴봐요",
                 "동물마다 날개, 다리, 더듬이, 지느러미가 있는지 없는지 살펴봐요.")
        self.say("토끼의 긴 귀는 더듬이가 아니에요", "토끼의 긴 귀는 더듬이가 아니에요. 토끼는 다리가 있어요.")
        self.play(Circumscribe(self.cards["토끼"], color=ORANGE), run_time=1.0)
        self.say(f"달팽이의 뿔은 {o('더듬이')}, 문어의 길쭉한 여덟 개는 {o('다리')}", "달팽이 머리에 있는 뿔처럼 생긴 것이 더듬이예요. 그리고 문어의 길쭉한 여덟 개는 다리라고 해요.")
        self.play(Circumscribe(self.cards["달팽이"], color=ORANGE), run_time=1.0)
        self.play(Circumscribe(self.cards["문어"], color=ORANGE), run_time=1.0)
        # 공통점
        pairs = [("개미", "나비", "개미와 나비는 다리와 더듬이가 모두 있어요"),
                 ("제비", "나비", "제비와 나비는 날개가 있어요")]
        for a, b_, txt in pairs:
            self.say(f"{g('공통점')} — {txt}", txt + ".")
            self.play(Indicate(self.cards[a], color=GREEN, scale_factor=1.08),
                      Indicate(self.cards[b_], color=GREEN, scale_factor=1.08), run_time=1.0)
        self.settle()
        self.cardgroup = cards

    # ── 기준으로 나누기 ──
    def sort_by(self, key, question, wide):
        self.section("분류해요")
        cards = self.cardgroup
        q = M(f"분류 기준: {o(question)}", 44).move_to([-0.6, 2.72, 0])
        if wide:
            yb = K.bin_box("○ 그렇다", 3.6, 4.55, GREEN).move_to([-4.95, -0.18, 0])
            nb = K.bin_box("× 그렇지 않다", 9.3, 4.55, RED).move_to([2.1, -0.18, 0])
        else:
            yb = K.bin_box("○ 그렇다", 6.6, 4.55, GREEN).move_to([-3.45, -0.18, 0])
            nb = K.bin_box("× 그렇지 않다", 6.6, 4.55, RED).move_to([3.45, -0.18, 0])
        yes = [n for n in ANIMALS if key in FEAT[n]]
        no = [n for n in ANIMALS if key not in FEAT[n]]
        if wide:
            self.say(f"분류 기준을 {o(question)}로 정해요", f"분류 기준을 {question}로 정해 볼게요.")
            self.play(FadeIn(q), run_time=0.5)
            self.pause_screen(5, "날개가 있는 동물은 어느 것일까요?")
            self.play(cards.animate.scale(0.62).move_to([0.6, 0.4, 0]), run_time=0.8)
            self.play(FadeIn(yb), FadeIn(nb), run_time=0.5)
        else:
            self.say(f"이번에는 {o(question)}로 나누어 봐요", f"이번에는 {question}로 나누어 볼까요?")
            self.play(FadeOut(self.q), FadeIn(q), FadeOut(self.yb), FadeOut(self.nb), FadeIn(yb), FadeIn(nb), run_time=0.7)
        ys = K.slots(yb.box.get_center()[0], 0.65, len(yes), 2 if wide else 4, 1.45, 1.6)
        ns = K.slots(nb.box.get_center()[0], 0.65, len(no), 5 if wide else 4, 1.45, 1.6)
        anims = [self.cards[n].animate.move_to(p) for n, p in zip(yes, ys)]
        anims += [self.cards[n].animate.move_to(p) for n, p in zip(no, ns)]
        self.play(*anims, run_time=1.4, lag_ratio=0.03)
        if wide:
            self.say(f"날개가 있는 동물은 {g('제비')}와 {g('나비')}예요", "날개가 있는 동물은 제비와 나비예요. 나머지 열 마리는 날개가 없어요.")
        else:
            self.say(f"다리가 있는 동물 {g('7마리')}, 없는 동물 {r('5마리')}", "다리가 있는 동물은 토끼, 거미, 문어, 개미, 개구리, 제비, 나비예요. 상어, 뱀, 달팽이, 붕어, 지렁이는 다리가 없어요.")
            self.say(f"같은 동물도 {o('기준')}에 따라 다르게 분류돼요", "같은 동물이라도 어떤 기준으로 나누느냐에 따라 다르게 분류돼요.")
        self.settle()
        self.q, self.yb, self.nb = q, yb, nb
        if not wide:
            clear_stage(self)

    # ── 좋은 분류 기준 ──
    def fair(self):
        self.section("생각해요")
        self.say("세 친구가 같은 기준으로 동물 6마리를 분류했어요",
                 "세 친구가 같은 기준으로 똑같은 동물 여섯 마리를 분류했어요. 결과가 같을까요?")
        six = VGroup(*[K.card(n, 1.6, 1.45, 26) for n in ("토끼", "거미", "개구리", "나비", "뱀", "붕어")]).arrange(RIGHT, buff=0.25)
        six.move_to([0, 0.6, 0])
        self.play(FadeIn(six, lag_ratio=0.1), run_time=1.0)
        q = M(f"기준: {o('생김새가 귀여운가?')}", 44).move_to([-0.6, 2.72, 0])
        self.say(f"먼저 {o('생김새가 귀여운가?')}로 분류해요", "먼저 생김새가 귀여운가로 분류했어요.")
        self.play(FadeIn(q), run_time=0.4)
        self.pause_screen(4, "세 친구의 결과가 같을까요?")
        self.play(six.animate.scale(0.62).move_to([0, 1.75, 0]), run_time=0.6)
        cute = [("민지", "토끼, 개구리, 나비", "뱀, 거미, 붕어"), ("준호", "토끼, 붕어", "뱀, 거미, 개구리, 나비"),
                ("서연", "토끼, 뱀, 거미, 나비", "개구리, 붕어")]
        tbl = self.table(cute)
        self.play(FadeIn(tbl, lag_ratio=0.15), run_time=1.0)
        self.say(f"세 친구의 결과가 {r('모두 달라요')}", "세 친구의 결과가 모두 달라요! 귀여움은 사람마다 다르게 느끼기 때문이에요.")
        self.play(Indicate(tbl[2:], color=RED, scale_factor=1.03), run_time=1.0)
        self.say(f"이번에는 {o('다리가 있는가?')}로 분류해요", "이번에는 다리가 있는가로 분류해 볼까요?")
        q2 = M(f"기준: {o('다리가 있는가?')}", 44).move_to(q)
        leg = [(n, "토끼, 거미, 개구리, 나비", "뱀, 붕어") for n in ("민지", "준호", "서연")]
        tbl2 = self.table(leg)
        self.play(FadeOut(tbl), FadeOut(q), FadeIn(q2), run_time=0.5)
        self.play(FadeIn(tbl2, lag_ratio=0.15), run_time=1.0)
        self.say(f"누가 분류해도 {g('같은 결과')}가 나와요", "이번에는 누가 분류해도 결과가 똑같아요.")
        self.play(Indicate(tbl2[2:], color=GREEN, scale_factor=1.03), run_time=1.0)
        self.settle()
        clear_stage(self)
        c1 = K.text_card([f"{r('주관적인 표현')}  예) 예쁘다, 귀엽다, 무섭다"], size=42).move_to([0, 1.6, 0])
        c2 = K.text_card([f"{r('상대적인 표현')}  예) 짧다, 크다"], size=42).move_to([0, 0.2, 0])
        c3 = M(f"→ 사람마다 결과가 달라서 {r('분류 기준으로 적절하지 않아요')}", 40).move_to([0, -1.25, 0])
        self.say(f"'예쁘다' 같은 {r('주관적인 표현')}은 기준이 될 수 없어요",
                 "예쁘다, 귀엽다와 같은 주관적인 표현은 분류 기준으로 적절하지 않아요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.6)
        self.say(f"'짧다' 같은 {r('상대적인 표현')}도 마찬가지예요",
                 "짧다와 같은 상대적인 표현도 적절하지 않아요. 사람마다 분류 결과가 다르게 나올 수 있기 때문이에요.")
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.6)
        self.play(FadeIn(c3), run_time=0.6)
        self.settle()
        clear_stage(self)

    def table(self, rows):
        x0, x1, x2 = -5.6, -3.0, 2.3
        head = VGroup(T("친구", 32, SOFT).move_to([x0, 0.55, 0]), T("○ 그렇다", 32, GREEN).move_to([(x1 + x2) / 2 - 0.4, 0.55, 0]),
                      T("× 그렇지 않다", 32, RED).move_to([(x2 + 6.6) / 2, 0.55, 0]))
        g_ = VGroup(head)
        for i, (n, a, b_) in enumerate(rows):
            y = -0.2 - i * 0.75
            g_.add(VGroup(T(n, 34, INK).move_to([x0, y, 0]), T(a, 32, INK).move_to([(x1 + x2) / 2 - 0.4, y, 0]),
                          T(b_, 32, INK).move_to([(x2 + 6.6) / 2, y, 0])))
        lines = VGroup(Line([-6.6, 0.18, 0], [6.6, 0.18, 0], stroke_color=SOFT, stroke_width=3),
                       Line([x0 + 0.85, 0.85, 0], [x0 + 0.85, -2.25, 0], stroke_color=SOFT, stroke_width=2),
                       Line([x2 - 0.15, 0.85, 0], [x2 - 0.15, -2.25, 0], stroke_color=SOFT, stroke_width=2))
        return VGroup(lines, *g_)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        self.say(f"나비·문어·제비·뱀을 {o('날개가 있는가?')}로 나누면?", "나비, 문어, 제비, 뱀을 날개가 있는가로 나누면 어떻게 될까요?")
        four = ["나비", "문어", "제비", "뱀"]
        cs = {n: K.card(n, 1.9, 1.7, 30) for n in four}
        row = VGroup(*cs.values()).arrange(RIGHT, buff=0.35).move_to([0, 0.6, 0])
        self.play(FadeIn(row, lag_ratio=0.1), run_time=0.8)
        yb = K.bin_box("○ 날개가 있다", 5.6, 3.3, GREEN).move_to([-3.2, 0.1, 0])
        nb = K.bin_box("× 날개가 없다", 5.6, 3.3, RED).move_to([3.2, 0.1, 0])
        self.play(FadeIn(yb), FadeIn(nb), cs["나비"].animate.move_to([-4.3, -0.25, 0]), cs["제비"].animate.move_to([-2.1, -0.25, 0]),
                  cs["뱀"].animate.move_to([2.1, -0.25, 0]), cs["문어"].animate.move_to([4.3, -0.25, 0]), run_time=1.2)
        self.say(f"날개가 있는 것은 {g('나비, 제비')}, 없는 것은 {r('뱀, 문어')}예요",
                 "날개가 있는 것은 나비와 제비이고, 날개가 없는 것은 뱀과 문어예요.")
        self.settle()
        clear_stage(self)
        c = K.text_card([f"동물은 날개, 다리, 더듬이, 지느러미가 있는지 없는지 등",
                         f"{o('특징')}에 따라 여러 가지 기준을 정해 분류할 수 있어요"], size=40).move_to([0, 1.1, 0])
        c2 = M(f"특징에 따라 분류하면 → {g('동물을 이해하는 데 도움')}이 돼요", 42).move_to([0, -1.0, 0])
        self.say(f"동물은 {o('특징')}에 따라 기준을 정해 분류할 수 있어요",
                 "동물은 날개, 다리, 더듬이, 지느러미가 있는지 없는지 등 특징에 따라 여러 가지 기준을 정해 분류할 수 있어요.")
        self.play(FadeIn(c, shift=UP * 0.2), run_time=0.7)
        self.say(f"이렇게 분류하면 {g('동물을 이해하는 데 도움')}이 돼요", "특징에 따라 동물을 분류하면 동물을 이해하는 데 도움이 돼요.")
        self.play(FadeIn(c2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        self.say(f"동물을 분류하는 기준으로 {r('옳지 않은')} 것은?", "동물을 분류하는 기준으로 옳지 않은 것은 어느 것일까요?")
        opts = ["① 다리가 있는가?", "② 더듬이가 있는가?", "③ 날개가 있는가?", "④ 생김새가 무서운가?", "⑤ 지느러미가 있는가?"]
        ts = VGroup(*[T(s, 42, INK) for s in opts]).arrange(DOWN, buff=0.28, aligned_edge=LEFT).move_to([-0.5, 0.3, 0])
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(5, "옳지 않은 기준은 몇 번일까요?")
        self.play(Circumscribe(ts[3], color=RED), ts[3].animate.set_color(RED), run_time=1.0)
        self.say(f"정답은 ④ — 무서운지는 {r('사람마다 달라요')}", "정답은 4번이에요. 무서운지는 사람마다 다르게 느끼므로 분류 기준으로 적절하지 않아요.")
        self.settle()
        clear_stage(self)
