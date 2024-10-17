const cartHeader = () => {
  const cartHeaderElement = document.getElementById('cart-header');
  const quantity = cartHeaderElement.querySelector('#quantity-card-header');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContent = document.getElementById('cart-header-content');
  quantity.innerHTML = cart.length;

  if (cart.length > 0) {
    let totalAmount = 0;
    cartContent.innerHTML = cart.map(item => {
      const productTotal = item.price * item.quantity;
      totalAmount += productTotal;
      return `
      <div class="cart-item flex items-center justify-between border-b border-gray-300 py-4">
        <div class="flex items-center gap-4 mr-3">
          <img src="../../assets/images/${item.images[0]}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200">
          <div>
            <p class="text-gray-900 text-sm font-semibold">${item.name}</p>
            <p class="text-gray-500 text-xs mt-1">${item.quantity} x ${item.price.toLocaleString()} đ</p>
          </div>
        </div>
        <div class="text-right mr-3">
          <p class="text-sm text-gray-900 font-bold">${productTotal.toLocaleString()} đ</p>
        </div>
        <button class="text-red-500 text-sm font-medium hover:text-red-600 transition-colors duration-200 ease-in-out" data-id="${item.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
      `;
    }).join('');

    cartContent.innerHTML += `
      <div class="flex justify-between items-center mt-4">
        <p class="text-sm font-semibold text-gray-700"><span data-i18n="header.total"></span>:</p>
        <p class="text-sm font-semibold text-gray-800">${totalAmount.toLocaleString()} đ</p>
      </div>
      <div class="flex justify-center mt-4">
        <a href="../pages/cart.html" class="bg-main text-white px-4 py-2 rounded-full text-sm font-medium">
          <span data-i18n="header.view_cart"></span>
        </a>
      </div>
    `;

    document.querySelectorAll('.cart-item button').forEach(button => {
      button.addEventListener('click', (event) => {
        const productId = event.currentTarget.getAttribute('data-id');
        removeFromCart(productId);
        cartHeader();
      });
    });
  } else {
    cartContent.innerHTML = `
    <div class="flex justify-center mb-[10px]">
      <img src="../../assets/images/shopping-bag.png" alt="cart" class="w-10 h-10">
    </div>
    <div>
      <span class="text-gray-600 text-[14px]" data-i18n="header.empty_cart"></span>
    </div>
    `;
  }
}

const removeFromCart = (id) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  id = parseInt(id);
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadTranslations(getLanguage());
}
