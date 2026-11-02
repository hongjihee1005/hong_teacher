"""사고력 수학 그림(SVG 글자열) — 색은 CSS 변수(--ink 등)를 따라 밝은/어두운 화면에 맞음"""
import math

def _svg(w, h, body, lab=''):
    return f'<svg class="th-fig" viewBox="0 0 {w} {h}" role="img" aria-label="{lab}" style="max-width:{w}px">{body}</svg>'

def grid(c, r, s=40, lab='격자'):
    """가로 c칸 · 세로 r칸 격자"""
    p = 6; b = ''.join(f'<line x1="{p+i*s}" y1="{p}" x2="{p+i*s}" y2="{p+r*s}"/>' for i in range(c + 1))
    b += ''.join(f'<line x1="{p}" y1="{p+j*s}" x2="{p+c*s}" y2="{p+j*s}"/>' for j in range(r + 1))
    return _svg(c * s + 2 * p, r * s + 2 * p, f'<g class="th-ln">{b}</g>', lab)

def road(c, r, s=40):
    """바둑판 길: 왼쪽 아래 출발 → 오른쪽 위 도착"""
    p = 22; g = grid(c, r, s)
    b = ''.join(f'<line x1="{p+i*s}" y1="{p}" x2="{p+i*s}" y2="{p+r*s}"/>' for i in range(c + 1))
    b += ''.join(f'<line x1="{p}" y1="{p+j*s}" x2="{p+c*s}" y2="{p+j*s}"/>' for j in range(r + 1))
    b = f'<g class="th-ln">{b}</g><circle cx="{p}" cy="{p+r*s}" r="7" class="th-a"/><circle cx="{p+c*s}" cy="{p}" r="7" class="th-b"/>'
    b += f'<text x="{p-4}" y="{p+r*s+19}" class="th-t" text-anchor="end">출발</text><text x="{p+c*s+4}" y="{p-9}" class="th-t">도착</text>'
    return _svg(c * s + 2 * p + 26, r * s + 2 * p + 4, b, '바둑판 모양의 길')

def cevians(k, w=240, h=150):
    """삼각형의 위 꼭짓점에서 밑변으로 선 k개"""
    A = (w / 2, 10); B = (10, h - 10); C = (w - 10, h - 10)
    b = f'<polygon points="{A[0]},{A[1]} {B[0]},{B[1]} {C[0]},{C[1]}" fill="none"/>'
    for i in range(1, k + 1):
        x = B[0] + (C[0] - B[0]) * i / (k + 1); b += f'<line x1="{A[0]}" y1="{A[1]}" x2="{x}" y2="{B[1]}"/>'
    return _svg(w, h, f'<g class="th-ln">{b}</g>', f'선 {k}개를 그은 삼각형')

def tri_grid(n, s=72):
    """한 변을 n칸으로 나눈 큰 삼각형"""
    H = s * math.sqrt(3) / 2; W = n * s; p = 8
    P = lambda i, j: (p + W / 2 - i * s / 2 + j * s, p + i * H)   # i층 j번째 점
    b = ''
    for i in range(n + 1):
        for j in range(i + 1):
            x, y = P(i, j)
            if i < n:
                x1, y1 = P(i + 1, j); x2, y2 = P(i + 1, j + 1)
                b += f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x1:.1f}" y2="{y1:.1f}"/><line x1="{x:.1f}" y1="{y:.1f}" x2="{x2:.1f}" y2="{y2:.1f}"/>'
            if j < i:
                x1, y1 = P(i, j + 1); b += f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x1:.1f}" y2="{y1:.1f}"/>'
    return _svg(W + 2 * p, n * H + 2 * p, f'<g class="th-ln">{b}</g>', f'한 변을 {n}칸으로 나눈 삼각형')

def points_circle(n, r=70):
    p = 14; c = r + p
    b = f'<circle cx="{c}" cy="{c}" r="{r}" class="th-faint" fill="none"/>'
    for i in range(n):
        a = -math.pi / 2 + 2 * math.pi * i / n; b += f'<circle cx="{c + r*math.cos(a):.1f}" cy="{c + r*math.sin(a):.1f}" r="6" class="th-dot"/>'
    return _svg(2 * c, 2 * c, b, f'원 위의 점 {n}개')

