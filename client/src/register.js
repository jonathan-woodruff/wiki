// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onRegister } from './api/auth';

const button = document.getElementById('submit');
const form = document.getElementById('form');

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
    const errorMessage = error.response.data.errors[0]; //error from axios
    console.log(errorMessage);
  };
};

form.addEventListener('submit', registerUser);