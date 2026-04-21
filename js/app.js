const API_URL = "https://script.google.com/macros/s/AKfycbx8L6YgP3bE_4w_95AOpI3mDj5xIuSv-UOXzyCAFupdSfRuKcAYUcvOVaKbVnHphGf3uw/exec?action=getProducts";

async function loadProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();

  let container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    if (p.status === "Active") {
      container.innerHTML += `
        <div class="card">
          <img src="${p.image}" width="150"/>
          <h3>${p.name}</h3>
          <p>₹${p.finalPrice}</p>
          <button onclick="addToCart('${p.id}')">Add to Cart</button>
        </div>
      `;
    }
  });
}

loadProducts();
