document.addEventListener('DOMContentLoaded', () => {
    const switchInput = document.getElementById('switch');

    document.querySelectorAll('.techbuttonreq').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            const productName = button.getAttribute('data-product-name');
            const productLeasingPrice = button.getAttribute('data-product-leasing-price');
            const productPurchasePrice = button.getAttribute('data-product-purchase-price');
            const productImage = button.getAttribute('data-product-image');
            const isPurchaseButton = button.getAttribute('data-is-purchase');
            const isPurchase = isPurchaseButton !== null ? isPurchaseButton === 'true' : switchInput.checked;

            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            let existingItem = cartItems.find(item => item.id === productId && item.isPurchase === isPurchase);

            if (existingItem) {
                if (existingItem.quantity < 3) {
                    existingItem.quantity += 1;
                }
            } else {
                cartItems.push({
                    id: productId,
                    name: productName,
                    leasingPrice: productLeasingPrice,
                    purchasePrice: productPurchasePrice,
                    image: productImage,
                    quantity: 1,
                    isPurchase: isPurchase
                });
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            alert(`${productName} добавлен в заявку на ${isPurchase ? 'покупку' : 'лизинг'}!`);
        });
    });

    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const leasingPriceElement = document.getElementById('leasing-price');
        const purchasePriceElement = document.getElementById('purchase-price');
        const totalPriceElement = document.getElementById('total-price');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let leasingTotal = 0;
        let purchaseTotal = 0;

        cartItemsContainer.innerHTML = '';

        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-img-box"><img src="pics/${item.image}" alt="${item.name}"></div>
                <div class="cart-item-details">
                    <h2>${item.name}</h2>
                    <p>Ориентировочная цена: ${item.isPurchase ? item.purchasePrice + ' ₽' : item.leasingPrice + ' ₽/мес.'} (${item.isPurchase ? 'Покупка' : 'Лизинг'})</p>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-button" data-product-id="${item.id}" data-is-purchase="${item.isPurchase}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-button" data-product-id="${item.id}" data-is-purchase="${item.isPurchase}">+</button>
                    <button class="remove-button" data-product-id="${item.id}" data-is-purchase="${item.isPurchase}">Удалить</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            if (item.isPurchase) {
                purchaseTotal += parseFloat(item.purchasePrice) * item.quantity;
            } else {
                leasingTotal += parseFloat(item.leasingPrice) * item.quantity;
            }
        });

        leasingPriceElement.textContent = leasingTotal.toFixed(2);
        purchasePriceElement.textContent = purchaseTotal.toFixed(2);
        totalPriceElement.textContent = (leasingTotal + purchaseTotal).toFixed(2);
    }

    function updateCartItem(productId, action, isPurchase) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let item = cartItems.find(item => item.id === productId && item.isPurchase === (isPurchase === 'true'));

        if (item) {
            if (action === 'increase' && item.quantity < 3) {
                item.quantity += 1;
            } else if (action === 'decrease') {
                item.quantity -= 1;
                if (item.quantity < 1) {
                    cartItems = cartItems.filter(item => !(item.id === productId && item.isPurchase === (isPurchase === 'true')));
                }
            }
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        loadCartItems();
    }

    document.getElementById('cart-items').addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-product-id');
        const isPurchase = event.target.getAttribute('data-is-purchase');
        if (event.target.classList.contains('remove-button')) {
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems = cartItems.filter(item => !(item.id === productId && item.isPurchase === (isPurchase === 'true')));
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            loadCartItems();
        } else if (event.target.classList.contains('increase-button')) {
            updateCartItem(productId, 'increase', isPurchase);
        } else if (event.target.classList.contains('decrease-button')) {
            updateCartItem(productId, 'decrease', isPurchase);
        }
    });

    loadCartItems();
});


function checkout() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Создание модального окна
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.height = '45vh';

    // Создание элемента для сообщения
    const message = document.createElement('p');
    if (cartItems.length === 0) {
        message.textContent = 'Заявка пуста. Попробуйте добавить технику через каталог.';
    } else {
        message.textContent = 'Спасибо! Ваша заявка оформлена. В ближайшее время мы свяжемся с Вами.';
    }
    modal.appendChild(message);

    // Создание кнопки закрытия
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.classList.add('closeButton');
    modal.appendChild(closeButton);

    // Создание затемнения под модальным окном
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    document.body.appendChild(modal);
    document.body.appendChild(overlay);

    // Показ модального окна
    modal.classList.add('show');
    overlay.classList.add('show');

    // Обработчик клика для закрытия модального окна через кнопку
    closeButton.addEventListener('click', function() {
        modal.classList.add('hide');
        overlay.classList.add('hide');
        if (cartItems.length > 0) {
            localStorage.removeItem('cartItems'); // Очистка корзины
        }
        setTimeout(function() {
            modal.classList.remove('show', 'hide');
            overlay.classList.remove('show', 'hide');
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
            location.reload(); // Обновление страницы
        }, 300);
    });

    // Обработчик клика для закрытия модального окна через затемнение
    overlay.addEventListener('click', function() {
        modal.classList.add('hide');
        overlay.classList.add('hide');
        setTimeout(function() {
            modal.classList.remove('show', 'hide');
            overlay.classList.remove('show', 'hide');
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
            location.reload(); // Обновление страницы
        }, 300);
    });
}

