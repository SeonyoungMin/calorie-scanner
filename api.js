const CLAUDE_CONFIG = {
    MODEL_SONNET: "claude-3-5-sonnet-20240620", 
    MODEL_HAIKU: "claude-3-haiku-20240307",
    VERSION: "2023-06-01"
};

async function callClaude(payload) {
    const k = (localStorage.getItem('ck') || '').replace(/[^\x20-\x7E]/g, '').trim();
    if (!k) throw new Error('API 키를 등록하세요!');

    if (payload.model.includes('haiku')) payload.model = CLAUDE_CONFIG.MODEL_HAIKU;
    else payload.model = CLAUDE_CONFIG.MODEL_SONNET;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': k,
            'anthropic-version': CLAUDE_CONFIG.VERSION,
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ? data.error.message : 'API 오류');
    return data;
}

function parseJson(text) {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('JSON을 찾을 수 없습니다.');
    return JSON.parse(m[0]);
}
