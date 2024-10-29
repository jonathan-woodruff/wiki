/************************************************************
 * Ensure the user is not authenticated 
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
if (isAuth) window.location.href = './index.html';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import '../css/buttons.css';

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, refreshAvatar } from '../utils/navbar';
import Logo from '../images/logo.png';

const navRegisterButton = document.getElementById('nav-register-button');

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  logoImg.src = Logo;
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navDropdown = document.getElementById('nav-dropdown');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
};

if (!isAuth) {
  setSources();
  setNav();
}

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading, setLoadingButton, setNotLoadingButton } from '../utils/spinner';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
if (!isAuth) setNotLoading(spinnerDiv, mainContainer, navbar, footer);

/************************************************************
 * All other JavaScript
************************************************************/
import { onRegister } from '../api/auth';

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const checkboxInput = document.getElementById('checkbox');
const errorElement = document.getElementById('error-message');
const loginLink = document.getElementById('login-link');
const beerButton = document.getElementById('beer');

let isNameError = false;
let isEmailError = false;
let isPasswordError = false;
let isCheckboxError = false;

const goSuccess = () => {
  const params = new URLSearchParams();
  params.append('header', 'Almost there!')
  params.append('message', 'I sent you an email. Please click the email confirmation link to finish signing up.');
  const url = `./success.html?${params.toString()}`;
  window.location.href = url;
};

const registerUser = async (event) => {
  event.preventDefault();
  clearAllErrors();
  if (nameInput.value && emailInput.value && passwordInput.value && checkboxInput.checked) {
    const registerButton = document.getElementById('submit');
    setLoadingButton(registerButton, 'Signing Up...');
    try {
      const credentials = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value
      };
      await onRegister(credentials);
      goSuccess();
    } catch(error) {
      const errorMessage = 'response' in error ? error.response.data.error : 'Error: Could not sign you up.';
      errorElement.innerHTML = errorMessage;
      errorElement.classList.remove('d-none')
      if (errorMessage === 'Email already exists' || errorMessage === 'Please enter a valid email address') {
        isEmailError = true;
        emailInput.classList.add('border-danger');
      } else if (errorMessage === 'Password must be between 6 and 15 characters') {
        isPasswordError = true;
        passwordInput.classList.add('border-danger');
      };
      setNotLoadingButton(registerButton, 'Sign Up');
    };
  } else if (!nameInput.value) {
    isNameError = true;
    nameInput.classList.add('border-danger');
    errorElement.innerHTML = 'Please enter your name';
    errorElement.classList.remove('d-none');
  } else if (!checkboxInput.checked) {
    isCheckboxError = true;
    errorElement.innerHTML = 'You must check the box in order to sign up';
    errorElement.classList.remove('d-none');
  } else if (!emailInput.value) {
    isEmailError = true;
    emailInput.classList.add('border-danger');
    errorElement.innerHTML = 'Please enter an email address';
    errorElement.classList.remove('d-none');
  } else if (!passwordInput.value) {
    isPasswordError = true;
    passwordInput.classList.add('border-danger');
    errorElement.innerHTML = 'Please enter a password';
    errorElement.classList.remove('d-none');
  }
};

const clearErrorMessage = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const resetErrorStates = () => {
  isNameError = false;
  isEmailError = false;
  isPasswordError = false;
  isCheckboxError = false;
};

const clearAllErrors = () => {
  nameInput.classList.remove('border-danger');
  emailInput.classList.remove('border-danger');
  passwordInput.classList.remove('border-danger');
  checkboxInput.classList.remove('border-danger');
  clearErrorMessage();
  resetErrorStates();
};

const clearError = (event) => {
  const inputField = event.currentTarget;
  if (
    (inputField.id === 'name' && isNameError)
    || (inputField.id === 'email' && isEmailError)
    || (inputField.id === 'password' && isPasswordError)
    || (inputField.id === 'checkbox' && isCheckboxError)
  ) {
    inputField.classList.remove('border-danger');
    clearErrorMessage();
    resetErrorStates();
  }
};

const goLogin = () => window.location.href = `./login.html${window.location.search}`;

form.addEventListener('submit', registerUser);
nameInput.addEventListener('input', clearError);
emailInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);
checkboxInput.addEventListener('input', clearError);
loginLink.addEventListener('click', goLogin);
navRegisterButton.addEventListener('click', goLogin);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');