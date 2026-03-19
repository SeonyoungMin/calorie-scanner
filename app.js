// STATE & INIT
let imgB64=null, imgType='image/jpeg', lastRes=null, mealLog=[], workoutLog=[], goal=2000, waterMl=0, weightLog=[], cycleData={lastDate:'', cycleLen:28};
const TODAY = new Date().toISOString().slice(0, 10);

window.onload = () => {
    loadData();
    renderLog(); renderWater(); renderStats(); renderCycle();
};

function loadData() {
    const k = localStorage.getItem('ck'); if(k) document.getElementById('apiKey').value = k;
    goal = parseInt(localStorage.getItem('cg') || 2000);
    mealLog = JSON.parse(localStorage.getItem('mealLog_'+TODAY) || '[]');
    workoutLog = JSON.parse(localStorage.getItem('workoutLog_'+TODAY) || '[]');
    waterMl = parseInt(localStorage.getItem('water_'+TODAY) || 0);
    weightLog = JSON.parse(localStorage.getItem('weightLog') || '[]');
    cycleData = JSON.parse(localStorage.getItem('cycleData') || '{"lastDate":""}');
}

// NAVIGATION
function go(tab) {
    document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
    document.getElementById('s-'+tab).classList.add('on');
    if(tab==='today') renderLog();
    if(tab==='stats') renderStats();
}

// API ACTIONS (Scan & Review)
async function doAnalyze() {
    document.getElementById('loader').style.display = 'flex';
    try {
        const res = await callClaude({
            max_tokens: 1024,
            messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: imgType, data: imgB64 } }, { type: 'text', text: "Analyze food. JSON: {total_kcal, foods:[{name, kcal}]}" }] }]
        });
        lastRes = parseJson(res.content[0].text);
        renderFoodList('foodList', lastRes.foods);
        document.getElementById('resWrap').style.display = 'flex';
    } catch(e) { alert(e.message); }
    finally { document.getElementById('loader').style.display = 'none'; }
}

async function generateReview() {
    try {
        const res = await callClaude({
            messages: [{ role: 'user', content: `Review diet: ${JSON.stringify(mealLog)}. JSON: {stars, review}` }]
        });
        const rv = parseJson(res.content[0].text);
        document.getElementById('reviewText').innerText = rv.review;
        document.getElementById('reviewCard').style.display = 'block';
    } catch(e) { alert('리뷰 실패'); }
}

// LOGGING FUNCTIONS
function addLog() {
    mealLog.push({...lastRes, id: Date.now(), time: new Date().toLocaleTimeString()});
    localStorage.setItem('mealLog_'+TODAY, JSON.stringify(mealLog));
    go('today');
}

function addWater(ml) {
    waterMl = Math.max(0, waterMl + ml);
    localStorage.setItem('water_'+TODAY, waterMl);
    renderWater();
}

// RENDER HELPERS (나머지 모든 기능 포함)
function renderLog() { /* 기존 로직과 동일하게 리스트와 게이지 업데이트 */ }
function renderWater() { /* 물 컵 아이콘 업데이트 */ }
function renderStats() { /* 그래프 7일치 계산 및 렌더링 */ }
function renderCycle() { /* 주기 계산 로직 */ }

// SETTINGS
function saveKey() { localStorage.setItem('ck', document.getElementById('apiKey').value); }
function saveGoal() { localStorage.setItem('cg', document.getElementById('goalInput').value); }

/* ... (나머지 세부 헬퍼 함수들은 기존 소스에서 그대로 가져와 붙여넣으시면 됩니다) ... */
