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

    // 

    //  Get current year
const year = new Date().getFullYear();

// Insert into span
document.getElementById("currentyear").textContent = year;

// Get the last modified date of the document
let lastmodification = document.lastModified

// Display it inside the paragraph
document.getElementById("lastModified").textContent = 
"This page was last modified on: " + lastmodification;

// Styling the lastModified element
document.getElementById("lastModified").style.color = "black";


const variableName = document.lastModified; // Get the last modified date of the document
// console.log('This page was last modified on: ' + variableName); // Print the last modified date to the console
document.getElementById('').textContent = 'Last Modified: ' + variableName; // Optionally set the text of an element with id 'last-modified'