"""「과학 원리 돋보기」 3학년 37화 — 감염병에는 어떻게 걸릴까? (3-2 4단원 감염병과 건강한 생활 4차시, 화 코드 3-2-4-c)

바탕: grade3/science/sem2/u4-3.html — 도입(병원체가 있을 수 있는 곳 4가지), 형광 로션 실험(25명 중 한 명의 손에만 형광 로션,
악수를 되풀이 → 자외선 손전등, 앱의 짝짓기 계산을 그대로 한 번 돌린 결과, 안전 수칙, '형광 로션이 다른 친구 손에 닿는 것 =
병원체가 손을 통해 옮겨 가는 것', '실제 병원체는 맨눈으로 볼 수 없어요'), 감염 경로 카드 5가지(접촉·비말·공기·물·침),
염화 코발트 종이(기침·말하기·팔로 가리고 기침), 생활 습관 땅따먹기(16가지 중 6가지), 한눈에 쏙, 형성 평가.
최종: ./make_final.sh s3ep37
"""
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, Circumscribe,
                   Line, RoundedRectangle, Transform, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag, person, place
import kit_s3u24 as K
from kit_s3u12 import text_card, ox_mark


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def handshake(seed=2, N=25):
    """앱 u4-3의 악수 계산(무작위로 둘씩 짝 → 한 사람이라도 묻어 있으면 둘 다 묻음)을 한 번 돌림"""
    rnd = random.Random(seed)
    glow = [False] * N
    glow[rnd.randrange(N)] = True
    first = glow.index(True)
    hist = [(0, [g_ for g_ in glow], [])]
    k = 0
    while sum(glow) < 15:
        k += 1
        idx = list(range(N))
        rnd.shuffle(idx)
        pairs = [(idx[i], idx[i + 1]) for i in range(0, N - 1, 2)]
        for a, b in pairs:
            if glow[a] or glow[b]:
                glow[a] = glow[b] = True
        hist.append((k, [g_ for g_ in glow], pairs))
    return first, hist


