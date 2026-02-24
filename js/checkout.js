const summaryAddress = document.getElementById("summary-address");
const summaryItems = document.getElementById("summary-items");
const continuePaymentBtn = document.getElementById("continue-payment-btn");

function renderSummary() {

    const address = JSON.parse(localStorage.getItem("userAddress"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!address || cart.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    /* ADDRESS */

    summaryAddress.innerHTML = `
        <h3>Deliver to:</h3>
        <b>${address.fullName}</b><br>
        ${address.house}, ${address.area}<br>
        ${address.city}, ${address.state} - ${address.pincode}<br>
        ${address.mobile}
    `;

    /* ITEMS */

    let totalMrp = 0;
    let totalPrice = 0;
    let totalItems = 0;

    summaryItems.innerHTML = "";

    cart.forEach((item) => {

        totalMrp += item.mrp * item.qty;
        totalPrice += item.price * item.qty;
        totalItems += item.qty;

        summaryItems.innerHTML += `
        <div class="card cart-item" style="border:none;margin:0;box-shadow:none;border-bottom:1px solid #eee;display:flex;gap:10px;padding:10px 0;">

            <img src="${item.image || item.mainImage}" style="width:70px;height:70px;object-fit:cover;">

            <div>

                <div class="prod-title">${item.title}</div>

                <div class="prod-price">₹${item.price}</div>

                <div>Qty: ${item.qty}</div>

            </div>

        </div>
        `;
    });

    /* SUMMARY */

    const discount = totalMrp - totalPrice;

    document.getElementById("sum-items").innerText = totalItems;
    document.getElementById("sum-mrp").innerText = "₹" + totalMrp;
    document.getElementById("sum-price").innerText = "₹" + totalPrice;
    document.getElementById("sum-discount").innerText = "₹" + discount;
}


/* BUTTON */

if (continuePaymentBtn) {

    continuePaymentBtn.addEventListener("click", () => {

        window.location.href = "payment.html";

    });

}


/* LOAD */

renderSummary();
