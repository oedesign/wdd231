// hamgurger menu for small screen view
const hamburger = document.getElementById("hamburger");
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


// Text Automatic display

