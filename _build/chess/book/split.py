# -*- coding: utf-8 -*-
"""'체스 학습관 1~6마당' 한 권(한글로 저장한 파일)을 마당마다 한 권씩 여섯 권으로 나눔
(2026-10-21 선생님 요청 — 처음엔 세 권, 그래도 두꺼워 여섯 권으로)

    python3 _build/chess/book/split.py 한글로저장한한권.hwpx 출력폴더

N권 = N마당. 권마다
  앞쪽(반표제·판권·속표지 제목에 'N권 · N마당 이름'), 그 권의 차례 + '여섯 권으로 배워요' 쪽(마당 여는 쪽이 홀수 쪽에 오게),
  머리말·이 책을 쓰는 방법·이 책의 짜임(권에 맞게 몇 문장 고침), 그 권의 마당, 그 권의 정답과 풀이,
  용어 풀이(그 권과 앞 권에서 배운 낱말 — 앞 권 낱말은 '(1권 38쪽)'처럼).
나눈 뒤 권마다 finalize.py(줄 나눔·외톨이 낱말·넘친 블록·쪽 번호)를 돌려 쪽 번호를 그 권 기준으로 다시 매김.
"""
import re, sys, os, json, zipfile, copy
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from layout import text, tops_of
import finalize, prune

VOLS = [(1, 1, '폰'), (2, 2, '나이트'), (3, 3, '비숍'), (4, 4, '룩'), (5, 5, '퀸'), (6, 6, '킹')]   # (권, 마당, 마치면 받는 등급)
NAME = '체스학습관_학생용교재_%d권_%d마당_부크크A4.hwpx'


def josa(w):
    """이/가: 마지막 글자에 받침이 있으면 '이'"""
    c = ord(w[-1]) - 0xAC00
    return '이' if 0 <= c < 11172 and c % 28 else '가'


def tidy_review(P):
    """단원 마무리 문제 칸 사이에 끼어 있는 '차시 돌아보기' 칸을 그 단원 마무리 끝(맞힌 문제 칸 뒤)으로 옮김
    (한 권짜리 책에서 4마당 캐슬링 단원 마무리가 두 쪽이라 쓰는 칸이 첫 쪽 끝에 들어가 있었음 — 2026-10-21 점검)"""
    T = [text(p).strip() for p in P]
    i = 0
    while i < len(P):
        if T[i].startswith('단원 마무리'):
            e = next((j for j in range(i + 1, len(P)) if re.match(r'<hp:p [^>]*pageBreak="1"', P[j]) and not T[j].startswith('차시 돌아보기')), len(P))
            r = next((j for j in range(i + 1, e) if T[j].startswith('차시 돌아보기') and '<hp:tbl' in P[j]), None)
            if r is not None and any('<hp:pic' in P[j] for j in range(r + 1, e)):
                last = max(j for j in range(r + 1, e) if '<hp:tbl' in P[j])
                box = P[r]; gap = P[r - 1] if not T[r - 1] and '<hp:tbl' not in P[r - 1] else None
                P = P[:last + 1] + ([gap] if gap else []) + [box] + P[last + 1:]
                del P[r]
                if gap is not None: del P[r - 1]
                T = [text(p).strip() for p in P]
                print('단원 마무리 사이의 차시 돌아보기를 끝으로 옮김:', T[i][:20])
        i += 1
    return P


def settext(p, new):
    """문단의 첫 글(hp:t)을 바꾸고 나머지 글은 비움"""
    first = [True]
    def f(m):
        if first[0]:
            first[0] = False
            return '<hp:t>%s</hp:t>' % new
        return '<hp:t/>'
    return re.sub(r'<hp:t>.*?</hp:t>', f, p, flags=re.S)


def pb(p, on):
    return re.sub(r'pageBreak="[01]"', 'pageBreak="%d"' % on, p, count=1)


