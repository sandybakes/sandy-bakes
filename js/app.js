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
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let container = document.getElementById("cartItems");
  let total = 0;

  container.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>

        <button onclick="changeQty(${index}, -1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${index}, 1)">+</button>

        <br><br>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = "Total: ₹" + total;
}

function changeQty(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}
