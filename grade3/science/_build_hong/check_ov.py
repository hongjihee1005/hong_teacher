#!/usr/bin/env python3
"""앱 점검: 크롬북(1366x680)과 갤럭시탭(800x1180)에서 모든 한 화면을 넘겨 보며 문제를 찾습니다.
사용법: python3 check.py 파일.html [파일2.html ...] [--shots 폴더]
보고: JS 오류, 가로 넘침, 스크롤이 필요한 화면, 아래 메뉴가 화면 밖, 너무 작은 글자(16px 미만)
--shots 를 주면 화면마다 스크린숏(png)을 저장합니다. 저장한 그림은 Read 도구로 직접 보고 확인하세요.
"""
import sys, os, asyncio
from playwright.async_api import async_playwright

VIEWS = [('크롬북', 1366, 680), ('갤럭시탭', 800, 1180)]

JS_STATE = r"""() => {
  const se=document.scrollingElement; const bar=document.getElementById('ovBar');
  const br=bar?bar.getBoundingClientRect():null;
  const pos=(document.getElementById('ovPos')||{}).textContent||'';
  let small=[];
  document.querySelectorAll('main section.cur p, main section.cur button, main section.cur li, main section.cur td, main section.cur label, main section.cur figcaption').forEach(e=>{
    if(e.offsetParent===null||e.closest('.ovhide')||e.closest('.cr')||e.closest('.tip')) return;
    const fs=parseFloat(getComputedStyle(e).fontSize); let k=1; const fb=e.closest('.fitbox');
    if(fb){const m=(fb.style.transform||'').match(/scale\(([\d.]+)\)/); if(m) k=+m[1];}
    if(fs*k<15.5 && (e.textContent||'').trim().length>1) small.push(((e.textContent||'').trim().slice(0,20))+'('+(fs*k).toFixed(1)+'px)');
  });
  let wide=[]; document.querySelectorAll('main *').forEach(e=>{ if(e.offsetParent===null) return; const r=e.getBoundingClientRect(); if(r.right>innerWidth+2 && r.width>0 && !e.closest('nav')) wide.push(e.tagName+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ')[0]:'')); });
  return {pos, hscroll: se.scrollWidth>innerWidth+1, vscroll: se.scrollHeight>innerHeight+2, sh: se.scrollHeight, ih: innerHeight,
          barOff: br? (br.bottom>innerHeight+1 || br.top<0):true, small: small.slice(0,4), wide: [...new Set(wide)].slice(0,4)};
}"""


async def check(pw, path, shots):
    b = await pw.chromium.launch()
    res = []
    for name, w, h in VIEWS:
        ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1)
        pg = await ctx.new_page()
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'net::' not in m.text else None)
        await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        await pg.route('**/fonts.gstatic.com/**', lambda r: r.abort())
        await pg.goto('file://' + os.path.abspath(path))
        await pg.wait_for_timeout(700)
        n = 0
        seen = set()
        while n < 120:
            await pg.wait_for_timeout(250)
            st = await pg.evaluate(JS_STATE)
            probs = []
            if st['hscroll']: probs.append('가로넘침')
            if st['vscroll']: probs.append('스크롤필요(%d>%d)' % (st['sh'], st['ih']))
            if st['barOff']: probs.append('메뉴가 화면 밖')
            if st['small']: probs.append('작은글자:' + ','.join(st['small']))
            if st['wide']: probs.append('넘친요소:' + ','.join(st['wide']))
            if probs: res.append(f"[{name}] 화면 {st['pos']}: " + ' / '.join(probs))
            if shots:
                os.makedirs(shots, exist_ok=True)
                base = os.path.splitext(os.path.basename(path))[0]
                await pg.screenshot(path=os.path.join(shots, f"{base}_{'cb' if w > h else 'tab'}_{n+1:02d}.png"))
            if st['pos'] in seen: break
            seen.add(st['pos'])
            nb = await pg.query_selector('#ovNext')
            if not nb or await nb.is_disabled(): break
            await nb.click()
            n += 1
        for e in errs[:5]: res.append(f'[{name}] JS 오류: {e}')
        res.insert(0, f'[{name}] 화면 수 {len(seen)}')
        await ctx.close()
    await b.close()
    return res


async def main():
    args = sys.argv[1:]
    shots = None
    if '--shots' in args:
        i = args.index('--shots'); shots = args[i + 1]; del args[i:i + 2]
    async with async_playwright() as pw:
        for f in args:
            r = await check(pw, f, shots)
            print('=== ' + f)
            for x in r: print('  ' + x)

asyncio.run(main())
