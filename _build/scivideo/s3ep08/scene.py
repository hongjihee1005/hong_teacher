"""「과학 원리 돋보기」 3학년 8화 — 극지방과 사막에 사는 동물 (3-1 2단원 동물의 생활 6차시, 화 코드 3-1-2-d)

바탕: grade3/science/sem1/u2-4.html — 도입(추운 겨울 견디기, 극지방·사막 ENV), 몸에 지방이 있으면 좋은 점 실험
(큰 지퍼 백에 바셀린 1/3 → 작은 지퍼 백 → 양손을 얼음물에 → 바셀린 쪽 손이 덜 차가움, 얼음물 = 극지방의 추운 환경 · 바셀린 = 동물의 두꺼운 지방),
생각 바로잡기(지방이 열을 내는 것이 아님), 극지방 동물(북극곰·순록·하프물범·펭귄), 사막 동물(낙타·사막여우·이집트땅거북·사막전갈),
한눈에 쏙(북극곰 체온 유지), 수행 평가 2 정리 문장, 형성 평가 1.
앱의 가상 온도계 값은 '예시 값'이라 영상에서는 수를 쓰지 않고 차가움 막대만 보여 줌.
최종: ./make_final.sh s3ep08
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Circle, Circumscribe, Create, FadeIn, FadeOut, Indicate, Line, Rectangle,
                   RoundedRectangle, Square, VGroup, GrowFromEdge)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, SKIN, clear_stage
import kit_s3u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


VAS = "#F2D35B"   # 바셀린
ICE = "#CFEAF7"


def hand():
    """손바닥(손가락 네 개 + 엄지) — 아래가 손목"""
    palm = RoundedRectangle(corner_radius=0.2, width=0.9, height=0.9, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=3)
    fingers = VGroup(*[RoundedRectangle(corner_radius=0.1, width=0.2, height=0.55 - 0.08 * abs(i - 1.5), fill_color=SKIN, fill_opacity=1,
                                        stroke_color=INK, stroke_width=3).move_to([-0.33 + 0.22 * i, 0.6 - 0.04 * abs(i - 1.5), 0]) for i in range(4)])
    thumb = RoundedRectangle(corner_radius=0.1, width=0.2, height=0.5, fill_color=SKIN, fill_opacity=1, stroke_color=INK,
                             stroke_width=3).rotate(0.7).move_to([-0.55, 0.05, 0])
    wrist = Rectangle(width=0.7, height=0.9, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0, -0.85, 0])
    return VGroup(wrist, fingers, thumb, palm)


def bag(w, h, col=PAPER):
    b = RoundedRectangle(corner_radius=0.12, width=w, height=h, fill_color=col, fill_opacity=0.35, stroke_color="#6E8FA8", stroke_width=4)
    zip_ = Line(b.get_corner(UP + LEFT) + DOWN * 0.15 + RIGHT * 0.05, b.get_corner(UP + RIGHT) + DOWN * 0.15 + LEFT * 0.05,
                stroke_color="#3F7FBF", stroke_width=6)
    return VGroup(b, zip_)


class S3Ep08(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 8
    EP_TITLE = "극지방과 사막에 사는 동물"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.misconception()
        self.polar()
        self.desert()
        self.summary()
        self.check()
        self.closing(f"극지방 동물은 {o('두꺼운 지방')}·{o('촘촘한 털')}로 추위를 견디고\n"
                     f"사막 동물은 {g('큰 귀')}·{g('혹')}으로 건조한 환경을 견뎌요",
                     next_preview="3학년 9화 · 동물의 특징을 본뜬 생활용품")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        self.say("추운 겨울날, 우리는 어떻게 추위를 견디나요?", "추운 겨울날, 우리는 따뜻한 옷과 모자, 장갑, 목도리로 추위를 견뎌요.")
        items = VGroup(*[VGroup(K.ox_mark(True, 0.2), T(t, 44)).arrange(RIGHT, buff=0.35)
                         for t in ("따뜻한 옷을 입어요", "모자와 장갑을 착용해요", "목도리를 둘러요")]).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        items.move_to([0, 0.4, 0])
        self.play(FadeIn(items, lag_ratio=0.25), run_time=1.2)
        self.settle()
        self.play(FadeOut(items), run_time=0.4)
        lp = RoundedRectangle(corner_radius=0.3, width=6.4, height=4.6, fill_color="#E6F3FB", fill_opacity=1, stroke_color=BLUE, stroke_width=5).move_to([-3.4, 0.15, 0])
        rp = RoundedRectangle(corner_radius=0.3, width=6.4, height=4.6, fill_color="#FBEFD6", fill_opacity=1, stroke_color=ORANGE, stroke_width=5).move_to([3.4, 0.15, 0])
        ice = VGroup(K.poly([(-6.2, -1.6), (-5.0, -0.4), (-4.2, -1.0), (-3.2, 0.1), (-2.0, -1.0), (-0.6, -1.6)], "#FFFFFF", stroke="#9CC7E3"))
        flakes = VGroup(*[T("*", 40, "#9CC7E3").move_to([x, y, 0]) for x, y in ((-5.6, 1.1), (-4.0, 1.5), (-2.4, 1.0), (-1.2, 1.4))])
        dune = VGroup(K.poly([(0.6, -1.6), (1.8, -0.7), (3.0, -1.2), (4.4, -0.3), (6.2, -1.6)], K.SAND, stroke="#C9A060"))
        sun = Circle(radius=0.4, fill_color="#F6C445", fill_opacity=1, stroke_width=0).move_to([5.95, 1.6, 0])
        lt = T("극지방", 44, BLUE).move_to([-3.4, 1.95, 0])
        rt = T("사막", 44, ORANGE).move_to([3.4, 1.95, 0])
        self.play(FadeIn(lp), FadeIn(rp), FadeIn(ice), FadeIn(flakes), FadeIn(dune), FadeIn(sun), FadeIn(lt), FadeIn(rt), run_time=0.8)
        la = T("눈과 빙하 · 매우 추워요", 32).move_to([-3.4, 0.55, 0])
        ra = VGroup(T("비가 적게 내려 건조해요", 30), T("낮과 밤의 온도 차이가 커요", 30)).arrange(DOWN, buff=0.15).move_to([3.1, 0.45, 0])
        self.say(f"극지방은 {b_('눈과 빙하')}로 덮여 있고 {b_('매우 추워요')}", "극지방은 눈과 빙하로 덮여 있고 매우 추워요.")
        self.play(FadeIn(la), run_time=0.5)
        self.say(f"사막은 {o('건조')}하고, 낮과 밤의 {o('온도 차이')}가 커요",
                 "사막은 비가 적게 내려 건조하고, 낮과 밤의 온도 차이가 커요.")
        self.play(FadeIn(ra), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def experiment(self):
        self.section("실험해요")
        self.say("극지방 동물은 추위를 어떻게 견딜까요?", "극지방 동물은 추위를 어떻게 견딜까요? 몸에 지방이 있으면 좋은 점을 실험으로 알아봐요.")
        big1 = bag(2.6, 3.0).move_to([-3.0, 0.6, 0])
        big2 = bag(2.6, 3.0).move_to([3.0, 0.6, 0])
        l1 = T("바셀린이 든 지퍼 백", 32).next_to(big1, UP, buff=0.12)
        l2 = T("빈 지퍼 백", 32).next_to(big2, UP, buff=0.12)
        self.play(FadeIn(big1), FadeIn(big2), FadeIn(l1), FadeIn(l2), run_time=0.6)
        vas = RoundedRectangle(corner_radius=0.1, width=2.4, height=1.0, fill_color=VAS, fill_opacity=1, stroke_width=0)
        vas.align_to(big1[0], DOWN).shift(UP * 0.1).set_x(-3.0)
        self.say(f"① 큰 지퍼 백에 {o('바셀린')}을 1/3 정도 넣어요", "큰 지퍼 백 하나에 바셀린을 3분의 1 정도 넣어요.")
        self.play(GrowFromEdge(vas, DOWN), run_time=0.8)
        small1 = bag(1.5, 2.2, "#FFFFFF").move_to([-3.0, 0.45, 0])
        small2 = bag(1.5, 2.2, "#FFFFFF").move_to([3.0, 0.45, 0])
        self.say("② ③ 두 큰 지퍼 백에 작은 지퍼 백을 하나씩 넣어요",
                 "두 큰 지퍼 백에 작은 지퍼 백을 하나씩 넣어요.")
        self.play(FadeIn(small1, shift=DOWN * 0.5), FadeIn(small2, shift=DOWN * 0.5), run_time=0.7)
        # 작은 백 둘레를 감싸는 바셀린
        wrap = VGroup(Rectangle(width=0.4, height=2.0, fill_color=VAS, fill_opacity=1, stroke_width=0).move_to([-4.0, 0.35, 0]),
                      Rectangle(width=0.4, height=2.0, fill_color=VAS, fill_opacity=1, stroke_width=0).move_to([-2.0, 0.35, 0]))
        self.play(FadeIn(wrap), run_time=0.4)
        h1 = hand().scale(0.75).move_to([-3.0, 2.6, 0])
        h2 = hand().scale(0.75).move_to([3.0, 2.6, 0])
        tub = Rectangle(width=13.6, height=1.7, fill_color=K.WATER, fill_opacity=0.55, stroke_color=K.WATER_D, stroke_width=5).move_to([0, -1.55, 0])
        cubes = VGroup(*[Square(0.4, fill_color=ICE, fill_opacity=0.95, stroke_color="#7FB5D6", stroke_width=3).rotate(0.3 * i).move_to([x, -0.9, 0])
                         for i, x in enumerate((-6.0, -0.8, 0.4, 5.9, -5.2, 6.4))])
        self.say(f"④ 양손을 넣고 {b_('얼음물')}에 담가요", "양손을 작은 지퍼 백에 넣고, 두 지퍼 백을 동시에 얼음물에 담가요. 손을 얼음물에 오랫동안 담가 두지는 않아요.")
        self.play(h1.animate.move_to([-3.0, 0.3, 0]), h2.animate.move_to([3.0, 0.3, 0]), run_time=0.8)
        self.bringtop = VGroup(big1, big2, vas, wrap, small1, small2, h1, h2, l1, l2)
        self.play(FadeIn(tub), FadeIn(cubes), self.bringtop.animate.shift(DOWN * 0.55), run_time=0.8)
        self.pause_screen(5, "어느 쪽 손이 덜 차가울까요?")
        # 차가움 막대
        lab = T("차가움", 30, SOFT)
        bar1 = Rectangle(width=0.9, height=0.35, fill_color=BLUE, fill_opacity=1, stroke_width=0)
        bar2 = Rectangle(width=2.9, height=0.35, fill_color=BLUE, fill_opacity=1, stroke_width=0)
        g1 = VGroup(lab.copy(), bar1).arrange(RIGHT, buff=0.2).move_to([-0.9, 1.15, 0], aligned_edge=LEFT)
        g2 = VGroup(lab.copy(), bar2).arrange(RIGHT, buff=0.2).move_to([4.5, 1.15, 0], aligned_edge=LEFT)
        g1.move_to([-3.0, 2.75, 0]); g2.move_to([3.0, 2.75, 0])
        self.play(FadeOut(l1), FadeOut(l2), run_time=0.3)
        self.play(GrowFromEdge(g1, LEFT), GrowFromEdge(g2, LEFT), run_time=0.8)
        self.say(f"바셀린이 든 쪽 손이 {g('덜 차가워요')}", "빈 지퍼 백에 넣은 손은 차가웠고, 바셀린이 든 지퍼 백에 넣은 손은 덜 차가웠어요.")
        self.play(Circumscribe(h1, color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)
        # 무엇을 뜻할까
        a1 = VGroup(T("얼음물", 42, BLUE), T("→", 44, SOFT), T("극지방의 추운 환경", 42)).arrange(RIGHT, buff=0.4)
        a2 = VGroup(T("바셀린", 42, "#C69A12"), T("→", 44, SOFT), T("극지방 동물의 두꺼운 지방", 42)).arrange(RIGHT, buff=0.4)
        VGroup(a1, a2).arrange(DOWN, buff=0.6, aligned_edge=LEFT).move_to([0, 1.0, 0])
        self.say(f"얼음물은 {b_('극지방의 추운 환경')}, 바셀린은 {o('두꺼운 지방')}",
                 "실험에서 얼음물은 극지방의 추운 환경을, 바셀린은 극지방 동물의 두꺼운 지방을 뜻해요. 두꺼운 지방은 추위를 견디게 도와줘요.")
        self.play(FadeIn(a1, shift=RIGHT * 0.2), run_time=0.5)
        self.play(FadeIn(a2, shift=RIGHT * 0.2), run_time=0.5)
        c = M(f"두꺼운 {o('지방')}은 극지방 동물이 {g('추위를 견디게')} 도와줘요", 42).move_to([0, -1.3, 0])
        self.play(FadeIn(c), run_time=0.5)
        self.settle()
        clear_stage(self)

    def misconception(self):
        self.section("생각 바로잡기")
        q = M(f"“지방이 스스로 열을 내서 따뜻해진다?”  {r('×')}", 50).move_to([0, 2.3, 0])
        self.say("지방이 스스로 열을 내서 따뜻해질까요?", "지방이 스스로 열을 내서 따뜻해지는 걸까요?")
        self.play(FadeIn(q), run_time=0.5)
        fat = Circle(radius=1.55, fill_color=VAS, fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([-3.2, -0.2, 0])
        body = Circle(radius=1.0, fill_color="#F3B9A0", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(fat)
        bt = T("몸", 36).move_to(body)
        ft = T("지방", 32, "#8A6A00").move_to(fat.get_center() + UP * 1.27)
        arrows = VGroup(*[Arrow(fat.get_center() + 0.55 * np.array([np.cos(a), np.sin(a), 0]),
                                fat.get_center() + 1.45 * np.array([np.cos(a), np.sin(a), 0]), buff=0, color=RED, stroke_width=8,
                                max_tip_length_to_length_ratio=0.35) for a in (0.0, 1.57, 3.14, 4.71)])
        stop = VGroup(*[K.ox_mark(False, 0.16).move_to(fat.get_center() + 1.75 * np.array([np.cos(a), np.sin(a), 0])) for a in (0.0, 1.57, 3.14, 4.71)])
        self.play(FadeIn(fat), FadeIn(body), FadeIn(bt), FadeIn(ft), run_time=0.6)
        self.play(Create(arrows), run_time=0.6)
        self.play(FadeIn(stop), run_time=0.4)
        t = VGroup(M(f"지방이 열을 만드는 것이 {r('아니에요')}", 40),
                   M(f"몸의 따뜻함이 {o('빠져나가는 것을 막아')}", 40),
                   M(f"{g('체온을 유지')}하게 도와줘요", 40)).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([2.7, -0.2, 0])
        self.say(f"따뜻함이 {o('빠져나가는 것을 막아')} {g('체온을 유지')}해요",
                 "아니에요. 지방이 열을 만드는 것이 아니라, 두꺼운 지방이 몸의 따뜻함이 밖으로 빠져나가는 것을 막아 체온을 유지하게 도와줘요.")
        self.play(FadeIn(t, lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 극지방 동물 ──
    def polar(self):
        self.section("조사해요")
        data = [("북극곰", f"{o('촘촘한 털')},\n{o('두꺼운 지방')}", "북극곰은 몸이 촘촘한 털로 덮여 있고, 두꺼운 지방이 있어 체온을 유지해요."),
                ("순록", f"넓고 편평한\n{o('발굽')}", "순록은 발굽이 넓고 편평해 눈에 발이 잘 빠지지 않아요."),
                ("하프물범", f"새끼 때 {o('흰 털')},\n빙하 위에서 생활", "하프물범은 새끼 때 털이 흰색이고, 빙하 위에서 주로 생활해요."),
                ("펭귄", f"털, {o('몸을 맞대')}\n추위를 견뎌요", "펭귄은 몸이 털로 덮여 있고, 여러 펭귄이 서로 몸을 맞대 추위를 견뎌요.")]
        self.say(f"{b_('극지방')}에 사는 동물을 살펴봐요", "극지방에는 북극곰, 순록, 하프물범, 펭귄 등이 살아요.")
        self.cards_rows(data, BLUE)

    def desert(self):
        data = [("낙타", f"{o('혹')}에 지방 저장,\n긴 눈썹", "낙타는 등의 혹에 지방을 저장해 물과 먹이가 없어도 며칠 동안 살 수 있어요. 긴 눈썹은 모래바람을 막아 줘요."),
                ("사막여우", f"몸에 비해 {o('큰 귀')}\n열을 내보내요", "사막여우는 몸에 비해 큰 귀로 몸속의 열을 내보내고, 작은 소리도 잘 들어요."),
                ("이집트땅거북", f"작은 몸,\n{o('돔 모양')} 등껍질", "이집트땅거북은 몸이 작고, 등껍질이 돔 모양으로 높이 솟아 있어요."),
                ("사막전갈", f"돌 아래·틈에\n{o('숨어')} 살아요", "사막전갈은 돌 아래나 틈 사이에 몸을 숨기며 살아요.")]
        self.say(f"{o('사막')}에 사는 동물을 살펴봐요", "사막에는 낙타, 사막여우, 이집트땅거북, 사막전갈 등이 살아요.")
        self.cards_rows(data, ORANGE, fox_pause=True)

    def cards_rows(self, data, col, fox_pause=False):
        cs = VGroup(*[K.card(n, 3.05, 2.5, 34) for n, _, _ in data]).arrange(RIGHT, buff=0.3).move_to([0, 1.1, 0])
        for c in cs:
            c.box.set_stroke(col, 4)
        self.play(FadeIn(cs, lag_ratio=0.12), run_time=1.0)
        for i, (n, short, narr) in enumerate(data):
            if fox_pause and n == "사막여우":
                self.pause_screen(4, "큰 귀는 어떤 점이 좋을까요?")
            t = M(short, 32)
            if t.width > 3.05:
                t.scale_to_fit_width(3.05)
            t.next_to(cs[i], DOWN, buff=0.3)
            self.say(f"{n} — {short.replace(chr(10), ' ')}", narr)
            self.play(Indicate(cs[i], color=col, scale_factor=1.06), FadeIn(t, shift=UP * 0.15), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        c1 = K.text_card([f"극지방에 사는 동물은 두꺼운 {o('지방')}이 있거나 {o('촘촘한 털')}이 나 있어",
                          f"{b_('추위를 견딜')} 수 있어요"], size=38).move_to([0, 1.3, 0])
        c2 = K.text_card([f"사막에 사는 동물은 {o('큰 귀')}가 있거나 {o('혹')}에 지방을 저장해",
                          f"{g('건조한 사막의 환경을 견딜')} 수 있어요"], size=38).move_to([0, -0.9, 0])
        self.say(f"극지방 동물은 {o('지방')}·{o('털')}로 추위를 견뎌요",
                 "극지방에 사는 동물은 두꺼운 지방이 있거나 촘촘한 털이 나 있어 추위를 견딜 수 있어요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.6)
        self.say(f"사막 동물은 {o('큰 귀')}·{o('혹')}으로 건조한 환경을 견뎌요",
                 "사막에 사는 동물은 큰 귀가 있거나 혹에 지방을 저장해 건조한 사막의 환경을 견딜 수 있어요.")
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        q = K.text_card(["• 촘촘하게 털이 나 있어요.", "• 몸에 두꺼운 지방이 있어요.", "• 매우 추운 지역에 살아요."], size=38).move_to([0, 1.3, 0])
        self.say("다음 설명에 해당하는 동물은?", "다음 설명에 해당하는 동물은 어느 것일까요?")
        self.play(FadeIn(q), run_time=0.5)
        opts = ["① 낙타", "② 북극곰", "③ 사막전갈", "④ 사막여우", "⑤ 이집트땅거북"]
        ts = VGroup(*[T(s, 36) for s in opts]).arrange(RIGHT, buff=0.4).move_to([0, -0.5, 0])
        if ts.width > 13.4:
            ts.scale_to_fit_width(13.4)
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=0.8)
        self.pause_screen(5, "어느 동물일까요?")
        self.play(Circumscribe(ts[1], color=GREEN), ts[1].animate.set_color(GREEN), run_time=1.0)
        pb = K.fit(K.polar_bear(), 2.4, 1.0).move_to([0, -1.75, 0])
        self.say(f"정답은 ② {g('북극곰')}이에요", "정답은 2번 북극곰이에요.")
        self.play(FadeIn(pb), run_time=0.5)
        self.settle()
        clear_stage(self)
