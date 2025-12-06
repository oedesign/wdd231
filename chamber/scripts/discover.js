
// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById("hamburgerMenu");
const topNav = document.querySelector(".topNav");

hamburgerMenu.addEventListener("click", () => {
topNav.style.display = (topNav.style.display === "block") ? "none" : "block";
});

// js/discover.js
import { places } from '../data/items.mjs';

const grid = document.getElementById('placesGrid');
const visitMessageEl = document.getElementById('visitMessage');

function createCard(item, index){
  const card = document.createElement('article');
  card.className = `place-card ${item.id}`; // class matches grid-area names
  card.setAttribute('tabindex','0');
  card.setAttribute('aria-labelledby', `${item.id}-title`);

  // Title
  const h2 = document.createElement('h2');
  h2.id = `${item.id}-title`;
  h2.textContent = item.title;

  // Figure / image (wrap in figure tag)
  const figure = document.createElement('figure');
  figure.className = 'card-media';
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = `${item.title} — image`;
  img.loading = 'lazy'; // lazy loading
  img.width = 300; // hint
  img.height = 200;
  figure.appendChild(img);

  // address
  const addr = document.createElement('address');
  addr.className = 'address-small';
  addr.textContent = item.address;

  // description
  const p = document.createElement('p');
  p.textContent = item.description;

  // learn more button - could link to a details page
  const btn = document.createElement('a');
  btn.className = 'btn';
  btn.textContent = 'Learn More';
  btn.href = '#'; // replace with real link if available
  btn.setAttribute('role','button');

  // Append elements
  card.append(h2, figure, addr, p, btn);
  return card;
}

/* Build all cards from the imported JSON data */
function buildGrid(){
  // Clear existing.
  grid.innerHTML = '';
  places.forEach((place, i) => {
    const card = createCard(place, i);
    // ensure grid-area mapping class exists (item1..item8). items.mjs uses id=item1...
    grid.appendChild(card);
  });
}

/* localStorage visit message logic */
function updateVisitMessage(){
  const key = 'chamber-last-visit';
  const now = Date.now();
  const previous = localStorage.getItem(key);

  if(!previous){
    visitMessageEl.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    // calculate full days difference
    const prevMs = Number(previous);
    const diffMs = Math.abs(now - prevMs);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if(diffMs < (1000 * 60 * 60 * 24)){ // less than a day
      visitMessageEl.textContent = "Back so soon! Awesome!";
    } else {
      visitMessageEl.textContent = `You last visited ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago.`;
    }
  }

  // always update the stored last-visit time to now
  try{
    localStorage.setItem(key, String(now));
  } catch(e){
    // localStorage might be disabled — fail silently but log for dev
    console.warn('Could not store visit date:', e);
  }
}

/* Kick off */
document.addEventListener('DOMContentLoaded', () => {
  buildGrid();
  updateVisitMessage();
});
