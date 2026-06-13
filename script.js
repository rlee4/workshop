/* ===== DARK MODE ===== */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===== SCROLL FADE-IN ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

function validate() {
  let ok = true;
  const fields = [
    { id: 'name',    errorId: 'nameError',    msg: '請輸入姓名' },
    { id: 'email',   errorId: 'emailError',   msg: '請輸入有效的電子郵件', type: 'email' },
    { id: 'message', errorId: 'messageError', msg: '請輸入需求說明' },
  ];

  fields.forEach(({ id, errorId, msg, type }) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    input.classList.remove('error');
    error.textContent = '';

    const val = input.value.trim();
    if (!val) {
      input.classList.add('error');
      error.textContent = msg;
      ok = false;
    } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      input.classList.add('error');
      error.textContent = '請輸入有效的電子郵件格式';
      ok = false;
    }
  });
  return ok;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate()) return;

  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;

  await new Promise(r => setTimeout(r, 800));

  btnText.hidden = false;
  btnLoading.hidden = true;
  submitBtn.disabled = false;

  form.reset();
  document.getElementById('formSuccess').hidden = false;
  setTimeout(() => { document.getElementById('formSuccess').hidden = true; }, 6000);
});

/* ===== SMOOTH ANCHOR OFFSET ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
