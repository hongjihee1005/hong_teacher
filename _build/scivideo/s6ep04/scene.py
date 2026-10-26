"""「과학 원리 돋보기」 6학년 4화 — 둘을 섞으면? (6-1 1단원 산과 염기 5~6차시, 화 코드 6-1-1-d)

바탕: grade6/science/sem1/u1-4.html(원본 _build_tb/src/u1-4.html) — 도입(빨랫비누 물에 식초를 섞으면? 지시약 색깔로 알아봄),
실험 ①(묽은 염산 10방울씩 + 붉은 양배추 용액 5~6방울 → 묽은 수산화 나트륨 용액 0·5·10·15·20·25방울),
실험 ②(용액을 바꿔 묽은 수산화 나트륨 용액 + 묽은 염산), 색깔 변화표와 비교(붉은색 계열 → 푸른색 계열: 산성이 약해지다가 염기성 /
반대), 색깔은 앱에서 그린 예시(전체적인 색깔 변화를 봄), 정리(산성이 점점 약해지다 염기성, 염산이 새어 나온 곳에 염기성 물질,
진하기가 같으면 더 많이 넣은 용액의 성질), 한눈에 쏙(성질이 변함, 다시 산성으로 만들려면 산성 용액을 계속).
최종: ./make_final.sh s6ep04
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, Transform,
                   SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from scikit import RED, clear_stage
import kit_s6u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


DROPS = [0, 5, 10, 15, 20, 25]


class S6Ep04(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 4
    EP_TITLE = "둘을 섞으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.run(1)
        self.run(2)
        self.wrap()
        self.summary()
        self.closing(f"{r('산성 용액')}과 {b('염기성 용액')}이 만나면\n용액의 성질이 {o('변해요')}",
                     next_preview="6학년 5화 · 생활 속 산과 염기")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        a = K.dropper_bottle(K.SOL[2], 1.3, size=30).move_to([-3.6, 0.9, 0])
        bb = K.dropper_bottle(K.SOL[0], 1.3, size=30).move_to([0, 0.9, 0])
        plus = T("+", 80, SOFT).move_to([-1.8, 1.1, 0])
        eq = T("= ?", 80, SOFT).move_to([2.6, 1.1, 0])
        self.say("빨랫비누 물에 식초를 섞으면 어떻게 될까요?",
                 "염기성인 빨랫비누 물에 산성인 식초를 섞으면 어떻게 될까요?")
        self.play(FadeIn(a), FadeIn(plus), FadeIn(bb), FadeIn(eq), run_time=0.9)
        cab = K.dropper_bottle(None, 1.0, col=K.CAB_SOL, op=0.9).move_to([-3.4, -1.5, 0])
        card = K.text_card([f"섞을 때 용액의 성질 변화는", f"{o('지시약')}(붉은 양배추 용액)의 색깔 변화로 알아봐요"],
                           w=8.6, size=30).move_to([1.6, -1.45, 0])
        self.say(f"성질 변화는 {o('지시약의 색깔 변화')}로 알아봐요",
                 "섞을 때 용액의 성질 변화는 붉은 양배추 용액 같은 지시약의 색깔 변화로 알아볼 수 있어요.")
        self.play(FadeIn(cab), FadeIn(card), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def run(self, k):
        if k == 1:
            self.section("실험해요 ①")
            base, add, cols = "묽은 염산", "묽은 수산화 나트륨 용액", K.MIX_A
        else:
            self.section("실험해요 ②")
            base, add, cols = "묽은 수산화 나트륨 용액", "묽은 염산", K.MIX_B
        P_ = K.SpotPlate(6, 1, gap=2.15, r=0.66, center=(0, 0.9), names=[f"{d}방울" for d in DROPS], size=28)
        cap = M(f"넣은 {o(add)}", 28).next_to(P_.names, DOWN, buff=0.15)
        if k == 1:
            self.say(f"① 각 홈에 {r('묽은 염산')}을 10방울씩",
                     "홈판의 각 홈에 묽은 염산을 10방울씩 넣어요. 한 방울의 크기를 일정하게 해요.")
        else:
            self.say(f"이번에는 {b('묽은 수산화 나트륨 용액')}을 10방울씩",
                     "이번에는 용액을 바꿔서, 각 홈에 묽은 수산화 나트륨 용액을 10방울씩 넣고 같은 방법으로 실험해요.")
        self.play(FadeIn(P_.group), FadeIn(P_.names), FadeIn(cap), run_time=0.6)
        self.play(*[l.animate.set_fill(K.CLEAR, opacity=0.9) for l in P_.liq], run_time=0.5)
        self.say("② 붉은 양배추 용액을 5~6방울씩 떨어뜨려요" if k == 1 else "붉은 양배추 용액을 떨어뜨리면",
                 "붉은 양배추 용액을 5방울에서 6방울씩 떨어뜨려요." if k == 1 else "붉은 양배추 용액을 떨어뜨리면 노란색 계열이 돼요.")
        self.play(*[l.animate.set_fill(cols[0], opacity=0.92) for l in P_.liq], run_time=0.8)
        if k == 1:
            self.say(f"③ {b('묽은 수산화 나트륨 용액')}을 0~25방울 넣어요",
                     "이제 묽은 수산화 나트륨 용액을 홈마다 0방울, 5방울, 10방울, 15방울, 20방울, 25방울 넣어요. 0방울 홈은 처음 색깔과 비교하는 홈이에요.")
        else:
            self.say(f"{r('묽은 염산')}을 0~25방울 넣어요", "묽은 염산을 홈마다 0방울에서 25방울까지 넣어요.")
        drops = VGroup(*[K.drop("#CFE6F2", 0.18).move_to(P_.center(i) + UP * 1.7) for i in range(1, 6)])
        self.play(FadeIn(drops), run_time=0.3)
        self.play(*[d.animate.move_to(P_.center(i + 1)) for i, d in enumerate(drops)], run_time=0.6)
        self.play(FadeOut(drops), run_time=0.2)
        self.pause_screen(5, "색깔은 어떻게 바뀔까요?")
        self.play(LaggedStart(*[P_.liq[i].animate.set_fill(cols[i], opacity=0.92) for i in range(6)], lag_ratio=0.25),
                  run_time=1.8)
        bar = K.color_bar(11.0, 0.5, size=26).move_to([0, -1.75, 0])
        self.play(FadeOut(cap), FadeIn(bar), run_time=0.5)
        if k == 1:
            self.say(f"{r('붉은색')} 계열에서 {b('푸른색')} 계열로 변해요",
                     "묽은 수산화 나트륨 용액을 많이 넣을수록 붉은 양배추 용액의 색깔은 붉은색 계열에서 푸른색 계열로 변해요.")
            self.settle()
            self.say(f"산성이 약해지다가 {b('염기성')}으로 변해요",
                     "산성 용액의 성질이 점점 약해지다가 염기성으로 변한 거예요.")
        else:
            self.say(f"{b('푸른색·노란색')} 계열에서 {r('붉은색')} 계열로 변해요",
                     "묽은 염산을 많이 넣을수록 붉은 양배추 용액의 색깔은 푸른색이나 노란색 계열에서 붉은색 계열로 변해요.")
            self.settle()
            self.say(f"염기성이 약해지다가 {r('산성')}으로 변해요",
                     "염기성 용액의 성질이 점점 약해지다가 산성으로 변한 거예요.")
        self.play(Indicate(P_.liq[0]), Indicate(P_.liq[5]), run_time=1.0)
        self.settle()
        if k == 2:
            note = K.text_card([f"화면의 색깔은 예시예요. 농도나 방울 크기에 따라 달라도",
                                f"{o('전체적인 색깔 변화')}를 봐요."], w=12.0, size=30).move_to([0, 0.9, 0])
            self.say(f"특정 색깔보다 {o('전체적인 색깔 변화')}를 봐요",
                     "용액의 농도나 방울 크기에 따라 색깔은 조금씩 다를 수 있어요. 특정 색깔을 찾기보다 전체적인 색깔 변화를 봐요.")
            self.play(FadeOut(P_.all()), FadeIn(note), run_time=0.6)
            self.settle()
        clear_stage(self)

    # ── 정리 ──
    def wrap(self):
        self.section("정리해요")
        c1 = K.text_card([f"산성 용액에 염기성 용액을 계속 넣으면", f"산성이 점점 약해지다가 {b('염기성')}으로 변해요."],
                         w=12.0, size=34).move_to([0, 1.7, 0])
        c2 = K.text_card([f"염기성 용액에 산성 용액을 계속 넣으면", f"염기성이 점점 약해지다가 {r('산성')}으로 변해요."],
                         w=12.0, size=34).move_to([0, -0.1, 0])
        self.say("산성 용액과 염기성 용액을 섞으면?",
                 "산성 용액과 염기성 용액을 섞으면 서로의 성질이 약해져요. 계속 넣으면 넣은 용액의 성질로 변해요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.6)
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        tip = M(f"진하기가 같은 두 용액을 섞으면 {o('더 많이 넣은 용액')}의 성질을 나타내요", 30).move_to([0, -1.75, 0])
        self.say(f"진하기가 같으면 {o('더 많이 넣은 용액')}의 성질",
                 "진하기가 같은 두 용액을 섞으면, 섞은 용액은 더 많이 넣은 용액의 성질을 나타내요.")
        self.play(FadeIn(tip), run_time=0.5)
        self.settle()
        clear_stage(self)
        self.section("생활 속에서")
        pool = VGroup(K.Ellipse(width=4.2, height=1.1, fill_color="#E9F5FB", fill_opacity=1, stroke_color=K.GLASS,
                                stroke_width=4), T("염산", 32, RED)).move_to([-3.0, 0.4, 0])
        pool[1].move_to(pool[0])
        arrow = K.arrow_right(-0.6, 1.0, 0.4, INK)
        cardb = K.word_card("염기성 물질을 뿌려요", 4.6, 1.0, BLUE, 32).move_to([3.4, 0.4, 0])
        self.say(f"염산이 새어 나온 곳에 {b('염기성 물질')}을 뿌려요",
                 "이 성질을 생활에서도 이용해요. 염산이 새어 나온 곳에 염기성 물질을 뿌려 산성을 약하게 해요.")
        self.play(FadeIn(pool), Create(arrow), FadeIn(cardb), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["산성 용액과 염기성 용액이 만나면", f"용액의 성질이 {o('변')}합니다."], w=11.0, size=40).move_to([0, 1.5, 0])
        self.say(f"산성 용액과 염기성 용액이 만나면 성질이 {o('변해요')}")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        q = K.text_card([f"염기성으로 변한 용액을 다시 산성으로 만들려면?",
                         f"→ 묽은 염산 같은 {r('산성 용액')}을 계속 넣어요."], w=12.0, size=32).move_to([0, -0.8, 0])
        self.say(f"다시 산성으로 만들려면 {r('산성 용액')}을 계속 넣어요",
                 "묽은 염산에 묽은 수산화 나트륨 용액을 넣어 염기성으로 변한 용액을 다시 산성으로 만들려면, 묽은 염산 같은 산성 용액을 계속 넣으면 돼요.")
        self.play(FadeIn(q, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
