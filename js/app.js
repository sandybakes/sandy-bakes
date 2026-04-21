const API = "YOUR_API?action=getProducts";
const ORDER_API = "YOUR_API";

// CART COUNT
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = cart.reduce((sum, i) => sum + i.qty, 0);

  let el = document.getElementById("cartCount");
  if (el) el.innerText = count;
}

// LOAD PRODUCTS
async function loadProducts() {
  if (!document.getElementById("products")) return;

  const res = await fetch(API);
  const data = await res.json();

  let div = document.getElementById("products");

  data.forEach(p => {
    div.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>₹${p.finalPrice}</p>
        <button onclick="addToCart('${p.id}','${p.name}',${p.finalPrice})">Add</button>
      </div>
    `;
  });
}

// ADD TO CART
function addToCart(id,name,price){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let item = cart.find(i => i.id === id);

  if(item) item.qty++;
  else cart.push({id,name,price,qty:1});

  localStorage.setItem("cart",JSON.stringify(cart));

  updateCartCount();
  alert("Added");
}

// LOAD CART
function loadCart(){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let div = document.getElementById("cartItems");
  if(!div) return;

  let total = 0;

  cart.forEach((item,i)=>{
    total += item.price * item.qty;

    div.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>

        <button onclick="changeQty(${i},-1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${i},1)">+</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = "Total ₹"+total;
}

// CHANGE QTY
function changeQty(i,c){
  let cart = JSON.parse(localStorage.getItem("cart"));

  cart[i].qty += c;
  if(cart[i].qty<=0) cart.splice(i,1);

  localStorage.setItem("cart",JSON.stringify(cart));
  location.reload();
}

// PLACE ORDER
async function placeOrder(){
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;
  cart.forEach(i=> total += i.price*i.qty);

  let data = {
    action:"addOrder",
    orderId:"SB-"+Date.now(),
    name,email,phone,address,
    items:JSON.stringify(cart),
    total,
    status:"Placed",
    date:new Date().toLocaleString()
  };

  await fetch(ORDER_API,{
    method:"POST",
    body:JSON.stringify(data)
  });

  alert("Order placed");
  localStorage.removeItem("cart");
  location.href="products.html";
}

// INIT
updateCartCount();
loadProducts();
loadCart();
