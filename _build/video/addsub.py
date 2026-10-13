"""덧셈·뺄셈 세로셈 부품 (받아올림·받아내림 표시)

    add_vertical(S, 319, 274)    # 일 → 십 → 백, 합이 10 넘으면 윗자리 위에 작은 1
    sub_vertical(S, 426, 279)    # 뺄 수 없으면 윗자리 수에 빗금 + 1 작은 수, 아랫자리 위에 10
"""
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, SurroundingRectangle, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, M, T, g
from multiply import HUND, PLACE, cm, pc
from division import j


def _setup(S, a, b_, op, x0, y0, F, dx):
    da = [int(c) for c in str(a)][::-1]
    db = [int(c) for c in str(b_)][::-1]
    W = max(len(da), len(db)) + 1
    xs = [x0 - i * dx for i in range(W + 1)]
    top = VGroup(*[T(str(v), F, pc(i)).move_to([xs[i], y0, 0]) for i, v in enumerate(da)])
    bot = VGroup(*[T(str(v), F, pc(i)).move_to([xs[i], y0 - 1.0, 0]) for i, v in enumerate(db)])
    sign = T(op, F).move_to([xs[W - 1] - 0.15, y0 - 1.0, 0])
    bar = Line([xs[W - 1] - 0.5, y0 - 1.6, 0], [xs[0] + 0.4, y0 - 1.6, 0], color=INK, stroke_width=6)
    S.play(FadeIn(top), FadeIn(bot), FadeIn(sign), Create(bar), run_time=0.8)
    return da, db, xs, top, bot


def _log(S, log, text, side_x, y0):
    line = M(text, 38)
    line.scale_to_fit_width(min(line.width, 6.2))
    line.move_to([side_x, y0 + 0.2 - len(log) * 0.68, 0], aligned_edge=LEFT)
    S.play(FadeIn(line, shift=LEFT * 0.2), run_time=0.5)
    log.add(line)


def add_vertical(S, a, b_, x0=-2.2, y0=1.6, F=78, dx=0.62, side_x=0.6):
    da, db, xs, top, bot = _setup(S, a, b_, "+", x0, y0, F, dx)
    n = max(len(da), len(db))
    carry, log, out = 0, VGroup(), VGroup()
    for i in range(n):
        va = da[i] if i < len(da) else 0
        vb = db[i] if i < len(db) else 0
        s = va + vb + carry
        put, nc = s % 10, s // 10
        pl = PLACE[i]
        expr = f"{cm(va, i)} + {cm(vb, i)}" + (f" + {cm(1, i)}(받아올림)" if carry else "") + f" = {s}"
        S.say(f"{cm(pl + '의 자리', i)}: {expr}", f"{pl}의 자리: {va} 더하기 {vb}" + (f", 받아올린 1까지 더하면 {s}." if carry else f"{j(vb, '은는')[len(str(vb)):]} {s}."))
        hl = SurroundingRectangle(VGroup(*[m for m in (top[i] if i < len(top) else None, bot[i] if i < len(bot) else None) if m is not None]),
                                  color=pc(i), buff=0.1, stroke_width=5)
        S.play(Create(hl), run_time=0.4)
        _log(S, log, f"{cm(pl, i)}: {expr}", side_x, y0)
        dig = T(str(put), F, pc(i)).move_to([xs[i], y0 - 2.3, 0])
        if nc:
            c = T("1", 40, pc(i + 1)).move_to([xs[i + 1], y0 + 0.75, 0])
            S.say(f"{j(put, '을를')} 쓰고 {cm('1', i + 1)}을 {PLACE[i + 1]}의 자리로 받아올림!",
                  f"{s}에서 {j(put, '을를')} {pl}의 자리에 쓰고, 10은 {PLACE[i + 1]}의 자리 1이 되어 위에 작게 써요. 이것을 받아올림이라고 해요.")
            S.play(FadeIn(dig, shift=DOWN * 0.2), FadeIn(c, shift=UP * 0.3, scale=1.4), run_time=0.8)
        else:
            S.play(FadeIn(dig, shift=DOWN * 0.2), run_time=0.5)
        out.add(dig)
        S.play(FadeOut(hl), run_time=0.2)
        S.wait(0.3)
        carry = nc
    if carry:
        dig = T("1", F, pc(n)).move_to([xs[n], y0 - 2.3, 0])
        S.say(f"받아올린 1을 {PLACE[n]}의 자리에 써요", f"받아올린 1을 {PLACE[n]}의 자리에 그대로 써요.")
        _log(S, log, f"{cm(PLACE[n], n)}: 받아올린 1", side_x, y0)
        S.play(FadeIn(dig, shift=DOWN * 0.2), run_time=0.5)
        out.add(dig)
    res = a + b_
    S.say(f"{a} + {b_} = {g(str(res))}", f"그래서 {a} 더하기 {j(b_, '은는')} {j(res, '이에요')}.")
    S.play(Create(SurroundingRectangle(out, color=GREEN, buff=0.15, stroke_width=6)), run_time=0.6)
    S.wait(1.4)
    return res


