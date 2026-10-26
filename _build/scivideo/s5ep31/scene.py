"""「과학 원리 돋보기」 5학년 31화 — 온도가 다른 두 물체가 만나면? (5-2 3단원 열과 우리 생활 3차시, 화 코드 5-2-3-b)

바탕: grade5/science/sem2/u3-2.html(원본 _build_tb/src2/u3-2.html) — 도입(갓 삶은 달걀과 찬물, 냉장고 물병과 손),
실험(원통 따뜻한 물·알루미늄 캔 차가운 물, 탐침 온도계 2개, 1분마다 — 지도서 예시 값 원통 45.0 → 18.9 °C, 캔 10.0 → 18.0 °C),
꺾은선그래프, 결과(따뜻한 물은 낮아지고 차가운 물은 높아짐, 온도가 높은 물체에서 낮은 물체로 열이 이동),
다른 모둠 결과(42.3 → 35.6, 24.1 → 35.2: 두 물체의 온도가 같아짐), 생활 속 열의 이동 6가지(손 → 얼음 오개념 포함),
한눈에 쏙(높은 물체는 낮아지고 낮은 물체는 높아짐), 손난로.
최종: ./make_final.sh s5ep31
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Transform, GrowArrow,
                   ValueTracker, always_redraw)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


HOT, COLD = K.HOT_T, K.COLD_T


class S5Ep31(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 31
    EP_TITLE = "온도가 다른 두 물체가 만나면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.graph()
        self.equal()
        self.life()
        self.summary()
        self.closing(f"열은 {o('온도가 높은 물체')}에서 {g('온도가 낮은 물체')}로 이동해요",
                     next_preview="5학년 32화 · 고체에서 열의 이동(전도)")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        bowl = K.cup("#A9D4F2", "찬물", w=3.0, h=1.8, level=0.75).move_to([0, 0.4, 0])
        egg = K.E(0.75, 0.95, "#FFF3D6", 0, 0.55, stroke="#C9A877", sw=4).move_to(bowl.get_center() + UP * 0.05)
        self.say("갓 삶은 달걀을 찬물에 넣으면 어떻게 될까요?",
                 "갓 삶은 뜨거운 달걀을 찬물에 넣으면 달걀과 물의 온도는 각각 어떻게 될까요?")
        self.play(FadeIn(bowl), FadeIn(egg, shift=DOWN * 0.5), run_time=0.8)
        self.pause_screen(4, "달걀과 물의 온도는?")
        a = T("달걀: 점점 식어요", 34, K.COLD).move_to([-3.6, -1.6, 0])
        b = T("물: 점점 미지근해져요", 34, "#C0392B").move_to([3.4, -1.6, 0])
        self.say(f"달걀은 점점 {o('식고')}, 물은 점점 {o('미지근해져요')}",
                 "뜨거웠던 달걀은 점점 식고, 차가웠던 물은 점점 미지근해져요. 왜 그럴까요? 실험으로 알아봐요.")
        self.play(FadeIn(a), FadeIn(b), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def experiment(self):
        self.section("실험해요")
        dev = K.cyl_can(HOT[0], COLD[0], w=4.2, h=2.8).move_to([-3.4, -0.65, 0])
        t1 = K.probe_thermo("45.0", probe=1.6, s=0.8)
        t1.shift([-4.85, -0.55, 0] - t1.get_bottom())
        t2 = K.probe_thermo("10.0", probe=1.6, s=0.8)
        t2.shift([-3.4, -0.75, 0] - t2.get_bottom())
        n1 = T("원통", 26, K.HOT).next_to(t1[1], LEFT, buff=0.15)
        n2 = T("캔", 26, K.COLD).next_to(t2[1], RIGHT, buff=0.15)
        self.say("따뜻한 물이 든 원통에 차가운 물이 든 캔을 넣어요",
                 "원통에는 따뜻한 물, 알루미늄 캔에는 차가운 물을 담아요. 캔을 원통에 넣고 뚜껑을 덮은 뒤, 구멍에 탐침 온도계를 하나씩 꽂아요.")
        self.play(FadeIn(dev), FadeIn(t1), FadeIn(t2), FadeIn(n1), FadeIn(n2), run_time=0.8)
        self.settle()
        safe = K.safety_note("실험복과 안전 장갑을 착용해요.\n따뜻한 물(40~50 °C)에 화상을 입지 않게 조심해요.",
                             w=6.4, size=26).move_to([3.4, 0.6, 0])
        labels = ["처음", "1분 뒤", "2분 뒤", "3분 뒤", "4분 뒤", "5분 뒤"]
        tb = K.result_table(["구분", "원통(°C)", "캔(°C)"],
                            [[labels[k], f"{HOT[k]:.1f}", f"{COLD[k]:.1f}"] for k in range(6)],
                            [1.9, 2.0, 2.0], row_h=0.56, size=26).move_to([3.4, 2.4, 0], aligned_edge=UP)
        boxes = [m for m in tb if m.__class__.__name__ == "Rectangle"]
        rows = [VGroup(*boxes[3 * i:3 * i + 3], *[c for c in tb.cells[i] if len(c.points) or len(c)]) for i in range(7)]
        self.say(f"처음 온도: 원통 {r('45.0 °C')}, 캔 {o('10.0 °C')}",
                 "처음 온도는 원통에 든 물이 45도, 캔에 든 물이 10도예요. 1분마다 두 물의 온도를 재요.")
        self.play(FadeIn(safe), run_time=0.5)
        self.settle()
        self.play(FadeOut(safe), FadeIn(rows[0]), FadeIn(rows[1]), run_time=0.6)
        self.pause_screen(5, "두 물의 온도는 어떻게 바뀔까요?")
        self.say("1분마다 두 물의 온도를 재요",
                 "1분, 2분, 3분… 1분마다 두 물의 온도를 재어 표에 적어요. 숫자가 어떻게 바뀌는지 잘 보세요.")
        prev = tb
        for i in range(1, 6):
            nd = K.cyl_can(HOT[i], COLD[i], w=4.2, h=2.8).move_to(dev)
            self.play(FadeIn(rows[i + 1]), Transform(dev, nd),
                      Transform(t1.txt, K.probe_txt(t1, f"{HOT[i]:.1f}")),
                      Transform(t2.txt, K.probe_txt(t2, f"{COLD[i]:.1f}")), run_time=0.7)
            self.wait(0.5)
        self.settle()
        self.say(f"원통의 물은 {r('낮아지고')}, 캔의 물은 {o('높아졌어요')}",
                 "원통의 물은 45도에서 18.9도로 낮아지고, 캔의 물은 10도에서 18도로 높아졌어요. 표의 온도는 지도서의 예시 값이에요.")
        self.play(Indicate(VGroup(*rows[1:]), scale_factor=1.04), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 그래프 ──
    def graph(self):
        self.section("그래프로 보기")
        gr = K.temp_graph(W=8.0, H=4.4).place([-2.6, 0.25, 0])
        self.say("온도 변화를 꺾은선그래프로 나타내요",
                 "온도 변화를 꺾은선그래프로 나타내요. 원통에 든 물은 빨간색, 알루미늄 캔에 든 물은 파란색이에요.")
        self.play(FadeIn(gr), run_time=0.6)
        self.play(Create(gr.hot), Create(gr.cold), run_time=2.0)
        self.settle()
        self.say("빨간 선은 내려가고, 파란 선은 올라가며 가까워져요",
                 "빨간 선은 점점 내려가고, 파란 선은 점점 올라가며 두 선이 가까워져요. 두 물의 온도가 왜 변했을까요?")
        self.play(Indicate(gr.hot, color=K.HOT, scale_factor=1.03), Indicate(gr.cold, color=K.COLD, scale_factor=1.03),
                  run_time=1.2)
        self.pause_screen(5, "두 물의 온도가 변한 까닭은?")
        dev = K.cyl_can(32, 14, w=3.4, h=2.6, arrows=True).move_to([4.7, 0.6, 0])
        cap = K.lines("따뜻한 물 → 캔 속\n차가운 물", 26, K.HEAT).next_to(dev, DOWN, buff=0.2)
        self.say(f"{r('온도가 높은 물체')}에서 {o('온도가 낮은 물체')}로 {g('열')}이 이동했어요",
                 "온도가 높은 물체에서 온도가 낮은 물체로 열이 이동했기 때문이에요. 차가운 기운이 이동한 것이 아니에요.")
        self.play(FadeIn(dev), FadeIn(cap), run_time=0.7)
        self.play(*[GrowArrow(a) for a in dev.arrows], run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 온도가 같아짐 ──
    def equal(self):
        self.section("시간이 더 지나면")
        H2 = [42.3, 38.6, 36.5, 36.1, 35.8, 35.6]
        C2 = [24.1, 30.6, 34.7, 34.9, 35.1, 35.2]
        gr = K.temp_graph(H2, C2, W=8.0, H=4.4).place([-2.6, 0.25, 0])
        src = K.lines("다른 모둠의 결과\n(지도서 추가 예시)", 26, SOFT).move_to([4.4, 1.7, 0])
        self.say("다른 모둠의 결과예요. 두 선이 어떻게 되나요?",
                 "다른 모둠의 결과예요. 원통의 물은 42.3도에서 35.6도로, 캔의 물은 24.1도에서 35.2도로 변했어요.")
        self.play(FadeIn(gr), FadeIn(src), run_time=0.6)
        self.play(Create(gr.hot), Create(gr.cold), run_time=1.8)
        self.settle()
        card = K.text_card([f"시간이 충분히 지나면", f"두 물체의 온도가 {g('같아져요')}"], w=5.0, size=36).move_to([4.3, 0.2, 0])
        self.say(f"시간이 충분히 지나면 두 물체의 온도가 {g('같아져요')}",
                 "시간이 충분히 지나면 두 물체의 온도는 같아져요. 시간이 지날수록 두 물의 온도 차이는 작아져요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 열의 이동 ──
    def life(self):
        self.section("생활 속 열의 이동")
        pairs = [("손난로", "손"), ("갓 삶은 면", "얼음물"), ("뜨거운 이마", "냉각 시트"), ("생선", "얼음")]
        rows = VGroup()
        for a, b in pairs:
            ca = K.word_card(a, 2.3, 0.85, "#C0392B", 30)
            cb = K.word_card(b, 2.3, 0.85, K.COLD, 30)
            ar = K.heat_arrow((0, 0), (0.8, 0))
            rows.add(VGroup(ca, ar, cb).arrange(RIGHT, buff=0.2))
        rows.arrange_in_grid(2, 2, buff=(0.7, 0.4)).move_to([0, 1.3, 0])
        self.say(f"열은 언제나 {r('높은 쪽')}에서 {o('낮은 쪽')}으로 이동해요",
                 "손난로에서 손으로, 갓 삶은 면에서 얼음물로, 뜨거운 이마에서 냉각 시트로, 생선에서 얼음으로 열이 이동해요.")
        self.play(FadeIn(rows, lag_ratio=0.2), run_time=1.2)
        self.settle()
        q = VGroup(K.word_card("손", 2.2, 0.85, "#C0392B", 32), K.heat_arrow((0, 0), (1.4, 0)),
                   K.word_card("얼음", 2.2, 0.85, K.COLD, 32)).arrange(RIGHT, buff=0.3).move_to([-3.4, -1.25, 0])
        note = K.lines("얼음의 냉기가 손으로 오는 것이 아니라\n손에서 얼음으로 열이 이동해요", 28, INK)
        note.next_to(q, RIGHT, buff=0.6)
        self.say(f"얼음을 만지면 {g('손에서 얼음으로')} 열이 이동해요",
                 "얼음을 만지면 차갑게 느끼지요? 얼음의 냉기가 손으로 오는 것이 아니라 손에서 얼음으로 열이 이동한 거예요.")
        self.play(FadeIn(q), FadeIn(note), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"온도가 다른 두 물체가 접촉하면",
                            f"온도가 높은 물체의 온도는 점점 {r('낮아지고')},",
                            f"온도가 낮은 물체의 온도는 점점 {o('높아집니다')}."], w=11.6, size=38).move_to([0, 0.9, 0])
        self.say(f"높은 물체는 {r('낮아지고')}, 낮은 물체는 {o('높아져요')}",
                 "온도가 다른 두 물체가 접촉하면 온도가 높은 물체의 온도는 점점 낮아지고, 온도가 낮은 물체의 온도는 점점 높아져요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        more = K.text_card([f"손난로를 쥐면 손이 따뜻해져요 → {g('손난로에서 손으로')} 열이 이동"], size=32).move_to([0, -1.35, 0])
        self.say(f"손난로를 쥐면 {g('손난로에서 손으로')} 열이 이동해요",
                 "손난로를 손에 쥐면 손이 따뜻해지는 까닭은 뜨거운 손난로에서 손으로 열이 이동하기 때문이에요.")
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
