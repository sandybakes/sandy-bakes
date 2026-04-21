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

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // find product from current list
  const productCard = event.target.parentElement;
  const name = productCard.querySelector("h3").innerText;
  const price = parseInt(productCard.querySelector("p").innerText.replace("₹", ""));

  let existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart 🛒");
}
