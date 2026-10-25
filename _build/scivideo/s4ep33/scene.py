"""「과학 원리 돋보기」 4학년 33화 — 기후변화가 생활과 환경에 주는 영향 (4-2 4단원 4~5차시, 화 코드 4-2-4-c)

바탕: grade4/science/sem2/u4-3.html(원본 _build_tb/src2/u4-3.html) — 도입(미국 글레이셔 국립 공원 1910년·2021년, 사진 대신
그린 그림: 빙하가 거의 사라짐 / 녹은 물은 강이나 바다로), 해수면 상승 피해 모형실험(준비물, 자갈 = 육지·물 = 바닷물, 자갈은
한쪽으로만 비스듬히, 섬 모형 → 물 조금·높이 표시 → 집·나무 모형, 물을 한 컵씩 세 번: 관찰 표, 안전), 자갈 면적이 줄어듦,
모형과 실제 잇기, 해수면 상승률(국립해양조사원, 1991~2000년 3.80 mm/년 → 2011~2020년 4.27 mm/년, 약 10% 빨라짐), 해수면
상승의 영향, 여러 가지 영향 잇기(폭염·산불·태풍·식량·멸종), 만화 소개의 '실천을 계속하면 해결할 수 있어요',
한눈에 쏙(빙하와 언 땅이 녹으면서 해수면이 상승).
최종: ./make_final.sh s4ep33
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowFromEdge, Indicate, Transform, VGroup, Arrow, Line)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def BL(s):
    return f'<span foreground="{BLUE}">{s}</span>'


OBS = {  # 앱 u4-3 OB — 물을 한·두·세 컵 부었을 때
    "섬": ["절반 정도 물에 잠겼어요", "이전보다 더 많이 잠겼어요", "거의 다 물에 잠겼어요"],
    "집": ["아랫부분이 잠기기 시작했어요", "창문이 물에 잠겼어요", "지붕 아래까지 잠겼어요"],
    "나무": ["아랫부분이 잠기기 시작했어요", "중간 부분까지 잠겼어요", "거의 다 물에 잠겼어요"],
}


class S4Ep33(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 33
    EP_TITLE = "기후변화가 생활과 환경에 주는 영향"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.lab()
        self.real()
        self.effects()
        self.summary()
        self.closing(f"기후변화로 빙하와 언 땅이 녹으면서 {r('해수면')}이 상승해요\n알리고 실천하면 {g('함께 해결할 수 있어요')}",
                     next_preview="4학년 34화 · 기후변화에 어떻게 대응할까?")
        self.wait(0.5)

    # ── 궁금해요: 빙하 ──
    def intro(self):
        self.section("궁금해요")
        a = K.glacier_scene(True, 5.6)
        b = K.glacier_scene(False, 5.6)
        ta = T("1910년", 34, BLUE)
        tb = T("2021년", 34, RED)
        ga, gb = VGroup(a, ta), VGroup(b, tb)
        ta.next_to(a, UP, buff=0.15)
        tb.next_to(b, UP, buff=0.15)
        VGroup(ga, gb).arrange(RIGHT, buff=0.7).move_to([0, 0.55, 0])
        cap = T("미국 글레이셔 국립 공원 · 사진 대신 그린 그림이에요", 24, SOFT).move_to([0, -2.15, 0])
        self.say("옛날과 지금, 무엇이 달라졌을까요?",
                 "미국 글레이셔 국립 공원의 옛날 모습과 지금 모습이에요. 무엇이 달라졌을까요?")
        self.play(FadeIn(ga), FadeIn(cap), run_time=0.6)
        self.play(FadeIn(gb), run_time=0.6)
        self.settle()
        self.say(f"빙하가 거의 {r('사라지고 흔적만')} 남았어요",
                 "커다란 빙하가 거의 사라지고 흔적만 남았어요.")
        self.play(Indicate(b, color=RED, scale_factor=1.04), run_time=0.8)
        self.settle()
        self.say(f"녹은 빙하의 물은 {o('어디로')} 갈까요?",
                 "극지방이나 육지에 있는 빙하가 녹으면 그 물은 어디로 갈까요?")
        self.pause_screen(5, "녹은 물은 어디로 갈까요?")
        self.say(f"{BL('강이나 바다')}로 흘러들어요",
                 "강이나 바다로 흘러들어요. 그러면 어떤 일이 생길지 모형실험으로 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 해수면 상승 피해 모형실험 ──
    def lab(self):
        self.section("모형실험")
        st = K.SeaTank(s=0.016, cx=-0.7, cy=1.15)
        box, grav = st.box(), st.gravel()
        isl, hs, tr = st.island(), st.house(), st.tree()
        prep = K.text_card([f"{o('준비물')}  투명한 아크릴 상자, 자갈, 물, 모형(섬, 집, 나무), 플라스틱 컵, 유성펜"],
                           w=12.8, size=28).move_to([0, -1.55, 0])
        self.say("해수면 상승 피해 모형실험 장치를 만들어요",
                 "해수면 상승 피해 모형실험 장치를 만들어요.")
        self.play(FadeIn(box), FadeIn(prep), run_time=0.6)
        self.play(FadeIn(grav, shift=UP * 0.2), run_time=0.8)
        lg = T("자갈 = 육지", 30, "#7A5A30").move_to(st.p(600, 352))
        self.say(f"자갈은 상자의 {o('한쪽으로만')} 비스듬히 쌓아요",
                 "자갈은 상자의 한쪽으로만 비스듬히 쌓아요. 자갈은 육지를 나타내요.")
        self.play(FadeIn(lg), run_time=0.4)
        self.settle()
        w0 = st.water(st.LV[0])
        m0 = st.mark(st.LV[0], "처음")
        self.play(FadeIn(isl), run_time=0.5)
        lw = T("물 = 바닷물", 30, "#1C6FA8").move_to(st.p(200, 352))
        self.play(FadeIn(w0), FadeIn(lw), run_time=0.6)
        self.play(FadeIn(m0), run_time=0.4)
        self.say(f"섬 모형을 놓고 물을 조금 부어 {o('물의 높이')}를 표시해요",
                 "섬 모형을 놓고, 물을 조금 부은 뒤 물의 높이를 유성펜으로 표시해요. 물은 바닷물을 나타내요.")
        self.settle()
        self.play(FadeIn(hs), FadeIn(tr), run_time=0.6)
        self.say("물가보다 조금 위에 집과 나무 모형을 놓아요",
                 "자갈과 물이 맞닿은 곳보다 조금 위에 집 모형과 나무 모형을 놓아요.")
        self.settle()
        # 관찰
        safe = K.safety_note("물이 든 컵을 쏟지 않게 조심하고, 물의 높이는 눈높이를 맞춰 표시해요", w=12.8, size=28).move_to([0, -1.55, 0])
        self.play(FadeOut(prep), FadeIn(safe), run_time=0.4)
        self.say("물을 한 컵씩 천천히 부으며 관찰해요",
                 "이제 물을 한 컵씩 천천히 부으며 모형의 변화를 관찰해요. 컵을 쏟지 않게 조심해요.")
        self.settle()
        self.play(FadeOut(safe), run_time=0.3)
        self.pause_screen(5, "모형은 어떻게 될까요?")
        water = w0
        self.bring_to_front(water, m0)
        boxes = None
        for k in range(1, 4):
            new = st.water(st.LV[k])
            cnt = T(f"물 {k}컵", 34, BLUE).move_to(st.p(400, 128))
            self.play(Transform(water, new), FadeIn(cnt), run_time=1.2)
            self.play(FadeIn(st.mark(st.LV[k], f"{k}컵")), run_time=0.3)
            nb = VGroup()
            for n in ("섬", "집", "나무"):
                b = K.R(4.1, 1.15, PAPER, rad=0.16, stroke=SOFT, sw=4)
                t1 = T(f"{n} 모형", 26, ORANGE)
                t2 = T(OBS[n][k - 1], 24)
                if t2.width > 3.85:
                    t2.scale_to_fit_width(3.85)
                VGroup(t1, t2).arrange(DOWN, buff=0.1).move_to(b)
                nb.add(VGroup(b, t1, t2))
            nb.arrange(RIGHT, buff=0.2).move_to([0, -1.55, 0])
            if boxes is None:
                self.play(FadeIn(nb), run_time=0.4)
                boxes = nb
            else:
                self.play(Transform(boxes, nb), run_time=0.4)
            if k == 1:
                self.say("섬은 절반쯤, 집과 나무는 아랫부분이 잠겼어요",
                         "한 컵을 부으니 섬 모형은 절반 정도, 집과 나무 모형은 아랫부분이 잠기기 시작했어요.")
            elif k == 2:
                self.say("섬은 더 많이 잠기고, 집은 창문까지 잠겼어요",
                         "두 컵을 부으니 섬은 더 많이, 집은 창문이, 나무는 중간까지 잠겼어요.")
            else:
                self.say(f"섬과 나무는 {r('거의 다')}, 집은 지붕 아래까지",
                         "세 컵을 부으니 섬과 나무 모형은 거의 다, 집 모형은 지붕 아래까지 잠겼어요.")
            self.settle()
            self.play(FadeOut(cnt), run_time=0.2)
        # 자갈 면적
        d0 = st.dry_line(st.LV[0])
        self.play(Create(d0), run_time=0.6)
        d3 = st.dry_line(st.LV[3])
        self.say(f"물에 닿지 않는 자갈의 면적이 {r('점점 줄어들었어요')}",
                 "물의 높이가 점점 높아지면서 물에 닿지 않는 자갈의 면적이 점점 줄어들었어요.")
        self.play(Transform(d0, d3), run_time=1.0)
        self.settle()
        clear_stage(self)
        # 모형과 실제
        self.section("모형과 실제")
        pairs = [("물", "바닷물"), ("자갈", "육지"), ("섬 모형", "바다 위의 섬"),
                 ("집 모형", "바닷가 마을(사람이 사는 곳)"), ("나무 모형", "바닷가에 사는 생물의 터전")]
        rows = VGroup()
        for a, b in pairs:
            la = K.R(2.9, 0.78, PAPER, rad=0.14, stroke=BLUE, sw=4)
            ta = T(a, 30).move_to(la)
            lb = K.R(6.4, 0.78, PAPER, rad=0.14, stroke=GREEN, sw=4)
            tb = T(b, 30).move_to(lb)
            row = VGroup(VGroup(la, ta), VGroup(lb, tb)).arrange(RIGHT, buff=1.4)
            ar = Arrow(row[0].get_right(), row[1].get_left(), buff=0.12, color=SOFT, stroke_width=5, max_tip_length_to_length_ratio=0.25)
            rows.add(VGroup(row, ar))
        rows.arrange(DOWN, buff=0.18).move_to([0, 0.45, 0])
        self.say("모형은 실제로 무엇을 나타낼까요?", "모형실험의 모형은 실제로 무엇을 나타낼까요?")
        for rw in rows:
            self.play(FadeIn(rw[0][0]), Create(rw[1]), FadeIn(rw[0][1]), run_time=0.45)
        self.say(f"해수면이 높아지면 {r('바닷가 마을과 생물의 터전')}이 잠겨요",
                 "실제로 해수면이 높아지면 바닷가 마을과 바닷가 생물의 터전이 물에 잠기고, 사람과 동식물이 살 수 있는 육지가 줄어들 거예요.")
        self.settle()
        clear_stage(self)

    # ── 실제로 해수면이 높아지고 있어요 ──
    def real(self):
        self.section("해수면 상승")
        ch = K.bar_chart([3.80, 4.27], ["1991~2000년", "2011~2020년"], vmax=5, step=1, w=4.6, h=3.3, col=BLUE,
                         ylabel="연평균 해수면 상승률(mm/년)").move_to([-3.6, 0.45, 0])
        ch.vals[0].become(T("3.80", 32).next_to(ch.bars[0], UP, buff=0.1))
        ch.vals[1].become(T("4.27", 32).next_to(ch.bars[1], UP, buff=0.1))
        src = T("자료: 국립해양조사원(「과학」 93쪽)", 22, SOFT).next_to(ch, DOWN, buff=0.2)
        self.say("실제로 해수면이 높아지고 있어요",
                 "실제로 해수면이 높아지고 있어요. 국립해양조사원의 자료예요.")
        self.play(FadeIn(VGroup(ch.grid, ch.axis, ch.labels, ch[-1])), FadeIn(src), run_time=0.5)
        self.play(GrowFromEdge(ch.bars[0], DOWN), FadeIn(ch.vals[0]), run_time=0.5)
        self.play(GrowFromEdge(ch.bars[1], DOWN), FadeIn(ch.vals[1]), run_time=0.5)
        self.say(f"해수면이 높아지는 빠르기가 {r('약 10% 빨라졌어요')}",
                 "2011년부터 2020년까지의 연평균 해수면 상승 속도는 4.27 밀리미터로, 1991년부터 2000년까지보다 약 10퍼센트 빨라졌어요.")
        self.settle()
        eff = K.text_card([f"해수면이 상승하면?",
                           f"해안가가 물에 잠겨 {r('육지 면적')}이 줄어요",
                           f"해안 생태계가 파괴되어",
                           f"많은 {r('생물')}이 위험에 처해요"], w=6.6, size=32).move_to([3.4, 0.5, 0])
        eff[1][0].set_color(ORANGE)
        self.play(FadeIn(eff), run_time=0.6)
        self.say(f"사람과 동식물이 살 {r('육지')}가 줄고 {r('생물')}이 위험해요",
                 "해수면이 상승하면 해안가가 물에 잠겨 사람과 동식물이 살 수 있는 육지 면적이 줄고, 해안 생태계가 파괴되어 많은 생물이 위험에 처해요.")
        self.settle()
        clear_stage(self)

    # ── 여러 가지 영향 ──
    def effects(self):
        self.section("여러 가지 영향")
        items = [(K.weather_pic("폭염", 1.4), "폭염이 길어져요", "사람들의 건강을 해칠 수 있어요"),
                 (K.fire(1.0), "기온이 오르고 숲이 건조해져요", "산불이 자주 발생해요"),
                 (K.rain_cloud(1.4), "바닷물의 온도가 높아져요", "태풍이 자주 생기고 바다 생태계가 파괴돼요"),
                 (K.cracked_land(1.6), "오랜 가뭄이 이어져요", "식량이 부족해져요"),
                 (K.forest(3, 1.6, 0.7), "기후변화에 적응하지 못해요", "동물이 멸종 위기에 처해요")]
        rows = VGroup()
        for p, a, b in items:
            pic = K.fit(p, 1.0, 0.75)
            ta = T(a, 28)
            tb = T(b, 28, RED)
            ar = Arrow(LEFT * 0.4, RIGHT * 0.4, buff=0, color=SOFT, stroke_width=5, max_tip_length_to_length_ratio=0.35)
            row = VGroup(pic, ta, ar, tb).arrange(RIGHT, buff=0.3)
            rows.add(row)
        rows.arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([0, 0.4, 0])
        # 화살표 열을 맞춤
        xa = max(rw[1].get_right()[0] for rw in rows) + 0.3
        for rw in rows:
            rw[2].move_to([xa + 0.4, rw[1].get_center()[1], 0])
            rw[3].next_to(rw[2], RIGHT, buff=0.3)
        if rows.width > 13.2:
            rows.scale_to_fit_width(13.2)
        rows.move_to([0, 0.4, 0])
        self.say("기후변화는 해수면 상승 말고도 여러 영향을 줘요",
                 "기후변화는 해수면 상승 말고도 우리 생활과 환경에 여러 가지 영향을 줘요.")
        for rw in rows:
            self.play(FadeIn(rw[0]), FadeIn(rw[1]), run_time=0.3)
            self.play(Create(rw[2]), FadeIn(rw[3], shift=RIGHT * 0.2), run_time=0.4)
        self.say(f"건강, 산불, 태풍, {r('식량 부족')}, {r('멸종 위기')}",
                 "폭염은 건강을 해치고, 산불과 태풍이 자주 생기고, 식량이 부족해지고, 동물이 멸종 위기에 처할 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["기후변화로 극지방과 육지의 빙하, 언 땅이",
                            f"녹으면서 {g('해수면')}이 상승하고 있습니다."], w=12.4, size=44).move_to([0, 1.4, 0])
        self.say(f"빙하와 언 땅이 녹으면서 {g('해수면')}이 상승해요",
                 "기후변화로 극지방과 육지의 빙하, 언 땅이 녹으면서 해수면이 상승하고 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        hope = K.text_card([f"기후변화는 심각한 문제이지만,",
                            f"여러 사람에게 {g('알리고')} 대응하기 위한 {g('실천을 계속')}하면",
                            f"{g('문제를 해결할 수 있어요')}"], w=11.6, size=34, stroke=GREEN).move_to([0, -0.85, 0])
        self.play(FadeIn(hope, shift=UP * 0.2), run_time=0.6)
        self.say(f"알리고 실천하면 {g('문제를 해결할 수 있어요')}",
                 "기후변화는 전 세계적으로 심각한 문제이지만, 여러 사람에게 알리고 대응하기 위한 실천을 계속한다면 문제를 해결할 수 있어요.")
        self.settle()
        clear_stage(self)
