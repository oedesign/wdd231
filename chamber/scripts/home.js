/* weather.js
   Uses only free OpenWeatherMap endpoints:
   - Current Weather Data: https://api.openweathermap.org/data/2.5/weather
   - 5 Day / 3 Hour Forecast: https://api.openweathermap.org/data/2.5/forecast

   Outputs:
   - current temperature & description
   - 3-day forecast (today + next 2 days) aggregated from the 3-hour steps
*/

(async function() {
  const API_KEY = "6e6783d0b3de581a7b6837f752f45edc"; // 
  const LOCATION = "Ikorodu, Lagos, NG";
  const UNITS = "metric"; // 'metric' = °C, 'imperial' = °F

  const elLocation = document.getElementById("location-name");
  const elTemp = document.getElementById("current-temp");
  const elDesc = document.getElementById("current-desc");
  const elDetails = document.getElementById("current-details");
  const elForecast = document.getElementById("forecast");

  function formatDayLocal(unixSeconds, tzOffsetSeconds) {
    // tzOffsetSeconds is seconds offset from UTC (may be + or -)
    const localMs = (unixSeconds + (tzOffsetSeconds || 0)) * 1000;
    const d = new Date(localMs);
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  function toYMD(unixSeconds, tzOffsetSeconds) {
    const localMs = (unixSeconds + (tzOffsetSeconds || 0)) * 1000;
    const d = new Date(localMs);
    const y = d.getUTCFullYear();
    // use UTC methods because we already applied tz offset
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function showError(msg) {
    elLocation.textContent = "Unavailable";
    elTemp.textContent = "--";
    elDesc.textContent = msg || "No data";
    elDetails.textContent = "";
    elForecast.innerHTML = "<p class='small'>No forecast available.</p>";
    console.error("Weather error:", msg);
  }

  try {
    // 1) Geocode to get lat/lon using the free geocoding endpoint
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(LOCATION)}&limit=1&appid=${API_KEY}`;
    const geoResp = await fetch(geoUrl);
    if (!geoResp.ok) {
      if (geoResp.status === 401) throw new Error("Invalid API key (401). Check your OpenWeatherMap key.");
      throw new Error(`Geocoding failed (${geoResp.status})`);
    }
    const geoJson = await geoResp.json();
    if (!Array.isArray(geoJson) || geoJson.length === 0) throw new Error("Location not found from geocoding.");

    const { lat, lon, name, state, country } = geoJson[0];
    const prettyName = [name, state, country].filter(Boolean).join(", ") || LOCATION;
    elLocation.textContent = prettyName;

    // 2) Fetch current weather (free collection)
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${API_KEY}`;
    const curResp = await fetch(currentUrl);
    if (!curResp.ok) {
      if (curResp.status === 401) throw new Error("Invalid API key (401). Check your OpenWeatherMap key.");
      throw new Error(`Current weather request failed (${curResp.status})`);
    }
    const curJson = await curResp.json();

    // Safe access to current values
    const curTemp = (curJson && typeof curJson.main?.temp === "number") ? Math.round(curJson.main.temp) : null;
    const curDesc = (curJson && curJson.weather && curJson.weather[0] && curJson.weather[0].description) ? curJson.weather[0].description : null;
    const curHumidity = curJson?.main?.humidity ?? null;
    const curWind = curJson?.wind?.speed ?? null;

    elTemp.textContent = curTemp != null ? `${curTemp}°${UNITS === "metric" ? "C" : "F"}` : "--";
    elDesc.textContent = curDesc ? curDesc : "No description";
    elDetails.textContent = `Humidity: ${curHumidity != null ? curHumidity + "%" : "N/A"} · Wind: ${curWind != null ? curWind + (UNITS === "metric" ? " m/s" : " mph") : "N/A"}`;

    // 3) Fetch 5-day / 3-hour forecast (free collection)
    const fcUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${API_KEY}`;
    const fcResp = await fetch(fcUrl);
    if (!fcResp.ok) {
      if (fcResp.status === 401) throw new Error("Invalid API key (401). Check your OpenWeatherMap key.");
      throw new Error(`Forecast request failed (${fcResp.status})`);
    }
    const fcJson = await fcResp.json();

    // The forecast includes: list[] each with dt (UTC), main.temp, main.temp_min/max, weather[], and city.timezone (offset in seconds)
    const tzOffset = fcJson?.city?.timezone ?? 0; // seconds
    const list = Array.isArray(fcJson?.list) ? fcJson.list : [];

    if (list.length === 0) {
      elForecast.innerHTML = "<p class='small'>No forecast data available.</p>";
      return;
    }

    // 4) Group forecast items by local date (YYYY-MM-DD) using timezone offset from city
    const groups = {}; // { 'YYYY-MM-DD': [items...] }
    for (const item of list) {
      const key = toYMD(item.dt, tzOffset);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    // Determine today's local date and the next 2 dates
    // Use the timezone offset applied to now (UTC seconds + tzOffset)
    const nowUtcSec = Math.floor(Date.now() / 1000);
    const todayKey = toYMD(nowUtcSec, tzOffset);

    // build the array of date keys to show: today, next1, next2
    const dateKeys = [todayKey];
    // create Date object from today's YMD then add days to generate keys
    const [y, m, d] = todayKey.split("-").map(Number);
    for (let i = 1; i <= 2; i++) {
      const nextDate = new Date(Date.UTC(y, m - 1, d + i)); // UTC date adjusted
      // convert nextDate into key string by computing its UTC timestamp minus tzOffset (so toYMD works)
      // simpler: compute unix seconds for nextDate at 00:00 local and then call toYMD
      // but easiest: add i*86400 to nowUtcSec and compute key
      const nextKey = toYMD(nowUtcSec + i * 86400, tzOffset);
      dateKeys.push(nextKey);
    }

    // 5) Aggregate each day's grouped items into a single card: dayLabel, avg/day temp, max, min, description (most frequent)
    elForecast.innerHTML = "";
    for (const key of dateKeys) {
      const items = groups[key] || [];
      if (items.length === 0) {
        // no data for that day (possible near end of 5-day window)
        const label = formatDayLocal((new Date(key + "T00:00:00Z").getTime() / 1000) - tzOffset, tzOffset);
        const card = document.createElement("div");
        card.className = "forecast-day";
        card.innerHTML = `<div class="label">${label}</div><div class="temp">--</div><div class="small">No data</div>`;
        elForecast.appendChild(card);
        continue;
      }

      // compute min/max and average/day temp
      let sumTemp = 0, count = 0, min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
      const descCount = {};

      for (const it of items) {
        const t = it?.main?.temp;
        if (typeof t === "number") {
          sumTemp += t; count++;
          if (t < min) min = t;
          if (t > max) max = t;
        }
        const desc = it?.weather && it.weather[0] && it.weather[0].description ? it.weather[0].description : null;
        if (desc) descCount[desc] = (descCount[desc] || 0) + 1;
      }

      const avg = count ? Math.round(sumTemp / count) : null;
      const minR = isFinite(min) ? Math.round(min) : null;
      const maxR = isFinite(max) ? Math.round(max) : null;
      // pick most frequent description
      const mostDesc = Object.keys(descCount).length ? Object.entries(descCount).sort((a,b)=>b[1]-a[1])[0][0] : "";

      // label: pick the noon timestamp if available or the first item's dt
      const labelUnix = items[0].dt;
      const label = formatDayLocal(labelUnix, tzOffset);

      const card = document.createElement("div");
      card.className = "forecast-day";
      card.innerHTML = `
        <div class="label">${label}</div>
        <div class="temp">${avg != null ? avg + "°" : "--"}</div>
        <div class="small">High: ${maxR != null ? maxR + "°" : "--"} · Low: ${minR != null ? minR + "°" : "--"}</div>
        <div class="small" style="text-transform: capitalize;">${mostDesc}</div>
      `;
      elForecast.appendChild(card);
    }

  } catch (err) {
    // If API returns 401, or if the key is invalid, clarify that to the user (as requested)
    const message = err && err.message ? err.message : "Failed to load weather";
    // Common 401 message from fetch logic will be bubbled up
    showError(message + (message.includes("401") ? " — check API key or activate your key on OpenWeatherMap." : ""));
  }
})();


//  JS for Spotlight home page 
async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        const data = await response.json();

        const members = data.members;

        // Gold (3) or Silver (2) only
        const qualifiedMembers = members.filter(member =>
            member.membership === 3 || member.membership === 2
        );

        // Shuffle randomly
        const shuffled = qualifiedMembers.sort(() => Math.random() - 0.5);

        // Display 2 or 3 members
        const spotlightCount = Math.random() < 0.5 ? 2 : 3;
        const selected = shuffled.slice(0, spotlightCount);

        displaySpotlights(selected);

    } catch (error) {
        console.error("Error loading spotlights:", error);
    }
}

function displaySpotlights(members) {
    const container = document.getElementById("spotlight-container");
    container.innerHTML = "";

    const membershipNames = {
        1: "Bronze",
        2: "Silver",
        3: "Gold"
    };

    // Correct logo path from uploaded file
    const cardLogo = "images/ikd-logo.webp";

    members.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("spotlight-card");

        // ✔ Logo is placed at the top FIRST
        card.innerHTML = `
            <img src="${cardLogo}" alt="Chamber Logo" class="logo">

            <h2>${member.name}</h2>
            <p class="level">${membershipNames[member.membership]} Member</p>

            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Address:</strong> ${member.address}</p>

            <p><strong>Website:</strong> 
                <a href="${member.website}" target="_blank">${member.website}</a>
            </p>
        `;

        container.appendChild(card);
    });
}

loadSpotlights();


// Footer: Current Year and Last Modified Date
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastmodified').textContent = document.lastModified;
