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
const OLD_PRIVACY_NOTICE = '<div class="notice"><strong>Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes.</strong> Text messaging originator opt-in data and consent will not be shared with third parties for their own marketing or promotional purposes. We may use service providers that help us operate our communications systems or deliver messages, but only as necessary to provide those services on our behalf.</div>';
const REQUIRED_PRIVACY_NOTICE = '<div class="notice"><strong>No mobile information will be shared with third parties/affiliates for marketing/promotional purposes.</strong> Information sharing to subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.</div>';
const TERMS_OPTOUT = '<li><strong>Opt out:</strong> Reply <strong>STOP</strong> at any time to stop receiving SMS messages from this program. After you opt out, you may receive a final confirmation message.</li>';
const TERMS_REJOIN = '<li><strong>Rejoining:</strong> After opting out, you may rejoin the SMS program by submitting a new website request and voluntarily checking the SMS consent box again.</li>';
const CONSENT_SECTION = '<h2>Consent and Eligibility</h2>\n<p>You represent that the mobile number you provide belongs to you or that you are authorized to provide consent for that number. The SMS checkbox is optional and is not preselected. If you do not opt into SMS, you may still request an estimate and communicate with Roman Illusion by phone or email.</p>';
const STANDARDS_SECTION = '<h2>Messaging Standards and Legal Compliance</h2>\n<p>Roman Illusion, Inc. intends to operate its SMS program in accordance with applicable federal and state law, carrier requirements, and applicable industry messaging standards. If any part of these SMS terms conflicts with a requirement that cannot legally be waived, the applicable law or requirement controls.</p>';
const HERO_CALL_CTA_CSS = '.hero-copy .hero-phone{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 24px;background:#f48120;border:2px solid #f48120;border-radius:7px;color:#fff;font-size:13px;font-weight:900;letter-spacing:.01em;box-shadow:0 10px 24px rgba(244,129,32,.28);transition:background .2s ease,border-color .2s ease,transform .2s ease,box-shadow .2s ease}.hero-copy .hero-phone:hover{background:#ff9a43;border-color:#ff9a43;color:#fff;transform:translateY(-2px);box-shadow:0 14px 30px rgba(244,129,32,.34)}@media(max-width:600px){.hero-copy .hero-phone{min-height:52px;padding:0 20px;font-size:13px}}';
const SOURCE_VERSION = 'roman-license-20260807-1449';

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
      body = body.replace('Licensed Contractor #181607', 'PA Contractor #PA223191');
      body = body.replace('Licensed #181607', 'PA Contractor #PA223191');
      if (!body.includes('class="footer-legal"')) {
        body = body.replace('</footer>', LEGAL_LINKS + '</footer>');
      }
    }

    if (file === 'a2p.css' && !body.includes('.hero-copy .hero-phone{')) {
      body += '\n' + HERO_CALL_CTA_CSS + '\n';
    }

    if (file === 'privacy/index.html') {
      body = body.replace(OLD_PRIVACY_NOTICE, REQUIRED_PRIVACY_NOTICE);
    }

    if (file === 'terms/index.html') {
      if (!body.includes('<strong>Rejoining:</strong>')) {
        body = body.replace(TERMS_OPTOUT, TERMS_OPTOUT + '\n' + TERMS_REJOIN);
      }
      if (!body.includes('Messaging Standards and Legal Compliance')) {
        body = body.replace(CONSENT_SECTION, CONSENT_SECTION + '\n' + STANDARDS_SECTION);
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
