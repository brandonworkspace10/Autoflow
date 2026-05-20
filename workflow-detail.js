(function () {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10) || 1;
  const wf = window.WORKFLOWS.find(w => w.id === id) || window.WORKFLOWS[0];
  const creator = window.CREATORS.find(c => c.id === wf.author);

  // Title
  document.title = `${wf.title} — Autoflow`;

  // Crumbs
  document.getElementById('crumbs').innerHTML = `
    <a href="Autoflow Marketplace.html">Home</a>
    <span class="sep">·</span>
    <a href="Browse Workflows.html">Browse</a>
    <span class="sep">·</span>
    <a href="Browse Workflows.html">${wf.cat}</a>
    <span class="sep">·</span>
    <span style="color:var(--color-text-secondary)">${wf.title}</span>
  `;

  // Hero meta row
  const badgeLabel = { free: 'Free', pro: 'Pro', new: 'New' }[wf.badge];
  function hexToRgba(hex, a) {
    const h = hex.replace('#','');
    const r = parseInt(h.substring(0,2),16), g = parseInt(h.substring(2,4),16), b = parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }
  document.getElementById('hero-meta').innerHTML = `
    <div class="hero-icon" style="background:${hexToRgba(wf.color, 0.10)}"><i class="ti ${wf.icon}" style="color:${wf.color}"></i></div>
    <span class="hero-cat">${wf.cat}</span>
    <span class="hero-badge badge-${wf.badge}">${badgeLabel}</span>
  `;
  document.getElementById('hero-title').textContent = wf.title;
  document.getElementById('hero-sub').textContent = wf.desc;
  function fmtAge(days) {
    if (days < 7) return 'this week';
    if (days < 30) return days + ' days ago';
    const m = Math.round(days / 30);
    return m === 1 ? '1 month ago' : m + ' months ago';
  }

  document.getElementById('hero-stats').innerHTML = `
    <span class="rating"><i class="ti ti-star-filled"></i><strong>${wf.rating.toFixed(1)}</strong> (${Math.round(wf.installs * 0.15)} reviews)</span>
    <span class="sep">·</span>
    <span><strong>${wf.installs.toLocaleString()}</strong> installs</span>
    <span class="sep">·</span>
    <span>Updated <strong>${fmtAge(wf.days)}</strong></span>
  `;

  // Install card price
  const isFree = wf.price === 0;
  document.getElementById('install-price').innerHTML = isFree
    ? `<span>Free</span>`
    : `<span class="currency">$</span><span>${wf.price}</span>`;
  document.getElementById('install-price').classList.toggle('free', isFree);
  document.getElementById('install-note').textContent = isFree
    ? 'One-click install · no card required'
    : 'One-time purchase · keep forever';

  // Overview — expand the short desc into 2 paragraphs
  document.getElementById('overview').innerHTML = `
    <p>${wf.desc}</p>
    <p>Built by ${creator?.name || 'an Autoflow creator'} after running it across ${Math.round(wf.installs / 10)} real customer accounts. Designed to be reliable, easy to debug, and dead-simple to install — drop in your API keys and you're running in under 10 minutes.</p>
  `;

  // Step-by-step flow — synthesize 4 steps from the workflow's tools
  document.getElementById('flow-name').textContent = wf.title;
  const stepIconClasses = ['', 'blue', 'green', 'purple', 'pink'];
  const flowSteps = synthesizeSteps(wf);
  document.getElementById('flow-body').innerHTML = flowSteps.map((s, i) => `
    ${i > 0 ? `<div class="step-arrow">↓</div>` : ''}
    <div class="step">
      <div class="step-num">${i + 1}</div>
      <div>
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
      <div class="step-icon ${stepIconClasses[i % stepIconClasses.length]}"><i class="ti ${s.icon}"></i></div>
    </div>
  `).join('');

  // Reviews — synthesize 3
  const reviewers = [
    { name: 'Sam Patel', initials: 'SP', color: '#0066FF', date: '2 weeks ago' },
    { name: 'Lena Cho',  initials: 'LC', color: '#FF4D00', date: '1 month ago' },
    { name: 'Marco Bianchi', initials: 'MB', color: '#16a34a', date: '2 months ago' },
  ];
  const reviewBodies = synthesizeReviews(wf);
  document.getElementById('reviews').innerHTML = reviewers.map((r, i) => `
    <div class="review">
      <div class="review-head">
        <div class="review-avatar" style="background:${r.color}">${r.initials}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
        <div class="review-stars">${'<i class="ti ti-star-filled"></i>'.repeat(5)}</div>
      </div>
      <div class="review-body">${reviewBodies[i]}</div>
    </div>
  `).join('');

  // Creator card
  if (creator) {
    document.getElementById('sb-creator').innerHTML = `
      <div class="sb-creator-av" style="background:${creator.color}">${creator.id}</div>
      <div>
        <div class="sb-creator-name">${creator.name}</div>
        <div class="sb-creator-role">${creator.role}</div>
      </div>
    `;
    document.getElementById('sb-creator').href = `Creator Profile.html?id=${creator.id}`;
    document.getElementById('sb-creator-stats').innerHTML = `
      <span>Workflows <strong>${creator.workflows}</strong></span>
      <span>Rating <strong>${creator.rating.toFixed(1)}★</strong></span>
    `;
  }

  // Tools
  document.getElementById('sb-tools').innerHTML = wf.tools.map(t => `<span class="sb-tool">${t}</span>`).join('');

  // Details
  document.getElementById('sb-details').innerHTML = `
    <div class="sb-row"><span class="k">Category</span><span class="v">${wf.cat}</span></div>
    <div class="sb-row"><span class="k">Setup time</span><span class="v">~10 minutes</span></div>
    <div class="sb-row"><span class="k">Runs on</span><span class="v">Zapier · Make · n8n</span></div>
    <div class="sb-row"><span class="k">Updated</span><span class="v">${fmtAge(wf.days)}</span></div>
    <div class="sb-row"><span class="k">License</span><span class="v">Personal use</span></div>
  `;

  // Similar workflows — same category, exclude current, up to 3
  const similar = window.WORKFLOWS
    .filter(w => w.cat === wf.cat && w.id !== wf.id)
    .slice(0, 3);
  // If not enough in same cat, pad with top installs
  while (similar.length < 3) {
    const candidate = window.WORKFLOWS
      .filter(w => w.id !== wf.id && !similar.includes(w))
      .sort((a, b) => b.installs - a.installs)[0];
    if (!candidate) break;
    similar.push(candidate);
  }
  document.getElementById('similar-grid').innerHTML = similar.map(w => `
    <a class="sim-card" href="Workflow.html?id=${w.id}">
      <div class="sim-icon" style="background:${hexToRgba(w.color, 0.10)}"><i class="ti ${w.icon}" style="color:${w.color}"></i></div>
      <div class="sim-title">${w.title}</div>
      <div class="sim-foot">
        <span><i class="ti ti-star-filled" style="color:#f59e0b;font-size:10px"></i> ${w.rating.toFixed(1)} · ${w.installs.toLocaleString()}</span>
        <span class="sim-price ${w.price === 0 ? 'free' : ''}">${w.price === 0 ? 'Free' : '$' + w.price}</span>
      </div>
    </a>
  `).join('');

  // ----- Install modal -----
  const modal = document.getElementById('install-modal');
  const modalBox = modal.querySelector('.modal');
  document.getElementById('modal-title').innerHTML = `Install <em style="font-style:italic;color:var(--accent)">${wf.title.split(' ').slice(0, 4).join(' ')}…</em>`;
  document.getElementById('summary-row').innerHTML = `
    <div class="ico" style="background:${hexToRgba(wf.color, 0.10)}"><i class="ti ${wf.icon}" style="color:${wf.color}"></i></div>
    <div>
      <div class="name">${wf.title}</div>
      <div class="by">by ${creator?.name || 'Autoflow Creator'}</div>
    </div>
    <div class="price">${isFree ? 'Free' : '$' + wf.price}</div>
  `;
  document.getElementById('modal-amt').textContent = isFree ? '$0.00' : `$${wf.price}.00`;
  document.getElementById('btn-pay').innerHTML = isFree
    ? `<i class="ti ti-download"></i> Install for free`
    : `<i class="ti ti-lock"></i> Pay $${wf.price} and install`;

  // Hide card fields if free
  if (isFree) {
    document.querySelectorAll('.field-row').forEach(r => r.style.display = 'none');
  }

  document.getElementById('open-install').addEventListener('click', openModal);
  document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  // Workspace selector
  document.querySelectorAll('.ws-radio').forEach(r => {
    r.addEventListener('click', () => {
      document.querySelectorAll('.ws-radio').forEach(x => x.classList.remove('active'));
      r.classList.add('active');
    });
  });
  document.getElementById('btn-pay').addEventListener('click', () => {
    modalBox.classList.add('success');
  });

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => modalBox.classList.remove('success'), 250);
  }

  // ---- Helpers ----
  function synthesizeSteps(w) {
    // Generic 4-step flow assembled from icons and tools
    const triggers = {
      'Lead gen':  { title: 'New lead arrives', desc: 'Triggers on a new form submission, signup, or website visit', icon: 'ti-bolt' },
      'AI':        { title: 'Content drops in', desc: 'Triggers when new content is added to the source', icon: 'ti-sparkles' },
      'Finance':   { title: 'Transaction event', desc: 'Triggers on a Stripe/QuickBooks/payment event', icon: 'ti-coin' },
      'E-comm':    { title: 'Shopify event fires', desc: 'Triggers on an order, cart, or inventory change', icon: 'ti-shopping-cart' },
      'Ops':       { title: 'Schedule kicks off', desc: 'Runs on a cron schedule or manual trigger', icon: 'ti-clock' },
      'Marketing': { title: 'Source content found', desc: 'Triggers when matching content is detected', icon: 'ti-rss' },
      'Productivity': { title: 'Source updates', desc: 'Triggers from a calendar, transcript, or task source', icon: 'ti-bell' },
      'Sales':     { title: 'Signal detected', desc: 'Triggers on a CRM activity or product event', icon: 'ti-activity' },
    };
    const t = triggers[w.cat] || triggers['Ops'];
    return [
      t,
      { title: `AI processes the data`, desc: `Uses ${w.tools.find(x => /openai|ai/i.test(x)) || 'GPT-4'} to classify, enrich, or generate the right output`, icon: 'ti-robot' },
      { title: `Sync to ${w.tools[1] || w.tools[0]}`, desc: `Writes the result back to your system of record`, icon: 'ti-database' },
      { title: `Notify your team`, desc: `Posts to Slack or sends an email so nothing slips through`, icon: 'ti-bell' },
    ];
  }

  function synthesizeReviews(w) {
    return [
      `Honestly, this paid for itself the first week. The setup was way smoother than I expected — I'm not a no-code person and I had it running in 15 minutes. Worth every dollar.`,
      `Solid workflow. ${w.tools[0]} integration just works, and the AI prompts are tuned well — no weird hallucinations like other ones I've tried. ${creator?.name?.split(' ')[0] || 'The creator'} also replied to my support email same-day.`,
      `Was skeptical at first since I usually build these myself, but the time savings are real. We installed it for our whole team and it's been running flawlessly for ${Math.max(2, Math.round(w.days / 30))} months now.`,
    ];
  }
})();
