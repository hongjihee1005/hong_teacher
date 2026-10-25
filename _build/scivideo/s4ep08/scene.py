"""「과학 원리 돋보기」 4학년 8화 — 증발과 끓음은 어떻게 다를까? (4-1 2단원 물의 상태 변화 4~5차시, 화 코드 4-1-2-c)

바탕: grade4/science/sem1/u2-3.html(원본 _build_tb/src/u2-3.html) — 도입(젖은 머리카락이 마름: 물이 수증기로 변해 공기 중으로),
실험해요 1(물로 쓰는 종이: 처음 축축해요·선명해요 → 5분 뒤 조금 덜 축축해요·조금 사라졌어요 → 10분 뒤 물기가 거의 없어요·거의 보이지 않아요),
실험해요 2(햇볕이 잘 드는 곳의 비커: 5분 뒤엔 거의 그대로, 1일·2일·3일 뒤 점점 낮아짐 — 앱 그림의 물 높이 100·100·80·62·46),
증발(정의)·증발의 예 다섯(빨래·감·고추·오징어 말리기, 웅덩이가 마름), 끓음 실험(파란 선 → 가열 → 작은 기포 → 끓음(크고 작은 기포, 표면이 울퉁불퉁) → 5분 뒤 끄고 비교: 낮아짐, 앱의 안전 안내),
끓음(정의)·생각 바로잡기(끓기 전에도 표면에서 증발), 증발과 끓음 비교 카드 일곱, 한눈에 쏙, 생각이 쑥(계속 끓이면 빠르게 줄어요).
최종: ./make_final.sh s4ep08
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Line, ValueTracker,
                   always_redraw, linear, Circumscribe)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u12 as K

PX = 0.012          # 앱 그림 1픽셀 → 화면 길이
MBLUE = "#1F5FD1"


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S4Ep08(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 8
    EP_TITLE = "증발과 끓음은 어떻게 다를까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.paper()
        self.beaker_days()
        self.evaporation()
        self.boil()
        self.compare()
        self.summary()
        self.closing(f"{o('증발')}: 물의 표면에서 천천히  ·  {o('끓음')}: 표면과 물속에서 빠르게\n"
                     f"둘 다 물이 {g('수증기')}로 상태가 변해요",
                     next_preview="4학년 9화 · 차가운 컵 표면의 물방울")
        self.wait(0.5)

    # ── 궁금해요: 젖은 머리카락 ──
    def intro(self):
        self.section("궁금해요")
        head = K.wet_head(True, 1.4).move_to([-2.5, 0.3, 0])
        lab = T("방금 머리를 감았어요", 36).move_to([2.6, 1.5, 0])
        self.say("젖은 머리카락은 시간이 지나면 어떻게 될까요?", "젖은 머리카락은 시간이 지나면 어떻게 될까요?")
        self.play(FadeIn(head), FadeIn(lab), run_time=0.6)
        dry = K.wet_head(False, 1.4).move_to(head)
        vp = VGroup(*[K.vapor(0.7, 1, 0).move_to([x, 1.9, 0]) for x in (-3.4, -2.5, -1.6)])
        self.play(Transform(head, dry), FadeIn(vp, shift=UP * 0.3), Transform(lab, T("시간이 지나니 말랐어요", 36).move_to(lab)), run_time=1.2)
        self.pause_screen(5, "젖은 머리카락이 마른 까닭은?")
        self.say(f"머리카락의 물이 {o('수증기')}로 변해 공기 중으로 날아갔어요",
                 "머리카락의 물이 수증기로 변해 공기 중으로 날아갔어요. 점선은 눈에 보이지 않는 수증기를 나타내요.")
        self.play(Indicate(vp, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 실험해요 1: 물로 쓰는 종이 ──
    def paper(self):
        self.section("실험해요 1")
        pp = K.water_paper(0.0).move_to([-3.3, 0.9, 0])
        lab = T("처음", 36).next_to(pp, UP, buff=0.15)
        self.say("물로 쓰는 종이에 붓으로 그림을 그려요",
                 "물이 닿은 부분만 색깔이 변하는 물로 쓰는 종이에 붓으로 그림을 그려요.")
        self.play(FadeIn(pp), FadeIn(lab), run_time=0.7)
        rows = ["손으로 만진 느낌", "그림의 모습"]
        cols = ["처음", "5분 뒤", "10분 뒤"]
        vals = [["축축해요", "조금 덜 축축해요", "물기가 거의 없어요"], ["선명해요", "조금 사라졌어요", "거의 보이지 않아요"]]
        tbl = VGroup()
        x0, y0, cw, ch = -6.3, -1.1, 3.0, 0.62
        hw = 3.6
        for j, c in enumerate([""] + cols):
            w = hw if j == 0 else cw
            x = x0 + hw / 2 if j == 0 else x0 + hw + (j - 1) * cw + cw / 2
            cell = K.rect(w, ch, "#E6F1EC", stroke=SOFT, sw=3).move_to([x, y0, 0])
            tbl.add(VGroup(cell, T(c, 28).move_to(cell)))
        cells = []
        for i, rname in enumerate(rows):
            y = y0 - (i + 1) * ch
            cell = K.rect(hw, ch, "#E6F1EC", stroke=SOFT, sw=3).move_to([x0 + hw / 2, y, 0])
            tbl.add(VGroup(cell, T(rname, 28).move_to(cell)))
            rowc = []
            for j in range(3):
                c = K.rect(cw, ch, PAPER, stroke=SOFT, sw=3).move_to([x0 + hw + j * cw + cw / 2, y, 0])
                t = T(vals[i][j], 26, ORANGE).move_to(c)
                if t.width > cw - 0.15:
                    t.scale_to_fit_width(cw - 0.15)
                tbl.add(c)
                rowc.append(t)
            cells.append(rowc)
        self.say("5분 간격으로 만져 보고 그림을 관찰해요", "5분 간격으로 손으로 만져 보고 그림의 모습을 관찰해 기록해요. 어떻게 될까요?")
        self.play(FadeIn(tbl), FadeIn(cells[0][0]), FadeIn(cells[1][0]), run_time=0.7)
        for j, (k, name) in enumerate(((0.45, "5분 뒤"), (0.92, "10분 뒤"))):
            if j == 0:
                self.say(f"축축함이 없어지고 그림이 {o('점점 사라졌어요')}",
                         "5분 뒤에는 조금 덜 축축하고 그림이 조금 사라졌어요. 10분 뒤에는 물기가 거의 없고 그림이 거의 보이지 않아요.")
            self.play(Transform(pp, K.water_paper(k).move_to(pp)), Transform(lab, T(name, 36).move_to(lab)),
                      FadeIn(cells[0][j + 1]), FadeIn(cells[1][j + 1]), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 실험해요 2: 비커의 물 ──
    def beaker_days(self):
        self.section("실험해요 2")
        sun = VGroup(K.C(0.45, "#F7B733", 0, 0, stroke="#E0A020")).move_to([-5.6, 2.2, 0])
        bk = K.Beaker(-2.6, -2.1, 2.0, 2.75)
        H = {0: 100, 0.05: 100, 1: 80, 2: 62, 3: 46}
        w = bk.water(H[0] * PX * 2.2)
        g_ = bk.glass()
        lab = T("처음", 38).move_to([2.6, 1.6, 0])
        self.say("물을 반 정도 넣은 비커를 햇볕이 잘 드는 곳에 두어요",
                 "물을 반 정도 넣고 높이를 표시한 비커를 햇볕이 잘 드는 곳에 두고, 날마다 같은 시간에 관찰해요.")
        mk0 = bk.mark(H[0] * PX * 2.2)
        self.play(FadeIn(sun), FadeIn(w), FadeIn(g_), FadeIn(lab), run_time=0.6)
        t0 = T("처음", 26).move_to([bk.x + bk.w / 2 + 0.2, bk.y + H[0] * PX * 2.2, 0], aligned_edge=LEFT)
        self.play(Create(mk0), FadeIn(t0), run_time=0.4)
        self.pause_screen(5, "며칠 뒤 물의 높이는?")
        self.say("5분 뒤에는 거의 그대로예요", "5분 뒤에는 물의 높이가 거의 그대로예요.")
        self.play(Transform(lab, T("5분 뒤", 38).move_to(lab)), run_time=0.5)
        self.say(f"날이 갈수록 물의 높이가 {o('점점 낮아졌어요')}", "1일 뒤, 2일 뒤, 3일 뒤. 날이 갈수록 물의 높이가 점점 낮아졌어요.")
        marks = VGroup()
        for d in (1, 2, 3):
            h = H[d] * PX * 2.2
            m = bk.mark(h)
            t = T(f"{d}일 뒤", 24).move_to([bk.x + bk.w / 2 + 0.2, bk.y + h, 0], aligned_edge=LEFT)
            self.play(Transform(w, bk.water(h)), Transform(lab, T(f"{d}일 뒤", 38).move_to(lab)), run_time=0.8)
            self.play(Create(m), FadeIn(t), run_time=0.3)
            marks.add(m, t)
        self.say("물이 수증기로 변해 공기 중으로 날아갔어요",
                 "종이와 비커의 물은 수증기로 변해 공기 중으로 날아갔어요.")
        vp = VGroup(*[K.vapor(0.7, 1, 0).move_to([x, 0.2, 0]) for x in (-3.2, -2.6, -2.0)])
        self.play(FadeIn(vp, shift=UP * 0.3), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 증발 ──
    def evaporation(self):
        self.section("증발")
        card = K.text_card([f"물의 {o('표면')}에서 액체인 물이 기체인 수증기로",
                            f"상태가 변하는 현상을 {r('증발')}이라고 해요."], size=44).move_to([0, 1.9, 0])
        self.say(f"물의 표면에서 물이 수증기로 변하는 현상: {r('증발')}",
                 "물의 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 현상을 증발이라고 해요.")
        self.play(FadeIn(card), run_time=0.7)
        pics = [(K.laundry(), "빨래 말리기"), (K.persimmons(), "감 말리기"),
                (VGroup(*[K.poly([(x - 0.35, y), (x + 0.35, y + 0.08), (x + 0.32, y - 0.05)], "#D62D20", "#8A1A12", 2)
                          for x, y in ((-0.3, 0.3), (0.3, 0.0), (-0.2, -0.3), (0.35, -0.5))]), "고추 말리기"),
                (VGroup(K.L((-0.9, 0.8), (0.9, 0.8), INK, 3),
                        *[K.poly([(x - 0.15, 0.8), (x + 0.15, 0.8), (x + 0.2, -0.2), (x, -0.6), (x - 0.2, -0.2)], "#F3D6B8", "#C99A6B", 3)
                          for x in (-0.45, 0.45)]), "오징어 말리기"),
                (VGroup(K.puddle(2.0, 0.45), K.vapor(0.6, 2, 0.5).shift(UP * 0.55)), "웅덩이가 말라요")]
        grp = VGroup()
        for i, (p, n) in enumerate(pics):
            K.fit(p, 1.6, 1.4)
            c = VGroup(p, T(n, 28).next_to(p, DOWN, buff=0.15))
            c.move_to([(i - 2) * 2.7, -0.75, 0])
            grp.add(c)
        self.say("증발과 관련된 예를 찾아요", "빨래, 감, 고추, 오징어를 말리고, 비 온 뒤 웅덩이의 물이 말라요. 모두 물이 표면에서 수증기로 증발해요.")
        self.play(FadeIn(grp, lag_ratio=0.2), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 끓음 ──
    def boil(self):
        self.section("끓을 때")
        safe = K.safety_note(f"{r('보안경·면장갑')} 착용 · 화상 조심, 너무 가까이에서 보지 않기 · 핫플레이트는 끈 뒤에도 뜨거워요",
                             w=11.8, size=30).move_to([0.2, 2.35, 0])
        plate = K.hot_plate(3.2).move_to([-2.4, -2.1, 0])
        bk = K.Beaker(-2.4, -1.85, 1.9, 2.4)
        h0, h1 = 108 * PX * 1.2, 82 * PX * 1.2
        top0 = -1.85 + h0
        phase = ValueTracker(0.0)
        wob = ValueTracker(0.0)
        level = ValueTracker(h0)
        water = always_redraw(lambda: bk.water(level.get_value(), wob=wob.get_value(), phase=phase.get_value()))
        g_ = bk.glass()
        mk = bk.mark(h0, MBLUE)
        cap = T("① 파란 선으로 높이 표시", 36).move_to([2.9, 1.3, 0])
        self.say("가열할 때는 보안경과 면장갑을 꼭 착용해요",
                 "물을 가열할 때는 보안경과 면장갑을 꼭 착용하고, 화상을 입지 않게 너무 가까이에서 보지 않아요.")
        self.play(FadeIn(safe), FadeIn(plate), FadeIn(water), FadeIn(g_), run_time=0.7)
        self.say("물의 높이를 파란 선으로 표시하고 가열해요")
        self.play(Create(mk), FadeIn(cap), run_time=0.5)
        lamp = plate[2]
        self.play(lamp.animate.set_color("#FF4B3A"), Transform(cap, T("② 가열 시작: 변화가 거의 없어요", 34).move_to(cap)), run_time=0.5)
        small = K.bubbles(-3.2, -1.6, -1.7, top0 - 0.15, 7, seed=3, rmin=0.03, rmax=0.05)
        self.say("처음엔 변화가 거의 없다가, 작은 기포가 조금씩 생겨요", "처음에는 변화가 거의 없다가, 시간이 지나면서 물속에서 작은 기포가 조금씩 생겨요.")
        self.play(FadeIn(small), Transform(cap, T("③ 작은 기포가 조금씩", 34).move_to(cap)), run_time=0.6)
        self.play(small.animate.shift(UP * 0.15), run_time=0.8)
        self.pause_screen(5, "물이 끓으면 어떤 모습일까요?")
        big = K.bubbles(-3.2, -1.6, -1.7, top0 - 0.1, 22, seed=8, rmin=0.04, rmax=0.15)
        blab = K.L((-1.75, -1.0), (0.4, -0.2), SOFT, 3)
        bt = T("기포", 32).next_to(blab.get_end(), RIGHT, buff=0.1)
        self.play(FadeOut(small), FadeIn(big), wob.animate.set_value(0.12), Transform(cap, T("④ 물이 끓어요", 36).move_to(cap)), run_time=0.6)
        self.say(f"크고 작은 {o('기포')}가 많이 생겨 올라와 터지고, 표면이 울퉁불퉁",
                 "크고 작은 기포가 많이 생겨 올라와 터지면서 물 표면이 울퉁불퉁해져요. 보글보글 소리가 나요.")
        self.play(phase.animate.set_value(8), big.animate.shift(UP * 0.3), run_time=2.0, rate_func=linear)
        self.play(Create(blab), FadeIn(bt), phase.animate.set_value(12), run_time=1.0, rate_func=linear)
        self.say(f"기포는 물속에서 물이 {o('수증기')}로 변한 것이에요", "기포는 물속에서 물이 수증기로 변한 것이에요.")
        self.play(phase.animate.set_value(20), run_time=2.0, rate_func=linear)
        self.play(FadeOut(big), FadeOut(blab), FadeOut(bt), wob.animate.set_value(0.0), level.animate.set_value(h1), lamp.animate.set_color("#D2453B"),
                  Transform(cap, T("⑤ 5분 끓인 뒤 끄고 비교", 34).move_to(cap)), run_time=1.0)
        self.say(f"5분 정도 끓이고 비교하면 물의 높이가 {o('낮아졌어요')}",
                 "5분 정도 끓인 뒤 핫플레이트를 끄고 비교하면, 물의 높이가 처음보다 낮아졌어요.")
        self.play(Indicate(mk, color=MBLUE, scale_factor=1.3), run_time=0.8)
        self.settle()
        self.play(FadeOut(VGroup(plate, g_, mk, cap)), FadeOut(water), run_time=0.5)
        self.remove(water)
        card = K.text_card([f"물의 {o('표면')}과 {o('물속')}에서 물이 수증기로",
                            f"상태가 변하는 현상을 {r('끓음')}이라고 해요."], size=44).move_to([0, 0.6, 0])
        self.section("끓음")
        self.say(f"표면과 물속에서 물이 수증기로 변하는 현상: {r('끓음')}",
                 "물의 표면과 물속에서 물이 수증기로 상태가 변하는 현상을 끓음이라고 해요.")
        self.play(FadeIn(card), run_time=0.7)
        mis = M(f"생각 바로잡기: 끓기 전에도 표면에서 {o('증발')}이 일어나요", 36).move_to([0, -1.5, 0])
        self.say(f"끓기 전에도 표면에서는 {o('증발')}이 일어나요",
                 "가열할 때 끓음만 일어날까요? 아니에요. 끓기 전에도 표면에서 증발이 일어나요.")
        self.play(FadeIn(mis), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 비교하기 ──
    def compare(self):
        self.section("비교하기")
        A = K.bin_box("증발만", 4.3, 4.6, BLUE, 34).move_to([-4.55, 0.25, 0])
        B = K.bin_box("둘 다 (공통점)", 4.3, 4.6, GREEN, 34).move_to([0, 0.25, 0])
        C = K.bin_box("끓음만", 4.3, 4.6, ORANGE, 34).move_to([4.55, 0.25, 0])
        self.say("증발과 끓음을 비교해요")
        self.play(FadeIn(A), FadeIn(B), FadeIn(C), run_time=0.6)
        items = {
            0: ["물의 표면에서만", "매우 천천히 줄어요"],
            1: ["물이 수증기로 변해요", "물의 양이 줄어요"],
            2: ["표면과 물속에서", "증발보다 빠르게 줄어요", "물속에서 기포가\n생겨 올라와 터져요"],
        }
        bins = [A, B, C]
        groups = []
        for k in (1, 0, 2):
            ts = VGroup()
            for s in items[k]:
                lines = VGroup(*[T(x, 30) for x in s.split("\n")]).arrange(DOWN, buff=0.08)
                if lines.width > 3.6:
                    lines.scale_to_fit_width(3.6)
                box = K.rect(3.9, lines.height + 0.3, PAPER, stroke=SOFT, sw=3, r=0.15)
                lines.move_to(box)
                ts.add(VGroup(box, lines))
            ts.arrange(DOWN, buff=0.18).next_to(bins[k].title, DOWN, buff=0.3)
            groups.append((k, ts))
        narr = {1: (f"공통점: 물이 {g('수증기')}로 변하고, 물의 양이 줄어요",
                    "공통점은 둘 다 물이 수증기로 상태가 변하고, 물의 양이 줄어든다는 거예요."),
                0: (f"증발: 물의 {o('표면')}에서만, 매우 천천히",
                    "증발은 물의 표면에서만 물이 수증기로 변하고, 물의 양이 매우 천천히 줄어요."),
                2: (f"끓음: 표면과 {o('물속')}에서, 빠르게, 기포가 생겨요",
                    "끓음은 물의 표면과 물속에서 물이 수증기로 변하고, 증발할 때보다 물의 양이 빠르게 줄어요. 물속에서 기포가 생겨 올라와 터져요.")}
        for k, ts in groups:
            self.say(*narr[k])
            self.play(FadeIn(ts, lag_ratio=0.25), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"증발과 끓음은 물이 {r('수증기')}로 상태가 변하는",
                            "공통점이 있습니다."], w=12.4, size=46).move_to([0, 1.6, 0])
        self.say(f"증발과 끓음은 물이 {r('수증기')}로 상태가 변하는 공통점이 있어요",
                 "증발과 끓음은 물이 수증기로 상태가 변하는 공통점이 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        q = T("물을 계속 끓이면 어떻게 될까요?", 38).move_to([0, -0.5, 0])
        a = M(f"물의 양이 {o('빠르게 줄어들어요')}", 40).move_to([0, -1.5, 0])
        self.say("물을 계속 끓이면 어떻게 될까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.say(f"물의 양이 {o('빠르게 줄어들어요')}", "물의 양이 빠르게 줄어들어요.")
        self.play(FadeIn(a), run_time=0.5)
        self.settle()
        clear_stage(self)
