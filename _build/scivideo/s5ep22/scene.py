"""「과학 원리 돋보기」 5학년 22화 — 혼합물을 왜 분리할까? (5-2 1단원 혼합물의 분리 2차시, 화 코드 5-2-1-a)

바탕: grade5/science/sem2/u1-1.html(원본 _build_tb/src2/u1-1.html) — 도입(재활용품 5개 분리배출: 플라스틱·캔·고철·종이·유리병 →
필요한 물질을 얻고 다시 써서 환경오염을 줄임), 혼합물의 뜻(앱 문장 그대로)·한 가지 물질/혼합물 나누기 10장,
활동해요 2(바닷물→소금, 금광석→금, 고무나무→천연고무액, 사탕수수→설탕), 정리(분리하는 까닭)·생각 바로잡기(소금의 성질 그대로),
얻은 물질 이용(설탕·콩 단백질·목화솜·천연고무액), 더 알아보기(도리깨·풍구·키), 한눈에 쏙(혼합물).
최종: ./make_final.sh s5ep22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, FadeIn, FadeOut, Indicate, VGroup)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep22(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 22
    EP_TITLE = "혼합물을 왜 분리할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.what()
        self.sort()
        self.get()
        self.why()
        self.use()
        self.old()
        self.summary()
        self.closing(f"두 가지 이상의 물질이 성질이 변하지 않은 채\n섞여 있는 것이 {o('혼합물')}, 분리하면 {g('필요한 물질')}을 얻어요",
                     next_preview="5학년 23화 · 알갱이 크기가 다른 고체 혼합물")
        self.wait(0.5)

    # ── 궁금해요: 분리배출 ──
    def intro(self):
        self.section("궁금해요")
        kinds = ["pet", "can", "box", "glass", "cup"]
        names = ["페트병", "음료 캔", "종이 상자", "유리병", "플라스틱 컵"]
        dest = [0, 1, 2, 3, 0]
        items = VGroup()
        for i, (k, n) in enumerate(zip(kinds, names)):
            it = VGroup(K.recycle_item(k, 0.9), T(n, 26))
            it[1].next_to(it[0], DOWN, buff=0.12)
            it.move_to([-5.0 + 2.5 * i, 1.75, 0])
            items.add(it)
        bins = VGroup(*[K.recycle_bin(n, c, 2.4) for n, c in
                        (("플라스틱", "#3D8BD4"), ("캔·고철", "#8A96A3"), ("종이", "#C98B4F"), ("유리병", "#3FA36B"))])
        bins.arrange(RIGHT, buff=0.55).move_to([0, -1.35, 0])
        self.say("재활용품을 분리배출하면 무엇이 좋을까요?",
                 "다 쓴 재활용품을 분리배출해 본 적이 있나요? 재활용품을 분리배출하면 무엇이 좋을까요?")
        self.play(FadeIn(items, lag_ratio=0.1), FadeIn(bins), run_time=1.0)
        self.say("플라스틱, 철, 종이, 유리처럼 물질별로 나누어요",
                 "페트병과 플라스틱 컵은 플라스틱, 음료 캔은 캔·고철, 종이 상자는 종이, 유리병은 유리병 통에 넣어요. 플라스틱, 철, 종이, 유리처럼 물질별로 나누었어요.")
        cnt = [0, 0, 0, 0]
        mv = []
        for it, d in zip(items, dest):
            x = bins[d].get_center()[0] + (cnt[d] - 0.5 * (dest.count(d) - 1)) * 0.55
            cnt[d] += 1
            mv.append(it.animate.scale(0.5).move_to([x, -0.1, 0]))
        self.play(*mv, run_time=1.6, lag_ratio=0.15)
        res = K.text_card([f"{o('필요한 물질')}을 얻을 수 있어요", f"다시 써서 {g('환경오염을 줄일')} 수 있어요"],
                          size=34).move_to([0, 2.0, 0])
        self.say(f"필요한 물질을 얻고, 다시 써서 {g('환경오염을 줄여요')}",
                 "물질별로 분리배출하면 필요한 물질을 얻을 수 있고, 다시 사용해서 환경오염을 줄일 수 있어요.")
        self.play(FadeOut(items), FadeIn(res, shift=DOWN * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 혼합물이란? ──
    def what(self):
        self.section("혼합물이란?")
        card = K.text_card([f"두 가지 이상의 물질이 {o('각각의 성질이 변하지 않은 채')}",
                            f"섞여 있는 것을 {g('혼합물')}이라고 해요."], w=12.0, size=40).move_to([0, 1.9, 0])
        self.say(f"두 가지 이상의 물질이 섞여 있는 것 → {g('혼합물')}",
                 "두 가지 이상의 물질이 각각의 성질이 변하지 않은 채 섞여 있는 것을 혼합물이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        pics = VGroup(K.pic_card(K.sea_pic(), "소금물·바닷물", 2.9, 2.2),
                      K.pic_card(VGroup(*[K.Dot([0.9 * K.rnd(i, 1) - 0.45, 0.6 * K.rnd(i, 2) - 0.3, 0], radius=0.05,
                                                color=["#6EC3F0", "#F08A24", "#9C88FF"][i % 3]) for i in range(30)]),
                                 "공기", 2.9, 2.2),
                      K.pic_card(K.cane_pic(), "사탕수수", 2.9, 2.2))
        pics.arrange(RIGHT, buff=0.4).move_to([0, -0.85, 0])
        self.say(f"소금물, 설탕물 같은 {o('용액')}이나 공기, 사탕수수도 혼합물이에요",
                 "혼합물의 예에는 소금물, 설탕물과 같은 용액이나 공기, 사탕수수 등이 있어요. 용해와 용액에서 배운 용액도 용질과 용매가 골고루 섞여 있는 혼합물이에요.")
        self.play(FadeIn(pics, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 한 가지 물질과 혼합물 나누기 ──
    def sort(self):
        self.section("나누어 봐요")
        items = [("소금물", 1), ("금관", 0), ("공기", 1), ("산소", 0), ("탄산음료", 1),
                 ("못", 0), ("유성 물감", 1), ("얼음", 0), ("반짝이 풀", 1), ("바닷가 흙", 1)]
        cards = VGroup(*[K.word_card(t, 2.4, 0.78, INK, 28) for t, _ in items])
        cards.arrange_in_grid(rows=2, cols=5, buff=(0.22, 0.2)).move_to([0, 2.0, 0])
        self.say("한 가지 물질일까요, 혼합물일까요?",
                 "한 가지 물질로만 이루어져 있는지, 두 가지 이상의 물질이 섞여 있는지 나누어 볼까요?")
        self.play(FadeIn(cards, lag_ratio=0.06), run_time=1.0)
        self.pause_screen(5, "어느 것이 혼합물일까요?")
        bins = VGroup(K.bin_box("한 가지 물질", 5.2, 2.9, "#2F6FD6", 32), K.bin_box("혼합물", 7.6, 2.9, GREEN, 32))
        bins.arrange(RIGHT, buff=0.25).move_to([0, -0.75, 0])
        self.play(FadeIn(bins), run_time=0.5)
        one = [c for c, (_, m) in zip(cards, items) if not m]
        mix = [c for c, (_, m) in zip(cards, items) if m]
        mv = []
        for grp, bx, per in ((one, bins[0], 2), (mix, bins[1], 3)):
            c0 = bx.box.get_center()
            for k, c in enumerate(grp):
                col, row = k % per, k // per
                mv.append(c.animate.move_to(c0 + [(col - (per - 1) / 2) * 2.48, -0.05 - 0.9 * row, 0]))
        self.say(f"금관·산소·못·얼음은 {b_('한 가지 물질')}로만 이루어져 있어요",
                 "금관은 금, 산소는 산소, 못은 철, 얼음은 물, 이렇게 한 가지 물질로만 이루어져 있어요.")
        self.play(*mv, run_time=1.4)
        self.say(f"소금물은 소금과 물, 공기는 질소·산소 등이 {g('섞여 있어요')}",
                 "소금물은 소금과 물, 공기는 질소와 산소 등, 탄산음료는 물과 이산화 탄소 등, 바닷가 흙은 모래와 자갈 등이 섞여 있는 혼합물이에요.")
        self.play(Indicate(bins[1].title, color=GREEN), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 분리해 얻는 물질 ──
    def get(self):
        self.section("분리해 얻어요")
        srcs = [(K.sea_pic(), "바닷물", "소금"), (K.ore_pic(), "금광석", "금"),
                (K.rubber_pic(), "고무나무", "천연고무액"), (K.cane_pic(), "사탕수수", "설탕")]
        cols = VGroup()
        for i, (pic, n, got) in enumerate(srcs):
            pc = K.pic_card(pic, n, 2.9, 2.3)
            ar = Arrow(UP * 0.5, DOWN * 0.5, color=ORANGE, stroke_width=7, buff=0)
            sp = T("분리", 24, ORANGE)
            wc = K.word_card(got, 2.6, 0.85, GREEN, 32)
            col = VGroup(pc, ar, wc).arrange(DOWN, buff=0.18)
            sp.next_to(ar, RIGHT, buff=0.1)
            col.add(sp)
            cols.add(col)
        cols.arrange(RIGHT, buff=0.35).move_to([0, 0.35, 0])
        self.say("혼합물을 분리하면 무엇을 얻을 수 있을까요?",
                 "바닷물, 금광석, 고무나무, 사탕수수는 모두 혼합물이에요. 분리하면 어떤 물질을 얻을 수 있을까요?")
        self.play(FadeIn(VGroup(*[c[0] for c in cols]), lag_ratio=0.15), run_time=1.0)
        self.pause_screen(5, "무엇을 얻을 수 있을까요?")
        self.say(f"바닷물에서 {o('소금')}, 금광석에서 {o('금')}을 얻어요",
                 "바닷물에서 소금, 금광석에서 금을 분리해 얻을 수 있어요.")
        self.play(*[FadeIn(VGroup(c[1], c[3], c[2]), shift=DOWN * 0.2) for c in cols[:2]], run_time=0.8)
        self.say(f"고무나무에서 {o('천연고무액')}, 사탕수수에서 {o('설탕')}을 얻어요",
                 "고무나무에서 천연고무액, 사탕수수에서 설탕을 분리해 얻을 수 있어요.")
        self.play(*[FadeIn(VGroup(c[1], c[3], c[2]), shift=DOWN * 0.2) for c in cols[2:]], run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 정리해요 + 생각 바로잡기 ──
    def why(self):
        self.section("정리해요")
        q = T("혼합물을 분리하는 까닭은 무엇일까요?", 46).move_to([0, 2.3, 0])
        self.say("혼합물을 분리하는 까닭은 무엇일까요?")
        self.play(FadeIn(q), run_time=0.5)
        ans = K.text_card([f"혼합물에는 여러 가지 물질이 섞여 있어서,", f"분리해야 {o('필요한 물질을 얻을 수')} 있기 때문이에요."],
                          w=12.0, size=38).move_to([0, 0.85, 0])
        self.say(f"분리해야 {o('필요한 물질')}을 얻을 수 있기 때문이에요",
                 "혼합물에는 여러 가지 물질이 섞여 있어서, 분리해야 필요한 물질을 얻을 수 있기 때문이에요.")
        self.play(FadeIn(ans, shift=UP * 0.2), run_time=0.7)
        self.settle()
        self.section("생각 바로잡기")
        mq = T("소금물에서 소금을 분리하면 소금의 성질이 바뀔까요?", 36).move_to([0, -0.75, 0])
        self.say("소금물에서 분리한 소금은 성질이 바뀔까요?",
                 "소금물에서 소금을 분리하면 소금의 성질이 바뀔까요?")
        self.play(FadeIn(mq), run_time=0.5)
        ma = K.text_card([f"아니요, {g('소금의 성질은 그대로예요')}.", "혼합물 속 물질은 성질이 변하지 않은 채 섞여 있어요."],
                         w=12.0, size=34).move_to([0, -1.75, 0])
        self.say(f"아니요, {g('소금의 성질은 그대로')}예요",
                 "아니요, 소금의 성질은 그대로예요. 혼합물 속 물질은 성질이 변하지 않은 채 섞여 있어서, 분리해도 성질이 그대로예요.")
        self.play(FadeIn(ma, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 얻은 물질 이용 ──
    def use(self):
        self.section("얻은 물질 이용")
        pairs = [("사탕수수에서 얻은 설탕", "사탕이나 시럽"), ("콩에서 얻은 콩 단백질", "두부나 콩고기"),
                 ("목화에서 얻은 목화솜", "옷, 수건, 이불"), ("고무나무에서 얻은 천연고무액", "지우개 같은 고무 제품")]
        rows = VGroup()
        for a, b in pairs:
            ca = K.word_card(a, 5.6, 0.82, INK, 30)
            ar = Arrow(LEFT * 0.6, RIGHT * 0.6, color=ORANGE, stroke_width=7, buff=0)
            cb = K.word_card(b, 4.4, 0.82, GREEN, 30)
            rows.add(VGroup(ca, ar, cb).arrange(RIGHT, buff=0.3))
        rows.arrange(DOWN, buff=0.25).move_to([0, 0.55, 0])
        self.say("분리해 얻은 물질은 어떻게 이용할까요?",
                 "혼합물을 분리해 얻은 물질은 어떻게 이용할까요?")
        self.play(FadeIn(VGroup(*[rw[0] for rw in rows]), lag_ratio=0.15), run_time=0.9)
        self.say(f"설탕으로 {o('사탕')}, 콩 단백질로 {o('두부')}를 만들어요",
                 "사탕수수에서 얻은 설탕으로 사탕이나 시럽을, 콩에서 얻은 콩 단백질로 두부나 콩고기를 만들어요.")
        self.play(*[FadeIn(VGroup(rw[1], rw[2]), shift=RIGHT * 0.2) for rw in rows[:2]], run_time=0.8)
        self.say(f"목화솜으로 {o('옷')}을, 천연고무액으로 {o('지우개')}를 만들어요",
                 "목화솜으로 실을 만들어 옷, 수건, 이불을 만들고, 천연고무액을 가공해 지우개 같은 고무 제품을 만들어요.")
        self.play(*[FadeIn(VGroup(rw[1], rw[2]), shift=RIGHT * 0.2) for rw in rows[2:]], run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 더 알아보기: 옛날 농기구 ──
    def old(self):
        self.section("더 알아보기")
        rows = [("도리깨", "곡식의 이삭이나 껍질을 두드려 알곡을 떨어내요"),
                ("풍구", "바람을 일으켜 쭉정이, 겨 등을 날리고 알곡만 골라요"),
                ("키", "곡식을 까불러 쭉정이나 티끌을 골라내요")]
        grp = VGroup()
        for n, d in rows:
            a = K.word_card(n, 2.0, 0.9, "#8A5A2B", 34)
            b = T(d, 30).next_to(a, RIGHT, buff=0.35)
            grp.add(VGroup(a, b))
        grp.arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([0, 1.0, 0])
        self.say("옛날 사람들도 농기구로 혼합물을 분리했어요",
                 "옛날 사람들은 혼합물을 어떻게 분리했을까요? 도리깨, 풍구, 키 같은 농기구를 썼어요.")
        self.play(FadeIn(grp, lag_ratio=0.25), run_time=1.2)
        note = T("쭉정이: 껍질만 있고 속에 알맹이가 들지 않은 곡식", 26, SOFT).next_to(grp, DOWN, buff=0.35)
        self.say(f"섞여 있는 것에서 {o('필요한 곡식만')} 골라냈어요",
                 "옛날 농기구도 섞여 있는 것에서 필요한 곡식만 분리해 얻으려고 사용했어요. 쭉정이는 껍질만 있고 속에 알맹이가 들지 않은 곡식이에요.")
        self.play(FadeIn(note), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["두 가지 이상의 물질이 각각의 성질이 변하지 않은 채", f"섞여 있는 것을 {o('혼합물')}(이)라고 합니다."],
                           w=12.6, size=40).move_to([0, 1.2, 0])
        self.say(f"성질이 변하지 않은 채 섞여 있는 것 → {o('혼합물')}",
                 "두 가지 이상의 물질이 각각의 성질이 변하지 않은 채 섞여 있는 것을 혼합물이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="#2F6FD6">{s}</span>'
