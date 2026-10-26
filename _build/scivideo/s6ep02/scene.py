"""「과학 원리 돋보기」 6학년 2화 — 지시약으로 분류하기 (6-1 1단원 산과 염기 2~3차시, 화 코드 6-1-1-b)

바탕: grade6/science/sem1/u1-2.html(원본 _build_tb/src/u1-2.html) — 도입(색깔 없고 투명한 용액, 지시약의 뜻),
실험 ①(홈판에 용액 ⅓씩, 반으로 자른 푸른색·붉은색 리트머스 시험지), 실험 ②(페놀프탈레인 용액 한두 방울),
정리(산성 용액·염기성 용액 표, 앱 스크립트의 결과), 붉은 양배추 용액 만들기(자르기·뜨거운 물·거르기·점적병 — 뜨거운 물은 선생님과),
실험 ③(붉은 양배추 용액 다섯 방울: 식초·레몬즙·묽은 염산 붉은색, 빨랫비누 물·석회수 푸른색, 묽은 수산화 나트륨 용액 노란색),
색깔 변화표(산성 붉은색 계열 / 염기성 푸른색·노란색 계열, 비슷한 계열로 분류), 우리 주변의 용액, 한눈에 쏙.
최종: ./make_final.sh s6ep02
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Rotate, LaggedStart,
                   RoundedRectangle, SurroundingRectangle, AnimationGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from scikit import RED, clear_stage
import kit_s6u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def pk(s):
    return f'<span foreground="{K.PINK}">{s}</span>'


NAMES = [s_["sh"] for s_ in K.SOL]


class S6Ep02(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 2
    EP_TITLE = "지시약으로 분류하기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.litmus()
        self.phenol()
        self.table()
        self.cabbage()
        self.life()
        self.summary()
        self.closing(f"지시약의 색깔 변화로 용액을\n{r('산성 용액')}과 {b('염기성 용액')}으로 분류할 수 있어요",
                     next_preview="6학년 3화 · 산성 용액과 염기성 용액의 성질")
        self.wait(0.5)

    def plate(self, y=0.75):
        P_ = K.SpotPlate(6, 1, gap=2.15, r=0.66, center=(0, y), names=NAMES, size=24)
        return P_

    def fill(self, P_):
        anims = []
        for i, s_ in enumerate(K.SOL):
            anims.append(P_.liq[i].animate.set_fill(s_["c"], opacity=max(0.6, s_["op"])))
        return anims

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        bots = VGroup(*[K.dropper_bottle(None, 1.3, col=K.CLEAR, op=0.5) for _ in range(3)]).arrange(RIGHT, buff=1.4)
        bots.move_to([0, 0.9, 0])
        qs = VGroup(*[T("?", 60, SOFT).move_to(b_[0]) for b_ in bots])
        self.say("색깔이 없고 투명한 용액은 어떻게 분류할까요?",
                 "색깔이 없고 투명해서 겉보기로 구별하기 어려운 용액은 어떻게 분류할 수 있을까요?")
        self.play(FadeIn(bots, lag_ratio=0.15), FadeIn(qs), run_time=0.9)
        card = K.text_card([f"{o('지시약')}: 어떤 용액을 만났을 때 그 용액의 성질에 따라",
                            "색깔이 변하는 물질"], w=12.4, size=34).move_to([0, -1.3, 0])
        self.say(f"용액의 성질에 따라 색깔이 변하는 물질, {o('지시약')}",
                 "용액의 성질에 따라 색깔이 변하는 물질을 넣어 봐요. 이런 물질을 지시약이라고 해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 실험 ① 리트머스 ──
    def litmus(self):
        self.section("실험해요 ①")
        P_ = self.plate()
        self.say("홈판의 각 홈에 용액을 ⅓ 정도씩 넣어요",
                 "홈판의 각 홈에 여섯 가지 용액을 3분의 1 정도씩 넣어요. 용액이 다른 홈에 들어가지 않게 조심해요.")
        self.play(FadeIn(P_.group), FadeIn(P_.names), run_time=0.7)
        self.play(*self.fill(P_), run_time=0.8)
        blue = VGroup(*[K.litmus(K.LIT_B).rotate(-0.2).move_to(P_.center(i) + [-0.2, 0.3, 0]) for i in range(6)])
        red = VGroup(*[K.litmus(K.LIT_R).rotate(0.2).move_to(P_.center(i) + [0.2, 0.3, 0]) for i in range(6)])
        self.say(f"{b('푸른색')}과 {r('붉은색')} 리트머스 시험지를 넣어요",
                 "리트머스 시험지를 반으로 잘라, 푸른색과 붉은색 리트머스 시험지를 핀셋으로 각 홈에 넣어요.")
        self.play(LaggedStart(*[FadeIn(x, shift=DOWN * 0.4) for x in blue], lag_ratio=0.1), run_time=1.0)
        self.play(LaggedStart(*[FadeIn(x, shift=DOWN * 0.4) for x in red], lag_ratio=0.1), run_time=1.0)
        self.pause_screen(5, "리트머스 시험지의 색깔은 어떻게 변할까요?")
        acid = [i for i, s_ in enumerate(K.SOL) if s_["acid"]]
        base = [i for i, s_ in enumerate(K.SOL) if not s_["acid"]]
        self.say(f"식초·레몬즙·묽은 염산: 푸른색 리트머스 → {r('붉은색')}",
                 "식초, 레몬즙, 묽은 염산에서는 푸른색 리트머스 시험지가 붉은색으로 변했어요.")
        self.play(*[blue[i].animate.set_fill(K.LIT_R) for i in acid], run_time=1.2)
        self.play(*[Indicate(P_.names[i], color=RED) for i in acid], run_time=0.8)
        self.say(f"빨랫비누 물·석회수·수산화 나트륨: 붉은색 리트머스 → {b('푸른색')}",
                 "빨랫비누 물, 석회수, 묽은 수산화 나트륨 용액에서는 붉은색 리트머스 시험지가 푸른색으로 변했어요.")
        self.play(*[red[i].animate.set_fill(K.LIT_B) for i in base], run_time=1.2)
        self.play(*[Indicate(P_.names[i], color=BLUE) for i in base], run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 실험 ② 페놀프탈레인 ──
    def phenol(self):
        self.section("실험해요 ②")
        P_ = self.plate()
        self.play(FadeIn(P_.group), FadeIn(P_.names), *[l.animate.set_fill(s_["c"], opacity=max(0.6, s_["op"]))
                                                         for l, s_ in zip(P_.liq, K.SOL)], run_time=0.7)
        self.say("색깔이 없는 페놀프탈레인 용액을 한두 방울씩",
                 "이번에는 각 홈에 페놀프탈레인 용액을 한두 방울씩 떨어뜨려요. 페놀프탈레인 용액은 색깔이 없고 투명해요.")
        drops = VGroup(*[K.drop("#F4FBFF", 0.2).move_to(P_.center(i) + UP * 1.9) for i in range(6)])
        self.play(FadeIn(drops), run_time=0.3)
        self.play(*[d.animate.move_to(P_.center(i)) for i, d in enumerate(drops)], run_time=0.7)
        self.play(FadeOut(drops), run_time=0.2)
        self.pause_screen(5, "어느 용액의 색깔이 변할까요?")
        base = [i for i, s_ in enumerate(K.SOL) if not s_["acid"]]
        self.say(f"빨랫비누 물·석회수·수산화 나트륨만 {pk('붉은색')}으로 변해요",
                 "빨랫비누 물, 석회수, 묽은 수산화 나트륨 용액에서만 페놀프탈레인 용액이 붉은색으로 변했어요. 식초, 레몬즙, 묽은 염산은 변화가 없어요.")
        self.play(*[P_.liq[i].animate.set_fill(K.PINK, opacity=0.9) for i in base], run_time=1.4)
        self.settle()
        self.say(f"리트머스로 나눈 무리와 {o('같은 무리')}로 나뉘어요",
                 "리트머스 시험지와 페놀프탈레인 용액의 색깔 변화는 서로 달라도, 나뉘는 용액의 무리는 같아요.")
        self.play(*[Indicate(P_.names[i], color=ORANGE) for i in base], run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 정리: 산성·염기성 ──
    def table(self):
        self.section("정리해요")
        head = ["", r("산성 용액"), b("염기성 용액")]
        rows = [["푸른색 리트머스 시험지", r("붉은색"), "변화 없음"],
                ["붉은색 리트머스 시험지", "변화 없음", b("푸른색")],
                ["페놀프탈레인 용액", "변화 없음", pk("붉은색")],
                ["용액", "식초·레몬즙·묽은 염산", "빨랫비누 물·석회수·\n묽은 수산화 나트륨 용액"]]
        tab = K.result_table(head, rows, [4.2, 4.2, 4.6], row_h=0.9, size=30).move_to([0, 0.35, 0])
        self.say(f"{r('산성 용액')}과 {b('염기성 용액')}", "이렇게 지시약의 색깔 변화로 용액을 산성 용액과 염기성 용액으로 나눌 수 있어요.")
        self.play(FadeIn(tab), run_time=0.8)
        self.say(f"산성 용액: 푸른색 리트머스 → {r('붉은색')}, 페놀프탈레인 → 변화 없음",
                 "산성 용액은 푸른색 리트머스 시험지를 붉은색으로 바꾸고, 페놀프탈레인 용액의 색깔은 변하지 않아요. 식초, 레몬즙, 묽은 염산이 산성 용액이에요.")
        self.play(Indicate(VGroup(*[tab.cells[k][1] for k in range(5)]), color=RED, scale_factor=1.05), run_time=1.0)
        self.say(f"염기성 용액: 붉은색 리트머스 → {b('푸른색')}, 페놀프탈레인 → {pk('붉은색')}",
                 "염기성 용액은 붉은색 리트머스 시험지를 푸른색으로, 페놀프탈레인 용액을 붉은색으로 바꿔요. 빨랫비누 물, 석회수, 묽은 수산화 나트륨 용액이 염기성 용액이에요.")
        self.play(Indicate(VGroup(*[tab.cells[k][2] for k in range(5)]), color=BLUE, scale_factor=1.05), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 붉은 양배추 용액 ──
    def cabbage(self):
        self.section("붉은 양배추 지시약")
        steps = ["① 잘게 자르기", "② 뜨거운 물 붓기", "③ 식힌 뒤 거르기", "④ 점적병에 담기"]
        cards = VGroup(*[K.word_card(s_, 3.0, 0.85, INK, 30) for s_ in steps]).arrange(RIGHT, buff=0.2).move_to([0, 2.1, 0])
        bot = K.dropper_bottle(None, 1.2, col=K.CAB_SOL, op=0.9).move_to([0, 0.2, 0])
        self.say("붉은 양배추 용액도 지시약으로 쓸 수 있어요",
                 "붉은 양배추를 잘게 잘라 뜨거운 물을 붓고, 식힌 뒤 걸러 점적병에 담으면 지시약으로 쓸 수 있어요. 뜨거운 물은 선생님과 함께 다뤄요.")
        self.play(LaggedStart(*[FadeIn(c, shift=DOWN * 0.2) for c in cards], lag_ratio=0.25), run_time=1.4)
        self.play(FadeIn(bot, scale=0.8), run_time=0.6)
        self.settle()
        clear_stage(self)
        self.section("실험해요 ③")
        P_ = self.plate()
        self.play(FadeIn(P_.group), FadeIn(P_.names), *self.fill(P_), run_time=0.7)
        self.say("붉은 양배추 용액을 다섯 방울씩 떨어뜨려요", "각 홈에 붉은 양배추 용액을 다섯 방울씩 떨어뜨려요.")
        drops = VGroup(*[K.drop(K.CAB_SOL, 0.2, K.CAB_SOL).move_to(P_.center(i) + UP * 1.9) for i in range(6)])
        self.play(FadeIn(drops), run_time=0.3)
        self.play(*[d.animate.move_to(P_.center(i)) for i, d in enumerate(drops)], run_time=0.7)
        self.play(FadeOut(drops), *[l.animate.set_fill(K.CAB_SOL, opacity=0.5) for l in P_.liq], run_time=0.4)
        self.pause_screen(5, "어떤 색깔로 변할까요?")
        self.play(*[P_.liq[i].animate.set_fill(K.CAB[s_["cab"]], opacity=0.92) for i, s_ in enumerate(K.SOL)],
                  run_time=1.4)
        self.say(f"식초·레몬즙·묽은 염산은 {r('붉은색')}",
                 "식초, 레몬즙, 묽은 염산은 붉은색으로 변했어요.")
        self.play(*[Indicate(P_.names[i], color=RED) for i in (0, 1, 4)], run_time=0.8)
        self.say(f"빨랫비누 물·석회수는 {b('푸른색')}, 수산화 나트륨은 노란색",
                 "빨랫비누 물과 석회수는 푸른색, 묽은 수산화 나트륨 용액은 노란색으로 변했어요.")
        self.play(*[Indicate(P_.names[i], color=BLUE) for i in (2, 3, 5)], run_time=0.8)
        self.settle()
        bar = K.color_bar(11.0, 0.55).move_to([0, -1.55, 0])
        self.play(P_.all().animate.shift(UP * 0.55), FadeIn(bar), run_time=0.7)
        self.say(f"산성은 {r('붉은색 계열')}, 염기성은 {b('푸른색')}이나 노란색 계열",
                 "붉은 양배추 용액은 산성 용액에서는 붉은색 계열, 염기성 용액에서는 푸른색이나 노란색 계열로 변해요. 색깔은 조금씩 다를 수 있어서 비슷한 계열의 색깔로 분류해요.")
        self.settle()
        self.say(f"리트머스·페놀프탈레인으로 분류한 결과와 {g('같아요')}",
                 "붉은 양배추 용액으로 분류한 결과는 리트머스 시험지, 페놀프탈레인 용액으로 분류한 결과와 같아요.")
        self.settle()
        clear_stage(self)

    # ── 우리 주변의 용액 ──
    def life(self):
        self.section("우리 주변의 용액")
        A = ["오렌지주스", "구연산 용액", "콜라", "탄산수"]
        B = ["욕실 청소용 표백제", "하수구 세정제", "제빵 소다 용액", "손 세정제"]
        bins = VGroup(K.bin_box("산성 용액", 6.5, 4.2, RED, 34), K.bin_box("염기성 용액", 6.5, 4.2, BLUE, 34))
        bins.arrange(RIGHT, buff=0.2).move_to([0, 0.45, 0])
        ca = VGroup(*[K.word_card(t, 4.6, 0.72, INK, 28) for t in A]).arrange(DOWN, buff=0.14).move_to(bins[0].box.get_center() + DOWN * 0.25)
        cb = VGroup(*[K.word_card(t, 4.6, 0.72, INK, 28) for t in B]).arrange(DOWN, buff=0.14).move_to(bins[1].box.get_center() + DOWN * 0.25)
        self.say("지시약으로 알아본 우리 주변의 용액",
                 "지시약으로 알아보면 오렌지주스, 구연산 용액, 콜라, 탄산수는 산성 용액이고, 욕실 청소용 표백제, 하수구 세정제, 제빵 소다 용액, 손 세정제는 염기성 용액이에요.")
        self.play(FadeIn(bins), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(c, shift=RIGHT * 0.2) for c in ca], lag_ratio=0.15),
                  LaggedStart(*[FadeIn(c, shift=LEFT * 0.2) for c in cb], lag_ratio=0.15), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"산성 용액에 푸른색 리트머스 시험지를 넣으면", f"{r('붉은색')}(으)로 변합니다."],
                           w=12.4, size=40).move_to([0, 1.4, 0])
        self.say(f"산성 용액에 푸른색 리트머스 시험지를 넣으면 {r('붉은색')}",
                 "산성 용액에 푸른색 리트머스 시험지를 넣으면 붉은색으로 변해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        card2 = K.text_card([f"지시약을 쓰면 겉보기로 구별하기 어려운 용액도", f"{g('색깔 변화로 분류')}할 수 있어요."],
                            w=12.4, size=36).move_to([0, -0.9, 0])
        self.say(f"겉보기로 어려운 용액도 {g('색깔 변화로 분류')}해요",
                 "지시약을 쓰면 겉보기 성질로 구별하기 어려운 용액도 색깔 변화로 분류할 수 있어요.")
        self.play(FadeIn(card2, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
