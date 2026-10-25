"""「과학 원리 돋보기」 3학년 22화 — 물질의 세 가지 상태 (3-2 1단원 물질의 성질 4차시, 화 코드 3-2-1-c)

바탕: grade3/science/sem2/u1-3.html — 도입(바닷가: 파라솔·바닷물·공기·모래), 그림 카드 분류
(축구공·비눗방울·풍선 속 공기, 주스·우유·물·꿀, 안경·책·가위 — 기준 ① 눈에 보이는가? ② 손으로 잡을 수 있는가? → 세 무리 고체·액체·기체),
나만의 기준('단단한가?'는 좋은 기준이 아님 — 찰흙·스펀지), 손으로 잡아 보기(나무 블록·물·공기, 공기 보기 안경은 점 표시),
바닷가에서 찾기(8가지), 생각 바로잡기 OX, 한눈에 쏙, 형성 평가(뚜껑을 닫은 주스 병 ㉠ 뚜껑 ㉡ 병 속 빈 곳 ㉢ 주스).
최종: ./make_final.sh s3ep22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, VGroup, RoundedRectangle,
                   Rectangle, Circumscribe)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u21 as K
import kit_s3u12 as K12


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


S_COL = {"고체": "#B9834E", "액체": "#2F7FC1", "기체": "#7A4FB0"}


def st_tag(s, size=34):
    t = T(s, size, PAPER)
    bx = RoundedRectangle(corner_radius=0.15, width=t.width + 0.4, height=t.height + 0.26, fill_color=S_COL[s],
                          fill_opacity=1, stroke_width=0)
    t.move_to(bx)
    return VGroup(bx, t)


# (이름, 그림, 상태 0 고체 · 1 액체 · 2 기체) — 앱 그림 카드 차례
CARDS = [("축구공 속 공기", K.soccer_ball, 2), ("비눗방울 속 공기", K.bubble, 2), ("주스", K.drink_glass, 1),
         ("우유", lambda: K.drink_glass(PAPER, 0.75), 1), ("안경", K.glasses, 0), ("풍선 속 공기", K.balloon, 2),
         ("책", K.book, 0), ("물", lambda: K.drink_glass(K.WATER, 0.65), 1), ("가위", K.scissors, 0), ("꿀", K.honey, 1)]


class S3Ep22(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 22
    EP_TITLE = "물질의 세 가지 상태"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.beach_intro()
        self.cards()
        self.grab()
        self.beach_find()
        self.summary()
        self.check()
        self.closing(f"우리 주변의 물질은 {o('고체')}, {b_('액체')}, {g('기체')}\n세 가지 상태로 있어요",
                     next_preview="3학년 23화 · 고체·액체·기체는 어떻게 다를까?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def beach_intro(self):
        self.section("궁금해요")
        bc = K.beach()
        self.beach = bc
        self.say("바닷가에서 어떤 물질을 볼 수 있나요?", "바닷가에서 어떤 물질을 볼 수 있을까요?")
        self.play(FadeIn(bc), run_time=0.8)
        labs = VGroup()
        for n, (x, y) in (("파라솔", (-4.6, 2.0)), ("바닷물", (-0.6, 0.9)), ("모래", (3.6, -2.1))):
            labs.add(K12.text_card([n], size=32).move_to([x, y, 0]))
        air = VGroup(K.air_dots(-1.5, 1.5, 1.6, 2.7, 22, seed=2), K12.text_card(["공기 (눈에 보이지 않아요)"], size=30).move_to([0.6, 2.2, 0]))
        self.say(f"파라솔, 바닷물, 모래, 그리고 {o('공기')}", "파라솔, 바닷물, 모래가 있어요. 눈에 보이지 않지만 공기도 있어요.")
        self.play(FadeIn(labs, lag_ratio=0.25), run_time=0.9)
        self.play(FadeIn(air), run_time=0.5)
        self.say("이 물질들은 성질이 모두 같을까요?", "이 물질들은 성질이 모두 같을까요? 그림 카드로 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 그림 카드 분류 ──
    def cards(self):
        self.section("분류해요")
        cs = VGroup()
        for i, (n, f, s) in enumerate(CARDS):
            c = K12.card(n, 1.95, 1.35, 24, pic=f)
            c.move_to([-5.6 + (i % 5) * 2.8, 1.95 - (i // 5) * 1.5, 0])
            c.state = s
            cs.add(c)
        self.say("그림 카드를 기준에 따라 나누어 봐요", "그림 카드 열 장을 분류 기준에 따라 나누어 볼까요?")
        self.play(FadeIn(cs, lag_ratio=0.08), run_time=1.2)
        b1 = K12.bin_box("○ 그렇다", 6.6, 2.4, GREEN, 30).move_to([-3.45, -1.45, 0])
        b2 = K12.bin_box("× 그렇지 않다", 6.6, 2.4, RED, 30).move_to([3.45, -1.45, 0])
        self.say(f"기준 ① {o('눈에 보이는가?')}", "첫 번째 기준은 눈에 보이는가예요.")
        self.play(FadeIn(b1), FadeIn(b2), run_time=0.6)
        self.pause_screen(5, "눈에 보이지 않는 것은?")
        yes = [c for c in cs if c.state < 2]
        no = [c for c in cs if c.state == 2]
        p1 = K12.slots(-3.45, -1.22, len(yes), 5, 1.3, 0.92)
        p2 = K12.slots(3.45, -1.22, len(no), 5, 1.3, 0.92)
        self.say(f"공기는 {r('눈에 보이지 않아요')}", "축구공, 비눗방울, 풍선 속 공기는 눈에 보이지 않아요. 나머지는 눈에 보여요.")
        self.play(*[c.animate.scale(0.6).move_to(p) for c, p in zip(yes, p1)],
                  *[c.animate.scale(0.6).move_to(p) for c, p in zip(no, p2)], run_time=1.4)
        self.settle()
        # 기준 ②
        q2 = M(f"기준 ② {o('손으로 잡을 수 있는가?')}", 40).move_to([0, 2.5, 0])
        self.say(f"기준 ② {o('손으로 잡을 수 있는가?')}", "두 번째 기준은 손으로 잡을 수 있는가예요. 눈에 보이는 것 가운데 손으로 잡을 수 있는 것은 무엇일까요?")
        self.play(FadeIn(q2), run_time=0.5)
        self.pause_screen(4, "손으로 잡을 수 있는 것은?")
        titles = ["보이고, 잡을 수 있음", "보이지만, 잡을 수 없음", "보이지 않고, 잡을 수 없음"]
        cols = [S_COL["고체"], S_COL["액체"], S_COL["기체"]]
        nb = VGroup()
        for k in range(3):
            bb = K12.bin_box(titles[k], 4.45, 3.0, cols[k], 25).move_to([-4.6 + k * 4.6, -0.55, 0])
            nb.add(bb)
        anims = []
        for k in range(3):
            grp = [c for c in cs if c.state == k]
            ps = K12.slots(nb[k].box.get_center()[0], -0.2, len(grp), 3, 1.4, 1.0)
            anims += [c.animate.move_to(p) for c, p in zip(grp, ps)]
        self.say("특징이 비슷한 것끼리 세 무리로 묶어요", "안경, 책, 가위는 손으로 잡을 수 있어요. 주스, 우유, 물, 꿀은 손으로 잡을 수 없어요. 세 무리로 묶어 볼까요?")
        self.play(FadeOut(b1), FadeOut(b2), FadeOut(q2), FadeIn(nb), *anims, run_time=1.4)
        tags = VGroup(*[st_tag(s, 40).next_to(nb[k], UP, buff=0.15) for k, s in enumerate(["고체", "액체", "기체"])])
        self.say(f"세 무리는 {o('고체')}, {b_('액체')}, {g('기체')}예요",
                 "이 세 무리를 고체, 액체, 기체라고 해요. 물질의 세 가지 상태예요.")
        self.play(FadeIn(tags, lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 손으로 잡아 보기 ──
    def grab(self):
        self.section("잡아 봐요")
        xs = [-4.6, 0.0, 4.6]
        heads = VGroup(*[st_tag(s, 34).move_to([x, 2.25, 0]) for x, s in zip(xs, ["고체", "액체", "기체"])])
        blk = K.fit(K.wood_block(), 1.2, 1.0).move_to([xs[0], -1.3, 0])
        bowl = K.fit(K.bowl_water(), 2.6, 0.9).move_to([xs[1], -1.4, 0])
        hands = [K.hand(False, 0.85).move_to([x, 0.95, 0]) for x in xs]
        names = VGroup(T("나무 블록", 30).move_to([xs[0], -2.2, 0]), T("물", 30).move_to([xs[1], -2.2, 0]),
                       T("공기 (점으로 나타냈어요)", 28).move_to([xs[2], -2.2, 0]))
        self.say("나무 블록, 물, 공기를 손으로 잡아 보면?", "나무 블록, 물, 공기를 손으로 잡아 보면 어떻게 될까요?")
        self.play(FadeIn(heads), FadeIn(blk), FadeIn(bowl), FadeIn(names), *[FadeIn(h) for h in hands], run_time=0.8)
        # 고체
        h0 = hands[0]
        self.play(h0.animate.move_to(blk.get_top() + UP * 0.6), run_time=0.6)
        c0 = K.hand(True, 0.85).move_to(h0.get_center() + DOWN * 0.15)
        self.remove(h0); self.add(c0)
        self.say(f"나무 블록은 {g('잡아서 들어 올릴 수 있어요')}", "나무 블록은 눈으로 볼 수 있고, 손으로 잡아 들어 올릴 수 있어요. 모양도 그대로예요.")
        self.play(c0.animate.shift(UP * 1.0), blk.animate.shift(UP * 1.0), run_time=0.8)
        # 액체
        h1 = hands[1]
        self.play(h1.animate.move_to(bowl.get_center() + UP * 0.55), run_time=0.6)
        c1 = K.hand(True, 0.85).move_to(h1.get_center() + DOWN * 0.15)
        self.remove(h1); self.add(c1)
        self.say(f"물은 손가락 사이로 {r('흘러내려요')}", "물은 눈으로 볼 수 있지만, 손가락 사이로 흘러내려서 손으로 잡을 수 없어요.")
        self.play(c1.animate.shift(UP * 1.2), run_time=0.7)
        drops = VGroup(*[K.drop(0.1).move_to(c1.get_bottom() + RIGHT * dx + DOWN * 0.1) for dx in (-0.25, 0.0, 0.25)])
        self.play(FadeIn(drops), run_time=0.2)
        self.play(drops.animate.shift(DOWN * 1.3), run_time=0.7)
        self.play(FadeOut(drops), run_time=0.2)
        # 기체
        h2 = hands[2]
        dots = K.air_dots(xs[2] - 2.0, xs[2] + 2.0, -1.8, 1.7, 45, seed=4)
        self.say(f"공기는 {r('보이지 않고, 잡히지도 않아요')}", "공기는 눈에 보이지 않고, 손으로 움켜쥐어도 잡히지 않아요. 하지만 우리 주변을 가득 채우고 있어요.")
        self.play(FadeIn(dots), run_time=0.5)
        self.play(h2.animate.shift(LEFT * 1.0 + DOWN * 0.8), run_time=0.4)
        self.play(h2.animate.shift(RIGHT * 2.0), run_time=0.5)
        c2 = K.hand(True, 0.85).move_to(h2.get_center())
        self.remove(h2); self.add(c2)
        self.play(c2.animate.shift(LEFT * 1.0 + UP * 0.8), run_time=0.5)
        self.settle()
        clear_stage(self)
        # 생각 바로잡기
        self.section("생각 바로잡기")
        q1 = M(f"“고체는 모두 단단해요.”  {r('×')}", 46).move_to([0, 1.8, 0])
        a1 = T("찰흙이나 스펀지는 말랑말랑하지만 고체예요", 36, GREEN).move_to([0, 1.0, 0])
        q2 = M(f"“눈에 보이지 않으면 아무것도 없어요.”  {r('×')}", 46).move_to([0, -0.2, 0])
        a2 = T("공기는 보이지 않지만 우리 주변을 채우고 있어요", 36, GREEN).move_to([0, -1.0, 0])
        self.say(f"고체는 모두 단단할까요? {r('아니에요')}", "고체는 모두 단단할까요? 아니에요. 찰흙이나 스펀지는 말랑말랑하지만 고체예요.")
        self.play(FadeIn(q1), run_time=0.4)
        self.play(FadeIn(a1), run_time=0.4)
        self.say(f"눈에 보이지 않으면 없는 걸까요? {r('아니에요')}", "눈에 보이지 않으면 아무것도 없는 걸까요? 아니에요. 공기가 있어요.")
        self.play(FadeIn(q2), run_time=0.4)
        self.play(FadeIn(a2), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 바닷가에서 찾기 ──
    def beach_find(self):
        self.section("찾아봐요")
        bc = K.beach()
        self.say("바닷가에서 고체, 액체, 기체를 찾아봐요", "다시 바닷가예요. 그림에서 고체, 액체, 기체를 찾아볼까요? 모두 여덟 가지예요.")
        self.play(FadeIn(bc), run_time=0.7)
        state = {"바닷물": "액체", "파라솔": "고체", "튜브 속 공기": "기체", "서핑보드": "고체", "비치볼 속 공기": "기체",
                 "장난감 삽": "고체", "음료수": "액체", "모래": "고체"}
        spots = {"파라솔": (-4.6, 2.05, 1), "바닷물": (-1.2, 0.85, 1), "튜브 속 공기": (2.3, 1.75, 1), "서핑보드": (5.4, 0.95, -1),
                 "비치볼 속 공기": (-1.2, -0.45, 1), "장난감 삽": (2.1, -0.75, 1), "음료수": (-3.4, -0.75, -1), "모래": (3.9, -2.1, 1)}
        names = VGroup()
        for n, (x, y, sd) in spots.items():
            names.add(K12.text_card([n], size=24, pad=0.16).move_to([x, y, 0]))
        self.play(FadeIn(names, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(5, "고체·액체·기체를 찾아봐요")
        tags = VGroup()
        for card, (n, (x, y, sd)) in zip(names, spots.items()):
            tags.add(st_tag(state[n], 24).next_to(card, RIGHT if sd > 0 else LEFT, buff=0.08))
        for k, sub, narr in (("고체", f"파라솔·서핑보드·장난감 삽·모래는 {o('고체')}",
                              "파라솔, 서핑보드, 장난감 삽, 모래는 고체예요."),
                             ("액체", f"바닷물·음료수는 {b_('액체')}", "바닷물과 음료수는 액체예요."),
                             ("기체", f"튜브 속·비치볼 속 공기는 {g('기체')}", "튜브 속 공기와 비치볼 속 공기는 기체예요.")):
            self.say(sub, narr)
            self.play(*[FadeIn(t, scale=1.3) for t, n in zip(tags, spots) if state[n] == k], run_time=0.6)
        self.say(f"모래는 알갱이 하나하나의 {o('모양이 변하지 않는')} 고체예요",
                 "모래는 부으면 흐르는 것처럼 보이지만, 알갱이 하나하나는 모양이 변하지 않는 고체예요.")
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        rows = [("고체", "있어요", "있어요"), ("액체", "있어요", "없어요"), ("기체", "대부분 없어요", "없어요")]
        cw = [2.4, 4.6, 4.6]
        x0 = -sum(cw) / 2
        y0, rh = 2.2, 1.1
        grp = VGroup()
        for j, h in enumerate(["", "눈으로 볼 수", "손으로 잡을 수"]):
            grp.add(T(h, 36).move_to([x0 + sum(cw[:j]) + cw[j] / 2, y0, 0]))
        for i, (s, a, b2) in enumerate(rows):
            y = y0 - (i + 1) * rh
            grp.add(Line([x0, y + rh / 2, 0], [x0 + sum(cw), y + rh / 2, 0], stroke_color=SOFT, stroke_width=3))
            grp.add(st_tag(s, 38).move_to([x0 + cw[0] / 2, y, 0]))
            grp.add(T(a, 38, GREEN if a == "있어요" else RED).move_to([x0 + cw[0] + cw[1] / 2, y, 0]))
            grp.add(T(b2, 38, GREEN if b2 == "있어요" else RED).move_to([x0 + cw[0] + cw[1] + cw[2] / 2, y, 0]))
        self.say(f"{o('고체')}는 눈으로 볼 수 있고, 손으로 잡을 수 있어요", "고체는 눈으로 볼 수 있고, 손으로 잡을 수 있어요.")
        self.play(FadeIn(grp[:3]), run_time=0.5)
        self.play(FadeIn(grp[3:7]), run_time=0.6)
        self.say(f"{b_('액체')}는 볼 수 있지만, 잡을 수 없어요", "액체는 눈으로 볼 수 있지만, 손으로 잡을 수 없어요.")
        self.play(FadeIn(grp[7:11]), run_time=0.6)
        self.say(f"{g('기체')}는 대부분 볼 수 없고, 잡을 수도 없어요", "기체는 대부분 눈으로 볼 수 없고, 손으로 잡을 수도 없어요.")
        self.play(FadeIn(grp[11:]), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        jb = K.fit(K.juice_bottle(), 1.8, 3.2).move_to([-2.5, 0.2, 0])
        marks = [("㉠ 뚜껑", jb.lid, "고체"), ("㉡ 병 속 빈 곳", jb.space, "기체"), ("㉢ 주스", jb.juice, "액체")]
        rows = VGroup()
        for i, (n, part, s) in enumerate(marks):
            y = 1.6 - i * 1.3
            t = T(n, 38).move_to([1.6, y, 0], aligned_edge=LEFT).shift(LEFT * 0.6)
            ln = Line(part.get_right() + RIGHT * 0.05, t.get_left() + LEFT * 0.12, stroke_color=SOFT, stroke_width=3)
            rows.add(VGroup(ln, t))
        self.say("뚜껑을 닫아 놓은 주스 병이에요. 각 부분의 상태는?", "뚜껑을 닫아 놓은 주스 병이에요. 뚜껑, 병 속 빈 곳, 주스는 각각 어떤 상태일까요?")
        self.play(FadeIn(jb), FadeIn(rows, lag_ratio=0.2), run_time=1.0)
        self.pause_screen(5, "㉠ ㉡ ㉢은 어떤 상태일까요?")
        tags = VGroup(*[st_tag(s, 36).next_to(rows[i][1], RIGHT, buff=0.35) for i, (_, _, s) in enumerate(marks)])
        self.say(f"뚜껑은 {o('고체')}, 빈 곳의 공기는 {g('기체')}, 주스는 {b_('액체')}",
                 "뚜껑은 고체, 병 속 빈 곳에 있는 공기는 기체, 주스는 액체예요.")
        self.play(FadeIn(tags, lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)
