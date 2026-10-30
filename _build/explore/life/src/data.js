/* ───────── 실험 모형 (지난 판 life.html 실험실 모형을 바탕으로) ───────── */
/* 씨마다 싹 트는 날(물이 있고 온도가 알맞을 때). 같은 조건이면 언제나 같은 결과 */
const SEEDDAY=[3,3,3,4,3,3,4,3,3,3];
/* 씨의 모습: 0 마른 씨 · 1 물을 머금고 부풂 · 2 껍질이 벗겨지고 뿌리 · 3 싹 · 4~5 싹이 자람 */
function seedStage(c,i,d){if(!c.water||!c.temp)return 0;const sd=SEEDDAY[i];if(d>=sd)return Math.min(5,3+(d-sd));if(d>=sd-1)return 2;if(d>=1)return 1;return 0}
function sproutCount(c,d){let n=0;for(let i=0;i<10;i++)if(seedStage(c,i,d)>=3)n++;return n}
/* 케일: 잎 수(그림)·잎 색(pale)·줄기 굵기(thin)·시듦(wilt)·키(cm, 그림만)·잎 크기(size, 그림).
   교과서 근거는 '잎의 크기와 색깔, 줄기의 굵기'. 키는 근거로 쓰지 않고, 어느 조건에서도 줄지 않음.
   물을 주지 않으면 5일째쯤 뚜렷하게 시들도록(잎이 처지고 누렇게, 줄기가 약해짐) — 이 자료에서 정한 빠르기 */
function kaleAt(c,d){let h=10,n=6,wilt=0,pale=0,thin=0,size=1;
 if(c.water&&c.light){h=10+.5*d;n=6+Math.floor(d/5);size=1+.024*d}
 else if(c.water){h=10+.52*d;n=6+Math.floor(d/10);pale=Math.min(1,d/10);thin=Math.min(1,d/10)}
 else{h=10+(c.light?.3:.15)*Math.min(d,3);wilt=Math.min(1,Math.max(0,(d-1)/6));thin=wilt*.8;if(!c.light){pale=Math.min(1,d/10);thin=Math.max(thin,Math.min(1,d/10))}}
 return {h:Math.round(h*10)/10,n,wilt,pale,thin,size}}
const KDAYS=[0,5,10,14];
const SDAYS=[0,1,2,3,4,5];
/* 케일 관찰 항목: [열쇠, 이름, [보기0, 보기1]] — 보기0이 '잘 자람' 쪽 */
/* [열쇠, 이름, 결과표 글, 고르기 단추 글(짧게)] */
const KATTR=[['size','잎의 크기',['커졌어요','그대로예요'],['커졌어요','그대로']],['color','잎의 색깔',['진한 초록','연한 초록·노란빛'],['진한 초록','연한·노란']],['stem','줄기',['굵어요','가늘어요'],['굵어요','가늘어요']],['wilt','시듦',['싱싱해요','시들었어요'],['싱싱해요','시들어요']]];
function kAttrs(v){return v.cond==='water'?KATTR:KATTR.slice(0,3)}
function kaleTruth(v,c,d){const k=kaleAt(c,d),t={size:k.size>1.04?0:1,color:(k.pale>.3||k.wilt>.3)?1:0,stem:k.thin>.3?1:0,wilt:k.wilt>.3?1:0};
 const o={};kAttrs(v).forEach(a=>{o[a[0]]=t[a[0]]});return o}

/* 받침에 따라 조사 */
function jo(w,a,b){const s=String(w||'').trim();const c=s.charCodeAt(s.length-1);if(c>=0xAC00&&c<=0xD7A3)return s+((c-0xAC00)%28?a:b);return s+b}

/* ───────── 실험과 단계 ─────────
   cA = 알아보는 조건이 '있는' 쪽(물을 줌·따뜻함·빛·햇빛), cB = '없는' 쪽.
   어느 컵(화분)이 cA가 될지는 학생이 준비 단계(dec)에서 고름 → r.p(0 가 · 1 나). */
