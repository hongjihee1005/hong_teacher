"""나눗셈 영상 공통 장면 — (두 자리 수) ÷ (한 자리 수)를 수모형과 세로셈으로

    board = DivBoard(scene, 70, 5, who="모둠", item="빈 병")
    board.show_number()      # 70 → 십 모형 7개
    board.show_plates()      # 묶음(접시) 5개
    board.deal_tens()        # 십 모형을 한 묶음에 몫만큼
    board.exchange()         # 남은 십 모형 → 일 모형 (핵심 장면)
    board.deal_ones()        # 일 모형 나누기
    board.show_result()      # 한 묶음 = 14
    board.clear()

    long_division(scene, 70, 5)   # 세로셈 + 오른쪽 작은 수모형(같은 색으로 이어 보기)

1화(42 ÷ 3)에서 만든 장면을 수만 바꾸어 쓸 수 있게 일반화한 것입니다(1화 파일은 그대로 둠).
자막·나레이션 문장도 수에 맞춰 만들어집니다. 화면 배치는 묶음 수(나누는 수) 2~6에 맞춰 저절로 정해집니다.
"""
import numpy as np
from manim import (
    DOWN, LEFT, PI, RIGHT, UP,
    ArcBetweenPoints, Circumscribe, Create, CurvedArrow, FadeIn, FadeOut, Group, Indicate,
    LaggedStart, Line, Rectangle, RoundedRectangle, SurroundingRectangle, VGroup, Write,
)

from series_style import BG, BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, b, g, o
from base10 import (break_ten, grid_points, ones_slots_centered, plate, plate_slots,
                    ten_rod, unit_cube)


def has_final(n):
    """숫자를 읽을 때 끝소리에 받침이 있는지(영·일·삼·육·칠·팔·십·백 → 있음)"""
    last = n % 10
    return True if last == 0 else last in (1, 3, 6, 7, 8)


def j(n, pair):
    """숫자 뒤 조사: j(3, '을를') → '3을', j(2, '은는') → '2는', j(7, '으로') → '7로'"""
    if pair == "으로":
        return f"{n}{'로' if (n % 10 in (1, 7, 8) or not has_final(n)) else '으로'}"
    if pair == "이에요":
        return f"{n}{'이에요' if has_final(n) else '예요'}"
    return f"{n}{pair[0] if has_final(n) else pair[1]}"


def parts(a, d):
    t, u = divmod(a, 10)
    q1, r1 = divmod(t, d)
    n2 = r1 * 10 + u
    q2, rem = divmod(n2, d)
    return t, u, q1, r1, n2, q2, rem


def num_markup(n, size):
    t, u = divmod(n, 10)
    return M(f"{b(str(t))}{o(str(u))}" if t else o(str(u)), size)


def clear_stage(S, run_time=0.8):
    keep = {id(S._chip), id(S._sub), id(S._mark)}
    if S._sub is not None:
        keep |= {id(m) for m in S._sub}
    mobs = [m for m in S.mobjects if id(m) not in keep]
    if mobs:
        S.play(FadeOut(Group(*mobs)), run_time=run_time)


