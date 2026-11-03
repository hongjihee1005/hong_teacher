"""「과학 원리 돋보기」 6학년 25화 — 태양 고도란? (6-2 1단원 계절의 변화 2차시, 화 코드 6-2-1-a)

바탕: grade6/science/sem2/u1-1.html(원본 _build_tb/src2/u1-1.html) — 도입(태양의 높이를 재려면? 긴 자는 안 되고 각도로 나타내면
각도기로, 하루 동안 태양은 동 → 남 → 서로 움직이며 높이도 달라짐, 태양이 지표면과 이루는 각 = 태양 고도),
설계(쉽고 정확하게·간편하게, 준비물 우드록·자·수수깡·실·구멍 뚫린 각도기·양면테이프, 가위·시침바늘), 만들 순서 네 단계·안전,
재 보기(그림자를 자와 나란하게 → 각도기 중심을 그림자 끝에 → 실을 그림자 끝까지, 앱 가상 측정: 오전 9시 30분 무렵 35°·오후 12시 30분 무렵 52°),
여러 가지 측정기 ㉮㉯㉰, 막대기 길이가 달라져도 태양 고도는 그대로(앱 그림 40°), 형성 평가(OX, 사람의 키로 재는 법), 한눈에 쏙.
최종: ./make_final.sh s6ep25
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, MoveAlongPath,
                   Rectangle, RoundedRectangle, Line, DashedLine, VMobject, Transform, DashedVMobject)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S6Ep25(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 25
    EP_TITLE = "태양 고도란?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.design()
        self.measure()
        self.devices()
        self.stick_len()
        self.check()
        self.summary()
        self.closing(f"태양이 지표면과 이루는 각을 {o('태양 고도')}라고 하고,\n{g('태양 고도 측정기')}로 잴 수 있어요",
                     next_preview="6학년 26화 · 하루 동안 태양 고도·그림자 길이·기온")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        q = K.text_card([f"태양의 {o('높이')}를 재려면 어떤 도구가 필요할까요?"], size=38).move_to([0, 1.8, 0])
        a = K.word_card("태양까지 닿는 아주 긴 자", w=5.4, h=1.0, size=32).move_to([-3.2, 0.0, 0])
        b = K.word_card("각을 재는 각도기", w=5.4, h=1.0, size=32).move_to([3.2, 0.0, 0])
        self.say(f"태양의 {o('높이')}는 무엇으로 잴까요?", "태양의 높이를 측정하려면 어떤 도구가 필요할까요?")
        self.play(FadeIn(q), FadeIn(a), FadeIn(b), run_time=0.8)
        self.settle()
        xa = K.ox_mark(False, 0.35).move_to(a.get_right() + LEFT * 0.5)
        self.say(f"태양은 아주 멀어서 {r('자로 직접 잴 수 없어요')}", "태양은 아주 멀리 있어서 자로 직접 잴 수는 없어요.")
        self.play(FadeIn(xa), run_time=0.5)
        self.settle()
        ob = K.ox_mark(True, 0.35).move_to(b.get_right() + LEFT * 0.5)
        self.say(f"높이를 {g('각도')}로 나타내면 각도기로 잴 수 있어요",
                 "태양의 높이를 각도로 나타내면 각도기로 잴 수 있어요.")
        self.play(FadeIn(ob), Circumscribe(b, color=GREEN), run_time=0.9)
        self.settle()
        clear_stage(self)

        # 하루 동안의 태양
        sky = Rectangle(width=12.6, height=4.0, fill_color=K.SKY, fill_opacity=1, stroke_width=0).move_to([0, 0.75, 0])
        gr = Rectangle(width=12.6, height=0.9, fill_color=K.GRASS, fill_opacity=1, stroke_width=0).move_to([0, -1.7, 0])
        labs = VGroup()
        for x, n in ((-5.2, "동"), (0, "남"), (5.2, "서")):
            t = T(n, 30, INK)
            bx = RoundedRectangle(corner_radius=0.08, width=0.6, height=0.52, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3)
            t.move_to(bx)
            labs.add(VGroup(bx, t).move_to([x, -1.7, 0]))
        cap = K.label("남쪽 하늘을 바라본 모습", INK, 26).move_to([0, 2.4, 0])
        pts = [np.array([-5.2 + 10.4 * u, -1.25 + 3.1 * math.sin(math.pi * u), 0]) for u in np.linspace(0, 1, 41)]
        path = VMobject().set_points_smoothly(pts)
        dpath = DashedVMobject(path.copy().set_stroke("#F0A020", 4), num_dashes=40)
        sun = K.sun_icon(0.3).move_to(pts[0])
        self.say("하루 동안 태양은 어떻게 움직일까요?", "하루 동안 태양의 위치와 높이는 어떻게 달라질까요?")
        self.play(FadeIn(sky), FadeIn(gr), FadeIn(labs), FadeIn(cap), run_time=0.7)
        self.play(FadeIn(sun), run_time=0.3)
        self.play(MoveAlongPath(sun, path), Create(dpath), run_time=4.0)
        self.say(f"동 → 남 → 서로 움직이며 {o('높이도 달라져요')}",
                 "태양은 동쪽에서 남쪽을 지나 서쪽으로 위치가 달라지면서, 높이도 달라져요.")
        self.settle()
        clear_stage(self)

        # 옆에서 본 모습: 태양 고도
        gl = Line([-4.6, -1.3, 0], [3.4, -1.3, 0], stroke_color=INK, stroke_width=6)
        o_ = np.array([2.4, -1.3, 0])
        A = 40
        d = np.array([-math.cos(A * K.RAD), math.sin(A * K.RAD), 0])
        ray = DashedLine(o_, o_ + d * 4.6, stroke_color="#F0A020", stroke_width=5)
        sun = K.sun_icon(0.34).move_to(o_ + d * 5.0)
        arc = K._arc_mark(o_, 180 - A, 180, 1.0, RED, 6)
        ang = M(f"{r('태양 고도')}", 34).move_to(o_ + np.array([-2.9, 0.4, 0]))
        surf = T("지표면", 28, INK).next_to(gl, DOWN, buff=0.15).shift(LEFT * 2)
        side = K.label("옆에서 본 모습", INK, 26).move_to([-2.2, 2.5, 0])
        self.say(f"태양이 {o('지표면')}과 이루는 각을 재요", "태양의 높이는 태양이 지표면과 이루는 각으로 나타낼 수 있어요.")
        self.play(FadeIn(side), Create(gl), FadeIn(surf), run_time=0.6)
        self.play(Create(ray), FadeIn(sun), run_time=0.8)
        self.play(Create(arc), run_time=0.6)
        self.settle()
        self.say(f"이 각을 {o('태양 고도')}라고 해요", "이 각을 태양 고도라고 해요.")
        self.play(FadeIn(ang), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 설계하고 만들기 ──
    def design(self):
        self.section("측정기 설계")
        need = K.text_card([f"태양 고도를 {g('쉽고 정확하게')} 측정하도록",
                            f"태양 고도를 {g('간편하게')} 측정하도록"], size=32).move_to([-3.2, 1.6, 0])
        no = K.text_card([f"{r('크고 무거울수록')} 좋다?  ×", f"{r('색깔이 예쁜 것')}이 가장 중요?  ×"], size=30).move_to([3.4, 1.6, 0])
        self.say("태양 고도 측정기를 설계할 때 생각할 점은?", "태양 고도 측정기를 만들 때 고려해야 할 점은 무엇일까요?")
        self.play(FadeIn(need), run_time=0.6)
        self.say(f"{g('쉽고 정확하게')}, {g('간편하게')} 잴 수 있어야 해요",
                 "태양 고도를 쉽고 정확하게, 간편하게 측정할 수 있게 만들어요. 크기나 예쁜 색은 중요하지 않아요.")
        self.play(FadeIn(no), run_time=0.6)
        self.settle()
        names = ["우드록", "자", "수수깡", "실", "구멍 뚫린 각도기", "양면테이프"]
        cards = VGroup(*[K.word_card(n, w=2.0 if len(n) < 6 else 3.1, h=0.85, size=28) for n in names]).arrange(RIGHT, buff=0.18)
        if cards.width > 12.8:
            cards.scale_to_fit_width(12.8)
        cards.move_to([0, -0.6, 0])
        more = M(f"가위와 시침바늘도 필요해요 · 각도기는 {o('중심에 구멍')}이 뚫린 것", 28).move_to([0, -1.55, 0])
        self.say("막대기 그림자를 이용한 측정기의 준비물이에요",
                 "막대기의 그림자를 이용한 측정기를 만들어요. 우드록, 자, 수수깡, 실, 구멍 뚫린 각도기, 양면테이프가 필요해요.")
        self.play(FadeIn(cards, lag_ratio=0.12), run_time=1.0)
        self.play(FadeIn(more), run_time=0.5)
        self.settle()
        clear_stage(self)
        st = K.steps_row(["① 우드록 한쪽에\n양면테이프로 자 붙이기", "② 수수깡 10 cm를\n자의 ‘0’에 수직으로",
                          "③ 수수깡 끝에\n실 묶기", "④ 실의 다른 끝을\n각도기 구멍에 끼우기"],
                         w=3.0, h=1.6, size=26, buff=0.35, accent=self.accent).move_to([0, 1.5, 0])
        self.say("만드는 순서예요", "우드록에 자를 붙이고, 수수깡을 자의 영 위치에 수직으로 꽂아요. 수수깡 끝에 실을 묶고, 실의 다른 끝을 각도기 구멍에 끼우면 완성이에요.")
        self.play(FadeIn(st.cards[0]), run_time=0.5)
        for i in range(3):
            self.play(Create(st.arrows[i]), FadeIn(st.cards[i + 1]), run_time=0.5)
        gn = K.gnomon(40, 1.1, x0=-1.6, y0=-1.75, rays=False, sun=False, arc=False, board_w=3.6).scale(0.95)
        self.play(FadeIn(gn), run_time=0.6)
        self.settle()
        self.say(f"수수깡이 {o('수직')}이어야 정확히 잴 수 있어요",
                 "수수깡이 수직이어야 태양 고도를 정확히 잴 수 있어요.")
        self.play(Indicate(st.cards[1], color=ORANGE), Indicate(gn.stick, color=ORANGE), run_time=1.0)
        self.settle()
        warn = K.safety_note("가위나 날카로운 물건에 다치지 않게 조심, 준비물을 던지거나 장난치지 않아요", w=12.4, size=27).move_to([0, -0.15, 0])
        self.say(f"가위나 날카로운 물건은 {r('조심해서')} 써요", "가위나 날카로운 물건을 사용할 때 다치지 않도록 조심해요.")
        self.play(FadeOut(gn), FadeIn(warn), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 재 보기 ──
    def measure(self):
        self.section("재 보기")
        gn = K.gnomon(35, 1.5, x0=-3.6, y0=-1.6, string=False, arc=False, board_w=4.4)
        self.play(FadeIn(gn), run_time=0.7)
        steps = K.text_card(["① 그림자가 자와 나란하게 놓기", "② 각도기 중심을 그림자 끝에 맞추기", "③ 실을 그림자 끝까지 당기기"],
                            size=30).move_to([3.6, 1.7, 0])
        self.say(f"먼저 그림자가 {o('자와 나란하게')} 측정기를 놓아요",
                 "측정기를 평평한 곳에 놓고, 막대기 그림자가 자와 나란하도록 돌려요.")
        self.play(FadeIn(steps), Indicate(gn.shadow, color=ORANGE), run_time=0.9)
        self.settle()
        pr = K.protractor(0.95).move_to(gn.tip, aligned_edge=DOWN).shift(DOWN * 0.0)
        pr.shift(gn.tip - pr[-1].get_center())
        sl = Line(gn.top, gn.tip, stroke_color=K.STRING, stroke_width=5)
        self.say(f"각도기 중심을 {o('그림자 끝')}에 맞추고 실을 당겨요",
                 "각도기 중심을 그림자 끝에 맞추고, 실을 그림자 끝까지 당겨요.")
        self.play(FadeIn(pr), run_time=0.6)
        self.play(Create(sl), run_time=0.8)
        self.settle()
        self.pause_screen(5, "실과 그림자가 이루는 각은?")
        arc = K._arc_mark(gn.tip, 145, 180, 0.62, RED, 6)
        res = K.text_card([f"오전 9시 30분 무렵: {o('35°')}", f"오후 12시 30분 무렵: {o('52°')}"], size=32).move_to([3.6, -0.4, 0])
        ex = T("(앱 가상 측정의 예)", 24, SOFT).next_to(res, DOWN, buff=0.12)
        self.say(f"실과 그림자가 이루는 각이 바로 {o('태양 고도')}예요",
                 "실과 그림자가 이루는 각을 읽으면 그것이 태양 고도예요. 오전 아홉 시 삼십 분 무렵에는 삼십오 도였어요.")
        self.play(Create(arc), FadeIn(res), FadeIn(ex), run_time=0.8)
        self.settle()
        self.say(f"낮 12시 30분 무렵에는 {o('52°')}로 더 높아요",
                 "오후 열두 시 삼십 분 무렵에 다시 재니 오십이 도로, 태양 고도가 더 높았어요.")
        self.play(Indicate(res[1][1], color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 여러 가지 측정기 ──
    def devices(self):
        self.section("여러 가지 측정기")
        rows = [("㉮ 수수깡과 실", "그림자 끝에 실을 맞추고, 그림자와 실이 이루는 각을 읽어요"),
                ("㉯ 빨대를 붙인 각도기", "빛이 빨대를 통과해 종이판에 비칠 때까지 기울이고 각을 읽어요"),
                ("㉰ 이쑤시개를 꽂은 종이", "이쑤시개 그림자가 보이지 않도록 종이를 기울이고 각을 읽어요")]
        cards = VGroup()
        for a, b in rows:
            h = K.word_card(a, w=3.9, h=1.0, size=28, col=self.accent)
            t = T(b, 27)
            if t.width > 8.2:
                t.scale_to_fit_width(8.2)
            cards.add(VGroup(h, t.next_to(h, RIGHT, buff=0.35)))
        cards.arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([0, 0.6, 0])
        self.say(f"태양 고도 측정기는 {o('여러 가지')}로 만들 수 있어요",
                 "태양 고도 측정기는 여러 가지예요. 종류에 따라 태양 고도를 여러 가지 방법으로 측정할 수 있어요.")
        self.play(FadeIn(cards, lag_ratio=0.25), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 막대기 길이 ──
    def stick_len(self):
        self.section("생각해 봐요")
        a = K.gnomon(40, 0.9, x0=-5.4, y0=-1.3, rays=False, sun=False, deg_label="?", board_w=2.4)
        b = K.gnomon(40, 1.8, x0=1.1, y0=-1.3, rays=False, sun=False, deg_label="?", board_w=3.6)
        la = T("막대기 10 cm", 28).move_to([-4.4, 1.8, 0])
        lb = T("막대기 20 cm", 28).move_to([2.6, 1.8, 0])
        self.say(f"막대기가 {o('길어지면')} 태양 고도는 어떻게 될까요?", "막대기의 길이가 달라지면 태양 고도는 어떻게 될까요?")
        self.play(FadeIn(a), FadeIn(b), FadeIn(la), FadeIn(lb), run_time=0.8)
        self.pause_screen(5, "태양 고도는 커질까요, 그대로일까요?")
        da = T("40°", 30, RED).move_to(a.deg)
        db = T("40°", 30, RED).move_to(b.deg)
        self.say(f"그림자만 길어질 뿐, 태양 고도는 {g('달라지지 않아요')}",
                 "막대기가 길어지면 그림자도 길어질 뿐, 태양 고도는 달라지지 않아요. 태양 빛은 지구에 거의 평행하게 들어오기 때문이에요.")
        self.play(Transform(a.deg, da), Transform(b.deg, db), Indicate(b.shadow, color=ORANGE), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 확인해 봐요 ──
    def check(self):
        self.section("확인해 봐요")
        q = K.text_card([f"사람의 {o('키')}로 태양 고도를 재려면?"], size=36).move_to([0, 2.3, 0])
        gl = Line([-5.0, -1.4, 0], [3.2, -1.4, 0], stroke_color=INK, stroke_width=5)
        px = 2.2
        body = VGroup(Line([px, -1.4, 0], [px, -0.1, 0], stroke_color="#3B4A7A", stroke_width=14),
                      Line([px, -0.1, 0], [px, 0.75, 0], stroke_color="#E2573F", stroke_width=22),
                      K.Circle(radius=0.22, fill_color="#FFD9B0", fill_opacity=1, stroke_color="#7A4A20", stroke_width=3).move_to([px, 1.0, 0]))
        head = np.array([px, 1.22, 0])
        A = 38
        L = 2.62 / math.tan(A * K.RAD)
        tip = np.array([px - L, -1.4, 0])
        sh = Line([px, -1.38, 0], tip, stroke_color=K.SHADOW, stroke_width=12, stroke_opacity=0.7)
        sl = DashedLine(head, tip, stroke_color=RED, stroke_width=5)
        arc = K._arc_mark(tip, 0, A, 0.7, RED, 6)
        sun = K.sun_icon(0.3).move_to([4.4, 2.0, 0])
        self.say(f"사람의 {o('키')}로도 태양 고도를 잴 수 있어요", "사람의 키를 이용해 태양 고도를 측정하는 방법을 생각해 봐요.")
        self.play(FadeIn(q), Create(gl), FadeIn(body), FadeIn(sun), FadeIn(sh), run_time=0.8)
        self.settle()
        self.say(f"{o('머리끝')}과 {o('그림자 끝')}을 잇고, 그 선과 그림자 사이의 각을 재요",
                 "사람의 머리끝과 그림자 끝을 연결한 뒤, 그 선과 그림자 사이의 각을 각도기로 측정해요.")
        self.play(Create(sl), run_time=0.7)
        self.play(Create(arc), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        gn = K.gnomon(40, 1.3, x0=0.2, y0=-0.9, deg_label="태양 고도", size=30, board_w=3.8)
        card = K.text_card([f"태양이 지표면과 이루는 각을 {o('태양 고도')}라고 합니다."], size=36).move_to([0, -2.0, 0])
        self.say(f"태양이 지표면과 이루는 각, {o('태양 고도')}", "태양이 지표면과 이루는 각을 태양 고도라고 해요.")
        self.play(FadeIn(gn), run_time=0.7)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
