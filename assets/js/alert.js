const displayToast = (toast, right = '20px', opacity = '1') => {
  toast.style.right = right;
  toast.style.opacity = opacity;
};

const showToasts = (type,message) => {
  const toast = document.getElementById('toast');
  if(type === 'success'){
    toast.classList.add('text-main');
    toast.querySelector('#icon').classList.add('bg-main');
    toast.querySelector('#icon').innerHTML = '<i class="fas fa-check-circle"></i>';
    toast.querySelector('span').textContent = message;
    setTimeout(() => {
      displayToast(toast, '-200px', '0');
    }, 3000);
  }else if(type === 'error'){
    toast.classList.add('text-red-500');
    toast.querySelector('#icon').classList.add('text-red-500');
    toast.querySelector('#icon').innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    toast.querySelector('span').textContent = message;
    displayToast(toast);
    setTimeout(() => {
      displayToast(toast, '-200px', '0');
    }, 3000);
  }
}
