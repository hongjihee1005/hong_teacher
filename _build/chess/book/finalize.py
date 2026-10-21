# -*- coding: utf-8 -*-
"""한글로 저장한 '체스 학습관 1~6마당' 한 권을 실제 줄 정보(linesegarray)로 마지막 점검·정리 (2026-10-21 선생님 요청 '전부 확인')

    python3 _build/chess/book/finalize.py 한글로저장한파일.hwpx 출력.hwpx [보고서.txt]

1. 줄 나눔: 아직 글자 단위(KEEP_WORD)로 남은 문단 모양을 모두 낱말 단위(BREAK_WORD — 한글은 이름이 반대)로.
   한글이 실제로 나눈 줄(글자 단위)에서 한 줄에 들어가는 폭을 재고, 낱말 단위로 다시 나눴을 때 늘어나는 줄 수를 셈.
2. 외톨이 낱말: 마지막 줄에 1~3글자만 남는 문단은 자간을 −3 ~ −9%로 좁혀 앞 줄로(같은 방법으로 줄 수를 다시 셈).
3. 쪽 넘침: 한글과 똑같이 쪽을 나누는 계산(`paginate`, 저장된 파일로 551쪽 그대로 재현함)에 늘어난 높이를 더해,
   한 쪽짜리여야 할 블록(차시·예시로 보기·풀어 봐요·단원 마무리)이 다음 쪽으로 넘치면 그 블록 그림을 넘친 만큼만 줄임(55%까지).
4. 쪽 번호: 같은 계산으로 새 쪽을 매겨 CONTENT·용어 풀이 '(N쪽)'을 고침. 학생용 쪽 표시는 `marks.json`으로 남겨 지도서에 씀.
줄 정보는 지우므로(한글이 열 때 다시 계산) 한글에서 한 번 저장해 보내 주면 다시 점검할 수 있음.
"""
import re, sys, os, json, zipfile, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import layout
from layout import geometry, text, H, MM, PICRE, scale_pics, tops_of

LIMIT = H + 5


def pbreak(p):
    return re.match(r'<hp:p [^>]*pageBreak="1"', p) is not None


def psize(g):
    s = g['segs']
    if not s: return 0
    return max(v + h for v, h, sp in s) - min(v for v, h, sp in s) + s[-1][2]


def paginate(G, sizes, segs=None):
    """한글처럼 쪽 나누기: 강제 쪽 나눔, 넘치면 다음 쪽(표·그림 문단은 통째로, 글 문단은 줄 단위)"""
    page = 1; used = 0; pg = []
    for i, g in enumerate(G):
        s = sizes[i]; sg = (segs or {}).get(i, g['segs'])
        tail = sg[-1][2] if sg else 0
        if i and pbreak(g['p']): page += 1; used = 0
        if used + s - tail > LIMIT and used > 0:
            if '<hp:tbl' in g['p'] or '<hp:pic' in g['p'] or len(sg) <= 1:
                page += 1; used = 0
            else:
                p0 = None
                for v, h_, sp in sg:
                    if used + h_ > LIMIT and used > 0: page += 1; used = 0
                    if p0 is None: p0 = page
                    used += h_ + sp
                pg.append(p0); continue
        pg.append(page); used += s
    return pg


# ---------------------------------------------------------------- 글자 폭과 줄 나눔
def chars_of(p):
    """문단의 글자 차례(한글 textpos와 같은 셈: 묶음 빈칸·탭·줄 바꿈도 한 글자) — (글자, 글자 모양)"""
    out = []
    for m in re.finditer(r'<hp:run charPrIDRef="(\d+)">(.*?)</hp:run>|<hp:run charPrIDRef="(\d+)"/>', p, re.S):
        cid, body = m.group(1), m.group(2) or ''
        for t in re.finditer(r'<hp:t>(.*?)</hp:t>|<hp:t/>', body, re.S):
            seg = t.group(1) or ''
            for x in re.finditer(r'<hp:(nbSpace|tab|lineBreak|fwSpace|hyphen)[^>]*/>|([^<])', seg):
                ch = {'nbSpace': ' ', 'tab': '\t', 'lineBreak': '\n', 'fwSpace': '　', 'hyphen': ''}.get(x.group(1), x.group(2))
                if ch: out.append((ch, cid))
    return out


