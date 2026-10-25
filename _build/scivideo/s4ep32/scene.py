"""「과학 원리 돋보기」 4학년 32화 — 우리는 기후변화에 어떤 영향을 줄까? (4-2 4단원 3차시, 화 코드 4-2-4-b)

바탕: grade4/science/sem2/u4-2.html(원본 _build_tb/src2/u4-2.html) — 도입(가까운 거리를 걸으면? 매연·에너지 사용을 줄임),
최근 100여 년 동안 급격하게 변함(인간의 활동이 많아짐), 영상(옛날 농사 → 공장·매연 / 숲 → 나무를 베거나 태움),
그림 속 기후변화에 영향을 주는 활동 6가지, 장소별 토의(도움이 되는 행동: 플러그 뽑기·빈 교실 전등 끄기·급식 남기지 않기·
장바구니·꼭 필요한 물건만), 친구 의견, 정리 O·X 세 문장, 한눈에 쏙(최근에 급격하게 늘어난 인간의 활동은 기후변화에 영향).
※ EPISODES.md의 '온실 기체 담요' 장면은 앱에 없어 넣지 않음.
최종: ./make_final.sh s4ep32
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Line, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def field(w=3.6):
    g_ = VGroup(K.R(w, 0.9, "#A7D38B", 0, 0, rad=0.08, stroke="#7FAE6A", sw=3))
    for i in range(6):
        x = -w / 2 + 0.35 + i * (w - 0.7) / 5
        g_.add(VGroup(K.L((x, -0.3), (x, 0.25), "#5E9E3A", 5), K.E(0.18, 0.3, "#7DBB55", x - 0.08, 0.1, sw=2),
                      K.E(0.18, 0.3, "#7DBB55", x + 0.08, 0.15, sw=2)))
    return g_


def panel(title, w=6.3, h=4.3):
    box = K.R(w, h, "#F7FBFF", 0, 0, rad=0.2, stroke=SOFT, sw=4)
    t = T(title, 30, INK)
    tb = K.R(t.width + 0.4, t.height + 0.22, PAPER, rad=0.12, stroke=SOFT, sw=3)
    t.move_to(tb)
    VGroup(tb, t).move_to(box.get_top() + DOWN * 0.42)
    return VGroup(box, VGroup(tb, t))


def act_card(pic, text, w=3.95, h=2.15):
    box = K.R(w, h, PAPER, rad=0.16, stroke=SOFT, sw=4)
    p = K.fit(pic, w - 0.6, h - 0.9).move_to(box.get_top() + DOWN * (h - 0.75) / 2 + DOWN * 0.05)
    t = M(text, 24)
    if t.width > w - 0.25:
        t.scale_to_fit_width(w - 0.25)
    t.move_to(box.get_bottom() + UP * 0.38)
    return VGroup(box, p, t)


class S4Ep32(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 32
    EP_TITLE = "우리는 기후변화에 어떤 영향을 줄까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.industry()
        self.daily()
        self.check()
        self.summary()
        self.closing(f"최근에 급격하게 늘어난 {o('인간의 활동')}은\n기후변화에 {r('영향')}을 주고 있어요",
                     next_preview="4학년 33화 · 기후변화가 생활과 환경에 주는 영향")
        self.wait(0.5)

    # ── 궁금해요: 걸어서 학교에 ──
    def intro(self):
        self.section("궁금해요")
        road = K.R(13.0, 0.6, "#C9C3B8", 0, -1.55, rad=0.05, stroke=SOFT, sw=2)
        school = K.house(2.0, "#F1E1C6", "#B8452F").move_to([5.0, 0.05, 0])
        st = T("학교", 30).move_to(school[0])
        kids = VGroup(*[K.kid(c).scale(1.1) for c in ("#E2573F", "#2E9E5B", "#6B3FA0")]).arrange(RIGHT, buff=0.3)
        kids.move_to([0.3, -1.25 + 0.5 * 1.1, 0], aligned_edge=DOWN).align_to(road, DOWN).shift(UP * 0.3)
        car = K.car(K.COLD, 2.0, exhaust=True).move_to([-4.3, -0.95, 0])
        x = Cross(car, stroke_color=RED, stroke_width=10)
        self.say("가까운 학교까지 자동차 대신 걸어가요", "가까운 학교까지 자동차를 타지 않고 걸어가요.")
        self.play(FadeIn(road), FadeIn(school), FadeIn(st), FadeIn(car), run_time=0.6)
        self.play(Create(x), FadeIn(kids, shift=RIGHT * 0.3), run_time=0.7)
        self.play(kids.animate.shift(RIGHT * 1.2), run_time=1.2)
        self.say(f"걸으면 기후변화에 {o('어떤 영향')}을 줄 수 있을까요?",
                 "가까운 거리를 걸으면 기후변화에 어떤 영향을 줄 수 있을까요?")
        self.pause_screen(5, "걸으면 기후변화에 어떤 영향을 줄까요?")
        ans = K.text_card([f"자동차를 탈 때 나오는 {g('매연을 줄일')} 수 있어요",
                           f"자동차를 타지 않으면 {g('에너지 사용을 줄일')} 수 있어요"], size=34, stroke=GREEN).move_to([-0.6, 2.2, 0])
        self.play(FadeIn(ans), run_time=0.6)
        self.say(f"{g('매연')}과 {g('에너지 사용')}을 줄일 수 있어요",
                 "매연을 줄이고 에너지 사용을 줄일 수 있어요. 우리의 생활이 기후변화와 이어져 있다는 뜻이에요.")
        self.settle()
        clear_stage(self)
        # 최근 100여 년
        line = Line([-5.6, 0, 0], [5.6, 0, 0], stroke_color=SOFT, stroke_width=8)
        slow = K.smooth([(-5.6, 0.6), (-3, 0.75), (-0.5, 0.55), (2.0, 0.7)], BLUE, 8)
        fast = K.smooth([(2.0, 0.7), (3.5, 1.1), (4.6, 1.8), (5.4, 2.6)], RED, 10)
        l1 = T("자연적으로도 조금씩 변해 왔어요", 28, BLUE).move_to([-2.0, 1.35, 0])
        l2 = T("최근 100여 년", 32, RED).move_to([3.7, -0.5, 0])
        br = Line([2.0, -0.15, 0], [5.6, -0.15, 0], stroke_color=RED, stroke_width=8)
        ax = T("기후의 변화", 26, SOFT).move_to([-4.6, 2.4, 0])
        self.say("기후는 자연적으로도 조금씩 변해 왔어요",
                 "기후는 자연적으로도 변해 왔어요.")
        self.play(Create(line), FadeIn(ax), Create(slow), FadeIn(l1), run_time=1.0)
        self.settle()
        self.play(Create(fast), Create(br), FadeIn(l2), run_time=1.0)
        self.say(f"인간의 활동이 많아진 {r('최근 100여 년')} 동안 급격하게 변해요",
                 "그런데 인간의 활동이 많아진 최근 100여 년 동안 급격하게 변하고 있어요. 어떤 관련이 있을까요?")
        self.settle()
        clear_stage(self)

    # ── 산업 활동과 산림 훼손 ──
    def industry(self):
        self.section("산업과 숲")
        pl = panel("산업 활동 · 옛날").move_to([-3.35, 0.35, 0])
        pr = panel("산림 · 옛날").move_to([3.35, 0.35, 0])
        bl = pl[0].get_bottom()[1] + 0.25
        fld = field(5.4).move_to([pl.get_center()[0], bl + 0.45, 0])
        farm = K.house(1.3, "#E8C39E", "#A0673A").move_to([-4.9, bl + 1.75, 0])
        farmer = K.kid("#16804A").scale(1.0).move_to([-2.2, bl + 1.45, 0])
        old_l = VGroup(fld, farm, farmer)
        fr = K.forest(7, 5.4, 1.35, seed=2).move_to([pr.get_center()[0], bl + 0.95, 0], aligned_edge=DOWN)
        fr2 = K.forest(6, 4.6, 1.15, seed=5).move_to([pr.get_center()[0], bl + 0.3, 0], aligned_edge=DOWN)
        self.say("옛날에는 대부분 농사를 지으며 살았어요",
                 "옛날에는 대부분 농사를 지으며 살았고, 나무가 빽빽한 숲에는 많은 생물이 살았어요.")
        self.play(FadeIn(pl), FadeIn(pr), FadeIn(old_l), FadeIn(fr), FadeIn(fr2), run_time=0.8)
        self.settle()
        self.pause_screen(5, "오늘날에는 어떻게 바뀌었을까요?")
        # 왼쪽: 공장
        fac = K.factory().scale(1.05).move_to([-4.2, bl + 1.15, 0])
        road = K.R(5.6, 0.32, "#666666", pl.get_center()[0], bl + 0.1, rad=0.04, stroke=INK, sw=2)
        cars = VGroup(K.car(K.HOT, 0.9, exhaust=True), K.car(K.COLD, 0.9, exhaust=True)).arrange(RIGHT, buff=0.8).move_to([-2.5, bl + 0.45, 0])
        box_ = K.boxes(6).scale(0.8).move_to([-1.55, bl + 1.3, 0])
        t_new = panel("산업 활동 · 오늘날").move_to(pl)[1]
        self.play(FadeOut(old_l), Transform(pl[1], t_new), run_time=0.5)
        self.play(FadeIn(fac), FadeIn(road), FadeIn(cars), FadeIn(box_), run_time=0.8)
        self.say(f"공장이 많아져 물건을 많이 생산하고 {r('매연')}이 생겨요",
                 "농업에서 공업으로 산업이 변했어요. 공장에서 물건을 많이 생산하고 매연이 생겨요.")
        self.play(fac.smoke.animate.shift(UP * 0.15).set_opacity(0.6), run_time=1.0)
        self.settle()
        # 오른쪽: 숲이 줄어요
        t_new2 = panel("산림 · 오늘날").move_to(pr)[1]
        anims = [Transform(pr[1], t_new2)]
        cut = [0, 2, 4, 6]
        for i in cut:
            tr = fr[i]
            stp = K.stump(1.35).move_to(tr.get_bottom(), aligned_edge=DOWN)
            anims.append(Transform(tr, stp))
        for i in (1, 3):
            tr = fr2[i]
            anims.append(Transform(tr, K.stump(1.15).move_to(tr.get_bottom(), aligned_edge=DOWN)))
        self.play(*anims, run_time=0.9)
        fi = K.fire(0.9).move_to(fr2[4].get_bottom() + UP * 0.45 + RIGHT * 0.2)
        self.play(FadeIn(fi, scale=0.5), run_time=0.5)
        self.say(f"땅을 개발하려고 나무를 베거나 태워 {r('숲이 줄어요')}",
                 "땅을 개발하려고 나무를 베거나 태워요. 숲이 점점 줄어들고 있어요.")
        self.settle()
        self.say(f"늘어난 인간의 활동은 {r('기후변화')}에 영향을 줘요",
                 "과거에 비해 급격하게 늘어난 인간의 활동은 지구의 평균 기온이 높아지게 하는 등 기후변화에 영향을 주고 있어요.")
        self.settle()
        clear_stage(self)

    # ── 우리 생활 속 활동 6가지 ──
    def daily(self):
        self.section("생활 속 활동")
        pics = [(K.heater_window(), "창문을 열고 난방 기구를 사용해요"),
                (K.tap(True), "수돗물을 틀어 놓고 양치해요"),
                (VGroup(K.tv(True), K.lamp(True).scale(0.8)).arrange(RIGHT, buff=0.3), "빈방에 텔레비전과 전등을 켜 놓아요"),
                (K.boxes(6), "필요 없는 물건을 많이 구입해요"),
                (K.trash_pile(), "쓰레기를 분리배출하지 않고 버려요"),
                (VGroup(K.car(K.HOT, 1.4, exhaust=True), K.plane(1.6)).arrange(RIGHT, buff=0.3), "자동차, 비행기를 많이 이용해요")]
        cards = VGroup(*[act_card(p, t) for p, t in pics]).arrange_in_grid(rows=2, cols=3, buff=(0.3, 0.3)).move_to([0, 0.3, 0])
        self.say("우리 생활에서는 어떤 활동이 영향을 줄까요?",
                 "우리 생활 속에서는 어떤 활동이 기후변화에 영향을 줄까요? 그림 속에 여섯 가지가 숨어 있어요.")
        self.pause_screen(5, "기후변화에 영향을 주는 생활 속 활동은?")
        narr = ["창문을 열어 놓고 난방 기구를 켜요.", "수돗물을 틀어 놓고 양치해요.", "빈방에 텔레비전과 전등을 켜 놓아요.",
                "필요 없는 물건을 많이 사요.", "쓰레기를 분리배출하지 않고 함부로 버려요.", "자동차, 비행기 같은 교통수단을 많이 이용해요."]
        for i, c in enumerate(cards):
            self.play(FadeIn(c, scale=0.9), run_time=0.45)
            if i % 2 == 1:
                self.say(f"{plain_(pics[i - 1][1])} · {plain_(pics[i][1])}"[:0] + f"찾았어요! {o(str(i + 1))}/6",
                         narr[i - 1] + " " + narr[i])
        self.settle()
        self.say(f"물과 {o('에너지를 낭비')}하는 활동이 기후변화에 영향을 줘요",
                 "물과 에너지를 낭비하고, 물건을 많이 사고 버리는 활동이 기후변화에 영향을 줘요. 나의 생활에도 비슷한 활동이 있었나요?")
        self.settle()
        clear_stage(self)
        # 친구 의견
        self.section("토의해요")
        q = K.text_card([f"인간의 활동은 기후변화와 {o('어떤 관련')}이 있을까요?"], size=38, stroke=ORANGE).move_to([0, 2.2, 0])
        ops = K.text_card(["친구 1 · 공장에서 물건을 생산하고 숲을 파괴하는 활동이 기후변화를 일으켜요",
                           "친구 2 · 에너지를 낭비하는 활동으로 기후변화가 심각해지고 있어요",
                           "친구 3 · 자동차, 비행기 같은 교통수단을 많이 이용하는 것도 영향을 줘요"], w=12.8, size=30).move_to([0, -0.15, 0])
        self.say("친구들은 어떻게 생각했을까요?", "가운데 질문에 대해 친구들은 이렇게 의견을 냈어요.")
        self.play(FadeIn(q), run_time=0.5)
        for t in ops[1]:
            self.play(FadeIn(t, shift=RIGHT * 0.2), run_time=0.4)
        self.play(FadeIn(ops[0]), run_time=0.3)
        self.settle()
        self.say("친구의 의견을 존중하며 내 의견도 말해 봐요",
                 "토의할 때는 친구의 의견을 존중하며 내 의견도 말해 봐요.")
        self.settle()
        clear_stage(self)

    # ── 정리 O·X ──
    def check(self):
        self.section("정리해요")
        rows = [("기후는 최근 100여 년 동안 급격하게 변하고 있다.", True),
                ("인간의 활동은 기후변화와 아무 관련이 없다.", False),
                ("나의 생활 습관도 기후변화에 영향을 줄 수 있다.", True)]
        grp = VGroup()
        for i, (t, _) in enumerate(rows):
            box = K.R(11.6, 1.05, PAPER, rad=0.16, stroke=SOFT, sw=4)
            tx = T(f"({i + 1}) {t}", 32).move_to(box).align_to(box, LEFT).shift(RIGHT * 0.35)
            grp.add(VGroup(box, tx))
        grp.arrange(DOWN, buff=0.28).move_to([0, 0.55, 0])
        self.say("○일까요, ×일까요?", "토의하며 알게 된 점을 정리해요. 맞으면 동그라미, 틀리면 가위표예요.")
        self.play(FadeIn(grp, lag_ratio=0.2), run_time=0.9)
        self.pause_screen(5, "○일까요, ×일까요?")
        marks = VGroup()
        for row, (_, ok) in zip(grp, rows):
            m = T("○" if ok else "×", 64, GREEN if ok else RED).next_to(row[0], RIGHT, buff=0.25)
            marks.add(m)
        for m in marks:
            self.play(FadeIn(m, scale=1.5), run_time=0.4)
        self.say(f"인간의 활동은 기후변화와 {r('관련')}이 있어요",
                 "1번은 동그라미, 2번은 가위표, 3번은 동그라미예요. 인간의 활동은 기후변화와 관련이 있고, 나의 생활 습관도 영향을 줄 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 + 우리가 할 수 있는 일 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["산림을 훼손하고 물과 에너지를 낭비하는 등",
                            f"최근에 급격하게 늘어난 {g('인간')}의 활동은",
                            "기후변화에 영향을 주고 있습니다."], w=12.4, size=44).move_to([0, 0.6, 0])
        self.say(f"늘어난 {g('인간')}의 활동이 기후변화에 영향을 줘요",
                 "산림을 훼손하고 물과 에너지를 낭비하는 등 최근에 급격하게 늘어난 인간의 활동은 기후변화에 영향을 주고 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
        self.section("우리가 할 수 있는 일")
        good = [(K.plug(True), "쓰지 않는 플러그를\n뽑아 두어요"), (K.lamp(False), "빈 교실의\n전등을 꺼요"),
                (K.boxes(2), "꼭 필요한 물건만\n사요"), (K.tumbler(), "장바구니·다회용 컵을\n써요")]
        cards = VGroup()
        for p, t in good:
            box = K.R(3.0, 3.1, PAPER, rad=0.18, stroke=GREEN, sw=5)
            pp = K.fit(p, 2.0, 1.4).move_to(box.get_top() + DOWN * 1.0)
            tt = T(t, 26).next_to(pp, DOWN, buff=0.3)
            cards.add(VGroup(box, pp, tt))
        cards.arrange(RIGHT, buff=0.3).move_to([0, 0.35, 0])
        self.say(f"반대로 이런 행동은 {g('기후변화를 줄이는 데')} 도움이 돼요",
                 "반대로 이런 행동은 기후변화를 줄이는 데 도움이 돼요. 쓰지 않는 플러그 뽑기, 빈 교실 전등 끄기, 꼭 필요한 물건만 사기, 장바구니 쓰기예요.")
        self.play(FadeIn(cards, lag_ratio=0.25), run_time=1.2)
        self.settle()
        self.say(f"나의 {g('작은 습관')}부터 바꿔 볼까요?",
                 "나의 생활 습관도 기후변화에 영향을 주니까, 작은 습관부터 바꿔 볼까요?")
        self.settle()
        clear_stage(self)


def plain_(s):
    return s
