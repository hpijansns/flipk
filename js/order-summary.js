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


/* ITEMS */

summaryItems.innerHTML="";

totalMrp = 0;
totalPrice = 0;
totalItems = 0;


cart.forEach(item=>{

totalMrp += item.mrp * item.qty;
totalPrice += item.price * item.qty;
totalItems += item.qty;

summaryItems.innerHTML += `

<div class="card cart-item" style="display:flex;gap:10px;padding:10px">

<img src="${item.image || item.mainImage}" 
style="width:70px;height:70px;object-fit:cover">

<div>

<div class="prod-title">${item.title}</div>

<div class="prod-price">₹${item.price}</div>

<div>Qty: ${item.qty}</div>

</div>

</div>

`;

});

updateTotals();

}



function updateTotals(){

const discount = totalMrp - totalPrice;

const finalTotal = totalPrice - couponDiscount;

document.getElementById("sum-items").innerText = totalItems;

document.getElementById("sum-mrp").innerText = "₹"+totalMrp;

document.getElementById("sum-discount").innerText =
"- ₹"+(discount + couponDiscount);

document.getElementById("final-total").innerText =
"₹"+finalTotal;

document.getElementById("bottom-total").innerText =
finalTotal;

}



/* APPLY COUPON */

document.getElementById("apply-coupon").onclick = async ()=>{

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
couponDiscount = data.discount;
}

if(data.percent){
couponDiscount = Math.floor(totalPrice * data.percent / 100);
}

document.getElementById("coupon-msg").innerText =
"Coupon Applied";

updateTotals();

};



/* CONTINUE PAYMENT */

continuePaymentBtn.onclick = ()=>{

window.location.href="payment.html";

};



renderSummary();
