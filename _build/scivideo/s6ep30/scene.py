"""「과학 원리 돋보기」 6학년 30화 — 서로 다른 물질을 섞으면? (6-2 2단원 물질의 연소 1차시, 화 코드 6-2-2-a)

바탕: grade6/science/sem2/u2-1.html(원본 _build_tb/src2/u2-1.html) — 도입(소금과 설탕을 섞으면 짠맛·단맛이 함께, 우유에 코코아 가루),
실험(고무풍선 ㉮ 밀가루·㉯ 탄산수소 나트륨 두 숟가락 → 식초가 든 삼각 플라스크에 씌우고 동시에 세움, 안전),
결과 표(㉮ 고무풍선 변화 없음·밀가루가 가라앉음·성질 변하지 않음 / ㉯ 점점 부풀어 오름·보글거리며 기포·성질 변함),
그림 열어 보기 네 가지(설탕물·꿀물 → 변하지 않음, 우유+식초 덩어리·손난로 철 가루+산소 색깔·열 → 변함),
더 알아봐요(아이오딘-아이오딘화 칼륨 용액: 탄산수소 나트륨 변화 없음, 밀가루 청남색), 형성 평가(친구 2 '항상 변하지 않아'),
한눈에 쏙·생각이 쑥(설탕을 가열해 녹인 뒤 제빵 소다를 넣으면 부풀어 오름).
최종: ./make_final.sh s6ep30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform, Rectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u22 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="#2F6FD6">{s}</span>'


class S6Ep30(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 30
    EP_TITLE = "서로 다른 물질을 섞으면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.examples()
        self.iodine()
        self.fix()
        self.summary()
        self.closing(f"서로 다른 물질을 섞으면 물질의 성질이\n{o('변하기도 하고')}, {g('변하지 않기도 해요')}",
                     next_preview="6학년 31화 · 물질이 탈 때 나타나는 현상")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        salt = K.petri_dish("#FFFFFF", r=0.8).move_to([-4.6, 1.2, 0])
        sugar = K.petri_dish("#F7F1DE", r=0.8).move_to([-1.8, 1.2, 0])
        ls = T("소금", 32).next_to(salt, DOWN, buff=0.2)
        lg = T("설탕", 32).next_to(sugar, DOWN, buff=0.2)
        plus = T("+", 60).move_to([-3.2, 1.2, 0])
        q = K.text_card([f"소금과 설탕을 섞으면", "어떤 맛이 날까요?"], size=36).move_to([3.4, 1.2, 0])
        self.say("소금과 설탕을 섞으면 어떤 맛이 날까요?", "소금과 설탕을 섞으면 어떤 맛이 날까요?")
        self.play(FadeIn(VGroup(salt, sugar, ls, lg, plus)), FadeIn(q, shift=LEFT * 0.2), run_time=0.8)
        self.settle()
        a = K.text_card([f"{o('짠맛')}과 {o('단맛')}이 함께 나요"], size=34).move_to([-3.2, -1.2, 0])
        b = K.text_card(["우유에 코코아 가루를 섞어도", f"각 물질의 성질은 {g('변하지 않아요')}"], size=30).move_to([3.4, -1.0, 0])
        self.say(f"소금의 짠맛과 설탕의 단맛이 {o('함께')} 나요", "소금의 짠맛과 설탕의 단맛이 함께 나요. 우유에 코코아 가루를 섞어도 각 물질의 성질은 변하지 않아요.")
        self.play(FadeIn(a, shift=UP * 0.2), FadeIn(b, shift=UP * 0.2), run_time=0.8)
        self.settle()
        self.say(f"서로 다른 물질을 섞으면 성질은 {r('항상')} 변하지 않을까요?",
                 "그럼 서로 다른 물질을 섞으면 물질의 성질은 항상 변하지 않을까요? 실험으로 알아봐요.")
        self.play(Circumscribe(b, color=ORANGE), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def experiment(self):
        self.section("실험해요")
        base = K.table_top(14.0, -2.25)
        fa = K.flask_balloon("㉮ 밀가루", "#E2706A", "#FBF7EE", state="hang").scale(1.15).move_to([-4.6, -0.7, 0])
        fb = K.flask_balloon("㉯ 탄산수소 나트륨", "#5B8FD6", "#FFFFFF", state="hang").scale(1.15).move_to([-1.2, -0.7, 0])
        fa.shift(UP * (-2.25 - fa[1].get_bottom()[1]))
        fb.shift(UP * (-2.25 - fb[1].get_bottom()[1]))
        steps = K.text_card([f"① 고무풍선 ㉮에 {o('밀가루')},", f"    ㉯에 {o('탄산수소 나트륨')} 두 숟가락",
                             "② 식초가 든 삼각 플라스크에", "    고무풍선을 씌워요",
                             "③ 고무풍선 두 개를 동시에 세워요"], w=6.0, size=28).move_to([3.85, 0.0, 0])
        self.say("밀가루와 탄산수소 나트륨을 각각 식초와 섞어 봐요",
                 "고무풍선 가에는 밀가루를, 고무풍선 나에는 탄산수소 나트륨을 두 숟가락씩 넣고, 식초가 든 삼각 플라스크에 씌워요.")
        self.play(FadeIn(base), FadeIn(fa), FadeIn(fb), FadeIn(steps), run_time=0.9)
        self.settle()
        safe = K.safety_note("실험복·보안경·실험용 장갑 착용, 가루마다 다른 약숟가락, 정해진 양만 넣기", w=10.6, size=28).move_to([0.4, 2.45, 0])
        self.say("안전: 보안경과 장갑을 끼고, 정해진 양만 넣어요",
                 "실험복과 보안경, 실험용 장갑을 착용해요. 가루 물질마다 다른 약숟가락을 쓰고, 정해진 양만 넣어요. 너무 많으면 고무풍선이 터질 수 있어요.")
        self.play(FadeIn(safe), run_time=0.6)
        self.settle()
        self.pause_screen(5, "두 고무풍선은 어떻게 될까요?")
        fa2 = K.flask_balloon("㉮ 밀가루", "#E2706A", state="up", sunk=True).scale(1.15)
        fb2 = K.flask_balloon("㉯ 탄산수소 나트륨", "#5B8FD6", state="up", inflate=1.0, bubbles=1.0).scale(1.15)
        for new, old in ((fa2, fa), (fb2, fb)):
            new.move_to([old[1].get_center()[0], 0, 0])
            new.shift(UP * (-2.25 - new[1].get_bottom()[1]))
        res = K.text_card([f"㉮ 밀가루: {g('아무 변화가 없어요')}", "    (밀가루가 가라앉아요)",
                           f"㉯ 탄산수소 나트륨: {r('보글거리며')}", f"    {r('기포')}가 생기고 고무풍선이 {o('부풀어요')}"],
                          w=6.0, size=28).move_to([3.85, 0.0, 0])
        self.say(f"고무풍선 ㉯가 {o('부풀어 올랐어요')}",
                 "두 고무풍선을 동시에 세웠더니, 밀가루를 넣은 쪽 가는 아무 변화가 없고, 탄산수소 나트륨을 넣은 쪽 나는 보글거리며 기체가 생겨 고무풍선이 부풀었어요.")
        self.play(FadeOut(safe), FadeOut(steps), Transform(fa, fa2), Transform(fb, fb2), run_time=1.6)
        self.play(FadeIn(res, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        tab = K.result_table(["구분", "밀가루와 식초", "탄산수소 나트륨과 식초"],
                             [["고무풍선의 변화", "아무런 변화가 없다", "점점 부풀어 오른다"],
                              ["삼각 플라스크 안", "밀가루가 가라앉는다", "보글거리며 기포가 생긴다"],
                              ["물질의 성질 변화", "변하지 않는다", "변한다"]],
                             [3.2, 4.0, 4.4], row_h=0.85, size=28).move_to([0, 0.5, 0])
        self.say(f"탄산수소 나트륨과 식초를 섞으면 성질이 {o('변해요')}",
                 "결과를 정리해요. 밀가루와 식초는 아무 변화가 없었지만, 탄산수소 나트륨과 식초는 기포가 생기고 고무풍선이 부풀어 물질의 성질이 변했어요.")
        self.play(FadeIn(tab), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 정리: 그림 열어 보기 ──
    def examples(self):
        self.section("정리해요")
        def cup(col, stroke, lumps=False):
            gg = VGroup(K.rr(1.0, 1.1, col, 0, 0, stroke=stroke, sw=4, r=0.08))
            if lumps:
                for x, y in ((-0.2, -0.2), (0.15, -0.3), (0.25, 0.0), (-0.1, 0.1)):
                    gg.add(K.C(0.1, "#EFE8CF", x, y, stroke="#CFC6A4", sw=2))
            return gg
        pad = K.rr(1.3, 1.0, "#C46A4A", 0, 0, stroke=INK, sw=3, r=0.15)
        hand = VGroup(pad, K.heat_waves(3, 0.5).next_to(pad, UP, buff=0.05))
        items = [(cup("#E6F2FA", "#8FB1C6"), "물 + 설탕", "단맛이 그대로\n→ 변하지 않아요", False),
                 (cup("#F7E2A6", "#C9A03A"), "물 + 꿀", "꿀의 단맛이 그대로\n→ 변하지 않아요", False),
                 (cup("#FBFAF5", "#BFB9A8", True), "우유 + 식초", "덩어리가 생겨요\n→ 변해요", True),
                 (hand, "손난로 철 가루 + 산소", "색깔이 변하고 열이 나요\n→ 변해요", True)]
        cards = VGroup()
        for pic, nm, txt, ch in items:
            c = K.case_card(pic, nm, txt, w=3.15, h=3.9, size=24, head=26)
            if ch:
                c.box.set_stroke(RED, 5)
            else:
                c.box.set_stroke(GREEN, 5)
            cards.add(c)
        cards.arrange(RIGHT, buff=0.22).move_to([0, 0.55, 0])
        self.say(f"성질이 {g('변하지 않는')} 예: 설탕물, 꿀물",
                 "물에 설탕이나 꿀을 섞으면 단맛이 그대로 나요. 물질의 성질이 변하지 않았어요.")
        self.play(FadeIn(cards[:2], lag_ratio=0.3), run_time=1.0)
        self.settle()
        self.say(f"성질이 {r('변하는')} 예: 우유와 식초, 손난로",
                 "우유에 식초를 섞으면 덩어리가 생기고, 손난로 속 철 가루가 산소와 섞이면 색깔이 변하고 열이 발생해요. 물질의 성질이 변했어요.")
        self.play(FadeIn(cards[2:], lag_ratio=0.3), run_time=1.0)
        self.settle()
        tip = K.text_card([f"설탕·소금이 물에 녹아 안 보여도 단맛·짠맛은 {g('그대로')}"], size=28).move_to([0, -2.15, 0])
        self.say("물에 녹아 보이지 않아도 단맛, 짠맛은 그대로예요",
                 "설탕이나 소금이 물에 녹아 눈에 보이지 않아도 단맛이나 짠맛 같은 성질은 그대로예요. 물을 증발시키면 다시 얻을 수 있어요.")
        self.play(FadeIn(tip, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 더 알아봐요 ──
    def iodine(self):
        self.section("더 알아봐요")
        pa = K.petri_dish("#FFFFFF", r=1.2).move_to([-3.2, 0.2, 0])
        pb = K.petri_dish("#FFFFFF", r=1.2).move_to([3.2, 0.2, 0])
        na = T("탄산수소 나트륨", 32).next_to(pa, DOWN, buff=0.3)
        nb = T("밀가루", 32).next_to(pb, DOWN, buff=0.3)
        q = K.text_card(["둘 다 알갱이가 매우 작은 흰 가루 —", "아이오딘-아이오딘화 칼륨 용액을 떨어뜨리면?"], size=30).move_to([1.0, 2.1, 0])
        self.say("흰 가루 두 가지에 아이오딘-아이오딘화 칼륨 용액을 떨어뜨려요",
                 "탄산수소 나트륨과 밀가루는 둘 다 알갱이가 매우 작은 흰 가루예요. 아이오딘-아이오딘화 칼륨 용액을 떨어뜨려 봐요.")
        self.play(FadeIn(VGroup(pa, pb, na, nb)), FadeIn(q), run_time=0.8)
        self.settle()
        pa2 = K.petri_dish("#FFFFFF", drop="#C98B3A", r=1.2).move_to(pa)
        pb2 = K.petri_dish("#FFFFFF", drop="#2B2F7A", r=1.2).move_to(pb)
        ra = K.label("변화 없음 (용액 색 그대로)", INK, 26).next_to(na, DOWN, buff=0.2)
        rb = K.label("청남색으로 변해요", "#2B2F7A", 28).next_to(nb, DOWN, buff=0.2)
        self.say(f"{bl('밀가루')}가 청남색으로 변했어요 — 성질이 변한 쪽은 밀가루예요",
                 "탄산수소 나트륨은 아무 변화가 없고, 밀가루는 청남색으로 변했어요. 물질의 성질이 변한 것은 밀가루와 아이오딘-아이오딘화 칼륨 용액 쪽이에요.")
        self.play(Transform(pa, pa2), Transform(pb, pb2), run_time=0.8)
        self.play(FadeIn(ra), FadeIn(rb), run_time=0.5)
        self.settle()
        safe = K.safety_note("용액이 피부에 닿거나 눈에 들어가지 않게 보안경과 실험용 장갑을 써요", size=28).move_to([0, 2.25, 0])
        self.say("안전: 용액이 눈에 들어가지 않게 보안경을 써요", "용액이 피부에 닿거나 눈에 들어가지 않게 보안경과 실험용 장갑을 써요.")
        self.play(FadeOut(q), FadeIn(safe), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def fix(self):
        self.section("생각 바로잡기")
        bub = K.text_card([f"“서로 다른 물질을 섞으면 물질의 성질은 {r('항상')} 변하지 않아.”"], size=32).move_to([0, 1.6, 0])
        x = K.ox_mark(False, 0.4).next_to(bub, LEFT, buff=0.3)
        ans = K.text_card([f"탄산수소 나트륨과 식초처럼 성질이 {o('변하기도')} 하고,",
                           f"설탕물처럼 {g('변하지 않기도')} 해요"], size=32).move_to([0, -0.6, 0])
        self.say(f"섞으면 성질이 '{r('항상')}' 변하지 않을까요?", "어떤 친구가 서로 다른 물질을 섞으면 성질은 항상 변하지 않는다고 말했어요. 맞을까요?")
        self.play(FadeIn(bub), run_time=0.6)
        self.settle()
        self.say(f"아니에요. {o('변하기도')} 하고 {g('변하지 않기도')} 해요",
                 "아니에요. 서로 다른 물질을 섞었을 때 물질의 성질이 변하기도 하고, 변하지 않기도 해요.")
        self.play(FadeIn(x), FadeIn(ans, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        fb = K.flask_balloon("", "#5B8FD6", state="up", inflate=1.0, bubbles=1.0).scale(1.05).move_to([-4.4, -0.3, 0])
        card = K.text_card([f"탄산수소 나트륨과 식초를 섞으면", f"물질의 성질이 {o('변')}{o('합')}니다."], w=7.2, size=38).move_to([2.4, 0.9, 0])
        life = K.text_card(["생활 속: 설탕을 가열해 녹인 뒤", f"제빵 소다를 넣으면 {o('부풀어 올라요')}"], w=7.2, size=30).move_to([2.4, -1.25, 0])
        self.say(f"탄산수소 나트륨과 식초를 섞으면 성질이 {o('변해요')}",
                 "탄산수소 나트륨과 식초를 섞으면 기체가 발생하며 물질의 성질이 변해요.")
        self.play(FadeIn(fb), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        self.settle()
        self.say(f"설탕 + 제빵 소다 → {o('부풀어 올라요')}",
                 "우리 주변에도 예가 있어요. 설탕을 가열해 녹인 뒤 제빵 소다를 넣으면 부풀어 올라요. 성질이 변하는 예예요.")
        self.play(FadeIn(life, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
