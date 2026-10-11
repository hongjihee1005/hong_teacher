/* 교재 그림 찍기: node shots.js 목록.json 출력폴더
   목록 = [{f:'파일이름.png', board:{pos, marks, arrows, coords, swap, flip}} | {f, big:['K','k']}]
   학습관과 같은 판 그리기(board.js·pieces.js)로 그리고, 한 번 연 브라우저로 모두 찍습니다. */
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const CHESS = path.join(__dirname, '..');
const [, , listFile, outDir] = process.argv;
const list = JSON.parse(fs.readFileSync(listFile, 'utf8'));
const js = ['rules.js', 'pieces.js', 'board.js'].map(f => fs.readFileSync(path.join(CHESS, f), 'utf8')).join('\n');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#fff;font-family:'WenQuanYi Zen Hei',sans-serif}
#h{width:560px;padding:6px;background:#fff}
.cs-board{width:100%}.cs-svg{display:block;width:100%;height:auto;background:#EADBC4}
.cs-co{font:700 28px 'WenQuanYi Zen Hei',sans-serif;fill:#6B4A2E}
.cs-lb{font-weight:700;font-family:'WenQuanYi Zen Hei',sans-serif;fill:#1E1A17;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:7px}
#big{display:flex;gap:14px;padding:6px;background:#fff;width:max-content}#big span{display:grid;place-items:center;width:120px;height:120px;border-radius:18px;background:#EADBC4}#big svg{width:88%;height:88%}
</style></head><body><div id="h"></div><div id="big"></div><script>${js.replace(/<\/script/g, '<\\/script')}
var V=CB.make(document.getElementById('h'));
window.draw=function(b){V.set(b)};
window.big=function(l){var e=document.getElementById('big');e.innerHTML=l.map(function(c){return '<span><svg viewBox="0 0 100 100">'+PIECES.svg(c)+'</svg></span>'}).join('')};
var st=document.createElement('style');st.textContent=PIECES.CSS;document.head.appendChild(st);
</script></body></html>`;
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined });
  const pg = await b.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 1 });
  await pg.setContent(html);
  let n = 0;
  for (const it of list) {
    const out = path.join(outDir, it.f);
    if (fs.existsSync(out) && !process.env.FORCE) continue;
    if (it.big) { await pg.evaluate(l => window.big(l), it.big); await pg.locator('#big').screenshot({ path: out }); await pg.evaluate(() => { document.getElementById('big').innerHTML = ''; }); }
    else { await pg.evaluate(bd => window.draw(bd), it.board); await pg.locator('#h').screenshot({ path: out }); }
    n++;
  }
  await b.close();
  console.log('그림 ' + n + '장 찍음 (모두 ' + list.length + '장)');
})();
