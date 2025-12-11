// scripts/data.js
// ES module that fetches local JSON data and exports helper functions.

/**
 * This function performs an asynchronous fetch request to retrieve services data from a specified JSON file.
 * It disables caching with the "no-store" cache option to ensure fresh data on each call.
 * If the response status is not OK, it throws an error with the status code and status text.
 * The function safely extracts the services array from the response data, returning an empty array if the data structure is invalid.
 * Any errors encountered during the fetch or parsing are logged to the console and re-thrown for caller handling.
 */
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
