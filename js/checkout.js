const summaryAddress = document.getElementById("summary-address");
const summaryItems = document.getElementById("summary-items");
const continuePaymentBtn = document.getElementById("continue-payment-btn");

function renderSummary() {
    const address = JSON.parse(localStorage.getItem("userAddress"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(!address || cart.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    summaryAddress.innerHTML = `<h3>Deliver to:</h3><b>${address.fullName}</b><br>${address.house}, ${address.area}, ${address.city}, ${address.state} - ${address.pincode}<br>${address.mobile}`;

    let totalMrp = 0, totalPrice = 0, totalItems = 0;
    summaryItems.innerHTML = "";

    cart.forEach((item) => {
        totalMrp += item.mrp * item.qty;
        totalPrice += item.price * item.qty;
        totalItems += item.qty;

        summaryItems.innerHTML += `
            <div class="card cart-item" style="border:none;margin:0;box-shadow:none;border-bottom:1px solid #eee;">
                <img src="${item.mainImage}">
                <div>
                    <div class="prod-title">${item.title}</div>
                    <div class="prod-price">₹${item.price}</div>
                    <div>Qty: ${item.qty}</div>
                </div>
            </div>
        `;
    });

    document.getElementById("sum-items").innerText = totalItems;
    document.getElementById("sum-mrp").innerText = `₹${totalMrp}`;
    document.getElementById("sum-discount").innerText = `- ₹${totalMrp - totalPrice}`;
    document.getElementById("sum-total").innerText = `₹${totalPrice}`;
    document.getElementById("bottom-sum-total").innerText = totalPrice;
}

if(continuePaymentBtn) {
    continuePaymentBtn.addEventListener("click", () => {
        window.location.href = "payment.html";
    });
}

renderSummary();
