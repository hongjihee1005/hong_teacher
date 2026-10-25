"""「과학 원리 돋보기」 3학년 38화 — 감염병 예방 수칙 (3-2 4단원 감염병과 건강한 생활 7~8차시, 화 코드 3-2-4-d)

바탕: grade3/science/sem2/u4-5.html — 도입(감염병을 예방하는 노력 고르기, '아파도 참고 학교에 가요'는 ×),
손 씻기 전과 후 배지 비교(표면 검사 키트 면봉 → 건조 필름 배지 → 따뜻한 곳 3일, 앱의 날짜별 설명과 점 계산을 그대로,
안전 수칙, '빨간 점이 모두 병원체는 아니에요'), 올바른 손 씻기 6단계(비누로 30초, 앱에서 단계마다 5초),
예방 수칙 카드 9장, 나의 예방 다짐문(3가지 고르기, 앱 예시 '지우'), 형성 평가 서술형(③ '학교에서만' 고치기).
최종: ./make_final.sh s3ep38
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, LaggedStart, Circumscribe,
                   RoundedRectangle, Transform, SurroundingRectangle, Line)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u24 as K
from kit_s3u12 import text_card, ox_mark


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


WASH = [("손바닥", "손바닥과 손바닥을 마주 대고 문질러요"),
        ("손등", "손등과 손바닥을 마주 대고 문질러요"),
        ("깍지", "손바닥을 마주 대고 손깍지를 끼고 문질러요"),
        ("손가락", "손가락을 마주 잡고 문질러요"),
        ("엄지", "엄지손가락을 다른 편 손바닥으로 돌려 주며 문질러요"),
        ("손톱", "손가락을 반대편 손바닥에 놓고 문지르며 손톱 밑을 깨끗하게 해요")]

RULES = [(lambda: K.soap(), "손 씻기", "비누로 30초 이상"),
         (lambda: K.tissue(), "기침 예절", "휴지나 옷소매로 가려요"),
         (lambda: K.mask(), "마스크 쓰기", "아플 때, 사람 많은 곳"),
         (lambda: K.window(), "환기하기", "창문을 자주 열어요"),
         (lambda: K.plate(), "덜어 먹기", "개인 접시에 덜어요"),
         (lambda: K.syringe(), "예방 접종", "정해진 때에 맞아요"),
         (lambda: K.salad(), "건강 관리", "골고루 먹고 잘 자요"),
         (lambda: K.bed_home(), "아프면 쉬기", "집에서 쉬고 병원에"),
         (lambda: K.cup(), "끓인 물 마시기", "물은 끓여서 마셔요")]

DAYCAP = ["0일: 두 배지 모두 깨끗해 보여요",
          "1일: 손을 씻기 전 배지에 빨간 점이 조금 생겼어요",
          "2일: 손을 씻기 전 배지에 빨간 점이 많이 늘었어요",
          "3일: 씻기 전 배지에는 빨간 점이 아주 많고, 씻은 후 배지에는 거의 없어요"]


class S3Ep38(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 38
    EP_TITLE = "감염병 예방 수칙"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.dishes()
        self.handwash()
        self.rules()
        self.pledge()
        self.closing(f"{o('손 씻기')}, {o('기침 예절')}, 예방 접종 같은 예방 수칙을\n"
                     f"{g('꾸준히 실천')}하는 것이 가장 중요해요",
                     next_preview="3학년 마인드맵 8 · 감염병과 건강한 생활")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sp = K.soap(1.4).move_to([-4.6, 0.6, 0])
        self.say("감기에 걸리지 않으려고 어떤 노력을 했나요?", "감기에 걸리지 않으려고 어떤 노력을 해 보았나요?")
        self.play(FadeIn(sp, scale=0.8), run_time=0.5)
        items = [("손을 자주 씻어요", True), ("기침 예절을 지켜요", True), ("예방 접종을 제때 맞아요", True),
                 ("골고루 먹고 잘 자요", True), ("아파도 참고 학교에 가요", False)]
        cards = K.choice_grid(items, cols=1, size=32, w=7.0, h=0.7, dy=0.86, top=2.2, cx=2.0)
        self.say("감염병을 예방하는 노력은?", "다음 중 감염병을 예방하는 노력을 모두 골라 볼까요?")
        self.play(LaggedStart(*[FadeIn(c, shift=LEFT * 0.2) for c in cards], lag_ratio=0.12), run_time=1.0)
        self.pause_screen(4, "예방하는 노력을 골라요")
        self.say(f"아플 때는 {g('쉬는 것')}이 나와 친구 모두에게 좋아요",
                 "네 가지가 감염병을 예방해요. 아플 때 참고 학교에 가면 친구에게 옮길 수 있으니, 아플 때는 쉬어요.")
        self.play(*K.reveal_marks(cards), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 배지 실험 ──
    def dishes(self):
        self.section("실험해요")
        steps = text_card(["① 표면 검사 키트의 면봉으로 손을 문질러요",
                           "② 그 액체를 건조 필름 배지에 떨어뜨려요",
                           f"③ 따뜻한 곳에 두고 {o('3일')}을 기다려요"], size=34).move_to([0, 0.6, 0])
        self.say("손 씻기 전과 후를 비교해요 (3일 배양 실험)",
                 "손을 씻기 전과 후를 비교해요. 면봉으로 손을 문질러 그 액체를 배지에 떨어뜨리고 3일을 기다려요.")
        self.play(FadeIn(steps, shift=UP * 0.2), run_time=0.6)
        self.settle()
        self.play(FadeOut(steps), run_time=0.4)
        A = K.dish(0, False).move_to([-3.0, 0.75, 0])
        B = K.dish(0, True).move_to([3.0, 0.75, 0])
        la = T("손을 씻기 전", 32, INK).next_to(A, DOWN, buff=0.2)
        lb = T("손을 씻은 후", 32, INK).next_to(B, DOWN, buff=0.2)
        day = T("0일째", 40, ORANGE).move_to([0, 0.75, 0])
        hint = T("빨간 점이 많을수록 병원체가 있을 가능성이 높아요", 26, SOFT).move_to([0, -1.95, 0])
        self.say(DAYCAP[0], "처음에는 두 배지 모두 깨끗해 보여요. 빨간 점이 많을수록 병원체가 있을 가능성이 높아요.")
        self.play(FadeIn(VGroup(A, B, la, lb, day)), FadeIn(hint), run_time=0.6)
        for d in (1, 2):
            A2 = K.dish(d, False).move_to(A)
            B2 = K.dish(d, True).move_to(B)
            if d == 1:
                self.say(f"1일, 2일 — 씻기 전 배지에 빨간 점이 {r('점점 늘어요')}",
                         "1일째에는 손을 씻기 전 배지에 빨간 점이 조금 생기고, 2일째에는 많이 늘었어요.")
            self.play(Transform(A, A2), Transform(B, B2), Transform(day, T(f"{d}일째", 40, ORANGE).move_to(day)), run_time=0.8)
        self.pause_screen(4, "3일 뒤 두 배지는?")
        A3 = K.dish(3, False).move_to(A)
        B3 = K.dish(3, True).move_to(B)
        self.say(f"씻기 전 {r('아주 많고')}, 씻은 후 {g('거의 없어요')}",
                 "손을 씻기 전 배지에는 빨간 점이 아주 많고, 손을 씻은 후 배지에는 거의 없어요.")
        self.play(Transform(A, A3), Transform(B, B3), Transform(day, T("3일째", 40, ORANGE).move_to(day)), run_time=1.0)
        self.settle()
        self.play(FadeOut(hint), run_time=0.3)
        card = text_card([f"손 씻기는 손에 있는 {g('병원체를 줄이는 데')} 도움이 돼요"], size=36).move_to([0, -1.95, 0])
        self.say(f"손을 씻으면 {g('병원체를 줄일 수 있어요')}",
                 "두 배지를 비교하면, 손 씻기는 손에 있는 병원체를 줄이는 데 도움이 된다는 것을 알 수 있어요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)
        warn = text_card([f"{r('실험할 때 조심해요')}",
                          "배지를 열거나 만지지 않아요",
                          "관찰할 때 실험복·보안경·마스크·장갑을 쓰고 환기해요",
                          "관찰이 끝난 배지는 밀봉해서 버려요",
                          f"※ 빨간 점이 모두 병원체는 아니에요 — {g('해롭지 않은 세균')}도 많아요"], size=32).move_to([0, 0.5, 0])
        self.say("실제 실험에서는 배지를 열거나 만지지 않아요",
                 "실제 실험에서는 배지를 열거나 만지지 않아요. 빨간 점이 모두 병원체는 아니에요. 해롭지 않은 세균도 많아요.")
        self.play(FadeIn(warn, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 손 씻기 6단계 ──
    def handwash(self):
        self.section("올바른 손 씻기")
        cells = VGroup()
        for i, (nm, d) in enumerate(WASH):
            x = -4.4 + (i % 3) * 4.4
            y = 1.55 if i < 3 else -0.75
            box = RoundedRectangle(corner_radius=0.2, width=4.1, height=2.1, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=SOFT, stroke_width=3).move_to([x, y, 0])
            pic = K.fit(K.wash_step(i + 1), 1.9, 1.5).move_to([x - 0.95, y + 0.05, 0])
            num = T(f"{i + 1}", 46, ORANGE).move_to([x + 0.55, y + 0.45, 0])
            nmt = T(nm, 36, INK).move_to([x + 1.15, y - 0.25, 0])
            c = VGroup(box, pic, num, nmt)
            c.box = box
            cells.add(c)
        badge = tag("비누로 30초", BLUE, 34).move_to([0.6, 3.1, 0])
        self.say(f"비누로 {o('30초')} 동안 6단계로 씻어요", "올바른 손 씻기를 배워요. 비누로 30초 동안, 여섯 단계로 씻어요.")
        self.play(LaggedStart(*[FadeIn(c, scale=0.9) for c in cells], lag_ratio=0.1), FadeIn(badge), run_time=1.4)
        bub = K.bubbles(12, 1.8, 1.2, 7)
        for i, (nm, d) in enumerate(WASH):
            self.say(f"{i + 1}단계 {o(nm)}: {d}", f"{i + 1}단계, {d}.")
            b = bub.copy().move_to(cells[i][1])
            self.play(cells[i].box.animate.set_stroke(GREEN, 7), FadeIn(b, scale=0.6),
                      *([cells[i - 1].box.animate.set_stroke(SOFT, 3)] if i else []), run_time=0.5)
            self.play(FadeOut(b), run_time=0.3)
        when = text_card([f"{o('밖에서 돌아왔을 때')}", f"{o('밥 먹기 전')}", f"{o('화장실에 다녀온 뒤')}", "에는 꼭 손을 씻어요"], size=40)
        when.move_to([1.3, 0.4, 0])
        sp = K.soap(1.6).move_to([-4.2, 0.4, 0])
        self.say("언제 손을 씻을까요?", "밖에서 돌아왔을 때, 밥 먹기 전, 화장실에 다녀온 뒤에는 꼭 손을 씻어요.")
        self.play(FadeOut(cells), FadeOut(badge), run_time=0.4)
        self.play(FadeIn(sp, scale=0.8), FadeIn(when, shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 예방 수칙 9가지 ──
    def rules(self):
        self.section("예방 수칙")
        cards = VGroup()
        for i, (fn, nm, d) in enumerate(RULES):
            x = -4.5 + (i % 3) * 4.5
            y = 2.05 - (i // 3) * 1.55
            box = RoundedRectangle(corner_radius=0.2, width=4.2, height=1.38, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=SOFT, stroke_width=3).move_to([x, y, 0])
            ic = K.fit(fn(), 1.0, 0.9).move_to([x - 1.5, y, 0])
            nt = T(nm, 32, ORANGE).move_to([x + 0.6, y + 0.25, 0])
            dt = T(d, 24, INK).move_to([x + 0.6, y - 0.27, 0])
            for t in (nt, dt):
                if t.width > 2.4:
                    t.scale_to_fit_width(2.4)
            cards.add(VGroup(box, ic, nt, dt))
        self.say(f"감염병 예방 수칙 {o('9가지')}", "감염병을 예방하는 수칙 아홉 가지를 알아봐요.")
        self.play(LaggedStart(*[FadeIn(c[0:2], scale=0.9) for c in cards], lag_ratio=0.08), run_time=1.2)
        self.say("손 씻기 · 기침 예절 · 마스크 쓰기",
                 "비누로 30초 이상 손 씻기, 휴지나 옷소매로 가리는 기침 예절, 아플 때나 사람이 많은 곳에서 마스크 쓰기.")
        self.play(LaggedStart(*[FadeIn(c[2:]) for c in cards[:3]], lag_ratio=0.3), run_time=0.9)
        self.say("환기하기 · 덜어 먹기 · 예방 접종",
                 "창문을 자주 열어 환기하기, 음식은 개인 접시에 덜어 먹고 수저 함께 쓰지 않기, 정해진 때에 예방 접종 맞기.")
        self.play(LaggedStart(*[FadeIn(c[2:]) for c in cards[3:6]], lag_ratio=0.3), run_time=0.9)
        self.say("건강 관리 · 아프면 쉬기 · 끓인 물 마시기",
                 "골고루 먹고 충분히 자고 운동하기, 아프면 집에서 쉬고 병원에 가기, 물은 끓여서 마시기예요.")
        self.play(LaggedStart(*[FadeIn(c[2:]) for c in cards[6:]], lag_ratio=0.3), run_time=0.9)
        self.settle()
        self.say(f"{g('꾸준히 실천')}하는 것이 가장 중요해요", "예방 수칙은 꾸준히 실천하는 것이 가장 중요해요.")
        self.play(Circumscribe(cards, color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 예방 다짐문 ──
    def pledge(self):
        self.section("예방 다짐문")
        paper = RoundedRectangle(corner_radius=0.3, width=6.0, height=4.4, fill_color="#FFFDF5", fill_opacity=1,
                                 stroke_color=self.accent, stroke_width=6).move_to([-3.4, 0.5, 0])
        ttl = T("감염병 예방 다짐문", 38, INK).move_to([-3.4, 2.3, 0])
        body = VGroup(T("저 지우는 건강한 생활을 위해", 28, INK), T("다음을 지킬 것을 다짐합니다.", 28, INK),
                      T("· 손 씻기", 32, ORANGE), T("· 기침 예절", 32, ORANGE), T("· 환기하기", 32, ORANGE))
        body.arrange(DOWN, buff=0.18, aligned_edge=LEFT).move_to([-3.4, 0.25, 0])
        self.say(f"일주일 동안 지킬 수칙을 {o('3가지')} 골라 다짐해요",
                 "일주일 동안 지킬 예방 수칙을 세 가지 골라 다짐문을 써요. 친구의 다짐문에는 응원 댓글을 달아 줘요.")
        self.play(FadeIn(paper), FadeIn(ttl), LaggedStart(*[FadeIn(b) for b in body], lag_ratio=0.2), run_time=1.2)
        self.settle()
        q = VGroup(T("잘못된 부분을 찾아요", 32, SOFT),
                   T("① 밖에서 돌아오면 비누로 손을 씻겠습니다.", 26, INK),
                   T("② 기침할 때는 팔로 입과 코를 가리겠습니다.", 26, INK),
                   M(f"③ {r('학교에서만')} 손을 씻겠습니다.", 26),
                   T("④ 음식은 개인 접시에 덜어 먹겠습니다.", 26, INK)).arrange(DOWN, buff=0.2, aligned_edge=LEFT)
        if q.width > 6.4:
            q.scale_to_fit_width(6.4)
        q.move_to([3.4, 0.75, 0])
        self.say("다짐문에서 잘못된 부분은 어디일까요?", "이 다짐문에서 잘못된 부분은 어디일까요?")
        self.play(FadeIn(q, shift=LEFT * 0.2), run_time=0.6)
        self.pause_screen(4, "잘못된 부분은 몇 번?")
        fix = text_card([f"③ → 손은 {g('어디에서나, 필요할 때마다')} 씻어요"], size=28).move_to([3.4, -2.15, 0]).to_edge(RIGHT, buff=0.3)
        self.say(f"③번! 손은 학교에서만이 아니라 {g('어디에서나')} 씻어요",
                 "③번이에요. 손은 학교에서만이 아니라 어디에서나, 필요할 때마다 씻어야 해요.")
        self.play(Indicate(q[3], color=RED), FadeIn(fix, shift=UP * 0.2), run_time=0.8)
        self.settle()
        clear_stage(self)
