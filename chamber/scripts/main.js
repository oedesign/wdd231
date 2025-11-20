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
