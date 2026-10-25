"""「과학 원리 돋보기」 4학년 22화 — 생태계란 무엇일까? (4-2 2단원 생물과 환경 3차시, 화 코드 4-2-2-a)

바탕: grade4/science/sem2/u2-1.html(원본 _build_tb/src2/u2-1.html) — 도입(학교 화단에서 보이는 것: 햇빛·소나무·토끼풀·개미·나비·
거미·참새·버섯·지렁이·돌·흙), 생각 열기(생물 요소·비생물 요소·생태계, 쓰러진 나무 아래 작은 생태계·섬처럼 큰 생태계,
버섯·곰팡이·세균은 생물 요소), 탐구(숲·강·바다 생태계 구성 요소를 ◯ 생물 요소 · △ 비생물 요소로 분류 — 앱 ECO 목록에서 골라 씀),
'자라는가? 번식하는가?', 생각이 쑥(연못 생태계 6가지: 공기·개구리·부레옥잠·흙·물·소금쟁이), 한눈에 쏙, 형성 평가 ㉡.
최종: ./make_final.sh s4ep22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circle, Triangle, Rectangle,
                   Line, Circumscribe)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u22 as K
import kit_s3u12 as A3


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def mark(it, living):
    """◯(생물 요소, 초록) / △(비생물 요소, 주황) 표시를 그림 왼쪽 위에"""
    p = it.pic.get_corner(UP + LEFT) + np.array([0.05, -0.05, 0])
    if living:
        m = Circle(radius=0.2, stroke_color=GREEN, stroke_width=8)
    else:
        m = Triangle(stroke_color=ORANGE, stroke_width=8).scale(0.24)
    bg = Circle(radius=0.27, fill_color=PAPER, fill_opacity=0.95, stroke_width=0)
    return VGroup(bg, m.move_to(bg)).move_to(p)


LIVING = {"햇빛": False, "공기": False, "물": False, "흙": False, "돌": False}


class S4Ep22(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 22
    EP_TITLE = "생태계란 무엇일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.words()
        self.ecos()
        self.tricky()
        self.pond()
        self.summary()
        self.closing(f"한 지역에서 서로 영향을 주고받는 {g('생물 요소')}와 {o('비생물 요소')}를\n통틀어 {r('생태계')}라고 해요",
                     next_preview="4학년 23화 · 생물 요소를 분류해 볼까?")
        self.wait(0.5)

    # ── 궁금해요: 학교 화단 ──
    def intro(self):
        self.section("궁금해요")
        ground = VGroup(Rectangle(width=13.4, height=1.9, fill_color="#B98A58", fill_opacity=0.9, stroke_width=0).move_to([0, -1.6, 0]),
                        Rectangle(width=13.4, height=0.18, fill_color="#7CB65A", fill_opacity=1, stroke_width=0).move_to([0, -0.66, 0]))
        spots = [("햇빛", 5.4, 2.25, 1.2, 1.0), ("소나무", -5.3, 0.55, 1.5, 2.2), ("참새", -2.9, 2.2, 1.1, 0.8),
                 ("나비", 0.2, 2.15, 1.0, 0.8), ("토끼풀", -3.0, 0.0, 1.0, 1.0), ("개미", -1.2, -0.35, 0.8, 0.5),
                 ("거미", 0.7, 0.05, 0.9, 0.7), ("버섯", 2.6, 0.0, 0.9, 0.9), ("돌", 4.3, -0.35, 1.0, 0.6),
                 ("지렁이", 0.0, -1.75, 1.1, 0.45), ("흙", -3.4, -1.95, 1.0, 0.55)]
        its = VGroup()
        for nm, x, y, w, h in spots:
            it = K.item(nm, w, h, 26)
            it.move_to([x, y, 0])
            its.add(it)
        self.say("학교 화단에서는 어떤 것들을 볼 수 있을까요?", "학교 화단에서는 어떤 것들을 볼 수 있을까요?")
        self.play(FadeIn(ground), run_time=0.4)
        self.play(FadeIn(its, lag_ratio=0.12), run_time=2.0)
        self.say("토끼풀, 개미, 참새처럼 살아 있는 것이 있어요",
                 "토끼풀, 개미, 참새, 버섯처럼 살아 있는 것도 있고,")
        self.play(*[Indicate(it, color=GREEN, scale_factor=1.1) for it, s in zip(its, spots) if s[0] not in LIVING], run_time=1.2)
        self.say("돌, 흙, 햇빛처럼 살아 있지 않은 것도 있어요",
                 "돌, 흙, 햇빛처럼 살아 있지 않은 것도 있어요.")
        self.play(*[Indicate(it, color=ORANGE, scale_factor=1.1) for it, s in zip(its, spots) if s[0] in LIVING], run_time=1.2)
        self.settle()
        self.its, self.spots, self.ground = its, spots, ground

    # ── 낱말 ──
    def words(self):
        self.section("생각 열기")
        bl = K.bin_box("생물 요소", 6.0, 1.5, GREEN, 40).move_to([-3.3, 2.15, 0])
        br = K.bin_box("비생물 요소", 6.0, 1.5, ORANGE, 40).move_to([3.3, 2.15, 0])
        tl = T("동물, 식물처럼 살아 있는 것", 28).move_to(bl.box.get_center() + DOWN * 0.28)
        tr = T("햇빛, 물, 공기, 흙처럼 살아 있지 않은 것", 25).move_to(br.box.get_center() + DOWN * 0.28)
        strip = VGroup(*[K.item(sp[0], 0.95, 0.7, 24) for sp in self.spots]).arrange(RIGHT, buff=0.22).move_to([0, -1.3, 0])
        self.play(FadeOut(self.ground), *[it.animate.become(nw) for it, nw in zip(self.its, strip)], run_time=0.9)
        self.say(f"살아 있는 것은 {g('생물 요소')}예요",
                 "자연에서 동물이나 식물 등과 같이 살아 있는 것을 생물 요소라고 해요.")
        self.play(FadeIn(bl), FadeIn(tl), run_time=0.6)
        self.say(f"살아 있지 않은 것은 {o('비생물 요소')}예요",
                 "햇빛, 물, 공기, 흙 등과 같이 살아 있지 않은 것은 비생물 요소라고 해요.")
        self.play(FadeIn(br), FadeIn(tr), run_time=0.6)
        live = [it for it, s in zip(self.its, self.spots) if s[0] not in LIVING]
        non = [it for it, s in zip(self.its, self.spots) if s[0] in LIVING]
        anims = []
        for k, it in enumerate(live):
            anims.append(it.animate.move_to([-5.4 + (k % 4) * 1.45, 0.55 - (k // 4) * 1.3, 0]))
        for k, it in enumerate(non):
            anims.append(it.animate.move_to([1.6 + (k % 3) * 1.7, 0.55, 0]))
        self.say("화단의 것들을 두 가지로 나누어 봐요", "화단에서 찾은 것들을 생물 요소와 비생물 요소로 나누어 봐요.")
        self.play(*anims, run_time=1.6)
        self.settle()
        clear_stage(self)

        card = K.text_card([f"한 지역에서 {o('서로 영향을 주고받는')}",
                            f"{g('생물 요소')}와 {o('비생물 요소')}를 통틀어 이르는 말"], size=38).move_to([0, 1.9, 0])
        head = T("생태계", 52, RED).next_to(card, UP, buff=0.2)
        self.say(f"이것들을 통틀어 {r('생태계')}라고 해요",
                 "한 지역에서 서로 영향을 주고받는 생물 요소와 비생물 요소를 통틀어 생태계라고 해요.")
        self.play(FadeIn(head), FadeIn(card, scale=0.95), run_time=0.8)
        log = K.fallen_log(3.4)
        isl = K.island(3.6)
        lg = VGroup(log, T("쓰러진 나무 아래 공간", 30).next_to(log, DOWN, buff=0.3)).move_to([-3.4, -1.05, 0])
        ig = VGroup(isl, T("섬", 30).next_to(isl, DOWN, buff=0.3)).move_to([3.4, -1.05, 0])
        self.say(f"생태계는 {o('작은')} 것도 있고 {o('큰')} 것도 있어요",
                 "생태계에는 쓰러진 나무 아래 공간처럼 작은 생태계도 있고, 섬처럼 큰 생태계도 있어요.")
        self.play(FadeIn(lg, shift=UP * 0.2), run_time=0.7)
        self.play(FadeIn(ig, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 숲·강·바다 ──
    def eco_panel(self, title, col, names):
        panel = K.R(13.4, 5.15, col, 0, 0.18, rad=0.3, stroke=SOFT, sw=3, op=0.35)
        tt = T(title, 40).move_to([0, 2.42, 0])
        its = VGroup(*[K.item(n, 1.25, 0.95, 26) for n in names])
        its.arrange_in_grid(rows=2, buff=(0.55, 0.4)).move_to([0, -0.05, 0])
        if its.width > 12.6:
            its.scale_to_fit_width(12.6)
        return panel, tt, its

    def ecos(self):
        self.section("탐구해요")
        data = [("숲 생태계", "#9CC56A", ["햇빛", "공기", "흙", "상수리나무", "직박구리", "매", "다람쥐", "뱀", "버섯", "곰팡이", "두더지", "지렁이"]),
                ("강 생태계", "#6FB6DC", ["햇빛", "공기", "물", "흙", "부들", "오리", "붕어마름", "다슬기", "반달말", "붕어"]),
                ("바다 생태계", "#3F8FC4", ["햇빛", "공기", "물", "흙", "갈매기", "돌고래", "바다거북", "고등어", "산호", "미역", "게"])]
        legend = M(f'<span foreground="{GREEN}">◯ 생물 요소</span>     <span foreground="{ORANGE}">△ 비생물 요소</span>', 30).move_to([0, -2.25, 0])
        for k, (title, col, names) in enumerate(data):
            panel, tt, its = self.eco_panel(title, col, names)
            if k == 0:
                self.say("숲, 강, 바다 생태계를 이루는 요소를 분류해요",
                         "숲, 강, 바다 생태계를 구성하는 요소를 생물 요소와 비생물 요소로 분류해 봐요.")
                self.play(FadeIn(panel), FadeIn(tt), FadeIn(its, lag_ratio=0.06), FadeIn(legend), run_time=1.4)
                self.pause_screen(5, "생물 요소와 비생물 요소는?")
                self.say("살아 있으면 ◯, 살아 있지 않으면 △를 해요",
                         "살아 있는 생물 요소에는 동그라미, 살아 있지 않은 비생물 요소에는 세모를 해요. 곰팡이는 크게 확대한 모습이에요.")
            else:
                self.play(FadeIn(panel), FadeIn(tt), FadeIn(its, lag_ratio=0.06), run_time=1.0)
                self.say(f"{title}도 분류해요" if k == 1 else f"{title}도 마찬가지예요",
                         f"{title}에서도 살아 있는 것과 살아 있지 않은 것을 나누어 봐요.")
            ms = VGroup(*[mark(it, n not in LIVING) for it, n in zip(its, names)])
            self.play(FadeIn(ms, lag_ratio=0.08), run_time=1.4)
            if k == 2:
                self.say(f"어느 생태계든 {o('햇빛, 공기, 물, 흙')}과 여러 생물이 있어요",
                         "세 생태계 모두 햇빛, 공기, 흙, 그리고 강과 바다는 물 같은 비생물 요소와, 여러 생물 요소로 이루어져 있어요.")
            self.settle()
            self.play(FadeOut(VGroup(panel, tt, its, ms)), run_time=0.5)
        self.play(FadeOut(legend), run_time=0.3)

    # ── 헷갈리기 쉬운 것 ──
    def tricky(self):
        self.section("생각 바로잡기")
        its = VGroup(*[K.item(n, 1.8, 1.5, 36) for n in ("버섯", "곰팡이", "세균")]).arrange(RIGHT, buff=1.6).move_to([0, 0.9, 0])
        self.say("버섯, 곰팡이, 세균은 어떤 요소일까요?", "버섯, 곰팡이, 세균은 생물 요소일까요, 비생물 요소일까요?")
        self.play(FadeIn(its, lag_ratio=0.2), run_time=1.0)
        self.pause_screen(5, "생물 요소일까요?")
        ms = VGroup(*[mark(it, True).scale(1.3) for it in its])
        q = M(f"자라는가?   {o('번식하는가?')}", 40).move_to([0, -1.5, 0])
        self.say(f"모두 살아 있는 {g('생물 요소')}예요",
                 "버섯, 곰팡이, 세균은 모두 자라고 번식하는 살아 있는 생물이에요. 그래서 생물 요소예요.")
        self.play(FadeIn(ms, lag_ratio=0.2), FadeIn(q), run_time=0.8)
        self.say("자라는지, 번식하는지 생각하며 분류해요",
                 "자라는가, 번식하는가처럼 생물인지 아닌지 생각하며 분류해요.")
        self.settle()
        clear_stage(self)

    # ── 생각이 쑥: 연못 ──
    def pond(self):
        self.section("생각이 쑥")
        pics = {"낙타": A3.camel, "북극곰": A3.polar_bear}
        names = ["공기", "개구리", "부레옥잠", "낙타", "흙", "물", "북극곰", "소금쟁이"]
        its = VGroup()
        for n in names:
            if n in pics:
                p = K.fit(pics[n](), 1.5, 1.1)
                it = VGroup(p, T(n, 30).next_to(p, DOWN, buff=0.12))
                it.pic = p
            else:
                it = K.item(n, 1.5, 1.1, 30)
            its.add(it)
        its.arrange_in_grid(rows=2, buff=(0.9, 0.45)).move_to([0, 0.45, 0])
        self.say("우리 주변 연못 생태계를 이루는 요소를 골라요",
                 "우리 주변의 연못 생태계를 구성하는 요소를 모두 골라 봐요.")
        self.play(FadeIn(its, lag_ratio=0.1), run_time=1.2)
        self.pause_screen(5, "연못 생태계의 요소는?")
        ok = VGroup(*[K.ox_mark(True, 0.62).move_to(it.pic) for it, n in zip(its, names) if n not in pics])
        no = VGroup(*[K.ox_mark(False, 0.5).move_to(it.pic) for it, n in zip(its, names) if n in pics])
        self.say(f"공기, 흙, 물, 개구리, 부레옥잠, 소금쟁이 {g('6가지')}예요",
                 "공기, 흙, 물 같은 비생물 요소와 개구리, 부레옥잠, 소금쟁이 같은 생물 요소가 연못 생태계를 이루어요.")
        self.play(Create(ok, lag_ratio=0.15), run_time=1.2)
        self.say("낙타와 북극곰은 연못에 살지 않아요", "낙타와 북극곰은 연못에 살지 않아요.")
        self.play(Create(no), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"생태계에서는 {g('생물')} 요소와 {o('비생물')} 요소가",
                            "영향을 주고받습니다."], size=46).move_to([0, 1.3, 0])
        wrong = K.text_card([f"{r('×')}  생태계는 살아 있는 동물과 식물로만 구성되어 있다."], size=34, stroke=RED).move_to([0, -1.2, 0])
        self.say(f"생태계에서는 {g('생물 요소')}와 {o('비생물 요소')}가 영향을 주고받아요",
                 "생태계에서는 생물 요소와 비생물 요소가 서로 영향을 주고받아요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.say("생태계에는 비생물 요소도 꼭 들어가요",
                 "생태계가 살아 있는 동물과 식물로만 구성되어 있다는 말은 틀려요. 햇빛, 물, 공기, 흙 같은 비생물 요소도 생태계를 이루어요.")
        self.play(FadeIn(wrong, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
