// dataModule.js - fetch local JSON data, expose helper functions
export async function fetchPrograms() {
  try {
    const res = await fetch('data/data.json', {cache: "no-store"});
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    // ensure at least 15 items
    if (!Array.isArray(data) || data.length < 15) {
      console.warn('Data length is less than 15; continuing anyway.');
    }
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}

export function getCategories(data) {
  const cats = Array.from(new Set(data.map(d => d.category)));
  return cats;
}
