# -*- coding: utf-8 -*-
"""학생용 교재 모양 다듬기 (2026-10-22 선생님 요청 — 선생님이 한글에서 1권 앞부분을 고친 파일을 기준으로 모든 권에)

split.py가 권마다 finalize.py 앞에 부름: P(바깥 문단 목록, 한글이 저장한 줄 정보가 있음), hx(header.xml) → (P, hx)
  1. 2쪽 판권: 빈 줄을 넣어 쪽 아래로 내림
  2. 3쪽 제목: 'N권 · N마당 이름' 20pt, '홍지희 지음' 15pt
  3. 차례: 'CONTENT' 25pt 굵게, 줄 15pt, 줄 사이 빈 줄 — 한 쪽에 거의 차게(줄이 많은 권은 빈 줄을 낮게)
  4. '여섯 권으로 배워요': 권 번호 · 마당 이름 · 등급을 탭으로 맞추고 단원 줄은 마당 이름 아래에 맞춤, 쪽에 고르게
  5. 제목·중요한 곳 굵게(부크크 고딕 Bold 글자): 차시 띠·배워요·예시로 보기·풀어 봐요(14 → 15pt)·정리해요·생각 톡톡·예시 N·문제 번호·
     마당/단원 제목·'오늘의 목표' 이름표, 앞쪽 소제목(체스를 하면 이런 힘이 자라요 등)은 20pt, 나의 등급 기록 표는 모두 굵게
  6. 차시 '오늘의 목표' 다음, '배워요' 앞에 빈 줄 하나
쪽 안의 남는 자리를 고르게 나누는 일(선생님이 손으로 빈 줄을 넣은 것)은 쪽이 정해진 뒤 finalize.py의 fill 단계가 함.
"""
import re
from layout import text, own, LHead
from finalize import W, cat

H = 65765


def cinfo(hx):
    out = {}
    for m in re.finditer(r'<hh:charPr id="(\d+)" height="(\d+)" textColor="([^"]+)"[^>]*>(.*?)</hh:charPr>', hx, re.S):
        out[m.group(1)] = dict(h=int(m.group(2)), color=m.group(3), bold='<hh:bold/>' in m.group(4),
                               font=re.search(r'<hh:fontRef hangul="(\d+)"', m.group(4)).group(1))
    return out


class RHead(LHead):
    def out(self):
        """새 모양만 덧붙임(글자 단위 줄 나눔 고치기 등은 finalize.py가 함)"""
        h = self.h
        for tag, lst in (('paraProperties', self.new_pp), ('charProperties', getattr(self, 'new_ch', [])), ('tabProperties', getattr(self, 'new_tab', []))):
            if lst:
                h = h.replace('</hh:%s>' % tag, ''.join(lst) + '</hh:%s>' % tag, 1)
                h = re.sub(r'<hh:%s itemCnt="(\d+)"' % tag, lambda m: '<hh:%s itemCnt="%d"' % (tag, int(m.group(1)) + len(lst)), h, count=1)
        return h


def seg_scale(p, f):
    """바깥 문단 줄 정보의 높이를 f배(글자 크기를 바꾼 한 줄짜리 제목)"""
    def one(m):
        vs, th, bl, sp = (int(m.group(i)) for i in (2, 3, 4, 5))
        return '%svertsize="%d" textheight="%d" baseline="%d" spacing="%d"' % (m.group(1), vs * f, th * f, bl * f, sp * f)
    i = p.rfind('<hp:linesegarray>')
    if i < 0: return p
    return p[:i] + re.sub(r'(<hp:lineseg [^>]*?)vertsize="(\d+)" textheight="(\d+)" baseline="(\d+)" spacing="(\d+)"', one, p[i:])


def lseg(vs, sp, vpos=0, horz=0, size=43936):
    return ('<hp:linesegarray><hp:lineseg textpos="0" vertpos="%d" vertsize="%d" textheight="%d" baseline="%d" spacing="%d" horzpos="%d" horzsize="%d" flags="393216"/></hp:linesegarray>'
            % (vpos, vs, vs, int(vs * 0.85), sp, horz, size - horz))


