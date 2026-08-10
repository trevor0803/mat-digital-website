const fs = require('fs');

const target = process.argv[2];
if (!target) {
  console.error('Usage: node scripts/apply-standard-estimate-survey.js <html-file>');
  process.exit(1);
}

let html = fs.readFileSync(target, 'utf8');

html = html.replace(
  /\.survey-progress\{display:grid;grid-template-columns:repeat\(\d+,1fr\);/,
  '.survey-progress{display:grid;grid-template-columns:repeat(4,1fr);'
);

html = html.replace(
  '.options button span{color:var(--blue);font-size:16px}',
  '.options button:after{content:"→";color:var(--blue);font-size:16px}'
);

// Keep estimate language accurate: the form requests follow-up; it does not deliver an instant estimate.
html = html
  .replace(/Get My Free Estimate →/g, 'Request a Free Estimate →')
  .replace(/>Free Estimate</g, '>Request Estimate<')
  .replace('Free project estimate', 'Request a free estimate')
  .replace('Start with a free project estimate. No complicated booking process.', 'Request a free project estimate. No complicated booking process.');

const surveyMarkup = `<div class="survey-progress" id="progress"><span class="active"></span><span></span><span></span><span></span></div>
    <div class="survey-step-label" id="stepLabel">Step 1 of 4</div>
    <form id="estimateForm">
      <div class="screen active" data-step="1">
        <h2>What service are you looking for?</h2>
        <p>Choose the closest match.</p>
        <div class="options" data-field="projectType">
          <button type="button">Kitchen</button>
          <button type="button">Bathroom</button>
          <button type="button">Home Addition</button>
          <button type="button">Flooring / Tiling</button>
          <button type="button">Something Else</button>
        </div>
      </div>
      <div class="screen" data-step="2">
        <h2>When are you looking to start?</h2>
        <p>Choose the closest timeframe.</p>
        <div class="options" data-field="timeline">
          <button type="button">As Soon As Possible</button>
          <button type="button">Within 1–3 Months</button>
          <button type="button">Within 3–6 Months</button>
          <button type="button">Just Planning</button>
        </div>
      </div>
      <div class="screen" data-step="3">
        <h2>Tell us about your project.</h2>
        <p>A sentence or two is perfect.</p>
        <div class="field"><label for="projectRequest">Project Details</label><textarea id="projectRequest" name="projectRequest" rows="5" placeholder="Tell us what you want to update, build, or change." required></textarea></div>
      </div>
      <div class="screen" data-step="4">
        <h2>How should KCN contact you about your project?</h2>
        <p>Enter the best contact information for KCN to follow up with you.</p>
        <div class="two"><div class="field"><label for="firstName">First Name</label><input id="firstName" name="firstName" autocomplete="given-name" placeholder="First name" required></div><div class="field"><label for="lastName">Last Name</label><input id="lastName" name="lastName" autocomplete="family-name" placeholder="Last name" required></div></div>
        <div class="two"><div class="field"><label for="phone">Mobile Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="(703) 555-1234" required></div><div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" placeholder="you@email.com" required></div></div>
        <div class="field"><label for="projectZip">Project ZIP Code</label><input id="projectZip" name="projectZip" inputmode="numeric" autocomplete="postal-code" maxlength="5" placeholder="22101" required></div>
        <label class="consent"><input type="checkbox" id="sms" name="smsConsent" value="yes"><span>By checking this box, I consent to receive recurring SMS messages from KCN Construction at the mobile number provided regarding my estimate request, scheduling, appointment reminders, project updates, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of purchase. See <a href="https://kcn-construction-dmv.vercel.app/terms" target="_blank" rel="noopener">Terms & SMS Terms</a> and <a href="https://kcn-construction-dmv.vercel.app/privacy" target="_blank" rel="noopener">Privacy Policy</a>.</span></label>
        <p class="form-note">SMS consent is optional and the checkbox is not preselected. You can request an estimate without agreeing to text messages.</p>
      </div>
      <div class="survey-nav"><button class="back" id="backBtn" type="button" style="visibility:hidden">← Back</button><button class="next" id="nextBtn" type="button">Continue →</button></div>
    </form>`;

const surveyPattern = /<div class="survey-progress" id="progress">[\s\S]*?<\/form>/;
if (!surveyPattern.test(html)) {
  throw new Error('Could not find survey form block to replace.');
}
html = html.replace(surveyPattern, surveyMarkup);

const surveyScript = `<script>
(function(){
  var step=1,total=4,state={};
  var screens=[].slice.call(document.querySelectorAll('.screen'));
  var progress=[].slice.call(document.querySelectorAll('#progress span'));
  var label=document.getElementById('stepLabel');
  var back=document.getElementById('backBtn');
  var next=document.getElementById('nextBtn');
  function render(){
    screens.forEach(function(s){s.classList.toggle('active',Number(s.getAttribute('data-step'))===step)});
    progress.forEach(function(p,i){p.classList.toggle('active',i<step)});
    label.textContent='Step '+step+' of '+total;
    back.style.visibility=step===1?'hidden':'visible';
    next.textContent=step===total?'Submit My Request →':'Continue →';
  }
  function validateContact(){
    var ids=['firstName','lastName','phone','email','projectZip'];
    for(var i=0;i<ids.length;i++){
      var el=document.getElementById(ids[i]);
      if(!el.value.trim()){el.focus();return false;}
    }
    var zip=document.getElementById('projectZip');
    if(!/^\\d{5}$/.test(zip.value.trim())){zip.focus();return false;}
    return true;
  }
  function advance(){
    if(step===1){
      if(!state.projectType){return;}
      step=2;render();return;
    }
    if(step===2){
      if(!state.timeline){return;}
      step=3;render();return;
    }
    if(step===3){
      var request=document.getElementById('projectRequest');
      if(!request.value.trim()){request.focus();return;}
      step=4;render();return;
    }
    if(!validateContact()){return;}
    var request=document.getElementById('projectRequest');
    var zip=document.getElementById('projectZip');
    var subject='KCN Construction Estimate Request';
    var body=[
      'Name: '+document.getElementById('firstName').value+' '+document.getElementById('lastName').value,
      'Phone: '+document.getElementById('phone').value,
      'Email: '+document.getElementById('email').value,
      'Project ZIP: '+zip.value,
      'Project type: '+(state.projectType||''),
      'Timeline: '+(state.timeline||''),
      'Project details: '+request.value,
      'SMS consent: '+(document.getElementById('sms').checked?'YES':'NO')
    ].join('\\n');
    window.location.href='mailto:info@kcnconstructiondmv.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  }
  document.querySelectorAll('.options').forEach(function(group){
    group.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click',function(){
        group.querySelectorAll('button').forEach(function(b){b.classList.remove('selected')});
        btn.classList.add('selected');
        state[group.getAttribute('data-field')]=btn.textContent.trim();
        if(step===1 || step===2){step++;render();}
      });
    });
  });
  back.addEventListener('click',function(){if(step>1){step--;render()}});
  next.addEventListener('click',advance);
  render();
})();
</script>`;

const scriptPattern = /<script>\s*\(function\(\)\{[\s\S]*?\}\)\(\);\s*<\/script>/;
if (!scriptPattern.test(html)) {
  throw new Error('Could not find survey script block to replace.');
}
html = html.replace(scriptPattern, surveyScript);

fs.writeFileSync(target, html);
console.log('Standard 4-step estimate request survey applied to '+target+'.');
