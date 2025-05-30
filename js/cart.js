// =========================
// INISIALISASI CART
// =========================
function initCart() {
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify({}));
    console.log('Cart initialized');
  }
}

function generateCartKey(productId, head = '', capacity = '', pole = '', selectedtype = '') {
  return `${productId}_${head}_${capacity}_${pole}_${selectedtype}`;
}

document.addEventListener('DOMContentLoaded', function() {
  initCart();
  updateCartCounter();
  updateWhatsAppButton();

  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.addEventListener('show.bs.modal', function() {
      displayCartItems();
      updateWhatsAppButton();
    });
  }
});

// =========================
// MENAMBAH ITEM KE CART
// =========================

function addToCart(productId, productName, head = '', capacity = '', pole = '', selectedtype = '',) {

   // Cek jika field Head atau Capacity kosong
  if (!head || !capacity) {
    showToast('Mohon isi Head dan Capacity terlebih dahulu.');
    return;
  }

  initCart();

  const uniqueId = generateCartKey(productId, head, capacity , pole, selectedtype);
  let cart = JSON.parse(localStorage.getItem('cart'));

  if (cart[uniqueId]) {
    cart[uniqueId].quantity += 1;
  } else {
    cart[uniqueId] = {
      name: productName,
      quantity: 1,
      head: head,
      capacity: capacity,
      selectedtype: selectedtype,
      addedAt: new Date().toISOString(),
      pole: pole
    };
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
  updateWhatsAppButton();
  showToast(`${productName} added to cart`);

  // Reset input
  const inputIds = ['fsa-head', 'fsa-capacity', 'gs-head', 'gs-capacity','evmsg-head', 'evmsg-capacity','cdx-head','cdx-capacity','ebarasub-head','ebarasub-capacity','ebara3d-head','ebara3d-capacity','torishima-head','torishima-capacity','gl-head','gl-capacity'];
  inputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });

    // Reset radio button typeOption
  const selectedRadio = document.querySelector('input[name="typeOption"]:checked');
  if (selectedRadio) selectedRadio.checked = false;
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

// tester function

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const container = document.getElementById('cart-items');

  if (!container) return;

  container.innerHTML = Object.keys(cart).length === 0 
    ? '<p class="text-center">Your cart is empty</p>'
    :Object.entries(cart).map(([id, item]) => `
  <div class="cart-item mb-3 p-3 border rounded">
    <h6 class="mb-2">${item.name}</h6>
    
    <div class="d-flex align-items-center mb-2">
      <button class="btn btn-sm btn-outline-secondary me-2" onclick="decreaseQuantity('${id}')">−</button>
      <span>${item.quantity}</span>
      <button class="btn btn-sm btn-outline-secondary ms-2" onclick="increaseQuantity('${id}')">+</button>
    </div>

    <div class="text-muted small mb-2">
      H: ${item.head || '-'} (m) | C: ${item.capacity || '-'} (m³/h) | P: ${item.pole || '-'} (Pole) | Type: ${item.selectedtype || '-'}
    </div>

    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${id}')">
      <i class="bi bi-trash"></i> Remove
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
      updateWhatsAppButton();
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
      updateWhatsAppButton();
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
    updateWhatsAppButton();
  }
}

// =========================
// CHECKOUT VIA WHATSAPP
// =========================

function updateWhatsAppButton() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const whatsappButton = document.getElementById('whatsapp-button');

  if (whatsappButton) {
    const hasItems = Object.values(cart).some(item => item.quantity > 0);
    whatsappButton.disabled = !hasItems;
    whatsappButton.classList.toggle('disabled-wa', !hasItems);
  }
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};

  if (Object.keys(cart).length === 0) {
    showToast('Keranjang masih kosong !');
    return;
  }

  let message = "Halo, saya ingin Bertanya tentang produk ini Pake Type apa ya:\n\n";
  message += Object.entries(cart)
    .map(([id, item]) =>
  `- ${item.name} (Qty: ${item.quantity})` +
  `\n   H: ${item.head || '-'} m | C: ${item.capacity || '-'} m³/h | P: ${item.pole || '-'} Pole | Type: ${item.selectedtype || '-'} ` 
)
      .join('\n\n');

  message += "\n\nMohon konfirmasi dengan saya Tentang Produk ini. Terima kasih!";
  window.open(`https://wa.me/6285775230813?text=${encodeURIComponent(message)}`, '_blank',150);
}

// =========================
// SYNC ANTAR HALAMAN
// =========================

window.addEventListener('storage', function(event) {
  if (event.key === 'cart') {
    updateCartCounter();
    updateWhatsAppButton();
    displayCartItems();
  }
});


