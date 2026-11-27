"""「과학 낱말 사전」 3학년 2학기 4단원 — 감염병과 건강한 생활 (낱말 8개)

낱말: 감염병, 병원체, 예방 접종, 감염 경로, 비말, 예방 수칙, 손 씻기, 기침 예절
바탕: grade3/science/sem2/u4-1 ~ u4-5.html
  감염병·병원체(u4-1 '감기처럼 병원체가 우리 몸에 들어와 걸리는 질병을 감염병', '병원체는 아주 작아서 눈으로 볼 수 없어요',
  감염병 고르기 감기·독감·식중독·수족구병, 체온계 '열이 나는 것은 몸이 아프다는 신호'),
  예방 접종(u4-2 도입 '많은 사람이 예방 접종을 하면 … 아픈 사람이 줄어들어요 / 옮는 일이 줄어들어요', 결핵 BCG),
  감염 경로(u4-3 '병원체가 우리 몸에 들어오는 길' 카드 5장 — 앱 const R 문장, 한눈에 쏙 '눈, 코, 입으로 들어오면'),
  비말(u4-3 '비말(침방울)', 염화 코발트 종이: 가리지 않고 기침 · 큰 소리로 말하기 · 팔로 가리고 기침),
  예방 수칙(u4-5 카드 9장 — 앱 문장), 손 씻기(u4-5 비누로 30초, 6단계), 기침 예절(u4-5 '휴지나 옷소매(팔)로 입과 코를 가리고 기침해요').
  병원체는 그리지 않음(선생님 안내: 무섭게 그리지 말고 생활 장면으로) — 병원체가 있을 수 있는 곳(침방울·문손잡이·씻지 않은 손·오염된 음식과 물)으로 보여 줌.
  '감염병에 걸린 것은 누구의 잘못도 아니에요'(u4-2)를 예방 수칙 끝에 넣음.
실제 그림: photos/w3u24/ (WANT.md) — 사람 얼굴이 크게 나오지 않는 생활 장면
미리보기: MEDIA=media_p/w3u24 ./render.sh w3u24 preview
최종: TTS_SPEED=1.0 ./make_voice.sh w3u24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, Create, FadeIn, FadeOut, GrowArrow, LaggedStart,
                   RoundedRectangle, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u24 as K
import firstkit as F
from kit_w3u2 import WordScene, text_card

# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "thermo": (960, 540),
    "arm_patch": (1000, 480),
    "elbow": (980, 450),
    "foam": (960, 560),
    "window": (960, 450),
}

ROUTES = [(lambda: K.door_knob(0.5), "접촉", "병원체가 묻은 물건을 만진 손으로 눈·코·입을 만지면",
           "아픈 사람이나 병원체가 묻은 물건을 만진 손으로 눈, 코, 입을 만지면 병원체가 몸에 들어와요."),
          (lambda: K.tissue(0.5), "비말(침방울)", "입을 가리지 않고 기침이나 재채기를 하면",
           "입을 가리지 않고 기침이나 재채기를 하면 병원체가 든 침방울이 튀어 가까이 있는 사람에게 옮을 수 있어요."),
          (lambda: K.window(0.45, False), "공기", "사람이 많은 곳에서 환기를 하지 않으면",
           "사람이 많은 곳에서 환기를 하지 않으면 공기 중에 떠 있는 작은 침방울을 통해 옮을 수 있어요."),
          (lambda: K.cup(0.6, False), "물", "오염된 물을 끓이지 않고 마시면",
           "오염된 물을 끓이지 않고 마시면 병원체가 몸속으로 들어올 수 있어요."),
          (lambda: K.plate(0.55), "침", "한 접시의 음식을 덜지 않고 같이 먹으면",
           "한 접시의 음식을 덜지 않고 같이 먹으면 침을 통해 병원체가 들어올 수 있어요.")]

RULES = [(lambda: K.soap(), "손 씻기", "비누로 30초 이상"),
         (lambda: K.tissue(), "기침 예절", "휴지나 옷소매로 가려요"),
         (lambda: K.mask(), "마스크 쓰기", "아플 때, 사람 많은 곳"),
         (lambda: K.window(), "환기하기", "창문을 자주 열어요"),
         (lambda: K.plate(), "덜어 먹기", "개인 접시에 덜어요"),
         (lambda: K.syringe(), "예방 접종", "정해진 때에 맞아요"),
         (lambda: K.salad(), "건강 관리", "골고루 먹고 잘 자요"),
         (lambda: K.bed_home(), "아프면 쉬기", "집에서 쉬고 병원에"),
         (lambda: K.cup(), "끓인 물 마시기", "물은 끓여서 마셔요")]

WASH = ["손바닥", "손등", "깍지", "손가락", "엄지", "손톱"]


def r_(s):
    return f'<span foreground="{RED}">{s}</span>'


class W3U24(WordScene):
    UNIT = 4
    EP_TITLE = "감염병과 건강한 생활"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.today(["감염병", "병원체", "예방 접종", "감염 경로", "비말", "예방 수칙", "손 씻기", "기침 예절"],
                   "오늘은 감염병과 건강한 생활 단원의 낱말 여덟 개를 배워요. 감염병, 병원체, 예방 접종, 감염 경로, 비말, 예방 수칙, 손 씻기, 기침 예절이에요.")
        self.w_disease()
        self.w_pathogen()
        self.w_vaccine()
        self.w_route()
        self.w_droplet()
        self.w_rules()
        self.w_handwash()
        self.w_cough()
        self.quiz([
            (["병원체가 몸에 들어와 걸리는 질병"], "ㄱㅇㅂ", "감염병",
             "병원체가 몸에 들어와 걸리는 질병을 무엇이라고 할까요?", "정답은 감염병이에요."),
            (["병원체가 우리 몸에 들어오는 길"], "ㄱㅇ ㄱㄹ", "감염 경로",
             "병원체가 우리 몸에 들어오는 길을 무엇이라고 할까요?", "정답은 감염 경로예요."),
            (["기침이나 재채기를 할 때 튀는 침방울"], "ㅂㅁ", "비말",
             "기침이나 재채기를 할 때 튀는 침방울을 무엇이라고 할까요?", "정답은 비말이에요."),
            (["휴지나 옷소매로 입과 코를 가리고", "기침하는 것"], "ㄱㅊ ㅇㅈ", "기침 예절",
             "휴지나 옷소매로 입과 코를 가리고 기침하는 것을 무엇이라고 할까요?", "정답은 기침 예절이에요."),
        ])
        self.closing(f"{o('병원체')}가 몸에 들어와 걸리는 질병이 {o('감염병')}\n"
                     f"{g('손 씻기')}와 {g('기침 예절')}로 예방해요",
                     next_preview="")
        self.wait(0.5)

    # ── 1. 감염병 ──
    def w_disease(self):
        self.word_intro(1, "감염병", ["병원체가 몸에 들어와 걸리는 질병"],
                        "첫 번째 낱말은 감염병이에요. 감염병.", "병원체가 몸에 들어와 걸리는 질병을 감염병이라고 해요.")
        ph = F.photo("w3u24/thermometer", width=6.4).move_to([-3.3, 0.05, 0])
        self.say("감기에 걸려 본 적이 있나요?", "열이 나는 것은 몸이 아프다는 신호예요.")
        self.play(FadeIn(ph), run_time=0.6)
        ex = VGroup(*[F.name_tag(w, 38, INK, stroke=self.accent) for w in ["감기", "독감", "식중독", "수족구병"]])
        ex.arrange(DOWN, buff=0.28).move_to([3.6, 0.05, 0])
        self.say(f"감기, 독감, 식중독, 수족구병은 {o('감염병')}",
                 "감기, 독감, 식중독, 수족구병은 모두 감염병이에요.")
        self.play(FadeIn(ex, lag_ratio=0.15), run_time=0.9)
        self.settle()
        self.repeat("감염병")

    # ── 2. 병원체 ──
    def w_pathogen(self):
        self.word_intro(2, "병원체", ["아주 작아서 눈으로 볼 수 없어요"],
                        "두 번째 낱말은 병원체예요. 병원체.",
                        "병원체는 몸에 들어와 감염병을 일으켜요. 아주 작아서 눈으로 볼 수 없어요.",
                        sub_mean=f"병원체는 {o('아주 작아서')} 눈으로 볼 수 없어요")
        items = [(lambda: K.face("sneeze", 0.55), "아픈 사람의 침방울"), (lambda: K.door_knob(0.6), "여러 사람이 만진 문손잡이"),
                 (lambda: K.hand(0.7), "씻지 않은 손"), (lambda: K.plate(0.7), "오염된 음식과 물")]
        cs = VGroup()
        for fn, nm in items:
            box = RoundedRectangle(corner_radius=0.2, width=3.1, height=2.9, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=SOFT, stroke_width=3)
            p = K.fit(fn(), 1.5, 1.4).move_to(box.get_center() + UP * 0.35)
            t = T(nm, 28).move_to(box.get_center() + DOWN * 0.95)
            if t.width > 2.85:
                t.scale_to_fit_width(2.85)
            cs.add(VGroup(box, p, t))
        cs.arrange(RIGHT, buff=0.25).move_to([0, 0.1, 0])
        self.say("병원체가 있을 수 있는 곳", "병원체는 아픈 사람의 침방울, 여러 사람이 만진 문손잡이, 씻지 않은 손, 오염된 음식과 물에 있을 수 있어요.")
        self.play(FadeIn(cs, lag_ratio=0.15), run_time=1.0)
        self.settle()
        self.repeat("병원체")

    # ── 3. 예방 접종 ──
    def w_vaccine(self):
        self.word_intro(3, "예방 접종", ["감염병에 걸려 아픈 사람이 줄어들어요"],
                        "세 번째 낱말은 예방 접종이에요. 예방 접종.",
                        "많은 사람이 예방 접종을 하면 감염병에 걸려 아픈 사람이 줄어들어요.",
                        sub_mean=f"많은 사람이 예방 접종을 하면 {g('아픈 사람이 줄어들어요')}")
        ph = F.photo("w3u24/vaccine_arm", height=4.5).move_to([0, 0.05, 0])
        self.say(f"다른 사람에게 {g('옮는 일도 줄어들어요')}",
                 "감염병이 다른 사람에게 옮는 일도 줄어들어요. 정해진 때에 예방 접종을 맞아요.")
        self.play(FadeIn(ph), run_time=0.6)
        a, t = F.callout(ph, P["arm_patch"], "예방 접종을 한 팔", to=(2.6, 1.2), size=34)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.settle()
        self.repeat("예방 접종")

    # ── 4. 감염 경로 ──
    def w_route(self):
        self.word_intro(4, "감염 경로", ["병원체가 우리 몸에 들어오는 길"],
                        "네 번째 낱말은 감염 경로예요. 감염 경로.", "감염 경로는 병원체가 우리 몸에 들어오는 길이에요.")
        rows = VGroup()
        for i, (fn, nm, d, _) in enumerate(ROUTES):
            y = 1.75 - i * 0.92
            ic = K.fit(fn(), 0.75, 0.7).move_to([-6.0, y, 0])
            nt = F.name_tag(nm, 30, INK, stroke=ORANGE).move_to([-4.15, y, 0])
            dt = T(d, 30).move_to([-2.75, y, 0], aligned_edge=LEFT)
            if dt.width > 8.6:
                dt.scale_to_fit_width(8.6)
            rows.add(VGroup(ic, nt, dt))
        for row, (_, nm, d, narr) in zip(rows, ROUTES):
            josa = "를" if nm in ("공기",) else "을"
            self.say(f"{o(nm)}{josa} 통한 감염", narr)
            self.play(FadeIn(row, shift=RIGHT * 0.2), run_time=0.5)
        self.settle()
        self.say(f"병원체가 {o('눈, 코, 입')}으로 들어오면 감염병에 걸릴 수 있어요",
                 "병원체가 눈, 코, 입으로 들어오면 감염병에 걸릴 수 있어요.")
        self.settle()
        self.repeat("감염 경로")

    # ── 5. 비말 ──
    def w_droplet(self):
        self.word_intro(5, "비말", ["기침이나 재채기를 할 때 튀는 침방울"],
                        "다섯 번째 낱말은 비말이에요. 비말.", "비말은 침방울이에요. 기침이나 재채기를 하면 침방울이 튀어요.",
                        sub_mean=f"비말은 {o('침방울')}이에요")
        trials = [("입을 가리지 않고 기침", 60, 1.0, 11), ("큰 소리로 말하기", 18, 0.55, 12), ("팔로 가리고 기침", 4, 0.25, 13)]
        boards, labels, dots = VGroup(), VGroup(), []
        for i, (nm, n, sp, sd) in enumerate(trials):
            bd = K.cobalt_board(3.9, 1.6).move_to([-4.45 + 4.45 * i, 0.45, 0])
            lab = T(nm, 30, INK).next_to(bd, UP, buff=0.25)
            boards.add(bd)
            labels.add(lab)
            dots.append(K.cobalt_dots(bd, n, sp, sd))
        self.say(f"염화 코발트 종이는 물기가 닿으면 {r_('붉게')} 변해요",
                 "푸른색 염화 코발트 종이는 물기가 닿으면 붉게 변해요. 종이 앞에서 기침과 말하기를 해 봐요.")
        self.play(LaggedStart(*[FadeIn(VGroup(bd, lb)) for bd, lb in zip(boards, labels)], lag_ratio=0.2), run_time=1.0)
        res = ["붉은 점이 아주 많아요", "말할 때도 생겨요", "거의 없어요"]
        cols = [RED, ORANGE, GREEN]
        rts = VGroup(*[T(t, 28, c).next_to(bd, DOWN, buff=0.25) for t, c, bd in zip(res, cols, boards)])
        self.say(f"가리지 않고 기침하면 {r_('침방울이 많이, 멀리')} 튀어요",
                 "입을 가리지 않고 기침하면 침방울이 많이, 멀리까지 튀어요. 큰 소리로 말할 때도 튀어요.")
        self.play(FadeIn(dots[0], lag_ratio=0.02), FadeIn(dots[1], lag_ratio=0.02), FadeIn(rts[0]), FadeIn(rts[1]),
                  run_time=1.2)
        self.say(f"팔로 가리면 {g('거의 튀지 않아요')}", "팔로 가리고 기침하면 침방울이 거의 튀지 않아요.")
        self.play(FadeIn(dots[2]), FadeIn(rts[2]), run_time=0.5)
        self.play(Circumscribe(VGroup(boards[2], rts[2]), color=GREEN), run_time=0.9)
        self.settle()
        self.repeat("비말")

    # ── 6. 예방 수칙 ──
    def w_rules(self):
        self.word_intro(6, "예방 수칙", ["감염병을 예방하기 위해 지킬 것"],
                        "여섯 번째 낱말은 예방 수칙이에요. 예방 수칙.",
                        "감염병을 예방하기 위해 지킬 것을 예방 수칙이라고 해요.")
        cards = VGroup()
        for i, (fn, nm, d) in enumerate(RULES):
            x = -4.5 + (i % 3) * 4.5
            y = 1.6 - (i // 3) * 1.45
            box = RoundedRectangle(corner_radius=0.2, width=4.2, height=1.3, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=SOFT, stroke_width=3).move_to([x, y, 0])
            ic = K.fit(fn(), 0.95, 0.85).move_to([x - 1.5, y, 0])
            nt = T(nm, 32, ORANGE).move_to([x + 0.6, y + 0.24, 0])
            dt = T(d, 24, INK).move_to([x + 0.6, y - 0.26, 0])
            for t in (nt, dt):
                if t.width > 2.4:
                    t.scale_to_fit_width(2.4)
            cards.add(VGroup(box, ic, nt, dt))
        self.play(LaggedStart(*[FadeIn(c[0:2], scale=0.9) for c in cards], lag_ratio=0.08), run_time=1.1)
        self.say("손 씻기 · 기침 예절 · 마스크 · 환기",
                 "손 씻기, 기침 예절, 마스크 쓰기, 창문을 자주 열어 교실 공기를 바꾸는 환기하기.")
        self.play(LaggedStart(*[FadeIn(c[2:]) for c in cards[:4]], lag_ratio=0.3), run_time=1.0)
        self.say("덜어 먹기 · 예방 접종 · 건강 관리 · 아프면 쉬기 · 끓인 물",
                 "덜어 먹기, 예방 접종, 건강 관리, 아프면 쉬기, 끓인 물 마시기예요.")
        self.play(LaggedStart(*[FadeIn(c[2:]) for c in cards[4:]], lag_ratio=0.25), run_time=1.0)
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("w3u24/open_window", width=6.4).move_to([-3.3, 0.05, 0])
        tx = VGroup(M(f"예방 수칙은 {g('꾸준히 실천')}해요", 34),
                    M("감염병에 걸린 것은", 32), M(f"{o('누구의 잘못도 아니에요')}", 32)).arrange(DOWN, buff=0.3)
        tx.move_to([3.6, 0.05, 0])
        self.say(f"예방 수칙은 {g('꾸준히 실천')}하는 것이 중요해요",
                 "예방 수칙은 꾸준히 실천하는 것이 가장 중요해요.")
        self.play(FadeIn(ph), FadeIn(tx[0]), run_time=0.7)
        self.say(f"감염병에 걸린 것은 {o('누구의 잘못도 아니에요')}",
                 "그리고 감염병에 걸린 것은 누구의 잘못도 아니에요. 아픈 친구를 탓하지 않고 따뜻하게 대해 줘요.")
        self.play(FadeIn(tx[1:]), run_time=0.6)
        self.settle()
        self.repeat("예방 수칙")

    # ── 7. 손 씻기 ──
    def w_handwash(self):
        self.word_intro(7, "손 씻기", ["비누로 30초 이상 씻어요"],
                        "일곱 번째 낱말은 손 씻기예요. 손 씻기.",
                        "밖에서 돌아왔을 때, 밥 먹기 전, 화장실에 다녀온 뒤 비누로 30초 이상 씻어요.")
        ph = F.photo("w3u24/handwash", width=5.6).move_to([-3.75, 0.05, 0])
        cells = VGroup()
        for i, nm in enumerate(WASH):
            box = RoundedRectangle(corner_radius=0.18, width=2.25, height=1.75, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=SOFT, stroke_width=3)
            pic = K.fit(K.wash_step(i + 1), 1.4, 0.95).move_to(box.get_center() + UP * 0.2)
            t = T(f"{i + 1} {nm}", 28).move_to(box.get_center() + DOWN * 0.6)
            cells.add(VGroup(box, pic, t))
        cells[:3].arrange(RIGHT, buff=0.15)
        cells[3:].arrange(RIGHT, buff=0.15)
        VGroup(cells[:3], cells[3:]).arrange(DOWN, buff=0.2).move_to([3.25, 0.05, 0])
        self.say(f"비누 거품으로 손 구석구석을 {o('6단계')}로", "비누 거품으로 손 구석구석을 문질러요. 올바른 손 씻기는 여섯 단계예요.")
        self.play(FadeIn(ph), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(c, scale=0.9) for c in cells], lag_ratio=0.1), run_time=1.0)
        self.say("손바닥 · 손등 · 깍지 · 손가락 · 엄지 · 손톱 밑",
                 "손바닥, 손등, 손깍지, 손가락, 엄지손가락, 손톱 밑까지 깨끗하게 문질러요.")
        self.settle()
        self.repeat("손 씻기")

    # ── 8. 기침 예절 ──
    def w_cough(self):
        self.word_intro(8, "기침 예절", ["휴지나 옷소매로 입과 코를 가리고 기침해요"],
                        "마지막 여덟 번째 낱말은 기침 예절이에요. 기침 예절.",
                        "휴지나 옷소매, 곧 팔로 입과 코를 가리고 기침해요.")
        ph = F.photo("w3u24/cough_elbow", height=4.5).move_to([0, 0.05, 0])
        self.say(f"{o('옷소매(팔)')}로 입과 코를 가려요", "손이 아니라 옷소매로 가리면 침방울이 거의 튀지 않아요.")
        self.play(FadeIn(ph), run_time=0.6)
        a, t = F.callout(ph, P["elbow"], "옷소매로 가리기", to=(2.8, 1.0), size=34)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.settle()
        self.repeat("기침 예절")


class w3u24(W3U24):
    """render.sh가 폴더 이름을 장면 이름으로 넘기므로 같은 장면을 이 이름으로도 둠"""
    pass
