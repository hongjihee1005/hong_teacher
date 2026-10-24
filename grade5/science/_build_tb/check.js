// 4-1 과학 교과서 버전 앱 점검: node check.js ../sem1/u1-1.html … [--shots 폴더]
// 화면 세 크기에서 JS 오류·가로 넘침을 보고, 한 화면 모드의 쪽을 '다음'으로 넘기며
// 화면 높이를 넘는 쪽(스크롤이 생기는 쪽)을 셈. --shots면 1280×800 쪽마다 스크린숏.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const args = process.argv.slice(2);
let shots = null; const files = [];
for (let i = 0; i < args.length; i++) { if (args[i] === '--shots') shots = args[++i]; else files.push(args[i]); }
const SIZES = [[1280, 800], [1366, 768], [390, 844]];
(async () => {
  const b = await chromium.launch(); let bad = 0;
  for (const f of files) {
    const name = path.basename(f, '.html');
    for (const [w, h] of SIZES) {
      const p = await b.newPage({ viewport: { width: w, height: h } });
      const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + path.resolve(f)); await p.waitForTimeout(700);
      const info = [];
      const ox = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ox > 1) info.push('가로 넘침 ' + ox + 'px');
      const n = await p.evaluate(() => { const t = (document.getElementById('ovPos') || {}).textContent || ''; const m = t.match(/\/\s*(\d+)/); return m ? +m[1] : 0; });
      const tall = [];
      for (let k = 1; k <= Math.max(n, 1); k++) {
        const over = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
        if (w >= 1000 && over > 4) tall.push(k + '쪽 +' + over + 'px');
        if (shots && w === 1280) { fs.mkdirSync(shots, { recursive: true }); await p.screenshot({ path: path.join(shots, `${name}-${String(k).padStart(2, '0')}.png`) }); }
        if (k < n) { if (w < 1000) break; await p.click('#ovNext', { timeout: 3000 }).catch(() => {}); await p.waitForTimeout(250); }
      }
      if (tall.length) info.push('세로 넘침 ' + tall.join(', '));
      if (errs.length) info.push('JS 오류: ' + errs.join(' | '));
      if (errs.length || ox > 1) bad++;
      console.log(`${name} ${w}×${h} 쪽 ${n} ${info.length ? '⚠ ' + info.join(' / ') : 'OK'}`);
      await p.close();
    }
  }
  await b.close();
  console.log(bad ? `문제 ${bad}개` : '문제 0개');
  process.exit(bad ? 1 : 0);
})();
