import { db, ref, onValue } from "./firebase.js";

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
let allProducts = [];

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countEl = document.getElementById("cart-count");
    if(countEl) countEl.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderProducts(products) {
    if(!productGrid) return;
    productGrid.innerHTML = "";
    products.forEach(p => {
        const disc = Math.round(((p.mrp - p.price) / p.mrp) * 100);
        const card = document.createElement("a");
        card.href = `product.html?id=${p.id}`;
        card.className = "prod-card";
        card.innerHTML = `
            <img src="${p.mainImage}" alt="${p.title}">
            <div class="prod-title">${p.title}</div>
            <div class="prod-price">₹${p.price}</div>
            <div class="prod-mrp">₹${p.mrp} <span class="prod-disc">${disc}% off</span></div>
        `;
        productGrid.appendChild(card);
    });
}

if(productGrid) {
    onValue(ref(db, "products"), (snapshot) => {
        allProducts = [];
        snapshot.forEach(child => {
            allProducts.push({ id: child.key, ...child.val() });
        });
        renderProducts(allProducts);
    });

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
        renderProducts(filtered);
    });
}

updateCartCount();
