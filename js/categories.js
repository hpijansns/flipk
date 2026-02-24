import { db, ref, onValue } from "./firebase.js";

const categoriesContainer = document.getElementById("categories-container");

if (categoriesContainer) {
    onValue(ref(db, "categories"), (snapshot) => {
        categoriesContainer.innerHTML = "";
        snapshot.forEach(child => {
            const cat = child.val();
            const div = document.createElement("div");
            div.className = "cat-item";
            div.innerHTML = `
                <img src="${cat.imageUrl}" alt="${cat.name}">
                <span>${cat.name}</span>
            `;
            categoriesContainer.appendChild(div);
        });
    });
}
