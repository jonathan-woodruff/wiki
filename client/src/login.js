// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onLogin } from './api/auth';

const form = document.getElementById('form');

// Write your code here:
const login = async (event) => {
  event.preventDefault();
  try {
    const credentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    await onLogin(credentials);
    localStorage.setItem('isAuth', 'true');
    window.location.href = './index.html';
  } catch(error) {
    const errorMessage = error.response.data.errors[0]; //error from axios
    console.log(errorMessage);
  };
};

form.addEventListener('submit', login);