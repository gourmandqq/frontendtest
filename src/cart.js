// cart.js
class Cart {
    constructor() {
        this.items = new Map();
        this.cartCounter = document.querySelector('.block_cartcart a');
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.updateCartCounter();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart_button') || 
                e.target.closest('.cart_button')) {
                const button = e.target.classList.contains('cart_button') ? 
                    e.target : e.target.closest('.cart_button');
                this.addToCart(button);
            }
        });
    }

    addToCart(button) {
        const productElement = button.closest('.product');
        const productId = this.getProductId(productElement);
        const productInfo = this.getProductInfo(productElement);

        if (!productId) {
            console.error('Не удалось определить ID товара');
            return;
        }

        const existingItem = this.items.get(productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.items.set(productId, existingItem);
        } else {
            this.items.set(productId, {
                ...productInfo,
                quantity: 1,
                id: productId
            });
        }

        this.saveToStorage();
        this.updateCartCounter();
        this.showAddToCartAnimation(button);
    }

    getProductId(productElement) {
        const productName = productElement.querySelector('h3')?.textContent || '';
        const productPrice = productElement.querySelector('h4')?.textContent || '';
        return btoa(encodeURIComponent(`${productName}-${productPrice}`)).substring(0, 16);
    }

    getProductInfo(productElement) {
        return {
            name: productElement.querySelector('h3')?.textContent || 'Неизвестный товар',
            price: productElement.querySelector('h4')?.textContent || '0 руб.',
            image: productElement.querySelector('img')?.src || '',
            originalPrice: productElement.querySelector('h5 s')?.textContent || null
        };
    }

    updateCartCounter() {
        if (!this.cartCounter) return;

        const totalItems = this.getTotalItems();
        const cartText = this.cartCounter.textContent.split(' (')[0]; // Убираем старый счетчик

        if (totalItems > 0) {
            this.cartCounter.innerHTML = `Корзина <span class="cart-counter">(${totalItems})</span>`;
        } else {
            this.cartCounter.innerHTML = 'Корзина';
        }
    }

    getTotalItems() {
        let total = 0;
        for (const item of this.items.values()) {
            total += item.quantity;
        }
        return total;
    }

    showAddToCartAnimation(button) {
        const originalText = button.textContent;
        button.textContent = 'Добавлено!';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.borderColor = '#4CAF50';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 1000);
    }

    saveToStorage() {
        try {
            const serializedItems = JSON.stringify(Array.from(this.items.entries()));
            localStorage.setItem('moda-optic-cart', serializedItems);
        } catch (error) {
            console.error('Ошибка сохранения корзины:', error);
        }
    }

    loadFromStorage() {
        try {
            const storedItems = localStorage.getItem('moda-optic-cart');
            if (storedItems) {
                const itemsArray = JSON.parse(storedItems);
                this.items = new Map(itemsArray);
            }
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            this.items = new Map();
        }
    }

    removeItem(productId) {
        this.items.delete(productId);
        this.saveToStorage();
        this.updateCartCounter();
    }

    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
        } else {
            const item = this.items.get(productId);
            if (item) {
                item.quantity = quantity;
                this.items.set(productId, item);
                this.saveToStorage();
                this.updateCartCounter();
            }
        }
    }

    clearCart() {
        this.items.clear();
        this.saveToStorage();
        this.updateCartCounter();
    }

    getItems() {
        return Array.from(this.items.values());
    }
}

export default Cart;