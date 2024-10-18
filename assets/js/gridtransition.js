import { renderPagination } from './pagination.js';

document.addEventListener('DOMContentLoaded', function () {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productContainer = document.getElementById('productContainer');
    loadTranslations(getLanguage());
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;

    let selectedType = null;
    let selectedPriceRange = null;
    let selectedColor = null;
    let currentView = 'grid'; // Biến để theo dõi chế độ hiển thị hiện tại

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
            let filteredProducts = applyFilters(products); // Lọc sản phẩm từ tổng số sản phẩm
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
                            <a href="#"><span>${product.name}</span></a>
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
            let filteredProducts = applyFilters(products); // Lọc sản phẩm từ tổng số sản phẩm
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

    // Mặc định hiển thị Grid
    showGridView(currentPage);

    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid'; // Cập nhật chế độ hiển thị
        showGridView(currentPage);
    });
    
    listViewBtn.addEventListener('click', () => {
        currentView = 'list'; // Cập nhật chế độ hiển thị
        showListView(currentPage);
    });

    document.querySelectorAll('.filter-type').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedType = this.getAttribute('data-filter-type');
            const urlParams = new URLSearchParams();
            urlParams.set('type', selectedType);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`); // Xóa các bộ lọc cũ và thêm bộ lọc mới
            
            // Cập nhật UI
            document.querySelectorAll('.filter-type').forEach(filter => {
                filter.classList.remove('active');
            });
            this.classList.add('active');

            // Hiển thị sản phẩm theo chế độ hiện tại
            if (currentView === 'grid') {
                showGridView(1); // Chuyển đến trang 1 khi áp dụng bộ lọc
            } else {
                showListView(1); // Chuyển đến trang 1 khi áp dụng bộ lọc
            }
        });
    });

    document.querySelectorAll('.filter-price').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedPriceRange = this.getAttribute('data-filter-price');
            const urlParams = new URLSearchParams();
            urlParams.set('price', selectedPriceRange);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`); // Xóa các bộ lọc cũ và thêm bộ lọc mới
            
            // Cập nhật UI
            document.querySelectorAll('.filter-price').forEach(filter => {
                filter.classList.remove('active');
            });
            this.classList.add('active');

            // Hiển thị sản phẩm theo chế độ hiện tại
            if (currentView === 'grid') {
                showGridView(1); // Chuyển đến trang 1 khi áp dụng bộ lọc
            } else {
                showListView(1); // Chuyển đến trang 1 khi áp dụng bộ lọc
            }
        });
    });

    document.querySelectorAll('.filter-color').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedColor = this.getAttribute('data-filter-color');
            const urlParams = new URLSearchParams();
            urlParams.set('color', selectedColor);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`); // Xóa các bộ lọc cũ và thêm bộ lọc mới
            
            // Cập nhật UI
            document.querySelectorAll('.filter-color').forEach(filter => {
                filter.classList.remove('active');
            });
            this.classList.add('active');

            // Hiển thị sản phẩm theo chế độ hiện tại
            if (currentView === 'grid') {
                showGridView(1); // Chuyển đến trang 1 khi áp dụng bộ lọc
            } else {
                showListView(1); // Chuyển đến trang 1 khi áp dụng bộ lọc
            }
        });
    });
});
