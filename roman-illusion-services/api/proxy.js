const ALLOWED = new Set([
  'index.html',
  'styles.css',
  'a2p.css',
  'app.js',
  'privacy/index.html',
  'terms/index.html'
]);

const CONTENT_TYPES = {
  'index.html': 'text/html; charset=utf-8',
  'privacy/index.html': 'text/html; charset=utf-8',
  'terms/index.html': 'text/html; charset=utf-8',
  'styles.css': 'text/css; charset=utf-8',
  'a2p.css': 'text/css; charset=utf-8',
  'app.js': 'application/javascript; charset=utf-8'
};

module.exports = async function handler(req, res) {
  const raw = Array.isArray(req.query.file) ? req.query.file[0] : req.query.file;
  const file = String(raw || '');

  if (!ALLOWED.has(file)) {
    res.status(404).send('Not found');
    return;
  }

  const upstreamUrl = `https://raw.githubusercontent.com/trevor0803/mat-digital-website/main/roman-illusion-services/${file}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'Roman-Illusion-Vercel-Site',
        'Accept': '*/*'
      }
    });

    const body = await upstream.text();
    res.setHeader('Content-Type', CONTENT_TYPES[file] || 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(upstream.status).send(body);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).send('Site content is temporarily unavailable.');
  }
};
