// =========================
// INISIALISASI CART (Improved)
// =========================

function initCart() {
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify({}));
    console.log('Cart initialized');
  }
}

// =========================
// CART EVENT SYSTEM (New)
// =========================

function dispatchCartUpdate() {
  const event = new Event('cartUpdated');
  document.dispatchEvent(event);
}

// =========================
// MENAMBAH ITEM KE CART (Improved)
// =========================

function addToCart(productId, productName) {
  initCart();
  let cart = JSON.parse(localStorage.getItem('cart'));

  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    cart[productId] = {
      name: productName,
      quantity: 1,
      addedAt: new Date().toISOString()
    };
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
  showToast(`${productName} added to cart`);
  dispatchCartUpdate(); // Trigger cart update event
}

// =========================
// UPDATE JUMLAH DI NAVBAR (Improved)
// =========================

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll('#cart-count').forEach(element => {
    element.textContent = totalItems;
    element.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
}

// =========================
// TAMPILKAN ITEM DI MODAL (Improved)
// =========================

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const container = document.getElementById('cart-items');

  if (!container) return;

  // Filter out items with quantity <= 0
  const validItems = Object.entries(cart).filter(([id, item]) => item.quantity > 0);

  container.innerHTML = validItems.length === 0 
    ? '<p class="text-center">Your cart is empty</p>'
    : validItems.map(([id, item]) => `
        <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-2 border-bottom">
              <h6 class="mb-1">${item.name}</h6>
              <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary me-2" onclick="decreaseQuantity('${id}')">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="increaseQuantity('${id}')">+</button>
              </div>
            </div>
          </div>
          <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${id}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `).join('');

  updateWhatsAppButton();
}

// =========================
// TAMBAH/KURANG QUANTITY (Improved)
// =========================

function increaseQuantity(productId) {
  const btn = event.currentTarget;
  showButtonLoading(btn);

  setTimeout(() => {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[productId]) {
      cart[productId].quantity += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
      updateCartCounter();
      dispatchCartUpdate();
    }
  }, 300);
}

function decreaseQuantity(productId) {
  const btn = event.currentTarget;
  showButtonLoading(btn);

  setTimeout(() => {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[productId]) {
      cart[productId].quantity -= 1;
      if (cart[productId].quantity <= 0) {
        delete cart[productId];
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
      updateCartCounter();
      dispatchCartUpdate();
    }
  }, 300);
}

// =========================
// HAPUS ITEM (Improved)
// =========================

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  if (cart[productId]) {
    const itemName = cart[productId].name;
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCounter();
    showToast(`${itemName} removed from cart`);
    dispatchCartUpdate();
  }
}

// =========================
// CHECKOUT VIA WHATSAPP (Improved)
// =========================

function updateWhatsAppButton() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const whatsappButton = document.getElementById('whatsapp-button');
  
  if (whatsappButton) {
    const hasItems = Object.values(cart).some(item => item.quantity > 0);
    whatsappButton.disabled = !hasItems;
    
    // Mobile optimization
    whatsappButton.classList.toggle('whatsapp-active', hasItems);
    whatsappButton.style.pointerEvents = hasItems ? 'auto' : 'none';
  }
}

function calculateTotal(cart) {
  // Implement your total calculation logic here if needed
  const itemCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  return `Total: ${itemCount} item(s)`;
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const validItems = Object.entries(cart).filter(([id, item]) => item.quantity > 0);
  
  if (validItems.length === 0) {
    showToast('Keranjang masih kosong');
    return;
  }

  let message = "Halo, saya ingin memesan:\n\n";
  message += validItems
    .map(([id, item]) => `- ${item.name} (Qty: ${item.quantity})`)
    .join('\n');
  
  message += `\n\n${calculateTotal(cart)}\nMohon konfirmasi ketersediaan barang. Terima kasih!`;

  window.open(`https://wa.me/6285775230813?text=${encodeURIComponent(message)}`, '_blank');
}

// =========================
// INITIALIZATION (Improved)
// =========================

document.addEventListener('DOMContentLoaded', function() {
  initCart();
  updateCartCounter();
  updateWhatsAppButton();

  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.addEventListener('show.bs.modal', function() {
      displayCartItems();
    });
  }

  // Listen for cart updates
  document.addEventListener('cartUpdated', function() {
    updateCartCounter();
    updateWhatsAppButton();
    if (cartModal && cartModal.classList.contains('show')) {
      displayCartItems();
    }
  });
});


