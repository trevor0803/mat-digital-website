const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/kcn-estimate-auto-advance.js <html-file>');
  process.exit(1);
}

let html = fs.readFileSync(file, 'utf8');

const cssNeedle = '.options button{min-height:46px;padding:10px 12px;border:1px solid #d7d6d1;border-radius:9px;background:#f8f7f4;color:#292929;text-align:left;font-size:12px;font-weight:900;cursor:pointer}.options button:hover,.options button:focus{border-color:var(--accent);background:#fff9eb;outline:0;box-shadow:0 0 0 3px rgba(245,158,11,.1)}';
const cssReplacement = cssNeedle + '.option-shell{position:relative}.option-shell button{width:100%;height:100%}.option-shell>a{position:absolute;inset:0;z-index:2;border-radius:9px}.option-shell:hover button,.option-shell:focus-within button{border-color:var(--accent);background:#fff9eb;outline:0;box-shadow:0 0 0 3px rgba(245,158,11,.1)}';
if (!html.includes('.option-shell{position:relative}')) {
  html = html.replace(cssNeedle, cssReplacement);
}

const step1Pattern = /<section class="survey-step" id="survey-step-1">[\s\S]*?<\/section>\n<section class="survey-step" id="survey-step-2">/;
const step1AndOpenStep2 = `<section class="survey-step" id="survey-step-1"><span class="step-label">Step 1 of 4 · Service</span><h3>What service do you need?</h3><p class="step-copy">Choose the closest match.</p><div class="options"><div class="option-shell"><button type="button">Bathroom Remodeling</button><a href="#survey-step-2" aria-label="Bathroom Remodeling"></a></div><div class="option-shell"><button type="button">Kitchen Remodeling</button><a href="#survey-step-2" aria-label="Kitchen Remodeling"></a></div><div class="option-shell"><button type="button">Home Addition</button><a href="#survey-step-2" aria-label="Home Addition"></a></div><div class="option-shell"><button type="button">Flooring / Tile</button><a href="#survey-step-2" aria-label="Flooring / Tile"></a></div><div class="option-shell"><button type="button">Something Else</button><a href="#survey-step-2" aria-label="Something Else"></a></div></div></section>\n<section class="survey-step" id="survey-step-2">`;
html = html.replace(step1Pattern, step1AndOpenStep2);

const step2Pattern = /<section class="survey-step" id="survey-step-2">[\s\S]*?<\/section>\n<section class="survey-step" id="survey-step-3">/;
const step2AndOpenStep3 = `<section class="survey-step" id="survey-step-2"><span class="step-label">Step 2 of 4 · Timeline</span><h3>When are you looking to start?</h3><p class="step-copy">Choose the closest timeframe.</p><div class="options"><div class="option-shell"><button type="button">As Soon As Possible</button><a href="#survey-step-3" aria-label="As Soon As Possible"></a></div><div class="option-shell"><button type="button">Within 1–3 Months</button><a href="#survey-step-3" aria-label="Within 1–3 Months"></a></div><div class="option-shell"><button type="button">Within 3–6 Months</button><a href="#survey-step-3" aria-label="Within 3–6 Months"></a></div><div class="option-shell"><button type="button">Just Planning</button><a href="#survey-step-3" aria-label="Just Planning"></a></div></div><div class="survey-nav"><a class="survey-back" href="#survey-step-1">Back</a><span></span></div></section>\n<section class="survey-step" id="survey-step-3">`;
html = html.replace(step2Pattern, step2AndOpenStep3);

fs.writeFileSync(file, html);
console.log('KCN estimate service options and auto-advance applied.');
