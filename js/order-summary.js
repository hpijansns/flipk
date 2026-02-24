import { db, ref, get } from "./firebase.js";

const summaryAddress = document.getElementById("summary-address");
const summaryItems = document.getElementById("summary-items");
const continuePaymentBtn = document.getElementById("continue-payment-btn");

let totalMrp = 0;
let totalPrice = 0;
let totalItems = 0;
let couponDiscount = 0;



function renderSummary(){

const address = JSON.parse(localStorage.getItem("userAddress"));
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if(!address || cart.length === 0){
window.location.href="cart.html";
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


/* RESET */

summaryItems.innerHTML="";
totalMrp = 0;
totalPrice = 0;
totalItems = 0;


/* ITEMS */

cart.forEach(item=>{

const price = Number(item.price) || 0;
const mrp = Number(item.mrp) || price;
const qty = Number(item.qty) || 1;

totalMrp += mrp * qty;
totalPrice += price * qty;
totalItems += qty;

summaryItems.innerHTML += `

<div class="card cart-item" style="display:flex;gap:10px;padding:10px">

<img src="${item.image || item.mainImage}" 
style="width:70px;height:70px;object-fit:cover">

<div>

<div class="prod-title">${item.title}</div>

<div class="prod-price">₹${price}</div>

<div>Qty: ${qty}</div>

</div>

</div>

`;

});

updateTotals();

}



function updateTotals(){

const discount = totalMrp - totalPrice;
const finalTotal = totalPrice - couponDiscount;

const itemsEl = document.getElementById("sum-items");
const mrpEl = document.getElementById("sum-mrp");
const discEl = document.getElementById("sum-discount");
const finalEl = document.getElementById("final-total");
const bottomEl = document.getElementById("bottom-total");

if(itemsEl) itemsEl.innerText = totalItems;

if(mrpEl) mrpEl.innerText = "₹" + totalMrp;

if(discEl) discEl.innerText = "- ₹" + (discount + couponDiscount);

if(finalEl) finalEl.innerText = "₹" + finalTotal;

if(bottomEl) bottomEl.innerText = finalTotal;

}



/* APPLY COUPON */

const applyBtn = document.getElementById("apply-coupon");

if(applyBtn){

applyBtn.onclick = async ()=>{

const code =
document.getElementById("coupon-input").value.trim().toUpperCase();

const snap = await get(ref(db,"coupons/"+code));

if(!snap.exists()){

document.getElementById("coupon-msg").innerText =
"Invalid Coupon";

return;

}

const data = snap.val();

if(totalPrice < data.minOrder){

document.getElementById("coupon-msg").innerText =
"Minimum order ₹"+data.minOrder;

return;

}

if(data.discount){
couponDiscount = Number(data.discount);
}

if(data.percent){
couponDiscount = Math.floor(totalPrice * Number(data.percent) / 100);
}

document.getElementById("coupon-msg").innerText =
"Coupon Applied";

updateTotals();

};

}



/* CONTINUE PAYMENT */

if(continuePaymentBtn){
continuePaymentBtn.onclick = ()=>{
window.location.href="payment.html";
};
}



renderSummary();
