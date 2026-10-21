# -*- coding: utf-8 -*-
"""선생님이 한글에서 고친 '체스 학습관 1~6마당' 한 권의 빈 공간 줄이기 (2026-10-21 선생님 요청)

    python3 _build/chess/book/layout.py 지금파일.hwpx 한글로저장한파일.hwpx [출력.hwpx]

- 쪽 위치는 '한글로 저장한 파일'(줄 정보 linesegarray가 있는 파일)에서 재고, 고치는 것은 '지금 파일'입니다
  (tidy.py로 정리하면 줄 정보가 지워지므로, 정리하기 전에 한글로 저장한 파일을 함께 줍니다. 두 파일의 바깥 문단 차례는 같아야 함).
- tidy.py가 문제 칸 표를 두 줄로 나누어 늘어난 높이를 셈해, 넘칠 것 같은 쪽은 그 쪽의 빈 문단·정리해요 쓰는 칸 빈 줄을 빼서 맞춥니다.
- 앞쪽(머리말·이 책을 쓰는 방법·이 책의 짜임)은 내용을 더하고, 본문에서 50mm 넘게 빈 쪽은 쪽 끝에 칸을 넣어 채웁니다:
  마당을 시작하며 → '이 마당에서 배울 단원'(체크 칸) + 나의 다짐 줄, 단원 마무리 → '차시 돌아보기' 표, 그 밖 → '나의 체스 노트' 줄.
  넣는 칸은 남는 높이보다 넉넉히(SLACK) 작게 만들어 다음 쪽으로 밀리지 않게 합니다. 쪽 수와 쪽 번호는 그대로입니다.
- '1~1번은 따라 하기', '1~0번은 …'과 글꼴에서 빠진 ✕를 고칩니다.
줄 정보를 지우므로 한글에서 열어 저장한 뒤 fix_pages.py로 쪽 번호를 확인하세요.
"""
import re, sys, os, zipfile, random, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tidy

H = 65765                  # 본문 높이(232mm, HWPUNIT)
MM = 283.46
SLACK = int(14 * MM)       # 넣는 칸은 남는 높이보다 이만큼 작게
MIN_FILL = int(50 * MM)    # 이보다 많이 비면 채움
LINE_ROW = 2550            # 쓰는 줄 한 칸(9mm)
CHECK_ROW = 2400
TITLE_ROW = 4700           # 제목 + 안내 한 줄 칸
RNG = random.Random(20261021)


def nid():
    return str(RNG.randrange(10 ** 8, 2 * 10 ** 9))


def tops_of(body):
    tops = []; depth = 0
    for m in re.finditer(r'<hp:p [^>]*>|</hp:p>', body):
        if m.group(0).startswith('<hp:p '):
            if depth == 0: st = m.start()
            depth += 1
        else:
            depth -= 1
            if depth == 0: tops.append((st, m.end()))
    return tops


def own(p):
    m = re.search(r'<hp:linesegarray>((?:(?!<hp:linesegarray>).)*?)</hp:linesegarray></hp:p>$', p, re.S)
    return [(int(a), int(b), int(c)) for a, b, c in re.findall(r'vertpos="(-?\d+)" vertsize="(\d+)" textheight="\d+" baseline="\d+" spacing="(\d+)"', m.group(1))] if m else []


def text(p):
    return ''.join(re.findall(r'<hp:t>([^<]*)</hp:t>', p))


def geometry(saved):
    """바깥 문단마다 (쪽, 그 쪽에서의 아래 끝), 쪽마다 채운 높이"""
    s = zipfile.ZipFile(saved).read('Contents/section0.xml').decode('utf-8')
    b0 = s.index('<hs:sec'); body = s[b0:]
    page = 1; last = None; G = []; fill = {}
    for k, (a, e) in enumerate(tops_of(body)):
        p = body[a:e]
        if k and re.match(r'<hp:p [^>]*pageBreak="1"', p): page += 1; last = None
        segs = own(p); p0 = None; size = 0
        for v, h, sp in segs:
            if last is not None and v < last: page += 1
            last = v
            if p0 is None: p0 = page
            fill[page] = max(fill.get(page, 0), v + h)
            size += h + sp
        G.append(dict(page=p0 or page, last=page, p=p, size=size, segs=segs))
    return G, fill


def grid_delta(p):
    """tidy.py가 문제 칸 표(한 줄 세 칸)를 '문제 줄 + 그림 줄'로 나눌 때 늘어나는 높이(한글이 저장한 줄 정보로 셈)"""
    d = 0
    for t in re.finditer(r'<hp:tbl [^>]*rowCnt="1" colCnt="3".*?</hp:tbl>', p, re.S):
        qs = []; rs = []
        for c in re.findall(r'<hp:subList[^>]*>(.*?)</hp:subList>', t.group(0), re.S):
            ps = [c[a:e] for a, e in tops_of(c)]
            if not ps or '<hp:pic' not in c: continue
            if not re.match(r'<hp:p [^>]*><hp:run charPrIDRef="\d+"><hp:t>\d+  </hp:t>', ps[0]): continue
            sq = own(ps[0])
            qb = max(v + h for v, h, sp in sq) + sq[-1][2] if sq else 0
            allb = max([v + h for pp in ps for v, h, sp in own(pp)] or [0])
            j = 1; skip = 0
            while j < len(ps) - 1 and not re.search(r'<hp:t>[^<]*\S|<hp:pic|<hp:tbl', ps[j]):
                sg = own(ps[j])
                if sg: skip += sg[-1][1] + sg[-1][2]
                j += 1
            qs.append(qb); rs.append(allb - qb - skip)
        if qs:
            d += max(qs) + max(rs) + 150 - max(q + r for q, r in zip(qs, rs))
    return d


# ---------------------------------------------------------------- 표 만들기
def cell(c, r, w, body, bf, mg=(300, 300, 300, 300), h=500, span=1, va='CENTER'):
    return ('<hp:tc name="" header="0" hasMargin="1" protect="0" editable="0" dirty="0" borderFillIDRef="%s">'
            '<hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="%s" linkListIDRef="0" linkListNextIDRef="0" textWidth="0" textHeight="0" hasTextRef="0" hasNumRef="0">%s</hp:subList>'
            '<hp:cellAddr colAddr="%d" rowAddr="%d"/><hp:cellSpan colSpan="%d" rowSpan="1"/><hp:cellSz width="%d" height="%d"/>'
            '<hp:cellMargin left="%d" right="%d" top="%d" bottom="%d"/></hp:tc>') % (bf, va, body, c, r, span, w, h, mg[0], mg[1], mg[2], mg[3])


def para(t, pp, cp):
    run = '<hp:run charPrIDRef="%s"><hp:t>%s</hp:t></hp:run>' % (cp, t) if t is not None else '<hp:run charPrIDRef="%s"/>' % cp
    return '<hp:p id="%s" paraPrIDRef="%s" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0">%s</hp:p>' % (nid(), pp, run)


