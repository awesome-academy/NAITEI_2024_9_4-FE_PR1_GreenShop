const loadTranslations = (lang) =>{
  fetch(`../../assets/locales/${lang}.json`)
    .then(response => response.json())
    .then(translations => {
      console.log(document.querySelectorAll('[data-i18n]'));
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        console.log(key);
        const keys = key.split('.');
        console.log(keys);
        let translation = translations[keys[0]][keys[1]];
        console.log(translation);
        if (translation) {
          element.textContent = translation;
        }
      });
      document.querySelectorAll('[data-placeholder]').forEach(element => {
        const placeholderKey = element.getAttribute('data-placeholder');
        const placeholderTranslation = translations.placeholders[placeholderKey];
        if (placeholderTranslation) {
          element.placeholder = placeholderTranslation;
        }
      });
    })
    .catch(error => console.error('Error loading translations:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  loadTranslations('vi');
});
