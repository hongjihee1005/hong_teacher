"""「과학 원리 돋보기」 4학년 17화 — 버섯과 곰팡이는 어떤 생물일까? (4-1 4단원 다양한 생물과 우리 생활 2~3차시, 화 코드 4-1-4-a)

바탕: grade4/science/sem1/u4-1.html(원본 _build_tb/src/u4-1.html) — 도입(따뜻하고 습기 있는 선반의 빵, 0일 → 7일 곰팡이),
숲속 균류 5곳(죽은 나무의 버섯·나무 속 균사·열매·잎의 곰팡이·낙엽 아래 버섯), 균류 탐정 수첩 5물음(동물·식물과 다른 생물,
균사, 포자, 따뜻하고 습한 곳, 죽은 생물·다른 생물에서 양분), 실체 현미경 6부분과 배율(10배 × 4배 = 40배), 맨눈·돋보기 관찰 표,
실체 현미경 사용 순서와 40배로 본 모습, 공통점 3가지, 한눈에 쏙 '균류는 실처럼 가늘고 긴 균사로 이루어져 있습니다',
생각이 쑥(집에서 곰팡이가 생기기 쉬운 곳 4곳), 형성 평가(열매 ×, 스스로 양분 못 만듦 ◯, 따뜻하고 습한 곳 ◯).
최종: ./make_final.sh s4ep17
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, Circumscribe,
                   SurroundingRectangle, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def item(pic, name, w=2.2, h=1.6, size=30):
    K.fit(pic, w, h)
    lab = T(name, size).next_to(pic, DOWN, buff=0.2)
    return VGroup(pic, lab)


class S4Ep17(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 17
    EP_TITLE = "버섯과 곰팡이는 어떤 생물일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.forest()
        self.scope()
        self.observe()
        self.features()
        self.correct()
        self.home()
        self.summary()
        self.closing(f"버섯과 곰팡이 같은 {o('균류')}는 {r('균사')}로 이루어져 있고 {r('포자')}로 번식해요\n"
                     f"{g('따뜻하고 습한 곳')}에서 잘 자라요",
                     next_preview="4학년 18화 · 해캄과 짚신벌레")
        self.wait(0.5)

    # ── 궁금해요: 선반 위의 빵 ──
    def intro(self):
        self.section("궁금해요")
        shelf = K.R(5.0, 0.22, K.WOOD, 0, -0.85, rad=0.05, stroke=K.WOOD_D, sw=4)
        bd = K.bread(0.0)
        K.fit(bd, 2.4, 2.4).move_to([0, 0.5, 0])
        day = T("처음 놓아둔 날", 40).move_to([0, 2.55, 0])
        self.say("따뜻하고 습기가 있는 선반에 빵을 놓아두었어요",
                 "따뜻하고 습기가 있는 선반에 빵을 놓아두었어요. 오래 놓아두면 빵은 어떻게 될까요?")
        self.play(FadeIn(shelf), FadeIn(bd), FadeIn(day), run_time=0.8)
        self.pause_screen(5, "빵을 오래 놓아두면?")
        for d in (3, 5, 7):
            nb = K.bread(d / 7)
            K.fit(nb, 2.4, 2.4).move_to(bd)
            nd = T(f"{d}일이 지났어요", 40).move_to(day)
            self.play(FadeOut(bd), FadeIn(nb), FadeOut(day), FadeIn(nd), run_time=0.7)
            bd, day = nb, nd
            self.wait(0.3)
        self.say(f"빵에 {r('곰팡이')}가 생겼어요", "빵에 곰팡이가 생겼어요. 곰팡이와 버섯은 어떤 생물일까요?")
        self.play(Indicate(bd.spots, color=K.MOLD_D, scale_factor=1.1), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 숲속에서 ──
    def forest(self):
        self.section("숲속에서")
        ground = K.R(13.4, 0.5, "#B8A27A", 0, -1.85, rad=0.1, stroke=None, sw=0)
        log = K.fit(K.log_mush(), 4.0, 1.6).move_to([-3.9, -0.95, 0])
        fr = K.fit(K.moldy_fruit(), 0.9, 0.9).move_to([0.2, -1.2, 0])
        lf = K.fit(K.moldy_leaf(), 1.5, 0.7).move_to([2.4, -1.35, 0])
        mu = K.fit(K.mushroom(), 0.9, 0.9).move_to([4.7, -1.15, 0])
        lit = VGroup(*[K.moldy_leaf(1.0).rotate(a).move_to([4.7 + dx, -1.55, 0]) for a, dx in ((0.3, -0.6), (-0.2, 0.55))])
        self.say("숲속 어디에서 버섯과 곰팡이를 볼 수 있을까요?", "숲속 어디에서 버섯과 곰팡이를 볼 수 있을까요?")
        self.play(FadeIn(VGroup(ground, log, fr, lf, lit, mu)), run_time=0.9)
        labs = VGroup(T("죽은 나무의 버섯", 28).next_to(log, UP, buff=0.25),
                      T("열매의 곰팡이", 28).next_to(fr, UP, buff=0.5),
                      T("잎의 곰팡이", 28).next_to(lf, UP, buff=0.5),
                      T("낙엽 아래 버섯", 28).next_to(mu, UP, buff=0.5))
        self.say(f"그늘지고 {g('습한')} 숲속의 죽은 나무, 낙엽, 열매에서 자라요",
                 "버섯과 곰팡이는 그늘지고 습한 숲속의 죽은 나무, 낙엽, 열매 등에서 자라요.")
        self.play(FadeIn(labs, lag_ratio=0.25), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 실체 현미경 ──
    def scope(self):
        self.section("실체 현미경")
        sc = K.stereo_scope()
        K.fit(sc, 4.0, 4.6).move_to([-3.3, 0.25, 0])
        p = sc.parts
        names = [("eye", "접안렌즈", "눈으로 보는 렌즈"), ("turret", "회전판", "배율 조절"),
                 ("obj", "대물렌즈", "관찰 대상 쪽 렌즈"), ("focus", "초점 조절 나사", "초점 맞추기"),
                 ("stage", "재물대", "관찰 대상을 올려놓는 곳"), ("light", "조명 조절 나사", "밝기 조절")]
        self.say("버섯과 곰팡이를 자세히 보려면 실체 현미경을 써요",
                 "더 자세히 보려면 실체 현미경을 써요. 각 부분의 이름을 알아봐요.")
        self.play(FadeIn(sc), run_time=0.6)
        rows = VGroup()
        for i, (k, n, d) in enumerate(names):
            row = M(f"{o(n)}  {d}", 30).move_to([2.9, 2.4 - i * 0.78, 0]).align_to([0.5, 0, 0], LEFT)
            rows.add(row)
        arrows = VGroup()
        for i, (k, n, d) in enumerate(names):
            a = Line(rows[i].get_left() + LEFT * 0.12, p[k].get_center(), stroke_color=ORANGE, stroke_width=3)
            arrows.add(a)
        for i in range(6):
            self.play(Create(arrows[i]), FadeIn(rows[i]), Indicate(p[names[i][0]], color=ORANGE), run_time=0.55)
        self.say(f"배율 = 접안렌즈 배율 × 대물렌즈 배율 → 10 × 4 = {o('40배')}",
                 "현미경의 배율은 접안렌즈 배율 곱하기 대물렌즈 배율이에요. 접안렌즈 10배, 대물렌즈 4배이면 40배예요.")
        self.settle()
        clear_stage(self)
        steps = ["① 회전판을 돌려 배율을 가장 낮게 하고 재물대에 올려요",
                 "② 전원을 켜고 조명 조절 나사로 밝기를 조절해요",
                 f"③ {o('옆에서 보며')} 대물렌즈를 관찰 대상에 가깝게 내려요",
                 "④ 접안렌즈로 보며 대물렌즈를 천천히 올려 초점을 맞춰요"]
        card = K.text_card(steps, w=12.6, size=34).move_to([0, 0.5, 0])
        self.say("실체 현미경은 이 순서로 써요",
                 "실체 현미경은 이 순서로 써요. 대물렌즈는 옆에서 보면서 내려야 관찰 대상에 닿지 않아요.")
        self.play(FadeIn(card), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 관찰해요 ──
    def observe(self):
        self.section("관찰해요")
        mu = K.fit(K.mushroom(), 1.6, 1.6)
        mo = K.fit(K.bread(1.0), 1.6, 1.6)
        hd = VGroup(T("버섯", 36).move_to([-1.2, 2.6, 0]), T("곰팡이", 36).move_to([4.0, 2.6, 0]))
        rl = VGroup(T("맨눈", 34).move_to([-5.6, 1.35, 0]), T("돋보기", 34).move_to([-5.6, -0.65, 0]))
        lines = VGroup(Line([-6.6, 2.15, 0], [6.6, 2.15, 0], stroke_color=SOFT, stroke_width=3),
                       Line([-6.6, 0.35, 0], [6.6, 0.35, 0], stroke_color=SOFT, stroke_width=3),
                       Line([-4.6, 2.9, 0], [-4.6, -1.7, 0], stroke_color=SOFT, stroke_width=3),
                       Line([1.4, 2.9, 0], [1.4, -1.7, 0], stroke_color=SOFT, stroke_width=3))
        c1 = VGroup(mu.move_to([-3.6, 1.25, 0]), M("우산 같은 윗부분,\n막대 같은 아랫부분", 26).move_to([-0.6, 1.25, 0]))
        c2 = VGroup(mo.move_to([2.4, 1.25, 0]), M("솜털 같은 것이\n보여요", 26).move_to([4.9, 1.25, 0]))
        gill = K.fit(K.mushroom_under(), 1.5, 1.5).move_to([-3.6, -0.7, 0])
        tuft = K.fit(K.mold_tuft(), 1.7, 1.4).move_to([2.4, -0.7, 0])
        c3 = VGroup(gill, M("윗부분 안쪽에\n주름이 많아요", 26).move_to([-0.6, -0.7, 0]))
        c4 = VGroup(tuft, M(f"솜털 끝에\n{o('둥근 알갱이')}", 26).move_to([4.9, -0.7, 0]))
        self.say("버섯과 곰팡이를 맨눈과 돋보기로 관찰해요",
                 "버섯과 곰팡이를 맨눈과 돋보기로 관찰해요. 곰팡이는 맨손으로 만지거나 코에 갖다 대지 않아요.")
        self.play(FadeIn(VGroup(hd, rl, lines)), run_time=0.6)
        self.play(FadeIn(c1), FadeIn(c2), run_time=0.8)
        self.say("맨눈: 버섯은 우산과 막대 모양, 곰팡이는 솜털 같아요",
                 "맨눈으로 보면 버섯은 윗부분이 우산처럼, 아랫부분은 막대처럼 생겼어요. 곰팡이는 솜털 같은 것이 보여요.")
        self.play(FadeIn(c3), FadeIn(c4), run_time=0.8)
        self.say(f"돋보기: 버섯 안쪽에 주름, 곰팡이 끝에 {o('둥근 알갱이')}",
                 "돋보기로 보면 버섯은 윗부분 안쪽에 주름이 많이 보여요. 곰팡이는 솜털 끝부분에 둥근 알갱이가 달려 있어요.")
        self.settle()
        clear_stage(self)

        # 실체 현미경 40배
        v1 = K.hyphae_view(1.7).move_to([-3.3, 0.45, 0])
        v2 = K.mold_view(1.7).move_to([3.3, 0.45, 0])
        l1 = T("버섯의 균사", 34).next_to(v1, DOWN, buff=0.22)
        l2 = T("곰팡이", 34).next_to(v2, DOWN, buff=0.22)
        self.say("실체 현미경(40배)으로 보면 어떤 모습일까요?",
                 "이번에는 실체 현미경 40배로 버섯의 균사와 곰팡이를 관찰해요. 어떤 모습일지 예상해 봐요.")
        self.pause_screen(5, "40배로 보면 어떤 모습일까요?")
        self.play(FadeIn(v1, scale=0.8), FadeIn(l1), run_time=0.8)
        self.say(f"버섯의 균사: 실처럼 가늘고 긴 가닥이 {o('거미줄처럼')} 엉켜 있어요",
                 "버섯의 균사는 실처럼 가늘고 긴 가닥이 거미줄처럼 엉켜 있어요.")
        self.play(FadeIn(v2, scale=0.8), FadeIn(l2), run_time=0.8)
        self.say(f"곰팡이: 가늘고 긴 가닥 끝에 {o('둥근 알갱이')}가 많아요",
                 "곰팡이는 가늘고 긴 가닥 끝에 둥근 알갱이가 많이 달려 있어요. 이 알갱이는 포자가 든 주머니예요.")
        self.settle()
        clear_stage(self)

    # ── 균류의 특징 ──
    def features(self):
        self.section("균류의 특징")
        lines = [f"① 실처럼 가늘고 긴 {r('균사')}로 이루어져 있어요",
                 f"② {r('포자')}로 번식해요",
                 f"③ {g('따뜻하고 습한 곳')}에서 잘 자라요",
                 f"④ 스스로 양분을 만들지 못해 {o('죽은 생물이나 다른 생물')}에서 얻어요"]
        cards = VGroup(*[K.text_card([l], w=12.6, size=34, pad=0.22) for l in lines]).arrange(DOWN, buff=0.22).move_to([0, 0.3, 0])
        narr = ["버섯과 곰팡이의 공통점이에요. 실처럼 가늘고 긴 균사로 이루어져 있어요.",
                "포자로 번식해요. 번식은 생물이 자손을 늘리는 것이에요.",
                "따뜻하고 습한 곳에서 잘 자라요.",
                "스스로 양분을 만들지 못해 죽은 생물이나 다른 생물에서 양분을 얻어요."]
        for c, l, n in zip(cards, lines, narr):
            self.say(l, n)
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.5)
        self.say(f"버섯과 곰팡이 같은 생물을 {o('균류')}라고 해요",
                 "버섯과 곰팡이는 동물이나 식물과 다른 생물이에요. 이런 생물을 균류라고 해요.")
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def correct(self):
        self.section("생각 바로잡기")
        q = T("버섯은 식물일까요?", 48).move_to([0, 2.4, 0])
        mu = K.fit(K.mushroom(), 2.0, 2.0).move_to([-5.4, 0.1, 0])
        self.say("버섯은 땅에서 자라니까 식물일까요?", "버섯은 땅이나 나무에서 자라니까 식물일까요?")
        self.play(FadeIn(q), FadeIn(mu), run_time=0.6)
        rows = VGroup(*[M(t, 34) for t in [
            f"뿌리·줄기·잎이 {r('없어요')}",
            f"꽃이 피고 열매를 맺지 {r('않아요')} → 포자로 번식",
            f"햇빛으로 양분을 {r('만들지 못해요')}"]]).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to([1.3, 0.1, 0])
        xs = VGroup(*[K.ox_mark(False, 0.18).next_to(rw, LEFT, buff=0.3) for rw in rows])
        self.say(f"버섯은 식물이 {r('아니에요')}",
                 "버섯은 식물이 아니에요. 뿌리, 줄기, 잎이 없고, 열매가 아니라 포자로 번식해요. 햇빛으로 양분을 만들지도 못해요.")
        self.play(FadeIn(rows, lag_ratio=0.3), FadeIn(xs, lag_ratio=0.3), run_time=1.5)
        self.settle()
        clear_stage(self)

    # ── 생활 속 ──
    def home(self):
        self.section("생활 속 곰팡이")
        self.say("집에서 곰팡이가 생기기 쉬운 곳은 어디일까요?", "집에서 곰팡이가 생기기 쉬운 곳은 어디일까요?")
        bath = VGroup(K.R(2.0, 1.7, "#DDEFF7", 0, 0.2, rad=0.05, stroke="#9AA6B0", sw=3),
                      *[K.L((-1.0, -0.4 + k * 0.4), (1.0, -0.4 + k * 0.4), "#B7D3E0", 2) for k in range(4)],
                      K.R(2.0, 0.8, "#FFFFFF", 0, -0.55, rad=0.3, stroke="#9AA6B0", sw=4),
                      K.R(1.7, 0.18, "#9ED3EE", 0, -0.25, rad=0.08, stroke=None, sw=0),
                      *[K.C(rr, "#5A6A5A", x, y, stroke=None, sw=0, op=0.6) for x, y, rr in ((-0.75, 0.85, 0.12), (-0.6, 0.95, 0.07))])
        wall = VGroup(K.R(1.6, 1.6, "#EDE3D0", 0, 0, rad=0.02, stroke="#9C8F7E", sw=4),
                      *[K.C(rr, "#5A6A5A", x, y, stroke=None, sw=0, op=0.6) for x, y, rr in ((0.55, 0.55, 0.18), (0.4, 0.62, 0.1), (0.62, 0.35, 0.09))])
        cellar = VGroup(K.R(1.8, 1.4, "#55606A", 0, 0, rad=0.05, stroke=INK, sw=4),
                        *[K.R(1.4, 0.1, "#3A434B", 0, -0.45 + k * 0.32, rad=0.02, stroke=None, sw=0) for k in range(4)])
        food = K.bread(0.8)
        items = [item(bath, "욕실"), item(wall, "습기 찬 벽 모서리"), item(cellar, "지하실"), item(food, "오래된 음식")]
        grp = VGroup(*items).arrange(RIGHT, buff=0.7).move_to([0, 0.5, 0])
        if grp.width > 13:
            grp.scale_to_fit_width(13)
        self.play(FadeIn(grp, lag_ratio=0.15), run_time=1.0)
        self.say(f"햇빛이 잘 들지 않고 {g('습기가 많은 곳')}에 잘 생겨요",
                 "곰팡이는 햇빛이 잘 들지 않고 습기가 많은 욕실, 벽면, 지하실이나 오래된 음식에 생기기 쉬워요.")
        self.play(*[Indicate(it[0], color=ORANGE, scale_factor=1.06) for it in items], run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"균류는 실처럼 가늘고 긴 {r('균사')}로 이루어져 있습니다.",
                            f"버섯과 곰팡이는 {r('포자')}로 번식하고,",
                            f"{g('따뜻하고 습한 곳')}에서 잘 자랍니다."], w=12.6, size=42).move_to([0, 0.6, 0])
        self.say(f"균류는 실처럼 가늘고 긴 {r('균사')}로 이루어져 있어요",
                 "균류는 실처럼 가늘고 긴 균사로 이루어져 있어요. 버섯과 곰팡이는 포자로 번식하고, 따뜻하고 습한 곳에서 잘 자라요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
