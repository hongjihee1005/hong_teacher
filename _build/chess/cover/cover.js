/* 체스 학습관 학생용 교재 6권 표지(뒤표지 + 책등 + 앞표지 한 장) — 2026-10-21 선생님 요청
   node _build/chess/cover/cover.js [출력폴더]         → 표지_학생용_N권.pdf(인쇄용, 벡터) · .png(300dpi)
   node _build/chess/cover/cover.js [출력폴더] guide   → 표지_지도서_N권 (지도서 3권, 두 마당씩)
   크기: 부크크 표지 틀 — 앞·뒤표지 210×297, 재단 여백 사방 3mm, 책등은 권마다(선생님이 부크크에서 받은 두께) */
const fs = require('fs'), path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const HERE = __dirname;
eval(fs.readFileSync(path.join(HERE, '..', 'pieces.js'), 'utf8'));
const PC = globalThis.PIECES;
const OUT = process.argv[2] || path.join(HERE, '..', '..', '..', 'special', 'chess', 'book', 'cover');

const SPINE = { 1: 6.44, 2: 8.255, 3: 6.66, 4: 8.805, 5: 5.725, 6: 6.715 };   // 선생님이 부크크에서 받은 책등 두께(mm)
const ACC = { 1: ['#7A5230', '#F4EBDF'], 2: ['#2E7D5B', '#E4F2EA'], 3: ['#2B6FB8', '#E3EEF9'], 4: ['#B23A3A', '#F8E6E4'], 5: ['#6A4BA0', '#EEE8F6'], 6: ['#1F6F78', '#E2F1F2'] };  // 교재 본문과 같은 마당 색(book.py ACC)
const V = {
  1: { name: '체스판과 체스말', p: 'P', rank: '폰', n: 23, units: ['체스판', '체스말 만나기', '처음 배치'],
       blurb: '체스를 처음 만나는 친구를 위한 첫 권이에요. 체스판을 바르게 놓는 법, 칸마다 붙은 이름을 읽는 법, 여섯 가지 말의 이름과 처음 놓는 자리를 차근차근 익혀요.' },
  2: { name: '말이 움직이는 법', p: 'N', rank: '나이트', n: 34, units: ['룩', '비숍', '퀸', '킹', '나이트', '폰', '움직임 복습'],
       blurb: '드디어 말들이 움직여요! 룩·비숍·퀸·킹·나이트·폰이 판 위에서 어떻게 움직이는지, 별 모으기와 여러 문제로 몸에 익혀요.' },
  3: { name: '잡기와 지키기', p: 'B', rank: '비숍', n: 29, units: ['잡기', '공격과 지킴', '말의 값', '위험한 말 구하기', '작은 대결'],
       blurb: '상대 말을 잡고 내 말을 지키는 법을 배워요. 말의 값을 따져 이득이 되는 잡기를 고르고, 공격받는 말을 구해 내요.' },
  4: { name: '체크와 체크메이트, 특수 규칙', p: 'R', rank: '룩', n: 40, units: ['체크', '체크 벗어나기', '체크메이트', '스테일메이트', '캐슬링', '프로모션', '앙파상', '기본 메이트', '첫 정식 대국'],
       blurb: '체스에서 가장 중요한 규칙, 체크와 체크메이트를 배워요. 스테일메이트·캐슬링·프로모션·앙파상까지 익히고 첫 정식 대국에 도전해요.' },
  5: { name: '전술', p: 'Q', rank: '퀸', n: 22, units: ['전술', '메이트와 실전'],
       blurb: '한두 수로 상대 말을 얻거나 메이트하는 작전, 전술을 배워요. 이중 공격·핀·스큐어 같은 전술을 판에서 찾아 실전처럼 풀어요.' },
  6: { name: '경기 운영', p: 'K', rank: '킹', n: 27, units: ['기보', '오프닝', '중반', '엔드게임', '비기는 규칙', '대국 예절과 실전'],
       blurb: '대국을 글로 적는 기보, 처음 부분인 오프닝, 계획을 세우는 중반, 킹도 싸우는 엔드게임을 배워요. 이제 한 판을 처음부터 끝까지 둘 수 있어요.' },
};
const B = 3, TW = 210, TH = 297, H = TH + 2 * B;
const GSPINE = { 1: 9.19, 2: 11.115, 3: 8.695 };   // 지도서 책등 두께(mm) — 2026-10-22 차시마다 새 쪽으로 바꿔 173·129쪽, 1권은 선생님이 고친 138쪽을 부크크 값들에 맞는 식(쪽수×0.055+1.6)으로 계산(2026-10-22)
const GV = { 1: [1, 2], 2: [3, 4], 3: [5, 6] };