def table(rows, cols, height):
    """rows = [[cell xml …], …]; 바깥 문단 하나로 감싼 표"""
    trs = ''.join('<hp:tr>%s</hp:tr>' % ''.join(r) for r in rows)
    return ('<hp:p id="%s" paraPrIDRef="29" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0"><hp:run charPrIDRef="0">'
            '<hp:tbl id="%s" zOrder="%d" numberingType="TABLE" textWrap="TOP_AND_BOTTOM" textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" pageBreak="CELL" repeatHeader="0" rowCnt="%d" colCnt="%d" cellSpacing="0" borderFillIDRef="3" noAdjust="0">'
            '<hp:sz width="43937" widthRelTo="ABSOLUTE" height="%d" heightRelTo="ABSOLUTE" protect="0"/>'
            '<hp:pos treatAsChar="1" affectLSpacing="0" flowWithText="1" allowOverlap="0" holdAnchorAndSO="0" vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/>'
            '<hp:outMargin left="0" right="0" top="0" bottom="0"/><hp:inMargin left="0" right="0" top="0" bottom="0"/>%s</hp:tbl><hp:t/></hp:run></hp:p>'
            ) % (nid(), nid(), RNG.randrange(2000, 9000), len(rows), cols, height, trs)


def box(title, sub, lines, acc, H_, checks=()):
    """색 제목 칸(정리해요와 같은 꼴) + 체크 줄 + 쓰는 줄"""
    bf_t, cp_t = acc
    w0, w1 = 30000, 13937
    rows = [[cell(0, 0, 43937, para(title, 31, cp_t) + (para(sub, 28, 35) if sub else ''), bf_t, (1100, 800, 500, 500), span=2 if checks else 1)]]
    cols = 2 if checks else 1
    for k, (a, b) in enumerate(checks):
        r = len(rows)
        rows.append([cell(0, r, w0, para(a, 31, 35), H_.line_bf(), (1100, 300, 200, 200), CHECK_ROW),
                     cell(1, r, w1, para(b, 31, 39), H_.line_bf(), (200, 300, 200, 200), CHECK_ROW)])
    for k in range(lines):
        r = len(rows)
        if checks:
            rows.append([cell(0, r, 43937, para(None, 27, 35), H_.line_bf(), (1100, 800, 300, 300), LINE_ROW, span=2)])
        else:
            rows.append([cell(0, r, 43937, para(None, 27, 35), H_.line_bf(), (1100, 800, 300, 300), LINE_ROW)])
    height = TITLE_ROW + CHECK_ROW * len(checks) + LINE_ROW * lines
    return table(rows, cols, height), height


def kwl(lines, acc, H_):
    """단원을 시작하며: 알고 있는 것 | 알고 싶은 것 두 칸 + 쓰는 줄"""
    bf_t, cp_t = acc
    w = 43937 // 2
    rows = [[cell(0, 0, 43937, para('단원을 시작하며', 31, cp_t) + para('공부하기 전에 이 단원에 대해 이미 아는 것과 더 알고 싶은 것을 적어 보세요.', 28, 35), bf_t, (1100, 800, 500, 500), span=2)],
            [cell(0, 1, w, para('내가 이미 알고 있는 것', 31, 45), H_.line_bf(), (1100, 300, 300, 200), CHECK_ROW),
             cell(1, 1, 43937 - w, para('더 알고 싶은 것', 31, 45), H_.line_bf(), (800, 300, 300, 200), CHECK_ROW)]]
    for k in range(lines):
        r = len(rows)
        rows.append([cell(0, r, w, para(None, 27, 35), H_.line_bf(), (1100, 300, 300, 300), LINE_ROW),
                     cell(1, r, 43937 - w, para(None, 27, 35), H_.line_bf(), (800, 300, 300, 300), LINE_ROW)])
    height = TITLE_ROW + CHECK_ROW + LINE_ROW * lines
    return table(rows, 2, height), height


EMW = lambda c: 0.56 if c.isdigit() else 0.3 if c == ' ' else 0.55 if c.isascii() else 1.0


