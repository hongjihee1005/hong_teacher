"""「과학 원리 돋보기」 6학년 24화 — 계절마다 다른 별자리 (6-1 4단원 지구의 운동 7차시, 화 코드 6-1-4-e)

바탕: grade6/science/sem1/u4-5.html(원본 _build_tb/src/u4-5.html) — 도입(백조자리: 날개를 편 백조, 여름철, 별자리의 뜻),
천체 관측 프로그램(남쪽 하늘 오후 9시: 봄 4월 15일 사자·처녀·바다뱀자리, 여름 7월 15일 독수리·전갈·궁수자리,
가을 10월 15일 페가수스·물고기·물병자리, 겨울 1월 15일 쌍둥이·오리온·큰개자리 — 앱과 같은 별 자료·계산), 이전 계절 별자리(여름 하늘의
사자자리는 서쪽), 북쪽에서 내려다본 공전과 계절별 별자리(밤이 되는 쪽 = 태양 반대쪽, 태양과 같은 방향의 별자리는 안 보임),
정리(공전으로 지구의 위치가 달라져서), 독수리자리 덧붙임, 천체 투영관, 한눈에 쏙, 형성 평가(㉠·㉢).
u4-6(창의가 팡팡)의 '현상마다 어떤 운동 때문인지' 나누기를 단원 정리로 덧붙임.
최종: ./make_final.sh s6ep24
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import math
import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker,
                   Rectangle, RoundedRectangle, Line, DashedLine, Dot, Circle, Ellipse, Arc, Polygon, always_redraw, linear)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


CYG = {'a': (20.6905, 45.28, 1.4), 'g': (20.3705, 40.257, 1.1), 'b': (19.512, 27.96, 1), 'd': (19.7496, 45.131, 1),
       'e': (20.7702, 33.97, 1.1), 'h': (19.9384, 35.083, .8), 'z': (21.2156, 30.227, .9), 'i': (19.4953, 51.73, .8),
       'k': (19.2849, 53.368, .8)}
GRP = {'spring': 11.5, 'summer': 18, 'autumn': 23, 'winter': 6.5}
EARTH = {'spring': 13.5, 'summer': 19.6, 'autumn': 1.3, 'winter': 7.7}
OC = np.array([0.0, 0.25, 0])


def angd(a, b):
    return abs((a - b + 3 * PI) % (2 * PI) - PI)


class S6Ep24(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 24
    EP_TITLE = "계절마다 다른 별자리"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.previous()
        self.why()
        self.organize()
        self.motions()
        self.summary()
        self.check()
        self.closing(f"지구의 {o('공전')}으로 {g('계절')}에 따라\n밤하늘에 보이는 별자리가 달라져요",
                     next_preview="6학년 25화 · 태양 고도란?")
        self.wait(0.5)

    # ── 궁금해요: 백조자리 ──
    def intro(self):
        self.section("궁금해요")
        panel = RoundedRectangle(corner_radius=0.2, width=6.0, height=4.6, fill_color=K.NIGHT, fill_opacity=1,
                                 stroke_color=INK, stroke_width=3).move_to([-3.3, 0.35, 0])
        k = 0.115
        r0, d0 = 20.3, 40

        def P(v):
            return panel.get_center() + np.array([-(v[0] - r0) * 15 * math.cos(d0 * K.RAD) * k, (v[1] - d0) * k - 0.2, 0])
        lines = VGroup(*[Line(P(CYG[u]), P(CYG[v]), stroke_color="#7FA8E8", stroke_width=4)
                         for u, v in (e.split('-') for e in 'a-g g-h h-b g-d d-i i-k g-e e-z'.split())])
        dots = VGroup(*[Dot(P(v), radius=0.05 * v[2] + 0.03, color=K.STAR_W) for v in CYG.values()])
        bg = K.bg_stars(-6.0, -0.6, -1.7, 2.4, n=28, seed=8, op=0.4)
        self.say("이 별들을 보고 어떤 동물이 떠오르나요?", "밤하늘의 별을 이어 보았어요. 어떤 동물이 떠오르나요?")
        self.play(FadeIn(panel), FadeIn(bg), FadeIn(dots), run_time=0.7)
        self.play(Create(lines), run_time=1.2)
        self.settle()
        name = K.label("백조자리", INK, 34).move_to([-3.3, -2.25, 0])
        card = K.text_card(["옛날 사람들은 무리 지어 있는 별을 이어", "인물·동물·물건 등의 이름을 붙였어요", f"→ {o('별자리')}"],
                           w=6.6, size=30).move_to([3.4, 0.9, 0])
        self.say(f"날개를 편 백조 모양 — {o('백조자리')}, 여름철에 볼 수 있어요",
                 "날개를 펴고 나는 백조 모양이라서 백조자리라고 해요. 여름철 밤하늘에서 볼 수 있어요.")
        self.play(FadeIn(name), run_time=0.5)
        self.say(f"무리 지은 별을 이어 이름을 붙인 것 = {o('별자리')}",
                 "옛날 사람들은 밤하늘에 무리 지어 있는 별을 이어 신화 속 인물이나 동물, 물건 등의 이름을 붙였어요. 이것이 별자리예요.")
        self.play(FadeIn(card), run_time=0.6)
        q = T("계절마다 보이는 별자리는 같을까요?", 34, self.accent).move_to([3.4, -1.0, 0])
        self.say("계절마다 밤하늘에 보이는 별자리는 어떨까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 관찰해요: 계절별 남쪽 하늘 ──
    def observe(self):
        self.section("관찰해요")
        spots = {'spring': (-3.45, 2.75), 'summer': (3.45, 2.75), 'autumn': (-3.45, 0.2), 'winter': (3.45, 0.2)}
        lines = {
            'spring': ("봄(4월 15일): 사자자리·처녀자리·바다뱀자리", "봄에는 사자자리, 처녀자리, 바다뱀자리가 보여요."),
            'summer': ("여름(7월 15일): 독수리자리·전갈자리·궁수자리", "여름에는 독수리자리, 전갈자리, 궁수자리예요."),
            'autumn': ("가을(10월 15일): 페가수스자리·물고기자리·물병자리", "가을에는 페가수스자리, 물고기자리, 물병자리예요."),
            'winter': ("겨울(1월 15일): 쌍둥이자리·오리온자리·큰개자리", "겨울에는 쌍둥이자리, 오리온자리, 큰개자리가 보여요."),
        }
        self.say("천체 관측 프로그램 — 남쪽 하늘, 오후 9시", "천체 관측 프로그램으로 계절마다 오후 9시의 남쪽 하늘을 관찰해요.")
        skies = VGroup()
        for s_ in ('spring', 'summer', 'autumn', 'winter'):
            x, top = spots[s_]
            sky = K.season_sky(s_, w=6.7, cx=x, top=top, hor=top - 2.05, ground=0.42, size=19)
            sky.labels.set_opacity(0)
            hor = top - 2.05
            for az, n in ((90, "동"), (180, "남"), (270, "서")):
                xx = x + (az - 180) / 120 * (6.7 / 2 - 0.15)
                sky.add(T(n, 20, "#DDE6F0").move_to([xx, hor - 0.21, 0]))
            tag = K.label(f"{K.SEASON_KO[s_]} · {K.SEASON_DAY[s_][1]}월 {K.SEASON_DAY[s_][2]}일", K.SEASON_COL[s_], 20)
            tag.move_to([x - 3.35 + tag.width / 2 + 0.1, top - 0.25, 0])
            grp = VGroup(sky, tag)
            skies.add(grp)
            self.play(FadeIn(grp), run_time=0.6)
            self.say(*lines[s_])
        self.settle()
        self.pause_screen(5, "계절마다 어떻게 달랐나요?")
        self.say(f"계절마다 {o('대표적인 별자리')}가 달라요",
                 "계절마다 대표적인 별자리가 달라요. 이름을 외우기보다 계절에 따라 보이는 별자리가 다르다는 점이 중요해요.")
        self.play(*[Indicate(s_[1], color=ORANGE) for s_ in skies], run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 이전 계절의 별자리 ──
    def previous(self):
        self.section("관찰해요")
        sky = K.season_sky('summer', w=12.4, top=2.75, hor=-1.35, ground=0.9, only=['leo', 'aql', 'sco', 'sgr'], hl='leo', size=22)
        tag = sky.date_tag.move_to([-3.9, 2.4, 0])
        self.say("여름 하늘에서 봄철 별자리 사자자리를 찾아봐요",
                 "여름, 7월 15일 오후 9시 하늘에서 봄철 대표 별자리인 사자자리를 찾아봐요.")
        self.play(FadeIn(sky), FadeIn(tag), run_time=0.8)
        self.pause_screen(4, "사자자리는 어느 쪽 하늘에 있나요?")
        leo = sky.csts[0]
        self.say(f"이전 계절의 별자리는 {o('서쪽 하늘')}에서 보여요",
                 "계절이 바뀌면 이전 계절의 별자리는 서쪽 하늘에서 보여요.")
        self.play(Indicate(leo, color=ORANGE, scale_factor=1.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 까닭: 공전 ──
    def orbit_pic(self):
        g_ = VGroup()
        g_.add(Ellipse(width=4.2, height=2.3, stroke_color="#9FB3C0", stroke_width=3).move_to(OC))
        g_.add(Circle(radius=0.55, fill_color=K.SUN_Y, fill_opacity=1, stroke_color=K.SUN_O, stroke_width=3).move_to(OC),
               T("태양", 24, "#7A4A00").move_to(OC))
        arr = K.curved_arrow(1.0, -0.5, 0.5, GREEN, 5, center=OC + RIGHT * 1.1)
        g_.add(arr)
        return g_

    def grp_box(self, season, state=""):
        a = GRP[season] * 15 * K.RAD
        p = OC + np.array([4.9 * math.cos(a), 2.2 * math.sin(a), 0])
        fill = {"vis": "#FFE680", "hid": "#C8CCD4"}.get(state, "#26335F")
        tc = {"vis": "#3A2A00", "hid": "#7A7F88"}.get(state, PAPER)
        box = RoundedRectangle(corner_radius=0.15, width=3.3, height=1.05, fill_color=fill, fill_opacity=1,
                               stroke_color=K.SEASON_COL[season], stroke_width=4).move_to(p)
        names = K.cst_names(season)
        t1 = T(f"{K.SEASON_KO[season]}철 별자리", 24, tc)
        t2 = T("·".join(names), 18, tc)
        tt = VGroup(t1, t2).arrange(DOWN, buff=0.08).move_to(box)
        gg = VGroup(box, tt)
        if state == "hid":
            note = T("태양 빛 때문에 안 보여요", 20, RED)
            note.next_to(box, DOWN if p[1] > OC[1] else UP, buff=0.08)
            gg.add(note)
        return gg

    def earth_at(self, season, on=False):
        a = EARTH[season] * 15 * K.RAD
        p = OC + np.array([2.1 * math.cos(a), 1.15 * math.sin(a), 0])
        out = math.atan2(p[1] - OC[1], p[0] - OC[0])
        e = K.globe_top(0.28 if on else 0.2, phi=out, sun_dir=out + PI, land=False, show_obs=False).move_to(p)
        gg = VGroup(e)
        lab = T(K.SEASON_KO[season], 22, K.SEASON_COL[season]).move_to(p + 0.45 * np.array([math.cos(out), math.sin(out), 0]) * (-1))
        gg.add(lab)
        if on:
            u = np.array([math.cos(out), math.sin(out), 0])
            gg.add(DashedLine(p + u * 0.3, p + u * 1.6, stroke_color=ORANGE, stroke_width=5))
        return gg

    def why(self):
        self.section("까닭 알기")
        orb = self.orbit_pic()
        cap = T("북쪽에서 내려다본 지구의 공전", 22, K.NAVY).move_to([4.5, 2.75, 0])
        boxes = {s_: self.grp_box(s_) for s_ in GRP}
        earths = {s_: self.earth_at(s_) for s_ in EARTH}
        self.say("계절마다 지구는 공전 궤도의 다른 위치에 있어요",
                 "북쪽에서 내려다본 지구의 공전이에요. 계절마다 지구는 태양 둘레의 다른 위치에 있어요.")
        self.play(FadeIn(orb), FadeIn(cap), *[FadeIn(b_) for b_ in boxes.values()], *[FadeIn(e) for e in earths.values()], run_time=1.0)
        self.settle()
        for s_, other, line in (('spring', 'autumn', "봄철 지구에서는 밤이 되는 쪽, 곧 태양 반대쪽에 봄철 별자리가 보여요."),
                                ('summer', 'winter', "여름철 지구에서는 여름철 별자리가 보여요. 겨울철 별자리는 태양과 같은 방향에 있어 태양 빛 때문에 볼 수 없어요.")):
            ne = self.earth_at(s_, on=True)
            vis = self.grp_box(s_, "vis")
            hid = self.grp_box(other, "hid")
            sub = f"{K.SEASON_KO[s_]}: 밤이 되는 쪽(태양 반대쪽)의 {o(K.SEASON_KO[s_] + '철 별자리')}가 보여요" if s_ == 'spring' \
                else f"여름: 겨울철 별자리는 {r('태양과 같은 방향')} → 안 보여요"
            self.say(sub, line)
            self.play(FadeOut(earths[s_]), FadeIn(ne), FadeOut(boxes[s_]), FadeIn(vis), FadeOut(boxes[other]), FadeIn(hid), run_time=0.8)
            earths[s_], boxes[s_], boxes[other] = ne, vis, hid
            self.settle()
            self.play(FadeOut(ne), FadeIn(self.earth_at(s_)), FadeOut(vis), FadeIn(self.grp_box(s_)),
                      FadeOut(hid), FadeIn(self.grp_box(other)), run_time=0.5)
        clear_stage(self)

    # ── 정리해요 ──
    def organize(self):
        self.section("정리해요")
        rows = [["같은 시각에 보이는 별자리는", f"계절에 따라 {g('달라져요')}"], ["그 까닭은 지구가", f"{o('공전')}하기 때문"],
                ["일 년 동안 달라지는 것은", f"지구의 {o('위치')}"]]
        tab = K.result_table(rows[0], rows[1:], [5.2, 4.8], row_h=0.9, size=32).move_to([0, 1.2, 0])
        self.say(f"지구가 {o('공전')}해서 {o('위치')}가 달라지면 보이는 별자리가 달라져요",
                 "같은 시각에 보이는 별자리는 계절에 따라 달라져요. 지구가 공전하기 때문에 일 년 동안 지구의 위치가 달라지기 때문이에요.")
        self.play(FadeIn(tab), run_time=0.7)
        note = K.text_card([f"대표 별자리가 그 계절에만 보이는 것은 아니에요.", f"독수리자리는 여름철에 가장 잘 보이지만 봄·가을에도 볼 수 있어요."],
                           w=12.4, size=30).move_to([0, -1.55, 0])
        self.say("독수리자리는 여름철에 가장 잘 보이지만 봄·가을에도 보여요",
                 "계절별 대표 별자리가 그 계절에만 보이는 것은 아니에요. 독수리자리는 여름철에 가장 잘 보이지만 봄철과 가을철에도 볼 수 있어요.")
        self.play(FadeIn(note), run_time=0.6)
        self.settle()
        clear_stage(self)
        dome = VGroup(Arc(radius=2.3, start_angle=0, angle=PI, fill_color=K.NIGHT, fill_opacity=1, stroke_color="#5A6A7A", stroke_width=6),
                      Line([-2.3, 0, 0], [2.3, 0, 0], stroke_color="#5A6A7A", stroke_width=6)).move_to([-3.5, 0.6, 0])
        st = K.bg_stars(-5.3, -1.7, 0.2, 1.6, n=22, seed=9, op=1.0)
        seats = VGroup(*[Rectangle(width=0.4, height=0.3, fill_color="#C2332C", fill_opacity=1, stroke_width=0).move_to([-5.2 + i * 0.57, -0.25, 0]) for i in range(7)])
        card = K.text_card([f"{o('천체 투영관')}: 돔 화면에 밤하늘 영상", "낮이든 비가 오든 별자리를 볼 수 있어요"], w=6.6, size=30).move_to([3.3, 0.6, 0])
        self.say(f"{o('천체 투영관')}에서는 날씨와 상관없이 밤하늘을 볼 수 있어요",
                 "돔 모양의 천체 투영관에서는 낮과 밤, 날씨에 상관없이 밤하늘 영상을 볼 수 있어요. 보호자와 함께 가 봐요.")
        self.play(FadeIn(dome), FadeIn(st), FadeIn(seats), FadeIn(card), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 지구의 운동 정리(u4-6) ──
    def motions(self):
        self.section("지구의 운동")
        bins = VGroup(K.bin_box("자전 때문에", 6.4, 3.3, "#2F6FD6", 32), K.bin_box("공전 때문에", 6.0, 3.3, GREEN, 32)).arrange(RIGHT, buff=0.3).move_to([0, 0.75, 0])
        a = VGroup(K.word_card("태양과 별이 하루 동안 동→서로", 5.8, 0.85, size=26),
                   K.word_card("낮과 밤이 하루에 한 번씩", 5.8, 0.85, size=26)).arrange(DOWN, buff=0.25).move_to(bins[0].box.get_center() + DOWN * 0.3)
        b_ = K.word_card("계절에 따라 별자리가 달라져요", 5.4, 0.85, size=26).move_to(bins[1].box.get_center() + DOWN * 0.3)
        self.say("지금까지 배운 현상을 지구의 운동으로 나누어 봐요",
                 "단원을 정리해요. 지금까지 배운 현상은 지구의 어떤 운동 때문일까요?")
        self.play(FadeIn(bins), run_time=0.5)
        self.settle()
        self.say(f"하루 동안의 하늘·낮과 밤은 {o('자전')}, 계절별 별자리는 {g('공전')}",
                 "하루 동안 태양과 별이 동쪽에서 서쪽으로 움직이는 것과 낮과 밤은 자전 때문이고, 계절에 따라 별자리가 달라지는 것은 공전 때문이에요.")
        self.play(FadeIn(a, lag_ratio=0.3), run_time=0.8)
        self.play(FadeIn(b_), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"지구의 공전으로 {o('계절')}에 따라", "밤하늘에 보이는 별자리가 달라집니다."], w=12.0, size=44).move_to([0, 0.6, 0])
        self.say(f"지구의 공전으로 {o('계절')}에 따라 별자리가 달라져요",
                 "지구의 공전으로 계절에 따라 밤하늘에 보이는 별자리가 달라집니다.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 확인해요 ──
    def check(self):
        self.section("확인해요")
        items = [("㉠ 계절마다 대표적인 별자리는 다르다.", True), ("㉡ 계절별 대표적인 별자리는 두 개이다.", False),
                 ("㉢ 봄철 대표적인 별자리는 가을철에는 보기 어렵다.", True), ("㉣ 계절별 대표적인 별자리는 지구의 자전으로 설명할 수 있다.", False)]
        cards = VGroup(*[K.word_card(t_, 11.4, 0.82, size=28) for t_, _ in items]).arrange(DOWN, buff=0.22).move_to([0.6, 0.75, 0])
        self.say("옳은 것을 모두 골라요", "계절별 대표적인 별자리에 관한 설명으로 옳은 것을 모두 골라요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.8)
        self.pause_screen(5, "옳은 것을 모두 골라요")
        marks = VGroup(*[K.ox_mark(ok, 0.26).next_to(c_, LEFT, buff=0.22) for c_, (_, ok) in zip(cards, items)])
        self.say(f"{g('㉠·㉢')} — 별자리가 달라지는 것은 {o('공전')}으로 설명해요",
                 "답은 ㉠과 ㉢이에요. 별자리는 많이 있고, 계절별 별자리가 달라지는 것은 자전이 아니라 공전으로 설명해요.")
        self.play(FadeIn(marks, lag_ratio=0.2), run_time=0.8)
        self.settle()
        clear_stage(self)
