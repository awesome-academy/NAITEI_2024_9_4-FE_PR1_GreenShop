document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra nếu localStorage có dữ liệu hide_popup_home là true
  if (localStorage.getItem('hide_popup_home') === 'true') {
    return; // Không thực hiện load popup nếu người dùng đã chọn không hiển thị lại
  }

  // Dùng fetch để tải nội dung của popup.html vào trang
  fetch('../../src/layouts/popup.html')
    .then(response => response.text())
    .then(data => {
      // Chèn nội dung vào #popup-container
      document.getElementById('popup-container').innerHTML = data;

      // Lấy ngôn ngữ hiện tại từ localStorage hoặc mặc định là 'vi'
      const currentLang = localStorage.getItem('lang') || 'vi';

      // Gọi hàm loadTranslations để dịch các chuỗi văn bản trong popup
      loadTranslations(currentLang);

      // Hiển thị popup khi trang tải xong
      const popupOverlay = document.getElementById("popup-overlay");
      popupOverlay.classList.remove("hidden");

      // Đóng popup khi nhấn vào nút X
      document.getElementById("popup-close-btn").onclick = function () {
        popupOverlay.classList.add("hidden");
      };

      // Đóng popup nếu chọn "Không hiển thị lại"
      document.getElementById("not-show-again").onclick = function () {
        if (this.checked) {
          popupOverlay.classList.add("hidden");
          // Lưu vào localStorage
          localStorage.setItem('hide_popup_home', 'true');
        }
      };
    })
    .catch(error => console.error('Lỗi khi tải popup:', error));
});
