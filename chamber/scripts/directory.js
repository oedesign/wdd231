// Dark Mode Toggle
(function(){
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    const storageKey = 'ikd-theme';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem(storageKey);

    const apply = (theme) => {
        if(theme === 'dark') document.body.classList.add('dark');
        else document.body.classList.remove('dark');
        btn.setAttribute('aria-pressed', String(theme === 'dark'));
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    };

    const initial = saved || (prefersDark ? 'dark' : 'light');
    apply(initial);

    btn.addEventListener('click', () => {
        const next = document.body.classList.contains('dark') ? 'light' : 'dark';
        apply(next);
        localStorage.setItem(storageKey, next);
    });
})();


// Function to handle the click event on the hamburger menu
const hamburger = document.getElementById("harmburger");
const navigation = document.getElementById("navigation");

hamburger.addEventListener("click", () => {
    navigation.classList.toggle("show");

// Toggle hamburger icon to X and back
if (navigation.classList.contains("show")) {
    hamburger.innerHTML = "✖";
    } else {
    hamburger.innerHTML = "☰";
    }
});

// Footer: Current Year and Last Modified Date
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastmodified').textContent = document.lastModified;


// FETCH MEMBERS
async function loadMembers() {
    try {
        const response = await fetch("data/members.json");
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error("Error loading members:", error);
    }
}

function displayMembers(members) {
    const container = document.getElementById("members-container");
    container.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("member-card");

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank">Visit Website</a>
            <p>Membership Level: ${member.membership}</p>
        `;

        container.appendChild(card);
    });
}

loadMembers();


// GRID / LIST TOGGLE
document.getElementById("gridView").addEventListener("click", () => {
    document.getElementById("members-container").classList.add("grid");
    document.getElementById("members-container").classList.remove("list");
});

document.getElementById("listView").addEventListener("click", () => {
    document.getElementById("members-container").classList.add("list");
    document.getElementById("members-container").classList.remove("grid");
});
