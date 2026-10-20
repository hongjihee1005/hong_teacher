# -*- coding: utf-8 -*-
"""선생님이 한글에서 고친 '체스 학습관' 한 권 파일을 읽기 좋게 다듬기(내용·그림 크기는 그대로)

    python3 _build/chess/book/tidy.py 파일.hwpx [출력.hwpx]

1. 줄 끝에서 낱말이 끊기지 않게: 모든 문단 모양의 '한글 줄 나눔'을 어절 단위로
   (한글 HWPX의 breakNonLatinWord는 이름과 반대 — BREAK_WORD가 어절을 지키고 KEEP_WORD가 글자마다 끊음)
2. 내어쓰기 바로잡기: 글머리표 문단(• …)의 둘째 줄이 글머리표 뒤 글자에 맞게(왼쪽 여백 0, 음수 들여쓰기)
3. 번호 문단 줄 맞춤: '1  문제 …', '예시 1  …', 정답의 '1  …'처럼 번호로 시작하는 문단은 둘째 줄이 번호 뒤 글자에 맞게 내어쓰기
4. '풀어 봐요' 문제 칸(3칸 표)을 '문제 글' 줄과 '그림' 줄로 나눠, 같은 줄의 판 그림이 같은 높이에서 시작하게
5. 한글이 저장해 둔 줄 위치(linesegarray)는 지움 — 한글이 열 때 다시 계산합니다.
   (그래서 쪽이 바뀔 수 있으니, 한글에서 열어 저장한 뒤 fix_pages.py로 차례·용어 풀이 쪽을 다시 맞춥니다.)
그림 크기(선생님이 쪽에 맞게 줄인 것 포함)·글·쪽 나눔은 건드리지 않습니다.
"""
import re, sys, os, zipfile, random

EM = {'digit': 0.56, 'space': 0.30, 'hangul': 1.0}
MM = 283.465


def tops(s, start, end, tag):
    """s[start:end] 안에서 바로 아래 단계의 <hp:tag …>…</hp:tag> 구간들"""
    out, depth, st = [], 0, None
    for m in re.finditer(r'<hp:%s[ >]|</hp:%s>' % (tag, tag), s[start:end]):
        if m.group(0).startswith('</'):
            depth -= 1
            if depth == 0:
                out.append((start + st, start + m.end()))
        else:
            if depth == 0:
                st = m.start()
            depth += 1
    return out


