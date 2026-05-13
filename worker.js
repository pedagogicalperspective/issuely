// Cloudflare Worker — Issuely entry point.
//
// Routes:
//   POST /api/claude   → Anthropic Messages API proxy
//   *                  → static asset from ./dist (with SPA fallback)
//
// env.ANTHROPIC_API_KEY must be set as a secret in the dashboard.
// env.ASSETS is the static-asset binding, configured in wrangler.toml.

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const DEFAULT_MAX_TOKENS = 1500;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

async function handleClaude(request, env) {
  if (request.method !== 'POST') {
    return json({ error: 'Sadece POST destekleniyor' }, 405);
  }
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: 'ANTHROPIC_API_KEY ortam değişkeni tanımlı değil' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Geçersiz JSON' }, 400);
  }

  const { prompt, model = DEFAULT_MODEL, max_tokens = DEFAULT_MAX_TOKENS } = body || {};

  if (!prompt || typeof prompt !== 'string') {
    return json({ error: 'prompt alanı eksik veya geçersiz' }, 400);
  }
  if (prompt.length > 50000) {
    return json({ error: 'prompt çok uzun (max 50.000 karakter)' }, 400);
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => '');
      return json(
        {
          error: 'Anthropic API hatası',
          status: upstream.status,
          details: errorText.slice(0, 500),
        },
        upstream.status,
      );
    }

    const data = await upstream.json();
    const text = (data.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n');

    return json({ text, usage: data.usage });
  } catch (e) {
    return json({ error: 'İstek başarısız', message: e.message || String(e) }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/claude') {
      return handleClaude(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
