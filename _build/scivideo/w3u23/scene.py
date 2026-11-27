"""「과학 낱말 사전」 3학년 2학기 3단원 — 소리의 성질 (낱말 7개: 떨림, 소리의 세기, 소리의 높낮이, 소리의 전달, 소음, 방음재, 효과음)

바탕: grade3/science/sem2/u3-1 ~ u3-7.html
  떨림(u3-1 한눈에 쏙 '소리가 나는 물체는 떨림이 있습니다', 고무줄·작은북 좁쌀, 생각+ '떨림이 멈추므로 소리가 나지 않아요'),
  소리의 세기(u3-2 '소리의 크고 작은 정도를 소리의 세기', 세게 → 크게 떨림·큰 소리, 도입 운동회 응원·도서관),
  소리의 높낮이(u3-3 '소리의 높고 낮은 정도를 소리의 높낮이', 짧은 음판 → 높은 소리, 생각 바로잡기 모기·천둥),
  세기·높낮이 견주기(u3-4 한눈에 쏙 표), 소리의 전달(u3-5 '소리는 고체, 액체, 기체 상태인 여러 가지 물질을 통해 전달됩니다',
  새소리-공기·물속 캐스터네츠-물·책상 연필-나무·실 전화기, 우주), 소음(u3-6 도입 뜻, 같은 소리라도 상황에 따라),
  방음재(u3-6 '소리를 흡수하는 방음재 … 음악실이나 방송실 벽에 붙여 소음을 줄여요'),
  효과음(u3-7 '영화나 만화에서 들리는 빗소리, 말발굽 소리는 진짜가 아니라 효과음 … 주변의 물건으로 소리를 만들어 낸 것',
  친구 모둠: 플라스틱 통에 쌀을 넣어 흔들어 빗소리).
  '떨림' 낱말 자체의 뜻 문장은 앱에 없어 앱 한눈에 쏙 문장('소리가 나는 물체는 떨림이 있어요')으로 설명함.
실제 그림: photos/w3u23/ (WANT.md)
미리보기: MEDIA=media_p/w3u23 ./render.sh w3u23 preview
최종: TTS_SPEED=1.0 ./make_voice.sh w3u23
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, Line, RoundedRectangle,
                   ValueTracker, VGroup, linear)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u23 as K
import firstkit as F
from kit_w3u2 import WordScene, text_card

# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "drum_skin": (960, 420), "drum_grain": (900, 380),
    "glock_short": (1500, 520), "glock_long": (420, 520),
    "phone_cup_l": (330, 560), "phone_string": (960, 470), "phone_cup_r": (1590, 560),
    "foam": (960, 480),
    "rice_box": (960, 560),
}


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


def r_(s):
    return f'<span foreground="{RED}">{s}</span>'


class W3U23(WordScene):
    UNIT = 3
    EP_TITLE = "소리의 성질"
    OUT_DIR = HERE

    def construct(self):
        self.shakes = []
        self.opening()
        self.today(["떨림", "소리의 세기", "소리의 높낮이", "소리의 전달", "소음", "방음재", "효과음"],
                   "오늘은 소리의 성질 단원의 낱말 일곱 개를 배워요. 떨림, 소리의 세기, 소리의 높낮이, 소리의 전달, 소음, 방음재, 효과음이에요.")
        self.w_vibration()
        self.w_loud()
        self.w_pitch()
        self.compare()
        self.w_travel()
        self.w_noise()
        self.w_absorber()
        self.w_effect()
        self.quiz([
            (["소리가 나는 물체는", "이것이 있어요"], "ㄸㄹ", "떨림",
             "소리가 나는 물체에 있는 것은 무엇일까요?", "정답은 떨림이에요. 소리가 나는 물체는 떨림이 있어요."),
            (["소리의 크고 작은 정도"], "ㅅㄹㅇ ㅅㄱ", "소리의 세기",
             "소리의 크고 작은 정도를 무엇이라고 할까요?", "정답은 소리의 세기예요."),
            (["소리의 높고 낮은 정도"], "ㅅㄹㅇ ㄴㄴㅇ", "소리의 높낮이",
             "소리의 높고 낮은 정도를 무엇이라고 할까요?", "정답은 소리의 높낮이예요."),
            (["다른 사람을 불쾌하게 하거나", "해를 끼칠 수 있는 시끄러운 소리"], "ㅅㅇ", "소음",
             "다른 사람을 불쾌하게 하거나 해를 끼칠 수 있는 시끄러운 소리는 무엇일까요?", "정답은 소음이에요."),
        ])
        self.closing(f"소리가 나는 물체는 {o('떨림')}이 있고,\n소리는 {g('고체 · 액체 · 기체')}를 통해 전달돼요",
                     next_preview="과학 낱말 사전 3학년 · 감염병과 건강한 생활")
        self.wait(0.5)

    def shake(self, amp=0.0, speed=7.0, decay=0.0):
        sh = K.Shake(amp).live(self, speed, decay)
        self.shakes.append(sh)
        return sh

    def stop_shakes(self):
        for sh in self.shakes:
            sh.stop(self)
        self.shakes = []

    # ── 1. 떨림 ──
    def w_vibration(self):
        self.word_intro(1, "떨림", ["소리가 나는 물체는 떨림이 있어요"],
                        "첫 번째 낱말은 떨림이에요. 떨림.", "소리가 나는 물체는 떨림이 있어요.")
        ph = F.photo("w3u23/drum", width=6.6).move_to([-3.2, 0.05, 0])
        self.say("작은북을 북채로 쳐 봐요", "작은북이에요. 북채로 치면 북의 막이 떨리면서 소리가 나요.")
        self.play(FadeIn(ph), run_time=0.6)
        sh = self.shake(0.0, speed=9, decay=0.6)
        dr = K.drum(sh, w=3.6, x=3.6, y=-1.2, grains=8, jump=2.2)
        rr = K.rings(np.array([3.6, dr.top + 0.3, 0]), sh, rmax=2.2, start=0.2, span=1.0, ref=0.15)
        self.play(FadeIn(dr), run_time=0.4)
        self.add(rr)
        self.say(f"막이 {o('떨려')} 좁쌀이 튀어 올라요", "북 위에 좁쌀을 올리고 치면, 막이 떨려서 좁쌀이 튀어 올라요.")
        self.play(sh.amp.animate.set_value(0.2), run_time=0.3)
        self.wait(1.5)
        self.say(f"손바닥으로 누르면 떨림이 멈추고 {r_('소리도 멈춰요')}",
                 "손바닥으로 북을 누르면 떨림이 멈추고, 소리도 나지 않아요.")
        self.play(sh.amp.animate.set_value(0.2), run_time=0.2)
        hand = K.hand(0.9).move_to([3.6, dr.top + 0.55, 0])
        self.play(FadeIn(hand, shift=DOWN * 0.4), sh.amp.animate.set_value(0.0), run_time=0.6)
        self.settle()
        self.stop_shakes()
        self.repeat("떨림")

    # ── 2. 소리의 세기 ──
    def w_loud(self):
        self.word_intro(2, "소리의 세기", ["소리의 크고 작은 정도"],
                        "두 번째 낱말은 소리의 세기예요. 소리의 세기.", "소리의 크고 작은 정도를 소리의 세기라고 해요.",
                        head_size=52)
        sh = self.shake(0.0, speed=9, decay=0.0)
        bx = K.rubber_box(sh, w=5.0, h=1.7, x=-2.6, y=-0.8)
        rr = K.rings(bx.mid + UP * 0.3, sh, rmax=2.0, start=PI / 2 - 0.7, span=1.4, ref=0.25)
        mt = K.meter(ValueTracker(0), x=4.2, y=0.0, s=1.0, show_num=False)
        self.say("고무줄을 튕겨 소리를 내 봐요", "플라스틱 상자에 건 고무줄을 튕겨 소리를 내 봐요.")
        self.play(FadeIn(bx), FadeIn(mt), run_time=0.6)
        self.add(rr)
        lab = T("세게 튕기면", 38, ORANGE).move_to([-2.6, 1.7, 0])
        self.say(f"{o('세게')} 튕기면 크게 떨리고 {o('큰 소리')}",
                 "세게 튕기면 고무줄이 크게 떨리고 큰 소리가 나요.")
        self.play(FadeIn(lab), sh.amp.animate.set_value(0.3), mt.val.animate.set_value(85), run_time=0.6)
        self.settle()
        lab2 = T("약하게 튕기면", 38, BLUE).move_to([-2.6, 1.7, 0])
        self.say(f"{b_('약하게')} 튕기면 작게 떨리고 {b_('작은 소리')}",
                 "약하게 튕기면 고무줄이 작게 떨리고 작은 소리가 나요.")
        self.play(FadeOut(lab), FadeIn(lab2), sh.amp.animate.set_value(0.07), mt.val.animate.set_value(30), run_time=0.6)
        self.settle()
        self.play(sh.amp.animate.set_value(0.0), mt.val.animate.set_value(0), run_time=0.4)
        self.stop_shakes()
        clear_stage(self, keep=(self.head,))
        c1 = text_card([f"{o('큰 소리')}", "운동회 응원", "멀리 있는 친구 부를 때"], size=36, w=5.4)
        c2 = text_card([f"{b_('작은 소리')}", "도서관", "아기가 잘 때"], size=36, w=5.4)
        VGroup(c1, c2).arrange(RIGHT, buff=0.6).move_to([0, 0.1, 0])
        self.say("때와 곳에 알맞은 세기로 소리를 내요",
                 "운동회에서 응원할 때는 큰 소리를, 도서관이나 아기가 잘 때는 작은 소리를 내요.")
        self.play(FadeIn(c1, shift=UP * 0.2), FadeIn(c2, shift=UP * 0.2), run_time=0.8)
        self.settle()
        self.repeat("소리의 세기")

    # ── 3. 소리의 높낮이 ──
    def w_pitch(self):
        self.word_intro(3, "소리의 높낮이", ["소리의 높고 낮은 정도"],
                        "세 번째 낱말은 소리의 높낮이예요. 소리의 높낮이.", "소리의 높고 낮은 정도를 소리의 높낮이라고 해요.",
                        head_size=52)
        ph = F.photo("w3u23/glockenspiel", height=4.5).move_to([0, 0.05, 0])
        self.say("글로켄슈필의 음판은 길이가 달라요", "글로켄슈필의 음판은 길이가 서로 달라요.")
        self.play(FadeIn(ph), run_time=0.6)
        a1, t1 = F.callout(ph, P["glock_long"], "긴 음판 · 낮은 소리", to=(0.2, -1.6), size=34, color=BLUE)
        a2, t2 = F.callout(ph, P["glock_short"], "짧은 음판 · 높은 소리", to=(0.0, -1.6), size=34)
        self.say(f"{o('짧은 음판')}을 치면 {o('높은 소리')}가 나요", "짧은 음판을 치면 높은 소리가 나요.")
        self.play(GrowArrow(a2), FadeIn(t2), run_time=0.6)
        self.say(f"{b_('긴 음판')}을 치면 {b_('낮은 소리')}가 나요", "긴 음판을 치면 낮은 소리가 나요.")
        self.play(GrowArrow(a1), FadeIn(t1), run_time=0.6)
        self.settle()
        self.say(f"물체의 길이가 {o('짧을수록')} 높은 소리",
                 "칼림바 건반도, 우쿨렐레 줄도 마찬가지예요. 물체의 길이가 짧을수록 높은 소리가 나요.")
        self.settle()
        self.repeat("소리의 높낮이")

    # ── 세기와 높낮이 견주기 ──
    def compare(self):
        self.section("견주어 봐요")
        tb = K.table([["", "세기", "높낮이"],
                      ["무엇이 달라지나요?", "물체가 떨리는 크기", "물체의 길이"],
                      ["큰 · 높은 소리", o("세게 연주해요"), o("짧은 부분을 연주해요")],
                      ["작은 · 낮은 소리", b_("약하게 연주해요"), b_("긴 부분을 연주해요")]],
                     [3.6, 4.4, 4.4], h=0.95, size=32, x=0.0, y=0.9)
        self.say(f"{o('세기')}와 {o('높낮이')}는 서로 달라요", "소리의 세기와 높낮이를 견주어 봐요. 세기는 물체가 떨리는 크기, 높낮이는 물체의 길이에 따라 달라져요.")
        self.play(FadeIn(tb, lag_ratio=0.05), run_time=1.0)
        self.settle()
        nt = M(f"모기 소리: {o('높지만 작은')} 소리 · 천둥소리: {b_('낮지만 큰')} 소리", 34).move_to([0, -1.85, 0])
        self.say("높은 소리가 큰 소리는 아니에요",
                 "높은 소리가 큰 소리는 아니에요. 모기 소리는 높지만 작은 소리이고, 천둥소리는 낮지만 큰 소리예요.")
        self.play(FadeIn(nt), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 4. 소리의 전달 ──
    def w_travel(self):
        self.word_intro(4, "소리의 전달", ["소리는 고체, 액체, 기체 상태인", "여러 가지 물질을 통해 전달돼요"],
                        "네 번째 낱말은 소리의 전달이에요. 소리의 전달.",
                        "소리는 고체, 액체, 기체 상태인 여러 가지 물질을 통해 전달돼요.",
                        sub_mean=f"소리는 {o('고체 · 액체 · 기체')}를 통해 전달돼요", head_size=52)
        rows = [("새가 지저귀는 소리", "공기", "기체", "#7A4FB0"),
                ("물속에서 부딪친 캐스터네츠 소리", "물", "액체", "#2F7FC1"),
                ("연필로 책상을 두드리는 소리", "나무 책상", "고체", "#B9834E")]
        grp = VGroup()
        for i, (a, m, s, col) in enumerate(rows):
            y = 1.35 - i * 1.15
            ta = T(a, 34).move_to([-2.6, y, 0])
            ar = T("→", 40, SOFT).move_to([1.15, y, 0])
            tm = T(m, 36).move_to([2.9, y, 0])
            st = F.name_tag(s, 32, PAPER, fill=col, stroke=col).move_to([5.1, y, 0])
            grp.add(VGroup(ta, ar, tm, st))
        nar = ["새가 지저귀는 소리는 공기를 통해 전달돼요. 공기는 기체예요.",
               "물속에서 캐스터네츠를 부딪치면 소리가 물을 통해 전달돼요. 물은 액체예요.",
               "책상에 귀를 대면 연필로 두드리는 소리가 나무 책상을 통해 또렷하게 들려요. 나무는 고체예요."]
        for row, n, (_, m, s, _c) in zip(grp, nar, rows):
            self.say(f"{m} — {o(s)}", n)
            self.play(FadeIn(row, shift=RIGHT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("w3u23/string_phone", height=4.5).move_to([0, 0.05, 0])
        self.say(f"실 전화기는 {o('팽팽한 실')}로 소리를 전달해요",
                 "실 전화기예요. 실을 팽팽하게 하면 실을 통해 소리가 잘 전달되고, 느슨하게 하면 거의 들리지 않아요.")
        self.play(FadeIn(ph), run_time=0.6)
        a, t = F.callout(ph, P["phone_string"], "팽팽한 실", to=(0.4, 1.3))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.say("우주에서는 소리를 전달할 공기가 거의 없어요",
                 "우주에는 소리를 전달할 공기가 거의 없어요. 그래서 우주 비행사들은 무선 통신 장치로 이야기해요.")
        self.settle()
        self.repeat("소리의 전달")

    # ── 5. 소음 ──
    def w_noise(self):
        self.word_intro(5, "소음", ["다른 사람을 불쾌하게 하거나", "해를 끼칠 수 있는 시끄러운 소리"],
                        "다섯 번째 낱말은 소음이에요. 소음.",
                        "다른 사람을 불쾌하게 하거나 해를 끼칠 수 있는 시끄러운 소리를 소음이라고 해요.",
                        sub_mean=f"불쾌하게 하거나 해를 끼칠 수 있는 {o('시끄러운 소리')}")
        ex = VGroup(*[F.name_tag(w, 34, INK, stroke=RED) for w in
                      ["큰 소리로 떠들기", "복도에서 뛰기", "문을 세게 닫기", "의자 끌기"]])
        ex[:2].arrange(RIGHT, buff=0.35)
        ex[2:].arrange(RIGHT, buff=0.35)
        VGroup(ex[:2], ex[2:]).arrange(DOWN, buff=0.35).move_to([0, 1.0, 0])
        self.say("학교에서 생기는 소음", "학교에서는 큰 소리로 떠들기, 복도에서 뛰기, 문을 세게 닫기, 의자 끌기가 소음을 만들어요.")
        self.play(FadeIn(ex, lag_ratio=0.15), run_time=1.0)
        nt = text_card(["같은 소리라도 듣는 사람과 상황에 따라", f"{o('소음')}이 되기도 해요"], size=34).move_to([0, -1.25, 0])
        self.say(f"같은 소리라도 상황에 따라 {o('소음')}이 돼요",
                 "같은 소리라도 듣는 사람과 상황에 따라 소음이 되기도 해요. 공연장의 큰 음악도 밤늦게 옆집에서 들리면 소음이 돼요.")
        self.play(FadeIn(nt, shift=UP * 0.2), run_time=0.6)
        self.settle()
        self.repeat("소음")

    # ── 6. 방음재 ──
    def w_absorber(self):
        self.word_intro(6, "방음재", ["소리를 흡수해 소음을 줄여요"],
                        "여섯 번째 낱말은 방음재예요. 방음재.",
                        "방음재는 소리를 흡수하는 재료예요. 벽에 붙여 소음을 줄여요.")
        ph = F.photo("w3u23/soundproof", height=4.5).move_to([0, 0.05, 0])
        self.say(f"음악실이나 방송실 벽에 붙여요", "음악실이나 방송실 벽에 방음재를 붙여 소음을 줄여요.")
        self.play(FadeIn(ph), run_time=0.6)
        a, t = F.callout(ph, P["foam"], "방음재", to=(2.6, 1.0))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.settle()
        self.repeat("방음재")

    # ── 7. 효과음 ──
    def w_effect(self):
        self.word_intro(7, "효과음", ["주변의 물건으로 소리를 만들어 낸 것"],
                        "마지막 일곱 번째 낱말은 효과음이에요. 효과음.",
                        "영화나 만화에서 들리는 빗소리, 말발굽 소리는 진짜가 아니라 효과음이에요. 주변의 물건으로 소리를 만들어 낸 것이에요.")
        ph = F.photo("w3u23/rice_shaker", height=4.5).move_to([0, 0.05, 0])
        self.say(f"통에 쌀을 넣고 흔들면 {o('빗소리')}", "플라스틱 통에 쌀을 넣어 흔들면 빗소리 같은 효과음을 만들 수 있어요.")
        self.play(FadeIn(ph), run_time=0.6)
        a, t = F.callout(ph, P["rice_box"], "쌀을 넣은 플라스틱 통", to=(0.4, -1.6), size=34)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.say(f"{o('세기')}와 {o('높낮이')}를 바꾸어 장면에 어울리게",
                 "소리의 세기와 높낮이를 바꾸어 장면에 어울리는 효과음을 만들어요.")
        self.settle()
        self.repeat("효과음")


class w3u23(W3U23):
    """render.sh가 폴더 이름을 장면 이름으로 넘기므로 같은 장면을 이 이름으로도 둠"""
    pass
