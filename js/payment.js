import { db, ref, onValue, push } from "./firebase.js";

const upiMethodsContainer = document.getElementById("upi-methods");
const confirmOrderBtn = document.getElementById("confirm-order-btn");
const codRadio = document.getElementById("cod-radio");
const paymentLinkSection = document.getElementById("payment-link-section");
const externalPaymentLink = document.getElementById("external-payment-link");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let address = JSON.parse(localStorage.getItem("userAddress"));
let finalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
let canCod = cart.every(item => item.cod !== false);
let globalPaymentLink = "";

if(document.getElementById("pay-total")) {
    document.getElementById("pay-total").innerText = finalAmount;
}

if(!canCod) {
    codRadio.disabled = true;
    codRadio.parentElement.style.color = "#ccc";
    codRadio.parentElement.innerHTML += ` <span style="font-size:12px;color:red;">(Unavailable for some items)</span>`;
}

// Fetch Global Payment Link
onValue(ref(db, "paymentLink"), (snapshot) => {
    if(snapshot.exists()) {
        globalPaymentLink = snapshot.val().url;
        externalPaymentLink.href = globalPaymentLink;
    }
});

// Toggle Payment Link Visibility
function togglePaymentLink() {
    const selected = document.querySelector('input[name="payment"]:checked');
    if(selected && selected.value !== "Cash on Delivery" && globalPaymentLink !== "") {
        paymentLinkSection.style.display = "block";
        confirmOrderBtn.innerText = "Confirm Order";
    } else {
        paymentLinkSection.style.display = "none";
        confirmOrderBtn.innerText = "Place Order";
    }
}

// Listen for Payment Method Change
document.body.addEventListener("change", (e) => {
    if(e.target.name === "payment") {
        togglePaymentLink();
    }
});

if(upiMethodsContainer) {
    onValue(ref(db, "paymentMethods"), (snapshot) => {
        upiMethodsContainer.innerHTML = "";
        snapshot.forEach(child => {
            const method = child.val();
            upiMethodsContainer.innerHTML += `
                <div class="payment-option">
                    <label><input type="radio" name="payment" value="${method.name}"> ${method.name} (UPI)</label>
                </div>
            `;
        });
        
        if(!canCod) {
            const firstRadio = document.querySelector('input[name="payment"]:not(:disabled)');
            if(firstRadio) firstRadio.checked = true;
        }
        
        togglePaymentLink(); // Initial check
    });
}

if(confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", () => {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if(!selectedPayment) {
            alert("Please select a payment method."); return;
        }

        const orderData = {
            customer: address,
            products: cart,
            amount: finalAmount,
            paymentMethod: selectedPayment.value,
            status: "Pending",
            date: new Date().toISOString()
        };

        confirmOrderBtn.disabled = true;
        confirmOrderBtn.innerText = "Processing...";

        push(ref(db, "orders"), orderData).then(() => {
            document.getElementById("success-popup").style.display = "flex";
            localStorage.removeItem("cart");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        });
    });
}
