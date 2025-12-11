// scripts/main.js
import { fetchServices } from './data.js';
import { showModal } from './modal.js';

const SERVICES_JSON = 'data/services.json';
const FAVORITES_KEY = 'ftn_favorites_v1';
const VIDEO_KEY = 'ftn_video_url_v1';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  setYears();
  setupNav();
  setupControls();
  setupVideoSave();
  await loadAndRenderServices();
  restoreVideoDisplay();
}

function setYears() {
  document.querySelectorAll('#year, #year2, #year3').forEach(el => el.textContent = new Date().getFullYear());
}

function setupNav() {
  document.querySelectorAll('.hamburger').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = document.getElementById('nav-list');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) list.classList.add('show');
      else list.classList.remove('show');
    });
  });
  document.querySelectorAll('.nav-list a').forEach(a => a.addEventListener('click', () => {
    const list = document.getElementById('nav-list');
    if (list) list.classList.remove('show');
    document.querySelectorAll('.hamburger').forEach(h => h.setAttribute('aria-expanded', 'false'));
  }));
}

function setupControls() {
  const filter = document.getElementById('filter');
  const showFav = document.getElementById('show-favorites');
  const clearFav = document.getElementById('clear-favorites');

  if (filter) filter.addEventListener('change', () => loadAndRenderServices());
  if (showFav) showFav.addEventListener('click', showOnlyFavorites);
  if (clearFav) clearFav.addEventListener('click', clearFavorites);
}

function setupVideoSave() {
  const input = document.getElementById('video-url');
  const btn = document.getElementById('save-video');
  if (!input || !btn) return;
  btn.addEventListener('click', () => {
    const url = input.value.trim();
    if (!url) {
      alert('Please paste your public video URL (YouTube, Loom, etc.)');
      return;
    }
    try {
      new URL(url);
      localStorage.setItem(VIDEO_KEY, url);
      restoreVideoDisplay();
      alert('Video link saved.');
    } catch {
      alert('Please enter a valid URL.');
    }
  });
}

function restoreVideoDisplay() {
  const saved = localStorage.getItem(VIDEO_KEY);
  const area = document.getElementById('video-saved');
  if (area) {
    if (saved) {
      area.innerHTML = `Saved video: <a href="${escapeAttr(saved)}" target="_blank" rel="noopener noreferrer">${escapeAttr(saved)}</a>`;
    } else {
      area.textContent = 'No video saved.';
    }
  }
}

async function loadAndRenderServices() {
  const listEl = document.getElementById('services-list');
  if (!listEl) return;
  listEl.innerHTML = '<p>Loading services...</p>';

  try {
    const services = await fetchServices(SERVICES_JSON);
    const filterVal = document.getElementById('filter')?.value || 'all';
    let visible = services;
    if (filterVal && filterVal !== 'all') visible = services.filter(s => s.category === filterVal);
    renderServiceCards(visible);
    lazyInit();
  } catch (err) {
    console.error(err);
    listEl.innerHTML = '<p class="muted">Unable to load services right now.</p>';
  }
}

function renderServiceCards(items) {
  const root = document.getElementById('services-list');
  root.innerHTML = '';
  const favorites = getFavorites();
  const fragment = document.createDocumentFragment();

  items.slice(0, 40).forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-id', item.id);

    const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='#efefef'/><text x='50%' y='50%' font-size='18' fill='#b0b0b0' text-anchor='middle' font-family='Arial'>Loading image…</text></svg>`)}`;

    const img = document.createElement('img');
    img.alt = `${item.name} image`;
    img.loading = 'lazy';
    img.src = placeholder;
    img.width = 400;
    img.height = 240;
    img.dataset.src = item.image || '';

    const src400 = item.image ? item.image.replace(/\/(\d+)\/(\d+)$/, '/400/240') : '';
    const src800 = item.image ? item.image.replace(/\/(\d+)\/(\d+)$/, '/800/480') : '';
    if (src400 && src800) img.dataset.srcset = `${src400} 400w, ${src800} 800w`;

    const title = document.createElement('h4');
    title.textContent = item.name;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${item.category} • ${item.location}`;

    const desc = document.createElement('p');
    desc.textContent = item.description;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'btn';
    detailsBtn.textContent = 'Details';
    detailsBtn.setAttribute('aria-haspopup', 'dialog');
    detailsBtn.addEventListener('click', () => openDetailsModal(item));

    const favBtn = document.createElement('button');
    favBtn.className = 'btn ghost';
    favBtn.textContent = favorites.includes(item.id) ? 'Unfavorite' : 'Favorite';
    favBtn.addEventListener('click', () => {
      toggleFavorite(item.id);
      favBtn.textContent = getFavorites().includes(item.id) ? 'Unfavorite' : 'Favorite';
    });

    actions.appendChild(detailsBtn);
    actions.appendChild(favBtn);

    const contact = document.createElement('div');
    contact.className = 'meta';
    contact.innerHTML = `<strong>Contact:</strong> <a href="mailto:${escapeAttr(item.contact)}">${escapeHtml(item.contact)}</a> • <span>${escapeHtml(item.phone)}</span>`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(desc);
    card.appendChild(contact);
    card.appendChild(actions);

    fragment.appendChild(card);
  });

  root.appendChild(fragment);
}

let lazyObserver = null;

function lazyInit() {
  const lazyImages = Array.from(document.querySelectorAll('img[data-src]'));
  if ('IntersectionObserver' in window) {
    lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImg(img);
          lazyObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    lazyImages.forEach(img => lazyObserver.observe(img));
  } else {
    lazyImages.forEach(img => loadImg(img));
  }
}

function loadImg(img) {
  if (!img || !img.dataset) return;
  const src = img.dataset.src;
  const srcset = img.dataset.srcset;
  if (srcset) img.setAttribute('srcset', srcset);
  if (src) img.src = src;
  img.addEventListener('error', () => img.classList.add('img-failed'));
  img.addEventListener('load', () => img.classList.add('img-loaded'));
}

function openDetailsModal(item) {
  const content = `
    <p><strong>Category:</strong> ${escapeHtml(item.category)}</p>
    <p><strong>Location:</strong> ${escapeHtml(item.location)}</p>
    <p><strong>Hours:</strong> ${escapeHtml(item.hours || 'See provider')}</p>
    <p><strong>Phone:</strong> ${escapeHtml(item.phone)}</p>
    <p><strong>Description:</strong> ${escapeHtml(item.description)}</p>
    <p><a href="mailto:${escapeAttr(item.contact)}">Contact ${escapeHtml(item.contact)}</a></p>
  `;
  showModal({ title: item.name, content, onClose: () => {} });
}

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function setFavorites(arr) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr)); }
function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) favs.push(id);
  else favs.splice(idx, 1);
  setFavorites(favs);
}
function showOnlyFavorites() {
  const favs = getFavorites();
  if (!favs.length) {
    alert('No favorites saved yet.');
    return;
  }
  fetchServices(SERVICES_JSON).then(all => {
    const filtered = all.filter(s => favs.includes(s.id));
    renderServiceCards(filtered);
    lazyInit();
  }).catch(err => {
    console.error(err);
    alert('Could not load services.');
  });
}
function clearFavorites() {
  if (!confirm('Clear all favorites?')) return;
  setFavorites([]);
  loadAndRenderServices();
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, function (m) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]);
  });
}
function escapeAttr(str = '') {
  return encodeURIComponent(String(str));
}
