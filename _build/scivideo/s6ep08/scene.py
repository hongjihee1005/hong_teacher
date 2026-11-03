"""「과학 원리 돋보기」 6학년 8화 — 물체의 운동을 나타내기 (6-1 2단원 물체의 운동 2차시, 화 코드 6-1-2-b)

바탕: grade6/science/sem1/u2-2.html(원본 _build_tb/src/u2-2.html) — 도입(미끄럼틀을 타는 곰: 위 → 아래), 정원판에서 분수를 기준으로
꽃의 위치 말하기(수선화꽃 왼쪽 3칸, 제비꽃 위쪽 2칸, 유채꽃 오른쪽 2칸·위쪽 3칸, 진달래꽃 오른쪽 1칸·아래쪽 1칸), 꿀벌 규칙(상하좌우 한 칸씩,
한 칸 1초) — 진달래꽃 → 유채꽃 5초, 정리(기차 1시간 출발역 → 도착역, 승강기 15초 1층 → 5층, 코딩 로봇 10초 입구 → 출구),
꼭 들어가야 하는 것(걸린 시간·처음 위치·나중 위치), 형성 평가(비둘기·자전거, 버스 5분 동안 ㈎ → ㈏ 정류장), 한눈에 쏙(위치),
나의 운동 표현(앱 입력 예: 10분·집·학교).
최종: ./make_final.sh s6ep08
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Line, DashedLine, VMobject,
                   SurroundingRectangle, Transform)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="{BLUE}">{s}</span>'


class S6Ep08(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 8
    EP_TITLE = "물체의 운동을 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.garden()
        self.bee_move()
        self.examples()
        self.misc()
        self.summary()
        self.closing(f"물체의 운동은 {o('걸린 시간')}과\n{g('처음 위치')}·{bl('나중 위치')}로 나타내요",
                     next_preview="6학년 9화 · 같은 시간 동안 이동한 거리로 빠르기 비교")
        self.wait(0.5)

    # ── 궁금해요: 미끄럼틀 곰 ──
    def intro(self):
        self.section("궁금해요")
        sl = K.slide(1.5).move_to([-0.6, 0.15, 0])
        top = sl[0].get_top()
        b0 = K.bear(0.75, op=0.35).next_to(sl[7], UP, buff=0.02)
        b1 = K.bear(0.75).move_to([2.6, -1.35, 0])
        t0 = T("처음", 30, SOFT).next_to(b0, RIGHT, buff=0.25)
        t1 = T("얼마 뒤", 30, INK).next_to(b1, RIGHT, buff=0.25)
        ground = K.R(13.0, 0.2, "#9FD07F", 0, -2.05, stroke=None)
        self.say("미끄럼틀을 타는 곰의 위치는 어떻게 바뀌었나요?",
                 "미끄럼틀을 타는 곰이에요. 흐린 곰은 처음 모습, 진한 곰은 얼마 뒤 모습이에요. 곰의 위치는 어떻게 바뀌었나요?")
        self.play(FadeIn(ground), FadeIn(sl), FadeIn(b0), FadeIn(t0), run_time=0.8)
        self.play(FadeIn(b1, shift=DOWN * 0.3 + RIGHT * 0.3), FadeIn(t1), run_time=0.8)
        self.settle()
        self.say(f"{g('미끄럼틀 위')}에서 {bl('미끄럼틀 아래')}로 바뀌었어요",
                 "곰의 위치는 미끄럼틀 위에서 미끄럼틀 아래로 바뀌었어요. 이런 위치 변화를 시간에 따라 어떻게 표현할까요?")
        self.play(Indicate(b1, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 활동해요: 꽃의 위치 ──
    def garden(self):
        self.section("활동해요")
        G = K.Garden(center=(-3.6, 0.3), cell=0.66, size=22)
        self.G = G
        rows = [("수선화꽃", "왼쪽으로 3칸"), ("제비꽃", "위쪽으로 2칸"), ("유채꽃", "오른쪽으로 2칸, 위쪽으로 3칸"),
                ("진달래꽃", "오른쪽으로 1칸, 아래쪽으로 1칸")]
        cards = VGroup()
        for n, d in rows:
            cards.add(K.text_card([f"{o(n)}  {d}"], w=6.6, size=30))
        cards.arrange(DOWN, buff=0.18, aligned_edge=LEFT).move_to([3.3, 0.2, 0])
        head = T("분수를 기준으로", 34, INK).next_to(cards, UP, buff=0.2)
        self.say("분수를 기준으로 꽃의 위치를 말해 봐요",
                 "정원판에 꽃 붙임딱지를 붙였어요. 가운데 분수를 기준으로 꽃의 위치를 말해 봐요.")
        self.play(FadeIn(G.group), FadeIn(head), run_time=0.9)
        self.settle()
        self.say(f"분수에서 {o('어느 쪽으로')} {o('몇 칸')} 떨어져 있나요?",
                 "수선화꽃은 왼쪽으로 3칸, 제비꽃은 위쪽으로 2칸, 유채꽃은 오른쪽으로 2칸, 위쪽으로 3칸, 진달래꽃은 오른쪽으로 1칸, 아래쪽으로 1칸 떨어져 있어요.")
        for (n, _), c in zip(rows, cards):
            self.play(FadeIn(c, shift=LEFT * 0.2), Indicate(G.flowers[n], color=ORANGE, scale_factor=1.3), run_time=0.8)
        self.settle()
        self.say(f"위치는 기준에서 {o('방향')}과 {o('떨어진 거리')}로 나타내요",
                 "꽃의 위치는 기준인 분수로부터 꽃이 있는 방향과 떨어진 칸 수로 나타낼 수 있어요.")
        self.settle()
        self.play(FadeOut(cards), FadeOut(head), run_time=0.5)

    # ── 활동해요: 꿀벌 ──
    def bee_move(self):
        G = self.G
        rule = K.text_card(["규칙", "· 오른쪽, 왼쪽, 위쪽, 아래쪽으로 한 칸씩", f"· 한 칸 이동하는 데 {o('1초')}"],
                           w=6.6, size=30).move_to([3.2, 1.6, 0])
        bee = K.fit(K.bee(), 0.62, 0.5)
        start = G.pt(1, -1)
        bee.move_to(start + UP * 0.12)
        sw = K.stopwatch(0.62).move_to([2.0, -1.0, 0])
        num = T("0초", 34, INK).scale_to_fit_height(sw.disp.height * 0.62).move_to(sw.disp)
        cap = T("걸린 시간", 28, INK).next_to(sw, RIGHT, buff=0.3)
        self.say(f"꿀벌을 {g('진달래꽃')}에서 {bl('유채꽃')}까지 움직여요",
                 "이번에는 진달래꽃 위의 꿀벌을 유채꽃까지 움직여요. 꿀벌은 한 칸씩 움직이고, 한 칸 이동하는 데 1초가 걸려요.")
        self.play(FadeIn(rule), FadeIn(bee, scale=0.6), FadeIn(sw), FadeIn(num), FadeIn(cap), run_time=0.9)
        self.settle()
        self.pause_screen(5, "가장 짧은 길로 가면 몇 초 걸릴까요?")
        path = [(1, -1), (2, -1), (2, 0), (2, 1), (2, 2), (2, 3)]
        self.say("오른쪽으로 1칸, 위쪽으로 4칸 — 한 칸에 1초씩",
                 "오른쪽으로 한 칸, 위쪽으로 네 칸 움직여요. 한 칸에 1초씩 걸려요.")
        trail = VGroup()
        for k in range(1, len(path)):
            a, b_ = G.pt(*path[k - 1]), G.pt(*path[k])
            seg = DashedLine(a, b_, stroke_color=RED, stroke_width=5, dash_length=0.1)
            new = T(f"{k}초", 34, INK).scale_to_fit_height(sw.disp.height * 0.62).move_to(sw.disp)
            self.play(bee.animate.move_to(b_ + UP * 0.12), Create(seg), Transform(num, new), run_time=0.75)
            trail.add(seg)
        self.settle()
        sbox = K.text_card([f"꿀벌은 {o('5초')} 동안", f"{g('진달래꽃')}에서 {bl('유채꽃')}으로 이동했습니다."],
                           size=38, stroke=self.accent).move_to([3.2, 0.6, 0])
        if sbox.width > 6.8:
            sbox.scale_to_fit_width(6.8).move_to([3.3, 0.6, 0])
        tags = VGroup(K.label("걸린 시간", ORANGE, 26), K.label("처음 위치", GREEN, 26), K.label("나중 위치", BLUE, 26)
                      ).arrange(RIGHT, buff=0.25).next_to(sbox, DOWN, buff=0.3)
        self.say(f"꿀벌은 {o('5초')} 동안 {g('진달래꽃')}에서 {bl('유채꽃')}으로 이동했어요",
                 "꿀벌은 5초 동안 진달래꽃에서 유채꽃으로 이동했습니다. 걸린 시간, 처음 위치, 나중 위치가 모두 들어갔어요.")
        self.play(FadeOut(rule), FadeOut(sw), FadeOut(num), FadeOut(cap), run_time=0.4)
        self.play(FadeIn(sbox, shift=UP * 0.2), run_time=0.7)
        self.play(FadeIn(tags, lag_ratio=0.3), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 정리해요: 운동 표현의 예 ──
    def examples(self):
        self.section("정리해요")
        W, H, Y = 4.15, 3.0, 0.85
        xs = [-4.45, 0, 4.45]
        frames = VGroup(*[K.R(W, H, PAPER, x, Y, rad=0.14, stroke=SOFT, sw=3) for x in xs])
        # 기차
        x0 = xs[0]
        rail = Line([x0 - 1.9, Y - 0.75, 0], [x0 + 1.9, Y - 0.75, 0], stroke_color="#6B7C93", stroke_width=5)
        st1 = VGroup(K.R(1.0, 0.55, PAPER, x0 - 1.45, Y + 0.85, stroke=SOFT, sw=2), T("출발역", 22).move_to([x0 - 1.45, Y + 0.85, 0]))
        st2 = VGroup(K.R(1.0, 0.55, PAPER, x0 + 1.45, Y + 0.85, stroke=SOFT, sw=2), T("도착역", 22).move_to([x0 + 1.45, Y + 0.85, 0]))
        tr0 = K.train(1.2).move_to([x0 - 1.15, Y - 0.38, 0]).set_opacity(0.3)
        tr = K.train(1.2).move_to([x0 - 1.15, Y - 0.38, 0])
        trainG = VGroup(rail, st1, st2, tr0)
        # 승강기
        x1 = xs[1]
        shaft = K.R(1.4, 2.6, "#E9EEF2", x1 - 0.4, Y, stroke="#6B7C93", sw=3)
        floors = VGroup(*[T(f"{k + 1}층", 22).move_to([x1 + 0.75, Y - 1.05 + k * 0.52, 0]) for k in range(5)])
        lf0 = K.lift(1.2).move_to([x1 - 0.4, Y - 1.05, 0]).set_opacity(0.3)
        lf = K.lift(1.2).move_to([x1 - 0.4, Y - 1.05, 0])
        liftG = VGroup(shaft, floors, lf0)
        # 코딩 로봇
        x2 = xs[2]
        grid = VGroup()
        for i in range(7):
            grid.add(Line([x2 - 1.5 + i * 0.5, Y - 1.2, 0], [x2 - 1.5 + i * 0.5, Y + 1.2, 0], stroke_color="#D6E4EC", stroke_width=2))
        for j in range(6):
            grid.add(Line([x2 - 1.5, Y - 1.2 + j * 0.48, 0], [x2 + 1.5, Y - 1.2 + j * 0.48, 0], stroke_color="#D6E4EC", stroke_width=2))
        pA, pB, pC = np.array([x2 - 1.25, Y - 0.95, 0]), np.array([x2 + 1.0, Y - 0.95, 0]), np.array([x2 + 1.0, Y + 0.75, 0])
        rpath = VMobject(stroke_color=RED, stroke_width=4).set_points_as_corners([pA, pB, pC])
        ent = T("입구", 22).move_to(pA + DOWN * 0.0 + LEFT * 0.0).shift(UP * 0.42)
        ext = T("출구", 22).move_to(pC + LEFT * 0.6)
        rb0 = K.robot(0.7).move_to(pA).set_opacity(0.3)
        rb = K.robot(0.7).move_to(pA)
        robotG = VGroup(grid, rpath, ent, ext, rb0)
        caps = [f"기차가 {o('1시간')} 동안 {g('출발역')}에서\n{bl('도착역')}으로 이동했습니다.",
                f"승강기가 {o('15초')} 동안 {g('1층')}에서\n{bl('5층')}으로 이동했습니다.",
                f"코딩 로봇이 {o('10초')} 동안 {g('입구')}에서\n{bl('출구')}로 이동했습니다."]
        capm = VGroup()
        for c, x in zip(caps, xs):
            m = M(c, 26)
            if m.width > W - 0.1:
                m.scale_to_fit_width(W - 0.1)
            capm.add(m.move_to([x, Y - H / 2 - 0.55, 0]))
        self.say("기차·승강기·코딩 로봇의 운동을 나타내 봐요",
                 "여러 물체의 운동을 나타내 봐요. 처음 위치는 흐리게, 나중 위치는 진하게 나타냈어요.")
        self.play(FadeIn(frames), FadeIn(trainG), FadeIn(tr), run_time=0.7)
        self.play(tr.animate.move_to([x0 + 1.15, Y - 0.38, 0]), run_time=1.4)
        self.play(FadeIn(capm[0]), run_time=0.4)
        self.say(f"기차는 {o('1시간')} 동안 출발역에서 도착역으로",
                 "기차가 1시간 동안 출발역에서 도착역으로 이동했습니다.")
        self.play(FadeIn(liftG), FadeIn(lf), run_time=0.5)
        self.play(lf.animate.move_to([x1 - 0.4, Y + 1.03, 0]), run_time=1.4)
        self.play(FadeIn(capm[1]), run_time=0.4)
        self.say(f"승강기는 {o('15초')} 동안 1층에서 5층으로",
                 "승강기가 15초 동안 1층에서 5층으로 이동했습니다.")
        self.play(FadeIn(robotG), FadeIn(rb), run_time=0.5)
        self.play(rb.animate.move_to(pB), run_time=0.9)
        self.play(rb.animate.move_to(pC), run_time=0.7)
        self.play(FadeIn(capm[2]), run_time=0.4)
        self.say(f"코딩 로봇은 {o('10초')} 동안 입구에서 출구로",
                 "코딩 로봇이 10초 동안 입구에서 출구로 이동했습니다.")
        self.settle()
        clear_stage(self)
        q = T("물체의 운동을 표현할 때 꼭 들어가야 하는 것은?", 40).move_to([0, 2.3, 0])
        items = ["걸린 시간", "처음 위치", "나중 위치", "물체의 색깔", "물체의 무게"]
        cards = VGroup(*[K.word_card(t, 2.5, 0.95, size=32) for t in items]).arrange(RIGHT, buff=0.12).move_to([0, 0.8, 0])
        self.say("물체의 운동을 표현할 때 꼭 들어가야 하는 것은?",
                 "물체의 운동을 표현할 때 꼭 들어가야 하는 것을 모두 골라 볼까요?")
        self.play(FadeIn(q), FadeIn(cards, lag_ratio=0.15), run_time=0.9)
        self.settle()
        marks = VGroup(*[K.ox_mark(i < 3, 0.28).next_to(c, DOWN, buff=0.25) for i, c in enumerate(cards)])
        card = K.text_card([f"{o('걸린 시간')} + 위치 변화({g('처음 위치')}와 {bl('나중 위치')})"], size=38).move_to([0, -1.3, 0])
        self.say(f"{o('걸린 시간')}, {g('처음 위치')}, {bl('나중 위치')}가 꼭 들어가요",
                 "걸린 시간, 처음 위치, 나중 위치가 꼭 들어가야 해요. 물체의 색깔이나 무게는 운동을 나타내는 데 필요하지 않아요.")
        self.play(FadeIn(marks, lag_ratio=0.1), run_time=0.7)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        sents = ["비둘기는 1분 동안 이동했다.", "사람은 공원에서 상점으로 이동했다.",
                 "자전거를 타는 사람은 10분 동안 도서관에서 은행으로 이동했다."]
        why = [r("위치가 없어요"), r("시간이 없어요"), g("모두 있어요")]
        rows = VGroup()
        for s_, w_ in zip(sents, why):
            c = K.word_card(s_, 9.4, 0.9, size=30)
            rows.add(c)
        rows.arrange(DOWN, buff=0.35).move_to([-1.6, 0.6, 0])
        notes = VGroup(*[M(w_, 28).next_to(c, RIGHT, buff=0.55) for w_, c in zip(why, rows)])
        marks = VGroup(*[K.ox_mark(i == 2, 0.22).next_to(c, RIGHT, buff=0.12) for i, c in enumerate(rows)])
        for n_, m_ in zip(notes, marks):
            n_.next_to(m_, RIGHT, buff=0.15)
        self.say("물체의 운동을 옳게 표현한 것은 어느 것일까요?",
                 "다음 중에서 물체의 운동을 옳게 표현한 것은 어느 것일까요?")
        self.play(FadeIn(rows, lag_ratio=0.2), run_time=1.0)
        self.settle()
        self.pause_screen(4, "빠진 것이 무엇인지 찾아보세요")
        self.say(f"빠진 것이 있으면 {r('운동을 바르게 나타낼 수 없어요')}",
                 "비둘기 문장에는 처음 위치와 나중 위치가 없고, 사람 문장에는 걸린 시간이 없어요. 자전거를 타는 사람 문장에는 세 가지가 모두 들어 있어요.")
        for k in range(3):
            self.play(FadeIn(marks[k]), FadeIn(notes[k]), run_time=0.5)
        self.settle()
        clear_stage(self)
        # 버스
        road = K.R(13.0, 0.9, "#9AA5AD", 0, -0.45, stroke=None)
        dash = DashedLine([-6.5, -0.45, 0], [6.5, -0.45, 0], stroke_color=PAPER, stroke_width=4, dash_length=0.3)
        poles = VGroup()
        for x, n_ in ((-5.6, "㉮ 정류장"), (5.4, "㉯ 정류장")):
            poles.add(Line([x, 0.0, 0], [x, 1.65, 0], stroke_color="#6B7C93", stroke_width=7))
            lb = K.label(n_, PAPER, 26, fill="#1C6FA8").move_to([x, 1.95, 0])
            poles.add(lb)
        b0 = K.bus(2.4).move_to([-3.6, 0.4, 0]).set_opacity(0.35)
        b1 = K.bus(2.4).move_to([-3.6, 0.4, 0])
        t0 = T("처음", 28, SOFT).move_to([-3.6, 1.35, 0])
        self.say("버스의 운동을 나타내 볼까요?", "그림을 보고 버스의 운동을 나타내 볼까요?")
        self.play(FadeIn(VGroup(road, dash, poles, b0, b1, t0)), run_time=0.8)
        self.play(b1.animate.move_to([3.3, 0.4, 0]), run_time=1.6)
        t1 = T("5분 뒤", 28, INK).move_to([3.3, 1.35, 0])
        self.play(FadeIn(t1), run_time=0.4)
        self.settle()
        sent = K.text_card([f"버스는 {o('5분')} 동안 {g('㉮ 정류장')}에서 {bl('㉯ 정류장')}으로 이동했다."], size=36).move_to([0, -1.75, 0])
        self.say(f"버스는 {o('5분')} 동안 ㉮ 정류장에서 ㉯ 정류장으로 이동했어요",
                 "버스는 5분 동안 가 정류장에서 나 정류장으로 이동했다고 나타내요.")
        self.play(FadeIn(sent, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"물체의 운동은 물체가 이동하는 데 걸린 시간과", f"물체의 {o('위치')} 변화로 표현합니다."],
                           w=12.0, size=40).move_to([0, 1.75, 0])
        self.say(f"걸린 시간과 {o('위치')} 변화로 운동을 표현해요",
                 "물체의 운동은 물체가 이동하는 데 걸린 시간과 물체의 위치 변화로 표현해요. 위치 변화는 처음 위치와 나중 위치로 나타내요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        me = K.text_card([f"저는 {o('10분')} 동안 {g('집')}에서 {bl('학교')}로 이동했습니다."], size=40, stroke=self.accent).move_to([0, -1.2, 0])
        q = T("나의 운동도 표현해 봐요", 32, SOFT).next_to(me, UP, buff=0.25)
        self.say("나의 운동도 이렇게 표현할 수 있어요",
                 "하루 동안 이동했던 장소를 떠올려 나의 운동도 표현해 봐요. 저는 10분 동안 집에서 학교로 이동했습니다.")
        self.play(FadeIn(q), FadeIn(me, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
