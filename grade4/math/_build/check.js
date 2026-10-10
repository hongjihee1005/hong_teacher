// 4학년 수학 앱 점검: 모든 차시·계단(도전 포함)을 그려 보고 오류·빈 화면·가로 넘침을 찾습니다.
// 사용: node check.js [u2-angle …]   (인자가 없으면 ../sem1, ../sem1-soop 의 단원 앱 모두)
const path = require('path'), fs = require('fs');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const ROOT = path.resolve(__dirname, '..');
const want = process.argv.slice(2);
const files = [];
for (const d of ['sem1', 'sem1-soop', 'sem2', 'sem2-soop']) {
  const dir = path.join(ROOT, d); if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (/^u\d.*\.html$/.test(f) && (!want.length || want.some(w => f.startsWith(w)))) files.push(path.join(dir, f));
}
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let bad = 0;
  for (const f of files) {
    for (const vp of [{ width: 1366, height: 680 }, { width: 800, height: 1180 }]) {
      const p = await b.newPage({ viewport: vp }); const errs = [];
      p.on('pageerror', e => errs.push(e.message));
      await p.route(/^https?:/, r => r.abort());
      await p.goto('file://' + f + '#1'); await p.waitForTimeout(300);
      const out = await p.evaluate(async () => {
        const res = []; let n = 0;
        for (const L of LESSONS) for (const i of [...L.steps.map((_, k) => k), 'chal']) {
          if (i === 'chal' && !L.challenge) continue;
          CUR = { L, idx: i };
          try { renderLesson(); } catch (e) { res.push(`${L.no}차시 ${i === 'chal' ? '도전' : i + 1}계단 오류: ${e.message}`); continue; }
          n++;
          await new Promise(r => setTimeout(r, 30));
          const w = document.documentElement.scrollWidth, body = document.querySelector('.work, main');
          if (w > innerWidth + 2) res.push(`${L.no}차시 ${i === 'chal' ? '도전' : i + 1}계단 가로 넘침 ${w}px`);
          if (body && body.innerText.trim().length < 20) res.push(`${L.no}차시 ${i}계단 빈 화면`);
        }
        return { res, n };
      });
      const msg = [...new Set(errs)].concat(out.res);
      console.log(`${path.relative(ROOT, f)} ${vp.width}px: 계단 ${out.n}개 ${msg.length ? '문제 ' + msg.length : '이상 없음'}`);
      msg.slice(0, 15).forEach(m => console.log('  - ' + m)); bad += msg.length;
      await p.close();
    }
  }
  await b.close();
  if (bad) { console.log(`[문제] ${bad}건`); process.exit(1); }
})();
