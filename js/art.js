/* ===== Original, animated illustrations for each service category (inline SVG, no downloads needed) =====
   To use your own real photos instead: put files named cl.jpg, pl.jpg, el.jpg, ac.jpg, ap.jpg, pa.jpg, pe.jpg
   in an /images folder and set USE_PHOTOS = true. The illustration stays as the fallback. */

const USE_PHOTOS = false;

const SCENES = {
  all: `
    <g class="float"><rect x="46" y="26" width="32" height="32" rx="9" class="s-a"/><rect x="84" y="26" width="32" height="32" rx="9" class="s-b"/>
    <rect x="46" y="64" width="32" height="32" rx="9" class="s-b"/><rect x="84" y="64" width="32" height="32" rx="9" class="s-a"/></g>
    <path class="spark sp1" d="M132 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>`,

  cl: `
    <circle class="bubble b1" cx="36" cy="96" r="6"/><circle class="bubble b2" cx="50" cy="104" r="4"/><circle class="bubble b3" cx="28" cy="84" r="3"/>
    <ellipse cx="80" cy="108" rx="30" ry="5" class="s-shadow"/>
    <g class="sway">
      <rect x="62" y="52" width="34" height="52" rx="9" class="s-a"/>
      <rect x="72" y="40" width="14" height="14" class="s-b"/>
      <path d="M66 31h24a4 4 0 0 1 4 4v7H62v-7a4 4 0 0 1 4-4z" class="s-b"/>
      <rect x="94" y="33" width="14" height="6" rx="3" class="s-b"/>
      <rect x="68" y="66" width="22" height="22" rx="5" class="s-c" opacity=".9"/>
      <path d="M74 78l4 4 8-9" class="s-check2"/>
    </g>
    <g class="mist"><circle cx="116" cy="36" r="3"/><circle cx="124" cy="30" r="2.5"/><circle cx="125" cy="43" r="2"/></g>
    <path class="spark sp1" d="M128 70l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"/>
    <path class="spark sp2" d="M30 38l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
    <path class="spark sp3" d="M120 98l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/>`,

  pl: `
    <ellipse class="ripple" cx="118" cy="104" rx="14" ry="3.5"/>
    <path d="M26 92h46a14 14 0 0 0 14-14V50" class="s-pipe"/>
    <rect x="18" y="83" width="10" height="18" rx="3" class="s-b"/>
    <path d="M86 50V34a8 8 0 0 1 8-8h24" class="s-pipe2"/>
    <rect x="114" y="22" width="12" height="9" rx="2" class="s-b"/>
    <path class="drop" d="M120 36c-3.5 5-5.5 7.5-5.5 10a5.5 5.5 0 0 0 11 0c0-2.5-2-5-5.5-10z"/>
    <g class="wiggle"><g transform="translate(22 30) rotate(-32)"><rect x="0" y="9" width="56" height="9" rx="4.5" class="s-b"/>
      <circle cx="4" cy="13.5" r="10" class="s-b"/><rect x="-8" y="10" width="12" height="7" class="s-bg"/></g></g>
    <path class="spark sp2" d="M60 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>`,

  el: `
    <circle class="glow" cx="80" cy="52" r="36"/>
    <g class="rays"><path d="M80 6v9M40 22l6 6M120 22l-6 6M24 54h9M127 54h9"/></g>
    <path d="M80 26a27 27 0 0 0-14 50v8h28v-8a27 27 0 0 0-14-50z" class="bulb"/>
    <path d="M83 36 72 58h10l-3 15 14-22H83z" class="s-bolt"/>
    <rect x="66" y="84" width="28" height="7" rx="3.5" class="s-b"/><rect x="68" y="93" width="24" height="7" rx="3.5" class="s-a"/><rect x="73" y="102" width="14" height="6" rx="3" class="s-b"/>
    <path class="spark sp1" d="M126 84l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path class="spark sp3" d="M30 80l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>`,

  ac: `
    <rect x="20" y="22" width="120" height="44" rx="12" class="s-body"/>
    <rect x="28" y="30" width="38" height="6" rx="3" class="s-bg2"/>
    <circle class="led" cx="124" cy="34" r="3.5"/>
    <rect x="28" y="52" width="104" height="8" rx="4" class="s-a"/>
    <g class="air"><path d="M42 72c8 6 8 12 0 18s-8 12 0 18"/><path d="M80 72c8 6 8 12 0 18s-8 12 0 18"/><path d="M118 72c8 6 8 12 0 18s-8 12 0 18"/></g>
    <g class="flake f1"><path d="M0-5V5M-4.3-2.5 4.3 2.5M-4.3 2.5 4.3-2.5"/></g>
    <g class="flake f2"><path d="M0-5V5M-4.3-2.5 4.3 2.5M-4.3 2.5 4.3-2.5"/></g>
    <g class="flake f3"><path d="M0-5V5M-4.3-2.5 4.3 2.5M-4.3 2.5 4.3-2.5"/></g>`,

  ap: `
    <ellipse cx="80" cy="112" rx="38" ry="4.5" class="s-shadow"/>
    <rect x="42" y="12" width="76" height="98" rx="11" class="s-body"/>
    <path d="M42 23a11 11 0 0 1 11-11h54a11 11 0 0 1 11 11v14H42z" class="s-bg2"/>
    <circle cx="56" cy="25" r="4.5" class="s-a"/><circle cx="69" cy="25" r="4.5" class="s-b"/><rect x="88" y="21" width="22" height="8" rx="4" class="s-c"/>
    <circle cx="80" cy="73" r="28" class="s-ring"/>
    <clipPath id="drumclip"><circle cx="80" cy="73" r="21"/></clipPath>
    <circle cx="80" cy="73" r="21" class="s-water"/>
    <g clip-path="url(#drumclip)"><g class="drum"><circle cx="70" cy="66" r="8" class="s-a"/><circle cx="90" cy="72" r="9" class="s-b"/><circle cx="78" cy="87" r="7" class="s-a"/><circle cx="92" cy="58" r="5" class="s-c"/></g></g>
    <path class="spark sp2" d="M134 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>`,

  pa: `
    <rect x="18" y="20" width="124" height="76" rx="9" class="s-wall"/>
    <rect class="strip" x="18" y="20" width="124" height="76" rx="9"/>
    <g class="roll"><rect x="32" y="30" width="54" height="15" rx="6" class="s-b"/>
      <path d="M86 37.5h14v15H64v9" class="s-line2"/><rect x="59" y="61" width="9" height="24" rx="3.5" class="s-a"/></g>
    <path d="M106 112l3-14h28l3 14z" class="s-a"/><rect x="104" y="95" width="36" height="6" rx="3" class="s-b"/>
    <path class="spark sp3" d="M24 106l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/>`,

  pe: `
    <path d="M80 12 40 27v28c0 26 17 42 40 51 23-9 40-25 40-51V27z" class="s-a shield"/>
    <path d="M80 22 50 33v22c0 20 12 33 30 40 18-7 30-20 30-40V33z" class="s-b" opacity=".35"/>
    <path d="M63 62l13 13 24-26" class="s-check3"/>
    <g class="bug"><ellipse cx="138" cy="94" rx="9" ry="7" class="s-bugbody"/><circle cx="147" cy="94" r="4.5" class="s-bugbody"/>
      <path d="M130 90l-6-4M130 98l-6 4M136 87l-3-6M136 101l-3 6" class="s-leg"/><path d="M150 90l5-5M150 98l5 5" class="s-leg"/>
      <circle cx="135" cy="92" r="1.8" class="s-c"/><circle cx="141" cy="96" r="1.8" class="s-c"/></g>
    <path class="spark sp1" d="M26 86l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>`,
};

// Returns an illustration card (SVG scene, optionally layered with a real photo)
function art(id, cls = '') {
  const c = cat(id), hue = c ? c[3] : 210;
  const photo = USE_PHOTOS && id !== 'all' ? `<img class="photo" src="images/${id}.jpg" alt="" loading="lazy" onerror="this.remove()">` : '';
  return `<span class="art ${cls}" style="--h:${hue}"><svg class="scene" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="160" height="120" class="s-bg"/><circle cx="136" cy="14" r="46" class="s-blob"/><circle cx="12" cy="112" r="34" class="s-blob"/>${SCENES[id] || SCENES.all}</svg>${photo}</span>`;
}
