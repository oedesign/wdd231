 const toggleIcon = document.getElementById('toggleIcon');
    const menu = document.querySelector('.nav-links');

    toggleIcon.addEventListener('click', () => {
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
        toggleIcon.textContent = '☰'; // Menu bar icon
      } else {
        menu.style.display = 'block';
        toggleIcon.textContent = '✖'; // Delete (close) icon
      }
    });