class Head:
    def __init__(self, h):
        self.h = h
        self.pp = {m.group(1): m.group(0) for m in re.finditer(r'<hh:paraPr id="(\d+)".*?</hh:paraPr>', h, re.S)}
        self.ch = {m.group(1): int(m.group(2)) for m in re.finditer(r'<hh:charPr id="(\d+)" height="(\d+)"', h)}
        if not self.ch:
            self.ch = {m.group(2): int(m.group(1)) for m in re.finditer(r'<hh:charPr height="(\d+)"[^>]*? id="(\d+)"', h)}
        self.bf = {m.group(1): m.group(0) for m in re.finditer(r'<hh:borderFill id="(\d+)".*?</hh:borderFill>', h, re.S)}
        self.new_pp, self.new_bf = [], []
        self.ppcache, self.bfcache = {}, {}

    def hang(self, pid, L):
        """문단 모양 pid를 '둘째 줄부터 L만큼 내어쓰기'로 복사한 새 번호"""
        key = (pid, L)
        if key in self.ppcache:
            return self.ppcache[key]
        x = self.pp[pid]
        nid = str(max(map(int, self.pp)) + 1 + len(self.new_pp))
        x = re.sub(r'<hh:paraPr id="\d+"', '<hh:paraPr id="%s"' % nid, x, count=1)
        x = re.sub(r'<hc:intent value="-?\d+"', '<hc:intent value="%d"' % -L, x)
        x = re.sub(r'<hc:left value="-?\d+"', '<hc:left value="0"', x)
        self.new_pp.append(x)
        self.ppcache[key] = nid
        return nid

    def bfvar(self, bid, side):
        """테두리 bid에서 한쪽(top/bottom) 선을 뺀 새 번호"""
        key = (bid, side)
        if key in self.bfcache:
            return self.bfcache[key]
        x = self.bf[bid]
        nid = str(max(map(int, self.bf)) + 1 + len(self.new_bf))
        x = re.sub(r'<hh:borderFill id="\d+"', '<hh:borderFill id="%s"' % nid, x, count=1)
        x = re.sub(r'<hh:%sBorder type="\w+"' % side, '<hh:%sBorder type="NONE"' % side, x)
        self.new_bf.append(x)
        self.bfcache[key] = nid
        return nid

    def out(self):
        h = self.h
        # 1. 어절 단위 줄 나눔
        h = h.replace('breakNonLatinWord="KEEP_WORD"', 'breakNonLatinWord="BREAK_WORD"')

        # 2. 글머리표 내어쓰기: 왼쪽 여백 = −들여쓰기 인 모양은 왼쪽 여백을 0으로
        def fixhang(m):
            x = m.group(0)
            for blk in re.findall(r'<hh:margin>.*?</hh:margin>', x, re.S):
                i = re.search(r'<hc:intent value="(-?\d+)"', blk)
                l = re.search(r'<hc:left value="(-?\d+)"', blk)
                if i and l and int(i.group(1)) < 0 and int(l.group(1)) == -int(i.group(1)):
                    x = x.replace(blk, blk.replace(l.group(0), '<hc:left value="0"'))
            return x
        h = re.sub(r'<hh:paraPr id="\d+".*?</hh:paraPr>', fixhang, h, flags=re.S)
        if self.new_pp:
            h = re.sub(r'<hh:paraProperties itemCnt="(\d+)">', lambda m: '<hh:paraProperties itemCnt="%d">' % (int(m.group(1)) + len(self.new_pp)), h)
            h = h.replace('</hh:paraProperties>', ''.join(self.new_pp) + '</hh:paraProperties>')
        if self.new_bf:
            h = re.sub(r'<hh:borderFills itemCnt="(\d+)">', lambda m: '<hh:borderFills itemCnt="%d">' % (int(m.group(1)) + len(self.new_bf)), h)
            h = h.replace('</hh:borderFills>', ''.join(self.new_bf) + '</hh:borderFills>')
        return h


def width_em(prefix):
    w = 0
    for c in prefix:
        w += EM['digit'] if c.isdigit() else EM['space'] if c == ' ' else EM['hangul']
    return w


def blank(p):
    return not re.search(r'<hp:t>[^<]*\S[^<]*</hp:t>|<hp:pic|<hp:tbl|<hp:rect|<hp:container', p)


def numbered(s, H):
    """번호로 시작하는 문단(첫 글 칸이 '1  '·'예시 1  ')에 내어쓰기 모양을 줌"""
    n = [0]

    def fix(m):
        p = m.group(0)
        r = re.match(r'<hp:p ([^>]*)paraPrIDRef="(\d+)"([^>]*)><hp:run charPrIDRef="(\d+)"><hp:t>((?:예시 )?\d+  )</hp:t></hp:run>', p)
        if not r:
            return p
        pt = H.ch.get(r.group(4), 1000) / 100.0
        L = int(round(width_em(r.group(5)) * pt * 0.3528 * MM))
        nid = H.hang(r.group(2), L)
        n[0] += 1
        return p.replace('paraPrIDRef="%s"' % r.group(2), 'paraPrIDRef="%s"' % nid, 1)
    s = re.sub(r'<hp:p [^>]*><hp:run charPrIDRef="\d+"><hp:t>(?:예시 )?\d+  </hp:t></hp:run>', fix, s)
    return s, n[0]


