document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Modern Chair', price: 180, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80' },
        { id: 2, name: 'Minimalist Lamp', price: 80, image: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80' },
        { id: 3, name: 'Wooden Desk', price: 350, image: 'https://images.unsplash.com/photo-1593325024795-3d4c99711727?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80' },
        { id: 4, name: 'Sofa Set', price: 950, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
    ];

    // General elements
    const cartBadge = document.getElementById('cart-badge');
    const notificationContainer = document.getElementById('notification-container');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- General Functions ---
    function updateCartBadge() {
        if (!cartBadge) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function showNotification(message) {
        if (!notificationContainer) return;
        const notification = document.createElement('div');
        notification.className = 'notification bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-3"></i>
                <span>${message}</span>
            </div>
        `;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function updateOrderSummary() {
        const subtotalEl = document.getElementById('summary-subtotal');
        const totalEl = document.getElementById('summary-total');
        if (!subtotalEl || !totalEl) return;

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = cart.length > 0 ? 5 : 0;
        const total = subtotal + shipping;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // --- Product Page Functions ---
    const productList = document.getElementById('product-list');
    if (productList) {
        displayProducts();
    }

    function displayProducts() {
        productList.innerHTML = products.map(product => `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden product-card-hover">
                <div class="overflow-hidden h-64">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover product-img">
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                    <p class="text-gray-700 mb-4">$${product.price}</p>
                    <button onclick="addToCart(${product.id})" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center">
                        <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    window.addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        showNotification(`${product.name} added to cart!`);
        updateCartBadge();
    }

    // --- Cart Page Functions ---
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        displayCart();
    }

    function displayCart() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center col-span-3 py-12">
                    <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <h2 class="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                    <p class="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <a href="index.html" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
                        Continue Shopping
                    </a>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="bg-white rounded-lg shadow-lg p-4 mb-4 flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md mr-4">
                <div class="flex-grow">
                    <h3 class="text-lg font-semibold">${item.name}</h3>
                    <p class="text-gray-600">$${item.price}</p>
                </div>
                <div class="flex items-center mx-4">
                    <button onclick="updateQuantity(${item.id}, -1)" class="text-gray-500 hover:text-purple-600"><i class="fas fa-minus-circle text-lg"></i></button>
                    <span class="mx-4 font-semibold text-lg">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="text-gray-500 hover:text-purple-600"><i class="fas fa-plus-circle text-lg"></i></button>
                </div>
                <div class="text-lg font-semibold w-24 text-right">
                    $${item.price * item.quantity}
                </div>
                <button onclick="removeFromCart(${item.id})" class="ml-6 text-red-500 hover:text-red-700"><i class="fas fa-trash-alt text-lg"></i></button>
            </div>
        `).join('');

        updateOrderSummary();
    }

    window.updateQuantity = (productId, change) => {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== productId);
            }
            saveCart();
            displayCart();
            updateCartBadge();
        }
    }

    window.removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        displayCart();
        updateCartBadge();
    }

    // --- Checkout Page Functions ---
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        displayCheckoutSummary();
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            if (!name || !address || !email || !phone) {
                alert('Please fill out all shipping information.');
                return;
            }

            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = cart.length > 0 ? 5 : 0;
            const total = subtotal + shipping;

            const order = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                items: cart,
                total: total
            };

            const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
            orderHistory.push(order);
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

            cart = [];
            saveCart();
            window.location.href = 'confirmation.html';
        });
    }

    function displayCheckoutSummary() {
        const summaryContainer = document.getElementById('checkout-order-summary');
        if (!summaryContainer) return;

        summaryContainer.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between py-2">
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md mr-4">
                    <div>
                        <h4 class="font-semibold">${item.name}</h4>
                        <p class="text-sm text-gray-500">Qty: ${item.quantity}</p>
                    </div>
                </div>
                <span class="font-semibold">$${item.price * item.quantity}</span>
            </div>
        `).join('');

        updateOrderSummary();
    }

    // --- History Page Functions ---
    const historyContainer = document.getElementById('history-container');
    if (historyContainer) {
        displayHistory();
    }

    function displayHistory() {
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

        if (orderHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-history text-6xl text-gray-300 mb-4"></i>
                    <h2 class="text-2xl font-semibold text-gray-700 mb-2">No order history</h2>
                    <p class="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                    <a href="index.html" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
                        Start Shopping
                    </a>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = orderHistory.reverse().map(order => `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">Order #${order.id}</h3>
                        <p class="text-sm text-gray-500">Date: ${order.date}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-bold gradient-text">$${order.total.toFixed(2)}</p>
                    </div>
                </div>
                <div class="border-t border-gray-200 pt-4">
                    <h4 class="font-semibold mb-2">Items:</h4>
                    ${order.items.map(item => `
                        <div class="flex justify-between items-center text-sm mb-1">
                            <span>${item.name} (x${item.quantity})</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // --- Initial Load ---
    updateCartBadge();
});