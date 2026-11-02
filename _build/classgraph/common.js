/* 우리 반 그래프 공통: 자료 저장(그 기기 localStorage), 예시 자료 */
var CG = (function () {
  var KEY = 'hj-cgraph-v1';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null } catch (e) { return null } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch (e) { } }
  var SAMPLES = [
    { t: '우리 반이 좋아하는 과일', u: '명', rows: [['사과', 6], ['딸기', 9], ['포도', 4], ['수박', 7], ['바나나', 3]] },
    { t: '우리 반 학생이 태어난 계절', u: '명', rows: [['봄', 7], ['여름', 5], ['가을', 8], ['겨울', 6]] },
    { t: '학교에 오는 방법', u: '명', rows: [['걸어서', 15], ['자전거', 3], ['버스', 4], ['자동차', 4]] },
    { t: '모둠별 이번 달에 읽은 책', u: '권', rows: [['1모둠', 18], ['2모둠', 24], ['3모둠', 15], ['4모둠', 21], ['5모둠', 27]] },
    { t: '교실 온도의 변화', u: '°C', rows: [['9시', 18], ['10시', 20], ['11시', 22], ['12시', 24], ['1시', 25], ['2시', 23]] }];
  return { load: load, save: save, SAMPLES: SAMPLES };
})();
