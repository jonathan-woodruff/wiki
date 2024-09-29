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
import Logo from './images/logo.png';
import { configureNav, logout } from './utils/navbar';
import { refreshAvatar } from './utils/navbar';

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
  logoImg.src = Logo;
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navCommunityLI = document.getElementById('nav-community-li');
  const navCommunityA = document.getElementById('nav-community-a');
  const navDropdown = document.getElementById('nav-dropdown');
  const navRegisterButton = document.getElementById('nav-register-button');
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
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';
import { checkForCookie } from './api/auth';
import { postCommunity } from './api/main';

const submitButton = document.getElementById('submit');
const reasonInput = document.getElementById('reason');
const amountInput = document.getElementById('amount');
const errorDiv = document.getElementById('error-div');
const errorMessage = document.getElementById('error-message');
const logoutLink = document.getElementById('logout-link');
const toastDiv = document.getElementById('toast');

let isReasonError = false;
let isAmountError = false;

const handleSubmit = async (event) => {
    event.preventDefault();
    const otherInput = document.getElementById('other');
    const payload = {
        reason: reasonInput.value,
        amount: amountInput.value,
        other: otherInput.value
    };
    if (!payload.reason) {
      isReasonError = true;
      errorMessage.innerHTML = 'Please describe why you are interested in joining';
      errorDiv.classList.remove('d-none');
      reasonInput.classList.add('border');
      reasonInput.classList.add('border-danger');
    } else if (!payload.amount) {
      isAmountError = true;
      errorMessage.innerHTML = 'Please specify an amount';
      errorDiv.classList.remove('d-none');
      amountInput.classList.add('border');
      amountInput.classList.add('border-danger');
    } else {
        try {
          setLoadingButton(submitButton, 'Submitting...');
          await postCommunity(payload);
          reasonInput.value = null;
          amountInput.value = null;
          otherInput.value = null;
          setNotLoadingButton(submitButton, 'Submit');
          toastDiv.style.display = 'block';
          const toast = new bootstrap.Toast(toastDiv);
          toast.show();
        } catch(error) {
          setNotLoadingButton(submitButton, 'Submit');
          console.log(error);
        }
    }
};

const hideToast = () => {
  toastDiv.style.display = 'none';
};

const clearErrorMessage = () => {
  errorDiv.classList.add('d-none');
  errorMessage.innerHTML = '';
};

const resetErrorStates = () => {
  isReasonError = false;
  isAmountError = false;
};

const clearError = (event) => {
  const inputField = event.currentTarget;
  if ((inputField.id === 'reason' && isReasonError) || (inputField.id === 'amount' && isAmountError)) {
    inputField.classList.remove('border-danger');
    clearErrorMessage();
    resetErrorStates();
  }
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

submitButton.addEventListener('click', handleSubmit);
reasonInput.addEventListener('input', clearError);
amountInput.addEventListener('input', clearError);
logoutLink.addEventListener('click', logout);
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding
window.addEventListener('pageshow', handlePageshow);