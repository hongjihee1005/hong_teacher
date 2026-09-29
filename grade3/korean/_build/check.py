import asyncio, sys, glob, os, json
from playwright.async_api import async_playwright
D='/home/claude/hong_teacher/grade3/korean/sem2'
SIZES={'cb':(1366,680),'tab':(800,1180)}
async def run():
    probs=[]
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for f in sorted(glob.glob(D+'/'+(sys.argv[1] if len(sys.argv)>1 else 'u*-l*')+'.html')):
            name=os.path.basename(f)
            for sk,(w,h) in SIZES.items():
                pg=await b.new_page(viewport={'width':w,'height':h})
                errs=[]
                pg.on('pageerror',lambda e:errs.append(str(e)))
                await pg.goto('file://'+f); await pg.wait_for_timeout(300)
                # cover
                ov=await pg.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                if ov: probs.append((name,sk,'cover','hscroll'))
                if sk=='cb': await pg.screenshot(path=f'/home/claude/korean/shots/{name}-{sk}-cover.png')
                await pg.click('#btnGo'); await pg.wait_for_timeout(150)
                n=0
                while True:
                    n+=1
                    info=await pg.evaluate('''()=>{const b=document.getElementById('bodyWrap');const f=document.querySelector('.foot').getBoundingClientRect();
                      const wide=[...b.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>innerWidth+2).length;
                      const t=document.getElementById('body').style.transform;const z=t?parseFloat(t.slice(6)):1;return {w:!!document.querySelector('#body .wr'),z,txt:b.innerText.trim().length,sh:b.scrollHeight,ch:b.clientHeight,foot:f.bottom<=innerHeight+1,wide,hs:document.documentElement.scrollWidth>innerWidth+1,step:document.getElementById('stepNo').textContent,bar:document.querySelector('#bar .now')?.textContent}}''')
                    tag=f"{info['bar']}|{info['step']}"
                    if info['txt']<5: probs.append((name,sk,tag,'empty'))
                    if not info['foot']: probs.append((name,sk,tag,'foot hidden'))
                    if info['wide'] or info['hs']: probs.append((name,sk,tag,'wide',info['wide']))
                    if info['sh']>info['ch']+4 and not info.get('w'): probs.append((name,sk,tag,'scroll',info['sh'],info['ch'],info['z']))
                    if float(info['z'])<0.83: probs.append((name,sk,tag,'zoom',info['z']))
                    await pg.screenshot(path=f'/home/claude/korean/shots/{name}-{sk}-{n:02d}.png')
                    last=await pg.evaluate("document.getElementById('btnNext').textContent.includes('처음으로')")
                    if last or n>40: break
                    await pg.click('#btnNext'); await pg.wait_for_timeout(120)
                if errs: probs.append((name,sk,'ERR',errs[:3]))
                await pg.close()
        await b.close()
    for x in probs: print(x)
    print('problems',len(probs))
asyncio.run(run())
