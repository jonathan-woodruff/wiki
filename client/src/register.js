//Import Bootstrap CSS
import './scss/styles.scss';
//Import Bootstrap JS
import * as bootstrap from 'bootstrap';

//Configure the navbar
import { isAuth } from './authenticate';
const navCreateLI = document.getElementById('nav-create-li');
const navCreateA = document.getElementById('nav-create-a');
const navDropdown = document.getElementById('nav-dropdown');
const navRegisterButton = document.getElementById('nav-register-button');
configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);

//Display the html
import { setNotLoading, setLoading } from './utils/spinner';
const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

import { onRegister } from './api/auth';
import { configureNav, logout } from './utils/navbar';

import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const checkboxInput = document.getElementById('checkbox');
const errorElement = document.getElementById('error-message');
const loginLink = document.getElementById('login-link');
const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');
const logoutLink = document.getElementById('logout-link');

logoImg.src = Logo;
picturePreview.src = PeaceChicken;

let isNameError = false;
let isEmailError = false;
let isPasswordError = false;
let isCheckboxError = false;

const registerUser = async (event) => {
  event.preventDefault();
  if (nameInput.value && checkboxInput.checked) {
    setLoading(spinnerDiv, mainContainer, navbar);
    try {
      const credentials = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value
      };
      await onRegister(credentials);
      window.location.href = './edit-profile.html';
    } catch(error) {
      const errorMessage = error.response.data.errors[0].msg; //error from axios
      errorElement.innerHTML = errorMessage;
      errorElement.classList.remove('d-none')
      if (errorMessage === 'Email already exists' || errorMessage === 'Please enter a valid email address') {
        isEmailError = true;
        emailInput.classList.add('border-danger');
      } else if (errorMessage === 'Password must be between 6 and 15 characters') {
        isPasswordError = true;
        passwordInput.classList.add('border-danger');
      };
      setNotLoading(spinnerDiv, mainContainer, navbar);
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

const clearError = (field) => {
  if (field === 'name' && isNameError) {
    nameInput.classList.remove('border-danger');
    clearErrorMessage();
    resetErrorStates();
  } else if (field === 'email' && isEmailError) {
    emailInput.classList.remove('border-danger');
    clearErrorMessage();
    resetErrorStates();
  } else if (field === 'password' && isPasswordError) {
    passwordInput.classList.remove('border-danger');
    clearErrorMessage();
    resetErrorStates();
  } else if (field === 'checkbox' && isCheckboxError) {
    checkboxInput.classList.remove('border-danger');
    clearErrorMessage();
    resetErrorStates();
  }
};

const goLogin = () => window.location.href = `./login.html?${window.location.search}`;

form.addEventListener('submit', registerUser);
nameInput.addEventListener('input', () => { clearError('name') });
emailInput.addEventListener('input', () => { clearError('email') });
passwordInput.addEventListener('input', () => { clearError('password') });
checkboxInput.addEventListener('input', () => { clearError('checkbox') });
loginLink.addEventListener('click', goLogin);
logoutLink.addEventListener('click', logout);
navRegisterButton.addEventListener('click', goLogin);