// netlify/functions/claude-proxy.js
// Handles both Claude (Anthropic) and Gemini (Google) — keys stored securely server-side

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }, body: '' };
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  try {
    const body = JSON.parse(event.body);
    const isGemini = body.contents !== undefined || body._provider === 'gemini';

    if (isGemini) {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) return { statusCode: 500, headers,
        body: JSON.stringify({ error: { message: 'GEMINI_API_KEY not set in Netlify env vars' } }) };
      const modelId = body._model || 'gemini-2.5-flash';
      const { _provider, _model, ...geminiBody } = body;
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${geminiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(geminiBody) }
      );
      return { statusCode: r.status, headers, body: JSON.stringify(await r.json()) };
    } else {
      const anthropicKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicKey) return { statusCode: 500, headers,
        body: JSON.stringify({ error: { message: 'ANTHROPIC_API_KEY not set in Netlify env vars' } }) };
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify(body)
      });
      return { statusCode: r.status, headers, body: JSON.stringify(await r.json()) };
    }
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: { message: e.message } }) };
  }
};
