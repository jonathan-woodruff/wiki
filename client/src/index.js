// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onLogout } from './api/auth';

const button = document.getElementById('logout');

// Write your code here:
const logout = async () => {
  try {
    localStorage.setItem('isAuth', 'false');
    window.location.href = './login.html';
    await onLogout();
  } catch(error) {
    const errorMessage = error.response.data.error; //error from axios
    console.log(errorMessage);
  };
};

button.addEventListener('click', logout);