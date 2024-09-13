import { isAuth } from './authenticate';

if (isAuth) window.location.href = './index.html';

//Import Bootstrap CSS
import './scss/styles.scss';
//Import Bootstrap JS
import * as bootstrap from 'bootstrap';

//Display the html
import { setNotLoading, setLoading } from './utils/spinner';
const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

import { onLogin } from './api/auth';
import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');
const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorElement = document.getElementById('error-message');
const registerLink = document.getElementById('register-link');

logoImg.src = Logo;
picturePreview.src = PeaceChicken;

const login = async (event) => {
  event.preventDefault();
  setLoading(spinnerDiv, mainContainer, navbar);
  try {
    const credentials = {
        email: emailInput.value,
        password: passwordInput.value
    };
    await onLogin(credentials);
    window.location.href = './index.html';
  } catch(error) {
    const errorMessage = 'Incorrect email or password';
    errorElement.innerHTML = errorMessage;
    errorElement.classList.remove('d-none');
    setNotLoading(spinnerDiv, mainContainer, navbar);
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