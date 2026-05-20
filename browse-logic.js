(function () {
  const data = window.WORKFLOWS;
  const PAGE_SIZE = 12;

  // Active filter state
  const state = {
    cats: new Set(),
    tools: new Set(),
    price: 'all',
    rating: 0,
    search: '',
    sort: 'popular',
    visible: PAGE_SIZE,
  };

  // ---------- Build sidebar dynamically from data ----------
  function buildSidebar() {
    const catCounts = {};
    const toolCounts = {};
    data.forEach(w => {
      catCounts[w.cat] = (catCounts[w.cat] || 0) + 1;
      w.tools.forEach(t => { toolCounts[t] = (toolCounts[t] || 0) + 1; });
    });

    const catList = document.getElementById('cat-list');
    Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      const el = document.createElement('div');
      el.className = 'filter-option';
      el.dataset.cat = cat;
      el.innerHTML = `<span class="check"></span><span class="label-text">${cat}</span><span class="count">${count}</span>`;
      el.addEventListener('click', () => {
        if (state.cats.has(cat)) state.cats.delete(cat); else state.cats.add(cat);
        el.classList.toggle('active');
        state.visible = PAGE_SIZE;
        render();
      });
      catList.appendChild(el);
    });

    const toolList = document.getElementById('tool-list');
    Object.entries(toolCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([tool, count]) => {
      const el = document.createElement('div');
      el.className = 'filter-option';
      el.dataset.tool = tool;
      el.innerHTML = `<span class="check"></span><span class="label-text">${tool}</span><span class="count">${count}</span>`;
      el.addEventListener('click', () => {
        if (state.tools.has(tool)) state.tools.delete(tool); else state.tools.add(tool);
        el.classList.toggle('active');
        state.visible = PAGE_SIZE;
        render();
      });
      toolList.appendChild(el);
    });
  }

  // ---------- Price + rating (radio behavior) ----------
  function setupRadios() {
    document.querySelectorAll('#price-list .price-option').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('#price-list .price-option').forEach(o => o.classList.remove('active'));
        el.classList.add('active');
        state.price = el.dataset.price;
        state.visible = PAGE_SIZE;
        render();
      });
    });
    document.querySelectorAll('#rating-list .price-option').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('#rating-list .price-option').forEach(o => o.classList.remove('active'));
        el.classList.add('active');
        state.rating = parseFloat(el.dataset.rating);
        state.visible = PAGE_SIZE;
        render();
      });
    });
  }

  // ---------- Search + sort ----------
  function setupControls() {
    document.getElementById('search').addEventListener('input', e => {
      state.search = e.target.value.trim().toLowerCase();
      state.visible = PAGE_SIZE;
      render();
    });
    document.getElementById('sort').addEventListener('change', e => {
      state.sort = e.target.value;
      render();
    });
    document.getElementById('load-more').addEventListener('click', () => {
      state.visible += PAGE_SIZE;
      render();
    });
  }

  // ---------- Filtering + sorting ----------
  function priceMatch(price, rule) {
    switch (rule) {
      case 'free':    return price === 0;
      case '0-25':    return price > 0 && price < 25;
      case '25-50':   return price >= 25 && price <= 50;
      case '50-100':  return price > 50 && price <= 100;
      case '100+':    return price > 100;
      default:        return true;
    }
  }

  function getFiltered() {
    let list = data.filter(w => {
      if (state.cats.size && !state.cats.has(w.cat)) return false;
      if (state.tools.size && !w.tools.some(t => state.tools.has(t))) return false;
      if (!priceMatch(w.price, state.price)) return false;
      if (w.rating < state.rating) return false;
      if (state.search) {
        const hay = (w.title + ' ' + w.desc + ' ' + w.cat + ' ' + w.tools.join(' ')).toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    });

    switch (state.sort) {
      case 'newest':     list.sort((a, b) => a.days - b.days); break;
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      default:           list.sort((a, b) => b.installs - a.installs);
    }
    return list;
  }

  // ---------- Render ----------
  function priceLabel(rule) {
    return { 'free': 'Free', '0-25': 'Under $25', '25-50': '$25–$50', '50-100': '$50–$100', '100+': '$100+' }[rule] || '';
  }

  function renderActiveFilters() {
    const wrap = document.getElementById('active-filters');
    wrap.innerHTML = '';
    const chips = [];

    state.cats.forEach(c => chips.push({ label: c, clear: () => {
      state.cats.delete(c);
      const el = document.querySelector(`[data-cat="${c}"]`);
      if (el) el.classList.remove('active');
    }}));
    state.tools.forEach(t => chips.push({ label: t, clear: () => {
      state.tools.delete(t);
      const el = document.querySelector(`[data-tool="${t}"]`);
      if (el) el.classList.remove('active');
    }}));
    if (state.price !== 'all') chips.push({ label: priceLabel(state.price), clear: () => {
      state.price = 'all';
      document.querySelectorAll('#price-list .price-option').forEach(o => o.classList.remove('active'));
      document.querySelector('#price-list [data-price="all"]').classList.add('active');
    }});
    if (state.rating > 0) chips.push({ label: state.rating + '★ & up', clear: () => {
      state.rating = 0;
      document.querySelectorAll('#rating-list .price-option').forEach(o => o.classList.remove('active'));
      document.querySelector('#rating-list [data-rating="0"]').classList.add('active');
    }});

    chips.forEach(c => {
      const el = document.createElement('span');
      el.className = 'active-filter';
      el.innerHTML = `${c.label} <span class="x"><i class="ti ti-x"></i></span>`;
      el.addEventListener('click', () => {
        c.clear();
        state.visible = PAGE_SIZE;
        render();
      });
      wrap.appendChild(el);
    });

    if (chips.length > 1) {
      const clearAll = document.createElement('span');
      clearAll.className = 'clear-all';
      clearAll.textContent = 'Clear all';
      clearAll.addEventListener('click', () => {
        state.cats.clear();
        state.tools.clear();
        state.price = 'all';
        state.rating = 0;
        document.querySelectorAll('.filter-option.active').forEach(o => o.classList.remove('active'));
        document.querySelector('#price-list [data-price="all"]').classList.add('active');
        document.querySelector('#rating-list [data-rating="0"]').classList.add('active');
        state.visible = PAGE_SIZE;
        render();
      });
      wrap.appendChild(clearAll);
    }
  }

  function hexToRgba(hex, a) {
    const h = hex.replace('#','');
    const r = parseInt(h.substring(0,2), 16);
    const g = parseInt(h.substring(2,4), 16);
    const b = parseInt(h.substring(4,6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function badgeLabel(b) {
    return { free: 'Free', pro: 'Pro', new: 'New' }[b];
  }

  function cardHTML(w) {
    const priceText = w.price === 0 ? 'Free' : '$' + w.price;
    return `
      <a class="wf-card" href="Workflow.html?id=${w.id}" style="text-decoration:none;color:inherit;display:flex;flex-direction:column">
        <div class="wf-card-top">
          <div class="wf-icon-wrap" style="background:${hexToRgba(w.color, 0.10)}"><i class="ti ${w.icon}" style="color:${w.color}" aria-hidden="true"></i></div>
          <span class="wf-badge badge-${w.badge}">${badgeLabel(w.badge)}</span>
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
          <div class="wf-price ${w.price === 0 ? 'free' : ''}">${priceText}</div>
        </div>
      </a>
    `;
  }

  function render() {
    const filtered = getFiltered();
    document.getElementById('result-num').textContent = filtered.length;
    renderActiveFilters();

    const grid = document.getElementById('grid');
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="ti ti-search-off"></i>
          <div class="empty-title">No workflows match</div>
          <div>Try removing a filter or searching for something else.</div>
        </div>
      `;
      document.getElementById('load-more-wrap').hidden = true;
      return;
    }

    const shown = filtered.slice(0, state.visible);
    grid.innerHTML = shown.map(cardHTML).join('');

    const more = document.getElementById('load-more-wrap');
    more.hidden = state.visible >= filtered.length;
    if (!more.hidden) {
      document.getElementById('load-more').textContent =
        `Load ${Math.min(PAGE_SIZE, filtered.length - state.visible)} more · ${filtered.length - state.visible} remaining`;
    }
  }

  // ---------- Init ----------
  buildSidebar();
  setupRadios();
  setupControls();

  // Apply ?preset=Category from onboarding deep-link
  const presetCat = new URLSearchParams(location.search).get('preset');
  if (presetCat) {
    state.cats.add(presetCat);
    setTimeout(() => {
      const el = document.querySelector(`[data-cat="${presetCat}"]`);
      if (el) el.classList.add('active');
      render();
    }, 0);
  }

  render();
})();
