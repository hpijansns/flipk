const addressForm = document.getElementById("address-form");
const savedAddressSection = document.getElementById("saved-address-section");
const savedAddressContent = document.getElementById("saved-address-content");
const deliverHereBtn = document.getElementById("deliver-here-btn");

function checkSavedAddress() {
    const saved = localStorage.getItem("userAddress");
    if(saved && savedAddressSection) {
        const addr = JSON.parse(saved);
        savedAddressContent.innerHTML = `<b>${addr.fullName}</b> - ${addr.mobile}<br>${addr.house}, ${addr.area}, ${addr.city}, ${addr.state} - <b>${addr.pincode}</b><br><span style="background:#eee;padding:2px 5px;font-size:12px;border-radius:3px;">${addr.type}</span>`;
        savedAddressSection.style.display = "block";
    }
}

if(addressForm) {
    addressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const address = {
            fullName: document.getElementById("fullName").value,
            mobile: document.getElementById("mobile").value,
            pincode: document.getElementById("pincode").value,
            house: document.getElementById("house").value,
            area: document.getElementById("area").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            landmark: document.getElementById("landmark").value,
            type: document.querySelector('input[name="type"]:checked').value
        };
        localStorage.setItem("userAddress", JSON.stringify(address));
        window.location.href = "order-summary.html";
    });
}

if(deliverHereBtn) {
    deliverHereBtn.addEventListener("click", () => {
        window.location.href = "order-summary.html";
    });
}

checkSavedAddress();
