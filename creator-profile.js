(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'JR';
  const creator = window.CREATORS.find(c => c.id === id) || window.CREATORS[0];

  // All workflows by this creator
  const myWorkflows = window.WORKFLOWS.filter(w => w.author === creator.id);

  // Title + crumbs
  document.title = `${creator.name} — Autoflow`;
  document.getElementById('crumbs').innerHTML = `
    <a href="Autoflow Marketplace.html">Home</a>
    <span class="sep">·</span>
    <a href="Creators.html">Creators</a>
    <span class="sep">·</span>
    <span style="color:var(--color-text-secondary)">${creator.name}</span>
  `;

  // Cover gradient — derives from creator color
  document.getElementById('profile-cover').style.background = `
    radial-gradient(120% 100% at 20% 30%, ${hexToRgba(creator.color, 0.35)} 0%, transparent 60%),
    radial-gradient(80% 80% at 80% 70%, ${hexToRgba(creator.color, 0.18)} 0%, transparent 60%),
    var(--color-background-secondary)
  `;

  // Avatar
  const avatar = document.getElementById('profile-avatar');
  avatar.style.background = creator.color;
  avatar.textContent = creator.id;

  // Tier badge
  const tierMap = {
    top:      { label: 'Top creator', icon: 'ti-crown', cls: 'tier-top' },
    verified: { label: 'Verified', icon: 'ti-rosette-discount-check', cls: 'tier-verified' },
    new:      { label: 'New creator', icon: 'ti-sparkles', cls: 'tier-new' },
  };
  const t = tierMap[creator.tier];
  if (t) {
    document.getElementById('tier-badge').innerHTML =
      `<span class="tier-badge ${t.cls}"><i class="ti ${t.icon}"></i> ${t.label}</span>`;
  }

  // Name + handle row
  document.getElementById('profile-name').textContent = creator.name;
  document.getElementById('profile-handle').innerHTML = `
    <span>${creator.handle}</span>
    <span class="sep">·</span>
    <span><i class="ti ti-map-pin"></i> ${creator.location}</span>
    <span class="sep">·</span>
    <span><i class="ti ti-calendar"></i> Joined ${creator.joined}</span>
  `;
  document.getElementById('profile-bio').textContent = creator.bio;

  // Stats row
  const earnings = Math.round((creator.installs * 0.5) / 100) * 100;
  document.getElementById('profile-stats').innerHTML = `
    <div class="ps-item">
      <div class="ps-value">${creator.workflows}</div>
      <div class="ps-label">Workflows</div>
    </div>
    <div class="ps-item">
      <div class="ps-value">${fmtInstalls(creator.installs)}</div>
      <div class="ps-label">Total installs</div>
    </div>
    <div class="ps-item">
      <div class="ps-value">${creator.rating.toFixed(1)}<span class="star"> ★</span></div>
      <div class="ps-label">Average rating</div>
    </div>
    <div class="ps-item">
      <div class="ps-value">$${fmtInstalls(earnings)}<em>+</em></div>
      <div class="ps-label">Earned on Autoflow</div>
    </div>
  `;

  // Tab counts
  document.getElementById('tab-wf-count').textContent = myWorkflows.length;
  document.getElementById('tab-rv-count').textContent = Math.round(creator.installs * 0.12);

  // Pinned workflow — match by topFlow title, fall back to first
  const pinned = myWorkflows.find(w => w.title === creator.topFlow) || myWorkflows[0];
  if (pinned) {
    document.getElementById('pinned').innerHTML = `
      <div class="ps-icon-big" style="background:${hexToRgba(pinned.color, 0.10)}">
        <i class="ti ${pinned.icon}" style="color:${pinned.color}"></i>
      </div>
      <div>
        <div class="ps-eyebrow"><i class="ti ti-pinned"></i> Pinned workflow</div>
        <div class="ps-title">${pinned.title}</div>
        <div class="ps-desc">${pinned.desc}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end">
        <div class="ps-price ${pinned.price === 0 ? 'free' : ''}">${pinned.price === 0 ? 'Free' : '$' + pinned.price}</div>
        <a class="ps-cta" href="Workflow.html?id=${pinned.id}">View workflow <i class="ti ti-arrow-right"></i></a>
      </div>
    `;
  } else {
    document.getElementById('pinned').style.display = 'none';
  }

  // Workflow grid (exclude pinned to avoid duplication, unless it's the only one)
  const otherFlows = pinned && myWorkflows.length > 1 ? myWorkflows.filter(w => w.id !== pinned.id) : myWorkflows;
  document.getElementById('wf-grid').innerHTML = otherFlows.map(cardHTML).join('') || `
    <div style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--color-text-tertiary);font-size:13px">
      Only the pinned workflow above so far. ${creator.name.split(' ')[0]} is just getting started.
    </div>
  `;

  // ---- About pane ----
  document.getElementById('about-bg').textContent = `${creator.bio} Based in ${creator.location}, joined Autoflow in ${creator.joined}.`;
  document.getElementById('about-how').textContent = `I build automations that survive contact with reality. Every workflow I ship has been running in my own ops or a client's for at least 30 days before it goes on sale. If it breaks, I fix it — lifetime updates are part of the deal.`;
  document.getElementById('timeline').innerHTML = synthesizeTimeline(creator).map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-text">${item.text}</div>
      </div>
    </div>
  `).join('');

  // ---- Reviews pane ----
  document.getElementById('reviews').innerHTML = synthesizeReviews(creator, myWorkflows).map(r => `
    <div class="review">
      <div class="review-head">
        <div class="review-avatar" style="background:${r.color}">${r.initials}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
        <div class="review-stars">${'<i class="ti ti-star-filled"></i>'.repeat(5)}</div>
      </div>
      <div class="review-flow">on <span>${r.flow}</span></div>
      <div class="review-body">${r.body}</div>
    </div>
  `).join('');

  // Sidebar details
  document.getElementById('sb-details').innerHTML = `
    <div class="sb-row"><span class="k">Specialty</span><span class="v">${creator.role}</span></div>
    <div class="sb-row"><span class="k">Location</span><span class="v">${creator.location}</span></div>
    <div class="sb-row"><span class="k">Joined</span><span class="v">${creator.joined}</span></div>
    <div class="sb-row"><span class="k">Response time</span><span class="v">&lt; 24h</span></div>
    <div class="sb-row"><span class="k">Refund rate</span><span class="v">&lt; 2%</span></div>
  `;

  // Tools
  document.getElementById('sb-tools').innerHTML =
    creator.tools.map(t => `<span class="sb-tool">${t}</span>`).join('');

  // Other creators — same role, exclude current, up to 4
  let others = window.CREATORS.filter(c => c.role === creator.role && c.id !== creator.id);
  while (others.length < 4) {
    const cand = window.CREATORS.find(c => c.id !== creator.id && !others.includes(c));
    if (!cand) break;
    others.push(cand);
  }
  document.getElementById('other-creators').innerHTML = others.slice(0, 4).map(c => `
    <a class="other-creator" href="Creator Profile.html?id=${c.id}">
      <div class="other-av" style="background:${c.color}">${c.id}</div>
      <div>
        <div class="other-name">${c.name}</div>
        <div class="other-meta">${c.workflows} workflows · ${c.rating}★</div>
      </div>
    </a>
  `).join('');

  // ---- Tab switching ----
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === target));
    });
  });

  // ---- Follow toggle ----
  const followBtn = document.getElementById('follow-btn');
  followBtn.addEventListener('click', () => {
    const following = followBtn.classList.toggle('following');
    followBtn.innerHTML = following
      ? `<i class="ti ti-check"></i> Following`
      : `<i class="ti ti-plus"></i> Follow`;
  });

  // ===== helpers =====
  function hexToRgba(hex, a) {
    const h = hex.replace('#','');
    return `rgba(${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)},${a})`;
  }
  function fmtInstalls(n) {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
    return n.toString();
  }
  function cardHTML(w) {
    const badgeText = { free: 'Free', pro: 'Pro', new: 'New' }[w.badge];
    return `
      <a class="wf-card" href="Workflow.html?id=${w.id}">
        <div class="wf-card-top">
          <div class="wf-icon-wrap" style="background:${hexToRgba(w.color, 0.10)}"><i class="ti ${w.icon}" style="color:${w.color}"></i></div>
          <span class="wf-badge badge-${w.badge}">${badgeText}</span>
        </div>
        <div class="wf-cat">${w.cat}</div>
        <div class="wf-title">${w.title}</div>
        <div class="wf-desc">${w.desc}</div>
        <div class="wf-footer">
          <div class="wf-meta">
            <span class="wf-rating"><i class="ti ti-star-filled"></i> ${w.rating.toFixed(1)}</span>
            <span>·</span>
            <span>${w.installs.toLocaleString()} installs</span>
          </div>
          <div class="wf-price ${w.price === 0 ? 'free' : ''}">${w.price === 0 ? 'Free' : '$' + w.price}</div>
        </div>
      </a>
    `;
  }
  function synthesizeTimeline(c) {
    const joinYear = parseInt(c.joined, 10);
    return [
      { year: joinYear, text: `Joined Autoflow as a ${c.role.toLowerCase()}` },
      { year: joinYear, text: `Shipped first workflow: "${c.topFlow}"` },
      { year: joinYear + 1, text: `Hit 1,000 installs across the catalog` },
      { year: 2026, text: `Now maintaining ${c.workflows} live workflows with a ${c.rating}★ average` },
    ].filter(t => t.year <= 2026);
  }
  function synthesizeReviews(c, flows) {
    const sample = (i) => flows[i % Math.max(flows.length, 1)] || { title: c.topFlow };
    return [
      { initials: 'SP', color: '#0066FF', name: 'Sam Patel',     date: '2 weeks ago', flow: sample(0).title, body: `${c.name.split(' ')[0]} is the real deal. Workflow installed in 10 minutes, runs without fuss, and the docs are actually readable — which is rare in this space.` },
      { initials: 'LC', color: '#FF4D00', name: 'Lena Cho',      date: '1 month ago', flow: sample(1).title, body: `Bought three of their workflows last quarter. All three are still running. Saves my team probably 15 hours a week combined.` },
      { initials: 'MB', color: '#16a34a', name: 'Marco Bianchi', date: '2 months ago', flow: sample(2).title, body: `Asked a question via email at 9pm on a Sunday. Got a reply with a fix Monday morning. Worth the premium just for the support.` },
      { initials: 'AR', color: '#7c3aed', name: 'Aimee Russell', date: '3 months ago', flow: sample(0).title, body: `Was on the fence about price but it paid for itself the first month. Would buy again from this creator.` },
    ];
  }
})();