const pieceSvg = (c, cls) => `<svg class="${cls || ''}" viewBox="0 0 100 100">${PC.svg(c)}</svg>`;
const board = (n, sq, acc) => { let s = ''; for (let r = 0; r < n; r++) for (let f = 0; f < 12; f++) if ((r + f) % 2) s += `<rect x="${f * sq}" y="${r * sq}" width="${sq}" height="${sq}"/>`; return `<svg viewBox="0 0 ${12 * sq} ${n * sq}" preserveAspectRatio="xMidYMax slice" style="fill:${acc}">${s}</svg>`; };

function html(v) {
  const d = V[v], [acc, lite] = ACC[v], s = SPINE[v], W = 2 * TW + s + 2 * B;
  const series = Object.keys(V).map(k => `<div class="sv${+k === v ? ' on' : ''}">${pieceSvg(V[k].p)}<b>${k}권</b><i>${V[k].rank}</i></div>`).join('');
  const sfont = Math.min(5.2, s * 0.62).toFixed(2);
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Gothic+A1:wght@400;700;900&display=block">
<style>
@page{size:${W + 2}mm ${H + 2}mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W + 2}mm;height:${H + 2}mm}
body{position:relative;font-family:'Gothic A1',sans-serif;color:#2A221C;background:${lite};word-break:keep-all;overflow:hidden}
${PC.CSS}
.zone{position:absolute;top:0;height:${H}mm;overflow:hidden}
.back{left:0;width:${B + TW}mm}.spine{left:${B + TW}mm;width:${s}mm;background:${acc}}.front{left:${B + TW + s}mm;width:${TW + B + 2}mm}
.boardbg{position:absolute;left:0;right:0;bottom:0;height:95mm;opacity:.09;-webkit-mask-image:linear-gradient(to top,#000 30%,transparent);mask-image:linear-gradient(to top,#000 30%,transparent)}
.boardbg svg{width:100%;height:100%}
/* 앞표지(안전 영역: 재단선 안쪽 12mm) */
.f-in{position:absolute;left:12mm;right:${B + 12}mm;top:${B + 16}mm;bottom:34mm;display:flex;flex-direction:column;align-items:center;text-align:center}
.kick{font-size:5mm;font-weight:700;color:${acc};letter-spacing:.6mm}
.title{font-family:'Black Han Sans';font-size:31mm;line-height:1;margin-top:5mm;letter-spacing:1mm}
.vol{margin-top:7mm;display:inline-flex;align-items:center;gap:3mm;background:${acc};color:#fff;border-radius:20mm;padding:2.2mm 8mm;font-size:7mm;font-weight:900}
.mname{font-family:'Black Han Sans';font-size:${d.name.length > 10 ? 10.5 : 14}mm;color:${acc};margin-top:5mm;line-height:1.15}
.hero{position:relative;width:118mm;height:118mm;margin-top:7mm}
.hero .disc{position:absolute;inset:0;border-radius:50%;background:${acc};box-shadow:0 0 0 3.5mm #fff,0 0 0 5mm ${acc}}
.hero svg{position:absolute;left:14mm;top:10mm;width:90mm;height:90mm}
.hero .cs-pc path,.hero .cs-pc circle{stroke-width:2.4}
.rib{margin-top:6mm;font-size:6mm;font-weight:900}.rib em{font-style:normal;color:${acc}}
.series{margin-top:auto;display:flex;gap:3mm;justify-content:center}
.sv{width:21mm;text-align:center;color:#6B5F56}.sv .cs-w path,.sv .cs-w circle{stroke:#8A7D72}.sv svg{width:13mm;height:13mm;display:block;margin:0 auto}
.sv b{display:block;font-size:4mm;margin-top:1mm}.sv i{display:block;font-style:normal;font-size:3.4mm}
.sv.on{color:${acc}}.sv.on .cs-w path,.sv.on .cs-w circle{stroke:#2A221C}.sv.on svg{background:#fff;border-radius:50%;box-shadow:0 0 0 .8mm ${acc}}
.by{margin-top:6mm;font-size:6mm;font-weight:700}
/* 책등 */
.sp-in{position:absolute;left:0;right:0;top:${B + 10}mm;bottom:42mm;display:flex;flex-direction:column;align-items:center;color:#fff}
.sp-in svg{width:${(s * 0.8).toFixed(2)}mm;height:${(s * 0.8).toFixed(2)}mm;flex:none}
.vt{writing-mode:vertical-rl;font-size:${sfont}mm;line-height:1;white-space:nowrap;margin-top:4mm}.tcy{text-combine-upright:all}
.vt b{font-family:'Black Han Sans';font-weight:400}
.sp-in .au{margin-top:auto}
/* 뒤표지(안전 영역: 재단선 안쪽 14mm) */
.b-in{position:absolute;left:${B + 14}mm;right:14mm;top:${B + 18}mm;bottom:${B + 14}mm;display:flex;flex-direction:column}
.bh{font-family:'Black Han Sans';font-size:10mm;color:${acc}}
.blurb{margin-top:6mm;font-size:5.2mm;line-height:1.75}
.card{margin-top:9mm;background:#fff;border-radius:5mm;padding:7mm 8mm;border:.6mm solid ${acc}33}
.card h3{font-size:5.4mm;color:${acc};margin-bottom:3mm}
.card ol{list-style:none;columns:2;column-gap:8mm}
.card li{font-size:4.8mm;line-height:2;break-inside:avoid}.card li span{display:inline-block;width:6.5mm;height:6.5mm;line-height:6.5mm;border-radius:50%;background:${acc};color:#fff;text-align:center;font-size:3.6mm;font-weight:700;margin-right:2.5mm}
.card p{margin-top:3mm;font-size:4.2mm;color:#6B5F56}
.goal{margin-top:7mm;display:flex;align-items:center;gap:4mm;font-size:5.2mm;font-weight:700}
.goal svg{width:16mm;height:16mm;background:#fff;border-radius:50%;box-shadow:0 0 0 .8mm ${acc}}
.web{margin-top:7mm;font-size:4mm;line-height:1.7;color:#4A4038}
.web b{color:${acc}}
.bar{position:absolute;left:8mm;bottom:18mm;width:59mm;height:28mm;background:#fff;border-radius:2mm}   /* 부크크 바코드 자리(뒤표지 왼쪽 아래) */
.bseries{position:absolute;right:14mm;bottom:${B + 14}mm;text-align:right;font-size:3.8mm;line-height:1.75;color:#4A4038}
.bseries b{color:${acc}}
</style></head><body>
<div class="zone back"><div class="b-in">
  <div class="bh">${v}마당 ${d.name}</div>
  <p class="blurb">${d.blurb}</p>
  <div class="card"><h3>이 책에서 배우는 단원</h3><ol>${d.units.map((u, i) => `<li><span>${i + 1}</span>${u}</li>`).join('')}</ol>
    <p>모두 ${d.n}차시 · 차시마다 배워요 → 예시로 보기 → 풀어 봐요 → 정리해요</p></div>
  <div class="goal">${pieceSvg(d.p)}<span>학습관 확인 시험을 통과하면 <b style="color:${acc}">${d.rank} 등급</b>을 받아요!</span></div>
  <p class="web"><b>「체스 학습관」</b>에서 같은 차시를 열면 직접 말을 움직이고 힌트도 받아요.<br>hongjihee1005.github.io/hong_teacher/special/chess/</p>
</div>
<div class="bseries"><b>체스 학습관 학생용 교재</b><br>${Object.keys(V).map(k => (+k === v ? '<b>' : '') + k + '권 ' + V[k].name + (+k === v ? '</b>' : '')).join('<br>')}</div>
<div class="bar"></div></div>
<div class="zone spine"><div class="sp-in">${pieceSvg(d.p)}<div class="vt"><b>체스 학습관 ${tcy(v)}</b>　${tcy(v)}마당 ${d.name}</div><div class="vt au">홍지희</div></div></div>
<div class="zone front"><div class="boardbg">${board(10, 12, acc)}</div><div class="f-in">
  <div class="kick">처음 배우는 어린이를 위한 체스 교재 · 학생용</div>
  <div class="title">체스 학습관</div>
  <div class="vol">${v}권 · ${v}마당</div>
  <div class="mname">${d.name}</div>
  <div class="hero"><div class="disc"></div>${pieceSvg(d.p)}</div>
  <div class="rib">이 책을 마치면 <em>${d.rank} 등급</em>!</div>
  <div class="series">${series}</div>
  <div class="by">홍지희 지음</div>
</div></div>
</body></html>`;
}

function htmlGuide(g) {
  const [a, b] = GV[g], s = GSPINE[g], W = 2 * TW + s + 2 * B, ink = '#2A221C', paper = '#F7F3EE';
  const sfont = Math.min(5.2, s * 0.6).toFixed(2);
  const disc = k => `<div class="gd"><div class="gdisc" style="background:${ACC[k][0]};box-shadow:0 0 0 2.6mm #fff,0 0 0 3.8mm ${ACC[k][0]}">${pieceSvg(V[k].p)}</div>
    <div class="gm" style="color:${ACC[k][0]}">${k}마당</div><div class="gn">${V[k].name.replace(', ', ',<br>')}</div></div>`;
  const unitCard = k => `<div class="gc" style="border-color:${ACC[k][0]}55"><h3 style="color:${ACC[k][0]}">${k}마당 ${V[k].name} · ${V[k].n}차시</h3>
    <ol>${V[k].units.map((u, i) => `<li><span style="background:${ACC[k][0]}">${i + 1}</span>${u}</li>`).join('')}</ol></div>`;
  const gser = Object.keys(GV).map(k => `<div class="gs${+k === g ? ' on' : ''}"><b>지도서 ${k}권</b><i>${GV[k][0]}·${GV[k][1]}마당</i></div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Gothic+A1:wght@400;700;900&display=block">
<style>
@page{size:${W + 2}mm ${H + 2}mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W + 2}mm;height:${H + 2}mm}
body{position:relative;font-family:'Gothic A1',sans-serif;color:${ink};background:${paper};word-break:keep-all;overflow:hidden}
${PC.CSS}
.zone{position:absolute;top:0;height:${H}mm;overflow:hidden}
.back{left:0;width:${B + TW}mm}.spine{left:${B + TW}mm;width:${s}mm;background:${ink}}.front{left:${B + TW + s}mm;width:${TW + B + 2}mm}
.band{position:absolute;left:0;right:0;top:0;height:${B + 92}mm;background:${ink}}
.stripe{position:absolute;left:0;right:0;top:${B + 92}mm;height:3mm;display:flex}.stripe i{flex:1}
.f-in{position:absolute;left:12mm;right:${B + 12}mm;top:${B + 18}mm;bottom:34mm;display:flex;flex-direction:column;align-items:center;text-align:center}
.kick{font-size:5mm;font-weight:700;color:#E9DDD0;letter-spacing:.6mm}
.title{font-family:'Black Han Sans';font-size:31mm;line-height:1;margin-top:5mm;letter-spacing:1mm;color:#fff}
.tag{margin-top:6mm;font-family:'Black Han Sans';font-size:11mm;color:#F3C969;letter-spacing:1mm}
.vol{margin-top:20mm;display:inline-flex;background:${ink};color:#fff;border-radius:20mm;padding:2.2mm 9mm;font-size:7mm;font-weight:900}
.pair{display:flex;gap:14mm;margin-top:10mm}
.gd{width:76mm}.gdisc{width:62mm;height:62mm;border-radius:50%;margin:0 auto;position:relative}
.gdisc svg{position:absolute;left:8mm;top:6mm;width:46mm;height:46mm}.gdisc .cs-pc path,.gdisc .cs-pc circle{stroke-width:2.6}
.gm{margin-top:6mm;font-size:6.5mm;font-weight:900}.gn{font-family:'Black Han Sans';font-size:${(V[a].name.length > 10 || V[b].name.length > 10) ? 7 : 8.5}mm;line-height:1.2;margin-top:1mm}
.with{margin-top:9mm;font-size:5.2mm;font-weight:700}
.gser{margin-top:auto;display:flex;gap:4mm;justify-content:center}
.gs{width:40mm;padding:2.2mm 0;border-radius:3mm;border:.5mm solid #CFC4B8;color:#6B5F56}.gs b{display:block;font-size:4.3mm}.gs i{display:block;font-style:normal;font-size:3.6mm}
.gs.on{background:${ink};border-color:${ink};color:#fff}
.by{margin-top:6mm;font-size:6mm;font-weight:700}
.sp-in{position:absolute;left:0;right:0;top:${B + 10}mm;bottom:42mm;display:flex;flex-direction:column;align-items:center;color:#fff}
.vt{writing-mode:vertical-rl;font-size:${sfont}mm;line-height:1;white-space:nowrap}.tcy{text-combine-upright:all}
.vt b{font-family:'Black Han Sans';font-weight:400}.vt em{font-style:normal;color:#F3C969}
.sp-in .au{margin-top:auto}
.b-in{position:absolute;left:${B + 14}mm;right:14mm;top:${B + 18}mm;bottom:${B + 52}mm;display:flex;flex-direction:column}
.bh{font-family:'Black Han Sans';font-size:10mm}
.blurb{margin-top:5mm;font-size:5mm;line-height:1.75}
.gc{margin-top:6mm;background:#fff;border-radius:5mm;padding:5.5mm 7mm;border:.6mm solid}
.gc h3{font-size:5mm;margin-bottom:2mm}
.gc ol{list-style:none;columns:2;column-gap:8mm}
.gc li{font-size:4.5mm;line-height:1.9;break-inside:avoid}.gc li span{display:inline-block;width:6mm;height:6mm;line-height:6mm;border-radius:50%;color:#fff;text-align:center;font-size:3.4mm;font-weight:700;margin-right:2.5mm}
.has{margin-top:6mm;font-size:4.4mm;line-height:1.8}.has b{display:block;font-size:4.8mm}
.bar{position:absolute;left:8mm;bottom:18mm;width:59mm;height:28mm;background:#fff;border-radius:2mm}   /* 부크크 바코드 자리(뒤표지 왼쪽 아래) */
.web{position:absolute;right:14mm;bottom:${B + 14}mm;width:125mm;text-align:right;font-size:3.9mm;line-height:1.7;color:#4A4038}
</style></head><body>
<div class="zone back"><div class="b-in">
  <div class="bh">체스 학습관 지도서 ${g}권</div>
  <p class="blurb">「체스 학습관」 ${a}·${b}마당과 학생용 교재 ${a}·${b}권을 함께 쓰시는 선생님을 위한 책입니다. 학년 구분 없이 모든 학생이 차례대로 배우도록 짜여 있습니다.</p>
  ${unitCard(a)}${unitCard(b)}
  <p class="has"><b>이 책에 담긴 것</b>마당 지도의 줄기 · 차시 한눈에 보기(학생용 교재 쪽수) · 차시마다 지도 흐름 · 교재 문제 정답 · 자주 하는 실수 · 지도 도움말 · 생각을 여는 질문 · 확인 시험과 등급 안내</p>
</div>
<p class="web">학습관 hongjihee1005.github.io/hong_teacher/special/chess/<br>지도서 1권 1·2마당 · 2권 3·4마당 · 3권 5·6마당</p>
<div class="bar"></div></div>
<div class="zone spine"><div class="sp-in"><div class="vt"><b>체스 학습관</b> <em>지도서 ${tcy(g)}</em>　${tcy(a + '·' + b)}마당</div><div class="vt au">홍지희</div></div></div>
<div class="zone front"><div class="band"></div><div class="stripe"><i style="background:${ACC[a][0]}"></i><i style="background:${ACC[b][0]}"></i></div><div class="f-in">
  <div class="kick">처음 배우는 어린이를 위한 체스 교재 · 선생님용</div>
  <div class="title">체스 학습관</div>
  <div class="tag">지도서</div>
  <div class="vol">지도서 ${g}권 · ${a}~${b}마당</div>
  <div class="pair">${disc(a)}${disc(b)}</div>
  <div class="with">학생용 교재 ${a}권 · ${b}권과 함께 써요</div>
  <div class="gser">${gser}</div>
  <div class="by">홍지희 지음</div>
</div></div>
</body></html>`;
}

// 세로 글(책등)에서 숫자가 옆으로 눕지 않게 가로로 세워 한 칸에(2026-10-22 선생님 지적)
const tcy = x => '<span class="tcy">' + x + '</span>';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const guide = process.argv[3] === 'guide';
  const only = guide ? [1, 2, 3] : process.argv[3] ? process.argv[3].split(',').map(Number) : [1, 2, 3, 4, 5, 6];
  for (const v of only) {
    const W = 2 * TW + (guide ? GSPINE : SPINE)[v] + 2 * B;
    const pg = await br.newPage({ viewport: { width: Math.round(W / 25.4 * 96), height: Math.round(H / 25.4 * 96) }, deviceScaleFactor: 300 / 96 });
    await pg.setContent(guide ? htmlGuide(v) : html(v), { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.fonts.ready);
    const f = path.join(OUT, guide ? `표지_지도서_${v}권` : `표지_학생용_${v}권`);
    await pg.pdf({ path: f + '.pdf', width: (W + 2) + 'mm', height: (H + 2) + 'mm', printBackground: true, preferCSSPageSize: true });
    require('child_process').execFileSync('python3', [path.join(HERE, 'fixbox.py'), f + '.pdf', String(W), String(H)]);   // 정확한 크기로 잘라 냄
    await pg.screenshot({ path: f + '.png', clip: { x: 0, y: 0, width: W / 25.4 * 96, height: H / 25.4 * 96 } });
    // 속표지용 앞표지 한 쪽(216×303 = 210×297 + 재단 여백 3mm, 교재 첫 쪽에 넣음 — 2026-10-22 선생님 요청)
    const fp = await br.newPage({ viewport: { width: Math.round(216 / 25.4 * 96), height: Math.round(H / 25.4 * 96) }, deviceScaleFactor: 300 / 96 });
    const one = (guide ? htmlGuide(v) : html(v)).replace('</style>', '.back,.spine{display:none!important}.front{left:0!important;width:216mm!important}.front .f-in{left:15mm!important;right:15mm!important}</style>');
    await fp.setContent(one, { waitUntil: 'networkidle' });
    await fp.evaluate(() => document.fonts.ready);
    await fp.screenshot({ path: path.join(OUT, guide ? `속표지_지도서_${v}권.png` : `속표지_학생용_${v}권.png`), clip: { x: 0, y: 0, width: 216 / 25.4 * 96, height: H / 25.4 * 96 } });
    await fp.close();
    const ok = await pg.evaluate(() => [...document.querySelectorAll('.f-in,.b-in,.sp-in')].map(e => e.scrollHeight <= e.clientHeight + 1));
    console.log(`${v}권 ${W.toFixed(3)}×${H}mm`, ok.every(Boolean) ? '' : '⚠ 넘침 ' + ok);
    await pg.close();
  }
  await br.close();
})();
