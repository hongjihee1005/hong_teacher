/**
 * 3학년 1학기 수학 개념 계단 — 학생 기록 저장용 구글 앱스 스크립트
 * 1) 구글 시트를 새로 만들고 [확장 프로그램] > [Apps Script]를 엽니다.
 * 2) 이 코드를 Code.gs에 붙여 넣고, [+] > HTML 로 아래 이름의 파일을 만들어 각 앱 HTML 전체를 붙여 넣습니다.
 *    - 단원 모음 페이지: 배포 주소 그대로 (HTML 파일 이름 index_hub)
 *    - 1단원 덧셈과 뺄셈: ?page=addsub (index_addsub)
 *    - 2단원 평면도형:   ?page=plane  (index_plane)
 *    - 3단원 나눗셈:     ?page=div    (index_div)
 *    - 4단원 곱셈:       ?page=mul    (index_mul)
 *    - 5단원 길이와 시간: ?page=lentime (index_lentime)
 *    - 6단원 분수와 소수: ?page=fracdec (index_fracdec)
 *    (교과서 버전과 이야기 버전 중 쓰려는 앱을 붙여 넣으면 됩니다. 두 버전을 함께 쓰려면 스크립트를 하나 더 만드세요.)
 * 3) 아래 TEACHER_PIN을 선생님만 아는 숫자로 바꿉니다.
 * 4) [배포] > [새 배포] > 유형: 웹 앱 / 실행: 나 / 액세스 권한: 학생들이 열 수 있는 범위로 배포합니다.
 */
const TEACHER_PIN = '1234';        // ← 꼭 바꿔 주세요
const SHEET_NAME = '학습기록';
const HEADERS = ['시각', '반', '번호', '이름', '단원', '차시', '차시 제목', '계단', '계단 이름', '해결', '시도 횟수', '학생 답', '수준'];

function doGet(e) {
  if (e && e.parameter && e.parameter.pin !== undefined) {           // 교사용 조회(외부 주소로 열었을 때)
    try { return json_({ rows: getRecords(e.parameter.pin) }); }
    catch (err) { return json_({ error: err.message }); }
  }
  const page = (e && e.parameter && e.parameter.page) || 'hub';   // 기본은 단원 모음 페이지
  const files = { hub: 'index_hub', addsub: 'index_addsub', plane: 'index_plane', div: 'index_div', mul: 'index_mul', lentime: 'index_lentime', fracdec: 'index_fracdec' };
  const file = files[page] || 'index_hub';
  return HtmlService.createHtmlOutputFromFile(file)
    .setTitle('3학년 1학기 수학 개념 계단')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {                                                   // 앱을 다른 곳에 올렸을 때 기록 받기
  saveRecord(JSON.parse(e.postData.contents));
  return json_({ ok: true });
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}

function saveRecord(r) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);                                                // 여러 학생이 동시에 보내도 줄이 섞이지 않게
  try {
    sheet_().appendRow([new Date(), r.ban, r.no, r.name, r.unit, r.chasi, r.title, r.step, r.stepName,
      r.ok ? 'O' : 'X', r.tries, String(r.answer || '').slice(0, 400), r.level]);
  } finally { lock.releaseLock(); }
  return true;
}

function getRecords(pin) {
  if (String(pin) !== String(TEACHER_PIN)) throw new Error('비밀번호가 맞지 않아요.');
  const values = sheet_().getDataRange().getValues();
  return values.slice(1).map(v => ({
    time: v[0] instanceof Date ? v[0].toISOString() : String(v[0]), ban: String(v[1]), no: v[2], name: v[3],
    unit: v[4], chasi: v[5], title: v[6], step: v[7], stepName: v[8], ok: v[9] === 'O', tries: v[10], answer: v[11], level: v[12]
  }));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
