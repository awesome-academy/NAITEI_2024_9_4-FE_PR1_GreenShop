const setLanguage = (lang) => {
  localStorage.setItem('userLanguage', lang);
 }

 const getLanguage = () => {
  return localStorage.getItem('userLanguage') || 'vi';
 }

const loadTranslations = (lang) =>{
  fetch(`../../assets/locales/${lang}.json`)
    .then(response => response.json())
    .then(translations => {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[keys[0]][keys[1]];
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
  addLanguageSwitchEvents();
  loadTranslations(getLanguage());
});
