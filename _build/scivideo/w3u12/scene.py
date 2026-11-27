"""「과학 낱말 사전」 3학년 1학기 2단원 — 동물의 생활

바탕(앱 문장): grade3/science/sem1/u2-1(분류 기준: '분류 기준은 누가 분류해도 같은 결과가 나오는 것으로 정해야 해요',
'“○○이/가 있는가?”처럼 물음으로', 더듬이: '달팽이 머리에 있는 뿔처럼 생긴 것이 더듬이예요', '붕어는 지느러미가 있어요'),
u2-2(허물: '허물은 매미 애벌레 등이 자라면서 벗는 껍질이에요'), u2-3(물갈퀴: '발가락 사이에 물갈퀴가 있어 헤엄을 잘 쳐요', 한눈에 쏙,
지느러미로 헤엄치는 동물), u2-4(극지방 '눈과 빙하로 덮여 있어요', 사막 '낮과 밤의 온도 차이가 크고, 비가 적게 내려 건조해요',
'두꺼운 지방이 있어 체온을 유지해요', 한눈에 쏙), u2-5(흡착판: 둥글고 오목, 문어 빨판의 특징, 한눈에 쏙).
앱에 뜻 문장이 없어 새로 쓴 것: '분류 기준'(동물을 나누는 기준), '물갈퀴'(발가락 사이의 막 — f3ep07과 같은 말).
그림: 모두 다시 씀(f3ep05 socks·snail·butterfly·carp·octopus, f3ep06 exuvia, f3ep07 frog·duck, f3ep08 polar_bear·camel, f3ep09 suction_cup) — 새 그림 없음
미리보기: MEDIA=media_p/w3u12 ./render.sh w3u12 preview
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, g, o
from scikit import RED, clear_stage
import firstkit as F
from wordkit import WordScene, PH_Y, PH_H


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


# 그림 위 자리(원본 1920×1080 픽셀) — 다른 편에서 맞춘 값
P = {
    "snail_ant": (1440, 340),                                   # f3ep05/snail
    "butterfly_ant": (660, 300),                                # f3ep05/butterfly
    "carp_fin_d": (940, 280), "carp_fin_t": (1660, 600),        # f3ep05/carp
    "exu_body": (950, 560), "exu_ant": (955, 110),              # f3ep06/exuvia
    "frog_web": (1210, 845),                                    # f3ep07/frog
    "duck_web": (930, 960),                                     # f3ep07/duck
    "bear_body": (1050, 520),                                   # f3ep08/polar_bear
    "camel_hump": (1150, 150),                                  # f3ep08/camel
    "octo_arm": (780, 880),                                     # f3ep05/octopus
    "cup_center": (930, 480),                                   # f3ep09/suction_cup
}


class W3U12(WordScene):
    GRADE, SEM, UNIT = 3, 1, 2
    EP_TITLE = "동물의 생활"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.today(["분류 기준", "더듬이", "지느러미", "허물", "물갈퀴", "극지방", "사막", "지방", "흡착판"],
                   "오늘 배울 낱말은 분류 기준, 더듬이, 지느러미, 허물, 물갈퀴, 극지방, 사막, 지방, 흡착판이에요.", cols=3)
        self.w_criteria()
        self.w_antenna()
        self.w_fin()
        self.w_exuvia()
        self.w_web()
        self.w_polar_desert()
        self.w_fat()
        self.w_cup()
        self.quiz([
            (["매미 애벌레 등이 자라면서 벗는 껍질"], ["더듬이", "허물", "지느러미", "흡착판"], 1,
             "정답은 2번, 허물이에요. 허물은 매미 애벌레 등이 자라면서 벗는 껍질이에요."),
            (["달팽이 머리에 있는 뿔처럼 생긴 것"], ["물갈퀴", "지느러미", "더듬이", "다리"], 2,
             "정답은 3번, 더듬이예요."),
            (["눈과 빙하로 덮여 있고 매우 추운 곳"], ["사막", "극지방", "갯벌", "땅속"], 1,
             "정답은 2번, 극지방이에요. 사막은 비가 적게 내려 건조한 곳이에요."),
            (["문어 빨판의 특징을 이용해 만든 생활용품"], ["굴착기", "고속 열차", "흡착판", "등산화"], 2,
             "정답은 3번, 흡착판이에요."),
        ])
        self.closing(f"동물은 {o('더듬이')}·{o('지느러미')}·{o('물갈퀴')}처럼\n사는 곳에 {g('알맞은 생김새')}를 가지고 있어요",
                     next_preview="과학 낱말 사전 3학년 · 식물의 생활")
        self.wait(0.5)

    # ── 1 분류 기준 ──
    def w_criteria(self):
        self.word(1, "분류 기준", [f"‘날개가 있는가?’처럼 동물을 나누는 {o('기준')}",
                                   f"누가 분류해도 {g('같은 결과')}가 나오는 것으로 정해야 해요"],
                  f"누가 분류해도 {g('같은 결과')}가 나와야 해요",
                  "‘날개가 있는가?’처럼 동물을 나누는 기준을 분류 기준이라고 해요. 분류 기준은 누가 분류해도 같은 결과가 나오는 것으로 정해야 해요. 분류 기준.")
        self.drop_card()
        ph = F.photo("f3ep05/socks", height=PH_H).move_to([0, PH_Y, 0])
        self.say("섞인 양말을 색깔이나 모양으로 나눌 수 있어요", "섞인 양말도 색깔이나 모양처럼 기준을 정하면 나눌 수 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        self.settle()
        clear_stage(self, keep=(self.head,))
        ok = VGroup(F.name_tag("○ 다리가 있는가?", 46, INK, stroke=GREEN),
                    F.name_tag("○ 더듬이가 있는가?", 46, INK, stroke=GREEN)).arrange(DOWN, buff=0.35)
        no = VGroup(F.name_tag("× 생김새가 귀여운가?", 46, INK, stroke=RED),
                    F.name_tag("× 생김새가 무서운가?", 46, INK, stroke=RED)).arrange(DOWN, buff=0.35)
        VGroup(ok, no).arrange(RIGHT, buff=0.8).move_to([0, 0.1, 0])
        self.say(f"‘귀여운가?’는 사람마다 달라서 {r('알맞지 않아요')}",
                 "다리가 있는가처럼 누가 보아도 같은 기준은 알맞아요. 귀여운가처럼 사람마다 다르게 느끼는 기준은 알맞지 않아요.")
        self.play(FadeIn(ok, lag_ratio=0.3), run_time=0.7)
        self.play(FadeIn(no, lag_ratio=0.3), run_time=0.7)
        self.word_end()

    # ── 2 더듬이 ──
    def w_antenna(self):
        self.word(2, "더듬이", [f"달팽이 머리에 있는 {o('뿔처럼 생긴 것')}이 {o('더듬이')}예요"],
                  f"머리에 뿔처럼 생긴 것 = {o('더듬이')}",
                  "달팽이 머리에 있는 뿔처럼 생긴 것이 더듬이예요. 더듬이.")
        self.drop_card()
        ph = F.photo("f3ep05/snail", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"달팽이의 {o('더듬이')}", "잎 위를 기어가는 달팽이예요. 머리에 더듬이가 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["snail_ant"], "더듬이", to=(1.6, 1.0))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("f3ep05/butterfly", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"나비와 개미도 {o('더듬이')}가 있어요", "나비와 개미도 머리에 더듬이가 있어요. 더듬이.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["butterfly_ant"], "더듬이", to=(-1.8, 0.9))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.word_end()

    # ── 3 지느러미 ──
    def w_fin(self):
        self.word(3, "지느러미", [f"붕어는 {o('지느러미')}가 있어요. 다리는 없어요",
                                  f"붕어, 고등어, 돌고래, 해마는 {o('지느러미')}로 헤엄쳐요"],
                  f"물고기는 {o('지느러미')}로 헤엄쳐요",
                  "붕어는 지느러미가 있고, 다리는 없어요. 붕어, 고등어, 돌고래, 해마는 지느러미로 헤엄쳐요. 지느러미.")
        self.drop_card()
        ph = F.photo("f3ep05/carp", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"붕어 몸에 있는 {o('지느러미')}", "물속에서 헤엄치는 붕어예요. 몸에 지느러미가 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a1, t1 = F.callout(ph, P["carp_fin_d"], "지느러미", to=(-2.4, 0.5))
        a2, t2 = F.callout(ph, P["carp_fin_t"], "지느러미", to=(0.2, -1.5))
        self.play(GrowArrow(a1), GrowArrow(a2), FadeIn(t1), FadeIn(t2), run_time=0.7)
        self.word_end()

    # ── 4 허물 ──
    def w_exuvia(self):
        self.word(4, "허물", [f"{o('허물')}은 매미 애벌레 등이 자라면서 벗는 {o('껍질')}이에요"],
                  f"자라면서 벗는 껍질 = {o('허물')}",
                  "허물은 매미 애벌레 등이 자라면서 벗는 껍질이에요. 허물.")
        self.drop_card()
        ph = F.photo("f3ep06/exuvia", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"매미 애벌레의 {o('허물')}", "매미 애벌레의 허물이에요. 허물을 관찰하면 매미 애벌레의 모습을 알 수 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["exu_body"], "허물", to=(-3.0, 0.5))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.say(f"허물은 {r('쉽게 부서져요')}", "허물은 쉽게 부서져요. 힘을 주어 만지지 않아요.")
        self.word_end()

    # ── 5 물갈퀴 ──
    def w_web(self):
        self.word(5, "물갈퀴", [f"개구리, 오리, 수달은 발가락 사이에 {o('물갈퀴')}가 있어",
                                f"물을 {o('더 많이 밀어 내')} 물속에서 {g('빠르게')} 움직일 수 있어요"],
                  f"발가락 사이의 {o('물갈퀴')}로 헤엄쳐요",
                  "개구리, 오리, 수달은 발가락 사이에 물갈퀴가 있어요. 물갈퀴가 있으면 물을 더 많이 밀어 내, 물속에서 빠르게 움직일 수 있어요. 물갈퀴.")
        self.drop_card()
        p1 = F.photo("f3ep07/frog", width=6.3).move_to([-3.35, 0.0, 0])
        p2 = F.photo("f3ep07/duck", width=6.3).move_to([3.35, 0.0, 0])
        c1 = F.caption(p1, "개구리", 36)
        c2 = F.caption(p2, "오리", 36)
        self.say(f"개구리와 오리의 발에 있는 {o('물갈퀴')}", "개구리의 뒷발과 오리의 발을 보세요. 발가락 사이에 물갈퀴가 있어요.")
        self.play(FadeIn(p1), FadeIn(p2), FadeIn(c1), FadeIn(c2), run_time=0.8)
        r1 = F.ring(p1, P["frog_web"], r=0.45)
        r2 = F.ring(p2, P["duck_web"], r=0.45)
        self.play(Create(r1), Create(r2), run_time=0.6)
        self.word_end()

    # ── 6·7 극지방 · 사막 (헷갈리는 짝) ──
    def w_polar_desert(self):
        self.word(6, "극지방", [f"{o('극지방')}은 눈과 빙하로 덮여 있고 {o('매우 추워요')}"],
                  f"눈과 빙하로 덮인 추운 곳 = {o('극지방')}",
                  "극지방은 눈과 빙하로 덮여 있고 매우 추워요. 극지방.")
        self.drop_card()
        self.play(FadeOut(self.head), run_time=0.3)
        self.section("낱말 7")
        big = T("사막", 120, self.accent).move_to([0, 0.5, 0])
        self.say(o("사막"), "사막.")
        self.play(FadeIn(big, scale=0.7), run_time=0.6)
        card = __import__("wordkit").text_card([f"{o('사막')}은 비가 적게 내려 {o('건조')}하고, 낮과 밤의 온도 차이가 커요"])
        card.move_to([0, -1.0, 0])
        self.say(f"비가 적게 내려 건조한 곳 = {o('사막')}", "사막은 비가 적게 내려 건조하고, 낮과 밤의 온도 차이가 커요. 사막.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        self.play(FadeOut(big), FadeOut(card), run_time=0.4)
        p1 = F.photo("f3ep08/polar_bear", width=6.3).move_to([-3.35, 0.35, 0])
        p2 = F.photo("f3ep08/camel", width=6.3).move_to([3.35, 0.35, 0])
        c1 = F.name_tag("극지방", 44, INK, stroke=BLUE).next_to(p1.frame, DOWN, buff=0.2)
        c2 = F.name_tag("사막", 44, INK, stroke=ORANGE).next_to(p2.frame, DOWN, buff=0.2)
        self.say(f"{b_('극지방')}은 춥고, {o('사막')}은 건조해요",
                 "헷갈리지 않게 비교해 봐요. 극지방은 눈과 빙하로 덮여 매우 춥고, 사막은 비가 적게 내려 건조해요.")
        self.play(FadeIn(p1), FadeIn(p2), run_time=0.8)
        self.play(FadeIn(c1), FadeIn(c2), run_time=0.5)
        self.say(f"사막은 기온이 아니라 {o('비의 양')}으로 나눠요",
                 "사막을 나누는 기준은 기온이 아니라 비의 양이에요. 비가 적게 오는 곳을 사막이라고 해요.")
        self.word_end()

    # ── 8 지방 ──
    def w_fat(self):
        self.word(8, "지방", [f"북극곰은 두꺼운 {o('지방')}이 있어 {o('체온')}을 유지하기에 좋아요"],
                  f"두꺼운 {o('지방')}으로 {o('체온')}을 유지해요",
                  "극지방에 사는 동물의 몸에 있는 두꺼운 지방은 추위를 견디게 도와줘요. 북극곰은 두꺼운 지방이 있어 체온을 유지하기에 좋아요. 지방.")
        self.drop_card()
        ph = F.photo("f3ep08/polar_bear", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"지방은 몸의 따뜻함이 {o('빠져나가는 것을 막아')} 줘요",
                 "지방이 스스로 열을 내는 것이 아니에요. 두꺼운 지방이 몸의 따뜻함이 밖으로 빠져나가는 것을 막아 체온을 유지하게 도와줘요.")
        self.play(FadeIn(ph), run_time=0.7)
        rg = F.ring(ph, P["bear_body"], rx=2.4, ry=1.3)
        self.play(Create(rg), run_time=0.6)
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("f3ep08/camel", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"낙타는 등의 {o('혹')}에 지방을 저장해요",
                 "사막에 사는 낙타는 등의 혹에 지방을 저장해, 물과 먹이가 없어도 며칠 동안 살 수 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["camel_hump"], "혹", to=(1.8, -0.2))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.word_end()

    # ── 9 흡착판 ──
    def w_cup(self):
        self.word(9, "흡착판", [f"{o('흡착판')}은 둥글고 오목한 모양이고, 거울이나 벽에 잘 붙어요",
                                f"흡착판은 {o('문어 빨판')}의 특징을 이용해 만든 것이에요"],
                  f"문어 빨판을 본뜬 {o('흡착판')}",
                  "흡착판은 둥글고 오목한 모양이고, 거울이나 벽에 잘 붙어요. 흡착판은 다른 물체에 잘 붙는 문어 빨판의 특징을 이용해 만든 것이에요. 흡착판.")
        self.drop_card()
        p1 = F.photo("f3ep09/suction_cup", width=6.3).move_to([-3.35, 0.0, 0])
        p2 = F.photo("f3ep05/octopus", width=6.3).move_to([3.35, 0.0, 0])
        c1 = F.caption(p1, "흡착판", 36)
        c2 = F.caption(p2, "문어의 빨판", 36)
        self.say(f"{o('흡착판')} ← 문어의 빨판", "흡착판과 문어의 빨판을 나란히 보세요. 흡착판.")
        self.play(FadeIn(p1), FadeIn(p2), FadeIn(c1), FadeIn(c2), run_time=0.8)
        r2 = F.ring(p2, P["octo_arm"], r=0.5)
        self.play(Create(r2), run_time=0.5)
        self.word_end()


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


class w3u12(W3U12):
    """render.sh가 폴더 이름 그대로 장면을 부름"""
    pass
