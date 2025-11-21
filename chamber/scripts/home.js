// WEATHER API
const apiKey = "6e6783d0b3de581a7b6837f752f45edc";
const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=Ikorodu,NG&units=metric&appid=${apiKey}`;

async function loadWeather() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    // Current weather
    const currentTemp = data.list[0].main.temp;
    const currentDesc = data.list[0].weather[0].description;

    document.getElementById("temp").textContent = Math.round(currentTemp);
    document.getElementById("description").textContent = currentDesc;

    // 3-Day Forecast
    const forecastContainer = document.getElementById("forecast-cards");
    forecastContainer.innerHTML = "";

    // Take forecast every 8 intervals (~24 hrs)
    for (let i = 7; i <= 24; i += 8) {
      const day = data.list[i];
      const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "long" });
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].description;

      const card = document.createElement("div");
      card.classList.add("forecast-card");
      card.innerHTML = `
        <p><strong>${date}</strong></p>
        <p>${temp}°C</p>
        <p>${desc}</p>
      `;
      forecastContainer.appendChild(card);
    }
  } catch (error) {
    console.error("Weather error:", error);
  }
}

loadWeather();


// SPOTLIGHTS
async function loadSpotlights() {
  const response = await fetch("data/members.json");
  const members = await response.json();

  const goldSilver = members.filter(m => m.membership === "Gold" || m.membership === "Silver");

  // Shuffle
  const shuffled = goldSilver.sort(() => 0.5 - Math.random());

  // Choose 2 or 3 members
  const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);

  const container = document.getElementById("spotlight-container");
  container.innerHTML = "";

  selected.forEach(member => {
    const card = document.createElement("div");
    card.classList.add("spotlight-card");

    card.innerHTML = `
      <img src="${member.logo}" alt="${member.name} logo">
      <h3>${member.name}</h3>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Address:</strong> ${member.address}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
      <p><strong>Membership:</strong> ${member.membership}</p>
    `;

    container.appendChild(card);
  });
}

loadSpotlights();


// Footer: Current Year and Last Modified Date
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastmodified').textContent = document.lastModified;
