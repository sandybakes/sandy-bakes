const API_URL = "https://script.google.com/macros/s/AKfycbx8L6YgP3bE_4w_95AOpI3mDj5xIuSv-UOXzyCAFupdSfRuKcAYUcvOVaKbVnHphGf3uw/exec";

document.addEventListener('DOMContentLoaded', () => {
    // Hide popup if seen
    if (sessionStorage.getItem('visited')) {
        document.getElementById('welcomePopup').style.display = 'none';
    }
    fetchProducts();
});

function closePopup() {
    document.getElementById('welcomePopup').style.display = 'none';
    sessionStorage.setItem('visited', 'true');
}

async function fetchProducts() {
    const list = document.getElementById('product-list');
    try {
        const res = await fetch(API_URL);
        const products = await res.json();
        
        list.innerHTML = products.map(p => `
            <div class="product-card">
                <div class="img-container">
                    <img src="${p.ImageURL}" alt="${p.Name}" onerror="this.src='https://via.placeholder.com/300x250?text=Baking...'">
                </div>
                <div class="p-info">
                    <h4>${p.Name}</h4>
                    <div class="price">₹${p.FinalPrice}</div>
                    <button class="btn-primary" onclick="addToCart('${p.ProductID}', '${p.Name}', ${p.FinalPrice})">Add to Cart</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = `<p>Error loading treats. Please refresh.</p>`;
    }
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('sandy_cart')) || [];
    let item = cart.find(i => i.id === id);
    if(item) item.qty++; else cart.push({id, name, price, qty: 1});
    localStorage.setItem('sandy_cart', JSON.stringify(cart));
    
    // Quick Visual Update
    const count = cart.reduce((a, b) => a + b.qty, 0);
    document.getElementById('cart-count').innerText = count;
    alert(`${name} is now in your cart!`);
}