# 글자 폭(글자 크기에 대한 비율) — 한글로 저장한 이 책의 줄 1,460개로 맞춤(낱말 단위 줄 나눔 97.8% 재현, 2026-10-21)
W = dict(hg=1.0, sp=0.5, dg=0.7, lt=0.6, pc=0.35, br=0.4, p2=0.5, tab=3.0)


def cat(c):
    if c in ' \u00a0': return 'sp'
    if c.isdigit(): return 'dg'
    if c.isascii() and c.isalpha(): return 'lt'
    if c in '.,': return 'pc'
    if c in '()[]': return 'br'
    if c in '·:;!?\'"‘’“”~-': return 'p2'
    if c == '\t': return 'tab'
    return 'hg'


def wrap(cs, caps, sp=0.0, word=True):
    """cs = [(글자, 폭em, 글자 크기pt)], caps = 줄마다 폭(마지막 값이 계속), sp = 자간(em 비율) — 줄 수와 마지막 줄 글자"""
    units = []; cur = []
    for ch, e, pt in cs:
        if ch == '\n':
            if cur: units.append(cur)
            units.append('BR'); cur = []; continue
        cur.append((ch, (e + sp) * pt))
        if not word or ch == ' ':
            units.append(cur); cur = []
    if cur: units.append(cur)
    lines = 1; used = 0.0; last = ''
    cap = lambda n: caps[min(n - 1, len(caps) - 1)]
    for u in units:
        if u == 'BR':
            lines += 1; used = 0.0; last = ''; continue
        ww = sum(w for c, w in u if c != ' '); full = sum(w for c, w in u)
        if used and used + ww > cap(lines) + 1e-6:
            lines += 1; used = 0.0; last = ''
        if ww > cap(lines) and not used:          # 한 줄보다 긴 낱말은 글자 단위로
            for c, w in u:
                if used + w > cap(lines) and used: lines += 1; used = 0.0; last = ''
                used += w; last += c
            continue
        used += full; last += ''.join(c for c, w in u)
    return lines, last.strip()


def para_model(p, segs, TH):
    """문단 글자들(글자, 폭 비율, 글자 크기 pt, 자간 %)과 줄마다 폭(pt = HWPUNIT/100)"""
    cs = chars_of(p)
    if not cs or '<hp:linesegarray' not in p: return None
    la = p[p.rfind('<hp:linesegarray'):]
    pos = [int(x) for x in re.findall(r'textpos="(\d+)"', la)]
    hz = [int(x) for x in re.findall(r'horzsize="(\d+)"', la)]
    if not pos or len(pos) != len(segs) or pos[-1] > len(cs): return None
    ems = []
    for c, cid in cs:
        h, r, sp = TH.cinfo.get(cid, (1000, 100, 0))
        ems.append((c, W[cat(c)] * r / 100.0 + sp / 100.0, h / 100.0))
    return ems, [x / 100.0 for x in hz], pos


# ---------------------------------------------------------------- 머리(문단·글자 모양)
class Head(layout.LHead):
    def __init__(self, h):
        super().__init__(h)
        self.cinfo = {m.group(1): (int(m.group(2)), int(m.group(3)), int(m.group(4))) for m in
                      re.finditer(r'<hh:charPr id="(\d+)" height="(\d+)".*?<hh:ratio hangul="(\d+)".*?<hh:spacing hangul="(-?\d+)"', h, re.S)}


