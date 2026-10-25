"""「과학 원리 돋보기」 3학년 27화 — 바닷가에는 어떤 지형이 있을까? (3-2 2단원 지구의 모습 6차시, 화 코드 3-2-2-d)

바탕: grade3/science/sem2/u2-4.html — 학습 목표, '지형: 땅의 생김새', 검색어 고르기(바닷가 지형·해변·바닷가 동굴·바닷가 절벽·
바닷가 지형 360도), 바닷가 지형 6가지(넓은 모래 해변·가파른 절벽·바닷가 동굴·구멍 뚫린 바위·바위 기둥·갯벌)의 설명,
영상 관찰 문제 4개(물보라 → 절벽, 굴 → 동굴, 게 → 갯벌, 건너편 배 → 구멍 뚫린 바위), 교과서 사진 장소(신안군·옹진군·제주시·울릉군),
'옳은 것 모두 고르기'(㉠ ㉢ 맞음, ㉡ 지형은 곳에 따라 모습이 서로 다름). 이 차시는 지형이 만들어지는 원리를 다루지 않음(앱 출처 줄).
앱에 '한눈에 쏙'이 없어 마무리는 학습 목표와 고르기 문제 ㉠으로 씀.
최종: ./make_final.sh s3ep27
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, LaggedStart,
                   SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u22 as K
from kit_s3u12 import text_card, ox_mark


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


NAMES = ["넓은 모래 해변", "가파른 절벽", "바닷가 동굴", "구멍 뚫린 바위", "바위 기둥", "갯벌"]
DESC = {
    "넓은 모래 해변": "고운 모래가 넓고 평평하게 펼쳐져 있어요",
    "가파른 절벽": "바위가 벽처럼 가파르고 높게 서 있어요",
    "바닷가 동굴": "바위에 굴이 뚫려 바닷물이 드나들어요",
    "구멍 뚫린 바위": "가운데에 큰 구멍이 뚫려 건너편이 보여요",
    "바위 기둥": "바다 위에 바위가 기둥처럼 우뚝 솟아 있어요",
    "갯벌": "썰물 때 드러나는 편평한 땅, 게가 살아요",
}


class S3Ep27(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 27
    EP_TITLE = "바닷가에는 어떤 지형이 있을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.search()
        self.gallery()
        self.detective()
        self.places()
        self.check()
        self.closing(f"바닷가에서는 모래 해변, 절벽, 동굴 등\n{o('다양한 지형')}을 볼 수 있어요",
                     next_preview="3학년 28화 · 밀물과 썰물")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        pics = VGroup(K.landform("넓은 모래 해변", 3.0, 2.0, label=False), K.landform("가파른 절벽", 3.0, 2.0, label=False),
                      K.landform("갯벌", 3.0, 2.0, label=False)).arrange(RIGHT, buff=0.5).move_to([0, 0.9, 0])
        self.say("바닷가에서 본 것 중에 기억나는 것이 있나요?",
                 "바닷가에 가 본 적이 있나요? 넓은 모래사장, 높은 절벽, 진흙이 많은 갯벌처럼 기억나는 모습이 있나요?")
        self.play(LaggedStart(*[FadeIn(p, shift=UP * 0.2) for p in pics], lag_ratio=0.3), run_time=1.2)
        word = M(f"{o('지형')} : 땅의 생김새", 54).move_to([0, -1.25, 0])
        self.say(f"{o('지형')}은 땅의 생김새예요", "오늘은 바닷가의 지형을 조사해요. 지형은 땅의 생김새를 말해요.")
        self.play(FadeIn(word, scale=0.85), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 검색어 ──
    def search(self):
        self.section("계획해요")
        words = ["바닷가 지형", "우주 정거장", "해변", "바닷가 동굴", "사막 낙타", "바닷가 절벽", "놀이공원", "바닷가 지형 360도"]
        good = {"바닷가 지형", "해변", "바닷가 동굴", "바닷가 절벽", "바닷가 지형 360도"}
        tags = VGroup(*[tag(w, INK, 36) for w in words])
        rows = [VGroup(*tags[0:3]), VGroup(*tags[3:6]), VGroup(*tags[6:8])]
        for k, row in enumerate(rows):
            row.arrange(RIGHT, buff=0.6).move_to([0, 1.55 - k * 1.35, 0])
        self.say("바닷가 지형을 조사하려면 어떤 검색어가 좋을까요?",
                 "바닷가 지형을 조사하려면 어떤 검색어로 영상이나 사진을 찾으면 좋을까요?")
        self.play(LaggedStart(*[FadeIn(t, scale=0.8) for t in tags], lag_ratio=0.1), run_time=1.2)
        self.pause_screen(4, "알맞은 검색어는 무엇일까요?")
        marks = VGroup()
        for w, t in zip(words, tags):
            m = ox_mark(w in good, 0.22).next_to(t, UP, buff=0.05)
            marks.add(m)
        self.say(f"{g('바닷가 지형, 해변, 바닷가 동굴, 바닷가 절벽')} 같은 검색어가 좋아요",
                 "바닷가 지형, 해변, 바닷가 동굴, 바닷가 절벽, 바닷가 지형 360도 같은 검색어가 좋아요. 우주 정거장이나 놀이공원은 관계가 없어요.")
        self.play(FadeIn(marks, lag_ratio=0.1), *[t.animate.set_opacity(0.35) for w, t in zip(words, tags) if w not in good],
                  run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 지형 도감 ──
    def gallery(self):
        self.section("조사해요")
        cards = VGroup()
        for i, n in enumerate(NAMES):
            c = K.landform(n, 3.3, 1.55, 32)
            d = T(DESC[n], 24, SOFT).next_to(c, DOWN, buff=0.08)
            if d.width > 4.1:
                d.scale_to_fit_width(4.1)
            grp = VGroup(c, d)
            grp.move_to([-4.5 + (i % 3) * 4.5, 1.5 - (i // 3) * 2.75, 0])
            cards.add(grp)
        self.cards = cards
        self.say("바닷가에는 어떤 지형이 있는지 살펴봐요", "영상과 사진으로 바닷가에 어떤 지형이 있는지 살펴봐요.")
        narr = [
            ("넓은 모래 해변", "넓은 모래 해변은 고운 모래가 넓고 평평하게 펼쳐져 있어서 모래성을 쌓을 수 있어요."),
            ("가파른 절벽", "가파른 절벽은 바위가 벽처럼 가파르고 높게 서 있어요. 파도가 부딪히면 하얀 물보라가 튀어요."),
            ("바닷가 동굴", "바닷가 동굴은 바위에 굴이 뚫려 있어서, 그 안으로 바닷물이 드나들어요."),
            ("구멍 뚫린 바위", "구멍 뚫린 바위는 가운데에 커다란 구멍이 뚫려 있어서 건너편이 보여요."),
            ("바위 기둥", "바위 기둥은 바다 위에 바위가 기둥처럼 우뚝 솟아 있어요."),
            ("갯벌", "갯벌은 썰물 때 드러나는 편평한 땅이에요. 작은 구멍이 많고 게가 살아요."),
        ]
        for i, (n, nar) in enumerate(narr):
            self.say(f"{o(n)}: {DESC[n]}", nar)
            self.play(FadeIn(cards[i], shift=UP * 0.2), run_time=0.5)
        self.settle()

    # ── 지형 탐정 ──
    def detective(self):
        self.section("지형 탐정")
        cards = self.cards
        self.play(*[c[1].animate.set_opacity(0) for c in cards], run_time=0.4)
        qs = [("파도가 부딪히며 하얀 물보라가 튀는 곳은?", "가파른 절벽"),
              ("바닷물이 굴 안으로 들어갔다가 다시 나오는 곳은?", "바닷가 동굴"),
              ("물이 빠지자 편평한 땅이 드러나고 게가 나온 곳은?", "갯벌"),
              ("가운데가 뚫려 건너편으로 지나가는 배가 보이는 곳은?", "구멍 뚫린 바위")]
        q0, a0 = qs[0]
        self.say(q0, "지형 탐정 놀이를 해요. " + q0.replace("곳은?", "곳은 어디일까요?"))
        self.pause_screen(4, "어떤 지형일까요?")
        for k, (q, a) in enumerate(qs):
            c = cards[NAMES.index(a)][0]
            box = SurroundingRectangle(c, color=GREEN, buff=0.08, corner_radius=0.1)
            if k > 0:
                self.say(q, q.replace("곳은?", "곳은 어디일까요?") + f" 바로 {a}예요.")
            else:
                self.say(f"정답은 {g(a)}", f"정답은 {a}예요.")
            self.play(Create(box), Indicate(c, color=GREEN, scale_factor=1.06), run_time=0.8)
            self.play(FadeOut(box), run_time=0.3)
        self.settle()
        clear_stage(self)

    # ── 교과서 사진 장소 ──
    def places(self):
        self.section("어디에 있을까?")
        rows = [("넓은 모래 해변", "전남 신안군"), ("가파른 절벽", "인천 옹진군"),
                ("바닷가 동굴", "제주특별자치도 제주시"), ("구멍 뚫린 바위", "경상북도 울릉군")]
        grp = VGroup()
        for i, (n, p) in enumerate(rows):
            pic = K.landform(n, 1.8, 1.1, label=False)
            nm = T(n, 36, ORANGE)
            pl = T(p, 36, INK)
            row = VGroup(pic, nm, pl)
            y = 2.1 - i * 1.3
            pic.move_to([-4.6, y, 0])
            nm.move_to([-3.4, y, 0], aligned_edge=LEFT)
            pl.move_to([0.8, y, 0], aligned_edge=LEFT)
            grp.add(row)
        self.say("교과서 사진 속 지형은 우리나라 어디에 있을까요?",
                 "교과서 사진 속 바닷가 지형은 우리나라 어디에서 볼 수 있을까요?")
        self.play(FadeIn(VGroup(*[r_[0] for r_ in grp]), lag_ratio=0.2), FadeIn(VGroup(*[r_[1] for r_ in grp]), lag_ratio=0.2),
                  run_time=1.0)
        self.say("신안군 · 옹진군 · 제주시 · 울릉군",
                 "넓은 모래 해변은 전남 신안군, 가파른 절벽은 인천 옹진군, 바닷가 동굴은 제주시, 구멍 뚫린 바위는 경북 울릉군에서 찍은 사진이에요.")
        self.play(LaggedStart(*[FadeIn(r_[2], shift=LEFT * 0.2) for r_ in grp], lag_ratio=0.3), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        items = [("㉠", "바닷가에서는 가파른 절벽이나 동굴 등 다양한 지형을 볼 수 있다.", True),
                 ("㉡", "바닷가 지형은 세계 어느 곳에서나 모습이 모두 같다.", False),
                 ("㉢", "바닷가에서는 바닷물의 높이가 높아지거나 낮아지기도 한다.", True)]
        grp = VGroup()
        for i, (k, t, ok) in enumerate(items):
            kk = T(k, 36, ORANGE)
            tt = T(t, 32, INK)
            if tt.width > 11.0:
                tt.scale_to_fit_width(11.0)
            kk.move_to([-5.9, 1.7 - i * 1.15, 0])
            tt.move_to([-5.4, 1.7 - i * 1.15, 0], aligned_edge=LEFT)
            grp.add(VGroup(kk, tt))
        self.say("바닷가에서 볼 수 있는 모습으로 옳은 것은?", "바닷가에서 볼 수 있는 모습으로 옳은 것을 모두 골라 볼까요?")
        self.play(FadeIn(grp, lag_ratio=0.2), run_time=1.0)
        self.pause_screen(5, "옳은 것을 모두 골라요")
        marks = VGroup(*[ox_mark(ok, 0.3).move_to(grp[i][0]) for i, (_, _, ok) in enumerate(items)])
        self.say(f"정답은 {g('㉠, ㉢')} — 바닷가 지형은 곳에 따라 모습이 서로 달라요",
                 "정답은 ㉠과 ㉢이에요. 바닷가 지형은 곳에 따라 모습이 서로 달라요.")
        self.play(FadeIn(marks, scale=0.7), grp[1].animate.set_opacity(0.4), run_time=0.7)
        nxt = T("바닷물의 높이 변화는 다음 시간에 알아봐요!", 34, BLUE).move_to([0, -1.75, 0])
        self.say(f"㉢ 바닷물의 높이 변화는 {o('다음 시간')}에 알아봐요",
                 "㉢처럼 바닷가에서는 바닷물의 높이가 높아지거나 낮아지기도 해요. 이것은 다음 시간에 알아봐요.")
        self.play(FadeIn(nxt), run_time=0.5)
        self.settle()
        clear_stage(self)
