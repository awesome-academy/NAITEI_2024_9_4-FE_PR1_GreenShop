const getUserByEmail = (email) => {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const user = accounts.find(account => account.email === email);
  return user;
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const isEmailValid = emailRegex.test(emailInput.value);
  emailError.classList[isEmailValid ? 'add' : 'remove']('hidden');

  const isPasswordValid = passwordInput.value.length >= 6;
  passwordError.classList[isPasswordValid ? 'add' : 'remove']('hidden');

  if(isEmailValid && isPasswordValid) {
    const user = getUserByEmail(emailInput.value);
    const currentLang = getLanguage();
    const response = await fetch(`/assets/locales/${currentLang}.json`);
    const translations = await response.json();
    if(user) {
      if(await hashPassword(passwordInput.value) === user.password) {
        const payload = {
          ...user,
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        };
        const token = await createJWT(jwtHeader, payload, jwtSecret);
        sessionStorage.setItem('token', token);
        const cart = await getCartByEmail('carts',user.email);
        if(cart.length > 0) {
          localStorage.setItem('cart', JSON.stringify(cart[0].listCart));
        }
        window.location.href = '/src/pages/home.html';
      } else {
        showToasts('error', translations.alert.login_error);
      }
    }else {
      showToasts('error', translations.alert.login_error);
    }
  }
});
