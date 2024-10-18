import { renderPagination } from './pagination.js';

document.addEventListener('DOMContentLoaded', function () {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productContainer = document.getElementById('productContainer');
    loadTranslations(getLanguage());
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1; // Lấy trang hiện tại từ URL

    // Biến lưu trữ các bộ lọc
    let selectedType = null;
    let selectedPriceRange = null;
    let selectedColor = null;

    // Hàm lấy tất cả sản phẩm từ API
    function fetchProducts() {
        const language = localStorage.getItem('userLanguage');
        const url = `http://localhost:3001/${language}_products`; // Không có phân trang ở đây, lấy toàn bộ sản phẩm
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Trả về danh sách tất cả sản phẩm
            });
    }

    // Hàm hiển thị dạng Grid với phân trang phía client
    function showGridView(page = 1, limit = 9) {
        fetchProducts().then(products => {
            // Lọc sản phẩm theo loại, giá và màu sắc
            let filteredProducts = applyFilters(products);

            // Tính tổng số trang dựa trên số sản phẩm đã lọc
            const totalPages = Math.ceil(filteredProducts.length / limit);

            // Chỉ hiển thị sản phẩm của trang hiện tại
            const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);

            const gridContent = paginatedProducts.map(product => `
                <div class="product-card group">
                    <div class="relative">
                        <a href="#">
                            <img class="img-product" src="${product.image}" alt="${product.name}" />
                        </a>
                        <a href="#" class="img-product-hover group-hover:bg-opacity-50"></a>
                        <div class="product-card-btn-wrapper">
                            <div class="flex justify-center items-center w-full sm:flex-nowrap flex-wrap space-y-1">
                                <button class="product-add-btn">
                                    <i class="fas fa-shopping-cart me-[5px]"></i>
                                    <span data-i18n="outstanding_products.add_to_cart"></span>
                                </button>
                                <button class="product-detail-btn">
                                    <i class="fas fa-search text-[20px] text-gray-500"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="product-card-info">
                        <h3>
                            <a href="/src/pages/detailProduct.html"><span>${product.name}</span></a>
                        </h3>
                        <div class="flex items-center my-2">
                            ${generateStars(product.rating)}
                        </div>
                        <div class="product-card-price">
                            <span class="discount-price">${product.price}₫</span>
                            <span class="line-through-price">${product.price}₫</span>
                        </div>
                    </div>
                </div>
            `).join('');

            productContainer.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-600">${gridContent}</div>`;
            renderPagination(totalPages, page); // Gọi hàm renderPagination
            loadTranslations(getLanguage() || 'vi');
        });
    }

    // Hàm hiển thị dạng List với phân trang phía client
    function showListView(page = 1, limit = 9) {
        fetchProducts().then(products => {
            // Lọc sản phẩm theo loại, giá và màu sắc
            let filteredProducts = applyFilters(products);

            // Tính tổng số trang dựa trên số sản phẩm đã lọc
            const totalPages = Math.ceil(filteredProducts.length / limit);

            // Chỉ hiển thị sản phẩm của trang hiện tại
            const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);

            const listContent = paginatedProducts.map(product => `
                <div class="product-card flex">
                    <div class="w-1/3 me-4">
                        <a href="#">
                            <img class="w-full" src="${product.image}" alt="${product.name}" />
                        </a>
                    </div>
                    <div class="w-3/4 ms-4">
                        <h3 class="text-xl mt-3">
                            <a href="/src/pages/detailProduct.html"><span>${product.name}</span></a>
                        </h3>
                        <div class="flex items-center my-2">
                            ${generateStars(product.rating)}
                        </div>
                        <div class="relative group mb-3">
                            <span class="line-clamp-2">${product.description}</span>
                        </div>
                        <div class="mb-2">
                            <span class="discount-price">${product.price}₫</span>
                        </div>
                        <div class="">
                            <div class="flex items-center w-full">
                                <button class="product-buy-btn">
                                    <span data-i18n="list_products.buy_now"></span>
                                </button>
                                <button class="product-search-btn">
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
            renderPagination(totalPages, page); // Gọi hàm renderPagination
            loadTranslations(getLanguage() || 'vi');
        });
    }

    // Hàm áp dụng bộ lọc
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
    showGridView(currentPage); // Chuyển đến sản phẩm của trang hiện tại

    // Chuyển sang Grid View khi click
    gridViewBtn.addEventListener('click', () => showGridView(currentPage));

    // Chuyển sang List View khi click
    listViewBtn.addEventListener('click', () => showListView(currentPage));

    // Lắng nghe sự kiện cho các bộ lọc
    document.querySelectorAll('.filter-type').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedType = this.getAttribute('data-filter-type');
            showGridView(currentPage); // Cập nhật hiển thị sản phẩm
        });
    });

    document.querySelectorAll('.filter-price').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedPriceRange = this.getAttribute('data-filter-price');
            showGridView(currentPage); // Cập nhật hiển thị sản phẩm
        });
    });

    document.querySelectorAll('.filter-color').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            selectedColor = this.getAttribute('data-filter-color');
            showGridView(currentPage); // Cập nhật hiển thị sản phẩm
        });
    });
});
