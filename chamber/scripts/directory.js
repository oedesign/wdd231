// DARK MODE
(function() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const storageKey = 'ikd-theme';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem(storageKey);

    const apply = (theme) => {
        document.body.classList.toggle('dark', theme === 'dark');
        btn.setAttribute('aria-pressed', theme === 'dark');
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    };

    apply(saved || (prefersDark ? 'dark' : 'light'));

    btn.addEventListener('click', () => {
        const next = document.body.classList.contains('dark') ? 'light' : 'dark';
        apply(next);
        localStorage.setItem(storageKey, next);
    });
})();


// MOBILE MENU
const hamburger = document.getElementById("harmburger");
const navigation = document.getElementById("navigation");

hamburger.addEventListener("click", () => {
    navigation.classList.toggle("show");
    hamburger.textContent = navigation.classList.contains("show") ? "✖" : "☰";
});


// FOOTER
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastmodified').textContent = document.lastModified;
