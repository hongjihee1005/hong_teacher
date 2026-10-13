"""「수학 원리 돋보기」 시리즈 공통 스타일

색·글꼴·자막·오프닝·멈춤 화면·마무리 화면을 모든 화가 같이 씁니다.
화마다 EpisodeScene을 물려받아 construct()만 쓰면 됩니다.

    class Ep02(EpisodeScene):
        EP_NO = 2
        EP_TITLE = "…"
        def construct(self):
            self.opening()
            self.section("문제")
            self.say("자막 문장", "나레이션 문장(없으면 자막과 같음)")
            ...
            self.closing("핵심 정리 한 줄", next_preview="")

say()가 부른 시각을 모아 두었다가, 렌더링이 끝나면 화 폴더에
narration.txt(시간 표시 나레이션 원고)와 timeline.json(장면 확인용)을 씁니다.
"""
import json
import os
import re

import manimpango
from manim import (
    BOLD, DOWN, DR, LEFT, ORIGIN, RIGHT, UL, UP, UR,
    AnimationGroup, Arc, Circle, Create, FadeIn, FadeOut, Line, MarkupText,
    Rectangle, RoundedRectangle, Scene, Text, Transform, VGroup, Write,
    linear, rate_functions,
)

# ── 글꼴: 컴퓨터에 있는 것 중 앞에서부터 고름 ─────────────────────────
FONT_CANDIDATES = [
    "Noto Sans KR",        # 구글 글꼴에서 받은 Noto Sans KR
    "Noto Sans CJK KR",    # 리눅스 fonts-noto-cjk
    "NanumGothic", "나눔고딕",
    "Malgun Gothic", "맑은 고딕",  # 윈도 기본
    "Apple SD Gothic Neo",         # 맥 기본
]


def pick_font():
    have = set(manimpango.list_fonts())
    for f in FONT_CANDIDATES:
        if f in have:
            return f
    raise RuntimeError(
        "한글 글꼴을 찾지 못했습니다. Noto Sans KR을 설치하세요: "
        "https://fonts.google.com/noto/specimen/Noto+Sans+KR"
    )


FONT = pick_font()

# ── 색 (배경 + 글자 + 세 가지 강조색) ─────────────────────────────────
BG = "#FFF9EE"          # 밝은 크림색 배경
INK = "#2B2B33"         # 글자
SOFT = "#8A8378"        # 흐린 글자·선
PAPER = "#FFFFFF"       # 자막 띠
PLATE = "#EFE8DB"       # 접시(묶음) 바탕

BLUE = "#2F6FD6"        # 십 모형 · 십의 자리
BLUE_DARK = "#1C4A9C"
ORANGE = "#F08A1C"      # 일 모형 · 일의 자리
ORANGE_DARK = "#B25E08"
GREEN = "#2E9E5B"       # 답·확인


def b(s):
    """파란색(십) 글자 — MarkupText 안에서 씀"""
    return f'<span foreground="{BLUE}">{s}</span>'


def o(s):
    """주황색(일) 글자"""
    return f'<span foreground="{ORANGE}">{s}</span>'


def g(s):
    """초록색(답) 글자"""
    return f'<span foreground="{GREEN}">{s}</span>'


def T(s, size=48, color=INK, bold=True):
    return Text(s, font=FONT, font_size=size, color=color,
                weight=BOLD if bold else "NORMAL")


def M(markup, size=48, color=INK, bold=True):
    """색을 섞은 글자: M(f"{b('십 모형')} 4개") """
    return MarkupText(markup, font=FONT, font_size=size, color=color,
                      weight=BOLD if bold else "NORMAL")


def plain(markup):
    return re.sub(r"<[^>]+>", "", markup).replace("\n", " ")


READ_RATE = 6.0     # 나레이션 읽는 빠르기(1초에 글자 수, 띄어쓰기 뺌) — 어린이용으로 느긋하게


def read_time(narr):
    return len(re.sub(r"\s", "", narr)) / READ_RATE + 0.4


# 글자 크기 (1920×1080 기준, 교실 뒷자리에서 보이게)
SUB_SIZE = 46       # 자막
BIG = 120           # 큰 숫자·식
MID = 64            # 설명 글
SMALL = 44          # 이름표

SUB_Y = -3.28       # 자막 띠 가운데 높이
SUB_H = 1.12


def fmt(t):
    m, s = divmod(int(round(t)), 60)
    return f"{m:02d}:{s:02d}"


