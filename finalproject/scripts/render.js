// render.js - responsible for rendering cards, filter, favorites and wiring events
import { openModal } from './modal.js';
import { saveFavorite, removeFavorite, getFavorites } from './localstorage.js';
import { fetchPrograms, getCategories } from './dataModule.js';

const cardsRoot = document.getElementById('cards');

export function populateFilter(categories) {
  const sel = document.getElementById('filter');
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    sel.appendChild(opt);
  });
}

export function renderPrograms(programs) {
  if (!cardsRoot) return;
  if (!programs || programs.length === 0) {
    cardsRoot.innerHTML = '<p>No results.</p>';
    return;
  }
  // use map & template literals
  cardsRoot.innerHTML = programs.map(p => cardHTML(p)).join('');

  // attach event listeners for modal & save
  cardsRoot.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('.view-btn').addEventListener('click', async (e) => {
      const all = await fetchPrograms();
      const prog = all.find(x => x.id === id);
      if (prog) openModal(prog);
    });

    const saveBtn = card.querySelector('.save-btn');
    saveBtn.addEventListener('click', (e) => {
      const favs = getFavorites();
      if (favs.includes(id)) {
        removeFavorite(id);
        saveBtn.textContent = 'Save';
        saveBtn.classList.remove('primary');
      } else {
        saveFavorite(id);
        saveBtn.textContent = 'Saved';
        saveBtn.classList.add('primary');
      }
      renderFavorites(getFavorites(), null); // second param optional; fetch inside will ensure render
    });
  });
}

// helper to render favorite list
export function renderFavorites(ids = [], allData = null) {
  // if no allData provided, fetch it
  (async () => {
    let data = allData;
    if (!data) data = await fetchPrograms();
    const list = document.getElementById('favorites-list');
    if (!list) return;
    if (!ids || ids.length === 0) {
      list.innerHTML = '<li>No saved favorites yet.</li>';
      return;
    }
    const items = ids.map(id => {
      const p = data.find(d => d.id === id);
      if (!p) return '';
      return `<li><strong>${escapeHtml(p.name)}</strong> <button class="btn remove" data-id="${p.id}" aria-label="Remove ${escapeHtml(p.name)}">Remove</button></li>`;
    }).join('');
    list.innerHTML = items;

    // wire remove buttons
    list.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        removeFavorite(id);
        renderFavorites(getFavorites(), data);
        // update any visible save buttons
        const saveBtn = document.querySelector(`.card[data-id="${id}"] .save-btn`);
        if (saveBtn) {
          saveBtn.textContent = 'Save';
          saveBtn.classList.remove('primary');
        }
      });
    });
  })();
}

function cardHTML(p) {
  const favs = getFavorites();
  const saved = favs.includes(p.id);
  return `
    <article class="card" data-id="${p.id}" tabindex="0" aria-labelledby="card-${p.id}-title">
      <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" width="160" height="120"/>
      <div>
        <h3 id="card-${p.id}-title">${escapeHtml(p.name)}</h3>
        <p><strong>${escapeHtml(p.category)}</strong> · ${escapeHtml(p.address)}</p>
        <p>${escapeHtml(p.hours)}</p>
        <div style="margin-top:.5rem">
          <button class="btn view-btn" aria-label="View details for ${escapeHtml(p.name)}">Details</button>
          <button class="btn save-btn ${saved ? 'primary' : ''}" aria-pressed="${saved}" data-id="${p.id}">${saved ? 'Saved' : 'Save'}</button>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m];
  });
}

// auto-export default rendering on import if DOM present
if (typeof document !== 'undefined' && document.readyState !== 'loading') {
  // nothing: pages will call renderPrograms explicitly after fetch
}
