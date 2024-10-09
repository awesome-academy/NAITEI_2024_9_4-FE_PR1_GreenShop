// Hàm render pagination
function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination'); // Lấy thẻ chứa pagination

    let paginationHTML = '';

    // Tạo nút "Previous" (Trang trước)
        paginationHTML += `
            <a href="?page=${currentPage - 1}" class="px-4 py-2 bg-gray-200 hover:bg-gray-300">Trang trước</a>
        `;

    // Tạo nút số trang
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `
                <span class="px-4 py-2 bg-green-500 text-white">${i}</span>
            `;
        } else {
            paginationHTML += `
                <a href="?page=${i}" class="px-4 py-2 bg-gray-200 hover:bg-gray-300">${i}</a>
            `;
        }
    }

    // Tạo nút "Next" (Trang sau)
        paginationHTML += `
            <a href="?page=${totalPages}" class="px-4 py-2 bg-gray-200 hover:bg-gray-300">Trang cuối</a>
        `;

    // Chèn pagination vào HTML
    paginationContainer.innerHTML = paginationHTML;
}

// Gọi hàm khi trang tải
document.addEventListener('DOMContentLoaded', function () {
    // Ví dụ cho 5 trang và trang hiện tại là trang 2
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1; // Lấy số trang hiện tại từ URL, mặc định là trang 1
    const totalPages = 4; // Giả định có 5 trang

    renderPagination(totalPages, currentPage);
});
