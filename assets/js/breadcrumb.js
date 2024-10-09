// Function để hiển thị breadcrumb dựa vào URL
function renderBreadcrumb() {
    const breadcrumbContainer = document.getElementById('breadcrumb'); // Lấy thẻ để chèn breadcrumb
    const currentUrl = window.location.pathname; // Lấy URL hiện tại
    console.log(currentUrl); 

    let breadcrumbHTML = '';

    // Xác định breadcrumb dựa trên URL
    if (currentUrl === '/NAITEI_2024_9_4-FE_PR1_GreenShop/src/pages/product.html') {
        breadcrumbHTML = `
            <a href="/" class="hover:underline">Home</a> / 
            <span class="text-green-500">Danh sách sản phẩm</span>
        `;
    } 

    // Chèn breadcrumb vào HTML
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Gọi hàm khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    renderBreadcrumb();
});
