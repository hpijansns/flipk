import { db, ref, onValue } from "./firebase.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const detailsDiv = document.getElementById("product-details");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const buyNowBtn = document.getElementById("buy-now-btn");

let currentProduct = null;

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}
updateCartCount();

if (productId) {
    onValue(ref(db, `products/${productId}`), (snapshot) => {
        currentProduct = snapshot.val();
        if(!currentProduct) return;
        currentProduct.id = productId;

        const disc = Math.round(((currentProduct.mrp - currentProduct.price) / currentProduct.mrp) * 100);
        let galleryHtml = `<div class="gallery-container"><img src="${currentProduct.mainImage}">`;
        if(currentProduct.gallery) {
            currentProduct.gallery.forEach(img => {
                galleryHtml += `<img src="${img}">`;
            });
        }
        galleryHtml += `</div>`;

        let codHtml = currentProduct.cod ? "" : `<div class="cod-msg">Cash on Delivery is currently unavailable for this item.</div>`;

        detailsDiv.innerHTML = `
            ${galleryHtml}
            <div class="prod-details-sec">
                <h1>${currentProduct.title}</h1>
                <div class="prod-price">₹${currentProduct.price}</div>
                <div class="prod-mrp">₹${currentProduct.mrp} <span class="prod-disc">${disc}% off</span></div>
                ${codHtml}
            </div>
        `;
    });
}

function addToCart(redirect = false) {
    if(!currentProduct) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existing = cart.find(item => item.id === productId);
    if(existing) existing.qty += 1;
    else cart.push({ ...currentProduct, qty: 1 });
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    if(redirect) window.location.href = "cart.html";
    else alert("Added to cart!");
}

if(addToCartBtn) addToCartBtn.addEventListener("click", () => addToCart(false));
if(buyNowBtn) buyNowBtn.addEventListener("click", () => addToCart(true));
