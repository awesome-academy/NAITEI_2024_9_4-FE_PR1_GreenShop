const validateFormContact = (message) => {
  let isValid = true;
  const fields = [
    {
      name: 'fullName',
      validation: (value,name) => {
        if(value === '') {
          return message[`error_${name}`];
        }
        return null;
      }
    },
    {
      name: 'phoneNumber',
      validation: (value,name) => {
        if(value === '') {
          return message[`error_${name}`];
        }
        return null;
      }
    },
    {
      name: 'email',
      validation: (value,name) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) {
          return message[`error_${name}`];
        }
        return null;
      }
    },
    {
      name: 'comments',
      validation: (value,name) => {
        if(value === '') {
          return message[`error_${name}`];
        }
        return null;
      }
    }
  ];

  fields.forEach(field => {
    const inputElement = document.querySelector(`input[name='${field.name}']`);
    const textareaElement = document.querySelector(`textarea[name='${field.name}']`);

    const input = (inputElement ? inputElement.value : '') || (textareaElement ? textareaElement.value : '');
    const error = document.querySelector(`[data-error='${field.name}']`);
    const errorText = field.validation(input,field.name);
    if(errorText) {
      error.textContent = errorText;
      error.classList.remove('hidden');
      isValid = false;
    }else {
      error.classList.add('hidden');
    }
  });

  return isValid;
}

document.getElementById('formContact').addEventListener('submit', (e) => {
  e.preventDefault();

  const currentLang = getLanguage();

  fetch(`/assets/locales/${currentLang}.json`)
    .then(response => response.json())
    .then(translations => {
      const isValid = validateFormContact(translations.alert);
      if (isValid) {
        showToasts("success",translations.alert.contact_success);
      }
    })
    .catch(error => console.error('Lỗi tải bản dịch:', error));
});
