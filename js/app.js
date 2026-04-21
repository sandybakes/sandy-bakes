const API_URL = "https://script.google.com/macros/s/AKfycbx8L6YgP3bE_4w_95AOpI3mDj5xIuSv-UOXzyCAFupdSfRuKcAYUcvOVaKbVnHphGf3uw/exec";

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        if(document.getElementById('product-list')) renderProducts(products);
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

function renderProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.ImageURL}" alt="${p.Name}" onerror="this.src='https://via.placeholder.com/300x200?text=Baking...'">
            <div class="p-info">
                <h3>${p.Name}</h3>
                <div class="price">₹${p.FinalPrice}</div>
                <button class="btn-main" onclick="addToCart('${p.ProductID}', '${p.Name}', ${p.FinalPrice}, '${p.ImageURL}')">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id, name, price, img) {
    let cart = JSON.parse(localStorage.getItem('sandyCart')) || [];
    const existing = cart.find(item => item.id === id);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({id, name, price, img, qty: 1});
    }
    localStorage.setItem('sandyCart', JSON.stringify(cart));
    updateCartCount();
    alert(name + " added to oven!");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('sandyCart')) || [];
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = `(${count})`;
}

function closePopup() {
    document.getElementById('welcomePopup').style.display = 'none';
}

window.onload = () => {
    fetchProducts();
    updateCartCount();
};
