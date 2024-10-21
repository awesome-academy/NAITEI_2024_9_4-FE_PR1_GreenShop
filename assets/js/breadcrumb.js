// Function để hiển thị breadcrumb dựa vào URL
function renderBreadcrumb(productName = null) {
    const breadcrumbContainer = document.getElementById('breadcrumb'); // Lấy thẻ để chèn breadcrumb
    const currentUrl = window.location.pathname; // Lấy URL hiện tại

    let breadcrumbHTML = `<a href="/src/pages/home.html" class="hover:underline"><span data-i18n="header.home"></span></a> / `;

    // Nếu là trang chi tiết sản phẩm và có tên sản phẩm, hiển thị tên sản phẩm trong breadcrumb
    if (productName) {
        breadcrumbHTML += `<a class="text-main">${productName}</a>`;
    } else {
        // Xử lý bình thường cho các trang khác
        const breadcrumbArray = currentUrl.split('/').filter(item => item !== '');
        breadcrumbHTML += '<a class="text-main">' + `<span data-i18n="${breadcrumbArray.pop().replace(/\.html$/, '')}.title"></span>` + '</a>';
    }

    // Chèn breadcrumb vào HTML
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Gọi API để lấy chi tiết sản phẩm nếu là trang chi tiết sản phẩm
function checkAndRenderBreadcrumb() {
    const currentUrl = window.location.pathname;

    // Kiểm tra nếu URL chứa "product-detail" (có thể thay đổi theo tên file HTML trang chi tiết của bạn)
    if (currentUrl.includes('detailProduct.html')) {
        const productId = new URLSearchParams(window.location.search).get('id'); // Lấy id sản phẩm từ URL
        const currentLanguage = localStorage.getItem('userLanguage') || 'vi'; // Lấy ngôn ngữ hiện tại từ localStorage

        // Gọi API lấy chi tiết sản phẩm
        fetch(`http://localhost:3001/${currentLanguage}/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                // Gọi hàm renderBreadcrumb với tên sản phẩm
                renderBreadcrumb(product.name);
            })
            .catch(error => {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            });
    } else {
        // Nếu không phải trang chi tiết sản phẩm, hiển thị breadcrumb bình thường
        renderBreadcrumb();
    }
}

// Gọi hàm khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    checkAndRenderBreadcrumb();
});
