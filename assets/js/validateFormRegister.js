const successToast = (toast, right = '20px', opacity = '1') => {
  toast.style.right = right;
  toast.style.opacity = opacity;
};

const validateFormRegister = (message) => {
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
      name: 'webURL',
      validation: (value,name) => {
        const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
        if (!urlRegex.test(value)) {
          return message[`error_${name}`];
        }
        return null;
      }
    },
    {
      name: 'password',
      validation: (value,name) => {
        if(value.length < 6) {
          return message[`error_${name}`];
        }
        return null;
      }
    },
    {
      name: 'confirmPassword',
      validation: (value,name) => {
        const passwordError = document.querySelector('[data-error="password"]').textContent;
        if (passwordError==='') {
          return null;
        }

        const password = document.querySelector('input[name="password"]').value;
        if (value !== password) {
          return message[`error_${name}`];
        }
        return null
      }
    }
  ];

  fields.forEach(field => {
    const input = document.querySelector(`input[name='${field.name}']`).value;
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
document.getElementById('formRegister').addEventListener('submit', (e) => {
  e.preventDefault();

  const currentLang = getLanguage();

  fetch(`/assets/locales/${currentLang}.json`)
    .then(response => response.json())
    .then(translations => {
      const isValid = validateFormRegister(translations.alert);
      if (isValid) {
        successToast(toast);
        setTimeout(() => {
          successToast(toast, '-300px', '0');
        }, 3000);
      }
    })
    .catch(error => console.error('Lỗi tải bản dịch:', error));
});
