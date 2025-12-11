// scripts/modal.js
// Accessible Modal creation and management. Exports showModal and closeModal.

export function showModal({title = '', content = '', onClose = () => {}} = {}) {
  const root = document.getElementById('modal-root');
  if (!root) return;

  // create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  // trap focus — simple implementation
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <header>
      <h2 style="margin:0;font-family:Georgia, serif;">${escapeHtml(title)}</h2>
      <button class="close" aria-label="Close modal">&times;</button>
    </header>
    <div class="modal-body">${content}</div>
  `;

  backdrop.appendChild(modal);
  root.innerHTML = '';
  root.appendChild(backdrop);
  root.setAttribute('aria-hidden', 'false');

  // focus management
  const closeButton = modal.querySelector('.close');
  closeButton.focus();

  function cleanup() {
    root.innerHTML = '';
    root.setAttribute('aria-hidden', 'true');
    onClose();
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) cleanup();
  });
  closeButton.addEventListener('click', cleanup);
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') {
      cleanup();
      document.removeEventListener('keydown', esc);
    }
  }, {once: true});
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
