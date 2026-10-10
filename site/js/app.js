/* ===== Render loop ===== */

const PROVIDER_VIEWS = ['req', 'jobs', 'earn', 'avail'];
const ADMIN_VIEWS = ['dash', 'prov', 'book', 'svc', 'set'];
const TITLES = { shop: 'Home services at your door', cart: 'Your cart', bookings: 'My bookings', login: 'Log in', signup: 'Sign up', forgot: 'Reset password', preg: 'Become a provider' };

function draw() {
  // Signed out but holding a staff role (e.g. after a data reset): fall back to customer
  if (S.role !== 'customer' && !S.user) { S.role = 'customer'; S.view = 'shop'; }
  // Provider account whose record no longer exists
  if (S.role === 'provider' && !pv(S.pid)) { S.user = null; S.role = 'customer'; S.view = 'login'; }
  if (S.role === 'provider' && !PROVIDER_VIEWS.includes(S.view) && !AUTH_VIEWS.includes(S.view)) S.view = 'req';
  if (S.role === 'admin' && !ADMIN_VIEWS.includes(S.view) && !AUTH_VIEWS.includes(S.view)) S.view = 'dash';

  // Logged-in users have no reason to be on the login/signup pages (e.g. after pressing Back)
  if (S.user && AUTH_VIEWS.includes(S.view)) { S.view = S.role === 'customer' ? 'shop' : S.role === 'provider' ? 'req' : 'dash'; replaceView(S.view); }
  const isAuth = AUTH_VIEWS.includes(S.view);
  document.body.classList.toggle('auth-screen', isAuth);
  nav();

  let html;
  if (isAuth) html = auth();
  else if (S.view.startsWith('page:')) html = infoPage(S.view.slice(5));
  else if (S.role === 'customer') html = ({ shop, cart, bookings }[S.view] || shop)();
  else if (S.role === 'provider') html = provider();
  else html = admin();

  document.getElementById('app').innerHTML = html;
  document.title = 'HomeServe – ' + (TITLES[S.view] || 'Home services');
  enhance();
  centerCat();
}

// Enter key submits auth forms
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('.auth-panel input:not([type=checkbox])')) {
    const b = document.querySelector('.auth-primary');
    if (b) b.click();
  }
});


/* ---------- motion: fade-in on page change, reveal on scroll, count-up numbers ---------- */
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastKey = '';
const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    io.unobserve(el);
    if (el.classList.contains('count')) return countUp(el);
    el.classList.add('in');
    setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.removeProperty('--d'); }, 900);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;

function countUp(el) {
  const to = +el.dataset.to, dec = +el.dataset.dec || 0, t0 = performance.now(), dur = 1200;
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), v = to * (1 - Math.pow(1 - k, 3));
    el.textContent = v.toFixed(dec);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function enhance() {
  const app = document.getElementById('app'), key = S.view + '|' + S.cat, changed = key !== lastKey;
  lastKey = key;
  if (!changed || REDUCED || !io) return;          // redraws on the same page (add to cart, etc.) stay still
  app.classList.remove('view-enter'); void app.offsetWidth; app.classList.add('view-enter');
  app.querySelectorAll('.catc,.svc,.offer,.how>div,.why>div,.review,details,.stat,.booking,.req,.stats-strip,.appbar,.cart-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--d', (i % 6) * 0.06 + 's');
    io.observe(el);
  });
  app.querySelectorAll('.count').forEach(el => { el.textContent = (0).toFixed(+el.dataset.dec || 0); io.observe(el); });
}

// On phones the category row scrolls sideways: keep the selected category in view
function centerCat() {
  const row = document.querySelector('.catrow'), on = row && row.querySelector('.catc.on');
  if (!on) return;
  const r = row.getBoundingClientRect(), o = on.getBoundingClientRect();
  row.scrollLeft += (o.left + o.width / 2) - (r.left + r.width / 2);
}

replaceView(S.view);
draw();