def polish(p, TH, caps=True):
    """높이를 거의 바꾸지 않는 다듬기: ① 그림 옆 글은 그림 위쪽에 맞춤 ② 예시 그림 밑 설명은 그림 너비에 맞춰 왼쪽 정렬·'장면 N' 뒤로 줄 맞춤
    ③ 고르기 보기(① … ④)는 번호와 글이 떨어지지 않게, 한 줄에 안 들어가면 두 개씩"""
    def fix_tbl(m):
        t = m.group(0)
        tcs = tidy.tops(t, 0, len(t), 'tc')
        if not tcs: return t
        out = t; shift = 0
        for a, e in tcs:
            c = t[a:e]; c2 = c
            # ① 2칸 표에서 그림 없는 칸은 위쪽 맞춤
            if 'colCnt="2"' in t[:300] and '<hp:pic' in t and '<hp:pic' not in c:
                c2 = re.sub(r'(<hp:subList [^>]*vertAlign=")CENTER(")', r'\1TOP\2', c2, count=1)
            cw = int(re.search(r'<hp:cellSz width="(\d+)"', c).group(1))
            mg = re.search(r'<hp:cellMargin left="(\d+)" right="(\d+)"', c)
            tw = cw - int(mg.group(1)) - int(mg.group(2))
            # ② 장면 설명
            pw = re.search(r'<hp:pic .*?<hp:sz width="(\d+)"', c, re.S)
            if pw and caps:
                off = max(0, (tw - int(pw.group(1))) // 2)
                def cap(mm):
                    q = mm.group(0)
                    r = re.match(r'<hp:p [^>]*paraPrIDRef="(\d+)"[^>]*><hp:run charPrIDRef="(\d+)"><hp:t>(장면 \d+  )', q)
                    if not r: return q
                    pt = TH.ch.get(r.group(2), 900) / 100.0
                    L = int(sum(EMW(ch) for ch in r.group(3)) * pt * 0.3528 * MM)
                    return q.replace('paraPrIDRef="%s"' % r.group(1), 'paraPrIDRef="%s"' % TH.ppvar(r.group(1), 'LEFT', off, off, -L), 1)
                c2 = re.sub(r'<hp:p [^>]*><hp:run charPrIDRef="\d+"><hp:t>장면 \d+  [^<]*</hp:t></hp:run>(?:<hp:linesegarray>(?:(?!</hp:p>).)*</hp:linesegarray>)?</hp:p>', cap, c2)
            # ③ 보기
            def ch(mm):
                q = mm.group(0)
                r = re.match(r'(<hp:p [^>]*><hp:run charPrIDRef="(\d+)"><hp:t>)(①[^<]*)(</hp:t>)', q)
                if not r: return q
                items = [x.strip() for x in re.split(r'\s{2,}(?=[②③④⑤⑥⑦⑧])', r.group(3)) if x.strip()]
                if len(items) < 2: return q
                pt = TH.ch.get(r.group(2), 1000) / 100.0
                wid = lambda x: sum(EMW(c) for c in x) * pt * 0.3528 * MM
                gap = '   '
                nb = lambda x: x.replace(' ', '<hp:nbSpace/>')
                body = None
                for per in range(len(items), 0, -1):      # 한 줄에 몇 개씩: 모든 줄이 들어가는 가장 큰 수(①②③ / ④⑤⑥)
                    rows = [items[k:k + per] for k in range(0, len(items), per)]
                    if per == 1 or all(wid(gap.join(rw)) <= tw * 0.9 for rw in rows):
                        body = '<hp:lineBreak/>'.join(gap.join(nb(x) for x in rw) for rw in rows)
                        break
                return r.group(1) + body + q[r.end(3):]
            c2 = re.sub(r'<hp:p [^>]*><hp:run charPrIDRef="\d+"><hp:t>①[^<]*</hp:t></hp:run>(?:<hp:linesegarray>(?:(?!</hp:p>).)*</hp:linesegarray>)?</hp:p>', ch, c2)
            if c2 != c:
                out = out[:a + shift] + c2 + out[e + shift:]; shift += len(c2) - len(c)
        return out
    return re.sub(r'<hp:tbl [^>]*>.*?</hp:tbl>', lambda m: fix_tbl(m) if m.group(0).count('<hp:tbl ') == 1 else m.group(0), p, flags=re.S)


def grid_table(head, data, widths, H_, label_bf='5', cell_bf='7'):
    """이 책의 짜임 표와 같은 꼴(이름 칸 색) — 머리 줄 + 자료 줄"""
    rows = []
    def row(vals, r, hd):
        out = []; x = 0
        for c, (v, w) in enumerate(zip(vals, widths)):
            if hd or c == 0:
                out.append(cell(c, r, w, para(v, 32, 45), label_bf, (300, 300, 400, 400)))
            else:
                out.append(cell(c, r, w, para(v, 31, 35), cell_bf, (500, 300, 400, 400)))
        return out
    rows.append(row(head, 0, True))
    for k, v in enumerate(data): rows.append(row(v, k + 1, False))
    return table(rows, len(widths), 2100 * len(rows)), 2100 * len(rows)


# ---------------------------------------------------------------- 앞쪽 글
PREFACE_HIST = ('체스는 1,500년쯤 전 인도에서 하던 놀이 ‘차투랑가’에서 비롯되었다고 알려져 있어요. 페르시아와 유럽을 거치며 지금의 모습이 되었고, '
                '오늘날에는 세계 여러 나라 사람들이 같은 규칙으로 체스를 즐겨요. 말이 통하지 않는 친구와도 체스판 하나면 함께 놀 수 있지요.')
PREFACE_POWER = [('집중하는 힘', '판 전체를 차분히 살피고, 말 하나하나가 어디로 갈 수 있는지 봐요.'),
                 ('미리 생각하는 힘', '“내가 이렇게 두면 상대는 어떻게 할까?”를 한 수 앞서 생각해요.'),
                 ('스스로 고치는 힘', '진 판에서 무엇을 놓쳤는지 찾아보고, 다음 판에 고쳐 봐요.'),
                 ('예절과 배려', '시작과 끝에 인사하고, 상대가 생각하는 동안 조용히 기다려요.')]
PREFACE_PARENT = ('부모님과 선생님께: 아이가 답을 맞혔는지보다 왜 그 칸을 골랐는지 말로 설명해 보게 해 주세요. '
                  '설명하다 보면 스스로 실수를 찾아내곤 해요. 학습관에서 같은 차시를 함께 열어 보시면 더 좋아요.')
PIECES = [('말', '킹', '퀸', '룩', '비숍', '나이트', '폰'),
          ('기호', 'K', 'Q', 'R', 'B', 'N', '(없음)'),
          ('값', '—', '9', '5', '3', '3', '1')]
GRADES = ['폰', '나이트', '비숍', '룩', '퀸', '킹']




# ---------------------------------------------------------------- 쪽마다 바꾸는 정도
# 0 모두(문제 칸 표 두 줄 + 번호 내어쓰기) · 1 문제 칸 표는 한 줄 그대로, 그림을 칸 아래쪽에 맞춤 · 2 + 쪽 안의 빈 문단 빼기
# 3 + 표 안 번호 문단은 내어쓰기 안 함 · 4 + 번호 내어쓰기 없음, 정리해요 쓰는 칸 빈 줄 하나 빼기
PICRE = re.compile(r'(<hp:sz width=")(\d+)(" widthRelTo="ABSOLUTE" height=")(\d+)(" heightRelTo="ABSOLUTE" protect="0"/><hp:pos treatAsChar="1"[^>]*/><hp:outMargin[^>]*/></hp:pic>)')


def scale_pics(p, f):
    """문단 안 그림을 f배로(그림 틀·회전 중심도 함께)"""
    def one(m):
        q = m.group(0)
        sz = re.search(r'<hp:sz width="(\d+)" widthRelTo="ABSOLUTE" height="(\d+)"', q)
        w, h = int(int(sz.group(1)) * f), int(int(sz.group(2)) * f)
        q = re.sub(r'<hp:sz width="\d+" widthRelTo="ABSOLUTE" height="\d+"', '<hp:sz width="%d" widthRelTo="ABSOLUTE" height="%d"' % (w, h), q)
        q = re.sub(r'<hc:pt1 x="\d+" y="0"/><hc:pt2 x="\d+" y="\d+"/><hc:pt3 x="0" y="\d+"/>', '<hc:pt1 x="%d" y="0"/><hc:pt2 x="%d" y="%d"/><hc:pt3 x="0" y="%d"/>' % (w, w, h, h), q)
        return re.sub(r'centerX="\d+" centerY="\d+"', 'centerX="%d" centerY="%d"' % (w // 2, h // 2), q)
    return re.sub(r'<hp:pic .*?</hp:pic>', one, p, flags=re.S)


def fit_examples(C, G):
    """차시마다 '배워요 + 예시로 보기'가 한 쪽에 들어가면 같은 쪽에 싣기(예시 앞 쪽 나눔 없앰),
    그림을 줄여(가장 작게 72%) 들어가면 배워요·예시 그림을 함께 줄여 싣기 — 2026-10-21 선생님 요청.
    높이는 한글이 저장한 줄 정보(문단 높이)로 어림하고, 표 높이는 그림 높이만큼 줄어든다고 봄(넉넉히 4% 더 줄임)."""
    T = [text(c).strip() for c in C]
    ph = lambda p: max([int(m.group(4)) for m in PICRE.finditer(p)] or [0])
    nshrink = nmove = 0
    for a in range(len(C) - 1):
        if not (re.match(r'\d+차시', T[a]) and T[a + 1].startswith('오늘의 목표')): continue
        e = next((j for j in range(a, min(a + 40, len(C))) if T[j].startswith('예시로 보기')), None)
        if e is None: continue
        f = next((j for j in range(e + 1, min(e + 60, len(C))) if T[j].startswith('풀어 봐요') or re.match(r'<hp:p [^>]*pageBreak="1"', C[j])), None)
        if f is None: continue
        B = sum(G[j]['size'] for j in range(a, e)); E = sum(G[j]['size'] for j in range(e, f))
        P = sum(ph(C[j]) for j in range(a, f) if '<hp:tbl' in C[j])
        need = B + E - (H - 1500)
        if need <= 0:
            sc = 1
        else:
            sc = 1 - need / max(1, P) - 0.04
            if sc < 0.72: continue
            for j in range(a, f):
                if '<hp:pic' in C[j]: C[j] = scale_pics(C[j], sc)
            nshrink += 1
        if re.match(r'<hp:p [^>]*pageBreak="1"', C[e]):
            C[e] = re.sub(r'pageBreak="1"', 'pageBreak="0"', C[e], count=1); nmove += 1
    return nshrink, nmove


def bottom_align(p):
    def fix(m):     # 번호 문제 칸만(예시의 '장면' 칸은 그대로)
        t = m.group(0)
        if '<hp:pic' not in t or not re.search(r'<hp:subList [^>]*><hp:p [^>]*><hp:run charPrIDRef="\d+"><hp:t>\d+  </hp:t>', t):
            return t
        return re.sub(r'(<hp:subList [^>]*vertAlign=")\w+(")', r'\1BOTTOM\2', t)
    return re.sub(r'<hp:tbl [^>]*rowCnt="1" colCnt="3".*?</hp:tbl>', fix, p, flags=re.S)


def outside_tables(p, f):
    """표 밖 글에만 f를 적용(표 안은 그대로)"""
    segs = tidy.tops(p, 0, len(p), 'tbl')
    keep = {}
    for k, (a, e) in reversed(list(enumerate(segs))):
        keep['\x00%d\x00' % k] = p[a:e]
        p = p[:a] + '\x00%d\x00' % k + p[e:]
    p = f(p)
    for k, v in keep.items():
        p = p.replace(k, v)
    return p


class LHead(tidy.Head):
    def line_bf(self):
        """아래쪽 점선만 있는 쓰는 줄"""
        if 'line' not in self.bfcache:
            nid = str(max(map(int, self.bf)) + 1 + len(self.new_bf))
            self.new_bf.append('<hh:borderFill id="%s" threeD="0" shadow="0" centerLine="NONE" breakCellSeparateLine="0"><hh:slash type="NONE" Crooked="0" isCounter="0"/><hh:backSlash type="NONE" Crooked="0" isCounter="0"/>'
                               '<hh:leftBorder type="NONE" width="0.1 mm" color="#000000"/><hh:rightBorder type="NONE" width="0.1 mm" color="#000000"/><hh:topBorder type="NONE" width="0.1 mm" color="#000000"/>'
                               '<hh:bottomBorder type="DOT" width="0.12 mm" color="#B9AC9E"/></hh:borderFill>' % nid)
            self.bfcache['line'] = nid
        return self.bfcache['line']

    def ppvar(self, pid, align=None, left=None, right=None, intent=None, kwn=False, ls=None):
        """문단 모양 복사(맞춤·왼쪽/오른쪽 여백·첫 줄). hp:switch의 case는 HWPUNIT, default는 그 두 배"""
        key = ('pv', pid, align, left, right, intent, kwn, ls)
        if key in self.ppcache: return self.ppcache[key]
        x = self.pp.get(pid) or next(y for y in self.new_pp if y.startswith('<hh:paraPr id="%s"' % pid))
        nid = str(max(map(int, self.pp)) + 1 + len(self.new_pp))
        x = re.sub(r'<hh:paraPr id="\d+"', '<hh:paraPr id="%s"' % nid, x, count=1)
        if align: x = re.sub(r'(<hh:align horizontal=")\w+', r'\g<1>' + align, x, count=1)
        if kwn: x = x.replace('keepWithNext="0"', 'keepWithNext="1"')
        if ls: x = re.sub(r'(<hh:lineSpacing type="PERCENT" value=")\d+', r'\g<1>%d' % ls, x)
        for tag, v in (('left', left), ('right', right), ('intent', intent)):
            if v is None: continue
            n = [0]
            def rep(m):
                n[0] += 1
                return '<hc:%s value="%d"' % (tag, v if n[0] == 1 else 2 * v)
            x = re.sub(r'<hc:%s value="-?\d+"' % tag, rep, x)
        self.new_pp.append(x); self.ppcache[key] = nid
        return nid

    def keepword(self, pid):
        key = ('kw', pid)
        if key in self.ppcache: return self.ppcache[key]
        x = self.pp.get(pid) or next(y for y in self.new_pp if y.startswith('<hh:paraPr id="%s"' % pid))
        nid = str(max(map(int, self.pp)) + 1 + len(self.new_pp))
        x = re.sub(r'<hh:paraPr id="\d+"', '<hh:paraPr id="%s"' % nid, x, count=1)
        x = x.replace('breakNonLatinWord="BREAK_WORD"', 'breakNonLatinWord="KEEP_WORD"')
        self.new_pp.append(x); self.ppcache[key] = nid
        return nid


def build(saved, lv, lines_adj, dst, check=None, flow=False, answers=False):
    """saved = 한글로 저장한 선생님 파일, lv = {쪽: 정도}, lines_adj = {쪽: 넣는 칸에서 뺄 줄 수}"""
    global RNG
    RNG = random.Random(20261021)
    Z = zipfile.ZipFile(saved)
    s = Z.read('Contents/section0.xml').decode('utf-8')
    hx = Z.read('Contents/header.xml').decode('utf-8')
    TH = LHead(hx)
    H_ = TH
    b0 = s.index('<hs:sec'); body = s[b0:]
    T = tops_of(body)
    G, fill = geometry(saved)
    C = [body[a:e] for a, e in T]
    used = set(re.findall(r'<hp:p id="(\d+)"', s)); rnd = random.Random(20261020)
    def idgen():
        while True:
            n = str(rnd.randint(1000000, 2147483646))
            if n not in used:
                used.add(n); yield n
    ids = idgen()
    after = {}; drop = set(); log = []
    pages = sorted(set(g['page'] for g in G))
    L = (lambda pg: 0) if flow else (lambda pg: lv.get(pg, 0))

    # ---- 1. 문제 칸 표·번호 내어쓰기·줄 나눔 (쪽마다 정도에 따라)
    nfb = 0
    for i, c in enumerate(C):       # 마당·단원 여는 쪽, 마당을 시작하며, 확인 평가는 늘 새 쪽(앞 쪽이 줄어도 올라오지 않게)
        t = text(c).strip()
        if re.search(r'^체스 학습관\d마당|^\d마당을 시작하며|^\d마당\d+단원|^확인 평가\d마당', t) and not re.match(r'<hp:p [^>]*pageBreak="1"', c):
            if i and re.match(r'<hp:p [^>]*pageBreak="1"', C[i - 1]) and not text(C[i - 1]).strip(): continue
            C[i] = re.sub(r'pageBreak="0"', 'pageBreak="1"', c, count=1); nfb += 1
    log.append('여는 쪽 앞에 쪽 나눔 %d곳 더함' % nfb)
    nshrink, nmove, nk = fit_examples(C, G), 0, 0
    nmove = nshrink[1]; nshrink = nshrink[0]
    nsplit = nb = 0
    for i, g in enumerate(G):
        k = L(g['page']); p = C[i]
        # 문제 칸 표는 쪽마다 늘 '문제 줄 + 그림 줄'(문제 시작·그림 위치가 줄마다 같음, 2026-10-21 선생님 요청). 빠듯한 쪽은 다른 곳을 줄임:
        # 1 쪽 안 빈 문단 빼기 · 2 + 표 안 번호 내어쓰기 안 함 · 3 + 정리해요 쓰는 칸 빈 줄 하나 빼기·장면 설명 그대로 · 4 + 문제 글 줄 간격 130→115%
        p, n = tidy.split_grids(p, TH, ids); nsplit += n
        if k < 2:
            p, _ = tidy.numbered(p, TH)
        else:
            p = outside_tables(p, lambda x: tidy.numbered(x, TH)[0])
        if k >= 3 and '정리해요' in text(p):
            m = re.search(r'(<hp:subList [^>]*vertAlign="TOP"[^>]*>)(<hp:p [^>]*paraPrIDRef="27"[^>]*><hp:run charPrIDRef="\d+"><hp:t> </hp:t></hp:run></hp:p>)(<hp:p [^>]*paraPrIDRef="27"[^>]*><hp:run charPrIDRef="\d+"><hp:t> </hp:t></hp:run></hp:p>)', p)
            if m: p = p[:m.start(3)] + p[m.end(3):]
        if k >= 4:
            p = re.sub(r'<hp:tbl [^>]*rowCnt="2" colCnt="3".*?</hp:tbl>', lambda m: re.sub(
                r'(<hp:p [^>]*paraPrIDRef=")(\d+)("[^>]*><hp:run charPrIDRef="\d+"><hp:t>\d+  </hp:t>)',
                lambda q: q.group(1) + TH.ppvar(q.group(2), ls=115) + q.group(3), m.group(0)), p, flags=re.S)
        p = polish(p, TH, caps=k < 3)
        t = text(p).strip()
        if (t == '배워요' or t.startswith(('예시로 보기', '풀어 봐요', '오늘의 목표')) or re.match(r'예시 \d+  ', t)
                or (re.match(r'\d+차시', t) and i + 1 < len(C) and text(C[i + 1]).startswith('오늘의 목표'))):
            pid = re.match(r'<hp:p [^>]*paraPrIDRef="(\d+)"', p).group(1)      # 제목은 다음 문단과 함께(쪽 끝에 홀로 남지 않게)
            p = re.sub(r'paraPrIDRef="%s"' % pid, 'paraPrIDRef="%s"' % TH.ppvar(pid, kwn=True), p, count=1); nk += 1
        p = re.sub(r'(<hp:tbl [^>]*?pageBreak=")\w+', r'\1NONE', p)            # 표는 쪽에서 쪼개지지 않게
        if k >= 1 and i + 1 < len(G) and G[i + 1]['page'] == g['page']:
            if (not re.search(r'<hp:t>[^<]*\S', p) and not re.search(r'<hp:(tbl|pic|ctrl|rect|container)', p)
                    and not re.match(r'<hp:p [^>]*pageBreak="1"', p)):
                drop.add(i)
        C[i] = p
    log.append('문제 칸 표 %d개를 모두 두 줄로(문제 줄·그림 줄)' % nsplit)
    log.append('배워요 아래에 예시로 보기 싣기: 그림을 줄인 차시 %d · 쪽 나눔을 없앤 곳 %d · 다음 문단과 함께 둔 제목 %d' % (nshrink, nmove, nk))
    tight = {pg: k for pg, k in lv.items() if k}
    if tight: log.append('빠듯한 쪽 %d곳(정도별 %s)' % (len(tight), {k: sum(1 for v in tight.values() if v == k) for k in sorted(set(tight.values()))}))

    # ---- 차례·마당·단원·차시 정보(본문에서 읽음)
    toc = {}; no = 0
    for i, p in enumerate(C[:140]):
        t = text(p).rstrip()
        m = re.match(r'(\d)마당\s{2,}(.+?)\s+\d+$', t)
        if m: no = int(m.group(1)); toc[no] = dict(title=m.group(2), units=[]); continue
        m = re.match(r'\s*(\d+)단원\s+(.+?)\s+\d+$', t)
        if m and no: toc[no]['units'].append((int(m.group(1)), m.group(2)))
    lessons = {}; cur_m = cur_u = 0
    for i, p in enumerate(C):
        t = text(p)
        m = re.search(r'체스 학습관(\d)마당', t)
        if m: cur_m = int(m.group(1))
        m = re.match(r'(\d)마당(\d+)단원', t)
        if m: cur_m, cur_u = int(m.group(1)), int(m.group(2))
        m = re.match(r'(\d+)차시(.+)$', t.strip())
        if m and cur_u and i + 1 < len(C) and text(C[i + 1]).startswith('오늘의 목표'):
            lessons.setdefault((cur_m, cur_u), []).append((int(m.group(1)), m.group(2).strip()))
    accs = {}; cur_m = 0
    for i, p in enumerate(C):
        m = re.search(r'체스 학습관(\d)마당', text(p))
        if m: cur_m = int(m.group(1))
        if cur_m and cur_m not in accs and '<hp:t>정리해요</hp:t>' in p:
            m = re.search(r'borderFillIDRef="(\d+)"><hp:subList[^>]*><hp:p [^>]*><hp:run charPrIDRef="(\d+)"><hp:t>정리해요</hp:t>', p)
            if m: accs[cur_m] = (m.group(1), m.group(2))
    accs[0] = accs[1]

    # ---- 2. 앞쪽 3쪽
    def find(pred, start=0):
        return next(i for i in range(start, len(C)) if pred(text(C[i]).strip(), C[i]))
    sp = lambda: para(None, 27, 57)
    def add(i, x): after[i] = after.get(i, '') + x
    i_sig = find(lambda t, p: t == '초등교사 홍지희')
    i_wel = find(lambda t, p: t.startswith('체스의 세계에 온 것을'))
    add(i_wel, sp() + para(PREFACE_HIST, 28, 35))
    x = sp() + para('체스를 하면 이런 힘이 자라요', 27, 41)
    for a, b in PREFACE_POWER: x += para('• %s — %s' % (a, b), 36, 35)
    add(i_sig - 2, x + sp() + para(PREFACE_PARENT, 28, 35))
    i_last = find(lambda t, p: t.startswith('• 화살표는 말이 움직이는 길'))
    t3, _ = grid_table(PIECES[0], PIECES[1:], [7937, 6000, 6000, 6000, 6000, 6000, 6000], H_)
    add(i_last, sp() + para('체스 말 한눈에 보기', 27, 41) + t3 + para('값은 말의 힘을 어림한 수예요. 킹은 잡히면 지는 말이라 값을 매기지 않아요.', 28, 39))
    i_str = find(lambda t, p: t.endswith('이 책의 짜임') and '<hp:footer' in p, i_sig)
    j = max(i for i, g in enumerate(G) if g['page'] == G[i_str]['page'])
    data = [('%d마당' % n, toc[n]['title'], GRADES[n - 1], '      월      일') for n in range(1, 7)]
    t4, _ = grid_table(('마당', '배우는 것', '등급', '받은 날'), data, [6500, 21437, 6500, 9500], H_)
    add(j, sp() + para('나의 등급 기록', 27, 41) + para('마당 확인 평가를 마치고 학습관 확인 시험을 통과하면 등급을 받아요. 받은 날을 적어 보세요.', 28, 39) + t4)
    log.append('앞쪽: 머리말(체스 이야기·자라는 힘·부모님께), 이 책을 쓰는 방법(체스 말 한눈에 보기), 이 책의 짜임(나의 등급 기록) 더함')

    # ---- 3. 본문의 빈 쪽 채우기
    start_pg = G[find(lambda t, p: t.startswith('1마당을 시작하며'))]['page']
    end_pg = G[find(lambda t, p: t.startswith('정답과 풀이'), len(C) // 2)]['page']
    fillers = {}; madang = 0; kinds = {}
    for pg in pages:
        idx = [i for i, g in enumerate(G) if g['page'] == pg and g['last'] == pg]
        if not idx: continue
        tx = ' '.join(text(C[i]) for i in idx)
        m = re.search(r'(\d)마당을 시작하며', tx)
        if m: madang = int(m.group(1))
        mm = [int(k) for k in re.findall(r'체스 학습관(\d)마당', tx)]
        if mm: madang = mm[-1]
        if pg < start_pg or pg >= end_pg or re.search(r'체스 학습관\d마당', tx): continue
        free = H - fill.get(pg, 0) - SLACK
        if H - fill.get(pg, 0) < MIN_FILL: continue
        acc = accs.get(madang, accs[0])
        adj = lines_adj.get(pg, 0)
        if flow and not (m or '단원 마무리' in tx):   # 이어 싣기: 쪽이 바뀌므로 마당·단원 마무리 쪽(앞뒤가 강제 쪽 나눔)에만
            continue
        if re.search(r'\d마당\d+단원', tx):     # 단원 여는 쪽: 알고 있는 것 · 알고 싶은 것
            lines = max(2, (free - TITLE_ROW - CHECK_ROW) // LINE_ROW - adj)
            x, h = kwl(lines, acc, H_); kind = '단원을 시작하며'
        elif m:
            units = toc[int(m.group(1))]['units']
            rows = [('□ %d단원  %s' % (u, nm), '다 배웠어요 □') for u, nm in units]
            lines = max(0, (free - TITLE_ROW - CHECK_ROW * len(rows)) // LINE_ROW) - adj
            if lines < 2:
                rows = rows[:max(0, (free - TITLE_ROW - 2 * LINE_ROW) // CHECK_ROW - max(0, adj - lines))]; lines = 2
            x, h = box('이 마당에서 배울 단원', '단원을 마칠 때마다 □에 ✓ 하고, 아래에 이 마당에서 해 보고 싶은 것을 적어요.', lines, acc, H_, rows); kind = '마당 단원 확인'
        elif '단원 마무리' in tx:
            mu = re.search(r'(\d+)단원 ', tx[tx.index('단원 마무리'):])
            ls = lessons.get((madang, int(mu.group(1)) if mu else 0), [])
            rows = [('%d차시  %s' % (k, nm), '□ 잘 알아요  □ 다시 볼래요') for k, nm in ls]
            if len(rows) > (free - TITLE_ROW - LINE_ROW) // CHECK_ROW - adj: rows = []
            lines = max(1, (free - TITLE_ROW - CHECK_ROW * len(rows)) // LINE_ROW - adj)
            if rows:
                x, h = box('차시 돌아보기', '차시마다 알맞은 곳에 ✓ 하고, ‘다시 볼래요’ 차시는 학습관에서 한 번 더 해 봐요.', lines, acc, H_, rows); kind = '차시 돌아보기'
            else:
                x, h = box('단원 돌아보기', '이 단원에서 가장 기억에 남는 것과 아직 헷갈리는 것을 적어 보세요.', lines, acc, H_); kind = '단원 돌아보기'
        else:
            continue    # '나의 체스 노트'는 넣지 않음(2026-10-21 선생님: 한 쪽 가득 노트만 남는 일이 생김)
            lines = (free - TITLE_ROW) // LINE_ROW - adj
            if lines < 3: continue
            x, h = box('나의 체스 노트', '오늘 배운 것, 궁금한 것, 헷갈린 것을 글이나 그림으로 남겨 보세요.', lines, acc, H_); kind = '나의 체스 노트'
        add(idx[-1], para(None, 27, 57) + x)
        fillers[pg] = lines; kinds[kind] = kinds.get(kind, 0) + 1
    log.append('빈 쪽 %d곳에 칸을 넣음 %s' % (len(fillers), kinds))

    # ---- 4. 글 고치기
    nfix = 0
    for i in range(len(C)):
        if '1~1번은 따라 하기' in C[i] or '1~0번은 따라 하기, 그다음은 혼자 하기' in C[i]:
            C[i] = C[i].replace('1~1번은 따라 하기', '1번은 따라 하기').replace('1~0번은 따라 하기, 그다음은 혼자 하기', '모두 혼자 풀어요'); nfix += 1
        C[i] = C[i].replace('빨간 칸이나 는', '빨간 칸이나 X 표시는')
    log.append('풀어 봐요 안내 %d곳 고침(1~1번 → 1번 등)' % nfix)

    if flow or answers:
        log += flow_edits(C, TH, after, body=flow)

    def write(path, mark):
        CC = list(C)
        if mark:   # 미리보기 점검용: 한글이 쪽을 바꾼 자리마다 쪽 나눔
            firsts = {}
            for i, g in enumerate(G):
                if i not in drop: firsts.setdefault(g['page'], i)
            for i in firsts.values(): CC[i] = re.sub(r'pageBreak="0"', 'pageBreak="1"', CC[i], count=1)
        out = []
        for i, p in enumerate(CC):
            if i not in drop: out.append(p)
            if i in after: out.append(after[i])
        N = s[:b0] + body[:T[0][0]] + ''.join(out) + body[T[-1][1]:]
        N = re.sub(r'<hp:linesegarray>.*?</hp:linesegarray>', '', N, flags=re.S)
        hh = TH.out()
        tmp = path + '.tmp'
        with zipfile.ZipFile(tmp, 'w') as z:
            for zi in Z.infolist():
                data = N.encode('utf-8') if zi.filename == 'Contents/section0.xml' else hh.encode('utf-8') if zi.filename == 'Contents/header.xml' else Z.read(zi.filename)
                z.writestr(zipfile.ZipInfo(zi.filename, zi.date_time), data, compress_type=zi.compress_type)
        os.replace(tmp, path)
    write(dst, False)
    if check: write(check, True)
    return log, fillers


# ---------------------------------------------------------------- 이어 싣기·정답 촘촘하게 (2026-10-21 선생님이 고른 1·2번)
KEEP_BREAK = re.compile(r'체스 학습관\d마당|\d마당을 시작하며|\d마당\d+단원|확인 평가\d마당|^단원 마무리|^정답과 풀이|^용어 풀이')
ANS_PIC = 5102      # 정답 판 그림 18mm(본디 24mm)


def flow_edits(C, TH, after, body=True):
    """① 본문: 차시·예시로 보기·풀어 봐요(와 그 사이 손으로 넣은 쪽 나눔)를 앞 쪽에 이어 싣기 — 마당·단원 여는 쪽, 단원 마무리, 확인 평가는 새 쪽 그대로.
    제목(차시 띠·오늘의 목표·배워요·예시로 보기·예시 N·풀어 봐요)은 '다음 문단과 함께'로 쪽 끝에 홀로 남지 않게, 표는 쪽에서 쪼개지지 않게(나눔 안 함).
    ② 정답과 풀이: 판 그림 24 → 18mm, 한 줄 두 개 → 세 개"""
    log = []
    i0 = next(i for i, p in enumerate(C) if text(p).strip().startswith('1마당을 시작하며'))
    ia = next(i for i in range(len(C) // 2, len(C)) if text(C[i]).strip().startswith('정답과 풀이'))
    ig = next(i for i in range(ia, len(C)) if text(C[i]).strip().startswith('용어 풀이'))
    nb = nk = 0
    for i in (range(i0, ia) if body else ()):
        p = C[i]; t = text(p).strip()
        if re.match(r'<hp:p [^>]*pageBreak="1"', p):
            keep = KEEP_BREAK.search(t) or (not t and i + 1 < len(C) and KEEP_BREAK.search(text(C[i + 1]).strip()))
            if not keep:
                p = re.sub(r'pageBreak="1"', 'pageBreak="0"', p, count=1); nb += 1
                if re.match(r'\d+차시', t):       # 앞 차시와 사이를 조금 띄움
                    after[i - 1] = after.get(i - 1, '') + para(None, 27, 57) + para(None, 27, 57)
        head = (t in ('배워요',) or t.startswith(('예시로 보기', '풀어 봐요', '오늘의 목표')) or re.match(r'예시 \d+  ', t)
                or (re.match(r'\d+차시', t) and i + 1 < len(C) and text(C[i + 1]).startswith('오늘의 목표')))
        if head:
            pid = re.match(r'<hp:p [^>]*paraPrIDRef="(\d+)"', p).group(1)
            p = re.sub(r'paraPrIDRef="%s"' % pid, 'paraPrIDRef="%s"' % TH.ppvar(pid, kwn=True), p, count=1); nk += 1
        C[i] = re.sub(r'(<hp:tbl [^>]*?pageBreak=")\w+', r'\1NONE', p)
    if body: log.append('본문 강제 쪽 나눔 %d곳을 없애 이어 싣고, 제목 %d곳은 다음 문단과 함께 두기' % (nb, nk))
    nb2 = 0
    for i in range(ia + 1, len(C)):        # 정답과 풀이·용어 풀이 안에 손으로 넣은 쪽 나눔도 없앰(두 제목만 새 쪽)
        t = text(C[i]).strip()
        if re.match(r'<hp:p [^>]*pageBreak="1"', C[i]) and not t.startswith(('정답과 풀이', '용어 풀이')):
            C[i] = re.sub(r'pageBreak="1"', 'pageBreak="0"', C[i], count=1); nb2 += 1
        C[i] = re.sub(r'(<hp:tbl [^>]*?pageBreak=")\w+', r'\1NONE', C[i])
    log.append('정답과 풀이·용어 풀이의 강제 쪽 나눔 %d곳 없앰' % nb2)
    n_old = n_new = 0
    for i in range(ia, ig):
        x = answers_compact(C[i])
        if x != C[i]:
            n_old += C[i].count('<hp:tr>'); C[i] = x; n_new += x.count('<hp:tr>')
    # 이어진 정답 줄 표를 한 차시 안에서 다시 묶기
    i = ia
    while i < ig:
        if 'data-ans' not in C[i]:
            i += 1; continue
        j = i
        items = []
        while j < ig and ('data-ans' in C[j] or (not text(C[j]).strip() and '<hp:tbl' not in C[j] and j + 1 < ig and 'data-ans' in C[j + 1])):
            if 'data-ans' in C[j]:
                items += re.findall(r'<!--ans-->(.*?)<!--/ans-->', C[j], re.S)
            C[j] = ''
            j += 1
        C[i] = ans_rows(items)
        i = j
    log.append('정답과 풀이: 판 그림 18mm, 한 줄에 세 개씩')
    return log


def answers_compact(p):
    """정답 줄 표(번호 칸이 2개)에서 칸마다 (글 문단, 그림 문단) 꺼내 표시만 해 둠"""
    if '<hp:tbl' not in p or not re.search(r'<hp:t>\d+  </hp:t>', p): return p
    a = p.index('<hp:tr>'); e = p.rindex('</hp:tr>')
    cells = tidy.tops(p, a + len('<hp:tr>'), e, 'tc')
    items = []
    for ca, ce in cells:
        c = p[ca:ce]
        sub = c[c.index('>', c.index('<hp:subList')) + 1:c.rindex('</hp:subList>')]
        if '<hp:tbl' in sub:
            inner = sub[sub.index('<hp:tr>'):]
            ic = tidy.tops(inner, len('<hp:tr>'), len(inner), 'tc')
            ts = [inner[x:y] for x, y in ic]
            body = lambda q: q[q.index('>', q.index('<hp:subList')) + 1:q.rindex('</hp:subList>')]
            txt, pic = body(ts[0]), body(ts[1]) if len(ts) > 1 else ''
        else:
            txt, pic = sub, ''
        if not re.search(r'<hp:t>\d+  </hp:t>', txt): return p
        items.append(txt + '<!--pic-->' + pic)
    return '<!--data-ans-->' + ''.join('<!--ans-->%s<!--/ans-->' % x for x in items)


def small_pic(q):
    w = ANS_PIC
    q = re.sub(r'<hp:sz width="\d+" widthRelTo="ABSOLUTE" height="\d+"', '<hp:sz width="%d" widthRelTo="ABSOLUTE" height="%d"' % (w, w), q)
    q = re.sub(r'<hc:pt1 x="\d+" y="0"/><hc:pt2 x="\d+" y="\d+"/><hc:pt3 x="0" y="\d+"/>', '<hc:pt1 x="%d" y="0"/><hc:pt2 x="%d" y="%d"/><hc:pt3 x="0" y="%d"/>' % (w, w, w, w), q)
    return re.sub(r'centerX="\d+" centerY="\d+"', 'centerX="%d" centerY="%d"' % (w // 2, w // 2), q)


def ans_rows(items):
    """정답 칸을 한 줄에 세 개씩(그림 있는 칸은 글 | 그림 18mm)"""
    out = []
    cw = [14645, 14646, 14646]
    def tc(c, w, body, mg=(200, 300, 150, 150)):
        return cell(c, 0, w, body, '3', mg, 500, va='TOP')
    for k in range(0, len(items), 3):
        row = items[k:k + 3]; cs = []; tall = False
        for c, it in enumerate(row):
            txt, pic = it.split('<!--pic-->')
            if pic.strip():
                tall = True
                inner_w = cw[c] - 500; pw = ANS_PIC + 100
                inner = ('<hp:p id="%s" paraPrIDRef="29" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0"><hp:run charPrIDRef="0">'
                         '<hp:tbl id="%s" zOrder="%d" numberingType="TABLE" textWrap="TOP_AND_BOTTOM" textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" pageBreak="NONE" repeatHeader="0" rowCnt="1" colCnt="2" cellSpacing="0" borderFillIDRef="3" noAdjust="0">'
                         '<hp:sz width="%d" widthRelTo="ABSOLUTE" height="%d" heightRelTo="ABSOLUTE" protect="0"/>'
                         '<hp:pos treatAsChar="1" affectLSpacing="0" flowWithText="1" allowOverlap="0" holdAnchorAndSO="0" vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/>'
                         '<hp:outMargin left="0" right="0" top="0" bottom="0"/><hp:inMargin left="0" right="0" top="0" bottom="0"/><hp:tr>%s%s</hp:tr></hp:tbl><hp:t/></hp:run></hp:p>'
                         ) % (nid(), nid(), RNG.randrange(2000, 9000), inner_w, ANS_PIC, cell(0, 0, inner_w - pw, txt, '3', (0, 200, 0, 0), 500, va='TOP'),
                              cell(1, 0, pw, small_pic(pic), '3', (0, 0, 0, 0), 500, va='TOP'))
                cs.append(tc(c, cw[c], inner))
            else:
                cs.append(tc(c, cw[c], txt))
        for c in range(len(row), 3):
            cs.append(tc(c, cw[c], para(None, 27, 57)))
        h = ANS_PIC + 300 if tall else 1300
        out.append('<hp:p id="%s" paraPrIDRef="29" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0"><hp:run charPrIDRef="0">'
                   '<hp:tbl id="%s" zOrder="%d" numberingType="TABLE" textWrap="TOP_AND_BOTTOM" textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" pageBreak="NONE" repeatHeader="0" rowCnt="1" colCnt="3" cellSpacing="0" borderFillIDRef="3" noAdjust="0">'
                   '<hp:sz width="43937" widthRelTo="ABSOLUTE" height="%d" heightRelTo="ABSOLUTE" protect="0"/>'
                   '<hp:pos treatAsChar="1" affectLSpacing="0" flowWithText="1" allowOverlap="0" holdAnchorAndSO="0" vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/>'
                   '<hp:outMargin left="0" right="0" top="0" bottom="0"/><hp:inMargin left="0" right="0" top="0" bottom="0"/><hp:tr>%s</hp:tr></hp:tbl><hp:t/></hp:run></hp:p>'
                   % (nid(), nid(), RNG.randrange(2000, 9000), h, ''.join(cs)))
    return ''.join(out)


def main_flow(saved, dst):
    log, _ = build(saved, {}, {}, dst, None, flow=True)
    for l in log: print(l)


# ---------------------------------------------------------------- 미리보기로 쪽 높이 재기(크로미움)
MJS = r"""
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 900, height: 1200 } });
  await pg.goto('file://' + process.argv[2]); const r = await pg.evaluate(() => [...document.querySelectorAll('.pg')].map(s => s.querySelector('.flow').scrollHeight));
  console.log(JSON.stringify(r)); await b.close(); })();"""


def measure(path, work, breakall=False):
    import preview
    doc, n = preview.render(path, None)
    if breakall: doc = doc.replace('word-break:keep-all', 'word-break:break-all')
    hf = os.path.join(work, 'm.html'); open(hf, 'w', encoding='utf-8').write(doc)
    js = os.path.join(work, 'm.js'); open(js, 'w').write(MJS)
    r = subprocess.run(['node', js, os.path.abspath(hf)], capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-1500:])
    return [h * 25.4 / 96 for h in json.loads(r.stdout.strip().splitlines()[-1])]


LIMIT = 230.5     # 이 높이(mm)를 넘을 것 같으면 그 쪽은 덜 바꿈


def main(saved, dst, work):
    os.makedirs(work, exist_ok=True)
    G, fill = geometry(saved)
    bp = os.path.join(work, 'base.json')
    if os.path.exists(bp):
        hb = json.load(open(bp))
    else:
        raw = os.path.join(work, 'raw.hwpx'); mark_only(saved, raw)
        hb = measure(raw, work, breakall=True); json.dump(hb, open(bp, 'w'))
    lv, adj = {}, {}
    lp = os.path.join(work, 'levels.json')
    if os.path.exists(lp):
        j = json.load(open(lp)); lv = {int(k): v for k, v in j['lv'].items()}; adj = {int(k): v for k, v in j['adj'].items()}
    for it in range(8):
        chk = os.path.join(work, 'chk.hwpx')
        log, fillers = build(saved, lv, adj, dst, chk)
        hc = measure(chk, work)
        bad = []
        for pg in range(1, len(hb) + 1):
            if pg > len(hc) or hb[pg - 1] < 20: continue
            pred = fill.get(pg, 0) / MM + hc[pg - 1] - hb[pg - 1]
            if pred > LIMIT and lv.get(pg, 0) < 4: bad.append((pg, round(pred, 1)))   # 4는 더 줄일 것이 없음(한글에서 확인)
        print('[%d차] 넘칠 것 같은 쪽 %d곳' % (it + 1, len(bad)), bad[:12])
        json.dump(dict(lv=lv, adj=adj), open(lp, 'w'))
        if not bad: break
        for pg, pred in bad:
            if pg in fillers:
                adj[pg] = adj.get(pg, 0) + int((pred - LIMIT) * MM // LINE_ROW) + 1
            elif lv.get(pg, 0) < 4:
                lv[pg] = lv.get(pg, 0) + 1
    for l in log: print(l)
    if bad: print('[확인] 그래도 빠듯한 쪽(한글에서 확인):', bad)
    json.dump(dict(lv=lv, adj=adj), open(os.path.join(work, 'levels.json'), 'w'))


def mark_only(saved, path):
    """선생님 파일 그대로 + 쪽 나눔 표시(기준 높이 재기용)"""
    G, fill = geometry(saved)
    Z = zipfile.ZipFile(saved); s = Z.read('Contents/section0.xml').decode('utf-8')
    b0 = s.index('<hs:sec'); body = s[b0:]; T = tops_of(body)
    C = [body[a:e] for a, e in T]
    firsts = {}
    for i, g in enumerate(G): firsts.setdefault(g['page'], i)
    for i in firsts.values(): C[i] = re.sub(r'pageBreak="0"', 'pageBreak="1"', C[i], count=1)
    N = s[:b0] + body[:T[0][0]] + ''.join(C) + body[T[-1][1]:]
    N = re.sub(r'<hp:linesegarray>.*?</hp:linesegarray>', '', N, flags=re.S)
    with zipfile.ZipFile(path, 'w') as z:
        for zi in Z.infolist():
            z.writestr(zipfile.ZipInfo(zi.filename, zi.date_time), N.encode('utf-8') if zi.filename == 'Contents/section0.xml' else Z.read(zi.filename), compress_type=zi.compress_type)


if __name__ == '__main__':
    # python3 layout.py 한글로저장한파일.hwpx 출력.hwpx 작업폴더   (쪽마다 맞추기, 쪽 수 그대로)
    # python3 layout.py flow 한글로저장한파일.hwpx 출력.hwpx       (이어 싣기·정답 촘촘하게 — 선생님이 써 보고 취소함)
    # python3 layout.py ans 한글로저장한파일.hwpx 출력.hwpx 작업폴더  (쪽마다 맞춘 본문 + 정답 촘촘하게 — 지금 쓰는 것)
    if sys.argv[1] == 'ans':      # 본문은 쪽마다 맞춘 그대로(작업폴더/levels.json), 정답과 풀이만 촘촘하게 — 2026-10-21 선생님: 이어 싣기는 취소
        j = json.load(open(os.path.join(sys.argv[4], 'levels.json')))
        log, _ = build(sys.argv[2], {int(k): v for k, v in j['lv'].items()}, {int(k): v for k, v in j['adj'].items()}, sys.argv[3], None, answers=True)
        for l in log: print(l)
    elif sys.argv[1] == 'flow':
        main_flow(sys.argv[2], sys.argv[3])
    else:
        main(sys.argv[1], sys.argv[2], sys.argv[3])
