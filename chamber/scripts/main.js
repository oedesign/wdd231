// scripts/main.js

// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById("hamburgerMenu");
const topNav = document.querySelector(".topNav");

hamburgerMenu.addEventListener("click", () => {
topNav.style.display = (topNav.style.display === "block") ? "none" : "block";
});


// grid - list toggle

const gridbutton = document.querySelector("#gridView");
const listbutton = document.querySelector("#listView");
const display = document.querySelector("article");

// The following code could be written cleaner. How? We may have to simplfiy our HTMl and think about a default view.

gridbutton.addEventListener("click", () => {
	// example using arrow function
	display.classList.add("grid");
	display.classList.remove("list");
});

listbutton.addEventListener("click", showList); // example using defined function

function showList() {
	display.classList.add("list");
	display.classList.remove("grid");
}


// 

const membersContainer = document.querySelector("#membersContainer");
const gridBtn = document.querySelector("#gridView");
const listBtn = document.querySelector("#listView");

async function getMembers() {
    try {
        const response = await fetch("data/members.json");
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error("Error loading members:", error);
    }
}

function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("member-card");

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><a href="${member.website}" target="_blank">Visit Website</a></p>
            <p><strong>Membership:</strong> ${getMembershipName(member.membership)}</p>
            <p>${member.description}</p>
        `;

        membersContainer.appendChild(card);
    });
}

function getMembershipName(level) {
    if (level === 3) return "Gold";
    if (level === 2) return "Silver";
    return "Member";
}

// Toggle Views
gridBtn.addEventListener("click", () => {
    membersContainer.classList.add("grid");
    membersContainer.classList.remove("list");
});

listBtn.addEventListener("click", () => {
    membersContainer.classList.add("list");
    membersContainer.classList.remove("grid");
});

// Load members on page load
getMembers();



// Footer: Current Year and Last Modified Date
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastmodified').textContent = document.lastModified;


// JS HOME PAGE 

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
