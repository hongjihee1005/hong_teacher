"""「과학 원리 돋보기」 6학년 36화 — 과학이 미래 문제를 해결할 수 있을까? (6-2 4단원 과학과 나의 진로 3~4차시, 화 코드 6-2-4-b)

바탕: grade6/science/sem2/u4-2.html(원본 _build_tb/src2/u4-2.html) — 도입(환경오염 해결: 생활 속 실천 / 과학 기술), 토의해요·활동해요
(문제별 과학이 기여하는 방법 + 시민 의견), 정리해요(짝 짓기, 원인을 줄여요 / 이미 생긴 변화에 대처해요), 생각 바로잡기(과학만으로는 한계,
유전자 편집과 윤리 문제), 한눈에 쏙(+ 백신으로 천연두 예방), 형성 평가 2의 예시 답(다양한 측면에서 종합적으로).
단원 뒤 차시를 개념으로 덧붙임: u4-3(직업과 관련된 과학적 요소 = 과학 지식 + 과학적 탐구 과정, 소방관 예, 다양한 직업에서 찾을 수 있음,
형성 평가 1), u4-4(과학 기술의 발달 → 진로에 영향, 나의 진로와 과학을 관련지어 생각), u4-5(타자수·전화 교환원 → 새 직업,
도심 항공 교통관제사). 과학 시리즈 마지막 단원의 마지막 편이라 '다음 영상' 줄 없이 끝냄(kit_s6u24.NoNextClosing).
최종: ./make_final.sh s6ep36
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Arrow)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S6Ep36(K.NoNextClosing, EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 36
    EP_TITLE = "과학이 미래 문제를 해결할 수 있을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.contribute()
        self.two_ways()
        self.limits()
        self.summary()
        self.job_elements()
        self.job_change()
        self.check()
        self.closing(f"과학은 미래 사회의 문제를 해결하는 데 {o('기여')}할 수 있고,\n{g('나의 진로')}와도 이어져 있어요", next_preview="")
        self.wait(0.5)

    # ── 궁금해요: 환경오염 해결 ──
    def intro(self):
        self.section("궁금해요")
        bins = VGroup(K.bin_box("우리가 생활에서 실천해요", 6.3, 3.6, "#2F6FD6", 32),
                      K.bin_box("과학 기술이 기여해요", 6.3, 3.6, GREEN, 32)).arrange(RIGHT, buff=0.3).move_to([0, 0.75, 0])
        left = VGroup(K.word_card("쓰레기를 줄이거나 재활용해요", 5.8, 0.9, size=27),
                      K.word_card("친환경 제품을 사용해요", 5.8, 0.9, size=27)).arrange(DOWN, buff=0.25)
        right = VGroup(K.word_card("오염 물질을 적게 배출하는 기술", 5.8, 0.9, size=27),
                       K.word_card("오염 물질을 없애는 기술", 5.8, 0.9, size=27)).arrange(DOWN, buff=0.25)
        left.move_to(bins[0].box.get_center() + DOWN * 0.3)
        right.move_to(bins[1].box.get_center() + DOWN * 0.3)
        self.say("환경오염 문제를 어떻게 해결할 수 있을까요?", "환경오염 문제를 어떻게 해결할 수 있을까요?")
        self.play(FadeIn(bins), run_time=0.6)
        self.say(f"생활 속 실천과 함께 {g('과학 기술')}도 문제 해결에 기여해요",
                 "생활 속 실천과 함께, 오염 물질을 적게 배출하거나 없애는 과학 기술도 문제 해결에 기여해요.")
        self.play(FadeIn(left, lag_ratio=0.3), run_time=0.7)
        self.play(FadeIn(right, lag_ratio=0.3), run_time=0.7)
        self.say("미래에 일어날 수 있는 문제도 과학으로 해결할 수 있을까요?",
                 "그렇다면 미래에 일어날 수 있는 문제도 과학으로 해결할 수 있을까요?")
        self.settle()
        clear_stage(self)

    # ── 토의해요: 문제별 과학이 기여하는 방법 ──
    def contribute(self):
        self.section("토의해요")
        ys = [1.95, 0.35, -1.25]
        tags = VGroup(*[K.prob_tag(i, 30).move_to([-4.85, y, 0]) for i, y in enumerate(ys)])
        self.say("미래 사회의 문제마다 과학이 기여할 수 있는 방법은?",
                 "미래 사회의 문제마다 과학이 기여할 수 있는 방법을 토의해 봐요.")
        self.play(FadeIn(tags, lag_ratio=0.2), run_time=0.8)
        self.pause_screen(5, "과학은 어떻게 도울 수 있을까요?")
        pics = [K.robot_icon(), K.solar_panel(), K.lock_icon()]
        mains = ["로봇·인공지능 기술로 사람이 하던 일을 자동화", "친환경적인 재생 에너지를 생산", "정보 보안 기술로 개인 정보 유출·해킹 예방"]
        extras = ["빅데이터 분석으로 인구 변화를 예측해 정책 개발", "위성·드론·센서로 환경오염을 실시간 관측",
                  "위조된 사진·영상을 탐지하는 기술"]
        rows = VGroup()
        for i, y in enumerate(ys):
            box = K.rr(9.2, 1.35, PAPER, x=2.25, y=y, stroke=K.P_COL[i], r=0.16)
            pic = K.fit(pics[i], 1.0, 0.95).move_to([-1.75, y, 0])
            m1 = T(mains[i], 28, INK)
            m2 = M(f'<span foreground="{SOFT}">＋ 시민 의견: </span>' + extras[i], 23)
            txt = VGroup(m1, m2).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
            if txt.width > 7.6:
                txt.scale_to_fit_width(7.6)
            txt.move_to([-1.05, y, 0], aligned_edge=LEFT)
            arr = Arrow([tags[i].get_right()[0], y, 0], [box.get_left()[0], y, 0], buff=0.08, stroke_width=6, color=K.P_COL[i],
                        max_tip_length_to_length_ratio=0.4)
            rows.add(VGroup(arr, box, pic, m1, m2))
        nar = [("인구 문제(노동력 부족) → 로봇·인공지능 기술로 자동화",
                "노동력 부족에는 로봇과 인공지능 기술로 일을 자동화하고, 빅데이터로 인구 변화를 예측할 수 있어요."),
               ("환경 문제(기후 위기·환경오염) → 친환경 재생 에너지",
                "기후 위기와 환경오염에는 재생 에너지를 생산하고, 위성과 드론, 센서로 환경오염을 관측해요."),
               ("윤리 문제(과학 기술의 범죄 악용) → 정보 보안 기술",
                "범죄 악용에는 정보 보안 기술로 해킹을 예방하고, 위조된 사진과 영상을 탐지해요.")]
        for row, (s_, n_) in zip(rows, nar):
            self.say(s_, n_)
            self.play(Create(row[0]), FadeIn(row[1]), FadeIn(row[2]), FadeIn(row[3]), run_time=0.7)
            self.play(FadeIn(row[4], shift=RIGHT * 0.2), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 정리해요: 두 가지 방식 ──
    def two_ways(self):
        self.section("정리해요")
        a = K.icon_card(K.solar_panel(), "문제의 원인을 줄여요", [f"재생 에너지를 쓰면", f"오염 물질이 {o('처음부터 덜')} 생겨요"],
                        w=5.9, h=4.2, col=GREEN, size=28, head=34, pic_h=1.5)
        b_ = K.icon_card(K.robot_icon(), "이미 생긴 변화에 대처해요", [f"자동화로 이미 일어난", f"{o('노동력 부족')}에 대처해요"],
                         w=5.9, h=4.2, col="#2F6FD6", size=28, head=34, pic_h=1.5)
        VGroup(a, b_).arrange(RIGHT, buff=0.5).move_to([0, 0.55, 0])
        self.say(f"과학은 {g('원인을 줄이거나')}, {o('이미 생긴 변화에 대처')}해 기여해요",
                 "재생 에너지처럼 문제의 원인을 줄이기도 하고, 자동화처럼 이미 생긴 변화에 대처하기도 해요.")
        self.play(FadeIn(a), run_time=0.6)
        self.play(FadeIn(b_), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def limits(self):
        self.section("생각 바로잡기")
        q = K.text_card(["미래 사회의 모든 문제를 과학만으로 해결할 수 있을까요?"], size=36).move_to([0, 1.95, 0])
        self.say("미래 사회의 모든 문제를 과학만으로 해결할 수 있을까요?",
                 "그렇다면 미래 사회의 모든 문제를 과학만으로 해결할 수 있을까요?")
        self.play(FadeIn(q), run_time=0.5)
        gene = K.text_card([f"유전자를 편집해 유전병을 치료하는 기술 → 인간에게 {g('유용')}해요",
                            f"하지만 인간의 존엄성을 침해하거나 차별을 일으키는 {r('윤리적 문제')}가 생길 수 있어요"],
                           w=12.6, size=29).move_to([0, 0.25, 0])
        self.say(f"아니요 — 유전자 편집 기술처럼 {r('윤리적 문제')}가 생길 수 있어요",
                 "아니요. 유전자를 편집해 유전병을 치료하는 기술은 유용하지만, 인간의 존엄성을 침해하거나 차별을 일으키는 윤리적 문제가 생길 수 있어요.")
        self.play(FadeIn(gene), run_time=0.6)
        self.settle()
        tip = K.text_card([f"윤리적·문화적 문제 등은 과학만으로 해결하기 어려워요 → {o('다양한 측면')}에서 {o('종합적')}으로"],
                          w=12.6, size=31, stroke=ORANGE).move_to([0, -1.45, 0])
        self.say(f"과학만으로는 한계 → {o('다양한 측면')}에서 함께 생각해요",
                 "과학만으로는 한계가 있어요. 그래서 다양한 측면에서 종합적으로 생각해 문제를 해결하려는 자세가 필요해요.")
        self.play(FadeIn(tip), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"미래 사회의 문제를 해결하는 데 {g('과학')}이 기여할 수 있습니다."], w=12.4, size=40).move_to([0, 1.35, 0])
        self.say(f"미래 사회의 문제를 해결하는 데 {g('과학')}이 기여할 수 있어요",
                 "미래 사회의 문제를 해결하는 데 과학이 기여할 수 있습니다.")
        self.play(FadeIn(card), run_time=0.6)
        ex = K.text_card(["과학이 사회 문제 해결에 기여한 예", f"· 농업 생산 기술의 발달 → {o('식량 부족')} 문제 해결에 기여",
                          f"· 백신을 개발해 {o('천연두')}를 예방했어요"], w=12.4, size=30).move_to([0, -0.95, 0])
        self.say(f"농업 생산 기술 → 식량 부족 해결, 백신 → {o('천연두')} 예방",
                 "농업 생산 기술의 발달이 식량 부족 문제를 해결하는 데 기여했고, 백신을 개발해 천연두를 예방한 것처럼요.")
        self.play(FadeIn(ex), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 과학과 나의 진로: 직업과 관련된 과학적 요소 (u4-3) ──
    def job_elements(self):
        self.section("과학과 진로")
        head = K.label("소방관", RED, 34).move_to([0, 2.55, 0])
        bins = VGroup(K.bin_box("과학 지식", 5.0, 3.5, "#2F6FD6", 32), K.bin_box("과학적 탐구 과정", 7.4, 3.5, GREEN, 32)).arrange(RIGHT, buff=0.3).move_to([0, 0.2, 0])
        kn = VGroup(K.word_card("연소의 조건", 4.4, 0.85, size=28), K.word_card("이산화 탄소의 성질", 4.4, 0.85, size=28)).arrange(DOWN, buff=0.25)
        kn.move_to(bins[0].box.get_center() + DOWN * 0.3)
        inq = K.text_card(["발화점 아래로 빠르게 온도를 낮추려면", "소방 헬기와 호스로 동시에 물을 뿌려야겠어."], w=6.9, size=27)
        inq.move_to(bins[1].box.get_center() + DOWN * 0.3)
        self.say(f"직업과 관련된 과학적 요소 = {o('과학 지식')} + {g('과학적 탐구 과정')}",
                 "과학은 직업과도 관련 있어요. 직업에 필요한 과학 지식과, 문제를 해결하는 과학적 탐구 과정이에요.")
        self.play(FadeIn(head), FadeIn(bins), run_time=0.6)
        self.say("소방관: 연소의 조건을 알고, 불을 끄는 방법을 탐구해요",
                 "소방관에게는 연소의 조건 같은 지식과, 불을 빨리 끄는 방법을 찾는 탐구가 필요해요.")
        self.play(FadeIn(kn, lag_ratio=0.3), run_time=0.6)
        self.play(FadeIn(inq), run_time=0.5)
        self.settle()
        self.say(f"과학자뿐 아니라 {o('다양한 직업')}에서 과학적 요소를 찾을 수 있어요",
                 "과학자만이 아니라 다양한 직업에서 과학적 요소를 찾을 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 과학 기술의 발달과 직업 (u4-4·u4-5) ──
    def job_change(self):
        self.section("과학과 진로")
        rows = [("타자수", "컴퓨터 기술의 발전", "프로그래머, 하드웨어 개발자"),
                ("전화 교환원", "통신 기술의 발전", "모바일 앱 개발자, 스마트폰 개발자")]
        grp = VGroup()
        for i, (old, tech, new) in enumerate(rows):
            y = 1.8 - i * 1.3
            a = K.word_card(old, 2.9, 0.9, col=SOFT, size=28).move_to([-4.9, y, 0])
            b_ = K.word_card(new, 6.6, 0.9, col=GREEN, size=28).move_to([3.15, y, 0])
            arr = Arrow(a.get_right(), b_.get_left(), buff=0.1, stroke_width=6, color=ORANGE, max_tip_length_to_length_ratio=0.2)
            t = T(tech, 22, ORANGE).next_to(arr, UP, buff=0.04)
            grp.add(VGroup(a, arr, t, b_))
        self.say("과학 기술이 발달하면서 직업도 바뀌어 왔어요",
                 "컴퓨터와 통신 기술이 발전하자 타자수, 전화 교환원 대신 프로그래머, 스마트폰 개발자 같은 직업이 생겼어요.")
        for row in grp:
            self.play(FadeIn(row[0]), Create(row[1]), FadeIn(row[2]), run_time=0.5)
            self.play(FadeIn(row[3], shift=RIGHT * 0.2), run_time=0.4)
        self.settle()
        fut = K.text_card([f"미래 직업 예: {o('도심 항공 교통관제사')}",
                           "드론, 에어 택시 등 도심을 나는 항공기의 안전을 위해 교통 정보를 안내해요"], w=12.4, size=28).move_to([0, -1.15, 0])
        self.say(f"미래에는 {o('도심 항공 교통관제사')} 같은 새 직업이 생길 거예요",
                 "미래에는 드론과 에어 택시의 안전을 관리하는 도심 항공 교통관제사 같은 직업이 생길 거예요.")
        self.play(FadeIn(fut), run_time=0.6)
        self.settle()
        self.say(f"그래서 {g('나의 진로')}와 과학을 관련지어 생각하는 것이 중요해요",
                 "과학 기술의 발달은 미래 사회에 영향을 미치므로, 나의 진로와 과학을 관련지어 생각해요.")
        self.play(Indicate(fut, color=GREEN, scale_factor=1.03), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 확인해요 (u4-3 형성 평가 1) ──
    def check(self):
        self.section("확인해요")
        items = [("① 예술 분야의 직업은 과학과 아무 관련이 없다.", False),
                 ("② 과학 지식은 과학과 관련된 직업에만 필요하다.", False),
                 ("③ 직업과 관련된 과학적 요소에는 과학 지식과 과학적 탐구 과정이 있다.", True),
                 ("④ 과학자처럼 과학과 직접 관련 있는 직업에서만 과학적 요소를 찾을 수 있다.", False),
                 ("⑤ 직업을 수행하면서 겪는 문제를 해결하는 과정은 과학적 탐구 과정에 포함된다.", True)]
        cards = VGroup(*[K.word_card(t_, 11.6, 0.72, size=26) for t_, _ in items]).arrange(DOWN, buff=0.16).move_to([0.45, 0.55, 0])
        self.say("옳은 것을 두 가지 골라요", "직업과 관련된 과학적 요소에 관한 설명으로 옳은 것을 두 가지 골라요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.8)
        self.pause_screen(5, "옳은 것 두 가지는?")
        marks = VGroup(*[K.ox_mark(ok, 0.22).next_to(c_, LEFT, buff=0.18) for c_, (_, ok) in zip(cards, items)])
        self.say(f"{g('③·⑤')} — 과학적 요소는 다양한 직업에서 찾을 수 있어요",
                 "답은 3번과 5번이에요. 과학적 요소는 예술 분야를 비롯한 다양한 직업에서 찾을 수 있어요.")
        self.play(FadeIn(marks, lag_ratio=0.2), run_time=0.8)
        self.settle()
        clear_stage(self)
