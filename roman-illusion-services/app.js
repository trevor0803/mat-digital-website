const state={project:'',scope:'',timeline:''};
const reviewMode=new URLSearchParams(window.location.search).get('a2p')==='review';
let step=reviewMode?4:1;
if(reviewMode){state.project='Estimate request';state.scope='Not specified';state.timeline='Not specified'}
const total=4;
const screens=[...document.querySelectorAll('.screen')];
const progress=[...document.querySelectorAll('#progress span')];
const label=document.getElementById('stepLabel');
const back=document.getElementById('backBtn');
const next=document.getElementById('nextBtn');

if(!document.querySelector('link[href="/a2p.css"]')){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='/a2p.css';
  document.head.appendChild(link);
}

const sms=document.getElementById('sms');
const consentSpan=document.querySelector('.consent span');
if(sms){
  sms.checked=false;
  sms.required=false;
  sms.setAttribute('aria-label','Optional SMS consent');
}
if(consentSpan){
  consentSpan.innerHTML='<strong>Optional SMS consent:</strong> By checking this box, I agree to receive recurring automated and manual SMS messages from Roman Illusion, Inc. about my estimate request, scheduling, and project-related follow-up at the mobile number provided. Message frequency varies. Message &amp; data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of purchase. See our <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener">Terms &amp; Conditions</a>.';
}

const footer=document.querySelector('footer');
if(footer&&!footer.querySelector('.footer-legal')){
  const legal=document.createElement('div');
  legal.className='footer-legal';
  legal.innerHTML='<a href="/privacy">Privacy Policy</a><span>·</span><a href="/terms">Terms &amp; Conditions</a><span>·</span><span>SMS: Reply STOP to opt out · HELP for help</span>';
  footer.appendChild(legal);
}

document.querySelectorAll('.options').forEach(group=>{
  group.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      group.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
      btn.classList.add('selected');
      state[group.dataset.field]=btn.dataset.value;
      if(step<4)setTimeout(()=>{step++;render()},120);
    });
  });
});

document.getElementById('zip').addEventListener('input',e=>{
  e.target.value=e.target.value.replace(/\D/g,'').slice(0,5);
});

function render(){
  screens.forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===step));
  progress.forEach((p,i)=>p.classList.toggle('active',i<step));
  label.textContent=reviewMode&&step===4?'SMS Opt-In Form · Step 4 of 4':'Step '+step+' of '+total;
  back.style.visibility=(step===1||reviewMode)?'hidden':'visible';
  next.textContent=step===4?'Get My Free Estimate →':'Continue →';
}

function v(id){return document.getElementById(id).value.trim()}

function valid(){
  if(step===1&&!state.project)return false;
  if(step===2&&!state.scope)return false;
  if(step===3&&!state.timeline)return false;
  if(step===4){
    for(const id of ['firstName','lastName','phone','email','zip']){
      if(!v(id)){document.getElementById(id).focus();return false}
    }
    if(!v('email').includes('@')){document.getElementById('email').focus();return false}
    if(!/^\d{5}$/.test(v('zip'))){document.getElementById('zip').focus();return false}
  }
  return true;
}

back.addEventListener('click',()=>{if(step>1&&!reviewMode){step--;render()}});

next.addEventListener('click',()=>{
  if(!valid())return;
  if(step<4){step++;render();return}

  const optedIn=Boolean(sms&&sms.checked);
  const consentTimestamp=optedIn?new Date().toISOString():'';
  const data={
    ...state,
    firstName:v('firstName'),
    lastName:v('lastName'),
    phone:v('phone'),
    email:v('email'),
    zip:v('zip'),
    comments:v('comments'),
    sms_consent:optedIn,
    sms_consent_timestamp:consentTimestamp,
    sms_consent_page:window.location.origin+window.location.pathname+window.location.search,
    sms_disclosure_version:'2026-08-07',
    source:reviewMode?'Roman Illusion A2P Review Opt-In':'Roman Illusion Painting Ad Lander'
  };

  try{localStorage.setItem('roman_illusion_latest_lead',JSON.stringify(data))}catch(e){}

  const body=[
    `Name: ${data.firstName} ${data.lastName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `ZIP: ${data.zip}`,
    `Service: ${data.project}`,
    `Project size: ${data.scope}`,
    `Timeline: ${data.timeline}`,
    `Comments: ${data.comments||'None'}`,
    `SMS consent: ${data.sms_consent?'YES':'NO'}`,
    `SMS consent timestamp: ${data.sms_consent_timestamp||'Not opted in'}`,
    `Opt-in page: ${data.sms_consent_page}`,
    `Disclosure version: ${data.sms_disclosure_version}`
  ].join('\n');

  const emailBtn=document.getElementById('emailBtn');
  emailBtn.href='mailto:romanillusionpro@gmail.com?subject='+encodeURIComponent('Free Painting Estimate - '+data.firstName+' '+data.lastName)+'&body='+encodeURIComponent(body);
  document.getElementById('formArea').style.display='none';
  document.getElementById('success').classList.add('show');
  const successText=document.querySelector('#success p');
  if(successText){
    successText.textContent=optedIn?'Thanks. Roman Illusion may call, email, or text you about this estimate request.':'Thanks. Roman Illusion may call or email you about this estimate request. You did not opt in to SMS.';
  }
});

document.querySelectorAll('img').forEach(img=>{
  if(img.src.includes('04bf13a6-133d-4ca2-8a8d-fe9d33112170.png')){
    img.src='https://d2ol7oe51mr4n9.cloudfront.net/user_3Fbj8PlPgeB9T1MRKCf8bLjR8eC/04bf13a6-133d-4ca2-8a8d-fe9d33112170.png';
  }
});

render();
