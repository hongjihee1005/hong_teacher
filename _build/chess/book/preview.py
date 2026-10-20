# -*- coding: utf-8 -*-
"""교재 HWPX를 쪽마다 HTML로 대강 그려 보기(한글 프로그램이 없는 곳에서 쪽 모양·넘침 확인용)

    python3 _build/chess/book/preview.py 파일.hwpx 출력.html [첫쪽-끝쪽]
    python3 _build/chess/book/preview.py 파일.hwpx 출력폴더 1-12 png   # 쪽 그림(PNG)도 찍고, 넘치는 쪽을 알려 줌

이 책 도구(book.py)가 쓰는 것만 그립니다: 문단·글자 모양·표(칸 테두리·바탕)·그림·쪽 나눔·머리말·쪽 번호.
글꼴이 한글(함초롬돋움)과 달라 줄 바꿈이 조금 다를 수 있습니다.
"""
import sys, os, re, zipfile, base64, html, json, subprocess
import xml.etree.ElementTree as ET

NS = {'hp': 'http://www.hancom.co.kr/hwpml/2011/paragraph', 'hh': 'http://www.hancom.co.kr/hwpml/2011/head',
      'hc': 'http://www.hancom.co.kr/hwpml/2011/core', 'hs': 'http://www.hancom.co.kr/hwpml/2011/section'}
HP = '{%s}' % NS['hp']
MM = 283.465


def load(path):
    z = zipfile.ZipFile(path)
    head = ET.fromstring(z.read('Contents/header.xml'))
    sec = ET.fromstring(z.read('Contents/section0.xml'))
    bins = {}
    for n in z.namelist():
        if n.startswith('BinData/'):
            bins[os.path.splitext(os.path.basename(n))[0]] = base64.b64encode(z.read(n)).decode()
    chars, paras, fills = {}, {}, {}
    for c in head.iter('{%s}charPr' % NS['hh']):
        chars[c.get('id')] = (int(c.get('height')) / 100.0, c.get('textColor'), c.find('hh:bold', NS) is not None)
    for p in head.iter('{%s}paraPr' % NS['hh']):
        al = p.find('hh:align', NS).get('horizontal')
        sw = p.find('.//hp:default', NS) if p.find('.//hp:default', NS) is not None else p
        ls = sw.find('.//hh:lineSpacing', NS)
        ml = sw.find('.//hc:left', NS)
        ind = sw.find('.//hc:intent', NS)
        paras[p.get('id')] = (al, int(ls.get('value')) if ls is not None else 160, int(ml.get('value')) / MM if ml is not None else 0,
                              int(ind.get('value')) / MM if ind is not None else 0)
    for b in head.iter('{%s}borderFill' % NS['hh']):
        def bd(tag):
            e = b.find('hh:' + tag, NS)
            if e is None or e.get('type') == 'NONE':
                return 'none'
            w = e.get('width').replace(' ', '')
            st = {'SOLID': 'solid', 'DOT': 'dotted', 'DASH': 'dashed'}.get(e.get('type'), 'solid')
            return '%s %s %s' % (w, st, e.get('color'))
        wb = b.find('.//hc:winBrush', NS)
        fills[b.get('id')] = (bd('leftBorder'), bd('rightBorder'), bd('topBorder'), bd('bottomBorder'),
                              wb.get('faceColor') if wb is not None and wb.get('faceColor') not in (None, 'none') else None)
    return sec, chars, paras, fills, bins


