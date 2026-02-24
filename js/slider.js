import { db, ref, onValue } from "./firebase.js";

const sliderContainer = document.getElementById("slider-container");
let currentIndex = 0;
let slides = [];

if (sliderContainer) {
    onValue(ref(db, "sliders"), (snapshot) => {
        sliderContainer.innerHTML = "";
        slides = [];
        snapshot.forEach(child => {
            const div = document.createElement("div");
            div.className = "slide";
            div.innerHTML = `<img src="${child.val().imageUrl}" alt="slider">`;
            sliderContainer.appendChild(div);
            slides.push(div);
        });
        if (slides.length > 0) {
            slides[0].classList.add("active");
            startSlider();
        }
    });
}

function startSlider() {
    setInterval(() => {
        if(slides.length < 2) return;
        slides[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add("active");
    }, 3000);
}
