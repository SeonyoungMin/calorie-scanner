/**
 * API 통신 관련 모듈
 */
const API_CONFIG = {
    SONNET: "claude-3-5-sonnet-20240620",
    HAIKU: "claude-3-haiku-20240307",
    VERSION: "2023-06-01"
};

async function callClaude(payload) {
    const k = (localStorage.getItem('ck') || '').replace(/[^\x20-\x7E]/g, '').trim();
    if (!k) throw new Error('API 키를 등록하세요!');

    const targetModel = payload.model.includes('haiku') ? API_CONFIG.HAIKU : API_CONFIG.SONNET;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': k,
            'anthropic-version': API_CONFIG.VERSION,
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({ ...payload, model: targetModel })
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error ? errData.error.message : `API 오류: ${res.status}`);
    }
    return await res.json();
}

function parseJson(text) {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('응답 데이터 해석 실패');
    return JSON.parse(cleaned.substring(start, end + 1));
}
