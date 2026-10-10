/* ===== Extra features: HomeCoins rewards, saved services, safety PIN, book again, invoice, dark mode ===== */

const coinBalance = () => (S.user && S.coins[S.user.email]) || 0;

/* ---- Saved services (heart) ---- */
function fav(id) {
  const i = S.favs.indexOf(id);
  i < 0 ? S.favs.push(id) : S.favs.splice(i, 1);
  toast(i < 0 ? 'Saved to your list' : 'Removed from saved');
  save(); draw();
}
function savedBlock() {
  const L = SV.filter(s => S.favs.includes(s[0]) && !S.svHide.includes(s[0]));
  if (!L.length) return '';
  return `<section class="saved-sec"><h2 class="h2">${ic('heart', 18)} Saved for you</h2><div class="saved">${L.map(s => svcCard(s, cat(s[1]))).join('')}</div></section>`;
}

/* ---- HomeCoins (earn 5% back on completed jobs, use up to 20% of a bill) ---- */
function coinBox() {
  if (!S.user || S.user.role !== 'customer') return `<div class="coinbox"><span class="coin-ic">${ic('wallet', 16)}</span><span>Log in to earn <b>HomeCoins</b>: 5% back on every completed service.</span></div>`;
  const bal = coinBalance();
  return `<label class="coinbox"><span class="coin-ic">${ic('wallet', 16)}</span><span><b>${bal} HomeCoins</b> <small>(1 coin = ₹1, use up to 20% of the bill)</small></span>
    <input type="checkbox" ${CK.useCoins ? 'checked' : ''} ${bal ? '' : 'disabled'} onchange="CK.useCoins=this.checked;draw()"></label>`;
}

/* ---- Safety PIN: provider must enter the customer's PIN to start ---- */
function startWithPin(id) {
  const b = S.bookings.find(x => x.id === id), v = (document.getElementById('pin_' + id)?.value || '').trim();
  if (!/^\d{4}$/.test(v)) return toast('Enter the 4-digit PIN shown to the customer');
  if (v !== b.pin) return toast('Wrong PIN. Ask the customer for the PIN in their app');
  pstep(id, 'STARTED');
}

/* ---- Book again ---- */
function rebook(id) {
  const b = S.bookings.find(x => x.id === id);
  (b.items || [{ sid: b.sid, pk: b.pk, q: 1 }]).forEach(i => {
    const x = S.cart.find(c => c.sid === i.sid && c.pk === i.pk);
    x ? x.q += i.q : S.cart.push({ sid: i.sid, pk: i.pk, q: i.q });
  });
  toast('Added to cart. Pick a new date and time');
  save(); go('cart');
}

