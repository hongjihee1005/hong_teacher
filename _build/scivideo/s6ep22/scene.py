"""「과학 원리 돋보기」 6학년 22화 — 낮과 밤이 생기는 까닭 (6-1 4단원 지구의 운동 5차시, 화 코드 6-1-4-c)

바탕: grade6/science/sem1/u4-3.html(원본 _build_tb/src/u4-3.html) — 도입(통화하는 두 친구: 한 곳은 낮, 한 곳은 밤,
낮·밤의 뜻 잇기), 모형실험 준비(지구본·소형 카메라(관측자)·갓 없는 전등(중심 높이를 지구본 중심과 같게)·자 50 cm·스마트 기기, 안전),
가상 실험(어둡게 한 교실, 지구본을 서→동으로 30°씩 한 바퀴: 전등을 향하면 화면이 밝음 = 낮, 반대편이면 어두움 = 밤),
결과 정리, 낮과 밤 영상(태양을 향하면 낮 → 저녁 → 밤 → 아침, 하루에 한 번씩 번갈아), 생각이 한눈에(가장 동쪽에서 먼저 낮,
자전하지 않으면 낮인 곳은 계속 낮), 한눈에 쏙, 형성 평가(하루에 두 번 ×, 전등 반대편 카메라는 밤).
최종: ./make_final.sh s6ep22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import math
import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker,
                   Rectangle, RoundedRectangle, Line, DashedLine, Dot, Circle, always_redraw, linear, interpolate_color,
                   ManimColor)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def nrm(a):
    return (a + 180) % 360 - 180


def cam_screen(phi_deg, w=5.0, h=3.3, title="카메라 화면(남쪽)"):
    """카메라(관측자)가 보는 하늘. phi = 지구본에서 카메라의 각(전등은 180° 쪽)"""
    d = nrm(180 - phi_deg)
    lit = abs(d) < 90
    b = max(0.15, math.cos(d * K.RAD)) if lit else 0.0
    sky_c = interpolate_color(ManimColor("#081222"), ManimColor("#A0D2F5"), b)
    gr_c = interpolate_color(ManimColor("#0A0E0A"), ManimColor("#6E965A"), b)
    g_ = VGroup(Rectangle(width=w, height=h, fill_color=sky_c, fill_opacity=1, stroke_color=INK, stroke_width=4))
    if not lit:
        g_.add(K.bg_stars(-w / 2 + 0.2, w / 2 - 0.2, -h / 2 + 1.0, h / 2 - 0.2, n=18, seed=11, op=0.9))
    else:
        x = -d / 90 * (w / 2 - 0.4)
        y = -h / 2 + 0.9 + 1.4 * b
        g_.add(Circle(radius=0.42, fill_color="#FFF6C0", fill_opacity=0.45, stroke_width=0).move_to([x, y, 0]),
               Circle(radius=0.24, fill_color="#FFFBE0", fill_opacity=1, stroke_width=0).move_to([x, y, 0]))
    g_.add(Rectangle(width=w, height=0.75, fill_color=gr_c, fill_opacity=1, stroke_width=0).move_to([0, -h / 2 + 0.375, 0]))
    col = K.NAVY if b > 0.3 else "#CFD8FF"
    for x, n in ((-w / 2 + 0.4, "동"), (0, "남"), (w / 2 - 0.4, "서")):
        g_.add(T(n, 26, col).move_to([x, -h / 2 + 0.36, 0]))
    word = ("밝아요" if b > 0.3 else "조금 밝아요") if lit else "어두워요"
    tag = T(word, 26, PAPER)
    bx = RoundedRectangle(corner_radius=0.08, width=tag.width + 0.3, height=tag.height + 0.18, fill_color="#000000",
                          fill_opacity=0.5, stroke_width=0).move_to([-w / 2 + 0.25 + (tag.width + 0.3) / 2, h / 2 - 0.32, 0])
    tag.move_to(bx)
    g_.add(bx, tag)
    g_.add(T(title, 24, K.NAVY).move_to([0, h / 2 + 0.3, 0]))
    g_.lit, g_.b = lit, b
    return g_


class S6Ep22(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 22
    EP_TITLE = "낮과 밤이 생기는 까닭"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.prepare()
        self.experiment()
        self.result()
        self.movie()
        self.think()
        self.summary()
        self.check()
        self.closing(f"지구가 {o('자전')}하면서 태양 빛을 받는 곳은 {g('낮')},\n받지 못하는 곳은 {g('밤')}이 돼요",
                     next_preview="6학년 23화 · 지구의 공전")
        self.wait(0.5)

    # ── 궁금해요 ──
    def friend(self, day, x):
        panel = RoundedRectangle(corner_radius=0.25, width=5.0, height=3.4, fill_color="#A9D6F2" if day else K.NIGHT,
                                 fill_opacity=1, stroke_color=INK, stroke_width=4).move_to([x, 0.9, 0])
        gr = Rectangle(width=5.0, height=0.6, fill_color=K.GRASS if day else K.GRASS_N, fill_opacity=1, stroke_width=0
                       ).move_to([x, -0.5, 0])
        g_ = VGroup(panel, gr)
        if day:
            g_.add(K.sun_icon(0.35).move_to([x + 1.4, 1.95, 0]))
        else:
            g_.add(K.bg_stars(x - 2.2, x + 2.2, 0.6, 2.4, n=16, seed=4, op=0.9))
            g_.add(Circle(radius=0.3, fill_color="#FFF3B0", fill_opacity=1, stroke_width=0).move_to([x + 1.4, 1.95, 0]),
                   Circle(radius=0.26, fill_color=K.NIGHT, fill_opacity=1, stroke_width=0).move_to([x + 1.55, 2.02, 0]))
        head = Circle(radius=0.42, fill_color="#FFD9B0", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x - 0.6, 0.4, 0])
        hair = Circle(radius=0.44, fill_color="#5A3A22", fill_opacity=1, stroke_width=0).move_to([x - 0.6, 0.55, 0])
        body = RoundedRectangle(corner_radius=0.2, width=1.2, height=0.9, fill_color="#2F6FD6" if day else "#E2573F",
                                fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([x - 0.6, -0.45, 0])
        phone = RoundedRectangle(corner_radius=0.05, width=0.2, height=0.42, fill_color=INK, fill_opacity=1, stroke_width=0
                                 ).move_to([x - 0.12, 0.42, 0])
        g_.add(body, hair, head, phone)
        return g_

    def intro(self):
        self.section("궁금해요")
        a = self.friend(True, -3.0)
        b_ = self.friend(False, 3.0)
        self.say("두 친구가 통화하고 있어요. 다른 점은 무엇일까요?")
        self.play(FadeIn(a), FadeIn(b_), run_time=0.8)
        self.settle()
        la = K.label("낮", INK, 34).move_to([-3.0, -1.35, 0])
        lb = K.label("밤", INK, 34).move_to([3.0, -1.35, 0])
        self.say(f"한 친구가 있는 곳은 {o('낮')}, 다른 친구가 있는 곳은 {o('밤')}이에요",
                 "한 친구가 있는 곳은 낮이고, 다른 친구가 있는 곳은 밤이에요.")
        self.play(FadeIn(la), FadeIn(lb), run_time=0.6)
        self.settle()
        clear_stage(self)
        rows = VGroup()
        for a_, b2 in (("낮", "태양이 뜰 때부터 질 때까지의 동안"), ("밤", "태양이 진 뒤부터 다음 날 다시 뜨기 전까지의 동안")):
            rows.add(VGroup(K.word_card(a_, 1.6, 1.0, size=38, col=self.accent), K.word_card(b2, 10.0, 1.0, size=32)).arrange(RIGHT, buff=0.4))
        rows.arrange(DOWN, buff=0.4).move_to([0, 0.7, 0])
        self.say("낮과 밤은 태양이 뜨고 지는 것으로 구분해요",
                 "낮은 태양이 뜰 때부터 질 때까지, 밤은 태양이 진 뒤부터 다음 날 다시 뜨기 전까지예요. 낮과 밤은 왜 생길까요?")
        self.play(FadeIn(rows, lag_ratio=0.3), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 실험 준비 ──
    def prepare(self):
        self.section("실험 준비")
        stand = VGroup(Rectangle(width=0.22, height=1.6, fill_color="#666666", fill_opacity=1, stroke_width=0).move_to([-4.6, -0.6, 0]),
                       Rectangle(width=1.2, height=0.16, fill_color="#555555", fill_opacity=1, stroke_width=0).move_to([-4.6, -1.42, 0]))
        lp = K.lamp(1.0, name="").move_to([-4.6, 0.55, 0])
        lp_t = T("갓 없는 전등", 26).move_to([-4.6, 1.55, 0])
        globe = K.earth_side(1.15, 0.6, korea=False, labels=False).move_to([1.6, 0.55, 0])
        base = VGroup(Rectangle(width=0.25, height=0.5, fill_color="#8A6A40", fill_opacity=1, stroke_width=0).move_to([1.6, -0.95, 0]),
                      Rectangle(width=1.2, height=0.14, fill_color="#7A5A30", fill_opacity=1, stroke_width=0).move_to([1.6, -1.25, 0]))
        cam = VGroup(RoundedRectangle(corner_radius=0.05, width=0.36, height=0.26, fill_color="#222222", fill_opacity=1, stroke_width=0),
                     Circle(radius=0.08, fill_color="#555555", fill_opacity=1, stroke_color=PAPER, stroke_width=2).shift(LEFT * 0.2)).move_to([0.75, 1.15, 0])
        cam_t = T("소형 카메라", 24, RED).move_to([0.2, 2.2, 0])
        cam_ln = Line(cam_t.get_bottom(), cam.get_top(), stroke_color=RED, stroke_width=3)
        h_ln = DashedLine([-4.6, 0.55, 0], [1.6, 0.55, 0], stroke_color=RED, stroke_width=3)
        h_t = T("중심 높이를 같게", 24, RED).move_to([-1.5, 0.85, 0])
        ruler = Rectangle(width=6.2, height=0.22, fill_color="#FFE680", fill_opacity=1, stroke_color="#B8860B", stroke_width=2).move_to([-1.5, -1.55, 0])
        r_t = T("50 cm", 24).move_to([-1.5, -1.95, 0])
        dev = VGroup(RoundedRectangle(corner_radius=0.1, width=0.9, height=1.4, fill_color="#222222", fill_opacity=1, stroke_width=0),
                     Rectangle(width=0.72, height=1.1, fill_color="#9FD3F0", fill_opacity=1, stroke_width=0)).move_to([4.6, -0.3, 0])
        dev_t = T("스마트 기기", 24).move_to([4.6, 0.75, 0])
        self.say("지구본·소형 카메라·갓 없는 전등·자·스마트 기기를 준비해요",
                 "지구본, 소형 카메라, 갓 없는 전등, 자, 스마트 기기를 준비해요.")
        self.play(FadeIn(VGroup(stand, lp, lp_t, globe, base, ruler, r_t, dev, dev_t)), run_time=0.8)
        self.play(Create(cam_ln), FadeIn(cam_t), FadeIn(cam), run_time=0.6)
        self.say(f"우리나라에 붙인 카메라는 {o('지구에 있는 관측자')} 역할",
                 "지구본의 우리나라 위치에 붙인 카메라는 지구에 있는 관측자 역할을 해요. 전등은 태양 역할이에요.")
        self.play(Indicate(cam, color=ORANGE, scale_factor=1.5), run_time=0.8)
        self.say(f"전등의 중심 높이를 {o('지구본의 중심 높이')}와 같게 맞춰요",
                 "전등의 중심 높이를 지구본의 중심 높이와 같게 맞춰요. 전등은 뜨거우니 맨손으로 만지지 않아요.")
        self.play(Create(h_ln), FadeIn(h_t), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 실험해요 ──
    def experiment(self):
        self.section("실험해요")
        phi = ValueTracker(0.0)
        dark = Rectangle(width=6.6, height=5.0, fill_color="#1A1A1A", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([-3.25, 0.2, 0])
        lp = K.lamp(0.8, name="").move_to([-5.7, 0.2, 0])
        lp_t = T("전등", 24, K.LAMP_C).move_to([-5.7, -0.7, 0])
        rays = VGroup(*[Line([-5.05, 0.2 + i * 0.18, 0], [-4.3, 0.2 + i * 0.42, 0], stroke_color=K.LAMP_C, stroke_width=3).set_opacity(0.4)
                        for i in range(-2, 3)])
        gc = np.array([-2.2, 0.2, 0])
        globe = always_redraw(lambda: K.globe_top(1.65, phi=phi.get_value() * K.RAD, sun_dir=PI, obs_label="").move_to(gc))
        arr = K.curved_arrow(1.95, -0.2, 1.25, "#9FE3A5", 5, center=gc)
        cap = T("북극 위에서 내려다본 지구본", 24, PAPER).move_to([-3.25, 2.4, 0])
        lit_t = VGroup(T("빛을 받는 쪽", 19, PAPER).move_to(gc + np.array([-1.3, -2.0, 0])),
                       T("빛을 받지 못하는 쪽", 19, PAPER).move_to(gc + np.array([0.95, -2.0, 0])))
        scr = always_redraw(lambda: cam_screen(phi.get_value()).move_to([3.6, 0.15, 0]))
        cnt = always_redraw(lambda: T(f"{int(round(phi.get_value()))} / 360°", 26, K.NAVY).move_to([3.6, -2.05, 0]))
        self.say(f"주변을 어둡게 하고 지구본을 {o('서쪽에서 동쪽으로')} 돌려요",
                 "주변을 어둡게 하고 전등을 켜요. 지구본을 서쪽에서 동쪽으로 천천히 돌리며 카메라 화면을 관찰해요.")
        self.play(FadeIn(dark), FadeIn(lp), FadeIn(lp_t), FadeIn(rays), FadeIn(cap), FadeIn(lit_t), Create(arr), run_time=0.8)
        self.add(globe, scr, cnt)
        self.say(f"카메라가 전등 반대편을 향할 때: {o('어두워요')}",
                 "처음에 카메라는 전등 반대편을 향하고 있어요. 화면이 어두워요.")
        self.settle()
        self.say("30°씩 돌려 한 바퀴 돌려요", "지구본을 조금씩 돌려 한 바퀴 돌려요.")
        for k in range(12):
            self.play(phi.animate.increment_value(30), run_time=0.5, rate_func=linear)
            if k == 5:
                self.say(f"카메라가 전등을 향할 때: {o('밝아요')}", "카메라가 전등을 향하면 전등 빛을 받아 화면이 밝아요.")
                self.settle()
            elif k == 11:
                self.say(f"다시 전등 반대편을 향하면: {o('어두워요')}", "한 바퀴 돌아 다시 전등 반대편을 향하면 화면이 어두워요.")
            else:
                self.wait(0.15)
        self.settle()
        globe.clear_updaters()
        scr.clear_updaters()
        cnt.clear_updaters()
        self.pause_screen(5, "언제 밝고 언제 어두웠나요?")
        clear_stage(self)

    # ── 결과 정리 ──
    def result(self):
        self.section("결과 정리")
        head = ["카메라가 향하는 곳", "전등 빛", "화면", ""]
        rows = [["전등 쪽", "받아요", "밝아요", g("낮")], ["전등 반대편", r("받지 못해요"), "어두워요", o("밤")]]
        tab = K.result_table(head, rows, [4.8, 2.7, 2.3, 1.2], row_h=0.95, size=32).move_to([0.6, 0.9, 0])
        self.say(f"전등 빛을 받으면 밝아서 {g('낮')}, 받지 못하면 어두워서 {o('밤')}",
                 "카메라가 전등을 향하면 빛을 받아 화면이 밝으니 낮이에요. 전등 반대편을 향하면 빛을 받지 못해 어두우니 밤이에요.")
        self.play(FadeIn(tab), run_time=0.7)
        card = K.text_card([f"지구가 {o('자전')}하면서 태양 빛을 받는 지역은 {g('낮')},", f"태양 빛을 받지 못한 지역은 {g('밤')}이 돼요"],
                           w=11.6, size=36).move_to([0, -1.55, 0])
        self.say(f"태양이 지구 주위를 도는 게 {r('아니라')} 지구가 {o('자전')}하기 때문이에요",
                 "실험에서 전등은 그대로 있고 지구본만 돌렸어요. 낮과 밤은 지구가 자전하기 때문에 생겨요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 낮과 밤(영상) ──
    def movie(self):
        self.section("낮과 밤")
        ph = ValueTracker(180.0)
        sun = VGroup(Circle(radius=1.2, fill_color=K.SUN_Y, fill_opacity=0.25, stroke_width=0),
                     Circle(radius=0.9, fill_color=K.SUN_Y, fill_opacity=1, stroke_width=0), T("태양", 30, "#7A4A00")).move_to([-5.65, 0.3, 0])
        gc = np.array([-1.2, 0.3, 0])
        globe = always_redraw(lambda: K.globe_top(1.75, phi=ph.get_value() * K.RAD, sun_dir=PI, obs_label="").move_to(gc))
        kor = always_redraw(lambda: T("우리나라", 22, "#FF4D4D").move_to(
            gc + 2.7 * np.array([math.cos(ph.get_value() * K.RAD), math.sin(ph.get_value() * K.RAD), 0])))
        scr = always_redraw(lambda: cam_screen(ph.get_value(), w=4.2, h=2.8, title="우리나라의 하늘").move_to([4.4, 0.6, 0]))
        word = always_redraw(lambda: T("낮" if abs(nrm(180 - ph.get_value())) < 90 else "밤", 54,
                                       ORANGE if abs(nrm(180 - ph.get_value())) < 90 else "#5B7FD6").move_to([4.4, -1.5, 0]))
        note = T("※ 태양과 지구의 크기, 거리는 실제와 달라요", 20, SOFT).move_to([-3.0, -2.3, 0])
        self.say(f"우리나라가 태양을 향하면 태양 빛을 받아 {o('낮')}",
                 "우리나라가 태양을 향할 때는 태양 빛을 받아 낮이에요.")
        self.play(FadeIn(sun), FadeIn(note), run_time=0.6)
        self.add(globe, kor, scr, word)
        self.settle()
        self.say(f"자전하며 태양 반대편으로 돌아가면 {o('밤')}",
                 "지구가 서쪽에서 동쪽으로 자전하면서 우리나라가 태양 반대편 쪽으로 돌아가면 태양 빛을 받지 못해 밤이 돼요.")
        self.play(ph.animate.set_value(360.0), run_time=5.0, rate_func=linear)
        self.settle()
        self.say(f"다시 태양 쪽으로 오면 {o('낮')} — {g('하루에 한 번씩')} 번갈아요",
                 "계속 자전해서 다시 태양 쪽으로 오면 아침이 지나 다시 낮이 돼요. 지구가 하루에 한 바퀴씩 자전하므로 낮과 밤은 하루에 한 번씩 번갈아 나타나요.")
        self.play(ph.animate.set_value(540.0), run_time=5.0, rate_func=linear)
        self.settle()
        for m in (globe, kor, scr, word):
            m.clear_updaters()
        clear_stage(self)

    # ── 생각해요 ──
    def think(self):
        self.section("생각해요")
        q1 = K.text_card(["우리나라에서 가장 먼저 낮이 시작되는 곳은?"], w=12.0, size=36).move_to([0, 2.0, 0])
        a1 = M(f"→ 우리나라에서 {g('가장 동쪽')}에 있는 곳 (태양은 동쪽에서 떠요)", 34).move_to([0, 0.95, 0])
        q2 = K.text_card(["만약 지구가 자전하지 않는다면?"], w=12.0, size=36).move_to([0, -0.2, 0])
        a2 = M(f"→ 낮인 곳은 {o('계속 낮')}, 밤인 곳은 {o('계속 밤')}", 34).move_to([0, -1.25, 0])
        self.say("우리나라에서 가장 먼저 낮이 시작되는 곳은?")
        self.play(FadeIn(q1), run_time=0.5)
        self.settle()
        self.say(f"{g('가장 동쪽')}에 있는 곳 — 태양은 동쪽에서 떠요",
                 "우리나라에서 가장 동쪽에 있는 곳이에요. 지구가 서쪽에서 동쪽으로 자전해서 태양은 동쪽에서 떠요.")
        self.play(FadeIn(a1), run_time=0.5)
        self.say("만약 지구가 자전하지 않는다면?", "만약 지구가 자전하지 않는다면 낮과 밤은 어떻게 될까요?")
        self.play(FadeIn(q2), run_time=0.5)
        self.settle()
        self.say(f"낮과 밤이 {r('번갈아 나타나지 않아요')}",
                 "낮과 밤이 번갈아 나타나지 않아요. 낮이었던 곳은 계속 낮, 밤이었던 곳은 계속 밤이에요.")
        self.play(FadeIn(a2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"우리나라가 태양을 향하면 {o('낮')}이 되고,", f"태양 반대편을 향하면 {o('밤')}이 됩니다."], w=12.0, size=44).move_to([0, 0.6, 0])
        self.say(f"태양을 향하면 {o('낮')}, 반대편을 향하면 {o('밤')}",
                 "우리나라가 태양을 향하면 낮이 되고, 태양 반대편을 향하면 밤이 됩니다.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인해요 ──
    def check(self):
        self.section("확인해요")
        lines = ["친구 1: 지구에서 태양 빛을 받는 지역은 낮이야.", "친구 2: 밤은 태양이 진 뒤부터 다음 날 다시 뜨기 전까지의 동안이야.",
                 "친구 3: 낮과 밤은 하루에 두 번씩 번갈아 나타나.", "친구 4: 낮과 밤이 생기는 것은 지구의 자전과 관련이 있어."]
        cards = VGroup(*[K.word_card(t_, 11.6, 0.8, size=28) for t_ in lines]).arrange(DOWN, buff=0.22).move_to([0.6, 0.5, 0])
        self.say("옳지 않게 말한 친구는 누구일까요?", "지구의 낮과 밤에 관해 옳지 않게 말한 친구는 누구일까요?")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.8)
        self.pause_screen(4, "옳지 않게 말한 친구는?")
        self.say(f"친구 3 — 지구는 하루에 한 바퀴 자전하니 {g('하루에 한 번씩')}",
                 "친구 3이에요. 지구는 하루에 한 바퀴씩 자전하므로 낮과 밤은 하루에 한 번씩 번갈아 나타나요.")
        self.play(cards[2][0].animate.set_stroke(RED, 6), FadeIn(K.ox_mark(False, 0.22).next_to(cards[2], LEFT, buff=0.1)), run_time=0.7)
        self.settle()
        clear_stage(self)
