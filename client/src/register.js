// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onRegister } from './api/auth';

const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const checkboxInput = document.getElementById('checkbox');
const errorElement = document.getElementById('error-message');
const loginLink = document.getElementById('login-link');

const registerUser = async (event) => {
  event.preventDefault();
  if (checkboxInput.checked) {
    try {
      const credentials = {
          email: emailInput.value,
          password: passwordInput.value
      };
      await onRegister(credentials);
      window.location.href = './profile.html';
    } catch(error) {
      const errorMessage = error.response.data.errors[0].msg; //error from axios
      errorElement.innerHTML = errorMessage;
      errorElement.classList.remove('d-none')
      if (errorMessage === 'Email already exists' || errorMessage === 'Please enter a valid email address') {
        emailInput.classList.add('border-danger');
      } else if (errorMessage === 'Password must be between 6 and 15 characters') {
        passwordInput.classList.add('border-danger');
      };
    };
  } else {
    errorElement.innerHTML = 'You must check the box in order to sign up';
    errorElement.classList.remove('d-none');
  }
};

const clearError = () => {
  emailInput.classList.remove('border-danger');
  passwordInput.classList.remove('border-danger');
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

form.addEventListener('submit', registerUser);
emailInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);
checkboxInput.addEventListener('input', clearError);
loginLink.addEventListener('click', () => { window.location.href = './login.html' })