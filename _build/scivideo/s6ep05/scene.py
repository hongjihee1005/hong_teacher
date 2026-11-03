"""「과학 원리 돋보기」 6학년 5화 — 생활 속 산과 염기 (6-1 1단원 산과 염기 7~8차시, 화 코드 6-1-1-e)

바탕: grade6/science/sem1/u1-5.html(원본 _build_tb/src/u1-5.html) — 도입(생선 요리에 레몬이 같이 나오는 까닭: 산성인 레몬즙이
비린내를 줄임), 분류(레몬즙·식초·변기 청소용 세제·구연산 용액 = 산성 / 제산제·제빵 소다 용액·욕실 청소용 표백제·하수구 세정제 = 염기성),
집 안에서 찾기 일곱 곳(앱 스크립트 HOT의 상황·답·설명), 성질과 이어 보기(속쓰림·하수구·도마), 한눈에 쏙(제산제 = 염기성 물질,
변기 청소용 세제 대신 콜라·탄산수·구연산 용액 같은 산성 용액).
최종: ./make_final.sh s6ep05
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, RoundedRectangle)

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


def place_card(pic, sit, w=3.1, h=4.3, x=0.0, y=0.45):
    """상황 카드: 위에 상황 글, 가운데 그림, 아래는 답 자리"""
    box = RoundedRectangle(corner_radius=0.2, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                           stroke_color=SOFT, stroke_width=4).move_to([x, y, 0])
    t = K.name_text(sit, 25)
    fit_in(t, w - 0.4, 0.9)
    t.move_to([x, y + h / 2 - 0.62, 0])
    fit_in(pic, w - 0.7, 1.45)
    pic.move_to([x, y + 0.12, 0])
    g_ = VGroup(box, t, pic)
    g_.ans_pos = [x, y - h / 2 + 0.72, 0]
    return g_


def answer(name, acid):
    col = K.ACID if acid else K.BASE
    t = K.name_text(f"{name}\n({'산성' if acid else '염기성'})", 26, col)
    return t


class S6Ep05(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 5
    EP_TITLE = "생활 속 산과 염기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.sort()
        self.house()
        self.why()
        self.summary()
        self.closing(f"{r('산성')}·{b('염기성')} 용액의 성질을 알면\n생활에서 {g('알맞게')} 이용할 수 있어요",
                     next_preview="6학년 6화 · 산성화가 환경에 주는 영향")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        dish = K.fish_plate(1.9).move_to([-2.8, 0.6, 0])
        self.say("생선 요리에 레몬이 같이 나오는 까닭은?",
                 "생선 요리에 레몬이 같이 나오는 까닭은 무엇일까요?")
        self.play(FadeIn(dish, shift=UP * 0.2), run_time=0.8)
        self.pause_screen(4, "레몬은 왜 함께 나올까요?")
        card = K.text_card([f"산성인 {o('레몬즙')}이", f"생선의 {g('비린내를 줄여')} 줘요"], w=5.4, size=34).move_to([3.3, 0.6, 0])
        self.say(f"산성인 {o('레몬즙')}이 생선의 {g('비린내를 줄여')} 줘요",
                 "산성인 레몬즙이 생선의 비린내를 줄여 주기 때문이에요. 접시를 예쁘게 꾸미려고만 올려 두는 것이 아니에요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 분류해요 ──
    def sort(self):
        self.section("조사해요")
        items = [("레몬즙", True), ("식초", True), ("변기 청소용 세제", True), ("구연산 용액", True),
                 ("제산제", False), ("제빵 소다 용액", False), ("욕실 청소용 표백제", False), ("하수구 세정제", False)]
        order = [0, 4, 1, 5, 6, 2, 7, 3]   # 섞어서 늘어놓기
        cards = [K.word_card(n, 3.1, 0.72, INK, 26) for n, _ in items]
        pool = VGroup(*[cards[k] for k in order]).arrange_in_grid(rows=2, cols=4, buff=(0.2, 0.2)).move_to([0.3, 1.75, 0])
        bins = VGroup(K.bin_box("산성 용액", 6.6, 2.95, K.ACID, 32), K.bin_box("염기성 용액", 6.6, 2.95, K.BASE, 32))
        bins.arrange(RIGHT, buff=0.2).move_to([0, -0.95, 0])
        self.say("우리 주변의 산성 용액과 염기성 용액",
                 "우리 주변에서 이용하는 용액들을 산성 용액과 염기성 용액으로 나누어 봐요.")
        self.play(FadeIn(pool, lag_ratio=0.06), FadeIn(bins), run_time=1.0)
        self.pause_screen(5, "어느 칸에 넣을까요?")
        mv = []
        for side, bx in ((True, bins[0]), (False, bins[1])):
            grp = [cards[k] for k, (_, a) in enumerate(items) if a == side]
            c0 = bx.box.get_center()
            for k, c in enumerate(grp):
                mv.append(c.animate.move_to(c0 + [-1.62 if k % 2 == 0 else 1.62, -0.0 - 0.9 * (k // 2), 0]))
        self.say(f"레몬즙·식초·변기 청소용 세제·구연산 용액은 {r('산성')}",
                 "레몬즙, 식초, 변기 청소용 세제, 구연산 용액은 산성 용액이고, 제산제, 제빵 소다 용액, 욕실 청소용 표백제, 하수구 세정제는 염기성 용액이에요.")
        self.play(*mv, run_time=1.6)
        self.say(f"제산제·제빵 소다 용액·표백제·하수구 세정제는 {b('염기성')}")
        self.settle()
        clear_stage(self)

    # ── 집 안에서 찾기 ──
    def house(self):
        self.section("집 안에서 찾기")
        kitchen = [(K.salad(1.3), "샐러드에\n신맛을 내고 싶어요", "레몬즙", True),
                   (K.cutting_board(1.0), "도마에서\n비린내가 나요", "식초", True),
                   (K.fruit(1.6), "과일 껍질에 남은\n농약을 없애고 싶어요", "제빵 소다 용액", False),
                   (K.antacid(1.2), "속이 쓰려요", "제산제", False)]
        xs = [-5.1, -1.7, 1.7, 5.1]
        tag = K.label("부엌", self.accent, 30).move_to([0, 2.95, 0])
        cards = VGroup(*[place_card(p, s_, 3.1, 4.3, x, 0.35) for (p, s_, _, _), x in zip(kitchen, xs)])
        self.say("부엌에서는 어떤 용액을 이용할까요?", "집 안에서 산성 용액과 염기성 용액을 이용하는 곳을 찾아봐요. 먼저 부엌이에요.")
        self.play(FadeIn(tag), FadeIn(cards, lag_ratio=0.12), run_time=1.2)
        ans = VGroup(*[answer(n, a).move_to(c.ans_pos) for (_, _, n, a), c in zip(kitchen, cards)])
        self.say(f"샐러드에는 {r('레몬즙')}, 비린내 나는 도마는 {r('식초')}로",
                 "레몬즙을 샐러드에 뿌려 신맛을 내요. 생선을 손질한 도마의 비린내는 염기성 물질 때문이라 산성인 식초로 닦으면 줄어요.")
        self.play(FadeIn(ans[0], shift=UP * 0.15), FadeIn(ans[1], shift=UP * 0.15), run_time=0.7)
        self.say(f"과일 껍질은 {b('제빵 소다 용액')}, 속이 쓰릴 땐 {b('제산제')}",
                 "제빵 소다 용액으로 과일 껍질에 남은 농약이나 주방의 기름때를 없애요. 속이 쓰릴 때는 염기성인 제산제를 먹어요.")
        self.play(FadeIn(ans[2], shift=UP * 0.15), FadeIn(ans[3], shift=UP * 0.15), run_time=0.7)
        self.settle()
        clear_stage(self)
        bath = [(K.toilet(1.4), "변기의 때와\n냄새를 없애고 싶어요", "변기 청소용 세제", True),
                (K.tile_wall(1.4), "욕실 벽의 찌든 때와\n세균을 없애고 싶어요", "욕실 청소용 표백제", False),
                (K.drain(1.6), "머리카락 때문에\n하수구가 막혔어요", "하수구 세정제", False)]
        xs = [-4.3, 0, 4.3]
        tag = K.label("욕실", self.accent, 30).move_to([0, 2.95, 0])
        cards = VGroup(*[place_card(p, s_, 3.6, 4.3, x, 0.35) for (p, s_, _, _), x in zip(bath, xs)])
        self.say("욕실에서는 어떤 용액을 이용할까요?", "이번에는 욕실이에요.")
        self.play(FadeIn(tag), FadeIn(cards, lag_ratio=0.12), run_time=1.0)
        self.pause_screen(4, "어떤 용액을 이용할까요?")
        ans = VGroup(*[answer(n, a).move_to(c.ans_pos) for (_, _, n, a), c in zip(bath, cards)])
        self.say(f"변기의 때와 냄새는 {r('변기 청소용 세제')}로",
                 "염기성 물질이 만든 변기의 때와 냄새를 산성인 변기 청소용 세제로 없애요.")
        self.play(FadeIn(ans[0], shift=UP * 0.15), run_time=0.6)
        self.say(f"욕실 벽은 {b('표백제')}, 막힌 하수구는 {b('하수구 세정제')}",
                 "단백질을 녹이는 염기성인 욕실 청소용 표백제로 욕실의 때와 세균을 없애고, 하수구 세정제로 머리카락이 막은 하수구를 뚫어요.")
        self.play(FadeIn(ans[1], shift=UP * 0.15), FadeIn(ans[2], shift=UP * 0.15), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 왜 그 용액을? ──
    def why(self):
        self.section("성질과 이어 보기")
        rows = [
            (K.antacid(0.9), [f"속이 쓰릴 때: {r('산성')}인 위액이 많이 나와요",
                              f"→ {b('염기성')}인 제산제를 먹어 위 속의 산성을 약하게 해요"]),
            (K.drain(1.0), [f"막힌 하수구: 머리카락의 주요 성분은 {o('단백질')}",
                            f"→ 단백질을 녹이는 {b('염기성')} 용액인 하수구 세정제"]),
            (K.cutting_board(0.7), [f"비린내 나는 도마: 비린내는 {b('염기성')}",
                                    f"→ {r('산성')} 용액인 식초로 닦아요"]),
        ]
        grp = VGroup()
        cards = VGroup(*[K.text_card(lines, w=10.6, size=27) for _, lines in rows]).arrange(DOWN, buff=0.2)
        cards.move_to([0.95, -0.05, 0])
        for (pic, _), card in zip(rows, cards):
            fit_in(pic, 1.3, 1.1).move_to([-5.9, card.get_y(), 0])
            grp.add(VGroup(pic, card))
        self.say("왜 그 용액을 이용할까요?", "왜 그 용액을 이용하는지 성질과 이어 볼까요?")
        self.play(FadeIn(grp[0], shift=UP * 0.2), run_time=0.7)
        self.say(f"위액은 {r('산성')}, 제산제는 {b('염기성')} — 산성을 약하게 해요",
                 "위에 산성인 위액이 많이 나와 속이 쓰릴 때, 염기성인 제산제를 먹어 위 속의 산성을 약하게 해요.")
        self.settle()
        self.play(FadeIn(grp[1], shift=UP * 0.2), run_time=0.7)
        self.say(f"하수구 세정제는 {b('염기성')} — 머리카락의 단백질을 녹여요",
                 "머리카락의 주요 성분인 단백질을 녹이는 염기성 용액인 하수구 세정제를 이용해요.")
        self.settle()
        self.play(FadeIn(grp[2], shift=UP * 0.2), run_time=0.7)
        self.say(f"염기성인 비린내를 {r('산성')}인 식초로 줄여요",
                 "도마의 비린내는 염기성이라, 산성 용액인 식초로 닦아 비린내를 줄여요.")
        self.settle()
        clear_stage(self)
        c1 = K.text_card([f"산성 용액과 염기성 용액은 {o('각각의 성질')}을 이용하기도 하고,",
                          f"섞었을 때 {g('성질이 변하는 것')}을 이용하기도 해요."], w=12.6, size=34).move_to([0, 0.6, 0])
        self.say(f"{o('각각의 성질')}도, 섞을 때 {g('성질이 변하는 것')}도 이용해요",
                 "산성 용액과 염기성 용액은 각각의 성질을 이용하기도 하고, 섞었을 때 성질이 변하는 것을 이용하기도 해요.")
        self.play(FadeIn(c1, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["산성 용액인 위액이 많이 나와 속이 쓰릴 때 먹는", f"제산제에는 {b('염기성')} 물질이 들어 있습니다."],
                           w=12.0, size=36).move_to([0, 1.55, 0])
        self.say(f"제산제에는 {b('염기성')} 물질이 들어 있어요",
                 "제산제에는 염기성 물질이 들어 있어서 위 속의 산성을 약하게 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        q = K.text_card([f"변기의 때를 없앨 때 변기 청소용 세제 대신 쓸 수 있는 것은?",
                         f"→ 콜라, 탄산수, 구연산 용액 같은 {r('산성 용액')}"], w=12.6, size=30).move_to([0, -0.75, 0])
        self.say(f"변기 세제 대신 콜라·탄산수·구연산 용액 같은 {r('산성 용액')}",
                 "변기 청소용 세제 대신에는 콜라, 탄산수, 구연산 용액 같은 산성 용액을 쓸 수 있어요.")
        self.play(FadeIn(q, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
