"""「과학 원리 돋보기」 4학년 31화 — 기후변화 현상의 예 (4-2 4단원 기후변화와 우리 생활 2차시, 화 코드 4-2-4-a)

바탕: grade4/science/sem2/u4-1.html(원본 _build_tb/src2/u4-1.html) — 도입(기후변화 뉴스: 홍수·봄꽃·열대 과일, 열대 과일을
기를 수 있게 된 까닭), 날씨와 기후(날씨: 그날그날의 대기 상태 / 기후: 보통 30년 이상 날씨의 평균적인 상태 / 기후변화),
폭염 일수(10년 평균 7.7 → 10.4 → 11.1 → 14일, 기상청 기상자료개방포털·「과학」 89쪽), 세계 지도 붙임딱지(2022년 소식,
기상청 기후정보포털), 현상 설명 잇기(폭염·한파 = 기온 변화, 홍수·폭설·가뭄 = 강수량 변화), 발표해요(우리나라에서만? 아님),
한눈에 쏙(최근에 가뭄, 폭설, 폭염, 한파, 홍수 등과 같은 기후변화 현상이 많이 나타나고 있습니다).
최종: ./make_final.sh s4ep31
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowFromEdge, Indicate, Transform, VGroup, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def news(pic, head, w=3.9):
    box = K.R(w, 3.3, PAPER, rad=0.18, stroke=SOFT, sw=4)
    p = K.fit(pic, w - 0.6, 1.9).move_to(box.get_top() + DOWN * 1.2)
    t = M(head, 26)
    if t.width > w - 0.3:
        t.scale_to_fit_width(w - 0.3)
    t.next_to(p, DOWN, buff=0.25)
    return VGroup(box, p, t)


def flower_tree():
    tr = K.tree(1.6, "#F7C6D6")
    tr[1].set_stroke("#D98AA3")
    lab = T("3월", 30, BLUE).next_to(tr, LEFT, buff=0.2).shift(UP * 0.5)
    return VGroup(tr, lab)


def tropical():
    from kit_s3u12 import E
    trunk = K.L((0, -0.8), (0.05, 0.3), K.TRUNK, 10)
    leaves = VGroup(E(1.2, 0.35, "#4FAE4F", -0.5, 0.42).rotate(-0.35), E(1.2, 0.35, "#4FAE4F", 0.55, 0.42).rotate(0.35))
    banana = VGroup(E(0.2, 0.5, "#F5C542", -0.05, 0.0), E(0.2, 0.5, "#F5C542", 0.15, -0.02))
    mango = E(0.75, 0.95, "#F4A63A", 1.3, -0.35)
    return VGroup(trunk, leaves, banana, mango)


class S4Ep31(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 31
    EP_TITLE = "기후변화 현상의 예"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.climate()
        self.heatwave()
        self.world()
        self.kinds()
        self.summary()
        self.closing(f"최근에 가뭄, 폭설, 폭염, 한파, 홍수 같은\n{g('기후변화 현상')}이 많이 나타나고 있어요",
                     next_preview="4학년 32화 · 우리는 기후변화에 어떤 영향을 줄까?")
        self.wait(0.5)

    # ── 궁금해요: 기후변화 뉴스 ──
    def intro(self):
        self.section("궁금해요")
        cards = VGroup(news(K.flood_pic(), "짧은 시간에 비가 많이 내려\n마을이 물에 잠겼어요"),
                       news(flower_tree(), "겨울이 짧아져\n봄꽃이 일찍 피었어요"),
                       news(tropical(), "우리나라에서도\n열대 과일을 길러요")).arrange(RIGHT, buff=0.35).move_to([0, 0.35, 0])
        self.say("기후변화와 관련된 뉴스를 본 적이 있나요?",
                 "기후변화와 관련된 뉴스를 본 적이 있나요? 이런 뉴스들이에요.")
        for c in cards:
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.5)
        self.settle()
        self.play(Indicate(cards[2], color=ORANGE, scale_factor=1.05), run_time=0.8)
        self.say(f"우리나라에서도 {o('열대 과일')}을 기를 수 있게 된 까닭은?",
                 "우리나라에서도 열대 과일을 기를 수 있게 된 까닭은 무엇일까요?")
        self.pause_screen(5, "열대 과일을 기를 수 있게 된 까닭은?")
        ans = K.text_card([f"기후변화로 {g('평균 기온이 높아졌기')} 때문이에요"], size=36, stroke=GREEN).move_to([0, 2.55, 0])
        self.play(cards.animate.shift(DOWN * 0.35), FadeIn(ans), run_time=0.6)
        self.say(f"기후변화로 {g('평균 기온')}이 높아졌기 때문이에요",
                 "기후변화로 평균 기온이 높아졌기 때문이에요. 어제 하루 더웠던 것과는 달라요.")
        self.settle()
        clear_stage(self)

    # ── 날씨와 기후 ──
    def climate(self):
        self.section("날씨와 기후")
        wpic = VGroup(K.sun_hot(0.35), K.rain_cloud(1.2), K.snowflake(0.32)).arrange(RIGHT, buff=0.25)
        w = VGroup(T("날씨", 52, BLUE), wpic,
                   M("비, 눈, 구름, 바람, 기온 등\n그날그날의 대기 상태", 30)).arrange(DOWN, buff=0.3)
        cal = VGroup(*[K.R(0.42, 0.42, PAPER if i % 7 else "#FFE2D9", rad=0.05, stroke=SOFT, sw=2) for i in range(21)]).arrange_in_grid(rows=3, buff=0.06)
        c = VGroup(T("기후", 52, ORANGE), cal,
                   M(f"한 지역에서 보통 {o('30년 이상')}의 오랜 기간에\n나타나는 날씨의 평균적인 상태", 30)).arrange(DOWN, buff=0.3)
        bw = K.R(5.6, 4.2, PAPER, rad=0.2, stroke=BLUE, sw=5)
        bc = K.R(7.0, 4.2, PAPER, rad=0.2, stroke=ORANGE, sw=5)
        if c.width > 6.3:
            c.scale_to_fit_width(6.3)
        gw, gc = VGroup(bw, w), VGroup(bc, c)
        w.move_to(bw)
        c.move_to(bc)
        VGroup(gw, gc).arrange(RIGHT, buff=0.35).move_to([0, 0.35, 0])
        self.say(f"{BL('날씨')}는 그날그날의 대기 상태예요",
                 "날씨는 비, 눈, 구름, 바람, 기온처럼 그날그날의 대기 상태예요.")
        self.play(FadeIn(gw), run_time=0.6)
        self.settle()
        self.say(f"{o('기후')}는 오랜 기간 날씨의 평균적인 상태예요",
                 "기후는 한 지역에서 보통 30년 이상의 오랜 기간에 걸쳐 나타나는 날씨의 평균적인 상태예요.")
        self.play(FadeIn(gc), run_time=0.6)
        self.settle()
        self.play(FadeOut(gw), FadeOut(gc), run_time=0.4)
        ex = VGroup(K.text_card(["오늘은 비가 오고 바람이 세게 불어요."], size=34),
                    K.text_card(["이 지역은 30년 넘게 여름이 덥고 비가 많이 왔어요."], size=34)).arrange(DOWN, buff=0.7, aligned_edge=LEFT).move_to([-0.9, 1.0, 0])
        self.say("이 문장은 날씨일까요, 기후일까요?", "다음 두 문장은 날씨일까요, 기후일까요?")
        self.play(FadeIn(ex, lag_ratio=0.3), run_time=0.7)
        self.settle()
        t1 = K.sticker("날씨", BLUE, 34).next_to(ex[0], RIGHT, buff=0.35)
        t2 = K.sticker("기후", ORANGE, 34).next_to(ex[1], RIGHT, buff=0.35)
        self.play(FadeIn(t1, scale=1.3), run_time=0.4)
        self.play(FadeIn(t2, scale=1.3), run_time=0.4)
        self.say("하루의 일은 날씨, 오랜 기간의 평균은 기후",
                 "그날의 대기 상태는 날씨, 30년 넘게 이어진 평균적인 상태는 기후예요.")
        self.settle()
        dfn = K.text_card([f"오랜 기간에 걸쳐 평균적인 날씨가 변하는 것 → {r('기후변화')}"], size=38, stroke=RED).move_to([0, -1.5, 0])
        self.play(FadeIn(dfn, shift=UP * 0.2), run_time=0.6)
        self.say(f"평균적인 날씨가 변하는 것을 {r('기후변화')}라고 해요",
                 "오랜 기간에 걸쳐 평균적인 날씨가 변하는 것을 기후변화라고 해요.")
        self.settle()
        clear_stage(self)

    # ── 폭염 일수 ──
    def heatwave(self):
        self.section("폭염 일수")
        ch = K.bar_chart([7.7, 10.4, 11.1, 14], ["1984~1993", "1994~2003", "2004~2013", "2014~2023"],
                         vmax=20, step=5, w=8.6, h=3.4, ylabel="평균 폭염 일수(일)").move_to([-0.6, 0.35, 0])
        src = T("자료: 기상청 기상자료개방포털(「과학」 89쪽)", 22, SOFT).move_to([0, -2.4, 0])
        self.say(f"{o('폭염')}은 기온이 평년보다 매우 높은 현상이에요",
                 "폭염은 기온이 평년보다 매우 높은 현상이에요. 10년씩 평균 폭염 일수를 살펴봐요.")
        self.play(FadeIn(VGroup(ch.grid, ch.axis, ch.labels, ch[-1])), FadeIn(src), run_time=0.6)
        self.play(GrowFromEdge(ch.bars[0], DOWN), FadeIn(ch.vals[0]), run_time=0.6)
        self.settle()
        self.pause_screen(5, "폭염 일수는 어떻게 변했을까요?")
        for i in range(1, 4):
            self.play(GrowFromEdge(ch.bars[i], DOWN), FadeIn(ch.vals[i]), run_time=0.6)
        arr = Arrow(ch.bars[0].get_top() + UP * 0.7, ch.bars[3].get_top() + UP * 0.7 + LEFT * 0.4, buff=0.1,
                    color=RED, stroke_width=8, max_tip_length_to_length_ratio=0.08)
        self.play(Create(arr), run_time=0.6)
        self.say(f"평균 폭염 일수가 {r('점점 늘어났어요')}",
                 "평균 폭염 일수가 7.7일, 10.4일, 11.1일, 14일로 점점 늘어났어요.")
        self.settle()
        self.say("자료를 쓸 때는 이렇게 출처를 밝혀요", "조사한 자료를 쓸 때는 이렇게 출처를 밝혀요.")
        self.play(Indicate(src, color=ORANGE, scale_factor=1.15), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 세계 곳곳의 기후변화 ──
    def world(self):
        self.section("세계 곳곳")
        wm = K.WorldMap(10.2).move_to([0, 0.3, 0])
        yr = T("2022년 소식 · 자료: 기상청 기후정보포털", 22, SOFT).next_to(wm, DOWN, buff=0.12)
        self.say("전 세계에 어떤 기후변화 현상이 나타났을까요?",
                 "2022년에 전 세계에는 어떤 기후변화 현상이 나타났을까요?")
        self.play(FadeIn(wm), FadeIn(yr), run_time=0.7)
        ev = [("영국", -2, 53, "가뭄", K.DRY, "가장 건조한 7월"),
              ("미국", -98, 39, "한파", K.COLD, "32년 만에 최저 기온"),
              ("대한민국", 127.5, 36.5, "폭설", K.WET, "기록적인 폭설"),
              ("파키스탄", 70, 30, "홍수", K.WET, "폭우로 인한 홍수"),
              ("남아프리카공화국", 25, -29, "홍수", K.WET, "60년 만의 홍수"),
              ("오스트레일리아", 134, -25, "폭염", K.HOT, "최고 기온 기록")]
        pins = VGroup()
        for c, lo, la, *_ in ev:
            p = K.pin().move_to(wm.pt(lo, la))
            nm = T(c, 20, INK).next_to(p, DOWN, buff=0.08)
            pins.add(VGroup(p, nm))
        self.play(FadeIn(pins, lag_ratio=0.15), run_time=1.0)
        self.settle()
        for i, (c, lo, la, kind, col, txt) in enumerate(ev):
            st = K.sticker(kind, col, 24).next_to(pins[i][0], UP, buff=0.1)
            self.play(FadeIn(st, scale=1.4), Indicate(pins[i][0], color=col, scale_factor=1.6), run_time=0.55)
            if i in (0, 1, 2):
                self.say(f"{c} · {txt} → {o(kind)}", f"{c}, {txt}. {kind}예요.")
            elif i == 3:
                self.say("파키스탄과 남아프리카공화국에는 홍수", "파키스탄과 남아프리카공화국에는 비가 매우 많이 내려 홍수가 났어요.")
            elif i == 5:
                self.say(f"오스트레일리아 · 최고 기온 기록 → {o('폭염')}", "오스트레일리아는 최고 기온을 기록한 폭염이에요.")
            self.wait(0.6)
        self.settle()
        self.say(f"기후변화는 {o('세계 곳곳')}에서 나타나고 있어요",
                 "이처럼 기후변화 현상은 세계 곳곳에서 나타나고 있어요. 나라마다 어떤 현상이 나타나는지는 해마다 달라지니 외우지 않아도 돼요.")
        self.settle()
        clear_stage(self)

    # ── 기후변화 현상 정리 ──
    def kinds(self):
        self.section("현상 정리")
        names = ["폭염", "한파", "홍수", "폭설", "가뭄"]
        desc = ["기온이 평년보다\n매우 높아요", "기온이 평년보다\n매우 낮아요", "강수량이 평년보다\n매우 많아요",
                "눈이 평년보다\n매우 많이 내려요", "강수량이 평년보다\n매우 적어요"]
        cards = VGroup()
        for n, d in zip(names, desc):
            box = K.R(2.45, 3.3, PAPER, rad=0.18, stroke=SOFT, sw=4)
            pic = K.weather_pic(n, 1.7).move_to(box.get_top() + DOWN * 0.95)
            t = T(n, 38).next_to(pic, DOWN, buff=0.2)
            dd = K.lines(d, 23, INK, bold=False, buff=0.1)
            if dd.width > 2.25:
                dd.scale_to_fit_width(2.25)
            dd.next_to(t, DOWN, buff=0.15)
            cards.add(VGroup(box, pic, t, dd))
        cards.arrange(RIGHT, buff=0.22).move_to([0, 0.55, 0])
        self.say("기후변화 현상을 하나씩 설명해 봐요", "기후변화 현상을 하나씩 설명해 봐요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=1.2)
        self.say(f"폭염과 한파는 {r('기온')}이 평년보다 매우 높거나 낮은 현상",
                 "폭염은 기온이 평년보다 매우 높은 현상, 한파는 매우 낮은 현상이에요.")
        b1 = K.R(5.15, 3.55, PAPER, rad=0.2, stroke=RED, sw=6, op=0).move_to(VGroup(cards[0], cards[1]))
        l1 = T("기온 변화", 32, RED).next_to(b1, DOWN, buff=0.12)
        self.play(Create(b1), FadeIn(l1), run_time=0.6)
        self.settle()
        self.say(f"홍수·폭설·가뭄은 {BL('강수량')}이 매우 많거나 적은 현상",
                 "홍수와 폭설은 비나 눈이 평년보다 매우 많이 내리는 현상, 가뭄은 강수량이 매우 적은 현상이에요.")
        b2 = K.R(7.75, 3.55, PAPER, rad=0.2, stroke=BLUE, sw=6, op=0).move_to(VGroup(cards[2], cards[4]))
        l2 = T("강수량 변화", 32, BLUE).next_to(b2, DOWN, buff=0.12)
        self.play(Create(b2), FadeIn(l2), run_time=0.6)
        self.settle()
        clear_stage(self)
        # 생각 바로잡기
        self.section("생각 바로잡기")
        q = K.text_card(["기후변화 현상은 우리나라에서만 일어날까요?"], size=40).move_to([0, 1.6, 0])
        self.say("기후변화 현상은 우리나라에서만 일어날까요?", "기후변화 현상은 우리나라에서만 일어날까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.settle()
        a = K.text_card([f"아니요! {g('세계 곳곳')}에서 기온이나 강수량이",
                         "매우 높거나 낮은 현상이 일어나고 있어요",
                         f"기후변화는 {o('어느 한 지역만의 문제가 아니에요')}"], size=34, stroke=GREEN).move_to([0, -0.5, 0])
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.6)
        self.say(f"기후변화는 {o('어느 한 지역만의 문제')}가 아니에요",
                 "아니에요. 세계 곳곳에서 일어나고 있어서, 기후변화는 어느 한 지역만의 문제가 아니에요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"최근에 가뭄, 폭설, 폭염, 한파, 홍수 등과 같은",
                            f"{g('기후변화')} 현상이 많이 나타나고 있습니다."], w=12.4, size=44).move_to([0, 1.3, 0])
        self.say(f"이런 {g('기후변화')} 현상이 많이 나타나고 있어요",
                 "최근에 가뭄, 폭설, 폭염, 한파, 홍수 등과 같은 기후변화 현상이 많이 나타나고 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        more = K.text_card([f"예전보다 {o('더 자주')} 일어나고, 정도도 {o('심해지고')} 있어요"], size=36).move_to([0, -0.3, 0])
        self.play(FadeIn(more), run_time=0.5)
        self.say(f"예전보다 {o('더 자주')}, 더 {o('심하게')} 일어나요",
                 "이런 현상은 예전보다 더 자주 일어나고, 정도도 심해지고 있어요.")
        self.settle()
        nxt = M(f"왜 일어나는지, {g('우리가 할 수 있는 일')}은 무엇인지 함께 알아봐요", 34).move_to([0, -1.75, 0])
        self.play(FadeIn(nxt, shift=UP * 0.2), run_time=0.5)
        self.say(f"까닭과 {g('우리가 할 수 있는 일')}도 함께 알아봐요",
                 "걱정만 하지 않아도 돼요. 기후변화가 왜 일어나는지, 우리가 할 수 있는 일은 무엇인지 다음 시간부터 함께 알아봐요.")
        self.settle()
        clear_stage(self)


def BL(s):
    return f'<span foreground="{BLUE}">{s}</span>'