class S3Ep37(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 37
    EP_TITLE = "감염병에는 어떻게 걸릴까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.lotion()
        self.routes()
        self.cobalt()
        self.habits()
        self.summary()
        self.closing(f"병원체는 {o('접촉·비말·공기·물·침')}을 통해 옮겨 가요\n"
                     f"병원체가 {g('눈, 코, 입')}으로 들어오면 감염병에 걸릴 수 있어요",
                     next_preview="3학년 38화 · 감염병 예방 수칙")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        f = K.face("sneeze", 0.9).move_to([-4.6, 1.1, 0])
        m = K.mask(0.9).move_to([-4.6, -1.0, 0])
        self.say("왜 기침 예절을 지켜야 할까요?", "왜 기침 예절을 지켜야 할까요? 병원체는 어디에 있을까요?")
        self.play(FadeIn(f, scale=0.8), FadeIn(m), run_time=0.6)
        items = [("아픈 사람의 침방울", True), ("여러 사람이 만진 문손잡이", True),
                 ("씻지 않은 손", True), ("오염된 음식과 물", True)]
        cards = K.choice_grid(items, cols=1, size=32, w=7.0, h=0.74, dy=0.95, top=1.9, cx=2.0)
        self.play(LaggedStart(*[FadeIn(c, shift=LEFT * 0.2) for c in cards], lag_ratio=0.12), run_time=1.0)
        self.pause_screen(4, "병원체가 있을 수 있는 곳은?")
        self.say(f"병원체는 {o('여러 곳')}에 있을 수 있어요",
                 "네 곳 모두예요. 병원체는 침방울, 손, 물건, 음식과 물 등 여러 곳에 있을 수 있어요.")
        self.play(*K.reveal_marks(cards), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 형광 로션 실험 ──
    def lotion(self):
        self.section("실험해요")
        first, hist = handshake()
        N = 25
        pos = [np.array([-6.0 + (i % 7) * 1.08, 2.0 - (i // 7) * 1.12, 0]) for i in range(N)]
        light = [K.mini_kid(False, False, i == first, 1.0).move_to(p) for i, p in enumerate(pos)]
        kids = VGroup(*light)
        self.say(f"25명 중 한 명(빨간 표시)의 손에만 {o('형광 로션')}을 발랐어요",
                 "스물다섯 명 가운데 한 사람의 손에만 형광 로션을 발랐어요. 형광 로션을 병원체라고 생각해 봐요.")
        self.play(LaggedStart(*[FadeIn(k, scale=0.8) for k in kids], lag_ratio=0.03), run_time=1.3)
        # 표
        tx = 4.6
        head = VGroup(T("악수", 30, SOFT).move_to([tx - 0.9, 2.3, 0]), T("묻은 사람", 30, SOFT).move_to([tx + 0.9, 2.3, 0]))
        rows = VGroup()
        for k, glow, _ in hist:
            y = 1.65 - k * 0.6
            rows.add(VGroup(T(f"{k}회", 32, INK).move_to([tx - 0.9, y, 0]),
                            T(f"{sum(glow)}명", 32, ORANGE).move_to([tx + 0.9, y, 0])))
        line = Line([tx - 1.9, 2.0, 0], [tx + 1.9, 2.0, 0], stroke_color=SOFT, stroke_width=3)
        self.play(FadeIn(head), Create(line), FadeIn(rows[0]), run_time=0.5)
        self.say("친구와 악수를 해요 — 한 번에 둘씩 짝을 지어요", "이제 친구와 악수를 해요. 한 번에 둘씩 짝을 지어 악수해요.")
        k1, g1, pairs = hist[1]
        lines = VGroup(*[Line(pos[a], pos[b], stroke_color=GREEN, stroke_width=3).set_opacity(0.5) for a, b in pairs])
        self.play(Create(lines), run_time=0.8)
        self.play(FadeOut(lines), run_time=0.4)
        self.say(f"형광 로션은 {r('눈에 잘 보이지 않아요')}", "교실이 밝으면 형광 로션이 잘 보이지 않아요. 불을 끄고 자외선 손전등을 비춰 봐요.")
        self.pause_screen(4, "형광 로션이 묻은 사람은 몇 명?")
        dark = RoundedRectangle(corner_radius=0.3, width=8.0, height=4.85, fill_color="#12131A", fill_opacity=1,
                                stroke_width=0).move_to([-2.76, 0.35, 0])
        uv = [K.mini_kid(g1[i], True, False, 1.0).move_to(p) for i, p in enumerate(pos)]
        uvg = VGroup(*uv)
        self.play(FadeIn(dark), FadeOut(kids), FadeIn(uvg), FadeIn(rows[1]), run_time=0.8)
        self.say(f"악수 1번 → {o(str(sum(g1)) + '명')}의 손이 빛나요", f"자외선 손전등을 비추니 형광 로션이 묻은 손이 밝게 빛나요. 악수 한 번에 {sum(g1)}명이 되었어요.")
        cur = uvg
        for k, glow, pairs in hist[2:]:
            lines = VGroup(*[Line(pos[a], pos[b], stroke_color="#7BDCBD", stroke_width=3).set_opacity(0.45) for a, b in pairs])
            new = VGroup(*[K.mini_kid(glow[i], True, False, 1.0).move_to(p) for i, p in enumerate(pos)])
            self.play(Create(lines), run_time=0.45)
            self.play(FadeOut(lines), Transform(cur, new), FadeIn(rows[k]), run_time=0.5)
        kN, gN, _ = hist[-1]
        self.say(f"악수 {kN}번 만에 {r(str(sum(gN)) + '명')}에게 퍼졌어요!",
                 f"악수를 {kN}번 했을 뿐인데 {sum(gN)}명에게 퍼졌어요. 병원체도 이렇게 빠르게 퍼질 수 있어요.")
        self.play(Indicate(rows[-1], color=RED), run_time=0.8)
        note = T("한 번 해 본 결과예요 (할 때마다 조금씩 달라요)", 24, SOFT).move_to([tx, -2.45, 0])
        if note.width > 4.6:
            note.scale_to_fit_width(4.6)
        self.play(FadeIn(note), run_time=0.3)
        self.settle()
        clear_stage(self)

        warn = text_card([f"{r('실험할 때 조심해요')}",
                          "형광 로션이 피부나 눈에 닿지 않게 하고, 입에 대지 않아요",
                          "자외선 손전등 빛을 눈으로 보거나 친구 눈에 비추지 않아요",
                          "피부에 묻으면 비눗물로, 눈에 들어가면 물로 충분히 씻어요"], size=32).move_to([0, 0.5, 0])
        self.say(f"실제 실험에서는 {r('안전')}에 조심해요",
                 "실제 실험에서는 형광 로션이 피부나 눈에 닿지 않게 하고, 자외선 손전등 빛을 눈으로 바라보지 않아요.")
        self.play(FadeIn(warn, scale=0.95), run_time=0.6)
        self.settle()
        self.play(FadeOut(warn), run_time=0.4)
        hd = VGroup(K.hand(1.2).move_to([-5.4, 0.5, 0]), K.germ("ball", K.GERM_G, 0.4).move_to([-5.1, 0.4, 0]))
        fc = K.face("ok", 0.9).move_to([-2.4, 0.6, 0])
        arr = Arrow([-4.6, 0.6, 0], [-3.4, 0.6, 0], buff=0.05, color=RED, stroke_width=6)
        card = text_card([f"형광 로션이 친구 손에 닿는 것", f"= 병원체가 {o('손을 통해')} 옮겨 가는 것",
                          f"씻지 않은 손으로 {r('눈·코·입')}을 만지면", "병원체가 몸속으로 들어올 수 있어요"], size=32)
        card.move_to([3.6, 0.5, 0])
        self.say(f"병원체도 {o('손을 통해')} 다른 사람에게 옮겨 가요",
                 "형광 로션을 병원체라고 하면, 병원체가 손을 통해 다른 사람에게 옮겨 간 거예요. 씻지 않은 손으로 눈, 코, 입을 만지면 병원체가 몸속으로 들어올 수 있어요.")
        self.play(FadeIn(hd), FadeIn(fc), Create(arr), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        tip = T("실제 병원체는 아주 작아서 맨눈으로 볼 수 없어요", 28, SOFT).move_to([0, -2.2, 0])
        self.play(FadeIn(tip), run_time=0.3)
        self.settle()
        clear_stage(self)

    # ── 감염 경로 ──
    def routes(self):
        self.section("감염 경로")
        R5 = [(lambda: K.door_knob(0.5), "접촉", "병원체가 묻은 물건을 만진 손으로 눈·코·입을 만져요"),
              (lambda: K.face("sneeze", 0.4), "비말(침방울)", "가리지 않고 기침·재채기를 하면 침방울이 튀어요"),
              (lambda: K.window(0.45, False), "공기", "환기하지 않으면 공기 중에 뜬 작은 침방울로 옮아요"),
              (lambda: K.cup(0.6, False), "물", "오염된 물을 끓이지 않고 마셔요"),
              (lambda: K.plate(0.55), "침", "한 접시의 음식을 덜지 않고 같이 먹어요")]
        rows = VGroup()
        for i, (fn, nm, d) in enumerate(R5):
            y = 2.1 - i * 0.98
            ic = K.fit(fn(), 0.85, 0.8).move_to([-5.6, y, 0])
            nt = T(nm, 32, ORANGE).move_to([-4.85, y, 0])
            nt.align_to([-4.9, 0, 0], LEFT)
            dt = T(d, 28, INK)
            if dt.width > 7.6:
                dt.scale_to_fit_width(7.6)
            dt.move_to([0, y, 0]).align_to([-1.95, 0, 0], LEFT)
            rows.add(VGroup(ic, nt, dt))
        self.say("병원체가 우리 몸에 들어오는 길은 여러 가지예요", "병원체가 우리 몸에 들어오는 길은 여러 가지예요.")
        self.play(FadeIn(rows[0], shift=RIGHT * 0.2), run_time=0.5)
        self.say(f"{o('접촉')} · {o('비말')}: 손과 침방울", "물건을 만진 손으로 눈, 코, 입을 만지거나, 기침할 때 튄 침방울로 옮을 수 있어요.")
        self.play(FadeIn(rows[1], shift=RIGHT * 0.2), run_time=0.5)
        self.say(f"{o('공기')} · {o('물')} · {o('침')}", "환기하지 않은 곳의 공기, 끓이지 않은 오염된 물, 덜지 않고 같이 먹는 음식의 침으로도 옮아요.")
        self.play(LaggedStart(*[FadeIn(rw, shift=RIGHT * 0.2) for rw in rows[2:]], lag_ratio=0.3), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 기침과 침방울 ──
    def cobalt(self):
        self.section("기침과 침방울")
        self.say(f"염화 코발트 종이는 물기가 닿으면 {r('붉게')} 변해요",
                 "푸른색 염화 코발트 종이는 물기가 닿으면 붉게 변해요. 도화지에 붙이고 기침과 말하기를 해 봐요.")
        trials = [("입을 가리지 않고 기침", 60, 1.0, 11), ("큰 소리로 말하기", 18, 0.55, 12), ("팔로 가리고 기침", 4, 0.25, 13)]
        boards, labels, dots = VGroup(), VGroup(), []
        for i, (nm, n, sp, sd) in enumerate(trials):
            b = K.cobalt_board(3.9, 1.6).move_to([-4.45 + 4.45 * i, 0.5, 0])
            lab = T(nm, 30, INK).next_to(b, UP, buff=0.25)
            boards.add(b); labels.add(lab)
            dots.append(K.cobalt_dots(b, n, sp, sd))
        self.play(LaggedStart(*[FadeIn(VGroup(b, l)) for b, l in zip(boards, labels)], lag_ratio=0.2), run_time=1.0)
        self.say("어느 때 침방울이 가장 많이, 멀리 튈까요?", "세 가지 가운데 어느 때 침방울이 가장 많이, 멀리 튈까요?")
        self.pause_screen(5, "침방울이 가장 많이 튀는 때는?")
        res = ["붉은 점이 아주 많고 멀리까지", "말할 때도 붉은 점이 생겨요", "붉은 점이 거의 없어요"]
        cols = [RED, ORANGE, GREEN]
        rts = VGroup(*[T(t, 26, c).next_to(b, DOWN, buff=0.25) for t, c, b in zip(res, cols, boards)])
        for t in rts:
            if t.width > 4.1:
                t.scale_to_fit_width(4.1)
        self.say(f"기침할 때 침방울이 {r('가장 많이, 멀리')} 튀어요",
                 "입을 가리지 않고 기침하면 붉은 점이 아주 많고 멀리까지 생겨요. 큰 소리로 말할 때도 침방울이 튀어요.")
        self.play(LaggedStart(*[FadeIn(d, lag_ratio=0.02) for d in dots[:2]], lag_ratio=0.5), FadeIn(rts[0]), FadeIn(rts[1]),
                  run_time=1.6)
        self.say(f"팔로 가리면 침방울이 {g('거의 튀지 않아요')}",
                 "팔로 가리고 기침하면 붉은 점이 거의 없어요. 그래서 기침 예절이 중요해요.")
        self.play(FadeIn(dots[2]), FadeIn(rts[2]), run_time=0.6)
        self.play(Circumscribe(VGroup(boards[2], rts[2]), color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생활 습관 ──
    def habits(self):
        self.section("생활 습관 살피기")
        items = [("밖에서 돌아오면 비누로 손을 씻어요", True), ("씻지 않은 손으로 눈을 비벼요", False),
                 ("기침할 때 팔로 입과 코를 가려요", True), ("수건을 여러 사람이 같이 써요", False),
                 ("교실 창문을 열어 환기해요", True), ("상한 음식을 아까워서 먹어요", False)]
        cards = K.choice_grid(items, cols=2, size=28, w=6.4, h=0.78, dy=1.0, top=1.9, dx=6.7)
        self.say(f"감염병을 막는 습관은 ○, 걸릴 수 있는 습관은 ×",
                 "감염병을 막는 좋은 습관이면 동그라미, 감염병에 걸릴 수 있는 습관이면 가위표예요.")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in cards], lag_ratio=0.12), run_time=1.2)
        self.pause_screen(5, "○일까요, ×일까요?")
        self.say(f"손 씻기 · 팔로 가리기 · 환기는 {g('좋은 습관')}",
                 "손 씻기, 팔로 가리고 기침하기, 창문 열어 환기하기는 감염병을 막는 좋은 습관이에요.")
        self.play(*[FadeIn(c.mark, scale=0.6) for c in cards if c.ok], *[c.box.animate.set_stroke(GREEN, 6) for c in cards if c.ok],
                  run_time=0.6)
        self.say(f"눈 비비기 · 수건 같이 쓰기 · 상한 음식은 {r('조심해요')}",
                 "씻지 않은 손으로 눈 비비기, 수건 같이 쓰기, 상한 음식 먹기는 감염병에 걸릴 수 있는 습관이에요.")
        self.play(*[FadeIn(c.mark, scale=0.6) for c in cards if not c.ok], *[c.box.animate.set_stroke(RED, 6) for c in cards if not c.ok],
                  run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("한눈에 쏙")
        f = K.face("ok", 1.0).move_to([-5.2, 0.5, 0])
        gs = VGroup(K.germ("ball", K.GERM_G, 0.35).move_to([-3.4, 1.5, 0]), K.germ("rod", K.GERM_P, 0.3).move_to([-3.2, 0.2, 0]),
                    K.germ("dots", K.GERM_O, 0.3).move_to([-3.5, -0.9, 0]))
        card = text_card([f"병원체는 접촉이나 비말, {o('공기')}, 물, 침 등을 통해",
                          "사람에게 옮겨 가 감염병을 일으켜요.",
                          f"병원체가 {o('눈, 코, 입')}으로 들어오면", "감염병에 걸릴 수 있어요."], size=34).move_to([2.5, 0.5, 0])
        self.say(f"접촉·비말·{o('공기')}·물·침으로 옮겨 가요",
                 "정리해요. 병원체는 접촉이나 비말, 공기, 물, 침 등을 통해 사람에게 옮겨 가 감염병을 일으켜요.")
        self.play(FadeIn(f), FadeIn(gs, lag_ratio=0.2), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        self.say(f"병원체가 {o('눈, 코, 입')}으로 들어오면 걸릴 수 있어요",
                 "병원체가 눈, 코, 입으로 들어오면 감염병에 걸릴 수 있어요.")
        self.play(*[g_.animate.move_to(f.get_center() + np.array([0.3, -0.2 - 0.05 * i, 0])).scale(0.4).set_opacity(0)
                    for i, g_ in enumerate(gs)], run_time=1.2)
        self.play(Circumscribe(card, color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)
