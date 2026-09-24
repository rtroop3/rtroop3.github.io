/* =========================================================
   TroopTechSolutions Pro — site behavior
   ========================================================= */

// ---- Business contact details ----------------------------
// Fill these in and they will show up in the Contact section.
// The contact form sends requests to `email`; leave any field
// blank ('') to hide it from the page.
const CONTACT = {
  email: '',        // e.g. 'service@yourdomain.com'
  phone: '',        // e.g. '(555) 123-4567'
  serviceArea: '',  // e.g. 'Serving Springfield & surrounding areas'
  hours: '',        // e.g. 'Mon–Sat, 9am–7pm'
};

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Sticky header shadow
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const setNav = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setNav(false)));

  // Service filters
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.service-card');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('active', active);
        c.setAttribute('aria-selected', String(active));
      });
      cards.forEach((card) => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.cat !== filter && card.dataset.cat !== 'always');
      });
    });
  });

  // Package / referral buttons pre-select the form dropdown
  const select = document.getElementById('service-select');
  const pick = (text) => {
    const opt = [...select.options].find((o) => o.text.startsWith(text));
    if (opt) select.value = opt.value;
  };
  document.querySelectorAll('[data-package]').forEach((btn) => {
    btn.addEventListener('click', () => pick(btn.dataset.package + ' Package'));
  });
  document.querySelector('.referral .btn').addEventListener('click', () => pick('Referral'));

  // Contact details
  renderContactList();

  // Contact form -> opens the visitor's email app with the request filled in
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'form-status';

    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const ok = field.value.trim() !== '' && (field.type !== 'email' || /\S+@\S+\.\S+/.test(field.value));
      field.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      status.textContent = 'Please fill in your name, a valid email, and a short message.';
      status.classList.add('err');
      return;
    }

    if (!CONTACT.email) {
      status.textContent = 'Online requests are coming soon. Please check back shortly!';
      status.classList.add('err');
      return;
    }

    const d = Object.fromEntries(new FormData(form).entries());
    const subject = `Service Request: ${d.service || 'General inquiry'} — ${d.name}`;
    const body = [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || '-'}`,
      `Interested in: ${d.service || '-'}`,
      `Customer type: ${d.customer}`,
      '',
      d.message,
    ].join('\n');

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app — just hit send and we\'ll be in touch!';
    status.classList.add('ok');
  });

  // Reveal-on-scroll
  const revealables = document.querySelectorAll('.service-card, .package, .price-tile, .who-card, .steps li, .referral, .faq details');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealables.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  }
});

function renderContactList() {
  const list = document.getElementById('contact-list');
  const icons = {
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    area: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    visit: '<svg viewBox="0 0 24 24"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>',
    hours: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const items = [];
  if (CONTACT.phone) {
    items.push(`<li><span class="ci">${icons.phone}</span><div><small>Call or text</small><a href="tel:${esc(CONTACT.phone.replace(/[^\d+]/g, ''))}">${esc(CONTACT.phone)}</a></div></li>`);
  }
  if (CONTACT.email) {
    items.push(`<li><span class="ci">${icons.email}</span><div><small>Email</small><a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></div></li>`);
  }
  if (CONTACT.serviceArea) {
    items.push(`<li><span class="ci">${icons.area}</span><div><small>Service area</small><span>${esc(CONTACT.serviceArea)}</span></div></li>`);
  }
  if (CONTACT.hours) {
    items.push(`<li><span class="ci">${icons.hours}</span><div><small>Availability</small><span>${esc(CONTACT.hours)}</span></div></li>`);
  }
  items.push(`<li><span class="ci">${icons.visit}</span><div><small>Visits</small><span>In-home, on-site &amp; remote support</span></div></li>`);
  list.innerHTML = items.join('');
}
