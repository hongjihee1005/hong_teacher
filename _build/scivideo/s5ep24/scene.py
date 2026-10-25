"""「과학 원리 돋보기」 5학년 24화 — 섞이지 않는 액체 혼합물 (5-2 1단원 혼합물의 분리 4차시, 화 코드 5-2-1-c)

바탕: grade5/science/sem2/u1-3.html(원본 _build_tb/src2/u1-3.html) — 도입(간장에 참기름: 골고루 섞이지 않고 위에 뜸),
실험 1(물과 기름(식용유): 흔들어도 시간이 지나면 다시 두 층, 기름 위·물 아래), 실험 2(물 위의 기름을 떠냄),
실험 3(스포이트: 기름층에 살짝 넣어 뽑아 옮기기 반복 / 깊게 넣으면 물이 뽑힘, 안전), 실험 4(흡착포를 핀셋으로 대기 → 기름 흡수),
실험 5(스포이트·흡착포 장단점), 폐수통·폐기물 처리통, 정리·생각 바로잡기(세게 흔들어도 다시 층),
생활 속 예(국 위 기름 떠내기, 바다 기름 유출 흡착포), 한눈에 쏙(기름 위, 물 아래) + 마블링.
분별 깔때기(더 알아보기)는 길이 때문에 뺌.
최종: ./make_final.sh s5ep24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, FadeIn, FadeOut, Indicate, VGroup, Transform)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep24(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 24
    EP_TITLE = "섞이지 않는 액체 혼합물"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.dropper_exp()
        self.pad_exp()
        self.compare()
        self.wrap()
        self.life()
        self.summary()
        self.closing(f"섞이지 않는 액체 혼합물은 {o('위층의 액체')}만\n떠내어 분리할 수 있어요",
                     next_preview="5학년 25화 · 소금과 모래 분리")
        self.wait(0.5)

    # ── 궁금해요: 간장과 참기름 ──
    def intro(self):
        self.section("궁금해요")
        d0 = K.soy_dish(0, 4.4).move_to([0, -0.2, 0])
        n1 = T("간장", 32, K.SOY).move_to([-3.2, -0.8, 0])
        self.say("간장에 참기름을 너무 많이 부었어요",
                 "간장에 참기름을 너무 많이 부었어요. 어떻게 덜어 낼 수 있을까요?")
        self.play(FadeIn(d0), FadeIn(n1), run_time=0.6)
        d1 = K.soy_dish(1.0, 4.4).move_to([0, -0.2, 0])
        self.play(Transform(d0, d1), run_time=0.9)
        tg = K.label("위에 뜬 참기름", "#8A6A3A", 30).move_to([3.4, 1.0, 0])
        ln = K.L((2.0, 0.3), (2.9, 0.75), "#8A6A3A", 3)
        self.say(f"참기름은 간장과 섞이지 않고 {o('위에 떠 있어요')}",
                 "참기름은 간장과 골고루 섞이지 않고 간장 위에 떠 있어요. 숟가락으로 떠내거나 주방 휴지로 걷어 낼 수 있을 거예요.")
        self.play(FadeIn(ln), FadeIn(tg), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 관찰해요: 물과 기름 ──
    def observe(self):
        self.section("관찰해요")
        G = K.Glass(0, -2.2, 2.4, 3.6, "beaker")
        liq = K.layered(G, 2.2, 0.55)
        gl = G.glass()
        note = T("기름은 물과 색깔로 구별되는 식용유(노란색)를 써요", 28, SOFT).move_to([0, 2.55, 0])
        self.say("비커에 담긴 물과 기름의 혼합물을 흔들어 봐요",
                 "비커에 담긴 물과 기름의 혼합물을 관찰해요. 기름은 물과 색깔로 구별되는 식용유를 써요. 흔들어 볼까요?")
        self.play(FadeIn(liq), FadeIn(gl), FadeIn(note), run_time=0.7)
        cloud = K.layered(G, 2.2, 0.55, bubbles=0.9)
        grp = VGroup(liq, gl)
        for k in range(3):
            self.play(grp.animate.shift(RIGHT * 0.15), run_time=0.12)
            self.play(grp.animate.shift(LEFT * 0.3), run_time=0.18)
            self.play(grp.animate.shift(RIGHT * 0.15), run_time=0.12)
        self.play(Transform(liq, cloud), run_time=0.4)
        self.say("세게 흔들면 잠깐 뿌옇게 섞인 것처럼 보여요")
        self.pause_screen(5, "시간이 지나면 어떻게 될까요?")
        self.play(Transform(liq, K.layered(G, 2.2, 0.55)), run_time=1.6)
        l1 = K.label("기름", OIL_T, 32).move_to([2.6, -2.2 + 2.47, 0])
        l2 = K.label("물", "#2F6FD6", 32).move_to([2.6, -2.2 + 1.1, 0])
        a1 = K.L((1.25, -2.2 + 2.47), (2.1, -2.2 + 2.47), INK, 3)
        a2 = K.L((1.25, -2.2 + 1.1), (2.2, -2.2 + 1.1), INK, 3)
        self.say(f"다시 두 층으로: {o('기름은 위')}, {b_('물은 아래')}",
                 "시간이 지나자 다시 두 층으로 나뉘었어요. 물과 기름은 골고루 섞이지 않고, 기름은 위쪽에, 물은 아래쪽에 있어요.")
        self.play(FadeIn(a1), FadeIn(a2), FadeIn(l1), FadeIn(l2), run_time=0.5)
        self.settle()
        card = K.text_card([f"물 위에 있는 기름을 {o('떠내어')} 분리할 수 있어요."], size=34).move_to([0.6, 2.3, 0])
        self.say(f"그래서 물 위에 있는 기름을 {o('떠내어')} 분리해요",
                 "물과 기름이 층을 이루므로, 물 위에 있는 기름을 떠내어 분리할 수 있어요.")
        self.play(FadeOut(note), FadeIn(card), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 스포이트로 ──
    def dropper_exp(self):
        self.section("실험해요 1")
        A = K.Glass(-2.6, -1.8, 2.4, 3.0, "beaker")
        B = K.Glass(2.8, -1.8, 1.8, 2.2, "beaker")
        oil = [0.6]
        mixA = K.layered(A, 1.8, oil[0])
        recv = VGroup()
        na = T("물과 기름의 혼합물", 26).next_to(A.glass(), DOWN, buff=0.08)
        nb = T("빈 비커(100 mL)", 26).next_to(B.glass(), DOWN, buff=0.08)
        self.say("스포이트로 위에 있는 기름을 뽑아 옮겨요",
                 "스포이트로 비커 한 개의 물과 기름 혼합물을 분리해 봐요. 스포이트를 기름층에 살짝 넣어 기름을 뽑아요.")
        self.play(FadeIn(mixA), FadeIn(A.glass()), FadeIn(B.glass()), FadeIn(na), FadeIn(nb), run_time=0.7)
        dp = K.dropper(0).move_to([-2.6, 2.0, 0], aligned_edge=DOWN)
        self.play(FadeIn(dp), run_time=0.3)
        got = 0.0
        for k in range(3):
            top = -1.8 + 1.8 + oil[0]
            self.play(dp.animate.move_to([-2.6, top - 0.15, 0], aligned_edge=DOWN), run_time=0.4)
            oil[0] -= 0.2
            newA = K.layered(A, 1.8, max(oil[0], 0.0))
            full = K.dropper(0.35).move_to(dp.get_center())
            self.play(Transform(mixA, newA), Transform(dp, full), run_time=0.4)
            self.play(dp.animate.move_to([2.8, 0.8, 0], aligned_edge=DOWN), run_time=0.5)
            got += 0.18
            newB = K.layered(B, 0, got)
            empty = K.dropper(0).move_to(dp.get_center())
            self.play(FadeIn(newB), FadeOut(recv), Transform(dp, empty), run_time=0.4)
            recv = newB
            if k == 0:
                self.say(f"기름이 없어질 때까지 {o('여러 번 반복')}해요",
                         "위에 있는 기름을 뽑아 빈 비커로 옮기는 과정을 여러 번 반복해요.")
        self.say(f"스포이트를 {r('깊게 넣으면')} 아래의 물이 뽑혀요",
                 "스포이트를 너무 깊게 넣으면 아래의 물이 뽑혀 올라와요. 기름층에만 살짝 넣어 뽑아요.")
        self.play(dp.animate.move_to([-2.6, -1.55, 0], aligned_edge=DOWN), run_time=0.5)
        deep = K.dropper(0.6, K.WATER_D).move_to(dp.get_center())
        self.play(Transform(dp, deep), run_time=0.4)
        bad = K.label("물이 뽑혀요", RED, 30).move_to([-0.3, 0.9, 0])
        self.play(FadeIn(bad), Indicate(dp, color=RED), run_time=0.8)
        self.settle()
        safe = K.safety_note("유리 기구 조심 · 맛보지 않기 · 기름은 미끄러우니 흘리지 않기", w=12.0, size=28).move_to([0.4, 2.2, 0])
        self.play(FadeOut(dp), FadeOut(bad), FadeIn(safe), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 흡착포로 ──
    def pad_exp(self):
        self.section("실험해요 2")
        A = K.Glass(-1.8, -1.85, 2.6, 2.8, "beaker")
        mixA = K.layered(A, 1.8, 0.5)
        dish = K.E(2.6, 0.4, "#EEF8FD", 3.6, -1.6, K.GLASS, 3)
        dn = T("페트리 접시", 26).next_to(dish, DOWN, buff=0.1)
        info = T("흡착포: 바다에 유출된 기름을 제거하는 데 이용하는 종이", 28, SOFT).move_to([0.3, 2.55, 0])
        self.say("다른 비커에는 흡착포를 핀셋으로 가볍게 대요",
                 "다른 비커의 물과 기름 혼합물은 흡착포로 분리해요. 흡착포는 바다에 유출된 기름을 제거하는 데 이용하는 종이예요. 핀셋으로 흡착포를 가볍게 대 봐요.")
        self.play(FadeIn(mixA), FadeIn(A.glass()), FadeIn(dish), FadeIn(dn), FadeIn(info), run_time=0.7)
        pd = K.pad().move_to([-1.8, 1.25, 0])
        tw = K.tweezers(1.0).rotate(1.1).next_to(pd, UP, buff=-0.05)
        tool = VGroup(pd, tw)
        self.play(FadeIn(tool), run_time=0.3)
        self.pause_screen(5, "흡착포에 무엇이 흡수될까요?")
        oil = 0.5
        used = VGroup()
        for k in range(3):
            self.play(tool.animate.shift(DOWN * (1.25 - (-1.85 + 1.8 + oil) + 0.08)), run_time=0.4)
            oil -= 0.17
            yel = K.pad(K.OIL).move_to(pd.get_center())
            self.play(Transform(mixA, K.layered(A, 1.8, max(oil, 0))), Transform(pd, yel), run_time=0.4)
            self.play(tool.animate.move_to([3.2 + 0.4 * k, -0.9, 0]), run_time=0.5)
            used.add(K.pad(K.OIL, 0.7).rotate(0.2 * k - 0.2).move_to([3.0 + 0.45 * k, -1.5, 0]))
            self.add(used[-1])
            new = VGroup(K.pad().move_to([-1.8, 1.25, 0]), K.tweezers(1.0).rotate(1.1))
            new[1].next_to(new[0], UP, buff=-0.05)
            self.remove(tool)
            pd, tw = new[0], new[1]
            tool = new
            self.add(tool)
            if k == 0:
                self.say(f"물 위의 {o('기름이 흡착포에 흡수')}돼요",
                         "흡착포가 기름을 흡수해 노랗게 되었어요. 물은 흡수되지 않아요. 페트리 접시에 옮기고 새 흡착포로 다시 해요.")
        self.say(f"여러 번 대면 {g('기름이 분리된 물')}을 얻어요",
                 "흡착포를 여러 번 대었더니 물 위의 기름이 거의 없어졌어요. 기름이 분리된 물을 얻었어요.")
        self.play(FadeOut(tool), run_time=0.3)
        self.settle()
        clear_stage(self)

    # ── 장단점 ──
    def compare(self):
        self.section("장단점")
        tb = K.result_table(["", "스포이트", "흡착포"],
                            [["장점", "분리한 기름을\n다시 사용할 수 있어요", "얇게 퍼진 기름을\n더 편리하게 분리해요"],
                             ["단점", "얇게 퍼진 기름은\n분리하기 어려워요", "분리한 기름을\n다시 사용하기 어려워요"]],
                            [1.8, 5.2, 5.2], row_h=1.25, size=30).move_to([0, 0.75, 0])
        self.say("스포이트와 흡착포의 장단점을 정리해요",
                 "스포이트는 분리한 기름을 다시 쓸 수 있지만, 기름이 물 위에 얇게 퍼져 있으면 분리하기 어려워요.")
        self.play(FadeIn(tb), run_time=0.8)
        self.play(Indicate(VGroup(tb.cells[1][1], tb.cells[2][1]), color=ORANGE), run_time=0.8)
        self.say("흡착포는 얇게 퍼진 기름에 편리하지만, 기름을 다시 쓰기 어려워요")
        self.play(Indicate(VGroup(tb.cells[1][2], tb.cells[2][2]), color=ORANGE), run_time=0.8)
        eco = T("사용한 물과 기름은 폐수통에, 기름을 흡수한 흡착포는 폐기물 처리통에", 28, GREEN).move_to([0, -1.85, 0])
        self.say(f"실험이 끝나면 {g('나누어 버려요')}",
                 "실험에 사용한 물과 기름은 환경이 오염되지 않도록 폐수통에 나누어 버리고, 기름을 흡수한 흡착포는 폐기물 처리통에 버려요.")
        self.play(FadeIn(eco), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 정리 + 생각 바로잡기 ──
    def wrap(self):
        self.section("생각 바로잡기")
        q = T("물과 기름을 아주 세게 흔들면 골고루 섞일까요?", 42).move_to([0, 1.9, 0])
        self.say("물과 기름을 아주 세게 흔들면 골고루 섞일까요?")
        self.play(FadeIn(q), run_time=0.5)
        a = K.text_card([f"아니요, {r('시간이 지나면 다시 층을 이루어요')}.",
                         "잠깐 뿌옇게 섞인 것처럼 보여도 골고루 섞이지 않아요."], w=11.6, size=36).move_to([0, 0.2, 0])
        self.say(f"아니요, 시간이 지나면 {r('다시 층')}을 이루어요",
                 "아니요. 세게 흔들면 잠깐 뿌옇게 섞인 것처럼 보여도, 시간이 지나면 다시 층을 이루므로 골고루 섞이지 않아요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 예 ──
    def life(self):
        self.section("생활 속 예")
        soup = VGroup(K.soy_dish(1.0, 2.6), K.L((0.9, 1.0), (0.2, 0.15), "#8A8174", 7), K.E(0.5, 0.18, "#C9D1D9", 0.15, 0.12, K.STEEL, 3))
        sea = VGroup(K.rect(3.0, 1.6, "#3D8BD4", 0, 0, "#3D8BD4", 0, r=0.1),
                     K.E(2.2, 0.35, "#3A3326", 0, 0, "#3A3326", 0, 0.8),
                     *[K.rect(0.5, 0.14, "#FFFFFF", -0.8 + 0.55 * i, 0.02 * (i % 2), "#BBBBBB", 2).rotate(0.2 * i - 0.3) for i in range(4)])
        cards = VGroup(K.pic_card(soup, "국 위에 뜬 기름 떠내기", 5.6, 3.0, 28),
                       K.pic_card(sea, "바다에 유출된 기름 → 흡착포", 5.6, 3.0, 28)).arrange(RIGHT, buff=0.5).move_to([0, 0.5, 0])
        self.say(f"국 위에 뜬 기름은 {o('숟가락이나 국자로 떠내요')}",
                 "생활 속에서도 섞이지 않는 액체 혼합물을 분리해요. 국이나 찌개 위에 뜬 기름은 숟가락이나 국자로 떠내어 제거해요.")
        self.play(FadeIn(cards[0]), run_time=0.6)
        self.say(f"바다에 기름이 유출되면 {o('흡착포')}로 물에 뜬 기름을 제거해요")
        self.play(FadeIn(cards[1]), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"물과 기름의 혼합물은 {o('기름')}이 위쪽에, 물이 아래쪽에", "위치하는 것을 이용해 분리합니다."],
                           w=12.4, size=40).move_to([0, 1.5, 0])
        self.say(f"{o('기름')}이 위쪽에, 물이 아래쪽에 위치하는 것을 이용해요",
                 "물과 기름의 혼합물은 기름이 위쪽에, 물이 아래쪽에 위치하는 것을 이용해 분리해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        mb = K.text_card([f"마블링: 물 위에 뜬 {o('기름 성분의 물감')}을 종이에 찍어 내요."], size=34).move_to([0, -0.6, 0])
        self.say(f"마블링도 기름이 {o('물에 뜨는 성질')}을 이용해요",
                 "마블링 작품도 물과 기름이 섞이지 않고 기름이 물에 뜨는 성질을 이용해요. 물 위에 뜬 기름 성분의 물감을 종이에 찍어 내요.")
        self.play(FadeIn(mb, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)


OIL_T = "#B07D00"


def b_(s):
    return f'<span foreground="#2F6FD6">{s}</span>'
