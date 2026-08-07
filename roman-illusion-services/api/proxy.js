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

const RAW_DISCLOSURE = 'I agree to receive calls and texts from Roman Illusion about my request. Message frequency varies. Message and data rates may apply. Reply STOP to opt out. Consent is not a condition of purchase.';
const A2P_DISCLOSURE = '<strong>Optional SMS consent:</strong> By checking this box, I agree to receive recurring automated and manual SMS messages from Roman Illusion, Inc. about my estimate request, scheduling, and project-related follow-up at the mobile number provided. Message frequency varies. Message &amp; data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of purchase. See our <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener">Terms &amp; Conditions</a>.';
const LEGAL_LINKS = '<div class="footer-legal"><a href="/privacy">Privacy Policy</a><span>·</span><a href="/terms">Terms &amp; Conditions</a><span>·</span><span>SMS: Reply STOP to opt out · HELP for help</span></div>';
const SOURCE_VERSION = 'a2p-20260807-1742';

module.exports = async function handler(req, res) {
  const raw = Array.isArray(req.query.file) ? req.query.file[0] : req.query.file;
  const file = String(raw || '');

  if (!ALLOWED.has(file)) {
    res.status(404).send('Not found');
    return;
  }

  const upstreamUrl = `https://raw.githubusercontent.com/trevor0803/mat-digital-website/main/roman-illusion-services/${file}?v=${SOURCE_VERSION}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'Roman-Illusion-Vercel-Site',
        'Accept': '*/*',
        'Cache-Control': 'no-cache'
      }
    });

    let body = await upstream.text();

    if (file === 'index.html') {
      if (!body.includes('href="/a2p.css"')) {
        body = body.replace('</head>', '<link rel="stylesheet" href="/a2p.css">\n</head>');
      }
      body = body.replace(RAW_DISCLOSURE, A2P_DISCLOSURE);
      if (!body.includes('class="footer-legal"')) {
        body = body.replace('</footer>', LEGAL_LINKS + '</footer>');
      }
    }

    res.setHeader('Content-Type', CONTENT_TYPES[file] || 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(upstream.status).send(body);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).send('Site content is temporarily unavailable.');
  }
};
