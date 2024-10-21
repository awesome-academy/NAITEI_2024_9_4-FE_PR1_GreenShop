document.addEventListener('DOMContentLoaded', function () {

    // Lấy ngôn ngữ hiện tại từ localStorage
    const currentLanguage = localStorage.getItem('userLanguage') || 'vi';

    // Gọi API lấy chi tiết sản phẩm
    fetch(`http://localhost:3001/${currentLanguage}/products`)
        .then(response => response.json())
        .then(product => {
            renderProductSame(product);
        })
        .catch(error => {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        });

    // Hàm hiển thị chi tiết sản phẩm
    function renderProductSame(product) {
        // Xây dựng HTML cho chi tiết sản phẩm
        const productSameHTML = `
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

        // Gắn HTML chi tiết sản phẩm vào container chính
        document.querySelector('#same-product').innerHTML = productSameHTML;
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
