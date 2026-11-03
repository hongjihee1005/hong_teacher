"""「과학 원리 돋보기」 6학년 21화 — 지구의 자전 (6-1 4단원 지구의 운동 4차시, 화 코드 6-1-4-b)

바탕: grade6/science/sem1/u4-2.html(원본 _build_tb/src/u4-2.html) — 도입(팽이는 가운데 축을 중심으로 돌아요, 제자리에서 회전하는
발레리나·놀이 기구, 자전의 뜻), 역할놀이 준비(지구 역할 왼손 '동'·오른손 '서', 전등과 별 역할 사이에 서기, 안전),
역할놀이(서쪽에서 동쪽 = 시계 반대 방향으로 45°씩 한 바퀴: 전등·별 역할이 동쪽에서 남쪽을 지나 서쪽으로), 결과 정리,
지구의 자전 영상(자전축은 북극과 남극을 이은 가상의 직선·기울어짐, 하루에 한 바퀴, 서→동, 북극 위에서 보면 시계 반대 방향),
낱말 잇기·바르게 말한 친구(방위로 말하기), 생각이 한눈에(동→서로 자전한다면 태양과 별은 서→동), 한눈에 쏙, 형성 평가 ○×.
최종: ./make_final.sh s6ep21
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, Rotate, ValueTracker,
                   Rectangle, RoundedRectangle, Line, Dot, Circle, always_redraw, linear, Transform)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def nrm(a):
    a = (a + PI) % (2 * PI) - PI
    return a


class RolePlay:
    """역할놀이 화면: 왼쪽 위에서 본 모습(전등 위·별 아래·지구 역할 가운데), 오른쪽 지구 역할의 눈에 보이는 모습.
    th = 바라보는 쪽(위쪽에서 시계 반대 방향 라디안). 처음 -PI/2(전등이 왼손 = 동쪽)."""

    def __init__(self, scene, th0=-PI / 2, cw=False):
        self.s = scene
        self.th = ValueTracker(th0)
        self.cw = cw
        c = np.array([-3.4, 0.25, 0])
        self.c = c
        floor = RoundedRectangle(corner_radius=0.2, width=5.4, height=5.0, fill_color="#F7F3EA", fill_opacity=1,
                                 stroke_color=SOFT, stroke_width=3).move_to(c)
        lp = K.lamp(0.9).move_to(c + UP * 1.85)
        st = K.star_role(0.8).move_to(c + DOWN * 1.75)
        arrow = K.curved_arrow(1.45, -2.4, -0.75, "#1C6FA8", 5, center=c, cw=cw)
        tag = K.label("↺ 시계 반대 방향" if not cw else "↻ 시계 방향", "#1C6FA8", 22).move_to(c + np.array([-1.35, -2.15, 0]))
        self.top = VGroup(floor, lp, st, arrow, tag)
        self.person = always_redraw(lambda: K.person_top(self.th.get_value(), 0.85).move_to(c))
        v = np.array([3.3, 0.25, 0])
        self.v = v
        W, H = 6.2, 3.4
        self.W = W
        sky = Rectangle(width=W, height=H, fill_color="#DFF1FB", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(v + UP * 0.35)
        flo = Rectangle(width=W, height=0.85, fill_color="#D9C7AD", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(v + DOWN * 1.78)
        labs = VGroup()
        for x, n in ((-W / 2 + 0.5, "동"), (0, "남"), (W / 2 - 0.5, "서")):
            bx = RoundedRectangle(corner_radius=0.08, width=0.6, height=0.5, fill_color=PAPER, fill_opacity=1,
                                  stroke_color=K.NAVY, stroke_width=3).move_to(v + np.array([x, -1.78, 0]))
            labs.add(VGroup(bx, T(n, 28).move_to(bx)))
        cap = T("지구 역할의 눈에 보이는 모습", 24, K.NAVY).move_to(v + UP * 2.35)
        hands = VGroup(T("왼손 쪽", 20, "#7A2A1F").move_to(v + np.array([-W / 2 + 0.55, -1.15, 0])),
                       T("오른손 쪽", 20, "#7A2A1F").move_to(v + np.array([W / 2 - 0.65, -1.15, 0])))
        self.view_bg = VGroup(sky, flo, labs, cap, hands)
        self.view = always_redraw(self._view)
        self.trail = VGroup()

    def _xs(self):
        th = self.th.get_value()
        out = []
        for d, kind in ((0.0, "L"), (PI, "S")):
            rel = nrm(d - th)            # +면 왼쪽(동)
            if abs(rel) <= PI / 2 + 1e-6:
                out.append((kind, self.v[0] - rel / (PI / 2) * (self.W / 2 - 0.5)))
        return out

    def _view(self):
        g_ = VGroup()
        for kind, x in self._xs():
            m = K.lamp(0.75) if kind == "L" else K.star_role(0.7)
            g_.add(m.move_to([x, self.v[1] + 0.45, 0]))
        return g_

    def mark(self):
        for kind, x in self._xs():
            self.trail.add(Dot([x, self.v[1] + 0.45, 0], radius=0.09, color="#F0A020" if kind == "L" else "#1C6FA8").set_opacity(0.5))

    def show(self):
        self.s.play(FadeIn(self.top), FadeIn(self.view_bg), run_time=0.8)
        self.s.add(self.trail, self.person, self.view)
        self.mark()

    def step(self, deg=45, rt=0.55):
        d = -deg if self.cw else deg
        self.s.play(self.th.animate.increment_value(d * PI / 180), run_time=rt, rate_func=linear)
        self.mark()

    def remove(self):
        self.person.clear_updaters()
        self.view.clear_updaters()


class S6Ep21(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 21
    EP_TITLE = "지구의 자전"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.prepare()
        self.role()
        self.result()
        self.movie()
        self.words()
        self.reverse()
        self.summary()
        self.check()
        self.closing(f"지구는 {o('자전축')}을 중심으로 하루에 한 바퀴씩\n{g('서쪽에서 동쪽으로')} 자전해요",
                     next_preview="6학년 22화 · 낮과 밤이 생기는 까닭")
        self.wait(0.5)

    # ── 궁금해요: 팽이 ──
    def intro(self):
        self.section("궁금해요")
        top = K.spinning_top(1.5).move_to([-3.2, 0.3, 0])
        axis = Line([-3.2, -1.3, 0], [-3.2, 2.1, 0], stroke_color=RED, stroke_width=5)
        self.say("팽이는 무엇을 중심으로 돌고 있나요?")
        self.play(FadeIn(top), run_time=0.6)
        self.play(Rotate(top[4:], angle=2 * PI, axis=UP, about_point=top[1].get_center()), run_time=1.4)
        self.say(f"팽이는 {o('가운데 축')}을 중심으로 제자리에서 돌아요",
                 "팽이는 가운데 축을 중심으로 제자리에서 돌아요.")
        self.play(Create(axis), run_time=0.6)
        items = [("제자리에서 회전하는 발레리나", True), ("제자리에서 회전하는 놀이 기구", True), ("미끄럼틀을 타는 친구", False)]
        cards = VGroup(*[K.word_card(t_, 6.0, 0.9, size=30) for t_, _ in items]).arrange(DOWN, buff=0.3).move_to([2.9, 0.7, 0])
        self.say("팽이처럼 제자리에서 회전하는 것은?", "팽이처럼 제자리에서 회전하는 것을 모두 골라 볼까요?")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.8)
        self.settle()
        marks = VGroup(*[K.ox_mark(ok, 0.22).next_to(c, LEFT, buff=0.2) for c, (_, ok) in zip(cards, items)])
        self.say(f"발레리나·놀이 기구 {g('○')}, 미끄럼틀은 {r('×')}",
                 "발레리나와 놀이 기구는 제자리에서 회전해요. 미끄럼틀은 위에서 아래로 미끄러져 내려와요.")
        self.play(FadeIn(marks), cards[2].animate.set_opacity(0.45), run_time=0.7)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"천체가 스스로 고정된 축을 중심으로", f"회전하는 것 = {o('자전')}"], w=10.4, size=46).move_to([0, 0.6, 0])
        self.say(f"천체가 스스로 고정된 축을 중심으로 회전 = {o('자전')}",
                 "천체가 스스로 고정된 축을 중심으로 회전하는 것을 자전이라고 해요. 지구도 자전해요. 역할놀이로 알아봐요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 역할놀이 준비 ──
    def prepare(self):
        self.section("실험 준비")
        c = np.array([-3.3, 0.25, 0])
        floor = RoundedRectangle(corner_radius=0.2, width=5.0, height=4.9, fill_color="#F7F3EA", fill_opacity=1,
                                 stroke_color=SOFT, stroke_width=3).move_to(c)
        lp = K.lamp(0.9).move_to(c + UP * 1.8)
        st = K.star_role(0.8).move_to(c + DOWN * 1.75)
        kid = K.person_top(0.0, 0.85, tags=("?", "서")).move_to(c + DOWN * 0.05)
        self.say("붙임쪽지에 '지구', '별', '동', '서'를 쓰고 역할을 정해요",
                 "붙임쪽지를 쓰고 역할을 정해요. 전등은 태양 역할이에요.")
        self.play(FadeIn(floor), FadeIn(lp), FadeIn(st), FadeIn(kid), run_time=0.8)
        q = K.text_card([f"① 지구 역할은 {o('전등과 별 역할 사이')}에 서요", f"② 남쪽을 바라보면 {o('왼손')}에 붙일 쪽지는?"],
                        w=7.0, size=32).move_to([3.3, 1.2, 0])
        self.say(f"지구 역할의 {o('왼손')}에 붙일 쪽지는 무엇일까요?",
                 "지구 역할은 전등과 별 역할 사이에 서요. 왼손에는 어떤 쪽지를 붙일까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.settle()
        kid2 = K.person_top(0.0, 0.85, tags=("동", "서")).move_to(c + DOWN * 0.05)
        self.say(f"왼손에 {o('동')}, 오른손에 {o('서')}", "남쪽을 바라보면 왼쪽이 동쪽이니까 왼손에 동, 오른손에 서를 붙여요.")
        self.play(Transform(kid, kid2), run_time=0.6)
        self.play(Indicate(kid[1], color=ORANGE, scale_factor=1.4), run_time=0.7)
        safe = K.safety_note("불이 켜진 전등을 오래 보거나 맨손으로 만지지 않아요", w=7.0, size=26).move_to([3.3, -1.2, 0])
        self.play(FadeIn(safe), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 역할놀이 ──
    def role(self):
        self.section("역할놀이")
        rp = RolePlay(self)
        self.say(f"제자리에서 {o('서쪽에서 동쪽')}(시계 반대 방향)으로 천천히 돌아요",
                 "지구 역할은 제자리에서 서쪽에서 동쪽으로, 시계 반대 방향으로 천천히 돌아요.")
        rp.show()
        self.settle()
        self.say(f"처음에는 전등이 {o('왼손(동)')} 쪽에 보여요",
                 "처음에는 전등이 왼손 쪽, 곧 동쪽에 보여요.")
        self.wait(0.6)
        for i in range(4):
            rp.step()
            self.wait(0.2)
        self.say("계속 돌면 별 역할이 보이기 시작해요", "계속 돌면 별 역할이 보여요.")
        for i in range(4):
            rp.step()
            self.wait(0.2)
        self.settle()
        self.pause_screen(5, "전등과 별은 어느 쪽에서 어느 쪽으로?")
        self.say(f"전등과 별 모두 {o('동쪽')} → 남쪽 → {o('서쪽')}으로 달라졌어요",
                 "전등과 별은 모두 동쪽에서 남쪽을 지나 서쪽으로 위치가 달라졌어요.")
        self.play(Indicate(rp.trail, color=ORANGE, scale_factor=1.3), run_time=1.0)
        self.settle()
        rp.remove()
        clear_stage(self)

    # ── 결과 정리 ──
    def result(self):
        self.section("결과 정리")
        rows = [["지구 역할이 회전하는 방향", f"{g('서쪽 → 동쪽')}"], ["전등의 위치 변화", f"{o('동쪽 → 서쪽')}"],
                ["별 역할의 위치 변화", f"{o('동쪽 → 서쪽')}"]]
        tab = K.result_table(["", "관찰한 것"], rows, [5.6, 4.0], row_h=0.8, size=32).move_to([0.6, 1.15, 0])
        self.say(f"지구 역할은 {g('서→동')}, 전등과 별은 {o('동→서')}",
                 "지구 역할은 서쪽에서 동쪽으로 돌고, 전등과 별은 동쪽에서 서쪽으로 달라졌어요.")
        self.play(FadeIn(tab), run_time=0.7)
        card = K.text_card([f"지구가 {g('서쪽에서 동쪽으로 자전')}하기 때문에", f"태양과 별은 {o('동쪽에서 서쪽으로')} 위치가 달라져요"],
                           w=11.6, size=36).move_to([0, -1.5, 0])
        self.say(f"지구가 자전하기 때문이지, 태양과 별이 {r('스스로')} 움직여서가 아니에요",
                 "지구가 서쪽에서 동쪽으로 자전하기 때문에 태양과 별이 동쪽에서 서쪽으로 위치가 달라져요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 지구의 자전(영상) ──
    def movie(self):
        self.section("지구의 자전")
        rot = ValueTracker(0.0)
        c = np.array([-3.3, 0.15, 0])
        earth = always_redraw(lambda: K.earth_side(1.55, rot.get_value(), korea=True).move_to(c))
        ax_lab = K.label("자전축(기울어져 있어요)", "#B8860B", 24).move_to(c + np.array([2.9, 1.9, 0]))
        self.add(earth)
        self.say(f"북극과 남극을 이은 가상의 직선 = {o('자전축')}",
                 "지구의 북극과 남극을 이은 가상의 직선을 자전축이라고 해요. 지구의 자전축은 기울어져 있어요.")
        self.play(FadeIn(ax_lab), run_time=0.5)
        self.settle()
        day = K.text_card([f"자전축을 중심으로", f"{o('하루에 한 바퀴')}", f"{g('서쪽 → 동쪽')}으로 회전"], w=5.4, size=36).move_to([3.4, 0.5, 0])
        self.say(f"지구는 {o('하루에 한 바퀴')}씩 {g('서쪽에서 동쪽')}으로 회전해요",
                 "지구는 자전축을 중심으로 하루에 한 바퀴씩 서쪽에서 동쪽으로 회전해요.")
        self.play(FadeOut(ax_lab), FadeIn(day), rot.animate.set_value(2 * PI), run_time=4.0, rate_func=linear)
        self.settle()
        self.play(FadeOut(day), run_time=0.3)
        phi = ValueTracker(0.6)
        pc = np.array([3.5, 0.15, 0])
        pole = always_redraw(lambda: K.globe_top(1.5, phi=phi.get_value(), sun_dir=PI / 2, show_obs=True).move_to(pc))
        arr = K.curved_arrow(1.85, -0.3, 1.2, GREEN, 6, center=pc)
        cap = T("북극 위에서 내려다본 지구", 26, K.NAVY).move_to(pc + UP * 2.5)
        self.add(pole)
        self.say(f"북극 위에서 내려다보면 {o('시계 반대 방향')}으로 돌아요",
                 "북극 위에서 내려다보면 지구는 시계 반대 방향으로 자전해요.")
        self.play(FadeIn(cap), Create(arr), phi.animate.set_value(0.6 + 2 * PI), rot.animate.set_value(4 * PI),
                  run_time=4.0, rate_func=linear)
        self.settle()
        earth.clear_updaters()
        pole.clear_updaters()
        clear_stage(self)

    # ── 정리해요 ──
    def words(self):
        self.section("정리해요")
        pairs = [("자전축", "지구의 북극과 남극을 이은 가상의 직선"),
                 ("지구의 자전", "자전축을 중심으로 하루에 한 바퀴씩 서→동으로 회전"),
                 ("북극 위에서 본 자전 방향", "시계 반대 방향")]
        rows = VGroup()
        for a, b in pairs:
            ra = K.word_card(a, 4.0, 0.85, size=28, col=self.accent)
            rb = K.word_card(b, 7.6, 0.85, size=26)
            rows.add(VGroup(ra, rb).arrange(RIGHT, buff=0.5))
        rows.arrange(DOWN, buff=0.28).move_to([0, 1.25, 0])
        self.say("낱말과 뜻을 이어요")
        self.play(FadeIn(rows, lag_ratio=0.2), run_time=1.0)
        self.settle()
        f1 = K.word_card("“지구는 왼쪽에서 오른쪽으로 자전해.”", 6.2, 0.85, size=26)
        f2 = K.word_card("“지구는 서쪽에서 동쪽으로 자전해.”", 6.2, 0.85, size=26)
        fr = VGroup(f1, f2).arrange(RIGHT, buff=0.3).move_to([0, -1.55, 0])
        self.say("자전 방향을 바르게 말한 친구는?")
        self.play(FadeIn(fr), run_time=0.6)
        self.settle()
        self.say(f"{g('방위')}로 말해요 — 왼쪽·오른쪽은 {r('바라보는 방향에 따라 달라져요')}",
                 "왼쪽과 오른쪽은 바라보는 방향에 따라 달라지니 방위로 말해야 해요.")
        self.play(f2[0].animate.set_stroke(GREEN, 6), f1.animate.set_opacity(0.4),
                  FadeIn(K.ox_mark(True, 0.25).next_to(f2, UP, buff=0.1)),
                  FadeIn(K.ox_mark(False, 0.2).next_to(f1, UP, buff=0.12)), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 생각해요: 반대로 자전한다면? ──
    def reverse(self):
        self.section("생각해요")
        self.say("만약 지구가 동쪽에서 서쪽으로 자전한다면?",
                 "만약 지구가 동쪽에서 서쪽으로 자전한다면? 반대로 돌아 봐요.")
        rp = RolePlay(self, cw=True)
        rp.show()
        for i in range(8):
            rp.step(45, 0.4)
        self.settle()
        self.say(f"태양과 별은 {o('서쪽에서 동쪽으로')} 위치가 달라질 거예요",
                 "이번에는 별과 전등이 서쪽에서 나타나 동쪽으로 가요. 태양과 별은 서쪽에서 동쪽으로 달라질 거예요.")
        self.play(Indicate(rp.trail, color=ORANGE, scale_factor=1.3), run_time=1.0)
        self.settle()
        rp.remove()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["지구가 자전축을 중심으로 하루에 한 바퀴씩", f"서쪽에서 동쪽으로 회전하는 것을", f"지구의 {o('자전')}이라고 합니다."],
                           w=12.0, size=42).move_to([0, 0.5, 0])
        self.say(f"지구의 {o('자전')}", "지구가 자전축을 중심으로 하루에 한 바퀴씩 서쪽에서 동쪽으로 회전하는 것을 지구의 자전이라고 합니다.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인해요 ──
    def check(self):
        self.section("확인해요")
        items = [("⑴ 지구의 자전 방향은 동쪽에서 서쪽이다.", False), ("⑵ 지구는 자전축을 중심으로 하루에 한 바퀴씩 회전한다.", True),
                 ("⑶ 지구의 북극과 남극을 이은 가상의 직선을 자전축이라고 한다.", True)]
        cards = VGroup()
        for t_, _ in items:
            cards.add(K.word_card(t_, 11.4, 0.95, size=30))
        cards.arrange(DOWN, buff=0.3).move_to([0.5, 0.9, 0])
        self.say("옳으면 ○, 옳지 않으면 ×", "옳으면 동그라미, 옳지 않으면 가위표를 골라요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.8)
        self.pause_screen(5, "○일까요, ×일까요?")
        marks = VGroup(*[K.ox_mark(ok, 0.28).next_to(c_, LEFT, buff=0.25) for c_, (_, ok) in zip(cards, items)])
        self.say(f"⑴ {r('×')} — 지구는 {g('서쪽에서 동쪽')}으로 자전해요, ⑵·⑶ {g('○')}",
                 "첫째는 틀렸어요. 지구는 서쪽에서 동쪽으로 자전해요. 둘째와 셋째는 옳아요.")
        self.play(FadeIn(marks, lag_ratio=0.2), run_time=0.8)
        self.settle()
        clear_stage(self)
