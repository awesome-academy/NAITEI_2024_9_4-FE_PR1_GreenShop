document.addEventListener('DOMContentLoaded', function () {
    // Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Kiểm tra nếu không có id sản phẩm
    if (!productId) {
        alert("Không tìm thấy sản phẩm.");
        return;
    }

    // Lấy ngôn ngữ hiện tại từ localStorage
    const currentLanguage = localStorage.getItem('userLanguage') || 'vi';

    // Gọi API để lấy chi tiết sản phẩm hiện tại
    fetch(`http://localhost:3001/${currentLanguage}/products/${productId}`)
        .then(response => response.json())
        .then(currentProduct => {
            renderProductDetail(currentProduct);
            renderProductInfor(currentProduct);
            
            // Lấy các sản phẩm cùng loại với sản phẩm hiện tại
            fetch(`http://localhost:3001/${currentLanguage}/products?type=${currentProduct.type}`)
                .then(response => response.json())
                .then(productsSameType => {
                    renderProductSame(productsSameType);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy sản phẩm cùng loại:', error);
                });
        })
        .catch(error => {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        });

    // Hàm hiển thị chi tiết sản phẩm
    function renderProductDetail(product) {
        // Xây dựng HTML cho chi tiết sản phẩm
        const productDetailHTML = `
            <div class="grid grid-cols-12 gap-8">
                <!-- Product Image -->
                <div class="sm:col-span-5 col-span-12">
                    <img src="../../assets/images/${product.images[0]}" alt="Main Product Image" class="w-full h-auto mb-4">
                    <div class="flex justify-between md:flex-nowrap flex-wrap">
                        ${product.images.map(image => `
                            <img src="../../assets/images/${image}" class="w-20 h-20 border cursor-pointer">
                        `).join('')}
                    </div>
                </div>

                <!-- Product Details -->
                <div class="sm:col-span-7 col-span-12">
                    <h2 class="text-xl font-semibold">${product.name}</h2>
                    <div class="flex items-center my-2">
                        ${generateStars(product.rating)}
                    </div>
                    <div class="flex items-baseline space-x-2">
                        <span class="text-red-500 text-3xl font-semibold">
                            ${Math.round(product.price * (1 - product.discountPercentage / 100))} đ
                        </span>
                        <span class="line-through">${product.price} đ</span>
                    </div>
                    <p class="mt-4 text-xs">${product.description}</p>

                    <!-- Quantity Selector -->
                    <div class="flex items-center my-10 space-x-4 quantity">
                        <span class="text-gray-600 mr-2">Số lượng:</span>
                        <button id="down" class="w-[30px] h-[30px] bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 focus:outline-none">
                            -
                        </button>
                        <input type="number" id="quantity" name="quantity" value="1" min="1"
                            class="w-[60px] h-[35px] text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        <button id="up" class="w-[30px] h-[30px] bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 focus:outline-none">
                            +
                        </button>
                    </div>

                    <!-- Buy Buttons -->
                    <div class="mt-6">
                        <div class="flex items-center w-full">
                                <button class="product-buy-btn" onclick="addToCart(${product.id})">
                                    <span data-i18n="list_products.buy_now"></span>
                                </button>
                                <button class="product-detail-btn" onclick="productModal(${product.id})">
                                    <i class="fas fa-search text-[20px]"></i>
                                </button>
                                <button class="product-heart-btn">
                                    <i class="fas fa-solid fa-heart"></i>
                                </button>
                            </div>
                    </div>

                    <!-- Social Share Buttons -->
                    <div class="mt-6 flex items-center">
                        <div class="flex space-x-6">
                            <div class="relative">
                                <a href="#"
                                    class="text-blue-600 bg-white hover:bg-gray-400 w-8 h-8 flex items-center justify-center rounded-lg border-2 border-blue-600">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <span class="absolute -right-4 -top-2 text-xs bg-red-500 text-white rounded-lg w-5 h-5 flex items-center justify-center">5</span>
                            </div>
                            <div class="relative">
                                <a href="#"
                                    class="hover:text-white hover:bg-blue-400 w-8 h-8 flex items-center justify-center rounded-lg border-2 border-blue-400">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <span class="absolute -right-4 -top-2 text-xs bg-red-500 text-white rounded-lg w-5 h-5 flex items-center justify-center">3</span>
                            </div>
                            <div class="relative">
                                <a href="#"
                                    class="hover:text-white hover:bg-tumblr w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-500">
                                    <i class="fab fa-tumblr"></i>
                                </a>
                                <span class="absolute -right-4 -top-2 text-xs bg-red-500 text-white rounded-lg w-5 h-5 flex items-center justify-center">10</span>
                            </div>
                        </div>
                        <div class="ms-16">
                            <a href="#"
                                class="hover:text-white hover:bg-tumblr text-orange-500 w-8 h-8 px-8 flex items-center justify-center border-2 rounded-lg border-gray-400">
                                <i class="fas fa-solid fa-share"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Gắn HTML chi tiết sản phẩm vào container chính
        document.querySelector('#product-detail-container').innerHTML = productDetailHTML;
    }

    // Hàm hiển thị các sản phẩm cùng loại
    function renderProductSame(products) {
        const productSameContainer = document.querySelector('#same-product');
        let productSameHTML = '';

        products.forEach(product => {
            productSameHTML += `
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
            `;
        });

        productSameContainer.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-600">${productSameHTML}</div>`;
        // Gắn HTML sản phẩm vào container chính
        // productSameContainer.innerHTML = productSameHTML;
        loadTranslations(getLanguage() || 'vi');
    }

    //Hàm hiển thị thông tin sản phẩm
    function renderProductInfor(product) {
        const productInfor = document.querySelector('#product-infor');
        const productInforHTML = `
            <p>Tên phổ thông: ${product.commonName}</p>
            <p>Tên khoa học: ${product.scientificName}</p>
            <p>Họ thực vật: ${product.plantFamily}</p>
            <p>Chiều cao: ${product.height}</p>
            <p>${product.origin}</p>
            <p>${product.describe}</p>
        `;
    
        productInfor.innerHTML = `<div class="ms-8 mt-10 space-y-4 text-sm">${productInforHTML}</div>`;
        loadTranslations(getLanguage() || 'vi');
    }
    

    // Hàm hiển thị sao dựa trên đánh giá
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
});
