"""「과학 낱말 사전」 3학년 2학기(w3u21~w3u24) 공용 장면 틀 — 이 네 편에서만 씀(공통 파일 아님)

    from kit_w3u2 import WordScene
    class W3U21(WordScene):
        UNIT, EP_TITLE = 1, "물체와 물질"
        def construct(self):
            self.opening()
            self.today(["물체", "물질", …], "오늘 배울 낱말은 …")
            head = self.word_intro(1, "물체", ["쓰임새와 모양이 있는 것"], "첫 번째 낱말은 물체예요. 물체.", …)
            …
            self.repeat("물체")
            self.quiz([...])
            self.closing(...)

- 화면 이름표(ep_label)는 '3학년 2학기 1단원'(공통 series_style.py는 고치지 않고 여기서 덮어씀).
- render.sh는 폴더 이름 w3u21을 장면 이름으로 그대로 넘기므로, 장면 파일 끝에 `class w3u21(W3U21): pass`를 둠.
"""
import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circle, Circumscribe, FadeIn, FadeOut, LaggedStart, RoundedRectangle, Transform,
                   VGroup)

from series_style import GREEN, INK, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import clear_stage

HEAD_Y = 2.72      # 낱말 머리글 자리(왼쪽 위 이름표·오른쪽 위 로고 사이)


def text_card(lines, w=None, size=40, col=INK, fill=PAPER, stroke=SOFT, pad=0.35):
    ts = VGroup(*[M(l, size, col) for l in lines]).arrange(DOWN, buff=0.22)
    W = min(w or ts.width + 2 * pad, 13.4)
    if ts.width > W - 2 * pad:
        ts.scale_to_fit_width(W - 2 * pad)
    box = RoundedRectangle(corner_radius=0.22, width=W, height=ts.height + 2 * pad, fill_color=fill, fill_opacity=1,
                           stroke_color=stroke, stroke_width=4)
    ts.move_to(box)
    return VGroup(box, ts)


class WordScene(EpisodeScene):
    GRADE, SEM = 3, 2
    UNIT = 1
    EP_NO = 0
    SERIES = "과학 낱말 사전"

    def ep_label(self):
        return f"{self.GRADE}학년 {self.SEM}학기 {self.UNIT}단원"

    # ── 낱말 카드 ──
    def word_card(self, word, n=None, size=44, w=None):
        t = T(word, size, INK)
        parts = [t]
        if n is not None:
            c = Circle(radius=0.27, fill_color=self.accent, fill_opacity=1, stroke_width=0)
            k = T(str(n), 28, PAPER).move_to(c)
            badge = VGroup(c, k)
            row = VGroup(badge, t).arrange(RIGHT, buff=0.22)
        else:
            row = VGroup(t)
        W = w or row.width + 0.6
        box = RoundedRectangle(corner_radius=0.2, width=W, height=row.height + 0.46, fill_color=PAPER, fill_opacity=1,
                               stroke_color=self.accent, stroke_width=4)
        row.move_to(box)
        grp = VGroup(box, row)
        grp.box, grp.word = box, t
        return grp

    # ── 오늘의 낱말 ──
    def today(self, words, narr, per_row=4):
        self.section("오늘의 낱말")
        cards = [self.word_card(w, i + 1, size=42) for i, w in enumerate(words)]
        cw = max(c.width for c in cards)
        cards = [self.word_card(w, i + 1, size=42, w=cw) for i, w in enumerate(words)]
        rows = VGroup()
        for k in range(0, len(cards), per_row):
            rows.add(VGroup(*cards[k:k + per_row]).arrange(RIGHT, buff=0.3))
        rows.arrange(DOWN, buff=0.4).move_to([0, 0.3, 0])
        if rows.width > 13.2:
            rows.scale_to_fit_width(13.2)
        if rows.height > 4.8:
            rows.scale_to_fit_height(4.8)
        self.say(f"오늘 배울 낱말 {o(str(len(words)) + '개')}", narr)
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for r in rows for c in r], lag_ratio=0.15), run_time=1.6)
        self.settle()
        clear_stage(self)

    # ── 낱말 하나 시작: 이름(크게) → 뜻 한 줄 → 머리글로 올라감 ──
    def word_intro(self, i, word, mean_lines, narr_word, narr_mean, sub_mean=None, head_size=58):
        self.section(f"낱말 {i}")
        num = T(f"낱말 {i}", 36, SOFT)
        big = T(word, 120, self.accent)
        if big.width > 12.5:
            big.scale_to_fit_width(12.5)
        top = VGroup(num, big).arrange(DOWN, buff=0.25).move_to([0, 1.35, 0])
        card = text_card(mean_lines, size=44).move_to([0, -1.15, 0])
        self.say(o(word), narr_word)
        self.play(FadeIn(num), FadeIn(big, scale=0.8), run_time=0.8)
        self.say(sub_mean or mean_lines[0], narr_mean)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        head = T(word, head_size, self.accent).move_to([0, HEAD_Y, 0])
        self.play(FadeOut(num), FadeOut(card), Transform(big, head), run_time=0.7)
        self.head = big
        return big

    def repeat(self, word, narr=None):
        """두 번 말하기 — 머리글 낱말을 반짝이며 한 번 더"""
        self.say(f"다시 한번, {o(word)}", narr or f"다시 한번 말해 봐요. {word}.")
        if getattr(self, "head", None) is not None:
            self.play(Circumscribe(self.head, color=self.accent, time_width=0.6), run_time=1.0)
        self.settle()
        clear_stage(self)
        self.head = None

    # ── 낱말 퀴즈 ──
    def quiz(self, items):
        """items: [(뜻 줄 목록, 초성 힌트, 정답 낱말, 묻는 나레이션, 답 나레이션)]"""
        self.section("낱말 퀴즈")
        self.say("뜻을 보고 낱말을 맞혀 봐요", "이제 낱말 퀴즈예요. 뜻을 보고 어떤 낱말인지 맞혀 봐요.")
        self.settle()
        for k, (lines, hint, ans, nq, na) in enumerate(items):
            qn = T(f"문제 {k + 1}", 38, SOFT).move_to([0, 2.65, 0])
            card = text_card(lines, size=44).move_to([0, 1.1, 0])
            boxes = VGroup()
            for ch in hint:
                if ch == " ":
                    boxes.add(RoundedRectangle(width=0.3, height=0.1, stroke_width=0, fill_opacity=0))
                    continue
                b = RoundedRectangle(corner_radius=0.12, width=0.95, height=0.95, fill_color=PAPER, fill_opacity=1,
                                     stroke_color=self.accent, stroke_width=4)
                boxes.add(VGroup(b, T(ch, 46, SOFT).move_to(b)))
            boxes.arrange(RIGHT, buff=0.16).move_to([0, -1.05, 0])
            self.say(f"문제 {k + 1}. 이 뜻을 가진 낱말은?", nq)
            self.play(FadeIn(qn), FadeIn(card, shift=UP * 0.2), run_time=0.6)
            self.play(LaggedStart(*[FadeIn(b) for b in boxes], lag_ratio=0.1), run_time=0.6)
            self.pause_screen(5, "어떤 낱말일까요?")
            a = T(ans, 72, GREEN).move_to(boxes)
            self.play(FadeOut(boxes), FadeIn(a, scale=0.8), run_time=0.6)
            self.say(f"정답은 {g(ans)}", na)
            self.play(Circumscribe(a, color=GREEN), run_time=0.9)
            self.settle()
            clear_stage(self, run_time=0.4)
