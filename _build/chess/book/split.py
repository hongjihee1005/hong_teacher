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
import finalize, prune, cover_page
import io, random
try:
    import segno     # QR 코드(pip install segno)
except ImportError:
    segno = None

VOLS = [(1, 1, '폰'), (2, 2, '나이트'), (3, 3, '비숍'), (4, 4, '룩'), (5, 5, '퀸'), (6, 6, '킹')]   # (권, 마당, 마치면 받는 등급)
NAME = '체스학습관_학생용교재_%d권_%d마당_부크크A4.hwpx'


def josa(w):
    """이/가: 마지막 글자에 받침이 있으면 '이'"""
    c = ord(w[-1]) - 0xAC00
    return '이' if 0 <= c < 11172 and c % 28 else '가'


SITE = 'https://hongjihee1005.github.io/hong_teacher/special/chess/m%d.html?b=1#l%d'   # ?b=1 = 교재 QR로 들어옴(학습관이 나중에 쓸 수 있게)
QR = 3685          # QR 코드 한 변 13mm(HWPUNIT) — 33칸 + 흰 테두리 2칸씩, 한 칸 약 0.35mm
QPAD = 100


def add_qr(P, a):
    """차시 제목 띠(1차시 | 제목) 오른쪽에 그 차시 학습관 주소 QR 코드 칸을 더함 (2026-10-22 선생님 요청)
    돌려주는 값: (새 문단 목록, [(BinData 이름, png 바이트)])"""
    if segno is None:
        sys.exit('QR 코드를 만들려면 pip install segno')
    T = [text(p).strip() for p in P]
    files = []
    rnd = random.Random(a)
    for i in range(len(P) - 1):
        m = re.match(r'(\d+)차시', T[i])
        if not (m and T[i + 1].startswith('오늘의 목표') and 'colCnt="2"' in P[i]):
            continue
        n = int(m.group(1))
        q = segno.make(SITE % (a, n), error='l', boost_error=False)
        buf = io.BytesIO(); q.save(buf, kind='png', scale=10, border=2)
        name = 'qr_m%d_l%d' % (a, n)
        files.append((name, buf.getvalue()))
        px = (q.symbol_size(border=2)[0]) * 10
        cw = QR + 2 * QPAD
        pid = rnd.randrange(10 ** 9, 2 * 10 ** 9)
        pic = ('<hp:pic id="%d" zOrder="0" numberingType="PICTURE" textWrap="TOP_AND_BOTTOM" textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" href="" groupLevel="0" instid="%d" reverse="0">'
               '<hp:offset x="0" y="0"/><hp:orgSz width="%d" height="%d"/><hp:curSz width="%d" height="%d"/><hp:flip horizontal="0" vertical="0"/>'
               '<hp:rotationInfo angle="0" centerX="%d" centerY="%d" rotateimage="1"/><hp:renderingInfo><hc:transMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/>'
               '<hc:scaMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/><hc:rotMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/></hp:renderingInfo>'
               '<hc:img binaryItemIDRef="%s" bright="0" contrast="0" effect="REAL_PIC" alpha="0"/><hp:imgRect><hc:pt0 x="0" y="0"/><hc:pt1 x="%d" y="0"/><hc:pt2 x="%d" y="%d"/><hc:pt3 x="0" y="%d"/></hp:imgRect>'
               '<hp:imgClip left="0" right="%d" top="0" bottom="%d"/><hp:inMargin left="0" right="0" top="0" bottom="0"/><hp:imgDim dimwidth="%d" dimheight="%d"/><hp:effects/>'
               '<hp:sz width="%d" widthRelTo="ABSOLUTE" height="%d" heightRelTo="ABSOLUTE" protect="0"/>'
               '<hp:pos treatAsChar="1" affectLSpacing="0" flowWithText="1" allowOverlap="0" holdAnchorAndSO="0" vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/>'
               '<hp:outMargin left="0" right="0" top="0" bottom="0"/></hp:pic>'
               % (pid, pid, QR, QR, QR, QR, QR // 2, QR // 2, name, QR, QR, QR, QR, px * 75, px * 75, px * 75, px * 75, QR, QR))
        cell = ('<hp:tc name="" header="0" hasMargin="1" protect="0" editable="0" dirty="0" borderFillIDRef="%s"><hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="CENTER" linkListIDRef="0" linkListNextIDRef="0" textWidth="0" textHeight="0" hasTextRef="0" hasNumRef="0">'
                '<hp:p id="%d" paraPrIDRef="18" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0"><hp:run charPrIDRef="0">%s<hp:t/></hp:run></hp:p></hp:subList>'
                '<hp:cellAddr colAddr="2" rowAddr="0"/><hp:cellSpan colSpan="1" rowSpan="1"/><hp:cellSz width="%d" height="500"/><hp:cellMargin left="%d" right="%d" top="%d" bottom="%d"/></hp:tc>')
        p = P[i]
        bf = re.findall(r'<hp:tc [^>]*borderFillIDRef="(\d+)"', p)[-1]
        p = p.replace('colCnt="2"', 'colCnt="3"', 1)
        p = p.replace('<hp:cellSz width="35433"', '<hp:cellSz width="%d"' % (35433 - cw), 1)
        p = p.replace('</hp:tc></hp:tr>', '</hp:tc>' + cell % (bf, pid + 1, pic, cw, QPAD, QPAD, QPAD, QPAD) + '</hp:tr>', 1)
        h = QR + 2 * QPAD
        p = re.sub(r'(<hp:tbl [^>]*>.*?<hp:sz width="\d+" widthRelTo="ABSOLUTE" height=")\d+', lambda mm: mm.group(1) + str(h), p, count=1, flags=re.S)
        # 바깥 문단 줄 정보(쪽 계산에 씀)도 늘어난 높이로
        segs = list(re.finditer(r'<hp:lineseg textpos="0" vertpos="(\d+)" vertsize="(\d+)" textheight="(\d+)" baseline="(\d+)"', p))
        if segs:
            sg = segs[-1]
            if int(sg.group(2)) < h:
                new = '<hp:lineseg textpos="0" vertpos="%s" vertsize="%d" textheight="%d" baseline="%d"' % (sg.group(1), h, h, int(h * 0.85))
                p = p[:sg.start()] + new + p[sg.end():]
        P[i] = p
    return P, files


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
            elif t.startswith('• 모르는 문제는 학습관에서'):
                p = settext(p, '• 차시 제목 옆 QR 코드를 찍으면 학습관의 그 차시가 바로 열려요. 모르는 문제는 거기서 힌트를 받아 보세요. 정답과 풀이는 책 뒤쪽에 있어요.')
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
        P, qrs = add_qr(P, a)
        NEW = s[:b0] + body[:TT[0][0]] + ''.join(P) + body[TT[-1][1]:]
        raw = os.path.join(out, 'raw%d.hwpx' % v)
        with zipfile.ZipFile(raw, 'w') as z:
            for zi in Z.infolist():
                if zi.filename == 'Contents/section0.xml':
                    data = NEW.encode('utf-8')
                elif zi.filename == 'Contents/content.hpf':
                    hpf = Z.read(zi.filename).decode('utf-8')
                    items = ''.join('<opf:item id="%s" href="BinData/%s.png" media-type="image/png" isEmbeded="1"/>' % (nm, nm) for nm, _ in qrs)
                    data = hpf.replace('</opf:manifest>', items + '</opf:manifest>', 1).encode('utf-8')
                else:
                    data = Z.read(zi.filename)
                z.writestr(zipfile.ZipInfo(zi.filename, zi.date_time), data, compress_type=zi.compress_type)
            for nm, png in qrs:
                z.writestr(zipfile.ZipInfo('BinData/%s.png' % nm, (2026, 10, 22, 0, 0, 0)), png, compress_type=zipfile.ZIP_DEFLATED)
        dst = os.path.join(out, NAME % (v, a))
        print('==== %d권 (%d마당)' % (v, a))
        mk = finalize.main(raw, dst, os.path.join(out, 'report%d.txt' % v))
        prune.prune(dst)      # 한 권짜리 책의 그림 가운데 이 권에서 안 쓰는 것을 뺌
        cp = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'special', 'chess', 'book', 'cover', '속표지_학생용_%d권.png' % v)
        if os.path.exists(cp):
            cover_page.apply(dst, cp)      # 첫 쪽 = 앞표지와 같은 속표지(cover.js가 만든 그림)
        prev[v] = mk
        os.remove(raw)
        made.append((dst, mk))
    return made


if __name__ == '__main__':
    split(sys.argv[1], sys.argv[2])
