"""「과학 원리 돋보기」 3학년 14화 — 식물의 특징을 본뜬 생활용품 (3-1 3단원 식물의 생활 8차시, 화 코드 3-1-3-e)

바탕: grade3/science/sem1/u3-6.html — 도입(쌀·보리는 식량, 나무는 집·가구, 성분은 약 / 표주박 바가지),
연잎 관찰(둥근 방패 모양·잎맥이 사방으로, 만지면 부드러움, 돋보기: 잔털이 촘촘 / 물방울이 스며들지 않고 동그랗게 굴러감, 기울이면 굴러떨어지고 젖은 흔적 없음
→ 물에 젖지 않는 옷감), 우엉 열매(부직포에 붙으면 잘 떨어지지 않음, 확대경: 가시 끝이 갈고리 / 메스트랄 → 찍찍이 테이프: 한쪽은 갈고리, 다른 쪽은 작은 고리),
짝 찾기(민들레씨→낙하산, 단풍나무 열매→드론의 날개, 부채야자 잎의 주름→잘 찌그러지지 않는 통조림 캔, 오이 덩굴손→잘 끊어지지 않는 스프링),
그대로 이용 / 특징을 이용 분류, 한눈에 쏙(우엉 열매의 특징을 이용해 찍찍이 테이프).
※ EPISODES.md에는 '도꼬마리 열매'로 적혀 있으나 차시 앱은 '우엉 열매'라 앱을 따름.
최종: ./make_final.sh s3ep14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, Line, RoundedRectangle, VGroup,
                   Circumscribe, Transform, Rectangle, Circle, Ellipse, Rotate)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import BROWN, RED, clear_stage, tag
from kit_s3u13 import (LEAF_EDGE, burr, drone, droplet, fabric_with_drops, gourd_bowl, hairs_zoom, hook,
                       lotus_leaf_top, parachute, samara, seed_tuft, velcro)


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S3Ep14(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 14
    EP_TITLE = "식물의 특징을 본뜬 생활용품"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.lotus()
        self.burdock()
        self.pairs()
        self.sort()
        self.closing(f"식물의 {o('특징')}을 이용해 {g('찍찍이 테이프')},\n{g('물에 젖지 않는 옷감')} 같은 생활용품을 만들어요",
                     next_preview="3학년 마인드맵 3 · 식물의 생활")
        self.wait(0.5)

    # ── 도입 ──
    def intro(self):
        self.section("궁금해요")
        uses = VGroup(tag("쌀 · 보리 → 식량", LEAF_EDGE, 38), tag("나무 → 집 · 가구", LEAF_EDGE, 38), tag("식물의 성분 → 약", LEAF_EDGE, 38)
                      ).arrange(DOWN, buff=0.35).move_to([-3.3, 0.6, 0])
        self.say("우리는 식물을 여러 가지로 이용해요", "쌀이나 보리는 식량으로, 나무는 집이나 가구로, 식물의 성분은 약으로 써요.")
        self.play(FadeIn(uses, lag_ratio=0.25), run_time=1.0)
        bowl = gourd_bowl(1.8).move_to([3.4, 0.3, 0])
        bl = T("표주박 → 바가지", 36, INK).next_to(bowl, DOWN, buff=0.35)
        self.say("단단한 박 열매의 속을 파내 바가지로 써요", "단단한 박 열매는 속을 파내 바가지로 쓸 수 있어요.")
        self.play(FadeIn(bowl), FadeIn(bl), run_time=0.6)
        self.say(f"식물의 {o('특징')}을 이용해 만든 생활용품도 있을까요?", "그런데 식물의 특징을 이용해 만든 생활용품도 있을까요?")
        self.settle()
        clear_stage(self)

    # ── 연잎 ──
    def lotus(self):
        self.section("관찰해요")
        lf = lotus_leaf_top(2.0).move_to([-3.2, 0.3, 0])
        self.say("연잎의 표면을 관찰해요", "실험복과 장갑을 착용하고 연잎을 관찰해요.")
        self.play(FadeIn(lf), run_time=0.6)
        obs = VGroup(M(f"눈: {o('둥근 방패 모양')}, 잎맥이 사방으로", 32), M(f"손: 만지면 {o('부드러워요')}", 32),
                     M(f"돋보기: {o('잔털')}이 촘촘해요", 32)).arrange(DOWN, aligned_edge=LEFT, buff=0.35).move_to([3.3, 1.2, 0])
        nn = ["눈으로 보면 둥근 방패 모양이고, 잎맥이 사방으로 퍼져 있어요.", "손으로 만지면 부드러운 느낌이에요.", "돋보기로 보면 잔털이 촘촘하게 나 있어요."]
        subs = ["눈으로 보면 둥근 방패 모양이에요", "손으로 만지면 부드러워요", f"돋보기로 보면 {o('잔털')}이 촘촘해요"]
        for row, sb, n in zip(obs, subs, nn):
            self.say(sb, n)
            self.play(FadeIn(row, shift=RIGHT * 0.2), run_time=0.45)
        self.settle()
        self.play(FadeOut(obs), run_time=0.4)
        self.section("실험해요")
        pip = VGroup(Rectangle(width=0.22, height=1.0, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=3),
                     Ellipse(width=0.42, height=0.5, fill_color=RED, fill_opacity=1, stroke_width=0).shift(UP * 0.62)).move_to([-3.2, 2.5, 0])
        self.say("연잎에 물을 한 방울씩 떨어뜨려요", "연잎에 물을 한 방울씩 떨어뜨려요.")
        self.play(FadeIn(pip), run_time=0.4)
        self.pause_screen(5, "물방울은 어떻게 될까요?")
        drops = VGroup()
        for x, y in ((-3.6, 0.5), (-2.7, 0.0), (-3.3, -0.2)):
            d = droplet(0.2).move_to([x, 1.9, 0])
            self.play(pip.animate.move_to([x, 2.5, 0]), run_time=0.25)
            self.play(d.animate.move_to([x, y, 0]), run_time=0.35)
            drops.add(d)
        self.say(f"물방울이 스며들지 않고 {o('동그랗게')} 굴러가요", "물방울이 스며들지 않고 동그랗게 굴러가요. 물방울들이 모여 큰 물방울이 되어요.")
        big = droplet(0.36).move_to([-3.2, 0.1, 0])
        self.play(Transform(drops, big), run_time=0.8)
        zoom = hairs_zoom(1.3).move_to([3.6, 0.5, 0])
        self.say(f"잔털 위에 물방울이 올라앉아 {o('스며들지 못해요')}", "확대해 보면, 물방울은 잔털 위에 둥글게 올라앉아 잎 속으로 스며들지 못해요.")
        self.play(FadeIn(zoom, scale=0.8), run_time=0.6)
        self.say("기울이면 굴러떨어지고 젖은 흔적도 없어요", "연잎을 살짝 기울이면 물방울이 굴러떨어지고, 지나간 자리에 젖은 흔적도 남지 않아요.")
        self.play(Rotate(VGroup(lf), angle=-0.12), drops.animate.shift(RIGHT * 2.2 + DOWN * 0.6).set_opacity(0), run_time=1.2)
        self.settle()
        clear_stage(self)
        cloth = fabric_with_drops(4.0).move_to([2.8, 0.4, 0])
        lf2 = lotus_leaf_top(1.4).move_to([-3.6, 0.4, 0])
        ar = Arrow([-1.5, 0.4, 0], [0.5, 0.4, 0], stroke_color=ORANGE, stroke_width=8)
        lab1 = T("연잎", 34, INK).next_to(lf2, DOWN, buff=0.3)
        lab2 = T("물에 젖지 않는 옷감", 34, INK).next_to(cloth, DOWN, buff=0.3)
        self.say(f"물이 스며들지 않는 특징 → {g('물에 젖지 않는 옷감')}", "물이 스며들지 않는 연잎의 특징을 이용해 물에 젖지 않는 옷감을 만들었어요.")
        self.play(FadeIn(lf2), FadeIn(lab1), GrowArrow_(ar), FadeIn(cloth), FadeIn(lab2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 우엉 열매 ──
    def burdock(self):
        self.section("관찰해요")
        felt = RoundedRectangle(corner_radius=0.1, width=4.0, height=2.6, fill_color="#C9C2E8", fill_opacity=1, stroke_width=0).move_to([-3.3, 0.3, 0])
        fl = T("부직포", 30, SOFT).next_to(felt, DOWN, buff=0.2)
        bu = burr(0.6).move_to([-6.0, 2.2, 0])
        self.say("가시가 많은 우엉 열매를 부직포에 붙여 봐요", "가시가 많은 우엉 열매를 부직포에 붙여 봐요. 긁히지 않게 안전 장갑을 끼고 핀셋을 사용해요.")
        self.play(FadeIn(felt), FadeIn(fl), FadeIn(bu), run_time=0.6)
        self.play(bu.animate.move_to([-3.3, 0.3, 0]), run_time=0.7)
        self.say(f"떼려고 해도 {o('잘 떨어지지 않아요')}", "떼려고 해도 부직포 올이 딸려 올라올 만큼 잘 떨어지지 않아요.")
        self.play(bu.animate.shift(UP * 0.25), felt.animate.shift(UP * 0.08), run_time=0.4)
        self.play(bu.animate.shift(DOWN * 0.25), felt.animate.shift(DOWN * 0.08), run_time=0.4)
        self.pause_screen(5, "왜 잘 떨어지지 않을까요?")
        ring = Circle(radius=1.5, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=6).move_to([3.4, 0.4, 0])
        hk = hook(1.2).move_to([3.4, 0.4, 0])
        zl = T("확대경(30배)", 30, SOFT).next_to(ring, UP, buff=0.15)
        self.say(f"확대경으로 보니 가시 끝이 {o('갈고리')}처럼 휘어져 있어요", "확대경으로 보니, 가시 끝이 갈고리처럼 휘어져 있어요. 그래서 천에 붙으면 잘 떨어지지 않아요.")
        self.play(FadeIn(ring), FadeIn(hk), FadeIn(zl), run_time=0.7)
        self.settle()
        clear_stage(self)
        self.section("과학자 이야기")
        v = velcro(5.0).move_to([0, 0.4, 0])
        t1 = M(f"{b('갈고리')}", 34).next_to(v, LEFT, buff=0.3).shift(UP * 0.6)
        t2 = M(f"{o('작은 고리')}", 34).next_to(v, LEFT, buff=0.3).shift(DOWN * 0.6)
        self.say("메스트랄은 바지에 붙은 산우엉 열매를 보았어요",
                 "스위스의 메스트랄은 바지와 개의 털에 붙은 산우엉 열매가 잘 떨어지지 않는 것을 보았어요.")
        self.say(f"가시 끝의 갈고리를 본떠 {g('찍찍이 테이프')}를 만들었어요",
                 "그는 가시 끝의 갈고리 모양을 이용해, 한쪽은 갈고리, 다른 쪽은 작은 고리 모양인 찍찍이 테이프를 만들었어요.")
        self.play(FadeIn(v), FadeIn(t1), FadeIn(t2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 짝 찾기 ──
    def pairs(self):
        self.section("짝 찾기")
        rows = [
            (seed_tuft(1.1), "민들레씨", "바람에 잘 날아가요", parachute(0.7), "낙하산"),
            (samara(0.8), "단풍나무 열매", "빙그르르 돌며 멀리 날아가요", drone(0.9), "드론의 날개"),
            (None, "부채야자 잎", "주름이 있어 늘어지지 않아요", None, "잘 찌그러지지 않는 통조림 캔"),
            (None, "오이 덩굴손", "반씩 서로 반대로 감겨요", None, "잘 끊어지지 않는 스프링"),
        ]
        ys = [2.05, 0.75, -0.55, -1.75]
        self.say("식물의 특징과 생활용품의 짝을 찾아요", "다른 식물도 짝을 지어 볼까요?")
        narr = ["민들레씨가 바람에 잘 날아가는 모습을 이용해 낙하산을 만들었어요.",
                "단풍나무 열매가 빙그르르 돌며 멀리 날아가는 생김새를 이용해 드론의 날개를 만들었어요.",
                "부채야자 잎의 주름을 이용해 잘 찌그러지지 않는 통조림 캔을 만들었어요.",
                "오이 덩굴손이 반은 한쪽으로, 반은 반대쪽으로 감기는 특징을 이용해 잘 끊어지지 않는 스프링을 만들었어요."]
        for (pic, nm, feat, prod_pic, prod), y, n in zip(rows, ys, narr):
            g_ = VGroup()
            if pic is not None:
                pic.scale_to_fit_height(0.9).move_to([-6.1, y, 0])
                g_.add(pic)
            a = T(nm, 32, LEAF_EDGE).move_to([-5.4, y + 0.2, 0], aligned_edge=LEFT)
            f = T(feat, 26, SOFT).move_to([-5.4, y - 0.25, 0], aligned_edge=LEFT)
            ar = Arrow([-0.3, y, 0], [0.6, y, 0], stroke_color=ORANGE, stroke_width=6, buff=0)
            p = T(prod, 32, INK).move_to([0.9, y, 0], aligned_edge=LEFT)
            g_.add(a, f, ar, p)
            if prod_pic is not None:
                (prod_pic.scale_to_fit_width(1.5) if prod_pic.width > prod_pic.height * 1.6 else prod_pic.scale_to_fit_height(0.85)).move_to([p.get_right()[0] + 1.0, y, 0])
                g_.add(prod_pic)
            self.say(f"{nm} → {g(prod)}", n)
            self.play(FadeIn(g_, shift=RIGHT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 그대로 / 특징 ──
    def sort(self):
        self.section("정리해요")
        lb = RoundedRectangle(corner_radius=0.25, width=6.3, height=3.6, fill_color=PAPER, fill_opacity=0.9, stroke_color=SOFT, stroke_width=5).move_to([-3.4, 0.5, 0])
        rb = lb.copy().set_stroke(GREEN).move_to([3.4, 0.5, 0])
        lt = T("식물을 그대로 이용했어요", 29, SOFT).next_to(lb.get_top(), DOWN, buff=0.2)
        rt = T("식물의 특징을 이용해 만들었어요", 29, GREEN).next_to(rb.get_top(), DOWN, buff=0.2)
        L = VGroup(*[T(s, 30, INK) for s in ("쌀로 밥을 지어요", "나무로 책상을 만들어요", "식물의 성분으로 약을 만들어요")]).arrange(DOWN, buff=0.35).move_to([-3.4, 0.1, 0])
        R = VGroup(*[T(s, 30, INK) for s in ("우엉 열매 → 찍찍이 테이프", "민들레씨 → 낙하산", "연잎 → 물에 젖지 않는 옷감")]).arrange(DOWN, buff=0.35).move_to([3.4, 0.1, 0])
        self.say("식물을 그대로 이용했을까, 특징을 이용했을까?", "그대로 이용한 것과 특징을 이용한 것을 나누어 봐요.")
        self.play(FadeIn(lb), FadeIn(rb), FadeIn(lt), FadeIn(rt), run_time=0.6)
        self.say("쌀 · 나무 · 성분은 식물을 그대로 이용했어요", "쌀로 밥을 짓고, 나무로 책상을 만들고, 식물의 성분으로 약을 만드는 것은 식물을 그대로 이용한 것이에요.")
        self.play(FadeIn(L, lag_ratio=0.2), run_time=0.8)
        self.say(f"생김새나 특징을 본뜬 것은 {g('특징을 이용')}한 생활용품", "찍찍이 테이프, 낙하산, 물에 젖지 않는 옷감은 식물의 생김새나 특징을 본떠 만든 생활용품이에요.")
        self.play(FadeIn(R, lag_ratio=0.2), run_time=0.8)
        self.settle()
        self.play(FadeOut(VGroup(lb, rb, lt, rt, L, R)), run_time=0.5)
        box = RoundedRectangle(corner_radius=0.3, width=12.6, height=1.8, fill_color=PAPER, fill_opacity=1,
                               stroke_color=GREEN, stroke_width=5).move_to([0, 0.6, 0])
        txt = M(f"우엉 열매의 특징을 이용해 {o('찍찍이 테이프')}를 만들었어요", 36).move_to(box)
        self.say("한눈에 쏙 정리해요", "한눈에 정리해요. 우엉 열매의 특징을 이용해 찍찍이 테이프를 만들었어요.")
        self.play(FadeIn(box), FadeIn(txt), run_time=0.8)
        self.settle()
        clear_stage(self)


def b(s):
    return f'<span foreground="{BLUE}">{s}</span>'


def GrowArrow_(a):
    from manim import GrowArrow
    return GrowArrow(a)
