import { db, ref, onValue, update } from "./firebase.js";

const ordersList = document.getElementById("orders-list");

if(ordersList) {
    onValue(ref(db, "orders"), (snapshot) => {
        ordersList.innerHTML = "";
        let ordersArray = [];
        snapshot.forEach(child => {
            ordersArray.push({ id: child.key, ...child.val() });
        });
        
        // Show newest first
        ordersArray.reverse().forEach(order => {
            const div = document.createElement("div");
            div.className = "order-card";
            
            let itemsHtml = order.products.map(p => `${p.title} (x${p.qty})`).join("<br>");
            
            div.innerHTML = `
                <div class="order-header">
                    <span>Order ID: ${order.id}</span>
                    <select class="order-status" data-id="${order.id}">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </div>
                <p><b>Customer:</b> ${order.customer.fullName} - ${order.customer.mobile}</p>
                <p><b>Address:</b> ${order.customer.house}, ${order.customer.area}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
                <p><b>Items:</b><br>${itemsHtml}</p>
                <p><b>Total:</b> ₹${order.amount}</p>
                <p><b>Payment:</b> ${order.paymentMethod}</p>
            `;
            ordersList.appendChild(div);
        });

        document.querySelectorAll(".order-status").forEach(select => {
            select.addEventListener("change", (e) => {
                const orderId = e.target.getAttribute("data-id");
                const newStatus = e.target.value;
                update(ref(db, `orders/${orderId}`), { status: newStatus });
            });
        });
    });
}