def render(path, rng=None):
    sec, chars, paras, fills, bins = load(path)
    pr = sec.find('.//hp:pagePr', NS)
    mg = pr.find('hp:margin', NS)
    W, Hh = int(pr.get('width')) / MM, int(pr.get('height')) / MM
    g = {k: int(mg.get(k)) / MM for k in ('left', 'right', 'top', 'bottom', 'header', 'footer', 'gutter')}
    hdr = {}
    for h in sec.iter(HP + 'header'):
        hdr[h.get('applyPageType')] = ''.join(t.text or '' for t in h.iter(HP + 't'))

    def runs(p):
        out = []
        for r in p.findall('hp:run', NS):
            sz, col, b = chars.get(r.get('charPrIDRef'), (10, '#000', False))
            for e in r:
                if e.tag == HP + 't':
                    t = ''.join(e.itertext())
                    for sub in e:
                        if sub.tag == HP + 'tab':
                            t = '\t'
                    if e.find('hp:tab', NS) is not None:
                        out.append('<span class="tab"></span>')
                        t = e.find('hp:tab', NS).tail or ''
                    out.append('<span style="font-size:%.1fpt;color:%s;%s">%s</span>' % (sz, col, 'font-weight:700' if b else '', html.escape(t)))
                elif e.tag == HP + 'tbl':
                    out.append(table(e))
                elif e.tag == HP + 'pic':
                    w = int(e.find('hp:curSz', NS).get('width')) / MM
                    hh = int(e.find('hp:curSz', NS).get('height')) / MM
                    bid = e.find('.//hc:img', NS).get('binaryItemIDRef')
                    out.append('<img style="width:%.2fmm;height:%.2fmm;vertical-align:bottom" src="data:image/png;base64,%s">' % (w, hh, bins.get(bid, '')))
        return ''.join(out)

    def para(p):
        al, ls, ml, ind = paras.get(p.get('paraPrIDRef'), ('LEFT', 160, 0, 0))
        a = {'JUSTIFY': 'justify', 'LEFT': 'left', 'CENTER': 'center', 'RIGHT': 'right'}.get(al, 'left')
        inner = runs(p) or '&nbsp;'
        sz = max([chars.get(r.get('charPrIDRef'), (10,))[0] for r in p.findall('hp:run', NS)] or [10])
        return '<div class="p" style="text-align:%s;line-height:%d%%;padding-left:%.1fmm;text-indent:%.1fmm;font-size:%.1fpt">%s</div>' % (a, ls, ml, ind, sz, inner)

    def table(t):
        rows = []
        for tr in t.findall('hp:tr', NS):
            cs = []
            for tc in tr.findall('hp:tc', NS):
                w = int(tc.find('hp:cellSz', NS).get('width')) / MM
                cm = tc.find('hp:cellMargin', NS)
                pad = [int(cm.get(k)) / MM for k in ('top', 'right', 'bottom', 'left')]
                l, r, tp, b, f = fills.get(tc.get('borderFillIDRef'), ('none',) * 4 + (None,))
                va = tc.find('hp:subList', NS).get('vertAlign', 'CENTER').lower()
                va = {'center': 'middle'}.get(va, va)
                span = tc.find('hp:cellSpan', NS).get('colSpan')
                body = ''.join(para(p) for p in tc.find('hp:subList', NS).findall('hp:p', NS))
                cs.append('<td colspan="%s" style="width:%.2fmm;padding:%.2fmm %.2fmm %.2fmm %.2fmm;border-left:%s;border-right:%s;border-top:%s;border-bottom:%s;%svertical-align:%s">%s</td>'
                          % (span, w, pad[0], pad[1], pad[2], pad[3], l, r, tp, b, 'background:%s;' % f if f else '', va, body))
            rows.append('<tr>' + ''.join(cs) + '</tr>')
        w = int(t.find('hp:sz', NS).get('width')) / MM
        return '<table style="width:%.2fmm">%s</table>' % (w, ''.join(rows))

    pages, cur, hide = [], [], []
    hidden = False
    for p in sec.findall('hp:p', NS):
        if p.get('pageBreak') == '1' and cur:
            pages.append((cur, hidden))
            cur, hidden = [], False
        if p.find('.//hp:pageHiding', NS) is not None and p.find('.//hp:pageHiding', NS).get('hideHeader') == '1':
            hidden = True
        if p.find('.//hp:secPr', NS) is not None:
            continue
        cur.append(para(p))
    if cur:
        pages.append((cur, hidden))
    out = []
    a, b = (rng or (1, len(pages)))
    for i, (ps, hid) in enumerate(pages):
        n = i + 1
        if n < a or n > b:
            continue
        even = n % 2 == 0
        left = g['left'] + (0 if even else g['gutter'])
        right = g['right'] + (g['gutter'] if even else 0)
        top = g['top'] + g['header']
        hd = '' if hid or n == 1 else '<div class="hd" style="top:%.1fmm;left:%.1fmm;right:%.1fmm;text-align:%s">%s</div>' % (
            g['top'] + 2, left, right, 'left' if even else 'right', html.escape(hdr.get('EVEN' if even else 'ODD', '')))
        pn = '' if hid or n == 1 else '<div class="pn" style="bottom:%.1fmm;%s:%.1fmm">%d</div>' % (g['bottom'] + 2, 'left' if even else 'right', left if even else right, n)
        out.append('<section class="pg" id="p%d" style="width:%.1fmm;height:%.1fmm">%s%s<div class="body" style="position:absolute;top:%.1fmm;left:%.1fmm;width:%.1fmm;height:%.1fmm">'
                   '<div class="flow">%s</div></div><div class="lim" style="top:%.1fmm"></div></section>'
                   % (n, W, Hh, hd, pn, top, left, W - left - right, Hh - top - g['bottom'] - g['footer'], ''.join(ps), Hh - g['bottom'] - g['footer']))
    css = ('body{margin:0;background:#ddd;font-family:"WenQuanYi Zen Hei","Noto Sans CJK KR",sans-serif;word-break:keep-all}'
           '.pg{position:relative;background:#fff;margin:6mm auto;overflow:visible;box-shadow:0 1px 4px #0004}'
           '.p{margin:0;white-space:pre-wrap}.tab{display:inline-block;width:0}'
           'table{border-collapse:collapse;table-layout:fixed;margin:0 auto}td{box-sizing:border-box}'
           '.hd{position:absolute;font-size:8.5pt;color:#8A7E72}.pn{position:absolute;font-size:10pt;color:#555}'
           '.lim{position:absolute;left:0;right:0;border-top:1px dashed #f008}')
    return '<!doctype html><html><head><meta charset="utf-8"><style>%s</style></head><body>%s</body></html>' % (css, ''.join(out)), len(pages)


