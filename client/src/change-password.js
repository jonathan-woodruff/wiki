/************************************************************
 * Ensure the user is authenticated 
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
if (!isAuth) window.location.href = './login.html';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout } from './utils/navbar';
import Logo from './images/logo.png';
import { refreshAvatar } from './utils/navbar';

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  logoImg.src = Logo;
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const navRegisterButton = document.getElementById('nav-register-button');
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
setNotLoading(spinnerDiv, mainContainer, navbar);

/************************************************************
 * All other JavaScript
************************************************************/
import { putPassword, checkForCookie } from './api/auth';
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';

const form = document.getElementById('form');
const currentPasswordInput = document.getElementById('current-password');
const newPasswordInput1 = document.getElementById('new-password-1');
const newPasswordInput2 = document.getElementById('new-password-2');
const errorElement = document.getElementById('error-message');
const logoutLink = document.getElementById('logout-link');

let isCurrentPasswordError = false;
let isNewPasswordError1 = false;
let isNewPasswordError2 = false;

const handleLogout = async () => {
  try {
      await logout();
      window.location.reload();
  } catch(error) {
      console.log(error);
  }
};

const changePassword = async (event) => {
  event.preventDefault();
  if (!currentPasswordInput.value) {
    isCurrentPasswordError = true;
    currentPasswordInput.classList.add('border-danger');
    errorElement.innerHTML = 'Please enter your current password';
    errorElement.classList.remove('d-none');
  } else if (!newPasswordInput1.value) {
    isNewPasswordError1 = true;
    newPasswordInput1.classList.add('border-danger');
    errorElement.innerHTML = 'Please enter your new password';
    errorElement.classList.remove('d-none');
  } else if (!newPasswordInput2.value) {
    isNewPasswordError2 = true;
    newPasswordInput2.classList.add('border-danger');
    errorElement.innerHTML = 'Please enter your new password again';
    errorElement.classList.remove('d-none');
  } else if (newPasswordInput1.value !== newPasswordInput2.value) {
    isNewPasswordError2 = true;
    newPasswordInput2.classList.add('border-danger');
    errorElement.innerHTML = 'The new password fields must be matching';
    errorElement.classList.remove('d-none');
  } else {
    const submitButton = document.getElementById('submit');
    setLoadingButton(submitButton, 'Submitting...');
    try {
        const payload = {
            currentPassword: currentPasswordInput.value,
            password: newPasswordInput1.value
        };
        await putPassword(payload);
        handleLogout();
    } catch(error) {
        let errorMessage = error.response.data.errors[0].msg;
        const axiosError = errorMessage.toLowerCase();
        if (!axiosError.includes('password')) {
            errorMessage = 'Could not change your password. Check your network connection.'
        };
        errorElement.innerHTML = errorMessage;
        errorElement.classList.remove('d-none')
        if (errorMessage === 'Password must be between 6 and 15 characters') {
            isNewPasswordError1 = true;
            newPasswordInput1.classList.add('border-danger');
        } else if (errorMessage === 'Incorrect current password') {
            isCurrentPasswordError = true;
            currentPasswordInput.classList.add('border-danger');
        }
        setNotLoadingButton(submitButton, 'Change Password');
    }
  }
};

const clearErrorMessage = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const resetErrorStates = () => {
  isCurrentPasswordError = false;
  isNewPasswordError1 = false;
  isNewPasswordError2 = false;
};

const clearError = (event) => {
  const inputField = event.currentTarget;
  if (
    (inputField.id === 'current-password' && isCurrentPasswordError)
    || (inputField.id === 'new-password-1' && isNewPasswordError1)
    || (inputField.id === 'new-password-2' && isNewPasswordError2)
  ) {
    inputField.classList.remove('border-danger');
    clearErrorMessage();
    resetErrorStates();
  }
};

const handlePasswordInput1 = (event) => {
  const p2Div = document.getElementById('p2-div');
  p2Div.classList.remove('d-none');
  clearError(event);
};

const handlePageshow = async () => {
    try {
      await checkForCookie();
    } catch(error) {
      if (error.response.status === 401) {
        localStorage.setItem('isAuth', 'false');
        window.location.href = './login.html';
      }
    }
};

form.addEventListener('submit', changePassword);
currentPasswordInput.addEventListener('input', clearError);
newPasswordInput1.addEventListener('input', handlePasswordInput1);
newPasswordInput2.addEventListener('input', clearError);
logoutLink.addEventListener('click', handleLogout);
window.addEventListener('pageshow', handlePageshow);
