"""「과학 원리 돋보기」 5학년 14화 — 더 많이 녹이려면? (5-1 3단원 용해와 용액 4~5차시, 화 코드 5-1-3-c)

바탕: grade5/science/sem1/u3-3.html(원본 _build_tb/src/u3-3.html) — 도입(분말주스를 많이 녹이려면),
실험 1(상온 약 20 ℃ 물 50 mL에 설탕·소금·백반을 한 숟가락씩: 백반 2숟가락째·소금 9숟가락째 바닥에 남음, 설탕 10숟가락 모두 용해 — 지도서 예시),
계획(다르게: 물의 온도 / 같게: 물의 양·용질의 종류·넣는 백반의 양·비커의 크기),
실험 2(차가운 물 10 ℃ 이하·따뜻한 물 40~50 ℃ 50 mL에 백반 두 숟가락: 따뜻한 물은 모두 녹고 차가운 물은 바닥에 남음),
생각 바로잡기(오래 저어도 더 녹지 않음), 더 알아보기(백반 결정 키우기), 한눈에 쏙.
최종: ./make_final.sh s5ep14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Rotate,
                   SurroundingRectangle, Transform, LaggedStart)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="#2F86C6">{s}</span>'


class S5Ep14(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 14
    EP_TITLE = "더 많이 녹이려면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.kinds()
        self.plan()
        self.temp()
        self.crystal()
        self.summary()
        self.closing(f"물에 용해되는 용질의 양은\n{o('용질의 종류')}와 {r('물의 온도')}에 따라 달라요",
                     next_preview="5학년 15화 · 용액의 진하기 비교")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        G = K.Glass(0, -2.0, 2.6, 3.0, "cup")
        cup = VGroup(G.liquid(2.5, "#F6C08A", 0.75), G.pile(0.3, "#F29B4B", "#C9732A"), G.glass())
        q = T("분말주스를 물에 많이 녹이려면?", 46).move_to([0, 2.4, 0])
        self.say("분말주스를 물에 많이 녹이려면 어떻게 해야 할까요?",
                 "분말주스가 다 녹지 않고 바닥에 남았어요. 분말주스를 물에 많이 녹이려면 어떻게 해야 할까요?")
        self.play(FadeIn(q), FadeIn(cup), run_time=0.7)
        self.say(f"가루의 {o('종류')}를 바꾸거나, 물의 {o('양')}이나 {r('온도')}를 다르게 해 봐요",
                 "가루의 종류를 바꾸거나, 물의 양이나 온도를 다르게 해 볼 수 있어요. 무엇이 녹는 양에 영향을 주는지 실험해 봐요.")
        self.settle()
        clear_stage(self)

    # ── 실험 1: 용질의 종류 ──
    def kinds(self):
        self.section("실험해요 1")
        names = ["설탕", "소금", "백반"]
        lim = [99, 9, 2]           # 이 숟가락째에 바닥에 남음(지도서 예시)
        B = [K.Glass(x, 0.35, 1.8, 1.75, "beaker") for x in (-4.3, 0, 4.3)]
        bk = VGroup(*[VGroup(b.liquid(1.3), b.glass()) for b in B])
        tags = VGroup(*[T(n, 32).next_to(b.top(0.1), UP, buff=0.12) for n, b in zip(names, B)])
        cnt = [T("물 50 mL", 26, SOFT).next_to(b.glass(), DOWN, buff=0.1) for b in B]
        cnt = VGroup(*cnt)
        head = ["용질 \\ 숟가락"] + [str(i) for i in range(1, 11)]
        tb = K.result_table(head, [[n] + [""] * 10 for n in names], [2.4] + [0.95] * 10, row_h=0.56, size=26)
        tb.move_to([0, -1.6, 0])
        self.say("같은 온도, 같은 양의 물에 설탕, 소금, 백반을 녹여요",
                 "온도가 같은 상온, 약 20도의 물을 50밀리리터씩 비커에 넣고, 설탕, 소금, 백반을 한 숟가락씩 넣어 충분히 저어요. 백반은 봉숭아 물들이는 데 쓰는 흰색 물질이에요.")
        self.play(FadeIn(bk), FadeIn(tags), FadeIn(cnt), FadeIn(tb), run_time=0.9)
        self.say(f"녹으면 {g('○')}, 바닥에 남으면 {r('△')}, 남으면 더 넣지 않아요",
                 "모두 녹으면 동그라미, 녹지 않고 바닥에 남으면 세모로 표시해요. 바닥에 남으면 더 넣지 않아요.")
        self.settle()
        # 두 숟가락까지 먼저
        piles = []
        done = [False, False, False]

        def step(k, rt):
            anims = []
            for i in range(3):
                if done[i]:
                    continue
                ok = k < lim[i]
                mk = T("○" if ok else "△", 30, GREEN if ok else RED).move_to(self.cell_center(tb, i + 1, k))
                anims.append(FadeIn(mk, scale=0.6))
                anims.append(Transform(cnt[i], T(f"{k}숟가락", 26, INK).move_to(cnt[i])))
                if not ok:
                    pl = B[i].pile(0.18)
                    piles.append(pl)
                    anims.append(FadeIn(pl))
                    done[i] = True
            self.play(*anims, run_time=rt)
        step(1, 0.5)
        step(2, 0.6)
        self.say(f"백반은 {r('두 숟가락째')}에 바닥에 남았어요",
                 "백반은 두 숟가락째에 충분히 저어도 녹지 않고 바닥에 남았어요. 설탕과 소금은 계속 넣어 봐요.")
        self.settle()
        self.pause_screen(5, "설탕과 소금은 몇 숟가락까지?")
        for k in range(3, 11):
            step(k, 0.35)
        self.say(f"소금은 {r('아홉 숟가락째')}, 설탕은 {g('열 숟가락')}도 모두 녹았어요",
                 "소금은 아홉 숟가락째에 바닥에 남았고, 설탕은 열 숟가락을 넣어도 모두 용해되었어요.")
        note = T("이 결과는 지도서의 예시예요 (실제 결과는 모둠마다 다를 수 있어요)", 22, SOFT).move_to([0, -0.3, 0])
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        res = K.text_card([f"가장 많이 용해: {g('설탕')}   가장 적게 용해: {r('백반')}",
                           f"용해되는 양은 {o('용질의 종류')}에 따라 달라요."], w=11.6, size=34)
        self.play(FadeOut(VGroup(bk, cnt, tags, note, *piles)), run_time=0.4)
        res.move_to([0, 1.3, 0])
        self.say(f"같은 온도·같은 양의 물에 용해되는 양은 {o('용질의 종류')}에 따라 달라요",
                 "온도와 양이 같은 물에 가장 많이 용해되는 용질은 설탕, 가장 적게 용해되는 용질은 백반이에요. 물에 용해되는 용질의 양은 용질의 종류에 따라 달라요.")
        self.play(FadeIn(res, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    @staticmethod
    def cell_center(tb, row, col):
        # result_table는 줄마다 칸 상자를 차례로 넣음: 상자 순서 = row * 11 + col
        return tb[row * 11 + col].get_center()

    # ── 계획해요 ──
    def plan(self):
        self.section("계획해요")
        q = M(f"물의 {r('온도')}에 따라 백반이 용해되는 양은 어떨까요?", 40).move_to([0, 2.35, 0])
        self.say("물의 온도에 따라 백반이 녹는 양을 비교하려면?",
                 "이번에는 물의 온도에 따라 백반이 용해되는 양을 비교하는 실험을 계획해요. 무엇을 다르게 하고, 무엇을 같게 해야 할까요?")
        self.play(FadeIn(q), run_time=0.5)
        bins = VGroup(K.bin_box("다르게 해야 할 조건", 4.6, 3.6, RED, 32), K.bin_box("같게 해야 할 조건", 7.6, 3.6, GREEN, 32))
        bins.arrange(RIGHT, buff=0.3).move_to([0, -0.4, 0])
        self.play(FadeIn(bins), run_time=0.5)
        diff = K.word_card("물의 온도", 3.4, 0.8, RED, 32).move_to(bins[0].box.get_center() + DOWN * 0.2)
        same_t = ["물의 양", "용질의 종류(백반)", "넣는 백반의 양", "비커의 크기"]
        same = VGroup(*[K.word_card(t, 3.5, 0.8, INK, 28) for t in same_t]).arrange_in_grid(rows=2, cols=2, buff=(0.2, 0.3))
        same.move_to(bins[1].box.get_center() + DOWN * 0.2)
        self.say(f"{r('물의 온도')}만 다르게 하고, 나머지 조건은 모두 {g('같게')} 해요",
                 "물의 온도만 다르게 하고, 물의 양, 용질의 종류, 넣는 백반의 양, 비커의 크기는 모두 같게 해요.")
        self.play(FadeIn(diff, scale=0.9), run_time=0.5)
        self.play(FadeIn(same, lag_ratio=0.15), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 실험 2: 물의 온도 ──
    def temp(self):
        self.section("실험해요 2")
        C = K.Glass(-3.0, -2.1, 2.6, 2.9, "beaker")
        W = K.Glass(3.0, -2.1, 2.6, 2.9, "beaker")
        lv = 2.1
        bk = VGroup(C.liquid(lv, "#D7ECFA"), C.glass(), W.liquid(lv, "#E3F2FA"), W.glass())
        t1 = M(f"{bl('차가운 물')} (10 ℃ 이하)", 32).next_to(C.top(0.1), UP, buff=0.2)
        t2 = M(f"{r('따뜻한 물')} (40~50 ℃)", 32).next_to(W.top(0.1), UP, buff=0.2)
        steam = VGroup(*[K.Line([W.x + 0.6 + 0.3 * i, W.y + W.h + 0.15, 0], [W.x + 0.7 + 0.3 * i, W.y + W.h + 0.55, 0],
                                stroke_color="#E2A3A3", stroke_width=4) for i in range(3)])
        self.say("차가운 물과 따뜻한 물에 백반을 두 숟가락씩 넣어요",
                 "눈금실린더로 비커 두 개에 차가운 물과 따뜻한 물을 50밀리리터씩 담고, 백반을 두 숟가락씩 넣어 유리 막대로 저으며 관찰해요.")
        self.play(FadeIn(bk), FadeIn(t1), FadeIn(t2), run_time=0.8)
        pc, pw = C.pile(0.28), W.pile(0.28)
        self.play(FadeIn(pc, shift=DOWN * 0.5), FadeIn(pw, shift=DOWN * 0.5), run_time=0.6)
        safe = K.safety_note("따뜻한 물을 다룰 때 화상을 입지 않게 조심해요", w=8.4, size=30).move_to([1.6, 2.75, 0])
        self.play(FadeIn(safe), run_time=0.4)
        rods = VGroup(K.L((C.x + 0.4, C.y + 3.2), (C.x - 0.3, C.y + 0.3), "#9BB7C6", 9),
                      K.L((W.x + 0.4, W.y + 3.2), (W.x - 0.3, W.y + 0.3), "#9BB7C6", 9))
        self.play(FadeIn(rods), run_time=0.3)
        for _ in range(2):
            self.play(Rotate(rods[0], 0.4, about_point=[C.x, C.y + 0.3, 0]),
                      Rotate(rods[1], 0.4, about_point=[W.x, W.y + 0.3, 0]), run_time=0.3)
            self.play(Rotate(rods[0], -0.4, about_point=[C.x, C.y + 0.3, 0]),
                      Rotate(rods[1], -0.4, about_point=[W.x, W.y + 0.3, 0]), run_time=0.3)
        self.play(FadeOut(rods), run_time=0.3)
        self.pause_screen(6, "어느 쪽에서 더 많이 녹을까요?")
        self.play(FadeOut(pw), Transform(pc, C.pile(0.16)), FadeOut(safe), run_time=1.2)
        l1 = K.label("바닥에 남았어요", RED, 28).move_to([C.x, C.y + 1.2, 0])
        l2 = K.label("모두 녹아 투명해요", GREEN, 28).move_to([W.x, W.y + 1.2, 0])
        self.say(f"{r('따뜻한 물')}에서는 모두 녹고, {bl('차가운 물')}에서는 바닥에 남았어요",
                 "따뜻한 물에서는 백반이 모두 녹아 투명한 용액이 되었어요. 차가운 물에서는 어느 정도 녹다가 더 이상 녹지 않고 바닥에 남았어요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.settle()
        res = K.text_card([f"차가운 물보다 {r('따뜻한 물')}에 백반이 더 많이 용해돼요."], w=11.4, size=36).move_to([0.4, 2.1, 0])
        self.say(f"물의 온도가 높을수록 백반이 {o('더 많이')} 용해돼요",
                 "물의 양이 같을 때, 차가운 물보다 따뜻한 물에 백반이 더 많이 용해돼요. 물에 용해되는 용질의 양은 물의 온도에 따라 달라요.")
        self.play(FadeOut(t1), FadeOut(t2), FadeIn(res), run_time=0.6)
        self.settle()
        clear_stage(self)
        # 생각 바로잡기
        self.section("생각 바로잡기")
        q = T("차가운 물 바닥에 남은 백반을 아주 오래 저으면 모두 녹을까요?", 38).move_to([0, 2.2, 0])
        if q.width > 13:
            q.scale_to_fit_width(13)
        self.say("바닥에 남은 백반을 아주 오래 저으면 모두 녹을까요?",
                 "차가운 물 바닥에 남은 백반을 아주 오래 저으면 모두 녹을까요?")
        self.play(FadeIn(q), run_time=0.5)
        ans = K.text_card([f"{r('아니요')}. 오래 저어도 더 녹지 않아요.",
                           f"물의 {o('온도를 높이거나')} {o('물을 더 넣어야')} 해요."], w=10.4, size=38).move_to([0, 0.0, 0])
        self.say(f"아니요, 물의 {o('온도를 높이거나')} {o('물을 더 넣어야')} 해요",
                 "아니요. 오래 저어도 더 녹지 않아요. 더 녹이려면 물의 온도를 높이거나 물을 더 넣어야 해요.")
        self.play(FadeIn(ans, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 더 알아보기: 백반 결정 ──
    def crystal(self):
        self.section("더 알아보기")
        G = K.Glass(-2.2, -2.3, 3.0, 3.6, "beaker")
        bk = VGroup(G.liquid(3.1, "#E3F2FA"), G.glass())
        bar = K.L((G.x - 2.0, G.y + G.h + 0.3), (G.x + 2.0, G.y + G.h + 0.3), "#A0784E", 12)
        mo, pts = K.moru(G.x, G.y + 1.6, 0.6)
        thread = K.L((G.x, G.y + G.h + 0.3), (G.x, G.y + 2.2), INK, 3)
        lab = K.label("따뜻해요", RED, 30).move_to([G.x + 3.3, 1.4, 0])
        txt = T("모루\n(공예용 철끈)", 26, SOFT).move_to([-5.6, -0.7, 0])
        txt.add(K.L((-4.6, -0.7), (-2.75, -0.7), SOFT, 3))
        self.say("따뜻한 백반 용액을 천천히 식히면 어떻게 될까요?",
                 "따뜻한 물에 백반을 더 녹지 않을 때까지 녹인 용액에, 모양을 만든 공예용 철끈, 모루를 매달았어요. 이 용액을 천천히 식히면 어떻게 될까요?")
        self.play(FadeIn(bk), FadeIn(bar), FadeIn(thread), Create(mo), FadeIn(lab), FadeIn(txt), run_time=0.9)
        import numpy as np
        cr = VGroup()
        for k in range(16):
            p, q_ = np.array(pts[k % 4]), np.array(pts[(k + 1) % 4])
            f = K.rnd(k, 3)
            cr.add(K.crystal(0.1 + 0.1 * K.rnd(k, 4)).move_to(p + (q_ - p) * f))
        bot = VGroup(*[K.crystal(0.07 + 0.06 * K.rnd(k, 6)).move_to([G.x - 1.1 + 2.2 * K.rnd(k, 5), G.y + 0.15, 0])
                       for k in range(14)])
        lab2 = K.label("식었어요", "#2F86C6", 30).move_to(lab)
        self.play(Transform(lab, lab2), LaggedStart(*[FadeIn(c_, scale=0.3) for c_ in cr], lag_ratio=0.1),
                  FadeIn(bot, lag_ratio=0.1), run_time=2.0)
        card = K.text_card([f"온도가 낮아지면 녹아 있던 백반이", f"더 이상 녹아 있지 못하고", f"{o('바닥에 가라앉거나')} {o('철끈에 붙어')}",
                            "결정이 커져요."], w=6.2, size=30).move_to([3.5, -0.75, 0])
        self.say(f"온도가 낮아지면 녹아 있던 백반이 {o('결정')}으로 나와요",
                 "온도가 낮아지면서 녹아 있던 백반이 더 이상 녹아 있지 못하고 바닥에 가라앉거나 철끈에 달라붙어 결정이 커졌어요. 물의 온도에 따라 용해되는 양이 다르기 때문이에요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"물의 양이 같을 때 물에 용해되는 용질의 양에", f"영향을 주는 요인은 {o('용질의 종류')}, {r('물의 온도')}입니다."],
                           w=12.6, size=40).move_to([0, 0.9, 0])
        self.say(f"녹는 양에 영향을 주는 요인: {o('용질의 종류')}, {r('물의 온도')}",
                 "물의 양이 같을 때 물에 용해되는 용질의 양에 영향을 주는 요인은 용질의 종류와 물의 온도예요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
