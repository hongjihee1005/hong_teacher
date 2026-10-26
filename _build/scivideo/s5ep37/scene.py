"""「과학 원리 돋보기」 5학년 37화 — 자원을 계속 쓸 수 있을까? (5-2 4단원 자원과 에너지 2차시, 화 코드 5-2-4-a)

바탕: grade5/science/sem2/u4-1.html(원본 _build_tb/src2/u4-1.html) — 도입(물·나무·철 → 자원의 뜻, 언제까지 쓸 수 있을까),
자원의 이용 카드(물 자원 3 · 산림 자원 3 · 광물 자원 3, 산림·광물 자원의 뜻), 자원 조사(믿을 수 있는 출처: 공공 기관·통계 자료,
알맞지 않은 것: 출처를 알 수 없는 글·광고), 계속 이용할 수 있을까(물·산림·광물 자원 설명, 국가통계포털 2024년 기준 철 약 7억 t,
쓰는 양은 점점 늘어남), 정리해요 O/X(재활용하면 끝없이 생겨남 ×, 쓰는 양이 줄어듦 ×), 한눈에 쏙(자원, 한정), 자원을 아껴 써야 하는 까닭.
최종: ./make_final.sh s5ep37
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, VGroup, Arrow

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


WC, FC, MC = K.WATER_C, K.FOREST_C, K.MINERAL_C


class S5Ep37(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 37
    EP_TITLE = "자원을 계속 쓸 수 있을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.sort_cards()
        self.research()
        self.can_we()
        self.ox()
        self.summary()
        self.closing(f"생활이나 생산에 이용하는 원료가 {o('자원')}이에요\n자원은 양이 {g('한정')}되어 있어 아껴 써야 해요",
                     next_preview="5학년 38화 · 재생 에너지가 궁금해!")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        cards = VGroup(K.icard(K.glass_water(), "목이 마를 때\n물을 마셔요", 3.4, 3.1),
                       K.icard(K.book(), "책을 만들 때\n나무를 이용해요", 3.4, 3.1),
                       K.icard(K.car("#2F6FD6", 1.6), "자동차를 만들 때\n철을 이용해요", 3.4, 3.1)).arrange(RIGHT, buff=0.5)
        cards.move_to([0, 0.75, 0])
        self.say("우리는 생활에서 무엇을 이용할까요?",
                 "우리는 생활에서 무엇을 이용할까요? 목이 마를 때는 물을 마시고, 책을 만들 때는 나무를, 자동차를 만들 때는 철을 이용해요.")
        for c in cards:
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.5)
        self.settle()
        words = VGroup(*[T(w, 40, c) for w, c in (("물", WC), ("나무", FC), ("철", MC))])
        for w, c in zip(words, cards):
            w.next_to(c, DOWN, buff=0.22)
        self.say(f"생활하거나 물건을 생산할 때 이용하는 원료 = {o('자원')}",
                 "이렇게 우리가 생활하거나 물건을 생산할 때 이용하는 물, 나무, 철과 같은 원료를 자원이라고 해요.")
        self.play(FadeIn(words, shift=UP * 0.2), run_time=0.6)
        self.settle()
        self.say("지구의 자원은 언제까지 쓸 수 있을까요?",
                 "지구의 자원은 언제까지 쓸 수 있을까요?")
        self.pause_screen(4, "자원은 언제까지 쓸 수 있을까요?")
        clear_stage(self)

    # ── 자원의 이용 카드 ──
    def sort_cards(self):
        self.section("조사해요")
        bins = VGroup(K.res_bin("물 자원", 4.3, 3.35, WC, K.water_drop()),
                      K.res_bin("산림 자원", 4.3, 3.35, FC, K.tree(1.0)),
                      K.res_bin("광물 자원", 4.3, 3.35, MC, K.ore_pic())).arrange(RIGHT, buff=0.2).move_to([0, 1.15, 0])
        self.say("자원의 이용 카드를 세 상자로 나누어 봐요",
                 "자원의 이용 카드를 보고, 어떤 자원을 이용하는지 세 상자로 나누어 봐요.")
        self.play(FadeIn(bins), run_time=0.7)
        self.settle()
        items = [
            ["농사를 지을 때", "설거지·빨래할 때", "목이 마를 때 마셔요"],
            ["숲에서 버섯을 얻어요", "종이컵·휴지를 만들어요", "가구를 만들고 집을 지어요"],
            ["금속으로 스마트 기기를", "석탄으로 에너지를", "석재로 건물을 지어요"],
        ]
        narr = ["농사를 짓고, 설거지나 빨래를 하고, 목이 마를 때 마시는 것은 물 자원이에요.",
                "숲에서 버섯을 얻고, 종이컵과 휴지, 가구를 만들고 집을 짓는 것은 산림 자원이에요.",
                "금속으로 스마트 기기를 만들고, 석탄으로 에너지를 얻고, 석재로 건물을 짓는 것은 광물 자원이에요."]
        subs = [f"농사·설거지·마시는 물 → {o('물 자원')}",
                f"버섯·종이·가구와 집 → {o('산림 자원')}",
                f"금속·석탄·석재 → {o('광물 자원')}"]
        cols = [WC, FC, MC]
        for i in range(3):
            b = bins[i]
            cs = VGroup(*[K.chip_card(t, cols[i], 24, w=3.9, h=0.66) for t in items[i]]).arrange(DOWN, buff=0.16)
            cs.next_to(b.head, DOWN, buff=0.22)
            self.say(subs[i], narr[i])
            self.play(*[FadeIn(c, shift=DOWN * 0.3) for c in cs], run_time=0.7)
            self.settle()
        note = K.text_card([f"{FC_('산림 자원')}: 숲에서 얻는 목재, 약초 같은 쓸모 있는 자원",
                            f"{MC_('광물 자원')}: 땅속 광물 가운데 공업 원료·건설 재료로 쓸 수 있는 것"], w=12.6, size=28)
        note.move_to([0, -1.6, 0])
        self.say("산림 자원은 숲에서, 광물 자원은 땅속에서 얻어요",
                 "산림 자원은 숲에서 얻는 목재, 약초 같은 쓸모 있는 자원이고, 광물 자원은 땅속에 묻힌 광물 가운데 공업 원료나 건설 재료로 쓸 수 있는 것이에요.")
        self.play(FadeIn(note, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 믿을 수 있는 자료로 조사 ──
    def research(self):
        bar = K.chip_card("검색:  물 자원의 쓰임새", INK, 28, w=9.6, h=0.75).move_to([0, 2.45, 0])
        rows = VGroup(K.source_row("국가물관리위원회 누리집 · 우리나라의 물 이용 현황", "공공 기관이 정리한 자료", True),
                      K.source_row("출처를 알 수 없는 글 · 물은 마음껏 써도 절대 안 줄어!", "쓴 사람과 근거가 없어요", False),
                      K.source_row("광고 · 이 물병 하나면 평생 물 걱정 끝!", "물건을 팔려는 광고예요", False)).arrange(DOWN, buff=0.18)
        rows.next_to(bar, DOWN, buff=0.25)
        self.say("자원을 조사할 때는 믿을 수 있는 자료를 골라요",
                 "자원을 검색해 조사할 때는 믿을 수 있는 자료를 먼저 골라요.")
        self.play(FadeIn(bar), FadeIn(rows, shift=UP * 0.2), run_time=0.7)
        self.settle()
        self.say(f"{g('공공 기관·통계 자료')}는 믿을 수 있어요. 광고·근거 없는 글은 ×",
                 "공공 기관이나 나라의 통계 자료는 믿을 수 있어요. 근거 없는 글이나 광고는 조사 자료로 알맞지 않아요.")
        for rw in rows:
            rw.mark.move_to(rw[0].get_right() + LEFT * 0.55)
        self.play(*[Create(rw.mark) for rw in rows], run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 계속 이용할 수 있을까? ──
    def can_we(self):
        self.section("계속 쓸 수 있을까?")
        self.say("물, 산림, 광물 자원을 계속 이용할 수 있을까요?",
                 "물 자원, 산림 자원, 광물 자원을 계속 이용할 수 있을까요?")
        self.pause_screen(5, "자원을 계속 이용할 수 있을까요?")
        # 물
        dirty = K.fit(K.dirty_water(), 1.5, 1.6).move_to([-3.6, 0.9, 0])
        clean = K.fit(K.glass_water(), 1.5, 1.6).move_to([3.6, 0.9, 0])
        arr = K.arrow_lr(-2.4, 2.4, 0.9, SOFT, 8)
        lab = T("다시 쓸 수 있게 되려면 오랜 시간", 30, RED).next_to(arr, UP, buff=0.12)
        head = T("물 자원", 40, WC).move_to([0, 2.5, 0])
        self.say(f"물: 오염된 물은 다시 쓰기까지 {r('오랜 시간')} → 쓸 수 있는 물이 부족해져요",
                 "물의 양은 줄지 않지만, 오염된 물이 다시 쓸 수 있게 되려면 오랜 시간이 걸려요. 그래서 쓸 수 있는 물은 점점 부족해져요.")
        self.play(FadeIn(head), FadeIn(dirty), run_time=0.5)
        self.play(GrowArrow(arr), FadeIn(lab), FadeIn(clean), run_time=0.9)
        self.settle()
        clear_stage(self)
        # 산림
        head = T("산림 자원", 40, FC).move_to([0, 2.5, 0])
        fr = K.forest(6, 4.6, 1.3, seed=2).move_to([-3.4, 0.7, 0])
        stumps = VGroup(*[K.stump(1.3).move_to([x, 0.25, 0], aligned_edge=DOWN) for x in (2.0, 2.8, 3.6, 4.4)])
        stumps.move_to([3.2, 0.4, 0])
        arr = K.arrow_lr(-0.9, 0.9, 0.7, SOFT, 8)
        self.say(f"산림: 많이 베면 줄어들고, 다시 자라는 데 {r('오랜 시간')}",
                 "나무를 많이 베거나 숲을 농경지로 만들면 산림 자원은 줄어들어요. 다시 자라는 데 오랜 시간이 걸려요.")
        self.play(FadeIn(head), FadeIn(fr), run_time=0.5)
        self.play(GrowArrow(arr), FadeIn(stumps), run_time=0.8)
        self.settle()
        clear_stage(self)
        # 광물
        head = T("광물 자원", 40, MC).move_to([0, 2.5, 0])
        ore = K.fit(K.ore_pic(), 2.2, 1.4).move_to([-3.3, 1.0, 0])
        iron = K.fit(K.iron_bar(), 2.2, 1.2).move_to([3.3, 1.0, 0])
        arr = K.arrow_lr(-1.6, 1.6, 1.0, SOFT, 8)
        cap = T("한번 쓰면 다시 만들어지기 어려워요", 32, RED).move_to([0, -0.1, 0])
        self.say(f"광물: 한번 쓰고 나면 {r('다시 만들어지기 어려워요')}",
                 "금속, 석탄 같은 광물 자원은 한번 쓰고 나면 다시 만들어지기 어려워요.")
        self.play(FadeIn(head), FadeIn(ore), run_time=0.5)
        self.play(GrowArrow(arr), FadeIn(iron), FadeIn(cap), run_time=0.8)
        self.settle()
        stat = K.text_card([f"우리나라에 남아 있는 철: 약 {o('7억 t')}",
                            "(국가통계포털, 2024년 기준 · 「과학」 89쪽)"], w=9.4, size=30).move_to([0, -1.5, 0])
        self.say(f"우리나라에 남은 철은 약 {o('7억 t')} — 계속 캐내면 언젠가 줄어요",
                 "국가통계포털에 따르면 2024년 기준 우리나라에 남은 철은 약 7억 톤이에요. 커 보여도 계속 캐내어 쓰면 언젠가는 줄어들어요.")
        self.play(FadeIn(stat, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        # 쓰는 양은 늘어남
        kids = VGroup(*[K.kid(c) for c in ("#2F6FD6", "#E0703A", "#2E9E5B", "#B5408F", "#C99400")]).arrange(RIGHT, buff=0.05)
        K.fit(kids, 6.2, 2.4).move_to([-3.4, 0.8, 0])
        up = Arrow([0.4, -0.6, 0], [2.6, 2.3, 0], buff=0, stroke_color=RED, stroke_width=12, max_tip_length_to_length_ratio=0.18)
        lab = K.lines("자원을 쓰는 양\n점점 늘어나요", 34, RED).move_to([4.7, 0.9, 0])
        self.say(f"인구가 늘고 편리하게 생활하려고 자원을 쓰는 양은 {r('점점 늘어나요')}",
                 "게다가 인구가 늘어나고 더 편리하게 생활하려고, 자원을 쓰는 양은 점점 늘어나고 있어요.")
        self.play(FadeIn(kids, lag_ratio=0.2), run_time=0.8)
        self.play(GrowArrow(up), FadeIn(lab), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기(정리해요 O/X) ──
    def ox(self):
        self.section("생각 바로잡기")
        rows = [("재활용을 하면 자원은 끝없이 생겨나요.", False),
                ("자원을 쓰는 양은 해마다 점점 줄어들고 있어요.", False)]
        cards = VGroup(*[K.chip_card(t, INK, 32, w=11.0, h=0.95) for t, _ in rows]).arrange(DOWN, buff=0.45).move_to([-0.5, 1.0, 0])
        self.say("맞을까요, 틀릴까요?",
                 "다음 두 문장은 맞을까요, 틀릴까요?")
        self.play(FadeIn(cards, shift=UP * 0.2), run_time=0.6)
        self.settle()
        self.pause_screen(4, "맞을까요, 틀릴까요?")
        marks = VGroup(*[K.ox_mark(False, 0.3).next_to(c, RIGHT, buff=0.3) for c in cards])
        self.say(f"둘 다 {r('틀려요')}! 재활용해도 자원이 새로 생기지 않아요",
                 "둘 다 틀려요. 재활용을 해도 자원이 끝없이 생겨나지는 않고, 자원을 쓰는 양은 점점 늘어나고 있어요.")
        self.play(Create(marks), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 + 우리가 할 수 있는 일 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"생활하거나 물건을 생산할 때 이용하는 원료를 {o('자원')}이라고 합니다.",
                            f"물·산림·광물 자원은 다시 만들어지는 데 오랜 시간이 걸리고,",
                            f"양이 {g('한정')}되어 있습니다."], w=12.6, size=34).move_to([0, 0.8, 0])
        self.say(f"자원은 다시 만들어지는 데 오래 걸리고, 양이 {g('한정')}되어 있어요",
                 "우리가 생활하거나 물건을 생산할 때 이용하는 원료를 자원이라고 해요. 물 자원, 산림 자원, 광물 자원은 다시 만들어지는 데 오랜 시간이 걸리고, 양이 한정되어 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)
        self.section("우리가 할 수 있는 일")
        tips = VGroup(K.icard(K.glass_water(), "물 자원\n아껴 쓰기", 3.4, 3.0),
                      K.icard(K.tree(1.2), "산림 자원\n아껴 쓰기", 3.4, 3.0),
                      K.icard(K.ore_pic(), "광물 자원\n아껴 쓰기", 3.4, 3.0)).arrange(RIGHT, buff=0.45).move_to([0, 0.8, 0])
        self.say(f"자원을 소중히 여기고 {g('아껴 써요')}",
                 "자원은 함부로 계속 쓰면 부족해질 수 있어요. 우리 생활에 꼭 필요한 자원을 소중히 여기고 아껴 써요.")
        self.play(FadeIn(tips, lag_ratio=0.25), run_time=1.2)
        self.settle()
        clear_stage(self)


def FC_(s):
    return f'<span foreground="{FC}">{s}</span>'


def MC_(s):
    return f'<span foreground="{MC}">{s}</span>'
