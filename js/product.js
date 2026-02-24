import { db, ref, onValue } from "./firebase.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const detailsDiv = document.getElementById("product-details");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const buyNowBtn = document.getElementById("buy-now-btn");

let currentProduct = null;


/* CART COUNT */

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.qty, 0);

    const el = document.getElementById("cart-count");
    if(el) el.innerText = total;
}

updateCartCount();


/* LOAD PRODUCT */

if (productId) {
    onValue(ref(db, `products/${productId}`), (snapshot) => {

        currentProduct = snapshot.val();
        if (!currentProduct) return;

        currentProduct.id = productId;

        const discount = Math.round(
            ((currentProduct.mrp - currentProduct.price) / currentProduct.mrp) * 100
        );

        let galleryHtml = `
        <div class="gallery-container">
            <img src="${currentProduct.mainImage}" class="main-img">
        `;

        if (currentProduct.gallery && currentProduct.gallery.length) {
            currentProduct.gallery.forEach((img) => {
                galleryHtml += `<img src="${img}" class="thumb">`;
            });
        }

        galleryHtml += `</div>`;

        let codHtml = currentProduct.cod
            ? ""
            : `<div class="cod-msg">Cash on Delivery not available</div>`;

        detailsDiv.innerHTML = `
            ${galleryHtml}

            <div class="prod-details-sec">

                <h1>${currentProduct.title}</h1>

                <div class="prod-price">₹${currentProduct.price}</div>

                <div class="prod-mrp">
                    ₹${currentProduct.mrp}
                    <span class="prod-disc">${discount}% off</span>
                </div>

                ${codHtml}

            </div>
        `;
    });
}



/* ADD TO CART */

function addToCart(redirect = false) {

    if (!currentProduct) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find((item) => item.id === productId);

    if (existing) {
        existing.qty += 1;
    } else {

        cart.push({
            id: productId,
            title: currentProduct.title,
            price: currentProduct.price,
            mrp: currentProduct.mrp,
            image: currentProduct.mainImage || "",
            qty: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    if (redirect) {
        window.location.href = "cart.html";
    } else {
        alert("Added to cart");
    }
}


/* BUTTON EVENTS */

if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => addToCart(false));
}

if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => addToCart(true));
}