def sub_vertical(S, a, b_, x0=-2.2, y0=1.4, F=78, dx=0.62, side_x=0.6):
    da, db, xs, top, bot = _setup(S, a, b_, "−", x0, y0, F, dx)
    n = len(da)
    cur = list(da)
    log, out = VGroup(), VGroup()
    small = {}
    for i in range(n):
        vb = db[i] if i < len(db) else 0
        pl = PLACE[i]
        if cur[i] < vb:
            k = i + 1
            while cur[k] == 0:
                k += 1
            # 위에서부터 차례로 받아내림 (예: 500 − 199)
            for m in range(k, i, -1):
                old = cur[m]
                cur[m] -= 1
                cur[m - 1] += 10
                S.say(f"{cm(pl + '의 자리', i)}에서 뺄 수 없어요 → {cm(PLACE[m] + '의 자리', m)}에서 받아내림"
                      if m - 1 == i else f"{cm(PLACE[m - 1], m - 1)}의 자리가 0이라 {cm(PLACE[m], m)}에서 먼저 받아내림",
                      f"{pl}의 자리에서 뺄 수 없어요. {PLACE[m]}의 자리에서 받아내려요. {PLACE[m]}의 자리 {j(old, '은는')} 1 작아진 {j(cur[m], '이가')} 되고, {PLACE[m - 1]}의 자리에는 10이 더해져요."
                      if m - 1 == i else f"{PLACE[m - 1]}의 자리가 0이라서 먼저 {PLACE[m]}의 자리에서 1을 받아내려 {PLACE[m - 1]}의 자리를 10으로 만들어요.")
                tgt = top[m]
                cross = Line(tgt.get_corner(DOWN + LEFT), tgt.get_corner(UP + RIGHT), color=INK, stroke_width=4)
                if m in small:
                    S.play(FadeOut(small[m]), run_time=0.2)
                nm = T(str(cur[m]), 38 if cur[m] < 10 else 30, pc(m)).move_to([xs[m], y0 + 0.75, 0])
                ten = T(str(cur[m - 1]), 38 if cur[m - 1] < 10 else 30, pc(m - 1)).move_to([xs[m - 1] + 0.05, y0 + 0.75, 0])
                if (m - 1) in small:
                    S.play(FadeOut(small[m - 1]), run_time=0.2)
                S.play(Create(cross), FadeIn(nm, shift=DOWN * 0.2), run_time=0.6)
                S.play(FadeIn(ten, shift=DOWN * 0.2, scale=1.3), run_time=0.6)
                small[m], small[m - 1] = nm, ten
                S.wait(0.4)
        r = cur[i] - vb
        expr = f"{cur[i]} − {vb} = {r}"
        S.say(f"{cm(pl + '의 자리', i)}: {expr}", f"{pl}의 자리: {cur[i]} 빼기 {j(vb, '은는')} {r}.")
        _log(S, log, f"{cm(pl, i)}: {expr}", side_x, y0)
        if r or i < n - 1 or n == 1:
            dig = T(str(r), F, pc(i)).move_to([xs[i], y0 - 2.3, 0])
            S.play(FadeIn(dig, shift=DOWN * 0.2), run_time=0.5)
            out.add(dig)
        S.wait(0.3)
    res = a - b_
    S.say(f"{a} − {b_} = {g(str(res))}", f"그래서 {a} 빼기 {j(b_, '은는')} {j(res, '이에요')}.")
    S.play(Create(SurroundingRectangle(out, color=GREEN, buff=0.15, stroke_width=6)), run_time=0.6)
    S.wait(1.4)
    return res
