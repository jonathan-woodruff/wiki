// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onLogin } from './api/auth';

const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorElement = document.getElementById('error-message');
const registerLink = document.getElementById('register-link');

// Write your code here:
const login = async (event) => {
  event.preventDefault();
  try {
    const credentials = {
        email: emailInput.value,
        password: passwordInput.value
    };
    await onLogin(credentials);
    localStorage.setItem('isAuth', 'true');
    window.location.href = './index.html';
  } catch(error) {
    const errorMessage = 'Incorrect email or password';
    errorElement.innerHTML = errorMessage;
    errorElement.classList.remove('d-none');
  };
};

const clearError = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

form.addEventListener('submit', login);
emailInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);
registerLink.addEventListener('click', () => { window.location.href = './register.html' })