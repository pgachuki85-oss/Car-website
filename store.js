(() => {
    'use strict';

    const CART_KEY = 'uniqueAutoCartV1';
    const products = [
        { id: 'seat-covers', name: 'Seat Covers', category: 'interior', image: 'seat_covers.png', description: 'Seat covers for interior protection and style. Confirm material, colour and vehicle fitment before ordering.', price: 3900, priceLabel: 'Indicative example', compatibility: true },
        { id: 'steering-covers', name: 'Steering Wheel Covers', category: 'interior', image: 'steering_covers.png', description: 'Steering wheel covers in a range of styles. Confirm size and availability with the shop.', price: 1200, priceLabel: 'Indicative example' },
        { id: 'car-perfumes', name: 'Car Perfumes', category: 'care', image: 'car_perfumes.png', description: 'Car fragrance options. Ask the shop about available scents and sizes.', price: 750, priceLabel: 'Indicative example' },
        { id: 'headlights', name: 'Headlights', category: 'lighting', image: 'headlights.png', description: 'Replacement and upgrade headlights. Vehicle make, model, year and fitting specification should be checked before purchase.', price: null, compatibility: true },
        { id: 'fog-lights', name: 'Fog Lights', category: 'lighting', image: 'fog_lights.png', description: 'Fog light options. Confirm vehicle compatibility and specifications before ordering.', price: null, compatibility: true },
        { id: 'snake-lights', name: 'Snake Lights', category: 'lighting', image: 'snake_lights.png', description: 'Flexible automotive lighting options. Ask the shop to confirm specifications and availability.', price: null },
        { id: 'evil-eyes', name: 'Evil Eyes', category: 'exterior', image: 'car_evil_eyes.png', description: 'Exterior styling accessories. Confirm the exact product and vehicle fitment with the shop.', price: null, compatibility: true },
        { id: 'floor-mats', name: 'Car Floor Mats', category: 'interior', image: 'car_floor_mats.png', description: 'Floor mats for interior protection. Confirm vehicle fit and available styles before ordering.', price: null, compatibility: true },
        { id: 'door-visors', name: 'Door Visors', category: 'exterior', image: 'door_visors.png', description: 'Door visor options. Confirm the shape and fitment for your vehicle.', price: null, compatibility: true },
        { id: 'phone-holder', name: 'Phone Holder', category: 'electronics', image: 'phone_holder.png', description: 'Phone holder options for your vehicle. Confirm available mounting styles with the shop.', price: null },
        { id: 'car-charger', name: 'Car Charger', category: 'electronics', image: 'car_charger.png', description: 'Car charging accessories. Ask the shop to confirm available ports and charging specifications.', price: null },
        { id: 'rear-spoiler', name: 'Rear Spoiler', category: 'exterior', image: 'rear_spoiler.png', description: 'Exterior styling options. Vehicle compatibility and installation should be confirmed.', price: null, compatibility: true }
    ];

    const money = (amount) => `KSh ${Number(amount).toLocaleString('en-KE')}`;
    const readCart = () => {
        try {
            const value = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
            return value && typeof value === 'object' ? value : {};
        } catch {
            return {};
        }
    };
    const saveCart = (cart) => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    };
    const productById = (id) => products.find((product) => product.id === id);

    function updateCartCount() {
        const count = Object.values(readCart()).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        document.querySelectorAll('.cart-count').forEach((badge) => {
            badge.textContent = String(count);
            badge.setAttribute('aria-label', `${count} item${count === 1 ? '' : 's'} in cart`);
        });
    }

    function notify(message) {
        let toast = document.querySelector('.store-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'store-toast';
            toast.setAttribute('role', 'status');
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(notify.timeout);
        notify.timeout = window.setTimeout(() => toast.classList.remove('show'), 2800);
    }

    function addToCart(productId, options = {}) {
        const product = productById(productId);
        if (!product) return;
        const cart = readCart();
        const current = cart[productId] || { quantity: 0, options: {} };
        const quantity = Math.max(1, Math.min(99, Number(options.quantity) || 1));
        current.quantity = Math.min(99, current.quantity + quantity);
        current.options = { ...current.options, ...(options.details || {}) };
        cart[productId] = current;
        saveCart(cart);
        notify(`${product.name} added to your cart. Price and stock still need confirmation.`);
    }

    function cardMarkup(product) {
        const price = product.price == null
            ? '<span class="price">Price confirmed on request</span>'
            : `<span class="price">${money(product.price)} <small>indicative example</small></span>`;
        return `<article class="${document.querySelector('[data-catalogue-products]') ? 'accessory-card' : 'product-card'}" data-product-id="${product.id}" data-category="${product.category}" data-price="${product.price ?? ''}">
            <a class="product-image-link" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.name} details"><div class="${document.querySelector('[data-catalogue-products]') ? 'accessory-image' : 'product-image'}"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="accessory-badge">${product.category}</span></div></a>
            <div class="${document.querySelector('[data-catalogue-products]') ? 'accessory-info' : 'product-info'}">
                <h3>${product.name}</h3><p>${product.description}</p><p class="stock-status">Availability: please confirm with the shop</p>${price}
                <div class="product-actions"><a class="details-button" href="product.html?id=${encodeURIComponent(product.id)}">View Details</a><button class="add-to-cart" type="button" data-add-product="${product.id}"><i class="fas fa-cart-plus" aria-hidden="true"></i> Add to Cart</button></div>
            </div>
        </article>`;
    }

    function renderCards() {
        const catalogue = document.querySelector('[data-catalogue-products]');
        const home = document.querySelector('[data-home-products]');
        if (catalogue) catalogue.innerHTML = products.map(cardMarkup).join('');
        if (home) home.innerHTML = products.slice(0, 4).map(cardMarkup).join('');
        document.querySelector('.special-offers')?.remove();
        document.dispatchEvent(new Event('unique-products-rendered'));
        updateCartCount();
    }

    function getCartLines() {
        const cart = readCart();
        return Object.entries(cart).map(([id, item]) => {
            const product = productById(id);
            if (!product || !item || !Number.isFinite(Number(item.quantity))) return null;
            return { product, quantity: Math.max(1, Math.min(99, Number(item.quantity))), options: item.options || {} };
        }).filter(Boolean);
    }

    function renderCart() {
        const root = document.querySelector('[data-cart-root]');
        if (!root) return;
        const lines = getCartLines();
        const subtotal = lines.reduce((sum, line) => sum + (line.product.price || 0) * line.quantity, 0);
        const hasQuote = lines.some((line) => line.product.price == null);
        if (!lines.length) {
            root.innerHTML = '<div class="empty-cart"><i class="fas fa-bag-shopping" aria-hidden="true"></i><h2>Your cart is empty</h2><p>Explore the catalogue and add products you are interested in.</p><a class="cta-button" href="accessories.html">Browse products</a></div>';
            return;
        }
        root.innerHTML = `<div class="cart-layout"><div class="cart-lines">${lines.map(({ product, quantity, options }) => `<article class="cart-line" data-cart-line="${product.id}">
            <img src="${product.image}" alt="${product.name}" loading="lazy"><div class="cart-product"><h2>${product.name}</h2><p>${Object.entries(options).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join(' · ') || 'Options / fitment: confirm with shop'}</p><span>${product.price == null ? 'Price on request' : `${money(product.price)} · indicative example`}</span></div>
            <div class="quantity-control" aria-label="Quantity for ${product.name}"><button type="button" data-quantity="-1" data-id="${product.id}" aria-label="Decrease quantity">−</button><output>${quantity}</output><button type="button" data-quantity="1" data-id="${product.id}" aria-label="Increase quantity">+</button></div>
            <strong class="line-subtotal">${product.price == null ? 'Quote required' : money(product.price * quantity)}</strong><button type="button" class="remove-item" data-remove="${product.id}">Remove</button>
        </article>`).join('')}</div><aside class="cart-summary"><h2>Order estimate</h2><p class="summary-row"><span>Indicative subtotal</span><strong>${money(subtotal)}</strong></p><p class="summary-row"><span>Delivery</span><strong>To be confirmed</strong></p><p class="summary-total"><span>Estimated total</span><strong>${hasQuote ? 'Price quote required' : `${money(subtotal)} + delivery`}</strong></p><p class="price-disclaimer">Prices shown are examples, not confirmed quotations. Stock, final prices, delivery fees and payment arrangements are confirmed by the shop.</p><a class="cta-button checkout-button" href="checkout.html">Continue to checkout inquiry</a><a class="continue-shopping" href="accessories.html">Continue shopping</a></aside></div>`;
    }

    function renderProductDetail() {
        const root = document.querySelector('[data-product-detail]');
        if (!root) return;
        const id = new URLSearchParams(location.search).get('id');
        const product = productById(id) || products[0];
        document.title = `${product.name} | UNIQUE AUTO SPARES`;
        const descriptionMeta = document.querySelector('meta[name="description"]');
        if (descriptionMeta) descriptionMeta.content = `${product.description} Contact UNIQUE AUTO SPARES in Eldoret to confirm price, stock and fitment.`;
        root.innerHTML = `<div class="detail-image"><img src="${product.image}" alt="${product.name}"></div><div class="detail-copy"><p class="detail-eyebrow">${product.category} accessory</p><h1>${product.name}</h1><p>${product.description}</p><p class="detail-price">${product.price == null ? 'Price confirmed on request' : `${money(product.price)} <small>indicative example · confirm current price</small>`}</p><p class="stock-status">Availability: confirm with the shop before ordering.</p>${product.compatibility ? '<div class="vehicle-fields"><h2>Vehicle fitment enquiry</h2><label>Make<input name="make" placeholder="e.g. Toyota"></label><label>Model<input name="model" placeholder="e.g. Fielder"></label><label>Year<input name="year" inputmode="numeric" placeholder="e.g. 2018"></label></div>' : ''}<label class="quantity-label">Quantity<input type="number" name="quantity" min="1" max="99" value="1"></label><button class="add-to-cart detail-add" type="button" data-add-product="${product.id}"><i class="fas fa-cart-plus" aria-hidden="true"></i> Add to Cart</button><p class="detail-note">Adding to cart saves an inquiry locally on this device. It does not reserve stock or charge a payment.</p><a class="continue-shopping" href="accessories.html">Back to all products</a></div>`;
        root.querySelector('[data-add-product]').addEventListener('click', () => {
            const quantity = root.querySelector('[name="quantity"]').value;
            const details = Object.fromEntries(['make', 'model', 'year'].map((key) => [key, root.querySelector(`[name="${key}"]`)?.value.trim() || '']).filter(([, value]) => value));
            addToCart(product.id, { quantity, details });
        });
    }

    function renderCheckout() {
        const summary = document.querySelector('[data-checkout-summary]');
        if (!summary) return;
        const lines = getCartLines();
        const subtotal = lines.reduce((sum, line) => sum + (line.product.price || 0) * line.quantity, 0);
        const unknown = lines.some((line) => line.product.price == null);
        summary.innerHTML = lines.length ? `<h2>Your items</h2><ul>${lines.map(({ product, quantity }) => `<li><span>${product.name} × ${quantity}</span><strong>${product.price == null ? 'Quote required' : money(product.price * quantity)}</strong></li>`).join('')}</ul><p><span>Indicative subtotal</span><strong>${money(subtotal)}</strong></p><p><span>Delivery fee</span><strong>To be confirmed</strong></p><p class="summary-total"><span>Total</span><strong>${unknown ? 'Price quote required' : `${money(subtotal)} + delivery`}</strong></p>` : '<p>Your cart is empty. <a href="accessories.html">Browse products</a>.</p>';
        const form = document.querySelector('#checkoutForm');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                if (!lines.length) { notify('Add a product before continuing.'); return; }
                if (!form.reportValidity()) return;
                const values = new FormData(form);
                const orderText = lines.map(({ product, quantity, options }) => `- ${product.name} x${quantity} (${product.price == null ? 'price to confirm' : `${money(product.price * quantity)} indicative`})${Object.entries(options).filter(([, value]) => value).map(([key, value]) => `; ${key}: ${value}`).join('')}`).join('\n');
                const message = `Hello UNIQUE AUTO SPARES, I would like to enquire about this order.\n\n${orderText}\n\nCustomer: ${values.get('name')}\nPhone: ${values.get('phone')}\nEmail: ${values.get('email') || 'Not provided'}\nCounty / town: ${values.get('location')}\nFulfilment: ${values.get('fulfilment')}\nDelivery address: ${values.get('address') || 'To be discussed'}\nPayment preference: ${values.get('payment')}\nNotes: ${values.get('notes') || 'None'}\n\nPlease confirm stock, final prices, delivery fee, fitment and payment instructions. I understand this is an inquiry and not a confirmed/paid order.`;
                location.href = `https://wa.me/254722445610?text=${encodeURIComponent(message)}`;
            });
        }
    }

    document.addEventListener('click', (event) => {
        const addButton = event.target.closest('[data-add-product]');
        if (addButton && !document.querySelector('[data-product-detail]')) addToCart(addButton.dataset.addProduct);
        const quantityButton = event.target.closest('[data-quantity]');
        if (quantityButton) {
            const cart = readCart();
            const item = cart[quantityButton.dataset.id];
            if (!item) return;
            const next = Number(item.quantity) + Number(quantityButton.dataset.quantity);
            if (next < 1) return;
            if (next > 99) { notify('Maximum quantity is 99. Please confirm stock with the shop.'); return; }
            item.quantity = next;
            saveCart(cart);
            renderCart();
        }
        const removeButton = event.target.closest('[data-remove]');
        if (removeButton) {
            const cart = readCart();
            delete cart[removeButton.dataset.remove];
            saveCart(cart);
            renderCart();
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        renderCards();
        renderCart();
        renderProductDetail();
        renderCheckout();
        updateCartCount();
    });
    window.UniqueStore = { products, money, readCart, addToCart, renderCart };
})();