def split_grids(s, H, ids):
    """'풀어 봐요' 3칸 표: 한 줄 → 문제 글 줄 + 그림 줄"""
    out, pos, cnt = [], 0, 0
    for a, e in tops(s, 0, len(s), 'tbl'):
        t = s[a:e]
        head = re.match(r'<hp:tbl [^>]*>', t).group(0)
        if 'rowCnt="1"' not in head or 'colCnt="3"' not in head or '<hp:tbl' in t[len(head):]:
            continue
        cells = tops(t, 0, len(t), 'tc')
        info, ok = [], False
        for ca, ce in cells:
            c = t[ca:ce]
            sl = re.search(r'(<hp:subList [^>]*>)(.*)(</hp:subList>)(.*)$', c, re.S)
            paras = [c[pa:pe] for pa, pe in tops(c, sl.start(2), sl.end(2), 'p')]
            q = bool(paras) and re.match(r'<hp:p [^>]*><hp:run charPrIDRef="\d+"><hp:t>\d+  </hp:t>', paras[0]) is not None
            ok = ok or (q and '<hp:pic' in c)
            info.append((c, sl, paras, q))
        if not ok:
            continue
        rows = ['', '']
        for c, sl, paras, q in info:
            tcopen = re.match(r'<hp:tc [^>]*>', c).group(0)
            bid = re.search(r'borderFillIDRef="(\d+)"', tcopen).group(1)
            tail = sl.group(4)
            mg = re.search(r'<hp:cellMargin left="(\d+)" right="(\d+)" top="(\d+)" bottom="(\d+)"/>', tail)
            empty = '<hp:p id="%s" paraPrIDRef="%s" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0"><hp:run charPrIDRef="0"><hp:t/></hp:run></hp:p>'

            def cell(row, body, bf, top, bot):
                o = tcopen.replace('borderFillIDRef="%s"' % bid, 'borderFillIDRef="%s"' % bf, 1)
                tl = re.sub(r'rowAddr="\d+"', 'rowAddr="%d"' % row, tail)
                tl = re.sub(r'<hp:cellMargin [^>]*/>', '<hp:cellMargin left="%s" right="%s" top="%s" bottom="%s"/>' % (mg.group(1), mg.group(2), top, bot), tl)
                return o + sl.group(1).replace('vertAlign="CENTER"', 'vertAlign="TOP"').replace('vertAlign="BOTTOM"', 'vertAlign="TOP"') + body + '</hp:subList>' + tl
            pp = re.search(r'paraPrIDRef="(\d+)"', paras[0]).group(1) if paras else '0'
            if q:
                body = list(paras[1:])
                while len(body) > 1 and blank(body[0]): body.pop(0)   # 그림 위 빈 문단을 빼서 칸마다 그림 높이를 맞춤
                rest = ''.join(body) or empty % (next(ids), pp)
                rows[0] += cell(0, paras[0], H.bfvar(bid, 'bottom'), mg.group(3), '0')
                rows[1] += cell(1, rest, H.bfvar(bid, 'top'), '150', mg.group(4))
            else:
                rows[0] += cell(0, empty % (next(ids), pp), bid, mg.group(3), '0')
                rows[1] += cell(1, ''.join(paras) or empty % (next(ids), pp), bid, '150', mg.group(4))
        nt = head.replace('rowCnt="1"', 'rowCnt="2"') + t[len(head):t.index('<hp:tr>')] + '<hp:tr>' + rows[0] + '</hp:tr><hp:tr>' + rows[1] + '</hp:tr></hp:tbl>'
        out.append(s[pos:a])
        out.append(nt)
        pos = e
        cnt += 1
    out.append(s[pos:])
    return ''.join(out), cnt


def main(src, dst):
    Z = zipfile.ZipFile(src)
    s = Z.read('Contents/section0.xml').decode('utf-8')
    H = Head(Z.read('Contents/header.xml').decode('utf-8'))
    used = set(re.findall(r'<hp:p id="(\d+)"', s))
    rnd = random.Random(20261020)

    def idgen():
        while True:
            n = str(rnd.randint(1000000, 2147483646))
            if n not in used:
                used.add(n)
                yield n
    ids = idgen()
    s, ng = split_grids(s, H, ids)
    s, nn = numbered(s, H)
    s = re.sub(r'<hp:linesegarray>.*?</hp:linesegarray>', '', s, flags=re.S)
    h = H.out()
    tmp = dst + '.tmp'
    with zipfile.ZipFile(tmp, 'w') as z:
        for zi in Z.infolist():
            data = Z.read(zi.filename)
            if zi.filename == 'Contents/section0.xml':
                data = s.encode('utf-8')
            elif zi.filename == 'Contents/header.xml':
                data = h.encode('utf-8')
            z.writestr(zi, data, compress_type=zi.compress_type)
    os.replace(tmp, dst)
    print('문제 칸 표 %d개를 두 줄로 · 번호 문단 %d개 줄 맞춤 · 새 문단 모양 %d · 새 테두리 %d' % (ng, nn, len(H.new_pp), len(H.new_bf)))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else sys.argv[1])
