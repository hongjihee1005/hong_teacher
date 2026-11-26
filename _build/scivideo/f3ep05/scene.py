"""「처음 배우는 과학」 3학년 5화 — 동물을 어떻게 분류할까? (3-1 2단원 동물의 생활 2차시, 화 코드 3-1-2-a)

바탕: grade3/science/sem1/u2-1.html — 도입 양말 나누기(색깔·무늬·모양)와 분류의 뜻,
동물 카드 12장 관찰(날개·다리·더듬이·지느러미, 앱 A{} 도움말), 공통점과 차이점(3개 고르기),
분류 기준으로 나누기, 세 친구의 '생김새가 귀여운가?'·'다리가 있는가?' 결과(FAIR), 적절한 기준 카드(JUD),
주관적·상대적 표현, 특징에 따른 분류, 형성 평가 1·3. (동물별 특징 표·한눈에 쏙은 길이 때문에 뺌)
실제 그림: photos/f3ep05/ (캔바 AI, README.md)
최종: TTS_SPEED=1.0 ./make_voice.sh f3ep05
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, Create, FadeIn, FadeOut, GrowArrow, Indicate, Line,
                   VGroup, Group)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u12 as K
import firstkit as F


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


ANIMALS = ["토끼", "거미", "문어", "상어", "개미", "뱀", "개구리", "달팽이", "제비", "붕어", "지렁이", "나비"]
FEAT = {  # 날개 w, 다리 l, 더듬이 a, 지느러미 f — 앱 A{}
    "토끼": "l", "거미": "l", "문어": "l", "상어": "f", "개미": "la", "뱀": "", "개구리": "l",
    "달팽이": "a", "제비": "wl", "붕어": "f", "지렁이": "", "나비": "wla"}
SOCKS = [("#e2573f", "stripe", True), ("#e2573f", "none", False), ("#3b77c9", "dot", True), ("#3b77c9", "stripe", False),
         ("#f2b928", "none", True), ("#f2b928", "dot", False), ("#e2573f", "dot", False), ("#3b77c9", "none", True)]
COLNAME = {"#e2573f": "빨간색", "#3b77c9": "파란색", "#f2b928": "노란색"}
PATNAME = {"stripe": "줄무늬", "dot": "물방울무늬", "none": "무늬 없음"}

# 그림 위 자리(원본 1920×1080 픽셀) — 그림을 열어 보고 적음
P = {
    "swallow_wingL": (600, 300), "swallow_wingR": (1360, 760), "swallow_beak": (1170, 436),
    "butterfly_wing": (1210, 250), "butterfly_ant": (660, 300), "butterfly_leg": (780, 540),
    "rabbit_leg": (700, 940), "rabbit_ear": (780, 140), "rabbit_fur": (1160, 640),
    "snail_ant": (1440, 340),
    "carp_fin_d": (940, 280), "carp_fin_t": (1660, 600), "carp_fin_p": (620, 740),
    "octo_arm": (780, 880),
}


class F3Ep05(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 5
    EP_TITLE = "동물을 어떻게 분류할까?"
    SERIES = "처음 배우는 과학"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.wonder()
        self.words()
        self.observe()
        self.sort_by("w", "날개가 있는가?", wide=True)
        self.sort_by("l", "다리가 있는가?", wide=False)
        self.fair()
        self.concept()
        self.check()
        self.life()
        self.closing(f"동물은 날개·다리처럼 {o('특징')}에 따라 분류해요\n"
                     f"분류 기준은 {g('누가 분류해도 같은 결과')}가 나와야 해요",
                     next_preview="처음 배우는 과학 3학년 6화 · 우리 주변·땅속에 사는 동물")
        self.wait(0.5)

    # ── 궁금해요: 양말 ──
    def wonder(self):
        self.section("궁금해요")
        ph = F.photo("f3ep05/socks", height=5.2).move_to([0, 0.35, 0])
        self.say("빨래를 개다가 양말이 뒤죽박죽 섞였어요", "빨래를 개다가 양말이 뒤죽박죽 섞였어요.")
        self.play(FadeIn(ph, scale=0.95), run_time=0.9)
        self.say("양말의 색깔도, 무늬도, 길이도 모두 달라요", "자세히 보세요. 양말의 색깔도 다르고, 무늬도 다르고, 길이도 달라요.")
        self.say(f"양말을 {o('어떻게 나누면')} 좋을까요?", "이 양말들을 어떻게 나누면 좋을까요?")
        self.pause_screen(5, "양말을 어떻게 나눌까요?")
        clear_stage(self)
        ss = VGroup(*[K.fit(K.sock(c, p, l), 0.9, 1.6 if l else 0.95) for c, p, l in SOCKS])
        for i, s in enumerate(ss):
            s.move_to([-5.6 + i * 1.6, 0.4, 0], aligned_edge=DOWN)
        self.play(FadeIn(ss, lag_ratio=0.1), run_time=1.0)
        self._sock_split(ss, "색깔", lambda s: s[0], ["#e2573f", "#3b77c9", "#f2b928"], COLNAME,
                         "먼저 색깔을 기준으로 나누어 볼게요. 빨간색, 파란색, 노란색끼리 모여요.")
        self._sock_split(ss, "모양", lambda s: s[2], [True, False], {True: "목이 긴 양말", False: "발목 양말"},
                         "이번에는 모양을 기준으로 나누어 볼까요? 목이 긴 양말과 발목 양말로 나뉘어요.")
        self.say(f"같은 양말도 {o('기준')}에 따라 다르게 나뉘어요", "같은 양말이라도 무엇을 기준으로 하느냐에 따라 다르게 나뉘어요.")
        self.settle()
        clear_stage(self)
        word = T("분류", 96, self.accent).move_to([0, 1.8, 0])
        card = K.text_card([f"{o('공통점')}과 {o('차이점')}을 알아보고,", f"{g('공통점이 있는 것끼리')} 묶는 활동"], size=46).move_to([0, -0.3, 0])
        self.say(f"{g('분류')}: 공통점이 있는 것끼리 묶는 활동",
                 "이렇게 공통점과 차이점을 알아보고, 공통점이 있는 것끼리 묶는 활동을 분류라고 해요. 분류.")
        self.play(FadeIn(word, scale=0.8), run_time=0.6)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.say(f"나누는 까닭이 되는 것은 {o('분류 기준')}이에요",
                 "그리고 색깔이나 모양처럼 무엇으로 나눌지 정한 것을 분류 기준이라고 해요. 분류 기준.")
        self.settle()
        clear_stage(self)

    def _sock_split(self, ss, name, key, groups, names, narr):
        self.say(f"{o(name)}을 기준으로 나누어 봐요" if name != "무늬" else f"{o(name)}를 기준으로 나누어 봐요", narr)
        for m in list(getattr(self, "_sock_extra", [])):
            self.remove(m)
        n = len(groups)
        span = 13.2 / n
        anims, labels, divs = [], VGroup(), VGroup()
        for gi, gv in enumerate(groups):
            idx = [i for i, s in enumerate(SOCKS) if key(s) == gv]
            cx = -6.6 + span * (gi + 0.5)
            labels.add(T(names[gv], 36, INK).move_to([cx, 2.45, 0]))
            dx = min(1.15, (span - 0.6) / max(len(idx) - 1, 1)) if len(idx) > 1 else 0
            for j, i in enumerate(idx):
                anims.append(ss[i].animate.move_to([cx + (j - (len(idx) - 1) / 2) * dx, 0.4, 0], aligned_edge=DOWN))
            if gi:
                divs.add(Line([-6.6 + span * gi, -1.0, 0], [-6.6 + span * gi, 2.8, 0], stroke_color=SOFT, stroke_width=3))
        old = getattr(self, "_sock_lab", None)
        if old is not None:
            self.play(FadeOut(old), *anims, run_time=1.2)
        else:
            self.play(*anims, run_time=1.2)
        new = VGroup(labels, divs)
        self.play(FadeIn(labels), Create(divs), run_time=0.5)
        self._sock_lab = new

    # ── 새 낱말: 날개·다리·더듬이·지느러미 ──
    def words(self):
        self.section("새 낱말")
        self.say("동물을 나누려면 동물의 몸을 잘 보아야 해요", "동물을 나누려면 먼저 동물의 몸을 잘 살펴보아야 해요. 낱말 네 개를 알아볼게요.")
        names = VGroup(*[name for name in (F.name_tag(w, 52, INK, stroke=self.accent) for w in ("날개", "다리", "더듬이", "지느러미"))])
        names.arrange(RIGHT, buff=0.6).move_to([0, 0.4, 0])
        self.play(FadeIn(names, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)
        # 날개 — 제비
        ph = F.photo("f3ep05/swallow", height=5.2).move_to([0, 0.35, 0])
        self.say("하늘을 나는 제비예요", "하늘을 나는 제비예요.")
        self.play(FadeIn(ph), run_time=0.7)
        t1 = F.name_tag("날개", 40, INK, stroke=ORANGE).move_to([2.6, 2.3, 0])
        t1.set_z_index(5)
        a1 = F.arrow(t1.get_left() + RIGHT * 0.1, ph.at(*P["swallow_wingL"]))
        a2 = F.arrow(t1.get_right() + LEFT * 0.1, ph.at(*P["swallow_wingR"]))
        self.say(f"양쪽으로 펼친 이것이 {o('날개')}예요", "양쪽으로 활짝 펼친 이것이 날개예요. 날개.")
        self.play(GrowArrow(a1), GrowArrow(a2), FadeIn(t1), run_time=0.8)
        self.settle()
        clear_stage(self)
        # 다리 — 토끼
        ph = F.photo("f3ep05/rabbit", height=5.2).move_to([0, 0.35, 0])
        self.say("풀밭에 앉은 토끼예요", "풀밭에 앉은 토끼예요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["rabbit_leg"], "다리", to=(-2.2, 0.6))
        self.say(f"몸을 받치고 걷거나 뛰는 이것이 {o('다리')}예요", "몸을 받치고, 걷거나 뛸 때 쓰는 이것이 다리예요. 다리.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        a3, t3 = F.callout(ph, P["rabbit_ear"], "귀", to=(2.2, 0.4), color=SOFT)
        self.say(f"토끼의 긴 귀는 {r('더듬이가 아니에요')}", "토끼 머리에 있는 긴 것은 귀예요. 토끼의 긴 귀는 더듬이가 아니에요.")
        self.play(GrowArrow(a3), FadeIn(t3), run_time=0.7)
        self.settle()
        clear_stage(self)
        # 더듬이 — 달팽이
        ph = F.photo("f3ep05/snail", height=5.2).move_to([0, 0.35, 0])
        self.say("잎 위를 기어가는 달팽이예요", "잎 위를 천천히 기어가는 달팽이예요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["snail_ant"], "더듬이", to=(1.6, 1.0))
        rg = F.ring(ph, P["snail_ant"], r=0.75)
        self.say(f"머리에 뿔처럼 생긴 것이 {o('더듬이')}예요", "달팽이 머리에 뿔처럼 생긴 것이 보이나요? 이것이 더듬이예요. 더듬이.")
        self.play(Create(rg), run_time=0.6)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say("달팽이는 다리가 없어요", "달팽이는 더듬이가 있지만, 다리는 없어요.")
        self.settle()
        clear_stage(self)
        # 지느러미 — 붕어
        ph = F.photo("f3ep05/carp", height=5.2).move_to([0, 0.35, 0])
        self.say("물속에서 헤엄치는 붕어예요", "물속에서 헤엄치는 붕어예요.")
        self.play(FadeIn(ph), run_time=0.7)
        arrs, tag = [], None
        for k, to in (("carp_fin_d", (1.6, 1.0)), ("carp_fin_t", (0.3, 1.8)), ("carp_fin_p", (-1.2, -1.2))):
            a, t = F.callout(ph, P[k], "지느러미", to=to)
            arrs.append((a, t))
        self.say(f"몸에 붙은 얇은 막 같은 것이 {o('지느러미')}예요", "붕어 몸에 붙은 얇은 부채 같은 것이 지느러미예요. 지느러미.")
        self.play(*[GrowArrow(a) for a, _ in arrs], *[FadeIn(t) for _, t in arrs], run_time=0.9)
        self.say(f"붕어는 {o('지느러미')}로 헤엄쳐요. 다리는 없어요", "붕어는 지느러미를 움직여 헤엄쳐요. 붕어는 다리가 없어요.")
        self.settle()
        clear_stage(self)
        # 문어 — 다리
        ph = F.photo("f3ep05/octopus", height=5.2).move_to([0, 0.35, 0])
        self.say("바닷속에 사는 문어예요", "바닷속에 사는 문어예요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["octo_arm"], "다리", to=(-2.2, 0.9))
        self.say(f"문어의 길쭉한 여덟 개를 {o('다리')}라고 해요", "문어의 길쭉한 여덟 개를 다리라고 해요. 문어는 지느러미가 없어요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 탐구: 동물 카드 관찰 ──
    def observe(self):
        self.section("관찰해요")
        cards = VGroup()
        for i, n in enumerate(ANIMALS):
            c = K.card(n, 2.05, 1.85, 30)
            c.move_to([-5.5 + (i % 6) * 2.2, 1.55 - (i // 6) * 2.0, 0])
            cards.add(c)
        self.cards = {n: c for n, c in zip(ANIMALS, cards)}
        self.say("동물 카드 12장을 관찰해요", "이제 동물 카드에 있는 열두 가지 동물을 관찰해 볼게요.")
        self.play(FadeIn(cards, lag_ratio=0.06), run_time=1.6)
        self.say(f"{o('날개')}·{o('다리')}·{o('더듬이')}·{o('지느러미')}가 있는지 살펴봐요",
                 "동물마다 날개, 다리, 더듬이, 지느러미가 있는지 없는지 하나씩 살펴봐요.")
        self.settle()
        # 공통점 고르기
        self.say(f"관찰한 내용으로 {g('옳은 것')}을 골라요", "관찰한 내용으로 옳은 것을 골라 볼까요?")
        opts = ["개미와 나비는 다리와 더듬이가 모두 있어요.", "뱀과 지렁이는 다리가 있어요.", "상어와 붕어는 지느러미가 있어요.",
                "달팽이는 날개가 있어요.", "제비와 나비는 날개가 있어요.", "토끼와 거미는 더듬이가 있어요."]
        self.play(cards.animate.set_opacity(0.15), run_time=0.4)
        ts = VGroup(*[T(f"{'①②③④⑤⑥'[i]} {s}", 38, INK) for i, s in enumerate(opts)]).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
        ts.move_to([0, 0.3, 0])
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(6, "옳은 것 세 개를 찾아봐요")
        ok = [0, 2, 4]
        self.play(*[ts[i].animate.set_color(GREEN) for i in ok], *[ts[i].animate.set_opacity(0.35) for i in range(6) if i not in ok], run_time=0.8)
        self.say(f"옳은 것은 {g('①, ③, ⑤')}예요", "옳은 것은 1번, 3번, 5번이에요.")
        self.say(f"같은 점은 {g('공통점')}, 다른 점은 {o('차이점')}이에요",
                 "이렇게 같은 점을 공통점, 다른 점을 차이점이라고 해요.")
        self.settle()
        self.play(FadeOut(ts), cards.animate.set_opacity(1), run_time=0.6)
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
            self.say(f"분류 기준을 {o(question)}로 정해요", f"분류 기준을 {question}로 정해 볼게요. 날개가 있으면 그렇다, 없으면 그렇지 않다 쪽에 놓아요.")
            self.play(FadeIn(q), run_time=0.5)
            self.pause_screen(5, "날개가 있는 동물은 어느 것일까요?")
            self.play(cards.animate.scale(0.62).move_to([0.6, 0.4, 0]), run_time=0.8)
            self.play(FadeIn(yb), FadeIn(nb), run_time=0.5)
        else:
            self.say(f"이번에는 {o(question)}로 나누어 봐요", f"이번에는 분류 기준을 {question}로 바꾸어 볼까요?")
            self.play(FadeOut(self.q), FadeIn(q), run_time=0.5)
            self.pause_screen(5, "다리가 있는 동물은 몇 마리일까요?")
            self.play(FadeOut(self.yb), FadeOut(self.nb), FadeIn(yb), FadeIn(nb), run_time=0.7)
        ys = K.slots(yb.box.get_center()[0], 0.65, len(yes), 2 if wide else 4, 1.45, 1.6)
        ns = K.slots(nb.box.get_center()[0], 0.65, len(no), 5 if wide else 4, 1.45, 1.6)
        anims = [self.cards[n].animate.move_to(p) for n, p in zip(yes, ys)]
        anims += [self.cards[n].animate.move_to(p) for n, p in zip(no, ns)]
        self.play(*anims, run_time=1.6, lag_ratio=0.03)
        if wide:
            self.say(f"날개가 있는 동물은 {g('제비')}와 {g('나비')}예요", "날개가 있는 동물은 제비와 나비예요. 나머지 열 마리는 날개가 없어요.")
        else:
            self.say(f"다리가 있는 동물 {g('7마리')}, 없는 동물 {r('5마리')}",
                     "다리가 있는 동물은 토끼, 거미, 문어, 개미, 개구리, 제비, 나비, 일곱 마리예요. 상어, 뱀, 달팽이, 붕어, 지렁이는 다리가 없어요.")
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
        self.pause_screen(5, "세 친구의 결과가 같을까요?")
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
        self.say(f"세 친구의 결과가 {g('모두 같아요')}", "세 친구의 결과가 모두 같아요! 다리가 있는지 없는지는 누가 보아도 똑같이 알 수 있어요. 이런 기준이 적절한 분류 기준이에요.")
        self.play(Indicate(tbl2[2:], color=GREEN, scale_factor=1.03), run_time=1.0)
        self.settle()
        clear_stage(self)
        c1 = K.text_card([f"{r('주관적인 표현')}  예) 예쁘다, 귀엽다, 무섭다"], size=42).move_to([0, 1.6, 0])
        c2 = K.text_card([f"{r('상대적인 표현')}  예) 짧다, 크다"], size=42).move_to([0, 0.2, 0])
        c3 = M(f"→ 사람마다 결과가 달라서 {r('분류 기준으로 적절하지 않아요')}", 40).move_to([0, -1.25, 0])
        self.say(f"'예쁘다' 같은 {r('주관적인 표현')}은 기준이 될 수 없어요",
                 "예쁘다, 귀엽다와 같이 사람마다 느낌이 다른 주관적인 표현은 분류 기준으로 적절하지 않아요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.6)
        self.say(f"'짧다' 같은 {r('상대적인 표현')}도 마찬가지예요",
                 "짧다, 크다와 같은 상대적인 표현도 무엇과 비교하는지에 따라 달라서 적절하지 않아요. 사람마다 분류 결과가 다르게 나올 수 있기 때문이에요.")
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

    # ── 개념 정리: 나비 한 장에 특징 셋 ──
    def concept(self):
        self.section("정리해요")
        ph = F.photo("f3ep05/butterfly", height=5.0).move_to([-1.6, 0.4, 0])
        self.say("나비를 다시 자세히 볼까요?", "나비를 다시 자세히 볼까요?")
        self.play(FadeIn(ph), run_time=0.7)
        items = [("butterfly_wing", "날개", (4.0, 0.3)), ("butterfly_ant", "더듬이", (-1.4, 0.9)), ("butterfly_leg", "다리", (-2.2, -0.6))]
        for k, nm, to in items:
            a, t = F.callout(ph, P[k], nm, to=to)
            self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.say(f"나비는 {o('날개')}·{o('다리')}·{o('더듬이')}가 모두 있어요", "나비는 날개, 다리, 더듬이가 모두 있어요. 이런 것을 동물의 특징이라고 해요.")
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
        # 형성 평가 1
        self.say(f"동물을 분류하는 기준으로 {r('옳지 않은')} 것은?", "동물을 분류하는 기준으로 옳지 않은 것은 어느 것일까요?")
        opts = ["① 다리가 있는가?", "② 더듬이가 있는가?", "③ 날개가 있는가?", "④ 생김새가 무서운가?", "⑤ 지느러미가 있는가?"]
        ts = VGroup(*[T(s, 42, INK) for s in opts]).arrange(DOWN, buff=0.28, aligned_edge=LEFT).move_to([-0.5, 0.3, 0])
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(5, "옳지 않은 기준은 몇 번일까요?")
        self.play(Circumscribe(ts[3], color=RED), ts[3].animate.set_color(RED), run_time=1.0)
        self.say(f"정답은 ④ — 무서운지는 {r('사람마다 달라요')}", "정답은 4번이에요. 무서운지는 사람마다 다르게 느끼므로 분류 기준으로 적절하지 않아요.")
        self.settle()
        clear_stage(self)
        # 형성 평가 3
        q = K.text_card(["“분류 기준은 누가 분류해도", "같은 결과가 나오는 것으로 정해야 해요.”"], size=46).move_to([0, 1.0, 0])
        ox = VGroup(K.ox_mark(True, 0.55), K.ox_mark(False, 0.55)).arrange(RIGHT, buff=2.4).move_to([0, -1.3, 0])
        self.say(f"맞으면 ○, 틀리면 ×를 골라요", "이 말이 맞으면 동그라미, 틀리면 가위표를 골라 보세요.")
        self.play(FadeIn(q, shift=UP * 0.2), FadeIn(ox), run_time=0.8)
        self.pause_screen(5, "○일까요, ×일까요?")
        self.play(Indicate(ox[0], color=GREEN, scale_factor=1.3), ox[1].animate.set_opacity(0.25), run_time=1.0)
        self.say(f"정답은 {g('○')} — 누가 해도 같은 결과가 나와야 해요", "정답은 동그라미예요. 분류 기준은 누가 분류해도 같은 결과가 나오는 것으로 정해야 해요.")
        self.settle()
        clear_stage(self)

    # ── 더 알아보기: 다른 기준 ──
    def life(self):
        self.section("더 알아보기")
        self.say(f"다른 기준으로도 분류할 수 있어요", "날개, 다리, 더듬이, 지느러미 말고 다른 기준으로도 분류할 수 있어요.")
        p1 = F.photo("f3ep05/swallow", width=6.3).move_to([-3.45, 0.55, 0])
        p2 = F.photo("f3ep05/rabbit", width=6.3).move_to([3.45, 0.55, 0])
        self.play(FadeIn(p1), FadeIn(p2), run_time=0.8)
        a1, t1 = F.callout(p1, P["swallow_beak"], "부리가 있는가?", to=(0.0, -2.6), size=34)
        self.say(f"{o('부리가 있는가?')}", "부리가 있는가?")
        self.play(GrowArrow(a1), FadeIn(t1), run_time=0.7)
        a2, t2 = F.callout(p2, P["rabbit_fur"], "몸이 털로 덮여 있는가?", to=(0.0, -1.95), size=34)
        self.say(f"{o('몸이 털로 덮여 있는가?')}", "몸이 털로 덮여 있는가? 이런 기준도 쓸 수 있어요.")
        self.play(GrowArrow(a2), FadeIn(t2), run_time=0.7)
        self.say(f"누가 보아도 {g('똑같이 알 수 있는')} 기준을 골라요", "꼬리가 있는가처럼, 누가 보아도 똑같이 알 수 있는 기준을 골라 동물을 분류해 보세요.")
        self.settle()
        clear_stage(self)
