"""「과학 원리 돋보기」 3학년 29화 — 살아 숨 쉬는 갯벌 (3-2 2단원 지구의 모습 8~10차시, 화 코드 3-2-2-f)

바탕: grade3/science/sem2/u2-6.html — 도입(순천만 갯벌 구멍 = 게 같은 생물의 집, 밀물 때 잠기고 썰물 때 드러나는 편평한 땅 = 갯벌,
주로 고운 흙인 펄), 우리나라 갯벌은 서해안과 남해안에 많음, 숨은 생물 8가지(농게·짱뚱어·백합·갯지렁이 / 퉁퉁마디·칠면초 /
검은머리물떼새·저어새)와 설명·무리 나누기, 갯벌의 가치 카드(생물의 집·자연 정화조·철새의 쉼터·홍수 피해 줄이기·먹을거리·체험과 배움),
보충 가상 실험(바지락을 넣은 수조만 맑아짐, 다르게 한 조건 = 바지락, 물을 빨아들여 작은 알갱이를 걸러 먹음 — 앱이 '교과서에 없는 보충 활동'이라고 밝힘),
갯벌 스위치(메우면 생물이 살 곳을 잃고 철새가 떠나고 더러운 물질이 걸러지지 않음, 한번 사라지면 되돌리기 어려움),
갯벌 지킴이 행동, 한눈에 쏙(갯벌 · 보전).
최종: ./make_final.sh s3ep29
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circumscribe, LaggedStart,
                   Rectangle, Transform, SurroundingRectangle, ValueTracker, always_redraw, linear)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u22 as K
from kit_s3u12 import text_card, bin_box, crab, clam, ox_mark


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


def fiddler():
    """농게: 한쪽 집게발이 크고 붉음"""
    c = crab()
    c[1][1].set_fill("#E0402F")
    return c


LIVING = [  # 이름, 그림, 무리, 설명(앱)
    ("농게", fiddler, "동물", "한쪽 집게발이 아주 크고 붉어요"),
    ("짱뚱어", K.mudskipper, "동물", "갯벌 위를 뛰어다니는 물고기"),
    ("백합(조개)", clam, "동물", "흙 속에 숨어 사는 조개"),
    ("갯지렁이", K.lugworm, "동물", "흙 속에 살며 흙 무더기를 만들어요"),
    ("퉁퉁마디", K.pickleweed, "식물", "마디마디가 통통한 풀"),
    ("칠면초", K.seepweed, "식물", "가을이 되면 붉게 물들어요"),
    ("검은머리물떼새", K.oystercatcher, "찾아오는 새", "빨간 부리로 조개를 까 먹어요"),
    ("저어새", K.spoonbill, "찾아오는 새", "주걱 부리를 좌우로 저어요"),
]


class S3Ep29(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 29
    EP_TITLE = "살아 숨 쉬는 갯벌"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.where()
        self.living()
        self.value()
        self.clam_test()
        self.protect()
        self.summary()
        self.closing(f"밀물 때 잠기고 썰물 때 드러나는 편평한 땅은 {o('갯벌')}\n"
                     f"갯벌은 생물과 사람 모두에게 소중하므로 {g('보전')}해야 해요",
                     next_preview="3학년 마인드맵 6 · 지구의 모습")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        flat = K.tidal_flat(-6.6, 6.6, 0.6, -2.45)
        c = K.fit(fiddler(), 1.6, 1.1).move_to([1.2, -0.6, 0])
        hole = K.E(0.5, 0.2, K.MUD_D, 0.0, -1.0, stroke=K.MUD_D, sw=1)
        self.say("갯벌 흙 위의 작은 구멍은 무엇일까요?", "갯벌 흙 위에 작은 구멍이 있어요. 무엇일까요?")
        self.play(FadeIn(flat), FadeIn(hole), run_time=0.6)
        self.pause_screen(4, "작은 구멍은 무엇일까요?")
        self.say(f"게 같은 {o('생물이 사는 집')}이에요", "구멍 옆에 게가 있어요. 갯벌 흙 속에는 게처럼 구멍을 파고 사는 생물이 많아요.")
        self.play(FadeIn(c, shift=RIGHT * 0.4), run_time=0.6)
        self.settle()
        clear_stage(self)
        # 갯벌의 뜻: 밀물 / 썰물
        lv = ValueTracker(1.0)
        shore = K.TideShore(lv)
        pic = shore.group()
        tagm = tag("밀물: 갯벌이 물에 잠겨요", BLUE, 34).move_to([-1.6, 2.45, 0])
        tags_ = tag("썰물: 갯벌이 드러나요", ORANGE, 34).move_to([-1.6, 2.45, 0])
        self.say("지난 시간에 배운 밀물과 썰물을 떠올려 봐요", "지난 시간에 배운 밀물과 썰물을 떠올려 봐요. 밀물일 때는 이 땅이 물에 잠겨요.")
        self.play(FadeIn(pic), FadeIn(tagm), run_time=0.6)
        self.wait(0.8)
        self.play(lv.animate.set_value(0.0), FadeOut(tagm), FadeIn(tags_), run_time=2.5, rate_func=linear)
        word = text_card([f"밀물 때 잠기고 썰물 때 드러나는 편평한 땅 = {o('갯벌')}"], size=34).move_to([0.6, 1.6, 0])
        self.say(f"밀물 때 잠기고 썰물 때 드러나는 편평한 땅 = {o('갯벌')}",
                 "썰물일 때 드러나요. 이렇게 밀물 때 물에 잠기고 썰물 때 드러나는 편평한 땅을 갯벌이라고 해요. 갯벌은 주로 고운 흙인 펄로 되어 있어요.")
        self.play(FadeIn(word, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        shore.stop()
        clear_stage(self)

    # ── 우리나라 갯벌 ──
    def where(self):
        self.section("조사해요")
        west = VGroup(*[tag(n, BLUE, 30) for n in ("강화", "서산", "서천", "고창", "무안", "신안")]).arrange(DOWN, buff=0.15)
        south = VGroup(*[tag(n, ORANGE, 30) for n in ("진도", "보성·순천", "고흥", "여수", "봉암(창원)")]).arrange(DOWN, buff=0.15)
        wt = T("서해", 40, BLUE)
        stt = T("남해", 40, ORANGE)
        et = T("동해", 40, SOFT)
        col1 = VGroup(wt, west).arrange(DOWN, buff=0.25).move_to([-3.6, 0.3, 0])
        col2 = VGroup(stt, south).arrange(DOWN, buff=0.25).move_to([0.2, 0.42, 0])
        col3 = VGroup(et, T("거의 없어요", 32, SOFT)).arrange(DOWN, buff=0.4).move_to([4.0, 1.5, 0])
        self.say("우리나라의 갯벌은 어디에 있을까요?", "우리나라의 대표적인 갯벌은 어디에 있을까요? 갯벌은 어느 바다에 많을까요?")
        self.play(FadeIn(wt), FadeIn(stt), FadeIn(et), run_time=0.5)
        self.say(f"우리나라 갯벌은 {b_('서해안')}과 {o('남해안')}에 많아요",
                 "강화, 서산, 서천, 고창, 무안, 신안, 그리고 진도, 보성과 순천, 고흥, 여수 갯벌처럼 우리나라 갯벌은 서해안과 남해안에 많아요.")
        self.play(LaggedStart(*[FadeIn(t, shift=DOWN * 0.15) for t in [*west, *south]], lag_ratio=0.1), FadeIn(col3[1]), run_time=1.6)
        self.settle()
        clear_stage(self)

    # ── 숨은 생물 ──
    def living(self):
        self.section("갯벌 생물")
        sky = Rectangle(width=13.2, height=1.4, fill_color=K.SKY, fill_opacity=0.6, stroke_width=0).move_to([0, 2.3, 0])
        flat = K.tidal_flat(-6.6, 6.6, 1.6, -2.45)
        pics = {}
        for i, (nm, fn, grp, desc) in enumerate(LIVING):
            p = K.fit(fn(), 1.7, 1.1)
            pics[nm] = p
        place = {"퉁퉁마디": (-5.0, 1.2), "칠면초": (-5.2, -1.3), "농게": (-2.4, 0.4), "짱뚱어": (0.2, -0.6),
                 "백합(조개)": (2.4, 0.7), "갯지렁이": (-1.6, -1.6), "검은머리물떼새": (4.6, 0.9), "저어새": (2.9, -1.4)}
        for nm, (x, y) in place.items():
            pics[nm].move_to([x, y, 0])
        self.say("썰물 때 드러난 갯벌에서 생물을 찾아봐요", "썰물 때 드러난 갯벌이에요. 갯벌에 사는 생물을 찾아봐요. 모두 여덟 가지예요.")
        self.play(FadeIn(sky), FadeIn(flat), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(pics[n], scale=0.6) for n, *_ in LIVING], lag_ratio=0.15), run_time=1.8)
        labels = VGroup(*[T(n, 26, INK).next_to(pics[n], DOWN, buff=0.05) for n, *_ in LIVING])
        self.say("농게·짱뚱어·백합·갯지렁이 / 퉁퉁마디·칠면초 / 검은머리물떼새·저어새",
                 "구멍을 파고 사는 농게, 갯벌 위를 뛰어다니는 물고기 짱뚱어, 흙 속의 조개 백합, 흙 무더기를 만드는 갯지렁이가 있어요.")
        self.play(FadeIn(labels, lag_ratio=0.1), run_time=1.0)
        self.say("통통한 풀 퉁퉁마디, 가을에 붉어지는 칠면초, 그리고 새들",
                 "마디가 통통한 풀 퉁퉁마디와 가을에 붉게 물드는 칠면초도 자라요. 검은머리물떼새와 저어새는 먹이를 먹으러 찾아와요.")
        self.settle()
        clear_stage(self)
        # 무리 나누기
        bins = VGroup(bin_box("동물", 6.2, 4.6, ORANGE, 38).move_to([-3.5, 0.2, 0]),
                      bin_box("식물", 3.0, 4.6, GREEN, 38).move_to([1.4, 0.2, 0]),
                      bin_box("찾아오는 새", 3.2, 4.6, BLUE, 34).move_to([4.9, 0.2, 0]))
        self.say(f"{o('동물')}·{g('식물')}·{b_('찾아오는 새')}로 나누어요",
                 "찾은 생물을 동물, 식물, 찾아오는 새로 나누어 봐요. 갯벌에는 동물과 식물이 함께 살고, 새들도 찾아와요.")
        self.play(FadeIn(bins), run_time=0.5)
        slots = {"동물": [(-5.0, 1.0), (-2.0, 1.0), (-5.0, -0.9), (-2.0, -0.9)], "식물": [(1.4, 1.0), (1.4, -0.9)],
                 "찾아오는 새": [(4.9, 1.0), (4.9, -0.9)]}
        used = {k: 0 for k in slots}
        anims = []
        for nm, fn, grp, desc in LIVING:
            x, y = slots[grp][used[grp]]
            used[grp] += 1
            p = K.fit(fn(), 1.6, 0.95).move_to([x, y + 0.15, 0])
            t = T(nm, 26, INK).next_to(p, DOWN, buff=0.08)
            if t.width > 2.8:
                t.scale_to_fit_width(2.8)
            anims.append(FadeIn(VGroup(p, t), shift=DOWN * 0.2))
        self.play(LaggedStart(*anims, lag_ratio=0.2), run_time=2.0)
        self.settle()
        clear_stage(self)

    # ── 갯벌의 가치 ──
    def value(self):
        self.section("갯벌의 가치")
        cards = [("생물의 집", "게·조개·짱뚱어·갯지렁이 등이 살아요"), ("자연 정화조", "더러운 물질을 걸러 바다를 깨끗하게"),
                 ("철새의 쉼터", "철새가 먹이를 먹고 쉬어 가요"), ("홍수 피해 줄이기", "스펀지처럼 물을 머금어요"),
                 ("먹을거리", "조개 같은 먹을거리를 얻어요"), ("체험과 배움", "자연을 느끼고 배울 수 있어요")]
        grp = VGroup()
        for i, (h, d) in enumerate(cards):
            hh = T(h, 36, ORANGE)
            dd = T(d, 26, INK)
            if dd.width > 3.8:
                dd.scale_to_fit_width(3.8)
            txt = VGroup(hh, dd).arrange(DOWN, buff=0.22)
            box = K.RoundedRectangle(corner_radius=0.2, width=4.1, height=1.7, fill_color=PAPER, fill_opacity=1,
                                     stroke_color=SOFT, stroke_width=4)
            txt.move_to(box)
            c = VGroup(box, txt).move_to([-4.35 + (i % 3) * 4.35, 1.4 - (i // 3) * 2.15, 0])
            grp.add(c)
        self.say(f"{o('생물의 집')}, 더러운 물질을 거르는 {o('자연 정화조')}, {o('철새의 쉼터')}",
                 "갯벌은 왜 소중할까요? 갯벌은 수많은 생물이 사는 집이에요. 육지에서 흘러온 더러운 물질을 걸러 바다를 깨끗하게 하는 자연 정화조이고, 철새가 쉬어 가는 쉼터예요.")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in grp[0:3]], lag_ratio=0.4), run_time=1.2)
        self.say("홍수 피해를 줄이고, 먹을거리와 체험도 줘요",
                 "비가 많이 올 때 스펀지처럼 물을 머금어 홍수 피해를 줄여 주고, 조개 같은 먹을거리와 갯벌 체험도 할 수 있어요.")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in grp[3:]], lag_ratio=0.4), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 보충 가상 실험: 바지락 ──
    def clam_test(self):
        self.section("더 알아보기")
        note = T("교과서에 없는 보충 가상 실험이에요", 28, SOFT).move_to([0, 2.55, 0])
        cl = ValueTracker(1.0)
        t1 = always_redraw(lambda: K.tank(cl.get_value(), True).move_to([-2.8, 0.3, 0]))
        t2 = always_redraw(lambda: K.tank(1.0 - 0.25 * (1 - cl.get_value()), False).move_to([2.8, 0.3, 0]))
        l1 = T("바지락을 넣은 수조", 32, ORANGE).move_to([-2.8, -1.0, 0])
        l2 = T("바지락이 없는 수조", 32, INK).move_to([2.8, -1.0, 0])
        self.say("흐린 바닷물을 두 수조에 똑같이 담고, 한쪽에만 바지락을 넣어요",
                 "흙이 섞여 뿌옇게 흐린 바닷물을 두 수조에 똑같은 양으로 담고, 한쪽 수조에만 갯벌에 사는 바지락을 넣어요.")
        self.play(FadeIn(note), FadeIn(t1), FadeIn(t2), FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.say("시간이 지나면 어느 수조의 물이 더 맑아질까요?", "시간이 지나면 어느 수조의 물이 더 맑아질까요?")
        self.pause_screen(4, "어느 수조가 맑아질까요?")
        self.play(cl.animate.set_value(0.0), run_time=3.0, rate_func=linear)
        t1.clear_updaters()
        t2.clear_updaters()
        self.say(f"{o('바지락을 넣은 수조')}의 물이 훨씬 맑아졌어요",
                 "바지락을 넣은 수조의 물이 훨씬 맑아졌어요. 바지락이 물을 빨아들여 작은 알갱이를 걸러 먹고 깨끗한 물을 내보냈기 때문이에요.")
        self.settle()
        clear_stage(self)

    # ── 갯벌을 지켜요 ──
    def protect(self):
        self.section("갯벌을 지켜요")
        lost = text_card([f"갯벌을 메운다면? (상상)", f"생물이 {r('살 곳을 잃고')}, 철새가 {r('떠나고')},",
                          f"더러운 물질이 {r('걸러지지 않고')} 바다로 흘러가요"], size=34).move_to([0, 1.45, 0])
        self.say("갯벌을 흙으로 메운다면 어떻게 될까요?",
                 "갯벌을 흙으로 메운다면 어떻게 될까요? 생물들이 살 곳을 잃고, 철새가 떠나고, 더러운 물질이 걸러지지 않아요. 갯벌은 한번 사라지면 되돌리기 어려워요.")
        self.play(FadeIn(lost, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        acts = [("쓰레기를 되가져가요", True), ("갯벌 생물을 함부로 잡지 않아요", True),
                ("공장의 더러운 물을 바다로 흘려보내요", False), ("자동차를 타고 갯벌 위를 달려요", False)]
        grp = VGroup()
        for i, (t, ok) in enumerate(acts):
            m = ox_mark(ok, 0.17)
            tt = T(t, 28, INK if ok else SOFT)
            row = VGroup(m, tt).arrange(RIGHT, buff=0.3)
            row.move_to([-4.0, -0.4 - i * 0.55, 0], aligned_edge=LEFT)
            grp.add(row)
        self.say(f"갯벌을 지키는 행동 {g('○')}, 아프게 하는 행동 {r('×')}",
                 "쓰레기를 되가져가고 갯벌 생물을 함부로 잡지 않는 것은 갯벌을 지키는 행동이에요. 더러운 물을 흘려보내거나 자동차로 달리는 것은 갯벌을 아프게 해요.")
        self.play(LaggedStart(*[FadeIn(x, shift=UP * 0.15) for x in grp], lag_ratio=0.3), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = text_card([f"밀물일 때 물에 잠기고 썰물일 때 물 밖으로 드러나는", f"편평한 땅을 {o('갯벌')}이라고 해요.",
                          "갯벌은 여러 생물이 사는 곳이고, 더러운 물질을 걸러 주며,",
                          f"철새의 쉼터가 되기 때문에 {g('보전')}해야 해요."], size=36).move_to([0, 0.4, 0])
        self.say(f"갯벌은 소중하기 때문에 {g('보전')}해야 해요",
                 "정리해요. 갯벌은 여러 생물이 사는 곳이고, 더러운 물질을 걸러 주며, 철새의 쉼터가 되기 때문에 보전해야 해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
