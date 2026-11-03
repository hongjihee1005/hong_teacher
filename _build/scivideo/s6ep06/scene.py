"""「과학 원리 돋보기」 6학년 6화 — 산성화가 환경에 주는 영향 (6-1 1단원 산과 염기 9~10차시 + 11차시 동영상 만들기, 화 코드 6-1-1-f)

바탕: grade6/science/sem1/u1-6.html(원본 _build_tb/src/u1-6.html) — 도입(산성을 띠는 비가 내리면? 산성화의 뜻), 피해 사례
세 주제(앱 스크립트 TOP의 피해·원인 문장: 산성비·해양 산성화·토양 산성화), 산성비의 원인·현황·전망·대책(앱 분류 카드),
해양 산성화 실험(식초 4·20·40 mL + 물, 일주일 뒤 ㉢ ＞ ㉡ ＞ ㉠), 한눈에 쏙(산성화는 생태계에 큰 피해, 산성화된 호수에 염기성 물질).
u1-7(동영상 만들기)의 도입 — 산성화의 주요 원인인 환경 오염 물질을 줄이려는 노력, 여러 사람이 함께 노력하도록 피해 사례를 알리기 — 를 끝에 녹임.
최종: ./make_final.sh s6ep06
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, Transform,
                   RoundedRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from scikit import RED, clear_stage
import kit_s6u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def fit_in(m, w, h):
    if m.width > w:
        m.scale_to_fit_width(w)
    if m.height > h:
        m.scale_to_fit_height(h)
    return m


class S6Ep06(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 6
    EP_TITLE = "산성화가 환경에 주는 영향"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.topics()
        self.rain_plan()
        self.sea_exp()
        self.summary()
        self.together()
        self.closing(f"{r('산성화')}는 생태계에 큰 피해를 줘요\n오염 물질을 {g('함께')} 줄여요",
                     next_preview="6학년 7화 · 운동하는 물체의 특징")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        rc = K.rain_cloud(3.0, n=8, seed=2).move_to([-0.2, 2.1, 0])
        st = K.statue(1.4).move_to([-2.6, -0.6, 0])
        tr = K.tree(1.7).move_to([2.4, -0.9, 0])
        self.say("산성을 띠는 비가 내리면 어떤 일이 생길까요?",
                 "산성을 띠는 비가 내리면 어떤 일이 생길까요?")
        self.play(FadeIn(rc, shift=DOWN * 0.2), FadeIn(st), FadeIn(tr), run_time=0.9)
        st2 = K.statue(1.4, damaged=True).move_to(st)
        tr2 = K.tree(1.7, dry=True).move_to(tr, aligned_edge=DOWN)
        self.say(f"대리암 건물이 {o('조금씩 녹고')}, 식물이 {o('잘 자라지 못해요')}",
                 "대리암으로 지은 건물이 조금씩 녹고, 식물이 잘 자라지 못할 것 같아요.")
        self.play(Transform(st, st2), Transform(tr, tr2), run_time=1.2)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"{r('산성화')}: 어떤 물질이 원래의 성질에서", "점차 산성으로 변하는 것"], w=10.0, size=40).move_to([0, 0.5, 0])
        self.say(f"원래의 성질에서 점차 산성으로 변하는 것, {r('산성화')}",
                 "어떤 물질이 원래의 성질에서 점차 산성으로 변하는 것을 산성화라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 피해 사례 ──
    def topic(self, name, pics, damage, cause, narr_d, narr_c):
        self.section(name)
        pics.scale(min(5.8 / pics.width, 3.0 / pics.height))
        pics.move_to([-3.75, 0.8, 0])
        lst = K.text_card([f"· {d}" for d in damage], w=7.0, size=30).move_to([3.15, 1.0, 0])
        self.say(f"{name}의 피해", narr_d)
        self.play(FadeIn(pics), run_time=0.8)
        self.play(FadeIn(lst, shift=LEFT * 0.2), run_time=0.7)
        self.settle()
        cc = K.text_card(cause if isinstance(cause, list) else [cause], w=13.0, size=30, stroke=self.accent)
        cc.move_to([0, -2.45 + cc.height / 2, 0])
        self.say(*narr_c)
        self.play(FadeIn(cc, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def topics(self):
        # 산성비
        fac = K.factory(1.0).move_to([-5.0, 0.6, 0])
        rc = K.rain_cloud(2.2, n=6, seed=3).move_to([-2.9, 1.9, 0])
        st = K.statue(0.9, damaged=True).move_to([-2.2, -0.2, 0])
        tr = K.tree(1.2, dry=True).move_to([-3.4, -0.5, 0])
        lk = K.lake(1.7, dead=True).move_to([-4.6, -0.95, 0])
        pics = VGroup(fac, rc, tr, st, lk)
        fit_in(pics, 5.6, 3.6)
        self.topic("산성비", pics,
                   ["나무가 말라 숲이 황폐해져요", "물고기·플랑크톤이 죽기도 해요",
                    "대리암 조각상·건축물이 훼손돼요"],
                   f"원인: 공장·자동차·발전소 등에서 나온 {o('대기 오염 물질')}이 빗물에 녹아요",
                   "산성비가 내리면 숲의 나무가 말라 숲이 황폐해지고, 호수나 강이 산성화되어 물고기와 플랑크톤이 죽기도 해요. 대리암으로 만든 조각상이나 건축물도 점점 훼손돼요.",
                   (f"원인은 빗물에 녹은 {o('대기 오염 물질')}",
                    "공장, 자동차, 발전소 등에서 나온 대기 오염 물질이 빗물에 녹아 산성비가 돼요."))
        # 해양 산성화
        a = K.coral_reef(False, 1.25).move_to([-5.15, 0.6, 0])
        bb = K.coral_reef(True, 1.25).move_to([-2.45, 0.6, 0])
        ta = T("건강한 산호", 24).next_to(a, DOWN, buff=0.15)
        tb = T("하얗게 변한 산호", 24).next_to(bb, DOWN, buff=0.15)
        pics = VGroup(a, bb, ta, tb)
        self.topic("해양 산성화", pics,
                   ["조개껍데기가 얇아져요", "산호가 하얗게 변하는 백화 현상", "바다 생물의 다양성이 줄어들어요"],
                   [f"껍데기·뼈대의 주요 성분인 {o('탄산 칼슘')}이 산성 용액에 녹아요",
                    f"주된 원인: 바닷물에 많이 녹아든 {g('이산화 탄소')}"],
                   "바닷물이 산성화되면 조개껍데기가 얇아지고, 산호가 하얗게 변하는 백화 현상이 일어나며, 바다 생물의 다양성이 줄어들어요.",
                   (f"{o('탄산 칼슘')}이 산성 용액에 녹기 때문이에요",
                    "조개와 산호의 껍데기와 뼈대의 주요 성분인 탄산 칼슘은 산성 용액에 녹아요. 해양 산성화의 주된 원인은 바닷물에 많이 녹아든 이산화 탄소예요."))
        # 토양 산성화
        s1 = K.soil(False, 2.2).move_to([-5.15, 0.4, 0])
        s2 = K.soil(True, 2.2).move_to([-2.55, 0.4, 0])
        t1 = T("건강한 흙", 24).next_to(s1, DOWN, buff=0.2)
        t2 = T("산성화된 흙", 24).next_to(s2, DOWN, buff=0.2)
        pics = VGroup(s1, s2, t1, t2)
        self.topic("토양 산성화", pics,
                   ["식물이 잘 자라지 못해요", "흙 속 미생물의 활동이 줄어들어요", "숲이 황폐해지기도 해요"],
                   f"원인: {o('화학 비료나 농약')}을 지나치게 쓰고, {o('산성비')}가 내려서",
                   "흙이 산성화되면 식물이 잘 자라지 못하고, 흙 속 미생물의 활동이 줄어들며, 숲이 황폐해지기도 해요.",
                   (f"화학 비료·농약의 지나친 사용과 {o('산성비')}",
                    "화학 비료나 농약을 지나치게 쓰고 산성비가 내리면서 토양 산성화가 일어나요."))

    # ── 산성비 정리 ──
    def rain_plan(self):
        self.section("산성비 정리하기")
        heads = [("원인", "화석 연료의 연소, 자동차 배기가스 등\n사람의 활동으로 생긴 대기 오염"),
                 ("현황", "전 세계적으로 일어나는 환경 문제\n건축물·조각상·문화재가 훼손되고 있음"),
                 ("전망", "줄이려는 노력을 하지 않으면\n피해가 더 빨라질 수 있음"),
                 ("대책", "오염 물질 배출 규제, 친환경 에너지\n자전거나 대중교통 이용")]
        cols = [K.ACID, ORANGE, BLUE, GREEN]
        grid = VGroup()
        for (h, body), c in zip(heads, cols):
            box = RoundedRectangle(corner_radius=0.2, width=6.4, height=2.05, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=c, stroke_width=5)
            ht = T(h, 32, c)
            bt = K.name_text(body, 26)
            fit_in(bt, 5.9, 1.2)
            VGroup(ht, bt).arrange(DOWN, buff=0.18).move_to(box)
            grid.add(VGroup(box, ht, bt))
        grid.arrange_in_grid(rows=2, cols=2, buff=(0.3, 0.3)).move_to([0, 0.2, 0])
        self.say(f"산성비를 {o('원인 · 현황 · 전망 · 대책')}으로 나누어 정리해요",
                 "모둠원이 역할을 나누어 조사한 산성비의 내용을 원인, 지금의 상태인 현황, 전망, 대책으로 나누어 정리해요.")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.15) for c in grid], lag_ratio=0.3), run_time=1.6)
        self.settle()
        self.say(f"나누어 정리하면 피해 사례를 {g('한눈에')} 알 수 있어요",
                 "이렇게 나누어 정리하면 피해 사례를 한눈에 알 수 있어요.")
        self.play(Indicate(grid[3], color=GREEN, scale_factor=1.03), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 해양 산성화 실험 ──
    def sea_exp(self):
        self.section("더 알아봐요")
        info = [("㉠", "식초 4 mL\n＋ 물 196 mL", 0.25), ("㉡", "식초 20 mL\n＋ 물 180 mL", 0.5), ("㉢", "식초 40 mL\n＋ 물 160 mL", 0.85)]
        xs = [-4.0, 0.0, 4.0]
        Gs, liqs, shells, names = [], VGroup(), VGroup(), VGroup()
        for (mk, txt, _), x in zip(info, xs):
            G = K.Glass(x, -1.1, 2.0, 2.4, "beaker")
            Gs.append(G)
            liqs.add(G.liquid(1.8, "#F7EFC8", 0.55))
            shells.add(K.clamshell(1.6).move_to([x, -0.7, 0]))
            nm = VGroup(T(mk, 34, self.accent), K.name_text(txt, 24)).arrange(DOWN, buff=0.08).next_to(G.top(), UP, buff=0.15)
            names.add(nm)
        glasses = VGroup(*[G.glass() for G in Gs])
        self.say("물이 산성화되면 조개껍데기는 어떻게 될까요?",
                 "식초의 양을 달리한 세 비커에 조개껍데기를 넣고 일주일 동안 관찰해요.")
        self.play(FadeIn(liqs), FadeIn(glasses), FadeIn(names), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(s, shift=DOWN * 0.4) for s in shells], lag_ratio=0.2), run_time=1.0)
        self.say(f"크기·두께·모양이 {o('비슷한')} 조개껍데기를 써요",
                 "크기, 두께, 모양이 비슷한 조개껍데기를 써야 공정하게 비교할 수 있어요.")
        self.settle()
        self.pause_screen(5, "가장 많이 녹을 비커는?")
        day = K.label("일주일 뒤", self.accent, 32).move_to([0, -2.25, 0])
        bub = VGroup(*[K.bubbles(x - 0.45, x + 0.45, -0.6, 0.5, n=n, seed=k + 3, rmin=0.04, rmax=0.08)
                       for k, (x, n) in enumerate(zip(xs, (3, 6, 11)))])
        self.say("식초를 많이 넣은 비커일수록 기포가 더 많이 생겨요",
                 "날이 지나면서 식초를 많이 넣은 비커일수록 기포가 더 많이 생겨요.")
        self.play(FadeIn(bub, lag_ratio=0.1), run_time=0.8)
        self.settle()
        self.play(FadeIn(day), FadeOut(bub),
                  *[s.animate.scale(1 - 0.6 * m, about_edge=DOWN) for s, (_, _, m) in zip(shells, info)], run_time=1.4)
        self.say(f"㉢ ＞ ㉡ ＞ ㉠ — 산성이 {r('강할수록')} 많이 녹아요",
                 "일주일 뒤, 셋째, 둘째, 첫째 비커 순서로 조개껍데기가 많이 녹았어요. 산성 용액의 산성이 강할수록 조개껍데기가 많이 녹아요.")
        self.settle()
        self.say(f"바닷물이 산성화되면 조개와 산호가 {r('살기 어려워져요')}",
                 "바닷물이 점점 산성화되면 조개와 산호가 살기 어려워져요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["산성비, 해양 산성화, 토양 산성화 등", f"{r('산성화')}는 생태계에 큰 피해를 주고 있습니다."],
                           w=12.0, size=38).move_to([0, 1.4, 0])
        self.say(f"{r('산성화')}는 생태계에 큰 피해를 주고 있어요",
                 "산성비, 해양 산성화, 토양 산성화 등 산성화는 생태계에 큰 피해를 주고 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        lk = K.lake(2.6, dead=True).move_to([-4.3, -0.85, 0])
        q = K.text_card([f"산성화된 호수에 {b('염기성 물질')}을 뿌리는 까닭은?",
                         f"→ 호수의 {r('산성')}이 약해지기 때문이에요"], w=8.4, size=30).move_to([2.2, -0.85, 0])
        self.say(f"호수에 {b('염기성 물질')}을 뿌리면 산성이 약해져요",
                 "산성화된 호수에 염기성 물질을 뿌리는 까닭은, 염기성 물질이 호수의 산성을 약하게 하기 때문이에요.")
        self.play(FadeIn(lk), FadeIn(q, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 함께 줄여요 (u1-7) ──
    def together(self):
        self.section("함께 실천해요")
        c1 = K.text_card([f"산성화의 주요 원인인 {o('환경 오염 물질')}을 줄여요",
                          f"· 대중교통 이용하기 · 에너지 아끼기 · 이산화 탄소 줄이기"], w=12.0, size=32).move_to([0, 1.6, 0])
        self.say(f"산성화를 일으키는 {o('환경 오염 물질')}을 줄여요",
                 "피해를 줄이려면 산성화의 주요 원인인 환경 오염 물질을 줄여야 해요. 대중교통을 이용하고 에너지를 아껴요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.7)
        self.settle()
        c2 = K.text_card([f"한 사람보다 {g('여러 사람이 함께')} 노력할 때 더 효과적이에요",
                          f"→ 피해 사례를 알리는 {o('짧은 동영상')}을 만들어 공유해요"], w=12.0, size=32).move_to([0, -0.6, 0])
        self.say(f"{g('여러 사람이 함께')} — 피해 사례를 알리는 영상을 만들어요",
                 "여러 사람이 함께 노력할 때 더 효과적이에요. 피해 사례를 알리는 짧은 동영상을 만들어 공유해 봐요.")
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