const GROUPS=['계획','준비','예상과 관찰','정리'];
const VARS={
 'seed-water':{exp:'seed',cond:'water',name:'물',sub:'교과서 실험',
  title:'씨가 싹 트는 데 필요한 조건',q:'씨가 싹 트는 데 물이 필요할까요?',
  cA:{water:1,temp:1,light:1},cB:{water:0,temp:1,light:1},
  lab:['물을 담은 컵','물을 담지 않은 컵'],short:['물 담음','물 안 담음'],dec:'water',
  plan:[['water','큰 컵에 담는 물','drop',1],['temp','온도','thermo',0],['seedkind','씨의 종류(무씨)','seed',0],['size','컵과 부직포의 크기','cup',0],['place','컵을 놓는 곳','place',0]],
  steps:['plan','tools','wick','felt','water','nest','seed','place','pred','obs','concl','sheet'],
  pred:['물을 담은 컵의 무씨만 싹이 틀 것 같아요.','두 컵의 무씨 모두 싹이 틀 것 같아요.','두 컵의 무씨 모두 싹이 트지 않을 것 같아요.'],
  frame:'{0} 컵의 무씨만 씨의 껍질이 벗겨지고 싹이 텄어요. 씨가 싹 트려면 {1} 필요해요.',ans:['@P','물'],jo:{1:['이','가']},chips:['가','나','물','빛','온도'],
  hint:['기록표에서 싹 튼 씨가 있는 컵을 찾아봐요.','두 컵에서 다르게 한 조건은 무엇이었나요?'],
  book:'씨가 싹 트려면 물이 필요해요.'},
 'seed-temp':{exp:'seed',cond:'temp',name:'온도',sub:'같은 주제 다른 탐구',
  title:'씨가 싹 트는 데 필요한 조건',q:'씨가 싹 트는 데 알맞은 온도가 필요할까요?',
  cA:{water:1,temp:1,light:0},cB:{water:1,temp:0,light:0},
  lab:['냉장고 밖','냉장고 안'],short:['냉장고 밖','냉장고 안'],dec:'fridge',
  plan:[['temp','컵을 두는 곳의 온도','thermo',1],['water','큰 컵에 담는 물','drop',0],['light','빛(상자 씌우기)','box',0],['seedkind','씨의 종류(무씨)','seed',0],['size','컵과 부직포의 크기','cup',0]],
  steps:['plan','tools','wick','felt','water','nest','seed','boxes','fridge','pred','obs','concl','sheet'],
  pred:['냉장고 밖 컵의 무씨만 싹이 틀 것 같아요.','두 컵의 무씨 모두 싹이 틀 것 같아요.','냉장고 안 컵의 무씨만 싹이 틀 것 같아요.'],
  frame:'{0}에 둔 무씨만 싹이 텄어요. 씨가 싹 트려면 {1} 필요해요.',ans:['냉장고 밖','알맞은 온도'],jo:{1:['이','가']},chips:['냉장고 안','냉장고 밖','알맞은 온도','빛','물'],
  hint:['기록표에서 싹 튼 씨가 있는 컵은 어디에 두었나요?','두 컵에서 다르게 한 조건은 무엇이었나요?'],
  book:'씨가 싹 트려면 알맞은 온도가 필요해요.'},
 'seed-light':{exp:'seed',cond:'light',name:'빛',sub:'더 알아보기 · 빛이 꼭 필요할까?',
  title:'씨가 싹 트는 데 필요한 조건',q:'씨가 싹 트는 데 빛이 꼭 필요할까요?',
  cA:{water:1,temp:1,light:1},cB:{water:1,temp:1,light:0},
  lab:['밝은 곳','어둠상자 안'],short:['밝은 곳','어둠상자'],dec:'darkbox',
  plan:[['light','빛(상자 씌우기)','sun',1],['water','큰 컵에 담는 물','drop',0],['temp','온도','thermo',0],['seedkind','씨의 종류(무씨)','seed',0],['size','컵과 부직포의 크기','cup',0]],
  steps:['plan','tools','wick','felt','water','nest','seed','darkbox','pred','obs','concl','sheet'],
  pred:['밝은 곳 컵의 무씨만 싹이 틀 것 같아요.','두 컵의 무씨 모두 싹이 틀 것 같아요.','어둠상자 속 무씨만 싹이 틀 것 같아요.'],
  frame:'밝은 곳과 어둠상자 안의 무씨가 {0} 싹이 텄어요. 무씨는 {1} 없어도 싹이 터요.',ans:['모두','빛'],jo:{1:['이','가']},chips:['모두','한쪽만','빛','물','온도'],
  hint:['기록표에서 두 컵의 싹 튼 씨를 견주어 봐요.','두 컵에서 다르게 한 조건은 무엇이었나요?'],
  book:'무씨는 빛이 없어도 싹이 터요.',bookLabel:'지도서 오개념 바로잡기'},
 'kale-water':{exp:'kale',cond:'water',name:'물',sub:'물을 줄 때와 주지 않을 때',
  title:'식물이 잘 자라는 데 필요한 조건',q:'식물이 잘 자라는 데 물이 필요할까요?',
  cA:{water:1,light:1},cB:{water:0,light:1},
  lab:['물을 준 케일','물을 주지 않은 케일'],short:['물 줌','물 안 줌'],dec:'kwater',
  plan:[['water','물 주기','drop',1],['light','햇빛','sun',0],['kind','식물의 종류(케일)','leaf',0],['size','처음 크기','ruler',0],['place','화분을 놓는 곳','place',0]],
  steps:['plan','ktools','kplace','ktag','kwater','pred','obs','concl','sheet'],
  pred:['물을 준 케일이 더 잘 자랄 것 같아요.','두 케일 모두 똑같이 자랄 것 같아요.','물을 주지 않은 케일이 더 잘 자랄 것 같아요.'],
  frame:'물을 주지 않은 케일은 잎과 줄기가 {0}. 식물이 잘 자라려면 {1} 필요해요.',ans:['시들었어요','물'],jo:{1:['이','가']},chips:['시들었어요','싱싱해요','물','햇빛'],
  hint:['기록표에서 물을 주지 않은 케일의 모습을 찾아봐요.','두 화분에서 다르게 한 조건은 무엇이었나요?'],
  book:'식물이 잘 자라려면 적당한 양의 물이 필요해요.'},
 'kale-light':{exp:'kale',cond:'light',name:'햇빛',sub:'햇빛을 받을 때와 받지 못할 때',
  title:'식물이 잘 자라는 데 필요한 조건',q:'식물이 잘 자라는 데 햇빛이 필요할까요?',
  cA:{water:1,light:1},cB:{water:1,light:0},
  lab:['햇빛을 받은 케일','햇빛을 받지 못한 케일'],short:['햇빛 받음','햇빛 못 받음'],dec:'kshade',
  plan:[['light','햇빛','sun',1],['water','물 주기','drop',0],['kind','식물의 종류(케일)','leaf',0],['size','처음 크기','ruler',0],['place','화분을 놓는 곳','place',0]],
  steps:['plan','ktools','kplace','ktag','kshade','kwater2','pred','obs','concl','sheet'],
  pred:['햇빛을 받은 케일이 더 잘 자랄 것 같아요.','두 케일 모두 똑같이 자랄 것 같아요.','햇빛을 받지 못한 케일이 더 잘 자랄 것 같아요.'],
  frame:'햇빛을 받지 못한 케일은 잎이 {0} 초록색이고 줄기가 {1}. 식물이 잘 자라려면 {2} 필요해요.',ans:['연한','가늘어요','햇빛'],jo:{2:['이','가']},chips:['연한','진한','가늘어요','굵어요','햇빛','물'],
  hint:['기록표에서 햇빛을 받지 못한 케일의 잎 색깔을 봐요.','기록표에서 줄기의 굵기를 봐요.','두 화분에서 다르게 한 조건은 무엇이었나요?'],
  book:'식물이 잘 자라려면 햇빛이 필요해요.'}
};

