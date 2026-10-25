"""「과학 원리 돋보기」 3학년 20화 — 물체와 물질은 무엇이 다를까? (3-2 1단원 물질의 성질 2차시, 화 코드 3-2-1-a)

바탕: grade3/science/sem2/u1-1.html — 도입(유리 어항을 나무로 만들면), 물체와 물질 구별(캔·주걱·블록·주전자),
가상 실험실(나무·철·유리·플라스틱 막대: 투명한 정도·사포로 5번 긁기·물에 뜨는지), 결과 정리,
(다른 탐구(고무·나무·철 막대)는 길이 때문에 뺌)
물질 도감(금속·나무·플라스틱·유리·고무), 생각 바로잡기 OX, 한눈에 쏙, 형성 평가(망치·집게 / 장난감·바구니, 서술형 망치).
최종: ./make_final.sh s3ep20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Create, FadeIn, FadeOut, Indicate, Line, Rectangle, VGroup,
                   RoundedRectangle, Rotate, Arrow, ArcBetweenPoints, Transform)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


RODS = ["wood", "iron", "glass", "plastic"]


class S3Ep20(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 20
    EP_TITLE = "물체와 물질은 무엇이 다를까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.fishbowl_q()
        self.object_material()
        self.lab()
        self.summary()
        self.check()
        self.closing(f"물체를 이루는 재료를 {o('물질')}이라고 하고,\n"
                     f"물질마다 {g('성질이 서로 달라요')}",
                     next_preview="3학년 21화 · 같은 물질로 된 물체를 찾아라")
        self.wait(0.5)

    # ── 궁금해요 ──
    def fishbowl_q(self):
        self.section("궁금해요")
        a = K.fit(K.fishbowl(), 2.8, 2.2).move_to([-3.2, 0.6, 0])
        la = T("유리 어항", 36).next_to(a, DOWN, buff=0.25)
        self.say("유리로 만든 어항이에요", "유리로 만든 어항이에요. 안에 있는 물고기가 잘 보여요.")
        self.play(FadeIn(a, scale=0.9), FadeIn(la), run_time=0.7)
        b = K.fit(K.fishbowl(wood=True), 2.8, 2.0).move_to([3.2, 0.6, 0])
        lb = T("나무 어항?", 36).next_to(b, DOWN, buff=0.25)
        self.say(f"어항을 {o('나무')}로 만들면 어떤 점이 불편할까요?", "그런데 어항을 나무로 만든다면 어떤 점이 불편할까요?")
        self.play(FadeIn(b, scale=0.9), FadeIn(lb), run_time=0.7)
        self.pause_screen(5, "나무 어항은 무엇이 불편할까요?")
        p1 = M(f"{r('안이 보이지 않아요')}", 38).move_to([3.2, -1.5, 0])
        p2 = M(f"{r('물에 젖어 썩을 수 있어요')}", 38).move_to([3.2, -2.15, 0])
        self.say(f"안이 {r('보이지 않고')}, 오래 쓰면 {r('젖어 썩을 수')} 있어요",
                 "나무 어항은 안이 보이지 않아요. 또 오래 쓰면 물에 젖어 썩을 수 있어요.")
        self.play(FadeIn(p1), run_time=0.4)
        self.play(FadeIn(p2), run_time=0.4)
        self.say(f"그래서 어항은 {g('투명하고 물에 젖지 않는 유리')}로 만들어요",
                 "그래서 어항은 안이 보이고 물에 젖지 않는 유리로 만들어요. 물체마다 알맞은 재료가 있어요.")
        self.play(Indicate(VGroup(a, la), color=GREEN, scale_factor=1.06), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 물체와 물질 ──
    def object_material(self):
        self.section("물체와 물질")
        d1 = M(f"{o('물체')}: 쓰임새와 모양이 있는 것", 42).move_to([0, 2.55, 0])
        d2 = M(f"{b_('물질')}: 물체를 만드는 재료", 42).move_to([0, 1.85, 0])
        self.say(f"{o('물체')}는 쓰임새와 모양이 있는 것이에요", "물체는 쓰임새와 모양이 있는 것이에요.")
        self.play(FadeIn(d1), run_time=0.5)
        self.say(f"{b_('물질')}은 물체를 만드는 재료예요", "물질은 그 물체를 만드는 재료예요.")
        self.play(FadeIn(d2), run_time=0.5)
        items = [("캔", K.can, "금속"), ("주걱", K.spatula, "나무"), ("블록", K.blocks, "플라스틱"), ("주전자", K.glass_teapot, "유리")]
        grp = VGroup()
        for i, (n, f, m) in enumerate(items):
            x = -5.1 + i * 3.4
            pic = K.fit(f(), 1.8, 1.45).move_to([x, 0.35, 0])
            on = M(f"물체: {o(n)}", 34).move_to([x, -0.75, 0])
            mt = M(f"물질: {b_(m)}", 34).move_to([x, -1.4, 0])
            grp.add(VGroup(pic, on, mt))
        self.say(f"캔은 {b_('금속')}, 주걱은 {b_('나무')}로 만들었어요",
                 "통조림 캔이라는 물체는 금속이라는 물질로, 주걱은 나무로 만들었어요.")
        for k in (0, 1):
            self.play(FadeIn(grp[k][0], scale=0.85), FadeIn(grp[k][1]), run_time=0.45)
            self.play(FadeIn(grp[k][2], shift=UP * 0.2), run_time=0.35)
        self.say(f"블록은 {b_('플라스틱')}, 주전자는 {b_('유리')}로 만들었어요",
                 "장난감 블록은 플라스틱으로, 주전자는 유리로 만들었어요.")
        for k in (2, 3):
            self.play(FadeIn(grp[k][0], scale=0.85), FadeIn(grp[k][1]), run_time=0.45)
            self.play(FadeIn(grp[k][2], shift=UP * 0.2), run_time=0.35)
        self.settle()
        clear_stage(self)

    # ── 가상 실험실 ──
    def rods_row(self, y=1.9):
        g_ = VGroup()
        for i, k in enumerate(RODS):
            x = -5.1 + i * 3.4
            rd = K.rod(k, 2.4, 0.42).move_to([x, y, 0])
            g_.add(VGroup(rd, T(K.ROD_NAME[k], 32).next_to(rd, DOWN, buff=0.15)))
        return g_

    def lab(self):
        self.section("실험해요")
        rows = self.rods_row(1.0)
        self.say(f"모양과 크기는 같고 {o('물질만 다른')} 막대 네 개", "나무, 철, 유리, 플라스틱 막대예요. 모양과 크기는 같고 물질만 달라요. 세 가지 실험으로 비교해 봐요.")
        self.play(FadeIn(rows, lag_ratio=0.2), run_time=1.2)
        self.settle()
        self.play(FadeOut(rows), run_time=0.4)
        res = {}
        # ① 투명한 정도
        title = M(f"① 글씨가 있는 종이 위에 막대 올리기", 38).move_to([0, 2.6, 0])
        self.play(FadeIn(title), run_time=0.4)
        papers, rods = VGroup(), VGroup()
        for i, k in enumerate(RODS):
            x = -5.1 + i * 3.4
            pp = K.text_paper(2.9, 1.1).move_to([x, 0.6, 0])
            rd = K.rod(k, 2.5, 0.75).move_to([x, 2.0, 0])
            papers.add(pp)
            rods.add(rd)
        names = VGroup(*[T(K.ROD_NAME[k], 32).move_to([-5.1 + i * 3.4, -0.3, 0]) for i, k in enumerate(RODS)])
        self.say("종이 위에 막대를 올리면 글씨가 보일까요?", "글씨가 있는 종이 위에 막대를 올리면 글씨가 보일까요?")
        self.play(FadeIn(papers), FadeIn(names), run_time=0.5)
        self.play(*[rd.animate.move_to(pp.get_center()) for rd, pp in zip(rods, papers)], run_time=1.0)
        self.add(papers[2][1])  # 유리 막대 위로 글씨가 비쳐 보이게
        self.pause_screen(5, "글씨가 보이는 막대는?")
        self.say(f"{o('유리')} 막대만 글씨가 보여요 — {g('투명해요')}", "유리 막대만 아래 글씨가 보여요. 유리는 투명해요. 나머지 막대는 투명하지 않아요.")
        ring = RoundedRectangle(corner_radius=0.2, width=3.1, height=1.25, stroke_color=GREEN, stroke_width=8).move_to(papers[2])
        self.play(Create(ring), run_time=0.6)
        self.settle()
        self.play(FadeOut(VGroup(papers, rods, names, ring, title)), run_time=0.5)
        # ② 사포로 긁기
        title = M(f"② 사포로 같은 힘으로 {o('5번')} 긁기", 38).move_to([0, 2.6, 0])
        self.play(FadeIn(title), run_time=0.4)
        rods = VGroup(*[K.rod(k, 2.6, 0.75).move_to([-5.1 + i * 3.4, 0.9, 0]) for i, k in enumerate(RODS)])
        names = VGroup(*[T(K.ROD_NAME[k], 32).next_to(rods[i], DOWN, buff=0.3) for i, k in enumerate(RODS)])
        self.say("사포로 막대 표면을 같은 힘으로 5번 긁어요", "사포로 막대의 표면을 같은 힘으로 같은 횟수, 5번씩 긁어요.")
        self.play(FadeIn(rods), FadeIn(names), run_time=0.5)
        sps = VGroup(*[K.sandpaper(0.8, 0.55).move_to(rd.get_left() + RIGHT * 0.5 + UP * 0.1) for rd in rods])
        self.play(FadeIn(sps), run_time=0.3)
        for n in range(2):
            self.play(*[sp.animate.shift(RIGHT * 1.6) for sp in sps], run_time=0.35)
            self.play(*[sp.animate.shift(LEFT * 1.6) for sp in sps], run_time=0.35)
        self.play(FadeOut(sps), run_time=0.3)
        self.pause_screen(5, "긁히지 않는 막대는?")
        rng = np.random.default_rng(7)
        scr = VGroup()
        for i, k in enumerate(RODS):
            if k == "iron":
                continue
            c = K.WOOD_D if k == "wood" else PAPER
            for _ in range(5):
                x0 = rods[i].get_center()[0] + rng.uniform(-1.1, 0.5)
                y0 = rods[i].get_center()[1] + rng.uniform(-0.25, 0.25)
                scr.add(Line([x0, y0, 0], [x0 + rng.uniform(0.4, 0.7), y0 + rng.uniform(-0.04, 0.04), 0], stroke_color=c, stroke_width=3))
        self.say(f"나무·유리·플라스틱은 {r('긁힌 자국')}이 생겼어요", "나무, 유리, 플라스틱 막대에는 긁힌 자국이 생겼어요.")
        self.play(Create(scr, lag_ratio=0.05), run_time=1.0)
        ring = RoundedRectangle(corner_radius=0.2, width=3.0, height=1.1, stroke_color=GREEN, stroke_width=8).move_to(rods[1])
        self.say(f"{o('철')} 막대는 긁히지 않아요 — {g('단단해요')}", "철 막대는 긁히지 않았어요. 금속인 철은 단단해요.")
        self.play(Create(ring), run_time=0.6)
        self.settle()
        self.play(FadeOut(VGroup(rods, names, scr, ring, title)), run_time=0.5)
        # ③ 물에 넣기
        title = M(f"③ 물이 든 수조에 막대 넣기", 38).move_to([0, 2.6, 0])
        self.play(FadeIn(title), run_time=0.4)
        tanks, rods, names = VGroup(), VGroup(), VGroup()
        for i, k in enumerate(RODS):
            x = -5.1 + i * 3.4
            tk = K.tank(2.9, 2.3, 0.62).move_to([x, -0.6, 0])
            tanks.add(tk)
            rods.add(K.rod(k, 2.0, 0.32).move_to([x, 1.75, 0]))
            names.add(T(K.ROD_NAME[k], 32).next_to(tk, DOWN, buff=0.15))
        self.say("물에 넣으면 뜰까요, 가라앉을까요?", "이번에는 막대를 물이 든 수조에 천천히 넣어요. 뜰까요, 가라앉을까요?")
        self.play(FadeIn(tanks), FadeIn(names), FadeIn(rods), run_time=0.6)
        self.pause_screen(5, "물에 뜨는 막대는?")
        moves = []
        for i, k in enumerate(RODS):
            surf = tanks[i].water.get_top()[1]
            if k in ("wood", "plastic"):
                moves.append(rods[i].animate.move_to([rods[i].get_center()[0], surf - 0.05, 0]))
            else:
                moves.append(rods[i].animate.move_to([rods[i].get_center()[0], tanks[i].get_bottom()[1] + 0.22, 0]))
        self.say(f"{g('나무·플라스틱')}은 물에 뜨고, {o('철·유리')}는 가라앉아요",
                 "나무와 플라스틱 막대는 물에 뜨고, 철과 유리 막대는 물속으로 가라앉아요.")
        self.play(*moves, run_time=1.4)
        self.settle()
        self.play(FadeOut(VGroup(tanks, rods, names, title)), run_time=0.5)
        # 결과표
        self.table()

    def table(self):
        heads = ["", "나무", "철", "유리", "플라스틱"]
        data = [("투명한가?", ["×", "×", "○", "×"]),
                ("잘 긁히는가?", ["○", "×", "○", "○"]),
                ("물에 뜨는가?", ["○", "×", "×", "○"])]
        cw = [3.2, 2.0, 2.0, 2.0, 2.4]
        x0 = -sum(cw) / 2
        y0, rh = 2.3, 0.9
        grp = VGroup()
        for j, h in enumerate(heads):
            x = x0 + sum(cw[:j]) + cw[j] / 2
            grp.add(T(h, 34, INK).move_to([x, y0, 0]))
        for i, (q, vals) in enumerate(data):
            y = y0 - (i + 1) * rh
            grp.add(Line([x0, y + rh / 2, 0], [x0 + sum(cw), y + rh / 2, 0], stroke_color=SOFT, stroke_width=3))
            grp.add(T(q, 32, INK).move_to([x0 + cw[0] / 2, y, 0]))
            for j, v in enumerate(vals):
                x = x0 + sum(cw[:j + 1]) + cw[j + 1] / 2
                grp.add(T(v, 44, GREEN if v == "○" else RED).move_to([x, y, 0]))
        self.say("실험 결과를 표로 정리해요", "세 가지 실험의 결과를 표로 정리해 볼까요?")
        self.play(FadeIn(grp, lag_ratio=0.03), run_time=1.4)
        msg = M(f"모양이 같아도 {g('물질마다 성질이 서로 달라요')}", 42).move_to([0, -1.75, 0])
        self.say(f"모양과 크기가 같아도 {g('물질마다 성질이 달라요')}",
                 "막대의 모양과 크기가 같아도, 물질마다 성질이 서로 달라요.")
        self.play(FadeIn(msg), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        cards = [("금속", K.hammer, ["광택이 있고", "단단해요"]),
                 ("나무", K.cutting_board, ["향과 무늬가 있고", "대부분 물에 떠요"]),
                 ("플라스틱", K.toy_car, ["가볍고 색깔·모양을", "다양하게 만들어요"]),
                 ("유리", lambda: K.drink_glass(K.GLASS, 0.0), ["투명하지만", "깨지기 쉬워요"]),
                 ("고무", K.rubber_band, ["늘어났다가", "원래대로 돌아와요"])]
        grp = VGroup()
        for i, (m, f, lines) in enumerate(cards):
            x = -5.6 + i * 2.8
            box = RoundedRectangle(corner_radius=0.2, width=2.6, height=3.6, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=K.MAT_EDGE[m], stroke_width=5).move_to([x, 0.75, 0])
            tag = K.mat_tag(m, 32).move_to([x, 2.25, 0])
            pic = K.fit(f(), 1.6, 1.15).move_to([x, 1.05, 0])
            tx = VGroup(*[T(l, 24, INK) for l in lines]).arrange(DOWN, buff=0.1).move_to([x, -0.35, 0])
            if tx.width > 2.4:
                tx.scale_to_fit_width(2.4)
            grp.add(VGroup(box, tag, pic, tx))
        self.say("우리 주변의 여러 가지 물질과 그 성질", "우리 주변의 여러 가지 물질과 그 성질을 알아봐요.")
        self.play(FadeIn(grp, lag_ratio=0.15), run_time=1.6)
        self.say(f"금속은 {o('단단해서')} 망치를, 유리는 {o('투명해서')} 창문을 만들어요",
                 "금속은 단단해서 망치나 다리를 만들고, 유리는 투명해서 컵이나 창문을 만들어요.")
        self.play(Indicate(grp[0], color=ORANGE, scale_factor=1.05), Indicate(grp[3], color=ORANGE, scale_factor=1.05), run_time=1.0)
        self.say(f"물체를 이루는 재료를 {o('물질')}이라 하고, {g('성질이 다양해요')}",
                 "물체를 이루는 재료를 물질이라고 하고, 물질마다 성질이 다양해요.")
        self.settle()
        clear_stage(self)
        # 생각 바로잡기
        self.section("생각 바로잡기")
        q1 = M(f"“투명한 것은 모두 유리예요.”  {r('×')}", 46).move_to([0, 1.8, 0])
        a1 = T("투명한 플라스틱도 있어요", 38, GREEN).move_to([0, 1.0, 0])
        q2 = M(f"“플라스틱은 모두 물에 떠요.”  {r('×')}", 46).move_to([0, -0.2, 0])
        a2 = T("물에 가라앉는 플라스틱도 많아요", 38, GREEN).move_to([0, -1.0, 0])
        self.say(f"투명한 것은 모두 유리일까요? {r('아니에요')}",
                 "투명한 것은 모두 유리일까요? 아니에요. 투명한 플라스틱도 있어요.")
        self.play(FadeIn(q1), run_time=0.5)
        self.play(FadeIn(a1), run_time=0.5)
        self.say(f"플라스틱은 모두 물에 뜰까요? {r('아니에요')}",
                 "플라스틱은 모두 물에 뜰까요? 아니에요. 물에 가라앉는 플라스틱도 많아요.")
        self.play(FadeIn(q2), run_time=0.5)
        self.play(FadeIn(a2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        h = K.fit(K.hammer(), 2.0, 2.2).move_to([-2.0, 0.7, 0])
        c = K.fit(K.binder_clip(), 1.5, 1.6).move_to([1.5, 0.7, 0])
        lab = T("㈎ 망치·집게", 38).move_to([-0.25, -0.8, 0])
        self.say("㈎ 망치와 집게는 어떤 물질로 만들었을까요?", "망치와 집게는 어떤 물질로 만들었을까요? 금속으로 망치를 만들면 어떤 점이 좋을까요?")
        self.play(FadeIn(h), FadeIn(c), FadeIn(lab), run_time=0.6)
        self.pause_screen(5, "망치를 금속으로 만들면 좋은 점은?")
        ans = M(f"{o('금속')}은 {g('단단해서')} 잘 부러지지 않아요 → 못을 박을 수 있어요", 38).move_to([0, -1.7, 0])
        self.say(f"{o('금속')}은 {g('단단해서')} 못을 박아도 잘 부러지지 않아요",
                 "망치와 집게는 금속으로 만들었어요. 금속은 단단해서 못을 박아도 잘 부러지지 않아요.")
        self.play(FadeIn(ans), run_time=0.6)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'
