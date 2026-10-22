# -*- coding: utf-8 -*-
"""교재 첫 쪽(반표제)을 앞표지와 똑같은 속표지 그림으로 바꿈 (2026-10-22 선생님 요청)

    python3 _build/chess/book/cover_page.py 교재.hwpx 속표지.png [...]   (그 자리에서 고침, 여러 번 해도 같음)

그림은 `_build/chess/cover/cover.js`가 만든 `속표지_학생용_N권.png`·`속표지_지도서_N권.png`(216×303mm = 210×297 + 재단 여백 3mm).
첫 쪽의 글 문단(맨 앞 구역 설정 문단 다음부터 첫 쪽 나눔 앞까지)을 그림 하나로 바꾸고, 그림은 종이 왼쪽 위(0, 0)에 종이 크기로 글 뒤에 놓음
→ 쪽 수·쪽 번호는 그대로.
"""
import re, sys, os, zipfile, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from layout import tops_of

NAME = 'cover_front'
PAGE_W, PAGE_H = 61228, 85889          # 부크크 틀 쪽 크기 216×303mm (HWPUNIT)


def png_size(b):
    return int.from_bytes(b[16:20], 'big'), int.from_bytes(b[20:24], 'big')


def apply(path, png):
    data = open(png, 'rb').read()
    pw, ph = png_size(data)
    Z = zipfile.ZipFile(path)
    s = Z.read('Contents/section0.xml').decode('utf-8')
    b0 = s.index('<hs:sec'); body = s[b0:]
    TT = tops_of(body)
    C = [body[a:e] for a, e in TT]
    first_pb = next(i for i in range(1, len(C)) if re.match(r'<hp:p [^>]*pageBreak="1"', C[i]))
    pid = random.Random(path).randrange(10 ** 9, 2 * 10 ** 9)
    dim = pw * 75                       # 그림 원래 크기(1픽셀 = 75 HWPUNIT, 96dpi 기준)
    pic = ('<hp:pic id="%d" zOrder="0" numberingType="PICTURE" textWrap="BEHIND_TEXT" textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" href="" groupLevel="0" instid="%d" reverse="0">'
           '<hp:offset x="0" y="0"/><hp:orgSz width="%d" height="%d"/><hp:curSz width="%d" height="%d"/><hp:flip horizontal="0" vertical="0"/>'
           '<hp:rotationInfo angle="0" centerX="%d" centerY="%d" rotateimage="1"/><hp:renderingInfo><hc:transMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/>'
           '<hc:scaMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/><hc:rotMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/></hp:renderingInfo>'
           '<hc:img binaryItemIDRef="%s" bright="0" contrast="0" effect="REAL_PIC" alpha="0"/><hp:imgRect><hc:pt0 x="0" y="0"/><hc:pt1 x="%d" y="0"/><hc:pt2 x="%d" y="%d"/><hc:pt3 x="0" y="%d"/></hp:imgRect>'
           '<hp:imgClip left="0" right="%d" top="0" bottom="%d"/><hp:inMargin left="0" right="0" top="0" bottom="0"/><hp:imgDim dimwidth="%d" dimheight="%d"/><hp:effects/>'
           '<hp:sz width="%d" widthRelTo="ABSOLUTE" height="%d" heightRelTo="ABSOLUTE" protect="0"/>'
           '<hp:pos treatAsChar="0" affectLSpacing="0" flowWithText="0" allowOverlap="1" holdAnchorAndSO="0" vertRelTo="PAPER" horzRelTo="PAPER" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/>'
           '<hp:outMargin left="0" right="0" top="0" bottom="0"/></hp:pic>'
           % (pid, pid, PAGE_W, PAGE_H, PAGE_W, PAGE_H, PAGE_W // 2, PAGE_H // 2, NAME, PAGE_W, PAGE_W, PAGE_H, PAGE_H,
              dim, ph * 75, dim, ph * 75, PAGE_W, PAGE_H))
    pp = re.search(r'paraPrIDRef="(\d+)"', C[1]).group(1)
    para = ('<hp:p id="%d" paraPrIDRef="%s" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0"><hp:run charPrIDRef="0">%s<hp:t/></hp:run></hp:p>'
            % (pid + 1, pp, pic))
    new = C[:1] + [para] + C[first_pb:]
    NEW = s[:b0] + body[:TT[0][0]] + ''.join(new) + body[TT[-1][1]:]
    hpf = Z.read('Contents/content.hpf').decode('utf-8')
    if 'href="BinData/%s.png"' % NAME not in hpf:
        hpf = hpf.replace('</opf:manifest>', '<opf:item id="%s" href="BinData/%s.png" media-type="image/png" isEmbeded="1"/></opf:manifest>' % (NAME, NAME), 1)
    head = Z.read('Contents/header.xml').decode('utf-8')
    m = re.search(r'<hh:binDataList itemCnt="(\d+)">', head)
    if m and 'BinData="%s.png"' % NAME not in head:     # 이 도구로 만든 지도서는 header에도 그림 목록이 있음
        n = int(m.group(1))
        head = head.replace(m.group(0), '<hh:binDataList itemCnt="%d">' % (n + 1), 1)
        head = head.replace('</hh:binDataList>', '<hh:binItem id="%d" Type="Embedding" BinData="%s.png" Format="png"/></hh:binDataList>' % (n, NAME), 1)
    tmp = path + '.tmp'
    with zipfile.ZipFile(tmp, 'w') as z:
        for zi in Z.infolist():
            if zi.filename == 'BinData/%s.png' % NAME:
                continue
            d = {'Contents/section0.xml': NEW, 'Contents/content.hpf': hpf, 'Contents/header.xml': head}.get(zi.filename)
            z.writestr(zipfile.ZipInfo(zi.filename, zi.date_time), d.encode('utf-8') if d is not None else Z.read(zi.filename), compress_type=zi.compress_type)
        z.writestr(zipfile.ZipInfo('BinData/%s.png' % NAME, (2026, 10, 22, 0, 0, 0)), data, compress_type=zipfile.ZIP_DEFLATED)
    os.replace(tmp, path)
    print('%s: 첫 쪽을 속표지 그림으로 (문단 %d개 → 그림 1개)' % (os.path.basename(path), first_pb - 1))


if __name__ == '__main__':
    a = sys.argv[1:]
    for i in range(0, len(a), 2):
        apply(a[i], a[i + 1])
