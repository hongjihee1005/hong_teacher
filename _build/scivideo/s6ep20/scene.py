"""「과학 원리 돋보기」 6학년 20화 — 하루 동안 태양과 별의 위치 (6-1 4단원 지구의 운동 2~3차시, 화 코드 6-1-4-a)

바탕: grade6/science/sem1/u4-1.html(원본 _build_tb/src/u4-1.html) — 도입(독도: 동쪽 바다 위 태양은 떠오르는 중,
같은 장소에서 일정한 시간 간격으로 관찰), 관찰 준비(나침반, 남쪽을 바라보면 왼쪽이 동쪽, 태양 관측 안경 — 맨눈·선글라스 안 됨),
태양 붙임딱지(오전 8시 30분부터 두 시간마다 다섯 번, 학교 운동장 — 앱이 10~2월에는 6월 10일 하늘로 보여 줌, 다른 날짜 3월 21일·6월 21일·12월 22일),
천체 관측 프로그램(2025년 7월 15일 오후 7시부터 한 시간마다 견우성(알타이르)·안타레스, 안타레스는 오전 2시에 서쪽 지평선 아래),
정리(태양·별 모두 동→서, 방향이 같음), 생각이 한눈에(해돋이를 일찍 보려면 동쪽으로), 한눈에 쏙, 형성 평가(오후 1시 → 오후 3시 ㉣).
천체 위치는 앱과 같은 식(kit_s6u14)으로 계산.
최종: ./make_final.sh s6ep20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Wiggle, Circumscribe,
                   Rectangle, RoundedRectangle, Line, DashedLine, Dot, VMobject, ArcBetweenPoints, Circle, GrowFromCenter)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


SUNT = [8.5, 10.5, 12.5, 14.5, 16.5]


def path_through(pts, col, sw=4, dashed=True):
    m = VMobject(stroke_color=col, stroke_width=sw)
    m.set_points_smoothly([np.array(p) for p in pts])
    if dashed:
        from manim import DashedVMobject
        return DashedVMobject(m, num_dashes=40)
    return m


class S6Ep20(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 20
    EP_TITLE = "하루 동안 태양과 별의 위치"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.prepare()
        self.sun_watch()
        self.star_watch()
        self.compare()
        self.sunrise()
        self.summary()
        self.check()
        self.closing(f"하루 동안 태양과 별은 모두\n{o('동쪽')}에서 {g('서쪽')}으로 위치가 달라져요",
                     next_preview="6학년 21화 · 지구의 자전")
        self.wait(0.5)

    # ── 궁금해요: 독도 ──
    def intro(self):
        self.section("궁금해요")
        pic = K.dokdo(9.0, 3.8).move_to([0, 0.55, 0])
        self.say("독도의 하늘이에요", "독도의 하늘이에요.")
        self.play(FadeIn(pic), run_time=0.8)
        self.say(f"태양은 {o('떠오르는 중')}일까요, {o('지는 중')}일까요?",
                 "태양은 떠오르는 중일까요, 지는 중일까요? 방위를 보세요.")
        self.pause_screen(5, "떠오르는 중일까요, 지는 중일까요?")
        sunpos = pic.get_corner(DOWN + RIGHT) + np.array([-1.0, 1.25, 0])
        ring = Circle(radius=0.62, stroke_color=ORANGE, stroke_width=7).move_to(sunpos)
        self.say(f"태양이 {o('동쪽')} 바다 위에 있어요 → {g('떠오르는 중')}",
                 "태양이 동쪽 바다 위에 있으니 떠오르는 중이에요.")
        self.play(Create(ring), run_time=0.6)
        self.settle()
        clear_stage(self)
        q = T("하루 동안 태양의 위치 변화는 어떻게 알 수 있을까요?", 40).move_to([0, 2.2, 0])
        a = K.text_card([f"{g('같은 장소')}에서", f"{g('일정한 시간 간격')}으로 관찰해요"], w=7.0, size=40).move_to([0, 0.2, 0])
        self.play(FadeIn(q), run_time=0.5)
        self.say(f"{g('같은 장소')}에서 {g('일정한 시간 간격')}으로 관찰해요",
                 "하루 동안 태양의 위치 변화는 같은 장소에서 일정한 시간 간격으로 관찰하면 알 수 있어요.")
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 관찰 준비 ──
    def prepare(self):
        self.section("관찰 준비")
        ground = RoundedRectangle(corner_radius=0.2, width=5.6, height=4.4, fill_color="#EEF7E6", fill_opacity=1,
                                  stroke_color=SOFT, stroke_width=3).move_to([-3.3, 0.55, 0])
        c = ground.get_center()
        dirs = VGroup(T("북", 32).move_to(c + UP * 1.85), T("남", 32).move_to(c + DOWN * 1.85),
                      T("서", 32).move_to(c + LEFT * 2.45), T("동", 32).move_to(c + RIGHT * 2.45))
        kid = K.person_top(th=np.pi, s=1.0).move_to(c + UP * 0.15)
        comp = K.compass(0.42).move_to(c + np.array([1.8, 1.4, 0]))
        look = T("바라보는 쪽", 22, GREEN).move_to(c + np.array([0, -1.15, 0]))
        self.say("나침반으로 방위를 확인하고 남쪽을 바라보고 서요",
                 "나침반으로 방위를 확인하고 남쪽을 바라보고 서요.")
        self.play(FadeIn(ground), FadeIn(dirs), FadeIn(comp), run_time=0.7)
        self.play(FadeIn(kid), FadeIn(look), run_time=0.6)
        q = T("내 왼쪽은 어느 쪽일까요?", 38).move_to([3.4, 1.7, 0])
        self.say("남쪽을 바라보면 내 왼쪽은 어느 쪽일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.settle()
        left_tag = kid[1]
        ans = K.text_card([f"왼쪽 = {o('동쪽')}", f"오른쪽 = {o('서쪽')}"], w=5.2, size=40).move_to([3.4, 0.2, 0])
        self.say(f"왼쪽이 {o('동쪽')}, 오른쪽이 {o('서쪽')}이에요",
                 "왼쪽이 동쪽, 오른쪽이 서쪽이에요. 앞으로는 동쪽, 서쪽이라고 말해요.")
        self.play(Indicate(left_tag, color=ORANGE, scale_factor=1.4), FadeIn(ans), run_time=0.9)
        self.settle()
        safe = K.safety_note("태양은 맨눈으로 절대 보지 않고 반드시 태양 관측 안경을 써요", w=12.6, size=30).move_to([0, -2.15, 0])
        self.say(f"태양은 {r('맨눈·선글라스로 보지 않고')} {g('태양 관측 안경')}으로 잠깐만",
                 "태양은 맨눈이나 선글라스로 보면 눈을 다쳐요. 반드시 태양 관측 안경을 쓰고 잠깐만 봐요.")
        self.play(FadeIn(safe, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 태양 관찰 ──
    def sun_watch(self):
        self.section("태양 관찰")
        sky = K.SkyPanel(night=False, w=12.6, hor=-1.4, top=2.75, ground=0.9)
        date = K.label("관찰한 날: 6월 10일 · 학교 운동장", INK, 24).move_to([-3.9, 2.4, 0])
        self.say("학교 운동장에서 남쪽 하늘을 바라봐요", "학교 운동장에서 남쪽 하늘을 바라봐요.")
        self.play(FadeIn(sky), FadeIn(date), run_time=0.8)
        self.settle()
        pts, stk = [], VGroup()
        self.say("오전 8시 30분부터 두 시간마다 태양 붙임딱지를 붙여요",
                 "오전 8시 30분부터 두 시간마다 태양 붙임딱지를 붙이고 시각을 적어요.")
        for h in SUNT:
            a, z = K.sun_altaz(6, 10, h)
            p = sky.xy(z, a)
            s_ = K.sun_sticker(K.fmt_h(h), r=0.2, size=22)
            s_.shift(p - s_.sun.get_center())
            pts.append(p)
            stk.add(s_)
            self.play(FadeIn(s_, scale=0.6), run_time=0.55)
            self.wait(0.25)
        self.settle()
        self.pause_screen(5, "태양의 위치는 어떻게 달라졌나요?")
        path = path_through(pts, RED)
        self.say(f"{o('동쪽 하늘')} → {o('남쪽 하늘')} → {o('서쪽 하늘')}",
                 "태양은 동쪽 하늘에서 남쪽 하늘을 지나 서쪽 하늘로 위치가 달라져요.")
        self.play(Create(path), run_time=1.4)
        self.bring_to_front(stk)
        self.play(Indicate(stk[0], color=ORANGE), run_time=0.5)
        self.play(Indicate(stk[2], color=ORANGE), run_time=0.5)
        self.play(Indicate(stk[4], color=ORANGE), run_time=0.5)
        self.settle()
        # 다른 날짜
        days = [(3, 21, "3월 21일", "#1C6FA8"), (6, 21, "6월 21일", "#16804A"), (12, 22, "12월 22일", "#8A3FB0")]
        lines, tags = VGroup(), VGroup()
        for i, (m_, d_, n_, c_) in enumerate(days):
            ps = [sky.xy(*reversed(K.sun_altaz(m_, d_, h))) for h in SUNT]
            ln = path_through(ps, c_, sw=5)
            dots = VGroup(*[Dot(p, radius=0.07, color=c_) for p in ps])
            lines.add(VGroup(ln, dots))
            tags.add(T(n_, 24, c_))
        tags.arrange(RIGHT, buff=0.5).move_to([3.6, 2.4, 0])
        self.say(f"다른 날짜에도 {o('동쪽에서 서쪽으로')} 위치가 달라져요",
                 "다른 날짜에는 자리가 조금 다르지만, 동쪽에서 서쪽으로 달라지는 것은 같아요.")
        self.play(FadeOut(stk), FadeOut(path), FadeOut(date), run_time=0.4)
        self.play(*[Create(l_) for l_ in lines], FadeIn(tags), run_time=1.5)
        self.settle()
        clear_stage(self)

    # ── 별 관찰 ──
    def star_watch(self):
        self.section("별 관찰")
        sky = K.SkyPanel(night=True, w=12.6, hor=-1.4, top=2.75, ground=0.9, landscape=False)
        bg = K.bg_stars(-6.1, 6.1, -1.2, 2.6, n=45, seed=5, op=0.45)
        date = K.label("2025년 7월 15일 · 천체 관측 프로그램", INK, 24).move_to([-3.6, 2.4, 0])
        self.say("천체 관측 프로그램으로 밤하늘의 별을 관찰해요",
                 "이번에는 천체 관측 프로그램으로 별을 관찰해요.")
        self.play(FadeIn(sky), FadeIn(bg), FadeIn(date), run_time=0.8)

        def marks(star, col, hours):
            pts, grp = [], VGroup()
            for k in hours:
                a, z = K.star_altaz(*star, 2025, 7, 15, 19 + k)
                if a < 0:
                    break
                p = sky.xy(z, a)
                pts.append(p)
                grp.add(Dot(p, radius=0.09, color=col))
            return pts, grp
        a0, z0 = K.star_altaz(*K.ALTAIR, 2025, 7, 15, 19)
        alt0 = Dot(sky.xy(z0, a0), radius=0.08, color=PAPER)
        alt_lab = T("견우성(알타이르)", 24, "#C8D6FF").next_to(alt0, RIGHT, buff=0.3)
        self.say(f"오후 7시, 동쪽 하늘의 밝은 별 {o('견우성')}을 골라 표시해요",
                 "오후 7시, 동쪽 하늘의 밝은 별 견우성의 위치를 한 시간마다 유성펜으로 표시해요.")
        self.play(FadeIn(alt0), FadeIn(alt_lab), run_time=0.6)
        pa, ga = marks(K.ALTAIR, K.ALT_C, range(10))
        la = path_through(pa, K.ALT_C, sw=3, dashed=False)
        self.play(FadeOut(alt0), Create(la), FadeIn(ga, lag_ratio=0.3), run_time=2.6)
        t0 = T("오후 7시", 22, "#FFB8B8").next_to(ga[0], LEFT, buff=0.12)
        t1 = T("오전 4시", 22, "#FFB8B8").next_to(ga[-1], DOWN, buff=0.12)
        self.play(FadeIn(t0), FadeIn(t1), run_time=0.4)
        self.settle()
        pb, gb = marks(K.ANTARES, K.ANT_C, range(10))
        lb = path_through(pb, K.ANT_C, sw=3, dashed=False)
        ant_lab = T("안타레스", 24, "#C8D6FF").next_to(gb[0], UP, buff=0.3)
        self.say(f"남동쪽 하늘의 붉은 별 {o('안타레스')}도 표시해요",
                 "남동쪽 하늘의 붉은 별 안타레스도 표시해요.")
        self.play(FadeIn(ant_lab), Create(lb), FadeIn(gb, lag_ratio=0.3), run_time=2.0)
        self.settle()
        self.pause_screen(5, "별의 위치는 어떻게 달라졌나요?")
        self.say(f"별도 {o('동쪽 하늘')}에서 {o('서쪽 하늘')}로 위치가 달라져요",
                 "두 별 모두 동쪽 하늘에서 서쪽 하늘로 위치가 달라져요.")
        self.play(Indicate(ga, color=ORANGE, scale_factor=1.3), Indicate(gb, color=ORANGE, scale_factor=1.3), run_time=1.2)
        note = K.label("안타레스는 오전 2시에 서쪽 지평선 아래로", INK, 24).move_to([3.5, 2.4, 0])
        self.say(f"안타레스는 오전 2시에 {o('서쪽 지평선 아래')}로 내려가요",
                 "안타레스는 오전 2시에 서쪽 지평선 아래로 내려가 보이지 않아요.")
        self.play(FadeIn(note), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def compare(self):
        self.section("정리해요")
        rows = [["태양", f"{o('동쪽')} → {o('서쪽')}"], ["별", f"{o('동쪽')} → {o('서쪽')}"]]
        tab = K.result_table(["", "하루 동안 위치 변화"], rows, [2.6, 5.6], row_h=0.9, size=36).move_to([0, 1.45, 0])
        self.say("태양과 별의 위치 변화를 비교해요")
        self.play(FadeIn(tab), run_time=0.7)
        rule = K.text_card([f"규칙성: 태양과 별은 모두 {g('동쪽에서 서쪽으로')}", "위치가 달라져요. 다른 날짜에 관찰해도 같아요."],
                           w=11.6, size=36).move_to([0, -1.5, 0])
        self.say(f"방향이 {g('서로 같아요')} — 다른 날짜에 관찰해도 같아요",
                 "방향이 서로 같아요. 태양과 별은 모두 동쪽에서 서쪽으로 위치가 달라져요.")
        self.play(FadeIn(rule, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 생각이 한눈에 ──
    def sunrise(self):
        self.section("생각해요")
        q = T("해돋이를 일찍 보려면 어느 방향으로 가야 할까요?", 42).move_to([0, 2.2, 0])
        opts = VGroup(*[K.word_card(t_, 2.6, 1.0, size=34) for t_ in ("동쪽", "서쪽", "남쪽", "북쪽")]).arrange(RIGHT, buff=0.4).move_to([0, 0.7, 0])
        self.say("우리나라에서 해돋이를 일찍 보려면?", "우리나라에서 해돋이를 일찍 보려면 어느 방향으로 가야 할까요?")
        self.play(FadeIn(q), FadeIn(opts, lag_ratio=0.1), run_time=0.8)
        mark = K.ox_mark(True, 0.6).move_to(opts[0])
        why = K.text_card([f"태양은 {o('동쪽 하늘')}에서 떠오르기 때문이에요"], w=9.6, size=36).move_to([0, -1.2, 0])
        self.say(f"{g('동쪽')}으로 가요 — 태양은 동쪽 하늘에서 떠요",
                 "동쪽으로 가요. 태양은 동쪽 하늘에서 떠오르니까요.")
        self.play(Create(mark), opts[0][0].animate.set_stroke(GREEN, 6), FadeIn(why), run_time=0.8)
        self.say("태양과 별은 왜 동쪽에서 서쪽으로 달라질까요?",
                 "태양과 별은 왜 동쪽에서 서쪽으로 달라질까요? 다음 시간에 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card2 = K.text_card([f"하루 동안 태양과 별은 {o('동')}쪽에서", f"{o('서')}쪽으로 위치가 달라집니다."], w=12.0, size=44).move_to([0, 0.6, 0])
        self.say(f"{o('동')}쪽에서 {o('서')}쪽으로", "하루 동안 태양과 별은 동쪽에서 서쪽으로 위치가 달라집니다.")
        self.play(FadeIn(card2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인해요(형성 평가 2번) ──
    def check(self):
        self.section("확인해요")
        A, C, B = np.array([-4.8, -1.4, 0]), np.array([0, 3.4, 0]), np.array([4.8, -1.4, 0])

        def pt(u):
            return (1 - u) ** 2 * A + 2 * u * (1 - u) * C + u * u * B
        base = Line([-5.6, -1.4, 0], [5.6, -1.4, 0], stroke_color="#7FAE5A", stroke_width=8)
        arc = path_through([pt(u) for u in np.linspace(0, 1, 30)], SOFT, sw=4)
        dirs = VGroup(T("동", 32).move_to(A + DOWN * 0.45), T("남", 32).move_to([0, -1.85, 0]), T("서", 32).move_to(B + DOWN * 0.45))
        marks = VGroup()
        for u, n in ((.12, "㉠"), (.3, "㉡"), (.45, "㉢"), (.72, "㉣")):
            c_ = Circle(radius=0.26, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to(pt(u))
            marks.add(VGroup(c_, T(n, 26).move_to(c_)))
        sun = K.sun_icon(0.25).move_to(pt(.58))
        lab = T("오후 1시", 26, "#B4380F").next_to(sun, UP, buff=0.25)
        self.say("오후 1시의 태양이에요. 오후 3시에는 어디에 있을까요?",
                 "오후 1시의 태양이에요. 오후 3시에는 어디에 있을까요?")
        self.play(FadeIn(base), Create(arc), FadeIn(dirs), FadeIn(marks), FadeIn(sun), FadeIn(lab), run_time=1.0)
        self.pause_screen(4, "오후 3시의 태양은 어디일까요?")
        ring = Circle(radius=0.42, stroke_color=GREEN, stroke_width=8).move_to(marks[3])
        self.say(f"{g('㉣')} — 시간이 지나면 태양은 더 {o('서쪽')}으로",
                 "답은 ㉣. 시간이 지나면 태양은 더 서쪽으로 가요.")
        self.play(Create(ring), run_time=0.6)
        self.settle()
        clear_stage(self)
