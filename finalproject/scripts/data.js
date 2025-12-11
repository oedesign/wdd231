// scripts/data.js
// ES module that fetches local JSON data and exports helper functions.

export async function fetchServices(jsonPath = 'data/services.json') {
  try {
    const resp = await fetch(jsonPath, {cache: "no-store"});
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    // ensure array
    return Array.isArray(data.services) ? data.services : [];
  } catch (err) {
    console.error('Error fetching services:', err);
    throw err;
  }
}
