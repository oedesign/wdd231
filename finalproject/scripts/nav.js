// nav.js - handles hamburger toggle and accessible nav
export function initNav() {
  const btns = document.querySelectorAll('#hamburger');
  const navs = document.querySelectorAll('#main-nav');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.getElementById('main-nav');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        nav.style.display = 'block';
        nav.querySelector('a')?.focus();
      } else {
        nav.style.display = '';
      }
    });
  });

  // Close nav on outside click for small screens
  document.addEventListener('click', (e) => {
    const nav = document.getElementById('main-nav');
    const btn = document.getElementById('hamburger');
    if (!nav || !btn) return;
    if (!nav.contains(e.target) && !btn.contains(e.target) && window.innerWidth < 800) {
      nav.style.display = '';
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// auto init if imported directly
if (typeof window !== 'undefined') {
  // Only auto-init when module loaded as main in page context via import
  // but we leave control to importing pages
}