/* 준비 단계에서 학생이 고르는 것: p = 조건이 '있는' 쪽, q = '없는' 쪽(냉장고·상자·장치) */
function decOpts(v,id){const pot=v.exp==='kale'?'화분':'컵',big=v.exp==='kale'?'화분':'큰 컵';
 const both={t:'두 '+pot+' 모두'},A={t:'가 '+big+'에만'},B={t:'나 '+big+'에만'};
 if(id==='water'&&v.cond==='water')return [Object.assign({},A,{p:0}),Object.assign({},B,{p:1}),Object.assign({},both,{bad:'계획에서 물은 \'다르게\' 하기로 했어요.'})];
 if(id==='water')return [Object.assign({},both,{ok:1}),Object.assign({},A,{bad:'계획에서 물은 \'같게\' 하기로 했어요.'}),Object.assign({},B,{bad:'계획에서 물은 \'같게\' 하기로 했어요.'})];
 if(id==='fridge')return [{t:'가 컵을 냉장고에',p:1},{t:'나 컵을 냉장고에',p:0},{t:'두 컵 모두 냉장고에',bad:'계획에서 온도는 \'다르게\' 하기로 했어요.'}];
 if(id==='darkbox')return [{t:'가 컵에 씌우기',p:1},{t:'나 컵에 씌우기',p:0},{t:'두 컵 모두',bad:'계획에서 빛은 \'다르게\' 하기로 했어요.'}];
 if(id==='kwater')return [Object.assign({},A,{p:0}),Object.assign({},B,{p:1}),Object.assign({},both,{bad:'계획에서 물 주기는 \'다르게\' 하기로 했어요.'})];
 if(id==='kshade')return [{t:'가 화분에 씌우기',p:1},{t:'나 화분에 씌우기',p:0},{t:'두 화분 모두',bad:'계획에서 햇빛은 \'다르게\' 하기로 했어요.'}];
 if(id==='kwater2')return [Object.assign({},both,{ok:1}),Object.assign({},A,{bad:'계획에서 물 주기는 \'같게\' 하기로 했어요.'}),Object.assign({},B,{bad:'계획에서 물 주기는 \'같게\' 하기로 했어요.'})];
 return null}

