import { renderPagination } from './pagination.js';

document.addEventListener('DOMContentLoaded', function () {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productContainer = document.getElementById('productContainer');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn'); // Added
    loadTranslations(getLanguage());
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;

    let selectedType = null;
    let selectedPriceRange = null;
    let selectedColor = null;
    let currentView = 'grid'; // Variable to track current view mode

    function fetchProducts() {
        const currentLanguage = localStorage.getItem('userLanguage') || 'vi';
        const url = `http://localhost:3001/${currentLanguage}/products`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            });
    }

    function showGridView(page = 1, limit = 9) {
        fetchProducts().then(products => {
            let filteredProducts = applyFilters(products); // Filter products
            const totalPages = Math.ceil(filteredProducts.length / limit);
            const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);

            const gridContent = paginatedProducts.map(product => `
                <div class="product-card group">
                    <div class="relative">
                        <a href="#">
                            <img class="img-product" src="../../assets/images/${product.images[0]}" alt="${product.name}" />
                        </a>
                        <a href="#" class="img-product-hover group-hover:bg-opacity-50"></a>
                        <div class="product-card-btn-wrapper">
                            <div class="flex justify-center items-center w-full">
                                <button class="product-add-btn" onclick="addToCart(${product.id})">
                                    <i class="fas fa-shopping-cart me-[5px]"></i>
                                    <span data-i18n="outstanding_products.add_to_cart"></span>
                                </button>
                                <button class="product-detail-btn" onclick="productModal(${product.id})">
                                    <i class="fas fa-search text-[20px]"></i>
                                </button>
                            </div>
                        </div>
                        ${product.discountPercentage > 0 ? `<div class="tag-product"><span>-${product.discountPercentage}%</span></div>` : ''}
                    </div>
                    <div class="product-card-info">
                        <h3>
                            <a href="/src/pages/detailProduct.html?id=${product.id}"><span>${product.name}</span></a>
                        </h3>
                        <div class="flex items-center">
                            ${generateStars(product.rating)}
                        </div>
                        <div class="product-card-price">
                            ${product.discountPercentage > 0 ? 
                                `<span class="discount-price">${Math.round(product.price * (1 - product.discountPercentage / 100))}₫</span>
                                <span class="line-through-price">${product.price}₫</span>` 
                                : `<span class="discount-price">${product.price}₫</span>`}
                        </div>
                    </div>
                </div>
            `).join('');

            productContainer.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-600">${gridContent}</div>`;
            renderPagination(totalPages, page);
            loadTranslations(getLanguage() || 'vi');
        });
    }

    function showListView(page = 1, limit = 9) {
        fetchProducts().then(products => {
            let filteredProducts = applyFilters(products); // Filter products
            const totalPages = Math.ceil(filteredProducts.length / limit);
            const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);

            const listContent = paginatedProducts.map(product => `
                <div class="product-card flex">
                    <div class="w-1/3 me-4">
                        <a href="#">
                            <img class="w-full" src="../../assets/images/${product.images[0]}" alt="${product.name}" />
                        </a>
                    </div>
                    <div class="w-3/4 ms-4">
                        <h3 class="text-xl mt-3">
                            <a href="#"><span>${product.name}</span></a>
                        </h3>
                        <div class="flex items-center my-2">
                            ${generateStars(product.rating)}
                        </div>
                        <div class="relative group mb-3">
                            <span class="line-clamp-2">${product.description}</span>
                        </div>
                        <div class="mb-2">
                            ${product.discountPercentage > 0 ? 
                                `<span class="discount-price">${Math.round(product.price * (1 - product.discountPercentage / 100))}₫</span>
                                <span class="line-through-price">${product.price}₫</span>` 
                                : `<span class="discount-price">${product.price}₫</span>`}
                        </div>
                        <div>
                            <div class="flex items-center w-full">
                                <button class="product-buy-btn" onclick="addToCart(${product.id})">
                                    <span data-i18n="list_products.buy_now"></span>
                                </button>
                                <button class="product-search-btn" onclick="productModal(${product.id})">
                                    <i class="fas fa-search text-[15px]"></i>
                                </button>
                                <button class="product-heart-btn">
                                    <i class="fas fa-solid fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            productContainer.innerHTML = `<div class="grid grid-cols-1 text-gray-600 space-y-6 me-5">${listContent}</div>`;
            renderPagination(totalPages, page);
            loadTranslations(getLanguage() || 'vi');
        });
    }

    function applyFilters(products) {
        let filteredProducts = products;

        if (selectedType) {
            filteredProducts = filteredProducts.filter(product => product.type === selectedType);
        }

        if (selectedPriceRange) {
            const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
            filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
        }

        if (selectedColor) {
            filteredProducts = filteredProducts.filter(product => product.color === selectedColor);
        }

        return filteredProducts;
    }

    function generateStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<img src="../../assets/images/star.svg" class="w-4 h-4 me-1" alt="star">';
            } else {
                stars += '<img src="../../assets/images/star_m.svg" class="w-4 h-4 me-1" alt="star">';
            }
        }
        return stars;
    }

    // Default view
    showGridView(currentPage);

    // View toggle buttons
    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid'; // Update view mode
        showGridView(currentPage);
    });
    
    listViewBtn.addEventListener('click', () => {
        currentView = 'list'; // Update view mode
        showListView(currentPage);
    });

    // Filter Type Buttons
    document.querySelectorAll('.filter-type').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedType = this.getAttribute('data-filter-type');
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('type', selectedType);
            // Preserve existing query parameters
            if (selectedPriceRange) urlParams.set('price', selectedPriceRange);
            if (selectedColor) urlParams.set('color', selectedColor);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);

            // Update UI
            document.querySelectorAll('.filter-type').forEach(filter => {
                filter.classList.remove('active');
            });
            this.classList.add('active');

            // Display products based on current view
            if (currentView === 'grid') {
                showGridView(1); // Go to page 1 when applying filter
            } else {
                showListView(1); // Go to page 1 when applying filter
            }
        });
    });

    // Filter Price Buttons
    document.querySelectorAll('.filter-price').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedPriceRange = this.getAttribute('data-filter-price');
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('price', selectedPriceRange);
            // Preserve existing query parameters
            if (selectedType) urlParams.set('type', selectedType);
            if (selectedColor) urlParams.set('color', selectedColor);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);

            // Update UI
            document.querySelectorAll('.filter-price').forEach(filter => {
                filter.classList.remove('active');
            });
            this.classList.add('active');

            // Display products based on current view
            if (currentView === 'grid') {
                showGridView(1); // Go to page 1 when applying filter
            } else {
                showListView(1); // Go to page 1 when applying filter
            }
        });
    });

    // Filter Color Buttons
    document.querySelectorAll('.filter-color').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedColor = this.getAttribute('data-filter-color');
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('color', selectedColor);
            // Preserve existing query parameters
            if (selectedType) urlParams.set('type', selectedType);
            if (selectedPriceRange) urlParams.set('price', selectedPriceRange);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);

            // Update UI
            document.querySelectorAll('.filter-color').forEach(filter => {
                filter.classList.remove('active');
            });
            this.classList.add('active');

            // Display products based on current view
            if (currentView === 'grid') {
                showGridView(1); // Go to page 1 when applying filter
            } else {
                showListView(1); // Go to page 1 when applying filter
            }
        });
    });

    // Clear All Filters Button Functionality
    clearFiltersBtn.addEventListener('click', function () {
        // Reset all selected filters
        selectedType = null;
        selectedPriceRange = null;
        selectedColor = null;

        // Remove 'active' class from all filter buttons
        document.querySelectorAll('.filter-type').forEach(filter => filter.classList.remove('active'));
        document.querySelectorAll('.filter-price').forEach(filter => filter.classList.remove('active'));
        document.querySelectorAll('.filter-color').forEach(filter => filter.classList.remove('active'));

        // Update the URL to remove all filter query parameters
        window.history.replaceState({}, '', `${window.location.pathname}`);

        // Reload the products based on the current view and reset to page 1
        if (currentView === 'grid') {
            showGridView(1);
        } else {
            showListView(1);
        }

        // Optionally, you can also clear any other UI elements related to filters
        // For example, reset dropdowns or input fields if any
    });
});
