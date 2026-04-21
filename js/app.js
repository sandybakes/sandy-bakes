const API_URL = "https://script.google.com/macros/s/AKfycbx8L6YgP3bE_4w_95AOpI3mDj5xIuSv-UOXzyCAFupdSfRuKcAYUcvOVaKbVnHphGf3uw/exec?action=getProducts";

const ORDER_API = "https://script.google.com/macros/s/AKfycbx8L6YgP3bE_4w_95AOpI3mDj5xIuSv-UOXzyCAFupdSfRuKcAYUcvOVaKbVnHphGf3uw/exec";

// 🔹 LOAD PRODUCTS
async function loadProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();

  let container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>₹${p.finalPrice}</p>
        <button onclick="addToCart('${p.id}','${p.name}',${p.finalPrice})">Add to Cart</button>
      </div>
    `;
  });
}

loadProducts();

// 🔹 ADD TO CART
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart 🛒");
}

// 🔹 LOAD CART
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

        <button onclick="changeQty(${index},-1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${index},1)">+</button>

        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = "Total: ₹" + total;
}

// 🔹 CHANGE QTY
function changeQty(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  cart[index].qty += change;

  if (cart[index].qty <= 0) cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// 🔹 REMOVE ITEM
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// 🔹 PLACE ORDER
async function placeOrder() {

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!name || !email || !phone || !address) {
    alert("Fill all details");
    return;
  }

  let orderId = "SB-" + Date.now();

  let total = 0;
  cart.forEach(i => total += i.price * i.qty);

  let data = {
    action: "addOrder",
    orderId,
    name,
    email,
    phone,
    address,
    items: JSON.stringify(cart),
    total,
    status: "Placed",
    date: new Date().toLocaleString()
  };

  await fetch(ORDER_API, {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert("Order placed 🎉");

  localStorage.removeItem("cart");
  window.location.href = "products.html";
}
