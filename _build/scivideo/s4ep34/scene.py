"""「과학 원리 돋보기」 4학년 34화 — 기후변화에 어떻게 대응할까? (4-2 4단원 6차시, 화 코드 4-2-4-d)

바탕: grade4/science/sem2/u4-4.html(원본 _build_tb/src2/u4-4.html) — 도입(녹색 장벽 프로젝트, 「과학」 96쪽: 숲을 보존해야 하는
까닭 3가지), 왜 대응할까(대응에 따라 지구의 모습은 달라질 수 있어요), 국가·사회의 대응(자연환경 보존, 더위·추위 쉼터처럼
적응하도록 대비, 과대 포장·일회용품 규제, 바람·물·태양 빛의 친환경 에너지, 친환경 자동차, 파리 협정(2016년부터 효력)·
녹색 장벽 같은 국제 협력), 생활 속 실천(에너지·물·쓰레기·폭염 대비 네 묶음, 그린슈머), 누가 하는 노력(국가·사회 / 우리,
대응하도록 요구할 수도 있어요), 한눈에 쏙(숲을 보존하고 친환경 기술을 개발합니다), 미래 모습 상상.
최종: ./make_final.sh s4ep34
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Arrow)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def icard(pic, text, w=3.0, h=2.9, stroke=SOFT, size=25):
    box = K.R(w, h, PAPER, rad=0.18, stroke=stroke, sw=5)
    p = K.fit(pic, w - 0.8, h * 0.45).move_to(box.get_top() + DOWN * h * 0.3)
    t = K.lines(text, size)
    if t.width > w - 0.25:
        t.scale_to_fit_width(w - 0.25)
    t.move_to(box.get_bottom() + UP * h * 0.24)
    return VGroup(box, p, t)


class S4Ep34(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 34
    EP_TITLE = "기후변화에 어떻게 대응할까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.nation()
        self.us()
        self.who()
        self.summary()
        self.closing(f"{g('숲을 보존')}하고 {g('친환경 기술')}을 개발해요\n우리도 {o('작은 실천')}부터 꾸준히 해요",
                     next_preview="4학년 마인드맵 7 · 기후변화와 우리 생활")
        self.wait(0.5)

    # ── 궁금해요: 녹색 장벽 ──
    def intro(self):
        self.section("궁금해요")
        wall = K.green_wall(9.0).move_to([0, 0.9, 0])
        cap = T("녹색 장벽 — 사막에 숲을 만들어요(「과학」 96쪽)", 28, SOFT).next_to(wall, DOWN, buff=0.2)
        self.say("아프리카 사막에 여러 나라가 함께 숲을 만들어요",
                 "아프리카 사막 지역에 여러 나라가 함께 거대한 숲의 장벽을 만들어 기후변화에 대응하고 있어요. 녹색 장벽 프로젝트예요.")
        self.play(FadeIn(wall[:3]), FadeIn(cap), run_time=0.6)
        self.play(FadeIn(wall[3], lag_ratio=0.1), run_time=1.2)
        self.settle()
        self.say(f"숲을 {o('보존')}해야 하는 까닭은 무엇일까요?", "숲을 보존해야 하는 까닭은 무엇일까요?")
        self.pause_screen(5, "숲을 보존해야 하는 까닭은?")
        why = K.text_card([f"지구의 {g('평균 기온이 높아지는 것')}을 막아 줘요",
                           f"많은 {g('생물이 살아가는 터전')}이 돼요",
                           f"비가 많이 와도 {g('홍수 피해')}를 막는 데 도움이 돼요"], w=10.6, size=32, stroke=GREEN).move_to([0, -1.25, 0])
        self.play(FadeOut(cap), wall.animate.shift(UP * 0.55), run_time=0.4)
        self.play(FadeIn(why), run_time=0.6)
        self.say(f"기온 상승을 막고, {g('생물의 터전')}이 되고, 홍수 피해를 막아요",
                 "숲은 지구의 평균 기온이 높아지는 것을 막아 주고, 많은 생물의 터전이 되고, 홍수 피해를 막는 데에도 도움이 돼요.")
        self.settle()
        clear_stage(self)
        big = K.text_card([f"기후변화 문제는 심각하지만,",
                           f"우리가 {g('어떻게 대응하는지')}에 따라",
                           f"{g('지구의 모습은 달라질 수 있어요')}"], w=10.0, size=44, stroke=GREEN).move_to([0, 0.5, 0])
        self.say(f"어떻게 대응하는지에 따라 {g('지구의 모습')}은 달라져요",
                 "기후변화 현상으로 나타나는 문제가 심각하지만, 우리가 어떻게 대응하는지에 따라 지구의 모습은 달라질 수 있어요.")
        self.play(FadeIn(big, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 국가·사회의 대응 ──
    def nation(self):
        self.section("국가·사회의 대응")
        kw = dict(w=3.95, h=2.5, size=24)
        cards = VGroup(
            icard(K.forest(4, 2.4, 1.0), "숲, 갯벌 같은\n자연환경을 보존해요", **kw),
            icard(VGroup(K.solar_panel(1.5), K.turbine(1.3)).arrange(RIGHT, buff=0.2), "바람, 물, 태양 빛을 이용한\n친환경 에너지를 개발해요", **kw),
            icard(K.eco_car(1.6), "친환경 자동차를\n만드는 기술을 개발해요", **kw),
            icard(K.shelter(), "더위·추위 쉼터처럼\n적응할 수 있게 대비해요", **kw),
            icard(K.boxes(3), "과대 포장·일회용품을\n줄이도록 규제해요", **kw),
            icard(K.WorldMap(3.0), "여러 나라가 협력해요\n(파리 협정, 2016년부터 효력)", **kw),
        ).arrange_in_grid(rows=2, cols=3, buff=(0.3, 0.25)).move_to([0, -0.05, 0])
        self.say("국가나 사회는 기후변화에 어떻게 대응하고 있을까요?",
                 "국가나 사회는 기후변화에 어떻게 대응하고 있을까요?")
        self.play(FadeIn(cards[0]), run_time=0.4)
        self.say(f"자연환경을 {g('보존')}하고 {g('친환경 기술')}을 개발해요",
                 "숲과 갯벌 같은 자연환경을 보존하고, 바람, 물, 태양 빛 같은 자연의 힘을 이용한 친환경 에너지와 친환경 자동차를 만드는 기술을 개발해요.")
        self.play(FadeIn(cards[1]), run_time=0.4)
        self.play(FadeIn(cards[2]), run_time=0.4)
        self.settle()
        self.play(FadeIn(cards[3]), FadeIn(cards[4]), run_time=0.5)
        self.say(f"사람들이 {o('적응')}할 수 있도록 대비하고 일회용품을 줄여요",
                 "폭염이나 홍수 같은 현상에 사람들이 적응할 수 있도록 쉼터를 만들어 대비하고, 과대 포장과 일회용품을 줄이도록 규제해요.")
        self.settle()
        self.play(FadeIn(cards[5]), run_time=0.4)
        self.say(f"여러 나라가 {o('함께 협력')}해요",
                 "여러 나라가 협력해 지구 기온의 상승 폭을 줄이기로 약속했어요. 2016년부터 효력이 생긴 파리 협정이에요. 녹색 장벽도 국제 협력이에요.")
        self.settle()
        clear_stage(self)

    # ── 우리가 생활 속에서 실천할 수 있는 일 ──
    def us(self):
        self.section("생활 속 실천")
        self.say(f"우리는 생활 속에서 {g('무엇을 실천')}할 수 있을까요?",
                 "그렇다면 우리는 생활 속에서 무엇을 실천할 수 있을까요?")
        self.pause_screen(5, "우리가 할 수 있는 일은?")
        groups = [("에너지 사용 줄이기", ORANGE, [(K.bike(1.4), "가까운 곳은 걷거나\n자전거를 타요"), (K.plug(True), "쓰지 않는 플러그는\n뽑아 둬요")]),
                  ("물 절약하기", BLUE, [(K.tooth_cup(), "양치할 때\n양치 컵을 써요")]),
                  ("쓰레기 줄이기", GREEN, [(K.tumbler(), "일회용품 대신\n다회용기를 써요"), (K.R(1.2, 1.2, "#E9F6E1", stroke=GREEN), "환경 마크가 있는\n제품을 골라요")]),
                  ("폭염에 대비하기", RED, [(K.sun_hot(0.5), "야외 활동을 줄이고\n물을 자주 마셔요")])]
        cols = VGroup()
        for name, col, its in groups:
            head = T(name, 28, col)
            cs = VGroup(*[icard(p, t, w=3.0, h=2.15, stroke=col, size=22) for p, t in its]).arrange(DOWN, buff=0.18)
            cols.add(VGroup(head, cs).arrange(DOWN, buff=0.18))
        cols.arrange(RIGHT, buff=0.25, aligned_edge=UP)
        if cols.height > 5.1:
            cols.scale_to_fit_height(5.1)
        cols.move_to([0, 0.0, 0])
        # 환경 마크 칸 안에 표시
        mk = cols[2][1][1][1]
        mk.add(T("환경\n마크", 20, GREEN).move_to(mk))
        texts = ["가까운 곳은 걷거나 자전거를 타고, 쓰지 않는 플러그는 뽑아서 에너지 사용을 줄여요.",
                 "양치할 때 양치 컵을 써서 물을 아껴요.",
                 "일회용품 대신 다회용기를 쓰고, 환경 마크가 있는 제품을 골라 쓰레기를 줄여요. 이렇게 환경에 도움이 되는 제품을 사는 소비자를 그린슈머라고 해요.",
                 "폭염인 날에는 야외 활동을 줄이고 물을 자주 마시며 대비해요."]
        subs = [f"{o('에너지')} 사용 줄이기", f"{BL('물')} 절약하기", f"{g('쓰레기')} 줄이기 · 그린슈머", f"{r('폭염')}에 대비하기"]
        for c, s, n in zip(cols, subs, texts):
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.5)
            self.say(s, n)
        self.settle()
        clear_stage(self)

    # ── 누가 하는 노력일까? ──
    def who(self):
        self.section("함께 노력해요")
        left = K.text_card([f"{BL('국가·사회')}", "자연환경 보존", "친환경 기술 개발", "폭염·홍수에 적응하도록 대비"], w=5.9, size=32, stroke=BLUE)
        right = K.text_card([f"{g('우리')}", "걷기·자전거 이용", "전기 아껴 쓰기", "일회용품 적게 쓰기"], w=5.9, size=32, stroke=GREEN)
        VGroup(left, right).arrange(RIGHT, buff=0.5, aligned_edge=UP).move_to([0, 0.9, 0])
        self.say(f"{BL('국가·사회')}도, {g('우리')}도 함께 노력해요",
                 "기후변화에 대응하려면 국가와 사회, 그리고 우리 모두의 노력이 필요해요.")
        self.play(FadeIn(left), FadeIn(right), run_time=0.7)
        self.settle()
        more = M(f"관심을 가지고 국가와 사회가 대응하도록 {g('요구')}할 수도 있어요", 32).move_to([0, -1.6, 0])
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.5)
        self.say(f"국가와 사회가 대응하도록 {g('요구')}할 수도 있어요",
                 "우리는 기후위기에 관심을 가지고, 국가와 사회가 대응하도록 요구하는 등 적극적으로 행동할 수도 있어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 + 미래 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["기후변화에 대응하기 위해 숲을 보존하고",
                            f"{g('친환경')} 기술을 개발합니다."], w=12.0, size=46).move_to([0, 1.5, 0])
        self.say(f"숲을 보존하고 {g('친환경')} 기술을 개발해요",
                 "기후변화에 대응하기 위해 숲을 보존하고 친환경 기술을 개발해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        fut = VGroup(icard(VGroup(K.tree(1.5, "#4FAE4F"), K.C(0.17, "#F4A63A", -0.2, 0.95), K.C(0.17, "#F4A63A", 0.25, 1.15)), "과수원에서\n열대 과일을 길러요", w=3.0, h=2.5, stroke=GREEN, size=22),
                     icard(K.flood_pic(), "인공지능으로 홍수에\n안전하게 대응해요", w=3.0, h=2.5, stroke=GREEN, size=22),
                     icard(K.shelter(), "더위·추위를 피하는\n쉼터가 많아져요", w=3.0, h=2.5, stroke=GREEN, size=22),
                     icard(K.eco_car(1.6), "홍수에 대비하는\n튜브 자동차가 나와요", w=3.0, h=2.5, stroke=GREEN, size=22)).arrange(RIGHT, buff=0.25).move_to([0, -1.05, 0])
        self.play(FadeIn(fut, lag_ratio=0.2), run_time=1.0)
        self.say(f"대응하고 {g('적응')}하며 살아가는 미래를 상상해 봐요",
                 "기후변화에 대응하고 적응하며 살아가는 미래의 모습을 상상해 봐요. 작은 행동부터 꾸준히 실천하면 지구의 모습을 바꿀 수 있어요.")
        self.settle()
        clear_stage(self)


def BL(s):
    return f'<span foreground="{BLUE}">{s}</span>'
