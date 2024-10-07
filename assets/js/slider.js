const initializeSlider = (sliderContainer, prevButton, nextButton, visibleItems) => {
  const sliders = sliderContainer.querySelectorAll('.productSlider');
  const productCards = sliderContainer.id==="news" ? sliderContainer.querySelectorAll('.news-card') : sliderContainer.querySelectorAll('.product-card');
  const cardWidth = productCards[1].offsetLeft;
  let currentIndex = 0;
  const maxIndex = sliderContainer.id==="news" ? -(productCards.length - visibleItems) :-(productCards.length / 2 - visibleItems);

  const updateSliderPosition = (newIndex) => {
    currentIndex = newIndex;
    sliders.forEach(slider => {
      slider.style.left = `${currentIndex * cardWidth}px`;
      slider.style.transition = 'left 0.5s ease-in-out';
    });
  };

  nextButton.addEventListener('click', () => {
    if (currentIndex > maxIndex) {
      updateSliderPosition(currentIndex - 1);
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentIndex < 0) {
      updateSliderPosition(currentIndex + 1);
    }
  });

  updateSliderPosition(0);
};

window.onload = () => {
  const promoProductsSlider = document.getElementById('promo_products');
  const promoPrevButton = promoProductsSlider.querySelector('#promo_products .prevSlider');
  const promoNextButton = promoProductsSlider.querySelector('#promo_products .nextSlider');

  const newProductsSlider = document.getElementById('new_products');
  const newPrevButton = newProductsSlider.querySelector('#new_products .prevSlider');
  const newNextButton = newProductsSlider.querySelector('#new_products .nextSlider');

  const newsSlider = document.getElementById('news');
  const newsPrevButton = newsSlider.querySelector('#news .prevSlider');
  const newsNextButton = newsSlider.querySelector('#news .nextSlider');

  initializeSlider(promoProductsSlider, promoPrevButton, promoNextButton, 3);
  initializeSlider(newProductsSlider, newPrevButton, newNextButton, 4);
  initializeSlider(newsSlider, newsPrevButton, newsNextButton, 3);
};
