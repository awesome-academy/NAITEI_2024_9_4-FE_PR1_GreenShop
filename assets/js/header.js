fetch('/src/layouts/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    executeHeaderScripts();
    addLanguageSwitchEvents();
    const currentPath = window.location.pathname;
    if (currentPath.includes('/products') || currentPath === '/src/pages/home.html') {
      showProducts();
    }
    if(currentPath.includes('/cart')) {
      if(!isLogin()){
        window.location.href = '/src/pages/login.html';
      }
    }
    checkLogin();
    logout();
    cartHeader();
  })
  .catch(error => console.error('Error loading header:', error));

const addLanguageSwitchEvents = () => {
  const langViBtn = document.getElementById('lang-vi');
  const langEnBtn = document.getElementById('lang-en');

  if (langViBtn && langEnBtn) {
    langViBtn.addEventListener('click', () => switchLanguage('vi', langViBtn, langEnBtn));
    langEnBtn.addEventListener('click', () => switchLanguage('en', langEnBtn, langViBtn));
    const currentLang = getLanguage();
    if (currentLang === 'vi') {
      langViBtn.classList.add('text-green-500');
      langEnBtn.classList.remove('text-green-500');
    } else if (currentLang === 'en') {
      langEnBtn.classList.add('text-green-500');
      langViBtn.classList.remove('text-green-500');
    }
  } else {
    console.error('Không tìm thấy phần tử với id lang-vi hoặc lang-en');
  }
}

const switchLanguage = (lang, activeBtn, inactiveBtn) => {
  const currentPath = window.location.pathname;
  setLanguage(lang);
  if (currentPath.includes('/products') || currentPath === '/src/pages/home.html') {
    showProducts();
  }
  loadTranslations(lang);
  activeBtn.classList.add('text-green-500');
  inactiveBtn.classList.remove('text-green-500');
}

executeHeaderScripts = () =>{
  const toggleMenu = () => document.getElementById('mobile-menu').classList.toggle('hidden');

  document.getElementById('mobile-menu-toggle').addEventListener('click', toggleMenu);

  const toggleVisibility = (elementId, show) => {
    document.getElementById(elementId).classList.toggle('hidden', !show);
  };

  document.getElementById('mobile-icon-down').addEventListener('click', () => {
    toggleVisibility('mobile-child-product', true);
    toggleVisibility('mobile-icon-down', false);
    toggleVisibility('mobile-icon-up', true);
  });

  document.getElementById('mobile-icon-up').addEventListener('click', () => {
    toggleVisibility('mobile-child-product', false);
    toggleVisibility('mobile-icon-down', true);
    toggleVisibility('mobile-icon-up', false);
  });

  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  document.getElementById('search-icon').addEventListener('click', () => {
    const isHidden = searchForm.classList.contains('hidden');
    searchForm.classList.toggle('hidden', !isHidden);
    if (isHidden) searchInput.focus();
  });

  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && searchInput.value.trim() !== '') {
      event.preventDefault();
      searchForm.submit();
    }
  });

  document.getElementById('user-info').addEventListener('click', () => {
    document.getElementById('user-action').classList.contains('hidden') ? document.getElementById('user-action').classList.remove('hidden') : document.getElementById('user-action').classList.add('hidden');
  });
}

const checkLogin = async () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    const user = decodeJWT(token);
    
    document.getElementById('login-register').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-name').textContent = user.fullName;
  }
}

const logout = () => {
  document.getElementById('logout').addEventListener('click', async () => {
    const newCart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = decodeJWT(sessionStorage.getItem('token'));
    let data = {};
    sessionStorage.removeItem('token');
    console.log(user);
    if(newCart.length > 0){
      data = {
        listCart: newCart,
        userId: user.id,
        status: 0
      }
      await post('carts', data);
    }
    localStorage.removeItem('cart');
    window.location.href = '/src/pages/home.html';
  });
}

const isLogin = () => {
  return sessionStorage.getItem('token') ? true : false;
}
