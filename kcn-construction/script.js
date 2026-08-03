const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
document.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();
const form = document.getElementById('quote-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = `Estimate request: ${data.get('service')} in ${data.get('location')}`;
  const body = [
    `Name: ${data.get('firstName')} ${data.get('lastName')}`,
    `Phone: ${data.get('phone')}`,
    `Email: ${data.get('email')}`,
    `Project type: ${data.get('service')}`,
    `Location: ${data.get('location')}`,
    '',
    'Project details:',
    data.get('details')
  ].join('\n');
  document.querySelector('.form-success').textContent = 'Your email app is opening with the request ready to send.';
  window.location.href = `mailto:info@kcnconstructiondmv.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
