"""「과학 원리 돋보기」 6학년 1화 — 여러 가지 용액을 분류해 볼까? (6-1 1단원 산과 염기 1차시, 화 코드 6-1-1-a)

바탕: grade6/science/sem1/u1-1.html(원본 _build_tb/src/u1-1.html) — 도입(가게 진열대: 오렌지주스는 색깔 있는 주스 칸, 종류별로 나누면
찾기 쉽고 정돈), 관찰(식초·레몬즙·빨랫비누 물·석회수·묽은 염산·묽은 수산화 나트륨 용액: 흰 종이로 색깔, 글씨 쓴 종이로 투명한 정도,
흔들어 5초 거품, 냄새는 손으로 바람 — 묽은 염산은 냄새를 맡지 않음; 앱 스크립트의 관찰값), 분류 기준(객관적이고 명확한 질문 — 예쁜가·좋은 냄새·인기는
알맞지 않음), 두 기준으로 분류한 결과(앱 정리 화면), 겉보기 성질로 분류할 때 어려운 점, 생각 바로잡기(색깔이 있으면서 투명한 식초),
한눈에 쏙(분류, 분류하는 차례).
최종: ./make_final.sh s6ep01
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Wiggle, Rectangle,
                   RoundedRectangle, SurroundingRectangle, Transform)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def sol_card(sol, w=2.0, h=1.0, size=24, col=INK):
    box = RoundedRectangle(corner_radius=0.14, width=w, height=h, fill_color=PAPER, fill_opacity=1, stroke_color=col,
                           stroke_width=4)
    t = K.name_text(sol["sh"], size, col)
    if t.width > w - 0.2:
        t.scale_to_fit_width(w - 0.2)
    t.move_to(box)
    return VGroup(box, t)


class S6Ep01(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 1
    EP_TITLE = "여러 가지 용액을 분류해 볼까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.criteria()
        self.sort()
        self.hard()
        self.misc()
        self.summary()
        self.closing(f"용액의 성질을 관찰하고 {o('분류 기준')}을 세워\n그 기준에 따라 용액을 {g('분류')}해요",
                     next_preview="6학년 2화 · 지시약으로 분류하기")
        self.wait(0.5)

    # ── 궁금해요: 가게 진열대 ──
    def intro(self):
        self.section("궁금해요")
        shelf = K.shop_shelf(8.0).scale(0.8).move_to([-1.6, 0.3, 0])
        oj = K.orange_juice(0.85).move_to([4.9, 0.3, 0])
        ojt = T("오렌지주스", 30).next_to(oj, DOWN, buff=0.2)
        self.say("오렌지주스는 어느 칸에 진열해야 할까요?",
                 "가게에는 여러 가지 용액이 종류별로 진열되어 있어요. 오렌지주스는 어느 칸에 놓을까요?")
        self.play(FadeIn(shelf), FadeIn(oj), FadeIn(ojt), run_time=0.8)
        self.settle()
        top = shelf.slot_top
        self.play(oj.animate.scale(0.94).move_to(K.np.array([-1.6, 0.3, 0]) + top * 0.8),
                  FadeOut(ojt), run_time=1.0)
        self.say(f"색깔 있는 주스의 {o('윗줄')} — 비슷한 것끼리 모으면 {g('찾기 쉬워요')}",
                 "색깔이 있는 주스들이 놓인 윗줄이에요. 비슷한 것끼리 나누어 두면 필요한 것을 찾기 쉽고 정돈되어 보기 좋아요.")
        self.play(Indicate(oj, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 관찰해요 ──
    def observe(self):
        self.section("관찰해요")
        xs = [-5.4 + 2.16 * i for i in range(6)]
        bots = VGroup(*[K.dropper_bottle(s_, 1.0, size=24).move_to([x, 0.35, 0]) for s_, x in zip(K.SOL, xs)])
        for b_, x in zip(bots, xs):
            b_.shift([x, 0.55, 0] - b_[1].get_center())
            b_.label.set_y(-0.75)
        safe = K.safety_note("실험복·보안경·실험용 장갑 · 맛보거나 냄새를 함부로 맡지 않기", w=11.2, size=28).move_to([0.4, 2.45, 0])
        self.say("여섯 가지 용액을 관찰해요",
                 "실험복, 보안경, 실험용 장갑을 착용하고 여섯 가지 용액을 관찰해요.")
        self.play(FadeIn(bots, lag_ratio=0.1), FadeIn(safe), run_time=1.2)
        self.settle()
        self.play(FadeOut(safe), run_time=0.3)
        # ① 흰 종이 → 색깔
        papers = VGroup(*[Rectangle(width=1.3, height=1.9, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT,
                                    stroke_width=2).move_to([x, 0.5, 0]) for x in xs])
        tool1 = K.label("① 흰 종이 대기 → 색깔", INK, 30).move_to([0, 2.5, 0])
        self.say(f"흰 종이를 뒤에 대고 {o('색깔')}을 봐요",
                 "흰 종이를 용액의 바닥과 뒤에 대고 색깔을 봐요.")
        self.play(FadeIn(papers), FadeIn(tool1), run_time=0.6)
        self.bring_to_front(bots)
        self.settle()
        # ② 글씨 → 투명한 정도
        letters = VGroup(*[T("가", 52, INK).move_to([x, 0.4, 0]) for x in xs])
        tool2 = K.label("② 글씨 쓴 종이 대기 → 투명한 정도", INK, 30).move_to([0, 2.5, 0])
        self.say(f"글씨 쓴 종이를 대면 {o('투명한 정도')}를 알 수 있어요",
                 "글씨 쓴 종이를 뒤에 대어 글씨가 잘 보이면 투명하고, 잘 보이지 않으면 불투명해요.")
        self.play(FadeOut(tool1), FadeIn(tool2), FadeIn(letters), run_time=0.6)
        self.bring_to_front(bots)
        self.settle()
        # ③ 흔들기 → 거품
        tool3 = K.label("③ 흔들기 → 5초 이상 거품이 유지되는가?", INK, 30).move_to([0, 2.5, 0])
        self.say(f"흔든 뒤 {o('5초 이상 거품')}이 남는지 봐요",
                 "흔든 뒤 거품이 5초 이상 남는지 봐요. 냄새는 손으로 바람을 일으켜 맡고, 묽은 염산은 맡지 않아요.")
        self.play(FadeOut(tool2), FadeIn(tool3), FadeOut(papers), FadeOut(letters), run_time=0.5)
        self.play(*[Wiggle(b_[:4], scale_value=1.04, rotation_angle=0.08) for b_ in bots], run_time=1.0)
        foams = VGroup(*[K.bubbles(x - 0.33, x + 0.33, 0.98, 1.12, n=7, seed=i + 1, rmin=0.05, rmax=0.09)
                         for i, x in enumerate(xs)])
        self.play(FadeIn(foams), run_time=0.4)
        self.wait(0.6)
        self.play(*[FadeOut(f) for i, f in enumerate(foams) if not K.SOL[i]["foam"]], run_time=0.6)
        self.settle()
        self.pause_screen(5, "비슷한 점과 다른 점은 무엇일까요?")
        clear_stage(self)
        # 결과 표
        S_ = K.SOL
        head = [""] + [s_["sh"].replace("묽은 수산화\n나트륨 용액", "수산화 나트륨") for s_ in S_]
        rows = [["색깔"] + [s_["col"] for s_ in S_],
                ["투명한 정도"] + [("투명하다" if s_["tr"] else r("불투명하다")) for s_ in S_],
                ["5초 이상 거품"] + [(o("유지됨") if s_["foam"] else "곧 사라짐") for s_ in S_]]
        tab = K.result_table(head, rows, [2.4] + [1.8] * 6, row_h=0.85, size=25).move_to([0, 0.35, 0])
        self.say(f"식초는 노란색, 레몬즙은 연한 노란색, 빨랫비누 물은 흰색",
                 "식초는 노란색, 레몬즙은 연한 노란색, 빨랫비누 물은 흰색이고, 나머지 셋은 색깔이 없어요.")
        self.play(FadeIn(tab), run_time=0.8)
        self.play(Indicate(VGroup(*tab.cells[1][1:]), color=ORANGE, scale_factor=1.05), run_time=1.0)
        self.say(f"레몬즙·빨랫비누 물은 {r('불투명')}, 거품은 {o('빨랫비누 물')}만 남아요",
                 "레몬즙과 빨랫비누 물은 불투명하고, 흔든 뒤 거품이 남는 것은 빨랫비누 물뿐이에요.")
        self.play(Indicate(VGroup(tab.cells[2][2], tab.cells[2][3]), color=RED),
                  Indicate(tab.cells[3][3], color=ORANGE), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 분류 기준 ──
    def criteria(self):
        self.section("분류 기준")
        items = [("색깔이 있는가?", True), ("용액이 예쁜가?", False), ("투명한가?", True),
                 ("좋은 냄새가 나는가?", False), ("흔든 뒤 5초 이상 거품이 유지되는가?", True),
                 ("사람들이 많이 쓰는 인기 있는 용액인가?", False)]
        cards = VGroup()
        for t_, _ in items:
            bx = RoundedRectangle(corner_radius=0.14, width=6.3, height=0.95, fill_color=PAPER, fill_opacity=1,
                                  stroke_color=INK, stroke_width=4)
            tt = T(t_, 30)
            if tt.width > 5.2:
                tt.scale_to_fit_width(5.2)
            tt.move_to(bx).shift(RIGHT * 0.35)
            cards.add(VGroup(bx, tt))
        cards.arrange_in_grid(rows=3, cols=2, buff=(0.3, 0.3)).move_to([0, 0.4, 0])
        self.say("용액을 분류할 기준을 정해요", "비슷한 점과 다른 점을 떠올려 분류 기준을 정해요. 알맞은 기준은 무엇일까요?")
        self.play(FadeIn(cards, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(5, "알맞은 분류 기준을 모두 골라요")
        marks = VGroup()
        for c, (_, ok) in zip(cards, items):
            m = K.ox_mark(ok, 0.26).move_to(c.get_left() + RIGHT * 0.42)
            marks.add(m)
        good = [c for c, (_, ok) in zip(cards, items) if ok]
        bad = [c for c, (_, ok) in zip(cards, items) if not ok]
        self.say(f"관찰한 결과로 {g('그렇다·그렇지 않다')}가 분명히 나뉘는 기준",
                 "이 세 가지는 관찰한 결과로 그렇다와 그렇지 않다가 분명히 나뉘는 기준이에요.")
        self.play(*[FadeIn(marks[i]) for i, (_, ok) in enumerate(items) if ok],
                  *[c[0].animate.set_stroke(GREEN, 6) for c in good], run_time=0.8)
        self.say(f"예쁘다·좋은 냄새는 {r('사람마다 달라서')} 알맞지 않아요",
                 "예쁘다나 좋은 냄새는 사람마다 느낌이 다르고, 인기 있다는 관찰한 성질이 아니에요.")
        self.play(*[FadeIn(marks[i]) for i, (_, ok) in enumerate(items) if not ok],
                  *[c.animate.set_opacity(0.45) for c in bad], run_time=0.8)
        self.say(f"분류 기준은 {o('객관적이고 명확한 질문')}으로 세워요",
                 "분류 기준은 누가 보아도 같은 답이 나오는 객관적이고 명확한 질문으로 세워요.")
        self.settle()
        clear_stage(self)

    # ── 분류해요 ──
    def sort_one(self, crit, flags):
        q = M(f"분류 기준: {o(crit)}", 40).move_to([0, 2.5, 0])
        cards = VGroup(*[sol_card(s_, 2.0, 0.95, 24) for s_ in K.SOL]).arrange(RIGHT, buff=0.15).move_to([0, 1.45, 0])
        bins = VGroup(K.bin_box("그렇다", 6.5, 2.75, GREEN, 32), K.bin_box("그렇지 않다", 6.5, 2.75, RED, 32))
        bins.arrange(RIGHT, buff=0.2).move_to([0, -0.9, 0])
        self.play(FadeIn(q), FadeIn(cards, lag_ratio=0.06), FadeIn(bins), run_time=0.9)
        mv = []
        for side, bx in ((True, bins[0]), (False, bins[1])):
            grp = [c for c, f in zip(cards, flags) if f == side]
            c0 = bx.box.get_center()
            for k, c in enumerate(grp):
                col, row = k % 2, k // 2
                mv.append(c.animate.move_to(c0 + [-1.45 if col == 0 else 1.45, 0.22 - 1.02 * row, 0]))
        return q, cards, bins, mv

    def sort(self):
        self.section("분류해요")
        q, cards, bins, mv = self.sort_one("색깔이 있는가?", [True, True, True, False, False, False])
        self.say(f"색깔이 있는 것: 식초·레몬즙·빨랫비누 물",
                 "기준에 따라 분류해요. 색깔이 있는 것은 식초, 레몬즙, 빨랫비누 물이고, 나머지 셋은 색깔이 없어요.")
        self.play(*mv, run_time=1.4)
        self.settle()
        clear_stage(self)
        q, cards, bins, mv = self.sort_one("투명한가?", [True, False, False, True, True, True])
        self.say(f"기준이 달라지면 {o('분류 결과도 달라질 수 있어요')}",
                 "투명한가로 나누면 레몬즙과 빨랫비누 물만 따로 나뉘어요. 분류 기준이 달라지면 분류 결과도 달라질 수 있어요.")
        self.play(*mv, run_time=1.4)
        self.play(Indicate(q, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 어려운 점 ──
    def hard(self):
        self.section("생각해요")
        names = [K.SOL[3], K.SOL[4], K.SOL[5]]
        bots = VGroup(*[K.dropper_bottle(s_, 1.25, size=28) for s_ in names]).arrange(RIGHT, buff=1.6).move_to([0, 0.45, 0])
        qs = VGroup(*[T("?", 60, SOFT).move_to(b_[0]) for b_ in bots])
        self.say("겉보기 성질로만 분류할 때 어려운 점은?", "용액을 겉보기 성질로만 분류할 때 어려운 점은 무엇일까요?")
        self.play(FadeIn(bots, lag_ratio=0.15), run_time=0.9)
        self.play(FadeIn(qs), run_time=0.5)
        self.say(f"색깔이 없고 투명해서 {r('쉽게 구분되지 않아요')}",
                 "석회수, 묽은 염산, 묽은 수산화 나트륨 용액은 모두 색깔이 없고 투명해서 겉보기로는 쉽게 구분되지 않아요.")
        self.play(Wiggle(qs), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        q = T("투명한 용액은 모두 색깔이 없을까요?", 46).move_to([0.6, 2.15, 0])
        self.say("투명한 용액은 모두 색깔이 없을까요?", "투명한 용액은 모두 색깔이 없을까요?")
        self.play(FadeIn(q), run_time=0.5)
        paper = Rectangle(width=2.2, height=2.6, fill_color=PAPER, fill_opacity=1, stroke_color=SOFT, stroke_width=2).move_to([-2.2, -0.45, 0])
        let = T("가", 70, INK).move_to([-2.2, -0.65, 0])
        bot = K.dropper_bottle(K.SOL[0], 1.55, size=32).move_to([-2.2, -0.4, 0])
        bot.label.next_to(paper, LEFT, buff=0.25)
        self.play(FadeIn(paper), FadeIn(let), FadeIn(bot), run_time=0.7)
        card = K.text_card([f"식초: {o('노란색')}인데도", f"뒤의 글씨가 잘 보여요 → {g('투명')}"], w=6.0, size=34).move_to([2.9, -0.4, 0])
        self.say(f"아니요, 식초처럼 {o('색깔이 있으면서')} {g('투명한')} 용액도 있어요",
                 "아니요. 식초는 노란색인데도 뒤의 글씨가 잘 보였어요. 투명하다는 것은 색깔이 없다는 것과 달라요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        steps = ["① 용액의 성질을\n관찰해요", "② 비슷한 점과 다른 점을\n찾아 분류 기준을 세워요", "③ 분류 기준에 따라\n용액을 분류해요"]
        boxes = VGroup()
        for i, s_ in enumerate(steps):
            b_ = RoundedRectangle(corner_radius=0.2, width=4.1, height=1.6, fill_color=PAPER, fill_opacity=1,
                                  stroke_color=self.accent, stroke_width=5)
            t = K.name_text(s_, 30)
            if t.width > 3.8:
                t.scale_to_fit_width(3.8)
            t.move_to(b_)
            boxes.add(VGroup(b_, t))
        boxes.arrange(RIGHT, buff=0.45).move_to([0, 1.3, 0])
        arrs = VGroup(*[K.arrow_right(boxes[i].get_right()[0] + 0.08, boxes[i + 1].get_left()[0] - 0.08, 1.3, self.accent)
                        for i in range(2)])
        self.say("용액을 분류하는 차례", "성질을 관찰하고, 비슷한 점과 다른 점으로 분류 기준을 세운 뒤, 기준에 따라 분류해요.")
        self.play(FadeIn(boxes[0]), run_time=0.5)
        for i in range(2):
            self.play(Create(arrs[i]), FadeIn(boxes[i + 1]), run_time=0.6)
        card = K.text_card([f"식초, 석회수, 레몬즙, 묽은 염산은 색깔이 있는 것과",
                            f"없는 것으로 {o('분류')}할 수 있습니다."], w=12.4, size=34).move_to([0, -1.25, 0])
        self.say(f"색깔이 있는 것과 없는 것으로 {o('분류')}할 수 있어요")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
