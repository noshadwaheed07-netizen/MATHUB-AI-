/*
 MATHHUB 10.0 AI backend starter (Cloudflare Worker)
 Required Worker secrets/vars:
   OPENAI_API_KEY  (secret)
   ALLOWED_ORIGIN  (e.g. https://YOUR-USERNAME.github.io)
   OPENAI_MODEL    (optional; choose a model enabled for your API project)
 Deploy this Worker separately from GitHub Pages. Never put OPENAI_API_KEY in index.html.
*/
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '';
    const corsOrigin = allowed && origin === allowed ? origin : 'null';
    const headers = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
    if (!allowed || origin !== allowed) return Response.json({ error: 'Origin not allowed' }, { status: 403, headers });
    if (!env.OPENAI_API_KEY) return Response.json({ error: 'Server AI key is not configured' }, { status: 503, headers });
    try {
      const body = await request.json();
      const message = String(body.message || '').trim();
      if (!message || message.length > 8000) return Response.json({ error: 'Message must be 1–8000 characters' }, { status: 400, headers });
      const context = body.context && typeof body.context === 'object' ? body.context : {};
      const instructions = [
        'You are MATHHUB, an accurate and patient academic assistant for a BS Mathematics student.',
        'Explain mathematics from definitions and first principles. Show reasoning step by step, distinguish assumptions from conclusions, and admit uncertainty.',
        'Do not invent university policies, marks, course outlines, or official grades. Treat supplied student context as private user-provided data.',
        'For learning, guide the student instead of simply giving unsupported final answers.'
      ].join(' ');
      const upstream = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || 'gpt-6-astra',
          instructions,
          input: `Student context (use only when relevant): ${JSON.stringify(context).slice(0, 12000)}\n\nStudent message: ${message}`
        })
      });
      const result = await upstream.json();
      if (!upstream.ok) return Response.json({ error: result.error?.message || `AI provider error ${upstream.status}` }, { status: 502, headers });
      const reply = result.output_text || (result.output || []).flatMap(x => x.content || []).map(x => x.text || '').join('\n');
      if (!reply) return Response.json({ error: 'No text returned by AI provider' }, { status: 502, headers });
      return Response.json({ reply }, { headers });
    } catch (error) {
      return Response.json({ error: 'Request failed: ' + String(error.message || error) }, { status: 500, headers });
    }
  }
};
