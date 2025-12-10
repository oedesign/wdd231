// modal.js - accessible modal creation and management
export function initModal() {
  // nothing to init here yet; modal root used by render
}

export function openModal(program) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = '';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.tabIndex = -1;

  modal.innerHTML = `
    <button class="close-modal" aria-label="Close dialog" style="float:right">✕</button>
    <div class="media">
      <img src="${program.image}" alt="${escapeHtml(program.name)} image" loading="lazy"/>
      <div>
        <h3>${escapeHtml(program.name)}</h3>
        <p><strong>Category:</strong> ${escapeHtml(program.category)}</p>
        <p><strong>Address:</strong> ${escapeHtml(program.address)}</p>
        <p><strong>Hours:</strong> ${escapeHtml(program.hours)}</p>
        <p>${escapeHtml(program.description)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(program.contact)}</p>
        <div class="actions">
          <button id="saveFav" class="btn">Save</button>
          <a class="btn primary" href="donate.html?prefill=${encodeURIComponent(program.name)}#video">Donate / Help</a>
        </div>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  modalRoot.appendChild(overlay);
  modalRoot.setAttribute('aria-hidden','false');

  // focus management
  const closeBtn = overlay.querySelector('.close-modal');
  closeBtn.focus();

  // close handlers
  function close() {
    modalRoot.innerHTML = '';
    modalRoot.setAttribute('aria-hidden','true');
  }
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', esc);
    }
  });

  // save favorite wired up by render module (event delegation)
}

// small escape helper
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m];
  });
}
