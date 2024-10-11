document.addEventListener('DOMContentLoaded', function () {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productContainer = document.getElementById('productContainer');

    loadTranslations(getLanguage());

    // Hàm hiển thị dạng Grid
    function showGridView() {
        fetch('../../src/layouts/grid.html')
            .then(response => response.text())
            .then(data => {
                productContainer.innerHTML = data;
                loadTranslations(getLanguage() || 'vi');
            });
    }

    // Hàm hiển thị dạng List
    function showListView() {
        fetch('../../src/layouts/list.html')
            .then(response => response.text())
            .then(data => {
                productContainer.innerHTML = data;
                loadTranslations(getLanguage() || 'vi');
            });
    }

    // Mặc định hiển thị Grid
    showGridView();

    // Chuyển sang Grid View khi click
    gridViewBtn.addEventListener('click', showGridView);

    // Chuyển sang List View khi click
    listViewBtn.addEventListener('click', showListView);
});
