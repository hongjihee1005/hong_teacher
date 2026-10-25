"""「과학 원리 돋보기」 3학년 6화 — 우리 주변·땅속에 사는 동물 (3-1 2단원 동물의 생활 3~4차시, 화 코드 3-1-2-b)

바탕: grade3/science/sem1/u2-2.html — 주변 동물(고양이·참새·나비·개미·달팽이·꿀벌·무당벌레·지렁이), 조사 준비물·옷차림·안전 약속,
땅에 사는 동물과 하늘을 날아다니는 동물(FLY), 생각 바로잡기(산호·말미잘·따개비), 매미 애벌레 허물 관찰(EXQ: 더듬이·다리 세 쌍·뾰족한 앞다리),
땅속 동물 조사(SOIL·DIG: 두더지·개미·땅강아지·매미 애벌레·지렁이), 한눈에 쏙, 생각+(땅강아지), 형성 평가 2·3.
최종: ./make_final.sh s3ep06
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Circumscribe, Create, FadeIn, FadeOut, Indicate, Line, Rectangle,
                   VGroup, Ellipse, RoundedRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, BROWN, BROWN_DARK, clear_stage
import kit_s3u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


SOIL = "#B98A5E"
SOIL_D = "#8E6440"


class S3Ep06(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 6
    EP_TITLE = "우리 주변·땅속에 사는 동물"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.around()
        self.safety()
        self.not_moving()
        self.exuvia()
        self.underground()
        self.summary()
        self.check()
        self.closing(f"땅속에 사는 동물은 {o('앞다리')}로 땅을 파는 등\n"
                     f"{g('땅속에서 살기에 알맞은')} 생김새와 생활 방식을 가져요",
                     next_preview="3학년 7화 · 물에 사는 동물과 물갈퀴")
        self.wait(0.5)

    # ── 우리 주변 동물 ──
    def around(self):
        self.section("궁금해요")
        gy = -0.9
        ground = Rectangle(width=14.4, height=1.5, fill_color="#9CCB7A", fill_opacity=1, stroke_width=0).move_to([0, gy - 0.75, 0])
        gl = Line([-7.2, gy, 0], [7.2, gy, 0], stroke_color="#5E8F45", stroke_width=6)
        self.say("학교나 집 주변에서 어떤 동물을 보았나요?", "학교나 집 주변에서 어떤 동물을 본 적이 있나요?")
        self.play(FadeIn(ground), Create(gl), run_time=0.6)
        land = [("고양이", -5.2, 1.6), ("달팽이", -2.6, 1.1), ("개미", -0.6, 0.8), ("공벌레", 1.2, 0.8), ("지렁이", 3.3, 1.2)]
        sky = [("참새", -5.0, 1.25), ("박새", -2.4, 1.25), ("배추흰나비", 0.2, 1.1), ("꿀벌", 2.5, 0.9), ("잠자리", 5.0, 1.3)]
        L_, S_ = VGroup(), VGroup()
        for n, x, w in land:
            m = K.fit(K.DRAW[n](), w, 0.85)
            m.move_to([x, gy + m.height / 2 + 0.02, 0])
            L_.add(VGroup(m, T(n, 28, INK).move_to([x, gy - 0.55, 0])))
        for i, (n, x, w) in enumerate(sky):
            m = K.fit(K.DRAW[n](), w, 0.85).move_to([x, 1.75 - 0.35 * (i % 2), 0])
            S_.add(VGroup(m, T(n, 28, INK).next_to(m, DOWN, buff=0.1)))
        self.play(FadeIn(L_, lag_ratio=0.12), run_time=1.2)
        self.play(FadeIn(S_, lag_ratio=0.12), run_time=1.2)
        self.say(f"우리 주변에는 {g('다양한 동물')}이 살고 있어요", "우리 주변에는 고양이, 달팽이, 참새, 나비처럼 다양한 동물이 살고 있어요.")
        t1 = T("땅에 사는 동물", 36, BROWN_DARK).move_to([4.6, -2.1, 0])
        t2 = T("하늘을 날아다니는 동물", 36, BLUE).move_to([-1.6, 2.7, 0])
        self.say(f"달팽이·고양이처럼 {o('땅에 사는 동물')}", "달팽이나 고양이, 개미, 지렁이, 공벌레처럼 땅에 사는 동물도 있고,")
        self.play(FadeIn(t1), Indicate(L_, color=BROWN_DARK, scale_factor=1.05), run_time=1.0)
        self.say(f"나비·참새처럼 {b_('하늘을 날아다니는 동물')}도 있어요", "나비와 참새처럼 하늘을 날아다니는 동물도 있어요.")
        self.play(FadeIn(t2), Indicate(S_, color=BLUE, scale_factor=1.05), run_time=1.0)
        self.settle()
        clear_stage(self)

    def safety(self):
        self.section("조사해요")
        self.say("학교에 사는 동물을 조사하러 가요", "학교에 사는 여러 가지 동물을 조사하러 떠나 볼까요? 준비물과 약속을 확인해요.")
        items = [("돋보기·확대경으로 자세히 관찰해요", GREEN), ("긴소매·긴바지를 입어요", GREEN),
                 ("동물을 함부로 만지거나 채집하지 않아요", GREEN), ("사진이나 영상으로 기록해요", GREEN),
                 ("관찰이 끝나면 손을 깨끗이 씻어요", GREEN)]
        rows = VGroup()
        for t, c in items:
            rows.add(VGroup(K.ox_mark(True, 0.2), T(t, 40, INK)).arrange(RIGHT, buff=0.35))
        rows.arrange(DOWN, buff=0.32, aligned_edge=LEFT).move_to([0, 0.25, 0])
        self.play(FadeIn(rows, lag_ratio=0.2), run_time=1.6)
        self.say(f"{o('긴소매·긴바지')}를 입고, 동물은 {r('함부로 채집하지 않아요')}",
                 "벌이나 개미에 쏘이지 않도록 긴소매, 긴바지를 입어요. 관찰한 동물은 함부로 채집하지 않고 사진이나 영상으로 기록해요.")
        self.play(Indicate(rows[1], color=ORANGE, scale_factor=1.05), Indicate(rows[2], color=ORANGE, scale_factor=1.05), run_time=0.8)
        self.settle()
        clear_stage(self)

    def not_moving(self):
        self.section("생각 바로잡기")
        q = M(f"“동물은 모두 움직인다?”  {r('×')}", 56).move_to([0, 2.2, 0])
        co = K.fit(K.coral(), 1.8, 1.6).move_to([-3.5, 0.1, 0])
        ba = K.fit(K.barnacle(), 2.2, 1.4).move_to([3.5, 0.0, 0])
        cl = T("산호", 36).next_to(co, DOWN, buff=0.2)
        bl = T("따개비", 36).next_to(ba, DOWN, buff=0.2)
        an = K.fit(K.anemone(), 1.8, 1.6).move_to([0, 0.1, 0])
        ml = VGroup(an, T("말미잘", 36).next_to(an, DOWN, buff=0.2))
        self.say(f"산호·말미잘·따개비는 {o('한곳에 붙어서')} 살아요",
                 "동물은 모두 움직일까요? 아니에요. 산호, 말미잘, 따개비처럼 한곳에 붙어서 움직이지 않는 동물도 있어요.")
        self.play(FadeIn(q), run_time=0.6)
        self.play(FadeIn(co), FadeIn(cl), FadeIn(ml), FadeIn(ba), FadeIn(bl), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 매미 애벌레 허물 ──
    def exuvia(self):
        self.section("관찰해요")
        self.say("땅에서 동물이 파 놓은 구멍을 볼 때가 있어요",
                 "땅을 자세히 살펴보면 땅속 동물이 파 놓은 구멍을 볼 때가 있어요. 어떻게 땅을 팠을까요?")
        nym = K.cicada_nymph()
        K.fit(nym, 3.2, 3.6).move_to([-3.0, 0.1, 0])
        self.play(FadeIn(nym, scale=0.9), run_time=0.8)
        word = K.text_card([f"{o('허물')}: 매미 애벌레 등이", "자라면서 벗는 껍질"], size=36).move_to([3.4, 2.0, 0])
        self.say(f"매미 애벌레의 {o('허물')}을 돋보기로 관찰해요",
                 "매미 애벌레의 허물을 관찰해요. 허물은 매미 애벌레 등이 자라면서 벗는 껍질이에요. 허물을 보면 애벌레의 모습을 알 수 있어요.")
        self.play(FadeIn(word), run_time=0.6)
        ring = Circle(radius=0.75, stroke_color=RED, stroke_width=7).move_to(nym.ants.get_center() + DOWN * 0.25)
        self.say(f"머리에는 {o('더듬이')}가 있어요", "머리에는 더듬이가 있어요.")
        self.play(Create(ring), nym.ants.animate.set_color(RED), run_time=0.8)
        f1 = M(f"머리에 {o('더듬이')}", 40).move_to([3.4, 0.45, 0])
        self.play(FadeIn(f1), run_time=0.4)
        self.say(f"다리를 세어 봐요 — {o('세 쌍')}이에요", "다리를 세어 볼까요? 하나, 둘, 셋, 넷, 다섯, 여섯. 다리는 세 쌍이에요.")
        self.play(FadeOut(ring), run_time=0.3)
        legs = list(nym[0]) + list(nym[1])
        order = [nym[1][0], nym[1][1], nym[0][0], nym[0][2], nym[0][1], nym[0][3]]
        nums = VGroup()
        for i, lg in enumerate(order):
            p = lg.get_end() if i >= 2 else lg[0].get_end()
            off = LEFT * 0.36 if p[0] < nym.get_center()[0] else RIGHT * 0.36
            n = T(str(i + 1), 34, RED).move_to(p + off)
            nums.add(n)
            self.play(FadeIn(n, scale=1.4), Indicate(lg, color=RED), run_time=0.4)
        f2 = M(f"다리 {o('세 쌍')}", 40).move_to([3.4, -0.4, 0])
        self.play(FadeIn(f2), run_time=0.4)
        self.pause_screen(5, "매미 애벌레는 무엇으로 땅을 팔까요?")
        self.play(FadeOut(nums), run_time=0.3)
        ring2 = Circle(radius=0.95, stroke_color=RED, stroke_width=7).move_to(nym.front.get_center() + UP * 0.25)
        self.say(f"앞다리 끝이 {o('뾰족해요')} — 이 앞다리로 땅을 파요", "앞다리 끝이 뾰족해요. 매미 애벌레는 뾰족한 앞다리로 땅을 파요.")
        self.play(Create(ring2), nym.front.animate.set_color(RED), run_time=0.8)
        f3 = M(f"{g('뾰족한 앞다리')}로 땅을 파요", 40).move_to([3.4, -1.25, 0])
        self.play(FadeIn(f3), run_time=0.4)
        self.say(f"허물은 {r('쉽게 부서져요')} — 힘을 주어 만지지 않아요",
                 "허물은 쉽게 부서지므로 힘을 주어 만지지 않아요. 관찰한 뒤에는 손을 깨끗이 씻어요.")
        self.settle()
        clear_stage(self)

    # ── 땅속 단면 ──
    def underground(self):
        self.section("조사해요")
        top = 1.7
        soil = Rectangle(width=14.4, height=top + 2.6, fill_color=SOIL, fill_opacity=1, stroke_width=0).move_to([0, (top - 2.6) / 2, 0])
        grass = Line([-7.2, top, 0], [7.2, top, 0], stroke_color="#5E8F45", stroke_width=10)
        tree = VGroup(Rectangle(width=0.5, height=1.2, fill_color=BROWN, fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=4).move_to([4.6, top + 0.6, 0]))
        roots = VGroup(*[K.smooth([(4.6, top), (4.6 + dx * 0.5, top - 0.6), (4.6 + dx, top - 1.3)], BROWN_DARK, 6) for dx in (-0.9, -0.3, 0.4, 1.0)])
        pebbles = VGroup(*[Ellipse(width=0.3, height=0.18, fill_color=SOIL_D, fill_opacity=1, stroke_width=0).move_to([x, y, 0])
                           for x, y in ((-6.2, 0.3), (-3.4, -1.6), (-0.2, 1.0), (2.3, -1.9), (6.4, -0.8), (-1.6, -0.3))])
        self.say("두더지, 개미, 땅강아지, 매미 애벌레, 지렁이", "땅속을 들여다볼까요? 두더지, 개미, 땅강아지, 매미 애벌레, 지렁이가 땅속에 살아요.")
        self.play(FadeIn(soil), Create(grass), FadeIn(tree), FadeIn(roots), FadeIn(pebbles), run_time=0.8)
        # 굴
        tun = K.smooth([(-6.8, 0.6), (-5.0, 0.4), (-3.5, 0.7)], SOIL_D, 40)
        nest = VGroup(K.smooth([(-0.9, top), (-0.8, 0.9), (-1.0, 0.2)], SOIL_D, 16),
                      Ellipse(width=1.3, height=0.6, fill_color=SOIL_D, fill_opacity=1, stroke_width=0).move_to([-1.0, 0.0, 0]))
        mole = K.fit(K.mole(), 1.9, 1.0).move_to([-4.6, 0.55, 0])
        ant = K.fit(K.ant(), 0.9, 0.5).move_to([-1.0, 0.05, 0])
        cric = K.fit(K.mole_cricket(), 1.6, 0.75).move_to([1.6, 0.9, 0])
        nymph = K.fit(K.cicada_nymph(), 0.9, 1.0).rotate(-0.4).move_to([5.0, -0.2, 0])
        worm = K.fit(K.worm(), 1.6, 0.4).move_to([-3.0, -1.4, 0])
        animals = [("두더지", mole, (-4.6, -0.25)), ("개미", ant, (-1.0, -0.55)), ("땅강아지", cric, (1.6, 0.2)),
                   ("매미 애벌레", nymph, (5.0, -1.05)), ("지렁이", worm, (-3.0, -1.95))]
        self.play(Create(tun), FadeIn(nest), run_time=0.5)
        names = VGroup()
        for n, m, (x, y) in animals:
            names.add(T(n, 30, PAPER).move_to([x, y, 0]))
        self.play(*[FadeIn(m, scale=0.8) for _, m, _ in animals], FadeIn(names), run_time=1.0)
        self.pause_screen(5, "누가 어떻게 땅을 팔까요?")
        how = [("두더지", mole, f"두더지는 {o('삽처럼 넓적한 앞다리')}로 굴을 파요",
                "두더지는 앞발이 삽처럼 넓적하고 발톱이 단단하고 뾰족해요. 이 앞다리로 굴을 파요."),
               ("땅강아지", cric, f"땅강아지도 {o('넓적한 앞다리')}로 땅을 파요", "땅강아지는 삽 모양으로 넓고 두꺼운 앞다리로 땅을 파며 살아요."),
               ("개미", ant, f"개미는 {o('큰턱')}으로 땅을 파서 집을 지어요", "개미는 큰턱으로 땅을 파서 땅속에 집을 지어요."),
               ("매미 애벌레", nymph, f"매미 애벌레는 {o('뾰족한 앞다리')}로 땅을 파요",
                "매미 애벌레는 뾰족한 앞다리로 땅속에 굴을 파고, 나무뿌리의 수액을 빨아 먹으며 살아요."),
               ("지렁이", worm, f"지렁이는 몸을 {o('늘였다 당기며')} 이동해요",
                "지렁이는 다리가 없어요. 몸의 앞부분을 늘려 흙을 밀어 낸 다음, 뒷부분을 끌어당기며 땅속을 이동해요.")]
        for n, m, sub, narr in how:
            self.say(sub, narr)
            self.play(Indicate(m, color=PAPER, scale_factor=1.25), run_time=1.0)
            if n == "지렁이":
                self.play(m.animate.stretch(1.25, 0), run_time=0.5)
                self.play(m.animate.stretch(0.8, 0).shift(RIGHT * 0.25), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        c = K.text_card([f"땅속에 사는 동물은 {o('뾰족한 앞다리')}로 땅을 파는 등",
                         f"{g('땅속에서 살기에 알맞은')} 생김새와 생활 방식을 가지고 있어요"], size=42).move_to([0, 1.4, 0])
        self.say(f"땅속 동물은 {g('땅속에서 살기에 알맞은')} 생김새를 가졌어요",
                 "땅속에 사는 동물은 뾰족한 앞다리로 땅을 파는 등 땅속에서 살기에 알맞은 생김새와 생활 방식을 가지고 있어요.")
        self.play(FadeIn(c, shift=UP * 0.2), run_time=0.7)
        cr = K.fit(K.mole_cricket(), 2.6, 1.3).move_to([-4.9, -0.9, 0])
        t = M(f"땅강아지: {o('넓적한 앞다리')} → 땅을 잘 팜", 40)
        t.next_to(cr, RIGHT, buff=0.4)
        self.say(f"땅강아지는 {o('넓적한 앞다리')}로 땅을 잘 파서 땅속에서 잘 살아요",
                 "땅강아지가 땅속에서 잘 살 수 있는 까닭은, 넓적한 앞다리가 있어 땅을 잘 팔 수 있기 때문이에요.")
        self.play(FadeIn(cr), run_time=0.6)
        self.play(FadeIn(t), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        self.say("땅속에 사는 동물 ㈎와 ㈏의 공통 특징은?", "땅속에 사는 동물 가와 나예요. 이름은 무엇이고, 공통적인 특징은 무엇일까요?")
        a = K.fit(K.mole(), 3.2, 1.7).move_to([-3.2, 0.9, 0])
        b_ = K.fit(K.mole_cricket(), 3.2, 1.5).move_to([3.2, 0.9, 0])
        la = T("㈎", 44, INK).next_to(a, UP, buff=0.15)
        lb = T("㈏", 44, INK).next_to(b_, UP, buff=0.15)
        self.play(FadeIn(a), FadeIn(b_), FadeIn(la), FadeIn(lb), run_time=0.7)
        self.pause_screen(5, "㈎·㈏의 이름과 공통 특징은?")
        na = T("두더지", 40, ORANGE).next_to(a, DOWN, buff=0.2)
        nb = T("땅강아지", 40, ORANGE).next_to(b_, DOWN, buff=0.2)
        self.say(f"㈎는 {o('두더지')}, ㈏는 {o('땅강아지')}예요", "가는 두더지, 나는 땅강아지예요.")
        self.play(FadeIn(na), FadeIn(nb), run_time=0.5)
        ans = M(f"공통 특징: {g('앞다리를 이용해 땅을 팔 수 있어요')}", 42).move_to([0, -1.75, 0])
        self.say(f"둘 다 {g('앞다리를 이용해 땅을 팔 수 있어요')}", "두 동물 모두 앞다리를 이용해 땅을 팔 수 있어서 땅속에서 살기에 알맞아요.")
        self.play(FadeIn(ans), run_time=0.6)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'
