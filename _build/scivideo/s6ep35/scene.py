"""「과학 원리 돋보기」 6학년 35화 — 미래 사회의 문제 (6-2 4단원 과학과 나의 진로 2차시, 화 코드 6-2-4-a)

바탕: grade6/science/sem2/u4-1.html(원본 _build_tb/src2/u4-1.html) — 도입(10년 전과 현재의 식당: 키오스크·서빙 로봇, 과학 기술의 발달,
현재의 정보로 미래를 예상), 조사해요 1(현재 사회 (가) 출생아 수 감소 (나) 이산화 탄소 배출량 증가 (다) 빠른 과학 기술 발전),
더 알아보기(연도별 인구 구조 — 앱 그래프 값 그대로, 자료: 저출산고령사회위원회, 2040·2070년은 예상 값), 조사해요 2(지속되면: 노동력 부족 ·
기후 위기 · 과학 기술의 범죄 악용 → 인구·환경·윤리 문제), 토의해요(생각의 사슬, 환경 문제 줄), 정리해요(카드 나누기, 과학의 기여를 연구),
한눈에 쏙(+ 전 세계 인구 증가 → 자원·에너지 부족), 형성 평가 OX.
최종: ./make_final.sh s6ep35
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowFromEdge, Indicate, VGroup, Circumscribe)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="{K.P_COL[0]}">{s}</span>'


def v(s):
    return f'<span foreground="{K.P_COL[2]}">{s}</span>'


class S6Ep35(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 35
    EP_TITLE = "미래 사회의 문제"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.now_society()
        self.population()
        self.future()
        self.chain()
        self.summary()
        self.check()
        self.closing(f"미래 사회에는 {bl('인구 문제')}, {g('환경 문제')},\n{v('윤리 문제')} 등이 일어날 수 있어요",
                     next_preview="6학년 36화 · 과학이 미래 문제를 해결할 수 있을까?")
        self.wait(0.5)

    # ── 궁금해요: 10년 전과 현재의 식당 ──
    def intro(self):
        self.section("궁금해요")
        past = K.shop_panel("past").move_to([-3.4, 0.55, 0])
        now = K.shop_panel("now").move_to([3.4, 0.55, 0])
        tp = K.label("10년 전", SOFT, 30).move_to(past[0].get_top() + DOWN * 0.38 + LEFT * 2.1)
        tn = K.label("현재", ORANGE, 30).move_to(now[0].get_top() + DOWN * 0.38 + LEFT * 2.3)
        self.say("10년 전과 현재의 식당은 무엇이 달라졌을까요?",
                 "10년 전과 현재의 식당을 비교해 봐요. 무엇이 달라졌을까요?")
        self.play(FadeIn(past), FadeIn(tp), run_time=0.7)
        self.play(FadeIn(now), FadeIn(tn), run_time=0.7)
        self.say("10년 전: 종업원에게 주문하고, 종업원이 음식을 날라 주었어요",
                 "10년 전에는 손님이 종업원에게 직접 주문하고 값을 냈어요. 종업원이 음식을 날라 주었지요.")
        self.play(Indicate(past.items, color=ORANGE), run_time=0.9)
        self.settle()
        lk = K.label("키오스크", ORANGE, 24).next_to(now.kiosk, UP, buff=0.12)
        lr = K.label("서빙 로봇", ORANGE, 24).next_to(now.robot, UP, buff=0.12)
        self.say(f"현재: {o('키오스크')}로 주문·결제, {o('서빙 로봇')}이 음식 전달",
                 "현재는 키오스크 화면을 눌러 주문하고 값을 내고, 서빙 로봇이 음식을 전달하기도 해요.")
        self.play(FadeIn(lk), FadeIn(lr), run_time=0.6)
        self.settle()
        why = K.text_card([f"이런 변화가 생긴 까닭은? → {g('과학 기술이 발달')}했기 때문"], size=32).move_to([0, -2.0, 0])
        self.say(f"변화의 까닭은 {g('과학 기술의 발달')} — 현재로 미래를 예상해 봐요",
                 "이런 변화는 과학 기술이 발달했기 때문이에요. 이처럼 현재의 모습을 바탕으로 미래 사회의 문제를 예상해 볼 수 있어요.")
        self.play(FadeIn(why), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 조사해요: 현재 사회의 모습 ──
    def cards_now(self):
        pics = [K.crib(), K.factory(), K.expo()]
        names = ["(가)", "(나)", "(다)"]
        lines = [["출생아 수가", "줄어들고 있어요"], ["이산화 탄소 배출량이", "증가하고 있어요"], ["인공지능 기술 등 과학 기술이", "빠르게 발전하고 있어요"]]
        cards = VGroup(*[K.icon_card(p, n, l, w=4.2, h=3.6, col=K.P_COL[i], size=26, head=32, pic_h=1.5)
                         for i, (p, n, l) in enumerate(zip(pics, names, lines))]).arrange(RIGHT, buff=0.3).move_to([0, 0.5, 0])
        return cards

    def now_society(self):
        self.section("조사해요")
        cards = self.cards_now()
        nar = ["현재 사회의 모습을 살펴봐요. 가, 비어 있는 신생아 침대처럼 출생아 수가 줄어들고 있어요.",
               "나, 전 세계적으로 이산화 탄소 배출량이 증가하고 있어요.",
               "다, 인공지능 기술을 비롯한 과학 기술이 빠르게 발전하고 있어요."]
        subs = [f"(가) {o('출생아 수')}가 줄어들고 있어요", f"(나) {o('이산화 탄소 배출량')}이 증가하고 있어요",
                f"(다) {o('과학 기술')}이 빠른 속도로 발전하고 있어요"]
        for c, s_, n_ in zip(cards, subs, nar):
            self.say(s_, n_)
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.6)
        self.settle()
        self.cards = cards

    # ── 더 알아보기: 인구 구조 ──
    def population(self):
        self.section("더 알아보기")
        clear_stage(self)
        ch = K.pop_chart(W=9.4, row=0.44, gap=0.14, size=22).move_to([0.55, 0.45, 0])
        src = T("자료: 저출산고령사회위원회", 20, SOFT).next_to(ch.note, LEFT, buff=0.5)
        self.say("우리나라 인구 구조는 어떻게 변하고 있을까요?",
                 "우리나라 인구 구조를 나이대별 비율 그래프로 살펴봐요.")
        self.play(FadeIn(ch.legend), *[FadeIn(nm) for nm, _, _ in ch.rows], FadeIn(ch.note), FadeIn(src), run_time=0.6)
        for nm, bars, nums in ch.rows:
            self.play(*[GrowFromEdge(b_, LEFT) for b_ in bars], run_time=0.35)
            self.add(nums)
        self.settle()
        old = VGroup(*[row[1][2] for row in ch.rows])
        self.say(f"만 65세 이상: 2.9%(1960년) → 46.4%(2070년 예상), {r('점점 늘어나요')}",
                 "만 65세 이상의 비율은 1960년 2.9퍼센트에서 2070년 46.4퍼센트로 예상돼요. 점점 늘어나요.")
        self.play(*[Circumscribe(b_, color=RED, buff=0.03) for b_ in old], run_time=1.2)
        self.settle()
        mid = VGroup(*[row[1][1] for row in ch.rows[3:]])
        self.say(f"만 15~64세는 2020년 뒤 줄어요 → {r('노동력이 부족')}해질 수 있어요",
                 "일을 많이 하는 만 15세에서 64세의 비율은 2020년 뒤 줄어들어, 노동력이 부족해질 수 있어요.")
        self.play(*[Indicate(b_, color=RED, scale_factor=1.05) for b_ in mid], run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 지속되면 생길 문제 ──
    def future(self):
        self.section("조사해요")
        cards = self.cards_now().scale(0.7).arrange(RIGHT, buff=0.75).move_to([0, 1.3, 0])
        self.say("현재 사회의 모습이 계속되면 미래에는 어떤 문제가 생길까요?",
                 "현재의 모습이 이대로 계속되면 미래에는 어떤 문제가 생길까요?")
        self.play(FadeIn(cards), run_time=0.6)
        self.pause_screen(5, "이대로 계속되면 어떤 문제가 생길까요?")
        futs = [["노동력이 부족해져요", "일할 사람을 구하기 어려워요"],
                ["기후 위기로 살기 어려워져요", "자연재해·해수면 상승"],
                ["제도가 늦게 만들어지면", "과학 기술이 범죄에 악용돼요"]]
        boxes = VGroup()
        for i, (c, f) in enumerate(zip(cards, futs)):
            t = VGroup(*[T(x, 24, INK) for x in f]).arrange(DOWN, buff=0.08)
            if t.width > 3.2:
                t.scale_to_fit_width(3.2)
            bx = K.rr(3.5, 1.05, PAPER, stroke=K.P_COL[i], r=0.14)
            t.move_to(bx)
            grp = VGroup(bx, t).move_to([c.get_center()[0], -0.95, 0])
            tag = K.prob_tag(i, 28).next_to(grp, DOWN, buff=0.18)
            arr = K.Arrow(c.get_bottom(), grp.get_top(), buff=0.06, stroke_width=6, color=K.P_COL[i], max_tip_length_to_length_ratio=0.35)
            boxes.add(VGroup(arr, grp, tag))
        nar = [("(가)가 계속되면 → 노동력 부족: {}".format(bl("인구 문제")),
                "출생아 수 감소가 계속되면 노동력이 부족해질 수 있어요. 인구 문제예요."),
               ("(나)가 계속되면 → 기후 위기: {}".format(g("환경 문제")),
                "이산화 탄소가 계속 늘면 기후 위기로 살기 어려운 환경이 될 수 있어요. 자연재해가 많아지고 해수면이 높아져요. 환경 문제예요."),
               ("(다)가 계속되면 → 과학 기술의 범죄 악용: {}".format(v('윤리 문제')),
                "과학 기술에 비해 관련 제도가 늦게 만들어지면, 과학 기술이 범죄에 악용될 수 있어요. 윤리 문제예요.")]
        for bx, (s_, n_) in zip(boxes, nar):
            self.say(s_, n_)
            self.play(Create(bx[0]), FadeIn(bx[1]), run_time=0.6)
            self.play(FadeIn(bx[2], scale=0.9), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 토의해요: 생각의 사슬 ──
    def chain(self):
        self.section("토의해요")
        heads = ["현재 사회의 모습", "미래 사회의 문제", "영향 1", "영향 2"]
        ch = K.chain(["이산화 탄소\n배출량이 증가", "기후 위기로\n살기 어려운 환경", "기후 난민이\n생길 수 있어요", "자연재해가 많아지고\n생태계가 파괴돼요"],
                     K.P_COL[1], w=2.75, h=1.55, size=24, gap=0.6, heads=heads).move_to([0, 0.75, 0])
        tag = K.prob_tag(1, 30).move_to([0, 2.65, 0])
        self.say("문제 하나를 골라 우리에게 미치는 영향을 이어 봐요",
                 "환경 문제를 골라, 우리에게 미치는 영향을 생각의 사슬로 이어 봐요.")
        self.play(FadeIn(tag), FadeIn(ch.boxes[0]), run_time=0.6)
        self.settle()
        self.say("이산화 탄소 증가 → 기후 위기 → 기후 난민·자연재해",
                 "기후 위기로 많은 사람이 삶의 터전을 잃고 기후 난민이 될 수 있고, 자연재해가 많아지고 생태계가 파괴될 수 있어요.")
        for i in range(3):
            self.play(Create(ch.arrows[i]), FadeIn(ch.boxes[i + 1], shift=RIGHT * 0.2), run_time=0.6)
        self.settle()
        note = K.text_card([f"미래 사회의 문제는 또 다른 문제를 {o('연쇄적')}으로 일으킬 수 있어요"], size=32).move_to([0, -1.55, 0])
        self.say(f"하나의 문제가 또 다른 문제를 {o('연쇄적')}으로 일으킬 수 있어요",
                 "미래 사회의 문제는 또 다른 문제를 연쇄적으로 일으킬 수 있어요.")
        self.play(FadeIn(note), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def organize(self):
        self.section("정리해요")
        bins = VGroup(*[K.bin_box(n, 4.3, 3.9, K.P_COL[i], 32) for i, n in enumerate(K.P_NAME)]).arrange(RIGHT, buff=0.22).move_to([0, 0.6, 0])
        items = [["노동력 부족", "노인 복지·의료 비용 증가"], ["기후 위기", "해수면 상승으로\n낮은 지역이 물에 잠김", "환경오염"],
                 ["과학 기술이\n범죄에 악용됨", "개인 정보 유출"]]
        self.say("미래 사회에 일어날 수 있는 문제를 나누어 봐요", "미래 사회에 일어날 수 있는 문제를 나누어 정리해 봐요.")
        self.play(FadeIn(bins), run_time=0.6)
        cards = VGroup()
        for i, its in enumerate(items):
            col = VGroup()
            for it in its:
                t = VGroup(*[T(x, 24, INK) for x in it.split("\n")]).arrange(DOWN, buff=0.06)
                bx = K.rr(3.9, 0.55 + 0.32 * (len(it.split("\n")) - 1), PAPER, stroke=K.P_COL[i], r=0.12, sw=3)
                if t.width > 3.7:
                    t.scale_to_fit_width(3.7)
                t.move_to(bx)
                col.add(VGroup(bx, t))
            col.arrange(DOWN, buff=0.16).next_to(bins[i].title, DOWN, buff=0.25)
            cards.add(col)
        self.say(f"인구 문제·환경 문제·윤리 문제로 나눌 수 있어요",
                 "노동력 부족과 노인 복지·의료 비용 증가는 인구 문제, 기후 위기와 해수면 상승, 환경오염은 환경 문제, 과학 기술의 범죄 악용과 개인 정보 유출은 윤리 문제예요.")
        for c in cards:
            self.play(FadeIn(c, lag_ratio=0.25), run_time=0.7)
        self.settle()
        self.say(f"사람들은 문제 해결에 {g('과학이 어떻게 기여할 수 있는지')} 연구하고 있어요",
                 "사람들은 이런 문제에 대비해, 문제를 해결하는 데 과학이 어떻게 기여할 수 있는지 연구하고 있어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["미래 사회에는 인구 문제, " + g("환경") + " 문제,", "윤리 문제 등이 일어날 수 있습니다."], w=12.0, size=44).move_to([0, 1.3, 0])
        self.say(f"미래 사회에는 인구·{g('환경')}·윤리 문제 등이 일어날 수 있어요",
                 "미래 사회에는 인구 문제, 환경 문제, 윤리 문제 등이 일어날 수 있습니다.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        more = K.text_card([f"전 세계적으로는 인구가 {o('증가')}하고 있어요", f"→ 인간이 쓸 수 있는 {r('자원과 에너지가 부족')}해질 수 있어요"],
                           w=12.0, size=32).move_to([0, -1.2, 0])
        self.say(f"전 세계적으로는 인구 증가 → {r('자원과 에너지 부족')}",
                 "전 세계적으로는 인구가 증가하고 있어서, 자원과 에너지가 부족해질 수 있어요. 사람들은 이런 문제를 해결하는 데 과학이 어떻게 기여할 수 있는지 연구하고 있어요.")
        self.play(FadeIn(more), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인해요 ──
    def check(self):
        self.section("확인해요")
        items = [("⑴ 국내는 저출산으로 노동력 부족, 전 세계는 인구 증가로 자원 부족 문제가 일어날 수 있다.", True),
                 ("⑵ 기후 위기, 환경오염과 같은 환경 문제는 일부 국가에서만 겪는 문제일 것이다.", False),
                 ("⑶ 과학 기술의 발전 속도에 맞게 제도가 만들어지므로 윤리 문제는 일어나지 않을 것이다.", False)]
        cards = VGroup(*[K.word_card(t_, 12.0, 0.95, size=27) for t_, _ in items]).arrange(DOWN, buff=0.28).move_to([0.4, 0.75, 0])
        self.say("옳으면 ○, 옳지 않으면 ×", "옳으면 동그라미, 옳지 않으면 엑스예요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.8)
        self.pause_screen(5, "○일까요, ×일까요?")
        marks = VGroup(*[K.ox_mark(ok, 0.26).next_to(c_, LEFT, buff=0.22) for c_, (_, ok) in zip(cards, items)])
        self.say(f"⑴ {g('○')}  ⑵ {r('×')} 전 세계가 함께 겪어요  ⑶ {r('×')} 제도가 늦을 수 있어요",
                 "1번은 동그라미, 2번과 3번은 엑스예요. 환경 문제는 전 세계가 함께 겪고, 제도가 늦게 만들어지면 윤리 문제가 생길 수 있어요.")
        self.play(FadeIn(marks, lag_ratio=0.2), run_time=0.8)
        self.settle()
        clear_stage(self)