def square_points(s=110):
    p = 14; pts = [(p, p), (p + s, p), (p + s, p + s), (p, p + s)]
    return _svg(s + 2 * p, s + 2 * p, ''.join(f'<circle cx="{x}" cy="{y}" r="6" class="th-dot"/>' for x, y in pts), '정사각형 꼭짓점 위의 점 4개')

def cross(s=36):
    cells = [(1, 0), (0, 1), (1, 1), (2, 1), (1, 2)]; p = 6
    b = ''.join(f'<rect x="{p+x*s}" y="{p+y*s}" width="{s}" height="{s}" class="th-cell"/>' for x, y in cells)
    return _svg(3 * s + 2 * p, 3 * s + 2 * p, b, '정사각형 5개로 만든 십자 모양')

def hexagon(r=70):
    p = 10; c = r + p; pts = [(c + r * math.cos(math.pi / 6 + i * math.pi / 3), c + r * math.sin(math.pi / 6 + i * math.pi / 3)) for i in range(6)]
    return _svg(2 * c, 2 * c, '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + '" class="th-ln" fill="none"/>', '정육각형')

def clock(h, m, r=70):
    p = 10; c = r + p; b = f'<circle cx="{c}" cy="{c}" r="{r}" class="th-face"/>'
    for k in range(12):
        a = math.pi * 2 * k / 12 - math.pi / 2; x1, y1 = c + (r - 8) * math.cos(a), c + (r - 8) * math.sin(a); x2, y2 = c + (r - 2) * math.cos(a), c + (r - 2) * math.sin(a)
        b += f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" class="th-tick"/>'
        n = 12 if k == 0 else k; tx, ty = c + (r - 20) * math.cos(a), c + (r - 20) * math.sin(a) + 5
        b += f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="middle" class="th-num">{n}</text>'
    ah = math.radians((h % 12 + m / 60) * 30 - 90); am = math.radians(m * 6 - 90)
    b += f'<line x1="{c}" y1="{c}" x2="{c + r*.5*math.cos(ah):.1f}" y2="{c + r*.5*math.sin(ah):.1f}" class="th-hh"/>'
    b += f'<line x1="{c}" y1="{c}" x2="{c + r*.78*math.cos(am):.1f}" y2="{c + r*.78*math.sin(am):.1f}" class="th-mh"/><circle cx="{c}" cy="{c}" r="4" class="th-dot"/>'
    return _svg(2 * c, 2 * c, b, f'{h}시 {m}분을 가리키는 시계')

def tri_dots(ns=(1, 2, 3, 4), d=16):
    """삼각형 모양 바둑돌 1, 3, 6, 10개"""
    p = 10; x0 = p; b = ''; H = 0
    for n in ns:
        w = n * d
        for i in range(n):
            for j in range(i + 1): b += f'<circle cx="{x0 + w/2 - i*d/2 + j*d:.1f}" cy="{p + i*d + d/2}" r="{d*.4}" class="th-dot"/>'
        x0 += w + 24; H = max(H, n * d)
    return _svg(x0, H + 2 * p, b, '삼각형 모양으로 놓은 바둑돌')

def match_squares(ns=(1, 2, 3), s=30):
    """성냥개비로 이어 붙인 정사각형 1개 · 2개 · 3개"""
    p = 8; x0 = p; b = ''
    for n in ns:
        for i in range(n + 1): b += f'<line x1="{x0+i*s}" y1="{p}" x2="{x0+i*s}" y2="{p+s}" class="th-mt"/>'
        for i in range(n): b += f'<line x1="{x0+i*s+3}" y1="{p}" x2="{x0+i*s+s-3}" y2="{p}" class="th-mt"/><line x1="{x0+i*s+3}" y1="{p+s}" x2="{x0+i*s+s-3}" y2="{p+s}" class="th-mt"/>'
        x0 += n * s + 34
    return _svg(x0, s + 2 * p, b, '성냥개비로 만든 정사각형')
