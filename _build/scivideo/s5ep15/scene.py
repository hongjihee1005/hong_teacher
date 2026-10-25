"""「과학 원리 돋보기」 5학년 15화 — 용액의 진하기 비교 (5-1 3단원 용해와 용액 6~7차시, 화 코드 5-1-3-d)

바탕: grade5/science/sem1/u3-4.html(원본 _build_tb/src/u3-4.html) — 도입(어느 소금물이 더 짠지: 투명해서 색깔로는 알기 어려움, 용액의 진하기 뜻),
실험 1(물 150 mL 비커 1·2에 황설탕을 다르게 녹임: 흰 종이 → 색깔이 더 진함, 기울이기 → 조금 더 끈적임),
생각해요(㉮ 물 같음 각설탕 1개·3개 → B, ㉯ 각설탕 같음 물 적게·많이 → C),
실험 2(물 150 mL 비커 3 백설탕 다섯 숟가락·비커 4 열다섯 숟가락: 비교 방법 높이·무게·물체가 뜨는 정도, 방울토마토는 비커 4에서 더 높이 떠오름),
더 알아봐요(사해, 디지털 염도계), 한눈에 쏙(진할수록 높이 떠오름) + 메추리알 낮추려면 물을 더 넣음.
최종: ./make_final.sh s5ep15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Rotate,
                   SurroundingRectangle, Transform)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep15(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 15
    EP_TITLE = "용액의 진하기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.brown()
        self.which()
        self.tomato()
        self.life()
        self.summary()
        self.closing(f"용액이 {o('진할수록')} 용액에 넣은 물체는\n{g('높이 떠올라요')}",
                     next_preview="5학년 마인드맵 3 · 용해와 용액")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        A = K.Glass(-2.4, -1.9, 2.2, 2.8, "cup")
        B = K.Glass(2.4, -1.9, 2.2, 2.8, "cup")
        cups = VGroup(A.liquid(2.3), A.glass(), B.liquid(2.3), B.glass())
        n = VGroup(T("컵 ㉮", 34).next_to(A.top(), UP, buff=0.2), T("컵 ㉯", 34).next_to(B.top(), UP, buff=0.2))
        self.say("어떤 소금물이 더 짠지 어떻게 알 수 있을까요?",
                 "소금물 두 컵이 있어요. 어떤 소금물이 더 짠지 어떻게 알 수 있을까요?")
        self.play(FadeIn(cups), FadeIn(n), run_time=0.7)
        self.say(f"둘 다 {o('투명')}해서 색깔로는 알기 어려워요",
                 "둘 다 투명해서 색깔로는 알기 어려워요. 과학실에서는 맛을 보지 않으니 다른 방법이 필요해요.")
        self.settle()
        dfn = K.text_card([f"같은 양의 용매에 용해된 용질의 양이 많고 적은 정도를", f"{o('용액의 진하기')}라고 해요."],
                          w=11.4, size=34).move_to([0.6, 2.15, 0])
        self.play(VGroup(cups, n).animate.shift(DOWN * 0.35).scale(0.85), FadeIn(dfn), run_time=0.7)
        self.say(f"용질의 양이 많고 적은 정도 → {o('용액의 진하기')}",
                 "같은 양의 용매에 용해된 용질의 양이 많고 적은 정도를 용액의 진하기라고 해요.")
        self.settle()
        clear_stage(self)

    # ── 실험 1: 황설탕 ──
    def brown(self):
        self.section("실험해요 1")
        B1 = K.Glass(-2.6, -2.0, 2.4, 3.0, "beaker")
        B2 = K.Glass(2.6, -2.0, 2.4, 3.0, "beaker")
        lv = 2.3
        w1, w2 = B1.liquid(lv, "#EAF6FB"), B2.liquid(lv, "#EAF6FB")
        bk = VGroup(w1, B1.glass(), w2, B2.glass())
        t1 = T("비커 1: 물 150 mL", 30).next_to(B1.top(0.1), UP, buff=0.2)
        t2 = T("비커 2: 물 150 mL", 30).next_to(B2.top(0.1), UP, buff=0.2)
        self.say("같은 온도의 물 150 mL에 황설탕을 다르게 녹여요",
                 "같은 온도의 물을 150밀리리터씩 담은 비커 두 개에 황설탕을 넣어 녹여요. 두 용액의 진하기가 충분히 차이 나게 만들어요.")
        self.play(FadeIn(bk), FadeIn(t1), FadeIn(t2), run_time=0.7)
        c1 = K.mix("#EAF6FB", K.BROWN_SUGAR, 2 / 14)
        c2 = K.mix("#EAF6FB", K.BROWN_SUGAR, 10 / 14)
        s1 = T("황설탕 두 숟가락(예)", 28, ORANGE).next_to(B1.glass(), DOWN, buff=0.1)
        s2 = T("황설탕 열 숟가락(예)", 28, ORANGE).next_to(B2.glass(), DOWN, buff=0.1)
        self.play(Transform(w1, B1.liquid(lv, c1, 0.9)), Transform(w2, B2.liquid(lv, c2, 0.9)), FadeIn(s1), FadeIn(s2),
                  run_time=1.2)
        paper = VGroup(*[K.rect(2.7, 3.3, "#FFFFFF", x=b.x, y=b.y + 1.55, stroke=SOFT, sw=2) for b in (B1, B2)])
        paper.set_z_index(-1)
        self.say("비커 뒤에 흰 종이를 대고 색깔을 비교해요",
                 "비커 뒤에 흰 종이를 대면 색깔을 더 정확하게 볼 수 있어요. 황설탕을 더 많이 넣은 비커 2의 색깔이 더 진해요.")
        self.play(FadeIn(paper), run_time=0.5)
        self.settle()
        self.say(f"비커를 살짝 기울이면 진한 용액이 {o('조금 더 끈적여요')}",
                 "비커를 살짝 기울여 보면, 진한 용액이 조금 더 끈적여요.")
        self.play(Rotate(VGroup(w1, bk[1]), -0.18, about_point=[B1.x + 1.2, B1.y, 0]),
                  Rotate(VGroup(w2, bk[3]), -0.18, about_point=[B2.x + 1.2, B2.y, 0]), run_time=0.6)
        self.play(Rotate(VGroup(w1, bk[1]), 0.18, about_point=[B1.x + 1.2, B1.y, 0]),
                  Rotate(VGroup(w2, bk[3]), 0.18, about_point=[B2.x + 1.2, B2.y, 0]), run_time=0.6)
        self.settle()
        res = K.text_card([f"진한 황설탕 용액은 {o('색깔이 더 진하고')}, 기울이면 {o('조금 더 끈적여요')}."], w=12.6, size=32)
        res.move_to([0.4, 2.25, 0])
        self.say(f"진한 용액: {o('색깔이 더 진하고')}, {o('조금 더 끈적여요')}",
                 "황설탕을 더 많이 넣은 진한 용액일수록 색깔이 더 진하고, 기울이면 조금 더 끈적여요.")
        self.play(FadeOut(t1), FadeOut(t2), FadeIn(res), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 생각해요: 어느 쪽이 더 진할까 ──
    def which(self):
        self.section("생각해요")
        def pair(x0, labels, cols, levels, caps, title):
            grp = VGroup()
            for k in range(2):
                G = K.Glass(x0 + (k - 0.5) * 2.5, -1.6, 1.8, 2.2, "beaker")
                grp.add(VGroup(G.liquid(levels[k], cols[k], 0.95), G.glass(),
                               T(labels[k], 40).move_to([G.x, G.y + 1.0, 0]),
                               T(caps[k], 26).next_to(G.glass(), DOWN, buff=0.12)))
            tt = T(title, 28).next_to(grp, UP, buff=0.35)
            return VGroup(tt, grp)
        L = pair(-3.4, "AB", ["#F3E2B8", "#D9A54A"], [2.0, 2.0], ["각설탕 1개", "각설탕 3개"], "㉮ 물의 양 같음")
        R = pair(3.4, "CD", ["#CF9A3E", "#F0DCA8"], [0.85, 2.0], ["물 적게", "물 많이"], "㉯ 각설탕 2개로 같음")
        self.say("어느 쪽이 더 진한 용액일까요?", "어느 쪽이 더 진한 용액일까요? 그림 ㉮와 ㉯에서 골라 봐요.")
        self.play(FadeIn(L), FadeIn(R), run_time=0.8)
        self.pause_screen(6, "㉮와 ㉯에서 더 진한 쪽은?")
        ring1 = SurroundingRectangle(L[1][1], color=GREEN, buff=0.12, corner_radius=0.2, stroke_width=7)
        ring2 = SurroundingRectangle(R[1][0], color=GREEN, buff=0.12, corner_radius=0.2, stroke_width=7)
        self.say(f"㉮에서는 {g('B')}, ㉯에서는 {g('C')}가 더 진해요",
                 "㉮에서는 같은 양의 물에 각설탕이 더 많이 녹은 B가 더 진해요. ㉯에서는 같은 양의 각설탕이 더 적은 물에 녹은 C가 더 진해요.")
        self.play(Create(ring1), Create(ring2), run_time=0.7)
        self.settle()
        card = K.text_card([f"같은 양의 용매에 {o('더 많은 용질')}이 녹아 있거나,",
                            f"같은 양의 용질이 {o('더 적은 용매')}에 녹아 있을수록 진한 용액이에요."], w=12.8, size=30)
        card.move_to([0.5, 2.2, 0])
        self.play(FadeOut(L[0]), FadeOut(R[0]), FadeIn(card), run_time=0.5)
        self.say("더 많은 용질, 또는 더 적은 용매 → 더 진한 용액", "이렇게 비교하면 어느 용액이 더 진한지 알 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 실험 2: 방울토마토 ──
    def tomato(self):
        self.section("실험해요 2")
        B3 = K.Glass(-2.6, -2.2, 2.4, 3.6, "beaker")
        B4 = K.Glass(2.6, -2.2, 2.4, 3.6, "beaker")
        lv = 2.8
        bk = VGroup(B3.liquid(lv, "#E3F2FA", 0.95), B3.glass(), B4.liquid(lv, "#E3F2FA", 0.95), B4.glass())
        t3 = T("비커 3: 백설탕 다섯 숟가락", 28).next_to(B3.top(0.1), UP, buff=0.2)
        t4 = T("비커 4: 백설탕 열다섯 숟가락", 28).next_to(B4.top(0.1), UP, buff=0.2)
        self.say("물 150 mL에 백설탕을 적게, 많이 녹였어요",
                 "같은 온도의 물을 150밀리리터씩 담은 비커 3에는 백설탕을 적게, 비커 4에는 많이 녹였어요. 둘 다 투명해서 색깔로 구별하기 어려워요.")
        self.play(FadeIn(bk), FadeIn(t3), FadeIn(t4), run_time=0.7)
        self.settle()
        ways = K.text_card([f"① 자로 용액의 {o('높이')} 재기   ② 전자저울로 {o('무게')} 재기",
                            f"③ 물체를 넣어 {o('뜨는 정도')} 보기",
                            f'<span foreground="{SOFT}">(높이·무게는 물의 양이 같을 때만 비교할 수 있어요)</span>'],
                           w=11.6, size=32).move_to([0, 0.4, 0])
        note = VGroup()
        self.say("진하기를 비교하는 방법은 세 가지예요",
                 "백설탕 용액의 진하기를 비교하는 방법은 세 가지예요. 용액의 높이 재기, 무게 재기, 물체를 넣어 뜨는 정도 보기예요. 높이와 무게로 비교하는 방법은 이번처럼 물의 양이 같을 때만 쓸 수 있어요.")
        self.play(FadeIn(ways), FadeIn(note), run_time=0.6)
        self.settle()
        self.play(FadeOut(ways), FadeOut(note), run_time=0.3)
        self.say("크기와 무게가 비슷한 방울토마토를 넣어 봐요",
                 "크기와 무게가 비슷한 방울토마토를 핀셋으로 살살 넣어 봐요. 눈높이를 같게 하여 관찰해요.")
        tm3 = K.tomato(0.32).move_to([B3.x, B3.y + 3.25, 0])
        tm4 = K.tomato(0.32).move_to([B4.x, B4.y + 3.25, 0])
        self.play(FadeIn(tm3), FadeIn(tm4), run_time=0.4)
        self.pause_screen(6, "어느 비커에서 더 높이 뜰까요?")
        self.play(tm3.animate.move_to([B3.x, B3.y + 0.45, 0]), tm4.animate.move_to([B4.x, B4.y + lv - 0.25, 0]),
                  run_time=1.4)
        lab = K.label("더 높이 떠올라요", GREEN, 28).next_to(tm4, LEFT, buff=0.15).shift(DOWN * 0.5)
        self.say(f"방울토마토가 더 높이 떠오른 {g('비커 4')}가 더 진한 용액이에요",
                 "방울토마토가 더 높이 떠오른 비커 4가 더 진한 용액이에요. 토마토 높이는 그림으로 나타낸 모습이에요.")
        self.play(FadeIn(lab), run_time=0.4)
        self.settle()
        res = K.text_card([f"용액이 {o('진할수록')} 물체가 {g('더 높이 떠올라요')}."], w=10.0, size=36).move_to([0.4, 2.3, 0])
        self.say(f"용액이 {o('진할수록')} 물체가 {g('더 높이 떠올라요')}",
                 "크기와 무게가 같은 물체를 넣었을 때, 용액이 진할수록 물체가 더 높이 떠올라요.")
        self.play(FadeOut(t3), FadeOut(t4), FadeIn(res), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 더 알아봐요: 생활 ──
    def life(self):
        self.section("더 알아봐요")
        def sea(x, col, title, high, cap):
            box = K.rect(5.6, 3.0, "#D6EFFA", x=x, y=0.6, stroke=SOFT, sw=3)
            water = K.rect(5.6, 1.5, col, x=x, y=-0.15, stroke=col, sw=0)
            p = K.swimmer(high, 1.3, vest=not high)
            p.move_to([x, 0.55 if high else 0.45, 0])
            t = T(title, 30).next_to(box, UP, buff=0.12)
            c = T(cap, 26).next_to(box, DOWN, buff=0.12)
            return VGroup(box, water, p, t, c)
        a = sea(-3.1, "#3F8FD6", "일반적인 바다", False, "구명조끼가 있어야 잘 떠요")
        b = sea(3.1, "#7FBFB0", "사해(소금물 호수)", True, "몸이 쉽게 떠요")
        self.say("사해에서는 왜 몸이 쉽게 뜰까요?", "사해라는 소금물 호수에서는 몸이 쉽게 떠요. 왜 그럴까요?")
        self.play(FadeIn(a), FadeIn(b), run_time=0.8)
        self.say(f"사해는 소금이 많이 녹아 {o('훨씬 진하기')} 때문이에요",
                 "사해는 소금이 아주 많이 녹아 있어 일반적인 바닷물보다 훨씬 진해요. 그래서 사람의 몸이 쉽게 떠올라요.")
        self.play(Indicate(b[2], color=GREEN), run_time=0.8)
        self.settle()
        clear_stage(self)
        meter = K.salinometer("", 1.4).move_to([-3.2, 0.4, 0])
        t = K.text_card([f"{o('디지털 염도계')}", "염도: 물에 소금이 녹아 있는 정도", "음식의 간을 맞추거나 수족관의 물을 확인해요"],
                        w=8.0, size=30).move_to([2.2, 0.5, 0])
        self.say(f"{o('디지털 염도계')}로 소금이 녹아 있는 정도를 재요",
                 "음식의 간을 맞추거나 수족관의 물을 확인할 때는 디지털 염도계를 써요. 염도는 물에 소금이 녹아 있는 정도예요. 용액이 진할수록 수치가 커져요.")
        self.play(FadeIn(meter), FadeIn(t), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"용액의 진하기가 {o('진할수록')} 용액에 넣은 물체는", f"용액에서 {g('높이 떠오릅니다')}."],
                           w=11.6, size=40).move_to([0, 1.6, 0])
        self.say(f"용액이 {o('진할수록')} 물체는 {g('높이 떠올라요')}",
                 "용액의 진하기가 진할수록 용액에 넣은 물체는 용액에서 높이 떠올라요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        q = K.text_card([f"소금물에 높이 떠 있는 메추리알을 낮추려면?",
                         f"→ {o('물을 더 넣어')} 소금물을 {g('묽게')} 만들어요."], w=10.4, size=32).move_to([0, -1.0, 0])
        self.say("메추리알의 높이를 낮추려면?",
                 "소금물에 높이 떠 있는 메추리알의 높이를 낮추려면 어떻게 할까요? 물을 더 넣어 소금물을 묽게 만들면 메추리알이 낮게 떠요.")
        self.play(FadeIn(q, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