class DivBoard:
    def __init__(self, S, a, d, who="모둠", item="구슬", unit="개"):
        self.S, self.a, self.d, self.who, self.item, self.unit = S, a, d, who, item, unit
        self.t, self.u, self.q1, self.r1, self.n2, self.q2, self.rem = parts(a, d)
        self.size = 0.26 if d <= 3 else 0.2
        self.pool_x = -5.35
        w = min(2.5, (9.0 - 0.25 * (d - 1)) / d)
        h = 3.1 if d <= 3 else 2.7
        self.plates = VGroup(*[plate(f"{i}{'번' if who == '명' else ''} {who}" if who != "명" else f"{i}번 친구",
                                     width=w, height=h, size=40 if d > 3 else 44)
                               for i in range(1, d + 1)]).arrange(RIGHT, buff=0.25)
        self.plates.move_to([1.85, 0.55, 0])
        s = self.size
        self.rods = VGroup(*[ten_rod(s) for _ in range(self.t)]).arrange(RIGHT, buff=s * 0.7)
        self.ones = VGroup(*[unit_cube(s) for _ in range(self.u)])
        for c, p in zip(self.ones, grid_points([0, 0, 0], self.u, 1, s * 1.4)):
            c.move_to(p)
        grp = VGroup(self.rods, self.ones) if self.u else VGroup(self.rods)
        grp.arrange(RIGHT, buff=s * 1.5, aligned_edge=DOWN)
        if grp.width > 3.0:
            grp.scale_to_fit_width(3.0)
        grp.move_to([self.pool_x, 0.25, 0])
        self.label = num_markup(a, 100).move_to([self.pool_x, 2.15, 0])

    # 1) 수를 수모형으로
    def show_number(self):
        S, s = self.S, self.size
        S.play(FadeIn(self.label, scale=0.8), run_time=0.6)
        S.say(f"{self.item} {self.a}{self.unit}를 수모형으로 나타내요",
              f"{self.item} {self.a}{self.unit}를 수모형으로 나타내 볼게요.")
        a1 = Line(self.label[0].get_bottom() + DOWN * 0.08, self.rods.get_top() + UP * 0.08,
                  color=BLUE, stroke_width=6)
        lab_t = T(f"{self.t}0", 52, BLUE).next_to(self.rods, DOWN, buff=0.3)
        S.play(Indicate(self.label[0], color=BLUE, scale_factor=1.3), Create(a1), run_time=0.7)
        S.play(LaggedStart(*[FadeIn(r, shift=DOWN * 0.3) for r in self.rods], lag_ratio=0.2, run_time=1.2),
               FadeIn(lab_t))
        extra = [a1, lab_t]
        if self.u:
            a2 = Line(self.label[1].get_bottom() + DOWN * 0.08, self.ones.get_top() + UP * 0.08,
                      color=ORANGE, stroke_width=6)
            lab_u = T(str(self.u), 52, ORANGE).next_to(self.ones, DOWN, buff=0.3).align_to(lab_t, DOWN)
            S.play(Create(a2), LaggedStart(*[FadeIn(c, shift=DOWN * 0.3) for c in self.ones], lag_ratio=0.2,
                                           run_time=0.8), FadeIn(lab_u))
            extra += [a2, lab_u]
        S.say(f"{b(f'십 모형 {self.t}개')}" + (f"와 {o(f'일 모형 {self.u}개')}" if self.u else ""),
              f"십 모형 {self.t}개" + (f"와 일 모형 {self.u}개" if self.u else "") + "예요.", wait=1.2)
        self._extra = VGroup(*extra)

    # 2) 묶음(접시)
    def show_plates(self):
        S = self.S
        S.say(f"{self.d}{'명' if self.who == '명' else '개 ' + self.who}에 똑같이 나누어요",
              f"{self.d}{'명' if self.who == '명' else '개 ' + self.who}에 똑같이 나누어 줄 거예요.")
        S.play(FadeOut(self._extra),
               LaggedStart(*[FadeIn(p, shift=UP * 0.2) for p in self.plates], lag_ratio=0.15, run_time=1.0))
        S.bring_to_front(self.rods, self.ones)
        S.wait(0.6)

    # 3) 십 모형 나누기
    def deal_tens(self):
        S, d, q1 = self.S, self.d, self.q1
        S.say(f"{b('십 모형')}부터 한 {self.who}에 {b(f'{q1}개씩')}",
              f"먼저 십 모형부터 나누어요. 한 {self.who}에 {q1}개씩 줄 수 있어요.")
        k = 0
        for r in range(q1):
            moves = []
            for i in range(d):
                slot = plate_slots(self.plates[i], self.size)[0][r]
                moves.append(self.rods[k].animate.move_to(slot))
                k += 1
            S.play(*moves, run_time=0.9)
            S.wait(0.2)
        self.left_rods = VGroup(*self.rods[k:])
        if self.r1:
            S.say(f"{b(f'십 모형 {self.r1}개')}가 남았어요",
                  f"십 모형이 {self.r1}개 남았어요. 이대로는 {d}{'명' if self.who == '명' else '개 ' + self.who}에 똑같이 나눌 수 없어요.")
            S.play(Circumscribe(self.left_rods, color=BLUE, buff=0.12, stroke_width=6, run_time=1.2))
            S.wait(1.0)
        else:
            S.say(f"{b('십 모형')}은 남은 것이 없어요", "십 모형은 남은 것이 없어요.", wait=0.8)

    # 4) 남은 십 모형 → 일 모형 (핵심 장면)
    def exchange(self):
        S, s, r1 = self.S, self.size, self.r1
        if not r1:
            return
        S.say(f"{b(f'십 모형 {r1}개')}를 {o(f'일 모형 {r1 * 10}개')}로 바꿔요!",
              f"남은 십 모형 {r1}개를 일 모형 {r1 * 10}개로 바꾸면 돼요!")
        cover = Rectangle(width=15, height=6.1, fill_color=BG, fill_opacity=0.9, stroke_width=0).move_to([0, 0.75, 0])
        S.play(FadeIn(cover), run_time=0.5)
        S.bring_to_front(self.left_rods)
        rows_y = [1.2 - 0.9 * i for i in range(r1)]
        S.play(*[rod.animate.scale(0.416 / s).rotate(-PI / 2).move_to([0, y, 0])
                 for rod, y in zip(self.left_rods, rows_y)], run_time=1.1)
        glow = SurroundingRectangle(self.left_rods, color=ORANGE, buff=0.18, stroke_width=10, corner_radius=0.15)
        S.play(Create(glow), run_time=0.4)
        S.play(FadeOut(glow), run_time=0.3)
        cubes = []
        for rod, y in zip(self.left_rods, rows_y):
            row = [np.array([x, y, 0]) for x in np.linspace(-4.95, 4.95, 10)]
            anim, cs = break_ten(rod, row, run_time=1.6, lag=0.12)
            S.play(anim)
            cubes += list(cs)
            cnt = T(f"{len(cubes)}", 44, ORANGE).next_to(cs[-1], RIGHT, buff=0.35)
            S.play(FadeIn(cnt, scale=1.5), run_time=0.4)
            self._cnts = getattr(self, "_cnts", []) + [cnt]
        eq = M(f"{b(f'십 모형 {r1}개')} = {o(f'일 모형 {r1 * 10}개')}", 70).move_to([0, rows_y[-1] - 1.25, 0])
        box = SurroundingRectangle(eq, color=ORANGE, buff=0.28, stroke_width=6, corner_radius=0.2).set_fill(PAPER, 1)
        S.play(FadeIn(box), Write(eq), run_time=1.0)
        S.wait(2.0)
        # 원래 일 모형과 합치기
        n2 = self.n2
        cols = 4 if n2 > 12 else 3
        pts = grid_points([self.pool_x, 0.25, 0], n2, cols, s * 1.45)
        S.say(f"{o('일 모형')}은 모두 {o(f'{n2}개')}" + (f"({r1 * 10}개 + {self.u}개)" if self.u else ""),
              f"일 모형은 모두 {n2}개가 되었어요." if not self.u else
              f"원래 있던 일 모형 {self.u}개와 합하면 일 모형은 모두 {n2}개예요.")
        S.play(FadeOut(VGroup(eq, box, *self._cnts)), FadeOut(cover), run_time=0.5)
        self.all_ones = VGroup(*cubes, *self.ones)
        S.play(*[c.animate.scale_to_fit_width(s).move_to(p) for c, p in zip(self.all_ones, pts)], run_time=1.4)
        self.lab_n2 = T(f"{n2}개", 50, ORANGE).next_to(VGroup(*self.all_ones), DOWN, buff=0.3)
        S.play(FadeIn(self.lab_n2, scale=1.3), run_time=0.4)
        S.wait(1.2)

    # 5) 일 모형 나누기
    def deal_ones(self):
        S, d, q2 = self.S, self.d, self.q2
        if not hasattr(self, "all_ones"):
            self.all_ones = VGroup(*self.ones)
        if not q2:
            return
        S.say(f"{o(f'일 모형 {self.n2}개')}도 한 {self.who}에 1개씩",
              f"일 모형 {self.n2}개도 한 {self.who}에 1개씩 나누어 줘요.")
        slots = [ones_slots_centered(p, q2, size=self.size) for p in self.plates]
        k = 0
        for r in range(q2):
            S.play(*[self.all_ones[k + i].animate.move_to(slots[i][r]) for i in range(d)], run_time=0.75)
            k += d
        if hasattr(self, "lab_n2"):
            S.play(FadeOut(self.lab_n2), run_time=0.3)
        rest = f", 남은 것: {o(str(self.rem))}개" if self.rem else ", 남은 것이 없어요"
        S.say(f"한 {self.who}에 {o(f'{q2}개')}씩{rest}",
              f"한 {self.who}에 일 모형이 {q2}개씩 돌아가요." + (f" {self.rem}개가 남았어요." if self.rem else " 남은 것이 없어요."),
              wait=1.6)

    # 6) 결과
    def show_result(self):
        S = self.S
        q = self.q1 * 10 + self.q2
        labs = VGroup(*[num_markup(q, 68).next_to(p[0], DOWN, buff=0.18) for p in self.plates])
        S.say(f"한 {self.who} = {b(f'십 모형 {self.q1}개')}" + (f" + {o(f'일 모형 {self.q2}개')}" if self.q2 else "") + f" = {q}",
              f"한 {self.who}에 십 모형 {self.q1}개" + (f"와 일 모형 {self.q2}개" if self.q2 else "") + f", {j(q, '이에요')}.")
        S.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in labs], lag_ratio=0.15, run_time=1.0))
        boxes = VGroup(*[SurroundingRectangle(VGroup(p[0], l), color=GREEN, buff=0.08, stroke_width=5, corner_radius=0.25)
                         for p, l in zip(self.plates, labs)])
        S.play(Create(boxes), run_time=0.8)
        S.wait(1.8)

    def clear(self):
        S = self.S
        S.settle()
        clear_stage(S)


