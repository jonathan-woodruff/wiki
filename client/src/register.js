// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onRegister } from './api/auth';

const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorElement = document.getElementById('error-message');
const loginLink = document.getElementById('login-link');

// Write your code here:
const registerUser = async (event) => {
  event.preventDefault();
  try {
    const credentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    await onRegister(credentials);
    window.location.href = './index.html';
  } catch(error) {
    const errorMessage = error.response.data.errors[0].msg; //error from axios
    errorElement.innerHTML = errorMessage;
    errorElement.classList.remove('d-none')
    if (errorMessage === 'Email already exists' || errorMessage === 'Please enter a valid email address') {
      document.getElementById('email').classList.add('border-danger');
    } else if (errorMessage === 'Password must be between 6 and 15 characters') {
      document.getElementById('password').classList.add('border-danger');
    };
  };
};

const clearEmailError = () => {
  emailInput.classList.remove('border-danger');
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const clearPasswordError = () => {
  passwordInput.classList.remove('border-danger');
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

form.addEventListener('submit', registerUser);
emailInput.addEventListener('input', clearEmailError);
passwordInput.addEventListener('input', clearPasswordError);
loginLink.addEventListener('click', () => { window.location.href = './login.html' })