class EpisodeScene(Scene):
    EP_NO = 0
    EP_TITLE = ""
    SERIES = "수학 원리 돋보기"

    # ── 준비 ──
    def setup(self):
        self.camera.background_color = BG
        self._sub = None
        self._chip = None
        self._log = []          # (시각, 구역, 자막, 나레이션)
        self._section = ""
        self._need_until = 0.0  # 앞 나레이션을 다 읽을 때까지

    def settle(self):
        """앞 자막의 나레이션을 다 읽을 시간이 지났는지 확인하고, 모자라면 기다림"""
        left = self._need_until - self.now()
        if left > 0.05:
            self.wait(left)

    def now(self):
        return self.renderer.time

    # ── 왼쪽 위 구역 이름표 ──
    def section(self, name):
        self._section = name
        chip_txt = T(name, 34, PAPER)
        box = RoundedRectangle(corner_radius=0.22, width=chip_txt.width + 0.6,
                               height=chip_txt.height + 0.36,
                               fill_color=INK, fill_opacity=1, stroke_width=0)
        chip = VGroup(box, chip_txt).to_corner(UL, buff=0.32)
        chip_txt.move_to(box)
        if self._chip is None:
            self.play(FadeIn(chip, shift=RIGHT * 0.3), run_time=0.5)
        else:
            self.play(FadeOut(self._chip, shift=LEFT * 0.3), FadeIn(chip, shift=RIGHT * 0.3), run_time=0.6)
        self._chip = chip

    def hide_chip(self):
        if self._chip is not None:
            self.play(FadeOut(self._chip), run_time=0.4)
            self._chip = None

    # ── 자막 ──
    def make_sub(self, markup):
        txt = M(markup, SUB_SIZE)
        if txt.width > 12.9:
            txt.scale_to_fit_width(12.9)
        band = RoundedRectangle(corner_radius=0.25, width=13.7, height=SUB_H,
                                fill_color=PAPER, fill_opacity=0.96,
                                stroke_color=SOFT, stroke_width=2)
        band.move_to([0, SUB_Y, 0])
        txt.move_to(band)
        return VGroup(band, txt)

    def say(self, markup, narration=None, wait=0.0):
        """자막을 바꾸고(0.4초) 시각을 기록. wait만큼 더 기다림.
        앞 자막의 나레이션을 읽을 시간이 모자라면 먼저 기다림(Vrew 더빙이 들어갈 자리)."""
        self.settle()
        narr = narration if narration is not None else plain(markup)
        self._log.append((self.now(), self._section, plain(markup), narr))
        self._need_until = self.now() + read_time(narr)
        new = self.make_sub(markup)
        if self._sub is None:
            self.play(FadeIn(new, shift=UP * 0.15), run_time=0.4)
        else:
            old = self._sub
            self.play(FadeOut(old[1]), FadeIn(new[1]), Transform(old[0], new[0]),
                      run_time=0.4)
            self.remove(old[0])
            self.add(new[0], new[1])
        self._sub = new
        if wait:
            self.wait(wait)

    def clear_sub(self):
        if self._sub is not None:
            self.play(FadeOut(self._sub), run_time=0.3)
            self._sub = None

    # ── 돋보기 그림 ──
    @staticmethod
    def magnifier(r=0.9):
        ring = Circle(radius=r, stroke_color=ORANGE, stroke_width=16)
        glass = Circle(radius=r, fill_color=PAPER, fill_opacity=0.9, stroke_width=0)
        shine = Arc(radius=r * 0.65, start_angle=1.9, angle=0.9,
                    stroke_color=BLUE, stroke_width=10)
        handle = Line(ORIGIN, RIGHT * r * 1.1, stroke_color=INK, stroke_width=26)
        handle.rotate(-0.8, about_point=ORIGIN)
        handle.shift(ring.point_at_angle(-0.8))
        return VGroup(glass, ring, shine, handle)

    # ── 오프닝 (5초) ──
    def opening(self):
        t0 = self.now()
        self._section = "오프닝"
        mag = self.magnifier(0.95).move_to([-4.6, 1.15, 0])
        series = T(f"「{self.SERIES}」", 86).next_to(mag, RIGHT, buff=0.5)
        VGroup(mag, series).move_to([0, 1.3, 0])
        ep = M(f"{o(str(self.EP_NO) + '화')}  {self.EP_TITLE}", 62)
        if ep.width > 13:
            ep.scale_to_fit_width(13)
        ep.move_to([0, -0.9, 0])
        bar = Line(LEFT * 5.5, RIGHT * 5.5, stroke_color=BLUE, stroke_width=8).move_to([0, 0.05, 0])
        self._log.append((t0, "오프닝", f"「{self.SERIES}」 {self.EP_NO}화: {self.EP_TITLE}",
                          f"수학 원리 돋보기, {self.EP_NO}화. {self.EP_TITLE}"))
        self.play(FadeIn(mag, scale=0.6), run_time=0.8)
        self.play(Write(series), Create(bar), run_time=1.2)
        self.play(FadeIn(ep, shift=UP * 0.3), run_time=0.8)
        self.wait(max(0.0, 5.0 - 0.6 - (self.now() - t0)))
        self.play(FadeOut(VGroup(mag, series, ep, bar)), run_time=0.6)

    # ── 생각해 보세요 멈춤 화면 ──
    def pause_screen(self, seconds=5, msg="잠시 멈추고 이야기해 보세요"):
        self.settle()
        self._log.append((self.now(), self._section, msg,
                          "잠시 멈추고, 옆 친구와 이야기해 보세요."))
        cover = Rectangle(width=16, height=9, fill_color=BG, fill_opacity=0.93, stroke_width=0)
        icon = VGroup(
            RoundedRectangle(corner_radius=0.12, width=0.42, height=1.5, fill_color=GREEN, fill_opacity=1, stroke_width=0),
            RoundedRectangle(corner_radius=0.12, width=0.42, height=1.5, fill_color=GREEN, fill_opacity=1, stroke_width=0),
        ).arrange(RIGHT, buff=0.4)
        ring = Circle(radius=1.25, stroke_color=GREEN, stroke_width=10)
        icon.move_to(ring)
        top = T("생각해 보세요", 80, GREEN)
        text = T(msg, 64)
        grp = VGroup(top, VGroup(ring, icon), text).arrange(DOWN, buff=0.5).move_to([0, 0.15, 0])
        num = T(str(seconds), 60, GREEN).next_to(ring, RIGHT, buff=0.5)
        self.play(FadeIn(cover), FadeIn(grp, scale=0.9), FadeIn(num), run_time=0.5)
        timer = Arc(radius=1.25, start_angle=1.5708, angle=6.2832, stroke_color=ORANGE, stroke_width=10)
        timer.move_to(ring)
        self.add(timer)
        left = seconds - 0.5 - 0.5
        steps = seconds
        per = left / steps
        for i in range(steps):
            new_num = T(str(seconds - i), 60, GREEN).move_to(num)
            frac = 1 - (i + 1) / steps
            new_arc = Arc(radius=1.25, start_angle=1.5708, angle=max(6.2832 * frac, 0.001),
                          stroke_color=ORANGE, stroke_width=10).move_to(ring.get_center())
            new_arc.shift(ring.get_center() - new_arc.get_arc_center())
            self.remove(num); num = new_num; self.add(num)
            self.play(Transform(timer, new_arc), run_time=per, rate_func=linear)
        self.play(FadeOut(VGroup(cover, grp, num, timer)), run_time=0.5)

    # ── 마무리 (10초) ──
    def closing(self, summary_markup, next_preview=""):
        self.settle()
        t0 = self.now()
        self._section = "마무리"
        self.clear_sub()
        head = T("오늘의 핵심", 64, GREEN)
        body = M(summary_markup, 58)
        if body.width > 12.4:
            body.scale_to_fit_width(12.4)
        card = RoundedRectangle(corner_radius=0.35, width=13.2, height=body.height + 1.3,
                                fill_color=PAPER, fill_opacity=1, stroke_color=GREEN, stroke_width=6)
        body.move_to(card)
        box = VGroup(card, body)
        VGroup(head, box).arrange(DOWN, buff=0.45).move_to([0, 1.1, 0])
        nxt_txt = next_preview if next_preview else "                "
        nxt = M(f"{o('다음 화 예고')}   {nxt_txt}", 46)
        nxt.move_to([0, -2.1, 0])
        mag = self.magnifier(0.32)
        series = T(f"「{self.SERIES}」 {self.EP_NO}화", 34, SOFT)
        logo = VGroup(mag, series).arrange(RIGHT, buff=0.3).to_corner(DR, buff=0.4)
        self._log.append((t0, "마무리", plain(summary_markup),
                          plain(summary_markup)))
        if next_preview:
            self._log.append((t0 + 4.5, "마무리", f"다음 화 예고: {next_preview}",
                              f"다음 화에서는 {next_preview}"))
        self.play(FadeIn(head, shift=DOWN * 0.2), FadeIn(logo), run_time=0.6)
        self.play(FadeIn(box, scale=0.95), run_time=0.9)
        self.wait(3.0)
        self.play(FadeIn(nxt, shift=UP * 0.2), run_time=0.6)
        self.wait(max(0.0, 10.0 - 0.8 - (self.now() - t0)))
        self.play(FadeOut(VGroup(head, box, nxt, logo)), run_time=0.8)

    # ── 렌더링이 끝나면 나레이션 원고 쓰기 ──
    def tear_down(self):
        out_dir = getattr(self, "OUT_DIR", None)
        if not out_dir:
            return
        end = self.now()
        log = sorted(self._log, key=lambda x: x[0])
        lines = [
            f"「{self.SERIES}」 {self.EP_NO}화 — {self.EP_TITLE}",
            f"전체 길이 {fmt(end)}  (시간은 영상 기준 [시작 ~ 끝], Vrew에서 자막 줄마다 나레이션을 넣을 때 참고)",
            "",
        ]
        cur = None
        timeline = []
        for i, (t, sec, sub, narr) in enumerate(log):
            t_end = log[i + 1][0] if i + 1 < len(log) else end
            if sec != cur:
                lines.append(f"■ {sec}")
                cur = sec
            lines.append(f"[{fmt(t)} ~ {fmt(t_end)}] {narr}")
            lines.append(f"            (자막: {sub})")
            timeline.append({"t": round(t, 2), "end": round(t_end, 2), "section": sec, "sub": sub})
        lines.append("")
        with open(os.path.join(out_dir, "narration.txt"), "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        with open(os.path.join(out_dir, "timeline.json"), "w", encoding="utf-8") as f:
            json.dump(timeline, f, ensure_ascii=False, indent=1)
