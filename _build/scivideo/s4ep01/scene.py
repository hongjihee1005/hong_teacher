"""「과학 원리 돋보기」 4학년 1화 — 자석에 붙는 물체는 무엇으로 만들어졌을까? (4-1 1단원 자석의 이용 2차시, 화 코드 4-1-1-a)

바탕: grade4/science/sem1/u1-1.html(원본 _build_tb/src/u1-1.html) — 도입(자석 장식품: 냉장고·칠판·철 현관문에 붙고 나무 책장·유리창에는 안 붙음),
예상·실험(철 클립·플라스틱 자·철 집게·나무토막·철자·색종이·빵 끈·고무풍선·알루미늄 캔 아홉 가지), 분류(그렇다/그렇지 않다),
공통점(철), 생각+(집: 냉장고 문·철 옷핀·철 못·철 머리핀·가위 날), 한눈에 쏙 '자석에 붙는 물체는 철로 만들어졌습니다'.
최종: ./make_final.sh s4ep01
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, RoundedRectangle,
                   Circle, SurroundingRectangle, Circumscribe, Write, rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s4u11 as K
import kit_s3u21 as K3


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def deco():
    """자석 장식품(동그란 꽃 모양)"""
    c = Circle(radius=0.26, fill_color="#FFC93C", fill_opacity=1, stroke_color="#B58400", stroke_width=4)
    d = Circle(radius=0.1, fill_color=K.NC, fill_opacity=1, stroke_width=0)
    return VGroup(c, d)


class S4Ep01(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 1
    EP_TITLE = "자석에 붙는 물체는 무엇으로 만들어졌을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.predict_test()
        self.sort()
        self.correct()
        self.home()
        self.summary()
        self.closing(f"자석에 붙는 물체는 {r('철')}로 만들어졌어요\n알루미늄·플라스틱·나무·종이·고무는 {g('붙지 않아요')}",
                     next_preview="4학년 2화 · 자석과 철 사이의 힘")
        self.wait(0.5)

    # ── 궁금해요: 자석 장식품 ──
    def intro(self):
        self.section("궁금해요")
        fridge = VGroup(K.rect(1.7, 3.2, "#F4F7FA", stroke="#8A97A3", r=0.12),
                        Line([-0.85, 0.45, 0], [0.85, 0.45, 0], stroke_color="#8A97A3", stroke_width=4),
                        K.rect(0.1, 0.6, "#8A97A3", x=0.65, y=0.95, sw=0)).move_to([-5.2, 0.4, 0])
        board = VGroup(K.rect(3.0, 1.9, "#2F6A4F", stroke="#7E5428", sw=8)).move_to([-1.8, 1.0, 0])
        door = VGroup(K.rect(1.6, 3.2, "#AEB7BF", stroke="#5E666F"), Circle(radius=0.1, fill_color="#5E666F",
                      fill_opacity=1, stroke_width=0).move_to([0.55, 0, 0])).move_to([1.2, 0.4, 0])
        shelf = VGroup(K.rect(1.8, 2.6, K.WOOD, stroke=K.WOOD_D),
                       *[Line([-0.9, y, 0], [0.9, y, 0], stroke_color=K.WOOD_D, stroke_width=4) for y in (-0.4, 0.45)]
                       ).move_to([3.6, 0.1, 0])
        win = VGroup(K.rect(1.6, 1.9, "#CFEAF6", stroke="#6FA6C2", op=0.7),
                     Line([0, -0.95, 0], [0, 0.95, 0], stroke_color="#6FA6C2", stroke_width=4)).move_to([5.75, 1.0, 0])
        items = [(fridge, "냉장고", True), (board, "칠판", True), (door, "철 현관문", True),
                 (shelf, "나무 책장", False), (win, "유리창", False)]
        labs = VGroup(*[T(n, 30).next_to(m, DOWN, buff=0.18) for m, n, _ in items])
        self.say("자석 장식품은 어디에 붙여 놓을 수 있을까요?", "자석 장식품을 붙여 놓으려고 해요. 어디에 붙일 수 있을까요?")
        self.play(FadeIn(VGroup(*[m for m, _, _ in items]), lag_ratio=0.12), FadeIn(labs), run_time=1.2)
        self.pause_screen(5, "자석 장식품이 붙는 곳은?")
        anims, marks = [], VGroup()
        for m, n, ok in items:
            d = deco().move_to(m.get_center() + UP * 0.6)
            if ok:
                anims.append(FadeIn(d, scale=1.6))
                marks.add(d)
            else:
                x = K.ox_mark(False, 0.32).move_to(m.get_center() + UP * 0.6)
                marks.add(x)
        self.say(f"냉장고, 칠판, 철 현관문에 {g('붙어요')}", "냉장고, 칠판, 철 현관문에는 자석 장식품이 붙어요.")
        self.play(*anims, run_time=0.8)
        self.say(f"나무 책장과 유리창에는 {r('붙지 않아요')}", "나무 책장과 유리창에는 붙지 않아요.")
        self.play(FadeIn(marks[3]), FadeIn(marks[4]), run_time=0.5)
        self.say(f"붙는 곳의 공통점은? {o('철로 만든 물체')} 같아요",
                 "자석 장식품이 붙는 곳은 어떤 공통점이 있을까요? 색깔이나 무게가 아니라, 무엇으로 만들었는지 생각해 봐요. 철로 만든 물체 같아요.")
        self.play(*[Indicate(VGroup(items[i][0], labs[i]), color=ORANGE) for i in range(3)], run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 예상하고 실험해요 ──
    def grid(self):
        cards = VGroup()
        for i, (k, n, fe, f) in enumerate(K.OBJS):
            c = K.obj_card(n, f, 2.9, 1.6, 30)
            c.move_to([(i % 3 - 1) * 3.2, 2.05 - (i // 3) * 1.75, 0])
            cards.add(c)
        return cards

    def predict_test(self):
        self.section("예상해요")
        cards = self.grid()
        self.say("아홉 가지 물체를 준비했어요", "철 클립, 플라스틱 자, 철 집게, 나무토막, 철자, 색종이, 빵 끈, 고무풍선, 알루미늄 캔을 준비했어요.")
        self.play(FadeIn(cards, lag_ratio=0.08), run_time=1.4)
        self.say("어떤 물체가 자석에 붙을지 예상해 봐요", "어떤 물체가 자석에 붙을지 먼저 예상해 봐요. 예상은 틀려도 괜찮아요.")
        self.pause_screen(6, "어떤 물체가 자석에 붙을까요?")
        self.play(FadeOut(cards), run_time=0.4)

        self.section("실험해요")
        self.say("막대자석을 물체에 가까이 해 봐요", "이제 막대자석을 물체에 하나씩 가까이 해 봐요.")
        for idx in (0, 8):
            self.test_one(idx)
        self.say("나머지 물체도 모두 실험해요", "나머지 물체도 같은 방법으로 모두 실험해요.")
        cards = self.grid()
        self.play(FadeIn(cards), run_time=0.5)
        marks = VGroup()
        for c, (k, n, fe, f) in zip(cards, K.OBJS):
            mk = K.ox_mark(fe, 0.24).move_to(c.box.get_corner(UP + RIGHT) + np.array([-0.34, -0.34, 0]))
            marks.add(mk)
        self.play(FadeIn(marks, lag_ratio=0.1), run_time=1.6)
        self.say(f"자석에 {g('붙는 물체')}도 있고, {r('붙지 않는 물체')}도 있어요",
                 "자석에 붙는 물체도 있고, 자석에 붙지 않는 물체도 있어요. 내 예상과 같았나요?")
        self.settle()
        self.cards, self.marks = cards, marks
        self.play(FadeOut(marks), run_time=0.3)
        clear_stage(self, keep=[cards])

    def test_one(self, idx):
        k, n, fe, f = K.OBJS[idx]
        tbl = K.rect(12.4, 0.12, "#C9B27A", y=-0.62, sw=0)
        ob = K.fit(f(), 1.7, 1.2)
        ob.move_to([2.2, -0.62 + 0.06 + ob.height / 2, 0])
        mag = K.bar_magnet("N", 2.6, 0.62).move_to([-5.0, 0.0, 0])
        mag.move_to([-5.0, ob.get_center()[1], 0])
        lab = T(n, 40).move_to([2.2, 2.45, 0])
        self.say(f"{n}에 막대자석을 가까이 하면?", f"{n}에 막대자석을 가까이 해 볼게요.")
        self.play(FadeIn(tbl), FadeIn(ob), FadeIn(mag), FadeIn(lab), run_time=0.5)
        if fe:
            tgt = ob.get_left()[0] - 0.55
            self.play(mag.animate.shift(RIGHT * (tgt - mag.get_right()[0])), run_time=1.0)
            self.play(ob.animate.shift(LEFT * (ob.get_left()[0] - mag.get_right()[0])), run_time=0.25)
            self.play(VGroup(mag, ob).animate.shift(UP * 1.3), run_time=0.8)
            res = M(g("붙어요!"), 48).move_to([-3.8, 1.75, 0])
            self.play(FadeIn(res, scale=1.3), run_time=0.4)
            self.say(f"{n}은 자석에 {g('붙어요')}", f"{n}이 자석에 끌려와 붙었어요.")
        else:
            tgt = ob.get_left()[0] - 0.02
            self.play(mag.animate.shift(RIGHT * (tgt - mag.get_right()[0])), run_time=1.1)
            self.play(mag.animate.shift(UP * 1.3), run_time=0.8)
            res = M(r("붙지 않아요!"), 48).move_to([-3.8, 1.75, 0])
            self.play(FadeIn(res, scale=1.3), run_time=0.4)
            self.say(f"{n}은 자석에 {r('붙지 않아요')}", f"{n}은 자석에 붙지 않아요.")
        self.settle()
        self.play(FadeOut(VGroup(tbl, ob, mag, lab, res)), run_time=0.4)

    # ── 분류해요 ──
    def sort(self):
        self.section("분류해요")
        cards = self.cards
        yes = K.bin_box("그렇다", 6.6, 4.5, GREEN, 36).move_to([-3.45, 0.05, 0])
        no = K.bin_box("그렇지 않다", 6.6, 4.5, RED, 36).move_to([3.45, 0.05, 0])
        head = T("분류 기준: 자석에 붙나요?", 36).move_to([0, 2.75, 0])
        self.say("분류 기준: 자석에 붙나요?", "실험 결과를 보고, 자석에 붙나요라는 기준으로 분류해 봐요.")
        self.play(cards.animate.scale(0.55).move_to([0, -0.4, 0]), run_time=0.6)
        self.play(FadeIn(yes), FadeIn(no), FadeIn(head), cards.animate.set_opacity(0), run_time=0.6)
        ys = K.slots(-3.45, 1.1, 4, 2, 3.1, 1.25)
        ns = K.slots(3.45, 1.1, 5, 2, 3.1, 1.25)
        iy = ino = 0
        small = VGroup()
        for k, n, fe, f in K.OBJS:
            c = K.obj_card(n, f, 2.8, 1.1, 28)
            c.pic.scale(0.75).shift(UP * 0.05)
            c.label.shift(UP * 0.1)
            if fe:
                c.move_to(ys[iy]); iy += 1
            else:
                c.move_to(ns[ino]); ino += 1
            small.add(c)
        self.remove(cards)
        self.play(FadeIn(small, lag_ratio=0.1), run_time=1.6)
        self.say(f"붙는 것: 철 클립·철 집게·철자·{o('빵 끈')}",
                 "자석에 붙는 물체는 철 클립, 철 집게, 철자, 빵 끈이에요.")
        self.play(Indicate(VGroup(*[c for c, o_ in zip(small, K.OBJS) if o_[2]]), color=GREEN, scale_factor=1.05), run_time=1.0)
        self.say("붙지 않는 것: 플라스틱 자·나무토막·색종이·고무풍선·알루미늄 캔",
                 "자석에 붙지 않는 물체는 플라스틱 자, 나무토막, 색종이, 고무풍선, 알루미늄 캔이에요.")
        self.say(f"자석에 붙는 물체는 무엇으로 만들었나요? → {r('철')}",
                 "자석에 붙는 물체는 무엇으로 만들어졌을까요? 모두 철로 만들었어요.")
        self.play(Circumscribe(yes.box, color=RED, buff=0.05), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def correct(self):
        self.section("생각 바로잡기")
        can = K.fit(K.al_can(), 1.4, 2.0).move_to([-4.3, 0.6, 0])
        cl = T("알루미늄 캔", 34).next_to(can, DOWN, buff=0.25)
        q = T("금속은 모두 자석에 붙을까요?", 46).move_to([0.8, 2.4, 0])
        self.say("금속은 모두 자석에 붙을까요?", "알루미늄 캔도 금속이에요. 그렇다면 금속은 모두 자석에 붙을까요?")
        self.play(FadeIn(q), FadeIn(can), FadeIn(cl), run_time=0.7)
        x = K.ox_mark(False, 0.42).move_to(can.get_center())
        self.say(f"알루미늄은 금속이지만 자석에 {r('붙지 않아요')}",
                 "알루미늄은 금속이지만 자석에 붙지 않아요. 모든 금속이 아니라, 철로 만든 물체가 자석에 붙어요.")
        self.play(FadeIn(x, scale=1.4), run_time=0.5)
        pr = K.fit(K.plastic_ruler(), 2.6, 0.7).move_to([0.6, 1.0, 0])
        ir = K.fit(K.iron_ruler(), 2.6, 0.7).move_to([0.6, -0.4, 0])
        prl = T("플라스틱 자", 30).next_to(pr, RIGHT, buff=0.3)
        irl = T("철자", 30).next_to(ir, RIGHT, buff=0.3)
        mk1 = K.ox_mark(False, 0.26).next_to(prl, RIGHT, buff=0.3)
        mk2 = K.ox_mark(True, 0.26).next_to(irl, RIGHT, buff=0.3)
        mk2.align_to(mk1, LEFT)
        self.say(f"같은 '자'라도 {o('무엇으로 만들었는지')}가 중요해요",
                 "같은 자라도 철자는 붙고 플라스틱 자는 붙지 않아요. 이름이 아니라 무엇으로 만들었는지가 중요해요.")
        self.play(FadeIn(VGroup(pr, ir, prl, irl)), run_time=0.6)
        self.play(FadeIn(mk1), FadeIn(mk2), run_time=0.4)
        bt = K.fit(K.bread_tie(), 2.4, 0.5).move_to([0.9, -1.75, 0])
        btl = T("빵 끈: 속에 철사", 30).next_to(bt, RIGHT, buff=0.3)
        self.say(f"빵 끈은 겉은 종이·비닐이지만 속에 {o('철사')}가 있어요",
                 "빵 끈은 겉은 종이나 비닐이지만, 속에 철사가 들어 있어서 자석에 붙어요.")
        self.play(FadeIn(bt), FadeIn(btl), run_time=0.5)
        self.play(Indicate(bt[1], color=ORANGE, scale_factor=1.1), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생활 속: 집에서 ──
    def home(self):
        self.section("생활 속 자석")
        self.say("집에 있는 물체 중에서 자석에 붙는 것을 찾아요", "집에 있는 물체 중에서 자석에 붙는 것을 찾아볼까요?")
        fr = VGroup(K.rect(1.5, 2.4, "#F4F7FA", stroke="#8A97A3", r=0.12),
                    Line([-0.75, 0.3, 0], [0.75, 0.3, 0], stroke_color="#8A97A3", stroke_width=4))
        sc = K3.scissors()
        nl = K3.nail()
        pins = [(fr, "냉장고 문", 1.6, 2.4), (K.fit(sc, 2.0, 1.1), "가위", 2.0, 1.1), (nl, "철로 만든 못", 1.0, 1.4)]
        xs = [-4.6, -0.6, 3.6]
        grp = VGroup()
        for (m, n, w, h), x in zip(pins, xs):
            K.fit(m, w, h).move_to([x, 0.7, 0])
            grp.add(VGroup(m, T(n, 32).next_to(m, DOWN, buff=0.25)))
        self.play(FadeIn(grp, lag_ratio=0.15), run_time=0.9)
        rings = VGroup(*[SurroundingRectangle(m_, buff=0.15, corner_radius=0.2, color=GREEN, stroke_width=6)
                         for m_ in (fr, sc.blade, nl)])
        self.say(f"냉장고 문, 철 못, 철 옷핀, 철 머리핀이 {g('붙어요')}",
                 "냉장고 문, 철로 만든 못, 철 옷핀, 철 머리핀은 철로 만들어서 자석에 붙어요.")
        self.play(Create(rings[0]), Create(rings[2]), run_time=0.7)
        self.say(f"가위는 철로 만든 {o('날 부분')}만 붙어요",
                 "가위처럼 여러 가지 물질로 만든 물체는 철로 만든 날 부분만 자석에 붙어요. 플라스틱 손잡이는 붙지 않아요.")
        self.play(Create(rings[1]), run_time=0.6)
        self.play(Indicate(sc.blade, color=ORANGE, scale_factor=1.15), run_time=0.8)
        self.say("휴대폰·텔레비전 같은 전자 기기에는 자석을 대지 않아요",
                 "휴대폰, 태블릿, 텔레비전 같은 전자 기기에는 자석을 직접 대지 않아요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"자석에 붙는 물체는 {r('철')}로 만들어졌습니다.",
                            "종이, 플라스틱, 나무, 고무, 알루미늄 등으로",
                            "만들어진 물체는 자석에 붙지 않습니다."], w=12.6, size=44).move_to([0, 0.6, 0])
        self.say(f"자석에 붙는 물체는 {r('철')}로 만들어졌어요",
                 "자석에 붙는 물체는 철로 만들어졌어요. 종이, 플라스틱, 나무, 고무, 알루미늄 등으로 만들어진 물체는 자석에 붙지 않아요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
