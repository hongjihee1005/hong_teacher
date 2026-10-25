"""「과학 원리 돋보기」 5학년 4화 — 여러 가지 화석 (5-1 1단원 지층과 화석 5차시, 화 코드 5-1-1-d)

바탕: grade5/science/sem1/u1-4.html(원본 _build_tb/src/u1-4.html) — 도입(흙더미를 털어 공룡 뼈 찾기: 단단한 뼈 부분이 남음),
화석 6가지 관찰(삼엽충·고사리·물고기·암모나이트·은행잎·새 발자국: 생김새와 닮은 오늘날의 생물 — 앱 글 그대로),
몸체/흔적 분류(삼엽충·고사리·솔방울·공룡 뼈 / 새 발자국·공룡 발자국·공룡 배설물), 알게 된 점(종류와 크기 다양, 흔적도 화석,
오늘날 생물과 닮은 화석), 💡 얼음 속 매머드·호박 속 곤충, 생각+(화석은 퇴적암에서), 형성 평가 2번(암석의 공룡 발자국 vs 어제 찍힌 신발 자국), 한눈에 쏙.
최종: ./make_final.sh s5ep04
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, SurroundingRectangle,
                   Ellipse)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


OBS = [("trilobite", "삼엽충 화석", "몸에 마디가 많은 동물"),
       ("fern", "고사리 화석", "산에서 볼 수 있는 고사리"),
       ("fish", "물고기 화석", "오늘날의 물고기"),
       ("ammonite", "암모나이트 화석", "조개나 달팽이"),
       ("ginkgo", "은행잎 화석", "길에서 볼 수 있는 은행잎"),
       ("bird_foot", "새 발자국 화석", "오늘날 새의 발자국")]


class S5Ep04(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 4
    EP_TITLE = "여러 가지 화석"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.body_trace()
        self.features()
        self.which()
        self.summary()
        self.closing(f"옛날에 살았던 생물의 {o('몸체')}나 {o('흔적')}이\n지층 속에 남아 있는 것이 {g('화석')}이에요",
                     next_preview="5학년 5화 · 화석은 어떻게 만들어질까?")
        self.wait(0.5)

    # ── 궁금해요: 공룡 뼈 찾기 ──
    def intro(self):
        self.section("궁금해요")
        site, piles = K.dig_site(9.0, 3.0, 5)
        VGroup(site, piles).move_to([0, 0.4, 0])
        self.say("과학자들은 무엇을 찾고 있을까요?",
                 "과학자들이 붓으로 흙을 털어 내며 무엇인가를 조심스럽게 찾고 있어요. 무엇을 찾고 있을까요?")
        self.play(FadeIn(site), FadeIn(piles), run_time=0.8)
        for p in piles:
            self.play(FadeOut(p, shift=UP * 0.3), run_time=0.45)
        self.say(f"{o('공룡 뼈')}가 나타났어요!", "흙을 털어 내니 공룡 뼈가 나타났어요! 과학자들은 지층에서 공룡 뼈를 찾고 있었어요.")
        self.play(Indicate(site[1], color=ORANGE, scale_factor=1.05), run_time=1.0)
        self.pause_screen(5, "공룡의 어떤 부분이 남아 있나요?")
        self.say(f"땅속에 묻힌 공룡은 {g('단단한 뼈')} 부분이 남아 있어요",
                 "땅속에 묻힌 공룡은 부드러운 살과 피부가 아니라 단단한 뼈 부분이 남아 있어요.")
        self.settle()
        clear_stage(self)

    # ── 관찰해요: 화석 6가지 ──
    def observe(self):
        self.section("관찰해요")
        cells = VGroup()
        for k, nm, like in OBS:
            sl = K.slab(k, 2.3, 1.4, seed=len(nm))
            cells.add(VGroup(sl, T(nm, 28).next_to(sl, DOWN, buff=0.1)))
        cells.arrange_in_grid(rows=2, cols=3, buff=(1.3, 0.75)).move_to([0, 0.45, 0])
        self.say("여러 가지 화석을 관찰해요",
                 "여러 가지 화석을 관찰해 봐요. 화석의 생김새를 살펴보고, 오늘날의 어떤 생물과 닮았는지 생각해 봐요. 화석은 그림으로 대신했어요.")
        self.play(FadeIn(cells, lag_ratio=0.12), run_time=1.4)
        self.pause_screen(5, "오늘날의 어떤 생물과 닮았을까요?")
        likes = VGroup()
        for c, (k, nm, like) in zip(cells, OBS):
            t = T(f"→ {like}", 24, GREEN)
            if t.width > 3.4:
                t.scale_to_fit_width(3.4)
            likes.add(t.next_to(c, DOWN, buff=0.06))
        self.say(f"삼엽충은 {o('몸에 마디가 많은 동물')}, 고사리는 {o('고사리')}와 닮았어요",
                 "삼엽충 화석은 마디가 많은 벌레처럼 보여요. 고사리 화석은 잎이 많고 줄기가 잘 보여서 산에서 볼 수 있는 고사리와 닮았어요.")
        self.play(FadeIn(likes[0]), FadeIn(likes[1]), run_time=0.6)
        self.say(f"물고기 화석은 {o('물고기')}, 암모나이트는 {o('조개나 달팽이')}와 닮았어요",
                 "물고기 화석은 가운데 굵은 뼈와 지느러미가 보여요. 암모나이트 화석은 껍데기의 무늬가 잘 보여 조개나 달팽이와 닮았어요.")
        self.play(FadeIn(likes[2]), FadeIn(likes[3]), run_time=0.6)
        self.say(f"은행잎 화석은 {o('은행잎')}, 새 발자국 화석은 {o('새의 발자국')}과 닮았어요",
                 "은행잎 화석은 잎이 넓고 줄기가 가늘어요. 새 발자국 화석은 새가 걸어 다닌 발자국처럼 보여요.")
        self.play(FadeIn(likes[4]), FadeIn(likes[5]), run_time=0.6)
        self.say(f"오늘날의 생물과 생김새가 {g('비슷한')} 화석도 있어요",
                 "화석의 종류와 생김새가 다양하고, 오늘날의 생물과 생김새가 비슷한 것도 있어요.")
        self.settle()
        clear_stage(self)

    # ── 몸체와 흔적 ──
    def body_trace(self):
        self.section("몸체와 흔적")
        items = [("trilobite", "삼엽충", 0), ("fern", "고사리", 0), ("pinecone", "솔방울", 0), ("dino_bone", "공룡 뼈", 0),
                 ("bird_foot", "새 발자국", 1), ("dino_foot", "공룡 발자국", 1), ("dung", "공룡 배설물(똥)", 1)]
        bins = VGroup(K.bin_box("생물의 몸체가 남은 화석", 7.0, 4.6, BLUE, 32),
                      K.bin_box("생물의 흔적이 남은 화석", 5.6, 4.6, GREEN, 32)).arrange(RIGHT, buff=0.3).move_to([0, 0.25, 0])
        cards = []
        for k, nm, side in items:
            sl = K.slab(k, 1.9, 1.35, seed=len(nm) + 3)
            t = T(nm, 24).next_to(sl, DOWN, buff=0.08)
            cards.append(VGroup(sl, t))
        row = VGroup(*cards).arrange(RIGHT, buff=0.15).move_to([0, 0.4, 0])
        if row.width > 13.4:
            row.scale_to_fit_width(13.4)
        self.say(f"생물의 {o('몸체')}뿐만 아니라 {o('흔적')}도 화석이 될 수 있어요",
                 "생물의 몸체뿐만 아니라 발자국, 배설물 같은 생물의 흔적도 화석이 될 수 있어요. 이 화석들은 몸체가 남은 화석일까요, 흔적이 남은 화석일까요?")
        self.play(FadeIn(row, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(6, "몸체일까요, 흔적일까요?")
        self.play(FadeIn(bins), run_time=0.5)
        moves = []
        cnt = [0, 0]
        for c, (k, nm, side) in zip(cards, items):
            b = bins[side].box
            per = 2
            j = cnt[side]
            cnt[side] += 1
            if side == 0:
                tgt = b.get_center() + np.array([-1.65 + 3.3 * (j % 2), 0.75 - 1.85 * (j // 2), 0])
            else:
                tgt = b.get_center() + np.array([(-1.3 + 2.6 * (j % 2)) if j < 2 else 0, 0.75 - 1.85 * (j // 2), 0])
            moves.append(c.animate.scale(0.95).move_to(tgt))
        self.say(f"뼈·잎·껍데기는 {o('몸체')}, 발자국·배설물은 {g('흔적')}이에요",
                 "삼엽충, 고사리, 솔방울, 공룡 뼈는 생물의 몸체가 남은 화석이에요. 새 발자국, 공룡 발자국, 공룡 배설물은 생물의 흔적이 남은 화석이에요.")
        self.play(*moves, run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 화석의 특징 ──
    def features(self):
        self.section("화석의 특징")
        big = K.slab("dino_bone", 3.4, 2.4).move_to([-4.2, 1.0, 0])
        small = K.slab("fern", 1.4, 1.0).move_to([-1.6, 0.6, 0])
        pts = VGroup(big, small)
        card = K.text_card([f"화석은 {o('종류와 크기')}가 다양해요",
                            f"생물의 {o('흔적')}도 화석이 될 수 있어요",
                            f"오늘날의 생물과 생김새가 {o('비슷한')} 화석도 있어요"], w=7.4, size=30).move_to([3.0, 0.8, 0])
        self.say("여러 가지 화석을 관찰하고 알게 된 점은?",
                 "여러 가지 화석을 관찰하고 알게 된 점을 정리해 봐요.")
        self.play(FadeIn(pts), run_time=0.6)
        self.say(f"화석은 {o('종류와 크기')}가 다양해요",
                 "화석은 공룡 뼈처럼 매우 큰 것도 있고, 꽃가루처럼 매우 작은 것도 있어요. 화석은 종류와 크기가 다양해요. 큰 동물만 화석이 되는 것이 아니에요.")
        self.play(FadeIn(card[0]), FadeIn(card[1][0]), run_time=0.5)
        self.play(FadeIn(card[1][1]), FadeIn(card[1][2]), run_time=0.6)
        note = K.text_card(["화석은 주로 지층 속에서 발견돼요",
                            "얼음 속 매머드, 호박 속 곤충처럼 다른 곳에서 발견되기도 해요"], w=12.6, size=28,
                           stroke=SOFT).move_to([0, -1.55, 0])
        self.say("화석은 주로 지층 속에서 발견돼요",
                 "화석은 주로 지층 속에서 발견되지만, 얼음 속에 얼어 있던 매머드나, 나무의 수액이 굳은 호박 속 곤충처럼 다른 곳에서 발견되는 화석도 있어요.")
        self.play(FadeIn(note, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각+: 화석인 것은? ──
    def which(self):
        self.section("생각+")
        self.say("화석은 어떤 암석에서 발견될까요?",
                 "화석은 어떤 암석에서 발견될까요? 화성암일까요, 퇴적암일까요?")
        rk = K.slab("shell", 3.4, 2.4).move_to([0, 0.7, 0])
        q = T("화성암? 퇴적암?", 34).next_to(rk, DOWN, buff=0.25)
        self.play(FadeIn(rk), FadeIn(q), run_time=0.6)
        self.say(f"화석은 {g('퇴적암')}에서 발견돼요",
                 "화석은 퇴적암에서 발견돼요. 지층은 주로 퇴적암으로 이루어져 있었지요.")
        self.play(FadeOut(q), FadeIn(K.label("퇴적암", GREEN, 36).next_to(rk, DOWN, buff=0.25)), run_time=0.5)
        self.settle()
        clear_stage(self)
        left = K.slab("dino_foot", 3.6, 2.6).move_to([-3.3, 0.6, 0])
        sand = K.rect(4.4, 2.6, K.SAND, x=3.3, y=0.6, stroke=K.SAND_D, sw=4, r=0.15)
        shoe = VGroup(Ellipse(width=0.7, height=1.5, fill_color=K.SAND_D, fill_opacity=0.8, stroke_width=0).move_to([2.8, 0.85, 0]).rotate(0.15),
                      Ellipse(width=0.7, height=1.5, fill_color=K.SAND_D, fill_opacity=0.8, stroke_width=0).move_to([3.8, 0.35, 0]).rotate(0.15))
        l1 = T("㉠ 암석에 남은 공룡 발자국", 28).next_to(left, DOWN, buff=0.2)
        l2 = T("㉡ 어제 바닷가 모래에 찍힌 신발 자국", 28).next_to(sand, DOWN, buff=0.2)
        self.say("㉠과 ㉡ 중 화석인 것은 무엇일까요?",
                 "그렇다면 암석에 남은 공룡 발자국과, 어제 바닷가 모래에 찍힌 신발 자국 중에서 화석인 것은 무엇일까요?")
        self.play(FadeIn(left), FadeIn(sand), FadeIn(shoe), FadeIn(l1), FadeIn(l2), run_time=0.8)
        self.pause_screen(5, "화석인 것은 ㉠일까요, ㉡일까요?")
        m1 = K.ox_mark(True, 0.45).move_to(left.get_corner(UP + RIGHT) + np.array([-0.3, -0.3, 0]))
        m2 = K.ox_mark(False, 0.45).move_to(sand.get_corner(UP + RIGHT) + np.array([-0.4, -0.4, 0]))
        self.say(f"㉠은 {o('먼 옛날')}에 살았던 생물의 흔적이라 {g('화석')}이에요",
                 "㉠은 먼 옛날에 살았던 생물의 흔적이 암석에 남은 것이라 화석이에요. ㉡은 오늘날 사람이 남긴 자국이라 화석이 아니에요.")
        self.play(Create(m1), Create(m2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        row = VGroup(*[K.slab(k, 2.2, 1.5, seed=i) for i, k in enumerate(("ammonite", "fish", "dino_foot", "ginkgo"))]).arrange(RIGHT, buff=0.35)
        row.move_to([0, 1.6, 0])
        card = K.text_card([f"옛날에 살았던 생물의 {o('몸체')}나 {o('흔적')}이",
                            f"지층 속에 남아 있는 것을 {g('화석')}이라고 합니다."], w=11.6, size=40).move_to([0, -0.9, 0])
        self.say(f"생물의 몸체나 흔적이 지층 속에 남은 것이 {g('화석')}이에요",
                 "옛날에 살았던 생물의 몸체나 흔적이 지층 속에 남아 있는 것을 화석이라고 해요.")
        self.play(FadeIn(row, lag_ratio=0.1), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
