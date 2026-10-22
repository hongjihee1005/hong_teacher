# -*- coding: utf-8 -*-
"""선생님이 한글에서 고친 지도서 한 권의 차례 쪽 번호와 용어 풀이 '배우는 곳'(지도서 쪽)을 실제 쪽에 맞춤 (2026-10-22)

    python3 _build/chess/book/guide_fix.py 한글로저장한지도서.hwpx 도구로만든같은권.hwpx 출력.hwpx

한글이 저장한 줄 정보로 쪽을 셈(layout.geometry). 용어마다 몇 마당 몇 차시인지는 도구로 만든 같은 권에서 읽음.
"""
import re, sys, os, zipfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from layout import tops_of, text, geometry


def paras(path):
    s = zipfile.ZipFile(path).read('Contents/section0.xml').decode('utf-8')
    b0 = s.index('<hs:sec'); body = s[b0:]
    TT = tops_of(body)
    return s, b0, body, TT, [body[a:e] for a, e in TT]


def main(saved, made, dst):
    s, b0, body, TT, C = paras(saved)
    T = [text(c).strip() for c in C]
    G, _ = geometry(saved)
    pg = [g['page'] for g in G]
    i_toc = T.index('CONTENT')
    start = next(k for k in range(i_toc + 1, len(T)) if T[k] and not re.search(r'\s\s\d+$', T[k]))
    # 쪽 표시
    mk = {}
    cur = None; lno = {}
    for k in range(start, len(C)):
        t = T[k]
        if t.startswith('체스 학습관 지도서') and '선생님께' in t: mk['선생님께'] = pg[k]
        if re.match(r'^학습관과 교재', t) and 'tbl' not in C[k][:300] and '학습관과 교재' not in mk: mk['학습관과 교재'] = pg[k]
        m = re.search(r'체스 학습관 지도서(\d)마당', t)
        if m and '<hp:tbl' in C[k]:
            cur = int(m.group(1)); mk['m%d' % cur] = pg[k]
        m = re.match(r'(\d+)단원', t)
        if m and '<hp:tbl' in C[k] and cur: mk['m%d:u%s' % (cur, m.group(1))] = pg[k]
        m = re.match(r'(\d+)차시', t)
        if m and '<hp:tbl' in C[k] and cur and k + 1 < len(T): lno.setdefault((cur, int(m.group(1))), pg[k])
        if t.startswith('확인 시험과 수료증') and cur: mk['m%d:exam' % cur] = pg[k]
        if t.startswith('용어 풀이'): mk['terms'] = pg[k]
    # 선생님께·학습관과 교재는 머리(꼬리말) 글로 찾기 어려우면 차례 다음 쪽부터
    mk.setdefault('선생님께', pg[next(k for k in range(start, len(T)) if T[k].startswith('선생님께') or '선생님께' in T[k])])
    if '학습관과 교재' not in mk:
        mk['학습관과 교재'] = pg[next(k for k in range(start, len(T)) if '학습관과 교재' in T[k])]
    # 차례 고치기
    cur = None; n = 0
    for k in range(i_toc + 1, start):
        t = T[k]
        if not re.search(r'\s\s\d+$', t): continue
        name = re.sub(r'\s+\d+$', '', t).strip()
        key = None
        m = re.match(r'(\d)마당', name)
        if m: cur = int(m.group(1)); key = 'm%d' % cur
        elif re.match(r'\d+단원', name): key = 'm%d:u%s' % (cur, re.match(r'(\d+)', name).group(1))
        elif name.startswith('확인 시험'): key = 'm%d:exam' % cur
        elif name.startswith('용어'): key = 'terms'
        elif name in mk: key = name
        if key in mk:
            p = C[k]; idx = p.rfind('</hp:t>')
            new = re.sub(r'\d+$', str(mk[key]), p[:idx]) + p[idx:]
            if new != p: n += 1
            C[k] = new
    # 용어 풀이 '배우는 곳'
    _, _, _, _, M = paras(made)
    where = {}
    for p in M:
        for tr in re.findall(r'<hp:tr>.*?</hp:tr>', p, re.S):
            tcs = re.findall(r'<hp:tc .*?</hp:tc>', tr, re.S)
            if len(tcs) == 3:
                m = re.search(r'(\d)마당 (\d+)차시', text(tcs[2]))
                if m: where[text(tcs[0]).strip()] = (int(m.group(1)), int(m.group(2)), re.search(r'\(지도서 (\d)권 (\d+)쪽\)', text(tcs[2])))
    ng = 0
    i_terms = next(k for k in range(len(T)) if T[k].startswith('용어뜻'))
    for k in range(i_terms + 1, len(C)):
        if '<hp:tbl' not in C[k]: continue
        tcs = re.findall(r'<hp:tc .*?</hp:tc>', C[k], re.S)
        if len(tcs) != 3: continue
        w = where.get(text(tcs[0]).strip())
        if not w or text(tcs[2]).strip(): continue
        a, l, prev = w
        cid = re.findall(r'<hp:run charPrIDRef="(\d+)"', tcs[2])
        cid = cid[0] if cid else '0'
        if (a, l) in lno: ref = '지도서 %d쪽' % lno[(a, l)]
        else: ref = '지도서 %s권 %s쪽' % prev.groups()      # 앞 권 차시는 도구로 만든 권의 표시를 그대로
        body3 = '<hp:run charPrIDRef="%s"><hp:t>%d마당 %d차시<hp:lineBreak/>(%s)</hp:t></hp:run>' % (cid, a, l, ref)
        new = re.sub(r'(<hp:p [^>]*>)(.*?)(<hp:linesegarray>|</hp:p>)', lambda m: m.group(1) + body3 + m.group(3), tcs[2], count=1, flags=re.S)
        C[k] = C[k].replace(tcs[2], new, 1); ng += 1
    # 실수로 들어간 '\'
    nb = 0
    for k in range(len(C)):
        if '\\</hp:t>' in C[k]:
            C[k] = C[k].replace('\\</hp:t>', '</hp:t>'); nb += 1
    NEW = s[:b0] + body[:TT[0][0]] + ''.join(C) + body[TT[-1][1]:]
    Z = zipfile.ZipFile(saved)
    with zipfile.ZipFile(dst, 'w') as z:
        for zi in Z.infolist():
            d = NEW.encode('utf-8') if zi.filename == 'Contents/section0.xml' else Z.read(zi.filename)
            z.writestr(zipfile.ZipInfo(zi.filename, zi.date_time), d, compress_type=zi.compress_type)
    print('쪽 표시', mk)
    print('차례 %d곳 · 용어 풀이 %d곳 · \\ %d곳 고침 · 모두 %d쪽' % (n, ng, nb, max(pg)))


if __name__ == '__main__':
    main(*sys.argv[1:4])
