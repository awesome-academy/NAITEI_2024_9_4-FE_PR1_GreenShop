document.addEventListener('DOMContentLoaded', function () {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productContainer = document.getElementById('productContainer');
    // Tải lại i18n
    const loadTranslations = (lang) => {
        fetch(`../../assets/locales/${lang}.json`)
            .then(response => response.json())
            .then(translations => {
                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const key = element.getAttribute('data-i18n');
                    const keys = key.split('.');
                    let translation = translations[keys[0]][keys[1]];
                    if (translation) {
                        element.textContent = translation;
                    }
                });
            })
            .catch(error => console.error('Error loading translations:', error));
    }

    // Hàm hiển thị dạng Grid
    function showGridView() {
        fetch('../../src/layouts/grid.html')
            .then(response => response.text())
            .then(data => {
                productContainer.innerHTML = data;
                loadTranslations(localStorage.getItem('lang') || 'vi');
            });
    }

    // Hàm hiển thị dạng List
    function showListView() {
        fetch('../../src/layouts/list.html')
            .then(response => response.text())
            .then(data => {
                productContainer.innerHTML = data;
                loadTranslations(localStorage.getItem('lang') || 'vi');
            });
    }

    // Mặc định hiển thị Grid
    showGridView();

    // Chuyển sang Grid View khi click
    gridViewBtn.addEventListener('click', showGridView);

    // Chuyển sang List View khi click
    listViewBtn.addEventListener('click', showListView);
});
