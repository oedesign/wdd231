// scripts/modal.js

/**
 * Modal Component Script
 * ----------------------
 * Provides a reusable, accessible modal dialog system for the website.
 * Core responsibilities include:
 * - Rendering modal content dynamically with a title and body
 * - Managing open/close behavior using backdrop clicks, close buttons, and the Escape key
 * - Ensuring proper ARIA attributes for accessibility and keyboard navigation
 * - Allowing callback execution when a modal is closed
 *
 * This module delivers a clean and flexible modal experience that integrates
 * seamlessly with other UI components across the application.
 */


export function showModal({ title = '', content = '', onClose = () => {} } = {}) {
  const root = document.getElementById('modal-root');
  if (!root) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <header>
      <h2 style="margin:0;font-family:Georgia, serif;font-size:1.15rem;">${escapeHtml(title)}</h2>
      <button class="close" aria-label="Close modal">&times;</button>
    </header>
    <div class="modal-body">${content}</div>
  `;
  backdrop.appendChild(modal);
  root.innerHTML = '';
  root.appendChild(backdrop);
  root.setAttribute('aria-hidden', 'false');

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
  }, { once: true });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
