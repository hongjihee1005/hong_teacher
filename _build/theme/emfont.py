"""이모지 한 가지 색 글꼴(Noto Emoji, SIL OFL 1.1 — emoji/OFL.txt)을 쪽마다 그 쪽에 쓰인 글자만 잘라 넣습니다(2026-10-27).
CDN(jsDelivr)이 학교 망에서 막혀도 노란 컬러 이모지로 돌아가지 않게. 같은 글자면 언제나 같은 결과.
원본 글꼴은 @fontsource/noto-emoji 5.3.2의 400 굵기 조각(emoji/noto-emoji-N-400-normal.woff2). fonttools·brotli가 없으면 None(그 쪽 블록을 그대로 둠)."""
import base64, io, pathlib, re
try:
    from fontTools.ttLib import TTFont
    from fontTools import subset
    import brotli  # noqa: F401  woff2 읽고 쓰기
    OK = True
except Exception:
    OK = False
DIR = pathlib.Path(__file__).with_name('emoji')
RX = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿‼⁉™ℹ↔-↪〰〽㊗㊙Ⓜ▪-◾⤴⤵©®]')
_CH = None
def _chunks():
    global _CH
    if _CH is None:
        _CH = []
        for f in sorted(DIR.glob('noto-emoji-*-400-normal.woff2'), key=lambda p: int(p.name.split('-')[2])):
            t = TTFont(str(f)); b = io.BytesIO(); t.flavor = None; t.save(b)
            _CH.append((b.getvalue(), set(t.getBestCmap())))
    return _CH
def block(page):
    """page: 덮개를 걷어 낸 HTML. 돌려주는 값: <style> 블록 글('' = 넣을 것 없음) 또는 None(글꼴 도구 없음)."""
    if not OK: return None
    need = {ord(c) for c in RX.findall(page)}
    out = []
    for raw, cm in _chunks():
        use = sorted(need & cm)
        if not use: continue
        need -= set(use)
        t = TTFont(io.BytesIO(raw), recalcTimestamp=False); o = subset.Options(); o.flavor = 'woff2'; o.layout_features = ['*']; o.name_IDs = []; o.notdef_outline = False
        ss = subset.Subsetter(o); ss.populate(unicodes=use + [0x200d, 0xfe0f]); ss.subset(t)
        t.recalcTimestamp = False; t['head'].modified = t['head'].created   # 언제 만들어도 같은 결과
        b = io.BytesIO(); t.flavor = 'woff2'; t.save(b)
        out.append("@font-face{font-family:'HJ Emoji';font-style:normal;font-weight:400;font-display:block;src:url(data:font/woff2;base64,%s) format('woff2');unicode-range:%s}"
                   % (base64.b64encode(b.getvalue()).decode(), ','.join('U+%x' % u for u in use)))
    if not out: return ''
    return '<!--hj-emfont--><style id="hj-emfont">' + ''.join(out) + '</style><!--/hj-emfont-->'
