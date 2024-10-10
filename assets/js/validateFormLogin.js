const successToast = (toast, right = '20px', opacity = '1') => {
  toast.style.right = right;
  toast.style.opacity = opacity;
};

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const toast = document.getElementById('toast');

  const isEmailValid = emailInput.value.includes('@');
  emailError.classList[isEmailValid ? 'add' : 'remove']('hidden');

  const isPasswordValid = passwordInput.value.length >= 6;
  passwordError.classList[isPasswordValid ? 'add' : 'remove']('hidden');

  isEmailValid && isPasswordValid && successToast(toast);
  setTimeout(() => {
    isEmailValid && isPasswordValid && successToast(toast, '-300px', '0');
  }, 3000);
});
