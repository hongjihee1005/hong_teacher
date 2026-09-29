#!/usr/bin/env python3
"""선생님 버전 차시 점검: 크롬북(1366x680)·갤럭시탭(800x1180)에서 표지와 모든 단계를 열어
JS 오류, 가로 넘침, 화면보다 긴 단계(스크롤 필요)를 보고합니다. --shots 폴더 를 주면 스크린숏을 저장합니다.
예상하기 → 예상과 결과 비교 단계에 쪽지가 이어지는지도 확인합니다.
사용법: python3 check.py ../sem1-hong/u1-l2.html [다른 파일…] [--shots 폴더]"""
import sys, os, asyncio
from playwright.async_api import async_playwright
V = [('크롬북', 1366, 680), ('갤럭시탭', 800, 1180)]
ST = """()=>{const se=document.scrollingElement,b=document.getElementById('body');
 const act=document.querySelector('.screen.on');
 return {h:se.scrollWidth>innerWidth+1, v:se.scrollHeight>innerHeight+2, sh:se.scrollHeight, ih:innerHeight,
   bo: b? b.scrollHeight>b.clientHeight+2:false, bsh:b?b.scrollHeight:0, bch:b?b.clientHeight:0, scr: act?act.id:''}}"""


async def one(pw, f, shots):
    out = []
    br = await pw.chromium.launch()
    for name, w, h in V:
        pg = await (await br.new_context(viewport={'width': w, 'height': h})).new_page()
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.route('**/fonts.g*/**', lambda r: r.abort())
        await pg.goto('file://' + os.path.abspath(f)); await pg.wait_for_timeout(400)
        await pg.evaluate('localStorage.clear()')
        base = os.path.splitext(os.path.basename(f))[0]
        st = await pg.evaluate(ST)
        if st['h']: out.append(f'[{name}] 표지 가로넘침')
        if shots:
            os.makedirs(shots, exist_ok=True); await pg.screenshot(path=f'{shots}/{base}_{"cb" if w>h else "tab"}_00.png')
        n = await pg.evaluate('C.steps.length')
        await pg.click('#go'); await pg.wait_for_timeout(300)
        for i in range(n):
            k = await pg.evaluate(f'C.steps[{i}].k')
            if k == 'pred':
                inp = await pg.query_selector('.col input')
                if inp:
                    await inp.fill('점검용 예상'); await inp.press('Enter')
            if k == 'pvr':
                txt = await pg.inner_text('#body')
                if '점검용 예상' not in txt: out.append(f'[{name}] 단계 {i+1} 예상 쪽지를 불러오지 못함')
            await pg.wait_for_timeout(200)
            st = await pg.evaluate(ST)
            p = []
            if st['h']: p.append('가로넘침')
            if st['v']: p.append(f"창 스크롤({st['sh']}>{st['ih']})")
            if st['bo']: p.append(f"본문 스크롤({st['bsh']}>{st['bch']})")
            if p: out.append(f'[{name}] 단계 {i+1}({k}): ' + ', '.join(p))
            if shots: await pg.screenshot(path=f'{shots}/{base}_{"cb" if w>h else "tab"}_{i+1:02d}.png')
            await pg.click('#next'); await pg.wait_for_timeout(250)
        for e in errs[:5]: out.append(f'[{name}] JS 오류: {e}')
        out.insert(0, f'[{name}] 단계 {n}개')
    await br.close()
    return out


async def main():
    a = sys.argv[1:]; shots = None
    if '--shots' in a:
        i = a.index('--shots'); shots = a[i+1]; del a[i:i+2]
    async with async_playwright() as pw:
        for f in a:
            print('=== ' + f)
            for x in await one(pw, f, shots): print('  ' + x)
asyncio.run(main())
