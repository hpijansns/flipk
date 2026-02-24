import { db, ref, push, set, remove, onValue } from "./firebase.js";

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-target')).classList.add('active');
    });
});

// SLIDER MANAGER (USING URL)
const sliderForm = document.getElementById("slider-form");
if(sliderForm) {
    sliderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = document.getElementById("slider-image-url").value;
        push(ref(db, "sliders"), { imageUrl: url });
        sliderForm.reset();
    });

    onValue(ref(db, "sliders"), snapshot => {
        const list = document.getElementById("slider-list");
        list.innerHTML = "";
        snapshot.forEach(child => {
            const div = document.createElement("div");
            div.className = "admin-card";
            div.innerHTML = `<img src="${child.val().imageUrl}">`;
            const delBtn = document.createElement("button");
            delBtn.className = "del-btn"; delBtn.innerText = "Delete";
            delBtn.onclick = () => remove(ref(db, `sliders/${child.key}`));
            div.appendChild(delBtn);
            list.appendChild(div);
        });
    });
}

// CATEGORY MANAGER (USING URL)
const categoryForm = document.getElementById("category-form");
const prodCatSelect = document.getElementById("prod-category");
if(categoryForm) {
    categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("cat-name").value;
        const url = document.getElementById("cat-image-url").value;
        push(ref(db, "categories"), { name, imageUrl: url });
        categoryForm.reset();
    });

    onValue(ref(db, "categories"), snapshot => {
        const list = document.getElementById("category-list");
        list.innerHTML = ""; prodCatSelect.innerHTML = `<option value="">Select Category</option>`;
        snapshot.forEach(child => {
            const cat = child.val();
            const div = document.createElement("div");
            div.className = "admin-card";
            div.innerHTML = `<img src="${cat.imageUrl}"><h4>${cat.name}</h4>`;
            const delBtn = document.createElement("button");
            delBtn.className = "del-btn"; delBtn.innerText = "Delete";
            delBtn.onclick = () => remove(ref(db, `categories/${child.key}`));
            div.appendChild(delBtn);
            list.appendChild(div);
            
            prodCatSelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
        });
    });
}

// PRODUCT MANAGER (USING URL)
const productForm = document.getElementById("product-form");
if(productForm) {
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("prod-title").value;
        const price = Number(document.getElementById("prod-price").value);
        const mrp = Number(document.getElementById("prod-mrp").value);
        const category = document.getElementById("prod-category").value;
        const stock = Number(document.getElementById("prod-stock").value);
        const cod = document.getElementById("prod-cod").checked;
        
        const mainImage = document.getElementById("prod-main-image-url").value;
        
        const galleryRaw = document.getElementById("prod-gallery-urls").value;
        let galleryUrls = [];
        if(galleryRaw.trim() !== "") {
            galleryUrls = galleryRaw.split(",").map(url => url.trim()).filter(url => url !== "");
        }

        push(ref(db, "products"), { title, price, mrp, category, stock, cod, mainImage: mainImage, gallery: galleryUrls });
        productForm.reset();
    });

    onValue(ref(db, "products"), snapshot => {
        const list = document.getElementById("product-list");
        list.innerHTML = "";
        snapshot.forEach(child => {
            const p = child.val();
            const div = document.createElement("div");
            div.className = "admin-card";
            div.innerHTML = `<img src="${p.mainImage}"><h4>${p.title}</h4><p>₹${p.price}</p>`;
            const delBtn = document.createElement("button");
            delBtn.className = "del-btn"; delBtn.innerText = "Delete";
            delBtn.onclick = () => remove(ref(db, `products/${child.key}`));
            div.appendChild(delBtn);
            list.appendChild(div);
        });
    });
}

// PAYMENT MANAGER (METHODS & LINK)
const paymentLinkForm = document.getElementById("payment-link-form");
if(paymentLinkForm) {
    paymentLinkForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const link = document.getElementById("admin-payment-link").value;
        set(ref(db, "paymentLink"), { url: link }).then(() => {
            alert("Payment link successfully saved!");
        });
    });

    onValue(ref(db, "paymentLink"), snapshot => {
        if(snapshot.exists()) {
            document.getElementById("admin-payment-link").value = snapshot.val().url;
        }
    });
}

const paymentForm = document.getElementById("payment-form");
if(paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("pay-name").value;
        push(ref(db, "paymentMethods"), { name });
        paymentForm.reset();
    });

    onValue(ref(db, "paymentMethods"), snapshot => {
        const list = document.getElementById("payment-list");
        list.innerHTML = "";
        snapshot.forEach(child => {
            const div = document.createElement("div");
            div.className = "admin-card";
            div.innerHTML = `<h4>${child.val().name}</h4>`;
            const delBtn = document.createElement("button");
            delBtn.className = "del-btn"; delBtn.innerText = "Delete";
            delBtn.onclick = () => remove(ref(db, `paymentMethods/${child.key}`));
            div.appendChild(delBtn);
            list.appendChild(div);
        });
    });
    }
