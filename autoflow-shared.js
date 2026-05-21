/* Autoflow shared chrome — footer, Cmd+K palette, mobile nav, onboarding.
   Injects into any page that includes this script. Idempotent. */
(function () {
  if (window.__autoflowSharedLoaded) return;
  window.__autoflowSharedLoaded = true;

  // ---------------------------------------------------------------- styles ---
  const css = `
    /* Expanded footer */
    .af-footer {
      border-top: 0.5px solid var(--color-border-tertiary);
      background: var(--color-background-primary);
      margin-top: 2rem;
    }
    .af-footer-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;
      gap: 2.5rem;
      padding: 3rem 2.25rem 2rem;
    }
    .af-footer-brand .af-footer-logo {
      font-family: var(--serif); font-size: 26px; letter-spacing: -0.5px;
      color: var(--color-text-primary); margin-bottom: 0.75rem;
    }
    .af-footer-brand .af-footer-logo span { color: var(--accent); font-style: italic; }
    .af-footer-tag {
      font-size: 13px; color: var(--color-text-secondary);
      line-height: 1.5; max-width: 280px; margin-bottom: 1.25rem;
    }
    .af-newsletter {
      display: flex; gap: 0;
      max-width: 280px;
      border: 0.5px solid var(--color-border-secondary);
      border-radius: 999px;
      padding: 3px 3px 3px 14px;
      background: var(--color-background-primary);
      transition: border-color 0.15s;
    }
    .af-newsletter:focus-within { border-color: var(--accent); }
    .af-newsletter input {
      flex: 1; border: none; outline: none;
      background: transparent; color: var(--color-text-primary);
      font-family: var(--sans); font-size: 12.5px;
    }
    .af-newsletter input::placeholder { color: var(--color-text-tertiary); }
    .af-newsletter button {
      border: none; cursor: pointer;
      background: var(--ink); color: var(--on-ink);
      font-family: var(--sans); font-size: 12px; font-weight: 500;
      padding: 7px 14px; border-radius: 999px;
      display: inline-flex; align-items: center; gap: 4px;
      transition: filter 0.15s;
    }
    .af-newsletter button:hover { filter: brightness(1.15); }
    .af-newsletter.sent { border-color: #16a34a; }
    .af-newsletter.sent input { color: var(--color-text-secondary); }
    .af-footer-col-title {
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--color-text-tertiary);
      margin-bottom: 0.85rem;
    }
    .af-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .af-footer-col a {
      font-size: 13px; color: var(--color-text-secondary);
      text-decoration: none; transition: color 0.12s;
    }
    .af-footer-col a:hover { color: var(--color-text-primary); }
    .af-footer-bottom {
      padding: 1.25rem 2.25rem;
      border-top: 0.5px solid var(--color-border-tertiary);
      display: flex; justify-content: space-between; align-items: center;
      gap: 1rem; flex-wrap: wrap;
      font-size: 11px; color: var(--color-text-tertiary);
    }
    .af-socials { display: flex; gap: 6px; }
    .af-socials a {
      width: 32px; height: 32px; border-radius: 50%;
      border: 0.5px solid var(--color-border-secondary);
      background: var(--color-background-primary);
      color: var(--color-text-secondary);
      display: inline-flex; align-items: center; justify-content: center;
      transition: all 0.12s;
      text-decoration: none;
    }
    .af-socials a:hover { color: var(--color-text-primary); border-color: var(--color-border-primary); }
    .af-status { display: inline-flex; align-items: center; gap: 6px; }
    .af-status-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #16a34a;
      box-shadow: 0 0 0 0 #16a34a; animation: af-pulse 2s infinite;
    }
    @keyframes af-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
      70%  { box-shadow: 0 0 0 5px rgba(22, 163, 74, 0); }
      100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
    }

    /* Mobile hamburger */
    .af-hamburger {
      display: none;
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 0.5px solid var(--color-border-secondary);
      background: var(--color-background-primary);
      color: var(--color-text-primary);
      cursor: pointer;
      align-items: center; justify-content: center;
      font-size: 18px;
    }
    .af-mobile-menu {
      display: none;
      position: fixed; inset: 0;
      background: var(--color-background-primary);
      z-index: 200;
      padding: 1.5rem 1.25rem;
      flex-direction: column;
    }
    .af-mobile-menu.open { display: flex; }
    .af-mobile-head {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 1.5rem;
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }
    .af-mobile-close {
      width: 36px; height: 36px; border-radius: 50%;
      border: 0.5px solid var(--color-border-secondary);
      background: transparent; color: var(--color-text-primary);
      cursor: pointer; font-size: 18px;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .af-mobile-menu nav {
      display: flex; flex-direction: column;
      padding: 1.5rem 0;
      gap: 0;
    }
    .af-mobile-menu nav a {
      font-family: var(--serif);
      font-size: 28px; letter-spacing: -0.6px;
      color: var(--color-text-primary);
      text-decoration: none;
      padding: 14px 0;
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }
    .af-mobile-menu nav a:last-child { border-bottom: none; }
    .af-mobile-actions {
      margin-top: auto;
      display: flex; gap: 10px;
      padding-top: 1rem;
    }
    .af-mobile-actions button {
      flex: 1;
      padding: 14px 0;
      border-radius: 999px;
      font-family: var(--sans); font-size: 14px; font-weight: 500;
      cursor: pointer;
      border: 0.5px solid var(--color-border-primary);
      background: transparent; color: var(--color-text-primary);
    }
    .af-mobile-actions .primary {
      background: var(--ink); color: var(--on-ink);
      border-color: transparent;
    }

    @media (max-width: 720px) {
      .af-hamburger { display: inline-flex; }
      .nav .nav-links, .nav .nav-right { display: none !important; }
      .af-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem 1.25rem 1.5rem; }
      .af-footer-brand { grid-column: 1 / -1; }
      .af-footer-bottom { padding: 1.25rem; }
    }
    @media (max-width: 460px) {
      .af-footer-grid { grid-template-columns: 1fr; }
    }

    /* Cmd+K command palette */
    .af-cmdk-overlay {
      position: fixed; inset: 0;
      background: rgba(20, 18, 14, 0.45);
      backdrop-filter: blur(6px);
      z-index: 300;
      display: flex; align-items: flex-start; justify-content: center;
      padding: 8rem 1.5rem 2rem;
      opacity: 0; pointer-events: none;
      transition: opacity 0.15s ease;
    }
    [data-theme="dark"] .af-cmdk-overlay { background: rgba(0,0,0,0.6); }
    .af-cmdk-overlay.open { opacity: 1; pointer-events: auto; }
    .af-cmdk {
      width: 100%; max-width: 580px;
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-secondary);
      border-radius: 14px;
      box-shadow: 0 24px 60px rgba(20,18,14,0.18);
      overflow: hidden;
      transform: translateY(-12px);
      transition: transform 0.18s ease;
      max-height: calc(100vh - 12rem);
      display: flex; flex-direction: column;
    }
    .af-cmdk-overlay.open .af-cmdk { transform: translateY(0); }
    .af-cmdk-search {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 18px;
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }
    .af-cmdk-search i { color: var(--color-text-tertiary); font-size: 18px; }
    .af-cmdk-search input {
      flex: 1; border: none; outline: none; background: transparent;
      color: var(--color-text-primary);
      font-family: var(--sans); font-size: 15px;
    }
    .af-cmdk-search input::placeholder { color: var(--color-text-tertiary); }
    .af-cmdk-kbd {
      font-size: 10px;
      padding: 3px 7px; border-radius: 5px;
      background: var(--color-background-secondary);
      color: var(--color-text-tertiary);
      letter-spacing: 0.05em;
    }
    .af-cmdk-list {
      flex: 1; overflow-y: auto;
      padding: 8px 0;
    }
    .af-cmdk-group-title {
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--color-text-tertiary);
      padding: 10px 18px 6px;
    }
    .af-cmdk-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 18px;
      cursor: pointer;
      transition: background 0.08s;
      text-decoration: none; color: inherit;
    }
    .af-cmdk-item:hover, .af-cmdk-item.active {
      background: var(--accent-soft);
    }
    .af-cmdk-item-icon {
      width: 28px; height: 28px; border-radius: 7px;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .af-cmdk-item-icon i { font-size: 14px; }
    .af-cmdk-item-main { flex: 1; min-width: 0; }
    .af-cmdk-item-title {
      font-size: 13.5px; color: var(--color-text-primary);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .af-cmdk-item-sub {
      font-size: 11px; color: var(--color-text-tertiary);
      margin-top: 1px;
    }
    .af-cmdk-item-meta {
      font-size: 11px; color: var(--color-text-tertiary);
      flex-shrink: 0;
    }
    .af-cmdk-empty {
      padding: 2.5rem 1.5rem;
      text-align: center; color: var(--color-text-tertiary);
      font-size: 13px;
    }
    .af-cmdk-foot {
      border-top: 0.5px solid var(--color-border-tertiary);
      padding: 8px 18px;
      display: flex; justify-content: space-between;
      font-size: 11px; color: var(--color-text-tertiary);
    }
    .af-cmdk-foot kbd {
      font-family: var(--sans); font-size: 10px;
      padding: 2px 6px; border-radius: 4px;
      background: var(--color-background-secondary);
      color: var(--color-text-secondary);
      margin: 0 3px;
    }

    /* Onboarding tour */
    .af-onb-overlay {
      position: fixed; inset: 0;
      background: rgba(20, 18, 14, 0.5);
      backdrop-filter: blur(8px);
      z-index: 250;
      display: flex; align-items: center; justify-content: center;
      padding: 1.5rem;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s ease;
    }
    [data-theme="dark"] .af-onb-overlay { background: rgba(0,0,0,0.7); }
    .af-onb-overlay.open { opacity: 1; pointer-events: auto; }
    .af-onb {
      width: 100%; max-width: 460px;
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-secondary);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(20,18,14,0.2);
      transform: scale(0.96);
      transition: transform 0.2s ease;
    }
    .af-onb-overlay.open .af-onb { transform: scale(1); }
    .af-onb-head {
      padding: 2rem 2rem 1rem;
      text-align: center;
      position: relative;
    }
    .af-onb-skip {
      position: absolute; top: 12px; right: 12px;
      background: none; border: none;
      font-size: 12px; color: var(--color-text-tertiary);
      cursor: pointer; padding: 6px 10px;
    }
    .af-onb-skip:hover { color: var(--color-text-primary); }
    .af-onb-icon-circle {
      width: 64px; height: 64px;
      border-radius: 50%;
      margin: 0 auto 1rem;
      background: var(--accent-soft);
      display: flex; align-items: center; justify-content: center;
      color: var(--accent);
      font-size: 30px;
    }
    .af-onb-title {
      font-family: var(--serif); font-size: 28px;
      letter-spacing: -0.8px; line-height: 1.05;
      color: var(--color-text-primary);
      margin-bottom: 0.5rem;
      text-wrap: balance;
    }
    .af-onb-title em { font-style: italic; color: var(--accent); }
    .af-onb-sub {
      font-size: 14px; color: var(--color-text-secondary);
      line-height: 1.55; max-width: 360px; margin: 0 auto;
      text-wrap: pretty;
    }
    .af-onb-body { padding: 0 2rem 1.5rem; }
    .af-onb-options { display: flex; flex-direction: column; gap: 8px; }
    .af-onb-option {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px;
      border: 0.5px solid var(--color-border-secondary);
      border-radius: 12px;
      background: var(--color-background-primary);
      cursor: pointer; text-align: left;
      transition: all 0.12s;
      width: 100%;
      font-family: var(--sans);
      color: var(--color-text-primary);
    }
    .af-onb-option:hover { border-color: var(--color-border-primary); transform: translateY(-1px); }
    .af-onb-option.selected { border-color: var(--accent); background: var(--accent-soft); }
    .af-onb-option-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--color-background-secondary);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: var(--color-text-secondary);
    }
    .af-onb-option.selected .af-onb-option-icon { background: var(--accent); color: #fff; }
    .af-onb-option-text { flex: 1; }
    .af-onb-option-label { font-size: 13.5px; font-weight: 500; color: var(--color-text-primary); }
    .af-onb-option-desc { font-size: 11.5px; color: var(--color-text-secondary); margin-top: 1px; }
    .af-onb-foot {
      padding: 1rem 2rem 1.5rem;
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
      border-top: 0.5px solid var(--color-border-tertiary);
    }
    .af-onb-progress { display: flex; gap: 4px; }
    .af-onb-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--color-border-primary);
      transition: background 0.15s;
    }
    .af-onb-dot.active { background: var(--accent); }
    .af-onb-cta {
      font-family: var(--sans); font-size: 13px; font-weight: 500;
      padding: 11px 22px; border-radius: 999px;
      background: var(--accent); color: #fff; border: none;
      cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px;
      transition: transform 0.12s, box-shadow 0.15s;
      box-shadow: 0 2px 0 rgba(0,0,0,0.04), 0 4px 12px rgba(255,77,0,0.18);
    }
    .af-onb-cta:hover { transform: translateY(-1px); }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ----------------------------------------------------- expanded footer ---
  // Replace any existing .footer with the expanded version
  function buildFooter() {
    const oldFooter = document.querySelector('.footer');
    const wrapper = document.querySelector('.page') || document.body;

    const footer = document.createElement('footer');
    footer.className = 'af-footer';
    footer.innerHTML = `
      <div class="af-footer-grid">
        <div class="af-footer-brand">
          <div class="af-footer-logo">Auto<span>flow</span></div>
          <p class="af-footer-tag">Plug-and-play automation workflows from real operators. Buy once, install in two clicks.</p>
          <form class="af-newsletter" id="af-newsletter">
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <div class="af-footer-col">
          <div class="af-footer-col-title">Marketplace</div>
          <ul>
            <li><a href="Browse Workflows.html">Browse workflows</a></li>
            <li><a href="Creators.html">Creators</a></li>
            <li><a href="Blog.html">Blog</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Categories</a></li>
          </ul>
        </div>
        <div class="af-footer-col">
          <div class="af-footer-col-title">For creators</div>
          <ul>
            <li><a href="Autoflow Marketplace.html#become">Become a creator</a></li>
            <li><a href="#">Creator docs</a></li>
            <li><a href="#">Payout terms</a></li>
            <li><a href="#">Submission guide</a></li>
          </ul>
        </div>
        <div class="af-footer-col">
          <div class="af-footer-col-title">Company</div>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Customers</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div class="af-footer-col">
          <div class="af-footer-col-title">Resources</div>
          <ul>
            <li><a href="#">Docs</a></li>
            <li><a href="#">Help center</a></li>
            <li><a href="#">Changelog</a></li>
            <li><a href="#">API</a></li>
            <li><a href="#">Status</a></li>
          </ul>
        </div>
      </div>
      <div class="af-footer-bottom">
        <div>© 2026 Autoflow Automations · <a href="#" style="color:inherit">Terms</a> · <a href="#" style="color:inherit">Privacy</a> · <a href="#" style="color:inherit">Cookies</a></div>
        <div class="af-status"><span class="af-status-dot"></span> All systems operational</div>
        <div class="af-socials">
          <a href="#" title="Twitter"><i class="ti ti-brand-twitter"></i></a>
          <a href="#" title="GitHub"><i class="ti ti-brand-github"></i></a>
          <a href="#" title="LinkedIn"><i class="ti ti-brand-linkedin"></i></a>
          <a href="#" title="YouTube"><i class="ti ti-brand-youtube"></i></a>
        </div>
      </div>
    `;

    if (oldFooter) {
      oldFooter.replaceWith(footer);
    } else {
      wrapper.appendChild(footer);
    }

    // Newsletter form fake-submit
    const form = footer.querySelector('#af-newsletter');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.focus();
        return;
      }
      form.classList.add('sent');
      input.value = 'Thanks — check your inbox';
      input.readOnly = true;
    });
  }

  // ----------------------------------------------------- mobile nav --------
  function buildMobileNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    // Add hamburger button
    const ham = document.createElement('button');
    ham.className = 'af-hamburger';
    ham.setAttribute('aria-label', 'Menu');
    ham.innerHTML = `<i class="ti ti-menu-2"></i>`;
    nav.appendChild(ham);

    const menu = document.createElement('div');
    menu.className = 'af-mobile-menu';
    menu.innerHTML = `
      <div class="af-mobile-head">
        <div style="font-family:var(--serif);font-size:24px;letter-spacing:-0.5px">Auto<span style="color:var(--accent);font-style:italic">flow</span></div>
        <button class="af-mobile-close" aria-label="Close"><i class="ti ti-x"></i></button>
      </div>
      <nav>
        <a href="Autoflow Marketplace.html">Home</a>
        <a href="Browse Workflows.html">Browse</a>
        <a href="Creators.html">Creators</a>
        <a href="Blog.html">Blog</a>
      </nav>
      <div class="af-mobile-actions">
        <button>Sign in</button>
        <button class="primary">Get started</button>
      </div>
    `;
    document.body.appendChild(menu);

    ham.addEventListener('click', () => menu.classList.add('open'));
    menu.querySelector('.af-mobile-close').addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('nav a').forEach(a =>
      a.addEventListener('click', () => menu.classList.remove('open'))
    );
  }

  // ------------------------------------------------- Cmd+K palette ---------
  function buildCmdK() {
    // Collect searchable items from loaded data
    const items = [];
    // Pages (always present)
    items.push(
      { kind: 'page', title: 'Home',            sub: 'Autoflow marketplace landing', href: 'Autoflow Marketplace.html', icon: 'ti-home',   color: '#FF4D00' },
      { kind: 'page', title: 'Browse workflows', sub: 'Discover automations',         href: 'Browse Workflows.html',     icon: 'ti-grid-dots', color: '#0066FF' },
      { kind: 'page', title: 'Creators',        sub: 'Meet the builders',            href: 'Creators.html',             icon: 'ti-users',  color: '#7c3aed' },
      { kind: 'page', title: 'Blog',            sub: 'Stories and guides',           href: 'Blog.html',                 icon: 'ti-news',   color: '#16a34a' },
    );
    if (window.WORKFLOWS) {
      window.WORKFLOWS.forEach(w => items.push({
        kind: 'workflow', title: w.title, sub: w.cat + ' · ' + (w.price === 0 ? 'Free' : '$' + w.price),
        href: 'Workflow.html?id=' + w.id, icon: w.icon, color: w.color,
        meta: w.installs.toLocaleString() + ' installs',
      }));
    }
    if (window.CREATORS) {
      window.CREATORS.forEach(c => items.push({
        kind: 'creator', title: c.name, sub: c.role + ' · ' + c.location,
        href: 'Creator Profile.html?id=' + c.id, initials: c.id, color: c.color,
        meta: c.workflows + ' workflows',
      }));
    }

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'af-cmdk-overlay';
    overlay.innerHTML = `
      <div class="af-cmdk" role="dialog" aria-label="Search">
        <div class="af-cmdk-search">
          <i class="ti ti-search"></i>
          <input id="af-cmdk-input" type="text" placeholder="Search workflows, creators, pages…" autocomplete="off" />
          <span class="af-cmdk-kbd">ESC</span>
        </div>
        <div class="af-cmdk-list" id="af-cmdk-list"></div>
        <div class="af-cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>⌘</kbd><kbd>K</kbd> Toggle</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#af-cmdk-input');
    const list = overlay.querySelector('#af-cmdk-list');
    let activeIdx = 0;
    let filtered = [];

    function hexToRgba(hex, a) {
      const h = hex.replace('#','');
      return `rgba(${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)},${a})`;
    }

    function renderItems(query) {
      const q = query.trim().toLowerCase();
      filtered = q
        ? items.filter(it => (it.title + ' ' + it.sub + ' ' + it.kind).toLowerCase().includes(q))
        : items.slice(0, 20);
      activeIdx = 0;

      if (filtered.length === 0) {
        list.innerHTML = `<div class="af-cmdk-empty">No matches for "${query}"</div>`;
        return;
      }

      const grouped = {};
      filtered.forEach(it => {
        const k = it.kind === 'page' ? 'Pages' : it.kind === 'workflow' ? 'Workflows' : 'Creators';
        (grouped[k] = grouped[k] || []).push(it);
      });

      let html = '';
      let idx = 0;
      ['Pages', 'Workflows', 'Creators'].forEach(group => {
        if (!grouped[group]) return;
        html += `<div class="af-cmdk-group-title">${group}</div>`;
        grouped[group].forEach(it => {
          const isCreator = it.kind === 'creator';
          const iconBlock = isCreator
            ? `<div class="af-cmdk-item-icon" style="background:${it.color};color:#fff;font-size:11px;font-weight:600">${it.initials}</div>`
            : `<div class="af-cmdk-item-icon" style="background:${hexToRgba(it.color, 0.12)};color:${it.color}"><i class="ti ${it.icon}"></i></div>`;
          html += `
            <a class="af-cmdk-item ${idx === activeIdx ? 'active' : ''}" data-idx="${idx}" href="${it.href}">
              ${iconBlock}
              <div class="af-cmdk-item-main">
                <div class="af-cmdk-item-title">${it.title}</div>
                <div class="af-cmdk-item-sub">${it.sub}</div>
              </div>
              ${it.meta ? `<div class="af-cmdk-item-meta">${it.meta}</div>` : ''}
            </a>
          `;
          idx++;
        });
      });
      list.innerHTML = html;
    }

    function updateActive() {
      list.querySelectorAll('.af-cmdk-item').forEach((el, i) =>
        el.classList.toggle('active', i === activeIdx)
      );
      const activeEl = list.querySelector('.af-cmdk-item.active');
      if (activeEl) {
        const lr = list.getBoundingClientRect();
        const er = activeEl.getBoundingClientRect();
        if (er.bottom > lr.bottom) list.scrollTop += er.bottom - lr.bottom + 8;
        if (er.top < lr.top)       list.scrollTop -= lr.top - er.top + 8;
      }
    }

    function openPalette() {
      overlay.classList.add('open');
      input.value = '';
      renderItems('');
      setTimeout(() => input.focus(), 100);
    }
    function closePalette() {
      overlay.classList.remove('open');
    }

    input.addEventListener('input', e => renderItems(e.target.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx = Math.min(activeIdx + 1, filtered.length - 1);
        updateActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = Math.max(activeIdx - 1, 0);
        updateActive();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const el = list.querySelector('.af-cmdk-item.active');
        if (el) window.location.href = el.href;
      }
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) closePalette(); });
    document.addEventListener('keydown', e => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        overlay.classList.contains('open') ? closePalette() : openPalette();
      }
      if (e.key === 'Escape' && overlay.classList.contains('open')) closePalette();
    });

    window.__autoflowOpenPalette = openPalette;
  }

  // ------------------------------------------------- Onboarding ------------
  function maybeShowOnboarding() {
    // Only on home page, and only first visit
    let pathname;
    try { pathname = decodeURIComponent(location.pathname); } catch (e) { pathname = location.pathname; }
    const isHome = /Autoflow Marketplace\.html$/i.test(pathname) ||
                   pathname === '/' ||
                   /\/$/.test(pathname);
    if (!isHome) return;
    let seen;
    try { seen = localStorage.getItem('autoflow.onbSeen'); } catch (e) {}
    if (seen === '1') return;

    let role = null;
    const overlay = document.createElement('div');
    overlay.className = 'af-onb-overlay';
    overlay.innerHTML = `
      <div class="af-onb" role="dialog">
        <div class="af-onb-head">
          <button class="af-onb-skip" id="af-onb-skip">Skip</button>
          <div class="af-onb-icon-circle"><i class="ti ti-wand"></i></div>
          <div class="af-onb-title">Welcome to <em>Autoflow</em></div>
          <div class="af-onb-sub">Quick question — what kind of automations are you looking for?</div>
        </div>
        <div class="af-onb-body">
          <div class="af-onb-options">
            <button class="af-onb-option" data-role="lead">
              <div class="af-onb-option-icon"><i class="ti ti-mail-forward"></i></div>
              <div class="af-onb-option-text">
                <div class="af-onb-option-label">Lead gen & sales</div>
                <div class="af-onb-option-desc">Capture, enrich, route, and follow up automatically.</div>
              </div>
            </button>
            <button class="af-onb-option" data-role="ai">
              <div class="af-onb-option-icon"><i class="ti ti-robot"></i></div>
              <div class="af-onb-option-text">
                <div class="af-onb-option-label">AI content & copy</div>
                <div class="af-onb-option-desc">Generate posts, summaries, briefs — at scale.</div>
              </div>
            </button>
            <button class="af-onb-option" data-role="ops">
              <div class="af-onb-option-icon"><i class="ti ti-coin"></i></div>
              <div class="af-onb-option-text">
                <div class="af-onb-option-label">Finance & ops</div>
                <div class="af-onb-option-desc">Invoicing, expenses, reporting, internal tools.</div>
              </div>
            </button>
            <button class="af-onb-option" data-role="ecomm">
              <div class="af-onb-option-icon"><i class="ti ti-shopping-cart"></i></div>
              <div class="af-onb-option-text">
                <div class="af-onb-option-label">E-commerce</div>
                <div class="af-onb-option-desc">Cart recovery, inventory, reviews, post-purchase.</div>
              </div>
            </button>
          </div>
        </div>
        <div class="af-onb-foot">
          <div class="af-onb-progress">
            <span class="af-onb-dot active"></span>
            <span class="af-onb-dot"></span>
          </div>
          <button class="af-onb-cta" id="af-onb-cta" disabled style="opacity:0.5">See picks <i class="ti ti-arrow-right"></i></button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    const dismiss = () => {
      overlay.classList.remove('open');
      try { localStorage.setItem('autoflow.onbSeen', '1'); } catch (e) {}
      setTimeout(() => overlay.remove(), 250);
    };

    overlay.querySelector('#af-onb-skip').addEventListener('click', dismiss);
    overlay.querySelectorAll('.af-onb-option').forEach(opt => {
      opt.addEventListener('click', () => {
        overlay.querySelectorAll('.af-onb-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        role = opt.dataset.role;
        const cta = overlay.querySelector('#af-onb-cta');
        cta.disabled = false;
        cta.style.opacity = '1';
      });
    });
    overlay.querySelector('#af-onb-cta').addEventListener('click', () => {
      // Route to Browse with category preselect via URL hash
      const catMap = { lead: 'Lead gen', ai: 'AI', ops: 'Ops', ecomm: 'E-comm' };
      const cat = catMap[role];
      try { localStorage.setItem('autoflow.onbSeen', '1'); } catch (e) {}
      window.location.href = 'Browse Workflows.html' + (cat ? '?preset=' + encodeURIComponent(cat) : '');
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) dismiss(); });
  }

  // ------------------------------------------------- Theme toggle ----------
  function buildThemeToggle() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;
    const btn = document.createElement('button');
    btn.className = 'btn-ghost af-theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.style.cssText = 'width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;flex-shrink:0;';
    function syncIcon() {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.innerHTML = dark
        ? '<i class="ti ti-sun" style="font-size:16px"></i>'
        : '<i class="ti ti-moon" style="font-size:16px"></i>';
    }
    syncIcon();
    btn.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-theme') !== 'dark';
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      try { localStorage.setItem('autoflow.theme', dark ? 'dark' : 'light'); } catch(e) {}
      syncIcon();
    });
    navRight.insertBefore(btn, navRight.firstChild);
  }

  // ---------------------------------------------------------------- boot ---
  function boot() {
    buildFooter();
    buildMobileNav();
    buildThemeToggle();
    buildCmdK();
    maybeShowOnboarding();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
