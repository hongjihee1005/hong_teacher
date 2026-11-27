"""「과학 낱말 사전」(w*) 공용 부품 — 2026-11-27

    from wordkit import WordScene, NOW
    class W3U11(WordScene):
        GRADE, SEM, UNIT = 3, 1, 1
        EP_TITLE = "힘과 우리 생활"
        OUT_DIR = HERE

- ep_label()을 덮어써서 화면·나레이션에 '3학년 1학기 1단원'으로 나옴(공통 series_style.py는 그대로).
- today(낱말 목록): 오늘의 낱말 카드 한 화면.
- word(번호, 낱말, 뜻 줄들, 자막, 나레이션): 큰 낱말 → 위로 올라가며 뜻 카드. 위 낱말(self.head)은 word_end()까지 남음.
- quiz([...]): 뜻 카드 → 보기 → pause_screen → 정답.
- render.sh는 장면 이름을 [sf]..ep/mm 꼴만 바꾸므로, 장면 파일 끝에 `class w3u11(W3U11): pass`를 둠(폴더 이름 그대로 불림).
"""
import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, FadeIn, FadeOut, Indicate, RoundedRectangle, VGroup)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import clear_stage
import firstkit as F

HEAD_Y = 2.72          # 위에 남는 낱말 자리
PH_Y = -0.12           # 낱말 아래 그림 가운데
PH_H = 4.5             # 낱말 아래 그림 높이(한 장)


def text_card(lines, size=40, w=None, col=INK, stroke=SOFT, pad=0.36):
    ts = VGroup(*[M(l, size, col) for l in lines]).arrange(DOWN, buff=0.24, aligned_edge=LEFT)
    W = min(w or ts.width + 2 * pad, 13.2)
    if ts.width > W - 2 * pad:
        ts.scale_to_fit_width(W - 2 * pad)
    box = RoundedRectangle(corner_radius=0.22, width=W, height=ts.height + 2 * pad, fill_color=PAPER, fill_opacity=1,
                           stroke_color=stroke, stroke_width=4)
    ts.move_to(box)
    return VGroup(box, ts)


class WordScene(EpisodeScene):
    SERIES = "과학 낱말 사전"
    KIND = "ep"
    UNIT = 1
    EP_NO = 0

    def ep_label(self):
        return f"{self.GRADE}학년 {self.SEM}학기 {self.UNIT}단원"

    # ── 오늘의 낱말 ──
    def today(self, words, narr, cols=3):
        self.section("오늘의 낱말")
        chips = VGroup(*[F.name_tag(w, 54, INK, stroke=self.accent) for w in words])
        rows = [VGroup(*chips[i:i + cols]).arrange(RIGHT, buff=0.45) for i in range(0, len(chips), cols)]
        grid = VGroup(*rows).arrange(DOWN, buff=0.42).move_to([0, 0.25, 0])
        if grid.width > 12.6:
            grid.scale_to_fit_width(12.6)
        if grid.height > 5.0:
            grid.scale_to_fit_height(5.0)
        self.say(f"오늘 배울 낱말 {o(str(len(words)) + '개')}예요", narr)
        self.play(FadeIn(chips, lag_ratio=0.12), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 낱말 하나 ──
    def word(self, n, word, meaning, sub, narr, title_narr=None, size=40):
        """큰 낱말 → 위로 → 뜻 카드(앱 문장). 뜻 카드는 지우고 위 낱말만 남김"""
        self.section(f"낱말 {n}")
        big = T(word, 120, self.accent).move_to([0, 0.5, 0])
        if big.width > 12.5:
            big.scale_to_fit_width(12.5)
        self.say(o(word), title_narr or f"{word}.")
        self.play(FadeIn(big, scale=0.7), run_time=0.7)
        self.wait(0.3)
        head = T(word, 64, self.accent).move_to([0, HEAD_Y, 0])
        if head.width > 8.0:
            head.scale_to_fit_width(8.0)
        card = text_card(meaning, size=size).move_to([0, 0.35, 0])
        self.say(sub, narr)
        self.play(big.animate.become(head), FadeIn(card, shift=UP * 0.2), run_time=0.8)
        self.head = big
        self.card = card
        return card

    def drop_card(self):
        self.settle()
        self.play(FadeOut(self.card), run_time=0.4)

    def word_end(self):
        self.settle()
        clear_stage(self)

    # ── 낱말 퀴즈 ──
    def quiz(self, items):
        """items: (뜻 줄들, 보기 목록, 정답 번호(0부터), 정답 나레이션)"""
        self.section("낱말 퀴즈")
        for i, (lines, opts, ans, narr) in enumerate(items):
            q = text_card(lines, size=40).move_to([0, 1.55, 0])
            ch = VGroup(*[F.name_tag(f"{'①②③④'[k]} {x}", 42, INK, stroke=SOFT) for k, x in enumerate(opts)])
            ch.arrange(RIGHT, buff=0.4).move_to([0, -0.85, 0])
            if ch.width > 12.8:
                ch.scale_to_fit_width(12.8)
            from series_style import plain
            self.say(f"{i + 1}번. 이 뜻을 가진 낱말은?", f"{i + 1}번. " + " ".join(plain(l) for l in lines) + " 무엇일까요?")
            self.play(FadeIn(q), FadeIn(ch, lag_ratio=0.1), run_time=0.8)
            self.pause_screen(4, "어떤 낱말일까요?")
            self.say(f"정답은 {g(opts[ans])}", narr)
            self.play(Circumscribe(ch[ans], color=GREEN), ch[ans].box.animate.set_stroke(GREEN, 6),
                      *[ch[k].animate.set_opacity(0.35) for k in range(len(opts)) if k != ans], run_time=1.0)
            self.settle()
            clear_stage(self)
