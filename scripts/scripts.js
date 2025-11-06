const toggleIcon = document.getElementById('toggleIcon');
const menu = document.querySelector('.nav-links');

toggleIcon.addEventListener('click', () => {
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
    toggleIcon.textContent = '☰'; // Menu bar icon
  } else {
    menu.style.display = 'block';
    toggleIcon.textContent = '✖'; // Close icon
  }
});

// Get current year
const year = new Date().getFullYear();
document.getElementById("currentyear").textContent = year;

// Get the last modified date of the document
const lastmodification = document.lastModified;
document.getElementById("lastModified").textContent =
  "This page was last modified on: " + lastmodification;
document.getElementById("lastModified").style.color = "black";
