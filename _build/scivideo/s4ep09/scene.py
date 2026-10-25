"""「과학 원리 돋보기」 4학년 9화 — 차가운 컵 표면의 물방울 (4-1 2단원 물의 상태 변화 6차시, 화 코드 4-1-2-d)

바탕: grade4/science/sem1/u2-4.html(원본 _build_tb/src/u2-4.html) — 도입(추운 날 따뜻한 교실에 들어가면 안경알이 뿌옇게 · 막 꺼낸 물병에 물방울:
차가운 물체 표면에 작은 물방울이 맺혀요), 실험(얼음이 가득 든 비커 입구를 비닐 랩으로 씌우고 고무줄로 고정 → 페트리 접시에 올린 채 처음 무게 263.1 g →
10분 동안 바깥 면이 뿌옇게 → 물방울이 커짐 → 흘러내려 접시에 고임 → 나중 무게 263.4 g, 처음 < 나중; 저울 값은 앱이 밝힌 '예시 값', 앱의 안전 안내),
정리(공기 중의 수증기가 차가운 비커 표면에 닿아 물로 변해 맺힘 = 응결), 차가운 캔의 응결 차례, 응결의 예 다섯, 생각 바로잡기(냄비의 하얀 김),
한눈에 쏙, 생각이 쑥(겨울 유리창 안쪽).
최종: ./make_final.sh s4ep09
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Arrow, Circumscribe)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, e_scale
import kit_s4u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S4Ep09(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 9
    EP_TITLE = "차가운 컵 표면의 물방울"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.organize()
        self.order()
        self.examples()
        self.summary()
        self.closing(f"공기 중의 {o('수증기')}가 차가운 물체 표면에 닿아\n"
                     f"물로 변하는 현상: {g('응결')}",
                     next_preview="4학년 마인드맵 2 · 물의 상태 변화")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        gl = K.glasses(False, 1.3).move_to([-3.4, 0.6, 0])
        gt = T("추운 바깥", 34).next_to(gl, DOWN, buff=0.5)
        bt = K.pet_frozen(0, 0.9).move_to([3.4, 0.5, 0])
        bl = T("막 꺼낸 물병", 34).next_to(bt, DOWN, buff=0.35)
        self.say("추운 날 따뜻한 곳에 들어가면 안경알이 왜 뿌옇게 될까요?",
                 "추운 겨울날 따뜻한 교실에 들어가면, 안경알이 왜 뿌옇게 흐려질까요?")
        self.play(FadeIn(gl), FadeIn(gt), run_time=0.6)
        self.play(Transform(gl, K.glasses(True, 1.3).move_to(gl)), Transform(gt, T("따뜻한 교실", 34).move_to(gt)), run_time=1.0)
        self.say("냉장고에서 꺼낸 물병을 잠시 두면?", "냉장고에서 꺼낸 차가운 물병을 잠시 꺼내 두면 어떻게 될까요?")
        self.play(FadeIn(bt), FadeIn(bl), run_time=0.6)
        drops = VGroup(*[K.Ellipse(width=0.12, height=0.17, fill_color=K.WATER_L, fill_opacity=1, stroke_color=K.WATER_D, stroke_width=2)
                         .move_to([3.4 + dx, 0.5 + dy, 0]) for dx, dy in ((-0.3, 0.6), (0.2, 0.3), (-0.1, -0.1), (0.3, -0.5), (-0.35, -0.6), (0.1, 0.9), (0.35, 0.1))])
        self.play(FadeIn(drops, lag_ratio=0.1), Transform(bl, T("잠시 뒤", 34).move_to(bl)), run_time=1.0)
        self.pause_screen(5, "두 그림의 공통점은?")
        self.say(f"차가운 물체 표면에 {o('작은 물방울')}이 맺혀요",
                 "두 그림 모두 차가운 물체 표면에 작은 물방울이 맺혀요. 이 물방울은 어디에서 왔을까요?")
        self.play(Indicate(gl, color=BLUE), Indicate(drops, color=BLUE), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 실험해요 ──
    def experiment(self):
        self.section("실험해요")
        safe = K.safety_note(f"유리 기구가 깨지지 않게 · 얼음은 {r('맨손으로 만지지 않아요')} · 실험 물질은 먹지 않아요").move_to([0.2, 2.35, 0])
        sc = e_scale("0.0").scale(1.45, about_point=np.zeros(3)).shift([-1.2, -2.1, 0])
        base_y = sc[1].get_top()[1]
        bk = K.ice_beaker_wrap(0).move_to([-1.2, 0, 0])
        bk.shift(UP * (base_y - bk.get_bottom()[1]))
        self.say("얼음이 가득 든 비커의 입구를 비닐 랩으로 씌워요",
                 "얼음이 가득 든 비커의 입구를 비닐 랩으로 씌우고 고무줄로 고정해요. 비커 안의 물이 밖으로 나오지 못하게 막은 거예요.")
        self.play(FadeIn(safe), FadeIn(sc), FadeIn(bk), run_time=0.7)
        wl = T("비닐 랩", 30).move_to([1.6, bk.get_top()[1] - 0.1, 0])
        arr = Arrow(wl.get_left(), [bk.get_right()[0] - 0.4, bk.get_top()[1] - 0.05, 0], buff=0.1, color=SOFT, stroke_width=5)
        self.play(Create(arr), FadeIn(wl), run_time=0.5)
        rec = VGroup(T("처음 무게", 32), T("10분 뒤 무게", 32)).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to([3.6, 0.3, 0])
        rec.shift(LEFT * 0.5)
        vx = rec.get_right()[0] + 0.35
        v0 = T("263.1 g", 34, ORANGE).move_to([vx, rec[0].get_center()[1], 0], aligned_edge=LEFT)
        v1 = T("263.4 g", 34, ORANGE).move_to([vx, rec[1].get_center()[1], 0], aligned_edge=LEFT)
        self.say(f"물방울이 맺히기 전에 처음 무게: {o('263.1 g')}",
                 "페트리 접시에 올린 채로 영점을 맞추고, 물방울이 맺히기 전에 처음 무게를 재요. 263.1그램이에요. 이 값은 예시 값이에요.")
        self.play(Transform(sc.num, T("263.1 g", 34, "#7CF2A4").move_to(sc.scr)), FadeIn(rec[0]), FadeIn(v0), run_time=0.6)
        note = T("저울 값은 예시 값이에요", 26, SOFT).next_to(rec, DOWN, buff=0.4).align_to(rec, LEFT)
        self.play(FadeIn(note), FadeOut(arr), FadeOut(wl), run_time=0.4)
        self.say("10분 동안 비커의 바깥 면을 관찰해요", "10분 동안 비커의 바깥 면에 어떤 변화가 생기는지 관찰해 봐요.")
        self.pause_screen(5, "비커 바깥 면은 어떻게 될까요?")
        clock = T("0분", 34).move_to([-4.6, 1.3, 0])
        self.add(clock)
        steps = [(1, "2분", "비커 바깥 면이 뿌옇게 되며 작은 물방울이 맺혀요"),
                 (2, "5분", "시간이 지날수록 작은 물방울들이 점점 커져요"),
                 (3, "10분", "커진 물방울이 흘러내려 페트리 접시에 고여요")]
        for st, tm, txt in steps:
            nb = K.ice_beaker_wrap(st).move_to(bk)
            nb.shift(UP * (base_y - nb.get_bottom()[1]))
            self.say(txt)
            self.play(Transform(bk, nb), Transform(clock, T(tm, 34).move_to(clock)), run_time=1.0)
        self.say(f"10분 뒤 무게: {o('263.4 g')} — {r('더 무거워졌어요')}",
                 "10분 뒤 무게를 재면 263.4그램이에요. 처음 무게보다 나중 무게가 더 무거워졌어요.")
        self.play(Transform(sc.num, T("263.4 g", 34, "#7CF2A4").move_to(sc.scr)), FadeIn(rec[1]), FadeIn(v1), run_time=0.6)
        cmp_ = M(f"263.1 g {r('&lt;')} 263.4 g", 40).next_to(note, DOWN, buff=0.4).align_to(rec, LEFT)
        self.play(FadeIn(cmp_, scale=1.2), run_time=0.5)
        self.settle()
        self.bk_keep = (bk, sc)
        clear_stage(self)

    # ── 정리해요 ──
    def organize(self):
        self.section("정리해요")
        bk = K.ice_beaker_wrap(2).scale(0.85).move_to([-4.3, 0.55, 0])
        opts = VGroup(*[T(s, 32) for s in ("① 비커 안의 얼음이 녹은 물이 새어 나왔어요",
                                            "② 공기 중의 수증기가 차가운 비커 표면에서 물로 변했어요",
                                            "③ 비커가 차가워서 비커에서 물이 생겨났어요")]).arrange(DOWN, buff=0.4, aligned_edge=LEFT)
        if opts.width > 8.6:
            opts.scale_to_fit_width(8.6)
        opts.move_to([1.9, 0.75, 0])
        self.say("비커의 바깥 면에 물방울이 생긴 까닭은?", "비커의 바깥 면에 물방울이 생긴 까닭은 무엇일까요? 입구는 랩으로 막혀 있었어요.")
        self.play(FadeIn(bk), FadeIn(opts, lag_ratio=0.2), run_time=0.9)
        self.pause_screen(5, "물방울은 어디에서 왔을까요?")
        dots = K.vapor_dots(-6.5, -2.2, -1.0, 2.0, 26, seed=4, r=0.06)
        self.add(dots)
        self.say(f"공기 중의 {o('수증기')}가 차가운 비커 표면에 닿아 물로",
                 "공기 중의 눈에 보이지 않는 수증기가 차가운 비커 표면에 닿아 물로 변해 맺힌 거예요. 그래서 무게도 늘었어요.")
        cx = bk.get_center()
        self.play(*[d.animate.move_to(cx + (d.get_center() - cx) * 0.38) for d in dots],
                  SurroundingBox(opts[1]), run_time=1.5)
        card = K.text_card([f"기체인 수증기가 액체인 물로 상태가 변하는 현상을 {r('응결')}이라고 해요."], size=38).move_to([0, -1.9, 0])
        self.say(f"수증기가 물로 변하는 현상: {r('응결')}", "기체인 수증기가 액체인 물로 상태가 변하는 현상을 응결이라고 해요.")
        self.play(FadeOut(dots), FadeIn(card), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 응결이 일어날 때 ──
    def order(self):
        self.section("응결이 일어날 때")
        cans = VGroup(*[K.cold_can(i, 1.15) for i in (1, 2, 3)]).arrange(RIGHT, buff=2.6).move_to([0, 0.6, 0])
        labs = ["① 표면이 뿌옇게 돼요", "② 물방울이 점점 커져요", "③ 흘러내려 바닥도 축축해요"]
        two = ["① 표면이\n뿌옇게 돼요", "② 물방울이\n점점 커져요", "③ 흘러내려\n바닥도 축축해요"]
        ls = VGroup(*[VGroup(*[T(x, 30) for x in t.split("\n")]).arrange(DOWN, buff=0.1).next_to(c, DOWN, buff=0.35)
                      for t, c in zip(two, cans)])
        arrs = VGroup(*[Arrow(cans[i].get_right(), cans[i + 1].get_left(), buff=0.35, color=SOFT, stroke_width=6) for i in range(2)])
        self.say("차가운 캔 표면에서 일어나는 일을 차례대로 봐요",
                 "차가운 캔 표면에서는 어떤 차례로 응결이 일어날까요?")
        n = ["수증기가 물방울로 변해 캔 표면이 뿌옇게 돼요.", "시간이 지나면 표면에 맺힌 물방울이 점점 커져요.", "커진 물방울이 흘러내려 바닥도 축축해져요."]
        for i in range(3):
            if i:
                self.play(Create(arrs[i - 1]), run_time=0.3)
            self.say(labs[i], n[i])
            self.play(FadeIn(cans[i]), FadeIn(ls[i]), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 응결의 예 ──
    def examples(self):
        self.section("응결의 예")
        items = [(K.mirror(True), "욕실 거울"), (K.pot_lid(), "냄비 뚜껑 안쪽"), (K.cold_can(2), "차가운 음료수"),
                 (K.window_drops(), "유리창 안쪽"), (K.dew_grass(), "풀잎의 이슬")]
        grp = VGroup()
        for i, (p, n) in enumerate(items):
            K.fit(p, 1.8, 1.7)
            c = VGroup(p, T(n, 30).next_to(p, DOWN, buff=0.2))
            c.move_to([(i - 2) * 2.75, 1.0, 0])
            grp.add(c)
        self.say("우리 주변에서 응결을 찾아요",
                 "욕실 거울, 냄비 뚜껑 안쪽, 차가운 음료수 캔, 유리창 안쪽, 이른 아침 풀잎과 거미줄에도 물방울이 맺혀요.")
        self.play(FadeIn(grp, lag_ratio=0.2), run_time=1.4)
        self.say(f"모두 공기 중의 수증기가 차가운 표면에서 {o('응결')}한 거예요",
                 "모두 공기 중의 수증기가 차가운 물체 표면에 닿아 응결한 거예요.")
        self.settle()
        q = M(f"생각 바로잡기: 국을 끓일 때 보이는 {o('하얀 김')}은 수증기일까요?", 36).move_to([0, -1.0, 0])
        a = M(f"아니요, 수증기가 물로 변한 {r('작은 물방울')}이에요", 36).move_to([0, -1.85, 0])
        self.say("냄비 주위의 하얀 김은 수증기일까요?", "냄비 뚜껑을 닫고 국을 끓일 때 주위에 보이는 하얀 김은 수증기일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.say(f"아니요! 수증기가 물로 변한 {r('작은 물방울')}이에요",
                 "아니에요. 하얀 김은 수증기가 응결해 물로 변한 작은 물방울이에요. 수증기는 눈에 보이지 않아요.")
        self.play(FadeIn(a), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["차가운 물체 표면에 생긴 물방울은",
                            f"공기 중의 수증기가 {r('응결')}해 물로 변한 것입니다."], w=12.4, size=46).move_to([0, 1.6, 0])
        self.say(f"차가운 물체 표면의 물방울은 수증기가 {r('응결')}한 것이에요",
                 "차가운 물체 표면에 생긴 물방울은 공기 중의 수증기가 응결해 물로 변한 거예요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        win = K.window_drops().scale(0.8).move_to([-5.5, -1.1, 0])
        q = T("겨울날 집 안 유리창 안쪽에 물방울이 맺히는 까닭은?", 34).move_to([-4.5, -0.6, 0], aligned_edge=LEFT)
        a = M(f"집 안 공기 중의 수증기가 차가운 유리창에 닿아 {o('응결')}해서", 34).move_to([-4.5, -1.6, 0], aligned_edge=LEFT)
        self.say("겨울날 유리창 안쪽에 물방울이 맺히는 까닭은?",
                 "추운 겨울날 따뜻한 집 안에서 유리창 안쪽에 물방울이 맺히는 까닭은 무엇일까요?")
        self.play(FadeIn(win), FadeIn(q), run_time=0.6)
        self.say(f"집 안의 수증기가 차가운 유리창에서 {o('응결')}해서예요",
                 "집 안 공기 중의 수증기가 차가운 유리창에 닿아 응결했기 때문이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.settle()
        clear_stage(self)


def SurroundingBox(m):
    from manim import SurroundingRectangle
    return Create(SurroundingRectangle(m, color=GREEN, buff=0.12, corner_radius=0.15, stroke_width=6))