# ── 세로셈 ──────────────────────────────────────────────────────────
def long_division(S, a, d, who="모둠", unit="개"):
    t, u, q1, r1, n2, q2, rem = parts(a, d)
    assert n2 > 0, "일의 자리에서 나눌 것이 없는 경우(예: 60 ÷ 3)는 세로셈 장면을 쓰지 않아요"
    S.section("세로셈으로 나타내기")
    F = 72
    xt, xo = -3.5, -2.85
    yq, ybar, yd = 2.5, 1.98, 1.5
    y2, yl1, y3, y4, yl2, y5 = 0.62, 0.18, -0.26, -1.12, -1.56, -2.0

    def dig(s, x, y, color=INK):
        return T(s, F, color).move_to([x, y, 0])

    def two(n, y, color):
        tt, uu = divmod(n, 10)
        return VGroup(dig(str(tt), xt, y, color), dig(str(uu), xo, y, color)) if tt else VGroup(dig(str(uu), xo, y, color))

    divisor = dig(str(d), xt - 1.15, yd)
    dt, du = dig(str(t), xt, yd), dig(str(u), xo, yd)
    left = np.array([xt - 0.5, ybar, 0])
    bar = Line(left, [xo + 0.45, ybar, 0], color=INK, stroke_width=7)
    brk = ArcBetweenPoints(left, left + np.array([-0.08, -0.92, 0]), angle=-PI / 2.4, color=INK, stroke_width=7)
    frame = VGroup(divisor, brk, bar, dt, du)

    # 오른쪽 작은 수모형
    s = 0.13
    wm = min(1.35, (5.2 - 0.15 * (d - 1)) / d)
    mplates = VGroup(*[plate("", width=wm, height=1.75) for _ in range(d)]).arrange(RIGHT, buff=0.15)
    mplates.move_to([3.75, 1.25, 0])
    mrods = VGroup(*[ten_rod(s) for _ in range(t)]).arrange(RIGHT, buff=0.1)
    mones = VGroup(*[unit_cube(s) for _ in range(u)]).arrange(UP, buff=0.05) if u else VGroup()
    pool = (VGroup(mrods, mones).arrange(RIGHT, buff=0.3, aligned_edge=DOWN) if u else VGroup(mrods)).move_to([3.75, -0.45, 0])
    mini_title = T("수모형으로 보면", 38, SOFT).move_to([3.75, 2.45, 0])
    panel = RoundedRectangle(corner_radius=0.3, width=5.6, height=5.0, fill_color=PAPER, fill_opacity=0.7,
                             stroke_color=SOFT, stroke_width=2).move_to([3.75, 0.3, 0])
    state = {"cap": T("", 38)}

    def cap(markup):
        new = M(markup, 38)
        new.scale_to_fit_width(min(new.width, 5.2)).move_to([3.75, -1.7, 0])
        S.play(FadeOut(state["cap"]), FadeIn(new), run_time=0.4)
        state["cap"] = new

    S.say("세로셈으로 나타내 볼까요?", "이번에는 세로셈으로 나타내 볼까요?")
    S.play(FadeIn(panel), FadeIn(mini_title), FadeIn(mplates), FadeIn(pool), run_time=0.8)
    S.play(Write(frame), run_time=1.2)
    S.say(f"나누는 수 {j(d, '은는')} 왼쪽, 나누어지는 수 {j(a, '은는')} 안쪽에 써요",
          f"나누는 수 {j(d, '은는')} 왼쪽에, 나누어지는 수 {j(a, '은는')} 안쪽에 써요.")
    S.play(Indicate(divisor, color=INK), Indicate(VGroup(dt, du), color=INK), run_time=0.9)
    S.wait(0.8)

    # (1) 십의 자리 (파랑)
    S.say(f"{b('십의 자리')}부터: {b(f'{t} ÷ {d}')}", f"십의 자리부터 나누어요. {t} 나누기 {d}.")
    hl = SurroundingRectangle(dt, color=BLUE, buff=0.12, stroke_width=6)
    S.play(dt.animate.set_color(BLUE), Create(hl), Indicate(mrods, color=BLUE), run_time=0.9)
    cap(f"{b(f'십 모형 {t}개')}를 {d}{who}에")
    S.wait(0.8)
    qa = dig(str(q1), xt, yq, BLUE)
    S.say(f"한 {who}에 {b(f'십 모형 {q1}개')}씩 → 몫의 십의 자리에 {b(str(q1))}",
          f"한 {who}에 십 모형 {q1}개씩. 몫의 십의 자리에 {j(q1, '을를')} 써요.")
    moves = []
    k = 0
    for r in range(q1):
        for i in range(d):
            moves.append(mrods[k].animate.move_to(plate_slots(mplates[i], s)[0][r]))
            k += 1
    S.play(*moves, run_time=1.0)
    S.play(FadeIn(qa, shift=DOWN * 0.3, scale=1.4), run_time=0.5)
    cap(f"한 {who}에 {b(f'{q1}개씩')}")
    S.wait(1.0)
    used = q1 * d
    rb = dig(str(used), xt, y2, BLUE)
    S.say(f"나누어 준 {b(f'십 모형 {used}개')}({used}0)를 {b(j(used, '으로'))} 써요",
          f"나누어 준 십 모형 {used}개, {used}0을 {t} 아래에 {j(used, '으로')} 써요.")
    S.play(FadeIn(rb, shift=DOWN * 0.3), Indicate(VGroup(*mrods[:used]), color=BLUE), run_time=0.8)
    cap(f"나누어 준 {b(f'십 모형 {used}개')}")
    S.wait(1.0)
    l1 = Line([xt - 0.4, yl1, 0], [xo + 0.4, yl1, 0], color=INK, stroke_width=6)
    if not r1:
        S.say(f"{b(f'{t} − {used} = 0')}: 남은 {b('십 모형')}이 없어요",
              f"{t} 빼기 {j(used, '은는')} 0. 남은 십 모형이 없어요.")
        S.play(Create(l1), run_time=0.4)
        cap(f"남은 {b('십 모형')}: 없음")
        S.play(FadeOut(hl), run_time=0.3)
        S.wait(0.8)
        S.say(f"일의 자리 {o(j(u, '을를'))} 그대로 내려 써요",
              f"이제 일의 자리 {j(u, '을를')} 그대로 내려 써요.")
        duc = du.copy()
        arrow = CurvedArrow(du.get_bottom() + DOWN * 0.05 + RIGHT * 0.3, np.array([xo + 0.3, y3 + 0.3, 0]),
                            angle=-PI / 3, color=ORANGE, stroke_width=6)
        S.play(du.animate.set_color(ORANGE), Indicate(mones, color=ORANGE), run_time=0.6)
        S.play(Create(arrow), duc.animate.set_color(ORANGE).move_to([xo, y3, 0]), run_time=1.0)
        m_all = VGroup(*mones)
        cap(f"이제 {o(f'일 모형 {u}개')}를 나눠요")
        hl2 = SurroundingRectangle(duc, color=ORANGE, buff=0.12, stroke_width=6)
        S.play(Create(hl2), run_time=0.4)
        S.wait(1.0)
    else:
        rr = dig(str(r1), xt, y3, BLUE)
        S.say(f"{b(f'{t} − {used} = {r1}')}: 남은 {b(f'십 모형 {r1}개')}",
              f"{t} 빼기 {j(used, '은는')} {r1}. 십 모형이 {r1}개 남았어요.")
        S.play(Create(l1), run_time=0.4)
        S.play(FadeIn(rr, shift=DOWN * 0.3), Circumscribe(VGroup(*mrods[used:]), color=BLUE, buff=0.06), run_time=0.9)
        cap(f"남은 {b(f'십 모형 {r1}개')}")
        S.play(FadeOut(hl), run_time=0.3)
        S.wait(0.8)

        # (2) 바꾸고 내리기 (주황)
        S.say(f"남은 {b(f'십 모형 {r1}개')} → {o(f'일 모형 {r1 * 10}개')}",
              f"남은 십 모형 {r1}개는 일 모형 {r1 * 10}개로 바꿔요.")
        pts = grid_points([3.75, -0.45, 0], n2, 10 if n2 > 12 else 6, s * 1.5)
        anims, mcubes = [], []
        for jj, rod in enumerate(mrods[used:]):
            an, cs = break_ten(rod, pts[jj * 10:(jj + 1) * 10], run_time=1.3, lag=0.08)
            anims.append(an)
            mcubes += list(cs)
        S.play(*anims, rr.animate.set_color(ORANGE), run_time=1.3)
        cap(f"{b(f'십 모형 {r1}개')} = {o(f'일 모형 {r1 * 10}개')}")
        S.wait(0.8)
        S.say(f"일의 자리 {o(j(u, '을를'))} 내려 써서 {o(str(n2))}",
              f"일의 자리 {j(u, '을를')} 내려 쓰면 {j(n2, '이가')} 돼요.")
        duc = du.copy()
        arrow = CurvedArrow(du.get_bottom() + DOWN * 0.05 + RIGHT * 0.3, np.array([xo + 0.3, y3 + 0.3, 0]),
                            angle=-PI / 3, color=ORANGE, stroke_width=6)
        S.play(du.animate.set_color(ORANGE), run_time=0.3)
        S.play(Create(arrow), duc.animate.set_color(ORANGE).move_to([xo, y3, 0]), run_time=1.0)
        if u:
            S.play(*[mones[i].animate.move_to(pts[r1 * 10 + i]) for i in range(u)], run_time=0.7)
        m_all = VGroup(*mcubes, *mones)
        cap(f"{o('일 모형')}은 모두 {o(f'{n2}개')}")
        hl2 = SurroundingRectangle(VGroup(rr, duc), color=ORANGE, buff=0.12, stroke_width=6)
        S.play(Create(hl2), run_time=0.4)
        S.wait(1.0)

    # (3) 일의 자리 (주황)
    qb = dig(str(q2), xo, yq, ORANGE)
    S.say(f"{o(f'{n2} ÷ {d} = {q2}')} → 몫의 일의 자리에 {o(str(q2))}",
          f"{n2} 나누기 {j(d, '은는')} {q2}. 몫의 일의 자리에 {j(q2, '을를')} 써요.")
    oslots = [ones_slots_centered(p, q2, size=s) for p in mplates]
    moves = []
    k = 0
    for r in range(q2):
        for i in range(d):
            moves.append(m_all[k].animate.move_to(oslots[i][r]))
            k += 1
    S.play(LaggedStart(*moves, lag_ratio=0.05, run_time=1.8))
    S.play(FadeIn(qb, shift=DOWN * 0.3, scale=1.4), run_time=0.5)
    cap(f"한 {who}에 {o(f'{q2}개씩')}")
    S.wait(1.0)
    given = q2 * d
    r4 = two(given, y4, ORANGE)
    l2 = Line([xt - 0.4, yl2, 0], [xo + 0.4, yl2, 0], color=INK, stroke_width=6)
    r5 = dig(str(rem), xo, y5, ORANGE)
    S.say(f"나누어 준 {o(j(given, '을를'))} 쓰고 빼면 {o(str(rem))}",
          f"나누어 준 {j(given, '을를')} 쓰고 빼면 {rem}." + (" 남은 것이 없어요." if not rem else f" {j(rem, '이가')} 남아요."))
    S.play(FadeOut(hl2), FadeIn(r4, shift=DOWN * 0.3), run_time=0.6)
    S.play(Create(l2), run_time=0.4)
    S.play(FadeIn(r5, shift=DOWN * 0.3), run_time=0.5)
    cap(f"남은 것: {o(str(rem))}")
    S.wait(1.0)

    q = q1 * 10 + q2
    qbox = SurroundingRectangle(VGroup(qa, qb), color=GREEN, buff=0.15, stroke_width=7)
    S.say(f"몫은 {b(str(q1))}{o(str(q2))}: 한 {who}에 {g(f'{q}{unit}')}씩!",
          f"그래서 몫은 {q}. 한 {who}에 {q}{unit}씩이에요.")
    S.play(Create(qbox), Indicate(VGroup(qa, qb), color=GREEN), run_time=0.9)
    cap(f"한 묶음 = {b(f'{q1}0')} + {o(str(q2))} = {g(str(q))}")
    S.wait(2.0)
    S.settle()
    S.clear_sub()
    clear_stage(S)
