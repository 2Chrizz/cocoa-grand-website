const cart = JSON.parse(localStorage.getItem("cart") || "[]");

/* ========================= */
/* ELEMENTE */
/* ========================= */

const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

/* ========================= */
/* CART TOGGLE */
/* ========================= */

cartBtn.onclick = () => {
  cartSidebar.classList.add("open");
};
closeCart.onclick = () => {
  cartSidebar.classList.remove("open");
};


/* ========================= */
/* MENGEN STEUERUNG (FIXED) */
/* ========================= */

function getInput(btn) {
  return btn.closest(".quantity-selector")?.querySelector(".qty-input");
}

/* PLUS / MINUS (EVENT DELEGATION) */
document.addEventListener("click", (e) => {
  const plus = e.target.closest(".plus");
  const minus = e.target.closest(".minus");

  if (plus) {
    const input = getInput(plus);
    if (!input) return;

    input.value = Math.min(99, Number(input.value || 1) + 1);
    input.dispatchEvent(new Event("input")); // wichtig!
  }

  if (minus) {
    const input = getInput(minus);
    if (!input) return;

    input.value = Math.max(1, Number(input.value || 1) - 1);
    input.dispatchEvent(new Event("input")); // wichtig!
  }
});

/* INPUT VALIDIERUNG */
document.addEventListener("input", (e) => {
  if (!e.target.classList.contains("qty-input")) return;

  let val = e.target.value;

  if (val === "") return;

  val = parseInt(val, 10);

  if (isNaN(val)) val = 1;

  val = Math.max(1, Math.min(99, val));

  e.target.value = val;
});
/* ========================= */
/* IN DEN WARENKORB */
/* ========================= */

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const qtyInput = card.querySelector(".qty-input");
    let qty = parseInt(qtyInput.value);
    if (isNaN(qty)) qty = 1;
    qty = Math.max(1, qty);
    qty = Math.min(99, qty);
    qtyInput.value = qty;
    const id = button.dataset.id;
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty = Math.min(99, existing.qty + qty);
    } else {
      cart.push({
        id: id,
        name: button.dataset.name,
        size: button.dataset.size,
        price: parseFloat(button.dataset.price),
        qty: Math.min(99, qty),
      });
    }
    qtyInput.value = 1;
    updateCart();
    cartSidebar.classList.add("open");
  });
});
/* ========================= */
/* CART RENDER */
/* ========================= */

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;
  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart">
            Dein Warenkorb ist leer.
        </div>`;
    cartTotal.textContent = "0,00 €";
    cartCount.textContent = "0";
    localStorage.setItem("cart", JSON.stringify(cart));
    return;
  }

  cart.forEach((item) => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    count += item.qty;
    cartItems.innerHTML += `
        <div class="cart-item">
            <div class="cart-item-header">
                <strong>
                    ${item.name}
                </strong>
                <button
                    class="remove-item"
                    onclick="removeItem('${item.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <div class="cart-size">
                ${item.size}
            </div>
            <div class="cart-qty">
                <button
                    onclick="changeQty('${item.id}',-1)">
                    -
                </button>
                <span>
                    ${item.qty}
                </span>
                <button
                    onclick="changeQty('${item.id}',1)">
                    +
                </button>
            </div>
            <div class="cart-price">
                ${subtotal.toFixed(2)} €
            </div>
        </div>
        `;
  });

  cartTotal.textContent = total.toFixed(2) + " €";
  cartCount.textContent = count;
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ========================= */
/* MENGE ÄNDERN */
/* ========================= */

function changeQty(id, amount) {
  const item = cart.find((item) => item.id === id);
  if (!item) return;
  item.qty += amount;
  item.qty = Math.max(1, Math.min(99, item.qty));
  if (item.qty <= 0) {
    removeItem(id);
    return;
  }

  updateCart();
}
/* ========================= */
/* PRODUKT ENTFERNEN */
/* ========================= */

function removeItem(id) {
  const index = cart.findIndex((item) => item.id === id);
  if (index > -1) {
    cart.splice(index, 1);
  }
  updateCart();
}
updateCart();

const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Dein Warenkorb ist leer.");
      return;
    }

    window.location.href = "checkout.html";
  });
}
