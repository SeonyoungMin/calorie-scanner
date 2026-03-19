/**
 * Claude API 통신 모듈
 */
const CLAUDE_CONFIG = {
    // 실제 작동하는 최신 모델명으로 수정
    MODEL_SONNET: "claude-3-5-sonnet-20240620", 
    MODEL_HAIKU: "claude-3-haiku-20240307",
    VERSION: "2023-06-01"
};

async function callClaude(payload) {
    const k = (localStorage.getItem('ck') || '').replace(/[^\x20-\x7E]/g, '').trim();
    if (!k) throw new Error('설정에서 API 키를 먼저 등록하세요!');

    // 페이로드의 모델명을 실제 작동하는 모델로 강제 교정
    if (payload.model.includes('haiku')) {
        payload.model = CLAUDE_CONFIG.MODEL_HAIKU;
    } else {
        payload.model = CLAUDE_CONFIG.MODEL_SONNET;
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': k,
            'anthropic-version': CLAUDE_CONFIG.VERSION,
            'anthropic-dangerous-direct-browser-access': 'true' // 브라우저 호출 허용
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ? data.error.message : 'API 오류 ' + res.status);
    return data;
}

// JSON 파싱 안정화 함수
function parseJson(text) {
    try {
        const m = text.match(/\{[\s\S]*\}/);
        if (!m) throw new Error('응답에서 JSON 형식을 찾을 수 없습니다.');
        return JSON.parse(m[0]);
    } catch (e) {
        throw new Error('AI 응답 해석 실패: ' + e.message);
    }
}