_pid = [1500000000]


def para(pp, runs, vs, sp, horz=0):
    """새 바깥 문단: runs = [(글자 모양, 글)] — 글에 '\t'는 탭"""
    _pid[0] += 7
    body = ''.join('<hp:run charPrIDRef="%s"><hp:t>%s</hp:t></hp:run>' % (c, t.replace('\t', '<hp:tab width="4000" leader="0" type="1"/>')) if t else
                   '<hp:run charPrIDRef="%s"/>' % c for c, t in runs)
    return '<hp:p id="%d" paraPrIDRef="%s" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0">%s%s</hp:p>' % (_pid[0], pp, body, lseg(vs, sp, horz=horz))


def ppid(p):
    return re.match(r'<hp:p [^>]*paraPrIDRef="(\d+)"', p).group(1)


def first_c(p):
    return re.search(r'<hp:run charPrIDRef="(\d+)"><hp:t>', p).group(1)


def restyle(P, hx, v, info):
    """info: dict(madang={k: 이름}, units={k: [단원]}, grade={k: 등급})"""
    TH = RHead(hx)
    CI = cinfo(hx)
    T = [text(p).strip() for p in P]
    find = lambda f, a=0: next(i for i in range(a, len(P)) if f(T[i]))

    # ---- 1. 판권을 쪽 아래로: 첫 쪽 나눔 뒤 빈 줄 둘 다음에 빈 줄을 더 넣음
    a = next(i for i in range(1, len(P)) if re.match(r'<hp:p [^>]*pageBreak="1"', P[i]))
    b = next(i for i in range(a + 1, len(P)) if re.match(r'<hp:p [^>]*pageBreak="1"', P[i]))
    sz = lambda p: sum(h + s for _, h, s in own(p))
    used = sum(sz(P[i]) for i in range(a, b))
    blank = P[a + 1]
    n = max(0, int((H - 1500 - used) // max(1, sz(blank))))
    P = P[:a + 2] + [blank] * n + P[a + 2:]
    T = [text(p).strip() for p in P]

    # ---- 2. 속표지 제목
    i_auth = find(lambda t: t == '홍지희 지음')
    for i, ht in ((i_auth - 1, 2000), (i_auth, 1500)):
        c = first_c(P[i]); h0 = CI[c]['h']
        P[i] = P[i].replace('charPrIDRef="%s"><hp:t>' % c, 'charPrIDRef="%s"><hp:t>' % TH.charvar(c, height=ht), 1)
        P[i] = seg_scale(P[i], ht / h0)

    # ---- 3. 차례
    i_cont = find(lambda t: t == 'CONTENT')
    i_ser = find(lambda t: t == '여섯 권으로 배워요', i_cont)
    toc = [i for i in range(i_cont + 1, i_ser) if T[i]]
    big = TH.charvar(first_c(P[i_cont]), height=2500, bold=True)
    head = P[i_cont].replace('charPrIDRef="%s"><hp:t>' % first_c(P[i_cont]), 'charPrIDRef="%s"><hp:t>' % big, 1)
    head = seg_scale(head, 2500 / CI[first_c(P[i_cont])]['h'])
    gap = P[i_cont + 1]                    # 제목 아래 빈 줄(10pt)
    lines = []
    for i in toc:
        q = P[i]
        for c in set(re.findall(r'<hp:run charPrIDRef="(\d+)"><hp:t>', q)):
            q = q.replace('charPrIDRef="%s"><hp:t>' % c, 'charPrIDRef="%s"><hp:t>' % TH.charvar(c, height=1500), 1)
        lines.append(seg_scale(q, 1500 / 1100))
    k = len(lines)
    room = H * 0.93 - (2500 + 1000) - 2 * 1600 - k * 1500 * 1.8
    sp_h = max(300, min(1500, int(room / max(1, k - 1) / 1.8 / 50) * 50))
    sp_c = TH.charvar(first_c(P[toc[0]]), height=sp_h)
    spacer = lambda pp: para(pp, [(sp_c, '')], sp_h, int(sp_h * 0.8))
    out = [head, gap, gap]
    for j, q in enumerate(lines):
        if j: out.append(spacer(ppid(q)))
        out.append(q)
    P = P[:i_cont] + out + P[i_ser:]
    T = [text(p).strip() for p in P]

    # ---- 4. 여섯 권으로 배워요
    i_ser = find(lambda t: t == '여섯 권으로 배워요', i_cont)
    i_note = find(lambda t: t.startswith('「체스 학습관」은 여섯 마당'), i_ser)
    c0 = first_c(P[i_ser])
    head = seg_scale(P[i_ser].replace('charPrIDRef="%s"><hp:t>' % c0, 'charPrIDRef="%s"><hp:t>' % TH.charvar(c0, height=2500, bold=True), 1), 2500 / CI[c0]['h'])
    ln = P[i_ser + 2]                      # 권 줄(차례 줄 꼴, 11pt 가는 글자)
    c_txt = first_c(ln)
    tab = 5400                             # 권 번호 다음 칸(19mm)
    pp_a = TH.ppvar(ppid(ln), align='LEFT', left=0, intent=0, ls=150, tab=TH.tabpr([tab]))
    pp_u = TH.ppvar(ppid(ln), align='LEFT', left=tab, intent=0, ls=150)
    c_no = TH.charvar(c_txt, height=1500, bold=True)
    c_nm = TH.charvar(c_txt, height=1300, bold=True)
    c_gr = TH.charvar(c_txt, height=1150)
    c_un = TH.charvar(c_txt, height=1150)
    c_me = TH.charvar(c_txt, height=1050, bold=True)
    blocks = []
    for w in sorted(info['madang']):
        L = [para(pp_a, [(c_no, '%d권\t' % w), (c_nm, '%d마당 %s' % (w, info['madang'][w])), (c_gr, '   ·   %s 등급' % info['grade'][w])]
                  + ([(c_me, '     ← 지금 보는 책')] if w == v else []), 1500, 750)]
        us = info['units'][w]
        for j in range(0, len(us), 5):
            L.append(para(pp_u, [(c_un, ' · '.join(us[j:j + 5]))], 1150, 575, horz=tab))
        blocks.append(L)
    note = P[i_note]
    used = 3500 + sum(sum(sz(q) for q in L) for L in blocks) + sz(note) + 1600
    room = H * 0.94 - used
    g_h = max(400, min(2400, int(room / (len(blocks) + 1) / 1.5 / 50) * 50))
    c_g = TH.charvar(c_txt, height=g_h)
    gp = lambda: para(ppid(ln), [(c_g, '')], g_h, int(g_h * 0.5))
    out = [head, gp()]
    for L in blocks:
        out += L + [gp()]
    out.append(note)
    P = P[:i_ser] + out + P[i_note + 1:]
    T = [text(p).strip() for p in P]

    # ---- 5. 제목·중요한 곳 굵게
    i_open = find(lambda t: re.match(r'\d마당 · ', t) is not None)
    i_ans = find(lambda t: t.startswith('정답과 풀이'), i_open)
    front = {'체스를 하면 이런 힘이 자라요', '판 그림 읽는 법', '체스 말 한눈에 보기', '나의 등급 기록'}
    cnt = {}

    def run(m, i):
        c, t = m.group(1), m.group(2)
        ci = CI.get(c)
        if not ci or ci['bold']: return m.group(0)
        new = None
        if ci['font'] == '5':          # 부크크 고딕 Bold
            if t.strip() in front and i < i_open:
                new = TH.charvar(c, height=2000, bold=True)
            elif ci['h'] == 1400 and len(t) <= 16:
                new = TH.charvar(c, height=1500, bold=True)
            elif ci['h'] == 1900 and band(i):              # 차시 제목: QR 칸이 생겨 좁아졌으므로 긴 제목은 한 줄에 들게 줄임
                em = sum(W[cat(ch)] for ch in t) * 1.04
                ht = max(1400, min(1900, int(30048 * 0.97 / em / 50) * 50))
                if ht < 1900: cnt['fit'] = cnt.get('fit', 0) + 1
                new = TH.charvar(c, height=ht, bold=True)
            elif ci['h'] >= 1300:
                new = TH.charvar(c, bold=True)
            elif ci['color'] != '#2B2118' and ci['h'] == 1150 and len(t) <= 16:
                new = TH.charvar(c, bold=True)                    # 정리해요·생각 톡톡·예시 N·마당을 마치면 …
            elif re.fullmatch(r'\d+  ', t) or t in ('맞힌 문제', '다시 볼 차시'):
                new = TH.charvar(c, bold=True)                    # 문제 번호
            elif t.startswith('오늘의 목표  '):
                cnt['goal'] = cnt.get('goal', 0) + 1
                return ('<hp:run charPrIDRef="%s"><hp:t>오늘의 목표  </hp:t></hp:run><hp:run charPrIDRef="%s"><hp:t>%s</hp:t>'
                        % (TH.charvar(c, bold=True), c, t[len('오늘의 목표  '):]))
        if new is None: return m.group(0)
        cnt[ci['h']] = cnt.get(ci['h'], 0) + 1
        return '<hp:run charPrIDRef="%s"><hp:t>%s</hp:t>' % (new, t)

    band = lambda i: re.match(r'\d+차시', T[i]) and i + 1 < len(T) and T[i + 1].startswith('오늘의 목표')
    rx = re.compile(r'<hp:run charPrIDRef="(\d+)"><hp:t>([^<]*)</hp:t>')
    for i in range(len(P)):
        if i >= i_ans and not re.match(r'\d마당  |정답과 풀이|용어 풀이', T[i]): continue
        q = rx.sub(lambda m: run(m, i), P[i])
        if T[i] in front and q != P[i] and '<hp:tbl' not in q:
            q = seg_scale(q, 2000 / 1400)
        if T[i].startswith('마당1마당2마당'):             # 나의 등급 기록 표: 모두 굵게
            q = re.sub(r'<hp:run charPrIDRef="(\d+)"><hp:t>', lambda m: '<hp:run charPrIDRef="%s"><hp:t>' % (m.group(1) if CI.get(m.group(1), {}).get('bold') else TH.charvar(m.group(1), bold=True)), q)
        P[i] = q

    # ---- 6. 차시: '오늘의 목표' 다음 빈 줄 하나
    nsp = 0
    i = 0
    while i < len(P) - 1:
        if T[i].startswith('오늘의 목표') and '<hp:tbl' not in P[i] and re.match(r'\d+차시', T[i - 1]):
            j = i + 1
            while j < len(P) and T[j] and not T[j].startswith('배워요') and '<hp:tbl' not in P[j]: j += 1   # 목표가 두 문단일 때
            g = own(P[j - 1])
            c = re.findall(r'<hp:run charPrIDRef="(\d+)"', P[j - 1])[-1]
            vs, sp = (g[0][1], g[0][2]) if g else (1100, 384)
            P.insert(j, para(ppid(P[j - 1]), [(c, '')], vs, sp))
            T.insert(j, '')
            nsp += 1
            i = j
        i += 1
    print('  모양 다듬기: 판권 아래로(빈 줄 %d) · 차례 %d줄(사이 %dpt) · 여섯 권 쪽(사이 %dpt) · 굵게 %s · 목표 아래 빈 줄 %d'
          % (n, k, sp_h // 100, g_h // 100, dict(sorted(cnt.items(), key=str)), nsp))
    return P, TH.out()
