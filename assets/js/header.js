fetch('../../src/layouts/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    executeHeaderScripts();
    addLanguageSwitchEvents();
  })
  .catch(error => console.error('Error loading header:', error));

const addLanguageSwitchEvents = () => {
  const langViBtn = document.getElementById('lang-vi');
  const langEnBtn = document.getElementById('lang-en');

  if (langViBtn && langEnBtn) {
    langViBtn.addEventListener('click', () => switchLanguage('vi', langViBtn, langEnBtn));
    langEnBtn.addEventListener('click', () => switchLanguage('en', langEnBtn, langViBtn));
  } else {
    console.error('Không tìm thấy phần tử với id lang-vi hoặc lang-en');
  }
}

const switchLanguage = (lang, activeBtn, inactiveBtn) => {
  localStorage.setItem('lang', lang);
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
}
