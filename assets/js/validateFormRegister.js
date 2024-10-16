let data = {};

const validateFormRegister = (message) => {
  let isValid = true;
  const fields = [
    {
      name: 'fullName',
      validation: (value,name) => {
        if(value === '') {
          return message[`error_${name}`];
        }
        data['fullName'] = value;
        return null;
      }
    },
    {
      name: 'phoneNumber',
      validation: (value,name) => {
        if(value === '') {
          return message[`error_${name}`];
        }
        data['phoneNumber'] = value;
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
        data['email'] = value;
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
        data['webURL'] = value;
        return null;
      }
    },
    {
      name: 'password',
      validation: (value,name) => {
        if(value.length < 6) {
          return message[`error_${name}`];
        }
        data['password'] = value;
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
        data['password'] = value;
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
document.getElementById('formRegister').addEventListener('submit', async (e) => {
  e.preventDefault();

  const currentLang = getLanguage();
  try {
    const response = await fetch(`/assets/locales/${currentLang}.json`);
    const translations = await response.json();
    const isValid = validateFormRegister(translations.alert);
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    if (isValid) {
      const payload = {
        ...data,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
      };

      data.password = await hashPassword(data.password);
      const encodeToken = await createJWT(jwtHeader, payload, jwtSecret);
      sessionStorage.setItem('token', encodeToken);
      
      accounts.push({
        ...data
      })
      localStorage.setItem('accounts',JSON.stringify(accounts));
      window.location.href = '/src/pages/home.html';
    }
    data = {};
  } catch (error) {
    console.error('Lỗi tải bản dịch:', error)
  }
});