def split(src, out):
    Z = zipfile.ZipFile(src)
    s = Z.read('Contents/section0.xml').decode('utf-8')
    b0 = s.index('<hs:sec'); body = s[b0:]
    TT = tops_of(body)
    C = [body[a:e] for a, e in TT]
    T = [text(c).strip() for c in C]
    n = len(C)
    find = lambda f, a=0: next(i for i in range(a, n) if f(T[i]))
    i_cont = find(lambda t: t == 'CONTENT')
    i_pre = find(lambda t: t.startswith('체스 학습관머리말'))
    toc = [i for i in range(i_cont + 1, i_pre) if re.match(r'^\s*.+\s\s\d+$', T[i])]
    # 마당 여는 문단(꼬리말 설정 + 여는 표): '체스 학습관N마당' 앞의 꼬리말만 있는 문단까지
    opens = {}
    for i in range(i_pre, n):
        m = re.match(r'(\d)마당 · ', T[i])
        if m and int(m.group(1)) not in opens: opens[int(m.group(1))] = i
    i_ans = find(lambda t: t.startswith('정답과 풀이'), opens[6])
    i_terms = find(lambda t: t.startswith('용어 풀이'), i_ans)
    ans = {}
    for i in range(i_ans, i_terms):
        m = re.match(r'(\d)마당  ', T[i])
        if m: ans[int(m.group(1))] = i
    i_thead = find(lambda t: t == '용어뜻배우는 곳', i_terms)
    # 차례 줄: 마당별로
    tocm = {}; cur = 0; head = []; tail = []
    for i in toc:
        m = re.match(r'(\d)마당   ', T[i])
        if m: cur = int(m.group(1))
        if T[i].startswith(('정답과', '용어')): tail.append(i)
        elif cur == 0: head.append(i)
        else: tocm.setdefault(cur, []).append(i)
    madang_name = {k: re.match(r'\d마당   (.+?)  \d+$', T[v[0]]).group(1) for k, v in tocm.items()}
    units = {k: [re.match(r'\d+단원  (.+?)  \d+$', T[i]).group(1) for i in v if re.match(r'\d+단원', T[i])] for k, v in tocm.items()}

    os.makedirs(out, exist_ok=True)
    prev = {}      # 앞 권 쪽 표시: {권: marks}
    made = []
    i_how = find(lambda t: t.startswith('이 책을 쓰는 방법'), i_pre)
    note = next(i for i in range(i_pre, i_how) if T[i].startswith('모두 여섯 마당'))
    for v, a, g in VOLS:
        P = []
        # ---- 앞쪽: 반표제·판권·속표지
        for i in range(0, i_cont):
            p = C[i]
            if '체스 학습관 — 1~6마당 학생용 교재' in p:
                p = p.replace('체스 학습관 — 1~6마당 학생용 교재', '체스 학습관 %d권 — %d마당 %s' % (v, a, madang_name[a]))
            if T[i] == '홍지희 지음':
                P.append(settext(p, '%d권 · %d마당 %s' % (v, a, madang_name[a])))
            p = p.replace('<hp:t>    체스 학습관</hp:t>', '<hp:t>    체스 학습관 %d권</hp:t>' % v)
            P.append(p)
        # ---- 차례(한 쪽)
        P += C[i_cont:toc[0]]
        for i in head + tocm[a] + tail:
            P.append(pb(C[i], 0))
        # ---- '여섯 권으로 배워요' 쪽(마당 여는 쪽이 홀수 쪽에 오게 앞쪽을 8쪽으로)
        k0 = len(P)
        P.append(pb(settext(C[i_cont], '여섯 권으로 배워요'), 1))
        P.append(C[i_cont + 1])
        ln_m = C[tocm[1][0]]; ln_u = C[tocm[1][1]]
        for w, k, gk in VOLS:
            P.append(settext(ln_m, '%d권   %d마당 %s · %s 등급%s' % (w, k, madang_name[k], gk, '  ← 지금 보는 책' if w == v else '')))
            us = units[k]
            for j in range(0, len(us), 5):     # 단원이 많으면 다섯 개씩 줄을 나눔(한 줄이 넘쳐 꺾이지 않게)
                P.append(settext(ln_u, '                %s' % ' · '.join(us[j:j + 5])))
            P.append(C[i_cont + 1])
        P.append(settext(C[note], '「체스 학습관」은 여섯 마당, 175차시예요. 마당마다 한 권씩 여섯 권으로 나누어 담았어요. '
                                  '한 권을 마치고 학습관 확인 시험을 통과하면 등급을 하나 받아요. 앞 권에서 배운 낱말은 이 책 맨 뒤 ‘용어 풀이’에서 다시 찾아볼 수 있어요.'))
        # ---- 머리말·이 책을 쓰는 방법·이 책의 짜임
        for i in range(i_pre, opens[1]):
            p = C[i]; t = T[i]
            if t.startswith('모두 여섯 마당'):
                p = settext(p, '모두 여섯 마당, 175차시이고, 마당마다 한 권씩 여섯 권으로 나누어 담았어요. 이 책은 %d권으로 %d마당 ‘%s’%s 들어 있어요. '
                               '이 마당을 마치면 %s 등급을 받아요. %d마당 1차시부터 차례대로, 하루에 한두 차시씩 천천히 공부해도 괜찮아요.'
                            % (v, a, madang_name[a], josa(madang_name[a]), g, a))
            elif t.startswith('• 이 책은 「체스 학습관」 1~6마당'):
                p = settext(p, '• 이 책은 「체스 학습관」 1~6마당(모두 175차시) 가운데 %d마당을 담은 %d권이에요. 학습관의 마당·차시 번호와 이 책의 마당·차시 번호는 같아요.' % (a, v))
            elif t.startswith('• 1마당 1차시부터'):
                p = p.replace('• 1마당 1차시부터', '• %d마당 1차시부터' % a)
            P.append(p)
        # ---- 마당 본문
        P += C[opens[a]:(opens[a + 1] if a < 6 else i_ans)]
        # ---- 정답과 풀이
        P += C[i_ans:ans[1]]
        P += C[ans[a]:(ans[a + 1] if a < 6 else i_terms)]
        # ---- 용어 풀이: 이 권과 앞 권에서 배운 낱말(앞 권은 '(2권 38쪽)'처럼)
        P += C[i_terms:i_thead + 1]
        for i in range(i_thead + 1, n):
            q = C[i].replace('top="250" bottom="250"', 'top="170" bottom="170"')   # 줄 간격 조금 좁게(앞 권 낱말이 더해져서)
            m = re.search(r'(\d)마당 (\d+)차시<hp:lineBreak/>\((\d+)쪽\)', q)
            if not m:
                P.append(q); continue
            k = int(m.group(1))
            if k > a: continue
            if k < a:
                q = q.replace(m.group(0), '%d마당 %s차시<hp:lineBreak/>(%d권 %d쪽)' % (k, m.group(2), k, prev[k]['m%d:l%s' % (k, m.group(2))]))
            P.append(q)
        P = tidy_review(P)
        NEW = s[:b0] + body[:TT[0][0]] + ''.join(P) + body[TT[-1][1]:]
        raw = os.path.join(out, 'raw%d.hwpx' % v)
        with zipfile.ZipFile(raw, 'w') as z:
            for zi in Z.infolist():
                data = NEW.encode('utf-8') if zi.filename == 'Contents/section0.xml' else Z.read(zi.filename)
                z.writestr(zipfile.ZipInfo(zi.filename, zi.date_time), data, compress_type=zi.compress_type)
        dst = os.path.join(out, NAME % (v, a))
        print('==== %d권 (%d마당)' % (v, a))
        mk = finalize.main(raw, dst, os.path.join(out, 'report%d.txt' % v))
        prune.prune(dst)      # 한 권짜리 책의 그림 가운데 이 권에서 안 쓰는 것을 뺌
        prev[v] = mk
        os.remove(raw)
        made.append((dst, mk))
    return made


if __name__ == '__main__':
    split(sys.argv[1], sys.argv[2])
