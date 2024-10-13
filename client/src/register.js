/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import './css/buttons.css';

/************************************************************
 * Configure the navbar
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
import { configureNav, logout } from './utils/navbar';
import Logo from './images/logo.png';
import { refreshAvatar } from './utils/navbar';

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
  const navCommunityLI = document.getElementById('nav-community-li');
  const navCommunityA = document.getElementById('nav-community-a');
  const navDropdown = document.getElementById('nav-dropdown');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};

setSources();
setNav();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
setNotLoading(spinnerDiv, mainContainer, navbar, footer);

/************************************************************
 * All other JavaScript
************************************************************/
import { onRegister } from './api/auth';
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const checkboxInput = document.getElementById('checkbox');
const errorElement = document.getElementById('error-message');
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');
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
      let errorMessage = error.response.data.errors[0].msg;
      const axiosError = errorMessage.toLowerCase();
      if (!(axiosError.includes('email') || axiosError.includes('password'))) {
        errorMessage = 'Could not sign you up. Check your network connection.'
      };
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

const handleLogout = async () => {
  try {
      await logout();
      window.location.reload();
  } catch(error) {
      console.log(error);
  }
};

form.addEventListener('submit', registerUser);
nameInput.addEventListener('input', clearError);
emailInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);
checkboxInput.addEventListener('input', clearError);
loginLink.addEventListener('click', goLogin);
logoutLink.addEventListener('click', handleLogout);
navRegisterButton.addEventListener('click', goLogin);
//window.addEventListener("pageshow", handlePageshow)
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');