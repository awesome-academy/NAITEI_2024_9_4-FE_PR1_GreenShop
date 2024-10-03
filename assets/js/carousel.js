let list = document.querySelector('.carousel__list');
let items = document.querySelectorAll('.carousel__list-item');
let dots = document.querySelectorAll('.dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

let active = 0;
let lengthItems = items.length - 1; 

let refreshSlide = setInterval(() => {
  next.click();
}, 5000);

const changeDots = (lastActiveDot) => {
  lastActiveDot.classList.remove('bg-main');
  lastActiveDot.classList.add('bg-white');
  dots[active].classList.remove('bg-white');
  dots[active].classList.add('bg-main');
}

const refreshIntervalSlide = () => {
  clearInterval(refreshSlide);
  refreshSlide = setInterval(() => {
    next.click();
  }, 5000);
} 

const reloadSlider = () => {
  let checkLeft = items[active].offsetLeft;
  let lastActiveDot = document.querySelector('.dots li.bg-main');
  list.style.left = `-${checkLeft}px`;
  changeDots(lastActiveDot);
  refreshIntervalSlide();
}

next.onclick = () => {
  active + 1 > lengthItems ? active = 0 : active += 1;
  reloadSlider();
}

prev.onclick = () => { 
  active - 1 < 0 ? active = lengthItems : active -= 1;
  reloadSlider();
}

dots.forEach((dot, index) => {
  dot.onclick = () => {
    active = index;
    reloadSlider();
  }
});
