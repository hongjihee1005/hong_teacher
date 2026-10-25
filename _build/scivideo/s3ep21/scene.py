"""「과학 원리 돋보기」 3학년 21화 — 같은 물질로 된 물체를 찾아라 (3-2 1단원 물질의 성질 3차시, 화 코드 3-2-1-b)

바탕: grade3/science/sem2/u1-2.html — 도입(철 뚜껑이 달린 유리병 분리배출: 유리류·캔·고철류·플라스틱류·종이류),
교실 탐험(물질 붙임쪽지: 창틀·창문 유리·책상 판·책상 다리·가위 날·가위 손잡이·지우개·집게·쓰레기통 …),
분류 결과(두 가지 이상의 물질로 된 물체: 가위·창문·소화기·책상), 분류의 예(소화기: 몸통·손잡이 금속, 호스 고무, 노즐 플라스틱),
분류 기준 찾기(집게·클립 / 나무 도마·나무젓가락 / 삼각자·장난감 블록), 한눈에 쏙(철 못·철 클립 → 금속), 생각+(고무로 된 물체),
형성 평가(집게·냄비·프라이팬 → 금속).
최종: ./make_final.sh s3ep21
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, RoundedRectangle,
                   Circumscribe)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


class S3Ep21(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 21
    EP_TITLE = "같은 물질로 된 물체를 찾아라"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.recycle()
        self.classroom()
        self.extinguisher_part()
        self.criterion()
        self.summary()
        self.check()
        self.closing(f"물체는 이루고 있는 {o('물질의 종류')}에 따라\n{g('분류할 수 있어요')}",
                     next_preview="3학년 22화 · 물질의 세 가지 상태")
        self.wait(0.5)

    # ── 궁금해요: 분리배출 ──
    def recycle(self):
        self.section("궁금해요")
        names = [("유리류", K.GLASS_D), ("캔·고철류", K.IRON_D), ("플라스틱류", K.PLAST_D), ("종이류", K.BROWN_DARK)]
        bins = VGroup()
        for i, (n, c) in enumerate(names):
            b = K.recycle_bin(n, c, 2.6, 1.6).move_to([-4.65 + i * 3.1, -1.2, 0])
            bins.add(b)
        self.say("재활용품을 물질에 따라 나누어 모아요", "재활용품은 물질에 따라 나누어 모아요. 분리배출함이에요.")
        self.play(FadeIn(bins, lag_ratio=0.15), run_time=1.0)
        items = [(K.can, 1, "음료수 캔"), (K.pet_bottle, 2, "생수병"), (K.paper_box, 3, "종이 상자"), (K.milk_bottle, 0, "우유 유리병")]
        objs = VGroup()
        for i, (f, k, n) in enumerate(items):
            m = K.fit(f(), 1.1, 1.25).move_to([-5.2 + i * 2.2, 1.7, 0])
            objs.add(VGroup(m, T(n, 26).next_to(m, DOWN, buff=0.1)))
        jar = K.fit(K.glass_jar(), 1.05, 1.35).move_to([4.6, 1.7, 0])
        jl = T("철 뚜껑 유리병", 26).next_to(jar, DOWN, buff=0.1)
        self.say("캔은 캔·고철류, 생수병은 플라스틱류에 넣어요", "음료수 캔은 캔·고철류, 생수병은 플라스틱류, 종이 상자는 종이류, 우유병은 유리류에 넣어요.")
        self.play(FadeIn(objs, lag_ratio=0.15), FadeIn(jar), FadeIn(jl), run_time=0.9)
        for i, (f, k, n) in enumerate(items):
            self.play(objs[i].animate.scale(0.8).move_to(bins[k].box.get_center() + LEFT * 0.55 + (RIGHT * 1.1 if i == 0 else 0)),
                      run_time=0.55)
        self.say(f"{o('철로 만든 뚜껑')}이 있는 유리병은 어떻게 할까요?", "그런데 철로 만든 뚜껑이 있는 유리병은 어디에 넣어야 할까요?")
        self.play(Indicate(VGroup(jar, jl), color=ORANGE), run_time=0.8)
        self.pause_screen(5, "철 뚜껑이 달린 유리병은 어디에?")
        lid, body = jar[1], jar[0]
        self.say(f"두 물질로 된 물건은 먼저 {o('나누어요')}", "두 가지 물질로 된 물건은 먼저 나누어야 해요. 유리병은 유리류에, 철 뚜껑은 캔·고철류에 넣어요.")
        self.play(FadeOut(jl), lid.animate.shift(UP * 0.5 + RIGHT * 0.6), run_time=0.6)
        self.play(body.animate.move_to(bins[0].box.get_center() + RIGHT * 0.6),
                  lid.animate.move_to(bins[1].box.get_center() + LEFT * 0.65), run_time=0.8)
        self.say(f"{g('물질의 종류')}에 따라 나누어 버리면 다시 쓸 수 있어요",
                 "물체를 이루는 물질의 종류에 따라 나누어 버리면 다시 쓸 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 교실 탐험 ──
    def classroom(self):
        self.section("탐구해요")
        win = K.fit(K.window_pic(), 1.8, 1.4)
        dk = K.fit(K.desk(), 2.0, 1.2)
        sc = K.fit(K.scissors(), 2.0, 1.1)
        er = K.fit(K.eraser(), 1.3, 0.6)
        cl = K.fit(K.binder_clip(), 0.9, 1.0)
        tc = K.fit(K.trash_can(), 1.0, 1.15)
        objs = [win, dk, sc, er, cl, tc]
        xs = [-5.75, -3.25, -0.55, 1.95, 3.85, 5.75]
        for m, x in zip(objs, xs):
            m.move_to([x, 1.45, 0])
        self.say("교실에서 물체가 어떤 물질로 되어 있는지 찾아봐요",
                 "교실에 있는 물체를 살펴보고, 어떤 물질로 되어 있는지 물질 붙임쪽지를 붙여 봐요.")
        self.play(FadeIn(VGroup(*objs), lag_ratio=0.12), run_time=1.0)
        # (물체, 부분 이름, 물질, 붙임쪽지 자리)
        parts = [("창틀", "플라스틱", win.frame.get_top() + DOWN * 0.05), ("창문 유리", "유리", win.get_center()),
                 ("책상 판", "나무", dk.top.get_center() + UP * 0.28), ("책상 다리", "금속", dk.legs[1].get_center() + RIGHT * 0.45),
                 ("가위 날", "금속", sc.get_right() + LEFT * 0.45 + UP * 0.42), ("가위 손잡이", "플라스틱", sc.handle.get_bottom() + DOWN * 0.3),
                 ("지우개", "고무", er.get_center()), ("집게", "금속", cl.get_center()), ("쓰레기통", "플라스틱", tc.get_center())]
        tags = VGroup()
        for n, m, p in parts:
            tg = K.mat_tag(m, 22).move_to(p).rotate(-0.06)
            tags.add(tg)
        self.say(f"두 가지 이상 물질로 된 물체는 {o('부분마다')} 따로 붙여요",
                 "창문, 책상, 가위처럼 두 가지 이상의 물질로 된 물체는 부분마다 따로 붙임쪽지를 붙여요.")
        self.play(FadeIn(tags, lag_ratio=0.15), run_time=1.8)
        mats = ["금속", "나무", "플라스틱", "유리", "고무"]
        bins = K.material_bins(mats, y=-1.05, w=2.6, h=2.2, gap=0.12, size=30)
        self.say("붙임쪽지를 붙인 부분이 물질별로 모여요", "이제 붙임쪽지를 붙인 부분을 물질별로 모아 볼까요?")
        self.play(FadeIn(bins), run_time=0.6)
        count = {m: 0 for m in mats}
        anims = []
        names = VGroup()
        for (n, m, p), tg in zip(parts, tags):
            k = mats.index(m)
            j = count[m]
            count[m] += 1
            dst = bins[k].box.get_top() + DOWN * (0.85 + 0.42 * j)
            lab = T(n, 26, INK).move_to(dst)
            names.add(lab)
            anims.append(FadeIn(lab, target_position=tg.get_center()))
        self.play(*anims, run_time=1.4)
        self.say(f"같은 물질끼리 모으면 {g('물질의 종류')}로 분류돼요",
                 "금속, 나무, 플라스틱, 유리, 고무처럼 물질의 종류에 따라 물체를 분류할 수 있어요.")
        self.play(*[Indicate(b.title, scale_factor=1.15) for b in bins], run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 여러 물질로 된 물체 ──
    def extinguisher_part(self):
        self.section("탐구해요")
        ex = K.fit(K.extinguisher(), 2.6, 3.5).move_to([-2.8, 0.3, 0])
        P = ex.parts
        self.say(f"소화기는 {o('여러 가지 물질')}로 되어 있어요", "소화기를 살펴볼까요? 소화기는 여러 가지 물질로 되어 있어요.")
        self.play(FadeIn(ex, scale=0.9), run_time=0.7)
        rows = [("몸통·손잡이", "금속", P["body"]), ("호스", "고무", P["hose"]), ("노즐", "플라스틱", P["nozzle"])]
        out = VGroup()
        for i, (n, m, part) in enumerate(rows):
            y = 1.6 - i * 1.15
            t = T(n, 38).move_to([1.6, y, 0])
            tg = K.mat_tag(m, 34).next_to(t, RIGHT, buff=0.4)
            ln = Line(part.get_center(), t.get_left() + LEFT * 0.15, stroke_color=SOFT, stroke_width=3)
            out.add(VGroup(ln, t, tg))
        self.say(f"몸통은 {b_('금속')}, 호스는 {b_('고무')}, 노즐은 {b_('플라스틱')}",
                 "몸통과 손잡이는 금속, 호스는 고무, 노즐은 플라스틱이에요.")
        for grp in out:
            self.play(Create(grp[0]), FadeIn(grp[1]), FadeIn(grp[2]), run_time=0.5)
        note = M(f"가위·창문·책상도 {o('두 가지 이상의 물질')}로 되어 있어요", 36).move_to([0, -2.1, 0])
        self.say(f"물체는 쓰임새에 따라 {o('여러 물질')}로 만들어요",
                 "가위, 창문, 책상처럼 두 가지 이상의 물질로 된 물체도 있어요. 물체는 쓰임새에 따라 여러 물질로 만들어요.")
        self.play(FadeIn(note), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 분류 기준 찾기 ──
    def criterion(self):
        self.section("분류 기준 찾기")
        groups = [("무리 1", [(K.binder_clip, "집게"), (K.paper_clip, "클립")]),
                  ("무리 2", [(K.cutting_board, "나무 도마"), (K.chopsticks, "나무젓가락")]),
                  ("무리 3", [(K.triangle_ruler, "삼각자"), (K.blocks, "장난감 블록")])]
        boxes = VGroup()
        for i, (t, its) in enumerate(groups):
            x = -4.5 + i * 4.5
            bx = RoundedRectangle(corner_radius=0.2, width=4.1, height=3.4, fill_color=PAPER, fill_opacity=1,
                                  stroke_color=SOFT, stroke_width=4).move_to([x, 0.6, 0])
            tt = T(t, 34, INK).move_to([x, 1.95, 0])
            pics = VGroup()
            for j, (f, n) in enumerate(its):
                px = x - 1.0 + j * 2.0
                p = K.fit(f(), 1.5, 1.3).move_to([px, 0.65, 0])
                pics.add(VGroup(p, T(n, 28).move_to([px, -0.45, 0])))
            boxes.add(VGroup(bx, tt, pics))
        self.say("세 무리로 나눈 기준은 무엇일까요?", "물체를 세 무리로 나누었어요. 나눈 기준은 무엇일까요?")
        self.play(FadeIn(boxes, lag_ratio=0.2), run_time=1.2)
        self.pause_screen(5, "세 무리로 나눈 기준은?")
        labs = VGroup(*[K.mat_tag(m, 34).next_to(boxes[i][0], DOWN, buff=0.2) for i, m in enumerate(["금속", "나무", "플라스틱"])])
        self.say(f"무리 1은 {b_('금속')}, 무리 2는 {b_('나무')}, 무리 3은 {b_('플라스틱')}",
                 "무리 1은 금속, 무리 2는 나무, 무리 3은 플라스틱으로 된 물체예요.")
        self.play(FadeIn(labs, lag_ratio=0.25), run_time=1.0)
        self.say(f"기준은 {g('물체를 이루는 물질의 종류')}예요", "분류 기준은 물체의 크기나 가격이 아니라, 물체를 이루는 물질의 종류예요.")
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        mats = ["금속", "고무"]
        bins = K.material_bins(mats, y=-1.1, w=5.4, h=2.5, gap=0.6, size=36)
        items = [(K.nail, "철 못", 0), (K.rubber_glove, "고무장갑", 1), (K.paper_clip, "철 클립", 0), (K.eraser, "지우개", 1)]
        cards = VGroup()
        for i, (f, n, k) in enumerate(items):
            x = -4.8 + i * 3.2
            p = K.fit(f(), 1.3, 1.2).move_to([x, 2.0, 0])
            cards.add(VGroup(p, T(n, 30).next_to(p, DOWN, buff=0.1)))
        self.say("철 못, 고무장갑, 철 클립, 지우개를 물질별로 모아요", "철 못, 고무장갑, 철 클립, 지우개를 물질의 종류에 따라 모아 볼까요?")
        self.play(FadeIn(cards, lag_ratio=0.15), FadeIn(bins), run_time=1.0)
        cnt = [0, 0]
        anims = []
        for i, (f, n, k) in enumerate(items):
            dst = bins[k].box.get_center() + LEFT * 1.3 + RIGHT * 2.6 * cnt[k] + DOWN * 0.2
            cnt[k] += 1
            anims.append(cards[i].animate.scale(0.85).move_to(dst))
        self.play(*anims, run_time=1.3)
        self.say(f"철 못과 철 클립은 {o('금속')}으로 분류할 수 있어요", "철 못과 철 클립은 금속으로, 고무장갑과 지우개는 고무로 분류할 수 있어요.")
        self.play(Indicate(bins[0].title, color=ORANGE, scale_factor=1.2), run_time=0.8)
        self.settle()
        clear_stage(self)
        # 생각+ 고무
        rub = [(K.rubber_glove, "고무장갑"), (K.eraser, "지우개"), (K.slipper, "슬리퍼 바닥"), (K.rubber_band, "고무줄")]
        row = VGroup()
        for i, (f, n) in enumerate(rub):
            x = -4.8 + i * 3.2
            p = K.fit(f(), 1.7, 1.4).move_to([x, 0.8, 0])
            row.add(VGroup(p, T(n, 32).next_to(p, DOWN, buff=0.15)))
        head = M(f"집에 있는 {o('고무')}로 된 물체", 44).move_to([0, 2.5, 0])
        self.say(f"집에서 {o('고무')}로 된 물체를 찾아봐요", "집에 있는 물체 중 고무로 이루어진 것도 찾아볼까요? 고무장갑, 지우개, 슬리퍼 바닥, 고무줄이 있어요.")
        self.play(FadeIn(head), FadeIn(row, lag_ratio=0.2), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        its = [(K.binder_clip, "집게"), (K.pot, "냄비"), (K.pan, "프라이팬")]
        row = VGroup()
        for i, (f, n) in enumerate(its):
            x = -4.0 + i * 4.0
            p = K.fit(f(), 2.2, 1.5).move_to([x, 0.9, 0])
            row.add(VGroup(p, T(n, 36).next_to(p, DOWN, buff=0.2)))
        self.say("집게, 냄비, 프라이팬을 이루는 공통 물질은?", "집게, 냄비, 프라이팬을 공통으로 이루고 있는 물질은 무엇일까요?")
        self.play(FadeIn(row, lag_ratio=0.2), run_time=1.0)
        self.pause_screen(5, "세 물체의 공통 물질은?")
        ans = M(f"모두 단단한 {o('금속')}으로 만들어요", 46).move_to([0, -1.5, 0])
        self.say(f"세 물체 모두 단단한 {o('금속')}으로 만들어요", "세 가지 물체 모두 단단한 금속으로 만들어요.")
        self.play(FadeIn(ans), Circumscribe(row, color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)
