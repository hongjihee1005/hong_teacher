"""「과학 원리 돋보기」 5학년 36화 — 열의 이동을 어떻게 막을까? (5-2 3단원 열과 우리 생활 9차시, 화 코드 5-2-3-g)

바탕: grade5/science/sem2/u3-7.html(원본 _build_tb/src2/u3-7.html) — 도입(추울 때 창문 닫기, 보온병 → 단열),
조사 카드(보온 도시락 · 이중창 · 소방 보호 장비 · 보온병 · 겹쳐 입은 옷 · 잠수복 · 아이스박스 · 주방 장갑 · 냄비 받침대 · 양산,
출처 없는 자료는 확인), 단열 사례 정리 표(창문 대류 · 양산 복사 · 주방 장갑·냄비 받침대 전도가 잘되지 않는 재료 · 겹쳐 입은 옷),
단열 재료(나무·고무·실리콘 ○, 구리판 ×), 생각 바로잡기(보온병은 차가운 것도 유지), 얼음주머니는 단열이 아님, 한눈에 쏙(단열).
(EPISODES.md의 '공기층·스타이로폼, 보온병 단면'은 앱에 없어 넣지 않음.)
최종: ./make_final.sh s5ep36
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, GrowArrow, Cross)

from series_style import GREEN, INK, ORANGE, SOFT, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep36(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 36
    EP_TITLE = "열의 이동을 어떻게 막을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.research()
        self.table()
        self.materials()
        self.summary()
        self.closing(f"열의 이동을 막는 것을 {o('단열')}이라고 해요",
                     next_preview="5학년 마인드맵 7 · 열과 우리 생활")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        win = K.window_closed().scale(1.2).move_to([-3.6, 0.8, 0])
        t1 = T("추울 때 창문 닫기", 30).next_to(win, DOWN, buff=0.3)
        th = K.thermos().scale(1.1).move_to([3.0, 0.8, 0])
        hot = K.cup("#F7B2A5", "", w=0.9, h=1.0, steam=True).next_to(th, LEFT, buff=0.35).align_to(th, DOWN)
        cold = K.cup("#A9D4F2", "", w=0.9, h=1.0, ice=True).next_to(th, RIGHT, buff=0.35).align_to(th, DOWN)
        t2 = T("보온병", 30).next_to(th, DOWN, buff=0.3)
        self.say("추울 때 창문을 닫으면 어떤 점이 좋을까요?",
                 "추울 때 창문을 닫으면 어떤 점이 좋을까요? 보온병을 사용하면 어떤 점이 좋을까요?")
        self.play(FadeIn(win), FadeIn(t1), FadeIn(th), FadeIn(t2), run_time=0.7)
        self.pause_screen(4, "창문과 보온병의 좋은 점은?")
        a1 = K.lines("차가운 공기가 실내로\n들어오는 것을 막아요", 26, K.COLD).move_to([-3.6, -1.65, 0])
        self.say(f"창문을 닫으면 차가운 공기가 들어오는 것을 {o('막아요')}",
                 "창문을 닫으면 차가운 공기가 실내로 들어오는 것을 막을 수 있어요. 공기의 대류를 막아 실내 온도를 거의 일정하게 유지해요.")
        self.play(FadeIn(a1), run_time=0.5)
        self.settle()
        a2 = K.lines("따뜻한 물은 따뜻하게,\n차가운 물은 차갑게 오래 유지해요", 26, INK).move_to([3.0, -1.65, 0])
        self.say(f"보온병은 따뜻한 것도, {g('차가운 것도')} 오래 유지해요",
                 "보온병에 따뜻한 물을 담으면 오랫동안 따뜻하게, 차가운 물을 담으면 오랫동안 차갑게 마실 수 있어요.")
        self.play(FadeIn(hot), FadeIn(cold), FadeIn(a2), run_time=0.6)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"열의 이동을 막는 것 → {o('단열')}"], size=50).move_to([0, 0.6, 0])
        self.section("단열")
        self.say(f"이처럼 열의 이동을 막는 것을 {o('단열')}이라고 해요",
                 "이처럼 열의 이동을 막는 것을 단열이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 조사해요 ──
    def research(self):
        self.section("단열 사례 조사")
        items = [("보온 도시락", "밥·국을 따뜻하게"), ("이중창", "건물 안 온도를 일정하게"), ("소방 보호 장비", "뜨거운 열로부터 보호"),
                 ("아이스박스", "음료를 오랫동안 차갑게"), ("겹쳐 입은 옷", "몸의 열이 빠져나가지 않게"), ("잠수복", "체온을 유지")]
        cards = VGroup()
        for a, b in items:
            box = K.R(4.0, 1.25, PAPER, 0, 0, rad=0.16, stroke=ORANGE, sw=4)
            ta = T(a, 32, ORANGE)
            tb = T(b, 24, INK)
            VGroup(ta, tb).arrange(DOWN, buff=0.1).move_to(box)
            cards.add(VGroup(box, ta, tb))
        cards.arrange_in_grid(2, 3, buff=(0.3, 0.3)).move_to([0, 0.95, 0])
        self.say("우리 생활에서 단열을 이용하는 예를 조사해요",
                 "단열, 보온 같은 검색어로 생활 속에서 단열을 이용하는 예를 조사해요. 보온 도시락, 이중창, 소방 보호 장비, 아이스박스, 겹쳐 입은 옷, 잠수복 등이 있어요.")
        self.play(FadeIn(cards, lag_ratio=0.12), run_time=1.2)
        self.settle()
        bad = K.text_card([f"'단열은 열을 새로 만들어 내는 기술이래요! 출처는 비밀~'",
                           f"→ {r('출처가 없고 사실과 달라요')}. 조사한 내용이 정확한지 확인하고 출처를 적어요"],
                          w=12.8, size=27).move_to([0, -1.55, 0])
        self.say(f"조사한 내용이 정확한지 확인하고 {g('출처')}를 꼭 적어요",
                 "출처가 없는 자료는 조심해요. 단열은 열을 만드는 것이 아니라 열의 이동을 막는 거예요. 조사한 내용이 정확한지 확인하고 출처를 꼭 적어요.")
        self.play(FadeIn(bad, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 단열 사례 정리 ──
    def table(self):
        self.section("어떻게 막을까?")
        rows = [("추울 때 창문을 닫아요", f"공기의 {o('대류')}를 막아 실내 온도를 거의 일정하게"),
                ("여름철 양산을 써요", f"햇빛을 가려 {o('복사')}를 막아요"),
                ("주방 장갑·냄비 받침대", f"{o('전도')}가 잘되지 않는 재료로 열의 이동을 막아요"),
                ("겨울철 옷을 겹쳐 입어요", "몸의 열이 밖으로 빠져나가는 것을 막아요")]
        pics = [K.window_closed(), K.parasol(), VGroup(K.mitt(), K.pot_on_stand().shift(RIGHT * 1.7)), K.coat_layers()]
        lines = VGroup()
        for (a, b), p in zip(rows, pics):
            K.fit(p, 1.0, 0.8)
            ta = T(a, 28, INK)
            tb = M(b, 28)
            row = VGroup(p, ta, tb)
            p.move_to([-5.8, 0, 0])
            ta.move_to([-5.1, 0, 0], aligned_edge=LEFT)
            tb.move_to([-0.6, 0, 0], aligned_edge=LEFT)
            if tb.get_right()[0] > 6.9:
                tb.scale_to_fit_width(7.4).move_to([-0.6, 0, 0], aligned_edge=LEFT)
            lines.add(row)
        lines.arrange(DOWN, buff=0.34, aligned_edge=LEFT).move_to([0, 0.25, 0])
        self.say("우리는 단열을 어떻게 이용할까요?",
                 "우리는 생활에서 단열을 어떻게 이용할까요? 무엇의 이동을 막는지 생각해 봐요.")
        self.play(FadeIn(VGroup(*[VGroup(x[0], x[1]) for x in lines]), lag_ratio=0.15), run_time=1.0)
        self.settle()
        narr = ["추울 때 창문을 닫으면 공기의 대류를 막아 실내 온도를 거의 일정하게 유지해요.",
                "여름철 양산은 햇빛을 가려 복사를 막아요.",
                "주방 장갑과 냄비 받침대는 고무, 나무, 실리콘처럼 전도가 잘되지 않는 재료로 열의 이동을 막아요.",
                "옷을 여러 벌 겹쳐 입으면 몸의 열이 밖으로 빠져나가는 것을 막아요."]
        subs = [f"창문 닫기: {o('대류')}를 막아요", f"양산: {o('복사')}를 막아요",
                f"주방 장갑·냄비 받침대: {o('전도')}가 잘 안 되는 재료", "겹쳐 입은 옷: 몸의 열이 빠져나가지 않게"]
        for i in range(4):
            self.say(subs[i], narr[i])
            self.play(FadeIn(lines[i][2], shift=LEFT * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 단열 재료 ──
    def materials(self):
        self.section("단열이 잘되는 재료")
        mats = [("나무", "#C49A6C", True), ("구리판", K.CU, False), ("고무", "#3A3A3A", True), ("실리콘", "#5DA9E9", True)]
        cards = VGroup()
        for n, c, ok in mats:
            sw = K.R(1.6, 1.0, c, 0, 0, rad=0.12, stroke=INK, sw=3)
            cards.add(K.pic_card(sw, n, 2.8, 2.4, 32))
        cards.arrange(RIGHT, buff=0.4).move_to([0, 1.1, 0])
        self.say("냄비 받침대나 주방 장갑을 만들기 알맞은 재료는?",
                 "냄비 받침대나 주방 장갑을 만들기 알맞은 재료를 모두 골라 볼까요?")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.9)
        self.pause_screen(4, "알맞은 재료를 모두 골라 보세요")
        marks = VGroup(*[K.ox_mark(ok, 0.45).move_to(c.box.get_center() + UP * 0.25) for c, (_, _, ok) in zip(cards, mats)])
        self.say(f"{g('나무·고무·실리콘')}은 전도가 잘되지 않아 단열이 잘돼요",
                 "나무, 고무, 실리콘은 전도가 잘되지 않아 단열이 잘돼요. 구리판은 전도가 잘되어 알맞지 않아요.")
        self.play(FadeIn(marks, scale=0.6, lag_ratio=0.15), run_time=0.8)
        self.settle()
        a = K.text_card(["보온병에 얼음물을 담아도 오랫동안 차갑게 유지될까요?",
                         f"→ {g('네')}, 단열이 잘되는 병이라 차가운 것도 오래 유지돼요"], w=12.4, size=28).move_to([0, -1.55, 0])
        self.say(f"보온병은 {g('차가운 물이나 얼음')}도 오랫동안 차갑게 유지해요",
                 "생각 바로잡기! 보온병은 단열이 잘되는 병이라서 따뜻한 것뿐만 아니라 차가운 물이나 얼음도 오랫동안 차갑게 유지할 수 있어요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        head = K.C(0.7, "#FFD9B0", -3.0, 0.8, stroke="#D8A77A", sw=3)
        pack = K.R(1.1, 0.5, "#A9D4F2", -3.0, 1.35, rad=0.2, stroke=K.COLD, sw=3)
        ar = K.heat_arrow((-3.0, 1.0), (-3.0, 1.75), sw=7)
        x = K.ox_mark(False, 0.45).move_to([-1.2, 1.0, 0])
        t = K.lines("열이 날 때 이마에 대는 얼음주머니는\n이마의 열이 얼음주머니로 이동하게 하는 것\n→ 열의 이동을 막는 단열이 아니에요", 30).move_to([2.9, 0.9, 0])
        self.section("헷갈리기 쉬워요")
        self.say(f"이마에 대는 얼음주머니는 단열이 {r('아니에요')}",
                 "열이 날 때 이마에 대는 얼음주머니는 이마의 열이 얼음주머니로 이동하게 하는 거예요. 열의 이동을 막는 단열이 아니에요.")
        self.play(FadeIn(head), FadeIn(pack), GrowArrow(ar), FadeIn(t), run_time=0.8)
        self.play(FadeIn(x, scale=0.6), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"열의 이동을 막는 것을 {o('단열')}(이)라고 합니다."], w=11.0, size=44).move_to([0, 1.0, 0])
        self.say(f"열의 이동을 막는 것: {o('단열')}",
                 "열의 이동을 막는 것을 단열이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        more = K.text_card([f"단열을 이용하지 못한다면? → 도시락의 음식이 {r('식어')} 불편해요"], size=34).move_to([0, -1.1, 0])
        self.say(f"단열이 없다면 도시락의 음식이 금방 {r('식어요')}",
                 "단열을 이용하지 못한다면 도시락을 쌀 때 음식을 오랫동안 따뜻하게 유지할 수 없어 음식이 식어 불편해요.")
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