/* 단계 글: 한 문장 한 생각. n0 = 계획을 세우기 전에 보이는 이름(답을 미리 알리지 않게) */
function stepDef(V,id){const W=V.cond==='water',L=V.cond==='light',K=V.exp==='kale';
 const D={
  plan:{g:0,n:'알아볼 조건 정하기',t:'무엇을 다르게 하고, 무엇을 같게 할까요?',k:'plan',
   why:'한 가지만 다르게 해야 무엇 때문인지 알 수 있어요.',care:['know','모두 고른 뒤에 계획을 확인해요.']},
  tools:{g:1,n:'준비물 살펴보기',t:'준비물을 살펴봐요',act:'준비물 꺼내기',k:'scene',dur:1900,
   why:'두 컵을 똑같이 꾸미려고 모두 2개씩 준비해요.',care:['care','실험에 쓰는 무씨는 먹지 않아요.']},
  wick:{g:1,n:'심지 끼우기',t:'작은 컵 구멍에 부직포 심지를 끼워요',act:'심지 끼우기',k:'scene',dur:1500,
   why:'심지가 큰 컵의 물을 위로 빨아올려요.',care:['care','심지를 끼울 때 손을 다치지 않게 조심해요.']},
  felt:{g:1,n:'원 모양 부직포 올리기',t:'심지를 옆으로 눕히고 원 모양 부직포를 올려요',act:'부직포 올리기',k:'scene',dur:1800,
   why:'부직포가 젖으면 무씨가 물을 받을 수 있어요.',care:['know','두 컵의 부직포 크기를 같게 해요.']},
  water:W?{g:1,n:'한 컵에만 물 담기',n0:'큰 컵에 물 담기',t:'한쪽 큰 컵에만 물을 담아요',ask:'어느 큰 컵에 물을 담을까요?',k:'scene',dur:2100,
   why:'물만 다르게 해야 물이 필요한지 알 수 있어요.',care:['care','물을 흘리지 않게 천천히 부어요.']}
   :{g:1,n:'두 컵에 물 담기',n0:'큰 컵에 물 담기',t:'큰 컵에 물을 담아요',ask:'어느 큰 컵에 물을 담을까요?',k:'scene',dur:2100,
   why:'물은 같게 할 조건이에요.',care:['care','물을 흘리지 않게 천천히 부어요.']},
  nest:{g:1,n:'작은 컵 끼우기',t:'심지를 아래로 두고 작은 컵을 큰 컵에 끼워요',act:'작은 컵 끼우기',k:'scene',dur:2400,
   why:'심지 끝이 물에 닿아야 부직포가 젖어요.',care:['know',W?'물이 없는 큰 컵의 부직포는 마른 채로 있어요.':'두 컵의 부직포가 모두 젖었어요.']},
  seed:{g:1,n:'무씨 올리기',t:'원 모양 부직포 위에 무씨를 골고루 올려요',act:'무씨 올리기',k:'scene',dur:2400,
   why:'두 컵에 같은 수를 올려야 견주기 쉬워요.',care:['know','이 실험관에서는 세기 쉽게 10개씩 올려요.']},
  place:{g:1,n:'같은 곳에 두기',t:'두 컵을 같은 곳에 두어요',act:'같은 곳에 두기',k:'scene',dur:1500,
   why:'온도와 빛을 같게 하려고 같은 곳에 두어요.',care:['care','물을 담은 큰 컵에 물이 늘 있는지 확인해요.']},
  darkbox:{g:1,n:'한 컵에만 어둠상자',n0:'어둠상자 씌우기',t:'같은 곳에 두고, 한 컵에만 어둠상자를 씌워요',ask:'어느 컵에 어둠상자를 씌울까요?',k:'scene',dur:1500,
   why:'빛만 다르게 하려고 두 컵을 같은 곳에 두어요.',care:['know','어둠상자 안에는 빛이 들지 않아요.']},
  boxes:{g:1,n:'두 컵 모두 어둠상자',n0:'어둠상자 씌우기',t:'두 컵 모두 어둠상자로 덮어요',act:'어둠상자 씌우기',k:'scene',dur:1500,
   why:'냉장고 안은 어두워요. 빛을 같게 하려고 둘 다 덮어요.',care:['know','어둠상자 안에는 빛이 들지 않아요.']},
  fridge:{g:1,n:'한 컵은 냉장고에',n0:'컵 두기',t:'한 컵은 냉장고 냉장실에, 다른 컵은 냉장고 밖에 두어요',ask:'어느 컵을 냉장고에 넣을까요?',k:'scene',dur:2900,
   why:'온도만 다르게 하려는 거예요.',care:['know','냉장고 냉장실 안은 온도가 낮아요.']},
  ktools:{g:1,n:'준비물 살펴보기',t:'준비물을 살펴봐요',act:'준비물 꺼내기',k:'scene',dur:1700,
   why:'비슷한 크기로 자란 케일 두 화분으로 견주어요.',care:['care','실험 준비물을 가지고 장난치지 않아요.']},
  kplace:{g:1,n:'같은 곳에 놓기',t:'두 화분을 같은 장소에 놓아요',act:'같은 곳에 놓기',k:'scene',dur:1500,
   why:L?'온도와 바람을 같게 하려고 같은 곳에 놓아요.':'햇빛과 온도를 같게 하려고 같은 곳에 놓아요.',care:['know','두 화분은 비슷한 크기로 자란 케일이에요.']},
  ktag:{g:1,n:'이름표 붙이기',t:'가 화분과 나 화분에 이름표를 붙여요',act:'이름표 붙이기',k:'scene',dur:1200,
   why:'어느 화분인지 헷갈리지 않게 해요.',care:['know','관찰한 것을 적을 때도 가와 나로 적어요.']},
  kwater:{g:1,n:'한 화분에만 물 주기',n0:'물 주기',t:'한 화분에만 물을 줘요',ask:'어느 화분에 물을 줄까요?',k:'scene',dur:2100,
   why:'물만 다르게 해야 물이 필요한지 알 수 있어요.',care:['care','물을 너무 많이 주면 뿌리가 썩을 수 있어요.']},
  kshade:{g:1,n:'햇빛 차단 장치 씌우기',t:'한 화분에 햇빛 차단 장치를 씌워요',ask:'어느 화분에 장치를 씌울까요?',k:'scene',dur:1500,
   why:'햇빛만 다르게 해요. 흰 장치에는 바람 구멍이 있어요.',care:['know','물을 줄 때만 잠깐 들어 올려요.']},
  kwater2:{g:1,n:'두 화분에 물 주기',n0:'물 주기',t:'화분에 물을 줘요',ask:'어느 화분에 물을 줄까요?',k:'scene',dur:3200,
   why:'물은 같게 할 조건이에요.',care:['care','물을 너무 많이 주면 뿌리가 썩을 수 있어요.']},
  pred:{g:2,n:'결과 예상하기',t:K?'두 케일은 어떻게 자랄까요?':'며칠 뒤 두 컵의 무씨는 어떻게 될까요?',k:'pred',
   why:'예상은 맞히기가 아니에요. 내 생각을 남겨요.',care:['know','예상은 틀려도 괜찮아요.']},
  obs:K?{g:2,n:'며칠마다 관찰하기',t:'케일을 돌보며 잎과 줄기를 살펴요',k:'obs',
   why:'잎의 크기와 색깔, 줄기의 굵기를 견주어요.',care:L?['know','관찰할 때만 장치를 잠깐 들어 올려요.']:['care','물을 너무 많이 주지 않아요.']}
   :{g:2,n:'날마다 관찰하기',t:'날마다 살펴보고 싹 튼 씨를 세어요',k:'obs',
   why:'날마다 같은 방법으로 세어야 견줄 수 있어요.',care:['care',W?'물을 담은 큰 컵에 물이 늘 있는지 확인해요.':'두 큰 컵에 물이 늘 있는지 확인해요.']},
  concl:{g:3,n:'결론 쓰기',t:'기록을 보고 결론을 써요',k:'concl',
   why:'결론은 내 관찰 기록에서 나와요.',care:['know',K?'실험이 끝나면 두 화분 모두 물과 햇빛을 줘요.':L?'상추처럼 싹 틀 때 빛이 꼭 필요한 씨도 있어요.':'젖은 부직포와 심지는 선생님 안내에 따라 버려요.']},
  sheet:{g:3,n:'결과 한 장',t:'실험 결과를 한 장으로 정리해요',k:'sheet',why:'',care:null}
 };
 const s=Object.assign({id},D[id]);const o=decOpts(V,id);if(o)s.opts=o;return s}