def main(src, dst, rep=None):
    Z = zipfile.ZipFile(src)
    s = Z.read('Contents/section0.xml').decode('utf-8')
    hx = Z.read('Contents/header.xml').decode('utf-8')
    TH = Head(hx)
    G, fill = geometry(src)
    b0 = s.index('<hs:sec'); body = s[b0:]
    TT = tops_of(body)
    C = [body[a:e] for a, e in TT]
    assert len(C) == len(G)
    T = [text(c).strip() for c in C]
    keep = set(m.group(1) for m in re.finditer(r'<hh:paraPr id="(\d+)"[^>]*>(?:(?!</hh:paraPr>).)*?breakNonLatinWord="KEEP_WORD"', hx, re.S))
    log = []

    # ---- 1·2. 문단마다(표 안 문단 포함) 줄 수 변화와 외톨이 낱말
    nchg = norph = nfail = 0; fails = []; nchoice = [0]
    para_re = re.compile(r'<hp:p [^>]*paraPrIDRef="(\d+)"[^>]*>(?:(?!<hp:p ).)*?</hp:linesegarray></hp:p>', re.S)
    sizes = [psize(g) for g in G]
    newsegs = {}
    def fix_para(m):
        nonlocal nchg, norph, nfail, fails
        p = m.group(0)
        if '<hp:tbl' in p or '<hp:pic' in p: return p
        segs = [(int(a), int(b), int(c)) for a, b, c in re.findall(r'vertpos="(-?\d+)" vertsize="(\d+)" textheight="\d+" baseline="\d+" spacing="(\d+)"', p)]
        md = para_model(p, segs, TH)
        if not md: return p
        ems, caps, pos = md
        n_old = len(segs)
        if sum(1 for c, e, pt in ems if c.strip()) < 12: return p
        n_new, last = wrap(ems, caps)
        if m.group(1) in keep:
            if n_new != n_old: nchg += 1
        else:                       # 이미 낱말 단위: 한글이 나눈 줄을 그대로 믿고, 계산이 한글과 같을 때만 외톨이를 고침
            if n_new != n_old: return p
            last = ''.join(c for c, e, pt in ems[pos[-1]:])
        out = p
        # 보기(① …)가 한 줄에 안 들어가 엉뚱하게 갈라지면: 탭으로 칸을 맞춰 두 개씩(안 되면 한 줄에 하나씩)
        flat = ''.join(c for c, e, pt in ems)
        if flat.startswith('①') and n_new >= 2 and '\t' not in flat and '\n' not in flat:
            items = [x.strip() for x in re.split(r'\s{2,}(?=[②③④⑤⑥⑦⑧])', flat.replace('\u00a0', ' ')) if x.strip()]
            if len(items) >= 2:
                wid = lambda x: sum(W[cat(c)] * ems[0][2] for c in x) * 1.05
                half = caps[0] / 2
                per = 2 if max(wid(x) for x in items) <= half - 1 else 1
                rows = [items[k:k + per] for k in range(0, len(items), per)]
                nb = lambda x: x.replace(' ', '<hp:nbSpace/>')
                bodyx = '<hp:lineBreak/>'.join('<hp:tab/>'.join(nb(x) for x in rw) for rw in rows)
                r = re.match(r'(<hp:p [^>]*paraPrIDRef=")(\d+)("[^>]*><hp:run charPrIDRef="\d+">)<hp:t>.*?</hp:t>(</hp:run>)', out, re.S)
                if r:
                    pid = TH.ppvar(r.group(2), tab=TH.tabpr([int(half * 100)])) if per == 2 else r.group(2)
                    out = r.group(1) + pid + r.group(3) + '<hp:t>' + bodyx + '</hp:t>' + r.group(4) + out[r.end():]
                    nlines = len(rows)
                    if nlines != n_old:
                        lh = segs[0][1] + segs[0][2]
                        out = out.replace('<hp:linesegarray>', '<hp:linesegarray data-delta="%d">' % ((nlines - n_old) * lh), 1)
                    nchoice[0] += 1
                    return out
        # 외톨이 낱말(마지막 줄 1~3글자, 문장 부호는 빼고 셈) → 자간을 좁혀 앞 줄로
        core = re.sub(r'[\s.,!?·:;()\'"‘’“”]', '', last)
        if '\n' in ''.join(c for c, e, pt in ems[-len(last) - 2:]):    # 줄 바꿈으로 일부러 나눈 마지막 줄(용어 풀이 '(N쪽)' 등)은 그대로
            core = ''
        if n_new >= 2 and 0 < len(core) <= 3:
            done = False
            for spc in (-3, -5, -7, -9):
                n2, _ = wrap(ems, caps, sp=spc / 100.0)
                if n2 < n_new:
                    out = re.sub(r'<hp:run charPrIDRef="(\d+)">', lambda q: '<hp:run charPrIDRef="%s">' % TH.charsp(q.group(1), max(-12, TH.cinfo.get(q.group(1), (0, 0, 0))[2] + spc)), out)
                    n_new = n2; norph += 1; done = True; break
            if not done:        # 좁혀서 안 되면 조금 넓혀 앞 줄의 낱말 하나를 마지막 줄로 데려옴(줄 수는 그대로)
                for spc in (2, 4, 6, 8):
                    n2, l2 = wrap(ems, caps, sp=spc / 100.0)
                    if n2 == n_new and len(re.sub(r'[\s.,!?·:;()\'"‘’“”]', '', l2)) > 3:
                        out = re.sub(r'<hp:run charPrIDRef="(\d+)">', lambda q: '<hp:run charPrIDRef="%s">' % TH.charsp(q.group(1), min(10, TH.cinfo.get(q.group(1), (0, 0, 0))[2] + spc)), out)
                        norph += 1; done = True; break
            if not done: nfail += 1; fails.append(''.join(c for c, e, pt in ems)[:40] + ' | ' + last)
        if n_new != n_old:
            lh = segs[0][1] + segs[0][2]
            out = out.replace('<hp:linesegarray>', '<hp:linesegarray data-delta="%d">' % ((n_new - n_old) * lh), 1)
        return out
    for i in range(len(C)):
        C[i] = para_re.sub(fix_para, C[i])
    log.append('낱말 단위로 바꿔 줄 수가 달라지는 문단 %d · 외톨이 낱말 고침 %d (자간으로 못 고친 곳 %d)' % (nchg, norph, nfail))
    log.append('보기 줄 맞춤 %d곳' % nchoice[0])
    log.append('  못 고친 곳 보기: ' + ' / '.join(fails[:25]))

    # ---- 바뀐 높이를 바깥 문단으로 모음(표는 줄마다 가장 많이 늘어난 칸만큼)
    def grow(i):
        p = C[i]
        if 'data-delta' not in p: return 0
        if '<hp:tbl' not in p:
            return sum(int(x) for x in re.findall(r'data-delta="(-?\d+)"', p))
        tot = 0
        for tr in re.findall(r'<hp:tr>(.*?)</hp:tr>', p, re.S):
            ds = [sum(int(x) for x in re.findall(r'data-delta="(-?\d+)"', tc)) for tc in re.findall(r'<hp:tc .*?</hp:tc>', tr, re.S)]
            tot += max(ds + [0])
        return tot
    for i in range(len(C)):
        d = grow(i)
        if d: sizes[i] = max(0, sizes[i] + d)

    # ---- 차시 글 중간에 손으로 넣은 쪽 나눔(예: '작전 하나')은 없앰 — 차시 블록이 한 쪽에 들어가게 아래에서 맞춤
    okb = re.compile(r'^\d+차시|^예시로 보기|^풀어 봐요|^단원 마무리|^체스 학습관|^\d마당을 시작하며|^\d마당\d+단원|^확인 평가|^정답과 풀이|^용어 풀이|^\d마당 ·|^\d+  ')
    ncl = 0
    i1 = next(i for i in range(len(C)) if re.match(r'\d마당을 시작하며', T[i]))
    i2 = next(i for i in range(len(C) // 2, len(C)) if T[i].startswith('정답과 풀이'))
    for i in range(i1 + 1, i2):
        if pbreak(C[i]) and T[i] and not okb.search(T[i]):
            C[i] = re.sub(r'pageBreak="1"', 'pageBreak="0"', C[i], count=1); G[i]['p'] = C[i]; ncl += 1
    nblank = 0
    for i in range(len(C) - 1):      # 꼬리말 설정 문단만 있는 빈 쪽(바로 다음 문단도 새 쪽) — 다음 문단을 같은 쪽으로
        if pbreak(C[i]) and '<hp:ctrl' in C[i] and len(T[i]) < 30 and pbreak(C[i + 1]) and '<hp:tbl' not in C[i]:
            C[i + 1] = re.sub(r'pageBreak="1"', 'pageBreak="0"', C[i + 1], count=1); G[i + 1]['p'] = C[i + 1]; nblank += 1
    log.append('차시 글 중간의 쪽 나눔 %d곳 · 꼬리말만 있던 빈 쪽 %d곳 없앰' % (ncl, nblank))

    # ---- 새 쪽 바로 앞의 빈 문단(쪽이 꽉 찼을 때 혼자 넘어가 빈 쪽을 만듦)은 뺌
    nempty = 0
    blank = lambda c: c and not re.search(r'<hp:t>[^<]*\S', c) and not re.search(r'<hp:(tbl|pic|ctrl|rect|container)', c) and not pbreak(c)
    for i in range(len(C) - 1):
        j = i + 1
        while j < len(C) and not C[j]: j += 1
        if blank(C[i]) and j < len(C) and pbreak(C[j]) and i > 0:
            C[i] = ''; sizes[i] = 0; G[i]['p'] = ''; nempty += 1
    log.append('새 쪽 앞의 빈 문단 %d개 뺌' % nempty)

    # ---- 3. 쪽 넘침: 한 쪽짜리 블록이 넘치면 그림을 넘친 만큼 줄임
    one = lambda t: re.match(r'\d+차시', t) or t.startswith(('예시로 보기', '풀어 봐요', '단원 마무리'))
    nfit = 0; left = []; two = []
    for it in range(4):
        starts = [i for i in range(len(C)) if i == 0 or pbreak(C[i])]
        pg = paginate(G, sizes)
        changed = False
        for k, a in enumerate(starts):
            b = starts[k + 1] if k + 1 < len(starts) else len(C)
            if pg[b - 1] == pg[a]: continue
            npg = pg[b - 1] - pg[a] + 1
            tail = sum(sizes[j] for j in range(a, b) if pg[j] == pg[b - 1])
            if not one(T[a]):          # 여러 쪽짜리 블록(확인 평가 등)은 마지막 쪽에 조금만 남았을 때 당겨 옴
                if tail > H * 0.3 or T[a].startswith(('정답과 풀이', '용어 풀이')): continue
                need = tail + 900
            else:
                tot = sum(sizes[a:b]); need = tot - (H - 900)
            red = 0
            for j in range(a, b):
                if '<hp:pic' not in C[j]: continue
                for tr in re.findall(r'<hp:tr>(.*?)</hp:tr>', C[j], re.S) or [C[j]]:
                    hs = [int(m.group(4)) for m in PICRE.finditer(tr)]
                    if hs: red += max(hs)
            if red <= 0: left.append((pg[a], T[a][:20])); continue
            f = 1 - need / red - 0.02
            if f < 0.55 and one(T[a]):     # 정리해요 쓰는 칸의 빈 줄을 빼고 다시(그림은 50%까지)
                for j in range(a, b):
                    if '<hp:t>정리해요</hp:t>' in C[j]:
                        n0 = C[j].count('<hp:t> </hp:t>')
                        C[j] = re.sub(r'<hp:p [^>]*paraPrIDRef="27"[^>]*><hp:run charPrIDRef="\d+"><hp:t> </hp:t></hp:run>(?:<hp:linesegarray[^>]*>.*?</hp:linesegarray>)?</hp:p>', '', C[j], flags=re.S)
                        cut = (n0 - C[j].count('<hp:t> </hp:t>')) * 1840
                        if cut: sizes[j] -= cut; need -= cut
                f = 1 - need / red - 0.02
                if f >= 0.5: f = max(f, 0.5)
                else: f = 0
            if f < 0.5:
                grids = [j for j in range(a, b) if re.search(r'<hp:tbl [^>]*colCnt="3"', C[j]) and re.search(r'<hp:t>\d+  </hp:t>', C[j])]
                if T[a].startswith('풀어 봐요') and len(grids) == 2 and not pbreak(C[grids[1]]):
                    # 글이 길어 그림으로는 못 맞추는 곳: 두 쪽으로 고르게(1~3번 / 4~6번 + 정리해요), 판은 44mm로 되돌림
                    for j in grids:
                        hs = [int(m.group(4)) for m in PICRE.finditer(C[j])]
                        if hs and max(hs) < 12472:
                            k2 = 12472 / max(hs); C[j] = scale_pics(C[j], k2); sizes[j] += int(max(hs) * (k2 - 1))
                    C[grids[1]] = re.sub(r'pageBreak="0"', 'pageBreak="1"', C[grids[1]], count=1); G[grids[1]]['p'] = C[grids[1]]
                    two.append(pg[a]); changed = True; continue
                left.append((pg[a], T[a][:20])); continue
            for j in range(a, b):
                if '<hp:pic' in C[j]:
                    before = sum(max([int(m.group(4)) for m in PICRE.finditer(tr)] or [0]) for tr in re.findall(r'<hp:tr>(.*?)</hp:tr>', C[j], re.S) or [C[j]])
                    C[j] = scale_pics(C[j], f)
                    sizes[j] -= int(before * (1 - f))
            nfit += 1; changed = True
        if not changed: break
    pg = paginate(G, sizes)
    # ---- 쓰는 칸(단원 돌아보기·차시 돌아보기·단원을 시작하며·이 마당에서 배울 단원)이 혼자 다음 쪽으로 넘어가면 줄 수를 줄여 앞 쪽에, 안 되면 뺌
    nbox = [0, 0]
    for i in range(1, len(C)):
        if not C[i] or not re.match(r'(단원 돌아보기|차시 돌아보기|단원을 시작하며|이 마당에서 배울 단원)', T[i]) or '<hp:tbl' not in C[i]: continue
        k = i - 1
        while k > 0 and not C[k]: k -= 1
        if pg[i] == pg[k]: continue
        used = sum(sizes[j] for j in range(len(C)) if pg[j] == pg[k] and j < i)
        free = H - used - 1200
        rows = re.findall(r'<hp:tr>.*?</hp:tr>', C[i], re.S)
        lines = [r for r in rows if not re.search(r'<hp:t>[^<]*\S', r)]
        rh = 2550
        drop = max(0, math.ceil((sizes[i] - free) / rh))
        if free > 4700 + 2 * rh and drop <= len(lines) - 2:
            for r in lines[len(lines) - drop:]:
                C[i] = C[i].replace(r, '', 1)
            n = len(rows) - drop
            C[i] = re.sub(r'rowCnt="\d+"', 'rowCnt="%d"' % n, C[i], count=1)
            for ri, r in enumerate(re.findall(r'<hp:tr>.*?</hp:tr>', C[i], re.S)):
                C[i] = C[i].replace(r, re.sub(r'rowAddr="\d+"', 'rowAddr="%d"' % ri, r), 1)
            sizes[i] -= drop * rh; nbox[0] += 1
        else:
            C[i] = ''; sizes[i] = 0; G[i]['p'] = ''
            if blank(C[k]): C[k] = ''; sizes[k] = 0; G[k]['p'] = ''
            nbox[1] += 1
        pg = paginate(G, sizes)
    log.append('혼자 넘어간 쓰는 칸: 줄여서 앞 쪽에 %d · 뺌 %d' % tuple(nbox))
    log.append('넘친 블록 그림 줄여 한 쪽에 %d · 글이 길어 두 쪽으로 고르게 나눈 풀어 봐요 %s · 그래도 남는 블록 %s' % (nfit, two, sorted(set(left))[:20]))
    log.append('쪽 수: %d → %d' % (max(g['page'] for g in G), pg[-1]))
    used = {}
    for i in range(len(C)): used[pg[i]] = used.get(pg[i], 0) + sizes[i]
    low = [(k, round(v / H * 100), T[min(i for i in range(len(C)) if pg[i] == k)][:14]) for k, v in sorted(used.items()) if v < H * 0.45]
    log.append('반 넘게 빈 쪽 %d: %s' % (len(low), low))

    # ---- 4. 쪽 번호(CONTENT·용어 풀이)
    import fix_pages
    TP = [(None, None, pg[i], T[i]) for i in range(len(C))]
    mk = marks_from(TP)
    toc_i = [i for i in range(min(140, len(C))) if re.match(r'^\s*.+\s\s\d+$', T[i])]
    nt = 0; cur = 0
    for i in toc_i:
        t = T[i]; key = None
        if t.startswith('머리말'): key = 'pre'
        elif t.startswith('이 책을'): key = 'how'
        elif t.startswith('이 책의'): key = 'struct'
        elif t.startswith('정답과'): key = 'ans'
        elif t.startswith('용어'): key = 'terms'
        else:
            m = re.match(r'(\d)마당   ', t)
            if m: cur = int(m.group(1)); key = 'm%d:open' % cur
            else:
                m = re.match(r'(\d+)단원', t)
                if m: key = 'm%d:u%d' % (cur, int(m.group(1)) - 1)
                else:
                    m = re.match(r'(\d)마당 확인 평가', t)
                    if m: key = 'm%s:exam' % m.group(1)
        if key and key in mk:
            p = C[i]; idx = p.rfind('</hp:t>')
            C[i] = re.sub(r'\d+$', str(mk[key]), p[:idx]) + p[idx:]; nt += 1
    ng = 0
    def gl(m):
        nonlocal ng
        k = 'm%s:l%s' % (m.group(1), m.group(2))
        if k not in mk: return m.group(0)
        ng += 1
        return '%s마당 %s차시<hp:lineBreak/>(%d쪽)' % (m.group(1), m.group(2), mk[k])
    for i in range(len(C)):
        if '차시<hp:lineBreak/>(' in C[i]:
            C[i] = re.sub(r'(\d)마당 (\d+)차시<hp:lineBreak/>\((\d+)쪽\)', gl, C[i])
    log.append('차례 쪽 번호 %d곳 · 용어 풀이 쪽 %d곳 고침' % (nt, ng))

    # ---- 쓰기
    hh = TH.out().replace('breakNonLatinWord="KEEP_WORD"', 'breakNonLatinWord="BREAK_WORD"')
    NEW = s[:b0] + body[:TT[0][0]] + ''.join(C) + body[TT[-1][1]:]
    NEW = re.sub(r'<hp:linesegarray[^>]*>.*?</hp:linesegarray>', '', NEW, flags=re.S)
    tmp = dst + '.tmp'
    with zipfile.ZipFile(tmp, 'w') as z:
        for zi in Z.infolist():
            data = NEW.encode('utf-8') if zi.filename == 'Contents/section0.xml' else hh.encode('utf-8') if zi.filename == 'Contents/header.xml' else Z.read(zi.filename)
            z.writestr(zipfile.ZipInfo(zi.filename, zi.date_time), data, compress_type=zi.compress_type)
    os.replace(tmp, dst)
    json.dump(mk, open(os.path.splitext(dst)[0] + '.marks.json', 'w'), ensure_ascii=False)
    out = '\n'.join(log)
    print(out)
    if rep: open(rep, 'w').write(out + '\n')
    return mk


def marks_from(TP):
    """fix_pages.scan과 같은 쪽 표시(이름 → 쪽), 쪽은 계산한 값"""
    TOC = [i for i, (a, e, p, t) in enumerate(TP) if re.match(r'^\s*.+\s\s\d+$', t) and i < 120]
    start = max(TOC) + 1
    mk = {}; cur = 0
    for i, (a, e, p, t) in enumerate(TP):
        if i < start: continue
        m = re.search(r'체스 학습관(\d)마당', t)
        if m: cur = int(m.group(1)); mk.setdefault('m%d:open' % cur, p); continue
        m = re.match(r'(\d)마당(\d+)단원', t)
        if m: mk.setdefault('m%s:u%d' % (m.group(1), int(m.group(2)) - 1), p); continue
        m = re.match(r'확인 평가(\d)마당 확인 평가', t)
        if m: mk.setdefault('m%s:exam' % m.group(1), p); continue
        m = re.match(r'(\d+)차시(.+)$', t)
        if m and cur and i + 1 < len(TP) and TP[i + 1][3].startswith('오늘의 목표'): mk.setdefault('m%d:l%s' % (cur, m.group(1)), p)
        for key, word in [('pre', '머리말'), ('how', '이 책을 쓰는 방법'), ('struct', '이 책의 짜임'), ('ans', '정답과 풀이'), ('terms', '용어 풀이')]:
            if t.strip().endswith(word) and key not in mk and len(t) < 40: mk[key] = p
    return mk


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
