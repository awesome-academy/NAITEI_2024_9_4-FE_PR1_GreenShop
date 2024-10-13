    // Get elements
    const productInfoBtn = document.getElementById('product-info-btn');
    const customerReviewsBtn = document.getElementById('customer-reviews-btn');
    const productInfoSection = document.getElementById('product-infor');
    const customerReviewsSection = document.getElementById('customer-reviews');
  
    // Event listener for "THÔNG TIN SẢN PHẨM"
    productInfoBtn.addEventListener('click', function() {
      // Show product info and hide customer reviews
      productInfoSection.classList.remove('hidden');
      customerReviewsSection.classList.add('hidden');
      
      // Change button style to active
      productInfoBtn.classList.add('text-green-500', 'border-t-2', 'border-gray-700');
      customerReviewsBtn.classList.remove('text-green-500', 'border-t-2', 'border-gray-700');
    });
  
    // Event listener for "KHÁCH HÀNG ĐÁNH GIÁ"
    customerReviewsBtn.addEventListener('click', function() {
      // Show customer reviews and hide product info
      customerReviewsSection.classList.remove('hidden');
      productInfoSection.classList.add('hidden');
      
      // Change button style to active
      customerReviewsBtn.classList.add('text-green-500', 'border-t-2', 'border-gray-700');
      productInfoBtn.classList.remove('text-green-500', 'border-t-2', 'border-gray-700');
    });  