/* ---- Invoice (downloads as an HTML file you can print or save as PDF) ---- */
function invoice(id) {
  const b = S.bookings.find(x => x.id === id), p = pv(b.pid), base = b.base ?? b.amt / 1.18;
  const rows = (b.items || [{ sid: b.sid, pk: b.pk, q: 1 }]).map(i => `<tr><td>${esc(sv(i.sid)[2])} (${PK[i.pk][0]})</td><td>${i.q}</td><td style="text-align:right">${inr(sv(i.sid)[3] * PK[i.pk][1] * i.q)}</td></tr>`).join('');
  const html = `<!doctype html><meta charset="utf-8"><title>Invoice ${b.id}</title><body style="font:15px system-ui;max-width:640px;margin:30px auto;padding:0 16px;color:#0f1c2e">
  <h1 style="color:#0b6bcb;margin:0">HomeServe</h1><p style="color:#5d6b7c;margin:4px 0 24px">Tax invoice · Vijayawada</p>
  <p><b>Invoice for booking ${b.id}</b><br>Customer: ${esc(b.cust)}<br>Service date: ${fmtDate(b.date)}, ${fmtSlot(b.slot)}<br>Address: ${esc(b.house)}, ${esc(b.area)}<br>Professional: ${p ? esc(p.name) : '-'}</p>
  <table style="width:100%;border-collapse:collapse" cellpadding="8"><tr style="background:#eef6ff;text-align:left"><th>Service</th><th>Qty</th><th style="text-align:right">Amount</th></tr>${rows}</table>
  <p style="text-align:right">Taxable value (after discounts and fee): ${inr(base)}<br>GST 18%: ${inr(b.amt - base)}<br><b style="font-size:18px">Total paid: ${inr(b.amt)}</b></p>
  <p style="color:#5d6b7c;font-size:13px">Payment: ${esc(b.pay)}. Thank you for choosing HomeServe. 30-day service warranty applies.</p></body>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  a.download = 'HomeServe-invoice-' + b.id + '.html';
  document.body.appendChild(a); a.click(); a.remove();
  toast('Invoice downloaded');
}

/* ---- Dark mode ---- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  const b = document.getElementById('themebtn');
  if (b) b.innerHTML = ic(t === 'dark' ? 'sun' : 'moon', 18);
}
function toggleTheme() {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('hs_theme', t); } catch (e) { /* ignore */ }
  applyTheme(t);
}
(function () {
  let t = null;
  try { t = localStorage.getItem('hs_theme'); } catch (e) { /* ignore */ }
  if (!t) t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(t);
})();

/* ---- Admin: manage services (edit price/name/time, hide or show, add new) ---- */
(function applySvc() {
  S.svNew.forEach(n => { if (!SV.some(s => s[0] === n[0])) SV.push(n); });
  Object.entries(S.svEdit).forEach(([id, e]) => {
    const s = sv(id); if (!s) return;
    if (e.name) s[2] = e.name; if (e.price) s[3] = e.price; if (e.dur) s[4] = e.dur; if (e.desc) s[7] = e.desc;
  });
})();

function svcAdmin() {
  const hidden = id => S.svHide.includes(id);
  const row = s => `<tr class="${hidden(s[0]) ? 'dim' : ''}">
    <td><input class="ed w-name" value="${esc(s[2])}" onchange="svSet('${s[0]}','name',this.value)" aria-label="Service name"></td>
    <td>₹ <input class="ed w-num" type="number" min="1" value="${s[3]}" onchange="svSet('${s[0]}','price',this.value)" aria-label="Base price"></td>
    <td><input class="ed w-num" type="number" min="10" step="5" value="${s[4]}" onchange="svSet('${s[0]}','dur',this.value)" aria-label="Duration in minutes"> min</td>
    <td>${badge(hidden(s[0]) ? 'Hidden' : 'Live', hidden(s[0]) ? 'bad' : 'ok')}</td>
    <td class="acts"><button class="btn alt sm" onclick="svToggle('${s[0]}')">${hidden(s[0]) ? 'Show' : 'Hide'}</button></td></tr>`;
  return `<h1 class="h1">Services &amp; prices</h1>
    <div class="card notice">Change a name, price or duration and it updates for customers straight away. New prices apply to new bookings only. Bookings already made keep their old price. "Hide" removes a service from the website without deleting its history.</div>
    ${CATS.map(c => `<h2 class="h2">${c[1]}</h2><div class="card tbl"><table><thead><tr><th>Service</th><th>Base price</th><th>Duration</th><th>Status</th><th></th></tr></thead><tbody>${SV.filter(s => s[1] === c[0]).map(row).join('')}</tbody></table></div>`).join('')}
    <h2 class="h2">Add a new service</h2><div class="card checkout">
      <div class="fgroup"><label class="lbl" for="ns-n">Service name</label><input id="ns-n" placeholder="e.g. Kitchen Chimney Cleaning"></div>
      <div class="fgroup"><label class="lbl" for="ns-c">Category</label><select id="ns-c">${CATS.map(c => `<option value="${c[0]}">${c[1]}</option>`).join('')}</select></div>
      <div class="fgroup"><label class="lbl" for="ns-p">Base price (₹)</label><input id="ns-p" type="number" min="1" placeholder="599"></div>
      <div class="fgroup"><label class="lbl" for="ns-d">Duration (minutes)</label><input id="ns-d" type="number" min="10" step="5" placeholder="60"></div>
      <div class="fgroup"><label class="lbl" for="ns-t">Short description</label><input id="ns-t" placeholder="What is included"></div>
      <button class="btn" onclick="svAdd()">Add service</button></div>`;
}
function svSet(id, k, v) {
  const e = S.svEdit[id] = S.svEdit[id] || {}, s = sv(id);
  if (k === 'name') { v = v.trim(); if (v.length < 3) { toast('Service name is too short'); return draw(); } s[2] = e.name = v; }
  else { v = Math.round(+v); if (!(v > 0)) { toast('Enter a number greater than 0'); return draw(); } k === 'price' ? (s[3] = e.price = v) : (s[4] = e.dur = v); }
  note('admin', `Updated ${s[2]}`); toast(s[2] + ' updated'); save();
}
function svToggle(id) {
  const i = S.svHide.indexOf(id); i < 0 ? S.svHide.push(id) : S.svHide.splice(i, 1);
  toast(sv(id)[2] + (i < 0 ? ' hidden from customers' : ' is live again')); save(); draw();
}
function svAdd() {
  const n = $v('ns-n'), c = document.getElementById('ns-c').value, p = Math.round(+$v('ns-p')), d = Math.round(+$v('ns-d')), t = $v('ns-t');
  if (n.length < 3) return toast('Enter the service name');
  if (!(p > 0)) return toast('Enter a base price greater than 0');
  if (!(d >= 10)) return toast('Enter the duration in minutes (10 or more)');
  const s = ['x' + Date.now().toString(36), c, n, p, d, 4.5, 0, t || 'Service by verified professionals'];
  S.svNew.push(s); SV.push(s); toast(n + ' added'); save(); draw();
}
