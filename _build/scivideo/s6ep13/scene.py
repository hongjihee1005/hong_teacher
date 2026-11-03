"""「과학 원리 돋보기」 6학년 13화 — 세포가 궁금해! (6-1 3단원 식물의 구조와 기능 2차시, 화 코드 6-1-3-a)

바탕: grade6/science/sem1/u3-1.html(원본 _build_tb/src/u3-1.html) — 도입(첨성대는 작은 돌을 쌓아 만듦 → 생물은 세포라는 기본 단위,
세포는 작아 현미경으로 관찰), 광학 현미경의 구조와 하는 일·사용 차례(낮은 배율부터, 옆에서 보면서 재물대 올리기),
사철나무잎 표피세포 현미경표본 만들기(투명 매니큐어 → 마르기 → 셀로판테이프 → 받침 유리), 가상 현미경 관찰(양파: 각진 세포·둥근 핵,
사철나무잎: 핵을 염색하지 않아 잘 안 보임·강낭콩 모양 세포 두 개, 배율 = 접안 × 대물), 세포 구조(세포벽·세포막·핵),
더 알아보기(세포 크기·모양 다양, 달걀·타조알은 하나의 세포), 한눈에 쏙.
(EPISODES.md의 '동물 세포 비교'는 앱에 없어 넣지 않음)
최종: ./make_final.sh s6ep13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Wiggle, Circumscribe, GrowFromCenter,
                   Rectangle, RoundedRectangle, Transform, Ellipse)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S6Ep13(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 13
    EP_TITLE = "세포가 궁금해!"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.scope()
        self.slide()
        self.observe()
        self.structure()
        self.misc()
        self.summary()
        self.closing(f"생물은 모양과 크기가 다양한 {o('세포')}로 이루어져 있고,\n식물 세포에는 {g('세포벽')}·세포막·핵이 있어요",
                     next_preview="6학년 14화 · 뿌리의 생김새와 하는 일")
        self.wait(0.5)

    # ── 궁금해요: 첨성대 ──
    def intro(self):
        self.section("궁금해요")
        tw = K.tower(3.6).move_to([-3.2, 0.2, 0])
        self.say("첨성대는 어떻게 만들어졌을까요?", "첨성대는 어떻게 만들어졌을까요?")
        self.play(FadeIn(tw, shift=UP * 0.2), run_time=0.9)
        self.settle()
        zoom = VGroup(*[Rectangle(width=0.62, height=0.4, fill_color="#DCCBA8" if (i + j) % 2 else "#CDB98F", fill_opacity=1,
                                  stroke_color="#8A7656", stroke_width=3).move_to([j * 0.62 + (0.31 if i % 2 else 0), i * 0.4, 0])
                        for i in range(4) for j in range(4)]).move_to([2.6, 0.6, 0])
        ring = K.C(1.55, PAPER, 2.6, 0.6).set_fill(opacity=0).set_stroke("#2F7D4A", 6)
        cap = K.label("가까이에서 본 돌", "#2F7D4A", 28).next_to(ring, DOWN, buff=0.2)
        self.say(f"{o('작은 돌')}을 여러 개 차곡차곡 쌓아 만들었어요",
                 "커다란 바위 하나를 깎은 것이 아니라, 작은 돌을 여러 개 차곡차곡 쌓아 만들었어요.")
        self.play(FadeIn(zoom), Create(ring), FadeIn(cap), run_time=0.9)
        self.settle()
        card = K.text_card([f"생물도 모두 {o('세포')}라는 기본 단위로", "이루어져 있어요"], size=36).move_to([2.6, 0.6, 0])
        self.say(f"생물은 모두 {o('세포')}라는 기본 단위로 이루어져 있어요",
                 "첨성대가 돌로 이루어진 것처럼, 생물은 모두 세포라는 기본 단위로 이루어져 있어요.")
        self.play(FadeOut(VGroup(zoom, ring, cap)), FadeIn(card), run_time=0.7)
        self.say(f"세포는 대부분 아주 작아서 {o('현미경')}으로 관찰해요",
                 "세포는 대부분 크기가 매우 작아서 현미경을 사용해야 관찰할 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 현미경 ──
    def scope(self):
        self.section("광학 현미경")
        ms = K.microscope(5.0).move_to([-3.4, 0.2, 0])
        self.say("광학 현미경의 각 부분을 살펴봐요", "광학 현미경의 각 부분을 살펴봐요.")
        self.play(FadeIn(ms), run_time=0.8)
        L = [("eye", "접안렌즈", (-6.0, 2.2)), ("obj", "대물렌즈", (-6.1, 0.9)), ("stage", "재물대", (-6.3, 0.0)),
             ("dia", "조리개", (-6.3, -0.8)), ("lamp", "조명", (-6.3, -1.7)), ("rev", "회전판", (-0.6, 1.6)),
             ("coarse", "조동 나사", (-0.4, 0.2)), ("fine", "미동 나사", (-0.4, -1.1))]
        ps = VGroup(*[K.pointer(ms.pt(k), at, t, INK, 28) for k, t, at in L])
        self.play(FadeIn(ps, lag_ratio=0.12), run_time=1.6)
        fn = K.text_card([f"{o('접안렌즈')}: 눈으로 보는 렌즈",
                          f"{o('대물렌즈')}: 관찰 대상 가까이에서 확대",
                          f"{o('재물대')}: 현미경표본을 올려놓는 곳",
                          f"{o('조리개')}: 빛의 양을 조절"], w=6.0, size=27).move_to([3.95, 1.5, 0])
        self.say(f"두 렌즈가 확대하고, {o('재물대')}에 표본을 올려요",
                 "접안렌즈와 대물렌즈가 관찰 대상을 확대해요. 표본은 재물대에 올리고, 조리개로 빛의 양을 조절해요.")
        self.play(FadeIn(fn, shift=LEFT * 0.2), run_time=0.7)
        self.settle()
        fn2 = K.text_card([f"{o('회전판')}: 돌려서 배율을 바꿈",
                           f"{o('조동 나사')}: 초점을 대략",
                           f"{o('미동 나사')}: 초점을 정확히"], w=6.0, size=27).move_to([3.95, -1.3, 0])
        self.say(f"조동 나사로 {o('대략')}, 미동 나사로 {o('정확히')} 초점을 맞춰요",
                 "회전판을 돌려 대물렌즈의 배율을 바꾸고, 조동 나사로 초점을 대략, 미동 나사로 정확히 맞춰요.")
        self.play(FadeIn(fn2, shift=LEFT * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
        st = K.steps_row(["낮은 배율\n대물렌즈로", "옆에서 보며\n재물대 올리기", "재물대를 내리며\n상 찾기",
                          "미동 나사로\n뚜렷하게", "높은 배율로\n바꾸기"], w=2.3, h=1.5, size=26, buff=0.4, accent=self.accent)
        st.move_to([0, 1.3, 0])
        self.say(f"먼저 {o('배율이 가장 낮은')} 대물렌즈로 시작해요",
                 "먼저 배율이 가장 낮은 대물렌즈가 가운데에 오게 하고, 표본을 재물대에 고정해요.")
        self.play(FadeIn(st.cards[0]), run_time=0.5)
        for i in range(4):
            self.play(Create(st.arrows[i]), FadeIn(st.cards[i + 1]), run_time=0.45)
        warn = K.safety_note("재물대를 올릴 때는 대물렌즈가 표본에 닿지 않게 옆에서 직접 보면서!", w=12.4, size=28).move_to([0, -1.0, 0])
        self.say(f"재물대를 올릴 때는 {r('옆에서 보면서')} 조절해요",
                 "재물대를 올릴 때는 대물렌즈가 표본에 닿지 않도록 옆에서 직접 보면서 조절해요.")
        self.play(FadeIn(warn), Indicate(st.cards[1], color=RED), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 표본 만들기 ──
    def slide(self):
        self.section("현미경표본")
        st = K.steps_row(["① 사철나무잎 뒷면에\n투명 매니큐어를 얇게", "② 완전히\n마를 때까지", "③ 셀로판테이프를\n붙여 문지르기",
                          "④ 떼어 내어\n받침 유리에"], w=2.9, h=1.6, size=27, buff=0.45, accent=self.accent).move_to([0, 1.5, 0])
        self.say("사철나무잎으로 현미경표본을 만들어요",
                 "사철나무잎 뒷면에 투명 매니큐어를 얇게 바르고, 마르면 셀로판테이프를 붙였다 떼어 받침 유리에 붙여요.")
        self.play(FadeIn(st.cards[0]), run_time=0.5)
        for i in range(3):
            self.play(Create(st.arrows[i]), FadeIn(st.cards[i + 1]), run_time=0.5)
        self.settle()
        q = K.text_card([f"매니큐어가 {o('완전히 마른 뒤')} 테이프를 붙이는 까닭은?",
                         f"→ 잎 표면의 세포 모양이 매니큐어에 {g('잘 고정되게')} 하려고요"], size=32).move_to([0, -1.0, 0])
        self.say(f"다 마른 뒤에 붙여야 세포 모양이 {g('잘 고정돼요')}",
                 "매니큐어가 다 마르지 않으면 세포 모양이 고정되지 않아요. 매니큐어는 잎 표면의 모양을 본떠요.")
        self.play(FadeIn(q, shift=UP * 0.2), Indicate(st.cards[1], color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 관찰 ──
    def observe(self):
        self.section("관찰해요")
        a = K.cell_view("leaf", 1.7).move_to([-3.3, 0.35, 0])
        b = K.cell_view("onion", 1.7).move_to([3.3, 0.35, 0])
        la = T("사철나무잎 표피세포", 32).next_to(a, DOWN, buff=0.2)
        lb = T("양파 표피세포(영구표본)", 32).next_to(b, DOWN, buff=0.2)
        mag = M(f"배율 = 접안렌즈 10배 × 대물렌즈 40배 = {o('400배')}", 34).move_to([0.9, 2.75, 0])
        self.say("두 표본을 현미경으로 관찰해요", "두 표본을 현미경으로 관찰해요.")
        self.play(FadeIn(a), FadeIn(b), FadeIn(la), FadeIn(lb), run_time=0.9)
        self.say(f"현미경 배율은 두 렌즈의 배율을 {o('곱해요')}",
                 "현미경 배율은 접안렌즈 배율과 대물렌즈 배율을 곱해요. 십 곱하기 사십, 사백 배예요.")
        self.play(FadeIn(mag), run_time=0.6)
        self.pause_screen(5, "두 세포는 어떻게 생겼나요?")
        self.say(f"양파: {o('각진 세포')}가 붙어 있고 안에 {o('둥근 핵')}이 있어요",
                 "양파 표피세포는 각진 모양의 세포가 여러 개 붙어 있고, 안쪽에 둥근 핵이 있어요. 세포의 경계도 뚜렷해요.")
        self.play(Indicate(b.nucs, color=ORANGE, scale_factor=1.3), run_time=1.0)
        self.settle()
        self.say(f"사철나무잎: {o('강낭콩 모양')} 세포 두 개가 마주 봐요",
                 "사철나무잎 표피세포는 각진 세포들 사이에 강낭콩 모양의 세포 두 개가 마주 보고 있어요.")
        self.play(Indicate(a.nucs, color=ORANGE, scale_factor=1.25), run_time=1.0)
        self.settle()
        self.say(f"사철나무잎에서 핵이 잘 안 보인 것은 {r('염색하지 않아서')}예요",
                 "사철나무잎에서 핵이 잘 안 보인 것은 핵이 없어서가 아니라, 핵을 염색하지 않았기 때문이에요.")
        self.settle()
        clear_stage(self)

    # ── 세포 구조 ──
    def structure(self):
        self.section("세포의 구조")
        c = K.plant_cell(4.0).move_to([-2.2, 0.35, 0])
        self.say("식물 세포는 어떻게 생겼을까요?", "식물 세포는 어떻게 생겼을까요?")
        self.play(FadeIn(c), run_time=0.8)
        p_n = K.pointer(c.pt("nuc"), (3.4, 2.1), "핵", "#6A3D8F", 34)
        p_m = K.pointer(c.pt("mem"), (3.6, 0.6), "세포막", "#C06A10", 34)
        p_w = K.pointer(c.pt("wall"), (3.8, -1.0), "세포벽", "#3F6E1E", 34)
        self.say(f"세포는 {o('세포막')}으로 둘러싸여 있고 안에 둥근 {o('핵')}이 있어요",
                 "세포는 세포막으로 둘러싸여 있고, 그 안에는 둥근 핵이 있어요.")
        self.play(FadeIn(p_n), Indicate(c.nuc, color=ORANGE), run_time=0.8)
        self.play(FadeIn(p_m), Indicate(c.mem, color=ORANGE, scale_factor=1.03), run_time=0.8)
        self.settle()
        self.say(f"식물 세포는 {g('세포벽')}이 세포막 바깥을 둘러싸요",
                 "식물 세포는 세포벽이 세포막의 바깥쪽을 둘러싸고 있어요.")
        self.play(FadeIn(p_w), Circumscribe(c.wall, color=GREEN), run_time=1.0)
        self.settle()
        self.say(f"양파 세포의 가장자리가 뚜렷한 것도 {g('세포벽')} 때문이에요",
                 "양파 표피세포의 가장자리가 뚜렷하게 보인 까닭은 가장자리에 세포벽이 있기 때문이에요.")
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        rows = [("한 생물을 이루는 세포는 크기와 모양이 모두 같다.", False),
                ("모든 세포는 맨눈으로 볼 수 없다.", False),
                ("식물은 세포로 이루어져 있다.", True)]
        cards = VGroup()
        for t_, ok in rows:
            bx = RoundedRectangle(corner_radius=0.16, width=10.4, height=1.0, fill_color=PAPER, fill_opacity=1,
                                  stroke_color=INK, stroke_width=4)
            tt = T(t_, 34)
            if tt.width > 8.9:
                tt.scale_to_fit_width(8.9)
            tt.move_to(bx).shift(RIGHT * 0.45)
            cards.add(VGroup(bx, tt))
        cards.arrange(DOWN, buff=0.32).move_to([-0.7, 0.5, 0])
        marks = VGroup(*[K.ox_mark(ok, 0.3).move_to(c_.get_left() + RIGHT * 0.55) for c_, (_, ok) in zip(cards, rows)])
        self.say("세포에 관한 말, 맞을까요 틀릴까요?", "세포에 관한 세 가지 말이에요. 맞을까요, 틀릴까요?")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=1.0)
        self.pause_screen(5, "○일까요, ×일까요?")
        self.say(f"세포는 종류에 따라 {o('크기와 모양이 다양해요')}",
                 "한 생물을 이루는 세포도 종류에 따라 크기와 모양이 다양해요. 사철나무잎과 양파의 세포 모양도 달랐지요.")
        self.play(FadeIn(marks[0]), run_time=0.5)
        self.settle()
        self.say(f"달걀·타조알은 {o('하나의 세포')}인데 맨눈으로 보여요",
                 "달걀이나 타조알 같은 알은 하나의 세포인데도 영양물질을 저장하고 있어 맨눈으로 보일 만큼 커요.")
        egg = Ellipse(width=0.75, height=1.0, fill_color="#FFF6E2", fill_opacity=1, stroke_color="#B39A6A", stroke_width=4).move_to([5.8, 0.75, 0])
        egg = VGroup(egg, T("달걀", 30).move_to([5.8, -0.2, 0]))
        self.play(FadeIn(marks[1]), FadeIn(egg), run_time=0.6)
        self.settle()
        self.play(FadeIn(marks[2]), run_time=0.5)
        self.wait(0.6)
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        a = K.cell_view("onion", 1.3).move_to([-4.6, 0.9, 0])
        c = K.plant_cell(2.4).move_to([0.2, 0.9, 0])
        tw = K.tower(2.6).move_to([4.6, 0.9, 0])
        card = K.text_card([f"대부분의 생물은 모양과 크기가 다양한 {o('세포')}로 이루어져 있습니다."], size=34).move_to([0, -1.55, 0])
        self.say(f"대부분의 생물은 다양한 {o('세포')}로 이루어져 있어요",
                 "대부분의 생물은 모양과 크기가 다양한 세포로 이루어져 있어요.")
        self.play(FadeIn(a), FadeIn(c), FadeIn(tw), run_time=0.8)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
