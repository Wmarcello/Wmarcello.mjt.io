// =========================
// INISIALISASI CART
// =========================

function initCart() {
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify({}));
    console.log('Cart initialized');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initCart();
  updateCartCounter();

  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.addEventListener('show.bs.modal', function() {
      displayCartItems();
    });
  }
});

// =========================
// MENAMBAH ITEM KE CART
// =========================

function addToCart(productId, productName, productImage) {
  initCart();

  let cart = JSON.parse(localStorage.getItem('cart'));

  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    cart[productId] = {
      name: productName,
      image: productImage,
      quantity: 1,
      addedAt: new Date().toISOString()
    };
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
  showToast(`${productName} added to cart`);
}

// =========================
// UPDATE JUMLAH DI NAVBAR
// =========================

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll('#cart-count').forEach(element => {
    element.textContent = totalItems;
  });
}

// =========================
// TAMPILKAN TOAST NOTIFIKASI
// =========================

function showToast(message) {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = 'toast show align-items-center text-white bg-success mb-2';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'position-fixed top-0 end-0 p-3';
  document.body.appendChild(container);
  return container;
}

// =========================
// TAMPILKAN ITEM DI MODAL
// =========================

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const container = document.getElementById('cart-items');

  if (!container) return;

  container.innerHTML = Object.keys(cart).length === 0 
    ? '<p class="text-center">Your cart is empty</p>'
    : Object.entries(cart).map(([id, item]) => `
        <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-2 border-bottom">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-outline-secondary me-2" onclick="decreaseQuantity('${id}')">−</button>
              <span>${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary ms-2" onclick="increaseQuantity('${id}')">+</button>
            </div>
          </div>
          <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${id}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `).join('');
}

// =========================
// TAMBAH/KURANG QUANTITY
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
    }
  }, 300);
}

function showButtonLoading(button) {
  button.disabled = true;
  const originalContent = button.innerHTML;
  button.innerHTML = `<span class="spinner-border spinner-border-sm spinner-border-sm-custom" role="status" aria-hidden="true"></span>`;

  setTimeout(() => {
    button.innerHTML = originalContent;
    button.disabled = false;
  }, 300);
}

// =========================
// HAPUS ITEM
// =========================

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  if (cart[productId]) {
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCounter();
  }
}

// =========================
// CHECKOUT VIA WHATSAPP
// =========================

// CHECKOUT VIA WHATSAPP
// =========================

// 1. Fungsi untuk update status tombol
function updateWhatsAppButton() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const whatsappButton = document.getElementById('whatsapp-button');
  
  if (whatsappButton) {
    whatsappButton.disabled = Object.keys(cart).length === 0;
    
    // Optional: Ganti style jika disabled
    if (whatsappButton.disabled) {
      whatsappButton.style.opacity = "0.6";
      whatsappButton.style.cursor = "not-allowed";
    } else {
      whatsappButton.style.opacity = "1";
      whatsappButton.style.cursor = "pointer";
    }
  }
}

// 2. Fungsi checkout utama
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  
  if (Object.keys(cart).length === 0) {
    showToast('Your cart is empty.');
    return;
  }

  let message = "Halo, saya ingin memesan / menanyakan type yg cocok: \n\n";
  message += Object.entries(cart)
    .map(([id, item]) => `- ${item.name} (Qty: ${item.quantity})`)
    .join('\n');
  
  message += "\n\nMohon Bantuannya <i class='emoji-smile-fill'></i> " + calculateTotal(cart); // Fungsi hitung total

  window.open(`https://wa.me/6285775230813?text=${encodeURIComponent(message)}`, '_blank');
}

// 4. Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  updateWhatsAppButton();
  
  // Jika Anda memiliki event keranjang yang diupdate:
  document.addEventListener('cartUpdated', updateWhatsAppButton);
});

// 5. CSS yang bisa ditambahkan (optional)




