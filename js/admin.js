import { db, storage, ref, push, remove, onValue, sRef, uploadBytes, getDownloadURL } from "./firebase.js";

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-target')).classList.add('active');
    });
});

// SLIDER MANAGER
const sliderForm = document.getElementById("slider-form");
if(sliderForm) {
    sliderForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const file = document.getElementById("slider-image").files[0];
        const storageRef = sRef(storage, `sliders/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
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

// CATEGORY MANAGER
const categoryForm = document.getElementById("category-form");
const prodCatSelect = document.getElementById("prod-category");
if(categoryForm) {
    categoryForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("cat-name").value;
        const file = document.getElementById("cat-image").files[0];
        const storageRef = sRef(storage, `categories/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
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

// PRODUCT MANAGER
const productForm = document.getElementById("product-form");
if(productForm) {
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("prod-title").value;
        const price = Number(document.getElementById("prod-price").value);
        const mrp = Number(document.getElementById("prod-mrp").value);
        const category = document.getElementById("prod-category").value;
        const stock = Number(document.getElementById("prod-stock").value);
        const cod = document.getElementById("prod-cod").checked;
        
        const mainFile = document.getElementById("prod-main-image").files[0];
        const mRef = sRef(storage, `products/${Date.now()}_main_${mainFile.name}`);
        await uploadBytes(mRef, mainFile);
        const mainUrl = await getDownloadURL(mRef);

        const galleryFiles = document.getElementById("prod-gallery").files;
        let galleryUrls = [];
        for(let i=0; i<galleryFiles.length; i++) {
            const gRef = sRef(storage, `products/${Date.now()}_gal_${galleryFiles[i].name}`);
            await uploadBytes(gRef, galleryFiles[i]);
            galleryUrls.push(await getDownloadURL(gRef));
        }

        push(ref(db, "products"), { title, price, mrp, category, stock, cod, mainImage: mainUrl, gallery: galleryUrls });
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

// PAYMENT MANAGER
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
