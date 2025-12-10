// localstorage.js - favorites persistence
const KEY = 'ftn_favorites';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('localStorage read error', e);
    return [];
  }
}

export function saveFavorite(id) {
  const fav = getFavorites();
  if (!fav.includes(id)) fav.push(id);
  localStorage.setItem(KEY, JSON.stringify(fav));
}

export function removeFavorite(id) {
  const fav = getFavorites().filter(x => x !== id);
  localStorage.setItem(KEY, JSON.stringify(fav));
}
