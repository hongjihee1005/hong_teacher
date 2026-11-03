"""「과학 원리 돋보기」 6학년 9화 — 같은 시간 동안 이동한 거리로 빠르기 비교 (6-1 2단원 물체의 운동 3차시, 화 코드 6-1-2-c)

바탕: grade6/science/sem1/u2-3.html(원본 _build_tb/src/u2-3.html) — 도입(두더지와 개미가 동시에 땅을 파기 시작해 동시에 나옴: 걸린 시간이 같고
두더지가 더 긴 거리), 실험(출발선·줄자를 출발선과 수직·삼각대·태엽 감기·동시에 출발 → 5초 뒤 사진, 앞부분까지 거리를 반올림해 일의 자리:
빨간색 135 cm, 파란색 122 cm — 앱 스크립트 DR 134.7·DB 122.2), 1초 동안 이동할 수 있는 거리(거북 0.3 m·사람 10 m·루지 39 m·송골매 108 m·
드론 133 m), 형성 평가(출발선이 다르거나 동시에 출발하지 않으면 맨 앞이 가장 빠르다고 할 수 없음, 1시간 동안 ㈎ 기차 150 km·㈏ 기차 120 km),
'무궁화꽃이 피었습니다' 놀이, 한눈에 쏙(길수록).
최종: ./make_final.sh s6ep09
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Line, VMobject, MoveAlongPath,
                   SurroundingRectangle, GrowFromEdge, ValueTracker, always_redraw, Rectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def sv(x, y):
    """앱 그림(640×260) 좌표 → 화면"""
    return np.array([(x - 320) / 55.0, 0.3 + (130 - y) / 55.0, 0])


class S6Ep09(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 9
    EP_TITLE = "같은 시간 동안 이동한 거리로 빠르기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.more()
        self.misc()
        self.life()
        self.summary()
        self.closing(f"같은 시간 동안 이동한 물체는\n이동 거리가 {o('길수록')} 더 빨라요",
                     next_preview="6학년 10화 · 같은 거리를 이동한 시간으로 빠르기 비교")
        self.wait(0.5)

    # ── 궁금해요: 두더지와 개미 ──
    def intro(self):
        self.section("궁금해요")
        sky = Rectangle(width=11.8, height=1.15, fill_color="#CFE9F7", fill_opacity=1, stroke_width=0).move_to(sv(320, 31))
        soil = Rectangle(width=11.8, height=3.6, fill_color="#A8774A", fill_opacity=1, stroke_width=0).move_to(sv(320, 161))
        grass = Rectangle(width=11.8, height=0.14, fill_color="#6FB45A", fill_opacity=1, stroke_width=0).move_to(sv(320, 62))
        MP = [sv(*p) for p in [[70, 62], [70, 190], [530, 190], [530, 62]]]
        AP = [sv(*p) for p in [[200, 62], [200, 110], [330, 110], [330, 62]]]
        mp = VMobject(stroke_color="#5C3D22", stroke_width=26).set_points_as_corners(MP)
        ap = VMobject(stroke_color="#5C3D22", stroke_width=10).set_points_as_corners(AP)
        mole = VGroup(K.E(0.6, 0.4, "#4B4B55", 0, 0, sw=2), K.C(0.09, "#F3A6B5", 0.27, 0.0, sw=1))
        ant = VGroup(*[K.C(0.06, "#222222", dx, 0, sw=0) for dx in (-0.1, 0, 0.1)])
        mole.move_to(MP[0])
        ant.move_to(AP[0])
        tm = T("두더지", 30).next_to(MP[-1], UP, buff=0.55)
        ta = T("개미", 30).next_to(AP[-1], UP, buff=0.55)
        self.say("두더지와 개미가 동시에 땅을 파기 시작해요",
                 "두더지와 개미가 동시에 땅을 파기 시작해요. 그리고 동시에 땅 위로 나왔어요.")
        self.play(FadeIn(VGroup(sky, soil, grass)), FadeIn(mole), FadeIn(ant), FadeIn(tm), FadeIn(ta), run_time=0.8)
        self.play(Create(mp), MoveAlongPath(mole, mp.copy()), Create(ap), MoveAlongPath(ant, ap.copy()),
                  run_time=4.0, rate_func=lambda t: t)
        self.bring_to_front(mole, ant)
        self.settle()
        self.say(f"걸린 시간과 판 거리 중 {o('같은 것')}은?",
                 "두더지와 개미가 땅을 파는 데 걸린 시간과 땅을 판 거리 중 무엇이 같을까요?")
        self.settle()
        self.pause_screen(4, "무엇이 같고, 누가 더 빠를까요?")
        self.say(f"{o('걸린 시간')}이 같고, 더 긴 거리를 판 {g('두더지')}가 빨라요",
                 "동시에 출발해 동시에 나왔으니 걸린 시간이 같아요. 같은 시간 동안 두더지가 더 긴 거리를 팠으니 두더지가 더 빨라요.")
        self.play(Indicate(mp, color=ORANGE, scale_factor=1.02), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 실험해요 ──
    def experiment(self):
        self.section("실험해요")
        steps = ["① 색 테이프로 출발선 표시", "② 줄자를 출발선과 수직으로 펼치기", "③ 스마트 기기를 삼각대에 고정",
                 "④ 태엽 감기", "⑤ 동시에 출발! → 5초 뒤 사진"]
        card = K.text_card(steps, w=8.0, size=34).move_to([0, 0.4, 0])
        self.say(f"{o('같은 시간(5초)')} 동안 태엽 자동차가 이동한 거리를 비교해요",
                 "같은 시간, 5초 동안 두 태엽 자동차가 이동한 거리를 비교해요. 출발선을 표시하고 줄자를 출발선과 수직으로 펼친 뒤, 스마트 기기를 삼각대에 고정해요.")
        self.play(FadeIn(card), run_time=0.7)
        self.settle()
        self.say("태엽을 감고 동시에 출발! 5초 뒤 사진을 찍어요",
                 "태엽을 알맞게 감고 두 자동차를 동시에 출발시켜요. 5초 뒤에 사진을 찍어요. 줄자에 손을 다치지 않게 조심해요.")
        self.settle()
        self.play(FadeOut(card), run_time=0.4)
        x0, pc = -5.6, 0.075
        tp = K.tape(x0, 0.25, 150, pc, every=20, minor=10)
        sl = Line([x0, -1.35, 0], [x0, 1.9, 0], stroke_color="#2E86C1", stroke_width=8)
        slt = T("출발선", 26, "#1C6FA8").next_to(sl, UP, buff=0.1)
        cr = K.car_top(K.CAR_RED, 1.0).shift([x0, 1.15, 0])
        cb = K.car_top(K.CAR_BLUE, 1.0).shift([x0, -0.65, 0])
        cm = T("cm", 22).move_to([x0 + 150 * pc + 0.17, -0.2, 0])
        tt = ValueTracker(0.0)
        clock = always_redraw(lambda: K.label(f"{tt.get_value():.1f}초", INK, 34).move_to([4.6, 2.55, 0]))
        self.say(f"출발! {o('5초')} 동안 달려요", "출발! 두 자동차가 5초 동안 달려요.")
        self.play(FadeIn(tp), FadeIn(sl), FadeIn(slt), FadeIn(cm), FadeIn(cr), FadeIn(cb), FadeIn(clock), run_time=0.8)
        self.play(cr.animate.shift(RIGHT * 134.7 * pc), cb.animate.shift(RIGHT * 122.2 * pc), tt.animate.set_value(5.0),
                  run_time=5.0, rate_func=lambda t: t)
        flash = Rectangle(width=16, height=9, fill_color=PAPER, fill_opacity=0.8, stroke_width=0)
        self.play(FadeIn(flash), run_time=0.15)
        self.play(FadeOut(flash), run_time=0.4)
        self.settle()
        self.pause_screen(5, "어느 자동차가 더 빠를까요?")
        self.remove(clock)
        clear_stage(self)
        zr = K.zoom_tape(134.7, K.CAR_RED)
        zb = K.zoom_tape(122.2, K.CAR_BLUE)
        VGroup(zr, zb).arrange(RIGHT, buff=0.5).move_to([0, 0.55, 0])
        lr = M(f"빨간색 자동차 {o('135 cm')}", 32).next_to(zr, DOWN, buff=0.3)
        lb = M(f"파란색 자동차 {o('122 cm')}", 32).next_to(zb, DOWN, buff=0.3)
        hint = T("자동차 앞부분까지의 거리를 읽어 반올림해 일의 자리까지", 30, SOFT).move_to([0.9, 2.55, 0])
        self.say(f"사진을 확대해 {o('앞부분')}까지의 이동 거리를 읽어요",
                 "사진을 확대해 태엽 자동차 앞부분까지의 이동 거리를 읽어요. 반올림해 일의 자리까지 써요.")
        self.play(FadeIn(hint), FadeIn(zr), FadeIn(zb), run_time=0.8)
        self.play(Indicate(zr.front, color=RED), Indicate(zb.front, color=RED), run_time=0.8)
        self.settle()
        self.say(f"빨간색은 {o('135 cm')}, 파란색은 {o('122 cm')} 이동했어요",
                 "빨간색 자동차는 5초 동안 135 센티미터, 파란색 자동차는 122 센티미터 이동했어요.")
        self.play(FadeIn(lr), FadeIn(lb), run_time=0.6)
        self.settle()
        clear_stage(self)
        tab = K.result_table(["태엽 자동차", "빨간색 자동차", "파란색 자동차"],
                             [["5초 동안 이동 거리(cm)", "135", "122"]], [4.6, 3.2, 3.2], row_h=0.95, size=34).move_to([0, 1.2, 0])
        hl = SurroundingRectangle(tab.cells[1][1], color=ORANGE, buff=0.16, stroke_width=6)
        ans = K.text_card([f"{o('빨간색 자동차')}가 더 빨라요.", f"같은 5초 동안 이동한 거리가 {g('더 길기')} 때문이에요."],
                          size=36).move_to([0, -1.2, 0])
        self.say("두 태엽 자동차 중 더 빠른 것은?", "두 태엽 자동차 중에서 더 빠른 것은 어느 것일까요?")
        self.play(FadeIn(tab), run_time=0.6)
        self.settle()
        self.say(f"같은 시간 동안 {g('더 긴 거리')}를 간 빨간색이 빨라요",
                 "빨간색 자동차가 더 빨라요. 같은 5초 동안 이동한 거리가 더 길기 때문이에요.")
        self.play(Create(hl), FadeIn(ans, shift=UP * 0.2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 더 알아보기: 1초 동안 ──
    def more(self):
        self.section("더 알아보기")
        items = [("거북", 0.3, "#5A8F3D"), ("사람", 10, "#E67E22"), ("루지", 39, "#8E44AD"),
                 ("송골매", 108, "#6B4423"), ("드론", 133, "#2E86C1")]
        names, bs, vals = K.bars(items, 140, x0=-3.9, length=9.0, y0=1.9, dy=0.82, h=0.46, size=32, unit="m")
        head = T("1초 동안 이동할 수 있는 거리", 36).move_to([0, 2.75, 0])
        note = T("공식 경기 기록·세계 기록을 바탕으로 한 값이라 평소 빠르기와는 달라요", 24, SOFT).move_to([0, -2.25, 0])
        self.say(f"{o('1초')} 동안 물체가 이동할 수 있는 거리를 비교해요",
                 "같은 1초 동안 여러 물체가 이동할 수 있는 거리를 비교해 봐요.")
        self.play(FadeIn(head), FadeIn(names), FadeIn(note), run_time=0.6)
        self.play(*[GrowFromEdge(b, LEFT) for b in bs], run_time=2.0, rate_func=lambda t: t)
        self.play(FadeIn(vals), run_time=0.5)
        self.settle()
        self.say(f"가장 빠른 것은 {o('드론')}, 가장 느린 것은 {g('거북')}",
                 "1초 동안 133 미터를 이동한 드론이 가장 빠르고, 0.3 미터를 이동한 거북이 가장 느려요.")
        self.play(Indicate(VGroup(names[4], bs[4], vals[4]), color=ORANGE, scale_factor=1.05),
                  Indicate(VGroup(names[0], vals[0]), color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        q = T("맨 앞에 있는 자동차가 가장 빠를까요?", 40).move_to([0.9, 2.5, 0])
        la = Line([-5.6, 1.6, 0], [-5.6, 0.6, 0], stroke_color="#2E86C1", stroke_width=7)
        lb = Line([-2.4, 0.0, 0], [-2.4, -1.0, 0], stroke_color="#2E86C1", stroke_width=7)
        ta = T("출발선", 22, "#1C6FA8").next_to(la, LEFT, buff=0.1)
        tb = T("출발선", 22, "#1C6FA8").next_to(lb, LEFT, buff=0.1)
        ca = K.car_top(K.CAR_RED).shift([-5.6, 1.1, 0])
        cb = K.car_top(K.CAR_BLUE).shift([-2.4, -0.5, 0])
        self.say("출발선이 다르면 어떨까요?",
                 "출발선이 다르거나 동시에 출발하지 않은 자동차들이 있어요. 맨 앞에 있는 자동차가 가장 빠를까요?")
        self.play(FadeIn(q), FadeIn(VGroup(la, lb, ta, tb, ca, cb)), run_time=0.7)
        self.play(ca.animate.shift(RIGHT * 4.6), cb.animate.shift(RIGHT * 2.8), run_time=2.0, rate_func=lambda t: t)
        aa = K.arrow_lr(-5.6, -1.0, 1.75, RED, 6)
        ab = K.arrow_lr(-2.4, 0.4, -1.3, RED, 6)
        self.play(Create(aa), Create(ab), run_time=0.6)
        self.settle()
        card = K.text_card([f"출발선이 다르거나 동시에 출발하지 않았다면", f"맨 앞에 있다고 {r('가장 빠르다고 할 수 없어요')}"],
                           size=34)
        if card.width > 5.6:
            card.scale_to_fit_width(5.6)
        card.move_to([3.9, -0.3, 0])
        self.say(f"맨 앞에 있다고 {r('가장 빠른 것은 아니에요')}",
                 "아니요. 출발선이 다르거나 동시에 출발하지 않았다면 맨 앞에 있다고 가장 빠르다고 할 수 없어요. 그래서 실험에서 출발선을 정하고 동시에 출발했어요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 ──
    def life(self):
        self.section("생활 속에서")
        c1 = K.text_card(["'무궁화꽃이 피었습니다.' 놀이에서", "술래에게 가장 먼저 도착하려면?"], w=10.0, size=36).move_to([0.7, 1.75, 0])
        a1 = M(f"술래가 외치는 {o('같은 시간')} 동안 {g('가장 긴 거리')}를 이동해요", 36).move_to([0, 0.55, 0])
        self.say("'무궁화꽃이 피었습니다' 놀이에서 먼저 도착하려면?",
                 "무궁화꽃이 피었습니다 놀이에서 술래에게 가장 먼저 도착하려면 어떻게 해야 할까요?")
        self.play(FadeIn(c1), run_time=0.6)
        self.settle()
        self.say(f"같은 시간 동안 {g('가장 긴 거리')}를 이동해야 해요",
                 "술래가 외치는 같은 시간 동안 가장 긴 거리를 이동해야 해요.")
        self.play(FadeIn(a1, shift=UP * 0.2), run_time=0.6)
        self.settle()
        tr1 = VGroup(K.train(2.0), M(f"㉮ 기차  1시간 동안 {o('150 km')}", 32))
        tr2 = VGroup(K.train(2.0), M(f"㉯ 기차  1시간 동안 {o('120 km')}", 32))
        for t_ in (tr1, tr2):
            t_.arrange(RIGHT, buff=0.5)
        VGroup(tr1, tr2).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([-0.8, -1.35, 0])
        self.say("1시간 동안 ㉮ 기차는 150 km, ㉯ 기차는 120 km",
                 "1시간 동안 가 기차는 150 킬로미터, 나 기차는 120 킬로미터를 이동했어요. 어느 기차가 더 빠를까요?")
        self.play(FadeOut(a1), FadeIn(tr1), FadeIn(tr2), run_time=0.7)
        self.settle()
        mk = K.ox_mark(True, 0.32).next_to(tr1, RIGHT, buff=0.4)
        self.say(f"같은 시간 동안 더 멀리 간 {o('㉮ 기차')}가 더 빨라요",
                 "가 기차가 나 기차보다 더 빨라요. 같은 시간 동안 이동한 거리가 더 길기 때문이에요.")
        self.play(Create(mk), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        x0, pc = -4.5, 0.06
        sl = Line([x0, 0.3, 0], [x0, 2.5, 0], stroke_color="#2E86C1", stroke_width=7)
        cr = K.car_top(K.CAR_RED).shift([x0, 1.95, 0])
        cb = K.car_top(K.CAR_BLUE).shift([x0, 0.85, 0])
        card = K.text_card([f"같은 시간 동안 이동한 물체는", f"이동 거리가 {o('길수록')} 더 빠릅니다."], w=10.6, size=40).move_to([0, -1.45, 0])
        self.say(f"같은 시간 동안 이동한 물체는 이동 거리가 {o('길수록')} 빨라요")
        self.play(FadeIn(sl), FadeIn(cr), FadeIn(cb), run_time=0.5)
        self.play(cr.animate.shift(RIGHT * 135 * pc), cb.animate.shift(RIGHT * 122 * pc), run_time=1.6, rate_func=lambda t: t)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
