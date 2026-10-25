"""「과학 원리 돋보기」 3학년 18화 — 여러 동물의 한살이 (3-1 4단원 생물의 한살이 8차시, 화 코드 3-1-4-d)

바탕: grade3/science/sem1/u4-6.html — 도입(얼룩무늬 작은 알 → 메추라기 알, 곤충 외에도 여러 동물이 알을 낳고 새끼를 낳는 동물도 있음),
한살이 탐험 자료(개구리: 알(물속) → 올챙이(어미와 다른 모습) → 뒷다리가 나온 올챙이 → 앞다리가 나오고 꼬리가 짧아진 어린 개구리 → 다 자란 개구리,
사마귀: 알(알집) → 애벌레(허물을 벗으며 자람, 배추흰나비와 달리 번데기 단계가 없음) → 다 자란 사마귀,
개: 갓 태어난 강아지(어미와 모습이 비슷, 눈을 뜨지 못하고 어미젖) → 큰 강아지(어미와 같은 먹이) → 다 자란 개),
공통점(다 자란 암컷이 알이나 새끼를 낳음)·차이점, 분류(오리·개구리·바다거북·사마귀·배추흰나비·닭·메추라기·사슴벌레 / 토끼·코끼리·돌고래·개),
알을 낳는 장소(개구리 물속, 바다거북 육지(모래밭) 구덩이, 사마귀 풀이나 나무줄기에 알집), 형성 평가 2(새끼 수는 종류마다 다름), 한눈에 쏙.
앱은 '완전 탈바꿈·불완전 탈바꿈'이라는 말을 쓰지 않아 영상에서도 쓰지 않음(번데기 단계가 있는지로만 비교).
최종: ./make_final.sh s3ep18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Arrow, Create, FadeIn, FadeOut, Indicate, Line, Rectangle, RoundedRectangle,
                   VGroup, LaggedStart, SurroundingRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import BROWN, BROWN_DARK, RED, clear_stage, tag
from kit_s3u14 import bf_egg, butterfly, caterpillar, dog, frog_stage, mantis, ootheca, pupa, quail_egg


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def chain(pics, labels, y=0.4, x0=-5.9, x1=5.9, label_size=28, max_label=2.3):
    """그림을 왼쪽에서 오른쪽으로 늘어놓고 사이에 화살표. (그림 묶음, 화살표들) 반환"""
    n = len(pics)
    xs = np.linspace(x0, x1, n)
    items = VGroup()
    for x, p, lab in zip(xs, pics, labels):
        p.move_to([x, y, 0])
        lines = lab.split("\n")
        t = VGroup(*[T(l, label_size, INK) for l in lines]).arrange(DOWN, buff=0.08)
        if t.width > max_label:
            t.scale_to_fit_width(max_label)
        t.move_to([x, y - 1.25, 0], aligned_edge=UP)
        items.add(VGroup(p, t))
    arrows = VGroup()
    for i in range(n - 1):
        a = items[i][0].get_right() + RIGHT * 0.12
        b_ = items[i + 1][0].get_left() + LEFT * 0.12
        a[1] = b_[1] = y
        if b_[0] - a[0] < 0.35:
            mid = (xs[i] + xs[i + 1]) / 2
            a = np.array([mid - 0.25, y, 0])
            b_ = np.array([mid + 0.25, y, 0])
        arrows.add(Arrow(a, b_, buff=0, color=ORANGE, stroke_width=6, max_tip_length_to_length_ratio=0.45))
    return items, arrows


class S3Ep18(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 18
    EP_TITLE = "여러 동물의 한살이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.frog()
        self.mantis_part()
        self.dog_part()
        self.compare()
        self.sort()
        self.places()
        self.closing(f"개구리처럼 {o('알')}을 낳는 동물도, 개처럼 {o('새끼')}를 낳는 동물도 있어요\n동물에 따라 한살이 과정이 달라요",
                     next_preview="3학년 19화 · 한해살이 식물과 여러해살이 식물")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        eggs = VGroup(*[quail_egg(1.1).rotate(a) for a in (0.2, -0.3, 0.1)]).arrange(RIGHT, buff=0.3).move_to([0, 0.6, 0])
        self.say("작은 알에 얼룩무늬가 있어요. 어떤 동물이 나올까요?",
                 "작은 알에 얼룩무늬가 있어요. 이 알에서 나중에 어떤 동물이 나올까요?")
        self.play(LaggedStart(*[FadeIn(e, scale=0.6) for e in eggs], lag_ratio=0.25), run_time=0.9)
        self.pause_screen(4, "어떤 동물의 알일까요?")
        ans = tag("메추라기", ORANGE, 44).move_to([0, -1.2, 0])
        self.say(f"{o('메추라기')} 알이에요", "메추라기 알이에요. 배추흰나비 같은 곤충 말고도 여러 동물이 알을 낳아요. 새끼를 낳는 동물도 있어요.")
        self.play(FadeIn(ans, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 개구리 ──
    def frog(self):
        self.section("알을 낳는 동물 · 개구리")
        water = Rectangle(width=14.2, height=4.0, fill_color="#D6ECF6", fill_opacity=0.55, stroke_width=0).move_to([0, 0.1, 0])
        pics = [frog_stage(0, 1.0), frog_stage(1, 0.95), frog_stage(2, 0.95), frog_stage(3, 1.15), frog_stage(4, 1.15)]
        labels = ["알", "올챙이", "뒷다리가\n나온 올챙이", "앞다리가 나오고\n꼬리가 짧아진\n어린 개구리", "다 자란 개구리"]
        items, arrows = chain(pics, labels, y=0.9, x0=-5.7, x1=5.7)
        self.play(FadeIn(water), run_time=0.4)
        narr = ["개구리는 물속에 알을 낳아요.",
                "알에서 나온 올챙이는 어미와 다른 모습이에요.",
                "올챙이가 자라면 뒷다리가 먼저 나와요.",
                "그다음 앞다리가 나오고, 꼬리가 점점 짧아져 어미와 비슷한 모습이 돼요.",
                "다 자란 개구리는 물과 땅을 오가며 살아요. 다 자란 암컷과 수컷이 짝짓기를 하고, 암컷이 알을 낳아요."]
        subs = [f"개구리는 {o('물속')}에 알을 낳아요", "올챙이는 어미와 다른 모습이에요", f"{o('뒷다리')}가 먼저 나와요",
                f"{o('앞다리')}가 나오고 꼬리가 짧아져요", "다 자란 암컷이 다시 알을 낳아요"]
        for i in range(5):
            self.say(subs[i], narr[i])
            anims = [FadeIn(items[i], shift=UP * 0.2)]
            if i > 0:
                anims.insert(0, Create(arrows[i - 1]))
            self.play(*anims, run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 사마귀 ──
    def mantis_part(self):
        self.section("알을 낳는 동물 · 사마귀")
        top = [ootheca(1.0), mantis(0.5), mantis(0.82)]
        items, arrows = chain(top, ["알(알집)", "애벌레", "다 자란 사마귀"], y=1.75, x0=-3.3, x1=4.6)
        items[1][0].shift(DOWN * 0.15)
        name1 = tag("사마귀", GREEN, 32).move_to([-5.9, 1.75, 0])
        self.say("사마귀도 곤충이에요. 알집에 알을 낳아요",
                 "사마귀도 곤충이에요. 암컷 사마귀는 풀이나 나무줄기에 알집을 만들고 알을 낳아요.")
        self.play(FadeIn(name1), FadeIn(items[0]), run_time=0.5)
        self.say(f"애벌레는 허물을 벗으며 자라 바로 어른이 돼요",
                 "알에서 나온 애벌레는 허물을 벗으며 자라서, 다 자란 사마귀가 돼요.")
        self.play(Create(arrows[0]), FadeIn(items[1]), run_time=0.5)
        self.play(Create(arrows[1]), FadeIn(items[2]), run_time=0.5)
        bpics = [bf_egg(0.7), caterpillar(1.4), pupa(1.1), butterfly(0.42)]
        bitems, barrows = chain(bpics, ["알", "애벌레", "번데기", "어른벌레"], y=-0.6, x0=-3.3, x1=4.6)
        name2 = tag("배추흰나비", ORANGE, 32).move_to([-5.9, -0.6, 0])
        if name2.width > 1.9:
            name2.scale_to_fit_width(1.9)
        self.say("배추흰나비의 한살이와 견주어 봐요", "배추흰나비의 한살이와 견주어 볼까요? 무엇이 다른가요?")
        self.play(FadeIn(name2), LaggedStart(*[FadeIn(x) for x in bitems], lag_ratio=0.2), Create(barrows), run_time=1.0)
        self.pause_screen(4, "무엇이 다를까요?")
        box = SurroundingRectangle(bitems[2], color=RED, buff=0.12, corner_radius=0.1)
        self.say(f"사마귀는 배추흰나비와 달리 {r('번데기')} 단계가 없어요",
                 "사마귀는 배추흰나비와 달리 번데기 단계가 없어요. 같은 곤충이라도 한살이 과정이 달라요.")
        self.play(Create(box), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 개 ──
    def dog_part(self):
        self.section("새끼를 낳는 동물 · 개")
        pics = [dog(1.0, puppy=True), dog(0.75), dog(1.05)]
        items, arrows = chain(pics, ["갓 태어난 강아지", "큰 강아지", "다 자란 개"], y=0.6, x0=-4.6, x1=4.4, label_size=32, max_label=3.2)
        narr = ["개는 새끼를 낳아요. 갓 태어난 강아지는 어미와 모습이 비슷해요. 눈을 뜨지 못하고 어미젖을 먹어요.",
                "큰 강아지는 어미와 같은 먹이를 먹을 수 있어요.",
                "다 자란 암컷과 수컷 개가 짝짓기를 하고, 암컷이 새끼를 낳아요."]
        subs = [f"갓 태어난 강아지는 {o('어미와 모습이 비슷해요')}", "큰 강아지는 어미와 같은 먹이를 먹어요", f"다 자란 암컷이 {o('새끼')}를 낳아요"]
        for i in range(3):
            self.say(subs[i], narr[i])
            anims = [FadeIn(items[i], shift=UP * 0.2)]
            if i > 0:
                anims.insert(0, Create(arrows[i - 1]))
            self.play(*anims, run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 공통점·차이점 ──
    def compare(self):
        self.section("공통점과 차이점")
        common = tag("다 자란 암컷이 알이나 새끼를 낳아 대를 이어 가요", GREEN, 36).move_to([0, 2.2, 0])
        self.say(f"공통점: 다 자란 {g('암컷')}이 알이나 새끼를 낳아요",
                 "알을 낳는 동물도 새끼를 낳는 동물도, 다 자란 암컷이 알이나 새끼를 낳아 대를 이어 가요.")
        self.play(FadeIn(common, shift=DOWN * 0.2), run_time=0.5)
        lc = VGroup(T("알을 낳는 동물", 40, ORANGE), T("알에서 나온 새끼가 자라요", 34, INK)).arrange(DOWN, buff=0.3)
        rc = VGroup(T("새끼를 낳는 동물", 40, BLUE), T("갓 태어난 새끼가 어미젖을 먹어요", 34, INK)).arrange(DOWN, buff=0.3)
        lc.move_to([-3.4, 0.2, 0])
        rc.move_to([3.4, 0.2, 0])
        div = Line([0, 1.2, 0], [0, -1.2, 0], stroke_color=SOFT, stroke_width=3)
        self.say("차이점: 알을 낳느냐, 새끼를 낳느냐", "차이점은, 알을 낳아 대를 이어 가는지 새끼를 낳아 대를 이어 가는지예요.")
        self.play(FadeIn(lc), Create(div), FadeIn(rc), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 분류 ──
    def sort(self):
        self.section("분류해요")
        boxes = VGroup()
        for x, nm, col in ((-3.5, "알을 낳는 동물", ORANGE), (3.5, "새끼를 낳는 동물", BLUE)):
            b_ = RoundedRectangle(corner_radius=0.25, width=6.4, height=4.2, fill_color=PAPER, fill_opacity=0.85,
                                  stroke_color=col, stroke_width=5).move_to([x, -0.15, 0])
            b_.stretch_to_fit_height(4.6)
            h = T(nm, 38, col).move_to([x, 1.75, 0])
            boxes.add(VGroup(b_, h))
        self.say("알을 낳는 동물과 새끼를 낳는 동물로 나누어요", "여러 동물을 알을 낳는 동물과 새끼를 낳는 동물로 나누어 봐요.")
        self.play(FadeIn(boxes), run_time=0.5)
        eggs = ["오리", "개구리", "바다거북", "사마귀", "배추흰나비", "닭", "메추라기", "사슴벌레"]
        babies = ["토끼", "코끼리", "개"]
        ec = VGroup(*[tag(t, ORANGE, 30) for t in eggs]).arrange_in_grid(rows=4, cols=2, buff=(0.3, 0.2)).move_to([-3.5, -0.45, 0])
        bc = VGroup(*[tag(t, BLUE, 30) for t in babies]).arrange(DOWN, buff=0.2)
        bc.move_to([3.5, 0, 0]).align_to(np.array([0, 1.3, 0]), UP)
        self.play(LaggedStart(*[FadeIn(c, shift=DOWN * 0.15) for c in ec], lag_ratio=0.12), run_time=1.2)
        self.play(LaggedStart(*[FadeIn(c, shift=DOWN * 0.15) for c in bc], lag_ratio=0.2), run_time=0.7)
        q = tag("돌고래", BLUE, 36).move_to([0, 2.75, 0])
        self.say("물속에 사는 돌고래는 어느 쪽일까요?", "그럼 물속에 사는 돌고래는 어느 쪽일까요?")
        self.play(FadeIn(q, scale=0.8), run_time=0.4)
        self.pause_screen(4, "돌고래는 어느 쪽일까요?")
        self.say(f"돌고래는 물속에 살지만 {o('새끼를 낳아요')}",
                 "돌고래는 물속에 살지만 새끼를 낳아요. 새끼는 어미젖을 먹으며 자라요.")
        self.play(q.animate.scale(30 / 36).next_to(bc, DOWN, buff=0.2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 알을 낳는 장소 ──
    def places(self):
        self.section("더 알아봐요")
        cards = [("개구리", "물속에 알을 낳아요", frog_stage(0, 0.8)),
                 ("바다거북", "모래밭에 구덩이를 파고 알을 낳아요", None),
                 ("사마귀", "풀이나 나무줄기에 알집을 만들어요", ootheca(0.8))]
        grp = VGroup()
        for i, (nm, desc, pic) in enumerate(cards):
            x = -4.5 + i * 4.5
            box = RoundedRectangle(corner_radius=0.25, width=4.2, height=4.4, fill_color=PAPER, fill_opacity=0.9,
                                   stroke_color=ORANGE, stroke_width=4).move_to([x, 0.3, 0])
            if pic is None:
                sand = Rectangle(width=2.8, height=0.7, fill_color="#E8D3A2", fill_opacity=1, stroke_width=0)
                hole = RoundedRectangle(corner_radius=0.3, width=1.6, height=0.55, fill_color="#C9A86A", fill_opacity=1, stroke_width=0)
                eg = VGroup(*[RoundedRectangle(corner_radius=0.12, width=0.26, height=0.26, fill_color="#FBF8EE", fill_opacity=1,
                                               stroke_color="#B9A47A", stroke_width=2) for _ in range(5)]).arrange(RIGHT, buff=0.04)
                pic = VGroup(sand, hole, eg.move_to(hole))
            pic.move_to([x, 1.1, 0])
            t1 = T(nm, 40, ORANGE).move_to([x, -0.35, 0])
            t2 = T(desc, 30, INK)
            if t2.width > 3.8:
                lines = desc.split(" ")
                half = len(lines) // 2
                t2 = VGroup(T(" ".join(lines[:half]), 30, INK), T(" ".join(lines[half:]), 30, INK)).arrange(DOWN, buff=0.1)
            t2.move_to([x, -1.2, 0])
            grp.add(VGroup(box, pic, t1, t2))
        self.say("알을 낳는 장소는 동물마다 달라요",
                 "알을 낳는 동물은 종류에 따라 알을 낳는 장소가 달라요. 개구리는 물속, 바다거북은 모래밭에 구덩이를 파고, 사마귀는 풀이나 나무줄기에 알집을 만들어요.")
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in grp], lag_ratio=0.3), run_time=1.4)
        self.say("새끼를 낳는 동물도 한 번에 낳는 새끼의 수가 달라요",
                 "새끼를 낳는 동물도 종류에 따라 한 번에 낳는 새끼의 수, 새끼가 자라는 기간이 달라요.")
        self.settle()
        clear_stage(self)