def shoot(htmlfile, outdir):
    js = r"""
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 1 });
  await pg.goto('file://' + process.argv[2]); const r = await pg.evaluate(() => [...document.querySelectorAll('.pg')].map(s => {
    const body = s.querySelector('.body'), f = s.querySelector('.flow'); return { id: s.id, over: f.scrollHeight - body.clientHeight, h: f.scrollHeight, H: body.clientHeight }; }));
  for (const x of r) { await pg.locator('#' + x.id).screenshot({ path: process.argv[3] + '/' + x.id + '.png' }); }
  console.log(JSON.stringify(r)); await b.close(); })();"""
    f = os.path.join(outdir, '_shot.js')
    open(f, 'w').write(js)
    r = subprocess.run(['node', f, os.path.abspath(htmlfile), os.path.abspath(outdir)], capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-1500:])
    return json.loads(r.stdout.strip().splitlines()[-1])


if __name__ == '__main__':
    src, out = sys.argv[1], sys.argv[2]
    rng = tuple(int(x) for x in sys.argv[3].split('-')) if len(sys.argv) > 3 else None
    doc, n = render(src, rng)
    if len(sys.argv) > 4 and sys.argv[4] == 'png':
        os.makedirs(out, exist_ok=True)
        hf = os.path.join(out, 'preview.html')
        open(hf, 'w', encoding='utf-8').write(doc)
        r = shoot(hf, out)
        over = [(x['id'], round(x['over'] * 25.4 / 96)) for x in r if x['over'] > 2]
        print('쪽 %d개 그림 · 넘치는 쪽(mm):' % len(r), over)
    else:
        open(out, 'w', encoding='utf-8').write(doc)
        print('쪽', n)
