const cartContainer = document.getElementById("cart-items");
const priceCard = document.getElementById("price-details-card");
const footer = document.getElementById("cart-footer");

const totalItemsEl = document.getElementById("total-items");
const cartMrpEl = document.getElementById("cart-mrp");
const cartDiscountEl = document.getElementById("cart-discount");
const cartTotalEl = document.getElementById("cart-total");
const bottomTotalEl = document.getElementById("bottom-total");

const placeOrderBtn = document.getElementById("place-order-btn");


function renderCart() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {

        cartContainer.innerHTML = `
        <div style="text-align:center;padding:40px">
            <h2>Your Cart is Empty</h2>
        </div>
        `;

        priceCard.style.display = "none";
        footer.style.display = "none";

        return;
    }

    let totalMrp = 0;
    let totalPrice = 0;
    let totalItems = 0;

    cartContainer.innerHTML = "";

    cart.forEach((item, index) => {

        totalMrp += item.mrp * item.qty;
        totalPrice += item.price * item.qty;
        totalItems += item.qty;

        cartContainer.innerHTML += `
        <div class="cart-item card">

            <img src="${item.image || item.mainImage}" />

            <div class="cart-info">

                <div class="cart-title">${item.title}</div>

                <div class="cart-price">₹${item.price}</div>

                <div class="qty-box">

                    <button onclick="changeQty(${index},-1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index},1)">+</button>

                </div>

                <button onclick="removeItem(${index})" class="remove-btn">
                    Remove
                </button>

            </div>

        </div>
        `;
    });

    const discount = totalMrp - totalPrice;

    totalItemsEl.innerText = totalItems;
    cartMrpEl.innerText = "₹" + totalMrp;
    cartDiscountEl.innerText = "- ₹" + discount;
    cartTotalEl.innerText = "₹" + totalPrice;
    bottomTotalEl.innerText = totalPrice;

    priceCard.style.display = "block";
    footer.style.display = "flex";
}



window.changeQty = function(index, change) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
};



window.removeItem = function(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
};



placeOrderBtn.addEventListener("click", () => {

    window.location.href = "address.html";

});


renderCart();
