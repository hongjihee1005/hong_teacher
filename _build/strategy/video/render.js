// node render.js segs.json 출력폴더 — slide.html에 장면을 하나씩 그려 1920×1080 PNG로 찍습니다.
const path = require('path'), fs = require('fs');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const [segFile, out] = process.argv.slice(2);
  const segs = JSON.parse(fs.readFileSync(segFile, 'utf8'));
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, 'slide.html'));
  await p.evaluate(() => document.fonts.ready);
  for (let i = 0; i < segs.length; i++) {
    await p.evaluate(s => show(s), segs[i].slide);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, String(i).padStart(3, '0') + '.png') });
  }
  await b.close();
})();
